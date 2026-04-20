import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Trophy, CheckCircle, XCircle, Award, Star, 
  TrendingUp, Clock, Target, Flame, Sparkles,
  ChevronRight, RotateCcw, Home
} from 'lucide-react';

interface QuizStats {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalXP: number;
  streak: number;
  accuracy: number;
  timeSpent: number;
}

interface QuizResultsPageProps {
  stats: QuizStats;
  onRetry?: () => void;
  onContinue?: () => void;
  onBackToLesson?: () => void;
  onClose?: () => void;
  lessonTitle?: string;
}

export function QuizResultsPage({ stats, onRetry, onContinue, onBackToLesson, onClose, lessonTitle }: QuizResultsPageProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const passed = stats.accuracy >= 70;
  const isPerfect = stats.accuracy === 100;
  const isExcellent = stats.accuracy >= 90;

  useEffect(() => {
    if (passed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [passed]);

  const getGrade = () => {
    if (stats.accuracy >= 95) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-500' };
    if (stats.accuracy >= 90) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-500' };
    if (stats.accuracy >= 85) return { grade: 'B+', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-500' };
    if (stats.accuracy >= 80) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-500' };
    if (stats.accuracy >= 75) return { grade: 'C+', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-500' };
    if (stats.accuracy >= 70) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-500' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-500' };
  };

  const gradeInfo = getGrade();

  const getPerformanceMessage = () => {
    if (isPerfect) return {
      title: "🎯 PERFECT SCORE!",
      message: "Outstanding! You've mastered this material completely!",
      emoji: "🏆"
    };
    if (isExcellent) return {
      title: "⭐ EXCELLENT WORK!",
      message: "Amazing performance! You have a strong grasp of the concepts.",
      emoji: "🌟"
    };
    if (passed) return {
      title: "✅ GREAT JOB!",
      message: "You passed! Keep up the good work and continue learning.",
      emoji: "👏"
    };
    return {
      title: "💪 KEEP TRYING!",
      message: "Don't give up! Review the material and try again. You've got this!",
      emoji: "📚"
    };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i}
                className="absolute animate-bounce text-4xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                {['🎉', '⭐', '✨', '🏆', '💎', '🎊', '🌟'][Math.floor(Math.random() * 7)]}
              </div>
            ))}
          </div>
        )}

        {/* Header */}
        <Card className={`border-0 shadow-2xl overflow-hidden ${
          passed 
            ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
            : 'bg-gradient-to-r from-orange-600 to-red-600'
        }`}>
          <CardContent className="p-8 sm:p-12 text-center text-white">
            <div className="text-7xl sm:text-9xl mb-6 animate-bounce">
              {performance.emoji}
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold mb-4">
              {performance.title}
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-2">
              {performance.message}
            </p>
            {lessonTitle && (
              <p className="text-lg text-white/80 mt-4">
                {lessonTitle}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Grade Card */}
          <Card className={`border-4 ${gradeInfo.border} shadow-2xl transform hover:scale-105 transition-transform`}>
            <CardContent className={`p-8 ${gradeInfo.bg} text-center`}>
              <Trophy className={`w-16 h-16 ${gradeInfo.color} mx-auto mb-4`} />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Grade</h2>
              <div className={`text-9xl font-bold ${gradeInfo.color} mb-4`}>
                {gradeInfo.grade}
              </div>
              <div className="relative w-full">
                <div className="text-6xl font-bold text-gray-900 mb-2">
                  {stats.accuracy}%
                </div>
                <Progress value={stats.accuracy} className="h-4 mb-2" />
                <p className="text-sm text-gray-600">
                  {stats.correctAnswers} out of {stats.totalQuestions} correct
                </p>
              </div>
            </CardContent>
          </Card>

          {/* XP & Stats Card */}
          <Card className="border-4 border-purple-200 shadow-2xl">
            <CardContent className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50">
              <div className="text-center mb-6">
                <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Total XP Earned</h2>
                <div className="text-7xl font-bold text-purple-600 mb-2">
                  {stats.totalXP}
                </div>
                <p className="text-gray-600">Experience Points</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border-2 border-purple-200 text-center">
                  <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900">{stats.streak}</div>
                  <p className="text-xs text-gray-600 mt-1">Best Streak</p>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-purple-200 text-center">
                  <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900">{stats.timeSpent}s</div>
                  <p className="text-xs text-gray-600 mt-1">Time Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <Card className="border-4 border-gray-200 shadow-xl">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              Performance Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-2xl p-6 border-4 border-green-200 text-center transform hover:scale-105 transition-transform">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <div className="text-5xl font-bold text-green-600 mb-2">
                  {stats.correctAnswers}
                </div>
                <p className="text-gray-700 font-semibold">Correct Answers</p>
                <p className="text-xs text-gray-600 mt-1">
                  {Math.round((stats.correctAnswers / stats.totalQuestions) * 100)}% accuracy
                </p>
              </div>

              <div className="bg-red-50 rounded-2xl p-6 border-4 border-red-200 text-center transform hover:scale-105 transition-transform">
                <XCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                <div className="text-5xl font-bold text-red-600 mb-2">
                  {stats.incorrectAnswers}
                </div>
                <p className="text-gray-700 font-semibold">Incorrect Answers</p>
                <p className="text-xs text-gray-600 mt-1">
                  {Math.round((stats.incorrectAnswers / stats.totalQuestions) * 100)}% missed
                </p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border-4 border-blue-200 text-center transform hover:scale-105 transition-transform">
                <Star className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {stats.totalQuestions}
                </div>
                <p className="text-gray-700 font-semibold">Total Questions</p>
                <p className="text-xs text-gray-600 mt-1">Quiz completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Badges */}
        {(isPerfect || isExcellent || stats.streak >= 5) && (
          <Card className="border-4 border-yellow-300 shadow-xl bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Award className="w-8 h-8 text-yellow-600" />
                Achievements Unlocked
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {isPerfect && (
                  <div className="bg-white rounded-xl p-6 border-4 border-green-400 text-center transform hover:scale-105 transition-transform">
                    <div className="text-5xl mb-3">🎯</div>
                    <h4 className="font-bold text-gray-900 text-lg">Perfect Score</h4>
                    <p className="text-sm text-gray-600 mt-1">100% Accuracy!</p>
                  </div>
                )}
                
                {isExcellent && !isPerfect && (
                  <div className="bg-white rounded-xl p-6 border-4 border-blue-400 text-center transform hover:scale-105 transition-transform">
                    <div className="text-5xl mb-3">⭐</div>
                    <h4 className="font-bold text-gray-900 text-lg">Excellence</h4>
                    <p className="text-sm text-gray-600 mt-1">90%+ Accuracy!</p>
                  </div>
                )}
                
                {stats.streak >= 5 && (
                  <div className="bg-white rounded-xl p-6 border-4 border-orange-400 text-center transform hover:scale-105 transition-transform">
                    <div className="text-5xl mb-3">🔥</div>
                    <h4 className="font-bold text-gray-900 text-lg">On Fire</h4>
                    <p className="text-sm text-gray-600 mt-1">{stats.streak} Question Streak!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            onClick={onBackToLesson}
            variant="outline"
            size="lg"
            className="py-6 text-lg border-2 hover:bg-gray-50"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Lesson
          </Button>

          <Button
            onClick={onRetry}
            variant="outline"
            size="lg"
            className="py-6 text-lg border-2 border-blue-400 text-blue-600 hover:bg-blue-50"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Retry Quiz
          </Button>

          {passed && (
            <Button
              onClick={onContinue}
              size="lg"
              className="py-6 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl transform hover:scale-105 transition-all"
            >
              Continue Learning
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>

        {/* Encouragement Message */}
        {!passed && (
          <Card className="border-4 border-blue-200 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6 text-center">
              <p className="text-lg text-gray-700 mb-2">
                <strong>📚 Need to review?</strong>
              </p>
              <p className="text-gray-600">
                You need 70% to pass. Review the lesson material and try again. Every attempt helps you learn better!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}