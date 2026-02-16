#!/usr/bin/env node
/**
 * Quick medicine content generator.
 * Creates template explorer.md and exam-prep.md for topics missing them.
 * Uses topic name + subspecialty to generate relevant structure.
 */
import { writeFileSync, readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const CONTENT_DIR = join(import.meta.dirname, '..', 'content', 'medicine');

function titleCase(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function subDisplayName(sub) {
  const map = {
    'cardiology': 'Cardiology', 'pulmonology': 'Pulmonology', 'nephrology': 'Nephrology',
    'gastroenterology': 'Gastroenterology', 'endocrinology': 'Endocrinology',
    'hematology': 'Hematology', 'neurology': 'Neurology', 'rheumatology': 'Rheumatology',
    'infectious-diseases': 'Infectious Diseases', 'critical-care': 'Critical Care',
    'emergency': 'Emergency Medicine', 'dermatology': 'Dermatology',
    'psychiatry': 'Psychiatry', 'geriatrics': 'Geriatrics',
    'general-topics': 'General Medicine', 'oncology': 'Oncology',
    'toxicology': 'Toxicology',
  };
  return map[sub] || titleCase(sub);
}

function generateExplorer(title, sub) {
  const subName = subDisplayName(sub);
  return `## Overview

**${title}** is an important topic in ${subName}. Understanding its pathophysiology, clinical presentation, diagnosis, and management is essential for medical practice and examinations.

## Key Points

- ${title} is a commonly tested topic in medical examinations
- Early recognition and appropriate management improve outcomes
- Understanding the pathophysiology guides rational treatment
- Knowledge of complications helps in prognostication
- Multidisciplinary approach may be required in complex cases

## Definition & Classification

${title} encompasses a spectrum of clinical presentations. Classification helps guide management:

| Type | Features |
|------|----------|
| Acute | Sudden onset, requires urgent management |
| Chronic | Gradual progression, long-term management needed |
| Complicated | Associated with significant morbidity |

## Etiology & Pathophysiology

The etiology of ${title} is multifactorial. Key pathophysiological mechanisms include:

- **Primary factors**: Direct causative agents or processes
- **Secondary factors**: Contributing and predisposing conditions
- **Risk factors**: Modifiable and non-modifiable risk factors should be identified

Understanding the underlying pathophysiology is crucial for:
1. Rational diagnostic workup
2. Targeted therapeutic interventions
3. Prevention of complications

## Clinical Features

### Symptoms
- Cardinal symptoms of ${title}
- Associated symptoms that help narrow the differential
- Red flag symptoms requiring urgent evaluation

### Signs
- General examination findings
- System-specific examination findings
- Signs of complications

## Diagnosis

### Investigations

| Investigation | Purpose |
|--------------|---------|
| Basic labs | Screening and baseline assessment |
| Specific tests | Confirmatory diagnosis |
| Imaging | Structural assessment |
| Special tests | When indicated |

### Diagnostic Criteria
- Established diagnostic criteria should be applied where available
- Scoring systems aid in risk stratification

## Management

### General Principles
- Stabilize the patient (ABC approach if acute)
- Address the underlying cause
- Symptom management
- Prevention of complications

### Specific Treatment
- **First-line therapy**: Standard of care
- **Second-line therapy**: When first-line fails or is contraindicated
- **Supportive care**: Nutrition, rehabilitation, patient education

### Monitoring
- Regular follow-up and monitoring parameters
- Treatment response assessment
- Screening for complications and drug side effects

## Complications & Prognosis

### Complications
- Early complications
- Late complications
- Treatment-related complications

### Prognosis
- Prognostic factors
- Expected outcomes with appropriate management
- Long-term follow-up requirements

---

> 📚 *NucleuX Academy — ${subName}*
`;
}

function generateExamPrep(title, sub) {
  const subName = subDisplayName(sub);
  return `## Quick Summary

${title} is a high-yield ${subName} topic. Focus on etiology, clinical features, diagnostic criteria, and management principles for exam preparation.

## High Yield Points

- ★ Know the definition and classification of ${title}
- ★ Understand the key pathophysiological mechanisms
- ★ Recognize the classic clinical presentation
- ★ Know the diagnostic criteria and key investigations
- ★ Understand first-line management and indications for referral
- ★ Be aware of complications and their management

## Mnemonics

*Common mnemonics for ${title} — check standard textbooks for subject-specific memory aids.*

## Common MCQ Topics

1. Classic clinical presentation and diagnosis
2. Investigation of choice
3. First-line treatment
4. Complications and their management
5. Differential diagnosis
6. Prognosis and follow-up

## Differential Diagnosis

| Condition | Key Distinguishing Feature |
|-----------|---------------------------|
| ${title} | Classic presentation |
| Related condition 1 | Differentiating feature |
| Related condition 2 | Differentiating feature |

---

> 📚 *NucleuX Academy — ${subName} Exam Prep*
`;
}

// Main
let created = { explorer: 0, examPrep: 0 };
const subs = readdirSync(CONTENT_DIR).filter(d => statSync(join(CONTENT_DIR, d)).isDirectory());

for (const sub of subs) {
  const subDir = join(CONTENT_DIR, sub);
  const topics = readdirSync(subDir).filter(d => {
    const p = join(subDir, d);
    return statSync(p).isDirectory() && existsSync(join(p, '_meta.yaml'));
  });

  for (const slug of topics) {
    const topicDir = join(subDir, slug);
    let title = titleCase(slug);
    try {
      const meta = readFileSync(join(topicDir, '_meta.yaml'), 'utf-8');
      const match = meta.match(/title:\s*"?([^"\n]+)"?/);
      if (match) title = match[1].trim();
    } catch {}

    if (!existsSync(join(topicDir, 'explorer.md'))) {
      writeFileSync(join(topicDir, 'explorer.md'), generateExplorer(title, sub));
      created.explorer++;
    }
    if (!existsSync(join(topicDir, 'exam-prep.md'))) {
      writeFileSync(join(topicDir, 'exam-prep.md'), generateExamPrep(title, sub));
      created.examPrep++;
    }
  }
}

console.log(`Created ${created.explorer} explorer.md + ${created.examPrep} exam-prep.md`);
console.log('Done!');
