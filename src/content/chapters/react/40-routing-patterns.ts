import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "40-routing-patterns",
  subject: "react",
  title: "라우팅 패턴",
  description:
    "레이아웃 라우트, 병렬 라우트, 모달 라우트, 네비게이션 가드, 라우트 기반 코드 스플리팅 조합 패턴을 학습합니다.",
  order: 40,
  group: "라우팅",
  prerequisites: ["39-react-router-advanced"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "**레이아웃 라우트**는 아파트 단지의 공용 시설입니다. 주차장, 놀이터, 로비는 모든 동이 공유하지만, 각 세대(페이지)의 내부는 다릅니다.\n\n" +
        "**병렬 라우트**는 TV의 화면 분할(PIP)입니다. 하나의 화면에 메인 채널과 서브 채널을 동시에 보여줍니다.\n\n" +
        "**모달 라우트**는 극장의 팝업 매점입니다. 영화(배경 페이지)는 그대로 있고, 매점 창구(모달)만 열립니다. 직접 URL로 접근하면 전용 페이지로 보여줍니다.\n\n" +
        "**코드 스플리팅**은 맞춤형 택배 서비스입니다. 필요한 물건(코드)만 그때그때 배달받아, 처음부터 모든 물건을 가지고 있을 필요가 없습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "기본적인 라우팅 구조만으로는 복잡한 UI 요구사항을 처리하기 어렵습니다.\n\n" +
        "1. **다중 레이아웃** — 관리자 페이지와 일반 페이지의 레이아웃이 다르지만, 라우트 설정이 복잡해집니다\n" +
        "2. **모달 + URL** — 목록에서 아이템을 클릭하면 모달로 보여주되, URL도 변경되어야 합니다. 해당 URL로 직접 접근하면 전체 페이지로 보여줘야 합니다\n" +
        "3. **번들 크기** — 모든 페이지 코드를 한 번에 로드하면 초기 로딩이 느립니다\n" +
        "4. **이탈 방지** — 폼 작성 중 사용자가 페이지를 떠나려 할 때 확인 메시지를 보여줘야 합니다",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 레이아웃 라우트\n" +
        "pathless Route(path 없는 라우트)를 활용하여 그룹별로 다른 레이아웃을 적용합니다.\n\n" +
        "### 모달 라우트\n" +
        "location.state를 활용하여 배경 위치를 기억하고, 모달과 전체 페이지 뷰를 동일한 URL에서 조건부로 렌더링합니다.\n\n" +
        "### 라우트 기반 코드 스플리팅\n" +
        "React.lazy와 Suspense를 조합하여 각 라우트의 컴포넌트를 필요할 때만 동적으로 불러옵니다.\n\n" +
        "### 네비게이션 가드\n" +
        "useBlocker 또는 usePrompt를 사용하여 특정 조건에서 페이지 이탈을 차단하고 확인 메시지를 보여줍니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 레이아웃 라우트와 코드 스플리팅",
      content:
        "다중 레이아웃과 라우트 기반 코드 스플리팅을 조합하는 패턴입니다.",
      code: {
        language: "typescript",
        code:
          'import { lazy, Suspense } from "react";\n' +
          'import {\n' +
          '  createBrowserRouter,\n' +
          '  RouterProvider,\n' +
          '  Outlet,\n' +
          '} from "react-router-dom";\n' +
          '\n' +
          '// ✅ 라우트 기반 코드 스플리팅: 필요할 때만 로드\n' +
          'const Dashboard = lazy(() => import("./pages/Dashboard"));\n' +
          'const Settings = lazy(() => import("./pages/Settings"));\n' +
          'const AdminPanel = lazy(() => import("./pages/AdminPanel"));\n' +
          'const UserList = lazy(() => import("./pages/UserList"));\n' +
          '\n' +
          '// Suspense 래퍼\n' +
          'function LazyPage({ children }: { children: React.ReactNode }) {\n' +
          '  return <Suspense fallback={<div>페이지 로딩 중...</div>}>{children}</Suspense>;\n' +
          '}\n' +
          '\n' +
          '// 레이아웃 컴포넌트들\n' +
          'function MainLayout() {\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <header>메인 헤더</header>\n' +
          '      <nav>메인 내비게이션</nav>\n' +
          '      <main><Outlet /></main>\n' +
          '      <footer>메인 푸터</footer>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'function AdminLayout() {\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <aside>관리자 사이드바</aside>\n' +
          '      <main><Outlet /></main>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ✅ 다중 레이아웃 라우트 구성\n' +
          'const router = createBrowserRouter([\n' +
          '  {\n' +
          '    // 메인 레이아웃 그룹\n' +
          '    element: <MainLayout />,\n' +
          '    children: [\n' +
          '      {\n' +
          '        path: "/",\n' +
          '        element: <LazyPage><Dashboard /></LazyPage>,\n' +
          '      },\n' +
          '      {\n' +
          '        path: "settings",\n' +
          '        element: <LazyPage><Settings /></LazyPage>,\n' +
          '      },\n' +
          '    ],\n' +
          '  },\n' +
          '  {\n' +
          '    // 관리자 레이아웃 그룹 (다른 레이아웃)\n' +
          '    path: "admin",\n' +
          '    element: <AdminLayout />,\n' +
          '    children: [\n' +
          '      {\n' +
          '        index: true,\n' +
          '        element: <LazyPage><AdminPanel /></LazyPage>,\n' +
          '      },\n' +
          '      {\n' +
          '        path: "users",\n' +
          '        element: <LazyPage><UserList /></LazyPage>,\n' +
          '      },\n' +
          '    ],\n' +
          '  },\n' +
          ']);',
        description:
          "pathless Route로 레이아웃을 분리하고, React.lazy로 각 페이지를 필요할 때만 로드합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 모달 라우트와 네비게이션 가드",
      content:
        "URL 기반 모달과 폼 이탈 방지를 구현합니다.",
      code: {
        language: "typescript",
        code:
          'import {\n' +
          '  useLocation,\n' +
          '  useNavigate,\n' +
          '  useBlocker,\n' +
          '  Link,\n' +
          '  Routes,\n' +
          '  Route,\n' +
          '} from "react-router-dom";\n' +
          'import { useState } from "react";\n' +
          '\n' +
          '// ✅ 모달 라우트 패턴\n' +
          'function App() {\n' +
          '  const location = useLocation();\n' +
          '  // state에 배경 위치가 있으면 모달로 표시\n' +
          '  const backgroundLocation = location.state?.backgroundLocation;\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      {/* 배경 라우트: 모달이 열려도 이전 페이지 유지 */}\n' +
          '      <Routes location={backgroundLocation || location}>\n' +
          '        <Route path="/" element={<PhotoGrid />} />\n' +
          '        <Route path="/photos/:id" element={<PhotoPage />} />\n' +
          '      </Routes>\n' +
          '\n' +
          '      {/* 모달 라우트: backgroundLocation이 있을 때만 렌더링 */}\n' +
          '      {backgroundLocation && (\n' +
          '        <Routes>\n' +
          '          <Route path="/photos/:id" element={<PhotoModal />} />\n' +
          '        </Routes>\n' +
          '      )}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 그리드에서 클릭 시 배경 위치를 state로 전달\n' +
          'function PhotoGrid() {\n' +
          '  const location = useLocation();\n' +
          '  return (\n' +
          '    <div>\n' +
          '      {photos.map((photo) => (\n' +
          '        <Link\n' +
          '          key={photo.id}\n' +
          '          to={`/photos/${photo.id}`}\n' +
          '          state={{ backgroundLocation: location }}\n' +
          '        >\n' +
          '          {photo.title}\n' +
          '        </Link>\n' +
          '      ))}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ✅ 네비게이션 가드: 폼 이탈 방지\n' +
          'function EditForm() {\n' +
          '  const [isDirty, setIsDirty] = useState(false);\n' +
          '\n' +
          '  // 폼이 수정되었을 때만 이탈 차단\n' +
          '  const blocker = useBlocker(isDirty);\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <input onChange={() => setIsDirty(true)} />\n' +
          '      {blocker.state === "blocked" && (\n' +
          '        <div>\n' +
          '          <p>변경사항이 저장되지 않았습니다. 정말 떠나시겠습니까?</p>\n' +
          '          <button onClick={() => blocker.proceed()}>떠나기</button>\n' +
          '          <button onClick={() => blocker.reset()}>취소</button>\n' +
          '        </div>\n' +
          '      )}\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "location.state로 배경 위치를 기억하여 모달 라우트를 구현하고, useBlocker로 폼 이탈을 방지합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 해결하는 문제 | 핵심 기술 |\n" +
        "|------|-------------|----------|\n" +
        "| 레이아웃 라우트 | 페이지별 다른 레이아웃 | pathless Route + Outlet |\n" +
        "| 모달 라우트 | URL 기반 모달 + 배경 유지 | location.state |\n" +
        "| 코드 스플리팅 | 초기 번들 크기 감소 | React.lazy + Suspense |\n" +
        "| 네비게이션 가드 | 폼 이탈 방지 | useBlocker |\n\n" +
        "**핵심:** 라우팅 패턴은 조합하여 사용합니다. 레이아웃 라우트로 구조를 잡고, 코드 스플리팅으로 성능을 최적화하고, 필요한 곳에 모달 라우트와 네비게이션 가드를 적용하세요.\n\n" +
        "**다음 챕터 미리보기:** 데이터 페칭 패턴의 기초로, useEffect 페칭의 문제점과 해결책을 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "pathless Route로 다중 레이아웃을 구성할 수 있다",
    "location.state를 활용한 모달 라우트 패턴을 구현할 수 있다",
    "React.lazy와 Suspense로 라우트 기반 코드 스플리팅을 적용할 수 있다",
    "useBlocker로 네비게이션 가드를 구현할 수 있다",
    "여러 라우팅 패턴을 조합하여 복잡한 UI를 구성할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "레이아웃 라우트에서 path를 생략하는 이유는?",
      choices: [
        "URL이 필요 없는 에러 페이지용",
        "URL을 소비하지 않고 레이아웃만 적용하기 위해",
        "동적 라우트를 지원하기 위해",
        "코드 스플리팅을 적용하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "pathless Route는 URL 매칭에 참여하지 않고, 자식 라우트들에 공통 레이아웃(Outlet 포함)만 적용합니다.",
    },
    {
      id: "q2",
      question: "모달 라우트에서 location.state를 사용하는 이유는?",
      choices: [
        "모달의 애니메이션을 제어하기 위해",
        "배경 페이지의 위치를 기억하여 모달 뒤에 이전 페이지를 유지하기 위해",
        "URL을 변경하지 않기 위해",
        "서버에 상태를 전달하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "location.state에 backgroundLocation을 저장하면, Routes의 location prop에 전달하여 모달 뒤에 이전 페이지를 그대로 유지할 수 있습니다.",
    },
    {
      id: "q3",
      question: "라우트 기반 코드 스플리팅의 장점은?",
      choices: [
        "서버 사이드 렌더링 지원",
        "현재 라우트에 필요한 코드만 로드하여 초기 번들 크기 감소",
        "SEO 최적화",
        "타입 안전성 향상",
      ],
      correctIndex: 1,
      explanation:
        "React.lazy로 각 라우트의 컴포넌트를 동적 import하면, 사용자가 해당 페이지에 접근할 때만 코드를 다운로드합니다.",
    },
    {
      id: "q4",
      question: "useBlocker의 state가 'blocked'일 때 호출할 수 있는 메서드는?",
      choices: [
        "confirm()과 cancel()",
        "proceed()와 reset()",
        "allow()와 deny()",
        "continue()와 abort()",
      ],
      correctIndex: 1,
      explanation:
        "blocker.proceed()는 내비게이션을 허용하고, blocker.reset()은 내비게이션을 취소하여 현재 페이지에 머뭅니다.",
    },
    {
      id: "q5",
      question: "모달 라우트에서 URL을 직접 입력하여 접근하면 어떻게 되는가?",
      choices: [
        "항상 모달로 표시된다",
        "404 에러가 발생한다",
        "backgroundLocation이 없으므로 전체 페이지로 표시된다",
        "리다이렉트된다",
      ],
      correctIndex: 2,
      explanation:
        "URL 직접 접근 시 location.state가 없으므로 backgroundLocation도 없어, 일반 Route 매칭으로 전체 페이지 컴포넌트가 렌더링됩니다.",
    },
  ],
};

export default chapter;
