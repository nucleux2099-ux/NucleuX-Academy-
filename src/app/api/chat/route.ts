import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { promises as fs } from 'fs'
import path from 'path'

const CONTENT_BASE = path.join(process.cwd(), 'content')

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
async function findMarkdownFiles(dir: string, maxFiles = 20): Promise<string[]> {
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

// Search files by path AND content for relevance
async function findRelevantContent(query: string, contextId: string, maxChunks = 5): Promise<string> {
  const folders = contextFolders[contextId] || contextFolders.full
  const rawKeywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3)
  const keywords = expandKeywords(rawKeywords)
  
  const allFiles: string[] = []
  for (const folder of folders) {
    const folderPath = path.join(CONTENT_BASE, folder)
    const files = await findMarkdownFiles(folderPath, 100)
    allFiles.push(...files)
  }

  // Score files by keyword matches in BOTH path and content (first 2000 chars)
  const scored: { path: string; score: number }[] = []
  for (const filePath of allFiles) {
    const relativePath = filePath.replace(CONTENT_BASE, '').toLowerCase()
    let score = 0
    
    // Path matching (high weight — file name is very indicative)
    for (const kw of keywords) {
      if (relativePath.includes(kw)) score += 3
    }
    
    // Content matching (read first 2KB for speed)
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

  // Sort by score, take top N
  scored.sort((a, b) => b.score - a.score)
  const topFiles = scored.slice(0, maxChunks)

  // If no matches, take first few files as general context
  const filesToRead = topFiles.length > 0 
    ? topFiles.map(f => f.path) 
    : allFiles.slice(0, 3)

  // Read and concatenate
  const chunks: string[] = []
  let totalChars = 0
  const MAX_CHARS = 30000 // ~7500 tokens context window budget

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

  return chunks.join('\n\n')
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
    const { messages, context = 'surgery', deskSources = [], systemOverride } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages required' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      })
    }

    // Get the latest user message for content retrieval
    const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
    const rawContent = lastUserMessage?.content || ''
    // Handle multimodal content (array of blocks) — extract text for search
    const query = typeof rawContent === 'string'
      ? rawContent
      : Array.isArray(rawContent)
        ? rawContent.filter((b: any) => b.type === 'text').map((b: any) => b.text).join(' ')
        : ''

    // Find relevant content from the library
    const relevantContent = await findRelevantContent(query, context)

    // Build system prompt with context
    let systemPrompt = systemOverride || ATOM_SYSTEM_PROMPT
    
    // Add desk sources context if provided
    if (deskSources && deskSources.length > 0) {
      systemPrompt += `\n\n## Active Desk Sources\nThe student has these sources on their desk: ${deskSources.join(', ')}. Prioritize referencing these when answering.`
    }
    
    if (relevantContent) {
      systemPrompt += `\n\n## Library Content (use this to ground your answers)\n\n${relevantContent}`
    } else {
      systemPrompt += `\n\n[No specific library content found for this query. Answer from your medical knowledge but note that you're answering without textbook grounding.]`
    }

    // Use API key from env
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      })
    }

    const client = new Anthropic({ apiKey })

    // Format messages for Anthropic (supports text and vision)
    const formattedMessages = messages.map((m: { role: string; content: any }) => {
      // If content is an array (multimodal — text + image), format for Claude Vision
      if (Array.isArray(m.content)) {
        const blocks: any[] = []
        for (const part of m.content) {
          if (part.type === 'text') {
            blocks.push({ type: 'text', text: part.text })
          } else if (part.type === 'image' && part.source) {
            blocks.push({
              type: 'image',
              source: {
                type: 'base64',
                media_type: part.source.media_type || 'image/png',
                data: part.source.data,
              },
            })
          }
        }
        return { role: m.role as 'user' | 'assistant', content: blocks }
      }
      // Plain text message
      return {
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }
    })

    // Stream the response
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
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
          console.error('Stream error:', error)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`))
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
    console.error('Chat API error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }
}
