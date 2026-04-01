import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "01-what-is-react",
  subject: "react",
  title: "React란 무엇인가",
  description:
    "선언적 UI, 가상 DOM 개념, React의 철학, 명령형 vs 선언적 프로그래밍, 컴포넌트 기반 아키텍처를 학습합니다.",
  order: 1,
  group: "기초",
  prerequisites: [],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "React는 **레스토랑 주문 시스템**과 비슷합니다.\n\n" +
        "**명령형(Imperative)** 방식은 직접 주방에 들어가서 요리하는 것입니다. '프라이팬을 달궈라, 기름을 두르라, 달걀을 깨라...' 모든 단계를 직접 지시합니다.\n\n" +
        "**선언적(Declarative)** 방식은 메뉴에서 '스크램블 에그'를 주문하는 것입니다. **무엇**을 원하는지만 말하면, **어떻게** 만들지는 주방(React)이 알아서 처리합니다.\n\n" +
        "**가상 DOM**은 주방의 주문 메모장입니다. 새 주문이 들어오면 이전 메모와 비교해서, 실제로 바뀐 음식만 다시 만듭니다. 전체 테이블을 다시 세팅하지 않고, 바뀐 접시만 교체하는 것이죠.\n\n" +
        "**컴포넌트**는 레고 블록입니다. 작은 블록(버튼, 입력창)을 조합해서 큰 구조물(페이지)을 만들고, 같은 블록을 여러 곳에서 재사용할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "웹 애플리케이션이 복잡해지면서 UI 관리가 점점 어려워졌습니다.\n\n" +
        "1. **DOM 직접 조작의 복잡성** — jQuery 시대에는 `$('#item').append(...)`, `$('.list').html(...)` 같은 명령형 코드가 넘쳐났습니다. 상태가 바뀔 때마다 어떤 DOM 요소를 어떻게 변경할지 일일이 지시해야 했습니다.\n\n" +
        "2. **상태와 UI의 불일치** — 데이터는 바뀌었는데 화면은 안 바뀌거나, 반대로 화면만 바뀌고 데이터는 그대로인 버그가 빈번했습니다.\n\n" +
        "3. **코드 재사용의 어려움** — 비슷한 UI를 여러 페이지에서 만들 때, 같은 DOM 조작 로직을 복사-붙여넣기하는 일이 반복되었습니다.\n\n" +
        "4. **대규모 팀 협업** — 하나의 거대한 HTML/JS 파일에서 여러 개발자가 작업하면 충돌이 잦았습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "React는 세 가지 핵심 아이디어로 이 문제들을 해결합니다.\n\n" +
        "### 1. 선언적 UI\n" +
        "개발자는 '현재 상태일 때 UI가 어떻게 보여야 하는지'만 기술합니다. 상태가 바뀌면 React가 자동으로 UI를 업데이트합니다. DOM 조작 코드를 직접 작성할 필요가 없습니다.\n\n" +
        "### 2. 가상 DOM과 재조정(Reconciliation)\n" +
        "React는 메모리에 가상 DOM 트리를 유지합니다. 상태가 변경되면 새 가상 DOM을 생성하고, 이전 것과 비교(diffing)하여 **실제로 바뀐 부분만** 실제 DOM에 반영합니다. 이를 재조정이라 합니다.\n\n" +
        "### 3. 컴포넌트 기반 아키텍처\n" +
        "UI를 독립적인 컴포넌트 단위로 분리합니다. 각 컴포넌트는 자신의 상태와 렌더링 로직을 캡슐화하며, 트리 구조로 조합됩니다. 이는 재사용성과 유지보수성을 크게 높입니다.\n\n" +
        "### React의 철학\n" +
        "- **단방향 데이터 흐름**: 부모 → 자식으로만 데이터가 흐릅니다\n" +
        "- **합성(Composition)**: 상속보다 합성을 선호합니다\n" +
        "- **명시적(Explicit)**: 마법 같은 암묵적 동작을 피합니다",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 명령형 vs 선언적",
      content:
        "같은 '할 일 추가' 기능을 명령형과 선언적으로 구현하여 비교합니다.",
      code: {
        language: "typescript",
        code:
          '// === 명령형 접근 (Vanilla JS) ===\n' +
          '// "어떻게" 해야 하는지 단계별로 지시\n' +
          'function addTodoImperative(text: string) {\n' +
          '  const list = document.getElementById("todo-list")!;\n' +
          '  const li = document.createElement("li");\n' +
          '  li.textContent = text;\n' +
          '  const btn = document.createElement("button");\n' +
          '  btn.textContent = "삭제";\n' +
          '  btn.addEventListener("click", () => li.remove());\n' +
          '  li.appendChild(btn);\n' +
          '  list.appendChild(li);\n' +
          '}\n' +
          '\n' +
          '// === 선언적 접근 (React) ===\n' +
          '// "무엇"을 보여줄지만 기술\n' +
          'function TodoList() {\n' +
          '  const [todos, setTodos] = useState<string[]>([]);\n' +
          '\n' +
          '  const addTodo = (text: string) => {\n' +
          '    setTodos(prev => [...prev, text]);\n' +
          '  };\n' +
          '\n' +
          '  const removeTodo = (index: number) => {\n' +
          '    setTodos(prev => prev.filter((_, i) => i !== index));\n' +
          '  };\n' +
          '\n' +
          '  // 상태로부터 UI가 자동으로 결정됨\n' +
          '  return (\n' +
          '    <ul>\n' +
          '      {todos.map((todo, i) => (\n' +
          '        <li key={i}>\n' +
          '          {todo}\n' +
          '          <button onClick={() => removeTodo(i)}>삭제</button>\n' +
          '        </li>\n' +
          '      ))}\n' +
          '    </ul>\n' +
          '  );\n' +
          '}',
        description:
          "명령형은 DOM 조작 방법을 직접 기술하고, 선언적은 상태에 따른 UI 모습만 기술합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 가상 DOM 재조정 이해하기",
      content:
        "가상 DOM의 diffing 과정을 단순화한 예제로, React가 내부적으로 어떤 최소한의 변경만 수행하는지 확인합니다.",
      code: {
        language: "typescript",
        code:
          '// 가상 DOM 개념을 단순화한 의사코드\n' +
          'interface VNode {\n' +
          '  type: string;\n' +
          '  props: Record<string, unknown>;\n' +
          '  children: (VNode | string)[];\n' +
          '}\n' +
          '\n' +
          '// 이전 상태의 가상 DOM\n' +
          'const oldTree: VNode = {\n' +
          '  type: "ul",\n' +
          '  props: {},\n' +
          '  children: [\n' +
          '    { type: "li", props: {}, children: ["할 일 1"] },\n' +
          '    { type: "li", props: {}, children: ["할 일 2"] },\n' +
          '  ],\n' +
          '};\n' +
          '\n' +
          '// 새 상태의 가상 DOM (할 일 3 추가됨)\n' +
          'const newTree: VNode = {\n' +
          '  type: "ul",\n' +
          '  props: {},\n' +
          '  children: [\n' +
          '    { type: "li", props: {}, children: ["할 일 1"] }, // 동일 → 건너뜀\n' +
          '    { type: "li", props: {}, children: ["할 일 2"] }, // 동일 → 건너뜀\n' +
          '    { type: "li", props: {}, children: ["할 일 3"] }, // 새로 추가 → DOM에 반영\n' +
          '  ],\n' +
          '};\n' +
          '\n' +
          '// React의 재조정 결과:\n' +
          '// 실제 DOM 조작은 "li 하나 추가"만 수행\n' +
          '// 전체 ul을 다시 그리지 않음',
        description:
          "React는 이전 가상 DOM과 새 가상 DOM을 비교하여, 변경된 부분만 실제 DOM에 적용합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| 선언적 UI | 상태에 따른 UI 모습을 기술하면 React가 DOM을 자동 업데이트 |\n" +
        "| 가상 DOM | 메모리상의 DOM 복사본으로, diffing을 통해 최소한의 실제 DOM 변경 수행 |\n" +
        "| 재조정 | 이전/새 가상 DOM을 비교하여 변경점을 찾는 알고리즘 |\n" +
        "| 컴포넌트 | 독립적이고 재사용 가능한 UI 단위 |\n" +
        "| 단방향 데이터 흐름 | 부모 → 자식으로만 데이터 전달 |\n\n" +
        "**핵심:** React는 '무엇을 보여줄지'만 선언하면, '어떻게 업데이트할지'를 알아서 처리하는 라이브러리입니다.\n\n" +
        "**다음 챕터 미리보기:** React에서 HTML과 유사하게 UI를 기술하는 문법인 JSX를 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "명령형 프로그래밍과 선언적 프로그래밍의 차이를 설명할 수 있다",
    "가상 DOM의 역할과 재조정 과정을 설명할 수 있다",
    "컴포넌트 기반 아키텍처의 장점을 설명할 수 있다",
    "React의 단방향 데이터 흐름을 이해한다",
    "React가 해결하려는 핵심 문제를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "React의 프로그래밍 패러다임은?",
      choices: ["명령형", "선언적", "객체지향", "함수형만"],
      correctIndex: 1,
      explanation:
        "React는 선언적 프로그래밍 패러다임을 따릅니다. 개발자는 UI가 '어떤 모습이어야 하는지'를 기술하고, React가 DOM 업데이트를 처리합니다.",
    },
    {
      id: "q2",
      question: "가상 DOM의 주된 목적은?",
      choices: [
        "실제 DOM을 완전히 대체한다",
        "변경된 부분만 효율적으로 실제 DOM에 반영한다",
        "서버에서 렌더링을 수행한다",
        "CSS 성능을 최적화한다",
      ],
      correctIndex: 1,
      explanation:
        "가상 DOM은 이전 상태와 새 상태를 비교(diffing)하여 변경된 부분만 실제 DOM에 반영함으로써 불필요한 DOM 조작을 최소화합니다.",
    },
    {
      id: "q3",
      question: "React에서 데이터가 흐르는 방향은?",
      choices: [
        "양방향 (부모 ↔ 자식)",
        "단방향 (부모 → 자식)",
        "자식 → 부모",
        "전역에서 모든 컴포넌트로",
      ],
      correctIndex: 1,
      explanation:
        "React는 단방향 데이터 흐름을 따릅니다. 데이터는 부모 컴포넌트에서 자식 컴포넌트로 props를 통해 전달됩니다.",
    },
    {
      id: "q4",
      question: "React의 재조정(Reconciliation)이란?",
      choices: [
        "컴포넌트를 처음 렌더링하는 과정",
        "이전 가상 DOM과 새 가상 DOM을 비교하여 변경점을 찾는 알고리즘",
        "CSS를 적용하는 과정",
        "이벤트를 처리하는 과정",
      ],
      correctIndex: 1,
      explanation:
        "재조정은 React가 이전 가상 DOM 트리와 새 가상 DOM 트리를 비교하여 최소한의 DOM 변경을 계산하는 과정입니다.",
    },
    {
      id: "q5",
      question: "컴포넌트 기반 아키텍처의 장점이 아닌 것은?",
      choices: [
        "코드 재사용성이 높아진다",
        "각 컴포넌트를 독립적으로 개발/테스트할 수 있다",
        "전역 상태가 자동으로 관리된다",
        "UI를 작은 단위로 분리하여 유지보수가 쉬워진다",
      ],
      correctIndex: 2,
      explanation:
        "컴포넌트 기반 아키텍처는 재사용성, 독립적 개발, 유지보수성을 제공하지만, 전역 상태 관리는 별도의 메커니즘(Context, 외부 라이브러리 등)이 필요합니다.",
    },
  ],
};

export default chapter;
