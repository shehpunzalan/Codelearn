// Supabase Configuration
const projectId = "hovedryqutuucipuqxca";
const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdmVkcnlxdXR1dWNpcHVxeGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjI2MTIsImV4cCI6MjA5NTQzODYxMn0.KCiq9UdAV83MdMlWEiMWoP-JsxsRnJW4M2z_XJNJnW0";

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/server`;

// Helper function to make API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // Log network errors silently and rethrow for caller to handle
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Backend server unavailable');
    }
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
// PROGRESS API
// ============================================
export async function getProgress(userId: string, moduleId: string, lessonId: string) {
  return apiRequest(`/progress/${userId}/${moduleId}/${lessonId}`);
}

export async function saveProgress(data: {
  userId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  timeSpent: number;
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
// SUBMISSIONS API
// ============================================
export async function submitCode(data: {
  userId: string;
  moduleId: string;
  lessonId: string;
  code: string;
  assignmentId?: string;
}) {
  return apiRequest('/submissions/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getUserSubmissions(userId: string) {
  return apiRequest(`/submissions/history?userId=${userId}`);
}

export async function getSubmission(userId: string, submissionId: string) {
  return apiRequest(`/submissions/${submissionId}`);
}

// ============================================
// NOTIFICATIONS API
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
// ANALYTICS API (Instructor)
// ============================================
export async function getAllStudentsAnalytics() {
  return apiRequest('/analytics/students');
}

export async function getStudentAnalytics(userId: string) {
  return apiRequest(`/analytics/students/${userId}`);
}

// ============================================
// ASSIGNMENTS API (Instructor)
// ============================================
export async function createAssignment(data: {
  instructorId: string;
  moduleId: string;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  starterCode?: string;
}) {
  return apiRequest('/assignments', {
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