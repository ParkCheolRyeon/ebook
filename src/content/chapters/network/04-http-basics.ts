import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "04-http-basics",
  subject: "network",
  title: "HTTP 프로토콜 기본",
  description: "웹 통신의 핵심인 HTTP 프로토콜의 요청/응답 구조, 무상태성, URL 구조, 그리고 다양한 요청 본문 형식을 학습합니다.",
  order: 4,
  group: "HTTP",
  prerequisites: ["03-tcp-udp"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "HTTP는 **레스토랑 주문 시스템**과 같습니다.\n\n" +
        "1. 손님(클라이언트)이 메뉴판을 보고 **주문서를 작성**합니다 (HTTP 요청)\n" +
        "2. 주문서에는 **무엇을 원하는지**(메서드: GET, POST), **어떤 메뉴인지**(URL), **특별 요청사항**(헤더: 알레르기 정보, 선호도)이 적혀있습니다\n" +
        "3. 웨이터(네트워크)가 주문서를 주방(서버)에 전달합니다\n" +
        "4. 주방이 음식과 함께 **응답**을 보냅니다: 상태(성공/실패), 음식(응답 본문)\n\n" +
        "중요한 점: 웨이터는 **기억력이 없습니다**(무상태, Stateless). 같은 손님이 두 번째 주문을 해도, 첫 번째 주문을 기억하지 못합니다. " +
        "단골 인식이 필요하면 **회원카드**(쿠키/토큰)를 매번 보여줘야 합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 개발자가 HTTP를 제대로 이해하지 못하면 다음 문제를 겪게 됩니다:\n\n" +
        "1. **요청이 왜 실패하는지 모름** — Content-Type을 잘못 설정하거나 본문 형식이 틀린 경우\n" +
        "2. **파일 업로드가 안 됨** — JSON으로 보내야 하는지, FormData로 보내야 하는지 혼란\n" +
        "3. **쿼리 파라미터 vs 요청 본문** — 데이터를 어디에 넣어야 하는지 모름\n" +
        "4. **무상태성의 의미** — 로그인 상태를 서버가 왜 기억하지 못하는지 혼란\n" +
        "5. **HTTP 버전 차이** — HTTP/1.1, HTTP/2, HTTP/3의 차이를 설명 못함\n\n" +
        "HTTP의 기본 구조를 확실히 이해하면 API 통신의 대부분의 문제를 해결할 수 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### HTTP 요청 구조\n\n" +
        "```\n" +
        "GET /users?page=1 HTTP/1.1        ← 요청 라인 (메서드, 경로, 버전)\n" +
        "Host: api.example.com              ← 헤더\n" +
        "Accept: application/json\n" +
        "Authorization: Bearer token123\n" +
        "                                   ← 빈 줄 (헤더와 본문 구분)\n" +
        "[요청 본문]                          ← 본문 (POST, PUT 등에서 사용)\n" +
        "```\n\n" +
        "### HTTP 응답 구조\n\n" +
        "```\n" +
        "HTTP/1.1 200 OK                    ← 상태 라인 (버전, 상태코드, 설명)\n" +
        "Content-Type: application/json     ← 응답 헤더\n" +
        "Content-Length: 256\n" +
        "                                   ← 빈 줄\n" +
        "{\"users\": [...]}                   ← 응답 본문\n" +
        "```\n\n" +
        "### URL 구조\n\n" +
        "`https://api.example.com:443/users/1?fields=name,email&sort=name#section1`\n\n" +
        "- **프로토콜**: `https://`\n" +
        "- **호스트**: `api.example.com`\n" +
        "- **포트**: `:443`\n" +
        "- **경로**: `/users/1`\n" +
        "- **쿼리 문자열**: `?fields=name,email&sort=name`\n" +
        "- **프래그먼트**: `#section1` (서버로 전송되지 않음)\n\n" +
        "### 요청 본문 형식\n\n" +
        "1. **JSON** (`application/json`): 가장 일반적인 API 데이터 형식\n" +
        "2. **FormData** (`multipart/form-data`): 파일 업로드에 사용\n" +
        "3. **URL-encoded** (`application/x-www-form-urlencoded`): HTML 폼 기본\n\n" +
        "### 무상태성 (Stateless)\n\n" +
        "HTTP는 각 요청이 **독립적**입니다. 서버는 이전 요청을 기억하지 않습니다. " +
        "인증 정보를 유지하려면 매 요청마다 쿠키나 토큰을 함께 보내야 합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: HTTP 요청/응답 파서",
      content:
        "HTTP 메시지의 구조를 파싱하는 코드를 통해 요청/응답 형식을 정확히 이해합니다.",
      code: {
        language: "typescript",
        code:
          '// HTTP 요청 메시지 구조를 타입으로 표현\n' +
          'interface HttpRequest {\n' +
          '  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";\n' +
          '  path: string;\n' +
          '  version: string;\n' +
          '  headers: Record<string, string>;\n' +
          '  body?: string;\n' +
          '}\n' +
          '\n' +
          'interface HttpResponse {\n' +
          '  version: string;\n' +
          '  statusCode: number;\n' +
          '  statusText: string;\n' +
          '  headers: Record<string, string>;\n' +
          '  body?: string;\n' +
          '}\n' +
          '\n' +
          '// HTTP 요청 메시지를 문자열로 직렬화\n' +
          'function serializeRequest(req: HttpRequest): string {\n' +
          '  let message = `${req.method} ${req.path} ${req.version}\\r\\n`;\n' +
          '\n' +
          '  for (const [key, value] of Object.entries(req.headers)) {\n' +
          '    message += `${key}: ${value}\\r\\n`;\n' +
          '  }\n' +
          '\n' +
          '  message += "\\r\\n"; // 헤더와 본문 사이 빈 줄\n' +
          '\n' +
          '  if (req.body) {\n' +
          '    message += req.body;\n' +
          '  }\n' +
          '\n' +
          '  return message;\n' +
          '}\n' +
          '\n' +
          '// 사용 예시\n' +
          'const request: HttpRequest = {\n' +
          '  method: "POST",\n' +
          '  path: "/api/users",\n' +
          '  version: "HTTP/1.1",\n' +
          '  headers: {\n' +
          '    "Host": "api.example.com",\n' +
          '    "Content-Type": "application/json",\n' +
          '    "Authorization": "Bearer token123",\n' +
          '  },\n' +
          '  body: JSON.stringify({ name: "홍길동", email: "hong@example.com" }),\n' +
          '};\n' +
          '\n' +
          'console.log(serializeRequest(request));\n' +
          '// POST /api/users HTTP/1.1\n' +
          '// Host: api.example.com\n' +
          '// Content-Type: application/json\n' +
          '// Authorization: Bearer token123\n' +
          '//\n' +
          '// {"name":"홍길동","email":"hong@example.com"}',
        description: "HTTP 메시지는 요청 라인(또는 상태 라인) + 헤더 + 빈 줄 + 본문으로 구성됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: fetch API로 다양한 형식의 요청 보내기",
      content:
        "JSON, FormData, URL-encoded 등 다양한 형식으로 HTTP 요청을 보내는 실제 패턴을 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// 1. JSON 요청 (가장 일반적)\n' +
          'async function sendJSON() {\n' +
          '  const response = await fetch("https://api.example.com/users", {\n' +
          '    method: "POST",\n' +
          '    headers: {\n' +
          '      "Content-Type": "application/json",\n' +
          '    },\n' +
          '    body: JSON.stringify({\n' +
          '      name: "홍길동",\n' +
          '      email: "hong@example.com",\n' +
          '    }),\n' +
          '  });\n' +
          '  return response.json();\n' +
          '}\n' +
          '\n' +
          '// 2. FormData 요청 (파일 업로드)\n' +
          'async function uploadFile(file: File) {\n' +
          '  const formData = new FormData();\n' +
          '  formData.append("avatar", file);\n' +
          '  formData.append("username", "홍길동");\n' +
          '\n' +
          '  // FormData를 보낼 때는 Content-Type을 직접 설정하지 않습니다!\n' +
          '  // 브라우저가 자동으로 multipart/form-data + boundary를 설정합니다\n' +
          '  const response = await fetch("https://api.example.com/upload", {\n' +
          '    method: "POST",\n' +
          '    body: formData,\n' +
          '  });\n' +
          '  return response.json();\n' +
          '}\n' +
          '\n' +
          '// 3. URL-encoded 요청 (레거시 폼 호환)\n' +
          'async function sendUrlEncoded() {\n' +
          '  const params = new URLSearchParams();\n' +
          '  params.append("username", "홍길동");\n' +
          '  params.append("password", "secret123");\n' +
          '\n' +
          '  const response = await fetch("https://api.example.com/login", {\n' +
          '    method: "POST",\n' +
          '    headers: {\n' +
          '      "Content-Type": "application/x-www-form-urlencoded",\n' +
          '    },\n' +
          '    body: params.toString(),\n' +
          '    // body: "username=%ED%99%8D%EA%B8%B8%EB%8F%99&password=secret123"\n' +
          '  });\n' +
          '  return response.json();\n' +
          '}\n' +
          '\n' +
          '// 4. 쿼리 파라미터 활용 (GET 요청)\n' +
          'async function searchUsers(query: string, page: number) {\n' +
          '  const params = new URLSearchParams({\n' +
          '    q: query,\n' +
          '    page: String(page),\n' +
          '    limit: "20",\n' +
          '  });\n' +
          '\n' +
          '  const response = await fetch(\n' +
          '    `https://api.example.com/users/search?${params}`\n' +
          '  );\n' +
          '  return response.json();\n' +
          '}',
        description: "Content-Type에 따라 요청 본문 형식이 달라집니다. FormData는 Content-Type을 직접 설정하면 안 됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### HTTP 기본 구조\n" +
        "- HTTP 메시지는 **시작 라인 + 헤더 + 빈 줄 + 본문**으로 구성됩니다\n" +
        "- 요청: `메서드 경로 버전` / 응답: `버전 상태코드 설명`\n\n" +
        "### 무상태성\n" +
        "- 각 HTTP 요청은 **독립적**이며, 서버는 이전 요청을 기억하지 않습니다\n" +
        "- 상태 유지가 필요하면 쿠키, 세션, 토큰 등을 사용합니다\n\n" +
        "### 요청 본문 형식\n" +
        "- **JSON** (`application/json`): API 통신의 표준\n" +
        "- **FormData** (`multipart/form-data`): 파일 업로드 시 사용, Content-Type 자동 설정\n" +
        "- **URL-encoded** (`application/x-www-form-urlencoded`): HTML 폼 기본 형식\n\n" +
        "### URL 구조\n" +
        "- 프로토콜, 호스트, 포트, 경로, 쿼리 문자열, 프래그먼트로 구성됩니다\n" +
        "- `URLSearchParams`와 `URL` 객체를 활용하면 안전하게 URL을 다룰 수 있습니다\n\n" +
        "**다음 챕터 미리보기:** HTTP 메서드(GET, POST 등)와 상태 코드(200, 404 등)를 상세히 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "HTTP는 요청-응답 기반의 무상태 프로토콜이다. 요청 본문은 JSON, FormData, URL-encoded 중 용도에 맞게 선택하고, Content-Type 헤더를 올바르게 설정해야 한다.",
  checklist: [
    "HTTP 요청과 응답의 구조(시작 라인, 헤더, 본문)를 설명할 수 있다",
    "HTTP의 무상태성(Stateless)이 무엇인지 이해한다",
    "JSON, FormData, URL-encoded 방식의 차이와 용도를 안다",
    "URL의 각 구성 요소(프로토콜, 호스트, 경로, 쿼리 등)를 구분할 수 있다",
    "fetch API로 다양한 형식의 HTTP 요청을 보낼 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "HTTP가 무상태(Stateless) 프로토콜이라는 것의 의미는?",
      choices: [
        "HTTP는 암호화를 사용하지 않는다",
        "서버가 각 요청을 독립적으로 처리하고 이전 요청을 기억하지 않는다",
        "HTTP 연결은 한 번만 사용되고 바로 끊긴다",
        "클라이언트가 서버의 상태를 변경할 수 없다",
      ],
      correctIndex: 1,
      explanation: "무상태성은 서버가 클라이언트의 이전 요청 상태를 저장하지 않는다는 뜻입니다. 인증 정보를 유지하려면 매 요청마다 쿠키나 토큰을 보내야 합니다.",
    },
    {
      id: "q2",
      question: "파일을 업로드할 때 사용해야 하는 Content-Type은?",
      choices: [
        "application/json",
        "application/x-www-form-urlencoded",
        "multipart/form-data",
        "text/plain",
      ],
      correctIndex: 2,
      explanation: "파일 업로드는 multipart/form-data를 사용합니다. FormData 객체를 사용하면 브라우저가 자동으로 이 Content-Type과 boundary를 설정합니다.",
    },
    {
      id: "q3",
      question: "FormData를 fetch로 전송할 때 Content-Type 헤더를 직접 설정하면 안 되는 이유는?",
      choices: [
        "서버가 거부하기 때문",
        "브라우저가 자동으로 boundary를 포함한 Content-Type을 설정해야 하기 때문",
        "FormData는 헤더가 필요 없기 때문",
        "Content-Type이 자동으로 application/json으로 설정되기 때문",
      ],
      correctIndex: 1,
      explanation: "multipart/form-data는 각 파트를 구분하는 고유한 boundary 문자열이 필요합니다. 브라우저가 이를 자동 생성하여 Content-Type에 포함시킵니다.",
    },
    {
      id: "q4",
      question: "URL의 프래그먼트(#section)에 대한 설명으로 올바른 것은?",
      choices: [
        "서버에 전송되어 처리된다",
        "쿼리 파라미터와 동일하게 동작한다",
        "서버로 전송되지 않고 클라이언트에서만 사용된다",
        "HTTP 헤더에 포함되어 전송된다",
      ],
      correctIndex: 2,
      explanation: "프래그먼트(#)는 서버에 전송되지 않습니다. 브라우저에서 페이지 내 특정 위치로 스크롤하거나, SPA에서 클라이언트 라우팅에 사용됩니다.",
    },
    {
      id: "q5",
      question: "GET 요청에서 데이터를 전달하는 올바른 방법은?",
      choices: [
        "요청 본문(body)에 JSON으로 전달",
        "URL의 쿼리 파라미터로 전달",
        "요청 헤더에 담아 전달",
        "FormData로 전달",
      ],
      correctIndex: 1,
      explanation: "GET 요청은 일반적으로 요청 본문을 포함하지 않습니다. 데이터는 URL의 쿼리 파라미터(?key=value)로 전달합니다.",
    },
  ],
};

export default chapter;
