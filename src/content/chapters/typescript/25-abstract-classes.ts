import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "25-abstract-classes",
  subject: "typescript",
  title: "추상 클래스와 인터페이스 구현",
  description:
    "abstract class의 개념과 인터페이스와의 차이를 이해하고, 템플릿 메서드 패턴과 전략 패턴 등 실무 활용법을 학습합니다.",
  order: 25,
  group: "클래스와 OOP",
  prerequisites: ["24-classes"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "추상 클래스는 **요리 레시피의 틀**과 같습니다.\n\n" +
        "예를 들어, '파스타 만들기'라는 레시피 틀이 있다고 합시다. 이 틀에는 '면 삶기', '소스 만들기', '플레이팅'이라는 단계가 정해져 있습니다. '면 삶기'와 '플레이팅'은 모든 파스타에 공통이라 기본 구현이 제공되지만, '소스 만들기'는 카르보나라인지 토마토인지에 따라 완전히 달라지므로 빈칸으로 남겨둡니다.\n\n" +
        "추상 클래스가 바로 이 레시피 틀입니다. `abstract` 메서드는 '소스 만들기'처럼 하위 클래스가 반드시 채워야 하는 빈칸이고, 일반 메서드는 '면 삶기'처럼 이미 완성된 공통 구현입니다. 레시피 틀 자체로는 요리를 만들 수 없듯, 추상 클래스는 인스턴스화할 수 없습니다.\n\n" +
        "인터페이스는 이와 다르게 **메뉴판**에 가깝습니다. '이 요리에는 이런 것들이 포함되어야 한다'는 계약만 있고, 어떻게 만드는지에 대한 구현은 전혀 없습니다. 추상 클래스는 계약과 공통 구현을 함께 제공하는 강력한 도구입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "클래스 상속을 사용하다 보면 다음과 같은 문제에 직면합니다.\n\n" +
        "**1. 공통 로직 중복**\n" +
        "여러 클래스가 비슷한 구조를 공유하지만, 일부 메서드만 다른 경우가 있습니다. 인터페이스만 사용하면 공통 로직을 각 클래스에서 반복 구현해야 합니다. 예를 들어, FileLogger와 DatabaseLogger는 로그 포맷팅은 같지만 출력 대상만 다릅니다.\n\n" +
        "**2. 구현 강제의 어려움**\n" +
        "일반 클래스를 상속하면 메서드 오버라이드를 '잊어도' 에러가 나지 않습니다. 부모 클래스의 기본 구현이 그대로 사용되어 버그가 숨어버릴 수 있습니다.\n\n" +
        "**3. 인스턴스화 방지 필요**\n" +
        "베이스 클래스 자체는 불완전하므로 인스턴스를 만들면 안 되지만, 일반 클래스로 정의하면 `new BaseClass()`를 호출할 수 있어 런타임 오류의 원인이 됩니다.\n\n" +
        "**4. interface vs class 선택 기준 부재**\n" +
        "언제 인터페이스를, 언제 추상 클래스를 사용해야 하는지 판단 기준이 없으면 일관성 없는 설계가 됩니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "TypeScript의 `abstract` 키워드는 이러한 문제들을 깔끔하게 해결합니다.\n\n" +
        "### abstract class의 핵심 특성\n" +
        "- **인스턴스화 불가**: `new AbstractClass()`를 시도하면 컴파일 에러가 발생합니다.\n" +
        "- **abstract 메서드**: 시그니처만 선언하고, 하위 클래스가 반드시 구현해야 합니다.\n" +
        "- **일반 메서드 포함 가능**: 공통 로직을 기본 구현으로 제공할 수 있습니다.\n" +
        "- **생성자 정의 가능**: protected 생성자로 공통 초기화 로직을 제공합니다.\n\n" +
        "### 추상 클래스 vs 인터페이스 선택 기준\n" +
        "| 기준 | interface | abstract class |\n" +
        "|------|-----------|----------------|\n" +
        "| 구현 포함 | 불가 | 가능 |\n" +
        "| 다중 상속 | implements 여러 개 가능 | extends 하나만 가능 |\n" +
        "| 런타임 존재 | 타입 소거됨 | JS 클래스로 존재 |\n" +
        "| 사용 시점 | 순수 계약 정의 | 계약 + 공통 구현 |\n\n" +
        "### 템플릿 메서드 패턴\n" +
        "추상 클래스의 대표적 활용법은 **템플릿 메서드 패턴**입니다. 알고리즘의 골격을 부모 클래스에 정의하고, 특정 단계만 하위 클래스에 위임합니다. 이를 통해 코드 중복을 줄이면서도 확장성을 확보할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 추상 클래스와 템플릿 메서드 패턴",
      content:
        "추상 클래스의 선언과 상속, 그리고 템플릿 메서드 패턴의 구현을 살펴봅시다. abstract 메서드가 하위 클래스에서 어떻게 구현을 강제하는지, 공통 로직은 어떻게 재사용되는지 확인합니다.",
      code: {
        language: "typescript",
        code:
          "// ===== 추상 클래스 기본 =====\n" +
          "abstract class Shape {\n" +
          "  constructor(protected color: string) {}\n" +
          "\n" +
          "  // abstract 메서드: 하위 클래스가 반드시 구현\n" +
          "  abstract area(): number;\n" +
          "  abstract perimeter(): number;\n" +
          "\n" +
          "  // 일반 메서드: 공통 구현 제공\n" +
          "  describe(): string {\n" +
          "    return `${this.color} 도형 (넓이: ${this.area()})`;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// ❌ 컴파일 에러: 추상 클래스는 인스턴스화 불가\n" +
          '// const shape = new Shape("red");\n' +
          "\n" +
          "class Circle extends Shape {\n" +
          "  constructor(color: string, private radius: number) {\n" +
          "    super(color);\n" +
          "  }\n" +
          "\n" +
          "  area(): number {\n" +
          "    return Math.PI * this.radius ** 2;\n" +
          "  }\n" +
          "\n" +
          "  perimeter(): number {\n" +
          "    return 2 * Math.PI * this.radius;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// ===== 템플릿 메서드 패턴 =====\n" +
          "abstract class DataProcessor<T> {\n" +
          "  // 템플릿 메서드: 알고리즘의 골격\n" +
          "  process(): void {\n" +
          "    const raw = this.readData();\n" +
          "    const validated = this.validate(raw);\n" +
          "    const transformed = this.transform(validated);\n" +
          "    this.save(transformed);\n" +
          "  }\n" +
          "\n" +
          "  // 하위 클래스가 반드시 구현할 단계\n" +
          "  abstract readData(): T;\n" +
          "  abstract transform(data: T): T;\n" +
          "\n" +
          "  // 기본 구현 (필요 시 오버라이드)\n" +
          "  protected validate(data: T): T {\n" +
          "    return data; // 기본: 검증 통과\n" +
          "  }\n" +
          "\n" +
          "  protected save(data: T): void {\n" +
          "    console.log('Saved:', data);\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// ===== 전략 패턴 베이스 =====\n" +
          "abstract class Logger {\n" +
          "  abstract write(message: string): void;\n" +
          "\n" +
          "  log(level: string, message: string): void {\n" +
          "    const timestamp = new Date().toISOString();\n" +
          "    this.write(`[${timestamp}] [${level}] ${message}`);\n" +
          "  }\n" +
          "\n" +
          "  info(msg: string) { this.log('INFO', msg); }\n" +
          "  error(msg: string) { this.log('ERROR', msg); }\n" +
          "}\n" +
          "\n" +
          "class ConsoleLogger extends Logger {\n" +
          "  write(message: string): void {\n" +
          "    console.log(message);\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "class FileLogger extends Logger {\n" +
          "  constructor(private filePath: string) { super(); }\n" +
          "  write(message: string): void {\n" +
          "    // 파일에 기록하는 로직\n" +
          "    console.log(`Writing to ${this.filePath}: ${message}`);\n" +
          "  }\n" +
          "}",
        description:
          "추상 클래스는 abstract 메서드로 구현을 강제하고, 일반 메서드로 공통 로직을 제공합니다. 템플릿 메서드 패턴에서 알고리즘 골격을 정의하는 데 적합합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 추상 클래스와 인터페이스 조합",
      content:
        "추상 클래스와 인터페이스를 함께 사용하는 실무 패턴을 연습합니다. 인터페이스로 계약을 정의하고, 추상 클래스로 공통 구현을 제공하는 계층 구조를 만들어봅시다.",
      code: {
        language: "typescript",
        code:
          "// 인터페이스: 순수 계약\n" +
          "interface Serializable {\n" +
          "  serialize(): string;\n" +
          "}\n" +
          "\n" +
          "interface Validatable {\n" +
          "  validate(): boolean;\n" +
          "}\n" +
          "\n" +
          "// 추상 클래스: 계약 + 공통 구현\n" +
          "abstract class BaseEntity implements Serializable, Validatable {\n" +
          "  readonly id: string;\n" +
          "  readonly createdAt: Date;\n" +
          "\n" +
          "  constructor() {\n" +
          "    this.id = crypto.randomUUID();\n" +
          "    this.createdAt = new Date();\n" +
          "  }\n" +
          "\n" +
          "  // 인터페이스 구현\n" +
          "  serialize(): string {\n" +
          "    return JSON.stringify(this);\n" +
          "  }\n" +
          "\n" +
          "  // abstract: 하위 클래스가 구현\n" +
          "  abstract validate(): boolean;\n" +
          "  abstract get displayName(): string;\n" +
          "}\n" +
          "\n" +
          "class User extends BaseEntity {\n" +
          "  constructor(\n" +
          "    public name: string,\n" +
          "    public email: string\n" +
          "  ) {\n" +
          "    super();\n" +
          "  }\n" +
          "\n" +
          "  validate(): boolean {\n" +
          "    return this.name.length > 0 && this.email.includes('@');\n" +
          "  }\n" +
          "\n" +
          "  get displayName(): string {\n" +
          "    return `${this.name} <${this.email}>`;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "class Product extends BaseEntity {\n" +
          "  constructor(\n" +
          "    public title: string,\n" +
          "    public price: number\n" +
          "  ) {\n" +
          "    super();\n" +
          "  }\n" +
          "\n" +
          "  validate(): boolean {\n" +
          "    return this.title.length > 0 && this.price > 0;\n" +
          "  }\n" +
          "\n" +
          "  get displayName(): string {\n" +
          "    return `${this.title} (${this.price.toLocaleString()}원)`;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// 다형성 활용\n" +
          "function processEntity(entity: BaseEntity): void {\n" +
          "  if (entity.validate()) {\n" +
          "    console.log(`유효: ${entity.displayName}`);\n" +
          "    console.log(`직렬화: ${entity.serialize()}`);\n" +
          "  }\n" +
          "}",
        description:
          "인터페이스로 순수 계약을 정의하고, 추상 클래스에서 공통 로직(id 생성, serialize)을 구현합니다. 하위 클래스는 validate와 displayName만 구현하면 됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 특성 | interface | abstract class |\n" +
        "|------|-----------|----------------|\n" +
        "| 구현 포함 | 불가 | 가능 (일반 메서드) |\n" +
        "| 다중 상속 | 여러 개 implements | 하나만 extends |\n" +
        "| 런타임 존재 | 타입 소거 | JS 클래스로 존재 |\n" +
        "| 프로퍼티 | 시그니처만 | 실제 값 + abstract |\n" +
        "| 생성자 | 없음 | protected/public |\n" +
        "| 사용 시점 | 순수 계약 | 계약 + 공통 구현 |\n\n" +
        "**핵심:** 추상 클래스는 구현을 일부 포함하면서 하위 클래스에 특정 메서드 구현을 강제합니다. interface는 순수 계약, abstract class는 계약+공통 구현을 제공할 때 사용합니다. 템플릿 메서드 패턴과 전략 패턴에서 추상 클래스가 핵심적으로 활용됩니다.\n\n" +
        "**다음 챕터 미리보기:** 데코레이터를 학습합니다. 클래스와 그 멤버에 메타데이터를 추가하거나 동작을 수정하는 강력한 패턴을 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "추상 클래스는 구현을 일부 포함하면서 하위 클래스에 특정 메서드 구현을 강제한다. interface는 순수 계약, abstract class는 계약+공통 구현을 모두 제공할 때 선택한다.",
  checklist: [
    "abstract class가 인스턴스화 불가능한 이유를 설명할 수 있다",
    "abstract 메서드와 일반 메서드의 차이를 이해한다",
    "추상 클래스와 인터페이스의 선택 기준을 설명할 수 있다",
    "템플릿 메서드 패턴을 추상 클래스로 구현할 수 있다",
    "추상 클래스와 인터페이스를 조합하여 계층 구조를 설계할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "추상 클래스에 대한 설명으로 올바르지 않은 것은?",
      choices: [
        "인스턴스를 직접 생성할 수 없다",
        "abstract 메서드와 일반 메서드를 모두 가질 수 있다",
        "여러 추상 클래스를 동시에 extends할 수 있다",
        "생성자를 정의할 수 있다",
      ],
      correctIndex: 2,
      explanation:
        "TypeScript에서 클래스는 하나만 extends할 수 있습니다(단일 상속). 여러 계약이 필요하면 interface를 여러 개 implements합니다.",
    },
    {
      id: "q2",
      question: "interface 대신 abstract class를 선택해야 하는 상황은?",
      choices: [
        "순수하게 타입 계약만 정의할 때",
        "여러 클래스에 공통으로 구현된 메서드를 공유할 때",
        "런타임에 타입을 소거하고 싶을 때",
        "다중 상속이 필요할 때",
      ],
      correctIndex: 1,
      explanation:
        "abstract class는 계약(abstract 메서드)과 공통 구현(일반 메서드)을 함께 제공할 수 있습니다. 순수 계약만 필요하면 interface, 공통 구현이 있으면 abstract class를 사용합니다.",
    },
    {
      id: "q3",
      question:
        "다음 코드에서 컴파일 에러가 발생하는 부분은?\n\nabstract class Animal {\n  abstract sound(): string;\n  move(): void { console.log('moving'); }\n}\nclass Dog extends Animal {}\nconst dog = new Dog();",
      choices: [
        "abstract class Animal 선언부",
        "move() 메서드 정의부",
        "class Dog extends Animal (sound 미구현)",
        "const dog = new Dog()",
      ],
      correctIndex: 2,
      explanation:
        "Dog 클래스가 Animal의 abstract 메서드인 sound()를 구현하지 않았으므로 컴파일 에러가 발생합니다. 추상 메서드는 하위 클래스에서 반드시 구현해야 합니다.",
    },
    {
      id: "q4",
      question: "템플릿 메서드 패턴에서 추상 클래스의 역할은?",
      choices: [
        "모든 메서드를 abstract로 선언한다",
        "알고리즘의 골격을 정의하고, 특정 단계를 하위 클래스에 위임한다",
        "인터페이스를 대체한다",
        "private 메서드만 포함한다",
      ],
      correctIndex: 1,
      explanation:
        "템플릿 메서드 패턴에서 추상 클래스는 알고리즘의 전체 흐름(골격)을 일반 메서드로 정의하고, 변경이 필요한 특정 단계만 abstract 메서드로 하위 클래스에 위임합니다.",
    },
    {
      id: "q5",
      question:
        "추상 클래스와 인터페이스의 런타임 차이점으로 올바른 것은?",
      choices: [
        "둘 다 런타임에 존재한다",
        "둘 다 타입 소거된다",
        "추상 클래스는 JS 클래스로 존재하고, 인터페이스는 소거된다",
        "인터페이스는 존재하고, 추상 클래스는 소거된다",
      ],
      correctIndex: 2,
      explanation:
        "abstract class는 컴파일 후 JavaScript 클래스로 남아 런타임에 존재합니다. 반면 interface는 타입 소거되어 컴파일 결과물에 포함되지 않습니다.",
    },
  ],
};

export default chapter;
