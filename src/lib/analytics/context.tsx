"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  UserAnalytics,
  MCQAttempt,
  ReadingSession,
  VideoSession,
  TopicMemory,
  CalibrationData,
} from './types';
import {
  loadAnalytics,
  saveAnalytics,
  logMCQAttempt,
  logReadingSession,
  logVideoSession,
  recalculateMemoryStrengths,
  getTopicsNeedingReview,
  getWeeklyActivity,
  clearAnalytics,
} from './store';

interface AnalyticsContextValue {
  analytics: UserAnalytics;
  isLoaded: boolean;
  isSyncing: boolean;
  
  // Actions
  trackMCQAttempt: (attempt: Omit<MCQAttempt, 'id' | 'timestamp'>) => void;
  trackReadingSession: (session: Omit<ReadingSession, 'id'>) => void;
  trackVideoSession: (session: Omit<VideoSession, 'id'>) => void;
  
  // Computed
  getCalibration: () => CalibrationData[];
  getTopicsForReview: () => TopicMemory[];
  getWeeklyStats: () => ReturnType<typeof getWeeklyActivity>;
  getOverallAccuracy: () => number;
  getTopicPerformance: () => Array<{
    topicId: string;
    topicName: string;
    accuracy: number;
    attempts: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  getDifficultyBreakdown: () => Array<{
    difficulty: string;
    correct: number;
    total: number;
    percentage: number;
  }>;
  
  // Admin
  refreshMemoryStrengths: () => void;
  resetAnalytics: () => void;
  syncToCloud: () => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

// Debounce sync to avoid excessive API calls
const SYNC_DEBOUNCE_MS = 5000;

type CloudDailyStat = {
  date: string;
  study_minutes?: number | null;
  mcqs_attempted?: number | null;
  mcqs_correct?: number | null;
  atoms_completed?: number | null;
  studyMinutes?: number | null;
  questionsAttempted?: number | null;
  questionsCorrect?: number | null;
  topicsReviewed?: string[];
  streak?: boolean;
};

function normalizeCloudDailyStat(stat: CloudDailyStat) {
  const questionsAttempted = stat.questionsAttempted ?? stat.mcqs_attempted ?? 0;
  const questionsCorrect = stat.questionsCorrect ?? stat.mcqs_correct ?? 0;
  const studyMinutes = stat.studyMinutes ?? stat.study_minutes ?? 0;

  return {
    date: stat.date,
    questionsAttempted,
    questionsCorrect,
    studyMinutes,
    topicsReviewed: Array.isArray(stat.topicsReviewed) ? stat.topicsReviewed : [],
    streak: typeof stat.streak === 'boolean'
      ? stat.streak
      : questionsAttempted > 0 || studyMinutes > 0,
  };
}

function normalizeStoredDailyStats(stats: CloudDailyStat[] = []) {
  return stats.map((stat) => normalizeCloudDailyStat(stat));
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSyncRef = useRef(false);
  const syncToCloudRef = useRef<() => Promise<void>>(async () => {});
  
  // Sync to Supabase
  const syncToCloud = useCallback(async () => {
    if (!analytics || isSyncing) return;
    
    setIsSyncing(true);
    try {
      const response = await fetch('/api/analytics/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mcqAttempts: analytics.mcqAttempts.slice(-50), // Only sync recent
          dailyStats: analytics.dailyStats.slice(-30),
          currentStreak: analytics.currentStreak,
          longestStreak: analytics.longestStreak,
        }),
      });
      
      if (!response.ok) {
        // Not logged in or error - that's fine, keep using localStorage
        console.log('Analytics sync skipped (not authenticated or error)');
      }
    } catch (error) {
      console.log('Analytics sync skipped:', error);
    } finally {
      setIsSyncing(false);
      pendingSyncRef.current = false;
    }
  }, [analytics, isSyncing]);

  // Debounced sync
  const debouncedSync = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    pendingSyncRef.current = true;
    syncTimeoutRef.current = setTimeout(() => {
      syncToCloud();
    }, SYNC_DEBOUNCE_MS);
  }, [syncToCloud]);

  useEffect(() => {
    syncToCloudRef.current = syncToCloud;
  }, [syncToCloud]);

  // Load on mount + try to merge from cloud
  useEffect(() => {
    const loadData = async () => {
      // Load from localStorage first (fast)
      const localData = loadAnalytics();
      localData.dailyStats = normalizeStoredDailyStats(localData.dailyStats as CloudDailyStat[]);
      const updated = recalculateMemoryStrengths(localData);
      setAnalytics(updated);
      setIsLoaded(true);

      // Then try to load from cloud and merge
      try {
        const response = await fetch('/api/analytics');
        if (response.ok) {
          const cloudData = await response.json();
          
          // Merge cloud data with local (cloud takes precedence for streaks)
          if (cloudData.currentStreak > updated.currentStreak) {
            updated.currentStreak = cloudData.currentStreak;
          }
          if (cloudData.longestStreak > updated.longestStreak) {
            updated.longestStreak = cloudData.longestStreak;
          }
          
          // Merge daily stats (avoid duplicates)
          const existingDates = new Set(updated.dailyStats.map(d => d.date));
          cloudData.dailyStats?.forEach((stat: CloudDailyStat) => {
            if (!existingDates.has(stat.date)) {
              updated.dailyStats.push(normalizeCloudDailyStat(stat));
            }
          });
          
          saveAnalytics(updated);
          setAnalytics({ ...updated });
        }
      } catch {
        // Not logged in or network error - continue with localStorage
        console.log('Cloud analytics not available, using localStorage');
      }
    };

    loadData();
    
    // Cleanup sync timeout on unmount
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      // Sync any pending changes before unmount
      if (pendingSyncRef.current) {
        void syncToCloudRef.current();
      }
    };
  }, []);
  
  // Generate unique ID
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Track MCQ attempt
  const trackMCQAttempt = useCallback((attempt: Omit<MCQAttempt, 'id' | 'timestamp'>) => {
    if (!analytics) return;
    
    const fullAttempt: MCQAttempt = {
      ...attempt,
      id: generateId(),
      timestamp: new Date(),
    };
    
    const updated = logMCQAttempt(analytics, fullAttempt);
    setAnalytics(updated);
    debouncedSync();
  }, [analytics, debouncedSync]);
  
  // Track reading session
  const trackReadingSession = useCallback((session: Omit<ReadingSession, 'id'>) => {
    if (!analytics) return;
    
    const fullSession: ReadingSession = {
      ...session,
      id: generateId(),
    };
    
    const updated = logReadingSession(analytics, fullSession);
    setAnalytics(updated);
    debouncedSync();
  }, [analytics, debouncedSync]);
  
  // Track video session
  const trackVideoSession = useCallback((session: Omit<VideoSession, 'id'>) => {
    if (!analytics) return;
    
    const fullSession: VideoSession = {
      ...session,
      id: generateId(),
    };
    
    const updated = logVideoSession(analytics, fullSession);
    setAnalytics(updated);
    debouncedSync();
  }, [analytics, debouncedSync]);
  
  // Get calibration data
  const getCalibration = useCallback(() => {
    return analytics?.calibration || [];
  }, [analytics]);
  
  // Get topics needing review
  const getTopicsForReview = useCallback(() => {
    if (!analytics) return [];
    return getTopicsNeedingReview(analytics);
  }, [analytics]);
  
  // Get weekly stats
  const getWeeklyStats = useCallback(() => {
    if (!analytics) return [];
    return getWeeklyActivity(analytics);
  }, [analytics]);
  
  // Get overall accuracy
  const getOverallAccuracy = useCallback(() => {
    if (!analytics || analytics.totalQuestions === 0) return 0;
    return Math.round((analytics.correctAnswers / analytics.totalQuestions) * 100);
  }, [analytics]);
  
  // Get topic performance
  const getTopicPerformance = useCallback(() => {
    if (!analytics) return [];
    
    return analytics.topicMemories
      .filter(m => m.mcqAttempts > 0)
      .map(memory => {
        const recentAttempts = analytics.mcqAttempts
          .filter(a => a.topicId === memory.topicId)
          .slice(-10);
        
        const firstHalf = recentAttempts.slice(0, 5);
        const secondHalf = recentAttempts.slice(5);
        
        const firstAccuracy = firstHalf.length > 0
          ? firstHalf.filter(a => a.isCorrect).length / firstHalf.length
          : 0;
        const secondAccuracy = secondHalf.length > 0
          ? secondHalf.filter(a => a.isCorrect).length / secondHalf.length
          : firstAccuracy;
        
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (secondAccuracy > firstAccuracy + 0.1) trend = 'up';
        else if (secondAccuracy < firstAccuracy - 0.1) trend = 'down';
        
        return {
          topicId: memory.topicId,
          topicName: memory.topicName,
          accuracy: memory.mcqAccuracy,
          attempts: memory.mcqAttempts,
          trend,
        };
      })
      .sort((a, b) => b.accuracy - a.accuracy);
  }, [analytics]);
  
  // Get difficulty breakdown
  const getDifficultyBreakdown = useCallback(() => {
    if (!analytics) return [];
    
    const difficulties = ['Easy', 'Medium', 'Hard'];
    
    return difficulties.map(difficulty => {
      const attempts = analytics.mcqAttempts.filter(a => a.difficulty === difficulty);
      const correct = attempts.filter(a => a.isCorrect).length;
      
      return {
        difficulty,
        correct,
        total: attempts.length,
        percentage: attempts.length > 0 ? Math.round((correct / attempts.length) * 100) : 0,
      };
    });
  }, [analytics]);
  
  // Refresh memory strengths
  const refreshMemoryStrengths = useCallback(() => {
    if (!analytics) return;
    const updated = recalculateMemoryStrengths(analytics);
    setAnalytics(updated);
  }, [analytics]);
  
  // Reset analytics
  const resetAnalytics = useCallback(() => {
    clearAnalytics();
    const fresh = loadAnalytics();
    setAnalytics(fresh);
  }, []);
  
  if (!isLoaded || !analytics) {
    return <>{children}</>;
  }
  
  return (
    <AnalyticsContext.Provider
      value={{
        analytics,
        isLoaded,
        isSyncing,
        trackMCQAttempt,
        trackReadingSession,
        trackVideoSession,
        getCalibration,
        getTopicsForReview,
        getWeeklyStats,
        getOverallAccuracy,
        getTopicPerformance,
        getDifficultyBreakdown,
        refreshMemoryStrengths,
        resetAnalytics,
        syncToCloud,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

// Default no-op context value
const defaultValue: AnalyticsContextValue = {
  analytics: {
    totalQuestions: 0,
    correctAnswers: 0,
    totalStudyMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    topicsCompleted: 0,
    mcqAttempts: [],
    readingSessions: [],
    videoSessions: [],
    topicMemories: [],
    dailyStats: [],
    calibration: [
      { confidence: 'guessing', expected: 25, actual: 0, totalQuestions: 0, correctQuestions: 0 },
      { confidence: 'unsure', expected: 50, actual: 0, totalQuestions: 0, correctQuestions: 0 },
      { confidence: 'sure', expected: 75, actual: 0, totalQuestions: 0, correctQuestions: 0 },
      { confidence: 'very-sure', expected: 95, actual: 0, totalQuestions: 0, correctQuestions: 0 },
    ],
  },
  isLoaded: false,
  isSyncing: false,
  trackMCQAttempt: () => {},
  trackReadingSession: () => {},
  trackVideoSession: () => {},
  getCalibration: () => [],
  getTopicsForReview: () => [],
  getWeeklyStats: () => [],
  getOverallAccuracy: () => 0,
  getTopicPerformance: () => [],
  getDifficultyBreakdown: () => [],
  refreshMemoryStrengths: () => {},
  resetAnalytics: () => {},
  syncToCloud: async () => {},
};

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  return context || defaultValue;
}
