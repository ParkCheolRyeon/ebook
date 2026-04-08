import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "07-vite-deep-dive",
  subject: "infra",
  title: "Vite 심화",
  description: "Vite의 이중 전략(개발 ESM + 프로덕션 Rollup), HMR 원리, 플러그인 시스템, 환경변수, SSR 모드 등을 깊이 이해합니다.",
  order: 7,
  group: "빌드와 번들링",
  prerequisites: ["06-module-bundlers"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Vite를 레스토랑에 비유해 봅시다.\n\n" +
        "**개발 서버(ESM 네이티브)**는 주문 즉시 재료를 바로 가져다 주는 **오픈 키친**입니다. 손님(브라우저)이 특정 요리(모듈)를 요청하면, 그 재료만 즉석에서 준비합니다. 전체 코스를 미리 만들어둘 필요가 없으니 시작이 빠릅니다.\n\n" +
        "**프로덕션 빌드(Rollup)**는 수백 인분을 미리 준비하는 **케이터링 서비스**입니다. 모든 요리를 최적의 순서로 조리하고, 남는 재료(사용하지 않는 코드)를 제거하고, 용기에 효율적으로 담아(번들링) 배달합니다.\n\n" +
        "이 이중 전략 덕분에 개발할 때는 번개처럼 빠르고, 배포할 때는 완벽하게 최적화됩니다. 기존 번들러들이 개발 시에도 케이터링 방식을 고집했던 것과 대조적입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "전통적인 번들러(Webpack)의 개발 서버는 프로젝트가 커질수록 치명적인 문제를 겪습니다.\n\n" +
        "1. **콜드 스타트 지연** — 수천 개의 모듈을 모두 번들링한 후에야 서버가 시작됩니다. 대규모 프로젝트에서 30초~1분 이상 걸리기도 합니다.\n\n" +
        "2. **느린 HMR** — 파일 하나를 수정해도 의존성 그래프를 다시 분석하고 관련 모듈을 재번들링합니다. 프로젝트가 커지면 HMR도 느려집니다.\n\n" +
        "3. **이중 작업** — 개발용 번들과 프로덕션용 번들의 설정이 다르지만, 본질적으로 같은 번들링 과정을 두 번 구성해야 합니다.\n\n" +
        "핵심 질문: 브라우저가 이미 ES 모듈을 네이티브로 지원하는데, 왜 개발 시에도 모든 것을 번들링해야 할까요?",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Vite는 개발과 프로덕션을 완전히 다른 전략으로 접근합니다.\n\n" +
        "### 개발 서버: ESM 네이티브 서빙\n" +
        "브라우저의 `<script type=\"module\">`을 활용합니다. 소스 코드를 번들링하지 않고, 브라우저가 `import`를 만날 때마다 해당 파일을 HTTP 요청으로 가져옵니다. Vite는 각 요청에 대해 필요한 변환(TypeScript, JSX)만 수행합니다.\n\n" +
        "의존성(node_modules)은 **esbuild**로 사전 번들링(pre-bundling)합니다. esbuild는 Go로 작성되어 기존 JS 번들러보다 10~100배 빠릅니다.\n\n" +
        "### 프로덕션 빌드: Rollup\n" +
        "배포용 빌드는 Rollup을 사용합니다. 트리 셰이킹, 코드 스플리팅, 청크 최적화 등 프로덕션에 필요한 최적화를 모두 수행합니다.\n\n" +
        "### HMR: 정밀 업데이트\n" +
        "모듈이 변경되면 해당 모듈과 직접적인 상위 모듈만 교체합니다. 전체 의존성 그래프를 재분석하지 않으므로 프로젝트 크기와 관계없이 일정한 속도를 유지합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: vite.config.ts 주요 설정",
      content:
        "실무에서 자주 사용하는 vite.config.ts 설정을 살펴봅시다. 플러그인, 프록시, 환경변수, glob import 등 핵심 기능을 다룹니다.",
      code: {
        language: "typescript",
        code:
          '// vite.config.ts — 실무 프로젝트 설정 예시\n' +
          'import { defineConfig } from "vite";\n' +
          'import react from "@vitejs/plugin-react";\n' +
          '\n' +
          'export default defineConfig(({ mode }) => ({\n' +
          '  // 플러그인 시스템: Rollup 플러그인 호환 + Vite 전용 훅\n' +
          '  plugins: [\n' +
          '    react(),\n' +
          '    // 커스텀 플러그인 예시\n' +
          '    {\n' +
          '      name: "html-transform",\n' +
          '      transformIndexHtml(html) {\n' +
          '        return html.replace(\n' +
          '          /<title>(.*?)<\\/title>/,\n' +
          '          `<title>My App - ${mode}</title>`\n' +
          '        );\n' +
          '      },\n' +
          '    },\n' +
          '  ],\n' +
          '\n' +
          '  // 개발 서버 프록시 — CORS 문제 해결\n' +
          '  server: {\n' +
          '    port: 3000,\n' +
          '    proxy: {\n' +
          '      "/api": {\n' +
          '        target: "http://localhost:8080",\n' +
          '        changeOrigin: true,\n' +
          '        rewrite: (path) => path.replace(/^\\/api/, ""),\n' +
          '      },\n' +
          '    },\n' +
          '  },\n' +
          '\n' +
          '  // 빌드 옵션\n' +
          '  build: {\n' +
          '    target: "es2020",\n' +
          '    rollupOptions: {\n' +
          '      output: {\n' +
          '        manualChunks: {\n' +
          '          vendor: ["react", "react-dom"],\n' +
          '        },\n' +
          '      },\n' +
          '    },\n' +
          '  },\n' +
          '\n' +
          '  // 경로 별칭\n' +
          '  resolve: {\n' +
          '    alias: { "@": "/src" },\n' +
          '  },\n' +
          '}));\n' +
          '\n' +
          '// === 환경변수 사용 ===\n' +
          '// .env.development\n' +
          '// VITE_API_URL=http://localhost:8080\n' +
          '// VITE_APP_TITLE=My App (Dev)\n' +
          '\n' +
          '// 코드에서 접근 (VITE_ 접두사 필수)\n' +
          'const apiUrl = import.meta.env.VITE_API_URL;\n' +
          'const isDev = import.meta.env.DEV; // boolean\n' +
          '\n' +
          '// === Glob Import ===\n' +
          '// 여러 파일을 패턴으로 한 번에 가져오기\n' +
          'const modules = import.meta.glob("./modules/*.ts");\n' +
          '// { "./modules/a.ts": () => import("./modules/a.ts"), ... }\n' +
          '\n' +
          '// 즉시 로드 (eager)\n' +
          'const eagerModules = import.meta.glob("./modules/*.ts", {\n' +
          '  eager: true,\n' +
          '});',
        description: "Vite 설정은 defineConfig 헬퍼로 타입 안전성을 확보하고, 함수 형태로 mode에 따른 조건부 설정이 가능합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: SSR 모드와 HMR 커스텀",
      content:
        "Vite의 SSR 모드 설정과 HMR API를 활용하는 방법을 실습합니다. SSR은 서버에서 HTML을 렌더링하고 클라이언트에서 하이드레이션하는 패턴입니다.",
      code: {
        language: "typescript",
        code:
          '// === SSR 모드 설정 ===\n' +
          '// server.ts — Express + Vite SSR\n' +
          'import express from "express";\n' +
          'import { createServer as createViteServer } from "vite";\n' +
          '\n' +
          'async function createServer() {\n' +
          '  const app = express();\n' +
          '  const vite = await createViteServer({\n' +
          '    server: { middlewareMode: true },\n' +
          '    appType: "custom",\n' +
          '  });\n' +
          '\n' +
          '  // Vite 미들웨어 — HMR, 모듈 변환 처리\n' +
          '  app.use(vite.middlewares);\n' +
          '\n' +
          '  app.use("*", async (req, res) => {\n' +
          '    // 1. index.html 읽기\n' +
          '    let template = readFileSync("index.html", "utf-8");\n' +
          '    // 2. Vite HTML 변환 (HMR 클라이언트 주입)\n' +
          '    template = await vite.transformIndexHtml(req.originalUrl, template);\n' +
          '    // 3. SSR 렌더링\n' +
          '    const { render } = await vite.ssrLoadModule("/src/entry-server.ts");\n' +
          '    const appHtml = await render(req.originalUrl);\n' +
          '    // 4. HTML에 삽입\n' +
          '    const html = template.replace("<!--ssr-outlet-->", appHtml);\n' +
          '    res.status(200).set({ "Content-Type": "text/html" }).end(html);\n' +
          '  });\n' +
          '\n' +
          '  app.listen(5173);\n' +
          '}\n' +
          '\n' +
          '// === HMR API 활용 ===\n' +
          '// 모듈 수준의 상태 유지\n' +
          'if (import.meta.hot) {\n' +
          '  // 이 모듈이 교체될 때 실행\n' +
          '  import.meta.hot.accept((newModule) => {\n' +
          '    console.log("모듈 업데이트:", newModule);\n' +
          '  });\n' +
          '\n' +
          '  // 모듈 교체 전 상태 저장\n' +
          '  import.meta.hot.dispose((data) => {\n' +
          '    data.savedState = currentState;\n' +
          '  });\n' +
          '\n' +
          '  // 이전 상태 복원\n' +
          '  const prevData = import.meta.hot.data;\n' +
          '  if (prevData.savedState) {\n' +
          '    restoreState(prevData.savedState);\n' +
          '  }\n' +
          '}',
        description: "SSR 모드에서 Vite는 미들웨어로 동작하며, HMR API로 모듈 교체 시 상태를 보존할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "Vite의 핵심은 **이중 전략**입니다.\n\n" +
        "| 구분 | 개발 서버 | 프로덕션 빌드 |\n" +
        "|------|----------|-------------|\n" +
        "| 번들러 | 없음 (ESM 네이티브) | Rollup |\n" +
        "| 의존성 처리 | esbuild 사전 번들링 | Rollup 트리 셰이킹 |\n" +
        "| 모듈 변환 | 요청 시 즉시 변환 | 전체 빌드 |\n" +
        "| HMR | 모듈 단위 정밀 교체 | 해당 없음 |\n\n" +
        "**핵심 설정 포인트:**\n" +
        "- `server.proxy`로 CORS 없이 API 연동\n" +
        "- `import.meta.env`로 환경별 설정 분리 (VITE_ 접두사)\n" +
        "- `import.meta.glob`으로 동적 모듈 로딩\n" +
        "- 플러그인 시스템으로 빌드 파이프라인 커스터마이징\n" +
        "- SSR 모드로 서버 사이드 렌더링 지원\n\n" +
        "**다음 챕터 미리보기:** Vite(Rollup)가 생성한 번들을 분석하고, 코드 스플리팅·압축·캐시 전략 등 빌드 최적화 기법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Vite는 개발 시 ESM 네이티브 서빙으로 번들링 없이 즉시 시작하고, 프로덕션에서는 Rollup으로 최적화된 번들을 생성한다. 이 이중 전략이 빠른 DX와 최적화된 빌드를 동시에 달성한다.",
  checklist: [
    "Vite의 개발 서버가 ESM 네이티브 서빙을 사용하는 이유를 설명할 수 있다",
    "esbuild 사전 번들링의 역할과 필요성을 이해한다",
    "vite.config.ts에서 프록시, 환경변수, 플러그인을 설정할 수 있다",
    "import.meta.glob과 import.meta.env의 사용법을 알고 있다",
    "Vite SSR 모드의 기본 구조를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Vite 개발 서버가 기존 번들러보다 빠르게 시작하는 핵심 원리는?",
      choices: [
        "더 빠른 JavaScript 파서를 사용해서",
        "소스 코드를 번들링하지 않고 ESM 네이티브로 서빙해서",
        "멀티스레드로 번들링해서",
        "캐시를 적극 활용해서",
      ],
      correctIndex: 1,
      explanation: "Vite 개발 서버는 소스 코드를 번들링하지 않습니다. 브라우저의 ESM 지원을 활용해 요청 시점에 필요한 모듈만 변환하므로 프로젝트 크기에 관계없이 빠르게 시작합니다.",
    },
    {
      id: "q2",
      question: "Vite에서 환경변수를 클라이언트 코드에 노출하려면 어떤 접두사가 필요한가?",
      choices: ["REACT_APP_", "NEXT_PUBLIC_", "VITE_", "PUBLIC_"],
      correctIndex: 2,
      explanation: "Vite는 VITE_ 접두사가 붙은 환경변수만 클라이언트 번들에 포함합니다. 이를 통해 비밀 키가 실수로 노출되는 것을 방지합니다.",
    },
    {
      id: "q3",
      question: "Vite가 node_modules의 의존성을 사전 번들링하는 데 사용하는 도구는?",
      choices: ["Rollup", "Webpack", "esbuild", "SWC"],
      correctIndex: 2,
      explanation: "Vite는 Go로 작성된 esbuild를 사용해 의존성을 사전 번들링합니다. esbuild는 기존 JS 번들러보다 10~100배 빠르며, CommonJS를 ESM으로 변환하는 역할도 합니다.",
    },
    {
      id: "q4",
      question: "import.meta.glob('./modules/*.ts')의 반환값은?",
      choices: [
        "모듈들의 배열",
        "모듈들의 내용이 담긴 객체",
        "파일 경로를 키로, 동적 import 함수를 값으로 하는 객체",
        "Promise 배열",
      ],
      correctIndex: 2,
      explanation: "import.meta.glob은 기본적으로 lazy 모드로 동작하며, 파일 경로를 키로 하고 () => import(...)  함수를 값으로 하는 객체를 반환합니다. eager 옵션으로 즉시 로드도 가능합니다.",
    },
    {
      id: "q5",
      question: "Vite의 프로덕션 빌드에 사용되는 번들러는?",
      choices: ["esbuild", "Webpack", "Rollup", "Parcel"],
      correctIndex: 2,
      explanation: "Vite는 프로덕션 빌드에 Rollup을 사용합니다. Rollup은 효율적인 트리 셰이킹과 코드 스플리팅을 제공하며, Vite 플러그인도 Rollup 플러그인 인터페이스를 확장한 것입니다.",
    },
  ],
};

export default chapter;
