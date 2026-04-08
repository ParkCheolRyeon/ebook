import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "21-architecture-principles",
  subject: "cs",
  title: "아키텍처 원칙",
  description: "SOLID 원칙, 관심사 분리, 의존성 역전, 클린 아키텍처, Feature-Sliced Design 등 프론트엔드 아키텍처 원칙을 학습합니다.",
  order: 21,
  group: "소프트웨어 공학",
  prerequisites: ["19-clean-code"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "소프트웨어 아키텍처는 '도시 설계'와 같습니다.\n\n" +
        "**관심사 분리(SoC)** — 도시에서 주거지역, 상업지역, 공업지역을 구분하는 것입니다. " +
        "각 영역이 명확한 역할을 가지면 변경과 확장이 쉬워집니다.\n\n" +
        "**SOLID 원칙** — 건축 법규와 같습니다. 건물마다 용도가 하나(단일 책임), " +
        "증축은 가능하되 기존 구조를 변경하지 않고(개방-폐쇄), 모든 건물은 기본 안전 기준을 충족(리스코프), " +
        "불필요한 규제를 강요하지 않고(인터페이스 분리), 상위 정책이 하위 세부사항에 의존하지 않습니다(의존성 역전).\n\n" +
        "**클린 아키텍처** — 양파 껍질 구조입니다. 중심(비즈니스 규칙)은 바깥(UI, 데이터베이스)에 의존하지 않고, " +
        "바깥 껍질만 중심을 의존합니다. UI 프레임워크를 바꿔도 핵심 로직은 영향받지 않습니다.\n\n" +
        "**Feature-Sliced Design** — 아파트 단지에서 각 동이 독립적으로 운영되는 것입니다. " +
        "인증 기능, 상품 기능, 결제 기능이 각각 독립적인 '동'으로 분리됩니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 프로젝트가 커지면서 발생하는 아키텍처 문제들:\n\n" +
        "**1. 스파게티 의존성:**\n" +
        "```typescript\n" +
        "// ProductList가 인증, 장바구니, 분석, 알림 모듈에 직접 의존\n" +
        "import { useAuth } from '../auth/useAuth';\n" +
        "import { addToCart } from '../cart/cartService';\n" +
        "import { trackEvent } from '../analytics/tracker';\n" +
        "import { showNotification } from '../notification/service';\n" +
        "\n" +
        "function ProductList() {\n" +
        "  // auth, cart, analytics, notification에 모두 결합\n" +
        "  // 하나라도 변경되면 이 컴포넌트도 영향\n" +
        "}\n" +
        "```\n\n" +
        "**2. 변경의 연쇄 반응:** 하나의 API 응답 형식이 바뀌면 10개 이상의 컴포넌트를 수정해야 합니다.\n\n" +
        "**3. 거대한 공유 폴더:**\n" +
        "```\n" +
        "src/\n" +
        "  components/   ← 200개의 컴포넌트가 뒤섞여 있음\n" +
        "  hooks/        ← 50개의 훅이 뒤섞여 있음\n" +
        "  utils/        ← 어떤 기능에서 쓰이는지 알 수 없음\n" +
        "```\n\n" +
        "**4. 프레임워크 종속:** 비즈니스 로직이 React 컴포넌트에 직접 구현되어 " +
        "프레임워크 교체나 서버 사이드 재사용이 불가능합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. SOLID 원칙 in 프론트엔드\n\n" +
        "**S — 단일 책임 원칙 (SRP)**\n" +
        "```typescript\n" +
        "// 나쁜 예: 한 컴포넌트가 데이터 페칭 + 비즈니스 로직 + UI를 모두 담당\n" +
        "// 좋은 예: 각 역할을 분리\n" +
        "// useProducts() — 데이터 페칭\n" +
        "// calculateDiscount() — 비즈니스 로직\n" +
        "// ProductCard — UI 표현\n" +
        "```\n\n" +
        "**O — 개방-폐쇄 원칙 (OCP)**\n" +
        "```typescript\n" +
        "// 확장에는 열려 있고, 수정에는 닫혀 있음\n" +
        "// 새 차트 타입을 추가해도 기존 코드를 수정하지 않음\n" +
        "const chartRenderers: Record<string, React.ComponentType<ChartProps>> = {\n" +
        "  bar: BarChart,\n" +
        "  line: LineChart,\n" +
        "  pie: PieChart, // 새 타입 추가 — 기존 코드 수정 없음\n" +
        "};\n" +
        "```\n\n" +
        "**D — 의존성 역전 원칙 (DIP)**\n" +
        "```typescript\n" +
        "// 추상(인터페이스)에 의존, 구체 구현에 의존하지 않음\n" +
        "interface ApiClient {\n" +
        "  get<T>(url: string): Promise<T>;\n" +
        "  post<T>(url: string, body: unknown): Promise<T>;\n" +
        "}\n" +
        "\n" +
        "// 컴포넌트는 ApiClient 인터페이스에만 의존\n" +
        "function useProducts(api: ApiClient) {\n" +
        "  return api.get<Product[]>('/products');\n" +
        "}\n" +
        "\n" +
        "// 구현은 나중에 교체 가능 (fetch → axios, mock 등)\n" +
        "```\n\n" +
        "### 2. 관심사 분리 (Separation of Concerns)\n\n" +
        "```typescript\n" +
        "// 레이어별 분리\n" +
        "// 1. UI Layer — 컴포넌트, 스타일\n" +
        "// 2. Application Layer — 상태 관리, 유스케이스\n" +
        "// 3. Domain Layer — 비즈니스 규칙, 엔티티\n" +
        "// 4. Infrastructure Layer — API, 스토리지, 외부 서비스\n" +
        "```\n\n" +
        "### 3. Feature-Sliced Design (FSD)\n\n" +
        "```\n" +
        "src/\n" +
        "  app/          ← 앱 전역 설정 (라우터, 프로바이더)\n" +
        "  pages/        ← 라우트별 페이지 조합\n" +
        "  widgets/      ← 독립적 UI 블록 (Header, Sidebar)\n" +
        "  features/     ← 사용자 시나리오 (auth, cart, search)\n" +
        "  entities/     ← 비즈니스 엔티티 (user, product, order)\n" +
        "  shared/       ← 공용 유틸, UI 키트\n" +
        "```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 클린 아키텍처 레이어",
      content:
        "프론트엔드에 클린 아키텍처를 적용하는 구체적 구현 예시입니다. " +
        "비즈니스 로직을 프레임워크(React)로부터 분리합니다.",
      code: {
        language: "typescript",
        code:
          "// === 1. Domain Layer (프레임워크 무관) ===\n" +
          "// domain/entities/Product.ts\n" +
          "interface Product {\n" +
          "  id: string;\n" +
          "  name: string;\n" +
          "  price: number;\n" +
          "  discountRate: number;\n" +
          "}\n" +
          "\n" +
          "// domain/services/pricingService.ts\n" +
          "// 순수 함수 — React에 의존하지 않음\n" +
          "function calculateFinalPrice(product: Product): number {\n" +
          "  return Math.round(product.price * (1 - product.discountRate));\n" +
          "}\n" +
          "\n" +
          "function isAffordable(product: Product, budget: number): boolean {\n" +
          "  return calculateFinalPrice(product) <= budget;\n" +
          "}\n" +
          "\n" +
          "// === 2. Infrastructure Layer (외부 의존성) ===\n" +
          "// infra/api/productApi.ts\n" +
          "interface ProductRepository {\n" +
          "  getAll(): Promise<Product[]>;\n" +
          "  getById(id: string): Promise<Product>;\n" +
          "}\n" +
          "\n" +
          "// 구체 구현 — fetch 사용\n" +
          "const httpProductRepo: ProductRepository = {\n" +
          "  async getAll() {\n" +
          "    const res = await fetch('/api/products');\n" +
          "    return res.json();\n" +
          "  },\n" +
          "  async getById(id) {\n" +
          "    const res = await fetch(`/api/products/${id}`);\n" +
          "    return res.json();\n" +
          "  },\n" +
          "};\n" +
          "\n" +
          "// 테스트용 Mock 구현\n" +
          "const mockProductRepo: ProductRepository = {\n" +
          "  async getAll() {\n" +
          "    return [{ id: '1', name: 'Test', price: 10000, discountRate: 0.1 }];\n" +
          "  },\n" +
          "  async getById(id) {\n" +
          "    return { id, name: 'Test', price: 10000, discountRate: 0.1 };\n" +
          "  },\n" +
          "};\n" +
          "\n" +
          "// === 3. Application Layer (유스케이스) ===\n" +
          "// application/useCases/getAffordableProducts.ts\n" +
          "async function getAffordableProducts(\n" +
          "  repo: ProductRepository,\n" +
          "  budget: number\n" +
          "): Promise<Product[]> {\n" +
          "  const products = await repo.getAll();\n" +
          "  return products.filter(p => isAffordable(p, budget));\n" +
          "}\n" +
          "\n" +
          "// === 4. UI Layer (React) ===\n" +
          "// ui/hooks/useAffordableProducts.ts\n" +
          "function useAffordableProducts(budget: number) {\n" +
          "  const [products, setProducts] = useState<Product[]>([]);\n" +
          "  const [isLoading, setIsLoading] = useState(true);\n" +
          "\n" +
          "  useEffect(() => {\n" +
          "    getAffordableProducts(httpProductRepo, budget)\n" +
          "      .then(setProducts)\n" +
          "      .finally(() => setIsLoading(false));\n" +
          "  }, [budget]);\n" +
          "\n" +
          "  return { products, isLoading };\n" +
          "}\n" +
          "\n" +
          "// ui/components/ProductList.tsx — UI만 담당\n" +
          "function ProductList({ budget }: { budget: number }) {\n" +
          "  const { products, isLoading } = useAffordableProducts(budget);\n" +
          "  if (isLoading) return <Spinner />;\n" +
          "  return products.map(p => <ProductCard key={p.id} product={p} />);\n" +
          "}",
        description:
          "클린 아키텍처에서 의존성은 바깥에서 안으로만 흐릅니다. " +
          "Domain(비즈니스 규칙)은 어디에도 의존하지 않고, Infrastructure(API)는 인터페이스를 통해 " +
          "교체 가능하며, UI(React)는 가장 바깥 레이어로 다른 모든 것에 의존합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 모듈형 Feature 구조",
      content:
        "Feature-Sliced Design 원칙에 따라 인증 기능을 독립적인 모듈로 구성하는 실습입니다.",
      code: {
        language: "typescript",
        code:
          "// === features/auth 모듈 구조 ===\n" +
          "// features/auth/\n" +
          "//   index.ts          ← Public API (외부에 노출할 것만)\n" +
          "//   model/types.ts    ← 타입 정의\n" +
          "//   model/authStore.ts ← 상태 관리\n" +
          "//   api/authApi.ts    ← API 호출\n" +
          "//   ui/LoginForm.tsx  ← UI 컴포넌트\n" +
          "//   lib/tokenUtils.ts ← 유틸리티\n" +
          "\n" +
          "// --- model/types.ts ---\n" +
          "interface User {\n" +
          "  id: string;\n" +
          "  email: string;\n" +
          "  name: string;\n" +
          "  role: 'user' | 'admin';\n" +
          "}\n" +
          "\n" +
          "interface AuthState {\n" +
          "  user: User | null;\n" +
          "  isAuthenticated: boolean;\n" +
          "  isLoading: boolean;\n" +
          "}\n" +
          "\n" +
          "// --- api/authApi.ts ---\n" +
          "interface AuthApi {\n" +
          "  login(email: string, password: string): Promise<{ user: User; token: string }>;\n" +
          "  logout(): Promise<void>;\n" +
          "  refresh(): Promise<{ token: string }>;\n" +
          "}\n" +
          "\n" +
          "const authApi: AuthApi = {\n" +
          "  async login(email, password) {\n" +
          "    const res = await fetch('/api/auth/login', {\n" +
          "      method: 'POST',\n" +
          "      body: JSON.stringify({ email, password }),\n" +
          "      headers: { 'Content-Type': 'application/json' },\n" +
          "    });\n" +
          "    if (!res.ok) throw new Error('로그인 실패');\n" +
          "    return res.json();\n" +
          "  },\n" +
          "  async logout() {\n" +
          "    await fetch('/api/auth/logout', { method: 'POST' });\n" +
          "  },\n" +
          "  async refresh() {\n" +
          "    const res = await fetch('/api/auth/refresh', { method: 'POST' });\n" +
          "    return res.json();\n" +
          "  },\n" +
          "};\n" +
          "\n" +
          "// --- lib/tokenUtils.ts ---\n" +
          "function saveToken(token: string): void {\n" +
          "  localStorage.setItem('auth_token', token);\n" +
          "}\n" +
          "\n" +
          "function getToken(): string | null {\n" +
          "  return localStorage.getItem('auth_token');\n" +
          "}\n" +
          "\n" +
          "function isTokenExpired(token: string): boolean {\n" +
          "  try {\n" +
          "    const payload = JSON.parse(atob(token.split('.')[1]));\n" +
          "    return payload.exp * 1000 < Date.now();\n" +
          "  } catch {\n" +
          "    return true;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// --- index.ts (Public API) ---\n" +
          "// 외부에서는 이 파일만 import\n" +
          "export { LoginForm } from './ui/LoginForm';\n" +
          "export { useAuth } from './model/authStore';\n" +
          "export type { User, AuthState } from './model/types';\n" +
          "// 내부 구현(authApi, tokenUtils)은 노출하지 않음!\n" +
          "\n" +
          "// --- 사용하는 쪽 ---\n" +
          "// import { LoginForm, useAuth } from '@/features/auth';\n" +
          "// 내부 구현을 몰라도 됨 = 캡슐화",
        description:
          "Feature 모듈은 Public API(index.ts)를 통해서만 외부와 소통합니다. " +
          "내부 구현(API, 유틸)은 캡슐화되어 외부에서 직접 접근할 수 없습니다. " +
          "이렇게 하면 모듈 내부를 자유롭게 리팩토링할 수 있고, 모듈 간 결합도가 낮아집니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 원칙 | 핵심 | 프론트엔드 적용 |\n" +
        "|------|------|----------------|\n" +
        "| SRP | 하나의 모듈은 하나의 이유로만 변경 | 컴포넌트/Hook/서비스 분리 |\n" +
        "| OCP | 확장에 열림, 수정에 닫힘 | 레지스트리/맵 패턴 |\n" +
        "| DIP | 추상에 의존, 구체에 의존하지 않음 | 인터페이스 기반 API 레이어 |\n" +
        "| SoC | 관심사별 분리 | 레이어 아키텍처 |\n" +
        "| FSD | 기능별 독립 모듈 | Feature-Sliced Design |\n\n" +
        "**아키텍처 선택 기준:**\n" +
        "- 소규모 프로젝트 → 간단한 기능별 폴더 구조로 충분\n" +
        "- 중규모 프로젝트 → Feature-Sliced Design 또는 모듈형 구조\n" +
        "- 대규모 프로젝트 → 클린 아키텍처 레이어 + 모노레포\n\n" +
        "**과도한 아키텍처는 독이다:** 작은 프로젝트에 과도한 계층 구조를 적용하면 " +
        "오히려 복잡성만 증가합니다. 프로젝트 규모에 맞는 적절한 수준의 아키텍처를 선택하세요.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "아키텍처 원칙은 변경에 강하고 확장 가능한 구조를 만드는 것이 목표이며, SOLID, 관심사 분리, 의존성 역전이 핵심이다.",
  checklist: [
    "SOLID 원칙 5가지를 프론트엔드 코드에 적용한 예시를 설명할 수 있다",
    "의존성 역전 원칙(DIP)으로 API 레이어를 인터페이스 기반으로 설계할 수 있다",
    "클린 아키텍처의 레이어(Domain, Infrastructure, Application, UI)를 구분할 수 있다",
    "Feature-Sliced Design의 구조와 Public API 패턴을 이해한다",
    "프로젝트 규모에 따른 적절한 아키텍처 수준을 판단할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "SOLID에서 '단일 책임 원칙(SRP)'을 프론트엔드에 적용한 예시로 가장 적절한 것은?",
      choices: [
        "한 컴포넌트에서 데이터 페칭, 비즈니스 로직, UI를 모두 처리",
        "데이터 페칭은 Hook으로, 비즈니스 로직은 서비스 함수로, UI는 컴포넌트로 분리",
        "모든 상태를 전역 스토어에 보관",
        "하나의 파일에 모든 타입을 정의",
      ],
      correctIndex: 1,
      explanation:
        "SRP에 따르면 각 모듈은 하나의 변경 이유만 가져야 합니다. " +
        "데이터 페칭 로직이 바뀔 때는 Hook만, UI가 바뀔 때는 컴포넌트만, " +
        "비즈니스 규칙이 바뀔 때는 서비스 함수만 수정하면 됩니다.",
    },
    {
      id: "q2",
      question: "의존성 역전 원칙(DIP)에서 '역전'이 의미하는 것은?",
      choices: [
        "코드 실행 순서를 뒤집는 것",
        "상위 모듈이 하위 모듈에 의존하는 것",
        "상위 모듈과 하위 모듈 모두 추상(인터페이스)에 의존하게 하여 의존 방향을 바꾸는 것",
        "프레임워크를 교체하는 것",
      ],
      correctIndex: 2,
      explanation:
        "일반적으로 상위 모듈(비즈니스 로직)이 하위 모듈(API 구현)에 직접 의존합니다. " +
        "DIP는 중간에 인터페이스를 두어 두 모듈 모두 추상에 의존하게 합니다. " +
        "이를 통해 API 구현을 교체해도 비즈니스 로직에 영향이 없습니다.",
    },
    {
      id: "q3",
      question: "클린 아키텍처에서 의존성이 흐르는 올바른 방향은?",
      choices: [
        "Domain → Infrastructure → UI",
        "UI → Application → Domain (바깥에서 안으로)",
        "Infrastructure → Domain → UI",
        "모든 레이어가 서로 의존",
      ],
      correctIndex: 1,
      explanation:
        "클린 아키텍처에서 의존성은 바깥(UI)에서 안(Domain)으로만 흐릅니다. " +
        "Domain(비즈니스 규칙)은 어디에도 의존하지 않고, UI는 Application을, " +
        "Application은 Domain을 의존합니다. 이를 통해 핵심 로직이 외부 변경으로부터 보호됩니다.",
    },
    {
      id: "q4",
      question: "Feature-Sliced Design에서 index.ts로 Public API만 노출하는 이유는?",
      choices: [
        "파일 크기를 줄이기 위해",
        "모듈 내부 구현을 캡슐화해 외부 모듈과의 결합도를 낮추기 위해",
        "TypeScript 컴파일 속도를 높이기 위해",
        "코드 리뷰를 쉽게 하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "Public API를 통해서만 모듈에 접근하면, 모듈 내부를 자유롭게 리팩토링할 수 있습니다. " +
        "외부에서 내부 구현(authApi, tokenUtils)에 직접 접근하면 내부 변경이 " +
        "외부에 연쇄적으로 영향을 미칩니다. 캡슐화는 유지보수성의 핵심입니다.",
    },
    {
      id: "q5",
      question: "소규모 프로젝트에 과도한 아키텍처를 적용하면 발생하는 문제는?",
      choices: [
        "성능이 떨어진다",
        "보안이 취약해진다",
        "불필요한 추상화 계층으로 복잡성만 증가하고 개발 속도가 느려진다",
        "테스트를 작성할 수 없다",
      ],
      correctIndex: 2,
      explanation:
        "소규모 프로젝트에 클린 아키텍처 4계층을 모두 적용하면 간단한 기능도 " +
        "4개 파일에 걸쳐 구현해야 합니다. YAGNI(You Aren't Gonna Need It) 원칙에 따라 " +
        "프로젝트 규모와 복잡도에 맞는 적절한 수준의 아키텍처를 선택해야 합니다.",
    },
  ],
};

export default chapter;
