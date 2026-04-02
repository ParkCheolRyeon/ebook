import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "11-data-fetching",
  subject: "next",
  title: "데이터 페칭 패턴",
  description:
    "Server Component에서 async/await로 데이터를 가져오는 방법, fetch API 확장 옵션, 병렬 vs 순차 페칭, 워터폴 문제 해결, 데이터 페칭 위치 전략을 학습합니다.",
  order: 11,
  group: "데이터 페칭과 캐싱",
  prerequisites: ["10-server-actions"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "데이터 페칭은 **마트에서 장보기**와 같습니다.\n\n" +
        "기존 React(CSR)의 데이터 페칭은 **배달 앱으로 주문**하는 것이었습니다. 앱(브라우저)에서 주문(fetch)을 넣고, 배달(네트워크)을 기다리고, 도착하면 냉장고(state)에 넣습니다. 재료가 여러 가게에서 와야 하면 배달 1 도착 → 배달 2 주문 → 배달 2 도착... 이런 **워터폴**이 발생합니다.\n\n" +
        "Server Component의 데이터 페칭은 **직접 마트에 가서 장보기**입니다. 서버라는 마트에 이미 와 있으니, 필요한 재료를 바로 집어들 수 있습니다(DB 직접 접근). 여러 코너의 재료가 필요하면 가족이 나눠서 동시에 가져올 수도 있습니다(**Promise.all 병렬 페칭**).\n\n" +
        "데이터가 필요한 곳에서 직접 가져오는 전략은 **각자 자기 재료는 자기가 챙기기**입니다. 엄마가 모든 재료를 한 번에 사서 나눠주는 대신(상위 컴포넌트에서 props 전달), 각자 필요한 코너에서 직접 가져옵니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "기존 React에서의 데이터 페칭에는 구조적인 문제가 있었습니다.\n\n" +
        "1. **클라이언트-서버 워터폴** — 브라우저가 JavaScript를 다운로드하고 실행한 후에야 데이터 요청이 시작됩니다. JS 다운로드 → 파싱 → 실행 → fetch → 응답 → 렌더링의 긴 체인이 발생합니다.\n\n" +
        "2. **컴포넌트 간 순차 워터폴** — 부모 컴포넌트의 `useEffect`가 완료된 후에야 자식 컴포넌트가 마운트되고, 자식의 `useEffect`가 실행됩니다. 3단계 깊이면 3번의 순차적 네트워크 요청이 발생합니다.\n\n" +
        "3. **상위 컴포넌트 데이터 집중** — 워터폴을 피하려고 최상위 컴포넌트에서 모든 데이터를 한 번에 가져와 props로 내려보내는 패턴이 생깁니다. 이는 컴포넌트 독립성을 해치고 prop drilling을 유발합니다.\n\n" +
        "4. **캐싱과 재검증의 복잡성** — 같은 데이터를 여러 컴포넌트에서 요청하면 중복 API 호출이 발생합니다. React Query 같은 외부 라이브러리에 의존해야 했습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Server Component에서는 `async/await`로 데이터를 직접 가져오며, Next.js의 확장된 fetch API가 캐싱과 재검증을 처리합니다.\n\n" +
        "### 1. async/await 직접 사용\n" +
        "Server Component는 async 함수이므로 `await fetch()`, `await db.query()` 등을 직접 호출합니다. `useEffect` + `useState` 패턴이 필요 없습니다.\n\n" +
        "### 2. fetch API 확장\n" +
        "Next.js는 네이티브 fetch에 옵션을 추가합니다:\n" +
        "- `{ next: { revalidate: 3600 } }` — 1시간마다 재검증\n" +
        "- `{ next: { tags: ['posts'] } }` — 태그 기반 캐시 무효화\n" +
        "- `{ cache: 'no-store' }` — 항상 최신 데이터\n\n" +
        "### 3. 병렬 페칭\n" +
        "`Promise.all`로 독립적인 데이터 요청을 동시에 실행하여 워터폴을 방지합니다.\n\n" +
        "### 4. 데이터가 필요한 곳에서 직접 요청\n" +
        "각 Server Component가 자신이 필요한 데이터를 직접 가져옵니다. Request Memoization이 같은 요청의 중복을 자동으로 제거하므로, 같은 데이터를 여러 곳에서 요청해도 실제 네트워크 요청은 한 번만 발생합니다.\n\n" +
        "### 5. ORM 직접 호출\n" +
        "Server Component에서는 Prisma, Drizzle 같은 ORM을 직접 호출하여 DB에 접근할 수 있습니다. REST API를 거칠 필요가 없습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 병렬 데이터 페칭과 워터폴 방지",
      content:
        "대시보드 페이지에서 여러 데이터 소스를 병렬로 가져오는 패턴입니다. 순차 워터폴과 병렬 페칭의 차이를 비교하고, 실제 성능 개선 효과를 확인합니다.",
      code: {
        language: "typescript",
        code:
          '// lib/data.ts\n' +
          'export async function getUser(id: string) {\n' +
          '  const res = await fetch(\n' +
          '    `https://api.example.com/users/${id}`,\n' +
          '    { next: { revalidate: 3600 } } // 1시간 캐시\n' +
          '  );\n' +
          '  return res.json();\n' +
          '}\n' +
          '\n' +
          'export async function getOrders(userId: string) {\n' +
          '  const res = await fetch(\n' +
          '    `https://api.example.com/users/${userId}/orders`,\n' +
          '    { next: { tags: ["orders"] } } // 태그 기반 캐시\n' +
          '  );\n' +
          '  return res.json();\n' +
          '}\n' +
          '\n' +
          'export async function getNotifications(userId: string) {\n' +
          '  const res = await fetch(\n' +
          '    `https://api.example.com/users/${userId}/notifications`,\n' +
          '    { cache: "no-store" } // 항상 최신 데이터\n' +
          '  );\n' +
          '  return res.json();\n' +
          '}\n' +
          '\n' +
          '// ❌ 순차 워터폴 — 총 소요시간: 1초 + 0.5초 + 0.3초 = 1.8초\n' +
          'async function DashboardSlow({ userId }: { userId: string }) {\n' +
          '  const user = await getUser(userId);           // 1초\n' +
          '  const orders = await getOrders(userId);       // 0.5초\n' +
          '  const notifications = await getNotifications(userId); // 0.3초\n' +
          '  // ...\n' +
          '}\n' +
          '\n' +
          '// ✅ 병렬 페칭 — 총 소요시간: max(1초, 0.5초, 0.3초) = 1초\n' +
          'export default async function DashboardPage({\n' +
          '  params,\n' +
          '}: {\n' +
          '  params: Promise<{ userId: string }>;\n' +
          '}) {\n' +
          '  const { userId } = await params;\n' +
          '\n' +
          '  // Promise.all로 동시에 요청\n' +
          '  const [user, orders, notifications] = await Promise.all([\n' +
          '    getUser(userId),\n' +
          '    getOrders(userId),\n' +
          '    getNotifications(userId),\n' +
          '  ]);\n' +
          '\n' +
          '  return (\n' +
          '    <main>\n' +
          '      <h1>{user.name}의 대시보드</h1>\n' +
          '      <section>\n' +
          '        <h2>주문 내역 ({orders.length})</h2>\n' +
          '        {/* ... */}\n' +
          '      </section>\n' +
          '      <section>\n' +
          '        <h2>알림 ({notifications.length})</h2>\n' +
          '        {/* ... */}\n' +
          '      </section>\n' +
          '    </main>\n' +
          '  );\n' +
          '}',
        description:
          "Promise.all로 독립적인 데이터 요청을 병렬로 실행하여 워터폴을 제거합니다. 캐싱 전략도 요청별로 다르게 설정합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 컴포넌트별 데이터 페칭과 ORM 직접 호출",
      content:
        "각 Server Component가 자신이 필요한 데이터를 직접 가져오는 패턴입니다. Prisma ORM을 직접 호출하여 DB에 접근하고, 각 컴포넌트가 독립적으로 데이터를 페칭합니다. Request Memoization 덕분에 같은 쿼리가 중복되어도 실제로는 한 번만 실행됩니다.",
      code: {
        language: "typescript",
        code:
          '// lib/queries.ts\n' +
          'import { db } from "@/lib/database";\n' +
          'import { cache } from "react";\n' +
          '\n' +
          '// React cache()로 같은 요청 중복 제거\n' +
          'export const getProduct = cache(async (id: string) => {\n' +
          '  return db.product.findUnique({\n' +
          '    where: { id },\n' +
          '    include: { category: true },\n' +
          '  });\n' +
          '});\n' +
          '\n' +
          'export const getRelatedProducts = cache(async (categoryId: string) => {\n' +
          '  return db.product.findMany({\n' +
          '    where: { categoryId },\n' +
          '    take: 4,\n' +
          '    orderBy: { sales: "desc" },\n' +
          '  });\n' +
          '});\n' +
          '\n' +
          '// components/ProductInfo.tsx (Server Component)\n' +
          'import { getProduct } from "@/lib/queries";\n' +
          '\n' +
          'export default async function ProductInfo({ id }: { id: string }) {\n' +
          '  const product = await getProduct(id);\n' +
          '  if (!product) return <p>상품을 찾을 수 없습니다.</p>;\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <h1>{product.name}</h1>\n' +
          '      <p>{product.description}</p>\n' +
          '      <span>{product.price.toLocaleString()}원</span>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// components/RelatedProducts.tsx (Server Component)\n' +
          'import { getProduct, getRelatedProducts } from "@/lib/queries";\n' +
          '\n' +
          'export default async function RelatedProducts({ id }: { id: string }) {\n' +
          '  // getProduct을 다시 호출해도 cache()로 중복 제거됨\n' +
          '  const product = await getProduct(id);\n' +
          '  if (!product) return null;\n' +
          '\n' +
          '  const related = await getRelatedProducts(product.categoryId);\n' +
          '\n' +
          '  return (\n' +
          '    <section>\n' +
          '      <h2>관련 상품</h2>\n' +
          '      <ul>\n' +
          '        {related.map((p) => (\n' +
          '          <li key={p.id}>{p.name}</li>\n' +
          '        ))}\n' +
          '      </ul>\n' +
          '    </section>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// app/products/[id]/page.tsx\n' +
          'import ProductInfo from "@/components/ProductInfo";\n' +
          'import RelatedProducts from "@/components/RelatedProducts";\n' +
          '\n' +
          'export default async function ProductPage({\n' +
          '  params,\n' +
          '}: {\n' +
          '  params: Promise<{ id: string }>;\n' +
          '}) {\n' +
          '  const { id } = await params;\n' +
          '  return (\n' +
          '    <main>\n' +
          '      <ProductInfo id={id} />\n' +
          '      <RelatedProducts id={id} />\n' +
          '    </main>\n' +
          '  );\n' +
          '}',
        description:
          "각 컴포넌트가 독립적으로 데이터를 페칭하고, React cache()가 같은 요청의 중복을 자동 제거합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 설명 | 사용 시점 |\n" +
        "|------|------|----------|\n" +
        "| async/await | Server Component에서 직접 데이터 페칭 | 기본 패턴 |\n" +
        "| Promise.all | 독립적 요청을 병렬로 실행 | 워터폴 방지 |\n" +
        "| next.revalidate | 시간 기반 캐시 재검증 | 주기적 갱신 데이터 |\n" +
        "| next.tags | 태그 기반 캐시 무효화 | 수동 갱신 |\n" +
        "| cache: 'no-store' | 항상 최신 데이터 | 실시간 데이터 |\n" +
        "| React cache() | 같은 요청 중복 제거 | ORM 직접 호출 시 |\n\n" +
        "**핵심:** Server Component에서 async/await로 데이터를 직접 가져옵니다. 워터폴을 피하려면 Promise.all로 병렬 페칭하고, 데이터는 필요한 컴포넌트에서 직접 요청하세요.\n\n" +
        "**다음 챕터 미리보기:** Next.js의 4가지 캐시 레이어(Request Memoization, Data Cache, Full Route Cache, Router Cache)의 동작 원리를 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Server Component에서 async/await로 데이터를 직접 가져온다. 워터폴을 피하려면 Promise.all로 병렬 페칭하고, 데이터는 필요한 컴포넌트에서 직접 요청하라.",
  checklist: [
    "Server Component에서 async/await로 데이터를 가져올 수 있다",
    "순차 워터폴과 병렬 페칭의 차이를 이해하고 Promise.all을 적용할 수 있다",
    "fetch의 next.revalidate, next.tags, cache 옵션을 사용할 수 있다",
    "React cache()로 ORM 호출의 중복을 제거할 수 있다",
    "데이터가 필요한 컴포넌트에서 직접 페칭하는 전략을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "Server Component에서 데이터를 가져오는 권장 방법은?",
      choices: [
        "useEffect + useState로 fetch",
        "getServerSideProps에서 fetch",
        "async/await로 직접 fetch 또는 DB 접근",
        "useSWR로 fetch",
      ],
      correctIndex: 2,
      explanation:
        "Server Component는 async 함수이므로 async/await로 fetch API나 ORM을 직접 호출할 수 있습니다. useEffect 패턴이 필요 없습니다.",
    },
    {
      id: "q2",
      question:
        "순차 워터폴을 방지하는 가장 효과적인 방법은?",
      choices: [
        "useEffect를 중첩한다",
        "Promise.all로 독립적 요청을 병렬 실행한다",
        "모든 데이터를 한 API에서 가져온다",
        "setTimeout으로 요청을 분산한다",
      ],
      correctIndex: 1,
      explanation:
        "서로 의존성이 없는 데이터 요청은 Promise.all로 묶어 병렬로 실행하면 총 소요 시간이 가장 긴 요청 하나의 시간으로 줄어듭니다.",
    },
    {
      id: "q3",
      question:
        "fetch에서 { next: { revalidate: 3600 } }의 의미는?",
      choices: [
        "3600바이트까지만 캐시한다",
        "3600밀리초 후 타임아웃한다",
        "3600초(1시간)마다 캐시를 재검증한다",
        "3600번까지 캐시를 재사용한다",
      ],
      correctIndex: 2,
      explanation:
        "next.revalidate는 초 단위의 시간 기반 캐시 재검증입니다. 3600은 1시간마다 캐시가 stale로 표시되고 다음 요청에서 백그라운드로 재검증됩니다.",
    },
    {
      id: "q4",
      question:
        "React의 cache() 함수의 역할은?",
      choices: [
        "브라우저 캐시를 관리한다",
        "같은 인자로 호출된 함수의 결과를 메모이제이션하여 중복 실행을 방지한다",
        "CDN 캐시를 설정한다",
        "localStorage에 데이터를 저장한다",
      ],
      correctIndex: 1,
      explanation:
        "React의 cache() 함수는 같은 인자로 호출된 함수의 결과를 메모이제이션합니다. 같은 요청 중에 여러 컴포넌트에서 동일한 함수를 호출해도 실제로는 한 번만 실행됩니다.",
    },
    {
      id: "q5",
      question:
        "데이터 페칭 위치에 대한 권장 전략은?",
      choices: [
        "최상위 layout에서 모든 데이터를 가져와 props로 내려보낸다",
        "전역 상태 관리 라이브러리에서 데이터를 관리한다",
        "데이터가 필요한 각 컴포넌트에서 직접 가져온다",
        "클라이언트 컴포넌트에서 useEffect로 가져온다",
      ],
      correctIndex: 2,
      explanation:
        "각 Server Component가 자신이 필요한 데이터를 직접 가져오는 것이 권장됩니다. Request Memoization이 같은 요청의 중복을 자동으로 제거하므로 성능 걱정 없이 독립적으로 페칭할 수 있습니다.",
    },
  ],
};

export default chapter;
