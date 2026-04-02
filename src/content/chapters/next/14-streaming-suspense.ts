import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "14-streaming-suspense",
  subject: "next",
  title: "스트리밍과 Suspense",
  description:
    "전통적 SSR의 워터폴 한계, 스트리밍을 통한 점진적 HTML 전송, loading.tsx와 Suspense의 관계, 수동 Suspense 배치, 스켈레톤 UI 패턴, 병렬 스트리밍을 학습합니다.",
  order: 14,
  group: "데이터 페칭과 캐싱",
  prerequisites: ["13-revalidation"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "스트리밍은 **레스토랑의 코스 요리**와 비슷합니다.\n\n" +
        "**전통적 SSR**은 모든 요리가 완성될 때까지 기다렸다가 한 번에 서빙하는 방식입니다. 디저트까지 다 만들어진 후에야 전채 요리를 받을 수 있습니다. 전채 요리는 이미 준비되었는데도 디저트 때문에 기다려야 합니다.\n\n" +
        "**스트리밍**은 준비된 요리부터 하나씩 서빙하는 코스 요리 방식입니다. 전채가 준비되면 바로 가져다주고, 메인 요리는 만들어지는 대로 서빙합니다. 손님은 처음부터 음식을 즐길 수 있습니다.\n\n" +
        "**Suspense**는 '이 요리는 아직 준비 중입니다'라는 안내 카드입니다. 빈 접시 대신 '잠시만 기다려주세요'라는 안내를 보여주고, 요리가 완성되면 안내 카드를 치우고 실제 요리를 놓습니다.\n\n" +
        "**스켈레톤 UI**는 그 안내 카드의 디자인입니다. 단순히 '로딩 중'이라고 쓰는 대신, 곧 나올 요리의 모양을 미리 보여주면 손님은 무엇이 올지 예상할 수 있어 기다림이 덜 지루합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "전통적 SSR에서는 페이지의 모든 데이터가 준비될 때까지 사용자가 빈 화면을 봐야 합니다.\n\n" +
        "1. **워터폴 문제** — 페이지에 3개의 데이터 요청이 있으면, 가장 느린 요청이 끝날 때까지 전체 페이지가 차단됩니다. 사용자 프로필(100ms), 추천 목록(500ms), 댓글(2초)이 있다면 2초 동안 아무것도 볼 수 없습니다.\n\n" +
        "2. **TTFB(Time To First Byte) 지연** — 서버에서 모든 렌더링이 완료된 후에야 첫 바이트가 전송되므로, 복잡한 페이지일수록 TTFB가 길어집니다.\n\n" +
        "3. **전부 아니면 전무(All-or-Nothing)** — 전통 SSR에서는 hydration도 페이지 전체에 대해 한 번에 일어납니다. 느린 컴포넌트 하나가 전체 페이지의 상호작용을 차단합니다.\n\n" +
        "4. **일괄 로딩 UX 저하** — 로딩 스피너 하나로 전체 페이지를 대체하면 사용자는 진행 상황을 전혀 알 수 없습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js는 스트리밍과 Suspense를 통해 점진적 렌더링을 구현합니다.\n\n" +
        "### 1. 스트리밍으로 점진적 HTML 전송\n" +
        "서버가 HTML을 한 번에 보내지 않고, 준비된 부분부터 청크 단위로 전송합니다. 브라우저는 받는 즉시 화면에 렌더링하므로 TTFB가 크게 개선됩니다.\n\n" +
        "**HTML 스트리밍의 내부 동작:**\n" +
        "React의 서버 렌더러는 `<Suspense>` 경계에 맞춰 HTML을 청크(chunk) 단위로 생성한다. 각 `<Suspense>` 경계는 독립적인 스트리밍 포인트가 된다. 서로 다른 경계의 컴포넌트들은 독립적으로 resolve되어 스트리밍되며, 서로를 블로킹하지 않는다.\n\n" +
        "예: Revenue가 200ms, RecentOrders가 1s, Recommendations가 3s 걸린다면, 사용자는 각 섹션이 데이터 준비되는 순서대로 나타나는 것을 본다.\n\n" +
        "**Selective Hydration:**\n" +
        "스트리밍은 **Selective Hydration**과 함께 동작한다. React는 사용자 상호작용을 기반으로 어떤 컴포넌트를 먼저 인터랙티브하게 만들지 우선순위를 정한다.\n\n" +
        "### 2. loading.tsx의 내부 원리\n" +
        "`loading.tsx` 파일을 만들면 Next.js가 자동으로 해당 라우트를 `<Suspense>`로 감쌉니다. `loading.tsx`의 내용이 fallback UI가 되어, 페이지 데이터가 준비될 때까지 대신 표시됩니다.\n\n" +
        "loading.tsx는 내부적으로 해당 page.tsx를 `<Suspense>`로 감싸는 것과 동일하다. Next.js App Router가 이를 자동으로 처리한다.\n\n" +
        "### 3. 수동 Suspense 배치\n" +
        "`loading.tsx`는 페이지 단위의 로딩입니다. 더 세밀한 제어가 필요하면 `<Suspense>` 경계를 직접 배치합니다. 느린 컴포넌트만 별도의 Suspense로 감싸면 나머지 빠른 부분은 즉시 표시됩니다.\n\n" +
        "수동으로 `<Suspense>`를 배치하면 loading.tsx보다 더 세밀한 스트리밍 제어가 가능하다. 전체 페이지가 아닌 특정 섹션 단위로 로딩 상태를 관리할 수 있다.\n\n" +
        "### 4. 스켈레톤 UI 패턴\n" +
        "Suspense의 fallback에 실제 콘텐츠와 유사한 형태의 스켈레톤을 배치하면, 레이아웃 시프트(CLS)를 줄이고 체감 로딩 속도를 개선합니다.\n\n" +
        "### 5. 병렬 스트리밍\n" +
        "여러 Suspense 경계를 독립적으로 배치하면, 각각이 병렬로 데이터를 가져오고 준비되는 순서대로 표시됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: loading.tsx와 Suspense",
      content:
        "loading.tsx가 내부적으로 Suspense로 변환되는 원리와, 수동으로 Suspense 경계를 배치하여 세밀한 스트리밍을 제어하는 방법을 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// 스트리밍 응답의 개념적 흐름\n' +
          '//\n' +
          '// 1단계: 즉시 전송 — 정적 셸 + Suspense fallback\n' +
          '// <html>\n' +
          '//   <body>\n' +
          '//     <h1>Dashboard</h1>\n' +
          '//     <div id="revenue">Loading revenue...</div>  ← fallback\n' +
          '//     <div id="orders">Loading orders...</div>     ← fallback\n' +
          '//   </body>\n' +
          '// </html>\n' +
          '//\n' +
          '// 2단계: Revenue 데이터 준비됨 (200ms 후) — 청크 전송\n' +
          '// <script>\n' +
          '//   // React가 #revenue의 fallback을 실제 콘텐츠로 교체\n' +
          '//   $RC("revenue", "<div>매출: 1,200만원</div>")\n' +
          '// </script>\n' +
          '//\n' +
          '// 3단계: Orders 데이터 준비됨 (1s 후) — 청크 전송\n' +
          '// <script>\n' +
          '//   $RC("orders", "<ul><li>주문 #1234</li>...</ul>")\n' +
          '// </script>\n' +
          '//\n' +
          '// 각 청크는 독립적으로 전송되며 서로를 블로킹하지 않음\n\n' +
          'import { Suspense } from \'react\';\n\n' +
          '// 각 Suspense 경계가 독립적 스트리밍 포인트\n' +
          'export default function Dashboard() {\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <h1>Dashboard</h1>\n' +
          '      {/* Revenue: 200ms — 가장 먼저 표시됨 */}\n' +
          '      <Suspense fallback={<RevenueSkeleton />}>\n' +
          '        <Revenue />\n' +
          '      </Suspense>\n' +
          '      {/* Orders: 1s — Revenue 다음에 표시 */}\n' +
          '      <Suspense fallback={<OrdersSkeleton />}>\n' +
          '        <RecentOrders />\n' +
          '      </Suspense>\n' +
          '      {/* Recommendations: 3s — 마지막에 표시 */}\n' +
          '      <Suspense fallback={<RecommendationsSkeleton />}>\n' +
          '        <Recommendations />\n' +
          '      </Suspense>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// === loading.tsx의 내부 동작 원리 ===\n\n' +
          '// app/dashboard/loading.tsx\n' +
          'export default function Loading() {\n' +
          '  return <div className="animate-pulse">대시보드 로딩 중...</div>;\n' +
          '}\n\n' +
          '// Next.js가 내부적으로 이렇게 변환합니다:\n' +
          '// <Suspense fallback={<Loading />}>\n' +
          '//   <DashboardPage />\n' +
          '// </Suspense>\n\n' +
          '// 각 컴포넌트는 서버 컴포넌트에서 async로 데이터를 가져옴\n' +
          'async function Revenue() {\n' +
          '  const data = await fetchRevenue(); // 200ms\n' +
          '  return <div>매출: {data.total}</div>;\n' +
          '}\n\n' +
          'async function RecentOrders() {\n' +
          '  const orders = await fetchOrders(); // 1000ms\n' +
          '  return <OrderList orders={orders} />;\n' +
          '}\n\n' +
          'async function Recommendations() {\n' +
          '  const recs = await fetchRecommendations(); // 3000ms\n' +
          '  return <RecList items={recs} />;\n' +
          '}',
        description:
          "스트리밍은 정적 셸과 fallback을 즉시 전송한 뒤, 각 Suspense 경계의 데이터가 준비되면 fallback을 실제 콘텐츠로 교체하는 스크립트 청크를 전송합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 스켈레톤 UI와 병렬 스트리밍",
      content:
        "대시보드 페이지에서 스켈레톤 UI를 적용하고, 여러 데이터 소스를 병렬로 스트리밍하는 패턴을 구현합니다. 각 섹션이 독립적으로 로딩되어 사용자 경험을 최적화합니다.",
      code: {
        language: "typescript",
        code:
          '// app/dashboard/components/skeletons.tsx\n' +
          'export function StatCardSkeleton() {\n' +
          '  return (\n' +
          '    <div className="animate-pulse rounded-lg border p-4">\n' +
          '      <div className="h-4 w-20 rounded bg-gray-200" />\n' +
          '      <div className="mt-2 h-8 w-16 rounded bg-gray-200" />\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          'export function ChartSkeleton() {\n' +
          '  return (\n' +
          '    <div className="animate-pulse rounded-lg border p-6">\n' +
          '      <div className="h-4 w-32 rounded bg-gray-200" />\n' +
          '      <div className="mt-4 h-64 rounded bg-gray-100" />\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// app/dashboard/page.tsx\n' +
          'import { Suspense } from "react";\n' +
          'import { StatCardSkeleton, ChartSkeleton } from "./components/skeletons";\n\n' +
          'export default function Dashboard() {\n' +
          '  return (\n' +
          '    <div className="space-y-6">\n' +
          '      <h1 className="text-2xl font-bold">대시보드</h1>\n\n' +
          '      {/* 통계 카드들: 빠르게 로딩 */}\n' +
          '      <div className="grid grid-cols-3 gap-4">\n' +
          '        <Suspense fallback={<StatCardSkeleton />}>\n' +
          '          <TotalUsers />\n' +
          '        </Suspense>\n' +
          '        <Suspense fallback={<StatCardSkeleton />}>\n' +
          '          <TotalRevenue />\n' +
          '        </Suspense>\n' +
          '        <Suspense fallback={<StatCardSkeleton />}>\n' +
          '          <ActiveSessions />\n' +
          '        </Suspense>\n' +
          '      </div>\n\n' +
          '      {/* 차트: 느린 데이터지만 독립적으로 스트리밍 */}\n' +
          '      <Suspense fallback={<ChartSkeleton />}>\n' +
          '        <RevenueChart />\n' +
          '      </Suspense>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// 서버 컴포넌트: async로 데이터 페칭\n' +
          'async function TotalUsers() {\n' +
          '  const data = await fetch("https://api.example.com/stats/users").then(\n' +
          '    (res) => res.json()\n' +
          '  );\n' +
          '  return (\n' +
          '    <div className="rounded-lg border p-4">\n' +
          '      <p className="text-sm text-gray-500">총 사용자</p>\n' +
          '      <p className="text-2xl font-bold">{data.total.toLocaleString()}</p>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          'async function RevenueChart() {\n' +
          '  const data = await fetch("https://api.example.com/stats/revenue").then(\n' +
          '    (res) => res.json()\n' +
          '  );\n' +
          '  return (\n' +
          '    <div className="rounded-lg border p-6">\n' +
          '      <h2 className="font-semibold">매출 추이</h2>\n' +
          '      <Chart data={data.monthly} />\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "스켈레톤 UI로 로딩 상태를 시각적으로 표현하고, 각 Suspense 경계가 독립적으로 스트리밍되어 빠른 부분부터 표시됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| 스트리밍 | 서버에서 HTML을 준비된 부분부터 점진적으로 전송 |\n" +
        "| loading.tsx | 페이지 전체를 자동으로 Suspense로 감싸는 파일 규칙 |\n" +
        "| Suspense | 비동기 컴포넌트의 로딩 상태를 선언적으로 처리하는 React 기능 |\n" +
        "| 스켈레톤 UI | 실제 콘텐츠와 유사한 형태의 로딩 플레이스홀더 |\n" +
        "| 병렬 스트리밍 | 여러 Suspense 경계가 독립적으로 데이터를 로딩하고 표시 |\n\n" +
        "**핵심:** 스트리밍은 페이지를 한 번에 보내지 않고 준비된 부분부터 점진적으로 전송한다. Suspense 경계를 전략적으로 배치하면 사용자는 전체 데이터를 기다리지 않아도 된다.\n\n" +
        "**다음 챕터 미리보기:** 동적 라우트를 활용하여 [slug], [...slug], [[...slug]] 패턴으로 유연한 URL 구조를 만드는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "스트리밍은 Suspense 경계에 맞춰 HTML을 청크 단위로 점진 전송한다. 각 Suspense 경계는 독립적 스트리밍 포인트로, 데이터가 준비되면 fallback을 실제 콘텐츠로 교체하는 스크립트가 전송된다.",
  checklist: [
    "전통적 SSR의 워터폴 문제가 무엇인지 설명할 수 있다",
    "loading.tsx가 내부적으로 Suspense로 변환되는 원리를 이해한다",
    "수동 Suspense 경계를 배치하여 세밀한 스트리밍을 구현할 수 있다",
    "스켈레톤 UI가 UX를 개선하는 원리를 설명할 수 있다",
    "여러 Suspense 경계를 활용한 병렬 스트리밍 패턴을 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "전통적 SSR에서 스트리밍이 해결하는 핵심 문제는?",
      choices: [
        "CSS가 늦게 로딩되는 문제",
        "모든 데이터가 준비될 때까지 아무것도 표시되지 않는 문제",
        "JavaScript 번들 크기가 큰 문제",
        "이미지 최적화 문제",
      ],
      correctIndex: 1,
      explanation:
        "전통적 SSR은 서버에서 모든 데이터 페칭과 렌더링이 완료된 후에야 HTML을 전송합니다. 스트리밍은 준비된 부분부터 점진적으로 전송하여 이 문제를 해결합니다.",
    },
    {
      id: "q2",
      question: "loading.tsx 파일의 내부 동작은?",
      choices: [
        "클라이언트에서 스피너를 표시한다",
        "해당 라우트의 page를 자동으로 Suspense로 감싸고 fallback으로 사용한다",
        "서버에서 데이터 페칭을 지연시킨다",
        "캐시된 페이지를 먼저 보여준다",
      ],
      correctIndex: 1,
      explanation:
        "Next.js는 loading.tsx가 있으면 자동으로 해당 라우트의 page.tsx를 <Suspense fallback={<Loading />}>로 감쌉니다.",
    },
    {
      id: "q3",
      question: "수동 Suspense 배치가 loading.tsx보다 유리한 상황은?",
      choices: [
        "페이지에 데이터 페칭이 없을 때",
        "페이지의 각 섹션이 서로 다른 속도로 로딩될 때",
        "정적 페이지를 만들 때",
        "클라이언트 컴포넌트만 있을 때",
      ],
      correctIndex: 1,
      explanation:
        "loading.tsx는 페이지 전체를 하나의 Suspense로 감쌉니다. 섹션별 로딩 속도가 다르면 수동 Suspense로 세밀하게 경계를 나누어 빠른 부분부터 표시할 수 있습니다.",
    },
    {
      id: "q4",
      question: "스켈레톤 UI의 주된 목적은?",
      choices: [
        "서버 부하를 줄인다",
        "실제 콘텐츠 형태를 미리 보여줘 체감 로딩 속도를 개선한다",
        "SEO를 향상시킨다",
        "캐시 히트율을 높인다",
      ],
      correctIndex: 1,
      explanation:
        "스켈레톤 UI는 실제 콘텐츠와 유사한 형태의 플레이스홀더를 보여줘 레이아웃 시프트를 줄이고, 사용자의 체감 로딩 속도를 개선합니다.",
    },
    {
      id: "q5",
      question: "병렬 스트리밍에서 각 Suspense 경계의 특성은?",
      choices: [
        "순서대로 하나씩 해제된다",
        "가장 느린 것이 완료되면 모두 동시에 해제된다",
        "각각 독립적으로 데이터를 로딩하고 준비되는 순서대로 해제된다",
        "첫 번째 것이 해제된 후 나머지가 시작된다",
      ],
      correctIndex: 2,
      explanation:
        "각 Suspense 경계는 독립적으로 동작합니다. 내부 컴포넌트의 데이터 페칭이 완료되면 해당 경계만 해제되어 콘텐츠가 표시되므로, 빠른 것부터 순서 없이 나타납니다.",
    },
  ],
};

export default chapter;
