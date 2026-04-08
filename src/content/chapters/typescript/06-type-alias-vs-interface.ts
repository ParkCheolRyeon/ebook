import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "06-type-alias-vs-interface",
  subject: "typescript",
  title: "Type Alias vs Interface",
  description:
    "type과 interface의 문법적 차이, 선언 병합, 유니온/인터섹션을 비교하고 상황별 선택 기준을 학습합니다.",
  order: 6,
  group: "기초",
  prerequisites: ["05-objects-and-interfaces"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "**interface**는 **공식 계약서**와 같습니다. 명확한 형식이 있고, 부록(선언 병합)을 추가할 수 있습니다. 계약서 A에 '부록 1'을 붙이면 원본 계약에 조항이 추가됩니다. 라이브러리가 기본 계약을 제공하고, 사용자가 부록으로 확장하는 패턴에 적합합니다.\n\n" +
        "**type alias**는 **별명(닉네임)**과 같습니다. 복잡한 이름을 짧게 줄이거나, 여러 이름을 조합할 수 있습니다. '프론트엔드 개발자 또는 백엔드 개발자'(유니온)처럼 여러 타입을 묶거나, '개발 능력 그리고 소통 능력'(인터섹션)처럼 교차시킬 수 있습니다.\n\n" +
        "객체의 형태를 정의할 때는 둘 다 사용할 수 있지만, 각자의 강점이 다릅니다. interface는 확장과 병합에 강하고, type은 유니온·인터섹션 같은 복합 타입 표현에 강합니다.\n\n" +
        "결국 팀이 일관된 컨벤션을 정하는 것이 가장 중요합니다. 둘 중 하나만 옳은 것이 아니라, 상황에 맞게 선택하는 것입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "TypeScript를 배우면 반드시 마주치는 질문이 있습니다: 'type을 쓸까, interface를 쓸까?'\n\n" +
        "**1. 문법적 유사성으로 인한 혼란**\n" +
        "`type User = { name: string }`과 `interface User { name: string }`은 거의 동일하게 작동합니다. 언제 어떤 것을 써야 하는지 기준이 불명확합니다.\n\n" +
        "**2. 선언 병합을 모르면 생기는 문제**\n" +
        "같은 이름의 interface를 두 번 선언하면 자동으로 병합됩니다. 이 동작을 모르면 의도치 않게 인터페이스가 변경될 수 있습니다. type은 중복 선언이 에러입니다.\n\n" +
        "**3. 복합 타입 표현의 한계**\n" +
        "`string | number` 같은 유니온 타입이나 `A & B` 같은 인터섹션은 interface만으로는 표현할 수 없습니다. interface는 extends로 확장은 가능하지만 유니온 개념이 없습니다.\n\n" +
        "**4. 팀 내 일관성 부재**\n" +
        "같은 프로젝트에서 누구는 type을 쓰고, 누구는 interface를 쓰면 코드의 일관성이 깨집니다. 명확한 가이드라인이 필요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "type과 interface의 핵심 차이를 이해하면 적재적소에 사용할 수 있습니다.\n\n" +
        "### 선언 병합 (Declaration Merging)\n" +
        "interface만 가능합니다. 같은 이름의 interface를 여러 번 선언하면 모든 선언이 하나로 합쳐집니다. 라이브러리 타입 확장(예: Window 객체에 프로퍼티 추가)에 필수적입니다.\n\n" +
        "### 유니온과 인터섹션\n" +
        "type만 가능합니다. `type Result = Success | Error` (유니온), `type Combined = A & B` (인터섹션). interface는 extends로 확장만 가능하고, 유니온 개념이 없습니다.\n\n" +
        "### extends vs & (인터섹션)\n" +
        "interface는 `extends`, type은 `&`로 타입을 합성합니다. 결과는 유사하지만 미묘한 차이가 있습니다. 충돌하는 프로퍼티가 있을 때 extends는 에러를, &는 never를 만듭니다.\n\n" +
        "### 성능\n" +
        "TypeScript 팀에 따르면 `interface extends`가 `type &`(인터섹션)보다 내부적으로 캐싱되어 타입 검사 시 약간 유리합니다. 이는 interface와 type 자체의 차이가 아니라, extends와 인터섹션의 처리 방식 차이에서 비롯됩니다. 또한 최근 TypeScript 버전에서는 이 격차가 상당히 줄어들었습니다.\n\n" +
        "### 실무 가이드라인\n" +
        "- **객체의 형태**: interface 사용 (확장성, 선언 병합)\n" +
        "- **유니온/인터섹션/매핑**: type 사용 (유연한 조합)\n" +
        "- **원시 타입 별칭**: type 사용 (`type ID = string`)\n" +
        "- 팀에서 일관된 컨벤션을 정하는 것이 가장 중요합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 선언 병합과 인터섹션",
      content:
        "선언 병합(Declaration Merging)은 interface만의 고유 기능입니다. 이것이 type과의 가장 큰 구조적 차이입니다. 또한 extends와 &의 충돌 처리 방식 차이도 중요합니다.",
      code: {
        language: "typescript",
        code:
          "// ===== 선언 병합 (interface만 가능) =====\n" +
          "interface Window {\n" +
          "  title: string;\n" +
          "}\n" +
          "\n" +
          "interface Window {\n" +
          "  appVersion: string; // 기존 Window에 자동 병합\n" +
          "}\n" +
          "\n" +
          "// 결과: Window { title: string; appVersion: string; }\n" +
          "// → 라이브러리 타입 확장에 필수적\n" +
          "\n" +
          "// type은 중복 선언 불가\n" +
          "// type Foo = { a: string };\n" +
          "// type Foo = { b: string }; // ❌ 에러: 중복 식별자\n" +
          "\n" +
          "// ===== extends vs & (충돌 시 차이) =====\n" +
          "interface Base {\n" +
          "  id: number;\n" +
          "}\n" +
          "\n" +
          "// extends: 충돌 시 컴파일 에러 (명확한 피드백)\n" +
          "// interface Child extends Base {\n" +
          "//   id: string; // ❌ 에러: number와 호환 불가\n" +
          "// }\n" +
          "\n" +
          "// &(인터섹션): 충돌 시 never (에러 없이 사용 불가 타입)\n" +
          "type BaseType = { id: number };\n" +
          "type ChildType = BaseType & { id: string };\n" +
          "// ChildType의 id는 number & string = never\n" +
          "// → 에러는 나지 않지만 실질적으로 사용 불가\n" +
          "\n" +
          "// ===== 유니온 타입 (type만 가능) =====\n" +
          "type Status = \"loading\" | \"success\" | \"error\";\n" +
          "type StringOrNumber = string | number;\n" +
          "\n" +
          "// interface로는 유니온 표현 불가\n" +
          "// interface Status = \"loading\" | \"success\"; // ❌ 문법 에러\n" +
          "\n" +
          "// ===== 원시 타입 별칭 (type만 가능) =====\n" +
          "type ID = string;\n" +
          "type Callback = () => void;\n" +
          "type Pair = [string, number];",
        description:
          "선언 병합은 interface만 지원하고, 유니온/인터섹션/원시 타입 별칭은 type만 지원합니다. extends는 충돌 시 에러를, &는 never를 만듭니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 상황별 type과 interface 선택",
      content:
        "실무에서 type과 interface를 어떻게 선택하는지 구체적인 사례로 살펴봅시다. 각 상황에서 왜 해당 키워드를 선택했는지 이해하는 것이 중요합니다.",
      code: {
        language: "typescript",
        code:
          "// ✅ interface: 객체의 형태 정의\n" +
          "interface User {\n" +
          "  id: number;\n" +
          "  name: string;\n" +
          "  email: string;\n" +
          "}\n" +
          "\n" +
          "interface Admin extends User {\n" +
          "  permissions: string[];\n" +
          "}\n" +
          "\n" +
          "// ✅ type: 유니온 타입\n" +
          'type Theme = "light" | "dark" | "system";\n' +
          'type Status = "idle" | "loading" | "success" | "error";\n' +
          "\n" +
          "// ✅ type: 인터섹션으로 타입 합성\n" +
          "type Timestamped = {\n" +
          "  createdAt: Date;\n" +
          "  updatedAt: Date;\n" +
          "};\n" +
          "\n" +
          "type UserWithTimestamps = User & Timestamped;\n" +
          "\n" +
          "// ✅ type: 함수 타입\n" +
          "type EventHandler = (event: Event) => void;\n" +
          "type Predicate<T> = (item: T) => boolean;\n" +
          "\n" +
          "// ✅ type: 조건부/매핑 등 고급 타입\n" +
          "type Nullable<T> = T | null;\n" +
          "type ReadonlyUser = Readonly<User>;\n" +
          "\n" +
          "// ✅ interface: 라이브러리 타입 확장 (선언 병합)\n" +
          "// express의 Request 객체에 user 프로퍼티 추가\n" +
          "// declare module 'express' {\n" +
          "//   interface Request {\n" +
          "//     user?: User;\n" +
          "//   }\n" +
          "// }\n" +
          "\n" +
          "// 실무 규칙 요약:\n" +
          "// 객체 shape → interface\n" +
          "// 유니온/인터섹션/함수/유틸리티 → type\n" +
          "// 라이브러리 확장 → interface",
        description:
          "객체 형태는 interface, 유니온/인터섹션/함수 타입은 type을 사용하는 것이 일반적인 컨벤션입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 기능 | type | interface |\n" +
        "|------|------|----------|\n" +
        "| 객체 형태 정의 | ✅ | ✅ |\n" +
        "| 유니온 타입 | ✅ | ❌ |\n" +
        "| 인터섹션 (&) | ✅ | - (extends 사용) |\n" +
        "| 선언 병합 | ❌ | ✅ |\n" +
        "| extends/implements | ✅ | ✅ |\n" +
        "| 원시 타입 별칭 | ✅ | ❌ |\n" +
        "| 튜플/매핑 타입 | ✅ | ❌ |\n" +
        "| 컴파일 성능 | 보통 | 약간 유리 |\n\n" +
        "**핵심:** interface는 선언 병합이 가능하고 확장에 유리하며, type은 유니온/인터섹션 등 더 유연한 타입 조합이 가능합니다. 객체 타입은 interface, 복합 타입은 type을 쓰는 것이 일반적인 컨벤션입니다.\n\n" +
        "**다음 챕터 미리보기:** 유니온 타입과 인터섹션 타입을 깊이 다룹니다. 여러 타입을 조합하여 더 정밀한 타입을 만드는 방법과, 판별 유니온(Discriminated Union) 패턴을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "interface는 선언 병합이 가능하고 확장에 유리하며, type은 유니온·인터섹션 등 더 유연한 타입 조합이 가능하다. 객체 타입은 interface, 복합 타입은 type을 쓰는 것이 일반적인 컨벤션이다.",
  checklist: [
    "type과 interface의 문법적 차이를 설명할 수 있다",
    "선언 병합(Declaration Merging)의 개념과 용도를 이해한다",
    "extends와 &(인터섹션)의 충돌 처리 차이를 설명할 수 있다",
    "유니온 타입이 type에서만 가능한 이유를 이해한다",
    "실무에서 type과 interface의 선택 기준을 제시할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "같은 이름의 interface를 두 번 선언하면 어떻게 되는가?",
      choices: [
        "컴파일 에러 (중복 선언 불가)",
        "두 번째 선언이 첫 번째를 덮어씀",
        "두 선언이 자동으로 병합됨",
        "런타임 에러",
      ],
      correctIndex: 2,
      explanation:
        "interface는 선언 병합(Declaration Merging)을 지원합니다. 같은 이름의 interface를 여러 번 선언하면 모든 프로퍼티가 하나의 인터페이스로 합쳐집니다.",
    },
    {
      id: "q2",
      question:
        "type A = { id: number } & { id: string }에서 A의 id 타입은?",
      choices: ["number", "string", "number | string", "never"],
      correctIndex: 3,
      explanation:
        "인터섹션(&)에서 같은 프로퍼티가 호환되지 않는 타입이면 number & string = never가 됩니다. 에러는 발생하지 않지만 실질적으로 사용할 수 없는 타입이 됩니다.",
    },
    {
      id: "q3",
      question:
        "다음 중 type으로만 표현할 수 있는 것은?",
      choices: [
        "객체의 형태 정의",
        "유니온 타입",
        "extends로 확장",
        "메서드 정의",
      ],
      correctIndex: 1,
      explanation:
        "유니온 타입(A | B)은 type으로만 표현할 수 있습니다. interface에는 유니온 개념이 없으며, 객체 형태 정의와 extends는 type과 interface 모두 가능합니다.",
    },
    {
      id: "q4",
      question: "interface가 type보다 성능적으로 유리한 이유는?",
      choices: [
        "런타임에서 더 빠르게 실행됨",
        "내부적으로 캐싱되어 컴파일 시 더 효율적",
        "메모리를 덜 사용함",
        "성능 차이가 없음",
      ],
      correctIndex: 1,
      explanation:
        "TypeScript 팀에 따르면 interface extends가 type &(인터섹션)보다 내부적으로 캐싱되어 타입 검사 시 약간 더 효율적입니다. 이는 extends와 인터섹션의 처리 방식 차이에서 비롯되며, 최근 TS 버전에서는 격차가 줄어들고 있습니다.",
    },
    {
      id: "q5",
      question:
        "라이브러리의 타입을 확장해야 할 때 적합한 방법은?",
      choices: [
        "type alias로 인터섹션(&) 사용",
        "interface의 선언 병합 사용",
        "any로 타입 무시",
        "새로운 타입을 처음부터 정의",
      ],
      correctIndex: 1,
      explanation:
        "라이브러리의 기존 인터페이스에 프로퍼티를 추가할 때는 선언 병합이 가장 적합합니다. 예를 들어 Express의 Request 객체에 user 프로퍼티를 추가하는 것은 interface의 선언 병합으로 가능합니다.",
    },
  ],
};

export default chapter;
