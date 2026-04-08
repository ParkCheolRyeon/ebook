import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "17-xss-csrf",
  subject: "network",
  title: "XSS와 CSRF",
  description: "웹 애플리케이션의 대표적인 보안 공격인 XSS와 CSRF의 원리를 이해하고, React 환경에서의 방어 전략을 학습합니다.",
  order: 17,
  group: "웹 보안",
  prerequisites: ["14-cookie-session-token"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "웹 보안 공격은 일상의 사기 수법과 비슷합니다.\n\n" +
        "**XSS(Cross-Site Scripting)**는 건물에 가짜 안내문을 붙이는 것과 같습니다. " +
        "공격자가 합법적인 웹사이트에 악성 스크립트를 몰래 심어두면, " +
        "방문자가 '이 사이트가 보여주는 거니까 안전하겠지'라고 믿고 실행하게 됩니다. " +
        "마치 건물 로비에 붙은 '비밀번호를 적어주세요'라는 가짜 안내문에 속는 것과 같습니다.\n\n" +
        "**CSRF(Cross-Site Request Forgery)**는 대리 서명 사기와 비슷합니다. " +
        "피해자가 은행에 로그인한 상태(세션 유지)에서, 공격자가 만든 웹페이지를 방문하면 " +
        "그 페이지가 피해자의 이름으로 은행에 송금 요청을 보냅니다. " +
        "은행은 유효한 세션 쿠키가 함께 왔으니 정당한 요청으로 처리합니다.\n\n" +
        "XSS는 '사이트를 신뢰하는 사용자'를 속이고, CSRF는 '사용자를 신뢰하는 서버'를 속입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "### XSS (Cross-Site Scripting)\n" +
        "공격자가 웹 페이지에 악성 JavaScript를 주입하여 사용자의 브라우저에서 실행시키는 공격입니다.\n\n" +
        "**XSS의 세 가지 유형:**\n\n" +
        "1. **저장형(Stored) XSS**: 악성 스크립트가 서버 DB에 저장됨 (게시글, 댓글 등)\n" +
        "   - 게시글에 `<script>document.cookie</script>`를 작성 → 모든 열람자에게 실행\n" +
        "   - 가장 위험: 다수의 사용자가 피해\n\n" +
        "2. **반사형(Reflected) XSS**: URL 파라미터에 스크립트를 포함하여 서버가 그대로 응답에 반영\n" +
        "   - `example.com/search?q=<script>alert(1)</script>`\n" +
        "   - 피싱 이메일로 악성 URL 유포\n\n" +
        "3. **DOM 기반 XSS**: 서버를 거치지 않고 클라이언트 JavaScript에서 DOM을 직접 조작\n" +
        "   - `document.innerHTML = location.hash` 같은 취약한 코드\n\n" +
        "### CSRF (Cross-Site Request Forgery)\n" +
        "사용자가 로그인된 상태에서, 공격자의 사이트가 사용자 모르게 요청을 전송하는 공격입니다.\n\n" +
        "**공격 시나리오:**\n" +
        "1. 사용자가 bank.com에 로그인 (세션 쿠키 저장)\n" +
        "2. 사용자가 evil.com 방문\n" +
        "3. evil.com에 숨겨진 폼이 bank.com/transfer로 POST 요청\n" +
        "4. 브라우저가 자동으로 bank.com 쿠키를 포함하여 전송\n" +
        "5. bank.com은 정상 요청으로 처리",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### XSS 방어 전략\n\n" +
        "**1. 입력 검증(Input Validation):**\n" +
        "- 허용 목록(Allowlist) 방식으로 입력 필터링\n" +
        "- HTML 태그, 이벤트 핸들러 속성 제거\n\n" +
        "**2. 출력 인코딩(Output Encoding):**\n" +
        "- HTML 컨텍스트: `<` → `&lt;`, `>` → `&gt;`\n" +
        "- JavaScript 컨텍스트: 유니코드 이스케이프\n" +
        "- URL 컨텍스트: encodeURIComponent()\n\n" +
        "**3. DOMPurify 라이브러리:**\n" +
        "- HTML 문자열을 안전하게 살균(sanitize)\n" +
        "- 허용할 태그와 속성을 세밀하게 제어\n\n" +
        "**4. React의 내장 XSS 보호:**\n" +
        "- JSX에서 문자열은 자동으로 이스케이프됨\n" +
        "- `{userInput}` → HTML 태그가 문자 그대로 표시\n" +
        "- 단, `dangerouslySetInnerHTML`을 사용하면 보호가 해제됨\n\n" +
        "**5. CSP(Content Security Policy):**\n" +
        "- 인라인 스크립트 실행 차단\n" +
        "- 허용된 출처의 스크립트만 실행 (다음 챕터에서 자세히)\n\n" +
        "### CSRF 방어 전략\n\n" +
        "**1. SameSite 쿠키:**\n" +
        "- `SameSite=Strict`: 크로스 사이트 요청 시 쿠키 전송 차단\n" +
        "- `SameSite=Lax`: GET 요청만 허용 (기본값)\n\n" +
        "**2. CSRF 토큰:**\n" +
        "- 서버가 폼에 랜덤 토큰 삽입\n" +
        "- 요청 시 토큰을 함께 전송, 서버가 검증\n" +
        "- 공격자는 토큰 값을 알 수 없음\n\n" +
        "**3. Double Submit Cookie:**\n" +
        "- CSRF 토큰을 쿠키와 요청 본문/헤더 모두에 포함\n" +
        "- 서버가 두 값이 일치하는지 검증",
    },
    {
      type: "pseudocode",
      title: "기술 구현: XSS/CSRF 방어 로직",
      content:
        "XSS 살균(sanitization)과 CSRF 토큰 검증의 핵심 로직을 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          "// XSS 방어: HTML 이스케이프 함수\n" +
          "function escapeHtml(unsafe: string): string {\n" +
          "  const escapeMap: Record<string, string> = {\n" +
          "    '&': '&amp;',\n" +
          "    '<': '&lt;',\n" +
          "    '>': '&gt;',\n" +
          "    '\"': '&quot;',\n" +
          "    \"'\": '&#039;',\n" +
          "  };\n" +
          "  return unsafe.replace(/[&<>\"']/g, (char) => escapeMap[char] || char);\n" +
          "}\n" +
          "\n" +
          "// XSS 방어: URL 검증 (javascript: 프로토콜 차단)\n" +
          "function isSafeUrl(url: string): boolean {\n" +
          "  try {\n" +
          "    const parsed = new URL(url);\n" +
          "    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol);\n" +
          "  } catch {\n" +
          "    return false;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// CSRF 방어: 토큰 기반 검증 (서버 측 의사코드)\n" +
          "interface CSRFProtection {\n" +
          "  generateToken(sessionId: string): string;\n" +
          "  validateToken(sessionId: string, token: string): boolean;\n" +
          "}\n" +
          "\n" +
          "const csrfProtection: CSRFProtection = {\n" +
          "  generateToken(sessionId: string): string {\n" +
          "    // 세션 ID + 비밀키 + 타임스탬프로 토큰 생성\n" +
          "    const timestamp = Date.now().toString();\n" +
          "    const payload = sessionId + ':' + timestamp;\n" +
          "    const signature = hmacSha256(payload, SECRET_KEY);\n" +
          "    return payload + ':' + signature;\n" +
          "  },\n" +
          "\n" +
          "  validateToken(sessionId: string, token: string): boolean {\n" +
          "    const [storedSessionId, timestamp, signature] = token.split(':');\n" +
          "\n" +
          "    // 1. 세션 ID 일치 확인\n" +
          "    if (storedSessionId !== sessionId) return false;\n" +
          "\n" +
          "    // 2. 토큰 만료 확인 (1시간)\n" +
          "    const age = Date.now() - parseInt(timestamp);\n" +
          "    if (age > 3600000) return false;\n" +
          "\n" +
          "    // 3. 서명 검증\n" +
          "    const expectedSig = hmacSha256(\n" +
          "      storedSessionId + ':' + timestamp,\n" +
          "      SECRET_KEY\n" +
          "    );\n" +
          "    return signature === expectedSig;\n" +
          "  },\n" +
          "};",
        description: "XSS는 출력 인코딩과 URL 검증으로, CSRF는 토큰 생성과 서명 검증으로 방어한다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: React에서의 보안 적용",
      content:
        "React 프로젝트에서 XSS를 방어하고, CSRF 토큰을 API 요청에 포함하는 실습입니다.",
      code: {
        language: "typescript",
        code:
          "// 1. React의 자동 XSS 방어 확인\n" +
          "function SafeComponent({ userInput }: { userInput: string }) {\n" +
          "  // 안전: JSX가 자동으로 이스케이프\n" +
          "  // <script> 태그가 문자 그대로 표시됨\n" +
          "  return '<div>' + escapeHtml(userInput) + '</div>';\n" +
          "}\n" +
          "\n" +
          "// 2. dangerouslySetInnerHTML 안전하게 사용하기\n" +
          "// import DOMPurify from 'dompurify';\n" +
          "\n" +
          "function SafeHtmlRenderer({ html }: { html: string }) {\n" +
          "  // DOMPurify로 살균 후 렌더링\n" +
          "  // const cleanHtml = DOMPurify.sanitize(html, {\n" +
          "  //   ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],\n" +
          "  //   ALLOWED_ATTR: ['href', 'target'],\n" +
          "  // });\n" +
          "  // return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;\n" +
          "  return '';\n" +
          "}\n" +
          "\n" +
          "// 3. 안전한 링크 컴포넌트 — javascript: 프로토콜 차단\n" +
          "function SafeLink({ href, children }: { href: string; children: string }): string {\n" +
          "  const isSafe = href.startsWith('https://') ||\n" +
          "                 href.startsWith('http://') ||\n" +
          "                 href.startsWith('/');\n" +
          "\n" +
          "  if (!isSafe) {\n" +
          "    console.warn('안전하지 않은 URL 차단: ' + href);\n" +
          "    return '<span>' + children + '</span>';\n" +
          "  }\n" +
          "  return '<a href=\"' + escapeHtml(href) + '\">' + children + '</a>';\n" +
          "}\n" +
          "\n" +
          "// 4. CSRF 토큰을 포함한 API 클라이언트\n" +
          "class SecureApiClient {\n" +
          "  private csrfToken: string = '';\n" +
          "\n" +
          "  // 페이지 로드 시 CSRF 토큰 가져오기\n" +
          "  async init(): Promise<void> {\n" +
          "    const response = await fetch('/api/csrf-token', {\n" +
          "      credentials: 'include',\n" +
          "    });\n" +
          "    const data = await response.json();\n" +
          "    this.csrfToken = data.token;\n" +
          "  }\n" +
          "\n" +
          "  // 상태 변경 요청에 CSRF 토큰 포함\n" +
          "  async post(url: string, body: unknown): Promise<Response> {\n" +
          "    return fetch(url, {\n" +
          "      method: 'POST',\n" +
          "      credentials: 'include',\n" +
          "      headers: {\n" +
          "        'Content-Type': 'application/json',\n" +
          "        'X-CSRF-Token': this.csrfToken, // CSRF 토큰 헤더\n" +
          "      },\n" +
          "      body: JSON.stringify(body),\n" +
          "    });\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// 5. HTML 이스케이프 유틸리티\n" +
          "function escapeHtml(str: string): string {\n" +
          "  return str\n" +
          "    .replace(/&/g, '&amp;')\n" +
          "    .replace(/</g, '&lt;')\n" +
          "    .replace(/>/g, '&gt;')\n" +
          "    .replace(/\"/g, '&quot;')\n" +
          "    .replace(/'/g, '&#039;');\n" +
          "}",
        description: "React의 자동 이스케이프를 기본으로 활용하고, HTML 렌더링이 필요하면 DOMPurify로 살균하며, API 요청에는 CSRF 토큰을 포함한다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 공격 | 대상 | 방어 방법 |\n" +
        "|------|------|----------|\n" +
        "| XSS (저장형) | 사용자 브라우저 | 입력 검증 + 출력 인코딩 + CSP |\n" +
        "| XSS (반사형) | 사용자 브라우저 | URL 파라미터 이스케이프 + CSP |\n" +
        "| XSS (DOM) | 사용자 브라우저 | innerHTML 대신 textContent + DOMPurify |\n" +
        "| CSRF | 서버 (사용자 행세) | SameSite 쿠키 + CSRF 토큰 |\n\n" +
        "**React에서의 핵심:**\n" +
        "- JSX는 기본적으로 XSS를 방어 (자동 이스케이프)\n" +
        "- `dangerouslySetInnerHTML` 사용 시 반드시 DOMPurify 적용\n" +
        "- URL에 사용자 입력을 넣을 때 `javascript:` 프로토콜 차단\n" +
        "- `SameSite=Lax` 쿠키가 CSRF의 기본 방어선\n\n" +
        "**다음 챕터 미리보기:** CSP와 보안 헤더를 배우면서, XSS 방어를 더욱 강화하는 방법을 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "XSS는 사이트를 신뢰하는 사용자를, CSRF는 사용자를 신뢰하는 서버를 공격하며, React의 자동 이스케이프와 SameSite 쿠키가 기본 방어선이다.",
  checklist: [
    "저장형, 반사형, DOM 기반 XSS의 차이를 설명할 수 있다",
    "React에서 XSS가 자동 방어되는 원리를 이해한다",
    "dangerouslySetInnerHTML 사용 시 DOMPurify의 필요성을 안다",
    "CSRF 공격의 동작 원리와 SameSite 쿠키의 방어 효과를 설명할 수 있다",
    "CSRF 토큰의 생성과 검증 흐름을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "다음 중 가장 위험한 XSS 유형은?",
      choices: [
        "반사형 XSS",
        "저장형(Stored) XSS",
        "DOM 기반 XSS",
        "Self XSS",
      ],
      correctIndex: 1,
      explanation: "저장형 XSS는 악성 스크립트가 서버 DB에 영구적으로 저장되어, 해당 페이지를 방문하는 모든 사용자에게 자동으로 실행됩니다. 반사형이나 DOM 기반은 특정 URL을 클릭해야 발동됩니다.",
    },
    {
      id: "q2",
      question: "React에서 XSS에 취약해지는 경우는?",
      choices: [
        "JSX에서 {userInput}을 사용할 때",
        "dangerouslySetInnerHTML에 살균하지 않은 HTML을 넣을 때",
        "useState로 문자열을 저장할 때",
        "useEffect에서 API를 호출할 때",
      ],
      correctIndex: 1,
      explanation: "React의 JSX는 문자열을 자동으로 이스케이프하지만, dangerouslySetInnerHTML은 이름 그대로 '위험하게 내부 HTML을 설정'하므로 XSS 보호가 해제됩니다. 반드시 DOMPurify로 살균해야 합니다.",
    },
    {
      id: "q3",
      question: "CSRF 공격이 성공하려면 어떤 조건이 필요한가?",
      choices: [
        "피해자가 공격 대상 사이트에 로그인된 상태여야 한다",
        "피해자의 비밀번호를 알아야 한다",
        "피해자의 브라우저에 악성 플러그인이 설치되어야 한다",
        "서버에 XSS 취약점이 있어야 한다",
      ],
      correctIndex: 0,
      explanation: "CSRF는 피해자의 인증 상태(세션 쿠키)를 악용합니다. 피해자가 대상 사이트에 로그인된 상태에서 공격자의 사이트를 방문하면, 쿠키가 자동으로 포함된 요청이 전송됩니다.",
    },
    {
      id: "q4",
      question: "SameSite=Lax 쿠키의 동작은?",
      choices: [
        "모든 크로스 사이트 요청에서 쿠키를 전송한다",
        "모든 크로스 사이트 요청에서 쿠키를 차단한다",
        "크로스 사이트 GET(탑 레벨 네비게이션)만 허용하고 POST는 차단한다",
        "쿠키를 암호화하여 전송한다",
      ],
      correctIndex: 2,
      explanation: "SameSite=Lax는 크로스 사이트 요청 중 링크 클릭 같은 탑 레벨 GET 네비게이션만 쿠키 전송을 허용합니다. POST, iframe, AJAX 요청에서는 쿠키가 차단되어 CSRF를 효과적으로 방어합니다.",
    },
    {
      id: "q5",
      question: "innerHTML 대신 사용해야 할 안전한 DOM API는?",
      choices: [
        "outerHTML",
        "insertAdjacentHTML",
        "textContent",
        "write",
      ],
      correctIndex: 2,
      explanation: "textContent는 문자열을 HTML로 해석하지 않고 순수 텍스트로 삽입합니다. innerHTML은 HTML을 파싱하여 실행하므로 XSS에 취약하지만, textContent는 스크립트가 실행되지 않습니다.",
    },
  ],
};

export default chapter;
