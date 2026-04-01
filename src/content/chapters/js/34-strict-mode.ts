import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "34-strict-mode",
  subject: "js",
  title: "strict mode",
  description: "'use strict' 지시어의 동작, 암묵적 전역 방지, 매개변수 중복 금지 등 strict mode가 차단하는 위험한 동작들을 깊이 이해합니다.",
  order: 34,
  group: "모듈과 환경",
  prerequisites: ["33-module-system"],
  estimatedMinutes: 15,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "strict mode는 '엄격한 코드 검사관'과 같습니다.\n\n" +
        "일반 자바스크립트는 관대한 통역사와 같습니다. 문법이 조금 이상해도 '아마 이런 뜻이겠지'하며 알아서 처리해줍니다. 덕분에 코드를 빨리 작성할 수 있지만, 의도치 않은 버그가 조용히 숨어들기 쉽습니다.\n\n" +
        "**strict mode**는 무관용의 검사관입니다. '이건 분명히 실수일 거야'라고 생각되는 코드를 에러로 처리합니다. 조금 불편하지만, 버그를 작성 시점에 발견할 수 있습니다.\n\n" +
        "마치 타입스크립트의 `strict: true` 옵션처럼, '나는 실수를 조기에 발견하고 싶다'는 개발자의 의사 표명입니다. 현대 자바스크립트 코드(모듈, 클래스)는 항상 strict mode로 동작합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "자바스크립트의 관대한 설계가 낳은 '조용한 버그들'의 예시입니다.\n\n" +
        "```js\n" +
        "// 1. 오타가 새 전역 변수를 만든다\n" +
        "function saveUser() {\n" +
        "  usrName = 'Alice'; // 'userName'을 오타냄 → 전역 변수 생성!\n" +
        "}\n" +
        "saveUser();\n" +
        "console.log(window.usrName); // 'Alice' — 전역 오염!\n" +
        "\n" +
        "// 2. 읽기 전용 프로퍼티에 할당해도 조용히 무시\n" +
        "const obj = {};\n" +
        "Object.defineProperty(obj, 'locked', { value: 42, writable: false });\n" +
        "obj.locked = 100; // 조용히 실패 (에러 없음!)\n" +
        "console.log(obj.locked); // 42 — 왜 안 바뀌었지?\n" +
        "\n" +
        "// 3. 매개변수 중복\n" +
        "function add(a, a, b) { // 마지막 a가 앞의 a를 덮음\n" +
        "  return a + b; // 의도와 다른 동작\n" +
        "}\n" +
        "```\n\n" +
        "이런 '조용한 실패(Silent Failure)'는 버그를 찾기 매우 어렵게 만듭니다. strict mode는 이러한 상황에서 에러를 발생시켜 즉시 인지할 수 있게 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 'use strict' 활성화\n\n" +
        "파일 또는 함수의 최상단에 문자열 `'use strict'`를 작성합니다.\n\n" +
        "```js\n" +
        "'use strict'; // 파일 전체에 적용\n" +
        "\n" +
        "function strict() {\n" +
        "  'use strict'; // 이 함수 내부에만 적용\n" +
        "}\n" +
        "```\n\n" +
        "### strict mode가 차단하는 것들\n\n" +
        "**1. 암묵적 전역 변수 생성 금지**\n" +
        "```js\n" +
        "'use strict';\n" +
        "undeclaredVar = 1; // ReferenceError!\n" +
        "```\n\n" +
        "**2. 읽기 전용 프로퍼티 쓰기 → 에러**\n" +
        "```js\n" +
        "'use strict';\n" +
        "const obj = Object.freeze({ x: 1 });\n" +
        "obj.x = 2; // TypeError!\n" +
        "```\n\n" +
        "**3. 매개변수 이름 중복 금지**\n" +
        "```js\n" +
        "'use strict';\n" +
        "function f(a, a) {} // SyntaxError!\n" +
        "```\n\n" +
        "**4. with 문 사용 금지**\n" +
        "```js\n" +
        "'use strict';\n" +
        "with (obj) {} // SyntaxError! (스코프 예측 불가하게 만드는 구문)\n" +
        "```\n\n" +
        "**5. this 바인딩 변경**\n" +
        "```js\n" +
        "function fn() {\n" +
        "  console.log(this); // 비엄격: window / 엄격: undefined\n" +
        "}\n" +
        "fn();\n" +
        "```\n\n" +
        "**6. delete로 변수/함수 삭제 불가**\n" +
        "```js\n" +
        "'use strict';\n" +
        "let x = 1;\n" +
        "delete x; // SyntaxError!\n" +
        "```\n\n" +
        "### 모듈과 클래스는 항상 strict mode\n\n" +
        "ESM(`type=\"module\"`)과 클래스 본문은 자동으로 strict mode입니다. `'use strict'`를 명시하지 않아도 됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: strict mode의 this 바인딩 변화",
      content:
        "strict mode가 this 바인딩에 어떤 영향을 미치는지 구체적으로 살펴봅니다.",
      code: {
        language: "javascript",
        code:
          "// === this 바인딩 비교 ===\n" +
          "\n" +
          "// 비 strict mode\n" +
          "function showThis() {\n" +
          "  console.log(this); // window (브라우저) / global (Node.js)\n" +
          "}\n" +
          "showThis();\n" +
          "\n" +
          "// strict mode\n" +
          "'use strict';\n" +
          "function showThisStrict() {\n" +
          "  console.log(this); // undefined\n" +
          "}\n" +
          "showThisStrict();\n" +
          "\n" +
          "// call/apply/bind의 this 변환도 차이남\n" +
          "function nonStrict() { console.log(this); }\n" +
          "// 비strict: null/undefined → window로 변환됨\n" +
          "nonStrict.call(null);    // window\n" +
          "nonStrict.call(1);       // Number 객체 (래핑)\n" +
          "\n" +
          "function strictFn() {\n" +
          "  'use strict';\n" +
          "  console.log(this);\n" +
          "}\n" +
          "// strict: 그대로 전달됨 (변환 없음)\n" +
          "strictFn.call(null);     // null\n" +
          "strictFn.call(1);        // 1 (래핑 없음)\n" +
          "\n" +
          "// === 암묵적 전역 방지 ===\n" +
          "function withStrict() {\n" +
          "  'use strict';\n" +
          "  try {\n" +
          "    typoVariable = 42; // ReferenceError!\n" +
          "  } catch (e) {\n" +
          "    console.log('에러 잡힘:', e.message); // ReferenceError: typoVariable is not defined\n" +
          "  }\n" +
          "}",
        description: "strict mode에서 일반 함수 호출 시 this는 undefined가 됩니다. call/apply로 원시값을 전달해도 객체로 래핑되지 않습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: strict mode 전/후 비교",
      content:
        "같은 코드가 strict mode 유무에 따라 어떻게 다르게 동작하는지 직접 확인합니다.",
      code: {
        language: "javascript",
        code:
          "// ❌ 비 strict mode의 조용한 버그들\n" +
          "function nonStrictDemo() {\n" +
          "  // 1. 오타 → 전역 변수 생성\n" +
          "  conut = 0;  // count 오타! 에러 없이 전역 변수 생성\n" +
          "  conut++;    // 여전히 에러 없음\n" +
          "  console.log(typeof window.conut); // 'number' — 전역 오염!\n" +
          "\n" +
          "  // 2. Object.freeze 위반 — 조용히 무시\n" +
          "  const config = Object.freeze({ debug: false });\n" +
          "  config.debug = true;  // 조용히 무시됨!\n" +
          "  console.log(config.debug); // false — 왜 안 바뀌었지?\n" +
          "}\n" +
          "\n" +
          "// ✅ strict mode — 즉시 에러로 발견\n" +
          "function strictDemo() {\n" +
          "  'use strict';\n" +
          "\n" +
          "  // 1. 미선언 변수 → ReferenceError\n" +
          "  try {\n" +
          "    conut = 0; // ReferenceError: conut is not defined\n" +
          "  } catch (e) {\n" +
          "    console.log('전역 오염 차단!', e.constructor.name);\n" +
          "  }\n" +
          "\n" +
          "  // 2. Object.freeze 위반 → TypeError\n" +
          "  const config = Object.freeze({ debug: false });\n" +
          "  try {\n" +
          "    config.debug = true; // TypeError!\n" +
          "  } catch (e) {\n" +
          "    console.log('읽기 전용 에러 감지!', e.constructor.name);\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// strictDemo();\n" +
          "// → '전역 오염 차단! ReferenceError'\n" +
          "// → '읽기 전용 에러 감지! TypeError'",
        description: "strict mode는 버그를 작성 시점 또는 실행 시점에 즉시 발견하게 해줍니다. 조용한 실패를 명시적 에러로 전환합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| strict mode 차단 항목 | 비strict 동작 | strict 동작 |\n" +
        "|----------------------|---------------|-------------|\n" +
        "| 미선언 변수 할당 | 전역 변수 생성 | ReferenceError |\n" +
        "| 읽기 전용 프로퍼티 쓰기 | 조용히 무시 | TypeError |\n" +
        "| 매개변수 이름 중복 | 마지막 값 사용 | SyntaxError |\n" +
        "| with 문 | 동작함 | SyntaxError |\n" +
        "| 일반 함수 this | window/global | undefined |\n" +
        "| delete 변수 | 조용히 무시 | SyntaxError |\n\n" +
        "**자동 strict mode 환경:**\n" +
        "- ESM (`type=\"module\"` 또는 `.mjs`)\n" +
        "- 클래스 본문 (`class` 키워드)\n\n" +
        "**핵심:** 현대 자바스크립트 개발에서는 strict mode가 기본입니다. 모듈과 클래스가 이를 자동으로 활성화하므로 대부분의 경우 별도로 명시할 필요가 없습니다.\n\n" +
        "**다음 챕터 미리보기:** 에러 처리(try/catch/finally)를 배우며 strict mode가 발생시키는 에러를 올바르게 다루는 방법을 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "'use strict'를 적용하는 방법(파일/함수 단위)을 안다",
    "암묵적 전역 변수 생성이 왜 문제이고 strict mode가 이를 어떻게 차단하는지 설명할 수 있다",
    "strict mode에서 일반 함수의 this가 undefined가 되는 이유를 설명할 수 있다",
    "ESM과 클래스에서 strict mode가 자동 적용됨을 안다",
    "with 문이 금지되는 이유를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "strict mode에서 선언하지 않은 변수에 값을 할당하면?",
      choices: ["전역 변수가 생성된다", "undefined가 된다", "ReferenceError가 발생한다", "조용히 무시된다"],
      correctIndex: 2,
      explanation: "strict mode에서 let/const/var로 선언하지 않은 변수에 값을 할당하면 ReferenceError가 발생합니다. 비strict에서는 전역 변수가 조용히 생성됩니다.",
    },
    {
      id: "q2",
      question: "strict mode에서 일반 함수를 독립적으로 호출하면 this는?",
      choices: ["window 객체", "global 객체", "undefined", "null"],
      correctIndex: 2,
      explanation: "strict mode에서 명시적 this 바인딩 없이 일반 함수를 호출하면 this가 undefined입니다. 비strict에서는 전역 객체(window/global)로 자동 변환됩니다.",
    },
    {
      id: "q3",
      question: "'use strict'를 명시하지 않아도 자동으로 strict mode가 적용되는 곳은?",
      choices: [
        "모든 함수",
        "ESM 모듈과 클래스 본문",
        "IIFE(즉시 실행 함수)",
        "화살표 함수",
      ],
      correctIndex: 1,
      explanation: "ESM(type='module' 또는 .mjs)과 클래스 본문은 자동으로 strict mode로 실행됩니다. 화살표 함수나 IIFE는 그 자체로 strict mode를 강제하지 않습니다.",
    },
    {
      id: "q4",
      question: "strict mode에서 Object.freeze()된 객체의 프로퍼티를 수정하면?",
      choices: ["조용히 무시된다", "undefined가 할당된다", "TypeError가 발생한다", "새 프로퍼티가 생성된다"],
      correctIndex: 2,
      explanation: "비strict에서는 freeze된 객체 수정이 조용히 무시됩니다. strict mode에서는 TypeError가 발생합니다. 이것이 strict mode의 핵심 역할 — 조용한 실패를 명시적 에러로 변환합니다.",
    },
    {
      id: "q5",
      question: "strict mode에서 금지되지 않는 것은?",
      choices: [
        "미선언 변수 사용",
        "with 문",
        "매개변수 이름 중복",
        "화살표 함수에서의 arguments 사용",
      ],
      correctIndex: 3,
      explanation: "화살표 함수에서 arguments 객체를 사용하지 못하는 것은 strict mode와 무관하게 화살표 함수의 특성입니다. strict mode는 미선언 변수 사용, with 문, 매개변수 이름 중복 등을 금지합니다.",
    },
  ],
};

export default chapter;
