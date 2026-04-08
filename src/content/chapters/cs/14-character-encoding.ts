import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "14-character-encoding",
  subject: "cs",
  title: "문자 인코딩",
  description:
    "ASCII부터 Unicode까지 문자 인코딩의 역사를 이해하고, JavaScript의 문자열 처리와 한글 인코딩 문제를 학습합니다.",
  order: 14,
  group: "컴퓨터 구조",
  prerequisites: [],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "문자 인코딩은 국제 전보 시스템과 같습니다.\n\n" +
        "**ASCII**는 영어권 전보 코드입니다. A=65, B=66처럼 영문자와 숫자에 번호를 매겨 전송합니다. " +
        "7비트로 128개 문자만 표현할 수 있어서, 영어 이외의 문자는 보낼 수 없습니다.\n\n" +
        "**EUC-KR**은 한국 전용 전보 코드입니다. ASCII에 한글을 추가한 것으로, '가'=0xB0A1처럼 2바이트로 한글을 표현합니다. " +
        "하지만 일본어는 보낼 수 없고, 일본의 Shift-JIS로는 한글을 보낼 수 없습니다.\n\n" +
        "**Unicode**는 전 세계 통합 전보 코드입니다. 모든 언어의 문자에 고유 번호(코드 포인트)를 부여합니다. " +
        "'가'=U+AC00, 'A'=U+0041, '😀'=U+1F600.\n\n" +
        "**UTF-8**과 **UTF-16**은 Unicode 번호를 실제 바이트로 변환하는 방식(인코딩)입니다. " +
        "같은 편지(Unicode)를 다른 크기의 봉투(바이트)에 담는 방법이 다른 것입니다. " +
        "UTF-8은 영문 1바이트, 한글 3바이트로 가변적이고, UTF-16은 대부분 2바이트입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "문자 인코딩을 모르면 어떤 문제가 발생할까요?\n\n" +
        "1. **한글 깨짐** — 서버에서 EUC-KR로 인코딩된 데이터를 UTF-8로 디코딩하면 '가나다'가 '笡궓괜'처럼 깨집니다. " +
        "레거시 시스템과 통신할 때 흔히 발생합니다.\n\n" +
        "2. **이모지 처리 오류** — '😀'.length가 2인 이유를 모르면, 문자열 자르기에서 이모지가 깨집니다. " +
        "JavaScript 문자열은 UTF-16인데, 이모지는 서로게이트 페어(2개의 16비트 코드 유닛)로 표현됩니다.\n\n" +
        "3. **URL 인코딩 문제** — 한글이 포함된 URL을 올바르게 인코딩하지 않으면 서버가 요청을 해석하지 못합니다.\n\n" +
        "4. **Base64 인코딩 오류** — btoa()에 한글을 직접 넘기면 에러가 발생합니다. UTF-8로 먼저 인코딩해야 합니다.\n\n" +
        "5. **파일 인코딩 불일치** — HTML 파일의 실제 인코딩과 meta charset 선언이 다르면 한글이 깨집니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 문자 인코딩의 역사\n\n" +
        "| 인코딩 | 년도 | 범위 | 특징 |\n" +
        "|--------|------|------|------|\n" +
        "| ASCII | 1963 | 128자 (영문, 숫자, 특수문자) | 7비트, 영어 전용 |\n" +
        "| EUC-KR | 1980s | 한글 + ASCII | 2바이트 한글, 한국 레거시 |\n" +
        "| Unicode | 1991 | 전 세계 14만+ 문자 | 문자에 고유 번호(코드 포인트) 부여 |\n" +
        "| UTF-8 | 1993 | Unicode 전체 | 가변 길이 (1~4바이트), 웹 표준 |\n" +
        "| UTF-16 | 1996 | Unicode 전체 | 2 또는 4바이트, JS 문자열 내부 |\n\n" +
        "### UTF-8 인코딩 규칙\n\n" +
        "- 영문/숫자: 1바이트 (ASCII와 동일)\n" +
        "- 한글: 3바이트 (예: '가' → 0xEA 0xB0 0x80)\n" +
        "- 이모지: 4바이트 (예: '😀' → 0xF0 0x9F 0x98 0x80)\n\n" +
        "### JavaScript와 UTF-16\n\n" +
        "JavaScript 문자열은 내부적으로 UTF-16을 사용합니다:\n\n" +
        "- 기본 다국어 평면(BMP, U+0000~U+FFFF): 하나의 16비트 코드 유닛\n" +
        "- BMP 밖의 문자(이모지 등): **서로게이트 페어** — 2개의 16비트 코드 유닛\n" +
        "- 따라서 '😀'.length === 2 (2개의 코드 유닛)\n" +
        "- [...'😀'].length === 1 (이터레이터는 코드 포인트 단위)\n\n" +
        "### 실무 해결책\n\n" +
        "- HTML: `<meta charset=\"UTF-8\">` 반드시 선언\n" +
        "- URL: `encodeURIComponent()`로 한글 인코딩\n" +
        "- Base64: `TextEncoder`로 UTF-8 변환 후 인코딩\n" +
        "- 이모지 안전한 문자열 처리: `Array.from()` 또는 스프레드 연산자 사용",
    },
    {
      type: "pseudocode",
      title: "기술 구현: JavaScript 문자 인코딩 처리",
      content:
        "JavaScript에서 문자 인코딩을 올바르게 처리하는 기법을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// === UTF-16과 서로게이트 페어 이해 ===\n' +
          '\n' +
          'const emoji = "😀";\n' +
          'console.log(emoji.length);          // 2 (UTF-16 코드 유닛 수)\n' +
          'console.log([...emoji].length);     // 1 (코드 포인트 수)\n' +
          '\n' +
          '// 코드 포인트 확인\n' +
          'console.log(emoji.codePointAt(0));  // 128512 (U+1F600)\n' +
          'console.log("가".codePointAt(0));   // 44032 (U+AC00)\n' +
          'console.log("A".codePointAt(0));    // 65 (U+0041)\n' +
          '\n' +
          '// 서로게이트 페어 확인\n' +
          'console.log(emoji.charCodeAt(0));   // 55357 (상위 서로게이트)\n' +
          'console.log(emoji.charCodeAt(1));   // 56832 (하위 서로게이트)\n' +
          '\n' +
          '// === 이모지 안전한 문자열 처리 ===\n' +
          '\n' +
          '// ❌ 이모지가 깨짐\n' +
          'function sliceBad(str: string, n: number): string {\n' +
          '  return str.slice(0, n); // UTF-16 코드 유닛 기준\n' +
          '}\n' +
          'console.log(sliceBad("😀안녕", 1)); // "\\uD83D" (깨진 문자)\n' +
          '\n' +
          '// ✅ 이모지 안전\n' +
          'function sliceGood(str: string, n: number): string {\n' +
          '  return [...str].slice(0, n).join(""); // 코드 포인트 기준\n' +
          '}\n' +
          'console.log(sliceGood("😀안녕", 1)); // "😀"\n' +
          '\n' +
          '// === TextEncoder / TextDecoder ===\n' +
          '\n' +
          '// 문자열 → UTF-8 바이트 배열\n' +
          'const encoder = new TextEncoder();\n' +
          'const bytes = encoder.encode("가");  // Uint8Array [0xEA, 0xB0, 0x80]\n' +
          'console.log(bytes.length);            // 3 (한글은 UTF-8에서 3바이트)\n' +
          '\n' +
          '// UTF-8 바이트 배열 → 문자열\n' +
          'const decoder = new TextDecoder("utf-8");\n' +
          'const text = decoder.decode(bytes);   // "가"\n' +
          '\n' +
          '// EUC-KR 디코딩 (레거시 시스템 대응)\n' +
          'const eucKrDecoder = new TextDecoder("euc-kr");\n' +
          '// const legacyText = eucKrDecoder.decode(eucKrBytes);',
        description:
          "JavaScript의 문자열은 UTF-16이므로 이모지는 length가 2입니다. 코드 포인트 단위 처리에는 스프레드 연산자나 Array.from을 사용합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: URL 인코딩과 Base64",
      content:
        "한글이 포함된 URL 처리와 Base64 인코딩/디코딩을 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// === URL 인코딩 ===\n' +
          '\n' +
          '// encodeURIComponent: 개별 값 인코딩\n' +
          'const query = "검색어";\n' +
          'const encoded = encodeURIComponent(query);\n' +
          'console.log(encoded); // "%EA%B2%80%EC%83%89%EC%96%B4"\n' +
          '\n' +
          'const url = `https://api.example.com/search?q=${encoded}`;\n' +
          '// "https://api.example.com/search?q=%EA%B2%80%EC%83%89%EC%96%B4"\n' +
          '\n' +
          '// decodeURIComponent: 디코딩\n' +
          'console.log(decodeURIComponent(encoded)); // "검색어"\n' +
          '\n' +
          '// encodeURI vs encodeURIComponent 차이\n' +
          'const fullUrl = "https://example.com/경로?이름=값";\n' +
          'console.log(encodeURI(fullUrl));\n' +
          '// "https://example.com/%EA%B2%BD%EB%A1%9C?%EC%9D%B4%EB%A6%84=%EA%B0%92"\n' +
          '// encodeURI는 URL 구분자(:, /, ?, =)를 인코딩하지 않음\n' +
          '\n' +
          '// === Base64 인코딩 ===\n' +
          '\n' +
          '// ❌ btoa는 Latin-1만 지원 → 한글 에러\n' +
          '// btoa("안녕"); // Error!\n' +
          '\n' +
          '// ✅ UTF-8로 먼저 인코딩\n' +
          'function toBase64(str: string): string {\n' +
          '  const bytes = new TextEncoder().encode(str);\n' +
          '  const binary = Array.from(bytes)\n' +
          '    .map((b) => String.fromCharCode(b))\n' +
          '    .join("");\n' +
          '  return btoa(binary);\n' +
          '}\n' +
          '\n' +
          'function fromBase64(base64: string): string {\n' +
          '  const binary = atob(base64);\n' +
          '  const bytes = Uint8Array.from(\n' +
          '    binary, (c) => c.charCodeAt(0)\n' +
          '  );\n' +
          '  return new TextDecoder().decode(bytes);\n' +
          '}\n' +
          '\n' +
          'const b64 = toBase64("안녕하세요");\n' +
          'console.log(b64);                    // "7JWI64WV7ZWY7IS47JqU"\n' +
          'console.log(fromBase64(b64));         // "안녕하세요"\n' +
          '\n' +
          '// === 한글 바이트 크기 확인 유틸리티 ===\n' +
          'function getByteLength(str: string): number {\n' +
          '  return new TextEncoder().encode(str).length;\n' +
          '}\n' +
          '\n' +
          'console.log(getByteLength("A"));     // 1 (ASCII)\n' +
          'console.log(getByteLength("가"));    // 3 (한글 UTF-8)\n' +
          'console.log(getByteLength("😀"));   // 4 (이모지 UTF-8)\n' +
          '\n' +
          '// === 정규식에서의 유니코드 ===\n' +
          'const hasEmoji = /\\p{Emoji}/u.test("Hello 😀"); // true\n' +
          'const hasHangul = /[\\uAC00-\\uD7A3]/u.test("안녕"); // true',
        description:
          "URL 인코딩에는 encodeURIComponent, Base64 인코딩에는 TextEncoder를 함께 사용합니다. 정규식의 u 플래그로 유니코드 문자를 올바르게 매칭합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### 인코딩 역사\n" +
        "- ASCII(128자) → EUC-KR(한글 추가) → Unicode(전 세계 통합)\n" +
        "- UTF-8: 웹 표준, 가변 길이 (영문 1바이트, 한글 3바이트)\n" +
        "- UTF-16: JS 문자열 내부, 대부분 2바이트 (이모지 4바이트)\n\n" +
        "### JavaScript 핵심 포인트\n" +
        "- JS 문자열은 UTF-16 → '😀'.length === 2\n" +
        "- 이모지 안전 처리: [...str] 또는 Array.from(str)\n" +
        "- TextEncoder/TextDecoder로 UTF-8 ↔ 문자열 변환\n" +
        "- btoa/atob는 Latin-1만 지원 → 한글은 TextEncoder 필요\n\n" +
        "### 실무 체크리스트\n" +
        "- HTML: <meta charset=\"UTF-8\"> 선언\n" +
        "- URL: encodeURIComponent()로 쿼리 인코딩\n" +
        "- API: Content-Type에 charset=utf-8 명시\n" +
        "- 레거시: TextDecoder('euc-kr')로 한글 깨짐 해결\n\n" +
        "**핵심:** 문자 인코딩은 '문자 → 숫자 → 바이트'의 변환 규칙입니다. UTF-8을 기본으로 사용하되, JS 내부가 UTF-16임을 기억하세요.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "문자 인코딩은 문자를 바이트로 변환하는 규칙이다. 웹은 UTF-8이 표준이고, JS 내부는 UTF-16이므로 이모지는 length가 2이다.",
  checklist: [
    "ASCII, Unicode, UTF-8, UTF-16의 관계를 설명할 수 있다",
    "JavaScript 문자열이 UTF-16인 이유와 이모지가 length 2인 이유를 설명할 수 있다",
    "TextEncoder/TextDecoder를 사용하여 인코딩을 변환할 수 있다",
    "encodeURIComponent와 encodeURI의 차이를 구분할 수 있다",
    "한글이 포함된 문자열의 Base64 인코딩/디코딩을 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "JavaScript에서 '😀'.length의 결과는?",
      choices: ["1", "2", "4", "undefined"],
      correctIndex: 1,
      explanation:
        "JavaScript 문자열은 UTF-16으로 인코딩됩니다. 이모지 '😀'(U+1F600)는 BMP(기본 다국어 평면) 밖의 문자이므로 서로게이트 페어(2개의 16비트 코드 유닛)로 표현됩니다. .length는 코드 유닛 수를 반환하므로 2입니다.",
    },
    {
      id: "q2",
      question: "UTF-8에서 한글 '가'는 몇 바이트로 인코딩되는가?",
      choices: ["1바이트", "2바이트", "3바이트", "4바이트"],
      correctIndex: 2,
      explanation:
        "UTF-8은 가변 길이 인코딩입니다. ASCII(영문)는 1바이트, 한글은 3바이트, 이모지는 4바이트입니다. '가'의 코드 포인트는 U+AC00으로, UTF-8에서 0xEA 0xB0 0x80의 3바이트로 인코딩됩니다.",
    },
    {
      id: "q3",
      question: "btoa('안녕')을 실행하면 어떤 일이 발생하는가?",
      choices: [
        "정상적으로 Base64 인코딩된 문자열이 반환된다",
        "빈 문자열이 반환된다",
        "DOMException 에러가 발생한다",
        "UTF-8로 자동 변환 후 인코딩된다",
      ],
      correctIndex: 2,
      explanation:
        "btoa()는 Latin-1(ISO-8859-1) 범위의 문자만 처리할 수 있습니다. 한글은 Latin-1 범위를 벗어나므로 'The string to be encoded contains characters outside of the Latin-1 range' 에러가 발생합니다. TextEncoder로 UTF-8 바이트로 먼저 변환해야 합니다.",
    },
    {
      id: "q4",
      question: "encodeURIComponent와 encodeURI의 차이는?",
      choices: [
        "encodeURIComponent는 UTF-16으로, encodeURI는 UTF-8로 인코딩한다",
        "encodeURIComponent는 URL 구분자까지 인코딩하고, encodeURI는 URL 구분자를 유지한다",
        "encodeURIComponent는 서버에서, encodeURI는 클라이언트에서 사용한다",
        "두 함수는 완전히 동일하다",
      ],
      correctIndex: 1,
      explanation:
        "encodeURIComponent는 쿼리 파라미터 값 등 URL의 일부분을 인코딩할 때 사용하며, :, /, ?, = 등 URL 구분자도 인코딩합니다. encodeURI는 전체 URL을 인코딩할 때 사용하며, URL 구분자는 인코딩하지 않습니다.",
    },
    {
      id: "q5",
      question: "이모지를 포함한 문자열을 코드 포인트 단위로 올바르게 분리하는 방법은?",
      choices: [
        "str.split('')",
        "str.charAt(i)로 각 문자 접근",
        "[...str] 또는 Array.from(str)",
        "str.substring(i, i+1)로 각 문자 접근",
      ],
      correctIndex: 2,
      explanation:
        "스프레드 연산자([...str])와 Array.from(str)은 문자열의 이터레이터를 사용하며, 이터레이터는 코드 포인트 단위로 문자를 분리합니다. split(''), charAt(), substring()은 모두 UTF-16 코드 유닛 기준이므로 서로게이트 페어가 분리됩니다.",
    },
  ],
};

export default chapter;
