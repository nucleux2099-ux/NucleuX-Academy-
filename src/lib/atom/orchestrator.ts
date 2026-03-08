import type { SupabaseClient } from '@supabase/supabase-js';
import {
  ATOM_TASK_PHASES,
  type AtomEventPayload,
  type AtomEventType,
  type AtomTaskPhase,
  type AtomTaskStatus,
} from '@/lib/atom/types';

type TaskScopedClient = SupabaseClient;

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

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
