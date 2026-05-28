import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Trophy, CheckCircle, XCircle, Lightbulb, Sparkles,
  ChevronRight, Clock, Flame, Award, Star
} from 'lucide-react';
import { toast } from 'sonner';
import type { Challenge } from '../data/lessonChallenges';

interface GameFormQuizProps {
  questions: Challenge[];
  onComplete: (stats: QuizStats) => void;
  onClose?: () => void;
  lessonTitle?: string;
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

export function GameFormQuiz({ questions, onComplete, onClose, lessonTitle }: GameFormQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Gamification states
  const [totalXP, setTotalXP] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Current question with shuffled options
  const [currentShuffledQuestion, setCurrentShuffledQuestion] = useState<Challenge | null>(null);

  // Shuffle options for the current question whenever question index changes
  useEffect(() => {
    if (questions && questions[currentQuestionIndex]) {
      const question = questions[currentQuestionIndex];
      const options = [...question.options];

      // Fisher-Yates shuffle
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }

      const shuffled = {
        ...question,
        options
      };

      console.log('🔀 Question', currentQuestionIndex + 1, '- Shuffled options');
      console.log('   Correct answer is now at position:', options.findIndex(opt => opt.isCorrect) + 1);

      setCurrentShuffledQuestion(shuffled);
    }
  }, [currentQuestionIndex]);

  if (!currentShuffledQuestion) {
    return null;
  }

  const currentQuestion = currentShuffledQuestion;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Determine difficulty and XP based on question characteristics
  const getQuestionDifficulty = (): 'easy' | 'medium' | 'hard' => {
    const questionLength = currentQuestion.question.length;
    const optionsCount = currentQuestion.options.length;
    
    if (questionLength > 100 || optionsCount > 4) return 'hard';
    if (questionLength > 50) return 'medium';
    return 'easy';
  };

  const difficulty = getQuestionDifficulty();
  const baseXP = difficulty === 'hard' ? 150 : difficulty === 'medium' ? 100 : 50;

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      toast.error('Please select an answer!');
      return;
    }

    setIsAnswered(true);
    
    const selectedOptionObj = currentQuestion.options.find(opt => opt.text === selectedOption);
    const isCorrect = selectedOptionObj?.isCorrect || false;
    
    if (isCorrect) {
      const newStreak = currentStreak + 1;
      const streakBonus = newStreak >= 3 ? newStreak * 10 : 0;
      const totalEarnedXP = baseXP + streakBonus;
      
      setCorrectCount(prev => prev + 1);
      setCurrentStreak(newStreak);
      setTotalXP(prev => prev + totalEarnedXP);
      
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }

      // Dynamic success messages based on streak
      if (newStreak >= 5) {
        toast.success('🔥 INCREDIBLE! 5x STREAK!', {
          description: `+${totalEarnedXP} XP | ${newStreak} streak combo!`,
          duration: 3000
        });
      } else if (newStreak >= 3) {
        toast.success('⚡ AMAZING! STREAK ACTIVE!', {
          description: `+${totalEarnedXP} XP | ${newStreak} streak!`,
          duration: 3000
        });
      } else {
        toast.success('✅ Correct Answer!', {
          description: `+${totalEarnedXP} XP earned!`,
          duration: 2000
        });
      }
    } else {
      setIncorrectCount(prev => prev + 1);
      setCurrentStreak(0);
      
      toast.error('❌ Incorrect!', {
        description: 'Streak reset. See the correct answer highlighted.',
        duration: 2000
      });
    }

    // Track time spent on this question
    const questionTime = (Date.now() - questionStartTime) / 1000;
    setTotalTimeSpent(prev => prev + questionTime);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetQuestionState();
    } else {
      finishQuiz();
    }
  };

  const resetQuestionState = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setQuestionStartTime(Date.now());
  };

  const finishQuiz = () => {
    const stats: QuizStats = {
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      totalXP,
      streak: bestStreak,
      accuracy: Math.round((correctCount / questions.length) * 100),
      timeSpent: Math.round(totalTimeSpent)
    };

    onComplete(stats);
  };

  const getDifficultyBadge = () => {
    switch (difficulty) {
      case 'easy': return <Badge className="bg-green-100 text-green-700 border-green-300">EASY</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">MEDIUM</Badge>;
      case 'hard': return <Badge className="bg-red-100 text-red-700 border-red-300">HARD</Badge>;
    }
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-4xl mx-auto">
        {/* Main Quiz Card */}
        <Card className="border-4 border-orange-200 shadow-2xl bg-gradient-to-br from-amber-50 to-yellow-50">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <Trophy className="w-9 h-9 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">Quiz in Game Form</h2>
                  {getDifficultyBadge()}
                </div>
                <p className="text-gray-600 text-sm">Test your knowledge</p>
                <p className="text-orange-600 font-semibold text-sm mt-1">
                  Select 1 of {currentQuestion.options.length}
                </p>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-xl border-2 border-orange-100 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Question</p>
                  <p className="text-xl font-bold text-gray-900">{currentQuestionIndex + 1}/{questions.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Score</p>
                  <p className="text-xl font-bold text-green-600">{correctCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">XP</p>
                  <p className="text-xl font-bold text-purple-600">{totalXP}</p>
                </div>
                {currentStreak > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Streak</p>
                    <p className="text-xl font-bold text-orange-600 flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      {currentStreak}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Streak Banner */}
            {currentStreak >= 3 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-400 rounded-xl">
                <p className="text-center text-orange-900 font-bold flex items-center justify-center gap-2">
                  <Flame className="w-5 h-5 text-orange-600" />
                  {currentStreak >= 5 ? '🔥 ON FIRE!' : '⚡ STREAK ACTIVE!'} {currentStreak}x Combo
                  <Flame className="w-5 h-5 text-orange-600" />
                </p>
              </div>
            )}

            {/* Question */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 leading-relaxed mb-6">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedOption === option.text;
                  const showCorrect = isAnswered && option.isCorrect;
                  const showIncorrect = isAnswered && isSelected && !option.isCorrect;

                  return (
                    <label
                      key={option.id}
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        showCorrect
                          ? 'bg-green-50 border-green-500 shadow-lg'
                          : showIncorrect
                          ? 'bg-red-50 border-red-500 shadow-lg'
                          : isSelected
                          ? 'bg-blue-50 border-blue-400 shadow-md'
                          : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-sm'
                      } ${isAnswered ? 'pointer-events-none' : ''}`}
                    >
                      <div className="relative flex items-center">
                        <input
                          type="radio"
                          name="quiz-option"
                          value={option.text}
                          checked={isSelected}
                          onChange={() => handleSelectOption(option.text)}
                          disabled={isAnswered}
                          className="w-5 h-5 text-orange-500 border-gray-300 focus:ring-orange-500"
                        />
                        {showCorrect && (
                          <CheckCircle className="w-5 h-5 text-green-600 absolute -right-1 -top-1" />
                        )}
                        {showIncorrect && (
                          <XCircle className="w-5 h-5 text-red-600 absolute -right-1 -top-1" />
                        )}
                      </div>
                      <span className={`flex-1 text-base ${
                        showCorrect ? 'text-green-900 font-semibold' : 
                        showIncorrect ? 'text-red-900' : 
                        'text-gray-800'
                      }`}>
                        {option.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Answer Explanation */}
            {isAnswered && (() => {
              const selectedOptionObj = currentQuestion.options.find(opt => opt.text === selectedOption);
              const correctOption = currentQuestion.options.find(opt => opt.isCorrect);
              const isCorrect = selectedOptionObj?.isCorrect || false;
              
              return (
                <div className={`mb-6 p-4 rounded-xl border-2 ${
                  isCorrect
                    ? 'bg-green-50 border-green-300'
                    : 'bg-blue-50 border-blue-300'
                }`}>
                  <div className="flex items-start gap-2">
                    <Lightbulb className={`w-5 h-5 mt-0.5 ${
                      isCorrect ? 'text-green-600' : 'text-blue-600'
                    }`} />
                    <div>
                      <p className={`font-semibold mb-1 ${
                        isCorrect ? 'text-green-900' : 'text-blue-900'
                      }`}>
                        {isCorrect ? '✅ Correct!' : '💡 Keep Learning!'}
                      </p>
                      <p className={`text-sm ${
                        isCorrect ? 'text-green-800' : 'text-blue-800'
                      }`}>
                        <strong>Explanation:</strong> {isCorrect ? selectedOptionObj?.explanation : correctOption?.explanation}
                      </p>
                      {!isCorrect && correctOption && (
                        <p className="text-blue-700 text-sm mt-2">
                          <strong>Correct Answer:</strong> {correctOption.text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Show Hint Button */}
            {!isAnswered && (
              <div className="mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </Button>
                {showHint && (
                  <div className="mt-3 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      💡 Think about the key concepts covered in this lesson. Review the question carefully before selecting your answer.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            {!isAnswered ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-6 text-lg shadow-lg disabled:opacity-50"
              >
                Submit Answer
              </Button>
            ) : (
              <div className="space-y-3">
                {(() => {
                  const selectedOptionObj = currentQuestion.options.find(opt => opt.text === selectedOption);
                  const isCorrect = selectedOptionObj?.isCorrect || false;
                  return isCorrect && (
                    <div className="p-4 bg-green-50 border-2 border-green-300 rounded-xl text-center">
                      <p className="text-green-800 font-bold text-lg flex items-center justify-center gap-2">
                        <Award className="w-6 h-6 text-green-600" />
                        +{baseXP + (currentStreak >= 3 ? currentStreak * 10 : 0)} XP Earned!
                        {currentStreak >= 3 && <Star className="w-5 h-5 text-yellow-500" />}
                      </p>
                    </div>
                  );
                })()}
                {!isLastQuestion ? (
                  <Button
                    onClick={nextQuestion}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-6 text-lg shadow-lg"
                  >
                    Next Question
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={finishQuiz}
                    className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-6 text-lg shadow-lg"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    Finish Quiz & See Results
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips Footer */}
        <div className="mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-orange-100 shadow-sm">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">💡 Quick Tips:</h4>
              <ul className="text-xs text-gray-700 space-y-0.5">
                <li>• Build streaks for bonus XP (3+ answers = streak bonuses!)</li>
                <li>• Harder questions = more XP (Easy: 50, Medium: 100, Hard: 150)</li>
                <li>• Need 70% to pass and unlock the next lesson</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}