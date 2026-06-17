import React, { useState, useEffect } from 'react';
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
import { syncBackendStudentsToLocalStorage } from '../utils/syncStudents';

interface MonitoringViewProps {
  onBack: () => void;
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  avgScore: number;
  quizCount: number;
  modulesCompleted: number;
  lastActive: string | null;
  level: 'HIGH' | 'MEDIUM' | 'LOW' | 'NEW';
}

interface ActivityItem {
  id: string;
  student: string;
  action: string;
  time: string;
  status: string;
  score: number | null;
  timestamp: number;
}

function getRelativeTime(ts: number): string {
  const diffMs = Date.now() - ts;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function MonitoringView({ onBack }: MonitoringViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [adjustmentType, setAdjustmentType] = useState('');
  const [adjustmentMessage, setAdjustmentMessage] = useState('');
  const [students, setStudents] = useState<StudentData[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    syncBackendStudentsToLocalStorage().catch(() => {});
  }, []);

  useEffect(() => {
    const registered: any[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const realStudents = registered.filter((u: any) => u.role === 'student');

    const computedStudents: StudentData[] = realStudents.map((user: any) => {
      // Collect all quiz results for this student
      const quizScores: number[] = [];
      const completedModuleIds = new Set<string>();
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || '';
        if (key.startsWith(`quiz_${user.id}_`) || key.startsWith(`quiz_`)) {
          // quiz_{moduleId}_{lessonId} is shared across sessions, not per-user
          // Try user-specific key first
        }
        if (key.startsWith(`quiz_result_${user.id}_`)) {
          try {
            const val = JSON.parse(localStorage.getItem(key) || '{}');
            if (typeof val.score === 'number') quizScores.push(val.score);
          } catch {}
        }
        if (key.startsWith(`moduleProgress_${user.id}_`)) {
          try {
            const val = JSON.parse(localStorage.getItem(key) || '{}');
            if (val.completedLessons && val.completedLessons.length > 0) {
              const moduleId = key.replace(`moduleProgress_${user.id}_`, '');
              const module = mockModules.find(m => m.id === moduleId);
              if (module && val.completedLessons.length >= module.lessons.length) {
                completedModuleIds.add(moduleId);
              }
            }
          } catch {}
        }
      }

      // Also check shared quiz keys (quiz_{moduleId}_{lessonId}) if student is logged in
      // These aren't user-specific but let's use getUserStats as fallback
      const statsRaw = localStorage.getItem(`stats_${user.id}`);
      let statsScores: number[] = [];
      let lastActive: string | null = null;
      if (statsRaw) {
        try {
          const stats = JSON.parse(statsRaw);
          if (stats.quizScores && Array.isArray(stats.quizScores)) statsScores = stats.quizScores;
          if (stats.lastActive) lastActive = stats.lastActive;
        } catch {}
      }

      const allScores = [...quizScores, ...statsScores];
      const avgScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
      const quizCount = allScores.length;

      let level: StudentData['level'] = 'NEW';
      if (quizCount > 0) {
        if (avgScore >= 80) level = 'HIGH';
        else if (avgScore >= 60) level = 'MEDIUM';
        else level = 'LOW';
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email || '',
        avgScore,
        quizCount,
        modulesCompleted: completedModuleIds.size,
        lastActive,
        level,
      };
    });

    setStudents(computedStudents);

    // Build recent activities from localStorage quiz results
    const activities: ActivityItem[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      if (key.startsWith('quiz_result_')) {
        const parts = key.split('_');
        // quiz_result_{userId}_{moduleId}_{lessonId}
        if (parts.length >= 5) {
          const userId = parts[2];
          const student = realStudents.find((u: any) => u.id === userId);
          if (!student) continue;
          try {
            const val = JSON.parse(localStorage.getItem(key) || '{}');
            const moduleId = parts.slice(3, parts.length - 1).join('_');
            const lessonId = parts[parts.length - 1];
            const module = mockModules.find(m => m.id === moduleId);
            const lesson = module?.lessons.find(l => l.id === lessonId);
            const ts = val.completedAt ? new Date(val.completedAt).getTime() : 0;
            if (ts > 0) {
              activities.push({
                id: key,
                student: student.name,
                action: `Completed quiz: ${lesson?.title || lessonId}`,
                time: getRelativeTime(ts),
                status: val.score >= 70 ? 'completed' : 'needs-review',
                score: typeof val.score === 'number' ? val.score : null,
                timestamp: ts,
              });
            }
          } catch {}
        }
      }
      if (key.startsWith('moduleProgress_')) {
        const parts = key.split('_');
        // moduleProgress_{userId}_{moduleId}
        if (parts.length >= 3) {
          const userId = parts[1];
          const student = realStudents.find((u: any) => u.id === userId);
          if (!student) continue;
          try {
            const val = JSON.parse(localStorage.getItem(key) || '{}');
            const moduleId = parts.slice(2).join('_');
            const module = mockModules.find(m => m.id === moduleId);
            if (val.lastAccessed && val.completedLessons?.length > 0) {
              const ts = new Date(val.lastAccessed).getTime();
              activities.push({
                id: key + '_progress',
                student: student.name,
                action: `Studying: ${module?.title || moduleId} (${val.completedLessons.length} lessons done)`,
                time: getRelativeTime(ts),
                status: 'in-progress',
                score: null,
                timestamp: ts,
              });
            }
          } catch {}
        }
      }
    }

    activities.sort((a, b) => b.timestamp - a.timestamp);
    setRecentActivities(activities.slice(0, 10));
  }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const highStudents = filtered.filter(s => s.level === 'HIGH');
  const mediumStudents = filtered.filter(s => s.level === 'MEDIUM');
  const lowStudents = filtered.filter(s => s.level === 'LOW');
  const newStudents = filtered.filter(s => s.level === 'NEW');

  const handleMakeAdjustment = (student: StudentData) => {
    setSelectedStudent(student);
    setAdjustmentType(student.level === 'LOW' ? 'supplemental-material' : student.level === 'MEDIUM' ? 'practice-exercises' : 'encourage-leadership');
    setAdjustmentMessage(`Student: ${student.name}\nCurrent average score: ${student.avgScore}%\nQuizzes completed: ${student.quizCount}\n\nRecommended action:\n- `);
    setAdjustmentDialogOpen(true);
  };

  const confirmAdjustment = () => {
    if (!adjustmentType) { toast.error('Please select an adjustment type'); return; }
    if (!adjustmentMessage.trim()) { toast.error('Please enter adjustment details'); return; }
    toast.success(`Instructional adjustment created for ${selectedStudent?.name}!`);
    setAdjustmentDialogOpen(false);
    setAdjustmentType('');
    setAdjustmentMessage('');
    setSelectedStudent(null);
  };

  const getActivityStyle = (status: string) => {
    if (status === 'completed') return { border: 'border-green-400', bg: 'bg-green-50', color: 'text-green-600', Icon: CheckCircle2 };
    if (status === 'needs-review') return { border: 'border-orange-400', bg: 'bg-orange-50', color: 'text-orange-600', Icon: AlertCircle };
    return { border: 'border-blue-400', bg: 'bg-blue-50', color: 'text-blue-600', Icon: Activity };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-2 -ml-2" style={{ color: 'var(--muted-foreground)' }}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Badge style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }} className="px-3 py-1">CCS108</Badge>
              <Badge variant="outline">Monitoring</Badge>
            </div>
            <h1 style={{ color: 'var(--foreground)' }} className="mt-2">Monitoring and Evaluation</h1>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Real-time student activity tracking and performance analysis</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filter</Button>
            <Button variant="outline"><Settings className="w-4 h-4 mr-2" />Configure Alerts</Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <Card style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              <Input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline"><Clock className="w-4 h-4 mr-2" />Recent</Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
          <CardContent className="p-5 text-center">
            <Users className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--primary)' }} />
            <p className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>{students.length}</p>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem' }}>Total Students</p>
          </CardContent>
        </Card>
        <Card style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
          <CardContent className="p-5 text-center">
            <Award className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--success)' }} />
            <p className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>{highStudents.length}</p>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem' }}>High Performers</p>
          </CardContent>
        </Card>
        <Card style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
          <CardContent className="p-5 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--warning)' }} />
            <p className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>{mediumStudents.length}</p>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem' }}>Medium Performers</p>
          </CardContent>
        </Card>
        <Card style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
          <CardContent className="p-5 text-center">
            <AlertCircle className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--destructive)' }} />
            <p className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>{lowStudents.length}</p>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem' }}>Need Intervention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Activity Feed + Student Roster */}
        <div className="lg:col-span-2 space-y-6">

          {/* Live Activity Feed */}
          <Card style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                    <Activity className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    Live Activity Feed
                  </CardTitle>
                  <CardDescription style={{ color: 'var(--muted-foreground)' }}>Recent student actions and quiz completions</CardDescription>
                </div>
                <Badge style={{ background: 'var(--success)', color: '#fff' }} className="animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full inline-block mr-2" />Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {recentActivities.length === 0 ? (
                <div className="py-12 text-center">
                  <Activity className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} />
                  <p style={{ color: 'var(--muted-foreground)' }}>No student activity recorded yet.</p>
                  <p style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem' }} className="mt-1">Activity will appear here once students complete lessons or quizzes.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivities.map((activity) => {
                    const { border, bg, color, Icon } = getActivityStyle(activity.status);
                    return (
                      <div key={activity.id} className={`p-4 rounded-lg border-l-4 ${border} ${bg}`}>
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 ${color} flex-shrink-0 mt-0.5`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{activity.student}</span>
                              </div>
                              <span style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem' }}>{activity.time}</span>
                            </div>
                            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }} className="mb-2">{activity.action}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs capitalize">{activity.status.replace('-', ' ')}</Badge>
                              {activity.score !== null && (
                                <Badge className="text-xs" style={{ background: activity.score >= 70 ? 'var(--success)' : 'var(--warning)', color: '#fff' }}>
                                  Score: {activity.score}%
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Complete Student Roster */}
          <Card style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <Users className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                Student Roster by Performance
              </CardTitle>
              <CardDescription style={{ color: 'var(--muted-foreground)' }}>
                {students.length} registered students — categorized by quiz average
              </CardDescription>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} />
                  <p style={{ color: 'var(--muted-foreground)' }}>No registered students yet.</p>
                  <p style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem' }} className="mt-1">Students will appear here after they create accounts.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* HIGH */}
                  {highStudents.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '2px solid #86efac' }}>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <h3 className="font-bold text-green-800">HIGH PERFORMANCE (≥80%) — {highStudents.length} Students</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {highStudents.map(s => (
                          <StudentCard key={s.id} student={s} borderColor="border-green-500" bg="bg-green-50" scoreColor="bg-green-600" icon={<Award className="w-5 h-5 text-green-600" />} onAdjust={handleMakeAdjustment} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MEDIUM */}
                  {mediumStudents.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '2px solid #fdba74' }}>
                        <Activity className="w-5 h-5 text-orange-600" />
                        <h3 className="font-bold text-orange-800">MEDIUM PERFORMANCE (60-79%) — {mediumStudents.length} Students</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mediumStudents.map(s => (
                          <StudentCard key={s.id} student={s} borderColor="border-orange-500" bg="bg-orange-50" scoreColor="bg-orange-600" icon={<Target className="w-5 h-5 text-orange-600" />} onAdjust={handleMakeAdjustment} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LOW */}
                  {lowStudents.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '2px solid #fca5a5' }}>
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <h3 className="font-bold text-red-800">LOW PERFORMANCE (&lt;60%) — {lowStudents.length} Students — NEEDS INTERVENTION</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {lowStudents.map(s => (
                          <StudentCard key={s.id} student={s} borderColor="border-red-500" bg="bg-red-50" scoreColor="bg-red-600" icon={<XCircle className="w-5 h-5 text-red-600" />} onAdjust={handleMakeAdjustment} urgent />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* NEW / No activity */}
                  {newStudents.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '2px solid var(--border)' }}>
                        <BookOpen className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                        <h3 className="font-bold" style={{ color: 'var(--muted-foreground)' }}>NEW — {newStudents.length} Students (No quizzes yet)</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {newStudents.map(s => (
                          <StudentCard key={s.id} student={s} borderColor="border-gray-300" bg="bg-gray-50" scoreColor="bg-gray-400" icon={<User className="w-5 h-5 text-gray-400" />} onAdjust={handleMakeAdjustment} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Distribution Summary */}
                  <div className="mt-4 p-4 rounded-lg" style={{ background: 'var(--accent)', border: '1px solid var(--border)' }}>
                    <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                      <BarChart3 className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                      Performance Distribution
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {[
                        { label: 'High', count: highStudents.length, color: '#16a34a' },
                        { label: 'Medium', count: mediumStudents.length, color: '#d97706' },
                        { label: 'Low', count: lowStudents.length, color: '#dc2626' },
                      ].map(({ label, count, color }) => (
                        <div key={label}>
                          <p className="text-2xl font-bold" style={{ color }}>{count}</p>
                          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem' }}>
                            {label} ({students.length > 0 ? Math.round((count / students.length) * 100) : 0}%)
                          </p>
                          <div className="mt-2 w-full rounded-full h-2" style={{ background: 'var(--border)' }}>
                            <div className="h-2 rounded-full" style={{ width: `${students.length > 0 ? (count / students.length) * 100 : 0}%`, background: color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right — Neural Network Panel */}
        <div className="space-y-6">
          <Card style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <Brain className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                AI Pattern Recognition
              </CardTitle>
              <CardDescription style={{ color: 'var(--muted-foreground)' }}>Neural network analysis metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg" style={{ background: 'var(--accent)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Network className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Students Analyzed</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{students.length}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--accent)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <FileCode className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Quiz Completions</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{students.reduce((a, s) => a + s.quizCount, 0)}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--accent)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Class Avg Score</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {students.filter(s => s.quizCount > 0).length > 0
                    ? Math.round(students.filter(s => s.quizCount > 0).reduce((a, s) => a + s.avgScore, 0) / students.filter(s => s.quizCount > 0).length)
                    : 0}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
            <CardHeader>
              <CardTitle style={{ color: 'var(--foreground)', fontSize: '1rem' }}>AI Categorization Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <p className="font-semibold text-green-800">HIGH (≥80%)</p>
                  <p className="text-xs text-green-700 mt-1">Excelling — assign advanced challenges, encourage peer tutoring</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <p className="font-semibold text-yellow-800">MEDIUM (60–79%)</p>
                  <p className="text-xs text-yellow-700 mt-1">Progressing — targeted exercises, supplemental materials</p>
                </div>
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="font-semibold text-red-800">LOW (&lt;60%)</p>
                  <p className="text-xs text-red-700 mt-1">Needs help — immediate intervention, one-on-one tutoring</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <p className="font-semibold text-gray-700">NEW</p>
                  <p className="text-xs text-gray-600 mt-1">Registered but no quiz activity yet</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructional Adjustment Dialog */}
      <Dialog open={adjustmentDialogOpen} onOpenChange={setAdjustmentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              Make Instructional Adjustment
            </DialogTitle>
            <DialogDescription>
              Create a personalized learning adjustment for {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedStudent && (
              <div className="p-4 rounded-lg" style={{ background: 'var(--accent)', border: '1px solid var(--border)' }}>
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{selectedStudent.name}</p>
                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem' }}>{selectedStudent.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>Avg: {selectedStudent.avgScore}%</Badge>
                  <Badge variant="outline">Quizzes: {selectedStudent.quizCount}</Badge>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="adj-type">Adjustment Type</Label>
              <Select value={adjustmentType} onValueChange={setAdjustmentType}>
                <SelectTrigger id="adj-type"><SelectValue placeholder="Select type..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplemental-material">Provide Supplemental Material</SelectItem>
                  <SelectItem value="one-on-one">Schedule One-on-One Session</SelectItem>
                  <SelectItem value="practice-exercises">Assign Practice Exercises</SelectItem>
                  <SelectItem value="peer-review">Encourage Peer Code Review</SelectItem>
                  <SelectItem value="encourage-leadership">Encourage Leadership Role</SelectItem>
                  <SelectItem value="modify-pacing">Modify Learning Pacing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adj-details">Adjustment Details</Label>
              <Textarea
                id="adj-details"
                value={adjustmentMessage}
                onChange={(e) => setAdjustmentMessage(e.target.value)}
                rows={6}
                placeholder="Describe the instructional adjustment..."
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustmentDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmAdjustment} style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              <Settings className="w-4 h-4 mr-2" />Create Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StudentCard({ student, borderColor, bg, scoreColor, icon, onAdjust, urgent }: {
  student: StudentData;
  borderColor: string;
  bg: string;
  scoreColor: string;
  icon: React.ReactNode;
  onAdjust: (s: StudentData) => void;
  urgent?: boolean;
}) {
  return (
    <div className={`p-4 rounded-lg border-l-4 ${borderColor} ${bg} hover:opacity-90 transition-opacity`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {icon}
            <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{student.name}</span>
            {student.quizCount > 0 && (
              <Badge className={`${scoreColor} text-white text-xs`}>{student.avgScore}%</Badge>
            )}
            {urgent && <Badge className="bg-red-700 text-white text-xs animate-pulse">URGENT</Badge>}
          </div>
          <div className="text-xs space-y-0.5 ml-6" style={{ color: 'var(--muted-foreground)' }}>
            <p>{student.email}</p>
            <p>Quizzes: {student.quizCount} · Modules done: {student.modulesCompleted}</p>
            {student.lastActive && (
              <p><Clock className="w-3 h-3 inline mr-1" />Last active: {new Date(student.lastActive).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>
      <Button size="sm" variant="outline" className="w-full mt-2 h-7 text-xs" onClick={() => onAdjust(student)}>
        <MessageSquare className="w-3 h-3 mr-1" />Make Instructional Adjustment
      </Button>
    </div>
  );
}
