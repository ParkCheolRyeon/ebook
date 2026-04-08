import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "06-module-bundlers",
  subject: "infra",
  title: "모듈 번들러의 원리",
  description:
    "Webpack의 동작 원리, 트리 셰이킹, 코드 스플리팅을 이해하고 Rollup, esbuild와 비교합니다.",
  order: 6,
  group: "빌드와 번들링",
  prerequisites: ["05-monorepo"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "모듈 번들러는 이사 전문 업체입니다.\n\n" +
        "여러분의 프로젝트에는 수백 개의 소스 파일(짐)이 있습니다. " +
        "이것들을 하나하나 브라우저(새 집)로 옮기면 트럭(HTTP 요청)이 수백 번 왕복해야 합니다. " +
        "번들러는 이 짐들을 분석하여 효율적으로 포장합니다.\n\n" +
        "**Webpack**은 풀서비스 이사 업체입니다. 짐(모듈)을 분류하고, " +
        "로더로 변환하고(TypeScript→JavaScript, SCSS→CSS), " +
        "플러그인으로 추가 작업(압축, 환경변수 주입)을 수행합니다. " +
        "무엇이든 할 수 있지만 설정이 복잡합니다.\n\n" +
        "**트리 셰이킹**은 이삿짐 정리 전문가입니다. " +
        "포장하기 전에 '이 가구는 새 집에서 안 쓸 것 같은데요?'라며 " +
        "사용하지 않는 짐(dead code)을 제거해줍니다.\n\n" +
        "**코드 스플리팅**은 짐을 여러 트럭에 나눠 싣는 것입니다. " +
        "당장 필요한 짐은 첫 번째 트럭에, 나중에 필요한 짐은 " +
        "별도 트럭에 실어 필요할 때 배달합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "브라우저에서 직접 모듈을 사용하면 다음과 같은 문제가 발생합니다.\n\n" +
        "1. **HTTP 요청 폭발** — 모듈 시스템으로 잘 분리된 프로젝트에 500개의 파일이 있다면, " +
        "브라우저가 500번의 HTTP 요청을 보내야 합니다. HTTP/2의 멀티플렉싱으로도 한계가 있습니다.\n\n" +
        "2. **의존성 해결** — `import A from './a'`에서 A가 다시 B와 C를 import하고, " +
        "B는 D를 import합니다. 이 의존성 그래프를 브라우저가 런타임에 해결하면 " +
        "워터폴(waterfall) 문제가 발생합니다.\n\n" +
        "3. **변환 필요** — TypeScript, JSX, SCSS는 브라우저가 직접 이해하지 못합니다. " +
        "JavaScript와 CSS로 변환(트랜스파일)하는 과정이 필요합니다.\n\n" +
        "4. **미사용 코드** — lodash를 import하면서 `debounce` 함수 하나만 사용해도 " +
        "전체 라이브러리(약 70KB)가 번들에 포함됩니다.\n\n" +
        "5. **초기 로딩 크기** — 모든 페이지의 코드를 하나의 번들에 넣으면 " +
        "첫 페이지를 보기 위해 불필요한 코드까지 전부 다운로드해야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### Webpack의 동작 원리\n" +
        "1. **엔트리(Entry)**: 번들링의 시작점을 지정합니다. 보통 `src/index.ts`입니다.\n" +
        "2. **의존성 그래프 구성**: 엔트리에서 시작하여 모든 import/require를 따라가며 " +
        "전체 의존성 그래프를 구성합니다.\n" +
        "3. **로더(Loader)**: 파일 유형별 변환을 수행합니다. " +
        "`ts-loader`는 TypeScript를, `css-loader`는 CSS를 처리합니다.\n" +
        "4. **플러그인(Plugin)**: 번들링 과정 전체에 개입합니다. " +
        "압축, HTML 생성, 환경변수 주입 등을 담당합니다.\n" +
        "5. **출력(Output)**: 최종 번들 파일을 생성합니다.\n\n" +
        "### 트리 셰이킹(Tree Shaking)\n" +
        "ES Module의 정적 import/export 구문을 분석하여 " +
        "실제 사용되지 않는 export를 번들에서 제거합니다. " +
        "CommonJS의 `require()`는 동적이라 트리 셰이킹이 어렵습니다.\n\n" +
        "### 코드 스플리팅(Code Splitting)\n" +
        "- **Dynamic import**: `import('./Page')`로 필요한 시점에 모듈을 로드합니다.\n" +
        "- **Vendor splitting**: React 같은 라이브러리를 별도 청크로 분리하여 캐싱 효율을 높입니다.\n" +
        "- **Route-based splitting**: 페이지별로 번들을 나누어 초기 로딩을 최소화합니다.\n\n" +
        "### ESM vs CJS\n" +
        "- **ESM(ES Module)**: `import/export` — 정적 분석 가능, 트리 셰이킹 지원.\n" +
        "- **CJS(CommonJS)**: `require/module.exports` — 동적, Node.js 기본 모듈 시스템.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 번들러 동작 원리",
      content:
        "Webpack이 모듈을 번들링하는 과정과 트리 셰이킹이 작동하는 원리를 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// === 번들러의 핵심 동작 (의사코드) ===\n' +
          '\n' +
          'interface Module {\n' +
          '  id: string;\n' +
          '  code: string;\n' +
          '  dependencies: string[];\n' +
          '  exports: string[];\n' +
          '  usedExports: string[];  // 트리 셰이킹용\n' +
          '}\n' +
          '\n' +
          'function bundle(entry: string): string {\n' +
          '  // 1단계: 의존성 그래프 구성\n' +
          '  const graph = buildDependencyGraph(entry);\n' +
          '  // entry → A → C\n' +
          '  //       → B → D\n' +
          '  //              → C (중복은 한 번만)\n' +
          '\n' +
          '  // 2단계: 로더로 변환\n' +
          '  for (const mod of graph.modules) {\n' +
          '    if (mod.id.endsWith(".ts")) {\n' +
          '      mod.code = tsLoader(mod.code);      // TS → JS\n' +
          '    }\n' +
          '    if (mod.id.endsWith(".css")) {\n' +
          '      mod.code = cssLoader(mod.code);      // CSS → JS\n' +
          '    }\n' +
          '  }\n' +
          '\n' +
          '  // 3단계: 트리 셰이킹 (사용되지 않는 export 제거)\n' +
          '  markUsedExports(graph);  // import된 것만 표시\n' +
          '  removeUnusedExports(graph);  // 미사용 코드 제거\n' +
          '\n' +
          '  // 4단계: 코드 스플리팅\n' +
          '  const chunks = splitChunks(graph);\n' +
          '  // main.js, vendor.js, page-about.js ...\n' +
          '\n' +
          '  // 5단계: 최적화 (minify, 난독화)\n' +
          '  return chunks.map(chunk => minify(chunk));\n' +
          '}\n' +
          '\n' +
          '// === 트리 셰이킹 예시 ===\n' +
          '// utils.ts:\n' +
          '// export function add(a, b) { return a + b; }\n' +
          '// export function subtract(a, b) { return a - b; }  ← 미사용\n' +
          '// export function multiply(a, b) { return a * b; }  ← 미사용\n' +
          '//\n' +
          '// app.ts:\n' +
          '// import { add } from "./utils";\n' +
          '// → 번들 결과: subtract, multiply는 제거됨',
        description:
          "번들러가 의존성을 분석하고 트리 셰이킹하는 과정의 의사코드입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Webpack 설정과 번들러 비교",
      content:
        "Webpack 기본 설정을 작성하고, Rollup, esbuild와의 차이를 비교합니다. " +
        "코드 스플리팅과 소스맵 설정도 함께 다룹니다.",
      code: {
        language: "typescript",
        code:
          '// === Webpack 기본 설정 (webpack.config.js) ===\n' +
          'const webpackConfig = {\n' +
          '  entry: "./src/index.ts",\n' +
          '  output: {\n' +
          '    path: "/dist",\n' +
          '    filename: "[name].[contenthash].js",  // 캐시 버스팅\n' +
          '    clean: true,\n' +
          '  },\n' +
          '  module: {\n' +
          '    rules: [\n' +
          '      {\n' +
          '        test: /\\.tsx?$/,\n' +
          '        use: "ts-loader",\n' +
          '        exclude: /node_modules/,\n' +
          '      },\n' +
          '      {\n' +
          '        test: /\\.css$/,\n' +
          '        use: ["style-loader", "css-loader"],\n' +
          '      },\n' +
          '    ],\n' +
          '  },\n' +
          '  optimization: {\n' +
          '    splitChunks: {\n' +
          '      chunks: "all",  // vendor 자동 분리\n' +
          '    },\n' +
          '    usedExports: true,  // 트리 셰이킹 활성화\n' +
          '  },\n' +
          '  devtool: "source-map",  // 디버깅용 소스맵\n' +
          '};\n' +
          '\n' +
          '// === Dynamic Import로 코드 스플리팅 ===\n' +
          '// React에서 lazy loading:\n' +
          '// const About = React.lazy(() => import("./pages/About"));\n' +
          '// → About 페이지 코드가 별도 청크로 분리됨\n' +
          '\n' +
          '// === 번들러 비교 ===\n' +
          'interface BundlerComparison {\n' +
          '  name: string;\n' +
          '  language: string;\n' +
          '  speed: string;\n' +
          '  config: string;\n' +
          '  bestFor: string;\n' +
          '}\n' +
          '\n' +
          'const bundlers: BundlerComparison[] = [\n' +
          '  {\n' +
          '    name: "Webpack",\n' +
          '    language: "JavaScript",\n' +
          '    speed: "느림",\n' +
          '    config: "복잡하지만 유연",\n' +
          '    bestFor: "복잡한 앱, 레거시 프로젝트",\n' +
          '  },\n' +
          '  {\n' +
          '    name: "Rollup",\n' +
          '    language: "JavaScript",\n' +
          '    speed: "보통",\n' +
          '    config: "간결",\n' +
          '    bestFor: "라이브러리 번들링",\n' +
          '  },\n' +
          '  {\n' +
          '    name: "esbuild",\n' +
          '    language: "Go",\n' +
          '    speed: "매우 빠름 (10~100x)",\n' +
          '    config: "최소",\n' +
          '    bestFor: "개발 서버, 빠른 빌드",\n' +
          '  },\n' +
          '];\n' +
          '\n' +
          '// === 소스맵 옵션 ===\n' +
          '// "source-map": 별도 .map 파일 (프로덕션용, 정확)\n' +
          '// "cheap-module-source-map": 행 단위 매핑 (빠름)\n' +
          '// "eval-source-map": 인라인 (개발용, 가장 빠름)\n' +
          '// false: 소스맵 비활성화',
        description:
          "Webpack 설정 예시와 Webpack, Rollup, esbuild의 특성 비교입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 번들러 | 언어 | 속도 | 적합한 용도 |\n" +
        "|--------|------|------|-------------|\n" +
        "| Webpack | JS | 느림 | 복잡한 앱, 풍부한 생태계 |\n" +
        "| Rollup | JS | 보통 | 라이브러리 번들링 |\n" +
        "| esbuild | Go | 매우 빠름 | 개발 서버, 빠른 빌드 |\n\n" +
        "| 최적화 기법 | 효과 |\n" +
        "|-------------|------|\n" +
        "| 트리 셰이킹 | 미사용 코드 제거 → 번들 크기 감소 |\n" +
        "| 코드 스플리팅 | 지연 로딩 → 초기 로딩 최소화 |\n" +
        "| Vendor splitting | 라이브러리 캐싱 → 반복 방문 시 빠름 |\n" +
        "| 소스맵 | 번들된 코드 디버깅 지원 |\n\n" +
        "**핵심:** 번들러는 모듈 간 의존성을 분석하여 브라우저가 실행할 수 있는 번들을 생성합니다. " +
        "트리 셰이킹으로 미사용 코드를 제거하고, 코드 스플리팅으로 초기 로딩을 최적화합니다.\n\n" +
        "**다음 챕터 미리보기:** Vite의 내부 동작을 깊이 파고들어 " +
        "개발 서버에서의 Native ESM 활용과 프로덕션 빌드에서의 Rollup 최적화를 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "번들러는 모듈 간 의존성을 분석하여 브라우저가 실행할 수 있는 번들을 생성한다. 트리 셰이킹으로 미사용 코드를 제거하고, 코드 스플리팅으로 초기 로딩을 최적화한다.",
  checklist: [
    "Webpack의 엔트리→로더→플러그인→출력 과정을 설명할 수 있다",
    "트리 셰이킹이 ESM의 정적 분석을 기반으로 동작함을 이해한다",
    "코드 스플리팅으로 초기 로딩을 최적화하는 방법을 안다",
    "ESM과 CJS의 차이와 각각의 장단점을 설명할 수 있다",
    "Webpack, Rollup, esbuild의 특성과 적합한 용도를 구분할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "트리 셰이킹이 가능하려면 어떤 모듈 시스템을 사용해야 하는가?",
      choices: [
        "CommonJS (require/module.exports)",
        "AMD (define/require)",
        "ES Module (import/export)",
        "UMD (Universal Module Definition)",
      ],
      correctIndex: 2,
      explanation:
        "ES Module의 import/export는 정적으로 분석할 수 있어 " +
        "어떤 export가 사용되고 어떤 것이 사용되지 않는지 빌드 타임에 판단 가능합니다. " +
        "CommonJS의 require()는 동적이라 정적 분석이 어렵습니다.",
    },
    {
      id: "q2",
      question: "Webpack에서 TypeScript를 처리하는 역할은?",
      choices: ["플러그인(Plugin)", "로더(Loader)", "엔트리(Entry)", "출력(Output)"],
      correctIndex: 1,
      explanation:
        "로더(Loader)는 파일을 변환하는 역할을 합니다. " +
        "ts-loader나 babel-loader가 TypeScript를 JavaScript로 변환합니다. " +
        "플러그인은 번들링 과정 전체에 개입하는 더 넓은 범위의 작업을 수행합니다.",
    },
    {
      id: "q3",
      question: "코드 스플리팅의 주요 목적은?",
      choices: [
        "코드를 난독화하기 위해",
        "초기 로딩 시 필요한 코드만 다운로드하기 위해",
        "소스맵을 생성하기 위해",
        "TypeScript를 JavaScript로 변환하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "코드 스플리팅은 번들을 여러 청크로 나누어 " +
        "현재 페이지에 필요한 코드만 먼저 다운로드하고, " +
        "나머지는 필요할 때 지연 로딩합니다. 이를 통해 초기 로딩 시간을 줄입니다.",
    },
    {
      id: "q4",
      question: "esbuild가 Webpack보다 10~100배 빠른 이유는?",
      choices: [
        "설정이 단순해서",
        "트리 셰이킹을 하지 않아서",
        "Go 언어로 작성되어 네이티브 코드로 실행되기 때문",
        "캐싱을 많이 하기 때문",
      ],
      correctIndex: 2,
      explanation:
        "esbuild는 Go 언어로 작성되어 네이티브 바이너리로 컴파일됩니다. " +
        "JavaScript 기반의 Webpack과 달리 병렬 처리와 메모리 효율이 뛰어나 " +
        "10~100배의 속도 차이를 보입니다.",
    },
    {
      id: "q5",
      question: "프로덕션 빌드에서 [contenthash]를 파일명에 사용하는 이유는?",
      choices: [
        "파일 크기를 줄이기 위해",
        "파일 내용이 변경될 때만 캐시를 무효화하기 위해",
        "보안을 강화하기 위해",
        "소스맵을 연결하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "[contenthash]는 파일 내용을 기반으로 해시를 생성합니다. " +
        "코드가 변경되면 해시가 바뀌어 브라우저가 새 파일을 다운로드하고, " +
        "변경되지 않으면 같은 해시로 캐시된 파일을 사용합니다.",
    },
  ],
};

export default chapter;
