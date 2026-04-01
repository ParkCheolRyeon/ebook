import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "17-usedeferred-usetransition",
  subject: "react",
  title: "useDeferredValue와 useTransition: 동시성 렌더링",
  description: "useDeferredValue와 useTransition으로 긴급/비긴급 업데이트를 분리하고, 동시성 렌더링의 원리를 이해합니다.",
  order: 17,
  group: "Hooks 심화",
  prerequisites: ["16-uselayouteffect"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "동시성 렌더링은 **응급실 시스템**과 같습니다.\n\n" +
        "응급실에서는 모든 환자를 도착 순서대로 치료하지 않습니다. 생명이 위급한 환자(긴급 업데이트)를 먼저 치료하고, 상태가 안정적인 환자(비긴급 업데이트)는 나중에 봅니다.\n\n" +
        "**useTransition**은 의사가 '이 치료는 급하지 않으니 나중에 해도 돼'라고 판단하는 것입니다. `startTransition`으로 감싼 업데이트는 비긴급으로 표시되어, 긴급 업데이트(타이핑, 클릭)에 양보합니다.\n\n" +
        "**useDeferredValue**는 환자의 검사 결과를 '이전 결과로 먼저 보여주고, 새 결과가 나오면 교체'하는 것입니다. 값이 변해도 즉시 반영하지 않고, 여유가 생기면 새 값으로 업데이트합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "UI에는 두 종류의 업데이트가 있습니다:\n\n" +
        "**긴급 업데이트** — 사용자가 즉각 반응을 기대하는 것\n" +
        "- 텍스트 입력, 버튼 클릭, 드롭다운 토글\n\n" +
        "**비긴급 업데이트** — 약간의 지연이 허용되는 것\n" +
        "- 검색 결과 목록, 필터링된 리스트, 차트 업데이트\n\n" +
        "문제는 React가 기본적으로 모든 상태 업데이트를 **동일한 우선순위**로 처리한다는 것입니다:\n\n" +
        "1. 검색어 입력 시 input 값 변경(긴급) + 검색 결과 업데이트(비긴급)이 함께 처리\n" +
        "2. 검색 결과 렌더링이 무거우면 **input 반응도 느려짐**\n" +
        "3. 사용자는 타이핑이 '버벅거린다'고 느낌\n\n" +
        "이 문제를 해결하려면 긴급/비긴급 업데이트를 분리하여 긴급 업데이트가 항상 먼저 처리되도록 해야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### useTransition\n" +
        "`const [isPending, startTransition] = useTransition()`\n\n" +
        "- `startTransition(() => setState(newValue))` — 이 업데이트를 비긴급으로 표시\n" +
        "- `isPending` — 트랜지션이 진행 중인지 여부\n" +
        "- 긴급 업데이트(타이핑)가 발생하면 진행 중인 비긴급 렌더링을 **중단**하고 긴급 것 먼저 처리\n\n" +
        "### useDeferredValue\n" +
        "`const deferredValue = useDeferredValue(value)`\n\n" +
        "- value가 변경되면 먼저 **이전 값**으로 렌더링을 완료한 후, 여유가 있을 때 새 값으로 다시 렌더링\n" +
        "- 주로 prop으로 전달받은 값을 지연시킬 때 사용\n" +
        "- useTransition의 '값 버전'이라고 생각할 수 있음\n\n" +
        "### 둘의 차이\n" +
        "- **useTransition** — 상태 업데이트 자체를 비긴급으로 표시 (상태를 직접 제어할 때)\n" +
        "- **useDeferredValue** — 값의 반영을 지연 (prop으로 받은 값을 제어할 때)\n\n" +
        "### 동시성 렌더링 원리\n" +
        "React는 비긴급 렌더링을 시작하되, 긴급 업데이트가 들어오면 비긴급 렌더링을 **양보(yield)**합니다. 이것이 '동시성(concurrent)'의 핵심입니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 동시성 스케줄링",
      content:
        "useTransition과 useDeferredValue가 내부적으로 어떻게 우선순위를 관리하는지 의사코드로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// 동시성 렌더링 스케줄러 (의사코드)\n' +
          '\n' +
          'type Priority = "urgent" | "transition";\n' +
          '\n' +
          'interface Update {\n' +
          '  priority: Priority;\n' +
          '  setState: () => void;\n' +
          '}\n' +
          '\n' +
          'const updateQueue: Update[] = [];\n' +
          '\n' +
          '// useTransition 내부\n' +
          'function useTransition(): [boolean, (fn: () => void) => void] {\n' +
          '  const [isPending, setIsPending] = useState(false);\n' +
          '\n' +
          '  const startTransition = (fn: () => void): void => {\n' +
          '    setIsPending(true); // 이것은 urgent\n' +
          '\n' +
          '    // fn 안의 setState를 transition 우선순위로 표시\n' +
          '    markAsTransition(() => {\n' +
          '      fn();\n' +
          '    });\n' +
          '\n' +
          '    // transition 완료 후 isPending을 false로\n' +
          '    onTransitionComplete(() => setIsPending(false));\n' +
          '  };\n' +
          '\n' +
          '  return [isPending, startTransition];\n' +
          '}\n' +
          '\n' +
          '// useDeferredValue 내부\n' +
          'function useDeferredValue<T>(value: T): T {\n' +
          '  const [deferredValue, setDeferredValue] = useState(value);\n' +
          '\n' +
          '  // value가 변경되면 transition 우선순위로 업데이트\n' +
          '  useEffect(() => {\n' +
          '    startTransition(() => {\n' +
          '      setDeferredValue(value);\n' +
          '    });\n' +
          '  }, [value]);\n' +
          '\n' +
          '  return deferredValue;\n' +
          '}\n' +
          '\n' +
          '// 스케줄러의 렌더링 루프\n' +
          'function workLoop(): void {\n' +
          '  while (hasWork()) {\n' +
          '    const update = getHighestPriorityUpdate();\n' +
          '\n' +
          '    if (update.priority === "urgent") {\n' +
          '      // 긴급: 즉시 처리, 진행 중인 transition 렌더링 중단\n' +
          '      interruptCurrentRender();\n' +
          '      processUpdate(update);\n' +
          '    } else {\n' +
          '      // transition: 여유 시간에 처리\n' +
          '      if (shouldYield()) {\n' +
          '        // 프레임 시간 초과 → 양보\n' +
          '        scheduleCallback(processUpdate, update);\n' +
          '      } else {\n' +
          '        processUpdate(update);\n' +
          '      }\n' +
          '    }\n' +
          '  }\n' +
          '}',
        description: "동시성 스케줄러는 긴급 업데이트를 먼저 처리하고, transition 업데이트는 여유 시간에 처리합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 검색 필터와 탭 전환",
      content:
        "useTransition과 useDeferredValue의 실전 활용 예제를 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          'import { useState, useTransition, useDeferredValue, memo } from "react";\n' +
          '\n' +
          '// 예제 1: useTransition — 탭 전환\n' +
          'function TabContainer() {\n' +
          '  const [tab, setTab] = useState("home");\n' +
          '  const [isPending, startTransition] = useTransition();\n' +
          '\n' +
          '  const handleTabChange = (nextTab: string) => {\n' +
          '    // 탭 전환을 비긴급으로 표시\n' +
          '    startTransition(() => {\n' +
          '      setTab(nextTab);\n' +
          '    });\n' +
          '  };\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <nav>\n' +
          '        <button onClick={() => handleTabChange("home")}>홈</button>\n' +
          '        <button onClick={() => handleTabChange("posts")}>게시물</button>\n' +
          '        <button onClick={() => handleTabChange("settings")}>설정</button>\n' +
          '      </nav>\n' +
          '      <div style={{ opacity: isPending ? 0.6 : 1 }}>\n' +
          '        {tab === "home" && <Home />}\n' +
          '        {tab === "posts" && <HeavyPostList />}\n' +
          '        {tab === "settings" && <Settings />}\n' +
          '      </div>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 예제 2: useDeferredValue — 검색 필터\n' +
          'function SearchPage() {\n' +
          '  const [query, setQuery] = useState("");\n' +
          '  const deferredQuery = useDeferredValue(query);\n' +
          '  const isStale = query !== deferredQuery;\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <input\n' +
          '        value={query}\n' +
          '        onChange={e => setQuery(e.target.value)}\n' +
          '        placeholder="검색어 입력..."\n' +
          '      />\n' +
          '      <div style={{ opacity: isStale ? 0.7 : 1 }}>\n' +
          '        <SearchResults query={deferredQuery} />\n' +
          '      </div>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// memo로 감싸서 deferredQuery가 같으면 리렌더링 방지\n' +
          'const SearchResults = memo(function SearchResults({\n' +
          '  query,\n' +
          '}: {\n' +
          '  query: string;\n' +
          '}) {\n' +
          '  // 무거운 렌더링 (많은 항목 필터링)\n' +
          '  const items = heavyFilter(query);\n' +
          '  return (\n' +
          '    <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>\n' +
          '  );\n' +
          '});\n' +
          '\n' +
          'function heavyFilter(query: string) {\n' +
          '  return Array.from({ length: 10000 }, (_, i) => ({\n' +
          '    id: i,\n' +
          '    name: `항목 ${i}`,\n' +
          '  })).filter(item => item.name.includes(query));\n' +
          '}\n' +
          '\n' +
          'function Home() { return <div>홈</div>; }\n' +
          'function HeavyPostList() { return <div>무거운 게시물 목록</div>; }\n' +
          'function Settings() { return <div>설정</div>; }',
        description: "useTransition은 상태 업데이트를 비긴급으로, useDeferredValue는 값 반영을 지연시켜 UI 반응성을 유지합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 비교 | useTransition | useDeferredValue |\n" +
        "|------|-------------|------------------|\n" +
        "| 대상 | 상태 업데이트 | 값 |\n" +
        "| 제어 방식 | startTransition으로 감싸기 | 값을 전달하면 자동 지연 |\n" +
        "| isPending | 제공 (로딩 표시용) | 직접 비교 (query !== deferred) |\n" +
        "| 사용 시점 | 상태를 직접 제어할 때 | prop으로 받은 값을 지연할 때 |\n\n" +
        "**동시성 렌더링 핵심:**\n" +
        "- 모든 상태 업데이트가 동일한 우선순위가 아님\n" +
        "- 긴급 업데이트(타이핑)는 즉시, 비긴급(필터링)은 여유 시간에\n" +
        "- 비긴급 렌더링 중 긴급 업데이트가 오면 비긴급을 중단\n" +
        "- useDeferredValue는 memo와 함께 사용할 때 효과적\n\n" +
        "**다음 챕터 미리보기:** Stale Closure 문제를 이해하고 useState 함수형 업데이트와 useRef로 해결하는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "긴급 업데이트와 비긴급 업데이트의 차이를 설명할 수 있다",
    "useTransition의 startTransition과 isPending 사용법을 이해한다",
    "useDeferredValue의 동작 원리를 설명할 수 있다",
    "useTransition과 useDeferredValue의 선택 기준을 제시할 수 있다",
    "동시성 렌더링에서 '양보(yield)'의 의미를 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "startTransition으로 감싼 setState는 어떻게 처리되나요?",
      choices: [
        "즉시 처리된다",
        "비긴급 업데이트로 표시되어 긴급 업데이트에 양보한다",
        "다음 렌더링까지 무시된다",
        "비동기로 전환된다",
      ],
      correctIndex: 1,
      explanation: "startTransition으로 감싼 상태 업데이트는 비긴급(transition)으로 표시됩니다. 긴급 업데이트가 있으면 양보하고 여유가 생기면 처리됩니다.",
    },
    {
      id: "q2",
      question: "useDeferredValue와 useTransition의 주요 차이는?",
      choices: [
        "성능 차이",
        "useTransition은 상태 업데이트를, useDeferredValue는 값 반영을 제어",
        "useTransition은 동기, useDeferredValue는 비동기",
        "차이 없음",
      ],
      correctIndex: 1,
      explanation: "useTransition은 setState를 직접 비긴급으로 표시하고, useDeferredValue는 전달받은 값의 반영을 자동으로 지연합니다.",
    },
    {
      id: "q3",
      question: "useDeferredValue를 사용할 때 함께 쓰면 효과적인 것은?",
      choices: [
        "useEffect",
        "useRef",
        "React.memo",
        "useReducer",
      ],
      correctIndex: 2,
      explanation: "useDeferredValue는 이전 값으로 먼저 렌더링하므로, memo로 감싼 자식에 전달하면 이전 값일 때 리렌더링을 건너뜁니다.",
    },
    {
      id: "q4",
      question: "isPending은 어떤 용도로 사용하나요?",
      choices: [
        "에러 상태 표시",
        "transition이 진행 중임을 나타내어 로딩 UI에 활용",
        "렌더링 성능 측정",
        "디버깅 로그 출력",
      ],
      correctIndex: 1,
      explanation: "isPending은 transition이 아직 완료되지 않았음을 나타냅니다. 이를 통해 opacity를 낮추거나 스피너를 보여주는 등 시각적 피드백을 제공합니다.",
    },
    {
      id: "q5",
      question: "동시성 렌더링에서 '양보(yield)'란?",
      choices: [
        "렌더링을 영구 중단하는 것",
        "진행 중인 비긴급 렌더링을 잠시 멈추고 긴급 업데이트를 먼저 처리하는 것",
        "모든 렌더링을 취소하는 것",
        "렌더링 결과를 캐시하는 것",
      ],
      correctIndex: 1,
      explanation: "양보는 비긴급 렌더링을 일시 중단하고 긴급 업데이트를 먼저 처리한 후, 다시 비긴급 렌더링을 이어가는 것입니다.",
    },
    {
      id: "q6",
      question: "검색 input에서 타이핑은 즉각 반응하고 결과 목록은 지연시키려면?",
      choices: [
        "setTimeout을 사용한다",
        "useTransition 또는 useDeferredValue를 사용한다",
        "useEffect에서 처리한다",
        "debounce만 사용한다",
      ],
      correctIndex: 1,
      explanation: "useTransition이나 useDeferredValue를 사용하면 input 업데이트(긴급)는 즉시 반영하고, 결과 목록 업데이트(비긴급)는 여유 시간에 처리합니다.",
    },
  ],
};

export default chapter;
