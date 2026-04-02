import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "31-tsconfig",
  subject: "typescript",
  title: "tsconfig.json 완벽 가이드",
  description:
    "TypeScript 프로젝트의 핵심 설정 파일인 tsconfig.json의 주요 옵션을 이해하고, 프로젝트 환경별 최적 설정 조합을 익힙니다.",
  order: 31,
  group: "프로젝트 설정",
  prerequisites: ["30-react-advanced-patterns"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "tsconfig.json은 **공장의 생산 매뉴얼**과 같습니다.\n\n" +
        "공장에서 제품을 만들 때, 어떤 원자재를 사용할지(lib), 어떤 규격으로 생산할지(target), 어떤 포장 방식을 쓸지(module), 품질 검사를 얼마나 엄격하게 할지(strict) 등을 매뉴얼에 정의합니다.\n\n" +
        "매뉴얼이 없어도 공장은 돌아갑니다. 하지만 작업자마다 다른 기준으로 생산하면 품질이 들쭉날쭉해지죠. tsconfig.json은 팀 전체가 동일한 기준으로 TypeScript 코드를 작성하고 컴파일하게 만드는 **프로젝트의 헌법**입니다.\n\n" +
        "특히 `strict: true`는 품질 검사를 최고 수준으로 높이는 설정입니다. 처음에는 까다롭게 느껴지지만, 제품(코드) 출하 후 불량(런타임 에러)을 획기적으로 줄여줍니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "TypeScript 프로젝트를 시작하면 수십 개의 컴파일러 옵션 앞에서 막막해집니다.\n\n" +
        "**1. target과 module의 혼동**\n" +
        "`target: \"ES5\"`로 하면 구형 브라우저를 지원할 수 있지만 최신 문법을 쓸 수 없고, `target: \"ESNext\"`로 하면 어디서 실행할 수 있는지 불분명합니다. module은 또 뭘 골라야 할까요?\n\n" +
        "**2. moduleResolution의 함정**\n" +
        "node, node16, bundler 중 뭘 써야 하는지 몰라서, 패키지를 import할 때 경로 에러가 발생하고 원인을 찾지 못합니다.\n\n" +
        "**3. strict 플래그의 범위 불명확**\n" +
        "`strict: true`가 정확히 어떤 검사를 활성화하는지 모르면, 개별 플래그를 끄거나 켜는 판단을 할 수 없습니다.\n\n" +
        "**4. 경로 별칭 설정의 복잡성**\n" +
        "`@/components/...` 같은 절대 경로를 쓰려면 tsconfig의 paths와 번들러 설정을 동시에 맞춰야 하는데, 한쪽만 설정하면 런타임 에러가 발생합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### target과 module\n" +
        "`target`은 출력 JavaScript의 ECMAScript 버전입니다. 브라우저 프로젝트는 보통 `ES2020` 이상, Node.js 18+는 `ES2022`가 적합합니다. `module`은 모듈 시스템을 결정합니다. 번들러(Vite, webpack)를 쓰면 `ESNext`, Node.js는 `Node16` 또는 `NodeNext`를 씁니다.\n\n" +
        "### moduleResolution\n" +
        "`module: \"Node16\"`이면 자동으로 `moduleResolution: \"Node16\"`이 됩니다. Vite/webpack 등 번들러 환경에서는 `moduleResolution: \"Bundler\"`가 가장 적합합니다. 이 옵션은 import 경로를 해석하는 알고리즘을 결정합니다.\n\n" +
        "### lib 옵션\n" +
        "`lib`은 사용 가능한 전역 API의 타입 정의를 결정합니다. 브라우저 환경이면 `[\"ES2020\", \"DOM\", \"DOM.Iterable\"]`, Node.js면 DOM을 빼고 `[\"ES2022\"]`만 씁니다.\n\n" +
        "### paths 별칭\n" +
        "`baseUrl`과 `paths`로 경로 별칭을 설정합니다. 반드시 번들러(vite.config의 resolve.alias 등)에도 동일한 별칭을 설정해야 런타임에 올바르게 동작합니다.\n\n" +
        "### include/exclude\n" +
        "`include`로 컴파일 대상 파일을 지정하고, `exclude`로 제외합니다. `node_modules`는 기본 제외입니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 환경별 tsconfig 레시피",
      content:
        "프로젝트 환경에 따라 tsconfig.json 설정이 달라집니다. React + Vite, Node.js 서버, 라이브러리 배포 세 가지 환경에 대한 실전 레시피를 살펴봅시다. 각 옵션이 왜 그 값인지 이해하면 어떤 프로젝트에서도 올바른 설정을 구성할 수 있습니다.",
      code: {
        language: "typescript",
        code:
          "// ===== 1. React + Vite 프로젝트 =====\n" +
          "const reactViteConfig = {\n" +
          "  compilerOptions: {\n" +
          '    target: "ES2020",           // 모던 브라우저 대상\n' +
          '    module: "ESNext",           // Vite가 번들링 처리\n' +
          '    moduleResolution: "Bundler",// 번들러의 모듈 해석 방식\n' +
          '    lib: ["ES2020", "DOM", "DOM.Iterable"],\n' +
          '    jsx: "react-jsx",           // React 17+ 자동 JSX 변환\n' +
          "    strict: true,\n" +
          "    esModuleInterop: true,      // CJS 모듈 default import 허용\n" +
          "    isolatedModules: true,      // Vite(esbuild) 호환 필수\n" +
          "    skipLibCheck: true,         // .d.ts 검사 생략 (빌드 속도)\n" +
          "    noEmit: true,               // Vite가 빌드하므로 tsc는 검사만\n" +
          '    baseUrl: ".",\n' +
          '    paths: { "@/*": ["./src/*"] },\n' +
          "  },\n" +
          '  include: ["src"],\n' +
          "};\n" +
          "\n" +
          "// ===== 2. Node.js 서버 프로젝트 =====\n" +
          "const nodeConfig = {\n" +
          "  compilerOptions: {\n" +
          '    target: "ES2022",           // Node 18+ 대상\n' +
          '    module: "Node16",           // Node.js ESM 지원\n' +
          '    moduleResolution: "Node16", // 자동 설정됨\n' +
          '    lib: ["ES2022"],            // DOM 불필요\n' +
          "    strict: true,\n" +
          "    esModuleInterop: true,\n" +
          '    outDir: "./dist",           // 빌드 결과물 위치\n' +
          '    rootDir: "./src",\n' +
          "    declaration: true,          // .d.ts 생성\n" +
          "  },\n" +
          '  include: ["src"],\n' +
          "};\n" +
          "\n" +
          "// ===== 3. 라이브러리 배포용 =====\n" +
          "const libraryConfig = {\n" +
          "  compilerOptions: {\n" +
          '    target: "ES2020",\n' +
          '    module: "ESNext",\n' +
          '    moduleResolution: "Bundler",\n' +
          "    strict: true,\n" +
          "    declaration: true,          // 타입 선언 생성 필수\n" +
          "    declarationMap: true,       // 소스맵으로 원본 연결\n" +
          '    outDir: "./dist",\n' +
          "    composite: true,            // project references 사용 시\n" +
          "  },\n" +
          '  include: ["src"],\n' +
          "};",
        description:
          "프로젝트 환경(React+Vite, Node.js, 라이브러리)에 따라 target, module, moduleResolution 조합이 달라집니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: composite와 project references",
      content:
        "모노레포나 대규모 프로젝트에서는 여러 tsconfig를 분리하고 project references로 연결합니다. 이렇게 하면 변경된 패키지만 증분 빌드하여 빌드 속도를 크게 개선할 수 있습니다. 또한 esModuleInterop과 isolatedModules가 실제로 어떤 문제를 해결하는지 구체적으로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          "// ===== Project References (모노레포 구조) =====\n" +
          "// 루트 tsconfig.json\n" +
          "const rootConfig = {\n" +
          '  files: [],                    // 루트에는 직접 컴파일할 파일 없음\n' +
          "  references: [\n" +
          '    { path: "./packages/shared" },\n' +
          '    { path: "./packages/client" },\n' +
          '    { path: "./packages/server" },\n' +
          "  ],\n" +
          "};\n" +
          "\n" +
          "// packages/shared/tsconfig.json\n" +
          "const sharedConfig = {\n" +
          "  compilerOptions: {\n" +
          "    composite: true,            // project references 필수\n" +
          "    declaration: true,          // composite 시 필수\n" +
          '    outDir: "./dist",\n' +
          "  },\n" +
          '  include: ["src"],\n' +
          "};\n" +
          "\n" +
          "// packages/client/tsconfig.json\n" +
          "const clientConfig = {\n" +
          "  compilerOptions: { /* ... */ },\n" +
          "  references: [\n" +
          '    { path: "../shared" },      // shared 패키지 참조\n' +
          "  ],\n" +
          "};\n" +
          "\n" +
          "// ===== esModuleInterop이 해결하는 문제 =====\n" +
          "// CommonJS 모듈: module.exports = function() {}\n" +
          "// esModuleInterop: false 일 때\n" +
          "import * as express from 'express'; // 이렇게 써야 함\n" +
          "\n" +
          "// esModuleInterop: true 일 때\n" +
          "import express from 'express';      // 자연스러운 default import 가능\n" +
          "\n" +
          "// ===== isolatedModules의 의미 =====\n" +
          "// esbuild, SWC 등 단일 파일 트랜스파일러는\n" +
          "// 파일 간 타입 정보를 공유하지 못합니다.\n" +
          "\n" +
          "// ❌ isolatedModules: true에서 에러\n" +
          "// const enum은 다른 파일에서 인라인해야 하므로 불가\n" +
          "// const enum Direction { Up, Down }\n" +
          "\n" +
          "// ✅ 일반 enum 또는 union 리터럴 사용\n" +
          "enum Direction { Up, Down }\n" +
          "// 또는\n" +
          "type Direction = 'Up' | 'Down';",
        description:
          "project references로 모노레포를 구성하고, esModuleInterop과 isolatedModules의 동작 원리를 이해합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 옵션 | 역할 | 권장값 (React+Vite) |\n" +
        "|------|------|--------------------|\n" +
        "| target | 출력 JS 버전 | ES2020 |\n" +
        "| module | 모듈 시스템 | ESNext |\n" +
        "| moduleResolution | import 해석 방식 | Bundler |\n" +
        "| strict | 엄격한 타입 검사 | true |\n" +
        "| isolatedModules | 단일 파일 트랜스파일 호환 | true |\n" +
        "| esModuleInterop | CJS default import 허용 | true |\n" +
        "| paths | 경로 별칭 | @/* → ./src/* |\n\n" +
        "**핵심:** tsconfig.json은 TypeScript 프로젝트의 청사진입니다. `strict: true`를 기본으로 켜고, target/module/moduleResolution을 프로젝트 환경에 맞게 설정하세요. 번들러 환경에서는 `moduleResolution: \"Bundler\"`, Node.js에서는 `\"Node16\"`이 정답입니다.\n\n" +
        "**다음 챕터 미리보기:** strict 모드가 활성화하는 7가지 플래그를 하나씩 분석하고, 기존 JavaScript 프로젝트에 TypeScript를 점진적으로 도입하는 전략을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "tsconfig.json은 TypeScript 프로젝트의 청사진이다. strict: true를 기본으로 켜고, target/module/moduleResolution을 프로젝트 환경에 맞게 설정하며, paths로 절대 경로 별칭을 구성한다.",
  checklist: [
    "target, module, moduleResolution의 역할과 차이를 설명할 수 있다",
    "프로젝트 환경(React, Node.js, 라이브러리)별 적절한 설정 조합을 선택할 수 있다",
    "paths와 baseUrl로 경로 별칭을 설정할 수 있다",
    "esModuleInterop과 isolatedModules가 해결하는 문제를 이해한다",
    "composite와 project references로 모노레포를 구성할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "Vite를 사용하는 React 프로젝트에서 moduleResolution으로 가장 적합한 값은?",
      choices: ["node", "classic", "Node16", "Bundler"],
      correctIndex: 3,
      explanation:
        "Vite, webpack 등 번들러를 사용하는 프로젝트에서는 moduleResolution: \"Bundler\"가 가장 적합합니다. 번들러의 모듈 해석 방식과 일치하여 import 경로 문제를 방지합니다.",
    },
    {
      id: "q2",
      question: "isolatedModules: true에서 사용할 수 없는 것은?",
      choices: [
        "일반 enum",
        "const enum",
        "type alias",
        "interface",
      ],
      correctIndex: 1,
      explanation:
        "const enum은 컴파일 시 다른 파일의 값을 인라인해야 하므로, 단일 파일 트랜스파일러(esbuild, SWC)에서는 처리할 수 없습니다. isolatedModules: true는 이를 에러로 보고합니다.",
    },
    {
      id: "q3",
      question: "esModuleInterop: true가 해결하는 문제는?",
      choices: [
        "ESM 모듈을 CJS로 변환",
        "CJS 모듈을 default import로 가져오기",
        "순환 참조 감지",
        "tree-shaking 활성화",
      ],
      correctIndex: 1,
      explanation:
        "esModuleInterop은 CommonJS 모듈(module.exports = ...)을 import express from 'express'처럼 자연스러운 default import 구문으로 가져올 수 있게 해줍니다.",
    },
    {
      id: "q4",
      question: "project references를 사용하려면 반드시 설정해야 하는 옵션은?",
      choices: [
        "strict: true",
        "composite: true",
        "isolatedModules: true",
        "noEmit: true",
      ],
      correctIndex: 1,
      explanation:
        "project references로 참조되는 프로젝트는 composite: true를 설정해야 합니다. 이 옵션은 declaration: true를 요구하며, 증분 빌드를 가능하게 합니다.",
    },
    {
      id: "q5",
      question:
        "Node.js 서버 프로젝트에서 lib에 포함하지 않아야 하는 것은?",
      choices: ["ES2022", "ES2020", "DOM", "ESNext"],
      correctIndex: 2,
      explanation:
        "Node.js는 브라우저가 아니므로 DOM API(document, window 등)를 사용하지 않습니다. lib에 DOM을 포함하면 존재하지 않는 API를 사용해도 타입 에러가 나지 않아 런타임 에러가 발생할 수 있습니다.",
    },
  ],
};

export default chapter;
