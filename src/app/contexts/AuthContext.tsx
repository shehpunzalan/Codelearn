import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-aaa3a86f`;

interface User {
  userId: string;
  email: string;
  name: string;
  role: 'student' | 'instructor';
  studentId?: string;
  section?: string;
  yearLevel?: string;
  avatar?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: 'student' | 'instructor', additionalData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('currentUser');

    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('accessToken');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Sign in failed');
      }

      const userData: User = {
        userId: result.data.userId,
        email: result.data.email,
        name: result.data.profile?.name || 'User',
        role: result.data.profile?.role || 'student',
        studentId: result.data.profile?.studentId,
        section: result.data.profile?.section,
        yearLevel: result.data.profile?.yearLevel,
        avatar: result.data.profile?.avatar,
        bio: result.data.profile?.bio
      };

      setUser(userData);
      setAccessToken(result.data.accessToken);
      
      // Store in localStorage
      localStorage.setItem('accessToken', result.data.accessToken);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('lastLoginTime', new Date().toISOString());

      console.log('Sign in successful:', userData);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: 'student' | 'instructor',
    additionalData?: any
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role,
          ...additionalData
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Sign up failed');
      }

      // After signup, sign in automatically
      await signIn(email, password);

      console.log('Sign up successful');
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (accessToken) {
        await fetch(`${API_BASE_URL}/auth/signout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('lastLoginTime');
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken || publicAnonKey}`
        },
        body: JSON.stringify({
          userId: user.userId,
          ...data
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Profile update failed');
      }

      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const refreshSession = async () => {
    try {
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/session`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const result = await response.json();

      if (!result.success) {
        // Session expired, sign out
        await signOut();
        throw new Error('Session expired');
      }

      // Update user data
      if (result.data.profile) {
        const userData: User = {
          userId: result.data.userId,
          email: result.data.email,
          name: result.data.profile.name,
          role: result.data.profile.role,
          studentId: result.data.profile.studentId,
          section: result.data.profile.section,
          yearLevel: result.data.profile.yearLevel,
          avatar: result.data.profile.avatar,
          bio: result.data.profile.bio
        };
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      throw error;
    }
  };

  const value = {
    user,
    accessToken,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
