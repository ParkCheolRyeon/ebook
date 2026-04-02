import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "07-union-intersection",
  subject: "typescript",
  title: "유니온과 인터섹션 타입",
  description:
    "유니온(|)과 인터섹션(&) 타입의 의미와 동작 원리를 이해하고, 실무에서 타입을 조합하는 방법을 익힙니다.",
  order: 7,
  group: "타입 좁히기",
  prerequisites: ["06-type-alias-vs-interface"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "유니온과 인터섹션은 집합 이론에서 온 개념입니다.\n\n" +
        "**유니온(A | B)**은 뷔페 메뉴판과 같습니다. '한식 또는 양식 중 하나를 고르세요'라는 뜻입니다. 손님이 한식을 골랐는지 양식을 골랐는지 확인하기 전까지는, 양쪽 모두에 있는 공통 메뉴(예: 샐러드)만 안전하게 제공할 수 있습니다.\n\n" +
        "**인터섹션(A & B)**은 겸직과 같습니다. '개발자이면서 디자이너'라면 두 직군의 능력을 모두 갖고 있어야 합니다. 개발 능력도 쓸 수 있고 디자인 능력도 쓸 수 있으니, 접근할 수 있는 프로퍼티가 오히려 더 많아집니다.\n\n" +
        "직관과 반대로 느껴질 수 있는 핵심: **유니온은 타입의 합집합이지만 접근 가능한 멤버는 교집합**이고, **인터섹션은 타입의 교집합이지만 접근 가능한 멤버는 합집합**입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "실무에서는 하나의 변수가 여러 타입 중 하나일 수 있거나, 여러 타입의 특성을 동시에 가져야 하는 상황이 빈번합니다.\n\n" +
        "**유니온이 필요한 상황:**\n" +
        "- API 응답이 `string`일 수도 있고 `number`일 수도 있는 경우\n" +
        "- 함수 매개변수가 여러 형태를 받아야 하는 경우\n" +
        "- 상태가 'loading', 'success', 'error' 중 하나인 경우\n\n" +
        "**인터섹션이 필요한 상황:**\n" +
        "- 기본 사용자 정보에 관리자 권한을 추가해야 하는 경우\n" +
        "- 여러 mixin의 특성을 하나의 타입으로 합성해야 하는 경우\n" +
        "- 기존 타입을 확장하면서 새 프로퍼티를 추가해야 하는 경우\n\n" +
        "이 두 연산자를 정확히 이해하지 못하면, `string | number` 타입에서 `.toFixed()`를 호출하려다 에러를 만나거나, `string & number`가 왜 `never`가 되는지 혼란을 겪게 됩니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 유니온 타입 (A | B)\n" +
        "유니온 타입의 값에는 **공통 멤버만** 안전하게 접근할 수 있습니다. TypeScript는 해당 값이 A인지 B인지 모르기 때문에, 양쪽 모두에 존재하는 프로퍼티만 허용합니다. 특정 타입의 프로퍼티에 접근하려면 **타입 좁히기**(다음 챕터)가 필요합니다.\n\n" +
        "### 인터섹션 타입 (A & B)\n" +
        "인터섹션 타입의 값은 A와 B의 **모든 프로퍼티**를 가져야 합니다. 객체 타입에서는 두 타입의 프로퍼티를 합친 것과 같고, 원시 타입에서는 양쪽을 동시에 만족하는 타입이 존재하지 않으므로 `never`가 됩니다.\n\n" +
        "### never가 되는 경우\n" +
        "`string & number`는 문자열이면서 동시에 숫자인 값이 존재할 수 없으므로 `never` 타입이 됩니다. 이는 실수로 잘못된 인터섹션을 만들었다는 신호입니다.\n\n" +
        "### 유니온 배열 vs 배열 유니온\n" +
        "`(string | number)[]`는 배열의 각 요소가 string 또는 number이고, `string[] | number[]`는 배열 전체가 string 배열이거나 number 배열이라는 뜻입니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 유니온과 인터섹션의 동작 원리",
      content:
        "TypeScript가 유니온과 인터섹션 타입의 프로퍼티 접근을 어떻게 판단하는지 살펴봅시다. 유니온에서는 공통 멤버만 접근 가능하고, 인터섹션에서는 모든 멤버에 접근 가능한 원리를 코드로 확인합니다.",
      code: {
        language: "typescript",
        code:
          "// === 유니온 타입: 공통 멤버만 접근 가능 ===\n" +
          "type Cat = { name: string; meow(): void };\n" +
          "type Dog = { name: string; bark(): void };\n" +
          "\n" +
          "type Pet = Cat | Dog;\n" +
          "\n" +
          "function greetPet(pet: Pet) {\n" +
          "  console.log(pet.name); // OK: name은 Cat, Dog 모두에 존재\n" +
          "  // pet.meow();  // Error: Dog에는 meow가 없음\n" +
          "  // pet.bark();  // Error: Cat에는 bark가 없음\n" +
          "}\n" +
          "\n" +
          "// === 인터섹션 타입: 모든 멤버 접근 가능 ===\n" +
          "type CatDog = Cat & Dog;\n" +
          "\n" +
          "function superPet(pet: CatDog) {\n" +
          "  pet.name;   // OK\n" +
          "  pet.meow(); // OK: Cat의 메서드\n" +
          "  pet.bark(); // OK: Dog의 메서드\n" +
          "}\n" +
          "\n" +
          "// === never가 되는 경우 ===\n" +
          "type Impossible = string & number; // never\n" +
          "// 문자열이면서 동시에 숫자인 값은 존재하지 않음\n" +
          "\n" +
          "// === 객체 인터섹션은 프로퍼티를 합침 ===\n" +
          "type HasId = { id: number };\n" +
          "type HasEmail = { email: string };\n" +
          "type User = HasId & HasEmail;\n" +
          "// User는 { id: number; email: string } 과 동일",
        description:
          "유니온은 '어느 쪽인지 모르니 공통만', 인터섹션은 '양쪽 모두이니 전부' 접근 가능합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 타입 합성으로 권한 시스템 만들기",
      content:
        "인터섹션으로 기본 사용자 타입에 역할별 권한을 합성하고, 유니온으로 여러 역할을 하나의 타입으로 묶는 실무 패턴을 연습합니다.",
      code: {
        language: "typescript",
        code:
          "// 기본 사용자 타입\n" +
          "type BaseUser = {\n" +
          "  id: number;\n" +
          "  name: string;\n" +
          "  email: string;\n" +
          "};\n" +
          "\n" +
          "// 역할별 권한 타입\n" +
          "type AdminPermissions = {\n" +
          "  role: \"admin\";\n" +
          "  canDeleteUsers: boolean;\n" +
          "  canEditSettings: boolean;\n" +
          "};\n" +
          "\n" +
          "type EditorPermissions = {\n" +
          "  role: \"editor\";\n" +
          "  canEditContent: boolean;\n" +
          "  canPublish: boolean;\n" +
          "};\n" +
          "\n" +
          "type ViewerPermissions = {\n" +
          "  role: \"viewer\";\n" +
          "  canView: boolean;\n" +
          "};\n" +
          "\n" +
          "// 인터섹션으로 역할별 사용자 타입 합성\n" +
          "type Admin = BaseUser & AdminPermissions;\n" +
          "type Editor = BaseUser & EditorPermissions;\n" +
          "type Viewer = BaseUser & ViewerPermissions;\n" +
          "\n" +
          "// 유니온으로 모든 사용자 타입 통합\n" +
          "type AppUser = Admin | Editor | Viewer;\n" +
          "\n" +
          "function getWelcomeMessage(user: AppUser): string {\n" +
          "  // user.role은 모든 타입에 공통 (유니온에서 안전하게 접근)\n" +
          "  // 하지만 user.canDeleteUsers는 접근 불가 (Admin에만 존재)\n" +
          "  return `안녕하세요, ${user.name}님! 역할: ${user.role}`;\n" +
          "}\n" +
          "\n" +
          "// 유니온 배열 vs 배열 유니온\n" +
          "const mixed: (string | number)[] = [1, \"a\", 2, \"b\"]; // 각 요소가 string 또는 number\n" +
          "const either: string[] | number[] = [1, 2, 3];        // 배열 전체가 하나의 타입",
        description:
          "인터섹션(&)으로 타입을 합성하고, 유니온(|)으로 여러 변형을 하나로 묶는 실무 패턴입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 연산자 | 의미 | 접근 가능 멤버 | 원시 타입 결과 |\n" +
        "|--------|------|---------------|---------------|\n" +
        "| A \\| B | A 또는 B | 공통 멤버만 | 더 넓은 타입 |\n" +
        "| A & B | A이면서 B | 모든 멤버 | never (불가능) |\n\n" +
        "**핵심:** 유니온은 값의 가능성을 넓히지만 안전하게 접근할 수 있는 멤버는 줄어들고, 인터섹션은 값의 조건을 엄격하게 하지만 접근할 수 있는 멤버는 늘어납니다. 유니온 타입에서 특정 멤버에 접근하려면 타입 좁히기가 필요합니다.\n\n" +
        "**다음 챕터 미리보기:** 유니온 타입에서 특정 타입으로 범위를 좁히는 '타입 좁히기(Type Narrowing)' 기법을 배웁니다. typeof, instanceof, in 연산자 등을 활용한 다양한 가드 패턴을 익힙니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "유니온(|)은 '이것 또는 저것', 인터섹션(&)은 '이것이면서 저것'이다. 유니온 타입에서는 공통 멤버만 안전하게 접근할 수 있으며, 나머지에 접근하려면 타입 좁히기가 필요하다.",
  checklist: [
    "유니온 타입에서 공통 프로퍼티만 접근 가능한 이유를 설명할 수 있다",
    "인터섹션 타입으로 여러 타입을 합성하는 방법을 알고 있다",
    "string & number가 never가 되는 이유를 이해한다",
    "유니온 배열과 배열 유니온의 차이를 구분할 수 있다",
    "인터섹션과 유니온을 결합하여 실무 타입을 설계할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "type A = { x: number }; type B = { y: string }; type C = A | B; 일 때, C 타입의 변수에서 접근 가능한 프로퍼티는?",
      choices: ["x만", "y만", "x와 y 모두", "아무것도 접근 불가"],
      correctIndex: 3,
      explanation:
        "유니온 타입에서는 모든 구성 타입에 공통으로 존재하는 프로퍼티만 접근할 수 있습니다. A에는 x만, B에는 y만 있으므로 공통 프로퍼티가 없어 아무것도 안전하게 접근할 수 없습니다.",
    },
    {
      id: "q2",
      question: "type X = string & number 의 결과 타입은?",
      choices: ["string", "number", "string | number", "never"],
      correctIndex: 3,
      explanation:
        "문자열이면서 동시에 숫자인 값은 존재하지 않으므로 인터섹션 결과는 never가 됩니다.",
    },
    {
      id: "q3",
      question: "(string | number)[]와 string[] | number[]의 차이로 올바른 것은?",
      choices: [
        "동일한 타입이다",
        "전자는 각 요소가 혼합 가능, 후자는 배열 전체가 한 타입",
        "전자는 배열 전체가 한 타입, 후자는 각 요소가 혼합 가능",
        "둘 다 number 요소를 포함할 수 없다",
      ],
      correctIndex: 1,
      explanation:
        "(string | number)[]는 배열의 각 요소가 string 또는 number일 수 있어 [1, 'a'] 가능하고, string[] | number[]는 배열 전체가 string 배열이거나 number 배열이어야 합니다.",
    },
    {
      id: "q4",
      question: "type A = { id: number }; type B = { name: string }; type C = A & B; 일 때 C 타입은?",
      choices: [
        "{ id: number } 또는 { name: string }",
        "{ id: number; name: string }",
        "never",
        "{ id: number } | { name: string }",
      ],
      correctIndex: 1,
      explanation:
        "객체 타입의 인터섹션은 양쪽의 모든 프로퍼티를 합친 결과가 됩니다. C는 id와 name을 모두 가진 타입입니다.",
    },
    {
      id: "q5",
      question: "유니온 타입에서 특정 구성 타입의 프로퍼티에 접근하려면 무엇이 필요한가?",
      choices: [
        "타입 단언(as)",
        "타입 좁히기(Type Narrowing)",
        "제네릭",
        "인터섹션으로 변환",
      ],
      correctIndex: 1,
      explanation:
        "유니온 타입에서 특정 타입의 프로퍼티에 접근하려면 typeof, instanceof, in 연산자 등을 사용한 타입 좁히기가 필요합니다. 타입 단언도 가능하지만 런타임 안전성이 없으므로 타입 좁히기가 권장됩니다.",
    },
  ],
};

export default chapter;
