"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load on mount
  useEffect(() => {
    const loaded = loadAnalytics();
    // Recalculate memory strengths on load
    const updated = recalculateMemoryStrengths(loaded);
    setAnalytics(updated);
    setIsLoaded(true);
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
  }, [analytics]);
  
  // Track reading session
  const trackReadingSession = useCallback((session: Omit<ReadingSession, 'id'>) => {
    if (!analytics) return;
    
    const fullSession: ReadingSession = {
      ...session,
      id: generateId(),
    };
    
    const updated = logReadingSession(analytics, fullSession);
    setAnalytics(updated);
  }, [analytics]);
  
  // Track video session
  const trackVideoSession = useCallback((session: Omit<VideoSession, 'id'>) => {
    if (!analytics) return;
    
    const fullSession: VideoSession = {
      ...session,
      id: generateId(),
    };
    
    const updated = logVideoSession(analytics, fullSession);
    setAnalytics(updated);
  }, [analytics]);
  
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
        // Calculate trend from recent attempts
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
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
}
