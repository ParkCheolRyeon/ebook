import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-02",
  title: "중간 점검 2: 렌더링 원리",
  coverGroups: ["렌더링 원리"],
  questions: [
    {
      id: "mid02-q1",
      question: "가상 DOM(Virtual DOM)의 주요 목적은?",
      choices: [
        "실제 DOM보다 빠른 렌더링",
        "변경 사항을 비교(diffing)하여 최소한의 DOM 업데이트를 수행",
        "서버에서 HTML을 생성",
        "CSS 애니메이션을 최적화",
      ],
      correctIndex: 1,
      explanation:
        "가상 DOM은 이전/현재 트리를 비교(diffing)하여 실제로 변경된 부분만 DOM에 반영합니다. DOM 조작 횟수를 최소화하는 것이 목적입니다.",
    },
    {
      id: "mid02-q2",
      question: "React의 재조정(Reconciliation) 알고리즘이 O(n)을 달성하기 위한 가정은?",
      choices: [
        "모든 컴포넌트가 순수 함수이다",
        "다른 타입의 요소는 다른 트리를 생성하고, key로 자식을 식별한다",
        "DOM 트리의 깊이가 일정하다",
        "상태 변경이 없다",
      ],
      correctIndex: 1,
      explanation:
        "React는 두 가지 가정으로 O(n) 비교를 달성합니다: (1) 다른 타입의 루트 요소는 완전히 다른 트리를 만든다 (2) key prop으로 자식 리스트의 동일 요소를 식별한다.",
    },
    {
      id: "mid02-q3",
      question: "Fiber 아키텍처의 핵심 목적은?",
      choices: [
        "번들 크기 감소",
        "렌더링 작업을 작은 단위로 나누어 중단/재개할 수 있게 한다",
        "TypeScript 지원",
        "CSS-in-JS 최적화",
      ],
      correctIndex: 1,
      explanation:
        "Fiber는 렌더링 작업을 작은 단위(fiber)로 나누어 우선순위에 따라 중단하고 재개할 수 있게 합니다. 이를 통해 긴 렌더링 작업 중에도 사용자 입력에 반응할 수 있습니다.",
    },
    {
      id: "mid02-q4",
      question: "Render 단계와 Commit 단계의 차이는?",
      choices: [
        "두 단계는 동일하다",
        "Render는 가상 DOM 비교(순수), Commit은 실제 DOM 업데이트(사이드이펙트)",
        "Render는 서버, Commit은 클라이언트에서 실행",
        "Render는 비동기, Commit은 항상 동기이다",
      ],
      correctIndex: 1,
      explanation:
        "Render 단계는 가상 DOM 트리를 비교하여 변경 사항을 계산합니다(순수, 중단 가능). Commit 단계는 실제 DOM에 변경을 적용합니다(사이드이펙트, 중단 불가).",
    },
    {
      id: "mid02-q5",
      question: "React 18의 자동 배칭(Automatic Batching)이 적용되는 범위는?",
      choices: [
        "이벤트 핸들러 내부에서만",
        "이벤트 핸들러, setTimeout, Promise, 네이티브 이벤트 등 모든 곳",
        "useEffect 내부에서만",
        "동기 코드에서만",
      ],
      correctIndex: 1,
      explanation:
        "React 18부터 자동 배칭이 모든 곳에 적용됩니다. 이전 버전에서는 이벤트 핸들러 내부에서만 배칭되었지만, 이제 setTimeout, Promise 등에서도 여러 setState가 하나의 리렌더링으로 묶입니다.",
    },
    {
      id: "mid02-q6",
      question: "Suspense의 주요 역할은?",
      choices: [
        "에러를 처리한다",
        "비동기 데이터가 준비될 때까지 폴백(fallback) UI를 보여준다",
        "상태를 전역으로 관리한다",
        "이벤트를 위임한다",
      ],
      correctIndex: 1,
      explanation:
        "Suspense는 자식 컴포넌트가 아직 준비되지 않았을 때 fallback UI(로딩 스피너 등)를 보여줍니다. React.lazy, 데이터 페칭 라이브러리 등과 함께 사용됩니다.",
    },
    {
      id: "mid02-q7",
      question: "Server Components와 Client Components의 차이는?",
      choices: [
        "Server Components는 useState를 사용할 수 있다",
        "Server Components는 서버에서만 실행되어 JS 번들에 포함되지 않는다",
        "Client Components는 서버에서 렌더링할 수 없다",
        "두 컴포넌트는 동일하게 동작한다",
      ],
      correctIndex: 1,
      explanation:
        "Server Components는 서버에서만 실행되어 클라이언트 JS 번들에 포함되지 않습니다. DB 접근 등 서버 전용 작업이 가능하지만, 상태(useState)나 이벤트 핸들러는 사용할 수 없습니다.",
    },
    {
      id: "mid02-q8",
      question: "리렌더링이 발생하는 조건이 아닌 것은?",
      choices: [
        "state가 변경될 때",
        "부모 컴포넌트가 리렌더링될 때",
        "props가 변경될 때",
        "useRef의 current가 변경될 때",
      ],
      correctIndex: 3,
      explanation:
        "useRef의 current 값 변경은 리렌더링을 트리거하지 않습니다. state 변경, 부모 리렌더링, Context 값 변경이 리렌더링의 원인입니다.",
    },
    {
      id: "mid02-q9",
      question: "React.lazy()의 역할은?",
      choices: [
        "컴포넌트를 메모이제이션한다",
        "컴포넌트를 동적으로 import하여 코드 스플리팅을 구현한다",
        "렌더링을 지연시킨다",
        "서버에서 컴포넌트를 프리렌더링한다",
      ],
      correctIndex: 1,
      explanation:
        "React.lazy()는 동적 import()로 컴포넌트를 지연 로딩합니다. 해당 컴포넌트가 필요한 시점에 JS 청크를 다운로드하여 초기 번들 크기를 줄입니다.",
    },
    {
      id: "mid02-q10",
      question: "flushSync의 용도는?",
      choices: [
        "비동기 작업을 취소한다",
        "상태 업데이트를 즉시 동기적으로 DOM에 반영한다",
        "메모리를 정리한다",
        "서버와 클라이언트 상태를 동기화한다",
      ],
      correctIndex: 1,
      explanation:
        "flushSync는 전달된 콜백 안의 상태 업데이트를 배칭하지 않고 즉시 DOM에 반영합니다. DOM 측정이 필요할 때 등 특수한 경우에 사용합니다.",
    },
    {
      id: "mid02-q11",
      question: "React의 Strict Mode가 개발 환경에서 effect를 두 번 실행하는 이유는?",
      choices: [
        "성능 측정을 위해",
        "cleanup이 올바르게 구현되었는지 검증하기 위해",
        "서버 사이드 렌더링을 시뮬레이션하기 위해",
        "에러를 발생시키기 위해",
      ],
      correctIndex: 1,
      explanation:
        "Strict Mode는 effect를 마운트→언마운트→재마운트하여 cleanup이 올바르게 구현되었는지 검증합니다. 이벤트 리스너 누수 같은 버그를 조기에 발견합니다.",
    },
    {
      id: "mid02-q12",
      question: "Concurrent 렌더링에서 React가 렌더링을 '중단'할 수 있는 단계는?",
      choices: [
        "Commit 단계",
        "Render 단계",
        "두 단계 모두",
        "어떤 단계에서도 불가능",
      ],
      correctIndex: 1,
      explanation:
        "React는 Render 단계(가상 DOM 비교)를 중단하고 더 긴급한 작업을 먼저 처리할 수 있습니다. Commit 단계는 DOM 일관성을 위해 중단할 수 없습니다.",
    },
    {
      id: "mid02-q13",
      question: "key를 index로 사용하면 문제가 되는 경우는?",
      choices: [
        "리스트가 정렬되지 않을 때",
        "리스트의 순서가 변경되거나 항목이 중간에 삽입/삭제될 때",
        "리스트 항목이 10개 미만일 때",
        "TypeScript를 사용할 때",
      ],
      correctIndex: 1,
      explanation:
        "리스트 순서가 바뀌면 index 기반 key는 잘못된 요소를 매칭시킵니다. 입력값이 섞이거나 상태가 잘못된 항목에 유지되는 버그가 발생합니다.",
    },
    {
      id: "mid02-q14",
      question: "다음 중 Suspense의 fallback으로 적절한 것은?",
      choices: [
        "비동기 데이터를 페칭하는 컴포넌트",
        "로딩 스피너나 스켈레톤 UI",
        "Error Boundary",
        "다른 Suspense 컴포넌트",
      ],
      correctIndex: 1,
      explanation:
        "Suspense의 fallback은 자식이 로딩 중일 때 보여줄 즉시 렌더링 가능한 UI입니다. 로딩 스피너, 스켈레톤 등 동기적으로 렌더링되는 컴포넌트가 적합합니다.",
    },
    {
      id: "mid02-q15",
      question: "React가 같은 위치의 같은 타입 컴포넌트를 리렌더링할 때 어떻게 동작하는가?",
      choices: [
        "컴포넌트를 언마운트하고 새로 마운트한다",
        "기존 인스턴스의 state를 유지한 채 새 props로 업데이트한다",
        "이전 렌더링 결과를 그대로 사용한다",
        "DOM을 완전히 새로 그린다",
      ],
      correctIndex: 1,
      explanation:
        "같은 위치에 같은 타입의 컴포넌트가 있으면 React는 기존 인스턴스를 재사용합니다. state를 유지하고 새 props만 전달하여 업데이트합니다.",
    },
  ],
};

export default midQuiz;
