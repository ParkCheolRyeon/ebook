import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-02",
  title: "중간 점검 2: 운영체제 ~ 컴퓨터 구조",
  coverGroups: ["운영체제", "컴퓨터 구조"],
  questions: [
    {
      id: "mid02-q1",
      question:
        "프로세스와 스레드의 차이에 대한 설명으로 올바른 것은?",
      choices: [
        "프로세스는 메모리를 공유하고, 스레드는 독립적인 메모리를 가진다",
        "하나의 프로세스 안에 여러 스레드가 존재할 수 있으며, 스레드들은 힙 메모리를 공유한다",
        "스레드는 프로세스보다 생성 비용이 더 크다",
        "프로세스 간 통신은 스레드 간 통신보다 항상 빠르다",
      ],
      correctIndex: 1,
      explanation:
        "스레드는 같은 프로세스 내에서 힙, 코드, 데이터 영역을 공유하며 각자의 스택만 독립적으로 가집니다. 프로세스는 독립된 메모리 공간을 가지므로 IPC가 필요합니다.",
    },
    {
      id: "mid02-q2",
      question:
        "Chrome 브라우저가 멀티 프로세스 아키텍처를 사용하는 주된 이유는?",
      choices: [
        "메모리 사용량을 줄이기 위해",
        "하나의 탭이 크래시되어도 다른 탭에 영향을 주지 않도록 격리하기 위해",
        "JavaScript 실행 속도를 높이기 위해",
        "CSS 렌더링을 병렬로 처리하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "Chrome은 각 탭을 별도 프로세스로 실행하여 하나의 탭이 크래시되어도 다른 탭이 영향을 받지 않도록 합니다. 보안 측면에서도 사이트 격리(Site Isolation)를 통해 악성 페이지가 다른 탭의 데이터에 접근하는 것을 방지합니다.",
    },
    {
      id: "mid02-q3",
      question:
        "Web Worker에 대한 설명으로 틀린 것은?",
      choices: [
        "메인 스레드와 별도의 스레드에서 JavaScript를 실행한다",
        "postMessage를 통해 메인 스레드와 데이터를 주고받는다",
        "DOM에 직접 접근할 수 있어 UI 업데이트에 유용하다",
        "CPU 집약적인 작업을 오프로드하여 UI 응답성을 유지할 수 있다",
      ],
      correctIndex: 2,
      explanation:
        "Web Worker는 별도 스레드에서 실행되지만 DOM에 직접 접근할 수 없습니다. 메인 스레드와는 postMessage/onmessage로만 통신합니다. 이미지 처리, 대용량 데이터 계산 등 CPU 집약적 작업에 적합합니다.",
    },
    {
      id: "mid02-q4",
      question:
        "프론트엔드 애플리케이션에서 메모리 누수를 감지하는 방법으로 가장 적절한 것은?",
      choices: [
        "console.log로 변수 값을 출력한다",
        "Chrome DevTools의 Memory 탭에서 힙 스냅샷을 촬영하고 비교한다",
        "Network 탭에서 요청 크기를 확인한다",
        "Lighthouse 점수를 확인한다",
      ],
      correctIndex: 1,
      explanation:
        "Chrome DevTools의 Memory 탭에서 힙 스냅샷을 여러 시점에 촬영하여 비교하면 메모리가 해제되지 않는 객체를 식별할 수 있습니다. Allocation Timeline으로 시간에 따른 메모리 할당 패턴도 분석할 수 있습니다.",
    },
    {
      id: "mid02-q5",
      question:
        "JavaScript 엔진의 가비지 컬렉션(GC)에서 사용하는 Mark-and-Sweep 알고리즘에 대한 설명으로 올바른 것은?",
      choices: [
        "참조 카운트가 0인 객체만 수집한다",
        "루트(전역 객체)에서 도달 가능한 객체를 마킹하고, 마킹되지 않은 객체를 해제한다",
        "모든 객체를 주기적으로 해제하고 다시 생성한다",
        "개발자가 수동으로 GC 시점을 지정해야 한다",
      ],
      correctIndex: 1,
      explanation:
        "Mark-and-Sweep은 루트에서 시작하여 도달 가능한 모든 객체를 마킹(Mark)한 후, 마킹되지 않은 객체를 메모리에서 해제(Sweep)합니다. 참조 카운트 방식과 달리 순환 참조도 올바르게 수집할 수 있습니다.",
    },
    {
      id: "mid02-q6",
      question:
        "브라우저의 File API를 사용하여 사용자가 선택한 파일을 읽을 때, 올바른 설명은?",
      choices: [
        "File API는 사용자 동의 없이 파일 시스템에 자유롭게 접근할 수 있다",
        "FileReader는 동기적으로 파일을 읽어 메인 스레드를 차단한다",
        "FileReader는 비동기적으로 파일을 읽으며, input 요소나 드래그앤드롭으로 사용자가 선택한 파일만 접근 가능하다",
        "File API는 서버 측에서만 사용 가능하다",
      ],
      correctIndex: 2,
      explanation:
        "보안상 File API는 사용자가 명시적으로 선택한 파일에만 접근할 수 있습니다. FileReader는 비동기로 동작하며 readAsText, readAsDataURL 등의 메서드로 파일 내용을 읽습니다. onload 이벤트로 결과를 받습니다.",
    },
    {
      id: "mid02-q7",
      question:
        "CPU 캐시의 지역성(Locality) 원리와 프론트엔드 성능의 관계로 올바른 것은?",
      choices: [
        "캐시 지역성은 서버 사이드에서만 영향을 미친다",
        "배열을 순차적으로 접근하면 공간적 지역성이 높아 캐시 히트율이 올라간다",
        "객체보다 Map이 항상 캐시 지역성이 좋다",
        "캐시 지역성은 JavaScript에서는 관련이 없다",
      ],
      correctIndex: 1,
      explanation:
        "배열은 메모리에 연속으로 저장되므로 순차 접근 시 공간적 지역성(Spatial Locality)이 높아 CPU 캐시 히트율이 올라갑니다. 대량의 데이터를 처리할 때 배열 순차 접근이 임의 접근보다 빠른 이유입니다.",
    },
    {
      id: "mid02-q8",
      question:
        "V8 엔진의 JIT(Just-In-Time) 컴파일에 대한 설명으로 올바른 것은?",
      choices: [
        "모든 JavaScript 코드를 실행 전에 미리 기계어로 컴파일한다",
        "인터프리터(Ignition)로 바이트코드를 실행하다가 자주 실행되는 코드를 최적화 컴파일러(TurboFan)로 기계어로 컴파일한다",
        "JIT 컴파일은 코드를 한 번만 실행할 때 가장 효과적이다",
        "TypeScript를 사용하면 JIT 컴파일이 비활성화된다",
      ],
      correctIndex: 1,
      explanation:
        "V8은 먼저 Ignition 인터프리터로 바이트코드를 빠르게 실행합니다. 반복 실행되는 '핫' 코드를 감지하면 TurboFan이 타입 정보를 기반으로 최적화된 기계어로 컴파일합니다. 타입이 변하면 역최적화(Deoptimization)가 발생합니다.",
    },
    {
      id: "mid02-q9",
      question:
        "UTF-8과 UTF-16 인코딩의 차이로 올바른 것은?",
      choices: [
        "UTF-8은 모든 문자를 1바이트로 인코딩한다",
        "UTF-16은 항상 UTF-8보다 파일 크기가 작다",
        "UTF-8은 가변 길이(1~4바이트)이고, UTF-16은 기본 2바이트(보충 문자는 4바이트)이다",
        "JavaScript 내부 문자열은 UTF-8로 인코딩된다",
      ],
      correctIndex: 2,
      explanation:
        "UTF-8은 ASCII를 1바이트, 한글 등을 3바이트로 표현하는 가변 길이 인코딩입니다. UTF-16은 기본 2바이트이며 이모지 등 보충 문자는 서로게이트 쌍으로 4바이트를 사용합니다. JavaScript 내부 문자열은 UTF-16으로 인코딩됩니다.",
    },
    {
      id: "mid02-q10",
      question:
        "프론트엔드에서 한글이 깨지는 문제가 발생했을 때, 가장 먼저 확인해야 할 것은?",
      choices: [
        "JavaScript 엔진의 버전",
        "HTML의 <meta charset> 태그와 서버 응답의 Content-Type 헤더의 인코딩 설정",
        "CSS의 font-family 설정",
        "브라우저의 캐시를 삭제",
      ],
      correctIndex: 1,
      explanation:
        "한글 깨짐은 대부분 인코딩 불일치에서 발생합니다. HTML의 <meta charset=\"UTF-8\">과 서버 응답의 Content-Type: text/html; charset=UTF-8이 일치하는지 확인해야 합니다. 파일 자체의 저장 인코딩도 UTF-8이어야 합니다.",
    },
  ],
};

export default midQuiz;
