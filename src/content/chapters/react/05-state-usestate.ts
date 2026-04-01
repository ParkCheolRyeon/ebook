import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "05-state-usestate",
  subject: "react",
  title: "State와 useState",
  description:
    "상태의 개념, 불변성 원칙, 배치 업데이트, 함수형 업데이트, 객체/배열 상태 업데이트 패턴을 학습합니다.",
  order: 5,
  group: "기초",
  prerequisites: ["04-props"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "State는 **화이트보드**와 같습니다.\n\n" +
        "Props가 외부에서 받는 택배라면, State는 컴포넌트가 자체적으로 관리하는 화이트보드입니다. 화이트보드에 적힌 내용이 바뀌면 React는 자동으로 화면을 다시 그립니다.\n\n" +
        "**불변성**은 화이트보드 규칙입니다. 기존 내용을 지우개로 수정하는 것이 아니라, 새 화이트보드에 수정된 내용을 처음부터 다시 적어야 합니다. 이렇게 해야 React가 '무엇이 바뀌었는지' 비교할 수 있습니다.\n\n" +
        "JS에서 원시값은 불변이고 객체는 참조로 전달된다는 것(JS 복습)을 기억하세요. React에서도 같은 원리입니다. 객체/배열 상태를 업데이트할 때 참조가 바뀌어야 React가 변경을 감지합니다.\n\n" +
        "**배치 업데이트**는 여러 메모를 모아서 한 번에 화이트보드를 업데이트하는 것입니다. 매 메모마다 다시 그리면 비효율적이니까요.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "동적인 UI를 만들려면 시간에 따라 변하는 데이터를 관리해야 합니다.\n\n" +
        "1. **UI와 데이터 동기화** — 데이터가 바뀌면 화면도 자동으로 바뀌어야 합니다. 일반 변수를 바꿔도 React는 다시 렌더링하지 않습니다.\n" +
        "2. **불변성 미준수** — 객체를 직접 수정(mutation)하면 React가 변경을 감지하지 못합니다\n" +
        "3. **상태 업데이트 타이밍** — 여러 setState 호출 사이에서 이전 상태를 기반으로 업데이트해야 하는 경우가 있습니다\n" +
        "4. **불필요한 리렌더링** — 상태를 잘못 구조화하면 관련 없는 컴포넌트까지 다시 렌더링됩니다",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### useState 훅\n" +
        "`useState`는 컴포넌트에 상태를 추가하는 훅입니다. `[현재값, 업데이트함수]` 튜플을 반환합니다.\n\n" +
        "### 불변성 원칙\n" +
        "상태를 직접 수정하지 않고, 항상 **새로운 값/객체/배열**을 만들어 setState에 전달합니다. React는 참조 비교(===)로 변경을 감지하므로, 같은 참조면 '변경 없음'으로 판단합니다.\n\n" +
        "### 배치 업데이트 (React 18+)\n" +
        "React 18부터 모든 상태 업데이트는 자동으로 배치됩니다. 이벤트 핸들러, setTimeout, Promise 등 어디서든 여러 setState 호출이 하나의 리렌더링으로 합쳐집니다.\n\n" +
        "### 함수형 업데이트\n" +
        "이전 상태를 기반으로 업데이트할 때는 `setState(prev => newValue)` 형태를 사용합니다. 배치 내에서 여러 번 업데이트해도 각각 최신 상태를 기반으로 계산됩니다.\n\n" +
        "### 객체/배열 상태 업데이트 패턴\n" +
        "- 객체: 스프레드 연산자 `{ ...prev, key: newValue }`\n" +
        "- 배열 추가: `[...prev, newItem]`\n" +
        "- 배열 제거: `prev.filter(...)`\n" +
        "- 배열 수정: `prev.map(...)`",
    },
    {
      type: "pseudocode",
      title: "기술 구현: useState와 불변 업데이트",
      content:
        "useState의 동작 원리와 불변 업데이트 패턴을 코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          'import { useState } from "react";\n' +
          '\n' +
          '// === useState 기본 ===\n' +
          'function Counter() {\n' +
          '  // [상태값, 업데이트 함수] = useState(초기값)\n' +
          '  const [count, setCount] = useState(0);\n' +
          '\n' +
          '  // ❌ 일반 변수는 리렌더링을 유발하지 않음\n' +
          '  // let count = 0; count++; // 화면 안 바뀜\n' +
          '\n' +
          '  // ✅ 값으로 업데이트\n' +
          '  const reset = () => setCount(0);\n' +
          '\n' +
          '  // ✅ 함수형 업데이트 — 이전 상태 기반\n' +
          '  const increment = () => setCount(prev => prev + 1);\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <p>{count}</p>\n' +
          '      <button onClick={increment}>+1</button>\n' +
          '      <button onClick={reset}>리셋</button>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === 배치 업데이트와 함수형 업데이트 차이 ===\n' +
          'function BatchExample() {\n' +
          '  const [count, setCount] = useState(0);\n' +
          '\n' +
          '  const handleClick = () => {\n' +
          '    // ❌ 값으로 3번 호출 — 결과: 1 (모두 같은 0 기반)\n' +
          '    // setCount(count + 1); // 0 + 1 = 1\n' +
          '    // setCount(count + 1); // 0 + 1 = 1\n' +
          '    // setCount(count + 1); // 0 + 1 = 1\n' +
          '\n' +
          '    // ✅ 함수형으로 3번 호출 — 결과: 3\n' +
          '    setCount(prev => prev + 1); // 0 + 1 = 1\n' +
          '    setCount(prev => prev + 1); // 1 + 1 = 2\n' +
          '    setCount(prev => prev + 1); // 2 + 1 = 3\n' +
          '  };\n' +
          '\n' +
          '  return <button onClick={handleClick}>{count}</button>;\n' +
          '}',
        description:
          "함수형 업데이트는 항상 최신 상태를 기반으로 계산하므로, 배치 내에서 여러 번 업데이트할 때 필수입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 객체/배열 상태 불변 업데이트",
      content:
        "객체와 배열 상태를 불변하게 업데이트하는 패턴을 연습합니다.",
      code: {
        language: "typescript",
        code:
          'import { useState } from "react";\n' +
          '\n' +
          'interface Todo {\n' +
          '  id: number;\n' +
          '  text: string;\n' +
          '  done: boolean;\n' +
          '}\n' +
          '\n' +
          'function TodoApp() {\n' +
          '  const [todos, setTodos] = useState<Todo[]>([]);\n' +
          '  const [nextId, setNextId] = useState(1);\n' +
          '\n' +
          '  // 추가: 새 배열 생성\n' +
          '  const addTodo = (text: string) => {\n' +
          '    setTodos(prev => [...prev, { id: nextId, text, done: false }]);\n' +
          '    setNextId(prev => prev + 1);\n' +
          '  };\n' +
          '\n' +
          '  // 토글: map으로 새 배열 생성\n' +
          '  const toggleTodo = (id: number) => {\n' +
          '    setTodos(prev =>\n' +
          '      prev.map(todo =>\n' +
          '        todo.id === id ? { ...todo, done: !todo.done } : todo\n' +
          '      )\n' +
          '    );\n' +
          '  };\n' +
          '\n' +
          '  // 삭제: filter로 새 배열 생성\n' +
          '  const removeTodo = (id: number) => {\n' +
          '    setTodos(prev => prev.filter(todo => todo.id !== id));\n' +
          '  };\n' +
          '\n' +
          '  // ❌ 잘못된 방법 — 직접 수정 (mutation)\n' +
          '  // const wrongToggle = (id: number) => {\n' +
          '  //   const todo = todos.find(t => t.id === id);\n' +
          '  //   todo!.done = !todo!.done; // 원본 객체 수정\n' +
          '  //   setTodos(todos);           // 같은 참조 → 변경 감지 안됨!\n' +
          '  // };\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <button onClick={() => addTodo("새 할 일")}>추가</button>\n' +
          '      <ul>\n' +
          '        {todos.map(todo => (\n' +
          '          <li key={todo.id}>\n' +
          '            <span\n' +
          '              onClick={() => toggleTodo(todo.id)}\n' +
          '              style={{ textDecoration: todo.done ? "line-through" : "none" }}\n' +
          '            >\n' +
          '              {todo.text}\n' +
          '            </span>\n' +
          '            <button onClick={() => removeTodo(todo.id)}>삭제</button>\n' +
          '          </li>\n' +
          '        ))}\n' +
          '      </ul>\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "배열/객체 상태는 항상 새 참조를 생성하여 업데이트합니다. spread, map, filter를 활용합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| useState | 컴포넌트에 상태를 추가하는 훅 |\n" +
        "| 불변성 | 상태를 직접 수정하지 않고 새 값/객체/배열 생성 |\n" +
        "| 함수형 업데이트 | `setState(prev => ...)` — 이전 상태 기반 안전한 업데이트 |\n" +
        "| 배치 업데이트 | React 18+에서 모든 setState가 자동 배치 |\n" +
        "| 객체 업데이트 | `{ ...prev, key: newValue }` |\n" +
        "| 배열 업데이트 | spread(추가), filter(삭제), map(수정) |\n\n" +
        "**핵심:** 상태를 직접 수정하지 마세요. 항상 새로운 참조를 만들어 setState에 전달하세요. 이전 상태 기반 업데이트는 함수형으로!\n\n" +
        "**다음 챕터 미리보기:** 사용자와의 인터랙션을 처리하는 이벤트 핸들링을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "useState의 반환값과 사용법을 설명할 수 있다",
    "왜 상태를 불변하게 업데이트해야 하는지 설명할 수 있다",
    "함수형 업데이트가 필요한 상황을 판별할 수 있다",
    "객체/배열 상태의 불변 업데이트 패턴을 작성할 수 있다",
    "배치 업데이트의 동작 방식을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "일반 변수 대신 useState를 사용하는 이유는?",
      choices: [
        "일반 변수는 사용할 수 없어서",
        "useState가 변경 시 리렌더링을 유발하므로",
        "성능이 더 좋아서",
        "TypeScript와 호환되어서",
      ],
      correctIndex: 1,
      explanation:
        "일반 변수를 변경해도 React는 리렌더링하지 않습니다. useState의 setter를 호출해야 React가 상태 변경을 감지하고 UI를 업데이트합니다.",
    },
    {
      id: "q2",
      question: "setCount(count + 1)을 연속 3번 호출하면 count는 얼마나 증가하는가? (초기값 0)",
      choices: ["3", "1", "0", "에러 발생"],
      correctIndex: 1,
      explanation:
        "값으로 업데이트하면 모두 같은 렌더링의 count(0)를 기반으로 계산합니다. 0+1=1이 3번 실행되어 최종값은 1입니다. 함수형 업데이트를 사용해야 3이 됩니다.",
    },
    {
      id: "q3",
      question: "객체 상태 { name: 'A', age: 20 }에서 name만 변경하는 올바른 방법은?",
      choices: [
        "state.name = 'B'",
        "setState({ name: 'B' })",
        "setState({ ...state, name: 'B' })",
        "setState(prev => { prev.name = 'B'; return prev; })",
      ],
      correctIndex: 2,
      explanation:
        "스프레드 연산자로 기존 속성을 복사하고 변경할 속성만 덮어씁니다. 직접 수정(mutation)이나 일부 속성만 전달하면 의도대로 동작하지 않습니다.",
    },
    {
      id: "q4",
      question: "React 18+의 배치 업데이트에 대한 설명으로 올바른 것은?",
      choices: [
        "이벤트 핸들러 내에서만 배치가 적용된다",
        "setTimeout 안에서는 배치가 적용되지 않는다",
        "모든 컨텍스트에서 자동으로 배치가 적용된다",
        "배치를 수동으로 활성화해야 한다",
      ],
      correctIndex: 2,
      explanation:
        "React 18부터 이벤트 핸들러, setTimeout, Promise 등 모든 컨텍스트에서 상태 업데이트가 자동으로 배치됩니다.",
    },
    {
      id: "q5",
      question: "배열에서 특정 항목을 삭제하는 불변 업데이트 패턴은?",
      choices: [
        "array.splice(index, 1)",
        "array.filter(item => item.id !== targetId)",
        "delete array[index]",
        "array.pop()",
      ],
      correctIndex: 1,
      explanation:
        "filter는 조건에 맞는 요소만 포함하는 새 배열을 반환합니다. splice, delete, pop은 원본 배열을 직접 수정(mutation)하므로 불변 업데이트가 아닙니다.",
    },
    {
      id: "q6",
      question: "useState의 초기값으로 비용이 큰 연산을 전달할 때 올바른 방법은?",
      choices: [
        "useState(heavyComputation())",
        "useState(() => heavyComputation())",
        "useEffect로 초기화",
        "useMemo로 초기화",
      ],
      correctIndex: 1,
      explanation:
        "초기화 함수를 전달하면 첫 렌더링에서만 실행됩니다. 값을 직접 전달하면 매 렌더링마다 heavyComputation()이 호출됩니다(결과는 무시되지만 연산 비용이 발생).",
    },
  ],
};

export default chapter;
