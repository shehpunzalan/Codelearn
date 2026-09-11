import React from 'react';
import { User } from '../types';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Brain, Home, BookOpen, Code, MessageSquare, TrendingUp, LogOut, User as UserIcon, Settings, Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { getAllNotifications, markNotificationAsRead, deleteNotification, saveNotification, clearAllNotifications } from '../utils/storage';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import * as backendApi from '../services/backendApi';

interface HeaderProps {
  user: User | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onSettings: () => void;
}

export function Header({ user, currentView, onNavigate, onLogout, onSettings }: HeaderProps) {
  if (!user) return null;

  // Generate user initials from name (e.g., "John Doe" -> "JD")
  const initials = user.name.split(' ').map(namePart => namePart[0]).join('').toUpperCase();
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [notificationOpen, setNotificationOpen] = React.useState(false);

  // Load notifications on mount
  React.useEffect(() => {
    if (user.role === 'student') {
      setNotifications(getAllNotifications(user.id));
    }
  }, [user.id, user.role]);

  // Refresh notifications when popover opens
  React.useEffect(() => {
    if (notificationOpen && user.role === 'student') {
      setNotifications(getAllNotifications(user.id));
    }
  }, [notificationOpen, user.id, user.role]);

  // Poll backend for cross-device notifications (interventions, adjustments)
  React.useEffect(() => {
    if (user.role !== 'student') return;

    const applyBackendNotifs = async () => {
      try {
        const res = await backendApi.getNotifications(user.id);
        const items: any[] = res?.data || res?.notifications || [];
        if (!Array.isArray(items) || items.length === 0) return;

        const existing = getAllNotifications(user.id);
        const existingIds = new Set(existing.map((n: any) => String(n.id)));
        let changed = false;

        for (const item of items) {
          const remoteId = String(item.id || item.notificationId || '');
          if (!remoteId || existingIds.has(remoteId)) continue;

          // For intervention notifications: unlock the locked quiz
          if ((item.type === 'intervention' || item.type === 'adjustment') && item.module_id && item.lesson_id) {
            const quizKey = `quiz_attempts_${user.id}_${item.module_id}_${item.lesson_id}`;
            localStorage.removeItem(quizKey);
          }

          saveNotification({
            id: remoteId,
            userId: user.id,
            type: item.type || 'announcement',
            title: item.title || 'New Notification',
            message: item.message || item.body || '',
            moduleId: item.module_id || item.moduleId,
            lessonId: item.lesson_id || item.lessonId,
            timestamp: item.created_at || item.timestamp || new Date().toISOString(),
            read: false,
            sourceType: 'instructor',
          } as any);
          changed = true;
        }

        if (changed) setNotifications(getAllNotifications(user.id));
      } catch { /* backend unreachable — ignore */ }
    };

    applyBackendNotifs();
    const interval = setInterval(applyBackendNotifs, 30_000);
    return () => clearInterval(interval);
  }, [user.id, user.role]);

  // Count unread notifications for badge display
  const unreadCount = notifications.filter(notification => !notification.read).length;

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(user.id, notificationId);
    setNotifications(getAllNotifications(user.id));
  };

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(user.id, notificationId);
    setNotifications(getAllNotifications(user.id));
  };

  const handleMarkAllRead = () => {
    const all = getAllNotifications(user.id);
    all.forEach(n => markNotificationAsRead(user.id, n.id));
    setNotifications(getAllNotifications(user.id));
    toast.success('All notifications marked as read');
  };

  const handleClearAll = () => {
    clearAllNotifications(user.id);
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const handleNotificationClick = (notification: any) => {
    handleMarkAsRead(notification.id);
    setNotificationOpen(false);

    const type = notification.type || '';
    if (type === 'intervention' || type === 'remedial') {
      onNavigate('code-editor');
    } else if (type === 'adjustment') {
      onNavigate('modules');
    } else if (type === 'activity' && notification.moduleId) {
      onNavigate('modules');
    } else if (type === 'module' && notification.moduleId) {
      onNavigate('modules');
    } else if (notification.moduleId || notification.lessonId) {
      onNavigate('modules');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'module':
        return '📚';
      case 'activity':
        return '✏️';
      case 'announcement':
        return '📢';
      default:
        return '🔔';
    }
  };

  const getSourceBadgeColor = (sourceType?: string) => {
    switch (sourceType) {
      case 'neural-network':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'ai-generated':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'instructor':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'curriculum':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSourceLabel = (sourceType?: string) => {
    switch (sourceType) {
      case 'neural-network':
        return '🧠 AI Neural Network';
      case 'ai-generated':
        return '🤖 AI Generated';
      case 'instructor':
        return '👨‍🏫 Instructor';
      case 'curriculum':
        return '📖 Curriculum';
      default:
        return 'System';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Role-specific navigation items based on use case diagram
  const studentNavItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'modules', label: 'Modules', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  const instructorNavItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'course-management', label: 'Courses', icon: BookOpen },
    { id: 'monitoring', label: 'Monitoring', icon: Code },
  ];

  const navItems = user.role === 'student' ? studentNavItems : instructorNavItems;

  return (
    <header
      style={{
        background: 'var(--card)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — clicking it goes Home */}
          <button
            onClick={() => onNavigate('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{ background: 'var(--primary)', padding: '0.45rem', borderRadius: 'var(--radius-md, 8px)', display: 'flex', alignItems: 'center' }}>
              <Brain style={{ width: 22, height: 22, color: 'var(--primary-foreground)' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontWeight: 700, color: 'var(--foreground)', fontSize: '1rem', lineHeight: 1.2 }}>CodeLearn AI</p>
              <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: '0.7rem' }}>Neural Network Powered</p>
            </div>
          </button>

          {/* Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id ||
                (currentView === 'module' && item.id === 'modules') ||
                (currentView === 'lesson' && item.id === 'modules');

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    background: isActive ? 'var(--accent)' : 'transparent',
                    color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.background = 'var(--muted)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--foreground)'; } }}
                  onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted-foreground)'; } }}
                >
                  <Icon style={{ width: 16, height: 16 }} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)' }}>{user.name}</p>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--muted-foreground)', textTransform: 'capitalize' }}>{user.role}</p>
            </div>
            
            {/* Notification Bell - Students Only */}
            {user.role === 'student' && (
              <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full p-0 relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center p-0 border-2 border-white">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-96 p-0 border-0 shadow-lg">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-semibold" style={{ fontFamily: 'var(--font-sans)', color: 'var(--foreground)' }}>Notifications</h4>
                        {unreadCount > 0 && <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}>{unreadCount} unread</p>}
                      </div>
                      <div className="flex gap-1">
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs px-2 py-1 rounded hover:bg-white/60 transition-colors"
                            style={{ color: 'var(--primary)', fontFamily: 'var(--font-sans)' }}
                          >
                            Mark all read
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button
                            onClick={handleClearAll}
                            className="text-xs px-2 py-1 rounded hover:bg-white/60 transition-colors"
                            style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <ScrollArea className="h-96">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No notifications yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                              !notification.read ? 'bg-blue-50/30' : ''
                            }`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {notification.title}
                                  </p>
                                  <button
                                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteNotification(notification.id);
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="w-4 h-4"
                                    >
                                      <line x1="18" y1="6" x2="6" y2="18" />
                                      <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                  </button>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                
                                {/* Source and Timestamp */}
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  <span className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</span>
                                  {!notification.read && (
                                    <Badge className="bg-blue-600 text-white text-xs px-2 py-0">New</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-600 text-white font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}