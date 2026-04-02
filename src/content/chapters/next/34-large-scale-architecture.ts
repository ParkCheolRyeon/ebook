import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "34-large-scale-architecture",
  subject: "next",
  title: "대규모 Next.js 설계",
  description:
    "대규모 Next.js 프로젝트를 위한 폴더 구조 전략, Turborepo 모노레포, 공유 패키지, 성능 모니터링, 로깅, 팀 컨벤션 등 아키텍처 설계 원칙을 학습합니다.",
  order: 34,
  group: "아키텍처",
  prerequisites: ["33-pages-router"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "대규모 Next.js 설계는 **도시 계획**과 같습니다.\n\n" +
        "작은 마을(소규모 프로젝트)에서는 모든 건물이 한 거리에 모여 있어도 괜찮습니다. 하지만 도시(대규모 프로젝트)가 되면 **구역 계획**이 필요합니다.\n\n" +
        "**Feature 기반 폴더 구조**는 도시를 기능별 구역으로 나누는 것입니다. 주거 구역, 상업 구역, 공업 구역처럼, `features/auth`, `features/dashboard`, `features/billing`으로 나눕니다. 각 구역은 자체적으로 완결된 인프라를 갖습니다.\n\n" +
        "**Turborepo 모노레포**는 하나의 도시 행정구역 안에 여러 독립 도시(앱)를 관리하는 것입니다. 공항(공유 UI 라이브러리), 고속도로(공유 유틸리티), 상수도(공유 설정)는 함께 관리하면서, 각 도시는 독립적으로 발전합니다.\n\n" +
        "**성능 모니터링**은 도시의 교통 관제 시스템입니다. 어디서 정체(병목)가 발생하는지 실시간으로 파악해야 적시에 대응할 수 있습니다. 모니터링 없이 최적화하는 것은 지도 없이 도로를 건설하는 것과 같습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프로젝트가 성장하면 초기의 간단한 구조로는 한계에 부딪힙니다.\n\n" +
        "1. **폴더 구조 혼란** — `components/`에 100개 이상의 파일이 쌓이면, 특정 컴포넌트가 어디에 있는지 찾기 어렵습니다. 어떤 컴포넌트가 어떤 기능에 속하는지 알 수 없어 의존성이 얽힙니다.\n\n" +
        "2. **코드 중복** — 여러 Next.js 앱(고객용, 관리자용, 마케팅)이 있을 때, UI 컴포넌트와 유틸리티가 각 프로젝트에 복사-붙여넣기됩니다. 하나의 버그를 수정하려면 여러 프로젝트를 동시에 수정해야 합니다.\n\n" +
        "3. **빌드 시간 증가** — 프로젝트가 커질수록 빌드 시간이 길어집니다. 하나의 파일만 변경해도 전체를 다시 빌드하면 개발 생산성이 급격히 떨어집니다.\n\n" +
        "4. **성능 퇴화** — 기능이 추가될수록 번들 크기가 커지고, 응답 시간이 느려지는데, 어디가 병목인지 파악하기 어렵습니다. 서버 에러가 발생해도 어떤 요청에서 문제가 생겼는지 추적하기 힘듭니다.\n\n" +
        "5. **팀 협업 충돌** — 10명 이상의 개발자가 같은 코드베이스에서 작업하면, 코딩 스타일 차이, 파일 위치 불일치, PR 충돌이 빈번합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "체계적인 아키텍처 전략으로 대규모 프로젝트의 복잡성을 관리합니다.\n\n" +
        "### 1. Feature 기반 폴더 구조\n" +
        "기능(feature) 단위로 폴더를 나누면 관련 코드가 한곳에 모입니다. 각 feature는 자체 컴포넌트, 훅, 타입, 테스트를 포함합니다. Layer 기반(`components/`, `hooks/`, `utils/`)보다 기능 간 의존성을 명확히 파악할 수 있습니다.\n\n" +
        "### 2. Turborepo 모노레포\n" +
        "여러 Next.js 앱과 공유 패키지를 하나의 레포에서 관리합니다. Turborepo는 영향받은 패키지만 빌드하는 증분 빌드와 원격 캐시를 제공하여 빌드 시간을 크게 단축합니다.\n\n" +
        "### 3. 공유 패키지\n" +
        "`packages/ui`, `packages/config`, `packages/utils`로 공통 코드를 패키지화합니다. 한 번 수정하면 모든 앱에 반영됩니다.\n\n" +
        "### 4. 성능 모니터링\n" +
        "Sentry(에러 추적), Datadog/New Relic(APM), Next.js의 내장 분석(Web Vitals)을 활용합니다.\n\n" +
        "### 5. 팀 컨벤션\n" +
        "ESLint 규칙, Prettier 설정, 파일 네이밍 규칙, import 정렬을 코드로 강제합니다. 기술 결정보다 일관성이 더 중요합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Feature 기반 구조와 Turborepo",
      content:
        "Feature 기반 폴더 구조는 각 기능을 독립된 모듈로 관리합니다. Turborepo는 turbo.json에서 빌드 파이프라인을 정의하고, 영향받은 패키지만 빌드합니다. 공유 패키지는 내부 패키지(internal packages)로 설정하여 빌드 없이 바로 사용할 수 있습니다.",
      code: {
        language: "typescript",
        code:
          '// Feature 기반 폴더 구조\n' +
          '// src/\n' +
          '//   features/\n' +
          '//     auth/\n' +
          '//       components/    LoginForm.tsx, SignupForm.tsx\n' +
          '//       hooks/         useAuth.ts, useSession.ts\n' +
          '//       actions/       login.ts, signup.ts\n' +
          '//       types.ts\n' +
          '//       __tests__/\n' +
          '//     dashboard/\n' +
          '//       components/    Chart.tsx, StatsCard.tsx\n' +
          '//       hooks/         useDashboardData.ts\n' +
          '//       types.ts\n' +
          '//     billing/\n' +
          '//       components/    PricingTable.tsx, Invoice.tsx\n' +
          '//       hooks/         useSubscription.ts\n' +
          '//       types.ts\n' +
          '//   shared/\n' +
          '//     components/      Button.tsx, Modal.tsx (공통 UI)\n' +
          '//     hooks/           useDebounce.ts (공통 훅)\n' +
          '//     lib/             database.ts, auth.ts\n' +
          '\n' +
          '// Turborepo 모노레포 구조\n' +
          '// my-monorepo/\n' +
          '//   apps/\n' +
          '//     web/          Next.js 고객용 앱\n' +
          '//     admin/        Next.js 관리자 앱\n' +
          '//     docs/         Next.js 문서 사이트\n' +
          '//   packages/\n' +
          '//     ui/           공유 UI 컴포넌트\n' +
          '//     config/       공유 설정 (ESLint, TS)\n' +
          '//     utils/        공유 유틸리티\n' +
          '\n' +
          '// turbo.json — 빌드 파이프라인 정의\n' +
          'const turboConfig = {\n' +
          '  "$schema": "https://turbo.build/schema.json",\n' +
          '  tasks: {\n' +
          '    build: {\n' +
          '      dependsOn: ["^build"],  // 의존 패키지 먼저 빌드\n' +
          '      outputs: [".next/**", "!.next/cache/**"],\n' +
          '    },\n' +
          '    lint: {},\n' +
          '    test: {\n' +
          '      dependsOn: ["^build"],\n' +
          '    },\n' +
          '    dev: {\n' +
          '      cache: false,\n' +
          '      persistent: true,\n' +
          '    },\n' +
          '  },\n' +
          '};\n' +
          '\n' +
          '// packages/ui/package.json\n' +
          'const uiPackageJson = {\n' +
          '  name: "@myapp/ui",\n' +
          '  exports: {\n' +
          '    ".": "./src/index.ts",\n' +
          '    "./button": "./src/Button.tsx",\n' +
          '    "./modal": "./src/Modal.tsx",\n' +
          '  },\n' +
          '};\n' +
          '\n' +
          '// apps/web에서 공유 패키지 사용\n' +
          'import { Button } from "@myapp/ui/button";\n' +
          'import { formatDate } from "@myapp/utils";',
        description:
          "Feature 기반 폴더 구조, Turborepo 파이프라인 설정, 공유 패키지 구성을 보여줍니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 성능 모니터링과 팀 컨벤션",
      content:
        "Sentry로 에러를 추적하고, Next.js의 내장 Web Vitals 리포팅으로 성능을 모니터링합니다. Barrel exports(index.ts 재export)로 깔끔한 import 경로를 유지하고, ESLint 규칙으로 import 순서와 기능 간 의존성 방향을 강제합니다. 환경별 분기는 설정 파일로 중앙화합니다.",
      code: {
        language: "typescript",
        code:
          '// instrumentation.ts — Sentry 초기화 (Next.js 내장 지원)\n' +
          'export async function register() {\n' +
          '  if (process.env.NEXT_RUNTIME === "nodejs") {\n' +
          '    const Sentry = await import("@sentry/nextjs");\n' +
          '    Sentry.init({\n' +
          '      dsn: process.env.SENTRY_DSN,\n' +
          '      tracesSampleRate: 0.1,\n' +
          '      environment: process.env.NODE_ENV,\n' +
          '    });\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// app/layout.tsx — Web Vitals 리포팅\n' +
          'import { SpeedInsights } from "@vercel/speed-insights/next";\n' +
          'import { Analytics } from "@vercel/analytics/react";\n' +
          '\n' +
          'export default function RootLayout({\n' +
          '  children,\n' +
          '}: {\n' +
          '  children: React.ReactNode;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <html lang="ko">\n' +
          '      <body>\n' +
          '        {children}\n' +
          '        <SpeedInsights />\n' +
          '        <Analytics />\n' +
          '      </body>\n' +
          '    </html>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// src/features/auth/index.ts — Barrel export\n' +
          'export { LoginForm } from "./components/LoginForm";\n' +
          'export { SignupForm } from "./components/SignupForm";\n' +
          'export { useAuth } from "./hooks/useAuth";\n' +
          'export type { User, Session } from "./types";\n' +
          '\n' +
          '// 다른 feature에서 깔끔하게 import\n' +
          'import { useAuth } from "@/features/auth";\n' +
          'import type { User } from "@/features/auth";\n' +
          '\n' +
          '// .eslintrc.js — import 정렬과 경계 규칙\n' +
          'const eslintConfig = {\n' +
          '  rules: {\n' +
          '    "import/order": [\n' +
          '      "error",\n' +
          '      {\n' +
          '        groups: [\n' +
          '          "builtin",\n' +
          '          "external",\n' +
          '          "internal",\n' +
          '          "parent",\n' +
          '          "sibling",\n' +
          '        ],\n' +
          '        "newlines-between": "always",\n' +
          '      },\n' +
          '    ],\n' +
          '    // features 간 직접 import 금지 규칙\n' +
          '    "no-restricted-imports": [\n' +
          '      "error",\n' +
          '      {\n' +
          '        patterns: [\n' +
          '          {\n' +
          '            group: ["@/features/*/components/*"],\n' +
          '            message:\n' +
          '              "feature의 내부 컴포넌트를 직접 import하지 마세요. " +\n' +
          '              "barrel export(index.ts)를 사용하세요.",\n' +
          '          },\n' +
          '        ],\n' +
          '      },\n' +
          '    ],\n' +
          '  },\n' +
          '};',
        description:
          "Sentry 에러 추적, Web Vitals 모니터링, barrel export, ESLint 경계 규칙을 보여줍니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 전략 | 도구/방법 | 효과 |\n" +
        "|------|----------|------|\n" +
        "| 폴더 구조 | Feature 기반 구조 | 관련 코드 응집, 의존성 명확화 |\n" +
        "| 모노레포 | Turborepo | 공유 코드 관리, 증분 빌드 |\n" +
        "| 공유 패키지 | packages/ 내부 패키지 | 코드 중복 제거 |\n" +
        "| 성능 모니터링 | Sentry, Web Vitals | 에러 추적, 성능 병목 파악 |\n" +
        "| 팀 컨벤션 | ESLint, Prettier | 일관된 코드 스타일 강제 |\n\n" +
        "**핵심:** 대규모 Next.js 앱은 feature 기반 폴더 구조로 코드를 조직하고, Turborepo 모노레포로 여러 앱과 공유 패키지를 효율적으로 관리합니다. 기술 결정 자체보다 팀 전체의 컨벤션 일관성이 프로젝트 성공에 더 큰 영향을 미칩니다.\n\n" +
        "**다음 챕터 미리보기:** Pages Router에서 App Router로 마이그레이션하는 실전 전략과 단계별 가이드를 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "대규모 Next.js 앱은 feature 기반 폴더 구조, Turborepo 모노레포, 공유 패키지 전략으로 복잡성을 관리한다. 기술 결정보다 팀 컨벤션의 일관성이 더 중요하다.",
  checklist: [
    "Feature 기반과 Layer 기반 폴더 구조의 차이를 설명할 수 있다",
    "Turborepo 모노레포의 장점과 설정 방법을 이해한다",
    "공유 패키지(internal packages)를 구성할 수 있다",
    "Sentry와 Web Vitals로 성능 모니터링을 설정할 수 있다",
    "ESLint로 import 순서와 feature 경계 규칙을 강제할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Feature 기반 폴더 구조의 장점이 아닌 것은?",
      choices: [
        "관련 코드가 한 폴더에 모여 응집도가 높다",
        "기능 간 의존성을 명확히 파악할 수 있다",
        "모든 컴포넌트를 한 곳에서 알파벳순으로 찾을 수 있다",
        "기능 단위로 독립적인 개발이 가능하다",
      ],
      correctIndex: 2,
      explanation:
        "Feature 기반 구조는 기능별로 파일을 분산시키므로, 모든 컴포넌트를 한 곳에서 찾는 것은 Layer 기반(components/) 구조의 특징입니다.",
    },
    {
      id: "q2",
      question: "Turborepo의 핵심 기능은?",
      choices: [
        "TypeScript 컴파일을 대체한다",
        "영향받은 패키지만 빌드하는 증분 빌드와 원격 캐시",
        "Next.js를 자동으로 배포한다",
        "코드 리뷰를 자동화한다",
      ],
      correctIndex: 1,
      explanation:
        "Turborepo는 변경된 패키지와 그 의존 패키지만 빌드하는 증분 빌드와, 빌드 결과를 팀원과 공유하는 원격 캐시로 빌드 시간을 크게 단축합니다.",
    },
    {
      id: "q3",
      question: "모노레포에서 공유 UI 패키지를 사용하는 올바른 방법은?",
      choices: [
        "npm에 퍼블리시한 후 install한다",
        "파일을 복사-붙여넣기한다",
        "packages/ui에 내부 패키지를 만들고 workspace로 참조한다",
        "git submodule로 연결한다",
      ],
      correctIndex: 2,
      explanation:
        "모노레포에서는 packages/ 디렉토리에 내부 패키지를 만들고, workspace 설정으로 앱에서 직접 참조합니다. npm 퍼블리시 없이 즉시 사용 가능합니다.",
    },
    {
      id: "q4",
      question: "Next.js에서 Sentry를 초기화하는 권장 위치는?",
      choices: [
        "pages/_app.tsx",
        "next.config.ts",
        "instrumentation.ts",
        "middleware.ts",
      ],
      correctIndex: 2,
      explanation:
        "Next.js의 instrumentation.ts는 서버 시작 시 한 번 실행되는 파일로, Sentry 같은 모니터링 도구를 초기화하는 공식 권장 위치입니다.",
    },
    {
      id: "q5",
      question: "대규모 팀에서 가장 중요한 아키텍처 원칙은?",
      choices: [
        "최신 기술 스택을 항상 도입한다",
        "가능한 많은 추상화 레이어를 만든다",
        "팀 전체의 컨벤션 일관성을 유지한다",
        "마이크로 프론트엔드를 반드시 적용한다",
      ],
      correctIndex: 2,
      explanation:
        "기술 결정 자체보다 팀 전체가 일관된 컨벤션을 따르는 것이 코드 품질과 유지보수성에 더 큰 영향을 미칩니다. ESLint, Prettier 등으로 컨벤션을 코드로 강제하는 것이 중요합니다.",
    },
  ],
};

export default chapter;
