import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "51-component-design-principles",
  subject: "react",
  title: "컴포넌트 설계 원칙",
  description:
    "단일 책임 원칙, 합성 우선 설계, Headless 컴포넌트, Props 인터페이스 설계, 컴포넌트 크기 기준을 학습합니다.",
  order: 51,
  group: "설계 패턴과 아키텍처",
  prerequisites: ["50-e2e-testing"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "컴포넌트 설계는 **레고 블록 설계**와 같습니다.\n\n" +
        "**단일 책임**은 레고 블록 하나가 하나의 역할만 하는 것입니다. 바퀴 블록은 굴러가기만 하고, 문 블록은 열고 닫기만 합니다. 바퀴가 문도 되면 어디에도 쓰기 어렵습니다.\n\n" +
        "**합성 우선**은 블록을 조립해서 새로운 것을 만드는 방식입니다. 기존 블록을 변형하지 않고, 작은 블록을 조합하여 집, 차, 배를 만듭니다.\n\n" +
        "**Headless 컴포넌트**는 기능만 제공하는 '투명 블록'입니다. 모양은 없지만 '연결' 기능이 있어서, 어떤 모양의 블록과도 결합할 수 있습니다.\n\n" +
        "**Props 인터페이스**는 블록의 연결 부위입니다. 연결 부위가 명확하고 직관적이면 누구나 쉽게 조립할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "잘못된 컴포넌트 설계가 만드는 문제들입니다.\n\n" +
        "1. **거대 컴포넌트(God Component)** — 하나의 컴포넌트가 데이터 페칭, 비즈니스 로직, UI 렌더링을 모두 담당합니다. 이해하기 어렵고 테스트할 수 없습니다.\n\n" +
        "2. **Props 폭발** — 하나의 컴포넌트에 20개 이상의 props가 있으면 사용법을 이해하기 어렵습니다.\n\n" +
        "3. **상속 기반 재사용** — Button → PrimaryButton → BigPrimaryButton 같은 상속 체인은 변경에 취약합니다.\n\n" +
        "4. **UI와 로직 결합** — 드롭다운의 열기/닫기 로직이 특정 UI에 묶여 있으면, 다른 디자인에 재사용할 수 없습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 단일 책임 원칙 (SRP)\n" +
        "하나의 컴포넌트는 하나의 이유로만 변경되어야 합니다. 데이터 페칭은 Hook으로, 비즈니스 로직은 유틸 함수로, UI는 컴포넌트로 분리합니다.\n\n" +
        "### 합성(Composition) 우선\n" +
        "상속 대신 합성을 사용합니다. `children`, render props, Hook으로 기능을 조합합니다. React의 핵심 철학입니다.\n\n" +
        "### Headless 컴포넌트\n" +
        "로직만 제공하고 UI는 사용자에게 맡기는 패턴입니다. `useToggle()` 같은 Hook이나 Headless UI 라이브러리가 이 패턴을 따릅니다.\n\n" +
        "### Props 인터페이스 설계\n" +
        "- 필수 props를 최소화하세요\n" +
        "- boolean props보다 union 타입을 사용하세요 (`variant: 'primary' | 'secondary'`)\n" +
        "- 관련 props를 객체로 그룹화하세요\n" +
        "- HTML 속성을 그대로 전달하려면 `ComponentPropsWithoutRef`를 확장하세요\n\n" +
        "### 컴포넌트 크기 기준\n" +
        "정확한 줄 수 기준은 없지만, 200줄이 넘으면 분리를 고려하세요. '한 문장으로 이 컴포넌트가 무엇을 하는지 설명할 수 있는가?'가 더 좋은 기준입니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 합성 기반 컴포넌트 설계",
      content:
        "합성 우선 설계로 유연한 컴포넌트를 만드는 방법을 의사코드로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// === ❌ 상속 기반: 변형마다 새 컴포넌트 ===\n' +
          '// Button → PrimaryButton → BigPrimaryButton\n' +
          '// → 변형이 늘어날수록 조합 폭발\n' +
          '\n' +
          '// === ✅ 합성 기반: Props로 변형 제어 ===\n' +
          'interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {\n' +
          '  variant?: "primary" | "secondary" | "ghost";\n' +
          '  size?: "sm" | "md" | "lg";\n' +
          '}\n' +
          '\n' +
          'function Button({ variant = "primary", size = "md", children, ...rest }: ButtonProps) {\n' +
          '  return (\n' +
          '    <button data-variant={variant} data-size={size} {...rest}>\n' +
          '      {children}\n' +
          '    </button>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === Headless 컴포넌트: 로직만 제공 ===\n' +
          'function useToggle(initialState = false) {\n' +
          '  const [isOpen, setIsOpen] = useState(initialState);\n' +
          '  const toggle = useCallback(() => setIsOpen(prev => !prev), []);\n' +
          '  const open = useCallback(() => setIsOpen(true), []);\n' +
          '  const close = useCallback(() => setIsOpen(false), []);\n' +
          '  return { isOpen, toggle, open, close };\n' +
          '}\n' +
          '\n' +
          '// 어떤 UI와도 조합 가능\n' +
          'function Dropdown() {\n' +
          '  const { isOpen, toggle } = useToggle();\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <button onClick={toggle}>메뉴</button>\n' +
          '      {isOpen && <ul>...</ul>}\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "합성 기반은 props로 변형을 제어하고, Headless 패턴은 로직과 UI를 분리합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Props 인터페이스 설계",
      content:
        "좋은 Props 인터페이스와 나쁜 Props 인터페이스를 비교합니다.",
      code: {
        language: "typescript",
        code:
          '// === ❌ 나쁜 Props: 너무 많고 불명확 ===\n' +
          'interface BadCardProps {\n' +
          '  title: string;\n' +
          '  subtitle: string;\n' +
          '  description: string;\n' +
          '  image: string;\n' +
          '  imageAlt: string;\n' +
          '  imageWidth: number;\n' +
          '  imageHeight: number;\n' +
          '  showFooter: boolean;\n' +
          '  showHeader: boolean;\n' +
          '  isClickable: boolean;\n' +
          '  isPrimary: boolean;\n' +
          '  isLoading: boolean;\n' +
          '  // ... 20개 이상의 props\n' +
          '}\n' +
          '\n' +
          '// === ✅ 좋은 Props: 그룹화 + 합성 ===\n' +
          'interface ImageConfig {\n' +
          '  src: string;\n' +
          '  alt: string;\n' +
          '  width?: number;\n' +
          '  height?: number;\n' +
          '}\n' +
          '\n' +
          'interface CardProps {\n' +
          '  variant?: "default" | "primary";\n' +
          '  image?: ImageConfig;\n' +
          '  header?: React.ReactNode;   // 합성: 무엇이든 넣을 수 있음\n' +
          '  footer?: React.ReactNode;\n' +
          '  children: React.ReactNode;\n' +
          '  onClick?: () => void;\n' +
          '}\n' +
          '\n' +
          'function Card({ variant = "default", image, header, footer, children, onClick }: CardProps) {\n' +
          '  return (\n' +
          '    <div data-variant={variant} onClick={onClick}>\n' +
          '      {header}\n' +
          '      {image && <img src={image.src} alt={image.alt} />}\n' +
          '      <div>{children}</div>\n' +
          '      {footer}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 사용 예: 합성으로 유연하게\n' +
          '<Card\n' +
          '  header={<h2>제목</h2>}\n' +
          '  footer={<Button>자세히 보기</Button>}\n' +
          '>\n' +
          '  <p>카드 내용입니다</p>\n' +
          '</Card>',
        description:
          "관련 props를 객체로 그룹화하고, ReactNode를 사용하여 합성을 가능하게 합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 원칙 | 핵심 | 안티패턴 |\n" +
        "|------|------|----------|\n" +
        "| 단일 책임 | 하나의 변경 이유 | God Component |\n" +
        "| 합성 우선 | children, props로 조합 | 깊은 상속 체인 |\n" +
        "| Headless | 로직과 UI 분리 | 로직이 특정 UI에 묶임 |\n" +
        "| Props 설계 | 최소, 명확, 타입 안전 | Props 폭발 |\n\n" +
        "**핵심:** '이 컴포넌트를 한 문장으로 설명할 수 있는가?' — 설명이 길어지면 분리가 필요합니다.\n\n" +
        "**다음 챕터 미리보기:** Compound Component 패턴으로 암묵적 상태를 공유하는 합성 패턴을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "단일 책임 원칙을 컴포넌트에 적용할 수 있다",
    "상속 대신 합성으로 컴포넌트를 설계할 수 있다",
    "Headless 컴포넌트 패턴을 이해하고 구현할 수 있다",
    "깔끔한 Props 인터페이스를 설계할 수 있다",
    "컴포넌트 분리 시점을 판단할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "React에서 코드 재사용 시 권장되는 접근법은?",
      choices: ["컴포넌트 상속", "합성(Composition)", "전역 변수", "Copy & Paste"],
      correctIndex: 1,
      explanation:
        "React는 상속보다 합성을 권장합니다. children, render props, Hook 등으로 기능을 조합하는 것이 더 유연하고 유지보수하기 좋습니다.",
    },
    {
      id: "q2",
      question: "Headless 컴포넌트의 특징은?",
      choices: [
        "UI만 제공하고 로직은 외부에 위임한다",
        "로직만 제공하고 UI는 사용자가 구현한다",
        "서버에서만 렌더링된다",
        "스타일이 고정되어 있다",
      ],
      correctIndex: 1,
      explanation:
        "Headless 컴포넌트는 동작 로직(열기/닫기, 선택, 정렬 등)만 제공하고, 실제 UI 렌더링은 사용자에게 맡깁니다. 어떤 디자인 시스템과도 조합할 수 있습니다.",
    },
    {
      id: "q3",
      question: "Props 설계 시 boolean보다 union 타입이 권장되는 이유는?",
      choices: [
        "성능이 더 좋기 때문이다",
        "상태가 명확하고 조합 실수를 타입으로 방지할 수 있다",
        "번들 크기가 줄어든다",
        "IE 호환성이 좋다",
      ],
      correctIndex: 1,
      explanation:
        "isPrimary, isSecondary 같은 boolean 조합은 둘 다 true가 될 수 있습니다. variant: 'primary' | 'secondary'는 하나만 선택할 수 있어 의도가 명확하고 타입 안전합니다.",
    },
    {
      id: "q4",
      question: "컴포넌트를 분리해야 하는 신호가 아닌 것은?",
      choices: [
        "한 문장으로 설명하기 어렵다",
        "200줄이 넘는다",
        "props가 3개 이상이다",
        "여러 가지 이유로 변경된다",
      ],
      correctIndex: 2,
      explanation:
        "props가 3개 있는 것은 완전히 정상입니다. 분리 신호는 책임이 여러 개이거나, 설명이 길어지거나, 코드가 너무 길어지는 경우입니다.",
    },
    {
      id: "q5",
      question: "God Component의 문제점은?",
      choices: [
        "렌더링 속도만 느려진다",
        "이해, 테스트, 재사용 모두 어렵다",
        "TypeScript에서 사용할 수 없다",
        "서버 사이드 렌더링이 불가능하다",
      ],
      correctIndex: 1,
      explanation:
        "God Component는 모든 책임을 한 곳에 집중시켜, 코드 이해가 어렵고, 테스트가 복잡하며, 부분적 재사용이 불가능합니다.",
    },
  ],
};

export default chapter;
