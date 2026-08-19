import React, { useState, useEffect } from 'react';
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
import { getAllProgress, getAllSubmissions, getUserStats } from '../utils/storage';
import { syncBackendStudentsToLocalStorage, startRegistrationPolling } from '../utils/syncStudents';
import { AllStudentsView } from './AllStudentsView';
import { StudentDetailView } from './StudentDetailView';

interface InstructorDashboardProps {
  user: User;
  modules: Module[];
  onSelectModule: (moduleId: string) => void;
  onNavigate?: (view: string) => void;
}

interface StudentSummary {
  id: string;
  name: string;
  avgScore: number;
  completedModules: number;
  issues: string[];
  lastActive: string;
}

export function InstructorDashboard({ user, modules, onSelectModule, onNavigate }: InstructorDashboardProps) {
  const [interventionDialogOpen, setInterventionDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentSummary | null>(null);
  const [interventionMessage, setInterventionMessage] = useState('');
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null);
  const [viewingStudentName, setViewingStudentName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const [totalStudents, setTotalStudents] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);
  const [avgCompletion, setAvgCompletion] = useState(0);
  const [topStudents, setTopStudents] = useState<StudentSummary[]>([]);
  const [needsAttention, setNeedsAttention] = useState<StudentSummary[]>([]);
  const [refreshTick, setRefreshTick] = useState(0);

  const totalLessons = modules.reduce((sum, m) => sum + m.totalLessons, 0);

  // Poll backend every 30 seconds to sync students registered on other devices
  useEffect(() => {
    const stopPolling = startRegistrationPolling();
    return stopPolling; // cleanup on unmount
  }, []);

  // Re-load student list whenever a new user registers (same or other tab/device)
  useEffect(() => {
    const handleNewUser = () => setRefreshTick(t => t + 1);
    window.addEventListener('codelearn:userRegistered', handleNewUser);
    window.addEventListener('storage', handleNewUser);
    return () => {
      window.removeEventListener('codelearn:userRegistered', handleNewUser);
      window.removeEventListener('storage', handleNewUser);
    };
  }, []);

  useEffect(() => {
    try {
      const usersData = localStorage.getItem('registeredUsers');
      // refreshTick dependency ensures this re-runs when new users arrive
      const registeredUsers: any[] = usersData ? JSON.parse(usersData) : [];
      const students = registeredUsers.filter((u: any) => u.role === 'student');

      setTotalStudents(students.length);

      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      let activeCount = 0;
      let totalCompletionSum = 0;
      const summaries: StudentSummary[] = [];

      for (const s of students) {
        const progress = getAllProgress(s.id);
        const submissions = getAllSubmissions(s.id);
        const stats = getUserStats(s.id);

        const avgScore = stats?.averageScore ?? (
          submissions.length > 0
            ? Math.round(submissions.reduce((sum: number, sub: any) => sum + (sub.score || 0), 0) / submissions.length)
            : 0
        );

        // Count completed lessons — prefer progress records, fall back to passed submissions
        const completedFromProgress = new Set(
          progress.filter((p: any) => p.completed).map((p: any) => `${p.moduleId}_${p.lessonId}`)
        );
        const completedFromSubmissions = new Set(
          submissions.filter((sub: any) => sub.passed).map((sub: any) => `${sub.moduleId}_${sub.lessonId}`)
        );
        const completedLessonsSet = new Set([...completedFromProgress, ...completedFromSubmissions]);
        const completedLessons = completedLessonsSet.size;
        const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        totalCompletionSum += completionRate;

        // Active in last week — check both progress and submission timestamps
        const lastProgressTime = progress.length > 0
          ? Math.max(...progress.map((p: any) => new Date(p.lastAttempt || p.lastAccessed || 0).getTime()))
          : 0;
        const lastSubmissionTime = submissions.length > 0
          ? Math.max(...submissions.map((sub: any) => new Date(sub.timestamp || 0).getTime()))
          : 0;
        const lastActivityTime = Math.max(lastProgressTime, lastSubmissionTime);
        if (lastActivityTime > oneWeekAgo) activeCount++;

        const lastActiveMs = lastActivityTime || new Date(s.registeredAt || 0).getTime();
        const diffMs = Date.now() - lastActiveMs;
        const diffHrs = Math.floor(diffMs / 3600000);
        const lastActiveLabel = diffHrs < 1 ? 'just now'
          : diffHrs < 24 ? `${diffHrs}h ago`
          : `${Math.floor(diffHrs / 24)}d ago`;

        // Identify weak OOP topics from module progress
        const weakTopics: string[] = [];
        modules.forEach(m => {
          const modProgress = progress.filter((p: any) => p.moduleId === m.id && p.completed);
          if (modProgress.length === 0 && m.completedLessons === 0) return;
          const modScores = modProgress.map((p: any) => p.score || 0);
          const modAvg = modScores.length > 0 ? modScores.reduce((a: number, b: number) => a + b, 0) / modScores.length : 0;
          if (modAvg < 60 && modAvg > 0) weakTopics.push(m.title);
        });

        summaries.push({ id: s.id, name: s.name, avgScore, completedModules: Math.floor(completedLessons / 5), issues: weakTopics, lastActive: lastActiveLabel });
      }

      setActiveStudents(activeCount);
      setAvgCompletion(students.length > 0 ? Math.round(totalCompletionSum / students.length) : 0);

      const sorted = [...summaries].sort((a, b) => b.avgScore - a.avgScore);
      setTopStudents(sorted.filter(s => s.avgScore >= 70).slice(0, 3));
      setNeedsAttention(sorted.filter(s => s.avgScore > 0 && s.avgScore < 60).slice(0, 3));
    } catch (err) {
      console.error('InstructorDashboard load error:', err);
    }
  }, [modules, totalLessons, refreshTick]);

  const filteredTopStudents = topStudents.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredNeedsAttention = needsAttention.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.issues.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleClearStaleUsers = () => {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    try {
      const raw = localStorage.getItem('registeredUsers');
      const users: any[] = raw ? JSON.parse(raw) : [];
      const before = users.length;
      const cleaned = users.filter((u: any) =>
        u.id === 'demo-student' || u.id === 'demo-instructor' || uuidPattern.test(u.id || '')
      );
      localStorage.setItem('registeredUsers', JSON.stringify(cleaned));
      const removed = before - cleaned.length;
      toast.success(`Removed ${removed} local-only account${removed !== 1 ? 's' : ''}`, {
        description: `${cleaned.length} verified Supabase account${cleaned.length !== 1 ? 's' : ''} remain.`,
      });
      // Reload data
      window.location.reload();
    } catch (_e: unknown) {
      toast.error('Failed to clear stale data');
    }
  };

  const handleSendIntervention = (student: StudentSummary) => {
    setSelectedStudent(student);
    const issueText = student.issues.length > 0 ? student.issues.join(' and ') : 'certain OOP concepts';
    setInterventionMessage(
      `Dear ${student.name},\n\nI noticed you've been struggling with ${issueText}. I'd like to offer some additional support.\n\nWould you be available for a one-on-one session this week? We can work through these concepts together.\n\nBest regards,\n${user.name}`
    );
    setInterventionDialogOpen(true);
  };

  const confirmSendIntervention = () => {
    if (!interventionMessage.trim()) { toast.error('Please enter a message'); return; }
    toast.success(`Intervention message sent to ${selectedStudent?.name}!`);
    setInterventionDialogOpen(false);
    setInterventionMessage('');
    setSelectedStudent(null);
  };

  const handleSendDemoNotifications = () => {
    const studentIds = ['student1'];
    createModuleNotification(studentIds, 'Module 11: Advanced Design Patterns', 'mod11', user.name);
    createActivityNotification(studentIds, 'Implement Factory Pattern', 'mod11', 'lesson1', user.name, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());
    createAnnouncementNotification(studentIds, 'Midterm Exam Schedule', 'The midterm exam will be held on March 15, 2026. Please review Modules 1-5.', user.name);
    toast.success('📢 3 notifications sent to students!');
  };

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6, 1.5rem)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Badge className="bg-purple-600 text-white px-3 py-1">CCS108</Badge>
            <Badge variant="outline" className="border-blue-300 text-blue-700">Instructor</Badge>
          </div>
          <h1 style={{ color: 'var(--foreground)', margin: 0 }} className="text-3xl font-bold">Instructor Dashboard</h1>
          <p style={{ color: 'var(--muted-foreground)', margin: '0.25rem 0 0' }}>Welcome back, {user.name}! Monitor and enhance student learning with AI-powered insights.</p>
        </div>
      </div>

      {/* Search Bar + Clear Stale Data */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', width: 20, height: 20 }} />
        <input
          type="text"
          placeholder="Search students by name or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: 'var(--space-3, 0.75rem) var(--space-4, 1rem) var(--space-3, 0.75rem) 3rem',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md, 8px)',
            color: 'var(--foreground)',
            background: 'var(--card)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="border-0 shadow-md cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--brand-blue-dark, #1e40af))' }}
          onClick={() => setShowAllStudents(true)}
        >
          <CardContent className="p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <Users style={{ width: 32, height: 32, color: 'var(--primary-foreground)' }} />
              <Badge className="bg-white/20 text-white border-0">Active</Badge>
            </div>
            <p style={{ color: 'var(--primary-foreground)', margin: '0 0 4px', fontSize: '0.85rem', fontWeight: 500 }}>Total Students</p>
            <p style={{ color: 'var(--primary-foreground)', margin: 0, fontSize: '2.25rem', fontWeight: 700 }}>{totalStudents}</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', margin: '4px 0 0' }}>{activeStudents} active this week</p>
          </CardContent>
        </Card>

        <Card
          className="border-0 shadow-md cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105"
          style={{ background: 'linear-gradient(135deg, var(--secondary), var(--brand-purple-dark, #7e22ce))' }}
          onClick={() => { onNavigate?.('course-management'); toast.info('Navigating to course management...'); }}
        >
          <CardContent className="p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <BookOpen style={{ width: 32, height: 32, color: 'var(--secondary-foreground)' }} />
              <Badge className="bg-white/20 text-white border-0">Content</Badge>
            </div>
            <p style={{ color: 'var(--secondary-foreground)', margin: '0 0 4px', fontSize: '0.85rem', fontWeight: 500 }}>Course Modules</p>
            <p style={{ color: 'var(--secondary-foreground)', margin: 0, fontSize: '2.25rem', fontWeight: 700 }}>{modules.length}</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', margin: '4px 0 0' }}>{totalLessons} total lessons</p>
          </CardContent>
        </Card>

        <Card
          className="border-0 shadow-md cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105"
          style={{ background: 'linear-gradient(135deg, var(--success), #15803d)' }}
          onClick={() => { onNavigate?.('monitoring'); toast.info('Opening analytics dashboard...'); }}
        >
          <CardContent className="p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <TrendingUp style={{ width: 32, height: 32, color: 'var(--success-foreground)' }} />
              <Badge className="bg-white/20 text-white border-0">Analytics</Badge>
            </div>
            <p style={{ color: 'var(--success-foreground)', margin: '0 0 4px', fontSize: '0.85rem', fontWeight: 500 }}>Avg Completion</p>
            <p style={{ color: 'var(--success-foreground)', margin: 0, fontSize: '2.25rem', fontWeight: 700 }}>{avgCompletion}%</p>
          </CardContent>
        </Card>

        <Card
          className="border-0 shadow-md cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105"
          style={{ background: 'linear-gradient(135deg, var(--warning), #dc2626)' }}
          onClick={() => { onNavigate?.('monitoring'); toast.info('Viewing detected patterns...'); }}
        >
          <CardContent className="p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <Brain style={{ width: 32, height: 32, color: 'var(--warning-foreground)' }} />
              <Badge className="bg-white/20 text-white border-0">AI Insights</Badge>
            </div>
            <p style={{ color: 'var(--warning-foreground)', margin: '0 0 4px', fontSize: '0.85rem', fontWeight: 500 }}>Need Attention</p>
            <p style={{ color: 'var(--warning-foreground)', margin: 0, fontSize: '2.25rem', fontWeight: 700 }}>{needsAttention.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performers */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--foreground)' }}>
              <Award style={{ width: 20, height: 20, color: '#ca8a04' }} />
              Top Performers
            </CardTitle>
            <CardDescription style={{ color: 'var(--muted-foreground)' }}>Students excelling in OOP</CardDescription>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredTopStudents.length > 0 ? filteredTopStudents.map((student, index) => (
              <div
                key={student.id}
                style={{
                  padding: '0.75rem',
                  background: 'linear-gradient(90deg, #fefce8, #fff7ed)',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid #fde68a',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fbbf24', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                    #{index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--foreground)' }}>{student.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <Badge className="bg-green-100 text-green-800 border-0 text-xs">{student.avgScore}% avg</Badge>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{student.completedModules} modules</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', margin: 0 }}>
                  {searchQuery ? 'No students found' : 'No student data yet — students will appear here once they complete lessons.'}
                </p>
              </div>
            )}
            <Button variant="outline" className="w-full" size="sm" onClick={() => setShowAllStudents(true)}>
              <Users className="w-4 h-4 mr-2" />
              View All Students
            </Button>
          </CardContent>
        </Card>

        {/* Needs Attention */}
        <Card className="border-0 shadow-md" style={{ borderLeft: '4px solid var(--destructive)' }}>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--foreground)' }}>
              <AlertCircle style={{ width: 20, height: 20, color: 'var(--destructive)' }} />
              Needs Attention
            </CardTitle>
            <CardDescription style={{ color: 'var(--muted-foreground)' }}>Students requiring support</CardDescription>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredNeedsAttention.length > 0 ? filteredNeedsAttention.map((student) => (
              <div
                key={student.id}
                style={{
                  padding: '0.75rem',
                  background: '#fff1f2',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid #fecdd3',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--foreground)' }}>{student.name}</p>
                  <Badge className="bg-red-100 text-red-800 border-0 text-xs">{student.avgScore}%</Badge>
                </div>
                {student.issues.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', margin: '0 0 4px' }}>Struggling with:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {student.issues.map((issue, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{issue}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', margin: '0 0 8px' }}>Last active: {student.lastActive}</p>
                <Button
                  size="sm"
                  className="w-full mt-1 h-8 text-xs"
                  style={{ background: 'var(--destructive)', color: 'var(--destructive-foreground)' }}
                  onClick={() => handleSendIntervention(student)}
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Send Intervention
                </Button>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', margin: 0 }}>
                  {searchQuery ? 'No students found' : 'No students currently needing attention.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-md" style={{ background: 'linear-gradient(135deg, var(--accent), #dbeafe)' }}>
          <CardHeader>
            <CardTitle style={{ color: 'var(--foreground)', fontSize: '1rem' }}>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => onNavigate?.('course-management')}>
              <BookOpen className="w-4 h-4 mr-2" />
              Course Management
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => onNavigate?.('monitoring')}>
              <Activity className="w-4 h-4 mr-2" />
              Monitoring & Evaluation
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => onNavigate?.('references')}>
              <BookOpen className="w-4 h-4 mr-2" />
              View References (IEEE)
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Analytics
            </Button>
            <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 500 }}>Demo Feature</p>
              <Button
                variant="outline"
                className="w-full justify-start text-white border-0"
                size="sm"
                style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }}
                onClick={handleSendDemoNotifications}
              >
                <Bell className="w-4 h-4 mr-2" />
                Send Test Notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intervention Dialog */}
      <Dialog open={interventionDialogOpen} onOpenChange={setInterventionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--foreground)' }}>
              <MessageSquare style={{ width: 20, height: 20, color: 'var(--destructive)' }} />
              Send Intervention Message
            </DialogTitle>
            <DialogDescription style={{ color: 'var(--muted-foreground)' }}>
              Send a personalized support message to {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {selectedStudent && (
              <div style={{ padding: '1rem', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md, 8px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ margin: 0, color: 'var(--foreground)', fontWeight: 600 }}>{selectedStudent.name}</h4>
                  <Badge className="bg-red-100 text-red-800 border-0">{selectedStudent.avgScore}% Average</Badge>
                </div>
                {selectedStudent.issues.length > 0 && (
                  <div>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', margin: '0 0 4px' }}>Struggling with:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {selectedStudent.issues.map((issue, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{issue}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Label htmlFor="intervention-message" style={{ color: 'var(--foreground)' }}>Intervention Message</Label>
              <Textarea
                id="intervention-message"
                value={interventionMessage}
                onChange={(e) => setInterventionMessage(e.target.value)}
                rows={10}
                placeholder="Enter your message to the student..."
                className="resize-none"
              />
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', margin: 0 }}>
                💡 Tip: Be encouraging and specific about the support you're offering
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInterventionDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={confirmSendIntervention}
              style={{ background: 'var(--destructive)', color: 'var(--destructive-foreground)' }}
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
