import fs from 'node:fs/promises';
import path from 'node:path';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ATOM_SOURCE_CATALOG } from '@/lib/atom/source-catalog';
import { computeSelectable, isMissingRelationError } from '@/lib/atom/source-platform-v2';

export const DEFAULT_VYASA_LIBRARY_PATH = '/Users/adityachandrabhatla/clawd-vyasa/data/output';
const DEFAULT_QC_PASS_THRESHOLD = 80;

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
  status?: string | null;
  readinessState?: string | null;
  lifecycleState?: string | null;
  qcPassed?: boolean | null;
  qcScore?: number | null;
  indexedReady?: boolean | null;
  published?: boolean | null;
  publishState?: string | null;
  rolloutState?: string | null;
  syncPriority?: string | null;
  reason?: string | null;
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
    syncCandidatesPath: string | null;
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
    skipped: number;
    skippedUnmapped: number;
  };
  skippedByReason: Record<string, number>;
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

function getQcPassThreshold(): number {
  const configured = asNumber(process.env.VYASA_SYNC_QC_PASS_THRESHOLD ?? process.env.ATOM_SYNC_QC_PASS_THRESHOLD);
  return configured ?? DEFAULT_QC_PASS_THRESHOLD;
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readJsonUnknown(filePath: string): Promise<unknown | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw) as unknown;
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

function toObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function pickArray(value: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(value)) return value.map((v) => toObject(v)).filter((v): v is Record<string, unknown> => Boolean(v));
  return [];
}

function normalizeState(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  return value.trim().toLowerCase().replace(/[\s-]+/g, '_');
}

function toRawEntry(input: Record<string, unknown>, manifestPath?: string): VyasaRawEntry | null {
  const sourceId =
    (input.book_id as string) ??
    (input.source_id as string) ??
    (input.sourceId as string) ??
    (input.id as string) ??
    null;

  const title =
    (typeof input.title === 'string' && input.title) ||
    (typeof input.name === 'string' && input.name) ||
    (typeof input.textbook === 'string' && input.textbook) ||
    sourceId;

  if (!title) return null;

  return {
    sourceId,
    title,
    shortTitle: (input.short_title as string) ?? (input.shortTitle as string) ?? null,
    specialty: (input.specialty as string) ?? null,
    domain: (input.domain as string) ?? (input.subject_domain as string) ?? null,
    levelTags: Array.isArray(input.level_tags)
      ? (input.level_tags.filter((v): v is string => typeof v === 'string') as string[])
      : Array.isArray(input.levelTags)
        ? (input.levelTags.filter((v): v is string => typeof v === 'string') as string[])
        : undefined,
    status:
      (input.status as string) ??
      (input.state as string) ??
      (input.lifecycle_state as string) ??
      (input.lifecycleState as string) ??
      null,
    readinessState: (input.readiness_state as string) ?? (input.readinessState as string) ?? null,
    lifecycleState: (input.lifecycle_state as string) ?? (input.lifecycleState as string) ?? null,
    qcPassed: asBool(input.qc_passed ?? input.qcPassed ?? input.qc_pass ?? input.pass ?? input.qc_status),
    qcScore: asNumber(input.qc_score ?? input.score),
    indexedReady: asBool(input.indexed_ready ?? input.indexReady),
    published: asBool(input.published ?? input.is_published ?? input.selectable),
    publishState: (input.publish_state as string) ?? (input.publishState as string) ?? null,
    rolloutState: (input.rollout_state as string) ?? (input.rolloutState as string) ?? null,
    syncPriority: (input.sync_priority as string) ?? (input.priority as string) ?? null,
    reason: (input.reason as string) ?? null,
    chapterCount: asNumber(input.chapter_count ?? input.chapters ?? input.total_chapters),
    imageCount: asNumber(input.image_count ?? input.images ?? input.total_images),
    chunkCount: asNumber(input.chunk_count ?? input.chunks),
    verifiedAt: (input.verified_at as string) ?? (input.updated_at as string) ?? (input.generated as string) ?? null,
    manifestPath: manifestPath ?? null,
    raw: input,
  };
}

function parseSyncCandidates(json: unknown): VyasaRawEntry[] {
  if (Array.isArray(json)) {
    return json.map((row) => toRawEntry(toObject(row) ?? {})).filter((v): v is VyasaRawEntry => Boolean(v));
  }

  const root = toObject(json);
  if (!root) return [];

  const listCandidate = [root.candidates, root.books, root.sources, root.items, root.catalog].find(Array.isArray);
  return pickArray(listCandidate).map((row) => toRawEntry(row)).filter((v): v is VyasaRawEntry => Boolean(v));
}

export async function inspectVyasaSyncCandidates(root: string): Promise<{ path: string | null; entries: VyasaRawEntry[] }> {
  const syncCandidatesPath = path.join(root, 'sync_candidates.json');
  if (!(await exists(syncCandidatesPath))) return { path: null, entries: [] };
  const json = await readJsonUnknown(syncCandidatesPath);
  return { path: syncCandidatesPath, entries: parseSyncCandidates(json) };
}

async function discoverVyasaLibrary(rootOverride?: string): Promise<{
  root: string | null;
  syncCandidatesPath: string | null;
  libraryCatalogPath: string | null;
  libraryStatsPath: string | null;
  verificationDashboardPath: string | null;
  entries: VyasaRawEntry[];
  manifestPaths: string[];
}> {
  const roots = rootOverride ? [rootOverride] : CANDIDATE_VYASA_LIBRARY_PATHS;

  for (const root of roots) {
    if (!(await exists(root))) continue;

    const syncCandidates = await inspectVyasaSyncCandidates(root);
    const libraryCatalogPath = path.join(root, 'library_catalog.json');
    const libraryStatsPath = path.join(root, 'library_stats.json');
    const verificationDashboardPath = path.join(root, 'verification_dashboard.json');

    if (syncCandidates.path) {
      return {
        root,
        syncCandidatesPath: syncCandidates.path,
        libraryCatalogPath: (await exists(libraryCatalogPath)) ? libraryCatalogPath : null,
        libraryStatsPath: (await exists(libraryStatsPath)) ? libraryStatsPath : null,
        verificationDashboardPath: (await exists(verificationDashboardPath)) ? verificationDashboardPath : null,
        entries: syncCandidates.entries,
        manifestPaths: [],
      };
    }

    const libraryCatalog = await readJsonUnknown(libraryCatalogPath);
    if (libraryCatalog) {
      const rootObj = toObject(libraryCatalog);
      const listCandidate = rootObj ? [rootObj.books, rootObj.sources, rootObj.items, rootObj.catalog].find(Array.isArray) : null;
      const rows = pickArray(listCandidate);
      const entries = rows.map((row) => toRawEntry(row)).filter((v): v is VyasaRawEntry => Boolean(v));
      return {
        root,
        syncCandidatesPath: null,
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
        const json = await readJsonUnknown(manifestPath);
        const rootObj = toObject(json);
        if (!rootObj) continue;

        const textbook = toObject(rootObj.textbook);
        const textbookName =
          (typeof rootObj.textbook === 'string' ? rootObj.textbook : null) ||
          (textbook && typeof textbook.name === 'string' ? textbook.name : null) ||
          path.basename(path.dirname(manifestPath));

        const chapters = asNumber((textbook?.chapters ?? rootObj.total_chapters) as unknown);
        const images = asNumber((textbook?.total_images ?? rootObj.total_images) as unknown);

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
          verifiedAt: (rootObj.generated as string) ?? null,
          manifestPath,
          raw: rootObj,
        });
      }

      return {
        root,
        syncCandidatesPath: null,
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
    syncCandidatesPath: null,
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
  const threshold = getQcPassThreshold();
  const status = normalizeState(entry.status ?? entry.readinessState ?? entry.lifecycleState);
  const publishState = normalizeState(entry.publishState);
  const explicitRollout = normalizeState(entry.rolloutState);

  const qcBySignal = entry.qcPassed;
  const qcByScore = typeof entry.qcScore === 'number' ? entry.qcScore >= threshold : null;
  const statusImpliesQcPass = Boolean(status && ['qc_passed', 'indexed_ready', 'active', 'published', 'ready', 'pass', 'passed'].includes(status));

  const qcPassed =
    qcBySignal === true || statusImpliesQcPass || qcByScore === true
      ? true
      : qcBySignal === false
        ? false
        : (qcByScore ?? false);

  const indexedReady =
    Boolean(entry.indexedReady) ||
    Boolean(status && ['indexed_ready', 'active', 'published'].includes(status));

  const published =
    Boolean(entry.published) ||
    Boolean(status && ['active', 'published'].includes(status)) ||
    Boolean(publishState && ['active', 'published'].includes(publishState));

  const rolloutState = explicitRollout
    ? (explicitRollout === 'published' ? 'active' : explicitRollout)
    : published
      ? 'active'
      : 'inactive';

  const lifecycleState =
    normalizeState(entry.lifecycleState) ??
    (indexedReady
      ? 'indexed_ready'
      : qcPassed
        ? 'qc_passed'
        : status?.includes('failed')
          ? 'qc_failed'
          : status?.includes('pending')
            ? 'qc_pending'
            : 'cataloged');

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
        syncCandidatesPath: null,
        libraryCatalogPath: null,
        libraryStatsPath: null,
        verificationDashboardPath: null,
        manifestCount: 0,
      },
      counts: { discovered: 0, imported: 0, selectable: 0, published: 0, skipped: 0, skippedUnmapped: 0 },
      skippedByReason: { no_library_path: 1 },
      skipped: [{ title: 'Vyasa library root', reason: 'No library path available; fallback mode only' }],
    };
  }

  let imported = 0;
  let selectable = 0;
  let published = 0;
  let skippedUnmapped = 0;
  const skipped: Array<{ title: string; reason: string }> = [];
  const skippedByReason: Record<string, number> = {};

  for (const raw of discovered.entries) {
    const mapped = resolveCatalogSource(raw);
    if (!mapped) {
      skippedUnmapped += 1;
      skipped.push({ title: raw.title, reason: 'No atom_source_catalog mapping' });
      skippedByReason.unmapped_catalog = (skippedByReason.unmapped_catalog ?? 0) + 1;
      continue;
    }

    const states = deriveStates(raw);
    const metadata = {
      vyasa: {
        source: 'vyasa',
        manifest_path: raw.manifestPath,
        sync_candidates_path: discovered.syncCandidatesPath,
        status: raw.status,
        readiness_state: raw.readinessState,
        publish_state: raw.publishState,
        rollout_state: raw.rolloutState,
        published: states.published,
        qc_score: raw.qcScore,
        sync_priority: raw.syncPriority,
        reason: raw.reason,
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

  const skippedCount = discovered.entries.length - imported;

  return {
    ok: true,
    libraryRoot: discovered.root,
    discovery: {
      syncCandidatesPath: discovered.syncCandidatesPath,
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
      skipped: skippedCount,
      skippedUnmapped,
    },
    skippedByReason,
    skipped,
  };
}
