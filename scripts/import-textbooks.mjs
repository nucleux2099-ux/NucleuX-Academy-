// NucleuX Academy - Full Textbook Import Script
// Imports textbook chapters with images to Supabase

import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, basename, dirname, extname } from 'path';
import { writeFileSync } from 'fs';

// We don't need Supabase client for SQL generation
// const supabaseUrl = 'https://qwkuoygcvkbomunazpce.supabase.co';

const SOURCE_LIB = "/Users/adityachandrabhatla/Library/Mobile Documents/iCloud~md~obsidian/Documents/Aditya's Zettelkasten/03 Spaces/🎓 Learning/Active System/Source Library";

const TEXTBOOKS = {
  'Fischer Mastery of Surgery 7th Ed': {
    short: 'fischer',
    edition: '7th',
    specialty: 'surgery',
    subdir: 'markdown'
  },
  'Maingot 12th Ed': {
    short: 'maingot',
    edition: '12th',
    specialty: 'surgery',
    subdir: null
  },
  'Gray Surgical Anatomy 1st Ed': {
    short: 'gray-anatomy',
    edition: '1st',
    specialty: 'anatomy',
    subdir: null
  },
  'Blumgart 7th Ed': {
    short: 'blumgart',
    edition: '7th',
    specialty: 'surgery',
    subdir: null
  }
};

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100)
    .trim();
}

function escapeSQL(str) {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

function extractChapterInfo(filename) {
  // Extract chapter number and title from filename
  // e.g., "Ch025 - Neck Dissection.md" -> { chapter: "25", title: "Neck Dissection" }
  const match = filename.match(/Ch?(\d+)\s*[-–]\s*(.+)\.md$/i);
  if (match) {
    return { chapter: match[1], title: match[2].trim() };
  }
  // Fallback: use filename without extension
  return { chapter: null, title: basename(filename, '.md') };
}

function findMdFiles(dir, files = []) {
  if (!existsSync(dir)) return files;
  
  const items = readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      findMdFiles(fullPath, files);
    } else if (item.name.endsWith('.md') && statSync(fullPath).size > 1000) {
      files.push(fullPath);
    }
  }
  return files;
}

function findImages(mdDir) {
  // Find all image files in the same directory as the markdown
  const images = [];
  if (!existsSync(mdDir)) return images;
  
  const items = readdirSync(mdDir);
  for (const item of items) {
    const ext = extname(item).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
      images.push(join(mdDir, item));
    }
  }
  return images;
}

async function uploadImage(imagePath, bucket, remotePath) {
  try {
    const fileBuffer = readFileSync(imagePath);
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(remotePath, fileBuffer, {
        contentType: `image/${extname(imagePath).slice(1)}`,
        upsert: true
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(remotePath);
    return urlData.publicUrl;
  } catch (e) {
    console.error(`Failed to upload ${imagePath}: ${e.message}`);
    return null;
  }
}

function processMarkdownImages(content, imageUrlMap) {
  // Replace local image references with Supabase URLs
  // Pattern: ![](_page_0_Figure_3.jpeg) or ![alt](image.png)
  return content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    // Check if it's a local image reference
    if (!src.startsWith('http') && !src.startsWith('data:')) {
      const imageName = basename(src);
      const newUrl = imageUrlMap[imageName];
      if (newUrl) {
        return `![${alt}](${newUrl})`;
      }
    }
    return match;
  });
}

function generateSQL(chapters) {
  let sql = `-- NucleuX Academy - Textbook Content Import
-- Generated: ${new Date().toISOString()}
-- Total chapters: ${chapters.length}

`;

  for (const ch of chapters) {
    const contentJson = JSON.stringify({
      markdown: ch.content,
      format: 'markdown',
      images: ch.images || []
    }).replace(/'/g, "''");

    sql += `INSERT INTO atoms (title, slug, type, content, summary, specialty, system, topic, subtopic, tags, source_textbook, source_edition, source_chapter, difficulty, read_time_minutes, is_premium, is_published)
VALUES (
  ${escapeSQL(ch.title)},
  ${escapeSQL(ch.slug)},
  'textbook_chapter',
  '${contentJson}'::jsonb,
  ${escapeSQL(ch.summary)},
  ${escapeSQL(ch.specialty)},
  ${escapeSQL(ch.system || 'general')},
  ${escapeSQL(ch.topic)},
  NULL,
  ARRAY[${ch.tags.map(t => `'${t}'`).join(',')}],
  ${escapeSQL(ch.textbook)},
  ${escapeSQL(ch.edition)},
  ${escapeSQL(ch.chapter)},
  2,
  ${ch.readTime},
  false,
  true
) ON CONFLICT (slug) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW();

`;
  }
  
  return sql;
}

async function processTextbook(bookName, config) {
  console.log(`\n📚 Processing: ${bookName}`);
  
  const bookPath = join(SOURCE_LIB, bookName);
  const searchPath = config.subdir ? join(bookPath, config.subdir) : bookPath;
  
  const mdFiles = findMdFiles(searchPath);
  console.log(`   Found ${mdFiles.length} chapters`);
  
  const chapters = [];
  
  for (const mdFile of mdFiles) {
    const filename = basename(mdFile);
    const mdDir = dirname(mdFile);
    const { chapter, title } = extractChapterInfo(filename);
    
    // Read content
    let content = readFileSync(mdFile, 'utf-8');
    
    // Find and note images (for now, just reference them)
    const images = findImages(mdDir);
    const imageNames = images.map(i => basename(i));
    
    // Extract summary (first paragraph)
    const summaryMatch = content.match(/^(?:#[^\n]*\n+)?([^#\n][^\n]+)/m);
    const summary = summaryMatch ? summaryMatch[1].substring(0, 300) : '';
    
    // Calculate read time
    const words = content.split(/\s+/).length;
    const readTime = Math.ceil(words / 200);
    
    // Determine topic from path
    const pathParts = mdFile.replace(searchPath, '').split('/').filter(Boolean);
    const topic = pathParts.length > 1 ? slugify(pathParts[0]) : config.short;
    
    chapters.push({
      title: `${title} (${config.short.toUpperCase()})`,
      slug: `${config.short}-ch${chapter || 'x'}-${slugify(title)}`,
      content,
      summary,
      specialty: config.specialty,
      system: topic,
      topic: config.short,
      textbook: bookName,
      edition: config.edition,
      chapter: chapter || 'N/A',
      tags: [config.short, config.specialty, 'textbook'],
      images: imageNames,
      readTime
    });
  }
  
  return chapters;
}

async function main() {
  console.log('🚀 NucleuX Academy - Textbook Import');
  console.log('=====================================\n');
  
  let allChapters = [];
  
  for (const [bookName, config] of Object.entries(TEXTBOOKS)) {
    const chapters = await processTextbook(bookName, config);
    allChapters = allChapters.concat(chapters);
  }
  
  console.log(`\n📊 Total: ${allChapters.length} chapters`);
  
  // Generate SQL
  const sql = generateSQL(allChapters);
  const outputPath = './supabase/seeds/textbook_content.sql';
  writeFileSync(outputPath, sql);
  
  console.log(`\n✅ Generated: ${outputPath}`);
  console.log(`   Size: ${(sql.length / 1024 / 1024).toFixed(2)} MB`);
  console.log('\nRun this SQL in Supabase dashboard to import all textbook content!');
}

main().catch(console.error);
