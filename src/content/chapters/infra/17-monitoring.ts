import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "17-monitoring",
  subject: "infra",
  title: "모니터링과 에러 트래킹",
  description:
    "프론트엔드 모니터링의 3축 — 에러 트래킹, 성능 모니터링, 사용자 분석과 Sentry, Core Web Vitals, 구조화된 로깅을 학습합니다.",
  order: 17,
  group: "모니터링과 운영",
  prerequisites: ["16-cdn-edge"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "프론트엔드 모니터링은 **병원의 환자 모니터링 시스템**과 같습니다.\n\n" +
        "**에러 트래킹(Sentry)**은 심전도 모니터입니다. 환자(서비스)에 이상이 생기면 즉시 알림이 울립니다. 단순히 \"문제 발생\"이 아니라, 어떤 상황에서 어떤 증상이 나타났는지 상세한 기록을 남깁니다.\n\n" +
        "**성능 모니터링(Core Web Vitals)**은 혈압/체온 측정입니다. 수치가 정상 범위를 벗어나면 위험 신호입니다. LCP(화면 로딩 속도), INP(반응 속도), CLS(화면 안정성) — 이 세 가지가 웹 서비스의 활력 징후입니다.\n\n" +
        "**사용자 분석(RUM)**은 환자의 일상 기록입니다. 병원에서 잠깐 측정하는 것(Synthetic Monitoring)과 달리, 실제 생활에서 24시간 데이터를 수집합니다. 실제 사용자의 네트워크 환경, 기기 성능, 사용 패턴을 포함합니다.\n\n" +
        "**소스맵**은 의료 차트의 번역입니다. 프로덕션 코드는 압축되어(minified) 알아볼 수 없지만, 소스맵이 있으면 원래 코드의 정확한 위치를 알려줍니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프로덕션 환경에서 발생하는 문제를 파악하고 해결하는 것이 왜 어려운지 살펴봅니다.\n\n" +
        "1. **보이지 않는 에러** — 사용자가 에러를 겪어도 대부분 신고하지 않습니다. 조용히 떠나갈 뿐입니다. 콘솔에 빨간 에러가 찍히지만, 개발자는 그것을 볼 수 없습니다.\n\n" +
        "2. **재현 불가** — \"사파리에서 결제 버튼이 안 눌린다\"는 제보를 받아도, 어떤 사파리 버전, 어떤 기기, 어떤 상태에서 발생하는지 알 수 없으면 재현할 수 없습니다.\n\n" +
        "3. **성능 인식 차이** — 개발자의 최신 맥북에서는 빠른데, 사용자의 5년 된 안드로이드폰에서는 느립니다. 실제 사용자 환경의 성능 데이터가 없으면 최적화 우선순위를 정할 수 없습니다.\n\n" +
        "4. **프로덕션 디버깅** — 프로덕션 코드는 minify + 번들링되어 있습니다. 에러 스택 트레이스에 `a.js:1:12345`라고 나오면 어디서 문제가 생겼는지 알 수 없습니다.\n\n" +
        "5. **로그의 부재** — 에러가 발생한 전후 맥락이 없으면 원인을 파악할 수 없습니다. \"로그인 API 호출 실패\"만으로는 네트워크 문제인지, 토큰 만료인지, 서버 오류인지 구분할 수 없습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "프론트엔드 모니터링의 3가지 축을 체계적으로 구축합니다.\n\n" +
        "### 1. 에러 트래킹 — Sentry\n" +
        "Sentry는 프론트엔드 에러 트래킹의 사실상 표준입니다. 핵심 기능:\n" +
        "- **자동 에러 캡처:** 처리되지 않은 예외, Promise rejection을 자동 수집\n" +
        "- **소스맵 연동:** 빌드 시 소스맵을 Sentry에 업로드하면, 에러 스택 트레이스를 원본 코드로 변환\n" +
        "- **Breadcrumbs:** 에러 발생 전 사용자의 클릭, 네비게이션, API 호출 기록\n" +
        "- **Release 추적:** 어떤 배포 버전에서 에러가 발생했는지 추적\n\n" +
        "### 2. 성능 모니터링 — Core Web Vitals\n" +
        "Google이 정의한 사용자 경험의 핵심 지표:\n" +
        "- **LCP(Largest Contentful Paint):** 2.5초 이내 — 메인 콘텐츠 로딩 속도\n" +
        "- **INP(Interaction to Next Paint):** 200ms 이내 — 사용자 상호작용 반응 속도\n" +
        "- **CLS(Cumulative Layout Shift):** 0.1 이하 — 레이아웃 안정성\n" +
        "이 지표들은 SEO 순위에도 영향을 미칩니다.\n\n" +
        "### 3. 로깅 전략\n" +
        "**구조화된 로깅(Structured Logging)**이 핵심입니다. 단순 문자열 대신 JSON 형태로 로그를 남기면, 나중에 검색과 필터링이 가능합니다. 컨텍스트 정보(사용자 ID, 페이지, 환경)를 항상 포함하세요.\n\n" +
        "### RUM vs Synthetic Monitoring\n" +
        "- **RUM(Real User Monitoring):** 실제 사용자 데이터. 다양한 기기/네트워크 상황을 반영\n" +
        "- **Synthetic Monitoring:** 봇이 주기적으로 테스트. 기준선 확보와 SLA 확인에 유용\n" +
        "- 둘 다 사용하는 것이 이상적입니다",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 모니터링 시스템 설계",
      content:
        "프론트엔드 모니터링 시스템의 전체 구조를 의사코드로 설계합니다.",
      code: {
        language: "typescript",
        code:
          '// 프론트엔드 모니터링 시스템 설계\n' +
          '\n' +
          '// === 1. Sentry 초기화 ===\n' +
          'Sentry.init({\n' +
          '  dsn: "https://key@sentry.io/project",\n' +
          '  environment: "production",\n' +
          '  release: "my-app@1.2.3",     // 배포 버전 추적\n' +
          '  tracesSampleRate: 0.1,        // 성능 트레이싱 10% 샘플링\n' +
          '  replaysSessionSampleRate: 0.01, // 세션 리플레이 1%\n' +
          '  integrations: [\n' +
          '    Sentry.browserTracingIntegration(),  // 페이지 로드 추적\n' +
          '    Sentry.replayIntegration(),           // 세션 리플레이\n' +
          '  ],\n' +
          '});\n' +
          '\n' +
          '// === 2. 구조화된 로깅 ===\n' +
          'interface LogEntry {\n' +
          '  level: "info" | "warn" | "error";\n' +
          '  message: string;\n' +
          '  context: {\n' +
          '    userId?: string;\n' +
          '    page: string;\n' +
          '    action: string;\n' +
          '    metadata?: Record<string, unknown>;\n' +
          '  };\n' +
          '  timestamp: string;\n' +
          '}\n' +
          '\n' +
          'function log(entry: LogEntry) {\n' +
          '  // 콘솔에도 출력 (개발 환경)\n' +
          '  console[entry.level](entry);\n' +
          '  // 로깅 서비스로 전송 (프로덕션)\n' +
          '  if (isProduction) sendToLoggingService(entry);\n' +
          '}\n' +
          '\n' +
          '// === 3. Core Web Vitals 수집 ===\n' +
          '// web-vitals 라이브러리 사용\n' +
          'onLCP((metric) => reportVital("LCP", metric));\n' +
          'onINP((metric) => reportVital("INP", metric));\n' +
          'onCLS((metric) => reportVital("CLS", metric));\n' +
          '\n' +
          'function reportVital(name: string, metric: Metric) {\n' +
          '  analytics.send({\n' +
          '    name,\n' +
          '    value: metric.value,\n' +
          '    rating: metric.rating,  // "good" | "needs-improvement" | "poor"\n' +
          '    page: location.pathname,\n' +
          '  });\n' +
          '}',
        description:
          "Sentry로 에러를 추적하고, 구조화된 로깅으로 맥락을 기록하며, web-vitals로 성능을 측정합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Sentry와 소스맵 연동",
      content:
        "React 앱에 Sentry를 연동하고, 빌드 시 소스맵을 업로드하는 실전 설정입니다.",
      code: {
        language: "typescript",
        code:
          '// === sentry.client.config.ts ===\n' +
          'import * as Sentry from "@sentry/react";\n' +
          '\n' +
          'Sentry.init({\n' +
          '  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,\n' +
          '  environment: process.env.NODE_ENV,\n' +
          '  // 에러 발생 시 사용자 행동 기록\n' +
          '  integrations: [\n' +
          '    Sentry.browserTracingIntegration(),\n' +
          '    Sentry.replayIntegration({\n' +
          '      maskAllText: true,    // 개인정보 마스킹\n' +
          '      blockAllMedia: true,\n' +
          '    }),\n' +
          '  ],\n' +
          '});\n' +
          '\n' +
          '// === ErrorBoundary 활용 ===\n' +
          'function App() {\n' +
          '  return (\n' +
          '    <Sentry.ErrorBoundary\n' +
          '      fallback={<ErrorPage />}\n' +
          '      showDialog  // 사용자에게 피드백 폼 표시\n' +
          '    >\n' +
          '      <MainApp />\n' +
          '    </Sentry.ErrorBoundary>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === 수동 에러 캡처 ===\n' +
          'async function fetchUser(id: string) {\n' +
          '  try {\n' +
          '    const response = await fetch(`/api/users/${id}`);\n' +
          '    if (!response.ok) {\n' +
          '      throw new Error(`API Error: ${response.status}`);\n' +
          '    }\n' +
          '    return response.json();\n' +
          '  } catch (error) {\n' +
          '    Sentry.captureException(error, {\n' +
          '      tags: { feature: "user-profile" },\n' +
          '      extra: { userId: id },\n' +
          '    });\n' +
          '    throw error;\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// === CI에서 소스맵 업로드 (GitHub Actions) ===\n' +
          '// - run: npx @sentry/cli sourcemaps upload ./dist\n' +
          '//   env:\n' +
          '//     SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}\n' +
          '//     SENTRY_ORG: my-org\n' +
          '//     SENTRY_PROJECT: my-app',
        description:
          "Sentry SDK를 초기화하고, ErrorBoundary로 UI 에러를 처리하며, CI에서 소스맵을 자동 업로드합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "프론트엔드 모니터링의 3축 요약입니다.\n\n" +
        "| 축 | 도구/지표 | 목적 |\n" +
        "|-----|----------|------|\n" +
        "| 에러 트래킹 | Sentry | 프로덕션 에러 감지 + 디버깅 |\n" +
        "| 성능 모니터링 | Core Web Vitals | LCP, INP, CLS 측정 |\n" +
        "| 사용자 분석 | RUM | 실제 사용자 환경 데이터 수집 |\n\n" +
        "**Sentry 핵심 설정:**\n" +
        "- 소스맵 업로드 — 프로덕션 에러를 원본 코드로 디버깅\n" +
        "- Release 태깅 — 어떤 배포에서 에러가 발생했는지 추적\n" +
        "- Breadcrumbs — 에러 전 사용자 행동 기록\n" +
        "- Session Replay — 에러 발생 순간을 영상처럼 재현\n\n" +
        "**구조화된 로깅 원칙:**\n" +
        "- 문자열 대신 JSON 객체로 로그 남기기\n" +
        "- 항상 컨텍스트 포함 (userId, page, action)\n" +
        "- 로그 레벨 구분 (info, warn, error)\n\n" +
        "**알림 설정은 필수입니다.** 모니터링 데이터를 수집만 하고 아무도 보지 않으면 의미가 없습니다. 새로운 에러 발생 시 Slack 알림, Core Web Vitals 악화 시 이메일 알림을 설정하세요.\n\n" +
        "**다음 챕터 미리보기:** 모니터링을 넘어 서비스 안정성을 체계적으로 관리하는 DevOps 문화와 SRE 기초를 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Sentry로 프로덕션 에러를 추적하고, Core Web Vitals로 성능을 모니터링하며, 구조화된 로깅으로 디버깅 가능한 로그를 남긴다. 소스맵 연동은 프로덕션 에러 디버깅의 필수 조건이다.",
  checklist: [
    "Sentry를 프로젝트에 연동하고 소스맵을 업로드할 수 있다",
    "Core Web Vitals(LCP, INP, CLS)의 의미와 기준값을 설명할 수 있다",
    "구조화된 로깅의 장점과 구현 방법을 이해한다",
    "RUM과 Synthetic Monitoring의 차이를 설명할 수 있다",
    "에러 발생 시 알림이 오도록 모니터링 파이프라인을 구성할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "Sentry에 소스맵을 업로드하는 주된 이유는?",
      choices: [
        "에러 발생 빈도를 줄이기 위해",
        "minified된 프로덕션 코드의 에러를 원본 코드 위치로 매핑하기 위해",
        "번들 크기를 줄이기 위해",
        "캐시 성능을 향상시키기 위해",
      ],
      correctIndex: 1,
      explanation:
        "프로덕션 코드는 minify되어 에러 스택 트레이스를 읽기 어렵습니다. 소스맵을 업로드하면 Sentry가 에러 위치를 원본 소스코드의 파일명과 줄 번호로 변환해줍니다.",
    },
    {
      id: "q2",
      question:
        "Core Web Vitals에서 LCP(Largest Contentful Paint)의 권장 기준은?",
      choices: [
        "100ms 이내",
        "1초 이내",
        "2.5초 이내",
        "5초 이내",
      ],
      correctIndex: 2,
      explanation:
        "LCP는 페이지의 가장 큰 콘텐츠 요소가 렌더링되는 시간을 측정합니다. Google은 2.5초 이내를 'Good'으로 분류하며, 이를 초과하면 사용자 경험이 저하됩니다.",
    },
    {
      id: "q3",
      question:
        "RUM(Real User Monitoring)과 Synthetic Monitoring의 차이점은?",
      choices: [
        "RUM은 무료, Synthetic은 유료이다",
        "RUM은 실제 사용자 데이터를 수집하고, Synthetic은 봇이 시뮬레이션한다",
        "RUM은 서버 모니터링이고, Synthetic은 클라이언트 모니터링이다",
        "차이가 없다",
      ],
      correctIndex: 1,
      explanation:
        "RUM은 실제 사용자의 브라우저에서 성능 데이터를 수집하여 다양한 환경을 반영합니다. Synthetic Monitoring은 봇이 일정한 환경에서 주기적으로 테스트하여 기준선을 확보합니다.",
    },
    {
      id: "q4",
      question:
        "구조화된 로깅(Structured Logging)의 핵심 장점은?",
      choices: [
        "로그 파일 크기가 줄어든다",
        "로그를 검색, 필터링, 집계할 수 있다",
        "에러 발생을 막을 수 있다",
        "코드 실행 속도가 빨라진다",
      ],
      correctIndex: 1,
      explanation:
        "구조화된 로깅은 로그를 JSON 형태로 남기므로, 특정 사용자, 특정 페이지, 특정 에러 타입 등으로 필터링하고 집계하여 분석할 수 있습니다.",
    },
    {
      id: "q5",
      question:
        "Sentry의 Breadcrumbs 기능이 기록하는 것은?",
      choices: [
        "서버의 CPU 사용률",
        "에러 발생 전 사용자의 클릭, 네비게이션, API 호출 등의 행동 기록",
        "전체 세션의 스크린샷",
        "데이터베이스 쿼리 로그",
      ],
      correctIndex: 1,
      explanation:
        "Breadcrumbs는 에러가 발생하기 전까지의 사용자 행동(클릭, 페이지 이동, 콘솔 출력, API 호출)을 자동으로 기록하여, 에러의 맥락을 파악할 수 있게 해줍니다.",
    },
  ],
};

export default chapter;
