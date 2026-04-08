import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "06-sorting",
  subject: "cs",
  title: "정렬 알고리즘",
  description:
    "주요 정렬 알고리즘의 원리를 이해하고, Array.prototype.sort()의 내부 동작(TimSort)과 프론트엔드 리스트 정렬 최적화를 학습합니다.",
  order: 6,
  group: "알고리즘 기초",
  prerequisites: ["05-time-space-complexity"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "정렬 알고리즘은 도서관에서 책을 정리하는 다양한 방법입니다.\n\n" +
        "**버블 정렬**: 옆의 책과 비교하며 한 칸씩 밀어 올리기 — 느리지만 단순합니다.\n\n" +
        "**선택 정렬**: 전체를 훑어 가장 얇은 책을 찾아 맨 앞에 놓기 — 항상 전체를 살펴봐야 합니다.\n\n" +
        "**삽입 정렬**: 새 책을 받으면 이미 정리된 서가에서 올바른 위치에 끼워 넣기 — " +
        "거의 정렬된 상태라면 매우 빠릅니다.\n\n" +
        "**병합 정렬**: 책을 반으로 나눠서 각각 정렬한 뒤 합치기 — 안정적이고 항상 O(n log n).\n\n" +
        "**퀵 정렬**: 기준 책(피벗)을 정해 더 얇은/두꺼운 책으로 분류 — 평균적으로 가장 빠릅니다.\n\n" +
        "JavaScript의 `Array.sort()`는 **TimSort**를 사용합니다. " +
        "삽입 정렬과 병합 정렬을 결합한 하이브리드 방식으로, 실제 데이터에 최적화되어 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드에서 정렬이 필요한 상황:\n\n" +
        "1. **테이블 정렬** — 가격순, 이름순, 날짜순 등 컬럼별 정렬\n" +
        "2. **검색 결과 정렬** — 관련도, 최신순, 인기순\n" +
        "3. **드래그 앤 드롭** — 아이템 순서 재배치\n" +
        "4. **차트 데이터** — 축 정렬, 범례 순서\n" +
        "5. **페이지네이션** — 서버에서 정렬? 클라이언트에서 정렬?\n\n" +
        "**핵심 질문들:**\n" +
        "- `Array.sort()`를 그냥 쓰면 되는 건가? 안정(stable) 정렬인가?\n" +
        "- 10,000개 리스트를 정렬하면 렌더링이 버벅일까?\n" +
        "- 이미 거의 정렬된 데이터를 다시 정렬하면 얼마나 걸릴까?\n" +
        "- 정렬 기준이 바뀔 때마다 전체를 다시 정렬해야 하나?",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 정렬 알고리즘 비교\n\n" +
        "| 알고리즘 | 평균 | 최악 | 공간 | 안정 | 특징 |\n" +
        "|----------|------|------|------|------|------|\n" +
        "| 버블 | O(n²) | O(n²) | O(1) | ✅ | 교육용, 실무 비사용 |\n" +
        "| 선택 | O(n²) | O(n²) | O(1) | ❌ | 교환 횟수 최소 |\n" +
        "| 삽입 | O(n²) | O(n²) | O(1) | ✅ | 거의 정렬된 데이터에 강함 |\n" +
        "| 병합 | O(n log n) | O(n log n) | O(n) | ✅ | 안정적 성능 보장 |\n" +
        "| 퀵 | O(n log n) | O(n²) | O(log n)* | ❌ | 평균 가장 빠름 |\n" +
        "| TimSort | O(n log n) | O(n log n) | O(n) | ✅ | JS sort() 내부 |\n\n" +
        "\\* 퀵 정렬의 공간 복잡도: in-place 구현은 평균 O(log n), 최악(피벗이 매번 최솟/최댓값) O(n). 아래 코드의 함수형 구현은 filter()를 사용하므로 O(n).\n\n" +
        "### 안정(Stable) 정렬이란?\n\n" +
        "같은 값의 요소들이 **원래 순서를 유지**하는 정렬입니다. " +
        "예: 가격순으로 정렬된 상품을 다시 카테고리순으로 정렬하면, " +
        "같은 카테고리 내에서 가격순이 유지되어야 합니다. " +
        "ES2019부터 `Array.sort()`가 안정 정렬로 명세에 포함되었습니다.\n\n" +
        "### TimSort의 핵심 아이디어\n\n" +
        "1. 배열을 이미 정렬된 구간(run)으로 나눔\n" +
        "2. 작은 구간은 삽입 정렬로 처리 (작은 데이터에 삽입 정렬이 빠름)\n" +
        "3. 구간들을 병합 정렬로 합침\n" +
        "4. 이미 정렬된 데이터에서 거의 O(n)에 가깝게 동작",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 주요 정렬 알고리즘",
      content:
        "핵심 정렬 알고리즘 3가지를 TypeScript로 구현합니다. " +
        "각 알고리즘의 동작 원리와 성능 차이를 직접 확인합니다.",
      code: {
        language: "typescript",
        code:
          '// 1. 삽입 정렬: O(n²), 거의 정렬된 데이터에 O(n)\n' +
          'function insertionSort(arr: number[]): number[] {\n' +
          '  const result = [...arr];\n' +
          '  for (let i = 1; i < result.length; i++) {\n' +
          '    const current = result[i];\n' +
          '    let j = i - 1;\n' +
          '    // 현재 요소보다 큰 요소를 오른쪽으로 밀기\n' +
          '    while (j >= 0 && result[j] > current) {\n' +
          '      result[j + 1] = result[j];\n' +
          '      j--;\n' +
          '    }\n' +
          '    result[j + 1] = current;  // 올바른 위치에 삽입\n' +
          '  }\n' +
          '  return result;\n' +
          '}\n' +
          '\n' +
          '// 2. 병합 정렬: O(n log n), 안정 정렬\n' +
          'function mergeSort(arr: number[]): number[] {\n' +
          '  if (arr.length <= 1) return arr;\n' +
          '\n' +
          '  const mid = Math.floor(arr.length / 2);\n' +
          '  const left = mergeSort(arr.slice(0, mid));   // 분할\n' +
          '  const right = mergeSort(arr.slice(mid));      // 분할\n' +
          '\n' +
          '  return merge(left, right);                    // 병합\n' +
          '}\n' +
          '\n' +
          'function merge(left: number[], right: number[]): number[] {\n' +
          '  const result: number[] = [];\n' +
          '  let i = 0, j = 0;\n' +
          '  while (i < left.length && j < right.length) {\n' +
          '    if (left[i] <= right[j]) result.push(left[i++]);\n' +
          '    else result.push(right[j++]);\n' +
          '  }\n' +
          '  return [...result, ...left.slice(i), ...right.slice(j)];\n' +
          '}\n' +
          '\n' +
          '// 3. 퀵 정렬: 평균 O(n log n), 최악 O(n²)\n' +
          'function quickSort(arr: number[]): number[] {\n' +
          '  if (arr.length <= 1) return arr;\n' +
          '\n' +
          '  const pivot = arr[Math.floor(arr.length / 2)];\n' +
          '  const left = arr.filter(x => x < pivot);\n' +
          '  const equal = arr.filter(x => x === pivot);\n' +
          '  const right = arr.filter(x => x > pivot);\n' +
          '\n' +
          '  return [...quickSort(left), ...equal, ...quickSort(right)];\n' +
          '}',
        description:
          "삽입 정렬은 소규모/거의 정렬된 데이터에 유리하고, 병합 정렬은 안정적 O(n log n)을 보장합니다. TimSort는 이 둘을 결합합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 프론트엔드 테이블 정렬",
      content:
        "실제 프론트엔드에서 테이블 데이터를 여러 기준으로 정렬하는 실무 패턴을 구현합니다. " +
        "비교 함수(comparator) 작성법과 다중 정렬 기준을 다룹니다.",
      code: {
        language: "typescript",
        code:
          '// 테이블 정렬을 위한 유틸리티\n' +
          'interface SortConfig<T> {\n' +
          '  key: keyof T;\n' +
          '  direction: "asc" | "desc";\n' +
          '}\n' +
          '\n' +
          '// 범용 정렬 함수\n' +
          'function sortBy<T>(items: T[], configs: SortConfig<T>[]): T[] {\n' +
          '  return [...items].sort((a, b) => {\n' +
          '    for (const { key, direction } of configs) {\n' +
          '      const valA = a[key];\n' +
          '      const valB = b[key];\n' +
          '      let comparison = 0;\n' +
          '\n' +
          '      if (typeof valA === "string" && typeof valB === "string") {\n' +
          '        comparison = valA.localeCompare(valB, "ko");  // 한국어 정렬\n' +
          '      } else if (typeof valA === "number" && typeof valB === "number") {\n' +
          '        comparison = valA - valB;\n' +
          '      }\n' +
          '\n' +
          '      if (comparison !== 0) {\n' +
          '        return direction === "desc" ? -comparison : comparison;\n' +
          '      }\n' +
          '    }\n' +
          '    return 0;  // 모든 기준이 같으면 원래 순서 유지 (안정 정렬)\n' +
          '  });\n' +
          '}\n' +
          '\n' +
          '// 사용 예시\n' +
          'interface Product {\n' +
          '  name: string;\n' +
          '  category: string;\n' +
          '  price: number;\n' +
          '  rating: number;\n' +
          '}\n' +
          '\n' +
          'const products: Product[] = [\n' +
          '  { name: "노트북", category: "전자기기", price: 1200000, rating: 4.5 },\n' +
          '  { name: "마우스", category: "전자기기", price: 35000, rating: 4.2 },\n' +
          '  { name: "책상", category: "가구", price: 250000, rating: 4.8 },\n' +
          '  { name: "의자", category: "가구", price: 450000, rating: 4.6 },\n' +
          '];\n' +
          '\n' +
          '// 카테고리 오름차순 → 같은 카테고리 내에서 가격 내림차순\n' +
          'const sorted = sortBy(products, [\n' +
          '  { key: "category", direction: "asc" },\n' +
          '  { key: "price", direction: "desc" },\n' +
          ']);\n' +
          '// 결과: 가구(의자→책상), 전자기기(노트북→마우스)\n' +
          '\n' +
          '// ⚠️ sort() 주의사항\n' +
          '// 숫자 배열을 그냥 sort()하면 문자열로 비교됨!\n' +
          '// [10, 9, 2].sort()  → [10, 2, 9] (❌)\n' +
          '// [10, 9, 2].sort((a, b) => a - b) → [2, 9, 10] (✅)',
        description:
          "다중 기준 정렬을 comparator 체이닝으로 구현합니다. localeCompare로 한국어 정렬을 지원하고, 안정 정렬 덕분에 같은 기준 내에서 원래 순서가 유지됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### 프론트엔드 정렬 실무 가이드\n\n" +
        "1. **`Array.sort()`를 사용하세요** — 내부적으로 TimSort(O(n log n), 안정)이므로 직접 구현할 필요 없습니다\n" +
        "2. **비교 함수를 항상 명시하세요** — 숫자도 `(a, b) => a - b` 필수\n" +
        "3. **원본을 변경합니다** — `[...arr].sort()`로 불변성 유지\n" +
        "4. **한국어 정렬** — `localeCompare('ko')`를 사용\n" +
        "5. **대량 데이터** — 10,000건 이상이면 Web Worker에서 정렬하거나 서버 정렬 고려\n\n" +
        "**정렬 알고리즘을 아는 것이 중요한 이유:**\n" +
        "- `sort()`의 성능 특성(O(n log n))을 알아야 전체 코드의 복잡도를 분석할 수 있습니다\n" +
        "- 안정 정렬 개념을 알아야 다중 기준 정렬을 올바르게 구현할 수 있습니다\n" +
        "- 면접에서 자주 출제되는 필수 CS 지식입니다",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "JS의 Array.sort()는 TimSort(O(n log n), 안정 정렬) — 비교 함수를 반드시 명시하고, 원본 변경에 주의하며, 대량 데이터는 서버 정렬을 고려하라.",
  checklist: [
    "버블/선택/삽입/병합/퀵 정렬의 시간 복잡도를 비교할 수 있다",
    "안정(stable) 정렬의 의미와 중요성을 설명할 수 있다",
    "Array.sort()의 내부 동작(TimSort)과 특성을 설명할 수 있다",
    "비교 함수(comparator)를 올바르게 작성할 수 있다",
    "다중 기준 정렬을 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "[3, 1, 2].sort()의 결과는?",
      choices: ["[1, 2, 3]", "[3, 2, 1]", "[1, 2, 3] (문자열 비교)", "[3, 1, 2]"],
      correctIndex: 2,
      explanation:
        "인자 없이 sort()를 호출하면 요소를 문자열로 변환하여 유니코드 순으로 비교합니다. 숫자의 경우 '1' < '2' < '3'이므로 우연히 올바른 결과가 나오지만, [10, 9, 2].sort()는 [10, 2, 9]가 됩니다.",
    },
    {
      id: "q2",
      question: "TimSort가 삽입 정렬과 병합 정렬을 결합한 이유는?",
      choices: [
        "코드가 간단해서",
        "삽입 정렬이 소규모/거의 정렬된 데이터에 빠르고, 병합 정렬이 대규모에서 안정적이므로",
        "두 알고리즘이 O(1) 공간을 사용해서",
        "퀵 정렬보다 항상 빨라서",
      ],
      correctIndex: 1,
      explanation:
        "TimSort는 배열에서 이미 정렬된 구간(run)을 삽입 정렬로 빠르게 확장하고, 이 구간들을 병합 정렬로 합칩니다. 실제 데이터는 부분적으로 정렬된 경우가 많아 매우 효율적입니다.",
    },
    {
      id: "q3",
      question: "안정(stable) 정렬이 프론트엔드에서 중요한 이유는?",
      choices: [
        "성능이 더 빠르기 때문",
        "메모리를 적게 사용하기 때문",
        "같은 값의 요소들이 원래 순서를 유지하여 다중 기준 정렬이 올바르게 동작하기 때문",
        "코드가 더 간결하기 때문",
      ],
      correctIndex: 2,
      explanation:
        "예를 들어 가격순으로 정렬된 상품을 다시 카테고리순으로 정렬할 때, 안정 정렬이면 같은 카테고리 내에서 가격순이 유지됩니다.",
    },
    {
      id: "q4",
      question:
        "Array.sort()의 주의사항으로 올바르지 않은 것은?",
      choices: [
        "원본 배열을 변경한다(mutate)",
        "비교 함수 없이 사용하면 문자열로 비교한다",
        "ES2019부터 안정 정렬이 보장된다",
        "항상 새 배열을 반환한다",
      ],
      correctIndex: 3,
      explanation:
        "Array.sort()는 원본 배열을 직접 변경(mutate)하고 같은 배열의 참조를 반환합니다. 불변성을 유지하려면 [...arr].sort()를 사용해야 합니다.",
    },
    {
      id: "q5",
      question:
        "10,000개의 아이템을 정렬할 때 가장 적합한 접근 방식은?",
      choices: [
        "버블 정렬을 직접 구현한다",
        "Array.sort()에 비교 함수를 전달한다",
        "이진 탐색으로 정렬한다",
        "해시 테이블로 정렬한다",
      ],
      correctIndex: 1,
      explanation:
        "Array.sort()는 내부적으로 TimSort(O(n log n))를 사용하므로, 직접 구현하는 것보다 최적화되어 있습니다. 비교 함수만 올바르게 전달하면 됩니다.",
    },
  ],
};

export default chapter;
