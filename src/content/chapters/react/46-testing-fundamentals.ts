import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "46-testing-fundamentals",
  subject: "react",
  title: "테스팅 기초",
  description:
    "테스트 피라미드, 단위/통합/E2E 테스트의 차이, 사용자 관점 테스트 철학, TDD와 BDD 접근법을 학습합니다.",
  order: 46,
  group: "테스팅",
  prerequisites: ["45-swr-comparison"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "테스트는 **건물 안전 점검**과 같습니다.\n\n" +
        "**단위 테스트(Unit Test)**는 벽돌 하나하나의 강도를 검사하는 것입니다. 가장 작은 단위가 튼튼한지 확인합니다.\n\n" +
        "**통합 테스트(Integration Test)**는 벽돌이 모여 만든 벽이 제대로 서 있는지, 배관과 전기가 연결되는지 확인하는 것입니다. 부품들이 함께 잘 동작하는지 봅니다.\n\n" +
        "**E2E 테스트(End-to-End)**는 완성된 건물에 사람이 직접 들어가서 문을 열어보고, 수도꼭지를 틀어보고, 엘리베이터를 타보는 것입니다.\n\n" +
        "**테스트 피라미드**는 이 세 가지의 비율입니다. 벽돌 검사(단위)가 가장 많고, 건물 전체 점검(E2E)은 가장 적습니다. 아래에서 위로 갈수록 비용이 비싸고 느리기 때문입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React 애플리케이션을 테스트하지 않으면 어떤 문제가 발생할까요?\n\n" +
        "1. **회귀 버그** — 기능 A를 수정했더니 기능 B가 깨집니다. 테스트가 없으면 배포 후에야 발견됩니다.\n\n" +
        "2. **리팩토링 공포** — 테스트 없이 코드를 변경하면 무엇이 깨질지 예측할 수 없어, 점점 코드를 건드리지 않게 됩니다.\n\n" +
        "3. **구현 세부사항 테스트** — 내부 state 이름이나 메서드를 직접 테스트하면, 구현을 바꿀 때마다 테스트도 같이 깨집니다.\n\n" +
        "4. **테스트 비용 대비 효과 불균형** — E2E 테스트만 작성하면 느리고 불안정하며, 단위 테스트만 작성하면 통합 시 문제를 놓칩니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 테스트 피라미드\n" +
        "단위 테스트를 가장 많이, 통합 테스트를 중간 정도, E2E 테스트를 가장 적게 작성합니다. 이 비율이 비용 대비 효과를 극대화합니다.\n\n" +
        "### 사용자 관점 테스트\n" +
        "React Testing Library의 핵심 철학은 '사용자가 보는 대로 테스트하라'입니다. 내부 state나 구현 세부사항이 아니라, 화면에 보이는 텍스트와 사용자 인터랙션을 기준으로 테스트합니다.\n\n" +
        "### TDD (Test-Driven Development)\n" +
        "Red → Green → Refactor 사이클입니다. 실패하는 테스트를 먼저 작성하고(Red), 테스트를 통과하는 최소 코드를 작성하고(Green), 코드를 개선합니다(Refactor).\n\n" +
        "### BDD (Behavior-Driven Development)\n" +
        "Given(주어진 상황) → When(행동) → Then(기대 결과) 형식으로 시나리오를 작성합니다. 비개발자도 이해할 수 있는 명세 기반 테스트입니다.\n\n" +
        "### 테스트 트로피\n" +
        "Kent C. Dodds가 제안한 모델로, 통합 테스트에 가장 큰 비중을 둡니다. React 컴포넌트는 통합 테스트가 비용 대비 효과가 가장 좋습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 테스트 구조와 사이클",
      content:
        "TDD 사이클과 테스트 구조를 의사코드로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// === TDD 사이클: Red → Green → Refactor ===\n' +
          '\n' +
          '// 1단계: Red — 실패하는 테스트 작성\n' +
          'test("카운터가 클릭 시 1 증가한다", () => {\n' +
          '  render(<Counter />);\n' +
          '  const button = screen.getByRole("button", { name: "증가" });\n' +
          '  fireEvent.click(button);\n' +
          '  expect(screen.getByText("1")).toBeInTheDocument();\n' +
          '});\n' +
          '// → 아직 Counter 컴포넌트가 없으므로 실패 (Red)\n' +
          '\n' +
          '// 2단계: Green — 최소한의 구현\n' +
          'function Counter() {\n' +
          '  const [count, setCount] = useState(0);\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <span>{count}</span>\n' +
          '      <button onClick={() => setCount(c => c + 1)}>증가</button>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '// → 테스트 통과 (Green)\n' +
          '\n' +
          '// 3단계: Refactor — 코드 개선\n' +
          '// 동작은 유지하면서 구조 개선\n' +
          '\n' +
          '// === BDD 스타일: Given-When-Then ===\n' +
          'describe("장바구니", () => {\n' +
          '  it("상품을 추가하면 총 금액이 업데이트된다", () => {\n' +
          '    // Given: 빈 장바구니가 있다\n' +
          '    render(<Cart />);\n' +
          '    expect(screen.getByText("총액: 0원")).toBeInTheDocument();\n' +
          '\n' +
          '    // When: 10,000원 상품을 추가한다\n' +
          '    fireEvent.click(screen.getByRole("button", { name: "상품A 추가" }));\n' +
          '\n' +
          '    // Then: 총 금액이 10,000원이 된다\n' +
          '    expect(screen.getByText("총액: 10,000원")).toBeInTheDocument();\n' +
          '  });\n' +
          '});',
        description:
          "TDD는 실패하는 테스트부터 시작하고, BDD는 사용자 시나리오를 기반으로 테스트를 구조화합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 테스트 피라미드 적용",
      content:
        "로그인 기능을 테스트 피라미드 관점에서 나누어 봅시다.",
      code: {
        language: "typescript",
        code:
          '// === 단위 테스트: 유틸 함수 ===\n' +
          'describe("validateEmail", () => {\n' +
          '  test("올바른 이메일 형식은 true를 반환한다", () => {\n' +
          '    expect(validateEmail("user@example.com")).toBe(true);\n' +
          '  });\n' +
          '\n' +
          '  test("@ 없는 문자열은 false를 반환한다", () => {\n' +
          '    expect(validateEmail("invalid-email")).toBe(false);\n' +
          '  });\n' +
          '});\n' +
          '\n' +
          '// === 통합 테스트: 컴포넌트 + 상태 ===\n' +
          'describe("LoginForm", () => {\n' +
          '  test("잘못된 이메일 입력 시 에러 메시지를 표시한다", () => {\n' +
          '    render(<LoginForm />);\n' +
          '    const emailInput = screen.getByLabelText("이메일");\n' +
          '    const submitButton = screen.getByRole("button", { name: "로그인" });\n' +
          '\n' +
          '    fireEvent.change(emailInput, { target: { value: "bad-email" } });\n' +
          '    fireEvent.click(submitButton);\n' +
          '\n' +
          '    expect(screen.getByText("올바른 이메일을 입력하세요")).toBeInTheDocument();\n' +
          '  });\n' +
          '});\n' +
          '\n' +
          '// === E2E 테스트: 전체 플로우 ===\n' +
          '// Playwright 예시\n' +
          'test("사용자가 로그인에 성공한다", async ({ page }) => {\n' +
          '  await page.goto("/login");\n' +
          '  await page.getByLabel("이메일").fill("user@example.com");\n' +
          '  await page.getByLabel("비밀번호").fill("password123");\n' +
          '  await page.getByRole("button", { name: "로그인" }).click();\n' +
          '  await expect(page.getByText("대시보드")).toBeVisible();\n' +
          '});',
        description:
          "같은 기능이라도 테스트 레벨에 따라 범위와 관점이 달라집니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 테스트 유형 | 범위 | 속도 | 비용 | 비율 |\n" +
        "|------------|------|------|------|------|\n" +
        "| 단위 테스트 | 함수/모듈 | 빠름 | 낮음 | 많이 |\n" +
        "| 통합 테스트 | 컴포넌트 조합 | 보통 | 중간 | 적당히 |\n" +
        "| E2E 테스트 | 전체 플로우 | 느림 | 높음 | 적게 |\n\n" +
        "**핵심:** 사용자가 보는 것을 테스트하세요. 구현 세부사항(state 이름, 내부 메서드)이 아니라, 화면에 보이는 텍스트와 동작을 기준으로 테스트합니다.\n\n" +
        "**다음 챕터 미리보기:** React Testing Library를 사용하여 실제 컴포넌트를 테스트하는 구체적인 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "테스트 피라미드의 세 계층과 각 비율을 설명할 수 있다",
    "단위/통합/E2E 테스트의 차이와 적절한 사용 시점을 안다",
    "사용자 관점 테스트 철학을 이해하고 적용할 수 있다",
    "TDD의 Red-Green-Refactor 사이클을 설명할 수 있다",
    "BDD의 Given-When-Then 패턴을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "테스트 피라미드에서 가장 많이 작성해야 하는 테스트 유형은?",
      choices: ["E2E 테스트", "통합 테스트", "단위 테스트", "시각적 회귀 테스트"],
      correctIndex: 2,
      explanation:
        "테스트 피라미드의 가장 아래(넓은 부분)에 단위 테스트가 위치합니다. 빠르고 비용이 낮아 가장 많이 작성합니다.",
    },
    {
      id: "q2",
      question: "React Testing Library의 핵심 철학은?",
      choices: [
        "내부 state를 직접 검증한다",
        "사용자가 보는 것을 테스트한다",
        "모든 컴포넌트의 스냅샷을 저장한다",
        "코드 커버리지 100%를 목표로 한다",
      ],
      correctIndex: 1,
      explanation:
        "React Testing Library는 '소프트웨어가 사용되는 방식과 유사하게 테스트할수록 더 많은 신뢰를 줄 수 있다'는 철학을 가집니다.",
    },
    {
      id: "q3",
      question: "TDD 사이클의 올바른 순서는?",
      choices: [
        "Green → Red → Refactor",
        "Refactor → Red → Green",
        "Red → Green → Refactor",
        "Red → Refactor → Green",
      ],
      correctIndex: 2,
      explanation:
        "TDD는 실패하는 테스트 작성(Red) → 최소 구현으로 통과(Green) → 코드 개선(Refactor) 순서입니다.",
    },
    {
      id: "q4",
      question: "BDD에서 사용하는 시나리오 구조는?",
      choices: [
        "Arrange-Act-Assert",
        "Given-When-Then",
        "Setup-Execute-Verify",
        "Input-Process-Output",
      ],
      correctIndex: 1,
      explanation:
        "BDD는 Given(사전 조건) → When(행동) → Then(기대 결과) 구조로 시나리오를 기술합니다. Arrange-Act-Assert는 단위 테스트에서 일반적으로 사용되는 패턴입니다.",
    },
    {
      id: "q5",
      question: "구현 세부사항을 테스트하면 어떤 문제가 발생하는가?",
      choices: [
        "테스트 실행 속도가 느려진다",
        "리팩토링할 때마다 테스트가 깨진다",
        "E2E 테스트와 중복된다",
        "코드 커버리지가 낮아진다",
      ],
      correctIndex: 1,
      explanation:
        "내부 state 이름이나 메서드를 직접 테스트하면, 기능은 동일하게 동작해도 구현을 변경할 때마다 테스트가 깨집니다. 사용자 관점 테스트는 이 문제를 피합니다.",
    },
    {
      id: "q6",
      question: "Kent C. Dodds의 '테스트 트로피'에서 가장 큰 비중을 차지하는 테스트는?",
      choices: ["단위 테스트", "통합 테스트", "E2E 테스트", "정적 분석"],
      correctIndex: 1,
      explanation:
        "테스트 트로피에서는 통합 테스트가 가장 큰 비중을 차지합니다. React 컴포넌트의 경우 여러 요소가 함께 동작하는 통합 테스트가 비용 대비 가장 높은 신뢰를 제공합니다.",
    },
  ],
};

export default chapter;
