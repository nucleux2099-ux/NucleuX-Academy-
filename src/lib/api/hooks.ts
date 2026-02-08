"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

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
  plan: string;
  onboarding_completed: boolean;
  preferences: {
    daily_goal_minutes: number;
    mcq_daily_target: number;
    preferred_study_time: string;
    notification_email: boolean;
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
  totalStudyMinutes: number;
  topicsCompleted: number;
  totalQuestions: number;
  correctAnswers: number;
  avgAccuracy: number;
  weeklyStudyMinutes: number[];
  weeklyMcqs: number[];
  recentSessions: any[];
  dailyStats: any[];
}

export function useAnalytics(days = 7) {
  return useQuery<Analytics>(`/api/analytics?days=${days}`);
}

export function useTrackEvent() {
  const trackEvent = async (event: string, data: Record<string, any>) => {
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
  continue_learning: any[];
  recommended: any[];
  tasks: any[];
}

export function useStudyPlan() {
  return useQuery<StudyPlan>('/api/study-plan', {
    refetchInterval: 60000, // Refresh every minute
  });
}

// ============================================
// PROGRESS HOOKS
// ============================================

export interface Progress {
  progress: any[];
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
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

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
  }, []);

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
