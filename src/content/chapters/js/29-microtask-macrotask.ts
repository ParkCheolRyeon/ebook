import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "29-microtask-macrotask",
  subject: "js",
  title: "마이크로태스크와 매크로태스크",
  description: "마이크로태스크 큐와 매크로태스크 큐의 우선순위, Promise vs setTimeout 실행 순서, queueMicrotask, 실행 순서 예측 방법을 마스터합니다.",
  order: 29,
  group: "비동기",
  prerequisites: ["28-async-await"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "이벤트 루프를 **병원 응급실 접수 시스템**에 비유할 수 있습니다.\n\n" +
        "- **콜 스택** = 현재 치료 중인 환자. 한 명씩 처리합니다.\n" +
        "- **마이크로태스크 큐** = 응급 대기실. 긴급 처리가 필요한 환자가 줄 섰습니다. 현재 치료가 끝나면 **즉시** 응급 대기실을 모두 비웁니다.\n" +
        "- **매크로태스크 큐** = 일반 대기실. 응급 대기실이 완전히 비워진 후에야 한 명씩 처리됩니다.\n\n" +
        "**핵심 규칙:**\n" +
        "1. 현재 치료(콜 스택) 완료\n" +
        "2. 응급 대기실(마이크로태스크) **전부** 비우기 (새 환자 추가되어도 계속)\n" +
        "3. 일반 대기실(매크로태스크) 한 명 처리\n" +
        "4. 다시 2번으로\n\n" +
        "이 때문에 `Promise.then()`은 `setTimeout(fn, 0)`보다 항상 먼저 실행됩니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "다음 코드의 출력 순서를 예측할 수 있나요?\n\n" +
        "```javascript\n" +
        "console.log('1');\n\n" +
        "setTimeout(() => console.log('2'), 0);\n\n" +
        "Promise.resolve().then(() => console.log('3'));\n\n" +
        "console.log('4');\n" +
        "```\n\n" +
        "정답: 1, 4, 3, 2\n\n" +
        "왜 3이 2보다 먼저일까요? 둘 다 비동기인데 왜 순서가 다를까요?\n\n" +
        "실무에서 이 개념이 중요한 이유:\n" +
        "- Promise 내에서 무한히 마이크로태스크를 추가하면 매크로태스크(UI 업데이트)가 실행되지 않아 화면이 멈출 수 있습니다.\n" +
        "- async/await 코드의 실행 순서를 정확히 예측하려면 마이크로태스크 개념이 필수입니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 마이크로태스크 (Microtask)\n" +
        "현재 태스크 완료 직후, 다음 매크로태스크 이전에 실행됩니다.\n\n" +
        "**마이크로태스크를 생성하는 것들:**\n" +
        "- `Promise.then()`, `Promise.catch()`, `Promise.finally()`\n" +
        "- `async/await` (await 이후 코드)\n" +
        "- `queueMicrotask(fn)`\n" +
        "- `MutationObserver` 콜백\n\n" +
        "### 매크로태스크 (Macrotask / Task)\n" +
        "마이크로태스크 큐가 비워진 후, 이벤트 루프의 다음 턴에 실행됩니다.\n\n" +
        "**매크로태스크를 생성하는 것들:**\n" +
        "- `setTimeout()`, `setInterval()`\n" +
        "- `setImmediate()` (Node.js)\n" +
        "- I/O 작업 콜백\n" +
        "- UI 렌더링, DOM 이벤트 핸들러\n\n" +
        "### 이벤트 루프 알고리즘 (정확한 순서)\n" +
        "```\n" +
        "1. 매크로태스크 큐에서 하나의 태스크 실행\n" +
        "2. 마이크로태스크 큐를 완전히 비울 때까지 반복\n" +
        "   (마이크로태스크 중에 추가된 마이크로태스크도 포함)\n" +
        "3. 필요하면 렌더링 업데이트\n" +
        "4. 1번으로 돌아가 반복\n" +
        "```\n\n" +
        "### queueMicrotask()\n" +
        "ES2019에서 도입. Promise 없이 마이크로태스크를 큐에 추가합니다.\n\n" +
        "### 렌더링과 이벤트 루프\n" +
        "렌더링은 매크로태스크 사이에 발생합니다. 마이크로태스크 큐가 쌓이면 렌더링이 지연될 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 실행 순서 단계별 추적",
      content:
        "복잡한 비동기 코드의 실행 순서를 이벤트 루프 큐 관점에서 정확히 추적합니다.",
      code: {
        language: "javascript",
        code:
          "// 실행 순서 추적 예제\n" +
          "console.log('script start');        // [동기]\n\n" +
          "setTimeout(() => {                  // 매크로태스크 큐에 등록\n" +
          "  console.log('setTimeout');\n" +
          "}, 0);\n\n" +
          "Promise.resolve()                   // 마이크로태스크 큐에 등록\n" +
          "  .then(() => {\n" +
          "    console.log('promise 1');\n" +
          "    return Promise.resolve();        // 새 마이크로태스크 등록\n" +
          "  })\n" +
          "  .then(() => console.log('promise 2'));\n\n" +
          "queueMicrotask(()                   // 마이크로태스크 큐에 등록\n" +
          "  => console.log('queueMicrotask'));\n\n" +
          "console.log('script end');           // [동기]\n\n" +
          "// === 실행 순서 분석 ===\n" +
          "// [동기 실행]\n" +
          "// 1. 'script start'\n" +
          "// 2. 'script end'\n" +
          "// [콜 스택 빔 → 마이크로태스크 처리]\n" +
          "// 3. 'promise 1'   (Promise.then)\n" +
          "// 4. 'queueMicrotask'\n" +
          "// 5. 'promise 2'   (promise 1에서 등록된 새 마이크로태스크)\n" +
          "// [마이크로태스크 큐 빔 → 매크로태스크 처리]\n" +
          "// 6. 'setTimeout'\n\n" +
          "// 출력: script start → script end → promise 1\n" +
          "//        → queueMicrotask → promise 2 → setTimeout",
        description:
          "마이크로태스크 처리 중 새 마이크로태스크가 추가되면 그것도 현재 마이크로태스크 단계에서 처리됩니다. 매크로태스크로 넘어가지 않습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 실행 순서 예측과 함정",
      content:
        "실무에서 마주치는 실행 순서 함정과 이를 활용하는 패턴을 살펴봅니다.",
      code: {
        language: "javascript",
        code:
          "// 1. async/await와 마이크로태스크\n" +
          "async function main() {\n" +
          "  console.log('A');\n" +
          "  await Promise.resolve();\n" +
          "  console.log('B'); // 마이크로태스크로 실행됨\n" +
          "}\n\n" +
          "main();\n" +
          "console.log('C');\n\n" +
          "// 출력: A → C → B\n" +
          "// 이유: await 이후 코드가 마이크로태스크로 예약됨\n\n" +
          "// 2. 마이크로태스크 무한 루프 (위험!)\n" +
          "// 절대 하지 마세요:\n" +
          "// function danger() {\n" +
          "//   Promise.resolve().then(danger); // 매크로태스크가 실행되지 않음\n" +
          "// }\n\n" +
          "// 3. 렌더링 이전에 DOM 읽기\n" +
          "// queueMicrotask로 현재 실행 완료 직후 DOM 상태를 읽을 수 있음\n" +
          "function updateAndRead(element) {\n" +
          "  element.textContent = '업데이트됨';\n" +
          "  queueMicrotask(() => {\n" +
          "    // 렌더링 전이지만 JS 상태는 변경됨\n" +
          "    console.log('텍스트:', element.textContent);\n" +
          "  });\n" +
          "}\n\n" +
          "// 4. Node.js: process.nextTick vs Promise.then\n" +
          "// process.nextTick은 마이크로태스크보다 더 높은 우선순위를 가짐\n" +
          "// (Node.js 전용 nextTick 큐가 별도 존재)\n" +
          "Promise.resolve().then(() => console.log('Promise'));\n" +
          "// process.nextTick(() => console.log('nextTick')); // nextTick이 먼저\n\n" +
          "// 5. 실행 순서 퀴즈\n" +
          "console.log('1');\n" +
          "setTimeout(() => console.log('2'), 0);\n" +
          "setTimeout(() => console.log('3'), 0);\n" +
          "Promise.resolve().then(() => console.log('4'));\n" +
          "Promise.resolve().then(() => {\n" +
          "  setTimeout(() => console.log('5'), 0);\n" +
          "  console.log('6');\n" +
          "});\n" +
          "console.log('7');\n" +
          "// 출력: 1 → 7 → 4 → 6 → 2 → 3 → 5",
        description:
          "마이크로태스크 내에서 setTimeout을 등록하면 해당 setTimeout은 현재 매크로태스크 큐의 맨 뒤에 추가됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "```\n" +
        "[이벤트 루프 우선순위]\n" +
        "┌─────────────────────────────────────────┐\n" +
        "│ 1. 동기 코드 (콜 스택)                  │ ← 가장 먼저\n" +
        "├─────────────────────────────────────────┤\n" +
        "│ 2. 마이크로태스크 큐 (전부 처리)         │\n" +
        "│    - Promise.then/catch/finally          │\n" +
        "│    - async/await 이후 코드               │\n" +
        "│    - queueMicrotask                      │\n" +
        "│    - MutationObserver                    │\n" +
        "├─────────────────────────────────────────┤\n" +
        "│ 3. 렌더링 (필요 시)                      │\n" +
        "├─────────────────────────────────────────┤\n" +
        "│ 4. 매크로태스크 큐 (하나씩)              │ ← 가장 나중\n" +
        "│    - setTimeout, setInterval             │\n" +
        "│    - DOM 이벤트, I/O                     │\n" +
        "└─────────────────────────────────────────┘\n" +
        "```\n\n" +
        "**핵심 암기:**\n" +
        "- 동기 → 마이크로 → (렌더링) → 매크로 → 마이크로 → (렌더링) → 매크로...\n" +
        "- 마이크로태스크는 **전부** 처리, 매크로태스크는 **하나씩** 처리\n" +
        "- Promise.then이 setTimeout보다 항상 먼저 실행됨\n\n" +
        "**다음 단계:** 이 개념을 바탕으로 복잡한 비동기 코드의 실행 순서를 정확히 예측하고 디버깅할 수 있습니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "마이크로태스크(Promise.then)는 매크로태스크(setTimeout) 보다 항상 먼저 실행된다. 이벤트 루프는 매 매크로태스크 사이에 마이크로태스크 큐를 전부 비운다.",
  checklist: [
    "마이크로태스크와 매크로태스크의 차이를 설명할 수 있다",
    "Promise.then이 setTimeout보다 먼저 실행되는 이유를 설명할 수 있다",
    "마이크로태스크 큐가 매크로태스크보다 우선 처리되는 이벤트 루프 알고리즘을 설명할 수 있다",
    "마이크로태스크 내에서 추가된 마이크로태스크도 현재 단계에서 처리됨을 안다",
    "queueMicrotask의 사용법을 안다",
    "동기 → 마이크로태스크 → 매크로태스크 순서로 복잡한 코드의 출력 순서를 예측할 수 있다",
    "마이크로태스크 무한 루프가 왜 위험한지 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "console.log('A'); Promise.resolve().then(()=>console.log('B')); setTimeout(()=>console.log('C'),0); console.log('D');의 출력 순서는?",
      choices: ["A, B, C, D", "A, D, B, C", "A, D, C, B", "D, A, B, C"],
      correctIndex: 1,
      explanation:
        "동기 코드인 A, D가 먼저 실행됩니다. 콜 스택이 비면 마이크로태스크인 Promise.then(B)이 실행됩니다. 그 후 매크로태스크인 setTimeout(C)이 실행됩니다.",
    },
    {
      id: "q2",
      question: "마이크로태스크를 생성하는 것은?",
      choices: [
        "setTimeout",
        "setInterval",
        "Promise.then()",
        "DOM 이벤트 핸들러",
      ],
      correctIndex: 2,
      explanation:
        "Promise.then(), catch(), finally()와 queueMicrotask(), MutationObserver 콜백이 마이크로태스크를 생성합니다. setTimeout, setInterval, DOM 이벤트는 매크로태스크입니다.",
    },
    {
      id: "q3",
      question:
        "마이크로태스크 처리 중 새로운 마이크로태스크가 추가되면?",
      choices: [
        "다음 이벤트 루프 턴에서 처리됨",
        "현재 마이크로태스크 단계에서 즉시 처리됨",
        "매크로태스크 큐로 이동됨",
        "무시됨",
      ],
      correctIndex: 1,
      explanation:
        "마이크로태스크 큐는 비어있을 때까지 처리됩니다. 처리 중 새 마이크로태스크가 추가되면 그것도 현재 단계에서 처리됩니다. 이론적으로 무한히 추가되면 매크로태스크가 영원히 실행되지 않습니다.",
    },
    {
      id: "q4",
      question: "queueMicrotask(fn)의 역할은?",
      choices: [
        "fn을 setTimeout(fn, 0)과 동일하게 실행",
        "fn을 마이크로태스크 큐에 추가해 현재 태스크 완료 직후 실행",
        "fn을 즉시 동기적으로 실행",
        "fn을 렌더링 이후에 실행",
      ],
      correctIndex: 1,
      explanation:
        "queueMicrotask()는 함수를 마이크로태스크 큐에 추가합니다. Promise를 사용하지 않고도 마이크로태스크 타이밍에 코드를 실행할 수 있습니다. ES2019에서 표준화되었습니다.",
    },
    {
      id: "q5",
      question: "렌더링(화면 업데이트)은 이벤트 루프에서 언제 발생하는가?",
      choices: [
        "마이크로태스크 처리 중에 발생",
        "매크로태스크 사이에 발생 (마이크로태스크 큐가 빈 후)",
        "모든 setTimeout이 완료된 후 발생",
        "항상 동기 코드 실행 전에 발생",
      ],
      correctIndex: 1,
      explanation:
        "렌더링은 마이크로태스크 큐가 완전히 비워진 후, 다음 매크로태스크 실행 전에 발생합니다. 마이크로태스크가 계속 추가되면 렌더링이 지연될 수 있습니다.",
    },
    {
      id: "q6",
      question: "다음 중 매크로태스크를 생성하는 것은?",
      choices: [
        "Promise.resolve().then()",
        "async 함수의 await 이후 코드",
        "queueMicrotask()",
        "setTimeout(fn, 0)",
      ],
      correctIndex: 3,
      explanation:
        "setTimeout은 지연이 0ms여도 콜백을 매크로태스크 큐에 추가합니다. Promise.then, await 이후 코드, queueMicrotask는 모두 마이크로태스크를 생성합니다.",
    },
    {
      id: "q7",
      question: "async 함수 내 await 이후 코드는 어떤 큐에서 처리되는가?",
      choices: [
        "매크로태스크 큐",
        "마이크로태스크 큐",
        "렌더링 큐",
        "즉시 동기적으로 처리",
      ],
      correctIndex: 1,
      explanation:
        "await는 내부적으로 Promise.then()을 사용합니다. await 이후 코드는 마이크로태스크로 예약됩니다. 이 때문에 await 이전 코드와 await 이후 코드 사이에 동기 코드가 끼어들 수 있습니다.",
    },
    {
      id: "q8",
      question:
        "마이크로태스크 무한 루프(Promise.resolve().then(itself))가 위험한 이유는?",
      choices: [
        "메모리가 무한히 증가해서",
        "매크로태스크(UI 업데이트, 이벤트 처리)가 실행되지 않아서",
        "콜 스택 오버플로우가 발생해서",
        "Promise가 가비지 컬렉션되지 않아서",
      ],
      correctIndex: 1,
      explanation:
        "마이크로태스크 큐는 비어있을 때까지 계속 처리됩니다. 무한히 마이크로태스크가 추가되면 이벤트 루프가 매크로태스크 단계로 넘어가지 못해 setTimeout, DOM 이벤트, 렌더링이 모두 중단됩니다.",
    },
  ],
};

export default chapter;
