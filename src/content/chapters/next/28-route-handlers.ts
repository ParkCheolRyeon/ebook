import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "28-route-handlers",
  subject: "next",
  title: "Route Handlers (API)",
  description:
    "app/api/ 디렉토리의 route.ts, HTTP 메서드별 핸들러, NextRequest/NextResponse, 동적 라우트, 스트리밍 응답, CORS 설정, Route Handlers vs Server Actions 선택 기준을 학습합니다.",
  order: 28,
  group: "API와 백엔드",
  prerequisites: ["27-env-security"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Route Handlers는 **레스토랑의 서빙 카운터**입니다.\n\n" +
        "레스토랑에서 손님(클라이언트)이 음식을 주문하는 방법은 두 가지입니다. " +
        "하나는 **테이블에서 직접 주문**(Server Actions) — 웨이터가 바로 주방에 전달하고 음식을 가져다줍니다. " +
        "같은 레스토랑 안에서 일어나는 간편한 주문 방식입니다.\n\n" +
        "다른 하나는 **서빙 카운터**(Route Handlers)입니다. 카운터에는 메뉴판이 있고, " +
        "GET(조회), POST(주문), PUT(변경), DELETE(취소) 같은 요청을 받습니다. " +
        "같은 레스토랑 손님뿐 아니라 **배달 앱**(외부 클라이언트), **다른 레스토랑**(외부 서비스)도 " +
        "이 카운터를 통해 주문할 수 있습니다.\n\n" +
        "Route Handlers의 주소 체계는 `app/api/` 아래에 폴더를 만드는 방식입니다. " +
        "`app/api/menu/route.ts`는 `/api/menu` 카운터가 되고, " +
        "`app/api/orders/[id]/route.ts`는 특정 주문 번호로 조회하는 카운터가 됩니다. " +
        "각 카운터(route.ts)에서 GET, POST 등을 export하면 해당 HTTP 메서드를 처리합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "풀스택 Next.js 앱에서 **API 엔드포인트가 필요한 상황**이 자주 발생합니다.\n\n" +
        "### 1. 외부 클라이언트 지원\n" +
        "모바일 앱, 다른 웹사이트, 서드파티 서비스가 내 앱의 데이터에 접근해야 합니다. " +
        "Server Actions는 같은 Next.js 앱 내부에서만 호출 가능하므로 외부 API가 필요합니다.\n\n" +
        "### 2. Webhook 수신\n" +
        "Stripe 결제 완료, GitHub 이벤트, Slack 알림 등 외부 서비스가 " +
        "내 앱에 HTTP 요청을 보내는 Webhook을 처리해야 합니다.\n\n" +
        "### 3. 파일 업로드/스트리밍\n" +
        "대용량 파일 업로드, 서버에서 클라이언트로 데이터를 스트리밍하는 등 " +
        "Server Actions로는 처리하기 어려운 HTTP 특화 기능이 필요합니다.\n\n" +
        "### 4. RESTful API 설계\n" +
        "GET, POST, PUT, DELETE 등 HTTP 메서드에 따라 다른 동작을 수행하는 " +
        "표준 REST API를 구축해야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "**Route Handlers**는 `app/api/` 디렉토리의 `route.ts` 파일에서 HTTP 메서드별로 함수를 export하는 서버 API입니다.\n\n" +
        "### 1. HTTP 메서드별 핸들러\n" +
        "`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS` 함수를 named export합니다. " +
        "각 함수는 `NextRequest`를 받아 `NextResponse`를 반환합니다.\n\n" +
        "### 2. 동적 라우트\n" +
        "`app/api/users/[id]/route.ts`처럼 동적 세그먼트를 사용할 수 있습니다. " +
        "params로 경로 파라미터에 접근합니다.\n\n" +
        "### 3. 요청/응답 처리\n" +
        "`NextRequest`로 쿠키, 헤더, 쿼리 파라미터, 바디를 읽고, " +
        "`NextResponse`로 JSON, 스트림, 리다이렉트 등 다양한 응답을 반환합니다.\n\n" +
        "### 4. Route Handlers vs Server Actions\n" +
        "- **Route Handlers**: 외부 클라이언트용 API, Webhook, 스트리밍, RESTful 설계\n" +
        "- **Server Actions**: 자체 앱 내 폼 제출, 데이터 mutation, 낙관적 업데이트\n\n" +
        "### 5. CORS 설정\n" +
        "외부 도메인에서 API를 호출하려면 CORS 헤더를 설정해야 합니다. " +
        "OPTIONS 핸들러로 preflight 요청을 처리합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Route Handler CRUD와 동적 라우트",
      content:
        "기본적인 CRUD Route Handler를 구현합니다. " +
        "정적 라우트(`/api/posts`)와 동적 라우트(`/api/posts/[id]`)에서 " +
        "HTTP 메서드별 핸들러를 작성하는 패턴을 다룹니다.",
      code: {
        language: "typescript",
        code:
          '// === app/api/posts/route.ts ===\n' +
          'import { NextRequest, NextResponse } from "next/server";\n' +
          'import { prisma } from "@/lib/db";\n\n' +
          '// GET /api/posts — 목록 조회\n' +
          'export async function GET(request: NextRequest) {\n' +
          '  const { searchParams } = request.nextUrl;\n' +
          '  const page = Number(searchParams.get("page") ?? "1");\n' +
          '  const limit = Number(searchParams.get("limit") ?? "10");\n\n' +
          '  const posts = await prisma.post.findMany({\n' +
          '    skip: (page - 1) * limit,\n' +
          '    take: limit,\n' +
          '    orderBy: { createdAt: "desc" },\n' +
          '  });\n\n' +
          '  return NextResponse.json({ posts, page, limit });\n' +
          '}\n\n' +
          '// POST /api/posts — 새 글 생성\n' +
          'export async function POST(request: NextRequest) {\n' +
          '  try {\n' +
          '    const body = await request.json();\n' +
          '    const { title, content } = body;\n\n' +
          '    if (!title || !content) {\n' +
          '      return NextResponse.json(\n' +
          '        { error: "title과 content는 필수입니다" },\n' +
          '        { status: 400 }\n' +
          '      );\n' +
          '    }\n\n' +
          '    const post = await prisma.post.create({\n' +
          '      data: { title, content },\n' +
          '    });\n\n' +
          '    return NextResponse.json(post, { status: 201 });\n' +
          '  } catch (error) {\n' +
          '    return NextResponse.json(\n' +
          '      { error: "서버 에러가 발생했습니다" },\n' +
          '      { status: 500 }\n' +
          '    );\n' +
          '  }\n' +
          '}\n\n' +
          '// === app/api/posts/[id]/route.ts ===\n' +
          'import { NextRequest, NextResponse } from "next/server";\n' +
          'import { prisma } from "@/lib/db";\n\n' +
          'interface RouteParams {\n' +
          '  params: Promise<{ id: string }>;\n' +
          '}\n\n' +
          '// GET /api/posts/:id — 단일 조회\n' +
          'export async function GET(\n' +
          '  request: NextRequest,\n' +
          '  { params }: RouteParams\n' +
          ') {\n' +
          '  const { id } = await params;\n' +
          '  const post = await prisma.post.findUnique({ where: { id } });\n\n' +
          '  if (!post) {\n' +
          '    return NextResponse.json(\n' +
          '      { error: "포스트를 찾을 수 없습니다" },\n' +
          '      { status: 404 }\n' +
          '    );\n' +
          '  }\n\n' +
          '  return NextResponse.json(post);\n' +
          '}\n\n' +
          '// DELETE /api/posts/:id — 삭제\n' +
          'export async function DELETE(\n' +
          '  request: NextRequest,\n' +
          '  { params }: RouteParams\n' +
          ') {\n' +
          '  const { id } = await params;\n' +
          '  await prisma.post.delete({ where: { id } });\n' +
          '  return new NextResponse(null, { status: 204 });\n' +
          '}',
        description:
          "route.ts에서 GET, POST, DELETE를 named export하여 HTTP 메서드별 핸들러를 구현합니다. **Next.js 15 변경사항:** 동적 라우트의 params가 동기 객체에서 `Promise<params>`로 변경되었습니다. 반드시 `await params`로 접근해야 합니다. (Next.js 14에서는 `const { id } = params`처럼 동기적으로 접근했습니다.)",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 스트리밍 응답과 CORS 설정",
      content:
        "Server-Sent Events로 스트리밍 응답을 구현하고, " +
        "외부 도메인 접근을 위한 CORS 설정을 추가하는 실습입니다.",
      code: {
        language: "typescript",
        code:
          '// === app/api/stream/route.ts (스트리밍 응답) ===\n' +
          'export async function GET() {\n' +
          '  const encoder = new TextEncoder();\n\n' +
          '  const stream = new ReadableStream({\n' +
          '    async start(controller) {\n' +
          '      for (let i = 0; i < 5; i++) {\n' +
          '        const data = JSON.stringify({\n' +
          '          message: `이벤트 ${i + 1}`,\n' +
          '          timestamp: Date.now(),\n' +
          '        });\n' +
          '        controller.enqueue(\n' +
          '          encoder.encode(`data: ${data}\\n\\n`)\n' +
          '        );\n' +
          '        await new Promise((r) => setTimeout(r, 1000));\n' +
          '      }\n' +
          '      controller.close();\n' +
          '    },\n' +
          '  });\n\n' +
          '  return new Response(stream, {\n' +
          '    headers: {\n' +
          '      "Content-Type": "text/event-stream",\n' +
          '      "Cache-Control": "no-cache",\n' +
          '      Connection: "keep-alive",\n' +
          '    },\n' +
          '  });\n' +
          '}\n\n' +
          '// === app/api/external/route.ts (CORS 설정) ===\n' +
          'import { NextRequest, NextResponse } from "next/server";\n\n' +
          'const ALLOWED_ORIGINS = [\n' +
          '  "https://partner-app.com",\n' +
          '  "https://mobile-app.com",\n' +
          '];\n\n' +
          'function getCorsHeaders(origin: string | null) {\n' +
          '  const headers: Record<string, string> = {\n' +
          '    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",\n' +
          '    "Access-Control-Allow-Headers": "Content-Type, Authorization",\n' +
          '  };\n\n' +
          '  if (origin && ALLOWED_ORIGINS.includes(origin)) {\n' +
          '    headers["Access-Control-Allow-Origin"] = origin;\n' +
          '  }\n\n' +
          '  return headers;\n' +
          '}\n\n' +
          '// OPTIONS — preflight 요청 처리\n' +
          'export async function OPTIONS(request: NextRequest) {\n' +
          '  const origin = request.headers.get("origin");\n' +
          '  return NextResponse.json({}, {\n' +
          '    headers: getCorsHeaders(origin),\n' +
          '  });\n' +
          '}\n\n' +
          '// GET — 실제 데이터 응답 + CORS 헤더\n' +
          'export async function GET(request: NextRequest) {\n' +
          '  const origin = request.headers.get("origin");\n' +
          '  const data = { message: "외부 API 응답" };\n\n' +
          '  return NextResponse.json(data, {\n' +
          '    headers: getCorsHeaders(origin),\n' +
          '  });\n' +
          '}',
        description:
          "ReadableStream으로 SSE 스트리밍을 구현하고, OPTIONS 핸들러로 CORS preflight를 처리합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| route.ts | app/api/ 디렉토리에서 API 엔드포인트 정의 |\n" +
        "| HTTP 메서드 | GET, POST, PUT, DELETE 등 named export |\n" +
        "| NextRequest | 쿠키, 헤더, URL 파라미터 접근 |\n" +
        "| NextResponse | JSON, 스트림, 리다이렉트 응답 |\n" +
        "| 동적 라우트 | [id] 폴더로 경로 파라미터 처리 |\n" +
        "| 스트리밍 | ReadableStream으로 SSE 구현 |\n" +
        "| CORS | OPTIONS 핸들러로 preflight 처리 |\n\n" +
        "**핵심:** Route Handlers는 외부 클라이언트용 API, Webhook, 스트리밍에 사용합니다. " +
        "자체 앱 내 mutation에는 Server Actions가 더 적합합니다.\n\n" +
        "**다음 챕터 미리보기:** 데이터베이스 연동을 다룹니다. " +
        "Prisma ORM 설정, Server Components에서의 직접 DB 쿼리, 서버리스 환경의 커넥션 풀링을 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Route Handlers는 app/api/의 route.ts에서 HTTP 메서드별로 export하는 서버 API다. 외부 클라이언트용 API에는 Route Handlers, 자체 앱 mutation에는 Server Actions를 쓴다.",
  checklist: [
    "app/api/ 디렉토리에 route.ts를 만들어 API 엔드포인트를 구현할 수 있다",
    "GET, POST, PUT, DELETE 등 HTTP 메서드별 핸들러를 작성할 수 있다",
    "NextRequest에서 쿼리 파라미터, 쿠키, 헤더를 읽을 수 있다",
    "동적 라우트([id])를 사용하여 경로 파라미터를 처리할 수 있다",
    "Route Handlers와 Server Actions의 사용 시점 차이를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Route Handlers에서 API 엔드포인트를 정의하는 파일 이름은?",
      choices: [
        "page.ts",
        "api.ts",
        "route.ts",
        "handler.ts",
      ],
      correctIndex: 2,
      explanation:
        "Route Handlers는 app/api/ 디렉토리 내의 route.ts (또는 route.js) 파일에서 정의합니다. page.ts는 페이지 컴포넌트입니다.",
    },
    {
      id: "q2",
      question: "Route Handlers에서 올바른 HTTP 메서드 핸들러 정의 방법은?",
      choices: [
        "export default function handler(req, res) { ... }",
        "export async function GET(request: NextRequest) { ... }",
        "app.get('/api/posts', handler)",
        "router.get('/posts', controller.list)",
      ],
      correctIndex: 1,
      explanation:
        "Route Handlers에서는 GET, POST, PUT, DELETE 등 HTTP 메서드 이름으로 async 함수를 named export합니다.",
    },
    {
      id: "q3",
      question: "Route Handlers와 Server Actions의 선택 기준으로 올바른 것은?",
      choices: [
        "모든 경우에 Route Handlers를 사용한다",
        "모든 경우에 Server Actions를 사용한다",
        "외부 클라이언트용 API에는 Route Handlers, 자체 앱 mutation에는 Server Actions",
        "읽기에는 Route Handlers, 쓰기에는 Server Actions만 사용한다",
      ],
      correctIndex: 2,
      explanation:
        "외부 클라이언트(모바일 앱, 서드파티)가 접근하는 API에는 Route Handlers를, 자체 앱 내 폼 제출과 데이터 mutation에는 Server Actions를 사용합니다.",
    },
    {
      id: "q4",
      question: "Route Handler에서 동적 라우트의 파라미터를 읽는 방법은?",
      choices: [
        "request.query.id",
        "request.params.id",
        "두 번째 인자의 params를 await하여 사용",
        "NextRequest.getParam('id')",
      ],
      correctIndex: 2,
      explanation:
        "Route Handler의 두 번째 인자 { params }를 await하여 경로 파라미터에 접근합니다. Next.js 15부터 params는 Promise입니다.",
    },
    {
      id: "q5",
      question: "외부 도메인에서 Route Handler를 호출하기 위해 필요한 것은?",
      choices: [
        "next.config.js에서 domains 설정",
        "미들웨어에서 허용 도메인 설정",
        "OPTIONS 핸들러로 CORS preflight 처리",
        "클라이언트에서 mode: 'no-cors' 설정",
      ],
      correctIndex: 2,
      explanation:
        "외부 도메인에서의 API 호출을 허용하려면 CORS 헤더를 설정해야 합니다. OPTIONS 핸들러로 브라우저의 preflight 요청을 처리하고, 실제 응답에도 CORS 헤더를 포함시킵니다.",
    },
  ],
};

export default chapter;
