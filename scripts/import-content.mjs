// NucleuX Academy - Content Import Script
// Imports markdown content from content/ folder into Supabase atoms table

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import yaml from 'js-yaml';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qwkuoygcvkbomunazpce.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3a3VveWdjdmtib211bmF6cGNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0Nzk3ODYsImV4cCI6MjA4NjA1NTc4Nn0.2CY40gCHMrmXTVUPVT8mDFHZuhRy0XCmKvUkfuHyGdo';

const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

const CONTENT_DIR = './content';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function parseMarkdownFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    try {
      const frontmatter = yaml.load(frontmatterMatch[1]);
      const body = content.slice(frontmatterMatch[0].length).trim();
      return { frontmatter, body };
    } catch (_e) {
      return { frontmatter: {}, body: content };
    }
  }
  return { frontmatter: {}, body: content };
}

function extractSummary(content, maxLength = 300) {
  // Remove markdown formatting and get first paragraph
  const plainText = content
    .replace(/^#+\s+.*/gm, '') // Remove headers
    .replace(/\*\*|__/g, '') // Remove bold
    .replace(/\*|_/g, '') // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with text
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // Remove images
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/\|.*\|/g, '') // Remove table rows
    .replace(/[-*+]\s+/g, '') // Remove list markers
    .trim();
  
  const firstPara = plainText.split('\n\n')[0] || plainText;
  return firstPara.length > maxLength 
    ? firstPara.slice(0, maxLength) + '...' 
    : firstPara;
}

function estimateReadTime(content) {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200); // 200 words per minute
}

async function importTopicFolder(subject, topicPath, topicSlug) {
  const indexPath = join(topicPath, '_index.yaml');
  let topicMeta = {};
  
  if (existsSync(indexPath)) {
    topicMeta = yaml.load(readFileSync(indexPath, 'utf-8'));
  }
  
  const files = readdirSync(topicPath).filter(f => 
    f.endsWith('.md') && !f.startsWith('_')
  );
  
  console.log(`\n📁 Processing ${topicSlug}: ${files.length} files`);
  
  let imported = 0;
  let errors = 0;
  
  for (const file of files) {
    const filePath = join(topicPath, file);
    const content = readFileSync(filePath, 'utf-8');
    const { frontmatter, body } = parseMarkdownFrontmatter(content);
    
    const title = frontmatter.title || basename(file, '.md').replace(/-/g, ' ');
    const slug = `${subject}-${topicSlug}-${slugify(title)}`;
    
    const atom = {
      title,
      slug,
      type: frontmatter.type || 'concept',
      content: {
        markdown: body,
        format: 'markdown'
      },
      summary: frontmatter.summary || extractSummary(body),
      specialty: subject,
      system: topicMeta.system || 'general',
      topic: topicSlug,
      subtopic: frontmatter.subtopic || null,
      tags: frontmatter.tags || topicMeta.exam_relevance || [],
      source_type: 'textbook',
      source_textbook: frontmatter.source?.book || topicMeta.sources?.primary?.[0]?.book || null,
      source_edition: frontmatter.source?.edition || topicMeta.sources?.primary?.[0]?.edition || null,
      source_chapter: frontmatter.source?.chapter || null,
      source_page: frontmatter.source?.page || null,
      difficulty: frontmatter.difficulty || 2,
      read_time_minutes: estimateReadTime(body),
      is_premium: frontmatter.premium || false,
      is_published: true
    };
    
    try {
      // Upsert to handle re-imports
      const { error } = await supabase
        .from('atoms')
        .upsert(atom, { onConflict: 'slug' })
        .select();
      
      if (error) {
        console.error(`  ❌ ${title}: ${error.message}`);
        errors++;
      } else {
        console.log(`  ✅ ${title}`);
        imported++;
      }
    } catch (e) {
      console.error(`  ❌ ${title}: ${e.message}`);
      errors++;
    }
  }
  
  return { imported, errors };
}

async function importSubject(subjectPath, subjectName) {
  const topics = readdirSync(subjectPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  
  console.log(`\n📚 Subject: ${subjectName.toUpperCase()}`);
  console.log(`   Topics: ${topics.join(', ')}`);
  
  let totalImported = 0;
  let totalErrors = 0;
  
  for (const topic of topics) {
    const topicPath = join(subjectPath, topic);
    const { imported, errors } = await importTopicFolder(subjectName, topicPath, topic);
    totalImported += imported;
    totalErrors += errors;
  }
  
  return { imported: totalImported, errors: totalErrors };
}

async function main() {
  console.log('🚀 NucleuX Academy Content Import');
  console.log('==================================\n');
  
  const subjects = readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .map(d => d.name);
  
  console.log(`Found subjects: ${subjects.join(', ')}`);
  
  let grandTotal = { imported: 0, errors: 0 };
  
  for (const subject of subjects) {
    const subjectPath = join(CONTENT_DIR, subject);
    const { imported, errors } = await importSubject(subjectPath, subject);
    grandTotal.imported += imported;
    grandTotal.errors += errors;
  }
  
  console.log('\n==================================');
  console.log(`✅ Total imported: ${grandTotal.imported}`);
  console.log(`❌ Total errors: ${grandTotal.errors}`);
}

main().catch(console.error);
