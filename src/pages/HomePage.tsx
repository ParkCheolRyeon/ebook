import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { isValidSubject, type Subject } from "@/types/chapter";
import { roadmaps, midQuizzes, getTotalChapters } from "@/content/roadmap";
import { useProgress } from "@/hooks/useProgress";
import ProgressRing from "@/components/roadmap/ProgressRing";
import RoadmapCard from "@/components/roadmap/RoadmapCard";
import MidQuizBanner from "@/components/roadmap/MidQuizBanner";

export default function HomePage() {
  const { subject: subjectParam } = useParams<{ subject: string }>();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!subjectParam || !isValidSubject(subjectParam)) {
    return <Navigate to="/home" replace />;
  }
  const subject: Subject = subjectParam;
  const { progress, getSubjectStats, resetGroup, resetSubject } = useProgress();
  const groups = roadmaps[subject];
  const midQuizList = midQuizzes[subject];
  const totalChapters = getTotalChapters(subject);
  const stats = getSubjectStats(subject, totalChapters);

  const midQuizAfterGroup = new Map(midQuizList.map((q) => [q.afterGroup, q]));

  function getChaptersInGroups(coverGroups: string[]): string[] {
    return groups.filter((g) => coverGroups.includes(g.group)).flatMap((g) => g.chapters);
  }

  function handleResetGroup(chapterIds: string[]) {
    resetGroup(subject, chapterIds);
  }

  function handleResetSubject() {
    resetSubject(subject);
    setShowResetConfirm(false);
  }

  let renderIndex = 0;

  return (
    <div className="min-h-[100dvh] bg-[#fafafa]">
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/home" className="text-zinc-400 hover:text-zinc-600">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">학습 로드맵</h1>
              <p className="mt-0.5 text-xs text-zinc-500">{stats.completed} / {stats.total} 챕터 완료</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {stats.completed > 0 && (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="rounded-lg p-2 text-zinc-300 transition hover:bg-zinc-100 hover:text-zinc-500"
                title="전체 학습 초기화"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                </svg>
              </button>
            )}
            <ProgressRing percent={stats.percent} />
          </div>
        </div>
      </div>

      {/* Reset confirmation modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-1 flex items-center gap-2">
                <svg className="size-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <h3 className="text-sm font-bold text-zinc-900">전체 초기화</h3>
              </div>
              <p className="mt-2 text-xs text-zinc-500 leading-5">
                모든 학습 진행률, 체크리스트, 퀴즈 결과가 초기화됩니다. 이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleResetSubject}
                  className="flex-1 rounded-xl bg-red-500 py-2.5 text-xs font-semibold text-white transition hover:bg-red-600"
                >
                  초기화
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 pb-8">
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {groups.map((group) => {
              const cardIndex = renderIndex++;
              const midQuiz = midQuizAfterGroup.get(group.group);
              const bannerIndex = midQuiz ? renderIndex++ : -1;

              return (
                <div key={group.group}>
                  <RoadmapCard group={group.group} chapters={group.chapters} subject={subject} progress={progress} index={cardIndex} onResetGroup={handleResetGroup} />
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
                  <p className="text-xs text-zinc-500">전 범위 총망라</p>
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
