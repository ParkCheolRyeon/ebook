import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "03-components",
  subject: "react",
  title: "컴포넌트",
  description:
    "함수 컴포넌트, 컴포넌트 트리, 합성(Composition), 클래스 컴포넌트(레거시), 컴포넌트 네이밍 규칙을 학습합니다.",
  order: 3,
  group: "기초",
  prerequisites: ["02-jsx"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "컴포넌트는 **레고 블록**입니다.\n\n" +
        "작은 블록(Button, Input)을 조합하여 중간 크기의 구조물(SearchBar, LoginForm)을 만들고, 이를 다시 조합하여 전체 건물(Page)을 완성합니다.\n\n" +
        "각 블록은 **독립적**입니다. 버튼 블록은 자신이 어디에 끼워지든 동일하게 동작합니다. 이것이 바로 **재사용성**입니다.\n\n" +
        "**합성(Composition)**은 블록 안에 구멍을 뚫어두는 것입니다. '이 자리에 아무 블록이나 끼워 넣을 수 있다'고 선언하면, 사용하는 쪽에서 자유롭게 내용을 채울 수 있습니다. React에서는 `children`이 이 역할을 합니다.\n\n" +
        "JS에서 함수가 일급 객체(JS 복습)인 것처럼, React 컴포넌트도 함수이므로 변수에 할당하거나, 다른 컴포넌트에 전달하거나, 동적으로 선택할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "UI가 복잡해지면 여러 문제가 발생합니다.\n\n" +
        "1. **코드 중복** — 같은 모양의 카드, 버튼, 모달을 여러 페이지에서 반복 작성\n" +
        "2. **유지보수 어려움** — 수천 줄의 단일 파일에서 특정 UI 영역을 찾고 수정하기 힘듦\n" +
        "3. **협업 충돌** — 한 파일을 여러 개발자가 동시에 수정하면 머지 충돌 빈발\n" +
        "4. **테스트 불가** — UI 일부만 독립적으로 테스트하기 어려움\n\n" +
        "이를 해결하기 위해 UI를 독립적인 조각으로 분리하고, 각 조각을 재사용 가능한 단위로 만드는 방법이 필요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "React는 **함수 컴포넌트**를 통해 UI를 독립적 단위로 분리합니다.\n\n" +
        "### 함수 컴포넌트\n" +
        "가장 기본적인 컴포넌트 형태입니다. props를 받아 JSX를 반환하는 순수한 함수입니다. React 19에서는 함수 컴포넌트가 사실상 유일한 표준입니다.\n\n" +
        "### 컴포넌트 트리\n" +
        "컴포넌트는 다른 컴포넌트를 자식으로 포함하여 트리 구조를 형성합니다. 이 트리가 곧 UI의 구조입니다.\n\n" +
        "### 합성(Composition)\n" +
        "React는 상속보다 **합성**을 권장합니다. `children` prop을 통해 컴포넌트 안에 임의의 자식을 넣거나, 특정 prop으로 컴포넌트를 전달하는 패턴을 사용합니다.\n\n" +
        "### 클래스 컴포넌트 (레거시)\n" +
        "React 16.8 이전에는 상태와 생명주기를 사용하려면 클래스 컴포넌트가 필수였습니다. 현재는 레거시 코드 이해를 위해서만 알아두면 됩니다.\n\n" +
        "### 네이밍 규칙\n" +
        "- 컴포넌트 이름은 **PascalCase**: `UserProfile`, `TodoList`\n" +
        "- 소문자로 시작하면 React가 HTML 요소로 인식합니다\n" +
        "- 파일명도 컴포넌트명과 일치시키는 것이 관례입니다",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 함수 컴포넌트와 합성",
      content:
        "함수 컴포넌트의 구조와 합성 패턴을 코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          'import { type ReactNode } from "react";\n' +
          '\n' +
          '// === 기본 함수 컴포넌트 ===\n' +
          '// props를 받아 JSX를 반환하는 순수 함수\n' +
          'function Badge({ label }: { label: string }) {\n' +
          '  return <span>{label}</span>;\n' +
          '}\n' +
          '\n' +
          '// === 합성: children 패턴 ===\n' +
          '// 어떤 내용이든 감쌀 수 있는 레이아웃 컴포넌트\n' +
          'function Card({ title, children }: { title: string; children: ReactNode }) {\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <h2>{title}</h2>\n' +
          '      <div>{children}</div>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === 합성: 슬롯 패턴 ===\n' +
          '// 여러 영역에 컴포넌트를 주입\n' +
          'function Layout({\n' +
          '  header,\n' +
          '  sidebar,\n' +
          '  children,\n' +
          '}: {\n' +
          '  header: ReactNode;\n' +
          '  sidebar: ReactNode;\n' +
          '  children: ReactNode;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <header>{header}</header>\n' +
          '      <aside>{sidebar}</aside>\n' +
          '      <main>{children}</main>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === 컴포넌트 트리 구성 ===\n' +
          'function App() {\n' +
          '  return (\n' +
          '    <Layout\n' +
          '      header={<h1>내 앱</h1>}\n' +
          '      sidebar={<nav>메뉴</nav>}\n' +
          '    >\n' +
          '      <Card title="공지사항">\n' +
          '        <p>React 19가 출시되었습니다!</p>\n' +
          '        <Badge label="NEW" />\n' +
          '      </Card>\n' +
          '    </Layout>\n' +
          '  );\n' +
          '}',
        description:
          "합성 패턴으로 컴포넌트를 유연하게 조합합니다. children과 슬롯 패턴이 대표적입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 클래스 컴포넌트와 함수 컴포넌트 비교",
      content:
        "같은 기능을 클래스 컴포넌트와 함수 컴포넌트로 작성하여 차이를 비교합니다. 레거시 코드를 이해하기 위한 참고용입니다.",
      code: {
        language: "typescript",
        code:
          'import { Component, useState } from "react";\n' +
          '\n' +
          '// === 클래스 컴포넌트 (레거시) ===\n' +
          'interface CounterProps {\n' +
          '  initialCount: number;\n' +
          '}\n' +
          '\n' +
          'interface CounterState {\n' +
          '  count: number;\n' +
          '}\n' +
          '\n' +
          'class CounterClass extends Component<CounterProps, CounterState> {\n' +
          '  state: CounterState = { count: this.props.initialCount };\n' +
          '\n' +
          '  handleClick = () => {\n' +
          '    this.setState((prev) => ({ count: prev.count + 1 }));\n' +
          '  };\n' +
          '\n' +
          '  render() {\n' +
          '    return (\n' +
          '      <button onClick={this.handleClick}>\n' +
          '        카운트: {this.state.count}\n' +
          '      </button>\n' +
          '    );\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// === 함수 컴포넌트 (현재 표준) ===\n' +
          'function CounterFunction({ initialCount }: { initialCount: number }) {\n' +
          '  const [count, setCount] = useState(initialCount);\n' +
          '\n' +
          '  return (\n' +
          '    <button onClick={() => setCount((c) => c + 1)}>\n' +
          '      카운트: {count}\n' +
          '    </button>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 함수 컴포넌트가 더 간결하고,\n' +
          '// this 바인딩 문제가 없으며,\n' +
          '// 커스텀 훅으로 로직 재사용이 쉽습니다.',
        description:
          "클래스 컴포넌트는 this, 생명주기 메서드 등 보일러플레이트가 많습니다. 함수 컴포넌트 + 훅이 현재 표준입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| 함수 컴포넌트 | props → JSX를 반환하는 함수, React 19의 표준 |\n" +
        "| 컴포넌트 트리 | 부모-자식 관계로 형성되는 UI 구조 |\n" +
        "| 합성 | children/슬롯 패턴으로 컴포넌트를 유연하게 조합 |\n" +
        "| 클래스 컴포넌트 | 레거시 방식, this/생명주기 기반, 이해용으로만 |\n" +
        "| 네이밍 | PascalCase 필수, 소문자 → HTML 요소로 인식 |\n\n" +
        "**핵심:** 컴포넌트는 UI의 독립적 단위이며, 합성을 통해 복잡한 UI를 구축합니다. 상속보다 합성을 선호하세요.\n\n" +
        "**다음 챕터 미리보기:** 컴포넌트 간에 데이터를 전달하는 메커니즘인 Props를 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "함수 컴포넌트의 기본 구조를 작성할 수 있다",
    "children prop을 활용한 합성 패턴을 구현할 수 있다",
    "컴포넌트 트리 구조를 설계할 수 있다",
    "클래스 컴포넌트와 함수 컴포넌트의 차이를 설명할 수 있다",
    "PascalCase 네이밍 규칙의 이유를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "React에서 컴포넌트 이름을 PascalCase로 작성해야 하는 이유는?",
      choices: [
        "성능 최적화를 위해",
        "소문자로 시작하면 HTML 요소로 인식되기 때문",
        "TypeScript 규칙이기 때문",
        "Babel이 요구하기 때문",
      ],
      correctIndex: 1,
      explanation:
        "React는 소문자로 시작하는 태그를 HTML 내장 요소로, 대문자로 시작하는 태그를 사용자 정의 컴포넌트로 구분합니다.",
    },
    {
      id: "q2",
      question: "React가 상속보다 권장하는 패턴은?",
      choices: ["믹스인(Mixin)", "합성(Composition)", "데코레이터(Decorator)", "프록시(Proxy)"],
      correctIndex: 1,
      explanation:
        "React는 children prop이나 슬롯 패턴을 활용한 합성을 권장합니다. 컴포넌트 간 기능 공유에는 커스텀 훅을 사용합니다.",
    },
    {
      id: "q3",
      question: "함수 컴포넌트가 클래스 컴포넌트보다 선호되는 이유가 아닌 것은?",
      choices: [
        "this 바인딩 문제가 없다",
        "코드가 더 간결하다",
        "생명주기 메서드를 직접 사용할 수 있다",
        "커스텀 훅으로 로직 재사용이 쉽다",
      ],
      correctIndex: 2,
      explanation:
        "함수 컴포넌트에서는 생명주기 메서드 대신 useEffect 등의 훅을 사용합니다. 생명주기 메서드를 '직접' 사용하는 것은 클래스 컴포넌트의 특징입니다.",
    },
    {
      id: "q4",
      question: "컴포넌트 합성에서 children prop의 역할은?",
      choices: [
        "부모 컴포넌트의 상태를 전달한다",
        "컴포넌트 사이에 임의의 JSX를 삽입할 수 있게 한다",
        "컴포넌트의 스타일을 지정한다",
        "이벤트 핸들러를 전달한다",
      ],
      correctIndex: 1,
      explanation:
        "children prop은 컴포넌트 태그 사이에 넣은 내용을 전달받습니다. 이를 통해 래퍼 컴포넌트 안에 자유롭게 내용을 채울 수 있습니다.",
    },
    {
      id: "q5",
      question: "다음 중 올바른 컴포넌트 정의는?",
      choices: [
        "function myComponent() { return <div /> }",
        "function MyComponent() { return <div /> }",
        "const my-component = () => <div />",
        "function 'MyComponent'() { return <div /> }",
      ],
      correctIndex: 1,
      explanation:
        "컴포넌트 이름은 PascalCase이어야 합니다. 소문자로 시작하면 HTML 요소로 인식되고, 하이픈이나 따옴표는 유효한 식별자가 아닙니다.",
    },
  ],
};

export default chapter;
