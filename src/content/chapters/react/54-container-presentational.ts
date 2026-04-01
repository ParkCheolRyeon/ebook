import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "54-container-presentational",
  subject: "react",
  title: "Container/Presentational 분리",
  description:
    "관심사 분리, 데이터 로직 vs UI, Hook 시대의 재해석(커스텀 Hook이 Container 역할)을 학습합니다.",
  order: 54,
  group: "설계 패턴과 아키텍처",
  prerequisites: ["53-render-props-hoc"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Container/Presentational 분리는 **요리사와 웨이터**의 관계입니다.\n\n" +
        "**Container(요리사)**는 주방에서 재료를 준비하고, 요리하고, 데이터를 만듭니다. 손님에게 직접 서빙하지 않습니다.\n\n" +
        "**Presentational(웨이터)**는 완성된 음식을 받아서 예쁘게 담아 손님에게 전달합니다. 요리 방법은 모르고, 보여주는 것만 담당합니다.\n\n" +
        "**Hook 시대의 재해석:** 이제는 요리사가 별도의 사람이 아니라, 웨이터가 사용하는 '자동 요리 도구(커스텀 Hook)'로 바뀌었습니다. 웨이터가 도구를 사용해서 직접 음식을 가져오지만, 요리 로직은 도구 안에 캡슐화되어 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "데이터 로직과 UI가 한 곳에 섞여 있으면 어떤 문제가 있을까요?\n\n" +
        "1. **재사용 불가** — API 호출 로직과 UI가 결합되어 있으면, 같은 데이터를 다른 UI로 보여줄 수 없습니다.\n\n" +
        "2. **테스트 어려움** — 데이터 페칭을 모킹하지 않으면 UI만 테스트할 수 없습니다.\n\n" +
        "3. **디자이너 협업** — Storybook에서 순수 UI 컴포넌트를 보여주기 어렵습니다. API 의존성 때문입니다.\n\n" +
        "4. **관심사 혼재** — 한 파일에서 API 호출, 상태 변환, 에러 처리, UI 렌더링을 모두 다루면 코드가 복잡해집니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 클래식 패턴: Container/Presentational\n" +
        "Dan Abramov가 2015년에 소개한 패턴입니다.\n" +
        "- **Container**: 데이터를 가져오고, 상태를 관리하고, 이벤트를 처리합니다\n" +
        "- **Presentational**: props만 받아서 UI를 렌더링합니다. 상태가 없거나 UI 상태만 가집니다\n\n" +
        "### Hook 시대의 재해석\n" +
        "Dan Abramov 자신이 2019년에 '더 이상 이 패턴을 강제하지 마세요'라고 했습니다. Hook이 Container 역할을 대체하기 때문입니다.\n\n" +
        "- 기존: `UserContainer` → `UserPresentation`\n" +
        "- Hook 시대: `useUserData()` Hook + `UserView` 컴포넌트\n\n" +
        "### 그래도 유효한 분리 원칙\n" +
        "패턴 자체는 약해졌지만, '데이터 로직과 UI를 분리한다'는 원칙은 여전히 유효합니다. 커스텀 Hook이 자연스럽게 이 역할을 수행합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 클래식 vs Hook 방식",
      content:
        "같은 기능을 클래식 패턴과 Hook 패턴으로 비교합니다.",
      code: {
        language: "typescript",
        code:
          '// === 클래식: Container/Presentational ===\n' +
          '\n' +
          '// Presentational: 순수 UI (props만 받음)\n' +
          'interface UserProfileViewProps {\n' +
          '  name: string;\n' +
          '  email: string;\n' +
          '  avatar: string;\n' +
          '  onEdit: () => void;\n' +
          '}\n' +
          '\n' +
          'function UserProfileView({ name, email, avatar, onEdit }: UserProfileViewProps) {\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <img src={avatar} alt={name} />\n' +
          '      <h2>{name}</h2>\n' +
          '      <p>{email}</p>\n' +
          '      <button onClick={onEdit}>수정</button>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// Container: 데이터 로직\n' +
          'function UserProfileContainer({ userId }: { userId: string }) {\n' +
          '  const [user, setUser] = useState<User | null>(null);\n' +
          '  useEffect(() => { fetchUser(userId).then(setUser); }, [userId]);\n' +
          '  const handleEdit = () => navigate(`/users/${userId}/edit`);\n' +
          '\n' +
          '  if (!user) return <div>로딩 중...</div>;\n' +
          '  return <UserProfileView {...user} onEdit={handleEdit} />;\n' +
          '}\n' +
          '\n' +
          '// === Hook 시대: 커스텀 Hook이 Container 역할 ===\n' +
          '\n' +
          'function useUserProfile(userId: string) {\n' +
          '  const { data: user, isLoading } = useQuery({\n' +
          '    queryKey: ["user", userId],\n' +
          '    queryFn: () => fetchUser(userId),\n' +
          '  });\n' +
          '  const navigate = useNavigate();\n' +
          '  const handleEdit = () => navigate(`/users/${userId}/edit`);\n' +
          '\n' +
          '  return { user, isLoading, handleEdit };\n' +
          '}\n' +
          '\n' +
          '// 하나의 컴포넌트에서 Hook 사용\n' +
          'function UserProfile({ userId }: { userId: string }) {\n' +
          '  const { user, isLoading, handleEdit } = useUserProfile(userId);\n' +
          '  if (isLoading) return <div>로딩 중...</div>;\n' +
          '  return <UserProfileView {...user!} onEdit={handleEdit} />;\n' +
          '}',
        description:
          "커스텀 Hook이 Container의 역할을 대체하면서, 별도의 Container 컴포넌트가 불필요해졌습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Storybook 친화적 설계",
      content:
        "Presentational 컴포넌트를 Storybook에서 독립적으로 보여주는 예시입니다.",
      code: {
        language: "typescript",
        code:
          '// === Presentational: Storybook에 바로 등록 가능 ===\n' +
          'interface ProductCardProps {\n' +
          '  title: string;\n' +
          '  price: number;\n' +
          '  imageUrl: string;\n' +
          '  onAddToCart: () => void;\n' +
          '  isOutOfStock?: boolean;\n' +
          '}\n' +
          '\n' +
          'function ProductCard({ title, price, imageUrl, onAddToCart, isOutOfStock }: ProductCardProps) {\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <img src={imageUrl} alt={title} />\n' +
          '      <h3>{title}</h3>\n' +
          '      <p>{price.toLocaleString()}원</p>\n' +
          '      <button onClick={onAddToCart} disabled={isOutOfStock}>\n' +
          '        {isOutOfStock ? "품절" : "장바구니 담기"}\n' +
          '      </button>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === 데이터 로직 Hook ===\n' +
          'function useProductCard(productId: string) {\n' +
          '  const { data: product } = useQuery({\n' +
          '    queryKey: ["product", productId],\n' +
          '    queryFn: () => fetchProduct(productId),\n' +
          '  });\n' +
          '  const { mutate: addToCart } = useMutation({\n' +
          '    mutationFn: () => addToCartAPI(productId),\n' +
          '  });\n' +
          '\n' +
          '  return {\n' +
          '    product,\n' +
          '    handleAddToCart: () => addToCart(),\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          '// === 조합: Hook + Presentational ===\n' +
          'function ProductCardContainer({ productId }: { productId: string }) {\n' +
          '  const { product, handleAddToCart } = useProductCard(productId);\n' +
          '  if (!product) return null;\n' +
          '  return (\n' +
          '    <ProductCard\n' +
          '      title={product.title}\n' +
          '      price={product.price}\n' +
          '      imageUrl={product.imageUrl}\n' +
          '      onAddToCart={handleAddToCart}\n' +
          '      isOutOfStock={product.stock === 0}\n' +
          '    />\n' +
          '  );\n' +
          '}',
        description:
          "ProductCard는 순수 UI 컴포넌트로 Storybook에서 다양한 상태를 보여줄 수 있고, 로직은 Hook에 분리됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 시대 | Container | Presentational |\n" +
        "|------|-----------|----------------|\n" +
        "| 클래식 | 컴포넌트 | 컴포넌트 |\n" +
        "| Hook 시대 | 커스텀 Hook | 컴포넌트 |\n\n" +
        "**핵심:** Container/Presentational을 엄격한 규칙으로 강제하지 마세요. 하지만 '데이터 로직과 UI를 분리한다'는 원칙은 커스텀 Hook을 통해 자연스럽게 적용합니다.\n\n" +
        "**다음 챕터 미리보기:** 에러 바운더리를 배우며, 에러 처리를 컴포넌트 트리에서 선언적으로 다루는 방법을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "Container/Presentational 패턴은 데이터 로직과 UI를 분리한다. Hook이 Container 역할을 대체하면서 패턴은 진화했지만, 관심사 분리 원칙 자체는 여전히 유효하다.",
  checklist: [
    "Container/Presentational 패턴의 원래 의도를 이해한다",
    "Hook 시대에 이 패턴이 어떻게 변화했는지 설명할 수 있다",
    "커스텀 Hook으로 데이터 로직을 분리할 수 있다",
    "Storybook 친화적인 순수 UI 컴포넌트를 설계할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Container 컴포넌트의 주요 역할은?",
      choices: [
        "UI를 렌더링한다",
        "데이터를 가져오고 상태를 관리한다",
        "스타일을 적용한다",
        "이벤트를 DOM에 등록한다",
      ],
      correctIndex: 1,
      explanation:
        "Container는 데이터 페칭, 상태 관리, 이벤트 처리 등 로직을 담당합니다. Presentational 컴포넌트에 데이터를 전달하는 역할입니다.",
    },
    {
      id: "q2",
      question: "Dan Abramov가 Container/Presentational 패턴에 대해 2019년에 한 말은?",
      choices: [
        "모든 프로젝트에 반드시 적용해야 한다",
        "Hook이 이 패턴을 대체하므로 강제하지 마라",
        "TypeScript에서는 사용할 수 없다",
        "성능 최적화를 위해 필수이다",
      ],
      correctIndex: 1,
      explanation:
        "Dan Abramov는 Hook이 Container의 역할을 대체하므로 이 패턴을 기계적으로 적용하지 말라고 했습니다. 분리의 원칙은 유효하지만 방식이 변했습니다.",
    },
    {
      id: "q3",
      question: "Hook 시대에 Container 역할을 대체하는 것은?",
      choices: [
        "Context API",
        "커스텀 Hook",
        "Redux store",
        "Higher-Order Component",
      ],
      correctIndex: 1,
      explanation:
        "커스텀 Hook이 데이터 페칭, 상태 관리 등 Container의 로직을 캡슐화합니다. 별도의 Container 컴포넌트를 만들 필요가 없어졌습니다.",
    },
    {
      id: "q4",
      question: "Presentational 컴포넌트를 순수하게 유지하면 좋은 점은?",
      choices: [
        "번들 크기가 줄어든다",
        "서버에서만 렌더링할 수 있다",
        "Storybook에서 독립적으로 보여줄 수 있고 테스트가 쉽다",
        "자동으로 메모이제이션된다",
      ],
      correctIndex: 2,
      explanation:
        "순수 UI 컴포넌트는 API 의존성 없이 다양한 props를 전달하여 Storybook에서 보여줄 수 있고, 모킹 없이 렌더링 결과를 테스트할 수 있습니다.",
    },
    {
      id: "q5",
      question: "데이터 로직과 UI를 분리하는 가장 현대적인 접근법은?",
      choices: [
        "Mixin으로 로직을 주입한다",
        "HOC로 감싼다",
        "커스텀 Hook으로 로직을 추출하고 UI 컴포넌트에서 사용한다",
        "전역 변수에 데이터를 저장한다",
      ],
      correctIndex: 2,
      explanation:
        "커스텀 Hook으로 데이터 로직을 추출하면, UI 컴포넌트는 Hook을 호출하여 데이터를 가져옵니다. 래퍼 없이 깔끔하게 분리됩니다.",
    },
  ],
};

export default chapter;
