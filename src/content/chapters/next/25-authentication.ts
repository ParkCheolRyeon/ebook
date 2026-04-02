import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "25-authentication",
  subject: "next",
  title: "인증 패턴 (Auth.js)",
  description:
    "Auth.js(NextAuth.js v5)를 사용한 Next.js 인증 구현. OAuth 프로바이더, Credentials 프로바이더, 세션 관리(JWT vs database), auth() 함수, 미들웨어 인증 체크를 학습합니다.",
  order: 25,
  group: "인증과 보안",
  prerequisites: ["24-performance"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "인증은 **호텔 체크인 시스템**과 같습니다.\n\n" +
        "호텔에 들어가려면 먼저 프론트에서 신분증(자격 증명)을 보여주고 체크인해야 합니다. " +
        "이때 두 가지 방법이 있습니다. 하나는 **여권(OAuth)** — Google이나 GitHub 같은 신뢰할 수 있는 기관이 발급한 공식 신분증입니다. " +
        "다른 하나는 **예약 번호와 이름(Credentials)** — 호텔에 직접 등록한 정보로 확인하는 것입니다.\n\n" +
        "체크인이 완료되면 **카드키(세션)**를 받습니다. 이 카드키에는 두 가지 유형이 있습니다. " +
        "**JWT 세션**은 카드키 자체에 방 번호, 체크아웃 날짜 등 모든 정보가 인코딩되어 있어서 호텔 서버에 물어볼 필요가 없습니다. " +
        "**Database 세션**은 카드키에는 고유 번호만 있고, 실제 정보는 호텔 서버(데이터베이스)에 저장되어 있어서 매번 확인이 필요합니다.\n\n" +
        "Auth.js는 이 호텔의 **통합 체크인 시스템**입니다. 여권이든 예약번호든 하나의 프론트에서 처리하고, " +
        "카드키 발급과 검증까지 모두 관리합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React 앱에서 인증을 직접 구현하면 **해결해야 할 문제가 산더미**입니다.\n\n" +
        "### 1. OAuth 플로우의 복잡성\n" +
        "Google, GitHub 로그인을 구현하려면 OAuth 2.0 인증 코드 플로우를 직접 처리해야 합니다. " +
        "리다이렉트 URL 관리, 토큰 교환, 사용자 정보 조회 등 수많은 단계를 빠짐없이 구현해야 합니다.\n\n" +
        "### 2. 세션 관리\n" +
        "로그인 상태를 유지하기 위해 JWT 토큰이나 세션 쿠키를 직접 관리해야 합니다. " +
        "토큰 갱신, 만료 처리, 보안 쿠키 설정 등을 실수 없이 구현하기 어렵습니다.\n\n" +
        "### 3. Server Components와의 통합\n" +
        "App Router에서는 서버 컴포넌트, 서버 액션, 미들웨어 등 여러 실행 환경에서 세션에 접근해야 합니다. " +
        "각 환경에 맞는 세션 확인 로직을 일관되게 유지하기 어렵습니다.\n\n" +
        "### 4. 보안 취약점\n" +
        "CSRF 방어, 안전한 쿠키 설정, 토큰 암호화 등 보안 관련 구현을 하나라도 놓치면 심각한 보안 사고로 이어질 수 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "**Auth.js(NextAuth.js v5)**는 Next.js에 최적화된 인증 라이브러리로, 위의 모든 문제를 통합 해결합니다.\n\n" +
        "### 1. 프로바이더 기반 설정\n" +
        "OAuth 프로바이더(Google, GitHub 등)와 Credentials 프로바이더를 설정 파일 하나로 추가할 수 있습니다. " +
        "복잡한 OAuth 플로우는 Auth.js가 내부적으로 처리합니다.\n\n" +
        "### 2. 통합 세션 관리\n" +
        "JWT 전략과 Database 전략 중 선택할 수 있습니다. JWT는 별도 DB 없이 작동하고, " +
        "Database 전략은 Prisma 같은 ORM 어댑터를 연결하여 세션을 서버에 저장합니다.\n\n" +
        "### 3. 환경별 세션 접근 API\n" +
        "- **Server Component**: `auth()` 함수로 세션 확인\n" +
        "- **Client Component**: `useSession()` 훅으로 세션 접근\n" +
        "- **미들웨어**: `auth` 래퍼로 인증 체크\n" +
        "- **Server Action**: `auth()` 함수로 권한 확인\n\n" +
        "### 4. 내장 보안\n" +
        "CSRF 토큰 자동 생성, HttpOnly 쿠키, 서명된 JWT 등 보안 모범 사례가 기본 적용됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Auth.js 설정과 세션 관리",
      content:
        "Auth.js v5의 핵심 설정 파일과 세션 확인 패턴을 살펴봅니다. " +
        "`auth.ts` 설정 파일에서 프로바이더를 등록하고, `auth()` 함수를 내보내 " +
        "서버 컴포넌트와 미들웨어에서 사용하는 흐름을 이해합니다.",
      code: {
        language: "typescript",
        code:
          '// === auth.ts (프로젝트 루트) ===\n' +
          'import NextAuth from "next-auth";\n' +
          'import Google from "next-auth/providers/google";\n' +
          'import GitHub from "next-auth/providers/github";\n' +
          'import Credentials from "next-auth/providers/credentials";\n\n' +
          'export const { handlers, auth, signIn, signOut } = NextAuth({\n' +
          '  providers: [\n' +
          '    // OAuth 프로바이더\n' +
          '    Google({\n' +
          '      clientId: process.env.GOOGLE_CLIENT_ID!,\n' +
          '      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,\n' +
          '    }),\n' +
          '    GitHub({\n' +
          '      clientId: process.env.GITHUB_CLIENT_ID!,\n' +
          '      clientSecret: process.env.GITHUB_CLIENT_SECRET!,\n' +
          '    }),\n' +
          '    // Credentials 프로바이더\n' +
          '    Credentials({\n' +
          '      credentials: {\n' +
          '        email: { label: "이메일", type: "email" },\n' +
          '        password: { label: "비밀번호", type: "password" },\n' +
          '      },\n' +
          '      async authorize(credentials) {\n' +
          '        // DB에서 사용자 확인 로직\n' +
          '        const user = await findUser(credentials.email as string);\n' +
          '        if (user && await verifyPassword(\n' +
          '          credentials.password as string, user.hashedPassword\n' +
          '        )) {\n' +
          '          return { id: user.id, name: user.name, email: user.email };\n' +
          '        }\n' +
          '        return null; // 인증 실패\n' +
          '      },\n' +
          '    }),\n' +
          '  ],\n' +
          '  session: {\n' +
          '    strategy: "jwt", // "jwt" | "database"\n' +
          '  },\n' +
          '  callbacks: {\n' +
          '    async jwt({ token, user }) {\n' +
          '      if (user) token.role = user.role;\n' +
          '      return token;\n' +
          '    },\n' +
          '    async session({ session, token }) {\n' +
          '      session.user.role = token.role as string;\n' +
          '      return session;\n' +
          '    },\n' +
          '  },\n' +
          '});\n\n' +
          '// === app/api/auth/[...nextauth]/route.ts ===\n' +
          'import { handlers } from "@/auth";\n' +
          'export const { GET, POST } = handlers;\n\n' +
          '// === middleware.ts ===\n' +
          'export { auth as middleware } from "@/auth";\n\n' +
          'export const config = {\n' +
          '  matcher: ["/dashboard/:path*", "/settings/:path*"],\n' +
          '};',
        description:
          "auth.ts에서 프로바이더와 세션 전략을 설정하고, handlers를 API 라우트에 연결하며, auth를 미들웨어로 내보냅니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 서버/클라이언트에서 세션 사용하기",
      content:
        "서버 컴포넌트에서 `auth()`로 세션을 확인하고, " +
        "클라이언트 컴포넌트에서 `useSession()`으로 세션에 접근하는 실습입니다. " +
        "로그인/로그아웃 버튼 구현과 보호된 페이지 패턴을 함께 다룹니다.",
      code: {
        language: "typescript",
        code:
          '// === app/layout.tsx ===\n' +
          'import { SessionProvider } from "next-auth/react";\n\n' +
          'export default function RootLayout({\n' +
          '  children,\n' +
          '}: {\n' +
          '  children: React.ReactNode;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <html lang="ko">\n' +
          '      <body>\n' +
          '        <SessionProvider>{children}</SessionProvider>\n' +
          '      </body>\n' +
          '    </html>\n' +
          '  );\n' +
          '}\n\n' +
          '// === app/dashboard/page.tsx (서버 컴포넌트) ===\n' +
          'import { auth } from "@/auth";\n' +
          'import { redirect } from "next/navigation";\n\n' +
          'export default async function DashboardPage() {\n' +
          '  const session = await auth();\n\n' +
          '  // 미인증 사용자 리다이렉트\n' +
          '  if (!session) {\n' +
          '    redirect("/api/auth/signin");\n' +
          '  }\n\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <h1>대시보드</h1>\n' +
          '      <p>환영합니다, {session.user?.name}님!</p>\n' +
          '      <p>이메일: {session.user?.email}</p>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// === components/AuthButton.tsx (클라이언트 컴포넌트) ===\n' +
          '"use client";\n' +
          'import { useSession, signIn, signOut } from "next-auth/react";\n\n' +
          'export default function AuthButton() {\n' +
          '  const { data: session, status } = useSession();\n\n' +
          '  if (status === "loading") return <div>로딩중...</div>;\n\n' +
          '  if (session) {\n' +
          '    return (\n' +
          '      <div>\n' +
          '        <span>{session.user?.name}</span>\n' +
          '        <button onClick={() => signOut()}>로그아웃</button>\n' +
          '      </div>\n' +
          '    );\n' +
          '  }\n\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <button onClick={() => signIn("google")}>Google 로그인</button>\n' +
          '      <button onClick={() => signIn("github")}>GitHub 로그인</button>\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "서버 컴포넌트에서는 auth()로 세션을 확인하고 redirect로 보호하며, 클라이언트에서는 useSession으로 UI를 분기합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| Auth.js (v5) | Next.js 최적화 인증 라이브러리, NextAuth.js의 차세대 버전 |\n" +
        "| OAuth 프로바이더 | Google, GitHub 등 외부 서비스로 로그인 |\n" +
        "| Credentials | 이메일/비밀번호 직접 인증 |\n" +
        "| JWT 세션 | 토큰에 정보 저장, DB 불필요, 빠름 |\n" +
        "| Database 세션 | 서버에 세션 저장, 즉시 무효화 가능 |\n" +
        "| auth() | 서버 컴포넌트/서버 액션에서 세션 확인 |\n" +
        "| useSession() | 클라이언트 컴포넌트에서 세션 접근 |\n\n" +
        "**핵심:** Auth.js는 OAuth, Credentials, 세션 관리를 하나의 설정으로 통합하며, " +
        "Server Components에서는 `auth()`, 클라이언트에서는 `useSession()`으로 일관되게 세션에 접근합니다.\n\n" +
        "**다음 챕터 미리보기:** 인증(누구인가)을 넘어 인가(무엇을 할 수 있는가)를 다룹니다. " +
        "역할 기반 접근 제어(RBAC)와 미들웨어 보호 패턴을 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Auth.js는 Next.js에서 OAuth, 자격증명, 세션 관리를 통합 처리한다. Server Components에서는 auth()로, 미들웨어에서는 인증 체크로, Client에서는 useSession으로 세션에 접근한다.",
  checklist: [
    "Auth.js v5의 설정 파일(auth.ts)을 작성하고 프로바이더를 등록할 수 있다",
    "OAuth(Google, GitHub)와 Credentials 프로바이더의 차이를 설명할 수 있다",
    "JWT 세션과 Database 세션의 장단점을 비교할 수 있다",
    "Server Component에서 auth()로 세션을 확인하고 보호된 페이지를 만들 수 있다",
    "Client Component에서 useSession()으로 로그인 상태에 따른 UI를 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Auth.js v5에서 프로바이더를 설정하고 세션 함수를 내보내는 파일은?",
      choices: [
        "next.config.js",
        "auth.ts (프로젝트 루트)",
        "app/api/auth/route.ts",
        "middleware.ts",
      ],
      correctIndex: 1,
      explanation:
        "Auth.js v5에서는 프로젝트 루트의 auth.ts 파일에서 NextAuth()를 호출하여 handlers, auth, signIn, signOut을 내보냅니다.",
    },
    {
      id: "q2",
      question: "JWT 세션 전략의 특징으로 올바른 것은?",
      choices: [
        "세션 정보가 서버 데이터베이스에 저장된다",
        "세션을 즉시 무효화할 수 있다",
        "별도의 데이터베이스 없이 토큰 자체에 세션 정보를 저장한다",
        "매 요청마다 DB 조회가 필요하다",
      ],
      correctIndex: 2,
      explanation:
        "JWT 전략은 세션 정보를 암호화된 토큰에 저장합니다. 별도 DB가 필요 없지만, 토큰 만료 전까지 즉시 무효화하기 어렵습니다.",
    },
    {
      id: "q3",
      question: "Server Component에서 현재 세션을 확인하는 올바른 방법은?",
      choices: [
        "useSession() 훅 사용",
        "getServerSession() 호출",
        "auth() 함수 호출 (await)",
        "req.session 접근",
      ],
      correctIndex: 2,
      explanation:
        "Auth.js v5에서 Server Component에서는 auth() 함수를 await로 호출하여 세션을 확인합니다. useSession()은 클라이언트 전용입니다.",
    },
    {
      id: "q4",
      question: "Auth.js의 OAuth 프로바이더 설정 시 필요한 환경 변수는?",
      choices: [
        "API_KEY와 API_SECRET",
        "CLIENT_ID와 CLIENT_SECRET",
        "ACCESS_TOKEN과 REFRESH_TOKEN",
        "USERNAME과 PASSWORD",
      ],
      correctIndex: 1,
      explanation:
        "OAuth 프로바이더(Google, GitHub 등)는 해당 서비스의 개발자 콘솔에서 발급받은 CLIENT_ID와 CLIENT_SECRET을 환경 변수로 설정해야 합니다.",
    },
    {
      id: "q5",
      question: "Auth.js에서 미들웨어로 특정 라우트를 보호하려면?",
      choices: [
        "각 페이지에서 개별적으로 auth()를 호출한다",
        "middleware.ts에서 auth를 미들웨어로 export하고 matcher를 설정한다",
        "next.config.js에서 protectedRoutes를 설정한다",
        "layout.tsx에서 세션을 체크한다",
      ],
      correctIndex: 1,
      explanation:
        "middleware.ts에서 auth를 미들웨어로 export하고, config.matcher로 보호할 경로를 지정하면 해당 라우트에 접근 시 자동으로 인증을 체크합니다.",
    },
  ],
};

export default chapter;
