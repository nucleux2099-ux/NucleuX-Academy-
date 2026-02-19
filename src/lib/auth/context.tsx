"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  specialty: string | null;
  level: string | null;
  institution: string | null;
  target_exam: string | null;
  target_date: string | null;
  timezone: string;
  plan: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface Streak {
  current_streak: number;
  longest_streak: number;
  last_study_date: string | null;
  streak_started_at: string | null;
}

interface UserContextValue {
  user: User | null;
  profile: Profile | null;
  streak: Streak | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  const fetchUserData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch profile and streak in parallel
        const [profileResult, streakResult] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('streaks').select('*').eq('user_id', user.id).single(),
        ]);

        if (profileResult.data) {
          setProfile(profileResult.data);
        }
        if (streakResult.data) {
          setStreak(streakResult.data);
        }
      } else {
        setProfile(null);
        setStreak(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    await fetchUserData();
  }, [fetchUserData]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    if (data) {
      setProfile(data);
    }
  }, [supabase, user]);

  useEffect(() => {
    fetchUserData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN') {
          await fetchUserData();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setStreak(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserData, supabase]);

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        streak,
        isLoading,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Safe hook that returns null if not in provider (for SSR)
export function useUserSafe() {
  return useContext(UserContext);
}
