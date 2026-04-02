import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "12-caching",
  subject: "next",
  title: "Next.js 캐시 레이어",
  description:
    "Next.js의 4가지 캐시 메커니즘(Request Memoization, Data Cache, Full Route Cache, Router Cache)의 동작 원리, 지속 시간, 무효화 방법, 그리고 cache() 함수를 학습합니다.",
  order: 12,
  group: "데이터 페칭과 캐싱",
  prerequisites: ["11-data-fetching"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Next.js의 4가지 캐시는 **도서관의 다층 저장 시스템**과 같습니다.\n\n" +
        "**1. Request Memoization (책상 위 메모)** — 지금 보고서를 쓰는 동안 같은 책을 여러 번 참조해야 합니다. 처음 빌린 책은 책상 위에 올려놓고 반복해서 봅니다. 보고서(요청)를 마치면 책상을 치웁니다. 같은 요청 중 동일한 fetch를 여러 번 호출해도 실제 네트워크 요청은 한 번뿐입니다.\n\n" +
        "**2. Data Cache (사서의 기억)** — 사서가 자주 요청되는 책의 위치를 기억합니다. 누가 물어봐도 서가를 다시 찾지 않고 바로 안내합니다. 기억은 직접 지우거나(revalidateTag), 일정 시간이 지나면(revalidate) 갱신됩니다.\n\n" +
        "**3. Full Route Cache (미리 만든 안내 책자)** — 자주 찾는 정보는 인쇄된 안내 책자로 만들어 놓습니다. 방문자마다 새로 찾아볼 필요 없이 책자를 나눠줍니다. 정적 라우트의 HTML과 RSC Payload를 빌드 시 미리 생성합니다.\n\n" +
        "**4. Router Cache (방문자의 단기 기억)** — 방문자가 이미 본 전시실을 기억합니다. 뒤로 가기 하면 다시 돌아볼 필요 없이 기억으로 즉시 보여줍니다. 클라이언트에서 이전에 방문한 라우트의 RSC Payload를 캐시합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "웹 애플리케이션에서 캐싱은 성능의 핵심이지만, 올바르게 구현하기 매우 어렵습니다.\n\n" +
        "1. **중복 요청** — 한 페이지에서 여러 컴포넌트가 같은 API를 호출하면 불필요한 네트워크 요청이 중복됩니다. 사용자 정보를 헤더, 사이드바, 본문에서 각각 가져오는 상황이 흔합니다.\n\n" +
        "2. **캐시 일관성** — 데이터를 변경한 후 모든 관련 캐시가 즉시 업데이트되지 않으면 사용자가 stale 데이터를 봅니다. 게시글을 수정했는데 목록 페이지에서 이전 내용이 보이는 문제입니다.\n\n" +
        "3. **정적 vs 동적 판단** — 어떤 페이지는 빌드 시 생성해도 되고, 어떤 페이지는 매 요청마다 새로 만들어야 합니다. 이 판단을 개발자가 직접 해야 하며, 잘못 판단하면 stale 데이터나 불필요한 서버 부하가 발생합니다.\n\n" +
        "4. **클라이언트 네비게이션 성능** — SPA 네비게이션에서 이미 방문한 페이지로 돌아갈 때마다 서버에 요청하면 느립니다. 하지만 무한정 캐시하면 최신 데이터를 보여줄 수 없습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js는 4개의 캐시 레이어를 중첩하여 이 문제들을 해결합니다.\n\n" +
        "### 1. Request Memoization\n" +
        "- **범위**: 단일 서버 요청 중\n" +
        "- **대상**: 같은 URL과 옵션의 fetch 호출\n" +
        "- **지속**: 요청이 끝나면 자동 소멸\n" +
        "- **무효화**: 자동 (요청 종료 시)\n" +
        "- React가 fetch를 확장하여 같은 URL+옵션의 GET 요청을 자동으로 메모이제이션한다. 이는 React 컴포넌트 트리 내에서만 동작하며, Route Handler에서는 적용되지 않는다 (Route Handler는 React 컴포넌트 트리의 일부가 아니기 때문).\n" +
        "- fetch GET 요청에만 자동 적용되며, POST 요청이나 ORM 직접 호출에는 React의 cache() 함수를 사용해야 한다.\n\n" +
        "### 2. Data Cache\n" +
        "- **범위**: 서버 측, 배포 간 지속\n" +
        "- **대상**: fetch GET 결과\n" +
        "- **지속**: 무기한 (명시적 무효화 전까지)\n" +
        "- **무효화**: `revalidateTag()`, `revalidatePath()`, `{ next: { revalidate: N } }`\n" +
        "- fetch의 cache 옵션: `auto`(기본값) — 개발 중엔 매번 새로 요청, `next build` 시 정적 프리렌더링. Request-time API(cookies, headers 등) 감지 시 매번 요청. `no-store` — 항상 새로 요청. `force-cache` — 서버 캐시에서 매칭 후 반환, 없으면 fetch 후 캐시 저장.\n\n" +
        "### 3. Full Route Cache\n" +
        "- **범위**: 서버 측, 배포 간 지속\n" +
        "- **대상**: 정적 HTML + RSC Payload\n" +
        "- **지속**: 무기한 (재빌드 또는 무효화 전까지)\n" +
        "- **무효화**: Data Cache 무효화 시 연쇄 무효화, `revalidatePath()`\n" +
        "- 정적 라우트의 **HTML과 RSC Payload**를 빌드 시 미리 생성하여 저장한다. RSC Payload는 Server Component의 렌더링 결과와 Client Component placeholder를 담은 바이너리 데이터이다.\n\n" +
        "### 4. Router Cache\n" +
        "- **범위**: 클라이언트 측, 세션 동안\n" +
        "- **대상**: 방문한 라우트의 RSC Payload\n" +
        "- **지속**: 동적 페이지 30초, 정적 페이지 5분\n" +
        "- **무효화**: `router.refresh()`, Server Action의 `revalidatePath`/`revalidateTag`, `cookies.set`/`delete`\n" +
        "- 클라이언트에서 방문한 라우트의 **RSC Payload**를 메모리에 캐시한다. Link의 prefetch로 미리 가져온 데이터도 여기에 저장된다.\n\n" +
        "### cache() 함수\n" +
        "ORM 호출 등 fetch가 아닌 데이터 접근에 Request Memoization을 적용하려면 React의 `cache()` 함수로 감싸야 합니다.\n\n" +
        "### Cache Components (Next.js 15+)\n" +
        "next.config.ts에서 `cacheComponents: true`를 설정하면 Cache Components가 활성화된다. 이 모드에서는 GET Route Handler도 페이지와 동일한 프리렌더링 모델을 따르게 되어, 앱 전체에서 일관된 캐싱 동작을 보장한다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 캐시 레이어별 동작 확인",
      content:
        "각 캐시 레이어가 어떻게 동작하는지 코드로 확인합니다. fetch의 캐싱 옵션과 revalidation 설정, 그리고 cache() 함수의 사용법을 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// === 1. Request Memoization ===\n' +
          '// 같은 요청 중 동일한 fetch는 한 번만 실행됨\n' +
          'async function Header() {\n' +
          '  const user = await fetch("/api/user"); // 1번 실행\n' +
          '  return <header>{/* ... */}</header>;\n' +
          '}\n' +
          '\n' +
          'async function Sidebar() {\n' +
          '  const user = await fetch("/api/user"); // 캐시에서 반환 (재실행 X)\n' +
          '  return <aside>{/* ... */}</aside>;\n' +
          '}\n' +
          '\n' +
          '// === 2. Data Cache 제어 ===\n' +
          'async function getProducts() {\n' +
          '  // 기본: 캐시됨 (Data Cache에 저장)\n' +
          '  const cached = await fetch("https://api.example.com/products");\n' +
          '\n' +
          '  // 시간 기반 재검증: 60초마다 백그라운드 갱신\n' +
          '  const timed = await fetch("https://api.example.com/products", {\n' +
          '    next: { revalidate: 60 },\n' +
          '  });\n' +
          '\n' +
          '  // 태그 기반: revalidateTag("products")로 수동 무효화\n' +
          '  const tagged = await fetch("https://api.example.com/products", {\n' +
          '    next: { tags: ["products"] },\n' +
          '  });\n' +
          '\n' +
          '  // 캐시 비활성화: 항상 최신 데이터\n' +
          '  const fresh = await fetch("https://api.example.com/products", {\n' +
          '    cache: "no-store",\n' +
          '  });\n' +
          '}\n' +
          '\n' +
          '// === 3. cache() 함수 (ORM용 Request Memoization) ===\n' +
          'import { cache } from "react";\n' +
          '\n' +
          'export const getUser = cache(async (id: string) => {\n' +
          '  // fetch가 아닌 DB 직접 호출에도 중복 제거 적용\n' +
          '  return db.user.findUnique({ where: { id } });\n' +
          '});\n' +
          '\n' +
          '// === 4. 동적 라우트로 전환 (Full Route Cache opt-out) ===\n' +
          'import { cookies, headers } from "next/headers";\n' +
          '\n' +
          'async function DynamicPage() {\n' +
          '  // cookies()나 headers()를 호출하면 동적 렌더링\n' +
          '  const cookieStore = await cookies();\n' +
          '  const token = cookieStore.get("session");\n' +
          '  // 이 페이지는 Full Route Cache에 저장되지 않음\n' +
          '  return <div>{/* ... */}</div>;\n' +
          '}',
        description:
          "4가지 캐시 레이어의 동작을 코드 레벨에서 확인합니다. fetch 옵션, cache() 함수, 동적 함수 사용에 따라 캐시 동작이 달라집니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 캐시 무효화 전략",
      content:
        "Server Action에서 데이터를 변경한 후 관련 캐시를 무효화하는 실전 패턴입니다. revalidatePath와 revalidateTag를 상황에 맞게 사용하고, Router Cache까지 갱신되는 전체 흐름을 확인합니다.",
      code: {
        language: "typescript",
        code:
          '// app/actions/product.ts\n' +
          '"use server";\n' +
          '\n' +
          'import { db } from "@/lib/database";\n' +
          'import { revalidatePath, revalidateTag } from "next/cache";\n' +
          '\n' +
          'export async function updateProduct(\n' +
          '  id: string,\n' +
          '  formData: FormData\n' +
          ') {\n' +
          '  const name = formData.get("name") as string;\n' +
          '  const price = Number(formData.get("price"));\n' +
          '\n' +
          '  await db.product.update({\n' +
          '    where: { id },\n' +
          '    data: { name, price },\n' +
          '  });\n' +
          '\n' +
          '  // 방법 1: 특정 경로의 캐시 무효화\n' +
          '  // - Full Route Cache (해당 경로의 HTML/RSC)\n' +
          '  // - Data Cache (해당 경로에서 사용된 데이터)\n' +
          '  // - Router Cache (클라이언트 캐시)\n' +
          '  revalidatePath(`/products/${id}`);\n' +
          '  revalidatePath("/products"); // 목록 페이지도 갱신\n' +
          '\n' +
          '  // 방법 2: 태그 기반 무효화 (더 정밀한 제어)\n' +
          '  // fetch에서 { next: { tags: ["product-detail", `product-${id}`] } }\n' +
          '  // 로 태그를 설정한 경우:\n' +
          '  revalidateTag(`product-${id}`);\n' +
          '  revalidateTag("product-list");\n' +
          '}\n' +
          '\n' +
          '// lib/data.ts\n' +
          '// 태그를 활용한 fetch 함수\n' +
          'export async function getProducts() {\n' +
          '  const res = await fetch("https://api.example.com/products", {\n' +
          '    next: { tags: ["product-list"], revalidate: 300 },\n' +
          '  });\n' +
          '  return res.json();\n' +
          '}\n' +
          '\n' +
          'export async function getProduct(id: string) {\n' +
          '  const res = await fetch(\n' +
          '    `https://api.example.com/products/${id}`,\n' +
          '    { next: { tags: ["product-detail", `product-${id}`] } }\n' +
          '  );\n' +
          '  return res.json();\n' +
          '}\n' +
          '\n' +
          '// 캐시 무효화 흐름:\n' +
          '// 1. Server Action 실행 → DB 업데이트\n' +
          '// 2. revalidateTag("product-123") 호출\n' +
          '// 3. Data Cache에서 해당 태그의 데이터 무효화\n' +
          '// 4. Full Route Cache에서 해당 데이터를 사용하는 라우트 무효화\n' +
          '// 5. 클라이언트 Router Cache 갱신 (다음 네비게이션 시)',
        description:
          "revalidatePath로 경로 기반, revalidateTag로 태그 기반 캐시 무효화를 적용하여 데이터 변경 후 모든 캐시 레이어를 갱신합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 캐시 레이어 | 위치 | 대상 | 지속 시간 | 무효화 방법 |\n" +
        "|------------|------|------|----------|------------|\n" +
        "| Request Memoization | 서버 (React 트리) | 같은 fetch 중복 | 요청 종료 시 | 자동 |\n" +
        "| Data Cache | 서버 | fetch GET 결과 | 무기한 | revalidateTag/Path |\n" +
        "| Full Route Cache | 서버 | 정적 HTML + RSC Payload | 무기한 | 재빌드/revalidate |\n" +
        "| Router Cache | 클라이언트 | RSC Payload | 30초~5분 | refresh()/revalidate |\n\n" +
        "**핵심:** Next.js는 4개의 캐시 레이어가 중첩되어 동작합니다. 각 레이어의 역할과 무효화 방법을 이해하는 것이 성능 튜닝의 핵심입니다.\n\n" +
        "**다음 챕터 미리보기:** ISR과 On-Demand Revalidation을 포함한 캐시 재검증(Revalidation) 전략을 심화 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Next.js는 4개의 캐시 레이어(Request Memoization, Data Cache, Full Route Cache, Router Cache)가 중첩 동작한다. fetch GET은 자동 메모이제이션되고, 정적 라우트는 HTML+RSC Payload로 캐시되며, 클라이언트는 RSC Payload를 메모리에 보관한다.",
  checklist: [
    "4가지 캐시 레이어의 역할과 범위를 설명할 수 있다",
    "Request Memoization과 Data Cache의 차이를 이해한다",
    "revalidatePath와 revalidateTag의 사용 시점을 구분할 수 있다",
    "cache() 함수를 사용하여 ORM 호출의 중복을 제거할 수 있다",
    "캐시 무효화가 4개 레이어에서 어떻게 전파되는지 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "Request Memoization의 캐시는 언제 소멸하나?",
      choices: [
        "5분 후",
        "서버 재시작 시",
        "해당 서버 요청이 완료될 때",
        "수동으로 무효화할 때",
      ],
      correctIndex: 2,
      explanation:
        "Request Memoization은 단일 서버 요청 동안만 유지됩니다. 요청이 완료되면 메모이제이션된 데이터가 자동으로 소멸합니다.",
    },
    {
      id: "q2",
      question:
        "Data Cache를 무효화하는 방법이 아닌 것은?",
      choices: [
        "revalidateTag()",
        "revalidatePath()",
        "router.refresh()",
        "{ next: { revalidate: 60 } }",
      ],
      correctIndex: 2,
      explanation:
        "router.refresh()는 Router Cache(클라이언트)를 갱신하는 방법입니다. Data Cache(서버)를 무효화하려면 revalidateTag, revalidatePath, 또는 시간 기반 revalidate를 사용합니다.",
    },
    {
      id: "q3",
      question:
        "Full Route Cache에 저장되지 않는 페이지는?",
      choices: [
        "정적 콘텐츠만 있는 페이지",
        "cookies()나 headers()를 호출하는 동적 페이지",
        "이미지만 있는 페이지",
        "Server Component로만 구성된 페이지",
      ],
      correctIndex: 1,
      explanation:
        "cookies(), headers(), searchParams 등 동적 함수를 사용하면 페이지가 동적 렌더링으로 전환되어 Full Route Cache에 저장되지 않고 매 요청마다 새로 렌더링됩니다.",
    },
    {
      id: "q4",
      question:
        "ORM(Prisma 등)을 직접 호출할 때 Request Memoization을 적용하려면?",
      choices: [
        "fetch로 감싼다",
        "React의 cache() 함수로 감싼다",
        "useMemo를 사용한다",
        "별도 설정 없이 자동 적용된다",
      ],
      correctIndex: 1,
      explanation:
        "Request Memoization은 fetch에만 자동 적용됩니다. ORM 직접 호출에는 React의 cache() 함수로 감싸야 같은 인자의 중복 호출을 방지할 수 있습니다.",
    },
    {
      id: "q5",
      question:
        "Router Cache의 기본 지속 시간으로 올바른 것은?",
      choices: [
        "동적 페이지 5분, 정적 페이지 30초",
        "모든 페이지 1시간",
        "동적 페이지 30초, 정적 페이지 5분",
        "캐시되지 않음",
      ],
      correctIndex: 2,
      explanation:
        "Router Cache는 동적 페이지를 30초, 정적 페이지를 5분 동안 클라이언트에 캐시합니다. 이 시간이 지나면 다음 네비게이션에서 서버에 새로 요청합니다.",
    },
  ],
};

export default chapter;
