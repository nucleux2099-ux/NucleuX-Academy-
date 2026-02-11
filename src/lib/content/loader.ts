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
import type { LibraryTopic } from '@/lib/types/library';

// Base content directory
const CONTENT_DIR = path.join(process.cwd(), 'content');

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
  sources?: any;
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
  const dirPath = path.join(CONTENT_DIR, subject, subspecialty);
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
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
  const indexPath = path.join(CONTENT_DIR, subject, subspecialty, '_index.yaml');
  
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
  filename: string
): LibraryTopic | null {
  const filePath = path.join(CONTENT_DIR, subject, subspecialty, filename);

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
  topicSlug: string
): LibraryTopic | null {
  const topicDir = path.join(CONTENT_DIR, subject, subspecialty, topicSlug);
  if (!fs.existsSync(topicDir) || !fs.statSync(topicDir).isDirectory()) {
    return null;
  }

  const metaPath = path.join(topicDir, '_meta.yaml');
  const explorerPath = path.join(topicDir, 'explorer.md');
  const examPrepPath = path.join(topicDir, 'exam-prep.md');
  const textbookPath = path.join(topicDir, 'textbook.md');
  const cardsPath = path.join(topicDir, 'retrieval-cards.json');
  const roadmapPath = path.join(topicDir, 'roadmap.md');

  try {
    const meta: TopicMeta = fs.existsSync(metaPath)
      ? (yaml.load(fs.readFileSync(metaPath, 'utf-8')) as TopicMeta)
      : {};

    const explorer = fs.existsSync(explorerPath) ? fs.readFileSync(explorerPath, 'utf-8') : '';
    const examPrepMd = fs.existsSync(examPrepPath) ? fs.readFileSync(examPrepPath, 'utf-8') : undefined;
    const textbookMd = fs.existsSync(textbookPath) ? fs.readFileSync(textbookPath, 'utf-8') : undefined;
    const roadmapMd = fs.existsSync(roadmapPath) ? fs.readFileSync(roadmapPath, 'utf-8') : undefined;

    // Parse retrieval cards if present
    let retrievalCards: any[] | undefined;
    if (fs.existsSync(cardsPath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(cardsPath, 'utf-8'));
        const arr = Array.isArray(parsed)
          ? parsed
          : Array.isArray((parsed as any)?.cards)
            ? (parsed as any).cards
            : undefined;

        // Normalize to {question, answer}
        retrievalCards = arr?.map((c: any) => ({
          id: c.id,
          question: c.question ?? c.front,
          answer: c.answer ?? c.back,
          difficulty: c.difficulty,
          tags: c.tags,
        }));
      } catch {
        retrievalCards = undefined;
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
      content: {
        concept: explorer,
        examPrep: examPrepMd ? { summary: examPrepMd } : undefined,
        textbookRefs: undefined,
        retrievalCards,
        cases: undefined,
        grindeMap: roadmapMd,
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
  const dirPath = path.join(CONTENT_DIR, subject, subspecialty);

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const topicsBySlug = new Map<string, LibraryTopic>();
  const entries = fs.readdirSync(dirPath);

  // Load index for ordering (supports both categories[] and topics[])
  const index = loadSubspecialtyIndex(subject, subspecialty) as any;
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

    // Skip known non-topic directories
    if (['cases', 'retrieval-cards', 'grinde-maps', 'diagnostics', 'motility', 'gerd', 'diverticula', 'reconstruction', 'cancer'].includes(entry)) {
      // NOTE: some subspecialties had old subfolders; only treat as topic if it contains _meta.yaml
      if (!fs.existsSync(path.join(full, '_meta.yaml'))) continue;
    }

    const hasMeta = fs.existsSync(path.join(full, '_meta.yaml'));
    const hasExplorer = fs.existsSync(path.join(full, 'explorer.md'));
    if (!hasMeta && !hasExplorer) continue;

    const topic = loadTopicFromFolder(subject, subspecialty, entry);
    if (topic) {
      topicsBySlug.set(topic.slug, topic);
    }
  }

  // 2) Load flat markdown files at root (legacy)
  const mdFiles = entries.filter(f => f.endsWith('.md') && !f.startsWith('_'));
  for (const file of mdFiles) {
    const topic = loadTopicFromMarkdownFile(subject, subspecialty, file);
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
  const index = loadSubspecialtyIndex(subject, subspecialty);
  
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
