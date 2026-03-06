/**
 * NucleuX Academy - User Profile & Learning State Types
 */

// =============================================================================
// USER LEVEL & EXAM TARGETS
// =============================================================================

export type UserLevel = 'ug' | 'pg' | 'resident' | 'practitioner';

export const USER_LEVEL_CONFIG: Record<UserLevel, {
  label: string;
  description: string;
  icon: string;
}> = {
  ug: {
    label: 'Undergraduate',
    description: 'MBBS student',
    icon: '📚',
  },
  pg: {
    label: 'Postgraduate',
    description: 'MD/MS resident or preparing for PG entrance',
    icon: '🎓',
  },
  resident: {
    label: 'Resident',
    description: 'Currently in residency training',
    icon: '🏥',
  },
  practitioner: {
    label: 'Practitioner',
    description: 'Practicing physician',
    icon: '⚕️',
  },
};

export type ExamTarget = 
  | 'neet_pg'
  | 'inicet'
  | 'usmle_step1'
  | 'usmle_step2'
  | 'mrcs'
  | 'fmge'
  | 'neet_ss'
  | 'none';

export const EXAM_TARGET_CONFIG: Record<ExamTarget, {
  label: string;
  country: string;
  description: string;
}> = {
  neet_pg: {
    label: 'NEET PG',
    country: '🇮🇳',
    description: 'National Eligibility cum Entrance Test - Postgraduate',
  },
  inicet: {
    label: 'INI-CET',
    country: '🇮🇳',
    description: 'Institute of National Importance Combined Entrance Test',
  },
  usmle_step1: {
    label: 'USMLE Step 1',
    country: '🇺🇸',
    description: 'United States Medical Licensing Examination - Step 1',
  },
  usmle_step2: {
    label: 'USMLE Step 2',
    country: '🇺🇸',
    description: 'United States Medical Licensing Examination - Step 2 CK',
  },
  mrcs: {
    label: 'MRCS',
    country: '🇬🇧',
    description: 'Membership of the Royal Colleges of Surgeons',
  },
  fmge: {
    label: 'FMGE',
    country: '🇮🇳',
    description: 'Foreign Medical Graduate Examination',
  },
  neet_ss: {
    label: 'NEET SS',
    country: '🇮🇳',
    description: 'NEET Super Specialty',
  },
  none: {
    label: 'No specific exam',
    country: '🌍',
    description: 'Learning for knowledge',
  },
};

// =============================================================================
// LEARNING STATE
// =============================================================================

export interface TopicProgress {
  topicId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'needs_review';
  startedAt?: string;
  completedAt?: string;
  timeSpentMinutes: number;
  lastAccessedAt: string;
  
  // Mode-specific progress
  explorerViewed: boolean;
  examPrepViewed: boolean;
  quizAttempted: boolean;
  casesViewed: boolean;
  
  // Quiz performance
  quizScore?: {
    correct: number;
    total: number;
    lastAttemptAt: string;
  };
}

export interface CardPerformance {
  cardId: string;
  topicId: string;
  attempts: number;
  correctCount: number;
  lastAttemptAt: string;
  nextReviewAt: string; // Spaced repetition
  easeFactor: number; // SM-2 algorithm
  interval: number; // Days until next review
}

export interface LearningStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  totalStudyDays: number;
}

export interface WeakArea {
  topicId: string;
  topicName: string;
  reason: 'low_quiz_score' | 'not_reviewed' | 'failed_cards';
  score?: number;
  suggestedAction: string;
}

// =============================================================================
// USER PROFILE
// =============================================================================

export interface UserPreferences {
  // Study preferences
  dailyGoalMinutes: number;
  preferredStudyTime: 'morning' | 'afternoon' | 'evening' | 'night';
  enableReminders: boolean;
  
  // Display preferences
  defaultViewMode: 'explorer' | 'examPrep' | 'quiz';
  showHighYieldFirst: boolean;
  enableAnimations: boolean;
  
  // Notification preferences
  streakReminders: boolean;
  reviewReminders: boolean;
  weeklyProgress: boolean;
}

export interface UserProfile {
  id: string;
  
  // Basic info
  level: UserLevel;
  examTarget: ExamTarget;
  examDate?: string; // ISO date string
  
  // Subjects of interest
  primarySubjects: string[]; // Subject IDs
  
  // Preferences
  preferences: UserPreferences;
  
  // Learning state
  topicProgress: Record<string, TopicProgress>;
  cardPerformance: Record<string, CardPerformance>;
  streak: LearningStreak;
  
  // Computed/cached
  weakAreas: WeakArea[];
  completedTopicsCount: number;
  totalStudyMinutes: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// DEFAULT VALUES
// =============================================================================

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  dailyGoalMinutes: 30,
  preferredStudyTime: 'evening',
  enableReminders: true,
  defaultViewMode: 'explorer',
  showHighYieldFirst: true,
  enableAnimations: true,
  streakReminders: true,
  reviewReminders: true,
  weeklyProgress: true,
};

export const DEFAULT_LEARNING_STREAK: LearningStreak = {
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: '',
  totalStudyDays: 0,
};

export function createDefaultUserProfile(id: string): UserProfile {
  return {
    id,
    level: 'pg',
    examTarget: 'neet_pg',
    examDate: undefined,
    primarySubjects: ['surgery', 'medicine'],
    preferences: DEFAULT_USER_PREFERENCES,
    topicProgress: {},
    cardPerformance: {},
    streak: DEFAULT_LEARNING_STREAK,
    weakAreas: [],
    completedTopicsCount: 0,
    totalStudyMinutes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
