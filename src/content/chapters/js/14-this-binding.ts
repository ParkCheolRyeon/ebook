import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "14-this-binding",
  subject: "js",
  title: "this 바인딩",
  description: "호출 방식에 따라 달라지는 this의 동작 원리를 전역·함수·메서드·생성자·명시적 바인딩·화살표 함수 관점에서 완전히 이해합니다.",
  order: 14,
  group: "this와 객체",
  prerequisites: ["13-object-literal"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "**this**는 무대 위 배우가 '나'라고 말할 때 가리키는 사람과 같습니다.\n\n" +
        "같은 대본(함수)이라도 어떤 극단(객체)이 공연하느냐에 따라 '나'가 달라집니다. " +
        "홍길동 역을 맡은 배우가 무대에 오르면 '나는 홍길동'이지만, " +
        "같은 대사를 춘향 역 배우가 말하면 '나는 춘향'이 됩니다.\n\n" +
        "**call/apply/bind**는 감독이 '이 장면에서는 저 배우가 말해'라고 직접 지시하는 것이고, " +
        "**화살표 함수**는 무대 분장실에서 태어나 분장실 담당자가 영원히 '나'로 고정된 보조 배우와 같습니다. " +
        "어느 극단이 불러도 자신이 태어난 분장실(렉시컬 환경)의 this를 그대로 씁니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "자바스크립트의 `this`는 다른 언어와 달리 **선언 시점이 아닌 호출 시점**에 결정됩니다. " +
        "이 동적 바인딩은 유연성을 주지만 예상치 못한 버그의 원인이 됩니다.\n\n" +
        "1. **콜백 함수 안의 this 소실** — 이벤트 리스너나 setTimeout 콜백에서 메서드를 넘기면 this가 전역 또는 undefined\n" +
        "2. **중첩 함수 안의 this** — 메서드 안에 선언한 중첩 함수는 메서드와 다른 this를 가짐\n" +
        "3. **화살표 함수 오남용** — 메서드에 화살표 함수를 쓰면 this가 의도와 다른 외부 스코프를 가리킴\n\n" +
        "this가 언제 무엇을 가리키는지 정확히 알지 못하면, 실행 환경에 따라 버그가 발생합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "this는 **호출 방식 4가지**에 따라 결정됩니다.\n\n" +
        "### 1. 전역 호출\n" +
        "함수를 단독으로 호출하면 strict mode에서는 `undefined`, " +
        "non-strict에서는 전역 객체(브라우저: `window`, Node: `global`).\n\n" +
        "### 2. 메서드 호출\n" +
        "`obj.method()`처럼 점 앞 객체(`obj`)가 this. " +
        "단, 메서드를 변수에 빼내어 호출하면 전역 호출이 됩니다.\n\n" +
        "### 3. 생성자 호출\n" +
        "`new Fn()`으로 호출하면 새로 생성된 인스턴스가 this.\n\n" +
        "### 4. 명시적 바인딩 (call / apply / bind)\n" +
        "- `fn.call(thisArg, ...args)` — 즉시 호출, 인수를 나열\n" +
        "- `fn.apply(thisArg, [args])` — 즉시 호출, 인수를 배열로\n" +
        "- `fn.bind(thisArg)` — 새 함수 반환, 나중에 호출\n\n" +
        "### 화살표 함수\n" +
        "자체 this를 갖지 않고, **정의된 위치의 상위 스코프 this**를 그대로 사용합니다(렉시컬 this). " +
        "call/apply/bind로도 this를 바꿀 수 없습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 호출 방식별 this 결정 과정",
      content:
        "JS 엔진이 함수를 호출할 때 this를 결정하는 의사코드입니다.",
      code: {
        language: "typescript",
        code:
          "// this 결정 알고리즘 (의사코드)\n" +
          "function resolveThis(callSite) {\n" +
          "  if (callSite.isArrowFunction) {\n" +
          "    return callSite.lexicalScopeThis;  // 상위 스코프 this\n" +
          "  }\n" +
          "  if (callSite.hasExplicitBinding) {    // call/apply/bind\n" +
          "    return callSite.boundThis;\n" +
          "  }\n" +
          "  if (callSite.isNewCall) {             // new 연산자\n" +
          "    return callSite.newInstance;\n" +
          "  }\n" +
          "  if (callSite.hasReceiver) {           // obj.method()\n" +
          "    return callSite.receiver;\n" +
          "  }\n" +
          "  // 단순 함수 호출\n" +
          "  return isStrictMode ? undefined : globalThis;\n" +
          "}\n" +
          "\n" +
          "// === 실제 예시 ===\n" +
          "\n" +
          "// 1. 메서드 호출 — this = timer 객체\n" +
          "const timer = {\n" +
          "  count: 0,\n" +
          "  start() { this.count++; },\n" +
          "};\n" +
          "timer.start(); // this → timer\n" +
          "\n" +
          "// 2. 분리된 참조 — this 소실\n" +
          "const fn = timer.start;\n" +
          "fn(); // this → undefined(strict) or window\n" +
          "\n" +
          "// 3. bind로 고정\n" +
          "const bound = timer.start.bind(timer);\n" +
          "bound(); // this → timer (항상)\n" +
          "\n" +
          "// 4. 화살표 함수 — 렉시컬 this\n" +
          "const counter = {\n" +
          "  count: 0,\n" +
          "  increment() {\n" +
          "    // 중첩 함수에서 this 유지 방법\n" +
          "    setTimeout(() => {\n" +
          "      this.count++; // 화살표 함수 → 외부 increment의 this\n" +
          "    }, 1000);\n" +
          "  },\n" +
          "};",
        description: "화살표 함수를 중첩 콜백에서 쓰면 외부 메서드의 this를 자연스럽게 이어받습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 이벤트 핸들러에서의 this 문제 해결",
      content:
        "버튼 클릭 시 카운터를 증가시키는 예제에서 발생하는 this 소실 문제를 세 가지 방식으로 해결합니다.",
      code: {
        language: "javascript",
        code:
          "'use strict';\n" +
          "\n" +
          "// ❌ 문제: 일반 함수를 콜백으로 전달하면 this 소실\n" +
          "class Counter {\n" +
          "  constructor() {\n" +
          "    this.count = 0;\n" +
          "    // 이 방식은 동작하지 않음\n" +
          "    // document.querySelector('button').addEventListener('click', this.inc);\n" +
          "  }\n" +
          "  inc() {\n" +
          "    this.count++; // this가 undefined → TypeError\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// ✅ 해결 1: bind로 this 고정\n" +
          "class Counter1 {\n" +
          "  constructor() {\n" +
          "    this.count = 0;\n" +
          "    this.inc = this.inc.bind(this);\n" +
          "  }\n" +
          "  inc() { this.count++; }\n" +
          "}\n" +
          "\n" +
          "// ✅ 해결 2: 화살표 함수 래퍼\n" +
          "class Counter2 {\n" +
          "  constructor() {\n" +
          "    this.count = 0;\n" +
          "    // button.addEventListener('click', () => this.inc());\n" +
          "  }\n" +
          "  inc() { this.count++; }\n" +
          "}\n" +
          "\n" +
          "// ✅ 해결 3: 클래스 필드 화살표 함수 (최신 문법)\n" +
          "class Counter3 {\n" +
          "  count = 0;\n" +
          "  inc = () => { this.count++; }; // 인스턴스 생성 시 바인딩\n" +
          "}\n" +
          "\n" +
          "// call/apply 활용: 빌린 메서드\n" +
          "function greet(greeting) {\n" +
          "  return `${greeting}, ${this.name}!`;\n" +
          "}\n" +
          "const user = { name: 'Alice' };\n" +
          "console.log(greet.call(user, '안녕'));    // '안녕, Alice!'\n" +
          "console.log(greet.apply(user, ['Hello'])); // 'Hello, Alice!'",
        description: "콜백에 메서드를 전달할 때는 bind, 화살표 래퍼, 또는 클래스 필드 화살표 중 하나를 선택하세요.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 호출 방식 | this |\n" +
        "|-----------|------|\n" +
        "| `fn()` (비엄격) | 전역 객체 |\n" +
        "| `fn()` (엄격) | undefined |\n" +
        "| `obj.fn()` | obj |\n" +
        "| `new Fn()` | 새 인스턴스 |\n" +
        "| `fn.call(x)` | x |\n" +
        "| `fn.apply(x)` | x |\n" +
        "| `fn.bind(x)()` | x (고정) |\n" +
        "| 화살표 함수 | 정의 위치의 상위 this |\n\n" +
        "**핵심 법칙:** this는 함수가 어떻게 선언되었는지가 아니라 **어떻게 호출되었는지**로 결정됩니다. " +
        "단, 화살표 함수만 예외로 렉시컬 this를 사용합니다.\n\n" +
        "**다음 챕터 미리보기:** `new` 연산자가 어떻게 동작하여 인스턴스를 생성하는지, " +
        "생성자 함수의 관례와 내부 동작을 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "this는 함수가 '어떻게 호출되었는지'에 따라 동적으로 결정된다. 일반 호출은 전역, 메서드 호출은 호출 객체, new는 새 인스턴스, bind/call/apply는 명시적 지정이다.",
  checklist: [
    "호출 방식 4가지(전역·메서드·생성자·명시적)에 따른 this를 설명할 수 있다",
    "메서드를 변수에 분리해 호출할 때 this가 소실되는 이유를 설명할 수 있다",
    "call, apply, bind의 차이와 사용 시기를 설명할 수 있다",
    "화살표 함수가 렉시컬 this를 사용하는 원리를 설명할 수 있다",
    "이벤트 핸들러에서 this 소실을 방지하는 세 가지 방법을 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "'use strict' 모드에서 일반 함수를 단독 호출하면 this는?",
      choices: ["window", "null", "undefined", "globalThis"],
      correctIndex: 2,
      explanation:
        "strict mode에서는 함수를 단독 호출(암묵적 전역 바인딩 없이)하면 this가 undefined입니다. " +
        "non-strict에서는 전역 객체(window/global)가 됩니다.",
    },
    {
      id: "q2",
      question: "const fn = obj.method; fn();에서 this는 (strict mode 기준)?",
      choices: ["obj", "window", "undefined", "fn"],
      correctIndex: 2,
      explanation:
        "메서드를 변수에 할당하여 단독 호출하면 '점 앞 객체' 정보가 사라지고 단순 함수 호출이 됩니다. " +
        "strict mode에서 this는 undefined입니다.",
    },
    {
      id: "q3",
      question: "call과 apply의 차이는?",
      choices: [
        "call은 즉시 호출, apply는 새 함수를 반환",
        "call은 인수를 나열하고, apply는 인수를 배열로 전달",
        "apply가 call보다 느리다",
        "call은 this를 바꿀 수 없다",
      ],
      correctIndex: 1,
      explanation:
        "call(thisArg, arg1, arg2)는 인수를 콤마로 나열하고, " +
        "apply(thisArg, [arg1, arg2])는 인수를 배열로 전달합니다. " +
        "둘 다 즉시 호출합니다.",
    },
    {
      id: "q4",
      question: "화살표 함수에서 this는 언제 결정되는가?",
      choices: [
        "함수가 호출될 때",
        "함수가 정의(선언)될 때의 상위 스코프",
        "bind로 명시적으로 지정될 때",
        "new로 생성될 때",
      ],
      correctIndex: 1,
      explanation:
        "화살표 함수는 자체 this 바인딩이 없습니다. 정의된 위치의 상위 스코프 this를 그대로 사용하며, " +
        "이를 렉시컬 this라고 합니다. call/apply/bind로도 변경할 수 없습니다.",
    },
    {
      id: "q5",
      question: "fn.bind(obj)가 반환하는 것은?",
      choices: [
        "fn을 obj로 호출한 결과값",
        "obj",
        "this가 obj로 고정된 새 함수",
        "undefined",
      ],
      correctIndex: 2,
      explanation:
        "bind는 this가 영구적으로 고정된 새 함수를 반환합니다. 즉시 호출하지 않습니다. " +
        "반환된 함수는 나중에 언제 어떻게 호출해도 this가 obj로 유지됩니다.",
    },
    {
      id: "q6",
      question: "다음 중 화살표 함수를 객체 메서드로 사용할 때의 문제점은?",
      choices: [
        "화살표 함수는 arguments 객체가 없다",
        "화살표 함수의 this가 객체가 아닌 정의 위치의 상위 스코프를 가리킨다",
        "화살표 함수는 프로퍼티를 수정할 수 없다",
        "화살표 함수는 재귀 호출이 불가능하다",
      ],
      correctIndex: 1,
      explanation:
        "객체 리터럴 안에서 화살표 함수로 메서드를 정의하면, this가 객체가 아닌 " +
        "객체를 감싸는 외부 스코프(대부분 전역)를 가리킵니다. " +
        "따라서 this.property에 접근할 때 의도와 다른 결과가 나옵니다.",
    },
    {
      id: "q7",
      question: "new Counter()로 생성자를 호출할 때 내부 this는?",
      choices: [
        "Counter 함수 자체",
        "전역 객체",
        "새로 생성된 빈 객체(나중에 반환될 인스턴스)",
        "undefined",
      ],
      correctIndex: 2,
      explanation:
        "new 연산자는 빈 객체를 생성하고 그것을 this로 바인딩합니다. " +
        "생성자 함수 내부에서 this에 프로퍼티를 추가하면 새 인스턴스에 할당됩니다. " +
        "함수 실행 후 this가 자동으로 반환됩니다.",
    },
    {
      id: "q8",
      question: "타이머 콜백 안에서 외부 메서드의 this를 유지하는 가장 간결한 방법은?",
      choices: [
        "var self = this를 미리 저장",
        "일반 함수 사용",
        "화살표 함수 사용",
        "arguments.callee 사용",
      ],
      correctIndex: 2,
      explanation:
        "화살표 함수는 렉시컬 this를 사용하므로, 외부 메서드의 this를 자연스럽게 이어받습니다. " +
        "ES6 이전에는 `var self = this`로 저장하는 패턴을 사용했으나, 화살표 함수가 도입된 후에는 불필요합니다.",
    },
  ],
};

export default chapter;
