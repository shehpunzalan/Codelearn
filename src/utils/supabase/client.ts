import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const SUPABASE_URL = `https://${projectId}.supabase.co`;
const API_BASE_URL = `${SUPABASE_URL}/functions/v1/make-server-aaa3a86f`;

// Auth storage helpers
export const authStorage = {
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('supabase_access_token', accessToken);
    localStorage.setItem('supabase_refresh_token', refreshToken);
  },

  getAccessToken: () => localStorage.getItem('supabase_access_token'),

  getRefreshToken: () => localStorage.getItem('supabase_refresh_token'),

  clearTokens: () => {
    localStorage.removeItem('supabase_access_token');
    localStorage.removeItem('supabase_refresh_token');
  }
};

// API helper function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const accessToken = authStorage.getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'API request failed');
  }

  return data.data;
}

// Auth API
export const authAPI = {
  signup: async (userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    studentId?: string;
    section?: string;
    yearLevel?: string;
  }) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  signin: async (email: string, password: string) => {
    const data = await apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store tokens
    if (data.accessToken && data.refreshToken) {
      authStorage.setTokens(data.accessToken, data.refreshToken);
    }

    return data;
  },

  signout: async () => {
    try {
      await apiRequest('/auth/signout', { method: 'POST' });
    } finally {
      authStorage.clearTokens();
    }
  },

  getSession: async () => {
    return apiRequest('/auth/session');
  },
};

// Progress API
export const progressAPI = {
  getProgress: async (userId: string, moduleId: string, lessonId: string) => {
    return apiRequest(`/progress/${userId}/${moduleId}/${lessonId}`);
  },

  saveProgress: async (progressData: {
    userId: string;
    moduleId: string;
    lessonId: string;
    completed?: boolean;
    timeSpent?: number;
    score?: number;
  }) => {
    return apiRequest('/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  },

  getAllProgress: async (userId: string) => {
    return apiRequest(`/progress/${userId}`);
  },
};

// Quiz API
export const quizAPI = {
  submitQuiz: async (quizData: {
    userId: string;
    moduleId: string;
    lessonId: string;
    score: number;
    answers: any[];
    totalQuestions: number;
  }) => {
    return apiRequest('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  },

  getQuizResults: async (userId: string, moduleId: string, lessonId: string) => {
    return apiRequest(`/quiz/${userId}/${moduleId}/${lessonId}`);
  },

  getAllQuizResults: async (userId: string) => {
    return apiRequest(`/quiz/${userId}`);
  },
};

// AI Feedback API
export const feedbackAPI = {
  analyzeCode: async (feedbackData: {
    userId: string;
    moduleId: string;
    lessonId: string;
    code: string;
  }) => {
    return apiRequest('/ai-feedback/analyze', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  },

  getFeedback: async (userId: string, moduleId?: string, lessonId?: string) => {
    const endpoint = moduleId && lessonId
      ? `/ai-feedback/${userId}/${moduleId}/${lessonId}`
      : `/ai-feedback/${userId}`;
    return apiRequest(endpoint);
  },

  saveFeedback: async (feedbackData: {
    userId: string;
    moduleId: string;
    lessonId: string;
    code: string;
    feedback: string;
    analysisResults: any;
    score: number;
  }) => {
    return apiRequest('/feedback/save', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  },
};

// Profile API
export const profileAPI = {
  getProfile: async (userId: string) => {
    return apiRequest(`/profile/${userId}`);
  },

  updateProfile: async (profileData: {
    userId: string;
    name?: string;
    email?: string;
    studentId?: string;
    section?: string;
    yearLevel?: string;
    avatar?: string;
    bio?: string;
  }) => {
    return apiRequest('/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },
};

// Lesson Completion API
export const lessonAPI = {
  completeLesson: async (completionData: {
    userId: string;
    moduleId: string;
    lessonId: string;
    timeSpent?: number;
  }) => {
    return apiRequest('/lesson/complete', {
      method: 'POST',
      body: JSON.stringify(completionData),
    });
  },

  getCompletions: async (userId: string) => {
    return apiRequest(`/lesson/completions/${userId}`);
  },
};

// Analytics API
export const analyticsAPI = {
  getAllStudents: async () => {
    return apiRequest('/analytics/students');
  },

  getStudentAnalytics: async (userId: string) => {
    return apiRequest(`/analytics/student/${userId}`);
  },
};

// Code Submission API
export const submissionAPI = {
  submitCode: async (submissionData: {
    userId: string;
    moduleId: string;
    lessonId: string;
    code: string;
    language?: string;
  }) => {
    return apiRequest('/submissions/submit', {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  },

  getSubmissionHistory: async (userId: string, moduleId: string, lessonId: string) => {
    return apiRequest(`/submissions/history?userId=${userId}&moduleId=${moduleId}&lessonId=${lessonId}`);
  },

  getSubmission: async (submissionId: string) => {
    return apiRequest(`/submissions/${submissionId}`);
  },

  autoSave: async (draftData: {
    userId: string;
    moduleId: string;
    lessonId: string;
    code: string;
  }) => {
    return apiRequest('/submissions/autosave', {
      method: 'POST',
      body: JSON.stringify(draftData),
    });
  },

  getDraft: async (userId: string, moduleId: string, lessonId: string) => {
    return apiRequest(`/submissions/draft?userId=${userId}&moduleId=${moduleId}&lessonId=${lessonId}`);
  },
};

// Assignment API
export const assignmentAPI = {
  createAssignment: async (assignmentData: any) => {
    return apiRequest('/assignments/create', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  },

  getAllAssignments: async () => {
    return apiRequest('/assignments');
  },

  getAssignment: async (assignmentId: string) => {
    return apiRequest(`/assignments/${assignmentId}`);
  },

  updateAssignment: async (assignmentId: string, assignmentData: any) => {
    return apiRequest(`/assignments/${assignmentId}`, {
      method: 'PUT',
      body: JSON.stringify(assignmentData),
    });
  },

  deleteAssignment: async (assignmentId: string) => {
    return apiRequest(`/assignments/${assignmentId}`, {
      method: 'DELETE',
    });
  },

  submitAssignment: async (submissionData: any) => {
    return apiRequest('/assignments/submit', {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  },

  gradeAssignment: async (gradeData: any) => {
    return apiRequest('/assignments/grade', {
      method: 'POST',
      body: JSON.stringify(gradeData),
    });
  },

  getSubmissions: async (assignmentId: string) => {
    return apiRequest(`/assignments/${assignmentId}/submissions`);
  },
};

// Notification API
export const notificationAPI = {
  createNotification: async (notificationData: {
    userId: string;
    title: string;
    message: string;
    type?: string;
  }) => {
    return apiRequest('/notifications/create', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  },

  getUserNotifications: async (userId: string) => {
    return apiRequest(`/notifications/${userId}`);
  },

  markAsRead: async (notificationId: string) => {
    return apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },
};

// Leaderboard API
export const leaderboardAPI = {
  getGlobalLeaderboard: async () => {
    return apiRequest('/leaderboard');
  },

  getModuleLeaderboard: async (moduleId: string) => {
    return apiRequest(`/leaderboard/module/${moduleId}`);
  },
};
