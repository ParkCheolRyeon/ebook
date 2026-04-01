import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "12-usereducer",
  subject: "react",
  title: "useReducer: 복잡한 상태 관리",
  description: "useReducer로 복잡한 상태 로직을 action/dispatch 패턴으로 체계적으로 관리하고, TypeScript와 discriminated union을 활용합니다.",
  order: 12,
  group: "Hooks 심화",
  prerequisites: ["11-usememo-usecallback"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "useReducer는 **레스토랑 주문 시스템**과 같습니다.\n\n" +
        "useState가 직접 주방에 가서 '이 재료를 이렇게 바꿔주세요'라고 말하는 것이라면, useReducer는 **주문서(action)**를 써서 **웨이터(dispatch)**에게 건네는 것입니다.\n\n" +
        "주방장(reducer)은 현재 메뉴판(state)과 주문서(action)를 보고 새 메뉴판(새 state)을 만듭니다. 주방장은 항상 같은 주문서에 같은 결과를 내놓습니다(순수 함수).\n\n" +
        "이 방식의 장점은:\n" +
        "- 모든 상태 변경이 주문서(action)로 기록되어 **추적 가능**\n" +
        "- 주방장(reducer)을 별도로 **테스트** 가능\n" +
        "- 복잡한 주문도 주문서 한 장으로 **명확하게** 전달",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "useState는 단순한 상태에 적합하지만, 다음 상황에서는 관리가 어려워집니다:\n\n" +
        "1. **관련된 여러 상태값** — form의 여러 필드, 로딩/에러/데이터 상태\n" +
        "2. **복잡한 상태 전이** — 이전 상태에 따라 다음 상태가 결정되는 경우\n" +
        "3. **여러 이벤트가 같은 상태를 변경** — 추가, 삭제, 수정이 모두 같은 목록을 변경\n\n" +
        "useState를 여러 개 사용하면:\n" +
        "- 관련 상태가 흩어져 동기화 문제 발생\n" +
        "- 상태 변경 로직이 이벤트 핸들러에 분산\n" +
        "- 잘못된 상태 조합이 가능 (`isLoading: true`이면서 `error: 존재`)\n\n" +
        "TypeScript를 사용할 때도, 여러 useState의 타입을 일일이 지정하는 것보다 하나의 상태 타입으로 관리하는 것이 안전합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### useReducer 기본 구조\n" +
        "`const [state, dispatch] = useReducer(reducer, initialState)`\n\n" +
        "- **reducer**: `(state, action) => newState` 순수 함수\n" +
        "- **dispatch**: action 객체를 보내는 함수\n" +
        "- **action**: `{ type: string, payload?: any }` 형태의 객체\n\n" +
        "### useState vs useReducer 선택 기준\n" +
        "- **useState**: 독립적인 단순 값 (toggle, counter, input 하나)\n" +
        "- **useReducer**: 관련된 여러 값, 복잡한 전이, action 기록이 필요할 때\n\n" +
        "### TypeScript + Discriminated Union\n" +
        "action의 `type` 필드를 리터럴 타입으로 정의하면, TypeScript가 각 action에 맞는 payload 타입을 자동으로 추론합니다.\n\n" +
        "### 장점\n" +
        "- reducer는 순수 함수이므로 **단위 테스트 용이**\n" +
        "- 모든 상태 변경이 action으로 기록되어 **디버깅 용이**\n" +
        "- 잘못된 상태 조합을 **타입 레벨**에서 방지 가능",
    },
    {
      type: "pseudocode",
      title: "기술 구현: useReducer 내부 동작",
      content:
        "useReducer가 내부적으로 어떻게 동작하는지, 그리고 TypeScript의 discriminated union이 어떻게 타입 안전성을 보장하는지 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// useReducer 내부 동작 (의사코드)\n' +
          'function useReducer<S, A>(\n' +
          '  reducer: (state: S, action: A) => S,\n' +
          '  initialState: S\n' +
          '): [S, (action: A) => void] {\n' +
          '  const hook = getCurrentHook<{ state: S }>();\n' +
          '\n' +
          '  if (isFirstRender()) {\n' +
          '    hook.state = initialState;\n' +
          '  }\n' +
          '\n' +
          '  const dispatch = (action: A): void => {\n' +
          '    const newState = reducer(hook.state, action);\n' +
          '    if (!Object.is(hook.state, newState)) {\n' +
          '      hook.state = newState;\n' +
          '      scheduleRerender();\n' +
          '    }\n' +
          '  };\n' +
          '\n' +
          '  return [hook.state, dispatch];\n' +
          '}\n' +
          '\n' +
          '// TypeScript: Discriminated Union으로 타입 안전한 action\n' +
          'type TodoAction =\n' +
          '  | { type: "ADD"; payload: { text: string } }\n' +
          '  | { type: "TOGGLE"; payload: { id: number } }\n' +
          '  | { type: "DELETE"; payload: { id: number } }\n' +
          '  | { type: "CLEAR" }; // payload 없음\n' +
          '\n' +
          'interface TodoState {\n' +
          '  todos: { id: number; text: string; done: boolean }[];\n' +
          '  nextId: number;\n' +
          '}\n' +
          '\n' +
          '// reducer에서 switch로 분기하면 TypeScript가 payload 타입 자동 추론\n' +
          'function todoReducer(state: TodoState, action: TodoAction): TodoState {\n' +
          '  switch (action.type) {\n' +
          '    case "ADD":\n' +
          '      // action.payload는 { text: string }으로 추론됨\n' +
          '      return {\n' +
          '        todos: [...state.todos, {\n' +
          '          id: state.nextId,\n' +
          '          text: action.payload.text,\n' +
          '          done: false,\n' +
          '        }],\n' +
          '        nextId: state.nextId + 1,\n' +
          '      };\n' +
          '    case "TOGGLE":\n' +
          '      // action.payload는 { id: number }로 추론됨\n' +
          '      return {\n' +
          '        ...state,\n' +
          '        todos: state.todos.map(t =>\n' +
          '          t.id === action.payload.id ? { ...t, done: !t.done } : t\n' +
          '        ),\n' +
          '      };\n' +
          '    case "DELETE":\n' +
          '      return {\n' +
          '        ...state,\n' +
          '        todos: state.todos.filter(t => t.id !== action.payload.id),\n' +
          '      };\n' +
          '    case "CLEAR":\n' +
          '      return { ...state, todos: [] };\n' +
          '  }\n' +
          '}',
        description: "Discriminated Union을 사용하면 각 action type에 맞는 payload 타입이 자동으로 추론됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Todo 앱과 비동기 상태 관리",
      content:
        "useReducer를 활용한 실전 패턴을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          'import { useReducer } from "react";\n' +
          '\n' +
          '// 패턴 1: 비동기 데이터 페칭 상태\n' +
          'type FetchState<T> =\n' +
          '  | { status: "idle" }\n' +
          '  | { status: "loading" }\n' +
          '  | { status: "success"; data: T }\n' +
          '  | { status: "error"; error: string };\n' +
          '\n' +
          'type FetchAction<T> =\n' +
          '  | { type: "FETCH_START" }\n' +
          '  | { type: "FETCH_SUCCESS"; payload: T }\n' +
          '  | { type: "FETCH_ERROR"; payload: string };\n' +
          '\n' +
          'function fetchReducer<T>(\n' +
          '  state: FetchState<T>,\n' +
          '  action: FetchAction<T>\n' +
          '): FetchState<T> {\n' +
          '  switch (action.type) {\n' +
          '    case "FETCH_START":\n' +
          '      return { status: "loading" };\n' +
          '    case "FETCH_SUCCESS":\n' +
          '      return { status: "success", data: action.payload };\n' +
          '    case "FETCH_ERROR":\n' +
          '      return { status: "error", error: action.payload };\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// 사용 예시\n' +
          'function UserList() {\n' +
          '  const [state, dispatch] = useReducer(\n' +
          '    fetchReducer<User[]>,\n' +
          '    { status: "idle" }\n' +
          '  );\n' +
          '\n' +
          '  const loadUsers = async () => {\n' +
          '    dispatch({ type: "FETCH_START" });\n' +
          '    try {\n' +
          '      const res = await fetch("/api/users");\n' +
          '      const data = await res.json();\n' +
          '      dispatch({ type: "FETCH_SUCCESS", payload: data });\n' +
          '    } catch (e) {\n' +
          '      dispatch({ type: "FETCH_ERROR", payload: String(e) });\n' +
          '    }\n' +
          '  };\n' +
          '\n' +
          '  // 상태에 따른 분기 — 잘못된 조합 불가능\n' +
          '  if (state.status === "loading") return <p>로딩 중...</p>;\n' +
          '  if (state.status === "error") return <p>에러: {state.error}</p>;\n' +
          '  if (state.status === "success") {\n' +
          '    return <ul>{state.data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;\n' +
          '  }\n' +
          '  return <button onClick={loadUsers}>불러오기</button>;\n' +
          '}\n' +
          '\n' +
          'interface User { id: number; name: string; }',
        description: "Discriminated Union 상태를 사용하면 loading이면서 error인 불가능한 상태를 타입 레벨에서 방지합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 비교 | useState | useReducer |\n" +
        "|------|---------|------------|\n" +
        "| 상태 구조 | 단순한 값 | 복합 객체 |\n" +
        "| 변경 로직 | 인라인 | reducer 함수 분리 |\n" +
        "| 테스트 | 어려움 | reducer 단위 테스트 용이 |\n" +
        "| 디버깅 | 직접 추적 | action 로그로 추적 |\n" +
        "| TypeScript | 개별 타입 지정 | discriminated union |\n\n" +
        "**핵심:** 상태 변경 로직이 3개 이상이거나, 관련 상태가 여러 개이면 useReducer를 고려하세요.\n\n" +
        "**다음 챕터 미리보기:** useContext로 prop drilling 없이 여러 컴포넌트에 상태를 공유하는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "useReducer의 reducer, dispatch, action 개념을 설명할 수 있다",
    "useState vs useReducer 선택 기준을 제시할 수 있다",
    "TypeScript discriminated union으로 타입 안전한 action을 정의할 수 있다",
    "reducer가 순수 함수여야 하는 이유를 설명할 수 있다",
    "비동기 상태 관리에 useReducer를 활용할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "reducer 함수의 올바른 시그니처는?",
      choices: [
        "(action) => state",
        "(state, action) => newState",
        "(state) => action",
        "(dispatch, action) => state",
      ],
      correctIndex: 1,
      explanation: "reducer는 현재 state와 action을 받아 새로운 state를 반환하는 순수 함수입니다.",
    },
    {
      id: "q2",
      question: "다음 중 useReducer가 useState보다 적합한 경우는?",
      choices: [
        "boolean 토글",
        "단일 input 값",
        "여러 필드가 연관된 form 상태",
        "카운터",
      ],
      correctIndex: 2,
      explanation: "여러 필드가 서로 연관된 복잡한 상태는 useReducer로 하나의 reducer에서 관리하는 것이 적합합니다.",
    },
    {
      id: "q3",
      question: "TypeScript discriminated union의 핵심은?",
      choices: [
        "모든 타입을 하나로 합치는 것",
        "type 필드의 리터럴 타입으로 각 분기의 타입을 추론하는 것",
        "제네릭을 사용하는 것",
        "any 타입을 피하는 것",
      ],
      correctIndex: 1,
      explanation: "type 필드를 리터럴 타입(\"ADD\", \"DELETE\" 등)으로 정의하면, switch문에서 해당 분기의 payload 타입이 자동으로 추론됩니다.",
    },
    {
      id: "q4",
      question: "reducer 함수 안에서 하면 안 되는 것은?",
      choices: [
        "새 객체 생성",
        "조건 분기",
        "API 호출(사이드이펙트)",
        "스프레드 연산자 사용",
      ],
      correctIndex: 2,
      explanation: "reducer는 순수 함수여야 합니다. API 호출, 타이머 설정 등의 사이드이펙트는 reducer 밖에서(이벤트 핸들러나 useEffect에서) 처리해야 합니다.",
    },
    {
      id: "q5",
      question: "dispatch 함수의 특징으로 올바른 것은?",
      choices: [
        "매 렌더링마다 참조가 바뀐다",
        "비동기적으로 동작한다",
        "컴포넌트 생명주기 동안 참조가 안정적이다",
        "직접 state를 수정한다",
      ],
      correctIndex: 2,
      explanation: "dispatch 함수는 useReducer의 반환값으로, 컴포넌트 생명주기 동안 참조가 변하지 않습니다. 이로 인해 useCallback으로 감쌀 필요가 없습니다.",
    },
  ],
};

export default chapter;
