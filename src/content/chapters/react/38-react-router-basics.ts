import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "38-react-router-basics",
  subject: "react",
  title: "React Router 기초",
  description:
    "BrowserRouter, Route, Link/NavLink, 중첩 라우트, Outlet, useNavigate, useParams, useSearchParams를 학습합니다.",
  order: 38,
  group: "라우팅",
  prerequisites: ["37-state-management-comparison"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "React Router는 건물의 안내 데스크와 같습니다.\n\n" +
        "**BrowserRouter**는 건물 자체입니다. URL이라는 주소 체계를 제공합니다.\n\n" +
        "**Route**는 층별 안내판입니다. '/1층'은 로비, '/2층'은 사무실, '/3층'은 회의실로 연결됩니다.\n\n" +
        "**Link**는 엘리베이터 버튼입니다. 버튼을 누르면 페이지를 새로 불러오지 않고(새 건물로 이동하지 않고) 해당 층으로 이동합니다.\n\n" +
        "**중첩 라우트**는 층 안의 방 번호입니다. '/2층/201호', '/2층/202호'처럼 상위 경로 안에서 하위 경로가 존재합니다.\n\n" +
        "**Outlet**은 각 층의 공용 복도입니다. 복도(레이아웃)는 그대로이고, 방(하위 컴포넌트)만 바뀝니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "SPA(Single Page Application)에서 라우팅 없이 개발하면 여러 문제가 발생합니다.\n\n" +
        "1. **URL 공유 불가** — 모든 페이지가 같은 URL이므로 특정 화면을 공유하거나 북마크할 수 없습니다\n" +
        "2. **뒤로 가기 불가** — 브라우저 히스토리가 관리되지 않아 뒤로 가기 버튼이 작동하지 않습니다\n" +
        "3. **전체 페이지 새로고침** — `<a>` 태그를 사용하면 매번 전체 페이지를 다시 불러옵니다\n" +
        "4. **조건부 렌더링의 복잡도** — URL 없이 상태로만 화면을 전환하면 코드가 복잡해집니다",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "React Router는 URL과 컴포넌트를 매핑하여 SPA에서도 전통적인 웹 네비게이션 경험을 제공합니다.\n\n" +
        "### 핵심 컴포넌트\n" +
        "- `BrowserRouter`: HTML5 History API 기반 라우터\n" +
        "- `Routes/Route`: URL 경로와 컴포넌트 매핑\n" +
        "- `Link/NavLink`: 페이지 새로고침 없는 내비게이션\n" +
        "- `Outlet`: 중첩 라우트의 자식 컴포넌트 렌더링 위치\n\n" +
        "### 핵심 Hook\n" +
        "- `useNavigate`: 프로그래밍 방식 내비게이션\n" +
        "- `useParams`: URL 경로 파라미터 읽기\n" +
        "- `useSearchParams`: 쿼리 스트링 읽기/쓰기\n\n" +
        "### 중첩 라우트\n" +
        "공통 레이아웃을 유지하면서 하위 컴포넌트만 변경할 수 있습니다. 부모 Route에 `Outlet`을 배치하면 자식 Route가 해당 위치에 렌더링됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: React Router 기본 설정",
      content:
        "BrowserRouter, Route, 중첩 라우트의 기본 구조를 설정합니다.",
      code: {
        language: "typescript",
        code:
          'import {\n' +
          '  BrowserRouter,\n' +
          '  Routes,\n' +
          '  Route,\n' +
          '  Link,\n' +
          '  NavLink,\n' +
          '  Outlet,\n' +
          '  useNavigate,\n' +
          '  useParams,\n' +
          '  useSearchParams,\n' +
          '} from "react-router-dom";\n' +
          '\n' +
          '// 라우트 구조 정의\n' +
          'function App() {\n' +
          '  return (\n' +
          '    <BrowserRouter>\n' +
          '      <Routes>\n' +
          '        {/* 레이아웃 라우트 (Outlet 사용) */}\n' +
          '        <Route path="/" element={<Layout />}>\n' +
          '          <Route index element={<Home />} />\n' +
          '          <Route path="posts" element={<PostList />} />\n' +
          '          {/* 동적 파라미터 */}\n' +
          '          <Route path="posts/:postId" element={<PostDetail />} />\n' +
          '          {/* 중첩 라우트 */}\n' +
          '          <Route path="settings" element={<SettingsLayout />}>\n' +
          '            <Route index element={<GeneralSettings />} />\n' +
          '            <Route path="profile" element={<ProfileSettings />} />\n' +
          '            <Route path="security" element={<SecuritySettings />} />\n' +
          '          </Route>\n' +
          '          {/* 404 처리 */}\n' +
          '          <Route path="*" element={<NotFound />} />\n' +
          '        </Route>\n' +
          '      </Routes>\n' +
          '    </BrowserRouter>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 레이아웃: 공통 UI + Outlet\n' +
          'function Layout() {\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <nav>\n' +
          '        <Link to="/">홈</Link>\n' +
          '        <NavLink\n' +
          '          to="/posts"\n' +
          '          className={({ isActive }) => (isActive ? "active" : "")}\n' +
          '        >\n' +
          '          게시글\n' +
          '        </NavLink>\n' +
          '      </nav>\n' +
          '      <main>\n' +
          '        <Outlet /> {/* 자식 라우트가 여기에 렌더링 */}\n' +
          '      </main>\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "Route 중첩으로 레이아웃을 공유하고, Outlet으로 자식 컴포넌트의 렌더링 위치를 지정합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: useParams, useNavigate, useSearchParams",
      content:
        "라우터 Hook을 활용하여 동적 라우팅과 프로그래밍 방식 내비게이션을 구현합니다.",
      code: {
        language: "typescript",
        code:
          'import { useParams, useNavigate, useSearchParams } from "react-router-dom";\n' +
          '\n' +
          '// useParams: URL 경로 파라미터 읽기\n' +
          '// URL: /posts/42\n' +
          'function PostDetail() {\n' +
          '  const { postId } = useParams<{ postId: string }>();\n' +
          '  // postId === "42"\n' +
          '  return <div>게시글 #{postId}</div>;\n' +
          '}\n' +
          '\n' +
          '// useNavigate: 프로그래밍 방식 내비게이션\n' +
          'function LoginForm() {\n' +
          '  const navigate = useNavigate();\n' +
          '\n' +
          '  async function handleSubmit(e: React.FormEvent) {\n' +
          '    e.preventDefault();\n' +
          '    await login();\n' +
          '    // 로그인 성공 후 대시보드로 이동\n' +
          '    navigate("/dashboard");\n' +
          '    // 뒤로 가기 시 로그인 페이지로 돌아가지 않도록\n' +
          '    // navigate("/dashboard", { replace: true });\n' +
          '  }\n' +
          '\n' +
          '  return <form onSubmit={handleSubmit}>...</form>;\n' +
          '}\n' +
          '\n' +
          '// useSearchParams: 쿼리 스트링 읽기/쓰기\n' +
          '// URL: /posts?page=2&sort=latest\n' +
          'function PostList() {\n' +
          '  const [searchParams, setSearchParams] = useSearchParams();\n' +
          '  const page = Number(searchParams.get("page")) || 1;\n' +
          '  const sort = searchParams.get("sort") || "latest";\n' +
          '\n' +
          '  function goToPage(newPage: number) {\n' +
          '    setSearchParams((prev) => {\n' +
          '      prev.set("page", String(newPage));\n' +
          '      return prev;\n' +
          '    });\n' +
          '  }\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <p>페이지: {page}, 정렬: {sort}</p>\n' +
          '      <button onClick={() => goToPage(page + 1)}>다음 페이지</button>\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "useParams로 동적 경로를 읽고, useNavigate로 프로그래밍 방식 이동, useSearchParams로 쿼리 스트링을 관리합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 컴포넌트/Hook | 역할 |\n" +
        "|--------------|------|\n" +
        "| BrowserRouter | HTML5 History API 기반 라우터 컨테이너 |\n" +
        "| Route | URL 경로와 컴포넌트를 매핑 |\n" +
        "| Link / NavLink | 클라이언트 사이드 내비게이션 |\n" +
        "| Outlet | 중첩 라우트의 자식 렌더링 위치 |\n" +
        "| useNavigate | 프로그래밍 방식 내비게이션 |\n" +
        "| useParams | URL 경로 파라미터 읽기 |\n" +
        "| useSearchParams | 쿼리 스트링 읽기/쓰기 |\n\n" +
        "**핵심:** React Router는 URL과 컴포넌트를 매핑하여 SPA에서도 전통적인 웹 네비게이션(뒤로 가기, 북마크, URL 공유)을 가능하게 합니다. 중첩 라우트와 Outlet을 활용하면 레이아웃 공유가 자연스럽습니다.\n\n" +
        "**다음 챕터 미리보기:** 동적 라우트, 데이터 로딩(loader/action), 보호된 라우트 등 심화 기능을 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "BrowserRouter, Routes, Route로 기본 라우팅 구조를 설정할 수 있다",
    "Link와 NavLink의 차이를 설명하고 활용할 수 있다",
    "중첩 라우트와 Outlet을 사용하여 레이아웃을 공유할 수 있다",
    "useParams로 동적 경로 파라미터를 읽을 수 있다",
    "useNavigate로 프로그래밍 방식 내비게이션을 구현할 수 있다",
    "useSearchParams로 쿼리 스트링을 관리할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Link 컴포넌트를 사용하는 이유는?",
      choices: [
        "SEO를 위해",
        "페이지 전체 새로고침 없이 내비게이션하기 위해",
        "서버 컴포넌트를 지원하기 위해",
        "CSS 스타일링을 쉽게 하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "Link 컴포넌트는 <a> 태그와 달리 전체 페이지를 새로 불러오지 않고, React Router가 관리하는 클라이언트 사이드 내비게이션을 수행합니다.",
    },
    {
      id: "q2",
      question: "NavLink가 Link와 다른 점은?",
      choices: [
        "NavLink는 외부 URL로도 이동 가능",
        "NavLink는 현재 활성 라우트에 isActive 상태를 제공",
        "NavLink는 프로그래밍 방식 내비게이션을 지원",
        "NavLink는 중첩 라우트에서만 사용 가능",
      ],
      correctIndex: 1,
      explanation:
        "NavLink는 className이나 style 속성에 함수를 전달하면 isActive, isPending 등의 상태를 받아 활성 링크를 스타일링할 수 있습니다.",
    },
    {
      id: "q3",
      question: "Outlet 컴포넌트의 역할은?",
      choices: [
        "에러를 처리하는 fallback UI를 렌더링",
        "중첩 라우트의 자식 컴포넌트가 렌더링되는 위치를 지정",
        "외부 페이지로의 링크를 생성",
        "라우트 가드를 적용",
      ],
      correctIndex: 1,
      explanation:
        "Outlet은 부모 라우트의 레이아웃 컴포넌트에서 자식 라우트가 렌더링될 위치를 지정합니다.",
    },
    {
      id: "q4",
      question: "useNavigate의 replace 옵션은 언제 사용하는가?",
      choices: [
        "새 탭에서 페이지를 열 때",
        "현재 히스토리 항목을 교체하여 뒤로 가기를 방지할 때",
        "강제로 페이지를 새로고침할 때",
        "URL을 인코딩할 때",
      ],
      correctIndex: 1,
      explanation:
        "replace: true를 사용하면 히스토리 스택에 새 항목을 추가하지 않고 현재 항목을 교체합니다. 로그인 후 리다이렉트 등에서 뒤로 가기 시 로그인 페이지로 돌아가는 것을 방지할 때 사용합니다.",
    },
    {
      id: "q5",
      question: "Route path='*'의 의미는?",
      choices: [
        "모든 하위 라우트에 적용",
        "정의되지 않은 모든 경로를 매칭 (404 처리)",
        "와일드카드 파라미터를 캡처",
        "모든 HTTP 메서드에 응답",
      ],
      correctIndex: 1,
      explanation:
        "path='*'는 다른 라우트와 매칭되지 않는 모든 경로를 처리합니다. 보통 404 Not Found 페이지를 렌더링하는 데 사용합니다.",
    },
    {
      id: "q6",
      question: "useSearchParams로 쿼리 파라미터를 업데이트할 때 올바른 방법은?",
      choices: [
        "window.location.search를 직접 수정",
        "setSearchParams 함수를 사용하여 URLSearchParams 업데이트",
        "useNavigate로 전체 URL을 재지정",
        "useParams로 쿼리를 수정",
      ],
      correctIndex: 1,
      explanation:
        "setSearchParams에 함수를 전달하면 기존 파라미터를 유지하면서 특정 파라미터만 업데이트할 수 있습니다.",
    },
  ],
};

export default chapter;
