import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "30-iterable",
  subject: "js",
  title: "이터러블과 이터레이터 프로토콜",
  description: "이터러블 프로토콜과 이터레이터 프로토콜의 동작 원리, Symbol.iterator, for...of의 내부 동작, 커스텀 이터러블 구현을 깊이 이해합니다.",
  order: 30,
  group: "이터러블과 제너레이터",
  prerequisites: ["29-microtask-macrotask"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "이터러블은 '줄서기 규칙이 있는 대기열'과 같습니다.\n\n" +
        "**이터러블(Iterable)**은 '저를 순서대로 읽어갈 수 있어요'라고 약속한 자판기입니다. 자판기는 반드시 '다음 음료 꺼내기' 버튼이 있어야 이 약속을 지킬 수 있습니다.\n\n" +
        "**이터레이터(Iterator)**는 바로 그 '다음 꺼내기' 버튼 자체입니다. 버튼을 누를 때마다 `{ value: '콜라', done: false }` 형태로 음료를 하나씩 줍니다. 더 이상 음료가 없으면 `{ value: undefined, done: true }`를 반환합니다.\n\n" +
        "**for...of** 루프는 이 자판기에서 모든 음료가 나올 때까지 자동으로 버튼을 계속 눌러주는 사람입니다. 내부적으로 이터레이터를 만들고, `done: true`가 나올 때까지 `next()`를 반복 호출합니다.\n\n" +
        "배열, 문자열, Map, Set, NodeList — 이들 모두 이 '자판기 약속(이터러블 프로토콜)'을 지키고 있어서 for...of로 순회할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "자바스크립트에는 '반복 가능한' 것들이 많습니다. 배열, 문자열, Map, Set, arguments, NodeList... 그런데 이것들을 어떻게 통일된 방식으로 순회할 수 있을까요?\n\n" +
        "ES6 이전에는 각 자료구조마다 다른 방식으로 순회해야 했습니다:\n\n" +
        "```js\n" +
        "// 배열: for 루프\n" +
        "for (var i = 0; i < arr.length; i++) {}\n" +
        "\n" +
        "// 객체: for...in (열거 가능한 키 순회)\n" +
        "for (var key in obj) {}\n" +
        "\n" +
        "// NodeList: Array.from 변환 후 사용\n" +
        "Array.from(nodeList).forEach(el => {})\n" +
        "```\n\n" +
        "이처럼 일관성 없는 API는 코드 재사용을 어렵게 만들었습니다. 또한 사용자가 직접 만든 자료구조(링크드 리스트, 트리 등)는 for 루프로 순회할 방법이 없었습니다.\n\n" +
        "**핵심 문제:** 어떤 객체가 '순회 가능'하다는 것을 어떻게 표준화하고, 커스텀 자료구조도 for...of로 순회할 수 있게 만들 수 있을까요?",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "ES6는 두 가지 프로토콜을 도입해 이 문제를 해결했습니다.\n\n" +
        "### 이터러블 프로토콜 (Iterable Protocol)\n\n" +
        "객체가 `Symbol.iterator` 메서드를 가지고 있으면 이터러블입니다. 이 메서드는 **이터레이터 객체**를 반환해야 합니다.\n\n" +
        "```js\n" +
        "// 이터러블 확인\n" +
        "typeof [][Symbol.iterator]     // 'function' — 배열은 이터러블\n" +
        "typeof ''[Symbol.iterator]     // 'function' — 문자열도 이터러블\n" +
        "typeof {}[Symbol.iterator]     // 'undefined' — 일반 객체는 이터러블 아님\n" +
        "```\n\n" +
        "### 이터레이터 프로토콜 (Iterator Protocol)\n\n" +
        "`next()` 메서드를 가지고 있으며, 호출 시 `{ value: any, done: boolean }` 형태의 객체를 반환하는 객체입니다.\n\n" +
        "- `done: false` — 아직 값이 있음, `value`에 현재 값\n" +
        "- `done: true` — 순회 완료, `value`는 보통 `undefined`\n\n" +
        "### for...of의 내부 동작\n\n" +
        "```js\n" +
        "for (const x of iterable) { ... }\n" +
        "// 위 코드는 내부적으로:\n" +
        "// 1. const iter = iterable[Symbol.iterator]()\n" +
        "// 2. let result = iter.next()\n" +
        "// 3. while (!result.done) { /* x = result.value */ ; result = iter.next() }\n" +
        "```\n\n" +
        "### 유사 배열 vs 이터러블\n\n" +
        "**유사 배열(Array-like)**: `length` 프로퍼티와 인덱스 접근이 가능하지만 이터러블이 아닐 수 있습니다. (예: `arguments`, 과거의 `NodeList`)\n\n" +
        "**이터러블**: `Symbol.iterator`를 구현하지만 `length`가 없을 수 있습니다. (예: `Map`, `Set`)\n\n" +
        "이 둘은 겹칠 수 있지만 동일하지 않습니다. `Array.from()`은 둘 다 배열로 변환합니다.\n\n" +
        "### 이터러블을 소비하는 문법들\n\n" +
        "- `for...of` 루프\n" +
        "- 전개 연산자 `[...iterable]`\n" +
        "- 구조 분해 할당 `const [a, b] = iterable`\n" +
        "- `Array.from(iterable)`\n" +
        "- `Promise.all(iterable)`\n" +
        "- `new Map(iterable)`, `new Set(iterable)`",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 커스텀 이터러블 제작",
      content:
        "두 프로토콜을 직접 구현하여 커스텀 이터러블이 어떻게 동작하는지 이해합니다.",
      code: {
        language: "javascript",
        code:
          "// === 이터레이터 직접 구현 ===\n" +
          "const range = {\n" +
          "  from: 1,\n" +
          "  to: 5,\n" +
          "\n" +
          "  // 이터러블 프로토콜: Symbol.iterator 메서드 구현\n" +
          "  [Symbol.iterator]() {\n" +
          "    let current = this.from;\n" +
          "    const last = this.to;\n" +
          "\n" +
          "    // 이터레이터 프로토콜: next() 메서드를 가진 객체 반환\n" +
          "    return {\n" +
          "      next() {\n" +
          "        if (current <= last) {\n" +
          "          return { value: current++, done: false };\n" +
          "        }\n" +
          "        return { value: undefined, done: true };\n" +
          "      }\n" +
          "    };\n" +
          "  }\n" +
          "};\n" +
          "\n" +
          "// for...of로 사용\n" +
          "for (const n of range) {\n" +
          "  console.log(n); // 1, 2, 3, 4, 5\n" +
          "}\n" +
          "\n" +
          "// 전개 연산자로 사용\n" +
          "console.log([...range]); // [1, 2, 3, 4, 5]\n" +
          "\n" +
          "// === 이터레이터를 직접 조작하기 ===\n" +
          "const arr = [10, 20, 30];\n" +
          "const iter = arr[Symbol.iterator]();\n" +
          "\n" +
          "console.log(iter.next()); // { value: 10, done: false }\n" +
          "console.log(iter.next()); // { value: 20, done: false }\n" +
          "console.log(iter.next()); // { value: 30, done: false }\n" +
          "console.log(iter.next()); // { value: undefined, done: true }\n" +
          "\n" +
          "// === 이터러블이자 이터레이터인 객체 ===\n" +
          "// (자기 자신을 반환하는 Symbol.iterator)\n" +
          "function makeCounter(start = 0) {\n" +
          "  let count = start;\n" +
          "  return {\n" +
          "    next() {\n" +
          "      return { value: count++, done: false };\n" +
          "    },\n" +
          "    [Symbol.iterator]() { return this; } // 자기 자신이 이터레이터\n" +
          "  };\n" +
          "}",
        description: "Symbol.iterator가 이터레이터를 반환하고, 이터레이터의 next()가 {value, done}을 반환하는 구조입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 링크드 리스트 이터러블",
      content:
        "실제 자료구조인 링크드 리스트에 이터러블 프로토콜을 적용해 for...of로 순회할 수 있게 만듭니다.",
      code: {
        language: "javascript",
        code:
          "class LinkedList {\n" +
          "  constructor() {\n" +
          "    this.head = null;\n" +
          "  }\n" +
          "\n" +
          "  append(value) {\n" +
          "    const node = { value, next: null };\n" +
          "    if (!this.head) {\n" +
          "      this.head = node;\n" +
          "    } else {\n" +
          "      let current = this.head;\n" +
          "      while (current.next) current = current.next;\n" +
          "      current.next = node;\n" +
          "    }\n" +
          "    return this;\n" +
          "  }\n" +
          "\n" +
          "  // 이터러블 프로토콜 구현\n" +
          "  [Symbol.iterator]() {\n" +
          "    let current = this.head;\n" +
          "    return {\n" +
          "      next() {\n" +
          "        if (current) {\n" +
          "          const value = current.value;\n" +
          "          current = current.next;\n" +
          "          return { value, done: false };\n" +
          "        }\n" +
          "        return { value: undefined, done: true };\n" +
          "      }\n" +
          "    };\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "const list = new LinkedList();\n" +
          "list.append(1).append(2).append(3);\n" +
          "\n" +
          "// 이제 for...of, 전개, 구조분해 모두 가능!\n" +
          "for (const val of list) {\n" +
          "  console.log(val); // 1, 2, 3\n" +
          "}\n" +
          "\n" +
          "const [first, ...rest] = list;\n" +
          "console.log(first); // 1\n" +
          "console.log(rest);  // [2, 3]\n" +
          "\n" +
          "// Array.from으로 배열 변환\n" +
          "console.log(Array.from(list)); // [1, 2, 3]",
        description: "커스텀 자료구조도 Symbol.iterator만 구현하면 모든 이터러블 소비 문법과 함께 사용할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 프로토콜 | 조건 | 반환값 |\n" +
        "|----------|------|--------|\n" +
        "| 이터러블 | `[Symbol.iterator]()` 메서드 존재 | 이터레이터 객체 |\n" +
        "| 이터레이터 | `next()` 메서드 존재 | `{ value, done }` |\n\n" +
        "**내장 이터러블:** `Array`, `String`, `Map`, `Set`, `TypedArray`, `arguments`, `NodeList`, 제너레이터\n\n" +
        "**이터러블을 소비하는 문법:** `for...of`, 전개 연산자, 구조 분해, `Array.from`, `Promise.all`, `new Map/Set`\n\n" +
        "**유사 배열 vs 이터러블:** 유사 배열은 `length`와 인덱스, 이터러블은 `Symbol.iterator`. `Array.from()`은 둘 다 변환 가능.\n\n" +
        "**핵심:** 이터러블 프로토콜은 자바스크립트에서 '순회 가능함'을 표준화한 인터페이스입니다. Symbol.iterator 하나만 구현하면 언어의 모든 순회 기능과 자동으로 호환됩니다.\n\n" +
        "**다음 챕터 미리보기:** 제너레이터(function*)는 이터러블과 이터레이터를 동시에 구현하는 강력한 문법입니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "이터러블 프로토콜과 이터레이터 프로토콜의 차이를 설명할 수 있다",
    "Symbol.iterator가 무엇을 반환해야 하는지 설명할 수 있다",
    "for...of 루프가 내부적으로 어떻게 동작하는지 설명할 수 있다",
    "커스텀 이터러블 객체를 직접 구현할 수 있다",
    "유사 배열과 이터러블의 차이를 설명할 수 있다",
    "이터러블을 소비하는 문법 3가지 이상을 나열할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "이터러블 프로토콜을 만족하기 위해 객체에 구현해야 하는 것은?",
      choices: [
        "next() 메서드",
        "[Symbol.iterator]() 메서드",
        "forEach() 메서드",
        "length 프로퍼티",
      ],
      correctIndex: 1,
      explanation: "이터러블 프로토콜은 객체가 [Symbol.iterator]() 메서드를 가질 것을 요구합니다. 이 메서드는 이터레이터 객체를 반환해야 합니다. next()는 이터레이터 프로토콜의 요구사항입니다.",
    },
    {
      id: "q2",
      question: "이터레이터의 next() 메서드가 반환해야 하는 형태는?",
      choices: [
        "{ value, done }",
        "{ current, finished }",
        "{ data, end }",
        "그냥 값 자체",
      ],
      correctIndex: 0,
      explanation: "이터레이터 프로토콜에 따라 next()는 반드시 { value: any, done: boolean } 형태의 IteratorResult 객체를 반환해야 합니다. done이 true이면 순회가 완료된 것입니다.",
    },
    {
      id: "q3",
      question: "다음 중 기본적으로 이터러블이 아닌 것은?",
      choices: ["Array", "String", "Set", "일반 Object({})"],
      correctIndex: 3,
      explanation: "일반 객체({})는 Symbol.iterator 메서드가 없으므로 기본적으로 이터러블이 아닙니다. for...of로 순회하려면 직접 Symbol.iterator를 구현해야 합니다.",
    },
    {
      id: "q4",
      question: "for...of 루프가 내부적으로 하는 첫 번째 동작은?",
      choices: [
        "iterable.forEach() 호출",
        "iterable[Symbol.iterator]() 호출로 이터레이터 획득",
        "iterable.length 확인",
        "iterable을 배열로 변환",
      ],
      correctIndex: 1,
      explanation: "for...of는 먼저 iterable[Symbol.iterator]()를 호출해 이터레이터를 얻고, 그 이터레이터의 next()를 done: true가 될 때까지 반복 호출합니다.",
    },
    {
      id: "q5",
      question: "유사 배열(Array-like)과 이터러블의 공통점은?",
      choices: [
        "둘 다 Symbol.iterator를 가진다",
        "둘 다 length 프로퍼티를 가진다",
        "Array.from()으로 배열 변환이 가능하다",
        "둘 다 for...of로 순회할 수 있다",
      ],
      correctIndex: 2,
      explanation: "Array.from()은 이터러블과 유사 배열(length + 인덱스 접근) 모두를 배열로 변환할 수 있습니다. 이터러블은 Symbol.iterator가 있고, 유사 배열은 length가 있지만, 이 둘은 서로 다른 개념입니다.",
    },
    {
      id: "q6",
      question: "이터러블을 소비할 수 있는 문법이 아닌 것은?",
      choices: ["for...of", "전개 연산자(...)", "for...in", "구조 분해 할당"],
      correctIndex: 2,
      explanation: "for...in은 객체의 열거 가능한 문자열 키를 순회하며, 이터러블 프로토콜을 사용하지 않습니다. for...of, 전개 연산자, 구조 분해 할당은 모두 내부적으로 이터러블 프로토콜을 사용합니다.",
    },
    {
      id: "q7",
      question: "이터러블이자 이터레이터인 객체를 만들려면 어떻게 해야 하는가?",
      choices: [
        "next()와 [Symbol.iterator]() 모두 구현하되, [Symbol.iterator]()가 this를 반환하게 한다",
        "class를 사용해야만 한다",
        "불가능하다",
        "Symbol.asyncIterator를 추가한다",
      ],
      correctIndex: 0,
      explanation: "객체에 next() 메서드(이터레이터)와 [Symbol.iterator]() 메서드(이터러블)를 모두 구현하고, [Symbol.iterator]()가 this를 반환하면 이터러블이자 이터레이터인 객체가 됩니다. 제너레이터가 바로 이런 방식으로 동작합니다.",
    },
  ],
};

export default chapter;
