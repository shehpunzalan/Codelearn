import React, { useEffect, useState } from 'react';
import { User, Module } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BookOpen, Target, TrendingUp, Clock, Brain, CheckCircle, Loader, Code, MessageSquare, BarChart3, Edit, Activity, FileText, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getUserStats, getAllProgress } from '../utils/storage';
import { generateStudentInsights } from '../utils/aiFeedback';

interface StudentDashboardProps {
  user: User;
  modules: Module[];
  onSelectModule: (moduleId: string) => void;
  onViewProgress: () => void;
  onViewFeedback: () => void;
  onNavigate?: (view: string) => void;
}

export function StudentDashboard({ user, modules, onSelectModule, onViewFeedback, onViewProgress, onNavigate }: StudentDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Load real user stats
    const userStats = getUserStats(user.id);
    setStats(userStats);
    
    // Load progress for insights
    // Get all progress records for the current user
    const allProgress = getAllProgress(user.id);
    
    // Extract scores from completed lessons
    const scores = allProgress.filter(progressItem => progressItem.completed).map(progressItem => progressItem.score);
    
    // Extract lesson IDs from completed lessons
    const completedLessonIds = allProgress.filter(progressItem => progressItem.completed).map(progressItem => progressItem.lessonId);
    
    const aiInsights = generateStudentInsights(completedLessonIds, scores);
    setInsights(aiInsights);
  }, [user.id]);
  
  const completedModules = stats?.totalModulesCompleted || 0;
  const averageScore = stats?.averageScore || 0;
  const totalTime = stats?.totalTimeSpent || 24;
  const streak = stats?.streak || 7;

  // Handlers for stat card clicks
  const handleModulesClick = () => {
    onSelectModule('mod1');
    toast.info('Navigating to course modules...');
  };

  const handleStreakClick = () => {
    toast.success('🔥 Keep your streak going! Come back tomorrow to continue.');
  };

  const handlePerformanceClick = () => {
    onViewProgress();
    toast.info('Opening performance dashboard...');
  };

  const handleTimeClick = () => {
    toast.info('Viewing your learning time statistics...');
  };
  
  // Mock recent activities
  const recentActivities = [
    {
      id: 1,
      module: 'Module 2: Student Class Implementation',
      topic: 'Classes and Objects',
      time: '2 hours ago',
      status: 'completed' as const,
      score: 92
    },
    {
      id: 2,
      module: 'Module 3: Employee Management',
      topic: 'Encapsulation',
      time: '1 day ago',
      status: 'in-progress' as const,
      score: 0
    },
    {
      id: 3,
      module: 'Module 4: Vehicle Hierarchy',
      topic: 'Inheritance',
      time: '3 days ago',
      status: 'completed' as const,
      score: 88
    }
  ];

  // Filter activities based on search
  const filteredActivities = recentActivities.filter(activity =>
    activity.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Badge className="bg-blue-600 text-white px-3 py-1">CCS108</Badge>
        <Badge variant="outline" className="border-green-300 text-green-700">Student Portal</Badge>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}! Continue your Object-Oriented Programming journey</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search modules, topics, or activities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          className="border-0 shadow-md bg-gradient-to-br from-green-500 to-green-600 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 hover:from-green-600 hover:to-green-700"
          onClick={handleModulesClick}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-black" />
            </div>
            <p className="text-sm font-medium mb-1 text-black">Modules Completed</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-black">{completedModules}</span>
              <span className="text-xl text-black/80">/{modules.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-blue-600 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 hover:from-blue-600 hover:to-blue-700"
          onClick={handleStreakClick}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-black" />
              <Badge className="bg-white/20 text-black border-0">Current Streak</Badge>
            </div>
            <p className="text-sm font-medium mb-1 text-black">Learning Streak</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-black">{streak}</span>
              <span className="text-xl text-black/80">days</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-purple-600 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 hover:from-purple-600 hover:to-purple-700"
          onClick={handlePerformanceClick}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-black" />
              <Badge className="bg-white/20 text-black border-0">Average Score</Badge>
            </div>
            <p className="text-sm font-medium mb-1 text-black">Overall Performance</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-black">{averageScore}</span>
              <span className="text-xl text-black/80">%</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-0 shadow-md bg-gradient-to-br from-orange-500 to-red-500 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 hover:from-orange-600 hover:to-red-600"
          onClick={handleTimeClick}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-black" />
              <Badge className="bg-white/20 text-black border-0">Time Spent</Badge>
            </div>
            <p className="text-sm font-medium mb-1 text-black">Total Learning Time</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-black">{totalTime}</span>
              <span className="text-xl text-black/80">h</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Insights */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">AI-Powered Insights</h2>
            <Badge className="ml-auto bg-purple-600 text-white">Neural Network Analysis</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.length > 0 ? (
              insights.map((insight, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-900">{insight}</p>
                </div>
              ))
            ) : (
              <>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-900">🚀 Start coding to receive personalized AI insights!</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-900">📊 Complete lessons to unlock pattern recognition feedback</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-900">🎯 Our neural network will analyze your coding style</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent CCS108 Activities</h2>
              <div className="space-y-4">
                {filteredActivities.length > 0 ? filteredActivities.map((activity) => (
                  <div key={activity.id} className="border-l-4 border-green-500 pl-4 py-3">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold text-gray-900">{activity.module}</h3>
                        <p className="text-sm text-gray-900">{activity.topic}</p>
                      </div>
                      <div className="text-right">
                        {activity.status === 'completed' ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Completed
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                            In Progress
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-500">{activity.time}</p>
                      {activity.status === 'completed' && (
                        <p className="text-sm font-semibold text-gray-900">{activity.score}%</p>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No activities found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Student Use Cases */}
        <div>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Student Actions</h2>
              <div className="space-y-3">
                <Button 
                  onClick={() => onSelectModule('mod1')}
                  className="w-full justify-start h-12 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                  variant="outline"
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  Access Modules
                </Button>
                
                <Button 
                  onClick={onViewFeedback}
                  className="w-full justify-start h-12 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                  variant="outline"
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  View My Feedback
                </Button>
                
                <Button 
                  onClick={onViewProgress}
                  className="w-full justify-start h-12 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                  variant="outline"
                >
                  <Activity className="w-5 h-5 mr-3" />
                  Performance Monitoring
                </Button>
                
                <Button 
                  onClick={() => onNavigate?.('references')}
                  className="w-full justify-start h-12 bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200"
                  variant="outline"
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  View References (IEEE)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
