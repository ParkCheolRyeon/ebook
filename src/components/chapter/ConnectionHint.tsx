import { Link } from "react-router-dom";
import type { Subject } from "@/types/chapter";
interface ConnectionHintProps { prevChapterId: string | null; prevChapterTitle: string; nextChapterHint?: string; subject: Subject; }
export default function ConnectionHint({ prevChapterId, prevChapterTitle, nextChapterHint, subject }: ConnectionHintProps) {
  if (!prevChapterId && !nextChapterHint) return null;
  return (
    <div className="mb-6 rounded-lg bg-indigo-50 px-4 py-3">
      {prevChapterId && (<p className="text-xs text-indigo-600">💡 이전 챕터{" "}<Link to={`/chapter/${subject}/${prevChapterId}`} className="font-medium underline">{prevChapterTitle}</Link>에서 이어지는 내용입니다</p>)}
      {nextChapterHint && (<p className="mt-1 text-xs text-indigo-500">→ 이 챕터를 학습하면 다음으로 자연스럽게 이어집니다</p>)}
    </div>
  );
}
