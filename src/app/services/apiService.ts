/**
 * API Service with Automatic Fallback
 * Attempts Supabase Edge Functions first, falls back to localStorage mock on failure
 */

import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { mockAPI } from './mockBackend';

const USE_MOCK = false; // Set to true to bypass 403 error and use localStorage

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/server`;

async function fetchWithFallback(endpoint: string, options: RequestInit = {}) {
  if (USE_MOCK) {
    // Use mock backend directly
    console.log(`[MOCK MODE] Using localStorage for: ${endpoint}`);
    return null; // Signal to use mock
  }
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn(`[API] Edge Function failed, using mock: ${error}`);
    return null; // Signal to use mock
  }
}

export const api = {
  // AUTH
  auth: {
    signup: async (data: any) => {
      const result = await fetchWithFallback('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return result || await mockAPI.auth.signup(data);
    },
    
    signin: async (data: any) => {
      const result = await fetchWithFallback('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return result || await mockAPI.auth.signin(data);
    },
    
    signout: async () => {
      const result = await fetchWithFallback('/auth/signout', {
        method: 'POST'
      });
      return result || await mockAPI.auth.signout();
    },
    
    getSession: async () => {
      const result = await fetchWithFallback('/auth/session');
      return result || await mockAPI.auth.session();
    }
  },
  
  // PROGRESS
  progress: {
    get: async (userId: string, moduleId: string, lessonId: string) => {
      const result = await fetchWithFallback(`/progress/${userId}/${moduleId}/${lessonId}`);
      return result || await mockAPI.progress.get(userId, moduleId, lessonId);
    },
    
    save: async (data: any) => {
      const result = await fetchWithFallback('/progress', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return result || await mockAPI.progress.save(data);
    },
    
    getAll: async (userId: string) => {
      const result = await fetchWithFallback(`/progress/${userId}`);
      return result || await mockAPI.progress.getAll(userId);
    }
  },
  
  // QUIZ
  quiz: {
    submit: async (data: any) => {
      const result = await fetchWithFallback('/quiz/submit', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return result || await mockAPI.quiz.submit(data);
    },
    
    getByLesson: async (userId: string, moduleId: string, lessonId: string) => {
      const result = await fetchWithFallback(`/quiz/${userId}/${moduleId}/${lessonId}`);
      return result || await mockAPI.quiz.getByLesson(userId, moduleId, lessonId);
    },
    
    getAll: async (userId: string) => {
      const result = await fetchWithFallback(`/quiz/${userId}`);
      return result || await mockAPI.quiz.getAll(userId);
    }
  },
  
  // AI FEEDBACK
  aiFeedback: {
    analyze: async (data: any) => {
      const result = await fetchWithFallback('/ai-feedback/analyze', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return result || await mockAPI.aiFeedback.analyze(data);
    },
    
    getAll: async (userId: string) => {
      const result = await fetchWithFallback(`/ai-feedback/${userId}`);
      return result || await mockAPI.aiFeedback.getAll(userId);
    },
    
    getByLesson: async (userId: string, moduleId: string, lessonId: string) => {
      const result = await fetchWithFallback(`/ai-feedback/${userId}/${moduleId}/${lessonId}`);
      return result || await mockAPI.aiFeedback.getByLesson(userId, moduleId, lessonId);
    }
  },
  
  // PROFILE
  profile: {
    save: async (data: any) => {
      const result = await fetchWithFallback('/profile', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return result || await mockAPI.profile.save(data);
    },
    
    get: async (userId: string) => {
      const result = await fetchWithFallback(`/profile/${userId}`);
      return result || await mockAPI.profile.get(userId);
    }
  },
  
  // LESSON COMPLETION
  lesson: {
    complete: async (data: any) => {
      const result = await fetchWithFallback('/lesson/complete', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return result || await mockAPI.lesson.complete(data);
    },
    
    getCompletions: async (userId: string) => {
      const result = await fetchWithFallback(`/lesson/completions/${userId}`);
      return result || await mockAPI.lesson.getCompletions(userId);
    }
  },
  
  // ANALYTICS
  analytics: {
    getStudents: async () => {
      const result = await fetchWithFallback('/analytics/students');
      return result || await mockAPI.analytics.getStudents();
    },
    
    getStudent: async (userId: string) => {
      const result = await fetchWithFallback(`/analytics/student/${userId}`);
      return result || await mockAPI.analytics.getStudent(userId);
    }
  },
  
  // LEADERBOARD
  leaderboard: {
    getGlobal: async () => {
      const result = await fetchWithFallback('/leaderboard');
      return result || await mockAPI.leaderboard.getGlobal();
    }
  }
};
