import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSourceStatusSummary, isMissingRelationError } from '@/lib/atom/source-platform-v2';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const summary = await getSourceStatusSummary(supabase);

    return NextResponse.json({
      ...summary,
      projection: 'source_book_status',
    });
  } catch (error) {
    if (isMissingRelationError(error, 'source_book_status')) {
      return NextResponse.json({ total: 0, selectable: 0, byLifecycle: {}, byRollout: {}, projection: 'atom_source_catalog' });
    }

    console.error('ATOM source status-summary API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
