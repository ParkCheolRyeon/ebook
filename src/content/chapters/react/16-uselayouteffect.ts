import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "16-uselayouteffect",
  subject: "react",
  title: "useLayoutEffect: DOM 측정과 동기 실행",
  description: "useLayoutEffect의 실행 타이밍(paint 전), useEffect와의 차이, DOM 측정, 깜빡임 방지, SSR 주의사항을 배웁니다.",
  order: 16,
  group: "Hooks 심화",
  prerequisites: ["15-custom-hooks"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "useEffect와 useLayoutEffect의 차이는 **인테리어 공사 순서**와 같습니다.\n\n" +
        "**useEffect**는 손님이 입장한 후(paint 후)에 가구를 재배치하는 것입니다. 손님은 잠깐 이상한 배치를 볼 수 있습니다(깜빡임).\n\n" +
        "**useLayoutEffect**는 손님이 입장하기 전(paint 전)에 가구를 완벽하게 배치하는 것입니다. 손님은 항상 완성된 모습만 봅니다.\n\n" +
        "대신 useLayoutEffect는 공사가 끝날 때까지 손님을 기다리게 합니다(동기 실행). 공사가 오래 걸리면 손님이 오래 기다려야 하므로, 빠른 작업(DOM 측정 등)에만 사용해야 합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "useEffect는 paint 후에 실행되므로 다음 상황에서 문제가 발생합니다:\n\n" +
        "1. **DOM 측정 후 위치 조정** — 툴팁의 위치를 요소 크기에 따라 계산해야 할 때\n" +
        "   - useEffect로 하면: 잘못된 위치 → 측정 → 올바른 위치 (깜빡임)\n" +
        "2. **초기 레이아웃 설정** — 스크롤 위치 복원, 요소 크기 기반 레이아웃\n" +
        "3. **서드파티 라이브러리 초기화** — DOM 노드가 필요한 라이브러리(차트, 에디터)\n\n" +
        "이런 경우 사용자는 '깜빡임(flicker)'을 경험합니다:\n" +
        "1. 초기 상태로 렌더링 (잘못된 위치/크기)\n" +
        "2. paint (사용자가 잘못된 모습을 봄)\n" +
        "3. useEffect에서 DOM 측정 → state 업데이트\n" +
        "4. 다시 렌더링 → paint (올바른 모습)",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### useLayoutEffect 실행 타이밍\n" +
        "```\n" +
        "렌더링 → DOM 업데이트 → useLayoutEffect(동기) → Paint → useEffect(비동기)\n" +
        "```\n\n" +
        "useLayoutEffect는 DOM이 업데이트된 직후, 브라우저가 paint하기 전에 **동기적으로** 실행됩니다.\n\n" +
        "### 사용 시점\n" +
        "1. **DOM 측정이 필요할 때** — getBoundingClientRect(), offsetHeight 등\n" +
        "2. **측정값으로 즉시 UI를 업데이트할 때** — 툴팁 위치, 팝오버 방향\n" +
        "3. **깜빡임을 방지해야 할 때** — 초기 레이아웃 계산\n\n" +
        "### 주의사항\n" +
        "- **동기 실행이므로 무거운 작업 금지** — paint를 차단하여 UI가 멈춤\n" +
        "- **SSR에서 경고 발생** — 서버에는 DOM이 없으므로 실행 불가. 대안: `useEffect`로 대체하거나 조건부 실행\n" +
        "- **대부분의 경우 useEffect로 충분** — 깜빡임이 실제로 문제될 때만 useLayoutEffect 사용",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 실행 타이밍 비교",
      content:
        "useEffect와 useLayoutEffect의 실행 순서를 의사코드로 정확히 비교합니다.",
      code: {
        language: "typescript",
        code:
          '// React의 렌더링 파이프라인 (의사코드)\n' +
          '\n' +
          'function renderAndCommit(component: Component): void {\n' +
          '  // 1단계: 렌더링 (가상 DOM 생성)\n' +
          '  const virtualDOM = render(component);\n' +
          '\n' +
          '  // 2단계: DOM 업데이트 (커밋)\n' +
          '  applyDOMChanges(virtualDOM);\n' +
          '\n' +
          '  // 3단계: useLayoutEffect 실행 (동기 — 여기서 멈춤)\n' +
          '  runLayoutEffects(); // ← paint 전에 실행!\n' +
          '  // → DOM 측정, state 업데이트 가능\n' +
          '  // → state 업데이트 시 동기적으로 다시 렌더링\n' +
          '\n' +
          '  // 4단계: 브라우저 Paint\n' +
          '  browserPaint(); // ← 사용자가 화면을 봄\n' +
          '\n' +
          '  // 5단계: useEffect 실행 (비동기 — 백그라운드)\n' +
          '  scheduleEffects(); // ← paint 후에 실행\n' +
          '}\n' +
          '\n' +
          '// useLayoutEffect로 깜빡임 방지 예시\n' +
          'import { useState, useLayoutEffect, useRef } from "react";\n' +
          '\n' +
          'function Tooltip({ text, targetRef }: {\n' +
          '  text: string;\n' +
          '  targetRef: React.RefObject<HTMLElement | null>;\n' +
          '}) {\n' +
          '  const [position, setPosition] = useState({ top: 0, left: 0 });\n' +
          '  const tooltipRef = useRef<HTMLDivElement>(null);\n' +
          '\n' +
          '  // paint 전에 위치 계산 → 깜빡임 없음\n' +
          '  useLayoutEffect(() => {\n' +
          '    if (!targetRef.current || !tooltipRef.current) return;\n' +
          '\n' +
          '    const targetRect = targetRef.current.getBoundingClientRect();\n' +
          '    const tooltipRect = tooltipRef.current.getBoundingClientRect();\n' +
          '\n' +
          '    setPosition({\n' +
          '      top: targetRect.top - tooltipRect.height - 8,\n' +
          '      left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,\n' +
          '    });\n' +
          '  }, [targetRef]);\n' +
          '\n' +
          '  return (\n' +
          '    <div\n' +
          '      ref={tooltipRef}\n' +
          '      style={{ position: "fixed", top: position.top, left: position.left }}\n' +
          '    >\n' +
          '      {text}\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description: "useLayoutEffect는 DOM 업데이트 후, paint 전에 동기적으로 실행되어 깜빡임을 방지합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: DOM 측정과 SSR 대응",
      content:
        "useLayoutEffect의 실전 패턴과 SSR 환경에서의 대응 방법을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          'import { useState, useLayoutEffect, useEffect, useRef } from "react";\n' +
          '\n' +
          '// 패턴 1: 요소 크기 측정\n' +
          'function useElementSize<T extends HTMLElement>() {\n' +
          '  const ref = useRef<T>(null);\n' +
          '  const [size, setSize] = useState({ width: 0, height: 0 });\n' +
          '\n' +
          '  useLayoutEffect(() => {\n' +
          '    if (!ref.current) return;\n' +
          '    const { width, height } = ref.current.getBoundingClientRect();\n' +
          '    setSize({ width, height });\n' +
          '  }, []);\n' +
          '\n' +
          '  return { ref, size };\n' +
          '}\n' +
          '\n' +
          '// 패턴 2: 스크롤 위치 복원\n' +
          'function ChatMessages({ messages }: { messages: string[] }) {\n' +
          '  const containerRef = useRef<HTMLDivElement>(null);\n' +
          '\n' +
          '  useLayoutEffect(() => {\n' +
          '    // paint 전에 스크롤을 맨 아래로 → 깜빡임 없음\n' +
          '    if (containerRef.current) {\n' +
          '      containerRef.current.scrollTop = containerRef.current.scrollHeight;\n' +
          '    }\n' +
          '  }, [messages]);\n' +
          '\n' +
          '  return (\n' +
          '    <div ref={containerRef} style={{ overflow: "auto", height: 300 }}>\n' +
          '      {messages.map((msg, i) => <p key={i}>{msg}</p>)}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 패턴 3: SSR 안전한 useLayoutEffect\n' +
          '// 서버에서는 useEffect를 사용하고 클라이언트에서만 useLayoutEffect 사용\n' +
          'const useIsomorphicLayoutEffect =\n' +
          '  typeof window !== "undefined" ? useLayoutEffect : useEffect;\n' +
          '\n' +
          'function ResponsiveComponent() {\n' +
          '  const [width, setWidth] = useState(0);\n' +
          '\n' +
          '  useIsomorphicLayoutEffect(() => {\n' +
          '    setWidth(window.innerWidth);\n' +
          '  }, []);\n' +
          '\n' +
          '  return <div>현재 너비: {width}px</div>;\n' +
          '}',
        description: "useLayoutEffect는 DOM 측정, 스크롤 복원 등 paint 전에 완료해야 하는 작업에 사용합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 비교 | useEffect | useLayoutEffect |\n" +
        "|------|----------|----------------|\n" +
        "| 실행 시점 | paint 후 (비동기) | paint 전 (동기) |\n" +
        "| 깜빡임 | 가능 | 방지 |\n" +
        "| 성능 영향 | 없음 | paint 차단 가능 |\n" +
        "| SSR | 안전 | 경고 발생 |\n" +
        "| 사용 빈도 | 대부분 | 드물게 |\n\n" +
        "**핵심 규칙:**\n" +
        "- 기본적으로 **useEffect** 사용\n" +
        "- 깜빡임이 실제로 발생할 때만 **useLayoutEffect**로 전환\n" +
        "- 무거운 작업은 절대 useLayoutEffect에 넣지 않기\n" +
        "- SSR 환경에서는 `useIsomorphicLayoutEffect` 패턴 사용\n\n" +
        "**다음 챕터 미리보기:** useDeferredValue와 useTransition으로 동시성 렌더링을 제어하는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "useLayoutEffect는 DOM 변경 직후, 브라우저가 화면을 그리기 전에 동기적으로 실행된다. 레이아웃 측정이나 깜빡임 방지가 필요할 때만 사용하라.",
  checklist: [
    "useLayoutEffect와 useEffect의 실행 타이밍 차이를 설명할 수 있다",
    "깜빡임(flicker)이 발생하는 원리를 이해한다",
    "DOM 측정에 useLayoutEffect를 사용해야 하는 이유를 설명할 수 있다",
    "SSR 환경에서의 주의사항과 대응 방법을 알고 있다",
    "useLayoutEffect를 남용하면 안 되는 이유를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "useLayoutEffect의 실행 시점은?",
      choices: [
        "렌더링 전",
        "DOM 업데이트 전",
        "DOM 업데이트 후, paint 전",
        "paint 후",
      ],
      correctIndex: 2,
      explanation: "useLayoutEffect는 DOM이 업데이트된 직후, 브라우저가 화면을 paint하기 전에 동기적으로 실행됩니다.",
    },
    {
      id: "q2",
      question: "useLayoutEffect를 사용해야 하는 경우는?",
      choices: [
        "데이터 페칭",
        "이벤트 리스너 등록",
        "DOM 요소의 크기/위치 측정 후 즉시 반영",
        "로깅",
      ],
      correctIndex: 2,
      explanation: "DOM 측정 후 그 값으로 UI를 업데이트해야 할 때 useLayoutEffect를 사용하면 깜빡임 없이 올바른 결과를 보여줍니다.",
    },
    {
      id: "q3",
      question: "useLayoutEffect에서 무거운 작업을 하면?",
      choices: [
        "에러가 발생한다",
        "비동기로 전환된다",
        "paint가 차단되어 UI가 멈춘다",
        "아무 문제 없다",
      ],
      correctIndex: 2,
      explanation: "useLayoutEffect는 동기적으로 실행되므로 완료될 때까지 브라우저가 paint할 수 없습니다. 무거운 작업은 UI 멈춤을 유발합니다.",
    },
    {
      id: "q4",
      question: "SSR 환경에서 useLayoutEffect를 사용하면?",
      choices: [
        "정상 동작한다",
        "경고가 발생한다 (서버에 DOM이 없으므로)",
        "서버에서 에러가 발생한다",
        "자동으로 useEffect로 대체된다",
      ],
      correctIndex: 1,
      explanation: "서버에는 DOM이 없으므로 useLayoutEffect를 사용하면 React가 경고를 표시합니다. useIsomorphicLayoutEffect 패턴으로 대응합니다.",
    },
    {
      id: "q5",
      question: "useEffect와 useLayoutEffect의 올바른 실행 순서는?",
      choices: [
        "useEffect → useLayoutEffect → paint",
        "useLayoutEffect → paint → useEffect",
        "paint → useLayoutEffect → useEffect",
        "useLayoutEffect → useEffect → paint",
      ],
      correctIndex: 1,
      explanation: "DOM 업데이트 → useLayoutEffect(동기) → paint → useEffect(비동기) 순서로 실행됩니다.",
    },
  ],
};

export default chapter;
