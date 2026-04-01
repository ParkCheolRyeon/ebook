import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-02",
  title: "중간 점검 2: this와 객체",
  coverGroups: ["this와 객체"],
  questions: [
    {
      id: "mid02-q1",
      question:
        "다음 코드의 출력 결과는?\n\nconst obj = {\n  name: 'A',\n  getName: function() {\n    return this.name;\n  }\n};\nconst fn = obj.getName;\nconsole.log(fn());",
      choices: ["'A'", "undefined", "TypeError", "''"],
      correctIndex: 1,
      explanation:
        "fn()은 일반 함수 호출이므로 this는 전역 객체(strict mode에서는 undefined)를 가리킵니다. 전역에 name이 없으므로 undefined가 출력됩니다.",
    },
    {
      id: "mid02-q2",
      question:
        "다음 중 this 바인딩 우선순위가 가장 높은 것은?",
      choices: [
        "기본 바인딩(전역)",
        "암시적 바인딩(메서드 호출)",
        "명시적 바인딩(call/apply/bind)",
        "new 바인딩(생성자 호출)",
      ],
      correctIndex: 3,
      explanation:
        "this 바인딩 우선순위는 new > 명시적(call/apply/bind) > 암시적(메서드) > 기본(전역) 순서입니다.",
    },
    {
      id: "mid02-q3",
      question:
        "다음 코드의 출력 결과는?\n\nconst obj = {\n  value: 42,\n  getValue: () => this.value\n};\nconsole.log(obj.getValue());",
      choices: ["42", "undefined", "null", "TypeError"],
      correctIndex: 1,
      explanation:
        "화살표 함수는 자신만의 this를 갖지 않고 상위 스코프의 this를 사용합니다. 객체 리터럴은 스코프를 생성하지 않으므로 전역 this를 참조하게 되어 undefined가 반환됩니다.",
    },
    {
      id: "mid02-q4",
      question:
        "다음 코드의 출력 결과는?\n\nfunction Person(name) {\n  this.name = name;\n}\nPerson.prototype.greet = function() {\n  return `Hello, ${this.name}`;\n};\nconst p = new Person('Kim');\nconsole.log(p.greet());",
      choices: [
        "'Hello, undefined'",
        "'Hello, Kim'",
        "TypeError",
        "'Hello, '",
      ],
      correctIndex: 1,
      explanation:
        "new 키워드로 생성자를 호출하면 this는 새로 생성된 객체에 바인딩됩니다. p.greet()는 메서드 호출이므로 this는 p를 가리킵니다.",
    },
    {
      id: "mid02-q5",
      question:
        "다음 중 프로토타입 체인의 최상위에 위치하는 것은?",
      choices: [
        "Function.prototype",
        "Object.prototype",
        "null",
        "undefined",
      ],
      correctIndex: 2,
      explanation:
        "프로토타입 체인의 최상위는 null입니다. Object.prototype.__proto__는 null을 가리킵니다.",
    },
    {
      id: "mid02-q6",
      question:
        "다음 코드의 출력 결과는?\n\nconst a = { x: 1 };\nconst b = Object.create(a);\nb.y = 2;\nconsole.log(b.x, b.y, a.y);",
      choices: [
        "1, 2, 2",
        "undefined, 2, undefined",
        "1, 2, undefined",
        "TypeError",
      ],
      correctIndex: 2,
      explanation:
        "Object.create(a)는 a를 프로토타입으로 하는 새 객체를 생성합니다. b.x는 프로토타입 체인을 따라 a에서 찾고, b.y는 b 자체 속성입니다. a.y는 존재하지 않으므로 undefined입니다.",
    },
    {
      id: "mid02-q7",
      question:
        "다음 코드의 출력 결과는?\n\nfunction Foo() {}\nFoo.prototype.x = 10;\nconst foo = new Foo();\nfoo.x = 20;\ndelete foo.x;\nconsole.log(foo.x);",
      choices: ["undefined", "10", "20", "TypeError"],
      correctIndex: 1,
      explanation:
        "foo.x = 20은 인스턴스 자체 속성을 생성합니다. delete foo.x로 자체 속성을 삭제하면 프로토타입 체인을 따라 Foo.prototype.x인 10이 조회됩니다.",
    },
    {
      id: "mid02-q8",
      question:
        "다음 코드의 출력 결과는?\n\nconst obj = {\n  a: 1,\n  b: 2,\n  c: 3\n};\nconst { a, ...rest } = obj;\nconsole.log(rest);",
      choices: [
        "{ a: 1, b: 2, c: 3 }",
        "{ b: 2, c: 3 }",
        "[2, 3]",
        "undefined",
      ],
      correctIndex: 1,
      explanation:
        "구조 분해 할당에서 나머지 패턴(...)은 명시적으로 추출한 속성을 제외한 나머지를 새 객체로 모읍니다.",
    },
    {
      id: "mid02-q9",
      question:
        'call과 apply의 차이점으로 올바른 것은?',
      choices: [
        "call은 this를 바인딩하고 apply는 하지 않는다",
        "call은 인수를 쉼표로 나열하고 apply는 배열로 전달한다",
        "apply는 새 함수를 반환하고 call은 즉시 실행한다",
        "call은 생성자에서만 사용할 수 있다",
      ],
      correctIndex: 1,
      explanation:
        "call(thisArg, arg1, arg2, ...)과 apply(thisArg, [arg1, arg2, ...])는 인수 전달 방식만 다르고 기능은 동일합니다.",
    },
    {
      id: "mid02-q10",
      question:
        "다음 코드의 출력 결과는?\n\nfunction greet() {\n  console.log(this.name);\n}\nconst bound = greet.bind({ name: 'A' });\nbound.call({ name: 'B' });",
      choices: ["'A'", "'B'", "undefined", "TypeError"],
      correctIndex: 0,
      explanation:
        "bind로 생성된 함수는 this가 영구적으로 고정됩니다. 이후 call이나 apply로 this를 변경할 수 없습니다.",
    },
    {
      id: "mid02-q11",
      question:
        "다음 코드의 출력 결과는?\n\nclass Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    return `${this.name} makes a sound.`;\n  }\n}\nclass Dog extends Animal {\n  speak() {\n    return `${this.name} barks.`;\n  }\n}\nconst d = new Dog('Rex');\nconsole.log(d.speak());",
      choices: [
        "'Rex makes a sound.'",
        "'Rex barks.'",
        "'undefined barks.'",
        "TypeError",
      ],
      correctIndex: 1,
      explanation:
        "Dog 클래스가 speak 메서드를 오버라이드했으므로 Dog의 speak가 호출됩니다. extends를 사용하면 constructor가 없을 때 자동으로 부모 constructor가 호출됩니다.",
    },
    {
      id: "mid02-q12",
      question:
        "다음 코드의 출력 결과는?\n\nclass Parent {\n  constructor() {\n    this.x = 1;\n  }\n}\nclass Child extends Parent {\n  constructor() {\n    this.y = 2;\n    super();\n  }\n}\nnew Child();",
      choices: [
        "{ x: 1, y: 2 }",
        "ReferenceError",
        "{ y: 2, x: 1 }",
        "TypeError",
      ],
      correctIndex: 1,
      explanation:
        "파생 클래스의 constructor에서 super()를 호출하기 전에 this를 참조하면 ReferenceError가 발생합니다. super() 호출이 this 초기화보다 먼저 와야 합니다.",
    },
    {
      id: "mid02-q13",
      question:
        "다음 중 객체의 자체(own) 속성만 확인하는 방법은?",
      choices: [
        "in 연산자",
        "for...in 루프",
        "Object.hasOwn(obj, key)",
        "typeof obj[key] !== 'undefined'",
      ],
      correctIndex: 2,
      explanation:
        "Object.hasOwn()은 프로토타입 체인을 따르지 않고 객체 자체 속성만 확인합니다. in 연산자와 for...in은 프로토타입 체인의 속성도 포함합니다.",
    },
    {
      id: "mid02-q14",
      question:
        "다음 코드의 출력 결과는?\n\nconst obj = Object.create(null);\nobj.toString = () => 'custom';\nconsole.log(obj + '');",
      choices: [
        "'[object Object]'",
        "'custom'",
        "TypeError",
        "'undefined'",
      ],
      correctIndex: 1,
      explanation:
        "Object.create(null)로 생성한 객체는 프로토타입이 없어서 기본 toString이 없지만, 직접 toString을 정의했으므로 문자열 변환 시 'custom'이 반환됩니다.",
    },
    {
      id: "mid02-q15",
      question:
        "다음 코드의 출력 결과는?\n\nconst obj = {\n  count: 0,\n  increment() {\n    this.count++;\n  }\n};\nconst { increment } = obj;\nincrement();\nconsole.log(obj.count);",
      choices: ["1", "0", "NaN", "TypeError"],
      correctIndex: 1,
      explanation:
        "구조 분해로 추출한 increment는 obj와의 바인딩이 끊어진 일반 함수입니다. increment() 호출 시 this는 전역 객체를 가리키므로 obj.count는 변하지 않습니다.",
    },
    {
      id: "mid02-q16",
      question:
        "다음 코드의 출력 결과는?\n\nclass Counter {\n  #count = 0;\n  increment() { this.#count++; }\n  get value() { return this.#count; }\n}\nconst c = new Counter();\nc.increment();\nc.increment();\nconsole.log(c.value, c.#count);",
      choices: [
        "2, 2",
        "2, undefined",
        "SyntaxError",
        "2 다음에 SyntaxError",
      ],
      correctIndex: 2,
      explanation:
        "#count는 클래스의 프라이빗 필드입니다. 클래스 외부에서 #count에 접근하면 SyntaxError가 발생합니다.",
    },
    {
      id: "mid02-q17",
      question:
        "Object.freeze()로 동결된 객체에 대한 설명으로 틀린 것은?",
      choices: [
        "속성 값을 변경할 수 없다",
        "새로운 속성을 추가할 수 없다",
        "중첩된 객체의 속성도 변경할 수 없다",
        "속성을 삭제할 수 없다",
      ],
      correctIndex: 2,
      explanation:
        "Object.freeze()는 얕은(shallow) 동결만 수행합니다. 중첩된 객체의 속성은 여전히 변경할 수 있습니다. 깊은 동결을 하려면 재귀적으로 freeze를 호출해야 합니다.",
    },
  ],
};

export default midQuiz;
