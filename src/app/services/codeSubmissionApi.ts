// Code Submission API Service
// Handles all communication with backend for code submissions and AI feedback

// Supabase Configuration
const projectId = "hovedryqutuucipuqxca";
const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdmVkcnlxdXR1dWNpcHVxeGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjI2MTIsImV4cCI6MjA5NTQzODYxMn0.KCiq9UdAV83MdMlWEiMWoP-JsxsRnJW4M2z_XJNJnW0";

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-aaa3a86f`;

// Get auth token from localStorage
const getAuthToken = () => {
  const userStr = localStorage.getItem('currentUser');
  if (userStr) {
    const user = JSON.parse(userStr);
    return user.accessToken || publicAnonKey;
  }
  return publicAnonKey;
};

export interface CodeSubmission {
  userId: string;
  moduleId: string;
  lessonId: string;
  code: string;
  language?: string;
}

export interface SubmissionResponse {
  submissionId: string;
  score: number;
  feedback: {
    oopPrinciples: string[];
    strengths: string[];
    improvements: string[];
    suggestions: string[];
    patterns: string[];
    errorDetection: string[];
    codeQuality: {
      readability: number;
      maintainability: number;
      efficiency: number;
      bestPractices: number;
    };
  };
  timestamp: string;
}

// Submit code and get AI feedback
export async function submitCode(submission: CodeSubmission): Promise<SubmissionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(submission)
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to submit code');
    }

    return data.data;
  } catch (error) {
    // Handle network errors gracefully
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Backend server unavailable');
    }
    throw error;
  }
}

// Get submission history for a user
export async function getSubmissionHistory(userId: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/history?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to get submission history');
    }

    return data.data.submissions || [];
  } catch (error) {
    console.error('Error fetching submission history:', error);
    return [];
  }
}

// Get specific submission
export async function getSubmission(submissionId: string, userId: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/${submissionId}?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to get submission');
    }

    return data.data.submission;
  } catch (error) {
    console.error('Error fetching submission:', error);
    throw error;
  }
}

// Get submissions by module/lesson
export async function getSubmissionsByLesson(
  userId: string, 
  moduleId: string, 
  lessonId?: string
): Promise<any[]> {
  try {
    const url = lessonId 
      ? `${API_BASE_URL}/submissions/lesson?userId=${userId}&moduleId=${moduleId}&lessonId=${lessonId}`
      : `${API_BASE_URL}/submissions/lesson?userId=${userId}&moduleId=${moduleId}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to get submissions');
    }

    return data.data.submissions || [];
  } catch (error) {
    console.error('Error fetching submissions by lesson:', error);
    return [];
  }
}

// Auto-save code draft
export async function autoSaveCode(
  userId: string,
  moduleId: string,
  lessonId: string,
  code: string
): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/submissions/autosave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        userId,
        moduleId,
        lessonId,
        code
      })
    });
  } catch (error) {
    console.error('Error auto-saving code:', error);
    // Don't throw - auto-save failures should be silent
  }
}

// Get draft code
export async function getDraftCode(
  userId: string,
  moduleId: string,
  lessonId: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/submissions/draft?userId=${userId}&moduleId=${moduleId}&lessonId=${lessonId}`,
      {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      }
    );

    const data = await response.json();
    
    if (!data.success || !data.data.draft) {
      return null;
    }

    return data.data.draft.code;
  } catch (error) {
    console.error('Error fetching draft code:', error);
    return null;
  }
}
