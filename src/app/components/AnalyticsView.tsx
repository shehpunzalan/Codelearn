import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, TrendingUp, Users, Target, Award, Download, Filter, Calendar } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { mockModules } from '../data/mockData';
import { syncBackendStudentsToLocalStorage } from '../utils/syncStudents';

interface AnalyticsViewProps {
  onBack: () => void;
}

interface StudentRow {
  id: string;
  name: string;
  email: string;
  avgScore: number;
  modulesCompleted: number;
  quizCount: number;
  status: 'excellent' | 'good' | 'needs-attention' | 'new';
}

export function AnalyticsView({ onBack }: AnalyticsViewProps) {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [moduleData, setModuleData] = useState<any[]>([]);
  const [completionPie, setCompletionPie] = useState<any[]>([]);
  const [scoreDistribution, setScoreDistribution] = useState<any[]>([]);
  const [topPerformer, setTopPerformer] = useState<StudentRow | null>(null);

  useEffect(() => {
    syncBackendStudentsToLocalStorage().catch(() => {});
  }, []);

  useEffect(() => {
    const registered: any[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const realStudents = registered.filter((u: any) => u.role === 'student');

    // Per-student stats
    const rows: StudentRow[] = realStudents.map((user: any) => {
      const scores: number[] = [];
      const completedModules = new Set<string>();

      const statsRaw = localStorage.getItem(`stats_${user.id}`);
      if (statsRaw) {
        try {
          const stats = JSON.parse(statsRaw);
          if (Array.isArray(stats.quizScores)) scores.push(...stats.quizScores);
        } catch {}
      }

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || '';
        if (key.startsWith(`quiz_result_${user.id}_`)) {
          try {
            const val = JSON.parse(localStorage.getItem(key) || '{}');
            if (typeof val.score === 'number') scores.push(val.score);
          } catch {}
        }
        if (key.startsWith(`moduleProgress_${user.id}_`)) {
          try {
            const val = JSON.parse(localStorage.getItem(key) || '{}');
            const moduleId = key.replace(`moduleProgress_${user.id}_`, '');
            const module = mockModules.find(m => m.id === moduleId);
            if (module && val.completedLessons?.length >= module.lessons.length) {
              completedModules.add(moduleId);
            }
          } catch {}
        }
      }

      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const status: StudentRow['status'] =
        scores.length === 0 ? 'new' :
        avgScore >= 85 ? 'excellent' :
        avgScore >= 70 ? 'good' :
        'needs-attention';

      return {
        id: user.id,
        name: user.name,
        email: user.email || '',
        avgScore,
        modulesCompleted: completedModules.size,
        quizCount: scores.length,
        status,
      };
    });

    setStudents(rows);

    // Top performer
    const active = rows.filter(r => r.quizCount > 0);
    if (active.length > 0) {
      setTopPerformer(active.sort((a, b) => b.avgScore - a.avgScore)[0]);
    }

    // Weekly performance — scan quiz_result keys with timestamps
    const weekBuckets: Record<string, { scores: number[]; submissions: number }> = {};
    for (let w = 5; w >= 0; w--) {
      const d = new Date();
      d.setDate(d.getDate() - w * 7);
      const label = `Week ${6 - w}`;
      weekBuckets[label] = { scores: [], submissions: 0 };
    }

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      if (key.startsWith('quiz_result_')) {
        try {
          const val = JSON.parse(localStorage.getItem(key) || '{}');
          if (val.completedAt && typeof val.score === 'number') {
            const ts = new Date(val.completedAt).getTime();
            const now = Date.now();
            const weeksAgo = Math.floor((now - ts) / (7 * 24 * 3600 * 1000));
            if (weeksAgo < 6) {
              const label = `Week ${6 - weeksAgo}`;
              if (weekBuckets[label]) {
                weekBuckets[label].scores.push(val.score);
                weekBuckets[label].submissions++;
              }
            }
          }
        } catch {}
      }
    }

    const wData = Object.entries(weekBuckets).map(([name, { scores, submissions }]) => ({
      name,
      avgScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      submissions,
    }));
    setWeeklyData(wData);

    // Module-level avg scores across all students
    const modScores: Record<string, number[]> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      if (key.startsWith('quiz_result_')) {
        const parts = key.split('_');
        if (parts.length >= 5) {
          const moduleId = parts.slice(3, parts.length - 1).join('_');
          try {
            const val = JSON.parse(localStorage.getItem(key) || '{}');
            if (typeof val.score === 'number') {
              if (!modScores[moduleId]) modScores[moduleId] = [];
              modScores[moduleId].push(val.score);
            }
          } catch {}
        }
      }
    }
    const mData = mockModules
      .filter(m => modScores[m.id] && modScores[m.id].length > 0)
      .map(m => ({
        principle: m.title.length > 20 ? m.title.slice(0, 20) + '…' : m.title,
        mastery: Math.round(modScores[m.id].reduce((a, b) => a + b, 0) / modScores[m.id].length),
        students: modScores[m.id].length,
      }));
    setModuleData(mData);

    // Score distribution
    const dist = [
      { range: '90-100', count: 0 },
      { range: '80-89', count: 0 },
      { range: '70-79', count: 0 },
      { range: '60-69', count: 0 },
      { range: '0-59', count: 0 },
    ];
    active.forEach(s => {
      if (s.avgScore >= 90) dist[0].count++;
      else if (s.avgScore >= 80) dist[1].count++;
      else if (s.avgScore >= 70) dist[2].count++;
      else if (s.avgScore >= 60) dist[3].count++;
      else dist[4].count++;
    });
    setScoreDistribution(dist);

    // Pie: completion status
    const completed = rows.filter(r => r.modulesCompleted >= mockModules.length).length;
    const inProgress = rows.filter(r => r.modulesCompleted > 0 && r.modulesCompleted < mockModules.length).length;
    const notStarted = rows.filter(r => r.modulesCompleted === 0).length;
    setCompletionPie([
      { name: 'Completed', value: completed, color: '#10B981' },
      { name: 'In Progress', value: inProgress, color: '#F59E0B' },
      { name: 'Not Started', value: notStarted, color: '#EF4444' },
    ]);
  }, []);

  const avgScore = students.filter(s => s.quizCount > 0).length > 0
    ? Math.round(students.filter(s => s.quizCount > 0).reduce((a, s) => a + s.avgScore, 0) / students.filter(s => s.quizCount > 0).length)
    : 0;

  const completionRate = students.length > 0
    ? Math.round((students.filter(s => s.quizCount > 0).length / students.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2 -ml-2" style={{ color: 'var(--muted-foreground)' }}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <Badge style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }} className="px-3 py-1">CCS108</Badge>
            <Badge variant="outline">Analytics</Badge>
          </div>
          <h1 style={{ color: 'var(--foreground)' }} className="mt-2">Student Analytics</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }} className="mt-1">Comprehensive performance tracking based on real student data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filter</Button>
          <Button variant="outline"><Calendar className="w-4 h-4 mr-2" />Date Range</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card style={{ background: 'var(--primary)', border: 'none' }}>
          <CardContent className="p-6">
            <Users className="w-8 h-8 mb-2" style={{ color: 'var(--primary-foreground)', opacity: 0.8 }} />
            <p style={{ color: 'var(--primary-foreground)', fontSize: '0.85rem', opacity: 0.85 }}>Total Students</p>
            <p className="text-4xl font-bold" style={{ color: 'var(--primary-foreground)' }}>{students.length}</p>
            <p style={{ color: 'var(--primary-foreground)', fontSize: '0.75rem', opacity: 0.7, marginTop: 4 }}>
              {students.filter(s => s.quizCount > 0).length} active
            </p>
          </CardContent>
        </Card>
        <Card style={{ background: 'var(--success, #16a34a)', border: 'none' }}>
          <CardContent className="p-6">
            <TrendingUp className="w-8 h-8 mb-2 text-white opacity-80" />
            <p className="text-sm text-white opacity-85">Average Score</p>
            <p className="text-4xl font-bold text-white">{avgScore}%</p>
            <p className="text-xs text-white opacity-70 mt-1">across all quizzes</p>
          </CardContent>
        </Card>
        <Card style={{ background: '#7c3aed', border: 'none' }}>
          <CardContent className="p-6">
            <Target className="w-8 h-8 mb-2 text-white opacity-80" />
            <p className="text-sm text-white opacity-85">Active Rate</p>
            <p className="text-4xl font-bold text-white">{completionRate}%</p>
            <p className="text-xs text-white opacity-70 mt-1">{students.filter(s => s.quizCount > 0).length} of {students.length} students</p>
          </CardContent>
        </Card>
        <Card style={{ background: '#ea580c', border: 'none' }}>
          <CardContent className="p-6">
            <Award className="w-8 h-8 mb-2 text-white opacity-80" />
            <p className="text-sm text-white opacity-85">Top Performer</p>
            {topPerformer ? (
              <>
                <p className="text-xl font-bold text-white leading-tight">{topPerformer.name}</p>
                <p className="text-xs text-white opacity-70 mt-1">{topPerformer.avgScore}% avg score</p>
              </>
            ) : (
              <p className="text-lg font-bold text-white opacity-60">No data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance */}
        <Card style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
          <CardHeader>
            <CardTitle style={{ color: 'var(--foreground)' }}>Weekly Quiz Performance</CardTitle>
            <CardDescription style={{ color: 'var(--muted-foreground)' }}>Average scores and submissions over the past 6 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            {weeklyData.every(d => d.avgScore === 0 && d.submissions === 0) ? (
              <div className="h-64 flex items-center justify-center" style={{ color: 'var(--muted-foreground)' }}>
                No quiz data available yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid key="grid" strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis key="xaxis" dataKey="name" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                  <YAxis key="yaxis" domain={[0, 100]} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                  <Tooltip key="tooltip" />
                  <Legend key="legend" />
                  <Line key="score-line" type="monotone" dataKey="avgScore" name="Avg Score (%)" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', r: 4 }} />
                  <Line key="sub-line" type="monotone" dataKey="submissions" name="Submissions" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Module Mastery */}
        <Card style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
          <CardHeader>
            <CardTitle style={{ color: 'var(--foreground)' }}>Module Mastery</CardTitle>
            <CardDescription style={{ color: 'var(--muted-foreground)' }}>Average quiz score per module (only modules with activity)</CardDescription>
          </CardHeader>
          <CardContent>
            {moduleData.length === 0 ? (
              <div className="h-64 flex items-center justify-center" style={{ color: 'var(--muted-foreground)' }}>
                No module activity yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={moduleData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid key="grid" strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis key="xaxis" dataKey="principle" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} angle={-15} textAnchor="end" height={80} />
                  <YAxis key="yaxis" domain={[0, 100]} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                  <Tooltip key="tooltip" />
                  <Bar key="bar-mastery" dataKey="mastery" name="Avg Score %" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Module Completion Pie */}
        <Card style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
          <CardHeader>
            <CardTitle style={{ color: 'var(--foreground)' }}>Module Completion Status</CardTitle>
            <CardDescription style={{ color: 'var(--muted-foreground)' }}>Distribution of student progress</CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="h-64 flex items-center justify-center" style={{ color: 'var(--muted-foreground)' }}>No students yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={completionPie}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => value > 0 ? `${name}: ${value} (${(percent * 100).toFixed(0)}%)` : ''}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {completionPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
          <CardHeader>
            <CardTitle style={{ color: 'var(--foreground)' }}>Score Distribution</CardTitle>
            <CardDescription style={{ color: 'var(--muted-foreground)' }}>Number of active students per average score range</CardDescription>
          </CardHeader>
          <CardContent>
            {students.filter(s => s.quizCount > 0).length === 0 ? (
              <div className="h-64 flex items-center justify-center" style={{ color: 'var(--muted-foreground)' }}>No quiz data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={scoreDistribution} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid key="grid" strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis key="xaxis" dataKey="range" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                  <YAxis key="yaxis" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                  <Tooltip key="tooltip" />
                  <Bar key="bar-count" dataKey="count" name="Students" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Student Detail Table */}
      <Card style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
        <CardHeader>
          <CardTitle style={{ color: 'var(--foreground)' }}>Student Performance Details</CardTitle>
          <CardDescription style={{ color: 'var(--muted-foreground)' }}>Individual analytics for all registered students</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="py-12 text-center" style={{ color: 'var(--muted-foreground)' }}>
              No registered students found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Student Name', 'Email', 'Avg Score', 'Modules Done', 'Quizzes', 'Status'].map(h => (
                      <th key={h} className="text-left p-3 text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.sort((a, b) => b.avgScore - a.avgScore).map((student) => (
                    <tr key={student.id} style={{ borderBottom: '1px solid var(--border)' }} className="hover:bg-gray-50">
                      <td className="p-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>{student.name}</td>
                      <td className="p-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>{student.email}</td>
                      <td className="p-3 text-sm">
                        {student.quizCount > 0 ? (
                          <Badge className={
                            student.avgScore >= 90 ? 'bg-green-100 text-green-800 border-0' :
                            student.avgScore >= 80 ? 'bg-blue-100 text-blue-800 border-0' :
                            student.avgScore >= 70 ? 'bg-yellow-100 text-yellow-800 border-0' :
                            'bg-red-100 text-red-800 border-0'
                          }>{student.avgScore}%</Badge>
                        ) : (
                          <span style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem' }}>—</span>
                        )}
                      </td>
                      <td className="p-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {student.modulesCompleted}/{mockModules.length}
                      </td>
                      <td className="p-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>{student.quizCount}</td>
                      <td className="p-3 text-sm">
                        <Badge variant="outline" className={
                          student.status === 'excellent' ? 'border-green-300 text-green-700' :
                          student.status === 'good' ? 'border-blue-300 text-blue-700' :
                          student.status === 'needs-attention' ? 'border-red-300 text-red-700' :
                          'border-gray-300 text-gray-500'
                        }>
                          {student.status === 'excellent' ? 'Excellent' :
                           student.status === 'good' ? 'Good Progress' :
                           student.status === 'needs-attention' ? 'Needs Attention' :
                           'New'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
