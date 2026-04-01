import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "11-usememo-usecallback",
  subject: "react",
  title: "useMemo와 useCallback: 메모이제이션",
  description: "useMemo와 useCallback으로 불필요한 연산과 리렌더링을 방지하고, React Compiler 시대의 메모이제이션 전략을 재고합니다.",
  order: 11,
  group: "Hooks 심화",
  prerequisites: ["10-useref"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "메모이제이션은 **요리 레시피 메모**와 같습니다.\n\n" +
        "**useMemo**는 완성된 요리를 냉장고에 보관하는 것입니다. 같은 재료(의존성)로 만든 요리가 이미 있으면 다시 만들지 않고 냉장고에서 꺼냅니다. 재료가 바뀌면 새로 요리합니다.\n\n" +
        "**useCallback**은 레시피 카드 자체를 보관하는 것입니다. 같은 레시피를 매번 새로 쓰지 않고, 기존 카드를 재사용합니다. 레시피 내용(의존성)이 바뀔 때만 새 카드를 씁니다.\n\n" +
        "**React Compiler**는 AI 주방 보조와 같습니다. 셰프(개발자)가 직접 '이건 냉장고에 넣어둬'라고 지시하지 않아도, 보조가 자동으로 판단하여 최적화합니다. Compiler 시대에는 수동 메모이제이션이 크게 줄어들 전망입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React에서 컴포넌트가 리렌더링되면 함수 본문이 다시 실행됩니다. 이때 두 가지 성능 문제가 발생할 수 있습니다:\n\n" +
        "1. **비용이 큰 계산 반복** — 정렬, 필터링, 복잡한 변환 로직이 매 렌더링마다 재실행\n" +
        "2. **참조 동일성 깨짐** — 매번 새로운 함수/객체가 생성되어 자식 컴포넌트가 불필요하게 리렌더링\n\n" +
        "특히 두 번째 문제는 미묘합니다:\n" +
        "- `React.memo`로 감싼 자식이 있어도, 부모에서 매번 새 함수를 prop으로 내려보내면 memo가 무용지물\n" +
        "- useEffect의 의존성에 함수를 넣으면 매 렌더링마다 이펙트가 재실행\n\n" +
        "하지만 이 Hook들을 **남용**하면 오히려 메모리 사용량이 늘고 코드 복잡성만 증가합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### useMemo — 값 메모이제이션\n" +
        "`useMemo(() => computeValue(a, b), [a, b])`\n" +
        "의존성이 변경될 때만 함수를 재실행하고, 그렇지 않으면 이전 결과를 반환합니다.\n\n" +
        "### useCallback — 함수 메모이제이션\n" +
        "`useCallback(fn, [a, b])`는 사실 `useMemo(() => fn, [a, b])`와 동일합니다.\n" +
        "함수 자체의 참조를 유지하여 자식 컴포넌트의 불필요한 리렌더링을 방지합니다.\n\n" +
        "### 사용 기준\n" +
        "- useMemo: 계산 비용이 **실제로** 높을 때 (대량 데이터 정렬/필터)\n" +
        "- useCallback: `React.memo` 자식에 함수를 전달할 때, useEffect 의존성에 함수가 있을 때\n\n" +
        "### React Compiler의 영향\n" +
        "React Compiler(React Forget)가 안정화되면 컴파일 타임에 자동으로 메모이제이션을 적용합니다. 이는 수동 useMemo/useCallback의 필요성을 크게 줄입니다.\n" +
        "- Compiler는 값이 변하지 않았음을 정적 분석으로 판단\n" +
        "- 개발자가 의존성 배열을 직접 관리할 필요 없음\n" +
        "- 현재(React 19) 실험적 기능이며 점진적 도입 중",
    },
    {
      type: "pseudocode",
      title: "기술 구현: useMemo와 useCallback 내부 동작",
      content:
        "두 Hook의 내부 동작과 React Compiler가 어떤 역할을 하는지 의사코드로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// useMemo 내부 동작 (의사코드)\n' +
          'function useMemo<T>(factory: () => T, deps: unknown[]): T {\n' +
          '  const hook = getCurrentHook<{ value: T; deps: unknown[] }>();\n' +
          '\n' +
          '  if (isFirstRender()) {\n' +
          '    hook.value = factory();\n' +
          '    hook.deps = deps;\n' +
          '    return hook.value;\n' +
          '  }\n' +
          '\n' +
          '  if (!shallowEqual(hook.deps, deps)) {\n' +
          '    // 의존성 변경 → 재계산\n' +
          '    hook.value = factory();\n' +
          '    hook.deps = deps;\n' +
          '  }\n' +
          '  return hook.value;\n' +
          '}\n' +
          '\n' +
          '// useCallback은 useMemo의 축약형\n' +
          'function useCallback<T extends Function>(fn: T, deps: unknown[]): T {\n' +
          '  return useMemo(() => fn, deps);\n' +
          '}\n' +
          '\n' +
          '// React Compiler가 하는 일 (개념적)\n' +
          '// 개발자가 작성한 코드:\n' +
          'function TodoList({ todos, filter }: Props) {\n' +
          '  const filtered = todos.filter(t => t.status === filter);\n' +
          '  const handleClick = (id: string) => { /* ... */ };\n' +
          '  return <List items={filtered} onClick={handleClick} />;\n' +
          '}\n' +
          '\n' +
          '// Compiler가 변환한 코드 (개념적):\n' +
          'function TodoList({ todos, filter }: Props) {\n' +
          '  const filtered = $cache(\n' +
          '    () => todos.filter(t => t.status === filter),\n' +
          '    [todos, filter]\n' +
          '  );\n' +
          '  const handleClick = $cache(\n' +
          '    (id: string) => { /* ... */ },\n' +
          '    [] // 외부 의존성 없음을 정적 분석으로 판단\n' +
          '  );\n' +
          '  return <List items={filtered} onClick={handleClick} />;\n' +
          '}',
        description: "useCallback은 useMemo의 축약형이며, React Compiler는 이런 최적화를 자동으로 수행합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 메모이제이션 실전 패턴",
      content:
        "언제 메모이제이션이 필요하고 불필요한지 예제로 확인합니다.",
      code: {
        language: "typescript",
        code:
          'import { useMemo, useCallback, memo, useState } from "react";\n' +
          '\n' +
          '// ✅ 올바른 사용: 비용 큰 계산 메모이제이션\n' +
          'function ProductList({ products, query }: {\n' +
          '  products: Product[];\n' +
          '  query: string;\n' +
          '}) {\n' +
          '  const filtered = useMemo(\n' +
          '    () => products\n' +
          '      .filter(p => p.name.includes(query))\n' +
          '      .sort((a, b) => a.price - b.price),\n' +
          '    [products, query]\n' +
          '  );\n' +
          '\n' +
          '  return <ul>{filtered.map(p => <li key={p.id}>{p.name}</li>)}</ul>;\n' +
          '}\n' +
          '\n' +
          '// ✅ 올바른 사용: memo 자식에 콜백 전달\n' +
          'const ExpensiveChild = memo(function ExpensiveChild({\n' +
          '  onClick,\n' +
          '}: {\n' +
          '  onClick: () => void;\n' +
          '}) {\n' +
          '  return <button onClick={onClick}>클릭</button>;\n' +
          '});\n' +
          '\n' +
          'function Parent() {\n' +
          '  const [count, setCount] = useState(0);\n' +
          '\n' +
          '  const handleClick = useCallback(() => {\n' +
          '    console.log("clicked");\n' +
          '  }, []); // count와 무관하므로 빈 배열\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <span>{count}</span>\n' +
          '      <button onClick={() => setCount(c => c + 1)}>+</button>\n' +
          '      <ExpensiveChild onClick={handleClick} />\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ❌ 남용 예시: 단순한 계산에 useMemo\n' +
          'function BadExample({ a, b }: { a: number; b: number }) {\n' +
          '  // 덧셈은 useMemo 오버헤드보다 빠름\n' +
          '  const sum = useMemo(() => a + b, [a, b]); // 불필요\n' +
          '  const sum2 = a + b; // 이게 더 나음\n' +
          '  return <span>{sum} {sum2}</span>;\n' +
          '}',
        description: "useMemo는 비용 큰 계산에, useCallback은 memo된 자식에 함수를 전달할 때 사용합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| Hook | 메모이제이션 대상 | 사용 시점 |\n" +
        "|------|----------------|----------|\n" +
        "| useMemo | 계산 결과(값) | 비용 큰 연산, 참조 동일성 유지 |\n" +
        "| useCallback | 함수 참조 | memo 자식에 콜백 전달, useEffect 의존성 |\n\n" +
        "**사용 기준 체크리스트:**\n" +
        "1. 성능 문제가 **실제로** 측정되었는가?\n" +
        "2. `React.memo`로 감싼 자식에 전달하는 값/함수인가?\n" +
        "3. 계산 비용이 메모이제이션 오버헤드보다 큰가?\n\n" +
        "**React Compiler 시대:** 수동 메모이제이션은 점차 불필요해질 전망입니다. Compiler가 안정화되면 useMemo/useCallback 없이도 동일한 최적화가 자동으로 적용됩니다.\n\n" +
        "**다음 챕터 미리보기:** useReducer로 복잡한 상태 로직을 체계적으로 관리하는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "useMemo는 계산 결과를, useCallback은 함수 참조를 메모이제이션한다. 성능 문제가 측정된 후에만 적용하라 — 무분별한 메모이제이션은 오히려 복잡성만 늘린다.",
  checklist: [
    "useMemo와 useCallback의 차이를 설명할 수 있다",
    "참조 동일성이 React.memo와 어떻게 연관되는지 설명할 수 있다",
    "메모이제이션이 불필요한 경우를 판별할 수 있다",
    "React Compiler가 메모이제이션에 미치는 영향을 설명할 수 있다",
    "useCallback이 useMemo의 축약형임을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "useCallback(fn, deps)은 다음 중 어떤 것과 동일한가?",
      choices: [
        "useMemo(fn, deps)",
        "useMemo(() => fn, deps)",
        "useRef(fn)",
        "useEffect(() => fn, deps)",
      ],
      correctIndex: 1,
      explanation: "useCallback(fn, deps)은 useMemo(() => fn, deps)와 동일합니다. 함수 자체를 메모이제이션하는 것입니다.",
    },
    {
      id: "q2",
      question: "다음 중 useMemo 사용이 적절한 경우는?",
      choices: [
        "두 숫자의 덧셈",
        "10,000개 항목의 필터링과 정렬",
        "문자열 합치기",
        "boolean 값 반전",
      ],
      correctIndex: 1,
      explanation: "단순 연산은 useMemo의 오버헤드(의존성 비교, 이전 값 저장)가 더 클 수 있습니다. 대량 데이터 처리 같은 비용 큰 연산에만 사용해야 합니다.",
    },
    {
      id: "q3",
      question: "React.memo 자식에 useCallback 없이 함수를 전달하면?",
      choices: [
        "에러가 발생한다",
        "자식이 매 렌더링마다 리렌더링된다",
        "자식이 리렌더링되지 않는다",
        "함수가 undefined로 전달된다",
      ],
      correctIndex: 1,
      explanation: "부모가 리렌더링되면 함수가 새로 생성되어 참조가 달라집니다. React.memo는 props를 얕게 비교하므로 참조가 다르면 리렌더링됩니다.",
    },
    {
      id: "q4",
      question: "React Compiler가 안정화되면 useMemo/useCallback은?",
      choices: [
        "사용이 금지된다",
        "수동 사용의 필요성이 크게 줄어든다",
        "성능이 더 나빠진다",
        "아무 변화 없다",
      ],
      correctIndex: 1,
      explanation: "React Compiler는 컴파일 타임에 자동으로 메모이제이션을 적용합니다. 수동으로 useMemo/useCallback을 쓸 필요가 크게 줄어듭니다.",
    },
    {
      id: "q5",
      question: "useMemo의 의존성 배열이 빈 배열([])이면?",
      choices: [
        "매 렌더링마다 재계산한다",
        "마운트 시 한 번만 계산하고 이후 같은 값 반환",
        "값이 undefined가 된다",
        "에러가 발생한다",
      ],
      correctIndex: 1,
      explanation: "빈 의존성 배열은 '변경되는 의존성 없음'을 의미하므로 마운트 시 한 번만 계산하고 같은 값을 계속 반환합니다.",
    },
  ],
};

export default chapter;
