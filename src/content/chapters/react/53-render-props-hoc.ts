import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "53-render-props-hoc",
  subject: "react",
  title: "Render Props와 HOC",
  description:
    "로직 재사용 패턴의 역사, withAuth/withLoading HOC, render prop 패턴, Hook으로의 전환을 학습합니다.",
  order: 53,
  group: "설계 패턴과 아키텍처",
  prerequisites: ["52-compound-component"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "로직 재사용 패턴은 **포장지와 내용물**의 관계입니다.\n\n" +
        "**HOC(Higher-Order Component)**는 선물 포장 서비스입니다. 어떤 선물(컴포넌트)이든 가져오면, 리본을 달아주고(인증 확인), 택배 상자에 넣어주고(로딩 표시), 보험을 걸어줍니다(에러 처리). 원래 선물은 그대로이고, 포장만 추가됩니다.\n\n" +
        "**Render Props**는 빈 액자입니다. 액자(로직)는 준비되어 있고, 어떤 그림(UI)을 넣을지는 사용자가 결정합니다. 같은 액자에 사진도, 그림도, 포스터도 넣을 수 있습니다.\n\n" +
        "**Hook**은 USB 도구입니다. 포장하거나 액자에 끼울 필요 없이, 필요한 기능을 직접 꽂아서 사용합니다. 가장 간결하고 직관적입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "Hook 이전 시대에 로직 재사용은 왜 어려웠을까요?\n\n" +
        "1. **Mixin의 문제(React 초기)** — 이름 충돌, 암묵적 의존성, 복잡도 증가로 공식적으로 폐기되었습니다.\n\n" +
        "2. **HOC의 래퍼 지옥** — `withAuth(withTheme(withRouter(MyComponent)))` 같은 중첩이 깊어지면 디버깅이 어렵고, props 충돌이 발생합니다.\n\n" +
        "3. **Render Props의 콜백 지옥** — 여러 render prop을 조합하면 JSX가 오른쪽으로 끝없이 들여쓰기됩니다.\n\n" +
        "4. **정적 타입 지원** — HOC의 props 타입 추론은 TypeScript에서 복잡하고, 래핑된 컴포넌트의 props가 사라지는 문제가 있었습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### HOC (Higher-Order Component)\n" +
        "컴포넌트를 인자로 받아 새 컴포넌트를 반환하는 함수입니다. 횡단 관심사(인증, 로깅, 에러 처리)를 분리할 때 사용됩니다.\n\n" +
        "### Render Props\n" +
        "함수를 props로 전달하여 렌더링 제어권을 위임합니다. children을 함수로 전달하는 패턴도 포함됩니다.\n\n" +
        "### Hook으로의 전환\n" +
        "대부분의 HOC와 Render Props는 커스텀 Hook으로 대체할 수 있습니다.\n" +
        "- `withAuth(Component)` → `useAuth()` Hook\n" +
        "- `<Mouse render={({x, y}) => ...}/>` → `useMouse()` Hook\n" +
        "- `withLoading(Component)` → `useQuery`의 isLoading\n\n" +
        "### 여전히 유효한 경우\n" +
        "- Error Boundary는 클래스 컴포넌트 전용 (HOC 활용)\n" +
        "- 레이아웃 래핑 (HOC 패턴)\n" +
        "- 써드파티 라이브러리 통합 (HOC 또는 render prop)",
    },
    {
      type: "pseudocode",
      title: "기술 구현: HOC와 Render Props",
      content:
        "HOC와 Render Props의 구현과 Hook으로의 전환을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// === HOC: withAuth ===\n' +
          'function withAuth<P extends object>(\n' +
          '  WrappedComponent: React.ComponentType<P>\n' +
          ') {\n' +
          '  return function AuthenticatedComponent(props: P) {\n' +
          '    const { user, isLoading } = useAuth();\n' +
          '\n' +
          '    if (isLoading) return <div>로딩 중...</div>;\n' +
          '    if (!user) return <Navigate to="/login" />;\n' +
          '\n' +
          '    return <WrappedComponent {...props} />;\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          '// 사용: const ProtectedPage = withAuth(Dashboard);\n' +
          '\n' +
          '// === Render Props: Mouse Tracker ===\n' +
          'interface MouseState { x: number; y: number; }\n' +
          '\n' +
          'function MouseTracker({ render }: { render: (state: MouseState) => React.ReactNode }) {\n' +
          '  const [pos, setPos] = useState<MouseState>({ x: 0, y: 0 });\n' +
          '\n' +
          '  useEffect(() => {\n' +
          '    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });\n' +
          '    window.addEventListener("mousemove", handler);\n' +
          '    return () => window.removeEventListener("mousemove", handler);\n' +
          '  }, []);\n' +
          '\n' +
          '  return <>{render(pos)}</>;\n' +
          '}\n' +
          '\n' +
          '// 사용: <MouseTracker render={({x, y}) => <p>{x}, {y}</p>} />\n' +
          '\n' +
          '// === Hook으로 전환 ===\n' +
          'function useMouse(): MouseState {\n' +
          '  const [pos, setPos] = useState<MouseState>({ x: 0, y: 0 });\n' +
          '  useEffect(() => {\n' +
          '    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });\n' +
          '    window.addEventListener("mousemove", handler);\n' +
          '    return () => window.removeEventListener("mousemove", handler);\n' +
          '  }, []);\n' +
          '  return pos;\n' +
          '}\n' +
          '// 사용: const { x, y } = useMouse();',
        description:
          "HOC는 컴포넌트를 감싸고, Render Props는 함수로 UI를 위임하며, Hook은 로직만 직접 추출합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 패턴 비교와 전환",
      content:
        "같은 로직을 HOC, Render Props, Hook으로 각각 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// === withLoading HOC ===\n' +
          'function withLoading<P extends { data: unknown }>(\n' +
          '  WrappedComponent: React.ComponentType<P>\n' +
          ') {\n' +
          '  return function LoadingComponent(props: Omit<P, "data"> & { url: string }) {\n' +
          '    const { data, isLoading, error } = useFetch(props.url);\n' +
          '    if (isLoading) return <div>로딩 중...</div>;\n' +
          '    if (error) return <div>에러: {error.message}</div>;\n' +
          '    return <WrappedComponent {...(props as P)} data={data} />;\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          '// === children as function (Render Props 변형) ===\n' +
          'function DataFetcher({ url, children }: {\n' +
          '  url: string;\n' +
          '  children: (state: { data: unknown; loading: boolean }) => React.ReactNode;\n' +
          '}) {\n' +
          '  const { data, isLoading } = useFetch(url);\n' +
          '  return <>{children({ data, loading: isLoading })}</>;\n' +
          '}\n' +
          '\n' +
          '// 사용:\n' +
          '// <DataFetcher url="/api/users">\n' +
          '//   {({ data, loading }) => loading ? <Spinner /> : <UserList data={data} />}\n' +
          '// </DataFetcher>\n' +
          '\n' +
          '// === ✅ Hook: 가장 간결한 방식 ===\n' +
          'function UserPage() {\n' +
          '  const { data, isLoading, error } = useFetch("/api/users");\n' +
          '\n' +
          '  if (isLoading) return <div>로딩 중...</div>;\n' +
          '  if (error) return <div>에러: {error.message}</div>;\n' +
          '  return <UserList data={data} />;\n' +
          '}',
        description:
          "같은 데이터 페칭 로직이 HOC → Render Props → Hook으로 갈수록 간결해집니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 장점 | 단점 | 현재 상태 |\n" +
        "|------|------|------|-----------|\n" +
        "| HOC | 횡단 관심사 분리 | 래퍼 지옥, props 충돌 | 제한적 사용 |\n" +
        "| Render Props | 유연한 렌더링 제어 | 콜백 중첩 | 제한적 사용 |\n" +
        "| Hook | 간결, 조합 용이 | 컴포넌트 내부에서만 | 주력 패턴 |\n\n" +
        "**핵심:** 새 코드에서는 Hook을 기본으로 사용하고, 레거시 코드 이해와 Error Boundary 같은 특수한 경우에만 HOC/Render Props를 알아두세요.\n\n" +
        "**다음 챕터 미리보기:** Container/Presentational 분리와 Hook 시대의 재해석을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "Render Props와 HOC는 Hook 이전에 로직을 재사용하던 패턴이다. 현재는 커스텀 Hook이 대부분을 대체하지만, 라이브러리 API에서 여전히 만날 수 있다.",
  checklist: [
    "HOC의 구현 원리와 사용 사례를 설명할 수 있다",
    "Render Props 패턴과 children as function을 이해한다",
    "HOC, Render Props, Hook의 장단점을 비교할 수 있다",
    "기존 HOC/Render Props를 Hook으로 전환할 수 있다",
    "HOC가 여전히 유효한 사례를 안다",
  ],
  quiz: [
    {
      id: "q1",
      question: "HOC(Higher-Order Component)의 정의는?",
      choices: [
        "상태를 관리하는 컴포넌트",
        "컴포넌트를 인자로 받아 새 컴포넌트를 반환하는 함수",
        "자식을 렌더링하는 컴포넌트",
        "Context를 제공하는 컴포넌트",
      ],
      correctIndex: 1,
      explanation:
        "HOC는 컴포넌트를 인자로 받아, 추가 기능(인증, 로깅 등)이 포함된 새 컴포넌트를 반환하는 함수입니다.",
    },
    {
      id: "q2",
      question: "Render Props 패턴의 핵심은?",
      choices: [
        "부모가 자식의 props를 강제한다",
        "함수를 props로 전달하여 렌더링 제어권을 위임한다",
        "컴포넌트를 조건부로 마운트한다",
        "상태를 전역으로 관리한다",
      ],
      correctIndex: 1,
      explanation:
        "Render Props는 렌더링할 내용을 함수로 전달합니다. 로직(데이터, 상태)은 제공하고, 어떻게 렌더링할지는 사용자가 결정합니다.",
    },
    {
      id: "q3",
      question: "HOC의 래퍼 지옥(Wrapper Hell) 문제는?",
      choices: [
        "번들 크기가 커진다",
        "중첩이 깊어져 디버깅이 어렵고 props 충돌이 발생한다",
        "서버 사이드 렌더링이 불가능하다",
        "TypeScript를 사용할 수 없다",
      ],
      correctIndex: 1,
      explanation:
        "withAuth(withTheme(withRouter(Component))) 같은 깊은 중첩은 React DevTools에서 래퍼가 쌓이고, 각 HOC가 주입하는 props가 충돌할 수 있습니다.",
    },
    {
      id: "q4",
      question: "Hook이 HOC/Render Props보다 우수한 점은?",
      choices: [
        "성능이 항상 더 좋다",
        "래퍼 없이 로직을 재사용하고 조합할 수 있다",
        "클래스 컴포넌트에서도 사용할 수 있다",
        "자동으로 에러를 처리한다",
      ],
      correctIndex: 1,
      explanation:
        "Hook은 컴포넌트를 감싸거나 JSX를 변형하지 않고, 함수 호출만으로 로직을 재사용합니다. 여러 Hook을 순서대로 호출하면 자연스럽게 조합됩니다.",
    },
    {
      id: "q5",
      question: "HOC가 여전히 유효한 경우는?",
      choices: [
        "모든 데이터 페칭",
        "Error Boundary 래핑, 레이아웃 처리",
        "폼 검증 로직",
        "이벤트 핸들러 등록",
      ],
      correctIndex: 1,
      explanation:
        "Error Boundary는 클래스 컴포넌트 전용 기능이므로 HOC로 감싸는 패턴이 유효합니다. 레이아웃 래핑 등 컴포넌트 구조를 변경하는 경우에도 HOC가 적합합니다.",
    },
  ],
};

export default chapter;
