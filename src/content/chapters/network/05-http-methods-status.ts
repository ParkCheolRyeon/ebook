import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "05-http-methods-status",
  subject: "network",
  title: "HTTP 메서드와 상태 코드",
  description: "HTTP 메서드(GET, POST, PUT, PATCH, DELETE)의 의미와 멱등성, 그리고 1xx~5xx 상태 코드의 의미를 상세히 학습합니다.",
  order: 5,
  group: "HTTP",
  prerequisites: ["04-http-basics"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "HTTP 메서드는 **도서관 사서에게 하는 요청**과 같습니다.\n\n" +
        "- **GET**: \"이 책 좀 보여주세요\" — 책을 읽기만 하고, 도서관은 변하지 않습니다 (안전, 멱등)\n" +
        "- **POST**: \"이 새 책을 등록해주세요\" — 도서관에 새 책이 추가됩니다. 같은 요청을 두 번 하면 두 권이 등록됩니다 (비멱등)\n" +
        "- **PUT**: \"123번 서가에 이 책을 넣어주세요\" — 기존 책을 **통째로 교체**합니다. 여러 번 해도 결과가 같습니다 (멱등)\n" +
        "- **PATCH**: \"123번 책의 저자명만 수정해주세요\" — 기존 책의 **일부만** 수정합니다\n" +
        "- **DELETE**: \"123번 책을 폐기해주세요\" — 여러 번 요청해도 결과는 같습니다 (멱등)\n" +
        "- **HEAD**: \"이 책의 표지 정보만 보여주세요\" — GET과 동일하지만 본문 없이 헤더만 반환합니다\n" +
        "- **OPTIONS**: \"이 도서관에서 어떤 업무를 할 수 있나요?\" — CORS 프리플라이트 요청에 사용됩니다\n\n" +
        "**상태 코드**는 사서의 **대답**입니다:\n" +
        "- **200**: \"여기 있습니다\" (성공)\n" +
        "- **404**: \"그런 책은 없습니다\" (못 찾음)\n" +
        "- **500**: \"도서관 시스템이 고장났습니다\" (서버 오류)",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 개발에서 HTTP 메서드와 상태 코드를 정확히 이해하지 못하면:\n\n" +
        "1. **PUT vs PATCH 혼용** — 전체 교체와 부분 수정의 차이를 모르면 데이터 손실 발생\n" +
        "2. **멱등성 미이해** — 네트워크 오류 시 재시도해도 되는 요청인지 판단 불가\n" +
        "3. **상태 코드 무시** — 모든 에러를 동일하게 처리하여 사용자에게 부정확한 메시지 표시\n" +
        "4. **401 vs 403 혼동** — 인증 실패와 권한 부족의 차이를 구분 못함\n" +
        "5. **304 Not Modified** — 캐시 관련 상태 코드를 모르면 불필요한 데이터 재전송\n\n" +
        "올바른 메서드 사용은 RESTful API 설계의 기본이며, 상태 코드 이해는 견고한 에러 처리의 핵심입니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### HTTP 메서드\n\n" +
        "| 메서드 | 용도 | 안전 | 멱등 | 요청 본문 |\n" +
        "|--------|------|------|------|----------|\n" +
        "| GET | 리소스 조회 | O | O | 없음 |\n" +
        "| POST | 리소스 생성 | X | X | 있음 |\n" +
        "| PUT | 리소스 전체 교체 | X | O | 있음 |\n" +
        "| PATCH | 리소스 부분 수정 | X | X | 있음 |\n" +
        "| DELETE | 리소스 삭제 | X | O | 일반적으로 없음 |\n| HEAD | 헤더만 조회 | O | O | 없음 |\n| OPTIONS | 허용 메서드 확인 | O | O | 없음 |\n\n" +
        "**안전(Safe)**: 서버 상태를 변경하지 않음\n" +
        "**멱등(Idempotent)**: 같은 요청을 여러 번 해도 결과가 동일\n\n" +
        "### 상태 코드 분류\n\n" +
        "**1xx (정보)**: 요청을 받았으며 처리 중\n" +
        "- `100 Continue`: 요청 계속 진행\n" +
        "- `101 Switching Protocols`: WebSocket 업그레이드 시 사용\n\n" +
        "**2xx (성공)**:\n" +
        "- `200 OK`: 요청 성공\n" +
        "- `201 Created`: 리소스 생성 성공 (POST)\n" +
        "- `204 No Content`: 성공했지만 응답 본문 없음 (DELETE)\n\n" +
        "**3xx (리다이렉션)**:\n" +
        "- `301 Moved Permanently`: 영구 이동 (SEO에 중요)\n" +
        "- `302 Found`: 임시 이동\n" +
        "- `304 Not Modified`: 캐시 사용 (변경 없음)\n\n" +
        "**4xx (클라이언트 에러)**:\n" +
        "- `400 Bad Request`: 잘못된 요청 형식\n" +
        "- `401 Unauthorized`: 인증 필요 (로그인 안 됨)\n" +
        "- `403 Forbidden`: 권한 없음 (로그인은 됐지만 접근 불가)\n" +
        "- `404 Not Found`: 리소스를 찾을 수 없음\n" +
        "- `409 Conflict`: 충돌 (동시 수정 등)\n" +
        "- `429 Too Many Requests`: 요청 횟수 초과 (Rate Limit)\n\n" +
        "**5xx (서버 에러)**:\n" +
        "- `500 Internal Server Error`: 서버 내부 오류\n" +
        "- `502 Bad Gateway`: 게이트웨이/프록시 오류\n" +
        "- `503 Service Unavailable`: 서버 일시적 불가 (점검 중)",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 상태 코드 기반 에러 핸들링",
      content:
        "HTTP 상태 코드에 따라 적절한 에러 처리를 수행하는 유틸리티를 설계합니다.",
      code: {
        language: "typescript",
        code:
          '// HTTP 에러 처리 유틸리티\n' +
          '\n' +
          'class HttpError extends Error {\n' +
          '  constructor(\n' +
          '    public status: number,\n' +
          '    public statusText: string,\n' +
          '    public body?: unknown\n' +
          '  ) {\n' +
          '    super(`HTTP ${status}: ${statusText}`);\n' +
          '    this.name = "HttpError";\n' +
          '  }\n' +
          '\n' +
          '  get isClientError(): boolean {\n' +
          '    return this.status >= 400 && this.status < 500;\n' +
          '  }\n' +
          '\n' +
          '  get isServerError(): boolean {\n' +
          '    return this.status >= 500;\n' +
          '  }\n' +
          '\n' +
          '  get isRetryable(): boolean {\n' +
          '    // 서버 에러와 429는 재시도 가능\n' +
          '    return this.isServerError || this.status === 429;\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// 상태 코드별 분기 처리\n' +
          'function handleHttpError(error: HttpError): string {\n' +
          '  switch (error.status) {\n' +
          '    case 400:\n' +
          '      return "요청 형식이 올바르지 않습니다. 입력 내용을 확인해주세요.";\n' +
          '    case 401:\n' +
          '      // 로그인 페이지로 리다이렉트\n' +
          '      return "로그인이 필요합니다.";\n' +
          '    case 403:\n' +
          '      return "이 작업을 수행할 권한이 없습니다.";\n' +
          '    case 404:\n' +
          '      return "요청한 리소스를 찾을 수 없습니다.";\n' +
          '    case 409:\n' +
          '      return "다른 사용자가 동시에 수정했습니다. 새로고침 후 다시 시도해주세요.";\n' +
          '    case 429:\n' +
          '      return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";\n' +
          '    case 500:\n' +
          '      return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";\n' +
          '    case 502:\n' +
          '    case 503:\n' +
          '      return "서비스가 일시적으로 불가합니다. 잠시 후 다시 시도해주세요.";\n' +
          '    default:\n' +
          '      return `오류가 발생했습니다. (${error.status})`;\n' +
          '  }\n' +
          '}',
        description: "상태 코드를 분류하여 사용자에게 적절한 메시지를 표시하고, 재시도 가능 여부를 판단합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 재시도 로직이 포함된 fetch 래퍼",
      content:
        "실무에서 사용할 수 있는 HTTP 요청 래퍼를 구현합니다. 멱등한 메서드는 자동 재시도하고, 상태 코드에 따라 적절히 처리합니다.",
      code: {
        language: "typescript",
        code:
          '// 재시도 로직이 포함된 fetch 래퍼\n' +
          '\n' +
          'interface FetchOptions extends RequestInit {\n' +
          '  maxRetries?: number;\n' +
          '  retryDelay?: number;\n' +
          '}\n' +
          '\n' +
          'const IDEMPOTENT_METHODS = new Set(["GET", "PUT", "DELETE", "HEAD", "OPTIONS"]);\n' +
          '\n' +
          'async function fetchWithRetry(\n' +
          '  url: string,\n' +
          '  options: FetchOptions = {}\n' +
          '): Promise<Response> {\n' +
          '  const { maxRetries = 3, retryDelay = 1000, ...fetchOptions } = options;\n' +
          '  const method = (fetchOptions.method || "GET").toUpperCase();\n' +
          '  const canRetry = IDEMPOTENT_METHODS.has(method);\n' +
          '\n' +
          '  for (let attempt = 0; attempt <= maxRetries; attempt++) {\n' +
          '    try {\n' +
          '      const response = await fetch(url, fetchOptions);\n' +
          '\n' +
          '      // 2xx 성공\n' +
          '      if (response.ok) return response;\n' +
          '\n' +
          '      // 재시도 가능한 에러 (5xx, 429)\n' +
          '      if ((response.status >= 500 || response.status === 429) && canRetry && attempt < maxRetries) {\n' +
          '        const delay = response.status === 429\n' +
          '          ? parseInt(response.headers.get("Retry-After") || "0") * 1000 || retryDelay\n' +
          '          : retryDelay * Math.pow(2, attempt); // 지수 백오프\n' +
          '        console.log(`재시도 ${attempt + 1}/${maxRetries} (${delay}ms 후)`);\n' +
          '        await new Promise(resolve => setTimeout(resolve, delay));\n' +
          '        continue;\n' +
          '      }\n' +
          '\n' +
          '      // 재시도 불가능한 에러\n' +
          '      const body = await response.json().catch(() => null);\n' +
          '      throw new Error(`HTTP ${response.status}: ${response.statusText}`);\n' +
          '    } catch (error) {\n' +
          '      // 네트워크 오류 (오프라인 등)\n' +
          '      if (error instanceof TypeError && canRetry && attempt < maxRetries) {\n' +
          '        const delay = retryDelay * Math.pow(2, attempt);\n' +
          '        console.log(`네트워크 오류, 재시도 ${attempt + 1}/${maxRetries}`);\n' +
          '        await new Promise(resolve => setTimeout(resolve, delay));\n' +
          '        continue;\n' +
          '      }\n' +
          '      throw error;\n' +
          '    }\n' +
          '  }\n' +
          '\n' +
          '  throw new Error("최대 재시도 횟수 초과");\n' +
          '}\n' +
          '\n' +
          '// 사용 예시\n' +
          '// GET: 멱등이므로 자동 재시도\n' +
          'const users = await fetchWithRetry("/api/users");\n' +
          '\n' +
          '// POST: 비멱등이므로 재시도하지 않음\n' +
          'const newUser = await fetchWithRetry("/api/users", {\n' +
          '  method: "POST",\n' +
          '  headers: { "Content-Type": "application/json" },\n' +
          '  body: JSON.stringify({ name: "홍길동" }),\n' +
          '});',
        description: "멱등한 메서드(GET, PUT, DELETE)는 자동 재시도하고, 비멱등 메서드(POST)는 재시도하지 않습니다. 지수 백오프로 서버 부하를 줄입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### HTTP 메서드\n" +
        "- **GET**: 조회 (안전, 멱등)\n" +
        "- **POST**: 생성 (비안전, 비멱등) — 같은 요청을 두 번 보내면 두 개 생성\n" +
        "- **PUT**: 전체 교체 (비안전, 멱등)\n" +
        "- **PATCH**: 부분 수정 (비안전, 일반적으로 비멱등이지만 구현에 따라 멱등 가능 — RFC 5789)\n" +
        "- **DELETE**: 삭제 (비안전, 멱등)\n\n" +
        "### 상태 코드\n" +
        "- **2xx**: 성공 (200 OK, 201 Created, 204 No Content)\n" +
        "- **3xx**: 리다이렉션 (301 영구, 302 임시, 304 캐시)\n" +
        "- **4xx**: 클라이언트 에러 (400 잘못된 요청, 401 인증 필요, 403 권한 없음, 404 없음)\n" +
        "- **5xx**: 서버 에러 (500 내부 오류, 502 게이트웨이, 503 서비스 불가)\n\n" +
        "### 실무 팁\n" +
        "- 멱등한 요청은 네트워크 오류 시 안전하게 재시도할 수 있습니다\n" +
        "- 401과 403을 정확히 구분하여 적절한 UI를 보여주세요\n" +
        "- 429 응답의 `Retry-After` 헤더를 참고하여 재시도 시점을 결정하세요\n\n" +
        "**다음 챕터 미리보기:** Content-Type, Authorization, Cache-Control 등 HTTP 헤더를 심화 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "HTTP 메서드는 리소스에 대한 동작을 정의하며, 멱등성을 이해해야 안전한 재시도가 가능하다. 상태 코드는 요청 결과를 분류하며, 코드별로 적절한 에러 처리를 구현해야 한다.",
  checklist: [
    "GET, POST, PUT, PATCH, DELETE의 의미와 차이를 설명할 수 있다",
    "멱등성과 안전 메서드의 개념을 이해한다",
    "주요 상태 코드(200, 201, 301, 304, 400, 401, 403, 404, 500)의 의미를 안다",
    "401(인증 필요)과 403(권한 없음)의 차이를 구분할 수 있다",
    "상태 코드에 따른 적절한 에러 처리와 재시도 로직을 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "다음 중 멱등(Idempotent)한 HTTP 메서드를 모두 고르면?",
      choices: [
        "GET, POST, DELETE",
        "GET, PUT, DELETE",
        "POST, PUT, PATCH",
        "GET, POST, PUT, DELETE",
      ],
      correctIndex: 1,
      explanation: "GET, PUT, DELETE는 멱등합니다. 같은 요청을 여러 번 보내도 결과가 동일합니다. POST는 매번 새 리소스를 생성하므로 비멱등합니다.",
    },
    {
      id: "q2",
      question: "로그인한 사용자가 관리자 전용 페이지에 접근할 때 적절한 상태 코드는?",
      choices: ["400 Bad Request", "401 Unauthorized", "403 Forbidden", "404 Not Found"],
      correctIndex: 2,
      explanation: "403 Forbidden은 인증은 됐지만 권한이 없는 경우에 사용합니다. 401은 인증 자체가 되지 않은 경우(로그인 안 됨)입니다.",
    },
    {
      id: "q3",
      question: "PUT과 PATCH의 가장 큰 차이점은?",
      choices: [
        "PUT은 생성, PATCH는 수정에 사용된다",
        "PUT은 리소스를 전체 교체하고, PATCH는 부분 수정한다",
        "PUT은 멱등이고, PATCH도 멱등이다",
        "PUT은 GET과 같고, PATCH는 POST와 같다",
      ],
      correctIndex: 1,
      explanation: "PUT은 리소스를 통째로 교체(누락된 필드는 삭제)하고, PATCH는 지정한 필드만 수정합니다.",
    },
    {
      id: "q4",
      question: "HTTP 304 Not Modified 응답의 의미는?",
      choices: [
        "요청이 성공적으로 수정되었다",
        "클라이언트의 캐시가 유효하므로 본문 없이 캐시를 사용하라는 의미",
        "리소스가 영구적으로 이동되었다",
        "서버에서 요청을 거부했다",
      ],
      correctIndex: 1,
      explanation: "304는 ETag나 Last-Modified를 이용한 조건부 요청에서 리소스가 변경되지 않았을 때 반환됩니다. 클라이언트는 기존 캐시를 사용합니다.",
    },
    {
      id: "q5",
      question: "네트워크 오류가 발생했을 때 POST 요청을 자동 재시도하면 안 되는 이유는?",
      choices: [
        "POST는 서버에서 지원하지 않기 때문",
        "POST는 비멱등이므로 재시도하면 리소스가 중복 생성될 수 있기 때문",
        "POST 요청은 항상 실패하기 때문",
        "POST는 GET보다 느리기 때문",
      ],
      correctIndex: 1,
      explanation: "POST는 비멱등이므로 서버가 요청을 이미 처리했지만 응답만 실패한 경우, 재시도하면 리소스가 두 번 생성될 수 있습니다.",
    },
  ],
};

export default chapter;
