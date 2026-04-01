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
  "32-state-management-overview": () => import("./32-state-management-overview"),
  "33-context-api-advanced": () => import("./33-context-api-advanced"),
  "34-redux-toolkit-basics": () => import("./34-redux-toolkit-basics"),
  "35-redux-toolkit-advanced": () => import("./35-redux-toolkit-advanced"),
  "36-zustand": () => import("./36-zustand"),
  "37-state-management-comparison": () => import("./37-state-management-comparison"),
  "38-react-router-basics": () => import("./38-react-router-basics"),
  "39-react-router-advanced": () => import("./39-react-router-advanced"),
  "40-routing-patterns": () => import("./40-routing-patterns"),
  "41-data-fetching-patterns": () => import("./41-data-fetching-patterns"),
  "42-react-query": () => import("./42-react-query"),
  "43-react-query-advanced": () => import("./43-react-query-advanced"),
  "44-useoptimistic": () => import("./44-useoptimistic"),
  "45-swr-comparison": () => import("./45-swr-comparison"),
};
