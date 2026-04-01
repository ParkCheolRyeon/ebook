import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "06-function-definition",
  subject: "js",
  title: "함수 정의와 호출",
  description: "함수 선언문, 함수 표현식, 화살표 함수 미리보기, 매개변수와 반환값, 즉시 실행 함수까지 함수의 모든 것을 깊이 이해합니다.",
  order: 6,
  group: "함수의 기본",
  prerequisites: ["05-control-flow"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "함수는 **레시피**와 같습니다.\n\n" +
        "레시피를 작성하는 것(함수 정의)과 실제로 요리하는 것(함수 호출)은 별개입니다. 레시피를 아무리 정교하게 써도, 주방에서 실제로 만들기 전까지는 음식이 나오지 않습니다.\n\n" +
        "**매개변수**는 레시피에서 '재료'에 해당합니다. '닭 500g, 양파 1개'처럼 만들 때마다 다른 재료를 사용할 수 있습니다.\n\n" +
        "**반환값**은 완성된 요리입니다. 레시피를 수행한 결과물을 돌려줍니다.\n\n" +
        "**즉시 실행 함수(IIFE)**는 레시피를 쓰자마자 바로 주방에서 실행해버리는 것입니다. 한 번만 사용하고 버릴 레시피에 적합합니다.\n\n" +
        "**함수 선언문**은 요리책에 이름을 붙여 등록하는 것이고, **함수 표현식**은 요리사 개인이 노트에 적어두는 레시피입니다. 요리책은 누구나 찾아볼 수 있지만(호이스팅), 개인 노트는 적어둔 이후에만 꺼내볼 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "코드가 복잡해질수록 같은 로직이 여러 곳에 반복됩니다. 반복 코드는 버그의 온상이고 유지보수를 어렵게 만듭니다.\n\n" +
        "자바스크립트에는 함수를 정의하는 방법이 여러 가지 있습니다. 각 방식의 동작이 미묘하게 달라서 잘못 선택하면 예상치 못한 버그가 생깁니다:\n\n" +
        "1. **호이스팅 차이** — 함수 선언문은 선언 전에도 호출 가능하지만, 함수 표현식은 불가\n" +
        "2. **이름 유무** — 익명 함수는 스택 트레이스에서 디버깅이 어려움\n" +
        "3. **this 바인딩** — 일반 함수와 화살표 함수의 `this` 동작이 완전히 다름\n" +
        "4. **매개변수 처리** — 자바스크립트는 인자 개수를 강제하지 않아 `undefined`가 발생할 수 있음\n\n" +
        "이 챕터에서는 각 함수 정의 방식의 특징과 올바른 사용 시점을 명확히 이해합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. 함수 선언문 (Function Declaration)\n" +
        "`function` 키워드로 시작하며 반드시 이름이 있어야 합니다. **호이스팅**이 일어나 코드 어디서든 호출 가능합니다. 엔진이 스크립트를 실행하기 전에 함수 전체를 메모리에 등록합니다.\n\n" +
        "```js\nfunction add(a, b) {\n  return a + b;\n}\n```\n\n" +
        "### 2. 함수 표현식 (Function Expression)\n" +
        "함수를 값으로 취급해 변수에 할당합니다. `var`로 선언하면 변수는 호이스팅되지만 함수 자체는 호이스팅되지 않습니다. `let`/`const`로 선언하면 TDZ가 적용됩니다.\n\n" +
        "```js\nconst multiply = function(a, b) {\n  return a * b;\n};\n```\n\n" +
        "### 3. Function 생성자 (비권장)\n" +
        "`new Function('a', 'b', 'return a + b')`처럼 문자열로 함수를 만듭니다. 클로저를 형성하지 않고 전역 스코프에서 실행됩니다. 보안 위험과 성능 문제로 실무에서 거의 사용하지 않습니다.\n\n" +
        "### 4. 화살표 함수 미리보기 (Arrow Function)\n" +
        "ES6에서 도입된 간결한 문법입니다. `this`를 자체적으로 바인딩하지 않아 콜백에서 유용합니다. 다음 챕터에서 자세히 다룹니다.\n\n" +
        "### 5. 매개변수와 인자\n" +
        "**매개변수(parameter)**는 함수 정의 시 사용하는 변수 이름이고, **인자(argument)**는 호출 시 전달하는 실제 값입니다. 자바스크립트는 인자 개수를 강제하지 않아, 부족하면 `undefined`, 초과하면 무시됩니다.\n\n" +
        "**기본 매개변수(Default Parameter)**로 `undefined`를 방어할 수 있습니다: `function greet(name = '게스트') {}`\n\n" +
        "### 6. 반환값 (Return Value)\n" +
        "`return` 문이 없거나 값 없이 `return`만 쓰면 `undefined`를 반환합니다. 함수는 오직 하나의 값만 반환할 수 있지만, 객체나 배열로 여러 값을 묶어 반환할 수 있습니다.\n\n" +
        "### 7. 즉시 실행 함수 표현식 (IIFE)\n" +
        "함수를 정의하자마자 즉시 호출합니다. 전역 스코프 오염을 막고, 초기화 코드를 한 번만 실행할 때 사용합니다.\n\n" +
        "```js\n(function() {\n  // 이 안의 변수는 전역 스코프에 노출되지 않음\n})();\n```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 함수 호이스팅 동작",
      content:
        "자바스크립트 엔진이 함수 선언문과 함수 표현식을 어떻게 다르게 처리하는지 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// === 함수 선언문: 호이스팅 O ===\n' +
          '// 실제 작성 순서:\n' +
          'sayHello();            // "Hello!" — 선언 전에도 호출 가능\n' +
          '\n' +
          'function sayHello() {\n' +
          '  console.log("Hello!");\n' +
          '}\n' +
          '\n' +
          '// JS 엔진이 내부적으로 처리하는 순서:\n' +
          '// 1단계(파싱): function sayHello() {...} 전체를 메모리에 등록\n' +
          '// 2단계(실행): sayHello() 호출 → 이미 존재하므로 정상 실행\n' +
          '\n' +
          '// ============================================\n' +
          '\n' +
          '// === 함수 표현식: 호이스팅 X (TDZ 적용) ===\n' +
          '// sayBye();  // ReferenceError! TDZ 영역\n' +
          '\n' +
          'const sayBye = function() {\n' +
          '  console.log("Bye!");\n' +
          '};\n' +
          '\n' +
          'sayBye();   // "Bye!" — 선언 이후 정상 호출\n' +
          '\n' +
          '// ============================================\n' +
          '\n' +
          '// === 매개변수 기본값과 인자 초과/부족 ===\n' +
          'function greet(name: string = "게스트", age?: number): string {\n' +
          '  const ageText = age !== undefined ? `, ${age}세` : "";\n' +
          '  return `안녕하세요, ${name}${ageText}!`;\n' +
          '}\n' +
          '\n' +
          'console.log(greet());              // "안녕하세요, 게스트!"\n' +
          'console.log(greet("Alice"));       // "안녕하세요, Alice!"\n' +
          'console.log(greet("Bob", 30));     // "안녕하세요, Bob, 30세!"',
        description:
          "함수 선언문은 파싱 단계에서 전체가 등록되지만, 함수 표현식은 변수에 할당되는 시점에만 사용 가능합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 다양한 함수 정의 방식 비교",
      content:
        "같은 로직을 네 가지 방식으로 구현해 차이를 직접 체감합니다. IIFE를 활용한 모듈 패턴도 확인합니다.",
      code: {
        language: "typescript",
        code:
          '// ① 함수 선언문\n' +
          'function square1(n: number): number {\n' +
          '  return n * n;\n' +
          '}\n' +
          '\n' +
          '// ② 함수 표현식 (기명)\n' +
          'const square2 = function square(n: number): number {\n' +
          '  return n * n;\n' +
          '};\n' +
          '\n' +
          '// ③ 함수 표현식 (익명) — 스택 트레이스에서 이름이 표시되지 않음\n' +
          'const square3 = function(n: number): number {\n' +
          '  return n * n;\n' +
          '};\n' +
          '\n' +
          '// ④ 화살표 함수 (미리보기)\n' +
          'const square4 = (n: number): number => n * n;\n' +
          '\n' +
          'console.log(square1(5)); // 25\n' +
          'console.log(square2(5)); // 25\n' +
          'console.log(square3(5)); // 25\n' +
          'console.log(square4(5)); // 25\n' +
          '\n' +
          '// ✅ IIFE — 전역 스코프 오염 없이 초기화\n' +
          'const config = (function() {\n' +
          '  const API_KEY = "secret-key"; // 외부에서 접근 불가\n' +
          '  const BASE_URL = "https://api.example.com";\n' +
          '\n' +
          '  return {\n' +
          '    getBaseUrl: () => BASE_URL,\n' +
          '    // API_KEY는 클로저 안에 안전하게 숨겨짐\n' +
          '  };\n' +
          '})();\n' +
          '\n' +
          'console.log(config.getBaseUrl()); // "https://api.example.com"\n' +
          '// console.log(API_KEY);          // ReferenceError!\n' +
          '\n' +
          '// ✅ 다중 반환값 — 객체/배열 활용\n' +
          'function divide(a: number, b: number): { quotient: number; remainder: number } {\n' +
          '  return {\n' +
          '    quotient: Math.floor(a / b),\n' +
          '    remainder: a % b,\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          'const { quotient, remainder } = divide(17, 5);\n' +
          'console.log(`몫: ${quotient}, 나머지: ${remainder}`); // 몫: 3, 나머지: 2',
        description:
          "IIFE 패턴은 즉시 실행되며 내부 변수를 캡슐화합니다. 구조 분해 할당으로 다중 값 반환을 깔끔하게 처리할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 방식 | 호이스팅 | 이름 | this | 주요 용도 |\n" +
        "|------|----------|------|------|-----------|\n" +
        "| 함수 선언문 | O (전체) | 필수 | 동적 | 일반 함수 정의 |\n" +
        "| 함수 표현식 | X (TDZ) | 선택 | 동적 | 콜백, 조건부 정의 |\n" +
        "| Function 생성자 | X | 선택 | 동적 | 비권장 |\n" +
        "| 화살표 함수 | X (TDZ) | 없음 | 정적(상위) | 콜백, 간결한 표현 |\n\n" +
        "**핵심 규칙:**\n" +
        "- 최상위 유틸 함수는 **함수 선언문** 사용 (호이스팅 활용, 가독성)\n" +
        "- 콜백이나 조건부 함수는 **함수 표현식** + `const`\n" +
        "- `this`가 필요 없는 콜백은 다음 챕터에서 배울 **화살표 함수**\n" +
        "- 한 번만 실행하는 초기화 코드는 **IIFE**\n\n" +
        "**매개변수 팁:** 기본 매개변수로 `undefined` 방어, 나머지 매개변수(`...args`)로 가변 인자 처리, 구조 분해로 다중 반환값 활용.\n\n" +
        "**다음 챕터 미리보기:** 함수가 '일급 객체'라는 사실이 가져다주는 강력한 패턴들(콜백, 고차 함수)을 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "함수 선언문과 함수 표현식의 호이스팅 차이를 설명할 수 있다",
    "매개변수(parameter)와 인자(argument)의 차이를 설명할 수 있다",
    "기본 매개변수로 undefined를 방어하는 방법을 알고 있다",
    "함수가 항상 하나의 값을 반환하며, return이 없으면 undefined임을 안다",
    "IIFE의 목적(스코프 격리, 즉시 실행)을 설명할 수 있다",
    "Function 생성자를 사용하지 않아야 하는 이유를 설명할 수 있다",
    "기명 함수 표현식이 디버깅에 유리한 이유를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "다음 코드의 실행 결과는 무엇인가?\n\nconsole.log(foo());\nfunction foo() { return 42; }",
      choices: ["ReferenceError", "TypeError", "42", "undefined"],
      correctIndex: 2,
      explanation:
        "함수 선언문은 스크립트 파싱 단계에서 함수 전체가 메모리에 등록됩니다(호이스팅). 따라서 선언 이전에 호출해도 42가 정상 출력됩니다.",
    },
    {
      id: "q2",
      question: "다음 코드의 실행 결과는 무엇인가?\n\nconsole.log(bar());\nconst bar = function() { return 42; };",
      choices: ["42", "undefined", "ReferenceError", "TypeError"],
      correctIndex: 2,
      explanation:
        "const로 선언한 함수 표현식은 TDZ(Temporal Dead Zone)에 놓입니다. 선언 이전에 접근하면 ReferenceError가 발생합니다.",
    },
    {
      id: "q3",
      question: "function add(a, b = 10) { return a + b; } — add(5)를 호출했을 때 결과는?",
      choices: ["NaN", "5", "15", "undefined"],
      correctIndex: 2,
      explanation:
        "b에 인자를 전달하지 않으면 기본 매개변수 값 10이 사용됩니다. 따라서 5 + 10 = 15가 반환됩니다.",
    },
    {
      id: "q4",
      question: "즉시 실행 함수 표현식(IIFE)의 주된 목적은 무엇인가?",
      choices: [
        "함수를 더 빠르게 실행하기 위해",
        "전역 스코프 오염을 막고 코드를 즉시 실행하기 위해",
        "함수를 재사용하기 위해",
        "호이스팅을 활용하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "IIFE는 함수를 정의함과 동시에 실행하여 내부 변수를 전역 스코프에 노출하지 않습니다. 초기화 코드나 모듈 패턴에 자주 사용됩니다.",
    },
    {
      id: "q5",
      question: "return 문이 없는 함수를 호출하면 반환값은 무엇인가?",
      choices: ["null", "0", "false", "undefined"],
      correctIndex: 3,
      explanation:
        "return 문이 없거나 값 없이 return만 있는 경우, 자바스크립트 함수는 항상 undefined를 반환합니다.",
    },
    {
      id: "q6",
      question: "Function 생성자(new Function(...))를 실무에서 피해야 하는 가장 중요한 이유는?",
      choices: [
        "문법이 복잡하기 때문에",
        "호이스팅이 되지 않기 때문에",
        "보안 취약점(코드 인젝션)과 성능 저하, 클로저 미형성 때문에",
        "화살표 함수보다 느리기 때문에",
      ],
      correctIndex: 2,
      explanation:
        "Function 생성자는 문자열로 코드를 받아 동적으로 함수를 생성합니다. XSS 등 보안 취약점이 생기고, 매번 파싱이 필요해 성능이 나쁘며, 클로저를 형성하지 않아 예상치 못한 동작이 생깁니다.",
    },
    {
      id: "q7",
      question: "다음 중 '매개변수(parameter)'와 '인자(argument)'를 올바르게 설명한 것은?",
      choices: [
        "둘 다 같은 의미로 혼용된다",
        "매개변수는 함수 정의 시의 변수 이름, 인자는 호출 시 전달하는 실제 값이다",
        "인자는 함수 정의 시의 변수 이름, 매개변수는 호출 시 전달하는 실제 값이다",
        "매개변수는 기본값이 있는 것, 인자는 기본값이 없는 것이다",
      ],
      correctIndex: 1,
      explanation:
        "매개변수(parameter)는 함수를 정의할 때 쓰는 이름이고, 인자(argument)는 실제 호출 시 넘기는 값입니다. 예: function add(a, b)에서 a, b가 매개변수, add(1, 2)에서 1, 2가 인자입니다.",
    },
  ],
};

export default chapter;
