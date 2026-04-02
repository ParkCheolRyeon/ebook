import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "18-middleware",
  subject: "next",
  title: "미들웨어",
  description:
    "middleware.ts 파일 위치, 요청 전 실행, matcher 설정, NextRequest/NextResponse API, 리다이렉트, 리라이트, 헤더 추가, 인증 체크, Edge Runtime, 제한사항을 학습합니다.",
  order: 18,
  group: "라우팅 심화",
  prerequisites: ["17-intercepting-routes"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "미들웨어는 **건물 입구의 보안 게이트**와 비슷합니다.\n\n" +
        "모든 방문자(요청)는 건물에 들어오기 전에 반드시 보안 게이트(미들웨어)를 거쳐야 합니다. 보안 게이트에서는 여러 가지 작업을 수행할 수 있습니다:\n\n" +
        "**신원 확인(인증 체크)** — 출입증이 없는 사람은 로비(로그인 페이지)로 안내합니다.\n\n" +
        "**방문 안내(리다이렉트)** — '3층은 이전했으니 5층으로 가세요'처럼, 이전 URL을 새 URL로 안내합니다.\n\n" +
        "**출입 기록(헤더 수정)** — 방문자 카드에 방문 시간, 출입 구역 등의 정보를 추가합니다.\n\n" +
        "**투명 안내(리라이트)** — 방문자는 3층에 왔다고 생각하지만, 실제로는 5층의 콘텐츠를 보여줍니다. URL은 변경되지 않습니다.\n\n" +
        "**matcher**는 보안 게이트의 적용 범위입니다. '모든 층을 검사할지', '3층 이상만 검사할지' 설정합니다. 이미지나 정적 파일 같은 '물품 배달'은 보통 검사를 건너뜁니다.\n\n" +
        "중요한 점은, 보안 게이트는 건물 1층(Edge Runtime)에서만 작동합니다. 건물 깊숙한 곳(Node.js 전체 API)의 장비는 사용할 수 없습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "모든 라우트에 공통으로 적용해야 하는 로직들이 있습니다.\n\n" +
        "1. **인증 체크의 중복** — 보호된 페이지마다 인증 확인 로직을 작성하면 코드가 중복되고, 누락 시 보안 취약점이 됩니다.\n\n" +
        "2. **URL 마이그레이션** — 사이트 구조가 바뀌면 이전 URL에서 새 URL로 리다이렉트해야 합니다. 각 페이지에서 처리하면 관리가 어렵습니다.\n\n" +
        "3. **A/B 테스트와 리라이트** — 같은 URL에서 다른 버전의 페이지를 보여주고 싶지만, URL은 변경하고 싶지 않습니다.\n\n" +
        "4. **공통 헤더 관리** — 보안 헤더(CSP, HSTS 등)를 모든 응답에 추가해야 하지만, 각 라우트에서 설정하는 것은 비효율적입니다.\n\n" +
        "5. **지역/언어 기반 라우팅** — 사용자의 위치나 브라우저 언어에 따라 적절한 지역 버전으로 안내해야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js 미들웨어는 모든 라우트 요청 전에 실행되어 공통 로직을 한 곳에서 처리합니다.\n\n" +
        "### 1. 파일 위치\n" +
        "`middleware.ts`는 프로젝트 루트(또는 `src/` 사용 시 `src/middleware.ts`)에 위치합니다. 하나의 프로젝트에 하나의 미들웨어 파일만 허용됩니다.\n\n" +
        "### 2. matcher 설정\n" +
        "`config.matcher`로 미들웨어가 실행될 경로를 제한합니다. 정적 파일이나 API 라우트 등 불필요한 경로를 제외하여 성능을 최적화합니다.\n\n" +
        "### 3. NextRequest / NextResponse\n" +
        "Web API 기반의 `NextRequest`로 요청 정보(쿠키, 헤더, URL 등)에 접근하고, `NextResponse`로 리다이렉트, 리라이트, 헤더 수정 등의 응답을 생성합니다.\n\n" +
        "### 4. Edge Runtime\n" +
        "미들웨어는 Edge Runtime에서 실행됩니다. 서버에 가장 가까운 엣지 위치에서 빠르게 실행되지만, Node.js의 일부 API(파일 시스템, 네이티브 모듈 등)는 사용할 수 없습니다.\n\n" +
        "### 5. 활용 패턴\n" +
        "- 인증/인가 체크 후 리다이렉트\n" +
        "- 이전 URL에서 새 URL로 리다이렉트\n" +
        "- A/B 테스트를 위한 리라이트\n" +
        "- 보안 헤더 추가\n" +
        "- 지역/언어 기반 라우팅",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 미들웨어 기본 구조",
      content:
        "미들웨어의 기본 구조, matcher 설정, NextRequest/NextResponse API를 사용한 리다이렉트, 리라이트, 헤더 추가 방법을 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// middleware.ts (프로젝트 루트 또는 src/)\n' +
          'import { NextRequest, NextResponse } from "next/server";\n\n' +
          'export function middleware(request: NextRequest) {\n' +
          '  const { pathname } = request.nextUrl;\n\n' +
          '  // === 리다이렉트: URL 변경됨 (301/302) ===\n' +
          '  if (pathname === "/old-blog") {\n' +
          '    return NextResponse.redirect(new URL("/blog", request.url));\n' +
          '  }\n\n' +
          '  // === 리라이트: URL은 유지, 다른 페이지 렌더링 ===\n' +
          '  if (pathname === "/dashboard") {\n' +
          '    // A/B 테스트: 쿠키로 분기\n' +
          '    const variant = request.cookies.get("ab-variant")?.value;\n' +
          '    if (variant === "b") {\n' +
          '      return NextResponse.rewrite(new URL("/dashboard-v2", request.url));\n' +
          '    }\n' +
          '  }\n\n' +
          '  // === 헤더 추가 ===\n' +
          '  const response = NextResponse.next();\n' +
          '  response.headers.set("x-custom-header", "my-value");\n' +
          '  response.headers.set(\n' +
          '    "Content-Security-Policy",\n' +
          '    "default-src \'self\'; script-src \'self\'"\n' +
          '  );\n\n' +
          '  return response;\n' +
          '}\n\n' +
          '// matcher로 미들웨어 적용 범위 제한\n' +
          'export const config = {\n' +
          '  matcher: [\n' +
          '    // 정적 파일과 API 라우트 제외\n' +
          '    "/((?!api|_next/static|_next/image|favicon.ico).*)",\n' +
          '  ],\n' +
          '};\n\n' +
          '// === matcher 다양한 패턴 ===\n' +
          'export const config2 = {\n' +
          '  matcher: [\n' +
          '    "/dashboard/:path*",  // /dashboard 하위 모든 경로\n' +
          '    "/admin/:path*",      // /admin 하위 모든 경로\n' +
          '    "/api/protected/:path*", // 보호된 API\n' +
          '  ],\n' +
          '};',
        description:
          "middleware 함수에서 NextRequest로 요청을 분석하고, NextResponse로 리다이렉트, 리라이트, 헤더 추가 등의 응답을 생성합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 인증 미들웨어와 국제화 라우팅",
      content:
        "인증 토큰을 확인하여 보호된 라우트를 관리하고, Accept-Language 헤더를 기반으로 적절한 언어 버전으로 라우팅하는 실전 미들웨어를 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// middleware.ts\n' +
          'import { NextRequest, NextResponse } from "next/server";\n\n' +
          'const protectedPaths = ["/dashboard", "/settings", "/profile"];\n' +
          'const supportedLocales = ["ko", "en", "ja"];\n' +
          'const defaultLocale = "ko";\n\n' +
          'export function middleware(request: NextRequest) {\n' +
          '  const { pathname } = request.nextUrl;\n\n' +
          '  // 1. 인증 체크\n' +
          '  const isProtected = protectedPaths.some((path) =>\n' +
          '    pathname.startsWith(path)\n' +
          '  );\n\n' +
          '  if (isProtected) {\n' +
          '    const token = request.cookies.get("auth-token")?.value;\n\n' +
          '    if (!token) {\n' +
          '      // 로그인 후 원래 페이지로 돌아올 수 있도록 redirect URL 포함\n' +
          '      const loginUrl = new URL("/login", request.url);\n' +
          '      loginUrl.searchParams.set("redirect", pathname);\n' +
          '      return NextResponse.redirect(loginUrl);\n' +
          '    }\n' +
          '  }\n\n' +
          '  // 2. 국제화 라우팅\n' +
          '  const hasLocale = supportedLocales.some(\n' +
          '    (locale) =>\n' +
          '      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`\n' +
          '  );\n\n' +
          '  if (!hasLocale) {\n' +
          '    // Accept-Language 헤더에서 선호 언어 감지\n' +
          '    const acceptLang = request.headers.get("Accept-Language") ?? "";\n' +
          '    const detectedLocale =\n' +
          '      supportedLocales.find((locale) =>\n' +
          '        acceptLang.includes(locale)\n' +
          '      ) ?? defaultLocale;\n\n' +
          '    // URL에 locale prefix 추가 (리라이트)\n' +
          '    return NextResponse.rewrite(\n' +
          '      new URL(`/${detectedLocale}${pathname}`, request.url)\n' +
          '    );\n' +
          '  }\n\n' +
          '  // 3. 응답에 보안 헤더 추가\n' +
          '  const response = NextResponse.next();\n' +
          '  response.headers.set("X-Frame-Options", "DENY");\n' +
          '  response.headers.set("X-Content-Type-Options", "nosniff");\n' +
          '  response.headers.set(\n' +
          '    "Strict-Transport-Security",\n' +
          '    "max-age=31536000; includeSubDomains"\n' +
          '  );\n\n' +
          '  return response;\n' +
          '}\n\n' +
          'export const config = {\n' +
          '  matcher: [\n' +
          '    "/((?!api|_next/static|_next/image|favicon.ico|.*\\\\..*).*)"\n' +
          '  ],\n' +
          '};',
        description:
          "인증 토큰으로 보호 라우트를 관리하고, Accept-Language로 언어 라우팅하고, 보안 헤더를 추가하는 실전 미들웨어입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| middleware.ts | 프로젝트 루트에 위치, 모든 요청 전에 실행 |\n" +
        "| matcher | 미들웨어가 실행될 경로를 제한하는 설정 |\n" +
        "| NextResponse.redirect | URL을 변경하여 다른 페이지로 이동 |\n" +
        "| NextResponse.rewrite | URL 유지한 채 다른 페이지 콘텐츠 렌더링 |\n" +
        "| Edge Runtime | 미들웨어 실행 환경, Node.js API 일부 사용 불가 |\n\n" +
        "**핵심:** 미들웨어는 모든 라우트 요청 전에 Edge Runtime에서 실행되어 리다이렉트, 인증 체크, 헤더 수정 등을 수행한다. matcher로 적용 범위를 제한할 수 있다.\n\n" +
        "**다음 챕터 미리보기:** 국제화(i18n)를 활용하여 다국어 지원 사이트를 구축하고, 미들웨어와 연동하여 언어별 라우팅을 구현하는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "미들웨어는 모든 라우트 요청 전에 Edge Runtime에서 실행되어 리다이렉트, 인증 체크, 헤더 수정 등을 수행한다. matcher로 적용 범위를 제한할 수 있다.",
  checklist: [
    "middleware.ts의 파일 위치와 실행 시점을 설명할 수 있다",
    "matcher로 미들웨어 적용 범위를 제한할 수 있다",
    "NextResponse.redirect와 NextResponse.rewrite의 차이를 이해한다",
    "Edge Runtime의 제한사항을 알고 있다",
    "인증 체크와 리다이렉트를 미들웨어로 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "middleware.ts의 올바른 위치는?",
      choices: [
        "app/ 폴더 안",
        "프로젝트 루트(또는 src/) — app과 같은 레벨",
        "pages/ 폴더 안",
        "public/ 폴더 안",
      ],
      correctIndex: 1,
      explanation:
        "middleware.ts는 프로젝트 루트에 위치합니다. src/ 폴더를 사용하는 경우 src/middleware.ts에 배치합니다. app/ 폴더 안이 아닌, app과 같은 레벨입니다.",
    },
    {
      id: "q2",
      question: "NextResponse.redirect와 NextResponse.rewrite의 차이는?",
      choices: [
        "redirect는 서버에서, rewrite는 클라이언트에서 실행된다",
        "redirect는 URL이 변경되고, rewrite는 URL을 유지한 채 다른 콘텐츠를 보여준다",
        "redirect는 GET만, rewrite는 POST만 지원한다",
        "차이가 없다",
      ],
      correctIndex: 1,
      explanation:
        "redirect는 브라우저 URL이 실제로 변경되며(301/302), rewrite는 사용자가 보는 URL은 그대로 유지하면서 내부적으로 다른 페이지의 콘텐츠를 렌더링합니다.",
    },
    {
      id: "q3",
      question: "미들웨어가 Edge Runtime에서 실행되는 주된 이점은?",
      choices: [
        "Node.js의 모든 API를 사용할 수 있다",
        "사용자에게 가장 가까운 위치에서 빠르게 실행된다",
        "데이터베이스에 직접 연결할 수 있다",
        "파일 시스템에 접근할 수 있다",
      ],
      correctIndex: 1,
      explanation:
        "Edge Runtime은 CDN 엣지 위치에서 실행되어 사용자에게 가장 가까운 곳에서 빠르게 응답합니다. 대신 Node.js의 일부 API(파일 시스템, 네이티브 모듈 등)는 사용할 수 없습니다.",
    },
    {
      id: "q4",
      question: "config.matcher의 역할은?",
      choices: [
        "미들웨어의 실행 순서를 정한다",
        "미들웨어가 실행될 경로를 제한한다",
        "미들웨어의 타임아웃을 설정한다",
        "미들웨어의 캐시 기간을 설정한다",
      ],
      correctIndex: 1,
      explanation:
        "matcher는 미들웨어가 실행될 경로 패턴을 지정합니다. 정적 파일이나 이미지 등 불필요한 경로를 제외하여 성능을 최적화할 수 있습니다.",
    },
    {
      id: "q5",
      question: "미들웨어에서 할 수 없는 것은?",
      choices: [
        "쿠키 읽기/설정",
        "요청 헤더 읽기",
        "Node.js fs 모듈로 파일 읽기",
        "URL 리다이렉트",
      ],
      correctIndex: 2,
      explanation:
        "미들웨어는 Edge Runtime에서 실행되므로 Node.js의 fs(파일 시스템) 모듈을 사용할 수 없습니다. 쿠키, 헤더, URL 조작 등 Web API 기반의 작업만 가능합니다.",
    },
  ],
};

export default chapter;
