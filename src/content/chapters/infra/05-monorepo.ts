import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "05-monorepo",
  subject: "infra",
  title: "모노레포와 Turborepo",
  description:
    "모노레포의 장단점을 이해하고 Turborepo로 빌드 캐싱과 병렬 실행을 구현하는 방법을 배웁니다.",
  order: 5,
  group: "패키지 관리",
  prerequisites: ["04-package-managers"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "모노레포와 폴리레포는 식당 운영 방식의 차이입니다.\n\n" +
        "**폴리레포(Polyrepo)**는 독립 매장 체인입니다. 각 매장(저장소)이 자체 주방(빌드 시스템), " +
        "자체 메뉴판(설정 파일), 자체 식재료 창고(node_modules)를 갖습니다. " +
        "독립적이지만, 전 매장 메뉴 변경 시 매장마다 개별 작업이 필요하고, " +
        "공통 소스를 공유하기 위해 npm에 패키지를 발행해야 합니다.\n\n" +
        "**모노레포(Monorepo)**는 푸드코트입니다. 여러 주방(패키지)이 같은 건물(저장소)에 있고, " +
        "공용 식재료 창고와 공용 설비를 공유합니다. 한 곳에서 모든 것을 관리하니 일관성이 높지만, " +
        "건물이 커지면 관리가 복잡해집니다.\n\n" +
        "**Turborepo**는 이 푸드코트의 스마트 주방 관리 시스템입니다. " +
        "어떤 주방이 어떤 주문(태스크)을 처리해야 하는지 파악하고, " +
        "이전에 만든 적 있는 요리는 캐시에서 바로 내보내며, " +
        "독립적인 주문은 동시에 여러 주방에서 병렬로 처리합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "여러 프론트엔드 프로젝트를 운영하면서 겪는 대표적인 문제들입니다.\n\n" +
        "1. **코드 중복** — 웹 앱, 관리자 페이지, 모바일 앱에서 동일한 UI 컴포넌트, " +
        "유틸리티 함수, 타입 정의를 복사해서 사용합니다. 하나를 수정하면 나머지도 일일이 업데이트해야 합니다.\n\n" +
        "2. **설정 파산** — ESLint, Prettier, TypeScript 설정이 프로젝트마다 조금씩 다릅니다. " +
        "규칙 하나를 추가하려면 모든 프로젝트의 설정을 수정해야 합니다.\n\n" +
        "3. **내부 패키지 배포의 고통** — 공유 라이브러리를 npm에 발행하고, " +
        "소비하는 프로젝트에서 버전을 올리고, 문제가 생기면 다시 패키지를 수정하고 발행하는 " +
        "사이클이 매우 느립니다.\n\n" +
        "4. **CI 시간 폭증** — 모노레포를 단순하게 구성하면 작은 변경에도 " +
        "모든 패키지의 빌드와 테스트가 실행됩니다. 10분짜리 CI가 30분으로 늘어납니다.\n\n" +
        "5. **의존성 그래프 관리** — 패키지 A가 B에 의존하고, B가 C에 의존할 때 " +
        "빌드 순서를 올바르게 지정하지 않으면 빌드가 실패합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### Workspace 설정\n" +
        "패키지 매니저의 workspace 기능으로 모노레포를 구성합니다.\n" +
        "- npm: `package.json`의 `workspaces` 필드\n" +
        "- yarn: `package.json`의 `workspaces` 필드\n" +
        "- pnpm: `pnpm-workspace.yaml` 파일\n\n" +
        "workspace 내 패키지 간 의존성은 `workspace:*` 프로토콜로 참조하여 " +
        "로컬 패키지를 직접 사용합니다.\n\n" +
        "### Turborepo의 핵심 기능\n" +
        "- **태스크 캐싱**: 입력(소스코드, 설정)이 변경되지 않았으면 이전 빌드 결과를 재사용합니다.\n" +
        "- **병렬 실행**: 의존성이 없는 태스크는 동시에 실행하여 전체 시간을 단축합니다.\n" +
        "- **리모트 캐시**: 팀원 A가 빌드한 결과를 팀원 B와 CI가 재사용합니다.\n" +
        "- **의존성 인식**: 패키지 간 의존성 그래프를 분석하여 올바른 순서로 빌드합니다.\n\n" +
        "### 공유 설정 패키지\n" +
        "ESLint, TypeScript 설정을 내부 패키지로 만들어 모든 앱에서 extends합니다. " +
        "설정을 한 곳에서 관리하면 일관성이 유지됩니다.\n\n" +
        "### Nx 대안\n" +
        "Nx는 Turborepo와 유사한 기능에 더해 코드 생성기, 의존성 시각화, " +
        "영향받는 프로젝트 감지(affected) 등 더 풍부한 기능을 제공합니다. " +
        "다만 학습 곡선이 더 높습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Turborepo 설정",
      content:
        "pnpm workspace와 Turborepo를 조합한 모노레포 프로젝트의 설정을 살펴봅니다. " +
        "turbo.json에서 태스크 파이프라인을 정의하고, 캐싱을 구성합니다.",
      code: {
        language: "typescript",
        code:
          '// === 프로젝트 구조 ===\n' +
          '// monorepo/\n' +
          '// ├── apps/\n' +
          '// │   ├── web/          ← Next.js 앱\n' +
          '// │   └── admin/        ← Next.js 관리자 앱\n' +
          '// ├── packages/\n' +
          '// │   ├── ui/           ← 공유 UI 컴포넌트\n' +
          '// │   ├── utils/        ← 공유 유틸리티\n' +
          '// │   ├── tsconfig/     ← 공유 TS 설정\n' +
          '// │   └── eslint-config/← 공유 ESLint 설정\n' +
          '// ├── turbo.json\n' +
          '// ├── pnpm-workspace.yaml\n' +
          '// └── package.json\n' +
          '\n' +
          '// === pnpm-workspace.yaml ===\n' +
          'const pnpmWorkspace = `\n' +
          'packages:\n' +
          '  - "apps/*"\n' +
          '  - "packages/*"\n' +
          '`;\n' +
          '\n' +
          '// === turbo.json ===\n' +
          'const turboConfig = {\n' +
          '  "$schema": "https://turbo.build/schema.json",\n' +
          '  tasks: {\n' +
          '    build: {\n' +
          '      dependsOn: ["^build"],  // 의존 패키지 먼저 빌드\n' +
          '      outputs: [".next/**", "dist/**"],\n' +
          '      inputs: ["src/**", "tsconfig.json"],\n' +
          '    },\n' +
          '    lint: {\n' +
          '      dependsOn: [],  // 병렬 실행 가능\n' +
          '    },\n' +
          '    test: {\n' +
          '      dependsOn: ["^build"],\n' +
          '    },\n' +
          '    dev: {\n' +
          '      cache: false,   // dev 서버는 캐싱 불필요\n' +
          '      persistent: true,\n' +
          '    },\n' +
          '  },\n' +
          '};\n' +
          '\n' +
          '// === 루트 package.json ===\n' +
          'const rootPackageJson = {\n' +
          '  name: "monorepo",\n' +
          '  private: true,\n' +
          '  scripts: {\n' +
          '    build: "turbo run build",\n' +
          '    lint: "turbo run lint",\n' +
          '    test: "turbo run test",\n' +
          '    dev: "turbo run dev --filter=web",\n' +
          '  },\n' +
          '  devDependencies: {\n' +
          '    turbo: "^2.0.0"\n' +
          '  }\n' +
          '};',
        description:
          "pnpm workspace + Turborepo 모노레포의 핵심 설정 파일 구조입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 공유 패키지와 워크스페이스",
      content:
        "내부 공유 패키지를 생성하고, 앱에서 workspace 프로토콜로 참조하는 실습을 합니다. " +
        "Turborepo의 필터링과 캐싱 확인 방법도 다룹니다.",
      code: {
        language: "typescript",
        code:
          '// === packages/ui/package.json ===\n' +
          'const uiPackageJson = {\n' +
          '  name: "@repo/ui",\n' +
          '  version: "0.0.0",\n' +
          '  main: "./src/index.ts",\n' +
          '  types: "./src/index.ts",\n' +
          '  exports: {\n' +
          '    ".": "./src/index.ts",\n' +
          '    "./button": "./src/Button.tsx"\n' +
          '  },\n' +
          '  peerDependencies: {\n' +
          '    react: "^18.0.0"\n' +
          '  }\n' +
          '};\n' +
          '\n' +
          '// === packages/ui/src/Button.tsx ===\n' +
          'interface ButtonProps {\n' +
          '  variant: "primary" | "secondary";\n' +
          '  children: React.ReactNode;\n' +
          '  onClick?: () => void;\n' +
          '}\n' +
          '\n' +
          'export function Button({ variant, children, onClick }: ButtonProps) {\n' +
          '  return (\n' +
          '    <button className={`btn btn-${variant}`} onClick={onClick}>\n' +
          '      {children}\n' +
          '    </button>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === apps/web/package.json에서 참조 ===\n' +
          'const webPackageJson = {\n' +
          '  name: "web",\n' +
          '  dependencies: {\n' +
          '    "@repo/ui": "workspace:*",    // 로컬 패키지 참조\n' +
          '    "@repo/utils": "workspace:*",\n' +
          '  }\n' +
          '};\n' +
          '\n' +
          '// === apps/web에서 사용 ===\n' +
          '// import { Button } from "@repo/ui/button";\n' +
          '\n' +
          '// === Turborepo CLI 명령어 ===\n' +
          '// pnpm turbo build                    # 전체 빌드\n' +
          '// pnpm turbo build --filter=web        # web 앱만 빌드\n' +
          '// pnpm turbo build --filter=web...     # web + 의존 패키지 빌드\n' +
          '// pnpm turbo build --dry-run            # 실행 계획만 확인\n' +
          '// pnpm turbo build --summarize          # 캐시 히트율 확인\n' +
          '\n' +
          '// === 리모트 캐시 설정 (Vercel) ===\n' +
          '// npx turbo login\n' +
          '// npx turbo link\n' +
          '// → 팀원 간 빌드 캐시 공유 활성화',
        description:
          "내부 패키지 구성, workspace 프로토콜 참조, Turborepo 캐싱 활용 방법입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 항목 | 모노레포 | 폴리레포 |\n" +
        "|------|----------|----------|\n" +
        "| 코드 공유 | 쉬움 (workspace) | 어려움 (npm 발행) |\n" +
        "| 설정 일관성 | 높음 | 낮음 |\n" +
        "| 의존성 관리 | 중앙 관리 | 프로젝트별 독립 |\n" +
        "| CI 복잡도 | 높음 (최적화 필요) | 낮음 |\n" +
        "| 저장소 크기 | 큼 | 작음 |\n\n" +
        "| Turborepo 기능 | 효과 |\n" +
        "|----------------|------|\n" +
        "| 태스크 캐싱 | 변경 없는 패키지 빌드 스킵 |\n" +
        "| 병렬 실행 | 빌드 시간 단축 |\n" +
        "| 리모트 캐시 | 팀 전체 빌드 시간 단축 |\n" +
        "| 의존성 그래프 | 올바른 빌드 순서 보장 |\n\n" +
        "**핵심:** 모노레포는 코드 공유와 일관성에 유리하고, Turborepo는 빌드 캐싱과 " +
        "병렬 실행으로 모노레포의 성능 문제를 해결합니다. " +
        "팀이 3명 이상이고 공유 코드가 있다면 모노레포를 고려하세요.\n\n" +
        "**다음 챕터 미리보기:** 모듈 번들러의 원리를 배워서 Webpack, Rollup, esbuild가 " +
        "소스 코드를 브라우저 실행 가능한 번들로 어떻게 변환하는지 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "모노레포는 코드 공유와 일관성에 유리하고, Turborepo는 빌드 캐싱과 병렬 실행으로 모노레포의 성능 문제를 해결한다. 팀이 3명 이상이고 공유 코드가 있다면 모노레포를 고려하라.",
  checklist: [
    "모노레포와 폴리레포의 장단점을 비교 설명할 수 있다",
    "pnpm workspace로 모노레포를 구성할 수 있다",
    "Turborepo의 태스크 캐싱과 병렬 실행 원리를 이해한다",
    "workspace:* 프로토콜로 내부 패키지를 참조할 수 있다",
    "turbo.json에서 태스크 파이프라인을 설정할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "모노레포의 가장 큰 장점은?",
      choices: [
        "저장소 크기가 작다",
        "CI 설정이 간단하다",
        "코드 공유와 설정 일관성이 쉽다",
        "빌드 속도가 무조건 빠르다",
      ],
      correctIndex: 2,
      explanation:
        "모노레포에서는 workspace 프로토콜로 패키지를 직접 참조하고, " +
        "ESLint/TypeScript 설정을 공유 패키지로 관리하여 " +
        "코드 공유와 설정 일관성을 쉽게 유지할 수 있습니다.",
    },
    {
      id: "q2",
      question: "turbo.json에서 dependsOn: ['^build']의 의미는?",
      choices: [
        "해당 패키지를 먼저 빌드한다",
        "의존하는 패키지들의 build를 먼저 실행한다",
        "빌드를 건너뛴다",
        "캐시를 무시하고 빌드한다",
      ],
      correctIndex: 1,
      explanation:
        "'^'는 의존성 그래프에서 상위(의존하는) 패키지를 의미합니다. " +
        "dependsOn: ['^build']는 현재 패키지가 의존하는 모든 패키지의 " +
        "build 태스크가 먼저 완료되어야 함을 나타냅니다.",
    },
    {
      id: "q3",
      question: "Turborepo의 리모트 캐시가 해결하는 문제는?",
      choices: [
        "패키지 간 의존성 충돌",
        "팀원 간 빌드 결과를 공유하여 중복 빌드를 방지",
        "코드 리뷰 자동화",
        "브랜치 간 머지 충돌",
      ],
      correctIndex: 1,
      explanation:
        "리모트 캐시를 사용하면 팀원 A가 빌드한 결과를 팀원 B와 CI가 재사용합니다. " +
        "같은 입력에 대한 빌드를 반복하지 않아 전체 팀의 빌드 시간이 크게 단축됩니다.",
    },
    {
      id: "q4",
      question: "workspace:* 프로토콜의 용도는?",
      choices: [
        "npm 레지스트리에서 최신 버전을 가져오기",
        "모노레포 내부 패키지를 직접 참조하기",
        "패키지를 글로벌로 설치하기",
        "의존성을 peer dependency로 설정하기",
      ],
      correctIndex: 1,
      explanation:
        "workspace:*는 모노레포 내부의 로컬 패키지를 직접 참조하는 프로토콜입니다. " +
        "npm에 발행하지 않고도 패키지 간 의존성을 설정할 수 있으며, " +
        "변경이 즉시 반영됩니다.",
    },
    {
      id: "q5",
      question: "pnpm turbo build --filter=web...의 '...'의 의미는?",
      choices: [
        "web 앱만 빌드한다",
        "web 앱과 그 모든 의존 패키지를 함께 빌드한다",
        "web 앱을 제외하고 빌드한다",
        "빌드를 무한 반복한다",
      ],
      correctIndex: 1,
      explanation:
        "--filter=web... 에서 '...'는 web이 의존하는 모든 패키지를 포함하라는 의미입니다. " +
        "web 앱이 @repo/ui와 @repo/utils에 의존하면, 이 패키지들도 함께 빌드됩니다.",
    },
  ],
};

export default chapter;
