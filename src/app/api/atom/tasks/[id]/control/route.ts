import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { appendTaskEvent, runAtomOrchestratorStub, runNucleuxOriginalDeepResearch, updateTaskState } from '@/lib/atom/orchestrator';
import { ATOM_CONTROL_ACTIONS, type AtomTaskControlRequest } from '@/lib/atom/types';
import { isFeatureEnabled } from '@/lib/features/flags';

function isControlAction(action: string): boolean {
  return ATOM_CONTROL_ACTIONS.includes(action as (typeof ATOM_CONTROL_ACTIONS)[number]);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: taskId } = await params;
    const body = (await request.json()) as AtomTaskControlRequest;

    if (!body?.action || !isControlAction(body.action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (body.action === 'stop') {
      await updateTaskState(supabase, taskId, {
        status: 'cancelled',
        completed_at: new Date().toISOString(),
      });
      await appendTaskEvent(supabase, taskId, 'task.cancelled', { reason: 'user_requested_stop' });
      return NextResponse.json({ taskId, action: body.action, status: 'cancelled' });
    }

    if (body.action === 'retry' || body.action === 'continue') {
      await appendTaskEvent(supabase, taskId, 'task.started', {
        message: `Task ${body.action} requested`,
      });

      const { data: task } = await supabase
        .from('atom_tasks')
        .select('source_snapshot, input_message')
        .eq('id', taskId)
        .single();

      const sourceSelection = (task?.source_snapshot as { sourceSelection?: Record<string, unknown> } | null)?.sourceSelection;
      const workflow = typeof sourceSelection?.workflow === 'string' ? sourceSelection.workflow : '';

      if (workflow === 'nucleux-original-deep-research' && isFeatureEnabled('trackADeepResearchScaffold')) {
        void runNucleuxOriginalDeepResearch(supabase, taskId, {
          workflow: 'nucleux-original-deep-research',
          topic: String(sourceSelection?.topic ?? task?.input_message ?? 'Deep Research'),
          level: String(sourceSelection?.level ?? 'resident'),
          goal: String(task?.input_message ?? 'Retry task'),
          includeReferences: Boolean(sourceSelection?.includeReferences),
          clinicalContext: typeof sourceSelection?.clinicalContext === 'string' ? sourceSelection.clinicalContext : undefined,
        });
      } else {
        void runAtomOrchestratorStub(supabase, taskId);
      }

      return NextResponse.json({ taskId, action: body.action, status: 'running' });
    }

    // branch is intentionally scaffold-only in phase 1
    await appendTaskEvent(supabase, taskId, 'task.needs_input', {
      message: 'Branching stub acknowledged. Child task creation will be added in next phase.',
    });

    return NextResponse.json({
      taskId,
      action: body.action,
      status: 'needs_input',
      note: 'branch stub acknowledged',
    });
  } catch (error) {
    console.error('ATOM task control error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
