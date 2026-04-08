import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "17-behavioral-patterns",
  subject: "cs",
  title: "행위 패턴",
  description: "객체 간 상호작용과 책임 분배를 다루는 옵저버, 전략, 커맨드, 이터레이터, 미디에이터 패턴과 프론트엔드 실전 활용을 학습합니다.",
  order: 17,
  group: "디자인 패턴",
  prerequisites: ["15-creational-patterns"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "행위 패턴은 '사람들 사이의 소통 방식과 역할 분담'에 비유할 수 있습니다.\n\n" +
        "**옵저버(Observer)** — 유튜브 구독 알림 시스템입니다. 채널(Subject)에 새 영상이 올라오면 " +
        "구독자(Observer)들에게 자동으로 알림이 갑니다. 구독을 취소하면 알림이 멈춥니다. " +
        "DOM 이벤트, RxJS, 상태 관리 라이브러리가 이 패턴을 사용합니다.\n\n" +
        "**전략(Strategy)** — 네비게이션에서 '최단거리', '최소시간', '무료도로'를 선택하는 것입니다. " +
        "목적지(목표)는 같지만 알고리즘(경로 계산 방식)을 런타임에 교체합니다.\n\n" +
        "**커맨드(Command)** — 리모컨의 버튼입니다. 각 버튼은 '명령'을 객체로 캡슐화합니다. " +
        "되감기 버튼으로 이전 상태로 돌아갈 수 있는 것처럼, undo/redo를 구현합니다.\n\n" +
        "**이터레이터(Iterator)** — 도서관에서 책을 하나씩 꺼내 읽는 것입니다. " +
        "컬렉션의 내부 구조를 몰라도 순차적으로 접근할 수 있습니다.\n\n" +
        "**미디에이터(Mediator)** — 공항 관제탑입니다. 비행기들이 서로 직접 통신하면 혼란스러우니 " +
        "관제탑을 통해 소통합니다. Redux가 대표적 미디에이터입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드에서 객체 간 소통이 복잡해지는 상황들:\n\n" +
        "**1. 이벤트 기반 통신의 스파게티 코드:**\n" +
        "```typescript\n" +
        "// 문제: 컴포넌트 간 직접 참조 — 강한 결합\n" +
        "class Header {\n" +
        "  constructor(private cart: Cart, private notification: Notification) {}\n" +
        "  onLogin(user: User) {\n" +
        "    this.cart.loadUserCart(user.id);       // Cart에 직접 결합\n" +
        "    this.notification.show('환영합니다');    // Notification에 직접 결합\n" +
        "  }\n" +
        "}\n" +
        "```\n\n" +
        "**2. 조건별 로직 교체의 어려움:**\n" +
        "```typescript\n" +
        "// 문제: 새 정렬 방식 추가 시 함수 전체를 수정\n" +
        "function sortProducts(products: Product[], method: string) {\n" +
        "  if (method === 'price') return products.sort((a, b) => a.price - b.price);\n" +
        "  if (method === 'name') return products.sort((a, b) => a.name.localeCompare(b.name));\n" +
        "  if (method === 'rating') return products.sort((a, b) => b.rating - a.rating);\n" +
        "  // 계속 추가...\n" +
        "}\n" +
        "```\n\n" +
        "**3. Undo/Redo 구현의 복잡성:** 상태 변경 이력을 관리하고 되돌리는 기능을 매번 새로 구현해야 합니다.\n\n" +
        "**4. 모듈 간 다대다 통신:** 여러 모듈이 서로 직접 참조하면 결합도가 급격히 증가합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. 옵저버 패턴 — 이벤트 시스템\n\n" +
        "발행자와 구독자를 분리해 느슨한 결합을 달성합니다.\n\n" +
        "```typescript\n" +
        "type Listener<T> = (data: T) => void;\n" +
        "\n" +
        "class EventEmitter<Events extends Record<string, any>> {\n" +
        "  private listeners = new Map<keyof Events, Set<Listener<any>>>();\n" +
        "\n" +
        "  on<K extends keyof Events>(event: K, fn: Listener<Events[K]>) {\n" +
        "    if (!this.listeners.has(event)) this.listeners.set(event, new Set());\n" +
        "    this.listeners.get(event)!.add(fn);\n" +
        "    return () => this.listeners.get(event)?.delete(fn);\n" +
        "  }\n" +
        "\n" +
        "  emit<K extends keyof Events>(event: K, data: Events[K]) {\n" +
        "    this.listeners.get(event)?.forEach(fn => fn(data));\n" +
        "  }\n" +
        "}\n" +
        "```\n\n" +
        "### 2. 전략 패턴 — 알고리즘 교체\n\n" +
        "```typescript\n" +
        "type SortStrategy<T> = (items: T[]) => T[];\n" +
        "\n" +
        "const sortStrategies: Record<string, SortStrategy<Product>> = {\n" +
        "  price: (items) => [...items].sort((a, b) => a.price - b.price),\n" +
        "  name: (items) => [...items].sort((a, b) => a.name.localeCompare(b.name)),\n" +
        "  rating: (items) => [...items].sort((a, b) => b.rating - a.rating),\n" +
        "};\n" +
        "\n" +
        "// 새 전략 추가 — 기존 코드 수정 없이 확장\n" +
        "sortStrategies.newest = (items) => \n" +
        "  [...items].sort((a, b) => b.createdAt - a.createdAt);\n" +
        "```\n\n" +
        "### 3. 커맨드 패턴 — Undo/Redo\n\n" +
        "```typescript\n" +
        "interface Command {\n" +
        "  execute(): void;\n" +
        "  undo(): void;\n" +
        "}\n" +
        "\n" +
        "class CommandManager {\n" +
        "  private history: Command[] = [];\n" +
        "  private redoStack: Command[] = [];\n" +
        "\n" +
        "  execute(cmd: Command) {\n" +
        "    cmd.execute();\n" +
        "    this.history.push(cmd);\n" +
        "    this.redoStack = []; // 새 명령 시 redo 스택 초기화\n" +
        "  }\n" +
        "\n" +
        "  undo() {\n" +
        "    const cmd = this.history.pop();\n" +
        "    if (cmd) { cmd.undo(); this.redoStack.push(cmd); }\n" +
        "  }\n" +
        "\n" +
        "  redo() {\n" +
        "    const cmd = this.redoStack.pop();\n" +
        "    if (cmd) { cmd.execute(); this.history.push(cmd); }\n" +
        "  }\n" +
        "}\n" +
        "```\n\n" +
        "### 4. 이터레이터 패턴\n\n" +
        "```typescript\n" +
        "// 제너레이터로 이터레이터 구현\n" +
        "function* paginate<T>(items: T[], pageSize: number) {\n" +
        "  for (let i = 0; i < items.length; i += pageSize) {\n" +
        "    yield items.slice(i, i + pageSize);\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "const pages = paginate(products, 10);\n" +
        "console.log(pages.next().value); // 첫 10개\n" +
        "```\n\n" +
        "### 5. 미디에이터 패턴 — 이벤트 버스\n\n" +
        "```typescript\n" +
        "// Redux는 미디에이터 역할 — 모든 상태 변경이 store를 통해 중재됨\n" +
        "// 컴포넌트들은 서로를 몰라도 store를 통해 소통\n" +
        "dispatch({ type: 'cart/add', payload: product });\n" +
        "```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 타입 안전한 옵저버 패턴",
      content:
        "TypeScript 제네릭을 활용해 이벤트 이름과 데이터 타입이 연동되는 " +
        "타입 안전한 이벤트 시스템을 구현합니다.",
      code: {
        language: "typescript",
        code:
          "// 이벤트 타입 정의\n" +
          "interface AppEvents {\n" +
          "  'user:login': { id: string; name: string };\n" +
          "  'user:logout': void;\n" +
          "  'cart:update': { items: Array<{ id: string; qty: number }> };\n" +
          "  'theme:change': 'light' | 'dark';\n" +
          "}\n" +
          "\n" +
          "// 타입 안전한 이벤트 이미터\n" +
          "type Handler<T> = T extends void ? () => void : (data: T) => void;\n" +
          "\n" +
          "class TypedEventEmitter<E extends Record<string, any>> {\n" +
          "  private listeners = new Map<keyof E, Set<Function>>();\n" +
          "\n" +
          "  on<K extends keyof E>(event: K, handler: Handler<E[K]>): () => void {\n" +
          "    if (!this.listeners.has(event)) {\n" +
          "      this.listeners.set(event, new Set());\n" +
          "    }\n" +
          "    this.listeners.get(event)!.add(handler);\n" +
          "\n" +
          "    // unsubscribe 함수 반환\n" +
          "    return () => {\n" +
          "      this.listeners.get(event)?.delete(handler);\n" +
          "    };\n" +
          "  }\n" +
          "\n" +
          "  emit<K extends keyof E>(\n" +
          "    event: K,\n" +
          "    ...args: E[K] extends void ? [] : [E[K]]\n" +
          "  ): void {\n" +
          "    this.listeners.get(event)?.forEach((handler) => {\n" +
          "      (handler as Function)(...args);\n" +
          "    });\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// 사용 예시\n" +
          "const bus = new TypedEventEmitter<AppEvents>();\n" +
          "\n" +
          "// 타입 자동 추론\n" +
          "const unsub = bus.on('user:login', (data) => {\n" +
          "  console.log(data.id, data.name); // 타입 안전\n" +
          "});\n" +
          "\n" +
          "bus.on('theme:change', (theme) => {\n" +
          "  document.body.className = theme; // 'light' | 'dark'\n" +
          "});\n" +
          "\n" +
          "// 타입 체크\n" +
          "bus.emit('user:login', { id: '1', name: 'Kim' }); // OK\n" +
          "// bus.emit('user:login', { wrong: true }); // 컴파일 에러!\n" +
          "bus.emit('user:logout'); // void 이벤트는 인자 불필요\n" +
          "\n" +
          "// 정리\n" +
          "unsub();",
        description:
          "TypeScript 제네릭과 조건부 타입을 활용해 이벤트 이름에 따라 핸들러의 매개변수 타입이 " +
          "자동으로 추론됩니다. void 이벤트는 인자 없이 emit할 수 있습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 텍스트 에디터 Undo/Redo",
      content:
        "커맨드 패턴으로 텍스트 에디터의 Undo/Redo 기능을 구현하는 실습입니다. " +
        "각 편집 동작을 Command 객체로 캡슐화합니다.",
      code: {
        language: "typescript",
        code:
          "// 커맨드 인터페이스\n" +
          "interface EditorCommand {\n" +
          "  execute(): void;\n" +
          "  undo(): void;\n" +
          "  description: string;\n" +
          "}\n" +
          "\n" +
          "// 에디터 상태\n" +
          "class TextEditor {\n" +
          "  content: string = '';\n" +
          "  private history: EditorCommand[] = [];\n" +
          "  private redoStack: EditorCommand[] = [];\n" +
          "\n" +
          "  execute(command: EditorCommand): void {\n" +
          "    command.execute();\n" +
          "    this.history.push(command);\n" +
          "    this.redoStack = [];\n" +
          "  }\n" +
          "\n" +
          "  undo(): void {\n" +
          "    const cmd = this.history.pop();\n" +
          "    if (cmd) {\n" +
          "      cmd.undo();\n" +
          "      this.redoStack.push(cmd);\n" +
          "      console.log(`Undo: ${cmd.description}`);\n" +
          "    }\n" +
          "  }\n" +
          "\n" +
          "  redo(): void {\n" +
          "    const cmd = this.redoStack.pop();\n" +
          "    if (cmd) {\n" +
          "      cmd.execute();\n" +
          "      this.history.push(cmd);\n" +
          "      console.log(`Redo: ${cmd.description}`);\n" +
          "    }\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// 구체 커맨드: 텍스트 삽입\n" +
          "class InsertTextCommand implements EditorCommand {\n" +
          "  description: string;\n" +
          "  constructor(\n" +
          "    private editor: TextEditor,\n" +
          "    private text: string,\n" +
          "    private position: number\n" +
          "  ) {\n" +
          "    this.description = `Insert \"${text}\" at ${position}`;\n" +
          "  }\n" +
          "\n" +
          "  execute(): void {\n" +
          "    const before = this.editor.content.slice(0, this.position);\n" +
          "    const after = this.editor.content.slice(this.position);\n" +
          "    this.editor.content = before + this.text + after;\n" +
          "  }\n" +
          "\n" +
          "  undo(): void {\n" +
          "    const before = this.editor.content.slice(0, this.position);\n" +
          "    const after = this.editor.content.slice(this.position + this.text.length);\n" +
          "    this.editor.content = before + after;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// 구체 커맨드: 텍스트 삭제\n" +
          "class DeleteTextCommand implements EditorCommand {\n" +
          "  description: string;\n" +
          "  private deleted: string = '';\n" +
          "  constructor(\n" +
          "    private editor: TextEditor,\n" +
          "    private position: number,\n" +
          "    private length: number\n" +
          "  ) {\n" +
          "    this.description = `Delete ${length} chars at ${position}`;\n" +
          "  }\n" +
          "\n" +
          "  execute(): void {\n" +
          "    this.deleted = this.editor.content.slice(\n" +
          "      this.position, this.position + this.length\n" +
          "    );\n" +
          "    const before = this.editor.content.slice(0, this.position);\n" +
          "    const after = this.editor.content.slice(this.position + this.length);\n" +
          "    this.editor.content = before + after;\n" +
          "  }\n" +
          "\n" +
          "  undo(): void {\n" +
          "    const before = this.editor.content.slice(0, this.position);\n" +
          "    const after = this.editor.content.slice(this.position);\n" +
          "    this.editor.content = before + this.deleted + after;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// 사용\n" +
          "const editor = new TextEditor();\n" +
          "editor.execute(new InsertTextCommand(editor, 'Hello ', 0));\n" +
          "editor.execute(new InsertTextCommand(editor, 'World', 6));\n" +
          "console.log(editor.content); // 'Hello World'\n" +
          "\n" +
          "editor.undo(); // Undo: Insert \"World\" at 6\n" +
          "console.log(editor.content); // 'Hello '\n" +
          "\n" +
          "editor.redo(); // Redo: Insert \"World\" at 6\n" +
          "console.log(editor.content); // 'Hello World'",
        description:
          "커맨드 패턴은 동작을 객체로 캡슐화하여 실행 이력을 관리합니다. " +
          "각 커맨드는 execute()와 undo()를 가지며, 이를 스택으로 관리해 Undo/Redo를 구현합니다. " +
          "텍스트 에디터, 그래픽 에디터, 스프레드시트 등에서 널리 사용됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 목적 | 프론트엔드 활용 |\n" +
        "|------|------|----------------|\n" +
        "| 옵저버 | 느슨한 결합 통신 | DOM 이벤트, RxJS, pub/sub |\n" +
        "| 전략 | 알고리즘 교체 | 정렬, 유효성 검사, 테마 |\n" +
        "| 커맨드 | 동작 캡슐화 | Undo/Redo, 매크로, 큐 |\n" +
        "| 이터레이터 | 순차 접근 | for...of, 제너레이터, 페이지네이션 |\n" +
        "| 미디에이터 | 중앙 중재 | Redux, 이벤트 버스 |\n\n" +
        "**행위 패턴의 공통 목표:** 객체 간의 상호작용을 체계적으로 관리하여 " +
        "결합도를 낮추고 유연성을 높입니다. 옵저버로 1:N 통신을, 미디에이터로 N:N 통신을, " +
        "전략으로 알고리즘 교체를, 커맨드로 동작 이력 관리를, 이터레이터로 순차 접근을 해결합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "행위 패턴은 객체 간 상호작용과 책임 분배를 체계화하여 느슨한 결합과 유연한 확장을 가능하게 하는 설계 기법이다.",
  checklist: [
    "옵저버 패턴으로 타입 안전한 이벤트 이미터를 구현할 수 있다",
    "전략 패턴으로 정렬, 유효성 검사 등의 알고리즘을 런타임에 교체할 수 있다",
    "커맨드 패턴으로 Undo/Redo 기능을 구현할 수 있다",
    "이터레이터와 제너레이터를 활용해 페이지네이션 등 순차 접근을 구현할 수 있다",
    "미디에이터 패턴의 관점에서 Redux의 역할을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "옵저버 패턴에서 'unsubscribe' 함수가 중요한 이유는?",
      choices: [
        "코드 가독성을 높이기 위해",
        "더 이상 필요 없는 구독을 해제하지 않으면 메모리 누수가 발생하기 때문",
        "비동기 처리를 위해",
        "타입 안전성을 보장하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "구독을 해제하지 않으면 컴포넌트가 제거된 후에도 이벤트 핸들러가 메모리에 남아 " +
        "메모리 누수가 발생합니다. React의 useEffect cleanup이나 RxJS의 unsubscribe가 이를 방지합니다.",
    },
    {
      id: "q2",
      question: "전략 패턴에서 새로운 정렬 방식을 추가할 때의 장점은?",
      choices: [
        "기존 코드를 수정해야 한다",
        "새 전략 함수만 추가하면 되어 기존 코드를 수정하지 않아도 된다",
        "if-else가 줄어든다",
        "성능이 향상된다",
      ],
      correctIndex: 1,
      explanation:
        "전략 패턴에서 새로운 알고리즘은 기존 전략 맵에 등록만 하면 됩니다. " +
        "기존 코드를 수정하지 않고 확장할 수 있어 개방-폐쇄 원칙(OCP)을 따릅니다.",
    },
    {
      id: "q3",
      question: "커맨드 패턴에서 새로운 명령을 실행한 후 redoStack을 비우는 이유는?",
      choices: [
        "메모리를 절약하기 위해",
        "새 명령 실행 후 이전의 redo 이력은 더 이상 유효하지 않기 때문",
        "스택 오버플로우를 방지하기 위해",
        "성능 최적화를 위해",
      ],
      correctIndex: 1,
      explanation:
        "A → B → undo(B) 상태에서 C를 실행하면, B를 다시 실행(redo)하는 것은 " +
        "의미가 없습니다. 새 분기가 생겼으므로 이전 redo 이력을 초기화합니다. " +
        "대부분의 에디터가 이 방식으로 동작합니다.",
    },
    {
      id: "q4",
      question: "JavaScript의 for...of 구문과 관련된 디자인 패턴은?",
      choices: [
        "옵저버 패턴",
        "전략 패턴",
        "이터레이터 패턴",
        "커맨드 패턴",
      ],
      correctIndex: 2,
      explanation:
        "for...of는 이터러블 프로토콜(Symbol.iterator)을 따르는 객체를 순회합니다. " +
        "이는 이터레이터 패턴의 구현으로, 컬렉션의 내부 구조를 몰라도 순차적으로 접근할 수 있게 합니다. " +
        "배열, Map, Set, 제너레이터 등이 이터러블입니다.",
    },
    {
      id: "q5",
      question: "Redux가 미디에이터 패턴에 해당하는 이유는?",
      choices: [
        "Redux가 객체를 생성하기 때문",
        "모든 상태 변경이 중앙 store를 통해 중재되어 컴포넌트들이 서로를 직접 참조하지 않기 때문",
        "Redux가 알고리즘을 교체 가능하게 하기 때문",
        "Redux가 순차 접근을 제공하기 때문",
      ],
      correctIndex: 1,
      explanation:
        "미디에이터 패턴에서 모든 통신은 중재자를 통합니다. Redux에서 컴포넌트는 action을 dispatch하고 " +
        "store의 state를 구독할 뿐, 다른 컴포넌트를 직접 참조하지 않습니다. " +
        "store가 미디에이터 역할을 하여 다대다 의존성을 일대다로 단순화합니다.",
    },
  ],
};

export default chapter;
