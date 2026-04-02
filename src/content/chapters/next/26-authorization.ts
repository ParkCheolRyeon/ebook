import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "26-authorization",
  subject: "next",
  title: "인가와 미들웨어 보호",
  description:
    "인증(Authentication)과 인가(Authorization)의 차이, 역할 기반 접근 제어(RBAC), 미들웨어/서버 컴포넌트/서버 액션에서의 권한 검증 패턴을 학습합니다.",
  order: 26,
  group: "인증과 보안",
  prerequisites: ["25-authentication"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "인증과 인가는 **공항 보안 시스템**과 같습니다.\n\n" +
        "**인증(Authentication)**은 공항 입구에서 **여권 검사**를 받는 것입니다. '당신이 누구인가'를 확인합니다. " +
        "여권이 없으면 공항에 들어갈 수 없습니다.\n\n" +
        "**인가(Authorization)**는 여권 검사를 통과한 후 **탑승 구역에 들어갈 수 있는지** 확인하는 것입니다. " +
        "이코노미 티켓을 가진 사람은 일반 라운지만 이용할 수 있고, 비즈니스 티켓이 있어야 비즈니스 라운지에 들어갈 수 있습니다. " +
        "같은 공항(앱)에 들어왔더라도 티켓 등급(역할)에 따라 접근할 수 있는 구역(페이지/기능)이 다릅니다.\n\n" +
        "Next.js에서 **미들웨어**는 공항의 **자동 게이트**입니다. 모든 승객(요청)이 각 구역에 도달하기 전에 " +
        "먼저 게이트를 통과해야 하며, 여기서 빠르게 자격을 확인합니다. " +
        "Server Component와 Server Action은 **각 구역의 직원** — 더 세밀하게 권한을 확인하고, " +
        "특정 행동(VIP 서비스 요청 등)의 자격을 검증합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "인증만으로는 앱을 충분히 보호할 수 없습니다. **인가 없이 인증만 구현하면 다음 문제가 발생합니다.**\n\n" +
        "### 1. 모든 로그인 사용자가 동일한 권한\n" +
        "일반 사용자와 관리자가 같은 페이지에 접근할 수 있습니다. 관리자 전용 대시보드, 사용자 관리 페이지 등에 " +
        "일반 사용자가 URL을 직접 입력하여 접근할 수 있습니다.\n\n" +
        "### 2. 클라이언트 측 보호의 한계\n" +
        "React에서 흔히 사용하는 패턴 — 권한이 없으면 버튼을 숨기는 것 — 은 보안이 아닙니다. " +
        "브라우저 개발자 도구로 우회할 수 있고, API를 직접 호출할 수도 있습니다.\n\n" +
        "### 3. 인가 체크 위치의 분산\n" +
        "라우트 보호, 컴포넌트 렌더링 제어, API 권한 검증을 각각 다른 방식으로 구현하면 " +
        "일관성이 깨지고, 빠뜨린 곳에서 보안 구멍이 생깁니다.\n\n" +
        "### 4. 리다이렉트 패턴의 복잡성\n" +
        "미인가 사용자를 어디로 보낼지, 로그인 후 원래 페이지로 돌아오게 할지 등 " +
        "리다이렉트 흐름을 일관되게 관리하기 어렵습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js에서는 **계층적 인가 전략** — 미들웨어, Server Component, Server Action 세 레벨에서 권한을 검증합니다.\n\n" +
        "### 1. 미들웨어: 1차 방어선 (라우트 보호)\n" +
        "미들웨어에서 인증 여부와 기본 역할을 확인합니다. 미인가 사용자는 페이지에 도달하기 전에 리다이렉트됩니다. " +
        "가볍고 빠른 검사에 적합합니다.\n\n" +
        "### 2. Server Component: 2차 방어선 (UI 제어)\n" +
        "서버 컴포넌트에서 세밀한 권한을 확인합니다. 같은 페이지 내에서도 역할에 따라 다른 UI를 렌더링하거나, " +
        "권한이 없으면 notFound()나 redirect()를 호출합니다.\n\n" +
        "### 3. Server Action: 3차 방어선 (행동 검증)\n" +
        "데이터를 변경하는 Server Action에서 반드시 권한을 재검증합니다. " +
        "UI를 우회하여 직접 Action을 호출하는 공격을 방어합니다.\n\n" +
        "### 4. RBAC (역할 기반 접근 제어)\n" +
        "사용자에게 역할(admin, editor, user)을 부여하고, 각 역할이 접근할 수 있는 리소스와 행동을 정의합니다. " +
        "이를 유틸리티 함수로 추상화하면 일관된 인가 체계를 유지할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 계층적 인가 패턴",
      content:
        "미들웨어에서 라우트를 보호하고, RBAC 유틸리티를 만들어 " +
        "Server Component와 Server Action에서 일관되게 권한을 검증하는 패턴을 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// === lib/authorization.ts (인가 유틸리티) ===\n' +
          'import { auth } from "@/auth";\n' +
          'import { redirect } from "next/navigation";\n\n' +
          'type Role = "admin" | "editor" | "user";\n\n' +
          'const ROLE_HIERARCHY: Record<Role, number> = {\n' +
          '  admin: 3,\n' +
          '  editor: 2,\n' +
          '  user: 1,\n' +
          '};\n\n' +
          'export async function requireRole(minimumRole: Role) {\n' +
          '  const session = await auth();\n\n' +
          '  if (!session) {\n' +
          '    redirect("/api/auth/signin");\n' +
          '  }\n\n' +
          '  const userRole = (session.user?.role as Role) ?? "user";\n' +
          '  if (ROLE_HIERARCHY[userRole] < ROLE_HIERARCHY[minimumRole]) {\n' +
          '    redirect("/unauthorized");\n' +
          '  }\n\n' +
          '  return session;\n' +
          '}\n\n' +
          'export function hasPermission(userRole: Role, requiredRole: Role) {\n' +
          '  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];\n' +
          '}\n\n' +
          '// === middleware.ts (1차 방어선) ===\n' +
          'import { auth } from "@/auth";\n' +
          'import { NextResponse } from "next/server";\n\n' +
          'const protectedRoutes = ["/dashboard", "/settings"];\n' +
          'const adminRoutes = ["/admin"];\n\n' +
          'export default auth((req) => {\n' +
          '  const { pathname } = req.nextUrl;\n' +
          '  const isLoggedIn = !!req.auth;\n' +
          '  const userRole = req.auth?.user?.role ?? "user";\n\n' +
          '  // 보호된 라우트: 로그인 필요\n' +
          '  if (protectedRoutes.some((r) => pathname.startsWith(r))) {\n' +
          '    if (!isLoggedIn) {\n' +
          '      const signInUrl = new URL("/api/auth/signin", req.nextUrl);\n' +
          '      signInUrl.searchParams.set("callbackUrl", pathname);\n' +
          '      return NextResponse.redirect(signInUrl);\n' +
          '    }\n' +
          '  }\n\n' +
          '  // 관리자 라우트: admin 역할 필요\n' +
          '  if (adminRoutes.some((r) => pathname.startsWith(r))) {\n' +
          '    if (userRole !== "admin") {\n' +
          '      return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));\n' +
          '    }\n' +
          '  }\n\n' +
          '  return NextResponse.next();\n' +
          '});\n\n' +
          'export const config = {\n' +
          '  matcher: ["/dashboard/:path*", "/settings/:path*", "/admin/:path*"],\n' +
          '};',
        description:
          "RBAC 유틸리티로 역할 계층을 정의하고, 미들웨어에서 라우트별 접근 제어를 구현합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Server Component와 Server Action에서 인가",
      content:
        "Server Component에서 역할에 따라 다른 UI를 렌더링하고, " +
        "Server Action에서 데이터 변경 전 권한을 재검증하는 실습입니다. " +
        "Layout에서의 인가와 Page에서의 인가 차이도 함께 다룹니다.",
      code: {
        language: "typescript",
        code:
          '// === app/admin/page.tsx (Server Component 인가) ===\n' +
          'import { requireRole } from "@/lib/authorization";\n\n' +
          'export default async function AdminPage() {\n' +
          '  // admin 역할 필요 — 미달 시 자동 리다이렉트\n' +
          '  const session = await requireRole("admin");\n\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <h1>관리자 대시보드</h1>\n' +
          '      <p>관리자: {session.user?.name}</p>\n' +
          '      <UserManagement />\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// === app/dashboard/page.tsx (역할별 UI 분기) ===\n' +
          'import { auth } from "@/auth";\n' +
          'import { redirect } from "next/navigation";\n' +
          'import { hasPermission } from "@/lib/authorization";\n\n' +
          'export default async function DashboardPage() {\n' +
          '  const session = await auth();\n' +
          '  if (!session) redirect("/api/auth/signin");\n\n' +
          '  const role = (session.user?.role as "admin" | "editor" | "user") ?? "user";\n\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <h1>대시보드</h1>\n' +
          '      <GeneralStats />\n\n' +
          '      {/* editor 이상만 편집 섹션 표시 */}\n' +
          '      {hasPermission(role, "editor") && <EditorSection />}\n\n' +
          '      {/* admin만 관리 섹션 표시 */}\n' +
          '      {hasPermission(role, "admin") && <AdminSection />}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// === actions/user-actions.ts (Server Action 인가) ===\n' +
          '"use server";\n' +
          'import { requireRole } from "@/lib/authorization";\n\n' +
          'export async function deleteUser(userId: string) {\n' +
          '  // Server Action에서도 반드시 권한 재검증!\n' +
          '  // UI에서 버튼을 숨겨도 직접 호출 가능하므로\n' +
          '  const session = await requireRole("admin");\n\n' +
          '  // 자기 자신은 삭제 불가\n' +
          '  if (session.user?.id === userId) {\n' +
          '    throw new Error("자기 자신을 삭제할 수 없습니다");\n' +
          '  }\n\n' +
          '  await db.user.delete({ where: { id: userId } });\n' +
          '  return { success: true };\n' +
          '}',
        description:
          "requireRole()로 Server Component와 Server Action 모두에서 일관된 인가를 적용합니다. UI 숨기기만으로는 부족하고, 서버에서 반드시 권한을 검증해야 합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| 인증 vs 인가 | 인증은 '누구인가', 인가는 '무엇을 할 수 있는가' |\n" +
        "| RBAC | 역할(admin, editor, user) 기반으로 접근 제어 |\n" +
        "| 미들웨어 보호 | 라우트 도달 전 1차 방어선, 가벼운 검사 |\n" +
        "| Server Component 인가 | 세밀한 UI 제어와 역할별 렌더링 |\n" +
        "| Server Action 인가 | 데이터 변경 전 권한 재검증 (필수) |\n" +
        "| Layout vs Page 인가 | Layout은 공통 보호, Page는 개별 권한 체크 |\n" +
        "| 리다이렉트 패턴 | callbackUrl로 로그인 후 원래 페이지 복귀 |\n\n" +
        "**핵심:** 인가는 미들웨어 → Server Component → Server Action 세 계층에서 수행합니다. " +
        "클라이언트 측 UI 숨기기는 보안이 아니며, 서버에서 반드시 권한을 검증해야 합니다.\n\n" +
        "**다음 챕터 미리보기:** 환경 변수 관리와 보안 헤더 설정을 다룹니다. " +
        "NEXT_PUBLIC_ 접두어의 의미와 server-only 패키지로 서버 코드를 보호하는 방법을 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "인증은 '누구인가', 인가는 '무엇을 할 수 있는가'이다. 미들웨어에서 라우트를 보호하고, Server Components와 Server Actions에서 세밀한 권한을 검증하라.",
  checklist: [
    "인증(Authentication)과 인가(Authorization)의 차이를 명확히 설명할 수 있다",
    "RBAC(역할 기반 접근 제어) 패턴을 설계하고 구현할 수 있다",
    "미들웨어에서 라우트를 보호하고 callbackUrl 리다이렉트를 구현할 수 있다",
    "Server Component에서 역할에 따라 다른 UI를 렌더링할 수 있다",
    "Server Action에서 데이터 변경 전 권한을 재검증하는 이유를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "인증(Authentication)과 인가(Authorization)의 차이로 올바른 것은?",
      choices: [
        "인증은 권한 확인, 인가는 신원 확인이다",
        "인증은 신원 확인, 인가는 권한 확인이다",
        "인증과 인가는 같은 개념의 다른 이름이다",
        "인증은 서버에서, 인가는 클라이언트에서 수행한다",
      ],
      correctIndex: 1,
      explanation:
        "인증(Authentication)은 '당신이 누구인가'를 확인하는 것이고, 인가(Authorization)는 '당신이 무엇을 할 수 있는가'를 확인하는 것입니다.",
    },
    {
      id: "q2",
      question: "Next.js에서 미들웨어를 인가의 1차 방어선으로 사용하는 이유는?",
      choices: [
        "미들웨어에서 DB에 직접 접근할 수 있어서",
        "페이지에 도달하기 전에 빠르게 접근을 차단할 수 있어서",
        "미들웨어에서만 세션을 확인할 수 있어서",
        "미들웨어가 클라이언트에서 실행되어서",
      ],
      correctIndex: 1,
      explanation:
        "미들웨어는 요청이 페이지에 도달하기 전에 실행되므로, 불필요한 렌더링 없이 빠르게 미인가 요청을 차단할 수 있습니다.",
    },
    {
      id: "q3",
      question: "Server Action에서 권한을 재검증해야 하는 이유는?",
      choices: [
        "Server Action은 미들웨어를 거치지 않기 때문에",
        "성능 최적화를 위해",
        "UI에서 버튼을 숨겨도 직접 호출이 가능하기 때문에",
        "Server Action은 클라이언트에서 실행되기 때문에",
      ],
      correctIndex: 2,
      explanation:
        "Server Action은 폼 제출이나 fetch로 직접 호출할 수 있습니다. UI에서 버튼을 숨기는 것은 보안이 아니므로, 서버에서 반드시 권한을 재검증해야 합니다.",
    },
    {
      id: "q4",
      question: "RBAC(역할 기반 접근 제어)에 대한 설명으로 올바른 것은?",
      choices: [
        "모든 사용자에게 동일한 권한을 부여한다",
        "URL 패턴으로만 접근을 제어한다",
        "사용자에게 역할을 부여하고 역할별로 접근 가능한 리소스를 정의한다",
        "클라이언트 측에서만 역할을 확인한다",
      ],
      correctIndex: 2,
      explanation:
        "RBAC는 사용자에게 역할(admin, editor, user 등)을 부여하고, 각 역할이 접근할 수 있는 리소스와 수행할 수 있는 행동을 정의하는 접근 제어 방식입니다.",
    },
    {
      id: "q5",
      question: "인가 체크를 Layout이 아닌 Page에서 수행해야 하는 경우는?",
      choices: [
        "모든 하위 페이지에 동일한 권한이 필요한 경우",
        "각 페이지마다 다른 수준의 권한이 필요한 경우",
        "인가 체크가 필요 없는 경우",
        "클라이언트 컴포넌트를 사용하는 경우",
      ],
      correctIndex: 1,
      explanation:
        "Layout은 하위의 모든 페이지에 공통 적용됩니다. 각 페이지마다 다른 권한(예: 일반 대시보드는 user, 설정은 admin)이 필요하면 개별 Page에서 인가를 체크해야 합니다.",
    },
  ],
};

export default chapter;
