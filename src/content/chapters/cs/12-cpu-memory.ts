import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "12-cpu-memory",
  subject: "cs",
  title: "CPU와 메모리 구조",
  description:
    "CPU의 명령어 실행 과정과 메모리 구조를 이해하고, V8 엔진의 JIT 컴파일과 코드 최적화를 학습합니다.",
  order: 12,
  group: "컴퓨터 구조",
  prerequisites: [],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "컴퓨터의 CPU와 메모리는 요리사와 주방에 비유할 수 있습니다.\n\n" +
        "**CPU**는 요리사입니다. 레시피(명령어)를 읽고, 재료를 준비하고(디코드), 요리합니다(실행). " +
        "요리사가 빠를수록(클럭 속도) 음식이 빨리 나오고, 요리사가 여러 명이면(멀티코어) 동시에 여러 요리를 만들 수 있습니다.\n\n" +
        "**레지스터**는 요리사의 손입니다. 지금 당장 사용하는 재료(데이터)를 들고 있습니다. 가장 빠르지만, 양이 매우 적습니다.\n\n" +
        "**RAM**은 조리대입니다. 당장 사용할 재료를 올려두는 공간입니다. 손(레지스터)보다 넓지만, 냉장고(디스크)보다는 작습니다. " +
        "전원이 꺼지면(정전) 조리대 위의 재료는 사라집니다(휘발성).\n\n" +
        "**디스크(SSD/HDD)**는 냉장고/창고입니다. 대용량이지만, 재료를 꺼내오는 데 시간이 걸립니다. " +
        "전원이 꺼져도 보관됩니다(비휘발성).\n\n" +
        "V8 엔진의 **JIT 컴파일**은 자주 만드는 요리의 레시피를 외우는 것입니다. 처음에는 레시피를 보며 천천히 만들지만(인터프리터), " +
        "같은 요리를 반복하면 레시피 없이 빠르게 만들 수 있습니다(컴파일된 코드).",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 개발자가 CPU와 메모리 구조를 알아야 하는 이유는?\n\n" +
        "1. **V8 최적화 이해** — V8 엔진이 자바스크립트를 어떻게 최적화하는지 알면, 더 빠른 코드를 작성할 수 있습니다. " +
        "예를 들어 객체의 프로퍼티 순서를 일정하게 유지하면 V8의 히든 클래스(Hidden Class) 최적화가 작동합니다.\n\n" +
        "2. **성능 프로파일링 해석** — Chrome DevTools의 Performance 탭에서 'Scripting', 'Rendering', 'Painting' 시간을 이해하려면 " +
        "CPU가 어떻게 명령어를 실행하는지 기본 개념이 필요합니다.\n\n" +
        "3. **메모리 예산 관리** — 모바일 기기의 RAM은 제한적입니다. 자바스크립트 힙이 얼마나 메모리를 사용하는지 이해해야 합니다.\n\n" +
        "4. **WASM과 저수준 최적화** — WebAssembly를 사용하거나 성능 크리티컬한 코드를 작성할 때, CPU 아키텍처에 대한 기본 이해가 도움됩니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### CPU 명령어 사이클 (Fetch-Decode-Execute)\n\n" +
        "CPU는 매 클럭 사이클마다 세 단계를 반복합니다:\n\n" +
        "1. **Fetch(인출)**: 메모리에서 다음 명령어를 가져옴 (PC 레지스터가 가리키는 주소)\n" +
        "2. **Decode(해독)**: 명령어를 해석 — 어떤 연산인지, 피연산자는 무엇인지\n" +
        "3. **Execute(실행)**: ALU(산술논리장치)에서 연산 수행, 결과를 레지스터나 메모리에 저장\n\n" +
        "현대 CPU는 **파이프라이닝**으로 이 단계를 중첩 실행합니다. 명령어 1을 실행하는 동안 명령어 2를 디코드하고 명령어 3을 가져옵니다.\n\n" +
        "### 메모리 계층 구조\n\n" +
        "| 구분 | 크기 | 속도 | 역할 |\n" +
        "|------|------|------|------|\n" +
        "| 레지스터 | ~수백 바이트 | 1 사이클 | CPU 내부, 현재 연산 데이터 |\n" +
        "| L1 캐시 | ~64KB | ~4 사이클 | 자주 쓰는 데이터/명령어 |\n" +
        "| L2 캐시 | ~256KB | ~10 사이클 | L1 보조 |\n" +
        "| L3 캐시 | ~수 MB | ~40 사이클 | 코어 간 공유 |\n" +
        "| RAM | ~수 GB | ~200 사이클 | 프로그램과 데이터 |\n" +
        "| SSD | ~수 TB | ~수만 사이클 | 영구 저장 |\n\n" +
        "### V8 엔진의 코드 실행 과정\n\n" +
        "1. **파싱**: JS 소스 → AST(Abstract Syntax Tree)\n" +
        "2. **Ignition(인터프리터)**: AST → 바이트코드로 변환, 즉시 실행\n" +
        "3. **프로파일링**: 자주 실행되는 코드(Hot Code) 감지\n" +
        "4. **TurboFan(JIT 컴파일러)**: Hot Code를 최적화된 기계어로 컴파일\n" +
        "5. **Deoptimization**: 타입이 바뀌면 최적화를 취소하고 인터프리터로 복귀\n\n" +
        "### 히든 클래스(Hidden Class)\n\n" +
        "V8은 동적 타입인 JS 객체에 내부적으로 '히든 클래스'를 부여하여 프로퍼티 접근을 최적화합니다. " +
        "같은 순서로 같은 프로퍼티를 가진 객체들은 히든 클래스를 공유하여 빠른 접근이 가능합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: V8 최적화를 위한 코드 패턴",
      content:
        "V8 엔진의 JIT 컴파일러가 효과적으로 최적화할 수 있는 코드 패턴을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// === V8 히든 클래스 최적화 ===\n' +
          '\n' +
          '// ❌ 나쁜 패턴: 프로퍼티 추가 순서가 다름 → 히든 클래스 다름\n' +
          'function createUserBad(type: string) {\n' +
          '  const user: any = {};\n' +
          '  if (type === "admin") {\n' +
          '    user.role = "admin";  // 히든 클래스 전이 1\n' +
          '    user.name = "Alice";  // 히든 클래스 전이 2\n' +
          '  } else {\n' +
          '    user.name = "Bob";    // 다른 히든 클래스 전이 1\n' +
          '    user.role = "user";   // 다른 히든 클래스 전이 2\n' +
          '  }\n' +
          '  return user;\n' +
          '}\n' +
          '\n' +
          '// ✅ 좋은 패턴: 항상 같은 순서로 프로퍼티 초기화\n' +
          'function createUserGood(type: string) {\n' +
          '  return {\n' +
          '    name: type === "admin" ? "Alice" : "Bob",\n' +
          '    role: type === "admin" ? "admin" : "user",\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          '// === 모노모픽 vs 폴리모픽 함수 ===\n' +
          '\n' +
          '// ✅ 모노모픽: 항상 같은 타입의 인자 → V8이 최적화\n' +
          'function addNumbers(a: number, b: number): number {\n' +
          '  return a + b;\n' +
          '}\n' +
          'addNumbers(1, 2);    // number + number\n' +
          'addNumbers(3, 4);    // number + number → TurboFan 최적화!\n' +
          '\n' +
          '// ❌ 폴리모픽: 다양한 타입 → 최적화 어려움\n' +
          'function addAny(a: any, b: any) {\n' +
          '  return a + b;\n' +
          '}\n' +
          'addAny(1, 2);        // number + number\n' +
          'addAny("a", "b");    // string + string → 최적화 취소(deopt)\n' +
          '\n' +
          '// === 배열 타입 일관성 ===\n' +
          '\n' +
          '// ✅ 좋은 패턴: 같은 타입의 요소\n' +
          'const numbers = [1, 2, 3, 4, 5]; // PACKED_SMI (최적)\n' +
          '\n' +
          '// ❌ 나쁜 패턴: 혼합 타입, 빈 구멍\n' +
          'const mixed = [1, "two", 3];     // PACKED_ELEMENTS (느림)\n' +
          'const holey = [1, , 3];           // HOLEY_SMI (더 느림)',
        description:
          "V8은 히든 클래스와 인라인 캐시를 통해 프로퍼티 접근을 최적화합니다. 같은 구조의 객체, 일관된 타입 사용, 배열 타입 통일이 성능에 중요합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: JIT 컴파일 효과 관찰",
      content:
        "V8의 JIT 컴파일 최적화 효과를 직접 관찰하고, 최적화가 깨지는 상황을 실험합니다.",
      code: {
        language: "typescript",
        code:
          '// === JIT 워밍업 효과 관찰 ===\n' +
          'function sumArray(arr: number[]): number {\n' +
          '  let sum = 0;\n' +
          '  for (let i = 0; i < arr.length; i++) {\n' +
          '    sum += arr[i];\n' +
          '  }\n' +
          '  return sum;\n' +
          '}\n' +
          '\n' +
          'const testArr = Array.from({ length: 100_000 }, (_, i) => i);\n' +
          '\n' +
          '// 첫 번째 실행: 인터프리터 (느림)\n' +
          'console.time("1st run");\n' +
          'sumArray(testArr);\n' +
          'console.timeEnd("1st run");\n' +
          '\n' +
          '// 반복 실행: JIT 컴파일 후 (빨라짐)\n' +
          'for (let i = 0; i < 100; i++) sumArray(testArr); // 워밍업\n' +
          '\n' +
          'console.time("after JIT");\n' +
          'sumArray(testArr);\n' +
          'console.timeEnd("after JIT");\n' +
          '\n' +
          '// === 최적화가 깨지는 상황 (Deoptimization) ===\n' +
          '\n' +
          '// V8이 number[]로 최적화한 상태에서...\n' +
          'const mixedArr: any[] = Array.from({ length: 100_000 }, (_, i) => i);\n' +
          'mixedArr[50_000] = "문자열"; // 타입이 바뀜!\n' +
          '\n' +
          'console.time("deopt run");\n' +
          'sumArray(mixedArr as number[]); // 최적화 취소 → 느려짐\n' +
          'console.timeEnd("deopt run");\n' +
          '\n' +
          '// === 메모리 사용량 확인 (Node.js) ===\n' +
          'function checkMemory(): void {\n' +
          '  const usage = process.memoryUsage();\n' +
          '  console.log({\n' +
          '    heapUsed: `${(usage.heapUsed / 1024 / 1024).toFixed(1)}MB`,\n' +
          '    heapTotal: `${(usage.heapTotal / 1024 / 1024).toFixed(1)}MB`,\n' +
          '    rss: `${(usage.rss / 1024 / 1024).toFixed(1)}MB`, // 전체 메모리\n' +
          '  });\n' +
          '}\n' +
          '\n' +
          '// === Chrome DevTools Performance 탭 활용 ===\n' +
          '// 1. DevTools > Performance 탭 > Record 클릭\n' +
          '// 2. 앱 사용 후 Stop\n' +
          '// 3. "Bottom-Up" 뷰에서 JS 실행 시간 확인\n' +
          '// 4. "Scripting" 비율이 높으면 JS 최적화 필요',
        description:
          "JIT 컴파일의 워밍업 효과와 Deoptimization을 직접 관찰합니다. 타입 일관성을 유지하면 V8의 최적화가 지속됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### CPU\n" +
        "- Fetch → Decode → Execute 사이클 반복\n" +
        "- 파이프라이닝으로 명령어 중첩 실행\n" +
        "- 멀티코어로 진정한 병렬 처리\n\n" +
        "### 메모리 계층\n" +
        "- 레지스터 > L1 캐시 > L2 캐시 > L3 캐시 > RAM > SSD\n" +
        "- 위로 갈수록 빠르고 작고, 아래로 갈수록 느리고 큼\n\n" +
        "### V8 엔진\n" +
        "- 파싱 → Ignition(인터프리터) → TurboFan(JIT 컴파일러)\n" +
        "- 히든 클래스: 같은 구조의 객체를 빠르게 접근\n" +
        "- 타입 일관성을 유지하면 최적화가 지속됨\n" +
        "- 타입이 바뀌면 Deoptimization 발생\n\n" +
        "**핵심:** V8은 반복 실행되는 코드를 기계어로 컴파일하여 최적화합니다. 타입 일관성과 객체 구조의 일관성을 유지하면 V8이 효과적으로 최적화할 수 있습니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "CPU는 Fetch-Decode-Execute 사이클로 명령을 실행하고, V8은 JIT 컴파일로 자주 실행되는 JS 코드를 기계어로 최적화한다. 타입 일관성이 핵심이다.",
  checklist: [
    "CPU의 Fetch-Decode-Execute 사이클을 설명할 수 있다",
    "메모리 계층 구조(레지스터, 캐시, RAM, 디스크)를 설명할 수 있다",
    "V8의 Ignition(인터프리터)과 TurboFan(JIT 컴파일러)의 역할을 구분할 수 있다",
    "히든 클래스와 인라인 캐시를 활용한 최적화 패턴을 적용할 수 있다",
    "Deoptimization이 발생하는 원인과 방지 방법을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "CPU가 명령어를 처리하는 기본 사이클의 올바른 순서는?",
      choices: [
        "Execute → Decode → Fetch",
        "Decode → Fetch → Execute",
        "Fetch → Decode → Execute",
        "Fetch → Execute → Decode",
      ],
      correctIndex: 2,
      explanation:
        "CPU는 메모리에서 명령어를 가져오고(Fetch), 그 명령어를 해석한 후(Decode), 실제 연산을 수행(Execute)합니다. 이 세 단계를 매 클럭 사이클마다 반복합니다.",
    },
    {
      id: "q2",
      question: "V8 엔진에서 자주 실행되는 코드를 기계어로 컴파일하는 컴포넌트는?",
      choices: ["Ignition", "TurboFan", "Sparkplug", "Parser"],
      correctIndex: 1,
      explanation:
        "TurboFan은 V8의 최적화 JIT 컴파일러입니다. Ignition이 바이트코드를 실행하면서 프로파일링 데이터를 수집하고, 자주 실행되는 Hot Code를 TurboFan이 최적화된 기계어로 컴파일합니다.",
    },
    {
      id: "q3",
      question: "V8의 히든 클래스 최적화를 깨뜨리는 패턴은?",
      choices: [
        "객체 리터럴로 한 번에 프로퍼티를 선언한다",
        "같은 형태의 객체를 여러 개 생성한다",
        "조건에 따라 프로퍼티 추가 순서를 다르게 한다",
        "TypeScript 인터페이스로 타입을 고정한다",
      ],
      correctIndex: 2,
      explanation:
        "V8은 프로퍼티 추가 순서에 따라 히든 클래스 전이를 만듭니다. 조건에 따라 추가 순서가 달라지면 서로 다른 히든 클래스가 생성되어 인라인 캐시 최적화가 작동하지 않습니다.",
    },
    {
      id: "q4",
      question: "메모리 계층에서 가장 빠르지만 크기가 가장 작은 것은?",
      choices: ["RAM", "L1 캐시", "레지스터", "SSD"],
      correctIndex: 2,
      explanation:
        "레지스터는 CPU 내부에 있는 가장 빠른 저장 공간으로, 1 클럭 사이클 만에 접근할 수 있습니다. 하지만 크기는 수백 바이트에 불과합니다.",
    },
    {
      id: "q5",
      question:
        "V8에서 Deoptimization이 발생하는 상황은?",
      choices: [
        "함수가 처음 호출될 때",
        "코드에 주석이 많을 때",
        "JIT 최적화된 함수에 예상과 다른 타입의 인자가 전달될 때",
        "변수를 const로 선언할 때",
      ],
      correctIndex: 2,
      explanation:
        "TurboFan은 프로파일링 데이터를 기반으로 특정 타입을 가정하여 최적화합니다. 실제 실행 시 다른 타입이 들어오면 가정이 깨져서 최적화를 취소(Deoptimization)하고 Ignition으로 돌아갑니다.",
    },
  ],
};

export default chapter;
