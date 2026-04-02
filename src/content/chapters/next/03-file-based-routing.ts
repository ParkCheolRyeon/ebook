import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "03-file-based-routing",
  subject: "next",
  title: "파일 기반 라우팅",
  description:
    "App Router의 파일 기반 라우팅 시스템, 특수 파일 규약(page, layout, loading, error, not-found), 동적 라우트, React Router와의 비교를 학습합니다.",
  order: 3,
  group: "기초",
  prerequisites: ["02-project-setup"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Next.js의 파일 기반 라우팅은 **건물의 층수와 호수 체계**와 같습니다.\n\n" +
        "건물에서 '3층 302호'라고 하면 별도의 안내판 없이도 위치를 알 수 있듯이, " +
        "`app/blog/[id]/page.tsx`라는 파일 경로를 보면 `/blog/123`이라는 URL에 대응한다는 것을 바로 알 수 있습니다.\n\n" +
        "React Router 방식은 **전화번호부**와 같습니다. 건물의 실제 구조와 상관없이, 별도의 문서(라우트 설정 파일)에 " +
        "'3층은 여기, 4층은 저기'라고 일일이 적어놓아야 합니다. 번호부를 업데이트하지 않으면 길을 잃게 됩니다.\n\n" +
        "특수 파일들(`layout.tsx`, `loading.tsx`, `error.tsx`)은 **건물의 시설물**과 같습니다:\n" +
        "- `layout.tsx`는 각 층의 **복도** — 모든 호실이 공유하는 공간\n" +
        "- `loading.tsx`는 **엘리베이터 대기 화면** — 콘텐츠가 준비될 때까지 보여주는 안내\n" +
        "- `error.tsx`는 **비상구 안내도** — 문제가 발생했을 때 보여주는 대안\n" +
        "- `not-found.tsx`는 **'해당 호실 없음' 안내문** — 존재하지 않는 경로 처리",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "전통적인 React 앱에서 라우팅을 설정하는 과정에는 여러 마찰점이 있습니다.\n\n" +
        "### 1. 라우트 정의와 파일이 분리되어 있다\n" +
        "React Router에서는 라우트를 한 파일에서 정의하고, 실제 컴포넌트는 다른 파일에 있습니다. " +
        "라우트 수가 늘어날수록 정의 파일이 비대해지고, 어떤 URL이 어떤 컴포넌트를 렌더링하는지 추적하기 어렵습니다.\n\n" +
        "### 2. 코드 스플리팅을 수동 설정해야 한다\n" +
        "`React.lazy()`와 `Suspense`를 사용한 동적 임포트를 각 라우트마다 개별 설정해야 합니다. " +
        "깜빡하면 모든 페이지 코드가 하나의 번들에 포함되어 초기 로딩이 느려집니다.\n\n" +
        "### 3. 로딩/에러 처리가 일관적이지 않다\n" +
        "각 페이지마다 로딩 상태, 에러 처리를 개별적으로 구현해야 합니다. Suspense와 ErrorBoundary를 " +
        "어디에 배치할지, 어떤 범위로 적용할지 매번 결정해야 합니다.\n\n" +
        "### 4. 중첩 레이아웃이 복잡하다\n" +
        "대시보드 내 사이드바, 설정 페이지 내 탭 같은 중첩 레이아웃을 React Router의 `<Outlet />`과 " +
        "중첩 라우트로 구현하려면 상당한 설정이 필요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js App Router는 **파일 시스템을 라우팅 API로 사용**하여 이 문제들을 해결합니다.\n\n" +
        "### 핵심 규칙: 폴더 = 경로, page.tsx = UI\n" +
        "`app/` 디렉토리 내에서 **폴더를 만들면 URL 세그먼트**가 되고, " +
        "그 폴더 안에 **`page.tsx`를 만들면 해당 URL의 UI**가 됩니다. `page.tsx`가 없는 폴더는 URL로 접근할 수 없습니다.\n\n" +
        "### 특수 파일 규약\n" +
        "Next.js는 각 라우트 폴더 안에 특별한 역할을 하는 파일들을 정의합니다:\n" +
        "- **`page.tsx`** — 해당 경로의 UI (이 파일이 있어야 라우트가 활성화)\n" +
        "- **`layout.tsx`** — 자식 라우트 간 공유 UI (네비게이션 시 리렌더 안 됨)\n" +
        "- **`loading.tsx`** — 로딩 중 보여줄 UI (자동 Suspense 래핑)\n" +
        "- **`error.tsx`** — 에러 발생 시 보여줄 UI (자동 ErrorBoundary 래핑)\n" +
        "- **`not-found.tsx`** — 404 페이지\n" +
        "- **`route.ts`** — API 엔드포인트 (page.tsx와 같은 폴더에 공존 불가)\n\n" +
        "### 자동 코드 스플리팅\n" +
        "각 `page.tsx`는 자동으로 별도의 JavaScript 번들로 분리됩니다. " +
        "개발자가 `React.lazy()`를 쓸 필요가 없습니다.\n\n" +
        "### 동적 라우트\n" +
        "폴더 이름을 대괄호로 감싸면 동적 세그먼트가 됩니다: `[id]`, `[slug]`. " +
        "Catch-all은 `[...segments]`, Optional catch-all은 `[[...segments]]`입니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 라우트 구조와 특수 파일",
      content:
        "파일 시스템 구조가 어떻게 URL과 매핑되는지, 그리고 특수 파일들의 렌더링 순서를 살펴봅니다. " +
        "React Router와 비교하여 차이점을 이해합니다.",
      code: {
        language: "typescript",
        code:
          '// === 파일 시스템 → URL 매핑 ===\n' +
          '// app/page.tsx                    → /\n' +
          '// app/about/page.tsx              → /about\n' +
          '// app/blog/page.tsx               → /blog\n' +
          '// app/blog/[slug]/page.tsx        → /blog/my-post\n' +
          '// app/shop/[...categories]/page.tsx → /shop/clothes/tops/t-shirts\n' +
          '// app/docs/[[...slug]]/page.tsx   → /docs 또는 /docs/a/b/c\n\n' +
          '// === React Router 방식 (비교) ===\n' +
          'import { createBrowserRouter } from "react-router-dom";\n\n' +
          'const router = createBrowserRouter([\n' +
          '  { path: "/", element: <Home /> },\n' +
          '  { path: "/about", element: <About /> },\n' +
          '  { path: "/blog", element: <Blog /> },\n' +
          '  { path: "/blog/:slug", element: <BlogPost /> },\n' +
          ']);\n' +
          '// → 파일과 라우트 정의가 분리됨\n' +
          '// → 코드 스플리팅을 수동 설정해야 함\n\n' +
          '// === Next.js 특수 파일 렌더링 순서 ===\n' +
          '// 각 라우트에서 Next.js가 내부적으로 만드는 구조:\n\n' +
          '// <Layout>          ← layout.tsx\n' +
          '//   <ErrorBoundary> ← error.tsx\n' +
          '//     <Suspense fallback={<Loading />}> ← loading.tsx\n' +
          '//       <Page />    ← page.tsx\n' +
          '//     </Suspense>\n' +
          '//   </ErrorBoundary>\n' +
          '// </Layout>\n\n' +
          '// 이 중첩은 각 폴더 레벨에서 반복되므로,\n' +
          '// 특정 라우트의 에러가 부모 라우트의 레이아웃을 깨뜨리지 않음',
        description:
          "폴더 구조가 URL이 되고, 특수 파일들이 Layout > ErrorBoundary > Suspense > Page 순서로 자동 중첩됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 블로그 라우팅 구현",
      content:
        "블로그 앱의 전체 라우팅 구조를 구현합니다. 정적 라우트, 동적 라우트, 중첩 레이아웃, " +
        "로딩/에러 처리를 파일 시스템만으로 구성하는 방법을 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// 프로젝트 구조:\n' +
          '// app/\n' +
          '// ├── page.tsx              → "/"\n' +
          '// ├── layout.tsx            → 모든 페이지 공유\n' +
          '// ├── not-found.tsx         → 전역 404\n' +
          '// └── blog/\n' +
          '//     ├── page.tsx          → "/blog"\n' +
          '//     ├── loading.tsx       → "/blog" 로딩 UI\n' +
          '//     └── [slug]/\n' +
          '//         ├── page.tsx      → "/blog/my-post"\n' +
          '//         ├── loading.tsx   → 개별 포스트 로딩 UI\n' +
          '//         └── error.tsx     → 개별 포스트 에러 UI\n\n' +
          '// === app/blog/page.tsx ===\n' +
          'interface Post {\n' +
          '  slug: string;\n' +
          '  title: string;\n' +
          '  excerpt: string;\n' +
          '}\n\n' +
          'export default async function BlogListPage() {\n' +
          '  const posts: Post[] = await fetch(\n' +
          '    "https://api.example.com/posts",\n' +
          '    { next: { revalidate: 60 } } // 60초마다 재검증\n' +
          '  ).then(res => res.json());\n\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <h1>블로그</h1>\n' +
          '      {posts.map(post => (\n' +
          '        <article key={post.slug}>\n' +
          '          <a href={`/blog/${post.slug}`}>{post.title}</a>\n' +
          '          <p>{post.excerpt}</p>\n' +
          '        </article>\n' +
          '      ))}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// === app/blog/[slug]/page.tsx ===\n' +
          'interface BlogPostProps {\n' +
          '  params: Promise<{ slug: string }>;\n' +
          '}\n\n' +
          'export default async function BlogPostPage({ params }: BlogPostProps) {\n' +
          '  const { slug } = await params;\n' +
          '  const post = await fetch(`https://api.example.com/posts/${slug}`)\n' +
          '    .then(res => {\n' +
          '      if (!res.ok) throw new Error("포스트를 찾을 수 없습니다");\n' +
          '      return res.json();\n' +
          '    });\n\n' +
          '  return (\n' +
          '    <article>\n' +
          '      <h1>{post.title}</h1>\n' +
          '      <time>{post.date}</time>\n' +
          '      <div>{post.content}</div>\n' +
          '    </article>\n' +
          '  );\n' +
          '}\n\n' +
          '// === app/blog/[slug]/error.tsx ===\n' +
          '"use client"; // error.tsx는 반드시 클라이언트 컴포넌트\n\n' +
          'export default function BlogError({\n' +
          '  error,\n' +
          '  reset,\n' +
          '}: {\n' +
          '  error: Error;\n' +
          '  reset: () => void;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <h2>문제가 발생했습니다</h2>\n' +
          '      <p>{error.message}</p>\n' +
          '      <button onClick={reset}>다시 시도</button>\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "파일 시스템만으로 블로그의 목록, 상세, 로딩, 에러 처리가 완성됩니다. 별도의 라우팅 설정이 필요 없습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| 폴더 = URL 세그먼트 | `app/blog/` → `/blog` |\n" +
        "| `page.tsx` | 해당 경로의 UI 정의 (필수) |\n" +
        "| `layout.tsx` | 자식 라우트 공유 UI (네비게이션 시 유지) |\n" +
        "| `loading.tsx` | Suspense fallback 자동 래핑 |\n" +
        "| `error.tsx` | ErrorBoundary 자동 래핑 (`'use client'` 필수) |\n" +
        "| `not-found.tsx` | 404 페이지 |\n" +
        "| `[param]` | 동적 라우트 세그먼트 |\n" +
        "| `[...params]` | Catch-all 라우트 |\n" +
        "| `[[...params]]` | Optional catch-all 라우트 |\n\n" +
        "**핵심:** Next.js App Router에서는 폴더가 URL 경로가 되고, `page.tsx`가 해당 경로의 UI를 정의한다. " +
        "설정 파일 없이 파일 시스템이 곧 라우팅이다.\n\n" +
        "**다음 챕터 미리보기:** `layout.tsx`의 중첩 동작과 `template.tsx`의 차이, " +
        "metadata export를 활용한 SEO 설정을 자세히 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Next.js App Router에서는 폴더가 URL 경로가 되고, page.tsx가 해당 경로의 UI를 정의한다. 설정 파일 없이 파일 시스템이 곧 라우팅이다.",
  checklist: [
    "app/ 디렉토리에서 폴더와 page.tsx가 URL에 어떻게 매핑되는지 설명할 수 있다",
    "특수 파일(page, layout, loading, error, not-found)의 역할과 렌더링 순서를 이해한다",
    "동적 라우트([param])와 catch-all 라우트([...params])의 차이를 구분할 수 있다",
    "error.tsx가 반드시 클라이언트 컴포넌트여야 하는 이유를 설명할 수 있다",
    "React Router와 비교하여 파일 기반 라우팅의 장점을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "app/products/[id]/page.tsx 파일이 매핑되는 URL 패턴은?",
      choices: [
        "/products/id",
        "/products/[id]",
        "/products/123 (동적 값)",
        "/products",
      ],
      correctIndex: 2,
      explanation:
        "[id]는 동적 세그먼트로, /products/123, /products/abc 등 어떤 값이든 매칭됩니다. params.id로 해당 값에 접근할 수 있습니다.",
    },
    {
      id: "q2",
      question:
        "app/dashboard/ 폴더에 page.tsx가 없으면 /dashboard URL에 접근하면 어떻게 되나요?",
      choices: [
        "빈 페이지가 렌더링된다",
        "404 에러가 발생한다",
        "자동으로 index 페이지가 생성된다",
        "layout.tsx만 렌더링된다",
      ],
      correctIndex: 1,
      explanation:
        "page.tsx가 없는 폴더는 라우트로 활성화되지 않습니다. 해당 URL에 접근하면 404 에러가 발생합니다. 폴더는 URL 세그먼트를 정의하지만, page.tsx가 있어야 실제로 접근 가능합니다.",
    },
    {
      id: "q3",
      question: "Next.js가 특수 파일들을 렌더링하는 올바른 중첩 순서는?",
      choices: [
        "Page > Suspense > ErrorBoundary > Layout",
        "Layout > Suspense > ErrorBoundary > Page",
        "Layout > ErrorBoundary > Suspense > Page",
        "ErrorBoundary > Layout > Suspense > Page",
      ],
      correctIndex: 2,
      explanation:
        "Layout이 가장 바깥에서 감싸고, 그 안에 ErrorBoundary(error.tsx), 그 안에 Suspense(loading.tsx), 마지막으로 Page(page.tsx)가 렌더링됩니다.",
    },
    {
      id: "q4",
      question: "[...slug]와 [[...slug]]의 차이점은?",
      choices: [
        "차이가 없다, 같은 기능이다",
        "[...slug]는 최소 1개의 세그먼트가 필요하고, [[...slug]]는 0개도 허용한다",
        "[...slug]는 문자열만, [[...slug]]는 숫자만 매칭한다",
        "[[...slug]]는 중첩 라우트에서만 사용할 수 있다",
      ],
      correctIndex: 1,
      explanation:
        "[...slug]는 catch-all로 /shop/a, /shop/a/b는 매칭하지만 /shop은 매칭하지 않습니다. [[...slug]]는 optional catch-all로 /shop도 매칭합니다.",
    },
    {
      id: "q5",
      question: "error.tsx 파일에 'use client' 지시어가 필수인 이유는?",
      choices: [
        "스타일링을 위해 CSS-in-JS가 필요하기 때문",
        "ErrorBoundary는 클래스 컴포넌트 기반이며, reset 함수 등 클라이언트 상호작용이 필요하기 때문",
        "서버에서 에러가 발생하지 않기 때문",
        "Next.js의 제한 사항이며 기술적 이유는 없다",
      ],
      correctIndex: 1,
      explanation:
        "error.tsx는 React의 ErrorBoundary로 자동 래핑되는데, ErrorBoundary는 클라이언트에서만 동작합니다. 또한 사용자가 reset() 버튼을 클릭하는 등의 상호작용이 필요하므로 클라이언트 컴포넌트여야 합니다.",
    },
  ],
};

export default chapter;
