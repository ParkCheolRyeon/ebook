import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "45-functional-programming",
  subject: "js",
  title: "함수형 프로그래밍 기초",
  description: "순수 함수, 불변성, 고차 함수, 커링, 함수 합성, pipe/compose, 모나드 개념까지 자바스크립트 함수형 프로그래밍의 핵심을 깊이 이해합니다.",
  order: 45,
  group: "고급 패턴",
  prerequisites: ["44-design-patterns"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "함수형 프로그래밍은 '수학의 함수처럼 코드 짜기'입니다.\n\n" +
        "수학에서 f(x) = x * 2는 항상 같은 x를 넣으면 같은 결과가 나옵니다. 외부 세계에 영향을 주지도, 받지도 않습니다. 이런 함수를 **순수 함수(Pure Function)**라고 합니다.\n\n" +
        "**불변성(Immutability)**은 '원재료는 변경하지 않는다'는 원칙입니다. 재료를 가공할 때 원재료를 바꾸는 것이 아니라 새 결과물을 만듭니다.\n\n" +
        "**커링(Currying)**은 여러 재료를 한 번에 받지 않고, 하나씩 받아 부분적으로 완성하는 요리입니다. `add(1)(2)(3)`처럼 인자를 하나씩 적용합니다.\n\n" +
        "**함수 합성(Composition)**은 '음식 조리 라인'입니다. 재료 → 세척 → 절단 → 요리 → 담기. 각 단계가 함수이고, 연결해서 하나의 파이프라인을 만듭니다.\n\n" +
        "**pipe(f, g, h)**는 왼쪽에서 오른쪽으로 흐르는 컨베이어 벨트입니다: 입력 → f → g → h → 출력.\n\n" +
        "**compose(f, g, h)**는 오른쪽에서 왼쪽으로: 수학의 f(g(h(x))) 표기와 같습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "명령형 코드의 문제들:\n\n" +
        "```js\n" +
        "// ❌ 부수 효과가 있는 함수 — 예측 불가\n" +
        "let total = 0;\n" +
        "function addToTotal(n) {\n" +
        "  total += n; // 외부 상태 변경 — 부수 효과!\n" +
        "  return total;\n" +
        "}\n" +
        "addToTotal(5); // 5\n" +
        "addToTotal(5); // 10 — 같은 입력, 다른 출력!\n" +
        "\n" +
        "// ❌ 가변 데이터 변경\n" +
        "function processUsers(users) {\n" +
        "  users.sort((a, b) => a.age - b.age); // 원본 배열 변경!\n" +
        "  users[0].processed = true;           // 원본 객체 변경!\n" +
        "  return users;\n" +
        "}\n" +
        "// 원본 데이터가 손상되어 다른 곳에서 에러 발생\n" +
        "```\n\n" +
        "이런 코드는:\n" +
        "1. 테스트가 어렵습니다 (외부 상태에 의존)\n" +
        "2. 버그 추적이 어렵습니다 (언제 어디서 상태가 바뀌었는지 알 수 없음)\n" +
        "3. 병렬 처리가 위험합니다 (공유 상태 경쟁 조건)\n" +
        "4. 재사용하기 어렵습니다 (외부 상태에 묶여 있음)",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. 순수 함수 (Pure Functions)\n\n" +
        "- 같은 입력 → 항상 같은 출력\n" +
        "- 부수 효과(Side Effect) 없음\n\n" +
        "```js\n" +
        "// ✅ 순수 함수\n" +
        "const add = (a, b) => a + b; // 항상 a+b 반환\n" +
        "const double = (x) => x * 2;\n" +
        "```\n\n" +
        "### 2. 불변성 (Immutability)\n\n" +
        "```js\n" +
        "// ✅ 원본 보존 — 새 배열/객체 반환\n" +
        "const sorted = [...users].sort((a, b) => a.age - b.age); // 원본 보존\n" +
        "const updated = users.map(u => u.id === 1 ? { ...u, processed: true } : u);\n" +
        "```\n\n" +
        "### 3. 고차 함수 (Higher-Order Functions)\n\n" +
        "함수를 인자로 받거나 반환하는 함수입니다.\n" +
        "```js\n" +
        "const map = (fn) => (arr) => arr.map(fn);\n" +
        "const filter = (pred) => (arr) => arr.filter(pred);\n" +
        "const double = map(x => x * 2);\n" +
        "double([1, 2, 3]); // [2, 4, 6]\n" +
        "```\n\n" +
        "### 4. 커링 (Currying)\n\n" +
        "```js\n" +
        "// 일반 함수\n" +
        "const add = (a, b) => a + b;\n" +
        "// 커링\n" +
        "const curriedAdd = (a) => (b) => a + b;\n" +
        "const add5 = curriedAdd(5); // 부분 적용\n" +
        "add5(3);  // 8\n" +
        "add5(10); // 15\n" +
        "```\n\n" +
        "### 5. 함수 합성\n\n" +
        "```js\n" +
        "// pipe: 왼쪽→오른쪽\n" +
        "const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);\n" +
        "// compose: 오른쪽→왼쪽\n" +
        "const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);\n" +
        "\n" +
        "const processName = pipe(\n" +
        "  str => str.trim(),\n" +
        "  str => str.toLowerCase(),\n" +
        "  str => str.replace(/ /g, '_')\n" +
        ");\n" +
        "processName('  Hello World  '); // 'hello_world'\n" +
        "```\n\n" +
        "### 6. 모나드(Monad) 개념\n\n" +
        "값을 컨텍스트로 감싸고, 컨텍스트 안에서 안전하게 변환하는 패턴입니다.\n\n" +
        "`Maybe` 모나드: null/undefined를 안전하게 처리\n" +
        "```js\n" +
        "class Maybe {\n" +
        "  static of = (value) => new Maybe(value);\n" +
        "  map = (fn) => this.value == null ? this : Maybe.of(fn(this.value));\n" +
        "  getOrElse = (defaultValue) => this.value ?? defaultValue;\n" +
        "}\n" +
        "```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 완전한 함수형 유틸리티",
      content:
        "커리, 파이프, compose와 Maybe 모나드를 구현합니다.",
      code: {
        language: "javascript",
        code:
          "// === curry: N항 함수를 커링 ===\n" +
          "function curry(fn) {\n" +
          "  return function curried(...args) {\n" +
          "    if (args.length >= fn.length) {\n" +
          "      return fn.apply(this, args); // 인자 충족 → 실행\n" +
          "    }\n" +
          "    return function(...moreArgs) {\n" +
          "      return curried.apply(this, args.concat(moreArgs)); // 부분 적용\n" +
          "    };\n" +
          "  };\n" +
          "}\n" +
          "\n" +
          "const add = curry((a, b, c) => a + b + c);\n" +
          "add(1)(2)(3);   // 6\n" +
          "add(1, 2)(3);   // 6\n" +
          "add(1)(2, 3);   // 6\n" +
          "add(1, 2, 3);   // 6\n" +
          "\n" +
          "// === pipe + compose ===\n" +
          "const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);\n" +
          "const compose = (...fns) => pipe(...fns.reverse());\n" +
          "\n" +
          "// 데이터 변환 파이프라인\n" +
          "const processUser = pipe(\n" +
          "  user => ({ ...user, name: user.name.trim() }),\n" +
          "  user => ({ ...user, email: user.email.toLowerCase() }),\n" +
          "  user => ({ ...user, age: Number(user.age) }),\n" +
          "  user => ({ ...user, active: user.age >= 18 }),\n" +
          ");\n" +
          "\n" +
          "const result = processUser({ name: ' Alice ', email: 'ALICE@EMAIL.COM', age: '25' });\n" +
          "// { name: 'Alice', email: 'alice@email.com', age: 25, active: true }\n" +
          "\n" +
          "// === Maybe 모나드 ===\n" +
          "class Maybe {\n" +
          "  constructor(value) { this.value = value; }\n" +
          "  static of(value) { return new Maybe(value); }\n" +
          "  isNothing() { return this.value == null; }\n" +
          "  map(fn) {\n" +
          "    return this.isNothing() ? this : Maybe.of(fn(this.value));\n" +
          "  }\n" +
          "  chain(fn) { return this.isNothing() ? this : fn(this.value); }\n" +
          "  getOrElse(defaultValue) { return this.isNothing() ? defaultValue : this.value; }\n" +
          "}\n" +
          "\n" +
          "// null 체크 없이 안전한 탐색\n" +
          "const getCity = (user) =>\n" +
          "  Maybe.of(user)\n" +
          "    .map(u => u.address)\n" +
          "    .map(a => a.city)\n" +
          "    .map(c => c.toUpperCase())\n" +
          "    .getOrElse('UNKNOWN');\n" +
          "\n" +
          "getCity({ address: { city: 'seoul' } }); // 'SEOUL'\n" +
          "getCity({ address: null });               // 'UNKNOWN'\n" +
          "getCity(null);                            // 'UNKNOWN'",
        description: "Maybe 모나드는 null/undefined 체크를 체인 내부로 숨겨 코드를 간결하게 합니다. 자바스크립트의 Optional chaining(?.)이 비슷한 역할을 합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 함수형 데이터 처리 파이프라인",
      content:
        "순수 함수, 불변성, 파이프를 활용해 실전 데이터 처리 시스템을 구현합니다.",
      code: {
        language: "javascript",
        code:
          "// 함수형 방식의 사용자 데이터 처리\n" +
          "\n" +
          "// 순수 함수들 (각각 단일 책임, 테스트 용이)\n" +
          "const normalize = (user) => ({\n" +
          "  ...user,\n" +
          "  name: user.name?.trim() ?? '',\n" +
          "  email: user.email?.toLowerCase() ?? '',\n" +
          "});\n" +
          "\n" +
          "const validate = (user) => {\n" +
          "  if (!user.email.includes('@')) throw new Error(`Invalid email: ${user.email}`);\n" +
          "  if (user.name.length < 2) throw new Error(`Name too short: ${user.name}`);\n" +
          "  return user;\n" +
          "};\n" +
          "\n" +
          "const enrich = (user) => ({\n" +
          "  ...user,\n" +
          "  id: crypto.randomUUID(),\n" +
          "  createdAt: new Date().toISOString(),\n" +
          "  role: 'user',\n" +
          "});\n" +
          "\n" +
          "// 파이프라인 조합\n" +
          "const createUser = pipe(normalize, validate, enrich);\n" +
          "\n" +
          "// 배열 처리 — 불변\n" +
          "const rawUsers = [\n" +
          "  { name: ' Alice  ', email: 'Alice@Email.COM' },\n" +
          "  { name: 'B', email: 'invalid-email' },  // validate에서 에러\n" +
          "  { name: ' Charlie ', email: 'Charlie@Test.COM' },\n" +
          "];\n" +
          "\n" +
          "// Result 패턴으로 에러 처리\n" +
          "const results = rawUsers.map(user => {\n" +
          "  try {\n" +
          "    return { ok: true, value: createUser(user) };\n" +
          "  } catch (e) {\n" +
          "    return { ok: false, error: e.message };\n" +
          "  }\n" +
          "});\n" +
          "\n" +
          "const valid = results.filter(r => r.ok).map(r => r.value);\n" +
          "const invalid = results.filter(r => !r.ok).map(r => r.error);\n" +
          "\n" +
          "console.log('유효한 사용자:', valid.length);   // 2\n" +
          "console.log('유효하지 않은:', invalid);         // ['Name too short: B']\n" +
          "// rawUsers는 변경되지 않음!",
        description: "함수형 파이프라인은 각 변환 단계를 독립적으로 테스트할 수 있고, 새 단계를 추가하거나 제거하기 쉽습니다. 원본 데이터는 항상 보존됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 정의 | 장점 |\n" +
        "|------|------|------|\n" +
        "| 순수 함수 | 같은 입력 → 같은 출력, 부수 효과 없음 | 테스트, 예측 가능성 |\n" +
        "| 불변성 | 데이터 변경 대신 새 값 생성 | 버그 방지, 시간 여행 디버깅 |\n" +
        "| 고차 함수 | 함수를 인자로 받거나 반환 | 추상화, 재사용성 |\n" +
        "| 커링 | 다항 함수를 단항 함수들로 분해 | 부분 적용, 재사용 |\n" +
        "| pipe | 왼쪽→오른쪽 함수 합성 | 읽기 쉬운 데이터 변환 |\n" +
        "| compose | 오른쪽→왼쪽 함수 합성 | 수학적 표기법 |\n" +
        "| Maybe 모나드 | null-safe 체인 처리 | null 체크 제거 |\n\n" +
        "**함수형 프로그래밍 원칙:**\n" +
        "1. 순수 함수를 선호하라\n" +
        "2. 데이터를 변경하지 말고 변환하라\n" +
        "3. 작은 함수들을 합성하라\n" +
        "4. 선언형(what)으로 표현하라, 명령형(how)이 아니라\n\n" +
        "**자바스크립트의 함수형 도구:** `Array.prototype.map/filter/reduce`, `Object.assign/spread`, `Promise.then(chain)`, Optional chaining `?.`\n\n" +
        "이 챕터로 JS 핵심 개념 1~45장이 완성되었습니다. 이터러블, 제너레이터, 심볼부터 모듈, 메모리 관리, DOM, 렌더링, 고급 패턴, 함수형 프로그래밍까지 자바스크립트의 깊이를 탐구했습니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "순수 함수의 두 가지 조건(결정론적, 부수 효과 없음)을 설명할 수 있다",
    "불변성을 지키며 배열과 객체를 변환할 수 있다(spread, map, filter)",
    "커링의 개념과 부분 적용을 이용한 함수 재사용을 구현할 수 있다",
    "pipe와 compose의 차이를 설명하고 직접 구현할 수 있다",
    "고차 함수를 만들고 함수 합성에 활용할 수 있다",
    "Maybe 모나드로 null-safe 체인 처리를 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "순수 함수(Pure Function)의 조건이 아닌 것은?",
      choices: [
        "같은 입력에 항상 같은 출력",
        "외부 상태를 변경하지 않음",
        "네트워크 요청을 수행하지 않음",
        "인자가 반드시 1개여야 함",
      ],
      correctIndex: 3,
      explanation: "순수 함수의 두 조건은 결정론성(같은 입력 → 같은 출력)과 부수 효과 없음(외부 상태 변경/의존 금지)입니다. 인자 수는 무관합니다. 네트워크 요청은 부수 효과이므로 순수 함수가 아닙니다.",
    },
    {
      id: "q2",
      question: "커링(Currying)의 주요 활용은?",
      choices: [
        "재귀 함수를 반복문으로 변환하기 위해",
        "다항 함수를 부분 적용해 재사용 가능한 특화 함수를 만들기 위해",
        "비동기 함수를 동기로 변환하기 위해",
        "함수의 실행 순서를 역전시키기 위해",
      ],
      correctIndex: 1,
      explanation: "커링은 n항 함수를 n개의 단항 함수로 변환합니다. add(1)처럼 일부 인자만 적용해 특화된 함수를 만들 수 있습니다. 예: add5 = add(5)로 '5를 더하는 함수'를 만들어 재사용합니다.",
    },
    {
      id: "q3",
      question: "pipe(f, g, h)(x)의 실행 순서는?",
      choices: [
        "h → g → f → x",
        "f(g(h(x)))",
        "f → g → h (왼쪽에서 오른쪽)",
        "x에 f, g, h를 동시에 적용",
      ],
      correctIndex: 2,
      explanation: "pipe는 왼쪽에서 오른쪽으로 함수를 적용합니다. pipe(f, g, h)(x) = h(g(f(x))). 반면 compose는 오른쪽에서 왼쪽으로: compose(f, g, h)(x) = f(g(h(x))). pipe가 코드 읽기 방향과 일치해 더 직관적입니다.",
    },
    {
      id: "q4",
      question: "불변성을 지키며 배열에 요소를 추가하는 방법은?",
      choices: [
        "arr.push(item)",
        "[...arr, item]",
        "arr[arr.length] = item",
        "arr.splice(arr.length, 0, item)",
      ],
      correctIndex: 1,
      explanation: "push(), splice(), 인덱스 할당은 원본 배열을 변경합니다. [...arr, item]은 원본을 보존하며 새 배열을 반환합니다. 함수형 프로그래밍에서는 spread, map, filter, concat 등 원본을 변경하지 않는 방법을 사용합니다.",
    },
    {
      id: "q5",
      question: "Maybe 모나드가 해결하는 문제는?",
      choices: [
        "비동기 처리 오류",
        "null/undefined 접근으로 인한 에러를 체인 전체에서 안전하게 처리",
        "타입 변환 오류",
        "무한 루프 방지",
      ],
      correctIndex: 1,
      explanation: "Maybe 모나드는 값이 null/undefined일 수 있는 상황을 컨텍스트로 감싸 처리합니다. map이 null을 만나면 체인의 나머지를 건너뛰어 에러 없이 안전하게 기본값을 반환합니다. 자바스크립트의 Optional chaining(?.)이 유사한 역할을 합니다.",
    },
    {
      id: "q6",
      question: "함수형 프로그래밍에서 '선언형(Declarative)'으로 코드를 작성한다는 의미는?",
      choices: [
        "함수를 선언만 하고 실행하지 않는 것",
        "무엇을(what) 할 것인지를 표현하며 어떻게(how) 할지는 추상화하는 것",
        "클래스 대신 함수만 사용하는 것",
        "코드에 주석을 많이 다는 것",
      ],
      correctIndex: 1,
      explanation: "선언형은 '무엇을 원하는가'를 표현합니다. arr.filter(isEven).map(double) — 짝수를 필터링하고 두 배로 만들어라. 명령형은 '어떻게 할 것인가'를 표현합니다: for 루프로 인덱스를 관리하며... 선언형이 더 읽기 쉽고 오류가 적습니다.",
    },
    {
      id: "q7",
      question: "고차 함수(Higher-Order Function)의 정의는?",
      choices: [
        "재귀 호출을 사용하는 함수",
        "함수를 인자로 받거나 함수를 반환하는 함수",
        "비동기적으로 실행되는 함수",
        "10줄 이상인 함수",
      ],
      correctIndex: 1,
      explanation: "고차 함수는 함수를 값으로 취급합니다. Array.prototype.map, filter, reduce가 대표적인 고차 함수입니다. 함수를 인자로 받거나(map(fn)), 함수를 반환합니다(curry(fn)). 자바스크립트에서 함수는 일급 객체이므로 고차 함수가 자연스럽게 지원됩니다.",
    },
  ],
};

export default chapter;
