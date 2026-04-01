import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "50-e2e-testing",
  subject: "react",
  title: "E2E 테스트",
  description:
    "Playwright/Cypress 개요, 페이지 오브젝트 패턴, 셀렉터 전략, CI 통합, 시각적 회귀 테스트를 학습합니다.",
  order: 50,
  group: "테스팅",
  prerequisites: ["49-hook-testing"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "E2E 테스트는 **미스터리 쇼퍼**와 같습니다.\n\n" +
        "단위 테스트가 재료를 검사하고, 통합 테스트가 조리 과정을 확인하는 것이라면, E2E 테스트는 실제 손님처럼 식당에 들어가서 주문부터 계산까지 전체 경험을 테스트합니다.\n\n" +
        "**Playwright/Cypress**는 미스터리 쇼퍼 에이전시입니다. 자동으로 웹사이트를 방문하고, 클릭하고, 입력하고, 결과를 확인합니다.\n\n" +
        "**페이지 오브젝트 패턴**은 체크리스트입니다. '로그인 페이지에서는 이것을 확인, 대시보드에서는 저것을 확인'처럼 페이지별로 검사 항목을 정리합니다.\n\n" +
        "**시각적 회귀 테스트**는 이전 방문 때 찍은 사진과 지금 모습을 비교하는 것입니다. 메뉴판 글꼴이 바뀌었거나, 인테리어가 달라졌으면 알려줍니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "E2E 테스트에는 고유한 도전 과제들이 있습니다.\n\n" +
        "1. **실행 속도** — 실제 브라우저를 띄우고 페이지를 로드하므로 단위 테스트보다 수십~수백 배 느립니다.\n\n" +
        "2. **불안정성(Flaky)** — 네트워크 지연, 애니메이션 타이밍, 브라우저 차이 등으로 같은 테스트가 때때로 실패합니다.\n\n" +
        "3. **유지보수 비용** — UI가 변경되면 관련 테스트를 모두 수정해야 합니다. 셀렉터가 깨지기 쉽습니다.\n\n" +
        "4. **CI 환경 차이** — 로컬에서는 통과하지만 CI 서버에서는 실패하는 경우가 빈번합니다. 헤드리스 브라우저, 해상도, 타임존 등이 다를 수 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### Playwright vs Cypress\n" +
        "**Playwright**는 Chromium, Firefox, WebKit을 모두 지원하며, 멀티 탭/컨텍스트를 다룰 수 있고, 네이티브 async/await 기반입니다.\n" +
        "**Cypress**는 개발자 경험이 우수하고 시간 여행 디버깅이 강력하지만, 단일 탭만 지원하며 Chromium 기반 브라우저에 최적화되어 있습니다.\n\n" +
        "### 페이지 오브젝트 패턴 (POM)\n" +
        "각 페이지를 클래스/객체로 추상화합니다. 셀렉터와 액션을 한 곳에 모아 UI 변경 시 수정 지점을 최소화합니다.\n\n" +
        "### 셀렉터 전략\n" +
        "1. **data-testid** — E2E에서는 가장 안정적인 셀렉터입니다\n" +
        "2. **역할 기반(getByRole)** — 접근성과 일치하는 셀렉터\n" +
        "3. **텍스트 기반** — 사용자가 보는 텍스트로 찾기\n" +
        "4. **CSS 선택자 지양** — 스타일링 변경에 취약합니다\n\n" +
        "### CI 통합\n" +
        "Docker 컨테이너에서 헤드리스 모드로 실행하고, 재시도(retry) 설정으로 Flaky 테스트를 완화합니다. 병렬 실행으로 속도를 개선합니다.\n\n" +
        "### 시각적 회귀 테스트\n" +
        "스크린샷을 기준 이미지와 비교하여 UI 변경을 감지합니다. Percy, Chromatic, Playwright의 내장 스크린샷 비교 등을 사용합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 페이지 오브젝트와 테스트 설계",
      content:
        "페이지 오브젝트 패턴의 구조를 의사코드로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// === 페이지 오브젝트 패턴 ===\n' +
          'import { Page, Locator } from "@playwright/test";\n' +
          '\n' +
          'class LoginPage {\n' +
          '  private page: Page;\n' +
          '  private emailInput: Locator;\n' +
          '  private passwordInput: Locator;\n' +
          '  private submitButton: Locator;\n' +
          '\n' +
          '  constructor(page: Page) {\n' +
          '    this.page = page;\n' +
          '    this.emailInput = page.getByLabel("이메일");\n' +
          '    this.passwordInput = page.getByLabel("비밀번호");\n' +
          '    this.submitButton = page.getByRole("button", { name: "로그인" });\n' +
          '  }\n' +
          '\n' +
          '  async goto() {\n' +
          '    await this.page.goto("/login");\n' +
          '  }\n' +
          '\n' +
          '  async login(email: string, password: string) {\n' +
          '    await this.emailInput.fill(email);\n' +
          '    await this.passwordInput.fill(password);\n' +
          '    await this.submitButton.click();\n' +
          '  }\n' +
          '\n' +
          '  async getErrorMessage() {\n' +
          '    return this.page.getByRole("alert").textContent();\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          'class DashboardPage {\n' +
          '  private page: Page;\n' +
          '\n' +
          '  constructor(page: Page) {\n' +
          '    this.page = page;\n' +
          '  }\n' +
          '\n' +
          '  async getWelcomeMessage() {\n' +
          '    return this.page.getByRole("heading", { level: 1 }).textContent();\n' +
          '  }\n' +
          '}',
        description:
          "페이지 오브젝트는 셀렉터와 액션을 캡슐화하여 UI 변경 시 수정 지점을 한 곳으로 집중시킵니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Playwright E2E 테스트",
      content:
        "로그인 플로우를 페이지 오브젝트 패턴으로 테스트합니다.",
      code: {
        language: "typescript",
        code:
          'import { test, expect } from "@playwright/test";\n' +
          '\n' +
          '// === 페이지 오브젝트 활용 ===\n' +
          'test.describe("로그인 플로우", () => {\n' +
          '  test("올바른 자격증명으로 로그인에 성공한다", async ({ page }) => {\n' +
          '    const loginPage = new LoginPage(page);\n' +
          '    await loginPage.goto();\n' +
          '    await loginPage.login("user@example.com", "password123");\n' +
          '\n' +
          '    const dashboard = new DashboardPage(page);\n' +
          '    const welcome = await dashboard.getWelcomeMessage();\n' +
          '    expect(welcome).toContain("환영합니다");\n' +
          '  });\n' +
          '\n' +
          '  test("잘못된 비밀번호로 에러를 표시한다", async ({ page }) => {\n' +
          '    const loginPage = new LoginPage(page);\n' +
          '    await loginPage.goto();\n' +
          '    await loginPage.login("user@example.com", "wrong");\n' +
          '\n' +
          '    const error = await loginPage.getErrorMessage();\n' +
          '    expect(error).toBe("이메일 또는 비밀번호가 올바르지 않습니다");\n' +
          '  });\n' +
          '});\n' +
          '\n' +
          '// === 시각적 회귀 테스트 ===\n' +
          'test("대시보드 레이아웃이 변경되지 않았다", async ({ page }) => {\n' +
          '  await page.goto("/dashboard");\n' +
          '  // 데이터 로딩 완료 대기\n' +
          '  await page.getByText("대시보드").waitFor();\n' +
          '  // 스크린샷 비교\n' +
          '  await expect(page).toHaveScreenshot("dashboard.png", {\n' +
          '    maxDiffPixelRatio: 0.01,\n' +
          '  });\n' +
          '});\n' +
          '\n' +
          '// === CI 설정 (playwright.config.ts) ===\n' +
          'const config = {\n' +
          '  retries: process.env.CI ? 2 : 0,\n' +
          '  workers: process.env.CI ? 4 : undefined,\n' +
          '  use: {\n' +
          '    trace: "on-first-retry",\n' +
          '    screenshot: "only-on-failure",\n' +
          '  },\n' +
          '};',
        description:
          "페이지 오브젝트로 테스트를 구조화하고, CI에서는 retry와 병렬 실행을 설정합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 도구 | 장점 | 단점 |\n" +
        "|------|------|------|\n" +
        "| Playwright | 멀티 브라우저, async/await, 빠름 | 학습 곡선 |\n" +
        "| Cypress | DX 우수, 시간 여행 디버깅 | 단일 탭, Chromium 중심 |\n\n" +
        "**핵심:** E2E 테스트는 핵심 사용자 플로우(로그인, 결제, 가입)에 집중하세요. 모든 것을 E2E로 테스트하면 느리고 불안정해집니다.\n\n" +
        "**다음 챕터 미리보기:** 컴포넌트 설계 원칙을 배우며, 테스트하기 좋은 컴포넌트를 만드는 방법을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "E2E 테스트는 실제 브라우저에서 전체 사용자 흐름을 검증한다. Cypress나 Playwright로 핵심 시나리오만 커버하고, 나머지는 단위·통합 테스트에 맡긴다.",
  checklist: [
    "Playwright와 Cypress의 차이를 설명할 수 있다",
    "페이지 오브젝트 패턴을 구현할 수 있다",
    "안정적인 셀렉터 전략을 선택할 수 있다",
    "CI 환경에서 E2E 테스트를 설정할 수 있다",
    "시각적 회귀 테스트의 개념과 도구를 안다",
  ],
  quiz: [
    {
      id: "q1",
      question: "페이지 오브젝트 패턴의 가장 큰 장점은?",
      choices: [
        "테스트 실행 속도가 빨라진다",
        "UI 변경 시 수정 지점을 한 곳으로 집중시킨다",
        "자동으로 스크린샷을 생성한다",
        "브라우저 호환성을 보장한다",
      ],
      correctIndex: 1,
      explanation:
        "페이지 오브젝트 패턴은 셀렉터와 액션을 캡슐화하여, UI가 변경되면 해당 페이지 객체만 수정하면 됩니다. 테스트 코드의 유지보수성이 크게 향상됩니다.",
    },
    {
      id: "q2",
      question: "E2E 테스트에서 가장 안정적인 셀렉터 전략은?",
      choices: [
        "CSS 클래스 선택자",
        "XPath",
        "data-testid 속성",
        "DOM 트리 순서",
      ],
      correctIndex: 2,
      explanation:
        "data-testid는 스타일링이나 구조 변경에 영향받지 않아 가장 안정적입니다. CSS 클래스는 스타일링 변경에, XPath는 구조 변경에 취약합니다.",
    },
    {
      id: "q3",
      question: "Playwright가 Cypress보다 유리한 점은?",
      choices: [
        "시간 여행 디버깅 지원",
        "멀티 브라우저 및 멀티 탭 지원",
        "설정 없이 바로 사용 가능",
        "jQuery 기반 API 제공",
      ],
      correctIndex: 1,
      explanation:
        "Playwright는 Chromium, Firefox, WebKit을 모두 지원하고 멀티 탭/컨텍스트를 다룰 수 있습니다. Cypress는 시간 여행 디버깅이 강점이지만 단일 탭만 지원합니다.",
    },
    {
      id: "q4",
      question: "E2E 테스트에서 Flaky 테스트를 완화하는 방법은?",
      choices: [
        "테스트를 삭제한다",
        "retry 설정과 명시적 대기를 사용한다",
        "모든 테스트를 동기적으로 실행한다",
        "CSS 애니메이션을 추가한다",
      ],
      correctIndex: 1,
      explanation:
        "CI에서 retry를 설정하고, 요소가 나타나기를 명시적으로 기다리는(waitFor, expect.toBeVisible) 방식으로 Flaky 테스트를 완화합니다.",
    },
    {
      id: "q5",
      question: "시각적 회귀 테스트의 원리는?",
      choices: [
        "DOM 구조를 비교한다",
        "CSS 파일의 diff를 분석한다",
        "스크린샷을 기준 이미지와 픽셀 단위로 비교한다",
        "HTML 소스 코드를 비교한다",
      ],
      correctIndex: 2,
      explanation:
        "시각적 회귀 테스트는 현재 스크린샷을 이전에 저장한 기준 이미지와 픽셀 단위로 비교하여 UI 변경을 감지합니다.",
    },
  ],
};

export default chapter;
