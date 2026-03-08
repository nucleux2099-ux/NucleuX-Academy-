import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { appendTaskEvent, runAtomOrchestratorStub, updateTaskState } from '@/lib/atom/orchestrator';
import { ATOM_CONTROL_ACTIONS, type AtomTaskControlRequest } from '@/lib/atom/types';

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
      void runAtomOrchestratorStub(supabase, taskId);
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
