import type { Chapter } from "@/types/chapter";

type ChapterLoader = () => Promise<{ default: Chapter }>;

export const jsChapters: Record<string, ChapterLoader> = {
  "01-var-let-const": () => import("./01-var-let-const"),
  "02-data-types": () => import("./02-data-types"),
  "03-operators": () => import("./03-operators"),
  "04-type-coercion": () => import("./04-type-coercion"),
  "05-control-flow": () => import("./05-control-flow"),
  "06-function-definition": () => import("./06-function-definition"),
  "07-first-class-object": () => import("./07-first-class-object"),
  "08-arrow-function": () => import("./08-arrow-function"),
  "09-scope": () => import("./09-scope"),
  "10-lexical-scope": () => import("./10-lexical-scope"),
  "11-execution-context": () => import("./11-execution-context"),
  "12-closure": () => import("./12-closure"),
};
