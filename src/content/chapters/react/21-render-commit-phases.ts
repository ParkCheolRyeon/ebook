import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "21-render-commit-phases",
  subject: "react",
  title: "렌더 단계와 커밋 단계",
  description: "렌더 단계(순수, 부수효과 없음)와 커밋 단계(DOM 조작)의 차이, 이중 패스, useEffect 실행 시점을 이해합니다.",
  order: 21,
  group: "렌더링 원리",
  prerequisites: ["20-fiber-architecture"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "React의 두 단계는 영화 제작 과정과 비슷합니다.\n\n" +
        "**렌더 단계**는 시나리오 작성과 리허설입니다. 여러 번 다시 쓸 수 있고, 중간에 수정해도 관객에게 영향이 없습니다. 순수한 작업이며 현실(DOM)을 변경하지 않습니다.\n\n" +
        "**커밋 단계**는 실제 촬영과 상영입니다. 한 번 시작하면 중간에 멈출 수 없고, 카메라가 돌아가는 동안(DOM 조작) 모든 변경이 한꺼번에 반영됩니다.\n\n" +
        "그리고 상영이 끝난 후에 관객 반응을 수집하는 것이 **useEffect**입니다. 화면이 다 그려진 뒤에 실행됩니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React의 렌더링 과정을 하나의 단계로 이해하면 여러 혼란이 발생합니다.\n\n" +
        "1. **\"렌더링 = DOM 변경\"이라는 오해** — 실제로 컴포넌트 함수가 호출되는 것과 DOM이 변경되는 것은 별개의 단계입니다.\n" +
        "2. **부수효과 시점의 혼란** — useEffect는 언제 실행되는가? useLayoutEffect와는 무엇이 다른가?\n" +
        "3. **렌더 함수의 순수성** — 왜 렌더 함수에서 API 호출이나 DOM 조작을 하면 안 되는가?\n" +
        "4. **Strict Mode의 이중 호출** — 개발 모드에서 컴포넌트가 두 번 호출되는 이유는 무엇인가?",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "React의 업데이트 사이클은 명확히 분리된 두 단계로 구성됩니다.\n\n" +
        "### 렌더 단계 (Render Phase)\n" +
        "- 컴포넌트 함수를 호출하여 새로운 가상 DOM을 생성합니다.\n" +
        "- 이전 가상 DOM과 비교(Diffing)하여 변경 목록을 수집합니다.\n" +
        "- **순수해야 합니다** — 같은 입력이면 같은 출력을 반환해야 합니다.\n" +
        "- 중단/재개 가능하며, 동시성 모드에서 여러 번 실행될 수 있습니다.\n\n" +
        "### 커밋 단계 (Commit Phase)\n" +
        "- 렌더 단계에서 계산된 변경 사항을 실제 DOM에 반영합니다.\n" +
        "- **동기적으로 실행** — 중단 불가, 사용자에게 일관된 UI를 보장합니다.\n" +
        "- 세 가지 하위 단계: Before Mutation → Mutation → Layout\n\n" +
        "### Effect 실행 시점\n" +
        "- `useLayoutEffect`: 커밋 단계의 Layout 하위 단계에서 동기적으로 실행 (DOM 변경 직후, 브라우저 페인트 전)\n" +
        "- `useEffect`: 커밋 완료 후 브라우저 페인트 이후에 비동기적으로 실행",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 업데이트 사이클 의사코드",
      content:
        "React의 전체 업데이트 사이클이 어떤 순서로 진행되는지 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// React 업데이트 사이클 의사코드\n' +
          '\n' +
          '// ========= 렌더 단계 (중단/재개 가능) =========\n' +
          'function renderPhase(root: FiberNode) {\n' +
          '  let fiber: FiberNode | null = root;\n' +
          '\n' +
          '  while (fiber !== null) {\n' +
          '    // 컴포넌트 함수 호출 → 새 가상 DOM 생성\n' +
          '    // ⚠️ 이 단계에서는 DOM을 조작하면 안 됨\n' +
          '    const newElements = fiber.type(fiber.props); // 순수해야 함!\n' +
          '\n' +
          '    // 이전 트리와 비교하여 effectTag 부여\n' +
          '    diff(fiber.alternate, newElements); // PLACEMENT | UPDATE | DELETION\n' +
          '\n' +
          '    fiber = getNextFiber(fiber); // 다음 작업 단위\n' +
          '    // ← 여기서 양보 가능 (시간 분할)\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// ========= 커밋 단계 (동기적, 중단 불가) =========\n' +
          'function commitPhase(root: FiberNode) {\n' +
          '  // 1. Before Mutation: getSnapshotBeforeUpdate\n' +
          '  commitBeforeMutation(root);\n' +
          '\n' +
          '  // 2. Mutation: 실제 DOM 변경\n' +
          '  commitMutation(root);\n' +
          '  // → appendChild, removeChild, setAttribute 등\n' +
          '\n' +
          '  // 3. current 포인터 교체 (이중 버퍼링 swap)\n' +
          '  root.current = root.workInProgress;\n' +
          '\n' +
          '  // 4. Layout: useLayoutEffect 실행 (동기)\n' +
          '  commitLayout(root);\n' +
          '  // → DOM이 변경된 직후, 페인트 전\n' +
          '}\n' +
          '\n' +
          '// ========= 페인트 후 =========\n' +
          '// 브라우저가 화면을 그린 후\n' +
          'function afterPaint() {\n' +
          '  // useEffect 콜백 실행 (비동기)\n' +
          '  flushPassiveEffects();\n' +
          '}\n',
        description: "렌더 단계는 순수하고 중단 가능하며, 커밋 단계는 동기적으로 DOM을 변경합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: useEffect vs useLayoutEffect",
      content:
        "두 Effect의 실행 시점 차이를 확인하는 예제입니다.",
      code: {
        language: "typescript",
        code:
          'import { useState, useEffect, useLayoutEffect, useRef } from "react";\n' +
          '\n' +
          '// 실행 순서 확인\n' +
          'function LifecycleOrder() {\n' +
          '  console.log("1. 렌더 단계: 컴포넌트 함수 실행");\n' +
          '\n' +
          '  useLayoutEffect(() => {\n' +
          '    console.log("3. 커밋 단계(Layout): useLayoutEffect 실행");\n' +
          '    console.log("   → DOM은 변경됨, 아직 페인트 전");\n' +
          '    return () => console.log("cleanup: useLayoutEffect");\n' +
          '  });\n' +
          '\n' +
          '  useEffect(() => {\n' +
          '    console.log("4. 페인트 후: useEffect 실행");\n' +
          '    console.log("   → 브라우저가 화면을 그린 후");\n' +
          '    return () => console.log("cleanup: useEffect");\n' +
          '  });\n' +
          '\n' +
          '  console.log("2. 렌더 단계: JSX 반환");\n' +
          '  return <div>순서를 콘솔에서 확인하세요</div>;\n' +
          '}\n' +
          '\n' +
          '// useLayoutEffect가 필요한 경우: DOM 측정\n' +
          'function Tooltip({ text }: { text: string }) {\n' +
          '  const ref = useRef<HTMLDivElement>(null);\n' +
          '  const [tooltipHeight, setTooltipHeight] = useState(0);\n' +
          '\n' +
          '  useLayoutEffect(() => {\n' +
          '    // DOM이 변경된 직후, 페인트 전에 높이를 측정\n' +
          '    // → 깜빡임 없이 위치를 조정할 수 있음\n' +
          '    if (ref.current) {\n' +
          '      const { height } = ref.current.getBoundingClientRect();\n' +
          '      setTooltipHeight(height);\n' +
          '    }\n' +
          '  }, [text]);\n' +
          '\n' +
          '  return <div ref={ref} style={{ top: -tooltipHeight }}>{text}</div>;\n' +
          '}\n' +
          '\n' +
          '// ❌ 렌더 단계에서 부수효과 — 하면 안 되는 것\n' +
          'function BadComponent() {\n' +
          '  // 렌더 단계에서 DOM 조작 → 동시성 모드에서 문제\n' +
          '  // document.title = "Bad!"; ← 이러면 안 됨\n' +
          '\n' +
          '  // ✅ useEffect에서 처리\n' +
          '  useEffect(() => {\n' +
          '    document.title = "Good!";\n' +
          '  });\n' +
          '\n' +
          '  return <div>부수효과는 Effect에서!</div>;\n' +
          '}\n',
        description: "useLayoutEffect는 DOM 측정/조작에, useEffect는 대부분의 부수효과에 사용합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 단계 | 특성 | 실행 내용 |\n" +
        "|------|------|-----------|\n" +
        "| 렌더 단계 | 순수, 중단 가능 | 컴포넌트 호출, Diffing |\n" +
        "| 커밋 - Before Mutation | 동기 | getSnapshotBeforeUpdate |\n" +
        "| 커밋 - Mutation | 동기 | 실제 DOM 변경 |\n" +
        "| 커밋 - Layout | 동기 | useLayoutEffect 실행 |\n" +
        "| 페인트 후 | 비동기 | useEffect 실행 |\n\n" +
        "**핵심:** 렌더 단계는 '무엇을 바꿀지' 계산하고, 커밋 단계는 '실제로 바꾸는' 단계입니다. 렌더 함수를 순수하게 유지해야 동시성 기능이 안전하게 동작합니다.\n\n" +
        "**다음 챕터 미리보기:** 여러 상태 업데이트가 하나의 렌더링으로 합쳐지는 배칭(Batching) 메커니즘을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "렌더 단계와 커밋 단계의 차이를 설명할 수 있다",
    "렌더 함수가 순수해야 하는 이유를 이해한다",
    "useEffect와 useLayoutEffect의 실행 시점 차이를 설명할 수 있다",
    "커밋 단계의 세 가지 하위 단계를 알고 있다",
    "Strict Mode에서 이중 호출이 발생하는 이유를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "렌더 단계에서 하면 안 되는 것은?",
      choices: [
        "JSX 반환",
        "props 읽기",
        "DOM 직접 조작",
        "조건부 렌더링",
      ],
      correctIndex: 2,
      explanation: "렌더 단계는 순수해야 하므로 DOM 조작, API 호출 등의 부수효과를 수행하면 안 됩니다. 동시성 모드에서 여러 번 실행될 수 있기 때문입니다.",
    },
    {
      id: "q2",
      question: "useLayoutEffect가 실행되는 시점은?",
      choices: [
        "렌더 단계에서 컴포넌트 함수 호출 직후",
        "커밋 단계에서 DOM 변경 직후, 브라우저 페인트 전",
        "브라우저 페인트 후",
        "컴포넌트 마운트 전",
      ],
      correctIndex: 1,
      explanation: "useLayoutEffect는 커밋 단계의 Layout 하위 단계에서 동기적으로 실행됩니다. DOM은 변경되었지만 아직 화면에 그려지기 전입니다.",
    },
    {
      id: "q3",
      question: "React의 커밋 단계가 동기적으로 실행되는 이유는?",
      choices: [
        "성능이 더 좋아서",
        "구현이 더 간단해서",
        "사용자에게 일관된 UI를 보장하기 위해",
        "브라우저 API 제약 때문에",
      ],
      correctIndex: 2,
      explanation: "커밋 단계에서 DOM 변경이 부분적으로만 적용되면 사용자가 불완전한 UI를 보게 됩니다. 동기적으로 한 번에 반영하여 일관성을 보장합니다.",
    },
    {
      id: "q4",
      question: "Strict Mode에서 컴포넌트가 두 번 호출되는 이유는?",
      choices: [
        "성능 측정을 위해",
        "렌더 함수의 순수성을 검증하기 위해",
        "메모리 누수를 감지하기 위해",
        "타입 체크를 위해",
      ],
      correctIndex: 1,
      explanation: "Strict Mode의 이중 호출은 렌더 함수에 부수효과가 있는지 검증합니다. 순수한 함수는 두 번 호출해도 같은 결과를 반환해야 합니다.",
    },
    {
      id: "q5",
      question: "useEffect와 useLayoutEffect 중 DOM 측정에 적합한 것은?",
      choices: [
        "useEffect — 비동기라 성능이 좋아서",
        "useLayoutEffect — 페인트 전에 실행되어 깜빡임이 없어서",
        "둘 다 동일하다",
        "어느 것도 적합하지 않다",
      ],
      correctIndex: 1,
      explanation: "useLayoutEffect는 DOM 변경 직후 페인트 전에 실행되므로 측정 후 추가 조작을 해도 깜빡임 없이 반영됩니다.",
    },
  ],
};

export default chapter;
