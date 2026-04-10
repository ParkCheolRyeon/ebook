import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "15-utility-types",
  subject: "typescript",
  title: "유틸리티 타입",
  description: "Partial, Required, Readonly, Pick, Omit, Record, Exclude, Extract, NonNullable, ReturnType, Parameters, Awaited 등 내장 유틸리티 타입의 사용법과 내부 구현 원리를 학습합니다.",
  order: 15,
  group: "고급 타입",
  prerequisites: ["14-generic-inference"],
  estimatedMinutes: 35,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "유틸리티 타입은 **이미지 편집 필터**와 같습니다.\n\n" +
        "포토샵에서 원본 사진에 필터를 적용하면 원본은 그대로인 채 새로운 버전이 만들어집니다. " +
        "흑백 필터, 밝기 조절, 크롭 등 다양한 필터가 있고, 필터를 조합하면 더 복잡한 결과도 만들 수 있습니다.\n\n" +
        "`Partial<T>`는 '모든 색상을 반투명하게 만드는 필터'입니다. 모든 프로퍼티를 선택적(optional)으로 바꿉니다. " +
        "`Pick<T, K>`는 '원하는 영역만 잘라내는 크롭 도구'이고, " +
        "`Omit<T, K>`는 '특정 부분을 지우는 지우개'입니다.\n\n" +
        "`Record<K, V>`는 '빈 앨범에 라벨을 붙이고 같은 크기의 사진을 넣는 것'입니다. " +
        "키(라벨)와 값(사진 형식)을 지정하면 일관된 구조가 만들어집니다.\n\n" +
        "중요한 점은 이 필터들이 **조합 가능**하다는 것입니다. " +
        "`Partial<Pick<T, 'name' | 'age'>>`처럼 여러 유틸리티를 중첩하여 정확히 원하는 타입을 만들 수 있습니다. " +
        "그리고 각 필터의 내부 구현을 이해하면, 자신만의 커스텀 필터도 만들 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "실무에서 기존 타입을 약간 변형해서 사용해야 하는 경우가 매우 많습니다.\n\n" +
        "```typescript\n" +
        "interface User {\n" +
        "  id: number;\n" +
        "  name: string;\n" +
        "  email: string;\n" +
        "  age: number;\n" +
        "  createdAt: Date;\n" +
        "}\n" +
        "\n" +
        "// 업데이트: 일부 필드만 변경 — 모든 필드가 선택적이어야 함\n" +
        "function updateUser(id: number, data: ???) { ... }\n" +
        "\n" +
        "// 목록 표시: id, name, email만 필요\n" +
        "function displayUserList(users: ???[]) { ... }\n" +
        "\n" +
        "// 생성: id와 createdAt은 서버가 할당 — 이 필드 제외\n" +
        "function createUser(data: ???) { ... }\n" +
        "```\n\n" +
        "매번 새로운 인터페이스를 정의하면 원본과 동기화가 깨집니다.\n\n" +
        "```typescript\n" +
        "// User에 phone 필드를 추가하면 관련 타입도 모두 수정해야...\n" +
        "interface UserUpdate { name?: string; email?: string; ... }\n" +
        "interface UserListItem { id: number; name: string; ... }\n" +
        "interface UserCreate { name: string; email: string; ... }\n" +
        "```\n\n" +
        "유틸리티 타입은 원본 타입으로부터 자동으로 파생 타입을 만들어 이 문제를 해결합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 프로퍼티 수정자 유틸리티\n" +
        "- **Partial<T>**: 모든 프로퍼티를 선택적(?)으로. 내부: `{ [K in keyof T]?: T[K] }`\n" +
        "- **Required<T>**: 모든 프로퍼티를 필수로. 내부: `{ [K in keyof T]-?: T[K] }`\n" +
        "- **Readonly<T>**: 모든 프로퍼티를 읽기 전용으로. 내부: `{ readonly [K in keyof T]: T[K] }`\n\n" +
        "### 프로퍼티 선택/제거 유틸리티\n" +
        "- **Pick<T, K>**: K에 해당하는 프로퍼티만 선택. 내부: `{ [P in K]: T[P] }`\n" +
        "- **Omit<T, K>**: K에 해당하는 프로퍼티를 제거. 내부: `Pick<T, Exclude<keyof T, K>>`\n\n" +
        "### 구조 생성 유틸리티\n" +
        "- **Record<K, V>**: K를 키, V를 값으로 하는 객체 타입. 내부: `{ [P in K]: V }`\n\n" +
        "### 유니온 필터링 유틸리티\n" +
        "- **Exclude<T, U>**: T에서 U에 할당 가능한 타입을 제거\n" +
        "- **Extract<T, U>**: T에서 U에 할당 가능한 타입만 추출\n" +
        "- **NonNullable<T>**: T에서 null과 undefined를 제거\n\n" +
        "### 함수 관련 유틸리티\n" +
        "- **ReturnType<T>**: 함수 T의 반환 타입 추출\n" +
        "- **Parameters<T>**: 함수 T의 매개변수 타입을 튜플로 추출\n\n" +
        "### 비동기 유틸리티\n" +
        "- **Awaited<T>**: Promise를 재귀적으로 풀어 최종 resolve 타입 추출. `Awaited<Promise<Promise<string>>>` → `string`",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 유틸리티 타입의 내부 원리",
      content:
        "주요 유틸리티 타입의 내부 구현을 살펴보고, 어떻게 동작하는지 이해합시다.",
      code: {
        language: "typescript",
        code:
          '// ===== 내부 구현 살펴보기 =====\n' +
          '\n' +
          '// Partial<T> 구현\n' +
          'type MyPartial<T> = {\n' +
          '  [K in keyof T]?: T[K];\n' +
          '};\n' +
          '\n' +
          '// Required<T> 구현: -?로 선택적 수정자 제거\n' +
          'type MyRequired<T> = {\n' +
          '  [K in keyof T]-?: T[K];\n' +
          '};\n' +
          '\n' +
          '// Readonly<T> 구현\n' +
          'type MyReadonly<T> = {\n' +
          '  readonly [K in keyof T]: T[K];\n' +
          '};\n' +
          '\n' +
          '// Pick<T, K> 구현\n' +
          'type MyPick<T, K extends keyof T> = {\n' +
          '  [P in K]: T[P];\n' +
          '};\n' +
          '\n' +
          '// Record<K, V> 구현\n' +
          'type MyRecord<K extends keyof any, V> = {\n' +
          '  [P in K]: V;\n' +
          '};\n' +
          '\n' +
          '// Exclude<T, U> 구현: 분배 조건부 타입\n' +
          'type MyExclude<T, U> = T extends U ? never : T;\n' +
          '\n' +
          '// Extract<T, U> 구현\n' +
          'type MyExtract<T, U> = T extends U ? T : never;\n' +
          '\n' +
          '// NonNullable<T> 구현\n' +
          'type MyNonNullable<T> = T extends null | undefined ? never : T;\n' +
          '\n' +
          '// Omit<T, K> 구현: Pick + Exclude 조합\n' +
          'type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;\n' +
          '\n' +
          '// ReturnType<T> 구현: infer로 반환 타입 추출\n' +
          'type MyReturnType<T extends (...args: any) => any> =\n' +
          '  T extends (...args: any) => infer R ? R : any;\n' +
          '\n' +
          '// Parameters<T> 구현: infer로 매개변수 추출\n' +
          'type MyParameters<T extends (...args: any) => any> =\n' +
          '  T extends (...args: infer P) => any ? P : never;\n' +
          '\n' +
          '// ===== 검증 =====\n' +
          'interface User {\n' +
          '  id: number;\n' +
          '  name: string;\n' +
          '  email: string;\n' +
          '}\n' +
          '\n' +
          'type PartialUser = MyPartial<User>;\n' +
          '// { id?: number; name?: string; email?: string }\n' +
          '\n' +
          'type UserName = MyPick<User, "name" | "email">;\n' +
          '// { name: string; email: string }\n' +
          '\n' +
          'type WithoutEmail = MyOmit<User, "email">;\n' +
          '// { id: number; name: string }',
        description: "유틸리티 타입은 Mapped Types, Conditional Types, infer 키워드의 조합으로 구현됩니다. 내부 구현을 이해하면 커스텀 유틸리티 타입을 직접 만들 수 있습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 유틸리티 타입 실전 활용",
      content:
        "실무에서 유틸리티 타입을 조합하여 API, 폼, 상태 관리에 적용하는 패턴을 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// ===== 실전 1: API CRUD 타입 파생 =====\n' +
          'interface Product {\n' +
          '  id: number;\n' +
          '  name: string;\n' +
          '  price: number;\n' +
          '  description: string;\n' +
          '  createdAt: Date;\n' +
          '  updatedAt: Date;\n' +
          '}\n' +
          '\n' +
          '// 생성: 서버가 할당하는 필드 제외\n' +
          'type CreateProduct = Omit<Product, "id" | "createdAt" | "updatedAt">;\n' +
          '\n' +
          '// 업데이트: 모든 필드 선택적 (id 제외)\n' +
          'type UpdateProduct = Partial<Omit<Product, "id">>;\n' +
          '\n' +
          '// 목록: 필요한 필드만\n' +
          'type ProductListItem = Pick<Product, "id" | "name" | "price">;\n' +
          '\n' +
          '// 읽기 전용 상세\n' +
          'type ProductDetail = Readonly<Product>;\n' +
          '\n' +
          '// ===== 실전 2: Record로 매핑 =====\n' +
          'type Status = "pending" | "active" | "inactive";\n' +
          '\n' +
          'const statusLabels: Record<Status, string> = {\n' +
          '  pending: "대기중",\n' +
          '  active: "활성",\n' +
          '  inactive: "비활성",\n' +
          '};\n' +
          '\n' +
          'const statusColors: Record<Status, string> = {\n' +
          '  pending: "#FFA500",\n' +
          '  active: "#00FF00",\n' +
          '  inactive: "#FF0000",\n' +
          '};\n' +
          '\n' +
          '// ===== 실전 3: 유니온 필터링 =====\n' +
          'type Event = "click" | "scroll" | "keydown" | "keyup" | "focus";\n' +
          '\n' +
          'type KeyEvent = Extract<Event, "keydown" | "keyup">;\n' +
          '// "keydown" | "keyup"\n' +
          '\n' +
          'type NonKeyEvent = Exclude<Event, "keydown" | "keyup">;\n' +
          '// "click" | "scroll" | "focus"\n' +
          '\n' +
          '// ===== 실전 4: 함수 타입 추출 =====\n' +
          'function createUser(name: string, age: number): User {\n' +
          '  return { id: 1, name, age } as any;\n' +
          '}\n' +
          '\n' +
          'type CreateUserParams = Parameters<typeof createUser>;\n' +
          '// [string, number]\n' +
          '\n' +
          'type CreateUserReturn = ReturnType<typeof createUser>;\n' +
          '// User\n' +
          '\n' +
          '// ===== 실전 5: 유틸리티 조합으로 커스텀 타입 =====\n' +
          '// "일부 필드만 필수, 나머지는 선택적"\n' +
          'type RequireOnly<T, K extends keyof T> =\n' +
          '  Required<Pick<T, K>> & Partial<Omit<T, K>>;\n' +
          '\n' +
          'type FormData = RequireOnly<Product, "name" | "price">;\n' +
          '// name, price는 필수, 나머지는 선택적',
        description: "유틸리티 타입을 조합하면 원본 타입에서 자동으로 파생 타입을 만들 수 있어, 타입 간 동기화 문제를 해결합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**유틸리티 타입 = 기존 타입을 변환하는 내장 도구**\n\n" +
        "| 카테고리 | 유틸리티 | 핵심 동작 |\n" +
        "|----------|----------|----------|\n" +
        "| 수정자 | Partial, Required, Readonly | ?나 readonly를 추가/제거 |\n" +
        "| 선택 | Pick, Omit | 프로퍼티를 골라내거나 제외 |\n" +
        "| 구조 | Record | 키-값 매핑 타입 생성 |\n" +
        "| 필터 | Exclude, Extract, NonNullable | 유니온에서 타입 필터링 |\n" +
        "| 함수 | ReturnType, Parameters | 함수 시그니처에서 타입 추출 |\n" +
        "| 비동기 | Awaited | Promise의 resolve 타입 추출 |\n" +
        "| 클래스 | InstanceType, ConstructorParameters | 클래스에서 타입 추출 |\n" +
        "| 추론 제어 | NoInfer (TS 5.4+) | 타입 추론 방지 |\n\n" +
        "**참고:** `InstanceType<T>`는 생성자의 인스턴스 타입, `ConstructorParameters<T>`는 생성자의 매개변수 타입을 추출합니다. TypeScript 5.4+에서 추가된 `NoInfer<T>`는 특정 위치에서 타입 추론을 방지하여 더 정확한 타입 체크를 가능하게 합니다.\n\n" +
        "**핵심 원칙:** 새 인터페이스를 만들기 전에 유틸리티 타입으로 파생할 수 있는지 먼저 확인하세요. " +
        "원본 타입이 변경되면 파생 타입도 자동으로 반영됩니다.\n\n" +
        "다음 챕터에서는 유틸리티 타입의 기반 기술인 **Mapped Types**를 깊이 다룹니다. " +
        "`{ [K in keyof T]: ... }` 문법으로 직접 타입 변환기를 만드는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "유틸리티 타입은 기존 타입을 변환하는 내장 도구다. Partial은 모두 선택적으로, Pick/Omit은 프로퍼티를 선택/제거, Record는 키-값 매핑을 만든다. 내부 구현을 이해하면 커스텀 유틸리티도 만들 수 있다.",
  checklist: [
    "Partial, Required, Readonly의 차이와 사용 시점을 설명할 수 있다",
    "Pick과 Omit을 사용하여 기존 타입에서 필요한 프로퍼티만 선택하거나 제거할 수 있다",
    "Record<K, V>로 키-값 매핑 타입을 생성할 수 있다",
    "Exclude, Extract, NonNullable로 유니온 타입을 필터링할 수 있다",
    "ReturnType과 Parameters로 함수 시그니처에서 타입을 추출할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Partial<{ name: string; age: number }>의 결과 타입은?",
      choices: [
        "{ name: string; age: number }",
        "{ name?: string; age?: number }",
        "{ name: string | undefined; age: number | undefined }",
        "{}",
      ],
      correctIndex: 1,
      explanation: "Partial<T>는 T의 모든 프로퍼티에 ? 수정자를 추가하여 선택적으로 만듭니다. { name?: string; age?: number }가 됩니다.",
    },
    {
      id: "q2",
      question: "Omit<T, K>의 내부 구현 원리는?",
      choices: [
        "T에서 K를 직접 삭제한다",
        "Pick<T, Exclude<keyof T, K>>로 K를 제외한 나머지 키만 선택한다",
        "T & { [P in K]?: never }로 구현한다",
        "Partial<T>에서 K에 해당하는 것만 Required로 만든다",
      ],
      correctIndex: 1,
      explanation: "Omit<T, K>는 먼저 Exclude<keyof T, K>로 K를 제외한 키들을 구하고, Pick<T, ...>로 해당 키의 프로퍼티만 선택합니다. 두 유틸리티의 조합입니다.",
    },
    {
      id: "q3",
      question: "Record<'a' | 'b', number>의 결과 타입은?",
      choices: [
        "{ a: number } | { b: number }",
        "{ a: number; b: number }",
        "{ [key: string]: number }",
        "Map<string, number>",
      ],
      correctIndex: 1,
      explanation: "Record<K, V>는 K의 각 멤버를 키로, V를 값으로 하는 객체 타입을 만듭니다. Record<'a' | 'b', number>는 { a: number; b: number }가 됩니다.",
    },
    {
      id: "q4",
      question: "Exclude<'a' | 'b' | 'c', 'a' | 'c'>의 결과는?",
      choices: [
        "'a' | 'c'",
        "'b'",
        "'a' | 'b' | 'c'",
        "never",
      ],
      correctIndex: 1,
      explanation: "Exclude<T, U>는 T에서 U에 할당 가능한 타입을 제거합니다. 'a' | 'b' | 'c'에서 'a'와 'c'를 제거하면 'b'만 남습니다.",
    },
    {
      id: "q5",
      question: "다음 커스텀 유틸리티 타입의 결과는?\n```typescript\ntype RequireOnly<T, K extends keyof T> =\n  Required<Pick<T, K>> & Partial<Omit<T, K>>;\n\ntype R = RequireOnly<{ a?: string; b?: number; c?: boolean }, 'a'>;\n```",
      choices: [
        "{ a: string; b: number; c: boolean }",
        "{ a: string; b?: number; c?: boolean }",
        "{ a?: string; b?: number; c?: boolean }",
        "{ a: string }",
      ],
      correctIndex: 1,
      explanation: "RequireOnly는 K에 해당하는 프로퍼티만 필수로 만들고 나머지는 선택적으로 유지합니다. 'a'만 Required이므로 a: string(필수), b?: number, c?: boolean(선택적)이 됩니다.",
    },
  ],
};

export default chapter;
