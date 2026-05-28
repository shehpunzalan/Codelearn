// Code Submission & AI Feedback Endpoints
// Handles saving code submissions and generating AI feedback

import { Context } from "npm:hono";
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from "./kv_store.tsx";

// Initialize Supabase client
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
};

// Generate unique submission ID
const generateSubmissionId = () => {
  return `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// ============================================
// AI FEEDBACK GENERATION
// ============================================

interface CodeAnalysisResult {
  score: number;
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
}

export function generateAIFeedback(code: string, moduleId: string, lessonId: string): CodeAnalysisResult {
  // Pattern detection for OOP principles
  const hasClass = /class\s+\w+/.test(code);
  const hasMethod = /public\s+\w+\s+\w+\(/.test(code);
  const hasPrivate = /private\s+/.test(code);
  const hasProtected = /protected\s+/.test(code);
  const hasConstructor = /public\s+\w+\s*\(/.test(code);
  const hasComments = /\/\/|\/\*/.test(code);
  const hasInheritance = /extends\s+\w+/.test(code);
  const hasInterface = /implements\s+\w+/.test(code);
  const hasOverride = /@Override/.test(code);
  const hasEncapsulation = hasPrivate && /public\s+\w+\s+get\w+\(/.test(code);
  const hasPolymorphism = hasOverride || hasInterface;
  const hasAbstraction = /abstract\s+class/.test(code) || /interface\s+\w+/.test(code);
  const hasExceptionHandling = /try\s*{/.test(code) && /catch\s*\(/.test(code);
  const hasGenerics = /<\w+>/.test(code);
  const hasCollections = /ArrayList|HashMap|HashSet|LinkedList/.test(code);
  
  const codeLength = code.length;
  const lines = code.split('\n').length;
  const avgLineLength = codeLength / lines;

  // Identify OOP principles demonstrated
  const oopPrinciples: string[] = [];
  if (hasEncapsulation) oopPrinciples.push('Encapsulation');
  if (hasInheritance) oopPrinciples.push('Inheritance');
  if (hasPolymorphism) oopPrinciples.push('Polymorphism');
  if (hasAbstraction) oopPrinciples.push('Abstraction');

  // Identify strengths
  const strengths: string[] = [];
  if (hasClass) strengths.push('✓ Properly defined class structure');
  if (hasConstructor) strengths.push('✓ Includes constructor for object initialization');
  if (hasComments) strengths.push('✓ Code is documented with comments');
  if (hasEncapsulation) strengths.push('✓ Implements encapsulation with getters/setters');
  if (hasPrivate) strengths.push('✓ Uses access modifiers for data hiding');
  if (hasExceptionHandling) strengths.push('✓ Implements proper exception handling');
  if (hasOverride) strengths.push('✓ Uses @Override annotation for clarity');
  if (avgLineLength < 80) strengths.push('✓ Maintains readable line length');

  // Identify areas for improvement
  const improvements: string[] = [];
  if (!hasClass) improvements.push('⚠ Missing class definition - Java programs should be organized in classes');
  if (!hasPrivate && hasClass) improvements.push('⚠ Consider using private access modifiers for encapsulation');
  if (!hasConstructor && hasClass) improvements.push('⚠ Add a constructor to properly initialize objects');
  if (!hasComments) improvements.push('⚠ Add comments to explain complex logic');
  if (!hasMethod && hasClass) improvements.push('⚠ Add methods to define object behavior');
  if (avgLineLength > 100) improvements.push('⚠ Some lines are too long - break them for readability');

  // Generate actionable suggestions
  const suggestions: string[] = [];
  
  if (!hasEncapsulation && hasClass) {
    suggestions.push('→ Implement getters and setters for private fields to follow encapsulation principle');
  }
  
  if (!/\s{4}/.test(code) && !/\t/.test(code)) {
    suggestions.push('→ Use consistent indentation (4 spaces or tabs) throughout your code');
  }
  
  if (!/toString\(\)/.test(code) && hasClass) {
    suggestions.push('→ Override toString() method for better object representation');
  }
  
  if (!/equals\(/.test(code) && hasClass) {
    suggestions.push('→ Consider implementing equals() and hashCode() methods');
  }
  
  if (!hasExceptionHandling && /File|Stream|SQL/.test(code)) {
    suggestions.push('→ Add try-catch blocks to handle potential exceptions');
  }

  if (hasClass && !hasComments) {
    suggestions.push('→ Add JavaDoc comments to document your class and methods');
  }

  // Detect patterns
  const patterns: string[] = [];
  if (/class\s+\w+Factory/.test(code)) patterns.push('Factory Pattern');
  if (/class\s+\w+Singleton/.test(code)) patterns.push('Singleton Pattern');
  if (/class\s+\w+Builder/.test(code)) patterns.push('Builder Pattern');
  if (/interface\s+\w+Observer/.test(code)) patterns.push('Observer Pattern');
  if (/abstract\s+class/.test(code)) patterns.push('Template Method Pattern');

  // Error detection
  const errorDetection: string[] = [];
  if (/System\.out\.print/.test(code) && moduleId !== 'mod1') {
    errorDetection.push('⚠ Avoid using System.out.print in production code - use logging frameworks');
  }
  if (/public\s+\w+\s+\w+;/.test(code)) {
    errorDetection.push('⚠ Detected public fields - should be private with getters/setters');
  }
  if (/==/.test(code) && /String/.test(code)) {
    errorDetection.push('⚠ Use .equals() instead of == for String comparison');
  }
  if (!/;\s*$/.test(code.trim()) && code.includes('{')) {
    errorDetection.push('⚠ Check for missing semicolons');
  }

  // Calculate code quality metrics (0-100)
  const readability = Math.min(100, (
    (hasComments ? 25 : 0) +
    (avgLineLength < 80 ? 25 : 10) +
    (/\s{4}|\t/.test(code) ? 25 : 0) +
    (codeLength > 50 ? 25 : 10)
  ));

  const maintainability = Math.min(100, (
    (hasEncapsulation ? 30 : 0) +
    (hasComments ? 20 : 0) +
    (hasMethod ? 20 : 0) +
    (lines < 300 ? 30 : 10)
  ));

  const efficiency = Math.min(100, (
    (hasClass ? 25 : 0) +
    (hasMethod ? 25 : 0) +
    (!errorDetection.length ? 50 : 25)
  ));

  const bestPractices = Math.min(100, (
    (hasPrivate ? 20 : 0) +
    (hasConstructor ? 20 : 0) +
    (hasEncapsulation ? 30 : 0) +
    (hasExceptionHandling ? 30 : 0)
  ));

  // Calculate overall score
  const score = Math.round(
    (readability * 0.2 + maintainability * 0.3 + efficiency * 0.2 + bestPractices * 0.3)
  );

  return {
    score,
    oopPrinciples,
    strengths,
    improvements,
    suggestions,
    patterns,
    errorDetection,
    codeQuality: {
      readability,
      maintainability,
      efficiency,
      bestPractices
    }
  };
}

// ============================================
// SUBMIT CODE ENDPOINT
// ============================================

export async function submitCodeHandler(c: Context) {
  try {
    const body = await c.req.json();
    const { userId, moduleId, lessonId, code, language = 'java' } = body;

    if (!userId || !moduleId || !lessonId || !code) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields: userId, moduleId, lessonId, code' 
      }, 400);
    }

    // Optional authentication check - allow both authenticated and demo users
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    // Only verify auth if a proper access token is provided (not the anon key)
    if (accessToken && accessToken !== Deno.env.get('SUPABASE_ANON_KEY')) {
      const supabase = getSupabaseClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
      
      if (authError || !user) {
        console.log('Auth verification failed, proceeding as demo user');
      } else if (user.id !== userId) {
        return c.json({ success: false, error: 'Unauthorized - user ID mismatch' }, 403);
      }
    }

    // Generate AI feedback
    const aiFeedback = generateAIFeedback(code, moduleId, lessonId);

    // Create submission object
    const submissionId = generateSubmissionId();
    const submission = {
      id: submissionId,
      userId,
      moduleId,
      lessonId,
      code,
      language,
      submittedAt: new Date().toISOString(),
      score: aiFeedback.score,
      feedback: {
        oopPrinciples: aiFeedback.oopPrinciples,
        strengths: aiFeedback.strengths,
        improvements: aiFeedback.improvements,
        suggestions: aiFeedback.suggestions,
        patterns: aiFeedback.patterns,
        errorDetection: aiFeedback.errorDetection,
        codeQuality: aiFeedback.codeQuality
      },
      status: 'completed'
    };

    // Save submission to KV store
    const submissionKey = `submission_${userId}_${submissionId}`;
    await kv.set(submissionKey, submission);

    // Update user's submission history
    const historyKey = `submission_history_${userId}`;
    const existingHistory = await kv.get(historyKey) || { submissions: [] };
    existingHistory.submissions = [
      submissionId,
      ...existingHistory.submissions.slice(0, 99) // Keep last 100 submissions
    ];
    await kv.set(historyKey, existingHistory);

    // Update module progress
    const progressKey = `progress_${userId}_${moduleId}`;
    const progressData = await kv.get(progressKey) || {
      moduleId,
      lessonsCompleted: [],
      submissions: 0,
      averageScore: 0
    };

    progressData.submissions += 1;
    progressData.averageScore = Math.round(
      ((progressData.averageScore * (progressData.submissions - 1)) + aiFeedback.score) / 
      progressData.submissions
    );

    if (!progressData.lessonsCompleted.includes(lessonId)) {
      progressData.lessonsCompleted.push(lessonId);
    }

    await kv.set(progressKey, progressData);

    console.log(`Code submission saved successfully: ${submissionId} for user ${userId}`);

    return c.json({
      success: true,
      data: {
        submissionId,
        score: aiFeedback.score,
        feedback: aiFeedback,
        timestamp: submission.submittedAt
      }
    });

  } catch (error) {
    console.error('Error in submitCodeHandler:', error);
    return c.json({ 
      success: false, 
      error: `Failed to submit code: ${String(error)}` 
    }, 500);
  }
}

// ============================================
// GET SUBMISSION HISTORY
// ============================================

export async function getSubmissionHistoryHandler(c: Context) {
  try {
    const userId = c.req.query('userId');

    if (!userId) {
      return c.json({ success: false, error: 'Missing userId parameter' }, 400);
    }

    // Verify authentication
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user || user.id !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    // Get submission history
    const historyKey = `submission_history_${userId}`;
    const history = await kv.get(historyKey);

    if (!history || !history.submissions || history.submissions.length === 0) {
      return c.json({ 
        success: true, 
        data: { submissions: [] } 
      });
    }

    // Fetch full submission details
    const submissions = [];
    for (const submissionId of history.submissions) {
      const submissionKey = `submission_${userId}_${submissionId}`;
      const submission = await kv.get(submissionKey);
      if (submission) {
        submissions.push(submission);
      }
    }

    // Sort by date (newest first)
    submissions.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    return c.json({
      success: true,
      data: { submissions }
    });

  } catch (error) {
    console.error('Error in getSubmissionHistoryHandler:', error);
    return c.json({ 
      success: false, 
      error: `Failed to get submission history: ${String(error)}` 
    }, 500);
  }
}

// ============================================
// GET SPECIFIC SUBMISSION
// ============================================

export async function getSubmissionHandler(c: Context) {
  try {
    const submissionId = c.req.param('submissionId');
    const userId = c.req.query('userId');

    if (!submissionId || !userId) {
      return c.json({ 
        success: false, 
        error: 'Missing submissionId or userId' 
      }, 400);
    }

    // Verify authentication
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user || user.id !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    // Get submission
    const submissionKey = `submission_${userId}_${submissionId}`;
    const submission = await kv.get(submissionKey);

    if (!submission) {
      return c.json({ 
        success: false, 
        error: 'Submission not found' 
      }, 404);
    }

    return c.json({
      success: true,
      data: { submission }
    });

  } catch (error) {
    console.error('Error in getSubmissionHandler:', error);
    return c.json({ 
      success: false, 
      error: `Failed to get submission: ${String(error)}` 
    }, 500);
  }
}

// ============================================
// GET SUBMISSIONS BY MODULE/LESSON
// ============================================

export async function getSubmissionsByLessonHandler(c: Context) {
  try {
    const userId = c.req.query('userId');
    const moduleId = c.req.query('moduleId');
    const lessonId = c.req.query('lessonId');

    if (!userId || !moduleId) {
      return c.json({ 
        success: false, 
        error: 'Missing required parameters: userId, moduleId' 
      }, 400);
    }

    // Verify authentication
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user || user.id !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    // Get all submissions for the user
    const historyKey = `submission_history_${userId}`;
    const history = await kv.get(historyKey);

    if (!history || !history.submissions || history.submissions.length === 0) {
      return c.json({ 
        success: true, 
        data: { submissions: [] } 
      });
    }

    // Fetch and filter submissions
    const submissions = [];
    for (const submissionId of history.submissions) {
      const submissionKey = `submission_${userId}_${submissionId}`;
      const submission = await kv.get(submissionKey);
      
      if (submission && submission.moduleId === moduleId) {
        if (!lessonId || submission.lessonId === lessonId) {
          submissions.push(submission);
        }
      }
    }

    // Sort by date (newest first)
    submissions.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    return c.json({
      success: true,
      data: { submissions }
    });

  } catch (error) {
    console.error('Error in getSubmissionsByLessonHandler:', error);
    return c.json({ 
      success: false, 
      error: `Failed to get submissions: ${String(error)}` 
    }, 500);
  }
}

// ============================================
// AUTO-SAVE CODE (DRAFT)
// ============================================

export async function autoSaveCodeHandler(c: Context) {
  try {
    const body = await c.req.json();
    const { userId, moduleId, lessonId, code } = body;

    if (!userId || !moduleId || !lessonId || code === undefined) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, 400);
    }

    // Verify authentication
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user || user.id !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    // Save draft
    const draftKey = `draft_${userId}_${moduleId}_${lessonId}`;
    const draftData = {
      code,
      moduleId,
      lessonId,
      lastSaved: new Date().toISOString()
    };

    await kv.set(draftKey, draftData);

    return c.json({
      success: true,
      data: { 
        message: 'Code auto-saved successfully',
        lastSaved: draftData.lastSaved
      }
    });

  } catch (error) {
    console.error('Error in autoSaveCodeHandler:', error);
    return c.json({ 
      success: false, 
      error: `Failed to auto-save code: ${String(error)}` 
    }, 500);
  }
}

// ============================================
// GET DRAFT CODE
// ============================================

export async function getDraftCodeHandler(c: Context) {
  try {
    const userId = c.req.query('userId');
    const moduleId = c.req.query('moduleId');
    const lessonId = c.req.query('lessonId');

    if (!userId || !moduleId || !lessonId) {
      return c.json({ 
        success: false, 
        error: 'Missing required parameters' 
      }, 400);
    }

    // Verify authentication
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user || user.id !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    // Get draft
    const draftKey = `draft_${userId}_${moduleId}_${lessonId}`;
    const draft = await kv.get(draftKey);

    return c.json({
      success: true,
      data: { draft: draft || null }
    });

  } catch (error) {
    console.error('Error in getDraftCodeHandler:', error);
    return c.json({ 
      success: false, 
      error: `Failed to get draft code: ${String(error)}` 
    }, 500);
  }
}