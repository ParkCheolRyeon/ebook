import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "32-deployment",
  subject: "next",
  title: "배포 전략",
  description:
    "Vercel, 셀프 호스팅, Docker, 정적 내보내기 등 Next.js 앱의 다양한 배포 전략을 학습합니다. 환경별 설정, CI/CD 파이프라인, 프리뷰 배포, 런타임 선택까지 다룹니다.",
  order: 32,
  group: "테스팅과 배포",
  prerequisites: ["31-testing"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Next.js 배포는 **음식 배달 방법 선택**과 같습니다.\n\n" +
        "**Vercel 배포**는 프랜차이즈 배달 플랫폼(배민, 쿠팡이츠)입니다. 메뉴(코드)만 등록하면 주문 접수, 배달, 결제를 플랫폼이 알아서 처리합니다. 가장 편리하지만, 플랫폼 정책에 따라야 합니다.\n\n" +
        "**셀프 호스팅(Node.js)**은 자체 배달 시스템을 운영하는 것입니다. 배달 차량(서버)을 직접 관리하고, 배달 경로(인프라)도 직접 설정합니다. 완전한 통제권이 있지만 운영 부담이 있습니다.\n\n" +
        "**Docker 컨테이너**는 이동식 푸드트럭입니다. 주방 설비(런타임 환경)가 트럭에 내장되어 있어, 어디든 주차하면(어느 서버든) 바로 영업할 수 있습니다.\n\n" +
        "**정적 내보내기**는 편의점 도시락입니다. 미리 만들어 포장(빌드)해두면, 냉장고(CDN)에 넣기만 하면 됩니다. 서버가 필요 없어 가장 저렴하지만, 주문 즉시 조리(SSR)는 불가능합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "Next.js 앱을 배포할 때 여러 선택지가 있어 혼란이 생깁니다.\n\n" +
        "1. **배포 대상의 다양성** — Vercel, AWS, GCP, 자체 서버 등 선택지가 많습니다. 각 플랫폼마다 설정 방법과 지원하는 기능이 다릅니다. 어떤 플랫폼이 내 프로젝트에 적합한지 판단하기 어렵습니다.\n\n" +
        "2. **기능 제약** — 정적 내보내기는 SSR, ISR, 미들웨어를 사용할 수 없습니다. 셀프 호스팅에서는 이미지 최적화 등 일부 기능에 추가 설정이 필요합니다. 배포 방식에 따라 사용 가능한 기능이 달라집니다.\n\n" +
        "3. **번들 크기 관리** — `node_modules` 전체를 서버에 올리면 불필요하게 용량이 큽니다. 프로덕션에 필요한 최소한의 파일만 포함해야 합니다.\n\n" +
        "4. **환경별 설정** — 개발, 스테이징, 프로덕션 환경마다 API URL, 데이터베이스, 기능 플래그가 다릅니다. 환경변수를 안전하게 관리하고 분기하는 전략이 필요합니다.\n\n" +
        "5. **Edge vs Node.js** — 어떤 라우트는 Edge Runtime에서 빠르게, 어떤 라우트는 Node.js Runtime에서 실행해야 합니다. 런타임 선택 기준이 불명확합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js는 다양한 배포 옵션을 공식적으로 지원합니다.\n\n" +
        "### 1. Vercel (권장)\n" +
        "Next.js를 만든 Vercel은 모든 기능(SSR, ISR, 미들웨어, 이미지 최적화)을 제로 설정으로 지원합니다. Git push만으로 자동 배포됩니다.\n\n" +
        "### 2. 셀프 호스팅 (standalone)\n" +
        "`output: 'standalone'` 설정으로 필요한 파일만 추출한 경량 번들을 생성합니다. `node_modules`의 수백 MB 대신, 필요한 의존성만 포함하여 번들 크기를 대폭 줄입니다.\n\n" +
        "### 3. Docker 컨테이너\n" +
        "standalone 출력을 기반으로 멀티 스테이지 빌드 Dockerfile을 작성합니다. 어떤 클라우드 환경에서든 일관된 배포가 가능합니다.\n\n" +
        "### 4. 정적 내보내기\n" +
        "`output: 'export'`로 순수 HTML/CSS/JS를 생성합니다. S3, GitHub Pages 등 정적 호스팅에 배포할 수 있지만, SSR 관련 기능은 사용할 수 없습니다.\n\n" +
        "### 5. 런타임 선택\n" +
        "Edge Runtime은 경량(제한된 Node.js API)이지만 전 세계에 분산되어 빠릅니다. Node.js Runtime은 모든 API를 사용할 수 있어 복잡한 로직에 적합합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 배포 설정과 Docker",
      content:
        "standalone 모드는 Next.js 빌드 시 필요한 파일만 .next/standalone 디렉토리에 복사합니다. 이를 기반으로 Docker 이미지를 만들면 100MB 미만의 경량 컨테이너를 만들 수 있습니다. 환경변수는 빌드 타임(NEXT_PUBLIC_)과 런타임으로 구분하여 관리합니다.",
      code: {
        language: "typescript",
        code:
          '// next.config.ts — standalone 출력 설정\n' +
          'import type { NextConfig } from "next";\n' +
          '\n' +
          'const nextConfig: NextConfig = {\n' +
          '  output: "standalone", // 경량 번들 생성\n' +
          '  // 또는 output: "export" — 정적 사이트 생성\n' +
          '};\n' +
          '\n' +
          'export default nextConfig;\n' +
          '\n' +
          '// Dockerfile (멀티 스테이지 빌드)\n' +
          '// --- Stage 1: 의존성 설치 ---\n' +
          '// FROM node:20-alpine AS deps\n' +
          '// WORKDIR /app\n' +
          '// COPY package.json package-lock.json ./\n' +
          '// RUN npm ci\n' +
          '//\n' +
          '// --- Stage 2: 빌드 ---\n' +
          '// FROM node:20-alpine AS builder\n' +
          '// WORKDIR /app\n' +
          '// COPY --from=deps /app/node_modules ./node_modules\n' +
          '// COPY . .\n' +
          '// RUN npm run build\n' +
          '//\n' +
          '// --- Stage 3: 프로덕션 (standalone) ---\n' +
          '// FROM node:20-alpine AS runner\n' +
          '// WORKDIR /app\n' +
          '// ENV NODE_ENV=production\n' +
          '// COPY --from=builder /app/.next/standalone ./\n' +
          '// COPY --from=builder /app/.next/static ./.next/static\n' +
          '// COPY --from=builder /app/public ./public\n' +
          '// EXPOSE 3000\n' +
          '// CMD ["node", "server.js"]\n' +
          '\n' +
          '// 환경변수 관리 전략\n' +
          '// .env.local (로컬 개발용, git에서 제외)\n' +
          '// NEXT_PUBLIC_API_URL=http://localhost:8080\n' +
          '// DATABASE_URL=postgresql://localhost:5432/dev\n' +
          '\n' +
          '// .env.production (프로덕션 기본값)\n' +
          '// NEXT_PUBLIC_API_URL=https://api.example.com\n' +
          '\n' +
          '// app/api/health/route.ts — 헬스체크 엔드포인트\n' +
          'import { NextResponse } from "next/server";\n' +
          '\n' +
          'export async function GET() {\n' +
          '  return NextResponse.json({\n' +
          '    status: "ok",\n' +
          '    timestamp: new Date().toISOString(),\n' +
          '    environment: process.env.NODE_ENV,\n' +
          '  });\n' +
          '}\n' +
          '\n' +
          '// 라우트별 런타임 선택\n' +
          '// app/api/fast/route.ts\n' +
          'export const runtime = "edge"; // Edge Runtime\n' +
          '\n' +
          'export async function GET() {\n' +
          '  // 경량 로직에 적합 (crypto, Response 등 Web API 사용)\n' +
          '  return new Response("Hello from Edge!");\n' +
          '}',
        description:
          "standalone 설정, Docker 멀티 스테이지 빌드, 환경변수 관리, 런타임 선택 패턴을 보여줍니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: CI/CD 파이프라인과 프리뷰 배포",
      content:
        "GitHub Actions를 사용하여 PR마다 프리뷰 배포를 만들고, main 브랜치 머지 시 프로덕션에 자동 배포하는 CI/CD 파이프라인을 구성합니다. 빌드 전 타입 체크와 테스트를 실행하여 품질을 보장합니다. 정적 내보내기 모드에서는 next export 결과물을 CDN에 업로드합니다.",
      code: {
        language: "typescript",
        code:
          '// .github/workflows/deploy.yml 내용을 TypeScript 설정으로 표현\n' +
          '\n' +
          '// CI/CD 파이프라인 단계를 코드로 정리\n' +
          'const cicdPipeline = {\n' +
          '  // Step 1: 품질 검사\n' +
          '  qualityCheck: [\n' +
          '    "npm ci",\n' +
          '    "npx tsc --noEmit",        // 타입 체크\n' +
          '    "npm run lint",             // ESLint\n' +
          '    "npm run test -- --ci",     // 단위 테스트\n' +
          '  ],\n' +
          '\n' +
          '  // Step 2: 빌드\n' +
          '  build: [\n' +
          '    "npm run build",\n' +
          '  ],\n' +
          '\n' +
          '  // Step 3: E2E 테스트\n' +
          '  e2e: [\n' +
          '    "npx playwright install --with-deps",\n' +
          '    "npm run test:e2e",\n' +
          '  ],\n' +
          '\n' +
          '  // Step 4: 배포 (환경별 분기)\n' +
          '  deploy: {\n' +
          '    preview: "PR 생성 시 프리뷰 URL 자동 생성",\n' +
          '    staging: "develop 브랜치 → 스테이징 환경",\n' +
          '    production: "main 브랜치 → 프로덕션 배포",\n' +
          '  },\n' +
          '};\n' +
          '\n' +
          '// next.config.ts — 정적 내보내기 설정\n' +
          'import type { NextConfig } from "next";\n' +
          '\n' +
          'const nextConfig: NextConfig = {\n' +
          '  output: "export",\n' +
          '  // 정적 내보내기에서의 이미지 최적화\n' +
          '  images: {\n' +
          '    unoptimized: true, // 외부 이미지 서비스 사용 시\n' +
          '  },\n' +
          '  // 트레일링 슬래시 (S3/정적 호스팅 호환)\n' +
          '  trailingSlash: true,\n' +
          '};\n' +
          '\n' +
          'export default nextConfig;\n' +
          '\n' +
          '// 빌드 후 out/ 디렉토리가 생성됨\n' +
          '// → S3, GitHub Pages, Netlify 등에 업로드\n' +
          '\n' +
          '// 환경별 분기 예시\n' +
          '// app/config.ts\n' +
          'export const config = {\n' +
          '  apiUrl: process.env.NEXT_PUBLIC_API_URL!,\n' +
          '  isProduction: process.env.NODE_ENV === "production",\n' +
          '  features: {\n' +
          '    newDashboard:\n' +
          '      process.env.NEXT_PUBLIC_FEATURE_NEW_DASHBOARD === "true",\n' +
          '  },\n' +
          '} as const;',
        description:
          "CI/CD 파이프라인 구성, 정적 내보내기 설정, 환경별 분기와 기능 플래그 패턴을 보여줍니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 배포 방식 | 장점 | 제약 | 적합한 경우 |\n" +
        "|----------|------|------|------------|\n" +
        "| Vercel | 제로 설정, 모든 기능 지원 | 벤더 종속 | 빠른 출시, 스타트업 |\n" +
        "| standalone + Node.js | 완전한 통제 | 인프라 관리 필요 | 사내 서버, 보안 요구 |\n" +
        "| Docker | 환경 일관성, 이식성 | 이미지 관리 필요 | Kubernetes, 클라우드 |\n" +
        "| 정적 내보내기 | 가장 저렴, 빠름 | SSR/ISR 불가 | 마케팅 사이트, 문서 |\n\n" +
        "**핵심:** Vercel은 모든 기능을 제로 설정으로 지원합니다. 셀프 호스팅은 `output: 'standalone'`으로 경량 번들을 만들고, Docker로 컨테이너화합니다. 배포 방식에 따라 사용 가능한 기능이 달라지므로 프로젝트 요구사항에 맞는 전략을 선택해야 합니다.\n\n" +
        "**다음 챕터 미리보기:** App Router 이전의 Pages Router 구조를 이해하고, 두 라우터의 차이점과 공존 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Vercel은 Next.js의 모든 기능을 제로 설정으로 지원한다. 셀프 호스팅은 output: 'standalone'으로 번들 크기를 줄이고, Docker로 컨테이너화할 수 있다.",
  checklist: [
    "Vercel 배포의 장점과 제약을 설명할 수 있다",
    "output: 'standalone' 설정의 역할을 이해한다",
    "Docker 멀티 스테이지 빌드로 Next.js 이미지를 만들 수 있다",
    "정적 내보내기(output: 'export')의 제약을 안다",
    "Edge Runtime과 Node.js Runtime의 차이를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "output: 'standalone' 설정의 주요 목적은?",
      choices: [
        "정적 HTML 파일을 생성한다",
        "프로덕션에 필요한 최소 파일만 추출하여 번들 크기를 줄인다",
        "Edge Runtime을 활성화한다",
        "TypeScript 컴파일을 건너뛴다",
      ],
      correctIndex: 1,
      explanation:
        "standalone 모드는 node_modules에서 프로덕션에 필요한 파일만 .next/standalone으로 복사하여 배포 번들 크기를 크게 줄입니다.",
    },
    {
      id: "q2",
      question: "정적 내보내기(output: 'export')에서 사용할 수 없는 기능은?",
      choices: [
        "클라이언트 사이드 라우팅",
        "CSS Modules",
        "서버 사이드 렌더링(SSR)",
        "이미지 태그 사용",
      ],
      correctIndex: 2,
      explanation:
        "정적 내보내기는 빌드 타임에 모든 HTML을 생성하므로, 요청 시점에 서버에서 렌더링하는 SSR, ISR, 미들웨어 등을 사용할 수 없습니다.",
    },
    {
      id: "q3",
      question: "Docker 멀티 스테이지 빌드에서 프로덕션 스테이지에 복사해야 하는 것은?",
      choices: [
        "전체 node_modules",
        "소스 코드(.tsx 파일)",
        ".next/standalone, .next/static, public",
        "package.json만",
      ],
      correctIndex: 2,
      explanation:
        "standalone 빌드의 결과물(.next/standalone), 정적 파일(.next/static), public 디렉토리만 프로덕션 이미지에 복사하면 됩니다.",
    },
    {
      id: "q4",
      question: "NEXT_PUBLIC_ 접두사가 붙은 환경변수의 특징은?",
      choices: [
        "서버에서만 접근 가능하다",
        "빌드 타임에 인라인되어 클라이언트 번들에 포함된다",
        "런타임에 동적으로 변경할 수 있다",
        "Docker에서만 사용 가능하다",
      ],
      correctIndex: 1,
      explanation:
        "NEXT_PUBLIC_ 접두사가 붙은 환경변수는 빌드 타임에 값이 인라인되어 클라이언트 JavaScript 번들에 포함됩니다. 런타임에 변경할 수 없으므로 주의가 필요합니다.",
    },
    {
      id: "q5",
      question: "Edge Runtime을 선택해야 하는 경우는?",
      choices: [
        "데이터베이스 ORM(Prisma)을 사용할 때",
        "파일시스템(fs)에 접근할 때",
        "전 세계 사용자에게 빠른 응답이 필요한 경량 로직",
        "무거운 이미지 처리 로직",
      ],
      correctIndex: 2,
      explanation:
        "Edge Runtime은 전 세계 엣지 서버에서 실행되어 응답이 빠르지만, Node.js API 사용이 제한됩니다. 경량 로직(인증 체크, 리다이렉트)에 적합합니다.",
    },
  ],
};

export default chapter;
