import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "27-react-compiler",
  subject: "react",
  title: "React Compiler",
  description: "자동 메모이제이션의 원리, 컴파일러가 하는 일, useMemo/useCallback/React.memo의 미래, 옵트인/옵트아웃, 제약 사항을 이해합니다.",
  order: 27,
  group: "성능 최적화",
  prerequisites: ["26-react-memo"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "React Compiler는 자동 절전 모드가 있는 스마트 가전과 비슷합니다.\n\n" +
        "이전에는 집의 모든 전등(컴포넌트)을 직접 꺼야 했습니다. \"이 방은 useMemo 스위치, 저 방은 useCallback 스위치, 이 방은 React.memo 스위치...\" 하나라도 빠뜨리면 전기(성능)가 낭비됩니다.\n\n" +
        "**React Compiler**는 스마트 홈 시스템입니다. 사람이 없는 방의 전등을 자동으로 끄고, 필요한 곳만 켜둡니다. 개발자가 어디에 메모이제이션을 적용할지 고민할 필요가 없습니다.\n\n" +
        "다만, 이 시스템이 제대로 동작하려면 \"집의 규칙\"(React의 규칙)을 따라야 합니다. 규칙을 어기면 자동화가 깨집니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "수동 메모이제이션에는 여러 한계가 있습니다.\n\n" +
        "1. **개발자 부담** — 어디에 useMemo/useCallback/React.memo를 적용할지 판단하는 것은 어렵고 실수하기 쉽습니다.\n" +
        "2. **일관성 없는 적용** — 한 곳이라도 빠뜨리면 체인이 끊깁니다. React.memo 컴포넌트에 useCallback 없이 함수를 전달하면 무의미합니다.\n" +
        "3. **의존성 배열 관리** — useMemo/useCallback의 의존성 배열을 정확히 관리하지 않으면 버그나 캐시 무효화가 발생합니다.\n" +
        "4. **코드 가독성 저하** — 비즈니스 로직이 메모이제이션 코드에 묻히고, 새 팀원이 이해하기 어렵습니다.\n" +
        "5. **과잉/과소 최적화** — 불필요한 곳에 적용하거나 필요한 곳을 놓치는 판단 오류가 빈번합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### React Compiler란?\n" +
        "React Compiler(이전 이름: React Forget)는 빌드 타임에 컴포넌트 코드를 분석하여 **자동으로 메모이제이션을 삽입**하는 컴파일러입니다.\n\n" +
        "### 컴파일러가 하는 일\n" +
        "1. 컴포넌트 함수의 코드를 정적 분석합니다.\n" +
        "2. 값이 변경되지 않은 경우 이전 결과를 재사용하도록 코드를 변환합니다.\n" +
        "3. JSX 요소, 객체, 배열, 함수를 자동으로 메모이제이션합니다.\n\n" +
        "### React의 규칙 (Rules of React)\n" +
        "컴파일러는 React의 규칙을 전제로 동작합니다:\n" +
        "- 컴포넌트와 Hook은 **순수**해야 합니다.\n" +
        "- 컴포넌트는 **멱등성**이 있어야 합니다 (같은 입력 → 같은 출력).\n" +
        "- props와 state는 **불변**으로 다뤄야 합니다.\n" +
        "- Hook의 반환값과 인자는 **불변**입니다.\n\n" +
        "### useMemo/useCallback/React.memo의 미래\n" +
        "컴파일러가 자동으로 처리하므로 수동 메모이제이션 코드는 점차 불필요해집니다. 단, 기존 코드에 있어도 충돌하지 않습니다.\n\n" +
        "### 옵트인/옵트아웃\n" +
        "- `'use no memo'` 지시어로 특정 컴포넌트/Hook을 컴파일 대상에서 제외할 수 있습니다.\n" +
        "- 설정 파일에서 특정 디렉토리나 파일을 포함/제외할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 컴파일러 변환 예시",
      content:
        "React Compiler가 코드를 어떻게 변환하는지 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// ===== 변환 전 (개발자가 작성한 코드) =====\n' +
          'function ProductList({ items, onSelect }: {\n' +
          '  items: Product[];\n' +
          '  onSelect: (id: string) => void;\n' +
          '}) {\n' +
          '  const sorted = items.toSorted((a, b) => a.price - b.price);\n' +
          '\n' +
          '  return (\n' +
          '    <ul>\n' +
          '      {sorted.map((item) => (\n' +
          '        <li key={item.id} onClick={() => onSelect(item.id)}>\n' +
          '          {item.name}: {item.price}원\n' +
          '        </li>\n' +
          '      ))}\n' +
          '    </ul>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ===== 변환 후 (컴파일러가 생성한 코드, 개념적) =====\n' +
          'function ProductList({ items, onSelect }: {\n' +
          '  items: Product[];\n' +
          '  onSelect: (id: string) => void;\n' +
          '}) {\n' +
          '  // 컴파일러가 자동으로 캐시 슬롯 생성\n' +
          '  const $ = useMemoCache(4); // 4개의 캐시 슬롯\n' +
          '\n' +
          '  let sorted;\n' +
          '  // items가 변경되지 않았으면 이전 정렬 결과 재사용\n' +
          '  if ($[0] !== items) {\n' +
          '    sorted = items.toSorted((a, b) => a.price - b.price);\n' +
          '    $[0] = items;\n' +
          '    $[1] = sorted;\n' +
          '  } else {\n' +
          '    sorted = $[1];\n' +
          '  }\n' +
          '\n' +
          '  let jsx;\n' +
          '  // sorted와 onSelect가 변경되지 않았으면 이전 JSX 재사용\n' +
          '  if ($[2] !== sorted || $[3] !== onSelect) {\n' +
          '    jsx = (\n' +
          '      <ul>\n' +
          '        {sorted.map((item) => (\n' +
          '          <li key={item.id} onClick={() => onSelect(item.id)}>\n' +
          '            {item.name}: {item.price}원\n' +
          '          </li>\n' +
          '        ))}\n' +
          '      </ul>\n' +
          '    );\n' +
          '    $[2] = sorted;\n' +
          '    $[3] = onSelect;\n' +
          '  } else {\n' +
          '    jsx = $[4];\n' +
          '  }\n' +
          '\n' +
          '  return jsx;\n' +
          '}\n',
        description: "컴파일러는 값의 의존성을 분석하여 변경되지 않은 값은 이전 결과를 재사용합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 컴파일러 도입과 제약 사항",
      content:
        "React Compiler를 도입하는 방법과 주의해야 할 패턴입니다.",
      code: {
        language: "typescript",
        code:
          '// ✅ 컴파일러 친화적인 코드 — 순수하고 불변\n' +
          'function GoodComponent({ items }: { items: string[] }) {\n' +
          '  // 새 배열을 만들어 반환 (불변)\n' +
          '  const filtered = items.filter((item) => item.length > 3);\n' +
          '  const sorted = filtered.toSorted();\n' +
          '\n' +
          '  return (\n' +
          '    <ul>\n' +
          '      {sorted.map((item) => (\n' +
          '        <li key={item}>{item}</li>\n' +
          '      ))}\n' +
          '    </ul>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ❌ 컴파일러가 최적화할 수 없는 코드 — 불변 규칙 위반\n' +
          'function BadComponent({ items }: { items: string[] }) {\n' +
          '  // 원본 배열을 직접 변경 (뮤테이션)\n' +
          '  items.sort(); // ❌ props를 직접 수정\n' +
          '  return <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>;\n' +
          '}\n' +
          '\n' +
          '// ❌ 컴파일러가 최적화할 수 없는 코드 — 렌더 중 부수효과\n' +
          'let globalCounter = 0;\n' +
          'function SideEffectComponent() {\n' +
          '  globalCounter++; // ❌ 렌더 중 외부 변수 수정\n' +
          '  return <p>{globalCounter}</p>;\n' +
          '}\n' +
          '\n' +
          '// ✅ 특정 컴포넌트를 컴파일 대상에서 제외\n' +
          'function LegacyComponent() {\n' +
          '  "use no memo"; // 이 컴포넌트는 컴파일러가 건드리지 않음\n' +
          '\n' +
          '  // 레거시 패턴이라 컴파일러 호환이 안 되는 경우\n' +
          '  return <div>레거시 코드</div>;\n' +
          '}\n' +
          '\n' +
          '// 컴파일러 도입 후 수동 메모이제이션이 불필요해진 예\n' +
          '// 변환 전:\n' +
          '// const memoized = useMemo(() => expensiveCalc(a, b), [a, b]);\n' +
          '// const handler = useCallback(() => doSomething(x), [x]);\n' +
          '// export default React.memo(MyComponent);\n' +
          '\n' +
          '// 변환 후: (컴파일러가 자동 처리)\n' +
          'function MyComponent({ a, b, x }: { a: number; b: number; x: string }) {\n' +
          '  const result = expensiveCalc(a, b); // 자동 메모이제이션\n' +
          '  const handler = () => doSomething(x); // 자동 메모이제이션\n' +
          '  return <div onClick={handler}>{result}</div>;\n' +
          '}\n' +
          '\n' +
          'function expensiveCalc(a: number, b: number): number {\n' +
          '  return a * b; // 실제로는 복잡한 계산\n' +
          '}\n' +
          '\n' +
          'function doSomething(x: string): void {\n' +
          '  console.log(x);\n' +
          '}\n',
        description: "React Compiler는 순수하고 불변 규칙을 따르는 코드에서 가장 효과적입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 항목 | 수동 메모이제이션 | React Compiler |\n" +
        "|------|-----------------|----------------|\n" +
        "| 적용 방식 | useMemo/useCallback/memo 수동 | 빌드 타임 자동 삽입 |\n" +
        "| 누락 위험 | 높음 | 없음 |\n" +
        "| 코드 복잡도 | 증가 | 영향 없음 |\n" +
        "| 의존성 관리 | 수동 (배열) | 자동 분석 |\n" +
        "| 전제 조건 | 없음 | React 규칙 준수 |\n\n" +
        "**핵심:** React Compiler는 개발자가 성능 최적화를 고민하지 않아도 되도록 자동 메모이제이션을 제공합니다. 다만 React의 규칙(순수성, 불변성)을 준수하는 코드에서만 안전하게 동작합니다.\n\n" +
        "**다음 챕터 미리보기:** 번들 크기를 줄이는 코드 스플리팅 전략을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "React Compiler는 useMemo/useCallback을 자동으로 삽입해주는 빌드 타임 도구다. 수동 메모이제이션의 부담을 줄이고, 성능 최적화를 컴파일러에 위임할 수 있다.",
  checklist: [
    "React Compiler가 하는 일(자동 메모이제이션)을 설명할 수 있다",
    "컴파일러가 전제하는 React 규칙을 알고 있다",
    "컴파일러가 최적화할 수 없는 코드 패턴을 식별할 수 있다",
    "'use no memo' 지시어의 용도를 이해한다",
    "수동 메모이제이션과 컴파일러 자동 메모이제이션의 차이를 비교할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "React Compiler가 자동으로 하는 일은?",
      choices: [
        "타입 체크",
        "메모이제이션 코드 삽입",
        "번들 최적화",
        "서버 컴포넌트 분리",
      ],
      correctIndex: 1,
      explanation: "React Compiler는 빌드 타임에 컴포넌트를 분석하여 값, JSX, 함수 등에 자동으로 메모이제이션 코드를 삽입합니다.",
    },
    {
      id: "q2",
      question: "React Compiler가 제대로 동작하기 위한 전제 조건이 아닌 것은?",
      choices: [
        "컴포넌트가 순수해야 한다",
        "props와 state를 불변으로 다뤄야 한다",
        "모든 컴포넌트에 TypeScript를 사용해야 한다",
        "Hook의 반환값을 직접 수정하면 안 된다",
      ],
      correctIndex: 2,
      explanation: "React Compiler는 JavaScript와 TypeScript 모두에서 동작합니다. TypeScript는 필수가 아닙니다.",
    },
    {
      id: "q3",
      question: "컴파일러가 최적화할 수 없는 코드 패턴은?",
      choices: [
        "배열의 filter + map 체인",
        "props에서 구조 분해 할당",
        "렌더 중 전역 변수를 직접 수정하는 코드",
        "조건부 렌더링",
      ],
      correctIndex: 2,
      explanation: "전역 변수 수정은 부수효과이므로 컴파일러가 안전하게 메모이제이션할 수 없습니다. 같은 입력에 같은 출력이 보장되지 않기 때문입니다.",
    },
    {
      id: "q4",
      question: "'use no memo' 지시어의 용도는?",
      choices: [
        "수동 메모이제이션을 강제한다",
        "해당 컴포넌트를 컴파일러 최적화 대상에서 제외한다",
        "모든 메모이제이션을 비활성화한다",
        "컴파일러 경고를 무시한다",
      ],
      correctIndex: 1,
      explanation: "'use no memo'는 특정 컴포넌트나 Hook이 컴파일러 호환이 안 될 때 해당 코드를 최적화 대상에서 제외합니다.",
    },
    {
      id: "q5",
      question: "React Compiler 도입 후 기존의 useMemo/useCallback 코드는?",
      choices: [
        "반드시 제거해야 한다",
        "에러가 발생한다",
        "그대로 두어도 충돌하지 않는다",
        "자동으로 제거된다",
      ],
      correctIndex: 2,
      explanation: "기존의 수동 메모이제이션 코드는 그대로 두어도 컴파일러와 충돌하지 않습니다. 컴파일러가 추가적인 최적화를 적용합니다.",
    },
    {
      id: "q6",
      question: "React Compiler의 메모이제이션 방식은?",
      choices: [
        "런타임에 동적으로 판단",
        "빌드 타임에 정적 분석하여 코드 변환",
        "가상 DOM 비교 시 적용",
        "서버에서 미리 계산",
      ],
      correctIndex: 1,
      explanation: "React Compiler는 빌드 타임에 코드를 정적으로 분석하여 의존성을 파악하고, 메모이제이션 코드를 삽입하는 방식으로 동작합니다.",
    },
  ],
};

export default chapter;
