import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  TrendingUp, Target, Award, CalendarDays, Activity,
  Zap, Brain, CheckCircle, Flame, Trophy, BookOpen, BarChart2
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { mockModules } from '../data/mockData';
import { getUserStats } from '../utils/storage';

interface ProgressViewProps {
  onBack: () => void;
}

// Mapping from moduleId → OOP topic label
const MODULE_TOPICS: Record<string, string> = {
  mod1: 'Java Fundamentals',
  mod2: 'Classes & Objects',
  mod3: 'Encapsulation',
  mod4: 'Inheritance',
  mod5: 'Polymorphism',
  mod6: 'Abstraction',
  mod7: 'Interfaces',
  mod8: 'Exceptions',
  mod9: 'Collections',
  mod10: 'Advanced OOP',
};

interface ModuleStats {
  id: string;
  title: string;
  topic: string;
  avgScore: number;
  completedLessons: number;
  totalLessons: number;
  progress: number;
  quizzesTaken: number;
}

interface WeeklyPoint {
  week: string;
  score: number;
  quizzes: number;
}

export function ProgressView({ onBack }: ProgressViewProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [moduleStats, setModuleStats] = useState<ModuleStats[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyPoint[]>([]);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [completedModules, setCompletedModules] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(0);

  useEffect(() => {
    // ── 1. Get current user ──────────────────────────────────────────────────
    let uid: string | null = null;
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) uid = JSON.parse(raw)?.id ?? null;
    } catch {}
    setUserId(uid);

    // ── 2. Read streak from stats store ──────────────────────────────────────
    if (uid) {
      const stats = getUserStats(uid);
      setStreak(stats?.streak ?? 0);
    }

    // ── 3. Collect all quiz_* entries ────────────────────────────────────────
    //   Written by LessonViewerSimple as: quiz_${moduleId}_${lessonId}
    //   Shape: { lessonId, moduleId, stats: { accuracy, ... }, timestamp }
    const quizByModule: Record<string, number[]> = {}; // moduleId → [accuracy]
    const allQuizTimestamps: { ts: number; score: number }[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith('quiz_')) continue;
      try {
        const entry = JSON.parse(localStorage.getItem(key)!);
        const score = entry?.stats?.accuracy ?? 0;
        const modId = entry?.moduleId as string;
        const ts = entry?.timestamp ? new Date(entry.timestamp).getTime() : 0;
        if (modId) {
          if (!quizByModule[modId]) quizByModule[modId] = [];
          quizByModule[modId].push(score);
        }
        if (ts) allQuizTimestamps.push({ ts, score });
      } catch {}
    }

    // ── 4. Build per-module stats ─────────────────────────────────────────────
    let sumScores = 0;
    let countScores = 0;
    let totalCompleted = 0;
    let completedModCount = 0;
    const totalLessonsAll = mockModules.reduce((s, m) => s + m.totalLessons, 0);

    const modStats: ModuleStats[] = mockModules.map(m => {
      // Real lesson completion from localStorage
      let completedLessonsCount = 0;
      let progress = 0;
      try {
        const saved = localStorage.getItem(`moduleProgress_${m.id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          completedLessonsCount = parsed.completedLessons ?? 0;
          progress = parsed.progress ?? 0;
        }
      } catch {}

      totalCompleted += completedLessonsCount;
      if (progress === 100) completedModCount++;

      const scores = quizByModule[m.id] ?? [];
      const avgScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

      if (scores.length > 0) {
        sumScores += scores.reduce((a, b) => a + b, 0);
        countScores += scores.length;
      }

      return {
        id: m.id,
        title: m.title,
        topic: MODULE_TOPICS[m.id] ?? m.title,
        avgScore,
        completedLessons: completedLessonsCount,
        totalLessons: m.totalLessons,
        progress,
        quizzesTaken: scores.length,
      };
    });

    setModuleStats(modStats);
    setTotalCompleted(totalCompleted);
    setTotalLessons(totalLessonsAll);
    setCompletedModules(completedModCount);
    setAverageScore(countScores > 0 ? Math.round(sumScores / countScores) : 0);
    setTotalQuizzes(Object.values(quizByModule).reduce((s, arr) => s + arr.length, 0));

    // ── 5. Build last-6-weeks chart ───────────────────────────────────────────
    const now = Date.now();
    const weeks: WeeklyPoint[] = [];
    for (let w = 5; w >= 0; w--) {
      const start = now - (w + 1) * 7 * 86400000;
      const end   = now - w * 7 * 86400000;
      const inWindow = allQuizTimestamps.filter(q => q.ts >= start && q.ts < end);
      const weekLabel = w === 0 ? 'This week'
        : w === 1 ? 'Last week'
        : `${w + 1}w ago`;
      weeks.push({
        week: weekLabel,
        score: inWindow.length > 0
          ? Math.round(inWindow.reduce((s, q) => s + q.score, 0) / inWindow.length)
          : 0,
        quizzes: inWindow.length,
      });
    }
    setWeeklyData(weeks);
  }, []);

  // ── Derived chart data ──────────────────────────────────────────────────────
  // OOP principles bar chart — modules that have quizzes taken
  const oopChartData = moduleStats
    .filter(m => m.quizzesTaken > 0 || m.completedLessons > 0)
    .slice(0, 7)
    .map(m => ({ principle: m.topic.replace('Java ', '').replace(' & Objects', ''), score: m.avgScore || m.progress }));

  // Pie chart: mastered / proficient / learning / not started
  const mastered   = moduleStats.filter(m => m.avgScore >= 80 && m.quizzesTaken > 0).length;
  const proficient = moduleStats.filter(m => m.avgScore >= 60 && m.avgScore < 80 && m.quizzesTaken > 0).length;
  const learning   = moduleStats.filter(m => m.avgScore > 0  && m.avgScore < 60 && m.quizzesTaken > 0).length;
  const notStarted = moduleStats.filter(m => m.quizzesTaken === 0 && m.completedLessons === 0).length;

  const pieData = [
    { name: 'Mastered (≥80%)',   value: mastered,   color: 'var(--success)' },
    { name: 'Proficient (60–79%)', value: proficient, color: 'var(--primary)' },
    { name: 'Learning (<60%)',    value: learning,   color: 'var(--warning)' },
    { name: 'Not Started',        value: notStarted, color: 'var(--muted-foreground)' },
  ].filter(d => d.value > 0);

  // Achievements — all based on real data
  const achievements = [
    {
      id: 1,
      title: 'First Quiz Passed',
      description: 'Score ≥70% on any lesson quiz',
      icon: '🎯',
      unlocked: totalQuizzes > 0 && averageScore >= 70,
    },
    {
      id: 2,
      title: 'Module Complete',
      description: 'Finish all lessons in a module',
      icon: '📦',
      unlocked: completedModules >= 1,
    },
    {
      id: 3,
      title: 'OOP Master',
      description: 'Complete all 10 modules',
      icon: '🏆',
      unlocked: completedModules >= 10,
    },
    {
      id: 4,
      title: 'High Scorer',
      description: 'Achieve ≥80% average across all quizzes',
      icon: '💯',
      unlocked: averageScore >= 80,
    },
    {
      id: 5,
      title: 'Learning Streak',
      description: 'Maintain a 3-day streak',
      icon: '🔥',
      unlocked: streak >= 3,
    },
    {
      id: 6,
      title: 'Quiz Champion',
      description: 'Complete 10 or more quizzes',
      icon: '⚡',
      unlocked: totalQuizzes >= 10,
    },
  ];

  const completionPct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  const tooltipStyle = {
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: '12px',
    color: 'var(--foreground)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6, 1.5rem)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Button variant="outline" size="sm" onClick={onBack}>← Back</Button>
        <div>
          <h1 style={{ margin: 0, color: 'var(--foreground)' }} className="text-2xl font-bold">
            Progress & Performance
          </h1>
          <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
            Your real-time learning data for CCS108
          </p>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: <Award style={{ width: 28, height: 28, color: 'var(--primary-foreground)' }} />,
            label: 'Avg Quiz Score',
            value: `${averageScore}%`,
            sub: totalQuizzes > 0 ? `from ${totalQuizzes} quizzes` : 'No quizzes yet',
            bg: 'linear-gradient(135deg, var(--primary), var(--brand-blue-dark, #1e40af))',
            fg: 'var(--primary-foreground)',
          },
          {
            icon: <CheckCircle style={{ width: 28, height: 28, color: 'var(--success-foreground)' }} />,
            label: 'Lessons Done',
            value: `${totalCompleted}/${totalLessons}`,
            sub: `${completionPct}% complete`,
            bg: 'linear-gradient(135deg, var(--success), #15803d)',
            fg: 'var(--success-foreground)',
          },
          {
            icon: <BookOpen style={{ width: 28, height: 28, color: 'var(--secondary-foreground)' }} />,
            label: 'Modules Done',
            value: `${completedModules}/${mockModules.length}`,
            sub: completedModules > 0 ? 'Great progress!' : 'Keep going!',
            bg: 'linear-gradient(135deg, var(--secondary), var(--brand-purple-dark, #7e22ce))',
            fg: 'var(--secondary-foreground)',
          },
          {
            icon: <Flame style={{ width: 28, height: 28, color: 'var(--warning-foreground)' }} />,
            label: 'Day Streak',
            value: `${streak}`,
            sub: streak > 0 ? '🔥 Keep it up!' : 'Start today!',
            bg: 'linear-gradient(135deg, var(--warning), #dc2626)',
            fg: 'var(--warning-foreground)',
          },
        ].map((card, i) => (
          <Card key={i} className="border-0 shadow-md" style={{ background: card.bg }}>
            <CardContent className="p-5">
              <div style={{ marginBottom: 8 }}>{card.icon}</div>
              <p style={{ margin: '0 0 2px', color: card.fg, fontSize: '0.8rem', fontWeight: 500 }}>{card.label}</p>
              <p style={{ margin: 0, color: card.fg, fontSize: '1.75rem', fontWeight: 700 }}>{card.value}</p>
              <p style={{ margin: '4px 0 0', color: card.fg, fontSize: '0.72rem', opacity: 0.8 }}>{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Quiz Score */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
              <TrendingUp style={{ width: 20, height: 20, color: 'var(--primary)' }} />
              <h3 style={{ margin: 0, color: 'var(--foreground)' }} className="text-base font-bold">
                Weekly Quiz Scores
              </h3>
            </div>
            {weeklyData.every(w => w.quizzes === 0) ? (
              <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', textAlign: 'center' }}>
                  Complete lessons and pass quizzes to see your weekly trend here.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid key="grid" strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis key="xaxis" dataKey="week" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} stroke="var(--border)" />
                  <YAxis key="yaxis" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} stroke="var(--border)" />
                  <Tooltip key="tooltip" contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, 'Avg Score']} />
                  <Line key="line" type="monotone" dataKey="score" name="Score" stroke="var(--primary)" strokeWidth={2} dot={{ fill: 'var(--primary)', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
            <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
              {weeklyData.filter(w => w.quizzes > 0).length} active weeks out of last 6
            </p>
          </CardContent>
        </Card>

        {/* OOP Mastery Per Module */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
              <BarChart2 style={{ width: 20, height: 20, color: 'var(--secondary)' }} />
              <h3 style={{ margin: 0, color: 'var(--foreground)' }} className="text-base font-bold">
                Module Quiz Scores
              </h3>
            </div>
            {oopChartData.length === 0 ? (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', textAlign: 'center' }}>
                  Take quizzes to see your module performance here.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={oopChartData} layout="vertical" margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
                  <CartesianGrid key="grid" strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis key="xaxis" type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} stroke="var(--border)" />
                  <YAxis key="yaxis" type="category" dataKey="principle" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} stroke="var(--border)" width={80} />
                  <Tooltip key="tooltip" contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, 'Score']} />
                  <Bar key="bar" dataKey="score" name="Score" fill="var(--secondary)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Module Progress Cards ── */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
            <Activity style={{ width: 20, height: 20, color: 'var(--primary)' }} />
            <h3 style={{ margin: 0, color: 'var(--foreground)' }} className="text-base font-bold">
              Module-by-Module Progress
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {moduleStats.map(mod => (
              <div key={mod.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Title */}
                <div style={{ width: 180, minWidth: 180 }}>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--foreground)', fontSize: '0.85rem' }}>{mod.title}</p>
                  <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: '0.72rem' }}>
                    {mod.completedLessons}/{mod.totalLessons} lessons
                    {mod.quizzesTaken > 0 ? ` · ${mod.avgScore}% avg` : ' · No quizzes'}
                  </p>
                </div>
                {/* Progress bar */}
                <div style={{ flex: 1, height: 8, background: 'var(--muted)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${mod.progress}%`,
                    background: mod.progress === 100 ? 'var(--success)'
                      : mod.progress > 0 ? 'var(--primary)'
                      : 'var(--muted)',
                    borderRadius: 4,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
                {/* Percentage */}
                <div style={{ width: 44, textAlign: 'right' }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: mod.progress === 100 ? 'var(--success)'
                      : mod.progress > 0 ? 'var(--primary)'
                      : 'var(--muted-foreground)',
                  }}>
                    {mod.progress}%
                  </span>
                </div>
                {/* Badge */}
                {mod.progress === 100 && (
                  <Badge className="text-xs" style={{ background: 'var(--success)', color: 'var(--success-foreground)', border: 'none' }}>
                    Done
                  </Badge>
                )}
                {mod.progress > 0 && mod.progress < 100 && (
                  <Badge className="text-xs" style={{ background: 'var(--accent)', color: 'var(--accent-foreground)', border: 'none' }}>
                    In Progress
                  </Badge>
                )}
                {mod.progress === 0 && (
                  <Badge className="text-xs" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: 'none' }}>
                    Not Started
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Topic Distribution + Achievements ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
              <Target style={{ width: 20, height: 20, color: 'var(--primary)' }} />
              <h3 style={{ margin: 0, color: 'var(--foreground)' }} className="text-base font-bold">
                Module Mastery Distribution
              </h3>
            </div>
            {pieData.length === 0 ? (
              <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                  Complete quizzes to see your mastery breakdown.
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} modules`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                  {pieData.map(entry => (
                    <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
                      <span style={{ color: 'var(--muted-foreground)', fontSize: '0.78rem', flex: 1 }}>{entry.name}</span>
                      <span style={{ color: 'var(--foreground)', fontSize: '0.78rem', fontWeight: 600 }}>{entry.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Certificates */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
              <Award style={{ width: 20, height: 20, color: 'var(--primary)' }} />
              <h3 style={{ margin: 0, color: 'var(--foreground)', fontFamily: 'var(--font-sans)' }} className="text-base font-bold">
                Certificates
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {achievements.map(a => (
                <div
                  key={a.id}
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-lg, 12px)',
                    border: `2px solid ${a.unlocked ? 'var(--primary)' : 'var(--border)'}`,
                    background: a.unlocked
                      ? 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 6%, var(--card)), color-mix(in srgb, var(--secondary) 6%, var(--card)))'
                      : 'var(--muted)',
                    opacity: a.unlocked ? 1 : 0.5,
                    overflow: 'hidden',
                  }}
                >
                  {/* Decorative ribbon stripe */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 6,
                    height: '100%',
                    background: a.unlocked
                      ? 'linear-gradient(180deg, var(--primary), var(--secondary))'
                      : 'var(--border)',
                  }} />
                  <div style={{ padding: '0.875rem 1rem 0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    {/* Seal */}
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: a.unlocked
                        ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
                        : 'var(--muted-foreground)',
                      boxShadow: a.unlocked ? '0 2px 8px color-mix(in srgb, var(--primary) 30%, transparent)' : 'none',
                    }}>
                      <Award style={{ width: 22, height: 22, color: '#fff' }} />
                    </div>
                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 2px', fontWeight: 700, color: 'var(--foreground)', fontSize: '0.82rem', fontFamily: 'var(--font-sans)', letterSpacing: '0.01em' }}>
                        {a.title}
                      </p>
                      <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: '0.72rem', fontFamily: 'var(--font-sans)' }}>
                        {a.description}
                      </p>
                    </div>
                    {/* Status */}
                    {a.unlocked ? (
                      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <CheckCircle style={{ width: 18, height: 18, color: 'var(--success)' }} />
                        <span style={{ fontSize: '0.65rem', color: 'var(--success)', fontWeight: 600, fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>Earned</span>
                      </div>
                    ) : (
                      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px dashed var(--border)' }} />
                        <span style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>Locked</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Overall Completion Bar ── */}
      <Card className="border-0 shadow-md" style={{ background: 'linear-gradient(135deg, var(--accent), #dbeafe)' }}>
        <CardContent className="p-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap style={{ width: 20, height: 20, color: 'var(--primary)' }} />
              <h3 style={{ margin: 0, color: 'var(--foreground)' }} className="text-base font-bold">
                Overall Course Completion
              </h3>
            </div>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>{completionPct}%</span>
          </div>
          <div style={{ height: 12, background: 'var(--card)', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div style={{
              height: '100%',
              width: `${completionPct}%`,
              background: completionPct === 100
                ? 'var(--success)'
                : 'linear-gradient(90deg, var(--primary), var(--secondary))',
              borderRadius: 6,
              transition: 'width 0.5s ease',
            }} />
          </div>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--muted-foreground)', fontSize: '0.8rem' }}>
            {totalCompleted} of {totalLessons} lessons completed across {mockModules.length} modules
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
