# JavaScript Deep Dive Ebook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a JavaScript learning ebook web app with a card-based roadmap, chapter reader with structured sections, and a 3-tier quiz system.

**Architecture:** Vite + React 19 SPA with React Router v7 for routing. Content stored as TypeScript files with full type safety. State managed via Context API + localStorage. No backend—client-only auth with 3-hour expiry.

**Tech Stack:** Vite 6, React 19, TypeScript 5, Tailwind CSS 4, React Router v7, Prism.js, Framer Motion 12, Vercel

**Reference project:** `/Users/iscreamarts/Documents/git/read-and-save/` — responsive patterns: `px-4` (16px mobile padding), `max-w-2xl`/`max-w-3xl` containers, `min-h-[100dvh]`, sticky headers with `backdrop-blur`, `safe-area-inset-bottom`.

---

## File Map

```
src/
├── main.tsx                          # React root mount
├── App.tsx                           # BrowserRouter + routes + AuthProvider + ProgressProvider
├── index.css                         # Tailwind import + Prism theme overrides + global styles
│
├── types/
│   ├── chapter.ts                    # Subject, Chapter, ChapterSection, SectionType, CodeBlock
│   ├── quiz.ts                       # QuizQuestion, ChapterQuiz, MidQuiz, FinalExam, Quiz
│   └── progress.ts                   # ChapterProgress, QuizProgress
│
├── lib/
│   ├── auth.ts                       # login, logout, isAuthenticated (localStorage + 3hr expiry)
│   └── progress.ts                   # loadProgress, saveChapterProgress, saveQuizProgress, getOverallProgress
│
├── hooks/
│   ├── useAuth.ts                    # AuthContext provider + useAuth hook
│   ├── useProgress.ts                # ProgressContext provider + useProgress hook
│   └── useChapter.ts                 # getChapter, getAdjacentChapters, getChaptersBySubject
│
├── components/
│   ├── layout/
│   │   └── Header.tsx                # Sticky header with back nav + title
│   ├── roadmap/
│   │   ├── ProgressRing.tsx          # SVG circular progress indicator
│   │   ├── RoadmapCard.tsx           # Group card with progress bar + chapter pill tags
│   │   └── MidQuizBanner.tsx         # Mid-quiz locked/unlocked banner
│   ├── chapter/
│   │   ├── SectionProgress.tsx       # Horizontal section progress bar
│   │   ├── ConnectionHint.tsx        # "Building on X from previous chapter..." link box
│   │   ├── SectionRenderer.tsx       # Switch on SectionType → render UI per type
│   │   ├── CodeBlock.tsx             # Prism.js highlighted code block
│   │   ├── ChapterNav.tsx            # Prev/Next chapter navigation cards
│   │   └── Checklist.tsx             # Interactive checklist with toggles
│   └── quiz/
│       ├── QuizProgress.tsx          # "Question 2 / 5" indicator
│       ├── QuizQuestion.tsx          # Single question card with choices + feedback
│       └── QuizResult.tsx            # Score summary + explanation list
│
├── pages/
│   ├── LoginPage.tsx                 # Minimal center login (white bg, underline inputs, monochrome)
│   ├── HomePage.tsx                  # Card-based roadmap + ProgressRing + subject tabs
│   ├── ChapterPage.tsx               # Section progress + ConnectionHint + SectionRenderer + ChapterNav
│   ├── ChapterQuizPage.tsx           # Chapter quiz using QuizQuestion/QuizResult
│   ├── MidQuizPage.tsx               # Mid-checkpoint quiz (same quiz components)
│   └── FinalExamPage.tsx             # Final exam (same quiz components)
│
└── content/
    ├── roadmap.ts                    # roadmaps Record<Subject, RoadmapGroup[]> + midQuizzes + finalExam defs
    ├── chapters/
    │   ├── index.ts                  # Re-exports all subjects' lazy loaders
    │   └── js/
    │       ├── index.ts              # Lazy chapter loaders: () => import("./01-var-let-const")
    │       └── 01-var-let-const.ts   # First sample chapter (full content)
    └── quizzes/
        ├── index.ts                  # Re-exports all quiz loaders
        └── js/
            ├── mid/
            │   └── mid-01.ts         # Sample mid quiz
            └── final.ts              # Sample final exam (stub)
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`, `.gitignore`

- [ ] **Step 1: Initialize Vite project**

```bash
cd /Users/iscreamarts/Documents/git/ebook
npm create vite@latest . -- --template react-ts
```

Select "Ignore files and continue" when prompted (README already exists).

- [ ] **Step 2: Install dependencies**

```bash
npm install react-router-dom@^7 prismjs@^1.29 framer-motion@^12
npm install -D @types/prismjs@^1 @tailwindcss/vite@^4 tailwindcss@^4
```

- [ ] **Step 3: Configure Vite with Tailwind**

Replace `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
```

- [ ] **Step 4: Configure tsconfig path alias**

In `tsconfig.app.json`, add to `compilerOptions`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 5: Set up index.css with Tailwind + global styles**

Replace `src/index.css`:

```css
@import "tailwindcss";

:root {
  --background: #fafafa;
  --foreground: #111111;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  word-break: keep-all;
  -webkit-font-smoothing: antialiased;
}

/* Prism.js overrides */
pre[class*="language-"] {
  margin: 1.5rem 0;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
  line-height: 1.75;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

code[class*="language-"] {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
}

/* Inline code */
:not(pre) > code {
  background: #f3f4f6;
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.9em;
  color: #4b5563;
}
```

- [ ] **Step 6: Set up minimal App.tsx with router placeholder**

Replace `src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="flex min-h-[100dvh] items-center justify-center px-4">Ebook App</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 7: Update main.tsx**

Replace `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 8: Verify dev server starts**

```bash
cd /Users/iscreamarts/Documents/git/ebook
npm run dev
```

Expected: Vite dev server starts, browser shows "Ebook App" centered.

- [ ] **Step 9: Commit**

```bash
cd /Users/iscreamarts/Documents/git/ebook
echo '.superpowers/' >> .gitignore
git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json index.html src/ .gitignore
git commit -m "feat: scaffold Vite + React + TS + Tailwind project"
```

---

### Task 2: Type Definitions

**Files:**
- Create: `src/types/chapter.ts`, `src/types/quiz.ts`, `src/types/progress.ts`

- [ ] **Step 1: Create chapter types**

Create `src/types/chapter.ts`:

```typescript
export type Subject = "js" | "react" | "next" | "cs" | "network" | "infra" | "typescript";

export type SectionType =
  | "analogy"
  | "problem"
  | "solution"
  | "pseudocode"
  | "practice"
  | "summary"
  | "checklist";

export interface CodeBlock {
  language: "typescript" | "javascript";
  code: string;
  description?: string;
}

export interface ChapterSection {
  type: SectionType;
  title: string;
  content: string;
  code?: CodeBlock;
}

export interface Chapter {
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
  quiz: QuizQuestion[];
}

// Re-export for convenience — Chapter needs QuizQuestion
import type { QuizQuestion } from "./quiz";
export type { QuizQuestion };
```

- [ ] **Step 2: Create quiz types**

Create `src/types/quiz.ts`:

```typescript
export interface QuizQuestion {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChapterQuiz {
  type: "chapter";
  chapterId: string;
  questions: QuizQuestion[];
}

export interface MidQuiz {
  type: "mid";
  id: string;
  title: string;
  coverGroups: string[];
  questions: QuizQuestion[];
}

export interface FinalExam {
  type: "final";
  id: "final-exam";
  title: string;
  questions: QuizQuestion[];
}

export type Quiz = ChapterQuiz | MidQuiz | FinalExam;
```

- [ ] **Step 3: Create progress types**

Create `src/types/progress.ts`:

```typescript
import type { Subject } from "./chapter";

export interface QuizScore {
  correct: number;
  total: number;
  answeredAt: number;
}

export interface ChapterProgress {
  chapterId: string;
  subject: Subject;
  isRead: boolean;
  checklistCompleted: boolean[];
  quizScore?: QuizScore;
}

export interface QuizProgress {
  quizId: string;
  subject: Subject;
  score: QuizScore;
}

export interface AppProgress {
  chapters: Record<string, ChapterProgress>;
  quizzes: Record<string, QuizProgress>;
}
```

- [ ] **Step 4: Verify types compile**

```bash
cd /Users/iscreamarts/Documents/git/ebook
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/types/
git commit -m "feat: add type definitions for chapter, quiz, and progress"
```

---

### Task 3: Auth System

**Files:**
- Create: `src/lib/auth.ts`, `src/hooks/useAuth.ts`

- [ ] **Step 1: Create auth library**

Create `src/lib/auth.ts`:

```typescript
const AUTH_KEY = "ebook-auth";
const EXPIRY_MS = 3 * 60 * 60 * 1000; // 3 hours

interface AuthState {
  authenticated: boolean;
  loginAt: number;
}

// Hardcoded credentials — client-only auth
const VALID_ID = "pcr";
const VALID_PASSWORD = "1q2w3e4r!@#";

export function login(id: string, password: string): boolean {
  if (id === VALID_ID && password === VALID_PASSWORD) {
    const state: AuthState = {
      authenticated: true,
      loginAt: Date.now(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(state));
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return false;

  try {
    const state: AuthState = JSON.parse(raw);
    if (!state.authenticated) return false;

    const elapsed = Date.now() - state.loginAt;
    if (elapsed > EXPIRY_MS) {
      localStorage.removeItem(AUTH_KEY);
      return false;
    }

    return true;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return false;
  }
}
```

- [ ] **Step 2: Create AuthContext and useAuth hook**

Create `src/hooks/useAuth.ts`:

```tsx
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { login as authLogin, logout as authLogout, isAuthenticated } from "@/lib/auth";

interface AuthContextValue {
  authenticated: boolean;
  login: (id: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated());

  // Periodically check expiry (every 60s)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAuthenticated()) {
        setAuthenticated(false);
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const login = useCallback((id: string, password: string) => {
    const success = authLogin(id, password);
    if (success) setAuthenticated(true);
    return success;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setAuthenticated(false);
  }, []);

  return (
    <AuthContext value={{ authenticated, login, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
```

- [ ] **Step 3: Verify compilation**

```bash
cd /Users/iscreamarts/Documents/git/ebook
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/auth.ts src/hooks/useAuth.ts
git commit -m "feat: add client-only auth with 3-hour expiry"
```

---

### Task 4: Progress System

**Files:**
- Create: `src/lib/progress.ts`, `src/hooks/useProgress.ts`

- [ ] **Step 1: Create progress library**

Create `src/lib/progress.ts`:

```typescript
import type { AppProgress, ChapterProgress, QuizProgress, QuizScore } from "@/types/progress";
import type { Subject } from "@/types/chapter";

const PROGRESS_KEY = "ebook-progress";

export function loadProgress(): AppProgress {
  const raw = localStorage.getItem(PROGRESS_KEY);
  if (!raw) return { chapters: {}, quizzes: {} };

  try {
    return JSON.parse(raw) as AppProgress;
  } catch {
    return { chapters: {}, quizzes: {} };
  }
}

function saveProgress(progress: AppProgress): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function markChapterRead(chapterId: string, subject: Subject): AppProgress {
  const progress = loadProgress();
  const existing = progress.chapters[chapterId];
  progress.chapters[chapterId] = {
    ...existing,
    chapterId,
    subject,
    isRead: true,
    checklistCompleted: existing?.checklistCompleted ?? [],
  };
  saveProgress(progress);
  return progress;
}

export function updateChecklist(
  chapterId: string,
  subject: Subject,
  checklistCompleted: boolean[],
): AppProgress {
  const progress = loadProgress();
  const existing = progress.chapters[chapterId];
  progress.chapters[chapterId] = {
    ...existing,
    chapterId,
    subject,
    isRead: existing?.isRead ?? false,
    checklistCompleted,
  };
  saveProgress(progress);
  return progress;
}

export function saveChapterQuizScore(
  chapterId: string,
  subject: Subject,
  score: QuizScore,
): AppProgress {
  const progress = loadProgress();
  const existing = progress.chapters[chapterId];
  progress.chapters[chapterId] = {
    ...existing,
    chapterId,
    subject,
    isRead: existing?.isRead ?? false,
    checklistCompleted: existing?.checklistCompleted ?? [],
    quizScore: score,
  };
  saveProgress(progress);
  return progress;
}

export function saveQuizProgress(
  quizId: string,
  subject: Subject,
  score: QuizScore,
): AppProgress {
  const progress = loadProgress();
  progress.quizzes[quizId] = { quizId, subject, score };
  saveProgress(progress);
  return progress;
}

export function getSubjectProgress(
  subject: Subject,
  totalChapters: number,
): { completed: number; total: number; percent: number } {
  const progress = loadProgress();
  const completed = Object.values(progress.chapters).filter(
    (ch) => ch.subject === subject && ch.isRead,
  ).length;
  const percent = totalChapters > 0 ? Math.round((completed / totalChapters) * 100) : 0;
  return { completed, total: totalChapters, percent };
}
```

- [ ] **Step 2: Create ProgressContext and useProgress hook**

Create `src/hooks/useProgress.ts`:

```tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AppProgress, QuizScore } from "@/types/progress";
import type { Subject } from "@/types/chapter";
import {
  loadProgress,
  markChapterRead,
  updateChecklist,
  saveChapterQuizScore,
  saveQuizProgress,
  getSubjectProgress,
} from "@/lib/progress";

interface ProgressContextValue {
  progress: AppProgress;
  markRead: (chapterId: string, subject: Subject) => void;
  setChecklist: (chapterId: string, subject: Subject, items: boolean[]) => void;
  saveChapterQuiz: (chapterId: string, subject: Subject, score: QuizScore) => void;
  saveQuiz: (quizId: string, subject: Subject, score: QuizScore) => void;
  getSubjectStats: (subject: Subject, totalChapters: number) => { completed: number; total: number; percent: number };
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<AppProgress>(() => loadProgress());

  const markRead = useCallback((chapterId: string, subject: Subject) => {
    setProgress(markChapterRead(chapterId, subject));
  }, []);

  const setChecklist = useCallback((chapterId: string, subject: Subject, items: boolean[]) => {
    setProgress(updateChecklist(chapterId, subject, items));
  }, []);

  const saveChapterQuiz = useCallback((chapterId: string, subject: Subject, score: QuizScore) => {
    setProgress(saveChapterQuizScore(chapterId, subject, score));
  }, []);

  const saveQuiz = useCallback((quizId: string, subject: Subject, score: QuizScore) => {
    setProgress(saveQuizProgress(quizId, subject, score));
  }, []);

  const getSubjectStats = useCallback((subject: Subject, totalChapters: number) => {
    return getSubjectProgress(subject, totalChapters);
  }, []);

  return (
    <ProgressContext value={{ progress, markRead, setChecklist, saveChapterQuiz, saveQuiz, getSubjectStats }}>
      {children}
    </ProgressContext>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
```

- [ ] **Step 3: Verify compilation**

```bash
cd /Users/iscreamarts/Documents/git/ebook
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/progress.ts src/hooks/useProgress.ts
git commit -m "feat: add progress tracking system with localStorage persistence"
```

---

### Task 5: Content System + Sample Chapter

**Files:**
- Create: `src/content/roadmap.ts`, `src/content/chapters/js/01-var-let-const.ts`, `src/content/chapters/js/index.ts`, `src/content/chapters/index.ts`, `src/content/quizzes/js/mid/mid-01.ts`, `src/content/quizzes/js/final.ts`, `src/content/quizzes/index.ts`, `src/hooks/useChapter.ts`

- [ ] **Step 1: Create roadmap definition**

Create `src/content/roadmap.ts`:

```typescript
import type { Subject } from "@/types/chapter";
import type { MidQuiz, FinalExam } from "@/types/quiz";

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
```

- [ ] **Step 2: Create sample chapter (01-var-let-const)**

Create `src/content/chapters/js/01-var-let-const.ts`:

```typescript
import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "01-var-let-const",
  subject: "js",
  title: "변수 선언: var, let, const",
  description: "자바스크립트의 세 가지 변수 선언 방식과 그 차이를 깊이 이해합니다.",
  order: 1,
  group: "기초",
  prerequisites: [],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "변수 선언은 이사할 때 짐을 정리하는 것과 비슷합니다.\n\n" +
        "**var**는 오래된 창고입니다. 문이 항상 열려 있어서 어디서든 접근할 수 있지만, 같은 이름표를 가진 상자가 여러 개 있어도 경고 없이 덮어씁니다.\n\n" +
        "**let**은 잠금장치가 달린 사물함입니다. 정해진 구역(블록) 안에서만 접근할 수 있고, 같은 이름표를 두 번 붙이면 오류가 납니다. 다만 안에 든 물건은 교체할 수 있습니다.\n\n" +
        "**const**는 밀봉된 금고입니다. 한번 넣으면 다른 것으로 교체할 수 없습니다. 하지만 금고 안에 서랍이 있다면(객체/배열), 서랍 내부의 물건은 바꿀 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "자바스크립트에는 왜 변수를 선언하는 방법이 세 가지나 있을까요?\n\n" +
        "초기 자바스크립트에는 `var`만 있었습니다. 하지만 `var`에는 심각한 문제들이 있었습니다:\n\n" +
        "1. **함수 스코프만 지원** — 블록(`if`, `for`) 안에서 선언해도 밖에서 접근 가능\n" +
        "2. **중복 선언 허용** — 같은 변수를 두 번 선언해도 에러 없음\n" +
        "3. **호이스팅 시 undefined** — 선언 전에 접근하면 에러 대신 `undefined` 반환\n\n" +
        "이런 문제들이 버그의 온상이 되자, ES6(2015)에서 `let`과 `const`가 도입되었습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "ES6는 두 가지 새로운 선언 키워드로 `var`의 문제를 해결했습니다.\n\n" +
        "### 블록 스코프\n" +
        "`let`과 `const`는 가장 가까운 블록(`{}`)을 스코프 경계로 사용합니다. `for` 루프 안에서 선언한 변수가 밖으로 새어나가지 않습니다.\n\n" +
        "### 중복 선언 금지\n" +
        "같은 스코프에서 같은 이름으로 두 번 선언하면 `SyntaxError`가 발생합니다.\n\n" +
        "### TDZ (Temporal Dead Zone)\n" +
        "`let`과 `const`도 호이스팅됩니다. 하지만 초기화 전에 접근하면 `undefined` 대신 `ReferenceError`를 던집니다. 선언문 이전의 이 영역을 **TDZ**라고 합니다.\n\n" +
        "### const의 불변 바인딩\n" +
        "`const`는 변수의 **바인딩**을 불변으로 만듭니다. 원시값은 변경할 수 없지만, 객체나 배열의 내부 속성은 변경할 수 있습니다. 이것이 '불변'과 '상수'의 차이입니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 호이스팅과 TDZ",
      content:
        "자바스크립트 엔진이 변수 선언을 내부적으로 어떻게 처리하는지 의사코드로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// JS 엔진의 내부 동작을 의사코드로 표현\n' +
          '\n' +
          '// === var의 호이스팅 ===\n' +
          '// 소스 코드:\n' +
          '// console.log(x); // undefined\n' +
          '// var x = 10;\n' +
          '\n' +
          '// 엔진이 실제로 실행하는 순서:\n' +
          'declare x: undefined      // 1단계: 선언 + 초기화(undefined)\n' +
          'console.log(x)            // undefined (접근 가능)\n' +
          'x = 10                    // 2단계: 할당\n' +
          '\n' +
          '// === let의 호이스팅 + TDZ ===\n' +
          '// 소스 코드:\n' +
          '// console.log(y); // ReferenceError\n' +
          '// let y = 20;\n' +
          '\n' +
          '// 엔진이 실제로 실행하는 순서:\n' +
          'declare y: <TDZ>          // 1단계: 선언만 (초기화 안됨)\n' +
          'console.log(y)            // ReferenceError! (TDZ 영역)\n' +
          'y = undefined             // 2단계: 초기화\n' +
          'y = 20                    // 3단계: 할당',
        description: "var는 선언과 초기화가 동시에 일어나지만, let/const는 선언과 초기화가 분리됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 클로저와 var의 함정",
      content:
        "가장 유명한 `var` 버그 중 하나를 살펴보고, `let`이 어떻게 이를 해결하는지 확인합니다.",
      code: {
        language: "javascript",
        code:
          '// ❌ var를 사용한 경우 — 의도와 다른 결과\n' +
          'for (var i = 0; i < 3; i++) {\n' +
          '  setTimeout(() => console.log(i), 100);\n' +
          '}\n' +
          '// 출력: 3, 3, 3 (모두 같은 i를 참조)\n' +
          '\n' +
          '// ✅ let을 사용한 경우 — 의도대로 동작\n' +
          'for (let j = 0; j < 3; j++) {\n' +
          '  setTimeout(() => console.log(j), 100);\n' +
          '}\n' +
          '// 출력: 0, 1, 2 (각 반복마다 새로운 j)\n' +
          '\n' +
          '// ✅ const와 객체 — 바인딩 vs 값\n' +
          'const user = { name: "Alice" };\n' +
          'user.name = "Bob";     // OK: 객체 내부 변경 가능\n' +
          '// user = {};          // TypeError: 바인딩 변경 불가',
        description: "for 루프에서 var는 하나의 변수를 공유하지만, let은 반복마다 새 바인딩을 생성합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 특성 | var | let | const |\n" +
        "|------|-----|-----|-------|\n" +
        "| 스코프 | 함수 | 블록 | 블록 |\n" +
        "| 중복 선언 | 허용 | 금지 | 금지 |\n" +
        "| 재할당 | 가능 | 가능 | 불가 |\n" +
        "| 호이스팅 | 선언+초기화 | 선언만(TDZ) | 선언만(TDZ) |\n" +
        "| 전역 객체 프로퍼티 | O | X | X |\n\n" +
        "**핵심:** `const`를 기본으로 사용하고, 재할당이 필요할 때만 `let`을 사용하세요. `var`는 레거시 코드 이해를 위해서만 알아두면 됩니다.\n\n" +
        "**다음 챕터 미리보기:** 데이터 타입을 배우면서, `const`로 선언한 변수에 어떤 종류의 값을 담을 수 있는지 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "var, let, const의 스코프 차이를 설명할 수 있다",
    "호이스팅과 TDZ의 동작 원리를 이해한다",
    "const의 불변성이 바인딩에 적용됨을 설명할 수 있다",
    "for 루프에서 var와 let의 클로저 차이를 설명할 수 있다",
    "실무에서 var 대신 let/const를 써야 하는 이유를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "다음 중 TDZ(Temporal Dead Zone)의 영향을 받는 키워드를 모두 고르면?",
      choices: ["var만", "let만", "let과 const", "var, let, const 모두"],
      correctIndex: 2,
      explanation: "let과 const는 호이스팅되지만 초기화 전까지 TDZ에 놓여 접근 시 ReferenceError가 발생합니다. var는 선언과 동시에 undefined로 초기화되어 TDZ가 없습니다.",
    },
    {
      id: "q2",
      question: "const로 선언한 객체의 프로퍼티를 변경하면?",
      choices: ["TypeError 발생", "정상 동작", "SyntaxError 발생", "undefined 반환"],
      correctIndex: 1,
      explanation: "const는 변수 바인딩을 불변으로 만들지, 값 자체를 불변으로 만들지 않습니다. 객체의 프로퍼티 수정은 바인딩 변경이 아니므로 허용됩니다.",
    },
    {
      id: "q3",
      question: "for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }의 출력은?",
      choices: ["0, 1, 2", "3, 3, 3", "undefined, undefined, undefined", "0, 0, 0"],
      correctIndex: 1,
      explanation: "var는 함수 스코프이므로 루프 전체에서 하나의 i를 공유합니다. setTimeout 콜백이 실행될 때 i는 이미 3이 되어 있습니다.",
    },
    {
      id: "q4",
      question: "let x = 1; let x = 2;를 같은 스코프에서 실행하면?",
      choices: ["x가 2로 업데이트됨", "SyntaxError 발생", "ReferenceError 발생", "TypeError 발생"],
      correctIndex: 1,
      explanation: "let과 const는 같은 스코프에서 중복 선언을 금지합니다. SyntaxError가 발생합니다.",
    },
    {
      id: "q5",
      question: "var로 전역에서 선언한 변수는 어디에 등록되는가?",
      choices: ["블록 스코프", "모듈 스코프", "window 객체(전역 객체)", "별도의 렉시컬 환경"],
      correctIndex: 2,
      explanation: "var로 전역에서 선언한 변수는 window(전역 객체)의 프로퍼티가 됩니다. let/const는 전역 렉시컬 환경에만 등록되어 window에 추가되지 않습니다.",
    },
  ],
};

export default chapter;
```

- [ ] **Step 3: Create JS chapter index with lazy loading**

Create `src/content/chapters/js/index.ts`:

```typescript
import type { Chapter } from "@/types/chapter";

type ChapterLoader = () => Promise<{ default: Chapter }>;

export const jsChapters: Record<string, ChapterLoader> = {
  "01-var-let-const": () => import("./01-var-let-const"),
  // Future chapters will be added here as they are written:
  // "02-data-types": () => import("./02-data-types"),
};
```

- [ ] **Step 4: Create chapter root index**

Create `src/content/chapters/index.ts`:

```typescript
import type { Chapter } from "@/types/chapter";
import type { Subject } from "@/types/chapter";
import { jsChapters } from "./js";

type ChapterLoader = () => Promise<{ default: Chapter }>;

const chapterLoaders: Record<Subject, Record<string, ChapterLoader>> = {
  js: jsChapters,
  react: {},
  next: {},
  cs: {},
  network: {},
  infra: {},
  typescript: {},
};

export async function loadChapter(subject: Subject, id: string): Promise<Chapter | null> {
  const subjectChapters = chapterLoaders[subject];
  const loader = subjectChapters?.[id];
  if (!loader) return null;

  const mod = await loader();
  return mod.default;
}

export function hasChapter(subject: Subject, id: string): boolean {
  return !!chapterLoaders[subject]?.[id];
}
```

- [ ] **Step 5: Create sample mid quiz**

Create `src/content/quizzes/js/mid/mid-01.ts`:

```typescript
import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-01",
  title: "중간 점검 1: 기초 ~ 스코프와 실행 컨텍스트",
  coverGroups: ["기초", "함수의 기본", "스코프와 실행 컨텍스트"],
  questions: [
    {
      id: "mid01-q1",
      question: "다음 코드의 출력 결과는?\n\nlet a = 1;\n{\n  let a = 2;\n  console.log(a);\n}\nconsole.log(a);",
      choices: ["2, 2", "2, 1", "1, 1", "ReferenceError"],
      correctIndex: 1,
      explanation: "let은 블록 스코프입니다. 블록 안의 a는 바깥의 a와 별개의 변수입니다.",
    },
  ],
};

export default midQuiz;
```

- [ ] **Step 6: Create sample final exam stub**

Create `src/content/quizzes/js/final.ts`:

```typescript
import type { FinalExam } from "@/types/quiz";

const finalExam: FinalExam = {
  type: "final",
  id: "final-exam",
  title: "JavaScript 종합 시험",
  questions: [
    {
      id: "final-q1",
      question: "JavaScript에서 typeof null의 결과는?",
      choices: ['"null"', '"undefined"', '"object"', '"boolean"'],
      correctIndex: 2,
      explanation: 'typeof null이 "object"를 반환하는 것은 JavaScript 초기 구현의 버그입니다. null은 원시값이지만 내부적으로 타입 태그가 객체와 동일하게 0이었기 때문입니다.',
    },
  ],
};

export default finalExam;
```

- [ ] **Step 7: Create quiz index**

Create `src/content/quizzes/index.ts`:

```typescript
import type { Subject } from "@/types/chapter";
import type { MidQuiz, FinalExam } from "@/types/quiz";

type MidQuizLoader = () => Promise<{ default: MidQuiz }>;
type FinalExamLoader = () => Promise<{ default: FinalExam }>;

const midQuizLoaders: Record<Subject, Record<string, MidQuizLoader>> = {
  js: {
    "mid-01": () => import("./js/mid/mid-01"),
  },
  react: {},
  next: {},
  cs: {},
  network: {},
  infra: {},
  typescript: {},
};

const finalExamLoaders: Record<Subject, FinalExamLoader | null> = {
  js: () => import("./js/final"),
  react: null,
  next: null,
  cs: null,
  network: null,
  infra: null,
  typescript: null,
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
```

- [ ] **Step 8: Create useChapter hook**

Create `src/hooks/useChapter.ts`:

```typescript
import { useState, useEffect } from "react";
import type { Chapter, Subject } from "@/types/chapter";
import { loadChapter } from "@/content/chapters";
import { roadmaps } from "@/content/roadmap";

export function useChapter(subject: Subject, id: string) {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadChapter(subject, id)
      .then(setChapter)
      .finally(() => setLoading(false));
  }, [subject, id]);

  return { chapter, loading };
}

export function getAdjacentChapters(
  subject: Subject,
  currentId: string,
): { prev: string | null; next: string | null } {
  const groups = roadmaps[subject];
  const allChapterIds = groups.flatMap((g) => g.chapters);
  const currentIndex = allChapterIds.indexOf(currentId);

  return {
    prev: currentIndex > 0 ? allChapterIds[currentIndex - 1] : null,
    next: currentIndex < allChapterIds.length - 1 ? allChapterIds[currentIndex + 1] : null,
  };
}

export function getChapterTitle(subject: Subject, id: string): string {
  // Derive a readable title from the id as fallback
  return id.replace(/^\d+-/, "").replace(/-/g, " ");
}
```

- [ ] **Step 9: Verify compilation**

```bash
cd /Users/iscreamarts/Documents/git/ebook
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 10: Commit**

```bash
git add src/content/ src/hooks/useChapter.ts
git commit -m "feat: add content system with roadmap, sample chapter, quizzes, and chapter hook"
```

---

### Task 6: Common Components

**Files:**
- Create: `src/components/common/Spinner.tsx`, `src/components/layout/Header.tsx`, `src/components/chapter/CodeBlock.tsx`

- [ ] **Step 1: Create Spinner component**

Create `src/components/common/Spinner.tsx`:

```tsx
export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`size-6 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      role="status"
      aria-label="로딩 중"
    />
  );
}
```

- [ ] **Step 2: Create Header component**

Create `src/components/layout/Header.tsx`:

```tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: string;
}

export default function Header({ title, subtitle, showBack = true, backTo }: HeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-zinc-200 bg-white/95 px-4 py-2 backdrop-blur">
      {showBack && (
        <button
          type="button"
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          className="flex items-center gap-1.5 rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
          aria-label="뒤로"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-700">{title}</p>
        {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
      </div>
      <button
        type="button"
        onClick={logout}
        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
      >
        로그아웃
      </button>
    </header>
  );
}
```

- [ ] **Step 3: Create CodeBlock component**

Create `src/components/chapter/CodeBlock.tsx`:

```tsx
import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";

interface CodeBlockProps {
  code: string;
  language: "typescript" | "javascript";
  description?: string;
}

export default function CodeBlock({ code, language, description }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <div className="my-4">
      {description && (
        <p className="mb-2 text-sm text-zinc-500">{description}</p>
      )}
      <pre className={`language-${language}`}>
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
```

- [ ] **Step 4: Verify compilation**

```bash
cd /Users/iscreamarts/Documents/git/ebook
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/common/ src/components/layout/ src/components/chapter/CodeBlock.tsx
git commit -m "feat: add Spinner, Header, and CodeBlock components"
```

---

### Task 7: Login Page

**Files:**
- Create: `src/pages/LoginPage.tsx`

- [ ] **Step 1: Create LoginPage**

Create `src/pages/LoginPage.tsx`:

```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (login(id, password)) {
      navigate("/home");
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#fafafa] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[320px]"
      >
        {/* Logo */}
        <div className="mb-8">
          <p className="text-[13px] tracking-[4px] text-zinc-400 font-light uppercase">
            JavaScript
          </p>
          <h1 className="mt-1 text-[28px] font-bold tracking-tight text-zinc-900">
            Deep Dive
          </h1>
          <div className="mt-2 h-[3px] w-8 bg-zinc-900" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1.5 block text-[11px] tracking-[1px] text-zinc-400 uppercase">
              ID
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              autoComplete="username"
              required
              className="w-full border-0 border-b-[1.5px] border-zinc-300 bg-transparent py-2.5 text-[15px] text-zinc-900 outline-none transition focus:border-zinc-900"
            />
          </div>

          <div className="mb-8">
            <label className="mb-1.5 block text-[11px] tracking-[1px] text-zinc-400 uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full border-0 border-b-[1.5px] border-zinc-300 bg-transparent py-2.5 text-[15px] text-zinc-900 outline-none transition focus:border-zinc-900"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-sm text-red-500"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-sm bg-zinc-900 text-[14px] font-medium tracking-[1px] text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "확인 중..." : "로그인"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Wire LoginPage into App.tsx**

Replace `src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ProgressProvider } from "@/hooks/useProgress";
import LoginPage from "@/pages/LoginPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authenticated } = useAuth();
  if (!authenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { authenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={authenticated ? <Navigate to="/home" replace /> : <LoginPage />} />
      <Route path="/home" element={<ProtectedRoute><div className="p-4">Home (coming soon)</div></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <AppRoutes />
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

- [ ] **Step 3: Verify login flow in browser**

```bash
cd /Users/iscreamarts/Documents/git/ebook
npm run dev
```

Expected: Login page renders with minimal center design. Enter credentials → redirects to /home placeholder.

- [ ] **Step 4: Commit**

```bash
git add src/pages/LoginPage.tsx src/App.tsx
git commit -m "feat: add login page with minimal center design"
```

---

### Task 8: Roadmap Components

**Files:**
- Create: `src/components/roadmap/ProgressRing.tsx`, `src/components/roadmap/RoadmapCard.tsx`, `src/components/roadmap/MidQuizBanner.tsx`

- [ ] **Step 1: Create ProgressRing**

Create `src/components/roadmap/ProgressRing.tsx`:

```tsx
interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
}

export default function ProgressRing({ percent, size = 52, strokeWidth = 4 }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#6366f1"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-500">
        {percent}%
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create RoadmapCard**

Create `src/components/roadmap/RoadmapCard.tsx`:

```tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Subject } from "@/types/chapter";
import type { AppProgress } from "@/types/progress";
import { hasChapter } from "@/content/chapters";

interface RoadmapCardProps {
  group: string;
  chapters: string[];
  subject: Subject;
  progress: AppProgress;
  index: number;
}

type ChapterStatus = "completed" | "in-progress" | "locked";

function getChapterStatus(chapterId: string, subject: Subject, progress: AppProgress): ChapterStatus {
  const chapterProgress = progress.chapters[chapterId];
  if (chapterProgress?.isRead) return "completed";
  if (chapterProgress) return "in-progress";
  return "locked";
}

const statusStyles: Record<ChapterStatus, string> = {
  completed: "bg-indigo-50 text-indigo-600",
  "in-progress": "bg-orange-50 text-orange-600",
  locked: "bg-zinc-100 text-zinc-400",
};

const dotStyles: Record<ChapterStatus, string> = {
  completed: "bg-indigo-500",
  "in-progress": "bg-orange-500",
  locked: "bg-zinc-300",
};

export default function RoadmapCard({ group, chapters, subject, progress, index }: RoadmapCardProps) {
  const completedCount = chapters.filter(
    (id) => progress.chapters[id]?.isRead,
  ).length;
  const progressPercent = chapters.length > 0 ? Math.round((completedCount / chapters.length) * 100) : 0;
  const isFullyLocked = completedCount === 0 && index > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`rounded-xl bg-white p-4 shadow-sm ${isFullyLocked ? "opacity-50" : ""}`}
    >
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900">{group}</h3>
        <span className="text-xs font-medium text-indigo-500">
          {completedCount}/{chapters.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3 h-[3px] rounded-full bg-zinc-100">
        <div
          className="h-[3px] rounded-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Chapter pills */}
      <div className="flex flex-wrap gap-2">
        {chapters.map((id) => {
          const status = getChapterStatus(id, subject, progress);
          const chapterExists = hasChapter(subject, id);
          const label = id.replace(/^\d+-/, "").replace(/-/g, " ");

          const pill = (
            <span
              key={id}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ${statusStyles[status]}`}
            >
              <span className={`size-1.5 rounded-full ${dotStyles[status]}`} />
              {label}
            </span>
          );

          if (chapterExists && status !== "locked") {
            return (
              <Link key={id} to={`/chapter/${subject}/${id}`}>
                {pill}
              </Link>
            );
          }

          return pill;
        })}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Create MidQuizBanner**

Create `src/components/roadmap/MidQuizBanner.tsx`:

```tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Subject } from "@/types/chapter";
import type { AppProgress } from "@/types/progress";
import type { MidQuizDef } from "@/content/roadmap";

interface MidQuizBannerProps {
  quiz: MidQuizDef;
  subject: Subject;
  progress: AppProgress;
  allChaptersInGroups: string[];
  index: number;
}

export default function MidQuizBanner({
  quiz,
  subject,
  progress,
  allChaptersInGroups,
  index,
}: MidQuizBannerProps) {
  const allComplete = allChaptersInGroups.every(
    (id) => progress.chapters[id]?.isRead,
  );
  const quizDone = !!progress.quizzes[quiz.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      {allComplete ? (
        <Link
          to={`/quiz/mid/${subject}/${quiz.id}`}
          className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm border-l-[3px] border-yellow-400 transition hover:shadow-md"
        >
          <span className="text-lg">{quizDone ? "✅" : "🏆"}</span>
          <div>
            <p className="text-xs font-semibold text-zinc-900">{quiz.title}</p>
            <p className="text-[10px] text-zinc-500">
              {quizDone
                ? `${progress.quizzes[quiz.id].score.correct}/${progress.quizzes[quiz.id].score.total}점`
                : quiz.coverGroups.join(" + ")}
            </p>
          </div>
        </Link>
      ) : (
        <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm border-l-[3px] border-zinc-200 opacity-50">
          <span className="text-lg">🔒</span>
          <div>
            <p className="text-xs font-semibold text-zinc-900">{quiz.title}</p>
            <p className="text-[10px] text-zinc-500">잠김</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 4: Verify compilation**

```bash
cd /Users/iscreamarts/Documents/git/ebook
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/roadmap/
git commit -m "feat: add ProgressRing, RoadmapCard, and MidQuizBanner components"
```

---

### Task 9: Home Page (Roadmap)

**Files:**
- Create: `src/pages/HomePage.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create HomePage**

Create `src/pages/HomePage.tsx`:

```tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Subject } from "@/types/chapter";
import { roadmaps, midQuizzes, getTotalChapters } from "@/content/roadmap";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import ProgressRing from "@/components/roadmap/ProgressRing";
import RoadmapCard from "@/components/roadmap/RoadmapCard";
import MidQuizBanner from "@/components/roadmap/MidQuizBanner";

const AVAILABLE_SUBJECTS: { key: Subject; label: string }[] = [
  { key: "js", label: "JavaScript" },
  // Future subjects:
  // { key: "react", label: "React" },
  // { key: "typescript", label: "TypeScript" },
];

export default function HomePage() {
  const [subject, setSubject] = useState<Subject>("js");
  const { progress, getSubjectStats } = useProgress();
  const { logout } = useAuth();
  const groups = roadmaps[subject];
  const midQuizList = midQuizzes[subject];
  const totalChapters = getTotalChapters(subject);
  const stats = getSubjectStats(subject, totalChapters);

  // Build a lookup: afterGroup → MidQuizDef
  const midQuizAfterGroup = new Map(midQuizList.map((q) => [q.afterGroup, q]));

  // Collect all chapter IDs up to and including each mid quiz's groups
  function getChaptersInGroups(coverGroups: string[]): string[] {
    return groups
      .filter((g) => coverGroups.includes(g.group))
      .flatMap((g) => g.chapters);
  }

  let renderIndex = 0;

  return (
    <div className="min-h-[100dvh] bg-[#fafafa]">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">학습 로드맵</h1>
            <p className="mt-0.5 text-xs text-zinc-500">
              {stats.completed} / {stats.total} 챕터 완료
            </p>
          </div>
          <ProgressRing percent={stats.percent} />
        </div>

        {/* Subject tabs */}
        {AVAILABLE_SUBJECTS.length > 1 && (
          <div className="mt-4 flex gap-2">
            {AVAILABLE_SUBJECTS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSubject(s.key)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  subject === s.key
                    ? "bg-zinc-900 text-white"
                    : "bg-white text-zinc-500 hover:bg-zinc-100"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Roadmap cards */}
      <div className="px-4 pb-8">
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {groups.map((group) => {
              const cardIndex = renderIndex++;
              const midQuiz = midQuizAfterGroup.get(group.group);
              const bannerIndex = midQuiz ? renderIndex++ : -1;

              return (
                <div key={group.group}>
                  <RoadmapCard
                    group={group.group}
                    chapters={group.chapters}
                    subject={subject}
                    progress={progress}
                    index={cardIndex}
                  />
                  {midQuiz && (
                    <div className="mt-3">
                      <MidQuizBanner
                        quiz={midQuiz}
                        subject={subject}
                        progress={progress}
                        allChaptersInGroups={getChaptersInGroups(midQuiz.coverGroups)}
                        index={bannerIndex}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </AnimatePresence>

          {/* Final Exam Banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: renderIndex * 0.05, duration: 0.3 }}
          >
            {stats.percent === 100 ? (
              <Link
                to={`/quiz/final/${subject}`}
                className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border-l-[3px] border-indigo-500 transition hover:shadow-md"
              >
                <span className="text-xl">🎓</span>
                <div>
                  <p className="text-sm font-bold text-zinc-900">최종 시험</p>
                  <p className="text-xs text-zinc-500">JavaScript 전 범위 총망라</p>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border-l-[3px] border-zinc-200 opacity-40">
                <span className="text-xl">🔒</span>
                <div>
                  <p className="text-sm font-bold text-zinc-900">최종 시험</p>
                  <p className="text-xs text-zinc-500">모든 챕터를 완료하면 해금됩니다</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Logout button */}
      <div className="fixed bottom-4 right-4">
        <button
          type="button"
          onClick={logout}
          className="rounded-full bg-white px-4 py-2 text-xs font-medium text-zinc-500 shadow-sm transition hover:bg-zinc-100"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire HomePage into App.tsx**

In `src/App.tsx`, add the import and route:

```tsx
import HomePage from "@/pages/HomePage";
```

Replace the `/home` route placeholder:

```tsx
<Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
```

- [ ] **Step 3: Verify roadmap renders in browser**

```bash
cd /Users/iscreamarts/Documents/git/ebook
npm run dev
```

Expected: After login, see card-based roadmap with progress ring showing 0%. JS groups listed with chapter pills.

- [ ] **Step 4: Commit**

```bash
git add src/pages/HomePage.tsx src/App.tsx
git commit -m "feat: add home page with card-based roadmap and progress ring"
```

---

### Task 10: Chapter Components

**Files:**
- Create: `src/components/chapter/SectionProgress.tsx`, `src/components/chapter/ConnectionHint.tsx`, `src/components/chapter/SectionRenderer.tsx`, `src/components/chapter/ChapterNav.tsx`, `src/components/chapter/Checklist.tsx`

- [ ] **Step 1: Create SectionProgress**

Create `src/components/chapter/SectionProgress.tsx`:

```tsx
interface SectionProgressProps {
  total: number;
  current: number;
}

export default function SectionProgress({ total, current }: SectionProgressProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
            i <= current ? "bg-indigo-500" : "bg-zinc-200"
          }`}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create ConnectionHint**

Create `src/components/chapter/ConnectionHint.tsx`:

```tsx
import { Link } from "react-router-dom";
import type { Subject } from "@/types/chapter";

interface ConnectionHintProps {
  prevChapterId: string | null;
  prevChapterTitle: string;
  nextChapterHint?: string;
  subject: Subject;
}

export default function ConnectionHint({
  prevChapterId,
  prevChapterTitle,
  nextChapterHint,
  subject,
}: ConnectionHintProps) {
  if (!prevChapterId && !nextChapterHint) return null;

  return (
    <div className="mb-6 rounded-lg bg-indigo-50 px-4 py-3">
      {prevChapterId && (
        <p className="text-xs text-indigo-600">
          💡 이전 챕터{" "}
          <Link
            to={`/chapter/${subject}/${prevChapterId}`}
            className="font-medium underline"
          >
            {prevChapterTitle}
          </Link>
          에서 이어지는 내용입니다
        </p>
      )}
      {nextChapterHint && (
        <p className="mt-1 text-xs text-indigo-500">
          → 이 챕터를 학습하면 다음으로 자연스럽게 이어집니다
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create SectionRenderer**

Create `src/components/chapter/SectionRenderer.tsx`:

```tsx
import type { ChapterSection } from "@/types/chapter";
import CodeBlock from "./CodeBlock";

const sectionIcons: Record<string, string> = {
  analogy: "🎨",
  problem: "🎯",
  solution: "💡",
  pseudocode: "⚙️",
  practice: "🛠️",
  summary: "📋",
  checklist: "✅",
};

const sectionLabels: Record<string, string> = {
  analogy: "비유로 이해하기",
  problem: "문제 정의",
  solution: "해결 방법",
  pseudocode: "기술 구현",
  practice: "실습 예제",
  summary: "전체 요약",
  checklist: "학습 체크리스트",
};

interface SectionRendererProps {
  section: ChapterSection;
}

export default function SectionRenderer({ section }: SectionRendererProps) {
  const icon = sectionIcons[section.type] ?? "";
  const label = sectionLabels[section.type] ?? section.title;

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h2 className="text-lg font-bold text-zinc-900">{section.title || label}</h2>
      </div>

      {/* Content as pre-formatted text with line breaks */}
      {section.content && (
        <div className="prose-like text-[15px] leading-7 text-zinc-700 whitespace-pre-line">
          {section.content}
        </div>
      )}

      {/* Code block if present */}
      {section.code && (
        <CodeBlock
          code={section.code.code}
          language={section.code.language}
          description={section.code.description}
        />
      )}
    </section>
  );
}
```

- [ ] **Step 4: Create ChapterNav**

Create `src/components/chapter/ChapterNav.tsx`:

```tsx
import { Link } from "react-router-dom";
import type { Subject } from "@/types/chapter";

interface ChapterNavProps {
  subject: Subject;
  prevId: string | null;
  nextId: string | null;
}

export default function ChapterNav({ subject, prevId, nextId }: ChapterNavProps) {
  return (
    <nav className="mt-12 mb-8 flex items-stretch gap-3 border-t border-zinc-200 pt-8">
      {prevId ? (
        <Link
          to={`/chapter/${subject}/${prevId}`}
          className="group flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-zinc-200 px-4 py-4 transition hover:border-zinc-400 hover:bg-zinc-50"
        >
          <svg className="size-5 shrink-0 text-zinc-400 transition group-hover:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-400">이전 챕터</p>
            <p className="truncate text-sm font-medium text-zinc-700">
              {prevId.replace(/^\d+-/, "").replace(/-/g, " ")}
            </p>
          </div>
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-zinc-100 px-4 py-4 opacity-40">
          <svg className="size-5 shrink-0 text-zinc-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          <p className="text-xs font-medium text-zinc-300">이전 챕터</p>
        </div>
      )}

      {nextId ? (
        <Link
          to={`/chapter/${subject}/${nextId}`}
          className="group flex min-w-0 flex-1 items-center justify-end gap-2 rounded-2xl border border-zinc-200 px-4 py-4 text-right transition hover:border-zinc-400 hover:bg-zinc-50"
        >
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-400">다음 챕터</p>
            <p className="truncate text-sm font-medium text-zinc-700">
              {nextId.replace(/^\d+-/, "").replace(/-/g, " ")}
            </p>
          </div>
          <svg className="size-5 shrink-0 text-zinc-400 transition group-hover:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 rounded-2xl border border-zinc-100 px-4 py-4 opacity-40">
          <p className="text-xs font-medium text-zinc-300">다음 챕터</p>
          <svg className="size-5 shrink-0 text-zinc-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 5: Create Checklist**

Create `src/components/chapter/Checklist.tsx`:

```tsx
import type { Subject } from "@/types/chapter";
import { useProgress } from "@/hooks/useProgress";

interface ChecklistProps {
  chapterId: string;
  subject: Subject;
  items: string[];
}

export default function Checklist({ chapterId, subject, items }: ChecklistProps) {
  const { progress, setChecklist } = useProgress();
  const chapterProgress = progress.chapters[chapterId];
  const completed = chapterProgress?.checklistCompleted ?? items.map(() => false);

  function toggle(index: number) {
    const next = [...completed];
    // Pad if needed
    while (next.length < items.length) next.push(false);
    next[index] = !next[index];
    setChecklist(chapterId, subject, next);
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <label
          key={i}
          className="flex items-start gap-3 rounded-lg p-2 transition hover:bg-zinc-50 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={completed[i] ?? false}
            onChange={() => toggle(i)}
            className="mt-0.5 size-4 rounded border-zinc-300 text-indigo-500 focus:ring-indigo-500"
          />
          <span className={`text-sm leading-6 ${completed[i] ? "text-zinc-400 line-through" : "text-zinc-700"}`}>
            {item}
          </span>
        </label>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Verify compilation**

```bash
cd /Users/iscreamarts/Documents/git/ebook
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/chapter/
git commit -m "feat: add chapter components (SectionProgress, ConnectionHint, SectionRenderer, ChapterNav, Checklist)"
```

---

### Task 11: Chapter Page

**Files:**
- Create: `src/pages/ChapterPage.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create ChapterPage**

Create `src/pages/ChapterPage.tsx`:

```tsx
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Subject } from "@/types/chapter";
import { useChapter, getAdjacentChapters } from "@/hooks/useChapter";
import { useProgress } from "@/hooks/useProgress";
import Spinner from "@/components/common/Spinner";
import SectionProgress from "@/components/chapter/SectionProgress";
import ConnectionHint from "@/components/chapter/ConnectionHint";
import SectionRenderer from "@/components/chapter/SectionRenderer";
import ChapterNav from "@/components/chapter/ChapterNav";
import Checklist from "@/components/chapter/Checklist";

export default function ChapterPage() {
  const { subject, id } = useParams<{ subject: string; id: string }>();
  const navigate = useNavigate();
  const { chapter, loading } = useChapter(subject as Subject, id!);
  const { markRead } = useProgress();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);

  const { prev, next } = getAdjacentChapters(subject as Subject, id!);

  // Mark as read when component mounts with valid chapter
  useEffect(() => {
    if (chapter) {
      markRead(chapter.id, chapter.subject);
    }
  }, [chapter, markRead]);

  // Scroll to top when chapter changes
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    setCurrentSection(0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#fafafa]">
        <Spinner className="text-zinc-400" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[#fafafa] px-4">
        <p className="text-zinc-500">챕터를 찾을 수 없습니다.</p>
        <Link to="/home" className="text-sm font-medium text-indigo-500">
          로드맵으로 돌아가기
        </Link>
      </div>
    );
  }

  // Filter out "checklist" type — we render it separately
  const contentSections = chapter.sections.filter((s) => s.type !== "checklist");

  return (
    <div className="min-h-[100dvh] bg-[#fafafa]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 px-4 py-2 backdrop-blur">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100"
            aria-label="로드맵"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-700">{chapter.title}</p>
            <p className="text-xs text-zinc-500">⏱ 약 {chapter.estimatedMinutes}분 · {chapter.group}</p>
          </div>
          <span className="text-xs text-zinc-400">{currentSection + 1}/{contentSections.length}</span>
        </div>
        <div className="mt-2">
          <SectionProgress total={contentSections.length} current={currentSection} />
        </div>
      </header>

      {/* Content */}
      <div
        ref={scrollRef}
        className="overflow-y-auto px-4 pt-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))]"
        style={{ height: "calc(100dvh - 80px)", WebkitOverflowScrolling: "touch" }}
      >
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-3xl"
        >
          {/* Connection hint */}
          <ConnectionHint
            prevChapterId={prev}
            prevChapterTitle={prev?.replace(/^\d+-/, "").replace(/-/g, " ") ?? ""}
            nextChapterHint={next ? "다음 챕터" : undefined}
            subject={subject as Subject}
          />

          {/* Sections */}
          {contentSections.map((section, i) => (
            <div
              key={i}
              onFocus={() => setCurrentSection(i)}
              onMouseEnter={() => setCurrentSection(i)}
            >
              <SectionRenderer section={section} />
            </div>
          ))}

          {/* Checklist */}
          {chapter.checklist.length > 0 && (
            <section className="mb-10">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-lg">✅</span>
                <h2 className="text-lg font-bold text-zinc-900">학습 체크리스트</h2>
              </div>
              <Checklist
                chapterId={chapter.id}
                subject={chapter.subject}
                items={chapter.checklist}
              />
            </section>
          )}

          {/* Quiz button */}
          {chapter.quiz.length > 0 && (
            <div className="mb-8 text-center">
              <Link
                to={`/quiz/chapter/${subject}/${id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
              >
                📝 챕터 퀴즈 풀기 ({chapter.quiz.length}문항)
              </Link>
            </div>
          )}

          {/* Chapter navigation */}
          <ChapterNav subject={subject as Subject} prevId={prev} nextId={next} />
        </motion.article>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add ChapterPage route to App.tsx**

Add import at top of `src/App.tsx`:

```tsx
import ChapterPage from "@/pages/ChapterPage";
```

Add route inside `<Routes>`:

```tsx
<Route path="/chapter/:subject/:id" element={<ProtectedRoute><ChapterPage /></ProtectedRoute>} />
```

- [ ] **Step 3: Verify chapter renders in browser**

```bash
cd /Users/iscreamarts/Documents/git/ebook
npm run dev
```

Expected: Navigate to `/chapter/js/01-var-let-const` after login. Chapter content renders with sections, progress bar, checklist, and quiz button.

- [ ] **Step 4: Commit**

```bash
git add src/pages/ChapterPage.tsx src/App.tsx
git commit -m "feat: add chapter reader page with section progress and navigation"
```

---

### Task 12: Quiz Components

**Files:**
- Create: `src/components/quiz/QuizProgress.tsx`, `src/components/quiz/QuizQuestion.tsx`, `src/components/quiz/QuizResult.tsx`

- [ ] **Step 1: Create QuizProgress**

Create `src/components/quiz/QuizProgress.tsx`:

```tsx
interface QuizProgressProps {
  current: number;
  total: number;
}

export default function QuizProgress({ current, total }: QuizProgressProps) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-sm text-zinc-500">
        문항 <span className="font-semibold text-zinc-700">{current}</span> / {total}
      </p>
      <div className="h-[3px] rounded-full bg-zinc-100">
        <div
          className="h-[3px] rounded-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create QuizQuestion**

Create `src/components/quiz/QuizQuestion.tsx`:

```tsx
import { useState } from "react";
import { motion } from "framer-motion";
import type { QuizQuestion as QuizQuestionType } from "@/types/quiz";

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (isCorrect: boolean) => void;
}

export default function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function handleSelect(index: number) {
    if (revealed) return;
    setSelected(index);
    setRevealed(true);

    // Delay before moving to next question
    setTimeout(() => {
      onAnswer(index === question.correctIndex);
    }, 2000);
  }

  function getChoiceStyle(index: number): string {
    const base = "w-full rounded-xl border px-4 py-3 text-left text-sm transition";

    if (!revealed) {
      if (selected === index) return `${base} border-indigo-500 bg-indigo-50 text-indigo-700 font-medium`;
      return `${base} border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50`;
    }

    if (index === question.correctIndex) {
      return `${base} border-green-400 bg-green-50 text-green-700 font-medium`;
    }

    if (selected === index && index !== question.correctIndex) {
      return `${base} border-red-400 bg-red-50 text-red-700`;
    }

    return `${base} border-zinc-100 text-zinc-400`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <p className="mb-6 text-[15px] font-medium leading-7 text-zinc-900 whitespace-pre-line">
        {question.question}
      </p>

      <div className="flex flex-col gap-3">
        {question.choices.map((choice, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelect(i)}
            disabled={revealed}
            className={getChoiceStyle(i)}
          >
            <span className="mr-2 font-medium text-zinc-400">{String.fromCharCode(65 + i)}.</span>
            {choice}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 rounded-lg p-4 text-sm leading-6 ${
            selected === question.correctIndex
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          <p className="font-semibold">
            {selected === question.correctIndex ? "✅ 정답!" : "❌ 오답"}
          </p>
          <p className="mt-1">{question.explanation}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 3: Create QuizResult**

Create `src/components/quiz/QuizResult.tsx`:

```tsx
import { motion } from "framer-motion";
import type { QuizQuestion } from "@/types/quiz";

interface QuizResultProps {
  questions: QuizQuestion[];
  answers: boolean[];
  onRetry: () => void;
  onDone: () => void;
}

export default function QuizResult({ questions, answers, onRetry, onDone }: QuizResultProps) {
  const correct = answers.filter(Boolean).length;
  const total = questions.length;
  const percent = Math.round((correct / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Score */}
      <div className="mb-8 text-center">
        <p className="text-5xl font-bold text-zinc-900">{correct}/{total}</p>
        <p className="mt-2 text-sm text-zinc-500">{percent}% 정답</p>
        <div className="mx-auto mt-4 h-2 w-48 rounded-full bg-zinc-100">
          <div
            className={`h-2 rounded-full transition-all duration-700 ${
              percent >= 80 ? "bg-green-500" : percent >= 50 ? "bg-yellow-500" : "bg-red-500"
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Question review */}
      <div className="space-y-4">
        {questions.map((q, i) => (
          <div
            key={q.id}
            className={`rounded-lg border p-4 ${
              answers[i] ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
            }`}
          >
            <p className="text-sm font-medium text-zinc-900">
              {answers[i] ? "✅" : "❌"} Q{i + 1}. {q.question.split("\n")[0]}
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              정답: {String.fromCharCode(65 + q.correctIndex)}. {q.choices[q.correctIndex]}
            </p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="flex-1 rounded-xl border border-zinc-200 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          다시 풀기
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex-1 rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          완료
        </button>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 4: Verify compilation**

```bash
cd /Users/iscreamarts/Documents/git/ebook
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/quiz/
git commit -m "feat: add quiz components (QuizProgress, QuizQuestion, QuizResult)"
```

---

### Task 13: Quiz Pages

**Files:**
- Create: `src/pages/ChapterQuizPage.tsx`, `src/pages/MidQuizPage.tsx`, `src/pages/FinalExamPage.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create ChapterQuizPage**

Create `src/pages/ChapterQuizPage.tsx`:

```tsx
import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import type { Subject } from "@/types/chapter";
import { useChapter } from "@/hooks/useChapter";
import { useProgress } from "@/hooks/useProgress";
import Spinner from "@/components/common/Spinner";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import QuizResult from "@/components/quiz/QuizResult";

export default function ChapterQuizPage() {
  const { subject, id } = useParams<{ subject: string; id: string }>();
  const navigate = useNavigate();
  const { chapter, loading } = useChapter(subject as Subject, id!);
  const { saveChapterQuiz } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      const nextAnswers = [...answers, isCorrect];
      setAnswers(nextAnswers);

      if (!chapter) return;

      if (currentIndex + 1 >= chapter.quiz.length) {
        const correct = nextAnswers.filter(Boolean).length;
        saveChapterQuiz(chapter.id, chapter.subject, {
          correct,
          total: chapter.quiz.length,
          answeredAt: Date.now(),
        });
        setFinished(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [answers, currentIndex, chapter, saveChapterQuiz],
  );

  function handleRetry() {
    setCurrentIndex(0);
    setAnswers([]);
    setFinished(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#fafafa]">
        <Spinner className="text-zinc-400" />
      </div>
    );
  }

  if (!chapter || chapter.quiz.length === 0) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#fafafa] px-4">
        <p className="text-zinc-500">퀴즈가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#fafafa]">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold text-zinc-900">📝 챕터 퀴즈</h1>
          <button
            type="button"
            onClick={() => navigate(`/chapter/${subject}/${id}`)}
            className="text-xs text-zinc-400 transition hover:text-zinc-600"
          >
            닫기
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6">
        {finished ? (
          <QuizResult
            questions={chapter.quiz}
            answers={answers}
            onRetry={handleRetry}
            onDone={() => navigate("/home")}
          />
        ) : (
          <>
            <QuizProgress current={currentIndex + 1} total={chapter.quiz.length} />
            <AnimatePresence mode="wait">
              <QuizQuestion
                key={currentIndex}
                question={chapter.quiz[currentIndex]}
                onAnswer={handleAnswer}
              />
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create MidQuizPage**

Create `src/pages/MidQuizPage.tsx`:

```tsx
import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import type { Subject } from "@/types/chapter";
import type { MidQuiz } from "@/types/quiz";
import { loadMidQuiz } from "@/content/quizzes";
import { useProgress } from "@/hooks/useProgress";
import Spinner from "@/components/common/Spinner";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import QuizResult from "@/components/quiz/QuizResult";

export default function MidQuizPage() {
  const { subject, id } = useParams<{ subject: string; id: string }>();
  const navigate = useNavigate();
  const { saveQuiz } = useProgress();
  const [quiz, setQuiz] = useState<MidQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    loadMidQuiz(subject as Subject, id!)
      .then(setQuiz)
      .finally(() => setLoading(false));
  }, [subject, id]);

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      const nextAnswers = [...answers, isCorrect];
      setAnswers(nextAnswers);

      if (!quiz) return;

      if (currentIndex + 1 >= quiz.questions.length) {
        const correct = nextAnswers.filter(Boolean).length;
        saveQuiz(quiz.id, subject as Subject, {
          correct,
          total: quiz.questions.length,
          answeredAt: Date.now(),
        });
        setFinished(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [answers, currentIndex, quiz, subject, saveQuiz],
  );

  function handleRetry() {
    setCurrentIndex(0);
    setAnswers([]);
    setFinished(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#fafafa]">
        <Spinner className="text-zinc-400" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#fafafa] px-4">
        <p className="text-zinc-500">퀴즈를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#fafafa]">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-zinc-900">🏆 {quiz.title}</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="text-xs text-zinc-400 transition hover:text-zinc-600"
          >
            닫기
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6">
        {finished ? (
          <QuizResult
            questions={quiz.questions}
            answers={answers}
            onRetry={handleRetry}
            onDone={() => navigate("/home")}
          />
        ) : (
          <>
            <QuizProgress current={currentIndex + 1} total={quiz.questions.length} />
            <AnimatePresence mode="wait">
              <QuizQuestion
                key={currentIndex}
                question={quiz.questions[currentIndex]}
                onAnswer={handleAnswer}
              />
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create FinalExamPage**

Create `src/pages/FinalExamPage.tsx`:

```tsx
import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import type { Subject } from "@/types/chapter";
import type { FinalExam } from "@/types/quiz";
import { loadFinalExam } from "@/content/quizzes";
import { useProgress } from "@/hooks/useProgress";
import Spinner from "@/components/common/Spinner";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import QuizResult from "@/components/quiz/QuizResult";

export default function FinalExamPage() {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const { saveQuiz } = useProgress();
  const [exam, setExam] = useState<FinalExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    loadFinalExam(subject as Subject)
      .then(setExam)
      .finally(() => setLoading(false));
  }, [subject]);

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      const nextAnswers = [...answers, isCorrect];
      setAnswers(nextAnswers);

      if (!exam) return;

      if (currentIndex + 1 >= exam.questions.length) {
        const correct = nextAnswers.filter(Boolean).length;
        saveQuiz(exam.id, subject as Subject, {
          correct,
          total: exam.questions.length,
          answeredAt: Date.now(),
        });
        setFinished(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [answers, currentIndex, exam, subject, saveQuiz],
  );

  function handleRetry() {
    setCurrentIndex(0);
    setAnswers([]);
    setFinished(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#fafafa]">
        <Spinner className="text-zinc-400" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#fafafa] px-4">
        <p className="text-zinc-500">최종 시험을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#fafafa]">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold text-zinc-900">🎓 {exam.title}</h1>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="text-xs text-zinc-400 transition hover:text-zinc-600"
          >
            닫기
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6">
        {finished ? (
          <QuizResult
            questions={exam.questions}
            answers={answers}
            onRetry={handleRetry}
            onDone={() => navigate("/home")}
          />
        ) : (
          <>
            <QuizProgress current={currentIndex + 1} total={exam.questions.length} />
            <AnimatePresence mode="wait">
              <QuizQuestion
                key={currentIndex}
                question={exam.questions[currentIndex]}
                onAnswer={handleAnswer}
              />
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Add all quiz routes to App.tsx**

Add imports at top of `src/App.tsx`:

```tsx
import ChapterQuizPage from "@/pages/ChapterQuizPage";
import MidQuizPage from "@/pages/MidQuizPage";
import FinalExamPage from "@/pages/FinalExamPage";
```

Add routes inside `<Routes>`:

```tsx
<Route path="/quiz/chapter/:subject/:id" element={<ProtectedRoute><ChapterQuizPage /></ProtectedRoute>} />
<Route path="/quiz/mid/:subject/:id" element={<ProtectedRoute><MidQuizPage /></ProtectedRoute>} />
<Route path="/quiz/final/:subject" element={<ProtectedRoute><FinalExamPage /></ProtectedRoute>} />
```

- [ ] **Step 5: Verify full flow in browser**

```bash
cd /Users/iscreamarts/Documents/git/ebook
npm run dev
```

Expected: Login → roadmap → click chapter 01 → read → click quiz → answer questions → see results → navigate back.

- [ ] **Step 6: Commit**

```bash
git add src/pages/ChapterQuizPage.tsx src/pages/MidQuizPage.tsx src/pages/FinalExamPage.tsx src/App.tsx
git commit -m "feat: add chapter quiz, mid quiz, and final exam pages"
```

---

### Task 14: Prism.js Theme + Polish

**Files:**
- Modify: `src/index.css`
- Modify: `index.html`

- [ ] **Step 1: Add Prism.js CSS theme import to index.css**

At the top of `src/index.css`, after the Tailwind import, add:

```css
@import "prismjs/themes/prism-tomorrow.css";
```

- [ ] **Step 2: Add Korean font in index.html**

In `index.html`, inside `<head>`, add:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

- [ ] **Step 3: Update body font-family in index.css**

Update the body rule:

```css
body {
  background: var(--background);
  color: var(--foreground);
  font-family: "Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  word-break: keep-all;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 4: Verify styling in browser**

```bash
cd /Users/iscreamarts/Documents/git/ebook
npm run dev
```

Expected: Korean text renders with Noto Sans KR. Code blocks use tomorrow-night theme with proper syntax coloring.

- [ ] **Step 5: Commit**

```bash
git add src/index.css index.html
git commit -m "feat: add Prism.js theme and Korean web font"
```

---

### Task 15: Build Verification + Vercel Config

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create vercel.json for SPA routing**

Create `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- [ ] **Step 2: Run production build**

```bash
cd /Users/iscreamarts/Documents/git/ebook
npm run build
```

Expected: Build completes without errors. Output in `dist/`.

- [ ] **Step 3: Preview production build**

```bash
npx vite preview
```

Expected: App runs locally from production build. All routes work (login, roadmap, chapter, quiz).

- [ ] **Step 4: Commit**

```bash
git add vercel.json
git commit -m "feat: add Vercel SPA routing config"
```

---

### Task 16: Final Integration Test

- [ ] **Step 1: Full user flow test**

Manually test in browser:

1. Open app → see login page (minimal center design)
2. Enter wrong credentials → error message shows
3. Enter correct credentials (pcr / 1q2w3e4r!@#) → redirect to roadmap
4. Roadmap shows JS groups with chapter pills and progress ring at 0%
5. Click "var let const" pill → chapter reader loads
6. Scroll through all sections → section progress bar updates
7. Check items in checklist → persists on reload
8. Click "챕터 퀴즈 풀기" → quiz page loads
9. Answer questions → see correct/incorrect feedback with explanations
10. Finish quiz → see results with score
11. Click "완료" → back to roadmap, progress updated
12. Refresh page → progress persists (localStorage)
13. Wait for idle (or manually set loginAt to 3hrs ago in devtools) → auto-logout

- [ ] **Step 2: Mobile responsive test**

Open devtools → toggle device toolbar → test at 375px width:

1. Login page fits centered
2. Roadmap cards stack vertically with 16px padding
3. Chapter reader is readable with proper line length
4. Quiz choices are tappable
5. Navigation buttons are accessible

- [ ] **Step 3: Final commit**

```bash
git add -A
git status  # Verify no unwanted files
git commit -m "chore: integration test verified, app ready for deployment"
```

Only commit if there are actual changes from testing fixes. Skip if everything was already committed.
