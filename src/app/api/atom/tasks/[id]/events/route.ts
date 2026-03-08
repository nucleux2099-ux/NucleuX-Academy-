import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { AtomTaskEventEnvelope } from '@/lib/atom/types';

export const runtime = 'nodejs';

type TaskEventRow = {
  id: number;
  task_id: string;
  type: AtomTaskEventEnvelope['type'];
  payload: Record<string, unknown>;
  created_at: string;
};

function toSseEvent(row: TaskEventRow): string {
  const envelope: AtomTaskEventEnvelope = {
    eventId: row.id,
    taskId: row.task_id,
    type: row.type,
    ts: row.created_at,
    payload: row.payload,
  };

  return `id: ${row.id}\nevent: ${row.type}\ndata: ${JSON.stringify(envelope)}\n\n`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { id: taskId } = await params;
  const sinceParam = new URL(request.url).searchParams.get('since');
  const sinceId = sinceParam ? Number.parseInt(sinceParam, 10) : 0;

  let lastSeenId = Number.isFinite(sinceId) ? sinceId : 0;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder();
      let interval: ReturnType<typeof setInterval> | null = null;

      const send = (chunk: string) => controller.enqueue(encoder.encode(chunk));

      const flushEvents = async () => {
        const { data, error } = await supabase
          .from('atom_task_events')
          .select('id, task_id, type, payload, created_at')
          .eq('task_id', taskId)
          .gt('id', lastSeenId)
          .order('id', { ascending: true })
          .limit(100);

        if (error) {
          send(`event: error\ndata: ${JSON.stringify({ message: 'event_stream_error' })}\n\n`);
          return;
        }

        for (const row of (data ?? []) as TaskEventRow[]) {
          send(toSseEvent(row));
          lastSeenId = row.id;
        }
      };

      const bootstrap = async () => {
        send(': connected\n\n');
        await flushEvents();

        interval = setInterval(async () => {
          if (request.signal.aborted) {
            if (interval) clearInterval(interval);
            controller.close();
            return;
          }

          await flushEvents();
          send(': ping\n\n');
        }, 15000);
      };

      void bootstrap();

      request.signal.addEventListener('abort', () => {
        if (interval) clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
