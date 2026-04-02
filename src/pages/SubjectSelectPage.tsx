import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Subject } from "@/types/chapter";
import { roadmaps, getTotalChapters } from "@/content/roadmap";
import { useProgress } from "@/hooks/useProgress";

interface SubjectCard {
  key: Subject;
  label: string;
  description: string;
  icon: string;
  available: boolean;
}

const subjects: SubjectCard[] = [
  { key: "js", label: "JavaScript", description: "모던 자바스크립트 Deep Dive", icon: "🟨", available: true },
  { key: "react", label: "React", description: "컴포넌트 기반 UI 라이브러리", icon: "⚛️", available: true },
  { key: "next", label: "Next.js", description: "풀스택 React 프레임워크", icon: "▲", available: true },
  { key: "typescript", label: "TypeScript", description: "타입 시스템과 고급 패턴", icon: "🔷", available: true },
  { key: "cs", label: "CS 기초", description: "컴퓨터 과학 핵심 개념", icon: "🖥️", available: false },
  { key: "network", label: "네트워크", description: "HTTP, TCP/IP, 웹 통신", icon: "🌐", available: false },
  { key: "infra", label: "인프라", description: "배포, CI/CD, 클라우드", icon: "☁️", available: false },
];

export default function SubjectSelectPage() {
  const { getSubjectStats } = useProgress();

  return (
    <div className="min-h-[100dvh] bg-[#fafafa]">
      <div className="px-4 pt-8 pb-4">
        <div className="mb-1">
          <p className="text-[13px] tracking-[4px] text-zinc-400 font-light uppercase">
            JavaScript
          </p>
          <h1 className="mt-1 text-[24px] font-bold tracking-tight text-zinc-900">
            Deep Dive
          </h1>
          <div className="mt-2 h-[3px] w-8 bg-zinc-900" />
        </div>
        <p className="mt-4 text-sm text-zinc-500">학습할 과목을 선택하세요</p>
      </div>

      <div className="px-4 pb-8">
        <div className="grid gap-3">
          {subjects.map((s, i) => {
            const total = getTotalChapters(s.key);
            const stats = total > 0 ? getSubjectStats(s.key, total) : null;
            const groups = roadmaps[s.key];
            const hasContent = groups.length > 0 && groups.some((g) => g.chapters.length > 0);

            if (!s.available || !hasContent) {
              return (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm opacity-40"
                >
                  <span className="text-2xl">{s.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-zinc-900">{s.label}</p>
                    <p className="text-xs text-zinc-400">{s.description}</p>
                  </div>
                  <span className="text-[10px] text-zinc-300 font-medium">준비 중</span>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Link
                  to={`/home/${s.key}`}
                  className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <span className="text-2xl">{s.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-zinc-900">{s.label}</p>
                    <p className="text-xs text-zinc-500">{s.description}</p>
                    {stats && stats.completed > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-[3px] flex-1 rounded-full bg-zinc-100">
                          <div
                            className="h-[3px] rounded-full bg-indigo-500 transition-all"
                            style={{ width: `${stats.percent}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-indigo-500">{stats.percent}%</span>
                      </div>
                    )}
                  </div>
                  <svg className="size-5 shrink-0 text-zinc-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
