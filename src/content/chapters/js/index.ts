import type { Chapter } from "@/types/chapter";

type ChapterLoader = () => Promise<{ default: Chapter }>;

export const jsChapters: Record<string, ChapterLoader> = {
  "01-var-let-const": () => import("./01-var-let-const"),
  "06-function-definition": () => import("./06-function-definition"),
  "07-first-class-object": () => import("./07-first-class-object"),
  "08-arrow-function": () => import("./08-arrow-function"),
};
