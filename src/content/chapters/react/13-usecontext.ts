import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "13-usecontext",
  subject: "react",
  title: "useContext: Context API와 전역 상태",
  description: "Context API로 prop drilling을 해결하고, 리렌더링 문제를 이해하며 최적화 전략을 배웁니다.",
  order: 13,
  group: "Hooks 심화",
  prerequisites: ["12-usereducer"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Context는 **건물 내 방송 시스템**과 같습니다.\n\n" +
        "prop drilling은 전달하고 싶은 메시지를 1층에서 시작해 각 층의 사람을 거쳐 10층까지 전달하는 것입니다. 중간 층 사람들은 메시지 내용에 관심 없지만 전달을 위해 받아야 합니다.\n\n" +
        "**Context**는 건물 전체에 흐르는 **방송 시스템(Provider)**입니다. 1층에서 방송하면 10층에서도 직접 들을 수 있습니다. 중간 층은 관여하지 않습니다.\n\n" +
        "하지만 방송의 단점이 있습니다: 방송 내용(context 값)이 바뀌면 **모든 스피커(소비자 컴포넌트)**가 반응합니다. 온도 안내만 바꿨는데 모든 층이 소란스러워지는 것처럼요. 이것이 Context의 리렌더링 문제입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React에서 데이터는 부모 → 자식 방향으로 props를 통해 전달됩니다. 하지만:\n\n" +
        "1. **Prop Drilling** — 깊이 중첩된 컴포넌트에 데이터를 전달하려면 중간 컴포넌트를 모두 거쳐야 함\n" +
        "2. **전역 데이터** — 테마, 인증 정보, 언어 설정 등 많은 컴포넌트가 필요로 하는 데이터\n" +
        "3. **코드 복잡성** — 중간 컴포넌트가 불필요한 props를 받아 전달만 하는 보일러플레이트\n\n" +
        "Context 사용 시에도 문제가 있습니다:\n" +
        "- **리렌더링 범위** — Provider의 value가 바뀌면 해당 Context를 사용하는 **모든** 컴포넌트가 리렌더링\n" +
        "- **큰 Context 객체** — 하나의 Context에 너무 많은 값을 넣으면 일부만 바뀌어도 전체 소비자가 리렌더링",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### Context 사용 3단계\n" +
        "1. `createContext(defaultValue)` — Context 생성\n" +
        "2. `<Context.Provider value={...}>` — 데이터 제공\n" +
        "3. `useContext(Context)` — 데이터 소비\n\n" +
        "### 리렌더링 문제와 최적화\n" +
        "Provider의 `value`가 변경되면 해당 Context를 `useContext`로 읽는 모든 컴포넌트가 리렌더링됩니다.\n\n" +
        "**최적화 전략:**\n" +
        "1. **Context 분리** — 자주 변하는 값과 안 변하는 값을 별도 Context로\n" +
        "2. **상태와 dispatch 분리** — state Context와 dispatch Context를 나눔\n" +
        "3. **값 메모이제이션** — Provider의 value를 `useMemo`로 감싸기\n" +
        "4. **children 패턴** — Provider를 별도 컴포넌트로 분리하고 children을 받기\n\n" +
        "### Provider 패턴\n" +
        "Context, Provider, Hook을 하나의 모듈로 묶어 사용하면 코드가 깔끔해집니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Context 리렌더링 메커니즘",
      content:
        "Context가 내부적으로 어떻게 소비자를 추적하고 리렌더링하는지 의사코드로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// Context 내부 동작 (의사코드)\n' +
          '\n' +
          'interface ContextObject<T> {\n' +
          '  Provider: Component;\n' +
          '  _currentValue: T;\n' +
          '  _subscribers: Set<Fiber>; // 이 Context를 읽는 컴포넌트들\n' +
          '}\n' +
          '\n' +
          'function createContext<T>(defaultValue: T): ContextObject<T> {\n' +
          '  return {\n' +
          '    Provider: ContextProvider,\n' +
          '    _currentValue: defaultValue,\n' +
          '    _subscribers: new Set(),\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          'function useContext<T>(context: ContextObject<T>): T {\n' +
          '  // 현재 컴포넌트를 구독자로 등록\n' +
          '  context._subscribers.add(currentFiber);\n' +
          '\n' +
          '  // 가장 가까운 Provider의 value 반환\n' +
          '  return findClosestProvider(context)?._value ?? context._currentValue;\n' +
          '}\n' +
          '\n' +
          '// Provider의 value 변경 시\n' +
          'function onProviderValueChange<T>(\n' +
          '  context: ContextObject<T>,\n' +
          '  newValue: T,\n' +
          '  oldValue: T\n' +
          '): void {\n' +
          '  if (Object.is(oldValue, newValue)) return; // 같으면 무시\n' +
          '\n' +
          '  // 모든 구독자에게 리렌더링 알림\n' +
          '  // React.memo로 감싸도 건너뛰지 않음!\n' +
          '  for (const subscriber of context._subscribers) {\n' +
          '    scheduleRerender(subscriber);\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// 리렌더링 최적화: Context 분리\n' +
          'const ThemeContext = createContext<string>("light");\n' +
          'const AuthContext = createContext<User | null>(null);\n' +
          '// 테마가 바뀌어도 AuthContext 소비자는 리렌더링 안 됨',
        description: "Context value가 변경되면 해당 Context를 읽는 모든 소비자가 리렌더링됩니다. React.memo로도 방지되지 않습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Provider 패턴과 최적화",
      content:
        "실전에서 자주 사용하는 Context 패턴을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          'import {\n' +
          '  createContext,\n' +
          '  useContext,\n' +
          '  useReducer,\n' +
          '  useMemo,\n' +
          '  type ReactNode,\n' +
          '} from "react";\n' +
          '\n' +
          '// ✅ 패턴: state와 dispatch를 별도 Context로 분리\n' +
          'interface AuthState {\n' +
          '  user: { name: string; email: string } | null;\n' +
          '  isLoading: boolean;\n' +
          '}\n' +
          '\n' +
          'type AuthAction =\n' +
          '  | { type: "LOGIN_START" }\n' +
          '  | { type: "LOGIN_SUCCESS"; payload: { name: string; email: string } }\n' +
          '  | { type: "LOGOUT" };\n' +
          '\n' +
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
          '// Provider 컴포넌트\n' +
          'function AuthProvider({ children }: { children: ReactNode }) {\n' +
          '  const [state, dispatch] = useReducer(authReducer, {\n' +
          '    user: null,\n' +
          '    isLoading: false,\n' +
          '  });\n' +
          '\n' +
          '  return (\n' +
          '    <AuthStateContext.Provider value={state}>\n' +
          '      <AuthDispatchContext.Provider value={dispatch}>\n' +
          '        {children}\n' +
          '      </AuthDispatchContext.Provider>\n' +
          '    </AuthStateContext.Provider>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 커스텀 Hook으로 캡슐화\n' +
          'function useAuthState(): AuthState {\n' +
          '  const context = useContext(AuthStateContext);\n' +
          '  if (!context) throw new Error("AuthProvider 안에서 사용하세요");\n' +
          '  return context;\n' +
          '}\n' +
          '\n' +
          'function useAuthDispatch(): React.Dispatch<AuthAction> {\n' +
          '  const context = useContext(AuthDispatchContext);\n' +
          '  if (!context) throw new Error("AuthProvider 안에서 사용하세요");\n' +
          '  return context;\n' +
          '}\n' +
          '\n' +
          '// dispatch만 사용하는 컴포넌트는 state 변경 시 리렌더링 안 됨\n' +
          'function LogoutButton() {\n' +
          '  const dispatch = useAuthDispatch();\n' +
          '  return <button onClick={() => dispatch({ type: "LOGOUT" })}>로그아웃</button>;\n' +
          '}',
        description: "state와 dispatch를 분리하면 dispatch만 사용하는 컴포넌트는 state 변경 시 리렌더링되지 않습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**Context 사용 시 핵심 규칙:**\n\n" +
        "1. **남용 금지** — Context는 '자주 변하지 않는 전역 데이터'에 적합 (테마, 인증, 언어)\n" +
        "2. **분리 우선** — 하나의 거대한 Context보다 역할별 작은 Context\n" +
        "3. **state/dispatch 분리** — 읽기만 하는 컴포넌트와 쓰기만 하는 컴포넌트의 리렌더링 분리\n" +
        "4. **커스텀 Hook 캡슐화** — null 체크와 에러 처리를 Hook에 숨기기\n\n" +
        "| 최적화 기법 | 효과 |\n" +
        "|------------|------|\n" +
        "| Context 분리 | 관련 없는 소비자 리렌더링 방지 |\n" +
        "| state/dispatch 분리 | dispatch만 쓰는 컴포넌트 보호 |\n" +
        "| useMemo로 value 감싸기 | Provider 부모 리렌더링 시 소비자 보호 |\n" +
        "| children 패턴 | Provider 컴포넌트의 자식 리렌더링 방지 |\n\n" +
        "**다음 챕터 미리보기:** React 19의 use() 훅으로 Context와 Promise를 더 유연하게 읽는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "Context는 prop drilling 없이 컴포넌트 트리 전체에 값을 전달한다. 하지만 Context 값이 바뀌면 모든 소비자가 리렌더되므로, 자주 변하는 값에는 주의가 필요하다.",
  checklist: [
    "Context의 createContext, Provider, useContext 3단계를 구현할 수 있다",
    "Context value 변경 시 리렌더링 범위를 설명할 수 있다",
    "state와 dispatch Context를 분리하는 이유를 설명할 수 있다",
    "Provider 패턴을 커스텀 Hook으로 캡슐화할 수 있다",
    "Context가 적합한 데이터와 부적합한 데이터를 구분할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Context Provider의 value가 변경되면 어떤 컴포넌트가 리렌더링되나요?",
      choices: [
        "Provider의 직접 자식만",
        "해당 Context를 useContext로 읽는 모든 컴포넌트",
        "Provider 하위의 모든 컴포넌트",
        "React.memo로 감싸지 않은 컴포넌트만",
      ],
      correctIndex: 1,
      explanation: "useContext로 해당 Context를 읽는 모든 소비자 컴포넌트가 리렌더링됩니다. React.memo로 감싸도 Context 변경에 의한 리렌더링은 방지되지 않습니다.",
    },
    {
      id: "q2",
      question: "state와 dispatch를 별도 Context로 분리하는 이유는?",
      choices: [
        "코드 가독성을 위해",
        "dispatch만 사용하는 컴포넌트가 state 변경 시 리렌더링되지 않도록",
        "TypeScript 타입 추론을 위해",
        "Context의 크기 제한 때문에",
      ],
      correctIndex: 1,
      explanation: "dispatch 함수는 참조가 안정적이므로 별도 Context에 넣으면 state가 변경되어도 dispatch만 사용하는 컴포넌트는 리렌더링되지 않습니다.",
    },
    {
      id: "q3",
      question: "createContext의 defaultValue는 언제 사용되나요?",
      choices: [
        "항상 사용됨",
        "Provider가 없을 때",
        "Provider의 value가 undefined일 때",
        "첫 번째 렌더링에서만",
      ],
      correctIndex: 1,
      explanation: "컴포넌트 트리에서 해당 Context의 Provider를 찾지 못할 때 defaultValue가 사용됩니다.",
    },
    {
      id: "q4",
      question: "Provider의 value에 인라인 객체를 전달하면 어떤 문제가 있나요?",
      choices: [
        "타입 에러가 발생한다",
        "매 렌더링마다 새 객체가 생성되어 모든 소비자가 리렌더링된다",
        "Context가 초기화된다",
        "문제 없다",
      ],
      correctIndex: 1,
      explanation: "인라인 객체는 매 렌더링마다 새로 생성됩니다. Object.is 비교에서 항상 다른 값으로 판단되어 모든 소비자가 리렌더링됩니다. useMemo로 감싸면 해결됩니다.",
    },
    {
      id: "q5",
      question: "다음 중 Context 사용이 적절하지 않은 경우는?",
      choices: [
        "앱 전체 테마 설정",
        "인증된 사용자 정보",
        "자주 변하는 마우스 좌표",
        "다국어 설정",
      ],
      correctIndex: 2,
      explanation: "마우스 좌표처럼 매우 자주 변하는 값을 Context에 넣으면 모든 소비자가 지속적으로 리렌더링되어 성능 문제가 발생합니다.",
    },
    {
      id: "q6",
      question: "커스텀 Hook으로 Context를 캡슐화하는 주된 이점은?",
      choices: [
        "성능이 향상된다",
        "Provider 외부에서 사용 시 명확한 에러를 던질 수 있다",
        "Context를 자동으로 생성한다",
        "리렌더링을 방지한다",
      ],
      correctIndex: 1,
      explanation: "커스텀 Hook에서 null 체크를 하면 Provider 없이 사용할 때 명확한 에러 메시지를 제공할 수 있습니다. 또한 import를 간소화합니다.",
    },
  ],
};

export default chapter;
