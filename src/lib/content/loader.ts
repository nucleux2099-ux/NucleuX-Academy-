/**
 * NucleuX Academy - Dynamic Content Loader
 * 
 * Server-side content loading from /content directory.
 * Replaces hardcoded TypeScript topic files with dynamic file-based loading.
 * 
 * @author Vishwakarma
 * @date 2026-02-09
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { LibraryTopic, NmcCode, RetrievalCard } from '@/lib/types/library';
import type { TopicRoadmap, RoadmapLink } from '@/lib/data/roadmap-types';
import { SUBSPECIALTY_CONTENT_MAP } from '@/lib/data/content-mapping';

/**
 * Normalize NMC codes from _meta.yaml — handles both string and object formats.
 */
function normalizeNmcCodes(raw: unknown): NmcCode[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  return raw.map((item) => {
    if (typeof item === 'string') {
      return { code: item, domain: 'KH' as const, core: false };
    }
    if (item && typeof item === 'object' && 'code' in item) {
      return item as NmcCode;
    }
    return { code: String(item), domain: 'KH' as const, core: false };
  });
}

// Base content directory
const CONTENT_DIR = path.join(process.cwd(), 'content');

/**
 * Resolve the actual content directory for a subspecialty.
 * Checks: direct match, content-mapping, and numbered prefix (e.g., "06-hepatobiliary").
 */
function resolveContentDir(subject: string, subspecialty: string): string | null {
  // 1. Direct match
  const direct = path.join(CONTENT_DIR, subject, subspecialty);
  if (fs.existsSync(direct) && fs.statSync(direct).isDirectory()) return direct;

  // 2. Content mapping
  const mapped = SUBSPECIALTY_CONTENT_MAP[subject]?.[subspecialty];
  if (mapped) {
    const mappedPath = path.join(CONTENT_DIR, subject, mapped);
    if (fs.existsSync(mappedPath) && fs.statSync(mappedPath).isDirectory()) return mappedPath;
  }

  // 3. Numbered prefix scan (e.g., "06-hepatobiliary" matches "hepatobiliary")
  const subjectDir = path.join(CONTENT_DIR, subject);
  if (fs.existsSync(subjectDir)) {
    const entries = fs.readdirSync(subjectDir);
    for (const entry of entries) {
      // Match patterns like "06-hepatobiliary" for slug "hepatobiliary"
      if (entry.endsWith(`-${subspecialty}`) || entry === subspecialty) {
        const full = path.join(subjectDir, entry);
        if (fs.statSync(full).isDirectory()) return full;
      }
    }
  }

  return null;
}

// =============================================================================
// TYPES
// =============================================================================

interface ContentIndex {
  id: string;
  title: string;
  subject: string;
  subspecialty?: string;
  system?: string;
  description?: string;
  stats?: {
    total_chapters?: number;
    chapters_covered?: number;
    coverage_percent?: number;
    concept_notes?: number;
    grinde_maps?: number;
    retrieval_cards?: number;
    case_scenarios?: number;
  };
  categories?: Array<{
    id: string;
    title: string;
    topics: string[];
  }>;
  priority?: string;
  exam_relevance?: string[];
  sources?: {
    primary?: Array<{ book: string; edition?: string; chapters?: string }>;
    supplementary?: Array<{ book: string; edition?: string; chapters?: string; topic?: string }>;
  };
  last_updated?: string;
  status?: string;
}

interface TopicFrontmatter {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  highYield?: boolean;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  estimatedMinutes?: number;
  prerequisites?: string[];
  relatedTopics?: string[];
  examTags?: string[];
  textbookRefs?: Array<{
    textbook: string;
    edition?: string;
    chapter: string;
    pages?: string;
  }>;
}

// Topic folder metadata (CONTENT_STANDARD v1)
interface TopicMeta {
  topic_id?: string;
  slug?: string;
  name?: string;
  description?: string;
  high_yield?: boolean;
  difficulty?: number | 'easy' | 'medium' | 'hard';
  estimated_minutes?: number;
  estimated_time?: {
    explorer?: string;
    exam_prep?: string;
    textbook?: string;
    retrieval?: string;
  };
  prerequisites?: string[];
  related_topics?: string[];
  exam_tags?: string[];
  tags?: string[];
  sources?: unknown;
  nmc_codes?: Array<{
    code: string;
    domain: 'K' | 'KH' | 'SH' | 'P';
    core: boolean;
    phase?: string;
  }>;
}

// =============================================================================
// PARSERS
// =============================================================================

/**
 * Parse YAML frontmatter from markdown content
 */
function parseFrontmatter(content: string): { frontmatter: TopicFrontmatter; body: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (match) {
    try {
      const frontmatter = yaml.load(match[1]) as TopicFrontmatter;
      return { frontmatter: frontmatter || {}, body: match[2].trim() };
    } catch {
      return { frontmatter: {}, body: content };
    }
  }
  
  return { frontmatter: {}, body: content };
}

/**
 * Convert filename to slug
 * "Acute Kidney Injury.md" → "acute-kidney-injury"
 */
function fileToSlug(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Convert filename to readable title
 * "acute-kidney-injury.md" → "Acute Kidney Injury"
 */
function fileToTitle(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// =============================================================================
// LOADERS
// =============================================================================

/**
 * Check if a subspecialty content directory exists
 */
export function subspecialtyExists(subject: string, subspecialty: string): boolean {
  return resolveContentDir(subject, subspecialty) !== null;
}

/**
 * Get all available subspecialties for a subject
 */
export function getSubspecialtiesFromContent(subject: string): string[] {
  const subjectDir = path.join(CONTENT_DIR, subject);
  
  if (!fs.existsSync(subjectDir)) {
    return [];
  }
  
  return fs.readdirSync(subjectDir)
    .filter(item => {
      const itemPath = path.join(subjectDir, item);
      return fs.statSync(itemPath).isDirectory() && 
             fs.existsSync(path.join(itemPath, '_index.yaml'));
    });
}

/**
 * Load subspecialty index
 */
export function loadSubspecialtyIndex(subject: string, subspecialty: string): ContentIndex | null {
  const dirPath = resolveContentDir(subject, subspecialty);
  if (!dirPath) {
    return null;
  }
  const indexPath = path.join(dirPath, '_index.yaml');
  
  if (!fs.existsSync(indexPath)) {
    return null;
  }
  
  try {
    const content = fs.readFileSync(indexPath, 'utf-8');
    return yaml.load(content) as ContentIndex;
  } catch (error) {
    console.error(`Failed to load index: ${indexPath}`, error);
    return null;
  }
}

/**
 * Load a single topic from a flat markdown file (legacy v0 format)
 */
export function loadTopicFromMarkdownFile(
  subject: string,
  subspecialty: string,
  filename: string,
  baseDir?: string
): LibraryTopic | null {
  const dirPath = baseDir || resolveContentDir(subject, subspecialty);
  if (!dirPath) {
    return null;
  }
  const filePath = path.join(dirPath, filename);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);

    const slug = frontmatter.slug || fileToSlug(filename);
    const name = frontmatter.title || fileToTitle(filename);

    const topic: LibraryTopic = {
      id: frontmatter.id || `${subspecialty}-${slug}`,
      subjectId: subject,
      subspecialtyId: `${subject}-${subspecialty}`,
      name,
      slug,
      description: frontmatter.description,
      highYield: frontmatter.highYield,
      difficulty: frontmatter.difficulty,
      estimatedMinutes: frontmatter.estimatedMinutes || estimateReadTime(body),
      prerequisites: frontmatter.prerequisites,
      relatedTopics: frontmatter.relatedTopics,
      examTags: frontmatter.examTags,
      content: {
        concept: body,
        textbookRefs: frontmatter.textbookRefs,
      },
      hasContent: {
        concept: body.length > 100,
        examPrep: false,
        textbook: !!frontmatter.textbookRefs?.length,
        retrievalCards: false,
        cases: false,
        grindeMap: false,
      },
    };

    return topic;
  } catch (error) {
    console.error(`Failed to load topic file: ${filePath}`, error);
    return null;
  }
}

/**
 * Load a topic from a topic folder following CONTENT_STANDARD v1
 */
export function loadTopicFromFolder(
  subject: string,
  subspecialty: string,
  topicSlug: string,
  baseDir?: string
): LibraryTopic | null {
  const dirPath = baseDir || resolveContentDir(subject, subspecialty);
  if (!dirPath) {
    return null;
  }
  const topicDir = path.join(dirPath, topicSlug);
  if (!fs.existsSync(topicDir) || !fs.statSync(topicDir).isDirectory()) {
    return null;
  }

  const metaPath = path.join(topicDir, '_meta.yaml');
  const explorerPath = path.join(topicDir, 'explorer.md');
  const examPrepPath = path.join(topicDir, 'exam-prep.md');
  const textbookPath = path.join(topicDir, 'textbook.md');
  const cardsPath = path.join(topicDir, 'retrieval-cards.json');
  const cardsMdPath = path.join(topicDir, 'retrieval-cards.md');
  const roadmapPath = path.join(topicDir, 'roadmap.md');
  const roadmapUgPath = path.join(topicDir, 'roadmap-ug.json');
  const roadmapPgPath = path.join(topicDir, 'roadmap-pg.json');
  const roadmapSsPath = path.join(topicDir, 'roadmap-ss.json');

  try {
    const meta: TopicMeta = fs.existsSync(metaPath)
      ? (yaml.load(fs.readFileSync(metaPath, 'utf-8')) as TopicMeta)
      : {};

    const explorer = fs.existsSync(explorerPath) ? fs.readFileSync(explorerPath, 'utf-8') : '';
    const examPrepMd = fs.existsSync(examPrepPath) ? fs.readFileSync(examPrepPath, 'utf-8') : undefined;
    const textbookMd = fs.existsSync(textbookPath) ? fs.readFileSync(textbookPath, 'utf-8') : undefined;
    const roadmapMd = fs.existsSync(roadmapPath) ? fs.readFileSync(roadmapPath, 'utf-8') : undefined;

    // Parse retrieval cards if present (preferred JSON; fallback markdown)
    let retrievalCards: RetrievalCard[] | undefined;
    if (fs.existsSync(cardsPath)) {
      try {
        const parsed: unknown = JSON.parse(fs.readFileSync(cardsPath, 'utf-8'));
        const arr = Array.isArray(parsed)
          ? parsed
          : (
              typeof parsed === 'object' &&
              parsed !== null &&
              'cards' in parsed &&
              Array.isArray((parsed as { cards?: unknown }).cards)
            )
            ? (parsed as { cards: unknown[] }).cards
            : undefined;

        // Normalize to {question, answer}
        const normalizedCards = (arr ?? []).reduce<RetrievalCard[]>((acc, c) => {
          const card = (typeof c === 'object' && c !== null ? c : {}) as Record<string, unknown>;
          const question = typeof card.question === 'string'
            ? card.question
            : typeof card.front === 'string'
              ? card.front
              : undefined;
          const answer = typeof card.answer === 'string'
            ? card.answer
            : typeof card.back === 'string'
              ? card.back
              : undefined;
          const difficulty =
            typeof card.difficulty === 'number' &&
            Number.isInteger(card.difficulty) &&
            card.difficulty >= 1 &&
            card.difficulty <= 5
              ? (card.difficulty as RetrievalCard['difficulty'])
              : undefined;
          const tags = Array.isArray(card.tags)
            ? card.tags.filter((tag): tag is string => typeof tag === 'string')
            : undefined;

          if (!question || !answer) return acc;

          acc.push({
            id: typeof card.id === 'string' ? card.id : undefined,
            question,
            answer,
            difficulty,
            tags,
          });
          return acc;
        }, []);
        retrievalCards = normalizedCards.length > 0 ? normalizedCards : undefined;
      } catch {
        retrievalCards = undefined;
      }
    } else if (fs.existsSync(cardsMdPath)) {
      const md = fs.readFileSync(cardsMdPath, 'utf-8');
      retrievalCards = parseRetrievalCardsMarkdown(md);
    }

    // Load roadmap JSON files (UG/PG/SS)
    const roadmapJsonData: TopicRoadmap[] = [];
    for (const [rPath, level] of [[roadmapUgPath, 'UG'], [roadmapPgPath, 'PG'], [roadmapSsPath, 'SS']] as const) {
      if (fs.existsSync(rPath)) {
        try {
          const parsed = JSON.parse(fs.readFileSync(rPath, 'utf-8'));
          if (typeof parsed === 'object' && parsed !== null) {
            const raw = parsed as Record<string, unknown>;
            const toLinks = (value: unknown): RoadmapLink[] =>
              Array.isArray(value)
                ? value
                    .map((item) => (typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : null))
                    .filter((item): item is Record<string, unknown> => item !== null)
                    .map((item) => ({
                      subject: typeof item.subject === 'string' ? item.subject : '',
                      topic: typeof item.topic === 'string' ? item.topic : '',
                      nmcCode: typeof item.nmcCode === 'string' ? item.nmcCode : undefined,
                      reason: typeof item.reason === 'string' ? item.reason : '',
                      exists: Boolean(item.exists),
                    }))
                : [];
            const toStrings = (value: unknown): string[] =>
              Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];

            roadmapJsonData.push({
              level,
              foundations: toLinks(raw.foundations),
              clinical: toLinks(raw.clinical),
              extensions: toLinks(raw.extensions),
              objectives: toStrings(raw.objectives),
              nextTopics: toStrings(raw.nextTopics),
              prevTopics: toStrings(raw.prevTopics),
              integration: typeof raw.integration === 'string' ? raw.integration : '',
            });
          }
        } catch { /* skip malformed */ }
      }
    }

    // Normalize difficulty
    const difficulty = normalizeDifficulty(meta.difficulty);

    const topic: LibraryTopic = {
      id: meta.topic_id || `${subspecialty}-${topicSlug}`,
      subjectId: subject,
      subspecialtyId: `${subject}-${subspecialty}`,
      name: meta.name || fileToTitle(topicSlug),
      slug: meta.slug || topicSlug,
      description: meta.description,
      highYield: meta.high_yield || (meta.tags?.includes('high-yield') ?? false),
      difficulty,
      estimatedMinutes: meta.estimated_minutes || parseEstimated(meta.estimated_time?.explorer) || estimateReadTime(explorer),
      prerequisites: meta.prerequisites,
      relatedTopics: meta.related_topics,
      examTags: meta.exam_tags,
      nmcCodes: normalizeNmcCodes(meta.nmc_codes),
      content: {
        concept: explorer,
        examPrep: examPrepMd ? { summary: examPrepMd } : undefined,
        textbookRefs: undefined,
        retrievalCards,
        cases: undefined,
        grindeMap: roadmapMd,
        roadmapJson: roadmapJsonData.length > 0 ? roadmapJsonData : undefined,
      },
      hasContent: {
        concept: explorer.trim().length > 0,
        examPrep: !!examPrepMd,
        textbook: !!textbookMd,
        retrievalCards: Array.isArray(retrievalCards) && retrievalCards.length > 0,
        cases: false,
        grindeMap: !!roadmapMd,
      },
    };

    return topic;
  } catch (error) {
    console.error(`Failed to load topic folder: ${topicDir}`, error);
    return null;
  }
}

/**
 * Load all topics for a subspecialty
 */
export function loadTopicsForSubspecialty(
  subject: string,
  subspecialty: string
): LibraryTopic[] {
  const dirPath = resolveContentDir(subject, subspecialty);

  if (!dirPath) {
    return [];
  }

  const topicsBySlug = new Map<string, LibraryTopic>();
  const entries = fs.readdirSync(dirPath);

  // Load index for ordering (supports both categories[] and topics[])
  const index = loadSubspecialtyIndex(subject, subspecialty) as
    | {
        categories?: Array<{ topics?: string[] }>;
        topics?: unknown[];
      }
    | null;
  const orderedSlugs: string[] = [];

  if (index?.categories) {
    for (const category of index.categories) {
      if (Array.isArray(category?.topics)) {
        orderedSlugs.push(...category.topics);
      }
    }
  } else if (Array.isArray(index?.topics)) {
    // Legacy index format: may be titles. We cannot reliably map titles → slugs here.
    // We'll fall back to filesystem discovery order.
  }

  // 1) Load topic folders (preferred standard)
  for (const entry of entries) {
    if (entry.startsWith('.') || entry.startsWith('_')) continue;

    const full = path.join(dirPath, entry);
    if (!fs.statSync(full).isDirectory()) continue;

    // Skip known non-topic directories (only if they lack _meta.yaml)
    if (['cases', 'retrieval-cards', 'grinde-maps'].includes(entry)) {
      if (!fs.existsSync(path.join(full, '_meta.yaml'))) continue;
    }

    const hasMeta = fs.existsSync(path.join(full, '_meta.yaml'));
    const hasExplorer = fs.existsSync(path.join(full, 'explorer.md'));
    if (!hasMeta && !hasExplorer) continue;

    const topic = loadTopicFromFolder(subject, subspecialty, entry, dirPath);
    if (topic) {
      topicsBySlug.set(topic.slug, topic);
    }
  }

  // 2) Load flat markdown files at root (legacy)
  const mdFiles = entries.filter(f => f.endsWith('.md') && !f.startsWith('_'));
  for (const file of mdFiles) {
    const topic = loadTopicFromMarkdownFile(subject, subspecialty, file, dirPath);
    if (topic && !topicsBySlug.has(topic.slug)) {
      topicsBySlug.set(topic.slug, topic);
    }
  }

  const topics = Array.from(topicsBySlug.values());

  // Sort by index order if available, otherwise alphabetically
  if (orderedSlugs.length > 0) {
    topics.sort((a, b) => {
      const aIndex = orderedSlugs.indexOf(a.slug);
      const bIndex = orderedSlugs.indexOf(b.slug);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.name.localeCompare(b.name);
    });
  } else {
    topics.sort((a, b) => a.name.localeCompare(b.name));
  }

  return topics;
}

/**
 * Estimate read time from content length
 */
function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(5, Math.ceil(words / wordsPerMinute));
}

function parseEstimated(v?: string): number | undefined {
  if (!v) return undefined;
  const m = v.match(/(\d+)/);
  if (!m) return undefined;
  return parseInt(m[1], 10);
}

function normalizeDifficulty(v: TopicMeta['difficulty']): 1 | 2 | 3 | 4 | 5 | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'number') {
    const n = Math.max(1, Math.min(5, Math.round(v)));
    return n as 1 | 2 | 3 | 4 | 5;
  }
  if (typeof v === 'string') {
    if (v === 'easy') return 2;
    if (v === 'medium') return 3;
    if (v === 'hard') return 4;
  }
  return undefined;
}

/**
 * Parse retrieval cards from markdown format used in esophagus pilot.
 * Extracts cards from blocks like:
 *   **Q: ...**
 *   <details> ... </details>
 */
function parseRetrievalCardsMarkdown(md: string): Array<{ question: string; answer: string }> {
  const cards: Array<{ question: string; answer: string }> = [];

  // Match card blocks starting with **Q:** and capturing the following <details> ... </details>
  const re = /\*\*Q:\s*([\s\S]*?)\*\*\s*[\r\n]+\s*<details>[\s\S]*?<summary>[\s\S]*?<\/summary>\s*([\s\S]*?)<\/details>/g;

  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) {
    const q = m[1].trim().replace(/\s+/g, ' ');
    // Answer may include markdown; keep it but trim
    const a = m[2].trim();
    if (q && a) cards.push({ question: q, answer: a });
  }

  return cards;
}

// =============================================================================
// DISCOVERY
// =============================================================================

/**
 * Discover all content in the library
 */
export function discoverAllContent(): Map<string, Map<string, ContentIndex>> {
  const content = new Map<string, Map<string, ContentIndex>>();
  
  if (!fs.existsSync(CONTENT_DIR)) {
    return content;
  }
  
  const subjects = fs.readdirSync(CONTENT_DIR)
    .filter(item => {
      const itemPath = path.join(CONTENT_DIR, item);
      return fs.statSync(itemPath).isDirectory() && !item.startsWith('.');
    });
  
  for (const subject of subjects) {
    const subspecialties = getSubspecialtiesFromContent(subject);
    
    if (subspecialties.length > 0) {
      const subjectMap = new Map<string, ContentIndex>();
      
      for (const subspecialty of subspecialties) {
        const index = loadSubspecialtyIndex(subject, subspecialty);
        if (index) {
          subjectMap.set(subspecialty, index);
        }
      }
      
      if (subjectMap.size > 0) {
        content.set(subject, subjectMap);
      }
    }
  }
  
  return content;
}

/**
 * Get content stats for a subspecialty
 */
export function getContentStats(subject: string, subspecialty: string): {
  topicCount: number;
  hasContent: boolean;
  completeness: number;
} {
  const topics = loadTopicsForSubspecialty(subject, subspecialty);
  
  const topicCount = topics.length;
  const hasContent = topicCount > 0;
  
  // Calculate completeness based on content availability
  let totalScore = 0;
  let maxScore = 0;
  
  for (const topic of topics) {
    maxScore += 5; // Max 5 content types
    if (topic.hasContent?.concept) totalScore += 1;
    if (topic.hasContent?.examPrep) totalScore += 1;
    if (topic.hasContent?.textbook) totalScore += 1;
    if (topic.hasContent?.retrievalCards) totalScore += 1;
    if (topic.hasContent?.cases) totalScore += 1;
  }
  
  const completeness = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  
  return { topicCount, hasContent, completeness };
}
