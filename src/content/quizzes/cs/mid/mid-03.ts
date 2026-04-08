import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-03",
  title: "중간 점검 3: 디자인 패턴 ~ 소프트웨어 공학",
  coverGroups: ["디자인 패턴", "소프트웨어 공학"],
  questions: [
    {
      id: "mid03-q1",
      question:
        "프론트엔드에서 Singleton 패턴이 사용되는 대표적인 사례는?",
      choices: [
        "각 컴포넌트마다 독립적인 상태를 만들 때",
        "전역 상태 관리 스토어(Redux Store 등)에서 하나의 인스턴스만 유지할 때",
        "리스트의 각 항목을 렌더링할 때",
        "CSS 모듈을 적용할 때",
      ],
      correctIndex: 1,
      explanation:
        "Singleton 패턴은 클래스의 인스턴스가 하나만 존재하도록 보장합니다. Redux Store, 로깅 서비스, 설정 객체 등 애플리케이션 전체에서 하나의 인스턴스만 필요한 경우에 사용됩니다.",
    },
    {
      id: "mid03-q2",
      question:
        "Factory 패턴의 핵심 목적으로 올바른 것은?",
      choices: [
        "객체의 생성 로직을 캡슐화하여 클라이언트 코드가 구체적인 클래스를 알 필요 없게 한다",
        "객체를 불변으로 만든다",
        "모든 객체를 전역에서 접근 가능하게 한다",
        "객체의 메서드를 자동으로 바인딩한다",
      ],
      correctIndex: 0,
      explanation:
        "Factory 패턴은 객체 생성을 별도의 함수나 클래스에 위임하여, 어떤 구체적인 객체가 생성될지를 클라이언트 코드에서 분리합니다. React.createElement나 document.createElement가 Factory 패턴의 예입니다.",
    },
    {
      id: "mid03-q3",
      question:
        "Observer 패턴과 가장 관련 깊은 프론트엔드 개념은?",
      choices: [
        "CSS Grid 레이아웃",
        "이벤트 리스너와 상태 관리의 구독(subscribe) 패턴",
        "HTTP 요청/응답",
        "코드 번들링",
      ],
      correctIndex: 1,
      explanation:
        "Observer 패턴은 주체(Subject)의 상태가 변경되면 등록된 관찰자(Observer)에게 알리는 패턴입니다. DOM 이벤트 리스너, Redux의 subscribe, RxJS의 Observable 등이 모두 Observer 패턴을 기반으로 합니다.",
    },
    {
      id: "mid03-q4",
      question:
        "React의 Higher-Order Component(HOC)는 어떤 디자인 패턴과 가장 유사한가?",
      choices: [
        "Singleton 패턴",
        "Factory 패턴",
        "Decorator 패턴",
        "Strategy 패턴",
      ],
      correctIndex: 2,
      explanation:
        "HOC는 컴포넌트를 인자로 받아 새로운 기능이 추가된 컴포넌트를 반환합니다. 이는 원래 객체를 수정하지 않고 기능을 덧씌우는 Decorator 패턴과 동일한 구조입니다. withRouter, connect 등이 대표적인 HOC입니다.",
    },
    {
      id: "mid03-q5",
      question:
        "함수형 프로그래밍에서 함수 합성(Composition)의 올바른 설명은?",
      choices: [
        "여러 함수를 하나의 클래스 안에 모아 놓는 것",
        "작은 단위의 순수 함수들을 조합하여 복잡한 로직을 구성하는 것",
        "함수 내부에서 전역 상태를 변경하는 것",
        "비동기 함수를 동기적으로 실행하는 것",
      ],
      correctIndex: 1,
      explanation:
        "함수 합성은 f(g(x)) 형태로 작은 함수들을 조합하여 새로운 함수를 만드는 기법입니다. pipe, compose 유틸리티를 사용하며, Redux의 middleware, lodash의 flow 등이 함수 합성을 활용합니다.",
    },
    {
      id: "mid03-q6",
      question:
        "순수 함수(Pure Function)의 조건으로 올바르지 않은 것은?",
      choices: [
        "같은 입력에 대해 항상 같은 출력을 반환한다",
        "외부 상태를 변경하지 않는다(부수 효과 없음)",
        "반드시 비동기로 실행되어야 한다",
        "함수 외부의 변수에 의존하지 않는다",
      ],
      correctIndex: 2,
      explanation:
        "순수 함수는 동기/비동기와 무관합니다. 같은 입력에 항상 같은 출력을 반환하고, 외부 상태를 변경하지 않으며, 외부 변수에 의존하지 않는 함수입니다. React의 컴포넌트, Redux의 reducer가 순수 함수의 예입니다.",
    },
    {
      id: "mid03-q7",
      question:
        "클린 코드 원칙 중 '함수는 한 가지 일만 해야 한다'는 원칙을 위반하는 코드는?",
      choices: [
        "function validateEmail(email) { return /^[^@]+@[^@]+$/.test(email); }",
        "function fetchAndRenderUsers() { fetch('/api/users').then(data => renderList(data)); }",
        "function add(a, b) { return a + b; }",
        "function formatDate(date) { return date.toISOString().split('T')[0]; }",
      ],
      correctIndex: 1,
      explanation:
        "fetchAndRenderUsers는 데이터 가져오기(fetch)와 렌더링(render)이라는 두 가지 책임을 하나의 함수에 담고 있습니다. 단일 책임 원칙에 따라 fetchUsers와 renderUsers로 분리하는 것이 좋습니다.",
    },
    {
      id: "mid03-q8",
      question:
        "테스트 피라미드에서 가장 많은 비중을 차지해야 하는 테스트 유형은?",
      choices: [
        "E2E(End-to-End) 테스트",
        "통합(Integration) 테스트",
        "단위(Unit) 테스트",
        "수동(Manual) 테스트",
      ],
      correctIndex: 2,
      explanation:
        "테스트 피라미드에서 단위 테스트가 가장 많은 비중을 차지합니다. 단위 테스트는 실행이 빠르고, 작성이 쉬우며, 실패 원인을 빠르게 파악할 수 있습니다. 위로 갈수록(통합 → E2E) 비용이 증가하므로 비중을 줄입니다.",
    },
    {
      id: "mid03-q9",
      question:
        "SOLID 원칙 중 '개방-폐쇄 원칙(OCP)'을 프론트엔드에 적용한 예로 올바른 것은?",
      choices: [
        "모든 컴포넌트를 하나의 파일에 작성한다",
        "기존 컴포넌트를 수정하지 않고 props나 합성(Composition)으로 기능을 확장한다",
        "전역 상태를 직접 수정하여 빠르게 기능을 추가한다",
        "모든 스타일을 인라인으로 작성한다",
      ],
      correctIndex: 1,
      explanation:
        "개방-폐쇄 원칙은 확장에는 열려있고 수정에는 닫혀있어야 한다는 원칙입니다. React에서 기존 컴포넌트의 코드를 수정하지 않고 props, children, HOC, 합성 패턴으로 기능을 확장하는 것이 이에 해당합니다.",
    },
    {
      id: "mid03-q10",
      question:
        "프론트엔드 아키텍처에서 '관심사의 분리(Separation of Concerns)'를 적용한 사례로 올바른 것은?",
      choices: [
        "HTML, CSS, JavaScript를 모두 하나의 파일에 작성",
        "비즈니스 로직, UI 컴포넌트, API 호출 레이어를 각각 분리하여 관리",
        "모든 상태를 전역 변수로 관리",
        "테스트 코드를 프로덕션 코드와 같은 파일에 작성",
      ],
      correctIndex: 1,
      explanation:
        "관심사의 분리는 각 모듈이 하나의 관심사만 담당하도록 분리하는 원칙입니다. 프론트엔드에서는 UI(컴포넌트), 상태 관리(스토어), API 통신(서비스 레이어), 비즈니스 로직(훅/유틸리티)을 분리하여 유지보수성을 높입니다.",
    },
  ],
};

export default midQuiz;
