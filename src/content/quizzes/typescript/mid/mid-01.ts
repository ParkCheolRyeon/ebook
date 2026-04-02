import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-01",
  title: "중간 점검 1: 기초 ~ 타입 좁히기",
  coverGroups: ["기초", "타입 좁히기"],
  questions: [
    {
      id: "mid01-q1",
      question:
        "다음 코드의 결과로 올바른 것은?\n\nlet x = 10;\nlet y: number = 10;\n\n위 두 변수의 타입 차이는?",
      choices: [
        "x는 any, y는 number이다",
        "둘 다 number이며 차이가 없다",
        "x는 10 리터럴 타입, y는 number이다",
        "x는 unknown, y는 number이다",
      ],
      correctIndex: 1,
      explanation:
        "let으로 선언하면 TypeScript는 타입을 넓혀서(widening) 추론합니다. let x = 10은 number로 추론되므로 명시적으로 선언한 y: number와 동일합니다.",
    },
    {
      id: "mid01-q2",
      question:
        "다음 중 any와 unknown의 차이를 올바르게 설명한 것은?",
      choices: [
        "any는 타입 검사를 비활성화하고, unknown은 사용 전 타입 좁히기를 강제한다",
        "unknown은 any의 별칭이며 동작이 동일하다",
        "any는 런타임에만 존재하고, unknown은 컴파일 타임에만 존재한다",
        "unknown 타입 변수에는 값을 할당할 수 없다",
      ],
      correctIndex: 0,
      explanation:
        "any는 모든 타입 검사를 우회하여 아무 연산이나 가능합니다. unknown은 모든 값을 받을 수 있지만, 사용하려면 typeof, instanceof 등으로 타입을 좁혀야 합니다. 안전한 코드를 위해 unknown을 권장합니다.",
    },
    {
      id: "mid01-q3",
      question:
        "다음 코드에서 타입 에러가 발생하는 이유는?\n\nconst config = {\n  url: \"https://api.example.com\",\n  method: \"GET\",\n};\n\nfetch(config.url, { method: config.method });",
      choices: [
        "url 속성이 string이 아니기 때문이다",
        "config.method가 string으로 추론되어 'GET' | 'POST' | ... 리터럴 유니온에 호환되지 않기 때문이다",
        "fetch 함수에 객체를 전달할 수 없기 때문이다",
        "config가 readonly이기 때문이다",
      ],
      correctIndex: 1,
      explanation:
        "객체의 프로퍼티는 let처럼 넓게 추론됩니다. config.method는 \"GET\" 리터럴이 아닌 string으로 추론됩니다. as const를 사용하거나 method: \"GET\" as const로 리터럴 타입을 유지해야 합니다.",
    },
    {
      id: "mid01-q4",
      question:
        "다음 코드에서 result의 타입은?\n\nfunction add(a: number, b: number) {\n  return a + b;\n}\nconst result = add(1, 2);",
      choices: [
        "any",
        "number",
        "string | number",
        "unknown",
      ],
      correctIndex: 1,
      explanation:
        "TypeScript는 반환 타입을 자동으로 추론합니다. a + b에서 a와 b가 모두 number이므로 반환 타입은 number로 추론됩니다.",
    },
    {
      id: "mid01-q5",
      question:
        "interface와 type의 차이로 올바른 것은?",
      choices: [
        "type은 확장이 불가능하지만, interface는 가능하다",
        "interface는 선언 병합(declaration merging)이 가능하지만, type은 불가능하다",
        "type은 객체 타입을 정의할 수 없다",
        "interface는 유니온 타입을 지원한다",
      ],
      correctIndex: 1,
      explanation:
        "interface는 동일 이름으로 여러 번 선언하면 자동으로 병합됩니다. type은 중복 선언이 불가능합니다. 반면 type은 유니온, 교차, 튜플 등 더 다양한 타입 표현이 가능합니다.",
    },
    {
      id: "mid01-q6",
      question:
        "다음 코드에서 shape의 타입은?\n\ntype Circle = { kind: \"circle\"; radius: number };\ntype Square = { kind: \"square\"; side: number };\ntype Shape = Circle | Square;\n\nfunction area(shape: Shape) {\n  if (shape.kind === \"circle\") {\n    // 여기서 shape의 타입은?\n  }\n}",
      choices: [
        "Shape",
        "Circle",
        "Circle | Square",
        "{ kind: \"circle\" }",
      ],
      correctIndex: 1,
      explanation:
        "이것은 판별된 유니온(Discriminated Union) 패턴입니다. kind라는 공통 판별자(discriminant) 속성으로 타입을 좁힐 수 있으며, shape.kind === \"circle\" 이후 shape는 Circle로 좁혀집니다.",
    },
    {
      id: "mid01-q7",
      question:
        "다음 중 유니온 타입과 인터섹션 타입의 관계를 올바르게 설명한 것은?\n\ntype A = { name: string };\ntype B = { age: number };\ntype Union = A | B;\ntype Inter = A & B;",
      choices: [
        "Union은 name과 age 모두 필수이고, Inter는 둘 중 하나만 있으면 된다",
        "Union은 A 또는 B 중 하나를 만족하면 되고, Inter는 A와 B를 모두 만족해야 한다",
        "Union과 Inter는 동일하다",
        "Inter는 빈 객체 타입이다",
      ],
      correctIndex: 1,
      explanation:
        "유니온(|)은 '또는'으로, 구성 타입 중 하나를 만족하면 됩니다. 인터섹션(&)은 '그리고'로, 모든 구성 타입의 속성을 동시에 만족해야 합니다.",
    },
    {
      id: "mid01-q8",
      question:
        "다음 코드에서 typeof를 사용한 타입 좁히기가 올바르게 동작하지 않는 경우는?",
      choices: [
        "typeof x === \"string\"",
        "typeof x === \"number\"",
        "typeof x === \"null\"",
        "typeof x === \"boolean\"",
      ],
      correctIndex: 2,
      explanation:
        "JavaScript에서 typeof null은 \"object\"를 반환하는 역사적 버그가 있습니다. 따라서 typeof x === \"null\"은 항상 false이며, null 체크는 x === null을 사용해야 합니다.",
    },
    {
      id: "mid01-q9",
      question:
        "다음 코드에서 as를 사용한 타입 단언(Type Assertion)의 위험성은?\n\nconst input = document.getElementById(\"name\") as HTMLInputElement;\ninput.value = \"hello\";",
      choices: [
        "컴파일 에러가 발생한다",
        "런타임에 요소가 존재하지 않거나 input이 아닐 경우 에러가 발생하지만 컴파일러는 이를 잡지 못한다",
        "타입 단언은 항상 안전하다",
        "as 키워드는 TypeScript에서 지원하지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "타입 단언은 개발자가 타입을 보장하는 것이므로, 컴파일러가 검증하지 않습니다. 실제 DOM에 해당 요소가 없거나 다른 타입이면 런타임 에러가 발생합니다. instanceof 체크를 먼저 하는 것이 안전합니다.",
    },
    {
      id: "mid01-q10",
      question:
        "satisfies 연산자의 장점은 무엇인가?\n\nconst palette = {\n  red: [255, 0, 0],\n  green: \"#00ff00\",\n} satisfies Record<string, string | number[]>;",
      choices: [
        "타입 단언(as)과 동일하게 동작한다",
        "타입 호환성을 검증하면서도 추론된 구체적 타입을 유지한다",
        "런타임에 타입을 검사한다",
        "readonly 속성을 부여한다",
      ],
      correctIndex: 1,
      explanation:
        "satisfies는 표현식이 특정 타입에 호환되는지 검증하면서도, 추론된 구체적 타입을 그대로 유지합니다. palette.red는 number[] 타입으로, palette.green은 string 타입으로 정확히 추론됩니다.",
    },
  ],
};

export default midQuiz;
