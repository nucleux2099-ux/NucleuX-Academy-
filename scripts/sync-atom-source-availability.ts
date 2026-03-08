#!/usr/bin/env tsx
import 'dotenv/config';

import fs from 'node:fs/promises';
import type { Dirent } from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { ATOM_SOURCE_CATALOG } from '../src/lib/atom/source-catalog';
import type { AtomSourceAvailabilityStatus } from '../src/lib/atom/source-availability';

type IndexedBook = { name: string; chapters: number | null; chunks: number | null; source: string };
type CatalogAvailability = {
  id: string;
  title: string;
  status: AtomSourceAvailabilityStatus;
  chapter_count: number | null;
  chunk_count: number | null;
  last_synced_at: string;
  indexed_match?: string;
  md_folder?: string;
  pdf_folder?: string;
};

const OUTPUT_DIR = path.join(process.cwd(), 'reports', 'atom-source-availability');
const NOW = new Date().toISOString();

const SOURCE_HINTS: Record<string, string[]> = {
  'grays-anatomy-for-students': ['grays anatomy for students', 'gray anatomy'],
  'ganong-review-of-medical-physiology': ['ganong'],
  'lippincott-illustrated-reviews-biochemistry': ['lippincott biochemistry', 'lippincott illustrated reviews biochemistry'],
  'robbins-cotran-pathologic-basis-of-disease': ['robbins cotran', 'robbins pathology'],
  'katzung-basic-clinical-pharmacology': ['katzung'],
  'jawetz-melnick-adelberg-medical-microbiology': ['jawetz'],
  'essentials-of-forensic-medicine-and-toxicology': ['forensic medicine toxicology'],
  'parks-textbook-of-preventive-and-social-medicine': ['parks preventive social medicine', 'parks psm'],
  'harrisons-principles-of-internal-medicine': ['harrison principles internal medicine', 'harrison'],
  'bailey-and-loves-short-practice-of-surgery': ['bailey love short practice surgery', 'bailey love'],
  'williams-obstetrics': ['williams obstetrics'],
  'nelson-textbook-of-pediatrics': ['nelson pediatrics', 'nelson textbook pediatrics'],
  'miller-anesthesia': ['miller anesthesia'],
  'grainger-and-allison-diagnostic-radiology': ['grainger allison radiology', 'grainger radiology'],
  'kanskis-clinical-ophthalmology': ['kanski clinical ophthalmology', 'kanski'],
  'scott-browns-otorhinolaryngology': ['scott brown otorhinolaryngology', 'scott brown ent'],
  'sabiston-textbook-of-surgery': ['sabiston surgery', 'sabiston textbook surgery'],
  'tintinalli-emergency-medicine': ['tintinalli emergency medicine'],
  'icu-protocols-for-residents': ['icu protocols residents'],
  'current-medical-diagnosis-and-treatment': ['current medical diagnosis and treatment', 'cmdt'],
  'oxford-handbook-of-clinical-medicine': ['oxford handbook clinical medicine'],
  'schwartzs-principles-of-surgery': ['schwartz principles surgery'],
  'braunwald-heart-disease': ['braunwald heart disease', 'braunwald'],
  'sleisenger-and-fordtran-gastrointestinal-disease': ['sleisenger fordtran', 'sleisenger gastrointestinal disease'],
  'devita-cancer-principles-and-practice-of-oncology': ['devita cancer principles practice oncology', 'devita oncology'],
  'campbell-walsh-wein-urology': ['campbell walsh wein urology', 'campbell urology'],
};

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

const GENERIC_TOKENS = new Set(['and', 'of', 'for', 'the', 'principles', 'textbook', 'clinical', 'medicine', 'surgery', 'disease', 'review']);

function scoreMatch(target: string, candidate: string): number {
  if (!target || !candidate) return 0;
  if (target === candidate) return 100;
  if (candidate.includes(target) || target.includes(candidate)) return 70;
  const targetTokens = target.split(' ').filter((t) => t && !GENERIC_TOKENS.has(t));
  const candTokens = candidate.split(' ').filter((t) => t && !GENERIC_TOKENS.has(t));
  const overlapTokens = targetTokens.filter((t) => candTokens.includes(t));
  const overlap = overlapTokens.length;
  if (overlap === 0) return 0;
  const bonus = overlapTokens.some((t) => t.length >= 7) ? 8 : 0;
  return overlap * 12 + bonus;
}

function envList(name: string): string[] {
  return (process.env[name] ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath: string): Promise<unknown | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

async function findIndexedBooks(): Promise<{ books: IndexedBook[]; manifestPaths: string[]; inferredMdRoots: string[] }> {
  const defaultManifests = [
    '/Users/adityachandrabhatla/ATOM-Learning-System/data/indexes/master-textbook-index.json',
    '/Users/adityachandrabhatla/ATOM-Learning-System/data/indexes/search-manifest.json',
  ];
  const manifestPaths = [...new Set([...envList('ATOM_SOURCE_INDEX_MANIFESTS'), ...defaultManifests])];
  const books = new Map<string, IndexedBook>();
  const inferredMdRoots = new Set<string>();

  for (const manifestPath of manifestPaths) {
    if (!(await exists(manifestPath))) continue;
    const json = await readJson(manifestPath);
    if (!json || typeof json !== 'object') continue;
    const root = json as Record<string, unknown>;

    if (typeof root.source_library === 'string') inferredMdRoots.add(root.source_library);

    if (root.textbooks && !Array.isArray(root.textbooks) && typeof root.textbooks === 'object') {
      for (const [name, entry] of Object.entries(root.textbooks as Record<string, unknown>)) {
        if (typeof name !== 'string' || !entry || typeof entry !== 'object') continue;
        const e = entry as Record<string, unknown>;
        const chapters = typeof e.chapters === 'number' ? e.chapters : null;
        const chunks = typeof e.chunks === 'number' ? e.chunks : null;
        books.set(name, { name, chapters, chunks, source: manifestPath });
      }
      continue;
    }

    if (Array.isArray(root.textbooks)) {
      for (const entry of root.textbooks) {
        if (!entry || typeof entry !== 'object') continue;
        const e = entry as Record<string, unknown>;
        if (typeof e.name !== 'string') continue;
        const name = e.name;
        const chapters = typeof e.chapters === 'number' ? e.chapters : null;
        const chunks = typeof e.chunks === 'number' ? e.chunks : null;
        books.set(name, { name, chapters, chunks, source: manifestPath });
      }
    }
  }

  return { books: Array.from(books.values()), manifestPaths, inferredMdRoots: Array.from(inferredMdRoots) };
}

async function listSubdirs(roots: string[]): Promise<Array<{ root: string; name: string; fullPath: string; normalized: string }>> {
  const out: Array<{ root: string; name: string; fullPath: string; normalized: string }> = [];
  for (const root of roots) {
    if (!(await exists(root))) continue;
    const entries = await fs.readdir(root, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const fullPath = path.join(root, entry.name);
      out.push({ root, name: entry.name, fullPath, normalized: normalize(entry.name) });
    }
  }
  return out;
}

async function countFilesRecursive(root: string, ext: '.md' | '.pdf'): Promise<number> {
  let count = 0;
  const stack = [root];
  while (stack.length > 0) {
    const cur = stack.pop();
    if (!cur) continue;
    let entries: Dirent[] = [];
    try {
      entries = await fs.readdir(cur, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = path.join(cur, entry.name);
      if (entry.isDirectory()) {
        if (entry.name.startsWith('.')) continue;
        stack.push(full);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(ext)) {
        count += 1;
      }
    }
  }
  return count;
}

function bestMatch(candidates: string[], options: Array<{ key: string; normalized: string }>): { key: string; score: number } | null {
  let best: { key: string; score: number } | null = null;
  for (const option of options) {
    for (const candidate of candidates) {
      const s = scoreMatch(normalize(candidate), option.normalized);
      if (!best || s > best.score) best = { key: option.key, score: s };
    }
  }
  return best && best.score >= 30 ? best : null;
}

async function main() {
  const { books: indexedBooks, manifestPaths, inferredMdRoots } = await findIndexedBooks();

  const mdRoots = [...new Set([
    ...envList('ATOM_SOURCE_MD_ROOTS'),
    ...inferredMdRoots,
    "/Volumes/Aditya's Ideaverse/03 Spaces/Sarath's Learning System/Source Library",
    "/Volumes/Aditya's Ideaverse/03 Spaces/🎓 Learning/Active System/Source Library",
  ])];

  const pdfRoots = [...new Set([...envList('ATOM_SOURCE_PDF_ROOTS'), ...mdRoots])];

  const mdFolders = await listSubdirs(mdRoots);
  const pdfFolders = await listSubdirs(pdfRoots);

  const indexedOptions = indexedBooks.map((b) => ({ key: b.name, normalized: normalize(b.name) }));
  const mdOptions = mdFolders.map((f) => ({ key: f.fullPath, normalized: f.normalized }));
  const pdfOptions = pdfFolders.map((f) => ({ key: f.fullPath, normalized: f.normalized }));

  const rows: CatalogAvailability[] = [];

  for (const source of ATOM_SOURCE_CATALOG) {
    const hints = [...(SOURCE_HINTS[source.id] ?? []), source.title, source.shortTitle, source.id.replaceAll('-', ' ')];

    const idxMatch = bestMatch(hints, indexedOptions);
    const mdMatch = bestMatch(hints, mdOptions);
    const pdfMatch = bestMatch(hints, pdfOptions);

    const indexed = idxMatch ? indexedBooks.find((b) => b.name === idxMatch.key) : undefined;
    const mdCount = mdMatch ? await countFilesRecursive(mdMatch.key, '.md') : 0;
    const pdfCount = pdfMatch ? await countFilesRecursive(pdfMatch.key, '.pdf') : 0;

    let status: AtomSourceAvailabilityStatus = 'missing';
    if (indexed && (indexed.chapters ?? 0) > 0) status = 'indexed_ready';
    else if (mdCount > 0) status = 'md_ready_not_ingested';
    else if (pdfCount > 0) status = 'pdf_only';

    rows.push({
      id: source.id,
      title: source.title,
      status,
      chapter_count: indexed?.chapters ?? (mdCount > 0 ? mdCount : null),
      chunk_count: indexed?.chunks ?? null,
      last_synced_at: NOW,
      indexed_match: indexed?.name,
      md_folder: mdMatch?.key,
      pdf_folder: pdfMatch?.key,
    });
  }

  const summary = {
    generated_at: NOW,
    manifests_checked: manifestPaths,
    md_roots_checked: mdRoots,
    pdf_roots_checked: pdfRoots,
    counts: {
      indexed_ready: rows.filter((r) => r.status === 'indexed_ready').length,
      md_ready_not_ingested: rows.filter((r) => r.status === 'md_ready_not_ingested').length,
      pdf_only: rows.filter((r) => r.status === 'pdf_only').length,
      missing: rows.filter((r) => r.status === 'missing').length,
    },
    selectable_now: rows.filter((r) => r.status === 'indexed_ready').map((r) => ({ id: r.id, title: r.title, chapter_count: r.chapter_count })),
    disabled_pending_ingestion: rows
      .filter((r) => r.status === 'md_ready_not_ingested' || r.status === 'pdf_only')
      .map((r) => ({ id: r.id, title: r.title, status: r.status, chapter_count: r.chapter_count })),
    missing: rows.filter((r) => r.status === 'missing').map((r) => ({ id: r.id, title: r.title })),
    rows,
  };

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(path.join(OUTPUT_DIR, 'latest.json'), JSON.stringify(summary, null, 2));

  const md = [
    `# ATOM Source Availability Sync`,
    ``,
    `- Generated at: ${NOW}`,
    `- Indexed ready: ${summary.counts.indexed_ready}`,
    `- Markdown ready (not ingested): ${summary.counts.md_ready_not_ingested}`,
    `- PDF only: ${summary.counts.pdf_only}`,
    `- Missing: ${summary.counts.missing}`,
    ``,
    `## Selectable now`,
    ...summary.selectable_now.map((r) => `- ${r.title} (${r.id})${typeof r.chapter_count === 'number' ? ` — ${r.chapter_count} chapters` : ''}`),
    ``,
    `## Disabled pending ingestion`,
    ...summary.disabled_pending_ingestion.map((r) => `- ${r.title} (${r.id}) — ${r.status}`),
    ``,
    `## Missing`,
    ...summary.missing.map((r) => `- ${r.title} (${r.id})`),
    ``,
  ].join('\n');
  await fs.writeFile(path.join(OUTPUT_DIR, 'latest.md'), md);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceRoleKey) {
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    for (const row of rows) {
      const { error } = await supabase
        .from('atom_source_catalog')
        .update({
          availability_status: row.status,
          chapter_count: row.chapter_count,
          chunk_count: row.chunk_count,
          last_synced_at: row.last_synced_at,
        })
        .eq('id', row.id);
      if (error) {
        throw new Error(`Failed updating ${row.id}: ${error.message}`);
      }
    }
  } else {
    console.warn('[sync-atom-source-availability] Supabase service role credentials not set; report generated without DB updates.');
  }

  console.log(`[sync-atom-source-availability] done. indexed_ready=${summary.counts.indexed_ready} pending=${summary.counts.md_ready_not_ingested + summary.counts.pdf_only} missing=${summary.counts.missing}`);
  console.log(`[sync-atom-source-availability] report: ${path.join(OUTPUT_DIR, 'latest.json')}`);
}

main().catch((error) => {
  console.error('[sync-atom-source-availability] failed', error);
  process.exit(1);
});
