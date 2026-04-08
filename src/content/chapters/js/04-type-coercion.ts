import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "04-type-coercion",
  subject: "js",
  title: "타입 변환과 단축 평가",
  description: "암묵적/명시적 타입 변환, == vs === 비교의 내부 알고리즘, truthy/falsy 개념, 단축 평가를 깊이 이해하고 예측 가능한 코드를 작성하는 방법을 익힙니다.",
  order: 4,
  group: "기초",
  prerequisites: ["03-operators"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "타입 변환은 자동 번역기와 번역가의 차이와 같습니다.\n\n" +
        "**암묵적 타입 변환(Implicit Coercion)**은 자동 번역기입니다. 자바스크립트 엔진이 연산 중에 몰래 타입을 바꿉니다. 빠르고 편하지만 번역 결과가 항상 의도와 일치하지 않습니다. '오늘 정말 배고프다'를 영어로 번역하면 문맥에 따라 전혀 다른 문장이 될 수 있습니다.\n\n" +
        "**명시적 타입 변환(Explicit Conversion)**은 전문 번역가에게 의뢰하는 것입니다. `Number()`, `String()`, `Boolean()`을 직접 호출하면 어떤 변환이 일어나는지 코드에서 명확하게 드러납니다.\n\n" +
        "**truthy/falsy**는 '긍정 증거'와 '부정 증거'와 같습니다. 법정에서 증거가 없으면(null, undefined, 0, '') 무죄(false)로, 증거가 있으면(나머지 모든 것) 유죄(true)로 간주합니다. 빈 배열 `[]`과 빈 객체 `{}`는 '아무것도 없어 보이지만' 존재 자체가 증거이므로 truthy입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "자바스크립트의 암묵적 타입 변환은 수많은 개발자를 혼란에 빠뜨려 왔습니다.\n\n" +
        "```js\n" +
        "// 암묵적 변환의 기이한 결과들\n" +
        "[] + []          // '' (배열 두 개를 더하면?)\n" +
        "[] + {}          // '[object Object]'\n" +
        "{} + []          // 0 (문맥에 따라 달라짐!)\n" +
        "true + true      // 2\n" +
        "true + false     // 1\n" +
        "\n" +
        "// falsy/truthy의 함정\n" +
        "if ([]) { /* 실행됨 */ }   // 빈 배열은 truthy!\n" +
        "if ({}) { /* 실행됨 */ }   // 빈 객체도 truthy!\n" +
        "if ('0') { /* 실행됨 */ }  // '0' 문자열은 truthy!\n" +
        "0 == '0'         // true  (하지만 0 == '' 도 true)\n" +
        "'' == false      // true  (하지만 '0' == false 도 true)\n" +
        "```\n\n" +
        "이런 동작들은 타입 강제 변환 알고리즘을 이해하지 못하면 예측할 수 없습니다. 결과적으로 `==`를 사용하면 어떤 결과가 나올지 직관적으로 알기 어렵고, 버그가 숨어들기 쉽습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 명시적 타입 변환 (Explicit Conversion)\n\n" +
        "**숫자로 변환:** `Number(value)`, `parseInt(string, radix)`, `parseFloat(string)`, 단항 `+value`.\n\n" +
        "- `Number('')` → `0`, `Number('  ')` → `0`, `Number('abc')` → `NaN`\n" +
        "- `parseInt('10px')` → `10` (앞부분 숫자만 파싱)\n" +
        "- 단항 `+`: `+true` → `1`, `+null` → `0`, `+undefined` → `NaN`\n\n" +
        "**문자열로 변환:** `String(value)`, `value.toString()`, 템플릿 리터럴 `` `${value}` ``.\n\n" +
        "- `String(null)` → `'null'`, `String(undefined)` → `'undefined'`\n" +
        "- `null.toString()` → TypeError (null/undefined에 직접 호출 불가)\n\n" +
        "**불리언으로 변환:** `Boolean(value)`, 부정 연산자 `!!value`.\n\n" +
        "### Falsy 값 (8가지)\n\n" +
        "`false`, `0`, `-0`, `0n`(BigInt 0), `''`(빈 문자열), `null`, `undefined`, `NaN`.\n\n" +
        "이 8가지를 제외한 모든 값은 **truthy**입니다. `[]`, `{}`, `'0'`, `'false'`는 모두 truthy입니다.\n\n" +
        "### 추상 동등 알고리즘 (== 의 내부 규칙)\n\n" +
        "`==`는 타입이 다를 때 다음 우선순위로 변환합니다:\n" +
        "1. `null == undefined` → `true` (다른 어떤 값과도 false)\n" +
        "2. 한쪽이 `number`, 다른 쪽이 `string` → string을 number로 변환\n" +
        "3. 한쪽이 `boolean` → boolean을 number로 변환 후 재비교\n" +
        "4. 한쪽이 object, 다른 쪽이 number/string → `ToPrimitive` 호출\n\n" +
        "이 규칙이 `0 == false`(false → 0 변환), `'' == false`(false → 0, '' → 0 변환)를 true로 만듭니다.\n\n" +
        "### 단축 평가 (Short-circuit Evaluation)\n\n" +
        "논리 연산자는 결과가 확정되는 순간 나머지 평가를 중단합니다. 이를 활용한 패턴:\n\n" +
        "- **가드 패턴:** `isReady && execute()` — isReady가 truthy일 때만 실행\n" +
        "- **기본값 패턴:** `const val = input ?? defaultValue` — null/undefined 방어\n" +
        "- **조건부 렌더링:** React에서 `condition && <Component />`\n\n" +
        "### 암묵적 변환의 규칙\n\n" +
        "**+ 연산:** 문자열이 있으면 문자열 연결, 없으면 숫자 덧셈. ([] → '', {} → '[object Object]')\n\n" +
        "**-, *, /, % 연산:** 항상 숫자 변환을 시도합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 추상 동등 비교 알고리즘",
      content:
        "ECMAScript 명세의 추상 동등 비교 알고리즘을 단순화한 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// ECMAScript Abstract Equality Comparison (단순화)\n' +
          'function abstractEqual(x: any, y: any): boolean {\n' +
          '  // 1. 타입이 같으면 엄격 비교와 동일\n' +
          '  if (typeof x === typeof y) return x === y;\n' +
          '\n' +
          '  // 2. null == undefined (항상 true)\n' +
          '  if (x === null && y === undefined) return true;\n' +
          '  if (x === undefined && y === null) return true;\n' +
          '\n' +
          '  // 3. null/undefined는 다른 어떤 값과도 false\n' +
          '  if (x === null || x === undefined) return false;\n' +
          '  if (y === null || y === undefined) return false;\n' +
          '\n' +
          '  // 4. number vs string — string을 number로 변환\n' +
          '  if (typeof x === "number" && typeof y === "string")\n' +
          '    return x === Number(y);\n' +
          '  if (typeof x === "string" && typeof y === "number")\n' +
          '    return Number(x) === y;\n' +
          '\n' +
          '  // 5. boolean 포함 — boolean을 number로 변환 후 재비교\n' +
          '  if (typeof x === "boolean") return abstractEqual(Number(x), y);\n' +
          '  if (typeof y === "boolean") return abstractEqual(x, Number(y));\n' +
          '\n' +
          '  // 6. object vs primitive — ToPrimitive 후 재비교\n' +
          '  // ... (valueOf, toString 호출)\n' +
          '  return false;\n' +
          '}\n' +
          '\n' +
          '// 결과 예시:\n' +
          '// false == 0 → Number(false)=0 → 0 == 0 → true\n' +
          '// "" == false → Number(false)=0, Number("")=0 → 0 == 0 → true\n' +
          '// [] == false → Number(false)=0, ToPrimitive([]):\n' +
          '//   [].valueOf()=[] (배열 자신), [].toString()="" → Number("")=0 → true',
        description: "== 알고리즘은 재귀적으로 동작하며 여러 단계의 변환을 거칩니다. 이 복잡성이 === 사용을 권장하는 이유입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 타입 변환 예측과 방어 코드",
      content:
        "암묵적 타입 변환의 결과를 예측하고, 명시적 변환으로 안전하게 처리하는 방법을 익힙니다.",
      code: {
        language: "javascript",
        code:
          '// 1. 암묵적 변환 예측 연습\n' +
          'console.log(1 + "2");          // "12" (number + string → string)\n' +
          'console.log("3" - 1);          // 2  (- 연산은 항상 숫자 변환)\n' +
          'console.log(true + 1);         // 2  (true → 1)\n' +
          'console.log(null + 1);         // 1  (null → 0)\n' +
          'console.log(undefined + 1);    // NaN (undefined → NaN)\n' +
          '\n' +
          '// 2. falsy 함정 — 빈 배열/객체는 truthy\n' +
          'const emptyArr = [];\n' +
          'const emptyObj = {};\n' +
          'console.log(!!emptyArr);  // true (존재하는 객체)\n' +
          'console.log(!!emptyObj);  // true (존재하는 객체)\n' +
          '\n' +
          '// 배열이 비어있는지 확인하려면:\n' +
          'if (emptyArr.length === 0) console.log("빈 배열");\n' +
          '\n' +
          '// 3. 명시적 변환 — 안전한 숫자 변환\n' +
          'function safeToNumber(value) {\n' +
          '  const num = Number(value);\n' +
          '  if (Number.isNaN(num)) throw new Error(`변환 불가: ${value}`);\n' +
          '  return num;\n' +
          '}\n' +
          '\n' +
          '// 4. 단축 평가 활용 패턴\n' +
          'const config = {\n' +
          '  timeout: 0,     // 유효한 값 (0ms는 의미 있음)\n' +
          '  retries: null,  // 미설정\n' +
          '};\n' +
          '\n' +
          '// 위험: || 는 0도 무시함\n' +
          'const timeout1 = config.timeout || 3000;  // 3000 (의도 아님!)\n' +
          '// 안전: ?? 는 null/undefined만 무시함\n' +
          'const timeout2 = config.timeout ?? 3000;  // 0 (의도대로)\n' +
          'const retries  = config.retries  ?? 3;    // 3 (기본값 적용)',
        description: "암묵적 변환에 의존하지 말고, 타입이 불확실한 값에는 항상 명시적 변환을 사용하세요.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### falsy 값 (8가지)\n" +
        "`false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN` — 나머지는 모두 truthy.\n\n" +
        "### 명시적 변환 함수\n" +
        "| 목적 | 권장 방법 | 주의 사항 |\n" +
        "|------|----------|----------|\n" +
        "| 숫자로 | `Number(v)` | NaN 검사 필요 |\n" +
        "| 정수 파싱 | `parseInt(v, 10)` | radix 명시 필수 |\n" +
        "| 문자열로 | `String(v)` | null/undefined도 안전 |\n" +
        "| 불리언으로 | `Boolean(v)` 또는 `!!v` | truthy/falsy 규칙 적용 |\n\n" +
        "**핵심 규칙:**\n" +
        "1. `==` 대신 `===`를 사용하라 (null 체크는 `== null` 허용)\n" +
        "2. 기본값 제공에는 `||` 대신 `??`를 사용하라\n" +
        "3. 빈 배열/객체는 truthy임을 기억하라\n" +
        "4. 타입이 불확실한 값에는 명시적 변환을 사용하라\n\n" +
        "**다음 챕터 미리보기:** 조건에 따라 코드 실행 흐름을 제어하는 제어문(if/else, switch, for, while)을 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "자바스크립트는 연산 시 타입을 자동 변환한다. 이 규칙을 외우려 하지 말고, 암묵적 변환이 일어나지 않도록 명시적으로 변환하는 습관을 들여라.",
  checklist: [
    "8가지 falsy 값을 모두 나열할 수 있다",
    "빈 배열([])과 빈 객체({})가 truthy임을 이해한다",
    "== 추상 동등 알고리즘의 핵심 단계를 설명할 수 있다",
    "|| 와 ?? 의 차이를 실제 코드로 설명할 수 있다",
    "Number(), String(), Boolean()의 변환 결과를 예측할 수 있다",
    "단축 평가를 활용한 가드 패턴과 기본값 패턴을 작성할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "다음 중 falsy가 아닌 값은?",
      choices: ["0", "''(빈 문자열)", "[]", "null"],
      correctIndex: 2,
      explanation: "빈 배열 []은 truthy입니다. 자바스크립트에서 객체(배열 포함)는 내용이 비어있어도 참조 자체가 존재하므로 항상 truthy입니다. 빈 배열 여부는 arr.length === 0으로 확인해야 합니다.",
    },
    {
      id: "q2",
      question: "console.log(Boolean('0'))의 결과는?",
      choices: ["false", "true", "0", "NaN"],
      correctIndex: 1,
      explanation: "'0'은 비어있지 않은 문자열입니다. falsy인 것은 빈 문자열('')이지 '0'이 아닙니다. 비어있지 않은 문자열은 모두 truthy입니다.",
    },
    {
      id: "q3",
      question: "console.log(Number(null))의 결과는?",
      choices: ["NaN", "null", "0", "undefined"],
      correctIndex: 2,
      explanation: "Number(null)은 0입니다. Number(undefined)는 NaN입니다. 이 두 값의 변환 결과가 다르다는 점에 주의하세요.",
    },
    {
      id: "q4",
      question: "console.log(1 + '2' + 3)의 결과는?",
      choices: ["6", "'123'", "'15'", "NaN"],
      correctIndex: 1,
      explanation: "연산은 왼쪽부터 수행됩니다. 1 + '2' = '12'(숫자 + 문자열 → 문자열 연결), '12' + 3 = '123'(문자열 + 숫자 → 문자열 연결). 결과는 '123'입니다.",
    },
    {
      id: "q5",
      question: "다음 중 == 비교에서 true를 반환하는 쌍은?",
      choices: ["null == 0", "undefined == 0", "null == undefined", "null == false"],
      correctIndex: 2,
      explanation: "추상 동등 알고리즘에서 null과 undefined는 서로만 같습니다. null == 0, null == false, undefined == 0 등은 모두 false입니다.",
    },
    {
      id: "q6",
      question: "단축 평가에서 console.log(null && '실행됨')의 결과는?",
      choices: ["'실행됨'", "null", "false", "undefined"],
      correctIndex: 1,
      explanation: "&& 연산자는 왼쪽이 falsy면 왼쪽 값을 그대로 반환합니다. null은 falsy이므로 '실행됨'을 평가하지 않고 null을 반환합니다.",
    },
    {
      id: "q7",
      question: "!!undefined의 결과는?",
      choices: ["true", "false", "null", "undefined"],
      correctIndex: 1,
      explanation: "!undefined는 true(undefined는 falsy)이고, !true는 false입니다. !! 패턴은 어떤 값을 boolean으로 명시적으로 변환하는 관용구입니다.",
    },
    {
      id: "q8",
      question: "parseInt('08', 10)의 결과는?",
      choices: ["0", "8", "NaN", "10진수 오류"],
      correctIndex: 1,
      explanation: "parseInt의 두 번째 인수(radix)로 10을 명시하면 항상 10진수로 파싱합니다. '08'에서 8을 올바르게 파싱해 8을 반환합니다. radix를 생략하면 구형 엔진에서 '08'을 8진수로 해석할 수 있으므로 항상 radix를 명시해야 합니다.",
    },
  ],
};

export default chapter;
