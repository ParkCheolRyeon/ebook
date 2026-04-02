import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "14-generic-inference",
  subject: "typescript",
  title: "제네릭 추론 전략",
  description: "TypeScript가 제네릭 타입을 자동으로 추론하는 방식, 인자와 반환값 추론, 추론 실패 시 대처법, 추론 우선순위, 콜백 문맥적 추론, 복잡한 추론 체인을 학습합니다.",
  order: 14,
  group: "제네릭",
  prerequisites: ["13-generic-patterns"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "제네릭 추론은 **탐정의 추리**와 같습니다.\n\n" +
        "탐정이 사건 현장에 도착하면 직접적인 증거(함수 인자)부터 살펴봅니다. " +
        "'이 발자국은 운동화다'라는 증거로부터 '용의자는 운동화를 신고 있었다'라고 추론하듯, " +
        "TypeScript는 함수에 전달된 인자의 타입으로부터 제네릭 T가 무엇인지 추론합니다.\n\n" +
        "때로는 증거가 부족합니다. 발자국이 없거나, 여러 증거가 서로 모순될 때처럼 " +
        "TypeScript가 T를 결정할 수 없으면 `unknown`이나 `{}`로 추론하거나 에러를 발생시킵니다. " +
        "이때는 탐정에게 직접 '범인은 이 사람이야'라고 알려주듯, `<string>`처럼 명시적으로 타입을 지정해야 합니다.\n\n" +
        "흥미로운 점은 **문맥적 추론**입니다. 콜백 함수의 매개변수 타입은 '어떤 함수에 전달되는가'라는 맥락에서 추론됩니다. " +
        "마치 '이 편지가 우체통에 넣어져 있었으니, 우표가 붙어 있었을 것이다'라고 추리하는 것과 같습니다. " +
        "TypeScript는 이런 문맥적 단서를 매우 잘 활용합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "제네릭 함수를 호출할 때마다 타입을 일일이 명시하는 것은 번거롭습니다.\n\n" +
        "```typescript\n" +
        "// 매번 이렇게 쓰고 싶지 않다!\n" +
        "const result1 = identity<string>('hello');\n" +
        "const result2 = map<number, string>([1, 2, 3], n => String(n));\n" +
        "const result3 = useState<number>(0);\n" +
        "```\n\n" +
        "하지만 타입을 생략하면 의도치 않은 추론이 발생하기도 합니다.\n\n" +
        "```typescript\n" +
        "// T가 \"hello\"로 추론? string으로 추론?\n" +
        "const x = identity('hello');\n" +
        "\n" +
        "// T가 number | string으로 추론?\n" +
        "function pick<T>(a: T, b: T): T { return a; }\n" +
        "pick(1, 'two'); // 에러? 통과?\n" +
        "```\n\n" +
        "또한, 추론이 전혀 동작하지 않는 위치가 있습니다.\n\n" +
        "```typescript\n" +
        "// 반환 타입만으로는 T를 추론할 수 없음\n" +
        "function createDefault<T>(): T {\n" +
        "  return {} as T; // 호출 시 T를 알 수 없음\n" +
        "}\n" +
        "const val = createDefault(); // T = unknown\n" +
        "```\n\n" +
        "이런 상황에서 추론이 어떻게 동작하는지 이해해야 올바르게 활용할 수 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. 인자로부터의 추론 (Argument Inference)\n" +
        "가장 기본적인 추론 방식입니다. TypeScript는 함수 호출 시 전달된 인자의 타입으로부터 T를 결정합니다. " +
        "`identity('hello')`에서 T는 `string`으로 추론됩니다. 리터럴 타입이 아닌 넓은 타입으로 추론되는 것이 기본 동작입니다.\n\n" +
        "### 2. 반환값 추론\n" +
        "함수의 반환값으로부터 T를 추론하는 것은 불가능합니다. T는 항상 입력(매개변수) 위치에서 추론됩니다. " +
        "반환 타입에만 T가 사용되면 호출 시 명시적 지정이 필요합니다.\n\n" +
        "### 3. 추론 실패 시 대처\n" +
        "추론이 `unknown`이나 `{}`로 떨어지면 호출부에서 `<string>` 형태로 명시적으로 지정합니다. " +
        "또는 기본 타입 매개변수(`T = string`)를 설정하여 지정하지 않았을 때의 기본값을 제공할 수 있습니다.\n\n" +
        "### 4. 추론 우선순위\n" +
        "여러 인자에서 T가 추론되면 TypeScript는 모든 인자를 만족시키는 타입을 찾습니다. " +
        "호환 불가능하면 에러가 발생합니다. 여러 후보 중 가장 넓은(best common type) 타입이 선택됩니다.\n\n" +
        "### 5. 콜백 매개변수의 문맥적 추론\n" +
        "콜백 함수의 매개변수 타입은 상위 함수의 시그니처에서 문맥적으로 추론됩니다. " +
        "`array.map(item => ...)`에서 `item`의 타입은 `array`의 요소 타입에서 자동 결정됩니다.\n\n" +
        "### 6. 추론을 돕는 설계\n" +
        "T를 추론할 수 있는 매개변수를 앞에 배치하고, 의존하는 매개변수를 뒤에 둡니다. " +
        "제네릭 타입 매개변수 수는 최소화하고, 하나의 T에서 나머지를 유도하는 구조가 이상적입니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 추론 메커니즘 분석",
      content:
        "TypeScript의 제네릭 추론이 다양한 상황에서 어떻게 동작하는지 단계별로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// ===== 1. 인자로부터의 추론 =====\n' +
          'function identity<T>(value: T): T {\n' +
          '  return value;\n' +
          '}\n' +
          '\n' +
          'const a = identity("hello");    // T = string\n' +
          'const b = identity(42);          // T = number\n' +
          'const c = identity([1, 2, 3]);   // T = number[]\n' +
          '\n' +
          '// 리터럴 타입으로 추론시키려면 const 단언 사용\n' +
          'const d = identity("hello" as const); // T = "hello"\n' +
          '\n' +
          '// ===== 2. 여러 인자에서의 추론 =====\n' +
          'function merge<T>(a: T, b: T): T {\n' +
          '  return Math.random() > 0.5 ? a : b;\n' +
          '}\n' +
          '\n' +
          'merge(1, 2);        // T = number — OK\n' +
          'merge("a", "b");    // T = string — OK\n' +
          '// merge(1, "two"); // 에러! number와 string 호환 불가\n' +
          '\n' +
          '// 의도적으로 유니온을 허용하려면 매개변수 구조를 바꾸기\n' +
          'function flexible<T, U>(a: T, b: U): T | U {\n' +
          '  return Math.random() > 0.5 ? a : b;\n' +
          '}\n' +
          'flexible(1, "two"); // T = number, U = string, 반환: number | string\n' +
          '\n' +
          '// ===== 3. 추론 실패와 기본 타입 =====\n' +
          'function createState<T = string>(): { value: T | null } {\n' +
          '  return { value: null };\n' +
          '}\n' +
          '\n' +
          'const s1 = createState();           // T = string (기본값)\n' +
          'const s2 = createState<number>();    // T = number (명시적)\n' +
          '\n' +
          '// ===== 4. 추론 우선순위: 매개변수 위치의 중요성 =====\n' +
          '// 나쁜 설계: T를 추론할 단서가 콜백 안에만 있음\n' +
          'function bad<T>(callback: (item: T) => void): void {\n' +
          '  // T를 추론할 수 없음 — callback에서 T가 입력 위치\n' +
          '}\n' +
          '\n' +
          '// 좋은 설계: T를 추론할 단서가 첫 번째 인자에 있음\n' +
          'function good<T>(items: T[], callback: (item: T) => void): void {\n' +
          '  items.forEach(callback);\n' +
          '}\n' +
          '\n' +
          'good([1, 2, 3], (item) => {\n' +
          '  // item은 number로 자동 추론!\n' +
          '  console.log(item.toFixed(2));\n' +
          '});',
        description: "TypeScript는 함수 인자의 타입에서 T를 추론합니다. 여러 인자가 같은 T를 요구하면 호환성을 검사하고, 추론 단서가 없으면 기본값이나 명시적 지정이 필요합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 추론 체인과 문맥적 추론",
      content:
        "복잡한 추론 체인, 콜백의 문맥적 추론, 그리고 추론을 최적화하는 실전 패턴을 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// ===== 문맥적 추론: 콜백 매개변수 =====\n' +
          'const numbers = [1, 2, 3, 4, 5];\n' +
          '\n' +
          '// item은 number로 문맥적 추론\n' +
          'const doubled = numbers.map(item => item * 2);\n' +
          '// doubled: number[]\n' +
          '\n' +
          '// filter에서도 문맥적 추론 작동\n' +
          'const evens = numbers.filter(n => n % 2 === 0);\n' +
          '// evens: number[]\n' +
          '\n' +
          '// ===== 추론 체인: 한 제네릭에서 다른 제네릭 유도 =====\n' +
          'function pipe<A, B, C>(\n' +
          '  fn1: (a: A) => B,\n' +
          '  fn2: (b: B) => C\n' +
          '): (a: A) => C {\n' +
          '  return (a) => fn2(fn1(a));\n' +
          '}\n' +
          '\n' +
          '// A = string, B = number, C = boolean 순차 추론\n' +
          'const transform = pipe(\n' +
          '  (s: string) => s.length,    // string → number\n' +
          '  (n: number) => n > 5        // number → boolean\n' +
          ');\n' +
          '\n' +
          'const result = transform("hello world"); // boolean\n' +
          '\n' +
          '// ===== 조건부 추론: extends와 조합 =====\n' +
          'function process<T extends string | number>(\n' +
          '  value: T\n' +
          '): T extends string ? string[] : number[] {\n' +
          '  if (typeof value === "string") {\n' +
          '    return value.split("") as any;\n' +
          '  }\n' +
          '  return [value, value * 2] as any;\n' +
          '}\n' +
          '\n' +
          'const strResult = process("abc");  // string[]\n' +
          'const numResult = process(42);      // number[]\n' +
          '\n' +
          '// ===== 실전: React스러운 추론 패턴 =====\n' +
          'function useForm<T extends Record<string, any>>(initial: T) {\n' +
          '  let values = { ...initial };\n' +
          '\n' +
          '  function setValue<K extends keyof T>(key: K, value: T[K]) {\n' +
          '    values[key] = value;\n' +
          '  }\n' +
          '\n' +
          '  function getValue<K extends keyof T>(key: K): T[K] {\n' +
          '    return values[key];\n' +
          '  }\n' +
          '\n' +
          '  return { setValue, getValue, values };\n' +
          '}\n' +
          '\n' +
          '// T는 { name: string; age: number }로 추론\n' +
          'const form = useForm({ name: "Kim", age: 25 });\n' +
          'form.setValue("name", "Park");  // OK: value는 string\n' +
          'form.setValue("age", 30);       // OK: value는 number\n' +
          '// form.setValue("age", "thirty"); // 에러! number 기대\n' +
          '// form.setValue("email", "x");    // 에러! "email" 키 없음',
        description: "문맥적 추론은 콜백이 어디에 전달되는지에 따라 매개변수 타입을 결정합니다. 추론 체인은 여러 제네릭이 순차적으로 추론되는 패턴입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**제네릭 추론 = TypeScript가 타입을 자동으로 알아내는 전략**\n\n" +
        "| 추론 방식 | 설명 |\n" +
        "|----------|------|\n" +
        "| 인자 추론 | 함수 인자의 타입에서 T를 결정 |\n" +
        "| 문맥적 추론 | 콜백의 위치에서 매개변수 타입을 결정 |\n" +
        "| 추론 체인 | 한 T로부터 다른 T를 순차적으로 유도 |\n" +
        "| 기본 타입 | T = string으로 추론 실패 시 기본값 제공 |\n" +
        "| 명시적 지정 | <string>으로 직접 T를 지정 |\n\n" +
        "**추론을 잘 활용하는 설계 원칙:**\n" +
        "- T를 추론할 수 있는 인자를 앞에 배치\n" +
        "- 하나의 T에서 나머지를 유도하는 구조 설계\n" +
        "- 추론이 불가능하면 기본 타입 매개변수 활용\n" +
        "- 반환 타입에만 T가 있으면 추론 불가 — 명시적 지정 필요\n\n" +
        "다음 챕터에서는 TypeScript가 제공하는 **유틸리티 타입**을 다룹니다. " +
        "Partial, Pick, Omit 등 내장 타입 변환 도구와 그 내부 구현 원리를 살펴보겠습니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "TypeScript는 함수 인자로부터 제네릭 타입을 자동 추론한다. 추론이 실패하면 명시적으로 <string>처럼 지정하고, 추론을 돕기 위해 매개변수 순서와 구조를 설계하라.",
  checklist: [
    "TypeScript가 함수 인자로부터 제네릭 타입을 추론하는 과정을 설명할 수 있다",
    "추론이 실패하는 상황을 인식하고 명시적 타입 지정으로 해결할 수 있다",
    "기본 타입 매개변수(T = string)를 적절히 활용할 수 있다",
    "콜백 매개변수의 문맥적 추론이 동작하는 원리를 설명할 수 있다",
    "추론이 잘 되도록 함수 매개변수 순서와 구조를 설계할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "identity<T>(value: T): T에서 identity('hello')를 호출하면 T는 무엇으로 추론되는가?",
      choices: [
        '"hello" (리터럴 타입)',
        "string",
        "any",
        "unknown",
      ],
      correctIndex: 1,
      explanation: "TypeScript는 기본적으로 문자열 리터럴을 string으로 넓혀서(widening) 추론합니다. 리터럴 타입으로 추론하려면 as const 단언을 사용해야 합니다.",
    },
    {
      id: "q2",
      question: "다음 중 T를 추론할 수 없는 경우는?",
      choices: [
        "function f<T>(x: T): T — f(42) 호출",
        "function f<T>(arr: T[]): T — f([1,2]) 호출",
        "function f<T>(): T — f() 호출",
        "function f<T>(cb: (x: T) => void, arr: T[]): void — f(x => x, [1]) 호출",
      ],
      correctIndex: 2,
      explanation: "매개변수에 T가 사용되지 않으면 TypeScript는 인자로부터 T를 추론할 수 없습니다. function f<T>(): T는 호출 시 f<string>()처럼 명시적으로 지정해야 합니다.",
    },
    {
      id: "q3",
      question: "기본 타입 매개변수 T = string의 효과는?",
      choices: [
        "T를 항상 string으로 고정한다",
        "명시적 지정이나 추론이 없을 때 T를 string으로 사용한다",
        "T가 반드시 string의 서브타입이어야 한다",
        "런타임에 string으로 변환한다",
      ],
      correctIndex: 1,
      explanation: "기본 타입 매개변수는 추론도 명시적 지정도 없을 때 사용되는 폴백(fallback)입니다. T = string이면 아무 지정 없이 호출했을 때 T가 string이 되지만, <number>로 지정하면 number가 됩니다.",
    },
    {
      id: "q4",
      question: "[1,2,3].map(n => n * 2)에서 n이 number로 추론되는 이유는?",
      choices: [
        "n에 기본 타입이 지정되어 있어서",
        "map 메서드의 시그니처에서 콜백 매개변수 타입이 문맥적으로 추론되어서",
        "TypeScript가 n * 2 연산에서 number를 역추론해서",
        "배열 리터럴이 항상 number[]로 추론되어서",
      ],
      correctIndex: 1,
      explanation: "Array<number>의 map 메서드는 map(cb: (value: number) => U) 시그니처를 가지므로, 콜백의 매개변수 n은 number로 문맥적으로 추론됩니다. 이를 contextual typing이라 합니다.",
    },
    {
      id: "q5",
      question: "제네릭 추론이 잘 동작하도록 함수를 설계할 때 가장 중요한 원칙은?",
      choices: [
        "타입 매개변수를 최대한 많이 사용한다",
        "T를 추론할 수 있는 매개변수를 앞에 배치하고, T에 의존하는 매개변수를 뒤에 둔다",
        "모든 제네릭 타입에 기본값을 지정한다",
        "반환 타입에만 T를 사용한다",
      ],
      correctIndex: 1,
      explanation: "TypeScript는 왼쪽 인자부터 순서대로 추론합니다. T를 추론할 수 있는 인자(예: items: T[])를 먼저 배치하면, 이후 인자(예: callback: (item: T) => void)에서 T가 이미 결정된 상태로 문맥적 추론이 가능합니다.",
    },
  ],
};

export default chapter;
