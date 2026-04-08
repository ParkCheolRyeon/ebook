import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "01-array-linked-list",
  subject: "cs",
  title: "배열과 연결 리스트",
  description:
    "프론트엔드 개발자가 반드시 알아야 할 배열과 연결 리스트의 내부 동작 원리, 성능 특성, 그리고 실무 활용법을 학습합니다.",
  order: 1,
  group: "자료구조",
  prerequisites: [],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "**배열**은 아파트입니다. 각 세대가 나란히 붙어 있고, 호수(인덱스)만 알면 바로 찾아갈 수 있습니다. " +
        "하지만 중간에 새 세대를 끼워 넣으려면 뒤의 모든 세대를 한 칸씩 밀어야 합니다.\n\n" +
        "**연결 리스트**는 보물찾기 게임입니다. 각 장소(노드)에는 보물 조각(데이터)과 다음 장소의 힌트(포인터)가 있습니다. " +
        "순서대로 따라가야만 원하는 보물을 찾을 수 있지만, 새로운 장소를 중간에 추가하는 것은 힌트만 바꾸면 되므로 매우 쉽습니다.\n\n" +
        "프론트엔드에서 배열은 가장 많이 사용하는 자료구조입니다. " +
        "JavaScript의 `Array`는 내부적으로 C++ 엔진이 관리하는 연속 메모리 또는 해시 테이블로 구현되어 있어, " +
        "상황에 따라 배열과 연결 리스트의 특성을 모두 가질 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 개발에서 데이터를 다루는 상황은 매우 다양합니다:\n\n" +
        "1. **목록 렌더링** — 수천 개의 아이템을 효율적으로 표시해야 합니다\n" +
        "2. **실시간 데이터 삽입/삭제** — 채팅 메시지, 알림 등이 계속 추가/제거됩니다\n" +
        "3. **Undo/Redo 기능** — 사용자 동작 이력을 순서대로 관리해야 합니다\n" +
        "4. **가상 스크롤** — 화면에 보이는 아이템만 렌더링하려면 인덱스 접근이 빨라야 합니다\n\n" +
        "이런 상황에서 배열과 연결 리스트의 특성을 이해하지 못하면, " +
        "성능 병목의 원인을 파악하기 어렵고 최적의 자료구조를 선택할 수 없습니다.\n\n" +
        "**핵심 질문:** 언제 배열을 쓰고, 언제 연결 리스트 패턴을 써야 할까요?",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 배열 (Array)\n\n" +
        "배열은 **연속된 메모리 공간**에 요소를 저장합니다.\n\n" +
        "- **인덱스 접근: O(1)** — 시작 주소 + (인덱스 × 요소 크기)로 바로 계산\n" +
        "- **맨 뒤 삽입/삭제: O(1)** — `push()`, `pop()`\n" +
        "- **맨 앞/중간 삽입/삭제: O(n)** — `unshift()`, `splice()`는 요소들을 이동시켜야 함\n" +
        "- **탐색: O(n)** — 정렬되지 않은 경우 순차 탐색 필요\n\n" +
        "### 연결 리스트 (Linked List)\n\n" +
        "연결 리스트는 **분산된 메모리**에 노드를 저장하고, 포인터로 연결합니다.\n\n" +
        "- **인덱스 접근: O(n)** — 처음부터 순서대로 따라가야 함\n" +
        "- **맨 앞 삽입/삭제: O(1)** — 포인터만 변경\n" +
        "- **중간 삽입/삭제: O(1)** — 위치를 알고 있다면 포인터만 변경 (탐색은 별도)\n" +
        "- **메모리 오버헤드** — 각 노드마다 포인터를 저장해야 함\n\n" +
        "### JavaScript 배열의 특수성\n\n" +
        "V8 엔진은 배열을 두 가지 모드로 관리합니다:\n\n" +
        "- **Packed (밀집) 모드**: 같은 타입의 요소가 빈 공간 없이 채워진 경우 → C 배열처럼 연속 메모리\n" +
        "- **Holey (희소) 모드**: 빈 공간(hole)이 있는 경우 → 여전히 빠른 요소 저장(Fast Elements)을 사용하지만, 매 접근마다 hole 체크가 추가되어 Packed보다 느림\n" +
        "- **Dictionary (딕셔너리) 모드**: 인덱스가 매우 희소하거나(예: 인덱스 > 1024인데 밀도 < 50%), 요소 삭제가 빈번한 경우 → 해시 테이블로 전환\n\n" +
        "따라서 **같은 타입의 요소를 빈 공간 없이 사용하는 것**이 성능 최적화의 핵심입니다. " +
        "Holey 모드는 느려지지만 여전히 배열 구조이고, Dictionary 모드가 되어야 해시 테이블로 전환됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 연결 리스트 구현",
      content:
        "TypeScript로 단일 연결 리스트를 구현하여 내부 동작 원리를 이해합니다. " +
        "프론트엔드에서는 Undo/Redo 이력 관리나 LRU 캐시 등에 활용할 수 있습니다.",
      code: {
        language: "typescript",
        code:
          '// 노드 정의\n' +
          'interface ListNode<T> {\n' +
          '  value: T;\n' +
          '  next: ListNode<T> | null;\n' +
          '}\n' +
          '\n' +
          '// 단일 연결 리스트\n' +
          'class LinkedList<T> {\n' +
          '  private head: ListNode<T> | null = null;\n' +
          '  private _size: number = 0;\n' +
          '\n' +
          '  get size(): number {\n' +
          '    return this._size;\n' +
          '  }\n' +
          '\n' +
          '  // 맨 앞에 삽입: O(1)\n' +
          '  prepend(value: T): void {\n' +
          '    const newNode: ListNode<T> = { value, next: this.head };\n' +
          '    this.head = newNode;\n' +
          '    this._size++;\n' +
          '  }\n' +
          '\n' +
          '  // 맨 뒤에 삽입: O(n) - tail 포인터가 없는 경우\n' +
          '  append(value: T): void {\n' +
          '    const newNode: ListNode<T> = { value, next: null };\n' +
          '    if (!this.head) {\n' +
          '      this.head = newNode;\n' +
          '    } else {\n' +
          '      let current = this.head;\n' +
          '      while (current.next) {\n' +
          '        current = current.next;\n' +
          '      }\n' +
          '      current.next = newNode;\n' +
          '    }\n' +
          '    this._size++;\n' +
          '  }\n' +
          '\n' +
          '  // 인덱스로 접근: O(n)\n' +
          '  get(index: number): T | undefined {\n' +
          '    let current = this.head;\n' +
          '    for (let i = 0; i < index && current; i++) {\n' +
          '      current = current.next;\n' +
          '    }\n' +
          '    return current?.value;\n' +
          '  }\n' +
          '\n' +
          '  // 맨 앞 삭제: O(1)\n' +
          '  removeFirst(): T | undefined {\n' +
          '    if (!this.head) return undefined;\n' +
          '    const value = this.head.value;\n' +
          '    this.head = this.head.next;\n' +
          '    this._size--;\n' +
          '    return value;\n' +
          '  }\n' +
          '}',
        description:
          "연결 리스트의 핵심 연산을 구현합니다. prepend는 O(1), get은 O(n)으로 배열과 반대되는 성능 특성을 확인할 수 있습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 가상 스크롤에서의 배열 활용",
      content:
        "프론트엔드에서 수천 개의 리스트 아이템을 렌더링할 때, 가상 스크롤은 " +
        "화면에 보이는 아이템만 DOM에 렌더링합니다. 이때 배열의 O(1) 인덱스 접근이 핵심입니다.",
      code: {
        language: "typescript",
        code:
          '// 가상 스크롤의 핵심 로직\n' +
          'interface VirtualScrollConfig {\n' +
          '  items: string[];          // 전체 데이터 배열\n' +
          '  itemHeight: number;       // 각 아이템 높이 (px)\n' +
          '  containerHeight: number;  // 컨테이너 높이 (px)\n' +
          '  scrollTop: number;        // 현재 스크롤 위치\n' +
          '}\n' +
          '\n' +
          'function getVisibleItems(config: VirtualScrollConfig) {\n' +
          '  const { items, itemHeight, containerHeight, scrollTop } = config;\n' +
          '\n' +
          '  // 배열 인덱스 계산: O(1)\n' +
          '  const startIndex = Math.floor(scrollTop / itemHeight);\n' +
          '  const visibleCount = Math.ceil(containerHeight / itemHeight);\n' +
          '  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);\n' +
          '\n' +
          '  // 배열 slice: O(k) - k는 보이는 아이템 수\n' +
          '  const visibleItems = items.slice(startIndex, endIndex);\n' +
          '\n' +
          '  return {\n' +
          '    visibleItems,\n' +
          '    startIndex,\n' +
          '    totalHeight: items.length * itemHeight,\n' +
          '    offsetY: startIndex * itemHeight,\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          '// 사용 예시\n' +
          'const result = getVisibleItems({\n' +
          '  items: Array.from({ length: 10000 }, (_, i) => `아이템 ${i}`),\n' +
          '  itemHeight: 40,\n' +
          '  containerHeight: 400,\n' +
          '  scrollTop: 2000,\n' +
          '});\n' +
          '// startIndex: 50, 10개의 아이템만 렌더링\n' +
          '// 배열이므로 인덱스 접근이 O(1) → 스크롤 성능 보장',
        description:
          "가상 스크롤에서 배열의 O(1) 인덱스 접근이 왜 중요한지 보여줍니다. 연결 리스트였다면 매 스크롤마다 O(n) 탐색이 필요했을 것입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 연산 | 배열 | 연결 리스트 |\n" +
        "|------|------|-------------|\n" +
        "| 인덱스 접근 | O(1) | O(n) |\n" +
        "| 맨 앞 삽입 | O(n) | O(1) |\n" +
        "| 맨 뒤 삽입 | O(1)* | O(n)** |\n" +
        "| 중간 삽입 | O(n) | O(1)*** |\n" +
        "| 탐색 | O(n) | O(n) |\n\n" +
        "\\* amortized, \\*\\* tail 포인터 없는 경우, \\*\\*\\* 위치를 이미 아는 경우\n\n" +
        "**프론트엔드 실무 가이드:**\n" +
        "- **배열 사용**: 목록 렌더링, 가상 스크롤, 필터/정렬, 대부분의 상태 관리\n" +
        "- **연결 리스트 패턴**: Undo/Redo 이력, LRU 캐시, 순차적 데이터 처리\n\n" +
        "JavaScript의 `Array`는 대부분의 상황에서 최적화되어 있으므로, " +
        "특별한 이유가 없다면 배열을 사용하되, 내부 동작 원리를 이해하여 성능 함정을 피하세요.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "배열은 인덱스 접근 O(1), 연결 리스트는 삽입/삭제 O(1) — JS 배열은 대부분 최적이지만, 내부 동작을 알아야 성능 함정을 피할 수 있다.",
  checklist: [
    "배열과 연결 리스트의 시간 복잡도 차이를 설명할 수 있다",
    "V8 엔진의 Packed/Holey 배열 모드를 이해한다",
    "가상 스크롤에서 배열의 O(1) 접근이 중요한 이유를 설명할 수 있다",
    "연결 리스트가 유리한 상황(빈번한 삽입/삭제)을 예시와 함께 설명할 수 있다",
    "JavaScript Array의 unshift()가 느린 이유를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "배열에서 인덱스로 요소에 접근하는 시간 복잡도는?",
      choices: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
      correctIndex: 2,
      explanation:
        "배열은 연속된 메모리에 저장되므로, 시작 주소 + (인덱스 × 요소 크기)로 바로 접근할 수 있어 O(1)입니다.",
    },
    {
      id: "q2",
      question:
        "JavaScript에서 Array.prototype.unshift()의 시간 복잡도는?",
      choices: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correctIndex: 2,
      explanation:
        "unshift()는 맨 앞에 요소를 삽입하므로, 기존 모든 요소의 인덱스를 한 칸씩 뒤로 밀어야 합니다. 따라서 O(n)입니다.",
    },
    {
      id: "q3",
      question: "V8 엔진에서 배열이 Holey(희소) 모드로 전환되는 경우는?",
      choices: [
        "배열 크기가 100을 초과할 때",
        "배열에 빈 공간이 있거나 타입이 혼합될 때",
        "const로 선언했을 때",
        "push()를 사용했을 때",
      ],
      correctIndex: 1,
      explanation:
        "V8은 배열에 빈 공간(hole)이 생기면 Holey 모드로 전환합니다. Holey 모드는 여전히 빠른 요소 저장을 사용하지만 매 접근마다 hole 체크가 추가됩니다. 인덱스가 매우 희소하거나 삭제가 빈번하면 Dictionary 모드(해시 테이블)로 전환됩니다.",
    },
    {
      id: "q4",
      question:
        "가상 스크롤(Virtual Scroll)에서 배열이 연결 리스트보다 유리한 이유는?",
      choices: [
        "메모리 사용량이 적어서",
        "삽입/삭제가 빨라서",
        "인덱스 기반 O(1) 접근으로 스크롤 위치 계산이 빠르기 때문",
        "정렬이 빠르기 때문",
      ],
      correctIndex: 2,
      explanation:
        "가상 스크롤은 scrollTop 위치를 기반으로 보여줄 아이템의 시작 인덱스를 계산합니다. 배열은 O(1)로 인덱스 접근이 가능하여 60fps 스크롤 성능을 유지할 수 있습니다.",
    },
    {
      id: "q5",
      question: "단일 연결 리스트에서 맨 앞 노드를 삭제하는 시간 복잡도는?",
      choices: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctIndex: 0,
      explanation:
        "head 포인터를 다음 노드로 변경하면 되므로 O(1)입니다. 반면 배열에서 맨 앞 요소를 제거하면 O(n)이 필요합니다.",
    },
  ],
};

export default chapter;
