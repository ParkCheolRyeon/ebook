import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-05",
  title: "중간 점검 5: 브라우저 ~ 고급 패턴",
  coverGroups: ["브라우저와 DOM", "고급 패턴"],
  questions: [
    {
      id: "mid05-q1",
      question:
        "이벤트 버블링에 대한 설명으로 올바른 것은?",
      choices: [
        "이벤트가 최상위 요소에서 타겟 요소로 전파된다",
        "이벤트가 타겟 요소에서 최상위 요소로 전파된다",
        "이벤트가 형제 요소로 전파된다",
        "이벤트가 전파되지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "이벤트 버블링은 이벤트가 발생한 타겟 요소에서 시작하여 DOM 트리를 따라 상위 요소(document)로 전파되는 것입니다. 캡처링은 반대 방향입니다.",
    },
    {
      id: "mid05-q2",
      question:
        "이벤트 위임(Event Delegation)의 장점으로 틀린 것은?",
      choices: [
        "동적으로 추가되는 요소에도 이벤트 처리가 가능하다",
        "이벤트 리스너 수를 줄여 메모리를 절약할 수 있다",
        "이벤트 전파 순서를 변경할 수 있다",
        "코드의 유지보수가 용이해진다",
      ],
      correctIndex: 2,
      explanation:
        "이벤트 위임은 이벤트 전파 순서를 변경하는 것이 아니라, 상위 요소에 하나의 이벤트 리스너를 등록하여 하위 요소의 이벤트를 처리하는 패턴입니다.",
    },
    {
      id: "mid05-q3",
      question:
        "다음 코드에서 클릭 시 출력되는 로그 순서는?\n\n<div id='outer'>\n  <div id='inner'>Click</div>\n</div>\n\nouter.addEventListener('click', () => console.log('outer-bubble'));\nouter.addEventListener('click', () => console.log('outer-capture'), true);\ninner.addEventListener('click', () => console.log('inner-bubble'));\ninner.addEventListener('click', () => console.log('inner-capture'), true);",
      choices: [
        "inner-capture, inner-bubble, outer-capture, outer-bubble",
        "outer-capture, inner-capture, inner-bubble, outer-bubble",
        "outer-capture, inner-bubble, inner-capture, outer-bubble",
        "inner-bubble, inner-capture, outer-bubble, outer-capture",
      ],
      correctIndex: 1,
      explanation:
        "이벤트 전파는 캡처링(상위→타겟) → 타겟 → 버블링(타겟→상위) 순서입니다. outer-capture(캡처링) → inner-capture, inner-bubble(타겟 단계, 등록 순서) → outer-bubble(버블링).",
    },
    {
      id: "mid05-q4",
      question:
        "e.stopPropagation()과 e.stopImmediatePropagation()의 차이는?",
      choices: [
        "동일한 동작을 한다",
        "stopPropagation은 전파만 중단하고, stopImmediatePropagation은 같은 요소의 나머지 리스너도 중단한다",
        "stopImmediatePropagation은 기본 동작도 취소한다",
        "stopPropagation은 캡처링만, stopImmediatePropagation은 버블링만 중단한다",
      ],
      correctIndex: 1,
      explanation:
        "stopPropagation은 이벤트의 상위/하위 전파를 중단하지만 같은 요소의 다른 리스너는 실행됩니다. stopImmediatePropagation은 전파 중단에 더해 같은 요소의 나머지 리스너도 실행하지 않습니다.",
    },
    {
      id: "mid05-q5",
      question:
        "브라우저 렌더링 파이프라인의 올바른 순서는?",
      choices: [
        "Layout → DOM → Style → Paint → Composite",
        "DOM → Style → Layout → Paint → Composite",
        "Style → DOM → Paint → Layout → Composite",
        "DOM → Layout → Style → Composite → Paint",
      ],
      correctIndex: 1,
      explanation:
        "브라우저 렌더링은 DOM 생성 → 스타일 계산 → 레이아웃(리플로우) → 페인트 → 컴포지트 순서로 진행됩니다.",
    },
    {
      id: "mid05-q6",
      question:
        "다음 중 리플로우(Reflow)를 유발하지 않는 CSS 속성 변경은?",
      choices: [
        "width",
        "transform",
        "margin",
        "padding",
      ],
      correctIndex: 1,
      explanation:
        "transform은 컴포지트 단계에서 처리되므로 리플로우를 유발하지 않습니다. width, margin, padding 변경은 레이아웃을 재계산해야 하므로 리플로우가 발생합니다.",
    },
    {
      id: "mid05-q7",
      question:
        "다음 Proxy 코드의 출력 결과는?\n\nconst handler = {\n  get(target, key) {\n    return key in target ? target[key] : `${key} not found`;\n  }\n};\nconst obj = new Proxy({ a: 1, b: 2 }, handler);\nconsole.log(obj.a, obj.c);",
      choices: [
        "1, undefined",
        "1, 'c not found'",
        "undefined, 'c not found'",
        "TypeError",
      ],
      correctIndex: 1,
      explanation:
        "Proxy의 get 트랩이 속성 접근을 가로챕니다. 'a'는 target에 존재하므로 1을 반환하고, 'c'는 없으므로 'c not found'를 반환합니다.",
    },
    {
      id: "mid05-q8",
      question:
        "다음 Proxy 코드의 동작은?\n\nconst validator = {\n  set(target, key, value) {\n    if (typeof value !== 'number') {\n      throw new TypeError('숫자만 허용됩니다');\n    }\n    target[key] = value;\n    return true;\n  }\n};\nconst nums = new Proxy({}, validator);\nnums.x = 1;\nnums.y = '2';",
      choices: [
        "{ x: 1, y: '2' }",
        "{ x: 1 } 다음 TypeError",
        "{ x: 1, y: 2 }",
        "TypeError만 발생",
      ],
      correctIndex: 1,
      explanation:
        "set 트랩이 값 할당을 검증합니다. nums.x = 1은 성공하지만, nums.y = '2'는 문자열이므로 TypeError가 발생합니다.",
    },
    {
      id: "mid05-q9",
      question:
        "Reflect 객체의 주요 목적으로 올바른 것은?",
      choices: [
        "비동기 작업을 처리하기 위한 유틸리티다",
        "객체의 기본 동작을 함수 형태로 제공하여 Proxy 트랩 내부에서 원래 동작을 위임하는 데 사용한다",
        "DOM 요소를 반영(reflect)하기 위한 API다",
        "타입 변환을 자동화하는 도구다",
      ],
      correctIndex: 1,
      explanation:
        "Reflect는 객체의 기본 동작(get, set, has 등)을 함수로 제공합니다. Proxy 트랩 내부에서 Reflect를 사용하면 원래 동작을 쉽게 위임하고 일부만 커스터마이즈할 수 있습니다.",
    },
    {
      id: "mid05-q10",
      question:
        "옵저버 패턴(Observer Pattern)에 대한 설명으로 올바른 것은?",
      choices: [
        "객체 생성을 캡슐화하는 패턴이다",
        "하나의 객체 상태 변화를 여러 구독 객체에 자동으로 알리는 패턴이다",
        "알고리즘의 뼈대를 정의하고 세부 구현을 위임하는 패턴이다",
        "복잡한 서브시스템에 단순한 인터페이스를 제공하는 패턴이다",
      ],
      correctIndex: 1,
      explanation:
        "옵저버 패턴은 Subject(발행자)의 상태가 변경되면 등록된 모든 Observer(구독자)에게 자동으로 통지하는 패턴입니다. 이벤트 시스템의 기반이 됩니다.",
    },
    {
      id: "mid05-q11",
      question:
        "다음 코드의 출력 결과는?\n\nconst compose = (...fns) =>\n  fns.reduce((f, g) => (...args) => f(g(...args)));\nconst add1 = x => x + 1;\nconst mul2 = x => x * 2;\nconst sub3 = x => x - 3;\nconsole.log(compose(add1, mul2, sub3)(5));",
      choices: ["5", "7", "9", "4"],
      correctIndex: 0,
      explanation:
        "compose는 오른쪽에서 왼쪽으로 함수를 합성합니다. sub3(5) → 2, mul2(2) → 4, add1(4) → 5. 따라서 결과는 5입니다.",
    },
    {
      id: "mid05-q12",
      question:
        "순수 함수(Pure Function)의 조건으로 틀린 것은?",
      choices: [
        "같은 입력에 항상 같은 출력을 반환한다",
        "부수 효과(side effect)가 없다",
        "반드시 하나의 매개변수만 받아야 한다",
        "외부 상태를 변경하지 않는다",
      ],
      correctIndex: 2,
      explanation:
        "순수 함수는 매개변수 개수와 무관합니다. 중요한 것은 참조 투명성(같은 입력 → 같은 출력)과 부수 효과 없음(외부 상태 변경 없음)입니다.",
    },
    {
      id: "mid05-q13",
      question:
        "다음 코드에서 innerHTML 대신 textContent를 권장하는 이유는?",
      choices: [
        "textContent가 더 빠르기 때문이다",
        "innerHTML은 XSS(Cross-Site Scripting) 공격에 취약하다",
        "innerHTML은 모든 브라우저에서 지원되지 않는다",
        "textContent는 HTML 태그도 렌더링할 수 있다",
      ],
      correctIndex: 1,
      explanation:
        "innerHTML은 문자열을 HTML로 파싱하므로, 사용자 입력을 직접 삽입하면 악성 스크립트가 실행될 수 있습니다(XSS). textContent는 순수 텍스트로 처리되어 안전합니다.",
    },
    {
      id: "mid05-q14",
      question:
        "커링(Currying)에 대한 설명으로 올바른 것은?",
      choices: [
        "여러 인수를 받는 함수를 하나의 인수를 받는 함수의 체인으로 변환하는 기법이다",
        "함수 실행 결과를 캐싱하는 기법이다",
        "함수를 비동기적으로 실행하는 기법이다",
        "함수의 인수 순서를 변경하는 기법이다",
      ],
      correctIndex: 0,
      explanation:
        "커링은 f(a, b, c)를 f(a)(b)(c) 형태로 변환합니다. 부분 적용이 쉬워지고 함수 합성에 유리합니다. 결과 캐싱은 메모이제이션입니다.",
    },
    {
      id: "mid05-q15",
      question:
        "다음 코드의 출력 결과는?\n\nconst el = document.createElement('div');\nel.dataset.userId = '42';\nconsole.log(el.getAttribute('data-user-id'));",
      choices: ["'42'", "undefined", "null", "'userId'"],
      correctIndex: 0,
      explanation:
        "dataset은 data-* 속성을 camelCase로 접근하는 인터페이스입니다. dataset.userId는 data-user-id 속성에 매핑되므로 getAttribute('data-user-id')로 '42'를 가져올 수 있습니다.",
    },
    {
      id: "mid05-q16",
      question:
        "싱글톤 패턴(Singleton Pattern)의 특징은?",
      choices: [
        "클래스의 인스턴스가 항상 2개 생성된다",
        "클래스의 인스턴스가 오직 하나만 생성되고 전역에서 접근할 수 있다",
        "여러 객체를 하나의 인터페이스로 감싸는 패턴이다",
        "객체의 생성과 사용을 분리하는 패턴이다",
      ],
      correctIndex: 1,
      explanation:
        "싱글톤 패턴은 클래스의 인스턴스가 하나만 존재하도록 보장합니다. ES Modules 자체가 싱글톤처럼 동작하므로, 모듈에서 export한 객체는 모든 import에서 같은 참조를 공유합니다.",
    },
    {
      id: "mid05-q17",
      question:
        "requestAnimationFrame의 특징으로 틀린 것은?",
      choices: [
        "브라우저의 다음 리페인트 전에 콜백을 실행한다",
        "일반적으로 60fps로 동작한다",
        "백그라운드 탭에서도 동일한 빈도로 실행된다",
        "setTimeout보다 부드러운 애니메이션을 만들 수 있다",
      ],
      correctIndex: 2,
      explanation:
        "requestAnimationFrame은 백그라운드 탭에서 실행 빈도가 낮아지거나 중단되어 리소스를 절약합니다. 이는 setTimeout 대비 장점 중 하나입니다.",
    },
  ],
};

export default midQuiz;
