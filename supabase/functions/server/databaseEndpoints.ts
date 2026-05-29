import { createClient } from 'npm:@supabase/supabase-js@2';
import type { Context } from 'npm:hono';

// Get all students from database
export async function getAllStudents(c: Context) {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return c.json({ success: false, error: error.message }, 400);
    }

    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
}

// Get single student by ID
export async function getStudentById(c: Context) {
  try {
    const { id } = c.req.param();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return c.json({ success: false, error: error.message }, 400);
    }

    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
}

// Create a new student
export async function createStudent(c: Context) {
  try {
    const body = await c.req.json();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data, error } = await supabase
      .from('students')
      .insert([{
        student_id: body.student_id,
        name: body.name,
        email: body.email,
        section: body.section || '',
        year_level: body.year_level || '',
        bio: body.bio || '',
        enrolled_courses: body.enrolled_courses || ['CCS108']
      }])
      .select()
      .single();

    if (error) {
      return c.json({ success: false, error: error.message }, 400);
    }

    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
}

// Update student
export async function updateStudent(c: Context) {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data, error } = await supabase
      .from('students')
      .update({
        name: body.name,
        section: body.section,
        year_level: body.year_level,
        bio: body.bio,
        total_lessons_completed: body.total_lessons_completed,
        total_quizzes_taken: body.total_quizzes_taken,
        average_score: body.average_score,
        total_time_spent: body.total_time_spent,
        streak_days: body.streak_days
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return c.json({ success: false, error: error.message }, 400);
    }

    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
}

// Delete student
export async function deleteStudent(c: Context) {
  try {
    const { id } = c.req.param();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) {
      return c.json({ success: false, error: error.message }, 400);
    }

    return c.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
}

// Test database connection
export async function testDatabaseConnection(c: Context) {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Try to count students
    const { count, error } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return c.json({
        success: false,
        error: error.message,
        message: 'Database connection failed'
      }, 400);
    }

    return c.json({
      success: true,
      message: 'Database connection successful',
      data: {
        table: 'students',
        record_count: count,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return c.json({
      success: false,
      error: String(error),
      message: 'Database connection test failed'
    }, 500);
  }
}
