import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Subject } from "@/types/chapter";
import type { AppProgress } from "@/types/progress";
import { hasChapter } from "@/content/chapters";

interface RoadmapCardProps {
  group: string;
  chapters: string[];
  subject: Subject;
  progress: AppProgress;
  index: number;
}

type ChapterStatus = "completed" | "in-progress" | "locked";

function getChapterStatus(chapterId: string, _subject: Subject, progress: AppProgress): ChapterStatus {
  const chapterProgress = progress.chapters[chapterId];
  if (chapterProgress?.isRead) return "completed";
  if (chapterProgress) return "in-progress";
  return "locked";
}

const statusStyles: Record<ChapterStatus, string> = {
  completed: "bg-indigo-50 text-indigo-600",
  "in-progress": "bg-orange-50 text-orange-600",
  locked: "bg-zinc-100 text-zinc-400",
};

const dotStyles: Record<ChapterStatus, string> = {
  completed: "bg-indigo-500",
  "in-progress": "bg-orange-500",
  locked: "bg-zinc-300",
};

export default function RoadmapCard({ group, chapters, subject, progress, index }: RoadmapCardProps) {
  const completedCount = chapters.filter((id) => progress.chapters[id]?.isRead).length;
  const progressPercent = chapters.length > 0 ? Math.round((completedCount / chapters.length) * 100) : 0;
  const isFullyLocked = completedCount === 0 && index > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`rounded-xl bg-white p-4 shadow-sm ${isFullyLocked ? "opacity-50" : ""}`}
    >
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900">{group}</h3>
        <span className="text-xs font-medium text-indigo-500">{completedCount}/{chapters.length}</span>
      </div>
      <div className="mb-3 h-[3px] rounded-full bg-zinc-100">
        <div className="h-[3px] rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
      </div>
      <div className="flex flex-wrap gap-2">
        {chapters.map((id) => {
          const status = getChapterStatus(id, subject, progress);
          const chapterExists = hasChapter(subject, id);
          const label = id.replace(/^\d+-/, "").replace(/-/g, " ");

          const pill = (
            <span key={id} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ${statusStyles[status]}`}>
              <span className={`size-1.5 rounded-full ${dotStyles[status]}`} />
              {label}
            </span>
          );

          if (chapterExists && status !== "locked") {
            return <Link key={id} to={`/chapter/${subject}/${id}`}>{pill}</Link>;
          }
          return pill;
        })}
      </div>
    </motion.div>
  );
}
