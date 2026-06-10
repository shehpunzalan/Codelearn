// Supabase Configuration
const projectId = "hovedryqutuucipuqxca";
const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdmVkcnlxdXR1dWNpcHVxeGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjI2MTIsImV4cCI6MjA5NTQzODYxMn0.KCiq9UdAV83MdMlWEiMWoP-JsxsRnJW4M2z_XJNJnW0";

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/server`;

// Helper to get auth token
function getAuthToken(): string {
  return localStorage.getItem('accessToken') || publicAnonKey;
}

// Helper function to make API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || `API request failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ============================================
// HEALTH CHECK
// ============================================
export async function checkHealth() {
  return apiRequest('/health');
}

// ============================================
// AUTHENTICATION
// ============================================
export async function signIn(email: string, password: string) {
  return apiRequest('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signUp(data: {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'instructor';
  studentId?: string;
  section?: string;
  yearLevel?: string;
}) {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function signOut() {
  return apiRequest('/auth/signout', {
    method: 'POST',
  });
}

export async function getSession() {
  return apiRequest('/auth/session');
}

// ============================================
// USER PROFILE
// ============================================
export async function getProfile(userId: string) {
  return apiRequest(`/profile/${userId}`);
}

export async function updateProfile(data: {
  userId: string;
  name?: string;
  email?: string;
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

// ============================================
// PROGRESS TRACKING
// ============================================
export async function getProgress(userId: string, moduleId: string, lessonId: string) {
  return apiRequest(`/progress/${userId}/${moduleId}/${lessonId}`);
}

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

export async function getAllProgress(userId: string) {
  return apiRequest(`/progress/${userId}`);
}

// ============================================
// LESSON COMPLETION
// ============================================
export async function markLessonComplete(data: {
  userId: string;
  moduleId: string;
  lessonId: string;
  timeSpent?: number;
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
// QUIZ
// ============================================
export async function submitQuiz(data: {
  userId: string;
  moduleId: string;
  lessonId: string;
  score: number;
  answers: any;
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

export async function getAllQuizzes(userId: string) {
  return apiRequest(`/quiz/${userId}`);
}

// ============================================
// CODE SUBMISSIONS
// ============================================
export async function submitCode(data: {
  userId: string;
  moduleId: string;
  lessonId: string;
  code: string;
  assignmentId?: string;
  problemId?: string;
}) {
  return apiRequest('/submissions/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getSubmissionHistory(userId: string) {
  return apiRequest(`/submissions/history?userId=${userId}`);
}

export async function getSubmission(submissionId: string) {
  return apiRequest(`/submissions/${submissionId}`);
}

// ============================================
// AI FEEDBACK
// ============================================
export async function analyzeCode(data: {
  userId: string;
  moduleId: string;
  lessonId: string;
  code: string;
}) {
  return apiRequest('/ai-feedback/analyze', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getAIFeedback(userId: string) {
  return apiRequest(`/ai-feedback/${userId}`);
}

export async function getLessonAIFeedback(userId: string, moduleId: string, lessonId: string) {
  return apiRequest(`/ai-feedback/${userId}/${moduleId}/${lessonId}`);
}

export async function saveFeedback(data: {
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

export async function getFeedbackHistory(userId: string) {
  return apiRequest(`/feedback/${userId}`);
}

// ============================================
// CODE EXECUTION
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
// ASSIGNMENTS (Instructor)
// ============================================
export async function createAssignment(data: {
  instructorId: string;
  moduleId: string;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  starterCode?: string;
  expectedOutput?: string;
  testCases?: any[];
}) {
  return apiRequest('/assignments/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getAllAssignments() {
  return apiRequest('/assignments');
}

export async function getAssignment(assignmentId: string) {
  return apiRequest(`/assignments/${assignmentId}`);
}

export async function updateAssignment(assignmentId: string, data: any) {
  return apiRequest(`/assignments/${assignmentId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAssignment(assignmentId: string) {
  return apiRequest(`/assignments/${assignmentId}`, {
    method: 'DELETE',
  });
}

// ============================================
// ANALYTICS (Instructor)
// ============================================
export async function getAllStudentsAnalytics() {
  return apiRequest('/analytics/students');
}

export async function getStudentAnalytics(userId: string) {
  return apiRequest(`/analytics/student/${userId}`);
}

export async function getModuleAnalytics(moduleId: string) {
  return apiRequest(`/analytics/module/${moduleId}`);
}

export async function getLessonAnalytics(moduleId: string, lessonId: string) {
  return apiRequest(`/analytics/lesson/${moduleId}/${lessonId}`);
}

// ============================================
// PLAGIARISM DETECTION
// ============================================
export async function checkPlagiarism(data: {
  userId: string;
  code: string;
  assignmentId?: string;
}) {
  return apiRequest('/plagiarism/check', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getPlagiarismReport(submissionId: string) {
  return apiRequest(`/plagiarism/report/${submissionId}`);
}

// ============================================
// NOTIFICATIONS
// ============================================
export async function getNotifications(userId: string) {
  return apiRequest(`/notifications/${userId}`);
}

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  moduleId?: string;
  lessonId?: string;
}) {
  return apiRequest('/notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function markNotificationAsRead(userId: string, notificationId: string) {
  return apiRequest(`/notifications/${userId}/${notificationId}`, {
    method: 'PUT',
  });
}

// ============================================
// MACHINE PROJECTS
// ============================================
export async function submitMachineProject(data: {
  userId: string;
  moduleId: string;
  projectNumber: number;
  code: string;
  className: string;
  description?: string;
}) {
  return apiRequest('/mp/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMachineProjects(userId: string) {
  return apiRequest(`/mp/${userId}`);
}

export async function getMachineProject(userId: string, moduleId: string, projectNumber: number) {
  return apiRequest(`/mp/${userId}/${moduleId}/${projectNumber}`);
}

// ============================================
// LEADERBOARD
// ============================================
export async function getLeaderboard(moduleId?: string) {
  const endpoint = moduleId ? `/leaderboard?moduleId=${moduleId}` : '/leaderboard';
  return apiRequest(endpoint);
}

export async function getUserRank(userId: string, moduleId?: string) {
  const endpoint = moduleId
    ? `/leaderboard/rank/${userId}?moduleId=${moduleId}`
    : `/leaderboard/rank/${userId}`;
  return apiRequest(endpoint);
}

// ============================================
// USER POSITION (resume last lesson)
// localStorage-first with optional backend sync
// ============================================
export async function saveUserPosition(data: {
  userId: string;
  moduleId: string;
  lessonId: string;
  moduleTitle?: string;
  lessonTitle?: string;
}) {
  // Always save to localStorage immediately
  const positionData = { ...data, savedAt: new Date().toISOString() };
  try {
    localStorage.setItem(`userPosition_${data.userId}`, JSON.stringify(positionData));
  } catch {}
  // Fire-and-forget backend sync — swallow any errors silently
  try {
    const url = `${API_BASE_URL}/user-position`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getAuthToken()}` },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const text = await response.text();
      try { JSON.parse(text); } catch {}
    }
  } catch {}
}

export async function getUserPosition(userId: string): Promise<{ data: { moduleId: string; lessonId: string; moduleTitle?: string; lessonTitle?: string } | null }> {
  // Try localStorage first — it's always available
  try {
    const local = localStorage.getItem(`userPosition_${userId}`);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed?.moduleId && parsed?.lessonId) {
        return { data: parsed };
      }
    }
  } catch {}
  // Attempt backend as fallback — silently fail
  try {
    const url = `${API_BASE_URL}/user-position/${userId}`;
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getAuthToken()}` },
    });
    if (response.ok) {
      const text = await response.text();
      try {
        const json = JSON.parse(text);
        if (json?.data?.moduleId && json?.data?.lessonId) {
          return { data: json.data };
        }
      } catch {}
    }
  } catch {}
  return { data: null };
}
