import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { runAtomOrchestratorStub, appendTaskEvent } from '@/lib/atom/orchestrator';
import { type CreateAtomTaskRequest, ATOM_TASK_MODES } from '@/lib/atom/types';

export const runtime = 'nodejs';

function isValidMode(mode: string): boolean {
  return ATOM_TASK_MODES.includes(mode as (typeof ATOM_TASK_MODES)[number]);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as CreateAtomTaskRequest;
    const message = body?.message?.trim();
    const mode = body?.mode ?? 'task';

    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    if (!isValidMode(mode)) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }

    const sourceSnapshot = {
      sourceSelection: body.sourceSelection ?? {},
      room: body.room ?? null,
    };

    const { data: task, error: insertError } = await supabase
      .from('atom_tasks')
      .insert({
        user_id: user.id,
        status: 'queued',
        mode,
        title: message.slice(0, 120),
        input_message: message,
        source_snapshot: sourceSnapshot,
      })
      .select('id, status')
      .single();

    if (insertError || !task) {
      console.error('Failed to create atom task', insertError);
      return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }

    await appendTaskEvent(supabase, task.id, 'task.created', {
      mode,
      message,
      sourceSnapshot,
    });

    void runAtomOrchestratorStub(supabase, task.id);

    return NextResponse.json({
      taskId: task.id,
      status: task.status,
      eventsUrl: `/api/atom/tasks/${task.id}/events`,
    });
  } catch (error) {
    console.error('ATOM create task error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
