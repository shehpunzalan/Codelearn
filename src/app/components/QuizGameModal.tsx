import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Trophy, X, CheckCircle, XCircle, Zap, Target, Award,
  Flame, Star, ChevronRight, RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { getQuizForLesson, type QuizQuestion, shuffleArray } from '../data/quizQuestions';
import { randomizeQuizQuestions } from '../utils/randomizeQuizAnswers';

interface QuizGameModalProps {
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
  onClose: () => void;
}

export function QuizGameModal({ moduleId, lessonId, lessonTitle, onClose }: QuizGameModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([]);
  const [currentShuffledQuestion, setCurrentShuffledQuestion] = useState<QuizQuestion | null>(null);

  // Load quiz data (shuffle questions once)
  useEffect(() => {
    const quiz = getQuizForLesson(moduleId, lessonId);
    if (quiz) {
      const shuffledQuestions = shuffleArray(quiz.questions);
      setAllQuestions(shuffledQuestions);
      setAnsweredQuestions(new Array(shuffledQuestions.length).fill(false));
    } else {
      toast.error('Quiz not available for this lesson');
      onClose();
    }
  }, [moduleId, lessonId]);

  // Shuffle options for current question whenever question index changes
  useEffect(() => {
    if (allQuestions && allQuestions[currentQuestionIndex]) {
      const question = allQuestions[currentQuestionIndex];
      const options = [...question.options];
      const correctOptionText = options[question.correctAnswer];

      // Fisher-Yates shuffle
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }

      // Find new index of correct answer
      const newCorrectAnswer = options.indexOf(correctOptionText);

      const shuffled: QuizQuestion = {
        ...question,
        options,
        correctAnswer: newCorrectAnswer
      };

      console.log('🎮 Question', currentQuestionIndex + 1, '- Correct answer at position:', newCorrectAnswer + 1);

      setCurrentShuffledQuestion(shuffled);
    }
  }, [currentQuestionIndex]);

  if (!currentShuffledQuestion) {
    return null;
  }

  const currentQuestion = currentShuffledQuestion;
  const totalQuestions = allQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswerSelect = (optionIndex: number) => {
    if (showExplanation) return; // Don't allow changing answer after submitting
    setSelectedAnswer(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      toast.error('Please select an answer');
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      const points = currentQuestion.points + (streak * 2); // Bonus points for streak
      setScore(score + points);
      setXpEarned(xpEarned + points);
      setCorrectAnswers(correctAnswers + 1);
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
      toast.success(`Correct! +${points} XP`, {
        description: streak > 0 ? `${streak + 1}x Streak! 🔥` : undefined
      });
    } else {
      setStreak(0);
      toast.error('Incorrect answer');
    }

    setShowExplanation(true);
    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestionIndex] = true;
    setAnsweredQuestions(newAnswered);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      
      // Save progress to localStorage
      const storageKey = `quiz-${moduleId}-${lessonId}`;
      localStorage.setItem(storageKey, JSON.stringify({
        score,
        correctAnswers,
        totalQuestions,
        xpEarned,
        maxStreak,
        completedAt: new Date().toISOString()
      }));
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setXpEarned(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectAnswers(0);
    setQuizCompleted(false);
    setAnsweredQuestions(new Array(totalQuestions).fill(false));
    
    // Shuffle questions again
    setQuestions(shuffleArray(questions));
  };

  const getLetterGrade = () => {
    const percentage = (correctAnswers / totalQuestions) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 85) return 'A';
    if (percentage >= 80) return 'B+';
    if (percentage >= 75) return 'B';
    if (percentage >= 70) return 'C+';
    if (percentage >= 65) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const isPassed = () => {
    return (correctAnswers / totalQuestions) * 100 >= 70;
  };

  // Quiz completion screen
  if (quizCompleted) {
    const percentage = (correctAnswers / totalQuestions) * 100;
    const passed = isPassed();

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl bg-white shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white pb-8">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                Quiz Complete!
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {/* Results Summary */}
            <div className="text-center space-y-4">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-4xl font-bold ${
                passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {getLetterGrade()}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {passed ? '🎉 Congratulations!' : 'Keep Learning!'}
                </h3>
                <p className="text-gray-600">
                  You scored {percentage.toFixed(1)}% on {lessonTitle}
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{correctAnswers}/{totalQuestions}</div>
                <div className="text-xs text-gray-600">Correct</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <Zap className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{xpEarned}</div>
                <div className="text-xs text-gray-600">XP Earned</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <Flame className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{maxStreak}</div>
                <div className="text-xs text-gray-600">Max Streak</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <Star className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{score}</div>
                <div className="text-xs text-gray-600">Total Score</div>
              </div>
            </div>

            {/* Performance Message */}
            <div className={`p-4 rounded-lg border-l-4 ${
              passed 
                ? 'bg-green-50 border-green-500' 
                : 'bg-yellow-50 border-yellow-500'
            }`}>
              <p className="text-sm text-gray-700">
                {passed
                  ? '🎓 Excellent work! You\'ve mastered this topic. You can now move on to the next lesson with confidence.'
                  : '📚 You need 70% or higher to pass. Review the lesson content and try again to improve your understanding.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRetry}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Quiz
              </Button>
              <Button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz question screen
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl bg-white shadow-2xl my-8">
        <CardHeader className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white pb-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Quiz Game
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4" />
                {streak > 0 ? `${streak}x Streak!` : 'No Streak'}
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-white/30" />
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>{xpEarned} XP</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{correctAnswers}/{currentQuestionIndex + (showExplanation ? 1 : 0)} Correct</span>
            </div>
            <Badge className="bg-white text-orange-600 border-0">
              {currentQuestion.difficulty}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Question */}
          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showCorrectAnswer = showExplanation && isCorrect;
              const showWrongAnswer = showExplanation && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showCorrectAnswer
                      ? 'bg-green-50 border-green-500'
                      : showWrongAnswer
                      ? 'bg-red-50 border-red-500'
                      : isSelected
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-medium">{option}</span>
                    {showCorrectAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                    {showWrongAnswer && (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`p-4 rounded-lg border-l-4 ${
              selectedAnswer === currentQuestion.correctAnswer
                ? 'bg-green-50 border-green-500'
                : 'bg-yellow-50 border-yellow-500'
            }`}>
              <h4 className="font-semibold text-gray-900 mb-2">
                {selectedAnswer === currentQuestion.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
              </h4>
              <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {!showExplanation ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white flex items-center justify-center gap-2"
              >
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <>
                    Next Question
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    View Results
                    <Trophy className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
