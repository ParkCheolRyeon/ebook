import type { Subject } from "@/types/chapter";
import { useProgress } from "@/hooks/useProgress";
interface ChecklistProps { chapterId: string; subject: Subject; items: string[]; }
export default function Checklist({ chapterId, subject, items }: ChecklistProps) {
  const { progress, setChecklist } = useProgress();
  const chapterProgress = progress.chapters[chapterId];
  const completed = chapterProgress?.checklistCompleted ?? items.map(() => false);
  function toggle(index: number) {
    const next = [...completed];
    while (next.length < items.length) next.push(false);
    next[index] = !next[index];
    setChecklist(chapterId, subject, next);
  }
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <label key={i} className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-zinc-50 cursor-pointer">
          <input type="checkbox" checked={completed[i] ?? false} onChange={() => toggle(i)} className="size-4 shrink-0 rounded border-zinc-300 text-indigo-500 focus:ring-indigo-500" />
          <span className={`text-sm leading-6 ${completed[i] ? "text-zinc-400 line-through" : "text-zinc-700"}`}>{item}</span>
        </label>
      ))}
    </div>
  );
}
