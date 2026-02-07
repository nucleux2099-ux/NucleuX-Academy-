// Mock Auth System for Development
// Replace with Supabase when ready

export interface MockUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'faculty' | 'admin';
  plan: 'free' | 'pro' | 'premium';
}

// Demo users
export const DEMO_USERS: Record<string, MockUser> = {
  'aditya@nucleux.com': {
    id: 'user_aditya',
    email: 'aditya@nucleux.com',
    name: 'Aditya',
    role: 'admin',
    plan: 'premium',
  },
  'sarath@nucleux.com': {
    id: 'user_sarath',
    email: 'sarath@nucleux.com',
    name: 'Dr. Sarath',
    role: 'faculty',
    plan: 'pro',
  },
  'demo@nucleux.com': {
    id: 'user_demo',
    email: 'demo@nucleux.com',
    name: 'Demo Student',
    role: 'student',
    plan: 'free',
  },
};

// Cookie name for session
export const AUTH_COOKIE = 'nucleux_session';

// Check if user is logged in (client-side)
export function getStoredUser(): MockUser | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(AUTH_COOKIE);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

// Login (client-side)
export function mockLogin(email: string, password: string): MockUser | null {
  // Accept any password for demo users
  const user = DEMO_USERS[email.toLowerCase()];
  
  // Also allow any email with password "demo123"
  if (!user && password === 'demo123') {
    const newUser: MockUser = {
      id: `user_${Date.now()}`,
      email: email.toLowerCase(),
      name: email.split('@')[0],
      role: 'student',
      plan: 'free',
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_COOKIE, JSON.stringify(newUser));
    }
    return newUser;
  }
  
  if (user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_COOKIE, JSON.stringify(user));
    }
    return user;
  }
  
  return null;
}

// Logout (client-side)
export function mockLogout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_COOKIE);
  }
}

// Quick login for demo (skip login page)
export function quickDemoLogin(): MockUser {
  const demoUser = DEMO_USERS['demo@nucleux.com'];
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_COOKIE, JSON.stringify(demoUser));
  }
  return demoUser;
}
