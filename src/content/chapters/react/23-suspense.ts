import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "23-suspense",
  subject: "react",
  title: "Suspense",
  description: "비동기 렌더링, fallback UI, React 19 use()와 Suspense, ErrorBoundary 연동, 중첩 Suspense, SuspenseList를 이해합니다.",
  order: 23,
  group: "렌더링 원리",
  prerequisites: ["22-batching"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Suspense는 레스토랑의 대기 시스템과 비슷합니다.\n\n" +
        "음식(데이터)이 준비될 때까지 손님에게 \"잠시만 기다려주세요\"라는 안내판(fallback)을 보여줍니다. 음식이 준비되면 안내판을 치우고 실제 음식을 서빙합니다.\n\n" +
        "**React 19의 use()**는 웨이터가 주방에 \"이 요리 됐어?\"라고 묻는 것과 같습니다. 안 됐으면 자동으로 대기 안내판을 보여주고, 됐으면 바로 서빙합니다.\n\n" +
        "**중첩 Suspense**는 코스 요리처럼 각 코스마다 별도의 대기 안내가 있는 것이고, **ErrorBoundary**는 요리가 실패했을 때의 사과 메시지입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "비동기 데이터를 다루는 기존 방식에는 여러 문제가 있습니다.\n\n" +
        "1. **로딩 상태 관리의 복잡성** — 컴포넌트마다 isLoading, error, data 상태를 직접 관리해야 합니다.\n" +
        "2. **워터폴 문제** — 부모가 로딩을 완료해야 자식이 데이터 요청을 시작하는 순차적 패턴이 빈번합니다.\n" +
        "3. **로딩 UI의 불일치** — 각 컴포넌트가 독자적으로 로딩 상태를 보여주면 화면이 들쭉날쭉해집니다.\n" +
        "4. **선언적이지 않은 코드** — if (isLoading) return <Spinner /> 패턴이 반복되어 비즈니스 로직과 로딩 로직이 뒤섞입니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Suspense는 비동기 로딩을 **선언적**으로 처리합니다.\n\n" +
        "### Suspense 기본 원리\n" +
        "자식 컴포넌트가 아직 준비되지 않은 데이터를 읽으려 하면 Promise를 throw합니다. 가장 가까운 Suspense 경계가 이를 잡아 fallback UI를 보여주고, Promise가 resolve되면 자식을 다시 렌더링합니다.\n\n" +
        "### React 19 use() Hook\n" +
        "- `use(promise)`로 컴포넌트 안에서 직접 Promise를 읽을 수 있습니다.\n" +
        "- 조건부로 호출 가능합니다(다른 Hook과 달리 if문 안에서 사용 가능).\n" +
        "- Promise가 pending이면 자동으로 Suspense를 트리거합니다.\n\n" +
        "### ErrorBoundary 연동\n" +
        "Promise가 reject되면 가장 가까운 ErrorBoundary가 에러를 잡습니다. Suspense + ErrorBoundary 조합으로 로딩/에러/성공 세 가지 상태를 선언적으로 처리할 수 있습니다.\n\n" +
        "### 중첩 Suspense\n" +
        "Suspense를 중첩하면 UI의 각 영역이 독립적으로 로딩될 수 있습니다. 각 영역의 로딩 우선순위를 세밀하게 제어할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Suspense 내부 동작",
      content:
        "Suspense가 Promise throw를 처리하는 내부 메커니즘을 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// Suspense 내부 동작 의사코드\n' +
          '\n' +
          '// use() Hook의 단순화된 동작\n' +
          'function use<T>(promise: Promise<T>): T {\n' +
          '  const status = getPromiseStatus(promise);\n' +
          '\n' +
          '  if (status === "fulfilled") {\n' +
          '    return getPromiseResult(promise); // 완료된 값 반환\n' +
          '  }\n' +
          '  if (status === "rejected") {\n' +
          '    throw getPromiseError(promise); // ErrorBoundary가 잡음\n' +
          '  }\n' +
          '  // status === "pending"\n' +
          '  throw promise; // Suspense가 잡음\n' +
          '}\n' +
          '\n' +
          '// Suspense 컴포넌트의 동작\n' +
          'function SuspenseBoundary(\n' +
          '  { fallback, children }: { fallback: ReactNode; children: ReactNode }\n' +
          ') {\n' +
          '  try {\n' +
          '    return renderChildren(children);\n' +
          '  } catch (thrown) {\n' +
          '    if (thrown instanceof Promise) {\n' +
          '      // 1. fallback UI 표시\n' +
          '      showFallback(fallback);\n' +
          '\n' +
          '      // 2. Promise 완료 시 children 재렌더링\n' +
          '      thrown.then(() => {\n' +
          '        hideFallback();\n' +
          '        retryRenderChildren(children);\n' +
          '      });\n' +
          '\n' +
          '      // 3. Promise 실패 시 ErrorBoundary로 전파\n' +
          '      thrown.catch((error) => {\n' +
          '        propagateToErrorBoundary(error);\n' +
          '      });\n' +
          '    } else {\n' +
          '      throw thrown; // 일반 에러는 그대로 전파\n' +
          '    }\n' +
          '  }\n' +
          '}\n',
        description: "use()는 Promise 상태에 따라 값 반환, 에러 throw, Promise throw를 수행합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: React 19 use()와 Suspense",
      content:
        "React 19의 use() Hook을 사용한 데이터 페칭 패턴입니다.",
      code: {
        language: "typescript",
        code:
          'import { Suspense, use } from "react";\n' +
          '\n' +
          '// 데이터 페칭 함수 — Promise를 반환\n' +
          'async function fetchUser(id: string): Promise<{ name: string; email: string }> {\n' +
          '  const res = await fetch(`/api/users/${id}`);\n' +
          '  if (!res.ok) throw new Error("Failed to fetch user");\n' +
          '  return res.json();\n' +
          '}\n' +
          '\n' +
          '// ✅ use()로 Promise 직접 읽기 (React 19)\n' +
          'function UserProfile({ userPromise }: { userPromise: Promise<{ name: string; email: string }> }) {\n' +
          '  const user = use(userPromise); // pending이면 Suspense 트리거\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <h2>{user.name}</h2>\n' +
          '      <p>{user.email}</p>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 조건부 use() — 다른 Hook과 달리 가능\n' +
          'function ConditionalData({ shouldFetch, dataPromise }: {\n' +
          '  shouldFetch: boolean;\n' +
          '  dataPromise: Promise<string>;\n' +
          '}) {\n' +
          '  if (shouldFetch) {\n' +
          '    const data = use(dataPromise); // if문 안에서 사용 가능\n' +
          '    return <p>{data}</p>;\n' +
          '  }\n' +
          '  return <p>데이터 없음</p>;\n' +
          '}\n' +
          '\n' +
          '// ErrorBoundary + Suspense 조합\n' +
          'function ErrorBoundary({ fallback, children }: {\n' +
          '  fallback: React.ReactNode;\n' +
          '  children: React.ReactNode;\n' +
          '}) {\n' +
          '  // 클래스 컴포넌트로 구현 필요 (간략화)\n' +
          '  return <>{children}</>;\n' +
          '}\n' +
          '\n' +
          '// 조합 사용\n' +
          'function App() {\n' +
          '  const userPromise = fetchUser("1"); // 렌더 바깥에서 시작\n' +
          '\n' +
          '  return (\n' +
          '    <ErrorBoundary fallback={<p>에러가 발생했습니다</p>}>\n' +
          '      <Suspense fallback={<p>로딩 중...</p>}>\n' +
          '        <UserProfile userPromise={userPromise} />\n' +
          '      </Suspense>\n' +
          '    </ErrorBoundary>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// 중첩 Suspense — 영역별 독립 로딩\n' +
          'function Dashboard() {\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <Suspense fallback={<p>사이드바 로딩...</p>}>\n' +
          '        <Sidebar />\n' +
          '      </Suspense>\n' +
          '      <Suspense fallback={<p>메인 콘텐츠 로딩...</p>}>\n' +
          '        <MainContent />\n' +
          '      </Suspense>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n',
        description: "use()는 React 19에서 도입된 Hook으로, Promise를 직접 읽어 Suspense와 자연스럽게 연동됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| Suspense | 비동기 로딩을 선언적으로 처리하는 컴포넌트 |\n" +
        "| fallback | 데이터 로딩 중 표시할 대체 UI |\n" +
        "| use() | React 19의 Promise 읽기 Hook (조건부 호출 가능) |\n" +
        "| ErrorBoundary | Promise reject 시 에러 UI 표시 |\n" +
        "| 중첩 Suspense | 영역별 독립적 로딩 제어 |\n\n" +
        "**핵심:** Suspense는 '어떻게 로딩할지'가 아니라 '로딩 중일 때 무엇을 보여줄지'를 선언합니다. React 19의 use()는 이를 더욱 간결하게 만들어줍니다.\n\n" +
        "**다음 챕터 미리보기:** 서버에서 실행되는 React 컴포넌트인 Server Components를 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "Suspense는 비동기 데이터가 준비될 때까지 fallback UI를 보여주는 선언적 메커니즘이다. 로딩 상태를 컴포넌트 밖으로 끌어올려 코드를 깔끔하게 만든다.",
  checklist: [
    "Suspense의 동작 원리(Promise throw)를 설명할 수 있다",
    "React 19의 use() Hook의 특징을 알고 있다",
    "ErrorBoundary와 Suspense의 조합 패턴을 설명할 수 있다",
    "중첩 Suspense의 용도를 이해한다",
    "기존 useEffect 기반 로딩과 Suspense의 차이를 비교할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Suspense 컴포넌트가 fallback을 표시하는 조건은?",
      choices: [
        "자식 컴포넌트가 에러를 throw할 때",
        "자식 컴포넌트가 Promise를 throw할 때",
        "자식 컴포넌트가 null을 반환할 때",
        "자식 컴포넌트의 props가 변경될 때",
      ],
      correctIndex: 1,
      explanation: "Suspense는 자식이 Promise를 throw하면 해당 Promise가 resolve될 때까지 fallback UI를 표시합니다.",
    },
    {
      id: "q2",
      question: "React 19의 use() Hook이 다른 Hook과 다른 점은?",
      choices: [
        "클래스 컴포넌트에서도 사용 가능하다",
        "조건부로 호출할 수 있다",
        "서버에서만 사용 가능하다",
        "자동으로 캐싱된다",
      ],
      correctIndex: 1,
      explanation: "use()는 다른 Hook과 달리 if문이나 반복문 안에서 조건부로 호출할 수 있습니다.",
    },
    {
      id: "q3",
      question: "use(promise)에서 Promise가 reject되면 어떻게 되는가?",
      choices: [
        "undefined를 반환한다",
        "Suspense가 fallback을 표시한다",
        "가장 가까운 ErrorBoundary가 에러를 잡는다",
        "컴포넌트가 null을 렌더링한다",
      ],
      correctIndex: 2,
      explanation: "Promise가 reject되면 에러가 throw되어 가장 가까운 ErrorBoundary가 이를 잡아 에러 UI를 표시합니다.",
    },
    {
      id: "q4",
      question: "중첩 Suspense의 장점은?",
      choices: [
        "전체 로딩 속도가 빨라진다",
        "각 영역이 독립적으로 로딩 상태를 관리할 수 있다",
        "메모리 사용량이 줄어든다",
        "서버 컴포넌트에서만 사용 가능하다",
      ],
      correctIndex: 1,
      explanation: "중첩 Suspense는 UI의 각 영역이 독립적으로 로딩/완료될 수 있게 하여 전체 페이지가 하나의 로딩에 블로킹되지 않습니다.",
    },
    {
      id: "q5",
      question: "Suspense를 사용하지 않고 데이터 로딩을 처리하는 기존 패턴의 단점은?",
      choices: [
        "TypeScript 타입 추론이 안 된다",
        "성능이 항상 더 나쁘다",
        "isLoading/error/data 상태를 수동 관리해야 하고 코드가 명령적이다",
        "SSR에서 사용할 수 없다",
      ],
      correctIndex: 2,
      explanation: "기존 패턴은 각 컴포넌트에서 로딩/에러/데이터 상태를 직접 관리해야 하며, if (isLoading) 패턴이 반복되어 선언적이지 않습니다.",
    },
    {
      id: "q6",
      question: "use()에 전달하는 Promise는 어디서 생성하는 것이 좋은가?",
      choices: [
        "컴포넌트 함수 안에서 매 렌더마다",
        "렌더링 바깥(부모 컴포넌트나 라우터)에서 한 번",
        "useEffect 안에서",
        "useLayoutEffect 안에서",
      ],
      correctIndex: 1,
      explanation: "컴포넌트 안에서 매번 새 Promise를 만들면 무한 루프가 발생합니다. 부모나 라우터에서 한 번 생성하여 props로 전달해야 합니다.",
    },
  ],
};

export default chapter;
