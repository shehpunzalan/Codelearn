import { useState } from 'react';
import { ArrowLeft, Database, Plus, RefreshCw, Trash2, Check, X } from 'lucide-react';

interface Student {
  id: string;
  student_id: string;
  name: string;
  email: string;
  section: string;
  year_level: string;
  bio: string;
  total_lessons_completed: number;
  average_score: number;
  created_at: string;
}

interface DatabaseTestProps {
  onBack?: () => void;
}

export function DatabaseTest({ onBack }: DatabaseTestProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [newStudent, setNewStudent] = useState({
    student_id: '',
    name: '',
    email: '',
    section: '',
    year_level: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const BASE_URL = 'https://hovedryqutuucipuqxca.supabase.co/functions/v1/server';

  // Test database connection
  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/db/test`);
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  // Load all students
  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/db/students`);
      const data = await response.json();
      if (data.success) {
        setStudents(data.data || []);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new student
  const createStudent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/db/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });
      const data = await response.json();
      if (data.success) {
        setNewStudent({ student_id: '', name: '', email: '', section: '', year_level: '' });
        setShowAddForm(false);
        await loadStudents();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating student:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete student
  const deleteStudent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/db/students/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await loadStudents();
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
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
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-8 h-8" style={{ color: 'var(--color-primary-600)' }} />
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Database Connection Test
          </h1>
        </div>
        <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>
          Test real Supabase PostgreSQL database connection and CRUD operations
        </p>
      </div>

      {/* Test Connection Button */}
      <div className="mb-6">
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          style={{
            backgroundColor: loading ? 'var(--color-neutral-200)' : 'var(--color-primary-600)',
            color: loading ? 'var(--color-text-secondary)' : 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <Database className="w-5 h-5" />
          {loading ? 'Testing...' : 'Test Database Connection'}
        </button>

        {testResult && (
          <div
            className="mt-4 p-4 rounded-lg border-2"
            style={{
              backgroundColor: testResult.success ? 'var(--color-success-50)' : 'var(--color-error-50)',
              borderColor: testResult.success ? 'var(--color-success-500)' : 'var(--color-error-500)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              {testResult.success ? (
                <Check className="w-5 h-5" style={{ color: 'var(--color-success-600)' }} />
              ) : (
                <X className="w-5 h-5" style={{ color: 'var(--color-error-600)' }} />
              )}
              <span
                className="font-semibold"
                style={{ color: testResult.success ? 'var(--color-success-700)' : 'var(--color-error-700)' }}
              >
                {testResult.message}
              </span>
            </div>
            {testResult.data && (
              <pre
                className="text-xs p-3 rounded overflow-auto"
                style={{
                  backgroundColor: 'var(--color-background-primary)',
                  color: 'var(--color-text-primary)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            )}
            {testResult.error && (
              <p className="text-sm mt-2" style={{ color: 'var(--color-error-600)' }}>
                Error: {testResult.error}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Load Students Section */}
      <div
        className="p-6 rounded-lg mb-6"
        style={{
          backgroundColor: 'var(--color-background-secondary)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Students Table
          </h2>
          <div className="flex gap-2">
            <button
              onClick={loadStudents}
              disabled={loading}
              className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              style={{
                backgroundColor: 'var(--color-primary-600)',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                borderRadius: 'var(--radius-md)',
                opacity: loading ? 0.6 : 1
              }}
            >
              <RefreshCw className="w-4 h-4" />
              Load Students
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              style={{
                backgroundColor: 'var(--color-success-600)',
                color: 'white',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <Plus className="w-4 h-4" />
              Add Student
            </button>
          </div>
        </div>

        {/* Add Student Form */}
        {showAddForm && (
          <div
            className="p-4 rounded-lg mb-4"
            style={{
              backgroundColor: 'var(--color-background-primary)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Add New Student
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="Student ID (e.g., ST-2026-001)"
                value={newStudent.student_id}
                onChange={(e) => setNewStudent({ ...newStudent, student_id: e.target.value })}
                className="px-3 py-2 rounded border"
                style={{
                  borderColor: 'var(--color-neutral-300)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-sans)'
                }}
              />
              <input
                type="text"
                placeholder="Name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className="px-3 py-2 rounded border"
                style={{
                  borderColor: 'var(--color-neutral-300)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-sans)'
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                className="px-3 py-2 rounded border"
                style={{
                  borderColor: 'var(--color-neutral-300)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-sans)'
                }}
              />
              <input
                type="text"
                placeholder="Section (e.g., CS-3A)"
                value={newStudent.section}
                onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                className="px-3 py-2 rounded border"
                style={{
                  borderColor: 'var(--color-neutral-300)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-sans)'
                }}
              />
              <input
                type="text"
                placeholder="Year Level"
                value={newStudent.year_level}
                onChange={(e) => setNewStudent({ ...newStudent, year_level: e.target.value })}
                className="px-3 py-2 rounded border col-span-2"
                style={{
                  borderColor: 'var(--color-neutral-300)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-sans)'
                }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={createStudent}
                disabled={loading || !newStudent.student_id || !newStudent.name || !newStudent.email}
                className="px-4 py-2 rounded-lg font-medium"
                style={{
                  backgroundColor: 'var(--color-success-600)',
                  color: 'white',
                  borderRadius: 'var(--radius-md)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                Create Student
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-lg font-medium"
                style={{
                  backgroundColor: 'var(--color-neutral-200)',
                  color: 'var(--color-text-primary)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Students List */}
        {students.length > 0 ? (
          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student.id}
                className="p-4 rounded-lg border flex items-center justify-between"
                style={{
                  backgroundColor: 'var(--color-background-primary)',
                  borderColor: 'var(--color-neutral-200)',
                  borderWidth: '1px',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div>
                  <h4 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {student.name}
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {student.student_id} • {student.email}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                    {student.section} • {student.year_level} • {student.total_lessons_completed} lessons • Avg: {student.average_score}%
                  </p>
                </div>
                <button
                  onClick={() => deleteStudent(student.id)}
                  disabled={loading}
                  className="p-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: 'var(--color-error-50)',
                    color: 'var(--color-error-600)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
            No students loaded. Click "Load Students" to fetch from database.
          </p>
        )}
      </div>

      {/* Instructions */}
      <div
        className="p-4 rounded-lg"
        style={{
          backgroundColor: 'var(--color-primary-50)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <h3 className="font-semibold mb-2" style={{ color: 'var(--color-primary-700)' }}>
          Database Test Instructions
        </h3>
        <ol className="text-sm space-y-1" style={{ color: 'var(--color-primary-600)', paddingLeft: '1.25rem' }}>
          <li>First, run the migration to create the table (see instructions below)</li>
          <li>Click "Test Database Connection" to verify connectivity</li>
          <li>Click "Load Students" to fetch all records from the database</li>
          <li>Use "Add Student" to insert new records</li>
          <li>Use the trash icon to delete records</li>
        </ol>
      </div>
    </div>
  );
}
