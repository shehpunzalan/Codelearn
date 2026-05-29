import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface TestResult {
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

interface ConnectionTestProps {
  onBack?: () => void;
}

export function ConnectionTest({ onBack }: ConnectionTestProps) {
  const [results, setResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const tests: TestResult[] = [];

    // Test 1: Health Check
    try {
      const response = await fetch('https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/health');
      const data = await response.json();
      tests.push({
        endpoint: '/health',
        status: response.ok ? 'success' : 'error',
        message: response.ok ? 'Backend is healthy' : 'Health check failed',
        data
      });
    } catch (error) {
      tests.push({
        endpoint: '/health',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 2: Create Test User
    const testEmail = `test_${Date.now()}@codelearn.ai`;
    const testPassword = 'TestPass123!';
    let userId = '';

    try {
      const response = await fetch('https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          name: 'Connection Test User',
          role: 'student'
        })
      });
      const data = await response.json();
      userId = data.data?.userId || '';
      tests.push({
        endpoint: '/auth/signup',
        status: response.ok && data.success ? 'success' : 'error',
        message: response.ok && data.success ? 'User created successfully' : data.error || 'Signup failed',
        data
      });
    } catch (error) {
      tests.push({
        endpoint: '/auth/signup',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 3: Sign In
    let accessToken = '';
    try {
      const response = await fetch('https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword
        })
      });
      const data = await response.json();
      accessToken = data.data?.accessToken || '';
      tests.push({
        endpoint: '/auth/signin',
        status: response.ok && data.success ? 'success' : 'error',
        message: response.ok && data.success ? 'Authentication successful' : data.error || 'Sign in failed',
        data: data.success ? { userId: data.data?.userId, hasToken: !!accessToken } : data
      });
    } catch (error) {
      tests.push({
        endpoint: '/auth/signin',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 4: Save Progress
    if (userId) {
      try {
        const response = await fetch('https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            moduleId: 'test_module',
            lessonId: 'test_lesson',
            completed: true,
            timeSpent: 120,
            score: 88
          })
        });
        const data = await response.json();
        tests.push({
          endpoint: '/progress (save)',
          status: response.ok && data.success ? 'success' : 'error',
          message: response.ok && data.success ? 'Progress saved successfully' : data.error || 'Save failed',
          data
        });
      } catch (error) {
        tests.push({
          endpoint: '/progress (save)',
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 5: Retrieve Progress
      try {
        const response = await fetch(`https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/progress/${userId}/test_module/test_lesson`);
        const data = await response.json();
        tests.push({
          endpoint: '/progress (retrieve)',
          status: response.ok && data.success && data.data ? 'success' : 'error',
          message: response.ok && data.success ? 'Progress retrieved successfully' : data.error || 'Retrieve failed',
          data
        });
      } catch (error) {
        tests.push({
          endpoint: '/progress (retrieve)',
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    setResults(tests);
    setTesting(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          style={{
            color: 'var(--color-primary-600)',
            backgroundColor: 'var(--color-background-secondary)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Settings
        </button>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Supabase Connection Test
        </h1>
        <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>
          Verify that your CodeLearn AI frontend is connected to the Supabase backend
        </p>
      </div>

      <button
        onClick={runTests}
        disabled={testing}
        className="px-6 py-3 rounded-lg font-medium mb-6 transition-colors"
        style={{
          backgroundColor: testing ? 'var(--color-neutral-200)' : 'var(--color-primary-500)',
          color: testing ? 'var(--color-text-secondary)' : 'white',
          cursor: testing ? 'not-allowed' : 'pointer',
          borderRadius: 'var(--radius-md)'
        }}
      >
        {testing ? 'Running Tests...' : 'Run Connection Tests'}
      </button>

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: 'var(--color-background-secondary)',
                borderColor: result.status === 'success'
                  ? 'var(--color-success-500)'
                  : result.status === 'error'
                  ? 'var(--color-error-500)'
                  : 'var(--color-neutral-300)',
                borderWidth: '2px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <code className="font-mono text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  {result.endpoint}
                </code>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: result.status === 'success'
                      ? 'var(--color-success-100)'
                      : result.status === 'error'
                      ? 'var(--color-error-100)'
                      : 'var(--color-neutral-200)',
                    color: result.status === 'success'
                      ? 'var(--color-success-700)'
                      : result.status === 'error'
                      ? 'var(--color-error-700)'
                      : 'var(--color-text-secondary)',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  {result.status}
                </span>
              </div>
              <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                {result.message}
              </p>
              {result.data && (
                <details className="mt-2">
                  <summary
                    className="cursor-pointer text-xs font-medium"
                    style={{ color: 'var(--color-primary-600)' }}
                  >
                    Show response data
                  </summary>
                  <pre
                    className="mt-2 p-3 overflow-auto text-xs rounded"
                    style={{
                      backgroundColor: 'var(--color-background-tertiary)',
                      color: 'var(--color-text-primary)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}

          <div
            className="p-4 rounded-lg mt-6"
            style={{
              backgroundColor: results.every(r => r.status === 'success')
                ? 'var(--color-success-50)'
                : 'var(--color-warning-50)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <h3
              className="font-bold mb-2"
              style={{
                color: results.every(r => r.status === 'success')
                  ? 'var(--color-success-700)'
                  : 'var(--color-warning-700)'
              }}
            >
              Test Summary
            </h3>
            <p
              className="text-sm"
              style={{
                color: results.every(r => r.status === 'success')
                  ? 'var(--color-success-600)'
                  : 'var(--color-warning-600)'
              }}
            >
              {results.filter(r => r.status === 'success').length} / {results.length} tests passed
              {results.every(r => r.status === 'success')
                ? ' ✅ Your frontend is fully connected to Supabase!'
                : ' ⚠️ Some tests failed - check the details above.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
