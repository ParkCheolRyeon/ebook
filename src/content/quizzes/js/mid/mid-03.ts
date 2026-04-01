import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-03",
  title: "중간 점검 3: 빌트인 ~ 비동기",
  coverGroups: ["빌트인과 표준 객체", "비동기"],
  questions: [
    {
      id: "mid03-q1",
      question:
        "다음 코드의 출력 결과는?\n\nconsole.log([1, 2, 3].map(String));",
      choices: [
        "['1', '2', '3']",
        "[1, 2, 3]",
        "['123']",
        "TypeError",
      ],
      correctIndex: 0,
      explanation:
        "String은 함수이므로 map의 콜백으로 전달할 수 있습니다. 각 요소에 String()이 호출되어 문자열 배열이 반환됩니다.",
    },
    {
      id: "mid03-q2",
      question:
        "다음 코드의 출력 결과는?\n\nconsole.log(['10', '10', '10'].map(parseInt));",
      choices: [
        "[10, 10, 10]",
        "[10, NaN, 2]",
        "[10, NaN, NaN]",
        "[10, 2, 10]",
      ],
      correctIndex: 1,
      explanation:
        "map은 콜백에 (element, index, array)를 전달합니다. parseInt('10', 0) → 10, parseInt('10', 1) → NaN (1진법 없음), parseInt('10', 2) → 2 (2진법으로 '10'은 2).",
    },
    {
      id: "mid03-q3",
      question:
        "다음 코드의 출력 결과는?\n\nconst arr = [1, 2, 3, 4, 5];\nconst result = arr.reduce((acc, cur) => {\n  return cur % 2 === 0 ? [...acc, cur * 2] : acc;\n}, []);\nconsole.log(result);",
      choices: ["[2, 4, 6, 8, 10]", "[4, 8]", "[2, 4]", "[1, 3, 5]"],
      correctIndex: 1,
      explanation:
        "reduce가 filter + map 역할을 동시에 수행합니다. 짝수인 2, 4만 골라 2배한 결과 [4, 8]이 반환됩니다.",
    },
    {
      id: "mid03-q4",
      question:
        "다음 중 원시값에 메서드를 호출할 수 있는 이유를 올바르게 설명한 것은?",
      choices: [
        "원시값은 내부적으로 항상 객체다",
        "엔진이 임시 래퍼 객체를 생성하고 메서드 호출 후 즉시 폐기한다",
        "프로토타입 체인에 의해 전역 객체의 메서드를 호출한다",
        "원시값에는 메서드를 호출할 수 없다",
      ],
      correctIndex: 1,
      explanation:
        "원시값에 메서드를 호출하면 엔진이 해당 타입의 래퍼 객체(String, Number 등)를 임시로 생성하고, 메서드 실행 후 래퍼 객체를 폐기합니다. 이를 오토박싱이라 합니다.",
    },
    {
      id: "mid03-q5",
      question:
        "다음 코드의 출력 결과는?\n\nconst set = new Set([1, 2, 3, 2, 1]);\nconsole.log(set.size, [...set]);",
      choices: [
        "5, [1, 2, 3, 2, 1]",
        "3, [1, 2, 3]",
        "3, [3, 2, 1]",
        "5, [1, 2, 3]",
      ],
      correctIndex: 1,
      explanation:
        "Set은 중복을 허용하지 않으므로 크기는 3이고, 삽입 순서를 유지하므로 스프레드 결과는 [1, 2, 3]입니다.",
    },
    {
      id: "mid03-q6",
      question:
        "다음 코드의 출력 결과는?\n\nconst map = new Map();\nconst key1 = {};\nconst key2 = {};\nmap.set(key1, 'A');\nmap.set(key2, 'B');\nconsole.log(map.size, map.get({}));",
      choices: [
        "2, undefined",
        "1, 'B'",
        "2, 'B'",
        "2, 'A'",
      ],
      correctIndex: 0,
      explanation:
        "Map은 키를 참조로 비교합니다. key1, key2, {}은 모두 다른 참조이므로 size는 2이고, 새로운 {}로 조회하면 일치하는 키가 없어 undefined가 반환됩니다.",
    },
    {
      id: "mid03-q7",
      question:
        "다음 코드의 출력 순서는?\n\nconsole.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');",
      choices: [
        "1, 2, 3, 4",
        "1, 4, 2, 3",
        "1, 4, 3, 2",
        "1, 3, 4, 2",
      ],
      correctIndex: 2,
      explanation:
        "동기 코드(1, 4) 실행 후, 마이크로태스크(Promise → 3)가 매크로태스크(setTimeout → 2)보다 먼저 실행됩니다.",
    },
    {
      id: "mid03-q8",
      question:
        "다음 코드의 출력 결과는?\n\nasync function foo() {\n  return 42;\n}\nconsole.log(foo());",
      choices: [
        "42",
        "Promise { <pending> }",
        "Promise { 42 }",
        "undefined",
      ],
      correctIndex: 2,
      explanation:
        "async 함수는 항상 Promise를 반환합니다. return 42는 Promise.resolve(42)와 같으므로 이행된 Promise가 출력됩니다.",
    },
    {
      id: "mid03-q9",
      question:
        "다음 코드의 출력 결과는?\n\nasync function foo() {\n  const a = await Promise.resolve(1);\n  const b = await Promise.resolve(2);\n  return a + b;\n}\nfoo().then(console.log);",
      choices: ["3", "Promise { 3 }", "undefined", "NaN"],
      correctIndex: 0,
      explanation:
        "await는 Promise가 이행될 때까지 기다린 뒤 결과값을 반환합니다. a=1, b=2이므로 foo()는 3으로 이행되는 Promise를 반환하고, then의 콜백이 3을 출력합니다.",
    },
    {
      id: "mid03-q10",
      question:
        "Promise.all과 Promise.allSettled의 차이로 올바른 것은?",
      choices: [
        "동일한 동작을 하며 이름만 다르다",
        "all은 하나라도 거부되면 즉시 거부되고, allSettled는 모든 Promise가 완료될 때까지 기다린다",
        "allSettled는 성공한 결과만 반환한다",
        "all은 순서를 보장하지 않고 allSettled는 보장한다",
      ],
      correctIndex: 1,
      explanation:
        "Promise.all은 하나라도 reject되면 전체가 reject됩니다. Promise.allSettled는 모든 Promise의 결과(fulfilled/rejected)를 기다려 {status, value/reason} 배열을 반환합니다.",
    },
    {
      id: "mid03-q11",
      question:
        "다음 코드의 출력 순서는?\n\nsetTimeout(() => console.log('A'), 0);\nPromise.resolve()\n  .then(() => {\n    console.log('B');\n    return Promise.resolve();\n  })\n  .then(() => console.log('C'));\nPromise.resolve().then(() => console.log('D'));",
      choices: [
        "B, D, C, A",
        "B, C, D, A",
        "D, B, C, A",
        "A, B, D, C",
      ],
      correctIndex: 0,
      explanation:
        "마이크로태스크 큐에서 B와 D가 등록됩니다. B 실행 후 return Promise.resolve()로 인해 C는 다음 마이크로태스크 턴으로 지연됩니다. D가 먼저 실행되고 C가 이어진 뒤, 매크로태스크 A가 마지막입니다.",
    },
    {
      id: "mid03-q12",
      question:
        "다음 코드에서 발생하는 문제는?\n\nasync function fetchAll(urls) {\n  const results = [];\n  urls.forEach(async (url) => {\n    const res = await fetch(url);\n    results.push(await res.json());\n  });\n  return results;\n}",
      choices: [
        "문법 오류가 발생한다",
        "forEach의 콜백이 await되지 않아 빈 배열이 반환된다",
        "fetch가 병렬로 실행되지 않는다",
        "아무 문제 없다",
      ],
      correctIndex: 1,
      explanation:
        "forEach는 콜백의 반환값(Promise)을 기다리지 않습니다. 따라서 fetchAll은 비동기 작업이 완료되기 전에 빈 results를 반환합니다. for...of나 Promise.all(urls.map(...))을 사용해야 합니다.",
    },
    {
      id: "mid03-q13",
      question:
        "다음 코드의 출력 결과는?\n\nconst arr = [1, [2, [3, [4]]], 5];\nconsole.log(arr.flat(2));",
      choices: [
        "[1, 2, 3, [4], 5]",
        "[1, 2, 3, 4, 5]",
        "[1, 2, [3, [4]], 5]",
        "TypeError",
      ],
      correctIndex: 0,
      explanation:
        "flat(2)는 2단계 깊이까지 평탄화합니다. [4]는 3단계 중첩이므로 풀리지 않고 [1, 2, 3, [4], 5]가 됩니다.",
    },
    {
      id: "mid03-q14",
      question:
        "이벤트 루프에서 마이크로태스크에 해당하지 않는 것은?",
      choices: [
        "Promise.then 콜백",
        "queueMicrotask 콜백",
        "MutationObserver 콜백",
        "setTimeout 콜백",
      ],
      correctIndex: 3,
      explanation:
        "setTimeout 콜백은 매크로태스크(태스크)입니다. Promise.then, queueMicrotask, MutationObserver 콜백은 모두 마이크로태스크입니다.",
    },
    {
      id: "mid03-q15",
      question:
        "다음 코드의 출력 결과는?\n\nconst p = new Promise((resolve, reject) => {\n  resolve('first');\n  resolve('second');\n  reject('error');\n});\np.then(console.log).catch(console.error);",
      choices: [
        "'first' 다음 'error'",
        "'first'",
        "'second'",
        "'error'",
      ],
      correctIndex: 1,
      explanation:
        "Promise는 한 번 상태가 결정(settled)되면 변경되지 않습니다. 첫 번째 resolve('first')로 이행 상태가 되므로 이후 resolve, reject 호출은 무시됩니다.",
    },
    {
      id: "mid03-q16",
      question:
        "다음 코드의 출력 결과는?\n\nconsole.log(Array.isArray(Array.prototype));",
      choices: ["true", "false", "TypeError", "undefined"],
      correctIndex: 0,
      explanation:
        "Array.prototype은 그 자체가 배열입니다(빈 배열 []). 이는 JavaScript의 특이한 점 중 하나로, Array.isArray(Array.prototype)은 true를 반환합니다.",
    },
    {
      id: "mid03-q17",
      question:
        "다음 코드의 출력 결과는?\n\nconst arr = [1, 2, 3];\nconst result = arr.splice(1, 1, 'a', 'b');\nconsole.log(arr, result);",
      choices: [
        "[1, 'a', 'b', 3], [2]",
        "[1, 'a', 'b', 2, 3], []",
        "['a', 'b', 2, 3], [1]",
        "[1, 2, 3], [2]",
      ],
      correctIndex: 0,
      explanation:
        "splice(1, 1, 'a', 'b')는 인덱스 1에서 1개를 제거하고 'a', 'b'를 삽입합니다. 원본 배열이 변경되고, 제거된 요소 [2]가 반환됩니다.",
    },
    {
      id: "mid03-q18",
      question:
        "다음 코드의 출력 결과는?\n\ntry {\n  setTimeout(() => {\n    throw new Error('oops');\n  }, 0);\n} catch (e) {\n  console.log('caught');\n}\nconsole.log('done');",
      choices: [
        "'caught' 다음 'done'",
        "'done' (이후 Uncaught Error 발생)",
        "'done' 다음 'caught'",
        "'done'만 출력되고 에러는 무시됨",
      ],
      correctIndex: 1,
      explanation:
        "setTimeout의 콜백은 현재 콜 스택이 비워진 후 별도의 태스크로 실행됩니다. 따라서 try-catch 블록 밖에서 에러가 발생하여 잡히지 않습니다.",
    },
  ],
};

export default midQuiz;
