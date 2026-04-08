import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "18-functional-patterns",
  subject: "cs",
  title: "함수형 패턴",
  description: "순수 함수, 불변성, 합성, 커링, 모나드 등 함수형 프로그래밍 패턴과 React에서의 실전 활용을 학습합니다.",
  order: 18,
  group: "디자인 패턴",
  prerequisites: ["17-behavioral-patterns"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "함수형 프로그래밍은 '수학 공식처럼 코드를 작성하는 것'입니다.\n\n" +
        "**순수 함수** — 자판기에 500원을 넣으면 항상 같은 음료가 나옵니다. " +
        "같은 입력에 항상 같은 출력을 반환하고, 외부 상태를 변경하지 않습니다.\n\n" +
        "**불변성(Immutability)** — 공식 문서에 수정이 필요하면 원본을 고치지 않고 새 버전을 발행합니다. " +
        "데이터를 직접 수정하지 않고 새로운 복사본을 만듭니다.\n\n" +
        "**함수 합성(Composition)** — 레고 블록을 조립하는 것입니다. 작은 함수들을 연결해 " +
        "복잡한 동작을 만듭니다. pipe(a, b, c)는 a의 결과를 b에, b의 결과를 c에 전달합니다.\n\n" +
        "**커링(Currying)** — 레스토랑에서 코스 요리를 주문하는 것입니다. " +
        "한꺼번에 모든 재료를 전달하는 대신, 단계별로 하나씩 전달합니다. " +
        "add(2)(3)처럼 인자를 하나씩 받는 함수 체인입니다.\n\n" +
        "**모나드(Monad)** — 택배 상자입니다. 물건(값)을 상자(컨텍스트)에 넣어 안전하게 운반합니다. " +
        "Promise가 모나드와 유사한 특성을 가지며, 비동기 값을 안전하게 감싸 체이닝합니다. " +
        "(단, Promise.resolve(thenable)이 자동 언래핑되므로 엄밀한 모나드 법칙(결합법칙)을 완전히 만족하지는 않습니다.)",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "명령형 프로그래밍에서 발생하는 문제들:\n\n" +
        "**1. 부수 효과로 인한 예측 불가능성:**\n" +
        "```typescript\n" +
        "let total = 0;\n" +
        "function addToCart(price: number) {\n" +
        "  total += price; // 외부 상태 변경 — 부수 효과!\n" +
        "  return total;\n" +
        "}\n" +
        "addToCart(1000); // 1000\n" +
        "addToCart(1000); // 2000 — 같은 입력인데 다른 결과!\n" +
        "```\n\n" +
        "**2. 직접 변경으로 인한 버그:**\n" +
        "```typescript\n" +
        "const user = { name: 'Kim', scores: [90, 85] };\n" +
        "const updated = user;\n" +
        "updated.scores.push(95); // user도 변경됨!\n" +
        "console.log(user.scores); // [90, 85, 95] — 의도치 않은 변경\n" +
        "```\n\n" +
        "**3. 복잡한 데이터 변환 체인:**\n" +
        "```typescript\n" +
        "// 중간 변수가 많고 가독성이 떨어짐\n" +
        "const raw = await fetchUsers();\n" +
        "const active = raw.filter(u => u.isActive);\n" +
        "const sorted = active.sort((a, b) => a.name.localeCompare(b.name));\n" +
        "const names = sorted.map(u => u.name);\n" +
        "const first10 = names.slice(0, 10);\n" +
        "```\n\n" +
        "**4. 테스트의 어려움:** 전역 상태에 의존하는 함수는 단위 테스트가 어렵습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. 순수 함수\n\n" +
        "같은 입력에 항상 같은 출력, 부수 효과 없음:\n\n" +
        "```typescript\n" +
        "// 순수 함수 — 외부 상태를 변경하지 않음\n" +
        "function calculateTotal(items: { price: number }[]): number {\n" +
        "  return items.reduce((sum, item) => sum + item.price, 0);\n" +
        "}\n" +
        "\n" +
        "// 항상 같은 입력에 같은 결과\n" +
        "calculateTotal([{ price: 1000 }, { price: 2000 }]); // 항상 3000\n" +
        "```\n\n" +
        "### 2. 불변성\n\n" +
        "```typescript\n" +
        "// 스프레드 연산자로 새 객체 생성\n" +
        "const user = { name: 'Kim', age: 25 };\n" +
        "const updated = { ...user, age: 26 }; // 새 객체\n" +
        "\n" +
        "// 배열 불변 업데이트\n" +
        "const items = [1, 2, 3];\n" +
        "const added = [...items, 4];          // 추가\n" +
        "const removed = items.filter(x => x !== 2); // 제거\n" +
        "const mapped = items.map(x => x * 2);       // 변환\n" +
        "```\n\n" +
        "### 3. 함수 합성 (Composition)\n\n" +
        "```typescript\n" +
        "// pipe: 왼쪽에서 오른쪽으로 함수를 연결\n" +
        "function pipe<T>(...fns: Array<(arg: T) => T>) {\n" +
        "  return (value: T): T => fns.reduce((acc, fn) => fn(acc), value);\n" +
        "}\n" +
        "\n" +
        "const processUsers = pipe(\n" +
        "  (users: User[]) => users.filter(u => u.isActive),\n" +
        "  (users: User[]) => users.sort((a, b) => a.name.localeCompare(b.name)),\n" +
        "  (users: User[]) => users.slice(0, 10),\n" +
        ");\n" +
        "```\n\n" +
        "### 4. 커링 (Currying)\n\n" +
        "```typescript\n" +
        "// 커링: 인자를 하나씩 받는 함수 체인\n" +
        "const multiply = (a: number) => (b: number) => a * b;\n" +
        "const double = multiply(2);\n" +
        "const triple = multiply(3);\n" +
        "\n" +
        "console.log(double(5)); // 10\n" +
        "console.log(triple(5)); // 15\n" +
        "\n" +
        "// 실전: 이벤트 핸들러 팩토리\n" +
        "const handleChange = (field: string) => (e: ChangeEvent) => {\n" +
        "  setForm(prev => ({ ...prev, [field]: e.target.value }));\n" +
        "};\n" +
        "// <input onChange={handleChange('name')} />\n" +
        "// <input onChange={handleChange('email')} />\n" +
        "```\n\n" +
        "### 5. Promise는 모나드와 유사\n\n" +
        "```typescript\n" +
        "// Promise는 모나드와 유사한 특성을 가짐 (단, 자동 언래핑으로 엄밀한 결합법칙을 위반)\n" +
        "// 1. 값을 감싸기 (of/unit): Promise.resolve(42)\n" +
        "// 2. 변환하기 (map): .then(x => x * 2)\n" +
        "// 3. 평탄화 (flatMap/chain): .then(x => fetchUser(x))\n" +
        "\n" +
        "const result = Promise.resolve(1)\n" +
        "  .then(x => x + 1)              // map: 2\n" +
        "  .then(x => Promise.resolve(x)); // flatMap: 중첩 안됨\n" +
        "```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: pipe/compose 유틸리티",
      content:
        "함수형 프로그래밍의 핵심인 pipe와 compose를 타입 안전하게 구현합니다. " +
        "데이터 변환 파이프라인에서 널리 사용되는 패턴입니다.",
      code: {
        language: "typescript",
        code:
          "// pipe: 왼쪽 → 오른쪽 실행\n" +
          "function pipe<A, B>(fn1: (a: A) => B): (a: A) => B;\n" +
          "function pipe<A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C;\n" +
          "function pipe<A, B, C, D>(\n" +
          "  fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D\n" +
          "): (a: A) => D;\n" +
          "function pipe(...fns: Function[]) {\n" +
          "  return (value: any) => fns.reduce((acc, fn) => fn(acc), value);\n" +
          "}\n" +
          "\n" +
          "// compose: 오른쪽 → 왼쪽 실행 (수학적 합성)\n" +
          "function compose(...fns: Function[]) {\n" +
          "  return (value: any) => fns.reduceRight((acc, fn) => fn(acc), value);\n" +
          "}\n" +
          "\n" +
          "// 실전 활용: 데이터 변환 파이프라인\n" +
          "interface Product {\n" +
          "  name: string;\n" +
          "  price: number;\n" +
          "  category: string;\n" +
          "  inStock: boolean;\n" +
          "}\n" +
          "\n" +
          "// 작은 순수 함수들\n" +
          "const filterInStock = (products: Product[]) =>\n" +
          "  products.filter(p => p.inStock);\n" +
          "\n" +
          "const filterByCategory = (category: string) =>\n" +
          "  (products: Product[]) =>\n" +
          "    products.filter(p => p.category === category);\n" +
          "\n" +
          "const sortByPrice = (products: Product[]) =>\n" +
          "  [...products].sort((a, b) => a.price - b.price);\n" +
          "\n" +
          "const take = (n: number) =>\n" +
          "  <T>(items: T[]): T[] => items.slice(0, n);\n" +
          "\n" +
          "const formatForDisplay = (products: Product[]) =>\n" +
          "  products.map(p => ({ label: p.name, value: `${p.price}원` }));\n" +
          "\n" +
          "// pipe로 조합 — 가독성 높은 데이터 흐름\n" +
          "const getTopElectronics = pipe(\n" +
          "  filterInStock,\n" +
          "  filterByCategory('electronics'),\n" +
          "  sortByPrice,\n" +
          "  take(5),\n" +
          "  formatForDisplay\n" +
          ");\n" +
          "\n" +
          "// 사용\n" +
          "const products: Product[] = [\n" +
          "  { name: '키보드', price: 50000, category: 'electronics', inStock: true },\n" +
          "  { name: '마우스', price: 30000, category: 'electronics', inStock: true },\n" +
          "  { name: '노트', price: 3000, category: 'stationery', inStock: true },\n" +
          "];\n" +
          "\n" +
          "const result = getTopElectronics(products);\n" +
          "// [{ label: '마우스', value: '30000원' }, { label: '키보드', value: '50000원' }]",
        description:
          "pipe는 함수를 왼쪽에서 오른쪽으로 연결하고, compose는 오른쪽에서 왼쪽으로 연결합니다. " +
          "작은 순수 함수를 조합해 복잡한 데이터 변환을 선언적으로 표현합니다. " +
          "커링을 활용한 filterByCategory('electronics')처럼 재사용 가능한 부분 적용도 가능합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: React에서의 함수형 패턴",
      content:
        "React의 핵심 패러다임인 함수형 프로그래밍을 활용한 실전 패턴들을 실습합니다. " +
        "Hooks, 선언적 UI, 불변 상태 업데이트 등이 모두 함수형 패턴입니다.",
      code: {
        language: "typescript",
        code:
          "// 1. 커스텀 Hook — 순수 함수 + 합성\n" +
          "function useLocalStorage<T>(key: string, initialValue: T) {\n" +
          "  const [value, setValue] = useState<T>(() => {\n" +
          "    const saved = localStorage.getItem(key);\n" +
          "    return saved ? JSON.parse(saved) : initialValue;\n" +
          "  });\n" +
          "\n" +
          "  const setAndPersist = useCallback((newValue: T | ((prev: T) => T)) => {\n" +
          "    setValue(prev => {\n" +
          "      const resolved = typeof newValue === 'function'\n" +
          "        ? (newValue as (prev: T) => T)(prev)\n" +
          "        : newValue;\n" +
          "      localStorage.setItem(key, JSON.stringify(resolved));\n" +
          "      return resolved;\n" +
          "    });\n" +
          "  }, [key]);\n" +
          "\n" +
          "  return [value, setAndPersist] as const;\n" +
          "}\n" +
          "\n" +
          "// 2. Reducer — 순수 함수로 상태 전이\n" +
          "interface TodoState {\n" +
          "  todos: Array<{ id: string; text: string; done: boolean }>;\n" +
          "  filter: 'all' | 'active' | 'done';\n" +
          "}\n" +
          "\n" +
          "type TodoAction =\n" +
          "  | { type: 'ADD'; text: string }\n" +
          "  | { type: 'TOGGLE'; id: string }\n" +
          "  | { type: 'DELETE'; id: string }\n" +
          "  | { type: 'SET_FILTER'; filter: TodoState['filter'] };\n" +
          "\n" +
          "// 순수 함수: 같은 state + action → 항상 같은 결과\n" +
          "function todoReducer(state: TodoState, action: TodoAction): TodoState {\n" +
          "  switch (action.type) {\n" +
          "    case 'ADD':\n" +
          "      return {\n" +
          "        ...state, // 불변 업데이트\n" +
          "        todos: [...state.todos, {\n" +
          "          id: crypto.randomUUID(),\n" +
          "          text: action.text,\n" +
          "          done: false,\n" +
          "        }],\n" +
          "      };\n" +
          "    case 'TOGGLE':\n" +
          "      return {\n" +
          "        ...state,\n" +
          "        todos: state.todos.map(t =>\n" +
          "          t.id === action.id ? { ...t, done: !t.done } : t\n" +
          "        ),\n" +
          "      };\n" +
          "    case 'DELETE':\n" +
          "      return {\n" +
          "        ...state,\n" +
          "        todos: state.todos.filter(t => t.id !== action.id),\n" +
          "      };\n" +
          "    case 'SET_FILTER':\n" +
          "      return { ...state, filter: action.filter };\n" +
          "    default:\n" +
          "      return state;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// 3. 선택자 합성 — pipe로 데이터 변환\n" +
          "const selectTodos = (state: TodoState) => state.todos;\n" +
          "const selectFilter = (state: TodoState) => state.filter;\n" +
          "\n" +
          "const selectFilteredTodos = (state: TodoState) => {\n" +
          "  const todos = selectTodos(state);\n" +
          "  const filter = selectFilter(state);\n" +
          "  switch (filter) {\n" +
          "    case 'active': return todos.filter(t => !t.done);\n" +
          "    case 'done': return todos.filter(t => t.done);\n" +
          "    default: return todos;\n" +
          "  }\n" +
          "};",
        description:
          "React는 함수형 프로그래밍 패러다임을 적극 활용합니다. " +
          "Hooks는 함수 합성, Reducer는 순수 함수, 상태 업데이트는 불변성, " +
          "JSX는 선언적 UI를 구현합니다. 이 패턴들을 이해하면 React를 더 효과적으로 사용할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 핵심 원칙 | React 활용 |\n" +
        "|------|---------|------------|\n" +
        "| 순수 함수 | 같은 입력 → 같은 출력, 부수효과 없음 | Reducer, 셀렉터 |\n" +
        "| 불변성 | 데이터 직접 수정 않고 새 복사본 생성 | 상태 업데이트(spread) |\n" +
        "| 합성 | 작은 함수를 조합해 복잡한 동작 구성 | Hooks 합성, 커스텀 Hook |\n" +
        "| 커링 | 인자를 하나씩 받는 함수 체인 | 이벤트 핸들러 팩토리 |\n" +
        "| 모나드 유사 | 값을 컨텍스트에 감싸 안전하게 처리 | Promise 체이닝, Optional |\n\n" +
        "**React와 함수형 프로그래밍의 관계:**\n" +
        "- 컴포넌트 = 순수 함수 (props → JSX)\n" +
        "- 상태 업데이트 = 불변 데이터 변환\n" +
        "- Hooks = 함수 합성\n" +
        "- useReducer = Redux의 순수 함수 리듀서\n" +
        "- 선언적 UI = 부수 효과를 최소화한 선언적 표현",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "함수형 패턴은 순수 함수, 불변성, 합성을 통해 예측 가능하고 테스트 용이한 코드를 만드는 프로그래밍 패러다임이다.",
  checklist: [
    "순수 함수의 조건(같은 입력-같은 출력, 부수효과 없음)을 설명하고 예제를 작성할 수 있다",
    "스프레드 연산자를 활용한 불변 상태 업데이트를 구현할 수 있다",
    "pipe/compose로 함수를 합성해 데이터 변환 파이프라인을 만들 수 있다",
    "커링을 활용한 재사용 가능한 함수를 작성할 수 있다",
    "Promise가 모나드와 유사한 특성을 갖는 이유와 한계를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "다음 중 순수 함수가 아닌 것은?",
      choices: [
        "(a: number, b: number) => a + b",
        "(arr: number[]) => [...arr].sort()",
        "(user: User) => { console.log(user.name); return user; }",
        "(str: string) => str.toUpperCase()",
      ],
      correctIndex: 2,
      explanation:
        "console.log는 부수 효과(side effect)입니다. 순수 함수는 외부 세계에 영향을 주지 않아야 합니다. " +
        "콘솔 출력, DOM 조작, 네트워크 요청 등은 모두 부수 효과입니다.",
    },
    {
      id: "q2",
      question: "React에서 상태를 불변으로 업데이트해야 하는 핵심 이유는?",
      choices: [
        "JavaScript가 불변 데이터만 지원하기 때문",
        "React가 참조 비교(===)로 변경을 감지하므로 새 참조가 필요하기 때문",
        "불변 데이터가 항상 더 빠르기 때문",
        "TypeScript의 readonly가 필수이기 때문",
      ],
      correctIndex: 1,
      explanation:
        "React는 이전 state와 새 state를 참조(===) 비교합니다. 객체를 직접 수정하면 " +
        "같은 참조이므로 변경이 감지되지 않아 리렌더링이 일어나지 않습니다. " +
        "spread 연산자로 새 객체를 만들면 새 참조가 되어 변경이 감지됩니다.",
    },
    {
      id: "q3",
      question: "pipe(fn1, fn2, fn3)(value)의 실행 순서는?",
      choices: [
        "fn3 → fn2 → fn1",
        "fn1 → fn2 → fn3 (왼쪽에서 오른쪽)",
        "동시에 실행",
        "역순으로 실행 후 결과를 합침",
      ],
      correctIndex: 1,
      explanation:
        "pipe는 왼쪽에서 오른쪽으로 실행합니다. value를 fn1에 전달하고, 그 결과를 fn2에, " +
        "다시 그 결과를 fn3에 전달합니다. compose는 반대로 오른쪽에서 왼쪽으로 실행합니다.",
    },
    {
      id: "q4",
      question: "커링된 함수 const add = (a) => (b) => a + b에서 add(5)의 반환값은?",
      choices: [
        "5",
        "NaN",
        "(b) => 5 + b — 인자 b를 기다리는 새 함수",
        "undefined",
      ],
      correctIndex: 2,
      explanation:
        "커링에서 add(5)는 a에 5를 고정한 새 함수 (b) => 5 + b를 반환합니다. " +
        "이를 부분 적용(partial application)이라 하며, add(5)(3)은 8을 반환합니다. " +
        "이 패턴으로 재사용 가능한 함수를 만들 수 있습니다.",
    },
    {
      id: "q5",
      question: "Promise가 모나드와 유사하다고 분류되는 이유와 가장 관련 깊은 특성은?",
      choices: [
        "비동기 처리를 지원하기 때문",
        "값을 감싸고(resolve), 변환하고(then), 중첩을 평탄화(then에서 Promise 반환)하기 때문",
        "에러 처리(catch)를 지원하기 때문",
        "이벤트 루프에서 실행되기 때문",
      ],
      correctIndex: 1,
      explanation:
        "모나드는 세 가지를 충족해야 합니다: 값을 감싸기(Promise.resolve), " +
        "변환하기(.then(x => x + 1)), 평탄화(.then(x => fetchSomething(x))에서 " +
        "Promise<Promise<T>>가 아닌 Promise<T>를 반환). Promise의 .then이 이 세 가지를 수행하지만, " +
        "thenable 자동 언래핑 때문에 엄밀한 모나드 결합법칙을 완전히 만족하지는 않습니다.",
    },
  ],
};

export default chapter;
