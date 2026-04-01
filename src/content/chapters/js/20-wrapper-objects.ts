import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "20-wrapper-objects",
  subject: "js",
  title: "래퍼 객체",
  description: "원시값에 메서드를 호출할 수 있는 이유, String/Number/Boolean 래퍼 객체의 생성과 파괴 과정을 이해합니다.",
  order: 20,
  group: "빌트인과 표준 객체",
  prerequisites: ["19-built-in-objects"],
  estimatedMinutes: 15,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "래퍼 객체는 마치 **1회용 장갑**과 같습니다.\n\n" +
        "맨손(원시값)으로는 뜨거운 물건을 잡기 어렵습니다. 그래서 물건을 잡을 때만 장갑(래퍼 객체)을 끼우고, 일이 끝나면 장갑을 버립니다.\n\n" +
        "`'hello'.toUpperCase()`를 호출하는 순간, 자바스크립트 엔진은:\n" +
        "1. `'hello'`를 임시 `String` 객체로 감쌉니다 (장갑 착용)\n" +
        "2. `String` 객체의 `toUpperCase()` 메서드를 호출합니다 (작업 수행)\n" +
        "3. 임시 객체를 즉시 버립니다 (장갑 제거)\n\n" +
        "이 과정이 너무 빠르게 일어나기 때문에 우리 눈에는 원시값이 직접 메서드를 가진 것처럼 보입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "자바스크립트의 원시 타입(`string`, `number`, `boolean`)은 객체가 아닙니다. 객체가 아니므로 프로퍼티나 메서드를 가질 수 없어야 합니다.\n\n" +
        "그런데 왜 아래 코드는 정상 동작할까요?\n\n" +
        "```javascript\n" +
        "const name = 'alice';       // 원시값\n" +
        "console.log(name.length);   // 5 — 어떻게?\n" +
        "console.log(name.toUpperCase()); // 'ALICE' — 어떻게?\n" +
        "```\n\n" +
        "또 다른 의문: `new String('hello')`로 만든 것과 `'hello'`는 같은 값인데, 왜 `===` 비교에서 `false`가 나올까요?\n\n" +
        "이 현상의 핵심은 **래퍼 객체(Wrapper Object)**에 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 래퍼 객체의 자동 생성과 파괴\n" +
        "원시값에 프로퍼티/메서드 접근이 발생하면, JS 엔진은 다음 과정을 수행합니다:\n\n" +
        "1. **박싱(Boxing)**: 원시값을 해당하는 래퍼 생성자(`String`, `Number`, `Boolean`)로 임시 객체를 생성합니다.\n" +
        "2. **메서드 실행**: 임시 객체의 프로토타입 체인에서 메서드를 찾아 실행합니다.\n" +
        "3. **언박싱(Unboxing)**: 임시 객체를 즉시 버립니다.\n\n" +
        "### 원시값 vs 래퍼 객체\n" +
        "| 구분 | 원시값 | 래퍼 객체 |\n" +
        "|------|--------|----------|\n" +
        "| 생성 | `'hello'` | `new String('hello')` |\n" +
        "| typeof | `'string'` | `'object'` |\n" +
        "| 비교(`===`) | 값으로 비교 | 참조로 비교 |\n" +
        "| 메서드 | 임시 래퍼 통해 | 직접 접근 |\n\n" +
        "### new를 사용하지 말아야 하는 이유\n" +
        "`new String()`, `new Number()`, `new Boolean()`을 직접 사용하는 것은 혼란을 초래합니다.\n" +
        "`new Boolean(false)`는 객체이므로 truthy입니다! 이는 심각한 버그의 원인이 됩니다.\n\n" +
        "### Symbol과 BigInt\n" +
        "`Symbol`과 `BigInt`는 래퍼 객체가 있지만, `new`로 생성하면 TypeError가 발생합니다. 리터럴로만 사용해야 합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 래퍼 객체 생성 과정",
      content:
        "JS 엔진이 원시값에 메서드를 호출할 때 내부적으로 수행하는 과정을 의사코드로 표현합니다.",
      code: {
        language: "javascript",
        code:
          "// 소스 코드:\n" +
          "const str = 'hello';\n" +
          "const upper = str.toUpperCase();\n\n" +
          "// JS 엔진 내부 동작:\n" +
          "// 1. 원시값에 프로퍼티 접근 감지\n" +
          "// 2. 임시 String 래퍼 객체 생성\n" +
          "const __temp = new String('hello');\n" +
          "// 3. 메서드 실행\n" +
          "const upper = __temp.toUpperCase();\n" +
          "// 4. 임시 객체 즉시 폐기\n" +
          "__temp = null; // GC에 의해 수거됨\n\n" +
          "// 이 과정 때문에 원시값에 프로퍼티를 추가할 수 없음\n" +
          "const num = 42;\n" +
          "num.custom = 'test'; // 임시 객체에 추가되고 즉시 버려짐\n" +
          "console.log(num.custom); // undefined\n\n" +
          "// new Boolean의 함정\n" +
          "const falsePrimitive = false;\n" +
          "const falseObject = new Boolean(false);\n\n" +
          "if (falsePrimitive) { /* 실행 안됨 */ }\n" +
          "if (falseObject)    { /* 실행됨! 객체는 항상 truthy */ }",
        description:
          "원시값에 프로퍼티를 추가하려 해도 임시 래퍼 객체가 즉시 버려지기 때문에 유지되지 않습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 래퍼 객체 동작 확인",
      content:
        "래퍼 객체의 특성을 직접 확인하고, 안전한 사용 패턴을 익힙니다.",
      code: {
        language: "javascript",
        code:
          "// 1. typeof 차이\n" +
          "console.log(typeof 'hello');           // 'string'\n" +
          "console.log(typeof new String('hello')); // 'object'\n\n" +
          "// 2. 동등 비교 차이\n" +
          "console.log('hello' == new String('hello'));  // true  (형변환 발생)\n" +
          "console.log('hello' === new String('hello')); // false (타입이 다름)\n\n" +
          "// 3. new Boolean의 함정\n" +
          "const falseObj = new Boolean(false);\n" +
          "console.log(falseObj == false);   // true\n" +
          "console.log(Boolean(falseObj));   // true (객체는 truthy)\n" +
          "if (falseObj) console.log('이게 실행됩니다!'); // 실행됨!\n\n" +
          "// 4. 안전한 형변환 (new 없이 생성자 함수로 사용)\n" +
          "console.log(String(42));    // '42' — 안전\n" +
          "console.log(Number('42')); // 42  — 안전\n" +
          "console.log(Boolean(0));   // false — 안전\n\n" +
          "// 5. Symbol은 new 불가\n" +
          "const sym = Symbol('id');         // OK\n" +
          "// const symObj = new Symbol('id'); // TypeError!\n" +
          "console.log(typeof sym);           // 'symbol'",
        description:
          "래퍼 객체를 new로 생성하지 말고, 형변환이 필요할 때는 new 없이 생성자 함수를 호출하세요.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "- 원시값에 프로퍼티/메서드 접근 시 JS 엔진은 **임시 래퍼 객체**를 자동 생성하고 즉시 파괴합니다.\n" +
        "- 이를 **오토박싱(Auto-boxing)** 이라고 합니다.\n" +
        "- `new String()`, `new Number()`, `new Boolean()`으로 직접 래퍼 객체를 생성하는 것은 피해야 합니다.\n" +
        "- 특히 `new Boolean(false)`는 truthy 객체를 만들어 심각한 버그를 유발합니다.\n" +
        "- 형변환이 필요할 때는 `new` 없이 `String()`, `Number()`, `Boolean()`을 사용하세요.\n\n" +
        "**다음 챕터 미리보기:** 배열과 고차 함수(forEach, map, filter, reduce)를 깊이 탐구합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "원시값에 메서드를 호출할 수 있는 이유(오토박싱)를 설명할 수 있다",
    "래퍼 객체가 생성되고 파괴되는 과정을 설명할 수 있다",
    "원시값과 래퍼 객체의 typeof 차이를 안다",
    "new Boolean(false)가 truthy인 이유를 설명할 수 있다",
    "형변환 시 new를 쓰지 않는 이유를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "'hello'.toUpperCase()가 동작하는 이유는?",
      choices: [
        "문자열 원시값이 메서드를 직접 가지고 있어서",
        "JS 엔진이 임시 String 래퍼 객체를 자동으로 생성하기 때문",
        "String.prototype이 원시값에 자동으로 주입되기 때문",
        "typeof 'hello'가 'object'이기 때문",
      ],
      correctIndex: 1,
      explanation:
        "JS 엔진은 원시값에 프로퍼티/메서드 접근 시 해당 타입의 래퍼 객체를 임시로 생성합니다. 메서드 실행 후 임시 객체는 즉시 버려집니다. 이를 오토박싱이라 합니다.",
    },
    {
      id: "q2",
      question: "typeof new String('hello')의 결과는?",
      choices: ["'string'", "'object'", "'String'", "undefined"],
      correctIndex: 1,
      explanation:
        "new String()으로 생성하면 원시값이 아닌 String 래퍼 객체가 만들어집니다. typeof는 객체이므로 'object'를 반환합니다. 원시 문자열 리터럴의 typeof는 'string'입니다.",
    },
    {
      id: "q3",
      question:
        "const b = new Boolean(false); if (b) console.log('실행');의 결과는?",
      choices: [
        "'실행' 출력 안됨",
        "'실행' 출력됨",
        "TypeError 발생",
        "SyntaxError 발생",
      ],
      correctIndex: 1,
      explanation:
        "new Boolean(false)는 Boolean 래퍼 객체를 생성합니다. 객체는 항상 truthy하므로 if 조건이 참이 됩니다. 이것이 new Boolean()을 절대 사용하면 안 되는 이유입니다.",
    },
    {
      id: "q4",
      question:
        "원시값에 프로퍼티를 직접 추가하면 (예: let n = 42; n.x = 1;) 어떻게 되는가?",
      choices: [
        "정상 저장되어 n.x로 접근 가능",
        "TypeError 발생",
        "임시 래퍼 객체에 저장 후 즉시 버려져 undefined",
        "NaN으로 변환됨",
      ],
      correctIndex: 2,
      explanation:
        "원시값에 프로퍼티를 추가하면 JS 엔진이 임시 래퍼 객체를 생성해 그 객체에 프로퍼티를 추가합니다. 하지만 임시 객체는 즉시 파괴되므로 나중에 접근하면 undefined가 됩니다. strict mode에서는 TypeError가 발생합니다.",
    },
    {
      id: "q5",
      question: "안전한 문자열 형변환 방법으로 올바른 것은?",
      choices: [
        "new String(42)",
        "String(42)",
        "(42).toString()만 사용해야 함",
        "typeof를 통해 변환",
      ],
      correctIndex: 1,
      explanation:
        "new 없이 String(), Number(), Boolean()을 호출하면 래퍼 객체가 아닌 원시값을 반환합니다. new String(42)는 객체를 반환하므로 === 비교 시 문제가 생깁니다.",
    },
  ],
};

export default chapter;
