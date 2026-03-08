import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isMissingRelationError } from '@/lib/atom/source-platform-v2';
import { syncVyasaAtomSources } from '@/lib/atom/vyasa-source-sync';

export const runtime = 'nodejs';

function isSyncAuthorized(request: NextRequest): boolean {
  const requiredToken = process.env.ATOM_VYASA_SYNC_TOKEN;
  if (!requiredToken) return true;

  const headerToken = request.headers.get('x-atom-sync-token');
  return headerToken === requiredToken;
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

    if (!isSyncAuthorized(request)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = (await request.json().catch(() => ({}))) as { vyasaPath?: string; dryRun?: boolean };

    const report = await syncVyasaAtomSources(supabase, {
      vyasaLibraryPath: body.vyasaPath,
      dryRun: body.dryRun,
    });

    return NextResponse.json({ ok: report.ok, report });
  } catch (error) {
    if (isMissingRelationError(error, 'source_books') || isMissingRelationError(error, 'source_book_status')) {
      return NextResponse.json(
        {
          error: 'ATOM Source Platform V2 tables are not available yet. Run migrations first.',
          code: 'ATOM_SOURCE_V2_TABLES_MISSING',
        },
        { status: 503 }
      );
    }

    console.error('ATOM Vyasa sync API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
