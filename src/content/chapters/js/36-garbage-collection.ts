import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "36-garbage-collection",
  subject: "js",
  title: "가비지 컬렉션",
  description: "자바스크립트 엔진의 메모리 생명주기, 참조 카운팅, Mark-and-Sweep 알고리즘, 세대별 GC, WeakRef와 FinalizationRegistry를 깊이 이해합니다.",
  order: 36,
  group: "메모리와 최적화",
  prerequisites: ["35-error-handling"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "가비지 컬렉션은 '도서관의 자동 책 반납 시스템'과 같습니다.\n\n" +
        "도서관(메모리)에는 책들(객체들)이 있습니다. 사람들(변수/참조)이 책을 빌려 읽습니다. 아무도 더 이상 읽지 않는 책은 자동으로 반납되어 새 책이 들어올 공간을 만듭니다.\n\n" +
        "**참조 카운팅(Reference Counting)**은 각 책에 '지금 몇 명이 읽고 있나' 스탬프를 찍는 방식입니다. 카운트가 0이 되면 즉시 반납합니다. 하지만 두 사람이 서로의 책을 가리키며 아무도 안 읽는 '순환' 상황에서 실패합니다.\n\n" +
        "**Mark-and-Sweep**은 '사서가 정기적으로 순찰'하는 방식입니다. 입구(전역)에서 출발해 연결된 모든 책에 형광 표시를 합니다. 표시 없는 책은 전부 반납합니다. 순환 참조도 해결됩니다.\n\n" +
        "**세대별 GC**는 '새 책은 더 자주 확인하고, 오래된 책은 가끔 확인'하는 전략입니다. 새로 생성된 객체는 대부분 금방 버려지므로 자주 검사하고, 오래 살아남은 객체는 드물게 검사합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "자바스크립트는 가비지 컬렉션(GC)을 자동으로 수행하지만, 개발자가 메모리를 이해하지 못하면 심각한 문제가 발생합니다.\n\n" +
        "**문제 1: 메모리 누수**\n" +
        "```js\n" +
        "// GC가 해제하지 못하는 상황\n" +
        "let cache = {};\n" +
        "function addToCache(key, largeData) {\n" +
        "  cache[key] = largeData; // 캐시에 추가, 제거 로직 없음\n" +
        "  // cache가 전역 → largeData는 영원히 메모리에!\n" +
        "}\n" +
        "```\n\n" +
        "**문제 2: GC 일시정지(Stop-The-World)**\n" +
        "GC가 실행되는 동안 JavaScript 실행이 일시 정지됩니다. 힙이 클수록, GC가 오래 걸릴수록 앱이 멈춥니다.\n\n" +
        "**문제 3: WeakRef 없이는 캐시가 메모리 누수**\n" +
        "```js\n" +
        "// DOM 요소를 맵에 저장하면?\n" +
        "const elementData = new Map();\n" +
        "elementData.set(domElement, { clicks: 0 });\n" +
        "// DOM에서 요소 제거해도 Map이 참조 유지 → GC 못함!\n" +
        "```",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 메모리 생명주기\n\n" +
        "1. **할당** — 변수 선언, 객체 생성 시 힙/스택에 메모리 확보\n" +
        "2. **사용** — 읽기/쓰기\n" +
        "3. **해제** — GC가 더 이상 참조되지 않는 메모리를 회수\n\n" +
        "### 참조 카운팅 (Reference Counting)\n\n" +
        "각 객체가 몇 개의 참조를 받는지 카운트합니다. 카운트가 0이 되면 즉시 해제합니다.\n\n" +
        "**단점:** 순환 참조 해제 불가\n" +
        "```js\n" +
        "let a = {}; let b = {};\n" +
        "a.ref = b; b.ref = a; // 서로 참조\n" +
        "a = null; b = null;   // 참조 카운트는 여전히 1 → 해제 불가!\n" +
        "```\n\n" +
        "### Mark-and-Sweep\n\n" +
        "현대 JS 엔진(V8 등)이 사용하는 방식입니다.\n\n" +
        "1. **Mark 단계** — GC 루트(전역, 스택)에서 출발해 도달 가능한 모든 객체에 표시\n" +
        "2. **Sweep 단계** — 표시 없는 객체를 메모리에서 해제\n\n" +
        "순환 참조도 GC 루트에서 도달 불가하면 해제됩니다.\n\n" +
        "### 세대별 GC (Generational GC)\n\n" +
        "V8은 힙을 **Young Generation**과 **Old Generation**으로 나눕니다.\n\n" +
        "- **Young Gen(New Space)**: 새 객체 할당. Minor GC가 자주 실행. 살아남은 객체는 Old Gen으로 이동\n" +
        "- **Old Gen(Old Space)**: 오래된 객체. Major GC(Full GC)가 드물게 실행\n\n" +
        "대부분의 객체는 Young Gen에서 죽으므로 Minor GC는 빠르고 효율적입니다.\n\n" +
        "### WeakRef와 FinalizationRegistry (ES2021)\n\n" +
        "```js\n" +
        "// WeakRef: GC를 방해하지 않는 약한 참조\n" +
        "let obj = { data: 'important' };\n" +
        "const weakRef = new WeakRef(obj);\n" +
        "obj = null; // obj 해제 가능\n" +
        "\n" +
        "const value = weakRef.deref(); // GC되었으면 undefined\n" +
        "\n" +
        "// FinalizationRegistry: GC 후 콜백\n" +
        "const registry = new FinalizationRegistry(key => {\n" +
        "  console.log(`${key} GC됨`);\n" +
        "});\n" +
        "registry.register(obj, 'myKey');\n" +
        "```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Mark-and-Sweep 알고리즘",
      content:
        "Mark-and-Sweep의 동작과 세대별 GC가 어떻게 최적화하는지 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          "// Mark-and-Sweep 의사코드\n" +
          "function markAndSweep(heap: Heap, roots: GCRoot[]) {\n" +
          "  // === Mark 단계 ===\n" +
          "  const marked = new Set<HeapObject>();\n" +
          "\n" +
          "  function mark(obj: HeapObject) {\n" +
          "    if (marked.has(obj)) return; // 이미 표시됨 (순환 방지)\n" +
          "    marked.add(obj);\n" +
          "    // 객체의 모든 참조를 재귀적으로 표시\n" +
          "    for (const ref of obj.references) {\n" +
          "      mark(ref);\n" +
          "    }\n" +
          "  }\n" +
          "\n" +
          "  // GC 루트에서 시작 (전역 변수, 스택 프레임, 레지스터)\n" +
          "  for (const root of roots) {\n" +
          "    mark(root.value);\n" +
          "  }\n" +
          "\n" +
          "  // === Sweep 단계 ===\n" +
          "  for (const obj of heap.allObjects) {\n" +
          "    if (!marked.has(obj)) {\n" +
          "      heap.free(obj); // 도달 불가 → 해제\n" +
          "    }\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// 세대별 GC 의사코드\n" +
          "class GenerationalGC {\n" +
          "  youngGen: Heap; // ~1-8MB, 자주 GC\n" +
          "  oldGen: Heap;   // 훨씬 크고, 드물게 GC\n" +
          "\n" +
          "  minorGC() {\n" +
          "    // Young Gen만 대상으로 빠르게 실행\n" +
          "    const survivors = this.youngGen.objects.filter(o => o.isReachable());\n" +
          "    for (const obj of survivors) {\n" +
          "      obj.age++;\n" +
          "      if (obj.age >= 2) {\n" +
          "        this.oldGen.move(obj); // Old Gen으로 승격\n" +
          "      }\n" +
          "    }\n" +
          "    this.youngGen.clear();\n" +
          "  }\n" +
          "\n" +
          "  majorGC() {\n" +
          "    // 전체 힙 대상, 느리지만 드물게 실행\n" +
          "    markAndSweep(this.oldGen, getGCRoots());\n" +
          "  }\n" +
          "}",
        description: "Mark-and-Sweep은 GC 루트에서 도달 가능한 객체만 살리고 나머지를 해제합니다. 세대별 GC는 대부분의 객체가 젊어서 죽는 특성을 활용해 성능을 최적화합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: WeakRef를 이용한 캐시",
      content:
        "WeakRef를 사용해 메모리 누수 없는 캐시를 구현합니다.",
      code: {
        language: "javascript",
        code:
          "// WeakRef 기반 캐시 — GC가 필요시 자동으로 해제\n" +
          "class WeakCache {\n" +
          "  #cache = new Map(); // key → WeakRef<value>\n" +
          "\n" +
          "  set(key, value) {\n" +
          "    this.#cache.set(key, new WeakRef(value));\n" +
          "  }\n" +
          "\n" +
          "  get(key) {\n" +
          "    const ref = this.#cache.get(key);\n" +
          "    if (!ref) return undefined;\n" +
          "    const value = ref.deref();\n" +
          "    if (value === undefined) {\n" +
          "      this.#cache.delete(key); // GC됨, 엔트리 정리\n" +
          "    }\n" +
          "    return value;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// DOM 요소와 데이터를 약한 참조로 연결\n" +
          "const elementData = new WeakMap(); // DOM 요소가 GC되면 자동 제거\n" +
          "\n" +
          "function trackElement(element) {\n" +
          "  elementData.set(element, {\n" +
          "    clicks: 0,\n" +
          "    created: Date.now()\n" +
          "  });\n" +
          "}\n" +
          "\n" +
          "// FinalizationRegistry로 GC 시점 감지\n" +
          "const registry = new FinalizationRegistry((heldValue) => {\n" +
          "  console.log(`객체 GC됨, 보관 값: ${heldValue}`);\n" +
          "  // 캐시 정리, 로깅 등 수행\n" +
          "});\n" +
          "\n" +
          "let bigObject = { data: new Array(1000000).fill(0) };\n" +
          "registry.register(bigObject, 'bigObject-tag');\n" +
          "\n" +
          "bigObject = null; // GC 대상이 됨\n" +
          "// 나중에 GC가 실행되면 콜백 호출됨\n" +
          "// '객체 GC됨, 보관 값: bigObject-tag'",
        description: "WeakRef와 FinalizationRegistry는 GC에 간섭하지 않으면서 객체 생명주기를 관찰할 수 있게 합니다. WeakMap/WeakSet은 키가 GC되면 자동으로 엔트리가 제거되는 더 간단한 대안입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 | 한계 |\n" +
        "|------|------|------|\n" +
        "| 참조 카운팅 | 참조 수로 해제 결정 | 순환 참조 해제 불가 |\n" +
        "| Mark-and-Sweep | 도달 가능성 기반 | Stop-The-World 발생 |\n" +
        "| 세대별 GC | Young/Old 분리 | 복잡한 구현 |\n" +
        "| WeakRef | GC 방해 안 하는 참조 | deref()가 undefined 가능 |\n\n" +
        "**V8의 힙 구조:**\n" +
        "- New Space (Young Gen): ~1-8MB, Scavenge GC\n" +
        "- Old Space (Old Gen): 수십-수백MB, Mark-Sweep-Compact\n" +
        "- Large Object Space: 큰 객체 별도 관리\n\n" +
        "**개발자가 할 일:**\n" +
        "- 사용 후 참조 null 처리\n" +
        "- DOM 요소는 WeakMap/WeakSet 사용\n" +
        "- 클로저, 이벤트 리스너 누수 방지\n\n" +
        "**핵심:** GC는 자동이지만 개발자가 메모리 누수를 만들 수 있습니다. 다음 챕터에서 구체적인 누수 패턴을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "가비지 컬렉터는 '도달 가능성'을 기준으로 메모리를 회수한다. 루트에서 참조 체인으로 도달할 수 없는 객체는 자동으로 수거된다.",
  checklist: [
    "메모리 생명주기 3단계(할당, 사용, 해제)를 설명할 수 있다",
    "참조 카운팅 방식과 순환 참조 문제를 설명할 수 있다",
    "Mark-and-Sweep 알고리즘의 동작 원리를 설명할 수 있다",
    "세대별 GC에서 Young Generation과 Old Generation의 차이를 안다",
    "WeakRef와 WeakMap/WeakSet의 차이와 사용 사례를 설명할 수 있다",
    "GC가 Stop-The-World를 유발한다는 것을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "참조 카운팅 GC가 순환 참조를 해제하지 못하는 이유는?",
      choices: [
        "순환 참조된 객체는 GC 루트에 있기 때문",
        "서로 참조하는 두 객체는 아무도 참조하지 않아도 참조 카운트가 0이 되지 않기 때문",
        "순환 참조는 런타임 에러를 발생시키기 때문",
        "참조 카운팅은 객체를 추적하지 않기 때문",
      ],
      correctIndex: 1,
      explanation: "a.ref = b; b.ref = a 후 a = null; b = null을 해도, a와 b 객체는 서로를 참조하고 있어 각각의 참조 카운트가 1입니다. 0이 아니므로 해제되지 않습니다. Mark-and-Sweep은 GC 루트에서 도달 불가능하면 해제하므로 이 문제를 해결합니다.",
    },
    {
      id: "q2",
      question: "Mark-and-Sweep에서 GC 루트가 되는 것은?",
      choices: [
        "가장 최근에 생성된 객체들",
        "전역 변수, 현재 실행 중인 스택 프레임, CPU 레지스터",
        "힙에 있는 모든 객체",
        "WeakRef로 참조된 객체",
      ],
      correctIndex: 1,
      explanation: "GC 루트는 전역 변수(window, global), 현재 실행 중인 함수의 지역 변수/매개변수(스택 프레임), CPU 레지스터에 있는 참조입니다. 이 루트들에서 도달 가능한 모든 객체는 살아있는 것으로 간주됩니다.",
    },
    {
      id: "q3",
      question: "세대별 GC에서 Young Generation 객체가 Old Generation으로 이동하는 조건은?",
      choices: [
        "크기가 일정 이상일 때",
        "Minor GC에서 살아남아 일정 횟수 이상 생존했을 때",
        "전역 변수로 등록될 때",
        "개발자가 명시적으로 이동시킬 때",
      ],
      correctIndex: 1,
      explanation: "세대별 GC에서 Young Gen의 객체는 Minor GC(Scavenge)에서 여러 번 살아남으면 Old Gen으로 승격됩니다. 대부분의 객체는 Young Gen에서 빠르게 죽으므로, 살아남은 소수만 Old Gen으로 이동합니다.",
    },
    {
      id: "q4",
      question: "WeakRef.deref()가 undefined를 반환할 수 있는 이유는?",
      choices: [
        "WeakRef가 초기화되지 않았기 때문",
        "참조하는 객체가 GC에 의해 이미 해제되었을 수 있기 때문",
        "deref()는 비동기 메서드이기 때문",
        "WeakRef는 원시 타입만 참조할 수 있기 때문",
      ],
      correctIndex: 1,
      explanation: "WeakRef는 GC가 참조된 객체를 해제하는 것을 방해하지 않습니다. 따라서 deref()를 호출하는 시점에 GC가 이미 그 객체를 해제했다면 undefined를 반환합니다. 항상 undefined 체크가 필요합니다.",
    },
    {
      id: "q5",
      question: "WeakMap과 WeakSet의 공통점은?",
      choices: [
        "키로 원시 타입을 사용할 수 있다",
        "iterable이다",
        "키(WeakMap) 또는 값(WeakSet)이 GC되면 자동으로 엔트리가 제거된다",
        "크기(size)를 조회할 수 있다",
      ],
      correctIndex: 2,
      explanation: "WeakMap과 WeakSet은 키(또는 값)로 객체만 허용하며, 그 객체가 다른 곳에서 참조되지 않아 GC 대상이 되면 해당 엔트리도 자동으로 제거됩니다. 따라서 iterable이 아니고 size를 조회할 수 없습니다.",
    },
  ],
};

export default chapter;
