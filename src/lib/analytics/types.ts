// Analytics Event Types for NucleuX Academy

export interface MCQAttempt {
  id: string;
  questionId: string;
  topicId: string;
  topicName: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  confidence: 'guessing' | 'unsure' | 'sure' | 'very-sure';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeSpent: number; // seconds
  timestamp: Date;
  isHighYield: boolean;
}

export interface ReadingSession {
  id: string;
  topicId: string;
  topicName: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  scrollProgress: number; // 0-100
  completed: boolean;
  notesAdded: number;
  highlightsAdded: number;
}

export interface VideoSession {
  id: string;
  videoId: string;
  videoTitle: string;
  instructor: string;
  startTime: Date;
  endTime?: Date;
  watchedDuration: number; // seconds
  totalDuration: number;
  completionPercent: number;
  notesAdded: number;
  chaptersCompleted: string[];
}

export interface TopicMemory {
  topicId: string;
  topicName: string;
  category: string;
  firstLearned: Date;
  lastReviewed: Date;
  reviewCount: number;
  initialStrength: number; // 0-100
  currentStrength: number; // decays over time
  optimalReviewDays: number;
  mcqAttempts: number;
  mcqAccuracy: number;
}

export interface CalibrationData {
  confidence: 'guessing' | 'unsure' | 'sure' | 'very-sure';
  expected: number;
  actual: number;
  totalQuestions: number;
  correctQuestions: number;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  questionsAttempted: number;
  questionsCorrect: number;
  studyMinutes: number;
  topicsReviewed: string[];
  streak: boolean;
}

export interface UserAnalytics {
  // Lifetime stats
  totalQuestions: number;
  correctAnswers: number;
  totalStudyMinutes: number;
  currentStreak: number;
  longestStreak: number;
  topicsCompleted: number;
  
  // MCQ tracking
  mcqAttempts: MCQAttempt[];
  
  // Reading tracking
  readingSessions: ReadingSession[];
  
  // Video tracking
  videoSessions: VideoSession[];
  
  // Memory/Retention tracking
  topicMemories: TopicMemory[];
  
  // Daily history
  dailyStats: DailyStats[];
  
  // Calibration (calculated)
  calibration: CalibrationData[];
}

// Expected accuracy for each confidence level
export const CONFIDENCE_EXPECTED: Record<string, number> = {
  'guessing': 25,
  'unsure': 50,
  'sure': 75,
  'very-sure': 95,
};

// Forgetting curve decay rate (Ebbinghaus)
export const MEMORY_DECAY_RATE = 0.15; // ~15% per day without review

// Calculate current memory strength based on days since review
export function calculateMemoryStrength(
  initialStrength: number,
  daysSinceReview: number,
  reviewCount: number
): number {
  // Each review makes memory more resistant to decay
  const decayResistance = Math.min(0.8, reviewCount * 0.1);
  const effectiveDecay = MEMORY_DECAY_RATE * (1 - decayResistance);
  
  // Exponential decay: S(t) = S0 * e^(-λt)
  const strength = initialStrength * Math.exp(-effectiveDecay * daysSinceReview);
  return Math.max(0, Math.min(100, Math.round(strength)));
}

// Calculate optimal review interval based on strength and review count
export function calculateOptimalReviewDays(reviewCount: number): number {
  // Spaced repetition: intervals increase with each successful review
  // 1 day -> 3 days -> 7 days -> 14 days -> 30 days -> 60 days
  const intervals = [1, 3, 7, 14, 30, 60, 90];
  return intervals[Math.min(reviewCount, intervals.length - 1)];
}
