import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "26-callback-pattern",
  subject: "js",
  title: "콜백 패턴과 에러 처리",
  description: "콜백 함수의 동작 원리, 콜백 지옥의 문제점, 에러 우선 콜백 패턴, 비동기 제어 흐름의 어려움을 이해합니다.",
  order: 26,
  group: "비동기",
  prerequisites: ["25-event-loop"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "콜백 함수는 **'완료되면 연락 주세요'** 라는 메모와 같습니다.\n\n" +
        "피자 배달을 시키고 전화번호(콜백)를 남겨 두는 것과 같습니다. '피자가 도착하면 이 번호로 전화해 주세요.' 이렇게 하면 피자를 기다리는 동안 다른 일을 할 수 있습니다.\n\n" +
        "하지만 **콜백 지옥**은 이렇습니다: 피자를 받으면 음료를 주문하고, 음료를 받으면 디저트를 주문하고, 디저트를 받으면 청구서를 요청하고... 모든 '완료 후 다음 작업'이 중첩되면서 코드가 오른쪽으로 계속 들여쓰기됩니다.\n\n" +
        "**에러 우선 콜백**은 택배 수령 절차와 같습니다. 택배기사는 '물건이 있으면 받으시고 (null, data), 파손됐으면 에러 신고하세요 (error, null).' 에러가 있으면 처음 확인하고, 없으면 데이터를 처리하는 Node.js의 관행입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "콜백 기반 비동기 코드에는 근본적인 문제들이 있습니다:\n\n" +
        "**1. 콜백 지옥 (Callback Hell)**\n" +
        "```javascript\n" +
        "getUser(userId, (err, user) => {\n" +
        "  if (err) return handleError(err);\n" +
        "  getOrders(user.id, (err, orders) => {\n" +
        "    if (err) return handleError(err);\n" +
        "    getProduct(orders[0].productId, (err, product) => {\n" +
        "      if (err) return handleError(err);\n" +
        "      // 계속 깊어짐...\n" +
        "    });\n" +
        "  });\n" +
        "});\n" +
        "```\n\n" +
        "**2. 에러 처리의 복잡성**: 각 콜백마다 에러를 처리해야 합니다.\n\n" +
        "**3. 제어 역전(Inversion of Control)**: 콜백을 외부 라이브러리에 넘기면, 언제 어떻게 호출될지 제어권을 잃게 됩니다.\n\n" +
        "**4. 동기적 처리 불가**: `try-catch`가 비동기 콜백의 에러를 잡지 못합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 콜백 함수란?\n" +
        "다른 함수의 인수로 전달되어 나중에 호출되는 함수입니다. 동기/비동기 모두 사용됩니다.\n\n" +
        "```javascript\n" +
        "[1,2,3].forEach(n => console.log(n)); // 동기 콜백\n" +
        "setTimeout(() => console.log('비동기'), 0); // 비동기 콜백\n" +
        "```\n\n" +
        "### 에러 우선 콜백 (Error-First Callback) 패턴\n" +
        "Node.js의 표준 패턴입니다. 콜백의 첫 번째 인수는 항상 에러, 두 번째 인수는 데이터입니다.\n\n" +
        "```javascript\n" +
        "fs.readFile('path.txt', (err, data) => {\n" +
        "  if (err) { /* 에러 처리 */ return; }\n" +
        "  /* 데이터 처리 */\n" +
        "});\n" +
        "```\n\n" +
        "### 콜백 지옥 완화 방법\n" +
        "1. **함수 분리**: 중첩 콜백을 이름 있는 함수로 추출\n" +
        "2. **모듈화**: 각 단계를 별도 함수/모듈로 분리\n" +
        "3. **async 라이브러리**: `async.waterfall`, `async.series`\n" +
        "4. **Promise로 전환**: 가장 근본적인 해결책 (다음 챕터)\n\n" +
        "### 비동기 에러는 try-catch로 잡을 수 없음\n" +
        "```javascript\n" +
        "try {\n" +
        "  setTimeout(() => { throw new Error('비동기 에러'); }, 0);\n" +
        "} catch (e) {\n" +
        "  console.log('잡힘?'); // 실행되지 않음!\n" +
        "}\n" +
        "```\n" +
        "setTimeout 콜백은 다른 이벤트 루프 턴에서 실행되므로 외부 try-catch가 잡지 못합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 제어 역전 문제와 방어 패턴",
      content:
        "콜백을 외부에 넘길 때 발생하는 '제어 역전' 문제와 방어 패턴을 살펴봅니다.",
      code: {
        language: "javascript",
        code:
          "// === 제어 역전 문제 ===\n" +
          "// 외부 라이브러리에 콜백을 넘기면 신뢰를 잃게 됨\n" +
          "thirdPartyLib.onComplete(function myCallback(data) {\n" +
          "  // 이 콜백이 몇 번 호출될지 모름\n" +
          "  // 언제 호출될지 모름\n" +
          "  // 에러가 어떻게 전달될지 모름\n" +
          "  processPayment(data); // 한 번만 호출되어야 함!\n" +
          "});\n\n" +
          "// === 방어 패턴: 한 번만 호출 보장 ===\n" +
          "function once(fn) {\n" +
          "  let called = false;\n" +
          "  return function(...args) {\n" +
          "    if (!called) {\n" +
          "      called = true;\n" +
          "      return fn.apply(this, args);\n" +
          "    }\n" +
          "  };\n" +
          "}\n" +
          "const safeCallback = once(processPayment);\n" +
          "thirdPartyLib.onComplete(safeCallback); // 여러 번 호출해도 1번만 실행\n\n" +
          "// === 콜백 지옥 → 함수 분리 리팩터링 ===\n" +
          "// Before: 중첩\n" +
          "getUser(id, (err, user) => {\n" +
          "  if (err) return handleError(err);\n" +
          "  getOrders(user.id, (err, orders) => {\n" +
          "    if (err) return handleError(err);\n" +
          "    renderOrders(orders);\n" +
          "  });\n" +
          "});\n\n" +
          "// After: 함수 분리\n" +
          "function handleOrders(err, orders) {\n" +
          "  if (err) return handleError(err);\n" +
          "  renderOrders(orders);\n" +
          "}\n" +
          "function handleUser(err, user) {\n" +
          "  if (err) return handleError(err);\n" +
          "  getOrders(user.id, handleOrders);\n" +
          "}\n" +
          "getUser(id, handleUser); // 수평 구조",
        description:
          "함수 분리로 콜백 지옥의 깊이를 줄일 수 있지만, 코드의 흐름이 분산되어 추적이 어려워집니다. 이것이 Promise가 필요한 이유입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 콜백 패턴 구현과 비동기 에러 처리",
      content:
        "에러 우선 콜백 패턴을 직접 구현하고 비동기 에러 처리의 한계를 확인합니다.",
      code: {
        language: "javascript",
        code:
          "// 1. 에러 우선 콜백 패턴 구현\n" +
          "function readConfig(filename, callback) {\n" +
          "  // 비동기 파일 읽기 시뮬레이션\n" +
          "  setTimeout(() => {\n" +
          "    if (filename === '') {\n" +
          "      callback(new Error('파일명이 없습니다'), null);\n" +
          "    } else {\n" +
          "      callback(null, { theme: 'dark', lang: 'ko' });\n" +
          "    }\n" +
          "  }, 100);\n" +
          "}\n\n" +
          "readConfig('settings.json', (err, config) => {\n" +
          "  if (err) {\n" +
          "    console.error('설정 읽기 실패:', err.message);\n" +
          "    return;\n" +
          "  }\n" +
          "  console.log('설정:', config);\n" +
          "});\n\n" +
          "// 2. 비동기 에러를 try-catch로 잡지 못하는 예시\n" +
          "try {\n" +
          "  setTimeout(() => {\n" +
          "    throw new Error('비동기 에러');\n" +
          "  }, 0);\n" +
          "} catch (e) {\n" +
          "  console.log('잡힘!'); // 절대 실행 안됨\n" +
          "}\n\n" +
          "// 3. 올바른 방법: 콜백 내부에서 에러 처리\n" +
          "setTimeout(() => {\n" +
          "  try {\n" +
          "    throw new Error('비동기 에러');\n" +
          "  } catch (e) {\n" +
          "    console.log('콜백 내부에서 잡힘:', e.message);\n" +
          "  }\n" +
          "}, 0);\n\n" +
          "// 4. 병렬 콜백 — 완료 추적의 어려움\n" +
          "let results = [];\n" +
          "let completed = 0;\n" +
          "const tasks = [fetchA, fetchB, fetchC];\n\n" +
          "tasks.forEach((task, i) => {\n" +
          "  task((err, data) => {\n" +
          "    if (err) return handleError(err);\n" +
          "    results[i] = data;\n" +
          "    if (++completed === tasks.length) {\n" +
          "      allDone(results); // 수동으로 완료 감지 필요\n" +
          "    }\n" +
          "  });\n" +
          "});",
        description:
          "병렬 비동기 처리의 완료를 카운터로 추적하는 것은 번거롭고 오류가 발생하기 쉽습니다. Promise.all이 이를 우아하게 해결합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**콜백 패턴의 특징:**\n" +
        "- 함수를 인수로 전달해 나중에 호출하는 패턴\n" +
        "- 동기/비동기 모두 사용 가능\n" +
        "- Node.js 에러 우선 콜백: `callback(err, data)` 형식\n\n" +
        "**콜백의 한계:**\n" +
        "1. 중첩으로 인한 **콜백 지옥**\n" +
        "2. **제어 역전** — 외부 코드에 콜백 실행 제어권을 잃음\n" +
        "3. **에러 전파 어려움** — try-catch 불가, 각 콜백에서 개별 처리 필요\n" +
        "4. **순서/병렬 처리** 코드 복잡도 증가\n\n" +
        "**해결책:** Promise(다음 챕터), async/await(28챕터)\n\n" +
        "**다음 챕터 미리보기:** Promise가 제어 역전과 콜백 지옥을 어떻게 해결하는지 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "콜백 함수의 개념과 동기/비동기 콜백의 차이를 설명할 수 있다",
    "에러 우선 콜백 패턴을 구현할 수 있다",
    "콜백 지옥이 발생하는 이유와 문제점을 설명할 수 있다",
    "제어 역전 문제를 설명할 수 있다",
    "비동기 에러를 try-catch로 잡을 수 없는 이유를 설명할 수 있다",
    "함수 분리로 콜백 지옥을 완화하는 방법을 안다",
  ],
  quiz: [
    {
      id: "q1",
      question: "에러 우선 콜백(Error-First Callback) 패턴의 형식은?",
      choices: [
        "callback(data, err)",
        "callback(err, data)",
        "callback({ err, data })",
        "callback.error(err); callback.success(data)",
      ],
      correctIndex: 1,
      explanation:
        "Node.js의 에러 우선 콜백 패턴은 첫 번째 인수가 에러, 두 번째 인수가 데이터입니다. 에러가 없으면 null을 전달합니다. 이 관례를 따르면 콜백 내부에서 항상 에러를 먼저 확인할 수 있습니다.",
    },
    {
      id: "q2",
      question: "try-catch로 비동기 콜백의 에러를 잡을 수 없는 이유는?",
      choices: [
        "try-catch는 함수 내부에서만 동작해서",
        "콜백은 다른 이벤트 루프 턴에서 실행되어 try-catch 컨텍스트를 벗어나서",
        "비동기 코드는 에러를 던지지 않아서",
        "콜백 함수는 스코프가 없어서",
      ],
      correctIndex: 1,
      explanation:
        "setTimeout 콜백은 현재 실행 컨텍스트가 끝난 후 새로운 이벤트 루프 턴에서 실행됩니다. 외부의 try-catch는 현재 턴에서만 유효하므로 다른 턴에서 발생하는 에러를 잡을 수 없습니다.",
    },
    {
      id: "q3",
      question: "제어 역전(Inversion of Control) 문제란?",
      choices: [
        "비동기 코드가 동기보다 빨리 실행되는 문제",
        "콜백을 외부 코드에 넘길 때 콜백의 실행 방식에 대한 제어권을 잃는 문제",
        "콜 스택이 역순으로 실행되는 문제",
        "이벤트 루프가 역방향으로 동작하는 문제",
      ],
      correctIndex: 1,
      explanation:
        "콜백을 외부 라이브러리에 전달하면 '언제, 몇 번, 어떤 컨텍스트에서 호출되는지'를 우리가 직접 제어할 수 없습니다. Promise는 이 문제를 해결합니다.",
    },
    {
      id: "q4",
      question: "콜백 지옥(Callback Hell)의 주요 문제점이 아닌 것은?",
      choices: [
        "코드 가독성 저하",
        "에러 처리 복잡성 증가",
        "성능이 크게 저하됨",
        "유지보수 어려움",
      ],
      correctIndex: 2,
      explanation:
        "콜백 지옥은 주로 코드 구조의 문제(가독성, 유지보수, 에러 처리)입니다. 콜백 중첩 자체가 성능을 크게 저하시키지는 않습니다. 성능 문제는 별도의 원인이 있습니다.",
    },
    {
      id: "q5",
      question: "한 번만 호출되어야 하는 콜백을 보호하는 패턴은?",
      choices: [
        "에러 우선 패턴",
        "once 패턴 (호출 여부를 플래그로 추적)",
        "타임아웃 패턴",
        "클로저 패턴",
      ],
      correctIndex: 1,
      explanation:
        "once 패턴은 called 플래그를 클로저로 유지해 콜백이 최초 1회만 실행되도록 보장합니다. Lodash의 _.once나 직접 구현으로 제어 역전 문제의 일부를 완화할 수 있습니다.",
    },
  ],
};

export default chapter;
