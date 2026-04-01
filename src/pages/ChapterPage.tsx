import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { isValidSubject, type Subject } from "@/types/chapter";
import { useChapter, getAdjacentChapters } from "@/hooks/useChapter";
import { useProgress } from "@/hooks/useProgress";
import Spinner from "@/components/common/Spinner";
import SectionProgress from "@/components/chapter/SectionProgress";
import ConnectionHint from "@/components/chapter/ConnectionHint";
import SectionRenderer from "@/components/chapter/SectionRenderer";
import ChapterNav from "@/components/chapter/ChapterNav";
import Checklist from "@/components/chapter/Checklist";

export default function ChapterPage() {
  const { subject: subjectParam, id } = useParams<{ subject: string; id: string }>();
  const navigate = useNavigate();

  if (!subjectParam || !isValidSubject(subjectParam)) {
    return <Navigate to="/home" replace />;
  }
  const subject: Subject = subjectParam;

  const { chapter, loading } = useChapter(subject, id!);
  const { markRead } = useProgress();
  const { prev, next } = getAdjacentChapters(subject, id!);

  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setCurrentSection(0);
  }, [id]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // C2 fix: Mark as read when user scrolls to bottom
  useEffect(() => {
    if (!chapter || !bottomRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          markRead(chapter.id, chapter.subject);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [chapter, markRead]);

  // Track current section via IntersectionObserver
  const setSectionRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    sectionRefs.current[index] = el;
  }, []);

  useEffect(() => {
    const visibleSections = new Set<number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-section-index"));
          if (entry.isIntersecting) {
            visibleSections.add(index);
          } else {
            visibleSections.delete(index);
          }
        });
        if (visibleSections.size > 0) {
          setCurrentSection(Math.min(...visibleSections));
        }
      },
      { threshold: 0.1, rootMargin: "-80px 0px 0px 0px" },
    );
    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [chapter]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-zinc-500">챕터를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate("/home")}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
        >
          홈으로
        </button>
      </div>
    );
  }

  const nonChecklistSections = chapter.sections.filter((s) => s.type !== "checklist");

  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 border-b border-zinc-100 bg-white/90 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <Link to="/home" className="shrink-0 text-zinc-400 hover:text-zinc-600">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </Link>
              <h1 className="truncate text-sm font-semibold text-zinc-900">{chapter.title}</h1>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-xs text-zinc-400">
              <span>{chapter.estimatedMinutes}분</span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-500">{chapter.group}</span>
              <span>{currentSection + 1} / {nonChecklistSections.length}</span>
            </div>
          </div>
          <SectionProgress total={nonChecklistSections.length} current={currentSection} />
        </div>
      </header>

      <div className="px-4 pt-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
        <article className="mx-auto max-w-3xl">
          <ConnectionHint
            prevChapterId={prev}
            prevChapterTitle={prev ? prev.replace(/^\d+-/, "").replace(/-/g, " ") : ""}
            subject={subject}
          />

          {nonChecklistSections.map((section, i) => (
            <div key={i} ref={setSectionRef(i)} data-section-index={i}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <SectionRenderer section={section} />
              </motion.div>
            </div>
          ))}

          {chapter.checklist.length > 0 && (
            <div className="mb-10">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-lg">✅</span>
                <h2 className="text-lg font-bold text-zinc-900">학습 체크리스트</h2>
              </div>
              <Checklist chapterId={chapter.id} subject={chapter.subject} items={chapter.checklist} />
            </div>
          )}

          {chapter.quiz.length > 0 && (
            <Link
              to={`/quiz/chapter/${subject}/${id}`}
              className="mb-6 flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              <span>퀴즈 풀기</span>
              <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          )}

          <ChapterNav subject={subject} prevId={prev} nextId={next} />
          <div ref={bottomRef} />
        </article>
      </div>
    </div>
  );
}
