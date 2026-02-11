import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { 
  getSubjectFolder, 
  getContentFolder, 
  getContentFilename,
  getContentFilenameForSubject 
} from '@/lib/data/content-mapping'

const CONTENT_BASE = path.join(process.cwd(), 'content')

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

    const filePath = path.join(CONTENT_BASE, subjectFolder, subspecialtyFolder, `${filename}.md`)
    
    // Security check
    const normalizedPath = path.normalize(filePath)
    if (!normalizedPath.startsWith(CONTENT_BASE)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    try {
      const content = await fs.readFile(filePath, 'utf-8')
      return NextResponse.json({ 
        content,
        hasRichContent: true,
        subject: subjectFolder,
        subspecialty: subspecialtyFolder,
        filename 
      })
    } catch {
      // Try direct access
      return tryDirectAccess(subjectSlug, subspecialtySlug, topicSlug)
    }
  } catch (error) {
    console.error('Error loading rich content:', error)
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 })
  }
}

// Try to load content directly from file system
async function tryDirectAccess(subjectSlug: string, subspecialtySlug: string, topicSlug: string) {
  try {
    // Try direct path: content/{subject}/{subspecialty}/{topic}.md
    const filePath = path.join(CONTENT_BASE, subjectSlug, subspecialtySlug, `${topicSlug}.md`)
    
    const normalizedPath = path.normalize(filePath)
    if (!normalizedPath.startsWith(CONTENT_BASE)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    try {
      const content = await fs.readFile(filePath, 'utf-8')
      return NextResponse.json({ 
        content,
        hasRichContent: true,
        subject: subjectSlug,
        subspecialty: subspecialtySlug,
        topic: topicSlug 
      })
    } catch {
      return NextResponse.json({ 
        error: 'Content file not found',
        hasRichContent: false 
      }, { status: 404 })
    }
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
