import type { Subject } from "./chapter";

export interface QuizScore {
  correct: number;
  total: number;
  answeredAt: number;
}

export interface ChapterProgress {
  chapterId: string;
  subject: Subject;
  isRead: boolean;
  checklistCompleted: boolean[];
  quizScore?: QuizScore;
}

export interface QuizProgress {
  quizId: string;
  subject: Subject;
  score: QuizScore;
}

export interface AppProgress {
  chapters: Record<string, ChapterProgress>;
  quizzes: Record<string, QuizProgress>;
}
