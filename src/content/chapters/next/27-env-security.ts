import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "27-env-security",
  subject: "next",
  title: "환경 변수와 보안",
  description:
    "Next.js의 환경 변수 우선순위, NEXT_PUBLIC_ 접두어, server-only 패키지, 보안 헤더, CSRF/XSS 방어, Content Security Policy를 학습합니다.",
  order: 27,
  group: "인증과 보안",
  prerequisites: ["26-authorization"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "환경 변수와 보안은 **은행의 금고 시스템**과 같습니다.\n\n" +
        "은행에는 두 종류의 정보가 있습니다. **공개 정보**(지점 위치, 영업 시간)는 로비에 게시해도 됩니다. " +
        "하지만 **금고 비밀번호**(API 키, DB 접속 정보)는 직원만 알아야 합니다.\n\n" +
        "Next.js에서 `NEXT_PUBLIC_` 접두어가 붙은 환경 변수는 **로비 게시판** — 누구나 볼 수 있습니다. " +
        "접두어가 없는 환경 변수는 **금고 안** — 서버(직원)만 접근할 수 있습니다.\n\n" +
        "**server-only 패키지**는 금고에 **자동 잠금장치**를 다는 것입니다. " +
        "실수로 금고 안의 코드를 로비(클라이언트 번들)로 가져가려 하면 빌드 시점에 에러를 발생시켜 막아줍니다.\n\n" +
        "**보안 헤더**는 은행의 **CCTV와 경비 시스템**입니다. Content Security Policy는 " +
        "'허가된 직원만 입장 가능' 같은 보안 규칙이고, CORS 설정은 '다른 은행 직원의 접근 범위'를 정하는 것입니다. " +
        "이런 보안 장치가 없으면 은행(앱)은 다양한 공격에 취약해집니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "환경 변수와 보안 설정을 잘못 관리하면 **심각한 보안 사고**가 발생합니다.\n\n" +
        "### 1. API 키 노출\n" +
        "실수로 `NEXT_PUBLIC_`을 붙이면 API 키가 클라이언트 JavaScript 번들에 포함됩니다. " +
        "브라우저 개발자 도구에서 누구나 확인할 수 있고, 악의적 사용자가 이를 악용할 수 있습니다.\n\n" +
        "### 2. 서버 코드의 클라이언트 유출\n" +
        "서버 전용 유틸리티를 클라이언트 컴포넌트에서 import하면, DB 접속 정보나 비밀 키가 " +
        "클라이언트 번들에 포함될 수 있습니다. Next.js가 자동으로 막아주지 않습니다.\n\n" +
        "### 3. 환경별 설정 혼란\n" +
        "개발, 스테이징, 프로덕션 환경에서 다른 API URL이나 키를 사용해야 하지만, " +
        "어떤 .env 파일이 우선하는지 혼동하기 쉽습니다.\n\n" +
        "### 4. XSS, CSRF 공격 취약점\n" +
        "보안 헤더 없이 배포하면 Cross-Site Scripting(XSS), Cross-Site Request Forgery(CSRF) 등의 " +
        "웹 공격에 노출됩니다. 사용자 데이터 탈취나 세션 하이재킹으로 이어질 수 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js의 환경 변수 시스템과 보안 기능을 체계적으로 활용합니다.\n\n" +
        "### 1. 환경 변수 우선순위 이해\n" +
        "Next.js는 다음 순서로 환경 변수를 로드합니다: " +
        "`process.env` → `.env.$(NODE_ENV).local` → `.env.local` → `.env.$(NODE_ENV)` → `.env`\n" +
        "`.env.local`은 `.gitignore`에 추가하여 비밀값이 저장소에 올라가지 않게 합니다.\n\n" +
        "### 2. NEXT_PUBLIC_ 규칙\n" +
        "- `NEXT_PUBLIC_` 접두어: 클라이언트와 서버 모두에서 접근 가능 (공개 정보만!)\n" +
        "- 접두어 없음: 서버에서만 접근 가능 (비밀값, API 키)\n\n" +
        "### 3. server-only 패키지\n" +
        "`server-only` 패키지를 import한 모듈은 클라이언트 컴포넌트에서 import하면 빌드 에러가 발생합니다. " +
        "DB 접근 코드, API 키를 사용하는 함수 등에 적용합니다.\n\n" +
        "### 4. 보안 헤더 설정\n" +
        "`next.config.js`의 headers 옵션으로 Content-Security-Policy, X-Frame-Options, " +
        "X-Content-Type-Options 등 보안 헤더를 설정합니다.\n\n" +
        "### 5. CSRF/XSS 방어\n" +
        "Server Actions는 CSRF 토큰을 자동 처리합니다. 사용자 입력은 항상 서버에서 검증하고, " +
        "dangerouslySetInnerHTML 사용을 최소화합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 환경 변수와 server-only 보호",
      content:
        "환경 변수 파일의 올바른 사용법과 server-only 패키지로 " +
        "서버 전용 코드를 보호하는 패턴을 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// === .env (기본값, git에 포함 가능) ===\n' +
          '// NEXT_PUBLIC_ → 클라이언트에 노출됨 (공개 정보만!)\n' +
          '// NEXT_PUBLIC_API_URL=https://api.example.com\n' +
          '// NEXT_PUBLIC_APP_NAME=MyApp\n\n' +
          '// === .env.local (비밀값, .gitignore에 추가) ===\n' +
          '// 접두어 없음 → 서버에서만 접근 가능\n' +
          '// DATABASE_URL=postgresql://user:pass@localhost:5432/db\n' +
          '// AUTH_SECRET=super-secret-key\n' +
          '// GOOGLE_CLIENT_SECRET=gx_xxxxxxxxxxxx\n\n' +
          '// === lib/db.ts (server-only 보호) ===\n' +
          'import "server-only"; // 클라이언트에서 import 시 빌드 에러!\n\n' +
          'import { PrismaClient } from "@prisma/client";\n\n' +
          'const globalForPrisma = globalThis as unknown as {\n' +
          '  prisma: PrismaClient | undefined;\n' +
          '};\n\n' +
          'export const prisma = globalForPrisma.prisma ?? new PrismaClient();\n\n' +
          'if (process.env.NODE_ENV !== "production") {\n' +
          '  globalForPrisma.prisma = prisma;\n' +
          '}\n\n' +
          '// === lib/api-keys.ts (server-only 보호) ===\n' +
          'import "server-only";\n\n' +
          'export function getStripeKey() {\n' +
          '  const key = process.env.STRIPE_SECRET_KEY;\n' +
          '  if (!key) throw new Error("STRIPE_SECRET_KEY가 설정되지 않았습니다");\n' +
          '  return key;\n' +
          '}\n\n' +
          '// === 잘못된 사용 예시 ===\n' +
          '// "use client";\n' +
          '// import { prisma } from "@/lib/db";\n' +
          '// ❌ 빌드 에러! server-only 모듈은 클라이언트에서 사용 불가\n\n' +
          '// === 올바른 사용 예시 ===\n' +
          '// Server Component에서 직접 사용\n' +
          'import { prisma } from "@/lib/db";\n\n' +
          'export default async function UsersPage() {\n' +
          '  const users = await prisma.user.findMany();\n' +
          '  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;\n' +
          '}',
        description:
          "NEXT_PUBLIC_ 접두어로 공개/비공개를 구분하고, server-only로 서버 코드가 클라이언트에 번들되는 것을 방지합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 보안 헤더와 CSP 설정",
      content:
        "next.config.js에서 보안 헤더를 설정하고, Content Security Policy를 " +
        "적용하는 실습입니다. XSS 공격을 방어하는 실질적인 보안 설정을 다룹니다.",
      code: {
        language: "typescript",
        code:
          '// === next.config.ts ===\n' +
          'import type { NextConfig } from "next";\n\n' +
          'const securityHeaders = [\n' +
          '  {\n' +
          '    // XSS 공격 방지: 인라인 스크립트 차단\n' +
          '    key: "Content-Security-Policy",\n' +
          '    value: [\n' +
          '      "default-src \'self\'",\n' +
          '      "script-src \'self\' \'unsafe-eval\' \'unsafe-inline\'",\n' +
          '      "style-src \'self\' \'unsafe-inline\'",\n' +
          '      "img-src \'self\' blob: data: https:",\n' +
          '      "font-src \'self\'",\n' +
          '      "connect-src \'self\' https://api.example.com",\n' +
          '    ].join("; "),\n' +
          '  },\n' +
          '  {\n' +
          '    // iframe 삽입 방지 (클릭재킹 방어)\n' +
          '    key: "X-Frame-Options",\n' +
          '    value: "DENY",\n' +
          '  },\n' +
          '  {\n' +
          '    // MIME 타입 스니핑 방지\n' +
          '    key: "X-Content-Type-Options",\n' +
          '    value: "nosniff",\n' +
          '  },\n' +
          '  {\n' +
          '    // Referrer 정보 제한\n' +
          '    key: "Referrer-Policy",\n' +
          '    value: "strict-origin-when-cross-origin",\n' +
          '  },\n' +
          '  {\n' +
          '    // HTTPS 강제\n' +
          '    key: "Strict-Transport-Security",\n' +
          '    value: "max-age=63072000; includeSubDomains; preload",\n' +
          '  },\n' +
          '];\n\n' +
          'const nextConfig: NextConfig = {\n' +
          '  async headers() {\n' +
          '    return [\n' +
          '      {\n' +
          '        // 모든 라우트에 보안 헤더 적용\n' +
          '        source: "/(.*)",\n' +
          '        headers: securityHeaders,\n' +
          '      },\n' +
          '    ];\n' +
          '  },\n' +
          '};\n\n' +
          'export default nextConfig;\n\n' +
          '// === 환경 변수 타입 안전성 (env.ts) ===\n' +
          'import { z } from "zod";\n\n' +
          'const envSchema = z.object({\n' +
          '  DATABASE_URL: z.string().url(),\n' +
          '  AUTH_SECRET: z.string().min(32),\n' +
          '  NEXT_PUBLIC_API_URL: z.string().url(),\n' +
          '});\n\n' +
          'export const env = envSchema.parse({\n' +
          '  DATABASE_URL: process.env.DATABASE_URL,\n' +
          '  AUTH_SECRET: process.env.AUTH_SECRET,\n' +
          '  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,\n' +
          '});',
        description:
          "next.config.ts의 headers 옵션으로 보안 헤더를 설정하고, Zod로 환경 변수의 타입을 검증합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| .env 우선순위 | .env.local > .env.development > .env |\n" +
        "| NEXT_PUBLIC_ | 클라이언트에 노출되는 환경 변수 (공개 정보만) |\n" +
        "| server-only | import 시 클라이언트 번들링 차단 |\n" +
        "| CSP | 허용된 리소스 출처를 지정하여 XSS 방어 |\n" +
        "| X-Frame-Options | iframe 삽입 차단 (클릭재킹 방어) |\n" +
        "| HSTS | HTTPS 강제 적용 |\n" +
        "| CSRF 방어 | Server Actions 자동 CSRF 토큰 처리 |\n\n" +
        "**핵심:** NEXT_PUBLIC_ 접두어가 붙은 변수만 클라이언트에 노출됩니다. " +
        "비밀값에는 절대 NEXT_PUBLIC_을 붙이지 말고, server-only로 서버 코드가 클라이언트에 번들되지 않게 보호하세요.\n\n" +
        "**다음 챕터 미리보기:** Route Handlers를 사용하여 API 엔드포인트를 만드는 방법을 다룹니다. " +
        "HTTP 메서드별 핸들러, 요청/응답 처리, CORS 설정을 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "NEXT_PUBLIC_ 접두어가 붙은 환경 변수만 클라이언트에 노출된다. API 키 같은 비밀값은 절대 NEXT_PUBLIC_을 붙이지 말고, server-only 패키지로 서버 코드가 클라이언트에 번들되지 않도록 보호하라.",
  checklist: [
    ".env, .env.local, .env.production의 우선순위를 설명할 수 있다",
    "NEXT_PUBLIC_ 접두어의 의미와 위험성을 이해하고 올바르게 사용할 수 있다",
    "server-only 패키지를 사용하여 서버 코드를 보호할 수 있다",
    "next.config.js에서 보안 헤더(CSP, X-Frame-Options 등)를 설정할 수 있다",
    "XSS, CSRF 공격의 원리와 Next.js에서의 방어 방법을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "NEXT_PUBLIC_ 접두어가 붙은 환경 변수의 특성은?",
      choices: [
        "서버에서만 접근 가능하다",
        "클라이언트와 서버 모두에서 접근 가능하다",
        "빌드 시에만 사용되고 런타임에는 접근 불가하다",
        "개발 환경에서만 접근 가능하다",
      ],
      correctIndex: 1,
      explanation:
        "NEXT_PUBLIC_ 접두어가 붙은 환경 변수는 클라이언트 JavaScript 번들에 인라인되어 브라우저에서도 접근 가능합니다. 따라서 비밀값은 절대 이 접두어를 붙이면 안 됩니다.",
    },
    {
      id: "q2",
      question: "server-only 패키지의 역할은?",
      choices: [
        "서버 성능을 최적화한다",
        "서버 컴포넌트를 자동 생성한다",
        "해당 모듈이 클라이언트 번들에 포함되면 빌드 에러를 발생시킨다",
        "서버에서만 실행되는 환경 변수를 정의한다",
      ],
      correctIndex: 2,
      explanation:
        "server-only를 import한 모듈은 클라이언트 컴포넌트에서 import하면 빌드 시 에러가 발생합니다. DB 접속 코드나 API 키를 사용하는 모듈에 적용하여 실수로 클라이언트에 노출되는 것을 방지합니다.",
    },
    {
      id: "q3",
      question: ".env 파일의 우선순위가 가장 높은 것은?",
      choices: [
        ".env",
        ".env.development",
        ".env.local",
        ".env.production",
      ],
      correctIndex: 2,
      explanation:
        ".env.local은 모든 환경에서 가장 높은 우선순위를 가집니다 (.env.test.local 제외). 로컬 개발 환경의 비밀값을 저장하며, .gitignore에 추가하여 저장소에 올리지 않습니다.",
    },
    {
      id: "q4",
      question: "Content Security Policy(CSP)의 주요 목적은?",
      choices: [
        "서버 성능 최적화",
        "허용된 리소스 출처를 지정하여 XSS 공격 방어",
        "API 요청 속도 제한",
        "사용자 인증 처리",
      ],
      correctIndex: 1,
      explanation:
        "CSP는 브라우저가 로드할 수 있는 리소스(스크립트, 스타일, 이미지 등)의 출처를 제한합니다. 악성 스크립트 주입(XSS)을 방지하는 핵심 보안 메커니즘입니다.",
    },
    {
      id: "q5",
      question: "Next.js Server Actions의 CSRF 방어에 대한 설명으로 올바른 것은?",
      choices: [
        "개발자가 직접 CSRF 토큰을 구현해야 한다",
        "CSRF 방어가 지원되지 않는다",
        "Server Actions는 자동으로 CSRF 토큰을 처리한다",
        "미들웨어에서 별도로 CSRF를 처리해야 한다",
      ],
      correctIndex: 2,
      explanation:
        "Next.js의 Server Actions는 자동으로 CSRF 토큰을 생성하고 검증합니다. 별도의 CSRF 방어 코드를 작성할 필요가 없습니다.",
    },
  ],
};

export default chapter;
