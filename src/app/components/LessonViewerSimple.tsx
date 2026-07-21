import React, { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, ChevronRight, Play, Trophy, RotateCcw, ClipboardList, Video } from 'lucide-react';
import { EnhancedLearningDelivery } from './EnhancedLearningDelivery';
import { GameFormQuiz } from './GameFormQuiz';
import { QuizResultsPage } from './QuizResultsPage';
import { getChallengesForLesson } from '../data/lessonChallenges';
import { toast } from 'sonner';
import type { Module } from '../types';

interface LessonViewerProps {
  module: Module;
  userId?: string;
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
  onLessonOpen?: (moduleId: string, lessonId: string) => void;
}

type Screen = 'list' | 'content' | 'quiz' | 'results' | 'module-done';

interface QuizStats {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalXP: number;
  streak: number;
  accuracy: number;
  timeSpent: number;
}

export function LessonViewer({
  module,
  userId,
  onBack,
  onStartCoding,
  onOpenVideoTutorial,
  onOpenReadingContent,
  onOpenAudioLecture,
  onOpenInteractiveGame,
  onLessonComplete,
  onModuleComplete,
  onNextModule,
  onLessonOpen,
}: LessonViewerProps) {
  const [screen, setScreen] = useState<Screen>('list');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [quizStats, setQuizStats] = useState<QuizStats | null>(null);

  // User-scoped key so different users don't share completed-lesson state.
  // Falls back to legacy unscoped key for backward compat.
  const completedKey = userId
    ? `completedLessons_${userId}_${module.id}`
    : `completedLessons_${module.id}`;

  // Load completed lessons from localStorage once on mount
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    const seeded = new Set<string>();
    try {
      // Try user-scoped key first, then fall back to legacy unscoped key
      const userKey = userId ? `completedLessons_${userId}_${module.id}` : null;
      const legacyKey = `completedLessons_${module.id}`;
      const raw = (userKey && localStorage.getItem(userKey)) || localStorage.getItem(legacyKey);
      if (raw) {
        JSON.parse(raw).forEach((lessonId: string) => seeded.add(lessonId));
      }
    } catch {
      // Ignore malformed data
    }
    return seeded;
  });

  const activeLesson = module.lessons.find(l => l.id === activeLessonId) ?? null;
  const lessonKey = activeLessonId ? `${module.id}-${activeLessonId}` : '';
  const quizQuestions = lessonKey ? getChallengesForLesson(lessonKey) : [];

  // ── Handlers ────────────────────────────────────────────────────────────────

  const openLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setScreen('content');
    onLessonOpen?.(module.id, lessonId);
  };

  const startQuiz = () => {
    if (!quizQuestions || quizQuestions.length === 0) {
      toast.error('No quiz questions available for this lesson.');
      return;
    }
    setScreen('quiz');
  };

  const handleQuizComplete = (stats: QuizStats) => {
    setQuizStats(stats);

    // Persist result
    localStorage.setItem(
      `quiz_${module.id}_${activeLessonId}`,
      JSON.stringify({ lessonId: activeLessonId, moduleId: module.id, stats, timestamp: new Date().toISOString() })
    );

    // Mark lesson complete if passed. Complete the whole module immediately
    // when the final required lesson is passed so dashboards/unlocks update
    // before the learner clicks through the results screen.
    if (stats.accuracy >= 70 && activeLessonId) {
      const updated = new Set(completedLessons);
      updated.add(activeLessonId);
      const completedCount = Math.min(updated.size, module.lessons.length);

      setCompletedLessons(updated);
      localStorage.setItem(completedKey, JSON.stringify([...updated]));
      onLessonComplete?.(module.id, completedCount, module.lessons.length);

      if (completedCount >= module.lessons.length) {
        onModuleComplete?.(module.id);
      }
    }

    setScreen('results');
  };

  const handleContinue = () => {
    const idx = module.lessons.findIndex(l => l.id === activeLessonId);
    if (idx < module.lessons.length - 1) {
      const next = module.lessons[idx + 1];
      setActiveLessonId(next.id);
      setQuizStats(null);
      setScreen('content');
      toast.success('Moving to next lesson!');
    } else {
      if (completedLessons.size >= module.lessons.length) {
        onModuleComplete?.(module.id);
        setScreen('module-done');
      } else {
        setScreen('list');
        toast.info('Pass this final lesson quiz with 70% or higher to complete the module.');
      }
    }
  };

  const handleRetry = () => {
    setQuizStats(null);
    setScreen('quiz');
  };

  const progress = module.lessons.length > 0 ? Math.round((completedLessons.size / module.lessons.length) * 100) : 0;

  // ── Screens ─────────────────────────────────────────────────────────────────

  // Module complete
  if (screen === 'module-done') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.78)', fontFamily: 'var(--font-sans)' }}>
        <div className="max-w-md w-full mx-4 rounded-2xl p-10 text-center shadow-2xl" style={{ backgroundColor: 'var(--color-background-primary)' }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--color-success-100)' }}>
            <Trophy size={44} style={{ color: 'var(--color-success-600)' }} />
          </div>
          <h2 style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)', fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
            Module Complete! 🎉
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)', marginBottom: '0.25rem' }}>
            You finished <strong>{module.title}</strong>
          </p>
          <p style={{ color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-sans)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
            All {module.lessons.length} lessons completed. Excellent work!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {onNextModule && (
              <button
                onClick={onNextModule}
                style={{ backgroundColor: 'var(--color-primary-600)', color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '1rem', padding: '0.9rem 1.5rem', borderRadius: 'var(--radius-xl)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                Continue to Next Module <ChevronRight size={18} />
              </button>
            )}
            <button
              onClick={onBack}
              style={{ backgroundColor: 'var(--color-neutral-100)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '1rem', padding: '0.9rem 1.5rem', borderRadius: 'var(--radius-xl)', border: 'none', cursor: 'pointer' }}
            >
              Back to Modules
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz results
  if (screen === 'results' && quizStats) {
    return (
      <div className="fixed inset-0 z-50 overflow-auto" style={{ fontFamily: 'var(--font-sans)' }}>
        <QuizResultsPage
          stats={quizStats}
          lessonTitle={activeLesson?.title}
          onRetry={handleRetry}
          onContinue={handleContinue}
          onBackToLesson={() => setScreen('content')}
        />
      </div>
    );
  }

  // Quiz
  if (screen === 'quiz' && quizQuestions.length > 0) {
    return (
      <div className="fixed inset-0 z-50 overflow-auto" style={{ fontFamily: 'var(--font-sans)' }}>
        <GameFormQuiz
          questions={quizQuestions}
          onComplete={handleQuizComplete}
          onClose={() => setScreen('content')}
          lessonTitle={activeLesson?.title}
        />
      </div>
    );
  }

  // Lesson content
  if (screen === 'content' && activeLesson) {
    const isCompleted = completedLessons.has(activeLesson.id);
    const lessonIndex = module.lessons.findIndex(l => l.id === activeLesson.id);

    return (
      <div style={{ fontFamily: 'var(--font-sans)' }}>
        {/* Sticky back bar for lesson content — always reachable without scrolling */}
        <div
          style={{
            position: 'sticky',
            top: 64,
            zIndex: 40,
            background: 'var(--background)',
            borderBottom: '1px solid var(--border)',
            padding: '0.6rem 0',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <button
            onClick={() => setScreen('list')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontFamily: 'var(--font-sans)', fontWeight: 600, padding: '0.35rem 0.75rem', fontSize: '0.875rem', borderRadius: 'var(--radius-md, 8px)' }}
          >
            <ArrowLeft size={15} /> Lesson List
          </button>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--muted-foreground)', overflow: 'hidden' }}>
            <span>Modules</span>
            <ChevronRight size={12} />
            <span>{module.title}</span>
            <ChevronRight size={12} />
            <span style={{ color: 'var(--foreground)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeLesson.title}</span>
          </div>
          {/* Quick quiz shortcut */}
          <button
            onClick={startQuiz}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600, padding: '0.35rem 0.85rem', fontSize: '0.78rem', borderRadius: 'var(--radius-md, 8px)', whiteSpace: 'nowrap' }}
          >
            <Play size={13} /> Take Quiz
          </button>
        </div>

        {/* Lesson header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <p style={{ color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', margin: '0 0 0.25rem' }}>
              Lesson {lessonIndex + 1} of {module.lessons.length}
            </p>
            <h2 style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '1.5rem', margin: 0 }}>
              {activeLesson.title}
            </h2>
          </div>
          {isCompleted && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--color-success-100)', color: 'var(--color-success-700)', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 600, padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)' }}>
              <CheckCircle size={14} /> Completed
            </span>
          )}
        </div>

        {/* Quiz CTA banner — always visible */}
        <div
          style={{
            backgroundColor: isCompleted ? 'var(--color-success-50)' : 'var(--color-primary-50)',
            border: `2px solid ${isCompleted ? 'var(--color-success-500)' : 'var(--color-primary-300)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', backgroundColor: isCompleted ? 'var(--color-success-500)' : 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {isCompleted ? <CheckCircle size={20} color="#fff" /> : <ClipboardList size={20} color="#fff" />}
            </div>
            <div>
              <p style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)', fontWeight: 600, margin: '0 0 0.1rem', fontSize: '0.95rem' }}>
                {isCompleted ? 'Lesson Completed!' : 'Ready to complete this lesson?'}
              </p>
              <p style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', margin: 0 }}>
                {isCompleted
                  ? 'You passed the Knowledge Check. Retake anytime.'
                  : `Take the Knowledge Check quiz (${quizQuestions.length} questions) — score 70% or higher to complete.`}
              </p>
            </div>
          </div>
          <button
            onClick={startQuiz}
            style={{
              backgroundColor: isCompleted ? 'var(--color-success-600)' : 'var(--color-primary-600)',
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: '0.9rem',
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexShrink: 0,
            }}
          >
            {isCompleted ? <RotateCcw size={15} /> : <Play size={15} />}
            {isCompleted ? 'Retake Quiz' : 'Take Quiz'}
          </button>
        </div>

        {/* Lesson content */}
        <EnhancedLearningDelivery
          key={activeLesson.id}
          moduleId={module.id}
          lessonId={activeLesson.id}
          lessonTitle={activeLesson.title}
          lessonContent={activeLesson.content}
          onStartCoding={onStartCoding}
          onComplete={() => {
            toast.success('Lesson reviewed! Take the quiz above to mark it as complete.');
          }}
          onOpenVideoTutorial={onOpenVideoTutorial}
          onOpenReadingContent={onOpenReadingContent}
          onOpenAudioLecture={onOpenAudioLecture}
          onOpenInteractiveGame={onOpenInteractiveGame}
        />

        {/* Bottom quiz button */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid var(--color-neutral-200)', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Done reviewing? Take the quiz to complete this lesson.
          </p>
          <button
            onClick={startQuiz}
            style={{ backgroundColor: 'var(--color-primary-600)', color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '1rem', padding: '0.85rem 2rem', borderRadius: 'var(--radius-xl)', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
          >
            <ClipboardList size={18} /> Start Knowledge Check Quiz
          </button>
        </div>
      </div>
    );
  }

  // ── Lesson List (default) ────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      {/* ── Sticky breadcrumb / back bar ── */}
      <div
        style={{
          position: 'sticky',
          top: 64, // below the 64px app header
          zIndex: 40,
          background: 'var(--background)',
          borderBottom: '1px solid var(--border)',
          padding: '0.6rem 0',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontFamily: 'var(--font-sans)', fontWeight: 600, padding: '0.35rem 0.75rem', fontSize: '0.875rem', borderRadius: 'var(--radius-md, 8px)' }}
        >
          <ArrowLeft size={15} /> Back to Modules
        </button>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>
          <span>Modules</span>
          <ChevronRight size={12} />
          <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>{module.title}</span>
        </div>
        {/* Progress pill */}
        <span style={{ background: 'var(--accent)', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}>
          {completedLessons.size}/{module.lessons.length} done
        </span>
      </div>

      {/* Module header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
            Module {module.id.replace('mod', '')}
          </span>
          <h1 style={{ color: 'var(--foreground)', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '1.625rem', margin: 0 }}>
            {module.title}
          </h1>
        </div>
        <p style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)', margin: 0 }}>{module.description}</p>
      </div>

      {/* Progress bar */}
      <div style={{ backgroundColor: 'var(--color-background-secondary)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}>Module Progress</span>
          <span style={{ color: 'var(--color-primary-600)', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}>
            {completedLessons.size}/{module.lessons.length} lessons
          </span>
        </div>
        <div style={{ height: '10px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-neutral-200)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 'var(--radius-full)', backgroundColor: progress === 100 ? 'var(--color-success-500)' : 'var(--color-primary-600)', width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>
        <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem', fontFamily: 'var(--font-sans)', marginTop: '0.4rem', margin: '0.4rem 0 0' }}>
          {progress === 100 ? '🎉 Module complete!' : `${progress}% complete — pass each lesson quiz to unlock the next module`}
        </p>
      </div>

      {/* How to complete info box */}
      <div style={{ backgroundColor: 'var(--color-primary-50)', border: '1.5px solid var(--color-primary-200)', borderRadius: 'var(--radius-lg)', padding: '0.9rem 1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <BookOpen size={18} style={{ color: 'var(--color-primary-600)', flexShrink: 0, marginTop: '0.1rem' }} />
        <p style={{ color: 'var(--color-primary-700)', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
          <strong>How to complete a lesson:</strong> Open a lesson → study the content → click <strong>"Take Quiz"</strong> → score 70%+ to mark it complete and unlock the next module.
        </p>
      </div>

      {/* Lessons list — scrollable so the page doesn't grow endlessly */}
      <div
        style={{
          maxHeight: 'calc(100vh - 260px)',
          overflowY: 'auto',
          paddingRight: '0.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--border) transparent',
        }}
      >
        {module.lessons.map((lesson, index) => {
          const isCompleted = completedLessons.has(lesson.id) || lesson.completed;
          const isLocked = lesson.locked;
          const isActive = activeLessonId === lesson.id;

          return (
            <div
              key={lesson.id}
              style={{
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${isCompleted ? 'var(--color-success-400)' : isActive ? 'var(--color-primary-500)' : 'var(--color-neutral-200)'}`,
                backgroundColor: isCompleted ? 'var(--color-success-50)' : isActive ? 'var(--color-primary-50)' : isLocked ? 'var(--color-neutral-50)' : 'var(--color-background-primary)',
                opacity: isLocked ? 0.5 : 1,
                overflow: 'hidden',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {/* Main lesson row */}
              <button
                onClick={() => !isLocked && openLesson(lesson.id)}
                disabled={isLocked}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '1rem 1.25rem',
                  background: 'none',
                  border: 'none',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'background-color 0.15s',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {/* Step indicator */}
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-full)', backgroundColor: isCompleted ? 'var(--color-success-500)' : isActive ? 'var(--color-primary-600)' : 'var(--color-neutral-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isCompleted
                    ? <CheckCircle size={22} color="#fff" />
                    : <span style={{ color: isActive ? '#fff' : 'var(--color-neutral-600)', fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-sans)' }}>{index + 1}</span>}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem', margin: '0 0 0.2rem', fontFamily: 'var(--font-sans)' }}>Lesson {index + 1}</p>
                  <p style={{ color: 'var(--color-text-primary)', fontWeight: 600, fontSize: '0.95rem', margin: '0 0 0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-sans)' }}>
                    {lesson.title}
                  </p>
                  <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.8rem', margin: 0, fontFamily: 'var(--font-sans)' }}>{lesson.duration}</p>
                </div>

                {/* Status badge */}
                {isCompleted ? (
                  <span style={{ backgroundColor: 'var(--color-success-100)', color: 'var(--color-success-700)', fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', flexShrink: 0 }}>
                    ✓ Done
                  </span>
                ) : !isLocked ? (
                  <ChevronRight size={18} style={{ color: 'var(--color-neutral-400)', flexShrink: 0 }} />
                ) : null}
              </button>

              {/* Video Tutorial button — available for every lesson */}
              {!isLocked && onOpenVideoTutorial && (
                <div style={{ padding: '0 1.25rem 0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenVideoTutorial(module.id, lesson.id, lesson.title); }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                      background: 'none', border: '1.5px solid var(--color-primary-300)',
                      color: 'var(--color-primary-600)', borderRadius: 'var(--radius-full)',
                      padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'var(--font-sans)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary-50)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <Video size={12} />
                    Watch Video Tutorial
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
