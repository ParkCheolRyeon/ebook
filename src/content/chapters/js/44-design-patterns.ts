import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "44-design-patterns",
  subject: "js",
  title: "디자인 패턴 JS 활용",
  description: "자바스크립트로 구현하는 싱글턴, 옵저버, 팩토리, 전략, 모듈, 미들웨어, 데코레이터 패턴의 원리와 실전 활용을 깊이 이해합니다.",
  order: 44,
  group: "고급 패턴",
  prerequisites: ["43-proxy-reflect"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "디자인 패턴은 '건축의 표준 설계 도면'과 같습니다.\n\n" +
        "건축가들은 수천 년의 경험에서 '이런 문제가 생기면 이런 구조로 해결하면 좋다'는 패턴을 발견했습니다. 매번 새로 고민하지 않고 검증된 패턴을 적용합니다.\n\n" +
        "**싱글턴** — 건물에 중앙 제어실이 하나여야 하는 것처럼, 앱 전체에서 인스턴스가 하나여야 하는 경우.\n\n" +
        "**옵저버** — 신문 구독 시스템. 신문사(Subject)는 구독자(Observer)들에게 새 신문이 나오면 자동으로 배달합니다.\n\n" +
        "**팩토리** — 주문서(Factory)에 종류를 적으면 맞는 제품(객체)이 나옵니다. 생성 로직을 한 곳에 집중.\n\n" +
        "**전략** — 목적지는 같지만 교통수단(자동차/자전거/도보)을 바꿀 수 있습니다. 알고리즘을 교체 가능하게.\n\n" +
        "**미들웨어** — 공항 보안 검색대. 탑승 전 여러 검사(체크인 → 보안 → 출입국)를 순서대로 통과합니다.\n\n" +
        "**데코레이터** — 커피에 샷, 휘핑크림, 캐러멜을 추가하는 것처럼 기본 객체에 기능을 겹겹이 추가합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "디자인 패턴 없이 코딩하면 발생하는 문제들:\n\n" +
        "**코드 중복:** 비슷한 로직이 여러 곳에 흩어져 있어 수정 시 모두 찾아야 합니다.\n\n" +
        "**강한 결합:** 모듈 A가 모듈 B를 직접 참조해 B가 바뀌면 A도 바뀌어야 합니다.\n\n" +
        "**유지보수 어려움:** 코드의 의도가 불분명하고 변경에 취약합니다.\n\n" +
        "```js\n" +
        "// ❌ 패턴 없는 코드 — 결합, 중복, 불명확\n" +
        "function processOrder(order) {\n" +
        "  // 유효성 검사, 재고 확인, 결제, 알림 모두 여기에\n" +
        "  if (!order.items || order.items.length === 0) return;\n" +
        "  checkInventory(order); // 재고 모듈에 강하게 결합\n" +
        "  charge(order.total);    // 결제 모듈에 강하게 결합\n" +
        "  sendEmail(order.email); // 이메일 모듈에 강하게 결합\n" +
        "  // 새 단계를 추가하려면 이 함수를 수정해야 함!\n" +
        "}\n" +
        "```\n\n" +
        "디자인 패턴은 이런 문제들에 대한 검증된 해결책입니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. 싱글턴 패턴\n" +
        "```js\n" +
        "class Store {\n" +
        "  static #instance = null;\n" +
        "  static getInstance() {\n" +
        "    if (!Store.#instance) Store.#instance = new Store();\n" +
        "    return Store.#instance;\n" +
        "  }\n" +
        "  #state = {};\n" +
        "  get(key) { return this.#state[key]; }\n" +
        "  set(key, value) { this.#state[key] = value; }\n" +
        "}\n" +
        "// ESM에서는 모듈 자체가 싱글턴 역할\n" +
        "```\n\n" +
        "### 2. 옵저버 패턴 (EventEmitter)\n" +
        "```js\n" +
        "class EventEmitter {\n" +
        "  #listeners = new Map();\n" +
        "  on(event, fn) { /* 등록 */ }\n" +
        "  off(event, fn) { /* 제거 */ }\n" +
        "  emit(event, ...args) { /* 알림 */ }\n" +
        "}\n" +
        "```\n\n" +
        "### 3. 팩토리 패턴\n" +
        "```js\n" +
        "function createUser(type) {\n" +
        "  const types = { admin: AdminUser, guest: GuestUser };\n" +
        "  const UserClass = types[type];\n" +
        "  if (!UserClass) throw new Error(`Unknown type: ${type}`);\n" +
        "  return new UserClass();\n" +
        "}\n" +
        "```\n\n" +
        "### 4. 전략 패턴\n" +
        "```js\n" +
        "const sorters = {\n" +
        "  bubble: (arr) => { /* 버블 정렬 */ },\n" +
        "  quick:  (arr) => { /* 퀵 정렬 */ },\n" +
        "  merge:  (arr) => { /* 병합 정렬 */ },\n" +
        "};\n" +
        "// 전략을 런타임에 교체\n" +
        "const sort = (arr, strategy = 'quick') => sorters[strategy](arr);\n" +
        "```\n\n" +
        "### 5. 미들웨어 패턴 (Express, Redux)\n" +
        "```js\n" +
        "function compose(...fns) {\n" +
        "  return (ctx) => {\n" +
        "    let index = -1;\n" +
        "    function next(i) {\n" +
        "      if (i <= index) throw new Error('next() 중복 호출');\n" +
        "      index = i;\n" +
        "      const fn = fns[i];\n" +
        "      if (!fn) return;\n" +
        "      fn(ctx, () => next(i + 1));\n" +
        "    }\n" +
        "    next(0);\n" +
        "  };\n" +
        "}\n" +
        "```\n\n" +
        "### 6. 데코레이터 패턴\n" +
        "```js\n" +
        "function memoize(fn) {\n" +
        "  const cache = new Map();\n" +
        "  return function(...args) {\n" +
        "    const key = JSON.stringify(args);\n" +
        "    if (cache.has(key)) return cache.get(key);\n" +
        "    const result = fn.apply(this, args);\n" +
        "    cache.set(key, result);\n" +
        "    return result;\n" +
        "  };\n" +
        "}\n" +
        "const fastFib = memoize(fibonacci);\n" +
        "```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 미들웨어 파이프라인",
      content:
        "Express.js/Koa.js 스타일의 미들웨어 시스템을 구현합니다.",
      code: {
        language: "javascript",
        code:
          "// Express/Redux 스타일 미들웨어 구현\n" +
          "class Pipeline {\n" +
          "  #middlewares = [];\n" +
          "\n" +
          "  use(fn) {\n" +
          "    this.#middlewares.push(fn);\n" +
          "    return this; // 체이닝 가능\n" +
          "  }\n" +
          "\n" +
          "  async run(ctx) {\n" +
          "    let i = 0;\n" +
          "    const next = async () => {\n" +
          "      if (i < this.#middlewares.length) {\n" +
          "        const middleware = this.#middlewares[i++];\n" +
          "        await middleware(ctx, next);\n" +
          "      }\n" +
          "    };\n" +
          "    await next();\n" +
          "    return ctx;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// HTTP 요청 처리 파이프라인\n" +
          "const app = new Pipeline();\n" +
          "\n" +
          "// 미들웨어 1: 로깅\n" +
          "app.use(async (ctx, next) => {\n" +
          "  console.log(`[${new Date().toISOString()}] ${ctx.method} ${ctx.path}`);\n" +
          "  await next(); // 다음 미들웨어 실행\n" +
          "  console.log(`완료: ${ctx.status}`);\n" +
          "});\n" +
          "\n" +
          "// 미들웨어 2: 인증\n" +
          "app.use(async (ctx, next) => {\n" +
          "  if (!ctx.headers.authorization) {\n" +
          "    ctx.status = 401;\n" +
          "    return; // next 없이 반환 → 파이프라인 중단\n" +
          "  }\n" +
          "  ctx.user = await verifyToken(ctx.headers.authorization);\n" +
          "  await next();\n" +
          "});\n" +
          "\n" +
          "// 미들웨어 3: 비즈니스 로직\n" +
          "app.use(async (ctx, next) => {\n" +
          "  ctx.body = await fetchData(ctx.path, ctx.user);\n" +
          "  ctx.status = 200;\n" +
          "  await next();\n" +
          "});\n" +
          "\n" +
          "// 실행\n" +
          "const ctx = { method: 'GET', path: '/users', headers: { authorization: 'Bearer ...' } };\n" +
          "await app.run(ctx);",
        description: "미들웨어 패턴에서 next()를 호출하면 다음 미들웨어로 제어를 넘깁니다. next() 없이 반환하면 파이프라인이 중단됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: EventEmitter와 옵저버 패턴",
      content:
        "DOM 이벤트 시스템과 유사한 EventEmitter를 구현하고 실전 활용합니다.",
      code: {
        language: "javascript",
        code:
          "class EventEmitter {\n" +
          "  #listeners = new Map();\n" +
          "\n" +
          "  on(event, handler) {\n" +
          "    if (!this.#listeners.has(event)) {\n" +
          "      this.#listeners.set(event, new Set());\n" +
          "    }\n" +
          "    this.#listeners.get(event).add(handler);\n" +
          "    return () => this.off(event, handler); // unsubscribe 함수 반환\n" +
          "  }\n" +
          "\n" +
          "  once(event, handler) {\n" +
          "    const wrapper = (...args) => {\n" +
          "      handler(...args);\n" +
          "      this.off(event, wrapper);\n" +
          "    };\n" +
          "    return this.on(event, wrapper);\n" +
          "  }\n" +
          "\n" +
          "  off(event, handler) {\n" +
          "    this.#listeners.get(event)?.delete(handler);\n" +
          "  }\n" +
          "\n" +
          "  emit(event, ...args) {\n" +
          "    this.#listeners.get(event)?.forEach(handler => handler(...args));\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// 전역 이벤트 버스 (싱글턴)\n" +
          "const bus = new EventEmitter();\n" +
          "\n" +
          "// 사용자 서비스\n" +
          "const UserService = {\n" +
          "  login(user) {\n" +
          "    // 로그인 로직...\n" +
          "    bus.emit('user:login', user);\n" +
          "  },\n" +
          "  logout() {\n" +
          "    bus.emit('user:logout');\n" +
          "  }\n" +
          "};\n" +
          "\n" +
          "// 구독자들 — 느슨한 결합\n" +
          "const unsubAuth = bus.on('user:login', (user) => {\n" +
          "  console.log('Auth 모듈: 토큰 발급', user.id);\n" +
          "});\n" +
          "\n" +
          "bus.on('user:login', (user) => {\n" +
          "  console.log('Analytics: 로그인 이벤트 기록', user.id);\n" +
          "});\n" +
          "\n" +
          "bus.once('user:login', (user) => {\n" +
          "  console.log('최초 1회만: 환영 메시지 표시');\n" +
          "});\n" +
          "\n" +
          "UserService.login({ id: 1, name: 'Alice' });\n" +
          "// 세 핸들러 모두 실행\n" +
          "\n" +
          "UserService.login({ id: 2, name: 'Bob' });\n" +
          "// once 핸들러는 제외하고 두 핸들러만 실행\n" +
          "\n" +
          "// 구독 취소\n" +
          "unsubAuth(); // Auth 모듈 리스너 제거",
        description: "이벤트 버스 패턴은 모듈 간 직접 참조 없이 느슨한 통신을 가능하게 합니다. React의 Context, Redux, Vue의 EventBus가 이 원리를 사용합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 목적 | JS 예시 |\n" +
        "|------|------|--------|\n" +
        "| 싱글턴 | 인스턴스 1개 보장 | 전역 스토어, 설정 |\n" +
        "| 옵저버 | 느슨한 결합 통신 | EventEmitter, DOM 이벤트 |\n" +
        "| 팩토리 | 생성 로직 캡슐화 | createUser(), createElement |\n" +
        "| 전략 | 알고리즘 교체 | 정렬, 결제 방법 |\n" +
        "| 미들웨어 | 파이프라인 처리 | Express, Redux, Koa |\n" +
        "| 데코레이터 | 기능 동적 추가 | memoize, throttle, logger |\n\n" +
        "**패턴 선택 기준:**\n" +
        "- 인스턴스 1개 → 싱글턴 (하지만 ESM 모듈 자체가 싱글턴)\n" +
        "- 모듈 간 통신 → 옵저버\n" +
        "- 객체 생성 복잡 → 팩토리\n" +
        "- 알고리즘 교체 → 전략\n" +
        "- 순서 있는 처리 → 미들웨어\n" +
        "- 기능 추가 → 데코레이터\n\n" +
        "**다음 챕터 미리보기:** 함수형 프로그래밍의 핵심 개념(순수 함수, 불변성, 커링, 함수 합성)을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "싱글턴 패턴을 구현하고 ESM에서 자연스럽게 싱글턴이 되는 이유를 설명할 수 있다",
    "옵저버 패턴으로 EventEmitter를 구현할 수 있다",
    "팩토리 패턴으로 객체 생성 로직을 캡슐화할 수 있다",
    "전략 패턴으로 알고리즘을 교체 가능하게 설계할 수 있다",
    "미들웨어 파이프라인의 next() 흐름을 설명할 수 있다",
    "데코레이터 패턴으로 memoize, throttle 같은 함수 래퍼를 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "ESM(ES Modules)에서 별도 싱글턴 구현이 불필요한 이유는?",
      choices: [
        "ESM은 클래스를 지원하지 않기 때문",
        "ESM 모듈은 처음 import 시 한 번만 실행되고 이후에는 캐시된 같은 모듈 인스턴스를 반환하기 때문",
        "ESM은 전역 변수를 지원하지 않기 때문",
        "ESM에서는 싱글턴을 만들 수 없기 때문",
      ],
      correctIndex: 1,
      explanation: "ESM에서 모듈은 처음 import될 때 한 번만 실행됩니다. 이후 어디서 import해도 같은 모듈 인스턴스를 공유합니다. 따라서 모듈 레벨의 변수는 자동으로 싱글턴처럼 동작합니다.",
    },
    {
      id: "q2",
      question: "옵저버 패턴이 해결하는 핵심 문제는?",
      choices: [
        "객체 생성 비용 감소",
        "모듈 간 강한 결합(tight coupling) 제거 — 발행자와 구독자가 서로를 직접 참조하지 않음",
        "메모리 누수 방지",
        "비동기 처리 순서 보장",
      ],
      correctIndex: 1,
      explanation: "옵저버 패턴에서 발행자(Subject)는 구독자(Observer)를 직접 알지 못합니다. 이벤트를 emit하면 등록된 모든 구독자에게 알림이 갑니다. 이 느슨한 결합 덕분에 모듈을 독립적으로 개발/테스트할 수 있습니다.",
    },
    {
      id: "q3",
      question: "팩토리 패턴의 주요 장점은?",
      choices: [
        "객체를 불변으로 만드는 것",
        "객체 생성 로직을 한 곳에 집중해 클라이언트 코드가 구체 클래스에 의존하지 않게 하는 것",
        "싱글턴을 보장하는 것",
        "이벤트를 관리하는 것",
      ],
      correctIndex: 1,
      explanation: "팩토리 패턴은 생성 로직을 캡슐화합니다. 클라이언트는 어떤 구체 클래스가 생성되는지 알 필요 없이 팩토리에 요청만 합니다. 나중에 새 타입을 추가해도 팩토리만 수정하면 됩니다.",
    },
    {
      id: "q4",
      question: "미들웨어 패턴에서 next()를 호출하지 않으면?",
      choices: [
        "에러가 발생한다",
        "파이프라인이 해당 미들웨어에서 중단되고 이후 미들웨어는 실행되지 않는다",
        "자동으로 다음 미들웨어가 실행된다",
        "첫 번째 미들웨어로 돌아간다",
      ],
      correctIndex: 1,
      explanation: "미들웨어에서 next()를 호출하지 않으면 파이프라인이 그 자리에서 중단됩니다. Express에서 인증 미들웨어가 next() 없이 401을 반환하면 이후 라우터 핸들러가 실행되지 않습니다.",
    },
    {
      id: "q5",
      question: "데코레이터 패턴에서 memoize 함수의 역할은?",
      choices: [
        "함수를 비동기로 변환",
        "함수 호출 결과를 캐시해 같은 인자로 다시 호출하면 계산 없이 캐시된 값을 반환",
        "함수의 실행 순서를 보장",
        "함수를 싱글턴으로 만들기",
      ],
      correctIndex: 1,
      explanation: "memoize는 데코레이터 패턴의 전형적인 예입니다. 원래 함수를 감싸 처음 호출 결과를 캐시하고, 같은 인자로 다시 호출하면 캐시된 결과를 즉시 반환합니다. 피보나치 같은 재귀 계산에서 극적인 성능 향상을 가져옵니다.",
    },
    {
      id: "q6",
      question: "전략 패턴의 핵심 특징은?",
      choices: [
        "알고리즘을 런타임에 교체할 수 있다",
        "항상 최적의 알고리즘을 자동 선택한다",
        "알고리즘을 한 곳에 고정해 일관성을 보장한다",
        "비동기 알고리즘을 동기로 변환한다",
      ],
      correctIndex: 0,
      explanation: "전략 패턴은 알고리즘을 독립적인 클래스/함수로 캡슐화해 런타임에 교체 가능하게 합니다. 정렬 방법, 결제 방법, 압축 방식 등을 조건에 따라 바꿀 때 if-else 대신 전략 패턴을 사용하면 코드가 확장에 열려 있게 됩니다.",
    },
  ],
};

export default chapter;
