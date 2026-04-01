import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "23-regexp",
  subject: "js",
  title: "정규 표현식",
  description: "정규 표현식 리터럴/생성자, 패턴과 플래그, 메타문자, 그룹, exec/test/match/replace 메서드와 실전 패턴을 마스터합니다.",
  order: 23,
  group: "빌트인과 표준 객체",
  prerequisites: ["22-map-set"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "정규 표현식은 **문자열에 대한 수색 영장**입니다.\n\n" +
        "경찰이 '키 175cm 이상, 안경 착용, 빨간 모자를 쓴 사람'이라는 구체적인 조건(패턴)으로 군중 속에서 용의자를 찾듯이, 정규 표현식은 수백만 줄의 텍스트에서 특정 패턴을 가진 문자열을 찾아냅니다.\n\n" +
        "- **플래그**는 수색 방법입니다: `g`(전체 수색), `i`(대소문자 무시), `m`(여러 줄 수색)\n" +
        "- **메타문자**는 조건입니다: `\\d`(숫자), `\\w`(문자), `\\s`(공백)\n" +
        "- **수량자**는 반복 조건입니다: `+`(1번 이상), `*`(0번 이상), `?`(없거나 1번)\n" +
        "- **그룹**은 묶음 조건입니다: 팀 단위로 수색\n\n" +
        "강력하지만 오남용하면 코드가 불가사의해집니다. '이 정규식은 이메일 유효성을 검사합니다'라는 주석 없이는 6개월 후 자신도 이해 못 할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "문자열 처리에서 자주 마주치는 복잡한 요구사항들이 있습니다:\n\n" +
        "- 이메일 형식이 유효한지 검사\n" +
        "- 전화번호에서 숫자만 추출\n" +
        "- 특정 태그를 다른 태그로 교체\n" +
        "- URL에서 도메인 부분만 추출\n\n" +
        "`indexOf`, `split`, `includes`만으로는 이런 **패턴 기반 검색과 변환**을 구현하기 어렵습니다.\n\n" +
        "정규 표현식이 없다면 이메일 유효성 검사 함수 하나를 작성하는 데 수십 줄의 조건문이 필요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 생성 방법\n" +
        "- **리터럴**: `/패턴/플래그` — 컴파일 시점에 파싱, 성능 우수\n" +
        "- **생성자**: `new RegExp('패턴', '플래그')` — 동적 패턴 생성 가능\n\n" +
        "### 주요 플래그\n" +
        "| 플래그 | 의미 |\n" +
        "|--------|------|\n" +
        "| `g` | 전역 검색 (모든 매칭 찾기) |\n" +
        "| `i` | 대소문자 무시 |\n" +
        "| `m` | 멀티라인 (`^`, `$`가 각 줄에 적용) |\n" +
        "| `s` | dotAll (`.`이 개행 문자도 매칭) |\n" +
        "| `u` | 유니코드 모드 |\n\n" +
        "### 핵심 메타문자\n" +
        "- `.` — 개행 제외 임의 문자\n" +
        "- `\\d` / `\\D` — 숫자 / 비숫자\n" +
        "- `\\w` / `\\W` — 단어 문자(알파벳, 숫자, _) / 비단어\n" +
        "- `\\s` / `\\S` — 공백 / 비공백\n" +
        "- `^` / `$` — 시작 / 끝\n" +
        "- `[abc]` / `[^abc]` — 문자 클래스 / 부정\n" +
        "- `{n,m}` — n회 이상 m회 이하 반복\n\n" +
        "### 그룹\n" +
        "- `(패턴)` — 캡처 그룹 (결과에 포함)\n" +
        "- `(?:패턴)` — 비캡처 그룹 (성능 개선)\n" +
        "- `(?<이름>패턴)` — 명명된 캡처 그룹\n\n" +
        "### 주요 메서드\n" +
        "- `RegExp.prototype.test(str)` — 매칭 여부 boolean\n" +
        "- `RegExp.prototype.exec(str)` — 매칭 결과 배열 (하나씩)\n" +
        "- `String.prototype.match(regexp)` — 매칭 결과 배열\n" +
        "- `String.prototype.matchAll(regexp)` — 모든 매칭 이터레이터 (`g` 플래그 필요)\n" +
        "- `String.prototype.replace(regexp, replacement)` — 치환\n" +
        "- `String.prototype.replaceAll(regexp, replacement)` — 전체 치환",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 그룹과 명명된 캡처",
      content:
        "캡처 그룹을 활용해 복잡한 문자열에서 구조화된 데이터를 추출합니다.",
      code: {
        language: "javascript",
        code:
          "// === 날짜 파싱: 명명된 캡처 그룹 ===\n" +
          "const datePattern = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/;\n" +
          "const match = '2024-03-15'.match(datePattern);\n\n" +
          "console.log(match.groups.year);  // '2024'\n" +
          "console.log(match.groups.month); // '03'\n" +
          "console.log(match.groups.day);   // '15'\n\n" +
          "// === exec로 반복 매칭 ===\n" +
          "const text = '전화: 010-1234-5678, 팩스: 02-987-6543';\n" +
          "const phonePattern = /\\d{2,3}-\\d{3,4}-\\d{4}/g;\n\n" +
          "let result;\n" +
          "while ((result = phonePattern.exec(text)) !== null) {\n" +
          "  console.log('발견:', result[0], '위치:', result.index);\n" +
          "}\n" +
          "// 발견: 010-1234-5678 위치: 4\n" +
          "// 발견: 02-987-6543 위치: 22\n\n" +
          "// === replace 콜백 함수 ===\n" +
          "const camelToKebab = str =>\n" +
          "  str.replace(/([A-Z])/g, '-$1').toLowerCase();\n\n" +
          "console.log(camelToKebab('backgroundColor')); // 'background-color'\n" +
          "console.log(camelToKebab('fontSize'));         // 'font-size'",
        description:
          "명명된 캡처 그룹(?<name>)은 ES2018에서 도입되었으며, 인덱스가 아닌 이름으로 그룹에 접근할 수 있어 가독성이 높아집니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 실전 정규 표현식 패턴",
      content:
        "이메일, URL, 한국어 이름 등 자주 사용하는 검증/추출 패턴을 구현합니다.",
      code: {
        language: "javascript",
        code:
          "// 1. 이메일 유효성 검사\n" +
          "const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;\n" +
          "console.log(emailPattern.test('user@example.com'));  // true\n" +
          "console.log(emailPattern.test('invalid-email'));      // false\n\n" +
          "// 2. 전화번호 정규화 (숫자만 추출)\n" +
          "function normalizePhone(phone) {\n" +
          "  const digits = phone.replace(/\\D/g, ''); // 비숫자 제거\n" +
          "  return digits.replace(/(\\d{3})(\\d{3,4})(\\d{4})/, '$1-$2-$3');\n" +
          "}\n" +
          "console.log(normalizePhone('010 1234 5678')); // '010-1234-5678'\n" +
          "console.log(normalizePhone('(010)12345678')); // '010-1234-5678'\n\n" +
          "// 3. URL에서 도메인 추출\n" +
          "const urlPattern = /^(?:https?:\\/\\/)?(?:www\\.)?([a-zA-Z0-9-]+\\.[a-zA-Z]{2,})/;\n" +
          "const urls = [\n" +
          "  'https://www.example.com/page',\n" +
          "  'http://blog.naver.com/post/123',\n" +
          "];\n" +
          "urls.forEach(url => {\n" +
          "  const m = url.match(urlPattern);\n" +
          "  console.log(m?.[1]); // 'example.com', 'blog.naver.com'\n" +
          "});\n\n" +
          "// 4. HTML 태그 제거\n" +
          "const html = '<p>안녕하세요 <b>반갑습니다</b></p>';\n" +
          "const text = html.replace(/<[^>]+>/g, '');\n" +
          "console.log(text); // '안녕하세요 반갑습니다'",
        description:
          "실전에서는 이 패턴들보다 더 엄격한 검증이 필요할 수 있습니다. 중요한 유효성 검사는 라이브러리를 사용하는 것이 안전합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 메서드 | 주체 | 반환값 | g 플래그 영향 |\n" +
        "|--------|------|--------|---------------|\n" +
        "| test() | RegExp | boolean | lastIndex 갱신 |\n" +
        "| exec() | RegExp | 배열 또는 null | 반복 실행 가능 |\n" +
        "| match() | String | 배열 또는 null | g: 모든 매칭, 없이: 첫 매칭+그룹 |\n" +
        "| matchAll() | String | 이터레이터 | 항상 g 필요 |\n" +
        "| replace() | String | 새 문자열 | g 없으면 첫 번째만 |\n\n" +
        "**핵심 주의사항:**\n" +
        "- `exec()`을 `g` 플래그와 함께 사용할 때 `lastIndex`가 갱신됩니다. 다른 문자열 검사 전 `lastIndex = 0` 초기화 필요.\n" +
        "- 정규 표현식은 강력하지만 복잡해질수록 유지보수가 어렵습니다. 주석을 반드시 달아두세요.\n\n" +
        "**다음 챕터 미리보기:** String, Number, Math, Date의 핵심 메서드를 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "정규표현식은 문자열 패턴을 기술하는 미니 언어다. 복잡해 보여도 기본 구성요소(문자 클래스, 수량자, 그룹)만 익히면 대부분의 패턴을 읽고 쓸 수 있다.",
  checklist: [
    "정규 표현식 리터럴과 생성자 방식의 차이를 안다",
    "g, i, m 플래그의 역할을 설명할 수 있다",
    "\\d, \\w, \\s, ^, $, [], {n,m} 메타문자를 사용할 수 있다",
    "캡처 그룹과 비캡처 그룹의 차이를 안다",
    "명명된 캡처 그룹으로 데이터를 추출할 수 있다",
    "test, exec, match, replace 메서드를 상황에 맞게 사용할 수 있다",
    "이메일 또는 전화번호 검증 패턴을 직접 작성할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "/^hello$/i.test('Hello World')의 결과는?",
      choices: ["true", "false", "TypeError", "'hello'"],
      correctIndex: 1,
      explanation:
        "^는 문자열 시작, $는 끝을 의미합니다. 'Hello World'는 'hello'로만 이루어지지 않고 ' World'가 뒤에 있으므로 false입니다. 'Hello'만 있었다면 i 플래그 덕분에 true가 됩니다.",
    },
    {
      id: "q2",
      question: "'abc123def456'.match(/\\d+/g)의 결과는?",
      choices: [
        "['123']",
        "['123', '456']",
        "null",
        "['abc', 'def']",
      ],
      correctIndex: 1,
      explanation:
        "g 플래그로 전역 검색하면 모든 매칭을 배열로 반환합니다. \\d+는 숫자 1개 이상을 의미하므로 '123'과 '456' 두 개가 반환됩니다.",
    },
    {
      id: "q3",
      question: "캡처 그룹 (abc)와 비캡처 그룹 (?:abc)의 차이는?",
      choices: [
        "캡처 그룹은 매칭 결과에 포함되고, 비캡처 그룹은 포함되지 않는다",
        "캡처 그룹은 선택적이고, 비캡처 그룹은 필수이다",
        "둘의 차이는 성능뿐이다",
        "비캡처 그룹은 ES6에서 제거되었다",
      ],
      correctIndex: 0,
      explanation:
        "캡처 그룹은 match(), exec() 결과 배열의 인덱스 1부터 그룹 내용이 포함됩니다. 비캡처 그룹(?:)은 그룹화는 하지만 결과 배열에 포함되지 않으며 성능도 약간 향상됩니다.",
    },
    {
      id: "q4",
      question: "replace() 메서드에서 '$1'의 의미는?",
      choices: [
        "첫 번째 매칭 전체",
        "첫 번째 캡처 그룹의 내용",
        "문자열 '$1'",
        "마지막 캡처 그룹의 내용",
      ],
      correctIndex: 1,
      explanation:
        "replace의 교체 문자열에서 $1, $2, ...는 각각 첫 번째, 두 번째 캡처 그룹의 내용으로 대체됩니다. $&는 전체 매칭을, $`는 매칭 이전 문자열을 의미합니다.",
    },
    {
      id: "q5",
      question: "g 플래그 없이 'aaa'.match(/a+/)를 호출하면?",
      choices: [
        "['a', 'a', 'a']",
        "['aaa']",
        "['aaa', 'aaa'] — 두 번 매칭",
        "null",
      ],
      correctIndex: 1,
      explanation:
        "g 플래그 없이 match()를 호출하면 첫 번째 매칭만 찾고, 캡처 그룹 정보를 포함한 배열을 반환합니다. a+는 'aaa' 전체를 하나의 매칭으로 인식합니다.",
    },
    {
      id: "q6",
      question: "명명된 캡처 그룹 (?<year>\\d{4})으로 추출한 결과에 접근하는 방법은?",
      choices: [
        "match[1]",
        "match.groups.year",
        "match.year",
        "match.named.year",
      ],
      correctIndex: 1,
      explanation:
        "명명된 캡처 그룹의 결과는 match().groups 객체를 통해 접근합니다. match.groups.year처럼 그룹 이름으로 접근할 수 있습니다. 숫자 인덱스(match[1])로도 접근 가능합니다.",
    },
  ],
};

export default chapter;
