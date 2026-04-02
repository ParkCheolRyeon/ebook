import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "01-what-is-typescript",
  subject: "typescript",
  title: "TypeScript란 무엇인가",
  description:
    "JavaScript의 superset인 TypeScript의 핵심 개념과 정적 타입 시스템이 해결하는 문제를 이해합니다.",
  order: 1,
  group: "기초",
  prerequisites: [],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "TypeScript는 **건물의 설계도**와 같습니다.\n\n" +
        "JavaScript로 코드를 작성하는 것은 설계도 없이 건물을 짓는 것과 비슷합니다. 벽돌을 쌓다가 문이 들어갈 자리가 없다는 걸 뒤늦게 깨닫죠. 이미 3층까지 올렸는데 1층 기둥 위치가 잘못됐다면? 런타임에 발견되는 버그가 바로 이런 상황입니다.\n\n" +
        "TypeScript는 시공 전에 설계도를 검토하는 과정입니다. 기둥의 위치(타입), 배관의 연결(인터페이스), 전기 배선의 규격(함수 시그니처)을 미리 확인합니다. 설계 단계에서 문제를 발견하면 수정 비용이 훨씬 적습니다.\n\n" +
        "중요한 점은, 완성된 건물(런타임)에는 설계도가 포함되지 않는다는 것입니다. TypeScript의 타입 정보도 마찬가지로, 컴파일 후에는 모두 사라지고 순수한 JavaScript만 남습니다. 이것이 바로 **타입 소거(Type Erasure)**입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "JavaScript는 동적 타입 언어입니다. 변수에 어떤 타입의 값이든 넣을 수 있고, 함수가 어떤 타입을 반환할지 강제하지 않습니다. 이 유연함이 장점이지만, 프로젝트가 커질수록 심각한 문제가 됩니다.\n\n" +
        "**1. 런타임 에러의 사전 방지 불가**\n" +
        "`user.naem`처럼 프로퍼티 이름을 오타 내도, 실행하기 전에는 알 수 없습니다. `Cannot read properties of undefined`는 JavaScript 개발자가 가장 많이 보는 에러입니다.\n\n" +
        "**2. IDE 자동완성의 한계**\n" +
        "타입 정보가 없으면 IDE가 객체의 프로퍼티나 함수의 매개변수를 추론할 수 없습니다. 개발자가 문서를 찾아보거나 소스 코드를 직접 읽어야 합니다.\n\n" +
        "**3. 리팩터링의 위험성**\n" +
        "함수의 매개변수를 변경했을 때, 이 함수를 호출하는 모든 곳을 수동으로 찾아 수정해야 합니다. 하나라도 놓치면 런타임 에러가 됩니다.\n\n" +
        "**4. 팀 협업의 비효율**\n" +
        "다른 사람이 작성한 함수를 사용할 때, 어떤 인자를 넘겨야 하는지 코드를 직접 읽어봐야 합니다. JSDoc 주석이 있어도 강제력이 없습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "TypeScript는 JavaScript에 **정적 타입 시스템**을 추가한 superset입니다. 모든 유효한 JavaScript 코드는 유효한 TypeScript 코드이기도 합니다.\n\n" +
        "### tsc 컴파일러\n" +
        "TypeScript 코드는 `tsc`(TypeScript Compiler)를 통해 JavaScript로 변환됩니다. 이 과정에서 타입 검사가 수행되며, 타입 오류가 있으면 컴파일 타임에 에러를 보고합니다.\n\n" +
        "### 타입 소거 (Type Erasure)\n" +
        "컴파일 결과물인 JavaScript에는 타입 정보가 전혀 포함되지 않습니다. `string`, `number`, `interface` 등의 타입 구문은 모두 제거됩니다. 런타임에는 순수 JavaScript만 실행됩니다. 따라서 TypeScript를 사용해도 런타임 성능에 영향이 없습니다.\n\n" +
        "### 점진적 도입 가능\n" +
        "기존 JavaScript 프로젝트에 `.ts` 파일을 하나씩 추가하며 점진적으로 마이그레이션할 수 있습니다. `strict` 옵션도 단계적으로 활성화할 수 있어, 한 번에 모든 것을 바꿀 필요가 없습니다.\n\n" +
        "### 개발 경험 향상\n" +
        "타입 정보 덕분에 IDE가 정확한 자동완성, 실시간 에러 표시, 안전한 리팩터링(이름 변경, 시그니처 변경)을 제공합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 타입 소거의 이해",
      content:
        "TypeScript 코드가 JavaScript로 변환되는 과정을 살펴봅시다. 타입 관련 구문이 어떻게 제거되는지 이해하면, TypeScript의 본질을 파악할 수 있습니다. 타입은 오직 컴파일 타임에만 존재하며, 런타임에는 어떤 흔적도 남기지 않습니다.",
      code: {
        language: "typescript",
        code:
          "// ===== TypeScript 소스 코드 (.ts) =====\n" +
          "\n" +
          "// 인터페이스: 컴파일 후 완전히 사라짐\n" +
          "interface User {\n" +
          "  name: string;\n" +
          "  age: number;\n" +
          "  email: string;\n" +
          "}\n" +
          "\n" +
          "// 함수의 매개변수와 반환값에 타입 표기\n" +
          "function greet(user: User): string {\n" +
          "  return `안녕하세요, ${user.name}님! (${user.age}세)`;\n" +
          "}\n" +
          "\n" +
          "// 타입 단언\n" +
          'const input = document.getElementById("name") as HTMLInputElement;\n' +
          "\n" +
          "// ===== 컴파일 결과 (.js) =====\n" +
          "// interface → 완전히 제거\n" +
          "// 타입 표기 → 제거\n" +
          "// as 타입 단언 → 제거\n" +
          "\n" +
          "// function greet(user) {\n" +
          "//   return `안녕하세요, ${user.name}님! (${user.age}세)`;\n" +
          "// }\n" +
          '// const input = document.getElementById("name");\n' +
          "\n" +
          "// ⚠️ 런타임에서 타입 검사를 하고 싶다면?\n" +
          "// typeof, instanceof 등 JavaScript 연산자를 사용해야 합니다.\n" +
          "function isString(value: unknown): value is string {\n" +
          '  return typeof value === "string"; // JS 런타임 검사\n' +
          "}",
        description:
          "TypeScript의 타입 정보는 컴파일 시 모두 제거됩니다. 런타임 타입 검사가 필요하면 typeof, instanceof 등 JavaScript 연산자를 사용해야 합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: TypeScript의 컴파일 타임 에러 감지",
      content:
        "TypeScript가 컴파일 타임에 잡아주는 대표적인 오류들을 살펴봅시다. JavaScript에서는 런타임에야 발견되는 이 오류들이, TypeScript에서는 코드를 작성하는 순간 빨간 밑줄로 표시됩니다.",
      code: {
        language: "typescript",
        code:
          "// 1. 오타 감지\n" +
          "interface Config {\n" +
          "  host: string;\n" +
          "  port: number;\n" +
          "  debug: boolean;\n" +
          "}\n" +
          "\n" +
          "const config: Config = {\n" +
          '  host: "localhost",\n' +
          "  port: 3000,\n" +
          '  debg: true, // ❌ 컴파일 에러: "debg"는 Config에 없습니다. "debug"를 의미하셨나요?\n' +
          "};\n" +
          "\n" +
          "// 2. 잘못된 타입 전달 감지\n" +
          "function add(a: number, b: number): number {\n" +
          "  return a + b;\n" +
          "}\n" +
          "\n" +
          'add(1, "2"); // ❌ 컴파일 에러: string은 number에 할당할 수 없습니다\n' +
          "\n" +
          "// 3. 존재하지 않는 프로퍼티 접근 감지\n" +
          "interface Product {\n" +
          "  name: string;\n" +
          "  price: number;\n" +
          "}\n" +
          "\n" +
          'const product: Product = { name: "노트북", price: 1500000 };\n' +
          "console.log(product.pricee); // ❌ 컴파일 에러: 'pricee'는 Product에 없습니다\n" +
          "\n" +
          "// 4. null/undefined 안전성\n" +
          "function getLength(str: string | null): number {\n" +
          "  // return str.length; // ❌ str이 null일 수 있습니다\n" +
          "  return str?.length ?? 0; // ✅ 안전한 접근\n" +
          "}",
        description:
          "TypeScript는 오타, 타입 불일치, 존재하지 않는 프로퍼티 접근, null 안전성 등을 컴파일 타임에 감지합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 특성 | JavaScript | TypeScript |\n" +
        "|------|-----------|------------|\n" +
        "| 타입 시스템 | 동적 (런타임) | 정적 (컴파일 타임) |\n" +
        "| 에러 감지 시점 | 런타임 | 컴파일 타임 |\n" +
        "| 타입 표기 | 없음 | 있음 (선택적) |\n" +
        "| 실행 환경 | 브라우저/Node.js 직접 실행 | tsc로 JS 변환 후 실행 |\n" +
        "| IDE 지원 | 제한적 | 강력한 자동완성/리팩터링 |\n" +
        "| 런타임 성능 | 기준 | 동일 (타입 소거) |\n\n" +
        "**핵심:** TypeScript는 JavaScript에 정적 타입을 추가한 superset입니다. 컴파일 시 타입을 검사하고, 런타임에는 모든 타입이 지워져 순수 JavaScript만 남습니다. 타입 소거 덕분에 런타임 성능에 영향이 없습니다.\n\n" +
        "**다음 챕터 미리보기:** TypeScript의 기본 타입들(string, number, boolean, any, unknown, never 등)을 하나씩 살펴보며, 각 타입의 용도와 차이를 이해합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "TypeScript는 JavaScript에 정적 타입을 추가한 superset이다. 컴파일 시 타입을 검사하고, 런타임에는 모든 타입이 지워져 순수 JavaScript만 남는다.",
  checklist: [
    "TypeScript가 JavaScript의 superset임을 설명할 수 있다",
    "타입 소거(Type Erasure)의 개념과 의미를 이해한다",
    "tsc 컴파일러의 역할을 설명할 수 있다",
    "TypeScript가 해결하는 핵심 문제 3가지를 나열할 수 있다",
    "컴파일 타임 에러와 런타임 에러의 차이를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "TypeScript의 타입 정보는 런타임에 어떻게 되는가?",
      choices: [
        "모두 제거된다 (타입 소거)",
        "메타데이터로 보존된다",
        "주석으로 변환된다",
        "별도 파일에 저장된다",
      ],
      correctIndex: 0,
      explanation:
        "TypeScript는 타입 소거(Type Erasure)를 수행합니다. 컴파일 후 생성되는 JavaScript에는 타입 정보가 전혀 포함되지 않으며, 런타임에는 순수 JavaScript만 실행됩니다.",
    },
    {
      id: "q2",
      question:
        "다음 중 TypeScript가 컴파일 타임에 감지할 수 있는 오류가 아닌 것은?",
      choices: [
        "존재하지 않는 프로퍼티 접근",
        "함수에 잘못된 타입의 인자 전달",
        "API 서버의 응답 지연",
        "변수명 오타",
      ],
      correctIndex: 2,
      explanation:
        "API 서버의 응답 지연은 런타임에서만 발생하는 네트워크 이슈입니다. TypeScript는 정적 분석으로 코드의 타입 오류를 감지하지만, 런타임 동작은 예측할 수 없습니다.",
    },
    {
      id: "q3",
      question: "TypeScript와 JavaScript의 관계로 가장 정확한 설명은?",
      choices: [
        "TypeScript는 JavaScript를 완전히 대체한다",
        "TypeScript는 JavaScript의 superset이다",
        "TypeScript는 JavaScript와 별개의 언어이다",
        "TypeScript는 JavaScript의 subset이다",
      ],
      correctIndex: 1,
      explanation:
        "TypeScript는 JavaScript의 superset입니다. 모든 유효한 JavaScript 코드는 유효한 TypeScript 코드이기도 합니다. TypeScript는 여기에 타입 시스템을 추가한 것입니다.",
    },
    {
      id: "q4",
      question: "TypeScript 사용 시 런타임 성능에 미치는 영향은?",
      choices: [
        "타입 검사로 인해 약간 느려진다",
        "타입 최적화로 더 빨라진다",
        "영향이 없다 (타입 소거)",
        "메모리 사용량만 증가한다",
      ],
      correctIndex: 2,
      explanation:
        "타입 소거(Type Erasure) 덕분에 컴파일 결과물은 순수 JavaScript입니다. 런타임에 타입 관련 코드가 전혀 없으므로 성능 영향이 없습니다.",
    },
    {
      id: "q5",
      question:
        "기존 JavaScript 프로젝트에 TypeScript를 도입하는 방법으로 올바른 것은?",
      choices: [
        "모든 .js 파일을 한 번에 .ts로 변환해야 한다",
        "처음부터 프로젝트를 새로 시작해야 한다",
        ".ts 파일을 하나씩 추가하며 점진적으로 도입할 수 있다",
        "별도의 TypeScript 전용 프로젝트를 만들어 연동해야 한다",
      ],
      correctIndex: 2,
      explanation:
        "TypeScript는 점진적 도입이 가능합니다. .js 파일과 .ts 파일이 같은 프로젝트에 공존할 수 있으며, strict 옵션도 단계적으로 활성화할 수 있습니다.",
    },
  ],
};

export default chapter;
