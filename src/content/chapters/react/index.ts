import type { Chapter } from "@/types/chapter";

type ChapterLoader = () => Promise<{ default: Chapter }>;

export const reactChapters: Record<string, ChapterLoader> = {
  "19-virtual-dom-reconciliation": () => import("./19-virtual-dom-reconciliation"),
  "20-fiber-architecture": () => import("./20-fiber-architecture"),
  "21-render-commit-phases": () => import("./21-render-commit-phases"),
  "22-batching": () => import("./22-batching"),
  "23-suspense": () => import("./23-suspense"),
  "24-server-components": () => import("./24-server-components"),
  "25-understanding-rerender": () => import("./25-understanding-rerender"),
  "26-react-memo": () => import("./26-react-memo"),
  "27-react-compiler": () => import("./27-react-compiler"),
  "28-code-splitting": () => import("./28-code-splitting"),
  "29-list-virtualization": () => import("./29-list-virtualization"),
  "30-profiler-devtools": () => import("./30-profiler-devtools"),
  "31-rendering-optimization-patterns": () => import("./31-rendering-optimization-patterns"),
};
