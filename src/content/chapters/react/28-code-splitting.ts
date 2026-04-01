import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "28-code-splitting",
  subject: "react",
  title: "코드 스플리팅",
  description: "React.lazy, dynamic import(), Suspense와 조합, 라우트 기반 스플리팅, 번들 분석 방법을 이해합니다.",
  order: 28,
  group: "성능 최적화",
  prerequisites: ["27-react-compiler"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "코드 스플리팅은 백과사전의 분권 시스템과 비슷합니다.\n\n" +
        "백과사전 전체를 한 번에 들고 다니면 무겁습니다(큰 번들). 하지만 'ㄱ권', 'ㄴ권'처럼 나누면 필요한 권만 가져올 수 있습니다.\n\n" +
        "**React.lazy**는 \"이 페이지가 필요해지면 그때 해당 권을 가져와\"라고 말하는 것입니다. **dynamic import()**는 실제로 권을 가져오는 택배 서비스이고, **Suspense**는 택배가 오는 동안 보여주는 '로딩 중' 안내문입니다.\n\n" +
        "가장 효과적인 분리 기준은 **페이지 단위(라우트 기반)**입니다. 사용자가 방문하지 않는 페이지의 코드는 아예 다운로드하지 않습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "단일 번들로 빌드하면 여러 문제가 발생합니다.\n\n" +
        "1. **초기 로딩 시간 증가** — 사용자가 첫 페이지만 보려해도 앱 전체 코드를 다운로드해야 합니다.\n" +
        "2. **불필요한 코드 다운로드** — 관리자 대시보드 코드를 일반 사용자도 받게 됩니다.\n" +
        "3. **캐시 무효화** — 코드 한 줄 변경에 전체 번들 해시가 바뀌어 사용자가 모든 코드를 다시 다운로드합니다.\n" +
        "4. **모바일 환경 부담** — 느린 네트워크와 제한된 메모리에서 큰 번들은 심각한 UX 저하를 초래합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### dynamic import()\n" +
        "ES 모듈의 동적 import는 해당 모듈을 별도 청크로 분리하고, 호출 시점에 네트워크로 다운로드합니다. 번들러(webpack, Vite)가 자동으로 코드를 분할합니다.\n\n" +
        "### React.lazy\n" +
        "`React.lazy(() => import('./Component'))`로 컴포넌트를 지연 로딩합니다. Suspense와 함께 사용하여 로딩 중 fallback을 표시합니다.\n\n" +
        "### 라우트 기반 스플리팅\n" +
        "각 페이지(라우트)를 별도 청크로 분리하는 것이 가장 자연스럽고 효과적입니다. 사용자는 페이지 전환 시에만 추가 코드를 다운로드합니다.\n\n" +
        "### 번들 분석\n" +
        "`webpack-bundle-analyzer`나 `rollup-plugin-visualizer`로 번들 크기를 시각화하여 어떤 라이브러리가 번들을 키우는지 파악합니다.\n\n" +
        "### 프리로딩/프리페칭\n" +
        "사용자가 해당 페이지를 방문하기 전에 미리 코드를 다운로드해둘 수 있습니다. 링크에 마우스를 올렸을 때 프리로딩하면 체감 속도가 향상됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 동적 import와 React.lazy",
      content:
        "React.lazy가 내부적으로 어떻게 동작하는지 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// React.lazy 내부 동작 의사코드\n' +
          '\n' +
          'function lazy<T extends ComponentType>(\n' +
          '  factory: () => Promise<{ default: T }>\n' +
          '): T {\n' +
          '  let status: "pending" | "fulfilled" | "rejected" = "pending";\n' +
          '  let result: T | Error | null = null;\n' +
          '  let thenable: Promise<{ default: T }> | null = null;\n' +
          '\n' +
          '  return function LazyComponent(props: unknown) {\n' +
          '    if (status === "fulfilled") {\n' +
          '      // 이미 로드됨 → 실제 컴포넌트 렌더링\n' +
          '      return createElement(result as T, props);\n' +
          '    }\n' +
          '\n' +
          '    if (status === "rejected") {\n' +
          '      // 로드 실패 → ErrorBoundary가 잡도록 throw\n' +
          '      throw result;\n' +
          '    }\n' +
          '\n' +
          '    // 아직 로딩 중이 아니면 시작\n' +
          '    if (thenable === null) {\n' +
          '      thenable = factory().then(\n' +
          '        (module) => {\n' +
          '          status = "fulfilled";\n' +
          '          result = module.default;\n' +
          '        },\n' +
          '        (error) => {\n' +
          '          status = "rejected";\n' +
          '          result = error;\n' +
          '        }\n' +
          '      );\n' +
          '    }\n' +
          '\n' +
          '    // Suspense가 잡도록 Promise를 throw\n' +
          '    throw thenable;\n' +
          '  } as unknown as T;\n' +
          '}\n' +
          '\n' +
          '// 번들러의 코드 분할 동작 (개념적)\n' +
          '// import("./HeavyComponent")\n' +
          '// → 빌드 시 HeavyComponent를 별도 파일(chunk)로 분리\n' +
          '// → 런타임에 <script> 태그를 동적으로 삽입하여 로드\n',
        description: "React.lazy는 Suspense의 Promise throw 메커니즘을 활용하여 컴포넌트를 지연 로딩합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 라우트 기반 코드 스플리팅",
      content:
        "실무에서 가장 흔한 라우트 기반 코드 스플리팅 패턴입니다.",
      code: {
        language: "typescript",
        code:
          'import { lazy, Suspense } from "react";\n' +
          'import { BrowserRouter, Routes, Route } from "react-router-dom";\n' +
          '\n' +
          '// ✅ 라우트별 지연 로딩\n' +
          'const Home = lazy(() => import("./pages/Home"));\n' +
          'const Dashboard = lazy(() => import("./pages/Dashboard"));\n' +
          'const Settings = lazy(() => import("./pages/Settings"));\n' +
          '\n' +
          '// 관리자 전용 — 일반 사용자는 다운로드 안 함\n' +
          'const AdminPanel = lazy(() => import("./pages/AdminPanel"));\n' +
          '\n' +
          'function App() {\n' +
          '  return (\n' +
          '    <BrowserRouter>\n' +
          '      <Suspense fallback={<PageSkeleton />}>\n' +
          '        <Routes>\n' +
          '          <Route path="/" element={<Home />} />\n' +
          '          <Route path="/dashboard" element={<Dashboard />} />\n' +
          '          <Route path="/settings" element={<Settings />} />\n' +
          '          <Route path="/admin" element={<AdminPanel />} />\n' +
          '        </Routes>\n' +
          '      </Suspense>\n' +
          '    </BrowserRouter>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ✅ 프리로딩: 링크 호버 시 미리 로드\n' +
          'function NavLink({ to, label, importFn }: {\n' +
          '  to: string;\n' +
          '  label: string;\n' +
          '  importFn: () => Promise<unknown>;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <a\n' +
          '      href={to}\n' +
          '      onMouseEnter={() => importFn()} // 호버 시 프리로드\n' +
          '    >\n' +
          '      {label}\n' +
          '    </a>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 사용 예: <NavLink to="/dashboard" label="대시보드"\n' +
          '//   importFn={() => import("./pages/Dashboard")} />\n' +
          '\n' +
          '// ✅ 컴포넌트 레벨 스플리팅 (무거운 라이브러리)\n' +
          'const HeavyChart = lazy(() => import("./components/HeavyChart"));\n' +
          '\n' +
          'function AnalyticsSection({ showChart }: { showChart: boolean }) {\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <h2>분석</h2>\n' +
          '      {showChart && (\n' +
          '        <Suspense fallback={<p>차트 로딩 중...</p>}>\n' +
          '          <HeavyChart />\n' +
          '        </Suspense>\n' +
          '      )}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'function PageSkeleton() {\n' +
          '  return <div>페이지 로딩 중...</div>;\n' +
          '}\n',
        description: "라우트 기반 스플리팅은 가장 효과적인 코드 분할 전략입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 전략 | 설명 | 사용 시점 |\n" +
        "|------|------|----------|\n" +
        "| 라우트 기반 | 페이지별 분할 | 항상 (기본 전략) |\n" +
        "| 컴포넌트 기반 | 무거운 컴포넌트 분할 | 큰 라이브러리 사용 시 |\n" +
        "| 프리로딩 | 미리 다운로드 | 사용자 행동 예측 가능 시 |\n" +
        "| 번들 분석 | 크기 시각화 | 최적화 전 필수 |\n\n" +
        "**핵심:** 코드 스플리팅은 '필요한 코드만 필요한 시점에 로드'하는 전략입니다. React.lazy + Suspense 조합으로 간단하게 구현할 수 있으며, 라우트 단위가 가장 자연스러운 분할 기준입니다.\n\n" +
        "**다음 챕터 미리보기:** 대량의 리스트를 효율적으로 렌더링하는 가상화(Virtualization) 기법을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "코드 스플리팅은 번들을 작은 청크로 나눠 초기 로딩 속도를 높인다. React.lazy + Suspense로 라우트 단위 분할이 가장 효과적이다.",
  checklist: [
    "dynamic import()가 번들 분할을 트리거하는 원리를 이해한다",
    "React.lazy와 Suspense의 조합 패턴을 설명할 수 있다",
    "라우트 기반 스플리팅의 장점을 알고 있다",
    "프리로딩/프리페칭의 구현 방법을 이해한다",
    "번들 분석 도구를 활용할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "React.lazy가 반드시 함께 사용해야 하는 컴포넌트는?",
      choices: [
        "ErrorBoundary",
        "Suspense",
        "React.memo",
        "StrictMode",
      ],
      correctIndex: 1,
      explanation: "React.lazy로 로드되는 컴포넌트가 로딩 중일 때 Suspense의 fallback이 표시됩니다. Suspense 없이 사용하면 에러가 발생합니다.",
    },
    {
      id: "q2",
      question: "코드 스플리팅의 가장 자연스러운 분할 단위는?",
      choices: [
        "컴포넌트 단위",
        "라우트(페이지) 단위",
        "함수 단위",
        "모듈 단위",
      ],
      correctIndex: 1,
      explanation: "라우트 단위는 사용자가 방문하지 않는 페이지의 코드를 아예 로드하지 않으므로 가장 효과적인 분할 기준입니다.",
    },
    {
      id: "q3",
      question: "dynamic import()는 어떤 시점에 모듈을 로드하는가?",
      choices: [
        "앱 시작 시 모든 모듈을 동시에",
        "import() 함수가 호출되는 시점에",
        "빌드 시점에",
        "서버에서 미리",
      ],
      correctIndex: 1,
      explanation: "dynamic import()는 호출 시점에 네트워크 요청을 보내 해당 모듈을 다운로드합니다. 이것이 '지연 로딩'의 핵심입니다.",
    },
    {
      id: "q4",
      question: "프리로딩(preloading)의 목적은?",
      choices: [
        "번들 크기를 줄이기 위해",
        "사용자가 필요로 하기 전에 미리 코드를 다운로드하기 위해",
        "서버에서 렌더링하기 위해",
        "캐시를 무효화하기 위해",
      ],
      correctIndex: 1,
      explanation: "프리로딩은 사용자가 링크를 클릭하기 전(예: 호버 시)에 미리 코드를 다운로드하여 실제 이동 시 대기 시간을 줄입니다.",
    },
    {
      id: "q5",
      question: "React.lazy에 전달하는 함수가 반환해야 하는 것은?",
      choices: [
        "React 컴포넌트",
        "default export가 있는 모듈을 resolve하는 Promise",
        "JSX 엘리먼트",
        "문자열",
      ],
      correctIndex: 1,
      explanation: "React.lazy는 () => import('./Component') 형태로 default export가 포함된 모듈을 반환하는 Promise를 기대합니다.",
    },
  ],
};

export default chapter;
