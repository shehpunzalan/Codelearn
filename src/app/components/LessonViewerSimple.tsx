import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, BookOpen, CheckCircle, Circle, Trophy } from 'lucide-react';
import { EnhancedLearningDelivery } from './EnhancedLearningDelivery';
import { GameFormQuiz } from './GameFormQuiz';
import { QuizResultsPage } from './QuizResultsPage';
import { toast } from 'sonner';
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
}

export function LessonViewer({ module, onBack, onStartCoding, onOpenVideoTutorial, onOpenReadingContent, onOpenAudioLecture, onOpenInteractiveGame }: LessonViewerProps) {
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizStats, setQuizStats] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const selectedLesson = module.lessons.find(l => l.id === selectedLessonId);

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
      </div>

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
                  toast.success('📚 Lesson content reviewed!');
                }}
                onOpenVideoTutorial={onOpenVideoTutorial}
                onOpenReadingContent={onOpenReadingContent}
                onOpenAudioLecture={onOpenAudioLecture}
                onOpenInteractiveGame={onOpenInteractiveGame}
              />
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