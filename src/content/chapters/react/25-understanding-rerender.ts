import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "25-understanding-rerender",
  subject: "react",
  title: "리렌더링 이해하기",
  description: "리렌더링 트리거 조건, props 변경 vs 부모 리렌더링, state 변경과 리렌더링, 불필요한 리렌더링 판별법을 이해합니다.",
  order: 25,
  group: "성능 최적화",
  prerequisites: ["24-server-components"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "리렌더링은 학교의 출석 확인과 비슷합니다.\n\n" +
        "담임선생님(부모 컴포넌트)이 출석을 부르면 반 전체 학생(자식 컴포넌트)이 응답해야 합니다. 실제로 자리를 바꾼 학생이 없더라도 모두 확인 과정을 거칩니다.\n\n" +
        "React에서 부모가 리렌더링되면 **모든 자식이 리렌더링**됩니다. 이것은 props가 변경되었기 때문이 아니라, \"부모가 리렌더링되면 자식도 리렌더링한다\"는 React의 기본 규칙 때문입니다.\n\n" +
        "이 출석 확인이 낭비인지 아닌지 판단하는 것이 성능 최적화의 첫 걸음입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "리렌더링에 대한 흔한 오해가 성능 문제를 만듭니다.\n\n" +
        "1. **오해: props가 변경되어야 리렌더링된다** — 실제로는 부모가 리렌더링되면 props 변경 여부와 무관하게 자식도 리렌더링됩니다.\n" +
        "2. **오해: 모든 리렌더링은 나쁘다** — 리렌더링 자체는 React의 정상 동작입니다. 문제는 '불필요하게 비싼' 리렌더링입니다.\n" +
        "3. **과잉 최적화** — 실제 성능 문제 없이 모든 곳에 React.memo를 붙이면 오히려 코드가 복잡해지고 비교 비용이 추가됩니다.\n" +
        "4. **트리거 조건 혼동** — state 변경, context 변경, 부모 리렌더링 중 어떤 것이 실제 원인인지 파악하지 못합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 리렌더링 트리거 3가지\n" +
        "1. **State 변경** — `setState`가 호출되면 해당 컴포넌트가 리렌더링됩니다.\n" +
        "2. **부모 리렌더링** — 부모가 리렌더링되면 모든 자식이 리렌더링됩니다 (props 변경 무관).\n" +
        "3. **Context 변경** — 구독 중인 Context의 값이 변경되면 해당 소비자가 리렌더링됩니다.\n\n" +
        "### 리렌더링 ≠ DOM 업데이트\n" +
        "리렌더링은 컴포넌트 함수를 다시 호출하는 것입니다. 결과가 이전과 같으면 실제 DOM 변경은 일어나지 않습니다(재조정에서 걸러짐). 따라서 리렌더링 자체는 생각보다 저렴합니다.\n\n" +
        "### 불필요한 리렌더링 판별 기준\n" +
        "- 컴포넌트 함수 실행이 **비싼 계산**을 포함하는가?\n" +
        "- 리렌더링이 **빈번하게** 발생하는가? (예: 매 키 입력마다)\n" +
        "- 리렌더링되는 **컴포넌트 수**가 많은가?\n" +
        "이 세 가지 중 하나라도 해당되면 최적화를 고려하세요.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 리렌더링 판단 로직",
      content:
        "React 내부에서 컴포넌트를 리렌더링할지 결정하는 로직을 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// React 리렌더링 판단 의사코드\n' +
          '\n' +
          'function shouldComponentUpdate(fiber: FiberNode): boolean {\n' +
          '  // 1. 자체 state가 변경됨\n' +
          '  if (fiber.hasStateChange) {\n' +
          '    return true; // 무조건 리렌더링\n' +
          '  }\n' +
          '\n' +
          '  // 2. 부모가 리렌더링됨\n' +
          '  if (fiber.parent.isRerendering) {\n' +
          '    // React.memo가 없으면 → 무조건 리렌더링\n' +
          '    if (!fiber.isMemoized) {\n' +
          '      return true;\n' +
          '    }\n' +
          '    // React.memo가 있으면 → 얕은 비교\n' +
          '    return !shallowEqual(fiber.prevProps, fiber.nextProps);\n' +
          '  }\n' +
          '\n' +
          '  // 3. 구독 중인 Context가 변경됨\n' +
          '  if (fiber.subscribedContexts.some(ctx => ctx.hasChanged)) {\n' +
          '    return true; // React.memo와 무관하게 리렌더링\n' +
          '  }\n' +
          '\n' +
          '  return false;\n' +
          '}\n' +
          '\n' +
          '// 얕은 비교 (React.memo가 사용)\n' +
          'function shallowEqual(\n' +
          '  prev: Record<string, unknown>,\n' +
          '  next: Record<string, unknown>\n' +
          '): boolean {\n' +
          '  const prevKeys = Object.keys(prev);\n' +
          '  const nextKeys = Object.keys(next);\n' +
          '\n' +
          '  if (prevKeys.length !== nextKeys.length) return false;\n' +
          '\n' +
          '  for (const key of prevKeys) {\n' +
          '    // 참조 동등성 비교 (Object.is)\n' +
          '    if (!Object.is(prev[key], next[key])) return false;\n' +
          '  }\n' +
          '  return true;\n' +
          '}\n',
        description: "React.memo가 없으면 부모 리렌더링 시 자식은 무조건 리렌더링됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 리렌더링 추적하기",
      content:
        "리렌더링이 발생하는 경우와 발생하지 않는 경우를 확인합니다.",
      code: {
        language: "typescript",
        code:
          'import { useState } from "react";\n' +
          '\n' +
          '// 리렌더링 추적용 카운터\n' +
          'let childRenderCount = 0;\n' +
          '\n' +
          '// ❌ 부모 리렌더링 → 자식도 리렌더링 (props 무관)\n' +
          'function Parent() {\n' +
          '  const [count, setCount] = useState(0);\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <button onClick={() => setCount((c) => c + 1)}>count: {count}</button>\n' +
          '      {/* Child는 props가 없는데도 매번 리렌더링됨! */}\n' +
          '      <Child />\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'function Child() {\n' +
          '  childRenderCount++;\n' +
          '  console.log("Child 렌더링 횟수:", childRenderCount);\n' +
          '  return <p>나는 자식입니다</p>;\n' +
          '}\n' +
          '\n' +
          '// ✅ state를 사용하는 컴포넌트만 리렌더링되는 패턴\n' +
          'function OptimizedParent() {\n' +
          '  return (\n' +
          '    <div>\n' +
          '      {/* Counter만 리렌더링, ExpensiveChild는 리렌더링 안 됨 */}\n' +
          '      <Counter />\n' +
          '      <ExpensiveChild />\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'function Counter() {\n' +
          '  const [count, setCount] = useState(0);\n' +
          '  return <button onClick={() => setCount((c) => c + 1)}>count: {count}</button>;\n' +
          '}\n' +
          '\n' +
          'function ExpensiveChild() {\n' +
          '  console.log("ExpensiveChild 렌더링"); // 부모가 리렌더링 안 되므로 1번만 호출\n' +
          '  return <p>비싼 계산 결과</p>;\n' +
          '}\n' +
          '\n' +
          '// Context 변경에 의한 리렌더링\n' +
          'import { createContext, useContext } from "react";\n' +
          '\n' +
          'const ThemeContext = createContext("light");\n' +
          '\n' +
          'function ThemedButton() {\n' +
          '  const theme = useContext(ThemeContext);\n' +
          '  // ThemeContext 값이 변경되면 React.memo와 무관하게 리렌더링\n' +
          '  return <button className={theme}>테마 버튼</button>;\n' +
          '}\n',
        description: "리렌더링의 실제 원인을 파악하는 것이 최적화의 첫 걸음입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 트리거 | 조건 | React.memo로 방지 가능? |\n" +
        "|--------|------|------------------------|\n" +
        "| State 변경 | setState 호출 | X (자기 자신) |\n" +
        "| 부모 리렌더링 | 부모 함수 재실행 | O |\n" +
        "| Context 변경 | 구독 중인 값 변경 | X |\n\n" +
        "**핵심:** 리렌더링 자체는 React의 정상 동작이며, DOM 업데이트와는 별개입니다. '모든 리렌더링을 방지'가 아니라 '비싸고 불필요한 리렌더링'만 식별하여 최적화하세요.\n\n" +
        "**다음 챕터 미리보기:** 불필요한 리렌더링을 방지하는 첫 번째 도구인 React.memo를 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "리렌더는 state가 변경되거나 부모가 리렌더될 때 발생한다. 리렌더 자체는 나쁜 것이 아니다 — React가 빠르게 처리하도록 설계되었으며, 진짜 병목만 최적화하면 된다.",
  checklist: [
    "리렌더링의 3가지 트리거를 설명할 수 있다",
    "부모 리렌더링 시 자식이 리렌더링되는 이유를 이해한다",
    "리렌더링과 DOM 업데이트의 차이를 설명할 수 있다",
    "불필요한 리렌더링의 판별 기준을 알고 있다",
    "Context 변경이 React.memo를 무시하는 이유를 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "부모 컴포넌트가 리렌더링될 때 자식 컴포넌트가 리렌더링되는 조건은?",
      choices: [
        "자식의 props가 변경되었을 때만",
        "자식의 state가 변경되었을 때만",
        "항상 (React.memo가 없다면)",
        "자식이 Context를 사용할 때만",
      ],
      correctIndex: 2,
      explanation: "React의 기본 동작은 부모가 리렌더링되면 모든 자식도 리렌더링하는 것입니다. React.memo로 감싸야 props 비교를 통해 방지할 수 있습니다.",
    },
    {
      id: "q2",
      question: "리렌더링이 발생했지만 실제 DOM 변경이 일어나지 않는 경우는?",
      choices: [
        "없다. 리렌더링은 항상 DOM을 변경한다",
        "이전 렌더링과 결과가 동일할 때",
        "컴포넌트가 null을 반환할 때만",
        "useEffect가 없을 때",
      ],
      correctIndex: 1,
      explanation: "리렌더링은 컴포넌트 함수를 호출하는 것이고, 재조정(Diffing)에서 변경이 없으면 실제 DOM 조작은 발생하지 않습니다.",
    },
    {
      id: "q3",
      question: "다음 중 리렌더링의 트리거가 아닌 것은?",
      choices: [
        "setState 호출",
        "props 객체의 참조 변경",
        "부모 컴포넌트의 리렌더링",
        "구독 중인 Context 값 변경",
      ],
      correctIndex: 1,
      explanation: "props 자체의 참조 변경은 직접적인 트리거가 아닙니다. 부모가 리렌더링되어 새 props를 전달하는 것이 실제 트리거입니다.",
    },
    {
      id: "q4",
      question: "Context 값이 변경되면 React.memo로 감싼 컴포넌트는?",
      choices: [
        "리렌더링되지 않는다",
        "props가 변경된 경우에만 리렌더링된다",
        "해당 Context를 구독하고 있다면 무조건 리렌더링된다",
        "에러가 발생한다",
      ],
      correctIndex: 2,
      explanation: "Context 변경은 React.memo의 얕은 비교를 우회합니다. 구독 중인 Context 값이 바뀌면 무조건 리렌더링됩니다.",
    },
    {
      id: "q5",
      question: "불필요한 리렌더링 최적화가 필요한 경우가 아닌 것은?",
      choices: [
        "컴포넌트에 무거운 계산이 있고 빈번히 리렌더링될 때",
        "수백 개의 리스트 아이템이 매번 리렌더링될 때",
        "단순한 텍스트 컴포넌트가 가끔 리렌더링될 때",
        "매 키 입력마다 무거운 차트 컴포넌트가 리렌더링될 때",
      ],
      correctIndex: 2,
      explanation: "단순한 컴포넌트의 가끔 있는 리렌더링은 거의 비용이 들지 않습니다. 최적화의 복잡성 대비 이점이 없습니다.",
    },
  ],
};

export default chapter;
