import { NextRequest, NextResponse } from 'next/server';
import {
  normalizeQuickStartFormInput,
  validateQuickStartFormInput,
  type QuickStartFormInput,
  type QuickStartMode,
} from '@/lib/atom/quick-start-schema';
import { createDeepResearchPipelineScaffold } from '@/lib/atom/deep-research/pipeline';
import { createGuidedDeepDiveSessionState } from '@/lib/atom/guided-deep-dive/session-state';
import { putGuidedDeepDiveSession } from '@/lib/atom/guided-deep-dive/session-store';
import { createGddTelemetryEvent } from '@/lib/atom/guided-deep-dive/telemetry';
import { createLearningCycleHooksScaffold } from '@/lib/atom/learning-cycle/hooks';
import { isAtomV3GddEnabled, isFeatureEnabled } from '@/lib/features/flags';
import { createClient } from '@/lib/supabase/server';
import { appendTaskEvent, runNucleuxOriginalDeepResearch } from '@/lib/atom/orchestrator';
import { resolveAtomRoomProfile } from '@/lib/atom/room-profiles';

type LaunchRequestContext = QuickStartFormInput & {
  roomId?: string;
};

type LaunchResponse = {
  workflow: string;
  launchPath: string;
  message: string;
  taskId?: string;
  eventsUrl?: string;
  scaffolds?: {
    deepResearch?: Awaited<ReturnType<ReturnType<typeof createDeepResearchPipelineScaffold>['createRun']>>;
    guidedDeepDiveSession?: ReturnType<typeof createGuidedDeepDiveSessionState>;
    learningCycle?: Awaited<ReturnType<ReturnType<typeof createLearningCycleHooksScaffold>['onPhaseCheckpoint']>>;
  };
};

function toQuery(payload: QuickStartFormInput): string {
  const params = new URLSearchParams({
    mode: payload.mode,
    topic: payload.topic,
    level: payload.level,
    timeAvailable: String(payload.timeAvailable),
    goal: payload.goal,
  });

  if (payload.advanced?.preferredFormat) params.set('preferredFormat', payload.advanced.preferredFormat);
  if (typeof payload.advanced?.includeReferences === 'boolean') params.set('includeReferences', String(payload.advanced.includeReferences));
  if (payload.advanced?.clinicalContext) params.set('clinicalContext', payload.advanced.clinicalContext);

  return params.toString();
}

const MODE_HANDLERS: Record<QuickStartMode, (payload: LaunchRequestContext) => Promise<LaunchResponse>> = {
  ppt: async (payload) => ({
    workflow: 'ppt',
    launchPath: `/chat?${toQuery(payload)}`,
    message: 'PPT workflow prepared. Open chat to generate your deck outline.',
  }),
  'nucleux-original': async (payload) => {
    const response: LaunchResponse = {
      workflow: 'nucleux-original',
      launchPath: `/chat?${toQuery(payload)}`,
      message: 'NucleuX Original workflow launched.',
    };

    if (!isFeatureEnabled('trackADeepResearchScaffold')) {
      return response;
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const compiledMessage = [payload.goal, payload.topic, payload.advanced?.clinicalContext].filter(Boolean).join(' | ');

    const roomProfile = resolveAtomRoomProfile(payload.roomId);

    const sourceSnapshot = {
      sourceSelection: {
        level: payload.level,
        preset: roomProfile.sourcePreset,
        bookIds: [],
        workflow: 'nucleux-original-deep-research',
        includeReferences: payload.advanced?.includeReferences ?? true,
        topic: payload.topic,
        clinicalContext: payload.advanced?.clinicalContext,
      },
      room: roomProfile.roomId,
      roomProfile,
      orchestrationMetadata: {
        roomPersona: roomProfile.personaName,
        roomDepthDefault: roomProfile.depthDefault,
      },
    };

    const { data: task, error: insertError } = await supabase
      .from('atom_tasks')
      .insert({
        user_id: user.id,
        status: 'queued',
        mode: 'task',
        title: compiledMessage.slice(0, 120),
        input_message: compiledMessage,
        source_snapshot: sourceSnapshot,
      })
      .select('id')
      .single();

    if (insertError || !task) {
      throw new Error('Failed to create task');
    }

    await appendTaskEvent(supabase, task.id, 'task.created', {
      mode: 'task',
      message: compiledMessage,
      sourceSnapshot,
    });

    void runNucleuxOriginalDeepResearch(supabase, task.id, {
      workflow: 'nucleux-original-deep-research',
      topic: payload.topic,
      level: payload.level,
      goal: payload.goal,
      includeReferences: payload.advanced?.includeReferences ?? true,
      clinicalContext: payload.advanced?.clinicalContext,
      roomProfile,
      orchestrationMetadata: {
        roomPersona: roomProfile.personaName,
        roomDepthDefault: roomProfile.depthDefault,
      },
    });

    const deepResearchPipeline = createDeepResearchPipelineScaffold();
    const deepResearch = await deepResearchPipeline.createRun({
      topic: payload.topic,
      learnerLevel: payload.level,
      goal: payload.goal,
      context: payload.advanced?.clinicalContext,
    });

    response.taskId = task.id;
    response.eventsUrl = `/api/atom/tasks/${task.id}/events`;
    response.launchPath = `/chat?mode=nucleux-original&taskId=${task.id}`;
    response.message = 'NucleuX Original Deep Research launched.';
    response.scaffolds = {
      ...response.scaffolds,
      deepResearch,
    };

    return response;
  },
  mcq: async (payload) => ({
    workflow: 'mcq',
    launchPath: `/mcqs?${toQuery(payload)}`,
    message: 'MCQ workflow launched.',
  }),
  flashcards: async (payload) => ({
    workflow: 'flashcards',
    launchPath: `/chat?${toQuery(payload)}`,
    message: 'Flashcards workflow launched.',
  }),
  'excel-analysis': async (payload) => ({
    workflow: 'excel-analysis',
    launchPath: `/chat?${toQuery(payload)}`,
    message: 'Excel analysis workflow launched.',
  }),
  'guided-deep-dive': async (payload) => {
    const response: LaunchResponse = {
      workflow: 'guided-deep-dive',
      launchPath: `/chat?${toQuery(payload)}`,
      message: 'Guided deep dive workflow launched.',
    };

    if (!isAtomV3GddEnabled()) {
      response.message = 'Guided deep dive is disabled. Falling back to chat workflow.';
      return response;
    }

    if (isFeatureEnabled('trackBGuidedDeepDiveScaffold')) {
      const session = createGuidedDeepDiveSessionState({
        topic: payload.topic,
        level: payload.level,
        goal: payload.goal,
      });

      const startEvent = createGddTelemetryEvent({
        event: 'gdd_session_started',
        sessionId: session.sessionId,
        topic: session.topic,
        level: session.level,
        currentStep: session.currentStep,
        payload: { goal: session.goal, source: 'atom-v3-launch' },
      });

      putGuidedDeepDiveSession(session, [startEvent]);

      response.launchPath = `/atom-v3/gdd?sessionId=${session.sessionId}`;
      response.scaffolds = {
        ...response.scaffolds,
        guidedDeepDiveSession: session,
      };
    }

    if (isFeatureEnabled('learningCycleIntegrationHooks')) {
      const learningCycleHooks = createLearningCycleHooksScaffold();
      const learningCycle = await learningCycleHooks.onPhaseCheckpoint({
        phase: 'plan',
        topic: payload.topic,
        source: 'atom-v3-launch-guided-deep-dive',
        metadata: {
          level: payload.level,
          timeAvailable: payload.timeAvailable,
        },
      });

      response.scaffolds = {
        ...response.scaffolds,
        learningCycle,
      };
    }

    return response;
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const normalized = normalizeQuickStartFormInput(body);
    const validated = validateQuickStartFormInput(normalized);

    if (!validated.ok) {
      return NextResponse.json({ error: 'Invalid quick start input', details: validated.errors }, { status: 400 });
    }

    const roomId = typeof body?.roomId === 'string' ? body.roomId : undefined;
    const roomProfile = resolveAtomRoomProfile(roomId);
    const launchInput: LaunchRequestContext = {
      ...validated.data,
      roomId: roomProfile.roomId,
    };

    const response = await MODE_HANDLERS[validated.data.mode](launchInput);
    return NextResponse.json({
      payload: launchInput,
      roomProfile,
      ...response,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to launch ATOM v3 workflow',
      },
      { status: 500 },
    );
  }
}
