import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "09-scope",
  subject: "js",
  title: "스코프",
  description: "전역/지역/블록 스코프의 차이와 스코프 체인, 변수 검색 규칙, 함수 레벨 vs 블록 레벨 스코프를 깊이 이해합니다.",
  order: 9,
  group: "스코프와 실행 컨텍스트",
  prerequisites: ["08-arrow-function"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "스코프는 변수가 '살 수 있는 구역'입니다. 아파트 단지에 비유해봅시다.\n\n" +
        "**전역 스코프**는 아파트 단지 전체에서 쓸 수 있는 공용 게시판입니다. 누구든 글을 붙이고 읽을 수 있지만, 너무 많이 붙이면 지저분해집니다.\n\n" +
        "**함수 스코프**는 각 세대(가구)의 개인 공간입니다. 101호 안에서 쓰는 물건은 101호 사람만 쓸 수 있습니다. 외부인은 접근 불가입니다.\n\n" +
        "**블록 스코프**는 세대 안의 방처럼 더 세분화된 공간입니다. 안방에서 쓰는 물건은 안방에서만, 거실에서 쓰는 물건은 거실에서만 사용합니다.\n\n" +
        "**스코프 체인**은 물건을 찾는 과정입니다. 내 방에 없으면 거실을 확인하고, 거실에도 없으면 현관을 확인하고, 그래도 없으면 공용 게시판(전역)을 봅니다. 이렇게 안쪽에서 바깥쪽으로 순서대로 찾아나가는 것이 스코프 체인입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프로그램이 커질수록 변수 이름이 충돌하거나, 의도치 않은 곳에서 변수가 수정되는 문제가 생깁니다.\n\n" +
        "스코프 없이 모든 변수가 전역이라면:\n\n" +
        "1. **이름 충돌** — 라이브러리 A와 라이브러리 B가 각각 `count`라는 변수를 쓰면 서로 덮어씁니다.\n" +
        "2. **예측 불가능한 변경** — 코드 어느 곳에서든 전역 변수를 바꿀 수 있어서 버그 추적이 매우 어렵습니다.\n" +
        "3. **메모리 낭비** — 모든 변수가 프로그램 전체 생명주기 동안 메모리를 차지합니다.\n\n" +
        "또한, `var`의 함수 스코프와 `let`/`const`의 블록 스코프를 혼용하면 예상치 못한 버그가 발생합니다. 예를 들어 `if` 블록 안에서 `var`로 선언한 변수가 블록 밖에서도 살아있는 현상이 대표적입니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "자바스크립트는 스코프 시스템으로 변수의 접근 범위를 제한합니다.\n\n" +
        "### 전역 스코프 (Global Scope)\n" +
        "코드 어디서든 접근 가능한 최상위 스코프입니다. 브라우저에서는 `window` 객체, Node.js에서는 `global` 객체가 전역 스코프의 환경입니다. `var`로 전역에서 선언하면 전역 객체의 프로퍼티가 되지만, `let`/`const`는 전역 렉시컬 환경에만 등록됩니다.\n\n" +
        "### 지역 스코프 (Local Scope) / 함수 스코프\n" +
        "함수 내부에서 선언된 변수는 그 함수 안에서만 접근 가능합니다. `var`, `let`, `const` 모두 함수 경계를 넘지 못합니다. 함수가 호출될 때마다 새로운 스코프가 생성되고, 함수 실행이 끝나면 소멸합니다.\n\n" +
        "### 블록 스코프 (Block Scope)\n" +
        "`{}`로 감싸인 블록(`if`, `for`, `while`, 단순 블록) 안에서 `let`/`const`로 선언한 변수는 그 블록 안에서만 살아있습니다. `var`는 블록을 무시하고 함수 스코프(또는 전역)에 등록됩니다.\n\n" +
        "### 스코프 체인 (Scope Chain)\n" +
        "변수를 찾을 때 자바스크립트 엔진은 현재 스코프부터 시작해서 바깥 스코프로 순서대로 탐색합니다. 가장 먼저 찾아진 변수를 사용하며, 전역 스코프까지 올라가도 없으면 `ReferenceError`가 발생합니다. 이 탐색 경로를 스코프 체인이라고 합니다.\n\n" +
        "### 변수 섀도잉 (Variable Shadowing)\n" +
        "안쪽 스코프에서 바깥 스코프와 같은 이름으로 변수를 선언하면, 안쪽 변수가 바깥 변수를 가립니다(섀도잉). 바깥 변수는 사라지지 않고 단지 안쪽 스코프에서 접근이 차단됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 스코프 체인 탐색",
      content:
        "자바스크립트 엔진이 변수를 찾을 때 스코프 체인을 어떻게 탐색하는지 의사코드로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// 스코프 체인 탐색 의사코드\n' +
          '\n' +
          'function lookupVariable(name, currentScope) {\n' +
          '  // 1. 현재 스코프에서 찾기\n' +
          '  if (currentScope.has(name)) {\n' +
          '    return currentScope.get(name);\n' +
          '  }\n' +
          '  // 2. 바깥 스코프로 이동\n' +
          '  if (currentScope.outer !== null) {\n' +
          '    return lookupVariable(name, currentScope.outer);\n' +
          '  }\n' +
          '  // 3. 전역 스코프까지 왔는데 없으면 에러\n' +
          '  throw new ReferenceError(`${name} is not defined`);\n' +
          '}\n' +
          '\n' +
          '// 실제 예시\n' +
          'const globalScope = { x: 10 };\n' +
          '\n' +
          'function outer() {\n' +
          '  const y = 20; // outer 함수 스코프\n' +
          '\n' +
          '  function inner() {\n' +
          '    const z = 30; // inner 함수 스코프\n' +
          '    console.log(z); // 1. 현재 스코프에서 z 발견 → 30\n' +
          '    console.log(y); // 1. 현재 없음 → 2. outer에서 y 발견 → 20\n' +
          '    console.log(x); // 1. 없음 → 2. outer 없음 → 3. 전역에서 x 발견 → 10\n' +
          '  }\n' +
          '\n' +
          '  inner();\n' +
          '}\n' +
          '\n' +
          'outer();\n' +
          '\n' +
          '// var의 함수 스코프 vs let의 블록 스코프\n' +
          'function blockScopeDemo() {\n' +
          '  if (true) {\n' +
          '    var funcScoped = "함수 스코프";  // if 블록 밖에서도 접근 가능\n' +
          '    let blockScoped = "블록 스코프"; // if 블록 안에서만 접근 가능\n' +
          '  }\n' +
          '  console.log(funcScoped);  // "함수 스코프" — var는 블록 무시\n' +
          '  // console.log(blockScoped); // ReferenceError — let은 블록 존중\n' +
          '}',
        description: "스코프 체인은 안쪽에서 바깥쪽으로 순서대로 탐색하며, 첫 번째로 발견된 변수를 사용합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 스코프 체인과 섀도잉",
      content:
        "스코프 체인과 변수 섀도잉이 실제로 어떻게 동작하는지 다양한 케이스로 확인합니다.",
      code: {
        language: "javascript",
        code:
          '// ===== 스코프 체인 탐색 =====\n' +
          'const planet = "지구";\n' +
          '\n' +
          'function country() {\n' +
          '  const nation = "한국";\n' +
          '\n' +
          '  function city() {\n' +
          '    const town = "서울";\n' +
          '    // 스코프 체인: city → country → 전역\n' +
          '    console.log(`${planet} > ${nation} > ${town}`);\n' +
          '    // 출력: "지구 > 한국 > 서울"\n' +
          '  }\n' +
          '\n' +
          '  city();\n' +
          '  // console.log(town); // ReferenceError: town은 city 스코프\n' +
          '}\n' +
          '\n' +
          'country();\n' +
          '\n' +
          '// ===== 변수 섀도잉 =====\n' +
          'const color = "빨강";\n' +
          '\n' +
          'function paintRoom() {\n' +
          '  const color = "파랑"; // 전역 color를 섀도잉\n' +
          '  console.log(color);    // "파랑" — 안쪽 변수가 우선\n' +
          '}\n' +
          '\n' +
          'paintRoom();\n' +
          'console.log(color); // "빨강" — 전역 변수는 여전히 살아있음\n' +
          '\n' +
          '// ===== 블록 스코프 활용 =====\n' +
          'function processItems(items) {\n' +
          '  for (let i = 0; i < items.length; i++) {\n' +
          '    const item = items[i]; // 반복마다 새로운 블록 스코프\n' +
          '    setTimeout(() => {\n' +
          '      console.log(i, item); // 의도대로 0, 1, 2 출력\n' +
          '    }, i * 100);\n' +
          '  }\n' +
          '  // console.log(i);    // ReferenceError — i는 for 블록 스코프\n' +
          '  // console.log(item); // ReferenceError — item도 for 블록 스코프\n' +
          '}\n' +
          '\n' +
          'processItems(["사과", "바나나", "체리"]);',
        description: "스코프는 변수의 생존 범위를 제한하여 코드의 예측 가능성과 안정성을 높입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 스코프 종류 | 생성 시점 | var | let/const |\n" +
        "|------------|---------|-----|----------|\n" +
        "| 전역 스코프 | 프로그램 시작 | 전역 객체 프로퍼티 | 전역 렉시컬 환경 |\n" +
        "| 함수 스코프 | 함수 호출 시 | O | O |\n" +
        "| 블록 스코프 | `{}` 진입 시 | X (무시) | O |\n\n" +
        "**스코프 체인 탐색 순서:** 현재 스코프 → 바깥 스코프 → … → 전역 스코프 → ReferenceError\n\n" +
        "**핵심 원칙:**\n" +
        "- 변수는 필요한 최소 스코프에서 선언하세요 (최소 권한 원칙)\n" +
        "- 전역 변수는 가능한 한 피하세요\n" +
        "- `let`/`const`를 써서 블록 스코프의 예측 가능성을 활용하세요\n\n" +
        "**다음 챕터 미리보기:** 스코프가 '언제 결정되는가'가 렉시컬 스코프의 핵심입니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "스코프는 변수를 찾는 규칙이다. 안쪽에서 바깥쪽으로만 탐색하며, 이 단방향 체인이 변수의 접근 범위를 결정한다.",
  checklist: [
    "전역 스코프, 함수 스코프, 블록 스코프의 차이를 설명할 수 있다",
    "var와 let/const의 스코프 범위 차이를 코드로 보여줄 수 있다",
    "스코프 체인의 탐색 순서를 설명할 수 있다",
    "변수 섀도잉이 무엇인지, 원본 변수에 어떤 영향을 미치는지 설명할 수 있다",
    "블록 안에서 var와 let을 선언했을 때의 차이를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "다음 코드의 출력 결과는?\n```js\nvar x = 1;\nif (true) { var x = 2; }\nconsole.log(x);\n```",
      choices: ["1", "2", "ReferenceError", "undefined"],
      correctIndex: 1,
      explanation: "var는 블록 스코프를 무시하고 함수(또는 전역) 스코프에 등록됩니다. if 블록 안의 var x = 2는 바깥의 var x와 같은 변수이므로 값이 2로 덮어씌워집니다.",
    },
    {
      id: "q2",
      question: "스코프 체인에서 변수를 탐색하는 방향은?",
      choices: [
        "전역 스코프 → 현재 스코프",
        "현재 스코프 → 바깥 스코프 → 전역 스코프",
        "모든 스코프를 동시에 검색",
        "선언된 순서대로 검색",
      ],
      correctIndex: 1,
      explanation: "스코프 체인은 현재 실행 중인 스코프에서 시작해 바깥쪽으로 순서대로 탐색합니다. 가장 먼저 발견된 변수를 사용하므로 안쪽 변수가 바깥 변수보다 우선순위가 높습니다.",
    },
    {
      id: "q3",
      question: "다음 중 블록 스코프를 생성하는 구문으로 올바른 것은?",
      choices: [
        "function foo() {} 의 {} 만 블록 스코프",
        "if, for, while의 {} 와 단독 {} 모두 블록 스코프",
        "for 루프의 {} 만 블록 스코프",
        "자바스크립트에는 블록 스코프가 없다",
      ],
      correctIndex: 1,
      explanation: "ES6부터 let/const는 모든 중괄호 {}(if, for, while, 단순 블록 등)를 블록 스코프 경계로 인식합니다. 단, var는 함수 경계만 인식하므로 블록 스코프에 영향을 받지 않습니다.",
    },
    {
      id: "q4",
      question: "변수 섀도잉(shadowing)에 대한 설명으로 올바른 것은?",
      choices: [
        "바깥 스코프의 변수가 삭제된다",
        "안쪽 스코프에서 같은 이름의 변수를 선언하면 바깥 변수가 그 스코프에서 가려진다",
        "섀도잉은 항상 오류를 발생시킨다",
        "전역 변수만 섀도잉될 수 있다",
      ],
      correctIndex: 1,
      explanation: "섀도잉은 안쪽 스코프에서 바깥 스코프와 같은 이름으로 변수를 선언할 때 발생합니다. 바깥 변수는 사라지지 않고 단지 해당 안쪽 스코프에서 접근이 차단됩니다. 함수 실행이 끝나면 바깥 변수는 그대로입니다.",
    },
    {
      id: "q5",
      question: "전역 스코프에서 let으로 선언한 변수와 var로 선언한 변수의 차이는?",
      choices: [
        "차이 없음, 둘 다 window의 프로퍼티가 됨",
        "let은 전역 렉시컬 환경에만 등록되고, var는 window 객체의 프로퍼티도 됨",
        "var는 전역 렉시컬 환경에만 등록되고, let은 window 객체의 프로퍼티도 됨",
        "전역 스코프에서는 let과 var 모두 사용 불가",
      ],
      correctIndex: 1,
      explanation: "var로 전역에서 선언한 변수는 window(전역 객체)의 프로퍼티로도 추가됩니다(window.x로 접근 가능). 반면 let/const는 전역 렉시컬 환경의 선언 레코드에만 등록되어 window의 프로퍼티가 되지 않습니다.",
    },
    {
      id: "q6",
      question: "다음 코드에서 inner() 함수가 접근할 수 없는 변수는?\n```js\nconst a = 1;\nfunction outer() {\n  const b = 2;\n  function inner() {\n    const c = 3;\n  }\n}\n```",
      choices: ["a", "b", "c는 inner 안에서 접근 가능", "inner 밖에서 c에 접근 불가"],
      correctIndex: 3,
      explanation: "inner() 함수는 스코프 체인을 통해 자신의 스코프(c), 바깥 함수 스코프(b), 전역 스코프(a) 모두에 접근할 수 있습니다. 하지만 inner 밖의 코드는 inner 안에서 선언된 c에 접근할 수 없습니다.",
    },
    {
      id: "q7",
      question: "다음 중 '최소 권한 원칙'을 스코프에 적용한 올바른 코드 스타일은?",
      choices: [
        "모든 변수를 전역으로 선언하여 어디서든 쉽게 접근",
        "변수를 필요한 가장 좁은 스코프에서 선언",
        "모든 변수를 함수 최상단에서 var로 선언",
        "블록 스코프를 피하고 함수 스코프만 사용",
      ],
      correctIndex: 1,
      explanation: "최소 권한 원칙을 스코프에 적용하면, 변수는 필요한 가장 좁은 스코프에서 선언해야 합니다. 이렇게 하면 이름 충돌을 줄이고, 의도치 않은 변경을 방지하며, 코드의 예측 가능성이 높아집니다.",
    },
  ],
};

export default chapter;
