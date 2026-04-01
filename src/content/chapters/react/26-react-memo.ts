import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "26-react-memo",
  subject: "react",
  title: "React.memo",
  description: "컴포넌트 메모이제이션, 얕은 비교, 커스텀 비교 함수, React.memo가 효과 없는 경우, 올바른 사용 시점을 이해합니다.",
  order: 26,
  group: "성능 최적화",
  prerequisites: ["25-understanding-rerender"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "React.memo는 택배 기사의 '변경 확인' 시스템과 비슷합니다.\n\n" +
        "매번 택배(리렌더링)가 올 때마다 상자를 열어 확인하는 대신, 송장(props)을 비교합니다. 이전 송장과 같으면 \"변경 없음, 스킵!\"하고 상자를 열지 않습니다.\n\n" +
        "하지만 주의할 점이 있습니다:\n" +
        "- 송장 비교 자체에도 비용이 듭니다 (얕은 비교)\n" +
        "- 송장에 적힌 주소가 같아 보여도 실제로는 새로 쓴 종이(새 객체 참조)일 수 있습니다\n" +
        "- 상자를 여는 비용이 적으면(가벼운 컴포넌트) 송장 비교가 오히려 낭비입니다",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "리렌더링을 방지하기 위해 React.memo를 사용하지만 기대처럼 동작하지 않는 경우가 많습니다.\n\n" +
        "1. **매번 새 객체/배열 props** — `<Child style={{ color: 'red' }} />`처럼 인라인 객체를 전달하면 매번 새 참조가 생겨 React.memo가 무력화됩니다.\n" +
        "2. **매번 새 함수 props** — `<Child onClick={() => doSomething()} />`도 마찬가지입니다.\n" +
        "3. **과도한 사용** — 모든 컴포넌트를 React.memo로 감싸면 비교 비용이 누적되고, 실제 성능 이점 없이 코드만 복잡해집니다.\n" +
        "4. **Context 무시** — React.memo로 감싸도 useContext를 통한 리렌더링은 방지할 수 없습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### React.memo 기본 동작\n" +
        "컴포넌트를 `React.memo()`로 감싸면 부모 리렌더링 시 props의 **얕은 비교(shallow comparison)**를 수행합니다. 모든 props가 이전과 같으면(Object.is) 리렌더링을 건너뜁니다.\n\n" +
        "### 얕은 비교의 한계\n" +
        "- 원시값(string, number, boolean)은 값으로 비교되어 잘 동작합니다.\n" +
        "- 객체, 배열, 함수는 **참조**로 비교됩니다. `{ a: 1 } !== { a: 1 }`입니다.\n" +
        "- useMemo로 객체/배열을, useCallback으로 함수를 메모이제이션하면 참조를 유지할 수 있습니다.\n\n" +
        "### 커스텀 비교 함수\n" +
        "`React.memo(Component, arePropsEqual)` 형태로 두 번째 인자에 비교 함수를 전달할 수 있습니다. true를 반환하면 리렌더링을 건너뜁니다.\n\n" +
        "### React.memo를 사용해야 하는 시점\n" +
        "1. 컴포넌트의 렌더링 비용이 높은 경우\n" +
        "2. 같은 props로 자주 리렌더링되는 경우\n" +
        "3. 부모가 자주 리렌더링되지만 자식 props는 안정적인 경우",
    },
    {
      type: "pseudocode",
      title: "기술 구현: React.memo 내부 동작",
      content:
        "React.memo가 내부적으로 어떻게 동작하는지 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// React.memo 내부 동작 의사코드\n' +
          '\n' +
          'function memo<P extends Record<string, unknown>>(\n' +
          '  Component: (props: P) => ReactNode,\n' +
          '  arePropsEqual?: (prevProps: P, nextProps: P) => boolean\n' +
          '): (props: P) => ReactNode {\n' +
          '  let prevProps: P | null = null;\n' +
          '  let prevResult: ReactNode = null;\n' +
          '\n' +
          '  return function MemoizedComponent(nextProps: P): ReactNode {\n' +
          '    // 최초 렌더링이면 무조건 실행\n' +
          '    if (prevProps === null) {\n' +
          '      prevProps = nextProps;\n' +
          '      prevResult = Component(nextProps);\n' +
          '      return prevResult;\n' +
          '    }\n' +
          '\n' +
          '    // 비교 함수 사용 (기본: 얕은 비교)\n' +
          '    const compare = arePropsEqual ?? shallowEqual;\n' +
          '    const propsAreEqual = compare(prevProps, nextProps);\n' +
          '\n' +
          '    if (propsAreEqual) {\n' +
          '      // props가 같으면 이전 결과 재사용 → 리렌더링 스킵\n' +
          '      return prevResult;\n' +
          '    }\n' +
          '\n' +
          '    // props가 다르면 리렌더링\n' +
          '    prevProps = nextProps;\n' +
          '    prevResult = Component(nextProps);\n' +
          '    return prevResult;\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          '// 얕은 비교: 각 prop을 Object.is로 비교\n' +
          'function shallowEqual(prev: Record<string, unknown>, next: Record<string, unknown>): boolean {\n' +
          '  const prevKeys = Object.keys(prev);\n' +
          '  const nextKeys = Object.keys(next);\n' +
          '  if (prevKeys.length !== nextKeys.length) return false;\n' +
          '\n' +
          '  for (const key of prevKeys) {\n' +
          '    if (!Object.is(prev[key], next[key])) return false;\n' +
          '  }\n' +
          '  return true;\n' +
          '}\n',
        description: "React.memo는 props를 얕은 비교하여 같으면 이전 렌더링 결과를 재사용합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: React.memo 올바른 사용",
      content:
        "React.memo가 효과 있는 경우와 없는 경우를 비교합니다.",
      code: {
        language: "typescript",
        code:
          'import { memo, useState, useCallback, useMemo } from "react";\n' +
          '\n' +
          '// ❌ React.memo가 무력화되는 경우\n' +
          'function BadParent() {\n' +
          '  const [count, setCount] = useState(0);\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <button onClick={() => setCount((c) => c + 1)}>+</button>\n' +
          '      {/* 매 렌더링마다 새 객체와 새 함수가 생성됨 */}\n' +
          '      <MemoizedChild\n' +
          '        style={{ color: "red" }}        // 새 객체 참조\n' +
          '        onClick={() => console.log("x")} // 새 함수 참조\n' +
          '      />\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ✅ React.memo가 제대로 동작하는 경우\n' +
          'function GoodParent() {\n' +
          '  const [count, setCount] = useState(0);\n' +
          '\n' +
          '  // useMemo로 객체 참조 유지\n' +
          '  const style = useMemo(() => ({ color: "red" }), []);\n' +
          '\n' +
          '  // useCallback으로 함수 참조 유지\n' +
          '  const handleClick = useCallback(() => {\n' +
          '    console.log("clicked");\n' +
          '  }, []);\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <button onClick={() => setCount((c) => c + 1)}>+</button>\n' +
          '      <MemoizedChild style={style} onClick={handleClick} />\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// React.memo로 감싼 컴포넌트\n' +
          'const MemoizedChild = memo(function Child({\n' +
          '  style,\n' +
          '  onClick,\n' +
          '}: {\n' +
          '  style: { color: string };\n' +
          '  onClick: () => void;\n' +
          '}) {\n' +
          '  console.log("Child 렌더링");\n' +
          '  return (\n' +
          '    <div style={style}>\n' +
          '      <button onClick={onClick}>클릭</button>\n' +
          '    </div>\n' +
          '  );\n' +
          '});\n' +
          '\n' +
          '// 커스텀 비교 함수\n' +
          'interface HeavyListProps {\n' +
          '  items: { id: string; text: string }[];\n' +
          '  selectedId: string;\n' +
          '}\n' +
          '\n' +
          'const HeavyList = memo(\n' +
          '  function HeavyList({ items, selectedId }: HeavyListProps) {\n' +
          '    console.log("HeavyList 렌더링");\n' +
          '    return (\n' +
          '      <ul>\n' +
          '        {items.map((item) => (\n' +
          '          <li key={item.id} data-selected={item.id === selectedId}>\n' +
          '            {item.text}\n' +
          '          </li>\n' +
          '        ))}\n' +
          '      </ul>\n' +
          '    );\n' +
          '  },\n' +
          '  (prev, next) => {\n' +
          '    // items 배열의 길이와 selectedId만 비교 (깊은 비교 회피)\n' +
          '    return (\n' +
          '      prev.items.length === next.items.length &&\n' +
          '      prev.selectedId === next.selectedId &&\n' +
          '      prev.items === next.items\n' +
          '    );\n' +
          '  }\n' +
          ');\n',
        description: "React.memo는 useMemo/useCallback과 함께 사용해야 효과적입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 상황 | React.memo 효과 |\n" +
        "|------|----------------|\n" +
        "| 원시값 props만 있는 경우 | 효과적 |\n" +
        "| 인라인 객체/함수 props | 무력화 (useMemo/useCallback 필요) |\n" +
        "| useContext 사용 | 무력화 (Context 변경은 방지 불가) |\n" +
        "| 가벼운 컴포넌트 | 비교 비용이 오히려 낭비 |\n" +
        "| 무거운 + 자주 리렌더링 | 가장 효과적 |\n\n" +
        "**핵심:** React.memo는 '이 컴포넌트는 props가 같으면 같은 결과를 반환한다'고 React에 알리는 것입니다. 하지만 props의 참조 안정성이 보장되지 않으면 효과가 없습니다.\n\n" +
        "**다음 챕터 미리보기:** React Compiler가 이 모든 메모이제이션을 자동으로 처리하는 미래를 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "React.memo의 얕은 비교 동작을 설명할 수 있다",
    "인라인 객체/함수가 React.memo를 무력화하는 이유를 이해한다",
    "useMemo/useCallback과 React.memo의 관계를 설명할 수 있다",
    "커스텀 비교 함수의 사용 시점을 알고 있다",
    "React.memo를 사용하지 말아야 하는 경우를 판별할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "React.memo의 기본 비교 방식은?",
      choices: [
        "깊은 비교 (deep equality)",
        "얕은 비교 (shallow equality with Object.is)",
        "JSON.stringify 비교",
        "참조 동등성만 비교 (===)",
      ],
      correctIndex: 1,
      explanation: "React.memo는 각 prop을 Object.is로 비교하는 얕은 비교를 사용합니다. 객체 내부는 비교하지 않습니다.",
    },
    {
      id: "q2",
      question: "React.memo로 감싼 컴포넌트에 인라인 객체를 props로 전달하면?",
      choices: [
        "정상적으로 메모이제이션된다",
        "에러가 발생한다",
        "매번 새 참조이므로 메모이제이션이 무력화된다",
        "깊은 비교로 자동 전환된다",
      ],
      correctIndex: 2,
      explanation: "인라인 객체는 매 렌더링마다 새로 생성되므로 참조가 달라집니다. 얕은 비교에서 다른 것으로 판단되어 리렌더링이 발생합니다.",
    },
    {
      id: "q3",
      question: "React.memo로 감싼 컴포넌트가 useContext를 사용하면?",
      choices: [
        "Context 변경도 메모이제이션으로 방지된다",
        "Context 변경 시 React.memo와 무관하게 리렌더링된다",
        "에러가 발생한다",
        "Context를 사용할 수 없다",
      ],
      correctIndex: 1,
      explanation: "Context 변경은 React.memo의 props 비교를 우회하여 직접 리렌더링을 트리거합니다.",
    },
    {
      id: "q4",
      question: "모든 컴포넌트를 React.memo로 감싸는 것이 좋지 않은 이유는?",
      choices: [
        "메모리 사용량이 급격히 증가해서",
        "비교 비용이 추가되고, 가벼운 컴포넌트에서는 오히려 낭비",
        "TypeScript 타입 추론이 안 돼서",
        "서버 컴포넌트에서 사용할 수 없어서",
      ],
      correctIndex: 1,
      explanation: "모든 렌더링마다 props 비교가 추가됩니다. 가벼운 컴포넌트는 그냥 렌더링하는 것이 비교하는 것보다 빠를 수 있습니다.",
    },
    {
      id: "q5",
      question: "React.memo의 두 번째 인자(커스텀 비교 함수)가 true를 반환하면?",
      choices: [
        "컴포넌트가 리렌더링된다",
        "컴포넌트의 리렌더링이 건너뛰어진다",
        "에러가 발생한다",
        "기본 얕은 비교로 fallback된다",
      ],
      correctIndex: 1,
      explanation: "커스텀 비교 함수가 true를 반환하면 'props가 같다'는 의미이므로 리렌더링을 건너뜁니다.",
    },
  ],
};

export default chapter;
