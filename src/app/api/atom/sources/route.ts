import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ATOM_SOURCE_LEVELS } from '@/lib/atom/source-catalog';
import { getAvailabilityDisabledReason, type AtomSourceAvailabilityStatus } from '@/lib/atom/source-availability';

export const runtime = 'nodejs';

type SourceRow = {
  id: string;
  title: string;
  short_title: string;
  domain: string;
  level_tags: string[];
  priority: number;
  enabled: boolean;
  sort_order: number;
  metadata: Record<string, unknown> | null;
  availability_status?: AtomSourceAvailabilityStatus | null;
  chapter_count?: number | null;
  chunk_count?: number | null;
  last_synced_at?: string | null;
};

function normalizeAvailability(row: SourceRow) {
  const status = row.availability_status ?? null;
  const disabledReason = status ? getAvailabilityDisabledReason(status) : null;
  return {
    ...row,
    availability_status: status,
    availability_disabled_reason: disabledReason,
    selectable: status ? status === 'indexed_ready' : true,
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const domain = searchParams.get('domain');
    const search = searchParams.get('search')?.trim().toLowerCase();
    const includePending = searchParams.get('include_pending') === 'true' || searchParams.get('includePending') === 'true';

    let data: SourceRow[] | null = null;

    // Primary path: availability-aware query
    {
      let query = supabase
        .from('atom_source_catalog')
        .select('id,title,short_title,domain,level_tags,priority,enabled,sort_order,metadata,availability_status,chapter_count,chunk_count,last_synced_at')
        .eq('enabled', true)
        .order('sort_order', { ascending: true })
        .order('priority', { ascending: false })
        .order('title', { ascending: true });

      if (domain && domain !== 'all') query = query.eq('domain', domain);
      if (level && level !== 'all') query = query.contains('level_tags', [level]);

      const result = await query;
      if (!result.error) {
        data = (result.data ?? []) as SourceRow[];
      } else if (!String(result.error.message ?? '').toLowerCase().includes('availability_status')) {
        console.error('ATOM sources fetch error:', result.error);
        return NextResponse.json({ error: 'Failed to fetch sources' }, { status: 500 });
      }
    }

    // Fallback for pre-migration environments
    if (!data) {
      let fallbackQuery = supabase
        .from('atom_source_catalog')
        .select('id,title,short_title,domain,level_tags,priority,enabled,sort_order,metadata')
        .eq('enabled', true)
        .order('sort_order', { ascending: true })
        .order('priority', { ascending: false })
        .order('title', { ascending: true });

      if (domain && domain !== 'all') fallbackQuery = fallbackQuery.eq('domain', domain);
      if (level && level !== 'all') fallbackQuery = fallbackQuery.contains('level_tags', [level]);

      const fallback = await fallbackQuery;
      if (fallback.error) {
        console.error('ATOM sources fallback fetch error:', fallback.error);
        return NextResponse.json({ error: 'Failed to fetch sources' }, { status: 500 });
      }
      data = (fallback.data ?? []) as SourceRow[];
    }

    let filtered = (data ?? []).map(normalizeAvailability);

    if (!includePending) {
      const selectableOnly = filtered.filter((item) => item.selectable);
      if (selectableOnly.length > 0) {
        filtered = selectableOnly;
      }
    }

    if (search) {
      filtered = filtered.filter((item) => {
        const haystack = `${item.title} ${item.short_title} ${item.domain}`.toLowerCase();
        return haystack.includes(search);
      });
    }

    const grouped = ATOM_SOURCE_LEVELS.map((tag) => ({
      level: tag,
      items: filtered.filter((item) => item.level_tags?.includes(tag)),
    })).filter((group) => group.items.length > 0);

    return NextResponse.json({
      sources: filtered,
      grouped,
      total: filtered.length,
      includePending,
    });
  } catch (error) {
    console.error('ATOM sources API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
