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
import { toast, Toaster } from 'sonner';
import { seedDemoStudents } from './utils/demoStudents';
import * as backendApi from './services/backendApi';

// CodeLearn AI - Neural Network Pattern Recognition System for Java OOP
function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedLessonTitle, setSelectedLessonTitle] = useState<string>('');
  const [selectedLessonContent, setSelectedLessonContent] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [editorRefreshKey, setEditorRefreshKey] = useState(0); // Force refresh of code editor
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Seed demo students on initial load
  useEffect(() => {
    seedDemoStudents();
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      setIsCheckingSession(true);

      const currentUser = localStorage.getItem('currentUser');
      const accessToken = localStorage.getItem('accessToken');

      // If we have demo tokens, use them directly without backend verification
      if (accessToken === 'demo-token-student' || accessToken === 'demo-token-instructor') {
        if (currentUser) {
          try {
            const parsedUser = JSON.parse(currentUser);
            setUser(parsedUser);
            setShowLogin(false);
          } catch (error) {
            console.error('Failed to parse user data:', error);
            localStorage.removeItem('currentUser');
          }
        }
        setIsCheckingSession(false);
        return;
      }

      // For real accounts, verify session with backend
      if (accessToken && currentUser) {
        try {
          const sessionResult = await backendApi.getSession();
          if (sessionResult.success && sessionResult.data) {
            const userData = sessionResult.data;
            const user: User = {
              id: userData.userId,
              name: userData.profile?.name || 'User',
              email: userData.email,
              role: userData.profile?.role || 'student',
              enrolledCourses: ['CCS108']
            };
            setUser(user);
            setShowLogin(false);
          } else {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('accessToken');
          }
        } catch (error) {
          console.error('Session check failed:', error);
          localStorage.removeItem('currentUser');
          localStorage.removeItem('accessToken');
        }
      }

      setIsCheckingSession(false);
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

  // Show loading screen while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CodeLearn AI...</p>
        </div>
      </div>
    );
  }

  // Authentication screens
  if (showLogin) {
    return (
      <Login
        onLogin={handleLogin}
        onShowRegister={() => setShowLogin(false)}
      />
    );
  } else if (!user) {
    return (
      <Register
        onRegister={handleRegister}
        onShowLogin={() => setShowLogin(true)}
      />
    );
  }

  const selectedModule = selectedModuleId ? modules.find(m => m.id === selectedModuleId) : null;
  const selectedLesson = selectedModule && selectedLessonId 
    ? selectedModule.lessons.find(l => l.id === selectedLessonId) 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
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
            module={selectedModule}
            onBack={() => setCurrentView('modules')}
            onViewFeedback={() => setCurrentView('feedback')}
            onStartCoding={handleStartCoding}
            onOpenVideoTutorial={handleOpenVideoTutorial}
            onOpenReadingContent={handleOpenReadingContent}
            onOpenAudioLecture={handleOpenAudioLecture}
            onOpenInteractiveGame={handleOpenInteractiveGame}
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
      </main>
      
      {/* Toast Notifications */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

export default App;