import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "10-memory-management",
  subject: "cs",
  title: "메모리 관리",
  description:
    "스택과 힙의 차이, 가비지 컬렉션 알고리즘, 그리고 자바스크립트에서 흔히 발생하는 메모리 누수 패턴을 학습합니다.",
  order: 10,
  group: "운영체제",
  prerequisites: ["09-process-thread"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "메모리 관리는 도서관 운영과 비슷합니다.\n\n" +
        "**스택(Stack)**은 열람실 책상입니다. 책을 가져와서 읽고, 다 읽으면 바로 반납합니다. 공간이 한정되어 있고, 마지막에 올려놓은 책을 먼저 치웁니다(LIFO). 함수가 호출될 때 변수가 쌓이고, 함수가 끝나면 자동으로 치워집니다.\n\n" +
        "**힙(Heap)**은 서고입니다. 책(객체)을 보관하는 넓은 공간이지만, 정리가 안 되면 점점 어질러집니다. 누가 빌려간 책인지 추적해야 하고, 아무도 안 읽는 책은 정기적으로 폐기해야 합니다.\n\n" +
        "**가비지 컬렉터(GC)**는 도서관 사서입니다. 정기적으로 서고를 돌며 '이 책을 아직 누가 읽고 있나?' 확인합니다. " +
        "아무도 참조하지 않는 책은 폐기하여 공간을 확보합니다. 사서가 일하는 동안 열람실은 잠시 조용해지죠(GC 일시 정지).",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 개발에서 메모리 관리가 왜 중요할까요?\n\n" +
        "1. **메모리 누수(Memory Leak)** — SPA(Single Page Application)에서 페이지 전환 시 이전 컴포넌트의 이벤트 리스너나 타이머가 정리되지 않으면, 시간이 지날수록 메모리 사용량이 계속 증가합니다.\n\n" +
        "2. **GC 일시 정지(GC Pause)** — 가비지 컬렉터가 작동할 때 메인 스레드가 잠시 멈춥니다. 대량의 객체가 생성/소멸되면 GC가 자주 실행되어 프레임 드롭이 발생합니다.\n\n" +
        "3. **모바일 환경의 제약** — 모바일 기기는 RAM이 제한적입니다. 메모리를 과다 사용하면 브라우저가 탭을 강제로 종료합니다.\n\n" +
        "4. **클로저와 참조 유지** — 자바스크립트의 클로저는 외부 변수의 참조를 유지합니다. 의도치 않게 대용량 데이터의 참조가 유지되면 GC가 회수하지 못합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 스택(Stack) vs 힙(Heap)\n\n" +
        "| 구분 | 스택 | 힙 |\n" +
        "|------|------|----|\n" +
        "| 저장 대상 | 원시값, 함수 호출 프레임 | 객체, 배열, 함수 |\n" +
        "| 관리 방식 | 자동 (LIFO) | 가비지 컬렉터 |\n" +
        "| 크기 | 작고 고정적 | 크고 유동적 |\n" +
        "| 속도 | 매우 빠름 | 상대적으로 느림 |\n" +
        "| 할당/해제 | 함수 시작/종료 시 자동 | GC가 판단하여 해제 |\n\n" +
        "### V8의 가비지 컬렉션\n\n" +
        "V8 엔진은 **세대별(Generational) GC**를 사용합니다:\n\n" +
        "- **Young Generation (새 세대)**: 새로 생성된 객체가 위치. Scavenger(Minor GC)가 자주 실행. 대부분의 객체는 금방 죽습니다(약 80%).\n" +
        "- **Old Generation (구 세대)**: Young에서 살아남은 객체가 승격. Mark-and-Sweep(Major GC)가 가끔 실행.\n\n" +
        "### Mark-and-Sweep 알고리즘\n\n" +
        "1. **Mark 단계**: 루트(전역 객체, 스택 변수)에서 시작하여 도달 가능한 모든 객체에 표시\n" +
        "2. **Sweep 단계**: 표시되지 않은 객체의 메모리를 해제\n" +
        "3. **Compact 단계**: 메모리 조각 모음(단편화 해소)\n\n" +
        "### 흔한 메모리 누수 패턴\n\n" +
        "1. **정리되지 않은 이벤트 리스너**: `addEventListener` 후 `removeEventListener`를 호출하지 않음\n" +
        "2. **정리되지 않은 타이머**: `setInterval`을 `clearInterval`로 정리하지 않음\n" +
        "3. **분리된 DOM(Detached DOM)**: DOM에서 제거했지만 JS 변수가 참조를 유지\n" +
        "4. **클로저의 의도치 않은 참조**: 큰 배열이나 객체를 클로저가 캡처",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Mark-and-Sweep 시뮬레이션",
      content:
        "가비지 컬렉터의 Mark-and-Sweep 알고리즘을 단순화하여 타입스크립트로 구현해봅시다.",
      code: {
        language: "typescript",
        code:
          '// Mark-and-Sweep 알고리즘의 단순화된 구현\n' +
          '\n' +
          'interface HeapObject {\n' +
          '  id: string;\n' +
          '  marked: boolean;\n' +
          '  references: HeapObject[];\n' +
          '}\n' +
          '\n' +
          'class SimpleGC {\n' +
          '  private heap: HeapObject[] = [];\n' +
          '  private roots: HeapObject[] = []; // 전역 변수, 스택 변수\n' +
          '\n' +
          '  allocate(id: string): HeapObject {\n' +
          '    const obj: HeapObject = { id, marked: false, references: [] };\n' +
          '    this.heap.push(obj);\n' +
          '    return obj;\n' +
          '  }\n' +
          '\n' +
          '  // Phase 1: 루트에서 도달 가능한 모든 객체에 표시\n' +
          '  private mark(obj: HeapObject): void {\n' +
          '    if (obj.marked) return; // 이미 방문한 객체는 건너뜀\n' +
          '    obj.marked = true;\n' +
          '    for (const ref of obj.references) {\n' +
          '      this.mark(ref); // 참조를 따라 재귀 탐색\n' +
          '    }\n' +
          '  }\n' +
          '\n' +
          '  // Phase 2: 표시되지 않은 객체 제거\n' +
          '  private sweep(): string[] {\n' +
          '    const collected: string[] = [];\n' +
          '    this.heap = this.heap.filter((obj) => {\n' +
          '      if (!obj.marked) {\n' +
          '        collected.push(obj.id);\n' +
          '        return false; // 메모리 해제\n' +
          '      }\n' +
          '      obj.marked = false; // 다음 GC를 위해 초기화\n' +
          '      return true;\n' +
          '    });\n' +
          '    return collected;\n' +
          '  }\n' +
          '\n' +
          '  // GC 실행\n' +
          '  collect(): string[] {\n' +
          '    for (const root of this.roots) {\n' +
          '      this.mark(root);\n' +
          '    }\n' +
          '    return this.sweep();\n' +
          '  }\n' +
          '}',
        description:
          "Mark-and-Sweep은 루트에서 도달 가능한 객체를 표시(mark)한 후, 표시되지 않은 객체를 제거(sweep)합니다. V8은 이를 세대별로 나누어 최적화합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 메모리 누수 패턴과 해결",
      content:
        "프론트엔드에서 자주 발생하는 메모리 누수 패턴과 해결 방법을 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// ❌ 패턴 1: 정리되지 않은 이벤트 리스너\n' +
          'class BadComponent {\n' +
          '  handler = () => console.log(this); // this 참조 유지\n' +
          '  mount() {\n' +
          '    window.addEventListener("resize", this.handler);\n' +
          '  }\n' +
          '  // unmount에서 removeEventListener를 호출하지 않음!\n' +
          '}\n' +
          '\n' +
          '// ✅ 해결: 정리 함수 호출\n' +
          'class GoodComponent {\n' +
          '  handler = () => console.log(this);\n' +
          '  mount() {\n' +
          '    window.addEventListener("resize", this.handler);\n' +
          '  }\n' +
          '  unmount() {\n' +
          '    window.removeEventListener("resize", this.handler);\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// ❌ 패턴 2: 분리된 DOM 참조\n' +
          'const detachedNodes: HTMLElement[] = [];\n' +
          'function createAndRemove() {\n' +
          '  const div = document.createElement("div");\n' +
          '  document.body.appendChild(div);\n' +
          '  document.body.removeChild(div);\n' +
          '  detachedNodes.push(div); // DOM에서 제거했지만 참조 유지!\n' +
          '}\n' +
          '\n' +
          '// ❌ 패턴 3: 클로저가 큰 데이터 참조\n' +
          'function processData() {\n' +
          '  const hugeArray = new Array(1_000_000).fill("data");\n' +
          '  return () => {\n' +
          '    // hugeArray의 첫 번째 요소만 필요하지만\n' +
          '    // 클로저가 전체 배열 참조를 유지함\n' +
          '    return hugeArray[0];\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          '// ✅ 해결: 필요한 데이터만 캡처\n' +
          'function processDataFixed() {\n' +
          '  const hugeArray = new Array(1_000_000).fill("data");\n' +
          '  const firstItem = hugeArray[0]; // 필요한 것만 추출\n' +
          '  return () => firstItem; // 원본 배열은 GC 가능\n' +
          '}\n' +
          '\n' +
          '// 🔍 Chrome DevTools로 메모리 분석\n' +
          '// 1. DevTools > Memory 탭\n' +
          '// 2. "Take heap snapshot" 클릭\n' +
          '// 3. 작업 수행 후 다시 스냅샷\n' +
          '// 4. "Comparison" 뷰로 메모리 증가 확인',
        description:
          "메모리 누수의 세 가지 주요 패턴: 이벤트 리스너 미정리, 분리된 DOM 참조, 클로저의 불필요한 참조 유지. Chrome DevTools의 Memory 탭으로 진단합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### 메모리 구조\n" +
        "- **스택**: 원시값과 함수 호출 프레임, 자동 관리(LIFO)\n" +
        "- **힙**: 객체와 배열, 가비지 컬렉터가 관리\n\n" +
        "### V8 가비지 컬렉션\n" +
        "- **Young Generation**: 새 객체, Scavenger(Minor GC)로 자주 수집\n" +
        "- **Old Generation**: 오래된 객체, Mark-and-Sweep(Major GC)으로 가끔 수집\n" +
        "- GC 실행 시 메인 스레드 일시 정지 발생\n\n" +
        "### 메모리 누수 방지\n" +
        "- 이벤트 리스너는 반드시 해제\n" +
        "- setInterval/setTimeout 정리\n" +
        "- DOM 제거 시 JS 참조도 해제\n" +
        "- 클로저에서 필요한 데이터만 캡처\n\n" +
        "**핵심:** 자바스크립트는 GC가 메모리를 관리하지만, 개발자가 참조를 제대로 관리하지 않으면 GC도 메모리를 회수할 수 없습니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "스택은 원시값을 자동 관리하고, 힙은 객체를 GC로 관리한다. 참조가 남아있으면 GC도 회수할 수 없으므로, 이벤트 리스너와 타이머 정리가 필수다.",
  checklist: [
    "스택과 힙의 차이와 각각 저장되는 데이터를 설명할 수 있다",
    "Mark-and-Sweep 가비지 컬렉션 알고리즘의 동작 원리를 설명할 수 있다",
    "V8의 세대별 GC(Young/Old Generation)를 이해한다",
    "자바스크립트에서 흔한 메모리 누수 패턴 3가지를 열거할 수 있다",
    "Chrome DevTools Memory 탭을 사용하여 메모리 누수를 진단할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "자바스크립트에서 원시값(number, string 등)은 어디에 저장되는가?",
      choices: ["힙(Heap)에만", "스택(Stack)에만", "스택에 저장 (변수가 지역 변수일 때)", "GPU 메모리에"],
      correctIndex: 2,
      explanation:
        "원시값은 일반적으로 스택에 저장됩니다. 함수의 지역 변수로 선언된 원시값은 함수 호출 프레임과 함께 스택에 쌓이고, 함수가 종료되면 자동으로 해제됩니다. 다만 클로저에 의해 캡처된 경우 힙에 저장될 수 있습니다.",
    },
    {
      id: "q2",
      question: "V8의 세대별 GC에서 대부분의 객체가 빠르게 수집되는 영역은?",
      choices: ["Old Generation", "Young Generation", "Stack", "Code Space"],
      correctIndex: 1,
      explanation:
        "Young Generation은 새로 생성된 객체가 위치하는 영역으로, 대부분의 객체(약 80%)가 금방 사용되지 않게 됩니다. Scavenger(Minor GC)가 자주 실행되어 빠르게 수집합니다.",
    },
    {
      id: "q3",
      question: "다음 중 메모리 누수를 일으키는 패턴이 아닌 것은?",
      choices: [
        "removeEventListener를 호출하지 않은 이벤트 리스너",
        "clearInterval로 정리하지 않은 setInterval",
        "const로 선언한 원시값 변수",
        "DOM에서 제거했지만 JS 변수가 참조하는 요소",
      ],
      correctIndex: 2,
      explanation:
        "const로 선언한 원시값은 스택에 저장되며 스코프를 벗어나면 자동으로 해제됩니다. 메모리 누수는 GC가 회수할 수 없는 참조가 남아있을 때 발생합니다.",
    },
    {
      id: "q4",
      question: "Mark-and-Sweep 알고리즘의 'Mark' 단계에서 하는 일은?",
      choices: [
        "모든 객체를 삭제 대상으로 표시한다",
        "루트에서 도달 가능한 객체를 살아있다고 표시한다",
        "가장 오래된 객체부터 순서대로 표시한다",
        "메모리 사용량이 가장 큰 객체를 표시한다",
      ],
      correctIndex: 1,
      explanation:
        "Mark 단계는 루트(전역 객체, 스택 변수)에서 시작하여 참조를 따라가며 도달 가능한 모든 객체에 '살아있음' 표시를 합니다. 이후 Sweep 단계에서 표시되지 않은 객체가 제거됩니다.",
    },
    {
      id: "q5",
      question:
        "SPA에서 페이지를 전환할 때 메모리 누수를 방지하기 위해 가장 중요한 것은?",
      choices: [
        "전역 변수를 많이 사용한다",
        "컴포넌트 언마운트 시 이벤트 리스너와 타이머를 정리한다",
        "모든 변수를 var로 선언한다",
        "객체를 최대한 많이 생성한다",
      ],
      correctIndex: 1,
      explanation:
        "SPA에서 페이지 전환은 실제 페이지 새로고침이 아니므로, 이전 페이지의 이벤트 리스너, setInterval, WebSocket 연결 등이 자동으로 정리되지 않습니다. React의 useEffect cleanup이나 Vue의 onUnmounted에서 명시적으로 정리해야 합니다.",
    },
  ],
};

export default chapter;
