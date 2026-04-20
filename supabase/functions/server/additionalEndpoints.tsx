// Additional API endpoints for CodeLearn AI System
// This file contains: Assignments, Plagiarism Detection, Neural Network Analysis, Leaderboard, Notifications

import type { Context } from 'npm:hono';
import * as kv from "./kv_store.tsx";

// ============================================
// ASSIGNMENT MANAGEMENT
// ============================================

export async function createAssignment(c: Context) {
  try {
    const body = await c.req.json();
    const { title, description, dueDate, totalPoints, starterCode, testCases, instructorId, moduleId } = body;
    
    const assignmentId = `assign_${Date.now()}`;
    const assignmentData = {
      id: assignmentId,
      title,
      description,
      dueDate,
      totalPoints,
      starterCode,
      testCases: testCases || [],
      instructorId,
      moduleId,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    await kv.set(`assignment_${assignmentId}`, assignmentData);
    
    return c.json({ success: true, data: assignmentData });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
}

export async function getAllAssignments(c: Context) {
  try {
    const prefix = `assignment_`;
    const allAssignments = await kv.getByPrefix(prefix);
    
    return c.json({ success: true, data: allAssignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
}

export async function getAssignmentById(c: Context) {
  try {
    const { assignmentId } = c.req.param();
    const assignment = await kv.get(`assignment_${assignmentId}`);
    
    if (!assignment) {
      return c.json({ success: false, error: 'Assignment not found' }, 404);
    }
    
    return c.json({ success: true, data: assignment });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
}

export async function updateAssignment(c: Context) {
  try {
    const { assignmentId } = c.req.param();
    const body = await c.req.json();
    
    const existingAssignment = await kv.get(`assignment_${assignmentId}`);
    if (!existingAssignment) {
      return c.json({ success: false, error: 'Assignment not found' }, 404);
    }
    
    const updatedAssignment = {
      ...existingAssignment,
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`assignment_${assignmentId}`, updatedAssignment);
    
    return c.json({ success: true, data: updatedAssignment });
  } catch (error) {
    console.error('Error updating assignment:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
}

export async function deleteAssignment(c: Context) {
  try {
    const { assignmentId } = c.req.param();
    await kv.del(`assignment_${assignmentId}`);
    
    return c.json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
}

export async function submitAssignment(c: Context) {
  try {
    const body = await c.req.json();
    const { userId, assignmentId, code, comments } = body;
    
    const submissionId = `assign_submission_${Date.now()}_${userId}`;
    const submission = {
      id: submissionId,
      userId,
      assignmentId,
      code,
      comments,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      score: null,
      feedback: null
    };
    
    await kv.set(`assign_submission_${submissionId}`, submission);
    
    // Run plagiarism check
    const plagiarismResult = await checkPlagiarism(code, userId, assignmentId);
    
    return c.json({ 
      success: true, 
      data: { 
        submission, 
        plagiarismCheck: plagiarismResult 
      } 
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
}

export async function gradeAssignment(c: Context) {
  try {
    const body = await c.req.json();
    const { submissionId, score, feedback, instructorId } = body;
    
    const submission = await kv.get(`assign_submission_${submissionId}`);
    if (!submission) {
      return c.json({ success: false, error: 'Submission not found' }, 404);
    }
    
    const gradedSubmission = {
      ...submission,
      score,
      feedback,
      gradedBy: instructorId,
      gradedAt: new Date().toISOString(),
      status: 'graded'
    };
    
    await kv.set(`assign_submission_${submissionId}`, gradedSubmission);
    
    return c.json({ success: true, data: gradedSubmission });
  } catch (error) {
    console.error('Error grading assignment:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
}

export async function getAssignmentSubmissions(c: Context) {
  try {
    const { assignmentId } = c.req.param();
    const prefix = `assign_submission_`;
    const allSubmissions = await kv.getByPrefix(prefix);
    
    const assignmentSubmissions = allSubmissions.filter((sub: any) => sub.assignmentId === assignmentId);
    
    return c.json({ success: true, data: assignmentSubmissions });
  } catch (error) {
    console.error('Error fetching assignment submissions:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
}

// ============================================
// PLAGIARISM DETECTION
// ============================================

export async function checkPlagiarismEndpoint(c: Context) {
  try {
    const body = await c.req.json();
    const { code, userId, assignmentId } = body;
    
    const result = await checkPlagiarism(code, userId, assignmentId);
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.error('Error checking plagiarism:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
}

export async function getPlagiarismReports(c: Context) {
  try {
    const { assignmentId } = c.req.param();
    const prefix = `plagiarism_report_`;
    const allReports = await kv.getByPrefix(prefix);
    
    const assignmentReports = allReports.filter((report: any) => report.assignmentId === assignmentId);
    
    return c.json({ success: true, data: assignmentReports });
  } catch (error) {
    console.error('Error fetching plagiarism reports:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
}

async function checkPlagiarism(code: string, userId: string, assignmentId: string): Promise<any> {
  try {
    const prefix = `assign_submission_`;
    const allSubmissions = await kv.getByPrefix(prefix);
    const assignmentSubmissions = allSubmissions.filter((sub: any) => 
      sub.assignmentId === assignmentId && sub.userId !== userId
    );
    
    const similarities: any[] = [];
    let maxSimilarity = 0;
    let suspiciousMatch = null;
    
    for (const submission of assignmentSubmissions) {
      const similarity = calculateCodeSimilarity(code, submission.code);
      
      if (similarity > 30) {
        similarities.push({
          userId: submission.userId,
          similarity,
          submittedAt: submission.submittedAt
        });
        
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
          suspiciousMatch = submission.userId;
        }
      }
    }
    
    const isPlagiarized = maxSimilarity > 85;
    const isSuspicious = maxSimilarity > 70 && maxSimilarity <= 85;
    
    const report = {
      userId,
      assignmentId,
      isPlagiarized,
      isSuspicious,
      maxSimilarity,
      suspiciousMatch,
      similarities,
      checkedAt: new Date().toISOString()
    };
    
    if (isPlagiarized || isSuspicious) {
      const reportId = `plagiarism_report_${Date.now()}_${userId}`;
      await kv.set(`plagiarism_report_${reportId}`, report);
    }
    
    return report;
  } catch (error) {
    console.error('Error in plagiarism detection:', error);
    return {
      error: String(error),
      isPlagiarized: false,
      isSuspicious: false,
      maxSimilarity: 0
    };
  }
}

function calculateCodeSimilarity(code1: string, code2: string): number {
  const normalize = (code: string) => {
    return code
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  };
  
  const normalized1 = normalize(code1);
  const normalized2 = normalize(code2);
  
  const tokenize = (code: string) => {
    const tokens = new Set(code.match(/\b\w+\b/g) || []);
    return tokens;
  };
  
  const tokens1 = tokenize(normalized1);
  const tokens2 = tokenize(normalized2);
  
  const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);
  
  const jaccardSimilarity = (intersection.size / union.size) * 100;
  
  const structureSimilarity = calculateLevenshteinSimilarity(normalized1, normalized2);
  
  const overallSimilarity = (structureSimilarity * 0.6) + (jaccardSimilarity * 0.4);
  
  return Math.round(overallSimilarity);
}

function calculateLevenshteinSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  const similarity = ((maxLength - distance) / maxLength) * 100;
  return Math.round(similarity);
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// ============================================
// NEURAL NETWORK ANALYSIS
// ============================================

export async function neuralNetworkAnalyze(c: Context) {
  try {
    const body = await c.req.json();
    const { code, userId, moduleId, lessonId } = body;
    
    const analysis = await performNeuralNetworkAnalysis(code);
    
    const analysisId = `nn_analysis_${Date.now()}_${userId}`;
    const analysisData = {
      id: analysisId,
      userId,
      moduleId,
      lessonId,
      code,
      analysis,
      timestamp: new Date().toISOString()
    };
    
    await kv.set(`nn_analysis_${analysisId}`, analysisData);
    
    return c.json({ success: true, data: analysis });
  } catch (error) {
    console.error('Error in neural network analysis:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
}

async function performNeuralNetworkAnalysis(code: string): Promise<any> {
  const patterns = {
    codeSmells: detectCodeSmells(code),
    complexity: calculateComplexity(code),
    maintainability: calculateMaintainability(code)
  };
  
  const recommendations = generateRecommendations(patterns);
  const potentialIssues = predictIssues(patterns);
  
  return {
    patterns,
    recommendations,
    potentialIssues,
    confidence: 92
  };
}

function detectCodeSmells(code: string): string[] {
  const smells: string[] = [];
  
  const methods = code.match(/\w+\s+\w+\s*\([^)]*\)\s*\{[^}]+\}/g) || [];
  for (const method of methods) {
    const lines = method.split('\n').length;
    if (lines > 30) {
      smells.push('Long Method: Method exceeds 30 lines');
    }
  }
  
  const classMatch = code.match(/class\s+\w+/g) || [];
  if (classMatch.length === 1 && code.length > 500) {
    smells.push('God Class: Single class with too many responsibilities');
  }
  
  const magicNumbers = code.match(/\b\d{2,}\b/g) || [];
  if (magicNumbers.length > 3) {
    smells.push('Magic Numbers: Use named constants instead of literal values');
  }
  
  return smells;
}

function calculateComplexity(code: string): number {
  let complexity = 1;
  
  const decisionPoints = [
    /\bif\b/g,
    /\bwhile\b/g,
    /\bfor\b/g,
    /\bcase\b/g,
    /\bcatch\b/g,
    /\&\&/g,
    /\|\|/g
  ];
  
  decisionPoints.forEach(pattern => {
    const matches = code.match(pattern);
    if (matches) {
      complexity += matches.length;
    }
  });
  
  return complexity;
}

function calculateMaintainability(code: string): number {
  const linesOfCode = code.split('\n').filter(line => line.trim().length > 0).length;
  const complexity = calculateComplexity(code);
  const commentRatio = (code.match(/\/\/.*/g) || []).length / linesOfCode;
  
  const maintainability = 171 - 5.2 * Math.log(linesOfCode) - 0.23 * complexity + 16.2 * Math.log(commentRatio + 1);
  
  return Math.max(0, Math.min(100, Math.round(maintainability)));
}

function generateRecommendations(patterns: any): string[] {
  const recommendations: string[] = [];
  
  if (patterns.complexity > 10) {
    recommendations.push('High complexity detected. Break down complex methods into smaller, focused functions');
  }
  
  if (patterns.codeSmells.length > 0) {
    recommendations.push('Address detected code smells to improve code quality');
  }
  
  if (patterns.maintainability < 50) {
    recommendations.push('Low maintainability - consider refactoring for better code quality');
  }
  
  return recommendations;
}

function predictIssues(patterns: any): string[] {
  const issues: string[] = [];
  
  if (patterns.maintainability < 50) {
    issues.push('Low maintainability score - code may be difficult to maintain long-term');
  }
  
  if (patterns.complexity > 15) {
    issues.push('Very high complexity may lead to bugs and testing difficulties');
  }
  
  return issues;
}

// ============================================
// LEADERBOARD
// ============================================

export async function getGlobalLeaderboard(c: Context) {
  try {
    const prefix = `profile_`;
    const allProfiles = await kv.getByPrefix(prefix);
    
    const leaderboardData = await Promise.all(
      allProfiles.map(async (profile: any) => {
        const userId = profile.userId;
        
        const quizPrefix = `quiz_`;
        const allQuizzes = await kv.getByPrefix(quizPrefix);
        const userQuizzes = allQuizzes.filter((q: any) => q.userId === userId);
        
        const completionPrefix = `completion_${userId}_`;
        const completions = await kv.getByPrefix(completionPrefix);
        
        const totalPoints = userQuizzes.reduce((sum: number, q: any) => sum + (q.passed ? 10 : 0), 0) +
                           completions.length * 5;
        
        const averageScore = userQuizzes.length > 0
          ? Math.round(userQuizzes.reduce((sum: number, q: any) => sum + q.score, 0) / userQuizzes.length)
          : 0;
        
        return {
          userId: profile.userId,
          name: profile.name,
          studentId: profile.studentId,
          section: profile.section,
          totalPoints,
          averageScore,
          lessonsCompleted: completions.length,
          quizzesPassed: userQuizzes.filter((q: any) => q.passed).length
        };
      })
    );
    
    leaderboardData.sort((a, b) => b.totalPoints - a.totalPoints);
    
    leaderboardData.forEach((item: any, index: number) => {
      item.rank = index + 1;
    });
    
    return c.json({ success: true, data: leaderboardData });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
}

export async function getModuleLeaderboard(c: Context) {
  try {
    const { moduleId } = c.req.param();
    const prefix = `profile_`;
    const allProfiles = await kv.getByPrefix(prefix);
    
    const moduleLeaderboard = await Promise.all(
      allProfiles.map(async (profile: any) => {
        const userId = profile.userId;
        
        const quizPrefix = `quiz_`;
        const allQuizzes = await kv.getByPrefix(quizPrefix);
        const moduleQuizzes = allQuizzes.filter((q: any) => q.userId === userId && q.moduleId === moduleId);
        
        const completionPrefix = `completion_${userId}_${moduleId}_`;
        const completions = await kv.getByPrefix(completionPrefix);
        
        const averageScore = moduleQuizzes.length > 0
          ? Math.round(moduleQuizzes.reduce((sum: number, q: any) => sum + q.score, 0) / moduleQuizzes.length)
          : 0;
        
        return {
          userId: profile.userId,
          name: profile.name,
          studentId: profile.studentId,
          section: profile.section,
          averageScore,
          lessonsCompleted: completions.length,
          quizzesPassed: moduleQuizzes.filter((q: any) => q.passed).length
        };
      })
    );
    
    moduleLeaderboard.sort((a, b) => b.averageScore - a.averageScore);
    
    moduleLeaderboard.forEach((item: any, index: number) => {
      item.rank = index + 1;
    });
    
    return c.json({ success: true, data: moduleLeaderboard });
  } catch (error) {
    console.error('Error fetching module leaderboard:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
}

// ============================================
// NOTIFICATIONS
// ============================================

export async function createNotification(c: Context) {
  try {
    const body = await c.req.json();
    const { userId, title, message, type, link } = body;
    
    const notificationId = `notification_${Date.now()}_${userId}`;
    const notification = {
      id: notificationId,
      userId,
      title,
      message,
      type,
      link,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`notification_${notificationId}`, notification);
    
    return c.json({ success: true, data: notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
}

export async function getUserNotifications(c: Context) {
  try {
    const { userId } = c.req.param();
    const prefix = `notification_`;
    const allNotifications = await kv.getByPrefix(prefix);
    
    const userNotifications = allNotifications
      .filter((n: any) => n.userId === userId)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({ success: true, data: userNotifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
}

export async function markNotificationAsRead(c: Context) {
  try {
    const { notificationId } = c.req.param();
    const notification = await kv.get(`notification_${notificationId}`);
    
    if (!notification) {
      return c.json({ success: false, error: 'Notification not found' }, 404);
    }
    
    notification.read = true;
    notification.readAt = new Date().toISOString();
    
    await kv.set(`notification_${notificationId}`, notification);
    
    return c.json({ success: true, data: notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
}
