import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, User, BookOpen, Award, TrendingUp, 
  Brain, CheckCircle, Clock, AlertCircle, FileText,
  Target, BarChart3, Calendar, Mail, MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { Module } from '../types';

interface StudentDetailViewProps {
  studentId: string;
  studentName: string;
  onBack: () => void;
  modules: Module[];
}

interface StudentProgress {
  userId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  lastAccessed: string;
  timeSpent: number;
}

interface QuizAttempt {
  quizId: string;
  score: number;
  maxScore: number;
  completedAt: string;
  moduleId: string;
  lessonId: string;
}

interface AIFeedback {
  feedbackId: string;
  code: string;
  feedback: string;
  confidence: number;
  timestamp: string;
  moduleId: string;
}

export function StudentDetailView({ studentId, studentName, onBack, modules }: StudentDetailViewProps) {
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<StudentProgress[]>([]);
  const [quizData, setQuizData] = useState<QuizAttempt[]>([]);
  const [feedbackData, setFeedbackData] = useState<AIFeedback[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'progress' | 'quizzes' | 'feedback'>('overview');

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);

      // Fetch progress
      const progressResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aaa3a86f/progress/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (progressResponse.ok) {
        const progressResult = await progressResponse.json();
        if (progressResult.success) {
          setProgressData(progressResult.data);
        }
      }

      // Fetch quiz attempts
      const quizResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aaa3a86f/quiz/attempts/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (quizResponse.ok) {
        const quizResult = await quizResponse.json();
        if (quizResult.success) {
          setQuizData(quizResult.data);
        }
      }

      // Fetch AI feedback
      const feedbackResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aaa3a86f/feedback/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (feedbackResponse.ok) {
        const feedbackResult = await feedbackResponse.json();
        if (feedbackResult.success) {
          setFeedbackData(feedbackResult.data);
        }
      }

      toast.success('Student data loaded successfully');
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Failed to load student data');
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    // Demo progress data
    setProgressData([
      {
        userId: studentId,
        moduleId: 'mod1',
        lessonId: 'lesson1',
        completed: true,
        lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        timeSpent: 1800
      },
      {
        userId: studentId,
        moduleId: 'mod1',
        lessonId: 'lesson2',
        completed: true,
        lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        timeSpent: 2100
      },
      {
        userId: studentId,
        moduleId: 'mod2',
        lessonId: 'lesson1',
        completed: false,
        lastAccessed: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        timeSpent: 900
      }
    ]);

    // Demo quiz data
    setQuizData([
      {
        quizId: 'quiz1',
        score: 9,
        maxScore: 10,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        moduleId: 'mod1',
        lessonId: 'lesson1'
      },
      {
        quizId: 'quiz2',
        score: 8,
        maxScore: 10,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        moduleId: 'mod1',
        lessonId: 'lesson2'
      }
    ]);

    // Demo feedback data
    setFeedbackData([
      {
        feedbackId: 'fb1',
        code: 'public class HelloWorld { ... }',
        feedback: 'Great use of OOP principles! Your code is well-structured.',
        confidence: 0.92,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        moduleId: 'mod1'
      }
    ]);
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalLessons = progressData.length;
    // Count completed lessons
    const completedLessons = progressData.filter(progressItem => progressItem.completed).length;
    const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const totalQuizzes = quizData.length;
    const avgQuizScore = totalQuizzes > 0 
      ? Math.round((quizData.reduce((sum, q) => sum + (q.score / q.maxScore * 100), 0) / totalQuizzes))
      : 0;

    const totalTimeSpent = progressData.reduce((sum, p) => sum + p.timeSpent, 0);
    const avgTimePerLesson = totalLessons > 0 ? Math.round(totalTimeSpent / totalLessons / 60) : 0;

    const totalFeedback = feedbackData.length;

    return {
      completionRate,
      completedLessons,
      totalLessons,
      avgQuizScore,
      totalQuizzes,
      avgTimePerLesson,
      totalFeedback
    };
  };

  const stats = calculateStats();

  // Get module progress breakdown
  const getModuleProgress = () => {
    const moduleProgress = new Map<string, { completed: number; total: number }>();

    progressData.forEach(p => {
      if (!moduleProgress.has(p.moduleId)) {
        moduleProgress.set(p.moduleId, { completed: 0, total: 0 });
      }
      const current = moduleProgress.get(p.moduleId)!;
      current.total += 1;
      if (p.completed) {
        current.completed += 1;
      }
    });

    return Array.from(moduleProgress.entries()).map(([moduleId, data]) => {
      const module = modules.find(m => m.id === moduleId);
      return {
        moduleId,
        moduleName: module?.title || moduleId,
        ...data,
        percentage: Math.round((data.completed / data.total) * 100)
      };
    });
  };

  const moduleProgress = getModuleProgress();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Students
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <User className="w-8 h-8 text-blue-600" />
              {studentName}
            </h1>
            <p className="text-gray-600 mt-1">
              Detailed learning analytics and progress overview
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info(`Sending message to ${studentName}`)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Message
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Downloading report...')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                <p className="text-3xl font-bold text-blue-700">{stats.completionRate}%</p>
                <p className="text-xs text-gray-600 mt-1">{stats.completedLessons}/{stats.totalLessons} lessons</p>
              </div>
              <CheckCircle className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Quiz Score</p>
                <p className="text-3xl font-bold text-green-700">{stats.avgQuizScore}%</p>
                <p className="text-xs text-gray-600 mt-1">{stats.totalQuizzes} quizzes taken</p>
              </div>
              <Award className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Time/Lesson</p>
                <p className="text-3xl font-bold text-purple-700">{stats.avgTimePerLesson}</p>
                <p className="text-xs text-gray-600 mt-1">minutes</p>
              </div>
              <Clock className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">AI Feedback</p>
                <p className="text-3xl font-bold text-orange-700">{stats.totalFeedback}</p>
                <p className="text-xs text-gray-600 mt-1">submissions</p>
              </div>
              <Brain className="w-10 h-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <Button
          variant={selectedTab === 'overview' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('overview')}
          className="rounded-b-none"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={selectedTab === 'progress' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('progress')}
          className="rounded-b-none"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Progress
        </Button>
        <Button
          variant={selectedTab === 'quizzes' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('quizzes')}
          className="rounded-b-none"
        >
          <Target className="w-4 h-4 mr-2" />
          Quizzes
        </Button>
        <Button
          variant={selectedTab === 'feedback' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('feedback')}
          className="rounded-b-none"
        >
          <Brain className="w-4 h-4 mr-2" />
          AI Feedback
        </Button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <Card className="border-0 shadow-md">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Loading student data...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {selectedTab === 'overview' && (
            <div className="space-y-4">
              {/* Module Progress */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Module Progress</CardTitle>
                  <CardDescription>Completion status across all modules</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {moduleProgress.length === 0 ? (
                    <p className="text-gray-600 text-center py-4">No progress data available</p>
                  ) : (
                    moduleProgress.map((mp) => (
                      <div key={mp.moduleId} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{mp.moduleName}</span>
                          <span className="text-sm text-gray-600">{mp.completed}/{mp.total} lessons</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${mp.percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{mp.percentage}% Complete</span>
                          {mp.percentage === 100 && (
                            <Badge className="bg-green-100 text-green-800 border-0 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Performance Indicators */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Performance Indicators</CardTitle>
                  <CardDescription>Key metrics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Strong Quiz Performance</p>
                          <p className="text-sm text-gray-600">Average score above 80%</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-0">Excellent</Badge>
                    </div>

                    {stats.avgTimePerLesson < 20 && (
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <div>
                            <p className="font-medium text-gray-900">Quick Study Sessions</p>
                            <p className="text-sm text-gray-600">Consider spending more time on lessons</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800 border-0">Monitor</Badge>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <Brain className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">AI Feedback Engagement</p>
                          <p className="text-sm text-gray-600">{stats.totalFeedback} code submissions analyzed</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-0">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedTab === 'progress' && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Lesson Progress History</CardTitle>
                <CardDescription>Detailed view of all lesson activities</CardDescription>
              </CardHeader>
              <CardContent>
                {progressData.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No progress data available</p>
                ) : (
                  <div className="space-y-3">
                    {progressData.map((progress, idx) => {
                      const module = modules.find(m => m.id === progress.moduleId);
                      return (
                        <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3 flex-1">
                            {progress.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Clock className="w-5 h-5 text-yellow-600" />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{module?.title || progress.moduleId}</p>
                              <p className="text-sm text-gray-600">Lesson {progress.lessonId}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTime(progress.timeSpent)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(progress.lastAccessed)}
                            </span>
                            {progress.completed ? (
                              <Badge className="bg-green-100 text-green-800 border-0">Completed</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800 border-0">In Progress</Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {selectedTab === 'quizzes' && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Quiz Attempts</CardTitle>
                <CardDescription>All quiz submissions and scores</CardDescription>
              </CardHeader>
              <CardContent>
                {quizData.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No quiz attempts available</p>
                ) : (
                  <div className="space-y-3">
                    {quizData.map((quiz, idx) => {
                      const percentage = Math.round((quiz.score / quiz.maxScore) * 100);
                      const module = modules.find(m => m.id === quiz.moduleId);
                      return (
                        <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${
                              percentage >= 90 ? 'bg-green-100 text-green-700' :
                              percentage >= 80 ? 'bg-blue-100 text-blue-700' :
                              percentage >= 70 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {percentage}%
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{module?.title || quiz.moduleId}</p>
                              <p className="text-sm text-gray-600">Lesson {quiz.lessonId} - Quiz {quiz.quizId}</p>
                              <p className="text-xs text-gray-500 mt-1">Score: {quiz.score}/{quiz.maxScore}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(quiz.completedAt)}
                            </span>
                            {percentage >= 90 ? (
                              <Badge className="bg-green-100 text-green-800 border-0">Excellent</Badge>
                            ) : percentage >= 80 ? (
                              <Badge className="bg-blue-100 text-blue-800 border-0">Very Good</Badge>
                            ) : percentage >= 70 ? (
                              <Badge className="bg-yellow-100 text-yellow-800 border-0">Good</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800 border-0">Needs Review</Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {selectedTab === 'feedback' && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>AI Feedback History</CardTitle>
                <CardDescription>Neural network analysis of code submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {feedbackData.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No AI feedback available</p>
                ) : (
                  <div className="space-y-4">
                    {feedbackData.map((feedback, idx) => {
                      const confidencePercentage = Math.round(feedback.confidence * 100);
                      const module = modules.find(m => m.id === feedback.moduleId);
                      return (
                        <div key={idx} className="p-4 border border-gray-200 rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Brain className="w-5 h-5 text-purple-600" />
                              <div>
                                <p className="font-medium text-gray-900">{module?.title || feedback.moduleId}</p>
                                <p className="text-xs text-gray-500">{formatDate(feedback.timestamp)}</p>
                              </div>
                            </div>
                            <Badge className="bg-purple-100 text-purple-800 border-0">
                              {confidencePercentage}% confidence
                            </Badge>
                          </div>
                          <div className="bg-gray-50 p-3 rounded border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Code Sample:</p>
                            <pre className="text-sm text-gray-700 font-mono overflow-x-auto">{feedback.code}</pre>
                          </div>
                          <div className="bg-blue-50 p-3 rounded border border-blue-200">
                            <p className="text-xs text-blue-600 mb-1">AI Analysis:</p>
                            <p className="text-sm text-gray-700">{feedback.feedback}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}