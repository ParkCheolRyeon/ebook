import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "18-template-literal-types",
  subject: "typescript",
  title: "Template Literal Types",
  description: "템플릿 리터럴 타입으로 문자열 타입 조합, Uppercase/Lowercase/Capitalize/Uncapitalize 내장 유틸리티, 이벤트 이름 자동 생성, CSS 속성 타입, 패턴 매칭, 라우트 파라미터 추출, i18n 키 타이핑을 학습합니다.",
  order: 18,
  group: "고급 타입",
  prerequisites: ["17-conditional-types"],
  estimatedMinutes: 35,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Template Literal Types는 **라벨 프린터**와 같습니다.\n\n" +
        "라벨 프린터에 '부서명_직급'이라는 템플릿을 설정하면, " +
        "부서명에 '개발', '디자인', '기획'을, 직급에 '팀장', '사원'을 넣어 " +
        "'개발_팀장', '개발_사원', '디자인_팀장'... 등 모든 조합의 라벨을 자동으로 인쇄할 수 있습니다.\n\n" +
        "`${Department}_${Position}` 템플릿이 바로 이것입니다. " +
        "각 위치에 유니온 타입을 넣으면 **모든 가능한 조합**이 자동 생성됩니다. " +
        "3개 부서 x 2개 직급 = 6가지 조합이 타입 레벨에서 자동으로 만들어집니다.\n\n" +
        "거꾸로, 라벨을 보고 '어떤 부서와 직급인지' 분해하는 것도 가능합니다. " +
        "이것이 **패턴 매칭**입니다. `${infer Dept}_${infer Pos}` 형태로 " +
        "문자열 타입을 분해하여 각 부분을 추출할 수 있습니다.\n\n" +
        "`Uppercase`, `Capitalize` 같은 변환 도구는 " +
        "라벨의 글자를 대문자로 바꾸는 기능과 같습니다. " +
        "이 모든 것이 **컴파일 타임**에 일어나므로, 런타임 비용 없이 문자열 기반 API의 타입 안전성을 확보할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "문자열 기반 API는 어디에나 있지만, 타입 안전성이 부족합니다.\n\n" +
        "```typescript\n" +
        "// 문제 1: 이벤트 이름 — 오타를 잡을 수 없음\n" +
        "element.addEventListener('clcik', handler); // 오타인데 에러 없음\n" +
        "\n" +
        "// 문제 2: CSS — 잘못된 속성명도 통과\n" +
        "element.style.setProperty('colr', 'red'); // 오타!\n" +
        "\n" +
        "// 문제 3: 라우트 — 파라미터 이름 오타\n" +
        "router.get('/users/:id', (req) => {\n" +
        "  const userId = req.params.ud; // 'id'인데 'ud'로 오타\n" +
        "});\n" +
        "```\n\n" +
        "```typescript\n" +
        "// 문제 4: 이벤트 핸들러 자동 생성\n" +
        "// state에 name, age가 있으면\n" +
        "// onNameChange, onAgeChange가 자동으로 있어야 함\n" +
        "// 어떻게 타입으로 강제할 수 있을까?\n" +
        "```\n\n" +
        "```typescript\n" +
        "// 문제 5: i18n 키 — 중첩 키 경로의 타입 안전성\n" +
        "t('common.buttons.submti'); // 'submit' 오타인데 에러 없음\n" +
        "```\n\n" +
        "이 모든 문제는 문자열을 타입 레벨에서 **조합, 분해, 검증**할 수 있으면 해결됩니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 기본 문법: `${A}_${B}`\n" +
        "백틱 안에서 `${Type}`을 사용하여 문자열 리터럴 타입을 조합합니다. " +
        "A와 B가 유니온이면 모든 가능한 조합이 자동 생성됩니다(카르테시안 곱).\n\n" +
        "### 내장 문자열 유틸리티\n" +
        "- **Uppercase<T>**: 모든 문자를 대문자로. `Uppercase<'hello'>` → `'HELLO'`\n" +
        "- **Lowercase<T>**: 모든 문자를 소문자로. `Lowercase<'HELLO'>` → `'hello'`\n" +
        "- **Capitalize<T>**: 첫 글자만 대문자로. `Capitalize<'hello'>` → `'Hello'`\n" +
        "- **Uncapitalize<T>**: 첫 글자만 소문자로. `Uncapitalize<'Hello'>` → `'hello'`\n\n" +
        "### 이벤트 이름 자동 생성\n" +
        "객체의 키를 순회하면서 `on${Capitalize<K>}Change` 형태의 이벤트 핸들러 타입을 자동 생성할 수 있습니다. " +
        "Mapped Types + Template Literal Types의 조합입니다.\n\n" +
        "### 패턴 매칭 (infer와 조합)\n" +
        "Conditional Types의 `infer`와 결합하면 문자열 타입을 분해할 수 있습니다. " +
        "`T extends `${infer Prefix}.${infer Rest}`` 형태로 '.'을 기준으로 문자열을 분리합니다.\n\n" +
        "### 실무 적용\n" +
        "라우트 파라미터 추출(`/users/:id` → `{ id: string }`), " +
        "i18n 키 타이핑, CSS 속성 타입, 이벤트 시스템 등에 활용됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Template Literal Types의 동작 원리",
      content:
        "기본 조합부터 패턴 매칭까지 Template Literal Types의 핵심 동작을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// ===== 1. 기본 조합: 카르테시안 곱 =====\n' +
          'type Color = "red" | "blue";\n' +
          'type Size = "sm" | "lg";\n' +
          '\n' +
          'type ClassName = `${Color}-${Size}`;\n' +
          '// "red-sm" | "red-lg" | "blue-sm" | "blue-lg"\n' +
          '\n' +
          '// ===== 2. 문자열 유틸리티 =====\n' +
          'type Upper = Uppercase<"hello">;        // "HELLO"\n' +
          'type Lower = Lowercase<"HELLO">;        // "hello"\n' +
          'type Cap = Capitalize<"hello">;          // "Hello"\n' +
          'type Uncap = Uncapitalize<"Hello">;      // "hello"\n' +
          '\n' +
          '// 유니온에도 분배 적용\n' +
          'type Events = Capitalize<"click" | "focus" | "blur">;\n' +
          '// "Click" | "Focus" | "Blur"\n' +
          '\n' +
          '// ===== 3. 이벤트 핸들러 자동 생성 =====\n' +
          'type EventHandlers<T> = {\n' +
          '  [K in keyof T as `on${Capitalize<string & K>}Change`]:\n' +
          '    (newValue: T[K]) => void;\n' +
          '};\n' +
          '\n' +
          'interface State {\n' +
          '  name: string;\n' +
          '  age: number;\n' +
          '  active: boolean;\n' +
          '}\n' +
          '\n' +
          'type StateHandlers = EventHandlers<State>;\n' +
          '// {\n' +
          '//   onNameChange: (newValue: string) => void;\n' +
          '//   onAgeChange: (newValue: number) => void;\n' +
          '//   onActiveChange: (newValue: boolean) => void;\n' +
          '// }\n' +
          '\n' +
          '// ===== 4. 패턴 매칭: infer로 분해 =====\n' +
          'type ExtractParam<T extends string> =\n' +
          '  T extends `${string}:${infer Param}/${infer Rest}`\n' +
          '    ? Param | ExtractParam<Rest>\n' +
          '    : T extends `${string}:${infer Param}`\n' +
          '      ? Param\n' +
          '      : never;\n' +
          '\n' +
          'type Params = ExtractParam<"/users/:userId/posts/:postId">;\n' +
          '// "userId" | "postId"\n' +
          '\n' +
          '// ===== 5. 점 표기법 분리 =====\n' +
          'type Split<S extends string, D extends string> =\n' +
          '  S extends `${infer Head}${D}${infer Tail}`\n' +
          '    ? [Head, ...Split<Tail, D>]\n' +
          '    : [S];\n' +
          '\n' +
          'type Parts = Split<"a.b.c", ".">;\n' +
          '// ["a", "b", "c"]',
        description: "Template Literal Types는 유니온의 카르테시안 곱으로 모든 조합을 생성하고, infer와 결합하면 문자열 패턴 매칭이 가능합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 실전 Template Literal Types",
      content:
        "라우트 파라미터 추출, CSS 속성 타입, i18n 키 타이핑 등 실전에서 활용되는 패턴을 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// ===== 1. 라우트 파라미터 추출 =====\n' +
          'type ExtractRouteParams<T extends string> =\n' +
          '  T extends `${string}:${infer Param}/${infer Rest}`\n' +
          '    ? { [K in Param | keyof ExtractRouteParams<Rest>]:\n' +
          '        K extends Param ? string : ExtractRouteParams<Rest>[K & keyof ExtractRouteParams<Rest>] }\n' +
          '    : T extends `${string}:${infer Param}`\n' +
          '      ? { [K in Param]: string }\n' +
          '      : {};\n' +
          '\n' +
          '// 간소화 버전\n' +
          'type RouteParams<T extends string> =\n' +
          '  T extends `${string}:${infer P}/${infer Rest}`\n' +
          '    ? { readonly [K in P]: string } & RouteParams<Rest>\n' +
          '    : T extends `${string}:${infer P}`\n' +
          '      ? { readonly [K in P]: string }\n' +
          '      : {};\n' +
          '\n' +
          'type UserPostParams = RouteParams<"/users/:userId/posts/:postId">;\n' +
          '// { readonly userId: string } & { readonly postId: string }\n' +
          '\n' +
          '// ===== 2. CSS 속성 타입 =====\n' +
          'type CSSUnit = "px" | "em" | "rem" | "%";\n' +
          'type CSSValue = `${number}${CSSUnit}`;\n' +
          '\n' +
          'function setSize(width: CSSValue, height: CSSValue): void {\n' +
          '  console.log(`width: ${width}, height: ${height}`);\n' +
          '}\n' +
          '\n' +
          'setSize("100px", "50%");    // OK\n' +
          'setSize("2.5rem", "80vh" as any); // 실제론 에러를 유발하게 설계 가능\n' +
          '\n' +
          '// ===== 3. 타입 안전한 이벤트 시스템 =====\n' +
          'type EventConfig = {\n' +
          '  click: { x: number; y: number };\n' +
          '  focus: { target: string };\n' +
          '  keydown: { key: string; code: number };\n' +
          '};\n' +
          '\n' +
          '// 이벤트 이름에 on 접두사를 붙인 핸들러 맵\n' +
          'type HandlerMap<T> = {\n' +
          '  [K in keyof T as `on${Capitalize<string & K>}`]:\n' +
          '    (event: T[K]) => void;\n' +
          '};\n' +
          '\n' +
          'type EventHandlers = HandlerMap<EventConfig>;\n' +
          '// {\n' +
          '//   onClick: (event: { x: number; y: number }) => void;\n' +
          '//   onFocus: (event: { target: string }) => void;\n' +
          '//   onKeydown: (event: { key: string; code: number }) => void;\n' +
          '// }\n' +
          '\n' +
          '// ===== 4. i18n 키 타이핑 (중첩 객체의 점 표기법) =====\n' +
          'type NestedKeys<T, Prefix extends string = ""> = {\n' +
          '  [K in keyof T & string]: T[K] extends Record<string, any>\n' +
          '    ? NestedKeys<T[K], `${Prefix}${K}.`>\n' +
          '    : `${Prefix}${K}`;\n' +
          '}[keyof T & string];\n' +
          '\n' +
          'interface Translations {\n' +
          '  common: {\n' +
          '    buttons: { submit: string; cancel: string };\n' +
          '    labels: { name: string; email: string };\n' +
          '  };\n' +
          '  auth: {\n' +
          '    login: string;\n' +
          '    logout: string;\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          'type TranslationKey = NestedKeys<Translations>;\n' +
          '// "common.buttons.submit" | "common.buttons.cancel"\n' +
          '// | "common.labels.name" | "common.labels.email"\n' +
          '// | "auth.login" | "auth.logout"\n' +
          '\n' +
          'function t(key: TranslationKey): string {\n' +
          '  return key; // 실제론 번역값 반환\n' +
          '}\n' +
          '\n' +
          't("common.buttons.submit"); // OK\n' +
          '// t("common.buttons.submti"); // 컴파일 에러! 오타 방지',
        description: "Template Literal Types는 라우트 파라미터, CSS 값, 이벤트 이름, i18n 키 등 문자열 기반 API의 타입 안전성을 극대화합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**Template Literal Types = 문자열 타입의 프로그래밍적 조합과 분해**\n\n" +
        "| 기능 | 설명 | 예시 |\n" +
        "|------|------|------|\n" +
        "| 조합 | 유니온의 카르테시안 곱 | `${A}_${B}` → 모든 조합 |\n" +
        "| 변환 | 대소문자 변경 | Capitalize, Uppercase 등 |\n" +
        "| 패턴 매칭 | infer로 문자열 분해 | `:${infer Param}` |\n" +
        "| 키 변환 | Mapped Types와 조합 | `on${Capitalize<K>}` |\n\n" +
        "**실무 활용:**\n" +
        "- 이벤트 핸들러 이름 자동 생성 (onClick, onChange 등)\n" +
        "- 라우트 파라미터 타입 추출 (/users/:id → { id: string })\n" +
        "- i18n 키의 점 표기법 경로 타이핑\n" +
        "- CSS 값 타입 검증\n\n" +
        "Template Literal Types는 TypeScript 4.1에서 도입된 기능으로, " +
        "문자열 기반 API가 많은 웹 개발에서 특히 강력합니다. " +
        "Mapped Types, Conditional Types와 조합하면 매우 정교한 타입 시스템을 구축할 수 있습니다.\n\n" +
        "이 그룹(고급 타입)에서 유틸리티 타입, Mapped Types, Conditional Types, " +
        "Template Literal Types를 학습했습니다. 다음 챕터에서는 **infer 키워드**를 " +
        "더 깊이 다루며, 타입 추출의 고급 패턴을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Template Literal Types는 문자열 리터럴 타입을 프로그래밍적으로 조합하고 분해한다. 이벤트 이름, 라우트 경로, CSS 속성 등 문자열 기반 API의 타입 안전성을 극대화할 수 있다.",
  checklist: [
    "`${A}_${B}` 문법으로 문자열 리터럴 타입을 조합하고 유니온의 카르테시안 곱을 생성할 수 있다",
    "Uppercase, Lowercase, Capitalize, Uncapitalize 내장 유틸리티를 활용할 수 있다",
    "Mapped Types와 조합하여 이벤트 핸들러 맵 등 키를 변환하는 타입을 만들 수 있다",
    "infer와 결합한 패턴 매칭으로 문자열 타입을 분해할 수 있다",
    "라우트 파라미터 추출이나 i18n 키 타이핑 등 실무 패턴을 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "`${\"a\" | \"b\"}_${\"x\" | \"y\"}`의 결과 타입은?",
      choices: [
        '"a_x" | "b_y"',
        '"a_x" | "a_y" | "b_x" | "b_y"',
        '"a" | "b" | "x" | "y"',
        '"ab_xy"',
      ],
      correctIndex: 1,
      explanation: "Template Literal Types에서 유니온을 사용하면 카르테시안 곱(모든 조합)이 생성됩니다. 2개 x 2개 = 4가지 조합이 자동으로 만들어집니다.",
    },
    {
      id: "q2",
      question: "Capitalize<'hello'>의 결과는?",
      choices: [
        '"HELLO"',
        '"Hello"',
        '"hello"',
        '"hELLO"',
      ],
      correctIndex: 1,
      explanation: "Capitalize<T>는 문자열의 첫 글자만 대문자로 변환합니다. 'hello' → 'Hello'가 됩니다. 모든 문자를 대문자로 바꾸려면 Uppercase<T>를 사용합니다.",
    },
    {
      id: "q3",
      question: "다음 패턴 매칭의 결과는?\n```typescript\ntype Get<T> = T extends `on${infer E}` ? E : never;\ntype R = Get<'onClick'>;\n```",
      choices: [
        '"onClick"',
        '"Click"',
        '"click"',
        'never',
      ],
      correctIndex: 1,
      explanation: "'onClick'은 `on${infer E}` 패턴과 매칭됩니다. 'on' 이후의 부분인 'Click'이 E로 추론됩니다. 소문자로 변환하려면 추가로 Uncapitalize를 적용해야 합니다.",
    },
    {
      id: "q4",
      question: "Template Literal Types에서 유니온의 카르테시안 곱이 폭발적으로 커질 때 어떤 문제가 발생하는가?",
      choices: [
        "런타임 성능이 저하된다",
        "컴파일 시간이 급격히 증가하거나 타입 에러가 발생할 수 있다",
        "JavaScript 번들 크기가 커진다",
        "문자열 길이 제한에 걸린다",
      ],
      correctIndex: 1,
      explanation: "유니온 멤버가 많으면 카르테시안 곱으로 생성되는 조합의 수가 기하급수적으로 증가합니다. TypeScript는 너무 많은 유니온 멤버(보통 100,000개 이상)를 생성하면 컴파일 시간이 급증하거나 에러를 발생시킵니다.",
    },
    {
      id: "q5",
      question: "Mapped Types + Template Literal Types로 { name: string }에서 { onNameChange: (v: string) => void }를 생성하려면?",
      choices: [
        "{ [K in keyof T]: `on${K}Change` }",
        "{ [K in keyof T as `on${Capitalize<string & K>}Change`]: (v: T[K]) => void }",
        "{ `on${keyof T}Change`: (v: T[keyof T]) => void }",
        "{ [K in `on${keyof T}Change`]: (v: any) => void }",
      ],
      correctIndex: 1,
      explanation: "Key Remapping(as)과 Template Literal Types를 조합합니다. `K in keyof T as `on${Capitalize<string & K>}Change``로 키를 변환하고, 값 타입에 (v: T[K]) => void를 지정합니다.",
    },
  ],
};

export default chapter;
