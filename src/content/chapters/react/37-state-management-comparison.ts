import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "37-state-management-comparison",
  subject: "react",
  title: "상태 관리 비교와 선택 기준",
  description:
    "Context API, Redux Toolkit, Zustand를 비교하고, 프로젝트 규모와 복잡도에 따른 선택 기준과 마이그레이션 전략을 제시합니다.",
  order: 37,
  group: "상태 관리",
  prerequisites: ["36-zustand"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "상태 관리 도구 선택은 이동 수단을 고르는 것과 같습니다.\n\n" +
        "**Context API**는 자전거입니다. 가까운 거리에 가장 효율적이고, 별도 면허(설정)가 필요 없습니다. 하지만 장거리에는 힘듭니다.\n\n" +
        "**Zustand**는 전동 킥보드입니다. 자전거보다 빠르고 편하며, 충전(설정)도 간단합니다. 중간 거리에 최적입니다.\n\n" +
        "**Redux Toolkit**은 자동차입니다. 장거리에 최적이고 많은 짐(복잡한 상태)을 실을 수 있지만, 면허(학습)가 필요하고 유지비(보일러플레이트)가 듭니다.\n\n" +
        "핵심은 **목적지(프로젝트 요구사항)**에 맞는 이동 수단을 고르는 것입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "상태 관리 도구 선택이 어려운 이유:\n\n" +
        "1. **너무 많은 선택지** — Context, Redux, Zustand, Jotai, Recoil, Valtio 등 수많은 옵션이 있습니다\n" +
        "2. **과잉 엔지니어링** — 간단한 앱에 Redux를 도입하면 복잡도만 증가합니다\n" +
        "3. **과소 엔지니어링** — 복잡한 앱에 Context만 사용하면 성능 문제가 발생합니다\n" +
        "4. **마이그레이션 비용** — 잘못된 선택 후 다른 라이브러리로 전환하는 것은 비용이 큽니다\n" +
        "5. **팀 역량** — 팀원들의 경험과 학습 곡선도 고려해야 합니다",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 프로젝트 규모별 가이드\n\n" +
        "**소규모 (1-5 페이지, 1-2명 개발)**\n" +
        "- 기본: useState + props\n" +
        "- 전역 필요 시: Context API\n" +
        "- 서버 상태: React Query\n\n" +
        "**중규모 (5-20 페이지, 3-5명 개발)**\n" +
        "- 클라이언트 전역: Zustand\n" +
        "- 서버 상태: React Query\n" +
        "- 필요 시 Context로 테마/인증 보조\n\n" +
        "**대규모 (20+ 페이지, 5명+ 개발)**\n" +
        "- 클라이언트 전역: Redux Toolkit 또는 Zustand\n" +
        "- 서버 상태: React Query 또는 RTK Query\n" +
        "- 엄격한 패턴과 DevTools가 중요하면 Redux\n\n" +
        "### 마이그레이션 전략\n" +
        "새 기능부터 새 도구를 적용하고, 기존 코드는 점진적으로 전환하세요. 한 번에 모든 것을 바꾸려 하지 마세요.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 동일 기능의 세 가지 구현 비교",
      content:
        "동일한 카운터 기능을 Context, Redux Toolkit, Zustand로 구현하여 차이를 비교합니다.",
      code: {
        language: "typescript",
        code:
          '// === 1. Context API ===\n' +
          'import { createContext, useContext, useState, type ReactNode } from "react";\n' +
          '\n' +
          'const CounterContext = createContext<{\n' +
          '  count: number;\n' +
          '  increment: () => void;\n' +
          '} | null>(null);\n' +
          '\n' +
          'function CounterProvider({ children }: { children: ReactNode }) {\n' +
          '  const [count, setCount] = useState(0);\n' +
          '  return (\n' +
          '    <CounterContext.Provider\n' +
          '      value={{ count, increment: () => setCount((c) => c + 1) }}\n' +
          '    >\n' +
          '      {children}\n' +
          '    </CounterContext.Provider>\n' +
          '  );\n' +
          '}\n' +
          '// Provider로 감싸야 하고, 값 변경 시 모든 Consumer 리렌더링\n' +
          '\n' +
          '// === 2. Redux Toolkit ===\n' +
          'import { createSlice, configureStore } from "@reduxjs/toolkit";\n' +
          '\n' +
          'const counterSlice = createSlice({\n' +
          '  name: "counter",\n' +
          '  initialState: { count: 0 },\n' +
          '  reducers: {\n' +
          '    increment: (state) => { state.count += 1; },\n' +
          '  },\n' +
          '});\n' +
          'const store = configureStore({ reducer: { counter: counterSlice.reducer } });\n' +
          '// Slice + Store + Provider 설정 필요, DevTools 자동 지원\n' +
          '\n' +
          '// === 3. Zustand ===\n' +
          'import { create } from "zustand";\n' +
          '\n' +
          'const useCounterStore = create<{\n' +
          '  count: number;\n' +
          '  increment: () => void;\n' +
          '}>((set) => ({\n' +
          '  count: 0,\n' +
          '  increment: () => set((state) => ({ count: state.count + 1 })),\n' +
          '}));\n' +
          '// 한 줄로 완성, Provider 불필요, 셀렉터로 최적화',
        description:
          "동일한 카운터를 세 가지 방식으로 구현했을 때, Zustand가 가장 적은 코드로 구현 가능합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 점진적 마이그레이션 전략",
      content:
        "Context API에서 Zustand로 점진적으로 마이그레이션하는 패턴을 실습합니다.",
      code: {
        language: "typescript",
        code:
          'import { create } from "zustand";\n' +
          'import { createContext, useContext, type ReactNode } from "react";\n' +
          '\n' +
          '// 1단계: Zustand 스토어 생성 (기존 Context와 병행)\n' +
          'interface AuthStore {\n' +
          '  user: { id: string; name: string } | null;\n' +
          '  login: (user: { id: string; name: string }) => void;\n' +
          '  logout: () => void;\n' +
          '}\n' +
          '\n' +
          'const useAuthStore = create<AuthStore>((set) => ({\n' +
          '  user: null,\n' +
          '  login: (user) => set({ user }),\n' +
          '  logout: () => set({ user: null }),\n' +
          '}));\n' +
          '\n' +
          '// 2단계: 브리지 Hook으로 기존 인터페이스 유지\n' +
          '// 기존 코드: const { user } = useAuth();\n' +
          '// 새 코드도 동일하게 사용 가능\n' +
          'function useAuth() {\n' +
          '  const user = useAuthStore((state) => state.user);\n' +
          '  const login = useAuthStore((state) => state.login);\n' +
          '  const logout = useAuthStore((state) => state.logout);\n' +
          '  return { user, login, logout };\n' +
          '}\n' +
          '\n' +
          '// 3단계: 새 기능은 직접 Zustand 사용\n' +
          'function ProfilePage() {\n' +
          '  const user = useAuthStore((state) => state.user);\n' +
          '  if (!user) return <div>로그인이 필요합니다</div>;\n' +
          '  return <div>{user.name}의 프로필</div>;\n' +
          '}\n' +
          '\n' +
          '// 4단계: 기존 Context Provider를 점진적으로 제거\n' +
          '// 모든 컴포넌트가 Zustand로 전환되면 Provider 제거 가능\n' +
          '\n' +
          '// ✅ 선택 기준 요약 함수\n' +
          'function recommendTool(project: {\n' +
          '  size: "small" | "medium" | "large";\n' +
          '  teamExperience: "beginner" | "intermediate" | "advanced";\n' +
          '  needsDevTools: boolean;\n' +
          '  hasComplexAsync: boolean;\n' +
          '}): string {\n' +
          '  if (project.size === "small") return "Context API + React Query";\n' +
          '  if (project.size === "medium") return "Zustand + React Query";\n' +
          '  if (project.hasComplexAsync && project.needsDevTools)\n' +
          '    return "Redux Toolkit + RTK Query";\n' +
          '  return "Zustand + React Query";\n' +
          '}',
        description:
          "브리지 Hook 패턴으로 기존 인터페이스를 유지하면서 내부 구현을 점진적으로 교체합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 기준 | Context API | Redux Toolkit | Zustand |\n" +
        "|------|------------|--------------|--------|\n" +
        "| 보일러플레이트 | 적음 | 많음 | 최소 |\n" +
        "| 리렌더링 최적화 | 어려움 | 셀렉터 | 셀렉터 |\n" +
        "| DevTools | 없음 | 내장 | 미들웨어 |\n" +
        "| 번들 크기 | 0KB (내장) | ~33KB | ~1.5KB |\n" +
        "| 학습 곡선 | 낮음 | 높음 | 낮음 |\n" +
        "| 적합한 규모 | 소규모 | 대규모 | 중소규모 |\n\n" +
        "**핵심:** 은탄환은 없습니다. 프로젝트의 규모, 팀 역량, 요구사항에 맞는 도구를 선택하되, 서버 상태는 반드시 전용 라이브러리(React Query/SWR)로 분리하세요.\n\n" +
        "**다음 챕터 미리보기:** React Router로 클라이언트 사이드 라우팅의 기초를 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "Context API, Redux Toolkit, Zustand의 장단점을 비교 설명할 수 있다",
    "프로젝트 규모에 따라 적절한 상태 관리 도구를 선택할 수 있다",
    "서버 상태와 클라이언트 상태를 분리하여 관리하는 이유를 설명할 수 있다",
    "점진적 마이그레이션 전략을 설계할 수 있다",
    "과잉 엔지니어링과 과소 엔지니어링의 위험을 인식한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "소규모 프로젝트(1-5 페이지)에서 가장 적합한 전역 상태 관리 도구는?",
      choices: [
        "Redux Toolkit",
        "Context API",
        "MobX",
        "Recoil",
      ],
      correctIndex: 1,
      explanation:
        "소규모 프로젝트에서는 추가 라이브러리 없이 React 내장 Context API가 가장 적합합니다. 설정이 간단하고 번들 크기 증가가 없습니다.",
    },
    {
      id: "q2",
      question: "Context API의 가장 큰 한계는?",
      choices: [
        "TypeScript를 지원하지 않음",
        "Provider 중첩이 불가능",
        "값이 변경되면 모든 Consumer가 리렌더링됨",
        "서버 컴포넌트에서 사용 불가",
      ],
      correctIndex: 2,
      explanation:
        "Context 값이 변경되면 해당 Context를 구독하는 모든 컴포넌트가 리렌더링됩니다. 자주 변경되는 상태에는 셀렉터 기반 도구가 더 적합합니다.",
    },
    {
      id: "q3",
      question: "점진적 마이그레이션의 첫 번째 단계로 적절한 것은?",
      choices: [
        "기존 코드를 모두 삭제하고 새로 작성",
        "새 기능부터 새 도구를 적용하고 브리지 Hook으로 호환성 유지",
        "테스트 없이 한 번에 전체 교체",
        "두 도구를 동시에 사용하지 않기",
      ],
      correctIndex: 1,
      explanation:
        "새 기능에 새 도구를 적용하고, 기존 인터페이스를 유지하는 브리지 Hook을 만들면 점진적으로 안전하게 마이그레이션할 수 있습니다.",
    },
    {
      id: "q4",
      question: "Redux Toolkit이 Zustand보다 더 적합한 경우는?",
      choices: [
        "번들 크기를 최소화해야 할 때",
        "보일러플레이트를 줄이고 싶을 때",
        "엄격한 패턴과 강력한 DevTools가 필요한 대규모 팀 프로젝트",
        "Provider 없이 사용하고 싶을 때",
      ],
      correctIndex: 2,
      explanation:
        "Redux Toolkit은 엄격한 패턴(Action/Reducer), 강력한 DevTools, RTK Query 통합 등 대규모 팀에서 일관성을 유지하는 데 유리합니다.",
    },
    {
      id: "q5",
      question: "서버 상태를 Redux나 Zustand 대신 React Query로 관리해야 하는 이유는?",
      choices: [
        "Redux와 Zustand는 서버 데이터를 저장할 수 없어서",
        "캐싱, 재검증, 중복 요청 제거 등 서버 상태 고유의 복잡성을 자동 처리해서",
        "React Query만 TypeScript를 지원해서",
        "서버 컴포넌트에서만 사용 가능해서",
      ],
      correctIndex: 1,
      explanation:
        "서버 상태는 캐싱, 백그라운드 재검증, 중복 요청 방지 등 고유한 복잡성이 있으며, React Query는 이를 자동으로 처리합니다.",
    },
  ],
};

export default chapter;
