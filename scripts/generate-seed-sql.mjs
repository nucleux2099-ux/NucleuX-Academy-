// Generate SQL seed file for library content
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';
import { join, basename } from 'path';
import yaml from 'js-yaml';

const CONTENT_DIR = './content';
const OUTPUT_FILE = './supabase/seeds/library_content.sql';

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function escapeSQL(str) {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

function parseMarkdownFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (match) {
    try {
      const frontmatter = yaml.load(match[1]);
      const body = content.slice(match[0].length).trim();
      return { frontmatter, body };
    } catch (_e) {
      return { frontmatter: {}, body: content };
    }
  }
  return { frontmatter: {}, body: content };
}

function extractSummary(content, maxLength = 300) {
  const plainText = content
    .replace(/^#+\s+.*/gm, '')
    .replace(/\*\*|__/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\|.*\|/g, '')
    .trim();
  const firstPara = plainText.split('\n\n')[0] || plainText;
  return firstPara.length > maxLength ? firstPara.slice(0, maxLength) + '...' : firstPara;
}

function estimateReadTime(content) {
  return Math.ceil(content.split(/\s+/).length / 200);
}

let sqlStatements = [];

sqlStatements.push(`-- NucleuX Academy - Library Content Seed
-- Generated: ${new Date().toISOString()}
-- Run this in Supabase SQL Editor

`);

function processTopicFolder(subject, topicPath, topicSlug) {
  const indexPath = join(topicPath, '_index.yaml');
  let topicMeta = {};
  
  if (existsSync(indexPath)) {
    topicMeta = yaml.load(readFileSync(indexPath, 'utf-8'));
  }
  
  const files = readdirSync(topicPath).filter(f => f.endsWith('.md') && !f.startsWith('_') && f !== 'Esophagus Index.md');
  
  console.log(`📁 ${topicSlug}: ${files.length} files`);
  
  for (const file of files) {
    const filePath = join(topicPath, file);
    const content = readFileSync(filePath, 'utf-8');
    const { frontmatter, body } = parseMarkdownFrontmatter(content);
    
    const title = frontmatter.title || basename(file, '.md');
    const slug = `${subject}-${topicSlug}-${slugify(title)}`;
    
    const contentJson = JSON.stringify({
      markdown: body,
      format: 'markdown'
    }).replace(/'/g, "''");
    
    const tags = frontmatter.tags || topicMeta.exam_relevance || [];
    const tagsArray = tags.length > 0 ? `ARRAY[${tags.map(t => `'${t}'`).join(',')}]` : 'NULL';
    
    const sql = `INSERT INTO atoms (title, slug, type, content, summary, specialty, system, topic, subtopic, tags, source_textbook, source_edition, source_chapter, difficulty, read_time_minutes, is_premium, is_published)
VALUES (
  ${escapeSQL(title)},
  ${escapeSQL(slug)},
  ${escapeSQL(frontmatter.type || 'concept')},
  '${contentJson}'::jsonb,
  ${escapeSQL(extractSummary(body))},
  ${escapeSQL(subject)},
  ${escapeSQL(topicMeta.system || frontmatter.system || 'upper_gi')},
  ${escapeSQL(topicSlug)},
  ${escapeSQL(frontmatter.subtopic || null)},
  ${tagsArray},
  ${escapeSQL(frontmatter.source_book || topicMeta.sources?.primary?.[0]?.book || null)},
  ${escapeSQL(frontmatter.source_edition || topicMeta.sources?.primary?.[0]?.edition || null)},
  ${escapeSQL(frontmatter.source_chapters?.[0]?.toString() || null)},
  ${frontmatter.difficulty || 2},
  ${estimateReadTime(body)},
  ${frontmatter.premium || false},
  true
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  summary = EXCLUDED.summary,
  updated_at = NOW();

`;
    
    sqlStatements.push(sql);
  }
}

function processSubject(subjectPath, subjectName) {
  const topics = readdirSync(subjectPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  
  console.log(`\n📚 ${subjectName.toUpperCase()}: ${topics.join(', ')}`);
  
  for (const topic of topics) {
    const topicPath = join(subjectPath, topic);
    // Only process if there are .md files
    const hasMd = readdirSync(topicPath).some(f => f.endsWith('.md'));
    if (hasMd) {
      processTopicFolder(subjectName, topicPath, topic);
    }
  }
}

// Main
console.log('🚀 Generating SQL seed file...\n');

const subjects = readdirSync(CONTENT_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith('.'))
  .map(d => d.name);

for (const subject of subjects) {
  processSubject(join(CONTENT_DIR, subject), subject);
}

// Write output
writeFileSync(OUTPUT_FILE, sqlStatements.join(''));
console.log(`\n✅ Generated: ${OUTPUT_FILE}`);
console.log(`   Total statements: ${sqlStatements.length - 1}`);
