import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "15-dynamic-routes",
  subject: "next",
  title: "동적 라우트",
  description:
    "[slug] 단일 동적 세그먼트, [...slug] catch-all, [[...slug]] optional catch-all, params 타입, generateStaticParams, dynamicParams 설정, 동적 라우트 메타데이터를 학습합니다.",
  order: 15,
  group: "라우팅 심화",
  prerequisites: ["14-streaming-suspense"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "동적 라우트는 **호텔 객실 번호 시스템**과 비슷합니다.\n\n" +
        "**[slug] 단일 동적 세그먼트**는 '301호', '302호'처럼 하나의 번호로 특정 방을 가리키는 것입니다. `/blog/hello-world`에서 `hello-world`가 그 방 번호입니다. 정확히 하나의 값만 매칭됩니다.\n\n" +
        "**[...slug] catch-all**은 '3층 전체'를 가리키는 것입니다. `/docs/getting-started/installation/mac`처럼 여러 세그먼트를 모두 잡아냅니다. 3층의 어느 방이든, 복도든 모두 해당됩니다. 단, 최소 하나의 세그먼트는 있어야 합니다.\n\n" +
        "**[[...slug]] optional catch-all**은 '3층 전체 + 3층 로비'입니다. 세그먼트가 없는 경우(로비 = `/docs`)까지 포함합니다. 가장 유연한 방식입니다.\n\n" +
        "**generateStaticParams**는 체크인 전 미리 객실을 준비해두는 것입니다. 어떤 객실 번호가 사용될지 미리 알려주면, 손님이 도착하기 전에 객실을 미리 세팅해둡니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "웹 애플리케이션에서는 URL에 따라 다른 콘텐츠를 보여줘야 하는 경우가 매우 많습니다.\n\n" +
        "1. **수천 개의 동일 구조 페이지** — 블로그 글, 상품 상세, 사용자 프로필 등 구조는 같지만 데이터가 다른 페이지를 일일이 파일로 만들 수 없습니다.\n\n" +
        "2. **계층적 URL 구조** — `/docs/react/hooks/useState`처럼 깊이가 가변적인 문서 구조를 하나의 라우트로 처리해야 합니다.\n\n" +
        "3. **선택적 경로** — `/shop`과 `/shop/clothing/shirts`를 같은 페이지 컴포넌트로 처리하고 싶지만, 일반 catch-all은 루트 경로를 매칭하지 못합니다.\n\n" +
        "4. **정적 생성과 동적 경로의 조합** — 동적 URL이지만 빌드 시 미리 생성하여 정적 페이지의 성능 이점을 누리고 싶습니다.\n\n" +
        "5. **동적 경로별 메타데이터** — SEO를 위해 각 동적 페이지마다 고유한 title, description이 필요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js App Router는 폴더 이름에 대괄호 규칙을 사용하여 동적 라우트를 지원합니다.\n\n" +
        "### 1. [slug] — 단일 동적 세그먼트\n" +
        "`app/blog/[slug]/page.tsx`는 `/blog/hello-world`, `/blog/nextjs-guide` 등 하나의 세그먼트를 매칭합니다. `params.slug`로 값에 접근합니다.\n\n" +
        "### 2. [...slug] — Catch-all 세그먼트\n" +
        "`app/docs/[...slug]/page.tsx`는 `/docs/a`, `/docs/a/b`, `/docs/a/b/c` 등 하나 이상의 세그먼트를 배열로 매칭합니다. `/docs`는 매칭되지 않습니다.\n\n" +
        "### 3. [[...slug]] — Optional Catch-all\n" +
        "`app/shop/[[...slug]]/page.tsx`는 `/shop`, `/shop/a`, `/shop/a/b` 모두를 매칭합니다. 세그먼트가 없으면 `params.slug`는 `undefined`입니다.\n\n" +
        "### 4. generateStaticParams\n" +
        "동적 라우트에서 빌드 시 생성할 파라미터 목록을 반환합니다. `dynamicParams` 설정으로 목록에 없는 경로의 동작을 제어합니다.\n\n" +
        "### 5. 동적 메타데이터\n" +
        "`generateMetadata` 함수로 params를 받아 페이지별 고유한 메타데이터를 생성합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 동적 세그먼트 패턴",
      content:
        "세 가지 동적 라우트 패턴의 폴더 구조와 params 접근 방법을 비교합니다. 각 패턴이 어떤 URL을 매칭하고, params에 어떤 값이 들어오는지 확인합니다.",
      code: {
        language: "typescript",
        code:
          '// === [slug] 단일 동적 세그먼트 ===\n' +
          '// app/blog/[slug]/page.tsx\n' +
          '// /blog/hello → params.slug = "hello"\n' +
          '// /blog/world → params.slug = "world"\n' +
          '// /blog/a/b   → 매칭 안됨 (404)\n\n' +
          'interface Props {\n' +
          '  params: Promise<{ slug: string }>;\n' +
          '}\n\n' +
          'export default async function BlogPost({ params }: Props) {\n' +
          '  const { slug } = await params;\n' +
          '  const post = await getPost(slug);\n' +
          '  return <article>{post.title}</article>;\n' +
          '}\n\n' +
          '// === [...slug] Catch-all ===\n' +
          '// app/docs/[...slug]/page.tsx\n' +
          '// /docs/a       → params.slug = ["a"]\n' +
          '// /docs/a/b     → params.slug = ["a", "b"]\n' +
          '// /docs/a/b/c   → params.slug = ["a", "b", "c"]\n' +
          '// /docs          → 매칭 안됨 (404)\n\n' +
          'interface DocsProps {\n' +
          '  params: Promise<{ slug: string[] }>;\n' +
          '}\n\n' +
          'export default async function DocsPage({ params }: DocsProps) {\n' +
          '  const { slug } = await params;\n' +
          '  const path = slug.join("/");\n' +
          '  const doc = await getDoc(path);\n' +
          '  return <div>{doc.content}</div>;\n' +
          '}\n\n' +
          '// === [[...slug]] Optional Catch-all ===\n' +
          '// app/shop/[[...slug]]/page.tsx\n' +
          '// /shop         → params.slug = undefined\n' +
          '// /shop/clothes → params.slug = ["clothes"]\n' +
          '// /shop/a/b     → params.slug = ["a", "b"]\n\n' +
          'interface ShopProps {\n' +
          '  params: Promise<{ slug?: string[] }>;\n' +
          '}\n\n' +
          'export default async function ShopPage({ params }: ShopProps) {\n' +
          '  const { slug } = await params;\n' +
          '  if (!slug) {\n' +
          '    return <AllProducts />; // /shop\n' +
          '  }\n' +
          '  return <FilteredProducts categories={slug} />;\n' +
          '}',
        description:
          "[slug]는 단일 문자열, [...slug]는 문자열 배열, [[...slug]]는 선택적 문자열 배열로 params에 전달됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: generateStaticParams와 동적 메타데이터",
      content:
        "블로그 상세 페이지에서 generateStaticParams로 빌드 시 정적 생성하고, generateMetadata로 각 글의 고유한 SEO 메타데이터를 설정합니다. dynamicParams 설정에 따른 동작 차이도 확인합니다.",
      code: {
        language: "typescript",
        code:
          '// app/blog/[slug]/page.tsx\n' +
          'import { Metadata } from "next";\n' +
          'import { notFound } from "next/navigation";\n\n' +
          'interface Props {\n' +
          '  params: Promise<{ slug: string }>;\n' +
          '}\n\n' +
          '// 빌드 시 정적 생성할 경로 목록\n' +
          'export async function generateStaticParams() {\n' +
          '  const posts = await fetch("https://api.example.com/posts").then(\n' +
          '    (res) => res.json()\n' +
          '  );\n' +
          '\n' +
          '  return posts.map((post: { slug: string }) => ({\n' +
          '    slug: post.slug,\n' +
          '  }));\n' +
          '  // 반환 예: [{ slug: "hello" }, { slug: "world" }]\n' +
          '}\n\n' +
          '// false: 목록에 없는 경로는 404 반환\n' +
          '// true(기본값): 목록에 없는 경로도 런타임에 생성\n' +
          'export const dynamicParams = true;\n\n' +
          '// 동적 메타데이터 생성\n' +
          'export async function generateMetadata({ params }: Props): Promise<Metadata> {\n' +
          '  const { slug } = await params;\n' +
          '  const post = await fetch(\n' +
          '    `https://api.example.com/posts/${slug}`\n' +
          '  ).then((res) => res.json());\n\n' +
          '  if (!post) return { title: "포스트를 찾을 수 없습니다" };\n\n' +
          '  return {\n' +
          '    title: post.title,\n' +
          '    description: post.excerpt,\n' +
          '    openGraph: {\n' +
          '      title: post.title,\n' +
          '      description: post.excerpt,\n' +
          '      images: [post.coverImage],\n' +
          '    },\n' +
          '  };\n' +
          '}\n\n' +
          'export default async function BlogPost({ params }: Props) {\n' +
          '  const { slug } = await params;\n' +
          '  const post = await fetch(\n' +
          '    `https://api.example.com/posts/${slug}`\n' +
          '  ).then((res) => res.json());\n\n' +
          '  if (!post) notFound();\n\n' +
          '  return (\n' +
          '    <article>\n' +
          '      <h1>{post.title}</h1>\n' +
          '      <time>{new Date(post.date).toLocaleDateString("ko-KR")}</time>\n' +
          '      <div dangerouslySetInnerHTML={{ __html: post.content }} />\n' +
          '    </article>\n' +
          '  );\n' +
          '}',
        description:
          "generateStaticParams로 빌드 시 경로를 미리 생성하고, generateMetadata로 각 페이지의 SEO 메타데이터를 동적으로 설정합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 예시 경로 | params 타입 |\n" +
        "|------|-----------|-------------|\n" +
        "| [slug] | /blog/hello | `{ slug: string }` |\n" +
        "| [...slug] | /docs/a/b/c | `{ slug: string[] }` |\n" +
        "| [[...slug]] | /shop 또는 /shop/a/b | `{ slug?: string[] }` |\n" +
        "| generateStaticParams | 빌드 시 경로 생성 | 파라미터 객체 배열 반환 |\n" +
        "| dynamicParams | 미생성 경로 동작 | true(동적 생성) / false(404) |\n\n" +
        "**핵심:** [slug]는 단일 파라미터, [...slug]는 여러 세그먼트, [[...slug]]는 선택적 catch-all이다. generateStaticParams로 빌드 시 경로를 미리 생성할 수 있다.\n\n" +
        "**다음 챕터 미리보기:** Route Groups와 Parallel Routes로 URL에 영향 없이 라우트를 논리적으로 그룹화하고, 같은 레이아웃에서 여러 페이지를 동시에 렌더링하는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "[slug]는 단일 파라미터, [...slug]는 여러 세그먼트, [[...slug]]는 선택적 catch-all이다. generateStaticParams로 빌드 시 경로를 미리 생성할 수 있다.",
  checklist: [
    "[slug], [...slug], [[...slug]]의 차이를 URL 예시와 함께 설명할 수 있다",
    "각 동적 라우트 패턴에서 params의 타입을 정확히 알 수 있다",
    "generateStaticParams로 빌드 시 정적 경로를 생성할 수 있다",
    "dynamicParams 설정에 따른 동작 차이를 이해한다",
    "generateMetadata로 동적 페이지의 메타데이터를 설정할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "app/docs/[...slug]/page.tsx가 매칭하지 않는 경로는?",
      choices: [
        "/docs/react",
        "/docs/react/hooks",
        "/docs",
        "/docs/react/hooks/useState",
      ],
      correctIndex: 2,
      explanation:
        "[...slug] catch-all은 최소 하나의 세그먼트가 필요합니다. /docs는 세그먼트가 없으므로 매칭되지 않습니다. /docs를 포함하려면 [[...slug]]를 사용해야 합니다.",
    },
    {
      id: "q2",
      question: "[[...slug]]와 [...slug]의 핵심 차이는?",
      choices: [
        "[[...slug]]는 더 많은 세그먼트를 지원한다",
        "[[...slug]]는 세그먼트가 없는 경우(루트)도 매칭한다",
        "[[...slug]]는 숫자만 매칭한다",
        "[[...slug]]는 더 빠른 성능을 제공한다",
      ],
      correctIndex: 1,
      explanation:
        "[[...slug]] optional catch-all은 세그먼트가 없는 경우(/shop)도 매칭합니다. 이때 params.slug는 undefined입니다. [...slug]는 최소 하나의 세그먼트가 필요합니다.",
    },
    {
      id: "q3",
      question: "dynamicParams = false로 설정하면?",
      choices: [
        "모든 동적 라우트가 비활성화된다",
        "generateStaticParams 목록에 없는 경로는 404를 반환한다",
        "빌드 시 정적 생성이 비활성화된다",
        "params 객체가 빈 객체가 된다",
      ],
      correctIndex: 1,
      explanation:
        "dynamicParams = false는 generateStaticParams에서 반환하지 않은 경로에 대해 404를 반환합니다. 알려진 경로만 허용하고 싶을 때 유용합니다.",
    },
    {
      id: "q4",
      question: "generateMetadata 함수의 역할은?",
      choices: [
        "페이지의 레이아웃을 동적으로 변경한다",
        "동적 라우트의 params를 기반으로 SEO 메타데이터를 생성한다",
        "API 응답의 메타데이터를 파싱한다",
        "정적 생성할 경로를 결정한다",
      ],
      correctIndex: 1,
      explanation:
        "generateMetadata는 params를 인자로 받아 해당 페이지의 title, description, Open Graph 등 SEO 메타데이터를 동적으로 생성합니다.",
    },
    {
      id: "q5",
      question: "/blog/[slug]/page.tsx에서 /blog/hello-world 접근 시 params는?",
      choices: [
        '{ slug: ["hello", "world"] }',
        '{ slug: "hello-world" }',
        '{ slug: ["hello-world"] }',
        '{ path: "hello-world" }',
      ],
      correctIndex: 1,
      explanation:
        '[slug]는 단일 동적 세그먼트로, URL의 해당 위치 값을 문자열로 전달합니다. "hello-world"는 하나의 세그먼트이므로 { slug: "hello-world" }가 됩니다.',
    },
  ],
};

export default chapter;
