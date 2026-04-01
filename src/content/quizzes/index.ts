import type { Subject } from "@/types/chapter";
import type { MidQuiz, FinalExam } from "@/types/quiz";

type MidQuizLoader = () => Promise<{ default: MidQuiz }>;
type FinalExamLoader = () => Promise<{ default: FinalExam }>;

const midQuizLoaders: Record<Subject, Record<string, MidQuizLoader>> = {
  js: {
    "mid-01": () => import("./js/mid/mid-01"),
  },
  react: {},
  next: {},
  cs: {},
  network: {},
  infra: {},
  typescript: {},
};

const finalExamLoaders: Record<Subject, FinalExamLoader | null> = {
  js: () => import("./js/final"),
  react: null,
  next: null,
  cs: null,
  network: null,
  infra: null,
  typescript: null,
};

export async function loadMidQuiz(subject: Subject, id: string): Promise<MidQuiz | null> {
  const loader = midQuizLoaders[subject]?.[id];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}

export async function loadFinalExam(subject: Subject): Promise<FinalExam | null> {
  const loader = finalExamLoaders[subject];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}
