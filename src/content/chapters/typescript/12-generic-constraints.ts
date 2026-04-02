import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "12-generic-constraints",
  subject: "typescript",
  title: "제네릭 제약 조건",
  description:
    "extends로 제네릭에 제약을 걸고, keyof와 결합하여 객체의 키를 타입 안전하게 다루는 방법을 마스터합니다.",
  order: 12,
  group: "제네릭",
  prerequisites: ["11-generics-basics"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "제네릭 제약은 **놀이공원 탑승 조건**과 같습니다.\n\n" +
        "놀이공원의 롤러코스터에는 '키 130cm 이상만 탑승 가능'이라는 조건이 있습니다. 누구든 탈 수 있지만, **최소 조건**을 만족해야 합니다. 키가 130cm인 사람도, 180cm인 사람도 탈 수 있지만, 120cm인 사람은 안 됩니다.\n\n" +
        "`T extends { length: number }`는 '최소한 length 프로퍼티가 있는 타입만 받겠다'는 탑승 조건입니다. string, 배열, { length: 10 } 모두 탈 수 있지만, number는 length가 없으니 탑승 불가입니다.\n\n" +
        "**keyof와의 결합**은 '이 놀이공원에 있는 시설만 이용 가능'이라는 조건입니다. `K extends keyof T`는 '객체 T에 실제로 존재하는 키만 허용하겠다'는 뜻입니다. 존재하지 않는 키를 요청하면 컴파일 에러로 차단됩니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "제네릭은 어떤 타입이든 받을 수 있지만, 때로는 이것이 문제가 됩니다:\n\n" +
        "```\n" +
        "function getLength<T>(value: T): number {\n" +
        "  return value.length; // Error! T에 length가 있는지 모름\n" +
        "}\n" +
        "```\n\n" +
        "T가 number일 수도 있는데, number에는 length가 없습니다. TypeScript는 T가 무엇이든 될 수 있으므로 length 접근을 허용하지 않습니다.\n\n" +
        "또 다른 문제:\n" +
        "```\n" +
        "function getProperty<T>(obj: T, key: string) {\n" +
        "  return obj[key]; // 어떤 키든 허용 — 존재하지 않는 키도!\n" +
        "}\n" +
        "```\n\n" +
        "key가 일반 string이므로 obj에 없는 키를 전달해도 에러가 나지 않습니다. 반환 타입도 any가 되어 타입 안전성이 없습니다.\n\n" +
        "제네릭에 '최소한 이 형태를 만족해야 한다'는 제약을 걸어야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### extends로 제약 걸기\n" +
        "`T extends Constraint` 문법으로 T가 최소한 Constraint를 만족하는 타입이어야 함을 선언합니다. 이후 T에서 Constraint의 프로퍼티에 안전하게 접근할 수 있습니다.\n\n" +
        "### keyof와 결합\n" +
        "`K extends keyof T`로 K를 T의 실제 키로 제한합니다. `obj[key]`의 반환 타입이 `T[K]`로 정확히 추론되어, 객체의 키-값 관계가 타입 레벨에서 보존됩니다.\n\n" +
        "### 여러 제약 조건 조합\n" +
        "인터섹션으로 여러 제약을 결합할 수 있습니다: `T extends HasId & HasName`은 id와 name 모두 가진 타입만 허용합니다.\n\n" +
        "### 제약과 기본값의 관계\n" +
        "기본 타입 매개변수는 제약을 만족해야 합니다: `<T extends object = Record<string, unknown>>`에서 기본값 Record는 object 제약을 만족합니다.\n\n" +
        "### 조건부 반환 타입\n" +
        "제약과 오버로드를 결합하면, 입력 타입에 따라 반환 타입을 다르게 지정할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 제약 조건 패턴",
      content:
        "extends 제약, keyof 결합, 여러 제약 조합 등 다양한 제약 패턴을 코드로 확인합니다. 각 패턴이 타입 안전성을 어떻게 보장하는지 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          "// === extends 제약: 최소 형태 보장 ===\n" +
          "interface HasLength {\n" +
          "  length: number;\n" +
          "}\n" +
          "\n" +
          "function getLength<T extends HasLength>(value: T): number {\n" +
          "  return value.length; // OK: T에 length가 반드시 있음\n" +
          "}\n" +
          "\n" +
          "getLength(\"hello\");     // OK: string에 length 있음\n" +
          "getLength([1, 2, 3]);   // OK: 배열에 length 있음\n" +
          "// getLength(42);       // Error: number에 length 없음\n" +
          "\n" +
          "// === keyof 결합: 객체 키 타입 안전 ===\n" +
          "function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n" +
          "  return obj[key];\n" +
          "}\n" +
          "\n" +
          "const user = { name: \"Alice\", age: 30, email: \"a@b.com\" };\n" +
          "const name = getProperty(user, \"name\");  // string\n" +
          "const age = getProperty(user, \"age\");    // number\n" +
          "// getProperty(user, \"phone\");            // Error: \"phone\"은 keyof T가 아님\n" +
          "\n" +
          "// === 여러 제약 조합 ===\n" +
          "interface HasId { id: number; }\n" +
          "interface HasTimestamp { createdAt: Date; }\n" +
          "\n" +
          "function logEntity<T extends HasId & HasTimestamp>(entity: T): void {\n" +
          "  console.log(`ID: ${entity.id}, Created: ${entity.createdAt}`);\n" +
          "}\n" +
          "\n" +
          "// === 제약 + 기본값 ===\n" +
          "function createState<T extends object = Record<string, unknown>>(\n" +
          "  initial: T\n" +
          "): { get: () => T; set: (value: T) => void } {\n" +
          "  let state = initial;\n" +
          "  return {\n" +
          "    get: () => state,\n" +
          "    set: (value: T) => { state = value; },\n" +
          "  };\n" +
          "}",
        description:
          "extends로 제네릭이 최소한의 형태를 보장하고, keyof로 객체의 키를 안전하게 다룹니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 타입 안전한 pick 함수 구현",
      content:
        "제네릭 제약을 활용하여 객체에서 특정 키만 선택하는 pick 함수를 구현합니다. TypeScript의 내장 Utility Type인 Pick<T, K>의 동작 원리를 직접 체험해봅시다.",
      code: {
        language: "typescript",
        code:
          "// === 타입 안전한 pick 함수 ===\n" +
          "function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {\n" +
          "  const result = {} as Pick<T, K>;\n" +
          "  for (const key of keys) {\n" +
          "    result[key] = obj[key];\n" +
          "  }\n" +
          "  return result;\n" +
          "}\n" +
          "\n" +
          "interface User {\n" +
          "  id: number;\n" +
          "  name: string;\n" +
          "  email: string;\n" +
          "  password: string;\n" +
          "}\n" +
          "\n" +
          "const user: User = {\n" +
          "  id: 1,\n" +
          "  name: \"Alice\",\n" +
          "  email: \"alice@example.com\",\n" +
          "  password: \"secret\",\n" +
          "};\n" +
          "\n" +
          "// 공개 정보만 선택\n" +
          "const publicInfo = pick(user, [\"id\", \"name\", \"email\"]);\n" +
          "// 타입: Pick<User, \"id\" | \"name\" | \"email\">\n" +
          "// = { id: number; name: string; email: string }\n" +
          "\n" +
          "// pick(user, [\"phone\"]); // Error: \"phone\"은 keyof User가 아님\n" +
          "\n" +
          "// === 실무 활용: API 응답에서 필요한 필드만 추출 ===\n" +
          "function selectFields<T, K extends keyof T>(\n" +
          "  items: T[],\n" +
          "  fields: K[]\n" +
          "): Pick<T, K>[] {\n" +
          "  return items.map((item) => pick(item, fields));\n" +
          "}\n" +
          "\n" +
          "const users: User[] = [user];\n" +
          "const nameList = selectFields(users, [\"id\", \"name\"]);\n" +
          "// 타입: Pick<User, \"id\" | \"name\">[] = { id: number; name: string }[]",
        description:
          "K extends keyof T로 존재하는 키만 허용하고, 반환 타입 Pick<T, K>로 정확한 결과 타입을 보장합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 문법 | 효과 |\n" +
        "|------|------|------|\n" +
        "| 기본 제약 | `T extends Type` | T의 최소 형태 보장 |\n" +
        "| keyof 결합 | `K extends keyof T` | 존재하는 키만 허용 |\n" +
        "| 다중 제약 | `T extends A & B` | 여러 조건 동시 만족 |\n" +
        "| 제약 + 기본값 | `T extends C = D` | 기본값은 제약 만족 필요 |\n" +
        "| 인덱스 접근 | `T[K]` | 키에 해당하는 값 타입 추론 |\n\n" +
        "**핵심:** extends로 제네릭에 제약을 걸면 '아무 타입이나'가 아닌 '조건을 만족하는 타입만' 받겠다는 계약이 됩니다. 이 계약 덕분에 제네릭 내부에서 해당 프로퍼티에 안전하게 접근할 수 있고, keyof와 결합하면 객체의 키-값 관계를 타입 레벨에서 완벽히 추적합니다.\n\n" +
        "**다음 챕터 미리보기:** 제네릭의 고급 패턴을 배웁니다. 팩토리 함수, 빌더 패턴, 제네릭 유틸리티 타입 설계 등 실무에서 자주 사용되는 제네릭 활용법을 익힙니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "extends로 제네릭에 제약을 걸면 '최소한 이 형태를 만족하는 타입만 받겠다'는 계약이 된다. keyof T와 결합하면 객체의 키를 타입 안전하게 다룰 수 있다.",
  checklist: [
    "T extends Constraint 문법으로 제네릭에 제약을 걸 수 있다",
    "K extends keyof T로 객체의 키를 타입 안전하게 다룰 수 있다",
    "여러 제약 조건을 인터섹션으로 조합할 수 있다",
    "제약과 기본 타입 매개변수의 관계를 이해한다",
    "pick 같은 타입 안전한 유틸리티 함수를 직접 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "function fn<T extends { name: string }>(obj: T) 에서 fn(42)를 호출하면?",
      choices: [
        "정상 실행",
        "런타임 에러",
        "컴파일 에러: number는 { name: string }을 만족하지 않음",
        "T가 any로 추론됨",
      ],
      correctIndex: 2,
      explanation:
        "T extends { name: string }은 T에 최소한 name: string 프로퍼티가 있어야 한다는 제약입니다. number는 이를 만족하지 않으므로 컴파일 에러가 발생합니다.",
    },
    {
      id: "q2",
      question:
        "function get<T, K extends keyof T>(obj: T, key: K): T[K] 에서 T[K]가 의미하는 것은?",
      choices: [
        "T 타입의 모든 값",
        "K 타입의 모든 값",
        "T 객체에서 K 키에 해당하는 값의 타입",
        "T와 K의 인터섹션",
      ],
      correctIndex: 2,
      explanation:
        "T[K]는 인덱스 접근 타입으로, T 타입의 객체에서 K 키에 해당하는 프로퍼티의 값 타입을 나타냅니다. get(user, 'name')에서 T[K]는 string이 됩니다.",
    },
    {
      id: "q3",
      question: "T extends A & B 제약은 무엇을 의미하는가?",
      choices: [
        "T가 A 또는 B를 만족하면 됨",
        "T가 A와 B를 모두 만족해야 함",
        "T가 A이면서 B가 아니어야 함",
        "T가 never여야 함",
      ],
      correctIndex: 1,
      explanation:
        "인터섹션 제약 A & B는 T가 A의 모든 프로퍼티와 B의 모든 프로퍼티를 동시에 가져야 함을 의미합니다.",
    },
    {
      id: "q4",
      question:
        "<T extends object = string>과 같은 선언이 유효한가?",
      choices: [
        "유효하다",
        "유효하지 않다 — 기본값 string이 제약 object를 만족하지 않음",
        "유효하지 않다 — 기본값은 사용할 수 없음",
        "유효하지 않다 — extends와 기본값을 함께 쓸 수 없음",
      ],
      correctIndex: 1,
      explanation:
        "기본 타입 매개변수는 제약 조건을 만족해야 합니다. string은 object를 만족하지 않으므로(원시 타입) 컴파일 에러가 발생합니다.",
    },
    {
      id: "q5",
      question:
        "pick 함수의 시그니처가 pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>일 때, pick(user, ['name', 'age'])의 반환 타입은?",
      choices: [
        "User",
        "Partial<User>",
        "Pick<User, 'name' | 'age'>",
        "Omit<User, 'name' | 'age'>",
      ],
      correctIndex: 2,
      explanation:
        "K는 'name' | 'age'로 추론되고, 반환 타입 Pick<T, K>는 Pick<User, 'name' | 'age'>가 됩니다. 이는 { name: string; age: number }와 동일합니다.",
    },
  ],
};

export default chapter;
