import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "09-process-thread",
  subject: "cs",
  title: "프로세스와 스레드",
  description:
    "프로세스와 스레드의 차이를 이해하고, 브라우저와 Node.js에서의 동시성 모델을 학습합니다.",
  order: 9,
  group: "운영체제",
  prerequisites: [],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "**프로세스**는 독립된 공장입니다. 각 공장은 자체 건물(메모리 공간), 자체 전력(CPU 시간), 자체 창고(데이터)를 가지고 있습니다. 공장 하나가 화재로 멈춰도 옆 공장은 영향을 받지 않습니다.\n\n" +
        "**스레드**는 같은 공장 안의 작업 라인입니다. 여러 라인이 같은 창고(메모리)를 공유하며 동시에 작업합니다. 효율적이지만, 한 라인이 창고를 어지럽히면 다른 라인도 피해를 봅니다.\n\n" +
        "Chrome 브라우저를 떠올려보세요. 각 탭은 별도의 **프로세스**입니다. 한 탭이 멈춰도 다른 탭은 정상 동작합니다. " +
        "하지만 각 탭 안에서는 여러 **스레드**가 협력합니다 — 메인 스레드가 UI를 그리고, 네트워크 스레드가 데이터를 가져오고, 렌더링 스레드가 화면을 합성합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 개발에서 프로세스와 스레드 개념은 왜 중요할까요?\n\n" +
        "1. **메인 스레드 블로킹** — 자바스크립트는 기본적으로 싱글 스레드입니다. 무거운 연산이 메인 스레드를 차지하면 UI가 멈추고 사용자 입력에 반응하지 못합니다.\n\n" +
        "2. **탭 크래시 격리** — 과거 브라우저는 모든 탭이 하나의 프로세스에서 동작했습니다. 하나의 탭이 크래시하면 브라우저 전체가 종료되었습니다.\n\n" +
        "3. **동시성 vs 병렬성 혼동** — `Promise.all`이 병렬 실행이라고 오해하거나, Web Worker의 역할을 이해하지 못하는 경우가 많습니다.\n\n" +
        "4. **Node.js 성능 이슈** — Node.js의 이벤트 루프가 싱글 스레드라는 것을 모르면, CPU 집약 작업으로 서버 전체가 블로킹되는 문제를 겪게 됩니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 프로세스와 스레드의 핵심 차이\n\n" +
        "| 구분 | 프로세스 | 스레드 |\n" +
        "|------|----------|--------|\n" +
        "| 메모리 | 독립된 메모리 공간 | 같은 프로세스의 메모리 공유 |\n" +
        "| 생성 비용 | 높음 (메모리 복제) | 낮음 (스택만 별도) |\n" +
        "| 통신 방법 | IPC (Inter-Process Communication) | 공유 메모리 직접 접근 |\n" +
        "| 안정성 | 하나가 죽어도 다른 것에 영향 없음 | 하나가 죽으면 전체 프로세스 위험 |\n\n" +
        "### Chrome의 멀티 프로세스 아키텍처\n\n" +
        "Chrome은 각 탭, 각 확장 프로그램, GPU 처리, 네트워크 등을 별도 프로세스로 분리합니다:\n" +
        "- **브라우저 프로세스**: 주소창, 북마크, 네트워크 요청 관리\n" +
        "- **렌더러 프로세스**: 각 탭마다 하나씩, HTML/CSS/JS 처리\n" +
        "- **GPU 프로세스**: 화면 합성 및 그래픽 가속\n" +
        "- **플러그인 프로세스**: 확장 프로그램 실행\n\n" +
        "### 동시성(Concurrency) vs 병렬성(Parallelism)\n\n" +
        "- **동시성**: 하나의 스레드가 여러 작업을 번갈아 처리 (시분할). JS의 이벤트 루프가 이 방식입니다.\n" +
        "- **병렬성**: 여러 스레드/코어가 동시에 작업을 처리. Web Worker가 이 방식입니다.\n\n" +
        "`Promise.all`은 **동시성**입니다. 네트워크 요청을 동시에 보내지만, 콜백은 하나의 스레드에서 순차적으로 실행됩니다. " +
        "진정한 **병렬성**이 필요하면 Web Worker를 사용해야 합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Web Worker로 병렬 처리",
      content:
        "메인 스레드를 블로킹하지 않고 무거운 연산을 처리하는 Web Worker 패턴을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// === 메인 스레드 (main.ts) ===\n' +
          '// Web Worker는 별도 스레드에서 실행되는 독립된 실행 컨텍스트\n' +
          '\n' +
          '// Worker 생성 — 별도의 스레드(OS 레벨)가 생성됨\n' +
          'const worker = new Worker("worker.js");\n' +
          '\n' +
          '// Worker에게 데이터 전달 (구조화된 복제 알고리즘으로 복사)\n' +
          'worker.postMessage({ type: "CALCULATE", data: largeArray });\n' +
          '\n' +
          '// Worker의 결과 수신 — 메인 스레드는 블로킹되지 않음\n' +
          'worker.onmessage = (event) => {\n' +
          '  console.log("결과:", event.data.result);\n' +
          '  // UI 업데이트는 메인 스레드에서만 가능\n' +
          '  document.getElementById("result")!.textContent = event.data.result;\n' +
          '};\n' +
          '\n' +
          '// Worker 에러 처리\n' +
          'worker.onerror = (error) => {\n' +
          '  console.error("Worker 에러:", error.message);\n' +
          '};\n' +
          '\n' +
          '// === Worker 스레드 (worker.js) ===\n' +
          '// Worker는 별도 전역 스코프(self)를 가짐\n' +
          '// DOM 접근 불가, window 객체 없음\n' +
          '\n' +
          'self.onmessage = (event) => {\n' +
          '  const { type, data } = event.data;\n' +
          '  if (type === "CALCULATE") {\n' +
          '    // CPU 집약 연산 — 메인 스레드에 영향 없음\n' +
          '    const result = heavyComputation(data);\n' +
          '    self.postMessage({ result });\n' +
          '  }\n' +
          '};',
        description:
          "Web Worker는 별도 OS 스레드에서 실행되어 메인 스레드를 블로킹하지 않습니다. postMessage로 통신하며, DOM에는 접근할 수 없습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 메인 스레드 블로킹 감지와 해결",
      content:
        "메인 스레드가 블로킹되는 상황을 재현하고, 이를 해결하는 방법을 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// ❌ 메인 스레드 블로킹 — UI가 멈춤\n' +
          'function fibonacciSync(n: number): number {\n' +
          '  if (n <= 1) return n;\n' +
          '  return fibonacciSync(n - 1) + fibonacciSync(n - 2);\n' +
          '}\n' +
          '\n' +
          'button.addEventListener("click", () => {\n' +
          '  // 이 연산 동안 UI가 완전히 멈춤 (클릭, 스크롤 불가)\n' +
          '  const result = fibonacciSync(45); // 수 초 소요\n' +
          '  output.textContent = String(result);\n' +
          '});\n' +
          '\n' +
          '// ✅ 해결 1: Web Worker 사용\n' +
          'button.addEventListener("click", () => {\n' +
          '  const worker = new Worker("fib-worker.js");\n' +
          '  worker.postMessage(45);\n' +
          '  worker.onmessage = (e) => {\n' +
          '    output.textContent = String(e.data);\n' +
          '    worker.terminate(); // 사용 후 정리\n' +
          '  };\n' +
          '});\n' +
          '\n' +
          '// ✅ 해결 2: 작업 분할 (Time Slicing)\n' +
          'async function fibonacciAsync(n: number): Promise<number> {\n' +
          '  const memo: number[] = [0, 1];\n' +
          '  for (let i = 2; i <= n; i++) {\n' +
          '    memo[i] = memo[i - 1] + memo[i - 2];\n' +
          '    // 16ms마다 메인 스레드에 제어권 반환 (60fps 유지)\n' +
          '    if (i % 1000 === 0) {\n' +
          '      await new Promise((resolve) => setTimeout(resolve, 0));\n' +
          '    }\n' +
          '  }\n' +
          '  return memo[n];\n' +
          '}\n' +
          '\n' +
          '// ✅ 해결 3: Node.js에서 worker_threads 사용\n' +
          '// import { Worker } from "worker_threads";\n' +
          '// const worker = new Worker("./heavy-task.js");',
        description:
          "메인 스레드 블로킹을 해결하는 세 가지 방법: Web Worker, 작업 분할(Time Slicing), Node.js worker_threads.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### 프로세스 vs 스레드\n" +
        "- **프로세스**: 독립된 메모리 공간, 높은 격리성, 생성 비용 높음\n" +
        "- **스레드**: 메모리 공유, 가벼움, 동기화 문제 발생 가능\n\n" +
        "### 브라우저에서의 적용\n" +
        "- Chrome은 탭마다 별도 프로세스 (안정성)\n" +
        "- 각 탭 내부에서 메인 스레드 + 워커 스레드 협력\n" +
        "- JS는 싱글 스레드 + 이벤트 루프 = 동시성\n" +
        "- Web Worker = 진정한 병렬성\n\n" +
        "### Node.js에서의 적용\n" +
        "- 이벤트 루프는 싱글 스레드\n" +
        "- I/O 작업은 내부적으로 스레드 풀(libuv) 활용\n" +
        "- CPU 집약 작업은 worker_threads로 분리\n\n" +
        "**핵심:** 프론트엔드에서 '싱글 스레드'는 메인 스레드가 싱글이라는 뜻이지, 브라우저 전체가 싱글 스레드라는 뜻이 아닙니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "프로세스는 독립된 메모리 공간을 가진 실행 단위이고, 스레드는 메모리를 공유하는 실행 단위이다. JS는 싱글 스레드지만 Web Worker로 병렬 처리가 가능하다.",
  checklist: [
    "프로세스와 스레드의 메모리 공유 차이를 설명할 수 있다",
    "Chrome의 멀티 프로세스 아키텍처를 설명할 수 있다",
    "동시성(Concurrency)과 병렬성(Parallelism)의 차이를 구분할 수 있다",
    "Web Worker를 사용하여 메인 스레드 블로킹을 방지할 수 있다",
    "Node.js 이벤트 루프가 싱글 스레드인 이유와 한계를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "프로세스와 스레드의 가장 큰 차이점은?",
      choices: [
        "프로세스는 빠르고 스레드는 느리다",
        "프로세스는 독립된 메모리를 가지고 스레드는 메모리를 공유한다",
        "프로세스는 CPU를 사용하고 스레드는 GPU를 사용한다",
        "프로세스는 서버에서만, 스레드는 브라우저에서만 사용된다",
      ],
      correctIndex: 1,
      explanation:
        "프로세스는 각각 독립된 메모리 공간을 가지지만, 같은 프로세스 내의 스레드들은 힙 메모리를 공유합니다. 이로 인해 스레드는 가볍지만 동기화 문제가 발생할 수 있습니다.",
    },
    {
      id: "q2",
      question: "Chrome 브라우저에서 한 탭이 크래시해도 다른 탭이 정상 동작하는 이유는?",
      choices: [
        "각 탭이 별도의 스레드에서 동작하므로",
        "각 탭이 별도의 프로세스에서 동작하므로",
        "Chrome이 에러를 자동으로 복구하므로",
        "탭마다 별도의 이벤트 루프가 있으므로",
      ],
      correctIndex: 1,
      explanation:
        "Chrome은 멀티 프로세스 아키텍처를 사용하여 각 탭을 별도의 렌더러 프로세스에서 실행합니다. 프로세스는 독립된 메모리 공간을 가지므로 하나가 크래시해도 다른 프로세스에 영향을 주지 않습니다.",
    },
    {
      id: "q3",
      question: "Promise.all([fetch(url1), fetch(url2)])은 어떤 방식으로 동작하는가?",
      choices: [
        "두 요청이 별도 스레드에서 병렬 실행된다",
        "두 요청이 순차적으로 실행된다",
        "네트워크 요청은 동시에 보내지만 콜백은 싱글 스레드에서 처리된다",
        "두 요청이 Web Worker에서 실행된다",
      ],
      correctIndex: 2,
      explanation:
        "fetch 요청 자체는 브라우저의 네트워크 스레드에서 동시에 처리되지만, then/catch 콜백은 메인 스레드의 이벤트 루프에서 하나씩 실행됩니다. 이는 동시성(Concurrency)이지 병렬성(Parallelism)이 아닙니다.",
    },
    {
      id: "q4",
      question: "Web Worker에서 할 수 없는 것은?",
      choices: [
        "fetch로 네트워크 요청 보내기",
        "DOM 요소에 접근하기",
        "setTimeout 사용하기",
        "다른 Worker 생성하기",
      ],
      correctIndex: 1,
      explanation:
        "Web Worker는 별도 스레드에서 실행되며 DOM에 접근할 수 없습니다. DOM은 메인 스레드에서만 조작할 수 있으며, Worker는 postMessage를 통해 메인 스레드에 결과를 전달하고 메인 스레드가 DOM을 업데이트해야 합니다.",
    },
    {
      id: "q5",
      question:
        "Node.js에서 CPU 집약적인 이미지 처리를 하면 서버가 느려지는 이유는?",
      choices: [
        "Node.js가 메모리를 적게 사용하므로",
        "이벤트 루프가 싱글 스레드라 CPU 작업이 다른 요청을 블로킹하므로",
        "Node.js가 이미지 처리를 지원하지 않으므로",
        "V8 엔진이 이미지 데이터를 최적화하지 못하므로",
      ],
      correctIndex: 1,
      explanation:
        "Node.js의 이벤트 루프는 싱글 스레드입니다. CPU 집약적인 작업이 이벤트 루프를 점유하면 다른 모든 요청의 콜백 처리가 지연됩니다. worker_threads 모듈을 사용하여 CPU 작업을 별도 스레드로 분리해야 합니다.",
    },
  ],
};

export default chapter;
