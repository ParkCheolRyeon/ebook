import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "05-time-space-complexity",
  subject: "cs",
  title: "시간 복잡도와 공간 복잡도",
  description:
    "Big O 표기법을 이해하고, 프론트엔드 코드의 성능을 분석하여 10,000개 아이템도 부드럽게 렌더링하는 방법을 학습합니다.",
  order: 5,
  group: "알고리즘 기초",
  prerequisites: ["01-array-linked-list"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "**시간 복잡도**는 택배 배달 시간을 예측하는 것과 같습니다.\n\n" +
        "- **O(1)**: 바로 옆집 배달 — 택배가 1개든 100개든 한 번에 전달\n" +
        "- **O(log n)**: 전화번호부에서 이름 찾기 — 반씩 나눠서 빠르게 검색\n" +
        "- **O(n)**: 아파트 전체에 전단지 돌리기 — 세대 수에 비례\n" +
        "- **O(n²)**: 모든 세대에 모든 세대의 전단지를 돌리기 — 세대 수의 제곱\n\n" +
        "**공간 복잡도**는 창고 크기입니다. 택배 물건이 많아질수록 " +
        "더 큰 창고(메모리)가 필요한지를 나타냅니다.\n\n" +
        "프론트엔드에서는 데이터가 100개일 때는 차이를 못 느끼지만, " +
        "10,000개가 되면 O(n)과 O(n²)의 차이가 **UI 버벅임**으로 체감됩니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드에서 성능이 중요한 상황:\n\n" +
        "1. **대량 리스트 렌더링** — 10,000개 상품 목록을 필터링/정렬할 때\n" +
        "2. **실시간 검색** — 키 입력마다 수천 개 항목에서 검색\n" +
        "3. **복잡한 상태 계산** — 중첩된 반복문에서 상태를 계산할 때\n" +
        "4. **메모리 제한** — 모바일 기기에서 대량 데이터를 메모리에 올릴 때\n" +
        "5. **애니메이션** — 16ms(60fps) 안에 프레임을 완료해야 할 때\n\n" +
        "**핵심 질문:** 내 코드가 데이터 양이 늘어나도 잘 동작할까?\n\n" +
        "Big O 표기법을 모르면 '느리다'는 것은 알아도 " +
        "'왜 느린지', '얼마나 느려질지', '어떻게 고칠지'를 판단할 수 없습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### Big O 표기법\n\n" +
        "알고리즘의 성능을 **입력 크기(n)에 대한 성장률**로 표현합니다. " +
        "상수와 낮은 차수 항은 무시하고, 최악의 경우를 기준으로 합니다.\n\n" +
        "### 주요 시간 복잡도 (빠른 순)\n\n" +
        "| 복잡도 | 이름 | n=1,000일 때 | 예시 |\n" +
        "|--------|------|-------------|------|\n" +
        "| O(1) | 상수 | 1 | 배열 인덱스 접근 |\n" +
        "| O(log n) | 로그 | ~10 | 이진 탐색 |\n" +
        "| O(n) | 선형 | 1,000 | 배열 순회 |\n" +
        "| O(n log n) | 선형 로그 | ~10,000 | 정렬 (sort) |\n" +
        "| O(n²) | 이차 | 1,000,000 | 중첩 반복문 |\n" +
        "| O(2ⁿ) | 지수 | ∞ | 부분집합 생성 |\n\n" +
        "### 공간 복잡도\n\n" +
        "알고리즘이 사용하는 **추가 메모리**의 양입니다:\n" +
        "- O(1): 변수 몇 개만 사용 (in-place)\n" +
        "- O(n): 입력 크기에 비례하는 메모리 (배열 복사)\n" +
        "- O(n²): 2D 배열 등\n\n" +
        "### 분석 규칙\n\n" +
        "1. **반복문 1개**: O(n)\n" +
        "2. **중첩 반복문**: O(n²), O(n³)...\n" +
        "3. **반복문 내 반감**: O(n log n) 또는 O(log n)\n" +
        "4. **재귀**: 호출 트리의 노드 수\n" +
        "5. **상수 연산 무시**: O(3n + 5) → O(n)",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 복잡도 분석 실전",
      content:
        "프론트엔드에서 자주 만나는 코드 패턴의 시간 복잡도를 분석합니다. " +
        "각 패턴이 왜 해당 복잡도를 가지는지 단계별로 확인합니다.",
      code: {
        language: "typescript",
        code:
          '// O(1) — 상수 시간: 입력 크기와 무관\n' +
          'function getFirst<T>(arr: T[]): T | undefined {\n' +
          '  return arr[0];  // 배열 크기와 무관하게 항상 한 번\n' +
          '}\n' +
          '\n' +
          '// O(n) — 선형 시간: 입력에 비례\n' +
          'function findMax(arr: number[]): number {\n' +
          '  let max = -Infinity;\n' +
          '  for (const num of arr) {  // n번 반복\n' +
          '    if (num > max) max = num;  // O(1) 연산\n' +
          '  }\n' +
          '  return max;  // 전체: O(n)\n' +
          '}\n' +
          '\n' +
          '// O(n²) — 이차 시간: 중첩 반복문\n' +
          '// ❌ 프론트엔드에서 주의해야 할 패턴\n' +
          'function findDuplicates(arr: string[]): string[] {\n' +
          '  const dupes: string[] = [];\n' +
          '  for (let i = 0; i < arr.length; i++) {        // n번\n' +
          '    for (let j = i + 1; j < arr.length; j++) {  // n번\n' +
          '      if (arr[i] === arr[j]) dupes.push(arr[i]);\n' +
          '    }\n' +
          '  }\n' +
          '  return dupes;  // 전체: O(n²)\n' +
          '}\n' +
          '\n' +
          '// ✅ O(n)으로 개선 — Set(해시 테이블) 활용\n' +
          'function findDuplicatesOptimized(arr: string[]): string[] {\n' +
          '  const seen = new Set<string>();    // 공간: O(n)\n' +
          '  const dupes = new Set<string>();\n' +
          '  for (const item of arr) {          // n번\n' +
          '    if (seen.has(item)) {            // O(1) 조회\n' +
          '      dupes.add(item);\n' +
          '    }\n' +
          '    seen.add(item);                  // O(1) 삽입\n' +
          '  }\n' +
          '  return [...dupes];  // 전체: O(n) 시간, O(n) 공간\n' +
          '}\n' +
          '\n' +
          '// O(log n) — 로그 시간: 반씩 줄이기\n' +
          'function binarySearch(sorted: number[], target: number): number {\n' +
          '  let low = 0, high = sorted.length - 1;\n' +
          '  while (low <= high) {\n' +
          '    const mid = Math.floor((low + high) / 2);\n' +
          '    if (sorted[mid] === target) return mid;\n' +
          '    if (sorted[mid] < target) low = mid + 1;\n' +
          '    else high = mid - 1;\n' +
          '  }  // 매번 절반으로 줄임 → O(log n)\n' +
          '  return -1;\n' +
          '}',
        description:
          "O(n²)인 중복 찾기를 Set을 활용하여 O(n)으로 개선하는 과정이 핵심입니다. 시간을 줄이기 위해 공간(메모리)을 추가로 사용하는 시간-공간 트레이드오프입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 프론트엔드 성능 최적화",
      content:
        "실제 프론트엔드 코드에서 복잡도 문제를 발견하고 최적화하는 과정을 실습합니다. " +
        "10,000개의 아이템을 다루는 상황을 가정합니다.",
      code: {
        language: "typescript",
        code:
          '// 시나리오: 상품 목록에서 선택된 상품 필터링\n' +
          'interface Product { id: string; name: string; price: number; }\n' +
          '\n' +
          '// ❌ O(n × m) — 선택된 ID마다 전체 목록을 순회\n' +
          'function getSelectedProducts_slow(\n' +
          '  products: Product[],\n' +
          '  selectedIds: string[]\n' +
          '): Product[] {\n' +
          '  return selectedIds.map(id =>\n' +
          '    products.find(p => p.id === id)  // O(n) × m번\n' +
          '  ).filter(Boolean) as Product[];\n' +
          '}\n' +
          '// products: 10,000개, selectedIds: 100개 → 1,000,000번 비교\n' +
          '\n' +
          '// ✅ O(n + m) — Map으로 O(1) 조회\n' +
          'function getSelectedProducts_fast(\n' +
          '  products: Product[],\n' +
          '  selectedIds: string[]\n' +
          '): Product[] {\n' +
          '  // 1단계: Map 생성 — O(n)\n' +
          '  const productMap = new Map(products.map(p => [p.id, p]));\n' +
          '  // 2단계: 선택된 ID로 조회 — O(m) × O(1)\n' +
          '  return selectedIds\n' +
          '    .map(id => productMap.get(id))\n' +
          '    .filter(Boolean) as Product[];\n' +
          '}\n' +
          '// products: 10,000개, selectedIds: 100개 → 10,100번 연산\n' +
          '\n' +
          '// 성능 측정 유틸리티\n' +
          'function measurePerformance<T>(fn: () => T, label: string): T {\n' +
          '  const start = performance.now();\n' +
          '  const result = fn();\n' +
          '  const end = performance.now();\n' +
          '  console.log(`${label}: ${(end - start).toFixed(2)}ms`);\n' +
          '  return result;\n' +
          '}\n' +
          '\n' +
          '// 60fps 기준: 한 프레임 = 16.67ms\n' +
          '// O(n²)이 16ms를 초과하면 프레임 드롭 발생!\n' +
          'const products = Array.from({ length: 10000 }, (_, i) => ({\n' +
          '  id: String(i),\n' +
          '  name: `상품 ${i}`,\n' +
          '  price: Math.random() * 10000,\n' +
          '}));\n' +
          'const selectedIds = Array.from({ length: 100 }, (_, i) => String(i * 100));\n' +
          '\n' +
          'measurePerformance(() => getSelectedProducts_slow(products, selectedIds), "O(n×m)");\n' +
          'measurePerformance(() => getSelectedProducts_fast(products, selectedIds), "O(n+m)");',
        description:
          "Map을 사용하여 O(n×m)을 O(n+m)으로 최적화합니다. 10,000개 상품 × 100개 선택 시, 1,000,000번 → 10,100번으로 약 100배 성능 향상입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### 프론트엔드 복잡도 가이드라인\n\n" +
        "| 데이터 크기 | 허용 복잡도 | 이유 |\n" +
        "|------------|-----------|------|\n" +
        "| ~100 | O(n²) 가능 | 체감 안됨 |\n" +
        "| ~1,000 | O(n log n) 이하 | sort까지 OK |\n" +
        "| ~10,000 | O(n) 이하 권장 | 16ms 프레임 제한 |\n" +
        "| ~100,000+ | O(n) + 가상화 | 전체 렌더링 불가 |\n\n" +
        "**시간-공간 트레이드오프:**\n" +
        "- 시간을 줄이려면 공간(캐시, Map, Set)을 추가로 사용\n" +
        "- 공간을 줄이려면 시간이 더 걸릴 수 있음 (in-place 알고리즘)\n\n" +
        "**핵심 최적화 전략:**\n" +
        "1. 중첩 반복문 → Map/Set으로 O(1) 조회 대체\n" +
        "2. 정렬이 필요하면 Array.sort() 한 번 → O(n log n)\n" +
        "3. 반복 계산 → 메모이제이션으로 캐싱\n" +
        "4. 대량 렌더링 → 가상 스크롤로 O(k) 렌더링 (k = 보이는 수)",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Big O는 코드가 데이터 증가에 얼마나 잘 견디는지의 척도 — 프론트엔드에서 O(n²)은 1만 건만 넘어도 UI가 버벅이므로, Map/Set으로 O(n)으로 개선하라.",
  checklist: [
    "O(1), O(log n), O(n), O(n log n), O(n²)의 성장률 차이를 설명할 수 있다",
    "반복문과 중첩 반복문의 시간 복잡도를 분석할 수 있다",
    "시간-공간 트레이드오프의 개념을 이해하고 활용할 수 있다",
    "O(n²)인 코드를 Map/Set으로 O(n)으로 개선할 수 있다",
    "프론트엔드에서 16ms 프레임 제한과 복잡도의 관계를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "다음 코드의 시간 복잡도는?\nfor (let i = 0; i < n; i++) {\n  for (let j = 0; j < n; j++) { ... }\n}",
      choices: ["O(n)", "O(n log n)", "O(n²)", "O(2n)"],
      correctIndex: 2,
      explanation:
        "외부 반복문이 n번, 내부 반복문이 각각 n번 실행되므로 n × n = O(n²)입니다.",
    },
    {
      id: "q2",
      question: "O(n)과 O(n²)의 차이가 가장 크게 체감되는 상황은?",
      choices: [
        "데이터가 10개일 때",
        "데이터가 100개일 때",
        "데이터가 10,000개일 때",
        "데이터가 1개일 때",
      ],
      correctIndex: 2,
      explanation:
        "n=10,000일 때 O(n)은 10,000번, O(n²)은 100,000,000번(1억)입니다. 데이터가 클수록 복잡도 차이가 극적으로 벌어집니다.",
    },
    {
      id: "q3",
      question:
        "시간-공간 트레이드오프(Time-Space Tradeoff)의 의미는?",
      choices: [
        "시간이 지나면 메모리가 자동으로 해제된다",
        "실행 시간을 줄이기 위해 추가 메모리를 사용하거나, 그 반대",
        "시간 복잡도와 공간 복잡도는 항상 같다",
        "빠른 알고리즘은 항상 메모리를 적게 쓴다",
      ],
      correctIndex: 1,
      explanation:
        "캐싱이나 Map/Set으로 조회를 O(1)로 만들면 추가 메모리(O(n))가 필요합니다. 반대로 in-place 알고리즘은 메모리를 아끼지만 시간이 더 걸릴 수 있습니다.",
    },
    {
      id: "q4",
      question: "프론트엔드에서 60fps를 유지하려면 한 프레임에 허용되는 시간은?",
      choices: ["100ms", "33ms", "약 16.67ms", "1ms"],
      correctIndex: 2,
      explanation:
        "60fps는 1초에 60프레임이므로, 한 프레임의 시간은 1000ms ÷ 60 ≈ 16.67ms입니다. 이 시간 안에 JavaScript 실행, 레이아웃, 페인트를 모두 완료해야 합니다.",
    },
    {
      id: "q5",
      question: "Array.prototype.find()의 시간 복잡도는?",
      choices: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctIndex: 2,
      explanation:
        "find()는 배열을 처음부터 순회하면서 조건에 맞는 첫 요소를 찾으므로 최악의 경우 O(n)입니다. 자주 조회한다면 Map으로 변환하여 O(1)로 개선할 수 있습니다.",
    },
  ],
};

export default chapter;
