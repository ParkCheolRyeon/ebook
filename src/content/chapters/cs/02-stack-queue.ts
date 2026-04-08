import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "02-stack-queue",
  subject: "cs",
  title: "스택과 큐",
  description:
    "LIFO와 FIFO의 개념을 이해하고, 콜 스택, 이벤트 큐, 브라우저 히스토리 등 프론트엔드의 핵심 메커니즘을 학습합니다.",
  order: 2,
  group: "자료구조",
  prerequisites: ["01-array-linked-list"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "**스택(Stack)**은 접시 쌓기입니다. 접시를 쌓을 때 마지막에 올린 접시를 먼저 꺼냅니다(LIFO: Last In, First Out). " +
        "웹 브라우저의 '뒤로 가기' 버튼을 생각해보세요 — 가장 최근에 방문한 페이지로 돌아갑니다.\n\n" +
        "**큐(Queue)**는 놀이공원 줄서기입니다. 먼저 온 사람이 먼저 탑니다(FIFO: First In, First Out). " +
        "프린터 대기열이나 카페 주문 대기가 대표적인 예입니다.\n\n" +
        "프론트엔드에서 스택과 큐는 단순한 자료구조가 아니라 **JavaScript 엔진의 핵심 동작 원리**입니다. " +
        "콜 스택(Call Stack)은 함수 실행을 관리하고, 태스크 큐(Task Queue)는 비동기 작업을 관리합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 개발에서 스택과 큐 개념이 필요한 상황들:\n\n" +
        "1. **콜 스택 이해** — 함수가 어떤 순서로 실행되고 반환되는지, 스택 오버플로가 왜 발생하는지\n" +
        "2. **이벤트 루프** — setTimeout, Promise 콜백이 언제 실행되는지 예측하려면 큐 구조를 알아야 함\n" +
        "3. **Undo/Redo 구현** — 텍스트 에디터, 그래픽 도구에서 작업 이력 관리\n" +
        "4. **브라우저 히스토리** — SPA 라우팅에서 페이지 이동 이력 관리\n" +
        "5. **Toast 알림 관리** — 알림을 순서대로 표시하고 제거하는 큐 패턴\n\n" +
        "이 자료구조를 모르면 JavaScript의 비동기 동작을 이해할 수 없고, " +
        "복잡한 UI 상태 관리에서 어려움을 겪게 됩니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 스택 (Stack) — LIFO\n\n" +
        "- `push(item)`: 맨 위에 추가 — O(1)\n" +
        "- `pop()`: 맨 위에서 제거 — O(1)\n" +
        "- `peek()`: 맨 위 요소 확인 (제거하지 않음) — O(1)\n\n" +
        "**프론트엔드 활용:**\n" +
        "- JavaScript 콜 스택: 함수 호출 시 push, 반환 시 pop\n" +
        "- 브라우저 히스토리: `history.pushState()`, `history.back()`\n" +
        "- Undo 기능: 작업을 스택에 push, Undo 시 pop\n\n" +
        "### 큐 (Queue) — FIFO\n\n" +
        "- `enqueue(item)`: 맨 뒤에 추가 — O(1)\n" +
        "- `dequeue()`: 맨 앞에서 제거 — O(1)*\n" +
        "- `peek()`: 맨 앞 요소 확인 — O(1)\n\n" +
        "\\* 배열 기반이면 O(n), 연결 리스트 기반이면 O(1)\n\n" +
        "**프론트엔드 활용:**\n" +
        "- 이벤트 루프의 태스크 큐 / 마이크로태스크 큐\n" +
        "- Toast 알림 대기열\n" +
        "- API 요청 큐 (Rate Limiting)\n" +
        "- BFS(너비 우선 탐색) — DOM 트리 순회 등",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Undo/Redo 시스템",
      content:
        "두 개의 스택을 사용하여 Undo/Redo 시스템을 구현합니다. " +
        "이 패턴은 텍스트 에디터, 그래픽 도구, 폼 입력 등 다양한 프론트엔드 애플리케이션에서 사용됩니다.",
      code: {
        language: "typescript",
        code:
          '// Undo/Redo를 위한 두 개의 스택 패턴\n' +
          'interface Action {\n' +
          '  type: string;\n' +
          '  payload: unknown;\n' +
          '  description: string;\n' +
          '}\n' +
          '\n' +
          'class UndoRedoManager {\n' +
          '  private undoStack: Action[] = [];  // Undo 스택\n' +
          '  private redoStack: Action[] = [];  // Redo 스택\n' +
          '\n' +
          '  // 새 작업 실행\n' +
          '  execute(action: Action): void {\n' +
          '    this.undoStack.push(action);  // Undo 스택에 push\n' +
          '    this.redoStack = [];          // Redo 스택 초기화 (중요!)\n' +
          '  }\n' +
          '\n' +
          '  // Undo: undoStack에서 pop → redoStack에 push\n' +
          '  undo(): Action | undefined {\n' +
          '    const action = this.undoStack.pop();\n' +
          '    if (action) {\n' +
          '      this.redoStack.push(action);\n' +
          '    }\n' +
          '    return action;\n' +
          '  }\n' +
          '\n' +
          '  // Redo: redoStack에서 pop → undoStack에 push\n' +
          '  redo(): Action | undefined {\n' +
          '    const action = this.redoStack.pop();\n' +
          '    if (action) {\n' +
          '      this.undoStack.push(action);\n' +
          '    }\n' +
          '    return action;\n' +
          '  }\n' +
          '\n' +
          '  canUndo(): boolean { return this.undoStack.length > 0; }\n' +
          '  canRedo(): boolean { return this.redoStack.length > 0; }\n' +
          '}',
        description:
          "Undo 시 undoStack에서 pop하여 redoStack에 push하고, Redo 시 반대로 동작합니다. 새 작업 실행 시 redoStack을 초기화하는 것이 핵심입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Toast 알림 큐 시스템",
      content:
        "Toast 알림을 큐로 관리하여 순서대로 표시하고 자동으로 제거하는 시스템을 구현합니다. " +
        "동시에 표시할 수 있는 알림 수를 제한하는 것이 실무에서 중요한 포인트입니다.",
      code: {
        language: "typescript",
        code:
          '// Toast 알림 큐 시스템\n' +
          'interface Toast {\n' +
          '  id: number;\n' +
          '  message: string;\n' +
          '  type: "success" | "error" | "info";\n' +
          '  duration: number;\n' +
          '}\n' +
          '\n' +
          'class ToastQueue {\n' +
          '  private queue: Toast[] = [];         // 대기 큐\n' +
          '  private active: Toast[] = [];        // 현재 표시 중\n' +
          '  private maxVisible: number = 3;      // 최대 동시 표시 수\n' +
          '  private nextId: number = 0;\n' +
          '\n' +
          '  // 새 알림 추가 (enqueue)\n' +
          '  add(message: string, type: Toast["type"] = "info", duration = 3000): number {\n' +
          '    const toast: Toast = {\n' +
          '      id: this.nextId++,\n' +
          '      message,\n' +
          '      type,\n' +
          '      duration,\n' +
          '    };\n' +
          '\n' +
          '    if (this.active.length < this.maxVisible) {\n' +
          '      this.show(toast);  // 바로 표시\n' +
          '    } else {\n' +
          '      this.queue.push(toast);  // 대기열에 추가\n' +
          '    }\n' +
          '    return toast.id;\n' +
          '  }\n' +
          '\n' +
          '  // 알림 표시\n' +
          '  private show(toast: Toast): void {\n' +
          '    this.active.push(toast);\n' +
          '    // duration 후 자동 제거\n' +
          '    setTimeout(() => this.remove(toast.id), toast.duration);\n' +
          '  }\n' +
          '\n' +
          '  // 알림 제거 후 대기열 처리 (dequeue)\n' +
          '  remove(id: number): void {\n' +
          '    this.active = this.active.filter(t => t.id !== id);\n' +
          '    // 대기열에서 다음 알림 표시\n' +
          '    if (this.queue.length > 0 && this.active.length < this.maxVisible) {\n' +
          '      const next = this.queue.shift()!;  // dequeue: FIFO\n' +
          '      this.show(next);\n' +
          '    }\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// 사용 예시\n' +
          'const toasts = new ToastQueue();\n' +
          'toasts.add("저장되었습니다", "success");\n' +
          'toasts.add("네트워크 오류", "error", 5000);\n' +
          'toasts.add("새 메시지가 도착했습니다", "info");',
        description:
          "큐(FIFO)를 활용하여 Toast 알림을 순서대로 관리합니다. 최대 표시 수를 제한하고, 제거 시 대기열에서 다음 알림을 자동으로 표시합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 특성 | 스택 (LIFO) | 큐 (FIFO) |\n" +
        "|------|-------------|----------|\n" +
        "| 삽입 | push (맨 위) | enqueue (맨 뒤) |\n" +
        "| 삭제 | pop (맨 위) | dequeue (맨 앞) |\n" +
        "| 조회 | peek (맨 위) | peek (맨 앞) |\n" +
        "| 시간 복잡도 | 모두 O(1) | 모두 O(1)* |\n\n" +
        "\\* 배열의 shift()는 O(n)이지만, 연결 리스트 기반이면 O(1)\n\n" +
        "**프론트엔드에서의 핵심 활용:**\n" +
        "- **스택**: 콜 스택, 브라우저 히스토리, Undo/Redo, 괄호 매칭\n" +
        "- **큐**: 이벤트 루프(태스크 큐, 마이크로태스크 큐), Toast 알림, API 요청 큐, BFS\n\n" +
        "JavaScript에서는 배열의 `push()/pop()`으로 스택을, " +
        "`push()/shift()`로 큐를 간단히 구현할 수 있습니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "스택은 LIFO(콜 스택, Undo), 큐는 FIFO(이벤트 큐, Toast) — 프론트엔드의 핵심 메커니즘이 이 두 자료구조로 동작한다.",
  checklist: [
    "스택(LIFO)과 큐(FIFO)의 차이를 설명할 수 있다",
    "JavaScript 콜 스택의 동작 원리를 이해한다",
    "이벤트 루프에서 태스크 큐의 역할을 설명할 수 있다",
    "두 개의 스택으로 Undo/Redo를 구현하는 원리를 설명할 수 있다",
    "큐 패턴을 활용한 Toast 알림 시스템을 설계할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "스택의 동작 원리를 올바르게 설명한 것은?",
      choices: [
        "먼저 들어온 요소가 먼저 나간다 (FIFO)",
        "마지막에 들어온 요소가 먼저 나간다 (LIFO)",
        "우선순위가 높은 요소가 먼저 나간다",
        "랜덤한 순서로 나간다",
      ],
      correctIndex: 1,
      explanation:
        "스택은 LIFO(Last In, First Out) 구조로, 가장 마지막에 추가된 요소가 가장 먼저 제거됩니다. 접시 쌓기와 같습니다.",
    },
    {
      id: "q2",
      question:
        "JavaScript의 콜 스택에 대한 설명으로 올바르지 않은 것은?",
      choices: [
        "함수가 호출되면 콜 스택에 push된다",
        "함수가 반환되면 콜 스택에서 pop된다",
        "콜 스택이 비어있을 때 이벤트 루프가 태스크 큐를 확인한다",
        "콜 스택은 여러 함수를 동시에 실행할 수 있다",
      ],
      correctIndex: 3,
      explanation:
        "JavaScript는 싱글 스레드이므로 콜 스택에서 한 번에 하나의 함수만 실행합니다. 여러 함수를 동시에 실행하는 것은 불가능합니다.",
    },
    {
      id: "q3",
      question: "Undo/Redo 시스템에서 새 작업을 실행할 때 해야 하는 것은?",
      choices: [
        "Undo 스택을 비운다",
        "Redo 스택을 비운다",
        "두 스택을 모두 비운다",
        "아무 스택도 비우지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "새 작업을 실행하면 Redo 스택을 초기화해야 합니다. 이전에 Undo한 작업들은 새 분기점이 생겼으므로 더 이상 Redo할 수 없기 때문입니다.",
    },
    {
      id: "q4",
      question:
        "JavaScript 배열로 큐를 구현할 때 shift()의 문제점은?",
      choices: [
        "메모리 누수가 발생한다",
        "O(n) 시간이 걸려 성능이 나쁘다",
        "undefined를 반환한다",
        "배열을 정렬한다",
      ],
      correctIndex: 1,
      explanation:
        "Array.shift()는 맨 앞 요소를 제거한 후 나머지 모든 요소의 인덱스를 한 칸씩 앞으로 이동해야 하므로 O(n)입니다.",
    },
    {
      id: "q5",
      question:
        "Toast 알림 시스템에서 FIFO 큐를 사용하는 이유는?",
      choices: [
        "가장 중요한 알림을 먼저 표시하기 위해",
        "가장 최근 알림을 먼저 표시하기 위해",
        "먼저 요청된 알림을 먼저 순서대로 표시하기 위해",
        "알림을 랜덤 순서로 표시하기 위해",
      ],
      correctIndex: 2,
      explanation:
        "사용자 경험상 먼저 발생한 이벤트의 알림이 먼저 표시되어야 자연스럽습니다. FIFO 큐가 이 순서를 보장합니다.",
    },
  ],
};

export default chapter;
