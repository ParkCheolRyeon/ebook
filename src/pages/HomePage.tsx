import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Subject } from "@/types/chapter";
import { roadmaps, midQuizzes, getTotalChapters } from "@/content/roadmap";
import { useProgress } from "@/hooks/useProgress";

import ProgressRing from "@/components/roadmap/ProgressRing";
import RoadmapCard from "@/components/roadmap/RoadmapCard";
import MidQuizBanner from "@/components/roadmap/MidQuizBanner";

const AVAILABLE_SUBJECTS: { key: Subject; label: string }[] = [
  { key: "js", label: "JavaScript" },
];

export default function HomePage() {
  const [subject, setSubject] = useState<Subject>("js");
  const { progress, getSubjectStats } = useProgress();
  const groups = roadmaps[subject];
  const midQuizList = midQuizzes[subject];
  const totalChapters = getTotalChapters(subject);
  const stats = getSubjectStats(subject, totalChapters);

  const midQuizAfterGroup = new Map(midQuizList.map((q) => [q.afterGroup, q]));

  function getChaptersInGroups(coverGroups: string[]): string[] {
    return groups.filter((g) => coverGroups.includes(g.group)).flatMap((g) => g.chapters);
  }

  let renderIndex = 0;

  return (
    <div className="min-h-[100dvh] bg-[#fafafa]">
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">학습 로드맵</h1>
            <p className="mt-0.5 text-xs text-zinc-500">{stats.completed} / {stats.total} 챕터 완료</p>
          </div>
          <ProgressRing percent={stats.percent} />
        </div>

        {AVAILABLE_SUBJECTS.length > 1 && (
          <div className="mt-4 flex gap-2">
            {AVAILABLE_SUBJECTS.map((s) => (
              <button key={s.key} type="button" onClick={() => setSubject(s.key)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${subject === s.key ? "bg-zinc-900 text-white" : "bg-white text-zinc-500 hover:bg-zinc-100"}`}>
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-8">
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {groups.map((group) => {
              const cardIndex = renderIndex++;
              const midQuiz = midQuizAfterGroup.get(group.group);
              const bannerIndex = midQuiz ? renderIndex++ : -1;

              return (
                <div key={group.group}>
                  <RoadmapCard group={group.group} chapters={group.chapters} subject={subject} progress={progress} index={cardIndex} />
                  {midQuiz && (
                    <div className="mt-3">
                      <MidQuizBanner quiz={midQuiz} subject={subject} progress={progress} allChaptersInGroups={getChaptersInGroups(midQuiz.coverGroups)} index={bannerIndex} />
                    </div>
                  )}
                </div>
              );
            })}
          </AnimatePresence>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: renderIndex * 0.05, duration: 0.3 }}>
            {stats.percent === 100 ? (
              <Link to={`/quiz/final/${subject}`} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border-l-[3px] border-indigo-500 transition hover:shadow-md">
                <span className="text-xl">🎓</span>
                <div>
                  <p className="text-sm font-bold text-zinc-900">최종 시험</p>
                  <p className="text-xs text-zinc-500">JavaScript 전 범위 총망라</p>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border-l-[3px] border-zinc-200 opacity-40">
                <span className="text-xl">🔒</span>
                <div>
                  <p className="text-sm font-bold text-zinc-900">최종 시험</p>
                  <p className="text-xs text-zinc-500">모든 챕터를 완료하면 해금됩니다</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

    </div>
  );
}
