import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "33-pages-router",
  subject: "next",
  title: "Pages Router 이해와 비교",
  description:
    "Next.js의 기존 라우팅 시스템인 Pages Router의 구조와 패턴을 학습합니다. getStaticProps, getServerSideProps, API Routes 등 핵심 개념과 App Router와의 비교를 다룹니다.",
  order: 33,
  group: "Pages Router",
  prerequisites: ["32-deployment"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Pages Router와 App Router의 차이는 **전통 레스토랑**과 **모던 키친**의 차이와 같습니다.\n\n" +
        "**Pages Router(전통 레스토랑)**에는 명확한 역할 분담이 있습니다. 홀 매니저(`_app.tsx`)가 모든 손님을 맞이하고, 인테리어 담당(`_document.tsx`)이 레스토랑 외관을 관리합니다. 주문이 들어오면 주방장이 재료를 준비하는 방식이 두 가지 — **미리 준비(getStaticProps)**하거나 **주문 즉시 조리(getServerSideProps)**합니다. 주방과 홀이 완전히 분리되어 있어, 주방에서 만든 음식을 홀로 전달하는 통로(API Routes)가 따로 있습니다.\n\n" +
        "**App Router(모던 키친)**는 오픈 키친입니다. 셰프가 손님 앞에서 바로 요리(Server Component)하고, 일부 메뉴는 손님이 직접 마무리(Client Component)합니다. 레이아웃은 중첩 구조로 유연하고, 주방 통로(Route Handlers) 대신 셰프가 직접 재료(DB)에 접근합니다.\n\n" +
        "두 레스토랑 모두 맛있는 음식을 만들 수 있지만, 운영 방식이 다릅니다. 중요한 건, 같은 건물에서 **두 레스토랑을 동시에 운영**할 수 있다는 것입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React 개발자가 Next.js 생태계에 진입하면 Pages Router 코드를 반드시 만나게 됩니다.\n\n" +
        "1. **레거시 코드 이해** — 수많은 Next.js 프로젝트, 블로그 포스트, 강의가 Pages Router 기반입니다. 기존 프로젝트에 합류하면 Pages Router 코드를 읽고 수정해야 합니다.\n\n" +
        "2. **데이터 페칭 패턴 차이** — Pages Router는 `getStaticProps`/`getServerSideProps`라는 별도의 함수로 데이터를 페칭합니다. App Router의 Server Component async 패턴과 완전히 다른 멘탈 모델입니다.\n\n" +
        "3. **레이아웃 한계** — `_app.tsx`는 전역 레이아웃만 가능하고, 중첩 레이아웃이 네이티브로 지원되지 않습니다. 이로 인해 레이아웃 전환 시 상태가 초기화되는 문제가 있었습니다.\n\n" +
        "4. **혼용 시 혼란** — Pages Router와 App Router를 같은 프로젝트에서 혼용할 수 있지만, 같은 경로를 중복 정의하면 충돌이 발생합니다. 어떤 기능이 어느 라우터에서 동작하는지 구분해야 합니다.\n\n" +
        "5. **마이그레이션 판단** — 기존 Pages Router 프로젝트를 App Router로 전환할지, 유지할지 판단하려면 두 라우터의 장단점을 정확히 알아야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Pages Router의 핵심 개념을 이해하고, App Router와 비교하여 각각의 적합한 사용 시나리오를 파악합니다.\n\n" +
        "### 1. pages/ 디렉토리 구조\n" +
        "Pages Router는 `pages/` 디렉토리 안의 파일이 곧 라우트입니다. `pages/about.tsx` → `/about`, `pages/blog/[slug].tsx` → `/blog/:slug`로 매핑됩니다.\n\n" +
        "### 2. 데이터 페칭 함수\n" +
        "- `getStaticProps`: 빌드 타임에 데이터를 가져와 정적 페이지를 생성합니다 (SSG)\n" +
        "- `getServerSideProps`: 매 요청마다 서버에서 데이터를 가져옵니다 (SSR)\n" +
        "- `getStaticPaths`: 동적 라우트의 경로 목록을 빌드 타임에 결정합니다\n\n" +
        "### 3. 특수 파일\n" +
        "- `_app.tsx`: 모든 페이지를 감싸는 전역 레이아웃, 전역 상태/스타일 관리\n" +
        "- `_document.tsx`: HTML 문서 구조(`<html>`, `<body>`) 커스터마이징\n\n" +
        "### 4. API Routes\n" +
        "`pages/api/` 디렉토리에 API 엔드포인트를 생성합니다. `req`/`res` 객체를 사용하며, Express와 유사한 패턴입니다.\n\n" +
        "### 5. 공존 가능\n" +
        "같은 프로젝트에서 `pages/`와 `app/`이 공존할 수 있습니다. 같은 경로만 중복되지 않으면 됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Pages Router 핵심 패턴",
      content:
        "Pages Router의 데이터 페칭은 페이지 컴포넌트 파일에서 getStaticProps나 getServerSideProps를 export하는 방식입니다. 이 함수들은 서버에서만 실행되며, 반환값이 컴포넌트의 props로 전달됩니다. App Router의 Server Component와 달리 데이터 페칭과 렌더링이 분리되어 있습니다.",
      code: {
        language: "typescript",
        code:
          '// pages/blog/[slug].tsx — Pages Router 동적 라우트\n' +
          'import type {\n' +
          '  GetStaticPaths,\n' +
          '  GetStaticProps,\n' +
          '  InferGetStaticPropsType,\n' +
          '} from "next";\n' +
          '\n' +
          'interface Post {\n' +
          '  slug: string;\n' +
          '  title: string;\n' +
          '  content: string;\n' +
          '}\n' +
          '\n' +
          '// 1. 빌드 타임에 생성할 경로 목록 결정\n' +
          'export const getStaticPaths: GetStaticPaths = async () => {\n' +
          '  const res = await fetch("https://api.example.com/posts");\n' +
          '  const posts: Post[] = await res.json();\n' +
          '\n' +
          '  return {\n' +
          '    paths: posts.map((post) => ({\n' +
          '      params: { slug: post.slug },\n' +
          '    })),\n' +
          '    fallback: "blocking", // 없는 경로는 SSR로 처리\n' +
          '  };\n' +
          '};\n' +
          '\n' +
          '// 2. 빌드 타임에 데이터 페칭 (SSG)\n' +
          'export const getStaticProps: GetStaticProps<{\n' +
          '  post: Post;\n' +
          '}> = async ({ params }) => {\n' +
          '  const res = await fetch(\n' +
          '    `https://api.example.com/posts/${params?.slug}`\n' +
          '  );\n' +
          '  const post: Post = await res.json();\n' +
          '\n' +
          '  return {\n' +
          '    props: { post },\n' +
          '    revalidate: 60, // ISR: 60초마다 재생성\n' +
          '  };\n' +
          '};\n' +
          '\n' +
          '// 3. 컴포넌트는 props로 데이터를 받음\n' +
          'export default function BlogPost({\n' +
          '  post,\n' +
          '}: InferGetStaticPropsType<typeof getStaticProps>) {\n' +
          '  return (\n' +
          '    <article>\n' +
          '      <h1>{post.title}</h1>\n' +
          '      <div>{post.content}</div>\n' +
          '    </article>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// pages/dashboard.tsx — SSR 예시\n' +
          'import type { GetServerSideProps } from "next";\n' +
          '\n' +
          'export const getServerSideProps: GetServerSideProps = async (\n' +
          '  context\n' +
          ') => {\n' +
          '  const token = context.req.cookies.token;\n' +
          '  if (!token) {\n' +
          '    return { redirect: { destination: "/login", permanent: false } };\n' +
          '  }\n' +
          '\n' +
          '  const user = await fetchUser(token);\n' +
          '  return { props: { user } };\n' +
          '};',
        description:
          "Pages Router의 getStaticPaths, getStaticProps(SSG), getServerSideProps(SSR) 패턴을 보여줍니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: API Routes와 _app.tsx",
      content:
        "Pages Router의 API Routes는 pages/api/ 디렉토리에 파일을 생성하여 서버리스 API 엔드포인트를 만듭니다. Express와 유사한 req/res 패턴을 사용하며, App Router의 Route Handlers(Request/Response)와 다릅니다. _app.tsx는 모든 페이지를 감싸는 전역 레이아웃으로, 전역 상태와 스타일을 관리합니다.",
      code: {
        language: "typescript",
        code:
          '// pages/api/posts.ts — API Route\n' +
          'import type { NextApiRequest, NextApiResponse } from "next";\n' +
          '\n' +
          'interface Post {\n' +
          '  id: string;\n' +
          '  title: string;\n' +
          '}\n' +
          '\n' +
          'export default async function handler(\n' +
          '  req: NextApiRequest,\n' +
          '  res: NextApiResponse<Post[] | { error: string }>\n' +
          ') {\n' +
          '  if (req.method === "GET") {\n' +
          '    const posts = await db.post.findMany();\n' +
          '    return res.status(200).json(posts);\n' +
          '  }\n' +
          '\n' +
          '  if (req.method === "POST") {\n' +
          '    const { title } = req.body;\n' +
          '    const post = await db.post.create({ data: { title } });\n' +
          '    return res.status(201).json(post);\n' +
          '  }\n' +
          '\n' +
          '  res.setHeader("Allow", ["GET", "POST"]);\n' +
          '  res.status(405).json({ error: "Method Not Allowed" });\n' +
          '}\n' +
          '\n' +
          '// pages/_app.tsx — 전역 레이아웃\n' +
          'import type { AppProps } from "next/app";\n' +
          'import "@/styles/globals.css";\n' +
          'import { QueryClient, QueryClientProvider } from "@tanstack/react-query";\n' +
          'import Layout from "@/components/Layout";\n' +
          '\n' +
          'const queryClient = new QueryClient();\n' +
          '\n' +
          'export default function App({ Component, pageProps }: AppProps) {\n' +
          '  return (\n' +
          '    <QueryClientProvider client={queryClient}>\n' +
          '      <Layout>\n' +
          '        <Component {...pageProps} />\n' +
          '      </Layout>\n' +
          '    </QueryClientProvider>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// pages/_document.tsx — HTML 문서 커스터마이징\n' +
          'import { Html, Head, Main, NextScript } from "next/document";\n' +
          '\n' +
          'export default function Document() {\n' +
          '  return (\n' +
          '    <Html lang="ko">\n' +
          '      <Head>\n' +
          '        <link rel="icon" href="/favicon.ico" />\n' +
          '      </Head>\n' +
          '      <body>\n' +
          '        <Main />\n' +
          '        <NextScript />\n' +
          '      </body>\n' +
          '    </Html>\n' +
          '  );\n' +
          '}',
        description:
          "Pages Router의 API Routes(req/res 패턴), _app.tsx(전역 레이아웃), _document.tsx(HTML 구조) 패턴입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 항목 | Pages Router | App Router |\n" +
        "|------|-------------|------------|\n" +
        "| 디렉토리 | pages/ | app/ |\n" +
        "| 데이터 페칭 | getStaticProps, getServerSideProps | Server Component (async/await) |\n" +
        "| 레이아웃 | _app.tsx (전역만) | layout.tsx (중첩 가능) |\n" +
        "| API | pages/api/ (req/res) | app/api/ (Request/Response) |\n" +
        "| 컴포넌트 | 모두 Client Component | 기본 Server Component |\n" +
        "| HTML 커스텀 | _document.tsx | RootLayout |\n" +
        "| 스트리밍 | 미지원 | Suspense 기반 지원 |\n\n" +
        "**핵심:** Pages Router는 `getStaticProps`/`getServerSideProps`로 데이터를 페칭하고, `pages/` 폴더 기반으로 라우팅합니다. App Router와 혼용 가능하지만, 새 프로젝트는 App Router를 권장합니다. 기존 코드베이스를 이해하기 위해 Pages Router 패턴을 알아둬야 합니다.\n\n" +
        "**다음 챕터 미리보기:** 대규모 Next.js 프로젝트를 위한 폴더 구조, 모노레포, 성능 모니터링 등 아키텍처 전략을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Pages Router는 getStaticProps/getServerSideProps로 데이터를 페칭하고, pages/ 폴더 기반으로 라우팅한다. App Router와 혼용 가능하지만, 새 프로젝트는 App Router를 권장한다.",
  checklist: [
    "getStaticProps와 getServerSideProps의 차이를 설명할 수 있다",
    "getStaticPaths의 역할과 fallback 옵션을 이해한다",
    "_app.tsx와 _document.tsx의 역할을 구분할 수 있다",
    "API Routes(pages/api/)의 패턴을 이해한다",
    "Pages Router와 App Router의 공존 방법과 제약을 안다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Pages Router에서 매 요청마다 서버에서 데이터를 가져오는 함수는?",
      choices: [
        "getStaticProps",
        "getServerSideProps",
        "getStaticPaths",
        "getInitialProps",
      ],
      correctIndex: 1,
      explanation:
        "getServerSideProps는 매 요청(request)마다 서버에서 실행되어 데이터를 가져옵니다. getStaticProps는 빌드 타임에 실행됩니다.",
    },
    {
      id: "q2",
      question: "Pages Router의 _app.tsx의 역할은?",
      choices: [
        "HTML 문서 구조를 정의한다",
        "API 엔드포인트를 생성한다",
        "모든 페이지를 감싸는 전역 레이아웃과 상태를 관리한다",
        "정적 파일을 서빙한다",
      ],
      correctIndex: 2,
      explanation:
        "_app.tsx는 모든 페이지 컴포넌트를 감싸는 최상위 컴포넌트로, 전역 CSS, 전역 상태 Provider, 공통 레이아웃을 설정합니다.",
    },
    {
      id: "q3",
      question: "Pages Router와 App Router를 같은 프로젝트에서 사용할 때 주의할 점은?",
      choices: [
        "절대 함께 사용할 수 없다",
        "같은 경로를 중복 정의하면 충돌이 발생한다",
        "Pages Router가 항상 우선순위를 갖는다",
        "App Router가 자동으로 Pages Router를 비활성화한다",
      ],
      correctIndex: 1,
      explanation:
        "pages/와 app/ 디렉토리는 공존할 수 있지만, 같은 URL 경로를 양쪽에서 정의하면 빌드 에러가 발생합니다.",
    },
    {
      id: "q4",
      question: "App Router의 Server Component에 해당하는 Pages Router의 패턴은?",
      choices: [
        "_app.tsx에서 데이터를 가져온다",
        "useEffect에서 API를 호출한다",
        "getStaticProps 또는 getServerSideProps에서 데이터를 가져와 props로 전달한다",
        "API Routes에서 데이터를 가져온다",
      ],
      correctIndex: 2,
      explanation:
        "Pages Router에서는 getStaticProps/getServerSideProps가 서버에서 데이터를 가져와 컴포넌트에 props로 전달합니다. App Router에서는 Server Component가 직접 async/await로 데이터를 가져옵니다.",
    },
    {
      id: "q5",
      question: "Pages Router의 API Routes와 App Router의 Route Handlers의 차이는?",
      choices: [
        "API Routes는 req/res 객체, Route Handlers는 Request/Response 웹 표준 API를 사용한다",
        "둘은 완전히 동일한 API를 사용한다",
        "Route Handlers는 GET만 지원한다",
        "API Routes는 TypeScript를 지원하지 않는다",
      ],
      correctIndex: 0,
      explanation:
        "Pages Router의 API Routes는 Node.js의 req/res 패턴(Express 스타일)을, App Router의 Route Handlers는 웹 표준 Request/Response API를 사용합니다.",
    },
  ],
};

export default chapter;
