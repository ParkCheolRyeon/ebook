import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "29-react-event-types",
  subject: "typescript",
  title: "이벤트와 Ref 타이핑",
  description:
    "React 이벤트 타입(ChangeEvent, FormEvent 등)과 forwardRef, useImperativeHandle의 타이핑 패턴을 학습합니다.",
  order: 29,
  group: "React + TypeScript",
  prerequisites: ["28-react-hooks-types"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "React 이벤트 타이핑은 **택배 송장**과 같습니다.\n\n" +
        "택배가 도착하면 송장에 보낸 사람, 내용물, 배송 정보가 적혀 있습니다. React 이벤트도 마찬가지입니다. 클릭 이벤트(MouseEvent)에는 '어디를 클릭했는지(clientX, clientY)', 폼 이벤트(FormEvent)에는 '어떤 폼에서 발생했는지', 변경 이벤트(ChangeEvent)에는 '변경된 값(target.value)'이 담겨 있습니다.\n\n" +
        "중요한 것은 **어떤 요소에서 발생한 이벤트인지**를 명시하는 것입니다. `ChangeEvent<HTMLInputElement>`는 'input 요소에서 발생한 변경 이벤트'라는 송장이고, `ChangeEvent<HTMLSelectElement>`는 'select 요소에서 발생한 변경 이벤트'라는 송장입니다. 요소 타입에 따라 `target`의 속성이 달라집니다.\n\n" +
        "`forwardRef`는 **우편 전달**과 같습니다. 부모가 자식에게 보낸 '편지(ref)'를 자식이 받아서 특정 DOM 요소에 전달합니다. `useImperativeHandle`은 자식이 부모에게 '이 기능만 사용하세요'라고 제한된 API를 노출하는 것과 같습니다. 부모가 자식의 내부를 마음대로 조작하지 못하게 하는 캡슐화입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React에서 이벤트와 ref를 타이핑할 때 흔히 마주치는 문제들입니다.\n\n" +
        "**1. 이벤트 타입을 모르겠다**\n" +
        "onChange, onClick, onSubmit 등 각 이벤트 핸들러에 어떤 이벤트 타입을 써야 하는지 매번 헷갈립니다. `React.ChangeEvent`인지 `React.FormEvent`인지, 제네릭에 `HTMLInputElement`인지 `HTMLFormElement`인지 고민하게 됩니다.\n\n" +
        "**2. event.target vs event.currentTarget**\n" +
        "`event.target`은 `EventTarget` 타입이라 `.value`에 접근하려면 타입 단언이 필요합니다. `event.currentTarget`은 제네릭에 명시한 요소 타입으로 추론되지만, 이 차이를 모르면 불필요한 타입 단언을 남발하게 됩니다.\n\n" +
        "**3. forwardRef 타이핑의 복잡성**\n" +
        "forwardRef는 ref 타입과 props 타입, 두 개의 제네릭을 받습니다. 순서가 `forwardRef<Ref, Props>`인데, props가 두 번째라 직관적이지 않습니다.\n\n" +
        "**4. useImperativeHandle의 타입 정의**\n" +
        "부모에게 노출할 메서드의 타입을 어떻게 정의하고, ref 타입과 어떻게 연결하는지 혼란스럽습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "React 이벤트 타입 체계를 이해하면, 올바른 타입을 빠르게 선택할 수 있습니다.\n\n" +
        "### 이벤트 타입 매핑표\n" +
        "| 핸들러 | 이벤트 타입 | 대상 요소 예시 |\n" +
        "|--------|-----------|-------------|\n" +
        "| onChange | ChangeEvent<T> | HTMLInputElement |\n" +
        "| onSubmit | FormEvent<T> | HTMLFormElement |\n" +
        "| onClick | MouseEvent<T> | HTMLButtonElement |\n" +
        "| onKeyDown | KeyboardEvent<T> | HTMLInputElement |\n" +
        "| onFocus | FocusEvent<T> | HTMLInputElement |\n" +
        "| onDrag | DragEvent<T> | HTMLDivElement |\n\n" +
        "### target vs currentTarget\n" +
        "- `event.target`: 이벤트가 실제 발생한 요소. `EventTarget` 타입이라 속성 접근 시 타입 단언 필요.\n" +
        "- `event.currentTarget`: 이벤트 핸들러가 붙은 요소. 제네릭 T로 타이핑되어 속성에 바로 접근 가능.\n\n" +
        "### forwardRef 패턴\n" +
        "React 19에서는 `forwardRef` 없이 props로 직접 ref를 전달할 수 있습니다. 하지만 React 18 이하에서는 `forwardRef<RefType, PropsType>`을 사용해야 합니다. 반환 타입은 `ForwardRefRenderFunction`입니다.\n\n" +
        "### useImperativeHandle 패턴\n" +
        "노출할 메서드를 interface로 정의하고, forwardRef의 ref 타입으로 사용합니다. 부모는 이 interface에 정의된 메서드만 호출할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 이벤트 타이핑 패턴",
      content:
        "가장 자주 사용하는 이벤트 타이핑 패턴과 target/currentTarget의 차이를 코드로 살펴봅시다. 인라인 핸들러와 별도 함수 핸들러 각각의 타이핑 방법을 확인합니다.",
      code: {
        language: "typescript",
        code:
          "import type { ChangeEvent, FormEvent, MouseEvent, KeyboardEvent } from 'react';\n" +
          "import { useState } from 'react';\n" +
          "\n" +
          "// ===== 이벤트 핸들러 타이핑 =====\n" +
          "function LoginForm() {\n" +
          "  const [email, setEmail] = useState('');\n" +
          "  const [password, setPassword] = useState('');\n" +
          "\n" +
          "  // ChangeEvent: input 값 변경\n" +
          "  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {\n" +
          "    setEmail(e.currentTarget.value); // ✅ 타입 안전\n" +
          "    // e.currentTarget은 HTMLInputElement로 추론\n" +
          "  };\n" +
          "\n" +
          "  // FormEvent: 폼 제출\n" +
          "  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {\n" +
          "    e.preventDefault();\n" +
          "    console.log('Submit:', email, password);\n" +
          "  };\n" +
          "\n" +
          "  // MouseEvent: 클릭\n" +
          "  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {\n" +
          "    console.log('Clicked at:', e.clientX, e.clientY);\n" +
          "  };\n" +
          "\n" +
          "  // KeyboardEvent: 키 입력\n" +
          "  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {\n" +
          "    if (e.key === 'Enter') {\n" +
          "      console.log('Enter pressed');\n" +
          "    }\n" +
          "  };\n" +
          "\n" +
          "  return (\n" +
          "    <form onSubmit={handleSubmit}>\n" +
          "      <input\n" +
          "        type=\"email\"\n" +
          "        value={email}\n" +
          "        onChange={handleEmailChange}\n" +
          "        onKeyDown={handleKeyDown}\n" +
          "      />\n" +
          "      <input\n" +
          "        type=\"password\"\n" +
          "        value={password}\n" +
          "        // 인라인: 타입 자동 추론\n" +
          "        onChange={(e) => setPassword(e.currentTarget.value)}\n" +
          "      />\n" +
          "      <button type=\"submit\" onClick={handleClick}>\n" +
          "        로그인\n" +
          "      </button>\n" +
          "    </form>\n" +
          "  );\n" +
          "}\n" +
          "\n" +
          "// ===== 이벤트 핸들러 타입 (props로 전달 시) =====\n" +
          "import type { EventHandler, ChangeEventHandler } from 'react';\n" +
          "\n" +
          "interface SearchInputProps {\n" +
          "  value: string;\n" +
          "  onChange: ChangeEventHandler<HTMLInputElement>;\n" +
          "  // 또는: onChange: (e: ChangeEvent<HTMLInputElement>) => void;\n" +
          "}\n" +
          "\n" +
          "// ===== select 요소 이벤트 =====\n" +
          "const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {\n" +
          "  const selectedValue = e.currentTarget.value; // string\n" +
          "  const selectedIndex = e.currentTarget.selectedIndex; // number\n" +
          "};",
        description:
          "이벤트 핸들러를 별도 함수로 정의할 때는 이벤트 타입을 명시하고, 인라인 핸들러에서는 자동 추론됩니다. currentTarget으로 타입 안전하게 요소 속성에 접근합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: forwardRef와 useImperativeHandle",
      content:
        "forwardRef로 ref를 전달하고, useImperativeHandle로 부모에게 제한된 API를 노출하는 패턴을 구현합니다. React 19의 ref as prop 패턴도 함께 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          "import {\n" +
          "  forwardRef, useRef, useImperativeHandle,\n" +
          "  type ForwardedRef\n" +
          "} from 'react';\n" +
          "\n" +
          "// ===== 기본 forwardRef =====\n" +
          "interface InputProps {\n" +
          "  label: string;\n" +
          "  value: string;\n" +
          "  onChange: (value: string) => void;\n" +
          "}\n" +
          "\n" +
          "const TextInput = forwardRef<HTMLInputElement, InputProps>(\n" +
          "  ({ label, value, onChange }, ref) => {\n" +
          "    return (\n" +
          "      <label>\n" +
          "        {label}\n" +
          "        <input\n" +
          "          ref={ref}\n" +
          "          value={value}\n" +
          "          onChange={(e) => onChange(e.currentTarget.value)}\n" +
          "        />\n" +
          "      </label>\n" +
          "    );\n" +
          "  }\n" +
          ");\n" +
          "\n" +
          "// 부모에서 사용\n" +
          "function Parent() {\n" +
          "  const inputRef = useRef<HTMLInputElement>(null);\n" +
          "  const handleFocus = () => inputRef.current?.focus();\n" +
          "  return <TextInput ref={inputRef} label=\"이름\" value=\"\" onChange={() => {}} />;\n" +
          "}\n" +
          "\n" +
          "// ===== useImperativeHandle: 제한된 API 노출 =====\n" +
          "interface ModalHandle {\n" +
          "  open: () => void;\n" +
          "  close: () => void;\n" +
          "  toggle: () => void;\n" +
          "}\n" +
          "\n" +
          "interface ModalProps {\n" +
          "  title: string;\n" +
          "  children: React.ReactNode;\n" +
          "}\n" +
          "\n" +
          "const Modal = forwardRef<ModalHandle, ModalProps>(\n" +
          "  ({ title, children }, ref) => {\n" +
          "    const [isOpen, setIsOpen] = useState(false);\n" +
          "\n" +
          "    useImperativeHandle(ref, () => ({\n" +
          "      open: () => setIsOpen(true),\n" +
          "      close: () => setIsOpen(false),\n" +
          "      toggle: () => setIsOpen((prev) => !prev),\n" +
          "    }));\n" +
          "\n" +
          "    if (!isOpen) return null;\n" +
          "    return (\n" +
          "      <div className=\"modal\">\n" +
          "        <h2>{title}</h2>\n" +
          "        {children}\n" +
          "      </div>\n" +
          "    );\n" +
          "  }\n" +
          ");\n" +
          "\n" +
          "// 부모에서 사용: ModalHandle의 메서드만 사용 가능\n" +
          "function App() {\n" +
          "  const modalRef = useRef<ModalHandle>(null);\n" +
          "\n" +
          "  return (\n" +
          "    <div>\n" +
          "      <button onClick={() => modalRef.current?.open()}>열기</button>\n" +
          "      <button onClick={() => modalRef.current?.close()}>닫기</button>\n" +
          "      <Modal ref={modalRef} title=\"알림\">\n" +
          "        <p>모달 내용입니다.</p>\n" +
          "      </Modal>\n" +
          "    </div>\n" +
          "  );\n" +
          "}\n" +
          "\n" +
          "// ===== Ref 콜백 패턴 =====\n" +
          "function MeasuredBox() {\n" +
          "  const [height, setHeight] = useState(0);\n" +
          "\n" +
          "  const measuredRef = (node: HTMLDivElement | null) => {\n" +
          "    if (node !== null) {\n" +
          "      setHeight(node.getBoundingClientRect().height);\n" +
          "    }\n" +
          "  };\n" +
          "\n" +
          "  return (\n" +
          "    <div ref={measuredRef}>\n" +
          "      높이: {height}px\n" +
          "    </div>\n" +
          "  );\n" +
          "}",
        description:
          "forwardRef<RefType, PropsType>로 ref를 전달하고, useImperativeHandle로 부모에 노출할 API를 정의합니다. ref 콜백 패턴은 함수 타입으로 직접 타이핑합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 타입 | 사용 시점 |\n" +
        "|------|------|----------|\n" +
        "| ChangeEvent<T> | 값 변경 이벤트 | input, select, textarea |\n" +
        "| FormEvent<T> | 폼 이벤트 | form onSubmit |\n" +
        "| MouseEvent<T> | 마우스 이벤트 | onClick, onMouseEnter |\n" +
        "| KeyboardEvent<T> | 키보드 이벤트 | onKeyDown, onKeyUp |\n" +
        "| forwardRef<Ref, Props> | ref 전달 | 자식 DOM 접근 |\n" +
        "| useImperativeHandle | API 노출 | 부모에게 메서드 제공 |\n\n" +
        "**핵심:** React 이벤트는 `React.ChangeEvent<HTMLInputElement>`처럼 제네릭으로 요소 타입을 지정합니다. `currentTarget`은 핸들러가 붙은 요소로 타입이 좁혀지고, `target`은 EventTarget이라 타입 단언이 필요합니다. forwardRef는 제네릭으로 ref 타입과 props 타입을 모두 명시해야 합니다.\n\n" +
        "**다음 챕터 미리보기:** 제네릭 컴포넌트와 고급 패턴을 학습합니다. Polymorphic component, render props, HOC 타이핑, discriminated union props 등 실무 고급 패턴을 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "React 이벤트는 React.ChangeEvent<HTMLInputElement>처럼 제네릭으로 요소 타입을 지정한다. forwardRef는 제네릭으로 ref 타입과 props 타입을 모두 명시해야 한다.",
  checklist: [
    "주요 React 이벤트 타입(ChangeEvent, FormEvent, MouseEvent)을 구분할 수 있다",
    "event.target과 event.currentTarget의 타입 차이를 이해한다",
    "forwardRef의 제네릭 순서(Ref, Props)를 알고 있다",
    "useImperativeHandle로 부모에게 API를 노출하는 패턴을 구현할 수 있다",
    "ref 콜백 패턴을 타입 안전하게 작성할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "input 요소의 onChange 이벤트에 적합한 타입은?",
      choices: [
        "React.FormEvent<HTMLInputElement>",
        "React.ChangeEvent<HTMLInputElement>",
        "React.InputEvent<HTMLInputElement>",
        "React.MouseEvent<HTMLInputElement>",
      ],
      correctIndex: 1,
      explanation:
        "input의 onChange에는 React.ChangeEvent<HTMLInputElement>를 사용합니다. ChangeEvent의 currentTarget은 HTMLInputElement로 추론되어 .value에 타입 안전하게 접근할 수 있습니다.",
    },
    {
      id: "q2",
      question: "event.currentTarget과 event.target의 차이는?",
      choices: [
        "차이가 없다, 동일하다",
        "currentTarget은 핸들러가 붙은 요소, target은 이벤트가 발생한 실제 요소",
        "target은 핸들러가 붙은 요소, currentTarget은 이벤트가 발생한 실제 요소",
        "currentTarget은 React 전용, target은 DOM 전용",
      ],
      correctIndex: 1,
      explanation:
        "currentTarget은 이벤트 핸들러가 등록된 요소로, 제네릭 T 타입으로 추론됩니다. target은 이벤트가 실제 발생한 요소(버블링으로 전파될 수 있음)로, EventTarget 타입입니다.",
    },
    {
      id: "q3",
      question: "forwardRef의 제네릭 순서는?",
      choices: [
        "forwardRef<Props, Ref>",
        "forwardRef<Ref, Props>",
        "forwardRef<Component, Ref>",
        "forwardRef<Ref>만 필요",
      ],
      correctIndex: 1,
      explanation:
        "forwardRef<RefType, PropsType>로, 첫 번째가 ref 타입, 두 번째가 props 타입입니다. 예: forwardRef<HTMLInputElement, InputProps>.",
    },
    {
      id: "q4",
      question: "useImperativeHandle의 주요 목적은?",
      choices: [
        "DOM 요소에 직접 접근하기 위해",
        "부모에게 자식의 모든 내부 상태를 노출하기 위해",
        "부모에게 제한된 API만 노출하여 캡슐화하기 위해",
        "성능 최적화를 위해",
      ],
      correctIndex: 2,
      explanation:
        "useImperativeHandle은 부모에게 노출할 메서드를 명시적으로 정의합니다. 자식의 내부 구현은 숨기고, 필요한 API(open, close 등)만 제공하여 캡슐화를 유지합니다.",
    },
    {
      id: "q5",
      question: "ref 콜백 패턴의 매개변수 타입은?",
      choices: [
        "HTMLElement",
        "HTMLDivElement | null",
        "RefObject<HTMLDivElement>",
        "MutableRefObject<HTMLDivElement>",
      ],
      correctIndex: 1,
      explanation:
        "ref 콜백은 (node: HTMLDivElement | null) => void 형태입니다. 요소가 마운트되면 DOM 노드가, 언마운트되면 null이 전달됩니다.",
    },
  ],
};

export default chapter;
