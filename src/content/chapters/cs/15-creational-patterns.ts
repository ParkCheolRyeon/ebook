import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "15-creational-patterns",
  subject: "cs",
  title: "생성 패턴",
  description: "객체 생성의 복잡성을 관리하는 싱글턴, 팩토리, 빌더 패턴의 원리와 프론트엔드 실전 활용을 학습합니다.",
  order: 15,
  group: "디자인 패턴",
  prerequisites: [],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "생성 패턴은 '물건을 만드는 다양한 방식'에 비유할 수 있습니다.\n\n" +
        "**싱글턴 패턴** — 한 나라에 대통령은 한 명뿐입니다. 누가 '대통령'을 요청하든 항상 같은 사람을 가리킵니다. " +
        "앱에서 전역 설정이나 스토어처럼 인스턴스가 반드시 하나여야 하는 경우에 사용합니다.\n\n" +
        "**팩토리 패턴** — 자동차 공장에 '세단 한 대 주세요'라고 주문하면, 내부에서 어떤 부품을 조립하는지 " +
        "신경 쓸 필요 없이 완성된 자동차가 나옵니다. 객체 생성 로직을 캡슐화해 호출자가 세부 구현을 몰라도 되게 합니다.\n\n" +
        "**빌더 패턴** — 서브웨이에서 샌드위치를 주문할 때 빵, 야채, 소스를 하나씩 선택합니다. " +
        "복잡한 객체를 단계별로 조립할 때 사용합니다. 쿼리 빌더나 폼 빌더가 대표적입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 개발에서 객체 생성이 복잡해지는 상황들:\n\n" +
        "**1. 전역 상태 중복 생성:** 설정 객체나 스토어를 여러 번 생성하면 데이터 불일치가 발생합니다.\n\n" +
        "```typescript\n" +
        "// 문제: 매번 new로 생성하면 서로 다른 인스턴스\n" +
        "const config1 = new AppConfig();\n" +
        "const config2 = new AppConfig();\n" +
        "config1.theme = 'dark';\n" +
        "console.log(config2.theme); // undefined — 다른 인스턴스!\n" +
        "```\n\n" +
        "**2. 조건별 객체 생성의 복잡성:** 타입에 따라 다른 컴포넌트를 만들어야 할 때 if-else가 난무합니다.\n\n" +
        "```typescript\n" +
        "// 문제: 새 타입 추가 시 이 함수를 수정해야 함\n" +
        "function createNotification(type: string) {\n" +
        "  if (type === 'success') return { color: 'green', icon: 'check' };\n" +
        "  if (type === 'error') return { color: 'red', icon: 'x' };\n" +
        "  if (type === 'warning') return { color: 'yellow', icon: '!' };\n" +
        "  // 타입이 늘어날수록 함수가 비대해짐\n" +
        "}\n" +
        "```\n\n" +
        "**3. 복잡한 객체 초기화:** API 요청 객체나 폼 설정처럼 옵션이 많은 객체를 생성자에 한꺼번에 넘기면 가독성이 떨어집니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. 싱글턴 패턴 (Singleton)\n\n" +
        "인스턴스가 하나만 존재하도록 보장합니다. 프론트엔드에서는 앱 설정, 전역 스토어, 로거 등에 활용합니다.\n\n" +
        "```typescript\n" +
        "class AppConfig {\n" +
        "  private static instance: AppConfig | null = null;\n" +
        "  private config: Record<string, unknown> = {};\n" +
        "\n" +
        "  private constructor() {} // 외부에서 new 불가\n" +
        "\n" +
        "  static getInstance(): AppConfig {\n" +
        "    if (!AppConfig.instance) {\n" +
        "      AppConfig.instance = new AppConfig();\n" +
        "    }\n" +
        "    return AppConfig.instance;\n" +
        "  }\n" +
        "\n" +
        "  set(key: string, value: unknown) { this.config[key] = value; }\n" +
        "  get(key: string) { return this.config[key]; }\n" +
        "}\n" +
        "```\n\n" +
        "**ES 모듈에서의 싱글턴:** TypeScript/JavaScript의 ES 모듈은 자체적으로 싱글턴입니다. " +
        "모듈은 처음 import할 때 한 번만 실행되고, 이후에는 캐시된 인스턴스를 반환합니다.\n\n" +
        "```typescript\n" +
        "// store.ts — 모듈 자체가 싱글턴\n" +
        "const store = { theme: 'light', lang: 'ko' };\n" +
        "export default store;\n" +
        "```\n\n" +
        "### 2. 팩토리 패턴 (Factory)\n\n" +
        "객체 생성 로직을 캡슐화하여 호출자가 구체 클래스를 몰라도 되게 합니다.\n\n" +
        "```typescript\n" +
        "interface Notification {\n" +
        "  type: string;\n" +
        "  color: string;\n" +
        "  icon: string;\n" +
        "  render(): string;\n" +
        "}\n" +
        "\n" +
        "const notificationFactory: Record<string, () => Notification> = {\n" +
        "  success: () => ({ type: 'success', color: 'green', icon: 'check', render() { return `[${this.icon}] ${this.type}`; } }),\n" +
        "  error: () => ({ type: 'error', color: 'red', icon: 'x', render() { return `[${this.icon}] ${this.type}`; } }),\n" +
        "  warning: () => ({ type: 'warning', color: 'yellow', icon: '!', render() { return `[${this.icon}] ${this.type}`; } }),\n" +
        "};\n" +
        "\n" +
        "function createNotification(type: string): Notification {\n" +
        "  const factory = notificationFactory[type];\n" +
        "  if (!factory) throw new Error(`Unknown type: ${type}`);\n" +
        "  return factory();\n" +
        "}\n" +
        "```\n\n" +
        "### 3. 빌더 패턴 (Builder)\n\n" +
        "복잡한 객체를 단계별로 조립합니다. 메서드 체이닝으로 가독성을 높입니다.\n\n" +
        "```typescript\n" +
        "class QueryBuilder {\n" +
        "  private baseUrl: string;\n" +
        "  private params: Record<string, string> = {};\n" +
        "  private headers: Record<string, string> = {};\n" +
        "\n" +
        "  constructor(baseUrl: string) { this.baseUrl = baseUrl; }\n" +
        "\n" +
        "  where(key: string, value: string) {\n" +
        "    this.params[key] = value;\n" +
        "    return this; // 체이닝\n" +
        "  }\n" +
        "\n" +
        "  withHeader(key: string, value: string) {\n" +
        "    this.headers[key] = value;\n" +
        "    return this;\n" +
        "  }\n" +
        "\n" +
        "  build(): Request {\n" +
        "    const qs = new URLSearchParams(this.params).toString();\n" +
        "    return new Request(`${this.baseUrl}?${qs}`, { headers: this.headers });\n" +
        "  }\n" +
        "}\n" +
        "```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: React 컴포넌트 팩토리",
      content:
        "React에서 팩토리 패턴을 활용해 동적으로 컴포넌트를 생성하는 예제입니다. " +
        "React.createElement 자체가 팩토리 패턴의 대표적 사례입니다.",
      code: {
        language: "typescript",
        code:
          "// 컴포넌트 팩토리 패턴\n" +
          "import { ComponentType, createElement } from 'react';\n" +
          "\n" +
          "// 1. 위젯 타입 정의\n" +
          "interface WidgetProps {\n" +
          "  title: string;\n" +
          "  data: unknown;\n" +
          "}\n" +
          "\n" +
          "// 2. 위젯 레지스트리 (팩토리 맵)\n" +
          "const widgetRegistry = new Map<string, ComponentType<WidgetProps>>();\n" +
          "\n" +
          "// 3. 위젯 등록 함수\n" +
          "function registerWidget(\n" +
          "  type: string,\n" +
          "  component: ComponentType<WidgetProps>\n" +
          ") {\n" +
          "  widgetRegistry.set(type, component);\n" +
          "}\n" +
          "\n" +
          "// 4. 위젯 생성 팩토리\n" +
          "function createWidget(type: string, props: WidgetProps) {\n" +
          "  const Widget = widgetRegistry.get(type);\n" +
          "  if (!Widget) {\n" +
          "    throw new Error(`Unknown widget: ${type}`);\n" +
          "  }\n" +
          "  return createElement(Widget, props);\n" +
          "}\n" +
          "\n" +
          "// 5. 대시보드에서 활용\n" +
          "interface DashboardConfig {\n" +
          "  widgets: Array<{ type: string; title: string; data: unknown }>;\n" +
          "}\n" +
          "\n" +
          "function Dashboard({ config }: { config: DashboardConfig }) {\n" +
          "  return createElement(\n" +
          "    'div',\n" +
          "    { className: 'dashboard-grid' },\n" +
          "    ...config.widgets.map((w) =>\n" +
          "      createWidget(w.type, { title: w.title, data: w.data })\n" +
          "    )\n" +
          "  );\n" +
          "}",
        description:
          "위젯 레지스트리에 컴포넌트를 등록하고, 설정 데이터만으로 동적 대시보드를 구성하는 팩토리 패턴입니다. " +
          "새 위젯을 추가할 때 레지스트리에 등록만 하면 되어 개방-폐쇄 원칙(OCP)을 따릅니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 폼 빌더 패턴",
      content:
        "빌더 패턴으로 복잡한 폼 설정을 단계별로 구성하는 실습입니다. " +
        "메서드 체이닝을 통해 가독성 높은 폼 정의가 가능합니다.",
      code: {
        language: "typescript",
        code:
          "// 폼 필드 타입 정의\n" +
          "interface FormField {\n" +
          "  name: string;\n" +
          "  type: 'text' | 'email' | 'number' | 'select';\n" +
          "  label: string;\n" +
          "  required: boolean;\n" +
          "  placeholder?: string;\n" +
          "  options?: string[];\n" +
          "  validate?: (value: string) => string | null;\n" +
          "}\n" +
          "\n" +
          "interface FormConfig {\n" +
          "  title: string;\n" +
          "  fields: FormField[];\n" +
          "  submitLabel: string;\n" +
          "}\n" +
          "\n" +
          "// 폼 빌더 클래스\n" +
          "class FormBuilder {\n" +
          "  private config: FormConfig = {\n" +
          "    title: '',\n" +
          "    fields: [],\n" +
          "    submitLabel: '제출',\n" +
          "  };\n" +
          "\n" +
          "  setTitle(title: string): this {\n" +
          "    this.config.title = title;\n" +
          "    return this;\n" +
          "  }\n" +
          "\n" +
          "  addTextField(name: string, label: string, required = false): this {\n" +
          "    this.config.fields.push({ name, type: 'text', label, required });\n" +
          "    return this;\n" +
          "  }\n" +
          "\n" +
          "  addEmailField(name: string, label: string): this {\n" +
          "    this.config.fields.push({\n" +
          "      name, type: 'email', label, required: true,\n" +
          "      validate: (v) => v.includes('@') ? null : '유효한 이메일을 입력하세요',\n" +
          "    });\n" +
          "    return this;\n" +
          "  }\n" +
          "\n" +
          "  addSelectField(name: string, label: string, options: string[]): this {\n" +
          "    this.config.fields.push({ name, type: 'select', label, required: true, options });\n" +
          "    return this;\n" +
          "  }\n" +
          "\n" +
          "  setSubmitLabel(label: string): this {\n" +
          "    this.config.submitLabel = label;\n" +
          "    return this;\n" +
          "  }\n" +
          "\n" +
          "  build(): FormConfig {\n" +
          "    if (!this.config.title) throw new Error('폼 제목은 필수입니다');\n" +
          "    if (this.config.fields.length === 0) throw new Error('최소 1개의 필드가 필요합니다');\n" +
          "    return { ...this.config };\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// 사용 예시 — 메서드 체이닝으로 가독성 높은 폼 정의\n" +
          "const signupForm = new FormBuilder()\n" +
          "  .setTitle('회원가입')\n" +
          "  .addTextField('name', '이름', true)\n" +
          "  .addEmailField('email', '이메일')\n" +
          "  .addSelectField('role', '역할', ['개발자', '디자이너', 'PM'])\n" +
          "  .setSubmitLabel('가입하기')\n" +
          "  .build();\n" +
          "\n" +
          "console.log(signupForm);",
        description:
          "빌더 패턴은 복잡한 객체를 단계별로 조립하며, 메서드 체이닝(return this)으로 " +
          "직관적인 API를 제공합니다. 유효성 검사를 build() 시점에 수행해 잘못된 상태의 객체 생성을 방지합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 목적 | 프론트엔드 활용 예시 |\n" +
        "|------|------|--------------------|\n" +
        "| 싱글턴 | 인스턴스 1개 보장 | 앱 설정, 전역 스토어, 로거 |\n" +
        "| 팩토리 | 생성 로직 캡슐화 | 컴포넌트 팩토리, createElement, 알림 생성 |\n" +
        "| 빌더 | 복잡한 객체 단계별 조립 | 쿼리 빌더, 폼 빌더, 설정 객체 |\n\n" +
        "**패턴 선택 기준:**\n" +
        "- 인스턴스가 반드시 하나여야 하면 → 싱글턴 (ESM 모듈 활용 권장)\n" +
        "- 타입에 따라 다른 객체를 생성해야 하면 → 팩토리\n" +
        "- 옵션이 많고 단계별 조립이 필요하면 → 빌더\n\n" +
        "**핵심 원칙:** 생성 패턴의 공통 목표는 '객체 생성의 복잡성을 호출자로부터 숨기는 것'입니다. " +
        "new 키워드를 직접 사용하는 대신 패턴을 통해 유연성과 테스트 용이성을 확보합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "생성 패턴은 객체 생성의 복잡성을 캡슐화하여 코드의 유연성과 재사용성을 높이는 검증된 설계 기법이다.",
  checklist: [
    "싱글턴 패턴을 구현하고 ES 모듈이 자연스럽게 싱글턴 역할을 하는 이유를 설명할 수 있다",
    "팩토리 패턴으로 타입별 객체 생성 로직을 캡슐화할 수 있다",
    "빌더 패턴으로 메서드 체이닝을 활용한 복잡한 객체 조립을 구현할 수 있다",
    "React.createElement가 팩토리 패턴의 사례임을 이해한다",
    "각 생성 패턴의 적용 시점과 장단점을 비교 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "싱글턴 패턴에서 생성자를 private으로 선언하는 이유는?",
      choices: [
        "성능을 향상시키기 위해",
        "외부에서 new 키워드로 새 인스턴스를 생성하는 것을 방지하기 위해",
        "상속을 허용하기 위해",
        "메모리를 절약하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "private 생성자는 클래스 외부에서 new로 인스턴스를 만드는 것을 차단합니다. " +
        "오직 getInstance() 정적 메서드를 통해서만 유일한 인스턴스에 접근할 수 있어 싱글턴을 보장합니다.",
    },
    {
      id: "q2",
      question: "ES 모듈(ESM)에서 별도의 싱글턴 클래스 없이도 싱글턴처럼 동작하는 이유는?",
      choices: [
        "ESM은 전역 스코프를 공유하기 때문",
        "ESM 모듈은 처음 import 시 한 번만 평가되고 이후에는 캐시된 결과를 반환하기 때문",
        "ESM은 클래스를 지원하지 않기 때문",
        "ESM은 자동으로 Object.freeze를 적용하기 때문",
      ],
      correctIndex: 1,
      explanation:
        "ESM에서 모듈 코드는 최초 import 시 한 번만 실행됩니다. 이후 다른 파일에서 같은 모듈을 import해도 " +
        "캐시된 동일한 모듈 객체를 반환합니다. 따라서 모듈 레벨 변수는 자연스럽게 싱글턴으로 동작합니다.",
    },
    {
      id: "q3",
      question: "팩토리 패턴의 가장 큰 장점은?",
      choices: [
        "객체를 불변으로 만들 수 있다",
        "실행 속도가 빨라진다",
        "호출자가 구체 클래스를 알 필요 없이 객체를 생성할 수 있어 결합도가 낮아진다",
        "메모리 사용량이 줄어든다",
      ],
      correctIndex: 2,
      explanation:
        "팩토리 패턴은 객체 생성 로직을 캡슐화합니다. 호출자는 어떤 구체 클래스가 생성되는지 몰라도 되고, " +
        "새로운 타입을 추가할 때 팩토리만 수정하면 됩니다. 이는 개방-폐쇄 원칙(OCP)을 따르는 설계입니다.",
    },
    {
      id: "q4",
      question: "빌더 패턴에서 각 메서드가 return this를 하는 이유는?",
      choices: [
        "메모리 누수를 방지하기 위해",
        "메서드 체이닝을 가능하게 하여 연속적으로 설정을 추가할 수 있게 하기 위해",
        "불변 객체를 만들기 위해",
        "비동기 처리를 위해",
      ],
      correctIndex: 1,
      explanation:
        "return this를 통해 메서드 체이닝이 가능합니다. builder.setTitle('제목').addField('name').build()처럼 " +
        "연속적으로 호출할 수 있어 가독성이 높아지고, 복잡한 객체를 직관적으로 구성할 수 있습니다.",
    },
    {
      id: "q5",
      question: "다음 중 프론트엔드에서 팩토리 패턴의 실제 사례가 아닌 것은?",
      choices: [
        "React.createElement()",
        "document.createElement()",
        "컴포넌트 위젯 레지스트리",
        "Array.prototype.map()",
      ],
      correctIndex: 3,
      explanation:
        "Array.prototype.map()은 배열을 변환하는 고차 함수이지 객체 생성 팩토리가 아닙니다. " +
        "React.createElement, document.createElement, 위젯 레지스트리는 모두 타입/설정을 받아 " +
        "적절한 객체를 생성하는 팩토리 패턴의 사례입니다.",
    },
  ],
};

export default chapter;
