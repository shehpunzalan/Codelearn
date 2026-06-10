import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, BookOpen, CheckCircle, Circle, Trophy } from 'lucide-react';
import { EnhancedLearningDelivery } from './EnhancedLearningDelivery';
import { GameFormQuiz } from './GameFormQuiz';
import { QuizResultsPage } from './QuizResultsPage';
import { toast } from 'sonner';
import { saveProgress } from '../utils/storage';
import type { Module } from '../types';

interface LessonViewerProps {
  module: Module;
  onBack: () => void;
  onViewFeedback?: () => void;
  onStartCoding: (moduleId: string, lessonId: string) => void;
  onOpenVideoTutorial?: (moduleId: string, lessonId: string, lessonTitle: string) => void;
  onOpenReadingContent?: (moduleId: string, lessonId: string, lessonTitle: string, lessonContent: any) => void;
  onOpenAudioLecture?: (moduleId: string, lessonId: string, lessonTitle: string, lessonContent: any) => void;
  onOpenInteractiveGame?: (moduleId: string, lessonId: string, lessonTitle: string, lessonContent: any) => void;
  onLessonComplete?: (moduleId: string, completedCount: number, total: number) => void;
  onModuleComplete?: (moduleId: string) => void;
  onNextModule?: () => void;
}

export function LessonViewer({
  module,
  onBack,
  onStartCoding,
  onOpenVideoTutorial,
  onOpenReadingContent,
  onOpenAudioLecture,
  onOpenInteractiveGame,
  onLessonComplete,
  onModuleComplete,
  onNextModule
}: LessonViewerProps) {
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [showModuleComplete, setShowModuleComplete] = useState(false);
  const [quizStats, setQuizStats] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`completedLessons_${module.id}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const selectedLesson = module.lessons.find(lesson => lesson.id === selectedLessonId);

  // Get current user ID for saveProgress
  const getCurrentUserId = (): string => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      return currentUser ? JSON.parse(currentUser).id : 'guest';
    } catch { return 'guest'; }
  };

  // Central function: mark a lesson complete, persist, and notify App.tsx
  const markLessonComplete = (lessonId: string, score: number = 100) => {
    const newCompleted = new Set(completedLessons);
    newCompleted.add(lessonId);
    setCompletedLessons(newCompleted);

    // Persist to localStorage
    localStorage.setItem(`completedLessons_${module.id}`, JSON.stringify([...newCompleted]));

    // Save to storage.ts so stats and instructor dashboard update too
    saveProgress({
      userId: getCurrentUserId(),
      moduleId: module.id,
      lessonId,
      completed: true,
      score,
      attempts: 1,
      lastAttempt: new Date().toISOString(),
      code: '',
      feedback: '',
      timeSpent: 0,
    });

    // Notify App.tsx so module.progress updates in state
    onLessonComplete?.(module.id, newCompleted.size, module.lessons.length);

    // If all lessons done, fire module complete
    if (newCompleted.size === module.lessons.length) {
      onModuleComplete?.(module.id);
      setShowModuleComplete(true);
    }
  };

  // Quiz handlers
  const handleQuizComplete = (stats: any) => {
    setQuizStats(stats);
    setShowQuiz(false);
    setShowQuizResults(true);

    // Save quiz results
    localStorage.setItem(
      `quiz_${module.id}_${selectedLessonId}`,
      JSON.stringify({
        lessonId: selectedLessonId,
        moduleId: module.id,
        stats,
        timestamp: new Date().toISOString(),
      })
    );

    // Mark lesson complete if passed
    if (stats.accuracy >= 70 && selectedLessonId) {
      markLessonComplete(selectedLessonId, Math.round(stats.accuracy));
      toast.success('🎉 Quiz Passed! Lesson Completed!');
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
      onModuleComplete?.(module.id);
      setShowModuleComplete(true);
    }
  };

  const handleBackToLesson = () => {
    setShowQuizResults(false);
    setShowQuiz(false);
  };

  // Show module completion screen
  if (showModuleComplete) {
    return (
      <div className="fixed inset-0 z-50 overflow-auto flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
        <div className="max-w-lg w-full mx-4 rounded-2xl p-8 text-center" style={{ backgroundColor: 'var(--color-background-primary)', fontFamily: 'var(--font-sans)' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--color-success-100)' }}>
            <Trophy className="w-10 h-10" style={{ color: 'var(--color-success-600)' }} />
          </div>
          <h2 className="mb-2" style={{ color: 'var(--color-text-primary)', fontSize: '1.75rem', fontWeight: 700 }}>
            Module Complete! 🎉
          </h2>
          <p className="mb-2" style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
            You've finished <strong>{module.title}</strong>
          </p>
          <p className="mb-8" style={{ color: 'var(--color-text-tertiary)' }}>
            All {module.lessons.length} lessons completed. Great work!
          </p>
          <div className="flex flex-col gap-3">
            {onNextModule && (
              <button
                onClick={onNextModule}
                className="w-full py-3 px-6 rounded-xl transition-all"
                style={{
                  backgroundColor: 'var(--color-primary-600)',
                  color: '#fff',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Continue to Next Module →
              </button>
            )}
            <button
              onClick={onBack}
              className="w-full py-3 px-6 rounded-xl transition-all"
              style={{
                backgroundColor: 'var(--color-neutral-100)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Back to Modules
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      </div>

      {/* Module progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="h-2 rounded-full bg-blue-500 transition-all"
          style={{ width: `${Math.round((completedLessons.size / module.lessons.length) * 100)}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 mb-4">
        {completedLessons.size} of {module.lessons.length} lessons completed
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lessons Sidebar */}
        <Card className="border-0 shadow-md lg:col-span-1">
          <CardContent className="p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Lessons</h2>
            <div className="space-y-2">
              {module.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
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
                    {completedLessons.has(lesson.id) || lesson.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Lesson {index + 1}</p>
                      <p className="font-medium text-sm text-gray-900 truncate">{lesson.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{lesson.duration}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {selectedLesson ? (
            <div className="space-y-6">
              <EnhancedLearningDelivery
                moduleId={module.id}
                lessonId={selectedLesson.id}
                lessonTitle={selectedLesson.title}
                lessonContent={selectedLesson.content}
                onStartCoding={onStartCoding}
                onComplete={() => {
                  // Mark lesson complete when the user finishes reading/watching content
                  if (!completedLessons.has(selectedLesson.id)) {
                    markLessonComplete(selectedLesson.id, 100);
                    toast.success('📚 Lesson completed!');
                  } else {
                    toast.success('📚 Lesson content reviewed!');
                  }

                  // Auto-open quiz if available
                  if (selectedLesson.content.quiz && selectedLesson.content.quiz.length > 0) {
                    setTimeout(() => setShowQuiz(true), 800);
                  }
                }}
                onOpenVideoTutorial={onOpenVideoTutorial}
                onOpenReadingContent={onOpenReadingContent}
                onOpenAudioLecture={onOpenAudioLecture}
                onOpenInteractiveGame={onOpenInteractiveGame}
              />

              {/* Quiz button — shown when lesson has a quiz */}
              {selectedLesson.content.quiz && selectedLesson.content.quiz.length > 0 && (
                <Card className="border-2 border-orange-200 bg-amber-50">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Knowledge Check</h3>
                      <p className="text-sm text-gray-600">
                        {selectedLesson.content.quiz.length} questions · 70% to pass
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowQuiz(true)}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Take Quiz
                    </Button>
                  </CardContent>
                </Card>
              )}
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
      </div>
    </div>
  );
}
