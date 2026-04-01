import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "10-useref",
  subject: "react",
  title: "useRef: DOM 참조와 값 저장",
  description: "useRef로 DOM에 접근하고, 렌더링을 유발하지 않는 값을 저장하며, React 19의 ref prop 전달과 ref 콜백 클린업을 배웁니다.",
  order: 10,
  group: "Hooks 심화",
  prerequisites: ["09-useeffect"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "useRef는 **메모장**과 같습니다.\n\n" +
        "컴포넌트가 다시 그려질 때(리렌더링) 대부분의 변수는 초기화됩니다. 마치 칠판을 지우고 다시 쓰는 것처럼요.\n\n" +
        "하지만 useRef는 **서랍 속 메모장**입니다. 칠판을 아무리 지워도 서랍 속 메모장은 그대로 남아 있습니다. 게다가 메모장에 뭔가를 적어도 칠판을 다시 지울 필요가 없습니다(리렌더링을 유발하지 않음).\n\n" +
        "**DOM ref**는 교실의 특정 자리에 **이름표**를 붙이는 것과 같습니다. '3번째 줄 2번째 자리'라고 설명하는 대신, '홍길동의 자리'라는 이름표로 바로 찾아갈 수 있습니다.\n\n" +
        "React 19에서는 ref를 일반 prop처럼 전달할 수 있게 되었습니다. 마치 이름표를 교실 밖에서도 붙일 수 있게 된 것입니다. 더 이상 특별한 절차(forwardRef)가 필요하지 않습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React 컴포넌트에서 다음과 같은 상황에 직면합니다:\n\n" +
        "1. **DOM 직접 접근** — input에 포커스, 스크롤 위치 제어, 캔버스 API 사용\n" +
        "2. **렌더링 불필요한 값 저장** — 타이머 ID, 이전 값, 누적 카운트\n" +
        "3. **자식 컴포넌트의 DOM 접근** — 부모가 자식의 input에 포커스 설정\n\n" +
        "useState를 사용하면 값 변경 시마다 불필요한 리렌더링이 발생합니다. 일반 변수를 사용하면 렌더링마다 초기화됩니다.\n\n" +
        "과거에는 자식 컴포넌트에 ref를 전달하려면 **forwardRef**라는 래퍼가 필요했습니다. 이는 코드를 복잡하게 만들고, TypeScript 타이핑도 번거로웠습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### useRef 기본\n" +
        "`useRef(initialValue)`는 `{ current: initialValue }` 객체를 반환합니다. 이 객체는 컴포넌트의 전체 생명주기 동안 유지되며, `.current`를 변경해도 리렌더링이 발생하지 않습니다.\n\n" +
        "### DOM 참조\n" +
        "JSX 요소에 `ref` 속성을 전달하면, React가 해당 DOM 노드를 `.current`에 할당합니다.\n\n" +
        "### React 19: ref를 prop으로 전달\n" +
        "React 19부터 함수 컴포넌트에서 `ref`를 일반 prop으로 받을 수 있습니다. `forwardRef` 래퍼가 더 이상 필요하지 않습니다.\n\n" +
        "### React 19: ref 콜백 클린업\n" +
        "ref 콜백에서 **클린업 함수를 반환**할 수 있습니다. 요소가 DOM에서 제거될 때 이 클린업이 호출됩니다. 이전에는 `null`을 인자로 받는 방식으로 처리해야 했습니다.\n\n" +
        "### useImperativeHandle\n" +
        "부모에게 노출할 ref의 인터페이스를 커스터마이즈합니다. DOM 전체를 노출하지 않고 필요한 메서드만 공개할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: useRef 내부 동작",
      content:
        "useRef가 내부적으로 어떻게 동작하는지, 그리고 React 19의 ref prop 전달이 어떻게 가능한지 의사코드로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// useRef 내부 동작 (의사코드)\n' +
          '\n' +
          'interface RefObject<T> {\n' +
          '  current: T;\n' +
          '}\n' +
          '\n' +
          'function useRef<T>(initialValue: T): RefObject<T> {\n' +
          '  const hook = getCurrentHook<RefObject<T>>();\n' +
          '\n' +
          '  if (isFirstRender()) {\n' +
          '    // 마운트: 객체 생성 후 저장\n' +
          '    hook.value = { current: initialValue };\n' +
          '  }\n' +
          '  // 업데이트: 같은 객체 반환 (새로 생성하지 않음)\n' +
          '  return hook.value;\n' +
          '}\n' +
          '\n' +
          '// React 19: ref를 일반 prop으로 전달\n' +
          '// 이전 방식 (forwardRef 필요)\n' +
          'const OldInput = forwardRef<HTMLInputElement, Props>(\n' +
          '  (props, ref) => <input ref={ref} {...props} />\n' +
          ');\n' +
          '\n' +
          '// React 19 방식 (ref가 props에 포함)\n' +
          'function NewInput({ ref, ...props }: Props & { ref?: Ref<HTMLInputElement> }) {\n' +
          '  return <input ref={ref} {...props} />;\n' +
          '}\n' +
          '\n' +
          '// React 19: ref 콜백 클린업\n' +
          'function MeasuredBox() {\n' +
          '  const handleRef = (node: HTMLDivElement | null) => {\n' +
          '    if (node) {\n' +
          '      // DOM 노드가 연결됨 → 설정\n' +
          '      const observer = new ResizeObserver(() => { /* ... */ });\n' +
          '      observer.observe(node);\n' +
          '\n' +
          '      // 클린업 함수 반환 (React 19)\n' +
          '      return () => observer.disconnect();\n' +
          '    }\n' +
          '  };\n' +
          '\n' +
          '  return <div ref={handleRef}>측정 대상</div>;\n' +
          '}',
        description: "useRef는 마운트 시 한 번 객체를 생성하고, 이후 렌더링에서는 같은 객체를 반환합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: useRef 실전 패턴",
      content:
        "다양한 useRef 활용 패턴을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          'import { useRef, useEffect, useImperativeHandle, type Ref } from "react";\n' +
          '\n' +
          '// 패턴 1: DOM 접근 — input 포커스\n' +
          'function SearchBar() {\n' +
          '  const inputRef = useRef<HTMLInputElement>(null);\n' +
          '\n' +
          '  useEffect(() => {\n' +
          '    inputRef.current?.focus();\n' +
          '  }, []);\n' +
          '\n' +
          '  return <input ref={inputRef} placeholder="검색..." />;\n' +
          '}\n' +
          '\n' +
          '// 패턴 2: 값 저장 — 이전 값 추적\n' +
          'function usePrevious<T>(value: T): T | undefined {\n' +
          '  const ref = useRef<T | undefined>(undefined);\n' +
          '\n' +
          '  useEffect(() => {\n' +
          '    ref.current = value;\n' +
          '  });\n' +
          '\n' +
          '  return ref.current;\n' +
          '}\n' +
          '\n' +
          '// 패턴 3: React 19 — ref를 prop으로 (forwardRef 불필요)\n' +
          'interface FancyInputProps {\n' +
          '  label: string;\n' +
          '  ref?: Ref<HTMLInputElement>;\n' +
          '}\n' +
          '\n' +
          'function FancyInput({ label, ref }: FancyInputProps) {\n' +
          '  return (\n' +
          '    <label>\n' +
          '      {label}\n' +
          '      <input ref={ref} />\n' +
          '    </label>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 패턴 4: useImperativeHandle — 노출 API 제한\n' +
          'interface ModalHandle {\n' +
          '  open: () => void;\n' +
          '  close: () => void;\n' +
          '}\n' +
          '\n' +
          'function Modal({ ref }: { ref?: Ref<ModalHandle> }) {\n' +
          '  const dialogRef = useRef<HTMLDialogElement>(null);\n' +
          '\n' +
          '  useImperativeHandle(ref, () => ({\n' +
          '    open: () => dialogRef.current?.showModal(),\n' +
          '    close: () => dialogRef.current?.close(),\n' +
          '  }));\n' +
          '\n' +
          '  return <dialog ref={dialogRef}>모달 내용</dialog>;\n' +
          '}\n' +
          '\n' +
          '// 패턴 5: React 19 — ref 콜백 클린업\n' +
          'function AutoResizeTextarea() {\n' +
          '  const handleRef = (node: HTMLTextAreaElement | null) => {\n' +
          '    if (!node) return;\n' +
          '    const observer = new ResizeObserver(() => {\n' +
          '      node.style.height = node.scrollHeight + "px";\n' +
          '    });\n' +
          '    observer.observe(node);\n' +
          '    return () => observer.disconnect(); // 클린업\n' +
          '  };\n' +
          '\n' +
          '  return <textarea ref={handleRef} />;\n' +
          '}',
        description: "React 19에서는 forwardRef 없이 ref를 prop으로 전달하고, ref 콜백에서 클린업 함수를 반환할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 비교 | useState | useRef |\n" +
        "|------|---------|--------|\n" +
        "| 값 변경 시 리렌더링 | O | X |\n" +
        "| 렌더링 중 읽기 | 현재 값 | 이전 값 가능 |\n" +
        "| 용도 | UI에 반영할 값 | DOM 참조, 타이머 ID 등 |\n\n" +
        "**React 19 변경사항:**\n" +
        "- `ref`를 일반 prop으로 전달 → `forwardRef` 불필요\n" +
        "- ref 콜백에서 클린업 함수 반환 가능\n\n" +
        "**핵심:** useRef는 '렌더링에 영향을 주지 않는 메모장'입니다. DOM 접근과 렌더링 불필요한 값 저장에 사용하세요.\n\n" +
        "**다음 챕터 미리보기:** useMemo와 useCallback으로 불필요한 연산과 리렌더링을 방지하는 메모이제이션을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "useRef와 useState의 차이를 설명할 수 있다",
    "useRef로 DOM 요소에 접근하는 방법을 구현할 수 있다",
    "React 19에서 forwardRef 없이 ref를 전달하는 방법을 알고 있다",
    "ref 콜백 클린업 함수의 용도를 설명할 수 있다",
    "useImperativeHandle의 사용 시나리오를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "useRef로 생성한 값의 .current를 변경하면?",
      choices: [
        "컴포넌트가 리렌더링된다",
        "에러가 발생한다",
        "리렌더링 없이 값이 변경된다",
        "다음 렌더링에서 초기화된다",
      ],
      correctIndex: 2,
      explanation: "useRef의 .current를 변경해도 리렌더링이 발생하지 않습니다. 이것이 useState와의 핵심 차이입니다.",
    },
    {
      id: "q2",
      question: "React 19에서 자식 컴포넌트에 ref를 전달하려면?",
      choices: [
        "반드시 forwardRef로 감싸야 한다",
        "ref를 일반 prop으로 받으면 된다",
        "useRef 대신 createRef를 사용한다",
        "Context로 전달해야 한다",
      ],
      correctIndex: 1,
      explanation: "React 19부터 ref는 일반 prop으로 전달할 수 있습니다. forwardRef 래퍼가 더 이상 필요하지 않습니다.",
    },
    {
      id: "q3",
      question: "React 19의 ref 콜백 클린업이란?",
      choices: [
        "ref가 null일 때 호출되는 함수",
        "ref 콜백이 함수를 반환하면 DOM 제거 시 해당 함수가 호출됨",
        "useEffect의 클린업과 동일한 개념",
        "ref를 수동으로 해제하는 메서드",
      ],
      correctIndex: 1,
      explanation: "React 19에서 ref 콜백이 함수를 반환하면, 해당 요소가 DOM에서 제거될 때 반환된 함수가 클린업으로 호출됩니다.",
    },
    {
      id: "q4",
      question: "useImperativeHandle의 주요 용도는?",
      choices: [
        "ref의 성능을 최적화하기 위해",
        "부모에게 노출할 ref 인터페이스를 제한하기 위해",
        "여러 ref를 하나로 합치기 위해",
        "ref의 타입을 변환하기 위해",
      ],
      correctIndex: 1,
      explanation: "useImperativeHandle은 부모 컴포넌트에 DOM 전체를 노출하지 않고, 필요한 메서드만 공개하도록 ref 인터페이스를 커스터마이즈합니다.",
    },
    {
      id: "q5",
      question: "useRef(0)으로 만든 ref.current 값은 리렌더링 후에도 유지되나요?",
      choices: [
        "유지되지 않고 0으로 초기화된다",
        "유지된다",
        "useState처럼 이전 값이 복원된다",
        "undefined가 된다",
      ],
      correctIndex: 1,
      explanation: "useRef는 컴포넌트의 전체 생명주기 동안 같은 객체를 유지합니다. .current 값은 리렌더링과 무관하게 유지됩니다.",
    },
  ],
};

export default chapter;
