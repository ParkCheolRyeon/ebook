import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "57-large-scale-architecture",
  subject: "react",
  title: "대규모 앱 설계",
  description:
    "모듈 경계, 의존성 방향, 레이어드 아키텍처, Feature Sliced Design, API 레이어 추상화를 학습합니다.",
  order: 57,
  group: "설계 패턴과 아키텍처",
  prerequisites: ["56-folder-structure"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "대규모 앱 설계는 **도시 계획**과 같습니다.\n\n" +
        "**모듈 경계**는 구역 구분입니다. 주거 지역, 상업 지역, 공업 지역을 명확히 나누면 각 구역이 독립적으로 발전할 수 있습니다.\n\n" +
        "**의존성 방향(안쪽으로)**은 도로 체계입니다. 외곽 도로에서 중심부로 갈 수 있지만, 중심부 도로가 외곽에 의존하면 교통이 마비됩니다. 핵심 비즈니스 로직(도심)은 UI(외곽)에 의존하지 않아야 합니다.\n\n" +
        "**API 레이어 추상화**는 우편 시스템입니다. 편지를 보낼 때 '우편함에 넣기'만 하면 됩니다. 배달 방법(기차, 트럭, 비행기)은 우편 시스템이 알아서 결정합니다. 백엔드 API 구현이 바뀌어도 프론트엔드는 영향받지 않습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프로젝트가 커지면서 발생하는 아키텍처 문제들입니다.\n\n" +
        "1. **스파게티 의존성** — 모듈 간 의존 관계가 복잡하게 얽혀서, 한 곳을 수정하면 예상치 못한 곳이 깨집니다.\n\n" +
        "2. **비즈니스 로직 분산** — 같은 비즈니스 규칙이 컴포넌트, API 호출, 유틸 함수 등 여러 곳에 중복됩니다.\n\n" +
        "3. **API 결합** — 컴포넌트가 특정 API 응답 구조에 직접 의존하면, 백엔드 변경 시 여러 컴포넌트를 수정해야 합니다.\n\n" +
        "4. **팀 간 충돌** — 여러 팀이 같은 코드베이스에서 작업할 때, 모듈 경계가 불명확하면 merge 충돌이 빈번합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 모듈 경계\n" +
        "각 모듈(feature)은 명확한 공개 API(index.ts)를 가지고, 내부 구현은 외부에 노출하지 않습니다. 모듈 간 통신은 공개 API를 통해서만 합니다.\n\n" +
        "### 의존성 방향 (안쪽으로)\n" +
        "클린 아키텍처의 핵심 원칙입니다:\n" +
        "- UI → Application(Hook) → Domain(비즈니스 로직) → Infrastructure(API)\n" +
        "- Domain은 어디에도 의존하지 않습니다\n" +
        "- 외부 레이어가 내부 레이어에 의존합니다 (절대 반대가 아님)\n\n" +
        "### Feature Sliced Design (FSD)\n" +
        "러시아 프론트엔드 커뮤니티에서 시작된 아키텍처입니다:\n" +
        "- **app** → **processes** → **pages** → **widgets** → **features** → **entities** → **shared**\n" +
        "- 상위 레이어만 하위 레이어를 import할 수 있습니다\n\n" +
        "### API 레이어 추상화\n" +
        "API 호출을 별도 레이어로 분리하고, 응답을 도메인 모델로 변환합니다. 백엔드 응답 구조가 바뀌어도 변환 레이어만 수정하면 됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 레이어드 아키텍처",
      content:
        "의존성 방향을 지키는 레이어드 아키텍처를 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// === Domain 레이어: 비즈니스 로직 (의존성 없음) ===\n' +
          '// domain/product.ts\n' +
          'interface Product {\n' +
          '  id: string;\n' +
          '  name: string;\n' +
          '  price: number;\n' +
          '  discountRate: number;\n' +
          '}\n' +
          '\n' +
          'function calculateFinalPrice(product: Product): number {\n' +
          '  return product.price * (1 - product.discountRate);\n' +
          '}\n' +
          '\n' +
          'function isOnSale(product: Product): boolean {\n' +
          '  return product.discountRate > 0;\n' +
          '}\n' +
          '\n' +
          '// === Infrastructure 레이어: API 호출 + 변환 ===\n' +
          '// api/productApi.ts\n' +
          'interface ProductDTO {  // 서버 응답 형태\n' +
          '  product_id: string;\n' +
          '  product_name: string;\n' +
          '  unit_price: number;\n' +
          '  discount_pct: number;\n' +
          '}\n' +
          '\n' +
          'function toProduct(dto: ProductDTO): Product {\n' +
          '  return {\n' +
          '    id: dto.product_id,\n' +
          '    name: dto.product_name,\n' +
          '    price: dto.unit_price,\n' +
          '    discountRate: dto.discount_pct / 100,\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          'async function fetchProducts(): Promise<Product[]> {\n' +
          '  const response = await fetch("/api/products");\n' +
          '  const dtos: ProductDTO[] = await response.json();\n' +
          '  return dtos.map(toProduct);\n' +
          '}\n' +
          '\n' +
          '// === Application 레이어: Hook (UI와 Domain 연결) ===\n' +
          '// hooks/useProducts.ts\n' +
          'function useProducts() {\n' +
          '  const { data, isLoading } = useQuery({\n' +
          '    queryKey: ["products"],\n' +
          '    queryFn: fetchProducts, // Infrastructure 사용\n' +
          '  });\n' +
          '\n' +
          '  const saleProducts = data?.filter(isOnSale) ?? []; // Domain 사용\n' +
          '  return { products: data, saleProducts, isLoading };\n' +
          '}',
        description:
          "Domain은 순수 함수이며 외부 의존성이 없고, API 응답은 변환 함수를 거쳐 도메인 모델이 됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Feature Sliced Design 적용",
      content:
        "FSD 아키텍처의 실제 폴더 구조와 의존성 규칙을 봅시다.",
      code: {
        language: "typescript",
        code:
          '// === Feature Sliced Design 구조 ===\n' +
          'src/\n' +
          '├── app/              // 앱 초기화, 프로바이더, 라우팅\n' +
          '│   ├── providers.tsx\n' +
          '│   └── routes.tsx\n' +
          '├── pages/            // 페이지 컴포넌트 (라우트 단위)\n' +
          '│   ├── home/\n' +
          '│   └── product-detail/\n' +
          '├── widgets/          // 독립적인 UI 블록\n' +
          '│   ├── header/\n' +
          '│   └── product-card/\n' +
          '├── features/         // 사용자 액션 (장바구니 추가, 리뷰 작성)\n' +
          '│   ├── add-to-cart/\n' +
          '│   └── write-review/\n' +
          '├── entities/         // 비즈니스 엔티티 (상품, 사용자)\n' +
          '│   ├── product/\n' +
          '│   └── user/\n' +
          '└── shared/           // 공유 유틸, UI 키트\n' +
          '    ├── ui/\n' +
          '    ├── api/\n' +
          '    └── lib/\n' +
          '\n' +
          '// === 의존성 규칙 ===\n' +
          '// pages → widgets → features → entities → shared\n' +
          '// 상위 레이어만 하위 레이어를 import 가능\n' +
          '// 같은 레이어 간 import 금지 (features/A → features/B ❌)\n' +
          '\n' +
          '// === API 레이어 추상화 예시 ===\n' +
          '// shared/api/client.ts\n' +
          'const apiClient = {\n' +
          '  async get<T>(url: string): Promise<T> {\n' +
          '    const response = await fetch(url, {\n' +
          '      headers: { "Authorization": `Bearer ${getToken()}` },\n' +
          '    });\n' +
          '    if (!response.ok) throw new ApiError(response.status);\n' +
          '    return response.json();\n' +
          '  },\n' +
          '  async post<T>(url: string, data: unknown): Promise<T> {\n' +
          '    const response = await fetch(url, {\n' +
          '      method: "POST",\n' +
          '      headers: { "Content-Type": "application/json" },\n' +
          '      body: JSON.stringify(data),\n' +
          '    });\n' +
          '    if (!response.ok) throw new ApiError(response.status);\n' +
          '    return response.json();\n' +
          '  },\n' +
          '};',
        description:
          "FSD는 레이어 간 의존성 방향을 엄격히 관리하여 대규모 프로젝트의 복잡도를 제어합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 아키텍처 | 핵심 원칙 | 적합한 규모 |\n" +
        "|---------|----------|------------|\n" +
        "| 레이어드 | 의존성 안쪽으로 | 중~대규모 |\n" +
        "| Feature Sliced Design | 7 레이어 + 의존성 규칙 | 대규모 |\n" +
        "| 클린 아키텍처 | Domain 독립 | 복잡한 비즈니스 |\n\n" +
        "**핵심:** 아키텍처의 목표는 '변경 비용 최소화'입니다. 비즈니스 로직(Domain)을 UI와 API에서 분리하면, 어느 한쪽이 변해도 다른 쪽은 영향받지 않습니다.\n\n" +
        "**다음 챕터 미리보기:** React 생태계의 미래와 React 19+의 방향을 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "모듈 경계와 공개 API 개념을 이해한다",
    "의존성 방향(안쪽으로)의 원칙을 설명할 수 있다",
    "Feature Sliced Design의 레이어를 나열할 수 있다",
    "API 레이어 추상화(DTO → Domain 변환)를 구현할 수 있다",
    "대규모 프로젝트에 적합한 아키텍처를 선택할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "클린 아키텍처에서 의존성이 향해야 하는 방향은?",
      choices: [
        "바깥쪽(UI 방향)",
        "안쪽(Domain 방향)",
        "양방향으로 자유롭게",
        "수평적으로만",
      ],
      correctIndex: 1,
      explanation:
        "의존성은 항상 안쪽(Domain)을 향해야 합니다. UI가 Domain에 의존하지만, Domain은 UI에 의존하지 않습니다. 이로써 핵심 로직이 외부 변경에 영향받지 않습니다.",
    },
    {
      id: "q2",
      question: "API 레이어 추상화(DTO 변환)의 목적은?",
      choices: [
        "API 호출 속도를 높인다",
        "백엔드 응답 구조 변경 시 프론트엔드 영향을 최소화한다",
        "TypeScript 에러를 방지한다",
        "캐시를 자동으로 관리한다",
      ],
      correctIndex: 1,
      explanation:
        "DTO를 도메인 모델로 변환하면, 서버 API 구조가 바뀌어도 변환 함수만 수정하면 됩니다. 컴포넌트와 비즈니스 로직은 도메인 모델만 사용합니다.",
    },
    {
      id: "q3",
      question: "Feature Sliced Design에서 같은 레이어 간 import가 금지되는 이유는?",
      choices: [
        "성능 저하를 방지하기 위해",
        "순환 의존성과 강한 결합을 방지하기 위해",
        "번들 크기를 줄이기 위해",
        "TypeScript 에러를 방지하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "같은 레이어 간 import(예: features/A → features/B)를 허용하면 순환 의존성이 발생하고, 기능 간 결합이 강해져 독립적인 개발이 어려워집니다.",
    },
    {
      id: "q4",
      question: "Domain 레이어에 외부 의존성(React, API 등)이 없어야 하는 이유는?",
      choices: [
        "코드가 짧아진다",
        "비즈니스 로직을 독립적으로 테스트하고 재사용할 수 있다",
        "서버에서 실행할 수 없기 때문이다",
        "번들에서 자동으로 제외된다",
      ],
      correctIndex: 1,
      explanation:
        "Domain 레이어가 순수 함수로만 구성되면, React 없이도 단위 테스트할 수 있고, 다른 프레임워크(Vue, Node)에서도 재사용할 수 있습니다.",
    },
    {
      id: "q5",
      question: "모듈의 공개 API(index.ts)를 통해서만 통신하면 좋은 점은?",
      choices: [
        "import 경로가 짧아진다",
        "내부 리팩토링 시 외부에 영향을 주지 않는다",
        "자동 import가 더 잘 동작한다",
        "코드 리뷰가 필요 없어진다",
      ],
      correctIndex: 1,
      explanation:
        "공개 API를 통해서만 통신하면, 모듈 내부 구조를 자유롭게 리팩토링할 수 있습니다. 외부 코드는 공개 API에만 의존하므로 내부 변경에 영향받지 않습니다.",
    },
    {
      id: "q6",
      question: "대규모 앱에서 여러 팀이 협업할 때 모듈 경계가 중요한 이유는?",
      choices: [
        "빌드 속도가 빨라진다",
        "각 팀이 독립적으로 개발하고 merge 충돌을 줄일 수 있다",
        "테스트를 건너뛸 수 있다",
        "배포가 자동화된다",
      ],
      correctIndex: 1,
      explanation:
        "명확한 모듈 경계가 있으면 각 팀이 자신의 모듈을 독립적으로 개발하고, 다른 팀의 코드에 영향을 최소화합니다. merge 충돌도 줄어듭니다.",
    },
  ],
};

export default chapter;
