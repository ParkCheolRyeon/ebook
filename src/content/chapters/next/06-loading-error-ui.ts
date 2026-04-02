import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "06-loading-error-ui",
  subject: "next",
  title: "로딩·에러·404 UI",
  description:
    "loading.tsx(Suspense), error.tsx(ErrorBoundary), not-found.tsx(404), global-error.tsx의 역할과 스코프, 파일 위치에 따른 적용 범위를 학습합니다.",
  order: 6,
  group: "기초",
  prerequisites: ["05-navigation"],
  estimatedMinutes: 22,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Next.js의 로딩/에러/404 파일 규약은 **건물의 안전 시스템**과 같습니다.\n\n" +
        "**loading.tsx**는 **엘리베이터 층 표시등**입니다. 5층에서 12층으로 이동할 때, " +
        "현재 몇 층인지 표시해주는 안내판이 있으면 승객은 '아, 이동 중이구나'라고 안심합니다. " +
        "loading.tsx는 데이터를 가져오는 동안 사용자에게 '로딩 중'이라는 피드백을 자동으로 제공합니다.\n\n" +
        "**error.tsx**는 **층별 소화기**입니다. 3층에서 불(에러)이 나도 소화기(error.tsx)가 " +
        "3층에서 진압하므로 4층, 5층(부모 레이아웃)은 영향을 받지 않습니다. " +
        "'다시 시도' 버튼(reset 함수)은 소화 후 복구 버튼과 같습니다.\n\n" +
        "**not-found.tsx**는 **'해당 호실 없음' 안내문**입니다. 존재하지 않는 1503호를 찾아온 방문객에게 " +
        "'이 호실은 없습니다. 안내 데스크로 가세요'라고 알려줍니다.\n\n" +
        "**global-error.tsx**는 **건물 전체 비상 시스템**입니다. Root Layout 자체가 고장났을 때 " +
        "(건물 기초가 무너졌을 때) 작동하는 최후의 안전장치입니다. 자체 `<html>`과 `<body>`를 가져야 합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "사용자 경험에서 로딩 상태와 에러 처리는 매우 중요하지만, 일관되게 구현하기가 어렵습니다.\n\n" +
        "### 1. 로딩 상태의 일관성 부재\n" +
        "각 페이지마다 로딩 스피너를 개별적으로 구현합니다. 어떤 페이지는 스켈레톤 UI를 보여주고, " +
        "어떤 페이지는 아무것도 안 보여주고, 어떤 페이지는 '로딩 중...' 텍스트만 보여줍니다. " +
        "팀 내에서 로딩 UI 표준이 없으면 사용자 경험이 불일치합니다.\n\n" +
        "### 2. Suspense/ErrorBoundary 수동 배치\n" +
        "React의 Suspense와 ErrorBoundary를 어디에 얼마나 세밀하게 배치할지 매번 결정해야 합니다. " +
        "너무 넓으면 한 곳의 에러가 전체를 깨뜨리고, 너무 세밀하면 보일러플레이트가 넘칩니다.\n\n" +
        "### 3. 에러 복구 메커니즘\n" +
        "에러가 발생했을 때 사용자가 할 수 있는 것이 '새로고침'뿐이라면 경험이 나쁩니다. " +
        "해당 영역만 다시 시도할 수 있는 복구 메커니즘이 필요하지만, 직접 구현하려면 상태 관리가 복잡해집니다.\n\n" +
        "### 4. 404 처리의 분산\n" +
        "존재하지 않는 동적 라우트(예: 삭제된 블로그 포스트)에 대한 404 처리를 각 페이지에서 " +
        "개별적으로 해야 합니다. 전역 404와 특정 라우트의 404를 다르게 보여주기도 어렵습니다.\n\n" +
        "### 5. Root Layout 에러 처리\n" +
        "Root Layout에서 에러가 발생하면 error.tsx가 잡을 수 없습니다. " +
        "error.tsx는 같은 레벨의 layout 안에서 렌더링되기 때문입니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js는 파일 규약으로 로딩, 에러, 404를 **자동화**합니다.\n\n" +
        "### loading.tsx — 자동 Suspense 래핑\n" +
        "- 해당 폴더의 `page.tsx`를 자동으로 `<Suspense>` 로 감싸줌\n" +
        "- `loading.tsx`가 fallback UI가 됨\n" +
        "- 서버 컴포넌트의 async 데이터 페칭 동안 즉시 표시\n" +
        "- 같은 layout 내에서 **즉각적인 네비게이션** 제공 (loading UI가 보이는 동안 layout은 인터랙티브)\n\n" +
        "### error.tsx — 자동 ErrorBoundary 래핑\n" +
        "- 해당 폴더의 `page.tsx`를 자동으로 `<ErrorBoundary>` 로 감싸줌\n" +
        "- **반드시 `'use client'` 지시어** 필요 (ErrorBoundary는 클라이언트에서만 동작)\n" +
        "- `error` prop으로 에러 정보, `reset` prop으로 복구 함수 제공\n" +
        "- 에러가 부모 layout까지 전파되지 않음 (해당 범위에서 격리)\n\n" +
        "### not-found.tsx\n" +
        "- `app/not-found.tsx`는 전역 404 페이지\n" +
        "- 특정 라우트 폴더에도 배치 가능 (예: `app/blog/[slug]/not-found.tsx`)\n" +
        "- 서버 컴포넌트에서 `notFound()` 함수를 호출하면 해당 not-found.tsx 표시\n\n" +
        "### global-error.tsx\n" +
        "- **Root Layout**에서 발생한 에러를 처리하는 최후의 안전장치\n" +
        "- 자체 `<html>`과 `<body>` 태그를 포함해야 함 (Root Layout이 깨졌으므로)\n" +
        "- 프로덕션 환경에서만 활성화",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 특수 파일의 자동 래핑 구조",
      content:
        "Next.js가 특수 파일들을 어떻게 자동으로 React 컴포넌트 트리에 배치하는지, " +
        "그리고 각 파일의 위치에 따라 에러 격리 범위가 어떻게 달라지는지 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// Next.js가 내부적으로 만드는 컴포넌트 트리:\n' +
          '//\n' +
          '// <Layout>                    ← layout.tsx\n' +
          '//   <Template>               ← template.tsx (있으면)\n' +
          '//     <ErrorBoundary          ← error.tsx\n' +
          '//       fallback={<Error />}\n' +
          '//     >\n' +
          '//       <Suspense             ← loading.tsx\n' +
          '//         fallback={<Loading />}\n' +
          '//       >\n' +
          '//         <Page />            ← page.tsx\n' +
          '//       </Suspense>\n' +
          '//     </ErrorBoundary>\n' +
          '//   </Template>\n' +
          '// </Layout>\n\n' +
          '// === 에러 격리 범위 예시 ===\n' +
          '//\n' +
          '// app/\n' +
          '// ├── layout.tsx          ← ❌ 이 layout의 에러는 error.tsx가 잡을 수 없음\n' +
          '// ├── error.tsx           ← 이 ErrorBoundary는 layout "안"에서 렌더됨\n' +
          '// ├── page.tsx            ← ✅ 이 page의 에러는 error.tsx가 잡음\n' +
          '// └── dashboard/\n' +
          '//     ├── layout.tsx      ← ✅ 이 layout의 에러는 상위 error.tsx가 잡음\n' +
          '//     ├── error.tsx       ← dashboard 범위의 ErrorBoundary\n' +
          '//     └── page.tsx        ← ✅ dashboard/error.tsx가 잡음\n\n' +
          '// 핵심: error.tsx는 같은 폴더의 layout.tsx 에러를 잡을 수 없다!\n' +
          '// → layout.tsx 에러를 잡으려면 "상위" 폴더의 error.tsx가 필요\n\n' +
          '// === global-error.tsx (Root Layout 에러 처리) ===\n' +
          '"use client";\n\n' +
          'export default function GlobalError({\n' +
          '  error,\n' +
          '  reset,\n' +
          '}: {\n' +
          '  error: Error & { digest?: string };\n' +
          '  reset: () => void;\n' +
          '}) {\n' +
          '  // Root Layout이 깨졌으므로 자체 html, body 필요\n' +
          '  return (\n' +
          '    <html>\n' +
          '      <body>\n' +
          '        <h2>심각한 오류가 발생했습니다</h2>\n' +
          '        <button onClick={reset}>다시 시도</button>\n' +
          '      </body>\n' +
          '    </html>\n' +
          '  );\n' +
          '}',
        description:
          "error.tsx는 같은 폴더의 layout.tsx 에러를 잡을 수 없습니다. layout 에러를 잡으려면 상위 폴더의 error.tsx가 필요하고, Root Layout 에러는 global-error.tsx가 처리합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 로딩·에러·404 통합 구현",
      content:
        "블로그 상세 페이지에서 로딩 스켈레톤, 에러 복구 UI, 404 처리를 통합 구현합니다. " +
        "서버 컴포넌트에서 notFound()를 호출하는 패턴과, error.tsx에서 reset으로 복구하는 패턴을 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// 파일 구조:\n' +
          '// app/blog/[slug]/\n' +
          '//   ├── page.tsx\n' +
          '//   ├── loading.tsx\n' +
          '//   ├── error.tsx\n' +
          '//   └── not-found.tsx\n\n' +
          '// === app/blog/[slug]/loading.tsx ===\n' +
          'export default function BlogPostLoading() {\n' +
          '  return (\n' +
          '    <article className="animate-pulse">\n' +
          '      {/* 스켈레톤 UI */}\n' +
          '      <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />\n' +
          '      <div className="h-4 bg-gray-200 rounded w-1/4 mb-8" />\n' +
          '      <div className="space-y-3">\n' +
          '        <div className="h-4 bg-gray-200 rounded" />\n' +
          '        <div className="h-4 bg-gray-200 rounded" />\n' +
          '        <div className="h-4 bg-gray-200 rounded w-5/6" />\n' +
          '      </div>\n' +
          '    </article>\n' +
          '  );\n' +
          '}\n\n' +
          '// === app/blog/[slug]/page.tsx ===\n' +
          'import { notFound } from "next/navigation";\n\n' +
          'interface Props {\n' +
          '  params: Promise<{ slug: string }>;\n' +
          '}\n\n' +
          'async function getPost(slug: string) {\n' +
          '  const res = await fetch(\n' +
          '    `https://api.example.com/posts/${slug}`,\n' +
          '    { next: { revalidate: 60 } }\n' +
          '  );\n\n' +
          '  if (res.status === 404) return null;\n' +
          '  if (!res.ok) throw new Error("포스트를 불러오는 데 실패했습니다");\n\n' +
          '  return res.json();\n' +
          '}\n\n' +
          'export default async function BlogPostPage({ params }: Props) {\n' +
          '  const { slug } = await params;\n' +
          '  const post = await getPost(slug);\n\n' +
          '  if (!post) {\n' +
          '    notFound(); // → not-found.tsx 표시\n' +
          '  }\n\n' +
          '  return (\n' +
          '    <article>\n' +
          '      <h1>{post.title}</h1>\n' +
          '      <time>{post.publishedAt}</time>\n' +
          '      <div dangerouslySetInnerHTML={{ __html: post.content }} />\n' +
          '    </article>\n' +
          '  );\n' +
          '}\n\n' +
          '// === app/blog/[slug]/error.tsx ===\n' +
          '"use client";\n' +
          'import { useEffect } from "react";\n\n' +
          'export default function BlogPostError({\n' +
          '  error,\n' +
          '  reset,\n' +
          '}: {\n' +
          '  error: Error & { digest?: string };\n' +
          '  reset: () => void;\n' +
          '}) {\n' +
          '  useEffect(() => {\n' +
          '    // 에러 로깅 서비스에 전송\n' +
          '    console.error("Blog post error:", error);\n' +
          '  }, [error]);\n\n' +
          '  return (\n' +
          '    <div className="text-center py-10">\n' +
          '      <h2 className="text-xl font-bold mb-4">\n' +
          '        포스트를 불러올 수 없습니다\n' +
          '      </h2>\n' +
          '      <p className="text-gray-600 mb-6">{error.message}</p>\n' +
          '      <button\n' +
          '        onClick={reset}\n' +
          '        className="px-4 py-2 bg-blue-600 text-white rounded"\n' +
          '      >\n' +
          '        다시 시도\n' +
          '      </button>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// === app/blog/[slug]/not-found.tsx ===\n' +
          'import Link from "next/link";\n\n' +
          'export default function BlogPostNotFound() {\n' +
          '  return (\n' +
          '    <div className="text-center py-10">\n' +
          '      <h2 className="text-xl font-bold mb-4">\n' +
          '        포스트를 찾을 수 없습니다\n' +
          '      </h2>\n' +
          '      <p className="text-gray-600 mb-6">\n' +
          '        삭제되었거나 주소가 잘못되었을 수 있습니다.\n' +
          '      </p>\n' +
          '      <Link\n' +
          '        href="/blog"\n' +
          '        className="text-blue-600 underline"\n' +
          '      >\n' +
          '        블로그 목록으로 돌아가기\n' +
          '      </Link>\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "loading.tsx는 데이터 로딩 중 스켈레톤을 보여주고, 서버에서 notFound()를 호출하면 not-found.tsx가, 에러가 발생하면 error.tsx가 자동으로 표시됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 파일 | 래핑하는 React 기능 | 필수 지시어 | 주요 prop |\n" +
        "|------|------|------|------|\n" +
        "| `loading.tsx` | `<Suspense>` | 없음 | 없음 |\n" +
        "| `error.tsx` | `<ErrorBoundary>` | `'use client'` | `error`, `reset` |\n" +
        "| `not-found.tsx` | 없음 (notFound() 호출 시 표시) | 없음 | 없음 |\n" +
        "| `global-error.tsx` | Root Layout ErrorBoundary | `'use client'` | `error`, `reset` |\n\n" +
        "| 스코프 규칙 | 설명 |\n" +
        "|------|------|\n" +
        "| error.tsx 범위 | 같은 폴더의 page.tsx와 하위 라우트의 에러를 잡음 |\n" +
        "| error.tsx 제한 | 같은 폴더의 layout.tsx 에러는 잡을 수 없음 |\n" +
        "| layout 에러 처리 | 상위 폴더의 error.tsx가 처리 |\n" +
        "| Root Layout 에러 | global-error.tsx가 처리 |\n\n" +
        "**핵심:** `loading.tsx`, `error.tsx`, `not-found.tsx`는 각각 Suspense, ErrorBoundary, 404 처리를 " +
        "파일 규약으로 자동화한다. 폴더 위치에 따라 해당 라우트 범위에서만 적용된다.\n\n" +
        "**다음 챕터 미리보기:** React Server Components의 개념과 동작 원리, " +
        "서버에서 실행되는 컴포넌트가 어떻게 성능과 보안을 향상시키는지 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "loading.tsx, error.tsx, not-found.tsx는 각각 Suspense, ErrorBoundary, 404 처리를 파일 규약으로 자동화한다. 폴더 위치에 따라 해당 라우트 범위에서만 적용된다.",
  checklist: [
    "loading.tsx가 Suspense 경계를 자동 생성하는 원리를 이해한다",
    "error.tsx에 'use client'가 필수인 이유와 reset 함수의 동작을 설명할 수 있다",
    "error.tsx가 같은 폴더의 layout.tsx 에러를 잡을 수 없는 이유를 이해한다",
    "notFound() 함수와 not-found.tsx의 관계를 설명할 수 있다",
    "global-error.tsx가 자체 <html>, <body>를 가져야 하는 이유를 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "loading.tsx가 내부적으로 래핑하는 React 기능은?",
      choices: [
        "ErrorBoundary",
        "Suspense",
        "StrictMode",
        "Profiler",
      ],
      correctIndex: 1,
      explanation:
        "loading.tsx는 해당 라우트의 page.tsx를 React의 <Suspense> 컴포넌트로 자동 래핑합니다. loading.tsx의 내용이 Suspense의 fallback이 됩니다.",
    },
    {
      id: "q2",
      question:
        "app/dashboard/error.tsx는 어떤 에러를 잡을 수 없나요?",
      choices: [
        "app/dashboard/page.tsx의 에러",
        "app/dashboard/settings/page.tsx의 에러",
        "app/dashboard/layout.tsx의 에러",
        "app/dashboard/analytics/page.tsx의 에러",
      ],
      correctIndex: 2,
      explanation:
        "error.tsx는 같은 폴더의 layout.tsx 에러를 잡을 수 없습니다. ErrorBoundary가 Layout 안에서 렌더되기 때문입니다. dashboard/layout.tsx의 에러를 잡으려면 상위(app/error.tsx)가 필요합니다.",
    },
    {
      id: "q3",
      question: "서버 컴포넌트에서 존재하지 않는 리소스를 처리하는 올바른 방법은?",
      choices: [
        "throw new Error('Not Found')",
        "return <NotFoundPage />",
        "import { notFound } from 'next/navigation'; notFound();",
        "redirect('/404')",
      ],
      correctIndex: 2,
      explanation:
        "next/navigation의 notFound() 함수를 호출하면 가장 가까운 not-found.tsx가 표시됩니다. Error를 throw하면 error.tsx가 표시되어 404와 구분되지 않습니다.",
    },
    {
      id: "q4",
      question: "global-error.tsx에 대한 설명으로 틀린 것은?",
      choices: [
        "'use client' 지시어가 필요하다",
        "자체 <html>과 <body> 태그를 포함해야 한다",
        "개발 환경과 프로덕션 환경 모두에서 동일하게 동작한다",
        "Root Layout의 에러를 처리한다",
      ],
      correctIndex: 2,
      explanation:
        "global-error.tsx는 프로덕션 환경에서만 활성화됩니다. 개발 환경에서는 에러 오버레이가 대신 표시되어 디버깅을 돕습니다.",
    },
    {
      id: "q5",
      question:
        "error.tsx의 reset 함수를 호출하면 어떤 일이 발생하나요?",
      choices: [
        "브라우저가 전체 새로고침된다",
        "에러가 발생한 라우트 세그먼트를 다시 렌더링한다",
        "이전 페이지로 돌아간다",
        "에러 로그를 서버에 전송한다",
      ],
      correctIndex: 1,
      explanation:
        "reset()은 ErrorBoundary의 상태를 초기화하고 해당 라우트 세그먼트의 리렌더를 시도합니다. 전체 새로고침 없이 해당 영역만 복구를 시도하므로, 일시적 오류인 경우 정상 동작이 복원됩니다.",
    },
  ],
};

export default chapter;
