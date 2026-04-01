import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "05-control-flow",
  subject: "js",
  title: "제어문",
  description: "if/else, switch, for, while, for...in/of, break/continue, 레이블 문을 이해하고 상황에 맞는 제어 흐름을 선택하는 능력을 기릅니다.",
  order: 5,
  group: "기초",
  prerequisites: ["04-type-coercion"],
  estimatedMinutes: 15,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "제어문은 교통 시스템과 같습니다.\n\n" +
        "**if/else**는 교차로의 신호등입니다. 조건에 따라 코드의 흐름을 다른 방향으로 안내합니다.\n\n" +
        "**switch**는 인터체인지(분기 고속도로)입니다. 출구(case) 번호가 일치하면 해당 방향으로 빠져나갑니다. `break`가 없으면 다음 출구를 지나쳐 계속 달립니다(fall-through).\n\n" +
        "**for 루프**는 정해진 횟수만큼 왕복하는 셔틀버스입니다. 출발 전에 몇 번 왕복할지 알고 있습니다.\n\n" +
        "**while 루프**는 연료가 있는 동안 계속 달리는 자동차입니다. 언제 멈출지 사전에 정해지지 않았습니다.\n\n" +
        "**break**는 비상 탈출구, **continue**는 이번 정류장을 건너뛰는 것, **레이블**은 '3호선 환승'처럼 특정 구간을 지정해서 빠져나가는 것입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "제어문은 기본적으로 보이지만, 잘못 사용하면 버그와 성능 문제가 발생합니다.\n\n" +
        "```js\n" +
        "// switch fall-through 버그\n" +
        "switch (day) {\n" +
        "  case 'Monday':\n" +
        "    doMondayWork();\n" +
        "    // break 빠뜨림 — Tuesday 작업도 실행!\n" +
        "  case 'Tuesday':\n" +
        "    doTuesdayWork();\n" +
        "    break;\n" +
        "}\n" +
        "\n" +
        "// for...in으로 배열을 순회하면?\n" +
        "const arr = [1, 2, 3];\n" +
        "for (const key in arr) {\n" +
        "  console.log(key); // '0', '1', '2' — 값이 아닌 인덱스 문자열!\n" +
        "}\n" +
        "\n" +
        "// 무한 루프\n" +
        "let i = 0;\n" +
        "while (i < 10) {\n" +
        "  console.log(i);\n" +
        "  // i++ 빠뜨림 — 영원히 실행\n" +
        "}\n" +
        "```\n\n" +
        "어떤 루프를 선택해야 하는지, for...in과 for...of의 차이, switch fall-through 처리, 중첩 루프 탈출 방법 등을 정확히 이해하지 못하면 미묘한 버그가 숨어듭니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### if / else if / else\n\n" +
        "조건이 2~3개일 때 적합합니다. 조건은 위에서 아래로 평가되며, 처음 truthy인 블록만 실행됩니다. 삼항 연산자(`condition ? a : b`)는 단순한 값 선택에 사용하고, 복잡한 로직에는 if/else를 사용하세요.\n\n" +
        "### switch\n\n" +
        "하나의 값을 여러 경우와 비교할 때 if-else 체인보다 가독성이 좋습니다. **엄격 비교(`===`)**를 사용합니다. 각 `case` 끝에 `break`를 빠뜨리지 마세요. 의도적인 fall-through에는 주석을 달아 명시하세요. `default`는 어느 case에도 해당하지 않을 때 실행됩니다.\n\n" +
        "### for\n\n" +
        "반복 횟수가 정해진 경우 사용합니다. `for (초기화; 조건; 증감)` 구조. 초기화와 증감은 생략 가능합니다.\n\n" +
        "### while / do...while\n\n" +
        "`while`은 조건을 먼저 확인(0번 이상 실행), `do...while`은 본문을 먼저 실행(최소 1번 실행). 조건이 처음부터 false일 수 있으면 while, 적어도 한 번은 실행해야 하면 do...while을 사용합니다.\n\n" +
        "### for...in vs for...of\n\n" +
        "**for...in:** 객체의 **열거 가능한 프로퍼티 키**를 순회합니다. 배열에 사용하면 인덱스가 문자열로 나오고, 프로토타입 체인의 프로퍼티도 포함될 수 있어 배열 순회에는 사용하지 마세요. 객체의 키를 순회할 때 사용합니다.\n\n" +
        "**for...of:** **이터러블(iterable)** 객체의 값을 순회합니다. 배열, 문자열, Map, Set, arguments, NodeList 등에 사용합니다. 일반 객체는 이터러블이 아니므로 사용 불가합니다(`TypeError`).\n\n" +
        "### break / continue\n\n" +
        "`break`: 현재 루프(또는 switch)를 즉시 종료합니다.\n" +
        "`continue`: 현재 반복을 건너뛰고 다음 반복으로 이동합니다.\n\n" +
        "### 레이블 문 (Label)\n\n" +
        "중첩 루프에서 외부 루프를 break/continue할 때 사용합니다. `outer: for (...)` 처럼 레이블을 지정하고, `break outer`로 외부 루프를 종료합니다. 코드 가독성을 해칠 수 있으므로 꼭 필요한 경우에만 사용하세요.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: for...of 이터레이션 프로토콜",
      content:
        "for...of가 내부적으로 이터레이터 프로토콜을 어떻게 활용하는지 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// for...of의 내부 동작 (의사코드)\n' +
          'function forOf(iterable: Iterable<any>, body: (value: any) => void) {\n' +
          '  // 1. 이터레이터 획득 ([Symbol.iterator]() 호출)\n' +
          '  const iterator = iterable[Symbol.iterator]();\n' +
          '\n' +
          '  while (true) {\n' +
          '    // 2. 다음 값 요청\n' +
          '    const result = iterator.next();\n' +
          '\n' +
          '    // 3. 순회 완료 확인\n' +
          '    if (result.done) break;\n' +
          '\n' +
          '    // 4. 본문 실행\n' +
          '    body(result.value);\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// 실제 사용 예:\n' +
          'const fruits = ["사과", "바나나", "체리"];\n' +
          'for (const fruit of fruits) {\n' +
          '  console.log(fruit); // 사과, 바나나, 체리\n' +
          '}\n' +
          '\n' +
          '// 문자열도 이터러블 (유니코드 코드포인트 단위)\n' +
          'for (const char of "hello") {\n' +
          '  console.log(char); // h, e, l, l, o\n' +
          '}\n' +
          '\n' +
          '// Map 순회\n' +
          'const map = new Map([["a", 1], ["b", 2]]);\n' +
          'for (const [key, value] of map) {\n' +
          '  console.log(key, value); // a 1, b 2\n' +
          '}',
        description: "for...of는 이터레이터 프로토콜(Symbol.iterator)을 구현한 모든 객체에 사용할 수 있습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 제어문 선택과 최적화",
      content:
        "상황에 맞는 제어문을 선택하고 중첩 루프를 효율적으로 처리하는 방법을 익힙니다.",
      code: {
        language: "javascript",
        code:
          '// 1. for...in (객체 키 순회) vs for...of (배열 값 순회)\n' +
          'const person = { name: "Alice", age: 30, city: "서울" };\n' +
          'for (const key in person) {\n' +
          '  console.log(`${key}: ${person[key]}`);\n' +
          '}\n' +
          '// name: Alice, age: 30, city: 서울\n' +
          '\n' +
          'const scores = [85, 92, 78];\n' +
          'for (const score of scores) {\n' +
          '  console.log(score); // 85, 92, 78 (값)\n' +
          '}\n' +
          '\n' +
          '// 2. 레이블로 중첩 루프 탈출\n' +
          'outer: for (let i = 0; i < 3; i++) {\n' +
          '  for (let j = 0; j < 3; j++) {\n' +
          '    if (i === 1 && j === 1) {\n' +
          '      console.log(`break at i=${i}, j=${j}`);\n' +
          '      break outer;  // 외부 루프까지 탈출\n' +
          '    }\n' +
          '    console.log(`i=${i}, j=${j}`);\n' +
          '  }\n' +
          '}\n' +
          '// i=0,j=0 / i=0,j=1 / i=0,j=2 / i=1,j=0 / break at i=1,j=1\n' +
          '\n' +
          '// 3. switch with fall-through (의도적)\n' +
          'function getDaysInMonth(month) {\n' +
          '  switch (month) {\n' +
          '    case 2:\n' +
          '      return 28; // 윤년 무시\n' +
          '    case 4:\n' +
          '    case 6:\n' +
          '    case 9:\n' +
          '    case 11:\n' +
          '      return 30; // 의도적 fall-through (같은 처리)\n' +
          '    default:\n' +
          '      return 31;\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// 4. continue로 특정 항목 건너뛰기\n' +
          'const numbers = [1, -2, 3, -4, 5];\n' +
          'const positives = [];\n' +
          'for (const n of numbers) {\n' +
          '  if (n < 0) continue;  // 음수 건너뜀\n' +
          '  positives.push(n);\n' +
          '}\n' +
          'console.log(positives); // [1, 3, 5]',
        description: "for...in은 객체 키에, for...of는 이터러블 값에 사용합니다. 레이블은 중첩 루프 탈출에만 제한적으로 활용하세요.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 제어문 | 용도 | 핵심 주의사항 |\n" +
        "|--------|------|---------------|\n" +
        "| if/else | 조건 분기 | 복잡한 조건에 삼항 연산자 남용 피하기 |\n" +
        "| switch | 단일 값의 다중 비교 | break 빠뜨리지 않기, 엄격 비교(===) |\n" +
        "| for | 횟수 기반 반복 | 루프 변수 블록 스코프에는 let 사용 |\n" +
        "| while | 조건 기반 반복 | 무한 루프 방지 (탈출 조건 확인) |\n" +
        "| do...while | 최소 1회 실행 보장 | 드물게 사용되지만 정확한 상황 파악 필요 |\n" +
        "| for...in | 객체 키 순회 | 배열에 사용 금지 |\n" +
        "| for...of | 이터러블 값 순회 | 일반 객체에 사용 시 TypeError |\n" +
        "| break/continue | 루프 제어 | 레이블과 함께 중첩 루프 제어 가능 |\n\n" +
        "**핵심:** 배열 값에는 `for...of` 또는 `forEach`, 객체 키에는 `for...in` 또는 `Object.entries()`를 사용하세요. 현대 자바스크립트에서는 루프보다 `map`, `filter`, `reduce` 같은 고차 함수를 선호합니다.\n\n" +
        "**다음 챕터 미리보기:** 함수의 기초와 스코프 체인, 클로저를 학습하면서 자바스크립트 함수가 일급 객체임을 이해합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "switch문의 fall-through 동작과 방지 방법을 설명할 수 있다",
    "for...in과 for...of의 차이와 올바른 사용 상황을 설명할 수 있다",
    "while과 do...while의 실행 횟수 차이를 설명할 수 있다",
    "레이블 문을 사용해 중첩 루프를 탈출하는 코드를 작성할 수 있다",
    "continue로 특정 반복을 건너뛰는 패턴을 작성할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "for...in 루프로 배열을 순회하면 발생할 수 있는 문제는?",
      choices: [
        "배열 요소를 역순으로 반환한다",
        "인덱스가 숫자가 아닌 문자열로 반환되고 프로토타입 프로퍼티가 포함될 수 있다",
        "배열의 첫 번째 요소를 건너뛴다",
        "TypeError가 발생한다",
      ],
      correctIndex: 1,
      explanation: "for...in은 객체의 열거 가능한 프로퍼티 키를 순회합니다. 배열에 사용하면 인덱스가 문자열 '0', '1', '2'로 반환되고, Array.prototype에 추가된 프로퍼티도 순회될 수 있습니다. 배열에는 for...of를 사용하세요.",
    },
    {
      id: "q2",
      question: "switch문에서 break를 생략하면 어떻게 되는가?",
      choices: [
        "SyntaxError가 발생한다",
        "switch문이 즉시 종료된다",
        "다음 case 블록이 조건 없이 실행된다(fall-through)",
        "default로 이동한다",
      ],
      correctIndex: 2,
      explanation: "switch문에서 break를 생략하면 해당 case 이후의 모든 case 블록이 조건 검사 없이 순서대로 실행됩니다(fall-through). 이는 버그의 원인이 되므로 의도적인 경우 주석으로 명시하세요.",
    },
    {
      id: "q3",
      question: "do...while과 while의 핵심 차이점은?",
      choices: [
        "do...while은 조건이 false여도 최소 한 번 실행된다",
        "do...while은 break를 사용할 수 없다",
        "while은 최소 한 번 실행된다",
        "do...while은 for 루프보다 빠르다",
      ],
      correctIndex: 0,
      explanation: "do...while은 본문을 먼저 실행한 후 조건을 확인합니다. 따라서 조건이 처음부터 false여도 본문이 최소 한 번은 실행됩니다. while은 조건을 먼저 확인하므로 처음부터 false이면 본문이 한 번도 실행되지 않습니다.",
    },
    {
      id: "q4",
      question: "for...of를 일반 객체({})에 사용하면?",
      choices: [
        "객체의 값들을 순회한다",
        "객체의 키들을 순회한다",
        "TypeError가 발생한다",
        "아무것도 실행되지 않는다",
      ],
      correctIndex: 2,
      explanation: "for...of는 이터러블(Symbol.iterator가 구현된) 객체에만 사용할 수 있습니다. 일반 객체는 기본적으로 이터러블이 아니므로 TypeError: object is not iterable이 발생합니다. 객체를 순회하려면 Object.entries(), Object.keys(), Object.values()와 for...of를 함께 사용하세요.",
    },
    {
      id: "q5",
      question: "레이블 문(label)의 주요 용도는?",
      choices: [
        "변수에 별명을 붙이기 위해",
        "중첩 루프에서 외부 루프를 break/continue하기 위해",
        "함수에 이름을 붙이기 위해",
        "조건문을 건너뛰기 위해",
      ],
      correctIndex: 1,
      explanation: "레이블 문은 break와 continue 앞에 지정하여 중첩 루프에서 특정 외부 루프를 대상으로 제어할 수 있게 합니다. 가독성을 해칠 수 있으므로 꼭 필요한 경우에만 사용하고, 가능하면 별도 함수로 추출하는 방법을 고려하세요.",
    },
    {
      id: "q6",
      question: "for (let i = 0; i < 5; i++) { if (i === 3) continue; console.log(i); }의 출력은?",
      choices: ["0 1 2 3 4", "0 1 2 4", "0 1 2", "3만 출력"],
      correctIndex: 1,
      explanation: "continue는 현재 반복을 건너뛰고 다음 반복으로 이동합니다. i가 3일 때 console.log를 건너뛰므로 0, 1, 2, 4가 출력됩니다.",
    },
  ],
};

export default chapter;
