/**
 * NucleuX Academy - ATOM v2: Admin Embed Pipeline
 *
 * POST /api/atom/embed
 *
 * Orchestrates the offline content ingestion pipeline:
 * 1. Scan /content/ directory for markdown/JSON files
 * 2. Parse file paths → subject/subspecialty/topic metadata
 * 3. Chunk content (header-aware split, retrieval cards, cases)
 * 4. Generate BGE-small embeddings via Supabase Edge Function
 * 5. Upsert into content_chunks table with embeddings
 *
 * Supports:
 * - Incremental updates (skip unchanged files via content hash)
 * - Subject filtering (process only one subject)
 * - Force mode (re-chunk everything)
 *
 * Auth: Bearer token (ATOM_EMBED_SECRET env var)
 *
 * Spec: docs/specs/ATOM_RAG_PIPELINE_SPEC.md § Offline Pipeline
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'fs/promises';
import { join, relative } from 'path';
import {
  chunkContent,
  parseContentPath,
  contentHash,
  type ProcessedChunk,
} from '@/lib/atom/chunker';
import { generateEmbedding } from '@/lib/atom/search';

// =============================================================================
// CONFIG
// =============================================================================

/** Maximum texts per embedding batch (Edge Function limit) */
const EMBED_BATCH_SIZE = 100;

/** Content directory relative to project root */
const CONTENT_DIR = join(process.cwd(), 'content');

/** Supported file extensions for chunking */
const SUPPORTED_EXTENSIONS = ['.md', '.json'];

// =============================================================================
// FILE SCANNING
// =============================================================================

/**
 * Recursively scan a directory for content files.
 * Returns absolute paths to all .md and .json files.
 */
async function scanContentFiles(
  dir: string,
  subjectFilter?: string
): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip hidden directories and .meta
        if (entry.name.startsWith('.')) continue;

        // If subject filter is set, only descend into matching subject dir
        // (only applies at the first level under content/)
        if (subjectFilter && dir === CONTENT_DIR && entry.name !== subjectFilter) {
          continue;
        }

        const subFiles = await scanContentFiles(fullPath, undefined);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = entry.name.toLowerCase().slice(entry.name.lastIndexOf('.'));
        if (SUPPORTED_EXTENSIONS.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist or permission error — skip
    console.warn(`[embed] Failed to scan ${dir}:`, error);
  }

  return files;
}

// =============================================================================
// CONTENT HASH TRACKING
// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAdmin = ReturnType<typeof createClient<any>>;

/**
 * Get stored content hashes from the database for change detection.
 * Returns a map of (subject/subspecialty/topic/sourceFile) → hash.
 */
async function getStoredHashes(
  supabase: SupabaseAdmin,
  subjectFilter?: string
): Promise<Map<string, string>> {
  const hashMap = new Map<string, string>();

  let query = supabase
    .from('content_chunks')
    .select('subject, subspecialty, topic_slug, source_file, metadata')
    .eq('chunk_index', 0); // Only check first chunk per file

  if (subjectFilter) {
    query = query.eq('subject', subjectFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.warn('[embed] Failed to fetch stored hashes:', error.message);
    return hashMap;
  }

  for (const row of data ?? []) {
    const key = `${row.subject}/${row.subspecialty}/${row.topic_slug}/${row.source_file}`;
    const hash = (row.metadata as Record<string, unknown>)?.contentHash as string;
    if (hash) {
      hashMap.set(key, hash);
    }
  }

  return hashMap;
}

// =============================================================================
// DATABASE OPERATIONS
// =============================================================================

/**
 * Delete existing chunks for a specific file before reinserting.
 */
async function deleteExistingChunks(
  supabase: SupabaseAdmin,
  chunk: ProcessedChunk
): Promise<void> {
  const { error } = await supabase
    .from('content_chunks')
    .delete()
    .eq('subject', chunk.subject)
    .eq('subspecialty', chunk.subspecialty)
    .eq('topic_slug', chunk.topicSlug)
    .eq('source_file', chunk.sourceFile);

  if (error) {
    console.warn(`[embed] Failed to delete chunks for ${chunk.sourceFile}:`, error.message);
  }
}

/**
 * Insert chunks with embeddings into the content_chunks table.
 */
async function insertChunks(
  supabase: SupabaseAdmin,
  chunks: ProcessedChunk[],
  embeddings: number[][],
  fileHash: string
): Promise<{ inserted: number; errors: number }> {
  let inserted = 0;
  let errors = 0;

  // Build rows for upsert
  const rows = chunks.map((chunk, i) => ({
    subject: chunk.subject,
    subspecialty: chunk.subspecialty,
    topic_slug: chunk.topicSlug,
    source_file: chunk.sourceFile,
    view_mode: chunk.viewMode,
    chunk_index: chunk.chunkIndex,
    content: chunk.content,
    token_count: chunk.tokenCount,
    embedding: embeddings[i] ?? null,
    metadata: {
      ...chunk.metadata,
      contentHash: fileHash,
    },
  }));

  // Insert in batches of 50 to avoid payload limits
  const BATCH_SIZE = 50;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from('content_chunks')
      .insert(batch);

    if (error) {
      console.error(`[embed] Insert error (batch ${i / BATCH_SIZE}):`, error.message);
      errors += batch.length;
    } else {
      inserted += batch.length;
    }
  }

  return { inserted, errors };
}

// =============================================================================
// MAIN PIPELINE
// =============================================================================

interface EmbedResult {
  filesScanned: number;
  filesProcessed: number;
  filesSkipped: number;
  chunksCreated: number;
  embeddingsGenerated: number;
  errors: string[];
  durationMs: number;
}

async function runEmbedPipeline(params: {
  subject?: string;
  force?: boolean;
  supabaseUrl: string;
  serviceRoleKey: string;
}): Promise<EmbedResult> {
  const { subject, force, supabaseUrl, serviceRoleKey } = params;
  const startTime = Date.now();
  const result: EmbedResult = {
    filesScanned: 0,
    filesProcessed: 0,
    filesSkipped: 0,
    chunksCreated: 0,
    embeddingsGenerated: 0,
    errors: [],
    durationMs: 0,
  };

  // Initialize Supabase client with service role
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // Step 1: Scan content files
  console.log(`[embed] Scanning content directory${subject ? ` (subject: ${subject})` : ''}...`);
  const files = await scanContentFiles(CONTENT_DIR, subject);
  result.filesScanned = files.length;
  console.log(`[embed] Found ${files.length} content files`);

  if (files.length === 0) {
    result.durationMs = Date.now() - startTime;
    return result;
  }

  // Step 2: Get stored hashes for incremental updates
  const storedHashes = force ? new Map<string, string>() : await getStoredHashes(supabase, subject);

  // Step 3: Process each file
  const allChunks: ProcessedChunk[] = [];
  const chunkFileHashes: string[] = []; // parallel array: hash for each chunk's source file

  for (const filePath of files) {
    try {
      const relativePath = relative(process.cwd(), filePath);

      // Parse content path metadata
      const metadata = parseContentPath(relativePath);
      if (!metadata) {
        continue; // Not a standard content file path
      }

      // Read file content
      const fileContent = await readFile(filePath, 'utf-8');
      if (!fileContent.trim()) {
        continue; // Empty file
      }

      // Check content hash for incremental updates
      const hash = await contentHash(fileContent);
      const fileKey = `${metadata.subject}/${metadata.subspecialty}/${metadata.topicSlug}/${metadata.sourceFile}`;

      if (!force && storedHashes.get(fileKey) === hash) {
        result.filesSkipped++;
        continue; // File unchanged
      }

      // Chunk the content
      const chunks = chunkContent({
        filePath: relativePath,
        content: fileContent,
        metadata,
      });

      if (chunks.length === 0) {
        continue;
      }

      // Delete existing chunks for this file (will be replaced)
      await deleteExistingChunks(supabase, chunks[0]);

      allChunks.push(...chunks);
      for (let i = 0; i < chunks.length; i++) {
        chunkFileHashes.push(hash);
      }

      result.filesProcessed++;

      // Log progress every 50 files
      if (result.filesProcessed % 50 === 0) {
        console.log(`[embed] Processed ${result.filesProcessed} files, ${allChunks.length} chunks so far...`);
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      result.errors.push(`File ${filePath}: ${errMsg}`);
    }
  }

  console.log(`[embed] Chunking complete: ${allChunks.length} chunks from ${result.filesProcessed} files`);

  // Step 4: Generate embeddings in batches
  console.log(`[embed] Generating embeddings (${Math.ceil(allChunks.length / EMBED_BATCH_SIZE)} batches)...`);

  const allEmbeddings: number[][] = [];

  for (let i = 0; i < allChunks.length; i += EMBED_BATCH_SIZE) {
    const batch = allChunks.slice(i, i + EMBED_BATCH_SIZE);
    const texts = batch.map(c => c.content);

    try {
      const embeddings = await generateEmbedding(texts, supabaseUrl, serviceRoleKey);
      allEmbeddings.push(...embeddings);
      result.embeddingsGenerated += embeddings.length;

      // Log progress
      const batchNum = Math.floor(i / EMBED_BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(allChunks.length / EMBED_BATCH_SIZE);
      if (batchNum % 5 === 0 || batchNum === totalBatches) {
        console.log(`[embed] Embedding batch ${batchNum}/${totalBatches} complete`);
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      result.errors.push(`Embedding batch at offset ${i}: ${errMsg}`);
      // Push null embeddings for failed batch so indices stay aligned
      for (let j = 0; j < batch.length; j++) {
        allEmbeddings.push([]);
      }
    }
  }

  // Step 5: Insert chunks with embeddings into database
  console.log(`[embed] Inserting ${allChunks.length} chunks into database...`);

  // Group chunks by file for insertion (to set contentHash per file)
  let currentFileKey = '';
  let fileChunks: ProcessedChunk[] = [];
  let fileEmbeddings: number[][] = [];
  let currentHash = '';

  for (let i = 0; i < allChunks.length; i++) {
    const chunk = allChunks[i];
    const fileKey = `${chunk.subject}/${chunk.subspecialty}/${chunk.topicSlug}/${chunk.sourceFile}`;

    if (fileKey !== currentFileKey && fileChunks.length > 0) {
      // Flush previous file's chunks
      const { inserted, errors } = await insertChunks(supabase, fileChunks, fileEmbeddings, currentHash);
      result.chunksCreated += inserted;
      if (errors > 0) {
        result.errors.push(`${errors} insert errors for ${currentFileKey}`);
      }
      fileChunks = [];
      fileEmbeddings = [];
    }

    currentFileKey = fileKey;
    currentHash = chunkFileHashes[i];
    fileChunks.push(chunk);
    fileEmbeddings.push(allEmbeddings[i] ?? []);
  }

  // Flush last file
  if (fileChunks.length > 0) {
    const { inserted, errors } = await insertChunks(supabase, fileChunks, fileEmbeddings, currentHash);
    result.chunksCreated += inserted;
    if (errors > 0) {
      result.errors.push(`${errors} insert errors for ${currentFileKey}`);
    }
  }

  result.durationMs = Date.now() - startTime;
  console.log(`[embed] Pipeline complete in ${(result.durationMs / 1000).toFixed(1)}s`);
  console.log(`[embed] Results: ${result.filesProcessed} files → ${result.chunksCreated} chunks, ${result.filesSkipped} skipped, ${result.errors.length} errors`);

  return result;
}

// =============================================================================
// API ROUTE HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  // Auth check: Bearer token must match ATOM_EMBED_SECRET
  const authHeader = request.headers.get('authorization');
  const embedSecret = process.env.ATOM_EMBED_SECRET;

  if (!embedSecret) {
    return NextResponse.json(
      { error: 'ATOM_EMBED_SECRET not configured' },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${embedSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Validate environment
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'Missing Supabase configuration' },
      { status: 500 }
    );
  }

  // Parse request body
  let body: { subject?: string; force?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    // Empty body is fine — process all subjects
  }

  const { subject, force } = body;

  // Validate subject if provided
  if (subject && typeof subject !== 'string') {
    return NextResponse.json(
      { error: 'subject must be a string' },
      { status: 400 }
    );
  }

  try {
    const result = await runEmbedPipeline({
      subject,
      force: Boolean(force),
      supabaseUrl,
      serviceRoleKey,
    });

    return NextResponse.json({
      success: true,
      ...result,
      // Truncate errors array for response (full errors logged to console)
      errors: result.errors.slice(0, 20),
      totalErrors: result.errors.length,
    });
  } catch (error) {
    console.error('[embed] Pipeline failed:', error);
    return NextResponse.json(
      {
        error: 'Embed pipeline failed',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET — Pipeline status / health check
// =============================================================================

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const embedSecret = process.env.ATOM_EMBED_SECRET;

  if (!embedSecret || authHeader !== `Bearer ${embedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Missing config' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // Get chunk counts by subject
  const { data: counts, error } = await supabase
    .from('content_chunks')
    .select('subject')
    .limit(10000);

  if (error) {
    return NextResponse.json(
      { error: 'Failed to query chunks', message: error.message },
      { status: 500 }
    );
  }

  // Aggregate counts
  const subjectCounts: Record<string, number> = {};
  for (const row of counts ?? []) {
    subjectCounts[row.subject] = (subjectCounts[row.subject] || 0) + 1;
  }

  const totalChunks = Object.values(subjectCounts).reduce((a, b) => a + b, 0);

  return NextResponse.json({
    status: 'ready',
    totalChunks,
    subjectCounts,
    embeddingModel: 'Xenova/bge-small-en-v1.5',
    chunkConfig: {
      maxTokens: 512,
      overlap: 64,
      strategy: 'header-aware + table-aware + mnemonic-aware',
    },
  });
}
