import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "02-basic-types",
  subject: "typescript",
  title: "기본 타입",
  description:
    "TypeScript의 기본 타입 시스템을 학습하고, any, unknown, never, void의 차이를 깊이 이해합니다.",
  order: 2,
  group: "기초",
  prerequisites: ["01-what-is-typescript"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "타입은 **컨테이너의 라벨**과 같습니다.\n\n" +
        "물류 창고에 수많은 컨테이너가 있다고 상상해보세요. `string` 라벨이 붙은 컨테이너에는 텍스트만, `number` 라벨에는 숫자만 넣을 수 있습니다.\n\n" +
        "**any**는 라벨이 없는 컨테이너입니다. 아무거나 넣을 수 있지만, 꺼낼 때 뭐가 들어있는지 모릅니다. 위험하죠.\n\n" +
        "**unknown**은 '내용물 확인 필요'라고 적힌 컨테이너입니다. 사용하기 전에 반드시 내용물을 확인(타입 검사)해야 합니다. any보다 훨씬 안전합니다.\n\n" +
        "**never**는 절대 존재할 수 없는 컨테이너입니다. 크기가 0이라 아무것도 넣을 수 없습니다. 이론적으로만 존재하며, 도달 불가능한 코드를 나타냅니다.\n\n" +
        "**void**는 '빈 반환'이라고 적힌 컨테이너입니다. 함수가 아무것도 돌려주지 않을 때 사용합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "JavaScript에서는 변수가 어떤 타입의 값이든 담을 수 있습니다. 이 유연함 때문에 발생하는 문제들을 살펴봅시다.\n\n" +
        "**1. 의도하지 않은 타입 변환**\n" +
        '`"5" + 3`은 `"53"`이 되고, `"5" - 3`은 `2`가 됩니다. 같은 연산자인데 타입에 따라 다르게 동작합니다.\n\n' +
        "**2. null/undefined 관련 에러**\n" +
        "JavaScript에서 가장 흔한 에러인 `TypeError: Cannot read properties of undefined`는 값이 없을 수 있다는 것을 인지하지 못해서 발생합니다.\n\n" +
        "**3. any의 남용**\n" +
        "TypeScript를 사용하면서도 `any`를 남발하면 타입 시스템의 이점을 모두 잃게 됩니다. 그런데 `any` 없이는 외부 데이터를 어떻게 다뤄야 할까요?\n\n" +
        "**4. 배열의 타입 안전성**\n" +
        "JavaScript 배열은 서로 다른 타입의 값을 섞어 넣을 수 있어, 배열 요소를 사용할 때마다 타입을 확인해야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "TypeScript는 풍부한 타입 시스템으로 이 문제들을 해결합니다.\n\n" +
        "### 원시 타입\n" +
        "`string`, `number`, `boolean`, `bigint`, `symbol`은 JavaScript의 원시 값에 대응합니다. 대문자(`String`, `Number`)가 아닌 소문자를 사용해야 합니다. `bigint`는 `Number.MAX_SAFE_INTEGER`를 넘는 큰 정수를 다룰 때, `symbol`은 객체 프로퍼티의 고유 키를 만들 때 사용합니다.\n\n" +
        "### 배열과 튜플\n" +
        "`number[]` 또는 `Array<number>`로 배열의 요소 타입을 지정합니다. 튜플(`[string, number]`)은 고정 길이와 각 위치의 타입을 지정합니다.\n\n" +
        "### enum\n" +
        "관련된 상수들의 집합을 정의합니다. 숫자 enum과 문자열 enum이 있으며, 문자열 enum이 디버깅에 유리합니다.\n\n" +
        "### any vs unknown\n" +
        "`any`는 타입 검사를 완전히 비활성화합니다. `unknown`은 모든 값을 받을 수 있지만, 사용하기 전에 타입 좁히기(narrowing)가 필요합니다. 외부 데이터를 다룰 때는 `unknown`을 사용하세요.\n\n" +
        "### void vs never\n" +
        "`void`는 함수가 값을 반환하지 않음을 의미합니다. `never`는 함수가 정상적으로 종료되지 않음(무한 루프, 예외 throw)을 나타냅니다.\n\n" +
        "### 리터럴 타입\n" +
        '`"success"`, `42`, `true`처럼 특정 값 자체를 타입으로 사용할 수 있습니다. 유니온과 결합하면 강력한 타입 안전성을 제공합니다.',
    },
    {
      type: "pseudocode",
      title: "기술 구현: any vs unknown의 내부 동작",
      content:
        "any와 unknown의 차이를 정확히 이해하는 것이 TypeScript 활용의 핵심입니다. any는 타입 시스템의 탈출구이고, unknown은 타입 시스템 안에서의 안전한 대안입니다. 타입 체커가 두 타입을 어떻게 다르게 처리하는지 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          "// ===== any: 타입 검사 비활성화 =====\n" +
          "let valueAny: any = 42;\n" +
          "valueAny.foo.bar;         // ✅ 컴파일 통과 (런타임 에러!)\n" +
          "valueAny.toUpperCase();   // ✅ 컴파일 통과 (런타임 에러!)\n" +
          "valueAny();               // ✅ 컴파일 통과 (런타임 에러!)\n" +
          "// any는 무엇이든 허용 → 타입 시스템의 이점을 모두 잃음\n" +
          "\n" +
          "// ===== unknown: 안전한 any =====\n" +
          "let valueUnknown: unknown = 42;\n" +
          "// valueUnknown.foo;       // ❌ 컴파일 에러!\n" +
          "// valueUnknown.toString(); // ❌ 컴파일 에러!\n" +
          "// valueUnknown();          // ❌ 컴파일 에러!\n" +
          "\n" +
          "// unknown은 사용하기 전에 반드시 타입을 좁혀야 함\n" +
          'if (typeof valueUnknown === "string") {\n' +
          "  valueUnknown.toUpperCase(); // ✅ string으로 좁혀졌으므로 안전\n" +
          "}\n" +
          "\n" +
          "if (typeof valueUnknown === \"number\") {\n" +
          "  valueUnknown.toFixed(2);    // ✅ number로 좁혀졌으므로 안전\n" +
          "}\n" +
          "\n" +
          "// ===== 타입 체커의 관점 =====\n" +
          "// any  → \"이 값은 뭐든 될 수 있고, 뭐든 해도 된다\" (위험)\n" +
          "// unknown → \"이 값은 뭐든 될 수 있지만, 확인 전엔 아무것도 못한다\" (안전)",
        description:
          "any는 타입 검사를 포기하는 것이고, unknown은 타입 검사를 강제하는 것입니다. 외부 데이터에는 unknown을 사용하세요.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 기본 타입 활용하기",
      content:
        "TypeScript의 기본 타입들을 실제 코드에서 어떻게 활용하는지 살펴봅시다. 원시 타입부터 enum, 튜플, 리터럴 타입까지 다양한 상황에서의 사용법을 익힙니다.",
      code: {
        language: "typescript",
        code:
          "// 1. 원시 타입\n" +
          'let username: string = "Alice";\n' +
          "let age: number = 30;\n" +
          "let isActive: boolean = true;\n" +
          "let bigNumber: bigint = 9007199254740991n; // BigInt 리터럴\n" +
          "let uniqueKey: symbol = Symbol(\"key\"); // 고유한 심볼\n" +
          "\n" +
          "// 2. 배열과 튜플\n" +
          "let scores: number[] = [95, 87, 92];\n" +
          "let pair: [string, number] = [\"Alice\", 30]; // 튜플: 고정 길이 + 위치별 타입\n" +
          "// pair = [30, \"Alice\"]; // ❌ 순서가 다르면 에러\n" +
          "\n" +
          "// 3. 문자열 enum (디버깅에 유리)\n" +
          "enum Status {\n" +
          '  Pending = "PENDING",\n' +
          '  Active = "ACTIVE",\n' +
          '  Inactive = "INACTIVE",\n' +
          "}\n" +
          "const userStatus: Status = Status.Active;\n" +
          "\n" +
          "// 4. 리터럴 타입 + 유니온\n" +
          'type Direction = "up" | "down" | "left" | "right";\n' +
          'let move: Direction = "up";\n' +
          '// move = "diagonal"; // ❌ 허용되지 않는 값\n' +
          "\n" +
          "// 5. void와 never\n" +
          "function logMessage(msg: string): void {\n" +
          "  console.log(msg); // 반환값 없음\n" +
          "}\n" +
          "\n" +
          "function throwError(msg: string): never {\n" +
          "  throw new Error(msg); // 절대 정상 반환하지 않음\n" +
          "}\n" +
          "\n" +
          "// 6. null과 undefined\n" +
          "let nullable: string | null = null;\n" +
          'nullable = "hello"; // ✅ string도 가능\n' +
          "// nullable.length;  // ❌ null일 수 있으므로 직접 접근 불가\n" +
          "console.log(nullable?.length); // ✅ 옵셔널 체이닝으로 안전 접근",
        description:
          "TypeScript의 기본 타입들을 활용한 실전 예제입니다. 특히 enum은 문자열로, 외부 데이터는 unknown으로 다루는 것을 권장합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 타입 | 설명 | 사용 시점 |\n" +
        "|------|------|----------|\n" +
        "| string, number, boolean, bigint, symbol | 원시 타입 | 기본 값 표현 |\n" +
        "| number[], Array\\<T\\> | 배열 타입 | 동일 타입의 목록 |\n" +
        "| [T, U] | 튜플 | 고정 길이, 위치별 타입 |\n" +
        "| enum | 열거형 | 관련 상수 집합 |\n" +
        "| any | 모든 타입 허용 | 사용 자제 |\n" +
        "| unknown | 안전한 any | 외부 데이터 수신 |\n" +
        "| void | 반환값 없음 | 반환 없는 함수 |\n" +
        "| never | 도달 불가 | 예외, 무한루프, 소진 검사 |\n" +
        '| 리터럴 | "success", 42 | 정확한 값 제한 |\n\n' +
        "**핵심:** any는 타입 검사를 포기하는 것이고, unknown은 안전한 any입니다. never는 절대 발생하지 않는 값을 나타내며, void는 반환값이 없음을 의미합니다.\n\n" +
        "**다음 챕터 미리보기:** TypeScript의 타입 추론(Type Inference)을 배웁니다. 모든 변수에 타입을 명시할 필요가 없는 이유와, 언제 타입을 명시하고 언제 추론에 맡길지 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "any는 타입 검사를 포기하는 것이고, unknown은 안전한 any다. never는 절대 발생하지 않는 값을 나타내며, void는 반환값이 없음을 의미한다.",
  checklist: [
    "string, number, boolean 타입을 올바르게 사용할 수 있다",
    "any와 unknown의 차이를 명확히 설명할 수 있다",
    "never와 void의 차이를 실제 예제로 설명할 수 있다",
    "튜플과 배열의 차이를 이해하고 적절히 선택할 수 있다",
    "리터럴 타입의 용도와 유니온과의 결합을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "다음 중 unknown 타입의 값으로 할 수 있는 것은?",
      choices: [
        "프로퍼티에 직접 접근",
        "함수로 호출",
        "typeof로 타입을 좁힌 후 사용",
        "메서드 직접 호출",
      ],
      correctIndex: 2,
      explanation:
        "unknown 타입은 사용하기 전에 반드시 타입을 좁혀야(narrowing) 합니다. typeof, instanceof 등으로 타입을 확인한 후에만 해당 타입의 연산을 수행할 수 있습니다.",
    },
    {
      id: "q2",
      question: "never 타입이 사용되는 상황으로 적절하지 않은 것은?",
      choices: [
        "항상 예외를 throw하는 함수의 반환 타입",
        "무한 루프를 가진 함수의 반환 타입",
        "switch문의 소진 검사(exhaustive check)",
        "값을 반환하지 않는 void 함수",
      ],
      correctIndex: 3,
      explanation:
        "void는 함수가 값을 반환하지 않음을 의미하고, never는 함수가 정상적으로 종료되지 않음을 의미합니다. void 함수는 실행이 끝나지만, never 함수는 끝나지 않습니다.",
    },
    {
      id: "q3",
      question: "TypeScript에서 배열 타입을 표기하는 올바른 방법 두 가지는?",
      choices: [
        "number[] 와 Array<number>",
        "number[] 와 [number]",
        "Array(number) 와 number[]",
        "List<number> 와 number[]",
      ],
      correctIndex: 0,
      explanation:
        "TypeScript에서 배열 타입은 number[]와 Array<number> 두 가지 문법으로 표기할 수 있습니다. [number]는 길이 1인 튜플 타입입니다.",
    },
    {
      id: "q4",
      question:
        "enum Direction { Up = \"UP\", Down = \"DOWN\" }에서 문자열 enum의 장점은?",
      choices: [
        "숫자 enum보다 연산이 빠르다",
        "자동 증가(auto-increment)를 지원한다",
        "디버깅 시 의미 있는 값을 보여준다",
        "역방향 매핑(reverse mapping)이 가능하다",
      ],
      correctIndex: 2,
      explanation:
        "문자열 enum은 런타임에 실제 문자열 값이 사용되므로 디버깅 시 의미 있는 값을 확인할 수 있습니다. 숫자 enum은 0, 1, 2 같은 숫자로 보여 의미 파악이 어렵습니다.",
    },
    {
      id: "q5",
      question:
        "let tuple: [string, number] = [\"Alice\", 30]; 에서 tuple[0]의 타입은?",
      choices: ["string | number", "string", "any", "unknown"],
      correctIndex: 1,
      explanation:
        "튜플은 각 위치마다 타입이 고정됩니다. [string, number]에서 인덱스 0은 string, 인덱스 1은 number입니다. 일반 배열과 달리 위치별로 정확한 타입을 알 수 있습니다.",
    },
  ],
};

export default chapter;
