import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "04-package-managers",
  subject: "infra",
  title: "npm, yarn, pnpm 비교",
  description:
    "npm, yarn, pnpm의 내부 동작 원리와 차이를 이해하고 프로젝트에 적합한 패키지 매니저를 선택합니다.",
  order: 4,
  group: "패키지 관리",
  prerequisites: ["03-code-review"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "패키지 매니저는 도서관 시스템과 같습니다.\n\n" +
        "**npm**은 전통적인 도서관입니다. 책(패키지)을 빌릴 때마다 복사본을 만들어 " +
        "내 책상(node_modules)에 놓습니다. 프로젝트가 10개면 같은 책 복사본이 10개 생깁니다. " +
        "호이스팅이라는 방식으로 중복을 줄이려 하지만, 가끔 엉뚱한 책이 접근 가능해지는 문제(유령 의존성)가 생깁니다.\n\n" +
        "**yarn PnP(Plug'n'Play)**는 디지털 도서관입니다. 책상 자체가 필요 없습니다. " +
        "모든 책의 위치를 `.pnp.cjs`라는 인덱스 카드에 기록해두고, 필요할 때 " +
        "압축 파일(zip)에서 직접 읽습니다. 빠르고 디스크를 아끼지만, " +
        "기존 시스템과 호환이 안 되는 경우가 있습니다.\n\n" +
        "**pnpm**은 중앙 창고 시스템입니다. 모든 책의 원본은 중앙 창고(content-addressable store)에 " +
        "하나만 보관하고, 각 책상에는 원본을 가리키는 참조(하드링크)를 놓습니다. " +
        "디스크 공간을 절약하면서도, 각 프로젝트가 자신이 명시한 책만 접근할 수 있어 안전합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 프로젝트에서 의존성 관리는 다음과 같은 문제를 일으킵니다.\n\n" +
        "1. **유령 의존성(Phantom Dependencies)** — `package.json`에 명시하지 않은 패키지가 " +
        "호이스팅 때문에 사용 가능해집니다. 다른 환경에서는 동작하지 않을 수 있는 위험한 상태입니다.\n\n" +
        "2. **디스크 낭비** — 프로젝트 10개에서 React를 사용하면 동일한 React 패키지가 " +
        "10번 복사됩니다. node_modules가 수백 MB에서 수 GB를 차지합니다.\n\n" +
        "3. **설치 속도** — CI에서 매번 `npm install`을 실행하면 수 분이 걸립니다. " +
        "개발자 경험을 악화시키고 CI 비용을 증가시킵니다.\n\n" +
        "4. **환경 간 불일치** — lock 파일이 없거나 커밋되지 않으면, " +
        "개발자 A의 로컬과 CI 서버에서 서로 다른 버전이 설치될 수 있습니다.\n\n" +
        "5. **보안 취약점** — 의존성 트리 깊숙이 숨어 있는 취약한 패키지를 " +
        "발견하고 대응하기 어렵습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### npm의 node_modules 구조\n" +
        "npm v3부터 호이스팅(hoisting)을 사용하여 의존성을 가능한 한 최상위로 올립니다. " +
        "중복을 줄이지만, `package.json`에 명시하지 않은 패키지도 접근 가능해지는 " +
        "유령 의존성 문제가 있습니다.\n\n" +
        "### yarn PnP(Plug'n'Play)\n" +
        "node_modules 디렉토리 자체를 없앱니다. `.pnp.cjs` 파일이 모든 패키지의 " +
        "정확한 위치를 기록하고, 패키지는 `.yarn/cache`에 zip으로 저장됩니다. " +
        "설치가 매우 빠르고 디스크를 절약하지만, 일부 도구와 호환성 문제가 있을 수 있습니다.\n\n" +
        "### pnpm의 하드링크 + 심볼릭 링크\n" +
        "모든 패키지를 `~/.pnpm-store`에 한 번만 저장하고, 프로젝트의 `node_modules`에는 " +
        "하드링크를 생성합니다. 심볼릭 링크로 패키지 간 의존성을 연결하되, " +
        "각 패키지는 자신이 명시한 의존성만 접근할 수 있어 유령 의존성을 원천 차단합니다.\n\n" +
        "### Lock 파일의 중요성\n" +
        "- `package-lock.json` (npm), `yarn.lock` (yarn), `pnpm-lock.yaml` (pnpm)\n" +
        "- 정확한 버전을 고정하여 모든 환경에서 동일한 의존성을 보장합니다.\n" +
        "- **반드시 Git에 커밋해야 합니다.**\n\n" +
        "### 보안\n" +
        "- `npm audit` / `yarn audit` / `pnpm audit`로 취약점을 검사합니다.\n" +
        "- `overrides`(npm/pnpm) / `resolutions`(yarn)으로 취약한 하위 의존성의 버전을 강제합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 의존성 구조 비교",
      content:
        "세 패키지 매니저가 동일한 의존성을 어떻게 다르게 저장하는지 구조적으로 비교합니다. " +
        "유령 의존성의 발생 원리와 pnpm이 이를 방지하는 메커니즘을 이해합니다.",
      code: {
        language: "typescript",
        code:
          '// === 패키지 의존성 시나리오 ===\n' +
          '// package.json: { "dependencies": { "A": "1.0", "B": "1.0" } }\n' +
          '// A는 내부적으로 C@1.0에 의존\n' +
          '// B는 내부적으로 C@2.0에 의존\n' +
          '\n' +
          '// === npm (호이스팅 방식) ===\n' +
          '// node_modules/\n' +
          '//   A/           ← 호이스팅됨\n' +
          '//   B/           ← 호이스팅됨\n' +
          '//   C@1.0/       ← 호이스팅됨 (유령 의존성!)\n' +
          '//   B/node_modules/\n' +
          '//     C@2.0/     ← 중복 버전은 하위에 설치\n' +
          '// → import C from "C" 가 가능! (유령 의존성)\n' +
          '\n' +
          '// === pnpm (심볼릭 링크 방식) ===\n' +
          '// node_modules/\n' +
          '//   .pnpm/       ← 실제 패키지 (하드링크)\n' +
          '//     A@1.0/node_modules/\n' +
          '//       A -> store/A@1.0\n' +
          '//       C -> ../../C@1.0/node_modules/C\n' +
          '//     B@1.0/node_modules/\n' +
          '//       B -> store/B@1.0\n' +
          '//       C -> ../../C@2.0/node_modules/C\n' +
          '//   A -> .pnpm/A@1.0/node_modules/A  ← 심볼릭 링크\n' +
          '//   B -> .pnpm/B@1.0/node_modules/B  ← 심볼릭 링크\n' +
          '// → import C from "C" 불가! (유령 의존성 차단)\n' +
          '\n' +
          '// === yarn PnP 방식 ===\n' +
          '// node_modules 없음!\n' +
          '// .pnp.cjs에 모든 패키지 위치 맵핑:\n' +
          'const pnpMap = {\n' +
          '  "A@1.0": {\n' +
          '    location: ".yarn/cache/A-1.0.zip",\n' +
          '    dependencies: { C: "1.0" }\n' +
          '  },\n' +
          '  "B@1.0": {\n' +
          '    location: ".yarn/cache/B-1.0.zip",\n' +
          '    dependencies: { C: "2.0" }\n' +
          '  }\n' +
          '};\n' +
          '// Node.js의 require를 패치하여 .pnp.cjs를 참조',
        description:
          "npm, pnpm, yarn PnP의 의존성 저장 구조를 비교하여 유령 의존성 발생 원리를 보여줍니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 패키지 매니저 활용",
      content:
        "각 패키지 매니저의 주요 명령어와 설정, 보안 점검, workspace 프로토콜을 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// === 주요 명령어 비교 ===\n' +
          '// npm install           | yarn install       | pnpm install\n' +
          '// npm install react     | yarn add react     | pnpm add react\n' +
          '// npm install -D vitest | yarn add -D vitest | pnpm add -D vitest\n' +
          '// npm uninstall react   | yarn remove react  | pnpm remove react\n' +
          '// npm run build         | yarn build         | pnpm build\n' +
          '// npx create-next-app   | yarn dlx ...       | pnpm dlx ...\n' +
          '\n' +
          '// === CI에서 정확한 의존성 설치 ===\n' +
          '// npm ci                 ← lock 파일 기준으로 정확히 설치\n' +
          '// yarn install --frozen-lockfile\n' +
          '// pnpm install --frozen-lockfile\n' +
          '\n' +
          '// === 보안 점검 ===\n' +
          '// npm audit\n' +
          '// npm audit fix          ← 자동 수정 시도\n' +
          '\n' +
          '// overrides로 취약한 하위 의존성 강제 업데이트\n' +
          '// package.json:\n' +
          'const packageJsonOverrides = {\n' +
          '  overrides: {\n' +
          '    "vulnerable-pkg": ">=2.0.0"\n' +
          '  }\n' +
          '};\n' +
          '\n' +
          '// === .npmrc 설정 ===\n' +
          '// engine-strict=true      ← engines 필드 강제\n' +
          '// save-exact=true         ← ^ 없이 정확한 버전 저장\n' +
          '// auto-install-peers=true ← peer deps 자동 설치 (pnpm)\n' +
          '\n' +
          '// === 패키지 매니저 선택 가이드 ===\n' +
          'type ProjectType = "small" | "monorepo" | "enterprise";\n' +
          '\n' +
          'function recommendPackageManager(\n' +
          '  projectType: ProjectType,\n' +
          '  diskConcern: boolean\n' +
          '): string {\n' +
          '  if (projectType === "monorepo" || diskConcern) {\n' +
          '    return "pnpm — 디스크 절약 + 엄격한 의존성";\n' +
          '  }\n' +
          '  if (projectType === "enterprise") {\n' +
          '    return "pnpm 또는 yarn — workspace 지원";\n' +
          '  }\n' +
          '  return "npm — 별도 설치 불필요, 가장 범용적";\n' +
          '}',
        description:
          "세 패키지 매니저의 명령어 비교와 CI 설정, 보안 점검 방법입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 특성 | npm | yarn (PnP) | pnpm |\n" +
        "|------|-----|------------|------|\n" +
        "| 저장 방식 | 호이스팅 | zip + .pnp.cjs | 하드링크 + 심볼릭 링크 |\n" +
        "| node_modules | 있음 | 없음 | 있음 (구조 다름) |\n" +
        "| 유령 의존성 | 발생 가능 | 차단 | 차단 |\n" +
        "| 디스크 효율 | 낮음 | 높음 | 매우 높음 |\n" +
        "| 설치 속도 | 보통 | 빠름 | 빠름 |\n" +
        "| 호환성 | 최고 | 낮음 | 높음 |\n" +
        "| lock 파일 | package-lock.json | yarn.lock | pnpm-lock.yaml |\n\n" +
        "**핵심:** npm은 범용, yarn은 PnP로 node_modules 없는 설치, " +
        "pnpm은 하드링크로 디스크 절약과 엄격한 의존성 격리를 제공합니다. " +
        "lock 파일은 반드시 커밋하여 모든 환경에서 동일한 의존성을 보장하세요.\n\n" +
        "**다음 챕터 미리보기:** 모노레포와 Turborepo를 배워서 여러 패키지를 " +
        "하나의 저장소에서 효율적으로 관리하는 방법을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "npm은 범용, yarn은 PnP로 node_modules 없는 설치, pnpm은 하드링크로 디스크 절약+엄격한 의존성 격리를 제공한다. lock 파일은 반드시 커밋하여 모든 환경에서 동일한 의존성을 보장하라.",
  checklist: [
    "npm, yarn PnP, pnpm의 의존성 저장 방식 차이를 설명할 수 있다",
    "유령 의존성이 무엇이고 왜 위험한지 설명할 수 있다",
    "lock 파일의 역할을 이해하고 반드시 커밋해야 하는 이유를 안다",
    "npm audit으로 보안 취약점을 점검하고 overrides로 대응할 수 있다",
    "프로젝트 특성에 맞는 패키지 매니저를 선택하고 근거를 제시할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "유령 의존성(Phantom Dependency)이란?",
      choices: [
        "삭제된 패키지가 캐시에 남아있는 것",
        "package.json에 명시하지 않았지만 호이스팅으로 접근 가능해진 패키지",
        "node_modules에 설치되지 않은 패키지",
        "버전이 명시되지 않은 패키지",
      ],
      correctIndex: 1,
      explanation:
        "npm의 호이스팅은 하위 의존성을 최상위로 올려 중복을 줄이지만, " +
        "package.json에 명시하지 않은 패키지도 접근 가능해집니다. " +
        "다른 환경에서는 호이스팅 결과가 달라 동작하지 않을 수 있습니다.",
    },
    {
      id: "q2",
      question: "pnpm이 디스크 공간을 절약하는 핵심 메커니즘은?",
      choices: [
        "파일을 zip으로 압축",
        "node_modules를 제거",
        "중앙 저장소에 패키지를 한 번만 저장하고 하드링크 사용",
        "사용하지 않는 패키지를 자동 삭제",
      ],
      correctIndex: 2,
      explanation:
        "pnpm은 ~/.pnpm-store에 패키지를 한 번만 저장하고, " +
        "각 프로젝트의 node_modules에는 하드링크를 생성합니다. " +
        "10개 프로젝트에서 React를 사용해도 디스크에는 하나의 복사본만 존재합니다.",
    },
    {
      id: "q3",
      question: "CI 환경에서 의존성을 설치할 때 권장되는 npm 명령은?",
      choices: [
        "npm install",
        "npm update",
        "npm ci",
        "npm install --force",
      ],
      correctIndex: 2,
      explanation:
        "npm ci는 package-lock.json 기준으로 정확한 버전을 설치합니다. " +
        "기존 node_modules를 삭제하고 깨끗하게 설치하므로 " +
        "CI에서 재현 가능한 빌드를 보장합니다.",
    },
    {
      id: "q4",
      question: "yarn PnP의 가장 큰 특징은?",
      choices: [
        "설치 속도가 가장 빠르다",
        "node_modules 디렉토리 없이 패키지를 관리한다",
        "보안 취약점을 자동으로 수정한다",
        "모노레포만 지원한다",
      ],
      correctIndex: 1,
      explanation:
        "yarn PnP(Plug'n'Play)는 node_modules 디렉토리를 생성하지 않습니다. " +
        ".pnp.cjs 파일이 모든 패키지의 위치를 맵핑하고, " +
        "Node.js의 require를 패치하여 zip 파일에서 직접 모듈을 로드합니다.",
    },
    {
      id: "q5",
      question: "lock 파일을 Git에 커밋하지 않으면 발생하는 문제는?",
      choices: [
        "패키지를 설치할 수 없다",
        "개발자마다 다른 버전이 설치되어 환경 간 불일치가 발생한다",
        "npm audit이 동작하지 않는다",
        "패키지 매니저가 에러를 발생시킨다",
      ],
      correctIndex: 1,
      explanation:
        "lock 파일 없이 npm install을 실행하면 semver 범위 내에서 최신 버전이 설치됩니다. " +
        "시점에 따라 다른 버전이 설치되어 '내 환경에서는 되는데' 문제가 발생합니다.",
    },
  ],
};

export default chapter;
