import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "20-fiber-architecture",
  subject: "react",
  title: "Fiber 아키텍처",
  description: "Fiber 노드 구조, 작업 단위(unit of work), 시간 분할(time slicing), 우선순위 레인(lanes), 이중 버퍼링을 이해합니다.",
  order: 20,
  group: "렌더링 원리",
  prerequisites: ["19-virtual-dom-reconciliation"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Fiber는 음식점의 주방 시스템과 비슷합니다.\n\n" +
        "**이전 방식(Stack Reconciler)**은 한 테이블의 코스 요리를 처음부터 끝까지 한 번에 만드는 셰프입니다. 10코스를 만드는 동안 다른 테이블의 긴급 주문(사용자 입력)을 받을 수 없습니다.\n\n" +
        "**Fiber**는 주문을 작은 작업 단위로 쪼개는 시스템입니다. 셰프가 소스를 끓이다가도 긴급 주문이 들어오면 잠시 멈추고 그 주문을 먼저 처리할 수 있습니다. 각 요리 단계가 하나의 **Fiber 노드**이고, 긴급도에 따라 순서를 바꾸는 것이 **우선순위 레인(lanes)**입니다.\n\n" +
        "그리고 서빙 전에 모든 음식이 준비되었는지 한번에 확인하는 것이 **이중 버퍼링**입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React 15까지의 Stack Reconciler에는 근본적인 한계가 있었습니다.\n\n" +
        "1. **동기적 재귀** — 컴포넌트 트리를 재귀적으로 순회하며 한 번 시작하면 중간에 멈출 수 없었습니다.\n" +
        "2. **프레임 드롭** — 대규모 트리 업데이트가 16ms(60fps) 이상 걸리면 브라우저의 렌더링이 블로킹되어 화면이 끊겼습니다.\n" +
        "3. **우선순위 없음** — 사용자 입력(높은 우선순위)과 데이터 페칭 결과(낮은 우선순위)를 구분할 수 없어 모든 업데이트가 동일하게 처리되었습니다.\n" +
        "4. **취소 불가** — 이미 시작된 렌더링을 취소하고 더 중요한 작업을 먼저 할 수 없었습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "React 16에서 도입된 Fiber 아키텍처는 재조정을 **증분적(incremental)**으로 수행합니다.\n\n" +
        "### Fiber 노드 구조\n" +
        "각 React 엘리먼트는 Fiber 노드로 표현됩니다. Fiber 노드는 linked list로 연결되며 `child`, `sibling`, `return`(부모) 포인터를 가집니다.\n\n" +
        "### 작업 단위(Unit of Work)\n" +
        "하나의 Fiber 노드를 처리하는 것이 하나의 작업 단위입니다. 작업 단위를 완료하면 브라우저에 제어권을 돌려줄 수 있는 **양보 지점(yield point)**이 됩니다.\n\n" +
        "### 시간 분할(Time Slicing)\n" +
        "`requestIdleCallback`(또는 React의 자체 스케줄러)을 사용해 프레임 사이의 유휴 시간에 작업을 수행합니다. 5ms 단위로 잘라서 브라우저가 끊기지 않게 합니다.\n\n" +
        "### 우선순위 레인(Lanes)\n" +
        "React 18부터 비트마스크 기반 Lane 시스템으로 업데이트 우선순위를 관리합니다. `SyncLane`(사용자 입력), `DefaultLane`(일반 업데이트), `IdleLane`(유휴 시 처리) 등이 있습니다.\n\n" +
        "### 이중 버퍼링\n" +
        "`current` 트리(화면에 보이는 것)와 `workInProgress` 트리(작업 중인 것) 두 개를 유지합니다. 작업이 완료되면 포인터만 교체(swap)하여 한 번에 반영합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Fiber 워크 루프",
      content:
        "Fiber의 작업 루프가 어떻게 작업 단위를 처리하고 양보하는지 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// Fiber 노드 구조 (단순화)\n' +
          'interface FiberNode {\n' +
          '  type: string | Function;      // 엘리먼트 타입\n' +
          '  props: Record<string, unknown>;\n' +
          '  stateNode: Element | null;    // 실제 DOM 참조\n' +
          '  child: FiberNode | null;      // 첫 번째 자식\n' +
          '  sibling: FiberNode | null;    // 다음 형제\n' +
          '  return: FiberNode | null;     // 부모\n' +
          '  alternate: FiberNode | null;  // 이중 버퍼의 반대편\n' +
          '  effectTag: "PLACEMENT" | "UPDATE" | "DELETION" | null;\n' +
          '  lanes: number;               // 우선순위 비트마스크\n' +
          '}\n' +
          '\n' +
          '// 작업 루프 (단순화)\n' +
          'let workInProgress: FiberNode | null = null;\n' +
          '\n' +
          'function workLoop(deadline: { timeRemaining: () => number }) {\n' +
          '  let shouldYield = false;\n' +
          '\n' +
          '  while (workInProgress !== null && !shouldYield) {\n' +
          '    // 1. 현재 Fiber 처리 (하나의 작업 단위)\n' +
          '    workInProgress = performUnitOfWork(workInProgress);\n' +
          '\n' +
          '    // 2. 브라우저에 양보해야 하는지 확인\n' +
          '    shouldYield = deadline.timeRemaining() < 5; // 5ms 미만이면 양보\n' +
          '  }\n' +
          '\n' +
          '  if (workInProgress !== null) {\n' +
          '    // 아직 작업이 남아있으면 다음 유휴 시간에 계속\n' +
          '    requestIdleCallback(workLoop);\n' +
          '  } else {\n' +
          '    // 모든 작업 완료 → 커밋 단계로\n' +
          '    commitRoot();\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          'function performUnitOfWork(fiber: FiberNode): FiberNode | null {\n' +
          '  // 자식이 있으면 자식으로 이동\n' +
          '  if (fiber.child) return fiber.child;\n' +
          '  // 형제가 있으면 형제로 이동\n' +
          '  if (fiber.sibling) return fiber.sibling;\n' +
          '  // 부모의 형제로 이동 (backtrack)\n' +
          '  let current = fiber.return;\n' +
          '  while (current) {\n' +
          '    if (current.sibling) return current.sibling;\n' +
          '    current = current.return;\n' +
          '  }\n' +
          '  return null; // 트리 순회 완료\n' +
          '}\n',
        description: "Fiber는 재귀 대신 while 루프와 linked list를 사용하여 중단/재개가 가능한 증분적 렌더링을 구현합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 우선순위와 시간 분할 관찰",
      content:
        "React의 동시성 기능이 실제로 어떻게 작동하는지 확인하는 예제입니다.",
      code: {
        language: "typescript",
        code:
          'import { useState, useTransition, useDeferredValue } from "react";\n' +
          '\n' +
          '// useTransition: 낮은 우선순위로 상태 업데이트\n' +
          'function SearchWithTransition() {\n' +
          '  const [query, setQuery] = useState("");\n' +
          '  const [results, setResults] = useState<string[]>([]);\n' +
          '  const [isPending, startTransition] = useTransition();\n' +
          '\n' +
          '  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {\n' +
          '    // 입력 업데이트는 높은 우선순위 (SyncLane)\n' +
          '    setQuery(e.target.value);\n' +
          '\n' +
          '    // 검색 결과 업데이트는 낮은 우선순위 (TransitionLane)\n' +
          '    startTransition(() => {\n' +
          '      setResults(heavySearch(e.target.value));\n' +
          '    });\n' +
          '  }\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <input value={query} onChange={handleChange} />\n' +
          '      {isPending ? <p>검색 중...</p> : <ResultList results={results} />}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// useDeferredValue: 값의 업데이트를 지연\n' +
          'function DeferredList({ items }: { items: string[] }) {\n' +
          '  const deferredItems = useDeferredValue(items);\n' +
          '  const isStale = items !== deferredItems;\n' +
          '\n' +
          '  return (\n' +
          '    <div style={{ opacity: isStale ? 0.5 : 1 }}>\n' +
          '      {deferredItems.map((item) => (\n' +
          '        <ExpensiveItem key={item} text={item} />\n' +
          '      ))}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n',
        description: "useTransition과 useDeferredValue는 Fiber의 우선순위 레인을 활용하는 대표적인 API입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | Stack Reconciler | Fiber Reconciler |\n" +
        "|------|-----------------|------------------|\n" +
        "| 순회 방식 | 재귀 | while 루프 + linked list |\n" +
        "| 중단/재개 | 불가 | 가능 |\n" +
        "| 우선순위 | 없음 | Lane 비트마스크 |\n" +
        "| 버퍼링 | 단일 | 이중 (current + workInProgress) |\n" +
        "| 프레임 드롭 | 빈번 | 시간 분할로 최소화 |\n\n" +
        "**핵심:** Fiber는 렌더링을 작은 작업 단위로 쪼개고, 우선순위에 따라 스케줄링하며, 브라우저 프레임을 양보함으로써 동시성 렌더링의 기반을 마련했습니다.\n\n" +
        "**다음 챕터 미리보기:** Fiber가 실제 화면에 반영되는 과정인 렌더 단계와 커밋 단계를 자세히 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "Fiber 노드의 구조(child, sibling, return)를 설명할 수 있다",
    "작업 단위(unit of work)와 양보 지점의 관계를 이해한다",
    "시간 분할이 프레임 드롭을 방지하는 원리를 설명할 수 있다",
    "Lane 시스템의 우선순위 개념을 이해한다",
    "이중 버퍼링에서 current와 workInProgress의 역할을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Fiber 아키텍처가 도입된 주된 이유는?",
      choices: [
        "메모리 사용량을 줄이기 위해",
        "렌더링을 중단/재개하고 우선순위를 부여하기 위해",
        "서버 사이드 렌더링을 지원하기 위해",
        "TypeScript 호환성을 높이기 위해",
      ],
      correctIndex: 1,
      explanation: "Fiber는 동기적 재귀 방식의 Stack Reconciler를 대체하여 렌더링을 증분적으로 수행하고 우선순위 기반 스케줄링을 가능하게 합니다.",
    },
    {
      id: "q2",
      question: "Fiber 노드가 linked list로 연결되는 이유는?",
      choices: [
        "배열보다 메모리 효율이 좋아서",
        "재귀 호출 없이 순회를 중단/재개할 수 있어서",
        "DOM과 1:1 매핑이 되어서",
        "가비지 컬렉션이 더 빨라서",
      ],
      correctIndex: 1,
      explanation: "linked list는 현재 위치를 포인터로 기억할 수 있어, while 루프로 순회하다 중단한 후 동일 지점에서 재개할 수 있습니다.",
    },
    {
      id: "q3",
      question: "React Fiber의 이중 버퍼링에서 'current' 트리와 'workInProgress' 트리의 관계는?",
      choices: [
        "current는 서버, workInProgress는 클라이언트를 담당한다",
        "current는 화면에 표시 중인 트리, workInProgress는 작업 중인 트리이다",
        "current는 이전 상태, workInProgress는 다다음 상태이다",
        "둘은 항상 동일한 트리를 가리킨다",
      ],
      correctIndex: 1,
      explanation: "current 트리는 현재 화면에 렌더링된 상태이고, workInProgress 트리는 새로운 업데이트를 반영 중인 트리입니다. 작업 완료 후 포인터를 교체합니다.",
    },
    {
      id: "q4",
      question: "시간 분할(Time Slicing)에서 React가 브라우저에 제어권을 양보하는 기준은?",
      choices: [
        "컴포넌트 수가 100개를 넘으면",
        "DOM 변경이 발생할 때마다",
        "프레임 시간이 부족해지면 (약 5ms 단위)",
        "사용자 이벤트가 발생하면",
      ],
      correctIndex: 2,
      explanation: "React의 스케줄러는 약 5ms 단위로 남은 시간을 확인하고, 시간이 부족하면 브라우저에 제어권을 양보하여 프레임 드롭을 방지합니다.",
    },
    {
      id: "q5",
      question: "useTransition은 Fiber의 어떤 기능을 활용하는가?",
      choices: [
        "이중 버퍼링",
        "우선순위 레인(Lanes)",
        "시간 분할",
        "가상 DOM Diffing",
      ],
      correctIndex: 1,
      explanation: "useTransition은 상태 업데이트를 TransitionLane(낮은 우선순위)으로 표시하여 사용자 입력 같은 높은 우선순위 작업에 양보하게 합니다.",
    },
  ],
};

export default chapter;
