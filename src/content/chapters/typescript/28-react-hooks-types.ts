import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "28-react-hooks-types",
  subject: "typescript",
  title: "Hooks 타이핑",
  description:
    "useState, useRef, useReducer, useContext 등 React Hooks의 타입 추론과 제네릭 활용법을 학습합니다.",
  order: 28,
  group: "React + TypeScript",
  prerequisites: ["27-react-component-types"],
  estimatedMinutes: 35,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "React Hooks의 타이핑은 **서류 양식의 칸**과 같습니다.\n\n" +
        "`useState`는 양식의 칸에 라벨을 붙이는 것과 같습니다. '이름' 칸에는 문자만, '나이' 칸에는 숫자만 쓸 수 있도록 지정합니다. 초기값으로 `'홍길동'`을 쓰면 TypeScript가 자동으로 '이 칸은 문자열용'이라고 추론합니다. 하지만 처음에 빈칸(null)이었다가 나중에 문자열이 채워질 수 있다면, `useState<string | null>(null)`처럼 명시적으로 라벨을 붙여야 합니다.\n\n" +
        "`useRef`는 **메모 포스트잇**과 같습니다. 두 가지 용도가 있는데, DOM 요소를 가리키는 '읽기 전용 포인터'와, 값을 저장하는 '쓰기 가능 메모장'입니다. `useRef<HTMLDivElement>(null)`은 'div 요소를 가리킬 포인터인데, 아직 안 붙였어'라는 뜻입니다. 이 경우 `.current`는 읽기 전용(RefObject)입니다. 반면 `useRef<number>(0)`은 '숫자를 기록할 메모장, 초기값은 0'이라는 뜻이고, `.current`를 자유롭게 수정할 수 있습니다(MutableRefObject).\n\n" +
        "`useReducer`는 **주문서 시스템**입니다. 액션(주문)이 들어오면 리듀서(처리 규칙)에 따라 상태(재고)가 변경됩니다. 타입스크립트로 '가능한 주문 종류'를 유니온 타입으로 정의하면, 존재하지 않는 주문을 방지할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React Hooks를 TypeScript와 함께 사용할 때 자주 겪는 문제들이 있습니다.\n\n" +
        "**1. useState의 타입 추론 한계**\n" +
        "초기값이 `null`이거나 `[]`(빈 배열)일 때, TypeScript는 `null` 또는 `never[]`로 추론합니다. 나중에 실제 값을 설정하면 타입 에러가 발생합니다. `const [user, setUser] = useState(null)` 후 `setUser({name: 'Kim'})`은 에러입니다.\n\n" +
        "**2. useRef의 두 가지 오버로드 혼동**\n" +
        "`useRef<HTMLDivElement>(null)`과 `useRef<HTMLDivElement | null>(null)`은 반환 타입이 다릅니다. 전자는 `RefObject`(current가 readonly), 후자는 `MutableRefObject`입니다. DOM ref에 후자를 사용하면 실수로 current를 덮어쓸 수 있습니다.\n\n" +
        "**3. useReducer 액션 타입의 복잡성**\n" +
        "리듀서의 액션이 늘어날수록 타입 정의가 복잡해집니다. 각 액션에 따른 payload 타입이 다르고, switch문에서 올바르게 좁혀져야 합니다.\n\n" +
        "**4. 커스텀 Hook 반환 타입**\n" +
        "커스텀 Hook이 배열을 반환하면 TypeScript가 `(string | Function)[]`로 추론하여, 구조 분해 시 정확한 타입을 잃어버립니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "각 Hook의 제네릭을 올바르게 활용하면 타입 안전성을 확보할 수 있습니다.\n\n" +
        "### useState<T> 타입 전략\n" +
        "- 초기값에서 추론 가능: `useState(0)` → `number`, `useState('hello')` → `string`\n" +
        "- null 가능: `useState<User | null>(null)` → 명시적 제네릭 필요\n" +
        "- 빈 배열: `useState<Todo[]>([])` → 요소 타입 명시 필요\n\n" +
        "### useRef 오버로드 구분\n" +
        "| 호출 | 반환 타입 | current 수정 | 용도 |\n" +
        "|------|----------|-------------|------|\n" +
        "| `useRef<T>(null)` | `RefObject<T>` | readonly | DOM ref |\n" +
        "| `useRef<T>(initialValue)` | `MutableRefObject<T>` | 수정 가능 | 값 저장 |\n" +
        "| `useRef<T \\| null>(null)` | `MutableRefObject<T \\| null>` | 수정 가능 | 직접 관리 ref |\n\n" +
        "### useReducer 액션 패턴\n" +
        "discriminated union으로 액션 타입을 정의하면, switch문에서 자동으로 payload 타입이 좁혀집니다. `type Action = { type: 'ADD'; item: Todo } | { type: 'DELETE'; id: string }`\n\n" +
        "### 커스텀 Hook 반환 타입\n" +
        "배열 반환 시 `as const`를 사용하거나, 반환 타입을 튜플로 명시합니다. `return [value, setValue] as const`는 `readonly [T, SetStateAction<T>]` 튜플이 됩니다. 3개 이상이면 객체 반환을 권장합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Hooks 타이핑 패턴",
      content:
        "useState, useRef, useReducer의 타입 추론과 제네릭 활용법을 코드로 확인합니다. 각 Hook의 오버로드가 어떻게 동작하는지 이해합니다.",
      code: {
        language: "typescript",
        code:
          "import { useState, useRef, useReducer, useContext, createContext } from 'react';\n" +
          "\n" +
          "// ===== useState: 타입 추론 vs 명시 =====\n" +
          "const [count, setCount] = useState(0);       // number로 추론\n" +
          "const [name, setName] = useState('');          // string으로 추론\n" +
          "const [flag, setFlag] = useState(true);        // boolean으로 추론\n" +
          "\n" +
          "// null 가능한 상태: 제네릭 명시 필수\n" +
          "interface User { id: string; name: string; email: string; }\n" +
          "const [user, setUser] = useState<User | null>(null);\n" +
          "// user?.name  → OK (null 체크 필요)\n" +
          "// user.name   → ❌ 에러: user가 null일 수 있음\n" +
          "\n" +
          "// 빈 배열: 요소 타입 명시 필수\n" +
          "interface Todo { id: string; text: string; done: boolean; }\n" +
          "const [todos, setTodos] = useState<Todo[]>([]);\n" +
          "\n" +
          "// ===== useRef: DOM ref vs 값 저장 =====\n" +
          "// DOM ref: RefObject<HTMLInputElement> (current는 readonly)\n" +
          "const inputRef = useRef<HTMLInputElement>(null);\n" +
          "// inputRef.current?.focus()  → OK\n" +
          "// inputRef.current = null;   → ❌ readonly\n" +
          "\n" +
          "// 값 저장: MutableRefObject<number> (current 수정 가능)\n" +
          "const timerRef = useRef<number>(0);\n" +
          "timerRef.current = window.setTimeout(() => {}, 1000); // OK\n" +
          "\n" +
          "// ===== useReducer: discriminated union 액션 =====\n" +
          "type TodoAction =\n" +
          "  | { type: 'ADD'; text: string }\n" +
          "  | { type: 'TOGGLE'; id: string }\n" +
          "  | { type: 'DELETE'; id: string }\n" +
          "  | { type: 'CLEAR' };\n" +
          "\n" +
          "function todoReducer(state: Todo[], action: TodoAction): Todo[] {\n" +
          "  switch (action.type) {\n" +
          "    case 'ADD':\n" +
          "      // action.text → string으로 좁혀짐\n" +
          "      return [...state, { id: crypto.randomUUID(), text: action.text, done: false }];\n" +
          "    case 'TOGGLE':\n" +
          "      return state.map((t) =>\n" +
          "        t.id === action.id ? { ...t, done: !t.done } : t\n" +
          "      );\n" +
          "    case 'DELETE':\n" +
          "      return state.filter((t) => t.id !== action.id);\n" +
          "    case 'CLEAR':\n" +
          "      return [];\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "const [todos2, dispatch] = useReducer(todoReducer, []);\n" +
          "dispatch({ type: 'ADD', text: '공부하기' }); // ✅\n" +
          "// dispatch({ type: 'ADD' });  // ❌ text 누락\n" +
          "// dispatch({ type: 'UNKNOWN' }); // ❌ 존재하지 않는 액션",
        description:
          "useState는 초기값에서 추론하되, null이나 빈 배열은 제네릭을 명시합니다. useRef는 DOM ref와 값 저장 용도에 따라 오버로드가 달라집니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 커스텀 Hook과 Context 타이핑",
      content:
        "커스텀 Hook의 반환 타입을 올바르게 정의하고, useContext와 함께 타입 안전한 전역 상태를 구축하는 패턴을 연습합니다.",
      code: {
        language: "typescript",
        code:
          "import {\n" +
          "  useState, useCallback, useMemo,\n" +
          "  useContext, createContext, type ReactNode\n" +
          "} from 'react';\n" +
          "\n" +
          "// ===== 커스텀 Hook: 튜플 반환 =====\n" +
          "function useToggle(initial = false) {\n" +
          "  const [value, setValue] = useState(initial);\n" +
          "  const toggle = useCallback(() => setValue((v) => !v), []);\n" +
          "  const setTrue = useCallback(() => setValue(true), []);\n" +
          "  const setFalse = useCallback(() => setValue(false), []);\n" +
          "\n" +
          "  // as const로 튜플 타입 유지\n" +
          "  return [value, toggle, setTrue, setFalse] as const;\n" +
          "  // → readonly [boolean, () => void, () => void, () => void]\n" +
          "}\n" +
          "\n" +
          "// ===== 커스텀 Hook: 객체 반환 (3개 이상 권장) =====\n" +
          "function useFetch<T>(url: string) {\n" +
          "  const [data, setData] = useState<T | null>(null);\n" +
          "  const [error, setError] = useState<Error | null>(null);\n" +
          "  const [isLoading, setIsLoading] = useState(false);\n" +
          "\n" +
          "  // ... fetch 로직\n" +
          "\n" +
          "  // 객체 반환: 사용 시 이름으로 접근\n" +
          "  return { data, error, isLoading };\n" +
          "}\n" +
          "\n" +
          "// 사용: 타입 자동 추론\n" +
          "interface Post { id: number; title: string; }\n" +
          "const { data, isLoading } = useFetch<Post[]>('/api/posts');\n" +
          "// data: Post[] | null\n" +
          "\n" +
          "// ===== 타입 안전 Context =====\n" +
          "interface AuthContextType {\n" +
          "  user: { id: string; name: string } | null;\n" +
          "  login: (email: string, password: string) => Promise<void>;\n" +
          "  logout: () => void;\n" +
          "}\n" +
          "\n" +
          "// null로 초기화하고, Provider 없이 사용 시 에러 발생\n" +
          "const AuthContext = createContext<AuthContextType | null>(null);\n" +
          "\n" +
          "function useAuth(): AuthContextType {\n" +
          "  const context = useContext(AuthContext);\n" +
          "  if (context === null) {\n" +
          "    throw new Error('useAuth must be used within AuthProvider');\n" +
          "  }\n" +
          "  return context; // non-null 보장\n" +
          "}\n" +
          "\n" +
          "// ===== useMemo/useCallback 타입 추론 =====\n" +
          "const expensiveValue = useMemo(() => {\n" +
          "  return [1, 2, 3].reduce((a, b) => a + b, 0);\n" +
          "}, []); // → number로 추론\n" +
          "\n" +
          "const handleClick = useCallback((id: string) => {\n" +
          "  console.log('Clicked:', id);\n" +
          "}, []); // → (id: string) => void로 추론",
        description:
          "커스텀 Hook은 as const로 튜플 반환 타입을 유지하거나, 3개 이상이면 객체로 반환합니다. Context는 null 체크 커스텀 Hook으로 타입 안전성을 확보합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| Hook | 제네릭 사용 시점 | 예시 |\n" +
        "|------|---------------|------|\n" +
        "| useState | null/빈 배열 초기화 시 | `useState<User \\| null>(null)` |\n" +
        "| useRef (DOM) | 항상 | `useRef<HTMLDivElement>(null)` |\n" +
        "| useRef (값) | 초기값에서 추론 불가 시 | `useRef<number>(0)` |\n" +
        "| useReducer | 자동 추론 (리듀서에서) | 액션은 discriminated union |\n" +
        "| useContext | createContext에서 | `createContext<T \\| null>(null)` |\n" +
        "| useMemo | 자동 추론 | 반환값에서 추론 |\n" +
        "| useCallback | 자동 추론 | 매개변수에서 추론 |\n\n" +
        "**핵심:** useState는 초기값에서 타입을 추론하지만, null이 가능한 경우 `useState<User | null>(null)`로 명시합니다. `useRef<HTMLDivElement>(null)`은 RefObject(readonly), `useRef<number>(0)`은 MutableRefObject를 반환합니다. 커스텀 Hook은 `as const`로 튜플 타입을 유지합니다.\n\n" +
        "**다음 챕터 미리보기:** 이벤트와 Ref 타이핑을 학습합니다. React.ChangeEvent, forwardRef, useImperativeHandle 등의 타이핑 패턴을 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "useState는 초기값에서 타입을 추론하지만, null이 가능한 경우 useState<User | null>(null)로 명시한다. useRef<HTMLDivElement>(null)은 RefObject(readonly), useRef<number>(0)은 MutableRefObject를 반환한다.",
  checklist: [
    "useState에서 제네릭을 명시해야 하는 경우를 설명할 수 있다",
    "useRef의 RefObject와 MutableRefObject의 차이를 이해한다",
    "useReducer의 액션을 discriminated union으로 정의할 수 있다",
    "커스텀 Hook의 반환 타입을 as const로 튜플 유지하는 방법을 안다",
    "createContext와 useContext의 타입 안전 패턴을 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "다음 코드의 user 타입은?\nconst [user, setUser] = useState(null);",
      choices: [
        "any",
        "null",
        "undefined",
        "unknown",
      ],
      correctIndex: 1,
      explanation:
        "초기값 null에서 타입이 추론되므로 user의 타입은 null입니다. 나중에 객체를 설정하려면 useState<User | null>(null)로 제네릭을 명시해야 합니다.",
    },
    {
      id: "q2",
      question:
        "useRef<HTMLInputElement>(null)의 반환 타입은?",
      choices: [
        "MutableRefObject<HTMLInputElement>",
        "RefObject<HTMLInputElement>",
        "MutableRefObject<HTMLInputElement | null>",
        "Ref<HTMLInputElement>",
      ],
      correctIndex: 1,
      explanation:
        "useRef<T>(null)에서 초기값이 null이고 제네릭 T에 null이 포함되지 않으면 RefObject<T>를 반환합니다. current는 readonly이므로 React가 DOM 연결을 관리합니다.",
    },
    {
      id: "q3",
      question: "useReducer의 액션 타입을 정의할 때 가장 적합한 패턴은?",
      choices: [
        "string enum",
        "discriminated union",
        "generic interface",
        "any 타입",
      ],
      correctIndex: 1,
      explanation:
        "discriminated union(판별 유니온)은 type 프로퍼티를 판별자로 사용하여 각 액션별 payload 타입을 정확히 좁힐 수 있습니다. switch문에서 자동으로 타입이 좁혀집니다.",
    },
    {
      id: "q4",
      question: "커스텀 Hook에서 [value, setter]를 반환할 때 타입을 유지하는 방법은?",
      choices: [
        "return [value, setter] 그대로 반환",
        "return [value, setter] as const",
        "return { value, setter } 객체로 반환",
        "반환 타입을 any로 지정",
      ],
      correctIndex: 1,
      explanation:
        "as const 없이 배열을 반환하면 (T | Function)[]로 추론됩니다. as const를 붙이면 readonly [T, (v: T) => void] 튜플로 추론되어 구조 분해 시 정확한 타입을 유지합니다.",
    },
    {
      id: "q5",
      question: "createContext<AuthType | null>(null) 후, useContext 사용 시 null 처리 방법은?",
      choices: [
        "non-null assertion(!)을 항상 사용",
        "커스텀 Hook에서 null 체크 후 throw하여 non-null 반환",
        "createContext에서 기본값을 빈 객체로 설정",
        "타입 단언으로 as AuthType 사용",
      ],
      correctIndex: 1,
      explanation:
        "커스텀 Hook(예: useAuth)에서 useContext 결과가 null이면 Error를 throw하고, 아니면 값을 반환합니다. Provider 없이 사용하는 실수를 런타임에 즉시 잡을 수 있고, 반환 타입은 non-null이 됩니다.",
    },
  ],
};

export default chapter;
