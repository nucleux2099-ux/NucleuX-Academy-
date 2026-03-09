/**
 * NucleuX Academy - ATOM v2: Content Chunking Engine
 *
 * Processes /content/ markdown files into semantically meaningful chunks
 * for storage in content_chunks table with BGE-small embeddings.
 *
 * Chunking strategies:
 * - Header-aware splitting for markdown (explorer, exam-prep, textbook)
 * - One chunk per Q&A pair for retrieval-cards.json
 * - One chunk per case file for cases/*.md
 * - Table-aware: never splits table rows
 * - Mnemonic-aware: keeps mnemonics whole
 *
 * Spec: docs/specs/ATOM_RAG_PIPELINE_SPEC.md
 */

import type { ContentChunkMetadata, ViewMode } from '@/lib/types/atom';

// =============================================================================
// TYPES
// =============================================================================

/** Input to the chunking pipeline */
export interface ChunkInput {
  filePath: string;       // "content/surgery/esophagus/gerd-hiatal-hernia/explorer.md"
  content: string;        // raw file content
  metadata: {
    subject: string;      // "surgery"
    subspecialty: string;  // "esophagus"
    topicSlug: string;    // "gerd-hiatal-hernia"
    sourceFile: string;   // "explorer.md"
    viewMode: ViewMode;
  };
}

/** Output chunk ready for database insertion */
export interface ProcessedChunk {
  subject: string;
  subspecialty: string;
  topicSlug: string;
  sourceFile: string;
  viewMode: ViewMode;
  chunkIndex: number;
  content: string;
  tokenCount: number;
  metadata: ContentChunkMetadata;
}

// =============================================================================
// TOKEN ESTIMATION
// =============================================================================

/** Approximate token count: ~4 chars per token for English medical text */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/** Get the last N tokens worth of text (for overlap) */
function getLastNTokens(text: string, tokenCount: number): string {
  const charCount = tokenCount * 4;
  if (text.length <= charCount) return text;
  return text.slice(-charCount);
}

// =============================================================================
// METADATA EXTRACTION
// =============================================================================

/** Extract metadata from a chunk of markdown */
function extractMetadata(content: string, sourceFile: string): ContentChunkMetadata {
  const metadata: ContentChunkMetadata = {};

  // Extract headings
  const headingMatches = content.match(/^#{1,4}\s+.+$/gm);
  if (headingMatches) {
    metadata.headings = headingMatches.map(h => h.trim());
  }

  // Extract NMC/CBME competency codes (format: XX1.1, SU5.3, AN2.1, etc.)
  const nmcMatches = content.match(/\b[A-Z]{2}\d+\.\d+\b/g);
  if (nmcMatches) {
    metadata.nmcCodes = [...new Set(nmcMatches)];
  }

  // Detect high-yield markers
  if (
    /\b(high[- ]yield|must[- ]know|important|frequently asked|faq)\b/i.test(content) ||
    /⭐|🔥|📌|💡/u.test(content)
  ) {
    metadata.highYield = true;
  }

  // Detect difficulty level from content markers or heading hierarchy
  if (/\b(basic|fundamental|introduction|overview)\b/i.test(content)) {
    metadata.difficulty = 'basic';
  } else if (/\b(advanced|complex|rare|unusual|atypical)\b/i.test(content)) {
    metadata.difficulty = 'advanced';
  } else {
    metadata.difficulty = 'intermediate';
  }

  // Extract textbook references
  const refMatch = content.match(
    /(?:Sabiston|Schwartz|Robbins|Harrison|Bailey|Guyton|Ganong|Harper|Lippincott|Dhingra|Scott-Brown|Datta|Chaurasia|Gray|Netter|Snell|Last|Singh|Vishram|Chatterjee|Tripathi|Goodman|KD Tripathi|Park|Mahajan|Padubidri|Shaw|Dutta|Ghai|OP Ghai|Nelson|Kliegman|Essential Orthopaedics|Turek|Apley|Reddy|Kanski|Parsons|Ahuja|Niraj)[^.]*(?:Ch\.?\s*\d+|Chapter\s*\d+|p\.?\s*\d+[-–]\d+|Ed\.?\s*\d+)?/gi
  );
  if (refMatch && refMatch.length > 0) {
    metadata.textbookRef = refMatch[0].trim();
  }

  // Detect content type
  if (/\b(clinical|patient|present|symptom|sign|examination|diagnosis|treatment|management|surgery|surgical)\b/i.test(content)) {
    metadata.contentType = 'clinical';
  } else if (/\b(pathway|enzyme|receptor|gene|protein|molecular|cell|cellular)\b/i.test(content)) {
    metadata.contentType = 'basic_science';
  } else if (/\b(histology|histopathology|gross|microscopy|biopsy|specimen|morphology)\b/i.test(content)) {
    metadata.contentType = 'pathology';
  } else if (/\b(drug|dose|pharmacokinetic|pharmacodynamic|mechanism of action|side effect|contraindication|adverse)\b/i.test(content)) {
    metadata.contentType = 'pharmacology';
  }

  return metadata;
}

// =============================================================================
// TABLE DETECTION
// =============================================================================

/** Check if text contains a markdown table */
function containsTable(text: string): boolean {
  return /\|.+\|/.test(text) && /\|[-:]+\|/.test(text);
}

/** Extract complete tables from markdown, returning sections split around tables */
function splitAroundTables(text: string): { content: string; isTable: boolean }[] {
  const lines = text.split('\n');
  const sections: { content: string; isTable: boolean }[] = [];
  let currentLines: string[] = [];
  let inTable = false;

  for (const line of lines) {
    const isTableLine = /^\s*\|/.test(line);

    if (isTableLine && !inTable) {
      // Entering a table — flush previous non-table content
      if (currentLines.length > 0) {
        sections.push({ content: currentLines.join('\n'), isTable: false });
        currentLines = [];
      }
      inTable = true;
    } else if (!isTableLine && inTable) {
      // Leaving a table — flush table content
      if (currentLines.length > 0) {
        sections.push({ content: currentLines.join('\n'), isTable: true });
        currentLines = [];
      }
      inTable = false;
    }

    currentLines.push(line);
  }

  // Flush remaining
  if (currentLines.length > 0) {
    sections.push({ content: currentLines.join('\n'), isTable: inTable });
  }

  return sections;
}

// =============================================================================
// MNEMONIC DETECTION
// =============================================================================

/** Detect and extract mnemonics as whole chunks */
function extractMnemonics(text: string): { mnemonics: string[]; remaining: string } {
  const mnemonics: string[] = [];
  let remaining = text;

  // Pattern: header containing "mnemonic" followed by content until next header
  const mnemonicPattern = /^(#{1,4}\s+.*mnemonic.*$)([\s\S]*?)(?=^#{1,4}\s|\z)/gim;
  let match;

  while ((match = mnemonicPattern.exec(text)) !== null) {
    const fullMnemonic = (match[1] + match[2]).trim();
    if (fullMnemonic) {
      mnemonics.push(fullMnemonic);
      remaining = remaining.replace(fullMnemonic, '');
    }
  }

  // Also detect all-caps patterns that look like mnemonics (e.g., "VITAMINS D E K A")
  const capsPattern = /^[A-Z\s]{4,}$/gm;
  // These are kept in context but not extracted separately

  return { mnemonics, remaining };
}

// =============================================================================
// HEADER-AWARE SPLITTING
// =============================================================================

/**
 * Split markdown by headers, respecting:
 * - Max token limit per chunk (default 512)
 * - Overlap between chunks (default 64 tokens)
 * - Tables kept whole
 * - Mnemonics kept whole
 */
export function splitByHeaders(
  markdown: string,
  maxTokens: number = 512,
  overlap: number = 64
): string[] {
  const chunks: string[] = [];

  // First extract mnemonics as whole chunks
  const { mnemonics, remaining } = extractMnemonics(markdown);
  mnemonics.forEach(m => chunks.push(m));

  // Split remaining content by headers
  const sections = remaining.split(/(?=^#{1,3}\s)/m).filter(s => s.trim());

  let currentChunk = '';
  let currentTokens = 0;

  for (const section of sections) {
    // Check if section contains a table
    if (containsTable(section)) {
      const parts = splitAroundTables(section);
      for (const part of parts) {
        const partTokens = estimateTokens(part.content);

        if (part.isTable) {
          // Tables are always their own chunk or added whole
          if (currentChunk) {
            if (currentTokens + partTokens <= maxTokens) {
              // Table fits in current chunk
              currentChunk += '\n' + part.content;
              currentTokens += partTokens;
            } else {
              // Flush current, table becomes its own chunk
              chunks.push(currentChunk.trim());
              if (partTokens > maxTokens) {
                // Giant table — chunk it as-is (we never split table rows)
                chunks.push(part.content.trim());
                currentChunk = '';
                currentTokens = 0;
              } else {
                currentChunk = part.content;
                currentTokens = partTokens;
              }
            }
          } else {
            currentChunk = part.content;
            currentTokens = partTokens;
          }
        } else {
          // Non-table text — normal accumulation
          const textTokens = estimateTokens(part.content);
          if (currentTokens + textTokens <= maxTokens) {
            currentChunk += '\n' + part.content;
            currentTokens += textTokens;
          } else {
            if (currentChunk) chunks.push(currentChunk.trim());
            const overlapText = getLastNTokens(currentChunk, overlap);
            currentChunk = overlapText + '\n' + part.content;
            currentTokens = estimateTokens(currentChunk);
          }
        }
      }
    } else {
      // No table — standard header-aware splitting
      const sectionTokens = estimateTokens(section);

      if (currentTokens + sectionTokens <= maxTokens) {
        currentChunk += (currentChunk ? '\n' : '') + section;
        currentTokens += sectionTokens;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }
        // Start new chunk with overlap from previous
        const overlapText = currentChunk ? getLastNTokens(currentChunk, overlap) : '';
        currentChunk = overlapText + (overlapText ? '\n' : '') + section;
        currentTokens = estimateTokens(currentChunk);
      }
    }
  }

  // Flush remaining
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(c => c.length > 0);
}

// =============================================================================
// RETRIEVAL CARD CHUNKING
// =============================================================================

interface RetrievalCard {
  id: string;
  type: string;
  front: string;
  back: string;
  tags?: string[];
}

interface RetrievalCardFile {
  topic_id: string;
  version: string;
  cards: RetrievalCard[];
}

/** Parse retrieval cards JSON and create one chunk per Q&A pair */
function chunkRetrievalCards(jsonContent: string): string[] {
  try {
    const data: RetrievalCardFile = JSON.parse(jsonContent);
    return data.cards.map(card => {
      const tags = card.tags ? ` [Tags: ${card.tags.join(', ')}]` : '';
      return `Q: ${card.front}\nA: ${card.back}${tags}`;
    });
  } catch {
    // If JSON parsing fails, treat as single chunk
    return [jsonContent];
  }
}

// =============================================================================
// VIEW MODE DETECTION
// =============================================================================

/** Determine ViewMode from source file name */
export function detectViewMode(sourceFile: string): ViewMode {
  const name = sourceFile.toLowerCase();
  if (name === 'explorer.md') return 'explorer';
  if (name === 'exam-prep.md') return 'exam_prep';
  if (name === 'textbook.md') return 'textbook';
  if (name === 'retrieval-cards.json') return 'retrieval_cards';
  if (name.startsWith('case') || name.includes('/cases/')) return 'cases';
  if (name === 'roadmap.md') return 'roadmap';
  return 'explorer'; // default
}

// =============================================================================
// MAIN CHUNKING FUNCTION
// =============================================================================

/**
 * Process a single content file into chunks ready for embedding.
 *
 * @param input - File path, content, and metadata
 * @returns Array of ProcessedChunk ready for database insertion
 */
export function chunkContent(input: ChunkInput): ProcessedChunk[] {
  const { content, metadata } = input;
  const { subject, subspecialty, topicSlug, sourceFile, viewMode } = metadata;

  let rawChunks: string[];

  switch (viewMode) {
    case 'retrieval_cards':
      // One chunk per Q&A pair
      rawChunks = chunkRetrievalCards(content);
      break;

    case 'cases':
      // Entire case file = one chunk (typically 300-800 tokens)
      rawChunks = [content];
      break;

    default:
      // Header-aware splitting for markdown files
      rawChunks = splitByHeaders(content, 512, 64);
      break;
  }

  return rawChunks.map((chunkContent, index) => ({
    subject,
    subspecialty,
    topicSlug,
    sourceFile,
    viewMode,
    chunkIndex: index,
    content: chunkContent,
    tokenCount: estimateTokens(chunkContent),
    metadata: extractMetadata(chunkContent, sourceFile),
  }));
}

// =============================================================================
// FILE PATH PARSER
// =============================================================================

/**
 * Parse a content file path into subject/subspecialty/topic metadata.
 *
 * Expected patterns:
 * - content/{subject}/{subspecialty}/{topic}/{file}
 * - content/{subject}/{subspecialty}/{topic}/cases/{file}
 *
 * @param filePath - Relative path from project root, e.g. "content/surgery/esophagus/gerd/explorer.md"
 */
export function parseContentPath(filePath: string): ChunkInput['metadata'] | null {
  // Normalize path separators
  const normalized = filePath.replace(/\\/g, '/');

  // Remove leading content/ prefix
  const contentPrefix = 'content/';
  const idx = normalized.indexOf(contentPrefix);
  if (idx === -1) return null;

  const relativePath = normalized.slice(idx + contentPrefix.length);
  const parts = relativePath.split('/');

  // Minimum: subject/subspecialty/topic/file.md
  if (parts.length < 4) return null;

  // Skip .meta directory
  if (parts[0] === '.meta') return null;

  const subject = parts[0];
  const subspecialty = parts[1];

  // Handle cases/ subdirectory
  let topicSlug: string;
  let sourceFile: string;

  if (parts.length >= 5 && parts[3] === 'cases') {
    // content/subject/subspecialty/topic/cases/file.md
    topicSlug = parts[2];
    sourceFile = `cases/${parts[4]}`;
  } else {
    // content/subject/subspecialty/topic/file.md
    topicSlug = parts[2];
    sourceFile = parts[3];
  }

  const viewMode = detectViewMode(sourceFile);

  return {
    subject,
    subspecialty,
    topicSlug,
    sourceFile,
    viewMode,
  };
}

// =============================================================================
// CONTENT HASH (for change detection)
// =============================================================================

/** Generate a simple hash for content change detection */
export async function contentHash(content: string): Promise<string> {
  // Use Web Crypto API (available in both Node.js and Edge Runtime)
  const encoder = new TextEncoder();
  const data = encoder.encode(content);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback: simple hash for environments without crypto.subtle
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}
