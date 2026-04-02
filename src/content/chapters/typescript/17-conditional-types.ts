import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "17-conditional-types",
  subject: "typescript",
  title: "Conditional Types",
  description: "T extends U ? X : Y 문법, 분배 조건부 타입의 동작 원리, NonNullable/Extract/Exclude의 내부 구현, 중첩 조건부 타입, API 응답 타입 분기 등 실무 활용을 학습합니다.",
  order: 17,
  group: "고급 타입",
  prerequisites: ["16-mapped-types"],
  estimatedMinutes: 35,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Conditional Types는 **우체국의 자동 분류기**와 같습니다.\n\n" +
        "우체국에서 편지가 들어오면 자동 분류기가 우편번호를 읽고, " +
        "'서울이면 A통, 부산이면 B통'으로 분류합니다. " +
        "`T extends U ? X : Y`는 정확히 이 로직입니다. " +
        "'T가 U에 할당 가능하면 X 타입, 아니면 Y 타입'으로 결정합니다.\n\n" +
        "여기서 정말 흥미로운 것은 **분배 동작**입니다. " +
        "만약 편지가 한 묶음(유니온)으로 들어오면, 분류기는 묶음을 풀어서 **각 편지를 개별적으로 분류**한 다음 " +
        "결과를 다시 모읍니다. `string | number`가 들어오면 `string`과 `number`를 각각 판단하여 " +
        "결과를 유니온으로 합칩니다.\n\n" +
        "이 자동 분류 능력 덕분에 TypeScript는 타입 레벨에서 if-else, switch 같은 분기 로직을 수행합니다. " +
        "Exclude, Extract, NonNullable 등의 유틸리티 타입이 모두 이 분류기를 활용한 것입니다. " +
        "분류기에 `never`(빈 편지)를 반환하면 해당 편지는 결과에서 사라집니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "타입 레벨에서 조건 분기가 필요한 상황을 살펴봅시다.\n\n" +
        "```typescript\n" +
        "// 문제 1: 입력 타입에 따라 다른 반환 타입\n" +
        "function process(input: string | number) {\n" +
        "  if (typeof input === 'string') return input.toUpperCase();\n" +
        "  return input * 2;\n" +
        "}\n" +
        "// 반환 타입: string | number — 정보 손실!\n" +
        "// 실제로는 string 넣으면 string, number 넣으면 number\n" +
        "```\n\n" +
        "```typescript\n" +
        "// 문제 2: 유니온에서 특정 타입만 걸러내기\n" +
        "type Mixed = string | number | boolean | null | undefined;\n" +
        "// null과 undefined만 제거하고 싶다면?\n" +
        "// string | number | boolean만 남기려면?\n" +
        "```\n\n" +
        "```typescript\n" +
        "// 문제 3: API 응답이 요청 타입에 따라 다름\n" +
        "type Response = ???; // GET이면 데이터 배열, POST면 단일 객체\n" +
        "```\n\n" +
        "이 문제들은 모두 '타입 A이면 결과 X, 타입 B이면 결과 Y'라는 조건 분기가 필요합니다. " +
        "런타임의 if-else는 있지만, 타입 레벨에서 이 분기를 표현하려면 Conditional Types가 필요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 기본 문법: T extends U ? X : Y\n" +
        "삼항 연산자와 동일한 구조입니다. T가 U에 할당 가능하면(extends) X 타입, 아니면 Y 타입이 됩니다. " +
        "여기서 `extends`는 '상속'이 아니라 '할당 가능성 검사'입니다.\n\n" +
        "### 분배 조건부 타입 (Distributive Conditional Types)\n" +
        "T가 naked type parameter(감싸지지 않은 타입 변수)이고 유니온이 전달되면, " +
        "유니온의 각 멤버에 **개별적으로** 조건이 적용됩니다.\n" +
        "`MyType<string | number>`는 `MyType<string> | MyType<number>`와 같습니다.\n\n" +
        "이 분배 동작 때문에:\n" +
        "- `Exclude<T, U>` = `T extends U ? never : T` — U에 해당하면 제거\n" +
        "- `Extract<T, U>` = `T extends U ? T : never` — U에 해당하면 추출\n" +
        "- `NonNullable<T>` = `T extends null | undefined ? never : T` — null/undefined 제거\n\n" +
        "### 분배 방지\n" +
        "분배를 원하지 않으면 T를 `[T]`로 감쌉니다: `[T] extends [U] ? X : Y`\n\n" +
        "### 중첩 조건부 타입\n" +
        "여러 조건을 연속으로 검사할 수 있습니다:\n" +
        "`T extends string ? A : T extends number ? B : C`\n" +
        "이는 if-else if-else 체인과 동일합니다.\n\n" +
        "### 실무 활용\n" +
        "함수 오버로드 대신 조건부 타입을 사용하면, 입력 타입에 따라 반환 타입이 자동으로 결정되는 " +
        "유연한 시그니처를 만들 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 조건부 타입의 분배 동작",
      content:
        "Conditional Types의 핵심인 분배 동작과 주요 유틸리티 타입의 내부 구현을 분석합니다.",
      code: {
        language: "typescript",
        code:
          '// ===== 기본 Conditional Type =====\n' +
          'type IsString<T> = T extends string ? true : false;\n' +
          '\n' +
          'type A = IsString<string>;    // true\n' +
          'type B = IsString<number>;    // false\n' +
          'type C = IsString<"hello">;   // true ("hello"는 string에 할당 가능)\n' +
          '\n' +
          '// ===== 분배 조건부 타입 =====\n' +
          '// 유니온이 전달되면 각 멤버에 개별 적용\n' +
          'type D = IsString<string | number>;\n' +
          '// = IsString<string> | IsString<number>\n' +
          '// = true | false\n' +
          '// = boolean\n' +
          '\n' +
          '// ===== Exclude 내부 구현 =====\n' +
          'type MyExclude<T, U> = T extends U ? never : T;\n' +
          '\n' +
          '// 분배 동작 추적:\n' +
          'type E = MyExclude<"a" | "b" | "c", "a" | "c">;\n' +
          '// = ("a" extends "a" | "c" ? never : "a")  → never\n' +
          '// | ("b" extends "a" | "c" ? never : "b")  → "b"\n' +
          '// | ("c" extends "a" | "c" ? never : "c")  → never\n' +
          '// = never | "b" | never\n' +
          '// = "b"\n' +
          '\n' +
          '// ===== Extract 내부 구현 =====\n' +
          'type MyExtract<T, U> = T extends U ? T : never;\n' +
          '\n' +
          'type F = MyExtract<string | number | boolean, string | boolean>;\n' +
          '// = string | boolean (number는 제외)\n' +
          '\n' +
          '// ===== NonNullable 내부 구현 =====\n' +
          'type MyNonNullable<T> = T extends null | undefined ? never : T;\n' +
          '\n' +
          'type G = MyNonNullable<string | null | undefined>;\n' +
          '// = string\n' +
          '\n' +
          '// ===== 분배 방지: 튜플로 감싸기 =====\n' +
          'type IsStringUnion<T> = [T] extends [string] ? true : false;\n' +
          '\n' +
          'type H = IsStringUnion<string | number>;\n' +
          '// = [string | number] extends [string] ? true : false\n' +
          '// = false (분배되지 않음! 전체로 판단)\n' +
          '\n' +
          '// ===== 중첩 조건부 타입 =====\n' +
          'type TypeName<T> =\n' +
          '  T extends string ? "string" :\n' +
          '  T extends number ? "number" :\n' +
          '  T extends boolean ? "boolean" :\n' +
          '  T extends Function ? "function" :\n' +
          '  "object";\n' +
          '\n' +
          'type T1 = TypeName<string>;     // "string"\n' +
          'type T2 = TypeName<() => void>; // "function"\n' +
          'type T3 = TypeName<string[]>;   // "object"',
        description: "분배 조건부 타입은 유니온의 각 멤버에 개별적으로 조건을 적용하고 결과를 다시 유니온으로 합칩니다. never를 반환하면 해당 멤버가 제거됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 조건부 타입 실전 활용",
      content:
        "함수 반환 타입 분기, API 응답 타입, 그리고 타입 레벨 유틸리티를 Conditional Types로 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// ===== 1. 입력에 따른 반환 타입 분기 =====\n' +
          'type ProcessResult<T> = T extends string ? string : number;\n' +
          '\n' +
          'function process<T extends string | number>(\n' +
          '  input: T\n' +
          '): ProcessResult<T> {\n' +
          '  if (typeof input === "string") {\n' +
          '    return input.toUpperCase() as ProcessResult<T>;\n' +
          '  }\n' +
          '  return (input * 2) as ProcessResult<T>;\n' +
          '}\n' +
          '\n' +
          'const r1 = process("hello"); // string\n' +
          'const r2 = process(42);       // number\n' +
          '\n' +
          '// ===== 2. API 응답 타입 분기 =====\n' +
          'type Method = "GET" | "POST" | "PUT" | "DELETE";\n' +
          '\n' +
          'type ApiResponse<M extends Method, T> =\n' +
          '  M extends "GET" ? { data: T[]; total: number } :\n' +
          '  M extends "POST" ? { data: T; created: true } :\n' +
          '  M extends "PUT" ? { data: T; updated: true } :\n' +
          '  M extends "DELETE" ? { success: boolean } :\n' +
          '  never;\n' +
          '\n' +
          'interface User {\n' +
          '  id: number;\n' +
          '  name: string;\n' +
          '}\n' +
          '\n' +
          'type GetUsersResponse = ApiResponse<"GET", User>;\n' +
          '// { data: User[]; total: number }\n' +
          '\n' +
          'type CreateUserResponse = ApiResponse<"POST", User>;\n' +
          '// { data: User; created: true }\n' +
          '\n' +
          '// ===== 3. 프로퍼티 타입별 추출 =====\n' +
          'type ExtractByType<T, V> = {\n' +
          '  [K in keyof T as T[K] extends V ? K : never]: T[K];\n' +
          '};\n' +
          '\n' +
          'interface Mixed {\n' +
          '  id: number;\n' +
          '  name: string;\n' +
          '  email: string;\n' +
          '  age: number;\n' +
          '  active: boolean;\n' +
          '}\n' +
          '\n' +
          'type StringFields = ExtractByType<Mixed, string>;\n' +
          '// { name: string; email: string }\n' +
          '\n' +
          'type NumberFields = ExtractByType<Mixed, number>;\n' +
          '// { id: number; age: number }\n' +
          '\n' +
          '// ===== 4. Flatten: 배열이면 요소 타입, 아니면 그대로 =====\n' +
          'type Flatten<T> = T extends (infer U)[] ? U : T;\n' +
          '\n' +
          'type A = Flatten<string[]>;   // string\n' +
          'type B = Flatten<number>;     // number\n' +
          'type C = Flatten<string[][]>; // string[] (한 겹만 벗김)\n' +
          '\n' +
          '// ===== 5. 재귀: 깊은 Flatten =====\n' +
          'type DeepFlatten<T> = T extends (infer U)[] ? DeepFlatten<U> : T;\n' +
          '\n' +
          'type D = DeepFlatten<string[][][]>; // string',
        description: "Conditional Types로 입력 타입에 따른 반환 타입 분기, Mapped Types와 조합한 프로퍼티 필터링, 배열 언래핑 등을 구현할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**Conditional Types = 타입 레벨의 if-else**\n\n" +
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| 기본 문법 | `T extends U ? X : Y` — 할당 가능하면 X, 아니면 Y |\n" +
        "| 분배 동작 | 유니온의 각 멤버에 개별 적용 후 결과를 유니온으로 합침 |\n" +
        "| never 활용 | 조건에서 never를 반환하면 유니온에서 해당 멤버 제거 |\n" +
        "| 분배 방지 | `[T] extends [U]`로 감싸면 분배되지 않음 |\n" +
        "| 중첩 조건 | if-else if-else 체인처럼 여러 조건 연속 검사 |\n\n" +
        "**유틸리티 타입과의 관계:**\n" +
        "- Exclude = `T extends U ? never : T`\n" +
        "- Extract = `T extends U ? T : never`\n" +
        "- NonNullable = `T extends null | undefined ? never : T`\n\n" +
        "분배 조건부 타입은 TypeScript 타입 시스템의 가장 강력한 기능 중 하나입니다. " +
        "유니온 타입을 자동으로 분해하여 각 멤버에 로직을 적용하므로, " +
        "타입 레벨의 필터링, 변환, 분기가 모두 가능합니다.\n\n" +
        "다음 챕터에서는 **Template Literal Types**를 다룹니다. " +
        "문자열 리터럴 타입을 프로그래밍적으로 조합하고 분해하는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Conditional Types는 타입 레벨의 if-else다. T extends U ? X : Y 형태로, 입력 타입에 따라 다른 출력 타입을 결정한다. 유니온 타입에 적용하면 각 멤버에 개별적으로 분배되어 적용된다.",
  checklist: [
    "T extends U ? X : Y 문법의 의미와 동작을 설명할 수 있다",
    "분배 조건부 타입이 유니온에서 어떻게 각 멤버에 개별 적용되는지 설명할 수 있다",
    "Exclude, Extract, NonNullable의 내부 구현을 Conditional Type으로 작성할 수 있다",
    "분배를 방지하기 위해 [T] extends [U] 패턴을 사용할 수 있다",
    "중첩 조건부 타입으로 여러 조건을 연쇄적으로 검사할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "T extends U ? X : Y에서 extends의 의미는?",
      choices: [
        "T가 U를 상속한다",
        "T가 U에 할당 가능한지 검사한다",
        "T와 U가 동일한 타입인지 검사한다",
        "T가 U의 서브클래스인지 검사한다",
      ],
      correctIndex: 1,
      explanation: "Conditional Types에서 extends는 '할당 가능성(assignability)' 검사입니다. T가 U에 할당 가능하면 ? 뒤의 X 타입, 아니면 : 뒤의 Y 타입이 됩니다. 클래스 상속과는 다른 개념입니다.",
    },
    {
      id: "q2",
      question: "MyType<string | number>에서 분배 조건부 타입이 동작하려면?",
      choices: [
        "T가 유니온 타입이면 항상 분배된다",
        "T가 naked type parameter(감싸지지 않은 타입 변수)여야 한다",
        "extends 뒤에 유니온이 있어야 한다",
        "결과가 never가 아니어야 한다",
      ],
      correctIndex: 1,
      explanation: "분배 조건부 타입은 T가 naked type parameter(다른 타입으로 감싸지지 않은 타입 변수)일 때만 동작합니다. [T] extends [U]처럼 감싸면 분배되지 않습니다.",
    },
    {
      id: "q3",
      question: "type X = Exclude<'a' | 'b' | 'c', 'b'>의 결과는?",
      choices: [
        "'b'",
        "'a' | 'c'",
        "'a' | 'b' | 'c'",
        "never",
      ],
      correctIndex: 1,
      explanation: "Exclude<T, U>는 T에서 U에 할당 가능한 타입을 제거합니다. 'a'는 'b'에 할당 불가 → 유지, 'b'는 'b'에 할당 가능 → 제거, 'c'는 'b'에 할당 불가 → 유지. 결과는 'a' | 'c'입니다.",
    },
    {
      id: "q4",
      question: "분배 조건부 타입에서 never를 반환하면 어떤 효과가 있는가?",
      choices: [
        "컴파일 에러가 발생한다",
        "해당 유니온 멤버가 결과에서 제거된다",
        "undefined가 된다",
        "전체 결과가 never가 된다",
      ],
      correctIndex: 1,
      explanation: "유니온에서 never는 빈 집합이므로, 유니온 결합 시 사라집니다. string | never = string이 됩니다. 이 성질을 이용하여 Exclude, Extract 등이 유니온 멤버를 필터링합니다.",
    },
    {
      id: "q5",
      question: "다음 타입의 결과는?\n```typescript\ntype Flatten<T> = T extends (infer U)[] ? U : T;\ntype R = Flatten<string[]>;\n```",
      choices: [
        "string[]",
        "string",
        "(infer U)[]",
        "never",
      ],
      correctIndex: 1,
      explanation: "Flatten은 T가 배열이면 요소 타입 U를 추출하고, 아니면 T를 그대로 반환합니다. string[]는 배열이므로 infer U에 의해 U = string이 추출되어 결과는 string입니다.",
    },
  ],
};

export default chapter;
