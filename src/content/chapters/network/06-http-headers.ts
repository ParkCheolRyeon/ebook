import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "06-http-headers",
  subject: "network",
  title: "HTTP 헤더 심화",
  description: "Content-Type, Authorization, Cache-Control, CORS 헤더 등 프론트엔드 개발에서 자주 사용하는 HTTP 헤더를 심화 학습합니다.",
  order: 6,
  group: "HTTP",
  prerequisites: ["04-http-basics"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "HTTP 헤더는 **택배 상자의 라벨과 취급 주의 스티커**와 같습니다.\n\n" +
        "상자 안에 실제 물건(본문)이 들어있고, 겉에 붙은 라벨들이 헤더입니다:\n\n" +
        "- **Content-Type**: \"내용물: 유리 제품\" — 안에 뭐가 들었는지 (JSON, HTML, 이미지)\n" +
        "- **Authorization**: \"수취인 확인 필수\" — 본인 인증 정보 (토큰, API 키)\n" +
        "- **Cache-Control**: \"냉장 보관, 유효기간 3일\" — 캐시 정책\n" +
        "- **Accept**: \"유리 제품만 받습니다\" — 클라이언트가 원하는 응답 형식\n" +
        "- **Cookie**: \"단골 고객 카드\" — 이전 방문 정보\n" +
        "- **CORS 헤더**: \"해외 배송 허용 국가 목록\" — 다른 출처의 접근 권한\n" +
        "- **Set-Cookie**: \"이 단골 카드를 가지고 다음에 오세요\" — 서버가 클라이언트에 쿠키 설정\n\n" +
        "적절한 라벨(헤더) 없이 택배를 보내면 배송(요청)이 거부되거나 잘못 처리됩니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "HTTP 헤더를 제대로 모르면 프론트엔드에서 이런 문제들이 발생합니다:\n\n" +
        "1. **Content-Type 미설정** — 서버가 JSON 본문을 파싱하지 못해 400 에러 발생\n" +
        "2. **Authorization 형식 오류** — `Bearer` 접두사를 빼먹어서 401 에러\n" +
        "3. **Cache-Control 미이해** — 배포 후 사용자가 이전 버전의 JS를 로드\n" +
        "4. **ETag 무시** — 불필요한 데이터 재전송으로 대역폭 낭비\n" +
        "5. **CORS 헤더 혼란** — 프리플라이트 요청 실패 원인을 찾지 못함\n" +
        "6. **쿠키 속성 미설정** — Secure, HttpOnly, SameSite를 빼먹어 보안 취약점 발생\n\n" +
        "헤더를 정확히 이해하면 API 통신 문제의 절반 이상을 해결할 수 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 요청 헤더 (Request Headers)\n\n" +
        "**콘텐츠 협상:**\n" +
        "- `Content-Type`: 요청 본문의 형식 (`application/json`, `multipart/form-data`)\n" +
        "- `Accept`: 클라이언트가 원하는 응답 형식 (`application/json`, `text/html`)\n" +
        "- `Accept-Language`: 선호 언어 (`ko-KR, en-US`)\n" +
        "- `Accept-Encoding`: 지원하는 압축 (`gzip, br`)\n\n" +
        "**인증:**\n" +
        "- `Authorization: Bearer <token>`: JWT/OAuth 토큰\n" +
        "- `Authorization: Basic <base64>`: 기본 인증\n" +
        "- `Cookie`: 쿠키 전송\n\n" +
        "### 응답 헤더 (Response Headers)\n\n" +
        "**캐시 제어:**\n" +
        "- `Cache-Control: max-age=3600`: 3600초간 캐시 유효\n" +
        "- `Cache-Control: no-cache`: 매번 서버에 검증 요청\n" +
        "- `Cache-Control: no-store`: 캐시하지 않음 (민감 데이터)\n" +
        "- `ETag`: 리소스 버전 식별자 (조건부 요청에 사용)\n" +
        "- `Last-Modified`: 최종 수정 시간\n\n" +
        "**보안:**\n" +
        "- `Set-Cookie`: 쿠키 설정 (Secure, HttpOnly, SameSite 속성)\n" +
        "- `Content-Security-Policy`: XSS 방지 정책\n" +
        "- `Strict-Transport-Security`: HTTPS 강제\n" +
        "- `X-Content-Type-Options: nosniff`: MIME 스니핑 방지\n" +
        "- `X-Frame-Options: DENY`: 클릭재킹 방지\n\n" +
        "### CORS 헤더\n\n" +
        "- `Access-Control-Allow-Origin`: 허용된 출처\n" +
        "- `Access-Control-Allow-Methods`: 허용된 메서드\n" +
        "- `Access-Control-Allow-Headers`: 허용된 커스텀 헤더\n" +
        "- `Access-Control-Allow-Credentials`: 쿠키 포함 허용 여부\n\n" +
        "### 커스텀 헤더\n\n" +
        "- 예전에는 `X-` 접두사를 사용했으나, 현재는 권장하지 않습니다\n" +
        "- 요청 추적용: `X-Request-Id`, API 버전: `X-API-Version` 등",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 캐시 전략과 ETag 활용",
      content:
        "Cache-Control과 ETag를 활용한 캐시 전략을 TypeScript로 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// ETag를 활용한 조건부 요청 구현\n' +
          '\n' +
          'interface CacheEntry {\n' +
          '  data: unknown;\n' +
          '  etag: string;\n' +
          '  cachedAt: number;\n' +
          '  maxAge: number; // 초\n' +
          '}\n' +
          '\n' +
          'class HttpCacheManager {\n' +
          '  private cache = new Map<string, CacheEntry>();\n' +
          '\n' +
          '  async fetchWithCache(url: string): Promise<unknown> {\n' +
          '    const cached = this.cache.get(url);\n' +
          '\n' +
          '    // 1. 캐시가 있고 아직 유효한 경우 → 캐시 반환\n' +
          '    if (cached && Date.now() - cached.cachedAt < cached.maxAge * 1000) {\n' +
          '      console.log("[캐시 히트] 서버 요청 없이 캐시 반환");\n' +
          '      return cached.data;\n' +
          '    }\n' +
          '\n' +
          '    // 2. 캐시가 만료되었거나 없는 경우 → 조건부 요청\n' +
          '    const headers: Record<string, string> = {};\n' +
          '    if (cached?.etag) {\n' +
          '      headers["If-None-Match"] = cached.etag;\n' +
          '    }\n' +
          '\n' +
          '    const response = await fetch(url, { headers });\n' +
          '\n' +
          '    // 3. 304 Not Modified → 기존 캐시 사용\n' +
          '    if (response.status === 304 && cached) {\n' +
          '      console.log("[304] 리소스 변경 없음, 캐시 재사용");\n' +
          '      cached.cachedAt = Date.now();\n' +
          '      return cached.data;\n' +
          '    }\n' +
          '\n' +
          '    // 4. 200 OK → 새 데이터로 캐시 업데이트\n' +
          '    const data = await response.json();\n' +
          '    const etag = response.headers.get("ETag") || "";\n' +
          '    const cacheControl = response.headers.get("Cache-Control") || "";\n' +
          '    const maxAge = this.parseMaxAge(cacheControl);\n' +
          '\n' +
          '    this.cache.set(url, {\n' +
          '      data,\n' +
          '      etag,\n' +
          '      cachedAt: Date.now(),\n' +
          '      maxAge,\n' +
          '    });\n' +
          '\n' +
          '    console.log(`[200] 새 데이터 캐시 (max-age: ${maxAge}s)`);\n' +
          '    return data;\n' +
          '  }\n' +
          '\n' +
          '  private parseMaxAge(cacheControl: string): number {\n' +
          '    const match = cacheControl.match(/max-age=(\\d+)/);\n' +
          '    return match ? parseInt(match[1], 10) : 0;\n' +
          '  }\n' +
          '}',
        description: "ETag와 If-None-Match를 사용하면 리소스가 변경되지 않았을 때 304 응답으로 대역폭을 절약합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 프론트엔드에서 자주 사용하는 헤더 패턴",
      content:
        "실무에서 자주 사용하는 HTTP 헤더 설정 패턴을 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// 1. API 클라이언트: 공통 헤더 설정\n' +
          'function createApiClient(baseUrl: string) {\n' +
          '  const getAuthToken = (): string | null => {\n' +
          '    return localStorage.getItem("access_token");\n' +
          '  };\n' +
          '\n' +
          '  return async function request<T>(\n' +
          '    endpoint: string,\n' +
          '    options: RequestInit = {}\n' +
          '  ): Promise<T> {\n' +
          '    const token = getAuthToken();\n' +
          '    const headers = new Headers(options.headers);\n' +
          '\n' +
          '    // 기본 헤더 설정\n' +
          '    if (!headers.has("Content-Type")) {\n' +
          '      headers.set("Content-Type", "application/json");\n' +
          '    }\n' +
          '    headers.set("Accept", "application/json");\n' +
          '    headers.set("Accept-Language", navigator.language);\n' +
          '\n' +
          '    // 인증 토큰\n' +
          '    if (token) {\n' +
          '      headers.set("Authorization", `Bearer ${token}`);\n' +
          '    }\n' +
          '\n' +
          '    // 요청 추적 ID\n' +
          '    headers.set("X-Request-Id", crypto.randomUUID());\n' +
          '\n' +
          '    const response = await fetch(`${baseUrl}${endpoint}`, {\n' +
          '      ...options,\n' +
          '      headers,\n' +
          '    });\n' +
          '\n' +
          '    if (!response.ok) {\n' +
          '      throw new Error(`HTTP ${response.status}`);\n' +
          '    }\n' +
          '\n' +
          '    return response.json();\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          '// 2. 응답 헤더 활용: 페이지네이션, Rate Limit\n' +
          'async function fetchWithMetadata(url: string) {\n' +
          '  const response = await fetch(url);\n' +
          '  const data = await response.json();\n' +
          '\n' +
          '  return {\n' +
          '    data,\n' +
          '    pagination: {\n' +
          '      total: parseInt(response.headers.get("X-Total-Count") || "0"),\n' +
          '      page: parseInt(response.headers.get("X-Page") || "1"),\n' +
          '      perPage: parseInt(response.headers.get("X-Per-Page") || "20"),\n' +
          '    },\n' +
          '    rateLimit: {\n' +
          '      limit: parseInt(response.headers.get("X-RateLimit-Limit") || "0"),\n' +
          '      remaining: parseInt(response.headers.get("X-RateLimit-Remaining") || "0"),\n' +
          '      resetAt: new Date(parseInt(response.headers.get("X-RateLimit-Reset") || "0") * 1000),\n' +
          '    },\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          'const api = createApiClient("https://api.example.com");\n' +
          'const users = await api<{ id: number; name: string }[]>("/users");',
        description: "공통 헤더를 API 클라이언트에서 설정하고, 응답 헤더에서 페이지네이션과 Rate Limit 정보를 추출합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### 핵심 요청 헤더\n" +
        "- `Content-Type`: 요청 본문의 형식 (JSON, FormData 등)\n" +
        "- `Authorization`: 인증 정보 (Bearer 토큰)\n" +
        "- `Accept`: 원하는 응답 형식\n\n" +
        "### 캐시 관련 헤더\n" +
        "- `Cache-Control`: 캐시 정책 (max-age, no-cache, no-store)\n" +
        "- `ETag` + `If-None-Match`: 조건부 요청으로 304 응답 활용\n" +
        "- 변경되지 않은 리소스는 본문 없이 304만 반환하여 대역폭 절약\n\n" +
        "### 보안 헤더\n" +
        "- `Content-Security-Policy`: XSS 방지\n" +
        "- `Strict-Transport-Security`: HTTPS 강제\n" +
        "- `X-Content-Type-Options: nosniff`: MIME 스니핑 방지\n\n" +
        "### CORS 헤더\n" +
        "- 서버에서 `Access-Control-Allow-Origin` 등으로 교차 출처 접근을 허용합니다\n\n" +
        "**다음 챕터 미리보기:** HTTPS와 TLS 암호화가 어떻게 동작하는지 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "HTTP 헤더는 요청과 응답의 메타데이터를 전달한다. Content-Type, Authorization, Cache-Control은 프론트엔드에서 가장 자주 다루는 헤더이며, 보안 헤더와 CORS 헤더까지 이해해야 완전한 HTTP 통신을 할 수 있다.",
  checklist: [
    "Content-Type, Accept, Authorization 헤더의 역할을 설명할 수 있다",
    "Cache-Control의 max-age, no-cache, no-store 차이를 이해한다",
    "ETag와 조건부 요청(If-None-Match)의 동작 원리를 안다",
    "주요 보안 헤더(CSP, HSTS, X-Content-Type-Options)의 용도를 안다",
    "API 클라이언트에서 공통 헤더를 효율적으로 설정할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Cache-Control: no-cache의 의미는?",
      choices: [
        "캐시를 전혀 하지 않는다",
        "캐시는 하되, 사용 전에 서버에 유효성을 확인한다",
        "캐시 유효 기간이 0초이다",
        "프록시 서버에서만 캐시한다",
      ],
      correctIndex: 1,
      explanation: "no-cache는 캐시를 저장하지만, 매번 서버에 유효성 검증을 요청합니다. 캐시를 아예 하지 않으려면 no-store를 사용합니다.",
    },
    {
      id: "q2",
      question: "Authorization: Bearer <token>에서 Bearer의 역할은?",
      choices: [
        "토큰의 암호화 방식을 나타낸다",
        "인증 스키마(방식)를 나타내며, JWT/OAuth 토큰임을 의미한다",
        "토큰의 만료 시간을 나타낸다",
        "사용자의 역할(role)을 나타낸다",
      ],
      correctIndex: 1,
      explanation: "Bearer는 인증 스키마의 한 종류로, '이 토큰을 소지한(bear) 사용자'를 인증한다는 의미입니다. Basic, Digest 등 다른 스키마도 있습니다.",
    },
    {
      id: "q3",
      question: "ETag와 If-None-Match를 사용한 조건부 요청에서 리소스가 변경되지 않았을 때 서버의 응답은?",
      choices: [
        "200 OK (전체 데이터 포함)",
        "204 No Content",
        "304 Not Modified (본문 없음)",
        "302 Found",
      ],
      correctIndex: 2,
      explanation: "서버의 ETag와 클라이언트가 보낸 If-None-Match가 일치하면 304 Not Modified를 본문 없이 반환합니다. 클라이언트는 기존 캐시를 사용합니다.",
    },
    {
      id: "q4",
      question: "Set-Cookie 헤더의 HttpOnly 속성이 하는 일은?",
      choices: [
        "HTTP 요청에서만 쿠키를 전송한다",
        "JavaScript에서 document.cookie로 쿠키에 접근할 수 없게 한다",
        "HTTPS에서만 쿠키를 전송한다",
        "쿠키의 유효 기간을 설정한다",
      ],
      correctIndex: 1,
      explanation: "HttpOnly 속성은 JavaScript의 document.cookie로 쿠키에 접근하는 것을 차단합니다. XSS 공격으로부터 쿠키를 보호하는 보안 메커니즘입니다.",
    },
    {
      id: "q5",
      question: "X-Content-Type-Options: nosniff 헤더의 역할은?",
      choices: [
        "콘텐츠 압축을 비활성화한다",
        "브라우저의 MIME 타입 스니핑을 방지하여 Content-Type을 엄격히 따르게 한다",
        "콘텐츠 인코딩을 지정한다",
        "캐시 정책을 설정한다",
      ],
      correctIndex: 1,
      explanation: "nosniff는 브라우저가 Content-Type을 무시하고 콘텐츠를 추측(MIME 스니핑)하는 것을 방지합니다. 예를 들어, 텍스트 파일을 스크립트로 실행하는 것을 막습니다.",
    },
  ],
};

export default chapter;
