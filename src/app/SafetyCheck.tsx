// Ultra-minimal safety check component
// This should ALWAYS render if React is working

export default function SafetyCheck() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1.5rem',
      backgroundColor: '#eff6ff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        padding: '3rem',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        maxWidth: '700px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 1.5rem',
          backgroundColor: '#10b981',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem'
        }}>
          ✓
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '1rem'
        }}>
          CodeLearn AI
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: '#2563eb',
          marginBottom: '0.5rem',
          fontWeight: '600'
        }}>
          ✅ Build System Working!
        </p>

        <p style={{
          color: '#6b7280',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          If you see this message, React is rendering correctly.
          <br />
          The preview system is functional.
        </p>

        <div style={{
          backgroundColor: '#f0fdf4',
          border: '2px solid #86efac',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          textAlign: 'left'
        }}>
          <h3 style={{
            color: '#15803d',
            fontWeight: '600',
            marginBottom: '0.75rem',
            fontSize: '1.125rem'
          }}>
            System Status:
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            color: '#166534',
            fontSize: '0.875rem',
            lineHeight: '1.8'
          }}>
            <li>✓ React: Loaded</li>
            <li>✓ Component: Rendering</li>
            <li>✓ JavaScript: Executing</li>
            <li>✓ Styles: Applied</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'left'
        }}>
          <h3 style={{
            color: '#92400e',
            fontWeight: '600',
            marginBottom: '0.75rem',
            fontSize: '1.125rem'
          }}>
            Next Steps:
          </h3>
          <ol style={{
            paddingLeft: '1.25rem',
            margin: 0,
            color: '#78350f',
            fontSize: '0.875rem',
            lineHeight: '1.8'
          }}>
            <li>Open browser console (F12)</li>
            <li>Check for any error messages</li>
            <li>Look for the full App.tsx to load</li>
            <li>If this stays, check entrypoint file</li>
          </ol>
        </div>
      </div>

      <p style={{
        fontSize: '0.875rem',
        color: '#9ca3af',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        This is a safety check component. If you see this instead of the main app,
        check <code style={{
          backgroundColor: '#f3f4f6',
          padding: '0.125rem 0.375rem',
          borderRadius: '4px',
          fontFamily: 'monospace'
        }}>__figma__entrypoint__.ts</code> to verify it's importing the correct component.
      </p>
    </div>
  );
}
