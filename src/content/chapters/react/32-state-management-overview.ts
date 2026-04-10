import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "32-state-management-overview",
  subject: "react",
  title: "상태 관리 개론",
  description:
    "로컬 vs 전역 상태, 서버 상태 vs 클라이언트 상태의 차이를 이해하고, prop drilling 문제와 전역 상태가 필요한 시점을 판단합니다.",
  order: 32,
  group: "상태 관리",
  prerequisites: ["31-rendering-optimization-patterns"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "상태 관리는 회사의 정보 전달 체계와 같습니다.\n\n" +
        "**로컬 상태**는 각 부서의 내부 메모입니다. 해당 부서만 알면 되는 정보로, 다른 부서에 전달할 필요가 없습니다.\n\n" +
        "**전역 상태**는 사내 공지사항 게시판입니다. 모든 부서가 알아야 하는 정보(로그인 사용자, 테마 설정 등)를 한곳에서 관리합니다.\n\n" +
        "**Prop Drilling**은 전화 릴레이 게임입니다. 사장이 인턴에게 메시지를 전하려면 중간 관리자들이 모두 메시지를 전달해야 합니다. 관리자들은 메시지 내용에 관심이 없는데도 말이죠.\n\n" +
        "**서버 상태**는 본사 데이터베이스에 저장된 정보입니다. 지점에서 캐시해 놓을 수 있지만, 본사의 데이터가 진짜이고 동기화가 필요합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React 앱이 커지면 상태 관리가 복잡해집니다.\n\n" +
        "1. **Prop Drilling** — 깊이 중첩된 컴포넌트에 데이터를 전달하려면 중간 컴포넌트들이 불필요한 props를 전달해야 합니다\n" +
        "2. **상태 분류 혼란** — 어떤 상태를 로컬로 관리하고, 어떤 상태를 전역으로 올려야 하는지 판단이 어렵습니다\n" +
        "3. **서버 상태의 특수성** — API에서 가져온 데이터는 캐싱, 재검증, 동기화 등 고유한 문제가 있는데 클라이언트 상태와 동일하게 다루면 복잡도가 급증합니다\n" +
        "4. **불필요한 리렌더링** — 전역 상태를 잘못 설계하면 상태 변경 시 관련 없는 컴포넌트까지 리렌더링됩니다",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "상태를 종류별로 분류하고 적절한 도구를 선택하는 것이 핵심입니다.\n\n" +
        "### 상태의 4가지 분류\n" +
        "- **로컬 UI 상태**: 모달 열림/닫힘, 입력값, 토글 — `useState`, `useReducer`\n" +
        "- **공유 UI 상태**: 테마, 언어 설정 — Context API\n" +
        "- **전역 클라이언트 상태**: 장바구니, 인증 정보 — Redux, Zustand\n" +
        "- **서버 상태**: API 데이터 — React Query, SWR\n\n" +
        "### 전역 상태가 필요한 시점\n" +
        "- 3단계 이상의 prop drilling이 발생할 때\n" +
        "- 서로 멀리 떨어진 컴포넌트가 같은 데이터를 필요로 할 때\n" +
        "- 상태 변경이 여러 컴포넌트에 동시에 영향을 미칠 때\n\n" +
        "### 핵심 원칙: 서버 상태와 클라이언트 상태를 분리하라\n" +
        "가장 흔한 실수는 API 데이터(서버 상태)를 Redux/Zustand에 저장하는 것입니다. **서버 상태는 React Query/SWR로, 클라이언트 상태(UI, 인증)만 Redux/Zustand로** 관리하세요. 이 분리만으로도 상태 관리 복잡도가 크게 줄어듭니다.\n\n" +
        "### 원칙: 가능한 한 로컬에 유지\n" +
        "상태는 필요한 곳에서 가장 가까운 곳에 두세요. 성급하게 전역으로 올리면 복잡도만 증가합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 상태 분류 의사결정 트리",
      content:
        "새로운 상태를 추가할 때 어떤 도구를 선택할지 결정하는 의사코드입니다.",
      code: {
        language: "typescript",
        code:
          '// 상태 분류 의사결정 트리\n' +
          '\n' +
          'function chooseStateStrategy(state: NewState) {\n' +
          '  // 1단계: 서버에서 오는 데이터인가?\n' +
          '  if (state.source === "server") {\n' +
          '    // 서버 상태 → 전용 라이브러리 사용\n' +
          '    return "React Query / SWR";\n' +
          '    // 이유: 캐싱, 재검증, 로딩/에러 상태를 자동 관리\n' +
          '  }\n' +
          '\n' +
          '  // 2단계: 하나의 컴포넌트에서만 사용하는가?\n' +
          '  if (state.usedBy.length === 1) {\n' +
          '    return "useState / useReducer";\n' +
          '    // 이유: 가장 단순하고 리렌더링 범위가 최소\n' +
          '  }\n' +
          '\n' +
          '  // 3단계: 가까운 부모-자식 관계인가?\n' +
          '  if (state.componentDepth <= 2) {\n' +
          '    return "props로 전달 (lifting state up)";\n' +
          '    // 이유: 명시적이고 추적하기 쉬움\n' +
          '  }\n' +
          '\n' +
          '  // 4단계: 자주 변경되는 상태인가?\n' +
          '  if (state.updateFrequency === "high") {\n' +
          '    return "Zustand / Redux";\n' +
          '    // 이유: 셀렉터로 리렌더링 최적화 가능\n' +
          '  }\n' +
          '\n' +
          '  // 5단계: 변경 빈도가 낮은 전역 상태\n' +
          '  return "Context API";\n' +
          '  // 이유: 테마, 언어 등 거의 변경되지 않는 값에 적합\n' +
          '}',
        description:
          "상태의 출처, 사용 범위, 변경 빈도에 따라 적절한 관리 도구를 선택합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Prop Drilling vs 상태 끌어올리기",
      content:
        "Prop Drilling 문제를 인식하고, 상태 끌어올리기의 한계를 확인합니다.",
      code: {
        language: "typescript",
        code:
          '// ❌ Prop Drilling: 중간 컴포넌트가 불필요한 props를 전달\n' +
          'function App() {\n' +
          '  const [user, setUser] = useState<User | null>(null);\n' +
          '  return <Layout user={user} />;\n' +
          '}\n' +
          '\n' +
          'function Layout({ user }: { user: User | null }) {\n' +
          '  // Layout은 user를 사용하지 않지만 전달만 함\n' +
          '  return <Sidebar user={user} />;\n' +
          '}\n' +
          '\n' +
          'function Sidebar({ user }: { user: User | null }) {\n' +
          '  // Sidebar도 user를 사용하지 않고 전달만 함\n' +
          '  return <UserProfile user={user} />;\n' +
          '}\n' +
          '\n' +
          'function UserProfile({ user }: { user: User | null }) {\n' +
          '  return <div>{user?.name}</div>; // 여기서만 실제 사용\n' +
          '}\n' +
          '\n' +
          '// ✅ 개선: 상태를 종류별로 분리하여 관리\n' +
          '// 서버 상태 → React Query\n' +
          'function UserProfile() {\n' +
          '  const { data: user } = useQuery({\n' +
          '    queryKey: ["user"],\n' +
          '    queryFn: fetchCurrentUser,\n' +
          '  });\n' +
          '  return <div>{user?.name}</div>;\n' +
          '}\n' +
          '\n' +
          '// 클라이언트 전역 상태 → Context 또는 전역 스토어\n' +
          'function ThemeToggle() {\n' +
          '  const { theme, toggleTheme } = useTheme(); // Context 사용\n' +
          '  return <button onClick={toggleTheme}>{theme}</button>;\n' +
          '}',
        description:
          "Prop Drilling을 해소하려면 상태 종류를 분류하고 적절한 도구를 선택해야 합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 상태 종류 | 예시 | 권장 도구 |\n" +
        "|-----------|------|----------|\n" +
        "| 로컬 UI 상태 | 모달, 입력값 | useState, useReducer |\n" +
        "| 공유 UI 상태 | 테마, 언어 | Context API |\n" +
        "| 전역 클라이언트 상태 | 인증, 장바구니 | Redux, Zustand |\n" +
        "| 서버 상태 | API 데이터 | React Query, SWR |\n\n" +
        "**핵심:** 모든 상태를 하나의 도구로 관리하려 하지 마세요. 상태의 종류를 먼저 분류하고, 각각에 맞는 도구를 선택하는 것이 현대 React 상태 관리의 핵심입니다.\n\n" +
        "**다음 챕터 미리보기:** Context API를 심화 학습하여 다중 Context 설계와 리렌더링 최적화를 다룹니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "상태 관리의 핵심은 '이 상태가 어디에 있어야 하는가'다. 로컬 state → Context → 외부 라이브러리 순서로, 필요한 만큼만 복잡성을 올려라.",
  checklist: [
    "로컬 상태와 전역 상태의 차이를 설명할 수 있다",
    "서버 상태와 클라이언트 상태의 차이를 설명할 수 있다",
    "Prop Drilling이 무엇이고 왜 문제인지 설명할 수 있다",
    "전역 상태가 필요한 시점을 판단할 수 있다",
    "상태 종류별로 적절한 관리 도구를 선택할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "다음 중 서버 상태에 해당하는 것은?",
      choices: [
        "모달의 열림/닫힘 상태",
        "API에서 가져온 사용자 목록",
        "다크 모드 설정",
        "폼 입력값",
      ],
      correctIndex: 1,
      explanation:
        "API에서 가져온 데이터는 서버 상태입니다. 캐싱, 재검증, 동기화 등 서버 상태 고유의 문제를 처리해야 합니다.",
    },
    {
      id: "q2",
      question: "Prop Drilling의 주요 문제점은?",
      choices: [
        "성능이 크게 저하된다",
        "중간 컴포넌트가 불필요한 props를 전달해야 한다",
        "TypeScript에서 사용할 수 없다",
        "서버 컴포넌트에서 동작하지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "Prop Drilling의 핵심 문제는 중간 컴포넌트들이 자신은 사용하지 않는 props를 전달만 해야 한다는 것입니다. 유지보수와 리팩토링이 어려워집니다.",
    },
    {
      id: "q3",
      question: "자주 변경되는 전역 상태 관리에 Context API가 적합하지 않은 이유는?",
      choices: [
        "Context API는 전역 상태를 지원하지 않아서",
        "Context 값이 변경되면 모든 Consumer가 리렌더링되어서",
        "Context API는 TypeScript를 지원하지 않아서",
        "Context API는 React 18에서 제거되어서",
      ],
      correctIndex: 1,
      explanation:
        "Context 값이 변경되면 해당 Context를 구독하는 모든 컴포넌트가 리렌더링됩니다. 자주 변경되는 값에는 셀렉터 기반 최적화가 가능한 전역 상태 라이브러리가 적합합니다.",
    },
    {
      id: "q4",
      question: "다음 중 상태를 로컬에 유지해야 하는 경우는?",
      choices: [
        "사용자 인증 토큰",
        "앱 전체 테마 설정",
        "특정 폼의 입력값",
        "장바구니 아이템 목록",
      ],
      correctIndex: 2,
      explanation:
        "폼 입력값은 해당 폼 컴포넌트에서만 사용하므로 로컬 상태로 관리하는 것이 적합합니다. 나머지는 여러 컴포넌트에서 공유가 필요한 전역 상태입니다.",
    },
    {
      id: "q5",
      question:
        "서버 상태 관리에 React Query나 SWR 같은 전용 라이브러리를 사용하는 가장 큰 이유는?",
      choices: [
        "Redux보다 번들 크기가 작아서",
        "캐싱, 재검증, 로딩/에러 상태를 자동으로 처리해주어서",
        "Context API와 함께 사용할 수 없어서",
        "서버 컴포넌트에서만 동작해서",
      ],
      correctIndex: 1,
      explanation:
        "서버 상태 전용 라이브러리는 캐싱, 백그라운드 재검증, 로딩/에러 상태, 중복 요청 제거 등을 자동으로 처리하여 서버 상태의 복잡성을 크게 줄여줍니다.",
    },
  ],
};

export default chapter;
