import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "20-testing-strategy",
  subject: "cs",
  title: "테스트 전략",
  description: "테스트 피라미드, 단위/통합/E2E 테스트, TDD, 프론트엔드 테스트 전략과 Testing Library 철학을 학습합니다.",
  order: 20,
  group: "소프트웨어 공학",
  prerequisites: ["19-clean-code"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "테스트는 '건물의 안전 검사'와 같습니다.\n\n" +
        "**단위 테스트(Unit Test)** — 각 벽돌과 철근의 강도를 검사합니다. " +
        "가장 작은 단위(함수, 컴포넌트)가 정상적으로 동작하는지 확인합니다. 빠르고 저렴합니다.\n\n" +
        "**통합 테스트(Integration Test)** — 벽, 바닥, 천장이 제대로 연결되었는지 검사합니다. " +
        "여러 모듈이 함께 동작할 때 문제가 없는지 확인합니다.\n\n" +
        "**E2E 테스트(End-to-End)** — 완성된 건물에 사람이 실제로 생활하며 불편함이 없는지 검사합니다. " +
        "실제 사용자 시나리오를 브라우저에서 시뮬레이션합니다. 느리고 비용이 높습니다.\n\n" +
        "**테스트 피라미드** — 벽돌 검사(단위)는 많이, 연결부 검사(통합)는 적당히, " +
        "실거주 테스트(E2E)는 핵심만. 아래가 넓고 위가 좁은 피라미드 형태가 이상적입니다.\n\n" +
        "**TDD** — 설계도(테스트)를 먼저 그리고, 그에 맞게 건물(코드)을 짓는 방식입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 테스트에서 흔히 겪는 문제들:\n\n" +
        "**1. 무엇을 테스트해야 할지 모르겠음:**\n" +
        "```typescript\n" +
        "// 이 컴포넌트에서 무엇을 테스트해야 할까?\n" +
        "function LoginForm() {\n" +
        "  const [email, setEmail] = useState('');\n" +
        "  const [error, setError] = useState('');\n" +
        "  \n" +
        "  const handleSubmit = async () => {\n" +
        "    const result = await login(email, password);\n" +
        "    if (!result.ok) setError(result.message);\n" +
        "  };\n" +
        "  // ...\n" +
        "}\n" +
        "```\n\n" +
        "**2. 구현 세부사항에 의존하는 테스트:**\n" +
        "```typescript\n" +
        "// 나쁜 테스트 — 내부 상태를 직접 확인\n" +
        "expect(wrapper.state('isLoading')).toBe(true);\n" +
        "// 리팩토링하면 테스트도 깨짐!\n" +
        "```\n\n" +
        "**3. 테스트가 너무 느리거나 불안정함:** E2E 테스트만 많으면 CI가 느려지고 " +
        "네트워크, 타이밍 이슈로 테스트가 불안정해집니다.\n\n" +
        "**4. 스냅샷 테스트 과신:** 스냅샷만 찍으면 테스트한 것 같지만, " +
        "실제로는 의도적 변경과 버그를 구분하지 못합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. 테스트 피라미드 전략\n\n" +
        "```\n" +
        "         /\\      E2E (5~10%)\n" +
        "        /  \\     핵심 사용자 시나리오만\n" +
        "       /----\\    Integration (20~30%)\n" +
        "      / Hook  \\   컴포넌트 + API 연동\n" +
        "     /--------\\   Unit (60~70%)\n" +
        "    / 순수함수,  \\  유틸, 리듀서, 포맷터\n" +
        "   /____________\\\n" +
        "```\n\n" +
        "### 2. 프론트엔드에서 무엇을 테스트할 것인가\n\n" +
        "```typescript\n" +
        "// (1) 사용자 인터랙션\n" +
        "// 버튼 클릭, 폼 입력, 드래그 등 → 결과가 UI에 반영되는가?\n" +
        "\n" +
        "// (2) 상태 변경\n" +
        "// 특정 액션 후 상태가 올바르게 변경되는가?\n" +
        "\n" +
        "// (3) API 호출\n" +
        "// 올바른 데이터로 API를 호출하고 응답을 처리하는가?\n" +
        "\n" +
        "// (4) 조건부 렌더링\n" +
        "// 로딩, 에러, 빈 상태, 데이터 존재 시 올바르게 표시하는가?\n" +
        "\n" +
        "// (5) 엣지 케이스\n" +
        "// 빈 배열, null, 긴 텍스트, 특수 문자 등\n" +
        "```\n\n" +
        "### 3. Testing Library 철학\n\n" +
        "```typescript\n" +
        "// 핵심 원칙: \"사용자가 소프트웨어를 사용하는 방식으로 테스트하라\"\n" +
        "\n" +
        "// 나쁜 테스트 — 구현 세부사항에 의존\n" +
        "// getByTestId('submit-btn')\n" +
        "// wrapper.state('isLoading')\n" +
        "\n" +
        "// 좋은 테스트 — 사용자 관점\n" +
        "// getByRole('button', { name: '로그인' })\n" +
        "// getByText('잘못된 비밀번호입니다')\n" +
        "// getByLabelText('이메일')\n" +
        "```\n\n" +
        "### 4. TDD 사이클\n\n" +
        "```\n" +
        "Red → Green → Refactor\n" +
        "1. Red:      실패하는 테스트 작성\n" +
        "2. Green:    테스트를 통과하는 최소 코드 작성\n" +
        "3. Refactor: 코드 개선 (테스트는 여전히 통과)\n" +
        "```\n\n" +
        "### 5. 스냅샷 테스트의 올바른 사용법\n\n" +
        "```typescript\n" +
        "// 의도적 사용: 특정 데이터 구조의 형태 보장\n" +
        "expect(formatUserResponse(rawData)).toMatchInlineSnapshot(`\n" +
        "  { name: 'Kim', role: 'admin' }\n" +
        "`);\n" +
        "\n" +
        "// 안티패턴: 전체 컴포넌트 스냅샷\n" +
        "// expect(render(<App />)).toMatchSnapshot(); // 모든 변경에 깨짐\n" +
        "```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 테스트 유형별 작성법",
      content:
        "단위, 통합, E2E 각 테스트를 실제로 어떻게 작성하는지 보여줍니다.",
      code: {
        language: "typescript",
        code:
          "// === 1. 단위 테스트: 순수 함수 ===\n" +
          "// utils/formatPrice.ts\n" +
          "function formatPrice(price: number): string {\n" +
          "  return new Intl.NumberFormat('ko-KR', {\n" +
          "    style: 'currency', currency: 'KRW',\n" +
          "  }).format(price);\n" +
          "}\n" +
          "\n" +
          "// formatPrice.test.ts\n" +
          "describe('formatPrice', () => {\n" +
          "  test('정수를 원화 형식으로 변환한다', () => {\n" +
          "    expect(formatPrice(1000)).toBe('\\\\u20A91,000');\n" +
          "  });\n" +
          "\n" +
          "  test('0을 올바르게 처리한다', () => {\n" +
          "    expect(formatPrice(0)).toBe('\\\\u20A90');\n" +
          "  });\n" +
          "\n" +
          "  test('음수를 올바르게 처리한다', () => {\n" +
          "    expect(formatPrice(-500)).toContain('-');\n" +
          "  });\n" +
          "});\n" +
          "\n" +
          "// === 2. 통합 테스트: 컴포넌트 + 사용자 인터랙션 ===\n" +
          "describe('LoginForm', () => {\n" +
          "  test('유효한 이메일/비밀번호로 로그인에 성공한다', async () => {\n" +
          "    // Mock API\n" +
          "    server.use(\n" +
          "      http.post('/api/login', () => HttpResponse.json({ token: 'abc' }))\n" +
          "    );\n" +
          "\n" +
          "    render(<LoginForm />);\n" +
          "\n" +
          "    // 사용자 행동 시뮬레이션\n" +
          "    await userEvent.type(screen.getByLabelText('이메일'), 'kim@test.com');\n" +
          "    await userEvent.type(screen.getByLabelText('비밀번호'), 'password123');\n" +
          "    await userEvent.click(screen.getByRole('button', { name: '로그인' }));\n" +
          "\n" +
          "    // 결과 확인 — 사용자가 보는 것 기준\n" +
          "    await waitFor(() => {\n" +
          "      expect(screen.getByText('환영합니다')).toBeInTheDocument();\n" +
          "    });\n" +
          "  });\n" +
          "\n" +
          "  test('잘못된 비밀번호 시 에러 메시지를 표시한다', async () => {\n" +
          "    server.use(\n" +
          "      http.post('/api/login', () =>\n" +
          "        HttpResponse.json({ message: '비밀번호가 틀렸습니다' }, { status: 401 })\n" +
          "      )\n" +
          "    );\n" +
          "\n" +
          "    render(<LoginForm />);\n" +
          "    await userEvent.type(screen.getByLabelText('이메일'), 'kim@test.com');\n" +
          "    await userEvent.type(screen.getByLabelText('비밀번호'), 'wrong');\n" +
          "    await userEvent.click(screen.getByRole('button', { name: '로그인' }));\n" +
          "\n" +
          "    expect(await screen.findByText('비밀번호가 틀렸습니다')).toBeInTheDocument();\n" +
          "  });\n" +
          "});\n" +
          "\n" +
          "// === 3. E2E 테스트: 핵심 사용자 시나리오 ===\n" +
          "// Playwright 예시\n" +
          "test('상품 검색부터 결제까지', async ({ page }) => {\n" +
          "  await page.goto('/products');\n" +
          "  await page.getByPlaceholder('검색').fill('키보드');\n" +
          "  await page.getByRole('button', { name: '검색' }).click();\n" +
          "  await page.getByText('기계식 키보드').click();\n" +
          "  await page.getByRole('button', { name: '장바구니 추가' }).click();\n" +
          "  await page.goto('/cart');\n" +
          "  await expect(page.getByText('기계식 키보드')).toBeVisible();\n" +
          "});",
        description:
          "단위 테스트는 순수 함수를, 통합 테스트는 컴포넌트와 사용자 인터랙션을, " +
          "E2E 테스트는 핵심 비즈니스 시나리오를 검증합니다. " +
          "MSW(Mock Service Worker)로 API를 모킹하면 네트워크 없이도 안정적인 테스트가 가능합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: TDD로 커스텀 Hook 개발",
      content:
        "TDD(Red-Green-Refactor) 사이클로 useCounter 커스텀 Hook을 개발하는 실습입니다.",
      code: {
        language: "typescript",
        code:
          "// === Step 1: Red — 실패하는 테스트 먼저 작성 ===\n" +
          "import { renderHook, act } from '@testing-library/react';\n" +
          "import { useCounter } from './useCounter';\n" +
          "\n" +
          "describe('useCounter', () => {\n" +
          "  test('초기값을 0으로 시작한다', () => {\n" +
          "    const { result } = renderHook(() => useCounter());\n" +
          "    expect(result.current.count).toBe(0);\n" +
          "  });\n" +
          "\n" +
          "  test('increment로 1 증가한다', () => {\n" +
          "    const { result } = renderHook(() => useCounter());\n" +
          "    act(() => result.current.increment());\n" +
          "    expect(result.current.count).toBe(1);\n" +
          "  });\n" +
          "\n" +
          "  test('decrement로 1 감소한다', () => {\n" +
          "    const { result } = renderHook(() => useCounter());\n" +
          "    act(() => result.current.decrement());\n" +
          "    expect(result.current.count).toBe(-1);\n" +
          "  });\n" +
          "\n" +
          "  test('커스텀 초기값을 받을 수 있다', () => {\n" +
          "    const { result } = renderHook(() => useCounter(10));\n" +
          "    expect(result.current.count).toBe(10);\n" +
          "  });\n" +
          "\n" +
          "  test('최소값 이하로 감소하지 않는다', () => {\n" +
          "    const { result } = renderHook(() => useCounter(0, { min: 0 }));\n" +
          "    act(() => result.current.decrement());\n" +
          "    expect(result.current.count).toBe(0); // 0 이하로 감소 안 됨\n" +
          "  });\n" +
          "\n" +
          "  test('reset으로 초기값으로 돌아간다', () => {\n" +
          "    const { result } = renderHook(() => useCounter(5));\n" +
          "    act(() => result.current.increment());\n" +
          "    act(() => result.current.reset());\n" +
          "    expect(result.current.count).toBe(5);\n" +
          "  });\n" +
          "});\n" +
          "\n" +
          "// === Step 2: Green — 테스트를 통과하는 구현 ===\n" +
          "interface CounterOptions {\n" +
          "  min?: number;\n" +
          "  max?: number;\n" +
          "}\n" +
          "\n" +
          "function useCounter(initialValue = 0, options: CounterOptions = {}) {\n" +
          "  const [count, setCount] = useState(initialValue);\n" +
          "\n" +
          "  const increment = useCallback(() => {\n" +
          "    setCount(prev => {\n" +
          "      const next = prev + 1;\n" +
          "      return options.max !== undefined ? Math.min(next, options.max) : next;\n" +
          "    });\n" +
          "  }, [options.max]);\n" +
          "\n" +
          "  const decrement = useCallback(() => {\n" +
          "    setCount(prev => {\n" +
          "      const next = prev - 1;\n" +
          "      return options.min !== undefined ? Math.max(next, options.min) : next;\n" +
          "    });\n" +
          "  }, [options.min]);\n" +
          "\n" +
          "  const reset = useCallback(() => {\n" +
          "    setCount(initialValue);\n" +
          "  }, [initialValue]);\n" +
          "\n" +
          "  return { count, increment, decrement, reset };\n" +
          "}\n" +
          "\n" +
          "// === Step 3: Refactor — 코드 개선 (테스트 유지) ===\n" +
          "// 이 사이클을 반복하며 기능을 추가합니다.",
        description:
          "TDD에서는 테스트를 먼저 작성하고(Red), 테스트를 통과하는 최소 코드를 구현한 후(Green), " +
          "코드를 개선합니다(Refactor). renderHook과 act를 사용해 Hook을 독립적으로 테스트합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 테스트 유형 | 범위 | 속도 | 비율 |\n" +
        "|-----------|------|------|------|\n" +
        "| 단위 테스트 | 함수, 유틸, 리듀서 | 매우 빠름 | 60~70% |\n" +
        "| 통합 테스트 | 컴포넌트 + 인터랙션 | 빠름 | 20~30% |\n" +
        "| E2E 테스트 | 전체 시나리오 | 느림 | 5~10% |\n\n" +
        "**프론트엔드 테스트 원칙:**\n" +
        "- 사용자가 보는 것을 테스트하라 (구현 세부사항이 아닌)\n" +
        "- getByRole, getByText 등 접근성 기반 쿼리를 우선 사용\n" +
        "- MSW로 API를 모킹해 네트워크 의존성 제거\n" +
        "- 스냅샷 테스트는 보조 수단으로만 사용\n" +
        "- 100% 커버리지보다 핵심 비즈니스 로직의 높은 커버리지가 중요",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "테스트 전략은 피라미드 형태(단위 > 통합 > E2E)로 구성하고, 사용자 관점에서 동작을 검증하는 것이 핵심이다.",
  checklist: [
    "테스트 피라미드의 각 계층(단위/통합/E2E)의 역할과 비율을 설명할 수 있다",
    "Testing Library의 getByRole, getByText 등 접근성 기반 쿼리를 사용할 수 있다",
    "MSW로 API를 모킹하여 컴포넌트 통합 테스트를 작성할 수 있다",
    "TDD의 Red-Green-Refactor 사이클을 이해하고 적용할 수 있다",
    "프론트엔드에서 무엇을 테스트해야 하는지(인터랙션, 상태 변경, 조건부 렌더링) 판단할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "테스트 피라미드에서 가장 많은 비율을 차지해야 하는 테스트 유형은?",
      choices: [
        "E2E 테스트",
        "통합 테스트",
        "단위 테스트",
        "스냅샷 테스트",
      ],
      correctIndex: 2,
      explanation:
        "테스트 피라미드의 가장 넓은 바닥은 단위 테스트입니다. 실행이 빠르고 비용이 낮으며 " +
        "유지보수가 쉽습니다. 순수 함수, 유틸리티, 리듀서 등을 집중적으로 테스트합니다.",
    },
    {
      id: "q2",
      question: "Testing Library에서 컴포넌트를 쿼리할 때 가장 우선 사용해야 하는 방법은?",
      choices: [
        "getByTestId",
        "getByClassName",
        "getByRole",
        "querySelector",
      ],
      correctIndex: 2,
      explanation:
        "Testing Library는 사용자가 소프트웨어를 사용하는 방식으로 테스트하라고 권장합니다. " +
        "getByRole은 접근성 역할(button, textbox 등)로 요소를 찾아 실제 사용자 경험과 가장 가깝습니다. " +
        "getByTestId는 다른 방법이 불가능할 때의 마지막 수단입니다.",
    },
    {
      id: "q3",
      question: "스냅샷 테스트의 주요 단점은?",
      choices: [
        "실행이 느리다",
        "의도적 UI 변경과 예기치 않은 변경을 구분하지 못해 리뷰어가 무의식적으로 승인하게 된다",
        "TypeScript를 지원하지 않는다",
        "비동기 코드를 테스트할 수 없다",
      ],
      correctIndex: 1,
      explanation:
        "스냅샷 테스트는 UI가 변경되면 무조건 실패합니다. 의도적 변경이든 버그든 구분하지 못하고 " +
        "'스냅샷 업데이트'를 습관적으로 하게 되어 테스트의 가치가 떨어집니다. " +
        "인라인 스냅샷이나 특정 데이터 구조에 한정적으로 사용하는 것이 좋습니다.",
    },
    {
      id: "q4",
      question: "TDD의 'Red-Green-Refactor' 사이클에서 'Red' 단계의 의미는?",
      choices: [
        "코드를 삭제하는 단계",
        "실패하는 테스트를 먼저 작성하는 단계",
        "버그를 수정하는 단계",
        "코드 리뷰를 받는 단계",
      ],
      correctIndex: 1,
      explanation:
        "TDD에서 Red는 아직 구현하지 않은 기능에 대한 테스트를 먼저 작성해 실패(빨간색)를 확인하는 단계입니다. " +
        "이후 Green 단계에서 테스트를 통과하는 최소 코드를 작성하고, Refactor 단계에서 코드를 개선합니다.",
    },
    {
      id: "q5",
      question: "프론트엔드 통합 테스트에서 MSW(Mock Service Worker)를 사용하는 이유는?",
      choices: [
        "테스트 속도를 높이기 위해",
        "네트워크 요청을 서비스 워커 레벨에서 가로채 실제 서버 없이 안정적인 테스트가 가능하기 때문",
        "스냅샷을 자동으로 생성하기 위해",
        "브라우저를 시뮬레이션하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "MSW는 서비스 워커(또는 Node.js 인터셉터)를 통해 네트워크 요청을 가로채 미리 정의한 응답을 반환합니다. " +
        "실제 서버가 필요 없고, fetch/axios 등 HTTP 클라이언트를 수정하지 않아도 되며, " +
        "네트워크 불안정으로 인한 플레이키(flaky) 테스트를 방지합니다.",
    },
  ],
};

export default chapter;
