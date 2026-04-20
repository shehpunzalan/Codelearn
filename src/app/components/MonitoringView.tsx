import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowLeft, Activity, Eye, AlertCircle, CheckCircle2, Code, 
  Search, Filter, Clock, User, FileText, MessageSquare, Settings,
  TrendingUp, XCircle, Send, FileCode, BarChart3, Brain, Target,
  BookOpen, Zap, Users, Award, Network, Database
} from 'lucide-react';
import { toast } from 'sonner';
import { mockModules } from '../data/mockData';
import { 
  allStudents, 
  highPerformanceStudents, 
  mediumPerformanceStudents, 
  lowPerformanceStudents,
  getStudentsByLevel
} from '../data/sampleData';

interface MonitoringViewProps {
  onBack: () => void;
}

export function MonitoringView({ onBack }: MonitoringViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [selectedBehavior, setSelectedBehavior] = useState<any>(null);
  const [adjustmentType, setAdjustmentType] = useState('');
  const [adjustmentMessage, setAdjustmentMessage] = useState('');

  // Real-time student activities
  const recentActivities = [
    { 
      id: 1, 
      student: 'Maria Santos', 
      action: 'Submitted Module 4: Inheritance Exercise', 
      time: '2 minutes ago', 
      status: 'completed',
      score: 92,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    { 
      id: 2, 
      student: 'Sarah Mae Gonzales', 
      action: 'Started Polymorphism Lesson 3', 
      time: '5 minutes ago', 
      status: 'in-progress',
      score: null,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      id: 3, 
      student: 'Daniel Patrick Lopez', 
      action: 'Multiple compilation errors in Module 3', 
      time: '8 minutes ago', 
      status: 'error',
      score: null,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    { 
      id: 4, 
      student: 'Andrea Nicole Ramos', 
      action: 'Completed Encapsulation Practice', 
      time: '12 minutes ago', 
      status: 'completed',
      score: 95,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    { 
      id: 5, 
      student: 'Jerome Santos', 
      action: 'Viewing feedback for Module 2', 
      time: '15 minutes ago', 
      status: 'viewing',
      score: null,
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    { 
      id: 6, 
      student: 'Vincent Paul Morales', 
      action: 'Failed to submit - compilation error', 
      time: '20 minutes ago', 
      status: 'failed',
      score: null,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
  ];

  // Coding behavior patterns - Using real student data
  const codingBehaviors = [
    // HIGH PERFORMANCE STUDENTS - Positive patterns
    {
      id: 1,
      student: highPerformanceStudents[0].name, // Maria Santos
      pattern: 'Excellent Code Organization',
      severity: 'positive',
      occurrences: 45,
      description: 'Consistently follows OOP best practices with comprehensive documentation',
      recommendation: 'Encourage peer code review leadership',
      level: 'HIGH',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300'
    },
    {
      id: 2,
      student: highPerformanceStudents[1].name, // John Carlo Reyes
      pattern: 'Advanced OOP Principles',
      severity: 'positive',
      occurrences: 42,
      description: 'Demonstrates mastery of polymorphism and abstraction',
      recommendation: 'Provide advanced challenges and competitive programming tasks',
      level: 'HIGH',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300'
    },
    // MEDIUM PERFORMANCE STUDENTS - Mixed patterns
    {
      id: 3,
      student: mediumPerformanceStudents[0].name, // Jerome Santos
      pattern: 'Inconsistent Encapsulation',
      severity: 'medium',
      occurrences: 12,
      description: 'Sometimes forgets to use private access modifiers',
      recommendation: 'Review encapsulation principles and provide checklists',
      level: 'MEDIUM',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300'
    },
    {
      id: 4,
      student: mediumPerformanceStudents[2].name, // Rafael Jose Mendoza
      pattern: 'Overusing Inheritance',
      severity: 'medium',
      occurrences: 8,
      description: 'Creating deep inheritance hierarchies unnecessarily',
      recommendation: 'Introduce composition over inheritance pattern',
      level: 'MEDIUM',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300'
    },
    // LOW PERFORMANCE STUDENTS - Critical patterns
    {
      id: 5,
      student: lowPerformanceStudents[0].name, // Robert James Navarro
      pattern: 'Frequent Syntax Errors',
      severity: 'high',
      occurrences: 18,
      description: 'Consistently making semicolon, bracket, and naming convention errors',
      recommendation: 'Urgent: Schedule one-on-one tutoring and IDE setup assistance',
      level: 'LOW',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300'
    },
    {
      id: 6,
      student: lowPerformanceStudents[2].name, // Daniel Patrick Lopez
      pattern: 'Weak OOP Understanding',
      severity: 'high',
      occurrences: 15,
      description: 'Struggling with basic class structure and object creation',
      recommendation: 'Assign foundational exercises and supplemental video tutorials',
      level: 'LOW',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300'
    },
    {
      id: 7,
      student: lowPerformanceStudents[4].name, // Vincent Paul Morales
      pattern: 'Low Submission Frequency',
      severity: 'high',
      occurrences: 9,
      description: 'Only 9 submissions in 8 weeks, last active 4 days ago',
      recommendation: 'Immediate intervention: Contact student and assess obstacles',
      level: 'LOW',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300'
    },
  ];

  // Learning patterns detected - Based on actual student data
  const learningPatterns = [
    {
      id: 1,
      pattern: 'Polymorphism Difficulty',
      students: lowPerformanceStudents.length + Math.floor(mediumPerformanceStudents.length / 2), // 10 + 5 = 15
      percentage: Math.round(((lowPerformanceStudents.length + Math.floor(mediumPerformanceStudents.length / 2)) / allStudents.length) * 100),
      trend: 'increasing',
      severity: 'high',
      description: `${lowPerformanceStudents.length + Math.floor(mediumPerformanceStudents.length / 2)} students (${Math.round(((lowPerformanceStudents.length + Math.floor(mediumPerformanceStudents.length / 2)) / allStudents.length) * 100)}%) struggling with method overriding and runtime polymorphism`,
      action: 'Schedule additional workshop session with practical examples',
      color: 'text-red-600'
    },
    {
      id: 2,
      pattern: 'Strong Encapsulation Skills',
      students: highPerformanceStudents.length + Math.floor(mediumPerformanceStudents.length / 2), // 8 + 5 = 13
      percentage: Math.round(((highPerformanceStudents.length + Math.floor(mediumPerformanceStudents.length / 2)) / allStudents.length) * 100),
      trend: 'stable',
      severity: 'positive',
      description: `${highPerformanceStudents.length + Math.floor(mediumPerformanceStudents.length / 2)} students (${Math.round(((highPerformanceStudents.length + Math.floor(mediumPerformanceStudents.length / 2)) / allStudents.length) * 100)}%) consistently applying proper encapsulation with private fields and getters/setters`,
      action: 'Continue current teaching methodology',
      color: 'text-green-600'
    },
    {
      id: 3,
      pattern: 'Plagiarism Alert',
      students: 5,
      percentage: Math.round((5 / allStudents.length) * 100),
      trend: 'stable',
      severity: 'medium',
      description: '5 students showing code similarity above 85% threshold in Module 3 submissions',
      action: 'Investigate submissions and conduct individual meetings',
      color: 'text-orange-600'
    },
    {
      id: 4,
      pattern: 'Inactive Students',
      students: lowPerformanceStudents.filter(s => {
        const daysSinceActive = (Date.now() - new Date(s.lastActive).getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceActive > 3;
      }).length,
      percentage: Math.round((lowPerformanceStudents.filter(s => {
        const daysSinceActive = (Date.now() - new Date(s.lastActive).getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceActive > 3;
      }).length / allStudents.length) * 100),
      trend: 'increasing',
      severity: 'high',
      description: `${lowPerformanceStudents.filter(s => {
        const daysSinceActive = (Date.now() - new Date(s.lastActive).getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceActive > 3;
      }).length} students haven't submitted code in 3+ days, risking course failure`,
      action: 'Send immediate email reminders and offer office hours',
      color: 'text-red-600'
    },
    {
      id: 5,
      pattern: 'Rapid Progress (High Performers)',
      students: highPerformanceStudents.filter(s => s.modulesCompleted >= 6).length,
      percentage: Math.round((highPerformanceStudents.filter(s => s.modulesCompleted >= 6).length / allStudents.length) * 100),
      trend: 'increasing',
      severity: 'positive',
      description: `${highPerformanceStudents.filter(s => s.modulesCompleted >= 6).length} students completing modules ahead of schedule with scores >85%`,
      action: 'Provide advanced challenges and research opportunities',
      color: 'text-green-600'
    },
  ];

  const handleMakeAdjustment = (behavior: any) => {
    setSelectedBehavior(behavior);
    
    // Pre-set adjustment type based on severity
    if (behavior.severity === 'high' || behavior.severity === 'medium') {
      setAdjustmentType('supplemental-material');
    } else {
      setAdjustmentType('encourage-leadership');
    }
    
    // Pre-fill message with suggestion
    const message = `Based on the pattern "${behavior.pattern}" observed in ${behavior.student}'s code:\n\nRecommendation: ${behavior.recommendation}\n\nProposed Action:\n- Schedule a personalized tutorial session\n- Provide supplemental materials focusing on this area\n- Assign targeted practice exercises\n\nExpected Outcome: Improved code quality and understanding within 2 weeks.`;
    setAdjustmentMessage(message);
    setAdjustmentDialogOpen(true);
  };

  const confirmAdjustment = () => {
    if (!adjustmentType) {
      toast.error('Please select an adjustment type');
      return;
    }
    if (!adjustmentMessage.trim()) {
      toast.error('Please enter adjustment details');
      return;
    }
    toast.success(`Instructional adjustment created for ${selectedBehavior.student}!`);
    setAdjustmentDialogOpen(false);
    setAdjustmentType('');
    setAdjustmentMessage('');
    setSelectedBehavior(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-2 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Badge className="bg-purple-600 text-white px-3 py-1">CCS108</Badge>
              <Badge variant="outline" className="border-blue-300 text-blue-700">Monitoring</Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Monitoring and Evaluation</h1>
            <p className="text-gray-600 mt-1">Real-time student activity tracking and coding behavior analysis</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configure Alerts
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search students, activities, or patterns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Clock className="w-4 h-4 mr-2" />
              Last 24 Hours
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Real-time Activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Neural Network Pattern Recognition Metrics */}
          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    Neural Network Pattern Recognition Metrics
                  </CardTitle>
                  <CardDescription>AI-powered code analysis across all modules</CardDescription>
                </div>
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
                  <Zap className="w-3 h-3 mr-1" />
                  AI Powered
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Overall Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Network className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-gray-600">Total Patterns</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">189</p>
                    <p className="text-xs text-gray-500 mt-1">Detected</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      <FileCode className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-600">Code Examples</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">235</p>
                    <p className="text-xs text-gray-500 mt-1">Analyzed</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-600">OOP Principles</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">28</p>
                    <p className="text-xs text-gray-500 mt-1">Identified</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-gray-600">Recognition Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">94%</p>
                    <p className="text-xs text-gray-500 mt-1">Accuracy</p>
                  </div>
                </div>

                {/* Pattern Recognition Legend */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Database className="w-4 h-4 text-gray-700" />
                    Pattern Recognition Categories
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm text-gray-700">Class Structures</span>
                        <Badge variant="outline" className="ml-auto text-xs">45 patterns</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-700">Method Definitions</span>
                        <Badge variant="outline" className="ml-auto text-xs">52 patterns</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-700">Encapsulation</span>
                        <Badge variant="outline" className="ml-auto text-xs">38 patterns</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm text-gray-700">Inheritance</span>
                        <Badge variant="outline" className="ml-auto text-xs">28 patterns</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-sm text-gray-700">Polymorphism</span>
                        <Badge variant="outline" className="ml-auto text-xs">22 patterns</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm text-gray-700">Error Patterns</span>
                        <Badge variant="outline" className="ml-auto text-xs">18 patterns</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span className="text-sm text-gray-700">Code Quality</span>
                        <Badge variant="outline" className="ml-auto text-xs">32 patterns</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                        <span className="text-sm text-gray-700">Best Practices</span>
                        <Badge variant="outline" className="ml-auto text-xs">24 patterns</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pattern Recognition Performance Categories */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-700" />
                    Student Learning Categorization Matrix
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">
                    AI-powered classification of student performance based on pattern recognition metrics
                  </p>

                  {/* Performance Categories */}
                  <div className="space-y-3">
                    {/* HIGH Performance */}
                    <div className="border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-r-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-900">HIGH Performance</span>
                        </div>
                        <Badge className="bg-green-600 text-white border-0">15 students (36%)</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="bg-white p-2 rounded border border-green-200">
                          <p className="text-xs text-gray-600">Pattern Recognition</p>
                          <p className="text-sm font-bold text-green-700">80-100%</p>
                        </div>
                        <div className="bg-white p-2 rounded border border-green-200">
                          <p className="text-xs text-gray-600">OOP Mastery</p>
                          <p className="text-sm font-bold text-green-700">85-100%</p>
                        </div>
                        <div className="bg-white p-2 rounded border border-green-200">
                          <p className="text-xs text-gray-600">Code Quality</p>
                          <p className="text-sm font-bold text-green-700">90-100%</p>
                        </div>
                        <div className="bg-white p-2 rounded border border-green-200">
                          <p className="text-xs text-gray-600">Error Rate</p>
                          <p className="text-sm font-bold text-green-700">0-15%</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-700 space-y-1">
                        <p><strong>Characteristics:</strong> Consistently applies OOP principles, writes clean code, minimal syntax errors</p>
                        <p><strong>Examples:</strong> Maria Santos, Sarah Mae Gonzales, John Carlo Reyes</p>
                        <p><strong>Action:</strong> Encourage peer tutoring, assign advanced challenges</p>
                      </div>
                    </div>

                    {/* MEDIUM Performance */}
                    <div className="border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-50 to-amber-50 p-3 rounded-r-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-yellow-600" />
                          <span className="font-semibold text-yellow-900">MEDIUM Performance</span>
                        </div>
                        <Badge className="bg-yellow-600 text-white border-0">20 students (48%)</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="bg-white p-2 rounded border border-yellow-200">
                          <p className="text-xs text-gray-600">Pattern Recognition</p>
                          <p className="text-sm font-bold text-yellow-700">50-79%</p>
                        </div>
                        <div className="bg-white p-2 rounded border border-yellow-200">
                          <p className="text-xs text-gray-600">OOP Mastery</p>
                          <p className="text-sm font-bold text-yellow-700">60-84%</p>
                        </div>
                        <div className="bg-white p-2 rounded border border-yellow-200">
                          <p className="text-xs text-gray-600">Code Quality</p>
                          <p className="text-sm font-bold text-yellow-700">65-89%</p>
                        </div>
                        <div className="bg-white p-2 rounded border border-yellow-200">
                          <p className="text-xs text-gray-600">Error Rate</p>
                          <p className="text-sm font-bold text-yellow-700">16-35%</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-700 space-y-1">
                        <p><strong>Characteristics:</strong> Understanding OOP but inconsistent application, moderate syntax errors</p>
                        <p><strong>Examples:</strong> Jerome Santos, Angelica Mae Dizon, Rafael Jose Mendoza</p>
                        <p><strong>Action:</strong> Provide targeted feedback, supplemental materials, practice exercises</p>
                      </div>
                    </div>

                    {/* LOW Performance */}
                    <div className="border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-rose-50 p-3 rounded-r-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="font-semibold text-red-900">LOW Performance</span>
                        </div>
                        <Badge className="bg-red-600 text-white border-0">7 students (16%)</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="bg-white p-2 rounded border border-red-200">
                          <p className="text-xs text-gray-600">Pattern Recognition</p>
                          <p className="text-sm font-bold text-red-700">0-49%</p>
                        </div>
                        <div className="bg-white p-2 rounded border border-red-200">
                          <p className="text-xs text-gray-600">OOP Mastery</p>
                          <p className="text-sm font-bold text-red-700">0-59%</p>
                        </div>
                        <div className="bg-white p-2 rounded border border-red-200">
                          <p className="text-xs text-gray-600">Code Quality</p>
                          <p className="text-sm font-bold text-red-700">0-64%</p>
                        </div>
                        <div className="bg-white p-2 rounded border border-red-200">
                          <p className="text-xs text-gray-600">Error Rate</p>
                          <p className="text-sm font-bold text-red-700">36-100%</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-700 space-y-1">
                        <p><strong>Characteristics:</strong> Struggling with OOP concepts, frequent errors, incomplete submissions</p>
                        <p><strong>Examples:</strong> Daniel Patrick Lopez, Hannah Isabel Perez, Vincent Paul Morales</p>
                        <p><strong>Action:</strong> Immediate intervention, one-on-one tutoring, remedial materials</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Individual Student Pattern Recognition Metrics */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-700" />
                    Individual Student Pattern Recognition Scores
                  </h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {/* HIGH Students */}
                    <div className="p-2 bg-green-50 rounded border border-green-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">Sarah Mae Gonzales</span>
                        <Badge className="bg-green-600 text-white border-0 text-xs">HIGH</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-xs">
                        <div><span className="text-gray-600">Pattern:</span> <strong className="text-green-700">95%</strong></div>
                        <div><span className="text-gray-600">OOP:</span> <strong className="text-green-700">92%</strong></div>
                        <div><span className="text-gray-600">Quality:</span> <strong className="text-green-700">96%</strong></div>
                        <div><span className="text-gray-600">Errors:</span> <strong className="text-green-700">5%</strong></div>
                      </div>
                    </div>

                    <div className="p-2 bg-green-50 rounded border border-green-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">Andrea Nicole Ramos</span>
                        <Badge className="bg-green-600 text-white border-0 text-xs">HIGH</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-xs">
                        <div><span className="text-gray-600">Pattern:</span> <strong className="text-green-700">92%</strong></div>
                        <div><span className="text-gray-600">OOP:</span> <strong className="text-green-700">95%</strong></div>
                        <div><span className="text-gray-600">Quality:</span> <strong className="text-green-700">93%</strong></div>
                        <div><span className="text-gray-600">Errors:</span> <strong className="text-green-700">8%</strong></div>
                      </div>
                    </div>

                    <div className="p-2 bg-green-50 rounded border border-green-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">Miguel Angel Cruz</span>
                        <Badge className="bg-green-600 text-white border-0 text-xs">HIGH</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-xs">
                        <div><span className="text-gray-600">Pattern:</span> <strong className="text-green-700">88%</strong></div>
                        <div><span className="text-gray-600">OOP:</span> <strong className="text-green-700">90%</strong></div>
                        <div><span className="text-gray-600">Quality:</span> <strong className="text-green-700">91%</strong></div>
                        <div><span className="text-gray-600">Errors:</span> <strong className="text-green-700">12%</strong></div>
                      </div>
                    </div>

                    {/* MEDIUM Students */}
                    <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">Jerome Santos</span>
                        <Badge className="bg-yellow-600 text-white border-0 text-xs">MEDIUM</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-xs">
                        <div><span className="text-gray-600">Pattern:</span> <strong className="text-yellow-700">76%</strong></div>
                        <div><span className="text-gray-600">OOP:</span> <strong className="text-yellow-700">78%</strong></div>
                        <div><span className="text-gray-600">Quality:</span> <strong className="text-yellow-700">82%</strong></div>
                        <div><span className="text-gray-600">Errors:</span> <strong className="text-yellow-700">22%</strong></div>
                      </div>
                    </div>

                    <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">Angelica Mae Dizon</span>
                        <Badge className="bg-yellow-600 text-white border-0 text-xs">MEDIUM</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-xs">
                        <div><span className="text-gray-600">Pattern:</span> <strong className="text-yellow-700">68%</strong></div>
                        <div><span className="text-gray-600">OOP:</span> <strong className="text-yellow-700">72%</strong></div>
                        <div><span className="text-gray-600">Quality:</span> <strong className="text-yellow-700">75%</strong></div>
                        <div><span className="text-gray-600">Errors:</span> <strong className="text-yellow-700">28%</strong></div>
                      </div>
                    </div>

                    <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">Rafael Jose Mendoza</span>
                        <Badge className="bg-yellow-600 text-white border-0 text-xs">MEDIUM</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-xs">
                        <div><span className="text-gray-600">Pattern:</span> <strong className="text-yellow-700">62%</strong></div>
                        <div><span className="text-gray-600">OOP:</span> <strong className="text-yellow-700">65%</strong></div>
                        <div><span className="text-gray-600">Quality:</span> <strong className="text-yellow-700">70%</strong></div>
                        <div><span className="text-gray-600">Errors:</span> <strong className="text-yellow-700">32%</strong></div>
                      </div>
                    </div>

                    {/* LOW Students */}
                    <div className="p-2 bg-red-50 rounded border border-red-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">Daniel Patrick Lopez</span>
                        <Badge className="bg-red-600 text-white border-0 text-xs">LOW</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-xs">
                        <div><span className="text-gray-600">Pattern:</span> <strong className="text-red-700">45%</strong></div>
                        <div><span className="text-gray-600">OOP:</span> <strong className="text-red-700">52%</strong></div>
                        <div><span className="text-gray-600">Quality:</span> <strong className="text-red-700">58%</strong></div>
                        <div><span className="text-gray-600">Errors:</span> <strong className="text-red-700">42%</strong></div>
                      </div>
                    </div>

                    <div className="p-2 bg-red-50 rounded border border-red-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">Hannah Isabel Perez</span>
                        <Badge className="bg-red-600 text-white border-0 text-xs">LOW</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-xs">
                        <div><span className="text-gray-600">Pattern:</span> <strong className="text-red-700">38%</strong></div>
                        <div><span className="text-gray-600">OOP:</span> <strong className="text-red-700">41%</strong></div>
                        <div><span className="text-gray-600">Quality:</span> <strong className="text-red-700">48%</strong></div>
                        <div><span className="text-gray-600">Errors:</span> <strong className="text-red-700">55%</strong></div>
                      </div>
                    </div>

                    <div className="p-2 bg-red-50 rounded border border-red-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">Vincent Paul Morales</span>
                        <Badge className="bg-red-600 text-white border-0 text-xs">LOW</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-xs">
                        <div><span className="text-gray-600">Pattern:</span> <strong className="text-red-700">32%</strong></div>
                        <div><span className="text-gray-600">OOP:</span> <strong className="text-red-700">35%</strong></div>
                        <div><span className="text-gray-600">Quality:</span> <strong className="text-red-700">40%</strong></div>
                        <div><span className="text-gray-600">Errors:</span> <strong className="text-red-700">68%</strong></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Categorization Algorithm Explanation */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow-sm border border-indigo-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-indigo-600" />
                    AI Categorization Algorithm
                  </h4>
                  <div className="space-y-2 text-xs text-gray-700">
                    <p><strong>Neural Network Processing:</strong> The AI analyzes 4 key metrics to categorize student learning:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li><strong>Pattern Recognition Score:</strong> Ability to identify and apply OOP patterns correctly</li>
                      <li><strong>OOP Mastery Score:</strong> Understanding of encapsulation, inheritance, polymorphism, abstraction</li>
                      <li><strong>Code Quality Score:</strong> Naming conventions, structure, readability, best practices</li>
                      <li><strong>Error Rate:</strong> Compilation errors, runtime errors, logic errors (inverse scoring)</li>
                    </ol>
                    <p className="mt-2"><strong>Classification Formula:</strong></p>
                    <div className="bg-white p-2 rounded border border-indigo-200 font-mono text-xs">
                      Overall Score = (Pattern × 0.35) + (OOP × 0.30) + (Quality × 0.25) + ((100-Errors) × 0.10)
                    </div>
                    <p className="mt-2"><strong>Category Assignment:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>HIGH: Overall Score ≥ 80% AND all metrics ≥ 70%</li>
                      <li>MEDIUM: Overall Score 50-79% OR mixed performance</li>
                      <li>LOW: Overall Score &lt; 50% OR critical deficiency in any metric</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monitor Coding Behavior - Real-time Feed */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Monitor Coding Behavior - Live Activity Feed
                  </CardTitle>
                  <CardDescription>Real-time student actions and submissions</CardDescription>
                </div>
                <Badge className="bg-green-500 text-white animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full inline-block mr-2"></span>
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div 
                      key={activity.id}
                      className={`p-4 rounded-lg border-l-4 ${activity.borderColor} ${activity.bgColor}`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 ${activity.color} flex-shrink-0 mt-0.5`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-semibold text-gray-900">{activity.student}</span>
                            </div>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{activity.action}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs capitalize">
                                {activity.status.replace('-', ' ')}
                              </Badge>
                              {activity.score !== null && (
                                <Badge className="bg-green-100 text-green-800 border-0 text-xs">
                                  Score: {activity.score}%
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-1">
                              {activity.status === 'completed' && (
                                <>
                                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                                    <Eye className="w-3 h-3 mr-1" />
                                    View Code
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                                    <BarChart3 className="w-3 h-3 mr-1" />
                                    Analytics
                                  </Button>
                                </>
                              )}
                              {(activity.status === 'error' || activity.status === 'failed') && (
                                <>
                                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                                    <FileCode className="w-3 h-3 mr-1" />
                                    Debug
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                                    <Send className="w-3 h-3 mr-1" />
                                    Help
                                  </Button>
                                </>
                              )}
                              {activity.status === 'in-progress' && (
                                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                                  <Eye className="w-3 h-3 mr-1" />
                                  Monitor
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                Message
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Identify Learning Patterns */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Identify Learning Patterns
              </CardTitle>
              <CardDescription>Class-wide behavioral trends and patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningPatterns.map((pattern) => (
                  <div key={pattern.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{pattern.pattern}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {pattern.students} students ({pattern.percentage}%)
                        </Badge>
                        <Badge className={
                          pattern.trend === 'increasing' ? 'bg-orange-100 text-orange-700 border-0' :
                          pattern.trend === 'decreasing' ? 'bg-green-100 text-green-700 border-0' :
                          'bg-blue-100 text-blue-700 border-0'
                        }>
                          {pattern.trend}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{pattern.description}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        <strong>Recommended Action:</strong> {pattern.action}
                      </p>
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        <Settings className="w-3 h-3 mr-1" />
                        Adjust Course
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Coding Behaviors */}
        <div className="space-y-6">
          {/* Coding Behavior Patterns */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-orange-600" />
                Coding Behaviors
              </CardTitle>
              <CardDescription>Individual student patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {codingBehaviors.map((behavior) => (
                  <div 
                    key={behavior.id}
                    className={`p-3 rounded-lg border-l-4 ${behavior.borderColor} ${behavior.bgColor}`}
                  >
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-gray-900">{behavior.student}</span>
                        <Badge className={
                          behavior.severity === 'high' ? 'bg-red-500 text-white border-0' :
                          behavior.severity === 'medium' ? 'bg-orange-500 text-white border-0' :
                          'bg-green-500 text-white border-0'
                        } style={{ fontSize: '10px', padding: '2px 6px' }}>
                          {behavior.severity === 'positive' ? 'Excellent' : behavior.severity}
                        </Badge>
                      </div>
                      <p className={`text-xs font-medium ${behavior.color}`}>{behavior.pattern}</p>
                    </div>
                    <p className="text-xs text-gray-700 mb-2">{behavior.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{behavior.occurrences} occurrences</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        <strong>Action:</strong> {behavior.recommendation}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full mt-2 h-7 text-xs"
                      onClick={() => handleMakeAdjustment(behavior)}
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Make Instructional Adjustment
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-base">Monitoring Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-700">Total Students</span>
                <Badge className="bg-blue-500 text-white">{allStudents.length}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-700">High Performers</span>
                <Badge className="bg-green-500 text-white">{highPerformanceStudents.length}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-700">Need Help (Low)</span>
                <Badge className="bg-red-500 text-white">{lowPerformanceStudents.length}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-700">Patterns Detected</span>
                <Badge className="bg-purple-500 text-white">{codingBehaviors.length}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Complete Student List by Performance Level */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Complete Student Roster by Performance Level
              </CardTitle>
              <CardDescription className="mt-1">
                All {allStudents.length} students categorized by current performance: 
                <span className="ml-2 text-green-600 font-semibold">HIGH ({highPerformanceStudents.length})</span> •
                <span className="ml-2 text-orange-600 font-semibold">MEDIUM ({mediumPerformanceStudents.length})</span> •
                <span className="ml-2 text-red-600 font-semibold">LOW ({lowPerformanceStudents.length})</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* HIGH PERFORMANCE STUDENTS */}
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-200">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-green-800">
                  HIGH PERFORMANCE (≥80%) - {highPerformanceStudents.length} Students
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {highPerformanceStudents.map((student) => (
                  <div 
                    key={student.id}
                    className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-green-700" />
                          <h4 className="font-semibold text-gray-900">{student.name}</h4>
                          <Badge className="bg-green-600 text-white text-xs">
                            {student.averageScore}%
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-0.5 ml-6">
                          <p>ID: {student.studentId} • Email: {student.email}</p>
                          <p>
                            <span className="font-medium">Modules Completed:</span> {student.modulesCompleted}/10 • 
                            <span className="font-medium ml-2">Submissions:</span> {student.totalSubmissions}
                          </p>
                          <p className="text-green-700">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Last active: {new Date(student.lastActive).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Award className="w-5 h-5 text-green-600 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MEDIUM PERFORMANCE STUDENTS */}
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-orange-200">
                <Activity className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold text-orange-800">
                  MEDIUM PERFORMANCE (60-79%) - {mediumPerformanceStudents.length} Students
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mediumPerformanceStudents.map((student) => (
                  <div 
                    key={student.id}
                    className="p-4 rounded-lg border-l-4 border-orange-500 bg-orange-50 hover:bg-orange-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-orange-700" />
                          <h4 className="font-semibold text-gray-900">{student.name}</h4>
                          <Badge className="bg-orange-600 text-white text-xs">
                            {student.averageScore}%
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-0.5 ml-6">
                          <p>ID: {student.studentId} • Email: {student.email}</p>
                          <p>
                            <span className="font-medium">Modules Completed:</span> {student.modulesCompleted}/10 • 
                            <span className="font-medium ml-2">Submissions:</span> {student.totalSubmissions}
                          </p>
                          <p className="text-orange-700">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Last active: {new Date(student.lastActive).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Target className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LOW PERFORMANCE STUDENTS */}
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-red-200">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-bold text-red-800">
                  LOW PERFORMANCE (&lt;60%) - {lowPerformanceStudents.length} Students - NEEDS INTERVENTION
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lowPerformanceStudents.map((student) => {
                  const daysSinceActive = Math.floor((Date.now() - new Date(student.lastActive).getTime()) / (1000 * 60 * 60 * 24));
                  const isInactive = daysSinceActive > 3;
                  
                  return (
                    <div 
                      key={student.id}
                      className={`p-4 rounded-lg border-l-4 border-red-500 bg-red-50 hover:bg-red-100 transition-colors ${isInactive ? 'ring-2 ring-red-300' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-red-700" />
                            <h4 className="font-semibold text-gray-900">{student.name}</h4>
                            <Badge className="bg-red-600 text-white text-xs">
                              {student.averageScore}%
                            </Badge>
                            {isInactive && (
                              <Badge className="bg-red-700 text-white text-xs animate-pulse">
                                INACTIVE {daysSinceActive}d
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 space-y-0.5 ml-6">
                            <p>ID: {student.studentId} • Email: {student.email}</p>
                            <p>
                              <span className="font-medium">Modules Completed:</span> {student.modulesCompleted}/10 • 
                              <span className="font-medium ml-2">Submissions:</span> {student.totalSubmissions}
                            </p>
                            <p className={isInactive ? 'text-red-700 font-semibold' : 'text-red-700'}>
                              <Clock className="w-3 h-3 inline mr-1" />
                              Last active: {new Date(student.lastActive).toLocaleString()}
                              {isInactive && ' ⚠️ URGENT'}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                          <Button 
                            size="sm" 
                            className="bg-red-600 hover:bg-red-700 text-white h-7 text-xs"
                            onClick={() => toast.info(`Intervention required for ${student.name}`)}
                          >
                            <Send className="w-3 h-3 mr-1" />
                            Intervene
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Performance Distribution Summary
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{highPerformanceStudents.length}</p>
                <p className="text-sm text-gray-600">High ({Math.round((highPerformanceStudents.length / allStudents.length) * 100)}%)</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(highPerformanceStudents.length / allStudents.length) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{mediumPerformanceStudents.length}</p>
                <p className="text-sm text-gray-600">Medium ({Math.round((mediumPerformanceStudents.length / allStudents.length) * 100)}%)</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(mediumPerformanceStudents.length / allStudents.length) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{lowPerformanceStudents.length}</p>
                <p className="text-sm text-gray-600">Low ({Math.round((lowPerformanceStudents.length / allStudents.length) * 100)}%)</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(lowPerformanceStudents.length / allStudents.length) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Make Instructional Adjustment Dialog */}
      <Dialog open={adjustmentDialogOpen} onOpenChange={setAdjustmentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Make Instructional Adjustment
            </DialogTitle>
            <DialogDescription>
              Create a personalized learning adjustment for {selectedBehavior?.student}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedBehavior && (
              <div className={`p-4 rounded-lg border-l-4 ${selectedBehavior.borderColor} ${selectedBehavior.bgColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{selectedBehavior.student}</h4>
                  <Badge className={
                    selectedBehavior.severity === 'high' ? 'bg-red-500 text-white border-0' :
                    selectedBehavior.severity === 'medium' ? 'bg-orange-500 text-white border-0' :
                    'bg-green-500 text-white border-0'
                  }>
                    {selectedBehavior.severity === 'positive' ? 'Excellent' : selectedBehavior.severity}
                  </Badge>
                </div>
                <p className={`text-sm font-medium ${selectedBehavior.color} mb-1`}>
                  {selectedBehavior.pattern}
                </p>
                <p className="text-sm text-gray-700 mb-2">{selectedBehavior.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline">{selectedBehavior.occurrences} occurrences</Badge>
                  <span className="text-gray-600">• {selectedBehavior.recommendation}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="adjustment-type">Adjustment Type</Label>
              <Select value={adjustmentType} onValueChange={setAdjustmentType}>
                <SelectTrigger id="adjustment-type">
                  <SelectValue placeholder="Select adjustment type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplemental-material">Provide Supplemental Material</SelectItem>
                  <SelectItem value="one-on-one">Schedule One-on-One Session</SelectItem>
                  <SelectItem value="practice-exercises">Assign Practice Exercises</SelectItem>
                  <SelectItem value="peer-review">Encourage Peer Code Review</SelectItem>
                  <SelectItem value="encourage-leadership">Encourage Leadership Role</SelectItem>
                  <SelectItem value="modify-pacing">Modify Learning Pacing</SelectItem>
                  <SelectItem value="alternative-explanation">Provide Alternative Explanation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adjustment-details">Adjustment Details</Label>
              <Textarea
                id="adjustment-details"
                value={adjustmentMessage}
                onChange={(e) => setAdjustmentMessage(e.target.value)}
                rows={10}
                placeholder="Describe the instructional adjustment you want to make..."
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                💡 Include specific actions, resources, and expected outcomes
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setAdjustmentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmAdjustment}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              Create Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}