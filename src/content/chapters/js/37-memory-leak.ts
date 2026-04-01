import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "37-memory-leak",
  subject: "js",
  title: "메모리 누수 패턴",
  description: "전역 변수, 클로저, 타이머/이벤트 리스너, DOM 참조, 순환 참조 등 실제 메모리 누수 패턴과 Chrome DevTools를 이용한 디버깅 방법을 깊이 이해합니다.",
  order: 37,
  group: "메모리와 최적화",
  prerequisites: ["36-garbage-collection"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "메모리 누수는 '호텔에서 체크아웃 없이 방을 계속 차지하는 것'과 같습니다.\n\n" +
        "손님(데이터)이 떠나야 할 때 떠나지 않고 방(메모리)을 계속 점유합니다. 새 손님(데이터)이 들어올 공간이 없어지고, 결국 호텔(앱)이 마비됩니다.\n\n" +
        "**전역 변수 누수**는 영구 투숙객처럼 방을 절대 비우지 않습니다.\n\n" +
        "**이벤트 리스너 누수**는 투숙객이 떠났어도 그 투숙객의 물건이 방에 남아 있어 정리할 수 없는 상황입니다. DOM 요소가 제거되어도 이벤트 리스너가 그 요소를 참조 중이면 GC가 해제할 수 없습니다.\n\n" +
        "**클로저 누수**는 직원이 떠난 투숙객을 위해 계속 서비스를 준비하는 것입니다. 더 이상 필요 없는 데이터를 클로저가 계속 붙들고 있습니다.\n\n" +
        "**해결책**은 손님이 떠날 때 반드시 체크아웃(리스너 제거, 참조 null 처리, WeakMap 사용)을 확인하는 것입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "메모리 누수는 조용히 발생해 앱이 느려지거나 크래시가 날 때까지 발견하기 어렵습니다.\n\n" +
        "**실제 사례들:**\n\n" +
        "```js\n" +
        "// 1. 전역 변수 누수 (가장 흔한 실수)\n" +
        "function processData() {\n" +
        "  result = fetchedData; // 'let/const' 없음 → 전역 변수!\n" +
        "}\n" +
        "\n" +
        "// 2. 이벤트 리스너 중복 등록\n" +
        "function addListeners() {\n" +
        "  document.addEventListener('click', handler);\n" +
        "  // 이 함수가 반복 호출될 때마다 리스너가 쌓임!\n" +
        "  // removeEventListener 호출 없음\n" +
        "}\n" +
        "\n" +
        "// 3. 타이머 누수\n" +
        "function startPolling() {\n" +
        "  setInterval(() => {\n" +
        "    // this 또는 큰 객체를 클로저로 참조\n" +
        "    processData(this.state);\n" +
        "  }, 1000);\n" +
        "  // clearInterval 없음 → 컴포넌트 해제 후에도 계속 실행!\n" +
        "}\n" +
        "```\n\n" +
        "메모리 누수는 단순한 성능 문제가 아니라 앱의 안정성을 위협합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. 전역 변수 누수 방지\n\n" +
        "- `'use strict'` 모드로 암묵적 전역 차단\n" +
        "- 항상 `let`, `const`, `var`로 선언\n" +
        "- 전역 변수에 대용량 데이터 저장 지양\n\n" +
        "### 2. 클로저 누수 방지\n\n" +
        "```js\n" +
        "// ❌ 클로저가 불필요하게 큰 객체를 잡아둠\n" +
        "function setupHandler() {\n" +
        "  const HUGE_DATA = new Array(1000000).fill(0);\n" +
        "  return function handler() {\n" +
        "    console.log('clicked'); // HUGE_DATA는 필요없지만 클로저에 있음!\n" +
        "  };\n" +
        "}\n" +
        "\n" +
        "// ✅ 필요한 데이터만 클로저에 포함\n" +
        "function setupHandler() {\n" +
        "  const HUGE_DATA = new Array(1000000).fill(0);\n" +
        "  const summary = summarize(HUGE_DATA); // 필요한 것만 추출\n" +
        "  return function handler() {\n" +
        "    console.log(summary); // summary만 클로저에 남음\n" +
        "  };\n" +
        "}\n" +
        "```\n\n" +
        "### 3. 이벤트 리스너 정리\n\n" +
        "```js\n" +
        "// AbortController로 일괄 제거 (모던 방법)\n" +
        "const controller = new AbortController();\n" +
        "element.addEventListener('click', handler, { signal: controller.signal });\n" +
        "element.addEventListener('keydown', handler2, { signal: controller.signal });\n" +
        "controller.abort(); // 모든 리스너 한 번에 제거\n" +
        "```\n\n" +
        "### 4. 타이머 정리\n\n" +
        "```js\n" +
        "// 컴포넌트 cleanup에서 반드시 해제\n" +
        "class Component {\n" +
        "  constructor() {\n" +
        "    this.timerId = setInterval(this.poll, 1000);\n" +
        "  }\n" +
        "  destroy() {\n" +
        "    clearInterval(this.timerId); // 반드시 해제!\n" +
        "  }\n" +
        "}\n" +
        "```\n\n" +
        "### 5. DOM 참조는 WeakMap 사용\n\n" +
        "```js\n" +
        "// ❌ Map → DOM 제거 후에도 참조 유지\n" +
        "const map = new Map();\n" +
        "map.set(domElement, data);\n" +
        "\n" +
        "// ✅ WeakMap → DOM 제거 시 자동 정리\n" +
        "const weakMap = new WeakMap();\n" +
        "weakMap.set(domElement, data);\n" +
        "```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 주요 누수 패턴과 수정",
      content:
        "가장 흔한 메모리 누수 패턴 5가지를 코드로 확인하고 수정합니다.",
      code: {
        language: "javascript",
        code:
          "// === 패턴 1: 클로저가 큰 배열을 잡아둠 ===\n" +
          "function createLeak() {\n" +
          "  const bigArray = new Array(1000000).fill('data');\n" +
          "\n" +
          "  // ❌ handler가 bigArray를 클로저로 유지\n" +
          "  return () => console.log(bigArray[0]);\n" +
          "}\n" +
          "const fn = createLeak(); // bigArray는 fn이 살아있는 한 GC 불가\n" +
          "\n" +
          "// === 패턴 2: 제거된 DOM 노드 참조 ===\n" +
          "let detachedTree;\n" +
          "function createDetached() {\n" +
          "  const ul = document.createElement('ul');\n" +
          "  for (let i = 0; i < 1000; i++) {\n" +
          "    ul.appendChild(document.createElement('li'));\n" +
          "  }\n" +
          "  detachedTree = ul; // DOM에 추가 안 했지만 참조 유지 → 누수!\n" +
          "}\n" +
          "\n" +
          "// === 패턴 3: setInterval + 클로저 ===\n" +
          "class DataPoller {\n" +
          "  constructor(endpoint) {\n" +
          "    this.data = [];\n" +
          "    this.endpoint = endpoint;\n" +
          "\n" +
          "    // ❌ this를 클로저로 잡아둠, clearInterval 없음\n" +
          "    setInterval(async () => {\n" +
          "      const result = await fetch(this.endpoint);\n" +
          "      this.data.push(await result.json()); // 무한 증가!\n" +
          "    }, 1000);\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// ✅ 수정: cleanup 메서드 추가\n" +
          "class DataPollerFixed {\n" +
          "  #intervalId = null;\n" +
          "  #data = [];\n" +
          "\n" +
          "  start(endpoint) {\n" +
          "    this.#intervalId = setInterval(async () => {\n" +
          "      const result = await fetch(endpoint);\n" +
          "      const item = await result.json();\n" +
          "      if (this.#data.length > 100) this.#data.shift(); // 크기 제한\n" +
          "      this.#data.push(item);\n" +
          "    }, 1000);\n" +
          "  }\n" +
          "\n" +
          "  stop() {\n" +
          "    clearInterval(this.#intervalId);\n" +
          "    this.#intervalId = null;\n" +
          "  }\n" +
          "}",
        description: "메모리 누수의 핵심은 더 이상 필요하지 않은 데이터가 여전히 참조되고 있다는 것입니다. 참조 체인을 끊어주면 GC가 해제합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Chrome DevTools로 누수 탐지",
      content:
        "Chrome DevTools Memory 패널을 활용해 메모리 누수를 탐지하는 방법과 React 컴포넌트에서의 정리 패턴을 학습합니다.",
      code: {
        language: "javascript",
        code:
          "// Chrome DevTools 메모리 탐지 절차:\n" +
          "// 1. DevTools → Memory 탭\n" +
          "// 2. 'Take heap snapshot' — 초기 상태 기록\n" +
          "// 3. 의심스러운 동작 반복 실행\n" +
          "// 4. 'Take heap snapshot' — 후 상태 기록\n" +
          "// 5. 'Comparison' 뷰 — 새로 추가된 객체 확인\n" +
          "// 6. 'Allocation timeline' — 메모리 증가 패턴 확인\n" +
          "\n" +
          "// === React 컴포넌트에서의 정리 패턴 ===\n" +
          "// (개념 이해용 — 실제 React 없이 동일 패턴)\n" +
          "class Component {\n" +
          "  #cleanupFns = [];\n" +
          "\n" +
          "  onMount() {\n" +
          "    // 이벤트 리스너 등록\n" +
          "    const controller = new AbortController();\n" +
          "    window.addEventListener('resize', this.handleResize, {\n" +
          "      signal: controller.signal\n" +
          "    });\n" +
          "    this.#cleanupFns.push(() => controller.abort());\n" +
          "\n" +
          "    // 타이머 등록\n" +
          "    const timerId = setInterval(this.tick, 500);\n" +
          "    this.#cleanupFns.push(() => clearInterval(timerId));\n" +
          "\n" +
          "    // 외부 구독\n" +
          "    const unsubscribe = store.subscribe(this.handleChange);\n" +
          "    this.#cleanupFns.push(unsubscribe);\n" +
          "  }\n" +
          "\n" +
          "  // 컴포넌트 언마운트 시 모든 정리\n" +
          "  onUnmount() {\n" +
          "    this.#cleanupFns.forEach(fn => fn());\n" +
          "    this.#cleanupFns = [];\n" +
          "  }\n" +
          "\n" +
          "  handleResize = () => { /* ... */ };\n" +
          "  tick = () => { /* ... */ };\n" +
          "  handleChange = () => { /* ... */ };\n" +
          "}",
        description: "컴포넌트 기반 개발에서 mount/unmount 패턴으로 리소스를 등록/해제하면 메모리 누수를 체계적으로 방지할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 누수 패턴 | 원인 | 해결책 |\n" +
        "|----------|------|--------|\n" +
        "| 전역 변수 | 암묵적 전역 생성 | strict mode, let/const |\n" +
        "| 클로저 | 필요 이상의 스코프 캡처 | 필요한 데이터만 추출 |\n" +
        "| 이벤트 리스너 | removeEventListener 누락 | AbortController, cleanup |\n" +
        "| 타이머 | clearInterval/Timeout 누락 | cleanup에서 반드시 해제 |\n" +
        "| DOM 참조 | Map에 DOM 요소 저장 | WeakMap 사용 |\n" +
        "| 순환 참조 | 상호 참조 | WeakRef, 구조 재설계 |\n\n" +
        "**디버깅 도구:**\n" +
        "- Chrome DevTools Memory 탭: Heap Snapshot, Allocation Timeline\n" +
        "- Performance 탭: 메모리 사용량 그래프\n" +
        "- Node.js: `--inspect`, `process.memoryUsage()`\n\n" +
        "**핵심:** 리소스를 등록할 때는 항상 '어디서 해제할 것인가'를 함께 생각하세요.\n\n" +
        "**다음 챕터 미리보기:** 디바운스와 스로틀로 이벤트 리스너의 성능을 최적화하는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "전역 변수로 인한 메모리 누수 패턴을 설명할 수 있다",
    "클로저가 필요 이상의 데이터를 캡처해 누수가 발생하는 원리를 이해한다",
    "이벤트 리스너 누수를 방지하기 위한 AbortController 사용법을 안다",
    "setInterval 사용 시 반드시 clearInterval을 호출해야 하는 이유를 설명할 수 있다",
    "DOM 요소 참조 저장 시 WeakMap을 사용해야 하는 이유를 설명할 수 있다",
    "Chrome DevTools Memory 탭으로 메모리 누수를 탐지하는 방법을 안다",
  ],
  quiz: [
    {
      id: "q1",
      question: "이벤트 리스너 누수가 발생하는 가장 흔한 원인은?",
      choices: [
        "addEventListener를 사용했기 때문",
        "removeEventListener를 호출하지 않아 DOM 요소 제거 후에도 리스너가 남아 있기 때문",
        "이벤트 핸들러 함수가 너무 크기 때문",
        "동기 이벤트를 사용했기 때문",
      ],
      correctIndex: 1,
      explanation: "이벤트 리스너는 해당 요소와 리스너 함수를 강한 참조로 연결합니다. DOM 요소를 삭제해도 removeEventListener를 호출하지 않으면 요소와 리스너가 메모리에 남아 있어 누수가 발생합니다.",
    },
    {
      id: "q2",
      question: "WeakMap을 일반 Map 대신 사용해야 하는 상황은?",
      choices: [
        "키 순서가 중요할 때",
        "키의 생명주기가 외부 객체(DOM 요소 등)에 의존하고, 그 객체가 GC될 때 자동으로 정리되어야 할 때",
        "키로 문자열을 사용해야 할 때",
        "크기(size)를 자주 확인해야 할 때",
      ],
      correctIndex: 1,
      explanation: "WeakMap은 키(객체)가 다른 곳에서 참조되지 않으면 GC가 자동으로 해당 엔트리를 제거합니다. DOM 요소를 키로 사용할 때 적합합니다. 반면 일반 Map은 키를 강하게 참조해 DOM 제거 후에도 메모리를 점유합니다.",
    },
    {
      id: "q3",
      question: "setInterval을 사용하는 클래스에서 반드시 해야 하는 것은?",
      choices: [
        "setInterval의 딜레이를 최소화한다",
        "컴포넌트/인스턴스가 더 이상 필요 없을 때 clearInterval을 호출한다",
        "setInterval 대신 setTimeout을 반복 사용한다",
        "화살표 함수 대신 일반 함수를 콜백으로 사용한다",
      ],
      correctIndex: 1,
      explanation: "setInterval은 clearInterval로 취소하지 않으면 영원히 실행되며, 콜백이 클로저로 참조하는 모든 데이터를 메모리에 유지합니다. 컴포넌트 해제/언마운트 시 반드시 clearInterval을 호출해야 합니다.",
    },
    {
      id: "q4",
      question: "클로저에 의한 메모리 누수를 방지하는 가장 좋은 방법은?",
      choices: [
        "클로저를 전혀 사용하지 않는다",
        "클로저 내부에서 필요한 데이터만 캡처하고 대용량 객체는 필요한 값만 추출해 저장한다",
        "모든 변수를 전역으로 선언한다",
        "WeakRef로 모든 참조를 감싼다",
      ],
      correctIndex: 1,
      explanation: "클로저를 피할 수는 없지만, 대용량 객체를 직접 캡처하는 것을 피할 수 있습니다. 필요한 값만 미리 추출해 소량의 데이터만 클로저에 남기면 불필요한 메모리 점유를 방지합니다.",
    },
    {
      id: "q5",
      question: "Chrome DevTools에서 메모리 누수를 찾는 가장 효과적인 방법은?",
      choices: [
        "Network 탭에서 응답 크기 확인",
        "Performance 탭에서 CPU 사용량 확인",
        "Memory 탭의 Heap Snapshot을 두 시점에 찍어 'Comparison' 뷰로 새로 추가된 객체 분석",
        "Console 탭에서 에러 메시지 확인",
      ],
      correctIndex: 2,
      explanation: "메모리 누수는 Heap Snapshot 비교로 탐지합니다. 초기 상태와 의심스러운 동작 후의 스냅샷을 비교해 해제되지 않고 쌓이는 객체를 찾습니다. Allocation Timeline으로 메모리 증가 패턴도 확인할 수 있습니다.",
    },
  ],
};

export default chapter;
