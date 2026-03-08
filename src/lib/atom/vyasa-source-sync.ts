import fs from 'node:fs/promises';
import path from 'node:path';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ATOM_SOURCE_CATALOG } from '@/lib/atom/source-catalog';
import { computeSelectable, isMissingRelationError } from '@/lib/atom/source-platform-v2';

export const DEFAULT_VYASA_LIBRARY_PATH = '/Users/adityachandrabhatla/clawd-vyasa/data/output';

const CANDIDATE_VYASA_LIBRARY_PATHS = [
  process.env.VYASA_ATOM_LIBRARY_PATH,
  DEFAULT_VYASA_LIBRARY_PATH,
  '/Users/adityachandrabhatla/clawd-vyasa/data/published/atom-source-library',
  '/Users/adityachandrabhatla/clawd-vyasa/data/published',
].filter(Boolean) as string[];

type VyasaRawEntry = {
  sourceId?: string | null;
  title: string;
  shortTitle?: string | null;
  specialty?: string | null;
  domain?: string | null;
  levelTags?: string[];
  readinessState?: string | null;
  qcPassed?: boolean | null;
  published?: boolean | null;
  publishState?: string | null;
  chapterCount?: number | null;
  imageCount?: number | null;
  chunkCount?: number | null;
  verifiedAt?: string | null;
  manifestPath?: string | null;
  raw?: Record<string, unknown>;
};

export type VyasaSyncReport = {
  ok: boolean;
  libraryRoot: string | null;
  discovery: {
    libraryCatalogPath: string | null;
    libraryStatsPath: string | null;
    verificationDashboardPath: string | null;
    manifestCount: number;
  };
  counts: {
    discovered: number;
    imported: number;
    selectable: number;
    published: number;
    skippedUnmapped: number;
  };
  skipped: Array<{ title: string; reason: string }>;
};

function normalize(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function asBool(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  if (typeof value === 'string') {
    const v = value.toLowerCase().trim();
    if (['true', 'yes', '1', 'passed', 'pass', 'published', 'active', 'ready'].includes(v)) return true;
    if (['false', 'no', '0', 'failed', 'fail', 'inactive'].includes(v)) return false;
  }
  return null;
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath: string): Promise<Record<string, unknown> | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

async function listManifests(root: string): Promise<string[]> {
  const manifests: string[] = [];
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    let entries: Array<import('node:fs').Dirent> = [];
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
        stack.push(full);
      } else if (entry.isFile() && entry.name === 'textbook_index.json') {
        manifests.push(full);
      }
    }
  }
  return manifests;
}

function toRawEntry(input: Record<string, unknown>, manifestPath?: string): VyasaRawEntry | null {
  const title =
    (typeof input.title === 'string' && input.title) ||
    (typeof input.name === 'string' && input.name) ||
    (typeof input.textbook === 'string' && input.textbook) ||
    null;

  if (!title) return null;

  return {
    sourceId: (input.source_id as string) ?? (input.sourceId as string) ?? (input.id as string) ?? null,
    title,
    shortTitle: (input.short_title as string) ?? (input.shortTitle as string) ?? null,
    specialty: (input.specialty as string) ?? null,
    domain: (input.domain as string) ?? null,
    levelTags: Array.isArray(input.level_tags)
      ? (input.level_tags.filter((v): v is string => typeof v === 'string') as string[])
      : Array.isArray(input.levelTags)
        ? (input.levelTags.filter((v): v is string => typeof v === 'string') as string[])
        : undefined,
    readinessState: (input.readiness_state as string) ?? (input.readinessState as string) ?? (input.state as string) ?? null,
    qcPassed: asBool(input.qc_passed ?? input.qcPassed ?? input.qc_status),
    published: asBool(input.published ?? input.is_published ?? input.selectable),
    publishState: (input.publish_state as string) ?? (input.publishState as string) ?? (input.rollout_state as string) ?? null,
    chapterCount: asNumber(input.chapter_count ?? input.chapters ?? input.total_chapters),
    imageCount: asNumber(input.image_count ?? input.images ?? input.total_images),
    chunkCount: asNumber(input.chunk_count ?? input.chunks),
    verifiedAt: (input.verified_at as string) ?? (input.updated_at as string) ?? (input.generated as string) ?? null,
    manifestPath: manifestPath ?? null,
    raw: input,
  };
}

async function discoverVyasaLibrary(rootOverride?: string): Promise<{
  root: string | null;
  libraryCatalogPath: string | null;
  libraryStatsPath: string | null;
  verificationDashboardPath: string | null;
  entries: VyasaRawEntry[];
  manifestPaths: string[];
}> {
  const roots = rootOverride ? [rootOverride] : CANDIDATE_VYASA_LIBRARY_PATHS;

  for (const root of roots) {
    if (!(await exists(root))) continue;

    const libraryCatalogPath = path.join(root, 'library_catalog.json');
    const libraryStatsPath = path.join(root, 'library_stats.json');
    const verificationDashboardPath = path.join(root, 'verification_dashboard.json');

    const libraryCatalog = (await exists(libraryCatalogPath)) ? await readJson(libraryCatalogPath) : null;

    if (libraryCatalog) {
      const listCandidate = [libraryCatalog.books, libraryCatalog.sources, libraryCatalog.items, libraryCatalog.catalog].find(Array.isArray);
      const rows = (Array.isArray(listCandidate) ? listCandidate : []) as Array<Record<string, unknown>>;
      const entries = rows.map((row) => toRawEntry(row)).filter((v): v is VyasaRawEntry => Boolean(v));
      return {
        root,
        libraryCatalogPath,
        libraryStatsPath: (await exists(libraryStatsPath)) ? libraryStatsPath : null,
        verificationDashboardPath: (await exists(verificationDashboardPath)) ? verificationDashboardPath : null,
        entries,
        manifestPaths: [],
      };
    }

    const manifestPaths = await listManifests(root);
    if (manifestPaths.length > 0) {
      const entries: VyasaRawEntry[] = [];
      for (const manifestPath of manifestPaths) {
        const json = await readJson(manifestPath);
        if (!json) continue;

        const textbook = (json.textbook && typeof json.textbook === 'object') ? (json.textbook as Record<string, unknown>) : null;
        const textbookName =
          (typeof json.textbook === 'string' ? json.textbook : null) ||
          (textbook && typeof textbook.name === 'string' ? textbook.name : null) ||
          path.basename(path.dirname(manifestPath));

        const chapters = asNumber((textbook?.chapters ?? json.total_chapters) as unknown);
        const images = asNumber((textbook?.total_images ?? json.total_images) as unknown);

        entries.push({
          sourceId: null,
          title: textbookName,
          shortTitle: textbook && typeof textbook.short_name === 'string' ? textbook.short_name : null,
          chapterCount: chapters,
          imageCount: images,
          chunkCount: null,
          readinessState: chapters && chapters > 0 ? 'indexed_ready' : 'cataloged',
          qcPassed: true,
          published: true,
          publishState: 'active',
          verifiedAt: (json.generated as string) ?? null,
          manifestPath,
          raw: json,
        });
      }

      return {
        root,
        libraryCatalogPath: null,
        libraryStatsPath: (await exists(libraryStatsPath)) ? libraryStatsPath : null,
        verificationDashboardPath: (await exists(verificationDashboardPath)) ? verificationDashboardPath : null,
        entries,
        manifestPaths,
      };
    }
  }

  return {
    root: null,
    libraryCatalogPath: null,
    libraryStatsPath: null,
    verificationDashboardPath: null,
    entries: [],
    manifestPaths: [],
  };
}

function scoreMatch(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 120;
  if (a.includes(b) || b.includes(a)) return 90;
  const ta = a.split(' ');
  const tb = b.split(' ');
  const overlap = ta.filter((token) => token.length > 2 && tb.includes(token)).length;
  return overlap * 12;
}

function resolveCatalogSource(entry: VyasaRawEntry) {
  if (entry.sourceId) {
    const direct = ATOM_SOURCE_CATALOG.find((item) => item.id === entry.sourceId);
    if (direct) return direct;
  }

  const candidates = [
    entry.title,
    entry.shortTitle ?? '',
    path.basename(path.dirname(entry.manifestPath ?? '')),
    entry.sourceId ?? '',
  ].map(normalize);

  let best: { id: string; score: number } | null = null;
  for (const item of ATOM_SOURCE_CATALOG) {
    const itemKeys = [item.id, item.title, item.shortTitle].map(normalize);
    for (const c of candidates) {
      for (const k of itemKeys) {
        const s = scoreMatch(c, k);
        if (!best || s > best.score) best = { id: item.id, score: s };
      }
    }
  }

  if (!best || best.score < 35) return null;
  return ATOM_SOURCE_CATALOG.find((item) => item.id === best.id) ?? null;
}

function deriveStates(entry: VyasaRawEntry) {
  const readiness = (entry.readinessState ?? '').toLowerCase();
  const publishState = (entry.publishState ?? '').toLowerCase();

  const qcPassed =
    entry.qcPassed ??
    (readiness.includes('qc_passed') || readiness.includes('indexed_ready') || readiness.includes('ready'));
  const indexedReady =
    readiness.includes('indexed_ready') ||
    readiness.includes('ready') ||
    publishState === 'active' ||
    publishState === 'published' ||
    (entry.chunkCount ?? 0) > 0;

  const published = entry.published ?? (publishState === 'active' || publishState === 'published');
  const rolloutState = published ? 'active' : 'inactive';

  const lifecycleState = indexedReady
    ? 'indexed_ready'
    : qcPassed
      ? 'qc_passed'
      : readiness.includes('failed')
        ? 'qc_failed'
        : readiness.includes('pending')
          ? 'qc_pending'
          : 'cataloged';

  const selectable = computeSelectable({ indexedReady, qcPassed, rolloutState });

  const availabilityReason = selectable
    ? null
    : !qcPassed
      ? 'QC has not passed'
      : !indexedReady
        ? 'Ingestion/index is not ready'
        : `Rollout state is ${rolloutState}`;

  return { qcPassed, indexedReady, published, rolloutState, lifecycleState, selectable, availabilityReason };
}

export async function syncVyasaAtomSources(
  supabase: SupabaseClient,
  options: { vyasaLibraryPath?: string; dryRun?: boolean } = {}
): Promise<VyasaSyncReport> {
  const discovered = await discoverVyasaLibrary(options.vyasaLibraryPath);

  if (!discovered.root) {
    return {
      ok: false,
      libraryRoot: null,
      discovery: {
        libraryCatalogPath: null,
        libraryStatsPath: null,
        verificationDashboardPath: null,
        manifestCount: 0,
      },
      counts: { discovered: 0, imported: 0, selectable: 0, published: 0, skippedUnmapped: 0 },
      skipped: [{ title: 'Vyasa library root', reason: 'No library path available; fallback mode only' }],
    };
  }

  let imported = 0;
  let selectable = 0;
  let published = 0;
  let skippedUnmapped = 0;
  const skipped: Array<{ title: string; reason: string }> = [];

  for (const raw of discovered.entries) {
    const mapped = resolveCatalogSource(raw);
    if (!mapped) {
      skippedUnmapped += 1;
      skipped.push({ title: raw.title, reason: 'No atom_source_catalog mapping' });
      continue;
    }

    const states = deriveStates(raw);
    const metadata = {
      vyasa: {
        source: 'vyasa',
        manifest_path: raw.manifestPath,
        readiness_state: raw.readinessState,
        publish_state: raw.publishState,
        published: states.published,
      },
      chapter_count: raw.chapterCount,
      image_count: raw.imageCount,
      chunk_count: raw.chunkCount,
      last_verified_at: raw.verifiedAt,
      raw: raw.raw ?? {},
    };

    if (!options.dryRun) {
      const upsertBook = await supabase
        .from('source_books')
        .upsert(
          {
            source_id: mapped.id,
            title: mapped.title,
            domain: raw.specialty ?? raw.domain ?? mapped.domain,
            level_tags: raw.levelTags && raw.levelTags.length > 0 ? raw.levelTags : mapped.levelTags,
            lifecycle_state: states.lifecycleState,
            rollout_state: states.rolloutState,
            validated_at: raw.verifiedAt,
            metadata,
          },
          { onConflict: 'source_id' }
        )
        .select('id')
        .single();

      if (upsertBook.error || !upsertBook.data) {
        if (isMissingRelationError(upsertBook.error, 'source_books')) {
          throw new Error('ATOM Source Platform V2 tables are not available yet. Run migrations first.');
        }
        throw upsertBook.error ?? new Error(`Failed upserting source book for ${mapped.id}`);
      }

      const upsertStatus = await supabase.from('source_book_status').upsert(
        {
          source_book_id: upsertBook.data.id,
          source_id: mapped.id,
          title: mapped.title,
          domain: raw.specialty ?? raw.domain ?? mapped.domain,
          level_tags: raw.levelTags && raw.levelTags.length > 0 ? raw.levelTags : mapped.levelTags,
          lifecycle_state: states.lifecycleState,
          qc_passed: states.qcPassed,
          indexed_ready: states.indexedReady,
          rollout_state: states.rolloutState,
          availability_reason: states.availabilityReason,
          validated_at: raw.verifiedAt,
          chunk_count: raw.chunkCount,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'source_book_id' }
      );

      if (upsertStatus.error) {
        if (isMissingRelationError(upsertStatus.error, 'source_book_status')) {
          throw new Error('ATOM Source Platform V2 tables are not available yet. Run migrations first.');
        }
        throw upsertStatus.error;
      }
    }

    imported += 1;
    if (states.selectable) selectable += 1;
    if (states.published) published += 1;
  }

  return {
    ok: true,
    libraryRoot: discovered.root,
    discovery: {
      libraryCatalogPath: discovered.libraryCatalogPath,
      libraryStatsPath: discovered.libraryStatsPath,
      verificationDashboardPath: discovered.verificationDashboardPath,
      manifestCount: discovered.manifestPaths.length,
    },
    counts: {
      discovered: discovered.entries.length,
      imported,
      selectable,
      published,
      skippedUnmapped,
    },
    skipped,
  };
}
