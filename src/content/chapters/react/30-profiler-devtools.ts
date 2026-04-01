import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "30-profiler-devtools",
  subject: "react",
  title: "Profiler와 DevTools",
  description: "React Profiler API, React DevTools Components/Profiler 탭, 렌더링 하이라이트, 병목 찾기 워크플로를 이해합니다.",
  order: 30,
  group: "성능 최적화",
  prerequisites: ["29-list-virtualization"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Profiler와 DevTools는 자동차 계기판과 비슷합니다.\n\n" +
        "운전 중 속도계, RPM 게이지, 연료 게이지를 보면서 차의 상태를 파악합니다. 뭔가 이상하면(성능 문제) 정비소(DevTools)에서 정밀 진단을 받습니다.\n\n" +
        "**React DevTools의 Components 탭**은 엔진룸을 들여다보는 것입니다. 각 부품(컴포넌트)의 현재 상태(props, state)를 확인할 수 있습니다.\n\n" +
        "**Profiler 탭**은 주행 기록 분석기입니다. 어떤 구간(렌더링)에서 얼마나 시간이 걸렸는지, 어떤 부품(컴포넌트)이 병목인지 기록합니다.\n\n" +
        "**렌더링 하이라이트**는 열화상 카메라처럼 어떤 부품이 활발히 작동(리렌더링)하는지 실시간으로 보여줍니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "성능 문제를 직감이 아닌 데이터로 찾아야 합니다.\n\n" +
        "1. **어디가 느린지 모름** — 앱이 느린 건 알지만, 어떤 컴포넌트가 원인인지 파악하기 어렵습니다.\n" +
        "2. **불필요한 리렌더링 감지 어려움** — console.log로 확인하는 것은 번거롭고 놓치기 쉽습니다.\n" +
        "3. **최적화 효과 측정 불가** — React.memo를 적용했는데 실제로 효과가 있는지 객관적으로 확인할 수 없습니다.\n" +
        "4. **프로덕션 성능 모니터링** — 개발 환경에서는 빠르지만 프로덕션에서 느린 경우를 잡아야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### React DevTools Components 탭\n" +
        "- 컴포넌트 트리를 시각적으로 탐색합니다.\n" +
        "- 각 컴포넌트의 props, state, hooks 값을 실시간으로 확인합니다.\n" +
        "- 'Highlight updates when components render' 옵션으로 리렌더링을 시각화합니다.\n\n" +
        "### React DevTools Profiler 탭\n" +
        "- 녹화 버튼으로 렌더링을 기록하고 분석합니다.\n" +
        "- **Flamegraph**: 각 컴포넌트의 렌더링 시간을 막대 그래프로 표시합니다.\n" +
        "- **Ranked**: 렌더링 시간 순으로 컴포넌트를 정렬합니다.\n" +
        "- **Why did this render?**: 리렌더링의 원인을 보여줍니다.\n\n" +
        "### React Profiler API\n" +
        "`<Profiler>` 컴포넌트를 사용해 프로그래밍 방식으로 렌더링 성능을 측정합니다. 프로덕션 빌드에서도 사용 가능합니다.\n\n" +
        "### 병목 찾기 워크플로\n" +
        "1. 렌더링 하이라이트로 불필요한 리렌더링 식별\n" +
        "2. Profiler로 느린 컴포넌트 찾기\n" +
        "3. 원인 분석 (state 변경? 부모 리렌더링? Context?)\n" +
        "4. 최적화 적용 후 Profiler로 효과 검증",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Profiler API 사용",
      content:
        "React Profiler API를 사용해 렌더링 성능을 측정하는 방법을 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          'import { Profiler } from "react";\n' +
          'import type { ProfilerOnRenderCallback } from "react";\n' +
          '\n' +
          '// Profiler 콜백: 렌더링이 커밋될 때마다 호출\n' +
          'const onRender: ProfilerOnRenderCallback = (\n' +
          '  id,           // Profiler 트리의 "id"\n' +
          '  phase,        // "mount" | "update" | "nested-update"\n' +
          '  actualDuration, // 이번 업데이트에 걸린 실제 시간 (ms)\n' +
          '  baseDuration,   // 메모이제이션 없이 전체를 렌더링할 때의 예상 시간\n' +
          '  startTime,      // 렌더링 시작 시간\n' +
          '  commitTime      // 커밋 시간\n' +
          ') => {\n' +
          '  // 성능 데이터를 로깅하거나 모니터링 서비스로 전송\n' +
          '  console.table({\n' +
          '    id,\n' +
          '    phase,\n' +
          '    actualDuration: `${actualDuration.toFixed(2)}ms`,\n' +
          '    baseDuration: `${baseDuration.toFixed(2)}ms`,\n' +
          '    memoizationSaved: `${(baseDuration - actualDuration).toFixed(2)}ms`,\n' +
          '  });\n' +
          '\n' +
          '  // 프로덕션 모니터링 예시\n' +
          '  if (actualDuration > 16) {\n' +
          '    // 16ms 초과 = 프레임 드롭 가능성\n' +
          '    reportSlowRender({ id, phase, actualDuration });\n' +
          '  }\n' +
          '};\n' +
          '\n' +
          '// 사용 예시\n' +
          'function App() {\n' +
          '  return (\n' +
          '    <Profiler id="App" onRender={onRender}>\n' +
          '      <Header />\n' +
          '      <Profiler id="MainContent" onRender={onRender}>\n' +
          '        <ProductList />\n' +
          '      </Profiler>\n' +
          '      <Profiler id="Sidebar" onRender={onRender}>\n' +
          '        <Sidebar />\n' +
          '      </Profiler>\n' +
          '    </Profiler>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'function reportSlowRender(data: {\n' +
          '  id: string;\n' +
          '  phase: string;\n' +
          '  actualDuration: number;\n' +
          '}) {\n' +
          '  // 모니터링 서비스로 전송\n' +
          '  console.warn("Slow render detected:", data);\n' +
          '}\n',
        description: "Profiler API의 onRender 콜백으로 actualDuration과 baseDuration을 비교하면 메모이제이션의 효과를 측정할 수 있습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 병목 찾기 워크플로",
      content:
        "성능 병목을 체계적으로 찾고 해결하는 단계별 예제입니다.",
      code: {
        language: "typescript",
        code:
          'import { Profiler, memo, useState, useMemo } from "react";\n' +
          'import type { ProfilerOnRenderCallback } from "react";\n' +
          '\n' +
          '// 1단계: 문제 식별 — 느린 리스트\n' +
          'function SlowDashboard() {\n' +
          '  const [filter, setFilter] = useState("");\n' +
          '  const [data] = useState(() => generateLargeData(5000));\n' +
          '\n' +
          '  // ❌ 매 키 입력마다 5000개 아이템 필터링 + 렌더링\n' +
          '  const filtered = data.filter((item) =>\n' +
          '    item.name.includes(filter)\n' +
          '  );\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <input\n' +
          '        value={filter}\n' +
          '        onChange={(e) => setFilter(e.target.value)}\n' +
          '        placeholder="검색..."\n' +
          '      />\n' +
          '      <ItemList items={filtered} />\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 2단계: Profiler로 측정\n' +
          'const onRender: ProfilerOnRenderCallback = (\n' +
          '  id, phase, actualDuration\n' +
          ') => {\n' +
          '  if (actualDuration > 16) {\n' +
          '    console.warn(`[${id}] ${phase}: ${actualDuration.toFixed(1)}ms`);\n' +
          '  }\n' +
          '};\n' +
          '\n' +
          '// 3단계: 최적화 적용\n' +
          'function OptimizedDashboard() {\n' +
          '  const [filter, setFilter] = useState("");\n' +
          '  const [data] = useState(() => generateLargeData(5000));\n' +
          '\n' +
          '  // ✅ useMemo로 필터링 결과 캐싱\n' +
          '  const filtered = useMemo(\n' +
          '    () => data.filter((item) => item.name.includes(filter)),\n' +
          '    [data, filter]\n' +
          '  );\n' +
          '\n' +
          '  return (\n' +
          '    <Profiler id="Dashboard" onRender={onRender}>\n' +
          '      <input\n' +
          '        value={filter}\n' +
          '        onChange={(e) => setFilter(e.target.value)}\n' +
          '        placeholder="검색..."\n' +
          '      />\n' +
          '      {/* ✅ 리스트 아이템 메모이제이션 */}\n' +
          '      <MemoizedItemList items={filtered} />\n' +
          '    </Profiler>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'const MemoizedItemList = memo(function ItemList(\n' +
          '  { items }: { items: { id: string; name: string }[] }\n' +
          ') {\n' +
          '  return (\n' +
          '    <ul>\n' +
          '      {items.map((item) => (\n' +
          '        <li key={item.id}>{item.name}</li>\n' +
          '      ))}\n' +
          '    </ul>\n' +
          '  );\n' +
          '});\n' +
          '\n' +
          'function ItemList({ items }: { items: { id: string; name: string }[] }) {\n' +
          '  return (\n' +
          '    <ul>\n' +
          '      {items.map((item) => (\n' +
          '        <li key={item.id}>{item.name}</li>\n' +
          '      ))}\n' +
          '    </ul>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'function generateLargeData(count: number) {\n' +
          '  return Array.from({ length: count }, (_, i) => ({\n' +
          '    id: String(i),\n' +
          '    name: `Item ${i}`,\n' +
          '  }));\n' +
          '}\n',
        description: "문제 식별 → Profiler 측정 → 최적화 → 재측정의 반복적인 워크플로가 중요합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 도구 | 용도 | 사용 시점 |\n" +
        "|------|------|----------|\n" +
        "| Components 탭 | 트리 탐색, props/state 확인 | 디버깅 시 |\n" +
        "| Profiler 탭 | 렌더링 시간 측정, 원인 분석 | 성능 최적화 시 |\n" +
        "| 렌더링 하이라이트 | 리렌더링 시각화 | 불필요한 리렌더링 탐지 |\n" +
        "| Profiler API | 프로그래밍 방식 측정 | 프로덕션 모니터링 |\n\n" +
        "**핵심:** 성능 최적화는 '측정 → 분석 → 수정 → 재측정'의 반복입니다. React DevTools의 Profiler는 이 사이클의 핵심 도구이며, 직감이 아닌 데이터에 기반한 최적화를 가능하게 합니다.\n\n" +
        "**다음 챕터 미리보기:** 코드 구조 자체로 리렌더링을 최적화하는 렌더링 최적화 패턴을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "React DevTools의 Profiler로 어떤 컴포넌트가 얼마나 자주, 왜 리렌더되는지 확인할 수 있다. 최적화는 반드시 측정 → 분석 → 적용 순서로 진행하라.",
  checklist: [
    "React DevTools의 Components 탭과 Profiler 탭의 용도를 알고 있다",
    "렌더링 하이라이트 기능을 활성화할 수 있다",
    "Profiler API의 onRender 콜백 파라미터를 이해한다",
    "actualDuration과 baseDuration의 차이를 설명할 수 있다",
    "병목 찾기 워크플로를 실행할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "React DevTools Profiler에서 Flamegraph가 보여주는 것은?",
      choices: [
        "네트워크 요청 시간",
        "각 컴포넌트의 렌더링 시간을 막대 그래프로 표시",
        "메모리 사용량",
        "DOM 노드 수",
      ],
      correctIndex: 1,
      explanation: "Flamegraph는 각 컴포넌트가 렌더링에 얼마나 시간이 걸렸는지를 색상과 크기로 시각화합니다.",
    },
    {
      id: "q2",
      question: "Profiler API의 actualDuration과 baseDuration의 차이는?",
      choices: [
        "actualDuration은 서버 시간, baseDuration은 클라이언트 시간",
        "actualDuration은 실제 렌더링 시간, baseDuration은 메모이제이션 없이의 예상 시간",
        "actualDuration은 커밋 시간, baseDuration은 렌더 시간",
        "둘은 항상 같다",
      ],
      correctIndex: 1,
      explanation: "actualDuration은 메모이제이션이 적용된 실제 시간이고, baseDuration은 모든 서브트리를 메모이제이션 없이 렌더링할 때의 예상 시간입니다.",
    },
    {
      id: "q3",
      question: "렌더링 하이라이트 기능의 용도는?",
      choices: [
        "CSS 스타일을 디버깅하기 위해",
        "어떤 컴포넌트가 리렌더링되는지 시각적으로 확인하기 위해",
        "접근성 문제를 찾기 위해",
        "네트워크 요청을 모니터링하기 위해",
      ],
      correctIndex: 1,
      explanation: "렌더링 하이라이트는 리렌더링되는 컴포넌트 주위에 테두리를 표시하여 불필요한 리렌더링을 실시간으로 탐지할 수 있습니다.",
    },
    {
      id: "q4",
      question: "성능 최적화의 올바른 워크플로 순서는?",
      choices: [
        "최적화 → 측정 → 배포",
        "측정 → 분석 → 최적화 → 재측정",
        "코드 리뷰 → 최적화 → 테스트",
        "분석 → 리팩토링 → 배포",
      ],
      correctIndex: 1,
      explanation: "먼저 측정하여 병목을 찾고, 원인을 분석한 후 최적화를 적용하고, 다시 측정하여 효과를 검증하는 반복적 과정이 올바른 워크플로입니다.",
    },
    {
      id: "q5",
      question: "Profiler API를 프로덕션에서 사용할 수 있는가?",
      choices: [
        "개발 모드에서만 사용 가능하다",
        "프로덕션 프로파일링 빌드를 사용하면 가능하다",
        "Node.js 환경에서만 사용 가능하다",
        "별도 라이브러리가 필요하다",
      ],
      correctIndex: 1,
      explanation: "React의 프로덕션 프로파일링 빌드(react-dom/profiling)를 사용하면 프로덕션에서도 Profiler API를 사용할 수 있습니다.",
    },
  ],
};

export default chapter;
