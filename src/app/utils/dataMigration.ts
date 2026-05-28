// Data Migration Utility
// Exports localStorage data to formats compatible with databases

export interface ExportedData {
  users: any[];
  progress: any[];
  submissions: any[];
  quizzes: any[];
  notifications: any[];
  stats: any[];
  metadata: {
    exportDate: string;
    totalRecords: number;
    version: string;
  };
}

/**
 * Export all localStorage data to JSON
 * Can be imported into Supabase, Firebase, MySQL, etc.
 */
export function exportAllData(): ExportedData {
  const data: ExportedData = {
    users: [],
    progress: [],
    submissions: [],
    quizzes: [],
    notifications: [],
    stats: [],
    metadata: {
      exportDate: new Date().toISOString(),
      totalRecords: 0,
      version: '1.0'
    }
  };

  // Iterate through all localStorage items
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    const value = localStorage.getItem(key);
    if (!value) continue;

    try {
      const parsed = JSON.parse(value);

      // Categorize by key prefix
      if (key === 'currentUser' || key === 'registeredUsers') {
        if (Array.isArray(parsed)) {
          data.users.push(...parsed);
        } else {
          data.users.push(parsed);
        }
      } else if (key.startsWith('progress_')) {
        data.progress.push(parsed);
      } else if (key.startsWith('submissions_')) {
        if (Array.isArray(parsed)) {
          data.submissions.push(...parsed);
        } else {
          data.submissions.push(parsed);
        }
      } else if (key.startsWith('quiz_')) {
        data.quizzes.push(parsed);
      } else if (key.startsWith('notifications_')) {
        if (Array.isArray(parsed)) {
          data.notifications.push(...parsed);
        } else {
          data.notifications.push(parsed);
        }
      } else if (key.startsWith('stats_')) {
        data.stats.push(parsed);
      }
    } catch (error) {
      console.warn(`Failed to parse: ${key}`, error);
    }
  }

  // Calculate total records
  data.metadata.totalRecords =
    data.users.length +
    data.progress.length +
    data.submissions.length +
    data.quizzes.length +
    data.notifications.length +
    data.stats.length;

  return data;
}

/**
 * Export data as SQL INSERT statements (for MySQL/PostgreSQL)
 */
export function exportAsSQL(): string {
  const data = exportAllData();
  let sql = `-- CodeLearn AI Data Export\n`;
  sql += `-- Generated: ${data.metadata.exportDate}\n`;
  sql += `-- Total Records: ${data.metadata.totalRecords}\n\n`;

  // Users
  if (data.users.length > 0) {
    sql += `-- Users Table\n`;
    data.users.forEach(user => {
      sql += `INSERT INTO users (id, name, email, role, created_at) VALUES (\n`;
      sql += `  '${user.id}',\n`;
      sql += `  '${escapeSql(user.name)}',\n`;
      sql += `  '${escapeSql(user.email)}',\n`;
      sql += `  '${user.role}',\n`;
      sql += `  NOW()\n`;
      sql += `);\n\n`;
    });
  }

  // Progress
  if (data.progress.length > 0) {
    sql += `-- Student Progress\n`;
    data.progress.forEach(prog => {
      sql += `INSERT INTO student_progress (user_id, module_id, lesson_id, completed, score, attempts, time_spent) VALUES (\n`;
      sql += `  '${prog.userId}',\n`;
      sql += `  '${prog.moduleId}',\n`;
      sql += `  '${prog.lessonId}',\n`;
      sql += `  ${prog.completed},\n`;
      sql += `  ${prog.score || 0},\n`;
      sql += `  ${prog.attempts || 0},\n`;
      sql += `  ${prog.timeSpent || 0}\n`;
      sql += `);\n\n`;
    });
  }

  // Submissions
  if (data.submissions.length > 0) {
    sql += `-- Code Submissions\n`;
    data.submissions.forEach(sub => {
      sql += `INSERT INTO code_submissions (id, user_id, module_id, lesson_id, code, score, passed, created_at) VALUES (\n`;
      sql += `  '${sub.id}',\n`;
      sql += `  '${sub.userId}',\n`;
      sql += `  '${sub.moduleId}',\n`;
      sql += `  '${sub.lessonId}',\n`;
      sql += `  '${escapeSql(sub.code)}',\n`;
      sql += `  ${sub.score || 0},\n`;
      sql += `  ${sub.passed || false},\n`;
      sql += `  '${sub.timestamp}'\n`;
      sql += `);\n\n`;
    });
  }

  return sql;
}

/**
 * Export data for Supabase import
 */
export function exportForSupabase(): Record<string, any[]> {
  const data = exportAllData();

  return {
    user_profiles: data.users.map(u => ({
      user_id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      student_id: u.studentId || null,
      section: u.section || null,
      year_level: u.yearLevel || null
    })),
    student_progress: data.progress.map(p => ({
      user_id: p.userId,
      module_id: p.moduleId,
      lesson_id: p.lessonId,
      completed: p.completed,
      score: p.score,
      attempts: p.attempts,
      code: p.code,
      feedback: p.feedback,
      time_spent: p.timeSpent,
      last_attempt: p.lastAttempt
    })),
    code_submissions: data.submissions.map(s => ({
      id: s.id,
      user_id: s.userId,
      module_id: s.moduleId,
      lesson_id: s.lessonId,
      code: s.code,
      score: s.score,
      feedback: s.feedback,
      errors: s.errors,
      passed: s.passed,
      created_at: s.timestamp
    })),
    quiz_results: data.quizzes.map(q => ({
      user_id: q.userId,
      module_id: q.moduleId,
      lesson_id: q.lessonId,
      quiz_type: q.quizType || 'knowledge_check',
      score: q.score,
      total_questions: q.totalQuestions,
      answers: q.answers,
      passed: q.passed,
      created_at: q.timestamp
    })),
    notifications: data.notifications.map(n => ({
      user_id: n.userId,
      type: n.type,
      title: n.title,
      message: n.message,
      read: n.read,
      module_id: n.moduleId,
      lesson_id: n.lessonId,
      created_at: n.timestamp
    }))
  };
}

/**
 * Download exported data as JSON file
 */
export function downloadAsJSON() {
  const data = exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `codelearn-data-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Download exported data as SQL file
 */
export function downloadAsSQL() {
  const sql = exportAsSQL();
  const blob = new Blob([sql], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `codelearn-data-${new Date().toISOString().split('T')[0]}.sql`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Download exported data as CSV (for Excel/Sheets)
 */
export function downloadAsCSV() {
  const data = exportAllData();

  // Convert each table to CSV
  const csvFiles: Record<string, string> = {};

  // Users CSV
  if (data.users.length > 0) {
    csvFiles['users.csv'] = arrayToCSV(data.users, ['id', 'name', 'email', 'role']);
  }

  // Progress CSV
  if (data.progress.length > 0) {
    csvFiles['progress.csv'] = arrayToCSV(data.progress,
      ['userId', 'moduleId', 'lessonId', 'completed', 'score', 'attempts', 'timeSpent']
    );
  }

  // Submissions CSV
  if (data.submissions.length > 0) {
    csvFiles['submissions.csv'] = arrayToCSV(data.submissions,
      ['id', 'userId', 'moduleId', 'lessonId', 'score', 'passed', 'timestamp']
    );
  }

  // Create a zip-like structure (download multiple files)
  Object.entries(csvFiles).forEach(([filename, content]) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  });
}

// Helper: Escape SQL strings
function escapeSql(str: string): string {
  if (!str) return '';
  return str.replace(/'/g, "''").replace(/\n/g, '\\n');
}

// Helper: Convert array to CSV
function arrayToCSV(data: any[], columns: string[]): string {
  const header = columns.join(',');
  const rows = data.map(item => {
    return columns.map(col => {
      const value = item[col];
      if (value === null || value === undefined) return '';
      if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
      return value;
    }).join(',');
  });
  return [header, ...rows].join('\n');
}

/**
 * Get storage statistics
 */
export function getStorageStats() {
  const data = exportAllData();
  const sizeInBytes = new Blob([JSON.stringify(data)]).size;
  const sizeInKB = (sizeInBytes / 1024).toFixed(2);
  const sizeInMB = (sizeInBytes / 1024 / 1024).toFixed(2);

  return {
    totalRecords: data.metadata.totalRecords,
    users: data.users.length,
    progress: data.progress.length,
    submissions: data.submissions.length,
    quizzes: data.quizzes.length,
    notifications: data.notifications.length,
    stats: data.stats.length,
    sizeInBytes,
    sizeInKB,
    sizeInMB,
    exportDate: data.metadata.exportDate
  };
}
