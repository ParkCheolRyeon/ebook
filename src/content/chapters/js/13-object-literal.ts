import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "13-object-literal",
  subject: "js",
  title: "객체 리터럴과 프로퍼티",
  description: "객체 리터럴 문법으로 객체를 생성하고, 프로퍼티 접근·추가·삭제와 ES6+ 단축 문법을 깊이 이해합니다.",
  order: 13,
  group: "this와 객체",
  prerequisites: ["12-closure"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "객체는 **여권**과 같습니다.\n\n" +
        "여권에는 이름, 국적, 생년월일처럼 여러 정보(프로퍼티)가 하나의 문서에 묶여 있습니다. " +
        "각 정보는 '항목명: 값' 쌍으로 구성되어 있고, 항목명을 알면 그 값을 바로 찾을 수 있습니다.\n\n" +
        "여권에 스탬프를 추가하듯 프로퍼티를 동적으로 추가할 수 있고, " +
        "만료된 비자 스탬프처럼 필요 없는 프로퍼티는 삭제할 수 있습니다.\n\n" +
        "**계산된 프로퍼티명**은 봉인된 봉투에 적힌 수신자 이름처럼, 프로그램이 실행될 때까지 " +
        "어떤 키를 쓸지 모르는 상황에서 동적으로 키를 결정하는 방법입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "초기 자바스크립트에서 여러 관련 데이터를 묶어 표현하려면 개별 변수를 나열하거나 " +
        "배열의 인덱스에 의존해야 했습니다. 이는 코드 가독성을 낮추고 실수를 유발했습니다.\n\n" +
        "1. **의미 없는 인덱스** — `user[0]`이 이름인지 나이인지 알 수 없음\n" +
        "2. **관련 데이터 분산** — `userName`, `userAge`, `userEmail`처럼 관련 변수가 흩어짐\n" +
        "3. **함수 인수 폭발** — 관련 데이터를 함수에 넘기려면 매개변수가 늘어남\n\n" +
        "또한 ES5까지는 객체를 생성할 때 키와 변수명이 같아도 `{ name: name }`처럼 반복해야 했고, " +
        "메서드 정의도 `{ greet: function() {} }`처럼 장황했습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "자바스크립트의 **객체 리터럴**은 `{ key: value }` 형태로 관련 데이터를 하나의 단위로 묶습니다.\n\n" +
        "### 프로퍼티 접근\n" +
        "- **점 표기법** `obj.key` — 식별자로 유효한 키에 사용\n" +
        "- **괄호 표기법** `obj['key']` — 변수·특수문자·공백 포함 키에 사용\n\n" +
        "### 프로퍼티 추가·수정·삭제\n" +
        "`obj.newProp = value`로 추가, `delete obj.prop`로 삭제합니다. " +
        "이미 있는 키에 할당하면 덮어씁니다.\n\n" +
        "### ES6 단축 문법\n" +
        "- **프로퍼티 축약** — 변수명과 키가 같으면 `{ name }` 형태로 축약 가능\n" +
        "- **메서드 축약** — `greet() {}` 형태로 `function` 키워드 생략\n" +
        "- **계산된 프로퍼티명** — `{ [expr]: value }` 형태로 런타임에 키를 동적 결정\n\n" +
        "### 프로퍼티 열거\n" +
        "`for...in`은 프로토타입 체인까지 열거하므로 주의가 필요합니다. " +
        "`Object.keys()`, `Object.values()`, `Object.entries()`는 자신의 열거 가능 프로퍼티만 반환합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 계산된 프로퍼티명과 열거",
      content:
        "객체 리터럴의 핵심 동작을 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          "// 1. 객체 생성 및 기본 접근\n" +
          "const user = {\n" +
          "  name: 'Alice',\n" +
          "  age: 30,\n" +
          "  'job title': 'Engineer',   // 공백 포함 키\n" +
          "};\n" +
          "\n" +
          "user.name           // 'Alice' — 점 표기법\n" +
          "user['job title']   // 'Engineer' — 괄호 표기법\n" +
          "\n" +
          "// 2. 프로퍼티 추가 · 수정 · 삭제\n" +
          "user.email = 'alice@example.com';  // 추가\n" +
          "user.age = 31;                     // 수정\n" +
          "delete user['job title'];          // 삭제\n" +
          "\n" +
          "// 3. ES6 단축 문법\n" +
          "const name = 'Bob';\n" +
          "const age = 25;\n" +
          "const person = { name, age };     // 프로퍼티 축약\n" +
          "// 동일: { name: name, age: age }\n" +
          "\n" +
          "const obj = {\n" +
          "  greet() { return 'hi'; },       // 메서드 축약\n" +
          "};\n" +
          "\n" +
          "// 4. 계산된 프로퍼티명\n" +
          "const prefix = 'user';\n" +
          "const dynamic = {\n" +
          "  [prefix + 'Name']: 'Carol',    // 키: 'userName'\n" +
          "  [`${prefix}Age`]: 28,          // 키: 'userAge'\n" +
          "};\n" +
          "\n" +
          "// 5. 프로퍼티 열거\n" +
          "Object.keys(user)    // ['name', 'age', 'email']\n" +
          "Object.values(user)  // ['Alice', 31, 'alice@example.com']\n" +
          "Object.entries(user) // [['name','Alice'], ['age',31], ...]",
        description: "계산된 프로퍼티명은 동적으로 키를 결정할 때, 열거 메서드는 자신의 프로퍼티만 안전하게 순회할 때 사용합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 동적 폼 데이터 수집",
      content:
        "계산된 프로퍼티명과 단축 문법을 활용해 폼 입력을 동적으로 객체에 반영하는 패턴을 구현합니다.",
      code: {
        language: "javascript",
        code:
          "// 폼 필드 이름을 동적 키로 사용하여 상태 업데이트\n" +
          "function handleChange(fieldName, value) {\n" +
          "  return { [fieldName]: value };   // 계산된 프로퍼티명\n" +
          "}\n" +
          "\n" +
          "console.log(handleChange('email', 'a@b.com'));\n" +
          "// { email: 'a@b.com' }\n" +
          "\n" +
          "// 프로퍼티 축약 + 메서드 축약으로 간결한 모델 정의\n" +
          "function createUser(name, age) {\n" +
          "  return {\n" +
          "    name,              // 프로퍼티 축약\n" +
          "    age,               // 프로퍼티 축약\n" +
          "    greet() {          // 메서드 축약\n" +
          "      return `안녕하세요, ${this.name}입니다.`;\n" +
          "    },\n" +
          "  };\n" +
          "}\n" +
          "\n" +
          "const alice = createUser('Alice', 30);\n" +
          "console.log(alice.greet()); // '안녕하세요, Alice입니다.'\n" +
          "\n" +
          "// Object.entries로 객체를 안전하게 순회\n" +
          "const scores = { math: 90, english: 85, science: 92 };\n" +
          "for (const [subject, score] of Object.entries(scores)) {\n" +
          "  console.log(`${subject}: ${score}점`);\n" +
          "}\n" +
          "// math: 90점\n" +
          "// english: 85점\n" +
          "// science: 92점",
        description: "계산된 프로퍼티명은 React 폼 상태 업데이트처럼 키를 동적으로 결정해야 할 때 자주 사용됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 문법 | ES5 방식 | ES6+ 방식 |\n" +
        "|------|---------|----------|\n" +
        "| 프로퍼티 정의 | `{ name: name }` | `{ name }` |\n" +
        "| 메서드 정의 | `{ fn: function() {} }` | `{ fn() {} }` |\n" +
        "| 동적 키 | 별도 할당 필요 | `{ [expr]: val }` |\n" +
        "| 자신의 키 열거 | `for...in` + `hasOwnProperty` | `Object.keys()` |\n\n" +
        "**핵심:** 객체 리터럴은 관련 데이터를 하나의 단위로 묶는 가장 기본적인 자료구조입니다. " +
        "ES6 단축 문법을 적극 활용하면 코드가 간결해지고, `Object.keys/values/entries`로 " +
        "안전하게 열거하면 프로토타입 오염을 피할 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** 객체의 메서드 안에서 `this`가 어떤 값을 가리키는지, " +
        "호출 방식에 따라 어떻게 달라지는지를 깊이 탐구합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "객체는 관련된 데이터와 동작을 하나로 묶는 컨테이너다. 프로퍼티 축약, 계산된 프로퍼티명, 디스트럭처링을 활용하면 더 간결하게 다룰 수 있다.",
  checklist: [
    "객체 리터럴로 프로퍼티를 정의하고 접근할 수 있다",
    "점 표기법과 괄호 표기법의 차이와 사용 시기를 설명할 수 있다",
    "프로퍼티를 동적으로 추가·수정·삭제할 수 있다",
    "계산된 프로퍼티명을 활용해 동적 키를 갖는 객체를 생성할 수 있다",
    "프로퍼티 축약과 메서드 축약 문법을 이해하고 사용할 수 있다",
    "Object.keys/values/entries와 for...in의 차이를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "다음 중 괄호 표기법을 반드시 사용해야 하는 경우는?",
      choices: [
        "프로퍼티 키가 단순 영문 식별자일 때",
        "프로퍼티 키에 공백이 포함될 때",
        "프로퍼티 값이 함수일 때",
        "프로퍼티 값이 숫자일 때",
      ],
      correctIndex: 1,
      explanation:
        "점 표기법은 유효한 식별자(영문자·숫자·_·$로 구성)에만 사용할 수 있습니다. " +
        "공백, 특수문자, 예약어 등이 포함된 키는 괄호 표기법으로만 접근할 수 있습니다.",
    },
    {
      id: "q2",
      question: "const name = 'Alice'; const obj = { name };에서 obj.name의 값은?",
      choices: ["undefined", "'name'", "'Alice'", "ReferenceError"],
      correctIndex: 2,
      explanation:
        "프로퍼티 축약(shorthand) 문법은 변수명과 동일한 키를 자동 생성합니다. " +
        "`{ name }`은 `{ name: name }`과 동일하므로 obj.name은 'Alice'입니다.",
    },
    {
      id: "q3",
      question: "Object.keys()와 for...in의 가장 중요한 차이점은?",
      choices: [
        "Object.keys()는 배열을 반환하고, for...in은 반환값이 없다",
        "Object.keys()는 자신의 열거 가능 프로퍼티만 반환하고, for...in은 프로토타입 체인까지 열거한다",
        "for...in이 Object.keys()보다 빠르다",
        "Object.keys()는 메서드 키도 포함한다",
      ],
      correctIndex: 1,
      explanation:
        "for...in은 프로토타입 체인을 따라 상속된 열거 가능 프로퍼티까지 순회합니다. " +
        "Object.keys()는 해당 객체의 자신의 열거 가능 프로퍼티만 배열로 반환합니다.",
    },
    {
      id: "q4",
      question: "const key = 'score'; const obj = { [key]: 100 };에서 obj.score의 값은?",
      choices: ["undefined", "100", "key", "TypeError"],
      correctIndex: 1,
      explanation:
        "계산된 프로퍼티명(computed property name) `[key]`는 변수 key의 값인 'score'를 키로 사용합니다. " +
        "따라서 obj.score는 100입니다.",
    },
    {
      id: "q5",
      question: "다음 중 메서드 축약 문법으로 올바른 것은?",
      choices: [
        "const obj = { greet: () => 'hi' };",
        "const obj = { greet: function() { return 'hi'; } };",
        "const obj = { greet() { return 'hi'; } };",
        "const obj = { function greet() { return 'hi'; } };",
      ],
      correctIndex: 2,
      explanation:
        "메서드 축약 문법은 `methodName() {}` 형태로 function 키워드를 생략합니다. " +
        "화살표 함수는 this 바인딩이 다르므로 메서드 축약과 동일하지 않습니다.",
    },
    {
      id: "q6",
      question: "delete obj.name 이후 obj.name에 접근하면?",
      choices: ["null", "undefined", "ReferenceError", "TypeError"],
      correctIndex: 1,
      explanation:
        "delete 연산자로 프로퍼티를 삭제하면 해당 키 자체가 객체에서 제거됩니다. " +
        "존재하지 않는 프로퍼티에 접근하면 undefined가 반환됩니다.",
    },
    {
      id: "q7",
      question: "Object.entries({ a: 1, b: 2 })의 반환값은?",
      choices: [
        "['a', 'b']",
        "[1, 2]",
        "[['a', 1], ['b', 2]]",
        "{ a: 1, b: 2 }",
      ],
      correctIndex: 2,
      explanation:
        "Object.entries()는 [키, 값] 쌍의 배열을 반환합니다. " +
        "각 요소가 [key, value] 형태의 배열이므로 구조 분해 할당과 함께 자주 사용됩니다.",
    },
  ],
};

export default chapter;
