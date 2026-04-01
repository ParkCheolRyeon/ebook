# JavaScript Deep Dive Ebook — Design Spec

## Overview

프론트엔드 개발자를 위한 JavaScript 종합 학습 이북 웹앱. 기존 read-and-save(면접 준비용 요약본)와 달리, 진득하게 읽으며 깊이 있게 학습하는 것이 목적. 모던 자바스크립트 Deep Dive, javascript.info, MDN을 참고하여 JS 전 과정을 커버한다.

향후 React, Next.js, CS, Network, Infra, TypeScript 등으로 확장 예정이며, 첫 번째 시리즈는 JavaScript.

## Tech Stack

| 항목 | 선택 | 비고 |
|------|------|------|
| 번들러 | Vite 6 | |
| UI | React 19 | |
| 언어 | TypeScript 5 | |
| 스타일 | Tailwind CSS 4 | |
| 라우팅 | React Router v7 | SPA |
| 코드 하이라이팅 | Prism.js | |
| 애니메이션 | Framer Motion 12 | 페이지 전환, UI 피드백 |
| 배포 | Vercel | |

### 의존성

```json
{
  "dependencies": {
    "react": "^19",
    "react-dom": "^19",
    "react-router-dom": "^7",
    "prismjs": "^1.29",
    "tailwindcss": "^4",
    "framer-motion": "^12"
  },
  "devDependencies": {
    "vite": "^6",
    "typescript": "^5",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/prismjs": "^1",
    "@tailwindcss/vite": "^4",
    "vercel": "latest"
  }
}
```

## Authentication

클라이언트 전용 인증. 서버 없음.

- 하드코딩된 자격증명으로 로그인
- `localStorage`에 `{ authenticated: boolean, loginAt: number }` 저장
- 3시간(10,800,000ms) 경과 시 자동 로그아웃
- 매 페이지 접근 시 `useAuth` 훅이 만료 체크
- 학습 데이터(진행률, 퀴즈 결과)는 인증과 별개로 localStorage에 무기한 보존

```typescript
// lib/auth.ts
const AUTH_KEY = "ebook-auth";
const EXPIRY_MS = 3 * 60 * 60 * 1000;

interface AuthState {
  authenticated: boolean;
  loginAt: number;
}

function login(id: string, password: string): boolean
function logout(): void
function isAuthenticated(): boolean  // 만료 체크 포함
```

## Content Architecture

### Subject System

```typescript
type Subject = "js" | "react" | "next" | "cs" | "network" | "infra" | "typescript";
```

### Type Definitions

```typescript
// types/chapter.ts
interface Chapter {
  id: string;
  subject: Subject;
  title: string;
  description: string;
  order: number;
  group: string;
  prerequisites: string[];
  estimatedMinutes: number;
  sections: ChapterSection[];
  checklist: string[];
  quiz: QuizQuestion[];          // 최대 10문항
}

interface ChapterSection {
  type: SectionType;
  title: string;
  content: string;
  code?: CodeBlock;
}

type SectionType =
  | "analogy"       // 비유
  | "problem"       // 문제정의
  | "solution"      // 해결방법
  | "pseudocode"    // 기술구현 (TypeScript 의사코드)
  | "practice"      // 실습예제
  | "summary"       // 전체 요약
  | "checklist";    // 학습 체크리스트

interface CodeBlock {
  language: "typescript" | "javascript";
  code: string;
  description?: string;
}
```

```typescript
// types/quiz.ts
interface QuizQuestion {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

interface ChapterQuiz {
  type: "chapter";
  chapterId: string;
  questions: QuizQuestion[];     // 최대 10개
}

interface MidQuiz {
  type: "mid";
  id: string;
  title: string;
  coverGroups: string[];
  questions: QuizQuestion[];
}

interface FinalExam {
  type: "final";
  id: "final-exam";
  title: string;
  questions: QuizQuestion[];     // 제한 없음
}

type Quiz = ChapterQuiz | MidQuiz | FinalExam;
```

```typescript
// types/progress.ts
interface ChapterProgress {
  chapterId: string;
  subject: Subject;
  isRead: boolean;
  checklistCompleted: boolean[];
  quizScore?: {
    correct: number;
    total: number;
    answeredAt: number;
  };
}

interface QuizProgress {
  quizId: string;
  subject: Subject;
  score: {
    correct: number;
    total: number;
    answeredAt: number;
  };
}
```

### Chapter Flow (per chapter)

각 챕터는 반드시 아래 순서를 따른다:

1. **비유 (analogy)** — 일상적인 비유로 개념 소개
2. **문제 정의 (problem)** — 이 개념이 왜 필요한지
3. **해결 방법 (solution)** — 개념의 원리와 동작 방식
4. **기술 구현 (pseudocode)** — TypeScript 의사코드로 내부 동작 표현
5. **실습 예제 (practice)** — 실전 활용 케이스 + TypeScript 코드
6. **전체 요약 (summary)** — 핵심 포인트 정리
7. **학습 체크리스트 (checklist)** — "~를 설명할 수 있다" 형태
8. **퀴즈 (quiz)** — 객관식, 최대 10문항, 정답 + 해설

### Content File Structure

```
content/
├── chapters/
│   ├── js/
│   │   ├── index.ts
│   │   ├── 01-var-let-const.ts
│   │   ├── 02-data-types.ts
│   │   └── ... (45개 챕터)
│   └── index.ts                 # 과목별 통합 export
├── quizzes/
│   ├── js/
│   │   ├── mid/
│   │   │   ├── mid-01.ts       # 기초 ~ 스코프
│   │   │   ├── mid-02.ts       # this와 객체
│   │   │   ├── mid-03.ts       # 빌트인 ~ 비동기
│   │   │   ├── mid-04.ts       # 이터러블 ~ 메모리
│   │   │   └── mid-05.ts       # 브라우저 ~ 고급 패턴
│   │   └── final.ts
│   └── index.ts
└── roadmap.ts
```

### Roadmap Definition

```typescript
// content/roadmap.ts
interface RoadmapGroup {
  group: string;
  chapters: string[];
}

export const roadmaps: Record<Subject, RoadmapGroup[]> = {
  js: [
    { group: "기초", chapters: ["01-var-let-const", "02-data-types", "03-operators", "04-type-coercion", "05-control-flow"] },
    { group: "함수의 기본", chapters: ["06-function-definition", "07-first-class-object", "08-arrow-function"] },
    { group: "스코프와 실행 컨텍스트", chapters: ["09-scope", "10-lexical-scope", "11-execution-context", "12-closure"] },
    // 중간 점검 1
    { group: "this와 객체", chapters: ["13-object-literal", "14-this-binding", "15-constructor", "16-prototype", "17-prototype-chain", "18-class"] },
    // 중간 점검 2
    { group: "빌트인과 표준 객체", chapters: ["19-built-in-objects", "20-wrapper-objects", "21-array-hof", "22-map-set", "23-regexp", "24-string-number-math-date"] },
    { group: "비동기", chapters: ["25-event-loop", "26-callback-pattern", "27-promise", "28-async-await", "29-microtask-macrotask"] },
    // 중간 점검 3
    { group: "이터러블과 제너레이터", chapters: ["30-iterable", "31-generator", "32-symbol"] },
    { group: "모듈과 환경", chapters: ["33-module-system", "34-strict-mode", "35-error-handling"] },
    { group: "메모리와 최적화", chapters: ["36-garbage-collection", "37-memory-leak", "38-debounce-throttle"] },
    // 중간 점검 4
    { group: "브라우저와 DOM", chapters: ["39-dom-structure", "40-event-bubbling-capturing", "41-event-delegation", "42-browser-rendering"] },
    { group: "고급 패턴", chapters: ["43-proxy-reflect", "44-design-patterns", "45-functional-programming"] },
    // 중간 점검 5
  ],
};
```

## JS Curriculum (45 Chapters)

### 기초 (Ch 01-05)
1. 변수 선언: var, let, const
2. 데이터 타입
3. 연산자
4. 타입 변환과 단축 평가
5. 제어문

### 함수의 기본 (Ch 06-08)
6. 함수 정의와 호출
7. 함수와 일급 객체
8. 화살표 함수

### 스코프와 실행 컨텍스트 (Ch 09-12)
9. 스코프
10. 렉시컬 스코프
11. 실행 컨텍스트
12. 클로저

**── 중간 점검 1 (기초 + 함수 + 스코프) ──**

### this와 객체 (Ch 13-18)
13. 객체 리터럴과 프로퍼티
14. this 바인딩
15. 생성자 함수와 new
16. 프로토타입
17. 프로토타입 체인과 상속
18. 클래스

**── 중간 점검 2 (this와 객체) ──**

### 빌트인과 표준 객체 (Ch 19-24)
19. 빌트인 객체
20. 래퍼 객체
21. 배열과 고차 함수
22. Map, Set, WeakMap, WeakSet
23. 정규 표현식
24. String, Number, Math, Date

### 비동기 (Ch 25-29)
25. 이벤트 루프와 태스크 큐
26. 콜백 패턴과 에러 처리
27. 프로미스
28. async/await
29. 마이크로태스크와 매크로태스크

**── 중간 점검 3 (빌트인 + 비동기) ──**

### 이터러블과 제너레이터 (Ch 30-32)
30. 이터러블과 이터레이터 프로토콜
31. 제너레이터와 yield
32. Symbol

### 모듈과 환경 (Ch 33-35)
33. 모듈 시스템 (CommonJS, ESM)
34. strict mode
35. 에러 처리 (try/catch/finally)

### 메모리와 최적화 (Ch 36-38)
36. 가비지 컬렉션
37. 메모리 누수 패턴
38. 디바운스와 스로틀

**── 중간 점검 4 (이터러블 + 모듈 + 메모리) ──**

### 브라우저와 DOM (Ch 39-42)
39. DOM 구조와 탐색
40. 이벤트 버블링과 캡처링
41. 이벤트 위임
42. 브라우저 렌더링 과정

### 고급 패턴 (Ch 43-45)
43. Proxy와 Reflect
44. 디자인 패턴 (JS에서의 활용)
45. 함수형 프로그래밍 기초

**── 중간 점검 5 (브라우저 + 고급 패턴) ──**

**── 최종 시험 (전 범위 총망라) ──**

### Mid Quiz Placement Rationale

| 중간 점검 | 범위 | 배치 근거 |
|-----------|------|-----------|
| 1 | 기초 + 함수 + 스코프 | "코드 실행 원리"에서 "객체"라는 새 패러다임으로 전환 |
| 2 | this와 객체 | OOP 개념 마무리, 빌트인/비동기 실용 영역으로 전환 |
| 3 | 빌트인 + 비동기 | 실전 JS 핵심 완료, 심화/메타 주제로 전환 |
| 4 | 이터러블 + 모듈 + 메모리 | 언어 내부 메커니즘 완료, 브라우저 환경으로 전환 |
| 5 | 브라우저 + 고급 패턴 | 최종 시험 직전 마지막 점검 |

## Page Structure & Routing

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | LoginPage | 미니멀 센터 디자인, ID/PW 입력 |
| `/home` | HomePage | 카드형 로드맵 + 프로그레스 링, 과목 탭 |
| `/chapter/:subject/:id` | ChapterPage | 섹션 진행 바 + 연결 힌트 + 이전/다음 |
| `/quiz/chapter/:subject/:id` | ChapterQuizPage | 챕터별 객관식 퀴즈 |
| `/quiz/mid/:subject/:id` | MidQuizPage | 중간 점검 퀴즈 |
| `/quiz/final/:subject` | FinalExamPage | 최종 시험 |

### User Flow

1. 로그인 → 로드맵에서 현재 위치 확인
2. 챕터 선택 → 섹션별로 스크롤하며 읽기
3. 챕터 끝 → 퀴즈 → 결과 확인 → 로드맵 복귀 또는 다음 챕터
4. 그룹 완료 → 중간 점검 퀴즈 해금
5. 전체 완료 → 최종 시험

## Component Architecture

```
src/
├── pages/
│   ├── LoginPage.tsx
│   ├── HomePage.tsx
│   ├── ChapterPage.tsx
│   ├── ChapterQuizPage.tsx
│   ├── MidQuizPage.tsx
│   └── FinalExamPage.tsx
│
├── components/
│   ├── layout/
│   │   └── Header.tsx
│   ├── roadmap/
│   │   ├── RoadmapCard.tsx
│   │   ├── ProgressRing.tsx
│   │   └── MidQuizBanner.tsx
│   ├── chapter/
│   │   ├── SectionRenderer.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── ChapterNav.tsx
│   │   ├── ConnectionHint.tsx
│   │   └── SectionProgress.tsx
│   ├── quiz/
│   │   ├── QuizQuestion.tsx
│   │   ├── QuizResult.tsx
│   │   └── QuizProgress.tsx
│   └── common/
│       ├── Spinner.tsx
│       └── Checklist.tsx
│
├── content/
│   ├── chapters/
│   │   ├── js/
│   │   │   ├── index.ts
│   │   │   ├── 01-var-let-const.ts
│   │   │   └── ...
│   │   └── index.ts
│   ├── quizzes/
│   │   ├── js/
│   │   │   ├── mid/
│   │   │   └── final.ts
│   │   └── index.ts
│   └── roadmap.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useProgress.ts
│   └── useChapter.ts
│
├── lib/
│   ├── auth.ts
│   └── progress.ts
│
├── types/
│   ├── chapter.ts
│   ├── quiz.ts
│   └── progress.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

### Key Components

**SectionRenderer** — 섹션 `type`에 따라 다른 UI를 렌더링하는 분기 컴포넌트. 챕터 흐름의 일관성을 보장.

**CodeBlock** — Prism.js를 사용한 코드 하이라이팅. language prop으로 TypeScript/JavaScript 구분.

**ConnectionHint** — 챕터 시작에 표시. "이전 챕터에서 배운 X를 기반으로..." 형태의 연결 텍스트 + 관련 챕터 링크.

**RoadmapCard** — 그룹별 카드. 진행률 바 + 챕터 필 태그(완료/진행중/미시작 색상 구분).

**ProgressRing** — SVG 기반 원형 진행률 표시.

## State Management

Context API + localStorage. 별도 상태관리 라이브러리 없음.

| 상태 | 저장소 | 만료 |
|------|--------|------|
| 인증 | localStorage + AuthContext | 3시간 |
| 학습 진행률 | localStorage + ProgressContext | 무기한 |
| 퀴즈 결과 | localStorage + ProgressContext | 무기한 |
| 현재 챕터 | URL 파라미터 (React Router) | N/A |
| 퀴즈 응답 (진행 중) | 컴포넌트 state | 페이지 이탈 시 리셋 |

## UI Design Decisions

- **로그인**: 미니멀 센터 — 화이트 배경, 밑줄 인풋, 모노톤 타이포그래피
- **로드맵**: 카드 기반 + 프로그레스 링 — 그룹별 카드에 챕터 필 태그, 중간퀴즈 배너, SVG 원형 진행률
- **챕터 리더**: 섹션 진행 바 + 연결 힌트 + 이전/다음 네비게이션
- **퀴즈**: 객관식 선택 → 정답 확인 → 해설 표시
- **테마**: 라이트모드 전용
- **반응형**: 모바일 + 데스크탑. 모바일 좌우 패딩 16px. read-and-save 프로젝트의 반응형 처리를 참고.
- **애니메이션**: Framer Motion (페이지 전환, 카드 인터랙션, 퀴즈 피드백)
