import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "11-generics-basics",
  subject: "typescript",
  title: "제네릭 기초",
  description:
    "타입의 매개변수화인 제네릭의 개념을 이해하고, 함수/인터페이스/클래스에서 재사용 가능한 타입 안전 코드를 작성합니다.",
  order: 11,
  group: "제네릭",
  prerequisites: ["10-type-assertions"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "제네릭은 **택배 상자 공장**과 같습니다.\n\n" +
        "택배 상자 공장은 '내용물에 맞는 상자'를 만듭니다. 공장에 \"책용 상자 만들어줘\"라고 하면 책 크기에 맞는 상자를, \"노트북용 상자\"라고 하면 노트북에 맞는 상자를 만듭니다. 상자의 구조(접기, 테이프, 라벨)는 같지만, **내용물의 타입**에 따라 크기와 보호재가 달라집니다.\n\n" +
        "이것이 제네릭입니다. `Box<Book>`은 책 상자, `Box<Laptop>`은 노트북 상자입니다. 상자의 동작(넣기, 꺼내기)은 동일하지만, 안에 들어가는 것의 타입이 다릅니다.\n\n" +
        "**any와의 차이**: any는 '아무거나 넣어도 되는 상자'입니다. 책을 넣었는데 꺼낼 때 '이게 뭔지 모르겠다'가 됩니다. 제네릭은 '책을 넣으면 책이 나온다'는 **관계를 보존**합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "함수나 클래스를 만들 때, 다양한 타입에 대해 같은 로직을 반복 작성해야 하는 상황이 생깁니다:\n\n" +
        "```\n" +
        "function getFirstNumber(arr: number[]): number { return arr[0]; }\n" +
        "function getFirstString(arr: string[]): string { return arr[0]; }\n" +
        "function getFirstUser(arr: User[]): User { return arr[0]; }\n" +
        "```\n\n" +
        "로직은 완전히 같은데 타입만 다릅니다. `any`를 쓰면 중복은 해결되지만:\n\n" +
        "```\n" +
        "function getFirst(arr: any[]): any { return arr[0]; }\n" +
        "const result = getFirst([1, 2, 3]); // 타입: any (number가 아님!)\n" +
        "```\n\n" +
        "반환 타입이 `any`가 되어 타입 안전성이 완전히 사라집니다. 우리에게 필요한 것은 **타입을 매개변수로 받아, 입력과 출력 사이의 타입 관계를 보존**하는 방법입니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 제네릭의 핵심 개념\n" +
        "제네릭은 **타입의 변수**입니다. 함수가 값을 매개변수로 받듯, 제네릭은 타입을 매개변수(`<T>`)로 받습니다. 호출 시 구체적 타입이 결정되며, 관련된 모든 곳에 일관되게 적용됩니다.\n\n" +
        "### 타입 추론\n" +
        "대부분의 경우 TypeScript가 인자로부터 타입 매개변수를 자동 추론합니다. `getFirst([1, 2, 3])`에서 T는 자동으로 `number`로 추론됩니다. 명시적 지정(`getFirst<number>([1, 2, 3])`)도 가능합니다.\n\n" +
        "### 적용 범위\n" +
        "- **함수**: `function fn<T>(arg: T): T`\n" +
        "- **인터페이스**: `interface Box<T> { value: T }`\n" +
        "- **타입 별칭**: `type Pair<A, B> = { first: A; second: B }`\n" +
        "- **클래스**: `class Stack<T> { ... }`\n\n" +
        "### 기본 타입 매개변수\n" +
        "`<T = string>`처럼 기본값을 지정하면, 타입 인자를 생략했을 때 기본값이 사용됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 제네릭의 다양한 활용",
      content:
        "제네릭 함수, 인터페이스, 클래스, 여러 타입 매개변수의 사용법을 살펴봅니다. any와의 차이를 명확히 비교하여 제네릭이 타입 관계를 보존하는 원리를 확인합니다.",
      code: {
        language: "typescript",
        code:
          "// === 제네릭 함수: 타입 관계 보존 ===\n" +
          "function getFirst<T>(arr: T[]): T | undefined {\n" +
          "  return arr[0];\n" +
          "}\n" +
          "\n" +
          "const num = getFirst([1, 2, 3]);        // number | undefined\n" +
          "const str = getFirst([\"a\", \"b\"]);        // string | undefined\n" +
          "// T가 입력 배열의 요소 타입으로 자동 추론됨\n" +
          "\n" +
          "// === any와의 차이 ===\n" +
          "function getFirstAny(arr: any[]): any {\n" +
          "  return arr[0];\n" +
          "}\n" +
          "const lost = getFirstAny([1, 2, 3]); // any — 타입 정보 소실!\n" +
          "\n" +
          "// === 여러 타입 매개변수 ===\n" +
          "function makePair<A, B>(first: A, second: B): [A, B] {\n" +
          "  return [first, second];\n" +
          "}\n" +
          "const pair = makePair(\"hello\", 42); // [string, number]\n" +
          "\n" +
          "// === 제네릭 인터페이스 ===\n" +
          "interface ApiResponse<T> {\n" +
          "  data: T;\n" +
          "  status: number;\n" +
          "  message: string;\n" +
          "}\n" +
          "\n" +
          "type UserResponse = ApiResponse<{ id: number; name: string }>;\n" +
          "// data의 타입: { id: number; name: string }\n" +
          "\n" +
          "// === 기본 타입 매개변수 ===\n" +
          "interface Container<T = string> {\n" +
          "  value: T;\n" +
          "}\n" +
          "\n" +
          "const a: Container = { value: \"hello\" };       // T = string (기본값)\n" +
          "const b: Container<number> = { value: 42 };     // T = number",
        description:
          "제네릭은 호출 시 타입이 결정되어 입출력 관계를 보존합니다. any와 달리 타입 정보를 잃지 않습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 제네릭 클래스와 실무 유틸리티",
      content:
        "제네릭 클래스로 타입 안전한 스택(Stack)을 구현하고, 실무에서 자주 사용하는 제네릭 유틸리티 함수를 직접 만들어봅니다.",
      code: {
        language: "typescript",
        code:
          "// === 제네릭 클래스: 타입 안전한 Stack ===\n" +
          "class Stack<T> {\n" +
          "  private items: T[] = [];\n" +
          "\n" +
          "  push(item: T): void {\n" +
          "    this.items.push(item);\n" +
          "  }\n" +
          "\n" +
          "  pop(): T | undefined {\n" +
          "    return this.items.pop();\n" +
          "  }\n" +
          "\n" +
          "  peek(): T | undefined {\n" +
          "    return this.items[this.items.length - 1];\n" +
          "  }\n" +
          "\n" +
          "  get size(): number {\n" +
          "    return this.items.length;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "const numberStack = new Stack<number>();\n" +
          "numberStack.push(1);\n" +
          "numberStack.push(2);\n" +
          "const top = numberStack.pop(); // number | undefined\n" +
          "\n" +
          "// === 실무 유틸리티: 제네릭으로 타입 안전한 groupBy ===\n" +
          "function groupBy<T, K extends string>(\n" +
          "  items: T[],\n" +
          "  keyFn: (item: T) => K\n" +
          "): Record<K, T[]> {\n" +
          "  const result = {} as Record<K, T[]>;\n" +
          "  for (const item of items) {\n" +
          "    const key = keyFn(item);\n" +
          "    if (!result[key]) {\n" +
          "      result[key] = [];\n" +
          "    }\n" +
          "    result[key].push(item);\n" +
          "  }\n" +
          "  return result;\n" +
          "}\n" +
          "\n" +
          "type User = { name: string; role: \"admin\" | \"user\" };\n" +
          "const users: User[] = [\n" +
          "  { name: \"Alice\", role: \"admin\" },\n" +
          "  { name: \"Bob\", role: \"user\" },\n" +
          "];\n" +
          "\n" +
          "const grouped = groupBy(users, (u) => u.role);\n" +
          "// Record<\"admin\" | \"user\", User[]>",
        description:
          "제네릭 클래스로 타입 안전한 자료구조를, 제네릭 함수로 타입을 보존하는 유틸리티를 만듭니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 | 예시 |\n" +
        "|------|------|------|\n" +
        "| 타입 매개변수 | 타입의 변수 | `<T>` |\n" +
        "| 타입 추론 | 인자로부터 자동 결정 | `getFirst([1])` → T=number |\n" +
        "| 여러 매개변수 | 복수 타입 변수 | `<A, B>` |\n" +
        "| 기본값 | 생략 시 사용 | `<T = string>` |\n" +
        "| any와 차이 | 관계 보존 여부 | 제네릭은 입출력 관계 유지 |\n\n" +
        "**핵심:** 제네릭은 '같은 로직, 다른 타입' 상황에서 코드 중복 없이 타입 안전성을 보장합니다. any와 달리 입력 타입과 출력 타입 사이의 관계를 보존하여, 호출하는 쪽에서 정확한 타입 추론을 받을 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** 제네릭에 제약 조건(constraints)을 거는 방법을 배웁니다. extends로 '최소한 이 형태를 만족하는 타입만 받겠다'는 계약을 정의하고, keyof와 결합하여 객체의 키를 타입 안전하게 다루는 기법을 익힙니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "제네릭은 '타입의 변수'다. 함수가 값을 매개변수로 받듯, 제네릭은 타입을 매개변수로 받아 재사용 가능한 타입 안전 코드를 만든다. any와 달리 입출력 간의 타입 관계를 보존한다.",
  checklist: [
    "제네릭의 개념과 <T> 문법을 설명할 수 있다",
    "TypeScript가 제네릭 타입을 자동 추론하는 과정을 이해한다",
    "제네릭 함수, 인터페이스, 클래스를 직접 작성할 수 있다",
    "기본 타입 매개변수를 설정할 수 있다",
    "any와 제네릭의 차이를 명확히 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "function identity<T>(value: T): T { return value; } 에서 identity(42)의 반환 타입은?",
      choices: ["any", "unknown", "number", "42"],
      correctIndex: 2,
      explanation:
        "TypeScript는 인자 42로부터 T를 number로 추론합니다. 따라서 반환 타입도 number가 됩니다.",
    },
    {
      id: "q2",
      question: "제네릭과 any의 가장 큰 차이점은?",
      choices: [
        "제네릭이 더 빠르다",
        "제네릭은 입출력 간 타입 관계를 보존한다",
        "any는 TypeScript에서 사용할 수 없다",
        "제네릭은 원시 타입만 받을 수 있다",
      ],
      correctIndex: 1,
      explanation:
        "any는 타입 정보를 완전히 잃지만, 제네릭은 입력 타입과 출력 타입 사이의 관계를 보존합니다. getFirst<number>([1])은 number를 반환하지만, getFirst(any)([1])은 any를 반환합니다.",
    },
    {
      id: "q3",
      question: "interface Box<T = string> { value: T } 에서 Box 타입으로 사용하면 T는?",
      choices: ["any", "unknown", "string", "never"],
      correctIndex: 2,
      explanation:
        "기본 타입 매개변수가 string으로 지정되어 있으므로, 타입 인자를 생략하면 T는 string이 됩니다.",
    },
    {
      id: "q4",
      question: "function swap<A, B>(pair: [A, B]): [B, A] 에서 swap(['hello', 42])의 반환 타입은?",
      choices: [
        "[string, number]",
        "[number, string]",
        "[any, any]",
        "[unknown, unknown]",
      ],
      correctIndex: 1,
      explanation:
        "A는 string, B는 number로 추론됩니다. 반환 타입 [B, A]는 [number, string]이 됩니다.",
    },
    {
      id: "q5",
      question: "제네릭 클래스 Stack<T>에서 new Stack<number>()로 생성한 인스턴스의 push 메서드는 어떤 타입을 받는가?",
      choices: ["any", "unknown", "number", "string | number"],
      correctIndex: 2,
      explanation:
        "Stack<number>로 인스턴스를 생성하면 T가 number로 결정되어, push(item: T)는 push(item: number)가 됩니다.",
    },
  ],
};

export default chapter;
