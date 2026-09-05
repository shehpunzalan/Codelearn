import { publicAnonKey } from '/utils/supabase/info';

// Make platform's own project ID — hardcoded because it never changes regardless of which
// Supabase project the user links. The make-server-c61d3fdc function lives here.
//
// FIXED: this was previously pointing at project ref "hnlhcbzpeijdzueipejx", which only has
// a function named "make-server-aaa3a86f" deployed — not "make-server-c61d3fdc". The correct
// project (confirmed via the Supabase dashboard) is "hovedryqutuucipuqxca", which has BOTH
// "make-server-c61d3fdc" (45 deployments, updated 8 days ago) and "server" deployed.
const MAKE_PROJECT_ID = 'hovedryqutuucipuqxca';
const MAKE_API_URL = `https://${MAKE_PROJECT_ID}.supabase.co/functions/v1/make-server-c61d3fdc`;

// Secondary: User's own deployed function — same project as above.
//
// FIXED: this was previously "hoofdryqutuucipuqxca" (note "hoof" vs the correct "hoved") —
// a one-character-block typo that pointed at a domain that doesn't resolve, producing
// ERR_NAME_NOT_RESOLVED / ERR_TUNNEL_CONNECTION_FAILED regardless of anything else being
// configured correctly.
const USER_API_URL = `https://hovedryqutuucipuqxca.supabase.co/functions/v1/server`;

// IMPORTANT: this anon key MUST belong to the "hovedryqutuucipuqxca" project specifically —
// anon keys are JWTs signed per-project, so a key from any other project (including the old
// "hoofdryqutuucipuqxca" typo'd one this constant previously held) will be rejected even
// once the URL above is correct. Get the right value from:
//   Supabase Dashboard → (hovedryqutuucipuqxca project) → Settings → API → "anon" "public" key
// and paste it in below, replacing the placeholder.
const USER_ANON_KEY = 'REPLACE_WITH_THE_ANON_KEY_FROM_THE_HOVEDRYQUTUUCIPUQXCA_PROJECT_SETTINGS_API_PAGE';

// Helper to get auth token
function getAuthToken(): string {
  return localStorage.getItem('accessToken') || (publicAnonKey as string);
}

// Safely parse JSON from a string — never throws, returns null on failure
function safeParseJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch (_e: unknown) {
    return null;
  }
}

async function fetchFromUrl(url: string, endpoint: string, options: RequestInit, authKey: string): Promise<any> {
  const fullUrl = `${url}${endpoint}`;
  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authKey}`,
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const data = safeParseJSON(text);
  // 404 from Make backend means the function hasn't been redeployed yet — let it fall through
  if (response.status === 404) throw new Error(`HTTP 404 — route not deployed yet`);
  if (data === null || (!response.ok && !data)) throw new Error(`HTTP ${response.status}`);
  if (data?.success === false) throw new Error(data.error || `HTTP ${response.status}`);
  return data;
}

// Helper function to make API requests — tries Make platform first, then user's own function
async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  // Try Make platform backend (primary — browser CSP allows this, but may return 404
  // if the edge function hasn't been redeployed with the latest routes yet)
  try {
    return await fetchFromUrl(MAKE_API_URL, endpoint, options, getAuthToken());
  } catch (makeErr: unknown) {
    const isNotDeployed = String(makeErr).includes('404');
    if (isNotDeployed) {
      console.warn(`Make backend: route ${endpoint} not yet deployed (404) — trying fallback`);
    } else {
      console.warn(`Make backend failed for ${endpoint}:`, makeErr);
    }
  }
  // Try user's own Supabase function (secondary — may fail due to browser CSP if direct call)
  try {
    return await fetchFromUrl(USER_API_URL, endpoint, options, USER_ANON_KEY);
  } catch (userErr: unknown) {
    const isCsp = String(userErr).includes('Failed to fetch');
    if (isCsp) {
      throw new Error('backend-csp');
    }
    console.error(`Both backends failed for ${endpoint}:`, userErr);
    throw new Error('Cannot reach the server. Please check your connection and try again.');
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

export async function getAllRegisteredUsers() {
  return apiRequest('/users/registered');
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
    const url = `${MAKE_API_URL}/user-position`;
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
    const url = `${MAKE_API_URL}/user-position/${userId}`;
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
