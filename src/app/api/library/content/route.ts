import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { 
  getSubjectFolder, 
  getContentFolder, 
  getContentFilename,
  getContentFilenameForSubject,
  SUBSPECIALTY_CONTENT_MAP
} from '@/lib/data/content-mapping'

const CONTENT_BASE = path.join(process.cwd(), 'content')

function isSafeSegment(value: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(value)
}

function appendSafePath(base: string, segment: string): string | null {
  if (!isSafeSegment(segment)) return null
  const next = `${base.replace(/\/$/, '')}/${segment}`
  const normalizedBase = path.resolve(base)
  const normalizedNext = path.resolve(next)
  return normalizedNext.startsWith(normalizedBase) ? normalizedNext : null
}

const modeFiles: Record<string, string> = {
  'explorer': 'explorer.md',
  'exam-prep': 'exam-prep.md',
  'textbook': 'textbook.md',
  'cards': 'retrieval-cards.json',
  'procedure': 'procedure-*.md',
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Support multiple formats:
  // 1. subject + subspecialty + topic → load rich markdown (new multi-subject)
  // 2. subspecialty + topic → load rich markdown (legacy surgery-only)
  // 3. system + topic + mode → load structured content (NMC curriculum)
  
  const subject = searchParams.get('subject')
  const subspecialty = searchParams.get('subspecialty')
  const topic = searchParams.get('topic')
  const system = searchParams.get('system')
  const mode = searchParams.get('mode')

  // New format: subject + subspecialty + topic → load rich markdown
  if (subject && subspecialty && topic) {
    return loadRichContentForSubject(subject, subspecialty, topic)
  }

  // Legacy format: subspecialty + topic (surgery only)
  if (subspecialty && topic && !subject) {
    return loadRichContentLegacy(subspecialty, topic)
  }

  // Old format: system + topic + mode (NMC curriculum)
  if (!system || !topic || !mode) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  try {
    const topicDir = path.join(CONTENT_BASE, 'surgery', system, topic)
    
    // Check if directory exists
    try {
      await fs.access(topicDir)
    } catch {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
    }

    if (mode === 'cards') {
      const cardsPath = path.join(topicDir, 'retrieval-cards.json')
      try {
        const cardsContent = await fs.readFile(cardsPath, 'utf-8')
        const cardsData = JSON.parse(cardsContent)
        return NextResponse.json({ cards: cardsData.cards || [] })
      } catch {
        return NextResponse.json({ error: 'Retrieval cards not available', cards: [] })
      }
    } else if (mode === 'procedure') {
      const files = await fs.readdir(topicDir)
      const procedureFile = files.find(f => f.startsWith('procedure-') && f.endsWith('.md'))
      
      if (procedureFile) {
        const content = await fs.readFile(path.join(topicDir, procedureFile), 'utf-8')
        return NextResponse.json({ content })
      } else {
        return NextResponse.json({ error: 'Procedure not available' })
      }
    } else {
      const fileName = modeFiles[mode] || `${mode}.md`
      const filePath = path.join(topicDir, fileName)
      
      try {
        const content = await fs.readFile(filePath, 'utf-8')
        return NextResponse.json({ content })
      } catch {
        return NextResponse.json({ error: `${mode} mode not available for this topic` })
      }
    }
  } catch (error) {
    console.error('Error loading content:', error)
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 })
  }
}

// Load rich markdown content for any subject
async function loadRichContentForSubject(subjectSlug: string, subspecialtySlug: string, topicSlug: string) {
  try {
    const subjectFolder = getSubjectFolder(subjectSlug)
    const subspecialtyFolder = getContentFolder(subjectSlug, subspecialtySlug)
    const filename = getContentFilenameForSubject(subjectSlug, subspecialtySlug, topicSlug)
    
    if (!subjectFolder || !subspecialtyFolder) {
      // Try direct file access if not in mapping
      return tryDirectAccess(subjectSlug, subspecialtySlug, topicSlug)
    }

    // Try folder-based first: {subject}/{subspecialty}/{topic}/textbook.md
    const folderTextbook = path.join(CONTENT_BASE, subjectFolder, subspecialtyFolder, topicSlug, 'textbook.md')
    const normalizedFolder = path.normalize(folderTextbook)
    if (normalizedFolder.startsWith(CONTENT_BASE)) {
      try {
        const content = await fs.readFile(folderTextbook, 'utf-8')
        return NextResponse.json({ content, hasRichContent: true })
      } catch {}
    }

    // Try flat file: {subject}/{subspecialty}/{filename}.md
    if (filename) {
      const filePath = path.join(CONTENT_BASE, subjectFolder, subspecialtyFolder, `${filename}.md`)
      const normalizedPath = path.normalize(filePath)
      if (normalizedPath.startsWith(CONTENT_BASE)) {
        try {
          const content = await fs.readFile(filePath, 'utf-8')
          return NextResponse.json({ content, hasRichContent: true })
        } catch {}
      }
    }

    // Fallback to direct access with smart resolution
    return tryDirectAccess(subjectSlug, subspecialtySlug, topicSlug)
  } catch (error) {
    console.error('Error loading rich content:', error)
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 })
  }
}

// Try to load content directly from file system
// Supports: folder-based (topic/textbook.md), flat (topic.md), and numbered dirs
async function tryDirectAccess(subjectSlug: string, subspecialtySlug: string, topicSlug: string) {
  try {
    const mappedSubspecialty = SUBSPECIALTY_CONTENT_MAP[subjectSlug]?.[subspecialtySlug]
    const candidates = [subspecialtySlug, ...(mappedSubspecialty ? [mappedSubspecialty] : [])]

    const subjectDir = path.join(CONTENT_BASE, subjectSlug)
    const normalizedSubjectDir = path.normalize(subjectDir)
    if (!normalizedSubjectDir.startsWith(CONTENT_BASE)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    let subspecialtyDir: string | null = null
    for (const candidate of candidates) {
      const tryPath = appendSafePath(subjectDir, candidate)
      if (!tryPath) continue

      const normalizedTryPath = path.normalize(tryPath)
      if (!normalizedTryPath.startsWith(normalizedSubjectDir)) continue

      try {
        const stat = await fs.stat(tryPath)
        if (stat.isDirectory()) {
          subspecialtyDir = tryPath
          break
        }
      } catch {}
    }

    if (!subspecialtyDir) {
      return NextResponse.json({ error: 'Subspecialty not found', hasRichContent: false }, { status: 404 })
    }

    // Try folder-based: {subspecialty}/{topic}/textbook.md
    const folderTextbook = path.join(subspecialtyDir, topicSlug, 'textbook.md')
    try {
      const content = await fs.readFile(folderTextbook, 'utf-8')
      return NextResponse.json({ content, hasRichContent: true })
    } catch {}

    // Try flat file: {subspecialty}/{topic}.md
    const flatFile = path.join(subspecialtyDir, `${topicSlug}.md`)
    try {
      const content = await fs.readFile(flatFile, 'utf-8')
      return NextResponse.json({ content, hasRichContent: true })
    } catch {}

    return NextResponse.json({ error: 'Content file not found', hasRichContent: false }, { status: 404 })
  } catch (error) {
    console.error('Error in direct access:', error)
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 })
  }
}

// Legacy: Load rich markdown content for surgery only
async function loadRichContentLegacy(subspecialtySlug: string, topicSlug: string) {
  try {
    const folder = getContentFolder('surgery', subspecialtySlug)
    const filename = getContentFilename(subspecialtySlug, topicSlug)
    
    if (!folder || !filename) {
      return NextResponse.json({ 
        error: 'Rich content not available',
        hasRichContent: false 
      }, { status: 404 })
    }

    const filePath = path.join(CONTENT_BASE, 'surgery', folder, `${filename}.md`)
    
    const normalizedPath = path.normalize(filePath)
    if (!normalizedPath.startsWith(CONTENT_BASE)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    try {
      const content = await fs.readFile(filePath, 'utf-8')
      return NextResponse.json({ 
        content,
        hasRichContent: true,
        folder,
        filename 
      })
    } catch {
      return NextResponse.json({ 
        error: 'Content file not found',
        hasRichContent: false 
      }, { status: 404 })
    }
  } catch (error) {
    console.error('Error loading rich content:', error)
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 })
  }
}
