#!/usr/bin/env tsx

/**
 * Validate NucleuX Academy /content structure.
 *
 * Usage:
 *   bun run content:validate
 */

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const CONTENT_DIR = path.join(process.cwd(), 'content');

type Problem = { level: 'error' | 'warn'; where: string; message: string };
type TopicCategory = { topics?: string[] };
type SubspecialtyIndex = { categories?: TopicCategory[]; topics?: string[] };

function isDir(p: string) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function readYaml(filePath: string): unknown {
  const raw = fs.readFileSync(filePath, 'utf8');
  return yaml.load(raw);
}

function listDirs(p: string) {
  if (!isDir(p)) return [];
  return fs.readdirSync(p)
    .filter(name => !name.startsWith('.'))
    .map(name => path.join(p, name))
    .filter(isDir);
}

function validateTopicDir(topicDir: string, problems: Problem[]) {
  const meta = path.join(topicDir, '_meta.yaml');
  const explorer = path.join(topicDir, 'explorer.md');

  if (!fs.existsSync(meta)) {
    problems.push({ level: 'warn', where: topicDir, message: 'Missing _meta.yaml (recommended)' });
  }
  if (!fs.existsSync(explorer)) {
    problems.push({ level: 'warn', where: topicDir, message: 'Missing explorer.md (required for Explorer view)' });
  }

  // Validate retrieval cards json if present
  const cards = path.join(topicDir, 'retrieval-cards.json');
  if (fs.existsSync(cards)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(cards, 'utf8'));
      const arr = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.cards)
          ? parsed.cards
          : null;

      if (!arr) throw new Error('Expected array or {cards: []}');

      for (const [i, card] of arr.entries()) {
        const q = card?.question ?? card?.front;
        const a = card?.answer ?? card?.back;
        if (!q || !a) {
          problems.push({
            level: 'warn',
            where: `${cards}[${i}]`,
            message: 'Retrieval card should have question/answer (or front/back)',
          });
        }
      }
	    } catch (e: unknown) {
	      const message = e instanceof Error ? e.message : 'unknown parse error';
	      problems.push({ level: 'warn', where: cards, message: `Invalid JSON: ${message}` });
	    }
	  }
}

function validateSubspecialty(subDir: string, problems: Problem[]) {
  const indexPath = path.join(subDir, '_index.yaml');
  if (!fs.existsSync(indexPath)) {
    problems.push({ level: 'error', where: subDir, message: 'Missing _index.yaml' });
    return;
  }

  const idxRaw = readYaml(indexPath);
  const idx: SubspecialtyIndex =
    idxRaw && typeof idxRaw === 'object' ? (idxRaw as SubspecialtyIndex) : {};

  // Collect topic slugs listed in index
  const listed: string[] = [];
  if (Array.isArray(idx?.categories)) {
    for (const cat of idx.categories) {
      if (Array.isArray(cat?.topics)) listed.push(...cat.topics);
    }
  } else if (Array.isArray(idx?.topics)) {
    // legacy: topics as titles - warn
    problems.push({ level: 'warn', where: indexPath, message: 'Legacy index format: topics[] is titles; migrate to categories[] with slugs.' });
  }

  // Validate topic folders
  const children = fs.readdirSync(subDir)
    .filter(n => !n.startsWith('.'))
    .filter(n => !['_index.yaml'].includes(n));

  const topicDirs = children
    .map(n => path.join(subDir, n))
    .filter(isDir)
    .filter(d => fs.existsSync(path.join(d, '_meta.yaml')) || fs.existsSync(path.join(d, 'explorer.md')));

  // if index lists topics, ensure they exist
  for (const slug of listed) {
    const expected = path.join(subDir, slug);
    if (!fs.existsSync(expected) || !isDir(expected)) {
      problems.push({ level: 'warn', where: indexPath, message: `Topic slug listed but folder missing (content incomplete): ${slug}` });
    }
  }

  // Validate each topic dir
  for (const td of topicDirs) {
    validateTopicDir(td, problems);
  }
}

function main() {
  const problems: Problem[] = [];

  if (!isDir(CONTENT_DIR)) {
    console.error('No content/ directory found.');
    process.exit(1);
  }

  const subjects = listDirs(CONTENT_DIR);
  for (const subjectDir of subjects) {
    for (const subDir of listDirs(subjectDir)) {
      // only validate subspecialties that have _index.yaml
      if (fs.existsSync(path.join(subDir, '_index.yaml'))) {
        validateSubspecialty(subDir, problems);
      }
    }
  }

  const errors = problems.filter(p => p.level === 'error');
  const warns = problems.filter(p => p.level === 'warn');

  for (const p of problems) {
    const prefix = p.level === 'error' ? 'ERROR' : 'WARN';
    console.log(`${prefix}: ${p.where} — ${p.message}`);
  }

  console.log('---');
  console.log(`Validation complete. errors=${errors.length} warnings=${warns.length}`);

  process.exit(errors.length > 0 ? 1 : 0);
}

main();
