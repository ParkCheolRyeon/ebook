import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "35-migration-patterns",
  subject: "next",
  title: "Pages → App Router 마이그레이션",
  description:
    "Pages Router에서 App Router로 점진적으로 마이그레이션하는 전략을 학습합니다. 라우트별 마이그레이션 순서, 데이터 페칭 패턴 변환, 일반적인 함정과 해결법을 다룹니다.",
  order: 35,
  group: "아키텍처",
  prerequisites: ["34-large-scale-architecture"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Pages Router에서 App Router로의 마이그레이션은 **영업 중인 건물의 리모델링**과 같습니다.\n\n" +
        "건물(앱) 전체를 한번에 허물고 새로 짓는 것은 너무 위험합니다. 고객(사용자)은 공사 중에도 가게를 이용해야 합니다. 그래서 **층별로(라우트별로) 리모델링**합니다.\n\n" +
        "1층(마케팅 페이지)부터 시작합니다. 1층 공사 동안 2층(대시보드)과 3층(설정)은 기존 그대로 운영합니다. 1층 리모델링이 완료되면 2층으로 넘어갑니다.\n\n" +
        "핵심은 **공존**입니다. 리모델링된 1층(App Router)과 기존 2층(Pages Router)이 같은 건물에서 동시에 운영됩니다. 엘리베이터(라우팅)는 어느 층이든 갈 수 있고, 고객은 차이를 느끼지 못합니다.\n\n" +
        "주의할 점은 같은 층을 두 번 만들 수 없다는 것입니다. 1층을 리모델링했으면 기존 1층은 철거해야 합니다. 같은 경로를 Pages와 App 양쪽에 두면 충돌이 발생합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "기존 Pages Router 프로젝트를 App Router로 전환할 때 여러 난관이 있습니다.\n\n" +
        "1. **한번에 전환 불가** — 수십 개의 라우트를 한번에 App Router로 옮기면, 모든 데이터 페칭 패턴, 레이아웃, API가 동시에 변경됩니다. 에러가 발생했을 때 원인 파악이 불가능합니다.\n\n" +
        "2. **데이터 페칭 패턴 차이** — `getServerSideProps`는 Server Component의 async/await로, `getStaticProps`는 fetch + cache 패턴으로 바꿔야 합니다. 단순한 문법 변환이 아니라 멘탈 모델 자체가 다릅니다.\n\n" +
        "3. **_app.tsx → Root Layout 전환** — 전역 Provider(React Query, Theme, Auth)들이 `_app.tsx`에 중첩되어 있습니다. App Router에서는 Client Component 경계를 고려해야 합니다.\n\n" +
        "4. **API Routes → Route Handlers** — `req`/`res` 패턴이 `Request`/`Response` 웹 표준으로 바뀝니다. 미들웨어 체인이나 Express 스타일 패턴을 사용 중이었다면 재작성이 필요합니다.\n\n" +
        "5. **일반적인 함정** — Client Component에 \"use client\"를 빠뜨리거나, Server Component에서 훅을 사용하려 하거나, 기존 클라이언트 라이브러리가 Server Component와 호환되지 않는 문제들이 발생합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "점진적 마이그레이션 전략으로 안전하게 전환합니다.\n\n" +
        "### 1. 점진적 마이그레이션 원칙\n" +
        "Pages Router와 App Router는 같은 프로젝트에 공존할 수 있습니다. 새 기능은 App Router(`app/`)에 만들고, 기존 기능은 그대로 유지하면서 하나씩 옮깁니다.\n\n" +
        "### 2. 마이그레이션 순서\n" +
        "1) Root Layout 생성 (app/layout.tsx)\n" +
        "2) 정적 페이지부터 시작 (마케팅, About 등)\n" +
        "3) 동적 데이터 페이지 (블로그, 상품 목록)\n" +
        "4) 인증이 필요한 페이지 (대시보드)\n" +
        "5) API Routes → Route Handlers\n\n" +
        "### 3. 데이터 페칭 변환 규칙\n" +
        "- `getServerSideProps` → Server Component에서 직접 fetch\n" +
        "- `getStaticProps` → fetch + `{ cache: 'force-cache' }` 또는 `generateStaticParams`\n" +
        "- `getStaticPaths` → `generateStaticParams`\n\n" +
        "### 4. Provider 마이그레이션\n" +
        "`_app.tsx`의 Provider들을 별도 Client Component(`Providers.tsx`)로 분리하고, Root Layout에서 감싸줍니다.\n\n" +
        "### 5. 검증\n" +
        "각 라우트 마이그레이션 후 기존 동작과 동일한지 테스트합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 핵심 마이그레이션 패턴",
      content:
        "getServerSideProps에서 Server Component로의 전환, getStaticProps에서 캐시 fetch로의 전환, _app.tsx에서 Root Layout으로의 전환 패턴을 살펴봅니다. 각 변환은 데이터 흐름의 방향은 유지하면서 구현 방식만 App Router 패턴으로 바꿉니다.",
      code: {
        language: "typescript",
        code:
          '// === Before: getServerSideProps (Pages Router) ===\n' +
          '// pages/dashboard.tsx\n' +
          '// export const getServerSideProps: GetServerSideProps = async (ctx) => {\n' +
          '//   const session = await getSession(ctx.req);\n' +
          '//   if (!session) return { redirect: { destination: "/login" } };\n' +
          '//   const data = await fetchDashboard(session.userId);\n' +
          '//   return { props: { data, user: session.user } };\n' +
          '// };\n' +
          '\n' +
          '// === After: Server Component (App Router) ===\n' +
          '// app/dashboard/page.tsx\n' +
          'import { redirect } from "next/navigation";\n' +
          'import { getSession } from "@/lib/auth";\n' +
          'import { fetchDashboard } from "@/lib/api";\n' +
          'import DashboardClient from "./DashboardClient";\n' +
          '\n' +
          'export default async function DashboardPage() {\n' +
          '  const session = await getSession();\n' +
          '  if (!session) redirect("/login");\n' +
          '\n' +
          '  const data = await fetchDashboard(session.userId);\n' +
          '\n' +
          '  // 인터랙티브 부분만 Client Component로 분리\n' +
          '  return <DashboardClient data={data} user={session.user} />;\n' +
          '}\n' +
          '\n' +
          '// === Before: getStaticProps + getStaticPaths ===\n' +
          '// pages/blog/[slug].tsx\n' +
          '// export const getStaticPaths = async () => {\n' +
          '//   const posts = await getAllPosts();\n' +
          '//   return {\n' +
          '//     paths: posts.map(p => ({ params: { slug: p.slug } })),\n' +
          '//     fallback: "blocking",\n' +
          '//   };\n' +
          '// };\n' +
          '// export const getStaticProps = async ({ params }) => {\n' +
          '//   const post = await getPost(params.slug);\n' +
          '//   return { props: { post }, revalidate: 60 };\n' +
          '// };\n' +
          '\n' +
          '// === After: generateStaticParams + fetch ===\n' +
          '// app/blog/[slug]/page.tsx\n' +
          'import { getAllPosts, getPost } from "@/lib/posts";\n' +
          '\n' +
          'export async function generateStaticParams() {\n' +
          '  const posts = await getAllPosts();\n' +
          '  return posts.map((post) => ({ slug: post.slug }));\n' +
          '}\n' +
          '\n' +
          'export default async function BlogPost({\n' +
          '  params,\n' +
          '}: {\n' +
          '  params: Promise<{ slug: string }>;\n' +
          '}) {\n' +
          '  const { slug } = await params;\n' +
          '  const post = await getPost(slug);\n' +
          '\n' +
          '  return (\n' +
          '    <article>\n' +
          '      <h1>{post.title}</h1>\n' +
          '      <div>{post.content}</div>\n' +
          '    </article>\n' +
          '  );\n' +
          '}',
        description:
          "getServerSideProps → Server Component, getStaticProps/getStaticPaths → generateStaticParams 변환 패턴입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: _app.tsx와 API Routes 마이그레이션",
      content:
        "_app.tsx의 전역 Provider들을 App Router의 Root Layout으로 옮기려면, Provider를 별도의 Client Component로 분리해야 합니다. Root Layout 자체는 Server Component이므로 직접 Provider를 사용할 수 없기 때문입니다. API Routes의 req/res 패턴은 웹 표준 Request/Response로 변환합니다.",
      code: {
        language: "typescript",
        code:
          '// === Before: _app.tsx (Pages Router) ===\n' +
          '// pages/_app.tsx\n' +
          '// import { QueryClientProvider } from "@tanstack/react-query";\n' +
          '// import { ThemeProvider } from "next-themes";\n' +
          '// import { SessionProvider } from "next-auth/react";\n' +
          '//\n' +
          '// export default function App({ Component, pageProps }) {\n' +
          '//   return (\n' +
          '//     <SessionProvider session={pageProps.session}>\n' +
          '//       <QueryClientProvider client={queryClient}>\n' +
          '//         <ThemeProvider>\n' +
          '//           <Component {...pageProps} />\n' +
          '//         </ThemeProvider>\n' +
          '//       </QueryClientProvider>\n' +
          '//     </SessionProvider>\n' +
          '//   );\n' +
          '// }\n' +
          '\n' +
          '// === After: Providers 분리 + Root Layout ===\n' +
          '// app/providers.tsx\n' +
          '"use client";\n' +
          '\n' +
          'import { QueryClient, QueryClientProvider } from "@tanstack/react-query";\n' +
          'import { ThemeProvider } from "next-themes";\n' +
          'import { SessionProvider } from "next-auth/react";\n' +
          'import { useState } from "react";\n' +
          '\n' +
          'export default function Providers({\n' +
          '  children,\n' +
          '}: {\n' +
          '  children: React.ReactNode;\n' +
          '}) {\n' +
          '  const [queryClient] = useState(() => new QueryClient());\n' +
          '\n' +
          '  return (\n' +
          '    <SessionProvider>\n' +
          '      <QueryClientProvider client={queryClient}>\n' +
          '        <ThemeProvider attribute="class">\n' +
          '          {children}\n' +
          '        </ThemeProvider>\n' +
          '      </QueryClientProvider>\n' +
          '    </SessionProvider>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// app/layout.tsx — Root Layout (Server Component)\n' +
          'import Providers from "./providers";\n' +
          '\n' +
          'export default function RootLayout({\n' +
          '  children,\n' +
          '}: {\n' +
          '  children: React.ReactNode;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <html lang="ko">\n' +
          '      <body>\n' +
          '        <Providers>{children}</Providers>\n' +
          '      </body>\n' +
          '    </html>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === Before: API Route (Pages Router) ===\n' +
          '// pages/api/posts.ts\n' +
          '// export default function handler(req, res) {\n' +
          '//   if (req.method === "POST") {\n' +
          '//     const post = await db.post.create({ data: req.body });\n' +
          '//     return res.status(201).json(post);\n' +
          '//   }\n' +
          '//   res.status(405).end();\n' +
          '// }\n' +
          '\n' +
          '// === After: Route Handler (App Router) ===\n' +
          '// app/api/posts/route.ts\n' +
          'import { NextRequest, NextResponse } from "next/server";\n' +
          'import { db } from "@/lib/database";\n' +
          '\n' +
          'export async function POST(request: NextRequest) {\n' +
          '  const body = await request.json();\n' +
          '  const post = await db.post.create({ data: body });\n' +
          '\n' +
          '  return NextResponse.json(post, { status: 201 });\n' +
          '}',
        description:
          "_app.tsx의 Provider를 Client Component로 분리하여 Root Layout에 적용하고, API Routes를 Route Handlers로 변환합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| Pages Router | App Router | 변환 포인트 |\n" +
        "|-------------|------------|------------|\n" +
        "| getServerSideProps | Server Component async/await | props 전달 → 직접 렌더링 |\n" +
        "| getStaticProps | fetch + cache | revalidate → 동일 |\n" +
        "| getStaticPaths | generateStaticParams | 반환 형태 변경 |\n" +
        "| _app.tsx | layout.tsx + Providers | Client Component 분리 |\n" +
        "| _document.tsx | RootLayout의 html/body | 직접 JSX로 작성 |\n" +
        "| API Routes (req/res) | Route Handlers (Request/Response) | 웹 표준 API 사용 |\n\n" +
        "**핵심:** 마이그레이션은 한번에 하지 않고, 라우트 단위로 점진적으로 진행합니다. 정적 페이지 → 동적 페이지 → 인증 페이지 → API 순서로 옮기며, 두 라우터가 공존하므로 새 기능은 App Router에, 기존은 그대로 유지합니다.\n\n" +
        "**Next.js 섹션을 마치며:** 이것으로 Next.js 학습 여정을 마무리합니다. React 개발자에서 Next.js 풀스택 개발자로 성장하기 위한 모든 핵심 개념을 다루었습니다. 학습한 내용 중 약한 부분이 있다면, 해당 챕터로 돌아가 복습하시기 바랍니다. 특히 Server Components, 데이터 페칭, 캐싱은 App Router의 핵심이므로 충분히 이해해두세요.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Pages에서 App Router로의 마이그레이션은 한번에 하지 않고, 라우트 단위로 점진적으로 진행한다. 두 라우터는 공존할 수 있으므로 새 기능은 App Router에, 기존은 그대로 유지하면서 이전한다.",
  checklist: [
    "Pages Router와 App Router가 같은 프로젝트에서 공존할 수 있음을 이해한다",
    "getServerSideProps를 Server Component로 변환할 수 있다",
    "getStaticProps + getStaticPaths를 generateStaticParams로 변환할 수 있다",
    "_app.tsx의 Provider를 Client Component로 분리하여 Root Layout에 적용할 수 있다",
    "API Routes를 Route Handlers로 변환할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Pages Router에서 App Router로 마이그레이션할 때 권장되는 접근 방식은?",
      choices: [
        "모든 라우트를 한번에 전환한다",
        "라우트 단위로 점진적으로 전환한다",
        "새 프로젝트를 생성하고 코드를 옮긴다",
        "Pages Router를 먼저 삭제한 후 App Router를 작성한다",
      ],
      correctIndex: 1,
      explanation:
        "Pages Router와 App Router는 같은 프로젝트에서 공존할 수 있으므로, 라우트 단위로 하나씩 점진적으로 전환하는 것이 안전합니다.",
    },
    {
      id: "q2",
      question: "getServerSideProps의 App Router 대응 패턴은?",
      choices: [
        "getStaticProps로 변환한다",
        "useEffect에서 API를 호출한다",
        "Server Component에서 직접 async/await로 데이터를 가져온다",
        "Route Handler를 만들어 호출한다",
      ],
      correctIndex: 2,
      explanation:
        "App Router에서는 Server Component가 async 함수가 될 수 있으므로, getServerSideProps의 로직을 컴포넌트 내에서 직접 await로 실행합니다.",
    },
    {
      id: "q3",
      question: "_app.tsx의 Provider들을 App Router로 옮길 때 필요한 작업은?",
      choices: [
        "layout.tsx에 직접 Provider를 작성한다",
        "Provider를 'use client' Client Component로 분리하고 layout.tsx에서 감싼다",
        "middleware.ts에서 Provider를 설정한다",
        "Provider 사용을 포기한다",
      ],
      correctIndex: 1,
      explanation:
        "Root Layout은 Server Component이므로 useState가 필요한 Provider를 직접 사용할 수 없습니다. 'use client' Client Component로 분리하여 layout.tsx에서 감싸야 합니다.",
    },
    {
      id: "q4",
      question: "getStaticPaths에 해당하는 App Router 함수는?",
      choices: [
        "generateMetadata",
        "generateStaticParams",
        "getStaticProps",
        "dynamicParams",
      ],
      correctIndex: 1,
      explanation:
        "generateStaticParams는 getStaticPaths의 App Router 대응 함수로, 빌드 타임에 생성할 동적 라우트의 파라미터 목록을 반환합니다.",
    },
    {
      id: "q5",
      question: "마이그레이션 시 가장 먼저 전환하기 좋은 페이지 유형은?",
      choices: [
        "복잡한 인증 로직이 있는 대시보드",
        "실시간 데이터가 필요한 채팅 페이지",
        "마케팅 페이지나 About 같은 정적 페이지",
        "결제 흐름이 있는 페이지",
      ],
      correctIndex: 2,
      explanation:
        "정적 페이지는 데이터 페칭이 단순하고 상태 관리가 적어, 마이그레이션 리스크가 가장 낮습니다. 복잡한 페이지는 경험을 쌓은 후에 전환하는 것이 안전합니다.",
    },
  ],
};

export default chapter;
