import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "01-var-let-const",
  subject: "js",
  title: "변수 선언: var, let, const",
  description: "자바스크립트의 세 가지 변수 선언 방식과 그 차이를 깊이 이해합니다.",
  order: 1,
  group: "기초",
  prerequisites: [],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "변수 선언은 이사할 때 짐을 정리하는 것과 비슷합니다.\n\n" +
        "**var**는 오래된 창고입니다. 문이 항상 열려 있어서 어디서든 접근할 수 있지만, 같은 이름표를 가진 상자가 여러 개 있어도 경고 없이 덮어씁니다.\n\n" +
        "**let**은 잠금장치가 달린 사물함입니다. 정해진 구역(블록) 안에서만 접근할 수 있고, 같은 이름표를 두 번 붙이면 오류가 납니다. 다만 안에 든 물건은 교체할 수 있습니다.\n\n" +
        "**const**는 밀봉된 금고입니다. 한번 넣으면 다른 것으로 교체할 수 없습니다. 하지만 금고 안에 서랍이 있다면(객체/배열), 서랍 내부의 물건은 바꿀 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "자바스크립트에는 왜 변수를 선언하는 방법이 세 가지나 있을까요?\n\n" +
        "초기 자바스크립트에는 `var`만 있었습니다. 하지만 `var`에는 심각한 문제들이 있었습니다:\n\n" +
        "1. **함수 스코프만 지원** — 블록(`if`, `for`) 안에서 선언해도 밖에서 접근 가능\n" +
        "2. **중복 선언 허용** — 같은 변수를 두 번 선언해도 에러 없음\n" +
        "3. **호이스팅 시 undefined** — 선언 전에 접근하면 에러 대신 `undefined` 반환\n\n" +
        "이런 문제들이 버그의 온상이 되자, ES6(2015)에서 `let`과 `const`가 도입되었습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "ES6는 두 가지 새로운 선언 키워드로 `var`의 문제를 해결했습니다.\n\n" +
        "### 블록 스코프\n" +
        "`let`과 `const`는 가장 가까운 블록(`{}`)을 스코프 경계로 사용합니다. `for` 루프 안에서 선언한 변수가 밖으로 새어나가지 않습니다.\n\n" +
        "### 중복 선언 금지\n" +
        "같은 스코프에서 같은 이름으로 두 번 선언하면 `SyntaxError`가 발생합니다.\n\n" +
        "### TDZ (Temporal Dead Zone)\n" +
        "`let`과 `const`도 호이스팅됩니다. 하지만 초기화 전에 접근하면 `undefined` 대신 `ReferenceError`를 던집니다. 선언문 이전의 이 영역을 **TDZ**라고 합니다.\n\n" +
        "### const의 불변 바인딩\n" +
        "`const`는 변수의 **바인딩**을 불변으로 만듭니다. 원시값은 변경할 수 없지만, 객체나 배열의 내부 속성은 변경할 수 있습니다. 이것이 '불변'과 '상수'의 차이입니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 호이스팅과 TDZ",
      content:
        "자바스크립트 엔진이 변수 선언을 내부적으로 어떻게 처리하는지 의사코드로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// JS 엔진의 내부 동작을 의사코드로 표현\n' +
          '\n' +
          '// === var의 호이스팅 ===\n' +
          '// 소스 코드:\n' +
          '// console.log(x); // undefined\n' +
          '// var x = 10;\n' +
          '\n' +
          '// 엔진이 실제로 실행하는 순서:\n' +
          'declare x: undefined      // 1단계: 선언 + 초기화(undefined)\n' +
          'console.log(x)            // undefined (접근 가능)\n' +
          'x = 10                    // 2단계: 할당\n' +
          '\n' +
          '// === let의 호이스팅 + TDZ ===\n' +
          '// 소스 코드:\n' +
          '// console.log(y); // ReferenceError\n' +
          '// let y = 20;\n' +
          '\n' +
          '// 엔진이 실제로 실행하는 순서:\n' +
          'declare y: <TDZ>          // 1단계: 선언만 (초기화 안됨)\n' +
          'console.log(y)            // ReferenceError! (TDZ 영역)\n' +
          'y = undefined             // 2단계: 초기화\n' +
          'y = 20                    // 3단계: 할당',
        description: "var는 선언과 초기화가 동시에 일어나지만, let/const는 선언과 초기화가 분리됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 클로저와 var의 함정",
      content:
        "가장 유명한 `var` 버그 중 하나를 살펴보고, `let`이 어떻게 이를 해결하는지 확인합니다.",
      code: {
        language: "javascript",
        code:
          '// ❌ var를 사용한 경우 — 의도와 다른 결과\n' +
          'for (var i = 0; i < 3; i++) {\n' +
          '  setTimeout(() => console.log(i), 100);\n' +
          '}\n' +
          '// 출력: 3, 3, 3 (모두 같은 i를 참조)\n' +
          '\n' +
          '// ✅ let을 사용한 경우 — 의도대로 동작\n' +
          'for (let j = 0; j < 3; j++) {\n' +
          '  setTimeout(() => console.log(j), 100);\n' +
          '}\n' +
          '// 출력: 0, 1, 2 (각 반복마다 새로운 j)\n' +
          '\n' +
          '// ✅ const와 객체 — 바인딩 vs 값\n' +
          'const user = { name: "Alice" };\n' +
          'user.name = "Bob";     // OK: 객체 내부 변경 가능\n' +
          '// user = {};          // TypeError: 바인딩 변경 불가',
        description: "for 루프에서 var는 하나의 변수를 공유하지만, let은 반복마다 새 바인딩을 생성합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 특성 | var | let | const |\n" +
        "|------|-----|-----|-------|\n" +
        "| 스코프 | 함수 | 블록 | 블록 |\n" +
        "| 중복 선언 | 허용 | 금지 | 금지 |\n" +
        "| 재할당 | 가능 | 가능 | 불가 |\n" +
        "| 호이스팅 | 선언+초기화 | 선언만(TDZ) | 선언만(TDZ) |\n" +
        "| 전역 객체 프로퍼티 | O | X | X |\n\n" +
        "**핵심:** `const`를 기본으로 사용하고, 재할당이 필요할 때만 `let`을 사용하세요. `var`는 레거시 코드 이해를 위해서만 알아두면 됩니다.\n\n" +
        "**다음 챕터 미리보기:** 데이터 타입을 배우면서, `const`로 선언한 변수에 어떤 종류의 값을 담을 수 있는지 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "var, let, const의 스코프 차이를 설명할 수 있다",
    "호이스팅과 TDZ의 동작 원리를 이해한다",
    "const의 불변성이 바인딩에 적용됨을 설명할 수 있다",
    "for 루프에서 var와 let의 클로저 차이를 설명할 수 있다",
    "실무에서 var 대신 let/const를 써야 하는 이유를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "다음 중 TDZ(Temporal Dead Zone)의 영향을 받는 키워드를 모두 고르면?",
      choices: ["var만", "let만", "let과 const", "var, let, const 모두"],
      correctIndex: 2,
      explanation: "let과 const는 호이스팅되지만 초기화 전까지 TDZ에 놓여 접근 시 ReferenceError가 발생합니다. var는 선언과 동시에 undefined로 초기화되어 TDZ가 없습니다.",
    },
    {
      id: "q2",
      question: "const로 선언한 객체의 프로퍼티를 변경하면?",
      choices: ["TypeError 발생", "정상 동작", "SyntaxError 발생", "undefined 반환"],
      correctIndex: 1,
      explanation: "const는 변수 바인딩을 불변으로 만들지, 값 자체를 불변으로 만들지 않습니다. 객체의 프로퍼티 수정은 바인딩 변경이 아니므로 허용됩니다.",
    },
    {
      id: "q3",
      question: "for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }의 출력은?",
      choices: ["0, 1, 2", "3, 3, 3", "undefined, undefined, undefined", "0, 0, 0"],
      correctIndex: 1,
      explanation: "var는 함수 스코프이므로 루프 전체에서 하나의 i를 공유합니다. setTimeout 콜백이 실행될 때 i는 이미 3이 되어 있습니다.",
    },
    {
      id: "q4",
      question: "let x = 1; let x = 2;를 같은 스코프에서 실행하면?",
      choices: ["x가 2로 업데이트됨", "SyntaxError 발생", "ReferenceError 발생", "TypeError 발생"],
      correctIndex: 1,
      explanation: "let과 const는 같은 스코프에서 중복 선언을 금지합니다. SyntaxError가 발생합니다.",
    },
    {
      id: "q5",
      question: "var로 전역에서 선언한 변수는 어디에 등록되는가?",
      choices: ["블록 스코프", "모듈 스코프", "window 객체(전역 객체)", "별도의 렉시컬 환경"],
      correctIndex: 2,
      explanation: "var로 전역에서 선언한 변수는 window(전역 객체)의 프로퍼티가 됩니다. let/const는 전역 렉시컬 환경에만 등록되어 window에 추가되지 않습니다.",
    },
  ],
};

export default chapter;
