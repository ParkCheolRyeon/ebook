import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "13-revalidation",
  subject: "next",
  title: "재검증과 ISR",
  description:
    "Time-based 재검증, On-demand 재검증(revalidatePath, revalidateTag), ISR 개념, 재검증 전략 선택 기준, generateStaticParams를 활용한 빌드 시 정적 생성을 학습합니다.",
  order: 13,
  group: "데이터 페칭과 캐싱",
  prerequisites: ["12-caching"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "재검증은 **뉴스 게시판**과 비슷합니다.\n\n" +
        "**Time-based 재검증**은 매일 아침 정해진 시간에 게시판의 뉴스를 교체하는 것입니다. 하루 동안은 같은 뉴스를 보여주지만, 시간이 지나면 자동으로 최신 뉴스로 바뀝니다. 실시간은 아니지만 충분히 신선합니다.\n\n" +
        "**On-demand 재검증**은 속보가 터졌을 때 담당자가 즉시 게시판을 업데이트하는 것입니다. 정해진 시간을 기다리지 않고, 중요한 변경이 발생하면 바로 반영합니다.\n\n" +
        "**ISR(Incremental Static Regeneration)**은 이 두 가지를 합친 스마트 게시판입니다. 평소에는 미리 인쇄된 게시물(정적 페이지)을 보여주다가, 일정 시간이 지나거나 담당자가 요청하면 해당 게시물만 새로 인쇄합니다. 전체 게시판을 교체하지 않고 변경된 부분만 업데이트하므로 빠르고 효율적입니다.\n\n" +
        "**generateStaticParams**는 인쇄소에 '이 목록의 게시물은 미리 인쇄해두세요'라고 지시하는 것입니다. 빌드 시점에 어떤 페이지를 미리 만들지 결정합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "캐싱을 적용하면 성능은 좋아지지만, 데이터가 바뀌었을 때 사용자가 오래된 정보를 볼 수 있습니다.\n\n" +
        "1. **정적 페이지의 한계** — 빌드 시 생성된 정적 페이지는 빠르지만, 데이터가 변경되면 다시 빌드해야 합니다. 상품 가격이 바뀌었는데 빌드 전까지 이전 가격이 표시됩니다.\n\n" +
        "2. **전체 빌드의 비효율** — 하나의 블로그 글이 수정되었을 뿐인데 수천 페이지를 모두 다시 빌드하는 것은 시간과 리소스 낭비입니다.\n\n" +
        "3. **캐시 무효화 타이밍** — 너무 자주 무효화하면 캐시의 장점을 잃고, 너무 드물게 하면 오래된 데이터를 보여줍니다. 상황에 따른 적절한 전략이 필요합니다.\n\n" +
        "4. **세밀한 캐시 제어** — 특정 페이지만, 또는 특정 데이터와 관련된 페이지만 선택적으로 갱신하고 싶은 요구가 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js는 두 가지 재검증 방식과 ISR로 정적 사이트의 장점과 동적 데이터를 모두 취합니다.\n\n" +
        "### 1. Time-based Revalidation\n" +
        "`fetch`의 `next.revalidate` 옵션이나 Route Segment Config의 `revalidate`로 일정 시간 간격을 설정합니다. 설정된 시간이 지나면 다음 요청 시 백그라운드에서 새 데이터를 가져와 캐시를 갱신합니다. stale-while-revalidate 패턴으로 사용자는 항상 즉시 응답을 받습니다.\n\n" +
        "### 2. On-demand Revalidation\n" +
        "`revalidatePath`로 특정 경로의 캐시를, `revalidateTag`로 특정 태그가 붙은 모든 캐시를 즉시 무효화합니다. CMS에서 콘텐츠를 수정했을 때 Webhook으로 호출하는 패턴이 대표적입니다.\n\n" +
        "### 3. ISR (Incremental Static Regeneration)\n" +
        "정적으로 생성된 페이지를 개별적으로 재생성합니다. `generateStaticParams`로 빌드 시 생성할 경로를 지정하고, 재검증 설정으로 이후 업데이트를 제어합니다. 전체 빌드 없이 변경된 페이지만 갱신됩니다.\n\n" +
        "### 전략 선택 기준\n" +
        "- **Time-based**: 뉴스 피드, 날씨 등 주기적 업데이트가 적합한 데이터\n" +
        "- **On-demand**: CMS 콘텐츠, 상품 정보 등 변경 시점이 명확한 데이터",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 재검증 전략",
      content:
        "Time-based 재검증과 On-demand 재검증의 구현 방법을 살펴봅니다. fetch 옵션과 Route Segment Config를 통한 시간 기반 설정, 그리고 Server Action이나 Route Handler에서 명시적으로 캐시를 무효화하는 방법을 다룹니다.",
      code: {
        language: "typescript",
        code:
          '// === Time-based Revalidation ===\n\n' +
          '// 방법 1: fetch 옵션으로 설정\n' +
          'async function getProducts() {\n' +
          '  const res = await fetch("https://api.example.com/products", {\n' +
          '    next: { revalidate: 3600 }, // 1시간마다 재검증\n' +
          '  });\n' +
          '  return res.json();\n' +
          '}\n\n' +
          '// 방법 2: Route Segment Config로 페이지 전체 설정\n' +
          '// app/products/page.tsx\n' +
          'export const revalidate = 3600; // 페이지의 모든 fetch에 적용\n\n' +
          'export default async function ProductsPage() {\n' +
          '  const products = await getProducts();\n' +
          '  return <ProductList products={products} />;\n' +
          '}\n\n' +
          '// === On-demand Revalidation ===\n\n' +
          '// revalidateTag: 태그 기반 무효화\n' +
          'async function getPost(id: string) {\n' +
          '  const res = await fetch(`https://api.example.com/posts/${id}`, {\n' +
          '    next: { tags: [`post-${id}`, "posts"] },\n' +
          '  });\n' +
          '  return res.json();\n' +
          '}\n\n' +
          '// revalidatePath: 경로 기반 무효화\n' +
          "import { revalidatePath, revalidateTag } from 'next/cache';\n\n" +
          '// Server Action에서 사용\n' +
          'export async function updatePost(id: string, data: FormData) {\n' +
          '  "use server";\n' +
          '  await db.post.update({ where: { id }, data: { ... } });\n\n' +
          '  revalidateTag(`post-${id}`); // 해당 포스트 태그의 캐시 무효화\n' +
          '  revalidatePath("/blog");      // /blog 경로의 캐시 무효화\n' +
          '}',
        description:
          "Time-based는 시간 간격을 설정하고, On-demand는 revalidatePath/revalidateTag로 명시적으로 캐시를 갱신합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: ISR과 generateStaticParams",
      content:
        "블로그 상세 페이지를 ISR로 구현합니다. 빌드 시 기존 게시물을 정적 생성하고, 새로운 게시물은 첫 요청 시 생성됩니다. CMS에서 수정 시 Webhook을 통해 즉시 재검증합니다.",
      code: {
        language: "typescript",
        code:
          '// app/blog/[slug]/page.tsx\n' +
          'import { notFound } from "next/navigation";\n\n' +
          'interface Props {\n' +
          '  params: Promise<{ slug: string }>;\n' +
          '}\n\n' +
          '// 빌드 시 정적 생성할 경로 목록\n' +
          'export async function generateStaticParams() {\n' +
          '  const posts = await fetch("https://api.example.com/posts").then(\n' +
          '    (res) => res.json()\n' +
          '  );\n' +
          '  return posts.map((post: { slug: string }) => ({\n' +
          '    slug: post.slug,\n' +
          '  }));\n' +
          '}\n\n' +
          '// 빌드 시 생성되지 않은 경로도 허용 (기본값: true)\n' +
          'export const dynamicParams = true;\n\n' +
          '// 60초마다 재검증 (ISR)\n' +
          'export const revalidate = 60;\n\n' +
          'export default async function BlogPost({ params }: Props) {\n' +
          '  const { slug } = await params;\n' +
          '  const post = await fetch(\n' +
          '    `https://api.example.com/posts/${slug}`,\n' +
          '    { next: { tags: [`post-${slug}`] } }\n' +
          '  ).then((res) => res.json());\n\n' +
          '  if (!post) notFound();\n\n' +
          '  return (\n' +
          '    <article>\n' +
          '      <h1>{post.title}</h1>\n' +
          '      <p>{post.content}</p>\n' +
          '    </article>\n' +
          '  );\n' +
          '}\n\n' +
          '// app/api/revalidate/route.ts\n' +
          '// CMS Webhook에서 호출하는 On-demand 재검증 API\n' +
          'import { revalidateTag } from "next/cache";\n' +
          'import { NextRequest, NextResponse } from "next/server";\n\n' +
          'export async function POST(request: NextRequest) {\n' +
          '  const { slug, secret } = await request.json();\n\n' +
          '  if (secret !== process.env.REVALIDATION_SECRET) {\n' +
          '    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });\n' +
          '  }\n\n' +
          '  revalidateTag(`post-${slug}`);\n' +
          '  return NextResponse.json({ revalidated: true });\n' +
          '}',
        description:
          "generateStaticParams로 빌드 시 페이지를 생성하고, revalidate로 주기적 갱신, Webhook으로 즉시 갱신하는 ISR 패턴입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| Time-based Revalidation | next.revalidate 옵션으로 일정 시간 간격 자동 재검증 |\n" +
        "| On-demand Revalidation | revalidatePath/revalidateTag로 명시적 캐시 무효화 |\n" +
        "| ISR | 정적 생성된 페이지를 개별적으로 재생성 |\n" +
        "| generateStaticParams | 빌드 시 정적 생성할 동적 경로 목록 지정 |\n" +
        "| dynamicParams | 미리 생성되지 않은 경로의 허용 여부 설정 |\n\n" +
        "**핵심:** Time-based 재검증은 일정 시간마다 자동으로, On-demand 재검증은 데이터 변경 시 명시적으로 캐시를 갱신한다. ISR로 정적 사이트의 속도와 동적 데이터의 신선함을 동시에 얻는다.\n\n" +
        "**다음 챕터 미리보기:** 스트리밍과 Suspense를 활용하여 페이지를 점진적으로 전송하고, 사용자가 전체 데이터를 기다리지 않도록 하는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Time-based 재검증은 일정 시간마다 자동으로, On-demand 재검증은 데이터 변경 시 명시적으로 캐시를 갱신한다. ISR로 정적 사이트의 속도와 동적 데이터의 신선함을 동시에 얻는다.",
  checklist: [
    "fetch의 next.revalidate 옵션과 Route Segment Config의 차이를 설명할 수 있다",
    "revalidatePath와 revalidateTag의 사용 시나리오를 구분할 수 있다",
    "ISR의 동작 원리와 stale-while-revalidate 패턴을 이해한다",
    "generateStaticParams로 빌드 시 정적 경로를 생성할 수 있다",
    "Time-based와 On-demand 재검증의 선택 기준을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "fetch의 next.revalidate: 3600은 무엇을 의미하는가?",
      choices: [
        "3600번 요청 후 재검증한다",
        "3600초(1시간)마다 캐시를 재검증한다",
        "3600ms 후에 요청을 타임아웃한다",
        "3600바이트까지만 캐시한다",
      ],
      correctIndex: 1,
      explanation:
        "next.revalidate는 초 단위로 캐시 재검증 간격을 설정합니다. 3600은 1시간(3600초)마다 백그라운드에서 데이터를 다시 가져와 캐시를 갱신합니다.",
    },
    {
      id: "q2",
      question: "revalidateTag의 용도로 가장 적절한 것은?",
      choices: [
        "특정 태그가 붙은 모든 캐시를 즉시 무효화한다",
        "HTML 태그를 재렌더링한다",
        "Git 태그를 기준으로 배포한다",
        "메타 태그를 업데이트한다",
      ],
      correctIndex: 0,
      explanation:
        "revalidateTag는 fetch 시 next.tags로 지정한 태그와 연관된 모든 캐시를 즉시 무효화합니다. 관련된 여러 페이지의 캐시를 한 번에 갱신할 때 유용합니다.",
    },
    {
      id: "q3",
      question: "ISR(Incremental Static Regeneration)의 핵심 장점은?",
      choices: [
        "클라이언트에서 실시간 렌더링한다",
        "전체 사이트를 다시 빌드하지 않고 개별 페이지를 재생성한다",
        "서버 없이 완전한 정적 사이트를 운영한다",
        "데이터베이스 연결을 자동 관리한다",
      ],
      correctIndex: 1,
      explanation:
        "ISR은 전체 빌드 없이 변경된 페이지만 개별적으로 재생성합니다. 정적 페이지의 빠른 응답 속도를 유지하면서 데이터 신선함도 확보할 수 있습니다.",
    },
    {
      id: "q4",
      question: "generateStaticParams의 역할은?",
      choices: [
        "런타임에 동적으로 파라미터를 생성한다",
        "빌드 시점에 정적 생성할 동적 경로 목록을 반환한다",
        "URL 쿼리 파라미터를 검증한다",
        "API 요청의 파라미터를 자동 변환한다",
      ],
      correctIndex: 1,
      explanation:
        "generateStaticParams는 빌드 시점에 호출되어 정적으로 생성할 동적 경로의 파라미터 목록을 반환합니다. 반환된 경로는 빌드 시 미리 HTML로 생성됩니다.",
    },
    {
      id: "q5",
      question: "다음 중 On-demand 재검증이 더 적합한 시나리오는?",
      choices: [
        "10분마다 변경되는 환율 정보",
        "CMS에서 관리자가 블로그 글을 수정한 경우",
        "1시간마다 업데이트되는 날씨 데이터",
        "매일 갱신되는 뉴스 헤드라인",
      ],
      correctIndex: 1,
      explanation:
        "On-demand 재검증은 데이터 변경 시점이 명확할 때 적합합니다. CMS에서 글을 수정하면 Webhook으로 즉시 재검증을 트리거할 수 있어 불필요한 대기 없이 최신 콘텐츠를 제공합니다.",
    },
  ],
};

export default chapter;
