import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "08-arrow-function",
  subject: "js",
  title: "화살표 함수",
  description: "화살표 함수의 문법과 일반 함수와의 차이, this 바인딩, arguments, 생성자 불가, 메서드 사용 시 주의점을 깊이 이해합니다.",
  order: 8,
  group: "함수의 기본",
  prerequisites: ["07-first-class-object"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "화살표 함수를 이해하는 핵심은 **`this`를 직접 소유하지 않는다**는 점입니다.\n\n" +
        "일반 함수는 회사에 입사할 때 새로운 사원증을 발급받는 신입사원과 같습니다. 어느 부서에 배치되느냐에 따라(호출 방식) 자신의 소속(`this`)이 달라집니다.\n\n" +
        "화살표 함수는 파견 직원과 같습니다. 자신만의 사원증을 받지 않고, **파견 나오기 전 원래 소속 회사의 사원증**을 그대로 씁니다(상위 스코프의 `this`). 어느 부서에서 일하든 사원증은 바뀌지 않습니다.\n\n" +
        "이 특성 덕분에 객체 메서드 안에서 콜백을 쓸 때 `this`가 바뀌는 문제를 해결할 수 있습니다. 하지만 반대로 **자기 자신의 `this`가 필요한 상황**(객체의 메서드, 이벤트 핸들러에서 `this.element` 접근 등)에서는 화살표 함수가 적합하지 않습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "ES6 이전에는 콜백 내부에서 `this`를 올바르게 유지하는 것이 자바스크립트 개발자들의 가장 흔한 고민이었습니다.\n\n" +
        "```js\nfunction Timer() {\n  this.seconds = 0;\n  setInterval(function() {\n    this.seconds++; // this는 Timer 인스턴스가 아니라 전역/undefined!\n  }, 1000);\n}\n```\n\n" +
        "이 문제를 해결하기 위해 개발자들은 다음과 같은 우회책을 썼습니다:\n\n" +
        "- `const self = this;` — `this`를 변수에 저장해 클로저로 유지\n" +
        "- `.bind(this)` — 함수에 `this`를 수동으로 바인딩\n\n" +
        "화살표 함수는 이 문제를 언어 차원에서 해결했지만, 동시에 새로운 제약도 생겼습니다. 잘못 사용하면 오히려 버그가 생깁니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 화살표 함수 문법\n" +
        "`(매개변수) => 표현식` 또는 `(매개변수) => { 문장들; }` 형태입니다.\n\n" +
        "- 매개변수가 하나면 괄호 생략 가능: `x => x * 2`\n" +
        "- 본문이 표현식 하나면 `return`과 중괄호 생략 가능: `x => x * 2`\n" +
        "- 객체 리터럴 반환 시 소괄호 필요: `x => ({ id: x })`\n\n" +
        "### 일반 함수와의 차이 4가지\n\n" +
        "**① this 바인딩 없음 (가장 중요)**\n" +
        "화살표 함수는 자체 `this`가 없습니다. 함수가 **정의된 시점의 상위 스코프 `this`**를 그대로 사용합니다(렉시컬 this). `call`, `apply`, `bind`로 `this`를 바꿀 수 없습니다.\n\n" +
        "**② arguments 객체 없음**\n" +
        "화살표 함수에는 `arguments` 객체가 없습니다. 가변 인자가 필요하면 나머지 매개변수(`...args`)를 사용해야 합니다.\n\n" +
        "**③ new 키워드로 생성자 사용 불가**\n" +
        "`new ArrowFn()`을 시도하면 `TypeError`가 발생합니다. 화살표 함수에는 `[[Construct]]` 내부 슬롯이 없어 생성자로 쓸 수 없습니다.\n\n" +
        "**④ prototype 프로퍼티 없음**\n" +
        "생성자로 사용할 수 없으므로 `prototype` 프로퍼티도 없습니다. 일반 함수보다 약간 가볍습니다.\n\n" +
        "### 사용하면 안 되는 경우\n" +
        "- **객체의 메서드 정의** — `this`가 상위 스코프(보통 전역)를 가리켜 버림\n" +
        "- **이벤트 핸들러에서 this.element 필요 시** — `this`가 요소를 가리키지 않음\n" +
        "- **생성자 함수** — `new` 사용 불가\n" +
        "- **Generator 함수** — `yield` 사용 불가",
    },
    {
      type: "pseudocode",
      title: "기술 구현: this 바인딩 동작 원리",
      content:
        "화살표 함수의 렉시컬 this와 일반 함수의 동적 this를 나란히 비교합니다.",
      code: {
        language: "typescript",
        code:
          '// === 문제 상황: 일반 함수 콜백의 this 유실 ===\n' +
          'class Counter {\n' +
          '  count = 0;\n' +
          '\n' +
          '  startBad() {\n' +
          '    setInterval(function() {\n' +
          '      // this는 전역 객체(브라우저: window, strict mode: undefined)\n' +
          '      this.count++; // TypeError 또는 전역 변수 오염!\n' +
          '    }, 1000);\n' +
          '  }\n' +
          '\n' +
          '  // ✅ 해결법 1: 화살표 함수 — this를 렉시컬 스코프에서 상속\n' +
          '  startGood() {\n' +
          '    setInterval(() => {\n' +
          '      // 화살표 함수는 this를 상위 스코프(startGood 호출 시의 this)에서 가져옴\n' +
          '      this.count++; // Counter 인스턴스의 count\n' +
          '      console.log(this.count);\n' +
          '    }, 1000);\n' +
          '  }\n' +
          '\n' +
          '  // ✅ 해결법 2 (구식): bind\n' +
          '  startBind() {\n' +
          '    setInterval(function() {\n' +
          '      this.count++;\n' +
          '    }.bind(this), 1000);\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// === 화살표 함수의 this는 call/apply/bind로 변경 불가 ===\n' +
          'const arrowFn = () => console.log(this);\n' +
          'arrowFn.call({ name: "Alice" });  // 여전히 상위 스코프의 this (변경 안 됨)\n' +
          '\n' +
          '// === 객체 메서드에 화살표 함수 사용: 잘못된 예 ===\n' +
          'const person = {\n' +
          '  name: "Bob",\n' +
          '  // ❌ 화살표 함수 — this가 전역 스코프를 가리킴\n' +
          '  greetBad: () => `안녕하세요, ${(this as any)?.name}`,\n' +
          '  // ✅ 일반 함수 또는 메서드 단축 표현 사용\n' +
          '  greetGood() { return `안녕하세요, ${this.name}`; },\n' +
          '};\n' +
          '\n' +
          'console.log(person.greetBad());   // "안녕하세요, undefined"\n' +
          'console.log(person.greetGood());  // "안녕하세요, Bob"',
        description:
          "화살표 함수의 this는 정의 시점의 상위 스코프에서 캡처됩니다. call/apply/bind로도 변경할 수 없습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 화살표 함수 심화 — arguments와 실전 패턴",
      content:
        "arguments 없음, 생성자 불가, 메서드 단축 표현을 실제로 확인하고, 화살표 함수가 빛나는 콜백 패턴을 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// ① arguments 없음 → 나머지 매개변수 사용\n' +
          'function regularSum() {\n' +
          '  // 일반 함수는 arguments 객체 접근 가능\n' +
          '  return Array.from(arguments).reduce((a: number, b: number) => a + b, 0);\n' +
          '}\n' +
          '\n' +
          'const arrowSum = (...args: number[]) => {\n' +
          '  // 화살표 함수는 arguments 없음, 나머지 매개변수 사용\n' +
          '  return args.reduce((a, b) => a + b, 0);\n' +
          '};\n' +
          '\n' +
          'console.log(regularSum(1, 2, 3, 4)); // 10\n' +
          'console.log(arrowSum(1, 2, 3, 4));   // 10\n' +
          '\n' +
          '// ② 생성자 사용 불가\n' +
          'const ArrowPerson = (name: string) => ({ name });\n' +
          '// new ArrowPerson("Alice"); // TypeError: ArrowPerson is not a constructor\n' +
          '\n' +
          '// ③ 객체 리터럴 반환 시 소괄호 필요\n' +
          'const ids = [1, 2, 3];\n' +
          'const wrapped = ids.map(id => ({ id, label: `item-${id}` }));\n' +
          'console.log(wrapped);\n' +
          '// [{ id: 1, label: "item-1" }, { id: 2, label: "item-2" }, ...]\n' +
          '\n' +
          '// ④ 화살표 함수가 빛나는 콜백 체이닝\n' +
          'const scores = [88, 45, 92, 67, 73, 55, 95];\n' +
          '\n' +
          'const result = scores\n' +
          '  .filter(s => s >= 70)           // 70점 이상 필터\n' +
          '  .map(s => ({ score: s,           // 등급 추가\n' +
          '               grade: s >= 90 ? "A" : "B" }))\n' +
          '  .sort((a, b) => b.score - a.score); // 내림차순 정렬\n' +
          '\n' +
          'console.log(result);\n' +
          '// [{ score: 95, grade: "A" }, { score: 92, grade: "A" },\n' +
          '//  { score: 88, grade: "B" }, { score: 73, grade: "B" }]',
        description:
          "화살표 함수는 콜백에서 가장 빛납니다. 간결한 문법과 this 문제 없음 덕분에 filter/map/sort 체이닝이 명확해집니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 특성 | 일반 함수 | 화살표 함수 |\n" +
        "|------|----------|-------------|\n" +
        "| this | 호출 방식에 따라 동적 결정 | 상위 스코프(렉시컬) 상속 |\n" +
        "| arguments | 있음 | 없음 (rest 파라미터 사용) |\n" +
        "| new 연산자 | 사용 가능 | 사용 불가 (TypeError) |\n" +
        "| prototype | 있음 | 없음 |\n" +
        "| 메서드 정의 | 권장 | 비권장 |\n" +
        "| 콜백 함수 | 가능 | 권장 |\n\n" +
        "**언제 화살표 함수를 쓸까?**\n" +
        "- 콜백 함수: filter, map, setTimeout, addEventListener(this 불필요 시)\n" +
        "- 간단한 유틸 함수: `const double = x => x * 2`\n" +
        "- 클래스 메서드 내부의 중첩 콜백\n\n" +
        "**언제 일반 함수를 쓸까?**\n" +
        "- 객체 메서드 정의 (this가 그 객체를 가리켜야 할 때)\n" +
        "- 생성자 함수\n" +
        "- arguments 객체가 필요한 경우\n" +
        "- 이벤트 핸들러에서 `this`가 이벤트 타겟이어야 할 때\n\n" +
        "**다음 챕터 미리보기:** 스코프와 클로저를 깊이 탐구하면서, 화살표 함수의 렉시컬 this가 어떤 원리로 동작하는지 완전히 이해합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "화살표 함수는 자신만의 this를 갖지 않고 상위 스코프의 this를 그대로 캡처한다. 콜백에는 화살표 함수, 메서드에는 일반 함수를 쓴다.",
  checklist: [
    "화살표 함수의 4가지 문법 단축 규칙을 설명할 수 있다",
    "화살표 함수의 this가 렉시컬 스코프에서 결정됨을 설명할 수 있다",
    "화살표 함수에서 arguments를 사용할 수 없어 나머지 매개변수를 써야 함을 안다",
    "화살표 함수를 new로 생성자 호출하면 TypeError가 발생함을 안다",
    "객체 메서드에 화살표 함수를 쓰면 안 되는 이유를 설명할 수 있다",
    "call/bind로 화살표 함수의 this를 바꿀 수 없음을 안다",
    "화살표 함수가 적합한 상황과 일반 함수가 적합한 상황을 구분할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "화살표 함수의 this에 대한 설명으로 옳은 것은?",
      choices: [
        "호출 방식에 따라 동적으로 결정된다",
        "항상 전역 객체(window)를 가리킨다",
        "함수가 정의된 시점의 상위 스코프 this를 사용한다",
        "bind()로 언제든지 변경할 수 있다",
      ],
      correctIndex: 2,
      explanation:
        "화살표 함수는 자체 this를 바인딩하지 않습니다. 함수가 정의된 위치(렉시컬 스코프)의 this를 그대로 사용합니다. call/apply/bind로도 변경할 수 없습니다.",
    },
    {
      id: "q2",
      question: "다음 코드의 출력 결과는?\n\nconst obj = {\n  name: 'Alice',\n  greet: () => `Hello, ${this?.name}`\n};\nconsole.log(obj.greet());",
      choices: ["Hello, Alice", "Hello, undefined", "TypeError", "Hello, obj"],
      correctIndex: 1,
      explanation:
        "객체 리터럴의 화살표 함수 메서드는 객체가 아닌 상위 스코프(모듈/전역)의 this를 사용합니다. 전역 스코프의 this.name은 undefined이므로 'Hello, undefined'가 출력됩니다.",
    },
    {
      id: "q3",
      question: "화살표 함수에서 여러 인자를 받을 때 올바른 방법은?",
      choices: [
        "arguments 객체를 사용한다",
        "나머지 매개변수(...args)를 사용한다",
        "화살표 함수는 여러 인자를 받을 수 없다",
        "Array.from(arguments)를 사용한다",
      ],
      correctIndex: 1,
      explanation:
        "화살표 함수에는 arguments 객체가 없습니다. 가변 인자를 받으려면 나머지 매개변수(rest parameters) 문법인 ...args를 사용해야 합니다.",
    },
    {
      id: "q4",
      question: "const Fn = () => {}; new Fn()을 실행하면?",
      choices: ["빈 객체 {}가 반환된다", "null이 반환된다", "TypeError: Fn is not a constructor", "SyntaxError"],
      correctIndex: 2,
      explanation:
        "화살표 함수에는 [[Construct]] 내부 메서드와 prototype 프로퍼티가 없어 생성자로 사용할 수 없습니다. new 키워드로 호출하면 TypeError가 발생합니다.",
    },
    {
      id: "q5",
      question: "다음 중 화살표 함수를 사용하기에 가장 적합한 경우는?",
      choices: [
        "DOM 이벤트 핸들러에서 this가 이벤트 발생 요소여야 할 때",
        "Array.prototype.map의 콜백 함수",
        "생성자 함수로 객체를 만들 때",
        "객체 리터럴의 메서드 정의",
      ],
      correctIndex: 1,
      explanation:
        "화살표 함수는 this가 필요 없는 콜백에 가장 적합합니다. Array.prototype.map의 콜백은 this를 사용하지 않는 경우가 대부분이므로 화살표 함수가 이상적입니다.",
    },
    {
      id: "q6",
      question: "화살표 함수에서 객체 리터럴을 직접 반환할 때 올바른 문법은?",
      choices: [
        "x => { id: x }",
        "x => return { id: x }",
        "x => ({ id: x })",
        "x -> ({ id: x })",
      ],
      correctIndex: 2,
      explanation:
        "화살표 함수에서 중괄호 {}는 함수 본문으로 해석됩니다. 객체 리터럴을 직접 반환하려면 소괄호 ()로 감싸야 합니다: x => ({ id: x }).",
    },
    {
      id: "q7",
      question: "화살표 함수와 일반 함수의 prototype 프로퍼티 차이는?",
      choices: [
        "화살표 함수는 prototype이 null이다",
        "화살표 함수는 prototype 프로퍼티 자체가 없다",
        "둘 다 prototype이 있다",
        "일반 함수만 prototype.constructor가 있다",
      ],
      correctIndex: 1,
      explanation:
        "화살표 함수는 생성자로 사용할 수 없으므로 prototype 프로퍼티 자체가 존재하지 않습니다. 일반 함수는 생성 시 자동으로 prototype 프로퍼티가 만들어집니다.",
    },
  ],
};

export default chapter;
