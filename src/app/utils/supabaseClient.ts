import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey as string
);

const KV_TABLE = 'kv_store_aaa3a86f';

/** Save a student record directly to Supabase */
export async function saveStudentToSupabase(data: {
  userId: string;
  name: string;
  email: string;
  studentId?: string;
  section?: string;
  yearLevel?: string;
  registeredAt: string;
}) {
  const { error } = await supabase.from(KV_TABLE).upsert({
    key: `student_${data.userId}`,
    value: {
      type: 'student',
      userId: data.userId,
      name: data.name,
      email: data.email,
      studentId: data.studentId || '',
      section: data.section || '',
      yearLevel: data.yearLevel || '1st Year',
      enrolledCourses: ['CCS108'],
      registeredAt: data.registeredAt,
      role: 'student',
    },
  });
  if (error) throw error;
}

/** Save an instructor record directly to Supabase */
export async function saveInstructorToSupabase(data: {
  userId: string;
  name: string;
  email: string;
  department?: string;
  registeredAt: string;
}) {
  const { error } = await supabase.from(KV_TABLE).upsert({
    key: `instructor_${data.userId}`,
    value: {
      type: 'instructor',
      userId: data.userId,
      name: data.name,
      email: data.email,
      department: data.department || '',
      registeredAt: data.registeredAt,
      role: 'instructor',
    },
  });
  if (error) throw error;
}

/** Fetch all students from Supabase */
export async function fetchStudentsFromSupabase() {
  const { data, error } = await supabase
    .from(KV_TABLE)
    .select('key, value')
    .like('key', 'student_%');
  if (error) throw error;
  return (data || []).map((row: any) => row.value);
}

/** Fetch all instructors from Supabase */
export async function fetchInstructorsFromSupabase() {
  const { data, error } = await supabase
    .from(KV_TABLE)
    .select('key, value')
    .like('key', 'instructor_%');
  if (error) throw error;
  return (data || []).map((row: any) => row.value);
}
