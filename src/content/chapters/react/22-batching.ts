import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "22-batching",
  subject: "react",
  title: "Batching과 자동 배칭",
  description: "React 18+ 자동 배칭, setTimeout/Promise 내 배칭, flushSync, 상태 업데이트 병합 원리를 이해합니다.",
  order: 22,
  group: "렌더링 원리",
  prerequisites: ["21-render-commit-phases"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "배칭은 택배 배송과 비슷합니다.\n\n" +
        "온라인 쇼핑에서 물건 3개를 따로 주문하면 택배 3번이 옵니다. 하지만 장바구니에 담아서 한 번에 주문하면 택배 1번으로 끝납니다.\n\n" +
        "React의 **배칭(Batching)**도 마찬가지입니다. `setState`를 3번 호출하면 리렌더링이 3번 일어나야 할 것 같지만, React는 이를 모아서 한 번의 리렌더링으로 처리합니다.\n\n" +
        "React 17까지는 이벤트 핸들러 안에서만 이 '묶음 배송'이 가능했지만, **React 18의 자동 배칭**은 setTimeout, Promise, 네이티브 이벤트 등 어디서든 묶음 배송을 해줍니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "상태 업데이트마다 렌더링이 발생하면 성능 문제가 생깁니다.\n\n" +
        "1. **불필요한 중간 렌더링** — `setCount(1)` 후 `setFlag(true)`를 호출하면, 둘 사이의 중간 상태({count: 1, flag: false})로 렌더링하는 것은 낭비입니다.\n" +
        "2. **일관성 없는 UI** — 관련된 상태 두 개가 한 번에 반영되지 않으면 사용자가 불완전한 화면을 볼 수 있습니다.\n" +
        "3. **React 17의 제한** — 이벤트 핸들러 밖(setTimeout, fetch then, 네이티브 이벤트)에서는 배칭이 적용되지 않아 각 setState마다 리렌더링이 발생했습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### React 18 자동 배칭 (Automatic Batching)\n" +
        "React 18부터 `createRoot`를 사용하면 **모든 상태 업데이트가 자동으로 배칭**됩니다. setTimeout, Promise.then, 네이티브 이벤트 핸들러 안에서도 여러 setState가 하나의 렌더링으로 합쳐집니다.\n\n" +
        "### 배칭의 원리\n" +
        "React는 상태 업데이트를 큐에 쌓고, 현재 실행 컨텍스트가 끝날 때 한꺼번에 처리합니다. 마이크로태스크 큐를 활용하여 동기 코드 블록이 끝나면 일괄 처리합니다.\n\n" +
        "### flushSync로 배칭 해제\n" +
        "드물지만 즉시 DOM에 반영해야 하는 경우 `flushSync`를 사용해 배칭을 해제할 수 있습니다. 예: DOM 측정이 중간에 필요한 경우.\n\n" +
        "### 같은 상태의 연속 업데이트\n" +
        "`setState(count + 1)`을 연속 호출하면 마지막 값만 반영됩니다. 이전 값에 기반한 업데이트는 함수형 업데이트(`setState(prev => prev + 1)`)를 사용해야 합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 배칭 메커니즘 의사코드",
      content:
        "React 내부에서 상태 업데이트가 큐잉되고 배칭되는 과정을 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// 배칭 메커니즘 의사코드\n' +
          '\n' +
          'const updateQueue: StateUpdate[] = [];\n' +
          'let isBatchingScheduled = false;\n' +
          '\n' +
          'function setState<T>(fiber: FiberNode, update: T | ((prev: T) => T)) {\n' +
          '  // 1. 업데이트를 큐에 추가\n' +
          '  updateQueue.push({ fiber, update });\n' +
          '\n' +
          '  // 2. 아직 배치 처리가 예약되지 않았으면 예약\n' +
          '  if (!isBatchingScheduled) {\n' +
          '    isBatchingScheduled = true;\n' +
          '\n' +
          '    // 마이크로태스크로 예약 → 동기 코드가 모두 끝난 후 실행\n' +
          '    queueMicrotask(() => {\n' +
          '      processBatch();\n' +
          '      isBatchingScheduled = false;\n' +
          '    });\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          'function processBatch() {\n' +
          '  // 큐에 쌓인 모든 업데이트를 한 번에 처리\n' +
          '  const updatedFibers = new Set<FiberNode>();\n' +
          '\n' +
          '  for (const { fiber, update } of updateQueue) {\n' +
          '    // 함수형 업데이트면 이전 값 기반으로 계산\n' +
          '    if (typeof update === "function") {\n' +
          '      fiber.state = update(fiber.state);\n' +
          '    } else {\n' +
          '      fiber.state = update;\n' +
          '    }\n' +
          '    updatedFibers.add(fiber);\n' +
          '  }\n' +
          '\n' +
          '  updateQueue.length = 0;\n' +
          '\n' +
          '  // 한 번의 렌더링으로 처리\n' +
          '  scheduleRender(updatedFibers);\n' +
          '}\n',
        description: "setState는 즉시 렌더링하지 않고 큐에 쌓으며, 마이크로태스크로 한 번에 처리합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 자동 배칭과 flushSync",
      content:
        "React 18의 자동 배칭과 flushSync의 동작을 비교합니다.",
      code: {
        language: "typescript",
        code:
          'import { useState } from "react";\n' +
          'import { flushSync } from "react-dom";\n' +
          '\n' +
          '// ✅ React 18 자동 배칭 — 1번의 리렌더링\n' +
          'function AutoBatchingExample() {\n' +
          '  const [count, setCount] = useState(0);\n' +
          '  const [flag, setFlag] = useState(false);\n' +
          '\n' +
          '  console.log("렌더링!", { count, flag });\n' +
          '\n' +
          '  function handleClick() {\n' +
          '    // 이벤트 핸들러 안 — React 17에서도 배칭됨\n' +
          '    setCount((c) => c + 1);\n' +
          '    setFlag((f) => !f);\n' +
          '    // → 렌더링 1번\n' +
          '  }\n' +
          '\n' +
          '  function handleAsyncClick() {\n' +
          '    // React 18: setTimeout/Promise 안에서도 자동 배칭!\n' +
          '    setTimeout(() => {\n' +
          '      setCount((c) => c + 1);\n' +
          '      setFlag((f) => !f);\n' +
          '      // React 17: 렌더링 2번\n' +
          '      // React 18: 렌더링 1번 ✅\n' +
          '    }, 0);\n' +
          '  }\n' +
          '\n' +
          '  function handleFetchClick() {\n' +
          '    fetch("/api/data").then(() => {\n' +
          '      setCount((c) => c + 1);\n' +
          '      setFlag((f) => !f);\n' +
          '      // React 18: 자동 배칭 → 렌더링 1번 ✅\n' +
          '    });\n' +
          '  }\n' +
          '\n' +
          '  return <button onClick={handleClick}>{count}</button>;\n' +
          '}\n' +
          '\n' +
          '// flushSync: 배칭을 해제하고 즉시 렌더링\n' +
          'function FlushSyncExample() {\n' +
          '  const [count, setCount] = useState(0);\n' +
          '  const [flag, setFlag] = useState(false);\n' +
          '\n' +
          '  function handleClick() {\n' +
          '    flushSync(() => {\n' +
          '      setCount((c) => c + 1);\n' +
          '    });\n' +
          '    // 여기서 DOM이 이미 업데이트됨\n' +
          '\n' +
          '    flushSync(() => {\n' +
          '      setFlag((f) => !f);\n' +
          '    });\n' +
          '    // 여기서 DOM이 다시 업데이트됨\n' +
          '    // → 총 렌더링 2번\n' +
          '  }\n' +
          '\n' +
          '  return <button onClick={handleClick}>{count}</button>;\n' +
          '}\n',
        description: "React 18에서는 모든 컨텍스트에서 자동 배칭이 적용됩니다. flushSync는 특수한 경우에만 사용하세요.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 항목 | React 17 | React 18+ |\n" +
        "|------|----------|----------|\n" +
        "| 이벤트 핸들러 | 배칭 O | 배칭 O |\n" +
        "| setTimeout | 배칭 X | 배칭 O (자동) |\n" +
        "| Promise.then | 배칭 X | 배칭 O (자동) |\n" +
        "| 네이티브 이벤트 | 배칭 X | 배칭 O (자동) |\n\n" +
        "**핵심:** React 18의 자동 배칭은 `createRoot`를 사용하면 어디서든 여러 상태 업데이트를 한 번의 렌더링으로 합칩니다. 즉시 반영이 필요하면 `flushSync`를, 이전 값 기반 업데이트는 함수형 업데이트를 사용하세요.\n\n" +
        "**다음 챕터 미리보기:** 비동기 데이터 로딩을 선언적으로 처리하는 Suspense를 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "React 18+에서는 모든 상태 업데이트가 자동으로 배칭된다. 여러 setState 호출이 하나의 리렌더로 합쳐져 불필요한 렌더링을 줄인다.",
  checklist: [
    "배칭이 무엇이고 왜 필요한지 설명할 수 있다",
    "React 17과 18의 배칭 차이를 설명할 수 있다",
    "flushSync의 용도와 사용 시점을 알고 있다",
    "함수형 업데이트가 필요한 이유를 설명할 수 있다",
    "자동 배칭이 동작하려면 createRoot가 필요함을 알고 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "React 18의 자동 배칭이 적용되지 않는 경우는?",
      choices: [
        "setTimeout 콜백 안에서의 setState",
        "Promise.then 안에서의 setState",
        "flushSync 안에서의 setState",
        "이벤트 핸들러 안에서의 setState",
      ],
      correctIndex: 2,
      explanation: "flushSync는 배칭을 명시적으로 해제하고 즉시 동기적으로 렌더링을 발생시킵니다.",
    },
    {
      id: "q2",
      question: "setCount(count + 1)을 연속 3번 호출하면 count는 얼마나 증가하는가? (초기값 0)",
      choices: ["3", "1", "0", "에러 발생"],
      correctIndex: 1,
      explanation: "배칭에 의해 세 호출 모두 같은 count 값(0)을 참조하므로 결과는 0+1=1입니다. 누적하려면 함수형 업데이트를 사용해야 합니다.",
    },
    {
      id: "q3",
      question: "React 17에서 setTimeout 안의 두 setState가 렌더링을 몇 번 유발하는가?",
      choices: ["0번", "1번", "2번", "3번"],
      correctIndex: 2,
      explanation: "React 17에서는 이벤트 핸들러 밖의 setState는 배칭되지 않아 각각 별도의 렌더링을 발생시킵니다.",
    },
    {
      id: "q4",
      question: "자동 배칭이 동작하기 위한 필수 조건은?",
      choices: [
        "React.memo 사용",
        "createRoot로 렌더링",
        "Strict Mode 활성화",
        "useReducer 사용",
      ],
      correctIndex: 1,
      explanation: "React 18의 자동 배칭은 createRoot API를 사용할 때만 활성화됩니다. 레거시 render() API에서는 동작하지 않습니다.",
    },
    {
      id: "q5",
      question: "함수형 업데이트 setState(prev => prev + 1)을 3번 연속 호출하면 값은?",
      choices: ["1", "2", "3", "에러 발생"],
      correctIndex: 2,
      explanation: "함수형 업데이트는 이전 결과를 기반으로 순차적으로 적용되므로 0→1→2→3이 됩니다.",
    },
  ],
};

export default chapter;
