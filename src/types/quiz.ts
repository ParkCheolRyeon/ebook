export interface QuizQuestion {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChapterQuiz {
  type: "chapter";
  chapterId: string;
  questions: QuizQuestion[];
}

export interface MidQuiz {
  type: "mid";
  id: string;
  title: string;
  coverGroups: string[];
  questions: QuizQuestion[];
}

export interface FinalExam {
  type: "final";
  id: "final-exam";
  title: string;
  questions: QuizQuestion[];
}

export type Quiz = ChapterQuiz | MidQuiz | FinalExam;
