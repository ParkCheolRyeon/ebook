import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "08-build-optimization",
  subject: "infra",
  title: "빌드 최적화 전략",
  description: "번들 분석, 코드 스플리팅, 트리 셰이킹, 압축, 캐시 전략 등 프론트엔드 빌드 최적화의 전체 흐름을 학습합니다.",
  order: 8,
  group: "빌드와 번들링",
  prerequisites: ["07-vite-deep-dive"],
  estimatedMinutes: 35,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "빌드 최적화는 **이사짐 센터의 효율적인 포장 작업**과 같습니다.\n\n" +
        "**번들 분석**은 이사짐 목록을 작성하는 것입니다. 어떤 짐이 얼마나 크고 무거운지 파악해야 최적의 포장 전략을 세울 수 있습니다.\n\n" +
        "**코드 스플리팅**은 짐을 용도별로 나누는 것입니다. 새 집에 도착하자마자 필요한 생필품 박스와, 나중에 천천히 정리할 시즌 용품 박스를 분리합니다. 웹에서는 첫 화면에 필요한 코드를 먼저 보내고, 나머지는 나중에 로드합니다.\n\n" +
        "**트리 셰이킹**은 안 쓰는 물건을 버리는 것입니다. 3년 동안 한 번도 안 입은 옷은 굳이 새 집에 가져갈 필요 없습니다.\n\n" +
        "**압축**은 진공 포장입니다. 같은 내용물이지만 부피를 획기적으로 줄여 배달 트럭(네트워크)에 더 많이 실을 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 애플리케이션은 시간이 지나면 번들 크기가 눈덩이처럼 커집니다.\n\n" +
        "1. **거대한 초기 번들** — 모든 코드가 하나의 파일에 합쳐져 초기 로딩이 느려집니다. 사용자는 첫 화면을 보기 위해 관리자 페이지의 코드까지 다운로드합니다.\n\n" +
        "2. **죽은 코드 포함** — 라이브러리의 전체 코드가 번들에 포함됩니다. lodash 전체를 import했지만 실제로는 `debounce` 하나만 사용하는 경우가 대표적입니다.\n\n" +
        "3. **캐시 비효율** — 작은 수정에도 전체 번들의 해시가 바뀌어 사용자가 모든 것을 다시 다운로드합니다.\n\n" +
        "4. **측정 부재** — 어떤 코드가 번들의 대부분을 차지하는지 모르면 최적화 방향을 잡을 수 없습니다.\n\n" +
        "최적화의 핵심 원칙: **측정 없이 최적화하지 마라.** 먼저 병목을 찾아야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "빌드 최적화는 **측정 → 분석 → 개선**의 순서로 진행합니다.\n\n" +
        "### 1단계: 번들 분석\n" +
        "`rollup-plugin-visualizer`(Vite)나 `webpack-bundle-analyzer`(Webpack)로 번들의 구성을 시각화합니다. 어떤 라이브러리가 얼마나 차지하는지 트리맵으로 한눈에 파악할 수 있습니다.\n\n" +
        "### 2단계: 코드 스플리팅\n" +
        "라우트 기반 스플리팅으로 페이지별 코드를 분리합니다. `React.lazy()`와 동적 `import()`로 필요한 시점에 로드합니다. vendor 청크를 분리하면 앱 코드만 바뀔 때 라이브러리 캐시를 유지합니다.\n\n" +
        "### 3단계: 트리 셰이킹\n" +
        "`package.json`의 `sideEffects: false`로 안전하게 제거할 수 있는 코드를 표시합니다. named import를 사용하면 사용하지 않는 export를 제거할 수 있습니다.\n\n" +
        "### 4단계: 전송 최적화\n" +
        "gzip/brotli 압축, 이미지/폰트 최적화, preload/prefetch 힌트, content hash 기반 캐시로 전송 효율을 극대화합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 번들 분석과 청크 전략",
      content:
        "번들 분석 도구를 설정하고, 효율적인 청크 분리 전략을 구현하는 방법을 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// vite.config.ts — 번들 분석 + 청크 전략\n' +
          'import { defineConfig } from "vite";\n' +
          'import { visualizer } from "rollup-plugin-visualizer";\n' +
          '\n' +
          'export default defineConfig({\n' +
          '  plugins: [\n' +
          '    // 번들 분석: 빌드 후 stats.html 생성\n' +
          '    visualizer({\n' +
          '      filename: "stats.html",\n' +
          '      gzipSize: true,    // gzip 압축 후 크기 표시\n' +
          '      brotliSize: true,  // brotli 압축 후 크기 표시\n' +
          '    }),\n' +
          '  ],\n' +
          '\n' +
          '  build: {\n' +
          '    rollupOptions: {\n' +
          '      output: {\n' +
          '        // 수동 청크 분리 전략\n' +
          '        manualChunks(id) {\n' +
          '          // React 관련 → vendor-react 청크\n' +
          '          if (id.includes("node_modules/react")) {\n' +
          '            return "vendor-react";\n' +
          '          }\n' +
          '          // UI 라이브러리 → vendor-ui 청크\n' +
          '          if (id.includes("node_modules/@mui")) {\n' +
          '            return "vendor-ui";\n' +
          '          }\n' +
          '          // 나머지 node_modules → vendor 청크\n' +
          '          if (id.includes("node_modules")) {\n' +
          '            return "vendor";\n' +
          '          }\n' +
          '        },\n' +
          '      },\n' +
          '    },\n' +
          '\n' +
          '    // 청크 크기 경고 기준 (KB)\n' +
          '    chunkSizeWarningLimit: 500,\n' +
          '  },\n' +
          '});\n' +
          '\n' +
          '// === 트리 셰이킹 최적화 ===\n' +
          '// package.json에 sideEffects 설정\n' +
          '// {\n' +
          '//   "sideEffects": [\n' +
          '//     "*.css",\n' +
          '//     "*.global.ts"\n' +
          '//   ]\n' +
          '// }\n' +
          '\n' +
          '// ❌ 나쁜 예: 전체 import → 트리 셰이킹 불가\n' +
          'import _ from "lodash";\n' +
          'const result = _.debounce(fn, 300);\n' +
          '\n' +
          '// ✅ 좋은 예: named import → 사용하는 것만 번들에 포함\n' +
          'import { debounce } from "lodash-es";\n' +
          'const result = debounce(fn, 300);',
        description: "manualChunks로 vendor 라이브러리를 분리하면 앱 코드 변경 시에도 vendor 캐시가 유지됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 압축, 캐시, 리소스 힌트",
      content:
        "번들 압축, content hash 캐시, preload/prefetch 등 전송 최적화를 실제 설정으로 구현합니다. Lighthouse CI로 자동화된 성능 검증도 다룹니다.",
      code: {
        language: "typescript",
        code:
          '// vite.config.ts — 압축 플러그인\n' +
          'import viteCompression from "vite-plugin-compression";\n' +
          '\n' +
          'export default defineConfig({\n' +
          '  plugins: [\n' +
          '    // gzip 압축 (대부분의 서버/CDN에서 지원)\n' +
          '    viteCompression({ algorithm: "gzip" }),\n' +
          '    // brotli 압축 (gzip보다 15-25% 더 작음)\n' +
          '    viteCompression({ algorithm: "brotliCompress" }),\n' +
          '  ],\n' +
          '\n' +
          '  build: {\n' +
          '    // CSS 코드 스플리팅 활성화\n' +
          '    cssCodeSplit: true,\n' +
          '    // 에셋 파일명에 content hash 포함\n' +
          '    rollupOptions: {\n' +
          '      output: {\n' +
          '        // JS: [name].[hash].js\n' +
          '        entryFileNames: "assets/[name].[hash].js",\n' +
          '        chunkFileNames: "assets/[name].[hash].js",\n' +
          '        // 이미지/폰트: assets/[name].[hash].[ext]\n' +
          '        assetFileNames: "assets/[name].[hash].[ext]",\n' +
          '      },\n' +
          '    },\n' +
          '  },\n' +
          '});\n' +
          '\n' +
          '// === 리소스 힌트: preload / prefetch ===\n' +
          '// index.html 또는 프레임워크 설정에서\n' +
          '// <link rel="preload" href="/fonts/inter.woff2"\n' +
          '//       as="font" type="font/woff2" crossorigin />\n' +
          '// → 현재 페이지에 반드시 필요한 리소스를 우선 로드\n' +
          '\n' +
          '// <link rel="prefetch" href="/js/admin-chunk.js" />\n' +
          '// → 다음 페이지에서 필요할 리소스를 미리 로드\n' +
          '\n' +
          '// === Lighthouse CI 자동화 ===\n' +
          '// lighthouserc.js\n' +
          'const config = {\n' +
          '  ci: {\n' +
          '    collect: {\n' +
          '      url: ["http://localhost:3000"],\n' +
          '      numberOfRuns: 3,\n' +
          '    },\n' +
          '    assert: {\n' +
          '      assertions: {\n' +
          '        "categories:performance": ["error", { minScore: 0.9 }],\n' +
          '        "first-contentful-paint": ["warn", { maxNumericValue: 2000 }],\n' +
          '        "total-byte-weight": ["error", { maxNumericValue: 500000 }],\n' +
          '      },\n' +
          '    },\n' +
          '  },\n' +
          '};',
        description: "content hash를 파일명에 포함하면 내용이 바뀔 때만 캐시가 무효화되어 효율적인 장기 캐싱이 가능합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "빌드 최적화의 전체 흐름을 정리합니다.\n\n" +
        "| 단계 | 목표 | 도구/기법 |\n" +
        "|------|------|----------|\n" +
        "| 측정 | 병목 파악 | visualizer, bundle-analyzer |\n" +
        "| 코드 분리 | 초기 로딩 최소화 | 라우트 스플리팅, manualChunks |\n" +
        "| 불필요 코드 제거 | 번들 크기 축소 | 트리 셰이킹, sideEffects |\n" +
        "| 리소스 최적화 | 에셋 크기 축소 | 이미지 압축, 폰트 서브셋 |\n" +
        "| 전송 최적화 | 네트워크 효율 | gzip/brotli, preload/prefetch |\n" +
        "| 캐시 전략 | 재방문 속도 | content hash, 장기 캐싱 |\n" +
        "| 자동 검증 | 회귀 방지 | Lighthouse CI |\n\n" +
        "**핵심 원칙:** 감이 아닌 데이터로 최적화하세요. 번들 분석 없이 코드를 나누는 것은 지도 없이 길을 찾는 것과 같습니다.\n\n" +
        "**다음 챕터 미리보기:** 최적화된 빌드를 실행할 환경인 Docker 컨테이너의 기초 개념과 명령어를 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "빌드 최적화는 '측정 → 분석 → 개선' 순서로 진행한다. 번들 분석으로 병목을 찾고, 코드 스플리팅으로 청크를 나누고, 압축과 캐시 전략으로 전송을 최적화한다.",
  checklist: [
    "rollup-plugin-visualizer로 번들 구성을 분석할 수 있다",
    "manualChunks를 활용한 청크 분리 전략을 설명할 수 있다",
    "트리 셰이킹과 sideEffects의 관계를 이해한다",
    "content hash 기반 캐시 무효화 원리를 설명할 수 있다",
    "Lighthouse CI를 파이프라인에 통합하는 방법을 알고 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "번들 최적화의 첫 번째 단계로 가장 적절한 것은?",
      choices: [
        "코드 스플리팅 적용",
        "gzip 압축 설정",
        "번들 분석 도구로 현재 상태 측정",
        "트리 셰이킹 활성화",
      ],
      correctIndex: 2,
      explanation: "최적화는 항상 '측정'부터 시작합니다. 번들 분석 도구로 어떤 코드가 얼마나 차지하는지 파악해야 효과적인 최적화 전략을 세울 수 있습니다.",
    },
    {
      id: "q2",
      question: "vendor 청크를 앱 코드와 분리하는 가장 큰 이유는?",
      choices: [
        "번들 크기를 줄이기 위해",
        "라이브러리 캐시를 앱 코드 변경과 독립적으로 유지하기 위해",
        "트리 셰이킹을 활성화하기 위해",
        "코드 가독성을 높이기 위해",
      ],
      correctIndex: 1,
      explanation: "vendor 청크를 분리하면 앱 코드만 변경되었을 때 vendor 청크의 해시가 변하지 않아 사용자 브라우저의 캐시를 유지할 수 있습니다.",
    },
    {
      id: "q3",
      question: "트리 셰이킹이 효과적으로 동작하려면 package.json에 어떤 설정이 필요한가?",
      choices: [
        "\"type\": \"module\"",
        "\"sideEffects\": false",
        "\"treeshake\": true",
        "\"module\": \"esm\"",
      ],
      correctIndex: 1,
      explanation: "sideEffects: false는 번들러에게 '이 패키지의 모든 파일은 import하지 않으면 안전하게 제거할 수 있다'고 알려줍니다. CSS 등 사이드 이펙트가 있는 파일은 배열로 예외를 지정합니다.",
    },
    {
      id: "q4",
      question: "brotli 압축이 gzip보다 유리한 점은?",
      choices: [
        "모든 브라우저에서 지원된다",
        "압축 속도가 더 빠르다",
        "동일 내용에 대해 약 15-25% 더 작은 파일 크기를 제공한다",
        "서버 설정이 필요 없다",
      ],
      correctIndex: 2,
      explanation: "brotli는 gzip보다 높은 압축률을 제공하여 동일 내용에 대해 약 15-25% 더 작은 파일을 생성합니다. 대부분의 모던 브라우저와 CDN에서 지원합니다.",
    },
    {
      id: "q5",
      question: "파일명에 content hash를 포함하는 이유는?",
      choices: [
        "파일 보안을 강화하기 위해",
        "파일 충돌을 방지하기 위해",
        "파일 내용이 바뀔 때만 브라우저 캐시를 무효화하기 위해",
        "CDN 배포를 가능하게 하기 위해",
      ],
      correctIndex: 2,
      explanation: "content hash는 파일 내용에서 생성됩니다. 내용이 바뀌면 해시도 바뀌어 새 파일로 인식되고, 내용이 같으면 해시가 동일하여 캐시를 계속 사용합니다.",
    },
  ],
};

export default chapter;
