import type { Chapter, Subject } from "@/types/chapter";
import { jsChapters } from "./js";
import { reactChapters } from "./react";
import { nextChapters } from "./next";
import { typescriptChapters } from "./typescript";

type ChapterLoader = () => Promise<{ default: Chapter }>;

const chapterLoaders: Record<Subject, Record<string, ChapterLoader>> = {
  js: jsChapters,
  react: reactChapters,
  next: nextChapters,
  cs: {},
  network: {},
  infra: {},
  typescript: typescriptChapters,
};

export async function loadChapter(subject: Subject, id: string): Promise<Chapter | null> {
  const subjectChapters = chapterLoaders[subject];
  const loader = subjectChapters?.[id];
  if (!loader) return null;

  const mod = await loader();
  return mod.default;
}

export function hasChapter(subject: Subject, id: string): boolean {
  return !!chapterLoaders[subject]?.[id];
}
