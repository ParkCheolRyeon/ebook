import type { Chapter } from "@/types/chapter";

type ChapterLoader = () => Promise<{ default: Chapter }>;

export const jsChapters: Record<string, ChapterLoader> = {
  "01-var-let-const": () => import("./01-var-let-const"),
};
