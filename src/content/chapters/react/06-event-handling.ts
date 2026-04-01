import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "06-event-handling",
  subject: "react",
  title: "이벤트 핸들링",
  description:
    "합성 이벤트(SyntheticEvent), 이벤트 위임(root), 네이티브 이벤트와의 차이, TypeScript 이벤트 타입을 학습합니다.",
  order: 6,
  group: "기초",
  prerequisites: ["05-state-usestate"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "React의 이벤트 시스템은 **호텔 프런트 데스크**와 같습니다.\n\n" +
        "각 객실(DOM 요소)에 직접 전화선을 깔지 않고, 모든 전화를 프런트(root)에서 받아 해당 객실로 연결합니다. 이것이 **이벤트 위임**입니다.\n\n" +
        "프런트에서는 모든 전화를 **표준 양식**(SyntheticEvent)으로 변환하여 전달합니다. 어떤 브라우저에서 전화가 오든 동일한 형식으로 받을 수 있습니다.\n\n" +
        "JS에서 이벤트 버블링과 캡처링(JS 복습)을 배웠습니다. React에서도 같은 원리가 적용되지만, React는 이를 가상 DOM 트리 기준으로 처리합니다. 실제 DOM이 아닌 React 컴포넌트 트리를 기준으로 이벤트가 전파됩니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "브라우저 이벤트를 직접 다루면 여러 문제가 발생합니다.\n\n" +
        "1. **브라우저 호환성** — 같은 이벤트가 브라우저마다 다르게 동작할 수 있습니다\n" +
        "2. **메모리 누수** — addEventListener로 등록한 리스너를 제거하지 않으면 메모리 누수가 발생합니다\n" +
        "3. **성능** — 수많은 DOM 요소에 개별 리스너를 등록하면 성능이 저하됩니다\n" +
        "4. **타입 안전성** — 네이티브 이벤트 객체는 TypeScript 타이핑이 복잡합니다\n" +
        "5. **이벤트 풀링** — React 16 이하에서는 이벤트 객체가 재사용(풀링)되어 비동기 접근 시 문제가 있었습니다 (React 17+에서 제거됨)",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "React는 **합성 이벤트(SyntheticEvent)** 시스템으로 이 문제들을 해결합니다.\n\n" +
        "### 합성 이벤트 (SyntheticEvent)\n" +
        "네이티브 이벤트를 감싼 크로스 브라우저 래퍼입니다. 모든 브라우저에서 동일한 인터페이스를 제공하며, `nativeEvent` 속성으로 원본 이벤트에 접근할 수 있습니다.\n\n" +
        "### 이벤트 위임 (React 17+: root)\n" +
        "React는 개별 DOM 노드에 리스너를 등록하지 않습니다. React 17부터는 root DOM 노드에 하나의 리스너를 등록하고, 이벤트를 가상 DOM 트리 기준으로 디스패치합니다.\n\n" +
        "### 이벤트 풀링 제거 (React 17+)\n" +
        "React 17부터 이벤트 풀링이 제거되었습니다. 비동기 코드에서도 이벤트 객체에 안전하게 접근할 수 있습니다.\n\n" +
        "### TypeScript 이벤트 타입\n" +
        "React는 각 이벤트에 대한 제네릭 타입을 제공합니다:\n" +
        "- `React.MouseEvent<HTMLButtonElement>`\n" +
        "- `React.ChangeEvent<HTMLInputElement>`\n" +
        "- `React.FormEvent<HTMLFormElement>`\n" +
        "- `React.KeyboardEvent<HTMLInputElement>`",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 이벤트 핸들링 패턴",
      content:
        "React에서 이벤트를 다루는 다양한 패턴과 TypeScript 타이핑을 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          'import { useState, type MouseEvent, type ChangeEvent, type KeyboardEvent } from "react";\n' +
          '\n' +
          '// === 기본 이벤트 핸들링 ===\n' +
          'function EventBasics() {\n' +
          '  // 인라인 핸들러\n' +
          '  // <button onClick={() => console.log("클릭!")}>클릭</button>\n' +
          '\n' +
          '  // 명명된 핸들러 (권장)\n' +
          '  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {\n' +
          '    console.log("클릭 좌표:", e.clientX, e.clientY);\n' +
          '    // e.nativeEvent — 네이티브 이벤트 접근\n' +
          '  };\n' +
          '\n' +
          '  return <button onClick={handleClick}>클릭</button>;\n' +
          '}\n' +
          '\n' +
          '// === 이벤트에 인자 전달 ===\n' +
          'function ItemList() {\n' +
          '  const items = ["사과", "바나나", "체리"];\n' +
          '\n' +
          '  // 화살표 함수로 래핑하여 인자 전달\n' +
          '  const handleSelect = (item: string) => {\n' +
          '    console.log("선택:", item);\n' +
          '  };\n' +
          '\n' +
          '  return (\n' +
          '    <ul>\n' +
          '      {items.map(item => (\n' +
          '        <li key={item}>\n' +
          '          <button onClick={() => handleSelect(item)}>{item}</button>\n' +
          '        </li>\n' +
          '      ))}\n' +
          '    </ul>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === TypeScript 이벤트 타입 ===\n' +
          'function TypedInputs() {\n' +
          '  const [value, setValue] = useState("");\n' +
          '\n' +
          '  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {\n' +
          '    setValue(e.target.value);\n' +
          '  };\n' +
          '\n' +
          '  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {\n' +
          '    if (e.key === "Enter") {\n' +
          '      console.log("Enter 입력:", value);\n' +
          '    }\n' +
          '  };\n' +
          '\n' +
          '  return (\n' +
          '    <input\n' +
          '      value={value}\n' +
          '      onChange={handleChange}\n' +
          '      onKeyDown={handleKeyDown}\n' +
          '    />\n' +
          '  );\n' +
          '}',
        description:
          "React의 이벤트 핸들러는 카멜케이스로 작성하며, TypeScript 제네릭 타입으로 이벤트와 요소를 정확히 타이핑합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 이벤트 전파와 기본 동작 제어",
      content:
        "이벤트 전파 중지(stopPropagation)와 기본 동작 방지(preventDefault)를 연습합니다.",
      code: {
        language: "typescript",
        code:
          'import { type MouseEvent, type FormEvent } from "react";\n' +
          '\n' +
          '// === 이벤트 전파 제어 ===\n' +
          'function PropagationExample() {\n' +
          '  const handleOuterClick = () => {\n' +
          '    console.log("외부 클릭");\n' +
          '  };\n' +
          '\n' +
          '  const handleInnerClick = (e: MouseEvent<HTMLButtonElement>) => {\n' +
          '    e.stopPropagation(); // 이벤트 버블링 중지\n' +
          '    console.log("내부 클릭 — 외부로 전파되지 않음");\n' +
          '  };\n' +
          '\n' +
          '  return (\n' +
          '    <div onClick={handleOuterClick}>\n' +
          '      <button onClick={handleInnerClick}>내부 버튼</button>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === 기본 동작 방지 ===\n' +
          'function FormExample() {\n' +
          '  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {\n' +
          '    e.preventDefault(); // 폼 기본 제출 동작 방지\n' +
          '    console.log("폼 제출 처리");\n' +
          '  };\n' +
          '\n' +
          '  return (\n' +
          '    <form onSubmit={handleSubmit}>\n' +
          '      <input name="email" type="email" />\n' +
          '      <button type="submit">제출</button>\n' +
          '    </form>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === 이벤트 핸들러 네이밍 관례 ===\n' +
          '// 핸들러 함수: handleXxx (handleClick, handleSubmit)\n' +
          '// Props로 전달: onXxx (onClick, onSubmit)\n' +
          '// 예시:\n' +
          'function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {\n' +
          '  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {\n' +
          '    e.preventDefault();\n' +
          '    const formData = new FormData(e.currentTarget);\n' +
          '    onSearch(formData.get("query") as string);\n' +
          '  };\n' +
          '\n' +
          '  return (\n' +
          '    <form onSubmit={handleSubmit}>\n' +
          '      <input name="query" />\n' +
          '      <button type="submit">검색</button>\n' +
          '    </form>\n' +
          '  );\n' +
          '}',
        description:
          "stopPropagation과 preventDefault로 이벤트 동작을 제어하고, 핸들러 네이밍 관례를 따릅니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| SyntheticEvent | 네이티브 이벤트의 크로스 브라우저 래퍼 |\n" +
        "| 이벤트 위임 | root에 하나의 리스너 등록, 가상 DOM 기준 디스패치 |\n" +
        "| 이벤트 풀링 | React 17+에서 제거됨, 비동기 접근 안전 |\n" +
        "| 카멜케이스 | onclick → onClick, onchange → onChange |\n" +
        "| TypeScript | React.MouseEvent<E>, React.ChangeEvent<E> 등 |\n\n" +
        "**핵심:** React는 합성 이벤트로 브라우저 호환성을 보장하고, 이벤트 위임으로 성능을 최적화합니다. TypeScript 이벤트 타입을 활용하세요.\n\n" +
        "**다음 챕터 미리보기:** 조건부 렌더링과 리스트 렌더링, 그리고 key의 역할을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "SyntheticEvent가 무엇이고 왜 사용하는지 설명할 수 있다",
    "React의 이벤트 위임 방식을 설명할 수 있다",
    "TypeScript로 이벤트 핸들러 타입을 작성할 수 있다",
    "stopPropagation과 preventDefault의 차이를 설명할 수 있다",
    "이벤트 핸들러 네이밍 관례(handle/on)를 따를 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "React의 SyntheticEvent의 주된 목적은?",
      choices: [
        "성능을 최적화한다",
        "크로스 브라우저 호환성을 보장한다",
        "이벤트를 비동기로 처리한다",
        "TypeScript 지원을 위해 존재한다",
      ],
      correctIndex: 1,
      explanation:
        "SyntheticEvent는 네이티브 이벤트를 감싼 래퍼로, 모든 브라우저에서 동일한 이벤트 인터페이스를 제공합니다.",
    },
    {
      id: "q2",
      question: "React 17+에서 이벤트 리스너가 등록되는 위치는?",
      choices: [
        "각 DOM 요소",
        "document 객체",
        "React root DOM 노드",
        "window 객체",
      ],
      correctIndex: 2,
      explanation:
        "React 17부터 이벤트 리스너는 document가 아닌 React root DOM 노드에 등록됩니다. 이는 여러 React 인스턴스의 공존을 더 쉽게 만듭니다.",
    },
    {
      id: "q3",
      question: "이벤트 핸들러에 인자를 전달하는 올바른 방법은?",
      choices: [
        "<button onClick={handleClick(id)}>",
        "<button onClick={() => handleClick(id)}>",
        "<button onClick={handleClick, id}>",
        "<button onClick={handleClick.bind(id)}>",
      ],
      correctIndex: 1,
      explanation:
        "화살표 함수로 감싸서 인자를 전달합니다. handleClick(id)를 직접 쓰면 렌더링 시점에 즉시 실행되어 버립니다.",
    },
    {
      id: "q4",
      question: "React 17+에서 이벤트 풀링에 대한 설명으로 올바른 것은?",
      choices: [
        "여전히 이벤트 풀링이 적용된다",
        "이벤트 풀링이 제거되어 비동기에서도 안전하게 접근 가능하다",
        "e.persist()를 반드시 호출해야 한다",
        "이벤트 풀링은 성능을 위해 유지된다",
      ],
      correctIndex: 1,
      explanation:
        "React 17부터 이벤트 풀링이 제거되었습니다. 더 이상 e.persist()를 호출할 필요 없이 비동기 코드에서 이벤트 객체에 안전하게 접근할 수 있습니다.",
    },
    {
      id: "q5",
      question: "input의 onChange 핸들러에 적합한 TypeScript 타입은?",
      choices: [
        "React.MouseEvent<HTMLInputElement>",
        "React.ChangeEvent<HTMLInputElement>",
        "React.InputEvent<HTMLInputElement>",
        "Event",
      ],
      correctIndex: 1,
      explanation:
        "input의 값 변경은 React.ChangeEvent<HTMLInputElement>로 타이핑합니다. e.target.value로 입력값에 타입 안전하게 접근할 수 있습니다.",
    },
  ],
};

export default chapter;
