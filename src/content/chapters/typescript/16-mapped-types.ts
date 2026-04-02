import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "16-mapped-types",
  subject: "typescript",
  title: "Mapped Types",
  description: "{ [K in keyof T]: NewType } 문법, 수정자(+/- readonly, +/- ?), Key Remapping(as), 유틸리티 타입의 Mapped Type 구현 원리, 커스텀 Mapped Type 만들기, form validation과 API response wrapper 등 실무 활용을 학습합니다.",
  order: 16,
  group: "고급 타입",
  prerequisites: ["15-utility-types"],
  estimatedMinutes: 35,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Mapped Types는 **엑셀의 수식 복사**와 같습니다.\n\n" +
        "엑셀에서 A열의 각 셀에 수식을 적용하면 B열에 변환된 결과가 자동으로 채워지듯, " +
        "Mapped Types는 기존 타입의 **각 프로퍼티를 하나씩 순회하며** 새로운 타입으로 변환합니다.\n\n" +
        "`{ [K in keyof T]: T[K] }`는 '원본 타입 T의 모든 키 K를 하나씩 꺼내서, " +
        "각 키에 대한 값을 T[K]로 설정하라'는 뜻입니다. 이것만으로는 원본과 동일하지만, " +
        "여기에 변환 로직을 추가하면 강력해집니다.\n\n" +
        "수정자(modifier)는 **서식 일괄 변경**입니다. `?`를 추가하면 모든 셀을 '선택 입력'으로, " +
        "`readonly`를 추가하면 모든 셀을 '수정 불가'로 만듭니다. " +
        "`-?`는 '선택 입력을 필수 입력으로 되돌리기'입니다.\n\n" +
        "Key Remapping(as)은 **열 이름 바꾸기**입니다. " +
        "`as `on${Capitalize<K>}`는 'name'을 'onName'으로 변환하듯, " +
        "키 자체를 프로그래밍적으로 변환할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "유틸리티 타입(Partial, Readonly 등)의 동작 원리를 이해하지 못하면 커스텀 타입 변환을 만들 수 없습니다.\n\n" +
        "```typescript\n" +
        "// 문제 1: 모든 프로퍼티를 Promise로 감싸고 싶다\n" +
        "interface SyncData {\n" +
        "  users: User[];\n" +
        "  posts: Post[];\n" +
        "  comments: Comment[];\n" +
        "}\n" +
        "// { users: Promise<User[]>; posts: Promise<Post[]>; ... }\n" +
        "// 어떻게 자동으로 만들 수 있을까?\n" +
        "```\n\n" +
        "```typescript\n" +
        "// 문제 2: form validation 타입 — 각 필드에 에러 메시지를 매핑\n" +
        "interface LoginForm {\n" +
        "  email: string;\n" +
        "  password: string;\n" +
        "}\n" +
        "// { email: string | null; password: string | null } 자동 생성?\n" +
        "```\n\n" +
        "```typescript\n" +
        "// 문제 3: 이벤트 핸들러 맵 — 각 프로퍼티명에 on을 붙이기\n" +
        "interface Events {\n" +
        "  click: MouseEvent;\n" +
        "  keydown: KeyboardEvent;\n" +
        "}\n" +
        "// { onClick: (e: MouseEvent) => void; onKeydown: ... } 자동 생성?\n" +
        "```\n\n" +
        "이 모든 문제는 '기존 타입의 각 프로퍼티를 규칙에 따라 변환'하는 것으로, " +
        "Mapped Types가 정확히 이 역할을 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 기본 문법: { [K in keyof T]: NewType }\n" +
        "`keyof T`로 T의 모든 키를 유니온으로 추출하고, `in` 키워드로 각 키를 순회합니다. " +
        "각 키 K에 대해 새로운 값 타입을 지정하면 변환된 타입이 만들어집니다.\n\n" +
        "### 수정자(Modifier): +/- readonly, +/- ?\n" +
        "- `readonly` 추가: `{ readonly [K in keyof T]: T[K] }` → Readonly<T>\n" +
        "- `?` 추가: `{ [K in keyof T]?: T[K] }` → Partial<T>\n" +
        "- `-readonly` 제거: `{ -readonly [K in keyof T]: T[K] }` → mutable로 변환\n" +
        "- `-?` 제거: `{ [K in keyof T]-?: T[K] }` → Required<T>\n\n" +
        "### Key Remapping (as)\n" +
        "TypeScript 4.1에서 도입된 기능으로, `as` 절을 사용하여 키를 변환할 수 있습니다.\n" +
        "`{ [K in keyof T as NewKey]: T[K] }` 형태로, " +
        "키를 다른 문자열로 변환하거나, 조건에 따라 키를 필터링(`never`로 제외)할 수 있습니다.\n\n" +
        "### 유틸리티 타입의 Mapped Type 구현\n" +
        "Partial, Required, Readonly, Pick 등은 모두 Mapped Types로 구현되어 있습니다. " +
        "이 원리를 이해하면 프로젝트에 맞는 커스텀 유틸리티를 자유롭게 만들 수 있습니다.\n\n" +
        "### 실무 적용\n" +
        "form validation 타입, API response wrapper, getter/setter 자동 생성, " +
        "이벤트 핸들러 맵 등 반복적인 타입 패턴을 Mapped Types로 자동화할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Mapped Types의 동작 원리",
      content:
        "Mapped Types의 기본 문법부터 수정자, Key Remapping까지 단계별로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// ===== 기본 Mapped Type =====\n' +
          'interface User {\n' +
          '  id: number;\n' +
          '  name: string;\n' +
          '  email: string;\n' +
          '}\n' +
          '\n' +
          '// 각 프로퍼티를 순회하며 값 타입을 변환\n' +
          'type Nullable<T> = {\n' +
          '  [K in keyof T]: T[K] | null;\n' +
          '};\n' +
          '\n' +
          'type NullableUser = Nullable<User>;\n' +
          '// { id: number | null; name: string | null; email: string | null }\n' +
          '\n' +
          '// ===== 수정자 활용 =====\n' +
          '// Partial 직접 구현\n' +
          'type MyPartial<T> = {\n' +
          '  [K in keyof T]?: T[K];  // ? 추가\n' +
          '};\n' +
          '\n' +
          '// Required 직접 구현\n' +
          'type MyRequired<T> = {\n' +
          '  [K in keyof T]-?: T[K]; // -? 로 선택적 제거\n' +
          '};\n' +
          '\n' +
          '// Mutable: readonly 제거\n' +
          'type Mutable<T> = {\n' +
          '  -readonly [K in keyof T]: T[K];\n' +
          '};\n' +
          '\n' +
          'type ReadonlyUser = Readonly<User>;\n' +
          '// { readonly id: number; readonly name: string; readonly email: string }\n' +
          '\n' +
          'type MutableUser = Mutable<ReadonlyUser>;\n' +
          '// { id: number; name: string; email: string } — readonly 제거됨\n' +
          '\n' +
          '// ===== Key Remapping (as) =====\n' +
          '// 키에 접두사 추가\n' +
          'type Getters<T> = {\n' +
          '  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];\n' +
          '};\n' +
          '\n' +
          'type UserGetters = Getters<User>;\n' +
          '// { getId: () => number; getName: () => string; getEmail: () => string }\n' +
          '\n' +
          '// 조건부 키 필터링: 특정 타입의 프로퍼티만 선택\n' +
          'type StringKeysOnly<T> = {\n' +
          '  [K in keyof T as T[K] extends string ? K : never]: T[K];\n' +
          '};\n' +
          '\n' +
          'type StringProps = StringKeysOnly<User>;\n' +
          '// { name: string; email: string } — id(number)는 제외됨',
        description: "Mapped Types는 keyof로 키를 추출하고 in으로 순회합니다. 수정자(+/-)로 readonly와 ?를 제어하고, as로 키 자체를 변환합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 실무 커스텀 Mapped Types",
      content:
        "form validation, API response wrapper, 이벤트 핸들러 맵 등 실무에서 자주 사용되는 Mapped Types를 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// ===== 1. Form Validation 타입 =====\n' +
          'type ValidationErrors<T> = {\n' +
          '  [K in keyof T]: string | null;\n' +
          '};\n' +
          '\n' +
          'interface LoginForm {\n' +
          '  email: string;\n' +
          '  password: string;\n' +
          '  rememberMe: boolean;\n' +
          '}\n' +
          '\n' +
          'const errors: ValidationErrors<LoginForm> = {\n' +
          '  email: "유효한 이메일을 입력하세요",\n' +
          '  password: null,      // 에러 없음\n' +
          '  rememberMe: null,    // 에러 없음\n' +
          '};\n' +
          '\n' +
          '// ===== 2. API Response Wrapper =====\n' +
          'type AsyncData<T> = {\n' +
          '  [K in keyof T]: {\n' +
          '    data: T[K] | null;\n' +
          '    loading: boolean;\n' +
          '    error: string | null;\n' +
          '  };\n' +
          '};\n' +
          '\n' +
          'interface AppData {\n' +
          '  users: User[];\n' +
          '  posts: Post[];\n' +
          '}\n' +
          '\n' +
          '// 각 필드가 { data, loading, error } 형태로 변환됨\n' +
          'type AppState = AsyncData<AppData>;\n' +
          '// {\n' +
          '//   users: { data: User[] | null; loading: boolean; error: string | null };\n' +
          '//   posts: { data: Post[] | null; loading: boolean; error: string | null };\n' +
          '// }\n' +
          '\n' +
          '// ===== 3. 이벤트 핸들러 맵 =====\n' +
          'type EventHandlers<T> = {\n' +
          '  [K in keyof T as `on${Capitalize<string & K>}`]: (event: T[K]) => void;\n' +
          '};\n' +
          '\n' +
          'interface DOMEvents {\n' +
          '  click: { x: number; y: number };\n' +
          '  focus: { target: string };\n' +
          '  submit: { data: FormData };\n' +
          '}\n' +
          '\n' +
          'type Handlers = EventHandlers<DOMEvents>;\n' +
          '// {\n' +
          '//   onClick: (event: { x: number; y: number }) => void;\n' +
          '//   onFocus: (event: { target: string }) => void;\n' +
          '//   onSubmit: (event: { data: FormData }) => void;\n' +
          '// }\n' +
          '\n' +
          '// ===== 4. 깊은 Readonly (재귀 Mapped Type) =====\n' +
          'type DeepReadonly<T> = {\n' +
          '  readonly [K in keyof T]: T[K] extends object\n' +
          '    ? DeepReadonly<T[K]>\n' +
          '    : T[K];\n' +
          '};\n' +
          '\n' +
          'interface Config {\n' +
          '  db: { host: string; port: number };\n' +
          '  cache: { ttl: number };\n' +
          '}\n' +
          '\n' +
          'type FrozenConfig = DeepReadonly<Config>;\n' +
          '// db.host도 readonly — 중첩 객체까지 완전 불변',
        description: "Mapped Types를 활용하면 form validation, API state, 이벤트 핸들러 등 반복적인 타입 패턴을 원본 타입에서 자동 생성할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**Mapped Types = 기존 타입의 각 프로퍼티를 순회하며 새 타입을 생성하는 메타 프로그래밍 도구**\n\n" +
        "| 기능 | 문법 | 예시 |\n" +
        "|------|------|------|\n" +
        "| 기본 순회 | `[K in keyof T]: NewType` | 모든 값을 변환 |\n" +
        "| ? 추가 | `[K in keyof T]?: T[K]` | Partial |\n" +
        "| ? 제거 | `[K in keyof T]-?: T[K]` | Required |\n" +
        "| readonly 추가 | `readonly [K in keyof T]` | Readonly |\n" +
        "| readonly 제거 | `-readonly [K in keyof T]` | Mutable |\n" +
        "| 키 변환 | `[K in keyof T as NewKey]` | Getters, EventHandlers |\n" +
        "| 키 필터링 | `as ... ? K : never` | 특정 타입 프로퍼티만 선택 |\n\n" +
        "Partial, Required, Readonly, Pick 등 대부분의 유틸리티 타입이 Mapped Types로 구현되어 있습니다. " +
        "원리를 이해하면 프로젝트에 맞는 커스텀 타입 변환기를 자유롭게 만들 수 있습니다.\n\n" +
        "다음 챕터에서는 **Conditional Types**를 다룹니다. " +
        "`T extends U ? X : Y` 형태의 타입 레벨 조건 분기를 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Mapped Types는 기존 타입의 각 프로퍼티를 순회하며 새로운 타입을 생성하는 메타 프로그래밍 도구다. Partial, Required, Readonly 등의 유틸리티 타입이 모두 Mapped Type으로 구현되어 있다.",
  checklist: [
    "{ [K in keyof T]: T[K] } 문법으로 기본 Mapped Type을 작성할 수 있다",
    "+/- readonly와 +/- ? 수정자의 의미와 사용법을 설명할 수 있다",
    "as 절을 사용한 Key Remapping으로 키를 변환하거나 필터링할 수 있다",
    "Partial, Required 등의 유틸리티 타입이 Mapped Type으로 구현된 원리를 설명할 수 있다",
    "form validation, API wrapper 등 실무에서 커스텀 Mapped Type을 만들 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "{ [K in keyof T]?: T[K] }는 어떤 유틸리티 타입과 동일한가?",
      choices: [
        "Required<T>",
        "Partial<T>",
        "Readonly<T>",
        "Record<keyof T, T[keyof T]>",
      ],
      correctIndex: 1,
      explanation: "모든 프로퍼티에 ? 수정자를 추가하면 선택적(optional)이 되므로 Partial<T>와 동일합니다. Partial<T>의 실제 내부 구현이 바로 이 Mapped Type입니다.",
    },
    {
      id: "q2",
      question: "-? 수정자의 의미는?",
      choices: [
        "프로퍼티를 삭제한다",
        "선택적(optional) 수정자를 제거하여 필수로 만든다",
        "값 타입에서 undefined를 제거한다",
        "프로퍼티를 음수 타입으로 만든다",
      ],
      correctIndex: 1,
      explanation: "-? 는 ?를 제거(-)하는 수정자입니다. 선택적이었던 프로퍼티를 필수로 만듭니다. Required<T>가 { [K in keyof T]-?: T[K] }로 구현됩니다.",
    },
    {
      id: "q3",
      question: "Key Remapping에서 as never를 사용하면 어떻게 되는가?",
      choices: [
        "키의 타입이 never가 된다",
        "해당 프로퍼티가 결과 타입에서 제외된다",
        "값이 never 타입이 된다",
        "컴파일 에러가 발생한다",
      ],
      correctIndex: 1,
      explanation: "Key Remapping에서 as 절이 never를 반환하면 해당 키는 결과 타입에서 완전히 제외됩니다. 이를 이용하여 조건에 따라 특정 프로퍼티만 필터링할 수 있습니다.",
    },
    {
      id: "q4",
      question: "다음 Mapped Type의 결과는?\n```typescript\ntype T = {\n  [K in keyof { a: string; b: number } as `get${Capitalize<K>}`]: () => { a: string; b: number }[K];\n};\n```",
      choices: [
        "{ a: () => string; b: () => number }",
        "{ getA: () => string; getB: () => number }",
        "{ geta: () => string; getb: () => number }",
        "{ get: () => string | number }",
      ],
      correctIndex: 1,
      explanation: "as `get${Capitalize<K>}`는 각 키 'a', 'b'를 'getA', 'getB'로 변환합니다. 값 타입은 () => T[K]이므로 getA: () => string, getB: () => number가 됩니다.",
    },
    {
      id: "q5",
      question: "DeepReadonly<T>처럼 재귀 Mapped Type을 만들 때 기저 조건(base case)은?",
      choices: [
        "T가 never일 때",
        "T가 object가 아닌 원시 타입일 때 재귀를 멈추고 T를 그대로 반환",
        "keyof T가 never일 때",
        "재귀 깊이가 10을 넘을 때",
      ],
      correctIndex: 1,
      explanation: "재귀 Mapped Type은 T[K] extends object ? DeepReadonly<T[K]> : T[K]처럼, 값이 원시 타입(string, number 등)이면 재귀를 멈추고 그대로 반환합니다. 이것이 기저 조건입니다.",
    },
  ],
};

export default chapter;
