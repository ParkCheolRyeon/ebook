import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "24-string-number-math-date",
  subject: "js",
  title: "String, Number, Math, Date",
  description: "String/Number/Math/Date의 주요 메서드, 부동소수점 문제, 타임스탬프와 날짜 처리, 템플릿 리터럴을 마스터합니다.",
  order: 24,
  group: "빌트인과 표준 객체",
  prerequisites: ["23-regexp"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "이 네 가지 빌트인 객체는 자바스크립트의 **표준 도구 상자**입니다.\n\n" +
        "- **String**: 텍스트 처리 도구. 가위(slice), 풀(concat), 먹줄(indexOf), 도장(replace) 등 문자열을 다루는 모든 도구가 들어 있습니다.\n\n" +
        "- **Number**: 숫자 처리 도구. 하지만 컴퓨터가 소수점을 이진수로 표현하는 한계로 인해 `0.1 + 0.2 === 0.3`이 **거짓**입니다. 마치 자가 미묘하게 틀어진 것처럼요.\n\n" +
        "- **Math**: 수학 공식 책. 직접 구현하기 번거로운 제곱근, 삼각함수, 랜덤, 최대/최솟값 등이 담겨 있습니다.\n\n" +
        "- **Date**: 달력이자 시계. 1970년 1월 1일(Unix 시간의 시작)부터 현재까지의 밀리초를 기준으로 모든 날짜와 시간을 계산합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "자바스크립트에서 숫자와 문자열, 날짜를 다루다 보면 예상치 못한 결과를 만납니다:\n\n" +
        "```javascript\n" +
        "0.1 + 0.2 === 0.3  // false! (0.30000000000000004)\n" +
        "typeof NaN         // 'number' (NaN이 숫자 타입이라는 반직관)\n" +
        "new Date() - new Date() // 0 ms\n" +
        "```\n\n" +
        "또한 날짜 처리는 특히 복잡합니다:\n" +
        "- 시간대(timezone) 처리\n" +
        "- 두 날짜 사이의 일수 계산\n" +
        "- 특정 형식으로 날짜 포맷팅\n\n" +
        "이런 문제들을 올바르게 다루려면 각 빌트인의 동작 원리를 이해해야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### String 주요 메서드\n" +
        "- `slice(start, end)` — 부분 문자열 추출 (음수 인덱스 지원)\n" +
        "- `indexOf(str)` / `includes(str)` — 위치 찾기 / 포함 여부\n" +
        "- `split(sep)` — 분리해 배열로\n" +
        "- `trim()` / `trimStart()` / `trimEnd()` — 공백 제거\n" +
        "- `padStart(len, ch)` / `padEnd(len, ch)` — 패딩\n" +
        "- `repeat(n)` — 반복\n" +
        "- `startsWith()` / `endsWith()` — 시작/끝 검사\n\n" +
        "### 템플릿 리터럴 (Tagged Templates)\n" +
        "```javascript\n" +
        "const name = 'Alice';\n" +
        "`안녕하세요, ${name}님!` // 표현식 삽입 가능\n" +
        "```\n\n" +
        "### Number와 부동소수점\n" +
        "- `Number.EPSILON` — 부동소수점 오차 허용 범위\n" +
        "- `Number.isFinite()` / `Number.isInteger()` — 유한수/정수 검사\n" +
        "- `toFixed(n)` — 소수점 n자리 (문자열 반환)\n" +
        "- 부동소수점 비교: `Math.abs(a - b) < Number.EPSILON`\n\n" +
        "### Math 유틸\n" +
        "- `Math.floor()` / `Math.ceil()` / `Math.round()` — 내림/올림/반올림\n" +
        "- `Math.random()` — 0 이상 1 미만 난수\n" +
        "- `Math.max(...arr)` / `Math.min(...arr)` — 최대/최솟값\n" +
        "- `Math.abs()` / `Math.sqrt()` / `Math.pow()` — 절댓값/제곱근/거듭제곱\n\n" +
        "### Date 기초\n" +
        "- `Date.now()` — Unix 타임스탬프(ms)\n" +
        "- `new Date()` — 현재 시각\n" +
        "- `new Date(year, month-1, day)` — month는 0-indexed!\n" +
        "- `getFullYear()`, `getMonth()`, `getDate()`, `getTime()`\n" +
        "- 날짜 차이: `(date2 - date1) / (1000 * 60 * 60 * 24)`",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 부동소수점과 날짜 계산",
      content:
        "부동소수점 오차를 처리하는 패턴과 날짜 계산의 핵심 원리를 살펴봅니다.",
      code: {
        language: "javascript",
        code:
          "// === 부동소수점 문제 ===\n" +
          "console.log(0.1 + 0.2);          // 0.30000000000000004\n" +
          "console.log(0.1 + 0.2 === 0.3);  // false\n\n" +
          "// 해결책 1: Number.EPSILON 사용\n" +
          "function isEqual(a, b) {\n" +
          "  return Math.abs(a - b) < Number.EPSILON;\n" +
          "}\n" +
          "console.log(isEqual(0.1 + 0.2, 0.3)); // true\n\n" +
          "// 해결책 2: 정수로 변환 후 계산\n" +
          "const add = (a, b) => (Math.round(a * 100) + Math.round(b * 100)) / 100;\n" +
          "console.log(add(0.1, 0.2)); // 0.3\n\n" +
          "// === Date 핵심 패턴 ===\n" +
          "// 1. 두 날짜 사이의 일수\n" +
          "function daysBetween(d1, d2) {\n" +
          "  const MS_PER_DAY = 1000 * 60 * 60 * 24;\n" +
          "  return Math.round(Math.abs(d2 - d1) / MS_PER_DAY);\n" +
          "}\n" +
          "const start = new Date('2024-01-01');\n" +
          "const end   = new Date('2024-12-31');\n" +
          "console.log(daysBetween(start, end)); // 365\n\n" +
          "// 2. Month는 0-indexed!\n" +
          "const march = new Date(2024, 2, 15); // 3월 15일 (month=2)\n" +
          "console.log(march.getMonth()); // 2 (주의!)\n\n" +
          "// 3. ISO 형식으로 날짜 출력\n" +
          "console.log(new Date().toISOString()); // '2024-03-15T09:30:00.000Z'",
        description:
          "부동소수점 비교 시 항상 Number.EPSILON을 활용하고, Date의 month는 0-indexed임을 기억하세요.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 날짜 포맷터와 문자열 유틸",
      content:
        "실무에서 자주 쓰이는 날짜 포맷팅과 문자열 처리 유틸 함수를 구현합니다.",
      code: {
        language: "javascript",
        code:
          "// 1. 날짜 포맷터\n" +
          "function formatDate(date, format = 'YYYY-MM-DD') {\n" +
          "  const y = date.getFullYear();\n" +
          "  const m = String(date.getMonth() + 1).padStart(2, '0');\n" +
          "  const d = String(date.getDate()).padStart(2, '0');\n" +
          "  return format\n" +
          "    .replace('YYYY', y)\n" +
          "    .replace('MM', m)\n" +
          "    .replace('DD', d);\n" +
          "}\n" +
          "console.log(formatDate(new Date('2024-03-05'))); // '2024-03-05'\n\n" +
          "// 2. 숫자에 천 단위 구분자 추가\n" +
          "function formatNumber(n) {\n" +
          "  return n.toLocaleString('ko-KR');\n" +
          "}\n" +
          "console.log(formatNumber(1234567)); // '1,234,567'\n\n" +
          "// 3. 랜덤 정수 생성\n" +
          "function randomInt(min, max) {\n" +
          "  return Math.floor(Math.random() * (max - min + 1)) + min;\n" +
          "}\n" +
          "console.log(randomInt(1, 6)); // 주사위: 1~6\n\n" +
          "// 4. 문자열 유틸\n" +
          "const truncate = (str, len) =>\n" +
          "  str.length > len ? str.slice(0, len) + '...' : str;\n\n" +
          "const capitalize = str =>\n" +
          "  str.charAt(0).toUpperCase() + str.slice(1);\n\n" +
          "console.log(truncate('안녕하세요 반갑습니다', 5)); // '안녕하세요...'\n" +
          "console.log(capitalize('hello world'));             // 'Hello world'",
        description:
          "padStart는 날짜 포맷팅에서 한 자리 숫자를 두 자리로 맞출 때 유용합니다. toLocaleString은 지역화된 숫자 포맷을 쉽게 적용합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**String 핵심:** `slice`, `split`, `includes`, `trim`, `padStart`, 템플릿 리터럴\n\n" +
        "**Number 핵심:** 부동소수점 오차 → `Number.EPSILON` 또는 정수 변환 후 계산. `toFixed()`는 문자열 반환.\n\n" +
        "**Math 핵심:** `floor/ceil/round`, `random()`, `max/min(...arr)`, `abs/sqrt/pow`\n\n" +
        "**Date 핵심:**\n" +
        "- `Date.now()` → 타임스탬프\n" +
        "- month는 0-indexed (0=1월, 11=12월)\n" +
        "- 날짜 차이 계산 시 밀리초를 일수로 변환\n" +
        "- 복잡한 날짜 처리는 `date-fns`, `dayjs` 라이브러리 사용 권장\n\n" +
        "**다음 챕터 미리보기:** 자바스크립트의 비동기 동작의 핵심, 이벤트 루프와 태스크 큐를 깊이 파헤칩니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "String, Number, Math, Date는 가장 자주 쓰이는 빌트인이다. 특히 부동소수점 오차(0.1+0.2 !== 0.3)와 Date의 월 인덱스(0부터 시작)는 반드시 기억해야 한다.",
  checklist: [
    "String의 slice, split, trim, padStart, includes 메서드를 사용할 수 있다",
    "템플릿 리터럴로 표현식을 문자열에 삽입할 수 있다",
    "부동소수점 오차가 발생하는 이유와 해결 방법을 안다",
    "Number.EPSILON을 이용한 부동소수점 비교 방법을 안다",
    "Math.random()으로 범위 내 랜덤 정수를 생성할 수 있다",
    "Date의 month가 0-indexed임을 기억한다",
    "두 Date 사이의 일수를 계산할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "'hello'.slice(1, 3)의 결과는?",
      choices: ["'he'", "'el'", "'ell'", "'ello'"],
      correctIndex: 1,
      explanation:
        "slice(start, end)는 start 인덱스부터 end 인덱스 직전까지 추출합니다. 인덱스 1('e')부터 3 직전(인덱스 2='l')까지이므로 'el'입니다.",
    },
    {
      id: "q2",
      question: "0.1 + 0.2 === 0.3이 false인 이유는?",
      choices: [
        "자바스크립트 버그",
        "IEEE 754 부동소수점 표현의 정밀도 한계",
        "정수 오버플로우",
        "타입 불일치",
      ],
      correctIndex: 1,
      explanation:
        "자바스크립트는 64비트 IEEE 754 부동소수점을 사용합니다. 0.1과 0.2를 이진수로 정확히 표현할 수 없어 미세한 오차가 발생하며, 결과는 0.30000000000000004가 됩니다.",
    },
    {
      id: "q3",
      question: "new Date(2024, 2, 15)는 몇 월을 나타내는가?",
      choices: ["2월", "3월", "15월 (오류)", "1월"],
      correctIndex: 1,
      explanation:
        "Date 생성자의 month 인수는 0-indexed입니다. 0=1월, 1=2월, 2=3월입니다. 따라서 month=2는 3월을 의미합니다. 이는 Date API의 유명한 혼란 포인트입니다.",
    },
    {
      id: "q4",
      question: "Math.floor(4.9)의 결과는?",
      choices: ["5", "4", "4.9", "NaN"],
      correctIndex: 1,
      explanation:
        "Math.floor()는 내림(floor) 함수로 소수점 이하를 버립니다. 4.9의 내림은 4입니다. 반올림(round)이었다면 5가 됩니다.",
    },
    {
      id: "q5",
      question: "(2.55).toFixed(1)의 결과 타입은?",
      choices: ["number", "string", "NaN", "boolean"],
      correctIndex: 1,
      explanation:
        "toFixed()는 문자열을 반환합니다. 숫자 계산에 사용하려면 parseFloat() 또는 Number()로 변환이 필요합니다. 또한 부동소수점 때문에 (2.55).toFixed(1)은 '2.5'가 될 수 있습니다.",
    },
    {
      id: "q6",
      question: "1~10 사이 랜덤 정수를 생성하는 올바른 코드는?",
      choices: [
        "Math.random() * 10",
        "Math.floor(Math.random() * 10)",
        "Math.floor(Math.random() * 10) + 1",
        "Math.ceil(Math.random() * 10) + 1",
      ],
      correctIndex: 2,
      explanation:
        "Math.random()은 0 이상 1 미만의 값을 반환합니다. * 10으로 0~9.999... 범위를 만들고, floor()로 0~9 정수를 얻은 뒤 +1을 해서 1~10 범위로 만듭니다.",
    },
  ],
};

export default chapter;
