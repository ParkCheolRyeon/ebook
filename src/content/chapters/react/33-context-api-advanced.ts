import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "33-context-api-advanced",
  subject: "react",
  title: "Context API 심화",
  description:
    "다중 Context 설계, Provider 중첩 패턴, 리렌더링 최적화 전략, 그리고 Context 설계 모범 사례를 학습합니다.",
  order: 33,
  group: "상태 관리",
  prerequisites: ["32-state-management-overview"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Context API는 사내 방송 시스템과 같습니다.\n\n" +
        "**단일 Context**는 하나의 스피커로 전체 사무실에 방송하는 것입니다. 모든 메시지가 한 채널로 나오므로, 총무부 공지를 들으려면 인사부 공지도 함께 들어야 합니다.\n\n" +
        "**다중 Context**는 부서별 전용 채널이 있는 시스템입니다. 총무부 채널, 인사부 채널이 분리되어 있어 필요한 채널만 구독할 수 있습니다.\n\n" +
        "**리렌더링 최적화**는 스피커를 끌 수 있는 기능입니다. 관심 없는 방송은 꺼두면 업무에 방해받지 않습니다. Context를 분리하고 메모이제이션을 적용하면 불필요한 리렌더링을 방지할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "기본적인 Context API 사용은 간단하지만, 규모가 커지면 여러 문제가 발생합니다.\n\n" +
        "1. **거대한 단일 Context** — 하나의 Context에 모든 전역 상태를 넣으면, 일부 값만 변경되어도 모든 Consumer가 리렌더링됩니다\n" +
        "2. **Provider Hell** — 여러 Context를 사용하면 Provider 중첩이 깊어져 코드 가독성이 떨어집니다\n" +
        "3. **불필요한 리렌더링** — Context 값이 새 객체를 생성하면 매 렌더링마다 Consumer가 리렌더링됩니다\n" +
        "4. **테스트 어려움** — Context에 강하게 결합된 컴포넌트는 단위 테스트가 어렵습니다",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. Context 분리 전략\n" +
        "관심사별로 Context를 분리하세요. 상태(state)와 업데이트 함수(dispatch)를 별도 Context로 나누면, 상태를 읽기만 하는 컴포넌트와 업데이트만 하는 컴포넌트의 리렌더링을 분리할 수 있습니다.\n\n" +
        "### 2. 메모이제이션\n" +
        "Provider의 value에 `useMemo`를 적용하여 불필요한 객체 재생성을 방지하세요.\n\n" +
        "### 3. Provider 조합 패턴\n" +
        "여러 Provider를 하나의 컴포넌트로 합쳐 중첩을 줄이는 `ComposeProviders` 패턴을 사용하세요.\n\n" +
        "### 4. 커스텀 Hook으로 캡슐화\n" +
        "Context를 직접 사용하지 말고 커스텀 Hook(예: `useAuth`)으로 감싸서 타입 안전성과 에러 처리를 보장하세요.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: State/Dispatch Context 분리 패턴",
      content:
        "상태와 업데이트 함수를 분리하여 리렌더링을 최적화하는 패턴입니다.",
      code: {
        language: "typescript",
        code:
          'import { createContext, useContext, useReducer, useMemo, type ReactNode } from "react";\n' +
          '\n' +
          '// 타입 정의\n' +
          'interface AuthState {\n' +
          '  user: { id: string; name: string } | null;\n' +
          '  isLoading: boolean;\n' +
          '}\n' +
          '\n' +
          'type AuthAction =\n' +
          '  | { type: "LOGIN_START" }\n' +
          '  | { type: "LOGIN_SUCCESS"; payload: { id: string; name: string } }\n' +
          '  | { type: "LOGOUT" };\n' +
          '\n' +
          '// ✅ 상태와 디스패치를 별도 Context로 분리\n' +
          'const AuthStateContext = createContext<AuthState | null>(null);\n' +
          'const AuthDispatchContext = createContext<React.Dispatch<AuthAction> | null>(null);\n' +
          '\n' +
          'function authReducer(state: AuthState, action: AuthAction): AuthState {\n' +
          '  switch (action.type) {\n' +
          '    case "LOGIN_START":\n' +
          '      return { ...state, isLoading: true };\n' +
          '    case "LOGIN_SUCCESS":\n' +
          '      return { user: action.payload, isLoading: false };\n' +
          '    case "LOGOUT":\n' +
          '      return { user: null, isLoading: false };\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          'function AuthProvider({ children }: { children: ReactNode }) {\n' +
          '  const [state, dispatch] = useReducer(authReducer, {\n' +
          '    user: null,\n' +
          '    isLoading: false,\n' +
          '  });\n' +
          '\n' +
          '  // ✅ state는 useReducer가 참조 안정성을 보장\n' +
          '  // dispatch는 useReducer가 항상 동일한 참조를 반환\n' +
          '  return (\n' +
          '    <AuthStateContext.Provider value={state}>\n' +
          '      <AuthDispatchContext.Provider value={dispatch}>\n' +
          '        {children}\n' +
          '      </AuthDispatchContext.Provider>\n' +
          '    </AuthStateContext.Provider>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ✅ 커스텀 Hook으로 캡슐화 + 에러 처리\n' +
          'function useAuthState() {\n' +
          '  const context = useContext(AuthStateContext);\n' +
          '  if (context === null) {\n' +
          '    throw new Error("useAuthState must be used within AuthProvider");\n' +
          '  }\n' +
          '  return context;\n' +
          '}\n' +
          '\n' +
          'function useAuthDispatch() {\n' +
          '  const context = useContext(AuthDispatchContext);\n' +
          '  if (context === null) {\n' +
          '    throw new Error("useAuthDispatch must be used within AuthProvider");\n' +
          '  }\n' +
          '  return context;\n' +
          '}',
        description:
          "상태 읽기(useAuthState)와 상태 변경(useAuthDispatch)을 분리하면, 로그아웃 버튼은 dispatch만 사용하므로 상태가 변해도 리렌더링되지 않습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Provider 조합과 메모이제이션",
      content:
        "여러 Provider의 중첩을 줄이고, Context 값을 메모이제이션하는 실습입니다.",
      code: {
        language: "typescript",
        code:
          'import { createContext, useMemo, useState, type ReactNode, type FC } from "react";\n' +
          '\n' +
          '// ❌ Provider Hell\n' +
          'function AppBad() {\n' +
          '  return (\n' +
          '    <ThemeProvider>\n' +
          '      <AuthProvider>\n' +
          '        <CartProvider>\n' +
          '          <NotificationProvider>\n' +
          '            <App />\n' +
          '          </NotificationProvider>\n' +
          '        </CartProvider>\n' +
          '      </AuthProvider>\n' +
          '    </ThemeProvider>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ✅ ComposeProviders 패턴으로 중첩 해소\n' +
          'function ComposeProviders({\n' +
          '  providers,\n' +
          '  children,\n' +
          '}: {\n' +
          '  providers: FC<{ children: ReactNode }>[];\n' +
          '  children: ReactNode;\n' +
          '}) {\n' +
          '  return providers.reduceRight(\n' +
          '    (acc, Provider) => <Provider>{acc}</Provider>,\n' +
          '    children\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'function AppGood() {\n' +
          '  return (\n' +
          '    <ComposeProviders\n' +
          '      providers={[ThemeProvider, AuthProvider, CartProvider, NotificationProvider]}\n' +
          '    >\n' +
          '      <App />\n' +
          '    </ComposeProviders>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ✅ 메모이제이션으로 불필요한 리렌더링 방지\n' +
          'interface ThemeContextType {\n' +
          '  theme: "light" | "dark";\n' +
          '  toggleTheme: () => void;\n' +
          '}\n' +
          '\n' +
          'const ThemeContext = createContext<ThemeContextType | null>(null);\n' +
          '\n' +
          'function ThemeProvider({ children }: { children: ReactNode }) {\n' +
          '  const [theme, setTheme] = useState<"light" | "dark">("light");\n' +
          '\n' +
          '  // ✅ useMemo로 객체 재생성 방지\n' +
          '  const value = useMemo(\n' +
          '    () => ({\n' +
          '      theme,\n' +
          '      toggleTheme: () => setTheme((prev) => (prev === "light" ? "dark" : "light")),\n' +
          '    }),\n' +
          '    [theme]\n' +
          '  );\n' +
          '\n' +
          '  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;\n' +
          '}',
        description:
          "ComposeProviders로 중첩을 줄이고, useMemo로 Context 값의 참조 안정성을 보장합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 문제 | 해결 패턴 |\n" +
        "|------|----------|\n" +
        "| 하나의 Context에 모든 상태 | 관심사별 Context 분리 |\n" +
        "| 상태 변경 시 모든 Consumer 리렌더링 | State/Dispatch Context 분리 |\n" +
        "| Provider 중첩(Hell) | ComposeProviders 패턴 |\n" +
        "| 매 렌더링 새 객체 생성 | useMemo로 값 메모이제이션 |\n" +
        "| Context 직접 사용 시 에러 처리 누락 | 커스텀 Hook으로 캡슐화 |\n\n" +
        "**핵심:** Context API는 강력하지만, 자주 변경되는 대규모 상태에는 적합하지 않습니다. 변경 빈도가 낮은 전역 설정(테마, 언어, 인증)에 최적입니다.\n\n" +
        "**다음 챕터 미리보기:** 복잡한 전역 상태 관리를 위해 Redux Toolkit의 기초를 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "State와 Dispatch Context를 분리하여 리렌더링을 최적화할 수 있다",
    "useMemo를 활용하여 Context 값의 참조 안정성을 보장할 수 있다",
    "ComposeProviders 패턴으로 Provider 중첩을 해소할 수 있다",
    "커스텀 Hook으로 Context를 캡슐화하고 에러 처리를 추가할 수 있다",
    "Context API가 적합한 상황과 부적합한 상황을 구분할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "Context 값이 변경될 때 리렌더링되는 컴포넌트의 범위는?",
      choices: [
        "Provider 아래 모든 컴포넌트",
        "해당 Context를 useContext로 구독하는 컴포넌트만",
        "Provider의 직접 자식만",
        "React.memo로 감싼 컴포넌트만",
      ],
      correctIndex: 1,
      explanation:
        "Context 값이 변경되면 해당 Context를 useContext로 구독하는 컴포넌트만 리렌더링됩니다. 단, React.memo로 감싸도 Context 변경으로 인한 리렌더링은 막을 수 없습니다.",
    },
    {
      id: "q2",
      question:
        "State와 Dispatch를 별도 Context로 분리하는 가장 큰 이유는?",
      choices: [
        "코드 가독성 향상",
        "TypeScript 타입 추론 개선",
        "상태를 읽기만 하는 컴포넌트와 변경만 하는 컴포넌트의 리렌더링 분리",
        "서버 컴포넌트 호환성",
      ],
      correctIndex: 2,
      explanation:
        "Dispatch만 사용하는 컴포넌트(예: 로그아웃 버튼)는 State Context를 구독하지 않으므로, 상태가 변해도 리렌더링되지 않습니다.",
    },
    {
      id: "q3",
      question:
        "Context Provider의 value에 useMemo를 적용하는 이유는?",
      choices: [
        "초기 렌더링 속도를 높이기 위해",
        "value 객체의 참조가 매 렌더링마다 바뀌는 것을 방지하기 위해",
        "Context를 여러 개 사용할 수 있게 하기 위해",
        "서버 사이드 렌더링을 지원하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "Provider의 부모가 리렌더링되면 value에 새 객체가 생성되어 모든 Consumer가 리렌더링됩니다. useMemo로 의존성이 변경될 때만 새 객체를 생성하면 이를 방지할 수 있습니다.",
    },
    {
      id: "q4",
      question: "ComposeProviders 패턴의 핵심 구현 방법은?",
      choices: [
        "forEach로 Provider를 순회하며 렌더링",
        "reduceRight로 Provider를 안쪽에서 바깥쪽으로 감싸기",
        "map으로 Provider 배열을 변환",
        "재귀 함수로 Provider를 하나씩 추가",
      ],
      correctIndex: 1,
      explanation:
        "reduceRight를 사용하면 배열의 마지막 Provider가 가장 안쪽에, 첫 번째 Provider가 가장 바깥쪽에 위치하여 올바른 중첩 구조를 만듭니다.",
    },
    {
      id: "q5",
      question: "커스텀 Hook으로 Context를 캡슐화할 때 반드시 포함해야 하는 것은?",
      choices: [
        "useMemo를 사용한 값 캐싱",
        "useEffect를 사용한 사이드 이펙트 처리",
        "Provider 외부에서 사용 시 에러를 던지는 검증 로직",
        "useCallback을 사용한 함수 메모이제이션",
      ],
      correctIndex: 2,
      explanation:
        "커스텀 Hook에서 Context 값이 null인지 확인하고, Provider 외부에서 사용 시 명확한 에러 메시지를 던지면 디버깅이 쉬워집니다.",
    },
  ],
};

export default chapter;
