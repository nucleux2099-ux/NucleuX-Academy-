import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { importSourceQcRun, isMissingRelationError, type QcImportPayload } from '@/lib/atom/source-platform-v2';

export const runtime = 'nodejs';

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

    const payload = (await request.json()) as QcImportPayload;
    const result = await importSourceQcRun(supabase, user.id, payload);

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    if (isMissingRelationError(error, 'source_books')) {
      return NextResponse.json(
        {
          error: 'ATOM Source Platform V2 tables are not available yet. Run migrations first.',
          code: 'ATOM_SOURCE_V2_TABLES_MISSING',
        },
        { status: 503 }
      );
    }

    console.error('ATOM QC import API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
