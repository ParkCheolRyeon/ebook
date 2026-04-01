import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AppProgress, QuizScore } from "@/types/progress";
import type { Subject } from "@/types/chapter";
import {
  loadProgress,
  markChapterRead,
  updateChecklist,
  saveChapterQuizScore,
  saveQuizProgress,
  resetGroupProgress,
  resetSubjectProgress,
} from "@/lib/progress";

interface ProgressContextValue {
  progress: AppProgress;
  markRead: (chapterId: string, subject: Subject) => void;
  setChecklist: (chapterId: string, subject: Subject, items: boolean[]) => void;
  saveChapterQuiz: (chapterId: string, subject: Subject, score: QuizScore) => void;
  saveQuiz: (quizId: string, subject: Subject, score: QuizScore) => void;
  getSubjectStats: (subject: Subject, totalChapters: number) => { completed: number; total: number; percent: number };
  resetGroup: (subject: Subject, chapterIds: string[]) => void;
  resetSubject: (subject: Subject) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<AppProgress>(() => loadProgress());

  const markRead = useCallback((chapterId: string, subject: Subject) => {
    setProgress(markChapterRead(chapterId, subject));
  }, []);

  const setChecklist = useCallback((chapterId: string, subject: Subject, items: boolean[]) => {
    setProgress(updateChecklist(chapterId, subject, items));
  }, []);

  const saveChapterQuiz = useCallback((chapterId: string, subject: Subject, score: QuizScore) => {
    setProgress(saveChapterQuizScore(chapterId, subject, score));
  }, []);

  const saveQuiz = useCallback((quizId: string, subject: Subject, score: QuizScore) => {
    setProgress(saveQuizProgress(quizId, subject, score));
  }, []);

  const resetGroup = useCallback((subject: Subject, chapterIds: string[]) => {
    setProgress(resetGroupProgress(subject, chapterIds));
  }, []);

  const resetSubject = useCallback((subject: Subject) => {
    setProgress(resetSubjectProgress(subject));
  }, []);

  const getSubjectStats = useCallback((subject: Subject, totalChapters: number) => {
    const completed = Object.values(progress.chapters).filter(
      (ch) => ch.subject === subject && ch.isRead,
    ).length;
    const percent = totalChapters > 0 ? Math.round((completed / totalChapters) * 100) : 0;
    return { completed, total: totalChapters, percent };
  }, [progress]);

  return (
    <ProgressContext value={{ progress, markRead, setChecklist, saveChapterQuiz, saveQuiz, getSubjectStats, resetGroup, resetSubject }}>
      {children}
    </ProgressContext>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
