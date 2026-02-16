#!/usr/bin/env node
/**
 * Medicine Content Audit & Generator
 * 
 * Phase 1: Standardize all _meta.yaml files
 * Phase 2: Generate explorer.md for topics missing it
 * Phase 3: Generate exam-prep.md for topics missing it
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml'); // need to handle yaml manually

const MEDICINE_DIR = path.join(__dirname, '..', 'content', 'medicine');

// NMC IM code mapping by subspecialty
const NMC_MAP = {
  cardiology: { prefix: 'IM1', codes: range(1, 30) },
  pulmonology: { prefix: 'IM2', codes: range(1, 20) },
  gastroenterology: { prefix: 'IM5', codes: range(1, 20) },
  nephrology: { prefix: 'IM9', codes: range(1, 15) },
  endocrinology: { prefix: 'IM10', codes: range(1, 15) },
  hematology: { prefix: 'IM7', codes: range(1, 15) },
  neurology: { prefix: 'IM16', codes: range(1, 20) },
  rheumatology: { prefix: 'IM13', codes: range(1, 15) },
  'infectious-diseases': { prefix: 'IM8', codes: range(1, 20) },
  dermatology: { prefix: 'IM19', codes: range(1, 10) },
  psychiatry: { prefix: 'IM22', codes: range(1, 10) },
  geriatrics: { prefix: 'IM23', codes: range(1, 10) },
  emergency: { prefix: 'IM24', codes: range(1, 15) },
  'critical-care': { prefix: 'IM24', codes: range(1, 15) },
  'general-topics': { prefix: 'IM26', codes: range(1, 10) },
};

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start);
}

// Scan all topics
function scanMedicine() {
  const subspecialties = fs.readdirSync(MEDICINE_DIR).filter(f => {
    return fs.statSync(path.join(MEDICINE_DIR, f)).isDirectory();
  });

  const results = { total: 0, missingSlug: 0, missingExplorer: 0, missingExamPrep: 0, subspecialties: {} };

  for (const sub of subspecialties) {
    const subDir = path.join(MEDICINE_DIR, sub);
    const topics = fs.readdirSync(subDir).filter(f => {
      const p = path.join(subDir, f);
      return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, '_meta.yaml'));
    });

    const subResults = { topics: topics.length, missingSlug: 0, missingExplorer: 0, missingExamPrep: 0, topicList: [] };

    for (const topic of topics) {
      const topicDir = path.join(subDir, topic);
      const metaPath = path.join(topicDir, '_meta.yaml');
      const meta = fs.readFileSync(metaPath, 'utf-8');
      
      const hasSlug = meta.includes('slug:');
      const hasExplorer = fs.existsSync(path.join(topicDir, 'explorer.md'));
      const hasExamPrep = fs.existsSync(path.join(topicDir, 'exam-prep.md'));

      if (!hasSlug) subResults.missingSlug++;
      if (!hasExplorer) subResults.missingExplorer++;
      if (!hasExamPrep) subResults.missingExamPrep++;

      subResults.topicList.push({ slug: topic, hasSlug, hasExplorer, hasExamPrep });
      results.total++;
    }

    results.subspecialties[sub] = subResults;
    results.missingSlug += subResults.missingSlug;
    results.missingExplorer += subResults.missingExplorer;
    results.missingExamPrep += subResults.missingExamPrep;
  }

  return results;
}

const results = scanMedicine();
console.log(JSON.stringify(results, null, 2));
