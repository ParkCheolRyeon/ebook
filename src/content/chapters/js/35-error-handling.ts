import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "35-error-handling",
  subject: "js",
  title: "에러 처리",
  description: "Error 객체 계층, try/catch/finally 동작 원리, 커스텀 에러 클래스, 에러 전파, 비동기 에러 처리, 전역 에러 핸들링까지 깊이 이해합니다.",
  order: 35,
  group: "모듈과 환경",
  prerequisites: ["34-strict-mode"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "에러 처리는 '식당의 서비스 복구 체계'와 같습니다.\n\n" +
        "**에러 발생(throw)**은 주방에서 문제가 생겨 종업원에게 알리는 것입니다. '이 요리는 만들 수 없어요!'라고 보고합니다.\n\n" +
        "**try/catch**는 매니저가 '무슨 일이든 내가 처리하겠어'라고 구역을 지정하는 것입니다. try 구역에서 문제가 생기면 즉시 catch로 넘어가 복구를 시도합니다.\n\n" +
        "**finally**는 '요리가 성공하든 실패하든 마지막에 주방은 반드시 청소한다'는 규칙입니다. 성공/실패와 무관하게 항상 실행되어 리소스를 정리합니다.\n\n" +
        "**에러 전파(propagation)**는 종업원이 해결 못하면 매니저에게, 매니저도 못하면 점장에게 에스컬레이션하는 것입니다. catch가 없으면 콜 스택을 타고 올라갑니다.\n\n" +
        "**커스텀 에러**는 '식재료 부족 오류', '알레르기 경고' 같이 상황별로 명확한 이름의 에러를 만들어 적절히 대응하게 합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "에러 처리를 제대로 하지 않으면 발생하는 문제들:\n\n" +
        "**1. 에러 묻어두기 — 빈 catch**\n" +
        "```js\n" +
        "try {\n" +
        "  JSON.parse(badJson);\n" +
        "} catch (e) {\n" +
        "  // 아무것도 안 함 → 에러 무시, 디버깅 불가\n" +
        "}\n" +
        "```\n\n" +
        "**2. 에러 타입 구분 없이 처리**\n" +
        "```js\n" +
        "try {\n" +
        "  await fetchUser(id);\n" +
        "} catch (e) {\n" +
        "  // 네트워크 에러? 인증 에러? 404? 모두 같은 메시지\n" +
        "  alert('에러가 발생했습니다.');\n" +
        "}\n" +
        "```\n\n" +
        "**3. 비동기 에러 처리 누락**\n" +
        "```js\n" +
        "// ❌ try/catch는 Promise를 잡지 못함!\n" +
        "try {\n" +
        "  setTimeout(() => { throw new Error('async error'); }, 0);\n" +
        "} catch (e) {\n" +
        "  console.log('못 잡힘!'); // 실행 안 됨\n" +
        "}\n" +
        "```\n\n" +
        "에러는 타입을 구분하고, 적절히 복구하거나 전파하고, 항상 로깅해야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### Error 객체 계층\n\n" +
        "```\n" +
        "Error\n" +
        "├── SyntaxError    — 문법 오류\n" +
        "├── ReferenceError — 미선언 변수 접근\n" +
        "├── TypeError      — 잘못된 타입 연산\n" +
        "├── RangeError     — 범위 초과\n" +
        "├── URIError       — URI 함수 잘못된 사용\n" +
        "└── EvalError      — eval() 관련\n" +
        "```\n\n" +
        "모든 Error 객체는 `message`, `name`, `stack` 프로퍼티를 가집니다.\n\n" +
        "### try/catch/finally\n\n" +
        "```js\n" +
        "try {\n" +
        "  // 에러가 발생할 수 있는 코드\n" +
        "} catch (e) {\n" +
        "  // 에러 처리 (e는 throw된 값)\n" +
        "  if (e instanceof TypeError) { /* 타입 에러 처리 */ }\n" +
        "} finally {\n" +
        "  // 항상 실행 (파일 닫기, 연결 해제 등)\n" +
        "}\n" +
        "```\n\n" +
        "### 커스텀 에러 클래스\n\n" +
        "```js\n" +
        "class ValidationError extends Error {\n" +
        "  constructor(message, field) {\n" +
        "    super(message);\n" +
        "    this.name = 'ValidationError';\n" +
        "    this.field = field;\n" +
        "  }\n" +
        "}\n" +
        "```\n\n" +
        "### 비동기 에러 처리\n\n" +
        "```js\n" +
        "// Promise: .catch() 또는 두 번째 인자\n" +
        "fetch(url).then(res => res.json()).catch(err => console.error(err));\n" +
        "\n" +
        "// async/await: try/catch\n" +
        "async function load() {\n" +
        "  try {\n" +
        "    const data = await fetch(url);\n" +
        "  } catch (e) {\n" +
        "    // 비동기 에러도 잡힘!\n" +
        "  }\n" +
        "}\n" +
        "```\n\n" +
        "### 전역 에러 핸들링\n\n" +
        "```js\n" +
        "// 처리되지 않은 동기 에러\n" +
        "window.onerror = (msg, src, line, col, err) => { /* 에러 리포팅 */ };\n" +
        "\n" +
        "// 처리되지 않은 Promise 거부\n" +
        "window.addEventListener('unhandledrejection', e => {\n" +
        "  console.error('미처리 Promise 거부:', e.reason);\n" +
        "  e.preventDefault(); // 기본 에러 출력 방지\n" +
        "});\n" +
        "```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 에러 전파와 커스텀 에러 계층",
      content:
        "에러가 콜 스택을 따라 전파되는 과정과 커스텀 에러 계층을 구현합니다.",
      code: {
        language: "javascript",
        code:
          "// === 커스텀 에러 계층 ===\n" +
          "class AppError extends Error {\n" +
          "  constructor(message, code) {\n" +
          "    super(message);\n" +
          "    this.name = this.constructor.name;\n" +
          "    this.code = code;\n" +
          "    // V8에서 스택 트레이스 개선\n" +
          "    if (Error.captureStackTrace) {\n" +
          "      Error.captureStackTrace(this, this.constructor);\n" +
          "    }\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "class NetworkError extends AppError {\n" +
          "  constructor(message, statusCode) {\n" +
          "    super(message, 'NETWORK_ERROR');\n" +
          "    this.statusCode = statusCode;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "class NotFoundError extends NetworkError {\n" +
          "  constructor(resource) {\n" +
          "    super(`${resource}을(를) 찾을 수 없습니다`, 404);\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// === 에러 전파 ===\n" +
          "function fetchUser(id) {\n" +
          "  if (!id) throw new ValidationError('ID가 필요합니다', 'id');\n" +
          "  if (id === 999) throw new NotFoundError('사용자');\n" +
          "  return { id, name: 'Alice' };\n" +
          "}\n" +
          "\n" +
          "function getProfile(userId) {\n" +
          "  const user = fetchUser(userId); // 에러가 여기서 전파됨\n" +
          "  return { ...user, profile: true };\n" +
          "}\n" +
          "\n" +
          "try {\n" +
          "  const profile = getProfile(999);\n" +
          "} catch (e) {\n" +
          "  if (e instanceof NotFoundError) {\n" +
          "    console.log('404 처리:', e.message);\n" +
          "  } else if (e instanceof NetworkError) {\n" +
          "    console.log('네트워크 에러:', e.statusCode);\n" +
          "  } else if (e instanceof AppError) {\n" +
          "    console.log('앱 에러:', e.code);\n" +
          "  } else {\n" +
          "    throw e; // 알 수 없는 에러는 재전파!\n" +
          "  }\n" +
          "}",
        description: "에러 계층을 구성하면 instanceof로 타입을 구분해 상황에 맞는 복구 로직을 실행할 수 있습니다. 처리 불가한 에러는 반드시 재전파(re-throw)해야 합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 비동기 에러 처리 패턴",
      content:
        "Promise와 async/await에서 에러를 안전하게 처리하는 패턴을 실습합니다.",
      code: {
        language: "javascript",
        code:
          "// === Promise 체인 에러 처리 ===\n" +
          "function fetchData(url) {\n" +
          "  return fetch(url)\n" +
          "    .then(res => {\n" +
          "      if (!res.ok) throw new NetworkError(res.statusText, res.status);\n" +
          "      return res.json();\n" +
          "    })\n" +
          "    .catch(err => {\n" +
          "      if (err instanceof NetworkError) throw err; // 재전파\n" +
          "      throw new NetworkError('네트워크 연결 실패', 0);\n" +
          "    });\n" +
          "}\n" +
          "\n" +
          "// === async/await + try/catch ===\n" +
          "async function loadUserProfile(userId) {\n" +
          "  let connection = null;\n" +
          "  try {\n" +
          "    connection = await openDbConnection();\n" +
          "    const user = await connection.query(`SELECT * FROM users WHERE id = ?`, [userId]);\n" +
          "    if (!user) throw new NotFoundError('사용자');\n" +
          "    return user;\n" +
          "  } catch (e) {\n" +
          "    if (e instanceof NotFoundError) {\n" +
          "      return null; // 404는 null 반환으로 처리\n" +
          "    }\n" +
          "    // 그 외 에러는 상위로 전파\n" +
          "    throw e;\n" +
          "  } finally {\n" +
          "    // 성공/실패와 무관하게 연결 반드시 닫기\n" +
          "    if (connection) await connection.close();\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// === Result 패턴 (에러를 값으로 처리) ===\n" +
          "async function safeLoad(userId) {\n" +
          "  try {\n" +
          "    const data = await loadUserProfile(userId);\n" +
          "    return { ok: true, data };\n" +
          "  } catch (e) {\n" +
          "    return { ok: false, error: e };\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "const result = await safeLoad(123);\n" +
          "if (result.ok) {\n" +
          "  console.log(result.data);\n" +
          "} else {\n" +
          "  console.error(result.error.message);\n" +
          "}",
        description: "finally는 Promise를 반환하는 async 함수에서도 항상 실행됩니다. Result 패턴은 에러를 값으로 처리해 코드 흐름을 더 명확하게 만드는 함수형 프로그래밍 방식입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 상황 | 올바른 처리 방법 |\n" +
        "|------|----------------|\n" +
        "| 동기 에러 | try/catch/finally |\n" +
        "| Promise 에러 | .catch() 또는 async/await + try/catch |\n" +
        "| setTimeout/콜백 에러 | 콜백 내부에서 직접 처리 |\n" +
        "| 전역 미처리 에러 | window.onerror |\n" +
        "| 전역 미처리 Promise | unhandledrejection 이벤트 |\n\n" +
        "**에러 처리 원칙:**\n" +
        "1. 빈 catch 절 금지 — 최소한 로깅\n" +
        "2. 알 수 없는 에러는 재전파(re-throw)\n" +
        "3. 커스텀 에러로 타입 구분\n" +
        "4. finally로 리소스 정리\n" +
        "5. 비동기 에러 반드시 처리\n\n" +
        "**핵심:** 에러는 무시하지 않고, 타입을 구분해 상황에 맞게 처리하거나 상위로 전파합니다.\n\n" +
        "**다음 챕터 미리보기:** 가비지 컬렉션을 배우며 자바스크립트 엔진이 메모리를 자동으로 관리하는 방법을 이해합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "Error 내장 타입들(TypeError, ReferenceError 등)을 나열할 수 있다",
    "try/catch/finally의 실행 순서를 정확히 설명할 수 있다",
    "커스텀 에러 클래스를 extends Error로 구현할 수 있다",
    "에러 전파(propagation)와 재전파(re-throw)를 설명할 수 있다",
    "async/await에서 에러를 올바르게 처리할 수 있다",
    "전역 에러 핸들러(unhandledrejection)를 설정할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "finally 블록이 실행되지 않는 경우는?",
      choices: [
        "try에서 에러가 발생했을 때",
        "catch에서 return을 했을 때",
        "process.exit()나 무한 루프처럼 프로세스 자체가 종료될 때",
        "throw가 없을 때",
      ],
      correctIndex: 2,
      explanation: "finally는 try, catch에서 return이나 throw를 해도 항상 실행됩니다. 단, process.exit(), 무한 루프, 시스템 크래시처럼 JavaScript 엔진 자체가 종료되는 경우에는 실행되지 않습니다.",
    },
    {
      id: "q2",
      question: "try/catch로 잡을 수 없는 에러는?",
      choices: [
        "throw new Error()로 던진 에러",
        "setTimeout 콜백 내부에서 발생한 에러",
        "JSON.parse() 실패",
        "null.property 접근",
      ],
      correctIndex: 1,
      explanation: "setTimeout의 콜백은 별도의 콜 스택에서 실행됩니다. try/catch는 같은 콜 스택 내에서만 에러를 잡을 수 있어, 타이머/이벤트 리스너 콜백의 에러는 콜백 내부에서 직접 처리해야 합니다.",
    },
    {
      id: "q3",
      question: "커스텀 Error 클래스에서 super(message)를 호출해야 하는 이유는?",
      choices: [
        "부모 클래스의 생성자를 호출해 message, stack 등 Error 프로퍼티를 초기화하기 위해",
        "단순히 JavaScript 문법 규칙이기 때문에",
        "instanceof 연산자가 동작하게 하기 위해",
        "this 키워드를 사용할 수 있게 하기 위해",
      ],
      correctIndex: 0,
      explanation: "extends를 사용한 클래스에서 super()는 부모 생성자를 호출합니다. Error의 경우 message 프로퍼티 설정, stack trace 생성 등 핵심 초기화를 수행합니다. super() 없이는 this를 사용할 수 없습니다.",
    },
    {
      id: "q4",
      question: "catch 블록에서 처리할 수 없는 에러는 어떻게 해야 하는가?",
      choices: [
        "무시하고 계속 진행한다",
        "console.error로만 출력한다",
        "throw e로 재전파한다",
        "null을 반환한다",
      ],
      correctIndex: 2,
      explanation: "catch한 에러 중 처리 방법을 모르는 에러는 반드시 throw e로 재전파해야 합니다. 에러를 묻어두면(무시하면) 상위 레벨에서 적절히 처리할 기회를 빼앗고 버그 추적이 매우 어려워집니다.",
    },
    {
      id: "q5",
      question: "처리되지 않은 Promise 거부를 전역에서 감지하는 방법은?",
      choices: [
        "window.onerror 이벤트",
        "process.on('uncaughtException')",
        "window.addEventListener('unhandledrejection', handler)",
        "Promise.onReject 설정",
      ],
      correctIndex: 2,
      explanation: "브라우저에서는 unhandledrejection 이벤트로 처리되지 않은 Promise 거부를 감지합니다. Node.js에서는 process.on('unhandledRejection')을 사용합니다. window.onerror는 동기 에러를 잡습니다.",
    },
    {
      id: "q6",
      question: "Error 객체의 기본 프로퍼티가 아닌 것은?",
      choices: ["message", "stack", "name", "code"],
      correctIndex: 3,
      explanation: "Error 객체의 표준 프로퍼티는 message(에러 메시지), name(에러 타입명), stack(스택 트레이스)입니다. code는 표준이 아니며 커스텀 에러나 Node.js의 SystemError에서 추가되는 프로퍼티입니다.",
    },
    {
      id: "q7",
      question: "async 함수 내의 try/catch가 비동기 에러를 잡을 수 있는 이유는?",
      choices: [
        "Promise를 동기 코드로 변환하기 때문",
        "await가 Promise의 거부를 동기 throw처럼 변환하기 때문",
        "async 함수는 별도의 에러 처리 메커니즘을 사용하기 때문",
        "try/catch의 범위가 비동기 코드까지 확장되기 때문",
      ],
      correctIndex: 1,
      explanation: "await는 Promise가 거부(reject)되면 그 에러를 동기 throw처럼 변환합니다. 따라서 await를 포함한 코드를 try 블록 안에 두면 비동기 에러를 catch로 잡을 수 있습니다.",
    },
  ],
};

export default chapter;
