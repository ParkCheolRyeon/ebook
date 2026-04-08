import type { Chapter } from "@/types/chapter";

type ChapterLoader = () => Promise<{ default: Chapter }>;

export const csChapters: Record<string, ChapterLoader> = {
  "01-array-linked-list": () => import("./01-array-linked-list"),
  "02-stack-queue": () => import("./02-stack-queue"),
  "03-hash-table": () => import("./03-hash-table"),
  "04-tree-graph": () => import("./04-tree-graph"),
  "05-time-space-complexity": () => import("./05-time-space-complexity"),
  "06-sorting": () => import("./06-sorting"),
  "07-searching": () => import("./07-searching"),
  "08-recursion-dp": () => import("./08-recursion-dp"),
  "09-process-thread": () => import("./09-process-thread"),
  "10-memory-management": () => import("./10-memory-management"),
  "11-file-system": () => import("./11-file-system"),
  "12-cpu-memory": () => import("./12-cpu-memory"),
  "13-cache-locality": () => import("./13-cache-locality"),
  "14-character-encoding": () => import("./14-character-encoding"),
  "15-creational-patterns": () => import("./15-creational-patterns"),
  "16-structural-patterns": () => import("./16-structural-patterns"),
  "17-behavioral-patterns": () => import("./17-behavioral-patterns"),
  "18-functional-patterns": () => import("./18-functional-patterns"),
  "19-clean-code": () => import("./19-clean-code"),
  "20-testing-strategy": () => import("./20-testing-strategy"),
  "21-architecture-principles": () => import("./21-architecture-principles"),
};
