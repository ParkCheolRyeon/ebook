import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "13-cors",
  subject: "network",
  title: "CORS (Cross-Origin Resource Sharing)",
  description: "브라우저의 동일 출처 정책과 CORS의 동작 원리를 이해하고, 프론트엔드 개발에서 자주 마주치는 CORS 오류를 해결하는 방법을 학습합니다.",
  order: 13,
  group: "브라우저 네트워킹",
  prerequisites: ["06-http-headers"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "CORS는 아파트 단지의 출입 관리 시스템과 비슷합니다.\n\n" +
        "**동일 출처 정책(Same-Origin Policy)**은 아파트 주민만 단지 내 시설을 이용할 수 있는 규칙입니다. " +
        "A동 주민이 A동 헬스장을 이용하는 것은 자유롭지만, B동 헬스장에 가려면 별도의 허가가 필요합니다.\n\n" +
        "**CORS**는 이 허가증 발급 시스템입니다. B동 관리실(서버)이 'A동 주민도 출입 가능'이라는 " +
        "허가 목록(Access-Control-Allow-Origin)을 붙여두면, A동 주민(브라우저)이 B동 시설을 이용할 수 있습니다.\n\n" +
        "**Preflight 요청**은 방문 전 전화로 '들어가도 되나요?'라고 미리 확인하는 것입니다. " +
        "특수한 장비(커스텀 헤더)를 가져가거나 특별한 활동(PUT, DELETE)을 하려면 사전 허가가 필수입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 개발을 하다 보면 가장 자주 마주치는 에러 중 하나가 CORS 에러입니다.\n\n" +
        "```\nAccess to fetch at 'https://api.example.com' from origin 'http://localhost:3000'\nhas been blocked by CORS policy\n```\n\n" +
        "이 에러는 왜 발생할까요?\n\n" +
        "1. **보안 위협**: 악의적인 웹사이트가 사용자의 브라우저를 이용해 다른 사이트의 API를 호출하고 데이터를 탈취할 수 있습니다\n" +
        "2. **동일 출처 정책**: 브라우저는 기본적으로 스크립트가 다른 출처(프로토콜 + 도메인 + 포트)의 리소스에 접근하는 것을 차단합니다\n" +
        "3. **개발 환경 불일치**: 프론트엔드(localhost:3000)와 백엔드(localhost:8080)가 다른 포트에서 실행되면 이미 '다른 출처'입니다\n\n" +
        "CORS는 이 제한을 안전하게 완화하는 표준 메커니즘입니다. 서버가 명시적으로 허용한 출처만 리소스에 접근할 수 있게 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 출처(Origin)란?\n" +
        "출처는 `프로토콜 + 도메인 + 포트`의 조합입니다. 이 세 가지 중 하나라도 다르면 '다른 출처'입니다.\n\n" +
        "- `https://example.com` vs `http://example.com` — 프로토콜 다름\n" +
        "- `https://example.com` vs `https://api.example.com` — 도메인 다름\n" +
        "- `http://localhost:3000` vs `http://localhost:8080` — 포트 다름\n\n" +
        "### 단순 요청(Simple Request)\n" +
        "다음 조건을 모두 만족하면 Preflight 없이 바로 요청이 전송됩니다:\n" +
        "- 메서드: GET, HEAD, POST 중 하나\n" +
        "- 헤더: Accept, Content-Type(application/x-www-form-urlencoded, multipart/form-data, text/plain만) 등 안전한 헤더만 사용\n" +
        "- ReadableStream 사용하지 않음\n\n" +
        "### Preflight 요청\n" +
        "단순 요청 조건을 벗어나면 브라우저가 먼저 OPTIONS 메서드로 Preflight 요청을 보냅니다:\n" +
        "- `Access-Control-Request-Method`: 실제 사용할 HTTP 메서드\n" +
        "- `Access-Control-Request-Headers`: 실제 사용할 커스텀 헤더\n\n" +
        "서버가 허용하는 응답을 보내야만 실제 요청이 전송됩니다.\n\n" +
        "### 주요 CORS 응답 헤더\n" +
        "- `Access-Control-Allow-Origin`: 허용할 출처 (`*` 또는 특정 출처)\n" +
        "- `Access-Control-Allow-Methods`: 허용할 HTTP 메서드\n" +
        "- `Access-Control-Allow-Headers`: 허용할 헤더\n" +
        "- `Access-Control-Allow-Credentials`: 쿠키/인증 허용 여부 (true일 때 `*` 불가)\n" +
        "- `Access-Control-Max-Age`: Preflight 결과 캐시 시간(초)\n" +
        "- `Access-Control-Expose-Headers`: JS에서 접근 가능한 응답 헤더\n\n" +
        "### 개발 환경 프록시 해결법\n" +
        "개발 중에는 서버 수정 없이 프록시로 CORS를 우회할 수 있습니다:\n" +
        "- **Vite/Webpack Dev Server Proxy**: 개발 서버가 API 요청을 대신 전달\n" +
        "- **Nginx 리버스 프록시**: 동일 도메인에서 프론트/백엔드를 서빙\n" +
        "- **프로덕션**: 서버에서 올바른 CORS 헤더를 설정하는 것이 정석",
    },
    {
      type: "pseudocode",
      title: "기술 구현: CORS 요청 흐름",
      content:
        "브라우저가 CORS 요청을 처리하는 내부 흐름과, 서버 측 CORS 설정의 핵심 로직을 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          "// 브라우저의 CORS 처리 흐름 (의사코드)\n" +
          "\n" +
          "interface CorsRequest {\n" +
          "  origin: string;\n" +
          "  method: string;\n" +
          "  headers: string[];\n" +
          "  credentials: boolean;\n" +
          "}\n" +
          "\n" +
          "function processCorsRequest(request: CorsRequest): void {\n" +
          "  const isSameOrigin = request.origin === currentPageOrigin;\n" +
          "  if (isSameOrigin) {\n" +
          "    // 동일 출처 → CORS 검사 불필요, 바로 요청\n" +
          "    sendRequest(request);\n" +
          "    return;\n" +
          "  }\n" +
          "\n" +
          "  const isSimple = isSimpleRequest(request);\n" +
          "  if (isSimple) {\n" +
          "    // 단순 요청 → 바로 전송 후 응답 헤더 검사\n" +
          "    const response = sendRequest(request);\n" +
          "    if (!response.headers['Access-Control-Allow-Origin']) {\n" +
          "      throw new CorsError('CORS 헤더 없음');\n" +
          "    }\n" +
          "    return;\n" +
          "  }\n" +
          "\n" +
          "  // Preflight 필요 → OPTIONS 요청 먼저 전송\n" +
          "  const preflight = sendOptions({\n" +
          "    'Access-Control-Request-Method': request.method,\n" +
          "    'Access-Control-Request-Headers': request.headers.join(', '),\n" +
          "    'Origin': request.origin,\n" +
          "  });\n" +
          "\n" +
          "  const allowed = checkPreflightResponse(preflight);\n" +
          "  if (!allowed) {\n" +
          "    throw new CorsError('Preflight 거부됨');\n" +
          "  }\n" +
          "\n" +
          "  // Preflight 통과 → 실제 요청 전송\n" +
          "  sendRequest(request);\n" +
          "}\n" +
          "\n" +
          "function isSimpleRequest(req: CorsRequest): boolean {\n" +
          "  const simpleMethods = ['GET', 'HEAD', 'POST'];\n" +
          "  const safeHeaders = ['accept', 'content-type', 'content-language'];\n" +
          "  const safeContentTypes = [\n" +
          "    'application/x-www-form-urlencoded',\n" +
          "    'multipart/form-data',\n" +
          "    'text/plain',\n" +
          "  ];\n" +
          "\n" +
          "  return (\n" +
          "    simpleMethods.includes(req.method) &&\n" +
          "    req.headers.every(h => safeHeaders.includes(h.toLowerCase())) &&\n" +
          "    safeContentTypes.includes(getContentType(req))\n" +
          "  );\n" +
          "}",
        description: "브라우저는 동일 출처 여부 확인 후, 단순 요청이면 바로 전송하고 아니면 Preflight를 먼저 보낸다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: CORS 설정과 프록시 구성",
      content:
        "프론트엔드에서 CORS 요청을 보내는 방법과, 개발 서버 프록시를 설정하는 실습입니다.",
      code: {
        language: "typescript",
        code:
          "// 1. 기본 fetch — CORS 요청\n" +
          "async function fetchUserData(): Promise<void> {\n" +
          "  try {\n" +
          "    const response = await fetch('https://api.example.com/users', {\n" +
          "      method: 'GET',\n" +
          "      headers: {\n" +
          "        'Content-Type': 'application/json',\n" +
          "        'Authorization': 'Bearer token123', // 커스텀 헤더 → Preflight 발생\n" +
          "      },\n" +
          "    });\n" +
          "    const data = await response.json();\n" +
          "    console.log('사용자 데이터:', data);\n" +
          "  } catch (error) {\n" +
          "    console.error('CORS 에러 가능:', error);\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// 2. credentials 포함 요청 (쿠키 전송)\n" +
          "async function fetchWithCookies(): Promise<void> {\n" +
          "  const response = await fetch('https://api.example.com/me', {\n" +
          "    method: 'GET',\n" +
          "    credentials: 'include', // 쿠키 포함\n" +
          "    // 서버는 Access-Control-Allow-Credentials: true 필요\n" +
          "    // 서버는 Access-Control-Allow-Origin에 * 사용 불가\n" +
          "  });\n" +
          "  return response.json();\n" +
          "}\n" +
          "\n" +
          "// 3. Vite 개발 서버 프록시 설정 (vite.config.ts)\n" +
          "// export default defineConfig({\n" +
          "//   server: {\n" +
          "//     proxy: {\n" +
          "//       '/api': {\n" +
          "//         target: 'https://api.example.com',\n" +
          "//         changeOrigin: true,\n" +
          "//         rewrite: (path) => path.replace(/^\\/api/, ''),\n" +
          "//       },\n" +
          "//     },\n" +
          "//   },\n" +
          "// });\n" +
          "\n" +
          "// 프록시 사용 시 — 동일 출처로 요청\n" +
          "async function fetchViaProxy(): Promise<void> {\n" +
          "  // '/api/users'는 개발 서버가 'https://api.example.com/users'로 전달\n" +
          "  const response = await fetch('/api/users');\n" +
          "  const data = await response.json();\n" +
          "  console.log('프록시 경유 데이터:', data);\n" +
          "}\n" +
          "\n" +
          "// 4. Express 서버 CORS 미들웨어 설정 예시\n" +
          "// import cors from 'cors';\n" +
          "// app.use(cors({\n" +
          "//   origin: ['http://localhost:3000', 'https://myapp.com'],\n" +
          "//   methods: ['GET', 'POST', 'PUT', 'DELETE'],\n" +
          "//   credentials: true,\n" +
          "//   maxAge: 86400, // Preflight 캐시 24시간\n" +
          "// }));",
        description: "credentials 모드, 개발 서버 프록시, 서버 측 CORS 미들웨어 설정을 모두 다룬다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 구분 | 단순 요청 | Preflight 요청 |\n" +
        "|------|-----------|----------------|\n" +
        "| 메서드 | GET, HEAD, POST | PUT, DELETE, PATCH 등 |\n" +
        "| 헤더 | 안전한 헤더만 | 커스텀 헤더 포함 |\n" +
        "| Content-Type | form/text만 | application/json 등 |\n" +
        "| OPTIONS | 불필요 | 필수 |\n\n" +
        "**핵심 포인트:**\n" +
        "- 동일 출처 = 프로토콜 + 도메인 + 포트가 모두 같아야 함\n" +
        "- CORS는 **브라우저**가 강제하는 정책이다 (서버 간 통신에는 적용 안 됨)\n" +
        "- `credentials: 'include'` 시 `Access-Control-Allow-Origin: *` 사용 불가\n" +
        "- 개발 시 프록시, 프로덕션 시 서버 CORS 설정이 정석\n" +
        "- `Access-Control-Max-Age`로 Preflight 캐싱하여 성능 개선 가능\n\n" +
        "**다음 챕터 미리보기:** 쿠키, 세션, 토큰을 배우면서 인증 정보가 CORS와 어떻게 상호작용하는지 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "CORS는 브라우저가 다른 출처의 리소스 접근을 제어하는 보안 메커니즘이며, 서버의 Access-Control-Allow-* 헤더로 허용 범위를 설정한다.",
  checklist: [
    "동일 출처 정책이 무엇이고 왜 필요한지 설명할 수 있다",
    "단순 요청과 Preflight 요청의 차이를 구분할 수 있다",
    "주요 Access-Control-* 헤더의 역할을 설명할 수 있다",
    "credentials 모드에서 와일드카드(*)를 쓸 수 없는 이유를 이해한다",
    "개발 서버 프록시로 CORS 문제를 해결하는 방법을 알고 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "다음 중 '같은 출처(Same-Origin)'로 판단되는 조합은?",
      choices: [
        "http://example.com과 https://example.com",
        "https://example.com:443과 https://example.com",
        "https://example.com과 https://api.example.com",
        "http://localhost:3000과 http://localhost:8080",
      ],
      correctIndex: 1,
      explanation: "HTTPS의 기본 포트는 443이므로 https://example.com:443과 https://example.com은 동일 출처입니다. 프로토콜, 도메인, 포트가 모두 같아야 같은 출처입니다.",
    },
    {
      id: "q2",
      question: "Preflight 요청이 발생하지 않는 경우는?",
      choices: [
        "Content-Type이 application/json인 POST 요청",
        "Authorization 헤더가 포함된 GET 요청",
        "Content-Type이 text/plain인 POST 요청",
        "DELETE 메서드 요청",
      ],
      correctIndex: 2,
      explanation: "GET/HEAD/POST 메서드에 안전한 헤더만 사용하고, Content-Type이 text/plain, multipart/form-data, application/x-www-form-urlencoded 중 하나이면 단순 요청으로 분류됩니다.",
    },
    {
      id: "q3",
      question: "credentials: 'include'로 요청할 때 서버가 반드시 지켜야 할 규칙은?",
      choices: [
        "Access-Control-Allow-Origin을 *로 설정해야 한다",
        "Access-Control-Allow-Origin에 구체적인 출처를 명시해야 한다",
        "Access-Control-Allow-Methods를 생략해야 한다",
        "Preflight 요청을 거부해야 한다",
      ],
      correctIndex: 1,
      explanation: "credentials가 include일 때 Access-Control-Allow-Origin에 와일드카드(*)를 사용할 수 없습니다. 구체적인 출처(예: https://myapp.com)를 명시해야 합니다.",
    },
    {
      id: "q4",
      question: "CORS 정책을 강제하는 주체는?",
      choices: [
        "서버",
        "브라우저",
        "DNS 서버",
        "프록시 서버",
      ],
      correctIndex: 1,
      explanation: "CORS는 브라우저가 강제하는 정책입니다. 서버는 허용 헤더를 응답에 포함할 뿐이고, 실제로 요청을 차단하는 것은 브라우저입니다. 서버 간 통신(curl 등)에는 CORS가 적용되지 않습니다.",
    },
    {
      id: "q5",
      question: "개발 환경에서 CORS 문제를 프록시로 해결하는 원리는?",
      choices: [
        "브라우저의 CORS 검사를 비활성화한다",
        "서버에 CORS 헤더를 자동으로 추가한다",
        "요청을 동일 출처로 보내고 개발 서버가 대신 전달한다",
        "Preflight 요청을 자동으로 승인한다",
      ],
      correctIndex: 2,
      explanation: "개발 서버 프록시는 브라우저의 요청을 동일 출처(localhost)에서 받아서 실제 API 서버로 전달합니다. 브라우저 입장에서는 동일 출처 요청이므로 CORS 검사가 발생하지 않습니다.",
    },
  ],
};

export default chapter;
