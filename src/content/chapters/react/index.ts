import type { Chapter } from "@/types/chapter";

type ChapterLoader = () => Promise<{ default: Chapter }>;

export const reactChapters: Record<string, ChapterLoader> = {
  "01-what-is-react": () => import("./01-what-is-react"),
  "02-jsx": () => import("./02-jsx"),
  "03-components": () => import("./03-components"),
  "04-props": () => import("./04-props"),
  "05-state-usestate": () => import("./05-state-usestate"),
  "06-event-handling": () => import("./06-event-handling"),
  "07-conditional-rendering-lists": () => import("./07-conditional-rendering-lists"),
  "08-forms-actions": () => import("./08-forms-actions"),
};
