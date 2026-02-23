/**
 * NucleuX Academy - User Progress Types
 * 
 * Tracks learning state, attempts, and achievements
 */


// =============================================================================
// USER PROGRESS (per topic)
// =============================================================================

export type ReadingStatus = 'not_started' | 'in_progress' | 'completed';

export interface UserTopicProgress {
  userId: string;
  topicId: string;
  
  // Reading progress
  readingStatus: ReadingStatus;
  lastReadAt?: Date;
  readingTimeMinutes: number;
  completedSectionIds: string[];
  
  // User notes
  personalNotes?: string;
  bookmarked: boolean;
  highlightedText?: string[];
  
  // MCQ performance on this topic
  mcqAttempts: number;
  mcqCorrect: number;
  avgMcqTimeSeconds: number;
  
  // Spaced repetition state
  nextReviewAt?: Date;
  reviewInterval: number;        // Days
  easeFactor: number;            // SM-2 algorithm (default 2.5)
  
  updatedAt: Date;
}

// =============================================================================
// MCQ ATTEMPT
// =============================================================================

export type AttemptContext = 'practice' | 'quiz' | 'exam' | 'review' | 'daily';

export interface MCQAttempt {
  id: string;
  userId: string;
  mcqId: string;
  topicId: string;
  subjectId: string;
  
  // Attempt details
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  
  // Context
  context: AttemptContext;
  sessionId?: string;            // If part of a test/quiz session
  
  createdAt: Date;
}

// =============================================================================
// FLASHCARD REVIEW (Spaced Repetition)
// =============================================================================

// SM-2 algorithm rating: 0-5
// 0-2: Incorrect (reset interval)
// 3: Correct with difficulty
// 4: Correct with hesitation
// 5: Perfect recall
export type FlashcardRating = 0 | 1 | 2 | 3 | 4 | 5;

export interface FlashcardReview {
  id: string;
  userId: string;
  flashcardId: string;
  topicId: string;
  
  // Review result
  rating: FlashcardRating;
  responseTimeMs: number;
  
  // SM-2 state after this review
  newInterval: number;           // Days until next review
  newEaseFactor: number;         // Updated ease factor
  nextReviewAt: Date;
  
  createdAt: Date;
}

export interface UserFlashcardState {
  userId: string;
  flashcardId: string;
  
  // Current SM-2 state
  interval: number;
  easeFactor: number;
  nextReviewAt: Date;
  
  // Stats
  totalReviews: number;
  correctReviews: number;
  lastReviewedAt?: Date;
}

// =============================================================================
// STUDY SESSION
// =============================================================================

export type SessionType = 'reading' | 'mcq_practice' | 'flashcard_review' | 'mixed' | 'pathway';

export interface StudySession {
  id: string;
  userId: string;
  
  // Session type
  type: SessionType;
  
  // Scope
  subjectId?: string;
  topicIds: string[];
  pathwayId?: string;
  
  // Timing
  startedAt: Date;
  endedAt?: Date;
  durationMinutes: number;
  
  // Results
  stats: {
    mcqsAttempted: number;
    mcqsCorrect: number;
    flashcardsReviewed: number;
    flashcardsCorrect: number;
    topicsRead: number;
    topicsCompleted: number;
  };
  
  // XP earned this session
  xpEarned: number;
}

// =============================================================================
// PATHWAY PROGRESS
// =============================================================================

export type PathwayStatus = 'enrolled' | 'in_progress' | 'completed' | 'paused';

export interface UserPathwayProgress {
  userId: string;
  pathwayId: string;
  
  // Status
  status: PathwayStatus;
  
  // Progress
  completedTopicIds: string[];
  currentModuleIndex: number;
  currentTopicIndex: number;
  
  // Stats
  startedAt: Date;
  completedAt?: Date;
  totalTimeMinutes: number;
  
  updatedAt: Date;
}

// =============================================================================
// ACHIEVEMENTS
// =============================================================================

export type AchievementType = 'streak' | 'topics' | 'mcqs' | 'accuracy' | 'time' | 'pathway' | 'special';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;                  // Emoji or icon name
  color: string;
  
  // Criteria
  type: AchievementType;
  threshold: number;             // Value to unlock
  
  // Reward
  xpReward: number;
  badgeUrl?: string;
  
  // Rarity
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  id: string;
  odp: string;
  achievementId: string;
  
  // Progress
  progress: number;              // Current value toward threshold
  isUnlocked: boolean;
  unlockedAt?: Date;
}

// =============================================================================
// STREAK
// =============================================================================

export interface UserStreak {
  userId: string;
  
  // Current streak
  currentStreak: number;
  lastActivityDate: string;      // YYYY-MM-DD
  
  // Records
  longestStreak: number;
  longestStreakEndDate?: string;
  
  // Freeze protection
  freezesRemaining: number;
  freezeUsedToday: boolean;
  
  updatedAt: Date;
}

// =============================================================================
// DAILY GOAL
// =============================================================================

export interface UserDailyGoal {
  userId: string;
  date: string;                  // YYYY-MM-DD
  
  // Goals
  targetStudyMinutes: number;
  targetMcqs: number;
  targetTopics: number;
  
  // Progress
  actualStudyMinutes: number;
  actualMcqs: number;
  actualTopics: number;
  
  // Completion
  isCompleted: boolean;
  completedAt?: Date;
  
  // XP
  xpEarned: number;
  bonusXp: number;               // For exceeding goals
}

// =============================================================================
// AGGREGATE STATS
// =============================================================================

export interface UserStats {
  userId: string;
  
  // Totals
  totalStudyMinutes: number;
  totalTopicsCompleted: number;
  totalMcqsAttempted: number;
  totalMcqsCorrect: number;
  totalFlashcardsReviewed: number;
  totalXp: number;
  
  // Averages
  avgMcqAccuracy: number;        // 0-1
  avgSessionMinutes: number;
  
  // Streaks
  currentStreak: number;
  longestStreak: number;
  
  // Depth breakdown
  depthProgress: {
    mbbs: { topics: number; mcqs: number; accuracy: number };
    pg: { topics: number; mcqs: number; accuracy: number };
    superSpecialty: { topics: number; mcqs: number; accuracy: number };
  };
  
  // Subject breakdown (top 5)
  subjectProgress: Array<{
    subjectId: string;
    subjectName: string;
    topicsCompleted: number;
    mcqsAttempted: number;
    accuracy: number;
  }>;
  
  // Time breakdown (last 7 days)
  weeklyStudyMinutes: number[];  // [Sun, Mon, ..., Sat]
  
  updatedAt: Date;
}
