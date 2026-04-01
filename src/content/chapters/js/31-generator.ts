import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "31-generator",
  subject: "js",
  title: "제너레이터와 yield",
  description: "function*과 yield로 실행을 일시 정지할 수 있는 함수를 만드는 방법, 이터러블 자동 구현, 무한 시퀀스, 비동기 제너레이터까지 깊이 이해합니다.",
  order: 31,
  group: "이터러블과 제너레이터",
  prerequisites: ["30-iterable"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "제너레이터는 '책갈피가 있는 요리사'와 같습니다.\n\n" +
        "일반 함수는 요리를 시작하면 다 완성될 때까지 멈추지 않습니다. 하지만 제너레이터 요리사는 매 단계마다 '여기까지 했어요! 다음에 계속할게요'라고 말하며 재료를 건네줍니다. 그리고 당신이 '계속해'라고 할 때까지 대기합니다.\n\n" +
        "**`function*`** — 제너레이터 함수 선언. 호출해도 즉시 실행되지 않고 제너레이터 객체를 반환합니다.\n\n" +
        "**`yield`** — '지금까지 만든 것 드세요, 저는 여기서 대기할게요'. 값을 밖으로 보내고 실행을 일시 정지합니다.\n\n" +
        "**`next()`** — '요리사, 계속 해주세요'. 실행을 재개하고 다음 yield 또는 return까지 달립니다.\n\n" +
        "이 '일시 정지와 재개' 능력 덕분에 제너레이터는 무한한 시퀀스를 메모리 폭발 없이 처리하고, 비동기 코드를 동기처럼 작성하는 패턴을 가능하게 합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "다음과 같은 상황들을 일반 함수로는 우아하게 처리하기 어렵습니다.\n\n" +
        "**1. 무한 시퀀스** — 피보나치 수열이나 자연수 같이 끝없는 시퀀스를 메모리에 다 담을 수 없습니다.\n\n" +
        "```js\n" +
        "// 무한 배열? 불가능!\n" +
        "const allNaturalNumbers = [1, 2, 3, ...]; // 메모리 초과\n" +
        "```\n\n" +
        "**2. 상태를 유지하는 이터레이터** — 이전 챕터에서 봤듯이 커스텀 이터러블을 만들려면 클로저와 `Symbol.iterator` 구현이 필요해 코드가 복잡해집니다.\n\n" +
        "**3. 지연 평가(Lazy Evaluation)** — 100만 개의 데이터를 필터링할 때, 필요한 것만 그때그때 계산하고 싶습니다. 전부 배열로 만들면 불필요한 연산이 많습니다.\n\n" +
        "**4. 비동기 흐름 제어** — async/await 이전 시대에는 비동기 코드를 순서대로 표현하기가 매우 어려웠습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "제너레이터(Generator)는 이 모든 문제를 우아하게 해결하는 특별한 함수입니다.\n\n" +
        "### function*과 yield\n\n" +
        "`function*`으로 선언한 함수는 호출 시 **GeneratorObject**를 반환합니다. 이 객체는 자동으로 이터레이터이자 이터러블입니다.\n\n" +
        "- **`yield 값`** — 외부로 값을 방출하고 실행 일시 정지\n" +
        "- **`yield* 이터러블`** — 다른 이터러블에 순회를 위임\n" +
        "- **`next(인자)`** — 실행 재개. 인자는 yield 표현식의 결과값이 됨\n\n" +
        "### 제너레이터의 3가지 메서드\n\n" +
        "- **`next(value?)`** — 다음 yield 또는 return까지 실행. `{ value, done }` 반환\n" +
        "- **`return(value)`** — 제너레이터를 조기 종료. `{ value, done: true }` 반환\n" +
        "- **`throw(error)`** — 제너레이터 내부로 에러를 투척. 제너레이터 안에서 try/catch로 잡을 수 있음\n\n" +
        "### 자동 이터러블 구현\n\n" +
        "제너레이터 함수로 이전 챕터의 range 이터러블을 훨씬 간단히 작성할 수 있습니다:\n\n" +
        "```js\n" +
        "function* range(from, to) {\n" +
        "  for (let i = from; i <= to; i++) {\n" +
        "    yield i;\n" +
        "  }\n" +
        "}\n" +
        "// 자동으로 이터러블! Symbol.iterator, next(), {value, done} 모두 구현됨\n" +
        "console.log([...range(1, 5)]); // [1, 2, 3, 4, 5]\n" +
        "```\n\n" +
        "### 비동기 제너레이터 (Async Generator)\n\n" +
        "`async function*`으로 선언하면 비동기 이터러블이 됩니다. `for await...of`로 순회합니다.\n\n" +
        "```js\n" +
        "async function* fetchPages(url) {\n" +
        "  let page = 1;\n" +
        "  while (true) {\n" +
        "    const data = await fetch(`${url}?page=${page++}`);\n" +
        "    const json = await data.json();\n" +
        "    if (!json.length) return;\n" +
        "    yield json;\n" +
        "  }\n" +
        "}\n" +
        "```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 제너레이터 실행 흐름",
      content:
        "제너레이터가 일시 정지하고 재개될 때 내부 상태가 어떻게 관리되는지 살펴봅니다.",
      code: {
        language: "javascript",
        code:
          "// === 기본 제너레이터 동작 ===\n" +
          "function* counter() {\n" +
          "  console.log('시작');\n" +
          "  const x = yield 1;     // 1을 반환하고 정지. x는 next()의 인자\n" +
          "  console.log('x =', x); // x = 'hello'\n" +
          "  const y = yield 2;\n" +
          "  console.log('y =', y); // y = 'world'\n" +
          "  return 3;\n" +
          "}\n" +
          "\n" +
          "const gen = counter();\n" +
          "// 아직 아무것도 실행 안됨!\n" +
          "\n" +
          "gen.next();           // { value: 1, done: false }  + '시작' 출력\n" +
          "gen.next('hello');    // { value: 2, done: false }  + 'x = hello' 출력\n" +
          "gen.next('world');    // { value: 3, done: true }   + 'y = world' 출력\n" +
          "gen.next();           // { value: undefined, done: true }\n" +
          "\n" +
          "// === 무한 시퀀스 ===\n" +
          "function* fibonacci() {\n" +
          "  let [a, b] = [0, 1];\n" +
          "  while (true) {\n" +
          "    yield a;\n" +
          "    [a, b] = [b, a + b];\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "function take(n, iterable) {\n" +
          "  const result = [];\n" +
          "  for (const val of iterable) {\n" +
          "    result.push(val);\n" +
          "    if (result.length >= n) break; // 필요한 만큼만!\n" +
          "  }\n" +
          "  return result;\n" +
          "}\n" +
          "\n" +
          "console.log(take(8, fibonacci())); // [0,1,1,2,3,5,8,13]\n" +
          "\n" +
          "// === yield* 위임 ===\n" +
          "function* concat(...iterables) {\n" +
          "  for (const iterable of iterables) {\n" +
          "    yield* iterable; // 이터러블의 모든 값을 yield\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "console.log([...concat([1,2], [3,4], [5])]); // [1,2,3,4,5]",
        description: "첫 번째 next()는 인자가 무시됩니다. 두 번째부터의 next(값)은 직전 yield 표현식의 결과가 됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 지연 평가 파이프라인",
      content:
        "제너레이터로 map, filter를 지연 평가(lazy)로 구현해 대용량 데이터를 메모리 효율적으로 처리합니다.",
      code: {
        language: "javascript",
        code:
          "// 지연 평가 파이프라인 구현\n" +
          "function* lazyMap(iterable, fn) {\n" +
          "  for (const item of iterable) {\n" +
          "    yield fn(item); // 하나씩 변환\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "function* lazyFilter(iterable, pred) {\n" +
          "  for (const item of iterable) {\n" +
          "    if (pred(item)) yield item; // 조건 충족 시만\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "function* range(start, end) {\n" +
          "  for (let i = start; i <= end; i++) yield i;\n" +
          "}\n" +
          "\n" +
          "// 1~1,000,000 중 짝수의 제곱, 처음 5개만\n" +
          "// 배열 방식: 100만개 생성 → 50만개 필터 → 50만개 변환 → 5개 취함 (낭비!)\n" +
          "// 지연 평가: 처음 5개 조건 충족까지만 계산 (효율적!)\n" +
          "const pipeline = lazyFilter(\n" +
          "  lazyMap(\n" +
          "    range(1, 1_000_000),\n" +
          "    n => n * n          // 제곱\n" +
          "  ),\n" +
          "  n => n % 2 === 0     // 짝수만\n" +
          ");\n" +
          "\n" +
          "const results = [];\n" +
          "for (const val of pipeline) {\n" +
          "  results.push(val);\n" +
          "  if (results.length === 5) break;\n" +
          "}\n" +
          "console.log(results); // [4, 16, 36, 64, 100]\n" +
          "\n" +
          "// === throw()로 에러 처리 ===\n" +
          "function* safeDivider() {\n" +
          "  while (true) {\n" +
          "    try {\n" +
          "      const n = yield;\n" +
          "      yield 100 / n;\n" +
          "    } catch (e) {\n" +
          "      console.log('에러 잡힘:', e.message);\n" +
          "      yield 0; // 기본값 반환\n" +
          "    }\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "const divider = safeDivider();\n" +
          "divider.next();         // 준비\n" +
          "divider.next(5);        // { value: 20, done: false }\n" +
          "divider.next();         // 다음 입력 대기\n" +
          "divider.throw(new Error('0으로 나누기')); // 에러 잡힘 + { value: 0, done: false }",
        description: "제너레이터 기반 지연 평가는 배열 전체를 미리 계산하지 않아 대용량 데이터 처리 시 메모리를 크게 절약합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 메서드 | 동작 | 반환값 |\n" +
        "|--------|------|--------|\n" +
        "| `next(value?)` | 다음 yield까지 실행 | `{ value: yieldValue, done }` |\n" +
        "| `return(value)` | 즉시 종료 | `{ value, done: true }` |\n" +
        "| `throw(error)` | 내부에 에러 투척 | 내부에서 잡으면 계속, 아니면 propagate |\n\n" +
        "**제너레이터는 자동으로:** 이터레이터 + 이터러블 프로토콜 구현, `Symbol.iterator`가 `this` 반환\n\n" +
        "**주요 활용 사례:**\n" +
        "- 무한 시퀀스 (피보나치, 자연수 등)\n" +
        "- 커스텀 이터러블 간편 구현\n" +
        "- 지연 평가 파이프라인\n" +
        "- 비동기 제너레이터(`async function*`)로 스트리밍 처리\n\n" +
        "**핵심:** `yield`는 함수 실행을 일시 정지하고 값을 외부로 전달합니다. `next(인자)`로 재개하면 그 인자가 yield 표현식의 결과가 됩니다.\n\n" +
        "**다음 챕터 미리보기:** Symbol 타입 전체를 살펴보며 Symbol.iterator 외에도 다양한 Well-known Symbol이 있음을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "제너레이터는 실행을 중간에 멈추고(yield) 나중에 재개할 수 있는 특별한 함수다. 이터러블 프로토콜과 결합하면 지연 평가와 무한 시퀀스를 우아하게 구현할 수 있다.",
  checklist: [
    "function*으로 제너레이터 함수를 선언하고 yield로 값을 방출할 수 있다",
    "next(), return(), throw()의 동작 방식을 설명할 수 있다",
    "next(값)을 통해 제너레이터에 값을 전달하는 방법을 이해한다",
    "제너레이터가 자동으로 이터러블임을 설명할 수 있다",
    "무한 시퀀스를 제너레이터로 구현할 수 있다",
    "yield*로 다른 이터러블에 위임하는 방법을 알고 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "function*을 호출하면 즉시 발생하는 것은?",
      choices: [
        "첫 번째 yield까지 실행된다",
        "함수 본문 전체가 실행된다",
        "GeneratorObject(이터레이터)가 반환되고 아무것도 실행되지 않는다",
        "SyntaxError가 발생한다",
      ],
      correctIndex: 2,
      explanation: "제너레이터 함수를 호출하면 GeneratorObject를 즉시 반환하지만 함수 본문은 전혀 실행되지 않습니다. 첫 번째 next()를 호출해야 첫 번째 yield까지 실행됩니다.",
    },
    {
      id: "q2",
      question: "gen.next('hello')처럼 next()에 인자를 전달하면?",
      choices: [
        "무시된다",
        "직전 yield 표현식의 결과값이 된다",
        "다음 yield 표현식의 값이 된다",
        "제너레이터를 재시작한다",
      ],
      correctIndex: 1,
      explanation: "next(값)의 인자는 현재 일시 정지된 yield 표현식의 평가 결과가 됩니다. 예를 들어 const x = yield 1에서 정지 후 next('hello')를 호출하면 x에 'hello'가 할당됩니다. 첫 번째 next()의 인자는 무시됩니다.",
    },
    {
      id: "q3",
      question: "yield* iterable의 동작은?",
      choices: [
        "iterable을 배열로 변환한다",
        "iterable 전체를 한 번에 yield한다",
        "iterable의 각 값을 차례로 yield에 위임한다",
        "iterable을 복사한다",
      ],
      correctIndex: 2,
      explanation: "yield*는 다른 이터러블(또는 제너레이터)의 모든 값을 순서대로 위임합니다. for...of로 순회하며 각 값을 yield하는 것과 동일하게 동작합니다.",
    },
    {
      id: "q4",
      question: "제너레이터 객체에 대해 틀린 설명은?",
      choices: [
        "이터레이터이다",
        "이터러블이다",
        "Symbol.iterator를 호출하면 자기 자신을 반환한다",
        "한 번 완료 후 다시 next()를 호출하면 처음부터 재시작한다",
      ],
      correctIndex: 3,
      explanation: "제너레이터가 완료(done: true)된 후 next()를 다시 호출하면 항상 { value: undefined, done: true }를 반환합니다. 처음부터 재시작하려면 제너레이터 함수를 다시 호출해 새 GeneratorObject를 만들어야 합니다.",
    },
    {
      id: "q5",
      question: "비동기 제너레이터(async function*)를 순회하는 올바른 방법은?",
      choices: [
        "for...of",
        "for await...of",
        "await gen.next()",
        "gen.forEach()",
      ],
      correctIndex: 1,
      explanation: "비동기 제너레이터는 각 next() 호출이 Promise를 반환하므로, for await...of를 사용해야 각 값을 비동기적으로 올바르게 순회할 수 있습니다.",
    },
    {
      id: "q6",
      question: "제너레이터 내부에서 throw()로 전달된 에러를 처리하지 않으면?",
      choices: [
        "에러가 무시된다",
        "제너레이터가 undefined를 반환한다",
        "에러가 호출자 쪽으로 전파되고 제너레이터는 종료된다",
        "제너레이터가 자동으로 재시작된다",
      ],
      correctIndex: 2,
      explanation: "gen.throw(error)를 호출했을 때 제너레이터 내부에서 try/catch로 잡지 않으면, 에러는 제너레이터 밖으로 전파되고 제너레이터는 done: true 상태로 종료됩니다.",
    },
  ],
};

export default chapter;
