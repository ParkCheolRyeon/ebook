import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "34-redux-toolkit-basics",
  subject: "react",
  title: "Redux Toolkit 기초",
  description:
    "Redux Toolkit의 핵심 개념인 Store, createSlice, Reducer, Action을 학습하고, configureStore, useSelector, useDispatch로 React와 연동합니다.",
  order: 34,
  group: "상태 관리",
  prerequisites: ["33-context-api-advanced"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Redux는 은행 시스템과 같습니다.\n\n" +
        "**Store**는 은행 금고입니다. 모든 자산(상태)이 한곳에 안전하게 보관됩니다.\n\n" +
        "**Action**은 입출금 전표입니다. '10만원 입금', '5만원 출금' 같은 구체적인 요청서를 작성해야 합니다. 금고에 직접 손을 넣을 수 없습니다.\n\n" +
        "**Reducer**는 은행 창구 직원입니다. 전표(Action)를 받아 규칙에 따라 금고(Store)의 잔액을 변경합니다.\n\n" +
        "**useSelector**는 잔액 조회 앱입니다. 필요한 정보만 골라서 확인할 수 있습니다.\n\n" +
        "**Redux Toolkit**은 은행의 자동화 시스템입니다. 전표 양식, 직원 매뉴얼, 금고 설정 등 반복적인 작업을 자동화하여 보일러플레이트를 크게 줄여줍니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "대규모 앱에서 상태 관리의 어려움:\n\n" +
        "1. **예측 불가능한 상태 변경** — 여러 컴포넌트가 동일한 상태를 직접 수정하면 어디서 변경이 일어났는지 추적하기 어렵습니다\n" +
        "2. **상태 변경 히스토리 부재** — 디버깅 시 상태가 언제, 왜 변경되었는지 알 수 없습니다\n" +
        "3. **레거시 Redux의 복잡함** — 기존 Redux는 Action Type 상수, Action Creator, 불변 업데이트 로직 등 과도한 보일러플레이트가 필요했습니다\n" +
        "4. **타입 안전성 부족** — 기존 Redux는 TypeScript와의 통합이 번거로웠습니다",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Redux Toolkit(RTK)은 Redux의 공식 권장 도구로, 보일러플레이트를 대폭 줄입니다.\n\n" +
        "### createSlice\n" +
        "Action Type, Action Creator, Reducer를 한 번에 생성합니다. Immer가 내장되어 있어 불변 업데이트를 직관적으로 작성할 수 있습니다.\n\n" +
        "### configureStore\n" +
        "Redux DevTools, Thunk 미들웨어 등을 자동 설정합니다. 기존의 복잡한 스토어 설정을 한 줄로 대체합니다.\n\n" +
        "### useSelector와 useDispatch\n" +
        "React 컴포넌트에서 Store의 상태를 읽고 Action을 발행하는 Hook입니다. 타입 안전한 커스텀 Hook을 만들어 사용하는 것이 모범 사례입니다.\n\n" +
        "### 단방향 데이터 흐름\n" +
        "UI → dispatch(Action) → Reducer → Store 업데이트 → UI 리렌더링. 모든 상태 변경이 예측 가능하고 추적 가능합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Redux Toolkit 기본 구조",
      content:
        "createSlice와 configureStore로 카운터 스토어를 구성하는 전체 흐름입니다.",
      code: {
        language: "typescript",
        code:
          'import { createSlice, configureStore, type PayloadAction } from "@reduxjs/toolkit";\n' +
          '\n' +
          '// 1. Slice 생성: Reducer + Action을 한 번에 정의\n' +
          'interface CounterState {\n' +
          '  value: number;\n' +
          '}\n' +
          '\n' +
          'const initialState: CounterState = { value: 0 };\n' +
          '\n' +
          'const counterSlice = createSlice({\n' +
          '  name: "counter",\n' +
          '  initialState,\n' +
          '  reducers: {\n' +
          '    // Immer 덕분에 "변경"하는 것처럼 작성해도 불변 업데이트 수행\n' +
          '    increment(state) {\n' +
          '      state.value += 1;\n' +
          '    },\n' +
          '    decrement(state) {\n' +
          '      state.value -= 1;\n' +
          '    },\n' +
          '    incrementByAmount(state, action: PayloadAction<number>) {\n' +
          '      state.value += action.payload;\n' +
          '    },\n' +
          '  },\n' +
          '});\n' +
          '\n' +
          '// 자동 생성된 Action Creator\n' +
          'export const { increment, decrement, incrementByAmount } = counterSlice.actions;\n' +
          '\n' +
          '// 2. Store 생성\n' +
          'const store = configureStore({\n' +
          '  reducer: {\n' +
          '    counter: counterSlice.reducer,\n' +
          '  },\n' +
          '});\n' +
          '\n' +
          '// 3. 타입 추출 (타입 안전한 Hook 생성용)\n' +
          'type RootState = ReturnType<typeof store.getState>;\n' +
          'type AppDispatch = typeof store.dispatch;',
        description:
          "createSlice는 name, initialState, reducers를 받아 Action Creator와 Reducer를 자동 생성합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Todo 앱 Redux Toolkit 연동",
      content:
        "Todo 앱을 Redux Toolkit으로 구현하여 Store, Slice, React 연동을 실습합니다.",
      code: {
        language: "typescript",
        code:
          'import { createSlice, configureStore, type PayloadAction } from "@reduxjs/toolkit";\n' +
          'import { Provider, useSelector, useDispatch } from "react-redux";\n' +
          '\n' +
          '// Slice 정의\n' +
          'interface Todo {\n' +
          '  id: number;\n' +
          '  text: string;\n' +
          '  completed: boolean;\n' +
          '}\n' +
          '\n' +
          'const todosSlice = createSlice({\n' +
          '  name: "todos",\n' +
          '  initialState: [] as Todo[],\n' +
          '  reducers: {\n' +
          '    addTodo(state, action: PayloadAction<string>) {\n' +
          '      state.push({\n' +
          '        id: Date.now(),\n' +
          '        text: action.payload,\n' +
          '        completed: false,\n' +
          '      });\n' +
          '    },\n' +
          '    toggleTodo(state, action: PayloadAction<number>) {\n' +
          '      const todo = state.find((t) => t.id === action.payload);\n' +
          '      if (todo) {\n' +
          '        todo.completed = !todo.completed;\n' +
          '      }\n' +
          '    },\n' +
          '    removeTodo(state, action: PayloadAction<number>) {\n' +
          '      return state.filter((t) => t.id !== action.payload);\n' +
          '    },\n' +
          '  },\n' +
          '});\n' +
          '\n' +
          'const { addTodo, toggleTodo, removeTodo } = todosSlice.actions;\n' +
          '\n' +
          '// Store 생성\n' +
          'const store = configureStore({\n' +
          '  reducer: { todos: todosSlice.reducer },\n' +
          '});\n' +
          '\n' +
          'type RootState = ReturnType<typeof store.getState>;\n' +
          'type AppDispatch = typeof store.dispatch;\n' +
          '\n' +
          '// 타입 안전한 Hook\n' +
          'const useAppSelector = useSelector.withTypes<RootState>();\n' +
          'const useAppDispatch = useDispatch.withTypes<AppDispatch>();\n' +
          '\n' +
          '// 컴포넌트에서 사용\n' +
          'function TodoList() {\n' +
          '  const todos = useAppSelector((state) => state.todos);\n' +
          '  const dispatch = useAppDispatch();\n' +
          '\n' +
          '  return (\n' +
          '    <ul>\n' +
          '      {todos.map((todo) => (\n' +
          '        <li key={todo.id}>\n' +
          '          <span\n' +
          '            onClick={() => dispatch(toggleTodo(todo.id))}\n' +
          '          >\n' +
          '            {todo.completed ? "✓" : "○"} {todo.text}\n' +
          '          </span>\n' +
          '          <button onClick={() => dispatch(removeTodo(todo.id))}>\n' +
          '            삭제\n' +
          '          </button>\n' +
          '        </li>\n' +
          '      ))}\n' +
          '    </ul>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 앱 루트에 Provider 설정\n' +
          'function App() {\n' +
          '  return (\n' +
          '    <Provider store={store}>\n' +
          '      <TodoList />\n' +
          '    </Provider>\n' +
          '  );\n' +
          '}',
        description:
          "createSlice로 Reducer와 Action을 정의하고, useSelector/useDispatch로 React 컴포넌트에서 Store와 연동합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 역할 |\n" +
        "|------|------|\n" +
        "| Store | 앱의 전체 상태를 보관하는 단일 저장소 |\n" +
        "| createSlice | Reducer + Action Creator를 한 번에 생성 |\n" +
        "| configureStore | Store 생성 + DevTools + 미들웨어 자동 설정 |\n" +
        "| useSelector | Store에서 필요한 상태를 선택적으로 구독 |\n" +
        "| useDispatch | Action을 Store에 발행 |\n" +
        "| PayloadAction | Action의 payload 타입을 지정 |\n\n" +
        "**핵심:** Redux Toolkit은 기존 Redux의 보일러플레이트를 대폭 줄이면서도 예측 가능한 단방향 데이터 흐름을 유지합니다. Immer 내장으로 불변 업데이트를 직관적으로 작성할 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** 비동기 처리(createAsyncThunk)와 RTK Query를 사용한 서버 상태 관리를 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "Redux Toolkit은 slice 안에 state, reducer, action을 한 곳에 정의한다. createSlice + configureStore만으로 보일러플레이트 없이 Redux를 설정할 수 있다.",
  checklist: [
    "createSlice로 Reducer와 Action Creator를 동시에 생성할 수 있다",
    "configureStore로 Store를 생성하고 React에 Provider로 연결할 수 있다",
    "useSelector와 useDispatch를 사용하여 컴포넌트에서 Store와 연동할 수 있다",
    "PayloadAction을 사용하여 타입 안전한 Action을 정의할 수 있다",
    "Immer를 통한 불변 업데이트 방식을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "createSlice가 자동으로 생성해주는 것은?",
      choices: [
        "Store와 Provider",
        "Action Type 상수와 Action Creator",
        "useSelector와 useDispatch",
        "미들웨어와 DevTools",
      ],
      correctIndex: 1,
      explanation:
        "createSlice는 reducers에 정의된 각 함수에 대해 Action Type 문자열과 Action Creator 함수를 자동으로 생성합니다.",
    },
    {
      id: "q2",
      question:
        "Redux Toolkit의 createSlice에서 state를 직접 변경하는 것처럼 작성해도 되는 이유는?",
      choices: [
        "JavaScript의 Proxy 객체를 사용하여 깊은 복사를 수행해서",
        "내장된 Immer 라이브러리가 불변 업데이트로 변환해서",
        "Redux가 내부적으로 Object.freeze를 사용해서",
        "React의 상태 관리 시스템이 자동으로 처리해서",
      ],
      correctIndex: 1,
      explanation:
        "Redux Toolkit은 Immer를 내장하고 있어, Reducer에서 state를 직접 수정하는 코드를 작성해도 Immer가 이를 불변 업데이트로 변환합니다.",
    },
    {
      id: "q3",
      question: "configureStore가 자동으로 설정해주는 것을 모두 고르면?",
      choices: [
        "Redux DevTools와 thunk 미들웨어",
        "React Router와 ErrorBoundary",
        "TypeScript 타입과 ESLint 규칙",
        "Context API와 Provider",
      ],
      correctIndex: 0,
      explanation:
        "configureStore는 Redux DevTools Extension 연동과 redux-thunk 미들웨어를 기본으로 설정합니다.",
    },
    {
      id: "q4",
      question: "타입 안전한 useSelector와 useDispatch를 만드는 권장 방법은?",
      choices: [
        "제네릭 타입을 매번 전달한다",
        "any 타입으로 캐스팅한다",
        "withTypes를 사용하여 타입이 지정된 커스텀 Hook을 만든다",
        "TypeScript 설정에서 strict 모드를 끈다",
      ],
      correctIndex: 2,
      explanation:
        "useSelector.withTypes<RootState>()와 useDispatch.withTypes<AppDispatch>()를 사용하면 매번 타입을 전달하지 않아도 됩니다.",
    },
    {
      id: "q5",
      question: "Redux의 단방향 데이터 흐름 순서는?",
      choices: [
        "Store → Action → Reducer → UI",
        "UI → dispatch(Action) → Reducer → Store → UI",
        "Reducer → Action → Store → UI",
        "UI → Store → Reducer → Action → UI",
      ],
      correctIndex: 1,
      explanation:
        "UI에서 Action을 dispatch하면, Reducer가 Action을 처리하여 Store를 업데이트하고, 변경된 Store 상태에 따라 UI가 리렌더링됩니다.",
    },
    {
      id: "q6",
      question: "Redux에서 상태를 변경하는 유일한 방법은?",
      choices: [
        "store.state를 직접 수정",
        "useSelector의 반환값을 수정",
        "Action을 dispatch",
        "Provider의 props를 변경",
      ],
      correctIndex: 2,
      explanation:
        "Redux에서 상태를 변경하는 유일한 방법은 Action을 dispatch하는 것입니다. 이를 통해 모든 상태 변경을 추적할 수 있습니다.",
    },
  ],
};

export default chapter;
