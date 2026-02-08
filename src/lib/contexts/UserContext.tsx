"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { 
  UserProfile, 
  UserLevel, 
  ExamTarget, 
  TopicProgress,
  CardPerformance,
  WeakArea 
} from '@/lib/types/user';
import { createDefaultUserProfile, DEFAULT_USER_PREFERENCES } from '@/lib/types/user';

// =============================================================================
// CONTEXT TYPES
// =============================================================================

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  
  // Profile actions
  updateLevel: (level: UserLevel) => void;
  updateExamTarget: (target: ExamTarget, examDate?: string) => void;
  updatePreferences: (prefs: Partial<UserProfile['preferences']>) => void;
  
  // Progress actions
  markTopicStarted: (topicId: string) => void;
  markTopicCompleted: (topicId: string) => void;
  updateTopicProgress: (topicId: string, progress: Partial<TopicProgress>) => void;
  
  // Quiz actions
  recordQuizAttempt: (topicId: string, correct: number, total: number) => void;
  recordCardAttempt: (cardId: string, topicId: string, wasCorrect: boolean) => void;
  
  // Computed helpers
  getTopicProgress: (topicId: string) => TopicProgress | undefined;
  isTopicCompleted: (topicId: string) => boolean;
  getWeakAreas: () => WeakArea[];
  getDueForReview: () => string[]; // Topic IDs
  
  // Streak
  updateStreak: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// =============================================================================
// LOCAL STORAGE HELPERS
// =============================================================================

const STORAGE_KEY = 'nucleux_user_profile';

function loadUserFromStorage(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load user profile:', e);
  }
  return null;
}

function saveUserToStorage(user: UserProfile) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user profile:', e);
  }
}

// =============================================================================
// SPACED REPETITION HELPERS (SM-2 Algorithm Simplified)
// =============================================================================

function calculateNextReview(
  wasCorrect: boolean,
  currentInterval: number,
  easeFactor: number
): { interval: number; easeFactor: number } {
  if (!wasCorrect) {
    // Reset on wrong answer
    return { interval: 1, easeFactor: Math.max(1.3, easeFactor - 0.2) };
  }
  
  // Correct answer - increase interval
  const newEaseFactor = Math.max(1.3, easeFactor + 0.1);
  const newInterval = currentInterval === 0 
    ? 1 
    : currentInterval === 1 
      ? 3 
      : Math.round(currentInterval * newEaseFactor);
  
  return { interval: newInterval, easeFactor: newEaseFactor };
}

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const stored = loadUserFromStorage();
    if (stored) {
      setUser(stored);
    } else {
      // Create default user
      const defaultUser = createDefaultUserProfile('local-user');
      setUser(defaultUser);
      saveUserToStorage(defaultUser);
    }
    setIsLoading(false);
  }, []);

  // Save user whenever it changes
  useEffect(() => {
    if (user) {
      saveUserToStorage(user);
    }
  }, [user]);

  // =============================================================================
  // PROFILE ACTIONS
  // =============================================================================

  const updateLevel = useCallback((level: UserLevel) => {
    setUser(prev => prev ? { ...prev, level, updatedAt: new Date().toISOString() } : prev);
  }, []);

  const updateExamTarget = useCallback((target: ExamTarget, examDate?: string) => {
    setUser(prev => prev ? { 
      ...prev, 
      examTarget: target, 
      examDate,
      updatedAt: new Date().toISOString() 
    } : prev);
  }, []);

  const updatePreferences = useCallback((prefs: Partial<UserProfile['preferences']>) => {
    setUser(prev => prev ? {
      ...prev,
      preferences: { ...prev.preferences, ...prefs },
      updatedAt: new Date().toISOString()
    } : prev);
  }, []);

  // =============================================================================
  // PROGRESS ACTIONS
  // =============================================================================

  const markTopicStarted = useCallback((topicId: string) => {
    setUser(prev => {
      if (!prev) return prev;
      const existing = prev.topicProgress[topicId];
      if (existing) return prev; // Already started
      
      const newProgress: TopicProgress = {
        topicId,
        status: 'in_progress',
        startedAt: new Date().toISOString(),
        timeSpentMinutes: 0,
        lastAccessedAt: new Date().toISOString(),
        explorerViewed: false,
        examPrepViewed: false,
        quizAttempted: false,
        casesViewed: false,
      };
      
      return {
        ...prev,
        topicProgress: { ...prev.topicProgress, [topicId]: newProgress },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const markTopicCompleted = useCallback((topicId: string) => {
    setUser(prev => {
      if (!prev) return prev;
      const existing = prev.topicProgress[topicId] || {
        topicId,
        status: 'not_started',
        timeSpentMinutes: 0,
        lastAccessedAt: new Date().toISOString(),
        explorerViewed: false,
        examPrepViewed: false,
        quizAttempted: false,
        casesViewed: false,
      };
      
      return {
        ...prev,
        topicProgress: {
          ...prev.topicProgress,
          [topicId]: {
            ...existing,
            status: 'completed',
            completedAt: new Date().toISOString(),
            lastAccessedAt: new Date().toISOString(),
          }
        },
        completedTopicsCount: prev.completedTopicsCount + 1,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const updateTopicProgress = useCallback((topicId: string, progress: Partial<TopicProgress>) => {
    setUser(prev => {
      if (!prev) return prev;
      const existing = prev.topicProgress[topicId] || {
        topicId,
        status: 'not_started',
        timeSpentMinutes: 0,
        lastAccessedAt: new Date().toISOString(),
        explorerViewed: false,
        examPrepViewed: false,
        quizAttempted: false,
        casesViewed: false,
      };
      
      return {
        ...prev,
        topicProgress: {
          ...prev.topicProgress,
          [topicId]: { ...existing, ...progress, lastAccessedAt: new Date().toISOString() }
        },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  // =============================================================================
  // QUIZ ACTIONS
  // =============================================================================

  const recordQuizAttempt = useCallback((topicId: string, correct: number, total: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const existing = prev.topicProgress[topicId] || {
        topicId,
        status: 'in_progress',
        timeSpentMinutes: 0,
        lastAccessedAt: new Date().toISOString(),
        explorerViewed: false,
        examPrepViewed: false,
        quizAttempted: false,
        casesViewed: false,
      };
      
      return {
        ...prev,
        topicProgress: {
          ...prev.topicProgress,
          [topicId]: {
            ...existing,
            quizAttempted: true,
            quizScore: { correct, total, lastAttemptAt: new Date().toISOString() },
            lastAccessedAt: new Date().toISOString(),
          }
        },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const recordCardAttempt = useCallback((cardId: string, topicId: string, wasCorrect: boolean) => {
    setUser(prev => {
      if (!prev) return prev;
      const existing = prev.cardPerformance[cardId] || {
        cardId,
        topicId,
        attempts: 0,
        correctCount: 0,
        lastAttemptAt: new Date().toISOString(),
        nextReviewAt: new Date().toISOString(),
        easeFactor: 2.5,
        interval: 0,
      };
      
      const { interval, easeFactor } = calculateNextReview(
        wasCorrect,
        existing.interval,
        existing.easeFactor
      );
      
      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + interval);
      
      return {
        ...prev,
        cardPerformance: {
          ...prev.cardPerformance,
          [cardId]: {
            ...existing,
            attempts: existing.attempts + 1,
            correctCount: existing.correctCount + (wasCorrect ? 1 : 0),
            lastAttemptAt: new Date().toISOString(),
            nextReviewAt: nextReviewDate.toISOString(),
            easeFactor,
            interval,
          }
        },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  // =============================================================================
  // COMPUTED HELPERS
  // =============================================================================

  const getTopicProgress = useCallback((topicId: string): TopicProgress | undefined => {
    return user?.topicProgress[topicId];
  }, [user]);

  const isTopicCompleted = useCallback((topicId: string): boolean => {
    return user?.topicProgress[topicId]?.status === 'completed';
  }, [user]);

  const getWeakAreas = useCallback((): WeakArea[] => {
    if (!user) return [];
    
    const weakAreas: WeakArea[] = [];
    
    Object.values(user.topicProgress).forEach(progress => {
      if (progress.quizScore && progress.quizScore.total > 0) {
        const score = progress.quizScore.correct / progress.quizScore.total;
        if (score < 0.6) {
          weakAreas.push({
            topicId: progress.topicId,
            topicName: progress.topicId, // Would need to lookup
            reason: 'low_quiz_score',
            score: Math.round(score * 100),
            suggestedAction: 'Review this topic and retake the quiz',
          });
        }
      }
    });
    
    return weakAreas;
  }, [user]);

  const getDueForReview = useCallback((): string[] => {
    if (!user) return [];
    
    const now = new Date();
    const dueCards: string[] = [];
    
    Object.values(user.cardPerformance).forEach(card => {
      if (new Date(card.nextReviewAt) <= now) {
        if (!dueCards.includes(card.topicId)) {
          dueCards.push(card.topicId);
        }
      }
    });
    
    return dueCards;
  }, [user]);

  // =============================================================================
  // STREAK
  // =============================================================================

  const updateStreak = useCallback(() => {
    setUser(prev => {
      if (!prev) return prev;
      
      const today = new Date().toISOString().split('T')[0];
      const lastStudy = prev.streak.lastStudyDate;
      
      if (lastStudy === today) {
        // Already studied today
        return prev;
      }
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      let newStreak = prev.streak.currentStreak;
      if (lastStudy === yesterdayStr) {
        // Consecutive day
        newStreak += 1;
      } else {
        // Streak broken, start new
        newStreak = 1;
      }
      
      return {
        ...prev,
        streak: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, prev.streak.longestStreak),
          lastStudyDate: today,
          totalStudyDays: prev.streak.totalStudyDays + 1,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================

  const value: UserContextType = {
    user,
    isLoading,
    updateLevel,
    updateExamTarget,
    updatePreferences,
    markTopicStarted,
    markTopicCompleted,
    updateTopicProgress,
    recordQuizAttempt,
    recordCardAttempt,
    getTopicProgress,
    isTopicCompleted,
    getWeakAreas,
    getDueForReview,
    updateStreak,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
