import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "10-type-assertions",
  subject: "typescript",
  title: "타입 단언과 가드",
  description:
    "as 키워드, 비null 단언, const 단언, satisfies 연산자를 이해하고, 타입 단언의 위험성과 최소화 전략을 익힙니다.",
  order: 10,
  group: "타입 좁히기",
  prerequisites: ["09-discriminated-unions"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "타입 단언과 타입 가드는 **공항 보안 검색**에 비유할 수 있습니다.\n\n" +
        "**타입 가드**는 실제로 X-ray 기계를 통과시키는 것입니다. 가방 안에 뭐가 있는지 실제로 확인한 후에야 '이것은 안전한 물건'이라고 판단합니다. 런타임 검사가 뒷받침됩니다.\n\n" +
        "**타입 단언(as)**은 VIP 패스를 보여주며 '나는 안전하니 검사를 건너뛰겠다'고 말하는 것입니다. 대부분은 정말 안전하지만, 가끔 위험한 물건이 통과할 수 있습니다.\n\n" +
        "**이중 단언(as unknown as T)**은 신분증을 두 번 바꾸는 것과 같습니다. 더 위험하지만, 극히 드문 상황에서 필요합니다.\n\n" +
        "**satisfies**는 보안 검사를 통과하되, 자신의 VIP 신분은 유지하는 것입니다. 타입을 검증하면서도 추론된 구체적 타입을 잃지 않습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "타입 좁히기로 대부분의 상황을 해결할 수 있지만, 다음과 같은 경우에는 개발자가 컴파일러보다 타입을 더 잘 알 때가 있습니다:\n\n" +
        "- **DOM 요소 접근**: `document.getElementById()`는 `HTMLElement | null`을 반환하지만, 해당 요소가 확실히 존재하는 경우\n" +
        "- **외부 데이터**: API 응답의 구조를 개발자는 알지만 TypeScript는 모르는 경우\n" +
        "- **라이브러리 타입 한계**: 라이브러리의 타입 정의가 불완전한 경우\n\n" +
        "이때 `as` 단언을 남용하면 TypeScript의 안전망을 무력화하는 셈입니다. 실제 런타임 값이 단언한 타입과 다르면 예상치 못한 에러가 발생합니다.\n\n" +
        "또한 `as const`로 리터럴 타입을 유지하거나, `satisfies`로 타입을 검증하면서 추론을 보존하는 등 단언 외의 도구도 알아야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### as 키워드 (타입 단언)\n" +
        "TypeScript에게 '이 값의 타입은 내가 더 잘 안다'고 알려줍니다. 상위/하위 타입 관계가 있어야 단언이 가능합니다.\n\n" +
        "### 이중 단언 (as unknown as T)\n" +
        "직접 단언이 안 되는 경우 `unknown`을 경유하는 방법입니다. 거의 모든 타입 안전성을 포기하므로 최후의 수단으로만 사용합니다.\n\n" +
        "### 비null 단언 (!)\n" +
        "값이 null/undefined가 아님을 선언합니다. Optional chaining(?.)과 함께 사용하면 위험할 수 있습니다.\n\n" +
        "### as const (const 단언)\n" +
        "값을 가장 좁은 리터럴 타입으로 추론합니다. 배열은 readonly 튜플이 되고, 객체의 모든 프로퍼티는 readonly 리터럴이 됩니다.\n\n" +
        "### satisfies 연산자 (TS 4.9+)\n" +
        "타입을 검증하면서도 추론된 구체적 타입을 유지합니다. 타입 단언 없이 타입 호환성을 확인하는 가장 안전한 방법입니다.\n\n" +
        "### 원칙: 단언보다 가드 우선\n" +
        "가능하면 런타임 검사(타입 가드)를 사용하고, 불가피할 때만 단언을 사용하세요.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 다양한 단언 패턴",
      content:
        "각 단언 방식의 동작과 주의사항을 코드로 확인합니다. 특히 as와 satisfies의 차이, const 단언의 효과를 비교해봅시다.",
      code: {
        language: "typescript",
        code:
          "// === as 단언: 개발자가 타입을 확신할 때 ===\n" +
          "const input = document.getElementById(\"myInput\");\n" +
          "// input의 타입: HTMLElement | null\n" +
          "const inputEl = input as HTMLInputElement;\n" +
          "// inputEl의 타입: HTMLInputElement (null 가능성 무시됨!)\n" +
          "\n" +
          "// === 비null 단언 (!) ===\n" +
          "const el = document.getElementById(\"app\")!;\n" +
          "// el의 타입: HTMLElement (null이 아님을 단언)\n" +
          "\n" +
          "// === 이중 단언: 최후의 수단 ===\n" +
          "const value = \"hello\" as unknown as number;\n" +
          "// 위험! 런타임에서 value는 여전히 string\n" +
          "\n" +
          "// === as const: 리터럴 타입 유지 ===\n" +
          "const colors = [\"red\", \"green\", \"blue\"] as const;\n" +
          "// 타입: readonly [\"red\", \"green\", \"blue\"]\n" +
          "// as const 없이: string[]\n" +
          "\n" +
          "const config = {\n" +
          "  api: \"https://api.example.com\",\n" +
          "  timeout: 5000,\n" +
          "} as const;\n" +
          "// config.api의 타입: \"https://api.example.com\" (리터럴)\n" +
          "// config.timeout의 타입: 5000 (리터럴)\n" +
          "\n" +
          "// === satisfies: 타입 검증 + 추론 유지 ===\n" +
          "type Color = \"red\" | \"green\" | \"blue\";\n" +
          "type ColorMap = Record<string, Color>;\n" +
          "\n" +
          "const palette = {\n" +
          "  primary: \"red\",\n" +
          "  secondary: \"blue\",\n" +
          "} satisfies ColorMap;\n" +
          "// palette.primary의 타입: \"red\" (리터럴 추론 유지!)\n" +
          "// ColorMap 호환성도 검증됨",
        description:
          "as는 타입을 덮어쓰고, as const는 리터럴로 좁히고, satisfies는 검증하면서 추론을 유지합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 단언 최소화 전략",
      content:
        "실무에서 타입 단언이 필요한 상황과, 이를 타입 가드나 satisfies로 대체하여 안전성을 높이는 리팩토링 패턴을 연습합니다.",
      code: {
        language: "typescript",
        code:
          "// === 안티패턴: as 남용 ===\n" +
          "interface User {\n" +
          "  id: number;\n" +
          "  name: string;\n" +
          "  email: string;\n" +
          "}\n" +
          "\n" +
          "// Bad: 런타임에 실제로 User인지 검증 안 됨\n" +
          "// const user = JSON.parse(response) as User;\n" +
          "\n" +
          "// === Good: 타입 가드로 런타임 검증 ===\n" +
          "function isUser(value: unknown): value is User {\n" +
          "  return (\n" +
          "    typeof value === \"object\" &&\n" +
          "    value !== null &&\n" +
          "    \"id\" in value &&\n" +
          "    \"name\" in value &&\n" +
          "    \"email\" in value &&\n" +
          "    typeof (value as User).id === \"number\" &&\n" +
          "    typeof (value as User).name === \"string\" &&\n" +
          "    typeof (value as User).email === \"string\"\n" +
          "  );\n" +
          "}\n" +
          "\n" +
          "function parseUser(json: string): User | null {\n" +
          "  const parsed: unknown = JSON.parse(json);\n" +
          "  return isUser(parsed) ? parsed : null;\n" +
          "}\n" +
          "\n" +
          "// === satisfies로 설정 객체 타입 안전하게 정의 ===\n" +
          "type Route = {\n" +
          "  path: string;\n" +
          "  method: \"GET\" | \"POST\" | \"PUT\" | \"DELETE\";\n" +
          "};\n" +
          "\n" +
          "// satisfies로 타입 검증 + 구체적 타입 유지\n" +
          "const routes = {\n" +
          "  getUsers: { path: \"/users\", method: \"GET\" },\n" +
          "  createUser: { path: \"/users\", method: \"POST\" },\n" +
          "} satisfies Record<string, Route>;\n" +
          "\n" +
          "// routes.getUsers.method의 타입: \"GET\" (리터럴 유지!)\n" +
          "// Record<string, Route>로 타이핑했다면: \"GET\" | \"POST\" | \"PUT\" | \"DELETE\"",
        description:
          "as 대신 타입 가드로 런타임 안전성을 확보하고, satisfies로 타입 검증과 추론을 동시에 달성합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 기법 | 안전성 | 용도 |\n" +
        "|------|--------|------|\n" +
        "| 타입 가드 | 높음 | 런타임 검사 기반 좁히기 |\n" +
        "| satisfies | 높음 | 타입 검증 + 추론 유지 |\n" +
        "| as const | 중간 | 리터럴 타입 유지 |\n" +
        "| as (단언) | 낮음 | 개발자가 타입을 확신할 때 |\n" +
        "| ! (비null) | 낮음 | null이 아님을 확신할 때 |\n" +
        "| as unknown as T | 매우 낮음 | 최후의 수단 |\n\n" +
        "**핵심:** 타입 안전성 우선순위는 타입 가드 > satisfies > as const > as > ! > 이중 단언입니다. 단언은 컴파일러의 검사를 우회하므로, 가능한 한 런타임 검증이 뒷받침되는 방법을 사용하세요.\n\n" +
        "**다음 챕터 미리보기:** '타입의 변수'인 제네릭을 배웁니다. 함수가 값을 매개변수로 받듯, 제네릭은 타입을 매개변수로 받아 재사용 가능하고 타입 안전한 코드를 만드는 방법을 익힙니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "타입 단언(as)은 개발자가 컴파일러보다 타입을 더 잘 알 때 사용하지만, 런타임 안전성을 보장하지 않는다. 가능하면 타입 가드로 런타임 검사를 하고, satisfies로 타입을 검증하면서 추론을 유지하라.",
  checklist: [
    "as 단언과 타입 가드의 차이를 설명할 수 있다",
    "이중 단언(as unknown as T)이 위험한 이유를 이해한다",
    "as const로 리터럴 타입과 readonly 튜플을 만들 수 있다",
    "satisfies 연산자의 동작 원리와 장점을 알고 있다",
    "타입 단언을 최소화하는 리팩토링 전략을 적용할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "다음 중 타입 단언(as)에 대한 설명으로 올바른 것은?",
      choices: [
        "런타임에 값을 실제로 변환한다",
        "컴파일러에게 타입 정보를 알려줄 뿐 런타임 영향은 없다",
        "항상 타입 가드보다 안전하다",
        "모든 타입 간 변환이 가능하다",
      ],
      correctIndex: 1,
      explanation:
        "타입 단언은 컴파일 타임에만 존재하며, 트랜스파일 후 JavaScript에서는 완전히 제거됩니다. 런타임에 값을 변환하지 않습니다.",
    },
    {
      id: "q2",
      question: "const arr = [1, 2, 3] as const;에서 arr의 타입은?",
      choices: [
        "number[]",
        "readonly number[]",
        "readonly [1, 2, 3]",
        "[number, number, number]",
      ],
      correctIndex: 2,
      explanation:
        "as const는 값을 가장 좁은 리터럴 타입으로 추론합니다. 배열은 readonly 튜플이 되어 각 요소가 리터럴 타입으로 고정됩니다.",
    },
    {
      id: "q3",
      question: "satisfies 연산자의 가장 큰 장점은?",
      choices: [
        "런타임 성능 향상",
        "타입 호환성 검증과 구체적 타입 추론을 동시에 달성",
        "모든 타입 단언을 대체 가능",
        "JavaScript와 호환",
      ],
      correctIndex: 1,
      explanation:
        "satisfies는 값이 특정 타입과 호환되는지 검증하면서도, 추론된 구체적 타입(리터럴 타입 등)을 유지합니다. 타입 어노테이션은 타입을 넓히지만 satisfies는 그렇지 않습니다.",
    },
    {
      id: "q4",
      question: "document.getElementById('app')!에서 !의 역할은?",
      choices: [
        "논리 NOT 연산자",
        "반환값이 null이 아님을 단언",
        "요소가 반드시 존재함을 런타임에 보장",
        "DOM 요소를 삭제",
      ],
      correctIndex: 1,
      explanation:
        "비null 단언 연산자(!)는 TypeScript에게 해당 값이 null이나 undefined가 아니라고 알려줍니다. 런타임 검사는 없으므로, 실제로 null이면 에러가 발생합니다.",
    },
    {
      id: "q5",
      question: "이중 단언(as unknown as T)이 필요한 경우는?",
      choices: [
        "항상 사용하는 것이 좋다",
        "직접 단언이 불가능한 타입 간 변환이 불가피할 때",
        "성능 최적화가 필요할 때",
        "제네릭을 사용할 수 없을 때",
      ],
      correctIndex: 1,
      explanation:
        "TypeScript는 관련 없는 타입 간 직접 단언을 허용하지 않습니다. 이중 단언은 unknown을 경유하여 이 제한을 우회하지만, 타입 안전성을 크게 훼손하므로 최후의 수단입니다.",
    },
  ],
};

export default chapter;
