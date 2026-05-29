// Simple test component to verify rendering works
export default function TestApp() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
      backgroundColor: '#f0f9ff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#2563eb',
          marginBottom: '1rem'
        }}>
          ✅ CodeLearn AI Loading...
        </h1>
        <p style={{
          color: '#6b7280',
          marginBottom: '1.5rem'
        }}>
          If you see this message, React is rendering correctly!
        </p>
        <div style={{
          padding: '1rem',
          backgroundColor: '#eff6ff',
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#1e40af'
        }}>
          <strong>Status:</strong> Test component active
          <br />
          <strong>React:</strong> Working
          <br />
          <strong>Styles:</strong> Applied
        </div>
      </div>
    </div>
  );
}
