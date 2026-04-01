import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "09-useeffect",
  subject: "react",
  title: "useEffect: 사이드이펙트 관리",
  description: "useEffect의 실행 타이밍, 의존성 배열, 클린업 함수를 이해하고 무한 루프와 객체 의존성 문제를 방지합니다.",
  order: 9,
  group: "Hooks 심화",
  prerequisites: ["08-forms-actions"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "useEffect는 **자동 반응 시스템**과 비슷합니다.\n\n" +
        "집에 스마트 센서가 있다고 상상해보세요. 온도가 변하면 자동으로 에어컨을 켜고, 사람이 나가면 자동으로 불을 끕니다.\n\n" +
        "**의존성 배열**은 센서가 감시하는 대상입니다. 온도 센서만 달면 온도 변화에만 반응하고, 모든 센서를 달면 모든 변화에 반응합니다. 센서를 아예 안 달면(`[]`) 처음 설치할 때 한 번만 동작합니다.\n\n" +
        "**클린업 함수**는 이전 반응을 정리하는 것입니다. 새로운 에어컨 설정을 적용하기 전에 이전 설정을 해제하는 것처럼, 새 이펙트를 실행하기 전에 이전 이펙트를 정리합니다.\n\n" +
        "**실행 타이밍**은 중요합니다. 스마트 센서는 집이 완전히 세팅된 후(paint 후)에 동작합니다. 벽을 칠하는 도중에 센서가 동작하면 혼란스럽겠죠.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React 컴포넌트는 순수 함수여야 합니다. 하지만 실제 애플리케이션에서는 렌더링 외의 작업이 필수적입니다:\n\n" +
        "1. **데이터 페칭** — 서버에서 데이터를 가져오는 것\n" +
        "2. **구독 설정** — WebSocket, 이벤트 리스너, 타이머 등\n" +
        "3. **DOM 직접 조작** — 포커스 설정, 스크롤 위치 변경\n" +
        "4. **외부 시스템 동기화** — 로컬 스토리지, 서드파티 라이브러리\n\n" +
        "이러한 **사이드이펙트(side effect)**를 렌더링 중에 직접 실행하면 무한 루프, 불필요한 네트워크 요청, 메모리 누수 등 심각한 문제가 발생합니다.\n\n" +
        "특히 다음과 같은 문제가 자주 발생합니다:\n" +
        "- 의존성 배열을 잘못 설정하여 **무한 루프** 발생\n" +
        "- 객체/배열을 의존성에 넣어 **매 렌더링마다 이펙트 재실행**\n" +
        "- 클린업을 하지 않아 **메모리 누수** 발생",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "useEffect는 렌더링 이후 사이드이펙트를 안전하게 실행하는 Hook입니다.\n\n" +
        "### 기본 구조\n" +
        "`useEffect(setup, dependencies?)`\n" +
        "- **setup**: 이펙트 함수. 선택적으로 클린업 함수를 반환\n" +
        "- **dependencies**: 이펙트가 의존하는 값들의 배열\n\n" +
        "### 실행 타이밍\n" +
        "useEffect는 **브라우저가 화면을 paint한 후**에 비동기적으로 실행됩니다. 이는 사용자에게 빈 화면을 보여주지 않기 위함입니다.\n\n" +
        "### 의존성 배열 규칙\n" +
        "- `useEffect(fn)` — 매 렌더링 후 실행 (거의 사용하지 않음)\n" +
        "- `useEffect(fn, [])` — 마운트 시 한 번만 실행\n" +
        "- `useEffect(fn, [a, b])` — a 또는 b가 변경될 때 실행\n\n" +
        "### 클린업 함수\n" +
        "이펙트 함수에서 함수를 반환하면 다음 이펙트 실행 전 또는 언마운트 시 호출됩니다.\n\n" +
        "### 객체 의존성 문제\n" +
        "객체나 배열은 매 렌더링마다 새로 생성되어 참조가 달라집니다. 해결 방법:\n" +
        "1. 객체 대신 원시값을 의존성에 사용 (`obj.id` 등)\n" +
        "2. `useMemo`로 객체를 메모이제이션\n" +
        "3. 이펙트 내부에서 객체를 생성",
    },
    {
      type: "pseudocode",
      title: "기술 구현: useEffect 내부 동작",
      content:
        "useEffect가 내부적으로 어떻게 의존성을 비교하고 이펙트를 실행하는지 의사코드로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// React의 useEffect 내부 동작 (의사코드)\n' +
          '\n' +
          'type Cleanup = () => void;\n' +
          'type Effect = () => Cleanup | void;\n' +
          '\n' +
          'interface EffectHook {\n' +
          '  effect: Effect;\n' +
          '  deps: unknown[] | undefined;\n' +
          '  cleanup: Cleanup | void;\n' +
          '}\n' +
          '\n' +
          'function useEffect(effect: Effect, deps?: unknown[]): void {\n' +
          '  const hook = getCurrentHook<EffectHook>();\n' +
          '\n' +
          '  if (isFirstRender()) {\n' +
          '    // 마운트: 이펙트를 paint 후 실행 대기열에 등록\n' +
          '    hook.effect = effect;\n' +
          '    hook.deps = deps;\n' +
          '    scheduleAfterPaint(() => {\n' +
          '      hook.cleanup = effect();\n' +
          '    });\n' +
          '    return;\n' +
          '  }\n' +
          '\n' +
          '  // 업데이트: 의존성 비교\n' +
          '  const prevDeps = hook.deps;\n' +
          '\n' +
          '  if (deps === undefined) {\n' +
          '    // 의존성 배열 생략 → 매번 실행\n' +
          '    runEffectAfterPaint(hook, effect, deps);\n' +
          '  } else if (prevDeps === undefined) {\n' +
          '    runEffectAfterPaint(hook, effect, deps);\n' +
          '  } else if (!shallowEqual(prevDeps, deps)) {\n' +
          '    // 얕은 비교(Object.is)로 변경 감지\n' +
          '    runEffectAfterPaint(hook, effect, deps);\n' +
          '  }\n' +
          '  // 의존성이 같으면 → 이펙트 건너뛰기\n' +
          '}\n' +
          '\n' +
          'function runEffectAfterPaint(\n' +
          '  hook: EffectHook, effect: Effect, deps?: unknown[]\n' +
          '): void {\n' +
          '  scheduleAfterPaint(() => {\n' +
          '    // 이전 클린업 먼저 실행\n' +
          '    if (hook.cleanup) hook.cleanup();\n' +
          '    // 새 이펙트 실행\n' +
          '    hook.cleanup = effect();\n' +
          '    hook.deps = deps;\n' +
          '  });\n' +
          '}\n' +
          '\n' +
          '// Object.is를 사용한 얕은 비교\n' +
          'function shallowEqual(a: unknown[], b: unknown[]): boolean {\n' +
          '  if (a.length !== b.length) return false;\n' +
          '  return a.every((val, i) => Object.is(val, b[i]));\n' +
          '}',
        description: "useEffect는 Object.is로 의존성을 얕게 비교하며, paint 후 비동기적으로 이펙트를 실행합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 다양한 useEffect 패턴",
      content:
        "자주 사용하는 useEffect 패턴과 흔한 실수를 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          'import { useState, useEffect } from "react";\n' +
          '\n' +
          '// ✅ 패턴 1: 이벤트 리스너 구독/해제\n' +
          'function useWindowSize() {\n' +
          '  const [size, setSize] = useState({ w: 0, h: 0 });\n' +
          '\n' +
          '  useEffect(() => {\n' +
          '    const handleResize = () => {\n' +
          '      setSize({ w: window.innerWidth, h: window.innerHeight });\n' +
          '    };\n' +
          '    handleResize(); // 초기값 설정\n' +
          '    window.addEventListener("resize", handleResize);\n' +
          '\n' +
          '    // 클린업: 리스너 제거\n' +
          '    return () => window.removeEventListener("resize", handleResize);\n' +
          '  }, []); // 마운트 시 한 번만\n' +
          '\n' +
          '  return size;\n' +
          '}\n' +
          '\n' +
          '// ✅ 패턴 2: 데이터 페칭 + 경쟁 상태 방지\n' +
          'function UserProfile({ userId }: { userId: string }) {\n' +
          '  const [user, setUser] = useState<{ name: string } | null>(null);\n' +
          '\n' +
          '  useEffect(() => {\n' +
          '    let cancelled = false;\n' +
          '\n' +
          '    async function fetchUser() {\n' +
          '      const res = await fetch(`/api/users/${userId}`);\n' +
          '      const data = await res.json();\n' +
          '      if (!cancelled) setUser(data);\n' +
          '    }\n' +
          '    fetchUser();\n' +
          '\n' +
          '    return () => { cancelled = true; };\n' +
          '  }, [userId]); // userId 변경 시 재실행\n' +
          '\n' +
          '  return <div>{user?.name}</div>;\n' +
          '}\n' +
          '\n' +
          '// ❌ 실수: 객체 의존성으로 무한 루프\n' +
          'function BadExample({ config }: { config: { theme: string } }) {\n' +
          '  // config가 매 렌더링마다 새 객체면 → 무한 루프!\n' +
          '  useEffect(() => {\n' +
          '    console.log("config changed:", config);\n' +
          '  }, [config]); // ⚠️ 객체 참조가 매번 다름\n' +
          '\n' +
          '  return null;\n' +
          '}\n' +
          '\n' +
          '// ✅ 수정: 원시값을 의존성으로 사용\n' +
          'function GoodExample({ config }: { config: { theme: string } }) {\n' +
          '  useEffect(() => {\n' +
          '    console.log("theme changed:", config.theme);\n' +
          '  }, [config.theme]); // 원시값만 비교\n' +
          '\n' +
          '  return null;\n' +
          '}',
        description: "클린업 함수로 메모리 누수를 방지하고, 경쟁 상태를 cancelled 플래그로 처리합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 의존성 배열 | 실행 시점 | 사용 사례 |\n" +
        "|------------|----------|----------|\n" +
        "| 생략 | 매 렌더링 후 | 거의 사용 안 함 |\n" +
        "| `[]` | 마운트 시 1회 | 구독 설정, 초기 로드 |\n" +
        "| `[a, b]` | a 또는 b 변경 시 | 값에 따른 동기화 |\n\n" +
        "**핵심 규칙:**\n" +
        "- useEffect는 paint 후 비동기 실행 (화면 깜빡임 없음)\n" +
        "- 클린업 함수로 구독/타이머 반드시 정리\n" +
        "- 객체/배열을 의존성에 넣지 말고 원시값 사용\n" +
        "- 이펙트 내부에서 setState → 의존성에 해당 state 포함 시 무한 루프 주의\n" +
        "- async 함수를 직접 넘기지 말고 내부에서 정의하여 호출\n\n" +
        "**다음 챕터 미리보기:** useRef를 통해 DOM에 직접 접근하고, 렌더링을 유발하지 않는 값 저장 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "useEffect의 실행 타이밍(paint 후)을 설명할 수 있다",
    "의존성 배열의 세 가지 형태(생략, 빈 배열, 값 배열)의 차이를 설명할 수 있다",
    "클린업 함수가 언제 호출되는지 설명할 수 있다",
    "객체를 의존성에 넣으면 무한 루프가 발생하는 이유를 설명할 수 있다",
    "데이터 페칭에서 경쟁 상태를 방지하는 패턴을 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "useEffect의 이펙트 함수는 언제 실행되나요?",
      choices: [
        "렌더링 중에 동기적으로",
        "DOM 업데이트 전에",
        "브라우저 paint 후 비동기적으로",
        "컴포넌트 마운트 전에",
      ],
      correctIndex: 2,
      explanation: "useEffect는 브라우저가 화면을 그린(paint) 후에 비동기적으로 실행됩니다. 이를 통해 사용자에게 빈 화면을 보여주지 않습니다.",
    },
    {
      id: "q2",
      question: "useEffect(() => { ... }, [])에서 빈 배열 []의 의미는?",
      choices: [
        "이펙트를 실행하지 않음",
        "매 렌더링마다 실행",
        "마운트 시 한 번만 실행",
        "의존성 없이 랜덤 실행",
      ],
      correctIndex: 2,
      explanation: "빈 의존성 배열은 '어떤 값에도 의존하지 않음'을 의미하므로 마운트 시 한 번만 실행되고, 언마운트 시 클린업이 실행됩니다.",
    },
    {
      id: "q3",
      question: "클린업 함수가 호출되는 시점을 모두 고르면?",
      choices: [
        "다음 이펙트 실행 전과 언마운트 시",
        "이펙트 실행 직후",
        "마운트 시에만",
        "렌더링 중에",
      ],
      correctIndex: 0,
      explanation: "클린업 함수는 다음 이펙트가 실행되기 전에 이전 이펙트의 클린업을 호출하고, 컴포넌트 언마운트 시에도 호출됩니다.",
    },
    {
      id: "q4",
      question: "다음 코드의 문제점은?\nuseEffect(() => { setCount(count + 1); }, [count])",
      choices: [
        "문법 오류",
        "클린업 함수가 없음",
        "무한 루프 발생",
        "count가 업데이트되지 않음",
      ],
      correctIndex: 2,
      explanation: "count가 변경되면 이펙트가 실행되고, setCount로 count를 다시 변경하면 이펙트가 또 실행되어 무한 루프에 빠집니다.",
    },
    {
      id: "q5",
      question: "객체를 의존성 배열에 넣으면 매번 이펙트가 실행되는 이유는?",
      choices: [
        "객체는 의존성에 넣을 수 없어서",
        "매 렌더링마다 새 객체가 생성되어 참조(Object.is)가 달라지므로",
        "useEffect가 깊은 비교를 하므로",
        "React가 객체를 무시하므로",
      ],
      correctIndex: 1,
      explanation: "useEffect는 Object.is로 얕은 비교를 합니다. 매 렌더링마다 새로 생성된 객체는 이전 객체와 참조가 다르므로 항상 '변경됨'으로 판단합니다.",
    },
    {
      id: "q6",
      question: "useEffect에서 async 함수를 올바르게 사용하는 방법은?",
      choices: [
        "useEffect(async () => { ... })",
        "이펙트 내부에 async 함수를 정의하고 호출",
        "useEffect 밖에서 async 함수를 호출",
        "await를 사용하지 않음",
      ],
      correctIndex: 1,
      explanation: "useEffect의 콜백 자체를 async로 만들면 Promise를 반환하게 되어 클린업 함수로 인식되지 않습니다. 내부에 별도 async 함수를 정의하여 호출해야 합니다.",
    },
  ],
};

export default chapter;
