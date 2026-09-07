import React, { useState } from 'react';
import { User, Module } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Plus, BarChart3, Filter, Download, BookOpen, Users, 
  TrendingUp, ChevronLeft, Brain, Award, Activity, Eye, 
  AlertCircle, CheckCircle2, Settings, Bell, Sparkles, 
  GraduationCap, Zap, FileText
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { createActivityNotification, createAnnouncementNotification, getAllStudentIds } from '../utils/notifications';
import { toast } from 'sonner';

interface CourseManagementProps {
  user: User;
  modules: Module[];
  onBack: () => void;
}

export function CourseManagement({ user, modules, onBack }: CourseManagementProps) {
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [showCreateActivity, setShowCreateActivity] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [activityTitle, setActivityTitle] = useState('');
  const [activityModule, setActivityModule] = useState('');
  const [activityDueDate, setActivityDueDate] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');

  // Learning Analytics Data
  const weeklyProgressData = [
    { id: 'w1', name: 'Week 1', avgScore: 65, submissions: 38 },
    { id: 'w2', name: 'Week 2', avgScore: 68, submissions: 40 },
    { id: 'w3', name: 'Week 3', avgScore: 72, submissions: 42 },
    { id: 'w4', name: 'Week 4', avgScore: 75, submissions: 41 },
    { id: 'w5', name: 'Week 5', avgScore: 78, submissions: 39 },
    { id: 'w6', name: 'Week 6', avgScore: 80, submissions: 40 },
  ];

  const oopMasteryData = [
    { id: 'oop1', principle: 'Classes & Objects', mastery: 85, students: 40 },
    { id: 'oop2', principle: 'Encapsulation', mastery: 72, students: 35 },
    { id: 'oop3', principle: 'Inheritance', mastery: 68, students: 32 },
    { id: 'oop4', principle: 'Polymorphism', mastery: 58, students: 28 },
    { id: 'oop5', principle: 'Abstraction', mastery: 62, students: 30 },
  ];

  // Module Completion Distribution
  const moduleCompletionData = [
    { id: 'mc1', name: 'Completed', value: 28, color: '#10B981' },
    { id: 'mc2', name: 'In Progress', value: 10, color: '#F59E0B' },
    { id: 'mc3', name: 'Not Started', value: 4, color: '#EF4444' },
  ];

  // Score Distribution
  const scoreDistributionData = [
    { id: 'sd1', range: '90-100', count: 8 },
    { id: 'sd2', range: '80-89', count: 15 },
    { id: 'sd3', range: '70-79', count: 12 },
    { id: 'sd4', range: '60-69', count: 5 },
    { id: 'sd5', range: '0-59', count: 2 },
  ];

  // Detailed Student List for Analytics
  const studentAnalytics = [
    { id: 'st1', name: 'Maria Santos', score: 94, modules: '8/10', submissions: 45, status: 'excellent' },
    { id: 'st2', name: 'John Carlo Reyes', score: 91, modules: '7/10', submissions: 42, status: 'excellent' },
    { id: 'st3', name: 'Sarah Mae Gonzales', score: 89, modules: '7/10', submissions: 38, status: 'excellent' },
    { id: 'st4', name: 'Jerome Santos', score: 78, modules: '5/10', submissions: 26, status: 'good' },
    { id: 'st5', name: 'Daniel Patrick Lopez', score: 52, modules: '1/10', submissions: 11, status: 'needs-attention' },
    { id: 'st6', name: 'Vincent Paul Morales', score: 46, modules: '1/10', submissions: 9, status: 'needs-attention' },
  ];

  // Learning Patterns Identified
  const learningPatterns = [
    {
      id: 1,
      pattern: 'Polymorphism Difficulty',
      severity: 'high',
      studentsAffected: 18,
      description: '43% of students struggling with polymorphism concepts',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      id: 2,
      pattern: 'Strong Encapsulation Understanding',
      severity: 'positive',
      studentsAffected: 32,
      description: '76% showing excellent encapsulation practices',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 3,
      pattern: 'Code Similarity Detected',
      severity: 'medium',
      studentsAffected: 5,
      description: 'Possible plagiarism in Module 3 assignments',
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 -ml-2"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-purple-600 text-white px-3 py-1">CCS108</Badge>
            <Badge variant="outline" className="border-blue-300 text-blue-700">Course Management</Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-1">Create modules, activities, and monitor student performance</p>
        </div>
      </div>

      {/* Hidden Dialogs - Controlled by Learning Interaction section */}
      <div className="hidden">
        <Dialog open={showCreateActivity} onOpenChange={setShowCreateActivity}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Activity</DialogTitle>
                <DialogDescription>
                  Create a coding assignment or exercise for students
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="activity-title">Activity Title *</Label>
                  <Input id="activity-title" placeholder="e.g., Create a Student Class with Encapsulation" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-module">Module *</Label>
                  <Select>
                    <SelectTrigger id="activity-module">
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="module1">Module 1: Java OOP Fundamentals</SelectItem>
                      <SelectItem value="module2">Module 2: Classes and Objects</SelectItem>
                      <SelectItem value="module3">Module 3: Encapsulation</SelectItem>
                      <SelectItem value="module4">Module 4: Inheritance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-description">Description *</Label>
                  <Textarea id="activity-description" placeholder="Describe the learning objectives and requirements..." rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="activity-points">Total Points *</Label>
                    <Input id="activity-points" type="number" placeholder="100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activity-due">Due Date *</Label>
                    <Input id="activity-due" type="date" min={new Date().toISOString().split('T')[0]} defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-starter">Starter Code (Optional)</Label>
                  <Textarea 
                    id="activity-starter" 
                    placeholder="public class Student {&#10;    // TODO: Implement encapsulation&#10;}" 
                    className="font-mono text-sm" 
                    rows={6}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateActivity(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowCreateActivity(false)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Activity
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateModule} onOpenChange={setShowCreateModule}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Module
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Module</DialogTitle>
                <DialogDescription>
                  Create a new learning module with lessons and exercises
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="module-title">Module Title *</Label>
                  <Input id="module-title" placeholder="e.g., Advanced Polymorphism Techniques" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="module-description">Description *</Label>
                  <Textarea id="module-description" placeholder="Describe the module content and learning outcomes..." rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="module-difficulty">Difficulty Level *</Label>
                    <Select>
                      <SelectTrigger id="module-difficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="module-duration">Estimated Duration *</Label>
                    <Select>
                      <SelectTrigger id="module-duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30min">30 minutes</SelectItem>
                        <SelectItem value="1hr">1 hour</SelectItem>
                        <SelectItem value="1.5hr">1.5 hours</SelectItem>
                        <SelectItem value="2hr">2 hours</SelectItem>
                        <SelectItem value="2.5hr">2.5 hours</SelectItem>
                        <SelectItem value="3hr">3 hours</SelectItem>
                        <SelectItem value="4hr">4 hours</SelectItem>
                        <SelectItem value="5hr">5 hours</SelectItem>
                        <SelectItem value="6hr">6 hours</SelectItem>
                        <SelectItem value="8hr">8 hours</SelectItem>
                        <SelectItem value="10hr">10 hours</SelectItem>
                        <SelectItem value="12hr">12+ hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="module-topics">Key Topics (comma-separated)</Label>
                  <Input id="module-topics" placeholder="e.g., Abstract Classes, Interfaces, Method Overriding" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="module-start-date">Availability Start *</Label>
                    <Input id="module-start-date" type="date" min={new Date().toISOString().split('T')[0]} defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="module-deadline">Completion Deadline *</Label>
                    <Input id="module-deadline" type="date" min={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateModule(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowCreateModule(false)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Module
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showAnnouncement} onOpenChange={setShowAnnouncement}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Bell className="w-4 h-4 mr-2" />
                Create Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
                <DialogDescription>
                  Notify students about important course updates
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="announcement-title">Title *</Label>
                  <Input id="announcement-title" placeholder="e.g., Midterm Exam Schedule" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="announcement-message">Message *</Label>
                  <Textarea id="announcement-message" placeholder="Enter the announcement message..." rows={4} />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowAnnouncement(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAnnouncement(false)}>
                    <Bell className="w-4 h-4 mr-2" />
                    Create Announcement
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-purple-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-black" />
              <Badge className="bg-white/20 text-black border-0">Content</Badge>
            </div>
            <p className="text-sm font-medium mb-1 text-black">Course Modules</p>
            <p className="text-4xl font-bold text-black">{modules.length}</p>
            <p className="text-xs mt-2 text-black">{modules.reduce((sum, m) => sum + m.totalLessons, 0)} total lessons</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-blue-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-black" />
              <Badge className="bg-white/20 text-black border-0">Students</Badge>
            </div>
            <p className="text-sm font-medium mb-1 text-black">Total Students</p>
            <p className="text-4xl font-bold text-black">42</p>
            <p className="text-xs mt-2 text-black">38 active this week</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-500 to-green-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-black" />
              <Badge className="bg-white/20 text-black border-0">Analytics</Badge>
            </div>
            <p className="text-sm font-medium mb-1 text-black">Avg Completion</p>
            <p className="text-4xl font-bold text-black">68%</p>
            <p className="text-xs mt-2 text-black">↑ 12% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Interaction Section */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Learning Interaction
              </CardTitle>
              <CardDescription>Manage course modules and student activities</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Access Modules */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Access Modules</h3>
                </div>
                <Dialog open={showCreateModule} onOpenChange={setShowCreateModule}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Module
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Module</DialogTitle>
                      <DialogDescription>
                        Create a new learning module with lessons and exercises
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="module-title">Module Title *</Label>
                        <Input id="module-title" placeholder="e.g., Advanced Polymorphism Techniques" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="module-description">Description *</Label>
                        <Textarea id="module-description" placeholder="Describe the module content and learning outcomes..." rows={4} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="module-difficulty">Difficulty Level *</Label>
                          <Select>
                            <SelectTrigger id="module-difficulty">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="module-duration-2">Estimated Duration *</Label>
                          <Select>
                            <SelectTrigger id="module-duration-2">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30min">30 minutes</SelectItem>
                              <SelectItem value="1hr">1 hour</SelectItem>
                              <SelectItem value="1.5hr">1.5 hours</SelectItem>
                              <SelectItem value="2hr">2 hours</SelectItem>
                              <SelectItem value="2.5hr">2.5 hours</SelectItem>
                              <SelectItem value="3hr">3 hours</SelectItem>
                              <SelectItem value="4hr">4 hours</SelectItem>
                              <SelectItem value="5hr">5 hours</SelectItem>
                              <SelectItem value="6hr">6 hours</SelectItem>
                              <SelectItem value="8hr">8 hours</SelectItem>
                              <SelectItem value="10hr">10 hours</SelectItem>
                              <SelectItem value="12hr">12+ hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="module-topics">Key Topics (comma-separated)</Label>
                        <Input id="module-topics" placeholder="e.g., Abstract Classes, Interfaces, Method Overriding" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="module-start-date">Availability Start *</Label>
                          <Input id="module-start-date" type="date" min={new Date().toISOString().split('T')[0]} defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="module-deadline">Completion Deadline *</Label>
                          <Input id="module-deadline" type="date" min={new Date().toISOString().split('T')[0]} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setShowCreateModule(false)}>
                          Cancel
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowCreateModule(false)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Module
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-sm text-gray-600 mb-4">View and manage all course modules</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Total Modules</p>
                      <p className="text-xs text-gray-600">{modules.length} published modules</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-600 text-white">{modules.length}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Total Lessons</p>
                      <p className="text-xs text-gray-600">Across all modules</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-600 text-white">{modules.reduce((sum, m) => sum + m.totalLessons, 0)}</Badge>
                </div>
              </div>
            </div>

            {/* Create Activities */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Manage Activities</h3>
                </div>
                <Dialog open={showCreateActivity} onOpenChange={setShowCreateActivity}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Activity
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Activity</DialogTitle>
                      <DialogDescription>
                        Create a coding assignment or exercise for students
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="activity-title">Activity Title *</Label>
                        <Input id="activity-title" placeholder="e.g., Create a Student Class with Encapsulation" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activity-module">Module *</Label>
                        <Select>
                          <SelectTrigger id="activity-module">
                            <SelectValue placeholder="Select module" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="module1">Module 1: Java OOP Fundamentals</SelectItem>
                            <SelectItem value="module2">Module 2: Classes and Objects</SelectItem>
                            <SelectItem value="module3">Module 3: Encapsulation</SelectItem>
                            <SelectItem value="module4">Module 4: Inheritance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activity-description">Description *</Label>
                        <Textarea id="activity-description" placeholder="Describe the learning objectives and requirements..." rows={4} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="activity-points">Total Points *</Label>
                          <Input id="activity-points" type="number" placeholder="100" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="activity-due">Due Date *</Label>
                          <Input id="activity-due" type="date" min={new Date().toISOString().split('T')[0]} defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activity-starter">Starter Code (Optional)</Label>
                        <Textarea 
                          id="activity-starter" 
                          placeholder="public class Student {&#10;    // TODO: Implement encapsulation&#10;}" 
                          className="font-mono text-sm" 
                          rows={6}
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setShowCreateActivity(false)}>
                          Cancel
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowCreateActivity(false)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Activity
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-sm text-gray-600 mb-4">Create and manage student assignments</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Active Activities</p>
                      <p className="text-xs text-gray-600">Currently assigned</p>
                    </div>
                  </div>
                  <Badge className="bg-green-600 text-white">8</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Pending Review</p>
                      <p className="text-xs text-gray-600">Awaiting submission grading</p>
                    </div>
                  </div>
                  <Badge className="bg-orange-600 text-white">12</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Student Analytics Section */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Access Student Performance
              </CardTitle>
              <CardDescription>Comprehensive performance tracking and insights</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Student Performance Table */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Student Performance Details</h4>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b">
                      <th className="text-left p-3 text-xs font-semibold text-gray-700">Student Name</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700">Avg Score</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700">Modules</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700">Submissions</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentAnalytics.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-sm text-gray-900 font-medium">{student.name}</td>
                        <td className="p-3 text-sm">
                          <Badge className={
                            student.score >= 90 ? 'bg-green-100 text-green-800 border-0' :
                            student.score >= 80 ? 'bg-blue-100 text-blue-800 border-0' :
                            student.score >= 70 ? 'bg-yellow-100 text-yellow-800 border-0' :
                            'bg-red-100 text-red-800 border-0'
                          }>
                            {student.score}%
                          </Badge>
                        </td>
                        <td className="p-3 text-sm text-gray-700">{student.modules}</td>
                        <td className="p-3 text-sm text-gray-700">{student.submissions}</td>
                        <td className="p-3 text-sm">
                          <Badge variant="outline" className={
                            student.status === 'excellent' ? 'border-green-300 text-green-700' :
                            student.status === 'good' ? 'border-blue-300 text-blue-700' :
                            'border-red-300 text-red-700'
                          }>
                            {student.status === 'excellent' ? 'Excellent' :
                             student.status === 'good' ? 'Good Progress' :
                             'Needs Attention'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Analytics Section */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Learning Analytics
              </CardTitle>
              <CardDescription>AI-powered insights and trends from neural network analysis</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weekly Performance Trend */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Weekly Performance Trend</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weeklyProgressData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} id="course-mgmt-weekly-trend-chart">
                    <CartesianGrid key="grid-weekly" strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis key="xaxis-weekly" dataKey="name" tick={{ fontSize: 11 }} stroke="#6B7280" />
                    <YAxis key="yaxis-weekly" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#6B7280" />
                    <Tooltip key="tooltip-weekly" />
                    <Legend key="legend-weekly" wrapperStyle={{ fontSize: '12px' }} />
                    <Line 
                      key="line-avgScore"
                      type="monotone" 
                      dataKey="avgScore" 
                      name="Avg Score (%)"
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', r: 3 }}
                    />
                    <Line 
                      key="line-submissions"
                      type="monotone" 
                      dataKey="submissions" 
                      name="Submissions"
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ fill: '#10B981', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* OOP Principles Mastery */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">OOP Principles Mastery</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={oopMasteryData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} id="course-mgmt-oop-mastery-chart">
                    <CartesianGrid key="grid-oop" strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis key="xaxis-oop" dataKey="principle" tick={{ fontSize: 9 }} stroke="#6B7280" angle={-15} textAnchor="end" height={60} />
                    <YAxis key="yaxis-oop" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#6B7280" />
                    <Tooltip key="tooltip-oop" />
                    <Bar key="bar-mastery" dataKey="mastery" name="Mastery %" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Module Completion Distribution */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Module Completion Status</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart id="course-mgmt-module-completion-chart">
                    <Pie
                      key="pie-module-completion"
                      data={moduleCompletionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {moduleCompletionData.map((entry) => (
                        <Cell key={`cell-${entry.id}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip key="tooltip-pie" />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Score Distribution */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Score Distribution</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={scoreDistributionData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} id="course-mgmt-score-distribution-chart">
                    <CartesianGrid key="grid-score" strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis key="xaxis-score" dataKey="range" tick={{ fontSize: 11 }} stroke="#6B7280" />
                    <YAxis key="yaxis-score" tick={{ fontSize: 12 }} stroke="#6B7280" />
                    <Tooltip key="tooltip-score" />
                    <Bar key="bar-count" dataKey="count" name="Students" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Patterns Identified by AI */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Identify Learning Patterns
              </CardTitle>
              <CardDescription>Neural network analysis of student coding behavior</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {learningPatterns.map((pattern) => {
            const Icon = pattern.icon;
            return (
              <div 
                key={pattern.id}
                className={`p-4 rounded-lg border-l-4 ${pattern.borderColor} ${pattern.bgColor}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 ${pattern.color} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{pattern.pattern}</h4>
                      <Badge variant="outline" className="text-xs">
                        {pattern.studentsAffected} students
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{pattern.description}</p>
                    {pattern.severity === 'high' && (
                      <Button size="sm" variant="outline" className="mt-3 h-8 text-xs">
                        <Settings className="w-3 h-3 mr-1" />
                        Make Instructional Adjustment
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Module Sources & References */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Module Sources & References
          </CardTitle>
          <CardDescription>Content sources and learning material origins</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AI Neural Network */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-full flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-purple-600 text-white">🧠 AI Neural Network</Badge>
                  <span className="text-sm text-gray-600">4 modules • 87 patterns</span>
                </div>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">Modules:</span> Inheritance, Polymorphism, Abstraction, Advanced OOP
                </p>
                <p className="text-sm text-purple-700 italic">
                  AI-generated content with pattern recognition
                </p>
              </div>
            </div>
          </div>

          {/* Instructor */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-600 text-white">👨‍🏫 Instructor</Badge>
                  <span className="text-sm text-gray-600">4 modules • 51 patterns</span>
                </div>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">Modules:</span> Classes & Objects, Encapsulation, Interfaces, Exception Handling
                </p>
                <p className="text-sm text-blue-700 font-medium">
                  Instructor: Dr. Sarah Martinez
                </p>
              </div>
            </div>
          </div>

          {/* Curriculum */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-full flex-shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-600 text-white">📚 Curriculum</Badge>
                  <span className="text-sm text-gray-600">3 modules • 39 patterns</span>
                </div>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">Modules:</span> Java Fundamentals, Abstraction, Collections Framework
                </p>
                <p className="text-sm text-green-700 font-medium">
                  University of Cabuyao - CCS108 Official Curriculum
                </p>
              </div>
            </div>
          </div>

          {/* AI Generated */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-600 rounded-full flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-600 text-white">⚡ AI Generated</Badge>
                  <span className="text-sm text-gray-600">1 module • 14 patterns</span>
                </div>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">Module:</span> Interfaces
                </p>
                <p className="text-sm text-orange-700 font-medium">
                  GPT-4 enhanced with expert validation
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete Module Sources List */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-700" />
            Complete Module Sources List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {/* Module 1 */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <span className="text-sm text-gray-500 font-medium min-w-[40px]">01.</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">Java Fundamentals</h4>
                  <Badge variant="outline" className="text-xs">beginner</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-600 text-white text-xs">📚 Curriculum</Badge>
                  <span className="text-xs text-gray-600">• 8 patterns • 5 lessons</span>
                </div>
                <p className="text-xs text-gray-600">Instructor: Dr. Sarah Martinez</p>
              </div>
            </div>

            {/* Module 2 */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <span className="text-sm text-gray-500 font-medium min-w-[40px]">02.</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">Classes and Objects</h4>
                  <Badge variant="outline" className="text-xs">beginner</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-600 text-white text-xs">👨‍🏫 Instructor</Badge>
                  <span className="text-xs text-gray-600">• 12 patterns • 5 lessons</span>
                </div>
                <p className="text-xs text-gray-600">Instructor: Dr. Sarah Martinez</p>
              </div>
            </div>

            {/* Module 3 */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <span className="text-sm text-gray-500 font-medium min-w-[40px]">03.</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">Encapsulation</h4>
                  <Badge variant="outline" className="text-xs">intermediate</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-600 text-white text-xs">👨‍🏫 Instructor</Badge>
                  <span className="text-xs text-gray-600">• 10 patterns • 4 lessons</span>
                </div>
                <p className="text-xs text-gray-600">Instructor: Dr. Sarah Martinez</p>
              </div>
            </div>

            {/* Module 4 */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <span className="text-sm text-gray-500 font-medium min-w-[40px]">04.</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">Inheritance</h4>
                  <Badge variant="outline" className="text-xs">intermediate</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-purple-600 text-white text-xs">🧠 AI Neural Network</Badge>
                  <span className="text-xs text-gray-600">• 18 patterns • 5 lessons</span>
                </div>
                <p className="text-xs text-gray-600">Instructor: Dr. Sarah Martinez</p>
              </div>
            </div>

            {/* Module 5 */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <span className="text-sm text-gray-500 font-medium min-w-[40px]">05.</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">Polymorphism</h4>
                  <Badge variant="outline" className="text-xs">intermediate</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-purple-600 text-white text-xs">🧠 AI Neural Network</Badge>
                  <span className="text-xs text-gray-600">• 22 patterns • 4 lessons</span>
                </div>
                <p className="text-xs text-gray-600">Instructor: Dr. Sarah Martinez</p>
              </div>
            </div>

            {/* Module 6 */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <span className="text-sm text-gray-500 font-medium min-w-[40px]">06.</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">Abstraction</h4>
                  <Badge variant="outline" className="text-xs">intermediate</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-600 text-white text-xs">📚 Curriculum</Badge>
                  <span className="text-xs text-gray-600">• 16 patterns • 4 lessons</span>
                </div>
                <p className="text-xs text-gray-600">Instructor: Dr. Sarah Martinez</p>
              </div>
            </div>

            {/* Module 7 */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <span className="text-sm text-gray-500 font-medium min-w-[40px]">07.</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">Interfaces</h4>
                  <Badge variant="outline" className="text-xs">intermediate</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-orange-600 text-white text-xs">⚡ AI Generated</Badge>
                  <span className="text-xs text-gray-600">• 14 patterns • 4 lessons</span>
                </div>
                <p className="text-xs text-gray-600">Instructor: Dr. Sarah Martinez</p>
              </div>
            </div>

            {/* Module 8 */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <span className="text-sm text-gray-500 font-medium min-w-[40px]">08.</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">Exception Handling</h4>
                  <Badge variant="outline" className="text-xs">intermediate</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-600 text-white text-xs">👨‍🏫 Instructor</Badge>
                  <span className="text-xs text-gray-600">• 11 patterns • 5 lessons</span>
                </div>
                <p className="text-xs text-gray-600">Instructor: Dr. Sarah Martinez</p>
              </div>
            </div>

            {/* Module 9 */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <span className="text-sm text-gray-500 font-medium min-w-[40px]">09.</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">Collections Framework</h4>
                  <Badge variant="outline" className="text-xs">advanced</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-600 text-white text-xs">📚 Curriculum</Badge>
                  <span className="text-xs text-gray-600">• 35 patterns • 6 lessons</span>
                </div>
                <p className="text-xs text-gray-600">Instructor: Dr. Sarah Martinez</p>
              </div>
            </div>

            {/* Module 10 */}
            <div className="flex items-start gap-4">
              <span className="text-sm text-gray-500 font-medium min-w-[40px]">10.</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">Advanced OOP Concepts</h4>
                  <Badge variant="outline" className="text-xs">advanced</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-purple-600 text-white text-xs">🧠 AI Neural Network</Badge>
                  <span className="text-xs text-gray-600">• 28 patterns • 7 lessons</span>
                </div>
                <p className="text-xs text-gray-600">Instructor: Dr. Sarah Martinez</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">Total: 10 modules</p>
            <p className="text-sm text-gray-600 font-medium">49 total lessons</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}