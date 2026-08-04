import React, { useState } from 'react';
import { User } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Brain, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
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
      // Demo accounts — detect by email, role is embedded in the email
      if (email === 'student@demo.com' && password === 'demo123') {
        const demoUser: User = {
          id: 'demo-student',
          name: 'Demo Student',
          email: 'student@demo.com',
          role: 'student',
          enrolledCourses: ['CCS108'],
        };
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        localStorage.setItem('accessToken', 'demo-token-student');
        if (rememberMe) { localStorage.setItem('rememberMe', 'true'); localStorage.setItem('rememberedEmail', email); }
        toast.success('Login successful!', { description: 'Welcome to Demo Mode!' });
        setIsLoading(false);
        onLogin(demoUser);
        return;
      }
      if (email === 'instructor@demo.com' && password === 'demo123') {
        const demoUser: User = {
          id: 'demo-instructor',
          name: 'Dr. Demo Instructor',
          email: 'instructor@demo.com',
          role: 'instructor',
          enrolledCourses: [],
        };
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        localStorage.setItem('accessToken', 'demo-token-instructor');
        if (rememberMe) { localStorage.setItem('rememberMe', 'true'); localStorage.setItem('rememberedEmail', email); }
        toast.success('Login successful!', { description: 'Welcome to Demo Mode!' });
        setIsLoading(false);
        onLogin(demoUser);
        return;
      }

      // Auto-detect role from registered users list
      let localUsers: any[] = [];
      try {
        const raw = localStorage.getItem('registeredUsers');
        localUsers = raw ? JSON.parse(raw) : [];
      } catch (_e: unknown) { localUsers = []; }

      // Check credentials key first — this survives even if registeredUsers was corrupted/wiped.
      const credsRaw = localStorage.getItem(`userCreds_${email}`);
      if (credsRaw) {
        let creds: { password: string; id: string } | null = null;
        try { creds = JSON.parse(credsRaw); } catch {}

        if (creds) {
          if (creds.password !== password) {
            // Credentials exist but password is wrong — definitive failure, no backend fallthrough.
            toast.error('Incorrect password', { description: 'Please check your password and try again.' });
            setErrors({ password: 'Incorrect password.' });
            setIsLoading(false);
            return;
          }

          // Password matches — find or reconstruct the user profile.
          const localMatch = localUsers.find((u: any) => u.email === email);
          const userId = creds.id;

          // If the entry was wiped from registeredUsers, restore it from the credentials key.
          if (!localMatch) {
            const restoredUser = {
              id: userId,
              name: email.split('@')[0], // best-effort name recovery
              email,
              role: 'student' as const,
              enrolledCourses: ['CCS108'],
              registeredAt: new Date().toISOString(),
              pendingSync: true,
            };
            const usersToSave = [...localUsers, restoredUser];
            localStorage.setItem('registeredUsers', JSON.stringify(usersToSave));
            const user: User = { id: userId, name: restoredUser.name, email, role: 'student', enrolledCourses: ['CCS108'] };
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('accessToken', `local-token-${userId}`);
            if (rememberMe) { localStorage.setItem('rememberMe', 'true'); localStorage.setItem('rememberedEmail', email); }
            localStorage.setItem('lastLoginTime', new Date().toISOString());
            toast.success('Login successful!', { description: `Welcome back! Your account has been restored.` });
            setIsLoading(false);
            onLogin(user);
            return;
          }

          // Normal path — profile exists and password matched.
          const user: User = {
            id: localMatch.id,
            name: localMatch.name,
            email: localMatch.email,
            role: localMatch.role,
            enrolledCourses: localMatch.enrolledCourses || ['CCS108'],
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('accessToken', `local-token-${user.id}`);
          if (rememberMe) { localStorage.setItem('rememberMe', 'true'); localStorage.setItem('rememberedEmail', email); }
          localStorage.setItem('lastLoginTime', new Date().toISOString());
          toast.success('Login successful!', { description: `Welcome back, ${user.name}! (${user.role})` });
          setIsLoading(false);
          onLogin(user);
          return;
        }
      }

      // No local credentials found — fall through to backend auth (handles accounts
      // registered on a different device or directly via Supabase).

      // Try Supabase Auth — role will be read from user_metadata
      try {
        const { signInWithSupabase } = await import('../utils/supabaseClient');
        const authData = await signInWithSupabase(email, password);
        const authUser = authData?.user || authData;
        if (authUser?.id) {
          const meta = authUser.user_metadata || authUser.raw_user_meta_data || {};
          const detectedRole = meta.role || 'student';
          const user: User = {
            id: authUser.id,
            name: meta.name || authUser.email || 'User',
            email: authUser.email || email,
            role: detectedRole,
            enrolledCourses: meta.enrolledCourses || ['CCS108'],
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('accessToken', authData?.access_token || `supabase-${user.id}`);
          localStorage.setItem(`userCreds_${email}`, JSON.stringify({ password, id: user.id }));
          if (!localUsers.some((u: any) => u.id === user.id)) {
            localUsers.push({ ...user, registeredAt: new Date().toISOString() });
            localStorage.setItem('registeredUsers', JSON.stringify(localUsers));
          }
          if (rememberMe) { localStorage.setItem('rememberMe', 'true'); localStorage.setItem('rememberedEmail', email); }
          localStorage.setItem('lastLoginTime', new Date().toISOString());
          toast.success('Login successful!', { description: `Welcome back, ${user.name}! (${user.role})` });
          setIsLoading(false);
          onLogin(user);
          return;
        }
      } catch (supabaseErr: unknown) {
        if (String(supabaseErr).includes('backend-csp')) {
          setIsLoading(false);
          toast.error('Connection issue', {
            description: 'Your account exists but cannot be verified right now. Please try again later or contact your instructor.',
            duration: 7000,
          });
          return;
        }
        /* otherwise fall through to backendApi direct path */
      }

      try {
        const result = await backendApi.signIn(email, password);
        if (result.success) {
          const userData = result.data;
          const detectedRole = userData.profile?.role || 'student';
          const user: User = {
            id: userData.userId,
            name: userData.profile?.name || 'User',
            email: userData.email,
            role: detectedRole,
            enrolledCourses: ['CCS108'],
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('accessToken', userData.accessToken);
          // Cache credentials so the next login works offline
          localStorage.setItem(`userCreds_${email}`, JSON.stringify({ password, id: user.id }));
          if (!localUsers.some((u: any) => u.id === user.id)) {
            localUsers.push({ ...user, registeredAt: new Date().toISOString() });
            localStorage.setItem('registeredUsers', JSON.stringify(localUsers));
          }
          if (rememberMe) { localStorage.setItem('rememberMe', 'true'); localStorage.setItem('rememberedEmail', email); }
          localStorage.setItem('lastLoginTime', new Date().toISOString());
          toast.success('Login successful!', { description: `Welcome back, ${user.name}! (${user.role})` });
          setIsLoading(false);
          onLogin(user);
        }
      } catch (backendErr: unknown) {
        setIsLoading(false);
        if (String(backendErr).includes('backend-csp')) {
          toast.error('Connection issue', {
            description: 'Cannot reach the server right now. Please check your connection or contact your instructor.',
            duration: 7000,
          });
        } else {
          toast.error('Account not found', {
            description: 'No account found with this email. Please register first.',
            duration: 5000,
          });
          setErrors({ email: 'No account found. Please register first.' });
        }
      }
    } catch (outerErr: unknown) {
      console.error('Login error:', outerErr);
      setIsLoading(false);
      toast.error('Login failed', { description: 'An unexpected error occurred. Please try again.' });
    }
  };

  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberMe');
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (remembered === 'true' && rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background-secondary)', padding: '1rem', fontFamily: 'var(--font-sans)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: 'var(--radius-xl)', background: 'var(--color-primary-600)', marginBottom: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <Brain style={{ width: 40, height: 40, color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 0.25rem', fontFamily: 'var(--font-sans)' }}>CodeLearn AI</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontFamily: 'var(--font-sans)' }}>Java OOP Learning Platform — CCS108</p>
        </div>

        <Card style={{ border: '1px solid var(--color-border-default)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', borderRadius: 'var(--radius-xl)' }}>
          <CardHeader style={{ paddingBottom: '0.75rem' }}>
            <CardTitle style={{ fontSize: '1.375rem', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)' }}>Log In</CardTitle>
            <CardDescription style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text-secondary)' }}>
              Welcome back. Please sign in to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <Label htmlFor="email" style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>Email</Label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--color-text-tertiary)' }} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                    style={{ paddingLeft: '2.5rem', height: '2.75rem', fontFamily: 'var(--font-sans)', border: errors.email ? '2px solid var(--color-error-500)' : '1.5px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p style={{ color: 'var(--color-error-600)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'var(--font-sans)' }}>
                      <AlertCircle style={{ width: 12, height: 12 }} /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <Label htmlFor="password" style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>Password</Label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--color-text-tertiary)' }} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem', height: '2.75rem', fontFamily: 'var(--font-sans)', border: errors.password ? '2px solid var(--color-error-500)' : '1.5px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)' }}
                  >
                    {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                  </button>
                  {errors.password && (
                    <p style={{ color: 'var(--color-error-600)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'var(--font-sans)' }}>
                      <AlertCircle style={{ width: 12, height: 12 }} /> {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Remember Me */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember" style={{ fontSize: '0.85rem', fontFamily: 'var(--font-sans)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                  Remember me
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                style={{ width: '100%', height: '2.875rem', backgroundColor: 'var(--color-primary-600)', color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.95rem', borderRadius: 'var(--radius-md)', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {isLoading ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    Logging in...
                  </>
                ) : 'Log In'}
              </Button>

              {/* Register link */}
              <p style={{ textAlign: 'center', fontSize: '0.875rem', fontFamily: 'var(--font-sans)', color: 'var(--color-text-secondary)', margin: 0 }}>
                {"Don't have an account? "}
                <button
                  type="button"
                  onClick={onShowRegister}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary-600)', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)', textDecoration: 'underline', fontSize: '0.875rem' }}
                >
                  Register
                </button>
              </p>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
