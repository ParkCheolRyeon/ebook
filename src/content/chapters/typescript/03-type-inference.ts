import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "03-type-inference",
  subject: "typescript",
  title: "타입 추론",
  description:
    "TypeScript의 타입 추론 메커니즘을 이해하고, 언제 타입을 명시하고 언제 추론에 맡길지 판단하는 기준을 배웁니다.",
  order: 3,
  group: "기초",
  prerequisites: ["02-basic-types"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "타입 추론은 **탐정의 추리**와 같습니다.\n\n" +
        "TypeScript 컴파일러는 코드의 단서를 보고 타입을 추리합니다. `let x = 42`라고 쓰면 '42는 숫자이니, x는 number겠군'이라고 추론합니다. 매번 '이건 숫자입니다'라고 말해줄 필요가 없죠.\n\n" +
        "**const vs let의 추론 차이**는 증언의 확실성과 같습니다. `const color = \"red\"`라고 하면 컴파일러는 '이 값은 절대 바뀌지 않으니, 타입은 정확히 \"red\"이다'라고 확정합니다(리터럴 타입). 반면 `let color = \"red\"`라면 '지금은 \"red\"이지만 바뀔 수 있으니, 타입은 string이다'라고 넓게 추론합니다.\n\n" +
        "**문맥적 타이핑**은 상황 증거입니다. `document.addEventListener(\"click\", (e) => {})`에서 컴파일러는 'click 이벤트의 콜백이니, e는 MouseEvent겠군'이라고 주변 문맥으로부터 추론합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "TypeScript를 처음 사용하면 두 가지 극단에 빠지기 쉽습니다.\n\n" +
        "**1. 모든 곳에 타입을 명시하는 과잉 표기**\n" +
        "`let name: string = \"Alice\"`처럼 이미 추론 가능한 곳에도 타입을 명시합니다. 코드가 장황해지고, 중복된 정보가 가독성을 해칩니다. TypeScript의 강력한 추론 엔진을 활용하지 못하는 것입니다.\n\n" +
        "**2. 추론이 의도와 다른 경우를 인지하지 못함**\n" +
        "`let status = \"loading\"`은 `string`으로 추론됩니다. 하지만 의도가 `\"loading\" | \"success\" | \"error\"` 같은 유니온이었다면? 추론 결과를 맹목적으로 신뢰하면 타입 안전성을 잃을 수 있습니다.\n\n" +
        "**3. const와 let의 추론 차이를 모름**\n" +
        "왜 `const x = \"hello\"`는 `\"hello\"` 타입이고, `let x = \"hello\"`는 `string` 타입인지 모르면, 리터럴 타입이 필요한 상황에서 혼란을 겪습니다.\n\n" +
        "핵심은 **타입 추론의 규칙을 이해하고, 추론이 부족한 곳에서만 명시하는 균형**을 찾는 것입니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "TypeScript의 타입 추론 메커니즘을 이해하면, 최소한의 타입 표기로 최대한의 타입 안전성을 얻을 수 있습니다.\n\n" +
        "### 변수 초기화 시 추론\n" +
        "변수를 초기화하면 초기값으로부터 타입이 추론됩니다. `let x = 42`는 `number`, `const y = \"hello\"`는 `\"hello\"` 리터럴 타입입니다.\n\n" +
        "### 함수 반환값 추론\n" +
        "함수의 `return` 문을 분석하여 반환 타입을 자동으로 추론합니다. 대부분의 경우 반환 타입을 명시할 필요가 없습니다.\n\n" +
        "### 최적 공통 타입 (Best Common Type)\n" +
        "`[1, \"hello\", true]`처럼 여러 타입이 섞인 배열은 `(string | number | boolean)[]`로 추론됩니다. 모든 요소의 타입을 포함하는 유니온을 만듭니다.\n\n" +
        "### 문맥적 타이핑 (Contextual Typing)\n" +
        "함수가 사용되는 위치(이벤트 리스너, 콜백 등)의 문맥에서 매개변수 타입을 추론합니다.\n\n" +
        "### as const\n" +
        "객체나 배열을 readonly 리터럴 타입으로 만듭니다. `[\"a\", \"b\"] as const`는 `readonly [\"a\", \"b\"]` 타입이 됩니다.\n\n" +
        "### 타입 명시 가이드라인\n" +
        "추론이 정확할 때는 생략하고, 함수 매개변수·빈 배열·의도적 타입 제한이 필요할 때만 명시합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 타입 추론 규칙",
      content:
        "TypeScript 컴파일러가 타입을 추론하는 핵심 규칙들을 살펴봅시다. 특히 const와 let의 추론 차이, 최적 공통 타입, 문맥적 타이핑이 어떻게 동작하는지 이해하면 불필요한 타입 표기를 줄일 수 있습니다.",
      code: {
        language: "typescript",
        code:
          "// ===== 1. const vs let 추론 =====\n" +
          'const greeting = "hello";  // 타입: "hello" (리터럴 타입)\n' +
          'let message = "hello";     // 타입: string (확장된 타입)\n' +
          "\n" +
          "const count = 42;          // 타입: 42\n" +
          "let total = 42;            // 타입: number\n" +
          "\n" +
          "// const는 재할당 불가 → 값이 정확히 그것이므로 리터럴 타입\n" +
          "// let은 재할당 가능 → 같은 원시 타입의 다른 값이 올 수 있으므로 확장\n" +
          "\n" +
          "// ===== 2. 최적 공통 타입 =====\n" +
          "const mixed = [1, \"two\", true];\n" +
          "// 추론: (string | number | boolean)[]\n" +
          "\n" +
          "class Animal { move() {} }\n" +
          "class Dog extends Animal { bark() {} }\n" +
          "class Cat extends Animal { meow() {} }\n" +
          "const pets = [new Dog(), new Cat()];\n" +
          "// 추론: (Dog | Cat)[]  ← Animal[]이 아님!\n" +
          "// Animal[]을 원하면 명시 필요: const pets: Animal[] = ...\n" +
          "\n" +
          "// ===== 3. 함수 반환 타입 추론 =====\n" +
          "function add(a: number, b: number) {\n" +
          "  return a + b; // 반환 타입 자동 추론: number\n" +
          "}\n" +
          "\n" +
          "function parse(input: string) {\n" +
          "  if (input === \"\") return null;\n" +
          "  return parseInt(input);\n" +
          "  // 반환 타입 추론: number | null\n" +
          "}",
        description:
          "const는 리터럴 타입으로, let은 확장된 타입으로 추론됩니다. 최적 공통 타입은 모든 요소의 유니온으로 결정됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 문맥적 타이핑과 as const",
      content:
        "문맥적 타이핑(Contextual Typing)과 as const를 활용하는 실전 예제입니다. 이 두 가지는 TypeScript의 추론을 극대화하는 핵심 도구입니다.",
      code: {
        language: "typescript",
        code:
          "// ===== 문맥적 타이핑 =====\n" +
          "// addEventListener의 두 번째 인자로부터 e의 타입이 추론됨\n" +
          'document.addEventListener("click", (e) => {\n' +
          "  // e는 MouseEvent로 추론 (타입 명시 불필요)\n" +
          "  console.log(e.clientX, e.clientY);\n" +
          "});\n" +
          "\n" +
          "// 배열 메서드의 콜백에서도 문맥적 타이핑 작동\n" +
          "const numbers = [1, 2, 3, 4, 5];\n" +
          "const doubled = numbers.map((n) => n * 2);\n" +
          "// n은 number로 추론, doubled는 number[]로 추론\n" +
          "\n" +
          "// ===== as const =====\n" +
          "// 일반 객체\n" +
          'const config = { endpoint: "/api", timeout: 3000 };\n' +
          "// 타입: { endpoint: string; timeout: number }\n" +
          "\n" +
          "// as const로 리터럴 타입 고정\n" +
          'const configFixed = { endpoint: "/api", timeout: 3000 } as const;\n' +
          '// 타입: { readonly endpoint: "/api"; readonly timeout: 3000 }\n' +
          "\n" +
          "// as const는 배열에도 유용\n" +
          'const ROLES = ["admin", "user", "guest"] as const;\n' +
          '// 타입: readonly ["admin", "user", "guest"]\n' +
          "type Role = (typeof ROLES)[number];\n" +
          '// 타입: "admin" | "user" | "guest"\n' +
          "\n" +
          "// ===== 언제 타입을 명시할까? =====\n" +
          "// ✅ 함수 매개변수 → 항상 명시\n" +
          "function greet(name: string) { return `Hi, ${name}`; }\n" +
          "\n" +
          "// ✅ 빈 배열 → 명시 필요\n" +
          "const items: string[] = [];\n" +
          "\n" +
          "// ❌ 초기값이 명확한 변수 → 생략\n" +
          'let count = 0; // number로 추론됨, : number 불필요\n',
        description:
          "문맥적 타이핑은 주변 문맥에서 타입을 추론하고, as const는 리터럴 타입으로 고정합니다. 타입은 추론이 부족할 때만 명시합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 추론 규칙 | 예시 | 결과 타입 |\n" +
        "|----------|------|----------|\n" +
        "| const 초기화 | `const x = 42` | `42` (리터럴) |\n" +
        "| let 초기화 | `let x = 42` | `number` (확장) |\n" +
        "| 최적 공통 타입 | `[1, \"a\"]` | `(number \\| string)[]` |\n" +
        "| 문맥적 타이핑 | 이벤트 콜백의 `e` | `MouseEvent` 등 |\n" +
        "| 함수 반환 | `return a + b` | `number` |\n" +
        "| as const | `{x: 1} as const` | `{readonly x: 1}` |\n\n" +
        "**핵심:** TypeScript는 대부분의 경우 타입을 자동으로 추론합니다. const는 리터럴 타입으로, let은 확장된 타입으로 추론됩니다. 타입이 명확할 때는 추론에 맡기고, 모호할 때만 명시하세요.\n\n" +
        "**다음 챕터 미리보기:** 함수의 매개변수와 반환값에 타입을 지정하는 방법을 배웁니다. 선택적 매개변수, 나머지 매개변수, 함수 오버로드 등 함수 타이핑의 모든 것을 다룹니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "TypeScript는 대부분의 경우 타입을 자동으로 추론한다. const는 리터럴 타입으로, let은 확장된 타입으로 추론된다. 타입이 명확할 때는 추론에 맡기고, 모호할 때만 명시하라.",
  checklist: [
    "const와 let의 타입 추론 차이를 설명할 수 있다",
    "최적 공통 타입(Best Common Type)의 동작을 이해한다",
    "문맥적 타이핑(Contextual Typing)이 작동하는 상황을 나열할 수 있다",
    "as const의 용도와 효과를 설명할 수 있다",
    "타입을 명시해야 하는 상황과 추론에 맡겨야 하는 상황을 구분할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: 'const name = "Alice"의 타입은?',
      choices: ["string", '"Alice"', "any", "unknown"],
      correctIndex: 1,
      explanation:
        'const로 선언된 원시값은 재할당할 수 없으므로, TypeScript는 값 자체를 타입으로 추론합니다. "Alice"라는 리터럴 타입이 됩니다.',
    },
    {
      id: "q2",
      question: "다음 중 타입을 명시해야 하는 상황은?",
      choices: [
        "const x = 42",
        "함수의 매개변수",
        'let name = "Alice"',
        "return a + b의 반환값",
      ],
      correctIndex: 1,
      explanation:
        "함수의 매개변수는 추론할 단서가 없으므로 반드시 타입을 명시해야 합니다. 변수 초기화와 함수 반환값은 대부분 자동 추론됩니다.",
    },
    {
      id: "q3",
      question: 'const arr = [1, "hello"]의 추론된 타입은?',
      choices: [
        "[number, string]",
        "(number | string)[]",
        "any[]",
        "Array<number & string>",
      ],
      correctIndex: 1,
      explanation:
        "TypeScript의 최적 공통 타입(Best Common Type) 규칙에 의해, 서로 다른 타입의 요소가 있는 배열은 유니온 배열로 추론됩니다. 튜플로 추론하려면 as const를 사용해야 합니다.",
    },
    {
      id: "q4",
      question:
        'const colors = ["red", "blue"] as const에서 typeof colors의 타입은?',
      choices: [
        "string[]",
        '("red" | "blue")[]',
        'readonly ["red", "blue"]',
        "[string, string]",
      ],
      correctIndex: 2,
      explanation:
        'as const는 배열을 readonly 튜플로 만들고, 각 요소를 리터럴 타입으로 좁힙니다. 결과는 readonly ["red", "blue"]입니다.',
    },
    {
      id: "q5",
      question: "문맥적 타이핑(Contextual Typing)이 적용되는 상황은?",
      choices: [
        "변수에 초기값을 할당할 때",
        "함수를 독립적으로 선언할 때",
        "이벤트 리스너의 콜백 매개변수",
        "const로 원시값을 선언할 때",
      ],
      correctIndex: 2,
      explanation:
        "문맥적 타이핑은 함수가 사용되는 위치(이벤트 리스너, 배열 메서드 콜백 등)에서 매개변수 타입을 추론합니다. addEventListener의 콜백에서 이벤트 객체의 타입이 자동으로 추론되는 것이 대표적 예입니다.",
    },
  ],
};

export default chapter;
