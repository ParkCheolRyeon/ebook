# React Deep Dive Ebook — Design Spec

## Overview

React 입문부터 심화까지 전 과정을 커버하는 학습 이북. React 코어 + 생태계(React Router, 상태관리, React Query) + 설계 패턴 + 테스팅까지 포함. React 19 최신 API 반영. JS 이북을 마친 학습자가 이어서 읽는 것을 전제로 하되, JS 개념은 간단히 복습 후 React 맥락으로 확장.

기존 ebook 프로젝트의 인프라(타입 시스템, 콘텐츠 시스템, 라우팅, UI)를 그대로 사용. Subject `"react"`로 콘텐츠만 추가.

## Scope

- 기존 프로젝트에 React 콘텐츠 추가 (코드 변경 없음, 콘텐츠 파일만 생성)
- `src/content/chapters/react/` 에 58개 챕터 TS 파일
- `src/content/quizzes/react/` 에 중간 퀴즈 6개 + 최종 시험 1개
- `src/content/roadmap.ts` 에 React 로드맵 추가
- `src/content/chapters/index.ts` 에 React 챕터 로더 등록
- `src/content/quizzes/index.ts` 에 React 퀴즈 로더 등록
- `src/pages/SubjectSelectPage.tsx` 에서 React를 available: true로 변경

## Content Rules

- **챕터 흐름:** 비유 → 문제정의 → 해결방법 → 의사코드(TypeScript) → 실습예제(TypeScript, 스타일 없이 구조만) → 요약 → 체크리스트 → 퀴즈
- **JS 개념 참조:** 간단히 복습 후 React 맥락으로 확장 (예: "클로저란 ~입니다(JS Ch.12 복습). React에서는 stale closure로 나타납니다")
- **코드 예제:** TypeScript, 스타일링 없이 컴포넌트 로직에 집중
- **React 19 반영:** use(), useActionState, useOptimistic, useFormStatus, ref as prop, ref 콜백 클린업, React Compiler, Server Components, Document Metadata

## React Curriculum (58 Chapters)

### 기초 (Ch 01-08)
1. React란 무엇인가 — 선언적 UI, 가상 DOM, React 19의 철학
2. JSX — JSX 문법, 변환 원리, React.createElement, Fragment
3. 컴포넌트 — 함수 컴포넌트, 컴포넌트 트리, 클래스 컴포넌트(레거시 이해용)
4. Props — 단방향 데이터 흐름, children, 기본값, TypeScript와 Props
5. State와 useState — 상태의 개념, 불변성, 배치 업데이트, 함수형 업데이트
6. 이벤트 핸들링 — 합성 이벤트, 이벤트 위임, 네이티브 이벤트와 차이
7. 조건부 렌더링과 리스트 — 조건부 패턴, key의 역할과 재조정
8. 폼과 Actions — 제어/비제어 컴포넌트, `<form action>`, useActionState, useFormStatus

### Hooks 심화 (Ch 09-18)
9. useEffect — 사이드이펙트, 의존성 배열, 클린업, 실행 타이밍
10. useRef — DOM 참조, ref를 prop으로 직접 전달(forwardRef 불필요), ref 콜백 클린업, useImperativeHandle
11. useMemo와 useCallback — 메모이제이션, 참조 동일성, React Compiler 시대의 재고찰
12. useReducer — 복잡한 상태 로직, dispatch 패턴, useState와 비교
13. useContext — Context API, Provider, 리렌더링 문제
14. use() 훅 — Promise 읽기, Context 읽기, Suspense 연동, 조건부 호출 가능
15. 커스텀 Hook — 로직 재사용, 네이밍 규칙, 실전 패턴
16. useLayoutEffect — useEffect와 차이, DOM 측정, 깜빡임 방지
17. useDeferredValue와 useTransition — 동시성 기능, 우선순위 렌더링
18. Stale Closure 문제 — 클로저 복습(JS 참조), useEffect 의존성, ref 해결법

**── 중간 점검 1 (기초 + Hooks 심화) ──**

### 렌더링 원리 (Ch 19-24)
19. 가상 DOM과 재조정 — Diffing 알고리즘, O(n) 휴리스틱, 트리 비교
20. Fiber 아키텍처 — Fiber 노드, 작업 단위, 시간 분할, 우선순위
21. 렌더 단계와 커밋 단계 — 렌더 vs 커밋, 순수성 규칙, 부수효과 처리
22. Batching과 자동 배칭 — React 18+ 자동 배칭, flushSync, 상태 업데이트 병합
23. Suspense — 비동기 렌더링, fallback, use()와 Suspense, ErrorBoundary
24. Server Components — RSC 개념, 서버/클라이언트 경계, 'use client', 직렬화

**── 중간 점검 2 (렌더링 원리) ──**

### 성능 최적화 (Ch 25-31)
25. 리렌더링 이해하기 — 언제 왜 리렌더링되는가, props 변경 vs 부모 리렌더링
26. React.memo — 메모이제이션, 얕은 비교, 커스텀 비교 함수
27. React Compiler — 자동 메모이제이션, 동작 원리, useMemo/useCallback의 미래
28. 코드 스플리팅 — React.lazy, dynamic import, 라우트 기반 스플리팅
29. 리스트 가상화 — 대량 데이터 렌더링, windowing, react-window
30. Profiler와 DevTools — React Profiler API, DevTools 사용법, 병목 찾기
31. 렌더링 최적화 패턴 — 상태 끌어올리기/내리기, 컴포넌트 분리, children 패턴

**── 중간 점검 3 (성능 최적화) ──**

### 상태 관리 (Ch 32-37)
32. 상태 관리 개론 — 로컬 vs 전역, 서버 상태 vs 클라이언트 상태
33. Context API 심화 — 다중 Context, 리렌더링 최적화, Context 분리 전략
34. Redux Toolkit 기초 — Store, Slice, Reducer, Action, configureStore
35. Redux Toolkit 심화 — createAsyncThunk, RTK Query, 미들웨어, 정규화
36. Zustand — 최소 API, 스토어 생성, 셀렉터, 미들웨어(persist, devtools)
37. 상태 관리 비교와 선택 기준 — Context vs Redux vs Zustand, 프로젝트 규모별 가이드

**── 중간 점검 4 (상태 관리) ──**

### 라우팅 (Ch 38-40)
38. React Router 기초 — BrowserRouter, Route, Link, 중첩 라우트, Outlet
39. React Router 심화 — 동적 라우트, loader/action, 보호된 라우트, 에러 바운더리
40. 라우팅 패턴 — 레이아웃 라우트, 병렬 라우트, 모달 라우트, 네비게이션 가드

### 데이터 페칭 (Ch 41-45)
41. 데이터 페칭 패턴 — useEffect 페칭, race condition, 로딩/에러 상태
42. React Query (TanStack Query) — useQuery, useMutation, 캐싱, 재검증
43. React Query 심화 — 낙관적 업데이트, 무한 스크롤, prefetch, 의존적 쿼리
44. useOptimistic — 낙관적 UI 패턴, Actions와 연동, 서버 확인 전 즉시 반영
45. SWR과 비교 — SWR vs React Query, stale-while-revalidate 전략

**── 중간 점검 5 (라우팅 + 데이터 페칭) ──**

### 테스팅 (Ch 46-50)
46. 테스팅 기초 — 테스트 피라미드, 단위/통합/E2E, 테스트 철학
47. React Testing Library — render, screen, userEvent, 쿼리 우선순위
48. 컴포넌트 테스트 패턴 — 사용자 관점 테스트, 비동기 테스트, 모킹
49. Hook 테스트 — renderHook, 커스텀 Hook 테스트, act()
50. E2E 테스트 — Playwright/Cypress 개요, 페이지 오브젝트 패턴

### 설계 패턴과 아키텍처 (Ch 51-58)
51. 컴포넌트 설계 원칙 — 단일 책임, 합성, Headless 컴포넌트
52. Compound Component 패턴 — 암묵적 상태 공유, Context 기반 합성
53. Render Props와 HOC — 로직 재사용 패턴, Hook 이전 패턴의 이해
54. Container/Presentational 분리 — 관심사 분리, Hook 시대의 재해석
55. 에러 바운더리 — Error Boundary 클래스, 에러 복구 전략, react-error-boundary
56. 폴더 구조와 아키텍처 — Feature 기반 구조, Barrel exports, 모노레포 기초
57. 대규모 앱 설계 — 모듈 경계, 의존성 방향, 레이어드 아키텍처
58. React 생태계 전망 — React 19+, Compiler, 서버 컴포넌트 미래, Document Metadata

**── 중간 점검 6 (테스팅 + 설계 패턴) ──**

**── 최종 시험 (React 전 범위 총망라) ──**

### Mid Quiz Placement Rationale

| 중간 점검 | 범위 | 배치 근거 |
|-----------|------|-----------|
| 1 | 기초 + Hooks | "React를 사용하는 법"에서 "React가 어떻게 동작하는가"로 전환 |
| 2 | 렌더링 원리 | 내부 원리 완료, 실전 최적화로 전환 |
| 3 | 성능 최적화 | 최적화 마무리, 상태 관리라는 새 아키텍처 주제로 전환 |
| 4 | 상태 관리 | 상태 관리 비교 완료, 라우팅/페칭이라는 실무 영역으로 전환 |
| 5 | 라우팅 + 데이터 페칭 | 실무 인프라 완료, 테스팅/설계라는 엔지니어링 영역으로 전환 |
| 6 | 테스팅 + 설계 패턴 | 최종 시험 직전 마지막 점검 |

## Quiz Structure

- **챕터별 퀴즈:** 각 챕터 끝, 최대 10문항 객관식, 정답 + 해설
- **중간 점검 퀴즈:** 6회, 각 15~20문항, 여러 챕터를 아우르는 통합 문제
- **최종 시험:** 30~40문항, React 전 범위 총망라, 제한 없음

## Roadmap Definition

```typescript
// content/roadmap.ts 에 추가할 React 로드맵
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
```

## Mid Quiz Definitions

```typescript
// content/roadmap.ts 에 추가할 React 중간 퀴즈
react: [
  { id: "mid-01", title: "중간 점검 1: 기초 ~ Hooks 심화", afterGroup: "Hooks 심화", coverGroups: ["기초", "Hooks 심화"] },
  { id: "mid-02", title: "중간 점검 2: 렌더링 원리", afterGroup: "렌더링 원리", coverGroups: ["렌더링 원리"] },
  { id: "mid-03", title: "중간 점검 3: 성능 최적화", afterGroup: "성능 최적화", coverGroups: ["성능 최적화"] },
  { id: "mid-04", title: "중간 점검 4: 상태 관리", afterGroup: "상태 관리", coverGroups: ["상태 관리"] },
  { id: "mid-05", title: "중간 점검 5: 라우팅 ~ 데이터 페칭", afterGroup: "데이터 페칭", coverGroups: ["라우팅", "데이터 페칭"] },
  { id: "mid-06", title: "중간 점검 6: 테스팅 ~ 설계 패턴", afterGroup: "설계 패턴과 아키텍처", coverGroups: ["테스팅", "설계 패턴과 아키텍처"] },
],
```

## Files to Create

```
src/content/
├── chapters/
│   └── react/
│       ├── index.ts              # 58개 챕터 lazy loaders
│       ├── 01-what-is-react.ts
│       ├── 02-jsx.ts
│       ├── ... (58개)
│       └── 58-react-ecosystem-future.ts
└── quizzes/
    └── react/
        ├── mid/
        │   ├── mid-01.ts
        │   ├── mid-02.ts
        │   ├── mid-03.ts
        │   ├── mid-04.ts
        │   ├── mid-05.ts
        │   └── mid-06.ts
        └── final.ts
```

## Files to Modify

- `src/content/roadmap.ts` — React 로드맵 + 중간 퀴즈 정의 추가
- `src/content/chapters/index.ts` — React 챕터 로더 등록
- `src/content/quizzes/index.ts` — React 퀴즈 로더 등록
- `src/pages/SubjectSelectPage.tsx` — React available: true
