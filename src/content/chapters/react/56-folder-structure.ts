import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "56-folder-structure",
  subject: "react",
  title: "폴더 구조와 아키텍처",
  description:
    "Feature 기반 구조, 레이어 기반 구조, Barrel exports, co-location 원칙, 모노레포 기초를 학습합니다.",
  order: 56,
  group: "설계 패턴과 아키텍처",
  prerequisites: ["55-error-boundary"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "폴더 구조는 **도서관 분류 체계**와 같습니다.\n\n" +
        "**기술 기반 구조(by type)**는 책을 '양장본', '문고본', '전자책'으로 분류하는 것입니다. 형태는 같지만, '소설을 찾으려면 세 곳을 다 뒤져야' 합니다.\n\n" +
        "**Feature 기반 구조(by feature)**는 '소설', '과학', '역사'로 분류하는 것입니다. 관련 자료가 한 곳에 모여 있어 찾기 쉽습니다.\n\n" +
        "**co-location**은 '참고 자료를 본문 옆에 두라'는 원칙입니다. 컴포넌트 파일, 테스트, 스타일, 타입을 같은 폴더에 두면 관련 파일을 빠르게 찾을 수 있습니다.\n\n" +
        "**모노레포**는 여러 도서관이 하나의 건물 안에 있는 것입니다. 각 도서관은 독립적이지만, 공통 시설(공유 라이브러리)을 함께 사용합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "잘못된 폴더 구조의 문제점입니다.\n\n" +
        "1. **기술 기반 분류의 한계** — `components/`, `hooks/`, `utils/` 폴더가 각각 수백 개의 파일을 가지면, 관련 파일을 찾기 위해 여러 폴더를 오가야 합니다.\n\n" +
        "2. **순환 의존성** — 모듈 간 의존성 방향이 불명확하면 A→B→C→A 같은 순환이 발생합니다.\n\n" +
        "3. **Barrel export 함정** — `index.ts`에서 모든 것을 re-export하면, 하나만 import해도 전체가 번들에 포함될 수 있습니다.\n\n" +
        "4. **파일 위치 결정 어려움** — 새 파일을 어디에 두어야 할지 팀원마다 다른 판단을 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### Feature 기반 구조\n" +
        "기능(auth, products, cart)별로 폴더를 나누고, 각 기능 안에 컴포넌트, Hook, 타입, 테스트를 함께 둡니다.\n\n" +
        "### 레이어 기반 구조\n" +
        "UI → Application → Domain → Infrastructure 레이어로 나누고, 의존성은 항상 안쪽(Domain)을 향합니다.\n\n" +
        "### co-location 원칙\n" +
        "관련 파일을 가능한 한 가까이 둡니다. 컴포넌트와 그 테스트, 스타일, 타입을 같은 폴더에 배치합니다.\n\n" +
        "### Barrel exports (index.ts)\n" +
        "폴더의 공개 API를 정의합니다. 내부 구현을 숨기고, 외부에서 사용할 것만 export합니다. 단, Tree Shaking에 영향을 줄 수 있으므로 주의합니다.\n\n" +
        "### 모노레포\n" +
        "여러 패키지(앱, 공유 라이브러리, 디자인 시스템)를 하나의 레포에서 관리합니다. Turborepo, Nx 등이 빌드 캐싱과 의존성 관리를 제공합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 폴더 구조 예시",
      content:
        "Feature 기반 구조와 co-location의 실제 구조를 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// === Feature 기반 구조 ===\n' +
          'src/\n' +
          '├── features/\n' +
          '│   ├── auth/\n' +
          '│   │   ├── components/\n' +
          '│   │   │   ├── LoginForm.tsx\n' +
          '│   │   │   ├── LoginForm.test.tsx   // co-location\n' +
          '│   │   │   └── SignupForm.tsx\n' +
          '│   │   ├── hooks/\n' +
          '│   │   │   └── useAuth.ts\n' +
          '│   │   ├── api/\n' +
          '│   │   │   └── authApi.ts\n' +
          '│   │   ├── types/\n' +
          '│   │   │   └── auth.ts\n' +
          '│   │   └── index.ts              // Barrel export\n' +
          '│   ├── products/\n' +
          '│   │   ├── components/\n' +
          '│   │   ├── hooks/\n' +
          '│   │   ├── api/\n' +
          '│   │   └── index.ts\n' +
          '│   └── cart/\n' +
          '├── shared/                        // 공유 모듈\n' +
          '│   ├── components/\n' +
          '│   │   ├── Button.tsx\n' +
          '│   │   └── Modal.tsx\n' +
          '│   ├── hooks/\n' +
          '│   └── utils/\n' +
          '├── app/                           // 앱 진입점, 라우팅\n' +
          '│   ├── routes.tsx\n' +
          '│   └── providers.tsx\n' +
          '└── types/                         // 전역 타입\n' +
          '\n' +
          '// === Barrel export (features/auth/index.ts) ===\n' +
          '// 공개 API만 export\n' +
          'export { LoginForm } from "./components/LoginForm";\n' +
          'export { SignupForm } from "./components/SignupForm";\n' +
          'export { useAuth } from "./hooks/useAuth";\n' +
          'export type { User, AuthState } from "./types/auth";\n' +
          '// 내부 구현(authApi)은 export하지 않음',
        description:
          "Feature 폴더 안에 관련 파일을 모두 배치하고, index.ts로 공개 API만 노출합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 의존성 규칙",
      content:
        "폴더 간 의존성 방향을 설정하고 순환을 방지합니다.",
      code: {
        language: "typescript",
        code:
          '// === 의존성 방향 규칙 ===\n' +
          '// features/ → shared/  ✅ (기능이 공유 모듈 사용)\n' +
          '// shared/ → features/  ❌ (공유 모듈이 기능에 의존 금지)\n' +
          '// features/auth/ → features/products/  ⚠️ (기능 간 직접 의존 주의)\n' +
          '\n' +
          '// === 기능 간 통신: 이벤트 기반 ===\n' +
          '// features/auth/index.ts\n' +
          'export { useAuth } from "./hooks/useAuth";\n' +
          '// 다른 feature는 useAuth()의 반환값만 사용\n' +
          '// 내부 구현에 직접 접근하지 않음\n' +
          '\n' +
          '// === ESLint로 의존성 규칙 강제 ===\n' +
          '// eslint-plugin-import의 no-restricted-paths 활용\n' +
          'const rules = {\n' +
          '  "import/no-restricted-paths": ["error", {\n' +
          '    zones: [\n' +
          '      {\n' +
          '        target: "./src/shared",\n' +
          '        from: "./src/features",\n' +
          '        message: "shared는 features에 의존할 수 없습니다",\n' +
          '      },\n' +
          '    ],\n' +
          '  }],\n' +
          '};\n' +
          '\n' +
          '// === 모노레포 기본 구조 ===\n' +
          '// monorepo/\n' +
          '// ├── apps/\n' +
          '// │   ├── web/          (Next.js 앱)\n' +
          '// │   └── admin/        (관리자 앱)\n' +
          '// ├── packages/\n' +
          '// │   ├── ui/           (공유 UI 컴포넌트)\n' +
          '// │   ├── utils/        (공유 유틸리티)\n' +
          '// │   └── config/       (공유 설정)\n' +
          '// └── turbo.json        (Turborepo 설정)',
        description:
          "의존성은 항상 바깥에서 안쪽으로 흐르고, ESLint로 규칙을 강제할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 구조 | 장점 | 적합한 규모 |\n" +
        "|------|------|------------|\n" +
        "| 기술 기반 | 단순, 직관적 | 소규모 |\n" +
        "| Feature 기반 | 관련 파일 집중 | 중~대규모 |\n" +
        "| 레이어 기반 | 의존성 명확 | 대규모 |\n" +
        "| 모노레포 | 코드 공유, 일관성 | 멀티 프로젝트 |\n\n" +
        "**핵심:** 완벽한 구조는 없습니다. 프로젝트 규모와 팀 상황에 맞게 선택하고, '새 파일을 어디에 두어야 하는지 모든 팀원이 동의할 수 있는가?'를 기준으로 판단하세요.\n\n" +
        "**다음 챕터 미리보기:** 대규모 앱 설계에서 모듈 경계, 의존성 방향, Feature Sliced Design 등을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "Feature 기반 구조를 설계할 수 있다",
    "co-location 원칙을 적용할 수 있다",
    "Barrel export의 장단점을 이해한다",
    "폴더 간 의존성 규칙을 설정할 수 있다",
    "모노레포의 기본 개념과 도구를 안다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Feature 기반 폴더 구조의 가장 큰 장점은?",
      choices: [
        "파일 수가 줄어든다",
        "관련 파일이 한 곳에 모여 찾기 쉽다",
        "번들 크기가 자동으로 줄어든다",
        "TypeScript 타입 추론이 좋아진다",
      ],
      correctIndex: 1,
      explanation:
        "Feature 기반 구조는 기능별로 컴포넌트, Hook, 타입, 테스트를 같은 폴더에 모아, 관련 파일을 빠르게 찾고 수정할 수 있습니다.",
    },
    {
      id: "q2",
      question: "Barrel export(index.ts)의 잠재적 문제점은?",
      choices: [
        "TypeScript 에러가 발생한다",
        "하나만 import해도 전체가 번들에 포함될 수 있다",
        "순환 의존성이 자동으로 해결된다",
        "테스트 파일을 찾을 수 없다",
      ],
      correctIndex: 1,
      explanation:
        "Barrel export는 Tree Shaking이 완벽하지 않으면 불필요한 코드까지 번들에 포함시킬 수 있습니다. 특히 사이드 이펙트가 있는 모듈에서 주의가 필요합니다.",
    },
    {
      id: "q3",
      question: "co-location 원칙에 따르면 테스트 파일은 어디에 두어야 하는가?",
      choices: [
        "프로젝트 루트의 __tests__ 폴더",
        "테스트 대상 파일과 같은 폴더",
        "별도의 test 프로젝트",
        "CI 서버에만 존재",
      ],
      correctIndex: 1,
      explanation:
        "co-location은 관련 파일을 가까이 두는 원칙입니다. LoginForm.tsx와 LoginForm.test.tsx를 같은 폴더에 두면 연관성이 명확하고 관리가 쉽습니다.",
    },
    {
      id: "q4",
      question: "shared 폴더가 features 폴더에 의존하면 안 되는 이유는?",
      choices: [
        "성능이 저하된다",
        "순환 의존성이 발생하고 공유 모듈의 독립성이 깨진다",
        "TypeScript 컴파일이 불가능하다",
        "테스트를 작성할 수 없다",
      ],
      correctIndex: 1,
      explanation:
        "shared가 features에 의존하면 순환 의존성이 발생할 수 있고, 공유 모듈이 특정 기능에 결합되어 범용성을 잃습니다. 의존성은 항상 features → shared 방향이어야 합니다.",
    },
    {
      id: "q5",
      question: "모노레포의 핵심 장점은?",
      choices: [
        "폴더 수가 줄어든다",
        "여러 프로젝트가 코드를 공유하고 일관성을 유지할 수 있다",
        "배포가 자동으로 처리된다",
        "팀원 수가 줄어든다",
      ],
      correctIndex: 1,
      explanation:
        "모노레포는 여러 앱과 라이브러리가 하나의 레포에서 공유 코드를 사용하고, 의존성 버전을 일관되게 관리할 수 있습니다.",
    },
  ],
};

export default chapter;
