import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Subject } from "@/types/chapter";
import type { AppProgress } from "@/types/progress";
import type { MidQuizDef } from "@/content/roadmap";

interface MidQuizBannerProps {
  quiz: MidQuizDef;
  subject: Subject;
  progress: AppProgress;
  allChaptersInGroups: string[];
  index: number;
}

export default function MidQuizBanner({ quiz, subject, progress, allChaptersInGroups, index }: MidQuizBannerProps) {
  const allComplete = allChaptersInGroups.every((id) => progress.chapters[id]?.isRead);
  const quizDone = !!progress.quizzes[quiz.id];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.3 }}>
      {allComplete ? (
        <Link to={`/quiz/mid/${subject}/${quiz.id}`} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm border-l-[3px] border-yellow-400 transition hover:shadow-md">
          <span className="text-lg">{quizDone ? "✅" : "🏆"}</span>
          <div>
            <p className="text-xs font-semibold text-zinc-900">{quiz.title}</p>
            <p className="text-[10px] text-zinc-500">
              {quizDone ? `${progress.quizzes[quiz.id].score.correct}/${progress.quizzes[quiz.id].score.total}점` : quiz.coverGroups.join(" + ")}
            </p>
          </div>
        </Link>
      ) : (
        <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm border-l-[3px] border-zinc-200 opacity-50">
          <span className="text-lg">🔒</span>
          <div>
            <p className="text-xs font-semibold text-zinc-900">{quiz.title}</p>
            <p className="text-[10px] text-zinc-500">잠김</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
