import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "47-react-testing-library",
  subject: "react",
  title: "React Testing Library",
  description:
    "render, screen, userEvent를 사용한 컴포넌트 테스트, 쿼리 우선순위, within, waitFor 등 핵심 API를 학습합니다.",
  order: 47,
  group: "테스팅",
  prerequisites: ["46-testing-fundamentals"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "React Testing Library는 **블라인드 사용자 테스터**와 같습니다.\n\n" +
        "일반 테스트 도구가 코드 내부를 들여다보는 '개발자 시점'이라면, RTL은 화면에 보이는 것만으로 테스트하는 '사용자 시점'입니다.\n\n" +
        "**render**는 화면을 띄우는 것입니다. 마치 브라우저에서 페이지를 여는 것과 같습니다.\n\n" +
        "**screen**은 모니터 화면입니다. 화면에서 특정 요소를 찾아야 합니다.\n\n" +
        "**쿼리 우선순위**는 접근성 순서입니다. 스크린 리더가 읽는 순서(역할 → 텍스트 → 대안)로 요소를 찾으면, 접근성도 자연스럽게 보장됩니다.\n\n" +
        "**userEvent**는 실제 사용자의 손입니다. 클릭, 타이핑, 탭 이동 등 실제 사용자의 행동을 시뮬레이션합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "Enzyme 같은 이전 테스트 도구의 문제점은 무엇이었을까요?\n\n" +
        "1. **구현 세부사항 의존** — `wrapper.state()`, `wrapper.instance()` 같은 API로 내부 state와 인스턴스에 직접 접근했습니다. 리팩토링 시 테스트가 깨집니다.\n\n" +
        "2. **얕은 렌더링(Shallow Rendering)** — 자식 컴포넌트를 렌더링하지 않아 실제 동작과 다른 결과를 줄 수 있습니다.\n\n" +
        "3. **접근성 미반영** — CSS 선택자나 컴포넌트 이름으로 요소를 찾아서, 접근성 문제를 발견하기 어려웠습니다.\n\n" +
        "4. **사용자 경험과 괴리** — 테스트가 통과해도 실제 사용자가 경험하는 동작과 다를 수 있었습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### render\n" +
        "컴포넌트를 실제 DOM에 렌더링합니다. Shallow Rendering이 아닌 완전한 렌더링으로, 자식 컴포넌트까지 모두 렌더링됩니다.\n\n" +
        "### screen\n" +
        "렌더링된 화면에서 요소를 찾는 쿼리 객체입니다. `render()` 반환값 대신 `screen`을 사용하면 코드가 더 명확해집니다.\n\n" +
        "### 쿼리 우선순위\n" +
        "1. **getByRole** — 접근성 역할로 찾기 (최우선)\n" +
        "2. **getByLabelText** — 폼 요소의 label로 찾기\n" +
        "3. **getByPlaceholderText** — placeholder로 찾기\n" +
        "4. **getByText** — 텍스트 내용으로 찾기\n" +
        "5. **getByDisplayValue** — 입력값으로 찾기\n" +
        "6. **getByAltText** — alt 속성으로 찾기\n" +
        "7. **getByTitle** — title 속성으로 찾기\n" +
        "8. **getByTestId** — data-testid로 찾기 (최후 수단)\n\n" +
        "### userEvent vs fireEvent\n" +
        "`userEvent`는 실제 사용자 이벤트를 시뮬레이션합니다. `fireEvent.click`은 단순히 click 이벤트만 발생시키지만, `userEvent.click`은 pointerDown → pointerUp → click 순서로 실제 브라우저 동작을 재현합니다.\n\n" +
        "### within\n" +
        "특정 컨테이너 안에서만 쿼리를 수행합니다. 같은 텍스트가 여러 곳에 있을 때 범위를 좁혀줍니다.\n\n" +
        "### waitFor\n" +
        "비동기 동작 후 DOM 변경을 기다립니다. API 호출 후 데이터가 화면에 나타나기를 기다리는 등에 사용합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: RTL 쿼리 동작 원리",
      content:
        "React Testing Library의 쿼리가 내부적으로 어떻게 동작하는지 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// === 쿼리 유형별 동작 ===\n' +
          '\n' +
          '// getBy — 요소가 있으면 반환, 없으면 즉시 에러\n' +
          '// 동기적으로 DOM에서 요소를 찾음\n' +
          'const button = screen.getByRole("button", { name: "저장" });\n' +
          '// → 없으면 TestingLibraryElementError 발생\n' +
          '\n' +
          '// queryBy — 요소가 있으면 반환, 없으면 null\n' +
          '// "없음"을 확인할 때 사용\n' +
          'const error = screen.queryByText("에러 메시지");\n' +
          'expect(error).not.toBeInTheDocument();\n' +
          '\n' +
          '// findBy — 요소가 나타날 때까지 대기 (Promise 반환)\n' +
          '// 비동기 렌더링 후 요소를 찾을 때 사용\n' +
          'const data = await screen.findByText("로딩 완료");\n' +
          '// → 내부적으로 waitFor + getBy 조합\n' +
          '\n' +
          '// === within: 범위 제한 ===\n' +
          'const modal = screen.getByRole("dialog");\n' +
          'const confirmBtn = within(modal).getByRole("button", { name: "확인" });\n' +
          '// → 모달 안의 "확인" 버튼만 찾음\n' +
          '\n' +
          '// === waitFor: 비동기 대기 ===\n' +
          'await waitFor(() => {\n' +
          '  expect(screen.getByText("데이터 로딩 완료")).toBeInTheDocument();\n' +
          '});\n' +
          '// → 기본 1초 동안 50ms 간격으로 콜백을 반복 실행',
        description:
          "getBy는 즉시 찾기, queryBy는 없음 확인, findBy는 비동기 대기에 사용합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 검색 컴포넌트 테스트",
      content:
        "검색 입력, 결과 표시, 에러 처리를 테스트합니다.",
      code: {
        language: "typescript",
        code:
          'import { render, screen, waitFor, within } from "@testing-library/react";\n' +
          'import userEvent from "@testing-library/user-event";\n' +
          'import { SearchComponent } from "./SearchComponent";\n' +
          '\n' +
          'describe("SearchComponent", () => {\n' +
          '  test("검색어를 입력하고 결과를 표시한다", async () => {\n' +
          '    const user = userEvent.setup();\n' +
          '    render(<SearchComponent />);\n' +
          '\n' +
          '    // 검색 입력 필드를 찾고 입력한다\n' +
          '    const searchInput = screen.getByRole("searchbox", { name: "검색" });\n' +
          '    await user.type(searchInput, "React");\n' +
          '\n' +
          '    // 검색 버튼을 클릭한다\n' +
          '    const searchButton = screen.getByRole("button", { name: "검색" });\n' +
          '    await user.click(searchButton);\n' +
          '\n' +
          '    // 로딩 상태가 나타나는지 확인\n' +
          '    expect(screen.getByText("검색 중...")).toBeInTheDocument();\n' +
          '\n' +
          '    // 비동기 결과가 나타나기를 기다린다\n' +
          '    const resultList = await screen.findByRole("list");\n' +
          '    const items = within(resultList).getAllByRole("listitem");\n' +
          '    expect(items.length).toBeGreaterThan(0);\n' +
          '  });\n' +
          '\n' +
          '  test("결과가 없으면 안내 메시지를 표시한다", async () => {\n' +
          '    const user = userEvent.setup();\n' +
          '    render(<SearchComponent />);\n' +
          '\n' +
          '    await user.type(screen.getByRole("searchbox", { name: "검색" }), "zzzzz");\n' +
          '    await user.click(screen.getByRole("button", { name: "검색" }));\n' +
          '\n' +
          '    await waitFor(() => {\n' +
          '      expect(screen.getByText("검색 결과가 없습니다")).toBeInTheDocument();\n' +
          '    });\n' +
          '  });\n' +
          '\n' +
          '  test("에러 발생 시 에러 메시지를 표시한다", async () => {\n' +
          '    // queryByText로 에러 메시지가 "없음"을 확인\n' +
          '    render(<SearchComponent />);\n' +
          '    expect(screen.queryByRole("alert")).not.toBeInTheDocument();\n' +
          '  });\n' +
          '});',
        description:
          "userEvent.setup()으로 사용자를 생성하고, 쿼리 우선순위에 따라 getByRole을 우선 사용합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 쿼리 접두사 | 반환값 | 용도 |\n" +
        "|-----------|--------|------|\n" +
        "| getBy | Element or Error | 동기, 요소가 반드시 있을 때 |\n" +
        "| queryBy | Element or null | 동기, 요소가 없음을 확인할 때 |\n" +
        "| findBy | Promise<Element> | 비동기, 요소가 나타나기를 기다릴 때 |\n\n" +
        "**핵심:** `getByRole`을 최우선으로 사용하고, `data-testid`는 최후 수단으로 남겨두세요. 쿼리 우선순위를 지키면 자연스럽게 접근성도 개선됩니다.\n\n" +
        "**다음 챕터 미리보기:** 컴포넌트 테스트 패턴을 배우며 비동기 테스트, 모킹, Provider 래핑 등 실전 기법을 익힙니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "render, screen, userEvent의 역할을 설명할 수 있다",
    "쿼리 우선순위(getByRole > getByText > getByTestId)를 이해한다",
    "getBy, queryBy, findBy의 차이를 설명할 수 있다",
    "within으로 쿼리 범위를 제한할 수 있다",
    "waitFor로 비동기 DOM 변경을 기다릴 수 있다",
    "userEvent와 fireEvent의 차이를 안다",
  ],
  quiz: [
    {
      id: "q1",
      question: "React Testing Library에서 요소가 존재하지 않음을 확인할 때 사용하는 쿼리는?",
      choices: ["getByText", "findByText", "queryByText", "searchByText"],
      correctIndex: 2,
      explanation:
        "queryBy는 요소가 없으면 null을 반환합니다. getBy는 없으면 에러를 던지고, findBy는 Promise를 반환합니다. 요소의 부재를 확인할 때는 queryBy를 사용합니다.",
    },
    {
      id: "q2",
      question: "쿼리 우선순위에서 가장 먼저 사용해야 하는 쿼리는?",
      choices: ["getByText", "getByTestId", "getByRole", "getByClassName"],
      correctIndex: 2,
      explanation:
        "getByRole은 접근성 역할 기반 쿼리로, 스크린 리더 사용자도 접근할 수 있는 방식으로 요소를 찾습니다. 접근성을 자연스럽게 보장하므로 최우선으로 사용합니다.",
    },
    {
      id: "q3",
      question: "userEvent와 fireEvent의 차이로 올바른 것은?",
      choices: [
        "fireEvent가 더 현실적인 이벤트를 시뮬레이션한다",
        "userEvent는 실제 사용자 인터랙션을 시뮬레이션한다",
        "두 API는 완전히 동일하다",
        "userEvent는 동기, fireEvent는 비동기로 동작한다",
      ],
      correctIndex: 1,
      explanation:
        "userEvent는 클릭 시 pointerDown → pointerUp → click 등 실제 브라우저 이벤트 순서를 재현합니다. fireEvent는 단일 이벤트만 발생시킵니다.",
    },
    {
      id: "q4",
      question: "within의 용도는?",
      choices: [
        "비동기 작업이 완료될 때까지 기다린다",
        "특정 컨테이너 안에서만 쿼리를 수행한다",
        "컴포넌트를 조건부로 렌더링한다",
        "테스트 타임아웃을 설정한다",
      ],
      correctIndex: 1,
      explanation:
        "within은 특정 요소를 컨테이너로 지정하고, 그 안에서만 쿼리를 수행합니다. 같은 텍스트가 여러 곳에 존재할 때 범위를 좁히는 데 유용합니다.",
    },
    {
      id: "q5",
      question: "findByText는 내부적으로 어떻게 구현되어 있는가?",
      choices: [
        "setTimeout으로 대기 후 getByText 호출",
        "waitFor + getByText 조합",
        "Promise.resolve로 동기 쿼리를 래핑",
        "MutationObserver로 DOM 변경 감지",
      ],
      correctIndex: 1,
      explanation:
        "findBy 쿼리는 내부적으로 waitFor과 getBy의 조합입니다. 기본적으로 1초 동안 50ms 간격으로 getBy 쿼리를 반복 실행합니다.",
    },
  ],
};

export default chapter;
