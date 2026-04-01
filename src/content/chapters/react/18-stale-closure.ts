import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "18-stale-closure",
  subject: "react",
  title: "Stale Closure 문제: 오래된 클로저 해결",
  description: "JavaScript 클로저가 React Hooks에서 일으키는 stale closure 문제를 이해하고, useState 함수형 업데이트와 useRef로 해결합니다.",
  order: 18,
  group: "Hooks 심화",
  prerequisites: ["17-usedeferred-usetransition"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Stale Closure는 **오래된 사진**과 같습니다.\n\n" +
        "친구에게 '내 집 주소'를 적어줬다고 합시다. 나중에 이사를 했지만, 친구가 가진 메모에는 **옛날 주소**가 적혀 있습니다. 친구는 새 주소를 모른 채 옛날 주소로 찾아갑니다.\n\n" +
        "이것이 바로 stale closure입니다. useEffect나 이벤트 핸들러가 생성될 때의 상태값을 '기억'하지만, 이후 상태가 업데이트되어도 **옛날 값**을 계속 참조합니다.\n\n" +
        "**해결 방법 1 (함수형 업데이트)**: 주소를 직접 적지 않고 '우체국에 가서 현재 주소를 물어봐'라고 적는 것. `setState(prev => prev + 1)`처럼 현재 값을 인자로 받습니다.\n\n" +
        "**해결 방법 2 (useRef)**: 친구에게 메모 대신 **전화번호**를 줍니다. 언제든 전화하면 최신 주소를 알 수 있습니다. ref.current는 항상 최신 값을 참조합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "JavaScript의 클로저(JS Ch.12 참조)는 함수가 생성될 때의 외부 변수를 '캡처'합니다. React Hooks에서 이 특성이 버그를 유발합니다:\n\n" +
        "1. **useEffect에서 stale state** — 의존성 배열에 상태를 빠뜨리면 이펙트가 생성 당시의 값만 참조\n" +
        "2. **setTimeout/setInterval에서 stale state** — 타이머 콜백이 오래된 값을 캡처\n" +
        "3. **이벤트 핸들러에서 stale state** — useCallback의 의존성이 잘못되면 오래된 상태 참조\n\n" +
        "예시:\n" +
        "```\n" +
        "const [count, setCount] = useState(0);\n" +
        "useEffect(() => {\n" +
        "  const id = setInterval(() => console.log(count), 1000);\n" +
        "  return () => clearInterval(id);\n" +
        "}, []); // count가 의존성에 없음!\n" +
        "// → count가 0, 1, 2로 변해도 항상 0을 출력\n" +
        "```\n\n" +
        "이 문제는 Hooks를 처음 배울 때 가장 혼란스러운 부분 중 하나입니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. useState 함수형 업데이트\n" +
        "`setCount(prev => prev + 1)` — 이전 값을 인자로 받아 새 값을 반환합니다. 클로저가 캡처한 값이 아닌 **실제 현재 값**을 기반으로 업데이트합니다.\n\n" +
        "**적합한 경우:** 이전 상태를 기반으로 새 상태를 계산할 때\n\n" +
        "### 2. useRef로 최신 값 추적\n" +
        "useRef의 `.current`는 렌더링과 무관하게 항상 **같은 객체**를 참조합니다. 값이 변경되면 ref.current를 업데이트하고, 이펙트/콜백에서는 ref.current를 읽습니다.\n\n" +
        "**적합한 경우:** 값을 읽기만 하고 setState가 아닌 작업(로깅, 조건 판단 등)을 할 때\n\n" +
        "### 3. 의존성 배열 올바르게 설정\n" +
        "이펙트 내에서 사용하는 모든 반응형 값을 의존성 배열에 포함합니다. ESLint의 `react-hooks/exhaustive-deps` 규칙이 이를 검증합니다.\n\n" +
        "### 4. useCallback 의존성 점검\n" +
        "useCallback의 의존성에 참조하는 상태를 빠뜨리면 오래된 클로저가 됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Stale Closure 발생 원리",
      content:
        "클로저가 왜 오래된 값을 참조하는지, 그리고 각 해결 방법이 어떻게 동작하는지 의사코드로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// Stale Closure 발생 원리\n' +
          '\n' +
          '// 1단계: 첫 렌더링 (count = 0)\n' +
          'function Counter_render1() {\n' +
          '  const count = 0; // 이 렌더링의 count\n' +
          '\n' +
          '  // 이 함수는 count = 0을 캡처\n' +
          '  const logCount = () => console.log(count);\n' +
          '\n' +
          '  useEffect(() => {\n' +
          '    const id = setInterval(logCount, 1000);\n' +
          '    return () => clearInterval(id);\n' +
          '  }, []); // 빈 배열 → 재실행 안 함 → logCount는 항상 render1의 것\n' +
          '}\n' +
          '\n' +
          '// 2단계: count가 5로 변경된 후 (count = 5)\n' +
          'function Counter_render6() {\n' +
          '  const count = 5; // 이 렌더링의 count\n' +
          '  // 하지만 setInterval의 콜백은 여전히 render1의 logCount (count=0)를 실행\n' +
          '}\n' +
          '\n' +
          '// === 해결 방법 1: 함수형 업데이트 ===\n' +
          'function fixWithFunctionalUpdate() {\n' +
          '  const [count, setCount] = useState(0);\n' +
          '\n' +
          '  useEffect(() => {\n' +
          '    const id = setInterval(() => {\n' +
          '      // ❌ setCount(count + 1); → 항상 0 + 1 = 1\n' +
          '      // ✅ setCount(prev => prev + 1); → 현재 값 기반\n' +
          '      setCount(prev => prev + 1);\n' +
          '    }, 1000);\n' +
          '    return () => clearInterval(id);\n' +
          '  }, []);\n' +
          '}\n' +
          '\n' +
          '// === 해결 방법 2: useRef ===\n' +
          'function fixWithRef() {\n' +
          '  const [count, setCount] = useState(0);\n' +
          '  const countRef = useRef(count);\n' +
          '\n' +
          '  // 매 렌더링마다 ref를 최신 값으로 동기화\n' +
          '  useEffect(() => {\n' +
          '    countRef.current = count;\n' +
          '  });\n' +
          '\n' +
          '  useEffect(() => {\n' +
          '    const id = setInterval(() => {\n' +
          '      // ref.current는 항상 최신 값\n' +
          '      console.log("현재 count:", countRef.current);\n' +
          '    }, 1000);\n' +
          '    return () => clearInterval(id);\n' +
          '  }, []);\n' +
          '}',
        description: "클로저는 생성 시점의 변수를 캡처합니다. 함수형 업데이트는 최신 상태를 인자로 받고, useRef는 항상 같은 객체를 참조합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 다양한 Stale Closure 시나리오",
      content:
        "실전에서 자주 마주치는 stale closure 상황과 해결법을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          'import { useState, useEffect, useRef, useCallback } from "react";\n' +
          '\n' +
          '// 시나리오 1: setInterval에서 stale closure\n' +
          'function StopWatch() {\n' +
          '  const [seconds, setSeconds] = useState(0);\n' +
          '  const [isRunning, setIsRunning] = useState(false);\n' +
          '\n' +
          '  useEffect(() => {\n' +
          '    if (!isRunning) return;\n' +
          '\n' +
          '    const id = setInterval(() => {\n' +
          '      // ✅ 함수형 업데이트로 해결\n' +
          '      setSeconds(prev => prev + 1);\n' +
          '    }, 1000);\n' +
          '\n' +
          '    return () => clearInterval(id);\n' +
          '  }, [isRunning]);\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <span>{seconds}초</span>\n' +
          '      <button onClick={() => setIsRunning(r => !r)}>\n' +
          '        {isRunning ? "정지" : "시작"}\n' +
          '      </button>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 시나리오 2: useCallback에서 stale closure\n' +
          'function ChatRoom({ roomId }: { roomId: string }) {\n' +
          '  const [messages, setMessages] = useState<string[]>([]);\n' +
          '\n' +
          '  // ❌ 잘못된 의존성 → messages가 항상 []\n' +
          '  const handleMessage_bad = useCallback((msg: string) => {\n' +
          '    setMessages([...messages, msg]); // stale!\n' +
          '  }, []); // messages 누락\n' +
          '\n' +
          '  // ✅ 함수형 업데이트로 해결\n' +
          '  const handleMessage = useCallback((msg: string) => {\n' +
          '    setMessages(prev => [...prev, msg]);\n' +
          '  }, []);\n' +
          '\n' +
          '  return <div>{messages.map((m, i) => <p key={i}>{m}</p>)}</div>;\n' +
          '}\n' +
          '\n' +
          '// 시나리오 3: useRef로 최신 콜백 유지\n' +
          'function useLatestCallback<T extends (...args: never[]) => unknown>(\n' +
          '  callback: T\n' +
          '): T {\n' +
          '  const ref = useRef(callback);\n' +
          '\n' +
          '  useEffect(() => {\n' +
          '    ref.current = callback;\n' +
          '  });\n' +
          '\n' +
          '  // 안정적인 참조의 함수를 반환\n' +
          '  return useCallback(\n' +
          '    ((...args) => ref.current(...args)) as T,\n' +
          '    []\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 사용 예시\n' +
          'function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {\n' +
          '  const [query, setQuery] = useState("");\n' +
          '  const stableOnSearch = useLatestCallback(onSearch);\n' +
          '\n' +
          '  useEffect(() => {\n' +
          '    const timer = setTimeout(() => stableOnSearch(query), 300);\n' +
          '    return () => clearTimeout(timer);\n' +
          '  }, [query, stableOnSearch]);\n' +
          '\n' +
          '  return <input value={query} onChange={e => setQuery(e.target.value)} />;\n' +
          '}',
        description: "함수형 업데이트는 상태 변경에, useRef는 최신 값 읽기에, useLatestCallback은 안정적인 콜백 참조에 적합합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**Stale Closure 해결 방법 비교:**\n\n" +
        "| 해결 방법 | 적합한 경우 | 예시 |\n" +
        "|----------|-----------|------|\n" +
        "| 함수형 업데이트 | 이전 상태 기반 업데이트 | `setCount(prev => prev + 1)` |\n" +
        "| useRef | 값 읽기, 로깅, 조건 판단 | `countRef.current` |\n" +
        "| 의존성 배열 수정 | 이펙트가 새 값을 필요할 때 | `[count]` 추가 |\n" +
        "| useLatestCallback | 콜백의 안정적인 참조 | `ref.current = callback` |\n\n" +
        "**핵심 원칙:**\n" +
        "1. React의 모든 렌더링은 자신만의 state/props '스냅샷'을 가짐\n" +
        "2. 클로저는 스냅샷을 캡처하므로 오래된 값을 참조할 수 있음\n" +
        "3. 함수형 업데이트(`prev =>`)는 최신 상태를 보장\n" +
        "4. useRef는 렌더링 간 공유되는 '탈출구'\n" +
        "5. ESLint exhaustive-deps 규칙을 무시하지 말 것\n\n" +
        "**학습 완료:** Hooks 심화 그룹의 모든 핵심 Hook을 배웠습니다. 이제 실전 프로젝트에서 자신있게 Hook을 활용할 수 있습니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "Stale closure가 발생하는 원리를 JavaScript 클로저로 설명할 수 있다",
    "useState 함수형 업데이트로 stale state를 해결할 수 있다",
    "useRef로 최신 값을 추적하는 패턴을 구현할 수 있다",
    "useCallback의 의존성 누락으로 인한 stale closure를 식별할 수 있다",
    "ESLint exhaustive-deps 규칙의 중요성을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Stale closure란?",
      choices: [
        "클로저가 메모리를 과다 사용하는 것",
        "함수가 생성 시점의 오래된 값을 계속 참조하는 것",
        "클로저가 가비지 컬렉션되지 않는 것",
        "함수가 올바른 값을 반환하지 않는 것",
      ],
      correctIndex: 1,
      explanation: "Stale closure는 클로저가 생성 시점의 변수 값을 캡처하여, 이후 값이 변경되어도 오래된(stale) 값을 계속 참조하는 현상입니다.",
    },
    {
      id: "q2",
      question: "setCount(count + 1) 대신 setCount(prev => prev + 1)을 사용하는 이유는?",
      choices: [
        "성능이 더 좋아서",
        "count가 stale closure에 의해 오래된 값일 수 있어서",
        "TypeScript 타입 추론을 위해",
        "React가 권장하는 문법이라서",
      ],
      correctIndex: 1,
      explanation: "함수형 업데이트는 React가 현재 최신 state를 인자로 전달하므로, 클로저에 캡처된 오래된 count 값에 의존하지 않습니다.",
    },
    {
      id: "q3",
      question: "useRef로 stale closure를 해결하는 원리는?",
      choices: [
        "ref가 리렌더링을 유발하므로",
        "ref.current는 항상 같은 객체를 참조하므로 최신 값에 접근 가능",
        "ref가 클로저를 해제하므로",
        "ref가 의존성 배열을 자동 관리하므로",
      ],
      correctIndex: 1,
      explanation: "useRef는 모든 렌더링에서 동일한 객체를 반환합니다. .current를 매 렌더링마다 업데이트하면, 어떤 클로저에서든 최신 값에 접근할 수 있습니다.",
    },
    {
      id: "q4",
      question: "useEffect의 의존성 배열에 값을 빠뜨리면?",
      choices: [
        "이펙트가 실행되지 않는다",
        "이펙트가 생성 시점의 오래된 값을 계속 참조한다",
        "React가 자동으로 추가한다",
        "빌드 에러가 발생한다",
      ],
      correctIndex: 1,
      explanation: "의존성 배열에 값을 빠뜨리면 이펙트가 재실행되지 않아 최초 생성 시의 클로저를 유지합니다. 이 클로저는 오래된 값을 캡처하고 있습니다.",
    },
    {
      id: "q5",
      question: "다음 중 stale closure 문제가 발생하지 않는 코드는?",
      choices: [
        "useEffect(() => { setInterval(() => setCount(count + 1), 1000) }, [])",
        "useEffect(() => { setInterval(() => setCount(c => c + 1), 1000) }, [])",
        "useCallback(() => console.log(count), [])",
        "setTimeout(() => alert(count), 3000)",
      ],
      correctIndex: 1,
      explanation: "setCount(c => c + 1)은 함수형 업데이트로, React가 최신 state를 인자로 전달합니다. 클로저가 캡처한 count에 의존하지 않으므로 stale closure가 발생하지 않습니다.",
    },
    {
      id: "q6",
      question: "ESLint react-hooks/exhaustive-deps 규칙의 역할은?",
      choices: [
        "Hook의 호출 순서를 검증",
        "useEffect 의존성 배열에 누락된 값을 경고",
        "Hook의 성능을 최적화",
        "Hook의 타입을 검증",
      ],
      correctIndex: 1,
      explanation: "exhaustive-deps 규칙은 useEffect, useMemo, useCallback의 의존성 배열에서 누락된 반응형 값을 감지하여 stale closure를 방지합니다.",
    },
  ],
};

export default chapter;
