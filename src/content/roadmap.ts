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
  react: [],
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
  react: [],
  next: [],
  cs: [],
  network: [],
  infra: [],
  typescript: [],
};

export function getTotalChapters(subject: Subject): number {
  return roadmaps[subject].reduce((sum, g) => sum + g.chapters.length, 0);
}
