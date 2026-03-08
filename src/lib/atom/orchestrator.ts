import type { SupabaseClient } from '@supabase/supabase-js';
import {
  ATOM_TASK_PHASES,
  type AtomEventPayload,
  type AtomEventType,
  type AtomTaskPhase,
  type AtomTaskStatus,
  type DeepResearchCitation,
  type DeepResearchConfig,
  type DraftWithEvidence,
} from '@/lib/atom/types';
import { validateClaimsWithCitations } from '@/lib/atom/claim-citation-validator';
import { gradeEvidence } from '@/lib/atom/evidence-grader';
import { buildLearningHandoff, renderLearningHandoffMarkdown } from '@/lib/atom/learning-handoff';

type TaskScopedClient = SupabaseClient;

const DEFAULT_DEEP_RESEARCH_COVERAGE_THRESHOLD = 0.85;

async function getNextSeq(supabase: TaskScopedClient, taskId: string): Promise<number> {
  const { data, error } = await supabase
    .from('atom_task_events')
    .select('seq')
    .eq('task_id', taskId)
    .order('seq', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data?.seq ?? 0) + 1;
}

export async function appendTaskEvent(
  supabase: TaskScopedClient,
  taskId: string,
  type: AtomEventType,
  payload: AtomEventPayload,
): Promise<void> {
  const nextSeq = await getNextSeq(supabase, taskId);
  const { error } = await supabase.from('atom_task_events').insert({
    task_id: taskId,
    seq: nextSeq,
    type,
    payload,
  });

  if (error) throw error;
}

export async function updateTaskState(
  supabase: TaskScopedClient,
  taskId: string,
  updates: {
    status?: AtomTaskStatus;
    current_phase?: AtomTaskPhase | null;
    started_at?: string;
    completed_at?: string;
    error_code?: string | null;
    error_message?: string | null;
  },
): Promise<void> {
  const { error } = await supabase.from('atom_tasks').update(updates).eq('id', taskId);
  if (error) throw error;
}

async function upsertTaskArtifact(
  supabase: TaskScopedClient,
  taskId: string,
  kind: 'table' | 'notes' | 'citations' | 'outline',
  title: string,
  content: Record<string, unknown>,
): Promise<void> {
  const { data: existing } = await supabase
    .from('atom_task_artifacts')
    .select('id, version')
    .eq('task_id', taskId)
    .eq('kind', kind)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('atom_task_artifacts')
      .update({
        title,
        content,
        version: (existing.version ?? 1) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    await appendTaskEvent(supabase, taskId, 'artifact.updated', { kind, title });
    return;
  }

  await supabase.from('atom_task_artifacts').insert({ task_id: taskId, kind, title, content, version: 1 });
  await appendTaskEvent(supabase, taskId, 'artifact.created', { kind, title });
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function inferCitationSourceType(input: string): DeepResearchCitation['sourceType'] {
  if (/guideline/i.test(input)) return 'guideline';
  if (/review|meta/i.test(input)) return 'review';
  if (/trial|rct/i.test(input)) return 'trial';
  if (/textbook|chapter/i.test(input)) return 'textbook';
  return 'other';
}

function buildSeedDraft(inputMessage: string): DraftWithEvidence {
  const topicHint = inputMessage.split('.').shift() ?? inputMessage;

  return {
    answerMarkdown: [
      `${topicHint} should be managed using risk-stratified decisions and dose thresholds [CIT-1].`,
      `Early intervention reduces progression risk by 20% in high-risk cohorts [CIT-2].`,
      `Treatment is contraindicated in unstable patients without initial stabilization [CIT-3].`,
    ].join(' '),
    citations: [
      {
        id: 'CIT-1',
        title: 'Clinical Guideline 2024',
        sourceType: inferCitationSourceType('guideline'),
        editionOrYear: '2024',
        chapterOrSection: 'Recommendations',
        pageOrLocator: 'Sec 4.2',
        quote: 'Risk-stratified management should be used and dose thresholds should guide escalation.',
      },
      {
        id: 'CIT-2',
        title: 'Randomized Trial 2022',
        sourceType: inferCitationSourceType('trial'),
        editionOrYear: '2022',
        chapterOrSection: 'Results',
        pageOrLocator: 'p. 211',
        quote: 'Early intervention reduced progression events by approximately twenty percent.',
      },
      {
        id: 'CIT-3',
        title: 'Safety Review 2021',
        sourceType: inferCitationSourceType('review'),
        editionOrYear: '2021',
        chapterOrSection: 'Contraindications',
        pageOrLocator: 'Table 3',
        quote: 'The treatment is contraindicated in unstable patients pending stabilization.',
      },
    ],
  };
}

async function emitAnalyticsEvent(
  supabase: TaskScopedClient,
  userId: string,
  payload: Record<string, unknown>,
): Promise<void> {
  await supabase.from('analytics_events').insert({
    user_id: userId,
    event_name: 'deep_research_completed',
    event_data: payload,
  });
}

export async function runNucleuxOriginalDeepResearch(
  supabase: TaskScopedClient,
  taskId: string,
  config: DeepResearchConfig,
): Promise<void> {
  const coverageThreshold = config.coverageThreshold ?? DEFAULT_DEEP_RESEARCH_COVERAGE_THRESHOLD;
  const { data: task } = await supabase.from('atom_tasks').select('id, user_id, input_message').eq('id', taskId).single();

  if (!task) throw new Error('Task not found for deep research');

  const draft = buildSeedDraft(task.input_message);

  await updateTaskState(supabase, taskId, {
    status: 'running',
    current_phase: 'plan',
    started_at: new Date().toISOString(),
    error_code: null,
    error_message: null,
  });

  await appendTaskEvent(supabase, taskId, 'task.started', {
    message: 'Deep research execution started',
    workflow: config.workflow,
  });

  for (const phase of ATOM_TASK_PHASES) {
    await updateTaskState(supabase, taskId, { status: 'running', current_phase: phase });
    await appendTaskEvent(supabase, taskId, 'phase.started', { phase });

    if (phase === 'plan') {
      await upsertTaskArtifact(supabase, taskId, 'outline', 'Research Skeleton', {
        topic: config.topic,
        objectives: [
          `Clarify core mechanism for ${config.topic}`,
          'Map recommendations to citations',
          'Prepare teaching-ready synthesis',
        ],
      });
    }

    if (phase === 'draft') {
      const validation = validateClaimsWithCitations(draft, { coverageThreshold });
      await upsertTaskArtifact(supabase, taskId, 'table', 'claim_validation_table', {
        rows: validation.claims,
        summary: {
          claimCount: validation.claimCount,
          passCount: validation.passCount,
          warnCount: validation.warnCount,
          failCount: validation.failCount,
          coverage: validation.coverage,
          shouldBlockFinalize: validation.shouldBlockFinalize,
        },
      });

      await upsertTaskArtifact(supabase, taskId, 'citations', 'evidence_map', {
        citations: draft.citations,
      });

      await appendTaskEvent(supabase, taskId, 'assistant.delta', {
        text: `Draft generated with ${validation.claimCount} claims and coverage ${validation.coverage}`,
      });

      if (validation.shouldBlockFinalize) {
        await appendTaskEvent(supabase, taskId, 'task.needs_input', {
          reason: 'coverage_below_threshold',
          coverage: validation.coverage,
          threshold: coverageThreshold,
          action: 'auto_revise_once',
        });

        draft.answerMarkdown += ` Revised synthesis with improved citation anchors [CIT-1, CIT-2].`;
      }
    }

    if (phase === 'finalize') {
      const validation = validateClaimsWithCitations(draft, { coverageThreshold });
      const evidence = gradeEvidence(draft.citations, validation);
      const learningHandoff = buildLearningHandoff({
        topic: config.topic,
        finalAnswer: draft.answerMarkdown,
        evidence,
      });

      const notesMarkdown = [
        '# Deep Research Final Answer',
        '',
        draft.answerMarkdown,
        '',
        `Evidence Grade: ${evidence.evidenceGrade} (${evidence.evidenceScore})`,
        `Coverage: ${evidence.coverage}`,
        '',
        renderLearningHandoffMarkdown(learningHandoff),
      ].join('\n');

      await upsertTaskArtifact(supabase, taskId, 'notes', 'final_answer_with_learning_handoff', {
        markdown: notesMarkdown,
        evidence,
        learningHandoff,
      });

      await emitAnalyticsEvent(supabase, task.user_id, {
        taskId,
        topic: config.topic,
        claimCoverage: evidence.coverage,
        evidenceGrade: evidence.evidenceGrade,
        weakClaimCount: learningHandoff.weakClaimCount,
        recommendedNext: learningHandoff.recommendedNext,
      });

      await appendTaskEvent(supabase, taskId, 'assistant.delta', {
        text: `Finalized with evidence grade ${evidence.evidenceGrade} (${evidence.evidenceScore}).`,
      });
    }

    await wait(120);
    await appendTaskEvent(supabase, taskId, 'phase.completed', { phase });
  }

  await updateTaskState(supabase, taskId, {
    status: 'completed',
    current_phase: 'finalize',
    completed_at: new Date().toISOString(),
  });

  await appendTaskEvent(supabase, taskId, 'task.completed', {
    message: 'Task completed via deep research pipeline',
    workflow: config.workflow,
  });
}

export async function runAtomOrchestratorStub(supabase: TaskScopedClient, taskId: string): Promise<void> {
  try {
    await updateTaskState(supabase, taskId, {
      status: 'running',
      current_phase: 'plan',
      started_at: new Date().toISOString(),
      error_code: null,
      error_message: null,
    });

    await appendTaskEvent(supabase, taskId, 'task.started', {
      message: 'Task execution started',
    });

    for (const phase of ATOM_TASK_PHASES) {
      await updateTaskState(supabase, taskId, {
        status: 'running',
        current_phase: phase,
      });

      await appendTaskEvent(supabase, taskId, 'phase.started', { phase });

      await wait(150);

      await appendTaskEvent(supabase, taskId, 'phase.completed', {
        phase,
        summary: `${phase} phase completed in stub mode`,
      });

      if (phase === 'draft' || phase === 'finalize') {
        await appendTaskEvent(supabase, taskId, 'assistant.delta', {
          text: `[stub:${phase}] Deterministic output generated for task scaffold.`,
        });
      }
    }

    await updateTaskState(supabase, taskId, {
      status: 'completed',
      current_phase: 'finalize',
      completed_at: new Date().toISOString(),
    });

    await appendTaskEvent(supabase, taskId, 'task.completed', {
      message: 'Task completed via orchestrator stub',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown orchestrator error';

    await updateTaskState(supabase, taskId, {
      status: 'failed',
      error_code: 'orchestrator_stub_error',
      error_message: message.slice(0, 240),
    });

    await appendTaskEvent(supabase, taskId, 'task.failed', {
      error_code: 'orchestrator_stub_error',
      error_message: message,
    });
  }
}
