import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "39-react-router-advanced",
  subject: "react",
  title: "React Router 심화",
  description:
    "동적 라우트, loader/action 기반 데이터 라우팅, 보호된 라우트(인증 가드), 에러 바운더리(errorElement) 활용법을 학습합니다.",
  order: 39,
  group: "라우팅",
  prerequisites: ["38-react-router-basics"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "**loader**는 호텔 룸서비스입니다. 방(컴포넌트)에 도착하기 전에 미리 식사(데이터)를 준비해놓아, 방에 들어가자마자 바로 먹을 수 있습니다.\n\n" +
        "**action**은 호텔 프론트 데스크입니다. 체크아웃(폼 제출), 방 변경 요청(데이터 수정) 같은 요청을 처리하고, 처리 결과에 따라 적절한 방으로 안내합니다.\n\n" +
        "**보호된 라우트**는 호텔의 키카드 시스템입니다. 투숙객(인증된 사용자)만 객실 층에 접근할 수 있고, 비투숙객은 로비(로그인 페이지)로 안내됩니다.\n\n" +
        "**errorElement**는 호텔의 비상 안내 시스템입니다. 문제가 발생하면 당황하지 않도록 안내 메시지를 보여줍니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "기본 라우팅만으로는 실무 앱의 요구사항을 충족하기 어렵습니다.\n\n" +
        "1. **워터폴 데이터 로딩** — 컴포넌트가 렌더링된 후 useEffect로 데이터를 가져오면, 부모→자식 순서로 순차적 로딩이 발생합니다\n" +
        "2. **인증 보호 미흡** — URL을 직접 입력하면 인증 없이 보호된 페이지에 접근할 수 있습니다\n" +
        "3. **에러 처리 분산** — 각 컴포넌트가 개별적으로 에러를 처리하면 일관성이 없고 코드가 중복됩니다\n" +
        "4. **폼 제출 관리** — 폼 제출 후 리다이렉트, 낙관적 업데이트, 에러 처리를 수동으로 관리해야 합니다",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### loader: 데이터 사전 로딩\n" +
        "라우트에 loader 함수를 정의하면 컴포넌트가 렌더링되기 전에 데이터를 가져옵니다. 병렬 데이터 로딩으로 워터폴 문제를 해결합니다.\n\n" +
        "### action: 폼 제출 처리\n" +
        "라우트에 action 함수를 정의하면 `<Form>` 컴포넌트의 제출을 처리합니다. 제출 후 자동으로 loader를 재실행하여 데이터를 갱신합니다.\n\n" +
        "### 보호된 라우트\n" +
        "인증 상태를 확인하는 래퍼 컴포넌트로 라우트를 감싸거나, loader에서 redirect를 반환하여 비인증 사용자를 차단합니다.\n\n" +
        "### errorElement\n" +
        "라우트별로 에러 UI를 정의하여 loader, action, 렌더링 중 발생하는 에러를 일관적으로 처리합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: loader/action과 데이터 라우팅",
      content:
        "createBrowserRouter를 사용한 데이터 라우팅 패턴입니다.",
      code: {
        language: "typescript",
        code:
          'import {\n' +
          '  createBrowserRouter,\n' +
          '  RouterProvider,\n' +
          '  redirect,\n' +
          '  useLoaderData,\n' +
          '  useActionData,\n' +
          '  Form,\n' +
          '  useNavigation,\n' +
          '  type LoaderFunctionArgs,\n' +
          '  type ActionFunctionArgs,\n' +
          '} from "react-router-dom";\n' +
          '\n' +
          'interface Post {\n' +
          '  id: number;\n' +
          '  title: string;\n' +
          '  body: string;\n' +
          '}\n' +
          '\n' +
          '// loader: 컴포넌트 렌더링 전 데이터를 가져옴\n' +
          'async function postLoader({ params }: LoaderFunctionArgs) {\n' +
          '  const response = await fetch(`/api/posts/${params.postId}`);\n' +
          '  if (!response.ok) {\n' +
          '    throw new Response("게시글을 찾을 수 없습니다", { status: 404 });\n' +
          '  }\n' +
          '  return response.json() as Promise<Post>;\n' +
          '}\n' +
          '\n' +
          '// action: 폼 제출 처리\n' +
          'async function postAction({ request, params }: ActionFunctionArgs) {\n' +
          '  const formData = await request.formData();\n' +
          '  const title = formData.get("title") as string;\n' +
          '  const body = formData.get("body") as string;\n' +
          '\n' +
          '  await fetch(`/api/posts/${params.postId}`, {\n' +
          '    method: "PUT",\n' +
          '    body: JSON.stringify({ title, body }),\n' +
          '  });\n' +
          '\n' +
          '  // action 후 redirect하면 해당 경로의 loader가 자동 실행\n' +
          '  return redirect(`/posts/${params.postId}`);\n' +
          '}\n' +
          '\n' +
          '// 라우터 정의\n' +
          'const router = createBrowserRouter([\n' +
          '  {\n' +
          '    path: "/",\n' +
          '    element: <Layout />,\n' +
          '    errorElement: <GlobalError />,\n' +
          '    children: [\n' +
          '      { index: true, element: <Home /> },\n' +
          '      {\n' +
          '        path: "posts/:postId",\n' +
          '        element: <PostDetail />,\n' +
          '        loader: postLoader,\n' +
          '        action: postAction,\n' +
          '        errorElement: <PostError />,\n' +
          '      },\n' +
          '    ],\n' +
          '  },\n' +
          ']);\n' +
          '\n' +
          '// 컴포넌트에서 loader 데이터 사용\n' +
          'function PostDetail() {\n' +
          '  const post = useLoaderData() as Post;\n' +
          '  const navigation = useNavigation();\n' +
          '  const isSubmitting = navigation.state === "submitting";\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <h1>{post.title}</h1>\n' +
          '      <Form method="put">\n' +
          '        <input name="title" defaultValue={post.title} />\n' +
          '        <textarea name="body" defaultValue={post.body} />\n' +
          '        <button disabled={isSubmitting}>\n' +
          '          {isSubmitting ? "저장 중..." : "저장"}\n' +
          '        </button>\n' +
          '      </Form>\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "loader로 데이터를 사전 로딩하고, action으로 폼 제출을 처리합니다. action 후 redirect하면 loader가 자동 재실행됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 보호된 라우트와 에러 바운더리",
      content:
        "인증 가드와 라우트별 에러 처리를 구현합니다.",
      code: {
        language: "typescript",
        code:
          'import {\n' +
          '  createBrowserRouter,\n' +
          '  redirect,\n' +
          '  useRouteError,\n' +
          '  isRouteErrorResponse,\n' +
          '  Outlet,\n' +
          '  Navigate,\n' +
          '  useLocation,\n' +
          '} from "react-router-dom";\n' +
          '\n' +
          '// 방법 1: loader에서 인증 확인\n' +
          'async function protectedLoader() {\n' +
          '  const user = await getCurrentUser();\n' +
          '  if (!user) {\n' +
          '    return redirect("/login");\n' +
          '  }\n' +
          '  return user;\n' +
          '}\n' +
          '\n' +
          '// 방법 2: 래퍼 컴포넌트로 보호\n' +
          'function ProtectedRoute({ children }: { children?: React.ReactNode }) {\n' +
          '  const { user, isLoading } = useAuth();\n' +
          '  const location = useLocation();\n' +
          '\n' +
          '  if (isLoading) return <div>인증 확인 중...</div>;\n' +
          '\n' +
          '  if (!user) {\n' +
          '    // 로그인 후 원래 페이지로 돌아갈 수 있도록 현재 위치 저장\n' +
          '    return <Navigate to="/login" state={{ from: location }} replace />;\n' +
          '  }\n' +
          '\n' +
          '  return children ?? <Outlet />;\n' +
          '}\n' +
          '\n' +
          '// 에러 바운더리 컴포넌트\n' +
          'function ErrorBoundary() {\n' +
          '  const error = useRouteError();\n' +
          '\n' +
          '  if (isRouteErrorResponse(error)) {\n' +
          '    // loader/action에서 throw new Response()한 경우\n' +
          '    return (\n' +
          '      <div>\n' +
          '        <h1>{error.status}</h1>\n' +
          '        <p>{error.statusText || error.data}</p>\n' +
          '      </div>\n' +
          '    );\n' +
          '  }\n' +
          '\n' +
          '  // 예상치 못한 에러\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <h1>오류가 발생했습니다</h1>\n' +
          '      <p>잠시 후 다시 시도해주세요.</p>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 라우터 구성\n' +
          'const router = createBrowserRouter([\n' +
          '  {\n' +
          '    path: "/",\n' +
          '    element: <Layout />,\n' +
          '    errorElement: <ErrorBoundary />,\n' +
          '    children: [\n' +
          '      { path: "login", element: <LoginPage /> },\n' +
          '      {\n' +
          '        // 보호된 라우트 그룹\n' +
          '        element: <ProtectedRoute />,\n' +
          '        children: [\n' +
          '          { path: "dashboard", element: <Dashboard /> },\n' +
          '          { path: "profile", element: <Profile /> },\n' +
          '          {\n' +
          '            path: "admin",\n' +
          '            element: <AdminPage />,\n' +
          '            loader: protectedLoader,\n' +
          '            errorElement: <ErrorBoundary />,\n' +
          '          },\n' +
          '        ],\n' +
          '      },\n' +
          '    ],\n' +
          '  },\n' +
          ']);',
        description:
          "ProtectedRoute 래퍼로 인증되지 않은 사용자를 리다이렉트하고, errorElement로 라우트별 에러를 처리합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 기능 | 설명 |\n" +
        "|------|------|\n" +
        "| loader | 컴포넌트 렌더링 전 데이터 사전 로딩 |\n" +
        "| action | Form 제출 처리 + 자동 데이터 갱신 |\n" +
        "| errorElement | 라우트별 에러 UI 정의 |\n" +
        "| ProtectedRoute | 인증 가드로 비인증 사용자 차단 |\n" +
        "| useNavigation | 내비게이션 상태(loading/submitting) 확인 |\n\n" +
        "**핵심:** loader/action 패턴은 데이터 로딩과 폼 제출을 라우트 레벨에서 관리하여, 컴포넌트의 책임을 렌더링에 집중시킵니다. 보호된 라우트와 errorElement로 인증과 에러 처리를 일관적으로 구현할 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** 레이아웃 라우트, 병렬 라우트, 모달 라우트 등 실무 라우팅 패턴을 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "loader를 사용하여 컴포넌트 렌더링 전에 데이터를 로드할 수 있다",
    "action과 Form을 사용하여 폼 제출을 처리할 수 있다",
    "보호된 라우트를 구현하여 비인증 사용자를 차단할 수 있다",
    "errorElement와 useRouteError로 라우트별 에러를 처리할 수 있다",
    "createBrowserRouter로 데이터 라우팅을 설정할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "loader 함수가 실행되는 시점은?",
      choices: [
        "컴포넌트가 렌더링된 후",
        "컴포넌트가 렌더링되기 전 (내비게이션 시)",
        "useEffect 내부에서",
        "사용자가 버튼을 클릭할 때",
      ],
      correctIndex: 1,
      explanation:
        "loader는 라우트 매칭 시 컴포넌트가 렌더링되기 전에 실행됩니다. 이를 통해 컴포넌트는 이미 준비된 데이터를 바로 사용할 수 있습니다.",
    },
    {
      id: "q2",
      question: "action 함수 실행 후 자동으로 일어나는 일은?",
      choices: [
        "페이지가 새로고침된다",
        "해당 라우트의 loader가 재실행된다",
        "모든 컴포넌트가 언마운트된다",
        "브라우저 캐시가 초기화된다",
      ],
      correctIndex: 1,
      explanation:
        "action 실행 후 React Router는 관련 라우트의 loader를 자동으로 재실행하여 최신 데이터를 가져옵니다.",
    },
    {
      id: "q3",
      question: "보호된 라우트에서 로그인 후 원래 페이지로 돌아가려면?",
      choices: [
        "window.history.back() 호출",
        "Navigate의 state에 현재 위치를 저장하고, 로그인 후 해당 위치로 이동",
        "쿠키에 URL 저장",
        "Redux에 이전 URL 저장",
      ],
      correctIndex: 1,
      explanation:
        "Navigate to='/login' state={{ from: location }}으로 현재 위치를 저장하고, 로그인 성공 후 state.from으로 리다이렉트합니다.",
    },
    {
      id: "q4",
      question: "errorElement에서 에러 종류를 구분하는 방법은?",
      choices: [
        "try-catch 블록 사용",
        "isRouteErrorResponse로 Response 에러와 일반 에러를 구분",
        "error.type 속성 확인",
        "Error.name으로 분류",
      ],
      correctIndex: 1,
      explanation:
        "isRouteErrorResponse(error)를 사용하면 loader/action에서 throw new Response()로 던진 에러와 예상치 못한 에러를 구분할 수 있습니다.",
    },
    {
      id: "q5",
      question: "useNavigation().state의 값으로 올바르지 않은 것은?",
      choices: [
        "idle",
        "loading",
        "submitting",
        "error",
      ],
      correctIndex: 3,
      explanation:
        "useNavigation().state는 'idle'(대기), 'loading'(loader 실행 중), 'submitting'(action 실행 중) 세 가지 값을 가집니다. 'error'는 없습니다.",
    },
  ],
};

export default chapter;
