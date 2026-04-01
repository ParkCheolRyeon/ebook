import { useState, useEffect } from "react";
import type { Chapter, Subject } from "@/types/chapter";
import { loadChapter } from "@/content/chapters";
import { roadmaps } from "@/content/roadmap";

export function useChapter(subject: Subject, id: string) {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadChapter(subject, id)
      .then(setChapter)
      .finally(() => setLoading(false));
  }, [subject, id]);

  return { chapter, loading };
}

export function getAdjacentChapters(
  subject: Subject,
  currentId: string,
): { prev: string | null; next: string | null } {
  const groups = roadmaps[subject];
  const allChapterIds = groups.flatMap((g) => g.chapters);
  const currentIndex = allChapterIds.indexOf(currentId);

  return {
    prev: currentIndex > 0 ? allChapterIds[currentIndex - 1] : null,
    next: currentIndex < allChapterIds.length - 1 ? allChapterIds[currentIndex + 1] : null,
  };
}

export function getChapterTitle(_subject: Subject, id: string): string {
  return id.replace(/^\d+-/, "").replace(/-/g, " ");
}
