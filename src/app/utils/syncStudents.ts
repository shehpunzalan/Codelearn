import * as backendApi from '../services/backendApi';
import { getAllProgress as getLocalProgress, getAllSubmissions as getLocalSubmissions, updateUserStats } from './storage';

/**
 * Fetches all registered user profiles from the backend KV store
 * and merges them into localStorage so the instructor dashboard
 * shows students/instructors registered on ANY device.
 */
export async function syncBackendStudentsToLocalStorage(): Promise<void> {
  try {
    // Backend stores all profiles with prefix "profile_<userId>"
    // The /analytics/students endpoint returns all of them
    const result = await backendApi.getAllStudentsAnalytics();
    const backendProfiles: any[] = result?.data || [];
    if (!Array.isArray(backendProfiles) || backendProfiles.length === 0) return;
    let local: any[] = [];
    try {
      local = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    } catch (_e: unknown) { local = []; }
    const localById = new Map(local.map((u: any) => [u.id, u]));
    let changed = false;
    for (const profile of backendProfiles) {
      const uid = profile.userId || profile.id;
      if (!uid) continue;
      if (!localById.has(uid)) {
        // New user from another device — add them
        localById.set(uid, {
          id: uid,
          name: profile.name || '',
          email: profile.email || '',
          role: profile.role || 'student',
          studentId: profile.studentId || '',
          department: profile.department || '',
          enrolledCourses: profile.role === 'student' ? ['CCS108'] : [],
          registeredAt: profile.createdAt || new Date().toISOString(),
          pendingSync: false,
        });
        changed = true;
      }
    }
    if (changed) {
      localStorage.setItem('registeredUsers', JSON.stringify(Array.from(localById.values())));
      // Notify instructor dashboards that new users arrived
      window.dispatchEvent(new CustomEvent('codelearn:userRegistered', { detail: null }));
    }
  } catch (_e: unknown) {
    // Backend unreachable — silently ignore
  }
}

/**
 * Pulls each known student's progress + submissions from the backend and
 * merges them into localStorage, so the instructor's dashboard (and CSV
 * export, AllStudentsView, StudentDetailView) reflect work done on any
 * device — not just the ones that have touched this particular browser.
 *
 * This mirrors syncBackendStudentsToLocalStorage() above, but for academic
 * records instead of the roster. It writes into the same localStorage keys
 * storage.ts already reads/writes, so no other code needs to change.
 */
export async function syncStudentProgressToLocalStorage(): Promise<void> {
  try {
    let local: any[] = [];
    try {
      local = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    } catch (_e: unknown) { local = []; }
    const students = local.filter((u: any) => u.role === 'student');
    if (students.length === 0) return;

    let anyChanged = false;

    await Promise.all(students.map(async (s: any) => {
      try {
        // --- Progress ---
        const progressRes = await backendApi.getAllProgress(s.id).catch(() => null);
        const remoteProgress: any[] = progressRes?.data || [];
        const existingLocal = getLocalProgress(s.id);
        const existingKeys = new Set(existingLocal.map((p: any) => `${p.moduleId}_${p.lessonId}`));

        for (const rp of remoteProgress) {
          if (!rp?.moduleId || !rp?.lessonId) continue;
          const dedupeKey = `${rp.moduleId}_${rp.lessonId}`;
          const localMatch = existingLocal.find(
            (p: any) => `${p.moduleId}_${p.lessonId}` === dedupeKey
          );
          // Only write if we don't already have this lesson locally, or the
          // remote copy is newer — avoids clobbering more recent local data
          // with a stale backend record.
          const remoteIsNewer =
            !localMatch ||
            new Date(rp.timestamp || rp.lastUpdated || 0).getTime() >
              new Date(localMatch.lastAttempt || 0).getTime();

          if (!existingKeys.has(dedupeKey) || remoteIsNewer) {
            const key = `progress_${s.id}_${rp.moduleId}_${rp.lessonId}`;
            localStorage.setItem(
              key,
              JSON.stringify({
                userId: s.id,
                moduleId: rp.moduleId,
                lessonId: rp.lessonId,
                completed: rp.completed ?? false,
                score: rp.score ?? 0,
                attempts: rp.attempts ?? 1,
                lastAttempt: rp.timestamp || rp.lastUpdated || new Date().toISOString(),
                code: rp.code || '',
                feedback: rp.feedback || '',
                timeSpent: rp.timeSpent ?? 0,
              })
            );
            anyChanged = true;
          }
        }

        // --- Submissions (quiz + code) ---
        const [quizRes, subRes] = await Promise.all([
          backendApi.getAllQuizzes(s.id).catch(() => null),
          backendApi.getSubmissionHistory(s.id).catch(() => null),
        ]);
        const remoteQuizzes: any[] = quizRes?.data || [];
        const remoteSubs: any[] = subRes?.data || [];
        const localSubs = getLocalSubmissions(s.id);
        const localSubIds = new Set(localSubs.map((sub: any) => sub.id));
        const merged = [...localSubs];

        for (const rq of [...remoteQuizzes, ...remoteSubs]) {
          const id = rq.id || `${rq.moduleId}_${rq.lessonId}_${rq.timestamp}`;
          if (localSubIds.has(id)) continue;
          merged.push({
            id,
            userId: s.id,
            moduleId: rq.moduleId,
            lessonId: rq.lessonId,
            code: rq.code || '',
            timestamp: rq.timestamp || new Date().toISOString(),
            score: rq.score ?? 0,
            feedback: rq.feedback || '',
            errors: rq.errors || [],
            passed: rq.passed ?? (rq.score >= 70),
          });
          localSubIds.add(id);
        }

        if (merged.length !== localSubs.length) {
          localStorage.setItem(`submissions_${s.id}`, JSON.stringify(merged));
          anyChanged = true;
        }

        // Recompute cached stats now that new records may have landed
        updateUserStats(s.id);
      } catch (_e: unknown) {
        // One student's sync failing shouldn't block the rest
      }
    }));

    if (anyChanged) {
      window.dispatchEvent(new CustomEvent('codelearn:userRegistered', { detail: null }));
    }
  } catch (_e: unknown) {
    // Backend unreachable — silently ignore, local data still shown
  }
}

/** Start polling the backend every 30 seconds for new registrations AND progress/submission updates */
export function startRegistrationPolling(): () => void {
  const runSync = () => {
    syncBackendStudentsToLocalStorage()
      .then(syncStudentProgressToLocalStorage)
      .catch(() => {});
  };
  runSync(); // Run immediately on start
  const intervalId = setInterval(runSync, 30_000);
  return () => clearInterval(intervalId);
}
