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
  AlertCircle, MessageSquare, Award, Download, Bell, Search, Trophy
} from 'lucide-react';
import { toast } from 'sonner';
import { createModuleNotification, createActivityNotification, createAnnouncementNotification } from '../utils/notifications';
import { getAllProgress, getAllSubmissions, getUserStats, saveNotification } from '../utils/storage';
import * as backendApi from '../services/backendApi';
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
  hasFailedFirst?: boolean;
}

export function InstructorDashboard({ user, modules, onSelectModule, onNavigate }: InstructorDashboardProps) {
  const [interventionDialogOpen, setInterventionDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentSummary | null>(null);
  const [interventionMessage, setInterventionMessage] = useState('');
  const [interventionActivity, setInterventionActivity] = useState('');
  const [lockedQuiz, setLockedQuiz] = useState<{ moduleId: string; lessonId: string } | null>(null);
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

      // Get this instructor's class schedule to filter matching students
      const instructorProfile = registeredUsers.find((u: any) => u.id === user.id);
      const instructorSchedule: string = (instructorProfile?.classSchedule || instructorProfile?.department || '').trim().toLowerCase();

      const students = registeredUsers.filter((u: any) => {
        if (u.role !== 'student') return false;
        if (u.id === 'demo-instructor' || u.id === 'demo-student') return false;
        // If instructor has a schedule, only show students with the same schedule
        if (instructorSchedule) {
          const studentSchedule = (u.classSchedule || u.department || '').trim().toLowerCase();
          return studentSchedule === instructorSchedule;
        }
        return true; // no schedule set — show all
      });

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

        // Count completed lessons — merge progress records, passed submissions, and LessonViewerSimple completedLessons keys
        const completedFromProgress = new Set(
          progress.filter((p: any) => p.completed).map((p: any) => `${p.moduleId}_${p.lessonId}`)
        );
        const completedFromSubmissions = new Set(
          submissions.filter((sub: any) => sub.passed).map((sub: any) => `${sub.moduleId}_${sub.lessonId}`)
        );
        const completedLessonsSet = new Set([...completedFromProgress, ...completedFromSubmissions]);
        // Also scan completedLessons_{userId}_{moduleId} (written by LessonViewerSimple on every quiz completion)
        for (let li = 0; li < localStorage.length; li++) {
          const lk = localStorage.key(li) || '';
          if (!lk.startsWith(`completedLessons_${s.id}_`)) continue;
          try {
            const arr: string[] = JSON.parse(localStorage.getItem(lk) || '[]');
            const modId = lk.replace(`completedLessons_${s.id}_`, '');
            arr.forEach(lessonId => completedLessonsSet.add(`${modId}_${lessonId}`));
          } catch {}
        }
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

        // Detect students who failed their first quiz attempt
        let hasFailedFirst = false;
        for (let ki = 0; ki < localStorage.length; ki++) {
          const lk = localStorage.key(ki) || '';
          if (!lk.startsWith(`quiz_attempts_${s.id}_`)) continue;
          try { if (parseInt(localStorage.getItem(lk) || '0', 10) >= 1) { hasFailedFirst = true; break; } } catch {}
        }

        summaries.push({ id: s.id, name: s.name, avgScore, completedModules: Math.floor(completedLessons / 5), issues: weakTopics, lastActive: lastActiveLabel, hasFailedFirst });
      }

      setActiveStudents(activeCount);
      setAvgCompletion(students.length > 0 ? Math.round(totalCompletionSum / students.length) : 0);

      const sorted = [...summaries].sort((a, b) => b.avgScore - a.avgScore);
      setTopStudents(sorted.filter(s => s.avgScore >= 70).slice(0, 3));
      setNeedsAttention(sorted.filter(s => s.avgScore < 70 || s.hasFailedFirst).slice(0, 5));
    } catch (err) {
      console.error('InstructorDashboard load error:', err);
    }
  }, [modules, totalLessons, refreshTick]);

  const filteredTopStudents = topStudents.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredNeedsAttention = needsAttention.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.issues.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleExportAnalytics = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `class_analytics_${dateStr}.csv`;

    const usersRaw = localStorage.getItem('registeredUsers');
    const students: any[] = usersRaw
      ? (JSON.parse(usersRaw) as any[]).filter((u: any) => u.role === 'student')
      : [];

    const rows: string[][] = [];
    rows.push(['CLASS ANALYTICS REPORT']);
    rows.push(['Export Date', new Date().toLocaleDateString()]);
    rows.push(['Total Students', String(totalStudents)]);
    rows.push(['Active Students (Last 7 Days)', String(activeStudents)]);
    rows.push(['Avg Class Completion', `${avgCompletion}%`]);
    rows.push([]);

    rows.push(['STUDENT ROSTER']);
    rows.push(['Name', 'Email', 'Avg Score', 'Completed Modules', 'Last Active', 'Weak Topics']);

    students.forEach(s => {
      const progress = getAllProgress(s.id);
      const submissions = getAllSubmissions(s.id);
      const statsData = getUserStats(s.id);

      const avgScore = statsData?.averageScore ?? (
        submissions.length > 0
          ? Math.round(submissions.reduce((sum: number, sub: any) => sum + (sub.score || 0), 0) / submissions.length)
          : 0
      );

      const completedLessons = new Set(
        progress.filter((p: any) => p.completed).map((p: any) => `${p.moduleId}_${p.lessonId}`)
      ).size;
      const completedModules = Math.floor(completedLessons / 5);

      const lastProgressMs = progress.length > 0
        ? Math.max(...progress.map((p: any) => new Date(p.lastAttempt || 0).getTime()))
        : 0;
      const lastSubmissionMs = submissions.length > 0
        ? Math.max(...submissions.map((sub: any) => new Date(sub.timestamp || 0).getTime()))
        : 0;
      const lastActivityMs = Math.max(lastProgressMs, lastSubmissionMs);
      const lastActive = lastActivityMs > 0 ? new Date(lastActivityMs).toLocaleDateString() : '';

      const weakTopics: string[] = [];
      modules.forEach(m => {
        const modProgress = progress.filter((p: any) => p.moduleId === m.id && p.completed);
        const modScores = modProgress.map((p: any) => p.score || 0);
        const modAvg = modScores.length > 0
          ? modScores.reduce((a: number, b: number) => a + b, 0) / modScores.length
          : 0;
        if (modAvg < 60 && modAvg > 0) weakTopics.push(m.title);
      });

      rows.push([
        s.name || '—',
        s.email || '—',
        `${avgScore}%`,
        String(completedModules),
        lastActive,
        weakTopics.join('; ') || 'None',
      ]);
    });

    const csv = rows
      .map(r => r.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Analytics exported: ${filename}`);
  };

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
    setInterventionMessage('');
    setInterventionActivity('');

    // Find any quiz this student failed 3 times (MAX_ATTEMPTS = 3)
    let found: { moduleId: string; lessonId: string } | null = null;
    for (let ki = 0; ki < localStorage.length; ki++) {
      const lk = localStorage.key(ki) || '';
      const prefix = `quiz_attempts_${student.id}_`;
      if (!lk.startsWith(prefix)) continue;
      try {
        if (parseInt(localStorage.getItem(lk) || '0', 10) >= 3) {
          const rest = lk.slice(prefix.length);
          const sep = rest.indexOf('_');
          if (sep !== -1) { found = { moduleId: rest.slice(0, sep), lessonId: rest.slice(sep + 1) }; break; }
        }
      } catch { /* ignore */ }
    }
    setLockedQuiz(found);
    setInterventionDialogOpen(true);
  };

  const confirmSendIntervention = async () => {
    if (!interventionMessage.trim()) { toast.error('Please enter your instructions for the student'); return; }
    if (!selectedStudent) return;

    const title = 'Remedial Activity Assigned';
    const notifId = `intervention_${Date.now()}`;

    // 1. Write to backend so the student receives it on any device
    try {
      await backendApi.createNotification({
        userId: selectedStudent.id,
        type: 'intervention',
        title,
        message: interventionMessage,
        moduleId: lockedQuiz?.moduleId,
        lessonId: lockedQuiz?.lessonId,
      });
    } catch { /* backend unreachable — fall through to local */ }

    // 2. Also write directly to local localStorage (works if same device / same browser)
    saveNotification({
      id: notifId,
      userId: selectedStudent.id,
      type: 'intervention',
      title,
      message: interventionMessage,
      moduleId: lockedQuiz?.moduleId,
      lessonId: lockedQuiz?.lessonId,
      timestamp: new Date().toISOString(),
      read: false,
      sourceType: 'instructor',
    } as any);

    // 3. Reset the locked quiz attempt counter on this device
    if (lockedQuiz) {
      localStorage.removeItem(`quiz_attempts_${selectedStudent.id}_${lockedQuiz.moduleId}_${lockedQuiz.lessonId}`);
    }

    toast.success(`Intervention sent to ${selectedStudent.name}! They have been notified.`);
    setInterventionDialogOpen(false);
    setInterventionMessage('');
    setInterventionActivity('');
    setSelectedStudent(null);
    setLockedQuiz(null);
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
        classSchedule={(() => {
          try {
            const reg = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const me = reg.find((u: any) => u.id === user.id);
            return me?.classSchedule || me?.department || '';
          } catch { return ''; }
        })()}
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

        {/* Class Leaderboard — Top 10 */}
        <Card className="border-0 shadow-md" style={{ gridColumn: '1 / -1' }}>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--foreground)', fontFamily: 'var(--font-sans)' }}>
              <Trophy style={{ width: 20, height: 20, color: '#ca8a04' }} />
              Class Leaderboard — Top 10
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              let users: any[] = [];
              try { users = JSON.parse(localStorage.getItem('registeredUsers') || '[]'); } catch {}
              const students = users.filter((u: any) => u.role !== 'instructor' && u.id !== 'demo-instructor');
              const ranked = students.map((u: any) => {
                let points = 0;
                let lessons = 0;
                modules.forEach(m => {
                  try {
                    const raw = localStorage.getItem(`moduleProgress_${u.id}_${m.id}`) || localStorage.getItem(`moduleProgress_${m.id}`);
                    if (raw) {
                      const { completedLessons, progress } = JSON.parse(raw);
                      lessons += completedLessons || 0;
                      points += (completedLessons || 0) * 10 + (progress === 100 ? 50 : 0);
                    }
                  } catch {}
                });
                try {
                  const s = JSON.parse(localStorage.getItem(`stats_${u.id}`) || '{}');
                  points += (s.totalLessonsCompleted || 0) * 10;
                } catch {}
                return { name: u.name || u.email || 'Student', email: u.email || '', points, lessonsCompleted: lessons };
              }).sort((a: any, b: any) => b.points - a.points || b.lessonsCompleted - a.lessonsCompleted).slice(0, 10);

              if (ranked.length === 0) {
                return <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', fontFamily: 'var(--font-sans)' }}>No student data yet. Students will appear here once they complete lessons.</p>;
              }

              return (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)', background: 'var(--accent)' }}>
                        <th style={{ padding: '0.625rem 1rem', textAlign: 'left', color: 'var(--muted-foreground)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rank</th>
                        <th style={{ padding: '0.625rem 1rem', textAlign: 'left', color: 'var(--muted-foreground)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student</th>
                        <th style={{ padding: '0.625rem 1rem', textAlign: 'left', color: 'var(--muted-foreground)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lessons Done</th>
                        <th style={{ padding: '0.625rem 1rem', textAlign: 'right', color: 'var(--muted-foreground)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>XP Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranked.map((entry: any, idx: number) => {
                        const isGold = idx === 0;
                        const isSilver = idx === 1;
                        const isBronze = idx === 2;
                        const medal = isGold ? '🥇' : isSilver ? '🥈' : isBronze ? '🥉' : null;
                        const rowBg = isGold ? 'linear-gradient(90deg,#fef9c3,var(--card))' : isSilver ? 'linear-gradient(90deg,#f1f5f9,var(--card))' : isBronze ? 'linear-gradient(90deg,#fdf4e7,var(--card))' : 'var(--card)';
                        return (
                          <tr key={entry.email} style={{ borderBottom: '1px solid var(--border)', background: rowBg }}>
                            <td style={{ padding: '0.625rem 1rem', fontWeight: 700, fontSize: medal ? '1.1rem' : '0.875rem', color: isGold ? '#ca8a04' : isSilver ? '#94a3b8' : isBronze ? '#c27631' : 'var(--muted-foreground)' }}>
                              {medal || `#${idx + 1}`}
                            </td>
                            <td style={{ padding: '0.625rem 1rem', color: 'var(--foreground)', fontWeight: (isGold || isSilver || isBronze) ? 700 : 400 }}>{entry.name}</td>
                            <td style={{ padding: '0.625rem 1rem', color: 'var(--muted-foreground)' }}>{entry.lessonsCompleted}</td>
                            <td style={{ padding: '0.625rem 1rem', textAlign: 'right', fontWeight: 700, color: isGold ? '#ca8a04' : isSilver ? '#94a3b8' : isBronze ? '#c27631' : 'var(--primary)' }}>{entry.points} pts</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
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
            <Button variant="outline" className="w-full justify-start" size="sm" onClick={handleExportAnalytics}>
              <Download className="w-4 h-4 mr-2" />
              Export Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Intervention Dialog */}
      <Dialog open={interventionDialogOpen} onOpenChange={setInterventionDialogOpen}>
        <DialogContent className="max-w-2xl" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          <DialogHeader>
            <DialogTitle style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--foreground)', fontFamily: 'var(--font-sans)' }}>
              <MessageSquare style={{ width: 20, height: 20, color: 'var(--primary)' }} />
              Send Intervention
            </DialogTitle>
            <DialogDescription style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}>
              Review the student's quiz result, then provide your instructions and remedial activity.
            </DialogDescription>
          </DialogHeader>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* READ-ONLY: Student submission result */}
            {selectedStudent && (
              <div style={{ borderRadius: 'var(--radius-md, 8px)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '0.625rem 1rem', background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.8rem', color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Student Submission Result (Read-Only)
                  </p>
                </div>
                <div style={{ padding: '1rem', background: 'var(--card)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: 'var(--foreground)', fontFamily: 'var(--font-sans)' }}>{selectedStudent.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}>Last active: {selectedStudent.lastActive || '—'}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--destructive)', fontFamily: 'var(--font-sans)' }}>{selectedStudent.avgScore}%</p>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}>Quiz Average</p>
                    </div>
                  </div>
                  {selectedStudent.issues.length > 0 && (
                    <div>
                      <p style={{ margin: '0 0 6px', fontSize: '0.8rem', color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}>Areas struggling with:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {selectedStudent.issues.map((issue, idx) => (
                          <Badge key={idx} variant="outline" style={{ fontSize: '0.72rem', fontFamily: 'var(--font-sans)' }}>{issue}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ padding: '0.5rem 0.75rem', background: 'color-mix(in srgb, var(--destructive) 8%, var(--card))', borderRadius: 'var(--radius-sm, 4px)', border: '1px solid color-mix(in srgb, var(--destructive) 20%, transparent)' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}>
                      Status: <span style={{ color: 'var(--destructive)', fontWeight: 600 }}>Failed — score below passing threshold (70%)</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* INSTRUCTOR INPUT: Instructions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Label htmlFor="intervention-message" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                Instructor Instructions *
              </Label>
              <Textarea
                id="intervention-message"
                value={interventionMessage}
                onChange={(e) => setInterventionMessage(e.target.value)}
                rows={5}
                placeholder="Provide specific guidance on what concepts to review and how to improve..."
                className="resize-none"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
            </div>

            {/* INSTRUCTOR INPUT: Remedial Activity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Label htmlFor="intervention-activity" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                Remedial Activity
              </Label>
              <Textarea
                id="intervention-activity"
                value={interventionActivity}
                onChange={(e) => setInterventionActivity(e.target.value)}
                rows={4}
                placeholder="Describe the activity the student must complete to gain a passing grade before moving to the next lesson..."
                className="resize-none"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}>
                Completing this activity will allow the student to retake the quiz and advance to the next lesson.
              </p>
            </div>

            {/* Quiz unlock status */}
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md, 8px)', background: lockedQuiz ? 'color-mix(in srgb, var(--success, #22c55e) 10%, var(--card))' : 'var(--muted)', border: `1px solid ${lockedQuiz ? 'color-mix(in srgb, var(--success, #22c55e) 30%, transparent)' : 'var(--border)'}` }}>
              <p style={{ margin: 0, fontSize: '0.8rem', fontFamily: 'var(--font-sans)', color: lockedQuiz ? 'var(--success, #16a34a)' : 'var(--muted-foreground)', fontWeight: 600 }}>
                {lockedQuiz
                  ? `✓ Sending this intervention will also unlock the student's locked quiz (${lockedQuiz.moduleId} · ${lockedQuiz.lessonId}).`
                  : 'No locked quiz detected for this student on this device.'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInterventionDialogOpen(false)} style={{ fontFamily: 'var(--font-sans)' }}>Cancel</Button>
            <Button
              onClick={confirmSendIntervention}
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontFamily: 'var(--font-sans)' }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Intervention
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
