import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import {
  BookOpen, ChevronRight, ChevronLeft, CheckCircle, PlayCircle,
  Code, FileText, Award, Clock, Target, Star, Trophy,
  Lightbulb, Brain, Zap, TrendingUp, MessageSquare, Download,
  ArrowLeft, Circle, Eye, EyeOff, AlertCircle, XCircle, ThumbsUp,
  ChevronUp, ChevronDown, AlertTriangle, Timer, Keyboard, Activity,
  CalendarDays
} from 'lucide-react';
import { EnhancedLearningDelivery } from './EnhancedLearningDelivery';
import { GameFormQuiz } from './GameFormQuiz';
import { QuizResultsPage } from './QuizResultsPage';
import { toast } from 'sonner';
import { comprehensiveLessonsContent } from '../data/comprehensiveLessonsContent';
import type { Module } from '../types';

interface LessonViewerProps {
  module: Module;
  onBack: () => void;
  onViewFeedback?: (lessonId?: string) => void;
  onStartCoding: (moduleId: string, lessonId: string) => void;
  initialLessonId?: string;
  onOpenVideoTutorial?: (moduleId: string, lessonId: string, lessonTitle: string) => void;
  onOpenReadingContent?: (moduleId: string, lessonId: string, lessonTitle: string, lessonContent: any) => void;
  onOpenAudioLecture?: (moduleId: string, lessonId: string, lessonTitle: string, lessonContent: any) => void;
  onOpenInteractiveGame?: (moduleId: string, lessonId: string, lessonTitle: string, lessonContent: any) => void;
}

interface ErrorDetail {
  type: 'syntax' | 'logic' | 'oop' | 'style';
  message: string;
  line?: number;
  severity: 'error' | 'warning';
  suggestion: string;
}

interface SubmissionData {
  code: string;
  timestamp: string;
  lessonId: string;
  moduleId: string;
  score: number;
  feedback: {
    oopPrinciples: string[];
    errors: string[];
    errorDetails?: ErrorDetail[];
    suggestions: string[];
    codeQuality: number;
  };
  performanceMetrics?: {
    timeSpent: number;
    keystrokes: number;
    submitAttempts: number;
  };
}

interface PerformanceMetrics {
  sessionStartTime: number;
  totalTimeSpent: number;
  keystrokes: number;
  codeChanges: number;
  submitAttempts: number;
  averageTypingSpeed: number;
}

interface LessonPerformance {
  lessonId: string;
  timeSpent: number;
  score: number;
  attempts: number;
  completedAt?: string;
}

export function LessonViewer({ module, onBack, onViewFeedback, onStartCoding, onOpenVideoTutorial, onOpenReadingContent, onOpenAudioLecture, onOpenInteractiveGame, initialLessonId }: LessonViewerProps) {
  const [viewMode, setViewMode] = useState<'lessons' | 'feedback'>('lessons');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(initialLessonId ?? null);
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitSection, setShowSubmitSection] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<SubmissionData | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [codeMetrics, setCodeMetrics] = useState({ lines: 0, characters: 0 });
  const [allSubmissions, setAllSubmissions] = useState<SubmissionData[]>([]);
  const [expandedErrors, setExpandedErrors] = useState<{ [key: string]: boolean }>({});
  
  // Performance Monitoring States
  const [showPerformancePanel, setShowPerformancePanel] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    sessionStartTime: Date.now(),
    totalTimeSpent: 0,
    keystrokes: 0,
    codeChanges: 0,
    submitAttempts: 0,
    averageTypingSpeed: 0
  });
  const [lessonPerformance, setLessonPerformance] = useState<LessonPerformance[]>([]);
  const [currentSessionTime, setCurrentSessionTime] = useState(0);
  const sessionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const keystrokeTimestamps = useRef<number[]>([]);
  
  // Learning Path Navigator State
  const [activeSection, setActiveSection] = useState<number>(1);
  const sectionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  
  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizStats, setQuizStats] = useState<any>(null);
  
  const selectedLesson = module.lessons.find(l => l.id === selectedLessonId);

  // Track session time
  useEffect(() => {
    sessionIntervalRef.current = setInterval(() => {
      setCurrentSessionTime(Date.now() - performanceMetrics.sessionStartTime);
    }, 1000);

    return () => {
      if (sessionIntervalRef.current) {
        clearInterval(sessionIntervalRef.current);
      }
    };
  }, [performanceMetrics.sessionStartTime]);

  // Load saved code and completion status from localStorage
  useEffect(() => {
    if (selectedLessonId) {
      const savedCode = localStorage.getItem(`code_${module.id}_${selectedLessonId}`);
      const savedSubmission = localStorage.getItem(`submission_${module.id}_${selectedLessonId}`);
      const savedCompletions = localStorage.getItem(`completedLessons_${module.id}`);
      const savedPerformance = localStorage.getItem(`lessonPerformance_${module.id}`);
      
      if (savedCode) {
        setCode(savedCode);
      } else {
        setCode(`public class Solution {\n\n    public static void main(String[] args) {\n        \n    }\n\n}`);
      }

      if (savedSubmission) {
        const submission = JSON.parse(savedSubmission);
        setLastSubmission(submission);
        setHasSubmitted(true);
      } else {
        setLastSubmission(null);
        setHasSubmitted(false);
      }

      if (savedCompletions) {
        setCompletedLessons(new Set(JSON.parse(savedCompletions)));
      }

      if (savedPerformance) {
        setLessonPerformance(JSON.parse(savedPerformance));
      }

      // Reset performance metrics for new lesson
      setPerformanceMetrics({
        sessionStartTime: Date.now(),
        totalTimeSpent: 0,
        keystrokes: 0,
        codeChanges: 0,
        submitAttempts: 0,
        averageTypingSpeed: 0
      });
      keystrokeTimestamps.current = [];
    }
  }, [selectedLessonId, module.id, module.title, selectedLesson?.title]);

  // Update code metrics and track keystrokes
  useEffect(() => {
    const lines = code.split('\n').length;
    const characters = code.length;
    setCodeMetrics({ lines, characters });

    // Track code changes
    setPerformanceMetrics(prev => ({
      ...prev,
      codeChanges: prev.codeChanges + 1
    }));
  }, [code]);

  // Load all submissions for this module
  useEffect(() => {
    const allSubmissionsData = localStorage.getItem('allSubmissions');
    if (allSubmissionsData) {
      const submissions: SubmissionData[] = JSON.parse(allSubmissionsData);
      const moduleSubmissions = submissions.filter(s => s.moduleId === module.id);
      setAllSubmissions(moduleSubmissions);
    }
  }, [module.id, hasSubmitted]);

  // Track keystroke with typing speed calculation
  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    
    // Track keystroke
    const now = Date.now();
    keystrokeTimestamps.current.push(now);
    
    // Keep only last 60 seconds of keystrokes for typing speed
    keystrokeTimestamps.current = keystrokeTimestamps.current.filter(
      timestamp => now - timestamp < 60000
    );
    
    // Calculate typing speed (characters per minute)
    const typingSpeed = keystrokeTimestamps.current.length;
    
    setPerformanceMetrics(prev => ({
      ...prev,
      keystrokes: prev.keystrokes + 1,
      averageTypingSpeed: typingSpeed
    }));
  };

  // Save code to localStorage
  const handleSaveCode = () => {
    if (selectedLessonId) {
      localStorage.setItem(`code_${module.id}_${selectedLessonId}`, code);
      toast.success('Code saved successfully!', {
        description: 'Your progress has been saved.',
      });
    }
  };

  // Reset code to default
  const handleResetCode = () => {
    const defaultCode = `public class Solution {\n\n    public static void main(String[] args) {\n        \n    }\n\n}`;
    setCode(defaultCode);
    toast.info('Code reset to default template');
  };

  // Generate mock AI feedback
  const generateMockFeedback = (submittedCode: string) => {
    const hasClass = /class\s+\w+/.test(submittedCode);
    const hasMethod = /public\s+\w+\s+\w+\(/.test(submittedCode);
    const hasPrivate = /private\s+/.test(submittedCode);
    const hasConstructor = /public\s+\w+\s*\(/.test(submittedCode);
    const hasComments = /\/\/|\/\*/.test(submittedCode);
    const codeLength = submittedCode.length;

    const oopPrinciples = [];
    const errors = [];
    const suggestions = [];
    let score = 60;

    // OOP Principles Analysis
    if (hasClass) {
      oopPrinciples.push('✓ Class definition found - Good structure');
      score += 10;
    } else {
      errors.push('✗ No class definition found');
    }

    if (hasPrivate) {
      oopPrinciples.push('✓ Encapsulation: Private members detected');
      score += 10;
    } else {
      suggestions.push('→ Consider using private fields for encapsulation');
    }

    if (hasMethod) {
      oopPrinciples.push('✓ Methods defined - Good code organization');
      score += 10;
    }

    if (hasConstructor) {
      oopPrinciples.push('✓ Constructor found - Proper object initialization');
      score += 5;
    } else {
      suggestions.push('→ Add a constructor for proper object initialization');
    }

    if (hasComments) {
      oopPrinciples.push('✓ Code documentation present');
      score += 5;
    } else {
      suggestions.push('→ Add comments to explain your code logic');
    }

    // Code Quality Analysis
    if (codeLength < 50) {
      errors.push('✗ Code seems incomplete or too short');
      score -= 10;
    } else if (codeLength > 500) {
      oopPrinciples.push('✓ Comprehensive implementation detected');
    }

    if (!/\s{4}/.test(submittedCode) && !/\t/.test(submittedCode)) {
      suggestions.push('→ Use consistent indentation (4 spaces or tabs)');
    } else {
      oopPrinciples.push('✓ Proper code formatting detected');
    }

    // Additional suggestions based on common patterns
    if (!/toString\(\)/.test(submittedCode)) {
      suggestions.push('→ Consider overriding toString() method for better object representation');
    }

    if (!/equals\(/.test(submittedCode) && hasClass) {
      suggestions.push('→ Consider implementing equals() method for object comparison');
    }

    // Generate detailed error information
    const errorDetails: ErrorDetail[] = [];
    
    if (!hasClass) {
      errorDetails.push({
        type: 'syntax',
        message: 'Missing class definition',
        severity: 'error',
        suggestion: 'Every Java program must have at least one class. Add a class definition like: public class ClassName { ... }'
      });
    }

    if (codeLength < 50) {
      errorDetails.push({
        type: 'logic',
        message: 'Incomplete implementation detected',
        severity: 'warning',
        suggestion: 'Your code appears to be incomplete. Make sure to implement all required methods and logic for this lesson.'
      });
    }

    if (!hasPrivate && hasClass) {
      errorDetails.push({
        type: 'oop',
        message: 'Missing encapsulation - No private fields detected',
        severity: 'warning',
        suggestion: 'Use private access modifiers for class fields to implement proper encapsulation. Example: private String name;'
      });
    }

    if (!hasConstructor && hasClass) {
      errorDetails.push({
        type: 'oop',
        message: 'No constructor found',
        severity: 'warning',
        suggestion: 'Add a constructor to initialize object state. Example: public ClassName(String param) { this.field = param; }'
      });
    }

    if (!hasComments) {
      errorDetails.push({
        type: 'style',
        message: 'Missing code documentation',
        severity: 'warning',
        suggestion: 'Add JavaDoc comments to document your classes and methods. Example: /** This method calculates... */'
      });
    }

    return {
      oopPrinciples: oopPrinciples.length > 0 ? oopPrinciples : ['No OOP principles detected yet'],
      errors: errors.length > 0 ? errors : [],
      errorDetails: errorDetails.length > 0 ? errorDetails : [],
      suggestions: suggestions.length > 0 ? suggestions : ['Great job! Keep up the good work.'],
      codeQuality: Math.min(Math.max(score, 0), 100),
    };
  };

  const handleSubmit = () => {
    // Validate code
    if (!code || code.trim().length < 20) {
      toast.error('Code is too short', {
        description: 'Please write a meaningful solution before submitting.',
      });
      return;
    }

    if (code === `public class Solution {\n\n    public static void main(String[] args) {\n        \n    }\n\n}`) {
      toast.error('Default template detected', {
        description: 'Please modify the code template before submitting.',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Track submit attempt
    setPerformanceMetrics(prev => ({
      ...prev,
      submitAttempts: prev.submitAttempts + 1
    }));
    
    // Simulate AI analysis
    setTimeout(() => {
      const feedback = generateMockFeedback(code);
      const timeSpent = Math.floor((Date.now() - performanceMetrics.sessionStartTime) / 1000);
      
      const submission: SubmissionData = {
        code,
        timestamp: new Date().toISOString(),
        lessonId: selectedLessonId!,
        moduleId: module.id,
        score: feedback.codeQuality,
        feedback,
        performanceMetrics: {
          timeSpent,
          keystrokes: performanceMetrics.keystrokes,
          submitAttempts: performanceMetrics.submitAttempts
        }
      };

      // Save submission
      localStorage.setItem(`submission_${module.id}_${selectedLessonId}`, JSON.stringify(submission));
      
      // Save all submissions history
      const allSubmissions = JSON.parse(localStorage.getItem('allSubmissions') || '[]');
      allSubmissions.unshift(submission);
      localStorage.setItem('allSubmissions', JSON.stringify(allSubmissions.slice(0, 20))); // Keep last 20

      // Update lesson performance
      const newPerformance: LessonPerformance = {
        lessonId: selectedLessonId!,
        timeSpent,
        score: feedback.codeQuality,
        attempts: performanceMetrics.submitAttempts,
        completedAt: feedback.codeQuality >= 70 ? new Date().toISOString() : undefined
      };

      const updatedLessonPerformance = [
        ...lessonPerformance.filter(lp => lp.lessonId !== selectedLessonId),
        newPerformance
      ];
      setLessonPerformance(updatedLessonPerformance);
      localStorage.setItem(`lessonPerformance_${module.id}`, JSON.stringify(updatedLessonPerformance));

      // Mark lesson as completed if score is good
      if (feedback.codeQuality >= 70) {
        const newCompletedLessons = new Set(completedLessons);
        newCompletedLessons.add(selectedLessonId!);
        setCompletedLessons(newCompletedLessons);
        localStorage.setItem(`completedLessons_${module.id}`, JSON.stringify([...newCompletedLessons]));
        
        toast.success('🎉 Lesson Completed!', {
          description: `Excellent work! Score: ${feedback.codeQuality}/100`,
        });
      } else {
        toast.success('Code submitted successfully!', {
          description: `AI Analysis complete. Score: ${feedback.codeQuality}/100`,
        });
      }

      setLastSubmission(submission);
      setHasSubmitted(true);
      setIsSubmitting(false);
    }, 2000);
  };

  const handleViewFullFeedback = () => {
    if (onViewFeedback) {
      onViewFeedback(selectedLessonId ?? undefined);
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5" />;
    if (score >= 60) return <AlertCircle className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };

  const getErrorTypeColor = (type: string) => {
    switch (type) {
      case 'syntax': return 'bg-red-100 text-red-700 border-red-300';
      case 'logic': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'oop': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'style': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // Format time in minutes and seconds
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate module progress statistics
  const calculateModuleProgress = () => {
    const completedCount = completedLessons.size;
    const totalLessons = module.lessons.length;
    const progressPercentage = Math.round((completedCount / totalLessons) * 100);
    
    const averageScore = lessonPerformance.length > 0
      ? Math.round(lessonPerformance.reduce((sum, lp) => sum + lp.score, 0) / lessonPerformance.length)
      : 0;
    
    const totalTime = lessonPerformance.reduce((sum, lp) => sum + lp.timeSpent, 0);
    
    return {
      completedCount,
      totalLessons,
      progressPercentage,
      averageScore,
      totalTime
    };
  };

  const moduleProgress = calculateModuleProgress();

  // Scroll to section function
  const scrollToSection = (sectionNumber: number) => {
    const element = sectionRefs.current[sectionNumber];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionNumber);
      toast.info(`Navigating to section ${sectionNumber}`);
    }
  };

  // Prepare chart data for performance trends
  const performanceChartData = lessonPerformance
    .slice(0, 6)
    .reverse()
    .map((lp, index) => {
      const lesson = module.lessons.find(l => l.id === lp.lessonId);
      return {
        name: `L${index + 1}`,
        score: lp.score,
        time: Math.round(lp.timeSpent / 60), // Convert to minutes
        attempts: lp.attempts
      };
    });

  // Quiz handlers
  const handleQuizComplete = (stats: any) => {
    setQuizStats(stats);
    setShowQuiz(false);
    setShowQuizResults(true);
    
    // Save quiz results
    const quizData = {
      lessonId: selectedLessonId,
      moduleId: module.id,
      stats,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(`quiz_${module.id}_${selectedLessonId}`, JSON.stringify(quizData));
    
    // Mark lesson as completed if passed
    if (stats.accuracy >= 70) {
      const newCompleted = new Set(completedLessons);
      newCompleted.add(selectedLessonId!);
      setCompletedLessons(newCompleted);
      localStorage.setItem(`completedLessons_${module.id}`, JSON.stringify([...newCompleted]));
    }
  };

  const handleRetryQuiz = () => {
    setShowQuizResults(false);
    setShowQuiz(true);
    setQuizStats(null);
  };

  const handleContinueLearning = () => {
    setShowQuizResults(false);
    const currentIndex = module.lessons.findIndex(l => l.id === selectedLessonId);
    if (currentIndex < module.lessons.length - 1) {
      setSelectedLessonId(module.lessons[currentIndex + 1].id);
      toast.success('🎓 Moving to next lesson!');
    } else {
      toast.success('🎉 Module completed!');
    }
  };

  const handleBackToLesson = () => {
    setShowQuizResults(false);
    setShowQuiz(false);
  };

  // Show quiz modal
  if (showQuiz && selectedLesson?.content.quiz) {
    return (
      <div className="fixed inset-0 z-50 overflow-auto">
        <GameFormQuiz
          questions={selectedLesson.content.quiz}
          onComplete={handleQuizComplete}
          lessonTitle={selectedLesson.title}
        />
      </div>
    );
  }

  // Show quiz results
  if (showQuizResults && quizStats) {
    return (
      <div className="fixed inset-0 z-50 overflow-auto">
        <QuizResultsPage
          stats={quizStats}
          onRetry={handleRetryQuiz}
          onContinue={handleContinueLearning}
          onBackToLesson={handleBackToLesson}
          lessonTitle={selectedLesson?.title}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Modules
      </Button>

      <div className="flex items-center gap-3 mb-4">
        <Badge className="bg-blue-600 text-white">Module {module.id.replace('mod', '')}</Badge>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{module.title}</h1>
          <p className="text-gray-600">{module.description}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPerformancePanel(!showPerformancePanel)}
          className="border-purple-300 text-purple-600 hover:bg-purple-50"
        >
          {showPerformancePanel ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
          {showPerformancePanel ? 'Hide' : 'Show'} Module Progress
        </Button>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2 border-b border-gray-200 mb-4">
        <button
          onClick={() => setViewMode('lessons')}
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            viewMode === 'lessons'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Lessons
        </button>
        <button
          onClick={() => setViewMode('feedback')}
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            viewMode === 'feedback'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          My Feedback ({allSubmissions.length})
        </button>
      </div>

      {viewMode === 'lessons' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lessons Sidebar */}
          <Card className="border-0 shadow-md lg:col-span-1">
            <CardContent className="p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Lessons</h2>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-2">
                {module.lessons.map((lesson, index) => {
                  const isCompleted = completedLessons.has(lesson.id);
                  const performance = lessonPerformance.find(lp => lp.lessonId === lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setSelectedLessonId(lesson.id);
                        setShowSubmitSection(false);
                      }}
                      disabled={lesson.locked}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedLessonId === lesson.id
                          ? 'border-blue-500 bg-blue-50'
                          : lesson.locked
                          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">Lesson {index + 1}</p>
                          <p className="font-medium text-sm text-gray-900 truncate">{lesson.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{lesson.duration}</p>
                          {performance && (
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs bg-green-50 border-green-300 text-green-700">
                                {performance.score}%
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className={showPerformancePanel ? "lg:col-span-2" : "lg:col-span-3"}>
          {selectedLesson ? (
            <div className="space-y-6">
              {/* Section 2: Core Concepts Explained - Modern Learning Delivery System */}
              <div ref={(el) => {sectionRefs.current[2] = el;}}>
                <EnhancedLearningDelivery
                  moduleId={module.id}
                  lessonId={selectedLesson.id}
                  lessonTitle={selectedLesson.title}
                  lessonContent={selectedLesson.content}
                  onStartCoding={onStartCoding}
                  onOpenVideoTutorial={onOpenVideoTutorial}
                  onOpenReadingContent={onOpenReadingContent}
                  onOpenAudioLecture={onOpenAudioLecture}
                  onOpenInteractiveGame={onOpenInteractiveGame}
                  onComplete={() => {
                    const newCompleted = new Set(completedLessons);
                    newCompleted.add(selectedLesson.id);
                    setCompletedLessons(newCompleted);
                    localStorage.setItem(`completedLessons_${module.id}`, JSON.stringify([...newCompleted]));
                    toast.success('🎉 Lesson Completed!');
                  }}
                />
              </div>

              {/* Section 3: Real-World Examples */}
              <div ref={(el) => {sectionRefs.current[3] = el;}}>
                {selectedLesson.content.realWorldExamples && selectedLesson.content.realWorldExamples.length > 0 && (
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-6 h-6 text-yellow-600" />
                        Real-World Applications
                      </h3>
                      <div className="space-y-3">
                        {selectedLesson.content.realWorldExamples.map((example, idx) => (
                          <div key={idx} className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                            <h4 className="font-semibold text-gray-900 mb-2">{example.title}</h4>
                            <p className="text-sm text-gray-700 mb-2">{example.description}</p>
                            <Badge variant="outline" className="text-xs bg-yellow-100">
                              {example.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Section 4: Hands-On Practice Exercise */}
              <div ref={(el) => {sectionRefs.current[4] = el;}}>
                <Card className="border-2 border-green-200 shadow-md bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Practice Exercise</h3>
                        <p className="text-gray-700 mb-4">
                          {selectedLesson.content.practiceExercise}
                        </p>
                        <Button
                          onClick={() => onStartCoding(module.id, selectedLesson.id)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-12"
                        >
                          <Code className="w-5 h-5 mr-2" />
                          Start Coding Exercise
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Section 5: Knowledge Check (Quiz) */}
              {selectedLesson.content.quiz && selectedLesson.content.quiz.length > 0 && !showQuiz && !showQuizResults && (
                <div ref={(el) => {sectionRefs.current[5] = el;}}>
                  <Card className="border-4 border-orange-200 shadow-xl bg-gradient-to-r from-amber-50 to-yellow-50">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz in Game Form</h3>
                          <p className="text-gray-700 mb-4">
                            Test your understanding with {selectedLesson.content.quiz.length} interactive questions! 
                            Earn XP, build streaks, and master {selectedLesson.title}.
                          </p>
                          <div className="flex flex-wrap gap-3 mb-4">
                            <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                              {selectedLesson.content.quiz.length} Questions
                            </Badge>
                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                              70% to Pass
                            </Badge>
                            <Badge className="bg-green-100 text-green-700 border-green-300">
                              Earn XP & Streaks
                            </Badge>
                          </div>
                          <Button
                            onClick={() => setShowQuiz(true)}
                            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold text-lg h-14 shadow-lg transform hover:scale-105 transition-all"
                          >
                            <Trophy className="w-6 h-6 mr-2" />
                            Start Quiz Game
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Section 6: Summary & Next Steps - Temporarily disabled */}
              {/* <SummarySection 
                sectionRefs={sectionRefs}
                scrollToSection={scrollToSection}
                setSelectedLessonId={setSelectedLessonId}
                moduleLessons={module.lessons}
                selectedLessonId={selectedLessonId}
              /> */}
            </div>
          ) : (
            <Card className="border-0 shadow-md h-full">
              <CardContent className="p-12 flex flex-col items-center justify-center h-full text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Lesson</h2>
                <p className="text-gray-600">Choose a lesson from the left to start learning</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Performance & Progress Panel */}
        {showPerformancePanel && (
          <div className="lg:col-span-1">
            <div className="space-y-4 sticky top-4">
              {/* Module Progress Card */}
              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-gray-900">Module Progress</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">Completion</span>
                        <span className="text-2xl font-bold text-gray-900">{moduleProgress.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                          style={{ width: `${moduleProgress.progressPercentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {moduleProgress.completedCount} of {moduleProgress.totalLessons} lessons completed
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-1 mb-1">
                          <Award className="w-3 h-3 text-green-600" />
                          <p className="text-xs text-gray-600">Avg Score</p>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{moduleProgress.averageScore}%</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-1 mb-1">
                          <CalendarDays className="w-3 h-3 text-blue-600" />
                          <p className="text-xs text-gray-600">Total Time</p>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{Math.round(moduleProgress.totalTime / 60)}m</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Real-Time Performance Metrics */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-gray-900">Live Metrics</h3>
                  </div>

                  <div className="space-y-3">
                    {/* Session Time */}
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Session Time</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{formatTime(currentSessionTime)}</span>
                    </div>

                    {/* Keystrokes */}
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <Keyboard className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Keystrokes</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{performanceMetrics.keystrokes}</span>
                    </div>

                    {/* Typing Speed */}
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-700">Speed (cpm)</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{performanceMetrics.averageTypingSpeed}</span>
                    </div>

                    {/* Submit Attempts */}
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Attempts</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{performanceMetrics.submitAttempts}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Trend Chart - Temporarily disabled until chart library is added */}
              {/* {performanceChartData.length > 0 && (
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-gray-900">Score Trend</h3>
                    </div>

                    <ResponsiveContainer width="100%" height={150}>
                      <LineChart data={performanceChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} id="lesson-viewer-performance-chart">
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="name"
                          tick={{ fontSize: 10 }}
                          stroke="#6B7280"
                        />
                        <YAxis 
                          domain={[0, 100]}
                          tick={{ fontSize: 10 }}
                          stroke="#6B7280"
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                        <Line 
                          key="line-score"
                          type="monotone" 
                          dataKey="score"
                          name="Score"
                          stroke="#8B5CF6" 
                          strokeWidth={2}
                          dot={{ fill: '#8B5CF6', r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>

                    <div className="mt-4 bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <p className="text-xs text-purple-900">
                        {performanceChartData.length > 1 && performanceChartData[performanceChartData.length - 1].score > performanceChartData[0].score ? (
                          <>📈 <span className="font-semibold">Great progress!</span> Your scores are improving</>
                        ) : performanceChartData.length > 1 && performanceChartData[performanceChartData.length - 1].score < performanceChartData[0].score ? (
                          <>📉 <span className="font-semibold">Keep practicing!</span> Review feedback to improve</>
                        ) : (
                          <>💪 <span className="font-semibold">Keep going!</span> Complete more lessons to see trends</>
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )} */}

              {/* Quick Achievements */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-bold text-gray-900">Achievements</h3>
                  </div>

                  <div className="space-y-2">
                    {moduleProgress.completedCount >= 1 && (
                      <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-lg">
                          🎯
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-900">First Lesson</p>
                          <p className="text-xs text-gray-600">Completed first lesson</p>
                        </div>
                      </div>
                    )}
                    
                    {moduleProgress.averageScore >= 80 && lessonPerformance.length >= 3 && (
                      <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-lg">
                          ⭐
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-900">High Achiever</p>
                          <p className="text-xs text-gray-600">80%+ average score</p>
                        </div>
                      </div>
                    )}

                    {moduleProgress.completedCount === moduleProgress.totalLessons && (
                      <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-lg">
                          🏆
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-900">Module Master</p>
                          <p className="text-xs text-gray-600">Completed all lessons!</p>
                        </div>
                      </div>
                    )}

                    {moduleProgress.completedCount === 0 && (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">Complete lessons to unlock achievements!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      ) : (
        /* Feedback History View */
        <div className="space-y-6">
          {allSubmissions.length === 0 ? (
            <Card className="border-0 shadow-md">
              <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Feedback Yet</h2>
                <p className="text-gray-600 mb-4">Submit your Java code in the lessons to receive AI-powered feedback</p>
                <Button onClick={() => setViewMode('lessons')} className="bg-blue-600 hover:bg-blue-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Go to Lessons
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Feedback Summary Statistics */}
              <Card className="border-0 shadow-md bg-gradient-to-r from-purple-50 to-blue-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    Feedback Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
                      <p className="text-2xl font-bold text-gray-900">{allSubmissions.length}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Avg. Score</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.round(allSubmissions.reduce((sum, s) => sum + s.score, 0) / allSubmissions.length)}%
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Total Issues</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {allSubmissions.reduce((sum, s) => sum + (s.feedback.errorDetails?.length || s.feedback.errors.length), 0)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Highest Score</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.max(...allSubmissions.map(s => s.score))}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feedback Cards */}
              {allSubmissions.map((submission, index) => {
              const lessonTitle = module.lessons.find(l => l.id === submission.lessonId)?.title || 'Unknown Lesson';
              const submissionDate = new Date(submission.timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });

              return (
                <Card key={`${submission.lessonId}-${index}`} className="border-0 shadow-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 border-b-2 border-blue-300">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className="bg-blue-200 text-gray-900 border-0 mb-2">
                          {module.title}
                        </Badge>
                        <h2 className="text-2xl font-bold mb-1 text-gray-900">{lessonTitle}</h2>
                        <p className="text-gray-900">{submissionDate}</p>
                        {submission.performanceMetrics && (
                          <div className="flex gap-3 mt-3 text-sm text-gray-900">
                            <span className="flex items-center gap-1">
                              <Timer className="w-4 h-4 text-blue-600" />
                              {Math.floor(submission.performanceMetrics.timeSpent / 60)}m
                            </span>
                            <span className="flex items-center gap-1">
                              <Keyboard className="w-4 h-4 text-green-600" />
                              {submission.performanceMetrics.keystrokes} keys
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4 text-purple-600" />
                              {submission.performanceMetrics.submitAttempts} attempts
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="bg-white border-2 border-blue-600 rounded-full w-16 h-16 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">{submission.score}%</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    {/* Neural Network Summary */}
                    <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                      <div className="flex items-start gap-3">
                        <Brain className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Neural Network Summary</h3>
                          <p className="text-sm text-gray-700">
                            {submission.score >= 80 
                              ? 'Excellent implementation! Your code demonstrates strong understanding of OOP fundamentals.'
                              : submission.score >= 60
                              ? 'Good effort! Your code shows understanding but has areas that need improvement.'
                              : 'Your code needs improvement. Review the feedback below to enhance your implementation.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Strengths and Improvements Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Strengths (OOP Principles) */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <ThumbsUp className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold text-gray-900">Strengths</h3>
                        </div>
                        <ul className="space-y-2">
                          {submission.feedback.oopPrinciples.map((principle, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{principle}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Areas for Improvement */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="w-5 h-5 text-orange-600" />
                          <h3 className="font-semibold text-gray-900">Areas for Improvement</h3>
                        </div>
                        <ul className="space-y-2">
                          {submission.feedback.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-orange-600 flex-shrink-0">—</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Issues Found with Detailed View */}
                    {(submission.feedback.errors.length > 0 || (submission.feedback.errorDetails && submission.feedback.errorDetails.length > 0)) && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <h3 className="font-semibold text-gray-900">Issues Detected</h3>
                            <Badge variant="destructive" className="ml-2">
                              {submission.feedback.errorDetails?.length || submission.feedback.errors.length}
                            </Badge>
                          </div>
                          {submission.feedback.errorDetails && submission.feedback.errorDetails.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const key = `${submission.lessonId}-${index}`;
                                setExpandedErrors(prev => ({
                                  ...prev,
                                  [key]: !prev[key]
                                }));
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              {expandedErrors[`${submission.lessonId}-${index}`] ? (
                                <>
                                  <ChevronUp className="w-4 h-4 mr-1" />
                                  Hide Details
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4 mr-1" />
                                  View Details
                                </>
                              )}
                            </Button>
                          )}
                        </div>

                        {/* Simple error list */}
                        {!expandedErrors[`${submission.lessonId}-${index}`] && submission.feedback.errors.length > 0 && (
                          <ul className="space-y-2">
                            {submission.feedback.errors.map((error, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-2 rounded">
                                <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Detailed error view */}
                        {expandedErrors[`${submission.lessonId}-${index}`] && submission.feedback.errorDetails && (
                          <div className="space-y-3">
                            {submission.feedback.errorDetails.map((error, idx) => (
                              <Card key={idx} className={`border-2 ${
                                error.severity === 'error' ? 'border-red-300 bg-red-50' : 'border-orange-300 bg-orange-50'
                              }`}>
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${
                                      error.severity === 'error' ? 'bg-red-100' : 'bg-orange-100'
                                    }`}>
                                      {error.severity === 'error' ? (
                                        <XCircle className={`w-5 h-5 ${
                                          error.severity === 'error' ? 'text-red-600' : 'text-orange-600'
                                        }`} />
                                      ) : (
                                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge variant={error.severity === 'error' ? 'destructive' : 'default'} className={
                                          error.severity === 'error' ? '' : 'bg-orange-500 hover:bg-orange-600'
                                        }>
                                          {error.severity.toUpperCase()}
                                        </Badge>
                                        <Badge variant="outline" className={`capitalize ${getErrorTypeColor(error.type)}`}>
                                          {error.type}
                                        </Badge>
                                        {error.line && (
                                          <span className="text-xs text-gray-500">Line {error.line}</span>
                                        )}
                                      </div>
                                      <h4 className={`font-semibold mb-2 ${
                                        error.severity === 'error' ? 'text-red-900' : 'text-orange-900'
                                      }`}>
                                        {error.message}
                                      </h4>
                                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                                        <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                          <Lightbulb className="w-3 h-3" />
                                          Suggestion:
                                        </p>
                                        <p className="text-sm text-gray-700">{error.suggestion}</p>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Your Java Code */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Code className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">Your Java Code</h3>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm">
                          <code className="text-green-400">{submission.code}</code>
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          )}
        </div>
      )}
    </div>
  );
}