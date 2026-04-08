import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "19-authentication-oauth",
  subject: "network",
  title: "인증과 OAuth",
  description: "인증과 인가의 차이를 이해하고, OAuth 2.0과 OpenID Connect를 활용한 소셜 로그인 구현과 프론트엔드 인증 패턴을 학습합니다.",
  order: 19,
  group: "웹 보안",
  prerequisites: ["14-cookie-session-token"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "인증과 OAuth는 호텔 체크인과 비슷합니다.\n\n" +
        "**인증(Authentication)**은 프론트 데스크에서 '당신이 누구인지' 확인하는 것입니다. " +
        "여권이나 신분증을 보여주면 '홍길동 고객님'이라는 것이 확인됩니다.\n\n" +
        "**인가(Authorization)**는 '당신이 무엇을 할 수 있는지' 결정하는 것입니다. " +
        "일반 투숙객은 자기 방만, VIP는 라운지와 수영장까지 이용할 수 있습니다.\n\n" +
        "**OAuth 2.0**은 발렛 파킹 키와 비슷합니다. " +
        "자동차의 마스터 키 대신 주차만 가능한 제한된 키를 발렛에게 줍니다. " +
        "발렛은 차를 운전할 수 있지만 트렁크를 열거나 차를 가져갈 수는 없습니다. " +
        "마찬가지로 OAuth는 비밀번호를 주지 않고도 제한된 접근 권한을 부여합니다.\n\n" +
        "**OpenID Connect**는 OAuth 위에 신분증 기능을 추가한 것입니다. " +
        "'이 사람은 구글 계정 가입자 홍길동이다'라는 신원 정보까지 함께 받을 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "현대 웹 서비스에서 인증 시스템을 직접 구축하는 것은 복잡하고 위험합니다.\n\n" +
        "**직접 구현의 문제점:**\n\n" +
        "1. **비밀번호 관리 부담**: 해싱, 솔팅, 유출 대응 등 보안 요구사항이 방대\n" +
        "2. **사용자 피로**: 서비스마다 새 계정을 만들어야 하는 불편함\n" +
        "3. **보안 사고 위험**: 인증 로직의 취약점이 전체 시스템을 위협\n\n" +
        "**OAuth가 해결하는 문제:**\n" +
        "- 사용자가 기존 계정(Google, Kakao 등)으로 로그인 가능\n" +
        "- 비밀번호를 서드파티에 공유하지 않아도 됨\n" +
        "- 필요한 권한만 요청 (이메일, 프로필 등)\n" +
        "- 사용자가 언제든 권한을 취소할 수 있음\n\n" +
        "**프론트엔드 개발자가 알아야 할 것:**\n" +
        "- OAuth 흐름에서 프론트엔드의 역할\n" +
        "- 토큰 저장과 갱신 전략\n" +
        "- Protected Route 구현\n" +
        "- Auth Context / Auth Provider 패턴",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 인증(Authentication) vs 인가(Authorization)\n" +
        "- **인증**: '당신은 누구인가?' — 신원 확인 (로그인)\n" +
        "- **인가**: '당신은 무엇을 할 수 있는가?' — 권한 확인 (접근 제어)\n\n" +
        "### OAuth 2.0 Authorization Code Flow\n" +
        "가장 안전하고 일반적인 흐름입니다:\n\n" +
        "1. 사용자가 '구글로 로그인' 클릭\n" +
        "2. 프론트엔드가 구글 인증 서버로 리다이렉트 (client_id, redirect_uri, scope 포함)\n" +
        "3. 사용자가 구글에서 로그인 + 권한 승인\n" +
        "4. 구글이 redirect_uri로 Authorization Code 전달\n" +
        "5. **백엔드**가 Code + client_secret으로 Access Token 교환\n" +
        "6. 백엔드가 Access Token으로 구글 API 호출 (사용자 정보 등)\n\n" +
        "### PKCE (Proof Key for Code Exchange)\n" +
        "SPA처럼 client_secret을 안전하게 보관할 수 없는 환경을 위한 확장입니다:\n" +
        "- Code Verifier: 랜덤 문자열 생성\n" +
        "- Code Challenge: Verifier의 SHA-256 해시\n" +
        "- 인증 요청 시 Challenge 전송, 토큰 교환 시 Verifier 전송\n" +
        "- 서버가 Challenge와 Verifier 일치를 검증\n\n" +
        "### OpenID Connect (OIDC)\n" +
        "OAuth 2.0 위에 인증 레이어를 추가한 프로토콜입니다:\n" +
        "- ID Token (JWT): 사용자 신원 정보 포함\n" +
        "- UserInfo 엔드포인트: 추가 프로필 정보 조회\n" +
        "- 표준 Scope: `openid`, `profile`, `email`\n\n" +
        "### JWT vs 세션 비교\n" +
        "| 특성 | JWT | 세션 |\n" +
        "|------|-----|------|\n" +
        "| 상태 | 무상태 (Stateless) | 유상태 (Stateful) |\n" +
        "| 저장 | 클라이언트 | 서버 |\n" +
        "| 확장성 | 높음 | 세션 공유 필요 |\n" +
        "| 무효화 | 어려움 | 즉시 가능 |\n" +
        "| 크기 | 큼 | 작음 (ID만) |\n\n" +
        "### 프론트엔드 인증 패턴\n" +
        "- **Auth Context**: React Context로 인증 상태 전역 관리\n" +
        "- **Protected Route**: 미인증 시 로그인 페이지로 리다이렉트\n" +
        "- **Token Refresh**: 401 응답 시 자동으로 토큰 갱신 후 재요청",
    },
    {
      type: "pseudocode",
      title: "기술 구현: OAuth 2.0 + PKCE 흐름",
      content:
        "SPA에서 OAuth 2.0 Authorization Code + PKCE 흐름을 구현하는 핵심 로직을 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          "// OAuth 2.0 Authorization Code + PKCE 흐름\n" +
          "\n" +
          "// 1단계: PKCE 코드 생성\n" +
          "async function generatePKCE(): Promise<{\n" +
          "  codeVerifier: string;\n" +
          "  codeChallenge: string;\n" +
          "}> {\n" +
          "  // 랜덤 Code Verifier 생성 (43-128자)\n" +
          "  const array = new Uint8Array(32);\n" +
          "  crypto.getRandomValues(array);\n" +
          "  const codeVerifier = base64UrlEncode(array);\n" +
          "\n" +
          "  // Code Challenge = SHA-256(Code Verifier)\n" +
          "  const encoder = new TextEncoder();\n" +
          "  const data = encoder.encode(codeVerifier);\n" +
          "  const digest = await crypto.subtle.digest('SHA-256', data);\n" +
          "  const codeChallenge = base64UrlEncode(new Uint8Array(digest));\n" +
          "\n" +
          "  return { codeVerifier, codeChallenge };\n" +
          "}\n" +
          "\n" +
          "// 2단계: 인증 서버로 리다이렉트\n" +
          "async function startOAuthFlow(): Promise<void> {\n" +
          "  const { codeVerifier, codeChallenge } = await generatePKCE();\n" +
          "\n" +
          "  // Code Verifier를 세션에 저장 (나중에 토큰 교환 시 사용)\n" +
          "  sessionStorage.setItem('code_verifier', codeVerifier);\n" +
          "\n" +
          "  // CSRF 방어용 state 생성\n" +
          "  const state = crypto.randomUUID();\n" +
          "  sessionStorage.setItem('oauth_state', state);\n" +
          "\n" +
          "  const params = new URLSearchParams({\n" +
          "    response_type: 'code',\n" +
          "    client_id: 'my-app-client-id',\n" +
          "    redirect_uri: 'https://myapp.com/callback',\n" +
          "    scope: 'openid profile email',\n" +
          "    state: state,\n" +
          "    code_challenge: codeChallenge,\n" +
          "    code_challenge_method: 'S256',\n" +
          "  });\n" +
          "\n" +
          "  // 인증 서버로 리다이렉트\n" +
          "  window.location.href =\n" +
          "    'https://auth.provider.com/authorize?' + params.toString();\n" +
          "}\n" +
          "\n" +
          "// 3단계: 콜백 처리 (redirect_uri 페이지)\n" +
          "async function handleOAuthCallback(): Promise<void> {\n" +
          "  const params = new URLSearchParams(window.location.search);\n" +
          "  const code = params.get('code');\n" +
          "  const state = params.get('state');\n" +
          "\n" +
          "  // CSRF 검증: state 일치 확인\n" +
          "  const savedState = sessionStorage.getItem('oauth_state');\n" +
          "  if (state !== savedState) {\n" +
          "    throw new Error('CSRF 공격 의심: state 불일치');\n" +
          "  }\n" +
          "\n" +
          "  // Code Verifier 복원\n" +
          "  const codeVerifier = sessionStorage.getItem('code_verifier');\n" +
          "  if (!code || !codeVerifier) {\n" +
          "    throw new Error('인증 정보 누락');\n" +
          "  }\n" +
          "\n" +
          "  // 4단계: Authorization Code → Token 교환\n" +
          "  // SPA에서는 프론트엔드가 직접, 또는 BFF(Backend For Frontend) 경유\n" +
          "  const tokenResponse = await fetch('https://auth.provider.com/token', {\n" +
          "    method: 'POST',\n" +
          "    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },\n" +
          "    body: new URLSearchParams({\n" +
          "      grant_type: 'authorization_code',\n" +
          "      code: code,\n" +
          "      redirect_uri: 'https://myapp.com/callback',\n" +
          "      client_id: 'my-app-client-id',\n" +
          "      code_verifier: codeVerifier,\n" +
          "    }),\n" +
          "  });\n" +
          "\n" +
          "  const tokens = await tokenResponse.json();\n" +
          "  // tokens: { access_token, id_token, refresh_token, expires_in }\n" +
          "\n" +
          "  // 세션 스토리지 정리\n" +
          "  sessionStorage.removeItem('code_verifier');\n" +
          "  sessionStorage.removeItem('oauth_state');\n" +
          "}",
        description: "PKCE는 Code Verifier/Challenge 쌍으로 Authorization Code 탈취를 방지하며, state 파라미터로 CSRF도 함께 방어한다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: React 인증 패턴",
      content:
        "React에서 Auth Context와 Protected Route를 구현하는 실습입니다.",
      code: {
        language: "typescript",
        code:
          "// 1. Auth Context 타입 정의\n" +
          "interface User {\n" +
          "  id: string;\n" +
          "  name: string;\n" +
          "  email: string;\n" +
          "  role: 'user' | 'admin';\n" +
          "}\n" +
          "\n" +
          "interface AuthContextType {\n" +
          "  user: User | null;\n" +
          "  isLoading: boolean;\n" +
          "  isAuthenticated: boolean;\n" +
          "  login: (provider: string) => void;\n" +
          "  logout: () => Promise<void>;\n" +
          "}\n" +
          "\n" +
          "// 2. Auth Provider 구현 (개념적 코드)\n" +
          "class AuthProvider {\n" +
          "  private user: User | null = null;\n" +
          "  private accessToken: string | null = null;\n" +
          "\n" +
          "  get isAuthenticated(): boolean {\n" +
          "    return this.user !== null;\n" +
          "  }\n" +
          "\n" +
          "  // 앱 시작 시 인증 상태 복원\n" +
          "  async initialize(): Promise<void> {\n" +
          "    try {\n" +
          "      // HttpOnly 쿠키의 Refresh Token으로 새 Access Token 발급\n" +
          "      const response = await fetch('/api/auth/refresh', {\n" +
          "        method: 'POST',\n" +
          "        credentials: 'include',\n" +
          "      });\n" +
          "\n" +
          "      if (response.ok) {\n" +
          "        const data = await response.json();\n" +
          "        this.accessToken = data.accessToken;\n" +
          "        this.user = data.user;\n" +
          "      }\n" +
          "    } catch (error) {\n" +
          "      console.log('인증 복원 실패: 로그아웃 상태');\n" +
          "      this.user = null;\n" +
          "    }\n" +
          "  }\n" +
          "\n" +
          "  // 소셜 로그인 시작\n" +
          "  login(provider: string): void {\n" +
          "    const providers: Record<string, string> = {\n" +
          "      google: 'https://accounts.google.com/o/oauth2/v2/auth',\n" +
          "      kakao: 'https://kauth.kakao.com/oauth/authorize',\n" +
          "      github: 'https://github.com/login/oauth/authorize',\n" +
          "    };\n" +
          "\n" +
          "    const authUrl = providers[provider];\n" +
          "    if (!authUrl) {\n" +
          "      console.error('지원하지 않는 로그인 제공자: ' + provider);\n" +
          "      return;\n" +
          "    }\n" +
          "\n" +
          "    const params = new URLSearchParams({\n" +
          "      client_id: getClientId(provider),\n" +
          "      redirect_uri: window.location.origin + '/auth/callback',\n" +
          "      response_type: 'code',\n" +
          "      scope: 'openid profile email',\n" +
          "    });\n" +
          "\n" +
          "    window.location.href = authUrl + '?' + params.toString();\n" +
          "  }\n" +
          "\n" +
          "  async logout(): Promise<void> {\n" +
          "    await fetch('/api/auth/logout', {\n" +
          "      method: 'POST',\n" +
          "      credentials: 'include',\n" +
          "    });\n" +
          "    this.user = null;\n" +
          "    this.accessToken = null;\n" +
          "    window.location.href = '/login';\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// 3. Protected Route 로직\n" +
          "function checkAccess(\n" +
          "  user: User | null,\n" +
          "  requiredRole?: string\n" +
          "): { allowed: boolean; redirectTo: string } {\n" +
          "  if (!user) {\n" +
          "    return { allowed: false, redirectTo: '/login' };\n" +
          "  }\n" +
          "\n" +
          "  if (requiredRole && user.role !== requiredRole) {\n" +
          "    return { allowed: false, redirectTo: '/unauthorized' };\n" +
          "  }\n" +
          "\n" +
          "  return { allowed: true, redirectTo: '' };\n" +
          "}\n" +
          "\n" +
          "// 4. 인증된 API 호출 with 자동 토큰 갱신\n" +
          "function getClientId(provider: string): string {\n" +
          "  const clientIds: Record<string, string> = {\n" +
          "    google: 'GOOGLE_CLIENT_ID',\n" +
          "    kakao: 'KAKAO_CLIENT_ID',\n" +
          "    github: 'GITHUB_CLIENT_ID',\n" +
          "  };\n" +
          "  return clientIds[provider] || '';\n" +
          "}",
        description: "Auth Provider로 인증 상태를 관리하고, Protected Route로 미인증 접근을 차단하며, 소셜 로그인은 OAuth 2.0 흐름으로 처리한다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 역할 | 프론트엔드 책임 |\n" +
        "|------|------|----------------|\n" +
        "| Authentication | 신원 확인 | 로그인 UI, 토큰 관리 |\n" +
        "| Authorization | 권한 확인 | Protected Route, 조건부 UI |\n" +
        "| OAuth 2.0 | 위임 인가 | 리다이렉트, 콜백 처리 |\n" +
        "| PKCE | SPA 보안 강화 | Code Verifier/Challenge 생성 |\n" +
        "| OIDC | 인증 + 인가 | ID Token으로 사용자 정보 획득 |\n\n" +
        "**프론트엔드 인증 Best Practice:**\n" +
        "- Access Token은 메모리(변수)에 저장\n" +
        "- Refresh Token은 HttpOnly 쿠키에 저장\n" +
        "- SPA에서는 반드시 PKCE 사용\n" +
        "- 앱 시작 시 Refresh Token으로 인증 상태 복원\n" +
        "- 401 응답 시 자동으로 토큰 갱신 후 재요청\n" +
        "- Auth Context로 전역 인증 상태 관리\n" +
        "- Protected Route로 미인증 접근 차단",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "OAuth 2.0은 비밀번호 공유 없이 제한된 접근 권한을 부여하는 표준이며, SPA에서는 PKCE를 반드시 적용하고 Auth Context로 인증 상태를 관리한다.",
  checklist: [
    "인증(Authentication)과 인가(Authorization)의 차이를 명확히 설명할 수 있다",
    "OAuth 2.0 Authorization Code Flow의 전체 흐름을 이해한다",
    "PKCE가 필요한 이유와 Code Verifier/Challenge의 역할을 설명할 수 있다",
    "React에서 Auth Context와 Protected Route 패턴을 구현할 수 있다",
    "토큰 갱신 전략과 앱 시작 시 인증 복원 로직을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "인증(Authentication)과 인가(Authorization)의 올바른 비교는?",
      choices: [
        "인증은 권한 확인, 인가는 신원 확인이다",
        "인증은 신원 확인, 인가는 권한 확인이다",
        "인증과 인가는 동일한 개념이다",
        "인가가 항상 인증보다 먼저 수행된다",
      ],
      correctIndex: 1,
      explanation: "인증(Authentication)은 '당신은 누구인가?'를 확인하는 과정이고, 인가(Authorization)는 '당신은 무엇을 할 수 있는가?'를 결정하는 과정입니다. 인증이 먼저 수행된 후 인가가 이루어집니다.",
    },
    {
      id: "q2",
      question: "OAuth 2.0에서 Authorization Code를 Access Token으로 교환하는 이유는?",
      choices: [
        "코드가 너무 길어서 짧은 토큰으로 변환한다",
        "코드는 URL에 노출되므로 이를 안전한 채널(백엔드)에서 토큰으로 교환한다",
        "코드의 유효 기간을 연장하기 위해서이다",
        "브라우저가 코드를 이해할 수 없기 때문이다",
      ],
      correctIndex: 1,
      explanation: "Authorization Code는 URL의 쿼리 파라미터로 전달되어 브라우저 히스토리나 로그에 노출될 수 있습니다. 이 코드를 백엔드에서 client_secret과 함께 안전하게 Access Token으로 교환합니다.",
    },
    {
      id: "q3",
      question: "PKCE(Proof Key for Code Exchange)가 필요한 이유는?",
      choices: [
        "서버의 응답 속도를 높이기 위해",
        "SPA처럼 client_secret을 안전하게 보관할 수 없는 환경에서 보안을 강화하기 위해",
        "사용자의 비밀번호를 암호화하기 위해",
        "OAuth 1.0과의 호환성을 유지하기 위해",
      ],
      correctIndex: 1,
      explanation: "SPA는 소스 코드가 브라우저에 노출되므로 client_secret을 안전하게 보관할 수 없습니다. PKCE는 동적으로 생성한 Code Verifier/Challenge 쌍으로 Authorization Code 가로채기 공격을 방지합니다.",
    },
    {
      id: "q4",
      question: "OpenID Connect가 OAuth 2.0에 추가하는 핵심 기능은?",
      choices: [
        "더 빠른 토큰 발급",
        "ID Token을 통한 사용자 인증(신원 확인)",
        "더 많은 API 접근 권한",
        "비밀번호 암호화",
      ],
      correctIndex: 1,
      explanation: "OAuth 2.0은 인가(Authorization) 프레임워크이지 인증 프로토콜이 아닙니다. OpenID Connect는 OAuth 2.0 위에 ID Token(JWT)을 추가하여 사용자의 신원을 표준화된 방식으로 확인할 수 있게 합니다.",
    },
    {
      id: "q5",
      question: "SPA에서 앱 새로고침 시 인증 상태를 복원하는 올바른 방법은?",
      choices: [
        "localStorage에서 Access Token을 읽어온다",
        "URL 쿼리 파라미터에서 토큰을 읽어온다",
        "HttpOnly 쿠키의 Refresh Token으로 새 Access Token을 발급받는다",
        "사용자에게 다시 로그인을 요청한다",
      ],
      correctIndex: 2,
      explanation: "Access Token은 메모리에 저장하므로 새로고침 시 소실됩니다. HttpOnly 쿠키에 저장된 Refresh Token은 새로고침 후에도 유지되므로, 이를 이용해 새 Access Token을 발급받아 인증 상태를 복원합니다.",
    },
  ],
};

export default chapter;
