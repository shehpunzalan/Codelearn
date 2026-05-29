import React, { useState } from 'react';

// Minimal App to test rendering
function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
      backgroundColor: 'var(--color-background-secondary, #f9fafb)',
      fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
      padding: '2rem'
    }}>
      <div style={{
        padding: '2rem',
        backgroundColor: 'var(--color-background-primary, white)',
        borderRadius: 'var(--radius-lg, 12px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'var(--color-primary-600, #2563eb)',
          marginBottom: '1rem'
        }}>
          CodeLearn AI
        </h1>

        <p style={{
          color: 'var(--color-text-secondary, #6b7280)',
          marginBottom: '1.5rem',
          fontSize: '1rem'
        }}>
          App is rendering successfully!
        </p>

        <div style={{
          padding: '1rem',
          backgroundColor: 'var(--color-primary-50, #eff6ff)',
          borderRadius: 'var(--radius-md, 8px)',
          marginBottom: '1.5rem'
        }}>
          <p style={{
            color: 'var(--color-primary-700, #1d4ed8)',
            fontSize: '0.875rem',
            marginBottom: '0.5rem'
          }}>
            <strong>Status:</strong> ✅ React working
          </p>
          <p style={{
            color: 'var(--color-primary-700, #1d4ed8)',
            fontSize: '0.875rem',
            marginBottom: '0.5rem'
          }}>
            <strong>CSS Variables:</strong> ✅ Loaded
          </p>
          <p style={{
            color: 'var(--color-primary-700, #1d4ed8)',
            fontSize: '0.875rem'
          }}>
            <strong>Counter:</strong> {count}
          </p>
        </div>

        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--color-primary-600, #2563eb)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md, 8px)',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-700, #1d4ed8)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-600, #2563eb)';
          }}
        >
          Click to Test ({count})
        </button>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: 'var(--color-success-50, #f0fdf4)',
          borderRadius: 'var(--radius-md, 8px)',
          border: '2px solid var(--color-success-200, #bbf7d0)'
        }}>
          <p style={{
            color: 'var(--color-success-700, #15803d)',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            ✓ Design System Variables Active
          </p>
          <p style={{
            color: 'var(--color-success-600, #16a34a)',
            fontSize: '0.75rem',
            marginTop: '0.5rem'
          }}>
            Using CSS custom properties from /src/styles/globals.css
          </p>
        </div>
      </div>

      <div style={{
        padding: '1rem',
        backgroundColor: 'var(--color-background-primary, white)',
        borderRadius: 'var(--radius-md, 8px)',
        maxWidth: '600px',
        fontSize: '0.875rem',
        color: 'var(--color-text-secondary, #6b7280)'
      }}>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>Next Steps:</strong>
        </p>
        <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
          <li>If you see this, the app is rendering correctly</li>
          <li>Check browser console for any errors</li>
          <li>The full app will load once issues are resolved</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
