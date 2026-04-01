import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { isValidSubject, type Subject } from "@/types/chapter";
import { useChapter, getAdjacentChapters } from "@/hooks/useChapter";
import { useProgress } from "@/hooks/useProgress";
import Spinner from "@/components/common/Spinner";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import QuizResult from "@/components/quiz/QuizResult";

export default function ChapterQuizPage() {
  const { subject: subjectParam, id } = useParams<{ subject: string; id: string }>();
  const navigate = useNavigate();

  if (!subjectParam || !isValidSubject(subjectParam)) {
    return <Navigate to="/home" replace />;
  }
  const subject: Subject = subjectParam;

  const { chapter, loading } = useChapter(subject, id!);
  const { saveChapterQuiz } = useProgress();
  const { next } = getAdjacentChapters(subject, id!);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!chapter || chapter.quiz.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-zinc-500">퀴즈를 찾을 수 없습니다.</p>
        <button onClick={() => navigate(-1)} className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600">
          돌아가기
        </button>
      </div>
    );
  }

  const questions = chapter.quiz;

  function handleAnswer(isCorrect: boolean) {
    const nextAnswers = [...answers, isCorrect];
    setAnswers(nextAnswers);
    if (currentIndex + 1 >= questions.length) {
      const correct = nextAnswers.filter(Boolean).length;
      saveChapterQuiz(chapter!.id, subject, { correct, total: questions.length, answeredAt: Date.now() });
      setFinished(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handleRetry() {
    setCurrentIndex(0);
    setAnswers([]);
    setFinished(false);
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-xl">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-600">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          챕터로 돌아가기
        </button>
        <h1 className="mb-6 text-xl font-bold text-zinc-900">{chapter.title} 퀴즈</h1>

        {finished ? (
          <QuizResult
            questions={questions}
            answers={answers}
            onRetry={handleRetry}
            onDone={() => navigate(next ? `/chapter/${subject}/${next}` : `/home`)}
            doneLabel={next ? "다음 챕터로" : "홈으로"}
          />
        ) : (
          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <QuizProgress current={currentIndex + 1} total={questions.length} />
            <AnimatePresence mode="wait">
              <QuizQuestion
                key={questions[currentIndex].id}
                question={questions[currentIndex]}
                onAnswer={handleAnswer}
              />
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
