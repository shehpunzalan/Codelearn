import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Trophy, CheckCircle, XCircle, Lightbulb, Sparkles,
  ChevronRight, Clock, Flame, Award, Star, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import type { Challenge } from '../data/lessonChallenges';

const MAX_ATTEMPTS = 3;
const SECONDS_PER_QUESTION = 30;

interface GameFormQuizProps {
  questions: Challenge[];
  onComplete: (stats: QuizStats) => void;
  onClose?: () => void;
  lessonTitle?: string;
  attemptKey?: string; // localStorage key for attempt tracking
}

interface QuizStats {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalXP: number;
  streak: number;
  accuracy: number;
  timeSpent: number;
}

// Fisher-Yates shuffle — returns a new shuffled array, does not mutate the input
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function GameFormQuiz({ questions, onComplete, onClose, lessonTitle, attemptKey }: GameFormQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [timedOut, setTimedOut] = useState(false);
  const [attemptsUsed, setAttemptsUsed] = useState<number>(() => {
    if (!attemptKey) return 0;
    try { return parseInt(localStorage.getItem(attemptKey) || '0', 10); } catch { return 0; }
  });

  // The order/composition of questions for THIS attempt. Re-shuffled every
  // time a new attempt starts (initial mount, and again if this same
  // component instance is reused for a retry — see startNewAttempt below),
  // so the question set differs attempt to attempt.
  const [orderedQuestions, setOrderedQuestions] = useState<Challenge[]>(() => shuffleArray(questions));

  // Gamification states
  const [totalXP, setTotalXP] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const quizTotalsRef = useRef({
    correctCount: 0, incorrectCount: 0, totalXP: 0, bestStreak: 0, totalTimeSpent: 0,
  });

  const [currentShuffledQuestion, setCurrentShuffledQuestion] = useState<Challenge | null>(null);

  // Screenshot prevention
  useEffect(() => {
    const preventScreenshot = (e: KeyboardEvent) => {
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && e.shiftKey && (e.key === 's' || e.key === 'S')) ||
        ((e.ctrlKey || e.metaKey) && e.key === 'p')
      ) {
        e.preventDefault();
        toast.error('Screenshots are not allowed during the quiz.');
      }
    };
    const preventContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('keydown', preventScreenshot);
    document.addEventListener('contextmenu', preventContext);
    return () => {
      document.removeEventListener('keydown', preventScreenshot);
      document.removeEventListener('contextmenu', preventContext);
    };
  }, []);

  // Countdown timer per question
  useEffect(() => {
    if (isAnswered || attemptsUsed >= MAX_ATTEMPTS) return;
    setTimeLeft(SECONDS_PER_QUESTION);
    setTimedOut(false);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQuestionIndex, isAnswered]);

  // Shuffle options for current question
  useEffect(() => {
    if (orderedQuestions && orderedQuestions[currentQuestionIndex]) {
      const question = orderedQuestions[currentQuestionIndex];
      const options = shuffleArray(question.options);
      setCurrentShuffledQuestion({ ...question, options });
    }
  }, [currentQuestionIndex, orderedQuestions]);

  const handleTimeout = () => {
    if (isAnswered) return;
    setTimedOut(true);
    setIsAnswered(true);
    const nextIncorrectCount = quizTotalsRef.current.incorrectCount + 1;
    quizTotalsRef.current.incorrectCount = nextIncorrectCount;
    setIncorrectCount(nextIncorrectCount);
    setCurrentStreak(0);
    const questionTime = SECONDS_PER_QUESTION;
    quizTotalsRef.current.totalTimeSpent += questionTime;
    setTotalTimeSpent(prev => prev + questionTime);
    toast.error("⏰ Time's up!", { description: 'No answer selected — marked incorrect.', duration: 2000 });
  };

  // Kick off a fresh attempt: reshuffle the question set/order and reset all
  // per-attempt state. Called when attemptsUsed increments, in case this same
  // component instance is reused for a retry instead of being remounted.
  const startNewAttempt = () => {
    setOrderedQuestions(shuffleArray(questions));
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimedOut(false);
    setQuestionStartTime(Date.now());
    setTotalXP(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setCurrentStreak(0);
    setBestStreak(0);
    setTotalTimeSpent(0);
    quizTotalsRef.current = { correctCount: 0, incorrectCount: 0, totalXP: 0, bestStreak: 0, totalTimeSpent: 0 };
  };

  if (attemptsUsed >= MAX_ATTEMPTS) {
    return (
      <div className="w-full max-w-4xl mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
        <div style={{ background: 'var(--card)', border: '2px solid var(--destructive)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(220,38,38,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <AlertTriangle style={{ width: 36, height: 36, color: 'var(--destructive)' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 0.5rem' }}>Quiz Locked</h2>
          <p style={{ color: 'var(--muted-foreground)', margin: '0 0 0.35rem' }}>
            You have used all <strong style={{ color: 'var(--foreground)' }}>{MAX_ATTEMPTS}</strong> attempts for this quiz.
          </p>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', margin: '0 0 1.75rem' }}>Contact your instructor to reset your attempts.</p>
          {onClose && (
            <button
              onClick={onClose}
              style={{ padding: '0.7rem 1.5rem', background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--foreground)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!currentShuffledQuestion) return null;

  const currentQuestion = currentShuffledQuestion;
  const isLastQuestion = currentQuestionIndex === orderedQuestions.length - 1;
  const remainingAttempts = MAX_ATTEMPTS - attemptsUsed - 1; // after this attempt

  const getQuestionDifficulty = (): 'easy' | 'medium' | 'hard' => {
    const questionLength = currentQuestion.question.length;
    const optionsCount = currentQuestion.options.length;
    if (questionLength > 100 || optionsCount > 4) return 'hard';
    if (questionLength > 50) return 'medium';
    return 'easy';
  };

  const difficulty = getQuestionDifficulty();
  const baseXP = difficulty === 'hard' ? 150 : difficulty === 'medium' ? 100 : 50;

  const timerColor = timeLeft > 15 ? 'var(--success, #16a34a)' : timeLeft > 7 ? 'var(--warning, #d97706)' : 'var(--destructive, #dc2626)';

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) { toast.error('Please select an answer!'); return; }
    setIsAnswered(true);
    const selectedOptionObj = currentQuestion.options.find(opt => opt.text === selectedOption);
    const isCorrect = selectedOptionObj?.isCorrect || false;

    if (isCorrect) {
      const newStreak = currentStreak + 1;
      const streakBonus = newStreak >= 3 ? newStreak * 10 : 0;
      const totalEarnedXP = baseXP + streakBonus;
      const nextCorrectCount = quizTotalsRef.current.correctCount + 1;
      const nextTotalXP = quizTotalsRef.current.totalXP + totalEarnedXP;
      const nextBestStreak = Math.max(quizTotalsRef.current.bestStreak, newStreak);
      quizTotalsRef.current = { ...quizTotalsRef.current, correctCount: nextCorrectCount, totalXP: nextTotalXP, bestStreak: nextBestStreak };
      setCorrectCount(nextCorrectCount); setCurrentStreak(newStreak); setTotalXP(nextTotalXP); setBestStreak(nextBestStreak);
      if (newStreak >= 5) toast.success('🔥 ON FIRE! 5x STREAK!', { description: `+${totalEarnedXP} XP | ${newStreak}x combo!`, duration: 3000 });
      else if (newStreak >= 3) toast.success('⚡ STREAK ACTIVE!', { description: `+${totalEarnedXP} XP | ${newStreak}x!`, duration: 3000 });
      else toast.success('✅ Correct!', { description: `+${totalEarnedXP} XP earned!`, duration: 2000 });
    } else {
      const nextIncorrectCount = quizTotalsRef.current.incorrectCount + 1;
      quizTotalsRef.current.incorrectCount = nextIncorrectCount;
      setIncorrectCount(nextIncorrectCount); setCurrentStreak(0);
      toast.error('❌ Incorrect!', { description: 'Streak reset. See the correct answer.', duration: 2000 });
    }

    const questionTime = (Date.now() - questionStartTime) / 1000;
    quizTotalsRef.current.totalTimeSpent += questionTime;
    setTotalTimeSpent(prev => prev + questionTime);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < orderedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null); setIsAnswered(false);
      setQuestionStartTime(Date.now()); setTimedOut(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    // Increment attempt counter in localStorage
    if (attemptKey) {
      const next = attemptsUsed + 1;
      try { localStorage.setItem(attemptKey, String(next)); } catch {}
      setAttemptsUsed(next);
    }
    const totals = quizTotalsRef.current;
    onComplete({
      totalQuestions: orderedQuestions.length,
      correctAnswers: totals.correctCount,
      incorrectAnswers: totals.incorrectCount,
      totalXP: totals.totalXP,
      streak: totals.bestStreak,
      accuracy: Math.round((totals.correctCount / orderedQuestions.length) * 100),
      timeSpent: Math.round(totals.totalTimeSpent),
    });
    // If the parent keeps this same component mounted and lets the user
    // retry in place, this reshuffles the question set for the next attempt.
    startNewAttempt();
  };

  const getDifficultyBadge = () => {
    switch (difficulty) {
      case 'easy': return <Badge style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success, #16a34a)', border: '1px solid rgba(34,197,94,0.4)' }}>EASY</Badge>;
      case 'medium': return <Badge style={{ background: 'rgba(234,179,8,0.15)', color: 'var(--warning, #92400e)', border: '1px solid rgba(234,179,8,0.4)' }}>MODERATE</Badge>;
      case 'hard': return <Badge style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--destructive, #dc2626)', border: '1px solid rgba(239,68,68,0.4)' }}>HARD</Badge>;
    }
  };

  return (
    <div
      className="w-full"
      style={{
        fontFamily: 'var(--font-sans)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      } as React.CSSProperties}
      onCopy={e => e.preventDefault()}
    >
      <div className="w-full max-w-4xl mx-auto">
        <Card style={{ border: '3px solid var(--primary, #6366f1)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', background: 'var(--card)' }}>
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-start gap-4 mb-5">
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary, #8b5cf6))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Quiz Challenge</h2>
                  {getDifficultyBadge()}
                </div>
                {lessonTitle && <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', margin: 0 }}>{lessonTitle}</p>}
                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.78rem', margin: '2px 0 0' }}>
                  Attempt {attemptsUsed + 1} of {MAX_ATTEMPTS} &nbsp;·&nbsp; {remainingAttempts} remaining after this
                </p>
              </div>
            </div>

            {/* Stats + Timer Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--accent, #f3f4f6)', borderRadius: 'var(--radius-md, 8px)', padding: '0.75rem 1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div className="text-center">
                  <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginBottom: 2 }}>Question</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{currentQuestionIndex + 1}/{orderedQuestions.length}</p>
                </div>
                <div className="text-center">
                  <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginBottom: 2 }}>Score</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--success, #16a34a)', margin: 0 }}>{correctCount}</p>
                </div>
                <div className="text-center">
                  <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginBottom: 2 }}>XP</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary, #8b5cf6)', margin: 0 }}>{totalXP}</p>
                </div>
                {currentStreak > 0 && (
                  <div className="text-center">
                    <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginBottom: 2 }}>Streak</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--warning, #d97706)', margin: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Flame className="w-4 h-4" />{currentStreak}
                    </p>
                  </div>
                )}
              </div>
              {/* Countdown Timer */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 54, height: 54, borderRadius: '50%', border: `4px solid ${timerColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--card)', transition: 'border-color 0.3s' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: timerColor, fontFamily: 'var(--font-mono, monospace)', lineHeight: 1 }}>{timeLeft}</span>
                </div>
                <p style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)', margin: 0 }}>seconds</p>
              </div>
            </div>

            {/* Streak Banner */}
            {currentStreak >= 3 && (
              <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'linear-gradient(90deg, rgba(251,146,60,0.15), rgba(239,68,68,0.15))', border: '2px solid rgba(251,146,60,0.5)', borderRadius: 'var(--radius-md, 8px)', textAlign: 'center', fontWeight: 700, color: 'var(--warning, #ea580c)', fontSize: '0.95rem' }}>
                <Flame className="w-4 h-4 inline mr-1 text-orange-500" />
                {currentStreak >= 5 ? '🔥 ON FIRE!' : '⚡ STREAK ACTIVE!'} {currentStreak}x Combo
                <Flame className="w-4 h-4 inline ml-1 text-orange-500" />
              </div>
            )}

            {/* Timeout Banner */}
            {timedOut && (
              <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.4)', borderRadius: 'var(--radius-md, 8px)', textAlign: 'center', color: 'var(--destructive, #dc2626)', fontWeight: 600, fontSize: '0.9rem' }}>
                ⏰ Time ran out — this question was marked incorrect.
              </div>
            )}

            {/* Question */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.5, marginBottom: '1rem' }}>
                {currentQuestion.question}
              </h3>

              {currentQuestion.code && (
                <div style={{ marginBottom: '1rem', borderRadius: 'var(--radius-md, 8px)', overflow: 'hidden', border: '2px solid rgba(99,102,241,0.25)' }}>
                  <div style={{ background: '#1e1e2e', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f38ba8', display: 'inline-block' }} />
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f9e2af', display: 'inline-block' }} />
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#a6e3a1', display: 'inline-block' }} />
                    <span style={{ color: '#6c7086', fontSize: '0.72rem', marginLeft: 8, fontFamily: 'var(--font-mono, monospace)' }}>Java</span>
                  </div>
                  <pre style={{ background: '#181825', color: '#cdd6f4', padding: '1rem', fontSize: '0.85rem', fontFamily: 'var(--font-mono, monospace)', overflowX: 'auto', margin: 0, lineHeight: 1.6 }}>
                    {currentQuestion.code}
                  </pre>
                </div>
              )}

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOption === option.text;
                  // On timeout there is no selected answer — don't highlight correct either
                  const showCorrect = isAnswered && !timedOut && option.isCorrect;
                  const showIncorrect = isAnswered && !timedOut && isSelected && !option.isCorrect;
                  return (
                    <label
                      key={option.id}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                        padding: '0.9rem 1rem',
                        borderRadius: 'var(--radius-md, 8px)',
                        border: showCorrect ? '2px solid var(--success, #16a34a)' : showIncorrect ? '2px solid var(--destructive, #dc2626)' : isSelected ? '2px solid var(--primary, #6366f1)' : '2px solid var(--border)',
                        background: showCorrect ? 'rgba(34,197,94,0.08)' : showIncorrect ? 'rgba(239,68,68,0.08)' : isSelected ? 'rgba(99,102,241,0.08)' : 'var(--card)',
                        cursor: isAnswered ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s',
                        userSelect: 'none',
                      }}
                      onClick={() => !isAnswered && handleSelectOption(option.text)}
                    >
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: 2 }}>
                        <input
                          type="radio"
                          name="quiz-option"
                          value={option.text}
                          checked={isSelected}
                          onChange={() => handleSelectOption(option.text)}
                          disabled={isAnswered}
                          style={{ width: 18, height: 18, accentColor: 'var(--primary, #6366f1)' }}
                        />
                        {showCorrect && <CheckCircle style={{ width: 16, height: 16, color: 'var(--success, #16a34a)', position: 'absolute', right: -8, top: -6 }} />}
                        {showIncorrect && <XCircle style={{ width: 16, height: 16, color: 'var(--destructive, #dc2626)', position: 'absolute', right: -8, top: -6 }} />}
                      </div>
                      <span style={{ flex: 1, fontSize: '0.95rem', color: showCorrect ? 'var(--success, #16a34a)' : showIncorrect ? 'var(--destructive, #dc2626)' : 'var(--foreground)', fontWeight: showCorrect ? 600 : 400 }}>
                        {option.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Answer Explanation */}
            {isAnswered && (() => {
              if (timedOut) {
                return (
                  <div style={{ marginBottom: '1.25rem', padding: '1rem', borderRadius: 'var(--radius-md, 8px)', background: 'rgba(220,38,38,0.07)', border: '2px solid rgba(220,38,38,0.3)' }}>
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                      <Clock style={{ width: 18, height: 18, color: 'var(--destructive)', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p style={{ fontWeight: 700, margin: '0 0 4px', color: 'var(--destructive)', fontSize: '0.9rem' }}>⏰ Time ran out!</p>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>No answer was selected — this question is marked incorrect. Try to answer faster next time!</p>
                      </div>
                    </div>
                  </div>
                );
              }
              const selectedOptionObj = currentQuestion.options.find(opt => opt.text === selectedOption);
              const correctOption = currentQuestion.options.find(opt => opt.isCorrect);
              const isCorrect = selectedOptionObj?.isCorrect || false;
              return (
                <div style={{ marginBottom: '1.25rem', padding: '1rem', borderRadius: 'var(--radius-md, 8px)', background: isCorrect ? 'rgba(34,197,94,0.08)' : 'rgba(99,102,241,0.08)', border: `2px solid ${isCorrect ? 'rgba(34,197,94,0.35)' : 'rgba(99,102,241,0.35)'}` }}>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <Lightbulb style={{ width: 18, height: 18, color: isCorrect ? 'var(--success, #16a34a)' : 'var(--primary, #6366f1)', flexShrink: 0, marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, margin: '0 0 4px', color: isCorrect ? 'var(--success, #16a34a)' : 'var(--primary, #6366f1)', fontSize: '0.9rem' }}>
                        {isCorrect ? '✅ Correct!' : '💡 Keep Learning!'}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--foreground)' }}>
                        <strong>Explanation:</strong> {isCorrect ? selectedOptionObj?.explanation : correctOption?.explanation}
                      </p>
                      {!isCorrect && correctOption && (
                        <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--foreground)' }}>
                          <strong>Correct Answer:</strong> {correctOption.text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Action Buttons */}
            {!isAnswered ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedOption}
                style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 700, background: selectedOption ? 'linear-gradient(135deg, var(--primary), var(--secondary, #8b5cf6))' : 'var(--muted)', color: selectedOption ? 'white' : 'var(--muted-foreground)', border: 'none', borderRadius: 'var(--radius-md, 8px)', cursor: selectedOption ? 'pointer' : 'not-allowed' }}
              >
                Submit Answer
              </Button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(() => {
                  const isCorrect = currentQuestion.options.find(o => o.text === selectedOption)?.isCorrect;
                  return isCorrect && (
                    <div style={{ padding: '0.75rem', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.35)', borderRadius: 'var(--radius-md, 8px)', textAlign: 'center', fontWeight: 700, color: 'var(--success, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <Award style={{ width: 20, height: 20 }} />
                      +{baseXP + (currentStreak >= 3 ? currentStreak * 10 : 0)} XP Earned!
                      {currentStreak >= 3 && <Star style={{ width: 16, height: 16, color: 'var(--warning, #ca8a04)' }} />}
                    </div>
                  );
                })()}
                {!isLastQuestion ? (
                  <Button
                    onClick={nextQuestion}
                    style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 700, background: 'linear-gradient(135deg, var(--success, #16a34a), #15803d)', color: 'white', border: 'none', borderRadius: 'var(--radius-md, 8px)' }}
                  >
                    Next Question <ChevronRight style={{ width: 18, height: 18, display: 'inline' }} />
                  </Button>
                ) : (
                  <Button
                    onClick={finishQuiz}
                    style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 700, background: 'linear-gradient(135deg, var(--warning, #ca8a04), var(--warning, #d97706))', color: 'white', border: 'none', borderRadius: 'var(--radius-md, 8px)' }}
                  >
                    <Trophy style={{ width: 18, height: 18, display: 'inline', marginRight: 6 }} />
                    Finish Quiz & See Results
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer tips */}
        <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: 'var(--card)', borderRadius: 'var(--radius-md, 8px)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <Sparkles style={{ width: 16, height: 16, color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>
              ⏱ {SECONDS_PER_QUESTION}s per question &nbsp;·&nbsp; 🔥 Build streaks for bonus XP (3+ = streak bonus) &nbsp;·&nbsp; 🎯 Need 70% to pass &nbsp;·&nbsp; 🚫 Screenshots not allowed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
