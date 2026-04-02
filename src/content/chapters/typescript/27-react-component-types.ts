import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "27-react-component-types",
  subject: "typescript",
  title: "React 컴포넌트 타이핑",
  description:
    "React 컴포넌트의 Props 타이핑, children 처리, 제네릭 컴포넌트 등 React + TypeScript의 기본 패턴을 학습합니다.",
  order: 27,
  group: "React + TypeScript",
  prerequisites: ["26-decorators"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "React 컴포넌트의 Props 타이핑은 **자판기의 버튼 패널**과 같습니다.\n\n" +
        "자판기에는 정해진 버튼이 있고, 각 버튼에는 어떤 음료가 나오는지 라벨이 붙어 있습니다. 잘못된 버튼을 누르면 원하는 음료가 나오지 않겠죠. Props 타이핑은 이 라벨을 붙이는 작업입니다. `title`에는 문자열만, `count`에는 숫자만, `onClick`에는 함수만 넣을 수 있도록 명시합니다.\n\n" +
        "`children`은 자판기의 **음료 투입구**와 같습니다. 어떤 음료든 들어갈 수 있는 범용 공간이죠. ReactNode 타입이 바로 이 '어떤 것이든' 받을 수 있는 타입입니다. 문자열, 숫자, JSX, 배열, null까지 모두 허용합니다.\n\n" +
        "제네릭 컴포넌트는 **다목적 자판기**입니다. 음료 자판기로도, 스낵 자판기로도 쓸 수 있는 범용 기계인데, 한 번 특정 상품 타입으로 설정하면 그 타입만 취급합니다. `<Select<User>>` 처럼 사용하면 User 타입의 옵션만 표시하는 셀렉트 컴포넌트가 됩니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React 컴포넌트를 TypeScript로 작성할 때 여러 타이핑 이슈에 직면합니다.\n\n" +
        "**1. FC<Props> vs 일반 함수 선언의 혼란**\n" +
        "React.FC를 사용해야 하는지, 일반 함수로 선언해야 하는지 팀마다 의견이 다릅니다. FC는 암시적으로 children을 포함했다가(React 17), 포함하지 않게 변경되었고(React 18), 제네릭 컴포넌트에서는 사용이 어렵습니다.\n\n" +
        "**2. children 타입의 혼동**\n" +
        "`ReactNode`, `ReactElement`, `JSX.Element`의 차이를 모르면 타입 에러가 발생합니다. 특히 조건부 렌더링에서 children이 `undefined`일 수 있는 경우를 놓치기 쉽습니다.\n\n" +
        "**3. 기존 HTML 요소 Props 확장**\n" +
        "커스텀 Button 컴포넌트가 HTML button의 모든 속성(onClick, disabled 등)을 지원하면서 추가 props도 받아야 할 때, 일일이 타입을 정의하면 코드가 폭발합니다.\n\n" +
        "**4. defaultProps 지원 종료**\n" +
        "React 19에서 defaultProps가 deprecated되었습니다. TypeScript에서 기본값을 처리하는 올바른 방법이 필요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "React + TypeScript에서 컴포넌트를 타이핑하는 현대적 패턴을 정리합니다.\n\n" +
        "### 일반 함수 선언 (권장)\n" +
        "FC<Props>보다 일반 함수 선언이 더 유연합니다. 제네릭 컴포넌트를 만들 수 있고, 반환 타입을 명시적으로 제어할 수 있습니다. 타입 추론도 자연스럽게 동작합니다.\n\n" +
        "### children 타입 체계\n" +
        "- `ReactNode`: 가장 넓은 타입. string, number, JSX, null, undefined, boolean 모두 포함. children에 가장 많이 사용됩니다.\n" +
        "- `ReactElement`: JSX 요소만. string이나 number는 포함하지 않습니다.\n" +
        "- `JSX.Element`: ReactElement와 거의 같지만, 전역 JSX 네임스페이스에 정의됩니다.\n" +
        "- `PropsWithChildren<P>`: 기존 Props에 `children?: ReactNode`를 추가하는 유틸리티 타입입니다.\n\n" +
        "### 기존 컴포넌트 Props 추출\n" +
        "`React.ComponentProps<typeof Button>`으로 기존 컴포넌트의 Props 타입을 추출할 수 있습니다. HTML 요소라면 `React.ComponentProps<'button'>`처럼 문자열을 사용합니다.\n\n" +
        "### 기본값 처리\n" +
        "defaultProps 대신 ES6 기본 매개변수를 사용합니다. 구조 분해 할당에서 바로 기본값을 지정하면 TypeScript가 자동으로 선택적 props로 처리합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 컴포넌트 타이핑 패턴",
      content:
        "Props 인터페이스 정의, children 타이핑, ComponentProps 활용 등 핵심 패턴을 코드로 살펴봅시다. FC 대신 일반 함수 선언을 사용하는 이유와 방법을 확인합니다.",
      code: {
        language: "typescript",
        code:
          "import { type ReactNode, type ComponentProps } from 'react';\n" +
          "\n" +
          "// ===== Props 인터페이스 정의 =====\n" +
          "interface ButtonProps {\n" +
          "  variant: 'primary' | 'secondary' | 'danger';\n" +
          "  size?: 'sm' | 'md' | 'lg'; // 선택적 prop\n" +
          "  disabled?: boolean;\n" +
          "  children: ReactNode; // 필수 children\n" +
          "  onClick?: () => void;\n" +
          "}\n" +
          "\n" +
          "// ✅ 일반 함수 선언 (권장)\n" +
          "function Button({\n" +
          "  variant,\n" +
          "  size = 'md',       // 기본값 = 선택적 prop\n" +
          "  disabled = false,\n" +
          "  children,\n" +
          "  onClick,\n" +
          "}: ButtonProps) {\n" +
          "  return (\n" +
          "    <button\n" +
          "      className={`btn-${variant} btn-${size}`}\n" +
          "      disabled={disabled}\n" +
          "      onClick={onClick}\n" +
          "    >\n" +
          "      {children}\n" +
          "    </button>\n" +
          "  );\n" +
          "}\n" +
          "\n" +
          "// ❌ FC는 제네릭 컴포넌트에서 사용 어려움\n" +
          "// const Button: React.FC<ButtonProps> = ({ ... }) => { ... };\n" +
          "\n" +
          "// ===== HTML 요소 Props 확장 =====\n" +
          "interface IconButtonProps extends ComponentProps<'button'> {\n" +
          "  icon: string;\n" +
          "  label: string;\n" +
          "}\n" +
          "\n" +
          "function IconButton({ icon, label, ...rest }: IconButtonProps) {\n" +
          "  return (\n" +
          "    <button aria-label={label} {...rest}>\n" +
          "      <span className={`icon-${icon}`} />\n" +
          "    </button>\n" +
          "  );\n" +
          "}\n" +
          "\n" +
          "// ===== 기존 컴포넌트 Props 추출 =====\n" +
          "type OriginalButtonProps = ComponentProps<typeof Button>;\n" +
          "// → ButtonProps와 동일한 타입\n" +
          "\n" +
          "// ===== PropsWithChildren =====\n" +
          "import type { PropsWithChildren } from 'react';\n" +
          "\n" +
          "interface CardProps {\n" +
          "  title: string;\n" +
          "}\n" +
          "\n" +
          "function Card({ title, children }: PropsWithChildren<CardProps>) {\n" +
          "  return (\n" +
          "    <div className=\"card\">\n" +
          "      <h2>{title}</h2>\n" +
          "      <div>{children}</div>\n" +
          "    </div>\n" +
          "  );\n" +
          "}",
        description:
          "일반 함수 선언으로 컴포넌트를 정의하고, ComponentProps로 HTML 요소의 Props를 확장합니다. children은 ReactNode 타입을 사용합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 제네릭 컴포넌트와 고급 Props",
      content:
        "제네릭 컴포넌트, 조건부 Props, 그리고 실무에서 자주 사용하는 컴포넌트 타이핑 패턴을 직접 구현해봅시다.",
      code: {
        language: "typescript",
        code:
          "import { type ReactNode } from 'react';\n" +
          "\n" +
          "// ===== 제네릭 컴포넌트: Select =====\n" +
          "interface SelectProps<T> {\n" +
          "  items: T[];\n" +
          "  value: T;\n" +
          "  onChange: (item: T) => void;\n" +
          "  renderItem: (item: T) => ReactNode;\n" +
          "  getKey: (item: T) => string;\n" +
          "}\n" +
          "\n" +
          "function Select<T>({\n" +
          "  items,\n" +
          "  value,\n" +
          "  onChange,\n" +
          "  renderItem,\n" +
          "  getKey,\n" +
          "}: SelectProps<T>) {\n" +
          "  return (\n" +
          "    <ul>\n" +
          "      {items.map((item) => (\n" +
          "        <li\n" +
          "          key={getKey(item)}\n" +
          "          onClick={() => onChange(item)}\n" +
          "          style={{ fontWeight: item === value ? 'bold' : 'normal' }}\n" +
          "        >\n" +
          "          {renderItem(item)}\n" +
          "        </li>\n" +
          "      ))}\n" +
          "    </ul>\n" +
          "  );\n" +
          "}\n" +
          "\n" +
          "// 사용 시 타입 자동 추론\n" +
          "interface User { id: string; name: string; }\n" +
          "const users: User[] = [{ id: '1', name: 'Alice' }];\n" +
          "\n" +
          "<Select\n" +
          "  items={users}\n" +
          "  value={users[0]}         // T = User로 추론\n" +
          "  onChange={(user) => {}}   // user: User로 추론\n" +
          "  renderItem={(u) => u.name}\n" +
          "  getKey={(u) => u.id}\n" +
          "/>\n" +
          "\n" +
          "// ===== 조건부 렌더링 컴포넌트 =====\n" +
          "interface DataListProps<T> {\n" +
          "  data: T[] | undefined;\n" +
          "  isLoading: boolean;\n" +
          "  error?: string;\n" +
          "  renderItem: (item: T) => ReactNode;\n" +
          "  emptyMessage?: string;\n" +
          "}\n" +
          "\n" +
          "function DataList<T>({\n" +
          "  data,\n" +
          "  isLoading,\n" +
          "  error,\n" +
          "  renderItem,\n" +
          "  emptyMessage = '데이터가 없습니다',\n" +
          "}: DataListProps<T>) {\n" +
          "  if (isLoading) return <div>로딩 중...</div>;\n" +
          "  if (error) return <div>에러: {error}</div>;\n" +
          "  if (!data || data.length === 0) {\n" +
          "    return <div>{emptyMessage}</div>;\n" +
          "  }\n" +
          "  return <ul>{data.map(renderItem)}</ul>;\n" +
          "}",
        description:
          "제네릭 컴포넌트는 사용 시 타입이 자동 추론됩니다. Select<User>처럼 명시할 수도 있고, items의 타입에서 추론되기도 합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 설명 | 권장도 |\n" +
        "|------|------|--------|\n" +
        "| 일반 함수 선언 | 가장 유연, 제네릭 지원 | ⭐⭐⭐ |\n" +
        "| FC<Props> | 암시적 반환 타입 | ⭐⭐ |\n" +
        "| children: ReactNode | 모든 렌더 가능 타입 | ⭐⭐⭐ |\n" +
        "| ComponentProps<> | 기존 Props 추출/확장 | ⭐⭐⭐ |\n" +
        "| PropsWithChildren<> | children 추가 유틸리티 | ⭐⭐ |\n" +
        "| 기본 매개변수 | defaultProps 대체 | ⭐⭐⭐ |\n\n" +
        "**핵심:** React 컴포넌트의 Props는 interface로 정의하고, children은 ReactNode 타입을 사용합니다. FC<Props>보다 일반 함수 선언이 더 유연하며, ComponentProps로 기존 컴포넌트의 타입을 재활용할 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** Hooks 타이핑을 학습합니다. useState, useRef, useReducer 등 각 Hook의 제네릭 활용법과 커스텀 Hook의 반환 타입을 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "React 컴포넌트의 Props는 interface로 정의하고, children은 ReactNode 타입을 사용한다. FC<Props>보다 일반 함수 선언이 더 유연하며, ComponentProps로 기존 컴포넌트의 타입을 재활용할 수 있다.",
  checklist: [
    "FC<Props>와 일반 함수 선언의 차이를 설명할 수 있다",
    "ReactNode, ReactElement, JSX.Element의 차이를 이해한다",
    "ComponentProps를 사용하여 HTML 요소의 Props를 확장할 수 있다",
    "제네릭 컴포넌트를 작성할 수 있다",
    "defaultProps 대신 기본 매개변수를 사용하는 이유를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "React 컴포넌트의 children에 가장 적합한 타입은?",
      choices: [
        "string",
        "JSX.Element",
        "ReactNode",
        "ReactElement",
      ],
      correctIndex: 2,
      explanation:
        "ReactNode는 string, number, JSX, null, undefined, boolean 등 렌더링 가능한 모든 타입을 포함하는 가장 넓은 타입입니다. children은 다양한 형태가 될 수 있으므로 ReactNode가 가장 적합합니다.",
    },
    {
      id: "q2",
      question: "FC<Props> 대신 일반 함수 선언이 권장되는 이유는?",
      choices: [
        "성능이 더 좋다",
        "번들 크기가 작다",
        "제네릭 컴포넌트를 만들 수 있고 더 유연하다",
        "React 내부에서 다르게 처리된다",
      ],
      correctIndex: 2,
      explanation:
        "일반 함수 선언은 제네릭 컴포넌트를 만들 수 있고, 반환 타입을 명시적으로 제어할 수 있어 더 유연합니다. FC는 제네릭 매개변수를 컴포넌트에 전달하기 어렵습니다.",
    },
    {
      id: "q3",
      question: "HTML button 요소의 모든 Props를 포함하는 타입은?",
      choices: [
        "HTMLButtonElement",
        "ButtonHTMLAttributes<HTMLButtonElement>",
        "ComponentProps<'button'>",
        "typeof button",
      ],
      correctIndex: 2,
      explanation:
        "ComponentProps<'button'>은 HTML button 요소의 모든 Props 타입을 추출합니다. onClick, disabled, type 등 모든 표준 속성이 포함됩니다.",
    },
    {
      id: "q4",
      question: "React 19에서 defaultProps가 deprecated된 후 권장되는 기본값 처리 방법은?",
      choices: [
        "static defaultProps를 계속 사용",
        "구조 분해 할당에서 ES6 기본 매개변수 사용",
        "PropTypes.defaultValue 사용",
        "Context로 기본값 제공",
      ],
      correctIndex: 1,
      explanation:
        "React 19에서 defaultProps가 deprecated되었으며, 구조 분해 할당에서 ES6 기본 매개변수(예: size = 'md')를 사용하는 것이 권장됩니다. TypeScript도 이를 자연스럽게 지원합니다.",
    },
    {
      id: "q5",
      question: "PropsWithChildren<CardProps>가 하는 일은?",
      choices: [
        "CardProps에서 children을 제거한다",
        "CardProps에 children?: ReactNode를 추가한다",
        "CardProps의 모든 props를 필수로 만든다",
        "CardProps를 React.FC와 호환되게 변환한다",
      ],
      correctIndex: 1,
      explanation:
        "PropsWithChildren<P>는 P & { children?: ReactNode }와 같습니다. 기존 Props 타입에 선택적 children을 추가하는 유틸리티 타입입니다.",
    },
  ],
};

export default chapter;
