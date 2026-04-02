import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "05-objects-and-interfaces",
  subject: "typescript",
  title: "객체와 인터페이스",
  description:
    "TypeScript에서 객체의 형태를 정의하는 interface의 핵심 기능과 활용법을 학습합니다.",
  order: 5,
  group: "기초",
  prerequisites: ["04-functions"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "인터페이스는 **계약서**와 같습니다.\n\n" +
        "회사에서 신입 사원을 뽑을 때 채용 공고(interface)를 냅니다. '이름(string), 나이(number), 이메일(string)을 가진 사람을 구합니다.' 지원자(객체)는 이 조건을 충족해야 합니다.\n\n" +
        "**선택적 프로퍼티(?)**는 '경력 3년 이상(우대)'과 같습니다. 있으면 좋지만 없어도 됩니다.\n\n" +
        "**readonly**는 '주민등록번호'와 같습니다. 한번 등록하면 변경할 수 없습니다.\n\n" +
        "**인덱스 시그니처**는 '기타 자격증(여러 개 가능)'과 같습니다. 미리 이름을 정하지 않았지만, 키와 값의 타입 규칙은 정해져 있습니다.\n\n" +
        "**extends**는 '시니어 개발자 = 주니어 개발자 + 리더십 경험'처럼 기존 조건에 추가 조건을 더하는 것입니다. 기존 인터페이스를 확장하여 더 구체적인 형태를 정의합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "JavaScript 객체는 구조가 유연하지만, 이 유연함이 팀 개발에서 문제를 일으킵니다.\n\n" +
        "**1. 객체 구조의 불명확성**\n" +
        "함수가 `user` 객체를 받을 때, 이 객체에 어떤 프로퍼티가 있어야 하는지 코드를 직접 분석해야 합니다. `user.name`을 쓰는지, `user.username`을 쓰는지 일일이 확인해야 합니다.\n\n" +
        "**2. 누락된 프로퍼티**\n" +
        "필수 프로퍼티를 빠뜨려도 JavaScript에서는 에러가 나지 않습니다. `user.email`이 없으면 그냥 `undefined`가 됩니다. 이 `undefined`가 화면에 표시되거나 API로 전송되면 버그가 됩니다.\n\n" +
        "**3. 의도하지 않은 변경**\n" +
        "설정 객체의 프로퍼티가 어딘가에서 변경되었는데, 어디서 바뀌었는지 추적하기 어렵습니다. 불변이어야 할 값이 변경되는 것을 방지할 수 없습니다.\n\n" +
        "**4. 중복된 타입 정의**\n" +
        "비슷한 객체 구조를 여러 곳에서 반복 정의하면 유지보수가 어려워집니다. 공통 부분을 추출하고 확장하는 체계적인 방법이 필요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "TypeScript의 `interface`는 객체의 형태(shape)를 정의하는 강력한 도구입니다.\n\n" +
        "### interface 선언\n" +
        "`interface User { name: string; age: number; }`처럼 객체가 가져야 할 프로퍼티와 타입을 정의합니다. 이 인터페이스를 충족하지 않는 객체는 컴파일 에러가 됩니다.\n\n" +
        "### 선택적 프로퍼티 (?)\n" +
        "`nickname?: string`처럼 `?`를 붙이면 해당 프로퍼티는 있어도 되고 없어도 됩니다. 타입은 `string | undefined`가 됩니다.\n\n" +
        "### 읽기 전용 (readonly)\n" +
        "`readonly id: number`로 선언하면 초기화 후 변경할 수 없습니다. 설정 객체나 ID 같은 불변 값에 사용합니다.\n\n" +
        "### 인덱스 시그니처\n" +
        "`[key: string]: unknown`으로 동적 키를 허용하면서도 값의 타입을 제한합니다. 딕셔너리 패턴에 유용합니다.\n\n" +
        "### 확장 (extends)\n" +
        "`interface Admin extends User { permissions: string[]; }`로 기존 인터페이스를 확장합니다. 다중 확장(`extends A, B`)도 가능합니다.\n\n" +
        "### 중첩 객체 타이핑\n" +
        "객체 안에 객체가 있는 경우, 각 중첩 수준에서 별도의 인터페이스를 정의하면 재사용성과 가독성이 좋아집니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: interface의 핵심 기능",
      content:
        "interface의 핵심 기능들을 코드로 살펴봅시다. 선택적 프로퍼티, readonly, 인덱스 시그니처, extends를 조합하면 복잡한 객체 구조도 안전하게 표현할 수 있습니다.",
      code: {
        language: "typescript",
        code:
          "// ===== 기본 인터페이스 =====\n" +
          "interface User {\n" +
          "  readonly id: number;       // 읽기 전용\n" +
          "  name: string;              // 필수\n" +
          "  email: string;             // 필수\n" +
          "  nickname?: string;         // 선택적\n" +
          "}\n" +
          "\n" +
          "const user: User = {\n" +
          "  id: 1,\n" +
          '  name: "Alice",\n' +
          '  email: "alice@example.com",\n' +
          "  // nickname은 생략 가능\n" +
          "};\n" +
          "\n" +
          "// user.id = 2; // ❌ readonly이므로 변경 불가\n" +
          "\n" +
          "// ===== 인덱스 시그니처 =====\n" +
          "interface Dictionary {\n" +
          "  [key: string]: string; // 모든 키는 string, 모든 값도 string\n" +
          "}\n" +
          "\n" +
          "const translations: Dictionary = {\n" +
          '  hello: "안녕하세요",\n' +
          '  bye: "안녕히 가세요",\n' +
          "};\n" +
          "\n" +
          "// ===== 확장 (extends) =====\n" +
          "interface Admin extends User {\n" +
          "  permissions: string[];\n" +
          "  lastLogin: Date;\n" +
          "}\n" +
          "\n" +
          "// Admin은 User의 모든 프로퍼티 + permissions + lastLogin\n" +
          "const admin: Admin = {\n" +
          "  id: 1,\n" +
          '  name: "Bob",\n' +
          '  email: "bob@example.com",\n' +
          '  permissions: ["read", "write", "delete"],\n' +
          "  lastLogin: new Date(),\n" +
          "};\n" +
          "\n" +
          "// ===== 다중 확장 =====\n" +
          "interface Timestamps {\n" +
          "  createdAt: Date;\n" +
          "  updatedAt: Date;\n" +
          "}\n" +
          "\n" +
          "interface Article extends User, Timestamps {\n" +
          "  title: string;\n" +
          "  content: string;\n" +
          "}",
        description:
          "interface는 readonly, 선택적 프로퍼티, 인덱스 시그니처, extends를 통해 객체의 형태를 정밀하게 정의합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 중첩 객체와 인터페이스 합성",
      content:
        "실무에서 자주 만나는 중첩 객체 타이핑과 인터페이스를 조합하는 패턴을 연습합니다. API 응답 타이핑, 설정 객체 등 실전 시나리오를 다룹니다.",
      code: {
        language: "typescript",
        code:
          "// 1. 중첩 객체 타이핑\n" +
          "interface Address {\n" +
          "  street: string;\n" +
          "  city: string;\n" +
          "  zipCode: string;\n" +
          "}\n" +
          "\n" +
          "interface Company {\n" +
          "  name: string;\n" +
          "  address: Address; // 중첩 인터페이스\n" +
          "}\n" +
          "\n" +
          "interface Employee {\n" +
          "  readonly id: number;\n" +
          "  name: string;\n" +
          "  company: Company;     // 2단계 중첩\n" +
          "  skills: string[];     // 배열 프로퍼티\n" +
          "}\n" +
          "\n" +
          "// 2. API 응답 타이핑 패턴\n" +
          "interface ApiResponse<T> {\n" +
          "  data: T;\n" +
          "  status: number;\n" +
          "  message: string;\n" +
          "  timestamp: string;\n" +
          "}\n" +
          "\n" +
          "interface PaginatedResponse<T> extends ApiResponse<T[]> {\n" +
          "  page: number;\n" +
          "  totalPages: number;\n" +
          "  totalItems: number;\n" +
          "}\n" +
          "\n" +
          "// 사용 예시\n" +
          "interface Product {\n" +
          "  id: number;\n" +
          "  name: string;\n" +
          "  price: number;\n" +
          "}\n" +
          "\n" +
          "// 타입: { data: Product[], status, message, timestamp, page, totalPages, totalItems }\n" +
          "type ProductListResponse = PaginatedResponse<Product>;\n" +
          "\n" +
          "// 3. 인덱스 시그니처 + 명시적 프로퍼티\n" +
          "interface Config {\n" +
          "  version: number;              // 필수 프로퍼티\n" +
          "  debug: boolean;               // 필수 프로퍼티\n" +
          "  [key: string]: unknown;       // 추가 프로퍼티 허용\n" +
          "}",
        description:
          "중첩 인터페이스와 제네릭 인터페이스를 조합하면 복잡한 API 응답도 타입 안전하게 표현할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 기능 | 문법 | 용도 |\n" +
        "|------|------|------|\n" +
        "| 기본 인터페이스 | `interface User { name: string }` | 객체 형태 정의 |\n" +
        "| 선택적 프로퍼티 | `nickname?: string` | 선택적 필드 |\n" +
        "| 읽기 전용 | `readonly id: number` | 불변 필드 |\n" +
        "| 인덱스 시그니처 | `[key: string]: T` | 동적 키 |\n" +
        "| 확장 | `extends User` | 인터페이스 상속 |\n" +
        "| 다중 확장 | `extends A, B` | 여러 인터페이스 합성 |\n\n" +
        "**핵심:** interface는 객체의 형태(shape)를 정의하는 계약입니다. extends로 확장하고, 선택적 프로퍼티(?)와 readonly로 세밀하게 제어할 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** type alias와 interface의 차이를 깊이 비교합니다. 언제 type을 쓰고 언제 interface를 쓰는지, 선언 병합과 유니온/인터섹션의 차이 등을 다룹니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "interface는 객체의 형태(shape)를 정의하는 계약이다. extends로 확장하고, 선택적 프로퍼티(?)와 readonly로 세밀하게 제어할 수 있다.",
  checklist: [
    "interface로 객체의 형태를 정의할 수 있다",
    "선택적 프로퍼티(?)와 readonly의 용도를 설명할 수 있다",
    "인덱스 시그니처의 개념과 사용 시점을 이해한다",
    "extends를 사용하여 인터페이스를 확장할 수 있다",
    "중첩 객체를 여러 인터페이스로 분리하여 타이핑할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "interface User { readonly id: number; name: string; }에서 user.id = 2를 실행하면?",
      choices: [
        "정상 동작",
        "컴파일 에러 (readonly 위반)",
        "런타임 에러",
        "id가 2로 변경되지만 경고 발생",
      ],
      correctIndex: 1,
      explanation:
        "readonly로 선언된 프로퍼티는 초기화 후 변경할 수 없습니다. 변경을 시도하면 TypeScript 컴파일러가 에러를 보고합니다. 단, 이는 컴파일 타임 검사이며 런타임에서는 실제로 변경이 가능합니다.",
    },
    {
      id: "q2",
      question:
        "interface Config { [key: string]: number; name: string; } 이 코드는?",
      choices: [
        "정상 컴파일",
        "컴파일 에러 (name이 string인데 인덱스 시그니처는 number)",
        "런타임 에러",
        "name이 number로 강제 변환",
      ],
      correctIndex: 1,
      explanation:
        "인덱스 시그니처가 [key: string]: number이면, 모든 프로퍼티의 값이 number여야 합니다. name: string은 이 규칙을 위반하므로 컴파일 에러가 발생합니다.",
    },
    {
      id: "q3",
      question: "interface Admin extends User, Permissions에서 Admin은?",
      choices: [
        "User의 프로퍼티만 가짐",
        "Permissions의 프로퍼티만 가짐",
        "User와 Permissions 모두의 프로퍼티를 가짐",
        "컴파일 에러 (다중 확장 불가)",
      ],
      correctIndex: 2,
      explanation:
        "TypeScript의 interface는 다중 확장(multiple extends)을 지원합니다. Admin은 User와 Permissions 두 인터페이스의 모든 프로퍼티를 상속받습니다.",
    },
    {
      id: "q4",
      question:
        "interface User { name: string; age?: number; }에서 User 타입 객체의 age에 접근하면?",
      choices: [
        "항상 number",
        "number | undefined",
        "number | null",
        "any",
      ],
      correctIndex: 1,
      explanation:
        "선택적 프로퍼티(?)는 해당 프로퍼티가 존재하지 않을 수 있음을 나타냅니다. 따라서 age의 타입은 number | undefined가 됩니다. null은 포함되지 않습니다.",
    },
    {
      id: "q5",
      question: "중첩 객체 타이핑 시 권장되는 방법은?",
      choices: [
        "하나의 인터페이스에 모든 중첩을 인라인으로 작성",
        "중첩 수준마다 별도의 인터페이스를 정의하여 재사용",
        "any 타입으로 중첩 객체를 처리",
        "JSON.stringify 후 문자열로 처리",
      ],
      correctIndex: 1,
      explanation:
        "각 중첩 수준에서 별도의 인터페이스를 정의하면 재사용성과 가독성이 좋아집니다. Address, Company, Employee처럼 분리하면 다른 곳에서도 Address를 재사용할 수 있습니다.",
    },
  ],
};

export default chapter;
