import React, { useState, useEffect } from 'react';
import { User, Module } from './types';
import { mockModules } from './data/mockData';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Header } from './components/Header';
import { StudentDashboard } from './components/StudentDashboard';
import { InstructorDashboard } from './components/InstructorDashboard';
import { ModulesPage } from './components/ModulesPage';
import { CourseManagement } from './components/CourseManagement';
import { LessonViewer } from './components/LessonViewerSimple';
import { CodeEditorPage } from './components/CodeEditorPage';
import { FeedbackPage } from './components/FeedbackPage';
import { ProgressView } from './components/ProgressView';
import { SettingsPage } from './components/SettingsPage';
import { AnalyticsView } from './components/AnalyticsView';
import { MonitoringView } from './components/MonitoringView';
import { ReferencesView } from './components/ReferencesView';
import { VideoTutorialPage } from './components/VideoTutorialPage';
import { ReadingContentPage } from './components/ReadingContentPage';
import { AudioLecturePage } from './components/AudioLecturePage';
import { InteractiveGamePage } from './components/InteractiveGamePage';
import { LearningPathReadingPage } from './components/LearningPathReadingPage';
import { DataViewer } from './components/DataViewer';
import { ConnectionTest } from './components/ConnectionTest';
import { DatabaseTest } from './components/DatabaseTest';
import { toast, Toaster } from 'sonner';
import { seedDemoStudents } from './utils/demoStudents';
import * as backendApi from './services/backendApi';
import { ErrorBoundary } from './components/ErrorBoundary';

// CodeLearn AI - Neural Network Pattern Recognition System for Java OOP
function AppContent() {
  console.log('🚀 AppContent rendering - timestamp:', new Date().toISOString());
  console.log('📦 React version:', React.version);
  console.log('🌐 Window location:', window.location.href);

  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedLessonTitle, setSelectedLessonTitle] = useState<string>('');
  const [selectedLessonContent, setSelectedLessonContent] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [editorRefreshKey, setEditorRefreshKey] = useState(0); // Force refresh of code editor
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Seed demo students on initial load
  useEffect(() => {
    console.log('🎬 Initializing app...');
    seedDemoStudents();
    setIsInitialized(true);
    console.log('✅ App initialized');
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      console.log('🔍 Checking session...');

      try {
        const currentUser = localStorage.getItem('currentUser');
        const accessToken = localStorage.getItem('accessToken');

        console.log('📦 Found in localStorage:', {
          hasUser: !!currentUser,
          tokenType: accessToken?.substring(0, 10)
        });

        // If we have demo tokens, use them directly without backend verification
        if (accessToken === 'demo-token-student' || accessToken === 'demo-token-instructor') {
          if (currentUser) {
            const parsedUser = JSON.parse(currentUser);
            console.log('✅ Demo user loaded:', parsedUser.email);
            setUser(parsedUser);
            setShowLogin(false);
          }
          return;
        }

        // For real accounts, verify session with backend (with timeout)
        if (accessToken && currentUser) {
          console.log('🌐 Verifying session with backend...');

          // Add 2 second timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Session check timeout')), 2000)
          );

          try {
            const sessionResult = await Promise.race([
              backendApi.getSession(),
              timeoutPromise
            ]) as any;

            if (sessionResult.success && sessionResult.data) {
              const userData = sessionResult.data;
              const user: User = {
                id: userData.userId,
                name: userData.profile?.name || 'User',
                email: userData.email,
                role: userData.profile?.role || 'student',
                enrolledCourses: ['CCS108']
              };
              console.log('✅ Backend session verified:', user.email);
              setUser(user);
              setShowLogin(false);
            } else {
              console.log('❌ Backend session invalid, clearing storage');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('accessToken');
            }
          } catch (error: any) {
            console.log('⚠️ Backend unavailable, clearing session:', error.message);
            localStorage.removeItem('currentUser');
            localStorage.removeItem('accessToken');
          }
        }
      } catch (error) {
        console.error('❌ Session check error:', error);
      } finally {
        console.log('✅ Session check complete');
      }
    };

    checkSession();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
    setShowLogin(false);
  };

  const handleRegister = (newUser: User) => {
    setUser(newUser);
    setCurrentView('dashboard');
    setShowLogin(false);
  };

  const handleLogout = async () => {
    try {
      // Call backend signout (skip for demo accounts)
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken && accessToken !== 'demo-token-student' && accessToken !== 'demo-token-instructor') {
        await backendApi.signOut();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of backend result
      setUser(null);
      setShowLogin(true);
      setCurrentView('dashboard');
      setSelectedModuleId(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('lastLoginTime');
      toast.success('Logged out successfully');
    }
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    if (view !== 'module' && view !== 'code-editor') {
      setSelectedModuleId(null);
      setSelectedLessonId(null);
    }
  };

  const handleSelectModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setCurrentView('module');
  };

  const handleLessonComplete = (moduleId: string, completedCount: number, total: number) => {
    const progress = Math.round((completedCount / total) * 100);
    setModules(prev => prev.map(m =>
      m.id === moduleId ? { ...m, progress, completedLessons: completedCount } : m
    ));
  };

  const handleModuleComplete = (moduleId: string) => {
    setModules(prev => prev.map(m =>
      m.id === moduleId ? { ...m, progress: 100, completedLessons: m.totalLessons } : m
    ));
  };

  const handleNextModule = () => {
    if (!selectedModuleId) return;
    const currentIndex = modules.findIndex(m => m.id === selectedModuleId);
    const next = modules[currentIndex + 1];
    if (next) {
      setSelectedModuleId(next.id);
    } else {
      setCurrentView('modules');
      setSelectedModuleId(null);
    }
  };

  const handleStartCoding = (moduleId: string, lessonId: string) => {
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
    setCurrentView('code-editor');
    setEditorRefreshKey(prevKey => prevKey + 1); // Force refresh of code editor
  };

  const handleOpenVideoTutorial = (moduleId: string, lessonId: string, lessonTitle: string) => {
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
    setSelectedLessonTitle(lessonTitle);
    setCurrentView('video-tutorial');
  };

  const handleOpenReadingContent = (moduleId: string, lessonId: string, lessonTitle: string, lessonContent: any) => {
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
    setSelectedLessonTitle(lessonTitle);
    setSelectedLessonContent(lessonContent);
    setCurrentView('learning-path-reading');
  };

  const handleOpenAudioLecture = (moduleId: string, lessonId: string, lessonTitle: string, lessonContent: any) => {
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
    setSelectedLessonTitle(lessonTitle);
    setSelectedLessonContent(lessonContent);
    setCurrentView('audio-lecture');
  };

  const handleOpenInteractiveGame = (moduleId: string, lessonId: string, lessonTitle: string, lessonContent: any) => {
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
    setSelectedLessonTitle(lessonTitle);
    setSelectedLessonContent(lessonContent);
    setCurrentView('interactive-game');
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Also update in registeredUsers
    const usersData = localStorage.getItem('registeredUsers');
    if (usersData) {
      const registeredUsers = JSON.parse(usersData);
      const userIndex = registeredUsers.findIndex((u: any) => u.id === updatedUser.id);
      if (userIndex !== -1) {
        registeredUsers[userIndex] = {
          ...registeredUsers[userIndex],
          name: updatedUser.name,
          email: updatedUser.email,
        };
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }
    }
    
    setCurrentView('dashboard');
  };

  // Show loading while initializing
  if (!isInitialized) {
    console.log('⏳ App initializing...');
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">Loading CodeLearn AI...</p>
        </div>
      </div>
    );
  }

  // Authentication screens - simplified logic
  if (!user) {
    console.log(showLogin ? '🔐 Rendering login screen' : '📝 Rendering register screen');

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {showLogin ? (
          <Login
            onLogin={handleLogin}
            onShowRegister={() => setShowLogin(false)}
          />
        ) : (
          <Register
            onRegister={handleRegister}
            onShowLogin={() => setShowLogin(true)}
          />
        )}
        <Toaster position="top-right" richColors closeButton />
      </div>
    );
  }

  // Find the currently selected module based on selectedModuleId
  const selectedModule = selectedModuleId ? modules.find(module => module.id === selectedModuleId) : null;

  // Find the currently selected lesson within the selected module
  const selectedLesson = selectedModule && selectedLessonId
    ? selectedModule.lessons.find(lesson => lesson.id === selectedLessonId)
    : null;

  console.log('🎨 Rendering main app - User:', user?.name, 'View:', currentView);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
      <Header
        user={user} 
        currentView={currentView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onSettings={() => setCurrentView('settings')}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && user.role === 'student' && (
          <StudentDashboard
            user={user}
            modules={modules}
            onSelectModule={handleSelectModule}
            onViewProgress={() => setCurrentView('progress')}
            onViewFeedback={() => setCurrentView('feedback')}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'dashboard' && user.role === 'instructor' && (
          <InstructorDashboard
            user={user}
            modules={modules}
            onSelectModule={handleSelectModule}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'modules' && (
          <ModulesPage
            modules={modules}
            onSelectModule={handleSelectModule}
          />
        )}

        {currentView === 'module' && selectedModule && (
          <LessonViewer
            key={selectedModule.id}
            module={selectedModule}
            onBack={() => setCurrentView('modules')}
            onViewFeedback={() => setCurrentView('feedback')}
            onStartCoding={handleStartCoding}
            onOpenVideoTutorial={handleOpenVideoTutorial}
            onOpenReadingContent={handleOpenReadingContent}
            onOpenAudioLecture={handleOpenAudioLecture}
            onOpenInteractiveGame={handleOpenInteractiveGame}
            onLessonComplete={handleLessonComplete}
            onModuleComplete={handleModuleComplete}
            onNextModule={modules.findIndex(m => m.id === selectedModuleId) < modules.length - 1 ? handleNextModule : undefined}
          />
        )}

        {currentView === 'code-editor' && selectedModule && selectedLesson && (
          <CodeEditorPage
            key={`${selectedModule.id}-${selectedLesson.id}-${editorRefreshKey}`} // Force remount on navigation
            module={selectedModule}
            lesson={selectedLesson}
            onBack={() => {
              setCurrentView('module');
              setSelectedLessonId(null);
              setEditorRefreshKey(prevKey => prevKey + 1); // Increment for next visit
            }}
            onViewFeedback={() => setCurrentView('feedback')}
          />
        )}

        {currentView === 'feedback' && (
          <FeedbackPage onBack={() => setCurrentView('code-editor')} />
        )}

        {currentView === 'progress' && (
          <ProgressView onBack={() => setCurrentView('dashboard')} />
        )}

        {currentView === 'settings' && (
          <SettingsPage
            user={user}
            onSave={handleUpdateProfile}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'course-management' && user.role === 'instructor' && (
          <CourseManagement 
            user={user}
            modules={modules}
            onBack={() => setCurrentView('dashboard')} 
          />
        )}

        {currentView === 'monitoring' && user.role === 'instructor' && (
          <MonitoringView onBack={() => setCurrentView('dashboard')} />
        )}

        {currentView === 'references' && (
          <ReferencesView 
            modules={mockModules}
            onBack={() => setCurrentView('dashboard')} 
          />
        )}

        {currentView === 'video-tutorial' && selectedModuleId && selectedLessonId && (
          <VideoTutorialPage 
            moduleId={selectedModuleId}
            lessonId={selectedLessonId}
            lessonTitle={selectedLessonTitle}
            onBack={() => setCurrentView('module')} 
          />
        )}

        {currentView === 'learning-path-reading' && selectedModuleId && selectedLessonId && (
          <LearningPathReadingPage 
            moduleId={selectedModuleId}
            lessonId={selectedLessonId}
            lessonTitle={selectedLessonTitle}
            lessonContent={selectedLessonContent || {}}
            onBack={() => setCurrentView('module')} 
          />
        )}

        {currentView === 'audio-lecture' && selectedModuleId && selectedLessonId && (
          <AudioLecturePage 
            moduleId={selectedModuleId}
            lessonId={selectedLessonId}
            lessonTitle={selectedLessonTitle}
            lessonContent={selectedLessonContent || {}}
            onBack={() => setCurrentView('module')} 
          />
        )}

        {currentView === 'interactive-game' && selectedModuleId && selectedLessonId && (
          <InteractiveGamePage
            moduleId={selectedModuleId}
            lessonId={selectedLessonId}
            lessonTitle={selectedLessonTitle}
            lessonContent={selectedLessonContent || {}}
            onBack={() => setCurrentView('module')}
          />
        )}

        {currentView === 'analytics' && user.role === 'instructor' && (
          <AnalyticsView user={user} onBack={() => setCurrentView('dashboard')} />
        )}

        {currentView === 'data-viewer' && (
          <DataViewer onBack={() => setCurrentView('dashboard')} />
        )}

        {currentView === 'connection-test' && (
          <ConnectionTest onBack={() => setCurrentView('settings')} />
        )}

        {currentView === 'database-test' && (
          <DatabaseTest onBack={() => setCurrentView('settings')} />
        )}

        {/* Fallback in case no view matches */}
        {!['dashboard', 'modules', 'module', 'code-editor', 'feedback', 'progress', 'settings', 'course-management', 'monitoring', 'references', 'video-tutorial', 'learning-path-reading', 'audio-lecture', 'interactive-game', 'analytics', 'data-viewer', 'connection-test', 'database-test'].includes(currentView) && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-6">The view "{currentView}" doesn't exist.</p>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </main>

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

// Wrap with error boundary
function App() {
  console.log('🎯 App function called - CodeLearn AI starting');
  console.log('📦 React:', React.version);

  // Safety check - ensure we always return valid JSX
  if (!React || typeof React.createElement !== 'function') {
    console.error('❌ React not loaded properly');
    return null;
  }

  try {
    console.log('✅ Rendering ErrorBoundary and AppContent');
    return (
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('🔴 App render error:', error);
    // Fallback error UI
    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fee2e2',
        padding: '2rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          maxWidth: '600px',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
            ⚠️ Application Error
          </h1>
          <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
            {error instanceof Error ? error.message : 'An unknown error occurred while loading CodeLearn AI'}
          </p>
          {error instanceof Error && error.stack && (
            <details style={{ marginBottom: '1rem' }}>
              <summary style={{ cursor: 'pointer', color: '#6b7280', fontSize: '0.875rem' }}>
                Show error details
              </summary>
              <pre style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '4px',
                fontSize: '0.75rem',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {error.stack}
              </pre>
            </details>
          )}
          <button
            onClick={() => {
              console.log('🔄 Reloading page...');
              window.location.reload();
            }}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }
}

export default App;