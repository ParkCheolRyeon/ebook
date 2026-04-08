import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "07-searching",
  subject: "cs",
  title: "탐색 알고리즘",
  description:
    "선형 탐색과 이진 탐색의 원리를 이해하고, 자동완성, 디바운스 검색 등 프론트엔드 검색 최적화 패턴을 학습합니다.",
  order: 7,
  group: "알고리즘 기초",
  prerequisites: ["05-time-space-complexity"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "**선형 탐색(Linear Search)**은 서점에서 책을 찾을 때 첫 번째 책부터 " +
        "하나하나 확인하는 것입니다. 확실하지만 책이 10,000권이면 시간이 오래 걸립니다.\n\n" +
        "**이진 탐색(Binary Search)**은 전화번호부에서 이름을 찾는 것입니다. " +
        "가운데를 펴서 '가나다순으로 앞인지 뒤인지' 확인하고, 절반을 버립니다. " +
        "10,000페이지도 14번만 펼치면 찾을 수 있습니다.\n\n" +
        "핵심 조건: **이진 탐색은 정렬된 데이터에서만 사용 가능합니다.**\n\n" +
        "프론트엔드에서 탐색은 매우 빈번합니다:\n" +
        "- 검색창에 타이핑할 때마다 목록 필터링\n" +
        "- 드롭다운에서 항목 찾기\n" +
        "- 무한 스크롤에서 특정 위치 점프\n" +
        "- 자동완성 추천",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드에서 탐색 성능이 중요한 상황:\n\n" +
        "1. **실시간 검색 필터링** — 사용자가 입력할 때마다 수천 개 항목을 필터링\n" +
        "2. **자동완성(Autocomplete)** — 추천 결과를 즉시 보여줘야 함 (< 100ms)\n" +
        "3. **대량 데이터 조회** — 정렬된 테이블에서 특정 값 범위 찾기\n" +
        "4. **가상 스크롤 위치 계산** — 가변 높이 아이템에서 스크롤 위치에 해당하는 아이템 찾기\n" +
        "5. **디바운스 문제** — 키 입력마다 API를 호출하면 서버 부하와 UI 버벅임\n\n" +
        "**핵심 질문:**\n" +
        "- `Array.filter()`로 충분한가, 더 빠른 방법이 있나?\n" +
        "- 정렬된 데이터를 활용하면 얼마나 빨라질까?\n" +
        "- 검색 API 호출을 어떻게 최적화할까?",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 선형 탐색 (Linear Search) — O(n)\n\n" +
        "- 처음부터 끝까지 하나씩 확인\n" +
        "- **정렬 불필요** — 어떤 배열에서든 사용 가능\n" +
        "- `Array.find()`, `Array.filter()`, `Array.indexOf()`가 선형 탐색\n" +
        "- 소규모 데이터(~1,000)에서는 충분히 빠름\n\n" +
        "### 이진 탐색 (Binary Search) — O(log n)\n\n" +
        "- **정렬된 배열**에서만 사용 가능\n" +
        "- 중간값과 비교하여 절반씩 제거\n" +
        "- 10,000개에서 최대 14번의 비교로 탐색 완료\n" +
        "- `n=1,000,000`이어도 최대 20번 비교\n\n" +
        "### O(n) vs O(log n) 비교\n\n" +
        "| 데이터 크기 | 선형 탐색 | 이진 탐색 |\n" +
        "|------------|-----------|----------|\n" +
        "| 100 | 100번 | 7번 |\n" +
        "| 1,000 | 1,000번 | 10번 |\n" +
        "| 10,000 | 10,000번 | 14번 |\n" +
        "| 1,000,000 | 1,000,000번 | 20번 |\n\n" +
        "### 프론트엔드 검색 최적화 전략\n\n" +
        "1. **인덱스 구축**: 자주 검색하는 필드를 Map으로 인덱싱\n" +
        "2. **디바운스**: 타이핑 중 마지막 입력만 검색 실행\n" +
        "3. **Web Worker**: 대량 데이터 검색을 메인 스레드에서 분리\n" +
        "4. **서버 위임**: 데이터가 너무 크면 서버에서 검색",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 이진 탐색 알고리즘",
      content:
        "TypeScript로 이진 탐색과 그 변형을 구현합니다. " +
        "정확한 값 찾기뿐 아니라, 범위 탐색(lower bound, upper bound)도 다룹니다.",
      code: {
        language: "typescript",
        code:
          '// 기본 이진 탐색: O(log n)\n' +
          'function binarySearch(sorted: number[], target: number): number {\n' +
          '  let low = 0;\n' +
          '  let high = sorted.length - 1;\n' +
          '\n' +
          '  while (low <= high) {\n' +
          '    const mid = Math.floor((low + high) / 2);\n' +
          '\n' +
          '    if (sorted[mid] === target) {\n' +
          '      return mid;  // 찾음!\n' +
          '    } else if (sorted[mid] < target) {\n' +
          '      low = mid + 1;  // 오른쪽 절반에서 탐색\n' +
          '    } else {\n' +
          '      high = mid - 1;  // 왼쪽 절반에서 탐색\n' +
          '    }\n' +
          '  }\n' +
          '\n' +
          '  return -1;  // 못 찾음\n' +
          '}\n' +
          '\n' +
          '// Lower Bound: target 이상인 첫 번째 위치\n' +
          'function lowerBound(sorted: number[], target: number): number {\n' +
          '  let low = 0;\n' +
          '  let high = sorted.length;\n' +
          '\n' +
          '  while (low < high) {\n' +
          '    const mid = Math.floor((low + high) / 2);\n' +
          '    if (sorted[mid] < target) {\n' +
          '      low = mid + 1;\n' +
          '    } else {\n' +
          '      high = mid;\n' +
          '    }\n' +
          '  }\n' +
          '  return low;  // target 이상인 첫 인덱스\n' +
          '}\n' +
          '\n' +
          '// Upper Bound: target 초과인 첫 번째 위치\n' +
          'function upperBound(sorted: number[], target: number): number {\n' +
          '  let low = 0;\n' +
          '  let high = sorted.length;\n' +
          '\n' +
          '  while (low < high) {\n' +
          '    const mid = Math.floor((low + high) / 2);\n' +
          '    if (sorted[mid] <= target) {\n' +
          '      low = mid + 1;\n' +
          '    } else {\n' +
          '      high = mid;\n' +
          '    }\n' +
          '  }\n' +
          '  return low;  // target 초과인 첫 인덱스\n' +
          '}\n' +
          '\n' +
          '// 활용: 가격 범위 내 상품 찾기\n' +
          'const prices = [100, 200, 300, 400, 500, 600, 700, 800, 900];\n' +
          'const from = lowerBound(prices, 300);  // 2\n' +
          'const to = upperBound(prices, 700);    // 7\n' +
          'const inRange = prices.slice(from, to); // [300,400,500,600,700]',
        description:
          "기본 이진 탐색은 정확한 값을 찾고, lower/upper bound는 범위 탐색에 활용합니다. 정렬된 가격 배열에서 특정 범위의 상품을 O(log n)으로 찾을 수 있습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 디바운스 검색과 자동완성",
      content:
        "실제 프론트엔드에서 검색 기능을 최적화하는 디바운스 패턴과 " +
        "접두사(prefix) 기반 자동완성을 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// 1. 디바운스 검색 함수\n' +
          'function debounce<T extends (...args: unknown[]) => void>(\n' +
          '  fn: T,\n' +
          '  delay: number\n' +
          '): (...args: Parameters<T>) => void {\n' +
          '  let timerId: ReturnType<typeof setTimeout> | null = null;\n' +
          '\n' +
          '  return (...args: Parameters<T>) => {\n' +
          '    if (timerId) clearTimeout(timerId);\n' +
          '    timerId = setTimeout(() => fn(...args), delay);\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          '// 2. 정렬된 배열에서 접두사 검색 (이진 탐색 활용)\n' +
          'function prefixSearch(sortedWords: string[], prefix: string): string[] {\n' +
          '  // lower bound: prefix 이상인 첫 위치\n' +
          '  let low = 0, high = sortedWords.length;\n' +
          '  while (low < high) {\n' +
          '    const mid = Math.floor((low + high) / 2);\n' +
          '    if (sortedWords[mid] < prefix) low = mid + 1;\n' +
          '    else high = mid;\n' +
          '  }\n' +
          '  const start = low;\n' +
          '\n' +
          '  // prefix로 시작하는 마지막 위치 찾기\n' +
          '  // prefix의 마지막 문자를 1 증가시킨 값으로 upper bound\n' +
          '  const nextPrefix = prefix.slice(0, -1) +\n' +
          '    String.fromCharCode(prefix.charCodeAt(prefix.length - 1) + 1);\n' +
          '\n' +
          '  low = start;\n' +
          '  high = sortedWords.length;\n' +
          '  while (low < high) {\n' +
          '    const mid = Math.floor((low + high) / 2);\n' +
          '    if (sortedWords[mid] < nextPrefix) low = mid + 1;\n' +
          '    else high = mid;\n' +
          '  }\n' +
          '  const end = low;\n' +
          '\n' +
          '  return sortedWords.slice(start, end);\n' +
          '}\n' +
          '\n' +
          '// 3. 자동완성 시스템\n' +
          'class Autocomplete {\n' +
          '  private sortedItems: string[];\n' +
          '\n' +
          '  constructor(items: string[]) {\n' +
          '    this.sortedItems = [...items].sort((a, b) => a.localeCompare(b));\n' +
          '  }\n' +
          '\n' +
          '  suggest(prefix: string, maxResults = 10): string[] {\n' +
          '    if (!prefix) return [];\n' +
          '    return prefixSearch(this.sortedItems, prefix).slice(0, maxResults);\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// 사용 예시\n' +
          'const cities = new Autocomplete(["서울","세종","성남","수원","속초","순천","시흥"]);\n' +
          'cities.suggest("서");  // ["서울"] — O(log n) 접두사 검색\n' +
          'cities.suggest("수");  // ["수원"]\n' +
          'cities.suggest("스");  // [] — 일치하는 항목 없음\n' +
          '\n' +
          '// 디바운스와 결합\n' +
          'const debouncedSearch = debounce((query: string) => {\n' +
          '  const results = cities.suggest(query as string);\n' +
          '  console.log("검색 결과:", results);\n' +
          '}, 300);',
        description:
          "이진 탐색으로 접두사 매칭을 O(log n)에 수행하고, 디바운스로 불필요한 검색 호출을 줄입니다. 두 기법을 결합하면 대량 데이터에서도 부드러운 자동완성이 가능합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 탐색 방법 | 시간 복잡도 | 조건 | 프론트엔드 활용 |\n" +
        "|-----------|-----------|------|----------------|\n" +
        "| 선형 탐색 | O(n) | 없음 | find, filter, includes |\n" +
        "| 이진 탐색 | O(log n) | 정렬 필수 | 범위 검색, 자동완성 |\n" +
        "| 해시 조회 | O(1) | Map 구축 | ID로 즉시 접근 |\n\n" +
        "**프론트엔드 검색 최적화 체크리스트:**\n\n" +
        "1. 데이터 < 1,000 → `Array.filter()`로 충분\n" +
        "2. 데이터 1,000~10,000 → Map으로 인덱싱 or 정렬 후 이진 탐색\n" +
        "3. 데이터 > 10,000 → 서버 검색 + 디바운스\n" +
        "4. 실시간 입력 → 반드시 디바운스 (200~300ms)\n" +
        "5. 자동완성 → 정렬된 목록 + 이진 탐색 (접두사 검색)\n\n" +
        "**기억하세요:** 이진 탐색은 정렬이 전제 조건입니다. " +
        "정렬 비용(O(n log n))을 한 번 지불하면, 이후 모든 탐색이 O(log n)으로 빨라집니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "선형 탐색은 O(n)으로 어디서든 사용 가능, 이진 탐색은 정렬된 데이터에서 O(log n) — 디바운스와 결합하여 프론트엔드 검색을 최적화하라.",
  checklist: [
    "선형 탐색과 이진 탐색의 시간 복잡도 차이를 설명할 수 있다",
    "이진 탐색의 전제 조건(정렬)과 동작 원리를 설명할 수 있다",
    "lower bound와 upper bound의 차이와 활용법을 이해한다",
    "디바운스를 활용한 검색 최적화 패턴을 구현할 수 있다",
    "데이터 크기에 따른 적절한 탐색 전략을 선택할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "이진 탐색을 사용하기 위한 필수 전제 조건은?",
      choices: [
        "배열의 크기가 100 이상이어야 한다",
        "배열이 정렬되어 있어야 한다",
        "배열에 중복값이 없어야 한다",
        "배열의 요소가 숫자여야 한다",
      ],
      correctIndex: 1,
      explanation:
        "이진 탐색은 중간값과 비교하여 절반을 버리는 방식이므로, 배열이 정렬되어 있어야만 올바르게 동작합니다.",
    },
    {
      id: "q2",
      question: "1,000,000개의 정렬된 배열에서 이진 탐색으로 값을 찾을 때 최대 비교 횟수는?",
      choices: ["1,000,000", "1,000", "약 20", "약 100"],
      correctIndex: 2,
      explanation:
        "이진 탐색은 매번 절반으로 줄이므로 log₂(1,000,000) ≈ 20입니다. 백만 개에서도 20번만 비교하면 됩니다.",
    },
    {
      id: "q3",
      question: "프론트엔드 검색에서 디바운스(debounce)를 사용하는 이유는?",
      choices: [
        "검색 결과를 정렬하기 위해",
        "키 입력마다 검색을 실행하면 과도한 API 호출과 UI 버벅임이 발생하므로",
        "검색 결과를 캐싱하기 위해",
        "이진 탐색을 적용하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "디바운스는 마지막 입력 후 일정 시간(보통 200~300ms)이 지나야 검색을 실행합니다. 타이핑 중의 불필요한 검색을 방지하여 성능을 최적화합니다.",
    },
    {
      id: "q4",
      question:
        "Array.find()와 이진 탐색의 차이로 올바른 것은?",
      choices: [
        "find()가 항상 더 빠르다",
        "find()는 O(n)이고 이진 탐색은 O(log n)이지만, 이진 탐색은 정렬이 필요하다",
        "이진 탐색은 정렬되지 않은 배열에서도 사용할 수 있다",
        "두 방법 모두 O(log n)이다",
      ],
      correctIndex: 1,
      explanation:
        "Array.find()는 처음부터 순회하는 O(n) 선형 탐색이고, 이진 탐색은 O(log n)이지만 반드시 정렬된 배열이 필요합니다.",
    },
    {
      id: "q5",
      question: "10,000개의 도시 이름에서 자동완성을 구현할 때 가장 효율적인 방법은?",
      choices: [
        "매번 filter()로 includes() 검사",
        "정렬 후 이진 탐색으로 접두사 범위 검색",
        "정규표현식으로 매칭",
        "모든 부분 문자열을 Map에 미리 저장",
      ],
      correctIndex: 1,
      explanation:
        "데이터를 한 번 정렬(O(n log n))해두면, 이후 모든 접두사 검색이 O(log n)으로 매우 빠릅니다. filter+includes는 매번 O(n × m)이 필요합니다.",
    },
  ],
};

export default chapter;
