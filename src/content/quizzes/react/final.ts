import type { FinalExam } from "@/types/quiz";

const finalExam: FinalExam = {
  type: "final",
  id: "final-exam",
  title: "React 종합 시험",
  questions: [
    // === 기초 ===
    {
      id: "final-q1",
      question: "React에서 가상 DOM을 사용하는 주된 이유는?",
      choices: [
        "실제 DOM보다 빠르기 때문이다",
        "변경 사항을 비교하여 최소한의 DOM 업데이트만 수행하기 위해",
        "서버에서 HTML을 생성하기 위해",
        "CSS를 자동으로 최적화하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "가상 DOM은 이전/현재 트리를 비교(diffing)하여 실제로 변경된 부분만 DOM에 반영합니다. DOM 조작 횟수를 최소화하여 성능을 최적화합니다.",
    },
    {
      id: "final-q2",
      question: "다음 중 JSX에서 허용되지 않는 것은?",
      choices: [
        "중괄호 안에 JavaScript 표현식 사용",
        "삼항 연산자로 조건부 렌더링",
        "if문을 JSX 중괄호 안에서 직접 사용",
        "map으로 리스트 렌더링",
      ],
      correctIndex: 2,
      explanation:
        "JSX 중괄호 안에는 표현식(expression)만 사용할 수 있습니다. if문은 표현식이 아닌 문(statement)이므로 사용할 수 없습니다. 삼항 연산자나 && 연산자를 사용해야 합니다.",
    },
    {
      id: "final-q3",
      question: "useState에서 이전 상태를 기반으로 업데이트할 때 권장되는 패턴은?",
      choices: [
        "setCount(count + 1)",
        "setCount(prev => prev + 1)",
        "count++; setCount(count)",
        "setCount(count, 1)",
      ],
      correctIndex: 1,
      explanation:
        "함수형 업데이트(prev => prev + 1)는 항상 최신 상태를 기반으로 계산합니다. 직접 값을 사용하면(count + 1) 배칭이나 클로저로 인해 오래된 값을 참조할 수 있습니다.",
    },
    // === Hooks 심화 ===
    {
      id: "final-q4",
      question: "useEffect의 의존성 배열을 빈 배열([])로 전달하면?",
      choices: [
        "매 렌더링마다 effect가 실행된다",
        "마운트 시 한 번만 실행되고, 언마운트 시 cleanup이 실행된다",
        "effect가 실행되지 않는다",
        "에러가 발생한다",
      ],
      correctIndex: 1,
      explanation:
        "빈 의존성 배열은 '의존하는 값이 없다'는 뜻으로, 마운트 시 한 번만 실행됩니다. cleanup 함수가 있다면 언마운트 시에 실행됩니다.",
    },
    {
      id: "final-q5",
      question: "다음 중 Stale Closure 문제를 일으키는 코드는?",
      choices: [
        "useEffect(() => { console.log(count) }, [count])",
        "useEffect(() => { const id = setInterval(() => console.log(count), 1000) }, [])",
        "useMemo(() => count * 2, [count])",
        "useCallback(() => setCount(c => c + 1), [])",
      ],
      correctIndex: 1,
      explanation:
        "빈 의존성 배열([])의 useEffect 안에서 count를 참조하면, 마운트 시점의 count(0)만 계속 참조합니다. count가 변경되어도 클로저는 옛날 값을 가집니다.",
    },
    {
      id: "final-q6",
      question: "useTransition과 useDeferredValue 중 props로 받은 값을 지연시킬 때 적합한 것은?",
      choices: [
        "useTransition",
        "useDeferredValue",
        "두 가지 모두 동일하다",
        "어느 것도 적합하지 않다",
      ],
      correctIndex: 1,
      explanation:
        "useDeferredValue는 이미 존재하는 값(props 등)의 업데이트를 지연시킵니다. useTransition은 상태를 설정하는 함수를 래핑할 때 사용합니다.",
    },
    // === 렌더링 원리 ===
    {
      id: "final-q7",
      question: "Fiber 아키텍처에서 렌더링 작업을 중단할 수 있는 단계는?",
      choices: [
        "Commit 단계",
        "Render 단계",
        "두 단계 모두",
        "중단 불가",
      ],
      correctIndex: 1,
      explanation:
        "Render 단계(가상 DOM 비교)는 중단 가능하여 더 긴급한 작업을 먼저 처리할 수 있습니다. Commit 단계(실제 DOM 업데이트)는 일관성을 위해 중단할 수 없습니다.",
    },
    {
      id: "final-q8",
      question: "React 18의 자동 배칭이 이전 버전과 다른 점은?",
      choices: [
        "배칭이 비활성화되었다",
        "setTimeout, Promise 등 비동기 콜백에서도 배칭이 적용된다",
        "이벤트 핸들러에서 배칭이 제거되었다",
        "Strict Mode에서만 배칭된다",
      ],
      correctIndex: 1,
      explanation:
        "React 18부터 모든 곳(이벤트 핸들러, setTimeout, Promise 등)에서 자동 배칭이 적용됩니다. 이전에는 이벤트 핸들러 내부에서만 배칭되었습니다.",
    },
    {
      id: "final-q9",
      question: "Server Components에서 사용할 수 없는 것은?",
      choices: [
        "async/await",
        "데이터베이스 직접 접근",
        "useState와 이벤트 핸들러",
        "파일 시스템 접근",
      ],
      correctIndex: 2,
      explanation:
        "Server Components는 서버에서만 실행되므로 상태(useState)와 이벤트 핸들러를 사용할 수 없습니다. 인터랙티브 기능은 'use client' 컴포넌트에서 처리합니다.",
    },
    // === 성능 최적화 ===
    {
      id: "final-q10",
      question: "React.memo 컴포넌트에 매번 새 객체를 props로 전달하면?",
      choices: [
        "메모이제이션이 정상 동작한다",
        "얕은 비교에서 매번 다른 참조로 판단되어 메모이제이션 효과가 없다",
        "에러가 발생한다",
        "자동으로 깊은 비교를 수행한다",
      ],
      correctIndex: 1,
      explanation:
        "React.memo는 얕은 비교를 사용합니다. 매번 새 객체({})를 생성하면 참조가 다르므로 매번 리렌더링됩니다. useMemo로 객체 참조를 안정화해야 합니다.",
    },
    {
      id: "final-q11",
      question: "리스트 가상화(Virtualization)가 효과적인 경우는?",
      choices: [
        "리스트 항목이 10개 미만일 때",
        "수천 개 이상의 항목이 있는 긴 리스트를 렌더링할 때",
        "모든 리스트에 항상 적용해야 한다",
        "서버에서 렌더링할 때",
      ],
      correctIndex: 1,
      explanation:
        "가상화는 뷰포트에 보이는 항목만 렌더링합니다. 수천 개 이상의 항목이 있을 때 DOM 노드 수를 줄여 성능을 크게 개선합니다. 적은 항목에는 오버헤드가 됩니다.",
    },
    {
      id: "final-q12",
      question: "최적화 전에 가장 먼저 해야 할 것은?",
      choices: [
        "모든 컴포넌트에 React.memo 적용",
        "Profiler로 실제 병목 지점을 측정",
        "전역 상태를 제거",
        "모든 함수에 useCallback 적용",
      ],
      correctIndex: 1,
      explanation:
        "'추측하지 말고 측정하라'가 최적화의 기본 원칙입니다. Profiler로 실제 느린 컴포넌트를 확인한 후 해당 지점을 최적화해야 효과적입니다.",
    },
    // === 상태 관리 ===
    {
      id: "final-q13",
      question: "Redux Toolkit에서 createSlice의 reducer 안에서 state를 직접 변경(mutate)할 수 있는 이유는?",
      choices: [
        "React가 자동으로 불변 업데이트를 처리한다",
        "내부적으로 Immer를 사용하여 불변 업데이트로 변환한다",
        "JavaScript가 원래 불변이다",
        "Redux가 깊은 복사를 수행한다",
      ],
      correctIndex: 1,
      explanation:
        "createSlice는 내부적으로 Immer를 사용합니다. state.items.push(item) 같은 뮤터블 코드를 작성해도 Immer가 불변 업데이트로 변환합니다.",
    },
    {
      id: "final-q14",
      question: "Zustand에서 선택적 구독이 중요한 이유는?",
      choices: [
        "코드가 더 짧아진다",
        "필요한 상태만 구독하여 불필요한 리렌더링을 방지한다",
        "TypeScript 타입이 더 정확해진다",
        "서버에서도 사용할 수 있다",
      ],
      correctIndex: 1,
      explanation:
        "useStore(state => state.count)처럼 필요한 값만 선택하면, 다른 상태 변경 시 이 컴포넌트는 리렌더링되지 않습니다.",
    },
    {
      id: "final-q15",
      question: "서버 상태 관리(React Query, SWR)가 전역 상태 관리(Redux)와 다른 핵심 차이는?",
      choices: [
        "API가 더 복잡하다",
        "캐싱, 자동 갱신, 무효화 등 서버 데이터 동기화에 특화되어 있다",
        "성능이 더 느리다",
        "TypeScript를 지원하지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "React Query/SWR은 서버 데이터의 캐싱, stale-while-revalidate, 자동 갱신, 낙관적 업데이트 등에 특화되어 있습니다. Redux는 클라이언트 상태 관리가 주 목적입니다.",
    },
    // === 라우팅 ===
    {
      id: "final-q16",
      question: "React Router의 중첩 라우트(Nested Routes)에서 Outlet의 역할은?",
      choices: [
        "에러 페이지를 표시한다",
        "자식 라우트의 컴포넌트가 렌더링될 위치를 지정한다",
        "리다이렉트를 처리한다",
        "URL 파라미터를 파싱한다",
      ],
      correctIndex: 1,
      explanation:
        "Outlet은 부모 라우트 레이아웃 안에서 자식 라우트가 렌더링될 자리를 표시합니다. 네비게이션은 유지하면서 중첩 콘텐츠를 교체합니다.",
    },
    {
      id: "final-q17",
      question: "React Router의 loader가 fetch-on-render 문제를 해결하는 방식은?",
      choices: [
        "컴포넌트를 미리 렌더링한다",
        "라우트 매칭 시점에 데이터를 미리 가져와 워터폴을 제거한다",
        "데이터를 전역 상태에 저장한다",
        "서버에서 HTML을 생성한다",
      ],
      correctIndex: 1,
      explanation:
        "loader는 라우트가 매칭되면 컴포넌트 렌더링 전에 데이터를 요청합니다. 컴포넌트 마운트 후 요청하는 워터폴 패턴 대신 병렬로 데이터를 가져옵니다.",
    },
    // === 데이터 페칭 ===
    {
      id: "final-q18",
      question: "React Query의 staleTime을 Infinity로 설정하면?",
      choices: [
        "캐시가 비활성화된다",
        "데이터가 항상 신선하다고 간주되어 자동 재요청이 일어나지 않는다",
        "매 렌더링마다 재요청한다",
        "에러가 발생한다",
      ],
      correctIndex: 1,
      explanation:
        "staleTime: Infinity는 데이터가 영원히 신선하다고 간주합니다. 자동 재요청(refetch on mount, window focus 등)이 일어나지 않습니다. 수동으로 invalidate해야 갱신됩니다.",
    },
    {
      id: "final-q19",
      question: "낙관적 업데이트 실패 시 롤백을 위해 React Query에서 사용하는 패턴은?",
      choices: [
        "에러를 무시한다",
        "onMutate에서 이전 데이터를 저장하고, onError에서 복원한다",
        "자동으로 페이지를 새로고침한다",
        "서버에 취소 요청을 보낸다",
      ],
      correctIndex: 1,
      explanation:
        "onMutate에서 현재 캐시 데이터를 저장(snapshot)하고 캐시를 낙관적으로 업데이트합니다. onError에서 저장한 스냅샷으로 캐시를 롤백합니다.",
    },
    // === 테스팅 ===
    {
      id: "final-q20",
      question: "React Testing Library에서 비동기 데이터 로딩 후 요소를 찾을 때 사용하는 쿼리는?",
      choices: [
        "getByText",
        "queryByText",
        "findByText",
        "getAllByText",
      ],
      correctIndex: 2,
      explanation:
        "findByText는 요소가 나타날 때까지 비동기적으로 기다립니다(Promise 반환). 내부적으로 waitFor + getByText 조합으로 동작합니다.",
    },
    {
      id: "final-q21",
      question: "스냅샷 테스트의 가장 큰 문제점은?",
      choices: [
        "실행 속도가 느리다",
        "의미 없는 변경에도 깨지고, 개발자가 무심코 업데이트하여 실제 동작을 검증하지 못한다",
        "TypeScript에서 사용할 수 없다",
        "비동기 컴포넌트에 적용할 수 없다",
      ],
      correctIndex: 1,
      explanation:
        "스냅샷 테스트는 CSS 클래스 변경 같은 사소한 변경에도 깨지고, 개발자가 의미를 확인하지 않고 스냅샷을 업데이트하면 검증 효과가 사라집니다.",
    },
    {
      id: "final-q22",
      question: "act() 없이 Hook의 상태를 업데이트하면 발생하는 문제는?",
      choices: [
        "메모리 누수",
        "상태 업데이트가 적용되기 전에 assertion을 실행하게 된다",
        "Hook이 초기화되지 않는다",
        "에러가 자동으로 무시된다",
      ],
      correctIndex: 1,
      explanation:
        "act() 없이 상태 업데이트를 트리거하면 React의 비동기 업데이트가 처리되지 않은 상태에서 결과를 확인합니다. React는 이에 대한 경고를 출력합니다.",
    },
    {
      id: "final-q23",
      question: "페이지 오브젝트 패턴(POM)의 장점은?",
      choices: [
        "테스트 실행 속도가 빨라진다",
        "셀렉터와 액션을 캡슐화하여 UI 변경 시 수정 지점을 한 곳으로 집중시킨다",
        "자동으로 스크린샷을 생성한다",
        "브라우저 호환성을 보장한다",
      ],
      correctIndex: 1,
      explanation:
        "POM은 페이지별 셀렉터와 액션을 클래스에 캡슐화합니다. UI가 변경되면 해당 페이지 객체만 수정하면 되어 테스트 유지보수가 쉬워집니다.",
    },
    // === 설계 패턴 ===
    {
      id: "final-q24",
      question: "React에서 상속보다 합성(Composition)을 권장하는 이유는?",
      choices: [
        "성능이 더 좋기 때문이다",
        "children, props, Hook으로 기능을 유연하게 조합할 수 있기 때문이다",
        "TypeScript에서 상속이 불가능하기 때문이다",
        "React가 클래스를 지원하지 않기 때문이다",
      ],
      correctIndex: 1,
      explanation:
        "합성은 children, render props, Hook 등으로 기능을 자유롭게 조합합니다. 상속은 깊은 체인과 변형 폭발을 만들지만, 합성은 유연하고 재사용하기 쉽습니다.",
    },
    {
      id: "final-q25",
      question: "Compound Component에서 Context Provider 없이 자식이 사용되면 어떻게 해야 하는가?",
      choices: [
        "기본값으로 동작시킨다",
        "명확한 에러 메시지를 던져 잘못된 사용을 알린다",
        "조용히 null을 반환한다",
        "자동으로 Provider를 생성한다",
      ],
      correctIndex: 1,
      explanation:
        "useContext 결과가 null이면 '부모 컴포넌트 안에서 사용하세요'라는 에러를 던져야 합니다. 개발자가 잘못된 사용을 빠르게 인지할 수 있습니다.",
    },
    {
      id: "final-q26",
      question: "Error Boundary를 계층적으로 배치하는 이유는?",
      choices: [
        "성능이 향상된다",
        "에러 영향 범위를 최소화하여 나머지 앱은 정상 동작시킨다",
        "TypeScript 타입이 좋아진다",
        "자동으로 에러가 복구된다",
      ],
      correctIndex: 1,
      explanation:
        "앱, 페이지, 위젯 단위로 Error Boundary를 두면 한 영역의 에러가 다른 영역에 영향을 주지 않습니다. 사용자는 에러가 발생한 부분만 폴백을 보고 나머지는 정상 사용합니다.",
    },
    {
      id: "final-q27",
      question: "HOC(Higher-Order Component)가 여전히 유효한 사례는?",
      choices: [
        "모든 데이터 페칭",
        "Error Boundary 래핑 (클래스 컴포넌트 필요)",
        "폼 검증",
        "이벤트 핸들러 등록",
      ],
      correctIndex: 1,
      explanation:
        "Error Boundary는 getDerivedStateFromError 등 클래스 생명주기가 필요하므로 HOC로 감싸는 패턴이 유효합니다. 대부분의 다른 로직은 Hook으로 대체 가능합니다.",
    },
    // === 아키텍처 ===
    {
      id: "final-q28",
      question: "클린 아키텍처에서 의존성 방향의 규칙은?",
      choices: [
        "모든 방향으로 자유롭게 의존 가능",
        "바깥 레이어(UI)가 안쪽 레이어(Domain)에 의존하고, 반대는 불가",
        "안쪽 레이어만 바깥에 의존 가능",
        "수평적으로만 의존 가능",
      ],
      correctIndex: 1,
      explanation:
        "의존성은 항상 안쪽(Domain)을 향합니다. UI → Application → Domain 방향입니다. Domain은 UI에 의존하지 않으므로 핵심 로직이 외부 변경에 영향받지 않습니다.",
    },
    {
      id: "final-q29",
      question: "Barrel export(index.ts)의 잠재적 문제점은?",
      choices: [
        "TypeScript 에러가 발생한다",
        "Tree Shaking이 완벽하지 않으면 불필요한 코드가 번들에 포함될 수 있다",
        "import가 불가능해진다",
        "테스트를 작성할 수 없다",
      ],
      correctIndex: 1,
      explanation:
        "Barrel export는 하나만 import해도 전체 모듈이 평가될 수 있어, 사이드 이펙트가 있는 모듈에서 Tree Shaking이 실패하면 번들 크기가 증가할 수 있습니다.",
    },
    // === React 미래 ===
    {
      id: "final-q30",
      question: "React Compiler가 해결하는 문제는?",
      choices: [
        "TypeScript 컴파일",
        "useMemo/useCallback 등 수동 메모이제이션을 자동화",
        "서버 사이드 렌더링",
        "라우팅 최적화",
      ],
      correctIndex: 1,
      explanation:
        "React Compiler는 빌드 시 코드를 분석하여 필요한 곳에 자동으로 메모이제이션을 삽입합니다. 개발자가 수동으로 최적화 코드를 작성할 필요가 줄어듭니다.",
    },
    {
      id: "final-q31",
      question: "React 19의 Document Metadata 기능은?",
      choices: [
        "react-helmet을 내장한다",
        "컴포넌트 안의 <title>, <meta> 태그를 자동으로 <head>에 호이스팅한다",
        "SEO 점수를 계산한다",
        "메타데이터를 서버에 저장한다",
      ],
      correctIndex: 1,
      explanation:
        "React 19에서 컴포넌트 안에 <title>, <meta>를 렌더링하면 React가 자동으로 document의 <head>에 배치합니다. 별도 라이브러리가 불필요합니다.",
    },
    // === 복합 문제 ===
    {
      id: "final-q32",
      question: "다음 코드의 문제점은?\n\nuseEffect(() => {\n  const timer = setInterval(() => {\n    setCount(count + 1);\n  }, 1000);\n}, []);",
      choices: [
        "문법 에러가 있다",
        "Stale Closure: count가 항상 초기값(0)을 참조하여 1만 반복 설정된다",
        "setInterval이 동작하지 않는다",
        "cleanup이 없어 메모리 누수만 발생한다",
      ],
      correctIndex: 1,
      explanation:
        "빈 의존성 배열로 인해 클로저가 초기 count(0)만 참조합니다. setCount(count + 1)은 항상 setCount(0 + 1)이 됩니다. setCount(c => c + 1)로 수정하고 cleanup도 추가해야 합니다.",
    },
    {
      id: "final-q33",
      question: "Context 성능 최적화를 위해 상태와 dispatch를 분리하는 이유는?",
      choices: [
        "코드 가독성을 위해",
        "dispatch만 사용하는 컴포넌트가 상태 변경 시 불필요하게 리렌더링되는 것을 방지하기 위해",
        "TypeScript 타입 추론을 위해",
        "서버에서 사용하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "상태와 dispatch를 같은 Context에 넣으면, dispatch만 사용하는 컴포넌트도 상태 변경 시 리렌더링됩니다. 분리하면 dispatch 소비자는 영향받지 않습니다.",
    },
    {
      id: "final-q34",
      question: "다음 중 테스트에서 구현 세부사항을 테스트하는 안티패턴은?",
      choices: [
        "screen.getByRole('button')으로 버튼 찾기",
        "screen.getByText('저장')으로 텍스트 확인",
        "wrapper.state('isLoading')으로 내부 상태 확인",
        "userEvent.click(button)으로 클릭 테스트",
      ],
      correctIndex: 2,
      explanation:
        "내부 state 이름('isLoading')에 직접 접근하는 것은 구현 세부사항 테스트입니다. 리팩토링으로 state 이름이 바뀌면 기능은 동일해도 테스트가 깨집니다.",
    },
    {
      id: "final-q35",
      question: "대규모 앱에서 모듈의 공개 API(index.ts)를 통해서만 통신하면 좋은 점은?",
      choices: [
        "import 경로가 짧아진다",
        "내부 리팩토링 시 외부에 영향을 주지 않아 독립적으로 발전할 수 있다",
        "자동 import가 더 잘 동작한다",
        "빌드 속도가 빨라진다",
      ],
      correctIndex: 1,
      explanation:
        "공개 API를 통해서만 통신하면 모듈 내부 구조를 자유롭게 변경할 수 있습니다. 외부 코드는 공개 인터페이스에만 의존하므로 내부 변경에 영향받지 않습니다.",
    },
  ],
};

export default finalExam;
