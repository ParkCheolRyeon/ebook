import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "03-operators",
  subject: "js",
  title: "연산자",
  description: "산술, 비교, 논리, 비트 연산자부터 ES2020의 옵셔널 체이닝(?.)과 null 병합(??) 연산자까지 자바스크립트 연산자 전반을 깊이 이해합니다.",
  order: 3,
  group: "기초",
  prerequisites: ["02-data-types"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "연산자는 요리사의 조리 도구와 같습니다.\n\n" +
        "**산술 연산자**는 기본 조리 도구(칼, 냄비)입니다. 재료(값)를 가지고 새로운 요리(결과)를 만듭니다.\n\n" +
        "**비교 연산자**는 저울입니다. 두 재료를 비교해서 `true` 또는 `false`라는 결론을 냅니다. `==`는 눈대중 저울이고, `===`는 정밀 전자 저울입니다. 요리사는 항상 정밀 저울을 써야 합니다.\n\n" +
        "**논리 연산자**는 레시피의 조건입니다. '소금도 있고(&&) 후추도 있으면 요리 시작', '소금이 없거나(||) 후추가 없으면 마트에 가기', '재료가 없다면(!) 배달 주문'처럼 흐름을 제어합니다.\n\n" +
        "**옵셔널 체이닝(?.)**은 '그 선반이 있으면' 확인하는 동작입니다. 선반 자체가 없으면 오류를 내는 대신 조용히 undefined를 반환합니다.\n\n" +
        "**null 병합(??)**은 '비상용 기본 재료'입니다. 주 재료가 null이나 undefined일 때만 기본값을 씁니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "자바스크립트 연산자에는 직관과 다르게 동작하는 함정들이 있습니다.\n\n" +
        "```js\n" +
        "// 타입 강제 변환을 일으키는 == 연산자\n" +
        "0 == false    // true\n" +
        "'' == false   // true\n" +
        "null == 0     // false — null은 undefined하고만 같음\n" +
        "\n" +
        "// 논리 연산자의 단축 평가가 예상과 다를 때\n" +
        "const name = '' || '기본값';   // '기본값' — 빈 문자열도 건너뜀\n" +
        "const count = 0 || 42;        // 42 — 0도 건너뜀\n" +
        "\n" +
        "// 중첩 접근 시 TypeError\n" +
        "const user = null;\n" +
        "user.address.city  // TypeError: Cannot read properties of null\n" +
        "```\n\n" +
        "이런 함정들을 이해하지 못하면 `==` vs `===` 혼용, `||`를 기본값 제공에 잘못 사용, 깊은 객체 접근 시 런타임 에러 등 실제 프로젝트에서 치명적인 버그가 발생합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 산술 연산자\n\n" +
        "`+`, `-`, `*`, `/`, `%`(나머지), `**`(거듭제곱, ES2016), `++`/`--`(증감).\n\n" +
        "`+` 연산자는 두 피연산자 중 하나라도 문자열이면 **문자열 연결**을 수행합니다. 이것이 `'5' + 3 === '53'`인 이유입니다. 숫자 연산을 보장하려면 `Number()` 또는 단항 `+` 연산자로 변환하세요.\n\n" +
        "### 비교 연산자: == vs ===\n\n" +
        "`===`(엄격 동등)은 타입과 값을 모두 비교합니다. `==`(느슨한 동등)은 타입이 다르면 **추상 동등 알고리즘**에 따라 타입을 변환 후 비교합니다. 이 변환 규칙은 복잡하고 직관적이지 않으므로, **항상 `===`를 사용**하는 것이 원칙입니다. 유일한 예외는 `== null`로 null과 undefined를 동시에 확인할 때입니다.\n\n" +
        "### 논리 연산자와 단축 평가\n\n" +
        "`&&`는 왼쪽이 **falsy**면 왼쪽 값을 반환, truthy면 오른쪽 값을 반환합니다.\n" +
        "`||`는 왼쪽이 **truthy**면 왼쪽 값을 반환, falsy면 오른쪽 값을 반환합니다.\n\n" +
        "falsy 값: `false`, `0`, `''`, `null`, `undefined`, `NaN`.\n\n" +
        "이 때문에 `||`로 기본값을 제공하면 `0`이나 `''`(유효한 값)도 기본값으로 대체되는 문제가 생깁니다.\n\n" +
        "### null 병합 연산자 (??) — ES2020\n\n" +
        "`??`는 왼쪽이 **null 또는 undefined**일 때만 오른쪽을 반환합니다. `0`이나 `''`는 유효한 값으로 취급합니다. 기본값 제공에는 `||` 대신 `??`를 사용하는 것이 더 안전합니다.\n\n" +
        "### 옵셔널 체이닝 (?.) — ES2020\n\n" +
        "`?.`는 왼쪽이 null 또는 undefined이면 즉시 `undefined`를 반환합니다. 깊이 중첩된 객체 접근 시 중간에 null이 있어도 TypeError 없이 안전하게 접근할 수 있습니다. 메서드 호출(`obj.method?.()`)과 배열 접근(`arr?.[0]`)도 지원합니다.\n\n" +
        "### 비트 연산자\n\n" +
        "`&`, `|`, `^`(XOR), `~`(NOT), `<<`(왼쪽 시프트), `>>`(오른쪽 시프트), `>>>`(부호 없는 오른쪽 시프트). 정수를 32비트 이진수로 변환하여 비트 단위로 연산합니다. 권한(플래그) 처리나 성능이 중요한 저수준 연산에 활용됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 논리 연산자의 단축 평가 알고리즘",
      content:
        "자바스크립트 엔진이 논리 연산자를 처리하는 방식을 의사코드로 표현합니다.",
      code: {
        language: "typescript",
        code:
          '// && 연산자의 내부 동작\n' +
          'function logicalAnd(left: any, right: any): any {\n' +
          '  if (isFalsy(left)) return left;  // 왼쪽 falsy → 왼쪽 반환 (단축)\n' +
          '  return right;                     // 왼쪽 truthy → 오른쪽 반환\n' +
          '}\n' +
          '\n' +
          '// || 연산자의 내부 동작\n' +
          'function logicalOr(left: any, right: any): any {\n' +
          '  if (isTruthy(left)) return left;  // 왼쪽 truthy → 왼쪽 반환 (단축)\n' +
          '  return right;                     // 왼쪽 falsy → 오른쪽 반환\n' +
          '}\n' +
          '\n' +
          '// ?? 연산자의 내부 동작\n' +
          'function nullishCoalescing(left: any, right: any): any {\n' +
          '  // null 또는 undefined 일 때만 오른쪽 반환\n' +
          '  if (left === null || left === undefined) return right;\n' +
          '  return left;  // 0, "", false도 유효한 값으로 취급\n' +
          '}\n' +
          '\n' +
          '// 실제 결과 비교\n' +
          'const a = 0 || "기본값";   // "기본값" (0은 falsy)\n' +
          'const b = 0 ?? "기본값";   // 0 (0은 null/undefined 아님)\n' +
          '\n' +
          '// ?. 연산자의 내부 동작\n' +
          'function optionalChain(obj: any, key: string): any {\n' +
          '  if (obj === null || obj === undefined) return undefined;\n' +
          '  return obj[key];\n' +
          '}\n' +
          '// user?.address?.city\n' +
          '// → optionalChain(optionalChain(user, "address"), "city")',
        description: "논리 연산자는 항상 boolean이 아닌 피연산자 중 하나를 반환합니다. 이 특성이 단축 평가의 핵심입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 실전 패턴",
      content:
        "논리 연산자와 옵셔널 체이닝을 활용한 실전 코딩 패턴을 살펴봅니다.",
      code: {
        language: "javascript",
        code:
          '// 1. 기본값 제공 — || vs ??\n' +
          'function greet(name) {\n' +
          '  const displayName1 = name || "익명"; // 빈 문자열도 "익명"\n' +
          '  const displayName2 = name ?? "익명"; // 빈 문자열은 그대로\n' +
          '  return `안녕하세요, ${displayName2}님`;\n' +
          '}\n' +
          'console.log(greet(""));       // ??: "안녕하세요, 님"\n' +
          'console.log(greet(null));     // ??: "안녕하세요, 익명님"\n' +
          '\n' +
          '// 2. 깊은 객체 접근 — ?. 체이닝\n' +
          'const users = [\n' +
          '  { name: "Alice", address: { city: "서울" } },\n' +
          '  { name: "Bob" },  // address 없음\n' +
          '];\n' +
          '\n' +
          'users.forEach(user => {\n' +
          '  // 구버전: user.address && user.address.city\n' +
          '  const city = user.address?.city ?? "주소 미입력";\n' +
          '  console.log(`${user.name}: ${city}`);\n' +
          '});\n' +
          '// Alice: 서울\n' +
          '// Bob: 주소 미입력\n' +
          '\n' +
          '// 3. 단락 평가로 조건부 실행\n' +
          'const isLoggedIn = true;\n' +
          'isLoggedIn && console.log("환영합니다!");  // 실행됨\n' +
          '\n' +
          '// 4. 비트 연산 — 권한 플래그\n' +
          'const READ  = 0b001; // 1\n' +
          'const WRITE = 0b010; // 2\n' +
          'const EXEC  = 0b100; // 4\n' +
          '\n' +
          'let perm = READ | WRITE;  // 0b011 = 3 (읽기+쓰기)\n' +
          'console.log(Boolean(perm & READ));  // true (읽기 권한 있음)\n' +
          'console.log(Boolean(perm & EXEC));  // false (실행 권한 없음)',
        description: "실전에서는 ?? 와 ?. 을 함께 사용하면 null/undefined 관련 방어 코드를 크게 줄일 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 연산자 | 종류 | 핵심 특성 |\n" +
        "|--------|------|----------|\n" +
        "| +, -, *, /, %, ** | 산술 | + 는 문자열 연결 우선 |\n" +
        "| ==, != | 느슨한 비교 | 타입 변환 후 비교 (피할 것) |\n" +
        "| ===, !== | 엄격한 비교 | 타입+값 모두 비교 (권장) |\n" +
        "| &&, \\|\\|, ! | 논리 | 불리언이 아닌 값 반환, 단축 평가 |\n" +
        "| ?? | null 병합 | null/undefined 일 때만 오른쪽 반환 |\n" +
        "| ?. | 옵셔널 체이닝 | null/undefined 이면 undefined 반환 |\n" +
        "| &, \\|, ^, ~, <<, >> | 비트 | 32비트 정수 연산 |\n\n" +
        "**핵심:** `===`를 기본 비교 연산자로, `??`를 기본값 제공에, `?.`를 깊은 객체 접근에 사용하는 것이 현대 자바스크립트의 모범 사례입니다.\n\n" +
        "**다음 챕터 미리보기:** 타입 변환과 단축 평가를 더 깊이 다루면서, 암묵적 타입 변환이 왜 그토록 위험한지 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "연산자는 값을 만들어내는 함수다. == 대신 ===를 쓰고, 단축 평가(&&, ||, ??)는 값을 반환한다는 점을 기억하자.",
  checklist: [
    "== 와 === 의 차이를 명확히 설명할 수 있다",
    "논리 연산자(&&, ||)의 단축 평가 원리를 이해한다",
    "|| 와 ?? 의 차이를 알고 올바르게 선택할 수 있다",
    "옵셔널 체이닝(?.)이 TypeError를 방지하는 원리를 설명할 수 있다",
    "비트 연산자를 이용한 권한 플래그 패턴을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "console.log(0 || '기본값')의 출력 결과는?",
      choices: ["0", "'기본값'", "false", "null"],
      correctIndex: 1,
      explanation: "|| 연산자는 왼쪽이 falsy일 때 오른쪽을 반환합니다. 0은 falsy이므로 '기본값'이 반환됩니다. 0을 유효한 값으로 취급하려면 ?? 연산자를 사용해야 합니다.",
    },
    {
      id: "q2",
      question: "console.log(0 ?? '기본값')의 출력 결과는?",
      choices: ["0", "'기본값'", "false", "null"],
      correctIndex: 0,
      explanation: "?? 연산자는 왼쪽이 null 또는 undefined일 때만 오른쪽을 반환합니다. 0은 null도 undefined도 아니므로 0이 그대로 반환됩니다.",
    },
    {
      id: "q3",
      question: "const obj = null; console.log(obj?.name)의 출력 결과는?",
      choices: ["TypeError 발생", "null", "undefined", "''"],
      correctIndex: 2,
      explanation: "옵셔널 체이닝(?.)은 왼쪽이 null 또는 undefined이면 즉시 undefined를 반환합니다. TypeError 없이 안전하게 접근할 수 있습니다.",
    },
    {
      id: "q4",
      question: "console.log('5' + 3)의 출력 결과는?",
      choices: ["8", "'53'", "NaN", "TypeError"],
      correctIndex: 1,
      explanation: "+ 연산자는 피연산자 중 하나라도 문자열이면 문자열 연결을 수행합니다. '5' + 3에서 3이 '3'으로 변환되어 '53'이 됩니다.",
    },
    {
      id: "q5",
      question: "null == undefined의 결과는?",
      choices: ["true", "false", "TypeError", "null"],
      correctIndex: 0,
      explanation: "느슨한 동등(==)에서 null과 undefined는 서로 같고 다른 어떤 값과도 같지 않습니다. 이것이 == null을 사용하면 null과 undefined를 동시에 걸러낼 수 있는 이유입니다.",
    },
    {
      id: "q6",
      question: "const perm = 0b110; console.log(Boolean(perm & 0b001))의 출력은?",
      choices: ["true", "false", "0", "1"],
      correctIndex: 1,
      explanation: "0b110 & 0b001은 공통 비트가 없으므로 0b000 = 0이 됩니다. Boolean(0)은 false입니다. 비트 AND(&)는 두 수의 공통 비트만 남깁니다.",
    },
    {
      id: "q7",
      question: "console.log(false || null || 0 || 'hello' || 'world')의 결과는?",
      choices: ["false", "null", "0", "'hello'"],
      correctIndex: 3,
      explanation: "|| 연산자는 왼쪽부터 평가하며 처음으로 truthy한 값을 반환합니다. false, null, 0은 모두 falsy이고 'hello'는 truthy이므로 'hello'에서 단축 평가가 멈춥니다.",
    },
  ],
};

export default chapter;
