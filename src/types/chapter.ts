export type Subject = "js" | "react" | "next" | "cs" | "network" | "infra" | "typescript";

const VALID_SUBJECTS: readonly string[] = ["js", "react", "next", "cs", "network", "infra", "typescript"];

export function isValidSubject(value: string): value is Subject {
  return VALID_SUBJECTS.includes(value);
}

export type SectionType =
  | "analogy"
  | "problem"
  | "solution"
  | "pseudocode"
  | "practice"
  | "summary"
  | "checklist";

export interface CodeBlock {
  language: "typescript" | "javascript";
  code: string;
  description?: string;
}

export interface ChapterSection {
  type: SectionType;
  title: string;
  content: string;
  code?: CodeBlock;
}

export interface Chapter {
  id: string;
  subject: Subject;
  title: string;
  description: string;
  order: number;
  group: string;
  prerequisites: string[];
  estimatedMinutes: number;
  sections: ChapterSection[];
  checklist: string[];
  quiz: QuizQuestion[];
}

import type { QuizQuestion } from "./quiz";
export type { QuizQuestion };
