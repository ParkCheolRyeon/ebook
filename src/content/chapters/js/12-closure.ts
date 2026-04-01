import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "12-closure",
  subject: "js",
  title: "클로저",
  description: "클로저의 정의와 자유 변수, 렉시컬 환경과의 관계, 캡슐화/커링/메모이제이션 등 실전 활용 패턴, 메모리 누수 주의점을 깊이 이해합니다.",
  order: 12,
  group: "스코프와 실행 컨텍스트",
  prerequisites: ["11-execution-context"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "클로저는 배낭을 메고 여행하는 사람과 같습니다.\n\n" +
        "어떤 함수가 다른 함수 안에서 만들어졌다고 상상해보세요. 그 함수는 태어날 때 주변에 있던 변수들을 자신의 배낭에 챙겨 넣습니다. 나중에 그 함수가 외부로 나와서 멀리서 호출되더라도, 배낭 속의 변수들은 여전히 살아있습니다.\n\n" +
        "자바스크립트 엔진은 '이 변수를 아직 누군가가 쓰고 있어!'라는 것을 알고 있어서 가비지 컬렉터가 메모리를 회수하지 않습니다.\n\n" +
        "**자유 변수**는 배낭 속의 물건입니다. 함수 자신이 선언한 것도 아니고, 매개변수로 받은 것도 아닌데, 외부에서 가져온 변수입니다.\n\n" +
        "클로저를 활용하면 외부에서 직접 접근할 수 없는 프라이빗한 상태를 만들 수 있습니다. 마치 배낭 속의 물건은 주인만 꺼낼 수 있는 것처럼요.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "자바스크립트에는 `private` 키워드가 없었습니다(클래스 private 필드는 최근에 추가). 그렇다면 외부에서 직접 수정할 수 없는 데이터를 어떻게 보호할 수 있을까요?\n\n" +
        "```js\n" +
        "// 문제: count를 외부에서 아무나 바꿀 수 있음\n" +
        "let count = 0;\n" +
        "function increment() { count++; }\n" +
        "function getCount() { return count; }\n" +
        "\n" +
        "count = 999; // 누구나 직접 변경 가능!\n" +
        "```\n\n" +
        "또한, 같은 로직이지만 각각 독립된 상태를 가진 여러 인스턴스를 만들고 싶을 때는 어떻게 할까요?\n\n" +
        "```js\n" +
        "// counter1과 counter2가 같은 count를 공유하면 안 됨\n" +
        "const counter1 = ???;\n" +
        "const counter2 = ???;\n" +
        "counter1.increment();\n" +
        "console.log(counter2.getCount()); // 0이어야 함\n" +
        "```\n\n" +
        "이런 문제들을 클로저로 우아하게 해결할 수 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 클로저(Closure)의 정의\n" +
        "클로저는 **함수와 그 함수가 선언된 렉시컬 환경의 조합**입니다. 외부 함수의 실행이 끝난 후에도 내부 함수가 외부 함수의 변수를 참조할 수 있는 현상입니다.\n\n" +
        "### 자유 변수 (Free Variable)\n" +
        "함수 내에서 사용되지만, 그 함수의 매개변수도 아니고 지역 변수도 아닌 변수입니다. 클로저는 자유 변수를 기억합니다.\n\n" +
        "### 클로저와 렉시컬 환경\n" +
        "함수 객체의 `[[Environment]]` 슬롯에 외부 렉시컬 환경 참조가 저장됩니다. 외부 함수의 실행이 끝나도 내부 함수가 `[[Environment]]`를 통해 외부 환경을 참조하고 있으므로, 가비지 컬렉터는 그 환경을 회수하지 않습니다.\n\n" +
        "### 클로저 활용 패턴\n\n" +
        "**1. 캡슐화 / 정보 은닉:**\n" +
        "외부에서 직접 접근할 수 없는 프라이빗 변수를 만듭니다. 오직 정해진 메서드를 통해서만 상태를 변경할 수 있습니다.\n\n" +
        "**2. 모듈 패턴 (IIFE + 클로저):**\n" +
        "즉시 실행 함수(IIFE)와 클로저를 결합하여 프라이빗 스코프를 가진 모듈을 만듭니다.\n\n" +
        "**3. 커링 (Currying):**\n" +
        "여러 인자를 받는 함수를 인자 하나씩 받는 함수들의 체인으로 변환합니다. 클로저로 앞서 받은 인자를 기억합니다.\n\n" +
        "**4. 메모이제이션 (Memoization):**\n" +
        "클로저로 캐시 객체를 기억하여, 같은 인자로 반복 호출 시 계산을 건너뛰고 캐시된 결과를 반환합니다.\n\n" +
        "### 메모리 누수 주의점\n" +
        "클로저가 외부 환경을 참조하는 한 그 환경의 변수들은 메모리에 남아있습니다. 필요 없어진 클로저를 계속 유지하면 메모리 누수가 발생할 수 있습니다. 이벤트 리스너, 타이머, 전역 변수에 클로저를 저장할 때 특히 주의해야 합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 클로저의 메모리 모델",
      content:
        "클로저가 실행 컨텍스트 종료 후에도 렉시컬 환경을 유지하는 메커니즘을 의사코드로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// 클로저의 내부 동작 (의사코드)\n' +
          '\n' +
          'function makeCounter(initial: number) {\n' +
          '  // makeCounter 실행 시 렉시컬 환경 생성:\n' +
          '  // { count: initial, outer: 전역 환경 }\n' +
          '  let count = initial;\n' +
          '\n' +
          '  // increment 함수 생성 시:\n' +
          '  // increment.[[Environment]] = makeCounter의 렉시컬 환경\n' +
          '  function increment() {\n' +
          '    count++; // 자유 변수 count 참조\n' +
          '    return count;\n' +
          '  }\n' +
          '\n' +
          '  function decrement() {\n' +
          '    count--; // 동일한 count 공유\n' +
          '    return count;\n' +
          '  }\n' +
          '\n' +
          '  function reset() {\n' +
          '    count = initial; // initial도 자유 변수\n' +
          '    return count;\n' +
          '  }\n' +
          '\n' +
          '  return { increment, decrement, reset };\n' +
          '  // makeCounter 실행 컨텍스트 종료 — 하지만!\n' +
          '  // increment, decrement, reset이 렉시컬 환경을 참조 중\n' +
          '  // → 가비지 컬렉터가 환경을 회수하지 않음\n' +
          '}\n' +
          '\n' +
          '// 독립적인 인스턴스 생성\n' +
          'const counterA = makeCounter(0);  // 환경A: { count: 0, initial: 0 }\n' +
          'const counterB = makeCounter(10); // 환경B: { count: 10, initial: 10 }\n' +
          '\n' +
          'counterA.increment(); // 환경A count: 1\n' +
          'counterA.increment(); // 환경A count: 2\n' +
          'counterB.increment(); // 환경B count: 11 (A와 독립!)\n' +
          '\n' +
          'console.log(counterA.increment()); // 3\n' +
          'console.log(counterB.increment()); // 12\n' +
          '\n' +
          'counterA.reset(); // 환경A count: 0, 환경B는 그대로\n' +
          'console.log(counterA.increment()); // 1\n' +
          'console.log(counterB.decrement()); // 11',
        description: "클로저는 자신이 생성될 때의 렉시컬 환경을 참조하므로, 외부 함수 종료 후에도 그 환경의 변수가 살아있습니다. 각 makeCounter 호출은 독립적인 환경을 만듭니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 클로저 활용 패턴",
      content:
        "정보 은닉, 커링, 메모이제이션을 클로저로 구현하는 실전 패턴을 살펴봅니다.",
      code: {
        language: "javascript",
        code:
          '// ===== 1. 캡슐화 / 정보 은닉 =====\n' +
          'function createBankAccount(initialBalance) {\n' +
          '  let balance = initialBalance; // 프라이빗 변수\n' +
          '\n' +
          '  return {\n' +
          '    deposit(amount) {\n' +
          '      if (amount > 0) balance += amount;\n' +
          '      return balance;\n' +
          '    },\n' +
          '    withdraw(amount) {\n' +
          '      if (amount > balance) throw new Error("잔액 부족");\n' +
          '      balance -= amount;\n' +
          '      return balance;\n' +
          '    },\n' +
          '    getBalance() { return balance; },\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          'const account = createBankAccount(1000);\n' +
          'account.deposit(500);   // 1500\n' +
          'account.withdraw(200);  // 1300\n' +
          '// account.balance → undefined (직접 접근 불가!)\n' +
          '\n' +
          '// ===== 2. 커링 (Currying) =====\n' +
          'function multiply(a) {\n' +
          '  return function(b) {\n' +
          '    return a * b; // a는 자유 변수\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          'const double = multiply(2);\n' +
          'const triple = multiply(3);\n' +
          '\n' +
          'console.log(double(5));  // 10\n' +
          'console.log(triple(5));  // 15\n' +
          'console.log(double(triple(4))); // 24\n' +
          '\n' +
          '// ===== 3. 메모이제이션 =====\n' +
          'function memoize(fn) {\n' +
          '  const cache = new Map(); // 클로저로 캐시 유지\n' +
          '\n' +
          '  return function(...args) {\n' +
          '    const key = JSON.stringify(args);\n' +
          '    if (cache.has(key)) {\n' +
          '      console.log("캐시 히트!");\n' +
          '      return cache.get(key);\n' +
          '    }\n' +
          '    const result = fn.apply(this, args);\n' +
          '    cache.set(key, result);\n' +
          '    return result;\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          'const expensiveFib = memoize(function fib(n) {\n' +
          '  if (n <= 1) return n;\n' +
          '  return expensiveFib(n - 1) + expensiveFib(n - 2);\n' +
          '});\n' +
          '\n' +
          'console.log(expensiveFib(10)); // 계산\n' +
          'console.log(expensiveFib(10)); // "캐시 히트!" → 즉시 반환\n' +
          '\n' +
          '// ===== 4. 메모리 누수 주의 =====\n' +
          'function attachHandler(element) {\n' +
          '  const largeData = new Array(1000000).fill("data"); // 큰 데이터\n' +
          '\n' +
          '  // 이벤트 핸들러가 largeData를 클로저로 유지!\n' +
          '  element.addEventListener("click", function() {\n' +
          '    console.log(largeData.length);\n' +
          '  });\n' +
          '\n' +
          '  // element가 DOM에서 제거될 때 이벤트 리스너도 제거해야 함\n' +
          '  // 그렇지 않으면 largeData가 메모리에 계속 남아있음\n' +
          '}',
        description: "클로저는 자바스크립트에서 프라이빗 상태 관리, 함수 합성, 성능 최적화 등 다양한 패턴의 기초입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**클로저 = 함수 + 그 함수가 선언된 렉시컬 환경**\n\n" +
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| 자유 변수 | 함수의 매개변수도, 지역 변수도 아닌 외부에서 참조하는 변수 |\n" +
        "| 클로저 유지 | 외부 함수 종료 후에도 내부 함수가 외부 환경을 참조하면 환경이 보존됨 |\n" +
        "| 독립 인스턴스 | 함수를 여러 번 호출하면 각 호출마다 독립적인 렉시컬 환경이 생성됨 |\n\n" +
        "**활용 패턴:**\n" +
        "- 캡슐화/정보 은닉: `let` 변수를 외부에서 보호\n" +
        "- 커링: 인자를 순차적으로 받는 함수 체인\n" +
        "- 메모이제이션: 결과를 캐시하는 고차 함수\n" +
        "- 모듈 패턴: IIFE + 클로저로 프라이빗 스코프\n\n" +
        "**주의사항:** 클로저가 대용량 데이터를 자유 변수로 참조하면 메모리 누수가 발생할 수 있습니다. 특히 이벤트 리스너, 타이머에서 주의하세요.\n\n" +
        "**이 그룹을 마치며:** 스코프 → 렉시컬 스코프 → 실행 컨텍스트 → 클로저로 이어지는 자바스크립트의 핵심 메커니즘을 이해했습니다. 이제 비동기 처리와 프로토타입을 배울 준비가 되었습니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "클로저를 '함수와 그 함수가 선언된 렉시컬 환경의 조합'으로 정의할 수 있다",
    "자유 변수(free variable)가 무엇인지 설명할 수 있다",
    "외부 함수 종료 후에도 클로저가 외부 변수를 참조할 수 있는 이유를 설명할 수 있다",
    "클로저로 정보 은닉(캡슐화)을 구현할 수 있다",
    "커링과 메모이제이션을 클로저로 구현할 수 있다",
    "클로저로 인한 메모리 누수 가능성을 인식하고 주의점을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "클로저(Closure)의 올바른 정의는?",
      choices: [
        "함수 안에 또 다른 함수를 선언하는 패턴",
        "함수와 그 함수가 선언된 렉시컬 환경의 조합",
        "외부 변수를 매개변수로 받아 처리하는 기법",
        "즉시 실행되는 함수 표현식",
      ],
      correctIndex: 1,
      explanation: "클로저는 함수와 그 함수가 선언된 렉시컬 환경의 조합입니다. 핵심은 외부 함수의 실행이 끝난 후에도 내부 함수가 외부 렉시컬 환경을 통해 외부 변수에 접근할 수 있다는 것입니다.",
    },
    {
      id: "q2",
      question: "자유 변수(Free Variable)란?",
      choices: [
        "전역 스코프에 선언된 변수",
        "함수의 매개변수도 지역 변수도 아닌, 외부 스코프에서 참조하는 변수",
        "const로 선언되어 변경 불가능한 변수",
        "메모리에서 해제된 변수",
      ],
      correctIndex: 1,
      explanation: "자유 변수는 함수 내부에서 사용되지만, 그 함수의 매개변수도 아니고 지역 변수도 아닌 변수입니다. 외부 스코프에서 참조하는 변수로, 클로저가 기억하는 대상입니다.",
    },
    {
      id: "q3",
      question: "다음 코드의 출력은?\n```js\nfunction outer() {\n  let x = 10;\n  return function inner() {\n    x++;\n    return x;\n  };\n}\nconst fn1 = outer();\nconst fn2 = outer();\nfn1(); fn1();\nconsole.log(fn2());\n```",
      choices: ["12", "11", "10", "3"],
      correctIndex: 1,
      explanation: "outer()를 두 번 호출하면 각각 독립적인 렉시컬 환경이 생성됩니다. fn1은 자신의 x(10)를 두 번 증가시켜 12, fn2는 독립된 자신의 x(10)를 한 번 증가시켜 11을 반환합니다.",
    },
    {
      id: "q4",
      question: "클로저로 정보 은닉을 구현하는 핵심 원리는?",
      choices: [
        "변수 이름 앞에 _ 를 붙이는 관례",
        "외부 함수의 지역 변수는 외부에서 직접 접근할 수 없고, 내부 함수(클로저)를 통해서만 접근 가능",
        "Object.freeze()로 객체를 동결",
        "Symbol을 키로 사용하여 접근 차단",
      ],
      correctIndex: 1,
      explanation: "클로저 정보 은닉의 핵심은 외부 함수의 지역 변수에 직접 접근할 수 없다는 스코프 규칙입니다. 변수를 외부 함수의 스코프에 선언하고, 내부 함수(클로저)만 그 변수에 접근할 수 있게 하면 자연스러운 정보 은닉이 됩니다.",
    },
    {
      id: "q5",
      question: "커링(Currying)에서 클로저의 역할은?",
      choices: [
        "함수 실행 속도를 빠르게 함",
        "먼저 받은 인자를 자유 변수로 기억하여 이후 호출에서도 사용 가능하게 함",
        "함수를 배열 형태로 저장",
        "비동기 처리를 동기로 변환",
      ],
      correctIndex: 1,
      explanation: "커링에서 클로저는 먼저 받은 인자를 자유 변수로 기억합니다. 예를 들어 multiply(2)는 a=2를 클로저로 기억하고, 이후 multiply(2)(5)처럼 호출하면 기억된 a=2와 새 인자 b=5를 사용하여 10을 반환합니다.",
    },
    {
      id: "q6",
      question: "메모이제이션(Memoization)을 클로저로 구현할 때 캐시를 어디에 저장하는가?",
      choices: [
        "전역 변수에",
        "래퍼 함수(memoize)의 지역 변수에 — 반환된 함수가 클로저로 유지",
        "함수의 prototype에",
        "sessionStorage에",
      ],
      correctIndex: 1,
      explanation: "메모이제이션에서 캐시(Map 또는 객체)는 래퍼 함수(memoize)의 지역 변수로 선언됩니다. 반환된 내부 함수가 이 캐시를 자유 변수로 참조하는 클로저가 되어, 함수 호출 간에 캐시 데이터를 유지합니다.",
    },
    {
      id: "q7",
      question: "클로저로 인한 메모리 누수가 발생할 수 있는 상황은?",
      choices: [
        "클로저를 const로 선언할 때",
        "제거된 DOM 요소에 대한 이벤트 핸들러가 대용량 데이터를 클로저로 참조할 때",
        "클로저를 함수 내부에서만 사용할 때",
        "클로저가 원시값만 참조할 때",
      ],
      correctIndex: 1,
      explanation: "클로저가 대용량 데이터를 자유 변수로 참조하고 있으면, 그 데이터는 메모리에서 해제되지 않습니다. DOM 요소가 제거되어도 이벤트 핸들러(클로저)가 남아있으면 해당 핸들러가 참조하는 모든 변수가 메모리에 유지됩니다. 이벤트 리스너를 removeEventListener로 제거하는 것이 중요합니다.",
    },
    {
      id: "q8",
      question: "다음 코드에서 클로저가 참조하는 자유 변수는?\n```js\nfunction createMultiplier(factor) {\n  return (number) => number * factor;\n}\n```",
      choices: ["number", "factor", "number와 factor 모두", "자유 변수 없음"],
      correctIndex: 1,
      explanation: "반환되는 화살표 함수 (number) => number * factor에서 number는 이 함수의 매개변수이고, factor는 외부 함수 createMultiplier의 매개변수입니다. factor는 반환된 함수 입장에서 매개변수도 지역 변수도 아닌 자유 변수입니다.",
    },
  ],
};

export default chapter;
