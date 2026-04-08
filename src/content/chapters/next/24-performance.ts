import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "24-performance",
  subject: "next",
  title: "성능 최적화",
  description:
    "Core Web Vitals, 번들 분석, dynamic import 코드 스플리팅, next/script, 이미지/폰트 최적화 복습, PPR(Partial Prerendering) 미리보기를 학습합니다.",
  order: 24,
  group: "스타일링과 최적화",
  prerequisites: ["23-metadata-seo"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "웹 성능 최적화는 **레스토랑 운영 최적화**와 같습니다.\n\n" +
        "**Core Web Vitals**는 레스토랑의 **핵심 평가 지표**입니다. " +
        "LCP(Largest Contentful Paint)는 '주문 후 메인 요리가 나올 때까지 걸리는 시간'이고, " +
        "INP(Interaction to Next Paint)는 '웨이터를 불렀을 때 반응하기까지 걸리는 시간'이며, " +
        "CLS(Cumulative Layout Shift)는 '식탁 위의 접시가 갑자기 움직이는 횟수'입니다.\n\n" +
        "**번들 분석**은 주방의 **재고 점검**입니다. " +
        "냉장고(번들)에 사용하지 않는 재료(라이브러리)가 잔뜩 있으면 공간(용량)이 낭비됩니다. " +
        "@next/bundle-analyzer로 냉장고를 열어보고 불필요한 재료를 정리합니다.\n\n" +
        "**Dynamic import**는 **코스 요리 방식**입니다. " +
        "모든 요리를 한꺼번에 가져오면(전체 번들) 테이블에 놓을 공간이 부족합니다. " +
        "에피타이저, 메인, 디저트를 순서대로 가져오는 것처럼, " +
        "필요한 코드만 필요한 시점에 로드합니다.\n\n" +
        "**next/script**는 **BGM 시스템**입니다. " +
        "구글 애널리틱스 같은 서드파티 스크립트를 메인 요리(페이지 콘텐츠)보다 먼저 틀면 " +
        "손님이 기다리게 됩니다. BGM은 손님이 자리에 앉은 후(페이지 로드 후)에 틀어도 됩니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "Next.js가 많은 최적화를 자동으로 해주지만, **개발자의 선택에 따라 성능이 크게 달라집니다.**\n\n" +
        "### 1. 과도한 JavaScript 번들\n" +
        "'use client'를 남용하면 서버 컴포넌트의 장점(제로 번들)을 잃습니다. " +
        "대형 라이브러리(moment.js, lodash 전체)를 import하면 번들이 수백 KB로 커집니다.\n\n" +
        "### 2. 서드파티 스크립트 차단\n" +
        "구글 애널리틱스, 채팅 위젯, 광고 스크립트 등이 메인 콘텐츠 로딩을 차단하면 " +
        "LCP가 크게 악화됩니다. 특히 `<script>` 태그를 `<head>`에 넣으면 " +
        "모든 렌더링이 차단됩니다.\n\n" +
        "### 3. 코드 스플리팅 미적용\n" +
        "모달, 차트, 에디터 같은 무거운 컴포넌트를 초기 번들에 포함하면 " +
        "사용자가 해당 기능을 사용하지 않더라도 다운로드해야 합니다.\n\n" +
        "### 4. Core Web Vitals 무시\n" +
        "성능 지표를 측정하지 않으면 어디가 병목인지 알 수 없습니다. " +
        "Google은 Core Web Vitals를 검색 순위에 반영하므로 SEO에도 영향을 줍니다.\n\n" +
        "### 5. 이미지/폰트 미최적화\n" +
        "next/image, next/font를 사용하지 않으면 이전 챕터에서 배운 " +
        "자동 최적화(WebP 변환, FOUT 방지 등)를 놓치게 됩니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js 성능 최적화는 **측정 → 분석 → 개선**의 순환 과정입니다.\n\n" +
        "### 1. Server Components 활용 극대화\n" +
        "기본적으로 서버 컴포넌트를 사용하여 JavaScript 번들을 최소화합니다. " +
        "'use client'는 이벤트 핸들러, 상태, 브라우저 API가 필요한 최소 단위에만 적용합니다.\n\n" +
        "### 2. dynamic import로 코드 스플리팅\n" +
        "`next/dynamic`으로 무거운 컴포넌트를 필요한 시점에 로드합니다. " +
        "`ssr: false` 옵션으로 서버 렌더링을 건너뛸 수도 있습니다.\n\n" +
        "### 3. 번들 분석\n" +
        "`@next/bundle-analyzer`로 번들 구성을 시각화하여 " +
        "어떤 라이브러리가 번들을 키우는지 파악합니다.\n\n" +
        "### 4. next/script로 서드파티 최적화\n" +
        "`strategy='lazyOnload'`로 서드파티 스크립트를 페이지 로드 후에 비동기 로드합니다. " +
        "핵심 콘텐츠의 로딩을 차단하지 않습니다.\n\n" +
        "### 5. Core Web Vitals 측정\n" +
        "Lighthouse, PageSpeed Insights, 또는 `web-vitals` 라이브러리로 " +
        "LCP, INP, CLS를 지속적으로 측정하고 개선합니다.\n\n" +
        "### 6. PPR(Partial Prerendering) 미리보기\n" +
        "실험적 기능으로, 정적 셸을 즉시 보여주고 동적 부분만 스트리밍합니다. " +
        "정적 생성의 속도와 동적 렌더링의 유연성을 동시에 달성합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: dynamic import와 번들 분석",
      content:
        "next/dynamic으로 무거운 컴포넌트를 코드 스플리팅하고, " +
        "next/script로 서드파티 스크립트를 최적화하며, " +
        "@next/bundle-analyzer를 설정하는 방법을 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// === next.config.ts — 번들 분석기 설정 ===\n' +
          'import type { NextConfig } from "next";\n' +
          'import bundleAnalyzer from "@next/bundle-analyzer";\n\n' +
          'const withBundleAnalyzer = bundleAnalyzer({\n' +
          '  enabled: process.env.ANALYZE === "true",\n' +
          '});\n\n' +
          'const nextConfig: NextConfig = {};\n' +
          'export default withBundleAnalyzer(nextConfig);\n' +
          '// 실행: ANALYZE=true npm run build\n\n' +
          '// === components/HeavyChart.tsx — dynamic import ===\n' +
          'import dynamic from "next/dynamic";\n\n' +
          '// 무거운 차트 라이브러리를 필요할 때만 로드\n' +
          'const Chart = dynamic(() => import("./Chart"), {\n' +
          '  loading: () => <div className="h-64 animate-pulse bg-gray-200 rounded" />,\n' +
          '  ssr: false, // 브라우저 전용 라이브러리이므로 SSR 건너뛰기\n' +
          '});\n\n' +
          'export function Dashboard() {\n' +
          '  return (\n' +
          '    <section>\n' +
          '      <h2>매출 차트</h2>\n' +
          '      {/* Chart 컴포넌트는 이 컴포넌트가 렌더링될 때 동적 로드 */}\n' +
          '      <Chart data={[100, 200, 150, 300]} />\n' +
          '    </section>\n' +
          '  );\n' +
          '}\n\n' +
          '// === React.lazy + Suspense (대안) ===\n' +
          '"use client";\n\n' +
          'import { lazy, Suspense } from "react";\n\n' +
          'const Editor = lazy(() => import("./RichTextEditor"));\n\n' +
          'export function EditorWrapper() {\n' +
          '  return (\n' +
          '    <Suspense fallback={<div>에디터 로딩중...</div>}>\n' +
          '      <Editor />\n' +
          '    </Suspense>\n' +
          '  );\n' +
          '}\n\n' +
          '// === next/script — 서드파티 스크립트 최적화 ===\n' +
          'import Script from "next/script";\n\n' +
          'export function Analytics() {\n' +
          '  return (\n' +
          '    <Script\n' +
          '      src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"\n' +
          '      strategy="lazyOnload" // 페이지 로드 후 비동기 로드\n' +
          '    />\n' +
          '  );\n' +
          '}',
        description:
          "@next/bundle-analyzer로 번들을 시각화하고, next/dynamic으로 무거운 컴포넌트를 코드 스플리팅하며, next/script의 strategy로 서드파티 스크립트 로딩 시점을 제어합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Core Web Vitals 측정과 최적화 적용",
      content:
        "web-vitals 라이브러리로 Core Web Vitals를 측정하고, " +
        "실제 프로젝트에서 LCP, CLS를 개선하는 패턴을 실습합니다. " +
        "Server Components와 Client Components의 경계를 최적화하여 번들 크기를 줄이는 방법도 함께 다룹니다.",
      code: {
        language: "typescript",
        code:
          '// === components/WebVitals.tsx — Core Web Vitals 측정 ===\n' +
          '"use client";\n\n' +
          '// [deprecated] useReportWebVitals는 Next.js 15에서 deprecated되었습니다.\n' +
          '// 대신 web-vitals 라이브러리 직접 사용 또는 @vercel/speed-insights를 권장합니다.\n' +
          '// import { useReportWebVitals } from "next/web-vitals"; // deprecated\n\n' +
          '// web-vitals 라이브러리 직접 사용 방식 (npm install web-vitals)\n' +
          'import { useEffect } from "react";\n' +
          'import { onCLS, onINP, onLCP } from "web-vitals";\n\n' +
          'export function WebVitals() {\n' +
          '  useEffect(() => {\n' +
          '    onLCP((metric) => {\n' +
          '      // LCP — 2.5초 이하 권장\n' +
          '      if (metric.value > 2500) {\n' +
          '        console.warn("LCP가 느립니다:", metric.value, "ms");\n' +
          '      }\n' +
          '    });\n' +
          '    onINP((metric) => {\n' +
          '      // INP — 200ms 이하 권장\n' +
          '      if (metric.value > 200) {\n' +
          '        console.warn("INP가 느립니다:", metric.value, "ms");\n' +
          '      }\n' +
          '    });\n' +
          '    onCLS((metric) => {\n' +
          '      // CLS — 0.1 이하 권장\n' +
          '      if (metric.value > 0.1) {\n' +
          '        console.warn("CLS가 높습니다:", metric.value);\n' +
          '      }\n' +
          '    });\n' +
          '  }, []);\n\n' +
          '  return null;\n' +
          '}\n\n' +
          '// === app/layout.tsx — @vercel/speed-insights 사용 (Vercel 배포 시 권장) ===\n' +
          '// npm install @vercel/speed-insights\n' +
          'import { SpeedInsights } from "@vercel/speed-insights/next";\n' +
          '// 또는 자체 호스팅 시: import { WebVitals } from "@/components/WebVitals";\n\n' +
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
          '      </body>\n' +
          '    </html>\n' +
          '  );\n' +
          '}\n\n' +
          '// === 최적화된 페이지 패턴 ===\n' +
          '// 서버 컴포넌트: 데이터 페칭 + 렌더링 (JS 번들 0)\n' +
          'import dynamic from "next/dynamic";\n' +
          'import Image from "next/image";\n\n' +
          '// 클라이언트 컴포넌트는 dynamic import로 분리\n' +
          'const LikeButton = dynamic(() => import("@/components/LikeButton"));\n' +
          'const CommentSection = dynamic(() => import("@/components/CommentSection"), {\n' +
          '  loading: () => <div className="h-40 animate-pulse bg-gray-100 rounded" />,\n' +
          '});\n\n' +
          'export default async function PostPage() {\n' +
          '  const post = await fetch("https://api.example.com/posts/1").then(r => r.json());\n\n' +
          '  return (\n' +
          '    <article>\n' +
          '      {/* LCP 이미지: priority로 즉시 로드 */}\n' +
          '      <Image src={post.cover} alt="" fill priority sizes="100vw" />\n' +
          '      <h1>{post.title}</h1>\n' +
          '      <p>{post.content}</p>\n' +
          '      {/* 인터랙션이 필요한 부분만 클라이언트로 */}\n' +
          '      <LikeButton postId={post.id} />\n' +
          '      <CommentSection postId={post.id} />\n' +
          '    </article>\n' +
          '  );\n' +
          '}',
        description:
          "web-vitals 라이브러리 또는 @vercel/speed-insights로 Core Web Vitals를 측정하고, Server Components + dynamic import 패턴으로 번들을 최소화합니다. LCP 이미지에 priority를 붙이고 인터랙션 컴포넌트만 클라이언트로 분리합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 전략 | 도구/방법 |\n" +
        "|------|------|\n" +
        "| JS 번들 최소화 | Server Components 기본 사용, 'use client' 최소화 |\n" +
        "| 코드 스플리팅 | next/dynamic, React.lazy + Suspense |\n" +
        "| 번들 분석 | @next/bundle-analyzer (ANALYZE=true) |\n" +
        "| 서드파티 최적화 | next/script strategy='lazyOnload' |\n" +
        "| 이미지 최적화 | next/image (priority, lazy loading, WebP) |\n" +
        "| 폰트 최적화 | next/font (셀프 호스팅, FOUT 방지) |\n" +
        "| 성능 측정 | Core Web Vitals (LCP, INP, CLS) |\n" +
        "| PPR | 정적 셸 + 동적 스트리밍 (실험적) |\n\n" +
        "**핵심:** Next.js 성능 최적화의 핵심은 Server Components로 번들 줄이기, 이미지/폰트 자동 최적화, " +
        "dynamic import로 코드 분할, 그리고 Core Web Vitals 지표를 지속적으로 측정하는 것입니다.\n\n" +
        "**다음 챕터 미리보기:** 성능 최적화를 마쳤으니, " +
        "이제 Next.js에서 인증(Authentication)을 구현하는 방법 — NextAuth.js, 세션 관리, 소셜 로그인 등을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Next.js 성능 최적화의 핵심은 Server Components로 번들 줄이기, 이미지/폰트 자동 최적화, dynamic import로 코드 분할, 그리고 Core Web Vitals 지표를 지속적으로 측정하는 것이다.",
  checklist: [
    "Core Web Vitals(LCP, INP, CLS)의 의미와 권장 수치를 설명할 수 있다",
    "next/dynamic으로 무거운 컴포넌트를 코드 스플리팅할 수 있다",
    "@next/bundle-analyzer로 번들 구성을 분석할 수 있다",
    "next/script의 strategy 옵션으로 서드파티 스크립트를 최적화할 수 있다",
    "Server Components와 Client Components의 경계를 최적화하여 번들을 최소화할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Core Web Vitals 중 LCP(Largest Contentful Paint)의 권장 수치는?",
      choices: [
        "1초 이하",
        "2.5초 이하",
        "4초 이하",
        "5초 이하",
      ],
      correctIndex: 1,
      explanation:
        "Google은 LCP를 2.5초 이하로 유지할 것을 권장합니다. LCP는 페이지에서 가장 큰 콘텐츠 요소가 화면에 렌더링되는 시간을 측정합니다.",
    },
    {
      id: "q2",
      question: "next/dynamic의 ssr: false 옵션은 언제 사용하는가?",
      choices: [
        "서버에서 데이터를 가져올 때",
        "브라우저 전용 API(canvas, window 등)를 사용하는 컴포넌트일 때",
        "정적 생성(SSG)을 할 때",
        "서버 컴포넌트에서 사용할 때",
      ],
      correctIndex: 1,
      explanation:
        "ssr: false는 서버에서 해당 컴포넌트를 렌더링하지 않겠다는 의미입니다. canvas, window, document 등 브라우저 전용 API를 사용하는 라이브러리에 적합합니다.",
    },
    {
      id: "q3",
      question: "next/script의 strategy='lazyOnload'의 동작 방식은?",
      choices: [
        "페이지 로드를 차단하고 스크립트를 먼저 실행한다",
        "HTML 파싱과 동시에 스크립트를 다운로드한다",
        "페이지 로드가 완료된 후 브라우저 유휴 시간에 로드한다",
        "사용자가 스크롤할 때 로드한다",
      ],
      correctIndex: 2,
      explanation:
        "lazyOnload 전략은 페이지의 모든 리소스가 로드된 후 브라우저 유휴 시간에 스크립트를 로드합니다. 분석, 채팅 위젯 등 비필수 스크립트에 적합합니다.",
    },
    {
      id: "q4",
      question: "@next/bundle-analyzer를 실행하는 방법은?",
      choices: [
        "npm run analyze 명령어를 실행한다",
        "ANALYZE=true npm run build 명령어를 실행한다",
        "next.config.js에서 analyze: true를 설정한다",
        "package.json에 analyze 스크립트를 추가한다",
      ],
      correctIndex: 1,
      explanation:
        "@next/bundle-analyzer는 ANALYZE 환경변수가 'true'일 때 활성화됩니다. ANALYZE=true npm run build를 실행하면 빌드 후 번들 구성을 시각화한 HTML 파일이 열립니다.",
    },
    {
      id: "q5",
      question: "Server Components가 성능에 유리한 가장 큰 이유는?",
      choices: [
        "서버에서 렌더링이 더 빠르다",
        "컴포넌트 코드가 JavaScript 번들에 포함되지 않는다",
        "데이터베이스에 직접 접근할 수 있다",
        "캐싱이 자동으로 적용된다",
      ],
      correctIndex: 1,
      explanation:
        "Server Components의 코드는 서버에서만 실행되고 클라이언트 JavaScript 번들에 포함되지 않습니다. 이를 통해 번들 크기가 크게 줄어들어 초기 로딩 속도가 개선됩니다.",
    },
  ],
};

export default chapter;
