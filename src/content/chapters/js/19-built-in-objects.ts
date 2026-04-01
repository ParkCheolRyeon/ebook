import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "19-built-in-objects",
  subject: "js",
  title: "빌트인 객체",
  description: "표준 빌트인 객체, 호스트 객체, 전역 객체와 전역 함수의 역할과 동작 원리를 깊이 이해합니다.",
  order: 19,
  group: "빌트인과 표준 객체",
  prerequisites: ["18-class"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "자바스크립트의 빌트인 객체를 **공장에서 기본 제공하는 도구 세트**에 비유할 수 있습니다.\n\n" +
        "**표준 빌트인 객체**는 어느 공장(환경)에서나 항상 포함되는 기본 도구입니다. `Array`, `String`, `Math`, `JSON` 등이 이에 해당합니다. 브라우저든 Node.js든 어디서나 사용할 수 있습니다.\n\n" +
        "**호스트 객체**는 특정 공장(실행 환경)이 추가로 제공하는 전용 도구입니다. 브라우저는 `window`, `document`, `XMLHttpRequest`를 제공하고, Node.js는 `process`, `fs`, `http`를 제공합니다. 환경을 바꾸면 사라집니다.\n\n" +
        "**전역 객체**는 공장 전체를 감싸는 창고입니다. 브라우저에서는 `window`, Node.js에서는 `global`, 모던 환경에서는 `globalThis`라는 이름으로 불립니다. 모든 전역 변수와 함수가 이 창고에 보관됩니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "자바스크립트를 작성하다 보면 '이 함수는 어디서 온 것인가?'라는 의문이 생깁니다.\n\n" +
        "`parseInt('10')`, `isNaN(NaN)`, `eval('1+1')` 같은 함수들은 어디서 온 것일까요? 직접 선언한 적도 없는데 왜 동작할까요?\n\n" +
        "또한 브라우저에서 잘 동작하던 코드가 Node.js에서 `window is not defined` 에러를 발생시키는 이유는 무엇일까요?\n\n" +
        "이 모든 혼란의 근원은 **빌트인 객체 시스템의 세 가지 계층**을 이해하지 못하기 때문입니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "자바스크립트의 빌트인 객체는 세 가지 범주로 구분됩니다.\n\n" +
        "### 1. 표준 빌트인 객체 (Standard Built-in Objects)\n" +
        "ECMAScript 명세에 정의된 객체로, 어떤 JS 환경에서도 사용 가능합니다.\n" +
        "- **값 속성**: `Infinity`, `NaN`, `undefined`\n" +
        "- **함수 속성**: `eval()`, `isNaN()`, `parseInt()`, `parseFloat()`, `encodeURIComponent()`\n" +
        "- **생성자**: `Object`, `Array`, `String`, `Number`, `Boolean`, `Date`, `RegExp`, `Error`, `Promise`, `Map`, `Set`\n" +
        "- **네임스페이스**: `Math`, `JSON`, `Reflect`, `Proxy`\n\n" +
        "### 2. 호스트 객체 (Host Objects)\n" +
        "실행 환경(호스트)이 제공하는 객체입니다.\n" +
        "- **브라우저**: `window`, `document`, `navigator`, `XMLHttpRequest`, `fetch`, `setTimeout`\n" +
        "- **Node.js**: `process`, `Buffer`, `require`, `__dirname`, `module`\n\n" +
        "### 3. 전역 객체와 전역 함수\n" +
        "전역 객체는 모든 전역 변수와 빌트인을 담는 최상위 컨테이너입니다. `globalThis`를 사용하면 환경에 관계없이 접근할 수 있습니다.\n\n" +
        "**주요 전역 함수 특징:**\n" +
        "- `eval(str)`: 문자열을 코드로 평가. 보안 위험 때문에 사용을 피해야 합니다.\n" +
        "- `isNaN(v)` vs `Number.isNaN(v)`: 전역 `isNaN`은 강제 형변환 후 검사, `Number.isNaN`은 타입도 검사합니다.\n" +
        "- `parseInt(str, radix)`: 문자열을 정수로 변환. 진수(radix)를 반드시 명시해야 합니다.\n" +
        "- `parseFloat(str)`: 문자열을 부동소수점으로 변환합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 전역 함수 동작 원리",
      content:
        "전역 함수들의 내부 동작과 자주 발생하는 함정을 의사코드로 살펴봅니다.",
      code: {
        language: "javascript",
        code:
          "// === isNaN vs Number.isNaN ===\n" +
          "isNaN('hello')        // true  — 'hello'를 Number로 변환 → NaN → true\n" +
          "isNaN(undefined)      // true  — undefined를 Number로 변환 → NaN → true\n" +
          "isNaN(null)           // false — null을 Number로 변환 → 0 → false\n\n" +
          "Number.isNaN('hello') // false — 타입이 number가 아님\n" +
          "Number.isNaN(NaN)     // true  — 타입이 number이고 NaN\n\n" +
          "// === parseInt 진수 함정 ===\n" +
          "parseInt('08')        // ES5 이전에는 8진수로 해석할 수 있음 → 항상 radix 명시\n" +
          "parseInt('08', 10)    // 8  — 명시적으로 10진수\n" +
          "parseInt('0xFF', 16)  // 255\n" +
          "parseInt('10', 2)     // 2  — 2진수 '10'\n\n" +
          "// === eval의 위험성 ===\n" +
          "const userInput = 'process.exit(0)'; // 악성 입력\n" +
          "eval(userInput);      // 절대 사용 금지!\n\n" +
          "// === globalThis로 환경 독립적 접근 ===\n" +
          "// 브라우저: globalThis === window\n" +
          "// Node.js:  globalThis === global\n" +
          "globalThis.setTimeout(() => {}, 0); // 어디서나 동작",
        description:
          "isNaN과 Number.isNaN의 핵심 차이는 형변환 여부입니다. parseInt는 반드시 radix를 명시해야 안전합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 빌트인 활용과 환경 감지",
      content:
        "표준 빌트인과 호스트 객체를 구분하고, 환경에 안전한 코드를 작성하는 방법을 실습합니다.",
      code: {
        language: "javascript",
        code:
          "// 1. 표준 빌트인 — 어디서나 동작\n" +
          "console.log(Math.max(1, 2, 3));           // 3\n" +
          "console.log(JSON.stringify({ a: 1 }));    // '{\"a\":1}'\n" +
          "console.log(Array.isArray([1, 2]));       // true\n\n" +
          "// 2. 환경 감지 패턴\n" +
          "const isBrowser = typeof window !== 'undefined';\n" +
          "const isNode = typeof process !== 'undefined' && process.versions?.node;\n\n" +
          "if (isBrowser) {\n" +
          "  console.log('브라우저 환경:', window.location.href);\n" +
          "} else if (isNode) {\n" +
          "  console.log('Node.js 환경:', process.version);\n" +
          "}\n\n" +
          "// 3. Number.isNaN vs isNaN 올바른 사용\n" +
          "function safeIsNaN(value) {\n" +
          "  return Number.isNaN(value); // 타입 안전한 방법\n" +
          "}\n" +
          "console.log(safeIsNaN(NaN));       // true\n" +
          "console.log(safeIsNaN('hello'));   // false (형변환 없음)\n\n" +
          "// 4. parseInt 안전한 사용\n" +
          "function toInt(str, base = 10) {\n" +
          "  const result = parseInt(str, base);\n" +
          "  return Number.isNaN(result) ? 0 : result;\n" +
          "}\n" +
          "console.log(toInt('42'));     // 42\n" +
          "console.log(toInt('abc'));    // 0 (기본값)",
        description:
          "환경에 따라 다른 호스트 객체를 안전하게 감지하고, 표준 빌트인을 올바르게 활용하는 패턴입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 범주 | 정의 주체 | 예시 | 환경 독립성 |\n" +
        "|------|-----------|------|-------------|\n" +
        "| 표준 빌트인 | ECMAScript 명세 | Math, JSON, Array | 모든 환경 |\n" +
        "| 호스트 객체 | 실행 환경 | window, document, process | 환경마다 다름 |\n" +
        "| 전역 객체 | 실행 환경 | window, global, globalThis | globalThis로 통일 |\n\n" +
        "**핵심 주의사항:**\n" +
        "- `isNaN` 대신 `Number.isNaN`을 사용하세요\n" +
        "- `parseInt`는 항상 두 번째 인수(radix)를 명시하세요\n" +
        "- `eval`은 보안 취약점을 유발하므로 절대 사용하지 마세요\n" +
        "- 환경 독립적인 코드를 위해 `globalThis`를 사용하세요\n\n" +
        "**다음 챕터 미리보기:** 원시값에 메서드를 호출할 수 있는 비밀, 래퍼 객체에 대해 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "표준 빌트인 객체와 호스트 객체의 차이를 설명할 수 있다",
    "전역 객체의 역할과 globalThis의 필요성을 설명할 수 있다",
    "isNaN과 Number.isNaN의 차이를 설명할 수 있다",
    "parseInt 사용 시 radix를 명시해야 하는 이유를 안다",
    "eval을 사용하면 안 되는 이유를 설명할 수 있다",
    "브라우저와 Node.js 환경에서 각각 어떤 호스트 객체가 제공되는지 안다",
  ],
  quiz: [
    {
      id: "q1",
      question: "다음 중 ECMAScript 표준 빌트인 객체가 아닌 것은?",
      choices: ["Math", "JSON", "window", "Promise"],
      correctIndex: 2,
      explanation:
        "window는 브라우저 환경이 제공하는 호스트 객체입니다. Math, JSON, Promise는 ECMAScript 명세에 정의된 표준 빌트인 객체로 어떤 환경에서도 사용할 수 있습니다.",
    },
    {
      id: "q2",
      question: "isNaN('hello')와 Number.isNaN('hello')의 결과는?",
      choices: [
        "둘 다 true",
        "둘 다 false",
        "isNaN은 true, Number.isNaN은 false",
        "isNaN은 false, Number.isNaN은 true",
      ],
      correctIndex: 2,
      explanation:
        "전역 isNaN은 인수를 먼저 Number로 변환합니다. 'hello'는 NaN으로 변환되므로 true를 반환합니다. Number.isNaN은 형변환 없이 값의 타입이 number이고 NaN인지 검사하므로 'hello'는 false를 반환합니다.",
    },
    {
      id: "q3",
      question: "parseInt('010', 10)의 결과는?",
      choices: ["8", "10", "NaN", "0"],
      correctIndex: 1,
      explanation:
        "radix를 10으로 명시했으므로 10진수로 해석하여 10을 반환합니다. radix를 명시하지 않으면 구형 환경에서는 8진수로 해석될 수 있으므로 항상 명시해야 합니다.",
    },
    {
      id: "q4",
      question: "모든 JS 실행 환경에서 전역 객체에 접근하는 가장 안전한 방법은?",
      choices: ["window", "global", "self", "globalThis"],
      correctIndex: 3,
      explanation:
        "globalThis는 ES2020에서 도입된 표준으로, 브라우저(window), Node.js(global), Web Worker(self) 등 모든 환경에서 전역 객체에 접근할 수 있는 표준화된 방법입니다.",
    },
    {
      id: "q5",
      question: "eval() 사용을 피해야 하는 가장 큰 이유는?",
      choices: [
        "성능이 느려서",
        "보안 취약점(코드 인젝션)을 유발할 수 있어서",
        "모든 브라우저에서 지원하지 않아서",
        "비동기 코드와 호환되지 않아서",
      ],
      correctIndex: 1,
      explanation:
        "eval은 문자열을 코드로 실행하기 때문에 외부 입력을 그대로 전달하면 악의적인 코드가 실행될 수 있습니다(코드 인젝션). 또한 최적화를 방해하고 성능도 떨어뜨립니다.",
    },
    {
      id: "q6",
      question: "다음 중 Node.js 환경에서만 사용할 수 있는 호스트 객체는?",
      choices: ["Math", "process", "JSON", "Array"],
      correctIndex: 1,
      explanation:
        "process는 Node.js 실행 환경이 제공하는 호스트 객체로, 브라우저에서는 사용할 수 없습니다. Math, JSON, Array는 ECMAScript 표준 빌트인 객체입니다.",
    },
  ],
};

export default chapter;
