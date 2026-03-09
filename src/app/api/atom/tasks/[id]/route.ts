import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { data: task, error: taskError } = await supabase
      .from('atom_tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (taskError || !task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const [{ data: latestDelta }, { data: artifactSummary }] = await Promise.all([
      supabase
        .from('atom_task_events')
        .select('id, payload, created_at')
        .eq('task_id', id)
        .eq('type', 'assistant.delta')
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('atom_task_artifacts')
        .select('id, kind, title, updated_at')
        .eq('task_id', id)
        .order('updated_at', { ascending: false }),
    ]);

    return NextResponse.json({
      task,
      latestAssistantText:
        latestDelta?.payload && typeof latestDelta.payload === 'object' && 'text' in latestDelta.payload
          ? latestDelta.payload.text
          : null,
      artifacts: artifactSummary ?? [],
    });
  } catch (error) {
    console.error('ATOM task snapshot error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
