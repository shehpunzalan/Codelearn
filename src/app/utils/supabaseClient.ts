// Direct Supabase REST API calls — no SDK dependency, more reliable in all environments

const PROJECT_URL = 'https://hoofdryqutuucipuqxca.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdmVkcnlxdXR1dWNpcHVxeGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjI2MTIsImV4cCI6MjA5NTQzODYxMn0.KCiq9UdAV83MdMlWEiMWoP-JsxsRnJW4M2z_XJNJnW0';

async function supabaseAuthSignUp(email: string, password: string, metadata: Record<string, any>): Promise<{ userId: string | null; error: string | null }> {
  try {
    const res = await fetch(`${PROJECT_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({ email, password, data: metadata }),
    });

    const text = await res.text();
    let json: any = null;
    try { json = JSON.parse(text); } catch { /* non-JSON */ }

    if (!res.ok) {
      const msg = json?.msg || json?.message || json?.error_description || json?.error || `HTTP ${res.status}`;
      console.error('❌ Supabase signup error:', msg);
      return { userId: null, error: msg };
    }

    const userId = json?.id || json?.user?.id || null;
    console.log('✅ Supabase signup success, userId:', userId);
    return { userId, error: null };
  } catch (err: unknown) {
    const msg = String(err);
    console.error('❌ Supabase signup fetch error:', msg);
    return { userId: null, error: msg };
  }
}

async function supabaseAuthSignIn(email: string, password: string): Promise<any> {
  const res = await fetch(`${PROJECT_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text();
  let json: any = null;
  try { json = JSON.parse(text); } catch { /* non-JSON */ }

  if (!res.ok) {
    throw new Error(json?.error_description || json?.msg || json?.error || `HTTP ${res.status}`);
  }
  return json;
}

export async function registerStudentInSupabase(data: {
  email: string;
  password: string;
  name: string;
  studentId?: string;
  section?: string;
  yearLevel?: string;
}): Promise<{ userId: string | null; error: string | null }> {
  return supabaseAuthSignUp(data.email, data.password, {
    name: data.name,
    role: 'student',
    studentId: data.studentId || '',
    section: data.section || '',
    yearLevel: data.yearLevel || '1st Year',
    enrolledCourses: ['CCS108'],
    registeredAt: new Date().toISOString(),
  });
}

export async function registerInstructorInSupabase(data: {
  email: string;
  password: string;
  name: string;
  department?: string;
}): Promise<{ userId: string | null; error: string | null }> {
  return supabaseAuthSignUp(data.email, data.password, {
    name: data.name,
    role: 'instructor',
    department: data.department || '',
    registeredAt: new Date().toISOString(),
  });
}

export async function signInWithSupabase(email: string, password: string) {
  return supabaseAuthSignIn(email, password);
}

// Legacy stubs — no longer used
export const supabase = null;
export async function saveStudentToSupabase(_d: any) {}
export async function saveInstructorToSupabase(_d: any) {}
export async function fetchStudentsFromSupabase() { return []; }
export async function fetchInstructorsFromSupabase() { return []; }
