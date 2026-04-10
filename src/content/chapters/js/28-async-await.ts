import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "28-async-await",
  subject: "js",
  title: "async/await",
  description: "async 함수와 await의 동작 원리, 에러 처리, 병렬 실행 패턴, top-level await, for await...of를 마스터합니다.",
  order: 28,
  group: "비동기",
  prerequisites: ["27-promise"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "async/await는 **비동기 코드를 동기처럼 읽히게 하는 번역기**입니다.\n\n" +
        "Promise 체이닝은 이렇게 읽힙니다:\n" +
        "'커피를 받으면 → 그러면 설탕을 넣을게요 → 그러면 저어요 → 그러면 마셔요'\n\n" +
        "async/await는 이렇게 읽힙니다:\n" +
        "'커피를 받는다. 설탕을 넣는다. 젓는다. 마신다.'\n\n" +
        "**핵심:** async/await는 Promise 위에 쌓인 문법적 설탕입니다. 새로운 비동기 메커니즘이 아닙니다. async 함수는 항상 Promise를 반환하고, await는 Promise가 정착될 때까지 해당 함수의 실행을 일시 정지합니다.\n\n" +
        "하지만 '일시 정지'는 **해당 함수 내부만** 정지합니다. 이벤트 루프 전체를 블로킹하지 않아서 다른 작업은 계속 실행됩니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "Promise 체이닝도 콜백 지옥보다는 낫지만 복잡한 비동기 로직에서는 여전히 읽기 어렵습니다:\n\n" +
        "```javascript\n" +
        "// Promise 체이닝\n" +
        "function getManagerName(userId) {\n" +
        "  return fetchUser(userId)\n" +
        "    .then(user => fetchUser(user.managerId))\n" +
        "    .then(manager => manager.name);\n" +
        "}\n" +
        "```\n\n" +
        "또한 조건 분기, 반복문과 섞이면 더욱 복잡해집니다:\n\n" +
        "```javascript\n" +
        "// 조건에 따른 비동기 처리를 Promise로 하면 복잡\n" +
        "function processItems(ids) {\n" +
        "  return ids.reduce((chain, id) =>\n" +
        "    chain.then(() => processItem(id))\n" +
        "  , Promise.resolve());\n" +
        "}\n" +
        "```\n\n" +
        "async/await는 이런 코드를 동기 스타일로 작성할 수 있게 해줍니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### async 함수\n" +
        "- `async` 키워드가 붙은 함수는 항상 Promise를 반환합니다.\n" +
        "- 반환값이 Promise가 아니면 자동으로 `Promise.resolve(값)`으로 래핑됩니다.\n" +
        "- 에러를 throw하면 `Promise.reject(에러)`가 됩니다.\n\n" +
        "### await\n" +
        "- `async` 함수 내부에서만 사용 가능합니다.\n" +
        "- Promise가 정착될 때까지 함수 실행을 일시 정지합니다.\n" +
        "- Promise 이외의 값에 await하면 그 값을 그대로 반환합니다.\n\n" +
        "### 에러 처리\n" +
        "- **try-catch**: 동기 코드처럼 에러 처리\n" +
        "- **`.catch()`**: 함수 호출 지점에서 처리\n" +
        "- 두 방식을 혼용할 수 있습니다\n\n" +
        "### 병렬 실행\n" +
        "```javascript\n" +
        "// 순차 실행 (느림)\n" +
        "const a = await fetchA(); // 완료 후\n" +
        "const b = await fetchB(); // 실행\n\n" +
        "// 병렬 실행 (빠름)\n" +
        "const [a, b] = await Promise.all([fetchA(), fetchB()]);\n" +
        "```\n\n" +
        "### top-level await (ES2022)\n" +
        "모듈의 최상위 레벨에서 await를 사용할 수 있습니다. async 함수 없이도 가능합니다.\n\n" +
        "### for await...of\n" +
        "비동기 이터러블을 순차적으로 처리할 때 사용합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: async/await가 Promise로 변환되는 과정",
      content:
        "async/await 코드가 내부적으로 어떻게 Promise로 동작하는지 대응 코드로 살펴봅니다.",
      code: {
        language: "javascript",
        code:
          "// === async/await 코드 ===\n" +
          "async function getManagerName(userId) {\n" +
          "  const user = await fetchUser(userId);\n" +
          "  const manager = await fetchUser(user.managerId);\n" +
          "  return manager.name;\n" +
          "}\n\n" +
          "// === 동등한 Promise 코드 ===\n" +
          "function getManagerName(userId) {\n" +
          "  return fetchUser(userId).then(user => {\n" +
          "    return fetchUser(user.managerId).then(manager => {\n" +
          "      return manager.name;\n" +
          "    });\n" +
          "  });\n" +
          "}\n\n" +
          "// === 에러 처리 비교 ===\n" +
          "// async/await 방식\n" +
          "async function safe() {\n" +
          "  try {\n" +
          "    const data = await riskyOperation();\n" +
          "    return data;\n" +
          "  } catch (e) {\n" +
          "    console.error('에러 처리:', e);\n" +
          "    return null;\n" +
          "  } finally {\n" +
          "    cleanup();\n" +
          "  }\n" +
          "}\n\n" +
          "// === 병렬 실행 패턴 ===\n" +
          "async function parallel() {\n" +
          "  // 먼저 Promise를 모두 시작 (병렬)\n" +
          "  const p1 = fetchUser(1);\n" +
          "  const p2 = fetchUser(2);\n" +
          "  const p3 = fetchUser(3);\n\n" +
          "  // 모두 완료될 때까지 대기\n" +
          "  const [u1, u2, u3] = await Promise.all([p1, p2, p3]);\n" +
          "  return [u1, u2, u3];\n" +
          "}",
        description:
          "async/await는 Promise 위의 문법적 설탕입니다. 내부적으로는 동일한 Promise 체인으로 동작하지만, 동기 스타일로 읽힙니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 비동기 패턴 구현",
      content:
        "실무에서 자주 사용하는 async/await 패턴들을 구현합니다.",
      code: {
        language: "javascript",
        code:
          "// 1. 순차 처리 (반복문 + await)\n" +
          "async function processSequential(ids) {\n" +
          "  const results = [];\n" +
          "  for (const id of ids) {\n" +
          "    const data = await fetchItem(id); // 하나씩 순서대로\n" +
          "    results.push(data);\n" +
          "  }\n" +
          "  return results;\n" +
          "}\n\n" +
          "// 2. 병렬 처리 (더 빠름)\n" +
          "async function processParallel(ids) {\n" +
          "  return Promise.all(ids.map(id => fetchItem(id)));\n" +
          "}\n\n" +
          "// 3. 재시도 로직\n" +
          "async function withRetry(fn, maxRetries = 3, delay = 1000) {\n" +
          "  for (let attempt = 1; attempt <= maxRetries; attempt++) {\n" +
          "    try {\n" +
          "      return await fn();\n" +
          "    } catch (err) {\n" +
          "      if (attempt === maxRetries) throw err;\n" +
          "      console.log(`시도 ${attempt} 실패, ${delay}ms 후 재시도...`);\n" +
          "      await new Promise(r => setTimeout(r, delay));\n" +
          "      delay *= 2; // 지수 백오프\n" +
          "    }\n" +
          "  }\n" +
          "}\n\n" +
          "// 4. for await...of로 비동기 스트림 처리\n" +
          "async function* generateNumbers(start, end) {\n" +
          "  for (let i = start; i <= end; i++) {\n" +
          "    await new Promise(r => setTimeout(r, 100));\n" +
          "    yield i;\n" +
          "  }\n" +
          "}\n\n" +
          "async function processStream() {\n" +
          "  for await (const num of generateNumbers(1, 5)) {\n" +
          "    console.log(num); // 1, 2, 3, 4, 5 순서대로\n" +
          "  }\n" +
          "}\n\n" +
          "// 5. 공통 에러 처리 헬퍼\n" +
          "async function safeAsync(promise) {\n" +
          "  try {\n" +
          "    return [null, await promise];\n" +
          "  } catch (err) {\n" +
          "    return [err, null];\n" +
          "  }\n" +
          "}\n\n" +
          "const [err, user] = await safeAsync(fetchUser(1));\n" +
          "if (err) console.error(err);\n" +
          "else console.log(user);",
        description:
          "withRetry 함수의 지수 백오프 패턴은 네트워크 요청 재시도 시 서버 부하를 줄이는 실무 기법입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**async 함수의 특성:**\n" +
        "- 항상 Promise를 반환\n" +
        "- 내부에서 await 사용 가능\n" +
        "- throw → Promise.reject()\n\n" +
        "**await의 특성:**\n" +
        "- async 함수 내부에서만 사용 가능 (top-level await 제외)\n" +
        "- Promise가 정착될 때까지 함수 실행 일시 정지\n" +
        "- 이벤트 루프를 블로킹하지 않음\n\n" +
        "**비동기 취소 (AbortSignal):**\n" +
        "- `AbortController`로 진행 중인 fetch나 비동기 작업을 취소할 수 있습니다\n" +
        "- `const controller = new AbortController()` → `fetch(url, { signal: controller.signal })` → `controller.abort()`\n" +
        "- React에서는 useEffect의 cleanup에서 abort()를 호출하여 컴포넌트 언마운트 시 요청을 취소합니다\n\n" +
        "**흔한 실수:**\n" +
        "- `await`를 사용하면서 의도치 않게 순차 처리 → 병렬이 필요하면 `Promise.all` 사용\n" +
        "- `forEach` 내부에서 `await` 사용 → `for...of` 또는 `Promise.all(arr.map)` 사용\n\n" +
        "```javascript\n" +
        "// 잘못된 패턴: forEach + await는 기다리지 않음\n" +
        "[1,2,3].forEach(async id => await fetch(id));\n\n" +
        "// 올바른 패턴\n" +
        "for (const id of [1,2,3]) await fetch(id); // 순차\n" +
        "await Promise.all([1,2,3].map(id => fetch(id))); // 병렬\n" +
        "```\n\n" +
        "**다음 챕터 미리보기:** 마이크로태스크와 매크로태스크의 우선순위 차이, 실행 순서 예측 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "async/await는 Promise를 동기 코드처럼 읽히게 만드는 문법이다. async 함수는 항상 Promise를 반환하고, await는 Promise가 resolve될 때까지 실행을 멈춘다.",
  checklist: [
    "async 함수가 항상 Promise를 반환한다는 것을 안다",
    "await가 이벤트 루프를 블로킹하지 않는다는 것을 안다",
    "try-catch로 await의 에러를 처리할 수 있다",
    "순차 실행과 병렬 실행의 차이를 알고 Promise.all로 병렬 처리할 수 있다",
    "forEach 내부에서 await를 사용하면 안 되는 이유를 안다",
    "for await...of의 사용법을 안다",
    "withRetry 같은 재시도 패턴을 async/await로 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "async 함수가 42를 반환하면?",
      choices: [
        "42",
        "Promise.resolve(42) — 이행된 Promise",
        "Promise.reject(42) — 거부된 Promise",
        "undefined",
      ],
      correctIndex: 1,
      explanation:
        "async 함수는 항상 Promise를 반환합니다. 42를 반환하면 Promise.resolve(42)로 래핑됩니다. 즉, 호출자는 .then()으로 42를 받거나 await로 직접 42를 받습니다.",
    },
    {
      id: "q2",
      question: "await는 이벤트 루프를 블로킹하는가?",
      choices: [
        "블로킹함 — 해당 await가 완료될 때까지 모든 실행 중단",
        "블로킹 안 함 — async 함수만 일시 정지, 이벤트 루프는 계속 동작",
        "부분적으로 블로킹함",
        "항상 새 스레드에서 실행됨",
      ],
      correctIndex: 1,
      explanation:
        "await는 async 함수 내부의 실행만 일시 정지합니다. 이벤트 루프는 계속 동작해 다른 태스크(클릭 이벤트, 타이머 등)를 처리할 수 있습니다. 이것이 async/await가 블로킹 방식과 다른 핵심입니다.",
    },
    {
      id: "q3",
      question: "async 함수 내부에서 throw new Error()를 하면?",
      choices: [
        "프로그램이 즉시 종료됨",
        "에러가 무시됨",
        "거부된 Promise(Promise.reject(error))를 반환함",
        "try-catch 없이는 컴파일 에러",
      ],
      correctIndex: 2,
      explanation:
        "async 함수 내부에서 throw하면 해당 async 함수가 반환하는 Promise가 거부됩니다. 호출자는 .catch()나 try-catch(await 사용 시)로 이 에러를 처리해야 합니다.",
    },
    {
      id: "q4",
      question: "forEach 내부에서 await를 사용하면 안 되는 이유는?",
      choices: [
        "forEach가 async를 지원하지 않아서",
        "forEach는 콜백의 반환값(Promise)을 기다리지 않아서",
        "await가 forEach 내부에서 SyntaxError를 발생시켜서",
        "forEach는 단일 스레드에서만 동작해서",
      ],
      correctIndex: 1,
      explanation:
        "forEach는 콜백을 실행하지만 반환된 Promise를 기다리지 않습니다. async 콜백이 반환한 Promise를 무시하므로 순차 처리가 되지 않습니다. 순차 처리는 for...of, 병렬 처리는 Promise.all + map을 사용해야 합니다.",
    },
    {
      id: "q5",
      question: "다음 중 병렬로 실행하는 올바른 async/await 패턴은?",
      choices: [
        "const a = await fetchA(); const b = await fetchB();",
        "const [a, b] = await Promise.all([fetchA(), fetchB()]);",
        "await fetchA(); await fetchB();",
        "async () => [await fetchA(), await fetchB()]",
      ],
      correctIndex: 1,
      explanation:
        "Promise.all을 사용하면 fetchA()와 fetchB()를 동시에 시작합니다. 첫 번째와 세 번째 패턴은 fetchA가 완료된 후 fetchB를 시작하는 순차 처리입니다.",
    },
    {
      id: "q6",
      question: "top-level await는 어디서 사용할 수 있는가?",
      choices: [
        "모든 JavaScript 환경",
        "ES 모듈(type='module')의 최상위 레벨",
        "Node.js에서만",
        "async 함수 외부 어디서나",
      ],
      correctIndex: 1,
      explanation:
        "top-level await는 ES2022에서 도입되었으며 ES 모듈의 최상위 레벨에서만 사용 가능합니다. CommonJS 모듈이나 일반 스크립트에서는 사용할 수 없습니다.",
    },
  ],
};

export default chapter;
