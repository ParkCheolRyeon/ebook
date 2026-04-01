import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-06",
  title: "중간 점검 6: 테스팅 ~ 설계 패턴",
  coverGroups: ["테스팅", "설계 패턴과 아키텍처"],
  questions: [
    {
      id: "mid06-q1",
      question: "테스트 피라미드에서 통합 테스트가 위치하는 곳은?",
      choices: [
        "가장 아래 (가장 많이)",
        "중간",
        "가장 위 (가장 적게)",
        "피라미드에 포함되지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "테스트 피라미드에서 단위 테스트가 아래(많이), 통합 테스트가 중간, E2E 테스트가 위(적게)에 위치합니다. 비용과 속도의 균형입니다.",
    },
    {
      id: "mid06-q2",
      question: "React Testing Library에서 getByRole이 최우선 쿼리인 이유는?",
      choices: [
        "가장 빠르기 때문이다",
        "접근성(ARIA 역할)을 기반으로 요소를 찾아 접근성도 자연스럽게 보장된다",
        "모든 요소에 적용 가능하기 때문이다",
        "TypeScript 타입 추론이 좋기 때문이다",
      ],
      correctIndex: 1,
      explanation:
        "getByRole은 스크린 리더가 사용하는 접근성 역할을 기반으로 요소를 찾습니다. 이 쿼리를 우선 사용하면 접근성 문제도 자연스럽게 발견됩니다.",
    },
    {
      id: "mid06-q3",
      question: "renderHook이 필요한 이유는?",
      choices: [
        "Hook이 더 빠르게 실행된다",
        "Hook은 컴포넌트 안에서만 호출할 수 있으므로 임시 컴포넌트를 생성하기 위해",
        "스냅샷 테스트를 위해",
        "E2E 테스트를 위해",
      ],
      correctIndex: 1,
      explanation:
        "React Hook은 컴포넌트 내부에서만 호출할 수 있습니다. renderHook은 임시 컴포넌트를 자동 생성하여 Hook을 실행할 환경을 제공합니다.",
    },
    {
      id: "mid06-q4",
      question: "Playwright가 Cypress보다 유리한 점은?",
      choices: [
        "시간 여행 디버깅",
        "멀티 브라우저(Chromium, Firefox, WebKit) 및 멀티 탭 지원",
        "jQuery 스타일 API",
        "설정 없이 즉시 사용 가능",
      ],
      correctIndex: 1,
      explanation:
        "Playwright는 Chromium, Firefox, WebKit을 모두 지원하고 멀티 탭/컨텍스트를 다룰 수 있습니다. Cypress는 시간 여행 디버깅이 강점입니다.",
    },
    {
      id: "mid06-q5",
      question: "Error Boundary가 잡지 못하는 에러는?",
      choices: [
        "렌더링 중 에러",
        "자식 컴포넌트의 생명주기 에러",
        "이벤트 핸들러의 에러",
        "JSX 반환 중 에러",
      ],
      correctIndex: 2,
      explanation:
        "Error Boundary는 렌더링, 생명주기, 자식 트리의 에러만 잡습니다. 이벤트 핸들러, 비동기 코드(setTimeout, Promise), SSR의 에러는 잡지 못합니다.",
    },
    {
      id: "mid06-q6",
      question: "Compound Component 패턴에서 자식이 상태를 공유하는 방식은?",
      choices: [
        "전역 변수",
        "Context API를 통한 암묵적 공유",
        "Props drilling",
        "이벤트 버블링",
      ],
      correctIndex: 1,
      explanation:
        "Compound Component는 부모가 Context Provider를 생성하고, 자식들이 useContext로 상태에 접근합니다. Props를 명시적으로 전달하지 않아도 됩니다.",
    },
    {
      id: "mid06-q7",
      question: "Hook이 HOC보다 로직 재사용에 우수한 이유는?",
      choices: [
        "성능이 항상 더 좋다",
        "래퍼 없이 로직을 재사용하고 여러 Hook을 자유롭게 조합할 수 있다",
        "클래스 컴포넌트에서도 사용할 수 있다",
        "자동으로 에러를 처리한다",
      ],
      correctIndex: 1,
      explanation:
        "Hook은 컴포넌트를 감싸지 않고 함수 호출만으로 로직을 재사용합니다. 여러 Hook을 순서대로 호출하면 자연스럽게 조합되고, DevTools에서 래퍼가 쌓이지 않습니다.",
    },
    {
      id: "mid06-q8",
      question: "Container/Presentational 패턴의 Hook 시대 재해석은?",
      choices: [
        "패턴을 더 엄격하게 적용해야 한다",
        "커스텀 Hook이 Container 역할을 대체하여 별도 Container 컴포넌트가 불필요하다",
        "Presentational 컴포넌트가 불필요해졌다",
        "모든 로직을 전역 상태로 옮겨야 한다",
      ],
      correctIndex: 1,
      explanation:
        "커스텀 Hook이 데이터 페칭과 상태 관리(Container 역할)를 담당하므로, 별도의 Container 컴포넌트를 만들 필요가 없어졌습니다. 분리 원칙은 유효하지만 방식이 변했습니다.",
    },
    {
      id: "mid06-q9",
      question: "Feature 기반 폴더 구조의 장점은?",
      choices: [
        "파일 수가 줄어든다",
        "기능별로 관련 파일이 한 곳에 모여 찾기 쉽고 유지보수가 편하다",
        "번들 크기가 자동으로 줄어든다",
        "TypeScript 컴파일이 빨라진다",
      ],
      correctIndex: 1,
      explanation:
        "Feature 기반 구조는 기능(auth, products 등)별로 컴포넌트, Hook, 타입, 테스트를 같은 폴더에 모아 관련 파일을 빠르게 찾고 수정할 수 있습니다.",
    },
    {
      id: "mid06-q10",
      question: "클린 아키텍처에서 Domain 레이어의 특징은?",
      choices: [
        "React에 의존한다",
        "외부 의존성 없이 순수 비즈니스 로직만 포함한다",
        "API 호출을 담당한다",
        "UI 렌더링을 처리한다",
      ],
      correctIndex: 1,
      explanation:
        "Domain 레이어는 순수 함수로만 구성되며 React, API, UI에 의존하지 않습니다. 독립적으로 테스트와 재사용이 가능합니다.",
    },
    {
      id: "mid06-q11",
      question: "MSW(Mock Service Worker)의 동작 레벨은?",
      choices: [
        "함수 레벨",
        "모듈 레벨",
        "네트워크 레벨에서 요청을 가로챔",
        "DOM 레벨",
      ],
      correctIndex: 2,
      explanation:
        "MSW는 Service Worker를 사용하여 네트워크 요청을 가로채고 가짜 응답을 반환합니다. 실제 fetch/axios 코드가 그대로 실행되므로 테스트가 현실적입니다.",
    },
    {
      id: "mid06-q12",
      question: "React Compiler의 주요 목적은?",
      choices: [
        "TypeScript 컴파일",
        "빌드 시 자동으로 메모이제이션을 적용하여 수동 최적화를 불필요하게 만든다",
        "서버 컴포넌트를 생성한다",
        "CSS를 최적화한다",
      ],
      correctIndex: 1,
      explanation:
        "React Compiler는 빌드 시 코드를 분석하여 필요한 곳에 자동으로 메모이제이션을 삽입합니다. useMemo/useCallback을 수동으로 작성할 필요가 줄어듭니다.",
    },
    {
      id: "mid06-q13",
      question: "Headless 컴포넌트의 특징은?",
      choices: [
        "UI만 제공하고 로직은 없다",
        "로직(접근성, 인터랙션)만 제공하고 UI는 사용자가 구현한다",
        "서버에서만 렌더링된다",
        "스타일이 고정되어 있다",
      ],
      correctIndex: 1,
      explanation:
        "Headless 컴포넌트는 동작 로직과 접근성만 제공하고, 시각적 UI는 사용자가 자유롭게 구현합니다. Radix UI, Headless UI 등이 이 패턴을 따릅니다.",
    },
    {
      id: "mid06-q14",
      question: "E2E 테스트에서 Flaky 테스트를 완화하는 방법은?",
      choices: [
        "테스트를 삭제한다",
        "retry 설정과 명시적 대기(waitFor, expect.toBeVisible)를 사용한다",
        "모든 테스트를 동기적으로 실행한다",
        "모든 애니메이션을 추가한다",
      ],
      correctIndex: 1,
      explanation:
        "CI에서 retry를 설정하고, 요소가 나타나기를 명시적으로 기다리는 방식으로 타이밍 이슈를 완화합니다. sleep 대신 조건 기반 대기를 사용합니다.",
    },
    {
      id: "mid06-q15",
      question: "API 레이어 추상화(DTO → Domain 변환)의 목적은?",
      choices: [
        "API 호출 속도를 높인다",
        "백엔드 응답 구조 변경 시 프론트엔드 영향을 최소화한다",
        "캐시를 자동으로 관리한다",
        "TypeScript 에러를 방지한다",
      ],
      correctIndex: 1,
      explanation:
        "DTO를 도메인 모델로 변환하면, 서버 API 구조가 바뀌어도 변환 함수만 수정하면 됩니다. 컴포넌트와 비즈니스 로직은 도메인 모델만 사용합니다.",
    },
    {
      id: "mid06-q16",
      question: "react-error-boundary의 resetKeys 옵션의 역할은?",
      choices: [
        "에러 로그를 초기화한다",
        "지정된 값이 변경되면 에러 상태를 자동으로 리셋하여 자식을 다시 렌더링한다",
        "API 캐시를 삭제한다",
        "컴포넌트를 강제 마운트한다",
      ],
      correctIndex: 1,
      explanation:
        "resetKeys에 지정된 값(예: userId)이 변경되면 Error Boundary의 에러 상태가 자동으로 리셋되어 자식 컴포넌트를 다시 렌더링합니다.",
    },
    {
      id: "mid06-q17",
      question: "Feature Sliced Design에서 같은 레이어 간 import가 금지되는 이유는?",
      choices: [
        "성능 저하를 방지하기 위해",
        "순환 의존성과 강한 결합을 방지하기 위해",
        "번들 크기를 줄이기 위해",
        "TypeScript 에러를 방지하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "같은 레이어 간 import를 허용하면 순환 의존성이 발생하고, 기능 간 결합이 강해져 독립적인 개발이 어려워집니다. 상위 레이어만 하위를 import할 수 있습니다.",
    },
  ],
};

export default midQuiz;
