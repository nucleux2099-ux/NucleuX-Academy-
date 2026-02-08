/**
 * NucleuX Academy - Subject Seed Data
 */

import type { Subject } from '../types';

export const SUBJECTS: Subject[] = [
  {
    id: 'surgery',
    name: 'Surgery',
    slug: 'surgery',
    icon: '🔪',
    color: '#EF4444',
    description: 'General surgery, subspecialties, and surgical principles',
    topicCount: 156,
    order: 1,
  },
  {
    id: 'medicine',
    name: 'Medicine',
    slug: 'medicine',
    icon: '💊',
    color: '#3B82F6',
    description: 'Internal medicine and medical subspecialties',
    topicCount: 203,
    order: 2,
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    slug: 'pediatrics',
    icon: '👶',
    color: '#10B981',
    description: 'Child health from neonates to adolescents',
    topicCount: 142,
    order: 3,
  },
  {
    id: 'obgyn',
    name: 'OB-GYN',
    slug: 'obgyn',
    icon: '🤰',
    color: '#EC4899',
    description: 'Obstetrics and gynecology',
    topicCount: 128,
    order: 4,
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    slug: 'orthopedics',
    icon: '🦴',
    color: '#F59E0B',
    description: 'Musculoskeletal system and trauma',
    topicCount: 98,
    order: 5,
  },
  {
    id: 'anatomy',
    name: 'Anatomy',
    slug: 'anatomy',
    icon: '🫀',
    color: '#6366F1',
    description: 'Human structural anatomy',
    topicCount: 186,
    order: 6,
  },
  {
    id: 'physiology',
    name: 'Physiology',
    slug: 'physiology',
    icon: '⚡',
    color: '#8B5CF6',
    description: 'Body functions and mechanisms',
    topicCount: 145,
    order: 7,
  },
  {
    id: 'biochemistry',
    name: 'Biochemistry',
    slug: 'biochemistry',
    icon: '🧬',
    color: '#14B8A6',
    description: 'Molecular and cellular chemistry',
    topicCount: 112,
    order: 8,
  },
  {
    id: 'pathology',
    name: 'Pathology',
    slug: 'pathology',
    icon: '🔬',
    color: '#F97316',
    description: 'Disease mechanisms and diagnosis',
    topicCount: 178,
    order: 9,
  },
  {
    id: 'pharmacology',
    name: 'Pharmacology',
    slug: 'pharmacology',
    icon: '💉',
    color: '#06B6D4',
    description: 'Drug actions and therapeutics',
    topicCount: 134,
    order: 10,
  },
  {
    id: 'microbiology',
    name: 'Microbiology',
    slug: 'microbiology',
    icon: '🦠',
    color: '#84CC16',
    description: 'Infectious agents and immunity',
    topicCount: 156,
    order: 11,
  },
  {
    id: 'forensic',
    name: 'Forensic Medicine',
    slug: 'forensic',
    icon: '⚖️',
    color: '#64748B',
    description: 'Legal aspects of medicine',
    topicCount: 67,
    order: 12,
  },
];

export function getSubjectById(id: string): Subject | undefined {
  return SUBJECTS.find(s => s.id === id);
}

export function getSubjectBySlug(slug: string): Subject | undefined {
  return SUBJECTS.find(s => s.slug === slug);
}
