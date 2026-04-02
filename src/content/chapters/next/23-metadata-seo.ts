import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "23-metadata-seo",
  subject: "next",
  title: "메타데이터와 SEO",
  description:
    "정적 metadata export, generateMetadata 동적 메타데이터, Open Graph, Twitter Card, sitemap.xml, robots.txt, JSON-LD 구조화 데이터를 학습합니다.",
  order: 23,
  group: "스타일링과 최적화",
  prerequisites: ["22-font-optimization"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "메타데이터는 **책의 표지와 목차**입니다.\n\n" +
        "서점(검색엔진)에서 책을 찾을 때, 사람들은 먼저 **표지**(title, description)를 봅니다. " +
        "표지에 제목과 간단한 소개가 잘 적혀 있어야 고객이 책을 집어듭니다. " +
        "이것이 `<title>`과 `<meta name='description'>`의 역할입니다.\n\n" +
        "**Open Graph**는 **SNS에 공유했을 때 보이는 미리보기 카드**입니다. " +
        "카카오톡이나 슬랙에 URL을 붙여넣으면 이미지, 제목, 설명이 예쁘게 표시되는 것이 " +
        "Open Graph 태그 덕분입니다.\n\n" +
        "**sitemap.xml**은 서점의 **도서 목록(카탈로그)**입니다. " +
        "검색엔진 크롤러에게 '우리 사이트에 이런 페이지들이 있어요'라고 전체 목록을 알려줍니다. " +
        "크롤러가 모든 책장을 돌아다니지 않아도 목록만 보면 어떤 책이 있는지 알 수 있습니다.\n\n" +
        "**robots.txt**는 서점의 **출입 규칙**입니다. " +
        "'이 구역(관리자 페이지)은 일반인(크롤러) 출입 금지', '이 구역(공개 페이지)은 자유롭게 둘러보세요'라고 " +
        "규칙을 정합니다.\n\n" +
        "**JSON-LD**는 **바코드**입니다. 사람 눈에는 보이지 않지만 기계(검색엔진)가 " +
        "정확한 정보(가격, 평점, 저자 등)를 구조화된 형태로 읽을 수 있게 합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "SEO는 서비스의 검색 노출과 직결되지만, **수동 관리에는 한계가 있습니다.**\n\n" +
        "### 1. 동적 페이지의 메타데이터\n" +
        "블로그 포스트, 상품 상세 등 동적 콘텐츠의 제목과 설명을 매번 하드코딩할 수 없습니다. " +
        "데이터베이스의 내용을 기반으로 메타데이터를 동적으로 생성해야 합니다.\n\n" +
        "### 2. Open Graph 이미지\n" +
        "각 페이지마다 SNS 공유용 이미지를 수동으로 만들기 어렵습니다. " +
        "수백 개의 블로그 포스트에 각각 다른 OG 이미지를 제공해야 합니다.\n\n" +
        "### 3. sitemap과 robots.txt\n" +
        "페이지가 추가/삭제될 때마다 sitemap을 수동으로 업데이트하면 누락이 발생합니다. " +
        "robots.txt도 환경(개발/프로덕션)에 따라 다르게 설정해야 합니다.\n\n" +
        "### 4. 메타데이터 상속\n" +
        "모든 페이지에 공통 메타데이터(사이트명, 기본 OG 이미지)를 설정하면서, " +
        "각 페이지에서 일부만 덮어쓰고 싶습니다. 수동으로 합치면 코드 중복이 심합니다.\n\n" +
        "### 5. 구조화 데이터\n" +
        "Google 검색결과에 별점, 가격, FAQ 등 리치 스니펫을 표시하려면 " +
        "JSON-LD 형식의 구조화 데이터를 올바르게 삽입해야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js App Router는 **메타데이터를 코드로 관리**할 수 있는 강력한 API를 제공합니다.\n\n" +
        "### 1. 정적 metadata export\n" +
        "`layout.tsx`나 `page.tsx`에서 `export const metadata` 객체를 내보내면 " +
        "Next.js가 자동으로 `<head>`에 메타 태그를 삽입합니다.\n\n" +
        "### 2. generateMetadata 동적 메타데이터\n" +
        "동적 라우트에서는 `generateMetadata` async 함수로 데이터를 가져온 후 메타데이터를 생성합니다. " +
        "page 컴포넌트와 데이터 요청이 자동으로 중복 제거(deduplication)됩니다.\n\n" +
        "### 3. 메타데이터 상속과 병합\n" +
        "layout의 metadata가 기본값이 되고, 하위 page의 metadata가 이를 덮어씁니다. " +
        "`title.template`으로 일관된 제목 형식을 유지할 수 있습니다.\n\n" +
        "### 4. sitemap.xml과 robots.txt 자동 생성\n" +
        "`app/sitemap.ts`와 `app/robots.ts` 파일에서 함수를 export하면 " +
        "빌드 시 자동으로 XML/텍스트 파일이 생성됩니다.\n\n" +
        "### 5. JSON-LD 구조화 데이터\n" +
        "서버 컴포넌트에서 `<script type='application/ld+json'>` 태그로 " +
        "JSON-LD를 삽입하면 Google이 리치 스니펫으로 표시합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: metadata와 generateMetadata",
      content:
        "정적 metadata와 동적 generateMetadata를 설정하고, " +
        "title template으로 일관된 제목 형식을 유지하며, " +
        "sitemap과 robots.txt를 코드로 생성하는 전체 흐름을 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// === app/layout.tsx — 정적 metadata + title template ===\n' +
          'import type { Metadata } from "next";\n\n' +
          'export const metadata: Metadata = {\n' +
          '  title: {\n' +
          '    default: "My Blog",           // 기본 제목\n' +
          '    template: "%s | My Blog",     // 하위 페이지 제목 형식\n' +
          '  },\n' +
          '  description: "Next.js로 만든 기술 블로그입니다.",\n' +
          '  openGraph: {\n' +
          '    type: "website",\n' +
          '    siteName: "My Blog",\n' +
          '    images: [{ url: "/og-default.png", width: 1200, height: 630 }],\n' +
          '  },\n' +
          '  twitter: {\n' +
          '    card: "summary_large_image",\n' +
          '  },\n' +
          '};\n\n' +
          '// === app/blog/[slug]/page.tsx — 동적 generateMetadata ===\n' +
          'import type { Metadata } from "next";\n\n' +
          'interface BlogPageProps {\n' +
          '  params: Promise<{ slug: string }>;\n' +
          '}\n\n' +
          'async function getPost(slug: string) {\n' +
          '  const res = await fetch(`https://api.example.com/posts/${slug}`);\n' +
          '  return res.json();\n' +
          '}\n\n' +
          '// generateMetadata: 데이터 기반 동적 메타데이터\n' +
          'export async function generateMetadata(\n' +
          '  { params }: BlogPageProps\n' +
          '): Promise<Metadata> {\n' +
          '  const { slug } = await params;\n' +
          '  const post = await getPost(slug); // fetch 자동 중복 제거\n\n' +
          '  return {\n' +
          '    title: post.title,        // "포스트 제목 | My Blog" 형태\n' +
          '    description: post.excerpt,\n' +
          '    openGraph: {\n' +
          '      title: post.title,\n' +
          '      description: post.excerpt,\n' +
          '      images: [{ url: post.coverImage }],\n' +
          '    },\n' +
          '  };\n' +
          '}\n\n' +
          'export default async function BlogPage({ params }: BlogPageProps) {\n' +
          '  const { slug } = await params;\n' +
          '  const post = await getPost(slug); // generateMetadata와 요청 중복 제거됨\n\n' +
          '  return <article><h1>{post.title}</h1><p>{post.content}</p></article>;\n' +
          '}\n\n' +
          '// === app/sitemap.ts — 동적 sitemap 생성 ===\n' +
          'import type { MetadataRoute } from "next";\n\n' +
          'export default async function sitemap(): Promise<MetadataRoute.Sitemap> {\n' +
          '  const posts = await fetch("https://api.example.com/posts").then(r => r.json());\n\n' +
          '  const postEntries = posts.map((post: { slug: string; updatedAt: string }) => ({\n' +
          '    url: `https://myblog.com/blog/${post.slug}`,\n' +
          '    lastModified: new Date(post.updatedAt),\n' +
          '    changeFrequency: "weekly" as const,\n' +
          '    priority: 0.8,\n' +
          '  }));\n\n' +
          '  return [\n' +
          '    { url: "https://myblog.com", lastModified: new Date(), priority: 1 },\n' +
          '    { url: "https://myblog.com/about", lastModified: new Date(), priority: 0.5 },\n' +
          '    ...postEntries,\n' +
          '  ];\n' +
          '}',
        description:
          "layout에서 title template으로 일관된 제목 형식을 설정하고, generateMetadata로 동적 포스트의 메타데이터를 생성합니다. sitemap.ts로 모든 페이지의 sitemap을 자동 생성합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: JSON-LD + robots.txt + favicon",
      content:
        "JSON-LD 구조화 데이터로 Google 리치 스니펫을 설정하고, " +
        "robots.ts로 크롤러 규칙을 정의하며, " +
        "favicon과 apple-touch-icon을 App Router 방식으로 설정하는 실습입니다.",
      code: {
        language: "typescript",
        code:
          '// === app/blog/[slug]/page.tsx — JSON-LD 구조화 데이터 ===\n' +
          'interface Post {\n' +
          '  title: string;\n' +
          '  content: string;\n' +
          '  author: string;\n' +
          '  publishedAt: string;\n' +
          '  coverImage: string;\n' +
          '}\n\n' +
          'export default async function BlogPage({\n' +
          '  params,\n' +
          '}: {\n' +
          '  params: Promise<{ slug: string }>;\n' +
          '}) {\n' +
          '  const { slug } = await params;\n' +
          '  const post: Post = await fetch(\n' +
          '    `https://api.example.com/posts/${slug}`\n' +
          '  ).then((r) => r.json());\n\n' +
          '  // JSON-LD 구조화 데이터\n' +
          '  const jsonLd = {\n' +
          '    "@context": "https://schema.org",\n' +
          '    "@type": "BlogPosting",\n' +
          '    headline: post.title,\n' +
          '    author: { "@type": "Person", name: post.author },\n' +
          '    datePublished: post.publishedAt,\n' +
          '    image: post.coverImage,\n' +
          '  };\n\n' +
          '  return (\n' +
          '    <>\n' +
          '      {/* JSON-LD를 head에 삽입 */}\n' +
          '      <script\n' +
          '        type="application/ld+json"\n' +
          '        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}\n' +
          '      />\n' +
          '      <article>\n' +
          '        <h1>{post.title}</h1>\n' +
          '        <p>작성자: {post.author}</p>\n' +
          '        <div>{post.content}</div>\n' +
          '      </article>\n' +
          '    </>\n' +
          '  );\n' +
          '}\n\n' +
          '// === app/robots.ts — 크롤러 규칙 ===\n' +
          'import type { MetadataRoute } from "next";\n\n' +
          'export default function robots(): MetadataRoute.Robots {\n' +
          '  return {\n' +
          '    rules: [\n' +
          '      {\n' +
          '        userAgent: "*",\n' +
          '        allow: "/",\n' +
          '        disallow: ["/admin/", "/api/", "/private/"],\n' +
          '      },\n' +
          '    ],\n' +
          '    sitemap: "https://myblog.com/sitemap.xml",\n' +
          '  };\n' +
          '}\n\n' +
          '// === favicon 설정 ===\n' +
          '// app/favicon.ico         → 자동 인식\n' +
          '// app/icon.png            → <link rel="icon"> 자동 생성\n' +
          '// app/apple-icon.png      → apple-touch-icon 자동 생성\n' +
          '// app/opengraph-image.png → OG 이미지 기본값 자동 설정',
        description:
          "JSON-LD로 블로그 포스트의 구조화 데이터를 삽입하고, robots.ts로 크롤러 규칙을 정의합니다. favicon과 OG 이미지는 app/ 디렉토리에 파일을 넣으면 자동 인식됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 기능 | 방법 |\n" +
        "|------|------|\n" +
        "| 정적 메타데이터 | `export const metadata: Metadata` |\n" +
        "| 동적 메타데이터 | `export async function generateMetadata()` |\n" +
        "| Open Graph | metadata 객체의 openGraph 필드 |\n" +
        "| Twitter Card | metadata 객체의 twitter 필드 |\n" +
        "| title template | `title: { template: '%s \\| Site' }` |\n" +
        "| sitemap.xml | `app/sitemap.ts` export default function |\n" +
        "| robots.txt | `app/robots.ts` export default function |\n" +
        "| JSON-LD | `<script type='application/ld+json'>` |\n" +
        "| favicon | `app/favicon.ico`, `app/icon.png` 자동 인식 |\n\n" +
        "**핵심:** metadata export로 정적 메타데이터를, generateMetadata로 동적 메타데이터를 설정합니다. " +
        "sitemap.xml과 robots.txt도 코드로 생성할 수 있어 SEO를 프로그래밍적으로 관리할 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** SEO 최적화를 마쳤으니, " +
        "이제 Core Web Vitals, 번들 분석, dynamic import, next/script 등 종합적인 성능 최적화 전략을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "metadata export로 정적 메타데이터를, generateMetadata로 동적 메타데이터를 설정한다. sitemap.xml과 robots.txt도 코드로 생성할 수 있어 SEO를 프로그래밍적으로 관리할 수 있다.",
  checklist: [
    "정적 metadata export와 동적 generateMetadata의 차이를 설명할 수 있다",
    "title template으로 일관된 페이지 제목 형식을 설정할 수 있다",
    "Open Graph와 Twitter Card 메타데이터를 올바르게 설정할 수 있다",
    "sitemap.ts와 robots.ts로 SEO 파일을 코드로 생성할 수 있다",
    "JSON-LD 구조화 데이터를 서버 컴포넌트에서 삽입할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "동적 라우트에서 데이터 기반 메타데이터를 생성할 때 사용하는 함수는?",
      choices: [
        "export const metadata",
        "export async function generateMetadata()",
        "export function getMetadata()",
        "export async function getServerSideProps()",
      ],
      correctIndex: 1,
      explanation:
        "generateMetadata는 async 함수로, params를 받아 데이터를 가져온 후 동적으로 메타데이터 객체를 반환합니다. 정적 metadata export와 달리 비동기 데이터 페칭이 가능합니다.",
    },
    {
      id: "q2",
      question: "title template의 역할은?",
      choices: [
        "모든 페이지의 제목을 동일하게 설정한다",
        "하위 페이지의 title을 일관된 형식(예: '페이지명 | 사이트명')으로 자동 변환한다",
        "검색엔진에 표시될 제목 길이를 제한한다",
        "브라우저 탭에 표시되는 favicon을 설정한다",
      ],
      correctIndex: 1,
      explanation:
        "title: { template: '%s | My Site' }를 layout에 설정하면, 하위 page에서 title: '블로그'로 지정 시 '블로그 | My Site'로 자동 변환됩니다.",
    },
    {
      id: "q3",
      question: "Next.js App Router에서 sitemap.xml을 생성하는 방법은?",
      choices: [
        "public/sitemap.xml 파일을 수동으로 작성한다",
        "app/sitemap.ts 파일에서 함수를 export한다",
        "next.config.js에서 sitemap 설정을 추가한다",
        "generateStaticParams에서 sitemap을 반환한다",
      ],
      correctIndex: 1,
      explanation:
        "app/sitemap.ts 파일에서 MetadataRoute.Sitemap 타입의 배열을 반환하는 함수를 export하면, Next.js가 빌드 시 자동으로 sitemap.xml을 생성합니다.",
    },
    {
      id: "q4",
      question: "JSON-LD 구조화 데이터의 주요 목적은?",
      choices: [
        "페이지 로딩 속도를 높인다",
        "검색엔진이 콘텐츠를 구조적으로 이해하여 리치 스니펫을 표시하게 한다",
        "브라우저 호환성을 개선한다",
        "접근성(a11y) 점수를 높인다",
      ],
      correctIndex: 1,
      explanation:
        "JSON-LD는 검색엔진이 콘텐츠의 의미(저자, 날짜, 평점 등)를 구조적으로 이해할 수 있게 합니다. 이를 통해 Google 검색결과에 별점, 가격, FAQ 등의 리치 스니펫이 표시됩니다.",
    },
    {
      id: "q5",
      question: "generateMetadata와 page 컴포넌트에서 같은 API를 fetch할 때 발생하는 일은?",
      choices: [
        "같은 API를 두 번 호출하여 성능이 저하된다",
        "Next.js가 자동으로 요청을 중복 제거(deduplication)한다",
        "generateMetadata의 요청만 실행되고 page의 요청은 무시된다",
        "빌드 에러가 발생한다",
      ],
      correctIndex: 1,
      explanation:
        "Next.js는 동일한 URL에 대한 fetch 요청을 자동으로 중복 제거합니다. generateMetadata와 page 컴포넌트에서 같은 API를 호출해도 실제 네트워크 요청은 한 번만 발생합니다.",
    },
  ],
};

export default chapter;
