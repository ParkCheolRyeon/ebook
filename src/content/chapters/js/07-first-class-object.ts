import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "07-first-class-object",
  subject: "js",
  title: "함수와 일급 객체",
  description: "함수가 일급 객체인 이유와 그 의미, 콜백 패턴과 고차 함수 개념을 깊이 이해합니다.",
  order: 7,
  group: "함수의 기본",
  prerequisites: ["06-function-definition"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "자바스크립트에서 함수가 '일급 객체'라는 말은, 함수가 **숫자나 문자열처럼 완전한 시민권을 가진 값**이라는 뜻입니다.\n\n" +
        "숫자는 변수에 저장할 수 있고, 다른 함수에 인자로 넘길 수 있으며, 함수의 반환값이 될 수 있습니다. 자바스크립트의 함수도 정확히 같은 일을 할 수 있습니다.\n\n" +
        "**콜백**은 '이 작업이 끝나면 나에게 전화해줘(call back)'라는 의미입니다. 피자 배달을 주문하고 배달이 완료되면 '문 앞에 놔두세요'라는 지시를 함께 남기는 것과 같습니다. 배달부(함수)가 완료 시 그 지시(콜백 함수)를 수행합니다.\n\n" +
        "**고차 함수**는 함수를 다루는 함수입니다. 마치 건물을 짓는 건축가가 개별 벽돌(일반 함수)들을 조합해 더 큰 구조물을 만드는 것처럼, 고차 함수는 함수들을 재료로 새로운 동작을 조합합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "같은 구조의 코드가 '무엇을 하느냐'만 다를 때, 반복을 어떻게 줄일 수 있을까요?\n\n" +
        "예를 들어 배열에서 짝수만 필터링하는 코드, 홀수만 필터링하는 코드, 10보다 큰 수만 필터링하는 코드는 모두 '배열을 순회하며 조건에 맞는 요소를 모은다'는 구조는 같고, '조건'만 다릅니다.\n\n" +
        "함수가 일급 객체가 아니라면, '조건' 자체를 값으로 전달할 수 없어 코드를 계속 복붙해야 합니다. 이것이 **추상화의 한계**입니다.\n\n" +
        "또한 비동기 처리(setTimeout, 이벤트 핸들러)에서 '완료 후 실행할 로직'을 어떻게 전달할까요? 언어가 함수를 값으로 취급하지 못하면 이런 패턴 자체가 불가능합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 일급 객체(First-Class Object)의 조건\n" +
        "어떤 값이 일급 객체가 되려면 세 가지 조건을 모두 만족해야 합니다:\n\n" +
        "1. **변수에 할당 가능** — `const fn = function() {};`\n" +
        "2. **함수의 인자로 전달 가능** — `setTimeout(callback, 1000);`\n" +
        "3. **함수의 반환값으로 사용 가능** — `return function() {};`\n\n" +
        "자바스크립트의 함수는 이 세 가지를 모두 만족합니다. 더 나아가 **프로퍼티도 가질 수 있습니다** (`fn.name`, `fn.length`).\n\n" +
        "### 콜백 패턴 (Callback Pattern)\n" +
        "함수를 다른 함수의 인자로 전달하여, 특정 시점이나 조건에서 실행하도록 위임하는 패턴입니다. 이벤트 처리, 비동기 작업 완료 처리, 배열 메서드(`forEach`, `map`, `filter`)가 모두 콜백 패턴을 사용합니다.\n\n" +
        "### 고차 함수 (Higher-Order Function)\n" +
        "**함수를 인자로 받거나 함수를 반환하는 함수**를 고차 함수라고 합니다. 자바스크립트 내장 배열 메서드(`map`, `filter`, `reduce`)가 대표적인 고차 함수입니다.\n\n" +
        "고차 함수를 직접 만들면 코드 재사용성과 추상화 수준이 크게 높아집니다. '무엇을 할지'는 고차 함수가, '어떻게 할지'는 콜백이 담당하는 방식으로 역할을 분리합니다.\n\n" +
        "### 함수를 반환하는 패턴 (클로저 기반)\n" +
        "함수가 함수를 반환할 때, 반환된 함수는 자신이 생성될 때의 스코프를 기억합니다(클로저). 이를 이용해 상태를 캡슐화하거나 함수를 동적으로 생성할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 고차 함수를 직접 만들기",
      content:
        "내장 배열 메서드 `filter`와 `map`을 직접 구현하면서 고차 함수의 동작 원리를 이해합니다.",
      code: {
        language: "typescript",
        code:
          '// === 내장 Array.prototype.filter 직접 구현 ===\n' +
          'function myFilter<T>(arr: T[], predicate: (item: T) => boolean): T[] {\n' +
          '  const result: T[] = [];\n' +
          '  for (const item of arr) {\n' +
          '    if (predicate(item)) {  // 조건 판단을 콜백에 위임\n' +
          '      result.push(item);\n' +
          '    }\n' +
          '  }\n' +
          '  return result;\n' +
          '}\n' +
          '\n' +
          '// 같은 고차 함수, 다른 콜백 → 다른 동작\n' +
          'const numbers = [1, 2, 3, 4, 5, 6, 7, 8];\n' +
          'const evens = myFilter(numbers, (n) => n % 2 === 0);  // [2, 4, 6, 8]\n' +
          'const bigs  = myFilter(numbers, (n) => n > 5);        // [6, 7, 8]\n' +
          '\n' +
          '// === 함수를 반환하는 패턴 (클로저 기반) ===\n' +
          'function makeMultiplier(factor: number) {\n' +
          '  // factor를 기억하는 함수를 반환\n' +
          '  return function(value: number): number {\n' +
          '    return value * factor;\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          'const double = makeMultiplier(2);\n' +
          'const triple = makeMultiplier(3);\n' +
          '\n' +
          'console.log(double(5));  // 10\n' +
          'console.log(triple(5));  // 15\n' +
          '\n' +
          '// === 함수 합성 (Function Composition) ===\n' +
          'function compose<T>(f: (x: T) => T, g: (x: T) => T) {\n' +
          '  return function(x: T): T {\n' +
          '    return f(g(x));  // g를 먼저 실행 후 f에 전달\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          'const addOne = (x: number) => x + 1;\n' +
          'const square = (x: number) => x * x;\n' +
          'const squareThenAdd = compose(addOne, square);\n' +
          '\n' +
          'console.log(squareThenAdd(4));  // square(4) = 16, addOne(16) = 17',
        description:
          "고차 함수는 '무엇을 할지'를 외부에서 주입받아 동작을 일반화합니다. 콜백만 바꾸면 완전히 다른 결과를 만들 수 있습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 실무적인 콜백 패턴과 함수형 접근",
      content:
        "배열 고차 함수를 체이닝하고, 재사용 가능한 유틸리티 함수를 만들어 봅니다.",
      code: {
        language: "typescript",
        code:
          'interface Product {\n' +
          '  name: string;\n' +
          '  price: number;\n' +
          '  inStock: boolean;\n' +
          '}\n' +
          '\n' +
          'const products: Product[] = [\n' +
          '  { name: "노트북", price: 1500000, inStock: true },\n' +
          '  { name: "마우스", price: 30000, inStock: false },\n' +
          '  { name: "키보드", price: 80000, inStock: true },\n' +
          '  { name: "모니터", price: 400000, inStock: true },\n' +
          '  { name: "헤드셋", price: 120000, inStock: false },\n' +
          '];\n' +
          '\n' +
          '// ✅ 고차 함수 체이닝: 재고 있는 상품 중 10만원 이하의 이름만 추출\n' +
          'const affordableInStock = products\n' +
          '  .filter((p) => p.inStock)\n' +
          '  .filter((p) => p.price <= 100000)\n' +
          '  .map((p) => p.name);\n' +
          '\n' +
          'console.log(affordableInStock); // ["키보드"]\n' +
          '\n' +
          '// ✅ reduce로 총액 계산\n' +
          'const totalInStock = products\n' +
          '  .filter((p) => p.inStock)\n' +
          '  .reduce((sum, p) => sum + p.price, 0);\n' +
          '\n' +
          'console.log(`재고 상품 총액: ${totalInStock.toLocaleString()}원`);\n' +
          '// "재고 상품 총액: 1,980,000원"\n' +
          '\n' +
          '// ✅ 재사용 가능한 정렬 함수 생성기 (함수를 반환)\n' +
          'function makeSorter<T>(key: keyof T, order: "asc" | "desc" = "asc") {\n' +
          '  return function(a: T, b: T): number {\n' +
          '    if (a[key] < b[key]) return order === "asc" ? -1 : 1;\n' +
          '    if (a[key] > b[key]) return order === "asc" ? 1 : -1;\n' +
          '    return 0;\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          'const byPriceAsc  = makeSorter<Product>("price", "asc");\n' +
          'const byPriceDesc = makeSorter<Product>("price", "desc");\n' +
          '\n' +
          'const cheapFirst = [...products].sort(byPriceAsc);\n' +
          'const expFirst   = [...products].sort(byPriceDesc);\n' +
          '\n' +
          'console.log(cheapFirst[0].name);  // "마우스"\n' +
          'console.log(expFirst[0].name);    // "노트북"',
        description:
          "filter, map, reduce 체이닝은 선언형 코드의 핵심입니다. makeSorter처럼 함수를 반환하는 패턴으로 재사용 가능한 로직을 만들 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 | 예시 |\n" +
        "|------|------|------|\n" +
        "| 일급 객체 | 값처럼 취급되는 함수 | 변수 할당, 인자 전달, 반환 |\n" +
        "| 콜백 함수 | 인자로 전달되어 나중에 호출되는 함수 | addEventListener, setTimeout |\n" +
        "| 고차 함수 | 함수를 인자로 받거나 반환하는 함수 | map, filter, reduce |\n" +
        "| 함수 반환 | 클로저로 상태를 캡슐화 | makeCounter, makeSorter |\n" +
        "| 함수 합성 | 작은 함수를 조합해 새 함수 생성 | compose(f, g) |\n\n" +
        "**핵심:** 함수를 값으로 다룰 수 있다는 사실이 자바스크립트 프로그래밍 스타일의 근간입니다. 콜백, 프로미스, async/await, 리액트 훅, 이벤트 시스템 모두 이 특성을 기반으로 합니다.\n\n" +
        "**주의:** 콜백을 과도하게 중첩하면 '콜백 지옥(callback hell)'이 됩니다. 이를 해결하기 위해 Promise와 async/await가 등장했습니다.\n\n" +
        "**다음 챕터 미리보기:** 화살표 함수의 문법과 일반 함수와의 결정적 차이(특히 `this` 바인딩)를 자세히 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "함수가 일급 객체라는 것은 변수에 담고, 인자로 넘기고, 반환값으로 쓸 수 있다는 뜻이다. 이것이 콜백, 고차함수, 클로저 등 자바스크립트 패턴의 뿌리다.",
  checklist: [
    "일급 객체의 세 가지 조건을 설명할 수 있다",
    "콜백 함수가 무엇이고 왜 사용하는지 설명할 수 있다",
    "고차 함수의 정의와 실제 예시를 들 수 있다",
    "filter, map, reduce를 직접 작성하고 결과를 예측할 수 있다",
    "함수를 반환하는 패턴으로 재사용 가능한 함수를 만들 수 있다",
    "함수 합성(composition)의 의미와 장점을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "자바스크립트에서 함수가 '일급 객체'임을 증명하는 조건이 아닌 것은?",
      choices: [
        "함수를 변수에 할당할 수 있다",
        "함수를 다른 함수의 인자로 전달할 수 있다",
        "함수를 반환값으로 사용할 수 있다",
        "함수는 new 키워드 없이 호출할 수 없다",
      ],
      correctIndex: 3,
      explanation:
        "일급 객체의 조건은 변수 할당, 인자 전달, 반환값 사용 가능입니다. 'new 없이 호출 불가'는 일급 객체와 관계없으며, 자바스크립트 함수는 new 없이도 자유롭게 호출됩니다.",
    },
    {
      id: "q2",
      question: "다음 중 고차 함수(Higher-Order Function)의 정의에 해당하는 것은?",
      choices: [
        "실행 속도가 빠른 함수",
        "중첩된 함수를 많이 포함한 함수",
        "함수를 인자로 받거나 함수를 반환하는 함수",
        "전역 스코프에서 정의된 함수",
      ],
      correctIndex: 2,
      explanation:
        "고차 함수(Higher-Order Function)는 함수를 인자로 받거나 함수를 반환값으로 사용하는 함수입니다. Array.prototype.map, filter, reduce가 대표적인 예입니다.",
    },
    {
      id: "q3",
      question: "[1, 2, 3, 4].filter(n => n % 2 === 0).map(n => n * 10)의 결과는?",
      choices: ["[10, 20, 30, 40]", "[20, 40]", "[1, 3]", "[2, 4]"],
      correctIndex: 1,
      explanation:
        "filter로 짝수 [2, 4]를 추출한 뒤, map으로 각 요소에 10을 곱해 [20, 40]이 됩니다. 체이닝 시 각 메서드가 새 배열을 반환합니다.",
    },
    {
      id: "q4",
      question: "콜백 함수(callback function)에 대한 설명으로 옳은 것은?",
      choices: [
        "즉시 실행되는 함수다",
        "다른 함수에 인자로 전달되어 적절한 시점에 호출되는 함수다",
        "반드시 비동기로 실행되는 함수다",
        "화살표 함수만 콜백으로 사용할 수 있다",
      ],
      correctIndex: 1,
      explanation:
        "콜백 함수는 다른 함수에 인자로 전달되어 특정 조건이나 시점에 호출되는 함수입니다. 동기와 비동기 모두에서 사용되며, 일반 함수, 익명 함수, 화살표 함수 모두 콜백이 될 수 있습니다.",
    },
    {
      id: "q5",
      question:
        "function makeCounter() {\n  let count = 0;\n  return function() { return ++count; };\n}\nconst counter = makeCounter();\nconsole.log(counter()); // ?\nconsole.log(counter()); // ?",
      choices: ["1, 1", "1, 2", "0, 1", "undefined, undefined"],
      correctIndex: 1,
      explanation:
        "makeCounter가 반환하는 함수는 클로저입니다. 외부 변수 count를 기억하며, 호출될 때마다 count가 증가합니다. 첫 번째 호출은 1, 두 번째 호출은 2를 반환합니다.",
    },
    {
      id: "q6",
      question:
        "[1, 2, 3].reduce((acc, cur) => acc + cur, 0)의 결과는?",
      choices: ["0", "3", "6", "[1, 2, 3]"],
      correctIndex: 2,
      explanation:
        "reduce는 초기값 0에서 시작해 각 요소를 누적합니다. 0+1=1, 1+2=3, 3+3=6. 최종 결과는 6입니다.",
    },
    {
      id: "q7",
      question: "함수를 인자로 받는 패턴(콜백)의 주요 이점은 무엇인가?",
      choices: [
        "코드 실행 속도가 빨라진다",
        "동작(behavior)을 외부에서 주입해 재사용성과 추상화를 높인다",
        "메모리 사용량이 줄어든다",
        "전역 변수를 줄일 수 있다",
      ],
      correctIndex: 1,
      explanation:
        "콜백 패턴의 핵심 이점은 동작을 외부에서 주입하는 것입니다. 같은 고차 함수에 다른 콜백을 넣어 완전히 다른 동작을 만들 수 있어 코드 재사용성과 추상화가 크게 향상됩니다.",
    },
    {
      id: "q8",
      question:
        "다음 코드에서 fn.length의 값은?\nfunction fn(a, b, c = 10) {}\nconsole.log(fn.length);",
      choices: ["3", "2", "1", "0"],
      correctIndex: 1,
      explanation:
        "함수의 length 프로퍼티는 기본값이 없는 매개변수의 수를 반환합니다. c에는 기본값(=10)이 있으므로 제외되어 fn.length는 2입니다. 이는 함수가 일급 객체로서 프로퍼티를 가질 수 있음을 보여주는 예입니다.",
    },
  ],
};

export default chapter;
