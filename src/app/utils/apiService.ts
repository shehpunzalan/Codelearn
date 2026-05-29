import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/server`;

// Helper function to make API requests
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }

    return data.data as T;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ============================================
// PROGRESS API
// ============================================

export interface ProgressData {
  userId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  timeSpent: number;
  score: number;
  timestamp: string;
}

export const progressAPI = {
  // Get progress for a specific lesson
  getProgress: async (userId: string, moduleId: string, lessonId: string): Promise<ProgressData | null> => {
    try {
      return await apiRequest<ProgressData>(`/progress/${userId}/${moduleId}/${lessonId}`);
    } catch (error) {
      console.error('Error fetching progress:', error);
      return null;
    }
  },

  // Save progress
  saveProgress: async (progress: Omit<ProgressData, 'timestamp'>): Promise<ProgressData> => {
    return await apiRequest<ProgressData>('/progress', {
      method: 'POST',
      body: JSON.stringify(progress),
    });
  },

  // Get all progress for a user
  getAllProgress: async (userId: string): Promise<ProgressData[]> => {
    try {
      return await apiRequest<ProgressData[]>(`/progress/${userId}`);
    } catch (error) {
      console.error('Error fetching all progress:', error);
      return [];
    }
  },
};

// ============================================
// SUBMISSIONS API
// ============================================

export interface SubmissionData {
  id: string;
  userId: string;
  moduleId: string;
  lessonId: string;
  assignmentId?: string;
  code: string;
  timestamp: string;
  status: 'pass' | 'fail' | 'error';
  score: number;
  errors?: any[];
  feedback?: string;
  patterns?: string[];
  oopScores?: {
    encapsulation: number;
    inheritance: number;
    polymorphism: number;
    abstraction: number;
    overall: number;
  };
}

export const submissionsAPI = {
  // Submit code for analysis
  submitCode: async (submission: {
    userId: string;
    moduleId: string;
    lessonId: string;
    code: string;
    assignmentId?: string;
  }): Promise<SubmissionData> => {
    return await apiRequest<SubmissionData>('/submissions', {
      method: 'POST',
      body: JSON.stringify(submission),
    });
  },

  // Get all submissions for a user
  getAllSubmissions: async (userId: string): Promise<SubmissionData[]> => {
    try {
      return await apiRequest<SubmissionData[]>(`/submissions/${userId}`);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
  },

  // Get a specific submission
  getSubmission: async (userId: string, submissionId: string): Promise<SubmissionData | null> => {
    try {
      return await apiRequest<SubmissionData>(`/submissions/${userId}/${submissionId}`);
    } catch (error) {
      console.error('Error fetching submission:', error);
      return null;
    }
  },
};

// ============================================
// NOTIFICATIONS API
// ============================================

export interface NotificationData {
  id: string;
  userId: string;
  type: 'module' | 'activity' | 'announcement';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  moduleId?: string;
  lessonId?: string;
}

export const notificationsAPI = {
  // Get user notifications
  getNotifications: async (userId: string): Promise<NotificationData[]> => {
    try {
      return await apiRequest<NotificationData[]>(`/notifications/${userId}`);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  // Create notification
  createNotification: async (notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>): Promise<NotificationData> => {
    return await apiRequest<NotificationData>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notification),
    });
  },

  // Mark notification as read
  markAsRead: async (userId: string, notificationId: string): Promise<NotificationData> => {
    return await apiRequest<NotificationData>(`/notifications/${userId}/${notificationId}`, {
      method: 'PUT',
    });
  },
};

// ============================================
// ANALYTICS API (Instructor)
// ============================================

export interface StudentAnalytics {
  userId: string;
  submissionsCount: number;
  averageScore: number;
  lastSubmission?: string;
}

export interface DetailedStudentPerformance {
  userId: string;
  submissions: SubmissionData[];
  progress: ProgressData[];
  stats: {
    submissionsCount: number;
    averageScore: number;
    completedLessons: number;
  };
}

export const analyticsAPI = {
  // Get all students' performance
  getAllStudentsPerformance: async (): Promise<StudentAnalytics[]> => {
    try {
      return await apiRequest<StudentAnalytics[]>('/analytics/students');
    } catch (error) {
      console.error('Error fetching student analytics:', error);
      return [];
    }
  },

  // Get specific student performance
  getStudentPerformance: async (userId: string): Promise<DetailedStudentPerformance | null> => {
    try {
      return await apiRequest<DetailedStudentPerformance>(`/analytics/students/${userId}`);
    } catch (error) {
      console.error('Error fetching student performance:', error);
      return null;
    }
  },
};

// ============================================
// ASSIGNMENTS API
// ============================================

export interface AssignmentData {
  id: string;
  instructorId: string;
  moduleId: string;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  starterCode?: string;
  createdAt: string;
}

export const assignmentsAPI = {
  // Create assignment
  createAssignment: async (assignment: Omit<AssignmentData, 'id' | 'createdAt'>): Promise<AssignmentData> => {
    return await apiRequest<AssignmentData>('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignment),
    });
  },

  // Get all assignments
  getAllAssignments: async (): Promise<AssignmentData[]> => {
    try {
      return await apiRequest<AssignmentData[]>('/assignments');
    } catch (error) {
      console.error('Error fetching assignments:', error);
      return [];
    }
  },

  // Get assignment by ID
  getAssignment: async (assignmentId: string): Promise<AssignmentData | null> => {
    try {
      return await apiRequest<AssignmentData>(`/assignments/${assignmentId}`);
    } catch (error) {
      console.error('Error fetching assignment:', error);
      return null;
    }
  },
};

// ============================================
// HEALTH CHECK
// ============================================

export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  try {
    return await apiRequest<{ status: string; timestamp: string }>('/health');
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'error', timestamp: new Date().toISOString() };
  }
};
