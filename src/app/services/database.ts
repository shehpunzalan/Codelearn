import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/server`;

// Helper function to make API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`API Error (${endpoint}):`, error);
    throw new Error(`API request failed: ${error}`);
  }

  return response.json();
}

// ============================================
// QUIZ SCORE ENDPOINTS
// ============================================

export async function saveQuizScore(data: {
  userId: string;
  moduleId: string;
  lessonId: string;
  score: number;
  answers: { [key: string]: string };
  totalQuestions: number;
}) {
  return apiRequest('/quiz/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getQuizHistory(userId: string, moduleId: string, lessonId: string) {
  return apiRequest(`/quiz/${userId}/${moduleId}/${lessonId}`);
}

export async function getAllQuizScores(userId: string) {
  return apiRequest(`/quiz/${userId}`);
}

// ============================================
// LESSON COMPLETION ENDPOINTS
// ============================================

export async function markLessonComplete(data: {
  userId: string;
  moduleId: string;
  lessonId: string;
  timeSpent: number;
}) {
  return apiRequest('/lesson/complete', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getLessonCompletions(userId: string) {
  return apiRequest(`/lesson/completions/${userId}`);
}

// ============================================
// AI FEEDBACK ENDPOINTS
// ============================================

export async function saveAIFeedback(data: {
  userId: string;
  moduleId: string;
  lessonId: string;
  code: string;
  feedback: string;
  analysisResults: any;
  score: number;
}) {
  return apiRequest('/feedback/save', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getAIFeedbackHistory(userId: string) {
  return apiRequest(`/feedback/${userId}`);
}

export async function getAIFeedbackForLesson(userId: string, moduleId: string, lessonId: string) {
  return apiRequest(`/feedback/${userId}/${moduleId}/${lessonId}`);
}

// ============================================
// USER PROGRESS ENDPOINTS
// ============================================

export async function saveProgress(data: {
  userId: string;
  moduleId: string;
  lessonId: string;
  completed?: boolean;
  timeSpent?: number;
  score?: number;
}) {
  return apiRequest('/progress', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getProgress(userId: string, moduleId: string, lessonId: string) {
  return apiRequest(`/progress/${userId}/${moduleId}/${lessonId}`);
}

export async function getAllProgress(userId: string) {
  return apiRequest(`/progress/${userId}`);
}

// ============================================
// USER PROFILE ENDPOINTS
// ============================================

export async function saveUserProfile(data: {
  userId: string;
  name: string;
  email: string;
  studentId?: string;
  section?: string;
  yearLevel?: string;
  avatar?: string;
  bio?: string;
}) {
  return apiRequest('/profile', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getUserProfile(userId: string) {
  return apiRequest(`/profile/${userId}`);
}

// ============================================
// CODE EXECUTION ENDPOINTS
// ============================================

export async function executeCode(data: {
  code: string;
  userId: string;
  moduleId: string;
  lessonId: string;
}) {
  return apiRequest('/execute-code', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function verifyCode(data: {
  code: string;
  expectedOutput: string;
  userId: string;
  moduleId: string;
  lessonId: string;
  problemId: string;
}) {
  return apiRequest('/verify-code', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============================================
// MACHINE PROBLEM ENDPOINTS
// ============================================

export async function getMachineProblem(moduleId: string, lessonId: string) {
  return apiRequest(`/machine-problem/${moduleId}/${lessonId}`);
}

export async function submitMachineProblem(data: {
  userId: string;
  moduleId: string;
  lessonId: string;
  problemId: string;
  code: string;
  output: string;
}) {
  return apiRequest('/machine-problem/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMachineProblemSubmissions(userId: string, moduleId: string, lessonId: string) {
  return apiRequest(`/machine-problem/submissions/${userId}/${moduleId}/${lessonId}`);
}

// ============================================
// ANALYTICS ENDPOINTS
// ============================================

export async function getStudentsAnalytics() {
  return apiRequest('/analytics/students');
}

export async function getStudentAnalytics(userId: string) {
  return apiRequest(`/analytics/student/${userId}`);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get or create user ID
export function getUserId(): string {
  let userId = localStorage.getItem('codelearn_userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('codelearn_userId', userId);
  }
  return userId;
}

// Get current user name
export function getUserName(): string {
  return localStorage.getItem('codelearn_userName') || 'Student User';
}

// Set user name
export function setUserName(name: string): void {
  localStorage.setItem('codelearn_userName', name);
}
