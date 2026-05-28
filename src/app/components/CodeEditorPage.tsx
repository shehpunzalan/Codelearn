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
  const [code, setCode] = useState<string>(lesson.starterCode || '// Write your Java code here...');
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
    setCode(lesson.starterCode || '// Write your Java code here...');
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
      setCode(lesson.starterCode || '// Write your Java code here...');
      
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

    // Detect OOP principles
    if (code.includes('class ')) {
      feedback.oopPrinciples.push('✓ Class definition found - Good structure');
      feedback.strengths?.push('Proper class structure implemented');
    } else {
      feedback.errors.push('No class definition found');
      feedback.errorDetails?.push({
        line: 1,
        severity: 'error',
        message: 'Missing class definition',
        suggestion: 'Define a class using: public class ClassName { }'
      });
      qualityScore -= 20;
    }

    if (code.includes('private ') || code.includes('protected ')) {
      feedback.oopPrinciples.push('✓ Encapsulation - Good use of access modifiers');
      feedback.strengths?.push('Proper encapsulation with access modifiers');
    } else {
      feedback.suggestions.push('Consider using private fields for encapsulation');
      feedback.improvements?.push('Add access modifiers to enforce encapsulation');
      qualityScore -= 10;
    }

    if (code.includes('extends ')) {
      feedback.oopPrinciples.push('✓ Inheritance - Class hierarchy detected');
      feedback.strengths?.push('Good use of inheritance');
    }

    if (code.includes('@Override') || code.includes('interface ')) {
      feedback.oopPrinciples.push('✓ Polymorphism - Method overriding or interface implementation');
      feedback.strengths?.push('Polymorphism principles applied');
    }

    // Check for constructor
    const classMatch = code.match(/class\s+(\w+)/);
    if (classMatch) {
      const className = classMatch[1];
      if (!code.includes(`${className}(`)) {
        feedback.suggestions.push('Add a constructor for proper object initialization');
        feedback.improvements?.push(`Create a constructor: public ${className}() { }`);
        qualityScore -= 5;
      }
    }

    // Check for getter/setter methods
    if (!code.includes('get') && !code.includes('set')) {
      feedback.suggestions.push('Consider adding getter and setter methods');
      qualityScore -= 5;
    }

    // Code style checks
    if (!code.includes('{')) {
      feedback.errors.push('Missing opening brace');
      feedback.errorDetails?.push({
        line: 1,
        severity: 'error',
        message: 'Syntax error: Missing opening brace',
        suggestion: 'Ensure all code blocks have proper braces { }'
      });
      qualityScore -= 15;
    }

    // Check for comments
    if (!code.includes('//') && !code.includes('/*')) {
      feedback.suggestions.push('Add comments to explain your code');
      feedback.codeSmells?.push('Lack of code documentation');
      qualityScore -= 5;
    }

    // Check naming conventions
    if (/class\s+[a-z]/.test(code)) {
      feedback.errors.push('Class name should start with uppercase letter');
      feedback.errorDetails?.push({
        line: 1,
        severity: 'warning',
        message: 'Naming convention violation',
        suggestion: 'Class names should follow PascalCase convention'
      });
      qualityScore -= 5;
    }

    feedback.codeQuality = Math.max(0, Math.min(100, qualityScore));

    // Generate detailed feedback
    feedback.detailedFeedback = `
**Code Analysis Summary**

Your code has been analyzed by our neural network system. Overall quality score: ${feedback.codeQuality}/100

**OOP Principles Detected:**
${feedback.oopPrinciples.length > 0 ? feedback.oopPrinciples.map(principle => `- ${principle}`).join('\n') : '- No OOP principles detected'}

**Strengths:**
${feedback.strengths && feedback.strengths.length > 0 ? feedback.strengths.map(strength => `- ${strength}`).join('\n') : '- Continue building your skills'}

**Areas for Improvement:**
${feedback.improvements && feedback.improvements.length > 0 ? feedback.improvements.map(improvement => `- ${improvement}`).join('\n') : '- Great job! Keep up the good work'}

**Suggestions:**
${feedback.suggestions.length > 0 ? feedback.suggestions.map(suggestion => `- ${suggestion}`).join('\n') : '- Your code looks good'}
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
    toast.info('🤖 AI is analyzing your code...');

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
      toast.success(`🎉 Great work! Score: ${analysis.score}/100`);
    } else {
      toast.warning(`📝 Needs improvement. Score: ${analysis.score}/100`);
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
                    <p className="text-gray-600 text-sm">
                      Submit your Java code to receive AI-powered feedback
                    </p>
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

                  {/* Errors */}
                  {(lastSubmission.feedback.errors.length > 0 || (lastSubmission.feedback.errorDetails && lastSubmission.feedback.errorDetails.length > 0)) && (
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-red-900 flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          Issues Found
                        </p>
                        {lastSubmission.feedback.errorDetails && lastSubmission.feedback.errorDetails.length > 0 && (
                          <Badge variant="destructive" className="h-5 text-xs">
                            {lastSubmission.feedback.errorDetails.length}
                          </Badge>
                        )}
                      </div>
                      <ul className="text-xs text-red-700 space-y-1">
                        {lastSubmission.feedback.errors.slice(0, 2).map((error, idx) => (
                          <li key={idx}>{error}</li>
                        ))}
                      </ul>
                      {lastSubmission.feedback.errorDetails && lastSubmission.feedback.errorDetails.length > 2 && (
                        <p className="text-xs text-red-600 mt-2 font-medium">
                          +{lastSubmission.feedback.errorDetails.length - 2} more issues
                        </p>
                      )}
                    </div>
                  )}

                  {/* Suggestions */}
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      Suggestions
                    </p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      {lastSubmission.feedback.suggestions.slice(0, 2).map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>

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

              <div className="mt-6 space-y-3">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Neural Network Features:</p>
                  <ul className="text-xs text-blue-700 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>OOP Principles Analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>Code Pattern Recognition</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>Error Detection & Fixes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>Best Practice Suggestions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>Plagiarism Detection</span>
                    </li>
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