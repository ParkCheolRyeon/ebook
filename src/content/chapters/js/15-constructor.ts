import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "15-constructor",
  subject: "js",
  title: "생성자 함수와 new",
  description: "new 연산자의 내부 동작, 인스턴스 생성 과정, new.target, 그리고 빌트인 생성자 함수를 깊이 이해합니다.",
  order: 15,
  group: "this와 객체",
  prerequisites: ["14-this-binding"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "생성자 함수는 **공장의 금형(틀)**과 같습니다.\n\n" +
        "자동차 공장에서는 하나의 금형으로 동일한 모양의 자동차를 계속 찍어냅니다. " +
        "각각의 자동차(인스턴스)는 같은 구조를 갖지만 독립적인 존재로, " +
        "한 차의 색을 바꿔도 다른 차에 영향을 주지 않습니다.\n\n" +
        "`new` 연산자는 금형을 가동하는 버튼입니다. 버튼을 누르면:\n" +
        "1. 빈 금속판(빈 객체)을 준비합니다\n" +
        "2. 금형(생성자 함수)을 적용해 형태를 만듭니다\n" +
        "3. 완성된 자동차(인스턴스)를 출고합니다\n\n" +
        "**new.target**은 금형이 제대로 된 공장 라인에서 사용되고 있는지 확인하는 센서입니다. " +
        "new 없이 금형을 직접 조작하려 하면 경고를 발생시킵니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "동일한 구조를 가진 객체를 여러 개 만들어야 할 때, 객체 리터럴을 반복하는 방식은 비효율적입니다.\n\n" +
        "```\n" +
        "const user1 = { name: 'Alice', age: 30 };\n" +
        "const user2 = { name: 'Bob',   age: 25 };\n" +
        "const user3 = { name: 'Carol', age: 28 };\n" +
        "```\n\n" +
        "이 방식의 문제점:\n" +
        "1. **코드 중복** — 동일한 구조를 반복 작성\n" +
        "2. **변경 어려움** — 구조를 바꾸려면 모든 리터럴을 수정\n" +
        "3. **메서드 중복** — 각 객체가 동일한 메서드 함수를 별도로 가짐 (메모리 낭비)\n" +
        "4. **실수 위험** — new 없이 생성자를 호출하면 this가 전역을 오염",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "**생성자 함수(Constructor Function)**는 동일한 구조의 객체를 찍어내는 틀 역할을 합니다.\n\n" +
        "### 관례\n" +
        "- 파스칼 케이스(대문자 시작)로 명명: `function User() {}`\n" +
        "- 반드시 `new`와 함께 호출\n" +
        "- 명시적 `return` 없이 `this`가 자동 반환\n\n" +
        "### new 연산자 5단계 동작\n" +
        "1. **빈 객체 생성** — `Object.create(Constructor.prototype)`\n" +
        "2. **this 바인딩** — 새 객체를 생성자 함수의 this로 설정\n" +
        "3. **함수 실행** — 생성자 코드 실행, this에 프로퍼티 추가\n" +
        "4. **반환값 처리** — 생성자가 객체를 명시적으로 반환하면 그것을 반환, 아니면 this 반환\n" +
        "5. **프로토타입 연결** — 인스턴스의 `[[Prototype]]`이 `Constructor.prototype`을 가리킴\n\n" +
        "### new.target\n" +
        "생성자 함수 내부에서 `new.target`은 new로 호출되면 함수 자신을, " +
        "일반 호출이면 `undefined`를 반환합니다. 이를 이용해 new 없는 호출을 방어할 수 있습니다.\n\n" +
        "### 빌트인 생성자\n" +
        "`Object`, `Array`, `Function`, `RegExp`, `Date`, `Promise` 등이 있습니다. " +
        "원시값 래퍼(`Number`, `String`, `Boolean`)는 new 없이 쓰면 타입 변환 함수로 동작합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: new 연산자의 내부 동작",
      content:
        "new Fn(...args) 호출 시 JS 엔진의 내부 처리를 의사코드로 표현합니다.",
      code: {
        language: "typescript",
        code:
          "// new 연산자의 내부 동작 (의사코드)\n" +
          "function simulateNew(Constructor, ...args) {\n" +
          "  // 1단계: 빈 객체 생성 + 프로토타입 연결\n" +
          "  const instance = Object.create(Constructor.prototype);\n" +
          "\n" +
          "  // 2~3단계: 생성자 실행 (this = instance)\n" +
          "  const result = Constructor.apply(instance, args);\n" +
          "\n" +
          "  // 4단계: 반환값 처리\n" +
          "  // 생성자가 명시적으로 '객체'를 반환하면 그것을, 아니면 instance 반환\n" +
          "  return (typeof result === 'object' && result !== null)\n" +
          "    ? result\n" +
          "    : instance;\n" +
          "}\n" +
          "\n" +
          "// === 생성자 함수 정의 ===\n" +
          "function User(name, age) {\n" +
          "  this.name = name;\n" +
          "  this.age = age;\n" +
          "  // 암묵적 return this;\n" +
          "}\n" +
          "\n" +
          "const alice = new User('Alice', 30);\n" +
          "// 내부적으로: simulateNew(User, 'Alice', 30) 과 동일\n" +
          "\n" +
          "// === new.target 방어 코드 ===\n" +
          "function SafeUser(name) {\n" +
          "  if (!new.target) {\n" +
          "    // new 없이 호출 시 자동으로 new 적용\n" +
          "    return new SafeUser(name);\n" +
          "  }\n" +
          "  this.name = name;\n" +
          "}\n" +
          "\n" +
          "const u1 = new SafeUser('Bob');   // 정상\n" +
          "const u2 = SafeUser('Carol');     // new 없어도 안전",
        description: "new의 4단계를 직접 구현해보면 인스턴스 생성 메커니즘과 프로토타입 연결을 구체적으로 이해할 수 있습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 팩토리 패턴과 생성자 함수 비교",
      content:
        "동일한 기능을 팩토리 함수와 생성자 함수로 각각 구현하여 차이점을 확인합니다.",
      code: {
        language: "javascript",
        code:
          "// ① 팩토리 함수 — 매 호출마다 메서드 함수 객체 새로 생성\n" +
          "function createCircle(radius) {\n" +
          "  return {\n" +
          "    radius,\n" +
          "    area() { return Math.PI * this.radius ** 2; },\n" +
          "  };\n" +
          "}\n" +
          "const c1 = createCircle(5);\n" +
          "const c2 = createCircle(10);\n" +
          "console.log(c1.area === c2.area); // false — 다른 함수 객체\n" +
          "\n" +
          "// ② 생성자 함수 — 프로토타입으로 메서드 공유 (메모리 효율)\n" +
          "function Circle(radius) {\n" +
          "  this.radius = radius;\n" +
          "}\n" +
          "Circle.prototype.area = function() {\n" +
          "  return Math.PI * this.radius ** 2;\n" +
          "};\n" +
          "const c3 = new Circle(5);\n" +
          "const c4 = new Circle(10);\n" +
          "console.log(c3.area === c4.area); // true — 같은 함수 공유\n" +
          "\n" +
          "// instanceof 확인\n" +
          "console.log(c3 instanceof Circle); // true\n" +
          "console.log(c1 instanceof Object); // true (모든 객체)\n" +
          "\n" +
          "// 빌트인 생성자\n" +
          "const arr = new Array(3);       // [empty × 3]\n" +
          "const re = new RegExp('\\\\d+'); // /\\d+/\n" +
          "const now = new Date();          // 현재 날짜\n" +
          "\n" +
          "// Number: new 유무에 따라 동작 다름\n" +
          "console.log(typeof Number('42'));     // 'number' — 형변환\n" +
          "console.log(typeof new Number('42')); // 'object' — 래퍼 객체",
        description: "생성자 함수는 프로토타입을 통해 메서드를 공유하므로 인스턴스를 대량 생성할 때 메모리 효율이 높습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 항목 | 내용 |\n" +
        "|------|------|\n" +
        "| 관례 | 파스칼 케이스 명명, new와 함께 호출 |\n" +
        "| new 1단계 | 빈 객체 생성 + 프로토타입 연결 |\n" +
        "| new 2~3단계 | this 바인딩 후 함수 실행 |\n" +
        "| new 4단계 | 객체 반환(명시) 또는 this 반환(암묵) |\n" +
        "| new.target | new 호출 여부 감지 |\n" +
        "| 빌트인 생성자 | Object, Array, Date, RegExp 등 |\n\n" +
        "**핵심:** `new`는 빈 객체 생성 → this 바인딩 → 실행 → 반환의 4단계를 자동화합니다. " +
        "생성자 함수는 프로토타입으로 메서드를 공유할 수 있어 팩토리 함수보다 메모리 효율적입니다.\n\n" +
        "**다음 챕터 미리보기:** 프로토타입이 실제로 어떻게 구성되어 있고, " +
        "`__proto__`와 `prototype` 프로퍼티가 어떻게 다른지 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "생성자 함수는 new 키워드와 함께 호출되어 새 객체를 만들고 this를 바인딩한 뒤 반환한다. ES6 class 이전에 객체를 찍어내는 공장 역할을 했다.",
  checklist: [
    "생성자 함수의 관례(파스칼 케이스, new 호출)를 설명할 수 있다",
    "new 연산자의 4단계 동작을 순서대로 설명할 수 있다",
    "new.target으로 new 없는 호출을 방어하는 코드를 작성할 수 있다",
    "팩토리 함수와 생성자 함수의 차이를 메모리 관점에서 설명할 수 있다",
    "빌트인 생성자 함수를 new 유무에 따라 올바르게 사용할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "new 연산자가 가장 먼저 하는 일은?",
      choices: [
        "생성자 함수의 prototype을 복사한다",
        "빈 객체를 생성하고 생성자의 prototype을 [[Prototype]]으로 연결한다",
        "생성자 함수를 즉시 실행한다",
        "this를 전역 객체로 설정한다",
      ],
      correctIndex: 1,
      explanation:
        "new의 첫 단계는 Object.create(Constructor.prototype)과 동일하게 " +
        "빈 객체를 만들고 그것의 [[Prototype]]을 생성자의 prototype 객체로 설정합니다.",
    },
    {
      id: "q2",
      question: "생성자 함수에서 명시적으로 원시값을 return하면?",
      choices: [
        "원시값이 그대로 반환된다",
        "원시값은 무시되고 this(인스턴스)가 반환된다",
        "TypeError가 발생한다",
        "undefined가 반환된다",
      ],
      correctIndex: 1,
      explanation:
        "생성자 함수에서 명시적으로 '객체'를 반환하면 그 객체가 반환되지만, " +
        "원시값을 반환하면 무시되고 암묵적으로 this가 반환됩니다.",
    },
    {
      id: "q3",
      question: "new.target이 undefined인 상황은?",
      choices: [
        "new로 생성자를 호출했을 때",
        "생성자 함수를 일반 함수로 호출했을 때",
        "화살표 함수 안에서 접근했을 때",
        "b와 c 모두",
      ],
      correctIndex: 3,
      explanation:
        "new.target은 new로 호출된 함수를 가리키며, 일반 함수 호출 시 undefined입니다. " +
        "화살표 함수는 new.target을 가질 수 없어 외부 함수의 new.target을 따릅니다.",
    },
    {
      id: "q4",
      question: "Number('42')와 new Number('42')의 차이는?",
      choices: [
        "결과가 동일하다",
        "Number('42')는 원시 숫자, new Number('42')는 Number 래퍼 객체",
        "new Number('42')가 더 빠르다",
        "Number('42')는 NaN을 반환한다",
      ],
      correctIndex: 1,
      explanation:
        "new 없이 호출한 Number()는 원시 숫자로 형변환하는 함수로 동작하여 number 타입을 반환합니다. " +
        "new Number()는 Number 래퍼 객체(object 타입)를 생성합니다. " +
        "대부분의 경우 래퍼 객체는 불필요하므로 new 없이 사용합니다.",
    },
    {
      id: "q5",
      question: "생성자 함수와 팩토리 함수의 메모리 효율 차이가 발생하는 이유는?",
      choices: [
        "팩토리 함수는 new를 사용하지 않아서",
        "생성자 함수는 프로토타입을 통해 메서드를 공유하지만, 팩토리 함수는 인스턴스마다 메서드 함수를 새로 생성",
        "팩토리 함수는 클로저를 사용하지 않아서",
        "생성자 함수가 항상 더 빠르다",
      ],
      correctIndex: 1,
      explanation:
        "생성자 함수에서 prototype에 메서드를 정의하면 모든 인스턴스가 하나의 함수 객체를 공유합니다. " +
        "팩토리 함수에서 메서드를 정의하면 호출마다 새 함수 객체가 생성됩니다.",
    },
    {
      id: "q6",
      question: "instanceof 연산자가 확인하는 것은?",
      choices: [
        "인스턴스의 constructor 이름",
        "인스턴스의 typeof 결과",
        "인스턴스의 [[Prototype]] 체인에 생성자의 prototype이 존재하는지",
        "인스턴스가 특정 클래스의 직접 자식인지",
      ],
      correctIndex: 2,
      explanation:
        "instanceof는 프로토타입 체인을 따라가며 생성자의 prototype 객체가 존재하는지 검사합니다. " +
        "따라서 상속 관계에 있는 조상 클래스에 대해서도 true를 반환할 수 있습니다.",
    },
  ],
};

export default chapter;
