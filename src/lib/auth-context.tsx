"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<{ success: boolean; error?: string; needsConfirmation?: boolean }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Routes that don't require auth (must match middleware.ts)
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/auth/callback',

  // Marketing/public pages
  '/campus',
  '/pricing',
  '/about',
  '/faq',
  '/contact',
  '/atom',
  '/rooms',

  // Misc public
  '/landing',
  '/demo',
  '/terms',
  '/privacy',
  '/offline',
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  
  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          // Check if user has completed onboarding
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('onboarding_completed')
              .eq('id', session.user.id)
              .single();
            
            if (profile && !profile.onboarding_completed) {
              router.push('/onboarding');
              return;
            }
          }
          router.push('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          router.push('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, router]);
  
  // Redirect logic for protected routes
  useEffect(() => {
    if (isLoading) return;
    
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname?.startsWith(route + '/')
    );
    
    if (!user && !isPublicRoute) {
      // Not logged in, trying to access protected route
      router.push(`/login?redirect=${encodeURIComponent(pathname || '/dashboard')}`);
    } else if (user && (pathname === '/login' || pathname === '/signup')) {
      // Logged in, on auth page - redirect to dashboard
      router.push('/dashboard');
    }
  }, [user, isLoading, pathname, router]);
  
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, [supabase]);

  const loginWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }, [supabase]);

  const signUp = useCallback(async (
    email: string, 
    password: string, 
    metadata?: { full_name?: string }
  ): Promise<{ success: boolean; error?: string; needsConfirmation?: boolean }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        return { success: true, needsConfirmation: true };
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, [supabase]);
  
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);
  
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        logout,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
