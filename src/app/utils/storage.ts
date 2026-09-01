// Local Storage Management System

export interface StudentProgress {
  userId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  attempts: number;
  lastAttempt: string;
  code: string;
  feedback: string;
  timeSpent: number; // in seconds
}

export interface UserStats {
  userId: string;
  totalLessonsCompleted: number;
  totalModulesCompleted: number;
  averageScore: number;
  totalTimeSpent: number; // in hours
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  completedModules: string[];
}

export interface CodeSubmission {
  id: string;
  userId: string;
  moduleId: string;
  lessonId: string;
  code: string;
  timestamp: string;
  score: number;
  feedback: string;
  errors: string[];
  passed: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'module' | 'activity' | 'announcement';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  moduleId?: string;
  lessonId?: string;
  // Pattern Recognition Metrics
  patternMetrics?: {
    patternsDetected?: number;
    oopPrinciples?: string[];
    codeExamples?: number;
    difficulty?: string;
  };
  // Module Source Information
  source?: {
    type?: 'neural-network' | 'instructor' | 'ai-generated' | 'curriculum';
    instructor?: string;
    tags?: string[];
  };
}

// Progress Management
export const saveProgress = (progress: StudentProgress): void => {
  const key = `progress_${progress.userId}_${progress.moduleId}_${progress.lessonId}`;
  localStorage.setItem(key, JSON.stringify(progress));
  updateUserStats(progress.userId);

  // Best-effort push to backend so this record is visible from any device,
  // not just the browser that saved it. Fire-and-forget: never blocks or
  // throws on the caller, and silently no-ops if the backend is unreachable.
  import('../services/backendApi')
    .then(({ saveProgress: pushProgress }) =>
      pushProgress({
        userId: progress.userId,
        moduleId: progress.moduleId,
        lessonId: progress.lessonId,
        completed: progress.completed,
        timeSpent: progress.timeSpent,
        score: progress.score,
      }).catch(() => {})
    )
    .catch(() => {});
};

export const getProgress = (userId: string, moduleId: string, lessonId: string): StudentProgress | null => {
  const key = `progress_${userId}_${moduleId}_${lessonId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const getAllProgress = (userId: string): StudentProgress[] => {
  const allProgress: StudentProgress[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(`progress_${userId}_`)) {
      const data = localStorage.getItem(key);
      if (data) {
        allProgress.push(JSON.parse(data));
      }
    }
  }
  return allProgress;
};

// User Stats Management
/**
 * Update user statistics based on their progress
 * Calculates completed lessons, modules, and average scores
 * @param userId - The user ID to update stats for
 */
export const updateUserStats = (userId: string): void => {
  // Retrieve all progress records for this user
  const allProgress = getAllProgress(userId);
  
  // Filter only completed lessons
  const completedLessons = allProgress.filter(progressItem => progressItem.completed);
  
  // Get unique module IDs from completed lessons
  const completedModuleIds = [...new Set(completedLessons.map(progressItem => progressItem.moduleId))];
  
  // Calculate average score
  const totalScore = completedLessons.reduce((sum, p) => sum + p.score, 0);
  const averageScore = completedLessons.length > 0 ? Math.round(totalScore / completedLessons.length) : 0;
  
  // Calculate total time
  const totalTimeSpent = allProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0) / 3600; // Convert to hours
  
  // Calculate streak
  const streak = calculateStreak(userId);
  
  const stats: UserStats = {
    userId,
    totalLessonsCompleted: completedLessons.length,
    totalModulesCompleted: completedModuleIds.length,
    averageScore,
    totalTimeSpent: Math.round(totalTimeSpent * 10) / 10,
    streak,
    lastActiveDate: new Date().toISOString(),
    completedLessons: completedLessons.map(progressItem => progressItem.lessonId),
    completedModules: completedModuleIds
  };
  
  localStorage.setItem(`stats_${userId}`, JSON.stringify(stats));
};

export const getUserStats = (userId: string): UserStats | null => {
  const data = localStorage.getItem(`stats_${userId}`);
  if (data) {
    return JSON.parse(data);
  }
  
  // Create default stats if none exist
  const defaultStats: UserStats = {
    userId,
    totalLessonsCompleted: 0,
    totalModulesCompleted: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    streak: 0,
    lastActiveDate: new Date().toISOString(),
    completedLessons: [],
    completedModules: []
  };
  
  localStorage.setItem(`stats_${userId}`, JSON.stringify(defaultStats));
  return defaultStats;
};

// Streak Calculation
const calculateStreak = (userId: string): number => {
  const submissions = getAllSubmissions(userId);
  if (submissions.length === 0) return 0;
  
  // Sort by date descending
  const sortedSubmissions = submissions.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const submission of sortedSubmissions) {
    const submissionDate = new Date(submission.timestamp);
    submissionDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((currentDate.getTime() - submissionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
      currentDate = submissionDate;
    } else if (daysDiff > streak) {
      break;
    }
  }
  
  return streak;
};

// Code Submissions
export const saveSubmission = (submission: CodeSubmission): void => {
  const submissions = getAllSubmissions(submission.userId);
  submissions.push(submission);
  localStorage.setItem(`submissions_${submission.userId}`, JSON.stringify(submissions));

  // Best-effort push to backend via the existing /feedback/save endpoint,
  // which already accepts code/feedback/score keyed by user+module+lesson.
  // Fire-and-forget: never blocks or throws on the caller.
  import('../services/backendApi')
    .then(({ saveFeedback }) =>
      saveFeedback({
        userId: submission.userId,
        moduleId: submission.moduleId,
        lessonId: submission.lessonId,
        code: submission.code,
        feedback: submission.feedback,
        analysisResults: { errors: submission.errors, passed: submission.passed },
        score: submission.score,
      }).catch(() => {})
    )
    .catch(() => {});
};

export const getAllSubmissions = (userId: string): CodeSubmission[] => {
  const data = localStorage.getItem(`submissions_${userId}`);
  return data ? JSON.parse(data) : [];
};

/**
 * Get all code submissions for a specific lesson
 * @param userId - The user ID
 * @param lessonId - The lesson ID to filter submissions
 * @returns Array of code submissions for the specified lesson
 */
export const getSubmissionsByLesson = (userId: string, lessonId: string): CodeSubmission[] => {
  const allSubmissions = getAllSubmissions(userId);
  return allSubmissions.filter(submission => submission.lessonId === lessonId);
};

// Clear user data (for testing)
export const clearUserData = (userId: string): void => {
  // Clear progress
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key?.startsWith(`progress_${userId}_`) || 
        key === `stats_${userId}` || 
        key === `submissions_${userId}`) {
      localStorage.removeItem(key);
    }
  }
};

// Notification Management
export const saveNotification = (notification: Notification): void => {
  const notifications = getAllNotifications(notification.userId);
  notifications.push(notification);
  localStorage.setItem(`notifications_${notification.userId}`, JSON.stringify(notifications));
};

export const getAllNotifications = (userId: string): Notification[] => {
  const data = localStorage.getItem(`notifications_${userId}`);
  if (!data) return [];
  
  const notifications: Notification[] = JSON.parse(data);
  // Sort by timestamp, newest first
  return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

/**
 * Mark a specific notification as read
 * @param userId - The user ID
 * @param notificationId - The notification ID to mark as read
 */
export const markNotificationAsRead = (userId: string, notificationId: string): void => {
  const notifications = getAllNotifications(userId);
  const updatedNotifications = notifications.map(notification => 
    notification.id === notificationId ? { ...notification, read: true } : notification
  );
  localStorage.setItem(`notifications_${userId}`, JSON.stringify(updatedNotifications));
};

/**
 * Delete a specific notification
 * @param userId - The user ID
 * @param notificationId - The notification ID to delete
 */
export const deleteNotification = (userId: string, notificationId: string): void => {
  const notifications = getAllNotifications(userId);
  const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);
  localStorage.setItem(`notifications_${userId}`, JSON.stringify(updatedNotifications));
};

export const clearAllNotifications = (userId: string): void => {
  localStorage.removeItem(`notifications_${userId}`);
};

/**
 * Get the count of unread notifications for a user
 * @param userId - The user ID
 * @returns Number of unread notifications
 */
export const getUnreadNotificationCount = (userId: string): number => {
  const notifications = getAllNotifications(userId);
  return notifications.filter(notification => !notification.read).length;
};

// Export Data
export const exportUserData = (userId: string): string => {
  const stats = getUserStats(userId);
  const progress = getAllProgress(userId);
  const submissions = getAllSubmissions(userId);
  const notifications = getAllNotifications(userId);
  
  const data = {
    stats,
    progress,
    submissions,
    notifications,
    exportDate: new Date().toISOString()
  };
  
  return JSON.stringify(data, null, 2);
};
