import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ATOM_SOURCE_LEVELS } from '@/lib/atom/source-catalog';

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
};

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

    let query = supabase
      .from('atom_source_catalog')
      .select('id,title,short_title,domain,level_tags,priority,enabled,sort_order,metadata')
      .eq('enabled', true)
      .order('sort_order', { ascending: true })
      .order('priority', { ascending: false })
      .order('title', { ascending: true });

    if (domain && domain !== 'all') {
      query = query.eq('domain', domain);
    }

    if (level && level !== 'all') {
      query = query.contains('level_tags', [level]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('ATOM sources fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch sources' }, { status: 500 });
    }

    const rows = (data ?? []) as SourceRow[];
    const filtered = search
      ? rows.filter((item) => {
          const haystack = `${item.title} ${item.short_title} ${item.domain}`.toLowerCase();
          return haystack.includes(search);
        })
      : rows;

    const grouped = ATOM_SOURCE_LEVELS.map((tag) => ({
      level: tag,
      items: filtered.filter((item) => item.level_tags?.includes(tag)),
    })).filter((group) => group.items.length > 0);

    return NextResponse.json({
      sources: filtered,
      grouped,
      total: filtered.length,
    });
  } catch (error) {
    console.error('ATOM sources API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
