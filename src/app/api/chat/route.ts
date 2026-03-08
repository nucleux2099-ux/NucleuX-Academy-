import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { promises as fs } from 'fs'
import path from 'path'

const CONTENT_BASE = path.join(process.cwd(), 'content')

export const runtime = 'nodejs'

type ErrorWithMeta = {
  status?: number
  message?: string
  error?: {
    type?: string
    message?: string
  }
}

function parseErrorMeta(error: unknown): { code: string; message: string; status?: number } {
  const fallback = { code: 'unknown_error', message: 'Unexpected upstream error' }

  if (!error || typeof error !== 'object') return fallback

  const err = error as ErrorWithMeta
  const code = err.error?.type || (typeof (error as { name?: string }).name === 'string' ? (error as { name: string }).name : 'unknown_error')
  const message = err.error?.message || err.message || fallback.message

  return {
    code,
    message: message.slice(0, 240),
    status: typeof err.status === 'number' ? err.status : undefined,
  }
}

function logChatError(stage: string, error: unknown, extra: Record<string, unknown> = {}) {
  const meta = parseErrorMeta(error)
  console.error('[chat_api_error]', {
    stage,
    code: meta.code,
    status: meta.status,
    message: meta.message,
    ...extra,
  })
}

function resolveAnthropicModel(raw?: string): string {
  const candidate = (raw || '').trim()
  if (!candidate) return 'claude-sonnet-4-5'

  const legacyMap: Record<string, string> = {
    'claude-3-5-sonnet-latest': 'claude-sonnet-4-5',
    'claude-3-5-sonnet': 'claude-sonnet-4-5',
    'claude-3.5-sonnet': 'claude-sonnet-4-5',
    'claude-3.5-sonnet-latest': 'claude-sonnet-4-5',
  }

  return legacyMap[candidate] ?? candidate
}

type IncomingMessage = {
  role: string
  content: unknown
}

type SupportedImageMediaType = 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp'

function normalizeImageMediaType(input: unknown): SupportedImageMediaType {
  if (typeof input !== 'string') return 'image/png'

  const normalized = input.toLowerCase().trim()
  if (normalized === 'image/jpg') return 'image/jpeg'
  if (
    normalized === 'image/png' ||
    normalized === 'image/jpeg' ||
    normalized === 'image/gif' ||
    normalized === 'image/webp'
  ) {
    return normalized
  }
  return 'image/png'
}

// Context mapping: which folders to search for each context option
const contextFolders: Record<string, string[]> = {
  full: ['surgery', 'medicine', 'anatomy', 'pathology', 'physiology', 'biochemistry', 'pharmacology', 'obgyn', 'pediatrics', 'orthopedics', 'microbiology', 'forensic'],
  surgery: ['surgery'],
  medicine: ['medicine'],
  anatomy: ['anatomy'],
  pathology: ['pathology'],
  obgyn: ['obgyn'],
  pediatrics: ['pediatrics'],
}

// Recursively find all .md files in a directory
async function findMarkdownFiles(dir: string, maxFiles = 1000): Promise<string[]> {
  const files: string[] = []
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (files.length >= maxFiles) break
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        const subFiles = await findMarkdownFiles(fullPath, maxFiles - files.length)
        files.push(...subFiles)
      } else if (entry.name.endsWith('.md') && !entry.name.startsWith('_')) {
        files.push(fullPath)
      }
    }
  } catch {
    // Directory doesn't exist, skip
  }
  return files
}

// Medical synonym map for better matching
const SYNONYMS: Record<string, string[]> = {
  'appendicitis': ['appendix', 'appendiceal', 'rlq', 'mcburney'],
  'cholecystitis': ['gallbladder', 'gallstone', 'cholelithiasis', 'biliary'],
  'pancreatitis': ['pancreas', 'pancreatic', 'ranson'],
  'hernia': ['inguinal', 'femoral', 'umbilical', 'incisional', 'hiatal'],
  'cancer': ['carcinoma', 'malignancy', 'tumor', 'tumour', 'oncology', 'staging'],
  'obstruction': ['bowel', 'intestinal', 'ileus', 'volvulus'],
  'bleeding': ['hemorrhage', 'haemorrhage', 'gi bleed', 'hematemesis', 'melena'],
  'liver': ['hepatic', 'hepatobiliary', 'cirrhosis', 'portal'],
  'esophagus': ['esophageal', 'oesophagus', 'gerd', 'achalasia', 'dysphagia'],
  'stomach': ['gastric', 'peptic', 'ulcer', 'pyloric'],
  'colon': ['colorectal', 'colonic', 'rectal', 'sigmoid'],
  'thyroid': ['thyroidectomy', 'graves', 'hashimoto', 'goiter'],
  'breast': ['mastectomy', 'fibroadenoma', 'mammography'],
}

function expandKeywords(keywords: string[]): string[] {
  const expanded = new Set(keywords)
  for (const kw of keywords) {
    // Check if keyword matches any synonym group
    for (const [root, syns] of Object.entries(SYNONYMS)) {
      if (kw.includes(root) || syns.some(s => kw.includes(s))) {
        expanded.add(root)
        syns.forEach(s => expanded.add(s))
      }
    }
  }
  return Array.from(expanded)
}

function normalizeToken(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function buildSourceKeywords(selectedBookIds: string[] = [], deskSources: string[] = []): string[] {
  const keywords = new Set<string>()
  const stop = new Set(['textbook', 'principles', 'practice', 'of', 'and', 'for', 'review'])

  for (const id of selectedBookIds) {
    for (const token of normalizeToken(id).split(/\s+/)) {
      if (token.length >= 4 && !stop.has(token)) keywords.add(token)
    }
  }

  for (const title of deskSources) {
    for (const token of normalizeToken(title).split(/\s+/)) {
      if (token.length >= 4 && !stop.has(token)) keywords.add(token)
    }
  }

  return Array.from(keywords)
}

// Search files by path AND content for relevance (optionally source-biased)
async function findRelevantContent(
  query: string,
  contextId: string,
  maxChunks = 5,
  sourceKeywords: string[] = [],
): Promise<{ content: string; sourceBiased: boolean }> {
  const folders = contextFolders[contextId] || contextFolders.full
  const rawKeywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3)
  const keywords = expandKeywords(rawKeywords)
  
  const allFiles: string[] = []
  for (const folder of folders) {
    const folderPath = path.join(CONTENT_BASE, folder)
    const files = await findMarkdownFiles(folderPath, 1000)
    allFiles.push(...files)
  }

  const scopedFiles = sourceKeywords.length > 0
    ? allFiles.filter((filePath) => {
        const rel = filePath.replace(CONTENT_BASE, '').toLowerCase()
        return sourceKeywords.some((kw) => rel.includes(kw))
      })
    : allFiles

  const candidateFiles = scopedFiles.length > 0 ? scopedFiles : allFiles

  // Score files by keyword matches in BOTH path and content (first 2KB)
  const scored: { path: string; score: number }[] = []
  for (const filePath of candidateFiles) {
    const relativePath = filePath.replace(CONTENT_BASE, '').toLowerCase()
    let score = 0

    for (const kw of keywords) {
      if (relativePath.includes(kw)) score += 3
    }

    for (const sk of sourceKeywords) {
      if (relativePath.includes(sk)) score += 4
    }
    
    if (score === 0) {
      try {
        const content = await fs.readFile(filePath, 'utf-8')
        const preview = content.slice(0, 2000).toLowerCase()
        for (const kw of keywords) {
          const matches = preview.split(kw).length - 1
          score += matches
        }
      } catch { /* skip */ }
    }
    
    if (score > 0) scored.push({ path: filePath, score })
  }

  scored.sort((a, b) => b.score - a.score)
  const topFiles = scored.slice(0, maxChunks)

  const filesToRead = topFiles.length > 0
    ? topFiles.map(f => f.path)
    : candidateFiles.slice(0, 3)

  const chunks: string[] = []
  let totalChars = 0
  const MAX_CHARS = 30000

  for (const filePath of filesToRead) {
    if (totalChars >= MAX_CHARS) break
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const relativePath = path.relative(CONTENT_BASE, filePath)
      const truncated = content.slice(0, MAX_CHARS - totalChars)
      chunks.push(`--- Source: ${relativePath} ---\n${truncated}`)
      totalChars += truncated.length
    } catch {
      // Skip unreadable files
    }
  }

  return { content: chunks.join('\n\n'), sourceBiased: scopedFiles.length > 0 }
}

const ATOM_SYSTEM_PROMPT = `You are ATOM — the AI thinking partner inside NucleuX Academy, a medical education platform.

## Who You Are
- ATOM stands for Atomic Teaching Organism for Medicine
- You were created by two physician brothers who wanted to make medical learning atomic — breaking complex topics into fundamental units
- You are a teaching partner, NOT a search engine. You help students BUILD understanding.

## How You Teach
1. **Atomic approach**: Break complex topics into fundamental concepts first, then build up
2. **Always cite sources**: When referencing textbook content, mention the source (e.g., "According to Shackelford Ch. 35...")
3. **Clinical connections**: Connect basic science to clinical relevance
4. **Desirable difficulty**: Don't just give answers — help students think through problems
5. **Structured responses**: Use clear formatting with headers, bullet points, and bold for key terms

## Your Capabilities
- Answer medical questions grounded in textbook content provided as context
- Generate summaries, flashcards, and study aids
- Explain mechanisms and pathophysiology
- Create MCQs for practice
- Build clinical reasoning frameworks

## Rules
- If the context doesn't contain relevant information, say so honestly — but still help from your medical knowledge and note the limitation
- Never fabricate clinical data or statistics
- Always recommend verifying critical clinical decisions with standard textbooks
- Use markdown formatting for clear, readable responses
- Keep responses focused and high-yield
- When creating flashcards, use Q/A format with clear separation
- When quizzing, give ONE question at a time, wait for answer, then explain
- Always mention which textbook/source you're referencing when grounding in provided content
- Use clinical pearls and mnemonics when helpful

## Context Provided
You will receive relevant textbook content as context. Ground your answers in this content when available.`

export async function POST(request: NextRequest) {
  try {
    const { messages, context = 'surgery', deskSources = [], selectedBookIds = [], strictSourceGrounding = false, systemOverride } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages required' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      })
    }

    // Get the latest user message for content retrieval
    const lastUserMessage = [...messages].reverse().find((m: IncomingMessage) => m.role === 'user')
    const rawContent = lastUserMessage?.content || ''
    // Handle multimodal content (array of blocks) — extract text for search
    const query = typeof rawContent === 'string'
      ? rawContent
      : Array.isArray(rawContent)
        ? rawContent
            .filter((b): b is { type: string; text?: string } => (
              typeof b === 'object' &&
              b !== null &&
              'type' in b
            ))
            .filter((b) => b.type === 'text')
            .map((b) => (typeof b.text === 'string' ? b.text : ''))
            .join(' ')
        : ''

    // Find relevant content from the library
    const sourceKeywords = buildSourceKeywords(selectedBookIds, deskSources)
    const { content: relevantContent, sourceBiased } = await findRelevantContent(query, context, 5, sourceKeywords)

    // Build system prompt with context
    let systemPrompt = systemOverride || ATOM_SYSTEM_PROMPT
    
    // Add desk sources context if provided
    if (deskSources && deskSources.length > 0) {
      systemPrompt += `\n\n## Active Desk Sources\nThe student has these sources on their desk: ${deskSources.join(', ')}.`
      if (strictSourceGrounding) {
        systemPrompt += ` Only use evidence from these selected desk sources. If evidence is missing, clearly say the selected sources do not contain enough support.`
      } else {
        systemPrompt += ` Prioritize referencing these when answering.`
      }
      if (sourceKeywords.length > 0) {
        systemPrompt += `\nSource routing keywords: ${sourceKeywords.join(', ')}`
      }
      if (!sourceBiased) {
        systemPrompt += `\nWarning: Could not map file paths strongly to selected sources; answer cautiously and disclose low source certainty.`
      }
    }
    
    if (relevantContent) {
      systemPrompt += `\n\n## Library Content (use this to ground your answers)\n\n${relevantContent}`
    } else {
      systemPrompt += `\n\n[No specific library content found for this query. Answer from your medical knowledge but note that you're answering without textbook grounding.]`
    }

    // Use API key from env
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      logChatError('anthropic_api_key_missing', new Error('Missing ANTHROPIC_API_KEY'))
      return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured', code: 'anthropic_api_key_missing' }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      })
    }

    const client = new Anthropic({ apiKey })
    const model = resolveAnthropicModel(process.env.ANTHROPIC_MODEL)

    // Format messages for Anthropic (supports text and vision)
    const formattedMessages: Anthropic.MessageParam[] = messages.map((m: IncomingMessage) => {
      const role: 'user' | 'assistant' = m.role === 'assistant' ? 'assistant' : 'user'

      // If content is an array (multimodal — text + image), format for Claude Vision
      if (Array.isArray(m.content)) {
        const blocks: Array<
          | { type: 'text'; text: string }
          | {
              type: 'image'
              source: {
                type: 'base64'
                media_type: SupportedImageMediaType
                data: string
              }
            }
        > = []
        for (const part of m.content) {
          if (
            typeof part === 'object' &&
            part !== null &&
            'type' in part &&
            part.type === 'text' &&
            'text' in part &&
            typeof part.text === 'string'
          ) {
            blocks.push({ type: 'text', text: part.text })
          } else if (
            typeof part === 'object' &&
            part !== null &&
            'type' in part &&
            part.type === 'image' &&
            'source' in part &&
            typeof part.source === 'object' &&
            part.source !== null &&
            'data' in part.source &&
            typeof part.source.data === 'string'
          ) {
            blocks.push({
              type: 'image',
              source: {
                type: 'base64',
                media_type: normalizeImageMediaType(
                  'media_type' in part.source ? part.source.media_type : undefined
                ),
                data: part.source.data,
              },
            })
          }
        }
        return { role, content: blocks }
      }
      // Plain text message
      return {
        role,
        content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
      }
    })

    // Stream the response
    const stream = client.messages.stream({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: formattedMessages,
    })

    // Create a readable stream for the response
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta') {
              const delta = event.delta
              if ('text' in delta) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: delta.text })}\n\n`))
              }
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          const meta = parseErrorMeta(error)
          logChatError('anthropic_stream_iterate', error, { model })
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            error: `Stream error: ${meta.message}`,
            code: meta.code,
            stage: 'anthropic_stream_iterate',
          })}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    if (error instanceof Response) return error

    logChatError('chat_route_unhandled', error)
    const meta = parseErrorMeta(error)
    return new Response(JSON.stringify({
      error: 'Internal server error',
      code: meta.code,
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }
}
