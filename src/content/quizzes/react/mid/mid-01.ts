import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-01",
  title: "중간 점검 1: 기초 ~ Hooks 심화",
  coverGroups: ["기초", "Hooks 심화"],
  questions: [
    {
      id: "mid01-q1",
      question: "React에서 선언적(Declarative) 프로그래밍의 의미는?",
      choices: [
        "DOM을 직접 조작한다",
        "무엇을 보여줄지 기술하면 React가 어떻게 할지 처리한다",
        "이벤트 루프를 직접 관리한다",
        "HTML 파일을 수동으로 작성한다",
      ],
      correctIndex: 1,
      explanation:
        "선언적 프로그래밍은 '무엇(What)'을 원하는지 기술하면, '어떻게(How)' 구현할지는 프레임워크가 담당합니다. React는 상태에 따른 UI를 선언하면 DOM 업데이트를 자동 처리합니다.",
    },
    {
      id: "mid01-q2",
      question: "JSX가 최종적으로 변환되는 것은?",
      choices: [
        "HTML 문자열",
        "React.createElement() 함수 호출",
        "DOM 노드",
        "CSS 객체",
      ],
      correctIndex: 1,
      explanation:
        "JSX는 빌드 시 React.createElement() 호출로 변환됩니다. 이 함수는 React 엘리먼트(가상 DOM 객체)를 반환합니다.",
    },
    {
      id: "mid01-q3",
      question: "React 컴포넌트의 이름이 대문자로 시작해야 하는 이유는?",
      choices: [
        "성능 최적화를 위해",
        "HTML 태그와 구분하기 위해",
        "TypeScript 규칙 때문에",
        "가독성을 위한 컨벤션일 뿐이다",
      ],
      correctIndex: 1,
      explanation:
        "JSX에서 소문자 태그는 HTML 태그로, 대문자 태그는 React 컴포넌트로 처리됩니다. 소문자로 시작하면 React가 HTML 요소로 인식합니다.",
    },
    {
      id: "mid01-q4",
      question: "useState의 상태 업데이트가 비동기적으로 처리되는 이유는?",
      choices: [
        "Promise를 사용하기 때문이다",
        "성능을 위해 여러 업데이트를 배칭(batching)하기 위해서다",
        "서버에서 처리되기 때문이다",
        "브라우저 API의 제한 때문이다",
      ],
      correctIndex: 1,
      explanation:
        "React는 여러 상태 업데이트를 하나의 리렌더링으로 묶어 처리(배칭)합니다. 이를 통해 불필요한 리렌더링을 줄이고 성능을 최적화합니다.",
    },
    {
      id: "mid01-q5",
      question: "key prop의 역할은?",
      choices: [
        "CSS 스타일을 적용한다",
        "리스트에서 각 요소를 고유하게 식별하여 효율적으로 업데이트한다",
        "컴포넌트의 렌더링 순서를 결정한다",
        "이벤트 위임을 처리한다",
      ],
      correctIndex: 1,
      explanation:
        "key는 React의 재조정(Reconciliation) 과정에서 리스트의 각 요소를 식별합니다. 올바른 key가 있으면 변경된 요소만 업데이트하여 성능을 최적화합니다.",
    },
    {
      id: "mid01-q6",
      question: "useEffect의 cleanup 함수가 실행되는 시점은?",
      choices: [
        "컴포넌트가 마운트될 때만",
        "컴포넌트가 언마운트될 때와 의존성 변경으로 effect가 다시 실행되기 전",
        "브라우저 탭이 닫힐 때만",
        "상태가 변경될 때마다",
      ],
      correctIndex: 1,
      explanation:
        "cleanup 함수는 컴포넌트 언마운트 시와 의존성 변경으로 새 effect가 실행되기 전에 호출됩니다. 이전 effect의 부수 효과를 정리합니다.",
    },
    {
      id: "mid01-q7",
      question: "useRef의 current 값을 변경하면 리렌더링이 발생하는가?",
      choices: [
        "항상 발생한다",
        "발생하지 않는다",
        "current가 객체일 때만 발생한다",
        "StrictMode에서만 발생한다",
      ],
      correctIndex: 1,
      explanation:
        "useRef는 mutable 객체를 반환하며, current 값 변경은 리렌더링을 트리거하지 않습니다. 렌더링 없이 값을 유지하고 싶을 때 사용합니다.",
    },
    {
      id: "mid01-q8",
      question: "useMemo와 useCallback의 차이는?",
      choices: [
        "동일한 API이다",
        "useMemo는 값을, useCallback은 함수를 메모이제이션한다",
        "useMemo는 동기, useCallback은 비동기이다",
        "useMemo는 클래스, useCallback은 함수 컴포넌트 전용이다",
      ],
      correctIndex: 1,
      explanation:
        "useMemo는 연산 결과(값)를 캐시하고, useCallback은 함수 인스턴스를 캐시합니다. useCallback(fn, deps)는 useMemo(() => fn, deps)와 동일합니다.",
    },
    {
      id: "mid01-q9",
      question: "useReducer가 useState보다 적합한 경우는?",
      choices: [
        "상태가 단일 원시값일 때",
        "여러 상태가 서로 연관되어 복잡한 업데이트 로직이 필요할 때",
        "비동기 작업을 처리할 때",
        "전역 상태가 필요할 때",
      ],
      correctIndex: 1,
      explanation:
        "useReducer는 복잡한 상태 로직(여러 값이 연관, 이전 상태에 따른 분기)을 reducer 함수에 집중시켜 관리합니다. 단순한 상태에는 useState가 더 간결합니다.",
    },
    {
      id: "mid01-q10",
      question: "useContext를 사용할 때 발생할 수 있는 성능 문제는?",
      choices: [
        "메모리 누수",
        "Context 값이 변경되면 모든 소비자가 리렌더링된다",
        "서버 사이드 렌더링이 불가능하다",
        "이벤트 핸들러가 중복 등록된다",
      ],
      correctIndex: 1,
      explanation:
        "Context 값이 변경되면 해당 Context를 구독하는 모든 컴포넌트가 리렌더링됩니다. 상태를 분리하거나 메모이제이션으로 최적화해야 합니다.",
    },
    {
      id: "mid01-q11",
      question: "React 19의 use() Hook의 특징은?",
      choices: [
        "useEffect를 대체한다",
        "Promise나 Context를 읽을 수 있으며, 조건문 안에서도 호출 가능하다",
        "클래스 컴포넌트에서만 사용한다",
        "상태를 전역으로 공유한다",
      ],
      correctIndex: 1,
      explanation:
        "use()는 Promise와 Context를 읽는 Hook으로, 다른 Hook과 달리 조건문이나 반복문 안에서도 호출할 수 있습니다.",
    },
    {
      id: "mid01-q12",
      question: "커스텀 Hook의 이름이 use로 시작해야 하는 이유는?",
      choices: [
        "성능 최적화를 위해",
        "React의 린터가 Hook 규칙을 검사하기 위해",
        "TypeScript 타입 추론을 위해",
        "브라우저 호환성을 위해",
      ],
      correctIndex: 1,
      explanation:
        "use 접두사는 React의 ESLint 플러그인이 Hook 규칙(조건부 호출 금지 등)을 검사하는 데 사용됩니다. 이 규칙을 지켜야 Hook이 올바르게 동작합니다.",
    },
    {
      id: "mid01-q13",
      question: "useLayoutEffect와 useEffect의 차이는?",
      choices: [
        "기능이 완전히 동일하다",
        "useLayoutEffect는 DOM 변경 후 브라우저가 페인트하기 전에 동기적으로 실행된다",
        "useLayoutEffect는 서버에서만 실행된다",
        "useEffect가 더 먼저 실행된다",
      ],
      correctIndex: 1,
      explanation:
        "useLayoutEffect는 DOM 업데이트 후 브라우저 페인트 전에 동기적으로 실행됩니다. 레이아웃 측정이나 깜빡임 방지가 필요할 때 사용합니다.",
    },
    {
      id: "mid01-q14",
      question: "useTransition의 역할은?",
      choices: [
        "CSS 애니메이션을 관리한다",
        "상태 업데이트를 낮은 우선순위로 표시하여 UI 응답성을 유지한다",
        "페이지 전환을 애니메이션한다",
        "네트워크 요청의 타임아웃을 설정한다",
      ],
      correctIndex: 1,
      explanation:
        "useTransition은 상태 업데이트를 '긴급하지 않음'으로 표시합니다. React는 긴급 업데이트(입력)를 먼저 처리하고, 트랜지션 업데이트(검색 결과)는 나중에 처리합니다.",
    },
    {
      id: "mid01-q15",
      question: "React의 Stale Closure 문제란?",
      choices: [
        "컴포넌트가 마운트되지 않는 문제",
        "클로저가 생성 시점의 오래된 state/props 값을 참조하는 문제",
        "메모리 누수 문제",
        "서버와 클라이언트의 상태 불일치 문제",
      ],
      correctIndex: 1,
      explanation:
        "Stale Closure는 useEffect나 이벤트 핸들러의 클로저가 최신 state가 아닌 생성 시점의 값을 참조하는 문제입니다. 의존성 배열을 올바르게 설정하여 해결합니다.",
    },
    {
      id: "mid01-q16",
      question: "다음 중 controlled component의 특징은?",
      choices: [
        "DOM이 자체적으로 값을 관리한다",
        "React state가 입력값의 단일 진실 공급원(single source of truth)이다",
        "ref로 DOM에 직접 접근하여 값을 읽는다",
        "서버에서만 렌더링된다",
      ],
      correctIndex: 1,
      explanation:
        "Controlled component는 React state가 폼 입력값을 제어합니다. value와 onChange를 통해 React가 입력값의 단일 진실 공급원이 됩니다.",
    },
    {
      id: "mid01-q17",
      question: "React에서 이벤트 위임(Event Delegation)이 적용되는 위치는?",
      choices: [
        "각 DOM 요소에 직접 등록",
        "루트 DOM 컨테이너에 이벤트를 등록",
        "window 객체에만 등록",
        "Shadow DOM에 등록",
      ],
      correctIndex: 1,
      explanation:
        "React는 이벤트를 루트 컨테이너(React 18에서는 root DOM 노드)에 등록하고, 이벤트 버블링을 활용해 적절한 핸들러를 호출합니다.",
    },
    {
      id: "mid01-q18",
      question: "useDeferredValue와 useTransition의 차이는?",
      choices: [
        "기능이 완전히 동일하다",
        "useTransition은 상태 업데이트를, useDeferredValue는 값의 지연을 다룬다",
        "useDeferredValue는 서버 전용이다",
        "useTransition은 React 18 미만에서만 사용 가능하다",
      ],
      correctIndex: 1,
      explanation:
        "useTransition은 상태를 설정하는 함수를 래핑하고, useDeferredValue는 이미 존재하는 값의 업데이트를 지연시킵니다. props를 받는 경우 useDeferredValue가 적합합니다.",
    },
  ],
};

export default midQuiz;
