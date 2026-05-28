import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from "./kv_store.ts";
import * as additional from "./additionalEndpoints.ts";
import * as aiFeedback from "./aiFeedbackAnalysis.ts";
import * as codeSubmission from "./codeSubmissionEndpoints.ts";

const app = new Hono();

app.use('*', logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

app.get("/make-server-aaa3a86f/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

// AUTH
app.post("/make-server-aaa3a86f/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, role, studentId, section, yearLevel } = body;
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data, error } = await supabase.auth.admin.createUser({
      email, password, user_metadata: { name, role: role || 'student', studentId, section, yearLevel }, email_confirm: true
    });
    if (error) return c.json({ success: false, error: error.message }, 400);
    if (data.user) {
      await kv.set(`profile_${data.user.id}`, {
        userId: data.user.id, name, email, role: role || 'student', studentId: studentId || '',
        section: section || '', yearLevel: yearLevel || '', avatar: '', bio: '',
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      });
    }
    return c.json({ success: true, data: { userId: data.user?.id, email: data.user?.email, name, role: role || 'student' } });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post("/make-server-aaa3a86f/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return c.json({ success: false, error: error.message }, 400);
    const profile = await kv.get(`profile_${data.user.id}`);
    return c.json({ success: true, data: { userId: data.user.id, email: data.user.email, accessToken: data.session.access_token, refreshToken: data.session.refresh_token, profile } });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post("/make-server-aaa3a86f/auth/signout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) return c.json({ success: false, error: 'No access token' }, 401);
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);
    const { error } = await supabase.auth.signOut();
    if (error) return c.json({ success: false, error: error.message }, 400);
    return c.json({ success: true, message: 'Signed out' });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-aaa3a86f/auth/session", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) return c.json({ success: false, error: 'No access token' }, 401);
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) return c.json({ success: false, error: 'Invalid session' }, 401);
    const profile = await kv.get(`profile_${user.id}`);
    return c.json({ success: true, data: { userId: user.id, email: user.email, profile } });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// PROGRESS
app.get("/make-server-aaa3a86f/progress/:userId/:moduleId/:lessonId", async (c) => {
  try {
    const { userId, moduleId, lessonId } = c.req.param();
    const progress = await kv.get(`progress_${userId}_${moduleId}_${lessonId}`);
    return c.json({ success: true, data: progress });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post("/make-server-aaa3a86f/progress", async (c) => {
  try {
    const { userId, moduleId, lessonId, completed, timeSpent, score } = await c.req.json();
    const progressData = { userId, moduleId, lessonId, completed: completed || false, timeSpent: timeSpent || 0, score: score || 0, timestamp: new Date().toISOString() };
    await kv.set(`progress_${userId}_${moduleId}_${lessonId}`, progressData);
    return c.json({ success: true, data: progressData });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-aaa3a86f/progress/:userId", async (c) => {
  try {
    const { userId } = c.req.param();
    const allProgress = await kv.getByPrefix(`progress_${userId}_`);
    return c.json({ success: true, data: allProgress });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// QUIZ
app.post("/make-server-aaa3a86f/quiz/submit", async (c) => {
  try {
    const { userId, moduleId, lessonId, score, answers, totalQuestions } = await c.req.json();
    const quizId = `quiz_${Date.now()}_${userId}`;
    const quizData = { id: quizId, userId, moduleId, lessonId, score, answers, totalQuestions, passed: score >= 70, timestamp: new Date().toISOString() };
    await kv.set(`quiz_${quizId}`, quizData);
    const existingProgress = await kv.get(`progress_${userId}_${moduleId}_${lessonId}`) || {};
    await kv.set(`progress_${userId}_${moduleId}_${lessonId}`, { ...existingProgress, userId, moduleId, lessonId, quizCompleted: true, quizScore: score, quizPassed: score >= 70, lastUpdated: new Date().toISOString() });
    return c.json({ success: true, data: quizData });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-aaa3a86f/quiz/:userId/:moduleId/:lessonId", async (c) => {
  try {
    const { userId, moduleId, lessonId } = c.req.param();
    const allQuizzes = await kv.getByPrefix(`quiz_`);
    const userQuizzes = allQuizzes
      .filter(quiz => quiz.userId === userId && quiz.moduleId === moduleId && quiz.lessonId === lessonId)
      .sort((quizA, quizB) => new Date(quizB.timestamp).getTime() - new Date(quizA.timestamp).getTime());
    return c.json({ success: true, data: userQuizzes });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-aaa3a86f/quiz/:userId", async (c) => {
  try {
    const { userId } = c.req.param();
    const allQuizzes = await kv.getByPrefix(`quiz_`);
    const userQuizzes = allQuizzes.filter(q => q.userId === userId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return c.json({ success: true, data: userQuizzes });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// AI FEEDBACK
app.post("/make-server-aaa3a86f/ai-feedback/analyze", async (c) => {
  try {
    const { userId, moduleId, lessonId, code } = await c.req.json();
    if (!code || code.trim().length === 0) return c.json({ success: false, error: 'Code required' }, 400);
    const analysis = aiFeedback.analyzeJavaCode(code, lessonId);
    const feedbackMessage = aiFeedback.generateFeedbackMessage(analysis);
    const feedbackId = `aifeedback_${Date.now()}_${userId}`;
    const feedbackData = { id: feedbackId, userId, moduleId, lessonId, code, analysis, feedbackMessage, score: analysis.score, timestamp: new Date().toISOString() };
    await kv.set(`aifeedback_${feedbackId}`, feedbackData);
    return c.json({ success: true, data: { feedbackId, analysis, feedbackMessage, score: analysis.score } });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-aaa3a86f/ai-feedback/:userId", async (c) => {
  try {
    const { userId } = c.req.param();
    const allFeedback = await kv.getByPrefix(`aifeedback_`);
    const userFeedback = allFeedback.filter(fb => fb.userId === userId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return c.json({ success: true, data: userFeedback });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-aaa3a86f/ai-feedback/:userId/:moduleId/:lessonId", async (c) => {
  try {
    const { userId, moduleId, lessonId } = c.req.param();
    const allFeedback = await kv.getByPrefix(`aifeedback_`);
    const lessonFeedback = allFeedback.filter(fb => fb.userId === userId && fb.moduleId === moduleId && fb.lessonId === lessonId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return c.json({ success: true, data: lessonFeedback });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post("/make-server-aaa3a86f/feedback/save", async (c) => {
  try {
    const { userId, moduleId, lessonId, code, feedback, analysisResults, score } = await c.req.json();
    const feedbackId = `feedback_${Date.now()}_${userId}`;
    const feedbackData = { id: feedbackId, userId, moduleId, lessonId, code, feedback, analysisResults, score, timestamp: new Date().toISOString() };
    await kv.set(`feedback_${feedbackId}`, feedbackData);
    return c.json({ success: true, data: feedbackData });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-aaa3a86f/feedback/:userId", async (c) => {
  try {
    const { userId } = c.req.param();
    const allFeedback = await kv.getByPrefix(`feedback_`);
    const userFeedback = allFeedback.filter(fb => fb.userId === userId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return c.json({ success: true, data: userFeedback });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-aaa3a86f/feedback/:userId/:moduleId/:lessonId", async (c) => {
  try {
    const { userId, moduleId, lessonId } = c.req.param();
    const allFeedback = await kv.getByPrefix(`feedback_`);
    const lessonFeedback = allFeedback.filter(fb => fb.userId === userId && fb.moduleId === moduleId && fb.lessonId === lessonId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return c.json({ success: true, data: lessonFeedback });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// PROFILE
app.post("/make-server-aaa3a86f/profile", async (c) => {
  try {
    const { userId, name, email, studentId, section, yearLevel, avatar, bio } = await c.req.json();
    const profileData = { userId, name, email, studentId, section, yearLevel, avatar, bio, updatedAt: new Date().toISOString() };
    await kv.set(`profile_${userId}`, profileData);
    return c.json({ success: true, data: profileData });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-aaa3a86f/profile/:userId", async (c) => {
  try {
    const { userId } = c.req.param();
    const profile = await kv.get(`profile_${userId}`);
    if (!profile) {
      return c.json({ success: true, data: { userId, name: 'Student User', email: '', studentId: '', section: '', yearLevel: '', avatar: '', bio: '' } });
    }
    return c.json({ success: true, data: profile });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// LESSON COMPLETION
app.post("/make-server-aaa3a86f/lesson/complete", async (c) => {
  try {
    const { userId, moduleId, lessonId, timeSpent } = await c.req.json();
    const completionData = { userId, moduleId, lessonId, completed: true, timeSpent: timeSpent || 0, completedAt: new Date().toISOString() };
    await kv.set(`completion_${userId}_${moduleId}_${lessonId}`, completionData);
    return c.json({ success: true, data: completionData });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-aaa3a86f/lesson/completions/:userId", async (c) => {
  try {
    const { userId } = c.req.param();
    const allCompletions = await kv.getByPrefix(`completion_${userId}_`);
    return c.json({ success: true, data: allCompletions });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ANALYTICS
app.get("/make-server-aaa3a86f/analytics/students", async (c) => {
  try {
    const allProfiles = await kv.getByPrefix(`profile_`);
    const studentsData = await Promise.all(allProfiles.map(async (profile) => {
      const userId = profile.userId;
      const progressData = await kv.getByPrefix(`progress_${userId}_`);
      const allQuizzes = await kv.getByPrefix(`quiz_`);
      const userQuizzes = allQuizzes.filter(q => q.userId === userId);
      const completions = await kv.getByPrefix(`completion_${userId}_`);
      return {
        ...profile,
        progressCount: progressData.length,
        quizzesTaken: userQuizzes.length,
        lessonsCompleted: completions.length,
        averageQuizScore: userQuizzes.length > 0 ? Math.round(userQuizzes.reduce((sum, q) => sum + q.score, 0) / userQuizzes.length) : 0
      };
    }));
    return c.json({ success: true, data: studentsData });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-aaa3a86f/analytics/student/:userId", async (c) => {
  try {
    const { userId } = c.req.param();
    const profile = await kv.get(`profile_${userId}`);
    const progressData = await kv.getByPrefix(`progress_${userId}_`);
    const allQuizzes = await kv.getByPrefix(`quiz_`);
    const userQuizzes = allQuizzes.filter(q => q.userId === userId);
    const completions = await kv.getByPrefix(`completion_${userId}_`);
    const allFeedback = await kv.getByPrefix(`feedback_`);
    const userFeedback = allFeedback.filter(f => f.userId === userId);
    const allSubmissions = await kv.getByPrefix(`mp_submission_`);
    const userSubmissions = allSubmissions.filter(s => s.userId === userId);
    const analytics = {
      profile,
      stats: {
        lessonsCompleted: completions.length,
        quizzesTaken: userQuizzes.length,
        averageQuizScore: userQuizzes.length > 0 ? Math.round(userQuizzes.reduce((sum, q) => sum + q.score, 0) / userQuizzes.length) : 0,
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
    return c.json({ success: true, data: analytics });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// EXTERNAL ENDPOINTS
app.post("/make-server-aaa3a86f/assignments/create", additional.createAssignment);
app.get("/make-server-aaa3a86f/assignments", additional.getAllAssignments);
app.get("/make-server-aaa3a86f/assignments/:assignmentId", additional.getAssignmentById);
app.put("/make-server-aaa3a86f/assignments/:assignmentId", additional.updateAssignment);
app.delete("/make-server-aaa3a86f/assignments/:assignmentId", additional.deleteAssignment);
app.post("/make-server-aaa3a86f/assignments/submit", additional.submitAssignment);
app.post("/make-server-aaa3a86f/assignments/grade", additional.gradeAssignment);
app.get("/make-server-aaa3a86f/assignments/:assignmentId/submissions", additional.getAssignmentSubmissions);
app.post("/make-server-aaa3a86f/plagiarism/check", additional.checkPlagiarismEndpoint);
app.get("/make-server-aaa3a86f/plagiarism/reports/:assignmentId", additional.getPlagiarismReports);
app.post("/make-server-aaa3a86f/neural-network/analyze", additional.neuralNetworkAnalyze);
app.get("/make-server-aaa3a86f/leaderboard", additional.getGlobalLeaderboard);
app.get("/make-server-aaa3a86f/leaderboard/module/:moduleId", additional.getModuleLeaderboard);
app.post("/make-server-aaa3a86f/notifications/create", additional.createNotification);
app.get("/make-server-aaa3a86f/notifications/:userId", additional.getUserNotifications);
app.put("/make-server-aaa3a86f/notifications/:notificationId/read", additional.markNotificationAsRead);
app.post("/make-server-aaa3a86f/submissions/submit", codeSubmission.submitCodeHandler);
app.get("/make-server-aaa3a86f/submissions/history", codeSubmission.getSubmissionHistoryHandler);
app.get("/make-server-aaa3a86f/submissions/:submissionId", codeSubmission.getSubmissionHandler);
app.get("/make-server-aaa3a86f/submissions/lesson", codeSubmission.getSubmissionsByLessonHandler);
app.post("/make-server-aaa3a86f/submissions/autosave", codeSubmission.autoSaveCodeHandler);
app.get("/make-server-aaa3a86f/submissions/draft", codeSubmission.getDraftCodeHandler);

Deno.serve(app.fetch);