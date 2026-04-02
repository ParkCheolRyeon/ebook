import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "30-react-advanced-patterns",
  subject: "typescript",
  title: "제네릭 컴포넌트와 고급 패턴",
  description:
    "Polymorphic component, render props, HOC 타이핑, discriminated union props 등 React + TypeScript 고급 패턴을 학습합니다.",
  order: 30,
  group: "React + TypeScript",
  prerequisites: ["29-react-event-types"],
  estimatedMinutes: 40,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "React 고급 타이핑 패턴은 **레고 블록 시스템**과 같습니다.\n\n" +
        "**제네릭 컴포넌트**는 범용 레고 블록입니다. 같은 블록 틀(컴포넌트)이지만, 어떤 색상(타입)의 블록을 끼우느냐에 따라 다른 결과물이 됩니다. JSX에서 `<T,>`처럼 trailing comma를 붙이는 것은 레고의 연결부가 '제네릭용'임을 표시하는 것과 같습니다.\n\n" +
        "**Polymorphic component**는 **변신 블록**입니다. 기본은 `div`지만, `as='button'`이라고 하면 버튼으로 변신합니다. 변신할 때마다 해당 요소의 모든 속성(onClick, href 등)이 자동으로 달라지죠. 이것을 타입으로 표현하면, `as` prop에 따라 나머지 props의 타입이 동적으로 결정됩니다.\n\n" +
        "**Discriminated union props**는 **상호 배타적 설명서**입니다. '전기 모드'일 때는 전기 관련 부품만, '수동 모드'일 때는 수동 관련 부품만 사용합니다. `variant: 'link'`이면 `href`가 필수이고, `variant: 'button'`이면 `onClick`이 필수인 것처럼, 모드에 따라 필요한 props가 달라지는 패턴을 타입으로 강제합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React 컴포넌트 라이브러리를 만들 때 마주치는 고급 타이핑 문제들입니다.\n\n" +
        "**1. 제네릭 컴포넌트의 JSX 모호성**\n" +
        "`.tsx` 파일에서 `<T>`는 JSX 태그로 해석됩니다. `function Select<T>(props: Props<T>)`라고 쓰면 컴파일러가 `<T>`를 HTML 태그로 오인합니다. 이 문제를 해결하는 표준 방법이 필요합니다.\n\n" +
        "**2. Polymorphic component의 타입 안전성**\n" +
        "`<Box as='a' href='/home'>`처럼 `as` prop에 따라 허용되는 props가 달라져야 합니다. `as='button'`인데 `href`를 전달하면 에러가 나야 하고, `as='a'`인데 `onClick` 대신 `href`가 자동완성되어야 합니다.\n\n" +
        "**3. 상호 배타적 Props**\n" +
        "`loading`이 `true`일 때는 `data`가 없고, `false`일 때는 `data`가 있어야 합니다. 단순 optional props로는 이런 관계를 표현할 수 없어서, 잘못된 조합이 가능해집니다.\n\n" +
        "**4. HOC의 타입 전달**\n" +
        "Higher-Order Component가 원본 컴포넌트의 props를 올바르게 전달하면서, 추가/제거 props를 타입 안전하게 처리하는 것이 까다롭습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "각 문제를 해결하는 TypeScript 패턴을 알아봅시다.\n\n" +
        "### 제네릭 컴포넌트: trailing comma\n" +
        "`.tsx` 파일에서 `<T,>`(trailing comma)로 JSX 태그와의 모호성을 해결합니다. `function List<T,>(props: ListProps<T>)`처럼 사용합니다. `<T extends unknown>`도 가능하지만 trailing comma가 더 간결합니다.\n\n" +
        "### Polymorphic component: as prop\n" +
        "`as` prop의 타입을 `React.ElementType`으로 정의하고, `React.ComponentPropsWithoutRef<C>`로 해당 요소의 props를 동적으로 가져옵니다. 커스텀 props와의 충돌을 `Omit`으로 제거합니다.\n\n" +
        "### Discriminated Union Props\n" +
        "상호 배타적 props 조합을 유니온 타입으로 정의합니다. 각 variant에 필수/금지 props를 명확히 지정하여, 잘못된 조합을 컴파일 타임에 차단합니다.\n\n" +
        "### HOC 타이핑\n" +
        "제네릭 함수로 HOC를 정의하고, 원본 컴포넌트의 props에서 주입하는 props를 `Omit`으로 제거한 나머지를 외부에 노출합니다. `ComponentPropsWithoutRef`로 ref 전달도 처리할 수 있습니다.\n\n" +
        "### 타입 안전 Context + useReducer\n" +
        "Context에 dispatch 함수를 포함하고, 액션 타입을 discriminated union으로 정의하면, 전역 상태 관리에서도 완전한 타입 안전성을 확보할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 제네릭 컴포넌트와 Polymorphic component",
      content:
        "trailing comma로 제네릭 컴포넌트를 정의하고, as prop으로 polymorphic component를 구현하는 핵심 패턴을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          "import {\n" +
          "  type ReactNode,\n" +
          "  type ElementType,\n" +
          "  type ComponentPropsWithoutRef\n" +
          "} from 'react';\n" +
          "\n" +
          "// ===== 제네릭 컴포넌트: trailing comma =====\n" +
          "interface ListProps<T> {\n" +
          "  items: T[];\n" +
          "  renderItem: (item: T, index: number) => ReactNode;\n" +
          "  keyExtractor: (item: T) => string;\n" +
          "  onSelect?: (item: T) => void;\n" +
          "}\n" +
          "\n" +
          "// <T,> trailing comma로 JSX 모호성 해결\n" +
          "function List<T,>({\n" +
          "  items,\n" +
          "  renderItem,\n" +
          "  keyExtractor,\n" +
          "  onSelect,\n" +
          "}: ListProps<T>) {\n" +
          "  return (\n" +
          "    <ul>\n" +
          "      {items.map((item, index) => (\n" +
          "        <li key={keyExtractor(item)} onClick={() => onSelect?.(item)}>\n" +
          "          {renderItem(item, index)}\n" +
          "        </li>\n" +
          "      ))}\n" +
          "    </ul>\n" +
          "  );\n" +
          "}\n" +
          "\n" +
          "// 사용: T가 자동 추론됨\n" +
          "interface User { id: string; name: string; role: string; }\n" +
          "const users: User[] = [];\n" +
          "\n" +
          "<List\n" +
          "  items={users}\n" +
          "  renderItem={(user) => <span>{user.name}</span>}  // user: User\n" +
          "  keyExtractor={(user) => user.id}\n" +
          "  onSelect={(user) => console.log(user.role)}       // user: User\n" +
          "/>\n" +
          "\n" +
          "// ===== Polymorphic Component: as prop =====\n" +
          "type BoxProps<C extends ElementType> = {\n" +
          "  as?: C;\n" +
          "  children?: ReactNode;\n" +
          "} & Omit<ComponentPropsWithoutRef<C>, 'as' | 'children'>;\n" +
          "\n" +
          "function Box<C extends ElementType = 'div'>({\n" +
          "  as,\n" +
          "  children,\n" +
          "  ...rest\n" +
          "}: BoxProps<C>) {\n" +
          "  const Component = as || 'div';\n" +
          "  return <Component {...rest}>{children}</Component>;\n" +
          "}\n" +
          "\n" +
          "// 사용: as에 따라 props가 달라짐\n" +
          "<Box>기본 div</Box>\n" +
          "<Box as=\"a\" href=\"/home\">링크</Box>\n" +
          "<Box as=\"button\" onClick={() => {}}>버튼</Box>\n" +
          "// <Box as=\"a\" onClick={() => {}}>  // ✅ a에도 onClick 있음\n" +
          "// <Box as=\"button\" href=\"/home\">   // ❌ button에 href 없음",
        description:
          "제네릭 컴포넌트는 <T,>(trailing comma)로 JSX 모호성을 해결합니다. Polymorphic component는 as prop의 타입에 따라 나머지 props가 동적으로 결정됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Discriminated Union Props와 고급 패턴",
      content:
        "상호 배타적 props, render props 타이핑, HOC 타이핑 등 실무에서 마주치는 고급 패턴을 구현합니다.",
      code: {
        language: "typescript",
        code:
          "import { type ReactNode, type ComponentType } from 'react';\n" +
          "\n" +
          "// ===== Discriminated Union Props =====\n" +
          "// 상호 배타적 props: variant에 따라 필요한 props가 다름\n" +
          "type ButtonProps =\n" +
          "  | {\n" +
          "      variant: 'link';\n" +
          "      href: string;\n" +
          "      target?: '_blank' | '_self';\n" +
          "      onClick?: never;  // link일 때 onClick 금지\n" +
          "    }\n" +
          "  | {\n" +
          "      variant: 'button';\n" +
          "      onClick: () => void;\n" +
          "      href?: never;     // button일 때 href 금지\n" +
          "      target?: never;\n" +
          "    }\n" +
          "  | {\n" +
          "      variant: 'submit';\n" +
          "      formId: string;\n" +
          "      onClick?: never;\n" +
          "      href?: never;\n" +
          "    };\n" +
          "\n" +
          "function ActionButton(props: ButtonProps & { children: ReactNode }) {\n" +
          "  switch (props.variant) {\n" +
          "    case 'link':\n" +
          "      return <a href={props.href} target={props.target}>{props.children}</a>;\n" +
          "    case 'button':\n" +
          "      return <button onClick={props.onClick}>{props.children}</button>;\n" +
          "    case 'submit':\n" +
          "      return <button type=\"submit\" form={props.formId}>{props.children}</button>;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// ✅ 올바른 사용\n" +
          "<ActionButton variant=\"link\" href=\"/home\">홈</ActionButton>\n" +
          "<ActionButton variant=\"button\" onClick={() => {}}>클릭</ActionButton>\n" +
          "// ❌ 컴파일 에러: link인데 onClick 전달\n" +
          "// <ActionButton variant=\"link\" href=\"/\" onClick={() => {}}>에러</ActionButton>\n" +
          "\n" +
          "// ===== 로딩 상태 Discriminated Union =====\n" +
          "type AsyncState<T> =\n" +
          "  | { status: 'idle' }\n" +
          "  | { status: 'loading' }\n" +
          "  | { status: 'success'; data: T }\n" +
          "  | { status: 'error'; error: Error };\n" +
          "\n" +
          "interface AsyncRendererProps<T> {\n" +
          "  state: AsyncState<T>;\n" +
          "  renderData: (data: T) => ReactNode;\n" +
          "  renderError?: (error: Error) => ReactNode;\n" +
          "}\n" +
          "\n" +
          "function AsyncRenderer<T,>({\n" +
          "  state,\n" +
          "  renderData,\n" +
          "  renderError,\n" +
          "}: AsyncRendererProps<T>) {\n" +
          "  switch (state.status) {\n" +
          "    case 'idle':\n" +
          "      return null;\n" +
          "    case 'loading':\n" +
          "      return <div>로딩 중...</div>;\n" +
          "    case 'success':\n" +
          "      return <>{renderData(state.data)}</>;\n" +
          "    case 'error':\n" +
          "      return renderError?.(state.error) ?? <div>에러 발생</div>;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// ===== HOC 타이핑 =====\n" +
          "interface WithLoadingProps {\n" +
          "  isLoading: boolean;\n" +
          "}\n" +
          "\n" +
          "function withLoading<P extends object>(\n" +
          "  WrappedComponent: ComponentType<P>\n" +
          ") {\n" +
          "  return function WithLoadingComponent(\n" +
          "    props: P & WithLoadingProps\n" +
          "  ) {\n" +
          "    const { isLoading, ...rest } = props;\n" +
          "    if (isLoading) return <div>로딩 중...</div>;\n" +
          "    return <WrappedComponent {...(rest as P)} />;\n" +
          "  };\n" +
          "}",
        description:
          "Discriminated union props로 상호 배타적 조합을 강제하고, never 타입으로 금지할 props를 명시합니다. HOC는 제네릭으로 원본 props를 전달합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 핵심 기법 | 사용 시점 |\n" +
        "|------|----------|----------|\n" +
        "| 제네릭 컴포넌트 | `<T,>` trailing comma | 범용 리스트, 셀렉트 |\n" +
        "| Polymorphic | `as` + ComponentPropsWithoutRef | UI 라이브러리 |\n" +
        "| Discriminated Union | variant + never | 상호 배타적 props |\n" +
        "| HOC | 제네릭 함수 + Omit | 횡단 관심사 |\n" +
        "| Render Props | 함수 prop의 제네릭 | 로직 재사용 |\n\n" +
        "**핵심:** 제네릭 컴포넌트는 `<T,>`(trailing comma)로 JSX와의 모호성을 해결합니다. `as` prop으로 polymorphic component를 만들고, discriminated union으로 상호 배타적인 props 조합을 타입 안전하게 강제할 수 있습니다. 이러한 패턴들은 Chakra UI, Headless UI 등의 컴포넌트 라이브러리에서 실제로 사용됩니다.\n\n" +
        "**다음 챕터 미리보기:** tsconfig.json 설정을 학습합니다. 컴파일러 옵션, path alias, strict 모드 등 프로젝트 설정의 모든 것을 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "제네릭 컴포넌트는 <T,>(trailing comma)로 JSX와의 모호성을 해결한다. as prop으로 polymorphic component를 만들고, discriminated union으로 상호 배타적인 props 조합을 타입 안전하게 강제할 수 있다.",
  checklist: [
    "제네릭 컴포넌트에서 <T,> trailing comma의 역할을 설명할 수 있다",
    "Polymorphic component의 as prop 패턴을 구현할 수 있다",
    "Discriminated union props로 상호 배타적 조합을 강제할 수 있다",
    "HOC의 타입을 제네릭으로 안전하게 정의할 수 있다",
    "never 타입으로 특정 props를 금지하는 패턴을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: ".tsx 파일에서 제네릭 컴포넌트의 타입 매개변수 <T>가 JSX 태그로 오인되는 문제의 해결법은?",
      choices: [
        "<T extends any>로 작성",
        "<T,>(trailing comma)로 작성",
        ".ts 파일에서만 작성",
        "타입 단언으로 해결",
      ],
      correctIndex: 1,
      explanation:
        "<T,>(trailing comma)는 TSX 파서에게 이것이 JSX 태그가 아닌 제네릭 타입 매개변수임을 알려줍니다. <T extends unknown>도 가능하지만 trailing comma가 더 간결합니다.",
    },
    {
      id: "q2",
      question: "Polymorphic component에서 as prop의 타입으로 적합한 것은?",
      choices: [
        "string",
        "React.ElementType",
        "React.ComponentType",
        "keyof JSX.IntrinsicElements",
      ],
      correctIndex: 1,
      explanation:
        "React.ElementType은 HTML 태그 문자열('div', 'button')과 React 컴포넌트 타입을 모두 포함합니다. ComponentType은 React 컴포넌트만 허용하고, keyof JSX.IntrinsicElements는 HTML 태그만 허용합니다.",
    },
    {
      id: "q3",
      question: "Discriminated union props에서 특정 prop을 금지할 때 사용하는 타입은?",
      choices: [
        "undefined",
        "void",
        "never",
        "null",
      ],
      correctIndex: 2,
      explanation:
        "never 타입은 어떤 값도 할당할 수 없으므로, prop을 never로 지정하면 해당 prop의 사용을 완전히 금지합니다. 예: variant: 'link'일 때 onClick?: never로 설정합니다.",
    },
    {
      id: "q4",
      question: "ComponentPropsWithoutRef<'button'>이 ComponentProps<'button'>과 다른 점은?",
      choices: [
        "차이가 없다",
        "ref prop을 제외한다",
        "children prop을 제외한다",
        "이벤트 핸들러를 제외한다",
      ],
      correctIndex: 1,
      explanation:
        "ComponentPropsWithoutRef는 ref prop을 제외한 나머지 props를 추출합니다. Polymorphic component에서 ref 충돌을 방지하기 위해 사용합니다.",
    },
    {
      id: "q5",
      question: "HOC에서 원본 컴포넌트의 props 타입을 유지하기 위해 사용하는 패턴은?",
      choices: [
        "any 타입으로 캐스팅",
        "제네릭 함수로 P extends object 제약",
        "Props를 하드코딩",
        "typeof로 런타임 추론",
      ],
      correctIndex: 1,
      explanation:
        "HOC를 제네릭 함수 function withX<P extends object>(Component: ComponentType<P>)로 정의하면, 감싸는 컴포넌트의 props 타입 P가 보존되어 외부에서 올바른 타입 검사가 수행됩니다.",
    },
  ],
};

export default chapter;
