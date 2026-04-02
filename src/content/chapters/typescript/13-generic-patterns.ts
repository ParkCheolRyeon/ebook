import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "13-generic-patterns",
  subject: "typescript",
  title: "제네릭 실전 패턴",
  description: "팩토리 패턴, 이벤트 시스템, 빌더 패턴, 리포지토리 패턴, 비동기 제네릭, 고차함수 등 제네릭을 실무에서 활용하는 핵심 디자인 패턴을 학습합니다.",
  order: 13,
  group: "제네릭",
  prerequisites: ["12-generic-constraints"],
  estimatedMinutes: 35,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "제네릭 실전 패턴은 **만능 조립 설명서**와 같습니다.\n\n" +
        "레고 블록을 생각해보세요. 레고 설명서는 '빨간 2x4 블록을 여기에 놓으세요'라고 구체적으로 지시하지만, 만능 설명서는 '**아무 색상의** 2x4 블록을 여기에 놓으세요'라고 합니다. " +
        "어떤 색상을 선택하든 완성품의 구조는 동일하게 유지됩니다.\n\n" +
        "팩토리 패턴은 '어떤 재료든 넣으면 같은 공정으로 제품을 만드는 공장'입니다. " +
        "빌더 패턴은 '재료를 하나씩 추가할 때마다 레시피에 기록되어, 최종 주문서에 모든 재료가 타입으로 남는 것'입니다. " +
        "이벤트 시스템은 '라디오 주파수별로 다른 내용이 전송되듯, 이벤트 이름에 따라 다른 타입의 데이터가 흐르는 것'입니다.\n\n" +
        "이처럼 제네릭 패턴은 **구조는 고정하되, 타입만 교체 가능한 재사용 가능한 설계도**를 만드는 것입니다. " +
        "JS/React 개발자라면 이미 이런 패턴을 사용하고 있지만, 제네릭을 적용하면 타입 안전성까지 확보할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "실무에서 반복적으로 마주치는 타입 안전성 문제들을 살펴봅시다.\n\n" +
        "```typescript\n" +
        "// 문제 1: 팩토리 — 어떤 타입이 만들어지는지 알 수 없음\n" +
        "function createInstance(ctor: any): any {\n" +
        "  return new ctor();\n" +
        "}\n" +
        "const user = createInstance(User); // any 타입...\n" +
        "```\n\n" +
        "```typescript\n" +
        "// 문제 2: 이벤트 시스템 — 이벤트 데이터 타입 보장 불가\n" +
        "emitter.on('userLogin', (data) => {\n" +
        "  // data가 any — user.name에 오타가 있어도 모름\n" +
        "  console.log(data.naem); // 런타임까지 에러 발견 불가\n" +
        "});\n" +
        "```\n\n" +
        "```typescript\n" +
        "// 문제 3: 빌더 — 어떤 필드가 설정되었는지 추적 불가\n" +
        "const config = builder\n" +
        "  .setHost('localhost')\n" +
        "  .setPort(3000)\n" +
        "  .build(); // 필수 필드 누락을 컴파일 타임에 못 잡음\n" +
        "```\n\n" +
        "이 모든 문제의 공통점은 **입력과 출력 사이의 타입 관계가 끊어져 있다**는 것입니다. " +
        "제네릭 패턴으로 이 관계를 복원할 수 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. 팩토리 패턴 (new () => T)\n" +
        "생성자 시그니처를 제네릭으로 받아 반환 타입을 자동 추론합니다. `new (...args: any[]) => T` 형태로 생성자를 표현하면, " +
        "TypeScript가 인스턴스 타입을 정확히 추론합니다.\n\n" +
        "### 2. 제네릭 이벤트 시스템 (EventEmitter<Events>)\n" +
        "이벤트 맵 인터페이스를 제네릭으로 정의하면, 이벤트 이름에 따라 콜백의 매개변수 타입이 자동 결정됩니다. " +
        "`on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void)` 패턴을 사용합니다.\n\n" +
        "### 3. 빌더 패턴 (메서드 체이닝으로 타입 누적)\n" +
        "각 메서드가 호출될 때마다 타입 매개변수에 설정된 필드를 누적합니다. " +
        "최종 `build()` 시점에서 필수 필드가 모두 포함되었는지 컴파일 타임에 검증할 수 있습니다.\n\n" +
        "### 4. 제네릭 리포지토리 (CRUD<T>)\n" +
        "데이터 모델 타입을 제네릭으로 받아 CRUD 메서드의 입출력 타입을 자동 연결합니다. " +
        "`findById`는 `T | null`을, `create`는 `T`를 반환하는 식으로 일관된 타입 안전성을 보장합니다.\n\n" +
        "### 5. Promise<T>와 비동기 제네릭\n" +
        "`async` 함수의 반환 타입은 자동으로 `Promise<T>`가 됩니다. " +
        "제네릭 비동기 함수를 만들면 `await` 결과의 타입이 자동 추론됩니다.\n\n" +
        "### 6. 제네릭 고차함수 (HOF)\n" +
        "함수를 인자로 받고 함수를 반환하는 고차함수에서 제네릭은 입력 함수의 시그니처를 보존합니다. " +
        "디바운스, 스로틀, 메모이제이션 래퍼 등에 활용됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 제네릭 패턴의 타입 흐름",
      content:
        "각 패턴에서 제네릭이 타입 관계를 어떻게 연결하는지 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// ===== 1. 팩토리 패턴 =====\n' +
          'function create<T>(ctor: new () => T): T {\n' +
          '  return new ctor();\n' +
          '}\n' +
          '\n' +
          'class UserModel {\n' +
          '  name = "default";\n' +
          '  role = "viewer";\n' +
          '}\n' +
          '\n' +
          'const user = create(UserModel);\n' +
          '// user의 타입: UserModel — 자동 추론!\n' +
          'console.log(user.name); // OK\n' +
          '// user.age; // 컴파일 에러: UserModel에 age 없음\n' +
          '\n' +
          '// ===== 2. 제네릭 이벤트 시스템 =====\n' +
          'interface AppEvents {\n' +
          '  userLogin: { userId: string; timestamp: number };\n' +
          '  pageView: { path: string };\n' +
          '  error: { message: string; code: number };\n' +
          '}\n' +
          '\n' +
          'class TypedEmitter<Events extends Record<string, any>> {\n' +
          '  private handlers = new Map<string, Function[]>();\n' +
          '\n' +
          '  on<K extends keyof Events>(\n' +
          '    event: K,\n' +
          '    handler: (data: Events[K]) => void\n' +
          '  ): void {\n' +
          '    const list = this.handlers.get(event as string) || [];\n' +
          '    list.push(handler);\n' +
          '    this.handlers.set(event as string, list);\n' +
          '  }\n' +
          '\n' +
          '  emit<K extends keyof Events>(event: K, data: Events[K]): void {\n' +
          '    const list = this.handlers.get(event as string) || [];\n' +
          '    list.forEach(fn => fn(data));\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          'const emitter = new TypedEmitter<AppEvents>();\n' +
          'emitter.on("userLogin", (data) => {\n' +
          '  // data 타입: { userId: string; timestamp: number }\n' +
          '  console.log(data.userId); // 자동완성 지원!\n' +
          '});\n' +
          '\n' +
          '// ===== 3. 제네릭 리포지토리 =====\n' +
          'interface Entity { id: string }\n' +
          '\n' +
          'class Repository<T extends Entity> {\n' +
          '  private items: T[] = [];\n' +
          '\n' +
          '  create(item: T): T {\n' +
          '    this.items.push(item);\n' +
          '    return item;\n' +
          '  }\n' +
          '\n' +
          '  findById(id: string): T | null {\n' +
          '    return this.items.find(item => item.id === id) ?? null;\n' +
          '  }\n' +
          '\n' +
          '  findAll(): T[] {\n' +
          '    return [...this.items];\n' +
          '  }\n' +
          '\n' +
          '  delete(id: string): boolean {\n' +
          '    const idx = this.items.findIndex(item => item.id === id);\n' +
          '    if (idx === -1) return false;\n' +
          '    this.items.splice(idx, 1);\n' +
          '    return true;\n' +
          '  }\n' +
          '}',
        description: "팩토리는 생성자 타입을, 이벤트 시스템은 이벤트 맵을, 리포지토리는 엔티티 타입을 제네릭으로 받아 입출력 타입을 자동 연결합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 빌더, 비동기, 고차함수 패턴",
      content:
        "빌더 패턴의 타입 누적, Promise<T>를 활용한 비동기 제네릭, 그리고 제네릭 고차함수를 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// ===== 빌더 패턴: 메서드 체이닝으로 타입 누적 =====\n' +
          'class QueryBuilder<T extends Record<string, any>> {\n' +
          '  private conditions: Partial<T> = {};\n' +
          '  private selectedFields: (keyof T)[] = [];\n' +
          '\n' +
          '  where<K extends keyof T>(key: K, value: T[K]): this {\n' +
          '    this.conditions[key] = value;\n' +
          '    return this;\n' +
          '  }\n' +
          '\n' +
          '  select(...fields: (keyof T)[]): this {\n' +
          '    this.selectedFields.push(...fields);\n' +
          '    return this;\n' +
          '  }\n' +
          '\n' +
          '  build(): { conditions: Partial<T>; fields: (keyof T)[] } {\n' +
          '    return {\n' +
          '      conditions: this.conditions,\n' +
          '      fields: this.selectedFields,\n' +
          '    };\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          'interface User {\n' +
          '  id: number;\n' +
          '  name: string;\n' +
          '  email: string;\n' +
          '  age: number;\n' +
          '}\n' +
          '\n' +
          'const query = new QueryBuilder<User>()\n' +
          '  .where("age", 25)       // value는 number만 허용\n' +
          '  .where("name", "Kim")   // value는 string만 허용\n' +
          '  .select("id", "name")\n' +
          '  .build();\n' +
          '\n' +
          '// ===== 비동기 제네릭 =====\n' +
          'async function fetchData<T>(url: string): Promise<T> {\n' +
          '  const response = await fetch(url);\n' +
          '  if (!response.ok) {\n' +
          '    throw new Error(`HTTP error: ${response.status}`);\n' +
          '  }\n' +
          '  return response.json() as Promise<T>;\n' +
          '}\n' +
          '\n' +
          'interface Product { id: number; title: string; price: number }\n' +
          '\n' +
          '// 반환 타입이 Product[]로 추론됨\n' +
          'const products = await fetchData<Product[]>("/api/products");\n' +
          'products[0].title; // 타입 안전!\n' +
          '\n' +
          '// ===== 제네릭 고차함수 (HOF) =====\n' +
          'function withLogging<Args extends any[], R>(\n' +
          '  fn: (...args: Args) => R,\n' +
          '  label: string\n' +
          '): (...args: Args) => R {\n' +
          '  return (...args: Args): R => {\n' +
          '    console.log(`[${label}] 호출:`, args);\n' +
          '    const result = fn(...args);\n' +
          '    console.log(`[${label}] 결과:`, result);\n' +
          '    return result;\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          'function add(a: number, b: number): number {\n' +
          '  return a + b;\n' +
          '}\n' +
          '\n' +
          'const loggedAdd = withLogging(add, "add");\n' +
          'loggedAdd(2, 3); // 원래 함수의 시그니처 그대로 유지!\n' +
          '// loggedAdd("a", "b"); // 컴파일 에러!',
        description: "빌더 패턴은 메서드 체이닝에서 키-값 타입 관계를 보존하고, 비동기 제네릭은 Promise의 resolve 타입을 지정하며, 고차함수는 원본 함수의 시그니처를 보존합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**제네릭 실전 패턴 = 타입 관계를 코드에 녹이는 것**\n\n" +
        "| 패턴 | 제네릭 역할 |\n" +
        "|------|------------|\n" +
        "| 팩토리 (new () => T) | 생성자 → 인스턴스 타입 연결 |\n" +
        "| 이벤트 시스템 | 이벤트 이름 → 데이터 타입 매핑 |\n" +
        "| 빌더 | 메서드 체이닝에서 키-값 타입 보존 |\n" +
        "| 리포지토리 | 엔티티 타입 → CRUD 입출력 연결 |\n" +
        "| 비동기 | Promise<T>로 resolve 타입 지정 |\n" +
        "| 고차함수 | 원본 함수 시그니처 보존 |\n\n" +
        "이 패턴들의 공통점은 **입력 타입으로부터 출력 타입을 자동으로 결정**한다는 것입니다. " +
        "제네릭이 없으면 `any`에 의존해야 하고, 타입 안전성이 사라집니다.\n\n" +
        "다음 챕터에서는 TypeScript가 제네릭 타입을 **자동으로 추론하는 전략**을 깊이 다룹니다. " +
        "명시적 지정 없이도 정확한 타입을 얻는 비결을 알아보겠습니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "제네릭 실전 패턴의 핵심은 '타입 관계를 코드에 녹이는 것'이다. 팩토리, 빌더, 리포지토리, 이벤트 시스템 등에서 제네릭이 입력과 출력의 타입 연결고리를 만든다.",
  checklist: [
    "팩토리 패턴에서 new () => T 시그니처로 생성자를 타입 안전하게 받을 수 있다",
    "제네릭 이벤트 시스템에서 이벤트 이름에 따라 콜백 타입이 자동 결정되는 원리를 설명할 수 있다",
    "빌더 패턴에서 메서드 체이닝으로 타입이 누적되는 방식을 구현할 수 있다",
    "제네릭 리포지토리 패턴으로 CRUD의 입출력 타입을 자동 연결할 수 있다",
    "제네릭 고차함수로 원본 함수의 시그니처를 보존하는 래퍼를 만들 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "팩토리 패턴에서 생성자를 제네릭으로 받을 때 올바른 타입 시그니처는?",
      choices: [
        "ctor: Function",
        "ctor: new () => T",
        "ctor: typeof T",
        "ctor: T.constructor",
      ],
      correctIndex: 1,
      explanation: "TypeScript에서 생성자를 타입으로 표현하려면 new () => T 형태를 사용합니다. 이렇게 하면 new 키워드로 호출 가능한 함수이면서, 반환 타입이 T임을 명시할 수 있습니다.",
    },
    {
      id: "q2",
      question: "제네릭 이벤트 시스템에서 on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void)의 Events[K]가 하는 역할은?",
      choices: [
        "이벤트 이름의 타입을 검사한다",
        "이벤트 이름 K에 대응하는 데이터 타입을 자동으로 결정한다",
        "모든 이벤트의 데이터를 유니온 타입으로 합친다",
        "이벤트 핸들러의 반환 타입을 지정한다",
      ],
      correctIndex: 1,
      explanation: "Events[K]는 인덱스 접근 타입으로, 이벤트 맵에서 K라는 키에 대응하는 값의 타입을 추출합니다. 예를 들어 'userLogin' 이벤트라면 { userId: string; timestamp: number } 타입이 자동으로 결정됩니다.",
    },
    {
      id: "q3",
      question: "다음 제네릭 고차함수에서 Args의 역할은?\n```typescript\nfunction wrap<Args extends any[], R>(\n  fn: (...args: Args) => R\n): (...args: Args) => R { ... }\n```",
      choices: [
        "함수의 반환 타입을 캡처한다",
        "함수의 매개변수 타입 튜플을 캡처하여 래퍼에서도 동일한 시그니처를 유지한다",
        "함수의 이름을 제네릭으로 전달한다",
        "함수의 this 바인딩을 보존한다",
      ],
      correctIndex: 1,
      explanation: "Args extends any[]는 원본 함수의 매개변수 목록을 튜플 타입으로 캡처합니다. 래퍼 함수도 동일한 Args를 매개변수로 받으므로, 원본 함수의 시그니처가 그대로 보존됩니다.",
    },
    {
      id: "q4",
      question: "제네릭 리포지토리 패턴에서 T extends Entity 제약의 목적은?",
      choices: [
        "T가 반드시 클래스여야 한다는 의미",
        "T가 최소한 id 필드를 가져야 findById 등의 메서드가 동작할 수 있도록 보장",
        "T가 직렬화 가능해야 한다는 의미",
        "T가 불변 객체여야 한다는 의미",
      ],
      correctIndex: 1,
      explanation: "Entity 인터페이스에 id: string이 정의되어 있으므로, T extends Entity는 T가 최소한 id 필드를 가져야 한다는 제약입니다. 이 제약 덕분에 findById, delete 등의 메서드에서 item.id에 안전하게 접근할 수 있습니다.",
    },
    {
      id: "q5",
      question: "async function fetchData<T>(url: string): Promise<T>에서 T를 사용하려면?",
      choices: [
        "TypeScript가 URL에서 자동으로 T를 추론한다",
        "호출 시 fetchData<Product[]>(url)처럼 명시적으로 지정해야 한다",
        "T는 항상 any로 추론된다",
        "반환값을 as T로 캐스팅해야 한다",
      ],
      correctIndex: 1,
      explanation: "URL 문자열만으로는 응답 데이터의 타입을 추론할 수 없으므로, fetchData<Product[]>(url)처럼 호출 시 명시적으로 타입을 지정해야 합니다. 이는 제네릭 추론이 불가능한 경우의 대표적인 예입니다.",
    },
  ],
};

export default chapter;
