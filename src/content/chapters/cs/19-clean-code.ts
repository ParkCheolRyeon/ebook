import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "19-clean-code",
  subject: "cs",
  title: "클린 코드",
  description: "가독성 높고 유지보수하기 쉬운 코드를 작성하는 원칙과 프론트엔드 특화 리팩토링 기법을 학습합니다.",
  order: 19,
  group: "소프트웨어 공학",
  prerequisites: [],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "클린 코드는 '잘 정리된 주방'과 같습니다.\n\n" +
        "**이름 짓기** — 양념통에 라벨이 없으면 매번 뚜껑을 열어 확인해야 합니다. " +
        "변수명과 함수명은 코드의 라벨입니다. `d`보다 `daysSinceLastLogin`이 의도를 명확히 전달합니다.\n\n" +
        "**함수 크기** — 레시피가 한 페이지에 모든 과정을 담으면 따라하기 어렵습니다. " +
        "'재료 준비', '조리', '플레이팅'으로 나누면 각 단계가 명확해집니다. " +
        "함수도 하나의 책임만 가져야 합니다.\n\n" +
        "**DRY (Don't Repeat Yourself)** — 같은 양념 비율을 매번 측정하는 대신 " +
        "미리 혼합해 두면 효율적입니다. 하지만 과도한 추상화는 오히려 복잡성을 높입니다.\n\n" +
        "**코드 스멜** — 냉장고에서 이상한 냄새가 나면 어딘가 상한 음식이 있다는 신호입니다. " +
        "코드에서도 긴 함수, 매직 넘버, 깊은 중첩은 리팩토링이 필요하다는 신호입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 코드에서 흔히 발견되는 '나쁜 코드' 패턴들:\n\n" +
        "**1. 의미 없는 이름:**\n" +
        "```typescript\n" +
        "// 나쁜 코드 — 무엇을 의미하는지 알 수 없음\n" +
        "const d = new Date();\n" +
        "const arr = data.filter(x => x.a > 5);\n" +
        "function handle(e: any) { /* ... */ }\n" +
        "```\n\n" +
        "**2. 거대한 컴포넌트:**\n" +
        "```typescript\n" +
        "// 나쁜 코드 — 한 컴포넌트에 모든 것이 섞여 있음\n" +
        "function ProductPage() {\n" +
        "  // 200줄의 상태 관리, API 호출, 이벤트 핸들러, UI 로직...\n" +
        "  // 어디서 무엇을 하는지 파악하기 어려움\n" +
        "}\n" +
        "```\n\n" +
        "**3. 매직 넘버와 매직 스트링:**\n" +
        "```typescript\n" +
        "// 나쁜 코드 — 3000이 무엇인지 알 수 없음\n" +
        "if (items.length > 3000) showWarning();\n" +
        "setTimeout(callback, 86400000); // 이 숫자는 무엇?\n" +
        "```\n\n" +
        "**4. 과도한 중첩:**\n" +
        "```typescript\n" +
        "// 나쁜 코드 — 화살표 모양(arrow anti-pattern)\n" +
        "if (user) {\n" +
        "  if (user.isActive) {\n" +
        "    if (user.permissions.includes('admin')) {\n" +
        "      if (data) {\n" +
        "        // 실제 로직이 여기에...\n" +
        "      }\n" +
        "    }\n" +
        "  }\n" +
        "}\n" +
        "```",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. 의미 있는 이름 짓기\n\n" +
        "```typescript\n" +
        "// 변수: 명사형, 의도를 명확히\n" +
        "const maxItemsPerPage = 20;\n" +
        "const isUserLoggedIn = !!session;\n" +
        "const activeUsers = users.filter(u => u.isActive);\n" +
        "\n" +
        "// 함수: 동사형, 무엇을 하는지 명확히\n" +
        "function calculateTotalPrice(items: CartItem[]): number { /* ... */ }\n" +
        "function fetchUserProfile(userId: string): Promise<User> { /* ... */ }\n" +
        "\n" +
        "// 컴포넌트: PascalCase, 역할을 설명\n" +
        "function ProductCard({ product }: Props) { /* ... */ }\n" +
        "function useDebounce<T>(value: T, delay: number): T { /* ... */ }\n" +
        "\n" +
        "// Props: 의도를 설명하는 이름\n" +
        "interface ButtonProps {\n" +
        "  isLoading: boolean;   // 'loading' 대신 boolean 접두사\n" +
        "  onClick: () => void;  // 'handler' 대신 on + 동사\n" +
        "  variant: 'primary' | 'secondary'; // string 대신 유니온 타입\n" +
        "}\n" +
        "```\n\n" +
        "### 2. 작은 함수, 단일 책임\n\n" +
        "```typescript\n" +
        "// 리팩토링 전: 한 함수에 모든 로직\n" +
        "function processOrder(order: Order) {\n" +
        "  // 유효성 검사 + 할인 계산 + 재고 확인 + 결제 + 이메일 발송\n" +
        "}\n" +
        "\n" +
        "// 리팩토링 후: 각 단계를 분리\n" +
        "function processOrder(order: Order) {\n" +
        "  validateOrder(order);\n" +
        "  const discounted = applyDiscount(order);\n" +
        "  checkInventory(discounted);\n" +
        "  chargePayment(discounted);\n" +
        "  sendConfirmation(discounted);\n" +
        "}\n" +
        "```\n\n" +
        "### 3. 매직 넘버 제거\n\n" +
        "```typescript\n" +
        "// 상수로 의미 부여\n" +
        "const MAX_ITEMS_WARNING = 3000;\n" +
        "const ONE_DAY_MS = 24 * 60 * 60 * 1000;\n" +
        "\n" +
        "if (items.length > MAX_ITEMS_WARNING) showWarning();\n" +
        "setTimeout(callback, ONE_DAY_MS);\n" +
        "```\n\n" +
        "### 4. 조기 반환(Early Return)으로 중첩 제거\n\n" +
        "```typescript\n" +
        "// 가드 절(Guard Clause)로 플랫하게\n" +
        "function getAdminData(user: User | null, data: Data | null) {\n" +
        "  if (!user) return null;\n" +
        "  if (!user.isActive) return null;\n" +
        "  if (!user.permissions.includes('admin')) return null;\n" +
        "  if (!data) return null;\n" +
        "  \n" +
        "  return processAdminData(data); // 핵심 로직\n" +
        "}\n" +
        "```\n\n" +
        "### 5. DRY vs WET\n\n" +
        "```typescript\n" +
        "// DRY: 중복을 추상화로 제거\n" +
        "const formatCurrency = (amount: number) =>\n" +
        "  new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);\n" +
        "\n" +
        "// WET (Write Everything Twice): 과도한 추상화 경계\n" +
        "// 2번까지는 중복을 허용하고, 3번째부터 추상화를 고려\n" +
        "// \"잘못된 추상화보다 중복이 낫다\" — Sandi Metz\n" +
        "```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 컴포넌트 리팩토링",
      content:
        "거대한 컴포넌트를 클린 코드 원칙에 따라 분리하는 리팩토링 과정을 보여줍니다.",
      code: {
        language: "typescript",
        code:
          "// === 리팩토링 전: 거대한 컴포넌트 ===\n" +
          "// function UserProfile({ userId }: { userId: string }) {\n" +
          "//   const [user, setUser] = useState(null);\n" +
          "//   const [posts, setPosts] = useState([]);\n" +
          "//   const [isEditing, setIsEditing] = useState(false);\n" +
          "//   // ... 100줄의 useEffect, 핸들러, 조건부 렌더링\n" +
          "// }\n" +
          "\n" +
          "// === 리팩토링 후: 관심사 분리 ===\n" +
          "\n" +
          "// 1. 데이터 로직 → 커스텀 Hook\n" +
          "function useUserProfile(userId: string) {\n" +
          "  const [user, setUser] = useState<User | null>(null);\n" +
          "  const [isLoading, setIsLoading] = useState(true);\n" +
          "  const [error, setError] = useState<Error | null>(null);\n" +
          "\n" +
          "  useEffect(() => {\n" +
          "    setIsLoading(true);\n" +
          "    fetchUser(userId)\n" +
          "      .then(setUser)\n" +
          "      .catch(setError)\n" +
          "      .finally(() => setIsLoading(false));\n" +
          "  }, [userId]);\n" +
          "\n" +
          "  return { user, isLoading, error };\n" +
          "}\n" +
          "\n" +
          "// 2. 프레젠테이션 컴포넌트 → UI만 담당\n" +
          "function UserCard({ user }: { user: User }) {\n" +
          "  return (\n" +
          "    <div className=\"user-card\">\n" +
          "      <Avatar src={user.avatar} alt={user.name} />\n" +
          "      <h2>{user.name}</h2>\n" +
          "      <p>{user.bio}</p>\n" +
          "    </div>\n" +
          "  );\n" +
          "}\n" +
          "\n" +
          "// 3. 상태별 UI 컴포넌트\n" +
          "function LoadingSpinner() {\n" +
          "  return <div className=\"spinner\" aria-label=\"로딩 중\" />;\n" +
          "}\n" +
          "\n" +
          "function ErrorMessage({ error }: { error: Error }) {\n" +
          "  return <div role=\"alert\">{error.message}</div>;\n" +
          "}\n" +
          "\n" +
          "// 4. 조합 — 각 파트를 조합하는 컨테이너\n" +
          "function UserProfile({ userId }: { userId: string }) {\n" +
          "  const { user, isLoading, error } = useUserProfile(userId);\n" +
          "\n" +
          "  if (isLoading) return <LoadingSpinner />;\n" +
          "  if (error) return <ErrorMessage error={error} />;\n" +
          "  if (!user) return null;\n" +
          "\n" +
          "  return <UserCard user={user} />;\n" +
          "}",
        description:
          "거대한 컴포넌트를 Hook(데이터), 프레젠테이션(UI), 컨테이너(조합)로 분리합니다. " +
          "각 파트는 단일 책임을 가지며, 독립적으로 테스트하고 재사용할 수 있습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 코드 스멜 식별과 리팩토링",
      content:
        "일반적인 코드 스멜을 식별하고 클린 코드로 개선하는 실습입니다.",
      code: {
        language: "typescript",
        code:
          "// === 코드 스멜 1: 긴 매개변수 목록 ===\n" +
          "// 나쁜 코드\n" +
          "function createUser(\n" +
          "  name: string, email: string, age: number,\n" +
          "  address: string, phone: string, role: string\n" +
          ") { /* ... */ }\n" +
          "\n" +
          "// 개선: 객체 매개변수 사용\n" +
          "interface CreateUserParams {\n" +
          "  name: string;\n" +
          "  email: string;\n" +
          "  age: number;\n" +
          "  address?: string;\n" +
          "  phone?: string;\n" +
          "  role?: 'user' | 'admin';\n" +
          "}\n" +
          "function createUser(params: CreateUserParams) { /* ... */ }\n" +
          "\n" +
          "// === 코드 스멜 2: boolean 매개변수 ===\n" +
          "// 나쁜 코드 — 호출부에서 true가 무엇인지 알 수 없음\n" +
          "// renderButton('Submit', true, false, true)\n" +
          "\n" +
          "// 개선: 객체로 명확하게\n" +
          "interface ButtonConfig {\n" +
          "  label: string;\n" +
          "  isPrimary?: boolean;\n" +
          "  isDisabled?: boolean;\n" +
          "  isFullWidth?: boolean;\n" +
          "}\n" +
          "function renderButton(config: ButtonConfig) { /* ... */ }\n" +
          "\n" +
          "// === 코드 스멜 3: 중복 조건문 ===\n" +
          "// 나쁜 코드\n" +
          "function getStatusText(status: string): string {\n" +
          "  if (status === 'pending') return '대기 중';\n" +
          "  if (status === 'active') return '활성';\n" +
          "  if (status === 'inactive') return '비활성';\n" +
          "  return '알 수 없음';\n" +
          "}\n" +
          "function getStatusColor(status: string): string {\n" +
          "  if (status === 'pending') return 'yellow';\n" +
          "  if (status === 'active') return 'green';\n" +
          "  if (status === 'inactive') return 'gray';\n" +
          "  return 'black';\n" +
          "}\n" +
          "\n" +
          "// 개선: 맵 객체로 통합\n" +
          "const STATUS_CONFIG = {\n" +
          "  pending: { text: '대기 중', color: 'yellow' },\n" +
          "  active: { text: '활성', color: 'green' },\n" +
          "  inactive: { text: '비활성', color: 'gray' },\n" +
          "} as const;\n" +
          "\n" +
          "type Status = keyof typeof STATUS_CONFIG;\n" +
          "\n" +
          "function getStatusConfig(status: Status) {\n" +
          "  return STATUS_CONFIG[status] ?? { text: '알 수 없음', color: 'black' };\n" +
          "}\n" +
          "\n" +
          "// === 코드 스멜 4: 프론트엔드 파일 구조 ===\n" +
          "// 나쁜 구조: 타입별 그룹핑\n" +
          "// src/components/  (모든 컴포넌트)\n" +
          "// src/hooks/       (모든 훅)\n" +
          "// src/utils/       (모든 유틸)\n" +
          "\n" +
          "// 개선: 기능별 그룹핑 (Feature-based)\n" +
          "// src/features/auth/components/LoginForm.tsx\n" +
          "// src/features/auth/hooks/useAuth.ts\n" +
          "// src/features/auth/utils/validateToken.ts\n" +
          "// src/features/products/components/ProductList.tsx\n" +
          "// src/features/products/hooks/useProducts.ts",
        description:
          "코드 스멜은 더 깊은 설계 문제의 표면적 증상입니다. " +
          "긴 매개변수 목록은 객체 패턴으로, 중복 조건문은 맵 객체로, " +
          "boolean 매개변수는 설정 객체로 개선할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 원칙 | 설명 | 프론트엔드 적용 |\n" +
        "|------|------|----------------|\n" +
        "| 의미 있는 이름 | 의도가 드러나는 이름 사용 | 컴포넌트/Hook/Props 네이밍 규칙 |\n" +
        "| 작은 함수 | 하나의 함수는 하나의 일 | 컴포넌트 분리, 커스텀 Hook 추출 |\n" +
        "| DRY | 중복을 적절히 제거 | 공통 컴포넌트, 유틸 함수 |\n" +
        "| 조기 반환 | 가드 절로 중첩 제거 | 로딩/에러/빈 상태 처리 |\n" +
        "| 상수화 | 매직 넘버/스트링 제거 | 설정값, 상태 맵 객체 |\n\n" +
        "**클린 코드의 핵심 지표:**\n" +
        "- 새 팀원이 코드를 이해하는 데 걸리는 시간이 짧다\n" +
        "- 기능 변경 시 수정해야 할 곳이 명확하고 적다\n" +
        "- 버그 발생 시 원인을 찾기 쉽다\n" +
        "- 코드 리뷰에서 '이 부분이 뭐예요?'라는 질문이 없다",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "클린 코드는 '작동하는 코드'를 넘어 '읽기 쉽고 변경하기 쉬운 코드'를 목표로 하며, 의미 있는 이름, 단일 책임, 적절한 추상화가 핵심이다.",
  checklist: [
    "변수, 함수, 컴포넌트에 의도가 드러나는 이름을 지을 수 있다",
    "거대한 컴포넌트를 Hook, 프레젠테이션, 컨테이너로 분리할 수 있다",
    "조기 반환(Guard Clause)으로 중첩된 조건문을 평탄화할 수 있다",
    "매직 넘버와 중복 조건문을 상수와 맵 객체로 개선할 수 있다",
    "DRY와 WET의 균형을 이해하고 적절한 추상화 시점을 판단할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "다음 중 가장 좋은 변수 이름은?",
      choices: [
        "d",
        "data",
        "daysSinceLastLogin",
        "dsll",
      ],
      correctIndex: 2,
      explanation:
        "daysSinceLastLogin은 변수의 의도(마지막 로그인 이후 경과 일수)를 명확히 전달합니다. " +
        "d, dsll은 줄임말로 의미를 알 수 없고, data는 너무 범용적입니다.",
    },
    {
      id: "q2",
      question: "'가드 절(Guard Clause)' 패턴의 핵심 효과는?",
      choices: [
        "성능 향상",
        "예외 조건을 먼저 처리해 코드 중첩을 줄이고 핵심 로직을 명확하게 드러내는 것",
        "에러 발생을 완전히 방지하는 것",
        "코드 양을 줄이는 것",
      ],
      correctIndex: 1,
      explanation:
        "가드 절은 함수 초반에 예외 조건(null, 권한 부족 등)을 먼저 처리하고 반환합니다. " +
        "이를 통해 if-else 중첩을 없애고 함수의 핵심 로직(happy path)이 최상위 레벨에 위치하게 됩니다.",
    },
    {
      id: "q3",
      question: "Sandi Metz의 '잘못된 추상화보다 중복이 낫다'라는 말의 의미는?",
      choices: [
        "코드를 절대 추상화하지 말라",
        "2번 이상의 중복을 확인하기 전에 성급하게 추상화하면 오히려 복잡성이 증가한다",
        "DRY 원칙을 무시하라",
        "중복 코드가 항상 좋다",
      ],
      correctIndex: 1,
      explanation:
        "성급한 추상화는 실제로는 다른 맥락의 코드를 하나로 묶어 이후 변경을 어렵게 만듭니다. " +
        "AHA(Avoid Hasty Abstractions) 원칙에 따라 충분한 패턴이 보일 때까지 중복을 허용하고, " +
        "확신이 생겼을 때 추상화하는 것이 좋습니다.",
    },
    {
      id: "q4",
      question: "프론트엔드 프로젝트에서 '기능별(Feature-based) 폴더 구조'의 장점은?",
      choices: [
        "파일 수가 줄어든다",
        "관련된 파일(컴포넌트, Hook, 유틸)이 함께 위치해 응집도가 높고 탐색이 쉽다",
        "빌드 속도가 빨라진다",
        "타입 안전성이 향상된다",
      ],
      correctIndex: 1,
      explanation:
        "기능별 폴더 구조에서는 auth 기능의 컴포넌트, Hook, 유틸이 src/features/auth/ 아래에 모여 있어 " +
        "관련 코드를 한 곳에서 찾을 수 있습니다. 타입별 구조(components/, hooks/, utils/)는 " +
        "기능이 커질수록 관련 파일을 찾기 어려워집니다.",
    },
    {
      id: "q5",
      question: "다음 중 '코드 스멜'에 해당하지 않는 것은?",
      choices: [
        "300줄이 넘는 컴포넌트",
        "renderButton('Submit', true, false, true) 같은 boolean 매개변수 남용",
        "interface로 Props 타입을 정의하는 것",
        "setTimeout(fn, 86400000) 같은 매직 넘버",
      ],
      correctIndex: 2,
      explanation:
        "interface로 Props 타입을 정의하는 것은 오히려 좋은 관행(타입 안전성)입니다. " +
        "나머지는 모두 코드 스멜로, 거대 컴포넌트는 분리가, boolean 남용은 객체 패턴이, " +
        "매직 넘버는 상수 추출이 필요합니다.",
    },
  ],
};

export default chapter;
