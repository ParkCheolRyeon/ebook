import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "13-cache-locality",
  subject: "cs",
  title: "캐시와 지역성",
  description:
    "CPU 캐시의 동작 원리와 지역성 개념을 이해하고, 브라우저 캐시부터 애플리케이션 레벨 메모이제이션까지 다양한 캐싱 전략을 학습합니다.",
  order: 13,
  group: "컴퓨터 구조",
  prerequisites: ["12-cpu-memory"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "**캐시**는 책상 위의 메모지입니다.\n\n" +
        "도서관(RAM)에서 책을 빌려올 때마다 걸어가야 합니다. 하지만 자주 보는 내용을 메모지(캐시)에 적어두면, " +
        "도서관에 갈 필요 없이 메모지만 보면 됩니다. 빠르지만 메모지 공간은 한정적입니다.\n\n" +
        "**시간적 지역성(Temporal Locality)**은 '방금 본 메모는 곧 다시 볼 가능성이 높다'는 원리입니다. " +
        "for 루프의 변수 `i`는 매 반복마다 접근하므로 캐시에 유지됩니다.\n\n" +
        "**공간적 지역성(Spatial Locality)**은 '한 메모 옆에 적은 메모도 곧 볼 가능성이 높다'는 원리입니다. " +
        "배열의 요소를 순서대로 읽으면, 인접한 메모리도 함께 캐시에 올라옵니다.\n\n" +
        "이 원리는 CPU 캐시뿐 아니라 모든 수준의 캐싱에 적용됩니다: " +
        "브라우저 캐시(자주 요청하는 리소스 저장), CDN(지리적으로 가까운 서버에 복제), " +
        "React의 `useMemo`(계산 결과 재사용)까지.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "캐시를 이해하지 못하면 어떤 문제가 발생할까요?\n\n" +
        "1. **비효율적인 데이터 접근** — 연결 리스트(Linked List)를 순회하면 배열보다 10배 이상 느릴 수 있습니다. " +
        "메모리가 흩어져 있어 캐시 미스(Cache Miss)가 빈번하기 때문입니다.\n\n" +
        "2. **불필요한 네트워크 요청** — 같은 API를 반복 호출하면 서버 부하와 응답 지연이 발생합니다. " +
        "HTTP 캐싱을 활용하면 브라우저가 캐시된 응답을 즉시 반환합니다.\n\n" +
        "3. **스테일 데이터 문제** — 캐시된 데이터가 오래되어 최신 정보와 다를 수 있습니다. " +
        "적절한 캐시 무효화(Cache Invalidation) 전략이 필요합니다.\n\n" +
        "4. **불필요한 재계산** — React 컴포넌트에서 비용이 큰 계산을 매 렌더링마다 반복하면 프레임 드롭이 발생합니다. " +
        "메모이제이션으로 이전 결과를 캐시할 수 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### CPU 캐시 (L1/L2/L3)\n\n" +
        "CPU는 자주 사용하는 데이터를 빠른 캐시 메모리에 저장합니다:\n\n" +
        "- **L1 캐시**: CPU 코어마다 전용, ~64KB, ~4 사이클\n" +
        "- **L2 캐시**: CPU 코어마다 전용, ~256KB, ~10 사이클\n" +
        "- **L3 캐시**: 코어 간 공유, ~수 MB, ~40 사이클\n\n" +
        "데이터가 캐시에 있으면 **캐시 히트(Cache Hit)**, 없으면 **캐시 미스(Cache Miss)**입니다. " +
        "캐시 미스가 발생하면 RAM에서 데이터를 가져오는데 ~200 사이클이 걸립니다.\n\n" +
        "### 지역성 원리\n\n" +
        "- **시간적 지역성**: 최근 접근한 데이터는 다시 접근할 가능성이 높음 (루프 변수, 자주 호출되는 함수)\n" +
        "- **공간적 지역성**: 인접한 메모리 주소도 접근할 가능성이 높음 (배열 순회)\n\n" +
        "CPU는 **캐시 라인(Cache Line)** 단위(보통 64바이트)로 데이터를 가져옵니다. " +
        "배열의 한 요소를 읽으면 인접한 요소들도 함께 캐시에 올라옵니다.\n\n" +
        "### HTTP 캐싱\n\n" +
        "- **Cache-Control**: `max-age`, `no-cache`, `no-store` 등으로 캐시 정책 설정\n" +
        "- **ETag**: 리소스의 버전 식별자. 변경 여부를 서버에 확인\n" +
        "- **304 Not Modified**: 리소스가 변경되지 않았으면 본문 없이 응답\n\n" +
        "### 애플리케이션 레벨 캐싱\n\n" +
        "- **React useMemo/useCallback**: 계산 결과나 함수 참조를 메모이제이션\n" +
        "- **SWR/React Query**: API 응답을 클라이언트에 캐싱하고 백그라운드에서 갱신\n" +
        "- **서비스 워커**: 오프라인 캐싱, 네트워크 요청 가로채기",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 캐시 친화적 코드 패턴",
      content:
        "CPU 캐시 지역성을 활용하는 코드와 애플리케이션 레벨 메모이제이션을 구현해봅시다.",
      code: {
        language: "typescript",
        code:
          '// === 배열 vs 연결 리스트: 캐시 지역성의 차이 ===\n' +
          '\n' +
          '// ✅ 배열: 연속된 메모리 → 캐시 히트율 높음\n' +
          'function sumArray(arr: number[]): number {\n' +
          '  let sum = 0;\n' +
          '  for (let i = 0; i < arr.length; i++) {\n' +
          '    sum += arr[i]; // 인접 요소가 캐시 라인에 함께 로드됨\n' +
          '  }\n' +
          '  return sum;\n' +
          '}\n' +
          '\n' +
          '// ❌ 연결 리스트: 흩어진 메모리 → 캐시 미스 빈번\n' +
          'interface ListNode {\n' +
          '  value: number;\n' +
          '  next: ListNode | null;\n' +
          '}\n' +
          '\n' +
          'function sumLinkedList(head: ListNode | null): number {\n' +
          '  let sum = 0;\n' +
          '  let current = head;\n' +
          '  while (current) {\n' +
          '    sum += current.value; // 각 노드가 다른 메모리 위치\n' +
          '    current = current.next;\n' +
          '  }\n' +
          '  return sum;\n' +
          '}\n' +
          '\n' +
          '// === 2차원 배열: 행 우선 vs 열 우선 ===\n' +
          'const matrix: number[][] = Array.from(\n' +
          '  { length: 1000 },\n' +
          '  () => Array.from({ length: 1000 }, () => 1)\n' +
          ');\n' +
          '\n' +
          '// ✅ 행 우선 순회: 캐시 친화적 (같은 내부 배열의 연속 요소를 접근)\n' +
          'let sum1 = 0;\n' +
          'for (let row = 0; row < 1000; row++) {\n' +
          '  for (let col = 0; col < 1000; col++) {\n' +
          '    sum1 += matrix[row][col]; // 연속 메모리 접근\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// ❌ 열 우선(Column-major): 캐시 비친화적\n' +
          'let sum2 = 0;\n' +
          'for (let col = 0; col < 1000; col++) {\n' +
          '  for (let row = 0; row < 1000; row++) {\n' +
          '    sum2 += matrix[row][col]; // 매번 다른 행으로 점프\n' +
          '  }\n' +
          '}',
        description:
          "배열은 연속 메모리에 저장되어 캐시 히트율이 높고, 연결 리스트는 메모리가 흩어져 캐시 미스가 빈번합니다. JS의 2차원 배열은 C/C++처럼 전체가 연속 메모리(Row-major)로 저장되는 것은 아니지만, 각 내부 배열(행)은 독립된 연속 메모리 객체이므로 행 우선 순회가 같은 객체 내 연속 요소를 접근하여 캐시 친화적입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 다양한 레벨의 캐싱 전략",
      content:
        "CPU 캐시부터 HTTP 캐시, 애플리케이션 레벨 메모이제이션까지 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// === 1. 메모이제이션 함수 구현 ===\n' +
          'function memoize<T extends (...args: any[]) => any>(fn: T): T {\n' +
          '  const cache = new Map<string, ReturnType<T>>();\n' +
          '  return ((...args: Parameters<T>): ReturnType<T> => {\n' +
          '    const key = JSON.stringify(args);\n' +
          '    if (cache.has(key)) {\n' +
          '      return cache.get(key)!; // 캐시 히트!\n' +
          '    }\n' +
          '    const result = fn(...args);\n' +
          '    cache.set(key, result);  // 캐시에 저장\n' +
          '    return result;\n' +
          '  }) as T;\n' +
          '}\n' +
          '\n' +
          '// 피보나치 + 메모이제이션 = O(n)\n' +
          'const fib = memoize((n: number): number => {\n' +
          '  if (n <= 1) return n;\n' +
          '  return fib(n - 1) + fib(n - 2);\n' +
          '});\n' +
          '\n' +
          '// === 2. LRU 캐시 (Least Recently Used) ===\n' +
          'class LRUCache<K, V> {\n' +
          '  private cache = new Map<K, V>();\n' +
          '  constructor(private maxSize: number) {}\n' +
          '\n' +
          '  get(key: K): V | undefined {\n' +
          '    if (!this.cache.has(key)) return undefined;\n' +
          '    const value = this.cache.get(key)!;\n' +
          '    // 접근한 항목을 가장 최근으로 이동\n' +
          '    this.cache.delete(key);\n' +
          '    this.cache.set(key, value);\n' +
          '    return value;\n' +
          '  }\n' +
          '\n' +
          '  set(key: K, value: V): void {\n' +
          '    if (this.cache.has(key)) this.cache.delete(key);\n' +
          '    this.cache.set(key, value);\n' +
          '    // 최대 크기 초과 시 가장 오래된 항목 제거\n' +
          '    if (this.cache.size > this.maxSize) {\n' +
          '      const oldest = this.cache.keys().next().value;\n' +
          '      this.cache.delete(oldest!);\n' +
          '    }\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// === 3. HTTP 캐시 헤더 설정 (서버 응답) ===\n' +
          '// Cache-Control: max-age=3600         → 1시간 캐시\n' +
          '// Cache-Control: no-cache             → 매번 서버에 확인\n' +
          '// Cache-Control: no-store             → 캐시 금지\n' +
          '// ETag: "abc123"                      → 버전 식별자\n' +
          '// If-None-Match: "abc123"             → 변경 확인 요청\n' +
          '\n' +
          '// === 4. fetch에서 캐시 제어 ===\n' +
          'async function fetchWithCache(url: string): Promise<Response> {\n' +
          '  return fetch(url, {\n' +
          '    cache: "default",     // 브라우저 기본 캐시 정책\n' +
          '    // "no-store"         → 캐시 무시, 항상 네트워크\n' +
          '    // "no-cache"         → 캐시 있어도 서버에 확인\n' +
          '    // "force-cache"      → 만료되어도 캐시 사용\n' +
          '  });\n' +
          '}',
        description:
          "메모이제이션, LRU 캐시, HTTP 캐시 헤더, fetch 캐시 제어까지 다양한 레벨의 캐싱 전략을 실습합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### CPU 캐시\n" +
        "- L1/L2/L3 캐시: 자주 접근하는 데이터를 빠른 메모리에 저장\n" +
        "- 캐시 라인(64바이트) 단위로 데이터 로드\n" +
        "- 배열 순회가 연결 리스트 순회보다 빠른 이유\n\n" +
        "### 지역성 원리\n" +
        "- 시간적 지역성: 최근 접근한 데이터 재접근 가능성 높음\n" +
        "- 공간적 지역성: 인접 메모리 접근 가능성 높음\n\n" +
        "### 웹 개발에서의 캐싱\n" +
        "- **HTTP 캐시**: Cache-Control, ETag로 네트워크 요청 절약\n" +
        "- **브라우저 캐시**: 정적 리소스(JS, CSS, 이미지) 캐싱\n" +
        "- **메모이제이션**: useMemo, 함수 결과 캐싱\n" +
        "- **SWR 패턴**: Stale-While-Revalidate, 캐시 반환 후 백그라운드 갱신\n\n" +
        "**핵심:** '캐시'는 CPU부터 네트워크까지 모든 레벨에서 동일한 원리로 작동합니다 — 자주 쓰는 데이터를 빠른 곳에 두고, 느린 곳에는 최소한으로 접근합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "캐시는 자주 쓰는 데이터를 빠른 곳에 저장하는 원리로, CPU 캐시부터 HTTP 캐시, 메모이제이션까지 모든 레벨에서 동일하게 적용된다.",
  checklist: [
    "L1/L2/L3 캐시의 역할과 캐시 히트/미스를 설명할 수 있다",
    "시간적 지역성과 공간적 지역성의 차이를 설명할 수 있다",
    "배열이 연결 리스트보다 순회가 빠른 이유를 캐시 관점에서 설명할 수 있다",
    "HTTP 캐시 헤더(Cache-Control, ETag)의 역할을 이해한다",
    "메모이제이션 함수를 직접 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "배열 순회가 연결 리스트 순회보다 빠른 주된 이유는?",
      choices: [
        "배열의 알고리즘 복잡도가 더 낮아서",
        "배열은 연속 메모리에 저장되어 캐시 히트율이 높아서",
        "연결 리스트는 포인터 연산이 필요해서",
        "배열은 인덱스로 직접 접근할 수 있어서",
      ],
      correctIndex: 1,
      explanation:
        "배열은 연속된 메모리에 저장되므로 하나의 요소를 읽을 때 인접 요소들도 캐시 라인(64바이트)에 함께 올라옵니다(공간적 지역성). 연결 리스트는 노드가 메모리 곳곳에 흩어져 있어 매번 캐시 미스가 발생합니다.",
    },
    {
      id: "q2",
      question: "시간적 지역성(Temporal Locality)의 예시로 가장 적절한 것은?",
      choices: [
        "배열의 연속된 요소를 순서대로 접근하는 것",
        "for 루프의 카운터 변수 i를 매 반복마다 접근하는 것",
        "큰 파일을 한 번 읽고 닫는 것",
        "랜덤한 메모리 주소에 접근하는 것",
      ],
      correctIndex: 1,
      explanation:
        "시간적 지역성은 최근에 접근한 데이터가 곧 다시 접근될 가능성이 높다는 원리입니다. for 루프의 변수 i는 매 반복마다 반복적으로 접근되므로 시간적 지역성의 전형적인 예시입니다.",
    },
    {
      id: "q3",
      question: "HTTP 응답 헤더 'Cache-Control: no-cache'의 의미는?",
      choices: [
        "캐시를 절대 사용하지 않는다",
        "캐시에 저장하되, 사용 전에 서버에 유효성을 확인한다",
        "1시간 동안 캐시를 사용한다",
        "캐시를 영구적으로 저장한다",
      ],
      correctIndex: 1,
      explanation:
        "no-cache는 '캐시 금지'가 아니라 '캐시를 사용하기 전에 서버에 확인하라'는 뜻입니다. 캐시를 아예 저장하지 않으려면 no-store를 사용해야 합니다.",
    },
    {
      id: "q4",
      question: "LRU(Least Recently Used) 캐시에서 캐시가 가득 찼을 때 제거되는 항목은?",
      choices: [
        "가장 최근에 사용된 항목",
        "가장 자주 사용된 항목",
        "가장 오랫동안 사용되지 않은 항목",
        "가장 먼저 추가된 항목",
      ],
      correctIndex: 2,
      explanation:
        "LRU는 가장 오랫동안 사용되지 않은(Least Recently Used) 항목을 제거합니다. 시간적 지역성 원리에 따라, 최근에 사용되지 않은 데이터는 앞으로도 사용될 가능성이 낮기 때문입니다.",
    },
    {
      id: "q5",
      question: "2차원 배열을 순회할 때 캐시 효율이 가장 좋은 방식은? (JavaScript 기준)",
      choices: [
        "열(column) 우선 순회",
        "행(row) 우선 순회",
        "대각선 순회",
        "랜덤 순회",
      ],
      correctIndex: 1,
      explanation:
        "JavaScript의 2차원 배열은 배열의 배열로, 각 내부 배열(행)이 별도의 힙 객체입니다. C/C++처럼 전체가 연속 메모리에 저장되는 것은 아니지만, 행 우선으로 순회하면 같은 내부 배열 객체의 연속 요소를 접근하므로 캐시 친화적입니다. 열 우선은 매번 다른 내부 배열 객체로 점프하여 캐시 미스가 발생합니다.",
    },
  ],
};

export default chapter;
