import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "02-jsx",
  subject: "react",
  title: "JSX",
  description:
    "JSX 문법, Babel 변환, React.createElement, Fragment, JSX 표현식, JSX와 HTML의 차이를 학습합니다.",
  order: 2,
  group: "기초",
  prerequisites: ["01-what-is-react"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "JSX는 **레시피 카드**와 같습니다.\n\n" +
        "HTML이 '완성된 요리 사진'이라면, JSX는 '요리 과정이 포함된 레시피'입니다. 겉으로는 HTML처럼 보이지만, 내부에 자바스크립트 로직(재료 계산, 조건부 재료 추가 등)을 자유롭게 넣을 수 있습니다.\n\n" +
        "Babel은 이 레시피를 **주방 기계가 이해할 수 있는 명령서**(React.createElement 호출)로 번역하는 번역기입니다. 개발자는 읽기 쉬운 레시피를 작성하고, 기계는 정확한 명령서를 받아 실행합니다.\n\n" +
        "**Fragment**는 투명한 접시입니다. 여러 음식을 담아야 하는데 접시가 보이면 안 될 때, Fragment를 사용하면 음식만 보이고 접시는 DOM에 나타나지 않습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React에서 UI를 작성할 때 두 가지 선택지가 있었습니다.\n\n" +
        "1. **React.createElement 직접 호출** — 중첩이 깊어지면 코드가 극도로 복잡해집니다\n" +
        "2. **문자열 템플릿** — 타입 안전성이 없고, 에디터 지원이 불가능합니다\n\n" +
        "```\n" +
        "// React.createElement만으로 UI 작성 — 가독성 최악\n" +
        "React.createElement('div', null,\n" +
        "  React.createElement('h1', null, '제목'),\n" +
        "  React.createElement('p', null, '내용')\n" +
        ")\n" +
        "```\n\n" +
        "개발자 경험(DX)을 해치지 않으면서, HTML의 직관적 구조를 활용할 수 있는 문법이 필요했습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "JSX(JavaScript XML)는 자바스크립트 안에서 HTML과 유사한 구문으로 UI를 작성할 수 있게 해주는 문법 확장입니다.\n\n" +
        "### Babel 변환\n" +
        "JSX는 브라우저가 직접 이해할 수 없습니다. Babel이 빌드 시점에 JSX를 `React.createElement()` 호출(React 17+에서는 자동 JSX 런타임의 `jsx()` 함수)로 변환합니다.\n\n" +
        "### JSX 표현식\n" +
        "중괄호 `{}`를 사용하여 JSX 안에 자바스크립트 표현식을 삽입할 수 있습니다. 변수, 함수 호출, 삼항 연산자 등 **값을 반환하는 표현식**이면 무엇이든 가능합니다.\n\n" +
        "### JSX와 HTML의 주요 차이\n" +
        "- `class` → `className` (JS 예약어 충돌 방지)\n" +
        "- `for` → `htmlFor`\n" +
        "- 카멜케이스 속성명: `onclick` → `onClick`, `tabindex` → `tabIndex`\n" +
        "- 셀프 클로징 태그 필수: `<img />`, `<input />`\n" +
        "- 스타일은 객체로: `style={{ color: 'red' }}`\n\n" +
        "### Fragment\n" +
        "JSX는 반드시 하나의 루트 요소를 반환해야 합니다. 불필요한 래퍼 div 대신 `<Fragment>` 또는 `<>`를 사용하면 DOM에 추가 노드 없이 여러 요소를 그룹화할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: JSX → createElement 변환",
      content:
        "Babel이 JSX를 어떻게 변환하는지 단계별로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// === JSX 코드 (개발자가 작성) ===\n' +
          'function Greeting({ name }: { name: string }) {\n' +
          '  return (\n' +
          '    <div className="greeting">\n' +
          '      <h1>안녕하세요, {name}님!</h1>\n' +
          '      <p>React 세계에 오신 것을 환영합니다.</p>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === Babel 변환 결과 (React 17+ 자동 JSX 런타임) ===\n' +
          'import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";\n' +
          '\n' +
          'function Greeting({ name }: { name: string }) {\n' +
          '  return _jsxs("div", {\n' +
          '    className: "greeting",\n' +
          '    children: [\n' +
          '      _jsx("h1", { children: ["안녕하세요, ", name, "님!"] }),\n' +
          '      _jsx("p", { children: "React 세계에 오신 것을 환영합니다." }),\n' +
          '    ],\n' +
          '  });\n' +
          '}\n' +
          '\n' +
          '// JSX는 결국 함수 호출의 syntactic sugar입니다.\n' +
          '// <태그 속성={값}>자식</태그>\n' +
          '// → jsx("태그", { 속성: 값, children: 자식 })',
        description:
          "JSX는 빌드 시점에 jsx() 함수 호출로 변환됩니다. React 17 이전에는 React.createElement()가 사용되었습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: JSX 표현식과 Fragment",
      content:
        "JSX 안에서 다양한 자바스크립트 표현식을 사용하고, Fragment로 여러 요소를 반환하는 패턴을 연습합니다.",
      code: {
        language: "typescript",
        code:
          'import { Fragment } from "react";\n' +
          '\n' +
          'interface UserCardProps {\n' +
          '  name: string;\n' +
          '  age: number;\n' +
          '  hobbies: string[];\n' +
          '  isAdmin: boolean;\n' +
          '}\n' +
          '\n' +
          'function UserCard({ name, age, hobbies, isAdmin }: UserCardProps) {\n' +
          '  // JSX 안에서 표현식 사용\n' +
          '  return (\n' +
          '    <>\n' +
          '      {/* 변수 삽입 */}\n' +
          '      <h2>{name} ({age}세)</h2>\n' +
          '\n' +
          '      {/* 조건부 렌더링 — 삼항 연산자 */}\n' +
          '      <span>{isAdmin ? "관리자" : "일반 사용자"}</span>\n' +
          '\n' +
          '      {/* 배열 렌더링 — map */}\n' +
          '      <ul>\n' +
          '        {hobbies.map((hobby) => (\n' +
          '          <li key={hobby}>{hobby}</li>\n' +
          '        ))}\n' +
          '      </ul>\n' +
          '\n' +
          '      {/* 인라인 계산 */}\n' +
          '      <p>태어난 해: {new Date().getFullYear() - age}년 (추정)</p>\n' +
          '    </>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// Fragment에 key가 필요한 경우\n' +
          'function GlossaryList({ items }: { items: { id: string; term: string; desc: string }[] }) {\n' +
          '  return (\n' +
          '    <dl>\n' +
          '      {items.map((item) => (\n' +
          '        <Fragment key={item.id}>\n' +
          '          <dt>{item.term}</dt>\n' +
          '          <dd>{item.desc}</dd>\n' +
          '        </Fragment>\n' +
          '      ))}\n' +
          '    </dl>\n' +
          '  );\n' +
          '}',
        description:
          "중괄호 안에 표현식을 넣어 동적 UI를 만들고, Fragment로 불필요한 래퍼 없이 여러 요소를 반환합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| JSX | JS 안에서 HTML 유사 문법으로 UI를 기술하는 문법 확장 |\n" +
        "| Babel 변환 | JSX → jsx() 함수 호출로 빌드 시점에 변환 |\n" +
        "| JSX 표현식 | 중괄호 `{}`로 JS 표현식 삽입 (문이 아닌 표현식만) |\n" +
        "| Fragment | `<>...</>` 또는 `<Fragment>` — 불필요한 DOM 노드 없이 그룹화 |\n" +
        "| HTML 차이 | className, htmlFor, 카멜케이스 속성, 셀프 클로징 필수 |\n\n" +
        "**핵심:** JSX는 React.createElement의 문법적 설탕(syntactic sugar)이며, 자바스크립트의 모든 표현력을 UI 기술에 활용할 수 있게 합니다.\n\n" +
        "**다음 챕터 미리보기:** JSX로 기술한 UI를 재사용 가능한 단위인 '컴포넌트'로 분리하는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "JSX는 JavaScript 안에 HTML처럼 생긴 문법을 쓸 수 있게 해주는 확장이다. React 17+에서는 컴파일 시 jsx()/jsxs() 함수 호출로 변환되며(이전에는 React.createElement()), 결국 자바스크립트 객체를 만든다.",
  checklist: [
    "JSX가 Babel에 의해 어떻게 변환되는지 설명할 수 있다",
    "JSX 안에서 표현식과 문(statement)의 차이를 이해한다",
    "JSX와 HTML의 주요 차이점을 나열할 수 있다",
    "Fragment의 용도와 사용 시점을 설명할 수 있다",
    "JSX에서 key 속성이 필요한 상황을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "JSX는 브라우저에서 어떻게 실행되는가?",
      choices: [
        "브라우저가 JSX를 직접 파싱한다",
        "빌드 도구(Babel)가 JS 함수 호출로 변환한다",
        "런타임에 인터프리터가 변환한다",
        "WebAssembly로 컴파일된다",
      ],
      correctIndex: 1,
      explanation:
        "JSX는 브라우저가 이해할 수 없는 문법입니다. Babel이 빌드 시점에 jsx() 또는 React.createElement() 호출로 변환합니다.",
    },
    {
      id: "q2",
      question: "JSX 안에서 사용할 수 없는 것은?",
      choices: [
        "삼항 연산자",
        "함수 호출",
        "if-else 문",
        "논리 AND(&&) 연산자",
      ],
      correctIndex: 2,
      explanation:
        "JSX 중괄호 안에는 값을 반환하는 '표현식'만 사용할 수 있습니다. if-else는 '문(statement)'이므로 직접 사용할 수 없습니다.",
    },
    {
      id: "q3",
      question: "HTML의 class 속성은 JSX에서 어떻게 작성하는가?",
      choices: ["class", "className", "cssClass", "htmlClass"],
      correctIndex: 1,
      explanation:
        "class는 자바스크립트의 예약어이므로, JSX에서는 className을 사용합니다.",
    },
    {
      id: "q4",
      question: "Fragment(<>...</>)의 주요 용도는?",
      choices: [
        "스타일을 적용하기 위한 래퍼",
        "DOM에 추가 노드 없이 여러 요소를 그룹화",
        "성능 최적화를 위한 메모이제이션",
        "에러 바운더리 역할",
      ],
      correctIndex: 1,
      explanation:
        "Fragment는 불필요한 div 래퍼 없이 여러 JSX 요소를 하나로 묶어 반환할 수 있게 합니다. 실제 DOM에는 아무 노드도 추가되지 않습니다.",
    },
    {
      id: "q5",
      question: "다음 중 JSX와 HTML의 차이가 아닌 것은?",
      choices: [
        "속성명이 카멜케이스이다",
        "셀프 클로징 태그에 /가 필수이다",
        "주석을 {/* */}로 작성한다",
        "태그 이름이 모두 소문자여야 한다",
      ],
      correctIndex: 3,
      explanation:
        "JSX에서 태그 이름은 소문자(HTML 요소)와 대문자(컴포넌트) 모두 사용할 수 있습니다. 오히려 컴포넌트는 대문자로 시작해야 합니다.",
    },
  ],
};

export default chapter;
