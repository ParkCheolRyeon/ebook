import { Link } from "react-router-dom";
import type { Subject } from "@/types/chapter";
interface ChapterNavProps { subject: Subject; prevId: string | null; nextId: string | null; }
export default function ChapterNav({ subject, prevId, nextId }: ChapterNavProps) {
  return (
    <nav className="mt-12 mb-8 flex items-stretch gap-3 border-t border-zinc-200 pt-8">
      {prevId ? (
        <Link to={`/chapter/${subject}/${prevId}`} className="group flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-zinc-200 px-4 py-4 transition hover:border-zinc-400 hover:bg-zinc-50">
          <svg className="size-5 shrink-0 text-zinc-400 transition group-hover:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          <div className="min-w-0"><p className="text-xs font-medium text-zinc-400">이전 챕터</p><p className="truncate text-sm font-medium text-zinc-700">{prevId.replace(/^\d+-/, "").replace(/-/g, " ")}</p></div>
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-zinc-100 px-4 py-4 opacity-40">
          <svg className="size-5 shrink-0 text-zinc-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          <p className="text-xs font-medium text-zinc-300">이전 챕터</p>
        </div>
      )}
      {nextId ? (
        <Link to={`/chapter/${subject}/${nextId}`} className="group flex min-w-0 flex-1 items-center justify-end gap-2 rounded-2xl border border-zinc-200 px-4 py-4 text-right transition hover:border-zinc-400 hover:bg-zinc-50">
          <div className="min-w-0"><p className="text-xs font-medium text-zinc-400">다음 챕터</p><p className="truncate text-sm font-medium text-zinc-700">{nextId.replace(/^\d+-/, "").replace(/-/g, " ")}</p></div>
          <svg className="size-5 shrink-0 text-zinc-400 transition group-hover:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 rounded-2xl border border-zinc-100 px-4 py-4 opacity-40">
          <p className="text-xs font-medium text-zinc-300">다음 챕터</p>
          <svg className="size-5 shrink-0 text-zinc-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
        </div>
      )}
    </nav>
  );
}
