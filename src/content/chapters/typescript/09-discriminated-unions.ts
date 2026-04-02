import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "09-discriminated-unions",
  subject: "typescript",
  title: "판별 유니온",
  description:
    "판별 프로퍼티를 가진 유니온 타입으로 상태 머신을 모델링하고, switch/case로 완벽한 타입 좁히기를 구현합니다.",
  order: 9,
  group: "타입 좁히기",
  prerequisites: ["08-type-narrowing"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "판별 유니온은 **신호등 시스템**과 같습니다.\n\n" +
        "신호등은 항상 빨강, 노랑, 초록 중 하나의 상태입니다. 각 색깔(판별 프로퍼티)에 따라 할 수 있는 행동이 명확히 정해집니다:\n\n" +
        "- **빨강**: 정지, 대기 시간 표시\n" +
        "- **노랑**: 감속 준비, 남은 시간 표시\n" +
        "- **초록**: 출발, 속도 제한 표시\n\n" +
        "신호등 색깔만 확인하면 그에 맞는 데이터와 행동이 자동으로 결정됩니다. 판별 유니온도 마찬가지입니다. `type`, `kind`, `status` 같은 공통 리터럴 프로퍼티 하나만 확인하면, TypeScript가 나머지 프로퍼티의 타입을 자동으로 알아냅니다.\n\n" +
        "일반 유니온에서 `in` 연산자나 `typeof`로 일일이 확인했던 것과 달리, 판별 유니온은 **하나의 프로퍼티 값**만으로 전체 타입이 결정되는 깔끔한 패턴입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "실무에서는 하나의 데이터가 여러 '상태'나 '종류'를 가지는 경우가 매우 많습니다:\n\n" +
        "- **API 응답**: 로딩 중 / 성공 / 실패\n" +
        "- **결제 상태**: 대기 / 승인 / 거절 / 환불\n" +
        "- **UI 컴포넌트**: 버튼 / 링크 / 아이콘 버튼\n" +
        "- **이벤트**: 클릭 / 키보드 / 스크롤\n\n" +
        "각 상태마다 가진 데이터가 다릅니다. 성공 응답에는 `data`가 있지만, 실패 응답에는 `error`가 있습니다. 로딩 중에는 둘 다 없습니다.\n\n" +
        "이를 하나의 인터페이스로 모델링하면 모든 프로퍼티가 옵셔널이 되어 `data`와 `error`가 동시에 존재하는 불가능한 상태를 허용하게 됩니다. 판별 유니온은 이 문제를 타입 레벨에서 원천적으로 차단합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 판별 유니온의 3가지 요소\n" +
        "1. **공통 리터럴 프로퍼티** (판별자): 모든 변형에 존재하며 각각 고유한 리터럴 값을 가짐\n" +
        "2. **변형별 고유 프로퍼티**: 각 상태에 필요한 데이터만 포함\n" +
        "3. **switch/case 또는 if 분기**: 판별자를 기준으로 분기하면 자동으로 타입이 좁혀짐\n\n" +
        "### 핵심 규칙\n" +
        "- 판별 프로퍼티는 반드시 **리터럴 타입**이어야 합니다 (문자열 리터럴, 숫자 리터럴, boolean 리터럴)\n" +
        "- 모든 변형에 **같은 이름**의 판별 프로퍼티가 있어야 합니다\n" +
        "- 각 변형의 판별 값은 **고유**해야 합니다\n\n" +
        "### never 기반 완전성 보장\n" +
        "switch의 default에서 `never` 타입을 활용하면, 새로운 변형이 유니온에 추가될 때 처리하지 않은 케이스를 컴파일 에러로 잡아냅니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 상태 머신 모델링",
      content:
        "API 응답을 판별 유니온으로 모델링하는 패턴을 살펴봅시다. 각 상태에 필요한 데이터만 정확히 포함되어 불가능한 상태를 원천 차단합니다.",
      code: {
        language: "typescript",
        code:
          "// === 잘못된 모델링: 모든 프로퍼티가 옵셔널 ===\n" +
          "// type ApiResponse = {\n" +
          "//   status: \"loading\" | \"success\" | \"error\";\n" +
          "//   data?: unknown;    // success일 때만 필요\n" +
          "//   error?: string;    // error일 때만 필요\n" +
          "// };\n" +
          "// 문제: data와 error가 동시에 존재하는 상태가 가능!\n" +
          "\n" +
          "// === 올바른 모델링: 판별 유니온 ===\n" +
          "type LoadingState = {\n" +
          "  status: \"loading\"; // 판별 프로퍼티 (리터럴 타입)\n" +
          "};\n" +
          "\n" +
          "type SuccessState<T> = {\n" +
          "  status: \"success\";\n" +
          "  data: T;           // success일 때만 존재\n" +
          "};\n" +
          "\n" +
          "type ErrorState = {\n" +
          "  status: \"error\";\n" +
          "  error: string;     // error일 때만 존재\n" +
          "  retryCount: number;\n" +
          "};\n" +
          "\n" +
          "type ApiState<T> = LoadingState | SuccessState<T> | ErrorState;\n" +
          "\n" +
          "// switch문으로 완벽한 타입 좁히기\n" +
          "function renderState<T>(state: ApiState<T>): string {\n" +
          "  switch (state.status) {\n" +
          "    case \"loading\":\n" +
          "      return \"로딩 중...\";\n" +
          "    case \"success\":\n" +
          "      // state는 SuccessState<T>로 좁혀짐\n" +
          "      return `데이터: ${JSON.stringify(state.data)}`;\n" +
          "    case \"error\":\n" +
          "      // state는 ErrorState로 좁혀짐\n" +
          "      return `에러: ${state.error} (재시도: ${state.retryCount}번)`;\n" +
          "  }\n" +
          "}",
        description:
          "판별 프로퍼티(status)의 리터럴 값에 따라 TypeScript가 자동으로 각 변형의 타입을 추론합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Result 타입과 완전성 검사",
      content:
        "함수형 에러 처리에 자주 사용되는 Result<T, E> 타입을 판별 유니온으로 구현하고, 새로운 변형 추가 시 컴파일 에러로 누락을 잡는 exhaustiveness check 패턴을 연습합니다.",
      code: {
        language: "typescript",
        code:
          "// === Result<T, E> 타입: 함수형 에러 처리 ===\n" +
          "type Success<T> = { ok: true; value: T };\n" +
          "type Failure<E> = { ok: false; error: E };\n" +
          "type Result<T, E = Error> = Success<T> | Failure<E>;\n" +
          "\n" +
          "// Result를 반환하는 함수\n" +
          "function divide(a: number, b: number): Result<number, string> {\n" +
          "  if (b === 0) {\n" +
          "    return { ok: false, error: \"0으로 나눌 수 없습니다\" };\n" +
          "  }\n" +
          "  return { ok: true, value: a / b };\n" +
          "}\n" +
          "\n" +
          "const result = divide(10, 0);\n" +
          "if (result.ok) {\n" +
          "  console.log(result.value); // number로 좁혀짐\n" +
          "} else {\n" +
          "  console.log(result.error); // string으로 좁혀짐\n" +
          "}\n" +
          "\n" +
          "// === Exhaustiveness Check: 완전성 보장 ===\n" +
          "type Shape =\n" +
          "  | { kind: \"circle\"; radius: number }\n" +
          "  | { kind: \"square\"; side: number }\n" +
          "  | { kind: \"triangle\"; base: number; height: number };\n" +
          "\n" +
          "function assertNever(value: never): never {\n" +
          "  throw new Error(`처리되지 않은 값: ${JSON.stringify(value)}`);\n" +
          "}\n" +
          "\n" +
          "function getArea(shape: Shape): number {\n" +
          "  switch (shape.kind) {\n" +
          "    case \"circle\":\n" +
          "      return Math.PI * shape.radius ** 2;\n" +
          "    case \"square\":\n" +
          "      return shape.side ** 2;\n" +
          "    case \"triangle\":\n" +
          "      return (shape.base * shape.height) / 2;\n" +
          "    default:\n" +
          "      // Shape에 새 변형 추가 시 여기서 컴파일 에러 발생!\n" +
          "      return assertNever(shape);\n" +
          "  }\n" +
          "}",
        description:
          "Result<T, E>로 안전한 에러 처리를, assertNever로 모든 케이스 처리를 컴파일 타임에 보장합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 구성 요소 | 설명 | 예시 |\n" +
        "|----------|------|------|\n" +
        "| 판별 프로퍼티 | 각 변형을 구분하는 리터럴 값 | `status: \"loading\"` |\n" +
        "| 변형(Variant) | 각 상태별 고유 데이터 구조 | `{ status: \"success\"; data: T }` |\n" +
        "| switch/case | 판별 값 기준 분기 | `switch (state.status)` |\n" +
        "| 완전성 검사 | never로 누락 방지 | `default: assertNever(x)` |\n\n" +
        "**핵심:** 판별 유니온은 '불가능한 상태를 불가능하게 만드는' 핵심 패턴입니다. 공통 리터럴 프로퍼티 하나로 전체 타입이 결정되어 switch 문과 완벽하게 조합됩니다. 새로운 변형 추가 시 never 기반 완전성 검사가 누락된 처리를 컴파일 에러로 잡아줍니다.\n\n" +
        "**다음 챕터 미리보기:** 타입 좁히기와 대비되는 '타입 단언(as)'의 세계를 배웁니다. 개발자가 컴파일러보다 타입을 더 잘 안다고 선언하는 방법과 그 위험성, 그리고 satisfies 연산자를 통한 안전한 대안을 익힙니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "판별 유니온은 공통 리터럴 프로퍼티(type, kind, status 등)로 각 변형을 구분하는 패턴이다. switch 문과 결합하면 모든 경우를 빠짐없이 처리할 수 있고, never로 완전성을 컴파일 타임에 보장한다.",
  checklist: [
    "판별 유니온의 3가지 구성 요소를 설명할 수 있다",
    "판별 프로퍼티가 리터럴 타입이어야 하는 이유를 이해한다",
    "switch/case로 판별 유니온의 타입 좁히기를 구현할 수 있다",
    "Result<T, E> 패턴을 직접 설계할 수 있다",
    "never 기반 완전성 검사(exhaustiveness check)를 적용할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "판별 유니온의 판별 프로퍼티로 사용할 수 없는 타입은?",
      choices: [
        "문자열 리터럴 (\"success\")",
        "숫자 리터럴 (1)",
        "boolean 리터럴 (true)",
        "string (일반 문자열 타입)",
      ],
      correctIndex: 3,
      explanation:
        "판별 프로퍼티는 리터럴 타입이어야 합니다. 일반 string 타입은 모든 문자열 값을 포함하므로 각 변형을 고유하게 구분할 수 없습니다.",
    },
    {
      id: "q2",
      question:
        "type A = { type: \"a\"; value: number }; type B = { type: \"b\"; label: string }; type AB = A | B; 일 때, switch(ab.type)의 case \"a\" 블록에서 접근 가능한 프로퍼티는?",
      choices: [
        "type, value, label 모두",
        "type과 value만",
        "type만",
        "value만",
      ],
      correctIndex: 1,
      explanation:
        "case \"a\" 블록에서 ab는 A 타입으로 좁혀지므로, A의 모든 프로퍼티인 type과 value에 접근할 수 있습니다.",
    },
    {
      id: "q3",
      question: "exhaustiveness check에서 default의 매개변수가 never 타입이 되는 이유는?",
      choices: [
        "TypeScript의 버그",
        "모든 가능한 케이스가 처리되어 남은 타입이 없기 때문",
        "switch 문의 기본 동작",
        "never는 모든 타입의 상위 타입이기 때문",
      ],
      correctIndex: 1,
      explanation:
        "모든 유니온 멤버가 case에서 처리되면, default에 도달할 때 가능한 타입이 없으므로 never가 됩니다. 새 멤버 추가 시 never에 할당할 수 없어 에러가 발생합니다.",
    },
    {
      id: "q4",
      question: "판별 유니온이 옵셔널 프로퍼티 패턴보다 나은 이유는?",
      choices: [
        "런타임 성능이 더 빠르다",
        "코드 양이 적다",
        "불가능한 상태 조합을 타입 레벨에서 차단한다",
        "JavaScript 호환성이 더 좋다",
      ],
      correctIndex: 2,
      explanation:
        "옵셔널 프로퍼티 패턴은 data와 error가 동시에 존재하는 불가능한 상태를 허용하지만, 판별 유니온은 각 상태에 필요한 프로퍼티만 포함하여 불가능한 조합을 원천 차단합니다.",
    },
    {
      id: "q5",
      question: "다음 중 Result<T, E> 타입의 판별 프로퍼티로 가장 적절한 것은?",
      choices: [
        "data: T | undefined",
        "ok: boolean",
        "ok: true | ok: false (각 변형에서 리터럴)",
        "type: string",
      ],
      correctIndex: 2,
      explanation:
        "Result 타입의 판별자로는 ok: true(성공)와 ok: false(실패)처럼 각 변형에서 고유한 리터럴 값을 사용해야 합니다. 일반 boolean은 판별력이 떨어집니다.",
    },
  ],
};

export default chapter;
