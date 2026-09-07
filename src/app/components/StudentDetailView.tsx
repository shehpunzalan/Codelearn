import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  ArrowLeft, User, BookOpen, Award, TrendingUp,
  Brain, CheckCircle, Clock, AlertCircle, FileText,
  Target, BarChart3, Calendar, MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { getAllProgress, getAllSubmissions, getUserStats } from '../utils/storage';
import { Module } from '../types';

interface StudentDetailViewProps {
  studentId: string;
  studentName: string;
  onBack: () => void;
  modules: Module[];
}

interface LocalProgress {
  userId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  attempts: number;
  lastAttempt: string;
  code: string;
  feedback: string;
  timeSpent: number;
}

interface LocalSubmission {
  id: string;
  userId: string;
  moduleId: string;
  lessonId: string;
  code: string;
  timestamp: string;
  score: number;
  feedback: string;
  errors: string[];
  passed: boolean;
}

interface LocalQuizResult {
  score: number;
  maxScore: number;
  completedAt: string;
  passed: boolean;
  moduleId: string;
  lessonId: string;
}

export function StudentDetailView({ studentId, studentName, onBack, modules }: StudentDetailViewProps) {
  const [progressData, setProgressData] = useState<LocalProgress[]>([]);
  const [submissionsData, setSubmissionsData] = useState<LocalSubmission[]>([]);
  const [quizData, setQuizData] = useState<LocalQuizResult[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'progress' | 'quizzes' | 'feedback'>('overview');

  useEffect(() => {
    loadFromLocalStorage();
  }, [studentId]);

  const loadFromLocalStorage = () => {
    // Progress records (written by LessonViewer after each submission)
    const progress = getAllProgress(studentId) as LocalProgress[];
    setProgressData(progress);

    // Code submissions (written by saveSubmission in LessonViewer)
    const submissions = getAllSubmissions(studentId) as LocalSubmission[];
    setSubmissionsData(submissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));

    // Quiz results (written by LessonViewer handleQuizComplete)
    const quizResults: LocalQuizResult[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      if (key.startsWith(`quiz_result_${studentId}_`)) {
        try {
          const val = JSON.parse(localStorage.getItem(key) || '{}');
          quizResults.push(val as LocalQuizResult);
        } catch {}
      }
    }
    setQuizData(quizResults.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()));
  };

  const downloadCSV = (rows: string[][], filename: string) => {
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
  };

  const handleExportReport = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `${studentName.replace(/\s+/g, '_')}_report_${dateStr}.csv`;
    const rows: string[][] = [];

    rows.push(['STUDENT PROGRESS REPORT']);
    rows.push(['Student Name', studentName]);
    rows.push(['Export Date', new Date().toLocaleDateString()]);
    rows.push(['Completion Rate', `${stats.completionRate}%`]);
    rows.push(['Avg Code Score', `${stats.avgScore}%`]);
    rows.push(['Avg Quiz Score', `${stats.avgQuizScore}%`]);
    rows.push(['Total Submissions', String(stats.totalSubmissions)]);
    rows.push(['Total Quizzes', String(quizData.length)]);
    rows.push([]);

    rows.push(['LESSON PROGRESS']);
    rows.push(['Module', 'Lesson ID', 'Status', 'Score', 'Attempts', 'Last Attempt']);
    progressData.forEach(p => {
      const mod = modules.find(m => m.id === p.moduleId);
      const lesson = (mod?.lessons as any[])?.find((l: any) => l.id === p.lessonId);
      rows.push([
        mod?.title || p.moduleId,
        lesson?.title || p.lessonId,
        p.completed ? 'Completed' : 'In Progress',
        `${p.score ?? 0}%`,
        String(p.attempts ?? 1),
        p.lastAttempt ? new Date(p.lastAttempt).toLocaleDateString() : '-',
      ]);
    });
    rows.push([]);

    rows.push(['QUIZ RESULTS']);
    rows.push(['Module', 'Lesson ID', 'Score', 'Status', 'Completed At']);
    quizData.forEach(q => {
      const mod = modules.find(m => m.id === q.moduleId);
      rows.push([
        mod?.title || q.moduleId,
        q.lessonId,
        `${Math.round(q.score)}%`,
        q.passed ? 'Passed' : 'Failed',
        q.completedAt ? new Date(q.completedAt).toLocaleDateString() : '-',
      ]);
    });

    downloadCSV(rows, filename);
    toast.success(`Report exported: ${filename}`);
  };

  const stats = (() => {
    const totalLessons = progressData.length;
    const completedLessons = progressData.filter(p => p.completed).length;
    const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const avgScore = submissionsData.length > 0
      ? Math.round(submissionsData.reduce((s, sub) => s + sub.score, 0) / submissionsData.length)
      : 0;

    const avgQuizScore = quizData.length > 0
      ? Math.round(quizData.reduce((s, q) => s + q.score, 0) / quizData.length)
      : 0;

    const totalTimeSpent = progressData.reduce((s, p) => s + (p.timeSpent || 0), 0);
    const avgTimePerLesson = totalLessons > 0 ? Math.round(totalTimeSpent / totalLessons / 60) : 0;

    return { completionRate, completedLessons, totalLessons, avgScore, avgQuizScore, totalSubmissions: submissionsData.length, avgTimePerLesson };
  })();

  const moduleProgress = (() => {
    const map = new Map<string, { completed: number; total: number }>();
    progressData.forEach(p => {
      if (!map.has(p.moduleId)) map.set(p.moduleId, { completed: 0, total: 0 });
      const cur = map.get(p.moduleId)!;
      cur.total += 1;
      if (p.completed) cur.completed += 1;
    });
    return Array.from(map.entries()).map(([moduleId, data]) => {
      const mod = modules.find(m => m.id === moduleId);
      return {
        moduleId,
        moduleName: mod?.title || moduleId,
        ...data,
        percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      };
    });
  })();

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)} min`;

  const tabBtn = (id: typeof selectedTab, label: string, Icon: React.ElementType) => (
    <button
      onClick={() => setSelectedTab(id)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.5rem 1rem',
        borderBottom: selectedTab === id ? '2px solid var(--primary)' : '2px solid transparent',
        color: selectedTab === id ? 'var(--primary)' : 'var(--muted-foreground)',
        background: 'none', border: 'none', borderBottomStyle: 'solid',
        borderBottomWidth: '2px',
        borderBottomColor: selectedTab === id ? 'var(--primary)' : 'transparent',
        cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.9rem',
      }}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6, 1.5rem)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button variant="outline" size="sm" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} />
            Back to Students
          </Button>
          <div>
            <h1 style={{ color: 'var(--foreground)', margin: 0, fontFamily: 'var(--font-sans)', fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <User size={28} style={{ color: 'var(--primary)' }} />
              {studentName}
            </h1>
            <p style={{ color: 'var(--muted-foreground)', margin: '0.25rem 0 0', fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>
              Detailed learning analytics and progress overview
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline" size="sm" onClick={() => toast.info(`Message to ${studentName}`)}>
            <MessageSquare size={16} style={{ marginRight: '0.4rem' }} />
            Send Message
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <FileText size={16} style={{ marginRight: '0.4rem' }} />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Completion Rate', value: `${stats.completionRate}%`, sub: `${stats.completedLessons}/${stats.totalLessons} lessons`, Icon: CheckCircle, color: 'var(--primary)' },
          { label: 'Avg Code Score', value: `${stats.avgScore}%`, sub: `${stats.totalSubmissions} submissions`, Icon: Award, color: 'var(--success, #22c55e)' },
          { label: 'Avg Quiz Score', value: `${stats.avgQuizScore}%`, sub: `${quizData.length} quizzes`, Icon: Target, color: 'var(--secondary)' },
          { label: 'Avg Time/Lesson', value: `${stats.avgTimePerLesson}`, sub: 'minutes', Icon: Clock, color: 'var(--warning, #f59e0b)' },
        ].map(({ label, value, sub, Icon, color }) => (
          <div key={label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg, 12px)', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
            <div>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem', margin: '0 0 0.25rem', fontFamily: 'var(--font-sans)' }}>{label}</p>
              <p style={{ color, fontSize: '2rem', fontWeight: 700, margin: 0, fontFamily: 'var(--font-sans)' }}>{value}</p>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', margin: '0.25rem 0 0', fontFamily: 'var(--font-sans)' }}>{sub}</p>
            </div>
            <Icon size={36} style={{ color, opacity: 0.6 }} />
          </div>
        ))}
      </div>

      {/* Tab Bar */}
      <div style={{ borderBottom: '1px solid var(--border)', display: 'flex', gap: '0' }}>
        {tabBtn('overview', 'Overview', BarChart3)}
        {tabBtn('progress', 'Progress', BookOpen)}
        {tabBtn('quizzes', 'Quizzes', Target)}
        {tabBtn('feedback', 'AI Feedback', Brain)}
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Module Progress */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg, 12px)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ color: 'var(--foreground)', margin: '0 0 0.25rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Module Progress</h3>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', margin: '0 0 1.25rem', fontFamily: 'var(--font-sans)' }}>Completion status across all modules</p>
            {moduleProgress.length === 0 ? (
              <p style={{ color: 'var(--muted-foreground)', textAlign: 'center', padding: '1.5rem 0', fontFamily: 'var(--font-sans)' }}>No progress data yet — student hasn't submitted any code.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {moduleProgress.map(mp => (
                  <div key={mp.moduleId}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--foreground)', fontWeight: 500, fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>{mp.moduleName}</span>
                      <span style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}>{mp.completed}/{mp.total} lessons</span>
                    </div>
                    <div style={{ background: 'var(--border)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                      <div style={{ width: `${mp.percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '999px', transition: 'width 0.4s' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                      <span style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', fontFamily: 'var(--font-sans)' }}>{mp.percentage}% Complete</span>
                      {mp.percentage === 100 && (
                        <span style={{ color: 'var(--success, #22c55e)', fontSize: '0.75rem', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CheckCircle size={12} /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Performance Indicators */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg, 12px)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ color: 'var(--foreground)', margin: '0 0 1rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Performance Indicators</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.avgScore >= 80 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: 'color-mix(in srgb, var(--success, #22c55e) 10%, transparent)', borderRadius: 'var(--radius-md, 8px)', border: '1px solid color-mix(in srgb, var(--success, #22c55e) 25%, transparent)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <TrendingUp size={20} style={{ color: 'var(--success, #22c55e)' }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 500, color: 'var(--foreground)', fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>Strong Code Performance</p>
                      <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: '0.8rem', fontFamily: 'var(--font-sans)' }}>Average score above 80%</p>
                    </div>
                  </div>
                  <span style={{ background: 'var(--success, #22c55e)', color: '#fff', borderRadius: '999px', padding: '0.2rem 0.75rem', fontSize: '0.78rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Excellent</span>
                </div>
              )}
              {stats.avgScore > 0 && stats.avgScore < 70 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: 'color-mix(in srgb, var(--warning, #f59e0b) 10%, transparent)', borderRadius: 'var(--radius-md, 8px)', border: '1px solid color-mix(in srgb, var(--warning, #f59e0b) 25%, transparent)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <AlertCircle size={20} style={{ color: 'var(--warning, #f59e0b)' }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 500, color: 'var(--foreground)', fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>Below Passing Threshold</p>
                      <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: '0.8rem', fontFamily: 'var(--font-sans)' }}>Average score below 70% — consider intervention</p>
                    </div>
                  </div>
                  <span style={{ background: 'var(--warning, #f59e0b)', color: '#fff', borderRadius: '999px', padding: '0.2rem 0.75rem', fontSize: '0.78rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Monitor</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: 'color-mix(in srgb, var(--primary) 8%, transparent)', borderRadius: 'var(--radius-md, 8px)', border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Brain size={20} style={{ color: 'var(--primary)' }} />
                  <div>
                    <p style={{ margin: 0, fontWeight: 500, color: 'var(--foreground)', fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>AI Feedback Engagement</p>
                    <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: '0.8rem', fontFamily: 'var(--font-sans)' }}>{stats.totalSubmissions} code submission{stats.totalSubmissions !== 1 ? 's' : ''} analyzed</p>
                  </div>
                </div>
                <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '999px', padding: '0.2rem 0.75rem', fontSize: '0.78rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>{stats.totalSubmissions > 0 ? 'Active' : 'Not Started'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'progress' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg, 12px)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ color: 'var(--foreground)', margin: '0 0 0.25rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Lesson Progress History</h3>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', margin: '0 0 1.25rem', fontFamily: 'var(--font-sans)' }}>Detailed view of all lesson code submissions</p>
          {progressData.length === 0 ? (
            <p style={{ color: 'var(--muted-foreground)', textAlign: 'center', padding: '2rem 0', fontFamily: 'var(--font-sans)' }}>No progress data yet — student hasn't submitted any code.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {progressData.map((p, idx) => {
                const mod = modules.find(m => m.id === p.moduleId);
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md, 8px)', background: 'var(--background)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                      {p.completed
                        ? <CheckCircle size={20} style={{ color: 'var(--success, #22c55e)', flexShrink: 0 }} />
                        : <Clock size={20} style={{ color: 'var(--warning, #f59e0b)', flexShrink: 0 }} />}
                      <div>
                        <p style={{ margin: 0, fontWeight: 500, color: 'var(--foreground)', fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>{mod?.title || p.moduleId}</p>
                        <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: '0.8rem', fontFamily: 'var(--font-sans)' }}>Lesson {p.lessonId}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                      <span style={{ color: 'var(--foreground)', fontWeight: 700, fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>{p.score}%</span>
                      <span style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={13} /> {formatTime(p.timeSpent || 0)}
                      </span>
                      <span style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={13} /> {formatDate(p.lastAttempt)}
                      </span>
                      <span style={{
                        padding: '0.15rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontFamily: 'var(--font-sans)', fontWeight: 600,
                        background: p.completed ? 'color-mix(in srgb, var(--success, #22c55e) 15%, transparent)' : 'color-mix(in srgb, var(--warning, #f59e0b) 15%, transparent)',
                        color: p.completed ? 'var(--success, #22c55e)' : 'var(--warning, #f59e0b)',
                      }}>
                        {p.completed ? 'Passed' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedTab === 'quizzes' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg, 12px)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ color: 'var(--foreground)', margin: '0 0 0.25rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Quiz Attempts</h3>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', margin: '0 0 1.25rem', fontFamily: 'var(--font-sans)' }}>All quiz submissions and scores</p>
          {quizData.length === 0 ? (
            <p style={{ color: 'var(--muted-foreground)', textAlign: 'center', padding: '2rem 0', fontFamily: 'var(--font-sans)' }}>No quiz attempts yet — student hasn't completed any lesson quizzes.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    {['#', 'Module', 'Lesson', 'Score', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', color: 'var(--muted-foreground)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {quizData.map((q, idx) => {
                    const mod = modules.find(m => m.id === q.moduleId);
                    const pct = Math.round(q.score);
                    const passed = pct >= 70;
                    const scoreColor = pct >= 90 ? 'var(--success, #22c55e)' : pct >= 70 ? 'var(--primary)' : 'var(--destructive, #ef4444)';
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.12s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent, #f4f4f5)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ padding: '0.85rem 1rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>{idx + 1}</td>
                        <td style={{ padding: '0.85rem 1rem', color: 'var(--foreground)', fontWeight: 500, maxWidth: '14rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mod?.title || q.moduleId}</td>
                        <td style={{ padding: '0.85rem 1rem', color: 'var(--muted-foreground)' }}>Lesson {q.lessonId}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{ fontWeight: 700, color: scoreColor }}>{pct}%</span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{ padding: '0.2rem 0.7rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: passed ? 'color-mix(in srgb, var(--success, #22c55e) 15%, transparent)' : 'color-mix(in srgb, var(--destructive, #ef4444) 12%, transparent)', color: passed ? 'var(--success, #16a34a)' : 'var(--destructive, #dc2626)' }}>
                            {passed ? 'Pass' : 'Fail'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{formatDate(q.completedAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {selectedTab === 'feedback' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg, 12px)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ color: 'var(--foreground)', margin: '0 0 0.25rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>AI Feedback History</h3>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', margin: '0 0 1.25rem', fontFamily: 'var(--font-sans)' }}>Neural network analysis of all code submissions</p>
          {submissionsData.length === 0 ? (
            <p style={{ color: 'var(--muted-foreground)', textAlign: 'center', padding: '2rem 0', fontFamily: 'var(--font-sans)' }}>No AI feedback yet — student hasn't submitted any code.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {submissionsData.map((sub, idx) => {
                const mod = modules.find(m => m.id === sub.moduleId);
                const confidencePct = sub.score;
                const scoreColor = confidencePct >= 80 ? 'var(--success, #22c55e)' : confidencePct >= 60 ? 'var(--warning, #f59e0b)' : 'var(--destructive, #ef4444)';
                return (
                  <div key={idx} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md, 8px)', background: 'var(--background)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Brain size={20} style={{ color: 'var(--secondary)' }} />
                        <div>
                          <p style={{ margin: 0, fontWeight: 500, color: 'var(--foreground)', fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>{mod?.title || sub.moduleId} — Lesson {sub.lessonId}</p>
                          <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: '0.78rem', fontFamily: 'var(--font-sans)' }}>{formatDate(sub.timestamp)}</p>
                        </div>
                      </div>
                      <span style={{ background: `color-mix(in srgb, ${scoreColor} 15%, transparent)`, color: scoreColor, padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.78rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                        Score: {confidencePct}/100
                      </span>
                    </div>
                    <div style={{ background: 'color-mix(in srgb, var(--foreground) 4%, transparent)', borderRadius: 'var(--radius-sm, 6px)', padding: '0.75rem', border: '1px solid var(--border)' }}>
                      <p style={{ margin: '0 0 0.4rem', color: 'var(--muted-foreground)', fontSize: '0.73rem', fontFamily: 'var(--font-sans)' }}>CODE SAMPLE</p>
                      <pre style={{ margin: 0, fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', color: 'var(--foreground)', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{sub.code.slice(0, 300)}{sub.code.length > 300 ? '\n…' : ''}</pre>
                    </div>
                    <div style={{ background: 'color-mix(in srgb, var(--primary) 8%, transparent)', borderRadius: 'var(--radius-sm, 6px)', padding: '0.75rem', border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)' }}>
                      <p style={{ margin: '0 0 0.4rem', color: 'var(--primary)', fontSize: '0.73rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>AI ANALYSIS</p>
                      <p style={{ margin: 0, color: 'var(--foreground)', fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}>{sub.feedback}</p>
                    </div>
                    {sub.errors && sub.errors.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {sub.errors.map((err, i) => (
                          <span key={i} style={{ background: 'color-mix(in srgb, var(--destructive, #ef4444) 10%, transparent)', color: 'var(--destructive, #ef4444)', padding: '0.15rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontFamily: 'var(--font-sans)' }}>{err}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
