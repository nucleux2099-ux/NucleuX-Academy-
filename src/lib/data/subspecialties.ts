/**
 * NucleuX Academy - Subspecialties Data
 * 
 * Subspecialties within each subject (rooms within rooms)
 */

import type { Subspecialty } from '../types/library';

export const SUBSPECIALTIES: Subspecialty[] = [
  // =============================================================================
  // SURGERY
  // =============================================================================
  {
    id: 'surgery-esophagus',
    subjectId: 'surgery',
    name: 'Esophagus',
    slug: 'esophagus',
    icon: '🫁',
    description: 'Esophageal anatomy, motility disorders, GERD, and surgical management',
    topicCount: 13,
    order: 1,
  },
  {
    id: 'surgery-stomach',
    subjectId: 'surgery',
    name: 'Stomach & Duodenum',
    slug: 'stomach-duodenum',
    icon: '🫃',
    description: 'Peptic ulcer disease, gastric cancer, bariatric surgery',
    topicCount: 12,
    order: 2,
  },
  {
    id: 'surgery-hepatobiliary',
    subjectId: 'surgery',
    name: 'Hepatobiliary',
    slug: 'hepatobiliary',
    icon: '🫀',
    description: 'Liver, gallbladder, and biliary tract surgery',
    topicCount: 18,
    order: 3,
  },
  {
    id: 'surgery-pancreas',
    subjectId: 'surgery',
    name: 'Pancreas',
    slug: 'pancreas',
    icon: '🧫',
    description: 'Pancreatitis, pancreatic neoplasms, and pancreatic surgery',
    topicCount: 8,
    order: 4,
  },
  {
    id: 'surgery-small-intestine',
    subjectId: 'surgery',
    name: 'Small Intestine',
    slug: 'small-intestine',
    icon: '🔗',
    description: 'Small bowel obstruction, Crohn\'s disease, mesenteric ischemia',
    topicCount: 10,
    order: 5,
  },
  {
    id: 'surgery-colorectal',
    subjectId: 'surgery',
    name: 'Colorectal',
    slug: 'colorectal',
    icon: '🎯',
    description: 'Colorectal cancer, IBD surgery, anorectal disorders',
    topicCount: 15,
    order: 6,
  },
  {
    id: 'surgery-hernia',
    subjectId: 'surgery',
    name: 'Hernia',
    slug: 'hernia',
    icon: '🕳️',
    description: 'Inguinal, femoral, ventral, and incisional hernias',
    topicCount: 8,
    order: 7,
  },
  {
    id: 'surgery-breast',
    subjectId: 'surgery',
    name: 'Breast',
    slug: 'breast',
    icon: '🎀',
    description: 'Breast cancer, benign breast disease, breast reconstruction',
    topicCount: 10,
    order: 8,
  },
  {
    id: 'surgery-endocrine',
    subjectId: 'surgery',
    name: 'Endocrine Surgery',
    slug: 'endocrine',
    icon: '🦋',
    description: 'Thyroid, parathyroid, and adrenal surgery',
    topicCount: 12,
    order: 9,
  },
  
  // =============================================================================
  // MEDICINE
  // =============================================================================
  {
    id: 'medicine-gastroenterology',
    subjectId: 'medicine',
    name: 'Gastroenterology',
    slug: 'gastroenterology',
    icon: '🫁',
    description: 'GI disorders, liver diseases, and digestive physiology',
    topicCount: 25,
    order: 1,
  },
  {
    id: 'medicine-cardiology',
    subjectId: 'medicine',
    name: 'Cardiology',
    slug: 'cardiology',
    icon: '❤️',
    description: 'Heart diseases, arrhythmias, and cardiovascular medicine',
    topicCount: 30,
    order: 2,
  },
  {
    id: 'medicine-pulmonology',
    subjectId: 'medicine',
    name: 'Pulmonology',
    slug: 'pulmonology',
    icon: '🌬️',
    description: 'Respiratory diseases and pulmonary medicine',
    topicCount: 20,
    order: 3,
  },
  {
    id: 'medicine-nephrology',
    subjectId: 'medicine',
    name: 'Nephrology',
    slug: 'nephrology',
    icon: '🫘',
    description: 'Kidney diseases, dialysis, and fluid/electrolyte balance',
    topicCount: 18,
    order: 4,
  },
  {
    id: 'medicine-endocrinology',
    subjectId: 'medicine',
    name: 'Endocrinology',
    slug: 'endocrinology',
    icon: '🧪',
    description: 'Diabetes, thyroid disorders, and hormonal diseases',
    topicCount: 22,
    order: 5,
  },
  
  // =============================================================================
  // ANATOMY
  // =============================================================================
  {
    id: 'anatomy-thorax',
    subjectId: 'anatomy',
    name: 'Thorax',
    slug: 'thorax',
    icon: '🫁',
    description: 'Chest wall, lungs, heart, and mediastinum',
    topicCount: 20,
    order: 1,
  },
  {
    id: 'anatomy-abdomen',
    subjectId: 'anatomy',
    name: 'Abdomen',
    slug: 'abdomen',
    icon: '🫃',
    description: 'Abdominal wall, GI tract, and retroperitoneum',
    topicCount: 25,
    order: 2,
  },
  {
    id: 'anatomy-pelvis',
    subjectId: 'anatomy',
    name: 'Pelvis & Perineum',
    slug: 'pelvis-perineum',
    icon: '🦴',
    description: 'Pelvic organs, perineum, and reproductive anatomy',
    topicCount: 18,
    order: 3,
  },
  {
    id: 'anatomy-head-neck',
    subjectId: 'anatomy',
    name: 'Head & Neck',
    slug: 'head-neck',
    icon: '🗣️',
    description: 'Skull, face, neck, and cranial nerves',
    topicCount: 30,
    order: 4,
  },
  {
    id: 'anatomy-upper-limb',
    subjectId: 'anatomy',
    name: 'Upper Limb',
    slug: 'upper-limb',
    icon: '💪',
    description: 'Shoulder, arm, forearm, and hand',
    topicCount: 22,
    order: 5,
  },
  {
    id: 'anatomy-lower-limb',
    subjectId: 'anatomy',
    name: 'Lower Limb',
    slug: 'lower-limb',
    icon: '🦵',
    description: 'Hip, thigh, leg, and foot',
    topicCount: 22,
    order: 6,
  },
  
  // =============================================================================
  // OB-GYN
  // =============================================================================
  {
    id: 'obgyn-obstetrics',
    subjectId: 'obgyn',
    name: 'Obstetrics',
    slug: 'obstetrics',
    icon: '🤰',
    description: 'Pregnancy, labor, delivery, and postpartum care',
    topicCount: 35,
    order: 1,
  },
  {
    id: 'obgyn-gynecology',
    subjectId: 'obgyn',
    name: 'Gynecology',
    slug: 'gynecology',
    icon: '🌸',
    description: 'Female reproductive disorders and gynecologic surgery',
    topicCount: 28,
    order: 2,
  },
  {
    id: 'obgyn-fetal-medicine',
    subjectId: 'obgyn',
    name: 'Fetal Medicine',
    slug: 'fetal-medicine',
    icon: '👶',
    description: 'Fetal development, anomalies, and monitoring',
    topicCount: 15,
    order: 3,
  },
];

export function getSubspecialtiesBySubject(subjectId: string): Subspecialty[] {
  return SUBSPECIALTIES.filter(s => s.subjectId === subjectId).sort((a, b) => a.order - b.order);
}

export function getSubspecialtyById(id: string): Subspecialty | undefined {
  return SUBSPECIALTIES.find(s => s.id === id);
}

export function getSubspecialtyBySlug(subjectSlug: string, subspecialtySlug: string): Subspecialty | undefined {
  return SUBSPECIALTIES.find(s => 
    s.slug === subspecialtySlug && 
    SUBSPECIALTIES.some(sub => sub.id === s.id)
  );
}
