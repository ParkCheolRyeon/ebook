import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "02-project-setup",
  subject: "next",
  title: "프로젝트 생성과 구조",
  description:
    "create-next-app으로 프로젝트 생성, app/ 디렉토리 구조, 주요 설정 파일, package.json 스크립트를 학습합니다.",
  order: 2,
  group: "기초",
  prerequisites: ["01-what-is-nextjs"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "`create-next-app`은 **아파트 분양**과 같습니다.\n\n" +
        "직접 집을 지으려면 기초 공사부터 배관, 전기, 인테리어까지 모든 것을 하나하나 해야 합니다. " +
        "하지만 분양 아파트는 입주하면 이미 수도(라우팅), 전기(빌드 시스템), 가스(TypeScript 설정)가 갖춰져 있어서, " +
        "가구(비즈니스 로직)만 들여놓으면 됩니다.\n\n" +
        "`app/` 디렉토리는 아파트의 **평면도**입니다. 거실(홈페이지), 침실(서브 페이지), 주방(API 라우트)의 위치가 " +
        "정해져 있듯이, 폴더 구조가 곧 애플리케이션의 URL 구조를 결정합니다.\n\n" +
        "`next.config.js`는 **관리사무소 규정**입니다. 건물 전체에 적용되는 규칙 — 이미지 도메인 허용 목록, " +
        "리다이렉트 규칙, 환경변수 설정 등 — 을 한 곳에서 관리합니다. 개별 세대(페이지)에서 이 규칙을 따로 설정할 필요가 없습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "새 프로젝트를 시작할 때 반복되는 설정 작업은 생산성을 떨어뜨리고 실수를 유발합니다.\n\n" +
        "### 1. 보일러플레이트 반복\n" +
        "TypeScript 설정, ESLint 규칙, Tailwind CSS 구성, 빌드 도구 설정을 매번 처음부터 해야 합니다. " +
        "한 프로젝트에서 잘 동작하던 설정이 다른 프로젝트에서는 버전 충돌을 일으키기도 합니다.\n\n" +
        "### 2. 디렉토리 구조의 모호함\n" +
        "React 프로젝트에는 표준 디렉토리 구조가 없습니다. 컴포넌트를 `components/`에 넣을지, " +
        "`features/`에 넣을지, 페이지를 어디에 만들지 팀마다 다릅니다. 이는 온보딩 비용을 높입니다.\n\n" +
        "### 3. 설정 파일 간 의존성\n" +
        "`tsconfig.json`의 paths 설정, `next.config.js`의 플러그인, `.env` 파일의 변수 이름 규칙이 " +
        "서로 맞아야 하는데, 문서를 오가며 확인하는 것이 번거롭습니다.\n\n" +
        "### 4. 개발/프로덕션 환경 차이\n" +
        "개발 서버(HMR, 에러 오버레이)와 프로덕션 빌드(최적화, 압축)의 설정이 일관되게 관리되어야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js는 `create-next-app` CLI와 **규약 기반 디렉토리 구조**로 이 문제를 해결합니다.\n\n" +
        "### create-next-app\n" +
        "`npx create-next-app@latest my-app` 한 줄로 TypeScript, ESLint, Tailwind CSS, App Router가 " +
        "설정된 프로젝트가 생성됩니다. 대화형 프롬프트에서 옵션을 선택하거나, `--typescript --tailwind --eslint --app` " +
        "플래그로 자동화할 수 있습니다.\n\n" +
        "### app/ 디렉토리 구조\n" +
        "App Router에서 `app/` 디렉토리가 애플리케이션의 핵심입니다:\n" +
        "- `app/page.tsx` → `/` 경로\n" +
        "- `app/about/page.tsx` → `/about` 경로\n" +
        "- `app/layout.tsx` → 모든 페이지의 공통 레이아웃\n" +
        "- `app/api/` → API 엔드포인트\n\n" +
        "### 주요 설정 파일\n" +
        "- **`next.config.js`** (또는 `.mjs`, `.ts`): 이미지 도메인, 리다이렉트, 환경변수 노출 등 Next.js 전체 설정\n" +
        "- **`tsconfig.json`**: TypeScript 설정. `@/` 경로 별칭이 기본 포함\n" +
        "- **`tailwind.config.ts`**: Tailwind CSS 커스텀 설정\n" +
        "- **`.env.local`**: 로컬 환경변수 (Git에 포함되지 않음)\n\n" +
        "### package.json 스크립트\n" +
        "- `dev`: 개발 서버 (HMR, Fast Refresh)\n" +
        "- `build`: 프로덕션 빌드\n" +
        "- `start`: 빌드된 앱 실행\n" +
        "- `lint`: ESLint 검사",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 프로젝트 생성과 설정 파일",
      content:
        "create-next-app으로 프로젝트를 생성하고, 핵심 설정 파일들의 역할을 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// 터미널에서 프로젝트 생성\n' +
          '// npx create-next-app@latest my-blog \\\n' +
          '//   --typescript --tailwind --eslint --app --src-dir --use-npm\n\n' +
          '// === 생성된 프로젝트 구조 ===\n' +
          '// my-blog/\n' +
          '// ├── src/\n' +
          '// │   └── app/\n' +
          '// │       ├── layout.tsx      # Root Layout (필수)\n' +
          '// │       ├── page.tsx        # 홈페이지 ("/") \n' +
          '// │       ├── globals.css     # 전역 스타일\n' +
          '// │       └── favicon.ico     # 파비콘\n' +
          '// ├── public/                 # 정적 파일 (이미지, 폰트 등)\n' +
          '// ├── next.config.ts          # Next.js 설정\n' +
          '// ├── tsconfig.json           # TypeScript 설정\n' +
          '// ├── tailwind.config.ts      # Tailwind 설정\n' +
          '// ├── postcss.config.mjs      # PostCSS 설정\n' +
          '// ├── package.json            # 의존성 및 스크립트\n' +
          '// └── .eslintrc.json          # ESLint 설정\n\n' +
          '// === next.config.ts ===\n' +
          'import type { NextConfig } from "next";\n\n' +
          'const nextConfig: NextConfig = {\n' +
          '  // 외부 이미지 도메인 허용\n' +
          '  images: {\n' +
          '    remotePatterns: [\n' +
          '      {\n' +
          '        protocol: "https",\n' +
          '        hostname: "images.example.com",\n' +
          '      },\n' +
          '    ],\n' +
          '  },\n' +
          '  // URL 리다이렉트\n' +
          '  async redirects() {\n' +
          '    return [\n' +
          '      {\n' +
          '        source: "/old-blog",\n' +
          '        destination: "/blog",\n' +
          '        permanent: true,\n' +
          '      },\n' +
          '    ];\n' +
          '  },\n' +
          '};\n\n' +
          'export default nextConfig;',
        description:
          "create-next-app이 생성하는 프로젝트 구조와 next.config.ts 설정 파일의 기본 구성을 보여줍니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 프로젝트 구조 확장하기",
      content:
        "기본 생성된 프로젝트에 블로그 관련 페이지와 컴포넌트를 추가하여 실제 프로젝트 구조를 구성해봅니다. " +
        "폴더를 만들면 라우트가 되는 것과, 공용 컴포넌트를 분리하는 패턴을 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// 확장된 프로젝트 구조:\n' +
          '// src/\n' +
          '// ├── app/\n' +
          '// │   ├── layout.tsx\n' +
          '// │   ├── page.tsx              # "/"\n' +
          '// │   ├── blog/\n' +
          '// │   │   ├── page.tsx           # "/blog" (목록)\n' +
          '// │   │   └── [slug]/\n' +
          '// │   │       └── page.tsx       # "/blog/my-post" (상세)\n' +
          '// │   └── api/\n' +
          '// │       └── posts/\n' +
          '// │           └── route.ts       # "GET /api/posts"\n' +
          '// ├── components/\n' +
          '// │   ├── Header.tsx\n' +
          '// │   └── Footer.tsx\n' +
          '// └── lib/\n' +
          '//     └── utils.ts\n\n' +
          '// === tsconfig.json (경로 별칭) ===\n' +
          '// "paths": { "@/*": ["./src/*"] }\n' +
          '// → import { formatDate } from "@/lib/utils" 로 사용 가능\n\n' +
          '// === src/components/Header.tsx ===\n' +
          'import Link from "next/link";\n\n' +
          'export default function Header() {\n' +
          '  return (\n' +
          '    <header className="flex gap-4 p-4 border-b">\n' +
          '      <Link href="/">홈</Link>\n' +
          '      <Link href="/blog">블로그</Link>\n' +
          '    </header>\n' +
          '  );\n' +
          '}\n\n' +
          '// === src/app/layout.tsx ===\n' +
          'import Header from "@/components/Header";\n' +
          'import "./globals.css";\n\n' +
          'export const metadata = {\n' +
          '  title: "내 블로그",\n' +
          '  description: "Next.js로 만든 블로그",\n' +
          '};\n\n' +
          'export default function RootLayout({\n' +
          '  children,\n' +
          '}: {\n' +
          '  children: React.ReactNode;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <html lang="ko">\n' +
          '      <body>\n' +
          '        <Header />\n' +
          '        <main className="max-w-4xl mx-auto p-4">\n' +
          '          {children}\n' +
          '        </main>\n' +
          '      </body>\n' +
          '    </html>\n' +
          '  );\n' +
          '}\n\n' +
          '// === package.json 스크립트 ===\n' +
          '// "scripts": {\n' +
          '//   "dev": "next dev",        ← 개발 서버 (localhost:3000)\n' +
          '//   "build": "next build",    ← 프로덕션 빌드\n' +
          '//   "start": "next start",    ← 빌드된 앱 실행\n' +
          '//   "lint": "next lint"       ← ESLint 검사\n' +
          '// }',
        description:
          "app/ 내에 폴더를 추가하면 라우트가 생기고, app/ 바깥의 components/, lib/는 라우트에 영향을 주지 않는 공용 코드 영역입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 항목 | 설명 |\n" +
        "|------|------|\n" +
        "| `create-next-app` | 프로젝트 생성 CLI, TypeScript/Tailwind/ESLint 자동 설정 |\n" +
        "| `app/` 디렉토리 | App Router의 핵심, 폴더 = URL 경로 |\n" +
        "| `page.tsx` | 해당 경로의 UI를 정의하는 파일 |\n" +
        "| `layout.tsx` | 자식 라우트에 공유되는 레이아웃 |\n" +
        "| `next.config.ts` | Next.js 전체 설정 (이미지, 리다이렉트 등) |\n" +
        "| `tsconfig.json` | TypeScript 설정, `@/` 경로 별칭 |\n" +
        "| `public/` | 정적 파일 디렉토리 (빌드 없이 직접 제공) |\n" +
        "| `src/` | 소스코드 루트 (선택사항이지만 권장) |\n\n" +
        "**핵심:** `create-next-app`으로 시작하고, `app/` 디렉토리가 라우팅의 기반이 된다. " +
        "폴더 구조가 곧 URL 구조이며, 설정 파일들은 프레임워크가 미리 구성해준다.\n\n" +
        "**다음 챕터 미리보기:** `app/` 디렉토리에서 폴더와 파일이 어떻게 URL 경로가 되는지, " +
        "동적 라우트와 특수 파일 규약을 자세히 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "create-next-app으로 시작하고, app/ 디렉토리가 라우팅의 기반이 된다. 폴더 구조가 곧 URL 구조다.",
  checklist: [
    "create-next-app으로 새 프로젝트를 생성할 수 있다",
    "app/ 디렉토리에서 폴더와 page.tsx의 관계를 이해한다",
    "next.config.ts의 역할과 주요 설정 항목을 알고 있다",
    "package.json의 dev, build, start, lint 스크립트의 역할을 구분할 수 있다",
    "@/ 경로 별칭의 설정 위치와 사용법을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Next.js 프로젝트를 생성하는 올바른 명령어는?",
      choices: [
        "npm init next-app my-app",
        "npx create-next-app@latest my-app",
        "npx next init my-app",
        "npm create next my-app",
      ],
      correctIndex: 1,
      explanation:
        "npx create-next-app@latest가 공식 프로젝트 생성 CLI입니다. @latest를 붙이면 항상 최신 버전으로 생성합니다.",
    },
    {
      id: "q2",
      question: "App Router에서 '/' 경로의 페이지를 정의하는 파일 위치는?",
      choices: [
        "app/index.tsx",
        "app/page.tsx",
        "pages/index.tsx",
        "app/home/page.tsx",
      ],
      correctIndex: 1,
      explanation:
        "App Router에서는 app/page.tsx가 루트 경로('/')의 UI를 정의합니다. Pages Router의 pages/index.tsx와 혼동하지 마세요.",
    },
    {
      id: "q3",
      question: "public/ 디렉토리에 넣은 파일의 접근 방법은?",
      choices: [
        "import 구문으로 가져온다",
        "루트 URL에서 직접 접근한다 (예: /logo.png)",
        "next.config.ts에 등록해야 접근할 수 있다",
        "API Route를 통해서만 접근할 수 있다",
      ],
      correctIndex: 1,
      explanation:
        "public/ 디렉토리의 파일은 빌드 과정 없이 루트 URL에서 직접 접근할 수 있습니다. public/logo.png는 /logo.png로 접근합니다.",
    },
    {
      id: "q4",
      question: "next build 명령어의 역할은?",
      choices: [
        "개발 서버를 실행한다",
        "프로덕션용으로 애플리케이션을 최적화 빌드한다",
        "빌드된 애플리케이션을 실행한다",
        "ESLint 검사를 수행한다",
      ],
      correctIndex: 1,
      explanation:
        "next build는 프로덕션 배포를 위해 애플리케이션을 최적화(코드 스플리팅, 압축, 정적 생성 등)합니다. 개발 서버는 next dev, 실행은 next start입니다.",
    },
    {
      id: "q5",
      question: "tsconfig.json의 paths에 설정된 '@/*'의 역할은?",
      choices: [
        "npm 패키지를 의미한다",
        "src/ 디렉토리를 기준으로 한 경로 별칭이다",
        "환경변수 접두사이다",
        "Next.js 내부 모듈을 참조한다",
      ],
      correctIndex: 1,
      explanation:
        "'@/*'는 src/ 디렉토리를 기준으로 한 경로 별칭입니다. '@/components/Header'는 'src/components/Header'를 의미하며, 상대경로('../../components/Header')보다 깔끔합니다.",
    },
  ],
};

export default chapter;
