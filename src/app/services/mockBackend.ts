/**
 * TEMPORARY MOCK BACKEND - Using localStorage instead of Supabase Edge Functions
 * This provides full functionality while we resolve the 403 deployment error
 * All data is stored locally in browser localStorage
 */

// Storage utilities
const storage = {
  get: (key: string) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getByPrefix: (prefix: string) => {
    const results: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const item = localStorage.getItem(key);
        if (item) results.push(JSON.parse(item));
      }
    }
    return results;
  },
  delete: (key: string) => {
    localStorage.removeItem(key);
  }
};

// Mock API that matches the real backend interface
export const mockAPI = {
  // AUTH
  auth: {
    signup: async (data: any) => {
      const userId = `user_${Date.now()}`;
      const profile = {
        userId,
        name: data.name,
        email: data.email,
        role: data.role || 'student',
        studentId: data.studentId || '',
        section: data.section || '',
        yearLevel: data.yearLevel || '',
        avatar: '',
        bio: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      storage.set(`profile_${userId}`, profile);
      storage.set(`auth_${data.email}`, { userId, email: data.email, password: data.password });
      
      return {
        success: true,
        data: { userId, email: data.email, name: data.name, role: profile.role }
      };
    },
    
    signin: async (data: any) => {
      const auth = storage.get(`auth_${data.email}`);
      if (!auth || auth.password !== data.password) {
        return { success: false, error: 'Invalid credentials' };
      }
      
      const profile = storage.get(`profile_${auth.userId}`);
      const accessToken = `mock_token_${Date.now()}`;
      
      storage.set('current_session', { userId: auth.userId, accessToken });
      
      return {
        success: true,
        data: {
          userId: auth.userId,
          email: data.email,
          accessToken,
          refreshToken: `refresh_${Date.now()}`,
          profile
        }
      };
    },
    
    signout: async () => {
      storage.delete('current_session');
      return { success: true, message: 'Signed out' };
    },
    
    session: async () => {
      const session = storage.get('current_session');
      if (!session) {
        return { success: false, error: 'No active session' };
      }
      
      const profile = storage.get(`profile_${session.userId}`);
      return {
        success: true,
        data: { userId: session.userId, email: profile?.email, profile }
      };
    }
  },
  
  // PROGRESS
  progress: {
    get: async (userId: string, moduleId: string, lessonId: string) => {
      const progress = storage.get(`progress_${userId}_${moduleId}_${lessonId}`);
      return { success: true, data: progress };
    },
    
    save: async (data: any) => {
      const progressData = {
        userId: data.userId,
        moduleId: data.moduleId,
        lessonId: data.lessonId,
        completed: data.completed || false,
        timeSpent: data.timeSpent || 0,
        score: data.score || 0,
        timestamp: new Date().toISOString()
      };
      storage.set(`progress_${data.userId}_${data.moduleId}_${data.lessonId}`, progressData);
      return { success: true, data: progressData };
    },
    
    getAll: async (userId: string) => {
      const allProgress = storage.getByPrefix(`progress_${userId}_`);
      return { success: true, data: allProgress };
    }
  },
  
  // QUIZ
  quiz: {
    submit: async (data: any) => {
      const quizId = `quiz_${Date.now()}_${data.userId}`;
      const quizData = {
        id: quizId,
        userId: data.userId,
        moduleId: data.moduleId,
        lessonId: data.lessonId,
        score: data.score,
        answers: data.answers,
        totalQuestions: data.totalQuestions,
        passed: data.score >= 70,
        timestamp: new Date().toISOString()
      };
      
      storage.set(`quiz_${quizId}`, quizData);
      
      // Update progress
      const existingProgress = storage.get(`progress_${data.userId}_${data.moduleId}_${data.lessonId}`) || {};
      storage.set(`progress_${data.userId}_${data.moduleId}_${data.lessonId}`, {
        ...existingProgress,
        userId: data.userId,
        moduleId: data.moduleId,
        lessonId: data.lessonId,
        quizCompleted: true,
        quizScore: data.score,
        quizPassed: data.score >= 70,
        lastUpdated: new Date().toISOString()
      });
      
      return { success: true, data: quizData };
    },
    
    getByLesson: async (userId: string, moduleId: string, lessonId: string) => {
      // Get all quiz submissions from storage
      const allQuizzes = storage.getByPrefix(`quiz_`);
      
      // Filter quizzes by user, module, and lesson, then sort by timestamp (newest first)
      const filtered = allQuizzes
        .filter(quiz => quiz.userId === userId && quiz.moduleId === moduleId && quiz.lessonId === lessonId)
        .sort((quizA, quizB) => new Date(quizB.timestamp).getTime() - new Date(quizA.timestamp).getTime());
      
      return { success: true, data: filtered };
    },
    
    getAll: async (userId: string) => {
      // Get all quiz submissions from storage
      const allQuizzes = storage.getByPrefix(`quiz_`);
      
      // Filter quizzes by user, then sort by timestamp (newest first)
      const filtered = allQuizzes
        .filter(quiz => quiz.userId === userId)
        .sort((quizA, quizB) => new Date(quizB.timestamp).getTime() - new Date(quizA.timestamp).getTime());
      
      return { success: true, data: filtered };
    }
  },
  
  // AI FEEDBACK
  aiFeedback: {
    analyze: async (data: any) => {
      const analysis = analyzeJavaCode(data.code, data.lessonId);
      const feedbackId = `aifeedback_${Date.now()}_${data.userId}`;
      const feedbackData = {
        id: feedbackId,
        userId: data.userId,
        moduleId: data.moduleId,
        lessonId: data.lessonId,
        code: data.code,
        analysis,
        feedbackMessage: generateFeedbackMessage(analysis),
        score: analysis.score,
        timestamp: new Date().toISOString()
      };
      
      storage.set(`aifeedback_${feedbackId}`, feedbackData);
      
      return {
        success: true,
        data: {
          feedbackId,
          analysis,
          feedbackMessage: feedbackData.feedbackMessage,
          score: analysis.score
        }
      };
    },
    
    getAll: async (userId: string) => {
      const allFeedback = storage.getByPrefix(`aifeedback_`);
      const filtered = allFeedback
        .filter(fb => fb.userId === userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return { success: true, data: filtered };
    },
    
    getByLesson: async (userId: string, moduleId: string, lessonId: string) => {
      const allFeedback = storage.getByPrefix(`aifeedback_`);
      const filtered = allFeedback
        .filter(fb => fb.userId === userId && fb.moduleId === moduleId && fb.lessonId === lessonId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return { success: true, data: filtered };
    }
  },
  
  // PROFILE
  profile: {
    save: async (data: any) => {
      const profileData = {
        userId: data.userId,
        name: data.name,
        email: data.email,
        studentId: data.studentId,
        section: data.section,
        yearLevel: data.yearLevel,
        avatar: data.avatar,
        bio: data.bio,
        updatedAt: new Date().toISOString()
      };
      storage.set(`profile_${data.userId}`, profileData);
      return { success: true, data: profileData };
    },
    
    get: async (userId: string) => {
      const profile = storage.get(`profile_${userId}`);
      if (!profile) {
        return {
          success: true,
          data: {
            userId,
            name: 'Student User',
            email: '',
            studentId: '',
            section: '',
            yearLevel: '',
            avatar: '',
            bio: ''
          }
        };
      }
      return { success: true, data: profile };
    }
  },
  
  // LESSON COMPLETION
  lesson: {
    complete: async (data: any) => {
      const completionData = {
        userId: data.userId,
        moduleId: data.moduleId,
        lessonId: data.lessonId,
        completed: true,
        timeSpent: data.timeSpent || 0,
        completedAt: new Date().toISOString()
      };
      storage.set(`completion_${data.userId}_${data.moduleId}_${data.lessonId}`, completionData);
      return { success: true, data: completionData };
    },
    
    getCompletions: async (userId: string) => {
      const allCompletions = storage.getByPrefix(`completion_${userId}_`);
      return { success: true, data: allCompletions };
    }
  },
  
  // ANALYTICS
  analytics: {
    getStudents: async () => {
      const allProfiles = storage.getByPrefix(`profile_`);
      const studentsData = allProfiles.map(profile => {
        const userId = profile.userId;
        const progressData = storage.getByPrefix(`progress_${userId}_`);
        const allQuizzes = storage.getByPrefix(`quiz_`);
        const userQuizzes = allQuizzes.filter(q => q.userId === userId);
        const completions = storage.getByPrefix(`completion_${userId}_`);
        
        return {
          ...profile,
          progressCount: progressData.length,
          quizzesTaken: userQuizzes.length,
          lessonsCompleted: completions.length,
          averageQuizScore: userQuizzes.length > 0
            ? Math.round(userQuizzes.reduce((sum, q) => sum + q.score, 0) / userQuizzes.length)
            : 0
        };
      });
      
      return { success: true, data: studentsData };
    },
    
    getStudent: async (userId: string) => {
      const profile = storage.get(`profile_${userId}`);
      const progressData = storage.getByPrefix(`progress_${userId}_`);
      const allQuizzes = storage.getByPrefix(`quiz_`);
      const userQuizzes = allQuizzes.filter(q => q.userId === userId);
      const completions = storage.getByPrefix(`completion_${userId}_`);
      const allFeedback = storage.getByPrefix(`feedback_`);
      const userFeedback = allFeedback.filter(f => f.userId === userId);
      const allSubmissions = storage.getByPrefix(`mp_submission_`);
      const userSubmissions = allSubmissions.filter(s => s.userId === userId);
      
      const analytics = {
        profile,
        stats: {
          lessonsCompleted: completions.length,
          quizzesTaken: userQuizzes.length,
          averageQuizScore: userQuizzes.length > 0
            ? Math.round(userQuizzes.reduce((sum, q) => sum + q.score, 0) / userQuizzes.length)
            : 0,
          feedbackReceived: userFeedback.length,
          submissionsCount: userSubmissions.length,
          totalTimeSpent: completions.reduce((sum, c) => sum + (c.timeSpent || 0), 0)
        },
        recentActivity: {
          quizzes: userQuizzes.slice(0, 10),
          completions: completions.slice(0, 10),
          feedback: userFeedback.slice(0, 10),
          submissions: userSubmissions.slice(0, 10)
        }
      };
      
      return { success: true, data: analytics };
    }
  },
  
  // LEADERBOARD
  leaderboard: {
    getGlobal: async () => {
      const allProfiles = storage.getByPrefix(`profile_`);
      const leaderboardData = allProfiles.map(profile => {
        const userId = profile.userId;
        const allQuizzes = storage.getByPrefix(`quiz_`);
        const userQuizzes = allQuizzes.filter(q => q.userId === userId);
        const completions = storage.getByPrefix(`completion_${userId}_`);
        
        const totalPoints = userQuizzes.reduce((sum, q) => sum + (q.passed ? 10 : 0), 0) + completions.length * 5;
        const averageScore = userQuizzes.length > 0
          ? Math.round(userQuizzes.reduce((sum, q) => sum + q.score, 0) / userQuizzes.length)
          : 0;
        
        return {
          userId: profile.userId,
          name: profile.name,
          studentId: profile.studentId,
          section: profile.section,
          totalPoints,
          averageScore,
          lessonsCompleted: completions.length,
          quizzesPassed: userQuizzes.filter(q => q.passed).length
        };
      });
      
      leaderboardData.sort((a, b) => b.totalPoints - a.totalPoints);
      leaderboardData.forEach((item, index) => {
        item.rank = index + 1;
      });
      
      return { success: true, data: leaderboardData };
    }
  }
};

// AI Analysis Functions (simplified versions)
function analyzeJavaCode(code: string, lessonId: string) {
  return {
    score: Math.floor(Math.random() * 30) + 70,
    maxScore: 100,
    oopPrinciples: detectOOPPrinciples(code),
    codeQuality: [],
    errors: [],
    suggestions: ['Consider adding more comments', 'Good use of OOP principles'],
    strengths: ['Clean code structure', 'Proper naming conventions'],
    plagiarismScore: 0,
    timestamp: new Date().toISOString()
  };
}

function detectOOPPrinciples(code: string) {
  const principles = [];
  
  if (code.includes('private') || code.includes('protected')) {
    principles.push({
      principle: 'Encapsulation',
      detected: true,
      confidence: 90,
      evidence: 'Found private/protected fields',
      score: 25
    });
  }
  
  if (code.includes('extends')) {
    principles.push({
      principle: 'Inheritance',
      detected: true,
      confidence: 90,
      evidence: 'Found class inheritance',
      score: 25
    });
  }
  
  if (code.includes('@Override') || code.includes('interface')) {
    principles.push({
      principle: 'Polymorphism',
      detected: true,
      confidence: 85,
      evidence: 'Found method overriding or interfaces',
      score: 25
    });
  }
  
  return principles;
}

function generateFeedbackMessage(analysis: any) {
  return `Great work! Your code scored ${analysis.score}/100. ${analysis.suggestions.join('. ')}`;
}
