import type { AppProgress, QuizScore } from "@/types/progress";
import type { Subject } from "@/types/chapter";

const PROGRESS_KEY = "ebook-progress";

export function loadProgress(): AppProgress {
  const raw = localStorage.getItem(PROGRESS_KEY);
  if (!raw) return { chapters: {}, quizzes: {} };

  try {
    return JSON.parse(raw) as AppProgress;
  } catch {
    return { chapters: {}, quizzes: {} };
  }
}

function saveProgress(progress: AppProgress): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function markChapterRead(chapterId: string, subject: Subject): AppProgress {
  const progress = loadProgress();
  const existing = progress.chapters[chapterId];
  progress.chapters[chapterId] = {
    ...existing,
    chapterId,
    subject,
    isRead: true,
    checklistCompleted: existing?.checklistCompleted ?? [],
  };
  saveProgress(progress);
  return progress;
}

export function updateChecklist(
  chapterId: string,
  subject: Subject,
  checklistCompleted: boolean[],
): AppProgress {
  const progress = loadProgress();
  const existing = progress.chapters[chapterId];
  progress.chapters[chapterId] = {
    ...existing,
    chapterId,
    subject,
    isRead: existing?.isRead ?? false,
    checklistCompleted,
  };
  saveProgress(progress);
  return progress;
}

export function saveChapterQuizScore(
  chapterId: string,
  subject: Subject,
  score: QuizScore,
): AppProgress {
  const progress = loadProgress();
  const existing = progress.chapters[chapterId];
  progress.chapters[chapterId] = {
    ...existing,
    chapterId,
    subject,
    isRead: existing?.isRead ?? false,
    checklistCompleted: existing?.checklistCompleted ?? [],
    quizScore: score,
  };
  saveProgress(progress);
  return progress;
}

export function saveQuizProgress(
  quizId: string,
  subject: Subject,
  score: QuizScore,
): AppProgress {
  const progress = loadProgress();
  progress.quizzes[quizId] = { quizId, subject, score };
  saveProgress(progress);
  return progress;
}

export function resetGroupProgress(subject: Subject, chapterIds: string[]): AppProgress {
  const progress = loadProgress();
  for (const id of chapterIds) {
    delete progress.chapters[id];
  }
  // Also remove mid quizzes that cover this group's chapters
  for (const key of Object.keys(progress.quizzes)) {
    if (progress.quizzes[key].subject === subject) {
      // Keep quiz results unless they're specifically for these chapters
    }
  }
  saveProgress(progress);
  return progress;
}

export function resetSubjectProgress(subject: Subject): AppProgress {
  const progress = loadProgress();
  for (const [key, ch] of Object.entries(progress.chapters)) {
    if (ch.subject === subject) delete progress.chapters[key];
  }
  for (const [key, q] of Object.entries(progress.quizzes)) {
    if (q.subject === subject) delete progress.quizzes[key];
  }
  saveProgress(progress);
  return progress;
}

export function getSubjectProgress(
  subject: Subject,
  totalChapters: number,
): { completed: number; total: number; percent: number } {
  const progress = loadProgress();
  const completed = Object.values(progress.chapters).filter(
    (ch) => ch.subject === subject && ch.isRead,
  ).length;
  const percent = totalChapters > 0 ? Math.round((completed / totalChapters) * 100) : 0;
  return { completed, total: totalChapters, percent };
}
