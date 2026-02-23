#!/usr/bin/env node
/**
 * Medicine Content Audit & Restructure
 * Uses proper YAML library for parsing/writing
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';

const ROOT = join(import.meta.dirname, '..');
const CONTENT_DIR = join(ROOT, 'content', 'medicine');

// ============================================================================
// Config
// ============================================================================
const NMC_MAP = {
  'cardiology': 'IM1', 'pulmonology': 'IM2', 'gastroenterology': 'IM5',
  'hematology': 'IM7', 'infectious-diseases': 'IM8', 'nephrology': 'IM9',
  'endocrinology': 'IM10', 'rheumatology': 'IM13', 'neurology': 'IM16',
  'dermatology': 'IM19', 'psychiatry': 'IM22', 'geriatrics': 'IM23',
  'emergency': 'IM24', 'critical-care': 'IM24', 'general-topics': 'IM26',
  'oncology': 'IM7', 'toxicology': 'IM25',
};

const DEPTH_OVERRIDES = {
  'cardiac-transplant': 'PG', 'renal-transplant': 'PG', 'organ-donation': 'PG',
  'brain-death': 'PG', 'peritoneal-dialysis': 'PG', 'arterial-line': 'PG',
  'huntington-disease': 'PG', 'motor-neuron-disease': 'PG',
  'schizoaffective-disorder': 'PG', 'delusional-disorder': 'PG',
  'adult-onset-stills-disease': 'PG', 'anti-gbm-disease': 'PG',
  'polycystic-kidney-disease': 'PG', 'small-cell-lung-cancer': 'PG',
  'pneumocystis-pneumonia': 'PG', 'catheter-related-infections': 'PG',
  'ventilator-associated-pneumonia': 'PG', 'stroke-rehabilitation': 'PG',
  'renal-osteodystrophy': 'PG', 'end-of-life-icu': 'PG', 'end-of-life-care': 'PG',
  'cannabis-use-disorder': 'PG', 'opioid-use-disorder': 'PG',
};

const LOW_YIELD = new Set([
  'professional-qualities-roles', 'government-iodisation-programs',
  'host-influence-response', 'basis-biochemical-physiologic',
  'area-plant-poisons-seen', 'area-poisonous-snakes-your',
]);

function slugToTitle(slug) {
  const abbrevs = {
    'dvt': 'DVT', 'pe': 'PE', 'ihd': 'IHD', 'mi': 'MI', 'htn': 'HTN',
    'cad': 'CAD', 'copd': 'COPD', 'acs': 'ACS', 'gerd': 'GERD', 'ibs': 'IBS',
    'ibd': 'IBD', 'aki': 'AKI', 'ckd': 'CKD', 'dm': 'DM', 'dka': 'DKA',
    'hf': 'HF', 'hd': 'HD', 'gi': 'GI', 'icu': 'ICU', 'cpr': 'CPR',
    'acls': 'ACLS', 'bls': 'BLS', 'atls': 'ATLS', 'hiv': 'HIV', 'aids': 'AIDS',
    'sle': 'SLE', 'ra': 'RA', 'ards': 'ARDS', 'rta': 'RTA', 'uti': 'UTI',
    'sjs': 'SJS', 'ten': 'TEN', 'gbs': 'GBS', 'mg': 'MG', 'em': 'EM',
    'g6pd': 'G6PD', 'niv': 'NIV', 'dic': 'DIC', 'pcos': 'PCOS',
  };
  return slug.split('-').map(w => abbrevs[w] || w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ============================================================================
// Helpers
// ============================================================================
function getAllTopics() {
  const topics = [];
  const subs = readdirSync(CONTENT_DIR).filter(d => statSync(join(CONTENT_DIR, d)).isDirectory());
  for (const sub of subs) {
    const subDir = join(CONTENT_DIR, sub);
    const dirs = readdirSync(subDir).filter(d => statSync(join(subDir, d)).isDirectory());
    for (const topic of dirs) {
      topics.push({ subspecialty: sub, slug: topic, path: join(subDir, topic) });
    }
  }
  return topics;
}

// ============================================================================
// Phase 1: Standardize _meta.yaml
// ============================================================================
function standardizeMeta(topic) {
  const metaPath = join(topic.path, '_meta.yaml');
  let existing = {};
  if (existsSync(metaPath)) {
    try { existing = YAML.parse(readFileSync(metaPath, 'utf-8')) || {}; } catch(_e) { existing = {}; }
  }
  
  const title = existing.title || existing.name || slugToTitle(topic.slug);
  const depth = DEPTH_OVERRIDES[topic.slug] || existing.depth || 'UG';
  const highYield = LOW_YIELD.has(topic.slug) ? false : (existing.highYield ?? existing.high_yield ?? true);
  
  // Extract NMC codes from old format
  let nmcCodes = [];
  if (existing.nmc_codes && Array.isArray(existing.nmc_codes)) {
    for (const item of existing.nmc_codes) {
      if (typeof item === 'string') nmcCodes.push(item);
      else if (item && typeof item === 'object' && item.code) nmcCodes.push(item.code);
    }
  }
  if (nmcCodes.length === 0) {
    const prefix = NMC_MAP[topic.subspecialty] || 'IM26';
    nmcCodes = [`${prefix}.1`];
  }
  // Deduplicate
  nmcCodes = [...new Set(nmcCodes)];
  
  const prerequisites = Array.isArray(existing.prerequisites) ? existing.prerequisites.filter(s => typeof s === 'string') : [];
  const related_topics = Array.isArray(existing.related_topics) ? existing.related_topics.filter(s => typeof s === 'string') : [];
  
  const enrichmentCodes = nmcCodes.map(code => ({
    code,
    text: `Describe the aetiology, pathophysiology, clinical features, investigations and management of ${title.toLowerCase()}`,
    domain: 'KH',
  }));
  
  const meta = {
    title,
    slug: topic.slug,
    depth,
    highYield,
    nmc_codes: nmcCodes,
    prerequisites,
    related_topics,
    enrichment: {
      nmcCodes: enrichmentCodes,
      prerequisite_details: prerequisites.map(s => ({ slug: s, reason: `Foundation knowledge for ${title.toLowerCase()}` })),
      related_details: related_topics.map(s => ({ slug: s, reason: `Clinically related to ${title.toLowerCase()}`, relationship: 'clinical' })),
    },
  };
  
  writeFileSync(metaPath, YAML.stringify(meta, { lineWidth: 120 }));
  return meta;
}

// ============================================================================
// Phase 2: Create new topics
// ============================================================================
const NEW_TOPICS = {
  'oncology': ['lung-cancer-medical', 'colorectal-cancer-medical', 'breast-cancer-referral', 'palliative-care', 'cancer-screening'],
  'toxicology': ['organophosphate-poisoning-tox', 'paracetamol-overdose-tox', 'snake-bite', 'mushroom-poisoning', 'corrosive-ingestion'],
  'cardiology': ['cardiomyopathy', 'valvular-heart-disease', 'infective-endocarditis', 'aortic-dissection'],
  'pulmonology': ['tuberculosis-pulmonary', 'pneumothorax', 'interstitial-lung-disease', 'pulmonary-embolism'],
  'gastroenterology': ['irritable-bowel-syndrome', 'acute-pancreatitis-medical', 'gi-bleeding-overview'],
  'nephrology': ['nephritic-syndrome', 'electrolyte-disorders', 'urinary-tract-infections-nephro'],
  'endocrinology': ['adrenal-disorders', 'pituitary-disorders', 'pcos', 'calcium-disorders', 'metabolic-syndrome'],
  'hematology': ['hemolytic-anemia', 'acute-leukemia', 'chronic-leukemia', 'hodgkin-lymphoma', 'coagulation-disorders', 'dic'],
  'neurology': ['epilepsy', 'meningitis-medical', 'guillain-barre-syndrome', 'myasthenia-gravis', 'dementia', 'multiple-sclerosis'],
  'infectious-diseases': ['dengue', 'typhoid-fever', 'tuberculosis-extrapulmonary', 'sepsis', 'leptospirosis', 'hepatitis-viral'],
  'rheumatology': ['gout', 'ankylosing-spondylitis', 'vasculitis', 'scleroderma-systemic', 'antiphospholipid-syndrome'],
  'psychiatry': ['depression', 'anxiety-disorders', 'schizophrenia', 'substance-abuse-overview', 'delirium'],
  'dermatology': ['eczema-dermatitis', 'psoriasis', 'sjs-ten', 'urticaria-angioedema'],
  'emergency': ['status-epilepticus-em', 'dka-emergency', 'acute-abdomen-approach'],
  'critical-care': ['mechanical-ventilation', 'sepsis-icu', 'ards', 'shock-types', 'acid-base-disorders'],
};

function createNewTopics() {
  let count = 0;
  for (const [sub, topics] of Object.entries(NEW_TOPICS)) {
    const subDir = join(CONTENT_DIR, sub);
    if (!existsSync(subDir)) mkdirSync(subDir, { recursive: true });
    for (const slug of topics) {
      const topicDir = join(subDir, slug);
      if (!existsSync(topicDir)) {
        mkdirSync(topicDir, { recursive: true });
        const title = slugToTitle(slug);
        const prefix = NMC_MAP[sub] || 'IM26';
        const meta = {
          title, slug, depth: DEPTH_OVERRIDES[slug] || 'UG', highYield: true,
          nmc_codes: [`${prefix}.1`],
          prerequisites: [], related_topics: [],
          enrichment: {
            nmcCodes: [{ code: `${prefix}.1`, text: `Describe the aetiology, pathophysiology, clinical features, investigations and management of ${title.toLowerCase()}`, domain: 'KH' }],
            prerequisite_details: [], related_details: [],
          },
        };
        writeFileSync(join(topicDir, '_meta.yaml'), YAML.stringify(meta, { lineWidth: 120 }));
        count++;
      }
    }
  }
  return count;
}

// ============================================================================
// Main
// ============================================================================
console.log('=== Medicine Content Audit & Restructure ===\n');

console.log('Phase 2: Creating new topics...');
const newCount = createNewTopics();
console.log(`  Created ${newCount} new topics\n`);

console.log('Phase 1: Standardizing _meta.yaml...');
const allTopics = getAllTopics();
let metaCount = 0;
for (const topic of allTopics) {
  standardizeMeta(topic);
  metaCount++;
}
console.log(`  Standardized ${metaCount} _meta.yaml files\n`);

// Report
const needExplorer = allTopics.filter(t => !existsSync(join(t.path, 'explorer.md')));
const needExamPrep = allTopics.filter(t => !existsSync(join(t.path, 'exam-prep.md')));
console.log(`Topics needing explorer.md: ${needExplorer.length}`);
console.log(`Topics needing exam-prep.md: ${needExamPrep.length}`);
console.log(`Total topics: ${allTopics.length}`);

// Output list for content generation
const bySubspecialty = {};
for (const t of allTopics) {
  if (!bySubspecialty[t.subspecialty]) bySubspecialty[t.subspecialty] = [];
  bySubspecialty[t.subspecialty].push(t.slug);
}
for (const [sub, topics] of Object.entries(bySubspecialty).sort()) {
  console.log(`\n${sub} (${topics.length}):`);
  for (const t of topics.sort()) {
    const hasE = existsSync(join(CONTENT_DIR, sub, t, 'explorer.md')) ? '✓' : '✗';
    const hasP = existsSync(join(CONTENT_DIR, sub, t, 'exam-prep.md')) ? '✓' : '✗';
    console.log(`  ${t} [E:${hasE} P:${hasP}]`);
  }
}
