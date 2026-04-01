import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "02-data-types",
  subject: "js",
  title: "데이터 타입",
  description: "자바스크립트의 7가지 원시 타입과 참조 타입, typeof 연산자, 동적 타이핑의 동작 원리를 깊이 이해합니다.",
  order: 2,
  group: "기초",
  prerequisites: ["01-var-let-const"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "데이터 타입은 '그릇의 종류'와 같습니다.\n\n" +
        "**원시 타입(Primitive)**은 일회용 종이컵과 같습니다. 컵에 커피를 담아서 친구에게 건네면, 친구는 새로운 컵을 받는 것이지 원래 컵을 공유하는 것이 아닙니다. 값을 복사해서 전달하기 때문에, 한 쪽을 수정해도 다른 쪽에 영향이 없습니다.\n\n" +
        "**참조 타입(Reference)**은 구글 문서와 같습니다. 링크를 공유하면 모두가 같은 문서를 바라봅니다. 한 사람이 수정하면 링크를 가진 모든 사람에게 반영됩니다. 변수에는 문서의 실제 내용이 아니라 '주소(참조)'가 저장됩니다.\n\n" +
        "자바스크립트는 **동적 타이핑** 언어입니다. 같은 그릇에 커피도 담고, 주스도 담고, 심지어 아무것도 안 담을 수도 있습니다. 담긴 내용물에 따라 그릇의 '타입'이 자동으로 결정됩니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "자바스크립트에서 데이터 타입을 이해하지 못하면 예상치 못한 버그가 발생합니다.\n\n" +
        "```js\n" +
        "typeof null         // 'object' — null인데 왜 object?\n" +
        "typeof NaN          // 'number' — NaN인데 왜 number?\n" +
        "typeof function(){} // 'function' — function이 따로 있나?\n" +
        "NaN === NaN         // false — 자기 자신과 다르다?\n" +
        "null == undefined   // true — 같은 건가?\n" +
        "0.1 + 0.2 === 0.3   // false — 계산이 틀렸나?\n" +
        "```\n\n" +
        "이런 결과들은 타입 시스템의 역사적 설계 결정과 IEEE 754 부동소수점 표준에서 비롯됩니다. 이를 이해하지 않으면 '자바스크립트는 이상해'라고 넘어가게 되고, 언젠가 프로덕션에서 심각한 버그를 마주치게 됩니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "자바스크립트의 타입 시스템은 **8가지 타입**으로 구성됩니다(ES2020 기준).\n\n" +
        "### 원시 타입 (Primitive Types) — 7가지\n\n" +
        "**1. number** — 정수와 부동소수점을 모두 표현하는 하나의 타입 (IEEE 754 배정밀도). `Infinity`, `-Infinity`, `NaN`도 number 타입입니다.\n\n" +
        "**2. bigint** — `Number.MAX_SAFE_INTEGER`(2⁵³-1)를 초과하는 정수를 안전하게 표현. 리터럴은 `9007199254740993n`처럼 `n` 접미사를 사용합니다.\n\n" +
        "**3. string** — UTF-16 코드 유닛 시퀀스. 문자열은 불변(immutable)으로, 한번 생성된 문자열은 변경할 수 없습니다.\n\n" +
        "**4. boolean** — `true` 또는 `false`. 비교 연산의 결과입니다.\n\n" +
        "**5. undefined** — 변수가 선언됐지만 값이 할당되지 않은 상태. 엔진이 초기화 시 자동으로 부여합니다.\n\n" +
        "**6. null** — 값이 없음을 **의도적으로** 나타내는 타입. 개발자가 명시적으로 할당합니다. `typeof null === 'object'`는 초기 구현의 버그로, 하위 호환성 때문에 수정되지 않았습니다.\n\n" +
        "**7. symbol** — ES6에서 추가된 고유하고 불변인 값. 객체 프로퍼티의 키로 사용해 이름 충돌을 방지합니다.\n\n" +
        "### 참조 타입 (Reference Types) — 1가지\n\n" +
        "**8. object** — 키-값 쌍의 컬렉션. `Array`, `Function`, `Map`, `Set`, `Date` 등이 모두 object의 하위 타입입니다. `typeof function(){}` 가 `'function'`을 반환하는 것은 편의를 위한 예외입니다.\n\n" +
        "### 동적 타이핑 (Dynamic Typing)\n\n" +
        "자바스크립트는 변수가 아니라 **값**에 타입이 붙습니다. 변수는 어떤 타입의 값이든 담을 수 있는 중립적인 컨테이너입니다. 런타임에 값이 할당될 때 타입이 결정됩니다.\n\n" +
        "### NaN의 역설\n\n" +
        "`NaN`은 'Not a Number'지만 `typeof NaN === 'number'`입니다. 수학적으로 정의되지 않은 연산(예: `0/0`, `parseInt('abc')`)의 결과로, '숫자 연산을 시도했으나 유효한 숫자가 아님'을 의미합니다. `NaN`은 자기 자신과 같지 않은 유일한 값으로, 감지하려면 `Number.isNaN()`을 사용합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 값의 저장 방식 — 스택과 힙",
      content:
        "원시 타입과 참조 타입이 메모리에서 어떻게 다르게 저장되는지 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// === 원시 타입: 스택에 값 직접 저장 ===\n' +
          'let a = 10;\n' +
          'let b = a;   // 값을 복사\n' +
          'b = 20;\n' +
          '\n' +
          '// 메모리 상태:\n' +
          '// 스택: a → [10], b → [20]  (독립적)\n' +
          'console.log(a); // 10 — b 변경이 a에 영향 없음\n' +
          '\n' +
          '// === 참조 타입: 힙에 데이터, 스택에 주소 저장 ===\n' +
          'let obj1 = { name: "Alice" };\n' +
          'let obj2 = obj1;  // 주소(참조)를 복사\n' +
          'obj2.name = "Bob";\n' +
          '\n' +
          '// 메모리 상태:\n' +
          '// 힙:  0x001 → { name: "Bob" }\n' +
          '// 스택: obj1 → [0x001], obj2 → [0x001]  (같은 주소)\n' +
          'console.log(obj1.name); // "Bob" — 같은 객체를 참조\n' +
          '\n' +
          '// === typeof 연산자의 한계 ===\n' +
          'typeof null       // "object"  ← 버그 (null은 object 아님)\n' +
          'typeof []         // "object"  ← 배열인지 알 수 없음\n' +
          '\n' +
          '// 더 정확한 타입 확인:\n' +
          'Array.isArray([])           // true\n' +
          'obj1 === null               // false (null 체크)\n' +
          'Object.prototype.toString.call(null) // "[object Null]"',
        description: "원시값은 스택에 직접 저장되고, 참조값은 힙에 저장된 객체의 주소를 스택에 저장합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 타입별 특성 탐구",
      content:
        "각 원시 타입의 특성과 흔한 함정을 실제 코드로 확인합니다.",
      code: {
        language: "javascript",
        code:
          '// 1. number — IEEE 754 부동소수점 함정\n' +
          'console.log(0.1 + 0.2);         // 0.30000000000000004\n' +
          'console.log(0.1 + 0.2 === 0.3); // false\n' +
          '// 해결책: 정수로 변환하거나 toFixed() 사용\n' +
          'console.log(Math.round((0.1 + 0.2) * 10) / 10 === 0.3); // true\n' +
          '\n' +
          '// 2. bigint — 큰 정수 안전하게 다루기\n' +
          'const maxSafe = Number.MAX_SAFE_INTEGER; // 9007199254740991\n' +
          'console.log(maxSafe + 1 === maxSafe + 2); // true (손실!)\n' +
          'const bigA = 9007199254740991n;\n' +
          'console.log(bigA + 1n === bigA + 2n);     // false (정확)\n' +
          '\n' +
          '// 3. string — 불변성\n' +
          'let str = "hello";\n' +
          'str[0] = "H";  // 조용히 실패 (strict mode에서는 TypeError)\n' +
          'console.log(str); // "hello" — 변경 안 됨\n' +
          '\n' +
          '// 4. symbol — 고유한 키\n' +
          'const id1 = Symbol("id");\n' +
          'const id2 = Symbol("id");\n' +
          'console.log(id1 === id2); // false — 설명이 같아도 다름\n' +
          '\n' +
          '// 5. null vs undefined 구분\n' +
          'let declared;          // undefined: 선언만, 할당 안 됨\n' +
          'let empty = null;      // null: 명시적으로 비어있음\n' +
          'console.log(declared == empty);  // true (느슨한 비교)\n' +
          'console.log(declared === empty); // false (엄격한 비교)',
        description: "각 타입의 고유한 특성을 이해하면 예상치 못한 버그를 사전에 방지할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 타입 | 분류 | typeof 결과 | 특이사항 |\n" +
        "|------|------|-------------|----------|\n" +
        "| number | 원시 | 'number' | NaN, Infinity 포함, IEEE 754 |\n" +
        "| bigint | 원시 | 'bigint' | 접미사 n, 2⁵³ 이상 정수 |\n" +
        "| string | 원시 | 'string' | 불변, UTF-16 |\n" +
        "| boolean | 원시 | 'boolean' | true / false |\n" +
        "| undefined | 원시 | 'undefined' | 미할당 상태 |\n" +
        "| null | 원시 | 'object' | ← 역사적 버그 |\n" +
        "| symbol | 원시 | 'symbol' | 고유 식별자 |\n" +
        "| object | 참조 | 'object' | 배열, 함수 포함 |\n\n" +
        "**핵심:** 원시 타입은 값에 의한 복사(copy by value), 참조 타입은 참조에 의한 복사(copy by reference)로 전달됩니다. `null` 체크에는 `=== null`을 사용하고, 배열 확인에는 `Array.isArray()`를 사용하세요.\n\n" +
        "**다음 챕터 미리보기:** 연산자를 학습하면서 타입에 따라 연산 결과가 어떻게 달라지는지 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "자바스크립트의 7가지 원시 타입을 나열할 수 있다",
    "원시 타입과 참조 타입의 메모리 저장 방식 차이를 설명할 수 있다",
    "typeof null이 'object'인 이유를 설명할 수 있다",
    "NaN을 올바르게 감지하는 방법(Number.isNaN)을 안다",
    "0.1 + 0.2 !== 0.3인 이유를 설명할 수 있다",
    "동적 타이핑의 의미와 장단점을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "자바스크립트에서 typeof null의 결과는?",
      choices: ["'null'", "'undefined'", "'object'", "'boolean'"],
      correctIndex: 2,
      explanation: "typeof null이 'object'를 반환하는 것은 자바스크립트 초기 구현의 버그입니다. 하위 호환성 때문에 수정되지 않았습니다. null 체크에는 반드시 === null을 사용하세요.",
    },
    {
      id: "q2",
      question: "다음 중 NaN을 올바르게 감지하는 방법은?",
      choices: ["value === NaN", "value == NaN", "Number.isNaN(value)", "typeof value === 'NaN'"],
      correctIndex: 2,
      explanation: "NaN은 자기 자신과 같지 않은 유일한 값으로 NaN === NaN은 false입니다. 올바른 감지 방법은 Number.isNaN()입니다. 전역 isNaN()은 타입 변환을 먼저 수행하므로 Number.isNaN()이 더 정확합니다.",
    },
    {
      id: "q3",
      question: "원시 타입 변수를 다른 변수에 할당할 때의 동작은?",
      choices: [
        "같은 메모리 주소를 공유한다",
        "값이 복사되어 독립적인 변수가 된다",
        "얕은 복사가 이루어진다",
        "참조를 전달한다",
      ],
      correctIndex: 1,
      explanation: "원시 타입은 값에 의한 전달(pass by value)이 이루어집니다. 새 변수에 할당하면 값이 복사되어 두 변수는 독립적입니다. 한 변수를 수정해도 다른 변수에 영향이 없습니다.",
    },
    {
      id: "q4",
      question: "console.log(0.1 + 0.2 === 0.3)의 결과는?",
      choices: ["true", "false", "TypeError", "NaN"],
      correctIndex: 1,
      explanation: "0.1과 0.2는 IEEE 754 배정밀도 부동소수점으로 정확히 표현할 수 없어 0.1 + 0.2 = 0.30000000000000004가 됩니다. 부동소수점 비교에는 Number.EPSILON을 활용하거나 정수로 변환하는 방법을 사용하세요.",
    },
    {
      id: "q5",
      question: "다음 중 Symbol에 대한 설명으로 틀린 것은?",
      choices: [
        "Symbol('id') === Symbol('id')는 false다",
        "객체의 프로퍼티 키로 사용할 수 있다",
        "new Symbol()로 생성한다",
        "고유하고 불변인 값이다",
      ],
      correctIndex: 2,
      explanation: "Symbol은 생성자가 아니므로 new Symbol()은 TypeError를 발생시킵니다. Symbol('설명')처럼 함수로 호출해야 합니다. 같은 설명을 넣어도 항상 유일한 값을 반환합니다.",
    },
    {
      id: "q6",
      question: "bigint 타입이 필요한 이유는?",
      choices: [
        "소수점 이하 자릿수를 늘리기 위해",
        "Number.MAX_SAFE_INTEGER(2⁵³-1)를 초과하는 정수를 정확히 표현하기 위해",
        "문자열로 표현된 숫자를 파싱하기 위해",
        "음수를 표현하기 위해",
      ],
      correctIndex: 1,
      explanation: "number 타입은 IEEE 754 배정밀도로 2⁵³-1(약 9천조)까지의 정수만 안전하게 표현합니다. 이를 초과하면 정밀도가 손실됩니다. bigint는 임의 정밀도 정수를 제공하여 이 문제를 해결합니다.",
    },
    {
      id: "q7",
      question: "자바스크립트 동적 타이핑의 의미는?",
      choices: [
        "변수를 선언할 때 타입을 명시해야 한다",
        "런타임에 변수의 타입이 할당된 값에 따라 결정된다",
        "타입 변환이 불가능하다",
        "모든 변수는 항상 같은 타입을 유지한다",
      ],
      correctIndex: 1,
      explanation: "자바스크립트에서 타입은 변수가 아닌 값에 붙습니다. 변수는 어떤 타입의 값이든 담을 수 있으며, 런타임에 할당된 값에 따라 타입이 결정됩니다. 이는 유연성을 제공하지만 타입 관련 버그가 발생하기 쉽습니다.",
    },
  ],
};

export default chapter;
