import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "03-hash-table",
  subject: "cs",
  title: "해시 테이블",
  description:
    "해시 함수, 충돌 처리, JavaScript의 Object/Map/Set 내부 구조를 이해하고, 캐싱과 메모이제이션에 활용합니다.",
  order: 3,
  group: "자료구조",
  prerequisites: ["01-array-linked-list"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "**해시 테이블**은 도서관의 색인 시스템입니다. " +
        "책 제목(키)을 알면 색인 카드를 통해 정확한 서가 위치(해시값)를 바로 찾을 수 있습니다. " +
        "모든 책을 하나하나 훑어볼 필요가 없죠.\n\n" +
        "**해시 함수**는 이 색인 카드를 만드는 규칙입니다. " +
        "'가' 로 시작하는 책은 1번 서가, '나'로 시작하는 책은 2번 서가... " +
        "이런 규칙으로 키를 배열의 인덱스로 변환합니다.\n\n" +
        "**충돌(Collision)**은 같은 서가에 여러 책이 배정되는 상황입니다. " +
        "'가나다'와 '가라마'가 모두 1번 서가에 가면, " +
        "서가 안에서 다시 찾아야 합니다. 이를 처리하는 방법이 충돌 해결 전략입니다.\n\n" +
        "프론트엔드에서 가장 많이 쓰는 `{}` 객체와 `Map`, `Set`이 바로 해시 테이블입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드에서 해시 테이블이 필요한 상황:\n\n" +
        "1. **빠른 데이터 조회** — 수천 개의 상품 중 특정 ID로 즉시 찾기\n" +
        "2. **중복 제거** — 태그, 카테고리 등에서 중복 없는 목록 만들기\n" +
        "3. **캐싱/메모이제이션** — API 응답이나 계산 결과를 키로 저장하여 재사용\n" +
        "4. **React key prop** — 리스트 렌더링에서 각 요소를 고유하게 식별\n" +
        "5. **상태 정규화** — Redux 등에서 `{ [id]: entity }` 패턴으로 상태를 관리\n\n" +
        "배열에서 특정 요소를 찾으려면 O(n) 순차 탐색이 필요합니다. " +
        "하지만 해시 테이블을 사용하면 **O(1)**로 즉시 접근할 수 있습니다. " +
        "이 차이가 수천, 수만 건의 데이터를 다룰 때 체감됩니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 해시 테이블의 핵심 원리\n\n" +
        "1. **해시 함수**: 키(문자열 등)를 숫자(배열 인덱스)로 변환\n" +
        "2. **버킷 배열**: 해시값을 인덱스로 사용하여 값을 저장\n" +
        "3. **충돌 처리**: 같은 해시값이 나올 때의 해결 전략\n\n" +
        "### 충돌 해결 전략\n\n" +
        "- **체이닝(Chaining)**: 같은 버킷에 연결 리스트로 여러 항목 저장\n" +
        "- **오픈 주소법(Open Addressing)**: 충돌 시 다음 빈 버킷을 탐색 — V8 엔진은 이차 탐사(Quadratic Probing) 기반의 오픈 주소법을 사용\n\n" +
        "### JavaScript의 해시 테이블 구현체\n\n" +
        "| 구현체 | 키 타입 | 순서 보장 | 사용 사례 |\n" +
        "|--------|---------|-----------|----------|\n" +
        "| Object | string, Symbol | 부분적 | 일반 데이터 |\n" +
        "| Map | 모든 타입 | 삽입 순서 | 키가 문자열이 아닌 경우 |\n" +
        "| Set | 모든 타입 | 삽입 순서 | 중복 없는 값 저장 |\n" +
        "| WeakMap | 객체만 | 없음 | 메모리 누수 방지 캐싱 |\n\n" +
        "### 성능 특성\n\n" +
        "- **삽입**: O(1) 평균\n" +
        "- **조회**: O(1) 평균\n" +
        "- **삭제**: O(1) 평균\n" +
        "- **최악의 경우**: O(n) — 모든 키가 같은 버킷에 충돌할 때 (실제로는 거의 발생하지 않음)",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 간단한 해시 테이블",
      content:
        "TypeScript로 해시 테이블의 핵심 동작 원리를 구현합니다. " +
        "체이닝 방식으로 충돌을 처리합니다.",
      code: {
        language: "typescript",
        code:
          '// 간단한 해시 테이블 구현 (체이닝 방식)\n' +
          'class SimpleHashTable<T> {\n' +
          '  private buckets: Array<Array<[string, T]>>;\n' +
          '  private size: number;\n' +
          '\n' +
          '  constructor(size: number = 53) {\n' +
          '    this.size = size;\n' +
          '    this.buckets = new Array(size).fill(null).map(() => []);\n' +
          '  }\n' +
          '\n' +
          '  // 해시 함수: 문자열 → 인덱스\n' +
          '  private hash(key: string): number {\n' +
          '    let total = 0;\n' +
          '    const PRIME = 31; // 소수를 사용하면 충돌이 줄어듦\n' +
          '    for (let i = 0; i < Math.min(key.length, 100); i++) {\n' +
          '      total = (total * PRIME + key.charCodeAt(i)) % this.size;\n' +
          '    }\n' +
          '    return total;\n' +
          '  }\n' +
          '\n' +
          '  // 삽입: O(1) 평균\n' +
          '  set(key: string, value: T): void {\n' +
          '    const index = this.hash(key);\n' +
          '    const bucket = this.buckets[index];\n' +
          '    const existing = bucket.find(([k]) => k === key);\n' +
          '    if (existing) {\n' +
          '      existing[1] = value; // 기존 키 업데이트\n' +
          '    } else {\n' +
          '      bucket.push([key, value]); // 체이닝: 버킷에 추가\n' +
          '    }\n' +
          '  }\n' +
          '\n' +
          '  // 조회: O(1) 평균\n' +
          '  get(key: string): T | undefined {\n' +
          '    const index = this.hash(key);\n' +
          '    const bucket = this.buckets[index];\n' +
          '    const found = bucket.find(([k]) => k === key);\n' +
          '    return found?.[1];\n' +
          '  }\n' +
          '\n' +
          '  // 삭제: O(1) 평균\n' +
          '  delete(key: string): boolean {\n' +
          '    const index = this.hash(key);\n' +
          '    const bucket = this.buckets[index];\n' +
          '    const i = bucket.findIndex(([k]) => k === key);\n' +
          '    if (i === -1) return false;\n' +
          '    bucket.splice(i, 1);\n' +
          '    return true;\n' +
          '  }\n' +
          '}',
        description:
          "해시 함수로 키를 인덱스로 변환하고, 체이닝(배열의 배열)으로 충돌을 처리합니다. 소수(PRIME)를 사용하면 해시 분포가 더 균일해집니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 메모이제이션과 React key 활용",
      content:
        "해시 테이블의 O(1) 조회를 활용한 메모이제이션 함수와, " +
        "상태 정규화 패턴을 구현합니다. " +
        "이 패턴은 React/Redux 애플리케이션에서 매우 자주 사용됩니다.",
      code: {
        language: "typescript",
        code:
          '// 1. 메모이제이션 함수\n' +
          'function memoize<Args extends unknown[], R>(\n' +
          '  fn: (...args: Args) => R\n' +
          '): (...args: Args) => R {\n' +
          '  const cache = new Map<string, R>();  // 해시 테이블 캐시\n' +
          '\n' +
          '  return (...args: Args): R => {\n' +
          '    const key = JSON.stringify(args);  // 인자를 키로 변환\n' +
          '    if (cache.has(key)) {\n' +
          '      return cache.get(key)!;  // O(1) 캐시 히트\n' +
          '    }\n' +
          '    const result = fn(...args);\n' +
          '    cache.set(key, result);  // O(1) 캐시 저장\n' +
          '    return result;\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          '// 사용 예시: 비용이 큰 계산 캐싱\n' +
          'const expensiveCalc = memoize((n: number) => {\n' +
          '  console.log("계산 중...");\n' +
          '  return n * n;\n' +
          '});\n' +
          'expensiveCalc(5);  // "계산 중..." → 25\n' +
          'expensiveCalc(5);  // 캐시 히트 → 25 (계산 없음)\n' +
          '\n' +
          '// 2. 상태 정규화: 배열 → 해시 맵 변환\n' +
          'interface User { id: string; name: string; email: string; }\n' +
          '\n' +
          'function normalizeArray<T extends { id: string }>(arr: T[]) {\n' +
          '  const byId = new Map<string, T>();\n' +
          '  const allIds: string[] = [];\n' +
          '  for (const item of arr) {\n' +
          '    byId.set(item.id, item);  // O(1) 삽입\n' +
          '    allIds.push(item.id);\n' +
          '  }\n' +
          '  return { byId, allIds };\n' +
          '}\n' +
          '\n' +
          '// 배열에서 특정 유저 찾기: O(n)\n' +
          '// 정규화된 맵에서 찾기: O(1)\n' +
          'const users: User[] = [\n' +
          '  { id: "1", name: "Alice", email: "alice@test.com" },\n' +
          '  { id: "2", name: "Bob", email: "bob@test.com" },\n' +
          '];\n' +
          'const { byId } = normalizeArray(users);\n' +
          'const alice = byId.get("1");  // O(1)로 즉시 접근!',
        description:
          "Map을 활용한 메모이제이션은 같은 인자에 대한 반복 계산을 O(1)로 줄입니다. 상태 정규화는 배열의 O(n) 검색을 O(1)로 최적화합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 연산 | 해시 테이블 (평균) | 배열 |\n" +
        "|------|-------------------|------|\n" +
        "| 삽입 | O(1) | O(1)* / O(n) |\n" +
        "| 키로 조회 | O(1) | O(n) |\n" +
        "| 삭제 | O(1) | O(n) |\n" +
        "| 순서 유지 | Map은 O, Object는 부분적 | O |\n\n" +
        "\\* 배열 끝에 삽입하는 경우\n\n" +
        "**프론트엔드 실무 가이드:**\n" +
        "- **Object vs Map**: 키가 문자열이고 JSON 직렬화가 필요하면 Object, 그 외에는 Map\n" +
        "- **상태 정규화**: `{ [id]: entity }` 패턴으로 O(1) 접근 확보\n" +
        "- **메모이제이션**: `useMemo`, `React.memo`, 수동 캐싱 모두 해시 테이블 기반\n" +
        "- **React key**: key prop은 Virtual DOM의 해시 맵에서 요소를 식별하는 데 사용됩니다\n" +
        "- **WeakMap**: DOM 노드나 컴포넌트 인스턴스에 메타데이터를 연결할 때 메모리 누수를 방지합니다",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "해시 테이블은 키-값 O(1) 조회의 핵심 — JS의 Object, Map, Set이 모두 해시 테이블이며, 캐싱/메모이제이션/상태 정규화의 기반이다.",
  checklist: [
    "해시 함수의 역할과 충돌 처리 방법(체이닝, 오픈 주소법)을 설명할 수 있다",
    "JavaScript Object와 Map의 차이점과 사용 기준을 설명할 수 있다",
    "메모이제이션이 해시 테이블 기반임을 이해하고 구현할 수 있다",
    "상태 정규화 패턴으로 O(n) 탐색을 O(1)로 최적화할 수 있다",
    "React key prop이 Virtual DOM에서 어떻게 활용되는지 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "해시 테이블에서 키로 값을 조회하는 평균 시간 복잡도는?",
      choices: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
      correctIndex: 2,
      explanation:
        "해시 함수로 키를 인덱스로 변환하여 바로 접근하므로 평균 O(1)입니다. 충돌이 많으면 최악 O(n)이 될 수 있지만 실제로는 드뭅니다.",
    },
    {
      id: "q2",
      question: "JavaScript에서 Object 대신 Map을 사용해야 하는 경우는?",
      choices: [
        "키가 항상 문자열일 때",
        "JSON으로 직렬화해야 할 때",
        "키가 객체이거나 삽입 순서가 중요할 때",
        "프로퍼티가 10개 미만일 때",
      ],
      correctIndex: 2,
      explanation:
        "Map은 모든 타입을 키로 사용할 수 있고 삽입 순서를 보장합니다. Object는 키가 문자열/Symbol로 제한되고 순서 보장이 완전하지 않습니다.",
    },
    {
      id: "q3",
      question:
        "해시 테이블에서 '충돌(Collision)'이란?",
      choices: [
        "같은 값이 두 번 삽입될 때",
        "서로 다른 키가 같은 해시값(인덱스)을 가질 때",
        "해시 함수가 음수를 반환할 때",
        "테이블 크기를 초과할 때",
      ],
      correctIndex: 1,
      explanation:
        "서로 다른 키가 해시 함수를 거쳐 같은 인덱스를 가리키는 것을 충돌이라 합니다. 체이닝이나 오픈 주소법으로 해결합니다.",
    },
    {
      id: "q4",
      question:
        "Redux에서 상태를 { [id]: entity } 형태로 정규화하는 이유는?",
      choices: [
        "메모리를 절약하기 위해",
        "타입 안전성을 보장하기 위해",
        "특정 엔티티를 O(1)로 즉시 조회하기 위해",
        "불변성을 유지하기 위해",
      ],
      correctIndex: 2,
      explanation:
        "배열에서 특정 ID의 엔티티를 찾으려면 O(n) 탐색이 필요하지만, 해시 맵(객체)으로 정규화하면 O(1)로 즉시 접근할 수 있습니다.",
    },
    {
      id: "q5",
      question: "WeakMap이 일반 Map과 다른 가장 큰 특징은?",
      choices: [
        "문자열 키만 허용한다",
        "키로 사용된 객체가 다른 곳에서 참조되지 않으면 가비지 컬렉션된다",
        "값을 자동으로 정렬한다",
        "크기 제한이 있다",
      ],
      correctIndex: 1,
      explanation:
        "WeakMap은 키 객체에 대한 약한 참조(weak reference)를 가지므로, 키 객체가 다른 곳에서 참조되지 않으면 GC 대상이 됩니다. DOM 노드에 메타데이터를 연결할 때 메모리 누수를 방지합니다.",
    },
  ],
};

export default chapter;
