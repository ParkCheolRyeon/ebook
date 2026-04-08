import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "14-use-hook",
  subject: "react",
  title: "use() 훅: React 19의 새로운 데이터 읽기",
  description: "React 19의 use() 훅으로 Promise와 Context를 읽고, Suspense와 연동하며, 기존 Hook 규칙의 예외를 이해합니다.",
  order: 14,
  group: "Hooks 심화",
  prerequisites: ["13-usecontext"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "use()는 **마법의 돋보기**와 같습니다.\n\n" +
        "기존 Hook들은 '작업대 위에서만 사용 가능한 도구'였습니다. 반드시 컴포넌트 최상위에서, 조건문이나 반복문 밖에서만 사용해야 했죠.\n\n" +
        "**use()**는 어디서든 꺼내 쓸 수 있는 **돋보기**입니다. 조건문 안에서도, 반복문 안에서도 사용할 수 있습니다.\n\n" +
        "이 돋보기로 **Promise(택배)**를 보면 택배가 도착할 때까지 기다렸다가 내용물을 보여줍니다. 기다리는 동안에는 **Suspense(대기실)**에서 로딩 화면을 보여줍니다.\n\n" +
        "**Context(방송)**를 보면 useContext와 동일하게 현재 방송 내용을 읽어옵니다. 다만 조건부로 '이 방송을 들을지 말지' 결정할 수 있다는 점이 다릅니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React 19 이전에는 비동기 데이터를 다루는 방법이 제한적이었습니다:\n\n" +
        "1. **useEffect + useState 조합** — 로딩/에러/데이터 상태를 수동 관리, 보일러플레이트가 많음\n" +
        "2. **서드파티 라이브러리 의존** — React Query, SWR 등에 의존\n" +
        "3. **Suspense 활용 어려움** — Promise를 컴포넌트에서 직접 읽는 공식 방법 없음\n\n" +
        "또한 기존 Hook 규칙의 제약이 있었습니다:\n" +
        "- 조건문 안에서 useContext를 호출할 수 없음\n" +
        "- 특정 조건에서만 Context를 읽고 싶을 때 불필요한 구독 발생\n" +
        "- early return 이후에 Hook을 호출할 수 없음",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### use() 훅 기본\n" +
        "React 19에서 도입된 `use()`는 두 가지 리소스를 읽을 수 있습니다:\n\n" +
        "**1. Promise 읽기**\n" +
        "- `const data = use(promise)` — Promise가 resolve될 때까지 컴포넌트를 suspend\n" +
        "- 가장 가까운 `<Suspense>` 경계에서 fallback UI를 보여줌\n" +
        "- reject되면 가장 가까운 Error Boundary가 처리\n\n" +
        "**2. Context 읽기**\n" +
        "- `const value = use(MyContext)` — useContext(MyContext)와 동일\n" +
        "- 차이점: 조건문, 반복문, early return 이후에도 호출 가능\n\n" +
        "### 기존 Hook 규칙과의 차이\n" +
        "기존 Hook(useState, useEffect 등)은 반드시 컴포넌트 최상위에서 호출해야 하지만, use()는 **조건문과 반복문 안에서도 호출 가능**합니다. 이는 use()가 렌더링 중에 '읽기만' 하는 특수한 Hook이기 때문입니다.\n\n" +
        "### useContext vs use(Context)\n" +
        "- `useContext` — 항상 최상위에서 호출, 항상 구독\n" +
        "- `use(Context)` — 조건부 호출 가능, 호출되지 않으면 구독 안 됨",
    },
    {
      type: "pseudocode",
      title: "기술 구현: use() 내부 동작",
      content:
        "use()가 Promise와 Context를 어떻게 처리하는지 의사코드로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// use() 내부 동작 (의사코드)\n' +
          '\n' +
          'function use<T>(resource: Promise<T> | ContextObject<T>): T {\n' +
          '  if (isContext(resource)) {\n' +
          '    // Context 읽기 — useContext와 동일하지만 조건부 호출 가능\n' +
          '    return readContext(resource);\n' +
          '  }\n' +
          '\n' +
          '  if (isPromise(resource)) {\n' +
          '    return readPromise(resource);\n' +
          '  }\n' +
          '\n' +
          '  throw new Error("use()는 Promise 또는 Context만 받습니다");\n' +
          '}\n' +
          '\n' +
          'function readPromise<T>(promise: Promise<T>): T {\n' +
          '  const status = getPromiseStatus(promise);\n' +
          '\n' +
          '  switch (status) {\n' +
          '    case "fulfilled":\n' +
          '      // 이미 resolve됨 → 값 반환\n' +
          '      return getPromiseResult(promise);\n' +
          '\n' +
          '    case "rejected":\n' +
          '      // reject됨 → 에러를 throw (Error Boundary가 잡음)\n' +
          '      throw getPromiseReason(promise);\n' +
          '\n' +
          '    case "pending":\n' +
          '      // 아직 대기 중 → Promise를 throw (Suspense가 잡음)\n' +
          '      throw promise;\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// Suspense의 동작 원리\n' +
          '// 1. 자식 컴포넌트가 Promise를 throw\n' +
          '// 2. Suspense가 Promise를 catch\n' +
          '// 3. fallback UI 표시\n' +
          '// 4. Promise가 resolve되면 자식을 다시 렌더링\n' +
          '\n' +
          '// use()가 조건문에서 가능한 이유:\n' +
          '// 기존 Hook(useState, useEffect 등)은 호출 순서에 의존하여 상태를 관리하지만,\n' +
          '// use()는 내부 상태를 갖지 않는 특수 API로 Hook 호출 순서에 의존하지 않습니다.\n' +
          '// 단순히 전달받은 리소스를 읽기만 하므로 조건문/반복문 안에서도 안전합니다.',
        description: "use()는 Promise를 throw하여 Suspense와 연동하고, Context는 직접 읽습니다. Hook 호출 순서에 의존하지 않는 특수 API이므로 조건부 호출이 가능합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: use() 실전 패턴",
      content:
        "use()를 활용한 다양한 패턴을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          'import { use, Suspense } from "react";\n' +
          '\n' +
          '// 패턴 1: Promise 읽기 + Suspense\n' +
          'async function fetchUser(id: string): Promise<{ name: string; email: string }> {\n' +
          '  const res = await fetch(`/api/users/${id}`);\n' +
          '  return res.json();\n' +
          '}\n' +
          '\n' +
          '// 주의: Promise는 렌더링 밖에서 생성해야 함\n' +
          'function UserPage({ userId }: { userId: string }) {\n' +
          '  const userPromise = fetchUser(userId); // ⚠️ 매 렌더링마다 새 Promise\n' +
          '  return (\n' +
          '    <Suspense fallback={<p>로딩 중...</p>}>\n' +
          '      <UserProfile userPromise={userPromise} />\n' +
          '    </Suspense>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'function UserProfile({ userPromise }: { userPromise: Promise<{ name: string; email: string }> }) {\n' +
          '  const user = use(userPromise);\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <h1>{user.name}</h1>\n' +
          '      <p>{user.email}</p>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 패턴 2: 조건부 Context 읽기\n' +
          'import { createContext } from "react";\n' +
          '\n' +
          'const AdminContext = createContext<{ role: string } | null>(null);\n' +
          '\n' +
          'function Dashboard({ isAdmin }: { isAdmin: boolean }) {\n' +
          '  // 조건부로 Context를 읽을 수 있음 (기존 useContext로는 불가능)\n' +
          '  if (isAdmin) {\n' +
          '    const admin = use(AdminContext);\n' +
          '    return <div>관리자: {admin?.role}</div>;\n' +
          '  }\n' +
          '  return <div>일반 사용자 대시보드</div>;\n' +
          '}\n' +
          '\n' +
          '// 패턴 3: 서버에서 전달받은 Promise 사용 (Server Component 패턴)\n' +
          'interface CommentsProps {\n' +
          '  commentsPromise: Promise<{ id: number; text: string }[]>;\n' +
          '}\n' +
          '\n' +
          'function Comments({ commentsPromise }: CommentsProps) {\n' +
          '  const comments = use(commentsPromise);\n' +
          '  return (\n' +
          '    <ul>\n' +
          '      {comments.map(c => <li key={c.id}>{c.text}</li>)}\n' +
          '    </ul>\n' +
          '  );\n' +
          '}',
        description: "use()로 Promise를 읽으면 Suspense와 자동으로 연동됩니다. Context도 조건부로 읽을 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 비교 | useContext | use(Context) |\n" +
        "|------|----------|-------------|\n" +
        "| 호출 위치 | 최상위만 | 조건문/반복문 가능 |\n" +
        "| 구독 | 항상 | 호출 시에만 |\n" +
        "| Promise 지원 | X | O |\n\n" +
        "**use() 핵심 규칙:**\n" +
        "1. Promise를 넘기면 Suspense 경계 필요\n" +
        "2. reject된 Promise는 Error Boundary로 처리\n" +
        "3. 렌더링 중 매번 새 Promise를 생성하지 말 것 (캐시 또는 prop으로 전달)\n" +
        "4. 조건문/반복문 안에서 호출 가능 (기존 Hook 규칙의 예외)\n\n" +
        "**다음 챕터 미리보기:** 커스텀 Hook으로 재사용 가능한 로직을 추출하는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "React 19의 use() Hook은 Promise나 Context를 컴포넌트 안에서 직접 읽을 수 있게 한다. 조건문 안에서도 호출 가능한 유일한 Hook이다.",
  checklist: [
    "use()가 Promise와 Context를 읽는 방법을 설명할 수 있다",
    "use()가 조건문 안에서 호출 가능한 이유를 설명할 수 있다",
    "use()와 Suspense의 연동 원리를 이해한다",
    "useContext와 use(Context)의 차이를 설명할 수 있다",
    "use()로 Promise를 읽을 때 주의사항을 알고 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "use() 훅이 읽을 수 있는 리소스는?",
      choices: [
        "Promise만",
        "Context만",
        "Promise와 Context",
        "모든 JavaScript 값",
      ],
      correctIndex: 2,
      explanation: "use()는 Promise와 Context 두 가지 리소스를 읽을 수 있습니다.",
    },
    {
      id: "q2",
      question: "use()가 기존 Hook과 다른 점은?",
      choices: [
        "비동기적으로 동작한다",
        "조건문과 반복문 안에서 호출할 수 있다",
        "클래스 컴포넌트에서도 사용 가능하다",
        "상태를 변경할 수 있다",
      ],
      correctIndex: 1,
      explanation: "use()는 리소스 자체로 식별하므로 호출 순서에 의존하지 않아 조건문, 반복문, early return 이후에도 호출할 수 있습니다.",
    },
    {
      id: "q3",
      question: "use(promise)에서 Promise가 아직 pending 상태이면?",
      choices: [
        "undefined를 반환한다",
        "에러를 throw한다",
        "가장 가까운 Suspense의 fallback을 보여준다",
        "빈 문자열을 반환한다",
      ],
      correctIndex: 2,
      explanation: "Promise가 pending이면 use()가 Promise를 throw하고, 가장 가까운 Suspense 경계가 이를 잡아 fallback UI를 보여줍니다.",
    },
    {
      id: "q4",
      question: "use()로 Promise를 읽을 때 주의할 점은?",
      choices: [
        "반드시 async 컴포넌트에서만 사용해야 한다",
        "렌더링 중 매번 새 Promise를 생성하면 안 된다",
        "try-catch로 감싸야 한다",
        "useEffect 안에서만 호출해야 한다",
      ],
      correctIndex: 1,
      explanation: "렌더링 중 매번 새 Promise를 생성하면 매번 pending 상태로 시작하여 무한 suspend에 빠질 수 있습니다. 캐시하거나 prop으로 전달해야 합니다.",
    },
    {
      id: "q5",
      question: "use(MyContext)와 useContext(MyContext)의 기능적 차이는?",
      choices: [
        "완전히 동일하다",
        "use는 Provider 없이도 동작한다",
        "use는 조건부 호출이 가능하다",
        "use는 기본값을 지정할 수 있다",
      ],
      correctIndex: 2,
      explanation: "use(Context)는 조건문 안에서 호출할 수 있어 특정 조건에서만 Context를 구독할 수 있습니다. useContext는 항상 최상위에서 호출해야 합니다.",
    },
  ],
};

export default chapter;
