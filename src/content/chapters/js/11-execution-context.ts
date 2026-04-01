import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "11-execution-context",
  subject: "js",
  title: "실행 컨텍스트",
  description: "전역/함수 실행 컨텍스트, 콜 스택, 렉시컬 환경, 변수 환경, this 바인딩, 실행 컨텍스트 생성 과정을 깊이 이해합니다.",
  order: 11,
  group: "스코프와 실행 컨텍스트",
  prerequisites: ["10-lexical-scope"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "실행 컨텍스트는 자바스크립트 코드를 실행하기 위한 '작업 책상'입니다.\n\n" +
        "요리사가 요리를 시작할 때를 생각해보세요. 요리를 시작하면 작업 공간(실행 컨텍스트)이 준비됩니다. 작업 공간에는:\n" +
        "- **재료 목록표(변수 환경):** 이 요리에 쓸 재료들(변수들)의 목록\n" +
        "- **레시피 출처(렉시컬 환경):** 어떤 레시피 책(외부 환경)을 참고하는지\n" +
        "- **'나는 누구인가' 팻말(this 바인딩):** 지금 이 작업이 어느 주방(객체)의 것인지\n\n" +
        "요리사가 메인 요리를 하다가 소스를 만들어야 한다면(함수 호출), 새 작업 공간이 위에 쌓입니다(콜 스택). 소스가 완성되면(함수 반환) 그 작업 공간을 치우고 다시 메인 요리로 돌아옵니다.\n\n" +
        "**콜 스택**은 이런 작업 공간들이 쌓인 탑입니다. 항상 맨 위(가장 최근)의 작업 공간에서 요리(코드 실행)가 이루어집니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "자바스크립트 엔진은 코드를 어떻게 실행할까요? 여러 함수가 서로를 호출할 때 어떻게 추적할까요?\n\n" +
        "다음 코드에서 엔진은 무엇을 어떻게 기억하고 있을까요?\n\n" +
        "```js\n" +
        "function multiply(a, b) {\n" +
        "  return a * b;\n" +
        "}\n" +
        "\n" +
        "function square(n) {\n" +
        "  return multiply(n, n); // multiply 호출\n" +
        "}\n" +
        "\n" +
        "const result = square(5); // square 호출\n" +
        "```\n\n" +
        "이 코드가 실행될 때:\n" +
        "1. `square(5)` 호출 시 엔진은 어디로 가야 하는지 어떻게 알까요?\n" +
        "2. `multiply`가 끝난 후 어떻게 `square`로 돌아올까요?\n" +
        "3. 각 함수 안의 변수들은 어디에 저장될까요?\n" +
        "4. `this`는 어떻게 결정될까요?\n\n" +
        "이 모든 것을 관리하는 메커니즘이 **실행 컨텍스트**와 **콜 스택**입니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 실행 컨텍스트 (Execution Context)\n" +
        "코드가 실행되기 위한 환경 정보를 담은 객체입니다. 세 가지 구성 요소로 이루어집니다:\n\n" +
        "**1. 렉시컬 환경 (Lexical Environment)**\n" +
        "- 환경 레코드: 현재 스코프의 변수, 함수 선언 저장\n" +
        "- 외부 렉시컬 환경 참조: 바깥 스코프로의 링크\n\n" +
        "**2. 변수 환경 (Variable Environment)**\n" +
        "`var`로 선언된 변수와 함수 선언을 저장합니다. 초기에는 렉시컬 환경과 같지만, `with`문이나 `eval` 사용 시 달라질 수 있습니다. 대부분의 경우 렉시컬 환경과 동일하게 동작합니다.\n\n" +
        "**3. this 바인딩 (This Binding)**\n" +
        "현재 컨텍스트에서 `this`가 가리키는 객체입니다:\n" +
        "- 전역 컨텍스트: 브라우저는 `window`, Node.js는 `global`\n" +
        "- 함수 컨텍스트: 호출 방식에 따라 결정 (일반 호출은 전역/undefined, 메서드 호출은 해당 객체)\n" +
        "- 화살표 함수: `this` 없음, 외부 컨텍스트의 `this` 상속\n\n" +
        "### 실행 컨텍스트의 종류\n" +
        "- **전역 실행 컨텍스트:** 코드가 처음 실행될 때 단 한 번 생성. 전역 객체와 `this` 초기화\n" +
        "- **함수 실행 컨텍스트:** 함수가 호출될 때마다 새로 생성. 호출이 끝나면 제거\n" +
        "- **eval 실행 컨텍스트:** `eval()` 함수 실행 시 생성 (현대 코드에서는 사용 자제)\n\n" +
        "### 콜 스택 (Call Stack)\n" +
        "실행 컨텍스트를 관리하는 LIFO(Last In, First Out) 스택입니다. 현재 실행 중인 컨텍스트는 항상 스택의 맨 위에 있습니다.\n\n" +
        "### 실행 컨텍스트 생성 과정 (2단계)\n" +
        "**생성 단계(Creation Phase):** 렉시컬 환경과 변수 환경 생성, `var` 선언은 `undefined`로 초기화, 함수 선언은 완전히 초기화, `let`/`const`는 TDZ 상태\n\n" +
        "**실행 단계(Execution Phase):** 코드를 한 줄씩 실행하며 변수에 값 할당",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 콜 스택과 실행 컨텍스트",
      content:
        "함수 호출 시 실행 컨텍스트가 생성되고 콜 스택에 쌓이는 과정을 의사코드로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// 실행 컨텍스트 구조 (의사코드)\n' +
          'interface ExecutionContext {\n' +
          '  lexicalEnvironment: LexicalEnvironment;\n' +
          '  variableEnvironment: LexicalEnvironment;\n' +
          '  thisBinding: object | undefined;\n' +
          '}\n' +
          '\n' +
          '// 콜 스택: 실행 컨텍스트의 LIFO 스택\n' +
          'const callStack: ExecutionContext[] = [];\n' +
          '\n' +
          '// ==== 실제 코드 ====\n' +
          'function multiply(a: number, b: number) {\n' +
          '  return a * b;\n' +
          '}\n' +
          '\n' +
          'function square(n: number) {\n' +
          '  return multiply(n, n);\n' +
          '}\n' +
          '\n' +
          'const result = square(5);\n' +
          '\n' +
          '// ==== 엔진의 실행 과정 ====\n' +
          '\n' +
          '// 1. 전역 실행 컨텍스트 생성 및 푸시\n' +
          '// 콜 스택: [전역 EC]\n' +
          '// 생성 단계: multiply → Function, square → Function, result → undefined(TDZ)\n' +
          '\n' +
          '// 2. square(5) 호출 → square의 실행 컨텍스트 생성 및 푸시\n' +
          '// 콜 스택: [전역 EC, square EC]\n' +
          '// square EC:\n' +
          '//   lexicalEnv.environmentRecord: { n: 5 }\n' +
          '//   lexicalEnv.outer: 전역 환경\n' +
          '//   thisBinding: undefined (strict mode) 또는 window\n' +
          '\n' +
          '// 3. multiply(n, n) 호출 → multiply의 실행 컨텍스트 생성 및 푸시\n' +
          '// 콜 스택: [전역 EC, square EC, multiply EC]\n' +
          '// multiply EC:\n' +
          '//   lexicalEnv.environmentRecord: { a: 5, b: 5 }\n' +
          '//   lexicalEnv.outer: 전역 환경\n' +
          '//   thisBinding: undefined (strict mode)\n' +
          '\n' +
          '// 4. multiply 반환 (25) → multiply EC 팝\n' +
          '// 콜 스택: [전역 EC, square EC]\n' +
          '\n' +
          '// 5. square 반환 (25) → square EC 팝\n' +
          '// 콜 스택: [전역 EC]\n' +
          '\n' +
          '// 6. result = 25 할당\n' +
          '// 콜 스택: [전역 EC] (프로그램 종료까지 유지)\n' +
          '\n' +
          '// ==== this 바인딩 예시 ====\n' +
          'const obj = {\n' +
          '  name: "Alice",\n' +
          '  greet() {\n' +
          '    // 메서드 호출 → this = obj\n' +
          '    console.log(this.name); // "Alice"\n' +
          '  },\n' +
          '};\n' +
          '\n' +
          'obj.greet(); // this = obj\n' +
          '\n' +
          'const fn = obj.greet;\n' +
          'fn(); // this = undefined(strict) 또는 window — 호출 방식이 달라짐!',
        description: "실행 컨텍스트는 함수 호출 시 생성되어 콜 스택에 쌓이고, 함수 반환 시 제거됩니다. 콜 스택 오버플로우(무한 재귀)가 발생하면 'Maximum call stack size exceeded' 오류가 납니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 실행 컨텍스트와 호이스팅",
      content:
        "실행 컨텍스트의 생성 단계와 실행 단계를 이해하면 호이스팅을 완전히 설명할 수 있습니다.",
      code: {
        language: "javascript",
        code:
          '// ===== 생성 단계(Creation Phase)의 호이스팅 =====\n' +
          '\n' +
          '// 함수 선언: 생성 단계에서 완전히 초기화됨\n' +
          'console.log(sayHello()); // "안녕하세요!" — 호출 전에도 동작!\n' +
          '\n' +
          'function sayHello() {\n' +
          '  return "안녕하세요!";\n' +
          '}\n' +
          '\n' +
          '// var: 생성 단계에서 undefined로 초기화됨\n' +
          'console.log(count); // undefined — 에러 아님, 하지만 값 없음\n' +
          'var count = 5;\n' +
          'console.log(count); // 5\n' +
          '\n' +
          '// let/const: TDZ — 생성 단계에서 선언만, 초기화 안됨\n' +
          '// console.log(name); // ReferenceError: Cannot access \'name\' before initialization\n' +
          'const name = "Bob";\n' +
          '\n' +
          '// ===== 함수 실행 컨텍스트의 독립성 =====\n' +
          'function makeAdder(x) {\n' +
          '  // 매번 새로운 실행 컨텍스트 생성\n' +
          '  // 각 컨텍스트는 독립적인 x를 가짐\n' +
          '  return function(y) {\n' +
          '    return x + y; // 각자의 x 참조\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          'const add5 = makeAdder(5); // 컨텍스트1: x = 5\n' +
          'const add10 = makeAdder(10); // 컨텍스트2: x = 10\n' +
          '\n' +
          'console.log(add5(3));  // 8  (5 + 3)\n' +
          'console.log(add10(3)); // 13 (10 + 3)\n' +
          '\n' +
          '// ===== this 바인딩의 다양한 방식 =====\n' +
          '"use strict";\n' +
          '\n' +
          'function showThis() {\n' +
          '  console.log(this);\n' +
          '}\n' +
          '\n' +
          'const obj = { name: "객체", showThis };\n' +
          '\n' +
          'showThis();     // undefined (strict mode 일반 호출)\n' +
          'obj.showThis(); // { name: "객체", showThis: f } (메서드 호출)\n' +
          '\n' +
          'const bound = showThis.bind({ custom: true });\n' +
          'bound(); // { custom: true } (명시적 바인딩)\n' +
          '\n' +
          'new showThis(); // {} (new 연산자 — 새 객체 생성)',
        description: "실행 컨텍스트의 생성 단계에서 변수 환경이 초기화되어 호이스팅이 발생합니다. var는 undefined, 함수 선언은 함수 객체, let/const는 TDZ 상태로 초기화됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**실행 컨텍스트의 3가지 구성 요소:**\n" +
        "| 구성 요소 | 역할 |\n" +
        "|----------|------|\n" +
        "| 렉시컬 환경 | let/const, 함수 선언, 스코프 체인 관리 |\n" +
        "| 변수 환경 | var 선언 관리 (초기값 undefined) |\n" +
        "| this 바인딩 | 현재 컨텍스트의 this 참조 |\n\n" +
        "**실행 컨텍스트 생성 2단계:**\n" +
        "1. **생성 단계:** 렉시컬 환경/변수 환경 초기화, 호이스팅 발생\n" +
        "2. **실행 단계:** 코드 한 줄씩 실행, 변수에 값 할당\n\n" +
        "**콜 스택:** LIFO 구조. 함수 호출 시 푸시, 반환 시 팝. 오버플로우 시 'Maximum call stack size exceeded'\n\n" +
        "**핵심 이해:** 호이스팅은 코드가 물리적으로 이동하는 것이 아니라, 생성 단계에서 선언이 먼저 처리되기 때문에 발생하는 현상입니다.\n\n" +
        "**다음 챕터 미리보기:** 실행 컨텍스트가 종료되어도 렉시컬 환경이 살아있는 경우가 있습니다. 이것이 클로저입니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "실행 컨텍스트의 3가지 구성 요소(렉시컬 환경, 변수 환경, this 바인딩)를 설명할 수 있다",
    "콜 스택의 LIFO 원리와 함수 호출/반환 시 동작을 설명할 수 있다",
    "실행 컨텍스트의 생성 단계와 실행 단계의 차이를 설명할 수 있다",
    "호이스팅이 생성 단계에서 발생함을 이해하고 var/let/const의 차이를 설명할 수 있다",
    "this 바인딩이 호출 방식에 따라 결정됨을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "콜 스택(Call Stack)의 자료구조 특성은?",
      choices: [
        "FIFO (First In, First Out)",
        "LIFO (Last In, First Out)",
        "우선순위 큐",
        "이중 연결 리스트",
      ],
      correctIndex: 1,
      explanation: "콜 스택은 LIFO(Last In, First Out) 구조입니다. 가장 최근에 쌓인(마지막에 호출된) 실행 컨텍스트가 가장 먼저 제거됩니다. 함수 호출 시 푸시, 반환 시 팝됩니다.",
    },
    {
      id: "q2",
      question: "실행 컨텍스트의 생성 단계(Creation Phase)에서 일어나지 않는 것은?",
      choices: [
        "var 변수를 undefined로 초기화",
        "함수 선언을 함수 객체로 초기화",
        "let/const를 TDZ 상태로 등록",
        "변수에 실제 값 할당",
      ],
      correctIndex: 3,
      explanation: "변수에 실제 값을 할당하는 것은 실행 단계(Execution Phase)에서 이루어집니다. 생성 단계에서는 렉시컬 환경 구성, var는 undefined 초기화, 함수 선언은 완전 초기화, let/const는 TDZ 등록이 이루어집니다.",
    },
    {
      id: "q3",
      question: "전역 실행 컨텍스트는 언제 생성되는가?",
      choices: [
        "전역 함수가 처음 호출될 때",
        "자바스크립트 코드가 처음 실행될 때 단 한 번",
        "모든 함수 호출마다",
        "import 구문이 실행될 때",
      ],
      correctIndex: 1,
      explanation: "전역 실행 컨텍스트는 자바스크립트 코드가 처음 실행될 때 단 한 번 생성됩니다. 프로그램이 종료될 때까지 콜 스택의 가장 아래에 위치합니다.",
    },
    {
      id: "q4",
      question: "엄격 모드(strict mode)에서 일반 함수를 직접 호출할 때 this의 값은?",
      choices: [
        "window 또는 global 객체",
        "undefined",
        "null",
        "함수 자기 자신",
      ],
      correctIndex: 1,
      explanation: "엄격 모드(use strict)에서 일반 함수를 직접 호출하면 this는 undefined입니다. 비엄격 모드에서는 전역 객체(window/global)가 됩니다.",
    },
    {
      id: "q5",
      question: "렉시컬 환경(Lexical Environment)과 변수 환경(Variable Environment)의 차이는?",
      choices: [
        "렉시컬 환경은 함수를, 변수 환경은 객체를 저장",
        "렉시컬 환경은 let/const/함수 선언을, 변수 환경은 var 선언을 주로 처리",
        "차이 없음, 완전히 동일",
        "렉시컬 환경은 전역에서만, 변수 환경은 함수에서만 사용",
      ],
      correctIndex: 1,
      explanation: "렉시컬 환경은 let, const, 함수 선언을 관리합니다. 변수 환경은 주로 var 선언을 관리합니다. 초기에는 동일하지만 with문이나 eval 사용 시 달라질 수 있습니다.",
    },
    {
      id: "q6",
      question: "다음 중 'Maximum call stack size exceeded' 오류가 발생하는 원인은?",
      choices: [
        "변수를 너무 많이 선언",
        "무한 재귀 등으로 실행 컨텍스트가 계속 쌓여 스택이 넘침",
        "너무 큰 배열을 생성",
        "동기 코드에서 setTimeout 사용",
      ],
      correctIndex: 1,
      explanation: "콜 스택에는 크기 제한이 있습니다. 무한 재귀처럼 함수가 계속 자기 자신을 호출하면 실행 컨텍스트가 무한히 쌓여 스택 한계를 초과하고 'Maximum call stack size exceeded' 오류가 발생합니다.",
    },
    {
      id: "q7",
      question: "함수 선언식과 함수 표현식의 호이스팅 차이는?",
      choices: [
        "둘 다 완전히 호이스팅되어 선언 전에 호출 가능",
        "함수 선언식은 완전히 호이스팅, 함수 표현식(var)은 변수 부분만 undefined로 호이스팅",
        "둘 다 호이스팅되지 않음",
        "함수 표현식만 완전히 호이스팅됨",
      ],
      correctIndex: 1,
      explanation: "함수 선언식(function foo(){})은 생성 단계에서 함수 객체 전체가 초기화되어 선언 전에도 호출 가능합니다. var로 선언한 함수 표현식(var foo = function(){})은 var 변수 부분만 undefined로 초기화되어 선언 전에 호출하면 'foo is not a function' 오류가 납니다.",
    },
    {
      id: "q8",
      question: "화살표 함수의 this 바인딩이 일반 함수와 다른 점은?",
      choices: [
        "화살표 함수는 항상 window를 this로 사용",
        "화살표 함수는 자체적인 this가 없고 외부 컨텍스트의 this를 상속",
        "화살표 함수는 this가 undefined로 고정",
        "화살표 함수는 new로 호출 시 this가 결정",
      ],
      correctIndex: 1,
      explanation: "화살표 함수는 실행 컨텍스트 생성 시 this 바인딩을 하지 않습니다. 대신 렉시컬 스코프처럼, 함수가 정의된 위치의 외부 컨텍스트 this를 상속받습니다. 이 때문에 화살표 함수는 new로 생성자 호출이 불가능합니다.",
    },
  ],
};

export default chapter;
