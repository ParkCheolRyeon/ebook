import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "27-promise",
  subject: "js",
  title: "프로미스",
  description: "Promise 생성과 상태, then/catch/finally 체이닝, Promise.all/race/allSettled/any, 에러 처리 전략을 마스터합니다.",
  order: 27,
  group: "비동기",
  prerequisites: ["26-callback-pattern"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Promise는 **비동기 작업에 대한 영수증**입니다.\n\n" +
        "커피숍에서 주문하면 영수증(Promise)을 받습니다. 커피가 아직 안 나왔지만(pending), 영수증을 손에 쥐고 다른 일을 할 수 있습니다.\n\n" +
        "나중에 커피가 완성되면(fulfilled) 영수증을 보여주고 커피를 받습니다. 재료가 다 떨어졌다면(rejected) 직원이 알려줍니다.\n\n" +
        "**Promise의 세 가지 상태:**\n" +
        "- **pending** (대기): 아직 결과가 없음\n" +
        "- **fulfilled** (이행): 성공적으로 완료됨 (`resolve` 호출됨)\n" +
        "- **rejected** (거부): 실패함 (`reject` 호출됨)\n\n" +
        "한 번 이행되거나 거부된 Promise는 상태가 변하지 않습니다. 영수증에 적힌 주문 번호는 바뀌지 않습니다.\n\n" +
        "**Promise.all**은 '커피, 케이크, 주스를 모두 받을 때까지 기다려 주세요'와 같습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "콜백 패턴의 문제:\n\n" +
        "1. 콜백 지옥: 중첩 구조로 가독성 저하\n" +
        "2. 제어 역전: 외부 코드에 콜백 실행 통제권을 잃음\n" +
        "3. 에러 전파: try-catch 불가\n" +
        "4. 병렬 처리: 복잡한 완료 추적 필요\n\n" +
        "Promise는 이런 문제들을 해결하기 위해 ES6(2015)에서 도입된 비동기 패턴입니다.\n\n" +
        "Promise는 **'미래의 값에 대한 약속'**입니다. 값이 아직 없어도 Promise 객체를 반환하고, 나중에 값이 준비되면 `.then()`으로 받을 수 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### Promise 생성\n" +
        "```javascript\n" +
        "const p = new Promise((resolve, reject) => {\n" +
        "  // 비동기 작업\n" +
        "  if (성공) resolve(값);\n" +
        "  else reject(에러);\n" +
        "});\n" +
        "```\n\n" +
        "### then / catch / finally\n" +
        "- **`then(onFulfilled, onRejected)`**: 이행/거부 처리. 새 Promise를 반환해 체이닝 가능\n" +
        "- **`catch(onRejected)`**: 에러 처리. `then(null, onRejected)`의 축약\n" +
        "- **`finally(onFinally)`**: 이행/거부 상관없이 실행. 정리 작업에 사용\n\n" +
        "### Promise 체이닝\n" +
        "`.then()`은 항상 새 Promise를 반환하므로 연속 호출이 가능합니다.\n" +
        "- `then` 내부에서 값을 반환하면 이행된 Promise로 래핑\n" +
        "- `then` 내부에서 Promise를 반환하면 그 Promise가 다음 `then`에 전달\n" +
        "- `then` 내부에서 에러를 throw하면 거부된 Promise로 처리\n\n" +
        "### Promise 정적 메서드\n" +
        "| 메서드 | 동작 | 주요 사용 |\n" +
        "|--------|------|----------|\n" +
        "| `Promise.all(arr)` | 모두 이행 시 배열로 / 하나라도 거부 시 즉시 거부 | 병렬 실행 후 모든 결과 필요 |\n" +
        "| `Promise.race(arr)` | 가장 먼저 정착하는 결과 | 타임아웃 구현 |\n" +
        "| `Promise.allSettled(arr)` | 모두 정착 후 상태+값 배열 | 일부 실패해도 모든 결과 수집 |\n" +
        "| `Promise.any(arr)` | 하나라도 이행 시 그 값 / 모두 거부 시 에러 | 가장 빠른 성공만 필요 |\n" +
        "| `Promise.resolve(v)` | 이행된 Promise 반환 | 동기 값을 Promise로 |\n" +
        "| `Promise.reject(e)` | 거부된 Promise 반환 | 에러를 Promise로 |",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Promise 체이닝 내부 동작",
      content:
        "Promise 체이닝이 어떻게 동작하는지, 그리고 에러가 어떻게 전파되는지 추적합니다.",
      code: {
        language: "javascript",
        code:
          "// Promise 체이닝 동작 추적\n" +
          "Promise.resolve(1)              // 이행된 Promise(1) 생성\n" +
          "  .then(v => v + 1)             // 2 반환 → 이행된 Promise(2)\n" +
          "  .then(v => v * 2)             // 4 반환 → 이행된 Promise(4)\n" +
          "  .then(v => {\n" +
          "    throw new Error('실패');    // 에러 던짐 → 거부된 Promise\n" +
          "  })\n" +
          "  .then(v => console.log(v))    // 건너뜀 (이전이 거부됨)\n" +
          "  .catch(e => {\n" +
          "    console.log(e.message);     // '실패' 출력\n" +
          "    return '복구됨';            // 에러 복구 → 이행된 Promise('복구됨')\n" +
          "  })\n" +
          "  .then(v => console.log(v))   // '복구됨' 출력\n" +
          "  .finally(() => console.log('정리')); // 항상 실행\n\n" +
          "// Promise.allSettled 활용\n" +
          "const promises = [\n" +
          "  Promise.resolve('성공1'),\n" +
          "  Promise.reject(new Error('실패')),\n" +
          "  Promise.resolve('성공2'),\n" +
          "];\n\n" +
          "Promise.allSettled(promises).then(results => {\n" +
          "  results.forEach(r => {\n" +
          "    if (r.status === 'fulfilled') console.log('OK:', r.value);\n" +
          "    else console.log('ERR:', r.reason.message);\n" +
          "  });\n" +
          "});\n" +
          "// OK: 성공1\n" +
          "// ERR: 실패\n" +
          "// OK: 성공2",
        description:
          "catch 내부에서 값을 반환하면 에러 복구가 됩니다. 에러를 복구하지 않고 다시 throw하면 에러가 계속 전파됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Promise를 활용한 API 호출",
      content:
        "실제 API 호출 패턴과 병렬 처리, 타임아웃 구현을 Promise로 작성합니다.",
      code: {
        language: "javascript",
        code:
          "// 1. 기본 Promise 래퍼 함수\n" +
          "function delay(ms) {\n" +
          "  return new Promise(resolve => setTimeout(resolve, ms));\n" +
          "}\n\n" +
          "// 2. Promise 체이닝으로 순차 처리\n" +
          "function fetchUser(id) {\n" +
          "  return fetch(`/api/users/${id}`).then(res => {\n" +
          "    if (!res.ok) throw new Error(`HTTP ${res.status}`);\n" +
          "    return res.json();\n" +
          "  });\n" +
          "}\n\n" +
          "fetchUser(1)\n" +
          "  .then(user => fetchUser(user.managerId)) // 순차 처리\n" +
          "  .then(manager => console.log('매니저:', manager.name))\n" +
          "  .catch(err => console.error('에러:', err.message))\n" +
          "  .finally(() => console.log('요청 완료'));\n\n" +
          "// 3. Promise.all 병렬 처리\n" +
          "const userIds = [1, 2, 3];\n" +
          "Promise.all(userIds.map(id => fetchUser(id)))\n" +
          "  .then(users => console.log('모든 사용자:', users))\n" +
          "  .catch(err => console.error('하나라도 실패:', err));\n\n" +
          "// 4. 타임아웃 구현 (Promise.race)\n" +
          "function withTimeout(promise, ms) {\n" +
          "  const timeout = new Promise((_, reject) =>\n" +
          "    setTimeout(() => reject(new Error(`${ms}ms 초과`)), ms)\n" +
          "  );\n" +
          "  return Promise.race([promise, timeout]);\n" +
          "}\n\n" +
          "withTimeout(fetchUser(1), 3000)\n" +
          "  .then(user => console.log(user))\n" +
          "  .catch(err => console.error('타임아웃 또는 에러:', err.message));",
        description:
          "Promise.race로 타임아웃을 구현하는 패턴은 실무에서 자주 사용됩니다. 요청이 너무 오래 걸리면 타임아웃 Promise가 먼저 거부되어 에러를 발생시킵니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**Promise 상태 전이:**\n" +
        "`pending` → `fulfilled` (resolve 호출) 또는 `rejected` (reject 호출 또는 에러 발생)\n\n" +
        "**에러 처리 전략:**\n" +
        "- 체인 끝에 `.catch()` 하나로 모든 에러 처리 가능\n" +
        "- `.catch()` 내에서 값을 반환하면 에러 복구됨\n" +
        "- `.catch()` 내에서 에러를 재throw하면 계속 전파\n\n" +
        "**병렬 처리 선택:**\n" +
        "- 모두 성공 필요 → `Promise.all`\n" +
        "- 모든 결과 수집(실패 포함) → `Promise.allSettled`\n" +
        "- 가장 빠른 결과 → `Promise.race`\n" +
        "- 가장 빠른 성공 → `Promise.any`\n\n" +
        "**다음 챕터 미리보기:** async/await으로 Promise를 더 읽기 쉬운 동기 스타일로 작성하는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "Promise의 세 가지 상태(pending, fulfilled, rejected)를 설명할 수 있다",
    "new Promise((resolve, reject) => {})로 Promise를 생성할 수 있다",
    "then/catch/finally의 역할과 체이닝 동작을 설명할 수 있다",
    "catch 내부에서 값을 반환하면 에러가 복구됨을 안다",
    "Promise.all, allSettled, race, any의 차이를 설명할 수 있다",
    "Promise.race로 타임아웃 패턴을 구현할 수 있다",
    "Promise 체인에서 에러 전파 경로를 추적할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Promise.resolve(42).then(v => v + 1).then(v => v * 2)의 최종 결과는?",
      choices: ["42", "43", "86", "Promise<86>"],
      correctIndex: 2,
      explanation:
        "42 → then(v => v+1) → 43 → then(v => v*2) → 86. 최종적으로 이행 값이 86인 Promise를 반환합니다. then()에서 값을 반환하면 그 값으로 이행된 새 Promise를 반환합니다.",
    },
    {
      id: "q2",
      question: "Promise.all([p1, p2, p3])에서 p2가 거부되면?",
      choices: [
        "p1, p3의 결과만 반환된다",
        "즉시 거부된 Promise를 반환한다",
        "p1, p3가 완료될 때까지 기다린 후 부분 결과를 반환한다",
        "p2의 에러를 무시하고 계속 진행한다",
      ],
      correctIndex: 1,
      explanation:
        "Promise.all은 하나라도 거부되면 즉시 거부된 Promise를 반환합니다. 모든 결과가 필요하지만 일부 실패를 허용하려면 Promise.allSettled를 사용해야 합니다.",
    },
    {
      id: "q3",
      question: ".catch() 내부에서 값을 반환하면?",
      choices: [
        "에러가 계속 전파된다",
        "에러가 복구되어 이행된 Promise로 처리된다",
        "undefined를 반환하는 거부된 Promise가 된다",
        "TypeError가 발생한다",
      ],
      correctIndex: 1,
      explanation:
        "catch 내부에서 값을 반환하면 에러 복구 처리됩니다. 이후 then()이 정상적으로 실행됩니다. 에러를 계속 전파하려면 catch 내부에서 에러를 다시 throw해야 합니다.",
    },
    {
      id: "q4",
      question: "Promise.allSettled와 Promise.all의 가장 큰 차이는?",
      choices: [
        "allSettled가 더 빠르다",
        "allSettled는 일부 거부되어도 모든 결과를 수집한다",
        "all은 순서를 보장하지 않는다",
        "allSettled는 최대 3개까지만 처리한다",
      ],
      correctIndex: 1,
      explanation:
        "Promise.allSettled는 모든 Promise가 이행 또는 거부로 정착할 때까지 기다리고 각각의 상태와 값/이유를 담은 배열을 반환합니다. 일부 실패해도 나머지 결과를 수집할 수 있습니다.",
    },
    {
      id: "q5",
      question: "finally()의 콜백이 실행되지 않는 경우는?",
      choices: [
        "Promise가 거부된 경우",
        "Promise가 이행된 경우",
        "finally()는 항상 실행된다",
        "then()이 먼저 호출된 경우",
      ],
      correctIndex: 2,
      explanation:
        "finally()는 Promise가 이행되든 거부되든 항상 실행됩니다. 주로 로딩 상태 해제, 파일 닫기 등 정리 작업에 사용합니다. finally의 콜백은 인수를 받지 않습니다.",
    },
    {
      id: "q6",
      question: "가장 빠르게 이행되는 Promise의 결과만 필요할 때 사용하는 메서드는?",
      choices: [
        "Promise.all",
        "Promise.race",
        "Promise.any",
        "Promise.allSettled",
      ],
      correctIndex: 2,
      explanation:
        "Promise.any는 여러 Promise 중 하나라도 이행되면 그 값을 반환합니다. 모두 거부된 경우에만 AggregateError를 throw합니다. Promise.race는 이행/거부 상관없이 가장 먼저 정착하는 결과를 반환합니다.",
    },
    {
      id: "q7",
      question: "Promise 체인에서 에러가 발생하면 어떻게 처리되는가?",
      choices: [
        "에러가 발생한 then에서 즉시 프로그램이 종료된다",
        "에러가 다음 then을 건너뛰고 가장 가까운 catch로 전파된다",
        "에러는 조용히 무시된다",
        "에러가 발생한 then부터 다시 실행된다",
      ],
      correctIndex: 1,
      explanation:
        "Promise 체인에서 에러가 발생하면(throw 또는 reject) 이후의 then()들을 건너뛰고 가장 가까운 catch()로 에러가 전달됩니다. 이는 동기 코드의 try-catch 전파와 유사합니다.",
    },
  ],
};

export default chapter;
