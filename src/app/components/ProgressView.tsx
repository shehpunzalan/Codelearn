import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  TrendingUp, Target, Award, CalendarDays, Activity, Timer, Keyboard, 
  Zap, Code, Brain, CheckCircle, Flame, Trophy
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ScrollArea } from './ui/scroll-area';
import { mockModules } from '../data/mockData';
import { getUserStats, getAllProgress, getAllSubmissions } from '../utils/storage';

interface ProgressViewProps {
  onBack: () => void;
}

interface PerformanceMetrics {
  totalTimeSpent: number;
  totalKeystrokes: number;
  totalSubmissions: number;
  averageSessionTime: number;
  codingStreak: number;
  lastActiveDate: string;
}

export function ProgressView({ onBack }: ProgressViewProps) {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    totalTimeSpent: 0,
    totalKeystrokes: 0,
    totalSubmissions: 0,
    averageSessionTime: 0,
    codingStreak: 7,
    lastActiveDate: new Date().toISOString()
  });

  // Load performance data from localStorage
  useEffect(() => {
    // Get current user
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    const userStats = getUserStats(user.id);
    const allSubmissions = getAllSubmissions(user.id);
    
    let totalTime = 0;
    let totalKeys = 0;
    let totalSubs = allSubmissions.length;
    
    // Calculate from actual submissions
    const allProgress = getAllProgress(user.id);
    allProgress.forEach((progress: any) => {
      totalTime += progress.timeSpent || 0;
    });

    const avgSessionTime = totalSubs > 0 ? Math.round(totalTime / totalSubs) : 0;

    setPerformanceMetrics({
      totalTimeSpent: totalTime,
      totalKeystrokes: totalKeys,
      totalSubmissions: totalSubs,
      averageSessionTime: avgSessionTime,
      codingStreak: 7,
      lastActiveDate: new Date().toISOString()
    });
  }, []);

  // Calculate overall statistics
  const calculateOverallStats = () => {
    const allSubmissions = JSON.parse(localStorage.getItem('allSubmissions') || '[]');
    const averageScore = allSubmissions.length > 0
      ? Math.round(allSubmissions.reduce((sum: number, s: any) => sum + s.score, 0) / allSubmissions.length)
      : 0;
    
    const modules = mockModules;
    const totalLessons = modules.reduce((sum, m) => sum + m.totalLessons, 0);
    const completedLessons = modules.reduce((sum, m) => sum + m.completedLessons, 0);
    const completedModules = modules.filter(m => m.progress === 100).length;
    
    return {
      averageScore,
      totalLessons,
      completedLessons,
      totalModules: modules.length,
      completedModules
    };
  };

  const stats = calculateOverallStats();

  // Weekly Progress Data
  const weeklyData = [
    { id: 'w1', week: 'Week 1', score: 68, time: 3.2 },
    { id: 'w2', week: 'Week 2', score: 72, time: 4.1 },
    { id: 'w3', week: 'Week 3', score: 78, time: 3.8 },
    { id: 'w4', week: 'Week 4', score: 82, time: 4.5 },
    { id: 'w5', week: 'Week 5', score: 88, time: 3.9 },
    { id: 'w6', week: 'Week 6', score: 92, time: 4.2 },
  ];

  // OOP Principles Mastery Data
  const oopPrinciplesData = [
    { id: 'oop1', principle: 'Classes', score: 95 },
    { id: 'oop2', principle: 'Encapsulation', score: 85 },
    { id: 'oop3', principle: 'Inheritance', score: 78 },
    { id: 'oop4', principle: 'Polymorphism', score: 72 },
    { id: 'oop5', principle: 'Abstraction', score: 68 },
    { id: 'oop6', principle: 'Interfaces', score: 60 },
  ];

  // Topic Mastery Distribution
  const topicDistributionData = [
    { id: 'mastered', name: 'Mastered', value: 40, color: '#10B981' },
    { id: 'proficient', name: 'Proficient', value: 35, color: '#3B82F6' },
    { id: 'learning', name: 'Learning', value: 25, color: '#F59E0B' },
  ];

  // Java OOP Achievements
  const achievements = [
    {
      id: 1,
      title: 'First Java Class',
      description: 'Create your first class',
      date: 'Feb 15, 2024',
      icon: '🎯',
      color: 'bg-yellow-100',
      unlocked: true
    },
    {
      id: 2,
      title: 'OOP Master',
      description: 'Master all OOP modules',
      date: stats.completedModules === stats.totalModules ? 'Feb 20, 2024' : 'Locked',
      icon: '🎯',
      color: 'bg-blue-100',
      unlocked: stats.completedModules === stats.totalModules
    },
    {
      id: 3,
      title: 'Perfect Score',
      description: 'Score 100% on assignment',
      date: stats.averageScore >= 100 ? 'Feb 25, 2024' : 'Locked',
      icon: '💯',
      color: 'bg-pink-100',
      unlocked: stats.averageScore >= 100
    },
    {
      id: 4,
      title: 'Fast Learner',
      description: 'Complete 5 lessons in a day',
      date: 'Mar 01, 2024',
      icon: '⚡',
      color: 'bg-yellow-100',
      unlocked: true
    },
  ];

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Badge className="bg-purple-600 text-white px-3 py-1">CCS108</Badge>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress & Performance</h1>
          <p className="text-gray-600">Track your learning journey and performance metrics powered by AI</p>
        </div>
      </div>

      {/* ============================================ */}
      {/* LEARNING PROGRESS SECTION */}
      {/* ============================================ */}
      <Card className="border-2 border-blue-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Learning Progress</h2>
            <Badge className="bg-blue-600 text-white ml-auto">CCS108 - Java OOP</Badge>
          </div>

          {/* Learning Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-blue-600" />
                <p className="text-xs text-gray-700 font-medium">Average Score</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.averageScore}%</p>
              <p className="text-xs text-gray-600 mt-1">Overall performance</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <p className="text-xs text-gray-700 font-medium">Lessons Completed</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.completedLessons}/{stats.totalLessons}</p>
              <p className="text-xs text-gray-600 mt-1">{Math.round((stats.completedLessons / stats.totalLessons) * 100)}% complete</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <p className="text-xs text-gray-700 font-medium">Modules Completed</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.completedModules}/{stats.totalModules}</p>
              <p className="text-xs text-gray-600 mt-1">Learning modules</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-600" />
                <p className="text-xs text-gray-700 font-medium">Current Streak</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{performanceMetrics.codingStreak}</p>
              <p className="text-xs text-gray-600 mt-1">Days active</p>
            </div>
          </div>

          {/* Learning Progress Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Progress Trend */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-base font-bold text-gray-900 mb-4">Weekly Score Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="week"
                    tick={{ fontSize: 11 }}
                    stroke="#6B7280"
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
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
                    type="monotone" 
                    dataKey="score"
                    name="Score"
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-3 bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-900">
                  📈 <span className="font-semibold">27-point improvement</span> detected by neural network over 6 weeks
                </p>
              </div>
            </div>

            {/* OOP Principles Mastery */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-base font-bold text-gray-900 mb-4">OOP Principles Mastery</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={oopPrinciplesData} layout="vertical" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    type="number" 
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    stroke="#6B7280"
                  />
                  <YAxis 
                    type="category"
                    dataKey="principle" 
                    tick={{ fontSize: 11 }}
                    stroke="#6B7280"
                    width={90}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="score" name="Mastery" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-gray-900">
                  💡 <span className="font-semibold">Focus on Polymorphism and Abstraction</span> for balanced OOP knowledge
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================ */}
      {/* AI PATTERN RECOGNITION METRICS SECTION */}
      {/* ============================================ */}
      <Card className="border-2 border-indigo-200 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Neural Network Pattern Recognition</h2>
            <Badge className="bg-indigo-600 text-white ml-auto">AI-Powered Analysis</Badge>
          </div>

          {/* Pattern Recognition Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border-2 border-purple-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔍</span>
                <p className="text-xs text-gray-700 font-medium">Patterns Detected</p>
              </div>
              <p className="text-3xl font-bold text-purple-700">189</p>
              <p className="text-xs text-gray-600 mt-1">Across all modules</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-blue-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💻</span>
                <p className="text-xs text-gray-700 font-medium">Code Examples</p>
              </div>
              <p className="text-3xl font-bold text-blue-700">235</p>
              <p className="text-xs text-gray-600 mt-1">Practical samples</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-green-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">✅</span>
                <p className="text-xs text-gray-700 font-medium">OOP Principles</p>
              </div>
              <p className="text-3xl font-bold text-green-700">28</p>
              <p className="text-xs text-gray-600 mt-1">Concepts identified</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-orange-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎯</span>
                <p className="text-xs text-gray-700 font-medium">Recognition Rate</p>
              </div>
              <p className="text-3xl font-bold text-orange-700">94%</p>
              <p className="text-xs text-gray-600 mt-1">Accuracy score</p>
            </div>
          </div>

          {/* Module-wise Pattern Analysis */}
          <div className="bg-white rounded-lg p-5 border border-gray-200 mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-600" />
              Module Pattern Analysis
            </h3>
            <div className="space-y-3">
              {mockModules.slice(0, 6).map((module, idx) => (
                <div key={module.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{module.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className="font-semibold text-purple-700">🔍 {module.patternMetrics?.patternsDetected || 0}</span> patterns
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-semibold text-blue-700">💻 {module.patternMetrics?.codeExamples || 0}</span> examples
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {module.patternMetrics?.oopPrinciples?.slice(0, 2).map((principle, pidx) => (
                      <Badge key={pidx} className="text-xs px-2 py-0 bg-indigo-100 text-indigo-700 border-indigo-200">
                        {principle}
                      </Badge>
                    ))}
                    {(module.patternMetrics?.oopPrinciples?.length || 0) > 2 && (
                      <Badge className="text-xs px-2 py-0 bg-gray-100 text-gray-600">
                        +{(module.patternMetrics?.oopPrinciples?.length || 0) - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>🧠</span> Neural Network Insights
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span><strong>Strong:</strong> Class structure and encapsulation patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span><strong>Good:</strong> Constructor usage and method organization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">→</span>
                  <span><strong>Improve:</strong> Inheritance hierarchies and polymorphic behavior</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">→</span>
                  <span><strong>Practice:</strong> Abstract classes and interface implementations</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>📊</span> Pattern Recognition Sources
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-purple-50 rounded border border-purple-100">
                  <div className="flex items-center gap-2">
                    <Badge className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 border-purple-200">
                      🧠 AI Neural Network
                    </Badge>
                    <span className="text-sm text-gray-700">4 modules</span>
                  </div>
                  <span className="text-sm font-semibold text-purple-700">87 patterns</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-100">
                  <div className="flex items-center gap-2">
                    <Badge className="text-xs px-2 py-0.5 bg-green-100 text-green-700 border-green-200">
                      👨‍🏫 Instructor
                    </Badge>
                    <span className="text-sm text-gray-700">4 modules</span>
                  </div>
                  <span className="text-sm font-semibold text-green-700">51 patterns</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-orange-50 rounded border border-orange-100">
                  <div className="flex items-center gap-2">
                    <Badge className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 border-orange-200">
                      📖 Curriculum
                    </Badge>
                    <span className="text-sm text-gray-700">3 modules</span>
                  </div>
                  <span className="text-sm font-semibold text-orange-700">39 patterns</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-100">
                  <div className="flex items-center gap-2">
                    <Badge className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 border-blue-200">
                      🤖 AI Generated
                    </Badge>
                    <span className="text-sm text-gray-700">1 module</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-700">14 patterns</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================ */}
      {/* PERFORMANCE ANALYTICS SECTION */}
      {/* ============================================ */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
            <Badge className="bg-purple-600 text-white ml-auto">Real-Time Tracking</Badge>
          </div>

          {/* Performance Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-5 h-5 text-blue-600" />
                <p className="text-xs text-gray-700 font-medium">Total Study Time</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {formatTime(performanceMetrics.totalTimeSpent)}
              </p>
              <p className="text-xs text-gray-600 mt-1">Across all sessions</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Keyboard className="w-5 h-5 text-green-600" />
                <p className="text-xs text-gray-700 font-medium">Total Keystrokes</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {performanceMetrics.totalKeystrokes.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-1">Code typing activity</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-5 h-5 text-purple-600" />
                <p className="text-xs text-gray-700 font-medium">Code Submissions</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {performanceMetrics.totalSubmissions}
              </p>
              <p className="text-xs text-gray-600 mt-1">Total assignments</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-orange-600" />
                <p className="text-xs text-gray-700 font-medium">Avg Session Time</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {formatTime(performanceMetrics.averageSessionTime)}
              </p>
              <p className="text-xs text-gray-600 mt-1">Per coding session</p>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-6 h-6 text-blue-600" />
                <p className="text-sm font-semibold text-gray-900">Study Pattern</p>
              </div>
              <p className="text-sm text-gray-900">
                {performanceMetrics.codingStreak >= 5 
                  ? '🔥 You\'re on fire! Excellent consistency'
                  : 'Keep building your learning streak'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-6 h-6 text-green-600" />
                <p className="text-sm font-semibold text-gray-900">Code Quality</p>
              </div>
              <p className="text-sm text-gray-900">
                {stats.averageScore >= 80
                  ? '⭐ Outstanding code quality maintained'
                  : 'Focus on OOP principles for better scores'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-6 h-6 text-purple-600" />
                <p className="text-sm font-semibold text-gray-900">Coding Velocity</p>
              </div>
              <p className="text-sm text-gray-900">
                {performanceMetrics.totalKeystrokes > 5000
                  ? '🚀 High coding velocity detected'
                  : 'Building momentum with practice'}
              </p>
            </div>
          </div>

          {/* AI-Powered Performance Insights */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-5 border-2 border-purple-300">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">AI-Powered Performance Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-900">You excel at class structures and constructors. Keep it up!</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-900">Consider reviewing encapsulation principles for better scores</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-900">Your coding efficiency has improved by 15% this week</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================ */}
      {/* ADDITIONAL ANALYTICS */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Mastery Distribution */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Topic Mastery Distribution</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={topicDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                    >
                      {topicDistributionData.map((entry, index) => (
                        <Cell key={`cell-${entry.id}-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="text-center bg-white rounded-lg p-2 border border-gray-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <p className="text-lg font-bold text-gray-900">40%</p>
                </div>
                <p className="text-xs text-gray-600">Mastered</p>
              </div>
              <div className="text-center bg-white rounded-lg p-2 border border-gray-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <p className="text-lg font-bold text-gray-900">35%</p>
                </div>
                <p className="text-xs text-gray-600">Proficient</p>
              </div>
              <div className="text-center bg-white rounded-lg p-2 border border-gray-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <p className="text-lg font-bold text-gray-900">25%</p>
                </div>
                <p className="text-xs text-gray-600">Learning</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Java OOP Achievements */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Java OOP Achievements</h3>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2 pr-4">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id}
                      className={`flex items-center gap-3 p-2 rounded-lg border ${
                        achievement.unlocked 
                          ? 'bg-yellow-50 border-yellow-400' 
                          : 'bg-gray-100 border-gray-300 opacity-60'
                      }`}
                    >
                      <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${achievement.color} text-xl`}>
                        {achievement.unlocked ? achievement.icon : '🔒'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900">{achievement.title}</h4>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* ============================================ */}
      {/* PROGRESS SUMMARY */}
      {/* ============================================ */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900">Progress Summary</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <p className="text-sm font-semibold text-gray-900">Overall Average</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.averageScore}%</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-semibold text-gray-900">Lessons Completed</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.completedLessons}/{stats.totalLessons}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-purple-600" />
                <p className="text-sm font-semibold text-gray-900">Achievements</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{achievements.filter(a => a.unlocked).length}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays className="w-5 h-5 text-orange-600" />
                <p className="text-sm font-semibold text-gray-900">Days Active</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">42</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="flex justify-start">
        <Button onClick={onBack} variant="outline" className="gap-2">
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );
}