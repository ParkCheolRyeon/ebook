import type { FinalExam } from "@/types/quiz";

const finalExam: FinalExam = {
  type: "final",
  id: "final-exam",
  title: "CS 기초 최종 시험",
  questions: [
    // === 자료구조 ===
    {
      id: "final-q1",
      question:
        "프론트엔드 애플리케이션에서 검색어 자동완성 기능을 구현할 때, 접두사 기반으로 빠르게 검색할 수 있는 가장 적합한 자료구조는?",
      choices: [
        "배열을 순회하며 filter로 검색",
        "해시 테이블에 모든 단어를 저장",
        "트라이(Trie) 자료구조",
        "이진 탐색 트리(BST)",
      ],
      correctIndex: 2,
      explanation:
        "트라이는 접두사 기반 검색에 최적화된 트리 자료구조입니다. 검색어의 길이 m에 대해 O(m) 시간에 접두사 매칭이 가능합니다. 배열 순회는 O(n*m), 해시 테이블은 접두사 검색에 적합하지 않습니다.",
    },
    {
      id: "final-q2",
      question:
        "React에서 useEffect의 cleanup 함수가 제대로 작동하지 않아 이벤트 리스너가 계속 쌓이는 상황은 어떤 자료구조의 특성과 관련이 있는가?",
      choices: [
        "스택 - LIFO 순서로 제거되지 않아서",
        "큐 - FIFO 순서로 처리되지 않아서",
        "연결 리스트 - 노드가 해제되지 않고 계속 연결되어서",
        "해시 테이블 - 충돌이 발생하여서",
      ],
      correctIndex: 2,
      explanation:
        "이벤트 리스너가 계속 추가되는 것은 연결 리스트에서 노드가 제거되지 않고 계속 연결되는 것과 유사합니다. cleanup에서 removeEventListener를 호출하여 참조를 끊어야 메모리 누수를 방지할 수 있습니다.",
    },
    {
      id: "final-q3",
      question:
        "Virtual DOM의 diffing 알고리즘에서 리스트 항목에 key를 부여하는 이유와 가장 관련 깊은 자료구조 개념은?",
      choices: [
        "스택의 LIFO 특성",
        "해시 테이블의 O(1) 조회를 통한 빠른 노드 매칭",
        "큐의 FIFO 특성",
        "그래프의 최단 경로 탐색",
      ],
      correctIndex: 1,
      explanation:
        "key는 해시 맵처럼 O(1)으로 이전 노드와 새 노드를 매칭하는 데 사용됩니다. key가 없으면 순서대로 비교하여 불필요한 DOM 업데이트가 발생하고, key가 있으면 정확한 노드를 빠르게 찾아 최소한의 변경만 수행합니다.",
    },
    // === 알고리즘 기초 ===
    {
      id: "final-q4",
      question:
        "API 응답으로 받은 1만 개의 정렬된 상품 목록에서 특정 가격의 상품을 찾을 때, 가장 효율적인 알고리즘과 시간 복잡도는?",
      choices: [
        "선형 탐색 - O(n)",
        "이진 탐색 - O(log n)",
        "해시 탐색 - O(n²)",
        "버블 정렬 후 탐색 - O(n log n)",
      ],
      correctIndex: 1,
      explanation:
        "데이터가 이미 정렬되어 있으므로 이진 탐색을 사용하면 O(log n)에 찾을 수 있습니다. 1만 개 항목에서 최대 약 14번의 비교로 결과를 얻을 수 있어 매우 효율적입니다.",
    },
    {
      id: "final-q5",
      question:
        "프론트엔드에서 무한 스크롤의 성능을 최적화할 때, 화면에 보이는 항목만 렌더링하는 가상화(Virtualization) 기법의 핵심 원리는?",
      choices: [
        "모든 DOM 노드를 미리 생성해두고 display: none으로 숨긴다",
        "스크롤 위치를 기반으로 보이는 범위의 인덱스를 계산하여 해당 항목만 렌더링한다",
        "setTimeout으로 렌더링을 지연시킨다",
        "Web Worker에서 DOM을 생성한다",
      ],
      correctIndex: 1,
      explanation:
        "가상화는 스크롤 위치와 항목 높이를 기반으로 현재 보이는 범위의 시작/끝 인덱스를 O(1) 또는 O(log n)으로 계산합니다. react-virtuoso, @tanstack/virtual 등이 이 기법을 구현합니다.",
    },
    {
      id: "final-q6",
      question:
        "디바운스(Debounce)의 시간 복잡도와 공간 복잡도에 대한 설명으로 올바른 것은?",
      choices: [
        "시간 O(n), 공간 O(n) - 모든 호출을 저장하므로",
        "시간 O(1), 공간 O(1) - 타이머 하나와 마지막 호출만 관리하므로",
        "시간 O(n log n), 공간 O(n) - 정렬이 필요하므로",
        "시간 O(log n), 공간 O(1) - 이진 탐색을 사용하므로",
      ],
      correctIndex: 1,
      explanation:
        "디바운스는 타이머 ID 하나와 마지막 호출 정보만 유지하면 되므로 공간 O(1)입니다. 각 호출 시 이전 타이머를 취소하고 새 타이머를 설정하는 작업은 O(1)입니다.",
    },
    {
      id: "final-q7",
      question:
        "피보나치 수열을 재귀로 구현했을 때 시간 복잡도가 O(2ⁿ)인 이유와 최적화 방법은?",
      choices: [
        "반복문보다 재귀가 항상 느리기 때문 → 반복문으로 교체",
        "중복 계산이 기하급수적으로 발생하기 때문 → 메모이제이션으로 O(n)으로 개선",
        "스택 오버플로우 때문 → try-catch로 감싸기",
        "GC가 자주 발생하기 때문 → WeakRef 사용",
      ],
      correctIndex: 1,
      explanation:
        "단순 재귀 피보나치는 fib(n-1)과 fib(n-2)를 각각 호출하며 같은 값을 반복 계산합니다. 메모이제이션으로 이미 계산된 값을 캐시하면 각 값을 한 번만 계산하여 O(n)으로 개선됩니다.",
    },
    // === 운영체제 ===
    {
      id: "final-q8",
      question:
        "프론트엔드 개발자가 성능 프로파일링 중 'Long Task'를 발견했습니다. 이 문제를 해결하기 위한 가장 적절한 운영체제 개념 기반의 접근법은?",
      choices: [
        "프로세스를 강제 종료한다",
        "작업을 작은 단위로 분할하여 메인 스레드가 UI 업데이트를 할 수 있게 양보한다",
        "CPU 클럭 속도를 높인다",
        "메모리를 추가 할당한다",
      ],
      correctIndex: 1,
      explanation:
        "Long Task는 메인 스레드를 50ms 이상 차단하는 작업입니다. 운영체제의 시분할(Time-sharing) 개념처럼, 작업을 작은 청크로 분할하고 requestIdleCallback이나 scheduler.yield()로 브라우저에 제어권을 양보해야 합니다.",
    },
    {
      id: "final-q9",
      question:
        "SPA에서 메모리 누수가 발생하는 대표적인 패턴과 운영체제의 메모리 관리 관점에서의 원인은?",
      choices: [
        "CSS 파일이 너무 크기 때문 → 코드 스플리팅으로 해결",
        "페이지 전환 시 이전 컴포넌트의 타이머/이벤트리스너가 해제되지 않아 GC가 회수할 수 없는 도달 가능한 참조가 남기 때문",
        "이미지 파일이 많기 때문 → lazy loading으로 해결",
        "HTTP 요청이 너무 많기 때문 → 요청을 줄여서 해결",
      ],
      correctIndex: 1,
      explanation:
        "SPA에서 컴포넌트가 언마운트될 때 setInterval, addEventListener, WebSocket 등의 참조가 남아있으면 GC가 관련 객체를 회수할 수 없습니다. 이는 운영체제의 메모리 릭과 동일한 원리로, 사용하지 않는 리소스의 참조를 명시적으로 해제해야 합니다.",
    },
    {
      id: "final-q10",
      question:
        "Service Worker가 브라우저의 메인 스레드와 분리되어 동작하는 이유를 운영체제 관점에서 설명한 것으로 올바른 것은?",
      choices: [
        "Service Worker는 GPU에서 실행되기 때문",
        "네트워크 요청 가로채기와 캐시 관리를 별도 스레드에서 처리하여 UI 스레드의 응답성을 보장하기 위해",
        "Service Worker는 Node.js에서 실행되기 때문",
        "보안상 같은 스레드에서 실행할 수 없기 때문",
      ],
      correctIndex: 1,
      explanation:
        "운영체제에서 I/O 작업을 별도 스레드로 분리하는 것처럼, Service Worker는 네트워크 요청 인터셉트, 캐시 관리, 백그라운드 동기화 등을 별도 스레드에서 처리합니다. 이로써 메인 스레드는 UI 렌더링에 집중할 수 있습니다.",
    },
    // === 컴퓨터 구조 ===
    {
      id: "final-q11",
      question:
        "대규모 테이블 데이터를 렌더링할 때, 행(row) 단위로 순차 접근하는 것이 열(column) 단위로 접근하는 것보다 빠른 이유를 컴퓨터 구조 관점에서 설명한 것은?",
      choices: [
        "JavaScript 엔진이 행 접근을 최적화하기 때문",
        "행 데이터가 메모리에 연속 배치되어 CPU 캐시 라인에 함께 로드되므로 캐시 히트율이 높기 때문",
        "브라우저 렌더링 엔진이 행 우선으로 동작하기 때문",
        "열 접근은 항상 비동기로 처리되기 때문",
      ],
      correctIndex: 1,
      explanation:
        "2차원 배열은 행 우선(Row-major)으로 메모리에 저장됩니다. 행 순차 접근은 연속된 메모리 주소를 읽으므로 CPU 캐시 라인에 함께 로드되어 캐시 히트율이 높습니다. 열 접근은 메모리 점프가 발생하여 캐시 미스가 많아집니다.",
    },
    {
      id: "final-q12",
      question:
        "V8 엔진에서 동일한 함수를 반복 호출할 때 점점 빨라지는 현상의 원인은?",
      choices: [
        "브라우저가 결과를 HTTP 캐시에 저장하기 때문",
        "인터프리터(Ignition)가 실행하다가 핫 코드를 감지하면 TurboFan이 타입 특화된 기계어로 JIT 컴파일하기 때문",
        "JavaScript가 멀티스레드로 전환되기 때문",
        "GC가 실행되어 메모리가 정리되기 때문",
      ],
      correctIndex: 1,
      explanation:
        "V8의 JIT 컴파일은 실행 중 수집한 타입 피드백을 기반으로 최적화합니다. 함수가 항상 같은 타입의 인자를 받으면 TurboFan이 타입 체크를 제거한 최적화 코드를 생성합니다. 이를 위해 일관된 타입 사용이 성능에 유리합니다.",
    },
    {
      id: "final-q13",
      question:
        "JavaScript에서 '안녕'.length가 2를 반환하지만 이모지 '👨‍👩‍👧‍👦'.length가 11을 반환하는 이유는?",
      choices: [
        "이모지는 특수 문자이므로 길이가 다르게 측정된다",
        "JavaScript가 UTF-16을 사용하며, 이모지는 여러 코드 포인트와 ZWJ(Zero Width Joiner)로 구성된 시퀀스이기 때문",
        "브라우저별로 이모지 길이가 다르다",
        "이모지는 이미지이므로 바이트 수가 반환된다",
      ],
      correctIndex: 1,
      explanation:
        "JavaScript 문자열은 UTF-16 코드 유닛 기반입니다. 가족 이모지는 개별 인물 이모지를 ZWJ(U+200D)로 연결한 시퀀스입니다. 각 인물이 서로게이트 쌍(2 유닛)이고 ZWJ가 추가되어 length가 11이 됩니다. [...str].length나 Intl.Segmenter로 시각적 글자 수를 구할 수 있습니다.",
    },
    // === 디자인 패턴 ===
    {
      id: "final-q14",
      question:
        "React의 Context API와 가장 유사한 디자인 패턴은?",
      choices: [
        "Factory 패턴 - 객체 생성을 추상화하므로",
        "Mediator 패턴 - 컴포넌트 간 직접 통신 대신 중앙 매개체를 통해 데이터를 전달하므로",
        "Iterator 패턴 - 순차적으로 요소를 접근하므로",
        "Builder 패턴 - 복잡한 객체를 단계적으로 생성하므로",
      ],
      correctIndex: 1,
      explanation:
        "Context API는 Provider(중재자)를 통해 깊이 중첩된 컴포넌트에 데이터를 전달합니다. Mediator 패턴처럼 컴포넌트들이 서로 직접 참조하지 않고 중앙 매개체를 통해 통신하여 결합도를 낮춥니다.",
    },
    {
      id: "final-q15",
      question:
        "다음 코드에서 사용된 디자인 패턴은?\n\nconst withAuth = (Component) => {\n  return (props) => {\n    const user = useAuth();\n    if (!user) return <Login />;\n    return <Component {...props} user={user} />;\n  };\n};",
      choices: [
        "Observer 패턴",
        "Strategy 패턴",
        "Decorator 패턴",
        "Proxy 패턴",
      ],
      correctIndex: 2,
      explanation:
        "withAuth는 원래 컴포넌트를 감싸서 인증 확인 기능을 추가하는 HOC입니다. 원본을 수정하지 않고 새로운 기능(인증 검사)을 덧씌우는 Decorator 패턴입니다. Proxy와 유사하지만, 접근 제어보다는 기능 추가에 초점을 둡니다.",
    },
    {
      id: "final-q16",
      question:
        "상태 관리 라이브러리에서 상태 변경을 action으로 정의하고, 해당 action에 따라 다른 처리 로직을 실행하는 패턴은?",
      choices: [
        "Singleton 패턴",
        "Observer 패턴",
        "Command 패턴",
        "Adapter 패턴",
      ],
      correctIndex: 2,
      explanation:
        "Redux의 action/dispatch는 Command 패턴입니다. 실행할 작업을 객체(action)로 캡슐화하여 나중에 실행하거나 되돌리기(undo), 로깅, 직렬화 등을 가능하게 합니다. dispatch는 커맨드를 실행하는 Invoker 역할을 합니다.",
    },
    {
      id: "final-q17",
      question:
        "React 컴포넌트에서 렌더링 전략을 props로 받아 교체할 수 있는 Render Props 패턴은 어떤 디자인 패턴과 유사한가?",
      choices: [
        "Template Method 패턴",
        "Strategy 패턴",
        "Facade 패턴",
        "Bridge 패턴",
      ],
      correctIndex: 1,
      explanation:
        "Render Props는 렌더링 로직(전략)을 함수로 전달받아 런타임에 교체할 수 있습니다. Strategy 패턴처럼 알고리즘(렌더링 방법)을 캡슐화하고 교체 가능하게 만드는 구조입니다.",
    },
    // === 소프트웨어 공학 ===
    {
      id: "final-q18",
      question:
        "프론트엔드 프로젝트에서 'Feature-Sliced Design' 같은 아키텍처를 도입하는 핵심 목적은?",
      choices: [
        "번들 크기를 줄이기 위해",
        "코드의 의존성 방향을 제어하고 각 기능 단위의 독립성을 보장하여 유지보수성을 높이기 위해",
        "타입 안전성을 보장하기 위해",
        "서버 사이드 렌더링을 적용하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "Feature-Sliced Design은 기능(feature) 단위로 코드를 구조화하고 의존성 방향을 단방향으로 제한합니다. 이는 소프트웨어 공학의 모듈화, 응집도 높이기, 결합도 낮추기 원칙을 프론트엔드에 적용한 것입니다.",
    },
    {
      id: "final-q19",
      question:
        "프론트엔드 테스트에서 'Testing Library'의 철학인 '사용자가 컴포넌트를 사용하는 방식으로 테스트하라'는 소프트웨어 공학의 어떤 원칙과 관련이 있는가?",
      choices: [
        "구현 세부사항이 아닌 행동(Behavior)을 테스트하는 BDD(Behavior-Driven Development) 원칙",
        "코드 커버리지 100%를 달성하는 원칙",
        "모든 함수에 단위 테스트를 작성하는 원칙",
        "테스트를 먼저 작성하는 TDD 원칙",
      ],
      correctIndex: 0,
      explanation:
        "Testing Library는 내부 구현(state, props)이 아닌 사용자 행동(클릭, 입력, 화면에 보이는 텍스트)을 기준으로 테스트합니다. 이는 BDD의 핵심 원칙으로, 구현이 변경되어도 동작이 같으면 테스트가 깨지지 않아 유지보수가 쉽습니다.",
    },
    {
      id: "final-q20",
      question:
        "레거시 프론트엔드 코드를 리팩토링할 때, '보이스카우트 규칙(Boy Scout Rule)'을 적용하는 올바른 방법은?",
      choices: [
        "모든 코드를 한 번에 새로 작성한다",
        "코드를 수정할 때마다 접한 부분을 이전보다 조금씩 더 깨끗하게 만든다",
        "리팩토링 전담 스프린트를 별도로 진행한다",
        "테스트 없이 빠르게 리팩토링한다",
      ],
      correctIndex: 1,
      explanation:
        "보이스카우트 규칙은 '캠프장을 왔을 때보다 깨끗하게 떠나라'는 원칙입니다. 대규모 리팩토링 대신 코드를 수정할 때마다 변수명 개선, 중복 제거, 타입 추가 등 작은 개선을 꾸준히 하여 점진적으로 코드 품질을 높입니다.",
    },
  ],
};

export default finalExam;
