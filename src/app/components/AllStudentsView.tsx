import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import {
  ArrowLeft, Search, User, Mail, Calendar,
  Award, TrendingUp, AlertCircle, Eye, Filter,
  Users, CheckCircle, BookOpen, GraduationCap,
  TrendingDown, Minus, BarChart3, Trash2, MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { getUserStats, getAllProgress, getAllSubmissions, saveNotification } from '../utils/storage';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import * as backendApi from '../services/backendApi';

interface AllStudentsViewProps {
  onBack: () => void;
  onViewStudent?: (userId: string, userName: string) => void;
  classSchedule?: string;
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  registeredAt: string;
  enrolledCourses: string[];
  completionRate: number;
  averageScore: number;
  totalSubmissions: number;
  lastActive: string;
  status: 'excellent' | 'good' | 'needs-attention';
}

export function AllStudentsView({ onBack, onViewStudent, classSchedule }: AllStudentsViewProps) {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSection, setFilterSection] = useState<'all' | 'excellent' | 'good' | 'needs-attention'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'progress'>('name');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<StudentData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [interventionTarget, setInterventionTarget] = useState<StudentData | null>(null);
  const [interventionMessage, setInterventionMessage] = useState('');
  const [lockedQuiz, setLockedQuiz] = useState<{ moduleId: string; lessonId: string } | null>(null);

  useEffect(() => {
    loadStudents();
    // Refresh when a new user registers in any tab
    const handleNewUser = () => loadStudents();
    window.addEventListener('codelearn:userRegistered', handleNewUser);
    window.addEventListener('storage', handleNewUser);
    return () => {
      window.removeEventListener('codelearn:userRegistered', handleNewUser);
      window.removeEventListener('storage', handleNewUser);
    };
  }, []);

  const confirmDeleteStudent = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    const { id, name, email } = deleteTarget;

    try {
      // 1. Remove from localStorage registeredUsers
      const raw = localStorage.getItem('registeredUsers');
      const users: any[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem('registeredUsers', JSON.stringify(users.filter((u: any) => u.id !== id)));

      // 2. Remove stored credentials
      localStorage.removeItem(`userCreds_${email}`);
      localStorage.removeItem(`userPosition_${id}`);

      // 3. Remove all student activity data from localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || '';
        if (
          key.includes(`_${id}_`) || key.includes(`_${id}`) ||
          key.startsWith(`quiz_result_${id}`) ||
          key.startsWith(`moduleProgress_${id}`) ||
          key.startsWith(`completedLessons_${id}`) ||
          key.startsWith(`stats_${id}`) ||
          key.startsWith(`progress_${id}`) ||
          key.startsWith(`submissions_${id}`) ||
          key === `currentUser` && (() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}').id === id; } catch { return false; } })()
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));

      // 4. Delete from backend KV store (profile + any quiz/progress records)
      try {
        await backendApi.getProfile(id); // check it exists first
        // Delete the profile record from KV store via backend
        await fetch(`https://ebheipblvbpjvoqhshah.supabase.co/functions/v1/make-server-c61d3fdc/profile/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
            'Content-Type': 'application/json',
          },
        }).catch(() => {}); // silently fail if not deployed
      } catch (_e: unknown) { /* backend unavailable */ }

      // 5. Update UI
      setStudents(prev => prev.filter(s => s.id !== id));
      toast.success(`Student "${name}" deleted`, {
        description: 'Account and all associated data have been removed.',
      });

      // Notify other components
      window.dispatchEvent(new CustomEvent('codelearn:userRegistered', { detail: null }));
    } catch (err: unknown) {
      toast.error('Delete failed', { description: String(err) });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const removeLocalStudent = (studentId: string, studentName: string) => {
    try {
      const raw = localStorage.getItem('registeredUsers');
      const users: any[] = raw ? JSON.parse(raw) : [];
      const updated = users.filter((u: any) => u.id !== studentId);
      localStorage.setItem('registeredUsers', JSON.stringify(updated));
      setStudents(prev => prev.filter(s => s.id !== studentId));
      toast.success(`Removed "${studentName}" from local data`);
    } catch (_e: unknown) {
      toast.error('Failed to remove student');
    }
  };

  const removeAllLocalStudents = () => {
    try {
      const raw = localStorage.getItem('registeredUsers');
      const users: any[] = raw ? JSON.parse(raw) : [];
      const verified = users.filter((u: any) => UUID_PATTERN.test(u.id || '') || u.id?.startsWith('demo-'));
      localStorage.setItem('registeredUsers', JSON.stringify(verified));
      loadStudents();
      toast.success('Removed all local-only students');
    } catch (_e: unknown) {
      toast.error('Failed to remove local students');
    }
  };

  const loadStudents = () => {
    try {
      setLoading(true);
      
      // Get all registered users from localStorage
      const usersData = localStorage.getItem('registeredUsers');
      const registeredUsers = usersData ? JSON.parse(usersData) : [];
      
      // Filter only students matching this instructor's class schedule
      const instrSchedule = (classSchedule || '').trim().toLowerCase();
      const studentUsers = registeredUsers.filter((user: any) => {
        if (user.role !== 'student') return false;
        if (!instrSchedule) return true;
        const stuSchedule = (user.classSchedule || user.department || '').trim().toLowerCase();
        return stuSchedule === instrSchedule;
      });
      
      // Calculate stats for each student
      const studentsWithStats: StudentData[] = studentUsers.map((student: any) => {
        const userStats = getUserStats(student.id);
        const allProgress = getAllProgress(student.id);
        const allSubmissions = getAllSubmissions(student.id);
        
        // Calculate completion rate — merge progress records and passed submissions to handle both old and new data
        const totalLessons = 111;
        const completedFromProgress = new Set(
          allProgress.filter((p: any) => p.completed).map((p: any) => `${p.moduleId}_${p.lessonId}`)
        );
        const completedFromSubs = new Set(
          allSubmissions.filter((s: any) => s.passed).map((s: any) => `${s.moduleId}_${s.lessonId}`)
        );
        const completedLessons = new Set([...completedFromProgress, ...completedFromSubs]).size;
        const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        
        // Calculate average score
        const averageScore = allSubmissions.length > 0
          ? Math.round(allSubmissions.reduce((sum: number, s: any) => sum + s.score, 0) / allSubmissions.length)
          : 0;
        
        // Get last active time — check both progress (lastAttempt) and submissions (timestamp)
        const lastProgressTime = allProgress.length > 0
          ? Math.max(...allProgress.map((p: any) => new Date(p.lastAttempt || p.lastAccessed || 0).getTime()))
          : 0;
        const lastSubTime = allSubmissions.length > 0
          ? Math.max(...allSubmissions.map((s: any) => new Date(s.timestamp || 0).getTime()))
          : 0;
        const lastActivityMs = Math.max(lastProgressTime, lastSubTime);
        const lastActive = lastActivityMs > 0 ? new Date(lastActivityMs).toISOString() : student.registeredAt;
        
        // Determine status
        let status: 'excellent' | 'good' | 'needs-attention' = 'good';
        // Aligned with image: HIGH (>70%), MEDIUM (40-70%), LOW (<40%)
        if (averageScore > 70) {
          status = 'excellent';
        } else if (averageScore < 40) {
          status = 'needs-attention';
        }
        
        return {
          id: student.id,
          name: student.name,
          email: student.email,
          studentId: student.studentId,
          registeredAt: student.registeredAt,
          enrolledCourses: student.enrolledCourses || ['CCS108'],
          completionRate,
          averageScore,
          totalSubmissions: allSubmissions.length,
          lastActive,
          status
        };
      });
      
      setStudents(studentsWithStats);
      setFilteredStudents(studentsWithStats);
      toast.success(`Loaded ${studentsWithStats.length} students`);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Failed to load students');
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortStudents = () => {
    const filtered = students
      .filter(student => {
        const matchesSearch = 
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        const scoreCategory =
          student.averageScore >= 90 ? 'excellent' :
          student.averageScore >= 70 ? 'good' :
          'needs-attention';
        const matchesStatus = filterSection === 'all' || scoreCategory === filterSection;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'score':
            return b.averageScore - a.averageScore;
          case 'progress':
            return b.completionRate - a.completionRate;
          default:
            return 0;
        }
      });
    
    setFilteredStudents(filtered);
  };

  useEffect(() => {
    filterAndSortStudents();
  }, [students, searchQuery, filterSection, sortBy]);

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) {
      return <Badge className="bg-green-100 text-green-800 border-0">Excellent</Badge>;
    } else if (score >= 80) {
      return <Badge className="bg-blue-100 text-blue-800 border-0">Very Good</Badge>;
    } else if (score >= 70) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-0">Good</Badge>;
    } else if (score >= 60) {
      return <Badge className="bg-orange-100 text-orange-800 border-0">Fair</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 border-0">Needs Support</Badge>;
    }
  };

  const getTrendIcon = (score: number) => {
    if (score >= 85) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (score >= 70) {
      return <Minus className="w-4 h-4 text-yellow-600" />;
    } else {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
  };

  const calculateOverallStats = () => {
    const totalStudents = students.length;
    
    if (totalStudents === 0) {
      return {
        total: 0,
        avgScore: 0,
        avgCompletion: 0,
        struggling: 0
      };
    }
    
    const avgScore = students.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents;
    // Calculate average completion rate across all students
    const avgCompletion = students.reduce((sum, student) => sum + student.completionRate, 0) / totalStudents;
    
    // Count students who are struggling (score below 70%)
    const struggling = students.filter(student => student.averageScore < 70).length;
    
    return {
      total: totalStudents,
      avgScore: Math.round(avgScore),
      avgCompletion: Math.round(avgCompletion),
      struggling
    };
  };

  const stats = calculateOverallStats();

  const openIntervention = (student: StudentData) => {
    setInterventionTarget(student);
    setInterventionMessage('');
    // Detect locked quiz for this student
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
  };

  const confirmIntervention = async () => {
    if (!interventionMessage.trim()) { toast.error('Please enter your instructions for the student'); return; }
    if (!interventionTarget) return;

    const title = 'Remedial Activity Assigned';
    const notifId = `intervention_${Date.now()}`;

    try {
      await backendApi.createNotification({
        userId: interventionTarget.id,
        type: 'intervention',
        title,
        message: interventionMessage,
        moduleId: lockedQuiz?.moduleId,
        lessonId: lockedQuiz?.lessonId,
      });
    } catch { /* backend unreachable */ }

    saveNotification({
      id: notifId,
      userId: interventionTarget.id,
      type: 'intervention',
      title,
      message: interventionMessage,
      moduleId: lockedQuiz?.moduleId,
      lessonId: lockedQuiz?.lessonId,
      timestamp: new Date().toISOString(),
      read: false,
      sourceType: 'instructor',
    } as any);

    if (lockedQuiz) {
      localStorage.removeItem(`quiz_attempts_${interventionTarget.id}_${lockedQuiz.moduleId}_${lockedQuiz.lessonId}`);
    }

    toast.success(`Intervention sent to ${interventionTarget.name}! They have been notified.`);
    setInterventionTarget(null);
    setInterventionMessage('');
    setLockedQuiz(null);
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
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              All Students
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage all enrolled students in CCS108
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadStudents}
          className="flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <Users className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Score</p>
                <p className="text-3xl font-bold text-green-700">{stats.avgScore}%</p>
              </div>
              <Award className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Completion</p>
                <p className="text-3xl font-bold text-purple-700">{stats.avgCompletion}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Need Support</p>
                <p className="text-3xl font-bold text-red-700">{stats.struggling}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, student ID, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Section Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterSection === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterSection('all')}
              >
                All Sections
              </Button>
              <Button
                variant={filterSection === 'excellent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterSection('excellent')}
              >
                Excellent
              </Button>
              <Button
                variant={filterSection === 'good' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterSection('good')}
              >
                Good
              </Button>
              <Button
                variant={filterSection === 'needs-attention' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterSection('needs-attention')}
              >
                Needs Attention
              </Button>
            </div>

            {/* Sort By */}
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'score' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('score')}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Score
              </Button>
              <Button
                variant={sortBy === 'progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('progress')}
              >
                <BookOpen className="w-4 h-4 mr-1" />
                Progress
              </Button>
              <Button
                variant={sortBy === 'name' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('name')}
              >
                Name
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      {loading ? (
        <Card className="border-0 shadow-md">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Loading students...</p>
          </CardContent>
        </Card>
      ) : filteredStudents.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No students found matching your criteria</p>
          </CardContent>
        </Card>
      ) : (
        <>
        <div className="grid grid-cols-1 gap-4">
          {filteredStudents.map((student, index) => (
            <Card 
              key={student.id} 
              className={`border-0 shadow-md transition-all duration-200 hover:shadow-lg ${
                student.averageScore < 70 ? 'border-l-4 border-l-red-500' : ''
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  {/* Student Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg">
                      {/* Generate initials from student name */}
                      {student.name.split(' ').map(namePart => namePart[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{student.name}</h3>
                        {index < 3 && <Award className="w-4 h-4 text-yellow-500" />}
                        {getPerformanceBadge(student.averageScore)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <strong>ID:</strong> {student.studentId}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {student.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="flex items-center gap-2 justify-center mb-1">
                        <p className="text-2xl font-bold text-blue-600">{student.averageScore}%</p>
                        {getTrendIcon(student.averageScore)}
                      </div>
                      <p className="text-xs text-gray-600">Avg Score</p>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{student.completionRate}%</p>
                      <p className="text-xs text-gray-600">Completion</p>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{student.totalSubmissions}</p>
                      <p className="text-xs text-gray-600">Submissions</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (onViewStudent) {
                            onViewStudent(student.id, student.name);
                          } else {
                            toast.info(`Viewing detailed analytics for ${student.name}`);
                          }
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      {student.averageScore < 70 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                          onClick={() => openIntervention(student)}
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Send Intervention
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </>
      )}

      {/* Results Summary */}
      <div className="text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
        Showing {filteredStudents.length} of {students.length} students
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--foreground)' }} className="flex items-center gap-2">
              <Trash2 className="w-5 h-5" style={{ color: 'var(--destructive)' }} />
              Delete Student Account
            </DialogTitle>
            <DialogDescription style={{ color: 'var(--muted-foreground)' }}>
              This will permanently delete <strong style={{ color: 'var(--foreground)' }}>{deleteTarget?.name}</strong>'s account and all their data including quiz results, progress, and submissions. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteTarget && (
            <div className="p-4 rounded-lg" style={{ background: 'var(--accent)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{deleteTarget.name}</p>
                  <p style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem' }}>{deleteTarget.email}</p>
                  {deleteTarget.studentId && (
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem' }}>ID: {deleteTarget.studentId}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteStudent}
              disabled={isDeleting}
              style={{ background: 'var(--destructive)', color: '#fff' }}
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Permanently
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Intervention Dialog */}
      <Dialog open={!!interventionTarget} onOpenChange={(open) => { if (!open) { setInterventionTarget(null); setInterventionMessage(''); setLockedQuiz(null); } }}>
        <DialogContent className="max-w-lg" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          <DialogHeader>
            <DialogTitle style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--foreground)', fontFamily: 'var(--font-sans)' }}>
              <MessageSquare style={{ width: 20, height: 20, color: 'var(--primary)' }} />
              Send Intervention
            </DialogTitle>
            <DialogDescription style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}>
              {interventionTarget?.name} · Avg score: {interventionTarget?.averageScore}%
            </DialogDescription>
          </DialogHeader>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Label style={{ color: 'var(--foreground)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                Instructor Instructions *
              </Label>
              <Textarea
                value={interventionMessage}
                onChange={(e) => setInterventionMessage(e.target.value)}
                rows={5}
                placeholder="Provide specific guidance on what concepts to review and how to improve..."
                className="resize-none"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
            </div>

            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md, 8px)', background: lockedQuiz ? 'color-mix(in srgb, var(--success, #22c55e) 10%, var(--card))' : 'var(--muted)', border: `1px solid ${lockedQuiz ? 'color-mix(in srgb, var(--success, #22c55e) 30%, transparent)' : 'var(--border)'}` }}>
              <p style={{ margin: 0, fontSize: '0.8rem', fontFamily: 'var(--font-sans)', color: lockedQuiz ? 'var(--success, #16a34a)' : 'var(--muted-foreground)', fontWeight: 600 }}>
                {lockedQuiz
                  ? `✓ Will unlock locked quiz: ${lockedQuiz.moduleId} · ${lockedQuiz.lessonId}`
                  : 'No locked quiz detected for this student on this device.'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setInterventionTarget(null); setInterventionMessage(''); setLockedQuiz(null); }} style={{ fontFamily: 'var(--font-sans)' }}>Cancel</Button>
            <Button
              onClick={confirmIntervention}
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