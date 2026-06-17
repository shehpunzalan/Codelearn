import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Brain, Mail, Lock, UserCircle, GraduationCap, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from './ui/checkbox';
import * as backendApi from '../services/backendApi';

interface LoginProps {
  onLogin: (user: User) => void;
  onShowRegister: () => void;
}

export function Login({ onLogin, onShowRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);

    try {
      // Check for demo accounts first (no backend call needed)
      if (email === 'student@demo.com' && password === 'demo123' && role === 'student') {
        const demoUser: User = {
          id: 'demo-student',
          name: 'Demo Student',
          email: 'student@demo.com',
          role: 'student',
          enrolledCourses: ['CCS108']
        };
        
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        localStorage.setItem('accessToken', 'demo-token-student');
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberedEmail', email);
        }
        
        toast.success('Login successful!', {
          description: 'Welcome to Demo Mode!',
        });
        
        setIsLoading(false);
        onLogin(demoUser);
        return;
      } else if (email === 'instructor@demo.com' && password === 'demo123' && role === 'instructor') {
        const demoUser: User = {
          id: 'demo-instructor',
          name: 'Dr. Demo Instructor',
          email: 'instructor@demo.com',
          role: 'instructor',
          enrolledCourses: []
        };
        
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        localStorage.setItem('accessToken', 'demo-token-instructor');
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberedEmail', email);
        }
        
        toast.success('Login successful!', {
          description: 'Welcome to Demo Mode!',
        });
        
        setIsLoading(false);
        onLogin(demoUser);
        return;
      }

      // --- Check local accounts first (works even without backend) ---
      let localUsers: any[] = [];
      try {
        const raw = localStorage.getItem('registeredUsers');
        localUsers = raw ? JSON.parse(raw) : [];
      } catch (_e: unknown) { localUsers = []; }

      const localMatch = localUsers.find((u: any) => u.email === email && u.role === role);
      if (localMatch) {
        // Verify password against stored credentials
        let credsOk = false;
        try {
          const credsRaw = localStorage.getItem(`userCreds_${email}`);
          if (credsRaw) {
            const creds = JSON.parse(credsRaw);
            credsOk = creds.password === password;
          }
        } catch (_e: unknown) {}

        if (credsOk) {
          const user: User = {
            id: localMatch.id,
            name: localMatch.name,
            email: localMatch.email,
            role: localMatch.role,
            enrolledCourses: localMatch.enrolledCourses || ['CCS108'],
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('accessToken', `local-token-${user.id}`);
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('rememberedEmail', email);
          }
          localStorage.setItem('lastLoginTime', new Date().toISOString());
          toast.success('Login successful!', { description: `Welcome back, ${user.name}!` });
          setIsLoading(false);
          onLogin(user);
          return;
        } else {
          toast.error('Incorrect password', { description: 'Please check your password and try again.' });
          setErrors({ password: 'Incorrect password.' });
          setIsLoading(false);
          return;
        }
      }

      // --- Fall back to Supabase Auth for accounts registered on other devices ---
      try {
        const { signInWithSupabase } = await import('../utils/supabaseClient');
        const authData = await signInWithSupabase(email, password);
        if (authData?.user) {
          const meta = authData.user.user_metadata || {};
          const userRole = meta.role || role;
          if (userRole !== role) {
            toast.error('Wrong role selected', {
              description: `This account is registered as a ${userRole}. Please select the correct role.`,
            });
            setIsLoading(false);
            return;
          }
          const user: User = {
            id: authData.user.id,
            name: meta.name || authData.user.email || 'User',
            email: authData.user.email || email,
            role: userRole,
            enrolledCourses: meta.enrolledCourses || ['CCS108'],
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('accessToken', authData.session?.access_token || `supabase-${user.id}`);
          localStorage.setItem(`userCreds_${email}`, JSON.stringify({ password, id: user.id }));
          if (!localUsers.some((u: any) => u.id === user.id)) {
            localUsers.push({ ...user, registeredAt: new Date().toISOString() });
            localStorage.setItem('registeredUsers', JSON.stringify(localUsers));
          }
          if (rememberMe) { localStorage.setItem('rememberMe', 'true'); localStorage.setItem('rememberedEmail', email); }
          localStorage.setItem('lastLoginTime', new Date().toISOString());
          toast.success('Login successful!', { description: `Welcome back, ${user.name}!` });
          setIsLoading(false);
          onLogin(user);
          return;
        }
      } catch (_supabaseErr: unknown) { /* fall through to backend */ }

      try {
        const result = await backendApi.signIn(email, password);

        if (result.success) {
          const userData = result.data;

          if (userData.profile?.role && userData.profile.role !== role) {
            toast.error('Login failed', {
              description: `This account is registered as a ${userData.profile?.role}. Please select the correct role.`,
            });
            setIsLoading(false);
            return;
          }

          const user: User = {
            id: userData.userId,
            name: userData.profile?.name || 'User',
            email: userData.email,
            role: userData.profile?.role || role,
            enrolledCourses: ['CCS108'],
          };

          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('accessToken', userData.accessToken);
          localStorage.setItem(`userCreds_${email}`, JSON.stringify({ password, id: user.id }));

          // Save to local registeredUsers so instructor views work
          if (!localUsers.some((u: any) => u.id === user.id)) {
            localUsers.push({ ...user, registeredAt: new Date().toISOString() });
            localStorage.setItem('registeredUsers', JSON.stringify(localUsers));
          }

          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('rememberedEmail', email);
          } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('rememberedEmail');
          }
          localStorage.setItem('lastLoginTime', new Date().toISOString());
          toast.success('Login successful!', { description: `Welcome back, ${user.name}!` });
          setIsLoading(false);
          onLogin(user);
        }
      } catch (_backendErr: unknown) {
        // Backend unreachable and no local account found
        setIsLoading(false);
        toast.error('Account not found', {
          description: 'No account found with this email and role. Please register first.',
          duration: 5000,
        });
        setErrors({ email: 'No account found. Please register first.' });
      }
    } catch (outerErr: unknown) {
      console.error('Login error:', outerErr);
      setIsLoading(false);
      toast.error('Login failed', { description: 'An unexpected error occurred. Please try again.' });
    }
  };

  // Auto-fill remembered email
  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberMe');
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    
    if (remembered === 'true' && rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">CodeLearn AI</h1>
          <p className="text-gray-600 font-medium">Cloud-Based Pattern Recognition System</p>
          <p className="text-gray-500 text-sm">Neural Network Powered Learning Platform</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold">Log In</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Role</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      role === 'student'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <UserCircle className="w-5 h-5" />
                    <span className="font-medium">Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('instructor')}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      role === 'instructor'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span className="font-medium">Instructor</span>
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    className={`pl-10 h-12 border-gray-200 ${errors.email ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    className={`pl-10 pr-10 h-12 border-gray-200 ${errors.password ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Logging in...
                  </>
                ) : (
                  'Log In'
                )}
              </Button>

              {/* Register Link */}
              <div className="text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <button
                  type="button"
                  onClick={onShowRegister}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Register
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}