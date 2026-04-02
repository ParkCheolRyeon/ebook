import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-02",
  title: "중간 점검 2: 제네릭 ~ 고급 타입",
  coverGroups: ["제네릭", "고급 타입"],
  questions: [
    {
      id: "mid02-q1",
      question:
        "다음 제네릭 함수에서 T의 역할은?\n\nfunction identity<T>(arg: T): T {\n  return arg;\n}\nconst result = identity(\"hello\");",
      choices: [
        "T는 any와 동일하다",
        "T는 호출 시점의 인자 타입으로 추론되어 입출력 타입의 관계를 보장한다",
        "T는 항상 string이다",
        "T는 런타임에 타입 검사를 수행한다",
      ],
      correctIndex: 1,
      explanation:
        "제네릭 타입 변수 T는 호출 시 인자로부터 추론됩니다. identity(\"hello\")에서 T는 string으로 추론되어 반환 타입도 string이 됩니다. 타입 간의 관계를 표현하는 것이 핵심입니다.",
    },
    {
      id: "mid02-q2",
      question:
        "다음 코드에서 에러가 발생하는 이유는?\n\nfunction getLength<T>(arg: T): number {\n  return arg.length;\n}",
      choices: [
        "T에 반환 타입을 지정하지 않아서",
        "T가 length 속성을 가진다는 보장이 없기 때문이다",
        "제네릭에서 프로퍼티 접근이 불가능해서",
        "number를 반환할 수 없어서",
      ],
      correctIndex: 1,
      explanation:
        "T는 아무 타입이나 될 수 있으므로 length 속성이 있다고 보장할 수 없습니다. T extends { length: number }와 같은 제약 조건(constraint)을 추가해야 합니다.",
    },
    {
      id: "mid02-q3",
      question:
        "다음 코드에서 result의 타입은?\n\nfunction merge<T, U>(a: T, b: U): T & U {\n  return { ...a, ...b };\n}\nconst result = merge({ name: \"Kim\" }, { age: 25 });",
      choices: [
        "{ name: string } | { age: number }",
        "{ name: string } & { age: number }",
        "object",
        "any",
      ],
      correctIndex: 1,
      explanation:
        "반환 타입이 T & U로 선언되어 있으므로, 두 타입의 인터섹션이 됩니다. result는 { name: string } & { age: number }로 추론되어 name과 age 모두 접근 가능합니다.",
    },
    {
      id: "mid02-q4",
      question:
        "Partial<T>와 Required<T>의 관계를 올바르게 설명한 것은?",
      choices: [
        "둘 다 모든 속성을 선택적으로 만든다",
        "Partial은 모든 속성을 선택적으로, Required는 모든 속성을 필수로 만든다",
        "Partial은 속성을 제거하고, Required는 속성을 추가한다",
        "둘 다 readonly를 추가한다",
      ],
      correctIndex: 1,
      explanation:
        "Partial<T>는 모든 속성에 ?를 추가하여 선택적으로 만들고, Required<T>는 모든 ?를 제거하여 필수로 만듭니다. 둘은 정반대의 유틸리티 타입입니다.",
    },
    {
      id: "mid02-q5",
      question:
        "다음 Pick과 Omit의 차이는?\n\ntype User = { id: number; name: string; email: string };\ntype A = Pick<User, \"id\" | \"name\">;\ntype B = Omit<User, \"email\">;",
      choices: [
        "A와 B는 다른 결과를 가진다",
        "A와 B는 동일한 타입 { id: number; name: string }이다",
        "A는 에러가 발생한다",
        "B는 빈 객체 타입이다",
      ],
      correctIndex: 1,
      explanation:
        "Pick은 지정한 키만 선택하고, Omit은 지정한 키를 제외합니다. 이 경우 Pick<User, \"id\" | \"name\">과 Omit<User, \"email\">은 동일하게 { id: number; name: string }이 됩니다.",
    },
    {
      id: "mid02-q6",
      question:
        "다음 Mapped Type의 동작을 올바르게 설명한 것은?\n\ntype Readonly<T> = {\n  readonly [K in keyof T]: T[K];\n};",
      choices: [
        "T의 모든 속성을 선택적으로 만든다",
        "T의 모든 키를 순회하며 각 속성에 readonly를 추가한다",
        "T의 속성 값을 string으로 변환한다",
        "T의 키를 제거한다",
      ],
      correctIndex: 1,
      explanation:
        "Mapped Type은 keyof T로 모든 키를 추출한 뒤 in 키워드로 각 키를 순회합니다. 각 속성에 readonly 수식어를 추가하여 불변 버전의 타입을 생성합니다.",
    },
    {
      id: "mid02-q7",
      question:
        "다음 조건부 타입에서 결과 타입은?\n\ntype IsString<T> = T extends string ? \"yes\" : \"no\";\ntype A = IsString<string>;\ntype B = IsString<number>;\ntype C = IsString<string | number>;",
      choices: [
        "A = \"yes\", B = \"no\", C = \"no\"",
        "A = \"yes\", B = \"no\", C = \"yes\" | \"no\"",
        "A = \"yes\", B = \"no\", C = \"yes\"",
        "A = \"yes\", B = \"no\", C = never",
      ],
      correctIndex: 1,
      explanation:
        "조건부 타입에 유니온 타입을 전달하면 분배(distributive)됩니다. IsString<string | number>는 IsString<string> | IsString<number>로 분배되어 \"yes\" | \"no\"가 됩니다.",
    },
    {
      id: "mid02-q8",
      question:
        "분배 조건부 타입(Distributive Conditional Type)을 비활성화하려면?",
      choices: [
        "never를 사용한다",
        "타입 매개변수를 대괄호로 감싼다: [T] extends [string]",
        "readonly를 추가한다",
        "비활성화할 수 없다",
      ],
      correctIndex: 1,
      explanation:
        "타입 매개변수를 튜플로 감싸면([T] extends [string]) 분배가 비활성화됩니다. 유니온 전체를 하나의 단위로 비교하게 되어 string | number extends string은 false가 됩니다.",
    },
    {
      id: "mid02-q9",
      question:
        "다음 Template Literal Type의 결과는?\n\ntype Color = \"red\" | \"blue\";\ntype Size = \"sm\" | \"lg\";\ntype ClassName = `${Color}-${Size}`;",
      choices: [
        "string",
        "\"red-sm\" | \"red-lg\" | \"blue-sm\" | \"blue-lg\"",
        "\"red\" | \"blue\" | \"sm\" | \"lg\"",
        "\"red-blue-sm-lg\"",
      ],
      correctIndex: 1,
      explanation:
        "템플릿 리터럴 타입은 유니온의 각 멤버를 조합합니다. Color(2개) x Size(2개) = 4개의 조합이 생성되어 모든 가능한 문자열 리터럴의 유니온이 됩니다.",
    },
    {
      id: "mid02-q10",
      question:
        "다음 코드에서 infer 키워드의 역할은?\n\ntype ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;",
      choices: [
        "R을 any로 지정한다",
        "함수의 반환 타입을 R이라는 변수로 추출하여 사용한다",
        "R을 never로 초기화한다",
        "타입 에러를 무시한다",
      ],
      correctIndex: 1,
      explanation:
        "infer 키워드는 조건부 타입의 extends 절에서 타입을 추론하여 변수에 캡처합니다. T가 함수 타입이면 반환 타입을 R로 추출하고, true 분기에서 R을 사용할 수 있습니다.",
    },
  ],
};

export default midQuiz;
