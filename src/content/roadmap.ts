import type { Subject } from "@/types/chapter";

export interface RoadmapGroup {
  group: string;
  chapters: string[];
}

export interface MidQuizDef {
  id: string;
  title: string;
  afterGroup: string; // Placed after this group in the roadmap
  coverGroups: string[];
}

export const roadmaps: Record<Subject, RoadmapGroup[]> = {
  js: [
    { group: "기초", chapters: ["01-var-let-const", "02-data-types", "03-operators", "04-type-coercion", "05-control-flow"] },
    { group: "함수의 기본", chapters: ["06-function-definition", "07-first-class-object", "08-arrow-function"] },
    { group: "스코프와 실행 컨텍스트", chapters: ["09-scope", "10-lexical-scope", "11-execution-context", "12-closure"] },
    { group: "this와 객체", chapters: ["13-object-literal", "14-this-binding", "15-constructor", "16-prototype", "17-prototype-chain", "18-class"] },
    { group: "빌트인과 표준 객체", chapters: ["19-built-in-objects", "20-wrapper-objects", "21-array-hof", "22-map-set", "23-regexp", "24-string-number-math-date"] },
    { group: "비동기", chapters: ["25-event-loop", "26-callback-pattern", "27-promise", "28-async-await", "29-microtask-macrotask"] },
    { group: "이터러블과 제너레이터", chapters: ["30-iterable", "31-generator", "32-symbol"] },
    { group: "모듈과 환경", chapters: ["33-module-system", "34-strict-mode", "35-error-handling"] },
    { group: "메모리와 최적화", chapters: ["36-garbage-collection", "37-memory-leak", "38-debounce-throttle"] },
    { group: "브라우저와 DOM", chapters: ["39-dom-structure", "40-event-bubbling-capturing", "41-event-delegation", "42-browser-rendering"] },
    { group: "고급 패턴", chapters: ["43-proxy-reflect", "44-design-patterns", "45-functional-programming"] },
  ],
  react: [
    { group: "기초", chapters: ["01-what-is-react", "02-jsx", "03-components", "04-props", "05-state-usestate", "06-event-handling", "07-conditional-rendering-lists", "08-forms-actions"] },
    { group: "Hooks 심화", chapters: ["09-useeffect", "10-useref", "11-usememo-usecallback", "12-usereducer", "13-usecontext", "14-use-hook", "15-custom-hooks", "16-uselayouteffect", "17-usedeferred-usetransition", "18-stale-closure"] },
    { group: "렌더링 원리", chapters: ["19-virtual-dom-reconciliation", "20-fiber-architecture", "21-render-commit-phases", "22-batching", "23-suspense", "24-server-components"] },
    { group: "성능 최적화", chapters: ["25-understanding-rerender", "26-react-memo", "27-react-compiler", "28-code-splitting", "29-list-virtualization", "30-profiler-devtools", "31-rendering-optimization-patterns"] },
    { group: "상태 관리", chapters: ["32-state-management-overview", "33-context-api-advanced", "34-redux-toolkit-basics", "35-redux-toolkit-advanced", "36-zustand", "37-state-management-comparison"] },
    { group: "라우팅", chapters: ["38-react-router-basics", "39-react-router-advanced", "40-routing-patterns"] },
    { group: "데이터 페칭", chapters: ["41-data-fetching-patterns", "42-react-query", "43-react-query-advanced", "44-useoptimistic", "45-swr-comparison"] },
    { group: "테스팅", chapters: ["46-testing-fundamentals", "47-react-testing-library", "48-component-test-patterns", "49-hook-testing", "50-e2e-testing"] },
    { group: "설계 패턴과 아키텍처", chapters: ["51-component-design-principles", "52-compound-component", "53-render-props-hoc", "54-container-presentational", "55-error-boundary", "56-folder-structure", "57-large-scale-architecture", "58-react-ecosystem-future"] },
  ],
  next: [],
  cs: [],
  network: [],
  infra: [],
  typescript: [],
};

export const midQuizzes: Record<Subject, MidQuizDef[]> = {
  js: [
    { id: "mid-01", title: "중간 점검 1: 기초 ~ 스코프와 실행 컨텍스트", afterGroup: "스코프와 실행 컨텍스트", coverGroups: ["기초", "함수의 기본", "스코프와 실행 컨텍스트"] },
    { id: "mid-02", title: "중간 점검 2: this와 객체", afterGroup: "this와 객체", coverGroups: ["this와 객체"] },
    { id: "mid-03", title: "중간 점검 3: 빌트인 ~ 비동기", afterGroup: "비동기", coverGroups: ["빌트인과 표준 객체", "비동기"] },
    { id: "mid-04", title: "중간 점검 4: 이터러블 ~ 메모리", afterGroup: "메모리와 최적화", coverGroups: ["이터러블과 제너레이터", "모듈과 환경", "메모리와 최적화"] },
    { id: "mid-05", title: "중간 점검 5: 브라우저 ~ 고급 패턴", afterGroup: "고급 패턴", coverGroups: ["브라우저와 DOM", "고급 패턴"] },
  ],
  react: [
    { id: "mid-01", title: "중간 점검 1: 기초 ~ Hooks 심화", afterGroup: "Hooks 심화", coverGroups: ["기초", "Hooks 심화"] },
    { id: "mid-02", title: "중간 점검 2: 렌더링 원리", afterGroup: "렌더링 원리", coverGroups: ["렌더링 원리"] },
    { id: "mid-03", title: "중간 점검 3: 성능 최적화", afterGroup: "성능 최적화", coverGroups: ["성능 최적화"] },
    { id: "mid-04", title: "중간 점검 4: 상태 관리", afterGroup: "상태 관리", coverGroups: ["상태 관리"] },
    { id: "mid-05", title: "중간 점검 5: 라우팅 ~ 데이터 페칭", afterGroup: "데이터 페칭", coverGroups: ["라우팅", "데이터 페칭"] },
    { id: "mid-06", title: "중간 점검 6: 테스팅 ~ 설계 패턴", afterGroup: "설계 패턴과 아키텍처", coverGroups: ["테스팅", "설계 패턴과 아키텍처"] },
  ],
  next: [],
  cs: [],
  network: [],
  infra: [],
  typescript: [],
};

export function getTotalChapters(subject: Subject): number {
  return roadmaps[subject].reduce((sum, g) => sum + g.chapters.length, 0);
}
