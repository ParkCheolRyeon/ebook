import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "29-list-virtualization",
  subject: "react",
  title: "리스트 가상화",
  description: "대량 데이터 렌더링 문제, windowing 개념, react-window, react-virtuoso, 가상 스크롤 구현 원리를 이해합니다.",
  order: 29,
  group: "성능 최적화",
  prerequisites: ["28-code-splitting"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "리스트 가상화는 기차 창문 밖 풍경과 비슷합니다.\n\n" +
        "서울에서 부산까지의 풍경을 한꺼번에 볼 수 없지만, 창문을 통해 지금 지나가는 부분만 봅니다. 기차(스크롤)가 이동하면 새로운 풍경이 나타나고 지나간 풍경은 사라집니다.\n\n" +
        "**가상화(Virtualization)**도 마찬가지입니다. 10,000개의 리스트 아이템이 있지만, 실제로 DOM에 존재하는 것은 화면에 보이는 20~30개뿐입니다. 스크롤하면 보이는 영역의 아이템만 렌더링하고, 벗어난 아이템은 DOM에서 제거합니다.\n\n" +
        "마치 무한한 풍경을 작은 창문으로 보는 것처럼, 이 기법을 **윈도잉(windowing)**이라고도 합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "대량의 리스트를 모두 렌더링하면 심각한 성능 문제가 발생합니다.\n\n" +
        "1. **초기 렌더링 지연** — 10,000개의 DOM 노드를 한 번에 생성하면 수 초가 걸릴 수 있습니다.\n" +
        "2. **메모리 사용량 증가** — 각 DOM 노드는 메모리를 차지하며, 10,000개면 수백 MB에 달할 수 있습니다.\n" +
        "3. **스크롤 버벅임** — 브라우저가 모든 노드의 레이아웃을 계산하고 유지해야 하므로 스크롤이 끊깁니다.\n" +
        "4. **리렌더링 비용** — 상태 변경 시 10,000개 컴포넌트 모두의 리렌더링을 검사해야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 가상화(Virtualization) 원리\n" +
        "화면에 보이는 영역(viewport) + 약간의 오버스캔(overscan) 영역만 실제로 렌더링합니다.\n\n" +
        "### 핵심 계산\n" +
        "1. **가시 영역 계산**: 스크롤 위치와 컨테이너 높이로 현재 보이는 인덱스 범위를 계산합니다.\n" +
        "2. **아이템 위치 지정**: 각 아이템의 absolute position을 `top` 또는 `transform: translateY()`로 지정합니다.\n" +
        "3. **전체 높이 유지**: 스크롤바가 정확히 동작하도록 컨테이너의 전체 높이를 설정합니다.\n\n" +
        "### 주요 라이브러리\n" +
        "- **react-window**: 경량, 고정/가변 높이 리스트와 그리드 지원\n" +
        "- **react-virtuoso**: 동적 높이 자동 계산, 그룹 헤더, 역방향 스크롤(채팅) 지원\n" +
        "- **@tanstack/react-virtual**: 헤드리스, 프레임워크 무관\n\n" +
        "### 오버스캔(Overscan)\n" +
        "보이는 영역 위아래로 몇 개의 아이템을 미리 렌더링하여 빠른 스크롤 시 빈 화면을 방지합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 가상 스크롤 핵심 로직",
      content:
        "가상화된 리스트가 어떻게 가시 영역만 렌더링하는지 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// 가상 스크롤 핵심 로직 의사코드\n' +
          '\n' +
          'interface VirtualListConfig {\n' +
          '  totalItems: number;      // 전체 아이템 수\n' +
          '  itemHeight: number;      // 각 아이템 높이 (고정)\n' +
          '  containerHeight: number; // 컨테이너(뷰포트) 높이\n' +
          '  overscan: number;        // 위아래 추가 렌더링 수\n' +
          '}\n' +
          '\n' +
          'function calculateVisibleRange(\n' +
          '  scrollTop: number,\n' +
          '  config: VirtualListConfig\n' +
          '): { startIndex: number; endIndex: number } {\n' +
          '  const { totalItems, itemHeight, containerHeight, overscan } = config;\n' +
          '\n' +
          '  // 현재 스크롤 위치에서 첫 번째 보이는 아이템\n' +
          '  const startIndex = Math.max(\n' +
          '    0,\n' +
          '    Math.floor(scrollTop / itemHeight) - overscan\n' +
          '  );\n' +
          '\n' +
          '  // 마지막 보이는 아이템\n' +
          '  const visibleCount = Math.ceil(containerHeight / itemHeight);\n' +
          '  const endIndex = Math.min(\n' +
          '    totalItems - 1,\n' +
          '    startIndex + visibleCount + overscan * 2\n' +
          '  );\n' +
          '\n' +
          '  return { startIndex, endIndex };\n' +
          '}\n' +
          '\n' +
          '// 렌더링 로직\n' +
          'function renderVirtualList(\n' +
          '  scrollTop: number,\n' +
          '  config: VirtualListConfig\n' +
          ') {\n' +
          '  const { startIndex, endIndex } = calculateVisibleRange(scrollTop, config);\n' +
          '  const totalHeight = config.totalItems * config.itemHeight;\n' +
          '\n' +
          '  // 전체 높이를 가진 컨테이너 (스크롤바용)\n' +
          '  // <div style={{ height: totalHeight, position: "relative" }}>\n' +
          '\n' +
          '  // startIndex ~ endIndex만 렌더링\n' +
          '  const items = [];\n' +
          '  for (let i = startIndex; i <= endIndex; i++) {\n' +
          '    items.push({\n' +
          '      index: i,\n' +
          '      style: {\n' +
          '        position: "absolute" as const,\n' +
          '        top: i * config.itemHeight,\n' +
          '        height: config.itemHeight,\n' +
          '        width: "100%",\n' +
          '      },\n' +
          '    });\n' +
          '  }\n' +
          '\n' +
          '  return { totalHeight, items };\n' +
          '}\n',
        description: "스크롤 위치에서 가시 범위를 계산하고, 해당 범위의 아이템만 absolute position으로 렌더링합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 가상화 라이브러리 사용",
      content:
        "react-window와 react-virtuoso를 사용한 가상화 리스트 예제입니다.",
      code: {
        language: "typescript",
        code:
          'import { FixedSizeList, VariableSizeList } from "react-window";\n' +
          'import { Virtuoso } from "react-virtuoso";\n' +
          '\n' +
          '// ✅ react-window: 고정 높이 리스트\n' +
          'function FixedHeightList({ items }: { items: string[] }) {\n' +
          '  return (\n' +
          '    <FixedSizeList\n' +
          '      height={400}         // 컨테이너 높이\n' +
          '      width="100%"\n' +
          '      itemCount={items.length}\n' +
          '      itemSize={50}        // 각 아이템 높이\n' +
          '      overscanCount={5}    // 위아래 5개 추가 렌더링\n' +
          '    >\n' +
          '      {({ index, style }) => (\n' +
          '        <div style={style}>\n' +
          '          {items[index]}\n' +
          '        </div>\n' +
          '      )}\n' +
          '    </FixedSizeList>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ✅ react-window: 가변 높이 리스트\n' +
          'function VariableHeightList({ items }: { items: { text: string; height: number }[] }) {\n' +
          '  return (\n' +
          '    <VariableSizeList\n' +
          '      height={400}\n' +
          '      width="100%"\n' +
          '      itemCount={items.length}\n' +
          '      itemSize={(index) => items[index].height}\n' +
          '    >\n' +
          '      {({ index, style }) => (\n' +
          '        <div style={style}>\n' +
          '          {items[index].text}\n' +
          '        </div>\n' +
          '      )}\n' +
          '    </VariableSizeList>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ✅ react-virtuoso: 동적 높이 자동 계산\n' +
          'function DynamicList({ items }: { items: string[] }) {\n' +
          '  return (\n' +
          '    <Virtuoso\n' +
          '      style={{ height: 400 }}\n' +
          '      totalCount={items.length}\n' +
          '      itemContent={(index) => (\n' +
          '        <div>\n' +
          '          {/* 각 아이템 높이가 내용에 따라 달라도 OK */}\n' +
          '          <p>{items[index]}</p>\n' +
          '        </div>\n' +
          '      )}\n' +
          '    />\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 성능 비교\n' +
          '// 10,000개 아이템 기준:\n' +
          '// 일반 렌더링: DOM 노드 10,000개 → 초기 렌더링 2-5초\n' +
          '// 가상화:      DOM 노드 ~30개   → 초기 렌더링 <50ms\n',
        description: "가상화 라이브러리를 사용하면 수만 개의 아이템도 부드럽게 스크롤할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 라이브러리 | 특징 | 적합한 경우 |\n" +
        "|-----------|------|------------|\n" +
        "| react-window | 경량, 고정/가변 높이 | 단순 리스트/그리드 |\n" +
        "| react-virtuoso | 동적 높이, 그룹 헤더 | 복잡한 리스트, 채팅 |\n" +
        "| @tanstack/react-virtual | 헤드리스, 유연 | 커스텀 구현 필요 시 |\n\n" +
        "**핵심:** 가상화는 '보이는 것만 렌더링'하는 기법입니다. 수백 개 이상의 리스트에서 DOM 노드 수를 극적으로 줄여 초기 렌더링과 스크롤 성능을 개선합니다.\n\n" +
        "**다음 챕터 미리보기:** React Profiler와 DevTools를 사용해 성능 병목을 찾는 워크플로를 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "가상화가 성능을 개선하는 원리를 설명할 수 있다",
    "가시 범위 계산 로직을 이해한다",
    "오버스캔의 역할을 알고 있다",
    "react-window와 react-virtuoso의 차이를 비교할 수 있다",
    "가상화가 필요한 시점(아이템 수 기준)을 판단할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "리스트 가상화의 핵심 원리는?",
      choices: [
        "모든 아이템을 렌더링하되 display: none으로 숨기기",
        "화면에 보이는 영역의 아이템만 실제로 DOM에 렌더링하기",
        "아이템을 Canvas로 그리기",
        "서버에서 페이징 처리하기",
      ],
      correctIndex: 1,
      explanation: "가상화는 스크롤 위치를 기반으로 현재 보이는 아이템만 DOM에 렌더링하고, 나머지는 DOM에서 제거합니다.",
    },
    {
      id: "q2",
      question: "오버스캔(overscan)의 역할은?",
      choices: [
        "렌더링 속도를 높이기 위해",
        "빠른 스크롤 시 빈 화면을 방지하기 위해 여유 아이템을 렌더링",
        "메모리 사용량을 줄이기 위해",
        "스크롤바 크기를 정확히 하기 위해",
      ],
      correctIndex: 1,
      explanation: "오버스캔은 보이는 영역 위아래로 추가 아이템을 미리 렌더링하여 빠른 스크롤 시 빈 공간이 보이는 것을 방지합니다.",
    },
    {
      id: "q3",
      question: "가상화된 리스트에서 전체 높이를 유지하는 이유는?",
      choices: [
        "CSS 애니메이션을 위해",
        "스크롤바가 전체 데이터 크기에 맞게 정확히 동작하도록",
        "접근성을 위해",
        "SEO를 위해",
      ],
      correctIndex: 1,
      explanation: "전체 높이를 설정해야 스크롤바 크기와 위치가 전체 데이터를 반영하여 사용자가 자연스럽게 스크롤할 수 있습니다.",
    },
    {
      id: "q4",
      question: "react-virtuoso가 react-window보다 적합한 경우는?",
      choices: [
        "아이템 높이가 고정된 단순 리스트",
        "아이템 높이가 내용에 따라 동적으로 달라지는 리스트",
        "아이템 수가 100개 미만인 리스트",
        "서버 사이드 렌더링이 필요한 경우",
      ],
      correctIndex: 1,
      explanation: "react-virtuoso는 아이템 높이를 자동으로 측정하므로, 높이가 동적으로 변하는 복잡한 리스트에 적합합니다.",
    },
    {
      id: "q5",
      question: "10,000개 아이템 리스트를 가상화하면 실제 DOM 노드 수는 대략?",
      choices: [
        "10,000개",
        "5,000개",
        "화면에 보이는 수 + 오버스캔 (수십 개)",
        "1개",
      ],
      correctIndex: 2,
      explanation: "가상화된 리스트는 화면에 보이는 아이템 수와 오버스캔을 합한 수십 개의 DOM 노드만 유지합니다.",
    },
  ],
};

export default chapter;
