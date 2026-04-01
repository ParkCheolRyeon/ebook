import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "52-compound-component",
  subject: "react",
  title: "Compound Component 패턴",
  description:
    "암묵적 상태 공유, Context 기반 합성, Select/Tabs/Accordion 예제, Headless UI 라이브러리를 학습합니다.",
  order: 52,
  group: "설계 패턴과 아키텍처",
  prerequisites: ["51-component-design-principles"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Compound Component는 **HTML의 select/option 관계**와 같습니다.\n\n" +
        "`<select>`와 `<option>`은 독립적으로는 의미가 없지만, 함께 사용하면 완전한 드롭다운을 만듭니다. `<select>`가 내부적으로 선택 상태를 관리하고, `<option>`들은 그 상태를 암묵적으로 공유합니다.\n\n" +
        "이것을 React 컴포넌트로 구현하면 Compound Component 패턴입니다:\n" +
        "```\n" +
        "<Tabs>\n" +
        "  <Tabs.List>\n" +
        "    <Tabs.Tab>탭1</Tabs.Tab>\n" +
        "    <Tabs.Tab>탭2</Tabs.Tab>\n" +
        "  </Tabs.List>\n" +
        "  <Tabs.Panel>내용1</Tabs.Panel>\n" +
        "  <Tabs.Panel>내용2</Tabs.Panel>\n" +
        "</Tabs>\n" +
        "```\n\n" +
        "부모(`Tabs`)가 상태를 관리하고, 자식들(`Tab`, `Panel`)이 Context를 통해 암묵적으로 상태를 공유합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "Compound Component 없이 복합 UI를 만들면 어떤 문제가 있을까요?\n\n" +
        "1. **Props 폭발** — 모든 옵션을 하나의 컴포넌트에 전달하면 props가 끝없이 늘어납니다.\n" +
        "```\n" +
        "<Tabs tabs={[{label: '탭1', content: '내용1'}, ...]} activeIndex={0} onChange={...} />\n" +
        "```\n\n" +
        "2. **유연성 부족** — 탭 사이에 구분선을 넣거나, 특정 탭만 비활성화하거나, 탭 목록과 내용의 위치를 바꾸는 것이 어렵습니다.\n\n" +
        "3. **Props Drilling** — 부모에서 여러 단계의 자식까지 상태를 전달해야 합니다.\n\n" +
        "4. **재사용 제한** — 정해진 구조에서만 동작하므로, 다른 레이아웃에 적용할 수 없습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### Context 기반 상태 공유\n" +
        "부모 컴포넌트가 Context Provider를 생성하고, 자식 컴포넌트들이 useContext로 상태에 접근합니다. Props를 직접 전달하지 않아도 암묵적으로 상태를 공유합니다.\n\n" +
        "### 하위 컴포넌트를 정적 프로퍼티로 연결\n" +
        "`Tabs.Tab`, `Tabs.Panel` 같이 부모 컴포넌트의 정적 프로퍼티로 하위 컴포넌트를 노출합니다. 네임스페이스가 명확하고, import 관리가 편합니다.\n\n" +
        "### 유연한 합성\n" +
        "사용자가 자식 컴포넌트의 순서, 래핑, 조건부 렌더링을 자유롭게 제어할 수 있습니다.\n\n" +
        "### Headless UI 라이브러리\n" +
        "Radix UI, Headless UI(Tailwind Labs)는 이 패턴을 기반으로 접근성까지 보장하는 컴포넌트를 제공합니다. 스타일은 사용자가 직접 적용합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Tabs Compound Component",
      content:
        "Context 기반 Tabs 컴포넌트를 구현하는 과정을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// === Context 생성 ===\n' +
          'interface TabsContextValue {\n' +
          '  activeIndex: number;\n' +
          '  setActiveIndex: (index: number) => void;\n' +
          '}\n' +
          '\n' +
          'const TabsContext = createContext<TabsContextValue | null>(null);\n' +
          '\n' +
          'function useTabsContext() {\n' +
          '  const context = useContext(TabsContext);\n' +
          '  if (!context) throw new Error("Tabs 컴포넌트 안에서 사용하세요");\n' +
          '  return context;\n' +
          '}\n' +
          '\n' +
          '// === 부모: 상태 관리 + Provider ===\n' +
          'function Tabs({ children, defaultIndex = 0 }: { children: React.ReactNode; defaultIndex?: number }) {\n' +
          '  const [activeIndex, setActiveIndex] = useState(defaultIndex);\n' +
          '  return (\n' +
          '    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>\n' +
          '      <div role="tablist">{children}</div>\n' +
          '    </TabsContext.Provider>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === 자식: Context에서 상태 읽기 ===\n' +
          'function Tab({ index, children }: { index: number; children: React.ReactNode }) {\n' +
          '  const { activeIndex, setActiveIndex } = useTabsContext();\n' +
          '  return (\n' +
          '    <button\n' +
          '      role="tab"\n' +
          '      aria-selected={activeIndex === index}\n' +
          '      onClick={() => setActiveIndex(index)}\n' +
          '    >\n' +
          '      {children}\n' +
          '    </button>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'function Panel({ index, children }: { index: number; children: React.ReactNode }) {\n' +
          '  const { activeIndex } = useTabsContext();\n' +
          '  if (activeIndex !== index) return null;\n' +
          '  return <div role="tabpanel">{children}</div>;\n' +
          '}\n' +
          '\n' +
          '// === 정적 프로퍼티로 연결 ===\n' +
          'Tabs.Tab = Tab;\n' +
          'Tabs.Panel = Panel;',
        description:
          "Context Provider가 상태를 공유하고, 자식 컴포넌트가 useContext로 접근하는 Compound Component 패턴입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Accordion Compound Component",
      content:
        "Accordion 컴포넌트를 Compound Component 패턴으로 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// === Accordion 사용 예시 ===\n' +
          '<Accordion>\n' +
          '  <Accordion.Item>\n' +
          '    <Accordion.Trigger>FAQ 1</Accordion.Trigger>\n' +
          '    <Accordion.Content>답변 1</Accordion.Content>\n' +
          '  </Accordion.Item>\n' +
          '  <Accordion.Item>\n' +
          '    <Accordion.Trigger>FAQ 2</Accordion.Trigger>\n' +
          '    <Accordion.Content>답변 2</Accordion.Content>\n' +
          '  </Accordion.Item>\n' +
          '</Accordion>\n' +
          '\n' +
          '// === 구현 ===\n' +
          'interface AccordionItemContextValue {\n' +
          '  isOpen: boolean;\n' +
          '  toggle: () => void;\n' +
          '}\n' +
          '\n' +
          'const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);\n' +
          '\n' +
          'function AccordionItem({ children }: { children: React.ReactNode }) {\n' +
          '  const [isOpen, setIsOpen] = useState(false);\n' +
          '  const toggle = useCallback(() => setIsOpen(prev => !prev), []);\n' +
          '  return (\n' +
          '    <AccordionItemContext.Provider value={{ isOpen, toggle }}>\n' +
          '      <div>{children}</div>\n' +
          '    </AccordionItemContext.Provider>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'function AccordionTrigger({ children }: { children: React.ReactNode }) {\n' +
          '  const { isOpen, toggle } = useContext(AccordionItemContext)!;\n' +
          '  return (\n' +
          '    <button aria-expanded={isOpen} onClick={toggle}>\n' +
          '      {children}\n' +
          '    </button>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'function AccordionContent({ children }: { children: React.ReactNode }) {\n' +
          '  const { isOpen } = useContext(AccordionItemContext)!;\n' +
          '  if (!isOpen) return null;\n' +
          '  return <div role="region">{children}</div>;\n' +
          '}',
        description:
          "각 Accordion.Item이 독립적인 Context를 가지므로, 여러 아이템이 동시에 열릴 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 특징 | Props 방식 | Compound Component |\n" +
        "|------|-----------|--------------------|\n" +
        "| 상태 전달 | 명시적 props | Context로 암묵적 공유 |\n" +
        "| 유연성 | 정해진 구조 | 자유로운 합성 |\n" +
        "| Props 수 | 많음 | 적음 |\n" +
        "| 학습 비용 | 낮음 | 보통 |\n\n" +
        "**핵심:** Compound Component는 Select, Tabs, Accordion, Menu 같은 복합 UI에 적합합니다. 단순한 컴포넌트에는 오버엔지니어링이 될 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** Render Props와 HOC 패턴으로 로직을 재사용하는 클래식 패턴을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "Compound Component 패턴은 부모-자식 컴포넌트가 암묵적으로 상태를 공유하여, 사용하는 쪽에서 유연하게 조합할 수 있는 API를 제공한다.",
  checklist: [
    "Compound Component 패턴의 구조를 설명할 수 있다",
    "Context를 활용한 암묵적 상태 공유를 구현할 수 있다",
    "정적 프로퍼티로 하위 컴포넌트를 연결할 수 있다",
    "Headless UI 라이브러리의 개념을 이해한다",
    "Compound Component가 적합한 상황을 판단할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Compound Component에서 자식 컴포넌트가 상태를 공유하는 방식은?",
      choices: ["Props Drilling", "전역 변수", "Context API", "이벤트 버블링"],
      correctIndex: 2,
      explanation:
        "Compound Component는 부모가 Context Provider를 생성하고, 자식들이 useContext로 상태에 접근합니다. Props를 명시적으로 전달하지 않아도 됩니다.",
    },
    {
      id: "q2",
      question: "Compound Component가 적합한 UI 유형은?",
      choices: [
        "단일 버튼",
        "텍스트 입력 필드",
        "Tabs, Accordion, Select 같은 복합 UI",
        "정적 텍스트 표시",
      ],
      correctIndex: 2,
      explanation:
        "Compound Component는 여러 하위 요소가 상태를 공유하면서 함께 동작하는 복합 UI에 적합합니다. 단순 컴포넌트에는 과도합니다.",
    },
    {
      id: "q3",
      question: "Tabs.Tab 같이 정적 프로퍼티를 사용하는 이유는?",
      choices: [
        "성능이 향상된다",
        "네임스페이스가 명확하고 관련 컴포넌트가 묶인다",
        "TypeScript 에러를 방지한다",
        "서버 사이드 렌더링에 필수적이다",
      ],
      correctIndex: 1,
      explanation:
        "정적 프로퍼티는 관련 컴포넌트들을 하나의 네임스페이스로 묶어, Tabs.Tab, Tabs.Panel처럼 의미가 명확하고 import 관리가 편합니다.",
    },
    {
      id: "q4",
      question: "Compound Component 사용 시 Context 없이 자식이 사용되면?",
      choices: [
        "기본값으로 동작한다",
        "컴파일 에러가 발생한다",
        "런타임 에러를 발생시켜야 한다",
        "아무 일도 일어나지 않는다",
      ],
      correctIndex: 2,
      explanation:
        "useContext의 결과가 null이면 '부모 컴포넌트 안에서 사용하세요'라는 에러를 던져야 합니다. 개발자가 잘못된 사용을 빠르게 인지할 수 있습니다.",
    },
    {
      id: "q5",
      question: "Headless UI 라이브러리(Radix, Headless UI)의 핵심 특징은?",
      choices: [
        "기본 스타일이 풍부하게 포함된다",
        "접근성과 로직만 제공하고 스타일은 사용자에게 맡긴다",
        "서버 컴포넌트 전용이다",
        "jQuery 기반으로 동작한다",
      ],
      correctIndex: 1,
      explanation:
        "Headless UI 라이브러리는 접근성(WAI-ARIA)과 인터랙션 로직을 제공하고, 시각적 스타일링은 사용자가 자유롭게 적용합니다.",
    },
  ],
};

export default chapter;
