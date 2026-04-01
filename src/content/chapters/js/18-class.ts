import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "18-class",
  subject: "js",
  title: "클래스",
  description: "ES6 class 문법, constructor, 메서드, 접근자 프로퍼티, static, extends/super 상속, 클래스 필드, private # 을 완전히 이해합니다.",
  order: 18,
  group: "this와 객체",
  prerequisites: ["17-prototype-chain"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "ES6 class는 **공장 설계 도면 + 제어판**이라고 생각하면 됩니다.\n\n" +
        "이전에는 금형(생성자 함수)을 만들고, 창고(prototype)에 도구를 따로 가져다 놓고, " +
        "상속 연결을 수작업으로 배선해야 했습니다.\n\n" +
        "class는 설계 도면과 제어판을 하나로 통합한 것입니다. " +
        "`constructor`는 라인 가동 설정, 인스턴스 메서드는 각 제품에 달린 버튼, " +
        "`static`은 공장 전체에 하나만 있는 관리자 버튼입니다.\n\n" +
        "**`extends`**는 기존 도면을 기반으로 업그레이드 도면을 만드는 것이고, " +
        "**`super`**는 원본 도면의 부품을 가져와 쓰는 호출입니다.\n\n" +
        "**`#privateField`**는 공장 내부에만 있는 잠긴 캐비넷으로, " +
        "외부에서는 절대 접근할 수 없는 기밀 데이터입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "ES5 스타일 프로토타입 상속은 강력하지만 장황하고 실수하기 쉽습니다.\n\n" +
        "```\n" +
        "// ES5 상속 — 4가지 단계를 직접 처리해야 함\n" +
        "function Dog(name) { Animal.call(this, name); }\n" +
        "Dog.prototype = Object.create(Animal.prototype);\n" +
        "Dog.prototype.constructor = Dog;\n" +
        "Dog.prototype.bark = function() { ... };\n" +
        "```\n\n" +
        "1. **장황한 문법** — 상속 설정에 4줄 이상 필요\n" +
        "2. **constructor 복구 누락** — 실수로 빠뜨리기 쉬움\n" +
        "3. **super 메서드 호출** — 부모 메서드 호출이 번거로움\n" +
        "4. **캡슐화 부재** — 진정한 private 없이 `_prefix` 관례에만 의존\n\n" +
        "이런 복잡성을 줄이고 다른 OOP 언어 개발자도 쉽게 읽을 수 있는 문법이 필요했습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "ES6 class는 프로토타입 기반 상속의 **문법적 설탕(syntactic sugar)**입니다. " +
        "내부적으로는 여전히 프로토타입을 사용하지만 읽고 쓰기가 훨씬 쉽습니다.\n\n" +
        "### 기본 구조\n" +
        "- `constructor` — 인스턴스 생성 시 실행, 없으면 빈 constructor 자동 생성\n" +
        "- 인스턴스 메서드 — `prototype`에 자동 정의\n" +
        "- `static` 메서드/필드 — 클래스 자체에 속함, 인스턴스에서 접근 불가\n\n" +
        "### 접근자 프로퍼티\n" +
        "`get`/`set` 키워드로 getter/setter 정의. prototype에 추가됩니다.\n\n" +
        "### 클래스 필드\n" +
        "constructor 밖에서 직접 선언(`field = value`). 인스턴스 프로퍼티로 추가됩니다.\n\n" +
        "### private 필드 (#)\n" +
        "`#field` 선언으로 클래스 외부에서 완전히 차단되는 진짜 private 구현.\n\n" +
        "### extends / super\n" +
        "- `extends`로 부모 클래스 상속\n" +
        "- `super()`로 부모 constructor 호출 (자식 constructor에서 this 사용 전 필수)\n" +
        "- `super.method()`로 부모 메서드 호출",
    },
    {
      type: "pseudocode",
      title: "기술 구현: class의 내부 프로토타입 구조",
      content:
        "class 문법이 컴파일될 때 어떤 프로토타입 구조가 만들어지는지 의사코드로 비교합니다.",
      code: {
        language: "typescript",
        code:
          "// === class 문법 ===\n" +
          "class Animal {\n" +
          "  #name;                        // private 필드\n" +
          "  static count = 0;             // static 필드\n" +
          "\n" +
          "  constructor(name) {\n" +
          "    this.#name = name;\n" +
          "    Animal.count++;\n" +
          "  }\n" +
          "\n" +
          "  get name() { return this.#name; }           // getter\n" +
          "  set name(v) { this.#name = v; }             // setter\n" +
          "\n" +
          "  speak() { return `${this.#name}이 소리를 냄`; } // 인스턴스 메서드\n" +
          "  static create(name) { return new Animal(name); } // static 메서드\n" +
          "}\n" +
          "\n" +
          "// === 내부적으로 동일한 프로토타입 구조 ===\n" +
          "// (엔진이 변환하는 의사코드)\n" +
          "function Animal(name) {\n" +
          "  // #name은 WeakMap으로 구현 (외부 접근 불가)\n" +
          "  _private.set(this, { name });\n" +
          "  Animal.count++;\n" +
          "}\n" +
          "Animal.count = 0;\n" +
          "Animal.create = function(name) { return new Animal(name); };\n" +
          "Object.defineProperty(Animal.prototype, 'name', {\n" +
          "  get() { return _private.get(this).name; },\n" +
          "  set(v) { _private.get(this).name = v; },\n" +
          "});\n" +
          "Animal.prototype.speak = function() { ... };\n" +
          "\n" +
          "// === extends / super ===\n" +
          "class Dog extends Animal {\n" +
          "  #breed;\n" +
          "  constructor(name, breed) {\n" +
          "    super(name);        // Animal constructor 호출 (this 사용 전 필수)\n" +
          "    this.#breed = breed;\n" +
          "  }\n" +
          "  speak() {\n" +
          "    return super.speak() + ' (멍멍!)';\n" +
          "  }\n" +
          "}",
        description: "class는 프로토타입 상속의 문법적 설탕이지만, #private 필드는 진정한 캡슐화를 제공하는 새 기능입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 은행 계좌 시스템 (캡슐화 + 상속)",
      content:
        "private 필드로 잔액을 보호하고, extends로 특수 계좌를 구현하는 현실적인 예제입니다.",
      code: {
        language: "javascript",
        code:
          "class BankAccount {\n" +
          "  #balance;                    // private: 외부에서 직접 수정 불가\n" +
          "  #owner;\n" +
          "  static #totalAccounts = 0;  // static private\n" +
          "\n" +
          "  constructor(owner, initialBalance = 0) {\n" +
          "    this.#owner = owner;\n" +
          "    this.#balance = initialBalance;\n" +
          "    BankAccount.#totalAccounts++;\n" +
          "  }\n" +
          "\n" +
          "  get balance() { return this.#balance; }  // 읽기 전용 접근\n" +
          "  get owner() { return this.#owner; }\n" +
          "\n" +
          "  deposit(amount) {\n" +
          "    if (amount <= 0) throw new Error('입금액은 0보다 커야 합니다.');\n" +
          "    this.#balance += amount;\n" +
          "    return this;\n" +
          "  }\n" +
          "\n" +
          "  withdraw(amount) {\n" +
          "    if (amount > this.#balance) throw new Error('잔액 부족');\n" +
          "    this.#balance -= amount;\n" +
          "    return this;\n" +
          "  }\n" +
          "\n" +
          "  static getTotalAccounts() { return BankAccount.#totalAccounts; }\n" +
          "}\n" +
          "\n" +
          "class SavingsAccount extends BankAccount {\n" +
          "  #interestRate;\n" +
          "\n" +
          "  constructor(owner, initial, rate) {\n" +
          "    super(owner, initial);     // 부모 constructor\n" +
          "    this.#interestRate = rate;\n" +
          "  }\n" +
          "\n" +
          "  addInterest() {\n" +
          "    const interest = this.balance * this.#interestRate;\n" +
          "    return this.deposit(interest);\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "const acc = new BankAccount('Alice', 1000);\n" +
          "acc.deposit(500).withdraw(200);\n" +
          "console.log(acc.balance);  // 1300\n" +
          "// acc.#balance = 9999;   // SyntaxError: private 필드\n" +
          "\n" +
          "const savings = new SavingsAccount('Bob', 10000, 0.05);\n" +
          "savings.addInterest();\n" +
          "console.log(savings.balance);  // 10500\n" +
          "console.log(savings instanceof BankAccount); // true\n" +
          "console.log(BankAccount.getTotalAccounts()); // 2",
        description: "private 필드로 불변 규칙을 강제하고, 메서드 체이닝(return this)으로 가독성 높은 API를 설계할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 문법 | 위치 | 설명 |\n" +
        "|------|------|------|\n" +
        "| `constructor` | 클래스 | 인스턴스 초기화 |\n" +
        "| 인스턴스 메서드 | `prototype` | 모든 인스턴스 공유 |\n" +
        "| `static` | 클래스 자체 | 인스턴스 없이 호출 |\n" +
        "| `get`/`set` | `prototype` | 접근자 프로퍼티 |\n" +
        "| 클래스 필드 | 인스턴스 | constructor 밖 선언 |\n" +
        "| `#field` | 인스턴스/클래스 | 진정한 private |\n" +
        "| `extends` | 클래스 선언 | 프로토타입 체인 상속 |\n" +
        "| `super()` | 자식 constructor | 부모 초기화 (필수) |\n" +
        "| `super.method()` | 자식 메서드 | 부모 메서드 호출 |\n\n" +
        "**핵심:** class는 프로토타입 기반 상속을 감싸는 문법적 설탕이지만, " +
        "#private 필드는 실질적인 캡슐화라는 새 기능을 더합니다. " +
        "class를 사용해도 프로토타입 체인 지식은 여전히 디버깅과 고급 패턴에 필수입니다.\n\n" +
        "이 챕터로 **'this와 객체' 그룹**이 완성됩니다. " +
        "객체 리터럴 → this 바인딩 → 생성자 → 프로토타입 → 체인 → class까지 " +
        "자바스크립트 객체 시스템의 전 스펙트럼을 익혔습니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "class는 프로토타입 기반 상속의 문법적 설탕이다. 내부적으로는 생성자 함수 + prototype 체인과 동일하지만, 더 명확하고 안전한 문법을 제공한다.",
  checklist: [
    "class의 constructor, 인스턴스 메서드, static의 차이를 설명할 수 있다",
    "get/set으로 접근자 프로퍼티를 정의하고 사용할 수 있다",
    "#private 필드가 기존 _prefix 관례와 다른 점을 설명할 수 있다",
    "extends와 super로 부모 클래스를 상속하는 코드를 작성할 수 있다",
    "자식 constructor에서 super()를 반드시 먼저 호출해야 하는 이유를 설명할 수 있다",
    "class가 프로토타입 기반 상속의 문법적 설탕임을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "class의 인스턴스 메서드는 내부적으로 어디에 정의되는가?",
      choices: [
        "인스턴스 자체의 프로퍼티",
        "클래스의 static 프로퍼티",
        "클래스의 prototype 객체",
        "전역 객체",
      ],
      correctIndex: 2,
      explanation:
        "class 내부의 인스턴스 메서드는 Constructor.prototype에 정의됩니다. " +
        "따라서 모든 인스턴스가 하나의 함수 객체를 공유하며, " +
        "이는 ES5 생성자 함수에서 prototype에 직접 메서드를 추가하는 것과 동일합니다.",
    },
    {
      id: "q2",
      question: "static 메서드를 인스턴스에서 호출하면?",
      choices: [
        "정상 실행된다",
        "TypeError: method is not a function",
        "undefined를 반환한다",
        "클래스 자체를 this로 사용하여 실행된다",
      ],
      correctIndex: 1,
      explanation:
        "static 메서드는 클래스 자체의 프로퍼티로 정의되며 prototype에는 추가되지 않습니다. " +
        "인스턴스에서 접근하면 해당 이름이 undefined이므로 호출 시 TypeError가 발생합니다.",
    },
    {
      id: "q3",
      question: "자식 class의 constructor에서 super()를 호출하기 전에 this를 사용하면?",
      choices: [
        "정상 동작한다",
        "ReferenceError: Must call super constructor before accessing 'this'",
        "undefined를 반환한다",
        "부모의 this가 사용된다",
      ],
      correctIndex: 1,
      explanation:
        "파생 클래스(extends 사용)의 constructor에서는 super()가 완료될 때까지 this가 초기화되지 않습니다. " +
        "super() 호출 전에 this를 사용하면 ReferenceError가 발생합니다.",
    },
    {
      id: "q4",
      question: "#privateField에 클래스 외부에서 접근하면?",
      choices: [
        "undefined를 반환한다",
        "null을 반환한다",
        "SyntaxError가 발생한다",
        "접근할 수 있지만 값이 다를 수 있다",
      ],
      correctIndex: 2,
      explanation:
        "private 필드(#)는 언어 수준에서 클래스 외부 접근을 차단합니다. " +
        "파싱 단계에서 SyntaxError가 발생하므로 런타임 전에 이미 오류입니다. " +
        "이는 _prefix 관례(접근 가능하지만 하지 말자)와 근본적으로 다릅니다.",
    },
    {
      id: "q5",
      question: "클래스 필드(class field)와 constructor 안 this.prop = ...의 차이는?",
      choices: [
        "클래스 필드는 prototype에, constructor는 인스턴스에 저장된다",
        "클래스 필드는 constructor보다 먼저 실행되어 인스턴스에 직접 저장된다",
        "클래스 필드는 상속되지 않는다",
        "차이가 없다",
      ],
      correctIndex: 1,
      explanation:
        "클래스 필드는 인스턴스 프로퍼티로 저장되며, constructor 코드보다 먼저 초기화됩니다. " +
        "기능적으로는 constructor의 this.prop = defaultValue와 동일하지만, " +
        "기본값 선언을 constructor 밖에서 명시적으로 할 수 있어 가독성이 높습니다.",
    },
    {
      id: "q6",
      question: "super.method()는 어느 객체의 메서드를 호출하는가?",
      choices: [
        "자식 클래스의 prototype",
        "부모 클래스의 prototype",
        "Object.prototype",
        "현재 인스턴스",
      ],
      correctIndex: 1,
      explanation:
        "super.method()는 부모 클래스의 prototype에 정의된 메서드를 호출합니다. " +
        "단, 실행 컨텍스트의 this는 현재 인스턴스를 그대로 유지합니다.",
    },
    {
      id: "q7",
      question: "class Animal {}로 정의한 Animal을 new 없이 호출하면?",
      choices: [
        "전역 객체가 반환된다",
        "undefined가 반환된다",
        "TypeError: Class constructor Animal cannot be invoked without 'new'",
        "빈 객체가 반환된다",
      ],
      correctIndex: 2,
      explanation:
        "class는 내부적으로 [[IsConstructor]] 플래그가 설정되어 new 없이 호출하면 " +
        "TypeError를 발생시킵니다. 이는 생성자 함수를 일반 호출할 수 있었던 ES5와의 주요 차이점입니다.",
    },
    {
      id: "q8",
      question: "class가 프로토타입 기반 상속의 '문법적 설탕'이라는 의미는?",
      choices: [
        "class는 완전히 새로운 상속 메커니즘이다",
        "class 문법이 내부적으로는 프로토타입 체인을 그대로 사용한다",
        "class는 프로토타입보다 빠르다",
        "class를 쓰면 프로토타입 개념이 필요 없다",
      ],
      correctIndex: 1,
      explanation:
        "class 문법은 기존 프로토타입 기반 상속을 더 읽기 쉬운 문법으로 표현한 것입니다. " +
        "런타임에는 여전히 prototype 객체와 [[Prototype]] 체인이 그대로 사용됩니다. " +
        "#private 필드만 프로토타입 시스템에 없던 진짜 새 기능입니다.",
    },
  ],
};

export default chapter;
