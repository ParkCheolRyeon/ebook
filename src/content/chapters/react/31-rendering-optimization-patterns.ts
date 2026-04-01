import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "31-rendering-optimization-patterns",
  subject: "react",
  title: "렌더링 최적화 패턴",
  description: "상태 끌어올리기/내리기, 컴포넌트 분리, children as props 패턴, 컴포지션으로 리렌더링을 격리하는 방법을 이해합니다.",
  order: 31,
  group: "성능 최적화",
  prerequisites: ["30-profiler-devtools"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "렌더링 최적화 패턴은 사무실 공간 설계와 비슷합니다.\n\n" +
        "**상태 내리기(State Down)**는 소음이 나는 장비(자주 변하는 상태)를 별도 방에 격리하는 것입니다. 회의실(다른 컴포넌트)까지 소음이 퍼지지 않습니다.\n\n" +
        "**상태 올리기(State Up)**는 여러 팀이 공유해야 하는 장비를 공용 공간에 두는 것입니다.\n\n" +
        "**Children as Props**는 건물의 뼈대(레이아웃 컴포넌트)와 입주자(children)를 분리하는 것입니다. 뼈대를 수리해도(리렌더링) 입주자에게는 영향이 없습니다.\n\n" +
        "**컴포넌트 분리**는 하나의 큰 사무실을 기능별로 나누는 것입니다. 영업팀(버튼)에 변화가 있어도 개발팀(리스트)은 영향받지 않습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React.memo나 useMemo 같은 API 없이도 코드 구조만으로 해결할 수 있는 리렌더링 문제들이 있습니다.\n\n" +
        "1. **상태를 너무 높은 곳에 배치** — 루트 컴포넌트에 상태를 두면 상태가 변할 때마다 전체 트리가 리렌더링됩니다.\n" +
        "2. **하나의 거대 컴포넌트** — 상태와 UI가 한 컴포넌트에 뒤섞이면 부분 업데이트가 불가능합니다.\n" +
        "3. **레이아웃과 콘텐츠의 결합** — 레이아웃 컴포넌트가 상태를 가지면 children까지 불필요하게 리렌더링됩니다.\n" +
        "4. **API 의존적 최적화** — React.memo/useMemo/useCallback에 과도하게 의존하면 코드가 복잡해지고 유지보수가 어렵습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 패턴 1: 상태 내리기 (Moving State Down)\n" +
        "자주 변하는 상태를 해당 상태를 실제로 사용하는 컴포넌트로 내립니다. 상태가 변해도 형제 컴포넌트는 리렌더링되지 않습니다.\n\n" +
        "### 패턴 2: 컴포넌트 추출 (Extracting Components)\n" +
        "자주 변하는 부분과 변하지 않는 부분을 별도 컴포넌트로 분리합니다.\n\n" +
        "### 패턴 3: Children as Props\n" +
        "상태를 가진 컴포넌트에 children을 전달하면, 상태가 변해도 children은 부모의 렌더링 결과물이므로 **이미 생성된 JSX 참조**가 유지되어 리렌더링되지 않습니다.\n\n" +
        "### 패턴 4: 컴포지션 (Composition)\n" +
        "컴포넌트를 작은 단위로 합성하여 각 부분이 독립적으로 업데이트되도록 합니다. 상속 대신 합성을 사용하는 React의 기본 철학과 일치합니다.\n\n" +
        "### 패턴 5: 상태 끌어올리기 (Lifting State Up)\n" +
        "여러 컴포넌트가 같은 데이터를 공유해야 할 때, 가장 가까운 공통 부모로 상태를 올립니다. 필요 이상으로 올리지 않는 것이 핵심입니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Children as Props 패턴의 원리",
      content:
        "children이 왜 리렌더링을 방지하는지 내부 동작을 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// children as props 패턴의 원리\n' +
          '\n' +
          '// ❌ 상태와 children이 같은 컴포넌트에 있는 경우\n' +
          'function BadLayout() {\n' +
          '  const [color, setColor] = useState("red");\n' +
          '\n' +
          '  // color가 변할 때마다 BadLayout 전체가 리렌더링\n' +
          '  // → ExpensiveTree도 리렌더링됨!\n' +
          '  return (\n' +
          '    <div style={{ color }}>\n' +
          '      <input value={color} onChange={(e) => setColor(e.target.value)} />\n' +
          '      <ExpensiveTree /> {/* 매번 새로 생성되는 JSX */}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ✅ children으로 분리한 경우\n' +
          'function GoodLayout({ children }: { children: React.ReactNode }) {\n' +
          '  const [color, setColor] = useState("red");\n' +
          '\n' +
          '  // color가 변해도 children의 JSX 참조는 변하지 않음\n' +
          '  // → children은 리렌더링되지 않음!\n' +
          '  return (\n' +
          '    <div style={{ color }}>\n' +
          '      <input value={color} onChange={(e) => setColor(e.target.value)} />\n' +
          '      {children} {/* 부모에서 이미 생성된 JSX 참조 */}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 사용:\n' +
          '// <GoodLayout>\n' +
          '//   <ExpensiveTree />  ← App에서 생성된 JSX, GoodLayout 리렌더링에 무관\n' +
          '// </GoodLayout>\n' +
          '\n' +
          '// 내부적으로 왜 이렇게 동작하는가?\n' +
          '// React의 재조정 로직:\n' +
          'function reconcileChildren(\n' +
          '  parentFiber: FiberNode,\n' +
          '  oldChildren: ReactElement[],\n' +
          '  newChildren: ReactElement[]\n' +
          ') {\n' +
          '  for (let i = 0; i < newChildren.length; i++) {\n' +
          '    const oldChild = oldChildren[i];\n' +
          '    const newChild = newChildren[i];\n' +
          '\n' +
          '    // children은 부모(App)에서 전달된 동일한 JSX 참조\n' +
          '    // oldChild === newChild → 같은 참조이므로 재조정 스킵!\n' +
          '    if (oldChild === newChild) {\n' +
          '      continue; // 리렌더링 불필요\n' +
          '    }\n' +
          '\n' +
          '    reconcile(parentFiber, oldChild, newChild);\n' +
          '  }\n' +
          '}\n',
        description: "children은 부모 컴포넌트에서 이미 생성된 JSX 참조이므로, 현재 컴포넌트가 리렌더링되어도 참조가 변하지 않습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 렌더링 최적화 패턴 적용",
      content:
        "각 패턴을 적용하여 불필요한 리렌더링을 제거하는 예제입니다.",
      code: {
        language: "typescript",
        code:
          'import { useState } from "react";\n' +
          '\n' +
          '// ===== 패턴 1: 상태 내리기 =====\n' +
          '\n' +
          '// ❌ Before: 상태가 너무 높은 곳에 있음\n' +
          'function AppBefore() {\n' +
          '  const [searchQuery, setSearchQuery] = useState("");\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />\n' +
          '      <ExpensiveChart />  {/* 검색과 무관한데 리렌더링됨 */}\n' +
          '      <ExpensiveTable />  {/* 검색과 무관한데 리렌더링됨 */}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ✅ After: 상태를 사용하는 곳으로 내림\n' +
          'function AppAfter() {\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <SearchInput />     {/* 상태가 여기에만 있음 */}\n' +
          '      <ExpensiveChart />  {/* 리렌더링 안 됨 */}\n' +
          '      <ExpensiveTable />  {/* 리렌더링 안 됨 */}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'function SearchInput() {\n' +
          '  const [query, setQuery] = useState("");\n' +
          '  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;\n' +
          '}\n' +
          '\n' +
          '// ===== 패턴 2: 컴포넌트 추출 =====\n' +
          '\n' +
          '// ❌ Before: 모든 것이 하나의 컴포넌트에\n' +
          'function PageBefore() {\n' +
          '  const [isHovered, setIsHovered] = useState(false);\n' +
          '  return (\n' +
          '    <div\n' +
          '      onMouseEnter={() => setIsHovered(true)}\n' +
          '      onMouseLeave={() => setIsHovered(false)}\n' +
          '      style={{ background: isHovered ? "#eee" : "#fff" }}\n' +
          '    >\n' +
          '      <ExpensiveChart />  {/* hover마다 리렌더링 */}\n' +
          '      <ExpensiveTable />  {/* hover마다 리렌더링 */}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ✅ After: 상태를 가진 부분만 추출\n' +
          'function PageAfter() {\n' +
          '  return (\n' +
          '    <HoverableWrapper>\n' +
          '      <ExpensiveChart />  {/* 리렌더링 안 됨 */}\n' +
          '      <ExpensiveTable />  {/* 리렌더링 안 됨 */}\n' +
          '    </HoverableWrapper>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'function HoverableWrapper({ children }: { children: React.ReactNode }) {\n' +
          '  const [isHovered, setIsHovered] = useState(false);\n' +
          '  return (\n' +
          '    <div\n' +
          '      onMouseEnter={() => setIsHovered(true)}\n' +
          '      onMouseLeave={() => setIsHovered(false)}\n' +
          '      style={{ background: isHovered ? "#eee" : "#fff" }}\n' +
          '    >\n' +
          '      {children}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ===== 패턴 3: 렌더 프로퍼티로 격리 =====\n' +
          'function ScrollTracker({ children }: {\n' +
          '  children: (scrollY: number) => React.ReactNode;\n' +
          '}) {\n' +
          '  const [scrollY, setScrollY] = useState(0);\n' +
          '  // scrollY를 필요로 하는 부분만 리렌더링\n' +
          '  return <div onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}>{children(scrollY)}</div>;\n' +
          '}\n' +
          '\n' +
          'function ExpensiveChart() {\n' +
          '  console.log("ExpensiveChart render");\n' +
          '  return <div>차트</div>;\n' +
          '}\n' +
          '\n' +
          'function ExpensiveTable() {\n' +
          '  console.log("ExpensiveTable render");\n' +
          '  return <div>테이블</div>;\n' +
          '}\n',
        description: "코드 구조(컴포지션)로 리렌더링을 격리하면 React.memo 없이도 성능을 최적화할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 핵심 아이디어 | React.memo 필요 |\n" +
        "|------|-------------|----------------|\n" +
        "| 상태 내리기 | 상태를 사용하는 곳으로 이동 | X |\n" +
        "| 컴포넌트 추출 | 자주 변하는 부분 분리 | X |\n" +
        "| Children as Props | children JSX 참조 유지 | X |\n" +
        "| 컴포지션 | 작은 단위 합성 | X |\n" +
        "| 상태 올리기 | 공유 데이터는 공통 부모로 | 상황에 따라 |\n\n" +
        "**핵심:** 가장 좋은 성능 최적화는 코드 구조 자체에서 나옵니다. React.memo나 useMemo는 마지막 수단이고, 먼저 컴포넌트 구조를 재설계하여 불필요한 리렌더링 자체를 없애는 것이 우선입니다.\n\n" +
        "**시리즈 마무리:** 렌더링 원리부터 성능 최적화 패턴까지, React의 내부 동작을 이해하고 효율적인 앱을 만드는 기반을 갖추었습니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "상태 내리기 패턴으로 리렌더링 범위를 줄일 수 있다",
    "children as props 패턴이 리렌더링을 방지하는 원리를 설명할 수 있다",
    "컴포넌트 추출로 리렌더링을 격리하는 방법을 알고 있다",
    "React.memo 없이 구조적으로 최적화하는 방법을 우선 적용할 수 있다",
    "상태를 올리기/내리기의 기준을 판단할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "children as props 패턴이 리렌더링을 방지하는 원리는?",
      choices: [
        "React.memo가 내부적으로 적용되어서",
        "children이 부모에서 생성된 JSX 참조로, 현재 컴포넌트의 리렌더링에도 참조가 변하지 않아서",
        "children은 렌더 단계에서 제외되어서",
        "children은 서버에서 렌더링되어서",
      ],
      correctIndex: 1,
      explanation: "children은 부모(한 단계 위) 컴포넌트에서 이미 생성된 JSX입니다. 현재 컴포넌트가 리렌더링되어도 children의 참조는 변하지 않으므로 재조정이 스킵됩니다.",
    },
    {
      id: "q2",
      question: "상태 내리기(Moving State Down) 패턴의 핵심은?",
      choices: [
        "모든 상태를 가장 하위 컴포넌트에 두기",
        "상태를 실제로 사용하는 컴포넌트로 이동하여 리렌더링 범위를 줄이기",
        "상태를 Context로 대체하기",
        "상태를 외부 스토어로 이동하기",
      ],
      correctIndex: 1,
      explanation: "상태를 실제로 필요한 곳으로 내리면 해당 상태 변경 시 영향받는 컴포넌트 범위가 줄어들어 불필요한 리렌더링을 방지합니다.",
    },
    {
      id: "q3",
      question: "다음 중 React.memo 없이 리렌더링을 최적화하는 패턴이 아닌 것은?",
      choices: [
        "상태 내리기",
        "children as props",
        "컴포넌트 추출",
        "shouldComponentUpdate 오버라이드",
      ],
      correctIndex: 3,
      explanation: "shouldComponentUpdate는 클래스 컴포넌트의 API로 구조적 최적화 패턴이 아닙니다. 나머지 세 가지는 컴포넌트 구조로 최적화하는 패턴입니다.",
    },
    {
      id: "q4",
      question: "컴포지션 패턴의 장점이 아닌 것은?",
      choices: [
        "각 컴포넌트가 독립적으로 업데이트된다",
        "코드 가독성이 향상된다",
        "모든 리렌더링이 완전히 제거된다",
        "React.memo 없이도 성능이 개선된다",
      ],
      correctIndex: 2,
      explanation: "컴포지션은 불필요한 리렌더링을 줄이지만, 모든 리렌더링을 제거하는 것은 불가능하며 그럴 필요도 없습니다.",
    },
    {
      id: "q5",
      question: "상태를 올려야 하는 경우는?",
      choices: [
        "컴포넌트 렌더링이 느릴 때",
        "여러 컴포넌트가 같은 데이터를 공유해야 할 때",
        "TypeScript 타입 추론이 안 될 때",
        "서버 컴포넌트를 사용할 때",
      ],
      correctIndex: 1,
      explanation: "형제 컴포넌트 간에 데이터를 공유해야 할 때, 가장 가까운 공통 부모로 상태를 올립니다. 필요 이상으로 올리지 않는 것이 핵심입니다.",
    },
    {
      id: "q6",
      question: "성능 최적화를 적용하는 올바른 우선순위는?",
      choices: [
        "React.memo → useMemo → 구조 변경",
        "구조 변경(컴포지션) → React.memo/useMemo → 가상화",
        "가상화 → 코드 스플리팅 → React.memo",
        "useMemo → useCallback → React.memo",
      ],
      correctIndex: 1,
      explanation: "먼저 컴포넌트 구조를 개선하고, 그래도 부족하면 메모이제이션 API를 적용하고, 대량 데이터는 가상화를 사용하는 것이 올바른 순서입니다.",
    },
  ],
};

export default chapter;
