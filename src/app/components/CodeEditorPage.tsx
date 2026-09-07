import React, { useState, useEffect } from 'react';
import { Module, Lesson } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import Editor from '@monaco-editor/react';
import { 
  ArrowLeft, Brain, Code as CodeIcon, Send, Save, RotateCcw,
  FileText, CheckCircle, AlertCircle, XCircle, Sparkles,
  MessageSquare, Clock
} from 'lucide-react';
import { analyzeJavaCode, compileJavaCode } from '../utils/aiFeedback';
import { saveProgress, saveSubmission, getProgress } from '../utils/storage';
import { submitCode } from '../services/api';
import { submitCode as submitCodeToBackend, autoSaveCode, getDraftCode, getSubmissionsByLesson } from '../services/codeSubmissionApi';
import { toast } from 'sonner';

/**
 * Props interface for CodeEditorPage component
 * Defines the required properties for rendering the code editor
 */
interface CodeEditorPageProps {
  module: Module;              // Current module being studied
  lesson: Lesson;              // Current lesson within the module
  onBack: () => void;          // Callback function to navigate back to lesson
  onViewFeedback: () => void;  // Callback function to view detailed feedback
}

/**
 * Metrics interface to track code statistics
 * Monitors the size and complexity of student code
 */
interface CodeMetrics {
  lines: number;      // Total number of lines in the code
  characters: number; // Total character count in the code
}

/**
 * Performance metrics interface to track student coding activity
 * Helps analyze student engagement and coding patterns
 */
interface PerformanceMetrics {
  startTime: number;      // Timestamp when coding session started
  keystrokes: number;     // Total number of keystrokes made
  timeSpent: number;      // Total time spent in seconds
  typingSpeed: number;    // Words per minute typing speed
  submitAttempts: number; // Number of times code was submitted
}

/**
 * Error detail interface for comprehensive error reporting
 * Provides structured information about code errors
 */
interface ErrorDetail {
  line: number;                    // Line number where error occurred
  severity: 'error' | 'warning';   // Severity level of the issue
  message: string;                 // Error message description
  suggestion: string;              // Suggested fix for the error
}

/**
 * Feedback interface for AI-generated code analysis
 * Contains comprehensive analysis results from the neural network
 */
interface Feedback {
  codeQuality: number;              // Overall code quality score (0-100)
  oopPrinciples: string[];          // List of OOP principles detected
  errors: string[];                 // List of errors found in code
  suggestions: string[];            // Suggestions for improvement
  detailedFeedback: string;         // Detailed markdown feedback
  errorDetails?: ErrorDetail[];     // Detailed error information
  strengths?: string[];             // Code strengths identified
  improvements?: string[];          // Areas needing improvement
  codeSmells?: string[];            // Code smell patterns detected
  securityIssues?: string[];        // Security vulnerabilities found
  performanceIssues?: string[];     // Performance optimization opportunities
}

/**
 * Submission interface for storing code submission records
 * Tracks all student submissions with metadata
 */
interface Submission {
  id: string;                           // Unique submission identifier
  moduleId: string;                     // Associated module ID
  lessonId: string;                     // Associated lesson ID
  code: string;                         // Submitted code content
  feedback: Feedback;                   // AI-generated feedback
  timestamp: string;                    // Submission timestamp (ISO format)
  score: number;                        // Overall score (0-100)
  performanceMetrics?: PerformanceMetrics; // Optional performance data
}

/**
 * CodeEditorPage Component
 * Main component for the Java code editor with AI-powered feedback
 * Provides Monaco editor integration, code analysis, and submission handling
 */
export function CodeEditorPage({ module, lesson, onBack, onViewFeedback }: CodeEditorPageProps) {
  // State management for code content and editor behavior
  const [code, setCode] = useState<string>(lesson.starterCode || 'public class Solution {\n\n    public static void main(String[] args) {\n        \n    }\n\n}');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<Submission | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [codeMetrics, setCodeMetrics] = useState<CodeMetrics>({ lines: 0, characters: 0 });
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    startTime: Date.now(),
    keystrokes: 0,
    timeSpent: 0,
    typingSpeed: 0,
    submitAttempts: 0
  });

  /**
   * Effect: Initialize code editor on component mount
   * Clears any previously saved data to ensure a fresh start for each lesson
   * Dependencies: module.id, lesson.id (runs when switching lessons/modules)
   */
  useEffect(() => {
    // Clear any previously saved code and metrics for this lesson
    localStorage.removeItem(`code_${module.id}_${lesson.id}`);
    localStorage.removeItem(`submission_${module.id}_${lesson.id}`);
    localStorage.removeItem(`performance_${module.id}_${lesson.id}`);
    
    // Reset to starter code provided by the lesson
    setCode(lesson.starterCode || 'public class Solution {\n\n    public static void main(String[] args) {\n        \n    }\n\n}');
    setLastSubmission(null);
    setHasSubmitted(false);
    
    // Reset performance metrics to initial state
    setPerformanceMetrics({
      startTime: Date.now(),
      keystrokes: 0,
      timeSpent: 0,
      typingSpeed: 0,
      submitAttempts: 0
    });
  }, [module.id, lesson.id]);

  /**
   * Effect: Update code metrics whenever code changes
   * Calculates and updates line count and character count
   * Dependencies: code (runs whenever student modifies code)
   */
  useEffect(() => {
    const totalLines = code.split('\n').length;
    const totalCharacters = code.length;
    setCodeMetrics({ lines: totalLines, characters: totalCharacters });
  }, [code]);

  /**
   * Effect: Track performance metrics over time
   * Updates time spent and typing speed every second
   * Dependencies: performanceMetrics.startTime, performanceMetrics.keystrokes
   */
  useEffect(() => {
    // Set up interval to update metrics every second
    const metricsInterval = setInterval(() => {
      const elapsedTimeInSeconds = Math.floor((Date.now() - performanceMetrics.startTime) / 1000);
      const wordsPerMinute = performanceMetrics.keystrokes > 0 
        ? Math.round((performanceMetrics.keystrokes / elapsedTimeInSeconds) * 60) 
        : 0;
      
      setPerformanceMetrics(previousMetrics => ({
        ...previousMetrics,
        timeSpent: elapsedTimeInSeconds,
        typingSpeed: wordsPerMinute
      }));
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(metricsInterval);
  }, [performanceMetrics.startTime, performanceMetrics.keystrokes]);

  /**
   * Handler: Process code changes in the Monaco editor
   * Updates code state and increments keystroke counter
   * @param newValue - The new code value from the editor
   */
  const handleCodeChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      setCode(newValue);
      
      // Increment keystroke counter for performance tracking
      setPerformanceMetrics(previousMetrics => ({
        ...previousMetrics,
        keystrokes: previousMetrics.keystrokes + 1
      }));
    }
  };

  /**
   * Handler: Save current code to local storage
   * Persists both code content and performance metrics
   */
  const handleSaveCode = () => {
    // Save code content to browser local storage
    localStorage.setItem(`code_${module.id}_${lesson.id}`, code);
    localStorage.setItem(`performance_${module.id}_${lesson.id}`, JSON.stringify(performanceMetrics));
    
    // Show success notification to user
    toast.success('💾 Code saved successfully!');
  };

  /**
   * Handler: Reset code to original starter template
   * Clears all progress and restores the initial code
   */
  const handleResetCode = () => {
    // Confirm with user before resetting (destructive action)
    if (confirm('Are you sure you want to reset your code? This will restore the starter code and cannot be undone.')) {
      // Restore starter code from lesson
      setCode(lesson.starterCode || 'public class Solution {\n\n    public static void main(String[] args) {\n        \n    }\n\n}');
      
      // Remove saved code from local storage
      localStorage.removeItem(`code_${module.id}_${lesson.id}`);
      
      // Reset submission state
      setHasSubmitted(false);
      setLastSubmission(null);
      
      // Notify user of successful reset
      toast.info('Code reset to starter template');
    }
  };

  /**
   * Function: Analyze code for OOP principles and quality
   * Manually checks for OOP principles and assigns a quality score
   * @param code - The Java code to analyze
   * @returns Feedback object containing analysis results
   */
  const analyzeCode = (code: string): Feedback => {
    const feedback: Feedback = {
      codeQuality: 70,
      oopPrinciples: [],
      errors: [],
      suggestions: [],
      detailedFeedback: '',
      errorDetails: [],
      strengths: [],
      improvements: [],
      codeSmells: [],
      securityIssues: [],
      performanceIssues: []
    };

    const lines = code.split('\n');
    let qualityScore = 85;

    // ── SYNTAX ERRORS ──────────────────────────────────────────────────────────
    // Java is case-sensitive: `class` must be lowercase, `void`, `int`, etc.
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      const msg = openBraces > closeBraces ? 'Missing closing brace }' : 'Extra closing brace } without matching {';
      feedback.errors.push(`[Syntax] ${msg}`);
      feedback.errorDetails?.push({ line: lines.length, severity: 'error', message: `Syntax error: ${msg}`, suggestion: 'Ensure every opening { has a matching closing }' });
      qualityScore -= 15;
    }

    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      feedback.errors.push('[Syntax] Unmatched parentheses — check method calls and conditions');
      feedback.errorDetails?.push({ line: 1, severity: 'error', message: 'Syntax error: Unmatched parentheses', suggestion: 'Every ( must have a matching )' });
      qualityScore -= 10;
    }

    // Check statements for missing semicolons (lines that look like statements but lack ;)
    const missingSemicolon = lines.some(l => {
      const t = l.trim();
      return t.length > 0 && !t.startsWith('//') && !t.startsWith('*') && !t.startsWith('/*')
        && !t.endsWith('{') && !t.endsWith('}') && !t.endsWith(';')
        && /^(return|int|double|String|boolean|float|long|char|byte|short|this\.|[a-zA-Z_]\w*\s*=)/.test(t);
    });
    if (missingSemicolon) {
      feedback.errors.push('[Syntax] Missing semicolon — Java statements must end with ;');
      feedback.errorDetails?.push({ line: 1, severity: 'error', message: 'Syntax error: Missing semicolon', suggestion: 'End each statement with a semicolon: int x = 5;' });
      qualityScore -= 10;
    }

    // Wrong keyword casing (Java is case-sensitive)
    if (/\bClass\b/.test(code) && !/\bclass\b/.test(code)) {
      feedback.errors.push('[Syntax] "Class" should be lowercase "class" — Java is case-sensitive');
      feedback.errorDetails?.push({ line: 1, severity: 'error', message: 'Syntax error: Invalid keyword "Class"', suggestion: 'Use lowercase: class ClassName { }' });
      qualityScore -= 15;
    }
    if (/\bVoid\b/.test(code)) {
      feedback.errors.push('[Syntax] "Void" should be lowercase "void" — Java is case-sensitive');
      feedback.errorDetails?.push({ line: 1, severity: 'error', message: 'Syntax error: Invalid keyword "Void"', suggestion: 'Use lowercase: public void methodName()' });
      qualityScore -= 10;
    }
    if (/\bPublic\b/.test(code) || /\bPrivate\b/.test(code) || /\bProtected\b/.test(code)) {
      feedback.errors.push('[Syntax] Access modifiers (public/private/protected) must be lowercase — Java is case-sensitive');
      feedback.errorDetails?.push({ line: 1, severity: 'error', message: 'Syntax error: Capitalized access modifier', suggestion: 'Use: public, private, protected (all lowercase)' });
      qualityScore -= 10;
    }
    if (/\bStatic\b/.test(code)) {
      feedback.errors.push('[Syntax] "Static" should be lowercase "static"');
      feedback.errorDetails?.push({ line: 1, severity: 'warning', message: 'Syntax error: "Static" is not a keyword', suggestion: 'Use lowercase: public static void main(String[] args)' });
      qualityScore -= 5;
    }

    // ── SEMANTIC ERRORS ────────────────────────────────────────────────────────
    if (!code.includes('class ')) {
      feedback.errors.push('[Semantic] No class definition found — every Java program needs at least one class');
      feedback.errorDetails?.push({ line: 1, severity: 'error', message: 'Semantic error: Missing class definition', suggestion: 'Define a class using: public class ClassName { }' });
      qualityScore -= 20;
    } else {
      feedback.oopPrinciples.push('✓ Class definition found');
      feedback.strengths?.push('Proper class structure implemented');

      const classMatch = code.match(/class\s+([A-Z][a-zA-Z0-9_]*)/);
      if (!classMatch) {
        feedback.errors.push('[Semantic] Class name does not follow PascalCase — must start with an uppercase letter');
        feedback.errorDetails?.push({ line: 1, severity: 'error', message: 'Semantic error: Invalid class name', suggestion: 'Class names must start with uppercase: class MyClass { }' });
        qualityScore -= 10;
      } else {
        const className = classMatch[1];
        if (!code.includes(`${className}(`)) {
          feedback.suggestions.push(`[Semantic] No constructor found for ${className} — add: public ${className}() { }`);
          feedback.improvements?.push(`Create a constructor: public ${className}() { }`);
          qualityScore -= 5;
        }
      }
    }

    if (code.includes('private ') || code.includes('protected ')) {
      feedback.oopPrinciples.push('✓ Encapsulation — access modifiers present');
      feedback.strengths?.push('Proper encapsulation with access modifiers');
    } else if (code.includes('class ')) {
      feedback.suggestions.push('[Semantic] Fields should be private — expose them via getters/setters');
      feedback.improvements?.push('Declare fields as private: private int age;');
      qualityScore -= 10;
    }

    if (code.includes('extends ')) {
      feedback.oopPrinciples.push('✓ Inheritance — class hierarchy detected');
      feedback.strengths?.push('Good use of inheritance');
    }
    if (code.includes('@Override') || code.includes('interface ')) {
      feedback.oopPrinciples.push('✓ Polymorphism — method overriding or interface implementation');
      feedback.strengths?.push('Polymorphism principles applied');
    }

    // ── LOGICAL ERRORS ─────────────────────────────────────────────────────────
    // Unreachable code after return
    lines.forEach((line, idx) => {
      const t = line.trim();
      if (t.startsWith('return ') || t === 'return;') {
        const next = lines[idx + 1]?.trim();
        if (next && next.length > 0 && !next.startsWith('}') && !next.startsWith('//')) {
          feedback.errors.push(`[Logical] Unreachable code after return on line ${idx + 1}`);
          feedback.errorDetails?.push({ line: idx + 2, severity: 'warning', message: 'Logical error: Unreachable code after return', suggestion: 'Remove or restructure code after the return statement' });
          qualityScore -= 5;
        }
      }
      // Empty catch block
      if (t === 'catch' || /catch\s*\(/.test(t)) {
        const catchBody = lines[idx + 1]?.trim();
        if (catchBody === '}') {
          feedback.errors.push(`[Logical] Empty catch block on line ${idx + 1} — exceptions are silently swallowed`);
          feedback.errorDetails?.push({ line: idx + 1, severity: 'warning', message: 'Logical error: Empty catch block', suggestion: 'Handle exceptions: catch (Exception e) { e.printStackTrace(); }' });
          qualityScore -= 5;
        }
      }
    });

    // Comparison using = instead of ==
    if (/if\s*\([^)]*=[^=>][^)]*\)/.test(code)) {
      feedback.errors.push('[Logical] Possible assignment (=) inside if condition — did you mean == for comparison?');
      feedback.errorDetails?.push({ line: 1, severity: 'warning', message: 'Logical error: Assignment in condition', suggestion: 'Use == for comparison: if (x == 5)' });
      qualityScore -= 8;
    }

    // ── CODE STYLE ─────────────────────────────────────────────────────────────
    if (!code.includes('//') && !code.includes('/*')) {
      feedback.suggestions.push('Add comments to explain your code');
      feedback.codeSmells?.push('No code documentation');
      qualityScore -= 5;
    }
    if (!code.includes('get') && !code.includes('set') && code.includes('private ')) {
      feedback.suggestions.push('Consider adding getter/setter methods for private fields');
      qualityScore -= 5;
    }

    feedback.codeQuality = Math.max(0, Math.min(100, qualityScore));

    const syntaxErrors = feedback.errorDetails?.filter(e => e.message.startsWith('Syntax')) || [];
    const semanticErrors = feedback.errorDetails?.filter(e => e.message.startsWith('Semantic')) || [];
    const logicalErrors = feedback.errorDetails?.filter(e => e.message.startsWith('Logical')) || [];

    feedback.detailedFeedback = `
**Code Analysis Summary**

Quality score: ${feedback.codeQuality}/100 | Java is case-sensitive — keywords must be exact.

**Syntax Errors (${syntaxErrors.length}):**
${syntaxErrors.length > 0 ? syntaxErrors.map(e => `- ${e.message}\n  → ${e.suggestion}`).join('\n') : '- None detected ✓'}

**Semantic Errors (${semanticErrors.length}):**
${semanticErrors.length > 0 ? semanticErrors.map(e => `- ${e.message}\n  → ${e.suggestion}`).join('\n') : '- None detected ✓'}

**Logical Errors (${logicalErrors.length}):**
${logicalErrors.length > 0 ? logicalErrors.map(e => `- ${e.message}\n  → ${e.suggestion}`).join('\n') : '- None detected ✓'}

**OOP Principles Detected:**
${feedback.oopPrinciples.length > 0 ? feedback.oopPrinciples.map(p => `- ${p}`).join('\n') : '- No OOP principles detected'}

**Suggestions:**
${feedback.suggestions.length > 0 ? feedback.suggestions.map(s => `- ${s}`).join('\n') : '- Code looks good!'}
    `.trim();

    return feedback;
  };

  /**
   * Handler: Submit code for AI analysis and feedback
   * Compiles code, analyzes with AI, and saves submission details
   */
  const handleSubmit = async () => {
    // Get current user
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      toast.error('Please log in to submit code');
      return;
    }

    const user = JSON.parse(currentUser);
    setIsSubmitting(true);
    toast.info('Checking your code...');

    // Update submit attempts
    const updatedMetrics = {
      ...performanceMetrics,
      submitAttempts: performanceMetrics.submitAttempts + 1
    };
    setPerformanceMetrics(updatedMetrics);

    // Simulate AI analysis time
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Step 1: Compile code
    const compilationResult = compileJavaCode(code);
    
    if (!compilationResult.success) {
      toast.error('Compilation failed! Check your code for errors.');
      setIsSubmitting(false);
      
      // Still create a submission for failed attempts
      const failedFeedback: Feedback = {
        codeQuality: 30,
        oopPrinciples: [],
        errors: compilationResult.errors,
        suggestions: ['Fix compilation errors before resubmitting'],
        detailedFeedback: `**Compilation Failed**\n\n${compilationResult.errors.join('\n')}\n\nPlease fix these errors and try again.`,
        errorDetails: compilationResult.errors.map((err, idx) => ({
          line: idx + 1,
          severity: 'error' as const,
          message: err,
          suggestion: 'Review the error message and fix the syntax'
        }))
      };

      const failedSubmission: Submission = {
        id: `${module.id}_${lesson.id}_${Date.now()}`,
        moduleId: module.id,
        lessonId: lesson.id,
        code,
        feedback: failedFeedback,
        timestamp: new Date().toISOString(),
        score: 30,
        performanceMetrics: updatedMetrics
      };

      setLastSubmission(failedSubmission);
      setHasSubmitted(true);
      
      // Save to storage
      saveSubmission({
        id: failedSubmission.id,
        userId: user.id,
        moduleId: module.id,
        lessonId: lesson.id,
        code,
        timestamp: new Date().toISOString(),
        score: 30,
        feedback: failedFeedback.detailedFeedback,
        errors: compilationResult.errors,
        passed: false
      });

      return;
    }

    toast.success('✓ Code compiled successfully!');

    // Step 2: Analyze code with AI
    const analysis = analyzeJavaCode(code, lesson.title);
    
    const feedback: Feedback = {
      codeQuality: analysis.score,
      oopPrinciples: analysis.detectedPatterns,
      errors: analysis.errors,
      suggestions: analysis.suggestions,
      detailedFeedback: analysis.feedback,
      strengths: analysis.strengths,
      improvements: analysis.warnings,
      errorDetails: analysis.errors.map((err, idx) => ({
        line: idx + 1,
        severity: 'error' as const,
        message: err,
        suggestion: 'Review the OOP principles for this lesson'
      }))
    };
    
    const submission: Submission = {
      id: `${module.id}_${lesson.id}_${Date.now()}`,
      moduleId: module.id,
      lessonId: lesson.id,
      code,
      feedback,
      timestamp: new Date().toISOString(),
      score: analysis.score,
      performanceMetrics: updatedMetrics
    };

    // Save code
    localStorage.setItem(`code_${module.id}_${lesson.id}`, code);
    localStorage.setItem(`submission_${module.id}_${lesson.id}`, JSON.stringify(submission));
    localStorage.setItem(`performance_${module.id}_${lesson.id}`, JSON.stringify(updatedMetrics));

    // Save to backend server via API (optional - falls back to local storage)
    try {
      const backendResult = await submitCode({
        userId: user.id,
        moduleId: module.id,
        lessonId: lesson.id,
        code,
        assignmentId: lesson.id
      });

      if (backendResult.success) {
        console.log('✓ Backend submission successful');
      }
    } catch (error) {
      // Backend is optional - local storage is the primary storage
      console.log('Backend unavailable, using local storage');
    }

    // Save to central storage (localStorage fallback)
    saveSubmission({
      id: submission.id,
      userId: user.id,
      moduleId: module.id,
      lessonId: lesson.id,
      code,
      timestamp: new Date().toISOString(),
      score: analysis.score,
      feedback: analysis.feedback,
      errors: analysis.errors,
      passed: analysis.passed
    });

    // Save to allSubmissions for FeedbackPage
    const allSubmissions = JSON.parse(localStorage.getItem('allSubmissions') || '[]');
    const feedbackSubmission = {
      code,
      timestamp: new Date().toISOString(),
      lessonId: lesson.id,
      moduleId: module.id,
      score: analysis.score,
      feedback: {
        oopPrinciples: analysis.detectedPatterns,
        errors: analysis.errors,
        suggestions: analysis.suggestions,
        codeQuality: analysis.score
      }
    };
    allSubmissions.unshift(feedbackSubmission); // Add to beginning of array
    localStorage.setItem('allSubmissions', JSON.stringify(allSubmissions));

    // Save progress
    saveProgress({
      userId: user.id,
      moduleId: module.id,
      lessonId: lesson.id,
      completed: analysis.passed,
      score: analysis.score,
      attempts: updatedMetrics.submitAttempts,
      lastAttempt: new Date().toISOString(),
      code,
      feedback: analysis.feedback,
      timeSpent: updatedMetrics.timeSpent
    });

    setLastSubmission(submission);
    setHasSubmitted(true);
    setIsSubmitting(false);

    if (analysis.passed) {
      toast.success(`Great job! Score: ${analysis.score}/100 — keep it up!`);
    } else {
      toast.warning(`Score: ${analysis.score}/100 — check the feedback below and try again.`);
    }
  };

  /**
   * Function: Determine color based on code quality score
   * Assigns color for visual representation of code quality
   * @param score - The code quality score (0-100)
   * @returns CSS class name for text color
   */
  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  /**
   * Function: Determine icon based on code quality score
   * Assigns icon for visual representation of code quality
   * @param score - The code quality score (0-100)
   * @returns SVG icon element
   */
  const getQualityIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5" />;
    if (score >= 60) return <AlertCircle className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };

  /**
   * Function: Format time in minutes and seconds
   * Converts total seconds into a formatted time string
   * @param seconds - Total time in seconds
   * @returns Formatted time string (MM:SS)
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lesson
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-blue-600 text-white">{module.title}</Badge>
              <Badge variant="outline">{lesson.title}</Badge>
              {hasSubmitted && (
                <Badge className="bg-green-600 text-white">
                  <Clock className="w-3 h-3 mr-1" />
                  Submitted
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Java Code Editor</h1>
            <p className="text-gray-600 mt-1">{lesson.content.practiceExercise}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Code Editor */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CodeIcon className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-900">Java Code Editor</h2>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveCode}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    onClick={handleResetCode}
                    variant="outline"
                    size="sm"
                    className="text-gray-600 border-gray-300 hover:bg-gray-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {module.title} - {lesson.title}
                </Badge>
              </div>

              <div className="border rounded-lg overflow-hidden bg-gray-900">
                <Editor
                  height="500px"
                  defaultLanguage="java"
                  value={code}
                  onChange={handleCodeChange}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 4,
                    padding: { top: 16, bottom: 16 }
                  }}
                />
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-4 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing your code with AI...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit for AI Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Analysis Panel */}
        <div>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">AI Analysis</h2>
              </div>

              {!hasSubmitted || !lastSubmission ? (
                <div className="flex items-center justify-center h-64 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
                  <div className="text-center p-4">
                    <Brain className="w-16 h-16 text-purple-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm font-medium">Submit your code to get feedback</p>
                    <p className="text-gray-500 text-xs mt-1">We will check your code and tell you what to fix.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Score Display */}
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border-2 border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Code Quality Score</span>
                      <div className={`flex items-center gap-1 font-bold text-xl ${getQualityColor(lastSubmission.feedback.codeQuality)}`}>
                        {getQualityIcon(lastSubmission.feedback.codeQuality)}
                        {lastSubmission.feedback.codeQuality}/100
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          lastSubmission.feedback.codeQuality >= 80 ? 'bg-green-500' :
                          lastSubmission.feedback.codeQuality >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${lastSubmission.feedback.codeQuality}%` }}
                      />
                    </div>
                  </div>

                  {/* OOP Principles */}
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <p className="text-xs font-semibold text-green-900 mb-2 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      OOP Analysis
                    </p>
                    <ul className="text-xs text-green-700 space-y-1">
                      {lastSubmission.feedback.oopPrinciples.slice(0, 3).map((principle, idx) => (
                        <li key={idx}>{principle}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Errors — always visible if present */}
                  {lastSubmission.feedback.errors.length > 0 ? (
                    <div className="bg-red-50 rounded-lg p-3 border border-red-300">
                      <p className="text-xs font-bold text-red-900 mb-2 flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Problems in Your Code ({lastSubmission.feedback.errors.length})
                      </p>
                      <ul className="text-xs text-red-800 space-y-1.5">
                        {lastSubmission.feedback.errors.map((error, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <p className="text-xs font-bold text-green-800 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        No errors found — great!
                      </p>
                    </div>
                  )}

                  {/* Suggestions — always visible */}
                  {lastSubmission.feedback.suggestions.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <p className="text-xs font-bold text-blue-900 mb-2 flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        How to Improve Your Code
                      </p>
                      <ul className="text-xs text-blue-800 space-y-1.5">
                        {lastSubmission.feedback.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-blue-400 mt-0.5">→</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    onClick={onViewFeedback}
                    variant="outline"
                    className="w-full text-purple-600 border-purple-300 hover:bg-purple-50"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Detailed Feedback
                  </Button>
                </div>
              )}

              <div className="mt-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-2">What the checker looks for:</p>
                  <ul className="text-xs text-blue-700 space-y-1.5">
                    <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" /><span>Are you using classes, objects, and methods?</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" /><span>Are there any syntax or logic errors?</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" /><span>Are you following Java coding style?</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" /><span>Can your code be improved or simplified?</span></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}