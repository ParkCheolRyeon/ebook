import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "24-classes",
  subject: "typescript",
  title: "클래스와 접근 제어자",
  description:
    "TypeScript 클래스의 접근 제어자(public/private/protected), 매개변수 프로퍼티, implements, 그리고 클래스의 이중 정체성(타입이면서 값)을 학습합니다.",
  order: 24,
  group: "클래스와 OOP",
  prerequisites: ["23-module-types"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "TypeScript의 클래스는 **레스토랑**과 같습니다.\n\n" +
        "레스토랑에는 **public(공개)** 영역인 홀이 있습니다. 손님 누구나 접근할 수 있죠. 메뉴 주문, 음식 수령 — 이것이 외부에서 호출할 수 있는 public 메서드입니다.\n\n" +
        "**private(비공개)** 영역인 주방은 손님이 들어갈 수 없습니다. 요리 레시피(내부 로직), 식재료 보관(내부 상태)은 주방 직원만 접근합니다. 외부에서는 '주문'이라는 공개 인터페이스로만 소통합니다.\n\n" +
        "**protected(보호)** 영역은 프랜차이즈 본사의 교육 자료와 같습니다. 일반 손님은 볼 수 없지만, 가맹점(자식 클래스)은 접근할 수 있습니다.\n\n" +
        "한 가지 독특한 점이 있습니다. TypeScript에서 클래스 이름은 **이중 정체성**을 가집니다. '레스토랑'이라는 단어는 '레스토랑이라는 개념(타입)'으로도, '실제 매장 하나를 세우는 설계도(값)'로도 사용됩니다. `class Restaurant`를 선언하면, `Restaurant`는 인스턴스의 타입으로도, new로 인스턴스를 만드는 생성자로도 사용할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "JavaScript의 클래스는 캡슐화와 타입 안전성에서 한계가 있습니다.\n\n" +
        "**1. 진정한 캡슐화의 부재**\n" +
        "ES2022 이전의 JavaScript에는 private 필드가 없었습니다. 관례적으로 `_`를 붙여 private을 표현했지만 강제력이 없어, 외부에서 `_password`에 직접 접근할 수 있었습니다.\n\n" +
        "**2. 인터페이스 구현 강제 불가**\n" +
        "JavaScript에서는 클래스가 특정 인터페이스를 '구현'한다고 선언할 방법이 없습니다. API가 요구하는 메서드를 깜빡하고 누락해도, 실행하기 전에는 알 수 없습니다.\n\n" +
        "**3. 생성자 보일러플레이트**\n" +
        "프로퍼티 선언, 생성자 매개변수, this 할당을 반복적으로 작성해야 합니다. 프로퍼티가 많아질수록 코드가 중복됩니다.\n\n" +
        "**4. readonly 강제 불가**\n" +
        "한번 설정된 후 변경되면 안 되는 값(id, createdAt 등)을 JavaScript에서는 강제할 수 없습니다. Object.freeze를 사용해도 타입 시스템이 이를 반영하지 못합니다.\n\n" +
        "**5. #private vs private 혼란**\n" +
        "ES2022의 `#private`과 TypeScript의 `private` 키워드는 비슷해 보이지만 동작이 다릅니다. 어떤 것을 언제 사용해야 하는지 혼란스럽습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "TypeScript의 클래스 기능으로 캡슐화, 타입 안전성, 코드 간결성을 모두 확보합니다.\n\n" +
        "### 접근 제어자\n" +
        "`public`(기본값) — 어디서든 접근 가능. `private` — 해당 클래스 내부에서만. `protected` — 해당 클래스와 자식 클래스에서만. 이 키워드들은 컴파일 후 사라지지만, 개발 시점에서 강력한 가이드를 제공합니다.\n\n" +
        "### 매개변수 프로퍼티 (Constructor Shorthand)\n" +
        "생성자 매개변수에 접근 제어자를 붙이면, 프로퍼티 선언과 할당이 자동으로 처리됩니다. `constructor(private name: string)`은 프로퍼티 선언, 매개변수 정의, 할당을 한 번에 해결합니다.\n\n" +
        "### readonly\n" +
        "`readonly` 프로퍼티는 선언 시 또는 생성자에서만 값을 할당할 수 있습니다. 이후 변경을 시도하면 컴파일 에러가 발생합니다.\n\n" +
        "### implements\n" +
        "클래스가 특정 인터페이스를 구현하도록 강제합니다. 누락된 프로퍼티나 메서드가 있으면 즉시 컴파일 에러가 발생합니다.\n\n" +
        "### #private vs private\n" +
        "`#private`(ES private)은 런타임에서도 진정한 private. `private`(TS private)은 컴파일 타임에만 검사. 런타임 보안이 필요하면 `#`, 일반적인 캡슐화에는 `private`을 사용합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: TypeScript 클래스 기능",
      content:
        "접근 제어자, 매개변수 프로퍼티, readonly, implements, static, getter/setter 등 TypeScript 클래스의 주요 기능을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          "// ===== 1. 접근 제어자와 매개변수 프로퍼티 =====\n" +
          "class User {\n" +
          "  // 매개변수 프로퍼티: 선언 + 할당 한 번에\n" +
          "  constructor(\n" +
          "    public readonly id: string,\n" +
          "    public name: string,\n" +
          "    private email: string,\n" +
          "    protected role: 'admin' | 'user' = 'user'\n" +
          "  ) {}\n" +
          "\n" +
          "  // public: 외부에서 접근 가능 (기본값)\n" +
          "  getProfile() {\n" +
          "    return { id: this.id, name: this.name, role: this.role };\n" +
          "  }\n" +
          "\n" +
          "  // private: 클래스 내부에서만 접근\n" +
          "  private hashEmail(): string {\n" +
          "    return this.email.split('').reverse().join('');\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "const user = new User('u1', '홍길동', 'hong@test.com');\n" +
          "user.name;       // ✅ public\n" +
          "// user.email;   // ❌ private\n" +
          "// user.role;    // ❌ protected\n" +
          "// user.id = 'u2'; // ❌ readonly\n" +
          "\n" +
          "// ===== 2. implements — 인터페이스 구현 =====\n" +
          "interface Repository<T> {\n" +
          "  findById(id: string): Promise<T | null>;\n" +
          "  save(entity: T): Promise<void>;\n" +
          "  delete(id: string): Promise<boolean>;\n" +
          "}\n" +
          "\n" +
          "interface Serializable {\n" +
          "  toJSON(): string;\n" +
          "}\n" +
          "\n" +
          "// 여러 인터페이스 동시 구현 가능\n" +
          "class UserRepository implements Repository<User>, Serializable {\n" +
          "  private users = new Map<string, User>();\n" +
          "\n" +
          "  async findById(id: string): Promise<User | null> {\n" +
          "    return this.users.get(id) ?? null;\n" +
          "  }\n" +
          "\n" +
          "  async save(user: User): Promise<void> {\n" +
          "    this.users.set(user.id, user);\n" +
          "  }\n" +
          "\n" +
          "  async delete(id: string): Promise<boolean> {\n" +
          "    return this.users.delete(id);\n" +
          "  }\n" +
          "\n" +
          "  toJSON(): string {\n" +
          "    return JSON.stringify([...this.users.values()]);\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// ===== 3. static 멤버와 getter/setter =====\n" +
          "class Temperature {\n" +
          "  // static: 인스턴스가 아닌 클래스에 속함\n" +
          "  static readonly ABSOLUTE_ZERO = -273.15;\n" +
          "\n" +
          "  constructor(private _celsius: number) {}\n" +
          "\n" +
          "  // getter: 프로퍼티처럼 접근, 계산된 값 반환\n" +
          "  get fahrenheit(): number {\n" +
          "    return this._celsius * 9 / 5 + 32;\n" +
          "  }\n" +
          "\n" +
          "  // setter: 프로퍼티처럼 할당, 유효성 검증 가능\n" +
          "  set celsius(value: number) {\n" +
          "    if (value < Temperature.ABSOLUTE_ZERO) {\n" +
          "      throw new Error('절대 영도 이하 불가');\n" +
          "    }\n" +
          "    this._celsius = value;\n" +
          "  }\n" +
          "\n" +
          "  get celsius(): number {\n" +
          "    return this._celsius;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "const temp = new Temperature(100);\n" +
          "temp.fahrenheit; // 212 (getter)\n" +
          "temp.celsius = 0; // setter 호출",
        description:
          "매개변수 프로퍼티로 보일러플레이트를 줄이고, implements로 인터페이스 계약을 강제하며, getter/setter로 캡슐화된 접근을 제공합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 클래스의 이중 정체성과 실무 패턴",
      content:
        "클래스가 타입이면서 값인 특성, #private vs private의 차이, 그리고 실무에서 자주 사용하는 클래스 패턴을 연습합니다.",
      code: {
        language: "typescript",
        code:
          "// 1. 클래스의 이중 정체성: 타입이면서 값\n" +
          "class ApiError {\n" +
          "  constructor(\n" +
          "    public message: string,\n" +
          "    public statusCode: number,\n" +
          "    public code: string\n" +
          "  ) {}\n" +
          "}\n" +
          "\n" +
          "// '값'으로 사용: new로 인스턴스 생성\n" +
          "const error = new ApiError('Not Found', 404, 'NOT_FOUND');\n" +
          "\n" +
          "// '타입'으로 사용: 변수, 매개변수, 반환 타입\n" +
          "function handleError(err: ApiError): void {\n" +
          "  console.log(`[${err.statusCode}] ${err.message}`);\n" +
          "}\n" +
          "\n" +
          "// typeof 클래스: 생성자 타입 (인스턴스가 아님!)\n" +
          "function createError(\n" +
          "  ErrorClass: typeof ApiError,\n" +
          "  msg: string\n" +
          "): ApiError {\n" +
          "  return new ErrorClass(msg, 500, 'INTERNAL');\n" +
          "}\n" +
          "\n" +
          "// 2. #private (ES) vs private (TS)\n" +
          "class Wallet {\n" +
          "  // TS private: 컴파일 타임에만 검사\n" +
          "  private balance: number;\n" +
          "\n" +
          "  // ES #private: 런타임에서도 진정한 private\n" +
          "  #pin: string;\n" +
          "\n" +
          "  constructor(balance: number, pin: string) {\n" +
          "    this.balance = balance;\n" +
          "    this.#pin = pin;\n" +
          "  }\n" +
          "\n" +
          "  withdraw(amount: number, pin: string): boolean {\n" +
          "    if (pin !== this.#pin) return false;\n" +
          "    if (amount > this.balance) return false;\n" +
          "    this.balance -= amount;\n" +
          "    return true;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "const wallet = new Wallet(10000, '1234');\n" +
          "// wallet.balance;    // ❌ TS 에러 (런타임에서는 접근 가능)\n" +
          "// wallet.#pin;       // ❌ 구문 에러 (런타임에서도 접근 불가)\n" +
          "\n" +
          "// 3. 실무 패턴: 서비스 클래스\n" +
          "interface Logger {\n" +
          "  log(message: string): void;\n" +
          "  error(message: string, error?: Error): void;\n" +
          "}\n" +
          "\n" +
          "class UserService {\n" +
          "  constructor(\n" +
          "    private readonly repository: UserRepository,\n" +
          "    private readonly logger: Logger\n" +
          "  ) {}\n" +
          "\n" +
          "  async getUser(id: string): Promise<User | null> {\n" +
          "    this.logger.log(`Fetching user: ${id}`);\n" +
          "    return this.repository.findById(id);\n" +
          "  }\n" +
          "\n" +
          "  async updateName(id: string, name: string): Promise<void> {\n" +
          "    const user = await this.repository.findById(id);\n" +
          "    if (!user) throw new ApiError('User not found', 404, 'NOT_FOUND');\n" +
          "    user.name = name;\n" +
          "    await this.repository.save(user);\n" +
          "    this.logger.log(`Updated user name: ${id}`);\n" +
          "  }\n" +
          "}",
        description:
          "클래스 이름은 타입(인스턴스 타입)으로도 값(생성자)으로도 사용됩니다. typeof 클래스는 생성자 자체의 타입을 의미합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 기능 | 설명 | 예시 |\n" +
        "|------|------|------|\n" +
        "| public | 어디서든 접근 (기본값) | public name: string |\n" +
        "| private | 클래스 내부에서만 | private email: string |\n" +
        "| protected | 클래스 + 자식 클래스 | protected role: string |\n" +
        "| readonly | 초기화 후 변경 불가 | readonly id: string |\n" +
        "| 매개변수 프로퍼티 | 선언+할당 단축 | constructor(public name) |\n" +
        "| implements | 인터페이스 구현 강제 | class A implements B |\n" +
        "| #private | 런타임 진정한 private | #secret: string |\n\n" +
        "**핵심:** TypeScript의 클래스는 접근 제어자(public/private/protected)로 캡슐화를 강제하고, implements로 인터페이스 계약을 준수하게 합니다. 클래스 이름은 타입으로도 값으로도 사용할 수 있는 이중 정체성을 가집니다.\n\n" +
        "**다음 챕터 미리보기:** 추상 클래스(abstract class)를 학습합니다. 직접 인스턴스화할 수 없는 기본 클래스로 공통 로직과 강제 구현을 조합하는 패턴을 다룹니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "TypeScript의 클래스는 접근 제어자(public/private/protected)로 캡슐화를 강제하고, implements로 인터페이스 계약을 준수하게 한다. 클래스 이름은 타입으로도 값으로도 사용할 수 있는 이중 정체성을 가진다.",
  checklist: [
    "public, private, protected의 접근 범위를 정확히 구분할 수 있다",
    "매개변수 프로퍼티(constructor shorthand)를 활용할 수 있다",
    "implements로 인터페이스를 구현하는 클래스를 작성할 수 있다",
    "클래스가 타입이면서 값인 이중 정체성을 이해한다",
    "#private(ES)과 private(TS)의 차이를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "TypeScript에서 클래스 멤버의 기본 접근 제어자는?",
      choices: [
        "private",
        "protected",
        "public",
        "접근 제어자가 없으면 에러",
      ],
      correctIndex: 2,
      explanation:
        "TypeScript에서 접근 제어자를 명시하지 않으면 기본값은 public입니다. 어디서든 접근할 수 있습니다.",
    },
    {
      id: "q2",
      question: "매개변수 프로퍼티(parameter property)의 장점은?",
      choices: [
        "런타임 성능이 향상된다",
        "프로퍼티 선언, 매개변수 정의, this 할당을 한 줄로 줄여준다",
        "private 멤버를 외부에서 접근 가능하게 한다",
        "인터페이스 구현을 자동화한다",
      ],
      correctIndex: 1,
      explanation:
        "constructor(private name: string)은 프로퍼티 선언(private name: string;), 매개변수 정의, this.name = name 할당을 한 번에 처리합니다. 보일러플레이트 코드를 크게 줄여줍니다.",
    },
    {
      id: "q3",
      question: "class User를 선언했을 때, User라는 이름으로 할 수 있는 것은?",
      choices: [
        "타입으로만 사용 가능",
        "값(생성자)으로만 사용 가능",
        "타입으로도 값으로도 사용 가능",
        "제네릭 타입 매개변수로만 사용 가능",
      ],
      correctIndex: 2,
      explanation:
        "TypeScript에서 클래스는 이중 정체성을 가집니다. User는 인스턴스의 타입(const u: User)으로도, 생성자 값(new User())으로도 사용할 수 있습니다.",
    },
    {
      id: "q4",
      question: "#private(ES private)과 private(TS private)의 가장 큰 차이는?",
      choices: [
        "문법의 차이만 있고 동작은 같다",
        "#private은 런타임에서도 접근 불가, private은 컴파일 타임에만 검사",
        "#private이 더 느리다",
        "private은 상속 시 접근 가능하지만 #private은 아니다",
      ],
      correctIndex: 1,
      explanation:
        "TS의 private은 컴파일 타임에만 검사되며, 컴파일된 JavaScript에서는 일반 프로퍼티로 접근 가능합니다. ES의 #private은 런타임에서도 진정한 private으로, 클래스 외부에서 절대 접근할 수 없습니다.",
    },
    {
      id: "q5",
      question: "implements 키워드의 역할은?",
      choices: [
        "클래스 상속을 구현",
        "클래스가 특정 인터페이스의 모든 멤버를 구현하도록 강제",
        "인터페이스의 기본 구현을 제공",
        "런타임에서 타입 검사를 수행",
      ],
      correctIndex: 1,
      explanation:
        "implements는 클래스가 인터페이스의 모든 멤버(프로퍼티, 메서드)를 구현하도록 컴파일 타임에 강제합니다. 누락된 멤버가 있으면 즉시 에러가 발생합니다. 상속(extends)과 달리 구현을 물려받지는 않습니다.",
    },
  ],
};

export default chapter;
