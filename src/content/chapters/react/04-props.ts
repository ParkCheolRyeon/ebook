import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "04-props",
  subject: "react",
  title: "Props",
  description:
    "단방향 데이터 흐름, children, defaultProps, spread props, TypeScript와 Props 타이핑을 학습합니다.",
  order: 4,
  group: "기초",
  prerequisites: ["03-components"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Props는 **택배 상자**와 같습니다.\n\n" +
        "부모 컴포넌트가 자식 컴포넌트에게 택배(데이터)를 보냅니다. 자식은 받은 택배를 열어서 사용할 수 있지만, **택배 내용물을 변경하거나 발신자에게 되돌려 보낼 수는 없습니다**. 이것이 단방향 데이터 흐름입니다.\n\n" +
        "JS에서 함수의 매개변수(parameter)처럼(JS 복습), React의 props도 컴포넌트가 외부에서 받는 입력값입니다. 함수가 인자를 변경하지 않듯, 컴포넌트도 props를 읽기 전용으로 취급해야 합니다.\n\n" +
        "**children**은 택배 상자 안에 또 다른 상자를 넣는 것입니다. 바깥 상자(부모 컴포넌트)는 안에 무엇이 들어있든 그대로 전달합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "컴포넌트를 재사용하려면 동적인 데이터를 외부에서 주입할 수 있어야 합니다.\n\n" +
        "1. **하드코딩된 컴포넌트** — 데이터가 내부에 고정되면 재사용이 불가능합니다\n" +
        "2. **데이터 흐름 예측 불가** — 양방향 바인딩은 데이터가 어디서 변경되었는지 추적하기 어렵습니다\n" +
        "3. **타입 안전성 부재** — props에 잘못된 타입의 값을 전달해도 런타임까지 알 수 없습니다\n" +
        "4. **기본값 처리** — 선택적 props에 대한 기본값을 일관되게 처리하는 방법이 필요합니다",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "React의 Props 시스템이 이 문제들을 해결합니다.\n\n" +
        "### 단방향 데이터 흐름\n" +
        "데이터는 항상 부모 → 자식 방향으로만 흐릅니다. 자식이 부모에게 알려야 할 때는 부모가 콜백 함수를 props로 전달합니다.\n\n" +
        "### Props는 읽기 전용\n" +
        "컴포넌트는 자신의 props를 절대 수정해서는 안 됩니다. 같은 props를 받으면 항상 같은 결과를 반환하는 순수 함수처럼 동작해야 합니다.\n\n" +
        "### TypeScript와 Props 타이핑\n" +
        "interface 또는 type으로 props의 타입을 명시하면, 잘못된 props 전달을 컴파일 타임에 감지할 수 있습니다.\n\n" +
        "### 기본값 처리\n" +
        "ES6 기본 매개변수 구문으로 기본값을 설정합니다. `defaultProps`는 더 이상 권장되지 않습니다(React 19에서 deprecated).\n\n" +
        "### Spread Props\n" +
        "객체 전개 구문으로 여러 props를 한 번에 전달할 수 있습니다. 단, 의도하지 않은 props까지 전달될 수 있으므로 주의가 필요합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Props 패턴들",
      content:
        "다양한 Props 활용 패턴을 TypeScript와 함께 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          'import { type ReactNode } from "react";\n' +
          '\n' +
          '// === Props 타입 정의 ===\n' +
          'interface ButtonProps {\n' +
          '  label: string;\n' +
          '  variant?: "primary" | "secondary"; // 선택적 prop\n' +
          '  disabled?: boolean;\n' +
          '  onClick: () => void;                // 콜백 prop\n' +
          '  children?: ReactNode;               // children 타입\n' +
          '}\n' +
          '\n' +
          '// === 기본값: ES6 기본 매개변수 사용 ===\n' +
          'function Button({\n' +
          '  label,\n' +
          '  variant = "primary",   // 기본값 설정\n' +
          '  disabled = false,\n' +
          '  onClick,\n' +
          '  children,\n' +
          '}: ButtonProps) {\n' +
          '  return (\n' +
          '    <button\n' +
          '      disabled={disabled}\n' +
          '      data-variant={variant}\n' +
          '      onClick={onClick}\n' +
          '    >\n' +
          '      {children ?? label}\n' +
          '    </button>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === 단방향 데이터 흐름: 콜백으로 부모에게 알림 ===\n' +
          'function Parent() {\n' +
          '  const handleClick = () => {\n' +
          '    console.log("자식에서 클릭됨!");\n' +
          '  };\n' +
          '\n' +
          '  // 부모 → 자식: 데이터 + 콜백 전달\n' +
          '  return <Button label="확인" onClick={handleClick} />;\n' +
          '}\n' +
          '\n' +
          '// === Spread Props ===\n' +
          'interface InputProps {\n' +
          '  label: string;\n' +
          '  inputProps: React.ComponentProps<"input">;\n' +
          '}\n' +
          '\n' +
          'function LabeledInput({ label, inputProps }: InputProps) {\n' +
          '  return (\n' +
          '    <label>\n' +
          '      {label}\n' +
          '      <input {...inputProps} />\n' +
          '    </label>\n' +
          '  );\n' +
          '}',
        description:
          "TypeScript로 props를 타이핑하면 컴파일 타임에 타입 안전성을 확보할 수 있습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Props 패턴 종합",
      content:
        "실제 프로젝트에서 자주 사용되는 Props 패턴을 종합적으로 연습합니다.",
      code: {
        language: "typescript",
        code:
          'import { type ReactNode } from "react";\n' +
          '\n' +
          '// === children으로 합성하기 ===\n' +
          'function Section({\n' +
          '  title,\n' +
          '  children,\n' +
          '}: {\n' +
          '  title: string;\n' +
          '  children: ReactNode;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <section>\n' +
          '      <h2>{title}</h2>\n' +
          '      {children}\n' +
          '    </section>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === 제네릭 Props ===\n' +
          'interface ListProps<T> {\n' +
          '  items: T[];\n' +
          '  renderItem: (item: T) => ReactNode;\n' +
          '}\n' +
          '\n' +
          'function List<T>({ items, renderItem }: ListProps<T>) {\n' +
          '  return <ul>{items.map(renderItem)}</ul>;\n' +
          '}\n' +
          '\n' +
          '// === 사용 예시 ===\n' +
          'interface User {\n' +
          '  id: string;\n' +
          '  name: string;\n' +
          '}\n' +
          '\n' +
          'function App() {\n' +
          '  const users: User[] = [\n' +
          '    { id: "1", name: "Alice" },\n' +
          '    { id: "2", name: "Bob" },\n' +
          '  ];\n' +
          '\n' +
          '  return (\n' +
          '    <Section title="사용자 목록">\n' +
          '      <List\n' +
          '        items={users}\n' +
          '        renderItem={(user) => <li key={user.id}>{user.name}</li>}\n' +
          '      />\n' +
          '    </Section>\n' +
          '  );\n' +
          '}',
        description:
          "children, 제네릭 props, render prop 패턴을 활용하면 높은 재사용성을 달성할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| 단방향 데이터 흐름 | 부모 → 자식으로만 데이터 전달, 역방향은 콜백 사용 |\n" +
        "| 읽기 전용 | props를 컴포넌트 내부에서 변경하면 안 됨 |\n" +
        "| children | 태그 사이의 내용을 전달받는 특별한 prop |\n" +
        "| 기본값 | ES6 기본 매개변수 사용 (defaultProps는 deprecated) |\n" +
        "| TypeScript 타이핑 | interface/type으로 props 타입 명시 |\n\n" +
        "**핵심:** Props는 컴포넌트의 외부 인터페이스입니다. TypeScript로 타이핑하고, 단방향 흐름을 유지하세요.\n\n" +
        "**다음 챕터 미리보기:** 컴포넌트 내부에서 관리하는 동적 데이터인 State와 useState를 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "단방향 데이터 흐름의 의미를 설명할 수 있다",
    "콜백 함수를 props로 전달하여 자식→부모 통신을 구현할 수 있다",
    "TypeScript로 props 타입을 정의할 수 있다",
    "children prop의 용도를 설명할 수 있다",
    "spread props의 장단점을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "React에서 자식 컴포넌트가 부모에게 데이터를 전달하는 방법은?",
      choices: [
        "props를 직접 수정한다",
        "부모가 전달한 콜백 함수를 호출한다",
        "전역 변수를 사용한다",
        "자식에서 부모의 state를 직접 변경한다",
      ],
      correctIndex: 1,
      explanation:
        "React의 단방향 데이터 흐름에서, 자식이 부모에게 알리려면 부모가 props로 전달한 콜백 함수를 호출합니다.",
    },
    {
      id: "q2",
      question: "React 19에서 props 기본값을 설정하는 권장 방법은?",
      choices: [
        "defaultProps 정적 프로퍼티",
        "ES6 기본 매개변수 구문",
        "getDefaultProps 메서드",
        "propTypes.defaultValue",
      ],
      correctIndex: 1,
      explanation:
        "React 19에서 defaultProps는 함수 컴포넌트에서 deprecated되었습니다. ES6 기본 매개변수 구문을 사용하는 것이 권장됩니다.",
    },
    {
      id: "q3",
      question: "다음 중 props에 대한 설명으로 틀린 것은?",
      choices: [
        "읽기 전용이다",
        "부모에서 자식으로 전달된다",
        "컴포넌트 내부에서 수정할 수 있다",
        "함수도 props로 전달할 수 있다",
      ],
      correctIndex: 2,
      explanation:
        "props는 읽기 전용입니다. 컴포넌트는 자신의 props를 절대 수정해서는 안 됩니다. 순수 함수처럼 동일한 props에 동일한 결과를 반환해야 합니다.",
    },
    {
      id: "q4",
      question: "children prop의 타입으로 가장 적합한 것은?",
      choices: [
        "string",
        "JSX.Element",
        "ReactNode",
        "HTMLElement",
      ],
      correctIndex: 2,
      explanation:
        "ReactNode는 string, number, JSX.Element, null, undefined, 배열 등 렌더링 가능한 모든 타입을 포함합니다. children의 타입으로 가장 범용적입니다.",
    },
    {
      id: "q5",
      question: "spread props (<Component {...obj} />)의 주의사항은?",
      choices: [
        "TypeScript에서 사용할 수 없다",
        "성능이 크게 저하된다",
        "의도하지 않은 props까지 전달될 수 있다",
        "children이 무시된다",
      ],
      correctIndex: 2,
      explanation:
        "spread props는 객체의 모든 속성을 props로 전달하므로, 불필요하거나 의도하지 않은 속성까지 전달될 수 있어 주의가 필요합니다.",
    },
  ],
};

export default chapter;
