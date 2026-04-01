import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-04",
  title: "중간 점검 4: 이터러블 ~ 메모리",
  coverGroups: ["이터러블과 제너레이터", "모듈과 환경", "메모리와 최적화"],
  questions: [
    {
      id: "mid04-q1",
      question:
        "다음 중 이터러블 프로토콜을 충족하기 위해 필요한 것은?",
      choices: [
        "next() 메서드를 가진 객체",
        "Symbol.iterator 메서드를 가진 객체",
        "length 속성을 가진 객체",
        "forEach 메서드를 가진 객체",
      ],
      correctIndex: 1,
      explanation:
        "이터러블 프로토콜은 객체가 Symbol.iterator 메서드를 구현해야 합니다. 이 메서드는 이터레이터(next() 메서드를 가진 객체)를 반환해야 합니다.",
    },
    {
      id: "mid04-q2",
      question:
        "다음 코드의 출력 결과는?\n\nfunction* gen() {\n  yield 1;\n  yield 2;\n  yield 3;\n}\nconst it = gen();\nconsole.log(it.next());\nconsole.log(it.next());\nconsole.log(it.next());\nconsole.log(it.next());",
      choices: [
        "{value:1,done:false}, {value:2,done:false}, {value:3,done:false}, {value:undefined,done:true}",
        "{value:1,done:false}, {value:2,done:false}, {value:3,done:true}, {value:undefined,done:true}",
        "{value:1,done:true}, {value:2,done:true}, {value:3,done:true}, {value:undefined,done:true}",
        "1, 2, 3, undefined",
      ],
      correctIndex: 0,
      explanation:
        "제너레이터의 next()는 {value, done} 객체를 반환합니다. yield 값은 done: false와 함께 반환되고, 모든 yield가 소진되면 {value: undefined, done: true}를 반환합니다.",
    },
    {
      id: "mid04-q3",
      question:
        "다음 코드의 출력 결과는?\n\nfunction* counter() {\n  let i = 0;\n  while (true) {\n    const reset = yield i;\n    if (reset) i = 0;\n    else i++;\n  }\n}\nconst c = counter();\nconsole.log(c.next().value);\nconsole.log(c.next().value);\nconsole.log(c.next(true).value);\nconsole.log(c.next().value);",
      choices: [
        "0, 1, 0, 1",
        "0, 1, 2, 0",
        "0, 1, 0, 0",
        "0, 0, 0, 0",
      ],
      correctIndex: 0,
      explanation:
        "next()에 전달한 인수는 yield 표현식의 반환값이 됩니다. 첫 호출 → 0, 두 번째(reset=undefined) → 1, 세 번째(reset=true) → i를 0으로 리셋 후 yield 0, 네 번째(reset=undefined) → 1.",
    },
    {
      id: "mid04-q4",
      question:
        "다음 중 Symbol에 대한 설명으로 틀린 것은?",
      choices: [
        "Symbol()은 매번 고유한 값을 생성한다",
        "Symbol.for('key')는 전역 심볼 레지스트리에서 심볼을 검색하거나 생성한다",
        "Symbol은 new 키워드로 생성할 수 있다",
        "객체의 속성 키로 사용할 수 있다",
      ],
      correctIndex: 2,
      explanation:
        "Symbol은 원시값이므로 new 키워드를 사용하면 TypeError가 발생합니다. Symbol()로 직접 호출하여 생성합니다.",
    },
    {
      id: "mid04-q5",
      question:
        "CommonJS와 ES Modules의 차이로 올바른 것은?",
      choices: [
        "CommonJS는 정적 분석이 가능하고 ES Modules는 불가능하다",
        "ES Modules는 동기적으로 로드되고 CommonJS는 비동기적이다",
        "ES Modules의 import는 호이스팅되며 정적 구조를 가진다",
        "CommonJS는 브라우저 전용이고 ES Modules는 Node.js 전용이다",
      ],
      correctIndex: 2,
      explanation:
        "ES Modules의 import는 파일 최상위로 호이스팅되며 정적으로 분석됩니다. 이 덕분에 트리 쉐이킹이 가능합니다. CommonJS의 require는 동적이고 런타임에 평가됩니다.",
    },
    {
      id: "mid04-q6",
      question:
        "'use strict' 모드에서 달라지는 동작이 아닌 것은?",
      choices: [
        "선언하지 않은 변수에 할당하면 에러가 발생한다",
        "함수의 this 기본값이 undefined가 된다",
        "with 문을 사용할 수 없다",
        "const로 선언한 변수를 재할당하면 에러가 발생한다",
      ],
      correctIndex: 3,
      explanation:
        "const 재할당 에러는 strict mode와 무관하게 항상 발생합니다. strict mode는 선언 없는 할당 금지, this 기본값 undefined, with 문 금지, 중복 매개변수 금지 등의 규칙을 추가합니다.",
    },
    {
      id: "mid04-q7",
      question:
        "다음 코드의 출력 결과는?\n\ntry {\n  try {\n    throw new Error('inner');\n  } finally {\n    console.log('finally');\n  }\n} catch (e) {\n  console.log(e.message);\n}",
      choices: [
        "'inner'",
        "'finally' 다음 'inner'",
        "'finally'만",
        "Uncaught Error: inner",
      ],
      correctIndex: 1,
      explanation:
        "내부 try에 catch가 없으므로 finally가 먼저 실행된 뒤, 에러가 외부 catch로 전파됩니다. 따라서 'finally', 'inner' 순서로 출력됩니다.",
    },
    {
      id: "mid04-q8",
      question:
        "JavaScript의 가비지 컬렉션(GC)에 대한 설명으로 틀린 것은?",
      choices: [
        "도달 가능성(reachability)을 기준으로 메모리를 회수한다",
        "Mark-and-Sweep 알고리즘이 일반적으로 사용된다",
        "개발자가 명시적으로 GC 시점을 제어할 수 있다",
        "순환 참조도 루트에서 도달할 수 없으면 회수된다",
      ],
      correctIndex: 2,
      explanation:
        "JavaScript의 GC는 자동으로 수행되며 개발자가 직접 시점을 제어할 수 없습니다. Mark-and-Sweep 알고리즘은 루트에서 도달할 수 없는 객체를 회수하므로 순환 참조도 처리할 수 있습니다.",
    },
    {
      id: "mid04-q9",
      question:
        "다음 중 메모리 누수의 원인이 되지 않는 것은?",
      choices: [
        "제거되지 않은 이벤트 리스너",
        "해제되지 않은 타이머(setInterval)",
        "블록 스코프 내의 let 변수",
        "전역 변수에 대한 의도치 않은 참조",
      ],
      correctIndex: 2,
      explanation:
        "블록 스코프 내의 let 변수는 블록을 벗어나면 참조가 해제되어 GC 대상이 됩니다. 반면 이벤트 리스너, 타이머, 전역 변수는 명시적으로 해제하지 않으면 메모리 누수를 유발합니다.",
    },
    {
      id: "mid04-q10",
      question:
        "디바운스(debounce)에 대한 설명으로 올바른 것은?",
      choices: [
        "일정 간격마다 함수를 실행한다",
        "마지막 호출 이후 일정 시간이 지나면 함수를 실행한다",
        "함수 실행 결과를 캐싱한다",
        "함수를 비동기적으로 변환한다",
      ],
      correctIndex: 1,
      explanation:
        "디바운스는 연속적인 이벤트 발생 시 마지막 이벤트 이후 지정된 시간이 경과해야 함수를 실행합니다. 검색 입력 등에 활용됩니다. 일정 간격마다 실행하는 것은 스로틀입니다.",
    },
    {
      id: "mid04-q11",
      question:
        "다음 코드의 출력 결과는?\n\nfunction* fibonacci() {\n  let [a, b] = [0, 1];\n  while (true) {\n    yield a;\n    [a, b] = [b, a + b];\n  }\n}\nconst fib = fibonacci();\nconst first5 = [];\nfor (let i = 0; i < 5; i++) {\n  first5.push(fib.next().value);\n}\nconsole.log(first5);",
      choices: [
        "[1, 1, 2, 3, 5]",
        "[0, 1, 1, 2, 3]",
        "[0, 1, 2, 3, 5]",
        "[1, 2, 3, 5, 8]",
      ],
      correctIndex: 1,
      explanation:
        "피보나치 제너레이터는 a=0, b=1에서 시작합니다. yield a가 먼저 실행되므로 0, 1, 1, 2, 3이 차례로 반환됩니다.",
    },
    {
      id: "mid04-q12",
      question:
        "WeakMap과 Map의 차이로 올바른 것은?",
      choices: [
        "WeakMap은 원시값을 키로 사용할 수 있다",
        "WeakMap의 키는 GC에 의해 수거될 수 있다",
        "WeakMap은 이터러블이다",
        "WeakMap은 size 속성을 가진다",
      ],
      correctIndex: 1,
      explanation:
        "WeakMap은 키에 대한 약한 참조를 유지하므로, 키 객체에 대한 다른 참조가 없으면 GC가 수거할 수 있습니다. 이 때문에 이터러블이 아니고 size 속성도 없습니다.",
    },
    {
      id: "mid04-q13",
      question:
        "다음 코드의 출력 결과는?\n\nfunction* outer() {\n  yield 1;\n  yield* inner();\n  yield 4;\n}\nfunction* inner() {\n  yield 2;\n  yield 3;\n}\nconsole.log([...outer()]);",
      choices: [
        "[1, [2, 3], 4]",
        "[1, 2, 3, 4]",
        "[1, 4]",
        "TypeError",
      ],
      correctIndex: 1,
      explanation:
        "yield*는 다른 이터러블/제너레이터에 위임합니다. inner()의 yield 값이 outer()의 값처럼 순차적으로 반환되어 [1, 2, 3, 4]가 됩니다.",
    },
    {
      id: "mid04-q14",
      question:
        "스로틀(throttle)이 적합한 사용 사례는?",
      choices: [
        "검색창 자동 완성 API 호출",
        "윈도우 리사이즈 이벤트 처리",
        "폼 제출 버튼 중복 클릭 방지",
        "Promise 체이닝 최적화",
      ],
      correctIndex: 1,
      explanation:
        "스로틀은 일정 시간 간격으로 한 번씩 함수를 실행하므로, 연속적으로 발생하는 스크롤이나 리사이즈 이벤트에 적합합니다. 검색 자동 완성은 디바운스가 더 적합합니다.",
    },
    {
      id: "mid04-q15",
      question:
        "ES Modules에서 다음 코드가 에러를 발생시키는 이유는?\n\nif (condition) {\n  import { foo } from './module.js';\n}",
      choices: [
        "import는 비동기이므로 if 문 안에서 사용할 수 없다",
        "import 선언은 모듈의 최상위 레벨에서만 사용할 수 있다",
        "condition이 정의되지 않았기 때문이다",
        "중괄호 구조 분해 문법이 잘못되었다",
      ],
      correctIndex: 1,
      explanation:
        "ES Modules의 import 선언은 정적이므로 모듈의 최상위 레벨에서만 사용할 수 있습니다. 조건부 로드가 필요하면 동적 import()를 사용해야 합니다.",
    },
    {
      id: "mid04-q16",
      question:
        "다음 코드의 출력 결과는?\n\nconst obj = {\n  [Symbol.iterator]() {\n    let n = 0;\n    return {\n      next() {\n        return n < 3\n          ? { value: n++, done: false }\n          : { done: true };\n      }\n    };\n  }\n};\nconsole.log([...obj]);",
      choices: [
        "[0, 1, 2]",
        "[1, 2, 3]",
        "TypeError: obj is not iterable",
        "[0, 1, 2, undefined]",
      ],
      correctIndex: 0,
      explanation:
        "객체에 Symbol.iterator를 구현하면 이터러블이 됩니다. 스프레드 연산자는 이터러블을 펼칠 수 있으므로 [0, 1, 2]가 출력됩니다.",
    },
    {
      id: "mid04-q17",
      question:
        "클로저가 메모리 누수의 원인이 될 수 있는 상황은?",
      choices: [
        "함수 내부에서 지역 변수를 선언할 때",
        "클로저가 참조하는 외부 변수가 더 이상 필요 없는데 클로저가 계속 유지될 때",
        "순수 함수를 사용할 때",
        "화살표 함수를 사용할 때",
      ],
      correctIndex: 1,
      explanation:
        "클로저는 외부 스코프의 변수에 대한 참조를 유지합니다. 이벤트 리스너나 타이머의 콜백으로 등록된 클로저가 해제되지 않으면, 참조하는 변수들도 GC되지 않아 메모리 누수가 발생합니다.",
    },
  ],
};

export default midQuiz;
