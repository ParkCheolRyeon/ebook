import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "16-network-optimization",
  subject: "network",
  title: "네트워크 최적화",
  description: "요청 수 줄이기, 전송 크기 줄이기, 지연 시간 줄이기 등 프론트엔드 네트워크 성능을 체계적으로 최적화하는 방법을 학습합니다.",
  order: 16,
  group: "브라우저 네트워킹",
  prerequisites: ["08-http2-http3"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "네트워크 최적화는 택배 배송 효율을 높이는 것과 비슷합니다.\n\n" +
        "**요청 수 줄이기(Bundling)**는 여러 소포를 하나의 큰 상자에 합포하는 것입니다. " +
        "택배차가 한 번만 방문해도 되므로 배송 효율이 올라갑니다.\n\n" +
        "**전송 크기 줄이기(Compression)**는 진공 압축 포장입니다. " +
        "옷을 납작하게 압축하면 같은 공간에 더 많이 넣을 수 있습니다. " +
        "Gzip과 Brotli는 이 압축 기계에 해당합니다.\n\n" +
        "**지연 시간 줄이기(CDN)**는 전국에 물류 거점을 두는 것입니다. " +
        "서울에서 부산으로 보내는 대신, 부산 근처 물류센터에서 바로 배송하면 빠릅니다.\n\n" +
        "**리소스 힌트(Preconnect/Prefetch)**는 '내일 택배가 올 거니까 미리 문 앞 정리해둬'라고 " +
        "예고하는 것입니다. 미리 준비하면 실제 배송이 빨라집니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "현대 웹 애플리케이션은 수많은 리소스를 네트워크로 주고받습니다.\n\n" +
        "**성능 저하의 3대 원인:**\n\n" +
        "1. **너무 많은 요청**: 수십 개의 JS, CSS, 이미지 파일을 각각 요청\n" +
        "   - 각 요청마다 DNS 조회, TCP 연결, TLS 핸드셰이크 비용 발생\n" +
        "   - HTTP/1.1은 도메인당 동시 연결 수 제한 (보통 6개)\n\n" +
        "2. **너무 큰 전송 크기**: 압축하지 않은 JS 번들, 최적화하지 않은 이미지\n" +
        "   - 번들 크기가 1MB를 넘는 SPA가 흔함\n" +
        "   - 모바일 네트워크에서 수 초의 로딩 지연\n\n" +
        "3. **너무 먼 서버**: 사용자와 서버 간 물리적 거리에 의한 지연\n" +
        "   - 한국에서 미국 서버까지 RTT(Round-Trip Time)가 200ms 이상\n\n" +
        "**Core Web Vitals로 측정:**\n" +
        "- LCP (Largest Contentful Paint): 가장 큰 콘텐츠 렌더링 시간 — 2.5초 이내\n" +
        "- INP (Interaction to Next Paint): 인터랙션 반응 시간 — 200ms 이내\n" +
        "- CLS (Cumulative Layout Shift): 레이아웃 변동 — 0.1 이하",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. 요청 수 줄이기\n" +
        "- **번들링**: Webpack/Vite로 여러 파일을 하나로 합침\n" +
        "- **CSS Sprites / SVG Sprites**: 여러 아이콘을 하나의 파일로 합침\n" +
        "- **인라이닝**: 작은 CSS/JS/이미지를 HTML에 직접 포함 (data URI)\n" +
        "- **코드 분할(Code Splitting)**: 필요한 코드만 로드 (React.lazy + dynamic import)\n\n" +
        "### 2. 전송 크기 줄이기\n" +
        "- **텍스트 압축**: Brotli(br) > Gzip(gz) — 서버에서 자동 압축\n" +
        "- **코드 압축(Minification)**: 공백, 주석, 긴 변수명 제거 (Terser, cssnano)\n" +
        "- **Tree Shaking**: 사용하지 않는 코드 제거 (ESM 기반)\n" +
        "- **이미지 최적화**: WebP/AVIF 포맷, 적절한 해상도, `<picture>` 태그, lazy loading\n\n" +
        "### 3. 지연 시간 줄이기\n" +
        "- **CDN (Content Delivery Network)**: 전 세계 엣지 서버에서 리소스 제공\n" +
        "- **리소스 힌트**:\n" +
        "  - `<link rel=\"preconnect\">`: 미리 DNS + TCP + TLS 연결\n" +
        "  - `<link rel=\"dns-prefetch\">`: DNS만 미리 조회\n" +
        "  - `<link rel=\"prefetch\">`: 다음 페이지에 필요한 리소스 미리 로드\n" +
        "  - `<link rel=\"preload\">`: 현재 페이지에 반드시 필요한 리소스 우선 로드\n\n" +
        "### 4. 렌더링 최적화\n" +
        "- **Lazy Loading**: `loading=\"lazy\"` 속성으로 뷰포트 밖 이미지 지연 로드\n" +
        "- **width/height 명시**: CLS 방지 (브라우저가 공간 미리 확보)\n" +
        "- **Critical CSS**: 스크롤 없이 보이는 영역의 CSS를 인라인으로 포함\n" +
        "- **Font Display**: `font-display: swap`으로 폰트 로딩 중에도 텍스트 표시",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 네트워크 워터폴 분석",
      content:
        "네트워크 요청의 타이밍을 분석하고, 최적화 포인트를 찾는 로직을 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          "// 네트워크 성능 분석 도구 (의사코드)\n" +
          "\n" +
          "interface ResourceTiming {\n" +
          "  name: string;               // URL\n" +
          "  initiatorType: string;       // script, css, img 등\n" +
          "  transferSize: number;        // 전송 크기 (bytes)\n" +
          "  encodedBodySize: number;     // 압축된 본문 크기\n" +
          "  decodedBodySize: number;     // 원본 본문 크기\n" +
          "  dnsLookup: number;           // DNS 조회 시간\n" +
          "  tcpConnect: number;          // TCP 연결 시간\n" +
          "  tlsHandshake: number;        // TLS 핸드셰이크 시간\n" +
          "  ttfb: number;               // Time to First Byte\n" +
          "  contentDownload: number;     // 콘텐츠 다운로드 시간\n" +
          "  totalTime: number;           // 전체 소요 시간\n" +
          "}\n" +
          "\n" +
          "function analyzeWaterfall(entries: ResourceTiming[]): void {\n" +
          "  // 1. 전체 요청 수 확인\n" +
          "  console.log('총 요청 수: ' + entries.length);\n" +
          "\n" +
          "  // 2. 전체 전송 크기\n" +
          "  const totalSize = entries.reduce((sum, e) => sum + e.transferSize, 0);\n" +
          "  console.log('총 전송 크기: ' + (totalSize / 1024).toFixed(1) + 'KB');\n" +
          "\n" +
          "  // 3. 압축 효율 확인\n" +
          "  const textResources = entries.filter(\n" +
          "    e => ['script', 'css'].includes(e.initiatorType)\n" +
          "  );\n" +
          "  for (const res of textResources) {\n" +
          "    const ratio = (1 - res.encodedBodySize / res.decodedBodySize) * 100;\n" +
          "    if (ratio < 50) {\n" +
          "      console.warn('압축률 낮음: ' + res.name + ' (' + ratio.toFixed(0) + '%)');\n" +
          "    }\n" +
          "  }\n" +
          "\n" +
          "  // 4. 느린 리소스 식별\n" +
          "  const slowResources = entries.filter(e => e.totalTime > 1000);\n" +
          "  for (const res of slowResources) {\n" +
          "    console.warn('느린 리소스: ' + res.name);\n" +
          "    if (res.dnsLookup > 100) console.log('  → DNS 조회 느림: preconnect 고려');\n" +
          "    if (res.ttfb > 500) console.log('  → TTFB 느림: CDN 또는 서버 최적화 필요');\n" +
          "    if (res.contentDownload > 500) console.log('  → 다운로드 느림: 크기 줄이기 필요');\n" +
          "  }\n" +
          "\n" +
          "  // 5. 큰 리소스 식별\n" +
          "  const largeResources = entries.filter(e => e.transferSize > 100 * 1024);\n" +
          "  for (const res of largeResources) {\n" +
          "    console.warn('큰 리소스: ' + res.name +\n" +
          "      ' (' + (res.transferSize / 1024).toFixed(0) + 'KB)');\n" +
          "  }\n" +
          "}",
        description: "Performance API의 ResourceTiming으로 워터폴을 분석하면 DNS, 연결, TTFB, 다운로드 각 단계의 병목을 찾을 수 있다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 최적화 기법 적용",
      content:
        "리소스 힌트, 이미지 최적화, Core Web Vitals 측정을 실제 코드로 적용합니다.",
      code: {
        language: "typescript",
        code:
          "// 1. HTML에서 리소스 힌트 적용\n" +
          "// <head> 안에 추가\n" +
          "// <link rel=\"preconnect\" href=\"https://api.example.com\" />\n" +
          "// <link rel=\"dns-prefetch\" href=\"https://cdn.example.com\" />\n" +
          "// <link rel=\"preload\" href=\"/fonts/main.woff2\" as=\"font\"\n" +
          "//       type=\"font/woff2\" crossorigin />\n" +
          "\n" +
          "// 2. 이미지 최적화 컴포넌트\n" +
          "interface OptimizedImageProps {\n" +
          "  src: string;\n" +
          "  alt: string;\n" +
          "  width: number;\n" +
          "  height: number;\n" +
          "  priority?: boolean;\n" +
          "}\n" +
          "\n" +
          "function createImageElement(props: OptimizedImageProps): string {\n" +
          "  const { src, alt, width, height, priority } = props;\n" +
          "  const baseName = src.replace(/\\.[^.]+$/, '');\n" +
          "\n" +
          "  // <picture> 태그로 최적 포맷 제공\n" +
          "  return '<picture>' +\n" +
          "    '<source srcset=\"' + baseName + '.avif\" type=\"image/avif\" />' +\n" +
          "    '<source srcset=\"' + baseName + '.webp\" type=\"image/webp\" />' +\n" +
          "    '<img src=\"' + src + '\"' +\n" +
          "    ' alt=\"' + alt + '\"' +\n" +
          "    ' width=\"' + width + '\"' +\n" +
          "    ' height=\"' + height + '\"' +\n" +
          "    (priority ? '' : ' loading=\"lazy\" decoding=\"async\"') +\n" +
          "    ' />' +\n" +
          "    '</picture>';\n" +
          "}\n" +
          "\n" +
          "// 3. Core Web Vitals 측정\n" +
          "function measureWebVitals(): void {\n" +
          "  // LCP 측정\n" +
          "  const lcpObserver = new PerformanceObserver((list) => {\n" +
          "    const entries = list.getEntries();\n" +
          "    const lastEntry = entries[entries.length - 1];\n" +
          "    console.log('LCP: ' + lastEntry.startTime.toFixed(0) + 'ms');\n" +
          "    if (lastEntry.startTime > 2500) {\n" +
          "      console.warn('LCP가 2.5초를 초과합니다. 최적화가 필요합니다.');\n" +
          "    }\n" +
          "  });\n" +
          "  lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });\n" +
          "\n" +
          "  // CLS 측정\n" +
          "  let clsValue = 0;\n" +
          "  const clsObserver = new PerformanceObserver((list) => {\n" +
          "    for (const entry of list.getEntries()) {\n" +
          "      if (!(entry as any).hadRecentInput) {\n" +
          "        clsValue += (entry as any).value;\n" +
          "      }\n" +
          "    }\n" +
          "    console.log('CLS: ' + clsValue.toFixed(3));\n" +
          "  });\n" +
          "  clsObserver.observe({ type: 'layout-shift', buffered: true });\n" +
          "}\n" +
          "\n" +
          "// 4. 동적 임포트를 활용한 코드 분할\n" +
          "// const HeavyChart = React.lazy(() => import('./HeavyChart'));\n" +
          "// <Suspense fallback={<Spinner />}>\n" +
          "//   <HeavyChart data={chartData} />\n" +
          "// </Suspense>",
        description: "리소스 힌트, 이미지 최적화, Core Web Vitals 측정, 코드 분할을 조합하여 종합적인 네트워크 최적화를 달성한다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 최적화 영역 | 기법 | 효과 |\n" +
        "|-------------|------|------|\n" +
        "| 요청 수 | 번들링, 코드 분할, 스프라이트 | 연결 비용 감소 |\n" +
        "| 전송 크기 | Brotli/Gzip, 미니파이, Tree Shaking | 다운로드 시간 단축 |\n" +
        "| 이미지 | WebP/AVIF, lazy loading, 적절한 크기 | 대역폭 절약 |\n" +
        "| 지연 시간 | CDN, preconnect, prefetch | TTFB 감소 |\n" +
        "| 렌더링 | Critical CSS, font-display | 체감 속도 향상 |\n\n" +
        "**핵심 원칙:**\n" +
        "- 측정 먼저(Lighthouse, WebPageTest), 최적화는 그 다음\n" +
        "- Core Web Vitals(LCP, INP, CLS)를 기준으로 우선순위 결정\n" +
        "- HTTP/2 환경에서는 번들링보다 코드 분할이 더 효과적일 수 있음\n" +
        "- 이미지가 전체 전송 크기의 대부분을 차지하므로 이미지 최적화 효과가 가장 큼\n\n" +
        "**다음 챕터 미리보기:** XSS와 CSRF를 배우면서, 성능 최적화가 보안과 어떻게 균형을 이루는지 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "네트워크 최적화는 요청 수 줄이기, 전송 크기 줄이기, 지연 시간 줄이기 세 축으로 접근하며, Core Web Vitals로 효과를 측정한다.",
  checklist: [
    "Gzip과 Brotli 압축의 차이와 적용 방법을 알고 있다",
    "preconnect, prefetch, preload 리소스 힌트의 용도를 구분할 수 있다",
    "이미지 최적화 기법(WebP/AVIF, lazy loading, 크기 지정)을 적용할 수 있다",
    "Core Web Vitals(LCP, INP, CLS)의 의미와 기준값을 알고 있다",
    "코드 분할(Code Splitting)과 Tree Shaking의 원리를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Brotli(br)와 Gzip(gz) 중 일반적으로 압축률이 더 높은 것은?",
      choices: [
        "Gzip이 항상 더 높다",
        "Brotli가 일반적으로 더 높다",
        "둘은 항상 동일하다",
        "파일 크기에 따라 Gzip이 항상 유리하다",
      ],
      correctIndex: 1,
      explanation: "Brotli는 Google이 개발한 압축 알고리즘으로, 텍스트 기반 리소스에서 Gzip보다 약 15-20% 더 높은 압축률을 보입니다. HTTPS 환경에서 대부분의 모던 브라우저가 지원합니다.",
    },
    {
      id: "q2",
      question: "<link rel=\"preload\">와 <link rel=\"prefetch\">의 차이는?",
      choices: [
        "preload는 CSS 전용, prefetch는 JS 전용이다",
        "preload는 현재 페이지에 반드시 필요한 리소스, prefetch는 다음 페이지에 필요할 수 있는 리소스이다",
        "preload는 캐시에 저장하고, prefetch는 캐시에 저장하지 않는다",
        "둘은 완전히 동일한 기능이다",
      ],
      correctIndex: 1,
      explanation: "preload는 현재 페이지에 반드시 필요한 리소스를 높은 우선순위로 즉시 로드합니다. prefetch는 다음 네비게이션에 필요할 수 있는 리소스를 낮은 우선순위로 미리 가져옵니다.",
    },
    {
      id: "q3",
      question: "CLS(Cumulative Layout Shift)를 줄이는 가장 효과적인 방법은?",
      choices: [
        "JavaScript 파일을 압축한다",
        "이미지와 광고에 width/height를 미리 지정한다",
        "CDN을 사용한다",
        "HTTP/2를 도입한다",
      ],
      correctIndex: 1,
      explanation: "CLS는 페이지 로드 중 요소의 위치가 예기치 않게 변하는 것을 측정합니다. 이미지, 광고, iframe 등에 크기를 미리 지정하면 브라우저가 공간을 확보하여 레이아웃 변동을 방지합니다.",
    },
    {
      id: "q4",
      question: "Tree Shaking이 동작하려면 어떤 모듈 시스템을 사용해야 하는가?",
      choices: [
        "CommonJS (require/module.exports)",
        "ES Modules (import/export)",
        "AMD (define/require)",
        "UMD (Universal Module Definition)",
      ],
      correctIndex: 1,
      explanation: "Tree Shaking은 정적 분석이 가능한 ES Modules의 import/export 구문을 기반으로 동작합니다. CommonJS의 require()는 동적이어서 빌드 시 사용 여부를 판단하기 어렵습니다.",
    },
    {
      id: "q5",
      question: "LCP(Largest Contentful Paint)의 권장 기준값은?",
      choices: [
        "1초 이내",
        "2.5초 이내",
        "5초 이내",
        "10초 이내",
      ],
      correctIndex: 1,
      explanation: "Google은 LCP를 2.5초 이내로 권장합니다. LCP는 뷰포트에서 가장 큰 콘텐츠(이미지, 텍스트 블록 등)가 렌더링 완료되는 시점을 측정하며, 사용자가 느끼는 로딩 속도의 핵심 지표입니다.",
    },
  ],
};

export default chapter;
