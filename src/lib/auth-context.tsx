"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MockUser, getStoredUser, mockLogin, mockLogout, quickDemoLogin } from './mock-auth';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextValue {
  user: MockUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  quickLogin: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Routes that don't require auth
const publicRoutes = ['/', '/login', '/signup', '/about', '/pricing'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  
  // Check for existing session on mount
  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setIsLoading(false);
  }, []);
  
  // Redirect logic
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
  
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const loggedInUser = mockLogin(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      return true;
    }
    return false;
  }, []);
  
  const logout = useCallback(() => {
    mockLogout();
    setUser(null);
    router.push('/login');
  }, [router]);
  
  const quickLogin = useCallback(() => {
    const demoUser = quickDemoLogin();
    setUser(demoUser);
    router.push('/dashboard');
  }, [router]);
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        quickLogin,
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
