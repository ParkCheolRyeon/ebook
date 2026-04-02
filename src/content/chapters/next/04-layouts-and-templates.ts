import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "04-layouts-and-templates",
  subject: "next",
  title: "레이아웃과 템플릿",
  description:
    "layout.tsx의 중첩 동작, Root Layout의 역할, template.tsx와의 차이, metadata export를 활용한 SEO 설정을 학습합니다.",
  order: 4,
  group: "기초",
  prerequisites: ["03-file-based-routing"],
  estimatedMinutes: 22,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "`layout.tsx`는 **건물의 골조**와 같습니다.\n\n" +
        "오피스 빌딩의 각 층은 엘리베이터, 복도, 비상구라는 공통 구조(layout)를 공유합니다. " +
        "5층에서 6층으로 이동해도 엘리베이터와 복도를 새로 만들지 않습니다. 각 층의 사무실(page) 내부만 다를 뿐입니다. " +
        "이것이 **layout이 네비게이션 시 리렌더되지 않는 것**과 같습니다.\n\n" +
        "`template.tsx`는 **호텔의 객실 청소**와 같습니다. 같은 구조의 방이지만, " +
        "손님이 바뀔 때마다 시트를 갈고 어메니티를 교체합니다. **매번 새로 마운트**되므로, " +
        "이전 손님(이전 페이지)의 상태가 남아있지 않습니다.\n\n" +
        "중첩 레이아웃은 **러시안 인형(마트료시카)**과 같습니다. 가장 큰 인형(Root Layout)이 " +
        "전체를 감싸고, 그 안에 중간 인형(섹션 Layout), 가장 안에 작은 인형(Page)이 들어있습니다. " +
        "각 인형은 자신보다 작은 인형들을 품고 있으며, 바깥 인형을 열지 않고도 안쪽 인형만 교체할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "웹 애플리케이션에서 공통 UI 요소를 관리하는 것은 생각보다 복잡합니다.\n\n" +
        "### 1. 공통 UI 중복\n" +
        "헤더, 사이드바, 푸터 같은 공통 요소를 모든 페이지에서 반복적으로 렌더링합니다. " +
        "React에서는 각 페이지 컴포넌트 안에 `<Header />`를 넣거나, App 컴포넌트에서 감싸는 방식을 사용하지만, " +
        "섹션별로 다른 레이아웃이 필요하면(예: 대시보드는 사이드바, 마케팅 페이지는 전폭) 조건 분기가 복잡해집니다.\n\n" +
        "### 2. 불필요한 리렌더링\n" +
        "페이지가 바뀔 때 헤더나 사이드바까지 매번 리렌더링되면 깜빡임이 발생하고 성능이 저하됩니다. " +
        "특히 사이드바의 스크롤 위치, 검색 입력값 같은 **상태가 초기화**되는 문제가 있습니다.\n\n" +
        "### 3. 중첩 레이아웃의 어려움\n" +
        "'/dashboard'는 사이드바 레이아웃, '/dashboard/settings'는 사이드바 + 탭 레이아웃처럼 " +
        "레이아웃이 중첩되어야 할 때, React Router에서는 `<Outlet />`과 중첩 라우트 설정이 필요합니다.\n\n" +
        "### 4. 메타데이터 관리\n" +
        "각 페이지의 title, description, OG 이미지 등 SEO 메타데이터를 페이지별로 다르게 설정하면서도 " +
        "공통 기본값을 유지하는 것이 번거롭습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js는 `layout.tsx`와 `template.tsx` 두 가지 특수 파일로 이 문제들을 해결합니다.\n\n" +
        "### layout.tsx — 상태를 유지하는 공유 UI\n" +
        "- 자식 라우트 간에 **공유**되며, 네비게이션 시 **리렌더되지 않음**\n" +
        "- 사이드바 스크롤 위치, 입력 필드 값 등 **상태가 유지**됨\n" +
        "- `children` prop으로 자식 페이지나 하위 레이아웃을 받음\n" +
        "- 각 폴더에 `layout.tsx`를 두면 자동으로 **중첩**됨\n\n" +
        "### Root Layout (필수)\n" +
        "- `app/layout.tsx`는 **반드시 있어야** 하며, `<html>`과 `<body>` 태그를 포함해야 함\n" +
        "- 모든 페이지에 적용되는 전역 스타일, 폰트, 프로바이더를 여기서 설정\n\n" +
        "### template.tsx — 매번 새로 마운트되는 공유 UI\n" +
        "- layout과 동일한 역할이지만, **네비게이션 시 매번 새 인스턴스가 생성**됨\n" +
        "- 페이지 진입 애니메이션, 페이지별 피드백 폼 등 매번 초기화가 필요할 때 사용\n" +
        "- useEffect가 매번 실행되므로 페이지 뷰 로깅에도 유용\n\n" +
        "### metadata export\n" +
        "- `layout.tsx`나 `page.tsx`에서 `metadata` 객체 또는 `generateMetadata` 함수를 export하여 " +
        "각 라우트의 title, description, OG 이미지를 설정\n" +
        "- 하위 라우트의 metadata가 상위를 **자동 병합/덮어쓰기**",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 중첩 레이아웃과 metadata",
      content:
        "대시보드 앱의 중첩 레이아웃을 구현합니다. 전역 헤더, 대시보드 사이드바, " +
        "설정 탭이 중첩되는 구조와, 각 레벨에서 metadata가 어떻게 병합되는지 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// 파일 구조:\n' +
          '// app/\n' +
          '// ├── layout.tsx          ← Root Layout (헤더, <html>, <body>)\n' +
          '// ├── page.tsx            ← "/" 홈페이지\n' +
          '// └── dashboard/\n' +
          '//     ├── layout.tsx      ← Dashboard Layout (사이드바)\n' +
          '//     ├── page.tsx        ← "/dashboard"\n' +
          '//     └── settings/\n' +
          '//         ├── layout.tsx  ← Settings Layout (탭)\n' +
          '//         └── page.tsx    ← "/dashboard/settings"\n\n' +
          '// === app/layout.tsx (Root Layout) ===\n' +
          'import type { Metadata } from "next";\n\n' +
          'export const metadata: Metadata = {\n' +
          '  title: {\n' +
          '    template: "%s | 내 앱",  // 하위에서 title만 바꾸면 자동 조합\n' +
          '    default: "내 앱",\n' +
          '  },\n' +
          '  description: "Next.js 대시보드 애플리케이션",\n' +
          '};\n\n' +
          'export default function RootLayout({\n' +
          '  children,\n' +
          '}: {\n' +
          '  children: React.ReactNode;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <html lang="ko">\n' +
          '      <body>\n' +
          '        <header>글로벌 헤더</header>\n' +
          '        {children}   {/* 여기에 dashboard/layout.tsx가 들어옴 */}\n' +
          '      </body>\n' +
          '    </html>\n' +
          '  );\n' +
          '}\n\n' +
          '// === app/dashboard/layout.tsx ===\n' +
          'export const metadata: Metadata = {\n' +
          '  title: "대시보드",  // → "대시보드 | 내 앱"\n' +
          '};\n\n' +
          'export default function DashboardLayout({\n' +
          '  children,\n' +
          '}: {\n' +
          '  children: React.ReactNode;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <div className="flex">\n' +
          '      <aside className="w-64">\n' +
          '        <nav>\n' +
          '          <a href="/dashboard">개요</a>\n' +
          '          <a href="/dashboard/settings">설정</a>\n' +
          '        </nav>\n' +
          '      </aside>\n' +
          '      <main className="flex-1">\n' +
          '        {children}   {/* settings/layout.tsx 또는 page.tsx */}\n' +
          '      </main>\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "중첩 레이아웃에서 각 layout.tsx는 자식을 children으로 받아 감싸며, metadata는 하위 라우트가 상위를 자동 병합합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: layout vs template 비교",
      content:
        "layout.tsx와 template.tsx의 차이를 직접 확인합니다. " +
        "layout은 네비게이션 시 상태를 유지하지만, template은 매번 새로 마운트되는 것을 확인합니다. " +
        "또한 generateMetadata를 사용하여 동적 메타데이터를 생성하는 방법을 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// === layout.tsx를 사용한 경우 ===\n' +
          '// app/docs/layout.tsx\n' +
          '"use client";\n' +
          'import { useState } from "react";\n\n' +
          'export default function DocsLayout({\n' +
          '  children,\n' +
          '}: {\n' +
          '  children: React.ReactNode;\n' +
          '}) {\n' +
          '  // 이 상태는 /docs/intro → /docs/guide 이동 시에도 유지됨!\n' +
          '  const [searchQuery, setSearchQuery] = useState("");\n\n' +
          '  return (\n' +
          '    <div className="flex">\n' +
          '      <aside>\n' +
          '        <input\n' +
          '          value={searchQuery}\n' +
          '          onChange={e => setSearchQuery(e.target.value)}\n' +
          '          placeholder="문서 검색..."\n' +
          '        />\n' +
          '        <nav>...</nav>\n' +
          '      </aside>\n' +
          '      <main>{children}</main>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// === template.tsx를 사용한 경우 ===\n' +
          '// app/onboarding/template.tsx\n' +
          '"use client";\n' +
          'import { useEffect } from "react";\n\n' +
          'export default function OnboardingTemplate({\n' +
          '  children,\n' +
          '}: {\n' +
          '  children: React.ReactNode;\n' +
          '}) {\n' +
          '  // 매 페이지 이동마다 실행됨 → 페이지 뷰 추적에 적합\n' +
          '  useEffect(() => {\n' +
          '    console.log("온보딩 페이지 진입");\n' +
          '    // analytics.trackPageView();\n' +
          '  }, []);\n\n' +
          '  return (\n' +
          '    <div className="animate-fadeIn">\n' +
          '      {/* 매번 새로 마운트 → 진입 애니메이션이 매번 재생 */}\n' +
          '      {children}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// === 동적 metadata 생성 ===\n' +
          '// app/blog/[slug]/page.tsx\n' +
          'import type { Metadata } from "next";\n\n' +
          'interface Props {\n' +
          '  params: Promise<{ slug: string }>;\n' +
          '}\n\n' +
          'export async function generateMetadata(\n' +
          '  { params }: Props\n' +
          '): Promise<Metadata> {\n' +
          '  const { slug } = await params;\n' +
          '  const post = await fetch(\n' +
          '    `https://api.example.com/posts/${slug}`\n' +
          '  ).then(res => res.json());\n\n' +
          '  return {\n' +
          '    title: post.title,\n' +
          '    description: post.excerpt,\n' +
          '    openGraph: {\n' +
          '      images: [post.coverImage],\n' +
          '    },\n' +
          '  };\n' +
          '}\n\n' +
          'export default async function BlogPost({ params }: Props) {\n' +
          '  const { slug } = await params;\n' +
          '  const post = await fetch(\n' +
          '    `https://api.example.com/posts/${slug}`\n' +
          '  ).then(res => res.json());\n\n' +
          '  return <article><h1>{post.title}</h1></article>;\n' +
          '}',
        description:
          "layout은 상태를 유지하고 리렌더되지 않는 반면, template은 매번 새로 마운트됩니다. generateMetadata로 동적 SEO 메타데이터를 생성할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | layout.tsx | template.tsx |\n" +
        "|------|-----------|-------------|\n" +
        "| 마운트 | 한 번만 (상태 유지) | 매 네비게이션마다 새로 |\n" +
        "| useEffect | 최초 1회 | 매번 실행 |\n" +
        "| 상태 유지 | 유지됨 | 초기화됨 |\n" +
        "| 사용 시점 | 대부분의 경우 | 애니메이션, 페이지뷰 추적 |\n" +
        "| 중첩 | 자동 중첩 | 자동 중첩 |\n\n" +
        "| metadata 방식 | 설명 |\n" +
        "|------|------|\n" +
        "| `export const metadata` | 정적 메타데이터 (빌드 시 결정) |\n" +
        "| `export generateMetadata()` | 동적 메타데이터 (요청 시 결정) |\n" +
        "| `title.template` | 하위 라우트 title 자동 조합 |\n\n" +
        "**핵심:** `layout.tsx`는 네비게이션 시 상태를 유지하며 리렌더되지 않고, " +
        "`template.tsx`는 매번 새로 마운트된다. 대부분의 경우 layout을 사용하고, " +
        "애니메이션이나 매번 초기화가 필요할 때만 template을 쓴다.\n\n" +
        "**다음 챕터 미리보기:** `Link` 컴포넌트의 프리페칭, `useRouter` 훅, " +
        "서버/클라이언트에서의 프로그래밍 방식 네비게이션을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "layout.tsx는 네비게이션 시 상태를 유지하며 재렌더되지 않고, template.tsx는 매번 새로 마운트된다. 대부분의 경우 layout을 사용하고, 애니메이션이나 매번 초기화가 필요할 때만 template을 쓴다.",
  checklist: [
    "layout.tsx와 template.tsx의 마운트 동작 차이를 설명할 수 있다",
    "Root Layout에 반드시 포함해야 하는 요소(<html>, <body>)를 알고 있다",
    "중첩 레이아웃이 자동으로 동작하는 원리를 이해한다",
    "metadata와 generateMetadata의 차이와 사용 시점을 구분할 수 있다",
    "title.template을 사용한 메타데이터 자동 조합 방법을 알고 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "/dashboard/analytics에서 /dashboard/reports로 이동할 때, app/dashboard/layout.tsx의 상태는?",
      choices: [
        "초기화된다",
        "유지된다",
        "서버에서 새로 가져온다",
        "캐시에서 복원된다",
      ],
      correctIndex: 1,
      explanation:
        "layout.tsx는 자식 라우트 간 네비게이션 시 리렌더되지 않습니다. 따라서 layout 내의 상태(useState 등)가 유지됩니다.",
    },
    {
      id: "q2",
      question: "Root Layout(app/layout.tsx)에 대한 설명으로 틀린 것은?",
      choices: [
        "반드시 존재해야 한다",
        "<html>과 <body> 태그를 포함해야 한다",
        "삭제하면 Next.js가 자동으로 기본 Root Layout을 생성한다",
        "전역 스타일과 폰트를 설정하는 적절한 위치이다",
      ],
      correctIndex: 2,
      explanation:
        "Root Layout은 필수 파일이며, <html>과 <body> 태그를 반드시 포함해야 합니다. 삭제하면 빌드 에러가 발생합니다.",
    },
    {
      id: "q3",
      question: "template.tsx를 사용해야 하는 경우는?",
      choices: [
        "사이드바의 스크롤 위치를 유지해야 할 때",
        "페이지 진입 애니메이션을 매번 재생해야 할 때",
        "전역 상태를 모든 페이지에서 공유해야 할 때",
        "메타데이터를 동적으로 생성해야 할 때",
      ],
      correctIndex: 1,
      explanation:
        "template.tsx는 매번 새로 마운트되므로 CSS 애니메이션이나 useEffect가 매 네비게이션마다 실행됩니다. 상태 유지가 필요한 경우는 layout.tsx를 사용해야 합니다.",
    },
    {
      id: "q4",
      question:
        "부모 layout의 metadata에 title.template: '%s | 내 앱'이 있고, 자식 page의 metadata에 title: '블로그'가 있으면 최종 title은?",
      choices: [
        "내 앱",
        "블로그",
        "블로그 | 내 앱",
        "%s | 내 앱",
      ],
      correctIndex: 2,
      explanation:
        "title.template의 %s 자리에 하위 라우트의 title이 대입됩니다. '블로그'가 %s를 대체하여 '블로그 | 내 앱'이 됩니다.",
    },
    {
      id: "q5",
      question:
        "layout.tsx와 template.tsx가 같은 폴더에 함께 있으면 렌더링 순서는?",
      choices: [
        "layout만 렌더링된다",
        "template만 렌더링된다",
        "layout이 template을 감싼다 (Layout > Template > Page)",
        "template이 layout을 감싼다 (Template > Layout > Page)",
      ],
      correctIndex: 2,
      explanation:
        "같은 폴더에 둘 다 있으면 Layout > Template > Page 순서로 중첩됩니다. Layout은 상태를 유지하고, Template은 그 안에서 매번 새로 마운트됩니다.",
    },
  ],
};

export default chapter;
