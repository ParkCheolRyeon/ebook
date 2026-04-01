import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "48-component-test-patterns",
  subject: "react",
  title: "컴포넌트 테스트 패턴",
  description:
    "사용자 관점 테스트, 비동기 테스트(findBy), API/모듈 모킹, Provider 래핑, 스냅샷 테스트 주의사항을 학습합니다.",
  order: 48,
  group: "테스팅",
  prerequisites: ["47-react-testing-library"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "컴포넌트 테스트 패턴은 **자동차 검사 항목**과 같습니다.\n\n" +
        "**사용자 관점 테스트**는 시운전입니다. 핸들을 돌리면 차가 도는지, 브레이크를 밟으면 멈추는지 확인합니다. 엔진 내부 피스톤이 몇 번 움직이는지는 검사하지 않습니다.\n\n" +
        "**모킹(Mocking)**은 시뮬레이터입니다. 실제 도로에 나가지 않고도 다양한 도로 상황(비, 안개, 사고)을 재현할 수 있습니다. API 호출을 실제로 하지 않고 가짜 응답을 만들어 테스트합니다.\n\n" +
        "**Provider 래핑**은 자동차에 연료를 넣는 것입니다. 엔진(컴포넌트)이 동작하려면 연료(Context, Store)가 필요합니다.\n\n" +
        "**스냅샷 테스트**는 자동차 사진을 찍어두는 것입니다. 변경 후 이전 사진과 비교하지만, 사진만으로 실제 주행 성능은 알 수 없습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "컴포넌트를 테스트할 때 마주치는 구체적인 어려움들입니다.\n\n" +
        "1. **비동기 데이터** — API에서 데이터를 가져온 후 렌더링하는 컴포넌트는 어떻게 테스트할까요?\n\n" +
        "2. **외부 의존성** — 실제 API를 호출하면 테스트가 느리고 불안정해집니다. 네트워크 상태에 따라 성공/실패가 달라집니다.\n\n" +
        "3. **Context 의존** — 테마, 인증, 라우터 등 Context에 의존하는 컴포넌트는 Provider 없이 렌더링할 수 없습니다.\n\n" +
        "4. **스냅샷 남용** — 스냅샷 테스트는 쉽게 작성할 수 있지만, 의미 없는 변경에도 깨지고 실제 동작을 검증하지 못합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 비동기 테스트 패턴\n" +
        "`findBy` 쿼리를 사용하면 비동기 렌더링을 자연스럽게 테스트할 수 있습니다. 로딩 → 데이터 표시 → 에러 처리 순서로 확인합니다.\n\n" +
        "### API 모킹\n" +
        "**MSW(Mock Service Worker)**를 사용하면 네트워크 레벨에서 요청을 가로채서 가짜 응답을 반환합니다. `jest.mock`으로 모듈 자체를 교체하는 것보다 실제 동작에 더 가깝습니다.\n\n" +
        "### 모듈 모킹\n" +
        "`jest.mock()`이나 `vi.mock()`으로 특정 모듈을 가짜 구현으로 교체합니다. 라우터, 외부 라이브러리 등을 모킹할 때 유용합니다.\n\n" +
        "### Provider 래핑 유틸\n" +
        "커스텀 `renderWithProviders` 함수를 만들어 필요한 Provider들을 자동으로 감쌉니다. 테스트마다 Provider를 수동으로 작성하는 반복을 제거합니다.\n\n" +
        "### 스냅샷 테스트 주의\n" +
        "스냅샷은 의도하지 않은 UI 변경을 감지하는 보조 수단입니다. 주요 테스트를 대체할 수 없으며, 큰 컴포넌트의 스냅샷은 리뷰하기 어렵습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 테스트 유틸리티 설계",
      content:
        "재사용 가능한 테스트 유틸리티와 모킹 패턴을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// === Provider 래핑 유틸리티 ===\n' +
          'import { render, RenderOptions } from "@testing-library/react";\n' +
          'import { QueryClient, QueryClientProvider } from "@tanstack/react-query";\n' +
          'import { ThemeProvider } from "./ThemeContext";\n' +
          '\n' +
          'interface CustomRenderOptions extends RenderOptions {\n' +
          '  theme?: "light" | "dark";\n' +
          '}\n' +
          '\n' +
          'function renderWithProviders(\n' +
          '  ui: React.ReactElement,\n' +
          '  options: CustomRenderOptions = {}\n' +
          ') {\n' +
          '  const { theme = "light", ...renderOptions } = options;\n' +
          '  const queryClient = new QueryClient({\n' +
          '    defaultOptions: { queries: { retry: false } },\n' +
          '  });\n' +
          '\n' +
          '  function Wrapper({ children }: { children: React.ReactNode }) {\n' +
          '    return (\n' +
          '      <QueryClientProvider client={queryClient}>\n' +
          '        <ThemeProvider initialTheme={theme}>\n' +
          '          {children}\n' +
          '        </ThemeProvider>\n' +
          '      </QueryClientProvider>\n' +
          '    );\n' +
          '  }\n' +
          '\n' +
          '  return render(ui, { wrapper: Wrapper, ...renderOptions });\n' +
          '}\n' +
          '\n' +
          '// === MSW 핸들러 설정 ===\n' +
          'import { http, HttpResponse } from "msw";\n' +
          'import { setupServer } from "msw/node";\n' +
          '\n' +
          'const handlers = [\n' +
          '  http.get("/api/users", () => {\n' +
          '    return HttpResponse.json([\n' +
          '      { id: 1, name: "Alice" },\n' +
          '      { id: 2, name: "Bob" },\n' +
          '    ]);\n' +
          '  }),\n' +
          '];\n' +
          '\n' +
          'const server = setupServer(...handlers);\n' +
          'beforeAll(() => server.listen());\n' +
          'afterEach(() => server.resetHandlers());\n' +
          'afterAll(() => server.close());',
        description:
          "Provider 래핑 유틸리티는 테스트마다 반복되는 보일러플레이트를 제거하고, MSW는 네트워크 레벨에서 API를 모킹합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 사용자 목록 컴포넌트 테스트",
      content:
        "비동기 데이터 로딩, 에러 처리, 사용자 인터랙션을 테스트합니다.",
      code: {
        language: "typescript",
        code:
          '// === 비동기 컴포넌트 테스트 ===\n' +
          'describe("UserList", () => {\n' +
          '  test("사용자 목록을 로딩 후 표시한다", async () => {\n' +
          '    renderWithProviders(<UserList />);\n' +
          '\n' +
          '    // 로딩 중 스피너 확인\n' +
          '    expect(screen.getByRole("progressbar")).toBeInTheDocument();\n' +
          '\n' +
          '    // 데이터 로딩 후 사용자 표시 (findBy = 비동기 대기)\n' +
          '    expect(await screen.findByText("Alice")).toBeInTheDocument();\n' +
          '    expect(screen.getByText("Bob")).toBeInTheDocument();\n' +
          '\n' +
          '    // 로딩 스피너가 사라졌는지 확인\n' +
          '    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();\n' +
          '  });\n' +
          '\n' +
          '  test("API 에러 시 에러 메시지를 표시한다", async () => {\n' +
          '    // 이 테스트에서만 에러 응답 반환\n' +
          '    server.use(\n' +
          '      http.get("/api/users", () => {\n' +
          '        return new HttpResponse(null, { status: 500 });\n' +
          '      })\n' +
          '    );\n' +
          '\n' +
          '    renderWithProviders(<UserList />);\n' +
          '\n' +
          '    expect(await screen.findByRole("alert")).toBeInTheDocument();\n' +
          '    expect(screen.getByText("데이터를 불러오는데 실패했습니다")).toBeInTheDocument();\n' +
          '  });\n' +
          '});\n' +
          '\n' +
          '// === 모듈 모킹 예시 ===\n' +
          'vi.mock("next/navigation", () => ({\n' +
          '  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),\n' +
          '  usePathname: () => "/test",\n' +
          '}));\n' +
          '\n' +
          '// === 스냅샷 테스트 (주의해서 사용) ===\n' +
          'test("기본 렌더링 스냅샷", () => {\n' +
          '  const { container } = renderWithProviders(\n' +
          '    <UserCard name="Alice" role="Admin" />\n' +
          '  );\n' +
          '  // 작은 단위에만 사용, 큰 컴포넌트에는 비권장\n' +
          '  expect(container.firstChild).toMatchSnapshot();\n' +
          '});',
        description:
          "findBy로 비동기 데이터를 기다리고, server.use()로 테스트별 API 응답을 오버라이드합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 용도 | 주의사항 |\n" +
        "|------|------|----------|\n" +
        "| findBy | 비동기 렌더링 대기 | 타임아웃 기본 1초 |\n" +
        "| MSW | API 모킹 | 네트워크 레벨, 실제에 가까움 |\n" +
        "| jest.mock | 모듈 모킹 | 구현 세부사항 결합 주의 |\n" +
        "| renderWithProviders | Provider 래핑 | 필수 Provider만 포함 |\n" +
        "| 스냅샷 | UI 변경 감지 | 보조 수단, 남용 금지 |\n\n" +
        "**핵심:** 사용자가 경험하는 시나리오(로딩 → 데이터 표시 → 에러)를 순서대로 테스트하세요. 구현 세부사항이 아닌 동작을 검증합니다.\n\n" +
        "**다음 챕터 미리보기:** 커스텀 Hook을 독립적으로 테스트하는 방법과 renderHook, act()를 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "findBy 쿼리로 비동기 렌더링을 테스트할 수 있다",
    "MSW로 API 응답을 모킹하는 방법을 안다",
    "jest.mock/vi.mock으로 모듈을 모킹할 수 있다",
    "커스텀 renderWithProviders 유틸리티를 만들 수 있다",
    "스냅샷 테스트의 한계를 이해하고 적절히 사용한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "비동기 데이터 로딩 후 요소를 찾을 때 사용하는 쿼리는?",
      choices: ["getByText", "queryByText", "findByText", "searchByText"],
      correctIndex: 2,
      explanation:
        "findByText는 요소가 나타날 때까지 비동기적으로 기다립니다. 내부적으로 waitFor + getByText 조합으로 동작합니다.",
    },
    {
      id: "q2",
      question: "MSW(Mock Service Worker)의 동작 레벨은?",
      choices: [
        "함수 레벨에서 모킹",
        "모듈 레벨에서 모킹",
        "네트워크 레벨에서 요청을 가로챔",
        "DOM 레벨에서 이벤트를 가로챔",
      ],
      correctIndex: 2,
      explanation:
        "MSW는 Service Worker를 사용하여 네트워크 요청을 가로채고 가짜 응답을 반환합니다. 실제 fetch/axios 코드가 그대로 실행되므로 테스트가 현실적입니다.",
    },
    {
      id: "q3",
      question: "스냅샷 테스트의 가장 큰 문제점은?",
      choices: [
        "실행 속도가 느리다",
        "설정이 복잡하다",
        "의미 없는 변경에도 깨지고 실제 동작을 검증하지 못한다",
        "비동기 컴포넌트에 사용할 수 없다",
      ],
      correctIndex: 2,
      explanation:
        "스냅샷 테스트는 CSS 클래스 변경 같은 사소한 변경에도 깨지며, 개발자가 무심코 스냅샷을 업데이트하게 되면 실질적인 검증 효과가 없어집니다.",
    },
    {
      id: "q4",
      question: "renderWithProviders 유틸리티를 만드는 이유는?",
      choices: [
        "렌더링 속도를 높이기 위해",
        "테스트마다 반복되는 Provider 래핑을 제거하기 위해",
        "스냅샷 테스트를 자동화하기 위해",
        "E2E 테스트와 통합하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "Context에 의존하는 컴포넌트는 매번 Provider로 감싸야 합니다. 커스텀 render 함수로 이 보일러플레이트를 제거하고 일관된 테스트 환경을 제공합니다.",
    },
    {
      id: "q5",
      question: "server.use()로 특정 테스트에서만 에러 응답을 반환하는 패턴의 장점은?",
      choices: [
        "전체 테스트 성능이 향상된다",
        "기본 핸들러를 유지하면서 개별 테스트만 오버라이드할 수 있다",
        "실제 서버에 요청을 보낼 수 있다",
        "스냅샷 자동 업데이트가 가능하다",
      ],
      correctIndex: 1,
      explanation:
        "server.use()는 기존 핸들러를 일시적으로 오버라이드합니다. afterEach에서 server.resetHandlers()를 호출하면 다음 테스트에서는 기본 핸들러가 복원됩니다.",
    },
  ],
};

export default chapter;
