import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "08-forms-actions",
  subject: "react",
  title: "폼과 Actions",
  description:
    "제어/비제어 컴포넌트, React 19 <form action>, useActionState, useFormStatus, 프로그레시브 인핸스먼트를 학습합니다.",
  order: 8,
  group: "기초",
  prerequisites: ["07-conditional-rendering-lists"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "폼 처리는 **주문서 작성**과 같습니다.\n\n" +
        "**제어 컴포넌트**는 비서가 옆에서 한 글자 한 글자 타이핑을 지켜보며 기록하는 방식입니다. 모든 입력을 실시간으로 관리하므로 유효성 검사나 조건부 UI가 쉽지만, 보일러플레이트가 많습니다.\n\n" +
        "**비제어 컴포넌트**는 주문서를 작성자에게 맡기고, 제출할 때 한 번에 읽는 방식입니다. React가 중간 과정을 관여하지 않으므로 간단하지만, 실시간 제어가 어렵습니다.\n\n" +
        "**React 19 Actions**는 '주문 접수 자동화 시스템'입니다. `<form action={함수}>`로 폼을 제출하면, React가 로딩 상태, 에러 처리, 낙관적 업데이트까지 자동으로 관리해줍니다. 마치 주문서를 넣으면 자동으로 처리 상태를 추적하는 기계와 같습니다.\n\n" +
        "JS에서 async/await(JS 복습)로 비동기 처리를 배웠습니다. React 19 Actions는 이를 폼과 통합하여, 서버 통신의 전체 생명주기를 선언적으로 관리합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React에서 폼을 다루는 것은 전통적으로 번거로운 작업이었습니다.\n\n" +
        "1. **보일러플레이트** — 제어 컴포넌트는 모든 input에 state + onChange 핸들러가 필요합니다\n" +
        "2. **비동기 상태 관리** — 제출 중(pending), 성공, 에러 상태를 수동으로 관리해야 합니다\n" +
        "3. **프로그레시브 인핸스먼트** — JS가 로드되기 전에도 폼이 동작해야 하는 경우가 있습니다\n" +
        "4. **서버/클라이언트 통합** — 폼 제출 로직이 서버와 클라이언트에서 일관되게 동작해야 합니다\n" +
        "5. **에러 처리 패턴** — 에러를 사용자에게 보여주고, 이전 입력값을 유지하는 것이 복잡합니다",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 제어 컴포넌트 vs 비제어 컴포넌트\n" +
        "**제어 컴포넌트**: state로 값을 관리하고 onChange로 업데이트. 실시간 유효성 검사에 적합.\n" +
        "**비제어 컴포넌트**: ref 또는 FormData로 제출 시 값을 읽음. 간단한 폼에 적합.\n\n" +
        "### React 19: `<form action>`\n" +
        "form 태그의 action에 함수를 전달하면 React가 폼 제출을 처리합니다. FormData를 인자로 받는 async 함수를 사용할 수 있습니다.\n\n" +
        "### useActionState (React 19)\n" +
        "비동기 action의 상태(결과, pending)를 관리하는 훅입니다. 이전의 실험적 `useFormState`를 대체합니다.\n" +
        "`const [state, formAction, isPending] = useActionState(action, initialState)`\n\n" +
        "### useFormStatus (React 19)\n" +
        "폼 제출 중인지 여부를 자식 컴포넌트에서 읽는 훅입니다. 반드시 `<form>` 내부의 컴포넌트에서 호출해야 합니다.\n\n" +
        "### 프로그레시브 인핸스먼트\n" +
        "React 19의 `<form action>`은 서버 컴포넌트와 함께 사용하면, JS가 로드되기 전에도 HTML 폼으로 동작합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 제어/비제어 컴포넌트와 Actions",
      content:
        "전통적인 제어 컴포넌트와 React 19의 새로운 Actions 패턴을 비교합니다.",
      code: {
        language: "typescript",
        code:
          'import { useState, useActionState } from "react";\n' +
          '\n' +
          '// === 제어 컴포넌트 (전통적 방식) ===\n' +
          'function ControlledForm() {\n' +
          '  const [email, setEmail] = useState("");\n' +
          '  const [password, setPassword] = useState("");\n' +
          '  const [isSubmitting, setIsSubmitting] = useState(false);\n' +
          '  const [error, setError] = useState<string | null>(null);\n' +
          '\n' +
          '  const handleSubmit = async (e: React.FormEvent) => {\n' +
          '    e.preventDefault();\n' +
          '    setIsSubmitting(true);\n' +
          '    setError(null);\n' +
          '    try {\n' +
          '      await login(email, password);\n' +
          '    } catch (err) {\n' +
          '      setError("로그인 실패");\n' +
          '    } finally {\n' +
          '      setIsSubmitting(false);\n' +
          '    }\n' +
          '  };\n' +
          '\n' +
          '  return (\n' +
          '    <form onSubmit={handleSubmit}>\n' +
          '      <input value={email} onChange={e => setEmail(e.target.value)} />\n' +
          '      <input value={password} onChange={e => setPassword(e.target.value)} type="password" />\n' +
          '      {error && <p>{error}</p>}\n' +
          '      <button disabled={isSubmitting}>\n' +
          '        {isSubmitting ? "로그인 중..." : "로그인"}\n' +
          '      </button>\n' +
          '    </form>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === React 19: useActionState ===\n' +
          'interface FormState {\n' +
          '  error: string | null;\n' +
          '  success: boolean;\n' +
          '}\n' +
          '\n' +
          'async function loginAction(\n' +
          '  prevState: FormState,\n' +
          '  formData: FormData\n' +
          '): Promise<FormState> {\n' +
          '  const email = formData.get("email") as string;\n' +
          '  const password = formData.get("password") as string;\n' +
          '\n' +
          '  try {\n' +
          '    await login(email, password);\n' +
          '    return { error: null, success: true };\n' +
          '  } catch {\n' +
          '    return { error: "로그인 실패", success: false };\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          'function ActionForm() {\n' +
          '  const [state, formAction, isPending] = useActionState(\n' +
          '    loginAction,\n' +
          '    { error: null, success: false }\n' +
          '  );\n' +
          '\n' +
          '  return (\n' +
          '    <form action={formAction}>\n' +
          '      <input name="email" type="email" />\n' +
          '      <input name="password" type="password" />\n' +
          '      {state.error && <p>{state.error}</p>}\n' +
          '      <button disabled={isPending}>\n' +
          '        {isPending ? "로그인 중..." : "로그인"}\n' +
          '      </button>\n' +
          '    </form>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'declare function login(email: string, password: string): Promise<void>;',
        description:
          "React 19의 useActionState는 비동기 상태 관리를 크게 단순화합니다. 보일러플레이트가 줄고, pending/error 처리가 자동화됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: useFormStatus와 종합 폼 패턴",
      content:
        "useFormStatus로 제출 상태를 표시하고, React 19의 폼 패턴을 종합적으로 연습합니다.",
      code: {
        language: "typescript",
        code:
          'import { useActionState } from "react";\n' +
          'import { useFormStatus } from "react-dom";\n' +
          '\n' +
          '// === useFormStatus — form 내부 컴포넌트에서 사용 ===\n' +
          'function SubmitButton({ label }: { label: string }) {\n' +
          '  // 반드시 <form> 내부의 컴포넌트에서 호출\n' +
          '  const { pending } = useFormStatus();\n' +
          '\n' +
          '  return (\n' +
          '    <button type="submit" disabled={pending}>\n' +
          '      {pending ? "처리 중..." : label}\n' +
          '    </button>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === 할 일 추가 폼 — Actions 활용 ===\n' +
          'interface TodoFormState {\n' +
          '  error: string | null;\n' +
          '  todos: { id: string; text: string }[];\n' +
          '}\n' +
          '\n' +
          'async function addTodoAction(\n' +
          '  prevState: TodoFormState,\n' +
          '  formData: FormData\n' +
          '): Promise<TodoFormState> {\n' +
          '  const text = formData.get("todo") as string;\n' +
          '\n' +
          '  if (!text.trim()) {\n' +
          '    return { ...prevState, error: "할 일을 입력하세요" };\n' +
          '  }\n' +
          '\n' +
          '  // 서버에 저장하는 비동기 작업 시뮬레이션\n' +
          '  await new Promise(resolve => setTimeout(resolve, 500));\n' +
          '\n' +
          '  return {\n' +
          '    error: null,\n' +
          '    todos: [\n' +
          '      ...prevState.todos,\n' +
          '      { id: crypto.randomUUID(), text },\n' +
          '    ],\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          'function TodoForm() {\n' +
          '  const [state, formAction, isPending] = useActionState(\n' +
          '    addTodoAction,\n' +
          '    { error: null, todos: [] }\n' +
          '  );\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <form action={formAction}>\n' +
          '        <input name="todo" placeholder="할 일 입력" disabled={isPending} />\n' +
          '        <SubmitButton label="추가" />\n' +
          '        {state.error && <p>{state.error}</p>}\n' +
          '      </form>\n' +
          '\n' +
          '      <ul>\n' +
          '        {state.todos.map(todo => (\n' +
          '          <li key={todo.id}>{todo.text}</li>\n' +
          '        ))}\n' +
          '      </ul>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === 비제어 + ref 패턴 (간단한 경우) ===\n' +
          'function SimpleSearch({ onSearch }: { onSearch: (q: string) => void }) {\n' +
          '  // React 19: ref를 prop으로 직접 전달 가능\n' +
          '  return (\n' +
          '    <form action={(formData) => {\n' +
          '      onSearch(formData.get("query") as string);\n' +
          '    }}>\n' +
          '      <input name="query" />\n' +
          '      <button type="submit">검색</button>\n' +
          '    </form>\n' +
          '  );\n' +
          '}',
        description:
          "useFormStatus는 form 내부에서 pending 상태를 읽고, useActionState는 전체 비동기 흐름을 관리합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| 제어 컴포넌트 | state + onChange로 실시간 입력 관리 |\n" +
        "| 비제어 컴포넌트 | ref/FormData로 제출 시 값 읽기 |\n" +
        "| `<form action>` | React 19 — 함수를 action으로 전달 |\n" +
        "| useActionState | 비동기 action의 state + pending 관리 |\n" +
        "| useFormStatus | form 내부에서 제출 상태(pending) 읽기 |\n" +
        "| 프로그레시브 인핸스먼트 | JS 없이도 HTML 폼으로 동작 가능 |\n\n" +
        "**핵심:** React 19의 Actions 패턴은 폼의 비동기 상태 관리를 크게 단순화합니다. 간단한 폼은 `<form action>`, 복잡한 상태 관리는 `useActionState`를 사용하세요.\n\n" +
        "**다음 그룹 미리보기:** 다음 그룹에서는 useEffect, 커스텀 훅, Context 등 React의 심화 기능을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "제어 컴포넌트는 input의 값을 state로 관리하여 React가 단일 진실의 원천이 된다. React 19의 form actions는 폼 제출을 더 선언적으로 처리한다.",
  checklist: [
    "제어 컴포넌트와 비제어 컴포넌트의 차이를 설명할 수 있다",
    "React 19의 <form action> 패턴을 사용할 수 있다",
    "useActionState의 시그니처와 용도를 설명할 수 있다",
    "useFormStatus가 form 내부에서만 동작하는 이유를 이해한다",
    "프로그레시브 인핸스먼트의 개념을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "제어 컴포넌트(Controlled Component)의 특징은?",
      choices: [
        "ref로 DOM 요소에 직접 접근한다",
        "React state가 입력값의 단일 진실 공급원(source of truth)이다",
        "FormData로 값을 읽는다",
        "onChange 핸들러가 필요 없다",
      ],
      correctIndex: 1,
      explanation:
        "제어 컴포넌트는 state로 입력값을 관리하고, onChange로 state를 업데이트합니다. state가 입력값의 단일 진실 공급원입니다.",
    },
    {
      id: "q2",
      question: "React 19의 useActionState가 반환하는 값은?",
      choices: [
        "[state, dispatch]",
        "[state, formAction, isPending]",
        "[isPending, startTransition]",
        "[formData, submit]",
      ],
      correctIndex: 1,
      explanation:
        "useActionState는 [현재 상태, form에 전달할 action, 비동기 작업 진행 중 여부]를 반환합니다.",
    },
    {
      id: "q3",
      question: "useFormStatus를 사용할 수 있는 위치는?",
      choices: [
        "어느 컴포넌트에서든 사용 가능",
        "form 태그 자체에서 사용",
        "form 태그 내부의 자식 컴포넌트에서만 사용",
        "form 외부에서만 사용",
      ],
      correctIndex: 2,
      explanation:
        "useFormStatus는 가장 가까운 부모 <form>의 제출 상태를 읽습니다. 반드시 form 내부의 별도 컴포넌트에서 호출해야 합니다.",
    },
    {
      id: "q4",
      question: "React 19에서 <form action={fn}>의 fn이 받는 인자는?",
      choices: [
        "React.FormEvent",
        "FormData",
        "Event",
        "HTMLFormElement",
      ],
      correctIndex: 1,
      explanation:
        "<form action>에 전달된 함수는 FormData 객체를 인자로 받습니다. e.preventDefault()를 호출할 필요 없이 React가 자동으로 처리합니다.",
    },
    {
      id: "q5",
      question: "프로그레시브 인핸스먼트(Progressive Enhancement)의 의미는?",
      choices: [
        "JS가 로드되기 전에도 기본 기능이 동작하고, JS 로드 후 향상된다",
        "점진적으로 성능이 향상된다",
        "사용자 경험이 점차 개선된다",
        "번들 크기가 점차 줄어든다",
      ],
      correctIndex: 0,
      explanation:
        "프로그레시브 인핸스먼트는 기본 HTML이 먼저 동작하고, JS가 로드되면 더 풍부한 인터랙션이 추가되는 전략입니다. React 19의 form action은 이를 지원합니다.",
    },
    {
      id: "q6",
      question: "간단한 검색 폼에 가장 적합한 패턴은?",
      choices: [
        "제어 컴포넌트 + useState",
        "비제어 컴포넌트 + <form action>",
        "useReducer + Context",
        "외부 상태 관리 라이브러리",
      ],
      correctIndex: 1,
      explanation:
        "간단한 폼은 비제어 방식이 보일러플레이트가 적습니다. React 19의 <form action>과 FormData를 사용하면 state 없이도 깔끔하게 처리할 수 있습니다.",
    },
    {
      id: "q7",
      question: "useActionState의 action 함수 시그니처는?",
      choices: [
        "(formData: FormData) => Promise<State>",
        "(prevState: State, formData: FormData) => Promise<State>",
        "(event: FormEvent) => void",
        "(state: State) => State",
      ],
      correctIndex: 1,
      explanation:
        "useActionState의 action은 이전 상태와 FormData를 받아 새 상태를 반환하는 비동기 함수입니다. useReducer의 reducer와 유사한 패턴입니다.",
    },
  ],
};

export default chapter;
