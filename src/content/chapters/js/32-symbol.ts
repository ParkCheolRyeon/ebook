import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "32-symbol",
  subject: "js",
  title: "Symbol",
  description: "Symbol() 원시 타입의 고유성, Symbol.for() 전역 레지스트리, Well-known Symbol을 통한 언어 동작 커스터마이징을 깊이 이해합니다.",
  order: 32,
  group: "이터러블과 제너레이터",
  prerequisites: ["31-generator"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Symbol은 '세상에 하나뿐인 열쇠'와 같습니다.\n\n" +
        "일반 문자열 키는 복사 가능한 마스터키입니다. '이름(name)'이라는 키는 누구든 만들 수 있어서, 서드파티 라이브러리가 여러분의 객체에 같은 이름의 프로퍼티를 추가할 수 있습니다.\n\n" +
        "**Symbol()**은 각 호출마다 물리적으로 유일한 열쇠를 제조합니다. 설명('name')은 같아도 두 열쇠는 절대 일치하지 않습니다. 이 열쇠로 잠근 서랍은 정확히 그 열쇠를 가진 사람만 열 수 있습니다.\n\n" +
        "**Symbol.for('name')**은 전국 공통 키 보관소에서 'name'이라는 이름의 열쇠를 찾습니다. 없으면 새로 만들고 보관소에 등록합니다. 다른 곳에서 Symbol.for('name')을 다시 호출하면 같은 열쇠를 받습니다.\n\n" +
        "**Well-known Symbol**은 자바스크립트 엔진이 특정 동작을 할 때 찾는 '비밀 서랍'입니다. `Symbol.iterator`라는 서랍에 함수를 넣어두면 for...of가 그 함수를 찾아 호출합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "문자열 기반 프로퍼티 키에는 두 가지 근본적인 문제가 있습니다.\n\n" +
        "**1. 이름 충돌 (Name Collision)**\n" +
        "```js\n" +
        "// 라이브러리 A가 객체에 메타데이터 추가\n" +
        "user.id = 'lib-a-internal-123';\n" +
        "\n" +
        "// 라이브러리 B도 같은 이름 사용 → 덮어씌워짐!\n" +
        "user.id = 'lib-b-internal-456';\n" +
        "```\n\n" +
        "**2. 내부 프로퍼티 노출**\n" +
        "```js\n" +
        "// 내부용으로 쓰려고 추가했는데...\n" +
        "obj._internal = 'private';\n" +
        "JSON.stringify(obj); // '_internal' 키가 그대로 노출됨\n" +
        "for (const key in obj) {} // '_internal'도 순회됨\n" +
        "```\n\n" +
        "**3. 언어 동작 커스터마이징의 한계**\n" +
        "어떤 객체를 `+` 연산자로 더할 때 어떻게 동작할지, `instanceof`로 검사할 때 어떻게 동작할지를 개발자가 정의할 수 있는 공식 방법이 없었습니다.\n\n" +
        "이 문제들을 해결하기 위해 ES6에서 Symbol이 도입되었습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### Symbol() — 고유 식별자 생성\n\n" +
        "```js\n" +
        "const id1 = Symbol('id');  // 설명 'id'\n" +
        "const id2 = Symbol('id');  // 설명 같아도\n" +
        "id1 === id2;               // false! 완전히 다른 Symbol\n" +
        "typeof id1;                // 'symbol'\n" +
        "id1.toString();            // 'Symbol(id)'\n" +
        "id1.description;           // 'id' (ES2019+)\n" +
        "```\n\n" +
        "Symbol 키를 가진 프로퍼티는 `for...in`, `Object.keys()`, `JSON.stringify()`에서 열거되지 않아 내부 구현을 숨길 수 있습니다.\n\n" +
        "### Symbol.for() — 전역 심볼 레지스트리\n\n" +
        "```js\n" +
        "const s1 = Symbol.for('shared');  // 레지스트리에 없으면 생성\n" +
        "const s2 = Symbol.for('shared');  // 같은 Symbol 반환\n" +
        "s1 === s2;  // true!\n" +
        "Symbol.keyFor(s1); // 'shared' (키 조회)\n" +
        "```\n\n" +
        "여러 모듈이나 iframe에서 동일한 Symbol을 공유해야 할 때 사용합니다.\n\n" +
        "### Well-known Symbol — 언어 동작 커스터마이징\n\n" +
        "자바스크립트 엔진이 내부적으로 특정 동작 시 참조하는 내장 Symbol입니다.\n\n" +
        "| Symbol | 동작 |\n" +
        "|--------|------|\n" +
        "| `Symbol.iterator` | for...of, 전개 연산자, 구조 분해 |\n" +
        "| `Symbol.toPrimitive` | 원시값으로 변환 시 (`+`, 비교 등) |\n" +
        "| `Symbol.hasInstance` | `instanceof` 연산자 동작 |\n" +
        "| `Symbol.toStringTag` | `Object.prototype.toString` 결과 |\n" +
        "| `Symbol.species` | 파생 클래스 생성 시 사용할 생성자 |\n" +
        "| `Symbol.asyncIterator` | `for await...of` |\n\n" +
        "### Symbol.toPrimitive 예시\n\n" +
        "```js\n" +
        "const temperature = {\n" +
        "  celsius: 20,\n" +
        "  [Symbol.toPrimitive](hint) {\n" +
        "    if (hint === 'number') return this.celsius;\n" +
        "    if (hint === 'string') return `${this.celsius}°C`;\n" +
        "    return this.celsius; // 'default'\n" +
        "  }\n" +
        "};\n" +
        "temperature + 5;         // 25 (number hint)\n" +
        "`온도: ${temperature}`;  // '온도: 20°C' (string hint)\n" +
        "```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Symbol을 활용한 private-like 프로퍼티",
      content:
        "Symbol을 이용해 외부에서 접근하기 어려운 내부 프로퍼티를 구현하는 패턴을 살펴봅니다.",
      code: {
        language: "javascript",
        code:
          "// === Symbol로 내부 상태 숨기기 ===\n" +
          "const _private = Symbol('private');\n" +
          "\n" +
          "class Stack {\n" +
          "  constructor() {\n" +
          "    this[_private] = [];  // Symbol 키 — 외부에서 쉽게 접근 불가\n" +
          "  }\n" +
          "\n" +
          "  push(value) {\n" +
          "    this[_private].push(value);\n" +
          "  }\n" +
          "\n" +
          "  pop() {\n" +
          "    return this[_private].pop();\n" +
          "  }\n" +
          "\n" +
          "  get size() {\n" +
          "    return this[_private].length;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "const stack = new Stack();\n" +
          "stack.push(1); stack.push(2);\n" +
          "console.log(stack.size); // 2\n" +
          "\n" +
          "// Symbol 키는 for...in, Object.keys에서 보이지 않음\n" +
          "console.log(Object.keys(stack));         // []\n" +
          "console.log(JSON.stringify(stack));       // {}\n" +
          "\n" +
          "// 하지만 완전한 private은 아님!\n" +
          "console.log(Object.getOwnPropertySymbols(stack)); // [Symbol(private)]\n" +
          "\n" +
          "// === Symbol.hasInstance로 instanceof 커스터마이징 ===\n" +
          "class EvenNumber {\n" +
          "  static [Symbol.hasInstance](num) {\n" +
          "    return typeof num === 'number' && num % 2 === 0;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "console.log(2 instanceof EvenNumber);  // true\n" +
          "console.log(3 instanceof EvenNumber);  // false\n" +
          "console.log(4 instanceof EvenNumber);  // true\n" +
          "\n" +
          "// === Symbol.toStringTag ===\n" +
          "class MyCollection {\n" +
          "  get [Symbol.toStringTag]() {\n" +
          "    return 'MyCollection';\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "const col = new MyCollection();\n" +
          "Object.prototype.toString.call(col); // '[object MyCollection]'",
        description: "Symbol 키는 일반 열거에서 숨겨지지만 Object.getOwnPropertySymbols()로는 접근 가능합니다. 완전한 private을 위해서는 WeakMap이나 클래스 private 필드(#)를 사용하세요.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Symbol.toPrimitive와 Symbol.iterator 활용",
      content:
        "Well-known Symbol을 직접 구현해 객체의 언어 통합 동작을 커스터마이징합니다.",
      code: {
        language: "javascript",
        code:
          "// 화폐 단위 클래스 — Symbol.toPrimitive + Symbol.iterator\n" +
          "class Money {\n" +
          "  constructor(amount, currency = 'KRW') {\n" +
          "    this.amount = amount;\n" +
          "    this.currency = currency;\n" +
          "  }\n" +
          "\n" +
          "  // 연산자와 비교 시 동작 정의\n" +
          "  [Symbol.toPrimitive](hint) {\n" +
          "    switch (hint) {\n" +
          "      case 'number': return this.amount;\n" +
          "      case 'string': return `${this.amount.toLocaleString()}${this.currency}`;\n" +
          "      default: return this.amount;\n" +
          "    }\n" +
          "  }\n" +
          "\n" +
          "  // 지폐로 분해 (이터러블)\n" +
          "  [Symbol.iterator]() {\n" +
          "    const bills = [50000, 10000, 5000, 1000, 500, 100];\n" +
          "    let remaining = this.amount;\n" +
          "    let i = 0;\n" +
          "    return {\n" +
          "      next() {\n" +
          "        while (i < bills.length) {\n" +
          "          const bill = bills[i];\n" +
          "          if (remaining >= bill) {\n" +
          "            const count = Math.floor(remaining / bill);\n" +
          "            remaining %= bill;\n" +
          "            i++;\n" +
          "            return { value: { bill, count }, done: false };\n" +
          "          }\n" +
          "          i++;\n" +
          "        }\n" +
          "        return { value: undefined, done: true };\n" +
          "      }\n" +
          "    };\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "const price = new Money(73600);\n" +
          "console.log(`가격: ${price}`);      // '가격: 73,600KRW' (string hint)\n" +
          "console.log(price + 10000);          // 83600 (number hint)\n" +
          "console.log(price > 50000);          // true (default hint → number)\n" +
          "\n" +
          "// 지폐 분해\n" +
          "for (const { bill, count } of price) {\n" +
          "  if (count > 0) console.log(`${bill}원: ${count}장`);\n" +
          "}\n" +
          "// 50000원: 1장\n" +
          "// 10000원: 2장\n" +
          "// 1000원: 3장\n" +
          "// 500원: 1장\n" +
          "// 100원: 1장",
        description: "Well-known Symbol을 구현하면 사용자 정의 클래스가 언어의 연산자, 반복문 등과 자연스럽게 통합됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 방법 | 특징 | 사용 사례 |\n" +
        "|------|------|----------|\n" +
        "| `Symbol()` | 항상 고유 | 내부 키, 이름 충돌 방지 |\n" +
        "| `Symbol.for()` | 전역 레지스트리, 공유 가능 | 크로스 모듈 공유 |\n" +
        "| Well-known Symbol | 언어 내장 동작 커스터마이징 | 이터러블, 형변환, instanceof |\n\n" +
        "**Symbol 키의 특성:**\n" +
        "- `for...in`, `Object.keys()`, `JSON.stringify()`에서 열거되지 않음\n" +
        "- `Object.getOwnPropertySymbols()`로만 조회 가능\n" +
        "- `Reflect.ownKeys()`로 문자열 키 + Symbol 키 모두 조회\n\n" +
        "**주요 Well-known Symbol:**\n" +
        "`Symbol.iterator` (for...of), `Symbol.toPrimitive` (형변환), `Symbol.hasInstance` (instanceof), `Symbol.toStringTag` (toString)\n\n" +
        "**핵심:** Symbol은 고유성과 은닉성을 제공하지만 완전한 private이 아닙니다. 완전한 private은 클래스의 `#` private 필드를 사용하세요.\n\n" +
        "**다음 챕터 미리보기:** 모듈 시스템(CommonJS, ESM)을 배우며 코드를 파일 단위로 분리하고 재사용하는 방법을 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "Symbol은 절대 충돌하지 않는 유일한 식별자다. 객체의 숨은 프로퍼티 키나 이터러블 프로토콜(Symbol.iterator) 같은 언어 내부 메커니즘에 사용된다.",
  checklist: [
    "Symbol()이 항상 고유한 값을 생성하는 이유를 설명할 수 있다",
    "Symbol.for()와 Symbol()의 차이를 설명할 수 있다",
    "Symbol 키를 가진 프로퍼티가 열거에서 제외되는 이유를 안다",
    "Well-known Symbol의 개념과 역할을 설명할 수 있다",
    "Symbol.iterator로 커스텀 이터러블을 만들 수 있다",
    "Symbol.toPrimitive로 객체의 형변환 동작을 정의할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Symbol('id') === Symbol('id')의 결과는?",
      choices: ["true", "false", "TypeError", "undefined"],
      correctIndex: 1,
      explanation: "Symbol()은 호출할 때마다 완전히 새로운 고유한 값을 생성합니다. 설명 문자열이 같아도 두 Symbol은 절대 같지 않습니다. 이것이 Symbol의 핵심 특성입니다.",
    },
    {
      id: "q2",
      question: "Symbol.for('key')를 두 번 호출하면?",
      choices: [
        "항상 다른 Symbol을 반환한다",
        "첫 번째 호출 시 생성, 두 번째는 동일한 Symbol을 반환한다",
        "두 번째 호출은 TypeError를 발생시킨다",
        "undefined를 반환한다",
      ],
      correctIndex: 1,
      explanation: "Symbol.for()는 전역 심볼 레지스트리를 사용합니다. 같은 키로 두 번 호출하면 첫 번째에 생성된 동일한 Symbol을 반환합니다. 여러 모듈이나 iframe 간에 Symbol을 공유할 때 유용합니다.",
    },
    {
      id: "q3",
      question: "객체의 Symbol 키 프로퍼티를 조회하는 방법은?",
      choices: [
        "Object.keys()",
        "for...in",
        "Object.getOwnPropertySymbols()",
        "JSON.stringify()",
      ],
      correctIndex: 2,
      explanation: "Symbol 키는 Object.keys(), for...in, JSON.stringify()에서 열거되지 않습니다. Symbol 키 프로퍼티를 조회하려면 Object.getOwnPropertySymbols()를 사용해야 합니다. Reflect.ownKeys()는 문자열 키와 Symbol 키를 모두 반환합니다.",
    },
    {
      id: "q4",
      question: "Symbol.toPrimitive 메서드의 hint 파라미터가 'number'일 때는?",
      choices: [
        "객체를 문자열로 변환할 때",
        "산술 연산이나 비교 연산 등 숫자 변환이 필요할 때",
        "JSON.stringify() 호출 시",
        "Symbol 키를 생성할 때",
      ],
      correctIndex: 1,
      explanation: "Symbol.toPrimitive의 hint는 'number'(산술/비교), 'string'(템플릿 리터럴, String() 등), 'default'(+ 연산자, == 비교 등)의 세 가지입니다. 숫자 연산이나 비교가 필요한 상황에서 'number' hint가 전달됩니다.",
    },
    {
      id: "q5",
      question: "Symbol을 사용한 프로퍼티가 완전한 private이 아닌 이유는?",
      choices: [
        "for...in으로 접근할 수 있어서",
        "Object.getOwnPropertySymbols()로 키를 조회할 수 있어서",
        "JSON.stringify()로 노출되어서",
        "Symbol은 원시 타입이라서",
      ],
      correctIndex: 1,
      explanation: "Symbol 키는 일반 열거에서 숨겨지지만 Object.getOwnPropertySymbols()로 모든 Symbol 키를 조회할 수 있습니다. 완전한 private을 원한다면 클래스의 # private 필드나 WeakMap을 사용해야 합니다.",
    },
    {
      id: "q6",
      question: "Well-known Symbol이란?",
      choices: [
        "전 세계적으로 유명한 개발자가 만든 Symbol",
        "Symbol.for()로 생성한 전역 Symbol",
        "자바스크립트 언어 사양에 내장되어 특정 동작을 제어하는 Symbol",
        "Node.js 내장 모듈에서 export하는 Symbol",
      ],
      correctIndex: 2,
      explanation: "Well-known Symbol은 ECMAScript 사양에 정의된 내장 Symbol로, 언어 엔진이 특정 동작을 수행할 때 객체에서 찾는 '훅(hook)' 역할을 합니다. Symbol.iterator, Symbol.toPrimitive, Symbol.hasInstance 등이 있습니다.",
    },
  ],
};

export default chapter;
