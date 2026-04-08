import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "58-react-ecosystem-future",
  subject: "react",
  title: "React 생태계 전망",
  description:
    "React 19+ 방향, React Compiler 로드맵, Server Components와 프레임워크, Document Metadata, Asset Loading, 웹 컴포넌트와의 관계를 학습합니다.",
  order: 58,
  group: "설계 패턴과 아키텍처",
  prerequisites: ["57-large-scale-architecture"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "React의 미래는 **자동차 산업의 진화**와 같습니다.\n\n" +
        "**React Compiler**는 자율주행입니다. 기존에는 개발자가 직접 `useMemo`, `useCallback`, `React.memo`를 운전해야 했지만, 컴파일러가 알아서 최적화합니다.\n\n" +
        "**Server Components**는 공장 직배송입니다. 매장(클라이언트)에서 조립하지 않고, 공장(서버)에서 완성품을 보내는 것처럼, HTML을 서버에서 완성하여 보냅니다.\n\n" +
        "**프레임워크 위임**은 전문 딜러십입니다. React가 엔진을 만들고, Next.js/Remix 같은 프레임워크가 완성차를 만듭니다. 라우팅, 번들링, 배포는 프레임워크의 역할입니다.\n\n" +
        "**Document Metadata**는 자동차 등록증입니다. 이제 React가 직접 `<title>`, `<meta>` 태그를 관리하여 SEO와 소셜 미디어 공유를 쉽게 합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "현재 React 생태계가 해결하려는 과제들입니다.\n\n" +
        "1. **수동 최적화 부담** — `useMemo`, `useCallback`, `React.memo`를 언제 어디에 적용할지 개발자가 판단해야 합니다. 이 판단을 틀리면 성능이 오히려 나빠집니다.\n\n" +
        "2. **클라이언트 번들 크기** — SPA는 모든 JS를 클라이언트에 보내야 합니다. 앱이 커지면 초기 로딩이 느려집니다.\n\n" +
        "3. **메타데이터 관리** — `<title>`, `<meta>` 태그를 컴포넌트에서 관리하려면 `react-helmet` 같은 별도 라이브러리가 필요했습니다.\n\n" +
        "4. **프레임워크 없는 React** — 라우팅, SSR, 데이터 페칭을 직접 구성하는 것이 점점 어려워지고 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### React Compiler (React Forget)\n" +
        "빌드 타임에 자동으로 메모이제이션을 적용하는 컴파일러입니다. 개발자가 useMemo/useCallback을 직접 작성하지 않아도 컴파일러가 최적의 메모이제이션을 삽입합니다.\n\n" +
        "### Server Components\n" +
        "서버에서만 실행되는 컴포넌트입니다. 클라이언트로 JS를 보내지 않으므로 번들 크기가 줄어듭니다. DB 직접 접근, 파일 시스템 읽기 등 서버 전용 작업이 가능합니다.\n\n" +
        "### Document Metadata\n" +
        "React 19에서 `<title>`, `<meta>`, `<link>` 태그를 컴포넌트 안에서 직접 렌더링하면, React가 자동으로 `<head>`에 호이스팅합니다.\n\n" +
        "### Asset Loading\n" +
        "Suspense와 통합된 리소스 프리로딩 API(`preload`, `preinit`)로 이미지, 스크립트, 스타일 로딩을 선언적으로 관리합니다.\n\n" +
        "### 웹 컴포넌트와의 관계\n" +
        "React 19에서 Custom Elements에 대한 완전한 지원이 추가되었습니다. React 컴포넌트와 웹 컴포넌트의 상호운용성이 개선되었습니다.\n\n" +
        "### 프레임워크 시대\n" +
        "React 팀은 Next.js, Remix 같은 프레임워크를 React 사용의 권장 방법으로 안내합니다. Server Components, 라우팅, 빌드 최적화는 프레임워크가 담당합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: React 19+ 새 기능",
      content:
        "React 19 이후의 주요 API와 패턴을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// === React Compiler: 자동 메모이제이션 ===\n' +
          '// 기존: 개발자가 수동으로 최적화\n' +
          'const MemoizedList = memo(function ProductList({ products }: Props) {\n' +
          '  const sorted = useMemo(() => [...products].sort(byPrice), [products]);\n' +
          '  const handleClick = useCallback((id: string) => select(id), []);\n' +
          '  return sorted.map(p => <Item key={p.id} onClick={handleClick} />);\n' +
          '});\n' +
          '\n' +
          '// React Compiler 시대: 그냥 작성\n' +
          'function ProductList({ products }: Props) {\n' +
          '  const sorted = [...products].sort(byPrice);\n' +
          '  const handleClick = (id: string) => select(id);\n' +
          '  return sorted.map(p => <Item key={p.id} onClick={handleClick} />);\n' +
          '}\n' +
          '// → 컴파일러가 빌드 시 필요한 메모이제이션을 자동 삽입\n' +
          '\n' +
          '// === Document Metadata ===\n' +
          'function BlogPost({ post }: { post: Post }) {\n' +
          '  return (\n' +
          '    <article>\n' +
          '      <title>{post.title} | My Blog</title>\n' +
          '      <meta name="description" content={post.summary} />\n' +
          '      <meta property="og:title" content={post.title} />\n' +
          '      <h1>{post.title}</h1>\n' +
          '      <p>{post.content}</p>\n' +
          '    </article>\n' +
          '  );\n' +
          '}\n' +
          '// → <title>, <meta>가 자동으로 <head>에 호이스팅\n' +
          '\n' +
          '// === Asset Loading ===\n' +
          'import { preload, preinit } from "react-dom";\n' +
          '\n' +
          'function MyComponent() {\n' +
          '  preinit("/styles/main.css", { as: "style" });\n' +
          '  preload("/images/hero.jpg", { as: "image" });\n' +
          '  return <div>...</div>;\n' +
          '}',
        description:
          "React Compiler는 수동 메모이제이션을 자동화하고, Document Metadata는 SEO를 선언적으로 관리합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Server Components와 클라이언트 컴포넌트",
      content:
        "서버/클라이언트 컴포넌트의 경계와 데이터 흐름을 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// === Server Component (기본) ===\n' +
          '// app/products/page.tsx\n' +
          'async function ProductsPage() {\n' +
          '  // 서버에서 직접 DB 쿼리 (번들에 포함 안됨)\n' +
          '  const products = await db.product.findMany();\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <title>상품 목록</title>\n' +
          '      <h1>상품 목록</h1>\n' +
          '      {products.map(p => (\n' +
          '        <ProductCard key={p.id} product={p} />\n' +
          '      ))}\n' +
          '      {/* 클라이언트 컴포넌트: 인터랙션 필요 */}\n' +
          '      <AddToCartButton />\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === Client Component ===\n' +
          '"use client";\n' +
          '\n' +
          'function AddToCartButton() {\n' +
          '  const [count, setCount] = useState(0);\n' +
          '\n' +
          '  return (\n' +
          '    <button onClick={() => setCount(c => c + 1)}>\n' +
          '      장바구니 ({count})\n' +
          '    </button>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === 웹 컴포넌트 상호운용 (React 19) ===\n' +
          'function App() {\n' +
          '  return (\n' +
          '    <div>\n' +
          '      {/* Custom Element에 props 전달 가능 */}\n' +
          '      <my-component\n' +
          '        message="Hello"\n' +
          '        onCustomEvent={(e) => console.log(e.detail)}\n' +
          '      />\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "Server Component는 서버에서 실행되어 번들에 포함되지 않고, Client Component만 클라이언트로 전송됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 기능 | 핵심 변화 | 영향 |\n" +
        "|------|---------|------|\n" +
        "| React Compiler | 자동 메모이제이션 | useMemo/useCallback 불필요 |\n" +
        "| Server Components | 서버 전용 컴포넌트 | 번들 크기 감소 |\n" +
        "| Document Metadata | 선언적 head 관리 | react-helmet 불필요 |\n" +
        "| Asset Loading | 선언적 리소스 프리로드 | 로딩 성능 개선 |\n" +
        "| Custom Elements | 웹 컴포넌트 호환 | 프레임워크 간 공유 |\n\n" +
        "**핵심:** React는 '더 적은 수동 작업, 더 많은 자동 최적화' 방향으로 진화하고 있습니다. 프레임워크(Next.js 등)와의 통합이 깊어지고, 개발자는 비즈니스 로직에 집중할 수 있게 됩니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "React 생태계는 Server Components, React Compiler, 새로운 Hook들로 빠르게 진화 중이다. 기초를 단단히 하면 어떤 변화에도 적응할 수 있다.",
  checklist: [
    "React Compiler의 목적과 동작 원리를 이해한다",
    "Server Components와 Client Components의 차이를 설명할 수 있다",
    "Document Metadata의 사용법을 안다",
    "React 생태계에서 프레임워크의 역할을 이해한다",
    "웹 컴포넌트와 React의 관계를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "React Compiler의 주요 목적은?",
      choices: [
        "TypeScript를 JavaScript로 변환",
        "useMemo/useCallback 등 메모이제이션을 자동으로 적용",
        "Server Components를 클라이언트로 변환",
        "CSS를 최적화",
      ],
      correctIndex: 1,
      explanation:
        "React Compiler는 빌드 시 코드를 분석하여 필요한 곳에 자동으로 메모이제이션을 삽입합니다. 개발자가 수동으로 useMemo/useCallback을 작성할 필요가 없어집니다.",
    },
    {
      id: "q2",
      question: "Server Components의 가장 큰 장점은?",
      choices: [
        "useState를 사용할 수 있다",
        "이벤트 핸들러를 등록할 수 있다",
        "JS 번들에 포함되지 않아 번들 크기가 줄어든다",
        "실시간 데이터 업데이트가 가능하다",
      ],
      correctIndex: 2,
      explanation:
        "Server Components는 서버에서만 실행되고 결과 HTML만 클라이언트에 전달합니다. 컴포넌트 코드가 JS 번들에 포함되지 않으므로 번들 크기가 줄어듭니다.",
    },
    {
      id: "q3",
      question: "React 19의 Document Metadata 기능은?",
      choices: [
        "react-helmet을 공식 API로 통합",
        "컴포넌트 안의 title, meta 태그를 자동으로 head에 호이스팅",
        "SEO 점수를 자동으로 계산",
        "메타데이터를 데이터베이스에 저장",
      ],
      correctIndex: 1,
      explanation:
        "React 19에서는 컴포넌트 안에 <title>, <meta> 태그를 렌더링하면 React가 자동으로 document의 <head>에 배치합니다. 별도 라이브러리가 불필요합니다.",
    },
    {
      id: "q4",
      question: "React 팀이 프레임워크 사용을 권장하는 이유는?",
      choices: [
        "React 단독으로는 동작하지 않기 때문",
        "SSR, 라우팅, 번들 최적화 등을 프레임워크가 효과적으로 처리하기 때문",
        "프레임워크 없이는 TypeScript를 사용할 수 없기 때문",
        "라이선스 비용 때문",
      ],
      correctIndex: 1,
      explanation:
        "React는 UI 라이브러리이며, SSR, 라우팅, 코드 스플리팅 등은 프레임워크가 통합적으로 제공합니다. Next.js, Remix 등이 이러한 인프라를 관리합니다.",
    },
    {
      id: "q5",
      question: "'use client' 디렉티브의 역할은?",
      choices: [
        "컴포넌트를 캐시하지 않겠다는 선언",
        "해당 파일이 클라이언트에서만 실행되는 컴포넌트임을 표시",
        "서버에서 렌더링을 건너뛴다",
        "TypeScript 타입 검사를 비활성화한다",
      ],
      correctIndex: 1,
      explanation:
        "'use client'는 해당 모듈이 클라이언트 컴포넌트 경계임을 표시합니다. 이 파일과 하위에서 import하는 모듈은 클라이언트 번들에 포함됩니다.",
    },
    {
      id: "q6",
      question: "React 19에서 웹 컴포넌트(Custom Elements) 지원이 개선된 점은?",
      choices: [
        "웹 컴포넌트를 사용할 수 없게 되었다",
        "Custom Element에 속성과 이벤트를 올바르게 전달할 수 있게 되었다",
        "React 컴포넌트를 자동으로 웹 컴포넌트로 변환한다",
        "Shadow DOM이 비활성화되었다",
      ],
      correctIndex: 1,
      explanation:
        "React 19에서는 Custom Element에 속성(properties)을 올바르게 전달하고, 커스텀 이벤트를 핸들링할 수 있게 되었습니다. 프레임워크 간 컴포넌트 공유가 쉬워졌습니다.",
    },
  ],
};

export default chapter;
