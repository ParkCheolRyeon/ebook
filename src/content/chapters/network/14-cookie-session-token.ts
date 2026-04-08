import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "14-cookie-session-token",
  subject: "network",
  title: "쿠키, 세션, 토큰",
  description: "웹 인증의 핵심 메커니즘인 쿠키, 세션, 토큰의 동작 원리와 차이점을 이해하고, 안전한 인증 시스템을 구축하는 방법을 학습합니다.",
  order: 14,
  group: "브라우저 네트워킹",
  prerequisites: ["06-http-headers"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "인증 시스템은 놀이공원의 입장 관리와 비슷합니다.\n\n" +
        "**쿠키(Cookie)**는 입장 시 손목에 채워주는 팔찌입니다. 놀이기구를 탈 때마다 " +
        "팔찌를 보여주면 되지만, 팔찌 자체에는 누구인지 정보가 적혀 있지 않습니다. " +
        "단지 '입장했음'을 증명할 뿐입니다.\n\n" +
        "**세션(Session)**은 놀이공원 관리실의 방문자 명부입니다. 팔찌에 번호가 적혀 있고, " +
        "관리실에서 그 번호로 '이 사람은 VIP 고객, 이름은 홍길동'이라는 정보를 찾아볼 수 있습니다. " +
        "정보는 서버(관리실)에 보관됩니다.\n\n" +
        "**토큰(Token/JWT)**은 신분증 자체입니다. 이름, 등급, 유효기간이 모두 신분증에 " +
        "적혀 있어서 관리실에 물어볼 필요 없이 신분증만 보면 됩니다. " +
        "다만 위조 방지를 위해 특수 도장(서명)이 찍혀 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "HTTP는 **무상태(Stateless)** 프로토콜입니다. 매 요청이 독립적이어서 서버는 이전 요청을 기억하지 못합니다.\n\n" +
        "이로 인해 다음과 같은 문제가 발생합니다:\n\n" +
        "1. **로그인 유지 불가**: 한 번 로그인해도 다음 요청에서 서버가 사용자를 인식하지 못함\n" +
        "2. **상태 관리 필요**: 장바구니, 사용자 설정 등 상태를 요청 간에 유지해야 함\n" +
        "3. **보안 균형**: 편의성을 위해 상태를 유지하면서도 보안을 지켜야 함\n\n" +
        "쿠키, 세션, 토큰은 각기 다른 방식으로 이 무상태 문제를 해결합니다. " +
        "각각의 장단점과 적합한 사용 시나리오를 이해하는 것이 중요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 쿠키(Cookie)\n" +
        "서버가 `Set-Cookie` 헤더로 브라우저에 저장하는 작은 데이터입니다.\n\n" +
        "**주요 속성:**\n" +
        "- `HttpOnly`: JavaScript에서 접근 불가 (XSS 방어)\n" +
        "- `Secure`: HTTPS에서만 전송\n" +
        "- `SameSite`: 크로스 사이트 요청 시 쿠키 전송 제어 (Strict/Lax/None)\n" +
        "- `Path`: 쿠키가 전송되는 경로 범위\n" +
        "- `Domain`: 쿠키가 전송되는 도메인 범위\n" +
        "- `Expires/Max-Age`: 만료 시간 (없으면 세션 쿠키)\n\n" +
        "### 세션 기반 인증\n" +
        "1. 사용자 로그인 → 서버가 세션 ID 생성\n" +
        "2. 세션 데이터를 서버 메모리/DB에 저장\n" +
        "3. 세션 ID를 쿠키에 담아 클라이언트에 전달\n" +
        "4. 이후 요청마다 쿠키의 세션 ID로 서버에서 사용자 정보 조회\n\n" +
        "**장점:** 서버가 세션을 완전 제어, 즉시 무효화 가능\n" +
        "**단점:** 서버 메모리 사용, 서버 확장 시 세션 공유 필요\n\n" +
        "### JWT (JSON Web Token)\n" +
        "토큰 자체에 정보를 담는 자기 포함(Self-contained) 방식입니다.\n\n" +
        "**구조: Header.Payload.Signature**\n" +
        "- Header: 알고리즘과 토큰 타입\n" +
        "- Payload: 사용자 정보(Claims) — sub, exp, iat 등\n" +
        "- Signature: Header + Payload를 비밀키로 서명\n\n" +
        "**장점:** 서버 상태 불필요, 확장 용이, 마이크로서비스에 적합\n" +
        "**단점:** 즉시 무효화 어려움, 토큰 크기가 세션 ID보다 큼\n\n" +
        "### 토큰 저장 위치\n" +
        "- **HttpOnly 쿠키**: XSS에 안전하지만 CSRF 주의 필요\n" +
        "- **localStorage**: XSS에 취약하지만 CSRF에 안전\n" +
        "- **메모리(변수)**: 가장 안전하지만 새로고침 시 소실\n\n" +
        "### Refresh Token Rotation\n" +
        "Access Token(짧은 수명)과 Refresh Token(긴 수명)을 분리하고, " +
        "Refresh Token 사용 시마다 새로운 Refresh Token을 발급하여 보안을 강화합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: JWT 구조와 검증 흐름",
      content:
        "JWT의 내부 구조와 서버에서의 검증 과정을 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          "// JWT의 내부 구조\n" +
          "interface JWTHeader {\n" +
          "  alg: 'HS256' | 'RS256'; // 서명 알고리즘\n" +
          "  typ: 'JWT';             // 토큰 타입\n" +
          "}\n" +
          "\n" +
          "interface JWTPayload {\n" +
          "  sub: string;   // 사용자 ID (Subject)\n" +
          "  iat: number;   // 발급 시간 (Issued At)\n" +
          "  exp: number;   // 만료 시간 (Expiration)\n" +
          "  role: string;  // 커스텀 클레임\n" +
          "}\n" +
          "\n" +
          "// JWT 생성 과정 (의사코드)\n" +
          "function createJWT(payload: JWTPayload, secret: string): string {\n" +
          "  const header: JWTHeader = { alg: 'HS256', typ: 'JWT' };\n" +
          "  const encodedHeader = base64UrlEncode(JSON.stringify(header));\n" +
          "  const encodedPayload = base64UrlEncode(JSON.stringify(payload));\n" +
          "  const signature = HMAC_SHA256(\n" +
          "    encodedHeader + '.' + encodedPayload,\n" +
          "    secret\n" +
          "  );\n" +
          "  return encodedHeader + '.' + encodedPayload + '.' + signature;\n" +
          "}\n" +
          "\n" +
          "// JWT 검증 과정 (의사코드)\n" +
          "function verifyJWT(token: string, secret: string): JWTPayload | null {\n" +
          "  const [headerB64, payloadB64, signature] = token.split('.');\n" +
          "\n" +
          "  // 1. 서명 검증 — 토큰이 위조되지 않았는지 확인\n" +
          "  const expectedSig = HMAC_SHA256(\n" +
          "    headerB64 + '.' + payloadB64,\n" +
          "    secret\n" +
          "  );\n" +
          "  if (signature !== expectedSig) {\n" +
          "    return null; // 서명 불일치 → 위조된 토큰\n" +
          "  }\n" +
          "\n" +
          "  // 2. 만료 시간 확인\n" +
          "  const payload = JSON.parse(base64UrlDecode(payloadB64));\n" +
          "  if (payload.exp < Date.now() / 1000) {\n" +
          "    return null; // 만료된 토큰\n" +
          "  }\n" +
          "\n" +
          "  return payload; // 유효한 토큰\n" +
          "}\n" +
          "\n" +
          "// Refresh Token Rotation 흐름\n" +
          "// 1. 로그인 → Access Token(15분) + Refresh Token(7일) 발급\n" +
          "// 2. Access Token 만료 → Refresh Token으로 재발급 요청\n" +
          "// 3. 서버: 기존 Refresh Token 폐기, 새 Access + Refresh 쌍 발급\n" +
          "// 4. 탈취된 Refresh Token 사용 시 → 이미 폐기됨 → 전체 로그아웃",
        description: "JWT는 Header.Payload.Signature 구조이며, 서명으로 위변조를 감지하고 만료 시간으로 유효성을 검증한다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 인증 시스템 구현",
      content:
        "프론트엔드에서 토큰 기반 인증을 구현하는 실습입니다. 로그인, 토큰 저장, 자동 갱신을 다룹니다.",
      code: {
        language: "typescript",
        code:
          "// 토큰 기반 인증 관리 클래스\n" +
          "class AuthManager {\n" +
          "  private accessToken: string | null = null;\n" +
          "\n" +
          "  // 로그인 — 서버에서 토큰 쌍 수령\n" +
          "  async login(email: string, password: string): Promise<boolean> {\n" +
          "    const response = await fetch('/api/auth/login', {\n" +
          "      method: 'POST',\n" +
          "      headers: { 'Content-Type': 'application/json' },\n" +
          "      body: JSON.stringify({ email, password }),\n" +
          "      credentials: 'include', // Refresh Token은 HttpOnly 쿠키로 수령\n" +
          "    });\n" +
          "\n" +
          "    if (!response.ok) return false;\n" +
          "\n" +
          "    const data = await response.json();\n" +
          "    this.accessToken = data.accessToken; // 메모리에 저장\n" +
          "    return true;\n" +
          "  }\n" +
          "\n" +
          "  // 인증된 API 요청\n" +
          "  async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {\n" +
          "    if (!this.accessToken) {\n" +
          "      throw new Error('로그인이 필요합니다');\n" +
          "    }\n" +
          "\n" +
          "    const response = await fetch(url, {\n" +
          "      ...options,\n" +
          "      headers: {\n" +
          "        ...options.headers,\n" +
          "        'Authorization': 'Bearer ' + this.accessToken,\n" +
          "      },\n" +
          "    });\n" +
          "\n" +
          "    // 401 → Access Token 만료 → 갱신 시도\n" +
          "    if (response.status === 401) {\n" +
          "      const refreshed = await this.refreshAccessToken();\n" +
          "      if (refreshed) {\n" +
          "        // 새 토큰으로 재요청\n" +
          "        return fetch(url, {\n" +
          "          ...options,\n" +
          "          headers: {\n" +
          "            ...options.headers,\n" +
          "            'Authorization': 'Bearer ' + this.accessToken,\n" +
          "          },\n" +
          "        });\n" +
          "      }\n" +
          "      // 갱신 실패 → 로그아웃\n" +
          "      this.logout();\n" +
          "      throw new Error('인증이 만료되었습니다');\n" +
          "    }\n" +
          "\n" +
          "    return response;\n" +
          "  }\n" +
          "\n" +
          "  // Refresh Token으로 Access Token 갱신\n" +
          "  private async refreshAccessToken(): Promise<boolean> {\n" +
          "    const response = await fetch('/api/auth/refresh', {\n" +
          "      method: 'POST',\n" +
          "      credentials: 'include', // HttpOnly 쿠키의 Refresh Token 전송\n" +
          "    });\n" +
          "\n" +
          "    if (!response.ok) return false;\n" +
          "\n" +
          "    const data = await response.json();\n" +
          "    this.accessToken = data.accessToken;\n" +
          "    return true;\n" +
          "  }\n" +
          "\n" +
          "  logout(): void {\n" +
          "    this.accessToken = null;\n" +
          "    fetch('/api/auth/logout', {\n" +
          "      method: 'POST',\n" +
          "      credentials: 'include',\n" +
          "    });\n" +
          "  }\n" +
          "}",
        description: "Access Token은 메모리에, Refresh Token은 HttpOnly 쿠키에 저장하는 패턴이 보안과 편의성의 균형을 잡는다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 구분 | 세션 기반 | JWT 토큰 기반 |\n" +
        "|------|-----------|---------------|\n" +
        "| 상태 저장 | 서버 (메모리/DB) | 클라이언트 (토큰 자체) |\n" +
        "| 확장성 | 세션 공유 필요 | 서버 무상태 |\n" +
        "| 즉시 무효화 | 용이 | 어려움 (블랙리스트 필요) |\n" +
        "| 크기 | 세션 ID만 전송 | 전체 페이로드 전송 |\n" +
        "| 적합한 경우 | 단일 서버, 강력한 세션 제어 | 마이크로서비스, 모바일 |\n\n" +
        "**쿠키 보안 속성 필수 설정:**\n" +
        "- `HttpOnly`: XSS 방어의 첫 번째 방어선\n" +
        "- `Secure`: HTTPS 환경 필수\n" +
        "- `SameSite=Lax`: CSRF 기본 방어\n\n" +
        "**토큰 저장 권장 패턴:** Access Token은 메모리(변수), Refresh Token은 HttpOnly 쿠키에 저장\n\n" +
        "**다음 챕터 미리보기:** 캐싱 전략을 배우면서, 인증 토큰과 캐시가 어떻게 상호작용하는지 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "세션은 서버에 상태를 저장하고 JWT는 토큰 자체에 정보를 담으며, 보안을 위해 Access Token은 메모리에, Refresh Token은 HttpOnly 쿠키에 저장한다.",
  checklist: [
    "쿠키의 HttpOnly, Secure, SameSite 속성의 역할을 설명할 수 있다",
    "세션 기반 인증과 토큰 기반 인증의 장단점을 비교할 수 있다",
    "JWT의 Header.Payload.Signature 구조를 이해한다",
    "Access Token과 Refresh Token을 어디에 저장해야 하는지 판단할 수 있다",
    "Refresh Token Rotation의 필요성과 동작 원리를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "쿠키에 HttpOnly 속성을 설정하면 어떤 효과가 있는가?",
      choices: [
        "HTTPS에서만 쿠키가 전송된다",
        "JavaScript에서 document.cookie로 접근할 수 없다",
        "같은 사이트의 요청에서만 쿠키가 전송된다",
        "쿠키의 만료 시간이 무한대가 된다",
      ],
      correctIndex: 1,
      explanation: "HttpOnly 속성은 JavaScript의 document.cookie API를 통한 접근을 차단합니다. 이는 XSS 공격으로 쿠키를 탈취하는 것을 방지하는 중요한 보안 장치입니다.",
    },
    {
      id: "q2",
      question: "JWT의 Payload는 암호화되어 있는가?",
      choices: [
        "예, 비밀키로 암호화되어 있다",
        "아니오, Base64URL로 인코딩만 되어 있어 누구나 읽을 수 있다",
        "예, 공개키로 암호화되어 있다",
        "예, SHA-256으로 해싱되어 있다",
      ],
      correctIndex: 1,
      explanation: "JWT의 Payload는 Base64URL로 인코딩만 되어 있어 누구나 디코딩하여 내용을 볼 수 있습니다. Signature는 위변조 감지용이지 암호화가 아닙니다. 민감한 정보는 Payload에 넣으면 안 됩니다.",
    },
    {
      id: "q3",
      question: "세션 기반 인증의 단점은?",
      choices: [
        "토큰 크기가 너무 크다",
        "서버 확장(Scale-out) 시 세션 공유가 필요하다",
        "즉시 로그아웃이 불가능하다",
        "클라이언트에서 사용자 정보를 확인할 수 없다",
      ],
      correctIndex: 1,
      explanation: "세션 데이터가 서버 메모리에 저장되므로, 여러 서버로 확장할 때 Redis 같은 공유 세션 저장소가 필요합니다. 반면 JWT는 서버에 상태가 없어 확장이 용이합니다.",
    },
    {
      id: "q4",
      question: "Refresh Token Rotation의 주요 목적은?",
      choices: [
        "Access Token의 만료 시간을 연장하기 위해",
        "서버의 메모리 사용량을 줄이기 위해",
        "Refresh Token 탈취 시 피해를 최소화하기 위해",
        "쿠키의 SameSite 속성을 우회하기 위해",
      ],
      correctIndex: 2,
      explanation: "Refresh Token Rotation은 토큰 사용 시마다 새 토큰을 발급하고 기존 토큰을 폐기합니다. 탈취된 토큰이 사용되면 이미 폐기되어 있으므로 피해를 최소화할 수 있습니다.",
    },
    {
      id: "q5",
      question: "프론트엔드에서 Access Token을 저장하기에 가장 안전한 위치는?",
      choices: [
        "localStorage",
        "sessionStorage",
        "메모리(JavaScript 변수)",
        "일반 쿠키(HttpOnly 아닌)",
      ],
      correctIndex: 2,
      explanation: "JavaScript 변수(메모리)에 저장하면 XSS로도 접근하기 어렵고 브라우저를 닫으면 자동 소멸됩니다. localStorage는 XSS에 취약하고, 일반 쿠키도 JavaScript로 접근 가능합니다.",
    },
  ],
};

export default chapter;
