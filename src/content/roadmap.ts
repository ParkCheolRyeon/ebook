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
  next: [
    { group: "기초", chapters: ["01-what-is-nextjs", "02-project-setup", "03-file-based-routing", "04-layouts-and-templates", "05-navigation", "06-loading-error-ui"] },
    { group: "서버와 클라이언트", chapters: ["07-server-components", "08-client-components", "09-server-client-composition", "10-server-actions"] },
    { group: "데이터 페칭과 캐싱", chapters: ["11-data-fetching", "12-caching", "13-revalidation", "14-streaming-suspense"] },
    { group: "라우팅 심화", chapters: ["15-dynamic-routes", "16-route-groups-parallel", "17-intercepting-routes", "18-middleware", "19-internationalization"] },
    { group: "스타일링과 최적화", chapters: ["20-styling", "21-image-optimization", "22-font-optimization", "23-metadata-seo", "24-performance"] },
    { group: "인증과 보안", chapters: ["25-authentication", "26-authorization", "27-env-security"] },
    { group: "API와 백엔드", chapters: ["28-route-handlers", "29-database-integration", "30-external-api"] },
    { group: "테스팅과 배포", chapters: ["31-testing", "32-deployment"] },
    { group: "Pages Router", chapters: ["33-pages-router"] },
    { group: "아키텍처", chapters: ["34-large-scale-architecture", "35-migration-patterns"] },
  ],
  cs: [
    { group: "자료구조", chapters: ["01-array-linked-list", "02-stack-queue", "03-hash-table", "04-tree-graph"] },
    { group: "알고리즘 기초", chapters: ["05-time-space-complexity", "06-sorting", "07-searching", "08-recursion-dp"] },
    { group: "운영체제", chapters: ["09-process-thread", "10-memory-management", "11-file-system"] },
    { group: "컴퓨터 구조", chapters: ["12-cpu-memory", "13-cache-locality", "14-character-encoding"] },
    { group: "디자인 패턴", chapters: ["15-creational-patterns", "16-structural-patterns", "17-behavioral-patterns", "18-functional-patterns"] },
    { group: "소프트웨어 공학", chapters: ["19-clean-code", "20-testing-strategy", "21-architecture-principles"] },
  ],
  network: [
    { group: "네트워크 기초", chapters: ["01-osi-tcpip", "02-ip-port-dns", "03-tcp-udp"] },
    { group: "HTTP", chapters: ["04-http-basics", "05-http-methods-status", "06-http-headers", "07-https-tls"] },
    { group: "HTTP 진화", chapters: ["08-http2-http3", "09-rest-api"] },
    { group: "실시간 통신", chapters: ["10-websocket", "11-sse", "12-graphql"] },
    { group: "브라우저 네트워킹", chapters: ["13-cors", "14-cookie-session-token", "15-caching-strategy", "16-network-optimization"] },
    { group: "웹 보안", chapters: ["17-xss-csrf", "18-csp-security-headers", "19-authentication-oauth"] },
  ],
  infra: [
    { group: "Git 심화", chapters: ["01-git-workflow", "02-git-advanced", "03-code-review"] },
    { group: "패키지 관리", chapters: ["04-package-managers", "05-monorepo"] },
    { group: "빌드와 번들링", chapters: ["06-module-bundlers", "07-vite-deep-dive", "08-build-optimization"] },
    { group: "컨테이너", chapters: ["09-docker-basics", "10-dockerfile", "11-docker-compose"] },
    { group: "CI/CD", chapters: ["12-cicd-concepts", "13-github-actions"] },
    { group: "배포와 클라우드", chapters: ["14-deployment-platforms", "15-aws-basics", "16-cdn-edge"] },
    { group: "모니터링과 운영", chapters: ["17-monitoring", "18-devops-culture"] },
  ],
  typescript: [
    { group: "기초", chapters: ["01-what-is-typescript", "02-basic-types", "03-type-inference", "04-functions", "05-objects-and-interfaces", "06-type-alias-vs-interface"] },
    { group: "타입 좁히기", chapters: ["07-union-intersection", "08-type-narrowing", "09-discriminated-unions", "10-type-assertions"] },
    { group: "제네릭", chapters: ["11-generics-basics", "12-generic-constraints", "13-generic-patterns", "14-generic-inference"] },
    { group: "고급 타입", chapters: ["15-utility-types", "16-mapped-types", "17-conditional-types", "18-template-literal-types", "19-infer-keyword"] },
    { group: "타입 시스템 심화", chapters: ["20-structural-typing", "21-type-compatibility", "22-declaration-merging", "23-module-types"] },
    { group: "클래스와 OOP", chapters: ["24-classes", "25-abstract-classes", "26-decorators"] },
    { group: "React + TypeScript", chapters: ["27-react-component-types", "28-react-hooks-types", "29-react-event-types", "30-react-advanced-patterns"] },
    { group: "프로젝트 설정", chapters: ["31-tsconfig", "32-strict-mode"] },
    { group: "실전 패턴", chapters: ["33-error-handling-patterns", "34-api-type-patterns"] },
    { group: "아키텍처", chapters: ["35-type-driven-development"] },
  ],
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
  next: [
    { id: "mid-01", title: "중간 점검 1: 기초 ~ 서버와 클라이언트", afterGroup: "서버와 클라이언트", coverGroups: ["기초", "서버와 클라이언트"] },
    { id: "mid-02", title: "중간 점검 2: 데이터 페칭 ~ 라우팅 심화", afterGroup: "라우팅 심화", coverGroups: ["데이터 페칭과 캐싱", "라우팅 심화"] },
    { id: "mid-03", title: "중간 점검 3: 스타일링 ~ 인증과 보안", afterGroup: "인증과 보안", coverGroups: ["스타일링과 최적화", "인증과 보안"] },
    { id: "mid-04", title: "중간 점검 4: API ~ 아키텍처", afterGroup: "아키텍처", coverGroups: ["API와 백엔드", "테스팅과 배포", "Pages Router", "아키텍처"] },
  ],
  cs: [
    { id: "mid-01", title: "중간 점검 1: 자료구조 ~ 알고리즘 기초", afterGroup: "알고리즘 기초", coverGroups: ["자료구조", "알고리즘 기초"] },
    { id: "mid-02", title: "중간 점검 2: 운영체제 ~ 컴퓨터 구조", afterGroup: "컴퓨터 구조", coverGroups: ["운영체제", "컴퓨터 구조"] },
    { id: "mid-03", title: "중간 점검 3: 디자인 패턴 ~ 소프트웨어 공학", afterGroup: "소프트웨어 공학", coverGroups: ["디자인 패턴", "소프트웨어 공학"] },
  ],
  network: [
    { id: "mid-01", title: "중간 점검 1: 네트워크 기초 ~ HTTP", afterGroup: "HTTP", coverGroups: ["네트워크 기초", "HTTP"] },
    { id: "mid-02", title: "중간 점검 2: HTTP 진화 ~ 실시간 통신", afterGroup: "실시간 통신", coverGroups: ["HTTP 진화", "실시간 통신"] },
    { id: "mid-03", title: "중간 점검 3: 브라우저 네트워킹 ~ 웹 보안", afterGroup: "웹 보안", coverGroups: ["브라우저 네트워킹", "웹 보안"] },
  ],
  infra: [
    { id: "mid-01", title: "중간 점검 1: Git ~ 빌드", afterGroup: "빌드와 번들링", coverGroups: ["Git 심화", "패키지 관리", "빌드와 번들링"] },
    { id: "mid-02", title: "중간 점검 2: 컨테이너 ~ 운영", afterGroup: "모니터링과 운영", coverGroups: ["컨테이너", "CI/CD", "배포와 클라우드", "모니터링과 운영"] },
  ],
  typescript: [
    { id: "mid-01", title: "중간 점검 1: 기초 ~ 타입 좁히기", afterGroup: "타입 좁히기", coverGroups: ["기초", "타입 좁히기"] },
    { id: "mid-02", title: "중간 점검 2: 제네릭 ~ 고급 타입", afterGroup: "고급 타입", coverGroups: ["제네릭", "고급 타입"] },
    { id: "mid-03", title: "중간 점검 3: 타입 시스템 ~ React+TS", afterGroup: "React + TypeScript", coverGroups: ["타입 시스템 심화", "클래스와 OOP", "React + TypeScript"] },
    { id: "mid-04", title: "중간 점검 4: 설정 ~ 아키텍처", afterGroup: "아키텍처", coverGroups: ["프로젝트 설정", "실전 패턴", "아키텍처"] },
  ],
};

export function getTotalChapters(subject: Subject): number {
  return roadmaps[subject].reduce((sum, g) => sum + g.chapters.length, 0);
}
