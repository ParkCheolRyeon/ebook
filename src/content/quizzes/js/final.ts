import type { FinalExam } from "@/types/quiz";

const finalExam: FinalExam = {
  type: "final",
  id: "final-exam",
  title: "JavaScript 종합 시험",
  questions: [
    // === 기초 ===
    {
      id: "final-q1",
      question: "JavaScript에서 typeof null의 결과는?",
      choices: ['"null"', '"undefined"', '"object"', '"boolean"'],
      correctIndex: 2,
      explanation:
        'typeof null이 "object"를 반환하는 것은 JavaScript 초기 구현의 버그입니다. null은 원시값이지만 내부적으로 타입 태그가 객체와 동일하게 0이었기 때문입니다.',
    },
    {
      id: "final-q2",
      question:
        "다음 코드의 출력 결과는?\n\nconsole.log(0.1 + 0.2 === 0.3);",
      choices: ["true", "false", "TypeError", "NaN"],
      correctIndex: 1,
      explanation:
        "IEEE 754 부동소수점 연산의 정밀도 한계로 0.1 + 0.2는 0.30000000000000004입니다. 부동소수점 비교 시 Number.EPSILON 등을 활용해야 합니다.",
    },
    {
      id: "final-q3",
      question:
        "다음 코드의 출력 결과는?\n\nconsole.log(typeof NaN);\nconsole.log(NaN === NaN);",
      choices: [
        '"number", true',
        '"NaN", false',
        '"number", false',
        '"undefined", false',
      ],
      correctIndex: 2,
      explanation:
        'NaN의 타입은 "number"이며, NaN은 자기 자신과도 같지 않은 유일한 값입니다. NaN 확인에는 Number.isNaN()을 사용해야 합니다.',
    },
    {
      id: "final-q4",
      question:
        "다음 코드의 출력 결과는?\n\nlet x = 1;\nlet y = x;\ny = 2;\nconsole.log(x, y);\n\nlet a = { v: 1 };\nlet b = a;\nb.v = 2;\nconsole.log(a.v, b.v);",
      choices: [
        "1 2, 1 2",
        "2 2, 2 2",
        "1 2, 2 2",
        "1 1, 2 2",
      ],
      correctIndex: 2,
      explanation:
        "원시값은 값에 의한 복사이므로 y 변경이 x에 영향을 주지 않습니다. 객체는 참조에 의한 복사이므로 b를 통한 변경이 a에도 반영됩니다.",
    },
    // === 함수와 스코프 ===
    {
      id: "final-q5",
      question:
        "다음 코드의 출력 결과는?\n\nconsole.log(a);\nconsole.log(b);\nvar a = 1;\nlet b = 2;",
      choices: [
        "undefined, undefined",
        "undefined, ReferenceError",
        "1, 2",
        "ReferenceError, ReferenceError",
      ],
      correctIndex: 1,
      explanation:
        "var 선언은 호이스팅되어 undefined로 초기화됩니다. let 선언도 호이스팅되지만 TDZ(Temporal Dead Zone)에 있어 초기화 전 접근하면 ReferenceError가 발생합니다.",
    },
    {
      id: "final-q6",
      question:
        "다음 코드의 출력 결과는?\n\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}",
      choices: ["0, 1, 2", "3, 3, 3", "0, 0, 0", "undefined, undefined, undefined"],
      correctIndex: 1,
      explanation:
        "var는 함수 스코프이므로 클로저가 같은 i를 참조합니다. setTimeout 콜백이 실행될 때 i는 이미 3이 되어 있습니다. let을 사용하면 블록 스코프로 0, 1, 2가 출력됩니다.",
    },
    {
      id: "final-q7",
      question:
        "클로저(Closure)에 대한 설명으로 올바른 것은?",
      choices: [
        "함수가 자신이 선언된 렉시컬 환경의 변수에 접근할 수 있는 것",
        "함수가 자신을 호출한 스코프의 변수에 접근할 수 있는 것",
        "전역 변수에만 접근할 수 있는 특수 함수",
        "즉시 실행 함수(IIFE)의 별칭",
      ],
      correctIndex: 0,
      explanation:
        "클로저는 함수와 그 함수가 선언된 렉시컬 환경의 조합입니다. 외부 함수가 종료되어도 내부 함수가 외부 변수에 접근할 수 있습니다.",
    },
    {
      id: "final-q8",
      question:
        "다음 코드의 출력 결과는?\n\nfunction outer() {\n  let count = 0;\n  return function inner() {\n    return ++count;\n  };\n}\nconst counter1 = outer();\nconst counter2 = outer();\nconsole.log(counter1(), counter1(), counter2());",
      choices: ["1, 2, 3", "1, 2, 1", "1, 1, 1", "0, 1, 0"],
      correctIndex: 1,
      explanation:
        "counter1과 counter2는 별도의 outer() 호출로 생성되어 각각 독립적인 count 변수를 가집니다. counter1은 1, 2로 증가하고 counter2는 새로운 count에서 시작하여 1입니다.",
    },
    // === this와 객체 ===
    {
      id: "final-q9",
      question:
        "다음 코드의 출력 결과는?\n\nconst obj = {\n  x: 10,\n  getX: function() { return this.x; },\n  getXArrow: () => this.x\n};\nconsole.log(obj.getX());\nconsole.log(obj.getXArrow());",
      choices: ["10, 10", "10, undefined", "undefined, 10", "undefined, undefined"],
      correctIndex: 1,
      explanation:
        "getX는 일반 함수이므로 메서드 호출 시 this가 obj를 가리킵니다. getXArrow는 화살표 함수이므로 상위 스코프(전역)의 this를 사용하여 undefined가 반환됩니다.",
    },
    {
      id: "final-q10",
      question:
        "다음 코드의 출력 결과는?\n\nfunction Foo() {\n  this.a = 1;\n}\nFoo.prototype.a = 2;\nFoo.prototype.b = 3;\nconst foo = new Foo();\nconsole.log(foo.a, foo.b);",
      choices: ["1, 3", "2, 3", "1, undefined", "2, undefined"],
      correctIndex: 0,
      explanation:
        "생성자에서 this.a = 1로 인스턴스 자체 속성이 생성됩니다. foo.a는 자체 속성 1을 반환하고, foo.b는 프로토타입 체인을 따라 3을 반환합니다.",
    },
    {
      id: "final-q11",
      question:
        "다음 코드의 출력 결과는?\n\nclass A {\n  static greet() { return 'Hello from A'; }\n}\nclass B extends A {}\nconsole.log(B.greet());",
      choices: [
        "'Hello from A'",
        "TypeError: B.greet is not a function",
        "undefined",
        "'Hello from B'",
      ],
      correctIndex: 0,
      explanation:
        "정적 메서드도 프로토타입 체인을 따라 상속됩니다. B는 A를 상속하므로 B.greet()는 A의 정적 메서드를 호출합니다.",
    },
    // === 빌트인과 표준 객체 ===
    {
      id: "final-q12",
      question:
        "다음 코드의 출력 결과는?\n\nconst arr = [1, 2, 3, 4, 5];\nconst result = arr.filter(x => x > 2).map(x => x * 2).reduce((a, b) => a + b, 0);\nconsole.log(result);",
      choices: ["30", "24", "18", "12"],
      correctIndex: 1,
      explanation:
        "filter(x > 2) → [3, 4, 5], map(x * 2) → [6, 8, 10], reduce(합계) → 24. 메서드 체이닝으로 배열을 변환합니다.",
    },
    {
      id: "final-q13",
      question:
        "다음 코드의 출력 결과는?\n\nconst obj = { a: 1, b: 2, c: 3 };\nconst entries = Object.entries(obj);\nconsole.log(entries);",
      choices: [
        "[['a', 1], ['b', 2], ['c', 3]]",
        "['a', 'b', 'c']",
        "[1, 2, 3]",
        "{a: 1, b: 2, c: 3}",
      ],
      correctIndex: 0,
      explanation:
        "Object.entries()는 객체의 열거 가능한 속성을 [key, value] 쌍의 배열로 반환합니다.",
    },
    {
      id: "final-q14",
      question:
        "다음 코드의 출력 결과는?\n\nconst s = new Set([1, 2, 3]);\ns.add(2);\ns.add(4);\nconsole.log([...s].reduce((a, b) => a + b, 0));",
      choices: ["12", "10", "8", "13"],
      correctIndex: 1,
      explanation:
        "Set은 중복을 허용하지 않으므로 add(2)는 무시됩니다. {1, 2, 3, 4}의 합은 10입니다.",
    },
    // === 비동기 ===
    {
      id: "final-q15",
      question:
        "다음 코드의 출력 순서는?\n\nconsole.log('start');\nsetTimeout(() => console.log('timeout'), 0);\nPromise.resolve().then(() => console.log('promise'));\nqueueMicrotask(() => console.log('microtask'));\nconsole.log('end');",
      choices: [
        "start, end, promise, microtask, timeout",
        "start, end, microtask, promise, timeout",
        "start, promise, microtask, end, timeout",
        "start, end, timeout, promise, microtask",
      ],
      correctIndex: 0,
      explanation:
        "동기 코드(start, end) 실행 후 마이크로태스크 큐가 처리됩니다. Promise.then과 queueMicrotask 모두 마이크로태스크이며 등록 순서대로 실행됩니다. setTimeout은 매크로태스크로 마지막입니다.",
    },
    {
      id: "final-q16",
      question:
        "다음 코드의 출력 결과는?\n\nasync function foo() {\n  console.log('A');\n  await Promise.resolve();\n  console.log('B');\n}\nconsole.log('C');\nfoo();\nconsole.log('D');",
      choices: [
        "C, A, B, D",
        "C, A, D, B",
        "A, C, D, B",
        "C, D, A, B",
      ],
      correctIndex: 1,
      explanation:
        "C 출력 → foo() 호출로 A 출력 → await에서 중단되고 제어가 돌아옴 → D 출력 → 마이크로태스크로 B 출력. await 이후의 코드는 마이크로태스크로 실행됩니다.",
    },
    {
      id: "final-q17",
      question:
        "Promise.race의 동작으로 올바른 것은?",
      choices: [
        "모든 Promise가 이행되면 결과 배열을 반환한다",
        "가장 먼저 결정(settled)된 Promise의 결과를 반환한다",
        "가장 먼저 이행(fulfilled)된 Promise의 결과를 반환한다",
        "가장 느린 Promise의 결과를 반환한다",
      ],
      correctIndex: 1,
      explanation:
        "Promise.race는 가장 먼저 settled(이행 또는 거부)된 Promise의 결과를 반환합니다. 이행뿐 아니라 거부도 포함됩니다. 가장 먼저 이행된 것만 반환하는 것은 Promise.any입니다.",
    },
    // === 이터러블과 제너레이터 ===
    {
      id: "final-q18",
      question:
        "다음 코드의 출력 결과는?\n\nfunction* range(start, end) {\n  for (let i = start; i < end; i++) {\n    yield i;\n  }\n}\nconsole.log([...range(2, 5)]);",
      choices: ["[2, 3, 4]", "[2, 3, 4, 5]", "[0, 1, 2]", "TypeError"],
      correctIndex: 0,
      explanation:
        "제너레이터는 이터러블이므로 스프레드 연산자로 펼칠 수 있습니다. i < end 조건이므로 2, 3, 4가 yield됩니다.",
    },
    {
      id: "final-q19",
      question:
        "다음 중 이터러블이 아닌 것은?",
      choices: ["문자열", "Map", "일반 객체 {}", "Set"],
      correctIndex: 2,
      explanation:
        "일반 객체는 Symbol.iterator가 없어 이터러블이 아닙니다. 문자열, Array, Map, Set, arguments 등은 내장 이터러블입니다. for...of를 일반 객체에 사용하면 TypeError가 발생합니다.",
    },
    // === 모듈과 환경 ===
    {
      id: "final-q20",
      question:
        "ES Modules의 특징으로 틀린 것은?",
      choices: [
        "자동으로 strict mode가 적용된다",
        "import/export는 정적으로 분석된다",
        "모듈 스코프를 가져 전역을 오염시키지 않는다",
        "require()와 import를 혼용할 수 있다",
      ],
      correctIndex: 3,
      explanation:
        "ES Modules에서 require()를 사용할 수 없습니다(Node.js에서 조건부로 가능하지만 혼용은 권장되지 않음). ES Modules는 strict mode가 자동 적용되고, 정적 분석이 가능하며, 모듈 스코프를 가집니다.",
    },
    {
      id: "final-q21",
      question:
        "다음 코드의 출력 결과는?\n\ntry {\n  undefined.property;\n} catch (e) {\n  console.log(e instanceof TypeError);\n  console.log(e instanceof Error);\n}",
      choices: [
        "true, true",
        "true, false",
        "false, true",
        "false, false",
      ],
      correctIndex: 0,
      explanation:
        "undefined.property 접근은 TypeError를 발생시킵니다. TypeError는 Error의 하위 클래스이므로 두 instanceof 모두 true입니다.",
    },
    // === 메모리와 최적화 ===
    {
      id: "final-q22",
      question:
        "다음 중 WeakRef의 올바른 사용 사례는?",
      choices: [
        "모든 객체 참조를 WeakRef로 감싸야 한다",
        "캐시에서 GC가 메모리를 회수할 수 있도록 약한 참조를 유지한다",
        "원시값에 대한 약한 참조를 생성한다",
        "이벤트 리스너 등록에 사용한다",
      ],
      correctIndex: 1,
      explanation:
        "WeakRef는 객체에 대한 약한 참조를 생성하여 GC가 해당 객체를 회수할 수 있게 합니다. 캐시처럼 메모리 압박 시 해제 가능한 참조에 적합합니다. 원시값에는 사용할 수 없습니다.",
    },
    {
      id: "final-q23",
      question:
        "디바운스와 스로틀의 차이로 올바른 것은?",
      choices: [
        "디바운스는 일정 간격마다 실행, 스로틀은 마지막 호출 후 대기",
        "디바운스는 마지막 호출 후 일정 시간 후 실행, 스로틀은 일정 간격마다 한 번 실행",
        "두 기법은 동일하다",
        "디바운스는 동기 전용, 스로틀은 비동기 전용",
      ],
      correctIndex: 1,
      explanation:
        "디바운스는 연속 호출이 멈춘 뒤 일정 시간 후 마지막 호출을 실행합니다. 스로틀은 일정 시간 간격으로 최대 한 번만 함수를 실행합니다.",
    },
    // === 브라우저와 DOM ===
    {
      id: "final-q24",
      question:
        "다음 중 DOM 요소를 선택하는 메서드와 반환값의 연결이 틀린 것은?",
      choices: [
        "getElementById → 단일 Element",
        "querySelector → 단일 Element",
        "querySelectorAll → HTMLCollection(실시간)",
        "getElementsByClassName → HTMLCollection(실시간)",
      ],
      correctIndex: 2,
      explanation:
        "querySelectorAll은 정적인 NodeList를 반환합니다(실시간 업데이트 안 됨). getElementsByClassName은 실시간 HTMLCollection을 반환합니다. 이 차이는 DOM 변경 시 동작에 영향을 줍니다.",
    },
    {
      id: "final-q25",
      question:
        "다음 중 레이아웃 스래싱(Layout Thrashing)을 유발하는 코드 패턴은?",
      choices: [
        "여러 스타일 변경을 한 번에 적용",
        "읽기와 쓰기를 반복적으로 교차 수행",
        "requestAnimationFrame 사용",
        "DocumentFragment 사용",
      ],
      correctIndex: 1,
      explanation:
        "레이아웃 스래싱은 DOM의 레이아웃 속성 읽기(offsetHeight 등)와 스타일 쓰기를 반복 교차하면 발생합니다. 매번 강제 리플로우가 일어나 성능이 크게 저하됩니다.",
    },
    {
      id: "final-q26",
      question:
        "e.preventDefault()의 역할은?",
      choices: [
        "이벤트 전파를 중단한다",
        "이벤트의 기본 동작(폼 제출, 링크 이동 등)을 취소한다",
        "이벤트 리스너를 제거한다",
        "이벤트 객체를 초기화한다",
      ],
      correctIndex: 1,
      explanation:
        "preventDefault()는 이벤트의 기본 동작을 취소합니다(예: 링크 클릭 시 페이지 이동, 폼 submit 시 페이지 새로고침). 이벤트 전파 중단은 stopPropagation()입니다.",
    },
    // === 고급 패턴 ===
    {
      id: "final-q27",
      question:
        "다음 Proxy 코드의 출력 결과는?\n\nconst arr = new Proxy([1, 2, 3], {\n  get(target, prop) {\n    const idx = Number(prop);\n    if (Number.isInteger(idx) && idx < 0) {\n      return target[target.length + idx];\n    }\n    return Reflect.get(target, prop);\n  }\n});\nconsole.log(arr[-1]);",
      choices: ["undefined", "3", "1", "TypeError"],
      correctIndex: 1,
      explanation:
        "Proxy의 get 트랩이 음수 인덱스를 감지하여 arr[-1]을 arr[arr.length - 1]로 변환합니다. Python 스타일의 음수 인덱싱을 구현한 예시입니다.",
    },
    {
      id: "final-q28",
      question:
        "다음 코드의 출력 결과는?\n\nconst pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);\nconst double = x => x * 2;\nconst inc = x => x + 1;\nconst square = x => x ** 2;\nconsole.log(pipe(double, inc, square)(3));",
      choices: ["49", "37", "64", "100"],
      correctIndex: 0,
      explanation:
        "pipe는 왼쪽에서 오른쪽으로 함수를 합성합니다. double(3) → 6, inc(6) → 7, square(7) → 49.",
    },
    {
      id: "final-q29",
      question:
        "다음 코드의 출력 결과는?\n\nconst memoize = fn => {\n  const cache = new Map();\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn(...args);\n    cache.set(key, result);\n    return result;\n  };\n};\nconst add = memoize((a, b) => {\n  console.log('computing');\n  return a + b;\n});\nconsole.log(add(1, 2));\nconsole.log(add(1, 2));\nconsole.log(add(2, 3));",
      choices: [
        "computing, 3, computing, 3, computing, 5",
        "computing, 3, 3, computing, 5",
        "3, 3, 5",
        "computing, 3, computing, 3, 5",
      ],
      correctIndex: 1,
      explanation:
        "첫 add(1,2) 호출 시 'computing' 출력 후 3 반환 및 캐싱. 두 번째 add(1,2)는 캐시에서 3 반환(computing 출력 없음). add(2,3)은 새로운 인자이므로 'computing' 출력 후 5 반환.",
    },
    // === 복합 주제: 트리키한 문제들 ===
    {
      id: "final-q30",
      question:
        "다음 코드의 출력 결과는?\n\nconst a = [1, 2, 3];\nconst b = [1, 2, 3];\nconsole.log(a == b);\nconsole.log(a === b);\nconsole.log(JSON.stringify(a) === JSON.stringify(b));",
      choices: [
        "true, true, true",
        "false, false, true",
        "false, false, false",
        "true, false, true",
      ],
      correctIndex: 1,
      explanation:
        "배열은 객체이므로 참조를 비교합니다. a와 b는 다른 참조이므로 == 과 === 모두 false입니다. JSON.stringify는 값을 문자열로 변환하므로 내용 비교가 가능하여 true입니다.",
    },
    {
      id: "final-q31",
      question:
        "다음 코드의 출력 결과는?\n\nconst obj = {\n  valueOf() { return 42; },\n  toString() { return 'hello'; }\n};\nconsole.log(obj + 1);\nconsole.log(`${obj}`);",
      choices: [
        "43, 'hello'",
        "'hello1', 'hello'",
        "43, '42'",
        "'421', 'hello'",
      ],
      correctIndex: 0,
      explanation:
        "산술 연산(+1)에서는 valueOf()가 우선 호출되어 42 + 1 = 43. 템플릿 리터럴은 toString()을 호출하여 'hello'가 됩니다. 타입 변환 시 힌트(number/string/default)에 따라 호출 메서드가 달라집니다.",
    },
    {
      id: "final-q32",
      question:
        "다음 코드의 출력 결과는?\n\nconsole.log([] + []);\nconsole.log([] + {});\nconsole.log({} + []);",
      choices: [
        "'', '[object Object]', '[object Object]'",
        "'', '[object Object]', 0",
        "'undefined', 'NaN', 'NaN'",
        "0, 'NaN', 0",
      ],
      correctIndex: 1,
      explanation:
        "[] + []: 빈 배열의 toString()은 ''이므로 '' + '' = ''. [] + {}: '' + '[object Object]'. {} + []: 크롬 콘솔에서 {}를 빈 블록으로 해석하면 +[]이 되어 0. 하지만 표현식 맥락에서는 '[object Object]'가 됩니다.",
    },
    {
      id: "final-q33",
      question:
        "다음 코드의 출력 결과는?\n\nfunction Dog(name) {\n  this.name = name;\n}\nDog.prototype.bark = function() {\n  return this.name + ' barks!';\n};\nconst d1 = new Dog('Rex');\nDog.prototype = { bark: () => 'Woof!' };\nconst d2 = new Dog('Max');\nconsole.log(d1.bark());\nconsole.log(d2.bark());",
      choices: [
        "'Rex barks!', 'Woof!'",
        "'Woof!', 'Woof!'",
        "'Rex barks!', 'Max barks!'",
        "TypeError",
      ],
      correctIndex: 0,
      explanation:
        "d1은 프로토타입 교체 전에 생성되어 원래 prototype 객체를 참조합니다. d2는 교체 후 생성되어 새 prototype을 참조합니다. 프로토타입 객체 자체를 교체해도 기존 인스턴스의 [[Prototype]]은 변하지 않습니다.",
    },
    {
      id: "final-q34",
      question:
        "다음 코드의 출력 결과는?\n\nPromise.resolve()\n  .then(() => {\n    throw new Error('err');\n  })\n  .then(\n    () => console.log('A'),\n    (e) => console.log('B')\n  )\n  .catch(() => console.log('C'));",
      choices: ["'A'", "'B'", "'C'", "'B' 다음 'C'"],
      correctIndex: 1,
      explanation:
        "첫 번째 then에서 에러가 발생하면 다음 then의 두 번째 인수(onRejected)가 처리합니다. 이 핸들러가 정상 반환하면 Promise가 이행되므로 catch는 실행되지 않습니다.",
    },
    {
      id: "final-q35",
      question:
        "다음 코드의 출력 결과는?\n\nconst sym = Symbol('desc');\nconst obj = { [sym]: 'value' };\nconsole.log(Object.keys(obj));\nconsole.log(Object.getOwnPropertySymbols(obj));",
      choices: [
        "['Symbol(desc)'], [Symbol(desc)]",
        "[], [Symbol(desc)]",
        "['value'], []",
        "[], []",
      ],
      correctIndex: 1,
      explanation:
        "Symbol 키 속성은 Object.keys()에 포함되지 않습니다. Object.getOwnPropertySymbols()를 사용해야 Symbol 키를 열거할 수 있습니다. for...in, JSON.stringify에서도 Symbol은 무시됩니다.",
    },
    {
      id: "final-q36",
      question:
        "다음 코드의 출력 결과는?\n\nasync function test() {\n  const result = await Promise.allSettled([\n    Promise.resolve('ok'),\n    Promise.reject('fail'),\n    Promise.resolve('done')\n  ]);\n  console.log(result.map(r => r.status));\n};\ntest();",
      choices: [
        "['fulfilled', 'fulfilled', 'fulfilled']",
        "['fulfilled', 'rejected', 'fulfilled']",
        "reject 에러 발생",
        "['ok', 'fail', 'done']",
      ],
      correctIndex: 1,
      explanation:
        "Promise.allSettled는 모든 Promise가 완료될 때까지 기다리며, 각 결과를 {status, value/reason} 형태로 반환합니다. rejected된 Promise가 있어도 전체가 reject되지 않습니다.",
    },
    {
      id: "final-q37",
      question:
        "다음 코드의 출력 결과는?\n\nlet a = { n: 1 };\nlet b = a;\na.x = a = { n: 2 };\nconsole.log(a.x);\nconsole.log(b.x);",
      choices: [
        "undefined, { n: 2 }",
        "{ n: 2 }, { n: 2 }",
        "undefined, undefined",
        "{ n: 2 }, undefined",
      ],
      correctIndex: 0,
      explanation:
        "할당은 오른쪽에서 왼쪽으로 실행되지만, 참조 해석(a.x의 a)은 할당 전에 결정됩니다. a.x의 a는 원래 객체 {n:1}을 참조합니다. a = {n:2} 실행 후, 원래 객체의 x에 {n:2}가 할당됩니다. a는 새 객체이므로 a.x는 undefined이고, b는 원래 객체를 참조하므로 b.x는 {n:2}입니다.",
    },
    {
      id: "final-q38",
      question:
        "다음 코드의 출력 결과는?\n\nclass EventEmitter {\n  #listeners = new Map();\n  on(event, fn) {\n    if (!this.#listeners.has(event)) this.#listeners.set(event, []);\n    this.#listeners.get(event).push(fn);\n  }\n  emit(event, ...args) {\n    (this.#listeners.get(event) ?? []).forEach(fn => fn(...args));\n  }\n}\nconst ee = new EventEmitter();\nee.on('data', x => console.log(x * 2));\nee.on('data', x => console.log(x + 10));\nee.emit('data', 5);",
      choices: [
        "10",
        "15",
        "10 다음 15",
        "15 다음 10",
      ],
      correctIndex: 2,
      explanation:
        "옵저버 패턴 구현입니다. 'data' 이벤트에 두 리스너가 등록 순서대로 실행됩니다. 첫 번째: 5 * 2 = 10, 두 번째: 5 + 10 = 15.",
    },
    {
      id: "final-q39",
      question:
        "다음 코드의 출력 결과는?\n\nconst obj = {\n  a: 1,\n  b: undefined,\n  c: null,\n  d: NaN\n};\nconsole.log(JSON.parse(JSON.stringify(obj)));",
      choices: [
        "{ a: 1, b: undefined, c: null, d: NaN }",
        "{ a: 1, c: null, d: null }",
        "{ a: 1, b: null, c: null, d: null }",
        "{ a: 1, c: null }",
      ],
      correctIndex: 1,
      explanation:
        "JSON.stringify는 undefined인 속성을 제거합니다(b 삭제). null은 유지됩니다. NaN은 null로 변환됩니다. 이는 깊은 복사에 JSON 방식을 사용할 때의 주의점입니다.",
    },
    {
      id: "final-q40",
      question:
        "다음 코드의 출력 결과는?\n\nfunction* gen() {\n  const x = yield 'first';\n  const y = yield x + ' second';\n  return y + ' done';\n}\nconst it = gen();\nconsole.log(it.next().value);\nconsole.log(it.next('hello').value);\nconsole.log(it.next('world').value);",
      choices: [
        "'first', 'hello second', 'world done'",
        "'first', 'undefined second', 'undefined done'",
        "'first', 'first second', undefined",
        "TypeError",
      ],
      correctIndex: 0,
      explanation:
        "첫 next()는 'first'를 yield. next('hello')는 x에 'hello'를 전달하고 'hello second'를 yield. next('world')는 y에 'world'를 전달하고 'world done'을 return. 제너레이터의 양방향 통신입니다.",
    },
  ],
};

export default finalExam;
