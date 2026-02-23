/**
 * NucleuX Academy - Surgery GI Topics
 * 
 * Sample topic structure for Gastrointestinal Surgery
 */

import type { Topic, MCQ, Flashcard } from '../types';

// =============================================================================
// TOPICS
// =============================================================================

export const SURGERY_GI_TOPICS: Topic[] = [
  // Esophagus
  {
    id: 'surg-gi-esophagus-anatomy',
    subjectId: 'surgery',
    name: 'Esophagus - Anatomy & Physiology',
    slug: 'esophagus-anatomy',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    tags: ['esophagus', 'anatomy', 'upper gi'],
    estimatedMinutes: 25,
    difficulty: 2,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 62", pages: "1089-1095" },
      { textbook: "Sabiston", edition: "21st", chapter: "Chapter 41" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'surg-gi-gerd',
    subjectId: 'surgery',
    name: 'GERD & Hiatal Hernia',
    slug: 'gerd-hiatal-hernia',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    prerequisites: ['surg-gi-esophagus-anatomy'],
    tags: ['esophagus', 'gerd', 'hiatal hernia', 'reflux'],
    estimatedMinutes: 35,
    difficulty: 3,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 62", pages: "1096-1108" },
      { textbook: "Shackelford", edition: "8th", chapter: "Chapter 23" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'surg-gi-achalasia',
    subjectId: 'surgery',
    name: 'Achalasia Cardia',
    slug: 'achalasia-cardia',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    prerequisites: ['surg-gi-esophagus-anatomy'],
    tags: ['esophagus', 'motility', 'dysphagia'],
    estimatedMinutes: 30,
    difficulty: 3,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 62", pages: "1109-1115" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'surg-gi-esophageal-cancer',
    subjectId: 'surgery',
    name: 'Esophageal Cancer',
    slug: 'esophageal-cancer',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    prerequisites: ['surg-gi-esophagus-anatomy'],
    tags: ['esophagus', 'cancer', 'oncology'],
    estimatedMinutes: 45,
    difficulty: 4,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 62", pages: "1116-1130" },
      { textbook: "Shackelford", edition: "8th", chapter: "Chapter 26-27" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },

  // Stomach
  {
    id: 'surg-gi-stomach-anatomy',
    subjectId: 'surgery',
    name: 'Stomach - Anatomy & Physiology',
    slug: 'stomach-anatomy',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    tags: ['stomach', 'anatomy', 'physiology'],
    estimatedMinutes: 25,
    difficulty: 2,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 63", pages: "1131-1140" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'surg-gi-peptic-ulcer',
    subjectId: 'surgery',
    name: 'Peptic Ulcer Disease',
    slug: 'peptic-ulcer-disease',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    prerequisites: ['surg-gi-stomach-anatomy'],
    tags: ['stomach', 'ulcer', 'h.pylori', 'acid'],
    estimatedMinutes: 40,
    difficulty: 3,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 63", pages: "1141-1158" },
      { textbook: "Sabiston", edition: "21st", chapter: "Chapter 49" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'surg-gi-gastric-cancer',
    subjectId: 'surgery',
    name: 'Gastric Cancer',
    slug: 'gastric-cancer',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    prerequisites: ['surg-gi-stomach-anatomy'],
    tags: ['stomach', 'cancer', 'oncology', 'adenocarcinoma'],
    estimatedMinutes: 45,
    difficulty: 4,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 63", pages: "1159-1175" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },

  // Small Intestine
  {
    id: 'surg-gi-small-bowel-anatomy',
    subjectId: 'surgery',
    name: 'Small Intestine - Anatomy',
    slug: 'small-intestine-anatomy',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    tags: ['small bowel', 'anatomy', 'jejunum', 'ileum'],
    estimatedMinutes: 20,
    difficulty: 2,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 67" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'surg-gi-intestinal-obstruction',
    subjectId: 'surgery',
    name: 'Intestinal Obstruction',
    slug: 'intestinal-obstruction',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    prerequisites: ['surg-gi-small-bowel-anatomy'],
    tags: ['emergency', 'obstruction', 'adhesions', 'acute abdomen'],
    estimatedMinutes: 45,
    difficulty: 3,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 67", pages: "1234-1252" },
      { textbook: "Sabiston", edition: "21st", chapter: "Chapter 50" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },

  // Appendix
  {
    id: 'surg-gi-appendicitis',
    subjectId: 'surgery',
    name: 'Acute Appendicitis',
    slug: 'acute-appendicitis',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    tags: ['appendix', 'emergency', 'acute abdomen', 'rlq pain'],
    estimatedMinutes: 35,
    difficulty: 2,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 72", pages: "1302-1315" },
      { textbook: "Sabiston", edition: "21st", chapter: "Chapter 51" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },

  // Colon
  {
    id: 'surg-gi-colon-anatomy',
    subjectId: 'surgery',
    name: 'Colon & Rectum - Anatomy',
    slug: 'colon-rectum-anatomy',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    tags: ['colon', 'rectum', 'anatomy', 'lower gi'],
    estimatedMinutes: 25,
    difficulty: 2,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 69" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'surg-gi-colorectal-cancer',
    subjectId: 'surgery',
    name: 'Colorectal Cancer',
    slug: 'colorectal-cancer',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    prerequisites: ['surg-gi-colon-anatomy'],
    tags: ['colon', 'rectum', 'cancer', 'oncology', 'adenocarcinoma'],
    estimatedMinutes: 50,
    difficulty: 4,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 69", pages: "1285-1302" },
      { textbook: "Sabiston", edition: "21st", chapter: "Chapter 52" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'surg-gi-ibd',
    subjectId: 'surgery',
    name: 'Inflammatory Bowel Disease',
    slug: 'inflammatory-bowel-disease',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    prerequisites: ['surg-gi-colon-anatomy'],
    tags: ['colon', 'crohns', 'ulcerative colitis', 'ibd'],
    estimatedMinutes: 40,
    difficulty: 3,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 69" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'surg-gi-hemorrhoids',
    subjectId: 'surgery',
    name: 'Hemorrhoids',
    slug: 'hemorrhoids',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    tags: ['anorectal', 'piles', 'bleeding pr'],
    estimatedMinutes: 25,
    difficulty: 2,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 70", pages: "1336-1345" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'surg-gi-anal-fissure',
    subjectId: 'surgery',
    name: 'Anal Fissure',
    slug: 'anal-fissure',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    tags: ['anorectal', 'pain', 'constipation'],
    estimatedMinutes: 20,
    difficulty: 2,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 70" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'surg-gi-fistula-abscess',
    subjectId: 'surgery',
    name: 'Fistula-in-Ano & Perianal Abscess',
    slug: 'fistula-perianal-abscess',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    tags: ['anorectal', 'abscess', 'fistula', 'infection'],
    estimatedMinutes: 30,
    difficulty: 3,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 70" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },

  // Hepatobiliary
  {
    id: 'surg-gi-liver-anatomy',
    subjectId: 'surgery',
    name: 'Liver - Anatomy & Physiology',
    slug: 'liver-anatomy',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    tags: ['liver', 'anatomy', 'hepatobiliary'],
    estimatedMinutes: 30,
    difficulty: 3,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 65" },
      { textbook: "Blumgart", edition: "6th", chapter: "Chapter 1" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'surg-gi-cholelithiasis',
    subjectId: 'surgery',
    name: 'Cholelithiasis & Cholecystitis',
    slug: 'gallstones-cholecystitis',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    tags: ['gallbladder', 'stones', 'cholecystectomy'],
    estimatedMinutes: 40,
    difficulty: 3,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 66", pages: "1203-1220" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'surg-gi-portal-hypertension',
    subjectId: 'surgery',
    name: 'Portal Hypertension',
    slug: 'portal-hypertension',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    prerequisites: ['surg-gi-liver-anatomy'],
    tags: ['liver', 'cirrhosis', 'varices', 'ascites'],
    estimatedMinutes: 45,
    difficulty: 4,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 65" },
      { textbook: "Blumgart", edition: "6th", chapter: "Chapter 70" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'surg-gi-liver-tumors',
    subjectId: 'surgery',
    name: 'Liver Tumors (HCC & Metastases)',
    slug: 'liver-tumors',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    prerequisites: ['surg-gi-liver-anatomy'],
    tags: ['liver', 'cancer', 'hcc', 'metastases'],
    estimatedMinutes: 45,
    difficulty: 4,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 65" },
      { textbook: "Blumgart", edition: "6th", chapter: "Chapter 80-82" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },

  // Pancreas
  {
    id: 'surg-gi-pancreas-anatomy',
    subjectId: 'surgery',
    name: 'Pancreas - Anatomy & Physiology',
    slug: 'pancreas-anatomy',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    tags: ['pancreas', 'anatomy', 'endocrine', 'exocrine'],
    estimatedMinutes: 25,
    difficulty: 3,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 64" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'surg-gi-acute-pancreatitis',
    subjectId: 'surgery',
    name: 'Acute Pancreatitis',
    slug: 'acute-pancreatitis',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    prerequisites: ['surg-gi-pancreas-anatomy'],
    tags: ['pancreas', 'acute', 'emergency', 'necrotizing'],
    estimatedMinutes: 40,
    difficulty: 3,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 64", pages: "1185-1198" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'surg-gi-chronic-pancreatitis',
    subjectId: 'surgery',
    name: 'Chronic Pancreatitis',
    slug: 'chronic-pancreatitis',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    prerequisites: ['surg-gi-pancreas-anatomy', 'surg-gi-acute-pancreatitis'],
    tags: ['pancreas', 'chronic', 'pain', 'diabetes'],
    estimatedMinutes: 35,
    difficulty: 4,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 64" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'surg-gi-pancreatic-cancer',
    subjectId: 'surgery',
    name: 'Pancreatic Cancer',
    slug: 'pancreatic-cancer',
    depth: { mbbs: true, pg: true, superSpecialty: true },
    prerequisites: ['surg-gi-pancreas-anatomy'],
    tags: ['pancreas', 'cancer', 'whipple', 'adenocarcinoma'],
    estimatedMinutes: 45,
    difficulty: 5,
    sources: [
      { textbook: "Bailey & Love", edition: "28th", chapter: "Chapter 64", pages: "1199-1210" },
      { textbook: "Blumgart", edition: "6th", chapter: "Chapter 62-64" },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
];

// =============================================================================
// SAMPLE MCQs
// =============================================================================

export const SURGERY_GI_MCQS: MCQ[] = [
  {
    id: 'mcq-surg-gi-001',
    topicId: 'surg-gi-appendicitis',
    subjectId: 'surgery',
    stem: "A 22-year-old male presents with periumbilical pain that migrated to the right iliac fossa over 12 hours. On examination, there is tenderness at McBurney's point with rebound tenderness. WBC count is 14,000/mm³. What is the most likely diagnosis?",
    options: [
      { id: 'a', text: 'Mesenteric lymphadenitis', isCorrect: false },
      { id: 'b', text: 'Acute appendicitis', isCorrect: true },
      { id: 'c', text: 'Right ureteric colic', isCorrect: false },
      { id: 'd', text: 'Meckel\'s diverticulitis', isCorrect: false },
    ],
    correctOptionId: 'b',
    explanation: "The classic presentation of acute appendicitis includes:\n\n1. **Migratory pain**: Starts periumbilical (visceral pain from midgut) then localizes to RIF (somatic pain from parietal peritoneum involvement)\n\n2. **McBurney's point tenderness**: Located 1/3rd from ASIS to umbilicus\n\n3. **Leukocytosis**: Usually 10,000-18,000/mm³\n\nThe diagnosis is primarily clinical. The Alvarado score can help stratify risk.",
    depth: 'mbbs',
    difficulty: 2,
    examTypes: ['NEET-PG', 'INICET'],
    source: { type: 'original' },
    stats: { timesAttempted: 1543, correctRate: 0.87, avgTimeSeconds: 45 },
    status: 'published',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'mcq-surg-gi-002',
    topicId: 'surg-gi-appendicitis',
    subjectId: 'surgery',
    stem: "Which of the following is NOT a part of the Alvarado score for appendicitis?",
    options: [
      { id: 'a', text: 'Migration of pain to RIF', isCorrect: false },
      { id: 'b', text: 'Anorexia', isCorrect: false },
      { id: 'c', text: 'Elevated CRP', isCorrect: true },
      { id: 'd', text: 'Leukocytosis', isCorrect: false },
    ],
    correctOptionId: 'c',
    explanation: "**MANTRELS Score (Alvarado):**\n\n**Symptoms (3 points):**\n- **M**igration of pain to RIF (1)\n- **A**norexia (1)\n- **N**ausea/Vomiting (1)\n\n**Signs (3 points):**\n- **T**enderness in RIF (2)\n- **R**ebound tenderness (1)\n- **E**levated temperature (1)\n\n**Labs (2 points):**\n- **L**eukocytosis >10,000 (2)\n- **S**hift to left (neutrophilia) (1)\n\n**Total: 10 points**\n- ≤4: Appendicitis unlikely\n- 5-6: Possible, observe\n- 7-8: Probable, surgery\n- ≥9: Very probable\n\nNote: CRP is NOT part of the original Alvarado score.",
    depth: 'mbbs',
    difficulty: 2,
    examTypes: ['NEET-PG'],
    source: { type: 'pastExam', reference: 'NEET-PG 2022' },
    stats: { timesAttempted: 2341, correctRate: 0.72, avgTimeSeconds: 52 },
    status: 'published',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'mcq-surg-gi-003',
    topicId: 'surg-gi-cholelithiasis',
    subjectId: 'surgery',
    stem: "A 45-year-old obese female presents with right upper quadrant pain after fatty meals. Ultrasound shows multiple gallstones with a thickened gallbladder wall. What is the most appropriate management?",
    options: [
      { id: 'a', text: 'Conservative management with low-fat diet', isCorrect: false },
      { id: 'b', text: 'Laparoscopic cholecystectomy', isCorrect: true },
      { id: 'c', text: 'ERCP with sphincterotomy', isCorrect: false },
      { id: 'd', text: 'Ursodeoxycholic acid dissolution therapy', isCorrect: false },
    ],
    correctOptionId: 'b',
    explanation: "**Symptomatic cholelithiasis** with biliary colic warrants **cholecystectomy**:\n\n1. **Laparoscopic cholecystectomy** is the gold standard\n2. Benefits: Less pain, shorter hospital stay, faster recovery, better cosmesis\n\n**Why not other options?**\n- Conservative: Only delays inevitable surgery, risk of complications\n- ERCP: For CBD stones, not gallbladder stones\n- Ursodeoxycholic acid: Only for small cholesterol stones in non-functioning gallbladder, 50% recurrence\n\nThe patient has classic **4 Fs**: Female, Forty, Fat, Fertile (though fertility not mentioned here)",
    depth: 'mbbs',
    difficulty: 2,
    examTypes: ['NEET-PG', 'FMGE'],
    source: { type: 'original' },
    stats: { timesAttempted: 1876, correctRate: 0.91, avgTimeSeconds: 38 },
    status: 'published',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'mcq-surg-gi-004',
    topicId: 'surg-gi-portal-hypertension',
    subjectId: 'surgery',
    stem: "Which of the following is the most common site of portosystemic anastomosis to bleed?",
    options: [
      { id: 'a', text: 'Esophageal varices', isCorrect: true },
      { id: 'b', text: 'Hemorrhoids', isCorrect: false },
      { id: 'c', text: 'Caput medusae', isCorrect: false },
      { id: 'd', text: 'Retroperitoneal veins', isCorrect: false },
    ],
    correctOptionId: 'a',
    explanation: "**Portosystemic anastomoses** (Sites of collateral formation in portal hypertension):\n\n1. **Lower esophagus** (Left gastric → Azygos) — **MOST COMMON TO BLEED** (40% mortality)\n2. **Anorectal junction** (Superior → Middle/Inferior rectal)\n3. **Umbilicus** (Paraumbilical → Superficial epigastric) — Caput medusae\n4. **Retroperitoneal** (Colic → Renal/Lumbar)\n5. **Bare area of liver** (Portal → Phrenic)\n\n**Why esophageal varices bleed most?**\n- Thin wall, no external support\n- High pressure gradient\n- Constant trauma from food bolus\n- Acid reflux damage",
    depth: 'pg',
    difficulty: 3,
    examTypes: ['NEET-PG', 'INICET'],
    source: { type: 'pastExam', reference: 'INICET 2023' },
    stats: { timesAttempted: 1234, correctRate: 0.78, avgTimeSeconds: 42 },
    status: 'published',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'mcq-surg-gi-005',
    topicId: 'surg-gi-pancreatic-cancer',
    subjectId: 'surgery',
    stem: "A 60-year-old man presents with painless progressive jaundice, weight loss, and a palpable non-tender gallbladder. CT shows a mass in the head of pancreas. What is Courvoisier's law?",
    options: [
      { id: 'a', text: 'Palpable gallbladder with jaundice is unlikely due to stones', isCorrect: true },
      { id: 'b', text: 'Obstructive jaundice always presents with fever', isCorrect: false },
      { id: 'c', text: 'Pancreatic cancer always presents with pain', isCorrect: false },
      { id: 'd', text: 'Gallbladder distension occurs only in malignancy', isCorrect: false },
    ],
    correctOptionId: 'a',
    explanation: "**Courvoisier's Law:**\n\n> \"In the presence of jaundice, a palpable gallbladder is unlikely to be due to gallstones.\"\n\n**Rationale:**\n- **Gallstones**: Chronic inflammation → Fibrosed, shrunken gallbladder → Cannot distend\n- **Malignancy** (Periampullary/Pancreatic head): Gradual obstruction → GB distends (no prior inflammation)\n\n**Classic presentation of pancreatic head cancer:**\n- Painless progressive jaundice\n- Palpable non-tender gallbladder\n- Weight loss\n- New-onset diabetes\n\n**Exceptions to Courvoisier's Law:**\n- Mucocele of gallbladder\n- Double impacted stone\n- Oriental cholangiohepatitis",
    depth: 'mbbs',
    difficulty: 3,
    examTypes: ['NEET-PG', 'FMGE'],
    source: { type: 'original' },
    stats: { timesAttempted: 2156, correctRate: 0.85, avgTimeSeconds: 55 },
    status: 'published',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
];

// =============================================================================
// SAMPLE FLASHCARDS
// =============================================================================

export const SURGERY_GI_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-surg-gi-001',
    topicId: 'surg-gi-appendicitis',
    subjectId: 'surgery',
    front: "Where is **McBurney's point** located?",
    back: "**McBurney's point** is located at the junction of the lateral 1/3rd and medial 2/3rd of the line joining the **right ASIS** to the **umbilicus**.\n\nIt marks the surface anatomy of the base of the appendix.",
    depth: 'mbbs',
    type: 'fact',
    defaultIntervalDays: 1,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'fc-surg-gi-002',
    topicId: 'surg-gi-appendicitis',
    subjectId: 'surgery',
    front: "What is the **MANTRELS** mnemonic for the Alvarado score?",
    back: "**M**igration of pain to RIF (1)\n**A**norexia (1)\n**N**ausea/Vomiting (1)\n**T**enderness in RIF (2)\n**R**ebound tenderness (1)\n**E**levated temperature (1)\n**L**eukocytosis (2)\n**S**hift to left (1)\n\n**Total: 10 points**\n\n≥7 = Probable appendicitis",
    depth: 'mbbs',
    type: 'concept',
    tags: ['mnemonic', 'scoring'],
    defaultIntervalDays: 1,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'fc-surg-gi-003',
    topicId: 'surg-gi-cholelithiasis',
    subjectId: 'surgery',
    front: "What are the **4 Fs** risk factors for gallstones?",
    back: "**F**emale\n**F**orty (age >40)\n**F**at (obese)\n**F**ertile (multiparity)\n\n**Additional risk factors:**\n- Family history\n- Fasting/Rapid weight loss\n- Fibrates/OCP use\n- Cirrhosis\n- Crohn's disease",
    depth: 'mbbs',
    type: 'fact',
    tags: ['mnemonic', 'risk factors'],
    defaultIntervalDays: 1,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'fc-surg-gi-004',
    topicId: 'surg-gi-portal-hypertension',
    subjectId: 'surgery',
    front: "What is the **portal pressure** in normal vs. portal hypertension?",
    back: "**Normal portal pressure:** 5-10 mmHg\n\n**Portal hypertension:** >12 mmHg\n\n**Clinical significance:**\n- >10 mmHg: Varices form\n- >12 mmHg: Varices can bleed\n\n**HVPG (Hepatic Venous Pressure Gradient):**\n- Normal: <5 mmHg\n- Clinically significant: >10 mmHg\n- Severe: >12 mmHg",
    depth: 'pg',
    type: 'fact',
    defaultIntervalDays: 2,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'fc-surg-gi-005',
    topicId: 'surg-gi-pancreatic-cancer',
    subjectId: 'surgery',
    front: "What is **Courvoisier's Law**?",
    back: "\"In the presence of **obstructive jaundice**, a **palpable gallbladder** is unlikely to be due to **gallstones**.\"\n\n**Interpretation:**\n- Palpable GB + Jaundice = Think **malignancy** (periampullary, pancreatic head)\n- Stones cause chronic inflammation → GB cannot distend\n\n**Exceptions:**\n- Mucocele\n- Double impacted stone\n- Oriental cholangiohepatitis",
    depth: 'mbbs',
    type: 'concept',
    tags: ['law', 'eponym'],
    defaultIntervalDays: 1,
    createdAt: new Date('2024-01-01'),
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getTopicById(id: string): Topic | undefined {
  return SURGERY_GI_TOPICS.find(t => t.id === id);
}

export function getTopicsByDepth(depth: 'mbbs' | 'pg' | 'superSpecialty'): Topic[] {
  return SURGERY_GI_TOPICS.filter(t => t.depth[depth]);
}

export function getMCQsByTopic(topicId: string): MCQ[] {
  return SURGERY_GI_MCQS.filter(m => m.topicId === topicId);
}

export function getFlashcardsByTopic(topicId: string): Flashcard[] {
  return SURGERY_GI_FLASHCARDS.filter(f => f.topicId === topicId);
}
