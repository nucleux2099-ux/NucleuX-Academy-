import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ATOM_SOURCE_LEVELS } from '@/lib/atom/source-catalog';
import { fetchSourceStatusProjection } from '@/lib/atom/source-platform-v2';
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
    availability: status === 'indexed_ready' ? 'available' : 'unavailable',
    availability_reason: disabledReason,
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

    // V2 path: status projection
    try {
      const projection = await fetchSourceStatusProjection(supabase, { domain, level });
      if (projection) {
        const sourceBookIds = projection.map((row) => row.source_book_id);
        const metadataByBookId = new Map<string, Record<string, unknown>>();

        if (sourceBookIds.length > 0) {
          const booksResult = await supabase.from('source_books').select('id,metadata').in('id', sourceBookIds);
          if (!booksResult.error) {
            for (const book of booksResult.data ?? []) {
              metadataByBookId.set(book.id as string, (book.metadata as Record<string, unknown> | null) ?? {});
            }
          }
        }

        let items = projection
          .map((row) => {
            const sourceMetadata = metadataByBookId.get(row.source_book_id) ?? {};
            const chapterCount = typeof sourceMetadata.chapter_count === 'number' ? sourceMetadata.chapter_count : null;
            const imageCount = typeof sourceMetadata.image_count === 'number' ? sourceMetadata.image_count : null;

            return {
              id: row.source_id ?? row.source_book_id,
              source_book_id: row.source_book_id,
              title: row.title,
              short_title: row.title,
              domain: row.domain ?? 'General',
              level_tags: row.level_tags ?? [],
              priority: 100,
              enabled: true,
              sort_order: 100,
              metadata: {
                lifecycle_state: row.lifecycle_state,
                pipeline_version: row.pipeline_version,
                ocr_model_version: row.ocr_model_version,
                prompt_version: row.prompt_version,
                active_index_version: row.active_index_version,
                candidate_index_version: row.candidate_index_version,
                validated_at: row.validated_at,
                revalidate_after: row.revalidate_after,
                updated_at: row.updated_at,
                image_count: imageCount,
                ...sourceMetadata,
              },
              chapter_count: chapterCount,
              chunk_count: row.chunk_count,
              last_synced_at: row.updated_at,
              availability_status: row.selectable ? 'indexed_ready' : 'md_ready_not_ingested',
              availability: row.selectable ? 'available' : 'unavailable',
              availability_reason: row.availability_reason,
              selectable: row.selectable,
              lifecycle_state: row.lifecycle_state,
              rollout_state: row.rollout_state,
              qc_passed: row.qc_passed,
              indexed_ready: row.indexed_ready,
            };
          })
          .sort((a, b) => a.title.localeCompare(b.title));

        if (!includePending) {
          const selectableOnly = items.filter((item) => item.selectable);
          if (selectableOnly.length > 0) {
            items = selectableOnly;
          }
        }

        if (search) {
          items = items.filter((item) => `${item.title} ${item.short_title} ${item.domain}`.toLowerCase().includes(search));
        }

        const grouped = ATOM_SOURCE_LEVELS.map((tag) => ({
          level: tag,
          items: items.filter((item) => item.level_tags?.includes(tag)),
        })).filter((group) => group.items.length > 0);

        return NextResponse.json({
          sources: items,
          grouped,
          total: items.length,
          includePending,
          projection: 'source_book_status',
        });
      }
    } catch (projectionError) {
      console.warn('ATOM V2 projection fetch failed, falling back to atom_source_catalog', projectionError);
    }

    // Fallback (pre-V2): atom_source_catalog
    let data: SourceRow[] | null = null;

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
      projection: 'atom_source_catalog',
    });
  } catch (error) {
    console.error('ATOM sources API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
