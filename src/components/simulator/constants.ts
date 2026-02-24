import {
  Users,
  ClipboardList,
  Stethoscope,
  Microscope,
  Pill,
  Eye,
  Activity,
  Heart,
  Wind,
  Brain,
  Bone,
} from 'lucide-react';
import type { SimulatorStep } from '@/lib/types/simulator';

// Step configuration
export const STEPS: { id: SimulatorStep; label: string; icon: React.ElementType }[] = [
  { id: 'presentation', label: 'Case Presentation', icon: Users },
  { id: 'history', label: 'History Taking', icon: ClipboardList },
  { id: 'examination', label: 'Physical Examination', icon: Stethoscope },
  { id: 'investigations', label: 'Investigations', icon: Microscope },
  { id: 'management', label: 'Management', icon: Pill },
];

export const STEP_INDEX: Record<SimulatorStep, number> = {
  presentation: 0,
  history: 1,
  examination: 2,
  investigations: 3,
  management: 4,
};

export const HISTORY_CATEGORIES = [
  { id: 'chief_complaint', label: 'Chief Complaint', color: 'text-red-400' },
  { id: 'history_of_presenting_illness', label: 'HPI', color: 'text-amber-400' },
  { id: 'past_history', label: 'Past History', color: 'text-blue-400' },
  { id: 'family_history', label: 'Family History', color: 'text-purple-400' },
  { id: 'personal_history', label: 'Personal History', color: 'text-green-400' },
  { id: 'drug_history', label: 'Drug History', color: 'text-cyan-400' },
];

export const EXAM_SYSTEMS = [
  { id: 'general', label: 'General', icon: Eye, color: 'text-gray-400' },
  { id: 'abdomen', label: 'Abdomen', icon: Activity, color: 'text-emerald-400' },
  { id: 'cardiovascular', label: 'Cardiovascular', icon: Heart, color: 'text-red-400' },
  { id: 'respiratory', label: 'Respiratory', icon: Wind, color: 'text-blue-400' },
  { id: 'neurological', label: 'Neurological', icon: Brain, color: 'text-purple-400' },
  { id: 'musculoskeletal', label: 'Musculoskeletal', icon: Bone, color: 'text-amber-400' },
];

export const INVESTIGATION_CATEGORIES = [
  { id: 'laboratory', label: 'Laboratory', color: 'text-blue-400' },
  { id: 'imaging', label: 'Imaging', color: 'text-emerald-400' },
  { id: 'special', label: 'Special Tests', color: 'text-purple-400' },
];
