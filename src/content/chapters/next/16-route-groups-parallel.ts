import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "16-route-groups-parallel",
  subject: "next",
  title: "Route Groups와 Parallel Routes",
  description:
    "Route Groups (group)으로 URL 없이 라우트 그룹화, 다른 레이아웃 적용, Parallel Routes @slot으로 동시 렌더링, default.tsx, 조건부 라우트를 학습합니다.",
  order: 16,
  group: "라우팅 심화",
  prerequisites: ["15-dynamic-routes"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Route Groups와 Parallel Routes는 **사무실 건물**에 비유할 수 있습니다.\n\n" +
        "**Route Groups (group)**은 같은 층에 있는 부서를 논리적으로 나누는 것입니다. '마케팅팀'과 '개발팀'이라는 이름표가 문에 붙어있지만, 건물 주소(URL)는 변하지 않습니다. 방문자는 '3층 마케팅팀'이라고 말하지 않고 그냥 '3층'이라고 합니다. 하지만 내부적으로 마케팅팀은 오픈 플랜(다른 레이아웃), 개발팀은 개인 부스(다른 레이아웃)를 사용할 수 있습니다.\n\n" +
        "**Parallel Routes (@slot)**는 사무실 벽에 설치된 여러 개의 모니터입니다. 하나의 회의실(레이아웃)에 여러 모니터가 있고, 각 모니터가 서로 다른 화면(페이지)을 동시에 보여줍니다. 주식 대시보드 모니터, 뉴스 모니터, 채팅 모니터가 각각 독립적으로 업데이트됩니다.\n\n" +
        "**default.tsx**는 모니터가 아직 채널을 선택하지 않았을 때 보여주는 기본 화면입니다. '신호 없음' 대신 유용한 기본 콘텐츠를 표시합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "복잡한 애플리케이션에서는 라우트 구조와 UI 구조가 반드시 일치하지 않습니다.\n\n" +
        "1. **레이아웃 분리의 어려움** — 같은 URL 깊이에서 마케팅 페이지와 앱 페이지에 서로 다른 레이아웃을 적용하고 싶지만, 폴더 구조가 URL을 결정하므로 URL에 불필요한 세그먼트가 추가됩니다.\n\n" +
        "2. **코드 정리** — 인증 관련 라우트(`/login`, `/register`)를 한 폴더에 모으고 싶지만, URL에 `/auth/login`처럼 불필요한 prefix가 붙기를 원하지 않습니다.\n\n" +
        "3. **대시보드 같은 복합 UI** — 하나의 페이지에서 여러 독립적인 콘텐츠 영역(차트, 알림, 활동 피드)을 동시에 보여줘야 합니다. 각 영역은 독립적으로 로딩되고 에러 처리되어야 합니다.\n\n" +
        "4. **조건부 페이지 표시** — 로그인 상태에 따라 같은 레이아웃 내에서 다른 콘텐츠를 보여주고 싶습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js는 Route Groups와 Parallel Routes로 유연한 라우트 구조를 제공합니다.\n\n" +
        "### 1. Route Groups — (folderName)\n" +
        "폴더 이름을 괄호로 감싸면 URL 세그먼트에 포함되지 않습니다. `app/(marketing)/about/page.tsx`의 URL은 `/about`이 됩니다. 같은 URL 깊이에서 다른 레이아웃을 적용할 수 있습니다.\n\n" +
        "### 2. 서로 다른 레이아웃 적용\n" +
        "`(marketing)` 그룹에는 마케팅 레이아웃을, `(app)` 그룹에는 앱 레이아웃을 각각 적용할 수 있습니다. `(marketing)/layout.tsx`와 `(app)/layout.tsx`가 독립적으로 동작합니다.\n\n" +
        "### 3. Parallel Routes — @slotName\n" +
        "`@` 접두사가 붙은 폴더는 같은 레이아웃의 props로 전달됩니다. `@analytics`, `@team`, `@notifications` 폴더를 만들면 레이아웃에서 동시에 렌더링할 수 있습니다.\n\n" +
        "### 4. default.tsx\n" +
        "Parallel Routes에서 현재 URL에 매칭되는 슬롯 콘텐츠가 없을 때 보여줄 기본 UI를 정의합니다. 없으면 404가 발생할 수 있습니다.\n\n" +
        "### 5. 조건부 라우트\n" +
        "인증 상태 등의 조건에 따라 레이아웃에서 어떤 슬롯을 보여줄지 결정할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Route Groups와 레이아웃 분리",
      content:
        "Route Groups으로 마케팅 페이지와 앱 페이지에 서로 다른 레이아웃을 적용하는 방법과, Parallel Routes로 대시보드의 독립적인 콘텐츠 영역을 구성하는 방법을 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// === Route Groups: 폴더 구조 ===\n' +
          '// app/\n' +
          '//   (marketing)/\n' +
          '//     layout.tsx      ← 마케팅 레이아웃 (헤더, 푸터)\n' +
          '//     page.tsx        ← / (홈)\n' +
          '//     about/page.tsx  ← /about\n' +
          '//     pricing/page.tsx ← /pricing\n' +
          '//   (app)/\n' +
          '//     layout.tsx      ← 앱 레이아웃 (사이드바)\n' +
          '//     dashboard/page.tsx ← /dashboard\n' +
          '//     settings/page.tsx  ← /settings\n\n' +
          '// app/(marketing)/layout.tsx\n' +
          'export default function MarketingLayout({\n' +
          '  children,\n' +
          '}: {\n' +
          '  children: React.ReactNode;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <header className="bg-white shadow">\n' +
          '        <nav>마케팅 네비게이션</nav>\n' +
          '      </header>\n' +
          '      <main>{children}</main>\n' +
          '      <footer>마케팅 푸터</footer>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// app/(app)/layout.tsx\n' +
          'export default function AppLayout({\n' +
          '  children,\n' +
          '}: {\n' +
          '  children: React.ReactNode;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <div className="flex">\n' +
          '      <aside className="w-64 bg-gray-900 text-white">\n' +
          '        <Sidebar />\n' +
          '      </aside>\n' +
          '      <main className="flex-1 p-6">{children}</main>\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "Route Groups은 URL에 영향 없이 폴더를 논리적으로 분리하고, 각 그룹에 독립적인 레이아웃을 적용합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Parallel Routes와 조건부 렌더링",
      content:
        "대시보드에서 Parallel Routes를 사용하여 여러 콘텐츠 영역을 동시에 렌더링합니다. 인증 상태에 따라 다른 슬롯을 보여주는 조건부 라우트도 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// === Parallel Routes 폴더 구조 ===\n' +
          '// app/dashboard/\n' +
          '//   layout.tsx\n' +
          '//   page.tsx\n' +
          '//   @analytics/\n' +
          '//     page.tsx\n' +
          '//     default.tsx\n' +
          '//   @notifications/\n' +
          '//     page.tsx\n' +
          '//     default.tsx\n\n' +
          '// app/dashboard/layout.tsx\n' +
          '// 슬롯이 레이아웃의 props로 전달됨\n' +
          'export default function DashboardLayout({\n' +
          '  children,\n' +
          '  analytics,\n' +
          '  notifications,\n' +
          '}: {\n' +
          '  children: React.ReactNode;\n' +
          '  analytics: React.ReactNode;\n' +
          '  notifications: React.ReactNode;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <div className="grid grid-cols-2 gap-4">\n' +
          '        {/* children은 page.tsx */}\n' +
          '        <div className="col-span-2">{children}</div>\n' +
          '        {/* @analytics 슬롯 */}\n' +
          '        <div>{analytics}</div>\n' +
          '        {/* @notifications 슬롯 */}\n' +
          '        <div>{notifications}</div>\n' +
          '      </div>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// app/dashboard/@analytics/page.tsx\n' +
          'export default async function AnalyticsSlot() {\n' +
          '  const data = await fetchAnalytics();\n' +
          '  return (\n' +
          '    <div className="rounded-lg border p-4">\n' +
          '      <h2 className="font-semibold">분석</h2>\n' +
          '      <AnalyticsChart data={data} />\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// app/dashboard/@analytics/default.tsx\n' +
          '// 매칭되는 콘텐츠가 없을 때의 기본 UI\n' +
          'export default function AnalyticsDefault() {\n' +
          '  return <div>분석 데이터를 불러오는 중...</div>;\n' +
          '}\n\n' +
          '// === 조건부 라우트: 인증 상태에 따른 분기 ===\n' +
          '// app/@auth/login/page.tsx (로그인 폼)\n' +
          '// app/@dashboard/page.tsx (대시보드)\n\n' +
          'import { getUser } from "@/lib/auth";\n\n' +
          'export default async function Layout({\n' +
          '  auth,\n' +
          '  dashboard,\n' +
          '}: {\n' +
          '  auth: React.ReactNode;\n' +
          '  dashboard: React.ReactNode;\n' +
          '}) {\n' +
          '  const user = await getUser();\n' +
          '  return user ? dashboard : auth;\n' +
          '}',
        description:
          "@슬롯 폴더의 내용이 레이아웃 props로 전달되어 동시에 렌더링되고, 조건에 따라 다른 슬롯을 선택적으로 표시할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 문법 | 설명 |\n" +
        "|------|------|------|\n" +
        "| Route Groups | (folderName) | URL 없이 라우트를 논리적으로 그룹화 |\n" +
        "| 그룹별 레이아웃 | (group)/layout.tsx | 같은 URL 깊이에서 다른 레이아웃 적용 |\n" +
        "| Parallel Routes | @slotName | 같은 레이아웃에서 여러 페이지 동시 렌더링 |\n" +
        "| default.tsx | @slot/default.tsx | 슬롯 매칭 실패 시 기본 UI |\n" +
        "| 조건부 라우트 | layout에서 분기 | 상태에 따라 다른 슬롯 표시 |\n\n" +
        "**핵심:** (group)은 URL 없이 라우트를 논리적으로 묶고, @slot은 같은 레이아웃 안에서 여러 페이지를 동시에 보여주는 Parallel Routes를 만든다.\n\n" +
        "**다음 챕터 미리보기:** Intercepting Routes를 활용하여 네비게이션 시 다른 라우트의 콘텐츠를 현재 레이아웃 안에서 가로채어 모달 패턴을 구현하는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "(group)은 URL 없이 라우트를 논리적으로 묶고, @slot은 같은 레이아웃 안에서 여러 페이지를 동시에 보여주는 Parallel Routes를 만든다.",
  checklist: [
    "Route Groups의 괄호 문법이 URL에 영향을 주지 않음을 이해한다",
    "Route Groups으로 같은 URL 깊이에서 다른 레이아웃을 적용할 수 있다",
    "Parallel Routes의 @slot이 레이아웃 props로 전달되는 원리를 이해한다",
    "default.tsx의 역할과 필요한 이유를 설명할 수 있다",
    "조건부 라우트로 인증 상태에 따른 UI 분기를 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "app/(marketing)/about/page.tsx의 URL 경로는?",
      choices: [
        "/marketing/about",
        "/about",
        "/(marketing)/about",
        "/group/marketing/about",
      ],
      correctIndex: 1,
      explanation:
        "괄호로 감싼 폴더(Route Group)는 URL 세그먼트에 포함되지 않습니다. (marketing)은 코드 정리용이며, 실제 URL은 /about이 됩니다.",
    },
    {
      id: "q2",
      question: "Parallel Routes에서 @analytics 폴더의 콘텐츠는 어디에서 접근하는가?",
      choices: [
        "page.tsx의 props",
        "layout.tsx의 analytics prop",
        "middleware에서 접근",
        "loading.tsx에서 접근",
      ],
      correctIndex: 1,
      explanation:
        "@로 시작하는 슬롯 폴더의 콘텐츠는 같은 레벨의 layout.tsx에 prop으로 전달됩니다. @analytics의 내용은 layout의 analytics prop으로 받습니다.",
    },
    {
      id: "q3",
      question: "Parallel Routes에서 default.tsx가 없으면 어떤 일이 발생할 수 있는가?",
      choices: [
        "슬롯이 비어있게 표시된다",
        "매칭되지 않는 URL 탐색 시 404가 발생할 수 있다",
        "레이아웃이 렌더링되지 않는다",
        "빌드 에러가 발생한다",
      ],
      correctIndex: 1,
      explanation:
        "Parallel Routes에서 현재 URL에 매칭되는 슬롯 콘텐츠가 없고 default.tsx도 없으면 Next.js는 404를 반환할 수 있습니다. default.tsx로 기본 UI를 제공해야 합니다.",
    },
    {
      id: "q4",
      question: "Route Groups의 주된 용도가 아닌 것은?",
      choices: [
        "라우트를 논리적으로 정리한다",
        "같은 URL 깊이에서 다른 레이아웃을 적용한다",
        "URL에 새로운 세그먼트를 추가한다",
        "인증/비인증 라우트를 분리한다",
      ],
      correctIndex: 2,
      explanation:
        "Route Groups의 핵심은 URL에 영향을 주지 않는 것입니다. 괄호 안의 폴더명은 URL 세그먼트에 포함되지 않으며, 코드 정리와 레이아웃 분리 목적으로 사용됩니다.",
    },
    {
      id: "q5",
      question: "조건부 라우트에서 인증 상태에 따라 다른 콘텐츠를 보여주려면?",
      choices: [
        "middleware에서 리다이렉트한다",
        "layout에서 Parallel Routes 슬롯을 조건부로 렌더링한다",
        "page.tsx에서 동적으로 import한다",
        "Route Group을 동적으로 전환한다",
      ],
      correctIndex: 1,
      explanation:
        "Parallel Routes의 슬롯들은 layout의 props로 전달되므로, layout에서 인증 상태를 확인하고 조건에 따라 적절한 슬롯을 렌더링할 수 있습니다.",
    },
  ],
};

export default chapter;
