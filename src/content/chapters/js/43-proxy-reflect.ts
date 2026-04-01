import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "43-proxy-reflect",
  subject: "js",
  title: "Proxy와 Reflect",
  description: "Proxy 핸들러 트랩(get/set/has/deleteProperty), Reflect API, 반응형 시스템 구현, Vue 3의 Proxy 기반 반응형 원리를 깊이 이해합니다.",
  order: 43,
  group: "고급 패턴",
  prerequisites: ["42-browser-rendering"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Proxy는 '비서(중간 관리자)'와 같습니다.\n\n" +
        "보통은 사장(객체)에게 직접 업무 요청을 합니다. 하지만 Proxy를 두면 모든 요청이 비서를 통해 가게 됩니다.\n\n" +
        "비서는 요청을 그대로 전달할 수도 있고, 거절할 수도 있고, 로그를 남길 수도 있고, 변형해서 전달할 수도 있습니다.\n\n" +
        "**핸들러 트랩:**\n" +
        "- `get` 트랩 — 누군가 사장의 정보를 요청할 때 (프로퍼티 읽기)\n" +
        "- `set` 트랩 — 누군가 사장의 정보를 변경하려 할 때 (프로퍼티 쓰기)\n" +
        "- `has` 트랩 — '이 정보가 있나요?' 질문할 때 (in 연산자)\n" +
        "- `deleteProperty` 트랩 — '이 정보를 삭제해도 될까요?' 요청할 때\n\n" +
        "**Reflect**는 '비서가 원래 규칙대로 처리하는 방법'을 제공합니다. `Reflect.get(target, key)`는 '원래대로라면 이렇게 처리됩니다'입니다.\n\n" +
        "**Vue 3**의 반응형 시스템은 정확히 이 Proxy를 사용합니다. 데이터가 읽히면 누가 읽었는지 기록(추적), 변경되면 기록된 곳을 업데이트(반응)합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "객체에 접근할 때 추가 로직을 실행하고 싶은 다양한 상황:\n\n" +
        "**1. 유효성 검사**\n" +
        "```js\n" +
        "const user = { age: -5 }; // 음수 나이 — 누가 막을 것인가?\n" +
        "user.age = -1;             // 조용히 설정됨\n" +
        "```\n\n" +
        "**2. 변경 감지 (반응형)**\n" +
        "```js\n" +
        "// 데이터가 변경될 때 UI를 업데이트하고 싶다\n" +
        "state.count = 1; // 이때 renderUI()가 자동으로 실행되려면?\n" +
        "```\n\n" +
        "**3. 존재하지 않는 프로퍼티 접근**\n" +
        "```js\n" +
        "const obj = {};\n" +
        "console.log(obj.nonExistent); // undefined — 에러 대신 기본값?\n" +
        "```\n\n" +
        "**ES5의 Object.defineProperty 한계:**\n" +
        "- 특정 프로퍼티에만 적용 가능 (동적 프로퍼티 추가 감지 불가)\n" +
        "- 배열 변이 메서드(push, pop 등) 감지 불가\n" +
        "- get/set만 지원\n\n" +
        "Vue 2는 Object.defineProperty를 사용해 이런 제약이 있었고, Vue 3는 Proxy로 해결했습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### Proxy 기본 문법\n\n" +
        "```js\n" +
        "const proxy = new Proxy(target, handler);\n" +
        "// target: 원본 객체\n" +
        "// handler: 트랩(가로채기) 함수들을 담은 객체\n" +
        "```\n\n" +
        "### 주요 트랩\n\n" +
        "| 트랩 | 가로채는 동작 |\n" +
        "|------|-------------|\n" +
        "| `get(target, key, receiver)` | 프로퍼티 읽기 |\n" +
        "| `set(target, key, value, receiver)` | 프로퍼티 쓰기 |\n" +
        "| `has(target, key)` | `in` 연산자 |\n" +
        "| `deleteProperty(target, key)` | `delete` 연산자 |\n" +
        "| `apply(target, thisArg, args)` | 함수 호출 |\n" +
        "| `construct(target, args)` | `new` 연산자 |\n" +
        "| `ownKeys(target)` | Object.keys 등 |\n\n" +
        "### Reflect API\n\n" +
        "Proxy 핸들러 안에서 '기본 동작'을 수행할 때 사용합니다. `Reflect`는 Proxy의 각 트랩에 대응하는 메서드를 제공합니다.\n\n" +
        "```js\n" +
        "const proxy = new Proxy(obj, {\n" +
        "  get(target, key, receiver) {\n" +
        "    // 로그 남기기 + 기본 동작 수행\n" +
        "    console.log(`${key} 읽힘`);\n" +
        "    return Reflect.get(target, key, receiver); // 기본 get 동작\n" +
        "  }\n" +
        "});\n" +
        "```\n\n" +
        "**receiver 파라미터:** 프로토타입 체인에서 `this` 바인딩을 올바르게 유지합니다. 항상 `Reflect.get/set`에 receiver를 전달해야 합니다.\n\n" +
        "### 반응형 시스템 원리\n\n" +
        "```\n" +
        "1. 데이터를 Proxy로 감쌈\n" +
        "2. get 트랩: 누가(어떤 effect) 데이터를 읽는지 추적\n" +
        "3. set 트랩: 데이터 변경 시 추적된 effect들 재실행\n" +
        "```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 반응형 시스템 구현",
      content:
        "Vue 3 reactive()의 핵심 원리를 직접 구현합니다.",
      code: {
        language: "javascript",
        code:
          "// === 미니 반응형 시스템 (Vue 3 원리) ===\n" +
          "\n" +
          "let activeEffect = null; // 현재 실행 중인 effect\n" +
          "const effectMap = new WeakMap(); // target → Map<key, Set<effect>>\n" +
          "\n" +
          "// effect 추적 (의존성 수집)\n" +
          "function track(target, key) {\n" +
          "  if (!activeEffect) return;\n" +
          "  let depsMap = effectMap.get(target);\n" +
          "  if (!depsMap) effectMap.set(target, (depsMap = new Map()));\n" +
          "  let deps = depsMap.get(key);\n" +
          "  if (!deps) depsMap.set(key, (deps = new Set()));\n" +
          "  deps.add(activeEffect);\n" +
          "}\n" +
          "\n" +
          "// 변경 알림 (트리거)\n" +
          "function trigger(target, key) {\n" +
          "  const depsMap = effectMap.get(target);\n" +
          "  if (!depsMap) return;\n" +
          "  const deps = depsMap.get(key);\n" +
          "  if (deps) deps.forEach(effect => effect());\n" +
          "}\n" +
          "\n" +
          "// Proxy 기반 반응형 객체\n" +
          "function reactive(target) {\n" +
          "  return new Proxy(target, {\n" +
          "    get(target, key, receiver) {\n" +
          "      track(target, key); // 읽힐 때 추적\n" +
          "      return Reflect.get(target, key, receiver);\n" +
          "    },\n" +
          "    set(target, key, value, receiver) {\n" +
          "      const result = Reflect.set(target, key, value, receiver);\n" +
          "      trigger(target, key); // 변경 시 트리거\n" +
          "      return result;\n" +
          "    }\n" +
          "  });\n" +
          "}\n" +
          "\n" +
          "// effect: 반응형 데이터가 변경될 때 자동 재실행\n" +
          "function effect(fn) {\n" +
          "  activeEffect = fn;\n" +
          "  fn(); // 실행하며 의존성 수집\n" +
          "  activeEffect = null;\n" +
          "}\n" +
          "\n" +
          "// === 사용 예시 ===\n" +
          "const state = reactive({ count: 0, name: 'Alice' });\n" +
          "\n" +
          "effect(() => {\n" +
          "  console.log(`count: ${state.count}`); // 처음 실행: 'count: 0'\n" +
          "});\n" +
          "\n" +
          "state.count = 1; // 자동으로 'count: 1' 출력!\n" +
          "state.count = 2; // 'count: 2' 출력!",
        description: "Vue 3, MobX, Solid.js 등의 반응형 시스템이 이 원리로 동작합니다. get에서 의존성을 추적하고, set에서 변경을 통지합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 유효성 검사 Proxy와 디버깅 Proxy",
      content:
        "실용적인 Proxy 활용 패턴을 구현합니다.",
      code: {
        language: "javascript",
        code:
          "// === 유효성 검사 Proxy ===\n" +
          "function createValidator(target, schema) {\n" +
          "  return new Proxy(target, {\n" +
          "    set(target, key, value, receiver) {\n" +
          "      const rule = schema[key];\n" +
          "      if (rule) {\n" +
          "        if (rule.type && typeof value !== rule.type) {\n" +
          "          throw new TypeError(`${key}는 ${rule.type} 타입이어야 합니다`);\n" +
          "        }\n" +
          "        if (rule.min !== undefined && value < rule.min) {\n" +
          "          throw new RangeError(`${key}는 ${rule.min} 이상이어야 합니다`);\n" +
          "        }\n" +
          "        if (rule.max !== undefined && value > rule.max) {\n" +
          "          throw new RangeError(`${key}는 ${rule.max} 이하여야 합니다`);\n" +
          "        }\n" +
          "      }\n" +
          "      return Reflect.set(target, key, value, receiver);\n" +
          "    }\n" +
          "  });\n" +
          "}\n" +
          "\n" +
          "const user = createValidator({}, {\n" +
          "  age:   { type: 'number', min: 0, max: 150 },\n" +
          "  name:  { type: 'string' },\n" +
          "  score: { type: 'number', min: 0, max: 100 }\n" +
          "});\n" +
          "\n" +
          "user.name = 'Alice';  // OK\n" +
          "user.age = 25;        // OK\n" +
          "// user.age = -1;     // RangeError: age는 0 이상이어야 합니다\n" +
          "// user.age = 'old';  // TypeError: age는 number 타입이어야 합니다\n" +
          "\n" +
          "// === 로깅/디버깅 Proxy ===\n" +
          "function createLogger(target, label = 'Proxy') {\n" +
          "  return new Proxy(target, {\n" +
          "    get(target, key, receiver) {\n" +
          "      const value = Reflect.get(target, key, receiver);\n" +
          "      if (typeof key === 'string' && !key.startsWith('_')) {\n" +
          "        console.log(`[${label}] GET ${key} =`, value);\n" +
          "      }\n" +
          "      return value;\n" +
          "    },\n" +
          "    set(target, key, value, receiver) {\n" +
          "      console.log(`[${label}] SET ${key} =`, value);\n" +
          "      return Reflect.set(target, key, value, receiver);\n" +
          "    },\n" +
          "    deleteProperty(target, key) {\n" +
          "      console.log(`[${label}] DELETE ${key}`);\n" +
          "      return Reflect.deleteProperty(target, key);\n" +
          "    }\n" +
          "  });\n" +
          "}\n" +
          "\n" +
          "const debugState = createLogger({ x: 1, y: 2 }, 'State');\n" +
          "debugState.x;       // [State] GET x = 1\n" +
          "debugState.z = 3;   // [State] SET z = 3\n" +
          "delete debugState.y; // [State] DELETE y",
        description: "Proxy는 기존 코드를 변경하지 않고 객체의 동작을 감싸서 기능을 추가할 수 있습니다. 테스트, 디버깅, 유효성 검사에 매우 유용합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**Proxy 핵심:** `new Proxy(target, handler)`로 객체 조작을 가로채는 래퍼 생성\n\n" +
        "| 트랩 | 가로채는 동작 | Reflect 대응 메서드 |\n" +
        "|------|-------------|-------------------|\n" +
        "| get | 프로퍼티 읽기 | Reflect.get |\n" +
        "| set | 프로퍼티 쓰기 | Reflect.set |\n" +
        "| has | in 연산자 | Reflect.has |\n" +
        "| deleteProperty | delete | Reflect.deleteProperty |\n" +
        "| apply | 함수 호출 | Reflect.apply |\n\n" +
        "**Reflect의 역할:** Proxy 핸들러 내에서 '기본 동작'을 수행하는 안전한 방법. receiver를 올바르게 전달해 프로토타입 체인의 this 바인딩 보존.\n\n" +
        "**실전 활용:**\n" +
        "- Vue 3 reactive() — 반응형 시스템\n" +
        "- 유효성 검사\n" +
        "- 불변 객체 (set 트랩에서 에러)\n" +
        "- 디버깅/로깅\n" +
        "- 기본값 제공\n\n" +
        "**다음 챕터 미리보기:** 자바스크립트에서 자주 사용되는 디자인 패턴들을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "Proxy의 기본 문법과 target/handler의 역할을 설명할 수 있다",
    "get, set, has, deleteProperty 트랩을 구현할 수 있다",
    "Reflect API를 사용해야 하는 이유와 receiver의 역할을 설명할 수 있다",
    "Proxy로 유효성 검사 래퍼를 구현할 수 있다",
    "반응형 시스템(track/trigger)의 기본 원리를 Proxy로 설명할 수 있다",
    "Vue 3의 reactive()가 Proxy를 사용하는 이유를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Proxy의 set 트랩이 반환해야 하는 값은?",
      choices: [
        "설정할 값",
        "true 또는 false (성공/실패 여부)",
        "undefined",
        "target 객체",
      ],
      correctIndex: 1,
      explanation: "set 트랩은 할당 성공 시 true, 실패 시 false를 반환해야 합니다. strict mode에서 false를 반환하면 TypeError가 발생합니다. 보통 Reflect.set()의 반환값을 그대로 반환합니다.",
    },
    {
      id: "q2",
      question: "Proxy 핸들러에서 Reflect.get(target, key, receiver)처럼 receiver를 전달해야 하는 이유는?",
      choices: [
        "성능 최적화를 위해",
        "프로토타입 체인에서 this 바인딩을 올바르게 유지하기 위해",
        "receiver 없이는 get 트랩이 동작하지 않기 때문",
        "순환 참조를 방지하기 위해",
      ],
      correctIndex: 1,
      explanation: "receiver는 프로퍼티 접근 시의 this입니다. 프로토타입 체인에서 getter가 있을 때 receiver를 올바르게 전달하지 않으면 this가 target이 아닌 proxy를 가리켜야 할 상황에서 잘못된 this가 됩니다.",
    },
    {
      id: "q3",
      question: "Vue 3의 반응형 시스템에서 get 트랩의 역할은?",
      choices: [
        "데이터를 변경하고 UI를 업데이트하는 것",
        "어떤 effect(컴포넌트)가 이 데이터를 읽고 있는지 추적(의존성 수집)하는 것",
        "데이터의 유효성을 검사하는 것",
        "데이터 변경을 막는 것",
      ],
      correctIndex: 1,
      explanation: "Vue 3의 reactive() 시스템에서 get 트랩은 현재 실행 중인 effect(렌더 함수 등)가 어떤 데이터를 읽는지 추적합니다. set 트랩은 데이터 변경 시 추적된 effect들을 재실행합니다.",
    },
    {
      id: "q4",
      question: "Proxy와 Object.defineProperty의 차이는?",
      choices: [
        "Proxy는 get만, Object.defineProperty는 set만 지원한다",
        "Proxy는 객체 전체를 감싸 동적 프로퍼티 추가도 감지하고 배열도 지원하지만, Object.defineProperty는 미리 알려진 특정 프로퍼티만 감시한다",
        "Proxy는 ES5에서, Object.defineProperty는 ES6에서 도입되었다",
        "둘은 완전히 동일한 기능을 제공한다",
      ],
      correctIndex: 1,
      explanation: "Object.defineProperty는 미리 정의된 프로퍼티에만 적용되어 동적으로 추가된 프로퍼티나 배열의 인덱스 변경을 감지하지 못합니다. Proxy는 객체 전체를 감싸 모든 프로퍼티 접근을 가로챌 수 있습니다.",
    },
    {
      id: "q5",
      question: "Reflect API를 사용하는 주된 이유는?",
      choices: [
        "Proxy보다 빠른 성능을 위해",
        "Proxy 핸들러 내에서 기본 동작을 안전하고 일관성 있게 수행하기 위해",
        "비동기 프록시를 구현하기 위해",
        "Proxy 없이 객체를 감시하기 위해",
      ],
      correctIndex: 1,
      explanation: "Reflect는 Proxy 각 트랩에 대응하는 메서드를 제공해 '기본 동작'을 쉽게 실행할 수 있게 합니다. Reflect.set은 불리언을 반환하고, 프로토타입 체인과 receiver를 올바르게 처리합니다.",
    },
  ],
};

export default chapter;
