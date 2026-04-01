import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "25-event-loop",
  subject: "js",
  title: "이벤트 루프와 태스크 큐",
  description: "자바스크립트의 싱글 스레드 동작 원리, 콜 스택, 태스크 큐, 이벤트 루프, Web API와 렌더링의 관계를 깊이 이해합니다.",
  order: 25,
  group: "비동기",
  prerequisites: ["24-string-number-math-date"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "이벤트 루프는 **혼자 일하는 식당 주방장**에 비유할 수 있습니다.\n\n" +
        "주방장(JS 엔진)은 혼자입니다(싱글 스레드). 한 번에 한 가지 요리만 할 수 있습니다.\n\n" +
        "주방에는 여러 구역이 있습니다:\n" +
        "- **조리대(콜 스택)**: 지금 요리하고 있는 것. 최신 작업이 위에 쌓입니다.\n" +
        "- **보조 주방(Web API)**: 타이머, 네트워크 요청 등을 대신 처리해주는 곳. 주방장이 직접 하지 않아도 됩니다.\n" +
        "- **대기열(태스크 큐)**: 보조 주방에서 완성된 요리가 줄을 서는 곳.\n" +
        "- **이벤트 루프**: 조리대가 비면 대기열에서 다음 요리를 가져오는 급사.\n\n" +
        "주방장이 오믈렛을 만드는 동안(코드 실행 중), 계란 삶기(setTimeout)는 보조 주방에서 따로 진행됩니다. 오믈렛이 완성된 후(콜 스택이 비면) 삶은 계란이 조리대로 옵니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "다음 코드의 출력 순서를 예상해보세요:\n\n" +
        "```javascript\n" +
        "console.log('1');\n" +
        "setTimeout(() => console.log('2'), 0);\n" +
        "console.log('3');\n" +
        "```\n\n" +
        "많은 초보자가 '1, 2, 3'을 예상하지만 실제 결과는 '1, 3, 2'입니다.\n\n" +
        "setTimeout의 지연이 0ms인데 왜 3이 먼저 출력될까요?\n\n" +
        "또한 이런 의문도 생깁니다:\n" +
        "- 자바스크립트가 싱글 스레드인데 어떻게 Ajax 요청과 다른 코드를 동시에 실행하는가?\n" +
        "- 버튼 클릭 이벤트가 항상 현재 실행 중인 코드가 끝난 후 처리되는 이유는?\n" +
        "- 무한 루프를 실행하면 왜 브라우저가 멈추는가?",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 콜 스택 (Call Stack)\n" +
        "함수 호출이 쌓이는 LIFO(Last In, First Out) 구조의 스택입니다. 현재 실행 중인 함수가 맨 위에 있습니다. 스택이 비면 이벤트 루프가 큐에서 새 태스크를 가져옵니다.\n\n" +
        "### 힙 (Heap)\n" +
        "객체가 저장되는 비구조화 메모리 영역입니다.\n\n" +
        "### Web API\n" +
        "브라우저(또는 Node.js의 libuv)가 제공하는 비동기 기능입니다:\n" +
        "- `setTimeout`, `setInterval` — 타이머\n" +
        "- `XMLHttpRequest`, `fetch` — 네트워크\n" +
        "- DOM 이벤트\n" +
        "- `requestAnimationFrame` — 렌더링 훅\n\n" +
        "### 태스크 큐 (Macrotask Queue)\n" +
        "Web API가 완료된 콜백들이 대기하는 FIFO 큐입니다. `setTimeout`, `setInterval`, DOM 이벤트 콜백이 여기 들어옵니다.\n\n" +
        "### 이벤트 루프\n" +
        "단순한 무한 루프입니다:\n" +
        "1. 콜 스택이 비어 있는지 확인\n" +
        "2. 마이크로태스크 큐 모두 처리\n" +
        "3. 태스크 큐에서 태스크 하나를 가져와 콜 스택에 실행\n" +
        "4. 렌더링이 필요하면 렌더링\n" +
        "5. 반복\n\n" +
        "### setTimeout(fn, 0)이 나중에 실행되는 이유\n" +
        "0ms 지연이라도 콜백은 태스크 큐에 들어가고, 현재 콜 스택의 모든 실행이 완료된 후에야 처리됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 이벤트 루프 동작 추적",
      content:
        "복잡한 코드의 실행 순서를 이벤트 루프 관점에서 단계별로 추적합니다.",
      code: {
        language: "javascript",
        code:
          "// 이벤트 루프 동작 시뮬레이션\n" +
          "console.log('A');          // [1] 콜 스택에 push → 즉시 실행 → pop\n\n" +
          "setTimeout(() => {         // [2] Web API에 타이머 등록 (0ms)\n" +
          "  console.log('B');\n" +
          "}, 0);\n\n" +
          "Promise.resolve()          // [3] 마이크로태스크 큐에 등록\n" +
          "  .then(() => console.log('C'));\n\n" +
          "console.log('D');          // [4] 콜 스택에 push → 즉시 실행 → pop\n\n" +
          "// === 실행 흐름 ===\n" +
          "// 콜 스택 단계:\n" +
          "//   A 출력 (동기)\n" +
          "//   D 출력 (동기)\n" +
          "// 콜 스택이 빔:\n" +
          "//   이벤트 루프: 마이크로태스크 큐 처리\n" +
          "//   C 출력 (Promise.then)\n" +
          "//   이벤트 루프: 태스크 큐에서 setTimeout 콜백 실행\n" +
          "//   B 출력\n" +
          "// 최종 출력 순서: A → D → C → B\n\n" +
          "// 무한 루프가 브라우저를 멈추는 이유\n" +
          "// while(true) {} // 콜 스택에서 절대 빠져나오지 않음\n" +
          "// → 이벤트 루프가 태스크 큐를 처리할 수 없음\n" +
          "// → UI 업데이트, 클릭 이벤트 모두 처리 불가",
        description:
          "마이크로태스크(Promise.then)는 항상 매크로태스크(setTimeout)보다 먼저 처리됩니다. 자세한 내용은 29챕터에서 다룹니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 이벤트 루프 이해로 해결하는 버그",
      content:
        "이벤트 루프 이해를 바탕으로 실제 버그를 예방하고 성능을 개선하는 패턴을 익힙니다.",
      code: {
        language: "javascript",
        code:
          "// 1. setTimeout 0으로 스택 비우기 패턴\n" +
          "function processLargeArray(items, callback) {\n" +
          "  // 한 번에 처리하면 UI 멈춤\n" +
          "  // for (const item of items) callback(item);\n\n" +
          "  // 이벤트 루프에게 제어권을 돌려주며 처리\n" +
          "  let i = 0;\n" +
          "  function processNext() {\n" +
          "    if (i < items.length) {\n" +
          "      callback(items[i++]);\n" +
          "      setTimeout(processNext, 0); // 다음 이벤트 루프 턴에서 실행\n" +
          "    }\n" +
          "  }\n" +
          "  processNext();\n" +
          "}\n\n" +
          "// 2. 이벤트 핸들러와 비동기의 관계\n" +
          "document.getElementById?.('btn')?.addEventListener('click', () => {\n" +
          "  console.log('클릭 시작');\n" +
          "  setTimeout(() => console.log('비동기 작업 완료'), 1000);\n" +
          "  console.log('클릭 끝');\n" +
          "  // 출력: '클릭 시작' → '클릭 끝' → (1초 후) '비동기 작업 완료'\n" +
          "});\n\n" +
          "// 3. 콜 스택 오버플로우\n" +
          "function countDown(n) {\n" +
          "  if (n <= 0) return;\n" +
          "  countDown(n - 1); // 재귀가 깊어지면 스택 오버플로우\n" +
          "}\n" +
          "// countDown(100000); // RangeError: Maximum call stack size exceeded\n\n" +
          "// 해결: 트램폴린 패턴이나 반복문 사용",
        description:
          "긴 동기 작업은 이벤트 루프를 블로킹하여 UI를 멈춥니다. setTimeout 0으로 작업을 분산하면 브라우저가 렌더링과 이벤트 처리를 계속할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "```\n" +
        "[JS 런타임 구조]\n" +
        "┌─────────────────────────────────────────┐\n" +
        "│  JS 엔진 (V8)                           │\n" +
        "│  ┌──────────┐  ┌─────────────────────┐ │\n" +
        "│  │ 콜 스택   │  │ 힙 (객체 저장)       │ │\n" +
        "│  └──────────┘  └─────────────────────┘ │\n" +
        "└─────────────────────────────────────────┘\n" +
        "         ↑                    ↑\n" +
        "   이벤트 루프           Web APIs\n" +
        "         ↑              (타이머, 네트워크)\n" +
        "┌─────────────────────────────────────────┐\n" +
        "│  마이크로태스크 큐 (Promise.then 등)      │\n" +
        "│  매크로태스크 큐 (setTimeout 등)          │\n" +
        "└─────────────────────────────────────────┘\n" +
        "```\n\n" +
        "**핵심 규칙:**\n" +
        "- 동기 코드 → 마이크로태스크 → 매크로태스크 순으로 실행\n" +
        "- 긴 동기 작업은 이벤트 루프를 블로킹\n" +
        "- `setTimeout(fn, 0)`은 현재 실행 컨텍스트 이후에 실행됨\n\n" +
        "**다음 챕터 미리보기:** 콜백 패턴의 장단점과 '콜백 지옥'을 해결하는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "자바스크립트가 싱글 스레드인데도 비동기 처리가 가능한 이유를 설명할 수 있다",
    "콜 스택, 힙, 태스크 큐의 역할을 각각 설명할 수 있다",
    "이벤트 루프의 동작 순서를 설명할 수 있다",
    "setTimeout(fn, 0)이 왜 동기 코드보다 나중에 실행되는지 설명할 수 있다",
    "긴 동기 작업이 UI를 블로킹하는 이유를 설명할 수 있다",
    "콜 스택 오버플로우가 발생하는 조건을 안다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "console.log('A'); setTimeout(()=>console.log('B'),0); console.log('C');의 출력 순서는?",
      choices: ["A, B, C", "A, C, B", "B, A, C", "C, A, B"],
      correctIndex: 1,
      explanation:
        "setTimeout 콜백은 Web API를 통해 태스크 큐에 들어갑니다. 콜 스택이 비어야 처리되므로, 동기 코드인 A와 C가 먼저 출력되고 그 후에 B가 출력됩니다.",
    },
    {
      id: "q2",
      question: "이벤트 루프의 역할은?",
      choices: [
        "비동기 코드를 동기로 변환한다",
        "콜 스택이 비면 태스크 큐의 태스크를 스택으로 가져온다",
        "새 스레드를 생성해 비동기 작업을 처리한다",
        "Web API를 직접 실행한다",
      ],
      correctIndex: 1,
      explanation:
        "이벤트 루프는 콜 스택과 태스크 큐를 모니터링합니다. 콜 스택이 비어 있을 때 태스크 큐에서 태스크를 하나씩 가져와 콜 스택에서 실행합니다.",
    },
    {
      id: "q3",
      question: "무한 루프(while(true){})를 실행하면 브라우저가 멈추는 이유는?",
      choices: [
        "메모리가 부족해서",
        "콜 스택이 넘쳐서",
        "콜 스택이 비워지지 않아 이벤트 루프가 태스크를 처리하지 못해서",
        "Web API가 비활성화되어서",
      ],
      correctIndex: 2,
      explanation:
        "무한 루프는 콜 스택을 점유한 채 절대 빠져나오지 않습니다. 이벤트 루프는 콜 스택이 비어야 다음 태스크를 처리할 수 있으므로, UI 업데이트와 이벤트 처리가 모두 중단됩니다.",
    },
    {
      id: "q4",
      question: "Web API가 하는 역할은?",
      choices: [
        "JS 엔진의 일부로 동기 코드를 실행한다",
        "타이머, 네트워크 요청 등 비동기 작업을 별도 환경에서 처리한다",
        "콜 스택을 직접 조작한다",
        "가비지 컬렉션을 담당한다",
      ],
      correctIndex: 1,
      explanation:
        "Web API는 브라우저(또는 Node.js의 libuv)가 제공하는 비동기 처리 환경입니다. 타이머, 네트워크 요청, DOM 이벤트 등을 JS 엔진 외부에서 처리하고 완료 시 콜백을 태스크 큐에 추가합니다.",
    },
    {
      id: "q5",
      question: "콜 스택에서 함수가 제거되는 시점은?",
      choices: [
        "함수가 호출될 때",
        "setTimeout이 등록될 때",
        "함수 실행이 완료되어 반환될 때",
        "가비지 컬렉터가 실행될 때",
      ],
      correctIndex: 2,
      explanation:
        "콜 스택은 LIFO 구조입니다. 함수가 호출되면 스택에 push되고, 실행이 완료(return)되면 pop됩니다. 반환 값이 없는 함수도 실행 완료 시 스택에서 제거됩니다.",
    },
    {
      id: "q6",
      question: "자바스크립트가 싱글 스레드인데도 비동기 처리가 가능한 핵심 이유는?",
      choices: [
        "JS 엔진 내부에 멀티스레드가 있어서",
        "Web API가 별도 환경에서 비동기 작업을 처리하고 이벤트 루프가 결과를 스택에 전달해서",
        "async/await이 멀티스레딩을 추상화해서",
        "컴파일 단계에서 비동기 코드가 동기 코드로 변환되어서",
      ],
      correctIndex: 1,
      explanation:
        "JS 엔진 자체는 싱글 스레드이지만, 타이머·네트워크 같은 비동기 작업은 Web API(브라우저 멀티스레드 환경)가 처리합니다. 완료 후 콜백이 태스크 큐에 추가되고 이벤트 루프가 실행합니다.",
    },
  ],
};

export default chapter;
