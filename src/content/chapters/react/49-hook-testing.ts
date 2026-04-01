import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "49-hook-testing",
  subject: "react",
  title: "Hook 테스트",
  description:
    "renderHook으로 커스텀 Hook을 독립 테스트하고, act() 이해, 비동기 Hook 테스트, wrapper로 Provider를 전달하는 방법을 학습합니다.",
  order: 49,
  group: "테스팅",
  prerequisites: ["48-component-test-patterns"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Hook 테스트는 **엔진 벤치 테스트**와 같습니다.\n\n" +
        "컴포넌트 테스트가 완성된 자동차를 시운전하는 것이라면, Hook 테스트는 엔진만 따로 꺼내서 테스트 벤치에 올리는 것입니다.\n\n" +
        "**renderHook**은 테스트 벤치입니다. Hook은 컴포넌트 안에서만 동작하므로, renderHook이 임시 컴포넌트를 만들어 Hook을 실행합니다.\n\n" +
        "**act()**는 '모든 작업이 끝날 때까지 기다려라'는 신호입니다. 엔진을 가동한 후 모든 부품이 안정화될 때까지 기다린 다음 측정값을 읽는 것과 같습니다.\n\n" +
        "**wrapper**는 엔진이 필요로 하는 연료 공급 장치(Provider)입니다. 엔진이 동작하려면 연료(Context)가 필요합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "커스텀 Hook을 테스트할 때 어떤 어려움이 있을까요?\n\n" +
        "1. **컴포넌트 밖에서 Hook 호출 불가** — `useCounter()`를 직접 호출하면 'Hooks can only be called inside a function component' 에러가 발생합니다.\n\n" +
        "2. **상태 업데이트와 act()** — Hook이 상태를 변경하면 React가 리렌더링을 예약합니다. 테스트에서 이 비동기 업데이트를 제대로 처리하지 않으면 경고가 발생합니다.\n\n" +
        "3. **Context 의존성** — `useAuth()`, `useTheme()` 같은 Hook은 Provider가 필요합니다.\n\n" +
        "4. **비동기 로직** — 데이터 페칭 Hook은 Promise를 반환하거나 내부적으로 비동기 작업을 수행합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### renderHook\n" +
        "`@testing-library/react`의 `renderHook`은 임시 테스트 컴포넌트를 만들어 Hook을 실행합니다. 반환값의 `result.current`로 Hook의 현재 반환값에 접근합니다.\n\n" +
        "### act()\n" +
        "React 상태 업데이트를 포함하는 코드를 `act()`로 감싸면, 모든 상태 변경과 이펙트가 적용된 후 결과를 확인할 수 있습니다. renderHook의 rerender와 waitFor는 내부적으로 act를 사용합니다.\n\n" +
        "### wrapper 옵션\n" +
        "renderHook의 `wrapper` 옵션으로 Provider를 전달합니다. Hook이 Context에 의존할 때 필수입니다.\n\n" +
        "### waitFor와 비동기 Hook\n" +
        "비동기 Hook은 `waitFor`로 상태 변경이 완료되기를 기다립니다. `result.current`는 항상 최신 값을 참조하므로, waitFor 콜백 안에서 확인하면 됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: renderHook 내부 동작",
      content:
        "renderHook이 내부적으로 어떻게 동작하는지 의사코드로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// === renderHook의 내부 동작 (간략화) ===\n' +
          'function renderHook<T>(hookFn: () => T, options?: { wrapper?: React.FC }) {\n' +
          '  const result = { current: null as T };\n' +
          '\n' +
          '  // 임시 컴포넌트를 생성하여 Hook을 실행\n' +
          '  function TestComponent() {\n' +
          '    result.current = hookFn();\n' +
          '    return null; // UI 없음\n' +
          '  }\n' +
          '\n' +
          '  // wrapper가 있으면 Provider로 감싸서 렌더링\n' +
          '  const Wrapper = options?.wrapper ?? React.Fragment;\n' +
          '  const { rerender, unmount } = render(\n' +
          '    <Wrapper><TestComponent /></Wrapper>\n' +
          '  );\n' +
          '\n' +
          '  return {\n' +
          '    result,    // result.current로 Hook 반환값 접근\n' +
          '    rerender,  // Hook을 재실행\n' +
          '    unmount,   // cleanup 테스트\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          '// === act()의 역할 ===\n' +
          '// React 18 이전: 상태 업데이트를 동기적으로 플러시\n' +
          '// React 18+: 자동 배칭과 함께 동작\n' +
          'act(() => {\n' +
          '  // 이 안의 상태 업데이트가 모두 처리된 후\n' +
          '  result.current.increment();\n' +
          '});\n' +
          '// 여기서 result.current 확인 가능',
        description:
          "renderHook은 Hook을 실행하기 위한 임시 컴포넌트를 자동으로 생성합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 다양한 Hook 테스트",
      content:
        "카운터 Hook, 비동기 데이터 Hook, Context 의존 Hook을 테스트합니다.",
      code: {
        language: "typescript",
        code:
          'import { renderHook, act, waitFor } from "@testing-library/react";\n' +
          '\n' +
          '// === 1. 기본 상태 Hook 테스트 ===\n' +
          'function useCounter(initial = 0) {\n' +
          '  const [count, setCount] = useState(initial);\n' +
          '  const increment = () => setCount(c => c + 1);\n' +
          '  const decrement = () => setCount(c => c - 1);\n' +
          '  return { count, increment, decrement };\n' +
          '}\n' +
          '\n' +
          'test("useCounter: 초기값과 증가/감소가 동작한다", () => {\n' +
          '  const { result } = renderHook(() => useCounter(10));\n' +
          '\n' +
          '  expect(result.current.count).toBe(10);\n' +
          '\n' +
          '  act(() => {\n' +
          '    result.current.increment();\n' +
          '  });\n' +
          '  expect(result.current.count).toBe(11);\n' +
          '\n' +
          '  act(() => {\n' +
          '    result.current.decrement();\n' +
          '  });\n' +
          '  expect(result.current.count).toBe(10);\n' +
          '});\n' +
          '\n' +
          '// === 2. 비동기 Hook 테스트 ===\n' +
          'function useFetchUser(userId: string) {\n' +
          '  const [user, setUser] = useState<User | null>(null);\n' +
          '  const [loading, setLoading] = useState(true);\n' +
          '\n' +
          '  useEffect(() => {\n' +
          '    fetch(`/api/users/${userId}`)\n' +
          '      .then(res => res.json())\n' +
          '      .then(data => { setUser(data); setLoading(false); });\n' +
          '  }, [userId]);\n' +
          '\n' +
          '  return { user, loading };\n' +
          '}\n' +
          '\n' +
          'test("useFetchUser: 사용자 데이터를 로딩한다", async () => {\n' +
          '  const { result } = renderHook(() => useFetchUser("1"));\n' +
          '\n' +
          '  // 초기 로딩 상태\n' +
          '  expect(result.current.loading).toBe(true);\n' +
          '  expect(result.current.user).toBeNull();\n' +
          '\n' +
          '  // 비동기 완료 대기\n' +
          '  await waitFor(() => {\n' +
          '    expect(result.current.loading).toBe(false);\n' +
          '  });\n' +
          '  expect(result.current.user?.name).toBe("Alice");\n' +
          '});\n' +
          '\n' +
          '// === 3. Context 의존 Hook 테스트 ===\n' +
          'function useThemeColor() {\n' +
          '  const { theme } = useTheme(); // Context 의존\n' +
          '  return theme === "dark" ? "#000" : "#fff";\n' +
          '}\n' +
          '\n' +
          'test("useThemeColor: 테마에 따라 색상을 반환한다", () => {\n' +
          '  const wrapper = ({ children }: { children: React.ReactNode }) => (\n' +
          '    <ThemeProvider initialTheme="dark">{children}</ThemeProvider>\n' +
          '  );\n' +
          '\n' +
          '  const { result } = renderHook(() => useThemeColor(), { wrapper });\n' +
          '  expect(result.current).toBe("#000");\n' +
          '});',
        description:
          "act()로 동기 상태 업데이트를, waitFor로 비동기 완료를, wrapper로 Provider를 처리합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| API | 용도 | 주의사항 |\n" +
        "|-----|------|----------|\n" +
        "| renderHook | Hook 독립 실행 | 임시 컴포넌트 자동 생성 |\n" +
        "| result.current | Hook 반환값 접근 | 항상 최신 값 참조 |\n" +
        "| act() | 상태 업데이트 완료 대기 | 동기 업데이트 시 필수 |\n" +
        "| waitFor | 비동기 완료 대기 | 비동기 Hook에 사용 |\n" +
        "| wrapper | Provider 전달 | Context 의존 Hook에 필수 |\n\n" +
        "**핵심:** 대부분의 Hook은 컴포넌트 테스트를 통해 간접적으로 테스트하는 것이 더 좋습니다. renderHook은 로직이 복잡한 공유 Hook을 독립적으로 테스트할 때 사용합니다.\n\n" +
        "**다음 챕터 미리보기:** E2E 테스트로 전체 사용자 플로우를 테스트하는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "renderHook으로 커스텀 Hook을 독립 테스트할 수 있다",
    "act()의 역할과 필요한 상황을 이해한다",
    "waitFor로 비동기 Hook의 완료를 기다릴 수 있다",
    "wrapper 옵션으로 Provider를 전달할 수 있다",
    "Hook을 직접 테스트할 때와 컴포넌트를 통해 테스트할 때를 구분한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "renderHook이 필요한 이유는?",
      choices: [
        "Hook이 더 빠르게 실행된다",
        "Hook은 컴포넌트 안에서만 호출할 수 있기 때문이다",
        "자동으로 모킹을 처리한다",
        "스냅샷 테스트를 지원한다",
      ],
      correctIndex: 1,
      explanation:
        "React Hook은 함수 컴포넌트 내부에서만 호출할 수 있습니다. renderHook은 임시 컴포넌트를 생성하여 Hook을 실행할 수 있는 환경을 제공합니다.",
    },
    {
      id: "q2",
      question: "act()를 사용하지 않으면 어떤 문제가 발생하는가?",
      choices: [
        "테스트가 더 느려진다",
        "상태 업데이트가 적용되기 전에 assertion을 실행하게 된다",
        "메모리 누수가 발생한다",
        "Hook이 초기화되지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "act() 없이 상태 업데이트를 트리거하면, React의 비동기 업데이트가 아직 처리되지 않은 상태에서 결과를 확인하게 됩니다. React는 이에 대한 경고를 출력합니다.",
    },
    {
      id: "q3",
      question: "renderHook의 wrapper 옵션은 언제 사용하는가?",
      choices: [
        "Hook이 props를 받을 때",
        "Hook이 Context에 의존할 때",
        "Hook이 다른 Hook을 호출할 때",
        "Hook이 DOM 요소를 반환할 때",
      ],
      correctIndex: 1,
      explanation:
        "wrapper 옵션으로 Provider 컴포넌트를 전달하면, renderHook이 생성하는 임시 컴포넌트를 해당 Provider로 감쌉니다. Context에 의존하는 Hook 테스트에 필수입니다.",
    },
    {
      id: "q4",
      question: "비동기 Hook 테스트에서 waitFor를 사용하는 이유는?",
      choices: [
        "테스트 실행 시간을 지연하기 위해",
        "비동기 상태 변경이 완료될 때까지 기다리기 위해",
        "Hook을 강제로 리렌더링하기 위해",
        "에러를 무시하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "비동기 Hook(예: 데이터 페칭)은 Promise가 resolve된 후 상태를 업데이트합니다. waitFor는 이 비동기 업데이트가 반영될 때까지 기다린 후 assertion을 실행합니다.",
    },
    {
      id: "q5",
      question: "커스텀 Hook 테스트 시 renderHook보다 컴포넌트 테스트가 더 적절한 경우는?",
      choices: [
        "Hook의 반환값이 복잡할 때",
        "Hook이 UI와 밀접하게 결합되어 있을 때",
        "Hook이 여러 상태를 관리할 때",
        "Hook이 useEffect를 사용할 때",
      ],
      correctIndex: 1,
      explanation:
        "Hook이 특정 컴포넌트의 UI와 밀접하게 결합되어 있다면, 컴포넌트를 통해 테스트하는 것이 더 현실적입니다. renderHook은 범용 로직 Hook을 독립적으로 검증할 때 적합합니다.",
    },
  ],
};

export default chapter;
