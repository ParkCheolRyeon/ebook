import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "04-functions",
  subject: "typescript",
  title: "함수 타이핑",
  description:
    "함수의 매개변수, 반환값, 오버로드, 콜백까지 TypeScript에서 함수를 타이핑하는 모든 방법을 학습합니다.",
  order: 4,
  group: "기초",
  prerequisites: ["03-type-inference"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "함수 타이핑은 **자판기의 사용 설명서**와 같습니다.\n\n" +
        "자판기에는 투입구(매개변수)와 배출구(반환값)가 있습니다. 투입구에는 '동전만 넣으세요(number)'라는 안내가 있고, 배출구에는 '음료가 나옵니다(Drink)'라고 써있습니다.\n\n" +
        "**선택적 매개변수(?)**는 '설탕 추가(선택)'와 같습니다. 넣어도 되고 안 넣어도 됩니다.\n\n" +
        "**기본값 매개변수**는 '설탕 1개(기본)'입니다. 따로 지정하지 않으면 기본값이 적용됩니다.\n\n" +
        "**나머지 매개변수(...args)**는 '토핑 추가(여러 개 가능)'입니다. 0개든 10개든 원하는 만큼 넣을 수 있습니다.\n\n" +
        "**함수 오버로드**는 같은 자판기가 동전, 카드, 모바일 결제를 모두 받는 것과 같습니다. 입력 방식에 따라 처리 과정이 다르지만, 결국 음료가 나옵니다. 각 입력 방식마다 별도의 안내(오버로드 시그니처)가 필요합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "JavaScript에서 함수는 매우 유연하지만, 그 유연함이 문제가 됩니다.\n\n" +
        "**1. 매개변수 타입의 불확실성**\n" +
        "함수를 호출할 때 어떤 타입의 인자를 넘겨야 하는지 함수 시그니처만으로는 알 수 없습니다. `function process(data)` — data가 문자열인지, 객체인지, 배열인지 코드를 읽어봐야 합니다.\n\n" +
        "**2. 반환값의 불확실성**\n" +
        "함수가 무엇을 반환하는지, null을 반환할 수 있는지, 에러를 throw할 수 있는지 시그니처로 표현되지 않습니다.\n\n" +
        "**3. 콜백 함수의 타이핑**\n" +
        "React에서 이벤트 핸들러, useEffect의 콜백, 배열 메서드의 콜백 등 함수를 인자로 넘기는 패턴이 매우 빈번합니다. 이 콜백의 타입을 정확히 표현해야 합니다.\n\n" +
        "**4. void와 undefined의 혼동**\n" +
        "`void`를 반환하는 함수와 `undefined`를 반환하는 함수의 차이를 모르면, 콜백 타이핑에서 예상치 못한 에러를 만납니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "TypeScript는 함수의 입력과 출력을 정밀하게 타이핑하는 도구를 제공합니다.\n\n" +
        "### 매개변수와 반환값 타입\n" +
        "매개변수에는 타입을 명시하고, 반환값은 대부분 추론에 맡깁니다. 다만 공개 API나 복잡한 함수에서는 반환 타입 명시가 유용합니다.\n\n" +
        "### 선택적 매개변수 (?)\n" +
        "`?`를 붙이면 해당 매개변수를 생략할 수 있습니다. 함수 본문에서의 타입은 `T | undefined`와 동일하지만, 호출 시그니처에서는 차이가 있습니다. `f(x?: string)`은 인자를 아예 생략할 수 있지만, `f(x: string | undefined)`는 반드시 `undefined`라도 명시적으로 전달해야 합니다. 선택적 매개변수는 반드시 필수 매개변수 뒤에 와야 합니다.\n\n" +
        "### 기본값 매개변수\n" +
        "기본값을 지정하면 타입이 자동 추론되며, 호출 시 생략할 수 있습니다. `?`와 달리 함수 내부에서 undefined 체크가 불필요합니다.\n\n" +
        "### 나머지 매개변수 (...args)\n" +
        "`...args: number[]`처럼 배열 타입으로 표기합니다. 0개 이상의 인자를 받을 수 있습니다.\n\n" +
        "### 함수 타입 표현식\n" +
        "`(a: string, b: number) => boolean` 형태로 함수의 타입을 표현합니다. 변수에 함수를 할당하거나, 콜백 매개변수에 사용합니다.\n\n" +
        "### 함수 오버로드\n" +
        "동일한 함수가 다른 매개변수 조합을 받을 때 사용합니다. 오버로드 시그니처(선언)와 구현 시그니처를 분리합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 함수 오버로드",
      content:
        "함수 오버로드는 하나의 함수가 여러 가지 호출 방식을 지원할 때 사용합니다. 오버로드 시그니처는 호출자에게 보이는 '계약'이고, 구현 시그니처는 모든 경우를 처리하는 실제 구현입니다. React에서 자주 사용되는 패턴입니다.",
      code: {
        language: "typescript",
        code:
          "// ===== 함수 오버로드 =====\n" +
          "\n" +
          "// 오버로드 시그니처 (호출자에게 보이는 타입)\n" +
          "function createElement(tag: \"a\"): HTMLAnchorElement;\n" +
          "function createElement(tag: \"canvas\"): HTMLCanvasElement;\n" +
          "function createElement(tag: \"input\"): HTMLInputElement;\n" +
          "\n" +
          "// 구현 시그니처 (실제 구현, 호출자에게는 보이지 않음)\n" +
          "function createElement(tag: string): HTMLElement {\n" +
          "  return document.createElement(tag);\n" +
          "}\n" +
          "\n" +
          "// 호출 시 오버로드 시그니처에 따라 반환 타입이 결정됨\n" +
          'const anchor = createElement("a");     // HTMLAnchorElement\n' +
          'const canvas = createElement("canvas"); // HTMLCanvasElement\n' +
          'const input = createElement("input");   // HTMLInputElement\n' +
          "\n" +
          "// ===== void vs undefined =====\n" +
          "// void 반환 타입: \"반환값을 사용하지 않겠다\"는 의미\n" +
          "type VoidCallback = () => void;\n" +
          "\n" +
          "// void 콜백은 반환값이 있어도 허용 (반환값이 무시됨)\n" +
          "const cb: VoidCallback = () => 42; // ✅ OK\n" +
          "const result = cb();\n" +
          "// result의 타입은 void (42가 아님)\n" +
          "\n" +
          "// undefined 반환은 명시적으로 undefined만 허용\n" +
          "function returnUndefined(): undefined {\n" +
          "  return undefined; // 반드시 undefined를 반환해야 함\n" +
          "}",
        description:
          "함수 오버로드는 오버로드 시그니처와 구현 시그니처를 분리합니다. void 반환 타입은 '반환값을 사용하지 않겠다'는 의미로, undefined와는 다릅니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 함수 타이핑 패턴",
      content:
        "실무에서 자주 사용되는 함수 타이핑 패턴들을 살펴봅시다. 선택적 매개변수, 나머지 매개변수, 콜백 함수 타이핑 등 다양한 상황을 다룹니다.",
      code: {
        language: "typescript",
        code:
          "// 1. 선택적 매개변수와 기본값\n" +
          "function greet(name: string, greeting?: string): string {\n" +
          '  return `${greeting ?? "안녕하세요"}, ${name}님!`;\n' +
          "}\n" +
          'greet("Alice");           // "안녕하세요, Alice님!"\n' +
          'greet("Alice", "환영합니다"); // "환영합니다, Alice님!"\n' +
          "\n" +
          "// 기본값이 있으면 ?가 필요 없음\n" +
          'function createUser(name: string, role: string = "user") {\n' +
          "  return { name, role };\n" +
          "}\n" +
          "\n" +
          "// 2. 나머지 매개변수\n" +
          "function sum(...numbers: number[]): number {\n" +
          "  return numbers.reduce((acc, cur) => acc + cur, 0);\n" +
          "}\n" +
          "sum(1, 2, 3, 4, 5); // 15\n" +
          "\n" +
          "// 3. 함수 타입 표현식 (콜백 타이핑)\n" +
          "type EventHandler = (event: MouseEvent) => void;\n" +
          "type Comparator<T> = (a: T, b: T) => number;\n" +
          "\n" +
          "function sortArray<T>(arr: T[], compare: Comparator<T>): T[] {\n" +
          "  return [...arr].sort(compare);\n" +
          "}\n" +
          "\n" +
          "const sorted = sortArray([3, 1, 2], (a, b) => a - b);\n" +
          "// a, b는 number로 추론 (문맥적 타이핑)\n" +
          "\n" +
          "// 4. React 이벤트 핸들러 패턴\n" +
          "// const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {\n" +
          "//   console.log(e.currentTarget.textContent);\n" +
          "// };\n" +
          "// const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n" +
          "//   console.log(e.target.value);\n" +
          "// };",
        description:
          "선택적 매개변수, 나머지 매개변수, 콜백 타이핑 등 실무에서 자주 사용되는 함수 타이핑 패턴입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 문법 | 용도 |\n" +
        "|------|------|------|\n" +
        "| 매개변수 타입 | `(a: string)` | 입력 타입 명시 |\n" +
        "| 반환 타입 | `: number` | 출력 타입 (보통 추론) |\n" +
        "| 선택적 매개변수 | `(a?: string)` | 생략 가능한 인자 |\n" +
        "| 기본값 | `(a = \"hi\")` | 생략 시 기본값 |\n" +
        "| 나머지 매개변수 | `(...a: T[])` | 가변 인자 |\n" +
        "| 함수 타입 | `(a: T) => U` | 콜백/변수 타이핑 |\n" +
        "| 오버로드 | 시그니처 + 구현 | 다중 호출 방식 |\n\n" +
        "**핵심:** 함수의 매개변수는 반드시 타입을 명시하고, 반환값은 추론에 맡기는 것이 일반적입니다. 함수 오버로드는 같은 이름의 함수가 다른 인자 조합을 받을 때 사용합니다.\n\n" +
        "**다음 챕터 미리보기:** 객체의 형태를 정의하는 interface를 배웁니다. 선택적 프로퍼티, readonly, 인덱스 시그니처, 확장(extends) 등 객체 타이핑의 핵심을 다룹니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "함수의 매개변수는 반드시 타입을 명시하고, 반환값은 추론에 맡기는 것이 일반적이다. 함수 오버로드는 같은 이름의 함수가 다른 인자 조합을 받을 때 사용한다.",
  checklist: [
    "함수 매개변수에 타입을 명시하고 반환 타입은 추론에 맡길 수 있다",
    "선택적 매개변수(?)와 기본값 매개변수의 차이를 설명할 수 있다",
    "나머지 매개변수(...args)의 타입을 올바르게 지정할 수 있다",
    "함수 오버로드의 시그니처와 구현을 올바르게 작성할 수 있다",
    "void와 undefined 반환 타입의 차이를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "function greet(name: string, greeting?: string)에서 greeting의 타입은?",
      choices: [
        "string",
        "string | undefined",
        "string | null",
        "any",
      ],
      correctIndex: 1,
      explanation:
        "선택적 매개변수(?)는 함수 본문에서 해당 타입과 undefined의 유니온과 동일하게 동작합니다. 다만 호출 시에는 차이가 있습니다. greeting?: string은 인자 생략이 가능하지만, greeting: string | undefined는 undefined라도 명시적으로 전달해야 합니다.",
    },
    {
      id: "q2",
      question:
        "함수 오버로드에서 구현 시그니처의 역할은?",
      choices: [
        "호출자에게 보이는 타입을 정의",
        "모든 오버로드 시그니처를 포함하는 실제 구현",
        "반환 타입만 정의",
        "매개변수 기본값을 정의",
      ],
      correctIndex: 1,
      explanation:
        "구현 시그니처는 모든 오버로드 시그니처를 수용할 수 있어야 하며, 실제 로직이 담깁니다. 호출자에게는 오버로드 시그니처만 보이고, 구현 시그니처는 보이지 않습니다.",
    },
    {
      id: "q3",
      question:
        "type Callback = () => void; const fn: Callback = () => 42; 이 코드는?",
      choices: [
        "컴파일 에러 (42는 void가 아님)",
        "컴파일 성공 (void는 반환값을 무시)",
        "런타임 에러",
        "fn()의 반환 타입이 number가 됨",
      ],
      correctIndex: 1,
      explanation:
        "void 반환 타입은 '반환값을 사용하지 않겠다'는 의미입니다. 실제로 값을 반환해도 타입 시스템에서 무시됩니다. 이는 forEach 같은 메서드의 콜백이 값을 반환해도 문제없도록 하기 위한 설계입니다.",
    },
    {
      id: "q4",
      question:
        "function sum(...nums: number[])에서 sum(1, 2, 3)을 호출하면 nums는?",
      choices: [
        "number 타입",
        "[1, 2, 3] 튜플",
        "number[] 배열 [1, 2, 3]",
        "undefined",
      ],
      correctIndex: 2,
      explanation:
        "나머지 매개변수(rest parameter)는 전달된 인자들을 배열로 수집합니다. ...nums: number[]이므로 nums는 [1, 2, 3]이라는 number[] 배열이 됩니다.",
    },
    {
      id: "q5",
      question: "함수의 반환 타입을 명시하는 것이 권장되는 경우는?",
      choices: [
        "모든 함수에 항상 명시해야 한다",
        "공개 API나 복잡한 반환 로직이 있을 때",
        "반환 타입이 void일 때만",
        "제네릭 함수에서만",
      ],
      correctIndex: 1,
      explanation:
        "대부분의 경우 TypeScript가 반환 타입을 정확히 추론합니다. 하지만 라이브러리의 공개 API, 복잡한 조건부 반환, 재귀 함수 등에서는 반환 타입을 명시하는 것이 가독성과 안전성을 높입니다.",
    },
  ],
};

export default chapter;
