import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "36-zustand",
  subject: "react",
  title: "Zustand",
  description:
    "Zustand의 최소 API(create), 스토어 패턴, 셀렉터 기반 리렌더링 최적화, 미들웨어(persist, devtools, immer) 활용법을 학습합니다.",
  order: 36,
  group: "상태 관리",
  prerequisites: ["35-redux-toolkit-advanced"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Redux가 대형 은행이라면, Zustand는 모바일 간편결제 앱입니다.\n\n" +
        "**create**는 앱 설치입니다. 계좌 개설 서류(보일러플레이트) 없이 바로 사용할 수 있습니다.\n\n" +
        "**셀렉터**는 알림 설정입니다. 입금 알림만 켜면 출금 알림은 오지 않습니다. 관심 있는 상태 변경만 구독하여 불필요한 리렌더링을 방지합니다.\n\n" +
        "**미들웨어**는 자동이체, 가계부 연동 같은 부가 기능입니다. persist(자동 저장), devtools(거래 내역 조회), immer(편리한 업데이트)를 필요에 따라 추가합니다.\n\n" +
        "핵심은 **단순함**입니다. Provider 없이, Action Type 없이, 함수 하나로 전역 상태를 만들 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "Redux Toolkit은 강력하지만, 모든 프로젝트에 적합하지는 않습니다.\n\n" +
        "1. **과도한 보일러플레이트** — 간단한 전역 상태에도 Slice, Store, Provider, 타입 설정이 필요합니다\n" +
        "2. **학습 곡선** — Action, Reducer, Dispatch, Thunk, Middleware 등 많은 개념을 이해해야 합니다\n" +
        "3. **Provider 필수** — 컴포넌트 트리 최상단에 Provider를 감싸야 합니다\n" +
        "4. **번들 크기** — Redux Toolkit + React Redux의 번들 크기가 작지 않습니다\n\n" +
        "중소 규모 프로젝트에서는 더 가볍고 직관적인 대안이 필요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Zustand는 최소한의 API로 강력한 전역 상태 관리를 제공합니다.\n\n" +
        "### create 함수\n" +
        "하나의 함수 호출로 스토어를 생성합니다. 상태와 액션을 함께 정의하며, 반환된 Hook을 바로 컴포넌트에서 사용합니다.\n\n" +
        "### 셀렉터 기반 최적화\n" +
        "Hook에 셀렉터 함수를 전달하면 해당 값이 변경될 때만 리렌더링됩니다. Redux의 useSelector와 유사하지만 설정이 불필요합니다.\n\n" +
        "### 미들웨어 조합\n" +
        "- `persist`: localStorage/sessionStorage에 상태를 자동 저장/복원\n" +
        "- `devtools`: Redux DevTools로 상태 변경 추적\n" +
        "- `immer`: Immer를 통한 불변 업데이트 간편화\n\n" +
        "### Provider 불필요\n" +
        "Zustand 스토어는 React 외부에 존재하므로 Provider 없이 어디서든 사용 가능합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Zustand 스토어 생성과 미들웨어",
      content:
        "Zustand 스토어를 생성하고 미들웨어를 적용하는 패턴입니다.",
      code: {
        language: "typescript",
        code:
          'import { create } from "zustand";\n' +
          'import { devtools, persist } from "zustand/middleware";\n' +
          'import { immer } from "zustand/middleware/immer";\n' +
          '\n' +
          '// 타입 정의\n' +
          'interface Todo {\n' +
          '  id: number;\n' +
          '  text: string;\n' +
          '  completed: boolean;\n' +
          '}\n' +
          '\n' +
          'interface TodoStore {\n' +
          '  todos: Todo[];\n' +
          '  filter: "all" | "active" | "completed";\n' +
          '  // 액션도 스토어에 함께 정의\n' +
          '  addTodo: (text: string) => void;\n' +
          '  toggleTodo: (id: number) => void;\n' +
          '  removeTodo: (id: number) => void;\n' +
          '  setFilter: (filter: TodoStore["filter"]) => void;\n' +
          '}\n' +
          '\n' +
          '// 미들웨어 조합: devtools + persist + immer\n' +
          'const useTodoStore = create<TodoStore>()(\n' +
          '  devtools(\n' +
          '    persist(\n' +
          '      immer((set) => ({\n' +
          '        todos: [],\n' +
          '        filter: "all",\n' +
          '\n' +
          '        addTodo: (text) =>\n' +
          '          set((state) => {\n' +
          '            // immer 미들웨어 덕분에 직접 수정 가능\n' +
          '            state.todos.push({\n' +
          '              id: Date.now(),\n' +
          '              text,\n' +
          '              completed: false,\n' +
          '            });\n' +
          '          }),\n' +
          '\n' +
          '        toggleTodo: (id) =>\n' +
          '          set((state) => {\n' +
          '            const todo = state.todos.find((t) => t.id === id);\n' +
          '            if (todo) todo.completed = !todo.completed;\n' +
          '          }),\n' +
          '\n' +
          '        removeTodo: (id) =>\n' +
          '          set((state) => {\n' +
          '            state.todos = state.todos.filter((t) => t.id !== id);\n' +
          '          }),\n' +
          '\n' +
          '        setFilter: (filter) => set({ filter }),\n' +
          '      })),\n' +
          '      { name: "todo-storage" } // persist 설정: localStorage 키\n' +
          '    ),\n' +
          '    { name: "TodoStore" } // devtools 설정: DevTools에 표시될 이름\n' +
          '  )\n' +
          ');',
        description:
          "create 함수 하나로 상태, 액션, 미들웨어를 모두 설정합니다. Provider 설정이 불필요합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 셀렉터로 리렌더링 최적화",
      content:
        "셀렉터를 활용하여 필요한 상태만 구독하고 불필요한 리렌더링을 방지하는 실습입니다.",
      code: {
        language: "typescript",
        code:
          'import { create } from "zustand";\n' +
          'import { useShallow } from "zustand/react/shallow";\n' +
          '\n' +
          'interface AppStore {\n' +
          '  user: { name: string; email: string } | null;\n' +
          '  theme: "light" | "dark";\n' +
          '  notifications: number;\n' +
          '  setTheme: (theme: "light" | "dark") => void;\n' +
          '  incrementNotifications: () => void;\n' +
          '}\n' +
          '\n' +
          'const useAppStore = create<AppStore>((set) => ({\n' +
          '  user: null,\n' +
          '  theme: "light",\n' +
          '  notifications: 0,\n' +
          '  setTheme: (theme) => set({ theme }),\n' +
          '  incrementNotifications: () =>\n' +
          '    set((state) => ({ notifications: state.notifications + 1 })),\n' +
          '}));\n' +
          '\n' +
          '// ✅ 셀렉터로 필요한 값만 구독\n' +
          '// theme이 변경되어도 이 컴포넌트는 리렌더링되지 않음\n' +
          'function NotificationBadge() {\n' +
          '  const count = useAppStore((state) => state.notifications);\n' +
          '  return <span>{count}</span>;\n' +
          '}\n' +
          '\n' +
          '// ✅ 여러 값을 구독할 때는 useShallow 사용\n' +
          'function UserHeader() {\n' +
          '  const { name, theme } = useAppStore(\n' +
          '    useShallow((state) => ({\n' +
          '      name: state.user?.name ?? "Guest",\n' +
          '      theme: state.theme,\n' +
          '    }))\n' +
          '  );\n' +
          '  return <div>{name} ({theme})</div>;\n' +
          '}\n' +
          '\n' +
          '// ✅ React 외부에서도 스토어 접근 가능\n' +
          'function logCurrentTheme() {\n' +
          '  const theme = useAppStore.getState().theme;\n' +
          '  console.log("현재 테마:", theme);\n' +
          '}\n' +
          '\n' +
          '// ✅ 구독 없이 상태 변경도 가능\n' +
          'function resetNotifications() {\n' +
          '  useAppStore.setState({ notifications: 0 });\n' +
          '}',
        description:
          "셀렉터 함수로 필요한 상태만 구독하고, useShallow로 여러 값을 안전하게 구독합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 특징 | Redux Toolkit | Zustand |\n" +
        "|------|--------------|--------|\n" +
        "| 보일러플레이트 | 많음 (Slice, Store, Provider) | 최소 (create 함수 하나) |\n" +
        "| Provider | 필수 | 불필요 |\n" +
        "| 번들 크기 | ~33KB | ~1.5KB |\n" +
        "| 미들웨어 | 내장 (thunk, devtools) | 선택적 추가 |\n" +
        "| 학습 곡선 | 높음 | 낮음 |\n" +
        "| React 외부 접근 | getState() 가능 | getState() 가능 |\n\n" +
        "**핵심:** Zustand는 최소한의 코드로 강력한 전역 상태 관리를 제공합니다. 셀렉터로 리렌더링을 최적화하고, 미들웨어로 기능을 확장할 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** Context, Redux, Zustand를 비교하여 프로젝트별 최적의 선택 기준을 정립합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "Zustand는 보일러플레이트가 거의 없는 경량 상태 관리 라이브러리다. create 하나로 스토어를 만들고, 컴포넌트에서 Hook처럼 꺼내 쓰면 된다.",
  checklist: [
    "create 함수로 Zustand 스토어를 생성하고 컴포넌트에서 사용할 수 있다",
    "셀렉터 함수로 필요한 상태만 구독하여 리렌더링을 최적화할 수 있다",
    "useShallow를 사용하여 여러 값을 안전하게 구독할 수 있다",
    "persist, devtools, immer 미들웨어를 조합하여 적용할 수 있다",
    "React 외부에서 getState/setState로 스토어에 접근할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Zustand가 Redux Toolkit 대비 가장 큰 장점은?",
      choices: [
        "더 강력한 미들웨어 시스템",
        "내장 서버 상태 관리",
        "최소한의 보일러플레이트와 Provider 불필요",
        "더 나은 TypeScript 지원",
      ],
      correctIndex: 2,
      explanation:
        "Zustand는 create 함수 하나로 스토어를 생성하며, Provider 없이 어디서든 사용할 수 있어 보일러플레이트가 최소입니다.",
    },
    {
      id: "q2",
      question: "Zustand에서 리렌더링을 최적화하는 방법은?",
      choices: [
        "React.memo로 컴포넌트를 감싸기",
        "셀렉터 함수로 필요한 상태만 구독",
        "useCallback으로 액션 감싸기",
        "Provider에 memoize 옵션 설정",
      ],
      correctIndex: 1,
      explanation:
        "useStore(state => state.count)처럼 셀렉터 함수를 전달하면, 해당 값이 변경될 때만 컴포넌트가 리렌더링됩니다.",
    },
    {
      id: "q3",
      question: "Zustand의 persist 미들웨어의 역할은?",
      choices: [
        "상태 변경을 로깅",
        "상태를 localStorage에 자동 저장/복원",
        "불변 업데이트를 자동 처리",
        "Redux DevTools와 연동",
      ],
      correctIndex: 1,
      explanation:
        "persist 미들웨어는 스토어 상태를 localStorage(또는 다른 스토리지)에 자동으로 저장하고, 앱 재시작 시 복원합니다.",
    },
    {
      id: "q4",
      question: "Zustand에서 여러 상태 값을 한 번에 구독할 때 권장하는 방법은?",
      choices: [
        "useStore()를 인자 없이 호출",
        "useShallow와 함께 객체를 반환하는 셀렉터 사용",
        "여러 개의 useStore() 호출",
        "subscribe 메서드 사용",
      ],
      correctIndex: 1,
      explanation:
        "useShallow를 사용하면 셀렉터가 반환하는 객체를 얕은 비교하여, 실제 값이 변경되지 않으면 리렌더링을 방지합니다.",
    },
    {
      id: "q5",
      question: "Zustand 스토어를 React 컴포넌트 외부에서 사용하는 방법은?",
      choices: [
        "불가능하다",
        "useStore.getState()와 useStore.setState() 사용",
        "별도의 Provider를 생성해야 한다",
        "createAsyncThunk를 사용해야 한다",
      ],
      correctIndex: 1,
      explanation:
        "Zustand 스토어는 React 외부에 존재하므로 getState()로 현재 상태를 읽고, setState()로 상태를 변경할 수 있습니다.",
    },
  ],
};

export default chapter;
