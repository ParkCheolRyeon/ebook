import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "31-testing",
  subject: "next",
  title: "Next.js 테스팅",
  description:
    "Jest와 React Testing Library를 활용한 Next.js 앱 테스팅 전략을 학습합니다. Server Components, Client Components, Route Handlers, Server Actions 테스팅과 Playwright E2E 테스트까지 다룹니다.",
  order: 31,
  group: "테스팅과 배포",
  prerequisites: ["30-external-api"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Next.js 테스팅은 **자동차 출고 전 품질 검사**와 같습니다.\n\n" +
        "자동차를 만들 때, 엔진만 따로 테스트하고(유닛 테스트), 엔진과 변속기가 잘 맞물리는지 확인하고(통합 테스트), 실제 도로에서 주행 테스트를 합니다(E2E 테스트).\n\n" +
        "Next.js 앱도 마찬가지입니다. Server Component는 **엔진 단독 테스트**입니다 — 서버에서 async로 데이터를 가져와 올바른 HTML을 생성하는지 확인합니다. Client Component는 **대시보드 테스트** — 버튼을 누르면 화면이 바뀌는지 인터랙션을 검증합니다. Route Handler는 **연료 주입구 테스트** — 요청을 넣으면 올바른 응답이 나오는지 확인합니다.\n\n" +
        "마지막으로 Playwright E2E 테스트는 **실제 도로 주행**입니다. 실제 브라우저에서 사용자처럼 페이지를 방문하고, 클릭하고, 폼을 작성하며 전체 흐름이 정상인지 검증합니다. 각 단계가 다른 레벨의 신뢰를 제공하므로, 모두 필요합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "Next.js App Router는 기존 React 테스팅과 다른 도전 과제를 안고 있습니다.\n\n" +
        "1. **Server Components는 async 함수** — `render(<ServerComponent />)`만으로는 async 컴포넌트를 테스트할 수 없습니다. Promise를 해결해야 하는데, React Testing Library의 기본 `render`는 동기적입니다.\n\n" +
        "2. **next/navigation 모킹 필요** — `useRouter`, `usePathname`, `useSearchParams` 등 Next.js 전용 훅들은 Next.js 런타임 컨텍스트 없이는 동작하지 않습니다. 테스트 환경에서 이를 모킹해야 합니다.\n\n" +
        "3. **next/headers 서버 전용 API** — `cookies()`, `headers()` 같은 서버 전용 함수는 Request 컨텍스트가 없는 테스트 환경에서 에러를 발생시킵니다.\n\n" +
        "4. **Route Handler 테스팅** — `NextRequest`/`NextResponse` 객체를 직접 생성해야 합니다. Express와 달리 `supertest` 같은 도구를 바로 사용할 수 없습니다.\n\n" +
        "5. **Server Actions** — 폼 제출과 서버 뮤테이션을 결합한 Server Actions는 서버와 클라이언트의 경계를 넘나들어 테스팅이 까다롭습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js는 `next/jest`와 체계적인 모킹 패턴으로 이 문제들을 해결합니다.\n\n" +
        "### 1. next/jest 설정\n" +
        "`next/jest`는 SWC 트랜스파일러, 경로 별칭(`@/`), CSS/이미지 모듈 모킹을 자동으로 처리합니다. 복잡한 Jest 설정 없이 Next.js 프로젝트를 바로 테스트할 수 있습니다.\n\n" +
        "### 2. Server Component 테스팅\n" +
        "async Server Component는 직접 호출하여 JSX를 받고, 이를 렌더링합니다. 데이터베이스나 외부 API는 `jest.mock()`으로 모킹하여 네트워크 의존성을 제거합니다.\n\n" +
        "### 3. Client Component 테스팅\n" +
        "React Testing Library로 렌더링하고, `userEvent`로 인터랙션을 시뮬레이션합니다. `next/navigation`은 `jest.mock()`으로 모킹합니다.\n\n" +
        "### 4. Route Handler 테스팅\n" +
        "Route Handler 함수를 직접 import하여 `NextRequest` 객체를 생성하고, 반환된 `Response`를 검증합니다.\n\n" +
        "### 5. E2E with Playwright\n" +
        "Playwright는 실제 브라우저를 띄워 전체 사용자 흐름을 테스트합니다. Next.js dev 서버를 실행한 상태에서 페이지 네비게이션, 폼 제출, 인증 흐름을 검증합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Jest + next/jest 설정과 컴포넌트 테스팅",
      content:
        "next/jest를 사용하면 SWC 컴파일, 경로 별칭, CSS 모킹이 자동으로 설정됩니다. Server Component는 async 함수를 직접 호출하고, Client Component는 React Testing Library로 테스트합니다. next/navigation 훅은 jest.mock()으로 모킹하여 테스트 환경에서도 동작하게 합니다.",
      code: {
        language: "typescript",
        code:
          '// jest.config.ts\n' +
          'import type { Config } from "jest";\n' +
          'import nextJest from "next/jest";\n' +
          '\n' +
          'const createJestConfig = nextJest({\n' +
          '  dir: "./", // Next.js 앱의 루트 디렉토리\n' +
          '});\n' +
          '\n' +
          'const config: Config = {\n' +
          '  testEnvironment: "jsdom",\n' +
          '  setupFilesAfterSetup: ["<rootDir>/jest.setup.ts"],\n' +
          '};\n' +
          '\n' +
          'export default createJestConfig(config);\n' +
          '\n' +
          '// jest.setup.ts\n' +
          'import "@testing-library/jest-dom";\n' +
          '\n' +
          '// __tests__/server-component.test.tsx\n' +
          'import { render, screen } from "@testing-library/react";\n' +
          'import PostsPage from "@/app/posts/page";\n' +
          'import { db } from "@/lib/database";\n' +
          '\n' +
          'jest.mock("@/lib/database", () => ({\n' +
          '  db: {\n' +
          '    post: {\n' +
          '      findMany: jest.fn(),\n' +
          '    },\n' +
          '  },\n' +
          '}));\n' +
          '\n' +
          'describe("PostsPage (Server Component)", () => {\n' +
          '  it("게시글 목록을 렌더링한다", async () => {\n' +
          '    (db.post.findMany as jest.Mock).mockResolvedValue([\n' +
          '      { id: "1", title: "첫 번째 글", content: "내용" },\n' +
          '    ]);\n' +
          '\n' +
          '    // async Server Component를 직접 호출\n' +
          '    const jsx = await PostsPage();\n' +
          '    render(jsx);\n' +
          '\n' +
          '    expect(screen.getByText("첫 번째 글")).toBeInTheDocument();\n' +
          '  });\n' +
          '});\n' +
          '\n' +
          '// __tests__/client-component.test.tsx\n' +
          'import { render, screen } from "@testing-library/react";\n' +
          'import userEvent from "@testing-library/user-event";\n' +
          'import SearchBar from "@/components/SearchBar";\n' +
          '\n' +
          'const mockPush = jest.fn();\n' +
          'jest.mock("next/navigation", () => ({\n' +
          '  useRouter: () => ({ push: mockPush }),\n' +
          '  useSearchParams: () => new URLSearchParams(),\n' +
          '}));\n' +
          '\n' +
          'describe("SearchBar (Client Component)", () => {\n' +
          '  it("검색어 입력 후 Enter로 검색한다", async () => {\n' +
          '    const user = userEvent.setup();\n' +
          '    render(<SearchBar />);\n' +
          '\n' +
          '    const input = screen.getByRole("searchbox");\n' +
          '    await user.type(input, "Next.js{Enter}");\n' +
          '\n' +
          '    expect(mockPush).toHaveBeenCalledWith("/search?q=Next.js");\n' +
          '  });\n' +
          '});',
        description:
          "next/jest로 기본 설정을 간소화하고, Server Component는 직접 호출, Client Component는 RTL + 모킹으로 테스트합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Route Handler와 E2E 테스팅",
      content:
        "Route Handler는 HTTP 요청/응답을 직접 다루므로, NextRequest를 생성하고 반환된 Response를 검증합니다. Playwright는 실제 브라우저 환경에서 사용자 시나리오를 재현하여 전체 흐름을 테스트합니다. Server Actions 테스팅은 함수를 직접 호출하되, redirect나 revalidatePath 같은 사이드 이펙트를 모킹합니다.",
      code: {
        language: "typescript",
        code:
          '// __tests__/route-handler.test.ts\n' +
          'import { GET, POST } from "@/app/api/posts/route";\n' +
          'import { NextRequest } from "next/server";\n' +
          'import { db } from "@/lib/database";\n' +
          '\n' +
          'jest.mock("@/lib/database");\n' +
          '\n' +
          'describe("POST /api/posts", () => {\n' +
          '  it("새 게시글을 생성하고 201을 반환한다", async () => {\n' +
          '    (db.post.create as jest.Mock).mockResolvedValue({\n' +
          '      id: "1",\n' +
          '      title: "테스트 글",\n' +
          '    });\n' +
          '\n' +
          '    const request = new NextRequest(\n' +
          '      "http://localhost:3000/api/posts",\n' +
          '      {\n' +
          '        method: "POST",\n' +
          '        body: JSON.stringify({ title: "테스트 글" }),\n' +
          '      }\n' +
          '    );\n' +
          '\n' +
          '    const response = await POST(request);\n' +
          '    const data = await response.json();\n' +
          '\n' +
          '    expect(response.status).toBe(201);\n' +
          '    expect(data.title).toBe("테스트 글");\n' +
          '  });\n' +
          '});\n' +
          '\n' +
          '// __tests__/server-action.test.ts\n' +
          'import { createPost } from "@/app/actions";\n' +
          'import { db } from "@/lib/database";\n' +
          'import { redirect } from "next/navigation";\n' +
          '\n' +
          'jest.mock("@/lib/database");\n' +
          'jest.mock("next/navigation", () => ({\n' +
          '  redirect: jest.fn(),\n' +
          '}));\n' +
          'jest.mock("next/cache", () => ({\n' +
          '  revalidatePath: jest.fn(),\n' +
          '}));\n' +
          '\n' +
          'describe("createPost Server Action", () => {\n' +
          '  it("게시글 생성 후 리다이렉트한다", async () => {\n' +
          '    (db.post.create as jest.Mock).mockResolvedValue({ id: "1" });\n' +
          '\n' +
          '    const formData = new FormData();\n' +
          '    formData.set("title", "새 글");\n' +
          '    formData.set("content", "내용");\n' +
          '\n' +
          '    await createPost(formData);\n' +
          '\n' +
          '    expect(db.post.create).toHaveBeenCalledWith({\n' +
          '      data: { title: "새 글", content: "내용" },\n' +
          '    });\n' +
          '    expect(redirect).toHaveBeenCalledWith("/posts/1");\n' +
          '  });\n' +
          '});\n' +
          '\n' +
          '// e2e/posts.spec.ts (Playwright)\n' +
          'import { test, expect } from "@playwright/test";\n' +
          '\n' +
          'test("게시글 작성 전체 흐름", async ({ page }) => {\n' +
          '  await page.goto("/posts/new");\n' +
          '\n' +
          '  await page.getByLabel("제목").fill("E2E 테스트 글");\n' +
          '  await page.getByLabel("내용").fill("Playwright로 작성");\n' +
          '  await page.getByRole("button", { name: "게시" }).click();\n' +
          '\n' +
          '  // 게시글 상세 페이지로 리다이렉트 확인\n' +
          '  await expect(page).toHaveURL(/\\/posts\\/\\w+/);\n' +
          '  await expect(\n' +
          '    page.getByRole("heading", { name: "E2E 테스트 글" })\n' +
          '  ).toBeVisible();\n' +
          '});',
        description:
          "Route Handler는 NextRequest를 직접 생성하여 테스트하고, Server Actions는 함수를 호출하며, E2E는 Playwright로 전체 흐름을 검증합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 테스팅 대상 | 도구 | 핵심 전략 |\n" +
        "|------------|------|----------|\n" +
        "| Server Component | Jest + 직접 호출 | async 함수 호출 후 JSX 렌더링 |\n" +
        "| Client Component | RTL + userEvent | 모킹(next/navigation) + 인터랙션 |\n" +
        "| Route Handler | Jest + NextRequest | 함수 직접 호출, Response 검증 |\n" +
        "| Server Actions | Jest + FormData | 함수 호출, redirect/revalidate 모킹 |\n" +
        "| E2E | Playwright | 실제 브라우저에서 전체 흐름 |\n\n" +
        "**핵심:** Next.js 테스팅은 컴포넌트 유형에 따라 전략이 달라집니다. Server Component는 async 함수를 직접 호출하고, Client Component는 모킹과 인터랙션 테스트를, Route Handler는 Request/Response를 직접 다룹니다. `next/jest`가 복잡한 설정을 간소화해줍니다.\n\n" +
        "**다음 챕터 미리보기:** 테스트를 통과한 앱을 Vercel, Docker, 정적 내보내기 등 다양한 방법으로 배포하는 전략을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Next.js 테스팅은 Server Components(async), Client Components(인터랙션), Route Handlers(요청/응답), E2E(전체 흐름)로 구분된다. next/jest가 설정을 간소화해준다.",
  checklist: [
    "next/jest를 사용하여 Jest를 설정할 수 있다",
    "async Server Component를 직접 호출하여 테스트하는 방법을 안다",
    "next/navigation 훅을 모킹하여 Client Component를 테스트할 수 있다",
    "Route Handler를 NextRequest로 테스트하는 방법을 이해한다",
    "Playwright로 E2E 테스트를 작성할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "async Server Component를 테스트하는 올바른 방법은?",
      choices: [
        "render(<ServerComponent />)로 바로 렌더링한다",
        "Server Component 함수를 직접 호출하여 JSX를 받은 후 render한다",
        "E2E 테스트로만 검증할 수 있다",
        "useEffect에서 데이터를 모킹한다",
      ],
      correctIndex: 1,
      explanation:
        "async Server Component는 함수를 직접 호출(await ServerComponent())하여 반환된 JSX를 render()에 전달합니다. 일반 render()에 직접 전달하면 Promise 객체가 렌더링됩니다.",
    },
    {
      id: "q2",
      question: "next/jest가 자동으로 처리해주는 것이 아닌 것은?",
      choices: [
        "SWC 트랜스파일 설정",
        "@/ 경로 별칭 매핑",
        "CSS/이미지 모듈 모킹",
        "데이터베이스 연결 모킹",
      ],
      correctIndex: 3,
      explanation:
        "next/jest는 SWC 컴파일, 경로 별칭, CSS/이미지 모킹을 자동 처리하지만, 데이터베이스 같은 비즈니스 로직 의존성은 개발자가 직접 jest.mock()으로 모킹해야 합니다.",
    },
    {
      id: "q3",
      question: "Client Component에서 useRouter를 사용하는 컴포넌트를 테스트할 때 필요한 것은?",
      choices: [
        "실제 Next.js 서버를 실행해야 한다",
        "jest.mock('next/navigation')으로 모킹한다",
        "useRouter 대신 window.location을 사용하도록 변경한다",
        "E2E 테스트만으로 검증한다",
      ],
      correctIndex: 1,
      explanation:
        "jest.mock('next/navigation')으로 useRouter, useSearchParams 등을 모킹하면, Next.js 런타임 없이도 컴포넌트를 단위 테스트할 수 있습니다.",
    },
    {
      id: "q4",
      question: "Route Handler를 테스트할 때 요청 객체를 생성하는 방법은?",
      choices: [
        "supertest를 사용한다",
        "fetch()로 실제 서버에 요청한다",
        "new NextRequest()로 직접 생성한다",
        "Express의 req 객체를 사용한다",
      ],
      correctIndex: 2,
      explanation:
        "Route Handler는 NextRequest를 받아 Response를 반환하는 함수이므로, new NextRequest()로 객체를 생성하여 함수에 전달하고 반환된 Response를 검증합니다.",
    },
    {
      id: "q5",
      question: "Playwright E2E 테스트의 특징이 아닌 것은?",
      choices: [
        "실제 브라우저에서 테스트를 실행한다",
        "사용자의 전체 흐름을 검증할 수 있다",
        "Jest보다 실행 속도가 빠르다",
        "페이지 네비게이션과 폼 제출을 테스트할 수 있다",
      ],
      correctIndex: 2,
      explanation:
        "Playwright E2E 테스트는 실제 브라우저를 띄우므로 Jest 단위 테스트보다 실행 속도가 느립니다. 하지만 전체 사용자 흐름을 가장 현실적으로 검증할 수 있다는 장점이 있습니다.",
    },
  ],
};

export default chapter;
