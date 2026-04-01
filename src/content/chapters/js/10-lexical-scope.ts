import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "10-lexical-scope",
  subject: "js",
  title: "렉시컬 스코프",
  description: "정적 스코프(렉시컬 스코프)와 동적 스코프의 차이, 렉시컬 환경의 구조, 스코프가 결정되는 시점을 깊이 이해합니다.",
  order: 10,
  group: "스코프와 실행 컨텍스트",
  prerequisites: ["09-scope"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "렉시컬 스코프를 이해하려면 '출생지 원칙'을 생각해보세요.\n\n" +
        "어떤 사람이 서울에서 태어났다면, 그 사람이 나중에 부산으로 이사를 가더라도 '출신지'는 여전히 서울입니다. 출신지는 태어난 곳(코드가 작성된 위치)에 의해 결정되고, 나중에 어디로 이동하든 바뀌지 않습니다.\n\n" +
        "**렉시컬 스코프**는 이와 같습니다. 함수가 어디서 **정의(작성)**되었는가에 따라 스코프가 결정됩니다. 함수가 나중에 어디서 **호출**되는지는 스코프에 영향을 주지 않습니다.\n\n" +
        "반대로 **동적 스코프**는 '현재 거주지 원칙'입니다. 지금 어디 살고 있느냐가 중요합니다. 함수가 호출되는 시점의 환경을 기준으로 스코프가 결정됩니다.\n\n" +
        "자바스크립트는 렉시컬 스코프를 사용합니다. 코드를 작성하는 시점에 스코프 구조가 이미 결정됩니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "함수가 다른 곳에서 호출될 때, 어떤 변수를 참조해야 할지 어떻게 결정할까요?\n\n" +
        "```js\n" +
        "const name = '전역';\n" +
        "\n" +
        "function greet() {\n" +
        "  console.log(name); // 어떤 name?\n" +
        "}\n" +
        "\n" +
        "function main() {\n" +
        "  const name = '지역';\n" +
        "  greet(); // 여기서 호출\n" +
        "}\n" +
        "\n" +
        "main(); // '전역'? '지역'?\n" +
        "```\n\n" +
        "`greet`가 `main` 안에서 호출될 때, `name`은 `main`의 `'지역'`을 참조할까요, 아니면 전역의 `'전역'`을 참조할까요?\n\n" +
        "이 질문에 대한 답이 '정적 스코프(렉시컬 스코프) vs 동적 스코프'의 핵심입니다. 두 방식은 근본적으로 다른 결과를 냅니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "자바스크립트는 **렉시컬 스코프(Lexical Scope)** = **정적 스코프(Static Scope)**를 사용합니다.\n\n" +
        "### 렉시컬 스코프의 핵심 규칙\n" +
        "함수의 스코프는 **함수가 정의된 위치**에 의해 결정됩니다. 함수가 호출되는 위치는 스코프에 영향을 주지 않습니다.\n\n" +
        "앞의 예시에서 `greet` 함수는 전역에서 정의되었으므로, `name`을 찾을 때 전역 스코프를 참조합니다. `main` 안에서 호출되더라도 `main`의 `name`은 참조하지 않습니다. 결과는 `'전역'`입니다.\n\n" +
        "### 렉시컬 환경 (Lexical Environment)\n" +
        "렉시컬 환경은 변수와 그 값의 매핑을 저장하는 내부 자료구조입니다. 두 가지 구성요소가 있습니다:\n" +
        "- **환경 레코드 (Environment Record):** 현재 스코프에서 선언된 변수들의 목록\n" +
        "- **외부 렉시컬 환경 참조 (Outer Lexical Environment Reference):** 바깥 스코프의 렉시컬 환경을 가리키는 포인터\n\n" +
        "### 외부 렉시컬 환경 참조 결정 시점\n" +
        "외부 렉시컬 환경 참조는 함수가 **생성(정의)될 때** 결정됩니다. 이것이 렉시컬 스코프의 핵심 메커니즘입니다. 함수 객체는 자신이 생성될 때의 렉시컬 환경에 대한 참조를 내부 슬롯 `[[Environment]]`에 저장합니다.\n\n" +
        "### 동적 스코프와의 차이\n" +
        "동적 스코프(일부 언어에서 사용)에서는 함수가 호출될 때의 콜 스택을 기준으로 변수를 탐색합니다. 자바스크립트는 렉시컬 스코프를 사용하므로 코드를 읽는 것만으로도 어떤 변수가 참조될지 예측할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 렉시컬 환경의 구조",
      content:
        "함수가 생성될 때 외부 렉시컬 환경 참조가 어떻게 결정되는지 의사코드로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// 렉시컬 환경의 내부 구조 (의사코드)\n' +
          '\n' +
          'interface LexicalEnvironment {\n' +
          '  environmentRecord: Map<string, unknown>; // 변수 목록\n' +
          '  outer: LexicalEnvironment | null;        // 외부 환경 참조\n' +
          '}\n' +
          '\n' +
          '// 전역 렉시컬 환경\n' +
          'const globalEnv: LexicalEnvironment = {\n' +
          '  environmentRecord: new Map([["x", 10], ["foo", Function]]),\n' +
          '  outer: null, // 전역이므로 바깥 없음\n' +
          '};\n' +
          '\n' +
          '// foo 함수 생성 시점 — 전역에서 정의됨\n' +
          '// foo의 [[Environment]] 슬롯에 globalEnv가 저장됨\n' +
          'function foo() {\n' +
          '  // foo의 렉시컬 환경:\n' +
          '  // environmentRecord: { y: 20 }\n' +
          '  // outer: globalEnv  ← foo가 정의된 곳의 환경\n' +
          '  const y = 20;\n' +
          '\n' +
          '  function bar() {\n' +
          '    // bar의 렉시컬 환경:\n' +
          '    // environmentRecord: { z: 30 }\n' +
          '    // outer: foo의 렉시컬 환경  ← bar가 정의된 곳의 환경\n' +
          '    const z = 30;\n' +
          '    console.log(x); // globalEnv에서 찾음 → 10\n' +
          '    console.log(y); // foo의 환경에서 찾음 → 20\n' +
          '    console.log(z); // 현재 환경에서 찾음 → 30\n' +
          '  }\n' +
          '\n' +
          '  bar();\n' +
          '}\n' +
          '\n' +
          'const x = 10;\n' +
          'foo();\n' +
          '\n' +
          '// 렉시컬 스코프 증명: 호출 위치는 스코프에 영향 없음\n' +
          'const val = "전역";\n' +
          '\n' +
          'function getVal() {\n' +
          '  // 정의 위치: 전역 → outer = globalEnv\n' +
          '  return val; // 전역 val 참조\n' +
          '}\n' +
          '\n' +
          'function callInDifferentScope() {\n' +
          '  const val = "지역";\n' +
          '  return getVal(); // 호출 위치는 중요하지 않음\n' +
          '}\n' +
          '\n' +
          'console.log(callInDifferentScope()); // "전역" (렉시컬 스코프)',
        description: "외부 렉시컬 환경 참조는 함수 정의 시점에 결정됩니다. 함수 객체는 [[Environment]] 슬롯에 자신이 생성된 환경을 저장합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 렉시컬 스코프 확인",
      content:
        "렉시컬 스코프가 실제로 어떻게 동작하는지, 다양한 패턴으로 확인합니다.",
      code: {
        language: "javascript",
        code:
          '// ===== 렉시컬 스코프 기본 확인 =====\n' +
          'const env = "전역 환경";\n' +
          '\n' +
          'function makeGreeter() {\n' +
          '  const env = "makeGreeter 환경";\n' +
          '\n' +
          '  // greet는 makeGreeter 안에서 정의됨\n' +
          '  // 따라서 외부 환경 참조 = makeGreeter의 렉시컬 환경\n' +
          '  function greet() {\n' +
          '    console.log(env); // "makeGreeter 환경"\n' +
          '  }\n' +
          '\n' +
          '  return greet;\n' +
          '}\n' +
          '\n' +
          'const greet = makeGreeter();\n' +
          '\n' +
          '// greet는 전역에서 호출되지만, 여전히 makeGreeter 환경을 참조\n' +
          'greet(); // "makeGreeter 환경" — 렉시컬 스코프!\n' +
          '\n' +
          '// ===== 중첩 함수의 렉시컬 환경 체인 =====\n' +
          'function level1() {\n' +
          '  const data = "level1 데이터";\n' +
          '\n' +
          '  function level2() {\n' +
          '    function level3() {\n' +
          '      // level3의 외부 환경 참조 체인:\n' +
          '      // level3 → level2 → level1 → 전역\n' +
          '      console.log(data); // "level1 데이터"\n' +
          '    }\n' +
          '    level3();\n' +
          '  }\n' +
          '  level2();\n' +
          '}\n' +
          '\n' +
          'level1();\n' +
          '\n' +
          '// ===== 함수를 나중에 다른 곳에서 호출해도 =====\n' +
          'function createCounter(start) {\n' +
          '  let count = start; // createCounter의 렉시컬 환경에 count 저장\n' +
          '\n' +
          '  return {\n' +
          '    increment() { count++; },    // 정의 위치: createCounter 안\n' +
          '    decrement() { count--; },    // → outer = createCounter 환경\n' +
          '    value() { return count; },   // → 모두 같은 count 참조\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          'const counter = createCounter(10);\n' +
          'counter.increment(); // count = 11\n' +
          'counter.increment(); // count = 12\n' +
          'counter.decrement(); // count = 11\n' +
          'console.log(counter.value()); // 11',
        description: "렉시컬 스코프 덕분에 함수가 어디서 호출되든 정의된 위치의 변수를 참조합니다. 이것이 클로저의 토대입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 구분 | 렉시컬 스코프 | 동적 스코프 |\n" +
        "|------|-------------|----------|\n" +
        "| 스코프 결정 기준 | 함수 **정의** 위치 | 함수 **호출** 위치(콜 스택) |\n" +
        "| 결정 시점 | 코드 작성(파싱) 시점 | 런타임 시점 |\n" +
        "| 예측 가능성 | 높음 | 낮음 |\n" +
        "| 자바스크립트 채택 여부 | O | X |\n\n" +
        "**렉시컬 환경 구조:**\n" +
        "- 환경 레코드: 현재 스코프의 변수 목록\n" +
        "- 외부 렉시컬 환경 참조: 함수 생성 시점에 결정, 바깥 스코프를 가리킴\n\n" +
        "**핵심 이해:** 렉시컬 스코프는 클로저의 토대입니다. 함수 객체는 자신이 생성된 환경을 `[[Environment]]`에 저장하고, 이것이 클로저를 가능하게 합니다.\n\n" +
        "**다음 챕터 미리보기:** 실행 컨텍스트는 렉시컬 환경이 실제로 어떻게 생성되고 관리되는지를 설명합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "렉시컬 스코프(정적 스코프)가 함수 정의 위치에 의해 결정됨을 설명할 수 있다",
    "동적 스코프와 렉시컬 스코프의 차이를 예시로 설명할 수 있다",
    "렉시컬 환경의 두 구성요소(환경 레코드, 외부 렉시컬 환경 참조)를 설명할 수 있다",
    "외부 렉시컬 환경 참조가 함수 생성 시점에 결정됨을 이해한다",
    "코드를 보고 어떤 변수가 참조될지 렉시컬 스코프 규칙으로 예측할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "자바스크립트에서 스코프는 언제 결정되는가?",
      choices: [
        "함수가 호출될 때",
        "함수가 정의(작성)될 때",
        "변수에 값이 할당될 때",
        "프로그램이 실행될 때마다 동적으로 결정",
      ],
      correctIndex: 1,
      explanation: "자바스크립트는 렉시컬 스코프(정적 스코프)를 사용합니다. 스코프는 함수가 코드 상에서 정의된 위치에 의해 결정되며, 이는 코드 파싱 단계에서 이미 확정됩니다.",
    },
    {
      id: "q2",
      question: "다음 코드의 출력 결과는?\n```js\nconst x = '전역';\nfunction foo() { console.log(x); }\nfunction bar() {\n  const x = '지역';\n  foo();\n}\nbar();\n```",
      choices: ["'지역'", "'전역'", "ReferenceError", "undefined"],
      correctIndex: 1,
      explanation: "foo는 전역 스코프에서 정의되었으므로, 외부 렉시컬 환경 참조가 전역 환경을 가리킵니다. bar 안에서 호출되더라도 foo는 전역의 x를 참조합니다. 이것이 렉시컬 스코프입니다.",
    },
    {
      id: "q3",
      question: "렉시컬 환경(Lexical Environment)의 구성 요소로 올바른 것은?",
      choices: [
        "콜 스택과 힙 메모리",
        "환경 레코드(Environment Record)와 외부 렉시컬 환경 참조(Outer Reference)",
        "변수 객체(Variable Object)와 스코프 체인",
        "this 바인딩과 함수 목록",
      ],
      correctIndex: 1,
      explanation: "렉시컬 환경은 환경 레코드(현재 스코프의 변수 목록)와 외부 렉시컬 환경 참조(바깥 스코프의 렉시컬 환경을 가리키는 포인터)로 구성됩니다.",
    },
    {
      id: "q4",
      question: "함수 객체의 [[Environment]] 내부 슬롯에 저장되는 것은?",
      choices: [
        "함수가 마지막으로 호출된 환경",
        "함수가 생성될 때의 외부 렉시컬 환경",
        "함수 내부의 모든 변수 목록",
        "함수의 매개변수 기본값",
      ],
      correctIndex: 1,
      explanation: "함수가 생성될 때, 현재의 렉시컬 환경(함수가 정의된 위치의 환경)이 함수 객체의 [[Environment]] 내부 슬롯에 저장됩니다. 이것이 클로저가 가능한 이유입니다.",
    },
    {
      id: "q5",
      question: "동적 스코프(Dynamic Scope)와 비교했을 때 렉시컬 스코프의 장점은?",
      choices: [
        "런타임 성능이 항상 더 빠름",
        "코드를 읽는 것만으로 변수 참조를 예측할 수 있어 이해하기 쉬움",
        "전역 변수를 더 효율적으로 관리",
        "재귀 함수 구현이 더 쉬움",
      ],
      correctIndex: 1,
      explanation: "렉시컬 스코프는 코드의 구조(함수 정의 위치)만 보면 어떤 변수가 참조될지 알 수 있습니다. 동적 스코프는 런타임의 콜 스택에 따라 달라지므로 실행해보기 전까지 예측이 어렵습니다.",
    },
    {
      id: "q6",
      question: "전역 렉시컬 환경의 외부 렉시컬 환경 참조는?",
      choices: [
        "window 객체",
        "null",
        "최상위 함수 스코프",
        "모듈 스코프",
      ],
      correctIndex: 1,
      explanation: "전역 렉시컬 환경은 스코프 체인의 최상단입니다. 더 이상 바깥 환경이 없으므로 외부 렉시컬 환경 참조는 null입니다.",
    },
  ],
};

export default chapter;
