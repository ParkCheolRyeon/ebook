import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "08-type-narrowing",
  subject: "typescript",
  title: "타입 좁히기",
  description:
    "typeof, instanceof, in 연산자 등을 활용해 유니온 타입에서 특정 타입으로 범위를 좁히는 방법을 마스터합니다.",
  order: 8,
  group: "타입 좁히기",
  prerequisites: ["07-union-intersection"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "타입 좁히기는 **택배 분류 시스템**과 같습니다.\n\n" +
        "택배 센터에 다양한 상자가 도착합니다. 처음에는 '상자'라는 것만 알지, 안에 뭐가 들었는지 모릅니다(유니온 타입). 분류 작업자는 여러 방법으로 상자를 확인합니다:\n\n" +
        "- **무게 측정**(typeof): 가벼우면 서류, 무거우면 가전\n" +
        "- **브랜드 라벨 확인**(instanceof): 삼성 박스면 전자기기, 나이키 박스면 의류\n" +
        "- **내용물 확인**(in 연산자): 배터리 칸이 있으면 전자기기\n" +
        "- **바코드 스캔**(동등성 검사): 특정 코드와 일치하면 해당 상품\n\n" +
        "각 확인 단계를 거칠 때마다, '이 상자는 ~이다'라는 확신이 생기고 그에 맞는 처리를 할 수 있습니다. TypeScript의 **제어 흐름 분석**이 바로 이 분류 작업을 자동으로 수행합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "유니온 타입에서는 공통 프로퍼티만 접근 가능합니다. 그렇다면 특정 타입의 프로퍼티에 접근하려면 어떻게 해야 할까요?\n\n" +
        "```\n" +
        "function process(value: string | number) {\n" +
        "  // value.toFixed()  — Error! string에는 toFixed가 없음\n" +
        "  // value.toUpperCase() — Error! number에는 toUpperCase가 없음\n" +
        "}\n" +
        "```\n\n" +
        "단순히 `as number`로 단언할 수 있지만, 런타임에 실제로 string이 들어오면 에러가 납니다. 우리에게 필요한 것은 **런타임 검사에 기반한 안전한 타입 분기**입니다.\n\n" +
        "또한 커스텀 객체 타입에서는 `typeof`로는 구분이 안 됩니다(모두 'object'). 더 정교한 좁히기 방법이 필요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "TypeScript는 **제어 흐름 분석(Control Flow Analysis)**을 통해, 조건문 이후의 코드에서 자동으로 타입을 좁힙니다.\n\n" +
        "### 기본 가드들\n" +
        "- **typeof**: 원시 타입 구분 (`'string'`, `'number'`, `'boolean'` 등)\n" +
        "- **instanceof**: 클래스 인스턴스 확인\n" +
        "- **in 연산자**: 특정 프로퍼티 존재 여부 확인\n" +
        "- **동등성 검사(===)**: 특정 리터럴 값과 비교\n" +
        "- **truthiness**: null/undefined 제거\n\n" +
        "### 고급 기법\n" +
        "- **커스텀 타입 가드(is)**: 복잡한 판별 로직을 함수로 캡슐화하여 `pet is Cat` 형태의 반환 타입으로 TypeScript에게 타입 정보를 전달\n" +
        "- **단언 함수(asserts)**: 조건이 거짓이면 에러를 던지고, 이후 코드에서 타입이 좁혀짐\n" +
        "- **never를 이용한 완전성 검사**: switch문에서 모든 케이스를 처리했는지 컴파일 타임에 검증",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 다양한 타입 가드 패턴",
      content:
        "TypeScript가 제공하는 다양한 타입 좁히기 기법을 하나씩 살펴봅시다. 각 가드가 어떤 상황에서 유용한지, 그리고 TypeScript가 이를 어떻게 인식하는지 확인합니다.",
      code: {
        language: "typescript",
        code:
          "// === typeof 가드: 원시 타입 구분 ===\n" +
          "function process(value: string | number) {\n" +
          "  if (typeof value === \"string\") {\n" +
          "    // 이 블록에서 value는 string\n" +
          "    return value.toUpperCase();\n" +
          "  }\n" +
          "  // 여기서 value는 number (string이 제거됨)\n" +
          "  return value.toFixed(2);\n" +
          "}\n" +
          "\n" +
          "// === instanceof 가드: 클래스 인스턴스 확인 ===\n" +
          "function getDate(value: Date | string) {\n" +
          "  if (value instanceof Date) {\n" +
          "    return value.getTime(); // Date로 좁혀짐\n" +
          "  }\n" +
          "  return new Date(value).getTime(); // string으로 좁혀짐\n" +
          "}\n" +
          "\n" +
          "// === in 연산자: 프로퍼티 존재 확인 ===\n" +
          "type Fish = { swim(): void };\n" +
          "type Bird = { fly(): void };\n" +
          "\n" +
          "function move(animal: Fish | Bird) {\n" +
          "  if (\"swim\" in animal) {\n" +
          "    animal.swim(); // Fish로 좁혀짐\n" +
          "  } else {\n" +
          "    animal.fly();  // Bird로 좁혀짐\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// === 동등성 검사 ===\n" +
          "function example(x: string | null) {\n" +
          "  if (x !== null) {\n" +
          "    x.toUpperCase(); // string으로 좁혀짐\n" +
          "  }\n" +
          "}",
        description:
          "typeof는 원시 타입, instanceof는 클래스, in은 프로퍼티 존재 여부로 타입을 좁힙니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 커스텀 타입 가드와 완전성 검사",
      content:
        "기본 가드로 해결할 수 없는 복잡한 케이스에서 커스텀 타입 가드(is)를 정의하고, never를 이용한 완전성 검사(exhaustiveness check)로 모든 분기를 빠짐없이 처리하는 패턴을 연습합니다.",
      code: {
        language: "typescript",
        code:
          "// === 커스텀 타입 가드 (is) ===\n" +
          "type Circle = { kind: \"circle\"; radius: number };\n" +
          "type Square = { kind: \"square\"; side: number };\n" +
          "type Shape = Circle | Square;\n" +
          "\n" +
          "// 반환 타입이 'shape is Circle' — TS에게 타입 정보 전달\n" +
          "function isCircle(shape: Shape): shape is Circle {\n" +
          "  return shape.kind === \"circle\";\n" +
          "}\n" +
          "\n" +
          "function getArea(shape: Shape): number {\n" +
          "  if (isCircle(shape)) {\n" +
          "    // shape는 Circle로 좁혀짐\n" +
          "    return Math.PI * shape.radius ** 2;\n" +
          "  }\n" +
          "  // shape는 Square로 좁혀짐\n" +
          "  return shape.side ** 2;\n" +
          "}\n" +
          "\n" +
          "// === 단언 함수 (asserts) ===\n" +
          "function assertDefined<T>(\n" +
          "  value: T | null | undefined,\n" +
          "  message: string\n" +
          "): asserts value is T {\n" +
          "  if (value === null || value === undefined) {\n" +
          "    throw new Error(message);\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "function processUser(name: string | null) {\n" +
          "  assertDefined(name, \"이름이 필요합니다\");\n" +
          "  // 이후 name은 string (null이 제거됨)\n" +
          "  console.log(name.toUpperCase());\n" +
          "}\n" +
          "\n" +
          "// === never를 이용한 완전성 검사 ===\n" +
          "function exhaustiveCheck(value: never): never {\n" +
          "  throw new Error(`처리되지 않은 케이스: ${value}`);\n" +
          "}\n" +
          "\n" +
          "function describeShape(shape: Shape): string {\n" +
          "  switch (shape.kind) {\n" +
          "    case \"circle\":\n" +
          "      return `원 (반지름: ${shape.radius})`;\n" +
          "    case \"square\":\n" +
          "      return `정사각형 (변: ${shape.side})`;\n" +
          "    default:\n" +
          "      return exhaustiveCheck(shape); // 모든 케이스 처리 보장\n" +
          "  }\n" +
          "}",
        description:
          "커스텀 타입 가드(is)로 복잡한 판별을, 단언 함수(asserts)로 조건 검증을, never로 완전성을 보장합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 기법 | 용도 | 예시 |\n" +
        "|------|------|------|\n" +
        "| typeof | 원시 타입 구분 | `typeof x === 'string'` |\n" +
        "| instanceof | 클래스 인스턴스 | `x instanceof Date` |\n" +
        "| in | 프로퍼티 존재 | `'swim' in animal` |\n" +
        "| === / !== | 리터럴/null 비교 | `x !== null` |\n" +
        "| is (타입 가드) | 커스텀 판별 | `x is Circle` |\n" +
        "| asserts | 조건 단언 | `asserts x is T` |\n" +
        "| never | 완전성 검사 | `exhaustiveCheck(x)` |\n\n" +
        "**핵심:** TypeScript의 제어 흐름 분석은 조건문, 반복문, 예외 처리를 따라가며 자동으로 타입을 좁힙니다. 기본 가드로 부족할 때는 커스텀 타입 가드(is)를, 모든 분기 처리를 보장하려면 never 기반 완전성 검사를 사용합니다.\n\n" +
        "**다음 챕터 미리보기:** 타입 좁히기를 더 구조적으로 할 수 있는 '판별 유니온(Discriminated Union)' 패턴을 배웁니다. 공통 리터럴 프로퍼티를 이용한 switch 기반의 우아한 타입 분기를 익힙니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "타입 좁히기는 유니온 타입에서 특정 타입으로 범위를 좁혀가는 과정이다. typeof, instanceof, in, 동등성 검사를 통해 TypeScript가 자동으로 타입을 추론하며, 커스텀 타입 가드(is)로 복잡한 좁히기를 직접 정의할 수 있다.",
  checklist: [
    "typeof, instanceof, in 연산자로 타입을 좁히는 방법을 알고 있다",
    "제어 흐름 분석(CFA)이 자동으로 타입을 좁히는 원리를 이해한다",
    "커스텀 타입 가드(is)를 직접 정의할 수 있다",
    "단언 함수(asserts)의 용도와 작성법을 알고 있다",
    "never를 이용한 완전성 검사 패턴을 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "typeof value === 'object'로 좁혔을 때, value의 타입에 포함될 수 있는 것은?",
      choices: ["string", "number", "null", "boolean"],
      correctIndex: 2,
      explanation:
        "JavaScript에서 typeof null은 'object'를 반환합니다. 따라서 typeof로 object를 체크할 때는 null도 함께 걸러야 합니다.",
    },
    {
      id: "q2",
      question: "커스텀 타입 가드의 반환 타입 형태로 올바른 것은?",
      choices: [
        "value: Type",
        "value is Type",
        "value as Type",
        "value extends Type",
      ],
      correctIndex: 1,
      explanation:
        "커스텀 타입 가드는 'paramName is Type' 형태의 반환 타입을 사용합니다. 함수가 true를 반환하면 해당 매개변수가 Type으로 좁혀집니다.",
    },
    {
      id: "q3",
      question: "never를 이용한 완전성 검사의 주된 목적은?",
      choices: [
        "런타임 성능 최적화",
        "유니온의 모든 케이스를 처리했는지 컴파일 타임에 검증",
        "타입을 any로 변환",
        "코드 가독성 향상",
      ],
      correctIndex: 1,
      explanation:
        "switch문에서 모든 케이스를 처리하면 default에서 값이 never 타입이 됩니다. 새 타입이 유니온에 추가되면 never에 할당할 수 없어 컴파일 에러가 발생합니다.",
    },
    {
      id: "q4",
      question: "다음 중 in 연산자를 사용한 타입 좁히기의 장점은?",
      choices: [
        "원시 타입을 구분할 수 있다",
        "클래스 인스턴스를 확인할 수 있다",
        "특정 프로퍼티 유무로 객체 타입을 구분할 수 있다",
        "null과 undefined를 구분할 수 있다",
      ],
      correctIndex: 2,
      explanation:
        "in 연산자는 객체에 특정 프로퍼티가 존재하는지 확인합니다. 인터페이스나 타입 별칭으로 정의된 객체 타입을 런타임에 구분할 때 유용합니다.",
    },
    {
      id: "q5",
      question: "asserts value is T 형태의 단언 함수가 하는 역할은?",
      choices: [
        "value를 T로 캐스팅한다",
        "조건이 거짓이면 에러를 던지고, 이후 코드에서 value를 T로 좁힌다",
        "value의 타입을 런타임에 변경한다",
        "T 타입의 새 값을 반환한다",
      ],
      correctIndex: 1,
      explanation:
        "단언 함수는 조건을 검증하고, 통과하지 못하면 에러를 던집니다. 에러 없이 함수가 반환되면 TypeScript는 이후 코드에서 해당 값을 지정된 타입으로 좁힙니다.",
    },
  ],
};

export default chapter;
