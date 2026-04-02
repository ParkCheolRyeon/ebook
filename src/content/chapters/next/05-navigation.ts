import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "05-navigation",
  subject: "next",
  title: "네비게이션과 링크",
  description:
    "Link 컴포넌트의 프리페칭, useRouter 훅, usePathname/useSearchParams, 서버의 redirect()와 클라이언트 네비게이션의 차이를 학습합니다.",
  order: 5,
  group: "기초",
  prerequisites: ["04-layouts-and-templates"],
  estimatedMinutes: 22,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Next.js의 네비게이션은 **지하철 시스템**과 같습니다.\n\n" +
        "`<Link>` 컴포넌트는 **지하철 노선도의 역 이름**입니다. 승객(사용자)은 역 이름을 눌러 이동하고, " +
        "지하철 시스템(Next.js)은 다음 역의 정보를 **미리 불러옵니다(프리페칭)**. " +
        "승객이 실제로 그 역에 도착하면 이미 준비가 되어 있어 즉시 하차할 수 있습니다.\n\n" +
        "`useRouter`는 **택시 호출**입니다. 노선도를 따르지 않고, 프로그래밍 방식으로 " +
        "'강남역으로 가주세요'(`router.push('/gangnam')`)라고 지시합니다. " +
        "폼 제출 후 결과 페이지로 이동하거나, 조건에 따라 다른 페이지로 보낼 때 사용합니다.\n\n" +
        "**Soft Navigation**은 **같은 건물 내 층 이동**입니다. 엘리베이터(클라이언트 라우팅)를 타고 " +
        "층만 바꾸면 되므로 빠릅니다. 건물의 공통 구조(layout)는 그대로 유지됩니다.\n\n" +
        "**Hard Navigation**은 **건물을 나가서 다른 건물로 이동**하는 것입니다. " +
        "모든 것을 처음부터 다시 로드합니다. 브라우저의 전체 새로고침이 이에 해당합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "SPA(Single Page Application)에서 네비게이션은 단순해 보이지만 여러 도전이 있습니다.\n\n" +
        "### 1. 전체 페이지 새로고침\n" +
        "일반 `<a>` 태그를 사용하면 매번 서버에서 전체 HTML을 다시 받아옵니다. " +
        "이미 로드된 JavaScript, CSS, 레이아웃까지 모두 다시 받으므로 느리고 깜빡임이 발생합니다.\n\n" +
        "### 2. 프리페칭 부재\n" +
        "사용자가 링크를 클릭하기 전까지 다음 페이지의 리소스를 전혀 준비하지 않습니다. " +
        "클릭 후에야 데이터 요청이 시작되므로 로딩 시간이 체감됩니다.\n\n" +
        "### 3. 프로그래밍 방식 네비게이션\n" +
        "폼 제출 후 리다이렉트, 인증 상태에 따른 페이지 이동 등을 코드로 처리해야 합니다. " +
        "서버에서 리다이렉트해야 하는 경우와 클라이언트에서 처리해야 하는 경우를 구분해야 합니다.\n\n" +
        "### 4. URL 상태 관리\n" +
        "검색 필터, 정렬 옵션, 페이지네이션 같은 UI 상태를 URL 쿼리 파라미터와 동기화해야 합니다. " +
        "뒤로 가기했을 때 이전 필터가 복원되어야 하고, URL을 공유하면 같은 필터가 적용되어야 합니다.\n\n" +
        "### 5. 서버/클라이언트 환경 차이\n" +
        "서버 컴포넌트에서는 브라우저 API(window, history)를 사용할 수 없으므로, " +
        "네비게이션 방식이 달라야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js는 상황에 맞는 네비게이션 도구들을 제공합니다.\n\n" +
        "### Link 컴포넌트 — 선언적 네비게이션\n" +
        "- `next/link`에서 import\n" +
        "- 뷰포트에 들어오면 **자동 프리페칭** (프로덕션 환경)\n" +
        "- 클릭 시 **클라이언트 사이드 네비게이션** (전체 새로고침 없음)\n" +
        "- `prefetch` prop으로 프리페칭 제어 (`true`, `false`, `null`)\n" +
        "- `replace` prop으로 히스토리 교체 (뒤로 가기 방지)\n" +
        "- `scroll` prop으로 스크롤 복원 제어\n\n" +
        "### useRouter — 프로그래밍 방식 네비게이션\n" +
        "- `next/navigation`에서 import (클라이언트 컴포넌트 전용)\n" +
        "- `router.push(url)` — 새 페이지로 이동\n" +
        "- `router.replace(url)` — 현재 히스토리 교체\n" +
        "- `router.back()` — 뒤로 가기\n" +
        "- `router.forward()` — 앞으로 가기\n" +
        "- `router.refresh()` — 현재 라우트 서버에서 새로고침\n\n" +
        "### usePathname, useSearchParams — URL 상태 읽기\n" +
        "- `usePathname()` — 현재 경로 (예: `/blog/my-post`)\n" +
        "- `useSearchParams()` — 쿼리 파라미터 (예: `?page=2&sort=date`)\n\n" +
        "### redirect() — 서버 사이드 리다이렉트\n" +
        "- `next/navigation`에서 import\n" +
        "- 서버 컴포넌트, Server Action, Route Handler에서 사용\n" +
        "- 인증 실패 시 로그인 페이지로 리다이렉트 등에 활용",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Link 컴포넌트와 useRouter",
      content:
        "Link 컴포넌트의 다양한 prop과 useRouter의 메서드를 활용하는 패턴을 살펴봅니다. " +
        "서버 컴포넌트에서의 redirect()와 클라이언트 컴포넌트에서의 useRouter 사용을 비교합니다.",
      code: {
        language: "typescript",
        code:
          '// === Link 컴포넌트 활용 ===\n' +
          'import Link from "next/link";\n\n' +
          'function Navigation() {\n' +
          '  return (\n' +
          '    <nav>\n' +
          '      {/* 기본 사용 — 자동 프리페칭 */}\n' +
          '      <Link href="/blog">블로그</Link>\n\n' +
          '      {/* 동적 경로 */}\n' +
          '      <Link href={`/blog/${post.slug}`}>{post.title}</Link>\n\n' +
          '      {/* 프리페칭 비활성화 (거의 방문하지 않는 페이지) */}\n' +
          '      <Link href="/terms" prefetch={false}>이용약관</Link>\n\n' +
          '      {/* 히스토리 교체 (뒤로 가기로 돌아오지 않음) */}\n' +
          '      <Link href="/dashboard" replace>대시보드</Link>\n\n' +
          '      {/* 스크롤 유지 (페이지 상단으로 이동하지 않음) */}\n' +
          '      <Link href="/blog?page=2" scroll={false}>다음 페이지</Link>\n\n' +
          '      {/* 객체 형태의 href */}\n' +
          '      <Link\n' +
          '        href={{\n' +
          '          pathname: "/blog",\n' +
          '          query: { sort: "date", tag: "react" },\n' +
          '        }}\n' +
          '      >\n' +
          '        React 글 모아보기\n' +
          '      </Link>\n' +
          '    </nav>\n' +
          '  );\n' +
          '}\n\n' +
          '// === 서버 컴포넌트에서 redirect ===\n' +
          'import { redirect } from "next/navigation";\n\n' +
          'async function ProtectedPage() {\n' +
          '  const session = await getSession();\n\n' +
          '  if (!session) {\n' +
          '    redirect("/login");  // 서버에서 리다이렉트\n' +
          '  }\n\n' +
          '  return <div>보호된 콘텐츠</div>;\n' +
          '}',
        description:
          "Link 컴포넌트는 선언적으로 사용하며 프리페칭이 자동입니다. 서버에서의 리다이렉트는 redirect() 함수를 사용합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 검색과 필터링 네비게이션",
      content:
        "URL 쿼리 파라미터를 활용한 검색/필터링 UI를 구현합니다. " +
        "useSearchParams로 URL 상태를 읽고, useRouter로 URL을 업데이트하는 패턴을 실습합니다. " +
        "또한 활성 링크 스타일링을 위한 usePathname 활용법을 알아봅니다.",
      code: {
        language: "typescript",
        code:
          '// === 검색 컴포넌트 (URL 쿼리 파라미터 동기화) ===\n' +
          '"use client";\n' +
          'import { useRouter, useSearchParams, usePathname } from "next/navigation";\n\n' +
          'export default function SearchFilter() {\n' +
          '  const router = useRouter();\n' +
          '  const searchParams = useSearchParams();\n' +
          '  const pathname = usePathname();\n\n' +
          '  const currentQuery = searchParams.get("q") ?? "";\n' +
          '  const currentSort = searchParams.get("sort") ?? "latest";\n\n' +
          '  function updateFilters(key: string, value: string) {\n' +
          '    // 기존 파라미터를 복사하고 새 값 설정\n' +
          '    const params = new URLSearchParams(searchParams.toString());\n' +
          '    if (value) {\n' +
          '      params.set(key, value);\n' +
          '    } else {\n' +
          '      params.delete(key);\n' +
          '    }\n' +
          '    // URL 업데이트 (전체 새로고침 없이)\n' +
          '    router.push(`${pathname}?${params.toString()}`);\n' +
          '  }\n\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <input\n' +
          '        defaultValue={currentQuery}\n' +
          '        onChange={e => updateFilters("q", e.target.value)}\n' +
          '        placeholder="검색어 입력..."\n' +
          '      />\n' +
          '      <select\n' +
          '        value={currentSort}\n' +
          '        onChange={e => updateFilters("sort", e.target.value)}\n' +
          '      >\n' +
          '        <option value="latest">최신순</option>\n' +
          '        <option value="popular">인기순</option>\n' +
          '      </select>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// === 활성 링크 스타일링 ===\n' +
          '"use client";\n' +
          'import Link from "next/link";\n' +
          'import { usePathname } from "next/navigation";\n\n' +
          'const navLinks = [\n' +
          '  { href: "/", label: "홈" },\n' +
          '  { href: "/blog", label: "블로그" },\n' +
          '  { href: "/about", label: "소개" },\n' +
          '];\n\n' +
          'export default function NavBar() {\n' +
          '  const pathname = usePathname();\n\n' +
          '  return (\n' +
          '    <nav className="flex gap-4">\n' +
          '      {navLinks.map(link => {\n' +
          '        const isActive = pathname === link.href\n' +
          '          || (link.href !== "/" && pathname.startsWith(link.href));\n\n' +
          '        return (\n' +
          '          <Link\n' +
          '            key={link.href}\n' +
          '            href={link.href}\n' +
          '            className={isActive ? "font-bold text-blue-600" : "text-gray-600"}\n' +
          '          >\n' +
          '            {link.label}\n' +
          '          </Link>\n' +
          '        );\n' +
          '      })}\n' +
          '    </nav>\n' +
          '  );\n' +
          '}\n\n' +
          '// === 폼 제출 후 프로그래밍 방식 네비게이션 ===\n' +
          '"use client";\n' +
          'import { useRouter } from "next/navigation";\n\n' +
          'export default function CreatePostForm() {\n' +
          '  const router = useRouter();\n\n' +
          '  async function handleSubmit(e: React.FormEvent) {\n' +
          '    e.preventDefault();\n' +
          '    const result = await createPost(/* ... */);\n' +
          '    // 생성 후 해당 포스트 페이지로 이동\n' +
          '    router.push(`/blog/${result.slug}`);\n' +
          '  }\n\n' +
          '  return <form onSubmit={handleSubmit}>...</form>;\n' +
          '}',
        description:
          "useSearchParams로 URL 상태를 읽고 useRouter로 업데이트합니다. usePathname으로 활성 링크를 스타일링하고, router.push로 프로그래밍 방식 네비게이션을 합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 도구 | 용도 | 환경 |\n" +
        "|------|------|------|\n" +
        "| `<Link>` | 선언적 네비게이션, 자동 프리페칭 | 서버/클라이언트 |\n" +
        "| `useRouter` | 프로그래밍 방식 네비게이션 | 클라이언트 전용 |\n" +
        "| `usePathname` | 현재 경로 읽기 | 클라이언트 전용 |\n" +
        "| `useSearchParams` | 쿼리 파라미터 읽기 | 클라이언트 전용 |\n" +
        "| `redirect()` | 서버 사이드 리다이렉트 | 서버 전용 |\n" +
        "| `router.refresh()` | 서버 데이터 새로고침 | 클라이언트 전용 |\n\n" +
        "| 네비게이션 유형 | 설명 |\n" +
        "|------|------|\n" +
        "| Soft Navigation | 클라이언트 라우팅, layout 유지, 빠름 |\n" +
        "| Hard Navigation | 전체 새로고침, 모든 것 리로드 |\n\n" +
        "**핵심:** Link는 자동 프리페칭으로 빠른 네비게이션을 제공하고, useRouter는 프로그래밍 방식 네비게이션에 사용한다. " +
        "서버에서는 redirect(), 클라이언트에서는 useRouter를 쓴다.\n\n" +
        "**다음 챕터 미리보기:** `loading.tsx`, `error.tsx`, `not-found.tsx` 특수 파일로 " +
        "로딩 상태, 에러 처리, 404 페이지를 자동으로 처리하는 방법을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Link는 자동 프리페칭으로 빠른 네비게이션을 제공하고, useRouter는 프로그래밍 방식 네비게이션에 사용한다. 서버에서는 redirect(), 클라이언트에서는 useRouter를 쓴다.",
  checklist: [
    "Link 컴포넌트의 prefetch, replace, scroll prop의 역할을 이해한다",
    "useRouter의 push, replace, back, refresh 메서드를 구분할 수 있다",
    "usePathname과 useSearchParams로 URL 상태를 읽는 방법을 알고 있다",
    "서버(redirect)와 클라이언트(useRouter) 네비게이션의 사용 시점을 구분할 수 있다",
    "Soft Navigation과 Hard Navigation의 차이를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Next.js의 Link 컴포넌트가 일반 <a> 태그보다 나은 점은?",
      choices: [
        "스타일링이 더 쉽다",
        "클라이언트 사이드 네비게이션과 자동 프리페칭을 제공한다",
        "SEO에 더 유리하다",
        "서버에서도 클릭 이벤트를 처리할 수 있다",
      ],
      correctIndex: 1,
      explanation:
        "Link 컴포넌트는 전체 페이지 새로고침 없이 클라이언트 사이드 네비게이션을 수행하며, 뷰포트에 들어온 링크의 페이지를 자동으로 프리페칭하여 즉각적인 페이지 전환을 제공합니다.",
    },
    {
      id: "q2",
      question:
        "서버 컴포넌트에서 인증 실패 시 로그인 페이지로 보내려면 어떤 방법을 사용해야 하나요?",
      choices: [
        "useRouter().push('/login')",
        "window.location.href = '/login'",
        "redirect('/login')",
        "<Link href='/login'>",
      ],
      correctIndex: 2,
      explanation:
        "서버 컴포넌트에서는 useRouter나 window를 사용할 수 없습니다. next/navigation의 redirect() 함수를 사용하여 서버 사이드에서 리다이렉트합니다.",
    },
    {
      id: "q3",
      question: "router.push()와 router.replace()의 차이는?",
      choices: [
        "push는 느리고 replace는 빠르다",
        "push는 히스토리에 추가하고 replace는 현재 항목을 교체한다",
        "push는 GET 요청이고 replace는 POST 요청이다",
        "push는 클라이언트용이고 replace는 서버용이다",
      ],
      correctIndex: 1,
      explanation:
        "push는 브라우저 히스토리 스택에 새 항목을 추가하여 뒤로 가기가 가능합니다. replace는 현재 히스토리 항목을 교체하여 뒤로 가기를 해도 이전 페이지가 아닌 그 이전 페이지로 이동합니다.",
    },
    {
      id: "q4",
      question: "useSearchParams()로 '?page=3&sort=date' URL에서 page 값을 가져오는 방법은?",
      choices: [
        "useSearchParams().page",
        "useSearchParams().get('page')",
        "useSearchParams('page')",
        "useSearchParams()[0]",
      ],
      correctIndex: 1,
      explanation:
        "useSearchParams()는 URLSearchParams 인스턴스를 반환합니다. .get('page')로 개별 파라미터 값을 가져올 수 있으며, 없는 키는 null을 반환합니다.",
    },
    {
      id: "q5",
      question: "Link 컴포넌트의 프리페칭에 대한 설명으로 틀린 것은?",
      choices: [
        "프로덕션 환경에서만 동작한다",
        "링크가 뷰포트에 들어오면 자동으로 시작된다",
        "prefetch={false}로 비활성화할 수 있다",
        "개발 환경(next dev)에서도 동일하게 동작한다",
      ],
      correctIndex: 3,
      explanation:
        "Link의 프리페칭은 프로덕션 환경에서만 동작합니다. 개발 환경(next dev)에서는 프리페칭이 비활성화되어 있어, 프로덕션 빌드(next build && next start)에서 확인해야 합니다.",
    },
  ],
};

export default chapter;
