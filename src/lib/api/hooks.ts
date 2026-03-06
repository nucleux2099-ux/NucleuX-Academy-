"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { LearningMethodEfficacyReadModel } from '@/lib/learning/topic-lifecycle';
import type { User } from '@supabase/supabase-js';

// Types
interface UseQueryOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

interface UseQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Generic fetch hook
function useQuery<T>(
  url: string,
  options: UseQueryOptions = {}
): UseQueryResult<T> {
  const { enabled = true, refetchInterval } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    try {
      setIsLoading(true);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [url, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (refetchInterval && enabled) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [refetchInterval, enabled, fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// ============================================
// PROFILE HOOKS
// ============================================

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  specialty?: string;
  level?: string;
  institution?: string;
  target_exam?: string;
  created_at?: string;
  plan: string;
  onboarding_completed: boolean;
  preferences: {
    daily_goal_minutes: number;
    mcq_daily_target: number;
    preferred_study_time: string;
    notification_email: boolean;
    notification_telegram?: boolean;
    atom_proactive?: boolean;
    theme: string;
  };
  streak: {
    current_streak: number;
    longest_streak: number;
    last_study_date?: string;
  };
}

export function useProfile() {
  return useQuery<UserProfile>('/api/profile');
}

export function useUpdateProfile() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfile = async (data: Partial<UserProfile>) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return await res.json();
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateProfile, isUpdating };
}

// ============================================
// STREAK HOOKS
// ============================================

export interface Streak {
  current_streak: number;
  longest_streak: number;
  last_study_date?: string;
  streak_started_at?: string;
}

export function useStreak() {
  return useQuery<Streak>('/api/streaks');
}

export function useUpdateStreak() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStreak = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/streaks', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to update streak');
      return await res.json();
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateStreak, isUpdating };
}

// ============================================
// ANALYTICS HOOKS
// ============================================

export interface Analytics {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate?: string;
  totalStudyMinutes: number;
  topicsCompleted: number;
  totalQuestions: number;
  correctAnswers: number;
  avgAccuracy: number;
  weeklyStudyMinutes: number[];
  weeklyMcqs: number[];
  recentSessions: Array<{
    id: string;
    started_at?: string;
    duration_minutes?: number;
    mcqs_attempted?: number;
    mcqs_correct?: number;
    source?: string;
  }>;
  dailyStats: Array<{
    date: string;
    study_minutes: number;
    mcqs_attempted: number;
    mcqs_correct: number;
    atoms_completed: number;
  }>;
}

export function useAnalytics(days = 7) {
  return useQuery<Analytics>(`/api/analytics?days=${days}`);
}

export function useTrackEvent() {
  const trackEvent = async (event: string, data: Record<string, unknown>) => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, data }),
      });
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  };

  return { trackEvent };
}

// ============================================
// STUDY SESSION HOOKS
// ============================================

export interface StudySession {
  id: string;
  started_at: string;
  ended_at?: string;
  duration_minutes?: number;
  atoms_studied: string[];
  mcqs_attempted: number;
  mcqs_correct: number;
  source: string;
}

export function useStudySessions(limit = 10) {
  return useQuery<{ sessions: StudySession[]; total: number }>(
    `/api/study-sessions?limit=${limit}`
  );
}

export function useStudySession() {
  const [session, setSession] = useState<StudySession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startSession = async (atoms?: string[]) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/study-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ atoms_studied: atoms }),
      });
      if (!res.ok) throw new Error('Failed to start session');
      const data = await res.json();
      setSession(data);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async (data: Partial<StudySession>) => {
    if (!session?.id) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/study-sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.id,
          ended_at: new Date().toISOString(),
          ...data,
        }),
      });
      if (!res.ok) throw new Error('Failed to end session');
      const updated = await res.json();
      setSession(updated);
      return updated;
    } finally {
      setIsLoading(false);
    }
  };

  return { session, startSession, endSession, isLoading };
}

// ============================================
// STUDY PLAN HOOKS
// ============================================

export interface StudyPlan {
  goals: {
    study_minutes: number;
    mcqs: number;
  };
  today: {
    study_minutes: number;
    mcqs_attempted: number;
    mcqs_correct: number;
    topics_completed?: number;
    goal_progress: number;
    mcq_progress: number;
  };
  active_pathway?: {
    id: string;
    title: string;
    current_atom_index: number;
    total_atoms: number;
    progress_percent: number;
  };
  continue_learning: Array<Record<string, unknown>>;
  recommended: Array<Record<string, unknown>>;
  tasks: Array<Record<string, unknown>>;
}

export function useStudyPlan() {
  return useQuery<StudyPlan>('/api/study-plan', {
    refetchInterval: 60000, // Refresh every minute
  });
}

// ============================================
// EXAM CENTRE OVERVIEW HOOKS
// ============================================

export interface ExamCentreOverview {
  summary: {
    questionsAttempted: number;
    accuracyPercent: number;
    casesCompleted: number;
    pathwaysDone: number;
    studyStreakDays: number;
  };
  guidedPathways: Array<{
    id: string;
    title: string;
    modules: number;
    completed: number;
    description: string;
    nextTopic: string;
    estimatedTime: string;
    subjectId?: string;
  }>;
  subjectProgress: Array<{
    id: string;
    totalTopics: number;
    activeTopics: number;
    completedTopics: number;
  }>;
  recentActivity: Array<{
    type: 'pyq' | 'simulation' | 'mcq' | 'practical';
    title: string;
    score: string;
    time: string;
    occurredAt: string;
  }>;
}

export function useExamCentreOverview() {
  return useQuery<ExamCentreOverview>('/api/exam-centre/overview', {
    refetchInterval: 60000,
  });
}

export interface ExamCentreCatalog {
  summary: {
    totalMcqs: number;
    totalPyqs: number;
    totalAttempts: number;
    totalCorrect: number;
  };
  examTypes: Array<{
    id: string;
    title: string;
    description: string;
    href: string;
    isAvailable: boolean;
    stats: {
      total: number;
      attempted: number;
      mastered: number;
    };
  }>;
  subjects: Array<{
    id: string;
    name: string;
    totalQuestions: number;
    pyqQuestions: number;
    activeTopics: number;
    completedTopics: number;
  }>;
  generatedAt: string;
}

export interface ExamCentrePyqCatalog {
  summary: {
    totalPapers: number;
    totalQuestions: number;
    totalSubjects: number;
  };
  papers: Array<{
    id: string;
    name: string;
    source: string;
    year: number | null;
    totalQuestions: number;
    totalSubjects: number;
    highYieldTopics: string[];
    durationMinutes: number;
    isAvailable: boolean;
    href: string;
  }>;
  fallbackUsed: boolean;
}

export interface ExamCentreSimulatorCatalog {
  summary: {
    totalCases: number;
    attemptedCases: number;
    masteredCases: number;
  };
  cases: Array<{
    id: string;
    title: string;
    description: string;
    difficulty: string;
    duration: string;
    subject: string;
    skills: string[];
    rating: number;
    isNew: boolean;
    isAvailable: boolean;
    completionRate: number;
  }>;
  generatedAt: string;
}

export interface ExamCentrePracticalCatalog {
  summary: {
    totalStations: number;
    attemptedCheckpoints: number;
    passedCheckpoints: number;
    passRate: number;
  };
  stations: Array<{
    id: string;
    title: string;
    system: string;
    topic: string;
    durationMinutes: number;
    totalMarks: number;
    difficulty: string;
    isAvailable: boolean;
  }>;
  generatedAt: string;
}

export interface ExamCentreReadModelAnalytics {
  windowDays: number;
  summary: {
    totalSessions: number;
    completedSessions: number;
    inProgressSessions: number;
    avgSessionAccuracyPercent: number | null;
    avgSessionDurationMinutes: number | null;
    avgAttemptsPerSession: number;
    highQualitySessionRate: number;
    calibrationGapPercent: number | null;
    weakTopicCount: number;
    recurringWeakTopicCount: number;
  };
  sessionQuality: {
    totalSessions: number;
    highQualitySessions: number;
    highQualitySessionRate: number;
    byMode: Array<{
      mode: string;
      sessionCount: number;
      completedSessionCount: number;
      avgAttemptsPerSession: number;
      avgAccuracyPercent: number | null;
      avgDurationMinutes: number | null;
      highQualitySessions: number;
      highQualityRate: number;
      avgQualityScore: number | null;
    }>;
    recentSessions: Array<{
      sessionId: string;
      mode: string;
      startedAt: string;
      endedAt: string | null;
      completed: boolean;
      attempted: number;
      correct: number;
      accuracyPercent: number | null;
      durationMinutes: number | null;
      qualityScore: number;
      qualityBand: string;
    }>;
  };
  confidenceCalibration: {
    overall: {
      attempts: number;
      avgConfidence: number | null;
      accuracyPercent: number | null;
      expectedAccuracyPercent: number | null;
      calibrationGapPercent: number | null;
      absoluteErrorPercent: number | null;
    };
    bands: Array<{
      confidence: number;
      attempts: number;
      expectedAccuracyPercent: number;
      accuracyPercent: number | null;
      gapPercent: number | null;
      state: string;
    }>;
  };
  weakTopicRecurrence: {
    totalTopicsTracked: number;
    weakTopicCount: number;
    recurringWeakTopicCount: number;
    topics: Array<{
      topicKey: string;
      topicLabel: string;
      subject: string;
      attempts: number;
      incorrectCount: number;
      accuracyPercent: number;
      recurrenceCount: number;
      recurrenceRatePercent: number;
      avgConfidence: number | null;
      primaryMode: string;
      lastSeenAt: string;
      status: string;
    }>;
  };
  generatedAt: string;
}

export interface ExamCentreSimulatorResult {
  session: {
    id: string;
    mode: 'simulator';
    startedAt: string;
    endedAt: string | null;
    durationMinutes: number | null;
    submitted: boolean;
  };
  snapshot: {
    attemptedActions: number;
    successfulActions: number;
    accuracyPercent: number | null;
    phaseCompletionPercent: number;
    avgConfidence: number | null;
    avgActionSeconds: number | null;
    scorePercent: number;
    grade: string;
  };
  phaseBreakdown: Array<{
    phase: string;
    attempted: number;
    correct: number;
    accuracyPercent: number | null;
  }>;
  timeline: Array<{
    eventId: string;
    createdAt: string;
    questionRef: string;
    phase: string;
    isCorrect: boolean;
    confidence: number | null;
    timeTakenSeconds: number | null;
  }>;
  generatedAt: string;
}

export interface ExamCentreFlowResult {
  session: {
    id: string;
    mode: 'flow';
    startedAt: string;
    endedAt: string | null;
    durationMinutes: number | null;
    submitted: boolean;
  };
  snapshot: {
    decisionsMade: number;
    alignedDecisions: number;
    driftDecisions: number;
    alignmentPercent: number | null;
    uniqueTransitions: number;
    uniqueNodesVisited: number;
    expectedBranches: number | null;
    branchCoveragePercent: number | null;
    avgDecisionSeconds: number | null;
    scorePercent: number;
    grade: string;
  };
  timeline: Array<{
    eventId: string;
    createdAt: string;
    questionRef: string;
    transition: string;
    fromNodeId: string;
    toNodeId: string;
    selectedLabel: string | null;
    isCorrect: boolean;
    timeTakenSeconds: number | null;
  }>;
  generatedAt: string;
}

export interface ExamCentreOsceResult {
  session: {
    id: string;
    mode: 'practical';
    startedAt: string;
    endedAt: string | null;
    durationMinutes: number | null;
    submitted: boolean;
  };
  snapshot: {
    checkedItems: number;
    criticalItemsChecked: number;
    checklistTotal: number | null;
    completionPercent: number | null;
    marksAwarded: number;
    totalMarks: number | null;
    passingMarks: number | null;
    distinctionMarks: number | null;
    scorePercent: number | null;
    grade: string;
    accuracyPercent: number | null;
    avgActionSeconds: number | null;
  };
  checklist: {
    items: Array<{
      itemId: string;
      marks: number;
      isCritical: boolean;
      checkedAt: string;
    }>;
  };
  timeline: Array<{
    eventId: string;
    createdAt: string;
    itemId: string;
    isCritical: boolean;
    marks: number;
    isCorrect: boolean;
    timeTakenSeconds: number | null;
  }>;
  generatedAt: string;
}

export function useExamCentreCatalog() {
  return useQuery<ExamCentreCatalog>('/api/exam-centre/catalog', {
    refetchInterval: 60000,
  });
}

export function useExamCentrePyqCatalog(limit = 12) {
  return useQuery<ExamCentrePyqCatalog>(`/api/exam-centre/pyq?limit=${limit}`, {
    refetchInterval: 60000,
  });
}

export function useExamCentreSimulatorCatalog() {
  return useQuery<ExamCentreSimulatorCatalog>('/api/exam-centre/simulator', {
    refetchInterval: 60000,
  });
}

export function useExamCentrePracticalCatalog() {
  return useQuery<ExamCentrePracticalCatalog>('/api/exam-centre/practical', {
    refetchInterval: 60000,
  });
}

export function useExamCentreReadModelAnalytics(days = 30) {
  return useQuery<ExamCentreReadModelAnalytics>(
    `/api/exam-centre/read-model/analytics?days=${days}`,
    {
      refetchInterval: 60000,
    }
  );
}

export function useExamCentreSimulatorResult(sessionId?: string) {
  const query = sessionId
    ? `/api/exam-centre/read-model/simulator?session_id=${encodeURIComponent(sessionId)}`
    : '/api/exam-centre/read-model/simulator';

  return useQuery<ExamCentreSimulatorResult>(query, {
    enabled: Boolean(sessionId),
    refetchInterval: 30000,
  });
}

export function useExamCentreFlowResult(sessionId?: string, expectedBranches?: number) {
  const params = new URLSearchParams();
  if (sessionId) params.set('session_id', sessionId);
  if (typeof expectedBranches === 'number' && expectedBranches > 0) {
    params.set('expected_branches', String(Math.round(expectedBranches)));
  }
  const query = `/api/exam-centre/read-model/flow${params.toString() ? `?${params.toString()}` : ''}`;

  return useQuery<ExamCentreFlowResult>(query, {
    enabled: Boolean(sessionId),
    refetchInterval: 30000,
  });
}

export function useExamCentreOsceResult(
  sessionId?: string,
  options?: {
    totalMarks?: number;
    passingMarks?: number;
    distinctionMarks?: number;
    checklistTotal?: number;
  }
) {
  const params = new URLSearchParams();
  if (sessionId) params.set('session_id', sessionId);
  if (typeof options?.totalMarks === 'number' && options.totalMarks > 0) {
    params.set('total_marks', String(Math.round(options.totalMarks)));
  }
  if (typeof options?.passingMarks === 'number' && options.passingMarks > 0) {
    params.set('passing_marks', String(Math.round(options.passingMarks)));
  }
  if (typeof options?.distinctionMarks === 'number' && options.distinctionMarks > 0) {
    params.set('distinction_marks', String(Math.round(options.distinctionMarks)));
  }
  if (typeof options?.checklistTotal === 'number' && options.checklistTotal > 0) {
    params.set('checklist_total', String(Math.round(options.checklistTotal)));
  }

  const query = `/api/exam-centre/read-model/osce${params.toString() ? `?${params.toString()}` : ''}`;
  return useQuery<ExamCentreOsceResult>(query, {
    enabled: Boolean(sessionId),
    refetchInterval: 30000,
  });
}

// ============================================
// LEARNING LIFECYCLE OVERVIEW HOOKS
// ============================================

export interface LearningOverview {
  windowDays: number;
  summary: {
    totalTopics: number;
    activeTopics: number;
    completedTopics: number;
    connectedTopics: number;
    stageCompletionPercent: number;
    retrievalIntegrity: number;
    deficitCount: number;
    checkpointsEvaluated: number;
  };
  daily: Array<{
    date: string;
    day: string;
    topicUpdates: number;
    checkpoints: number;
    passed: number;
    failed: number;
  }>;
  deficits: Array<{
    topicId: string;
    topicTitle: string;
    subject: string;
    subspecialty: string;
    topicSlug: string;
    accuracy: number;
    attempts: number;
    failed: number;
    href: string;
  }>;
}

export function useLearningOverview(days = 7) {
  return useQuery<LearningOverview>(`/api/learning/overview?days=${days}`, {
    refetchInterval: 60000,
  });
}

// ============================================
// LEARNING METHOD EFFICACY READ-MODEL HOOKS
// ============================================

export function useLearningMethodEfficacy(days = 30) {
  return useQuery<LearningMethodEfficacyReadModel>(
    `/api/learning/read-model/efficacy?days=${days}`,
    {
      refetchInterval: 60000,
    }
  );
}

// ============================================
// PROGRESS HOOKS
// ============================================

export interface Progress {
  progress: Array<Record<string, unknown>>;
  summary: {
    total: number;
    completed: number;
    in_progress: number;
    not_started: number;
    total_time_seconds: number;
  };
}

export function useProgress(filters?: { specialty?: string; topic?: string; status?: string }) {
  const params = new URLSearchParams();
  if (filters?.specialty) params.set('specialty', filters.specialty);
  if (filters?.topic) params.set('topic', filters.topic);
  if (filters?.status) params.set('status', filters.status);
  
  const queryString = params.toString();
  return useQuery<Progress>(`/api/progress${queryString ? `?${queryString}` : ''}`);
}

export function useUpdateProgress() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProgress = async (atomId: string, data: {
    status?: string;
    progress_percent?: number;
    time_spent_seconds?: number;
    rating?: number;
    is_saved?: boolean;
    notes?: string;
  }) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ atom_id: atomId, ...data }),
      });
      if (!res.ok) throw new Error('Failed to update progress');
      return await res.json();
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateProgress, isUpdating };
}

// ============================================
// AUTH HOOKS (using Supabase directly)
// ============================================

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, metadata?: { full_name?: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };
}
