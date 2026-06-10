import React, { useEffect, useState } from 'react';
import { User, Module } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BookOpen, Target, TrendingUp, Clock, Brain, CheckCircle, Code, MessageSquare, Activity, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getUserStats, getAllProgress } from '../utils/storage';
import { generateStudentInsights } from '../utils/aiFeedback';

interface StudentDashboardProps {
  user: User;
  modules: Module[];
  onSelectModule: (moduleId: string) => void;
  onViewProgress: () => void;
  onViewFeedback: () => void;
  onNavigate?: (view: string) => void;
}

interface RecentActivity {
  id: string;
  moduleTitle: string;
  lessonId: string;
  completed: boolean;
  score: number;
  lastAccessed: string;
}

export function StudentDashboard({ user, modules, onSelectModule, onViewFeedback, onViewProgress, onNavigate }: StudentDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    const userStats = getUserStats(user.id);
    setStats(userStats);

    const allProgress = getAllProgress(user.id);
    const scores = allProgress.filter(p => p.completed).map(p => p.score);
    const completedLessonIds = allProgress.filter(p => p.completed).map(p => p.lessonId);
    setInsights(generateStudentInsights(completedLessonIds, scores));

    // Collect activities from quiz results (stored as quiz_{moduleId}_{lessonId})
    const quizActivities: RecentActivity[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith('quiz_')) continue;
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const entry = JSON.parse(raw);
        // entry: { lessonId, moduleId, stats: { accuracy, ... }, timestamp }
        if (!entry.moduleId || !entry.lessonId || !entry.timestamp) continue;
        const mod = modules.find(m => m.id === entry.moduleId);
        const lesson = mod?.lessons?.find((l: any) => l.id === entry.lessonId);
        quizActivities.push({
          id: key, // use storage key as unique id
          moduleTitle: mod?.title ?? entry.moduleId,
          lessonId: lesson?.title ?? entry.lessonId,
          completed: (entry.stats?.accuracy ?? 0) >= 70,
          score: Math.round(entry.stats?.accuracy ?? 0),
          lastAccessed: entry.timestamp,
        });
      } catch {}
    }

    // Also include code-editor submissions (progress_{userId}_{moduleId}_{lessonId})
    const editorActivities: RecentActivity[] = allProgress
      .filter(p => p.lastAttempt)
      .map(p => {
        const mod = modules.find(m => m.id === p.moduleId);
        const lesson = mod?.lessons?.find((l: any) => l.id === p.lessonId);
        return {
          id: `progress_${p.moduleId}_${p.lessonId}`,
          moduleTitle: mod?.title ?? p.moduleId,
          lessonId: lesson?.title ?? p.lessonId,
          completed: p.completed,
          score: p.score ?? 0,
          lastAccessed: p.lastAttempt,
        };
      });

    // Merge, deduplicate by lessonId+moduleId, sort newest first, keep 10
    const seen = new Set<string>();
    const merged = [...quizActivities, ...editorActivities]
      .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
      .filter(a => {
        const dedupeKey = `${a.moduleTitle}__${a.lessonId}`;
        if (seen.has(dedupeKey)) return false;
        seen.add(dedupeKey);
        return true;
      })
      .slice(0, 10);

    setRecentActivities(merged);
  }, [user.id, modules]);

  const completedModules = modules.filter(m => m.progress === 100).length;
  const totalLessonsCompleted = modules.reduce((s, m) => s + (m.completedLessons || 0), 0);
  const totalLessons = modules.reduce((s, m) => s + (m.totalLessons || 0), 0);
  const averageScore = stats?.averageScore || 0;
  const totalTime = stats?.totalTimeSpent || 0;
  const streak = stats?.streak || 0;

  const filteredActivities = recentActivities.filter(a =>
    a.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.lessonId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      const now = Date.now();
      const diff = now - d.getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      return `${Math.floor(hrs / 24)}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6, 1.5rem)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3, 0.75rem)' }}>
        <Badge className="bg-blue-600 text-white px-3 py-1">CCS108</Badge>
        <Badge variant="outline" className="border-green-300 text-green-700">Student Portal</Badge>
        <div>
          <h1 style={{ color: 'var(--foreground)', margin: 0 }} className="text-3xl font-bold">Student Dashboard</h1>
          <p style={{ color: 'var(--muted-foreground)', margin: 0 }}>Welcome back, {user.name}! Continue your Object-Oriented Programming journey</p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', width: 20, height: 20 }} />
        <input
          type="text"
          placeholder="Search modules or activities..."
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className="border-0 shadow-md cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105"
          style={{ background: 'linear-gradient(135deg, var(--success), #15803d)' }}
          onClick={() => { onSelectModule('mod1'); toast.info('Navigating to course modules...'); }}
        >
          <CardContent className="p-6">
            <BookOpen style={{ width: 32, height: 32, color: 'var(--success-foreground)', marginBottom: 8 }} />
            <p style={{ color: 'var(--success-foreground)', margin: '0 0 4px', fontSize: '0.85rem', fontWeight: 500 }}>Modules Completed</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--success-foreground)' }}>{completedModules}</span>
              <span style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)' }}>/{modules.length}</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', margin: '4px 0 0' }}>{totalLessonsCompleted}/{totalLessons} lessons</p>
          </CardContent>
        </Card>

        <Card
          className="border-0 shadow-md cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--brand-blue-dark, #1e40af))' }}
          onClick={() => toast.success('🔥 Keep your streak going! Come back tomorrow to continue.')}
        >
          <CardContent className="p-6">
            <Target style={{ width: 32, height: 32, color: 'var(--primary-foreground)', marginBottom: 8 }} />
            <p style={{ color: 'var(--primary-foreground)', margin: '0 0 4px', fontSize: '0.85rem', fontWeight: 500 }}>Learning Streak</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--primary-foreground)' }}>{streak}</span>
              <span style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)' }}>days</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-0 shadow-md cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105"
          style={{ background: 'linear-gradient(135deg, var(--secondary), var(--brand-purple-dark, #7e22ce))' }}
          onClick={() => { onViewProgress(); toast.info('Opening performance dashboard...'); }}
        >
          <CardContent className="p-6">
            <TrendingUp style={{ width: 32, height: 32, color: 'var(--secondary-foreground)', marginBottom: 8 }} />
            <p style={{ color: 'var(--secondary-foreground)', margin: '0 0 4px', fontSize: '0.85rem', fontWeight: 500 }}>Overall Performance</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--secondary-foreground)' }}>{averageScore}</span>
              <span style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)' }}>%</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-0 shadow-md cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105"
          style={{ background: 'linear-gradient(135deg, var(--warning), #dc2626)' }}
          onClick={() => toast.info('Viewing your learning time statistics...')}
        >
          <CardContent className="p-6">
            <Clock style={{ width: 32, height: 32, color: 'var(--warning-foreground)', marginBottom: 8 }} />
            <p style={{ color: 'var(--warning-foreground)', margin: '0 0 4px', fontSize: '0.85rem', fontWeight: 500 }}>Total Learning Time</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--warning-foreground)' }}>{totalTime}</span>
              <span style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)' }}>h</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-0 shadow-md" style={{ background: 'linear-gradient(90deg, var(--accent), #dbeafe)', border: '2px solid var(--secondary)' }}>
        <CardContent className="p-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
            <Brain style={{ width: 24, height: 24, color: 'var(--secondary)' }} />
            <h2 style={{ margin: 0, color: 'var(--foreground)' }} className="text-xl font-bold">AI-Powered Insights</h2>
            <Badge className="ml-auto bg-purple-600 text-white">Neural Network Analysis</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.length > 0 ? (
              insights.map((insight, idx) => (
                <div key={idx} style={{ background: 'var(--card)', borderRadius: 'var(--radius-md, 8px)', padding: '1rem', border: '1px solid var(--border)' }}>
                  <p style={{ margin: 0, color: 'var(--foreground)', fontSize: '0.875rem' }}>{insight}</p>
                </div>
              ))
            ) : (
              <>
                <div style={{ background: 'var(--card)', borderRadius: 'var(--radius-md, 8px)', padding: '1rem', border: '1px solid var(--border)' }}>
                  <p style={{ margin: 0, color: 'var(--foreground)', fontSize: '0.875rem' }}>🚀 Start coding to receive personalized AI insights!</p>
                </div>
                <div style={{ background: 'var(--card)', borderRadius: 'var(--radius-md, 8px)', padding: '1rem', border: '1px solid var(--border)' }}>
                  <p style={{ margin: 0, color: 'var(--foreground)', fontSize: '0.875rem' }}>📊 Complete lessons to unlock pattern recognition feedback</p>
                </div>
                <div style={{ background: 'var(--card)', borderRadius: 'var(--radius-md, 8px)', padding: '1rem', border: '1px solid var(--border)' }}>
                  <p style={{ margin: 0, color: 'var(--foreground)', fontSize: '0.875rem' }}>🎯 Our neural network will analyze your coding style</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h2 style={{ color: 'var(--foreground)', marginBottom: '1rem' }} className="text-xl font-bold">Recent CCS108 Activities</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredActivities.length > 0 ? filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    style={{
                      borderLeft: `4px solid ${activity.completed ? 'var(--success)' : 'var(--warning)'}`,
                      paddingLeft: '1rem',
                      paddingTop: '0.75rem',
                      paddingBottom: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <div>
                        <h3 style={{ margin: 0, color: 'var(--foreground)', fontWeight: 600 }}>{activity.moduleTitle}</h3>
                        <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>Lesson: {activity.lessonId}</p>
                      </div>
                      <div>
                        {activity.completed ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">In Progress</Badge>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: '0.8rem' }}>{formatDate(activity.lastAccessed)}</p>
                      {activity.completed && activity.score > 0 && (
                        <p style={{ margin: 0, color: 'var(--foreground)', fontSize: '0.85rem', fontWeight: 600 }}>{activity.score}%</p>
                      )}
                    </div>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    {searchQuery ? (
                      <p style={{ color: 'var(--muted-foreground)' }}>No activities found matching "{searchQuery}"</p>
                    ) : (
                      <div>
                        <CheckCircle style={{ width: 40, height: 40, color: 'var(--muted-foreground)', margin: '0 auto 0.75rem' }} />
                        <p style={{ color: 'var(--muted-foreground)', margin: 0 }}>No activity yet — start a lesson to see your progress here.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h2 style={{ color: 'var(--foreground)', marginBottom: '1rem' }} className="text-xl font-bold">Student Actions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Button
                  onClick={() => onSelectModule('mod1')}
                  className="w-full justify-start h-12"
                  style={{ background: 'var(--accent)', color: 'var(--accent-foreground)', border: '1px solid var(--primary)' }}
                  variant="outline"
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  Access Modules
                </Button>

                <Button
                  onClick={onViewFeedback}
                  className="w-full justify-start h-12"
                  style={{ background: 'var(--accent)', color: 'var(--secondary)', border: '1px solid var(--secondary)' }}
                  variant="outline"
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  View My Feedback
                </Button>

                <Button
                  onClick={onViewProgress}
                  className="w-full justify-start h-12"
                  style={{ background: 'var(--accent)', color: 'var(--success)', border: '1px solid var(--success)' }}
                  variant="outline"
                >
                  <Activity className="w-5 h-5 mr-3" />
                  Performance Monitoring
                </Button>

                <Button
                  onClick={() => onNavigate?.('references')}
                  className="w-full justify-start h-12"
                  style={{ background: 'var(--accent)', color: 'var(--warning)', border: '1px solid var(--warning)' }}
                  variant="outline"
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  View References (IEEE)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
