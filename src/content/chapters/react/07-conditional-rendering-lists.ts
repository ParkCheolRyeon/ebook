import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "07-conditional-rendering-lists",
  subject: "react",
  title: "조건부 렌더링과 리스트",
  description:
    "&&, 삼항, early return, key의 역할, 재조정과 key, index key 문제를 학습합니다.",
  order: 7,
  group: "기초",
  prerequisites: ["06-event-handling"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "조건부 렌더링은 **메뉴판**과 같습니다.\n\n" +
        "점심 메뉴와 저녁 메뉴가 다르듯, 조건(시간대)에 따라 보여주는 UI가 달라집니다. React에서는 if, &&, 삼항 연산자로 이를 구현합니다.\n\n" +
        "리스트 렌더링에서 **key**는 **학생 출석부의 학번**입니다. 이름은 같을 수 있지만 학번은 고유합니다. React는 key로 각 항목을 식별하여 '누가 추가되었고, 누가 삭제되었고, 누가 이동했는지' 파악합니다.\n\n" +
        "JS에서 배열의 map, filter(JS 복습)를 이미 배웠습니다. React에서도 동일하게 배열을 변환하여 JSX 리스트를 만듭니다. 다만 React는 각 요소를 구분하기 위해 key가 반드시 필요합니다.\n\n" +
        "**index를 key로 사용하면** 출석부에 '순번'만 적는 것과 같습니다. 전학생이 오면 모든 번호가 밀려서 React가 혼란에 빠집니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "동적 UI에서 조건부 표시와 리스트는 가장 흔한 패턴이지만 함정이 많습니다.\n\n" +
        "1. **&& 연산자의 falsy 함정** — `count && <span>{count}</span>`에서 count가 0이면 화면에 `0`이 렌더링됩니다\n" +
        "2. **key 없는 리스트** — key가 없으면 React가 효율적으로 재조정할 수 없어 성능 저하 및 버그 발생\n" +
        "3. **index를 key로 사용** — 항목이 추가/삭제/재정렬되면 잘못된 컴포넌트와 매칭되어 상태 버그 발생\n" +
        "4. **복잡한 조건 로직** — 중첩된 삼항 연산자는 가독성을 크게 해칩니다",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 조건부 렌더링 패턴\n\n" +
        "**삼항 연산자** — 두 가지 중 하나를 선택:\n" +
        "`{isLoggedIn ? <Dashboard /> : <Login />}`\n\n" +
        "**&& 연산자** — 조건이 참일 때만 표시 (falsy 주의!):\n" +
        "`{items.length > 0 && <List items={items} />}`\n" +
        "주의: `{count && ...}` 대신 `{count > 0 && ...}` 사용\n\n" +
        "**early return** — 컴포넌트 자체를 조건부로 반환:\n" +
        "`if (isLoading) return <Spinner />;`\n\n" +
        "### key의 역할\n" +
        "key는 React의 재조정 알고리즘이 리스트 항목을 식별하는 데 사용하는 힌트입니다.\n\n" +
        "**좋은 key**: 데이터의 고유 ID (`item.id`, `user.email`)\n" +
        "**나쁜 key**: 배열 인덱스 — 삽입/삭제/재정렬 시 잘못된 매칭 발생\n\n" +
        "### key와 컴포넌트 초기화\n" +
        "key가 변경되면 React는 해당 컴포넌트를 **완전히 새로 생성**합니다. 이를 활용하면 상태를 리셋할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 조건부 렌더링과 key",
      content:
        "다양한 조건부 렌더링 패턴과 key의 올바른 사용법을 코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          'import { useState } from "react";\n' +
          '\n' +
          '// === 조건부 렌더링 패턴 ===\n' +
          'interface StatusProps {\n' +
          '  isLoading: boolean;\n' +
          '  error: string | null;\n' +
          '  data: string[] | null;\n' +
          '}\n' +
          '\n' +
          'function DataDisplay({ isLoading, error, data }: StatusProps) {\n' +
          '  // early return — 가장 먼저 예외 상황 처리\n' +
          '  if (isLoading) return <p>로딩 중...</p>;\n' +
          '  if (error) return <p>에러: {error}</p>;\n' +
          '  if (!data) return null; // 아무것도 렌더링하지 않음\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      {/* && 연산자 — data.length가 0이면 "0"이 표시되므로 > 0 비교 */}\n' +
          '      {data.length > 0 && <p>{data.length}개 항목</p>}\n' +
          '\n' +
          '      {/* 삼항 연산자 — 두 가지 중 선택 */}\n' +
          '      {data.length > 0\n' +
          '        ? <ul>{data.map(item => <li key={item}>{item}</li>)}</ul>\n' +
          '        : <p>데이터가 없습니다.</p>\n' +
          '      }\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === && 연산자의 falsy 함정 ===\n' +
          'function FalsyTrap({ count }: { count: number }) {\n' +
          '  return (\n' +
          '    <div>\n' +
          '      {/* ❌ count가 0이면 화면에 "0"이 표시됨 */}\n' +
          '      {/* {count && <span>{count}개</span>} */}\n' +
          '\n' +
          '      {/* ✅ 명시적 비교 */}\n' +
          '      {count > 0 && <span>{count}개</span>}\n' +
          '\n' +
          '      {/* ✅ 또는 Boolean 변환 */}\n' +
          '      {!!count && <span>{count}개</span>}\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "early return, 삼항, && 패턴을 상황에 맞게 선택하고, && 연산자의 falsy 함정을 주의합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: key와 재조정",
      content:
        "key가 리스트 재조정에 미치는 영향과, key를 활용한 컴포넌트 초기화를 연습합니다.",
      code: {
        language: "typescript",
        code:
          'import { useState } from "react";\n' +
          '\n' +
          'interface Item {\n' +
          '  id: string;\n' +
          '  text: string;\n' +
          '}\n' +
          '\n' +
          '// === 올바른 key 사용 ===\n' +
          'function TodoList() {\n' +
          '  const [items, setItems] = useState<Item[]>([\n' +
          '    { id: "a", text: "첫 번째" },\n' +
          '    { id: "b", text: "두 번째" },\n' +
          '    { id: "c", text: "세 번째" },\n' +
          '  ]);\n' +
          '\n' +
          '  const addToFront = () => {\n' +
          '    setItems(prev => [\n' +
          '      { id: crypto.randomUUID(), text: "새 항목" },\n' +
          '      ...prev,\n' +
          '    ]);\n' +
          '  };\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <button onClick={addToFront}>맨 앞에 추가</button>\n' +
          '      <ul>\n' +
          '        {/* ✅ 고유 ID를 key로 — 앞에 삽입해도 기존 항목 재사용 */}\n' +
          '        {items.map(item => (\n' +
          '          <li key={item.id}>\n' +
          '            <input defaultValue={item.text} />\n' +
          '          </li>\n' +
          '        ))}\n' +
          '\n' +
          '        {/* ❌ index를 key로 — 앞에 삽입하면 모든 input 값이 어긋남 */}\n' +
          '        {/* items.map((item, index) => (\n' +
          '          <li key={index}>\n' +
          '            <input defaultValue={item.text} />\n' +
          '          </li>\n' +
          '        )) */}\n' +
          '      </ul>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === key로 컴포넌트 상태 리셋 ===\n' +
          'function EditProfile({ userId }: { userId: string }) {\n' +
          '  const [name, setName] = useState("");\n' +
          '  // userId가 바뀌어도 name 상태가 유지되는 문제\n' +
          '  return <input value={name} onChange={e => setName(e.target.value)} />;\n' +
          '}\n' +
          '\n' +
          'function ProfilePage() {\n' +
          '  const [userId, setUserId] = useState("user-1");\n' +
          '\n' +
          '  // ✅ key={userId}로 userId 변경 시 컴포넌트 완전 재생성\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <button onClick={() => setUserId("user-2")}>사용자 전환</button>\n' +
          '      <EditProfile key={userId} userId={userId} />\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "고유 ID를 key로 사용하면 리스트 변경 시 정확한 재조정이 이루어지고, key 변경으로 컴포넌트를 리셋할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 용도 | 주의사항 |\n" +
        "|------|------|----------|\n" +
        "| 삼항 연산자 | A 또는 B 선택 | 중첩 시 가독성 저하 |\n" +
        "| && 연산자 | 조건부 표시 | falsy 값(0, '')이 렌더링됨 |\n" +
        "| early return | 예외 상황 먼저 처리 | — |\n" +
        "| key (고유 ID) | 리스트 항목 식별 | 권장 |\n" +
        "| key (index) | 정적 리스트에만 | 삽입/삭제/재정렬 시 버그 |\n\n" +
        "**핵심:** && 연산자는 falsy 함정을 주의하고, 리스트의 key에는 항상 데이터의 고유 ID를 사용하세요. index key는 최후의 수단입니다.\n\n" +
        "**다음 챕터 미리보기:** 폼 처리와 React 19의 새로운 Actions 패턴을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "삼항, &&, early return 패턴을 상황에 맞게 선택할 수 있다",
    "&& 연산자의 falsy 함정을 이해하고 회피할 수 있다",
    "key가 재조정 알고리즘에서 하는 역할을 설명할 수 있다",
    "index key의 문제점을 구체적으로 설명할 수 있다",
    "key 변경으로 컴포넌트를 초기화하는 패턴을 활용할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "{0 && <Component />}의 렌더링 결과는?",
      choices: [
        "아무것도 렌더링되지 않는다",
        "화면에 0이 표시된다",
        "Component가 렌더링된다",
        "에러가 발생한다",
      ],
      correctIndex: 1,
      explanation:
        "&& 연산자에서 왼쪽이 falsy이면 왼쪽 값을 반환합니다. 0은 falsy이지만 React가 렌더링하는 유효한 값이므로 화면에 '0'이 표시됩니다.",
    },
    {
      id: "q2",
      question: "리스트 렌더링에서 key의 주된 역할은?",
      choices: [
        "스타일을 적용하기 위해",
        "React가 항목을 고유하게 식별하여 효율적으로 재조정하기 위해",
        "접근성(a11y)을 위해",
        "SEO 최적화를 위해",
      ],
      correctIndex: 1,
      explanation:
        "key는 React의 재조정 알고리즘이 리스트 항목을 식별하는 힌트입니다. key로 어떤 항목이 추가/삭제/이동되었는지 판단합니다.",
    },
    {
      id: "q3",
      question: "index를 key로 사용하면 문제가 되는 경우는?",
      choices: [
        "리스트가 정적이고 변하지 않을 때",
        "항목이 추가/삭제/재정렬될 때",
        "항목 수가 100개 이상일 때",
        "TypeScript를 사용할 때",
      ],
      correctIndex: 1,
      explanation:
        "항목이 추가/삭제/재정렬되면 index가 변경되어 React가 잘못된 컴포넌트와 매칭합니다. 기존 상태가 다른 항목에 유지되는 버그가 발생합니다.",
    },
    {
      id: "q4",
      question: "컴포넌트의 key를 변경하면 React는 어떻게 동작하는가?",
      choices: [
        "컴포넌트를 리렌더링만 한다",
        "컴포넌트를 언마운트하고 새로 마운트한다",
        "props만 업데이트한다",
        "아무 변화도 없다",
      ],
      correctIndex: 1,
      explanation:
        "key가 변경되면 React는 해당 컴포넌트를 완전히 언마운트하고 새 인스턴스를 마운트합니다. 내부 상태도 초기화됩니다.",
    },
    {
      id: "q5",
      question: "다음 중 조건부 렌더링에서 가독성이 가장 좋은 패턴은? (여러 조건이 있는 경우)",
      choices: [
        "중첩된 삼항 연산자",
        "early return",
        "&&를 여러 번 사용",
        "switch 표현식",
      ],
      correctIndex: 1,
      explanation:
        "여러 조건이 있을 때 early return으로 예외 상황을 먼저 처리하면 가독성이 가장 좋습니다. 중첩된 삼항은 가독성을 크게 해칩니다.",
    },
    {
      id: "q6",
      question: "React에서 null을 반환하면?",
      choices: [
        "에러가 발생한다",
        "빈 div가 렌더링된다",
        "아무것도 렌더링되지 않는다",
        "undefined가 표시된다",
      ],
      correctIndex: 2,
      explanation:
        "null을 반환하면 React는 해당 위치에 아무것도 렌더링하지 않습니다. 조건에 따라 컴포넌트를 숨기는 일반적인 패턴입니다.",
    },
  ],
};

export default chapter;
