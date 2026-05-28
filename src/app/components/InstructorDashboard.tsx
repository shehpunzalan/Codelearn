import React, { useState } from 'react';
import { User, Module } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Users, BookOpen, TrendingUp, Brain, Activity,
  AlertCircle, MessageSquare, Award, Download, Bell, Search
} from 'lucide-react';
import { toast } from 'sonner';
import { createModuleNotification, createActivityNotification, createAnnouncementNotification } from '../utils/notifications';
import { AllStudentsView } from './AllStudentsView';
import { StudentDetailView } from './StudentDetailView';

interface InstructorDashboardProps {
  user: User;
  modules: Module[];
  onSelectModule: (moduleId: string) => void;
  onNavigate?: (view: string) => void;
}

export function InstructorDashboard({ user, modules, onSelectModule, onNavigate }: InstructorDashboardProps) {
  const [interventionDialogOpen, setInterventionDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [interventionMessage, setInterventionMessage] = useState('');
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null);
  const [viewingStudentName, setViewingStudentName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const totalStudents = 42;
  const activeStudents = 38;
  const totalLessons = modules.reduce((sum, m) => sum + m.totalLessons, 0);
  const avgCompletion = 68;

  // Top Performing Students
  const topStudents = [
    { id: 1, name: 'Maria Santos', avgScore: 94, completed: 8, trend: 'up' },
    { id: 2, name: 'John Carlo Reyes', avgScore: 91, completed: 7, trend: 'up' },
    { id: 3, name: 'Sarah Mae Gonzales', avgScore: 89, completed: 7, trend: 'stable' },
  ];

  // Students Needing Attention
  const needsAttention = [
    { id: 1, name: 'Daniel Patrick Lopez', avgScore: 52, issues: ['Polymorphism', 'Abstraction'], lastActive: '3 days ago' },
    { id: 2, name: 'Vincent Paul Morales', avgScore: 46, issues: ['Inheritance', 'Code Quality'], lastActive: '4 days ago' },
  ];

  // Filter students based on search
  const filteredTopStudents = topStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNeedsAttention = needsAttention.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.issues.some(issue => issue.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendIntervention = (student: any) => {
    setSelectedStudent(student);
    // Pre-fill message with AI-generated suggestion
    const message = `Dear ${student.name},\n\nI noticed you've been struggling with ${student.issues.join(' and ')}. I'd like to offer some additional support.\n\nWould you be available for a one-on-one session this week? We can work through these concepts together and ensure you're feeling confident with the material.\n\nI'm also assigning some targeted practice exercises that will help reinforce these concepts.\n\nBest regards,\n${user.name}`;
    setInterventionMessage(message);
    setInterventionDialogOpen(true);
  };

  const confirmSendIntervention = () => {
    if (!interventionMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    toast.success(`Intervention message sent to ${selectedStudent.name}!`);
    setInterventionDialogOpen(false);
    setInterventionMessage('');
    setSelectedStudent(null);
  };

  // Handlers for stat card clicks
  const handleStudentsClick = () => {
    setShowAllStudents(true);
  };

  const handleModulesClick = () => {
    onNavigate?.('course-management');
    toast.info('Navigating to course management...');
  };

  const handleCompletionClick = () => {
    onNavigate?.('monitoring');
    toast.info('Opening analytics dashboard...');
  };

  const handlePatternsClick = () => {
    onNavigate?.('monitoring');
    toast.info('Viewing detected patterns...');
  };

  // Demo: Send test notifications to students
  const handleSendDemoNotifications = () => {
    // Get student IDs (in a real app, this would fetch actual student IDs)
    const studentIds = ['student1'];
    
    // Send different types of notifications
    createModuleNotification(
      studentIds,
      'Module 11: Advanced Design Patterns',
      'mod11',
      user.name
    );
    
    createActivityNotification(
      studentIds,
      'Implement Factory Pattern',
      'mod11',
      'lesson1',
      user.name,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    );
    
    createAnnouncementNotification(
      studentIds,
      'Midterm Exam Schedule',
      'The midterm exam will be held on March 15, 2026. Please review Modules 1-5.',
      user.name
    );
    
    toast.success('📢 3 notifications sent to students!');
  };

  // If showing all students, render that view instead
  if (showAllStudents) {
    return (
      <AllStudentsView 
        onBack={() => setShowAllStudents(false)}
        onViewStudent={(userId, userName) => {
          setViewingStudentId(userId);
          setViewingStudentName(userName);
          setShowAllStudents(false);
        }}
      />
    );
  }

  // If viewing a specific student, render the student detail view
  if (viewingStudentId) {
    return (
      <StudentDetailView 
        studentId={viewingStudentId} 
        studentName={viewingStudentName} 
        onBack={() => {
          setViewingStudentId(null);
          setViewingStudentName('');
          setShowAllStudents(true);
        }}
        modules={modules}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-purple-600 text-white px-3 py-1">CCS108</Badge>
            <Badge variant="outline" className="border-blue-300 text-blue-700">Instructor</Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user.name}! Monitor and enhance student learning with AI-powered insights.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search students by name or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-blue-600 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 hover:from-blue-600 hover:to-blue-700"
          onClick={handleStudentsClick}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-black" />
              <Badge className="bg-white/20 text-black border-0">Active</Badge>
            </div>
            <p className="text-sm font-medium mb-1 text-black">Total Students</p>
            <p className="text-4xl font-bold text-black">{totalStudents}</p>
            <p className="text-xs mt-2 text-black">{activeStudents} active this week</p>
          </CardContent>
        </Card>

        <Card 
          className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-purple-600 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 hover:from-purple-600 hover:to-purple-700"
          onClick={handleModulesClick}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-black" />
              <Badge className="bg-white/20 text-black border-0">Content</Badge>
            </div>
            <p className="text-sm font-medium mb-1 text-black">Course Modules</p>
            <p className="text-4xl font-bold text-black">{modules.length}</p>
            <p className="text-xs mt-2 text-black">{totalLessons} total lessons</p>
          </CardContent>
        </Card>

        <Card 
          className="border-0 shadow-md bg-gradient-to-br from-green-500 to-green-600 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 hover:from-green-600 hover:to-green-700"
          onClick={handleCompletionClick}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-black" />
              <Badge className="bg-white/20 text-black border-0">Analytics</Badge>
            </div>
            <p className="text-sm font-medium mb-1 text-black">Avg Completion</p>
            <p className="text-4xl font-bold text-black">{avgCompletion}%</p>
            <p className="text-xs mt-2 text-black">↑ 12% from last month</p>
          </CardContent>
        </Card>

        <Card 
          className="border-0 shadow-md bg-gradient-to-br from-orange-500 to-red-500 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 hover:from-orange-600 hover:to-red-600"
          onClick={handlePatternsClick}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Brain className="w-8 h-8 text-black" />
              <Badge className="bg-white/20 text-black border-0">AI Insights</Badge>
            </div>
            <p className="text-sm font-medium mb-1 text-black">Patterns Detected</p>
            <p className="text-4xl font-bold text-black">3</p>
            <p className="text-xs mt-2 text-black">1 needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Right Column - Sidebar Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Performers */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Top Performers
              </CardTitle>
              <CardDescription>Students excelling in OOP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredTopStudents.length > 0 ? filteredTopStudents.map((student, index) => (
                <div key={student.id} className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center font-bold">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-green-100 text-green-800 border-0 text-xs">
                          {student.avgScore}% avg
                        </Badge>
                        <span className="text-xs text-gray-600">{student.completed} modules</span>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No top performers found</p>
                </div>
              )}
              <Button variant="outline" className="w-full" size="sm" onClick={() => setShowAllStudents(true)}>
                <Users className="w-4 h-4 mr-2" />
                View All Students
              </Button>
            </CardContent>
          </Card>

          {/* Students Needing Attention */}
          <Card className="border-0 shadow-md border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Needs Attention
              </CardTitle>
              <CardDescription>Students requiring support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredNeedsAttention.length > 0 ? filteredNeedsAttention.map((student) => (
                <div key={student.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{student.name}</p>
                    <Badge className="bg-red-100 text-red-800 border-0 text-xs">
                      {student.avgScore}%
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Struggling with:</p>
                    <div className="flex flex-wrap gap-1">
                      {student.issues.map((issue, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {issue}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Last active: {student.lastActive}</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full mt-3 bg-red-600 hover:bg-red-700 h-8 text-xs"
                    onClick={() => handleSendIntervention(student)}
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Send Intervention
                  </Button>
                </div>
              )) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No students found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions - Instructor Use Cases */}
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={() => onNavigate?.('course-management')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Course Management
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={() => onNavigate?.('monitoring')}
              >
                <Activity className="w-4 h-4 mr-2" />
                Monitoring & Evaluation
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={() => onNavigate?.('references')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View References (IEEE)
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Analytics
              </Button>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2 font-medium">Demo Feature</p>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600" 
                  size="sm"
                  onClick={handleSendDemoNotifications}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Send Test Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Send Intervention Dialog */}
      <Dialog open={interventionDialogOpen} onOpenChange={setInterventionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-red-600" />
              Send Intervention Message
            </DialogTitle>
            <DialogDescription>
              Send a personalized support message to {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedStudent && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{selectedStudent.name}</h4>
                  <Badge className="bg-red-100 text-red-800 border-0">
                    {selectedStudent.avgScore}% Average
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-700">Struggling with:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.issues.map((issue: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Last active: {selectedStudent.lastActive}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="intervention-message">Intervention Message</Label>
              <Textarea
                id="intervention-message"
                value={interventionMessage}
                onChange={(e) => setInterventionMessage(e.target.value)}
                rows={12}
                placeholder="Enter your message to the student..."
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                💡 Tip: Be encouraging and specific about the support you're offering
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setInterventionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmSendIntervention}
              className="bg-red-600 hover:bg-red-700"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Intervention Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}