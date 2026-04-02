import type { FinalExam } from "@/types/quiz";

const finalExam: FinalExam = {
  type: "final",
  id: "final-exam",
  title: "TypeScript 최종 시험",
  questions: [
    // === 기초 ===
    {
      id: "final-q1",
      question:
        "다음 코드에서 x와 y의 타입 차이는?\n\nconst x = \"hello\";\nlet y = \"hello\";",
      choices: [
        "둘 다 string이다",
        "x는 \"hello\" 리터럴 타입, y는 string이다",
        "x는 string, y는 \"hello\" 리터럴 타입이다",
        "둘 다 \"hello\" 리터럴 타입이다",
      ],
      correctIndex: 1,
      explanation:
        "const로 선언하면 재할당이 불가능하므로 TypeScript는 리터럴 타입(\"hello\")으로 좁혀서 추론합니다. let은 재할당 가능하므로 넓은 타입(string)으로 추론합니다.",
    },
    {
      id: "final-q2",
      question:
        "다음 코드에서 에러 없이 실행되는 것은?\n\nfunction process(value: unknown) {\n  // A: value.toUpperCase()\n  // B: (value as string).toUpperCase()\n  // C: if (typeof value === \"string\") value.toUpperCase()\n  // D: value + 1\n}",
      choices: [
        "A와 D",
        "B와 C",
        "C만",
        "모두 에러 없이 실행된다",
      ],
      correctIndex: 1,
      explanation:
        "unknown 타입은 타입 좁히기 없이 사용할 수 없으므로 A와 D는 에러입니다. B는 as 단언으로 컴파일은 통과하지만 런타임 위험이 있고, C는 typeof 가드로 안전하게 좁힙니다. 컴파일 기준으로는 B와 C 모두 통과합니다.",
    },
    {
      id: "final-q3",
      question:
        "never 타입이 유용한 실제 시나리오는?\n\ntype Shape = Circle | Square | Triangle;\n\nfunction area(shape: Shape): number {\n  switch (shape.kind) {\n    case \"circle\": return Math.PI * shape.radius ** 2;\n    case \"square\": return shape.side ** 2;\n    default:\n      const _exhaustive: never = shape;\n      return _exhaustive;\n  }\n}",
      choices: [
        "에러를 무시하기 위해 사용한다",
        "새 타입(Triangle)을 추가했을 때 처리하지 않은 케이스를 컴파일 에러로 감지한다",
        "never는 모든 타입에 할당 가능하다",
        "default 케이스를 건너뛰기 위해 사용한다",
      ],
      correctIndex: 1,
      explanation:
        "never에는 어떤 값도 할당할 수 없으므로, Triangle 케이스를 처리하지 않으면 shape가 Triangle 타입으로 남아 never에 할당할 수 없다는 에러가 발생합니다. 이를 완전성 검사(exhaustiveness check)라 합니다.",
    },
    // === 타입 좁히기 ===
    {
      id: "final-q4",
      question:
        "다음 사용자 정의 타입 가드의 반환 타입이 의미하는 것은?\n\nfunction isString(value: unknown): value is string {\n  return typeof value === \"string\";\n}",
      choices: [
        "항상 true를 반환한다",
        "반환값이 true일 때 value의 타입을 string으로 좁힌다는 것을 TypeScript에 알린다",
        "value를 string으로 변환한다",
        "boolean 대신 string을 반환한다",
      ],
      correctIndex: 1,
      explanation:
        "value is string은 타입 술어(type predicate)입니다. 이 함수가 true를 반환하면 TypeScript는 해당 스코프에서 value를 string으로 좁힙니다. 복잡한 타입 검사를 재사용 가능한 함수로 캡슐화할 수 있습니다.",
    },
    // === 제네릭 ===
    {
      id: "final-q5",
      question:
        "다음 코드에서 에러가 발생하는 이유는?\n\nfunction createPair<T extends number | string>(a: T, b: T) {\n  return [a, b] as const;\n}\ncreatePair(1, \"hello\");",
      choices: [
        "as const를 사용할 수 없다",
        "T가 하나의 타입으로 결정되어야 하는데 number와 string이 동시에 전달되어 충돌한다",
        "배열을 반환할 수 없다",
        "createPair에 제네릭이 불필요하다",
      ],
      correctIndex: 1,
      explanation:
        "T는 호출 시 하나의 타입으로 추론됩니다. 1(number)과 \"hello\"(string)를 동시에 전달하면 T를 number | string으로 추론하려 하지만, 제약 조건과 맞지 않아 에러가 발생할 수 있습니다. 두 매개변수를 별도 타입 변수(T, U)로 분리해야 합니다.",
    },
    {
      id: "final-q6",
      question:
        "다음 제네릭 유틸리티 타입의 결과는?\n\ntype DeepReadonly<T> = {\n  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];\n};\n\ntype Config = { db: { host: string; port: number } };\ntype ReadonlyConfig = DeepReadonly<Config>;",
      choices: [
        "최상위 속성만 readonly가 된다",
        "db와 db 내부의 host, port 모두 readonly가 된다",
        "타입 에러가 발생한다",
        "Config와 동일한 타입이다",
      ],
      correctIndex: 1,
      explanation:
        "DeepReadonly는 재귀적으로 동작합니다. 각 속성이 object이면 다시 DeepReadonly를 적용하여 중첩 객체의 모든 속성에 readonly를 부여합니다. Readonly<T>는 1단계만 적용하지만 이 타입은 깊게 적용됩니다.",
    },
    // === 고급 타입 ===
    {
      id: "final-q7",
      question:
        "다음 조건부 타입에서 결과는?\n\ntype ExtractString<T> = T extends string ? T : never;\ntype Result = ExtractString<\"a\" | 1 | \"b\" | true>;",
      choices: [
        "\"a\" | 1 | \"b\" | true",
        "\"a\" | \"b\"",
        "never",
        "string",
      ],
      correctIndex: 1,
      explanation:
        "분배 조건부 타입에 의해 유니온의 각 멤버가 개별 평가됩니다. \"a\" extends string -> \"a\", 1 extends string -> never, \"b\" extends string -> \"b\", true extends string -> never. 결과는 \"a\" | \"b\"입니다.",
    },
    {
      id: "final-q8",
      question:
        "다음 infer를 사용한 타입에서 UnpackPromise<Promise<string>>의 결과는?\n\ntype UnpackPromise<T> = T extends Promise<infer U> ? U : T;",
      choices: [
        "Promise<string>",
        "string",
        "unknown",
        "never",
      ],
      correctIndex: 1,
      explanation:
        "Promise<string>은 Promise<infer U> 패턴에 매칭되어 U가 string으로 추론됩니다. true 분기에서 U를 반환하므로 결과는 string입니다. Promise가 아닌 타입을 전달하면 그대로 반환됩니다.",
    },
    // === 타입 시스템 심화 ===
    {
      id: "final-q9",
      question:
        "다음 코드가 에러 없이 컴파일되는 이유는?\n\ninterface Point { x: number; y: number }\ninterface Coordinate { x: number; y: number; z: number }\n\nconst coord: Coordinate = { x: 1, y: 2, z: 3 };\nconst point: Point = coord;",
      choices: [
        "Point와 Coordinate가 같은 이름이라서",
        "구조적 타이핑에 의해 Coordinate는 Point의 모든 속성(x, y)을 가지므로 할당 가능하다",
        "TypeScript가 초과 속성을 자동으로 제거해서",
        "암묵적 타입 변환이 발생해서",
      ],
      correctIndex: 1,
      explanation:
        "구조적 타이핑에서 타입 호환성은 구조로 판단합니다. Coordinate는 Point가 요구하는 x, y를 모두 가지고 있으므로 할당 가능합니다. 초과 속성(z)은 변수를 통한 할당에서는 허용됩니다.",
    },
    {
      id: "final-q10",
      question:
        "Branded Type을 사용하여 UserId와 PostId를 구분하려 합니다. 올바른 구현은?",
      choices: [
        "type UserId = string; type PostId = string;",
        "type UserId = string & { readonly __brand: unique symbol }; type PostId = string & { readonly __brand: unique symbol };",
        "type UserId = number; type PostId = string;",
        "class UserId extends String {} class PostId extends String {}",
      ],
      correctIndex: 1,
      explanation:
        "unique symbol은 선언마다 고유한 타입이 되므로, 각 Branded Type의 __brand가 서로 다른 타입이 됩니다. 이렇게 하면 UserId와 PostId는 구조적으로 호환되지 않아 실수로 섞이는 것을 방지합니다.",
    },
    // === 클래스와 OOP ===
    {
      id: "final-q11",
      question:
        "TypeScript에서 private과 JavaScript의 #private 필드의 차이는?",
      choices: [
        "동일하게 동작한다",
        "TypeScript private은 컴파일 타임 검사만, #private는 런타임에도 접근을 차단한다",
        "#private는 TypeScript에서 사용할 수 없다",
        "private이 더 강력한 캡슐화를 제공한다",
      ],
      correctIndex: 1,
      explanation:
        "TypeScript의 private 키워드는 컴파일 타임에만 접근을 제한하며, 컴파일된 JavaScript에서는 일반 속성입니다. #private 필드는 ECMAScript 표준으로 런타임에도 클래스 외부에서 접근이 불가능합니다.",
    },
    // === React + TypeScript ===
    {
      id: "final-q12",
      question:
        "다음 제네릭 React 컴포넌트에서 T의 역할은?\n\nfunction Select<T extends string>({ options, onChange }: {\n  options: T[];\n  onChange: (value: T) => void;\n}) { /* ... */ }\n\n<Select options={[\"a\", \"b\", \"c\"]} onChange={(v) => console.log(v)} />",
      choices: [
        "T는 항상 string이다",
        "T가 \"a\" | \"b\" | \"c\"로 추론되어 onChange의 v도 \"a\" | \"b\" | \"c\"로 타입이 좁혀진다",
        "T는 무시된다",
        "제네릭 컴포넌트는 React에서 지원하지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "options에서 T가 \"a\" | \"b\" | \"c\"로 추론되면, onChange의 매개변수 v도 같은 타입으로 좁혀집니다. 제네릭 컴포넌트를 통해 props 간의 타입 관계를 표현할 수 있습니다.",
    },
    {
      id: "final-q13",
      question:
        "React에서 children prop의 타입으로 가장 적절한 것은?",
      choices: [
        "any",
        "React.ReactNode",
        "string",
        "JSX.Element",
      ],
      correctIndex: 1,
      explanation:
        "React.ReactNode는 string, number, boolean, null, undefined, ReactElement, ReactFragment 등 React가 렌더링할 수 있는 모든 것을 포함합니다. JSX.Element는 JSX 표현식만 허용하여 string 등을 제외합니다.",
    },
    // === 프로젝트 설정 ===
    {
      id: "final-q14",
      question:
        "tsconfig.json에서 target과 lib의 차이는?",
      choices: [
        "동일한 옵션이다",
        "target은 출력 JavaScript 버전을, lib는 사용 가능한 타입 선언(API)을 지정한다",
        "target은 입력 파일을, lib는 출력 파일을 지정한다",
        "lib는 외부 라이브러리 경로를 설정한다",
      ],
      correctIndex: 1,
      explanation:
        "target은 컴파일 결과의 JavaScript 버전(ES5, ES2020 등)을 결정합니다. lib는 코드에서 사용 가능한 내장 타입 선언(DOM, ES2020.Promise 등)을 지정합니다. 최신 API를 쓰면서 구버전 JS로 출력할 수 있습니다.",
    },
    {
      id: "final-q15",
      question:
        "noUncheckedIndexedAccess 옵션이 활성화되면 달라지는 것은?\n\nconst arr: string[] = [\"a\", \"b\"];\nconst item = arr[5];",
      choices: [
        "런타임에 에러를 던진다",
        "item의 타입이 string | undefined가 되어 undefined 체크를 강제한다",
        "인덱스 접근이 불가능해진다",
        "배열 타입이 변경된다",
      ],
      correctIndex: 1,
      explanation:
        "noUncheckedIndexedAccess가 활성화되면 인덱스 접근의 결과에 undefined가 자동으로 추가됩니다. arr[5]는 string이 아닌 string | undefined가 되어, 사용 전 undefined 체크를 강제합니다.",
    },
    // === 실전 패턴 ===
    {
      id: "final-q16",
      question:
        "다음 함수 오버로드의 장점은?\n\nfunction createElement(tag: \"input\"): HTMLInputElement;\nfunction createElement(tag: \"div\"): HTMLDivElement;\nfunction createElement(tag: string): HTMLElement;\nfunction createElement(tag: string): HTMLElement {\n  return document.createElement(tag);\n}",
      choices: [
        "코드량이 줄어든다",
        "입력값에 따라 반환 타입이 정확히 좁혀져서 타입 단언 없이 요소별 속성에 접근할 수 있다",
        "런타임 성능이 향상된다",
        "함수 오버로드는 TypeScript에서 권장하지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "함수 오버로드를 사용하면 createElement(\"input\")의 반환 타입이 HTMLInputElement로 좁혀져 .value에 바로 접근할 수 있습니다. as HTMLInputElement 같은 타입 단언이 불필요해집니다.",
    },
    {
      id: "final-q17",
      question:
        "다음 코드에서 Zod 스키마와 TypeScript 타입을 함께 사용하는 올바른 패턴은?\n\nimport { z } from \"zod\";\n\nconst UserSchema = z.object({\n  id: z.number(),\n  name: z.string(),\n  email: z.string().email(),\n});\n\n// 타입은 어떻게 정의하는가?",
      choices: [
        "interface User { id: number; name: string; email: string; }",
        "type User = z.infer<typeof UserSchema>;",
        "type User = typeof UserSchema;",
        "타입을 별도로 정의할 필요 없다",
      ],
      correctIndex: 1,
      explanation:
        "z.infer<typeof UserSchema>를 사용하면 Zod 스키마로부터 TypeScript 타입을 자동 추론합니다. 스키마와 타입이 항상 동기화되어 타입 불일치를 방지합니다. 별도 interface를 작성하면 스키마와 타입이 어긋날 수 있습니다.",
    },
    {
      id: "final-q18",
      question:
        "다음 코드에서 as const assertion의 효과는?\n\nconst ROLES = [\"admin\", \"user\", \"guest\"] as const;\ntype Role = (typeof ROLES)[number];",
      choices: [
        "배열이 mutable이 된다",
        "ROLES가 readonly [\"admin\", \"user\", \"guest\"] 튜플이 되고, Role은 \"admin\" | \"user\" | \"guest\" 유니온이 된다",
        "Role은 string[] 타입이 된다",
        "런타임에 타입 검사가 추가된다",
      ],
      correctIndex: 1,
      explanation:
        "as const는 배열을 readonly 튜플로 만들고 각 요소를 리터럴 타입으로 좁힙니다. (typeof ROLES)[number]는 튜플의 모든 요소 타입의 유니온을 추출합니다. 상수 값과 타입을 한 번에 정의하는 패턴입니다.",
    },
    // === 아키텍처 ===
    {
      id: "final-q19",
      question:
        "다음 코드에서 타입 안전한 이벤트 시스템을 구현할 때 Template Literal Type의 역할은?\n\ntype EventMap = {\n  click: { x: number; y: number };\n  focus: { target: string };\n};\n\nfunction on<K extends keyof EventMap>(\n  event: K, handler: (payload: EventMap[K]) => void\n): void;",
      choices: [
        "이벤트 이름과 핸들러 타입이 무관하게 된다",
        "이벤트 이름에 따라 handler의 payload 타입이 자동으로 결정된다",
        "EventMap은 런타임에 사용된다",
        "K를 string으로 넓혀서 모든 이벤트를 수용한다",
      ],
      correctIndex: 1,
      explanation:
        "K가 keyof EventMap으로 제약되어 있으므로, on(\"click\", ...)에서 K는 \"click\"이 되고 handler의 payload는 { x: number; y: number }로 결정됩니다. 이벤트 이름과 데이터 타입이 연동됩니다.",
    },
    {
      id: "final-q20",
      question:
        "대규모 TypeScript 프로젝트에서 프로젝트 참조(Project References)를 사용하는 이유는?",
      choices: [
        "코드를 하나의 파일로 합치기 위해",
        "모노레포에서 패키지 간 의존성을 관리하고, 변경된 패키지만 증분 빌드하여 빌드 시간을 단축하기 위해",
        "TypeScript 버전을 패키지별로 다르게 설정하기 위해",
        "런타임 모듈 로딩을 최적화하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "프로젝트 참조(composite, references)를 사용하면 패키지 간 빌드 의존성을 명시하고, tsc --build로 변경된 부분만 증분 컴파일합니다. 대규모 모노레포에서 빌드 시간을 크게 줄일 수 있습니다.",
    },
  ],
};

export default finalExam;
