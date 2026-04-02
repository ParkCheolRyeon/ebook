import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "09-server-client-composition",
  subject: "next",
  title: "서버-클라이언트 합성 패턴",
  description:
    "Server Component와 Client Component를 효과적으로 조합하는 패턴을 학습합니다. children 패턴, 도넛 패턴, 경계 최소화 전략 등 실무에서 바로 적용할 수 있는 합성 기법을 다룹니다.",
  order: 9,
  group: "서버와 클라이언트",
  prerequisites: ["08-client-components"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "서버-클라이언트 합성은 **액자와 그림**의 관계와 같습니다.\n\n" +
        "**도넛 패턴**을 생각해보세요. 도넛의 바깥 반죽(Server Component)이 구조를 잡고, 가운데 구멍에 크림(Client Component)을 채워 넣습니다. 크림 안에 다시 토핑(Server Component)을 올릴 수도 있습니다.\n\n" +
        "더 구체적으로, **액자 가게**를 상상해보세요. 액자(Client Component - 인터랙티브 wrapper)는 가게에서 만들어 고객에게 보냅니다. 하지만 액자 안에 넣을 **그림(Server Component - 콘텐츠)**은 화가의 작업실(서버)에서 완성되어 직접 전달됩니다.\n\n" +
        "핵심 규칙이 있습니다. 액자 가게(Client Component)에서 화가의 작업실(Server Component)에 직접 들어가 그림을 가져올 수는 없습니다. 대신 누군가(부모 Server Component)가 완성된 그림을 액자 가게에 **전달(children props)**해줘야 합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "Server Component와 Client Component를 조합할 때 몇 가지 제약이 있습니다.\n\n" +
        "1. **Client Component에서 Server Component import 불가** — Client Component 파일에서 Server Component를 직접 import하면 해당 Server Component도 클라이언트 번들에 포함됩니다. 서버 전용 코드(DB 접근 등)가 있으면 에러가 발생합니다.\n\n" +
        "2. **\"use client\" 경계의 확산** — 하나의 컴포넌트에 \"use client\"를 붙이면 하위 import 전체가 클라이언트로 넘어갑니다. 무심코 상위에 붙이면 대부분의 컴포넌트가 Client Component가 되어 Server Component의 장점을 잃습니다.\n\n" +
        "3. **레이아웃 구조의 딜레마** — 인터랙티브한 사이드바(토글, 아코디언)를 만들고 싶지만, 사이드바 안의 네비게이션 목록은 서버에서 DB를 조회해야 합니다. 전체를 Client Component로 만들자니 DB 접근이 안 되고, Server Component로 두자니 토글이 안 됩니다.\n\n" +
        "이런 상황에서 두 유형의 컴포넌트를 효과적으로 조합하는 패턴이 필요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. Children 패턴 (Composition)\n" +
        "Server Component가 Client Component를 렌더링하면서, 다른 Server Component를 `children`으로 전달합니다. Client Component는 `children`을 그대로 렌더링만 하면 됩니다.\n\n" +
        "### 2. 도넛 패턴\n" +
        "바깥 껍질은 Server Component(데이터 페칭), 가운데는 Client Component(인터랙션), 그 안에 다시 Server Component(콘텐츠)를 children으로 주입합니다. 마치 도넛처럼 서버-클라이언트-서버가 중첩됩니다.\n\n" +
        "### 3. 경계 최소화 전략\n" +
        "- 인터랙티브한 부분만 별도의 Client Component로 추출\n" +
        "- 페이지/레이아웃은 Server Component로 유지\n" +
        "- Client Component에는 최소한의 로직만 담기\n\n" +
        "### 핵심 규칙\n" +
        "- Server Component **안에** Client Component를 넣을 수 있다 (직접 렌더링)\n" +
        "- Client Component **안에** Server Component를 넣으려면 **props(children)으로 전달**해야 한다\n" +
        "- Client Component에서 Server Component를 **import해서 직접 렌더링하면 안 된다**\n\n" +
        "### RSC Payload에서의 합성\n" +
        "서버에서 렌더링할 때, Server Component는 결과가 RSC Payload에 직접 포함됩니다. 반면 Client Component는 **client-reference**(모듈 참조 + props)로 표현됩니다.\n\n" +
        "도넛 패턴에서 부모 Server Component가 `<CollapsiblePanel><NavLinks /></CollapsiblePanel>`을 렌더링하면:\n" +
        "1. `NavLinks`(Server Component)가 먼저 서버에서 완전히 렌더링됩니다\n" +
        "2. `CollapsiblePanel`(Client Component)은 client-reference로 기록됩니다\n" +
        "3. 렌더링된 `NavLinks` 결과가 `CollapsiblePanel`의 children props로 RSC Payload에 포함됩니다\n" +
        "4. 클라이언트에서 `CollapsiblePanel`이 hydration될 때, children으로 받은 서버 렌더링 결과를 그대로 표시합니다\n\n" +
        "이것이 '직접 import'가 안 되는 이유입니다. Client Component 파일에서 Server Component를 import하면, 번들러가 해당 코드를 클라이언트 번들에 포함시키려 합니다. 하지만 Server Component에 DB 접근 같은 서버 전용 코드가 있으면 클라이언트에서 실행할 수 없어 에러가 발생합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 도넛 패턴",
      content:
        "인터랙티브한 사이드바(토글 가능) 안에 서버에서 가져온 네비게이션 데이터를 표시하는 도넛 패턴을 구현합니다. 사이드바의 열림/닫힘은 Client Component가 담당하고, 네비게이션 내용은 Server Component가 DB에서 가져옵니다.",
      code: {
        language: "typescript",
        code:
          '// 1. Client Component: 인터랙티브 wrapper만 담당\n' +
          '// components/CollapsiblePanel.tsx\n' +
          '"use client";\n' +
          '\n' +
          'import { useState, type ReactNode } from "react";\n' +
          '\n' +
          'interface Props {\n' +
          '  title: string;\n' +
          '  children: ReactNode; // Server Component가 주입됨\n' +
          '}\n' +
          '\n' +
          'export default function CollapsiblePanel({ title, children }: Props) {\n' +
          '  const [isOpen, setIsOpen] = useState(true);\n' +
          '\n' +
          '  return (\n' +
          '    <aside>\n' +
          '      <button onClick={() => setIsOpen(!isOpen)}>\n' +
          '        {title} {isOpen ? "접기" : "펼치기"}\n' +
          '      </button>\n' +
          '      {isOpen && <div>{children}</div>}\n' +
          '    </aside>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 2. Server Component: DB에서 데이터를 가져옴\n' +
          '// components/NavLinks.tsx (Server Component)\n' +
          'import { db } from "@/lib/database";\n' +
          'import Link from "next/link";\n' +
          '\n' +
          'export default async function NavLinks() {\n' +
          '  const categories = await db.category.findMany({\n' +
          '    orderBy: { name: "asc" },\n' +
          '  });\n' +
          '\n' +
          '  return (\n' +
          '    <nav>\n' +
          '      <ul>\n' +
          '        {categories.map((cat) => (\n' +
          '          <li key={cat.id}>\n' +
          '            <Link href={`/category/${cat.slug}`}>{cat.name}</Link>\n' +
          '          </li>\n' +
          '        ))}\n' +
          '      </ul>\n' +
          '    </nav>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 3. 부모 Server Component: 도넛 패턴으로 조합\n' +
          '// app/layout.tsx (Server Component)\n' +
          'import CollapsiblePanel from "@/components/CollapsiblePanel";\n' +
          'import NavLinks from "@/components/NavLinks";\n' +
          '\n' +
          'export default function RootLayout({\n' +
          '  children,\n' +
          '}: {\n' +
          '  children: React.ReactNode;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <html lang="ko">\n' +
          '      <body>\n' +
          '        {/* 도넛 패턴: Server → Client → Server */}\n' +
          '        <CollapsiblePanel title="카테고리">\n' +
          '          <NavLinks /> {/* Server Component를 children으로 주입 */}\n' +
          '        </CollapsiblePanel>\n' +
          '        <main>{children}</main>\n' +
          '      </body>\n' +
          '    </html>\n' +
          '  );\n' +
          '}',
        description:
          "Server Component(layout) → Client Component(CollapsiblePanel) → Server Component(NavLinks)로 이어지는 도넛 패턴입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 탭 컴포넌트 합성 패턴",
      content:
        "탭 UI를 합성 패턴으로 구현합니다. 탭 전환 인터랙션은 Client Component가 담당하고, 각 탭의 콘텐츠는 Server Component에서 데이터를 가져와 렌더링합니다. 이를 통해 인터랙션과 데이터 페칭의 관심사를 완전히 분리할 수 있습니다.",
      code: {
        language: "typescript",
        code:
          '// components/Tabs.tsx\n' +
          '"use client";\n' +
          '\n' +
          'import { useState, type ReactNode } from "react";\n' +
          '\n' +
          'interface Tab {\n' +
          '  key: string;\n' +
          '  label: string;\n' +
          '  content: ReactNode; // Server Component를 받을 수 있음\n' +
          '}\n' +
          '\n' +
          'export default function Tabs({ tabs }: { tabs: Tab[] }) {\n' +
          '  const [activeKey, setActiveKey] = useState(tabs[0]?.key ?? "");\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <div role="tablist">\n' +
          '        {tabs.map((tab) => (\n' +
          '          <button\n' +
          '            key={tab.key}\n' +
          '            role="tab"\n' +
          '            aria-selected={activeKey === tab.key}\n' +
          '            onClick={() => setActiveKey(tab.key)}\n' +
          '          >\n' +
          '            {tab.label}\n' +
          '          </button>\n' +
          '        ))}\n' +
          '      </div>\n' +
          '      <div role="tabpanel">\n' +
          '        {tabs.find((tab) => tab.key === activeKey)?.content}\n' +
          '      </div>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// app/dashboard/page.tsx (Server Component)\n' +
          'import Tabs from "@/components/Tabs";\n' +
          'import { db } from "@/lib/database";\n' +
          '\n' +
          'async function RecentOrders() {\n' +
          '  const orders = await db.order.findMany({\n' +
          '    take: 5,\n' +
          '    orderBy: { createdAt: "desc" },\n' +
          '  });\n' +
          '  return (\n' +
          '    <ul>\n' +
          '      {orders.map((o) => (\n' +
          '        <li key={o.id}>{o.title} - {o.status}</li>\n' +
          '      ))}\n' +
          '    </ul>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'async function TopProducts() {\n' +
          '  const products = await db.product.findMany({\n' +
          '    take: 5,\n' +
          '    orderBy: { sales: "desc" },\n' +
          '  });\n' +
          '  return (\n' +
          '    <ul>\n' +
          '      {products.map((p) => (\n' +
          '        <li key={p.id}>{p.name} - {p.sales}건</li>\n' +
          '      ))}\n' +
          '    </ul>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'export default async function DashboardPage() {\n' +
          '  // Server Component에서 탭 콘텐츠를 미리 렌더링하여 전달\n' +
          '  return (\n' +
          '    <Tabs\n' +
          '      tabs={[\n' +
          '        {\n' +
          '          key: "orders",\n' +
          '          label: "최근 주문",\n' +
          '          content: <RecentOrders />,\n' +
          '        },\n' +
          '        {\n' +
          '          key: "products",\n' +
          '          label: "인기 상품",\n' +
          '          content: <TopProducts />,\n' +
          '        },\n' +
          '      ]}\n' +
          '    />\n' +
          '  );\n' +
          '}',
        description:
          "Tabs Client Component는 탭 전환만 담당하고, 각 탭의 콘텐츠는 Server Component에서 DB 데이터를 가져와 props로 전달합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 설명 | 사용 사례 |\n" +
        "|------|------|----------|\n" +
        "| Children 패턴 | SC를 CC의 children으로 전달 | 레이아웃, 모달 |\n" +
        "| 도넛 패턴 | SC → CC → SC 중첩 | 인터랙티브 wrapper + 서버 콘텐츠 |\n" +
        "| 말단 분리 | 인터랙티브 부분만 CC로 추출 | 버튼, 폼, 토글 |\n" +
        "| Props 전달 | SC 결과를 CC의 props로 전달 | 탭, 캐러셀 |\n\n" +
        "**핵심:** Client Component 안에 Server Component를 넣으려면 직접 import가 아닌 children/props로 전달해야 합니다. 도넛 패턴이 가장 효과적인 합성 전략입니다.\n\n" +
        "**다음 챕터 미리보기:** 서버에서 실행되는 함수를 클라이언트에서 직접 호출하는 Server Actions를 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "서버 컴포넌트가 클라이언트 컴포넌트를 감싸고, 다른 서버 컴포넌트를 children으로 주입하는 '도넛 패턴'이 핵심이다. RSC Payload에서 서버 컴포넌트는 렌더링 결과로, 클라이언트 컴포넌트는 모듈 참조로 표현된다.",
  checklist: [
    "Client Component에서 Server Component를 직접 import할 수 없는 이유를 설명할 수 있다",
    "children 패턴으로 Server Component를 Client Component에 주입할 수 있다",
    "도넛 패턴(SC → CC → SC)을 실무에 적용할 수 있다",
    "\"use client\" 경계를 최소화하는 전략을 이해한다",
    "인터랙티브 wrapper와 서버 콘텐츠를 분리하여 설계할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "Client Component에서 Server Component를 사용하려면?",
      choices: [
        "직접 import해서 렌더링한다",
        "dynamic import를 사용한다",
        "부모 Server Component에서 children/props로 전달한다",
        "\"use server\"를 추가한다",
      ],
      correctIndex: 2,
      explanation:
        "Client Component에서 Server Component를 직접 import하면 클라이언트 번들에 포함됩니다. 부모 Server Component에서 children이나 props로 전달해야 합니다.",
    },
    {
      id: "q2",
      question: "도넛 패턴의 올바른 구조는?",
      choices: [
        "Client → Server → Client",
        "Server → Client → Server (children)",
        "Server → Server → Client",
        "Client → Client → Server",
      ],
      correctIndex: 1,
      explanation:
        "도넛 패턴은 바깥 Server Component가 Client Component를 감싸고, Client Component의 children으로 다른 Server Component를 주입하는 구조입니다.",
    },
    {
      id: "q3",
      question:
        "다음 코드의 문제점은?\n\n// ClientWrapper.tsx\n\"use client\";\nimport ServerContent from './ServerContent'; // DB 접근 포함\nexport default function ClientWrapper() {\n  return <ServerContent />;\n}",
      choices: [
        "문법 오류가 있다",
        "ServerContent가 클라이언트 번들에 포함되어 DB 접근 코드가 에러를 일으킨다",
        "\"use client\"의 위치가 잘못되었다",
        "export 방식이 잘못되었다",
      ],
      correctIndex: 1,
      explanation:
        "\"use client\" 파일에서 import한 모듈은 클라이언트 번들에 포함됩니다. DB 접근 같은 서버 전용 코드가 클라이언트에서 실행되어 에러가 발생합니다.",
    },
    {
      id: "q4",
      question:
        "\"use client\" 경계를 최소화해야 하는 이유는?",
      choices: [
        "코드 가독성을 위해",
        "클라이언트 번들 크기를 줄이고 Server Component의 장점을 유지하기 위해",
        "타입스크립트 호환성을 위해",
        "서버 부하를 줄이기 위해",
      ],
      correctIndex: 1,
      explanation:
        "\"use client\" 경계 아래의 모든 import가 클라이언트 번들에 포함되므로, 경계를 최소화해야 번들 크기를 줄이고 Server Component의 장점(번들 제외, 직접 데이터 접근)을 유지할 수 있습니다.",
    },
    {
      id: "q5",
      question:
        "RSC Payload에서 Client Component는 어떻게 표현되나?",
      choices: [
        "완전히 렌더링된 HTML",
        "클라이언트 JS 번들의 모듈 참조(client-reference)와 props",
        "Server Component와 동일한 형태",
        "빈 placeholder만 포함",
      ],
      correctIndex: 1,
      explanation:
        "RSC Payload에서 Server Component는 렌더링 결과가 직접 포함되지만, Client Component는 해당 JS 파일의 모듈 참조(client-reference)와 전달받은 props로 표현됩니다. 클라이언트에서 이 참조를 기반으로 실제 컴포넌트를 로드하고 hydration합니다.",
    },
  ],
};

export default chapter;
