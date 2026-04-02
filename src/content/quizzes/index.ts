import type { Subject } from "@/types/chapter";
import type { MidQuiz, FinalExam } from "@/types/quiz";

type MidQuizLoader = () => Promise<{ default: MidQuiz }>;
type FinalExamLoader = () => Promise<{ default: FinalExam }>;

const midQuizLoaders: Record<Subject, Record<string, MidQuizLoader>> = {
  js: {
    "mid-01": () => import("./js/mid/mid-01"),
    "mid-02": () => import("./js/mid/mid-02"),
    "mid-03": () => import("./js/mid/mid-03"),
    "mid-04": () => import("./js/mid/mid-04"),
    "mid-05": () => import("./js/mid/mid-05"),
  },
  react: {
    "mid-01": () => import("./react/mid/mid-01"),
    "mid-02": () => import("./react/mid/mid-02"),
    "mid-03": () => import("./react/mid/mid-03"),
    "mid-04": () => import("./react/mid/mid-04"),
    "mid-05": () => import("./react/mid/mid-05"),
    "mid-06": () => import("./react/mid/mid-06"),
  },
  next: {
    "mid-01": () => import("./next/mid/mid-01"),
    "mid-02": () => import("./next/mid/mid-02"),
    "mid-03": () => import("./next/mid/mid-03"),
    "mid-04": () => import("./next/mid/mid-04"),
  },
  cs: {},
  network: {},
  infra: {},
  typescript: {
    "mid-01": () => import("./typescript/mid/mid-01"),
    "mid-02": () => import("./typescript/mid/mid-02"),
    "mid-03": () => import("./typescript/mid/mid-03"),
    "mid-04": () => import("./typescript/mid/mid-04"),
  },
};

const finalExamLoaders: Record<Subject, FinalExamLoader | null> = {
  js: () => import("./js/final"),
  react: () => import("./react/final"),
  next: () => import("./next/final"),
  cs: null,
  network: null,
  infra: null,
  typescript: () => import("./typescript/final"),
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
