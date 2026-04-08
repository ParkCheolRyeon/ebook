import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "08-recursion-dp",
  subject: "cs",
  title: "재귀와 동적 프로그래밍",
  description:
    "재귀의 원리와 스택 오버플로, 메모이제이션, 동적 프로그래밍을 이해하고, React 트리 뷰 등 재귀 컴포넌트 패턴을 학습합니다.",
  order: 8,
  group: "알고리즘 기초",
  prerequisites: ["05-time-space-complexity"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "**재귀(Recursion)**는 러시아 인형(마트료시카)입니다. " +
        "큰 인형을 열면 작은 인형이 나오고, 또 열면 더 작은 인형이 나옵니다. " +
        "가장 작은 인형(기저 조건, base case)에 도달하면 열기를 멈추고 다시 닫아갑니다.\n\n" +
        "**동적 프로그래밍(DP)**은 시험 공부 전략입니다. " +
        "같은 문제를 여러 번 풀지 않고, 한 번 풀면 정답을 노트에 적어둡니다(메모이제이션). " +
        "다음에 같은 문제가 나오면 노트를 보고 즉시 답합니다.\n\n" +
        "프론트엔드에서 재귀는 **중첩 구조**를 다룰 때 필수입니다:\n" +
        "- 파일 탐색기 (폴더 안의 폴더)\n" +
        "- 댓글의 답글 (무한 중첩)\n" +
        "- 메뉴/네비게이션 (서브메뉴)\n" +
        "- JSON 깊은 복사 (중첩 객체)\n" +
        "- React 컴포넌트 트리",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "재귀와 DP가 필요한 프론트엔드 상황:\n\n" +
        "1. **중첩 UI 렌더링** — 트리 뷰, 재귀 댓글, 중첩 메뉴를 어떻게 컴포넌트로 표현할까?\n" +
        "2. **깊은 객체 처리** — 중첩 객체의 깊은 비교, 깊은 복사, 깊은 병합\n" +
        "3. **스택 오버플로 방지** — 재귀가 너무 깊어지면 콜 스택이 넘침\n" +
        "4. **반복 계산 최적화** — 같은 입력에 대한 비싼 계산을 캐싱\n" +
        "5. **복잡한 최적화 문제** — 장바구니 할인 조합, 레이아웃 배치 최적화\n\n" +
        "**핵심 위험:**\n" +
        "- 기저 조건(base case)을 빠뜨리면 **무한 재귀** → 스택 오버플로\n" +
        "- 메모이제이션 없이 재귀하면 **지수 시간** O(2ⁿ)\n" +
        "- JavaScript의 콜 스택은 약 10,000~25,000 프레임이 한계",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 재귀의 핵심 구조\n\n" +
        "1. **기저 조건(Base Case)**: 재귀를 멈추는 조건 — 반드시 필요\n" +
        "2. **재귀 단계(Recursive Step)**: 문제를 더 작은 하위 문제로 분할\n" +
        "3. **수렴(Convergence)**: 매 호출마다 기저 조건에 가까워져야 함\n\n" +
        "### 스택 오버플로 방지 전략\n\n" +
        "- **꼬리 재귀(Tail Recursion)**: 재귀 호출이 함수의 마지막 연산 — Safari(JavaScriptCore)만 TCO를 지원하며, V8(Chrome/Node.js)은 TCO를 지원하지 않고 구현 계획도 없음\n" +
        "- **반복문 변환**: 재귀를 while 루프 + 스택으로 변환\n" +
        "- **트램폴린(Trampoline)**: 재귀를 지연 호출로 변환하여 스택 사용 방지\n\n" +
        "### 동적 프로그래밍 (DP)\n\n" +
        "**겹치는 하위 문제(Overlapping Subproblems)**가 있을 때 사용합니다.\n\n" +
        "- **Top-Down (메모이제이션)**: 재귀 + 캐싱 — 필요한 것만 계산\n" +
        "- **Bottom-Up (타뷸레이션)**: 작은 문제부터 반복문으로 해결 — 스택 오버플로 없음\n\n" +
        "### 피보나치 예시로 비교\n\n" +
        "| 방법 | 시간 | 공간 | 특징 |\n" +
        "|------|------|------|------|\n" +
        "| 순수 재귀 | O(2ⁿ) | O(n) | 중복 계산 심각 |\n" +
        "| 메모이제이션 | O(n) | O(n) | 캐시로 중복 제거 |\n" +
        "| Bottom-Up | O(n) | O(1) | 변수 2개로 충분 |",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 재귀와 DP 패턴",
      content:
        "피보나치 수열의 세 가지 구현 방법을 비교하고, " +
        "깊은 복사(deep clone)의 재귀 구현을 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// 1. 순수 재귀: O(2ⁿ) — ❌ 절대 사용 금지\n' +
          'function fibNaive(n: number): number {\n' +
          '  if (n <= 1) return n;  // 기저 조건\n' +
          '  return fibNaive(n - 1) + fibNaive(n - 2);  // 중복 계산!\n' +
          '}\n' +
          '// fib(50)은 수십 초 이상 걸림\n' +
          '\n' +
          '// 2. Top-Down DP (메모이제이션): O(n)\n' +
          'function fibMemo(n: number, memo: Map<number, number> = new Map()): number {\n' +
          '  if (n <= 1) return n;\n' +
          '  if (memo.has(n)) return memo.get(n)!;  // 캐시 히트\n' +
          '\n' +
          '  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);\n' +
          '  memo.set(n, result);  // 결과 캐싱\n' +
          '  return result;\n' +
          '}\n' +
          '\n' +
          '// 3. Bottom-Up DP (타뷸레이션): O(n) 시간, O(1) 공간\n' +
          'function fibBottomUp(n: number): number {\n' +
          '  if (n <= 1) return n;\n' +
          '  let prev2 = 0, prev1 = 1;\n' +
          '  for (let i = 2; i <= n; i++) {\n' +
          '    const current = prev1 + prev2;\n' +
          '    prev2 = prev1;\n' +
          '    prev1 = current;\n' +
          '  }\n' +
          '  return prev1;\n' +
          '}\n' +
          '\n' +
          '// 4. 깊은 복사 (재귀 활용) — 프론트엔드 실무\n' +
          'function deepClone<T>(obj: T): T {\n' +
          '  // 기저 조건: 원시값 또는 null\n' +
          '  if (obj === null || typeof obj !== "object") return obj;\n' +
          '\n' +
          '  // 배열 처리\n' +
          '  if (Array.isArray(obj)) {\n' +
          '    return obj.map(item => deepClone(item)) as T;\n' +
          '  }\n' +
          '\n' +
          '  // 객체 처리: 각 프로퍼티를 재귀적으로 복사\n' +
          '  const cloned = {} as T;\n' +
          '  for (const key in obj) {\n' +
          '    if (Object.prototype.hasOwnProperty.call(obj, key)) {\n' +
          '      cloned[key] = deepClone(obj[key]);\n' +
          '    }\n' +
          '  }\n' +
          '  return cloned;\n' +
          '}',
        description:
          "순수 재귀 O(2ⁿ)을 메모이제이션으로 O(n)으로 개선합니다. deepClone은 재귀의 프론트엔드 실무 활용 예시입니다. (실무에서는 structuredClone() API를 권장합니다.)",
      },
    },
    {
      type: "practice",
      title: "실습 예제: React 재귀 컴포넌트와 메모이제이션",
      content:
        "React에서 재귀 컴포넌트로 트리 뷰를 구현하고, " +
        "메모이제이션으로 렌더링을 최적화하는 패턴을 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// 1. 재귀 컴포넌트: 트리 뷰\n' +
          'interface TreeItem {\n' +
          '  id: string;\n' +
          '  label: string;\n' +
          '  children?: TreeItem[];\n' +
          '}\n' +
          '\n' +
          '// React 컴포넌트 (의사코드)\n' +
          'function TreeNode({ item, depth = 0 }: { item: TreeItem; depth?: number }) {\n' +
          '  // 기저 조건: children이 없으면 리프 노드\n' +
          '  const isLeaf = !item.children || item.children.length === 0;\n' +
          '\n' +
          '  return (\n' +
          '    // <div style={{ paddingLeft: depth * 20 }}>\n' +
          '    //   <span>{isLeaf ? "📄" : "📁"} {item.label}</span>\n' +
          '    //   {item.children?.map(child =>\n' +
          '    //     <TreeNode key={child.id} item={child} depth={depth + 1} />\n' +
          '    //   )}\n' +
          '    // </div>\n' +
          '    { item, depth }  // 재귀 구조 표현\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 2. 범용 메모이제이션 함수 (DP의 프론트엔드 활용)\n' +
          'function memoize<Args extends unknown[], R>(\n' +
          '  fn: (...args: Args) => R,\n' +
          '  keyFn: (...args: Args) => string = (...args) => JSON.stringify(args)\n' +
          '): (...args: Args) => R {\n' +
          '  const cache = new Map<string, R>();\n' +
          '\n' +
          '  return (...args: Args): R => {\n' +
          '    const key = keyFn(...args);\n' +
          '    if (cache.has(key)) return cache.get(key)!;\n' +
          '    const result = fn(...args);\n' +
          '    cache.set(key, result);\n' +
          '    return result;\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          '// 3. DP 실전 예제: 최소 동전 교환 (장바구니 할인 최적화와 유사)\n' +
          'function minCoins(coins: number[], amount: number): number {\n' +
          '  // Bottom-Up DP\n' +
          '  const dp = new Array(amount + 1).fill(Infinity);\n' +
          '  dp[0] = 0;  // 0원을 만드는 데 필요한 동전 수 = 0\n' +
          '\n' +
          '  for (let i = 1; i <= amount; i++) {\n' +
          '    for (const coin of coins) {\n' +
          '      if (coin <= i && dp[i - coin] + 1 < dp[i]) {\n' +
          '        dp[i] = dp[i - coin] + 1;\n' +
          '      }\n' +
          '    }\n' +
          '  }\n' +
          '\n' +
          '  return dp[amount] === Infinity ? -1 : dp[amount];\n' +
          '}\n' +
          '\n' +
          '// 사용 예시\n' +
          'minCoins([1, 5, 10, 50, 100, 500], 780);  // 7 (500+100+100+50+10+10+10)\n' +
          '// 장바구니에서 쿠폰 조합 최적화도 유사한 DP 패턴',
        description:
          "TreeNode 컴포넌트가 자기 자신을 재귀적으로 렌더링합니다. minCoins는 Bottom-Up DP로 스택 오버플로 없이 최적해를 구합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### 재귀 체크리스트\n" +
        "1. **기저 조건을 먼저 작성** — 무한 재귀 방지\n" +
        "2. **수렴 확인** — 매 호출마다 기저 조건에 가까워지는지\n" +
        "3. **콜 스택 깊이 주의** — JS는 약 10,000~25,000 프레임 한계\n" +
        "4. **중복 계산 감지** — 같은 인자로 여러 번 호출되면 메모이제이션\n\n" +
        "### DP 적용 조건\n" +
        "1. **최적 부분 구조**: 큰 문제의 최적해가 작은 문제의 최적해로 구성\n" +
        "2. **겹치는 하위 문제**: 같은 하위 문제가 반복적으로 등장\n\n" +
        "### 프론트엔드 실무 활용\n\n" +
        "| 패턴 | 활용 예시 |\n" +
        "|------|----------|\n" +
        "| 재귀 컴포넌트 | 트리 뷰, 중첩 댓글, 메뉴 |\n" +
        "| 재귀 데이터 처리 | deepClone, deepMerge, JSON 변환 |\n" +
        "| 메모이제이션 | useMemo, React.memo, 캐싱 |\n" +
        "| Bottom-Up DP | 최적화 계산 (쿠폰 조합 등) |",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "재귀는 기저 조건이 핵심이고, 중복 계산이 있으면 메모이제이션(DP)으로 O(2ⁿ)을 O(n)으로 개선하라 — React의 중첩 UI와 useMemo가 모두 이 원리다.",
  checklist: [
    "재귀의 기저 조건과 재귀 단계를 올바르게 설계할 수 있다",
    "스택 오버플로의 원인과 방지 전략을 설명할 수 있다",
    "메모이제이션(Top-Down)과 타뷸레이션(Bottom-Up)의 차이를 설명할 수 있다",
    "React에서 재귀 컴포넌트 패턴을 구현할 수 있다",
    "DP 적용 조건(최적 부분 구조, 겹치는 하위 문제)을 판별할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "재귀 함수에서 기저 조건(base case)이 없으면 어떻게 되는가?",
      choices: [
        "함수가 0을 반환한다",
        "자동으로 멈춘다",
        "무한 재귀로 스택 오버플로가 발생한다",
        "undefined를 반환한다",
      ],
      correctIndex: 2,
      explanation:
        "기저 조건이 없으면 함수가 자기 자신을 무한히 호출하여 콜 스택이 넘칩니다. JavaScript에서는 'Maximum call stack size exceeded' 에러가 발생합니다.",
    },
    {
      id: "q2",
      question:
        "피보나치를 순수 재귀로 구현했을 때 시간 복잡도가 O(2ⁿ)인 이유는?",
      choices: [
        "반복문이 2번 실행되어서",
        "같은 하위 문제를 중복으로 여러 번 계산하기 때문",
        "배열을 2번 순회해서",
        "메모리가 부족해서",
      ],
      correctIndex: 1,
      explanation:
        "fib(5)를 계산하려면 fib(4)+fib(3)이 필요하고, fib(4)는 다시 fib(3)+fib(2)를 계산합니다. fib(3)이 중복 계산됩니다. 이 중복이 기하급수적으로 늘어나 O(2ⁿ)이 됩니다.",
    },
    {
      id: "q3",
      question:
        "Top-Down DP(메모이제이션)와 Bottom-Up DP(타뷸레이션)의 차이는?",
      choices: [
        "Top-Down이 항상 더 빠르다",
        "Top-Down은 재귀+캐싱, Bottom-Up은 반복문으로 작은 문제부터 해결",
        "Bottom-Up은 메모리를 전혀 사용하지 않는다",
        "두 방법은 같은 시간 복잡도를 가질 수 없다",
      ],
      correctIndex: 1,
      explanation:
        "Top-Down은 재귀로 필요한 하위 문제만 계산하고 결과를 캐싱합니다. Bottom-Up은 가장 작은 문제부터 반복문으로 풀어나가므로 스택 오버플로 위험이 없습니다.",
    },
    {
      id: "q4",
      question: "React에서 재귀 컴포넌트를 만들 때 반드시 필요한 것은?",
      choices: [
        "useEffect Hook",
        "기저 조건 (children이 없을 때 재귀 중단)",
        "Redux 상태 관리",
        "서버 사이드 렌더링",
      ],
      correctIndex: 1,
      explanation:
        "재귀 컴포넌트도 일반 재귀 함수와 마찬가지로 기저 조건이 필요합니다. 자식이 없는 리프 노드에서 재귀를 멈춰야 무한 렌더링을 방지합니다.",
    },
    {
      id: "q5",
      question:
        "JavaScript에서 깊은 복사(deep clone)를 구현할 때 재귀가 필요한 이유는?",
      choices: [
        "성능이 좋아서",
        "객체가 중첩될 수 있어 각 레벨을 재귀적으로 복사해야 하므로",
        "메모리를 적게 사용해서",
        "비동기 처리가 필요해서",
      ],
      correctIndex: 1,
      explanation:
        "객체 안에 객체가 있고, 그 안에 또 배열이 있을 수 있습니다. 모든 깊이의 중첩 구조를 완전히 복사하려면 재귀적으로 탐색하여 각 값을 복사해야 합니다. (실무에서는 structuredClone() 사용을 권장합니다.)",
    },
  ],
};

export default chapter;
