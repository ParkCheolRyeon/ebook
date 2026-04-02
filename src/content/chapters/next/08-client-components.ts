import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "08-client-components",
  subject: "next",
  title: "Client Components와 \"use client\"",
  description:
    "\"use client\" 지시어의 의미와 동작 원리, 클라이언트 컴포넌트가 필요한 상황, 서버-클라이언트 경계의 개념, 그리고 흔한 오해를 학습합니다.",
  order: 8,
  group: "서버와 클라이언트",
  prerequisites: ["07-server-components"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "\"use client\"는 **세관 신고서**와 같습니다.\n\n" +
        "국제 공항(서버-클라이언트 경계)에서 모든 짐은 기본적으로 출발지(서버)에 남습니다. 하지만 특정 물건을 목적지(브라우저)로 가져가고 싶다면 **세관 신고서(\"use client\")**를 작성해야 합니다.\n\n" +
        "신고서를 작성하면 해당 물건뿐 아니라 그 안에 포장된 모든 내용물(하위 import)도 함께 목적지로 갑니다. 그래서 신고서는 **가능한 한 작은 짐에만** 붙이는 것이 좋습니다. 큰 여행 가방에 붙이면 그 안의 모든 물건이 목적지로 전송되니까요.\n\n" +
        "중요한 오해가 하나 있습니다. 세관 신고서를 붙인 물건도 출발지에서 **검사(프리렌더)**를 받습니다. 신고서가 '출발지에서 검사하지 마세요'를 의미하지 않습니다. 단지 '이 물건은 목적지에서도 사용될 것입니다'를 선언하는 것입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "Server Component는 강력하지만, 웹 애플리케이션에서 모든 것을 서버에서만 처리할 수는 없습니다.\n\n" +
        "1. **사용자 상호작용** — 버튼 클릭, 폼 입력, 드래그앤드롭 같은 인터랙션은 브라우저에서 즉시 반응해야 합니다. 서버 왕복은 너무 느립니다.\n\n" +
        "2. **상태 관리** — 모달 열림/닫힘, 아코디언 토글, 탭 전환 같은 UI 상태는 클라이언트에서 관리해야 합니다.\n\n" +
        "3. **브라우저 API** — `window.innerWidth`, `navigator.geolocation`, `IntersectionObserver`, `localStorage` 같은 API는 서버에 존재하지 않습니다.\n\n" +
        "4. **실시간 업데이트** — 타이머, 애니메이션, WebSocket 연결 등은 브라우저에서 지속적으로 실행되어야 합니다.\n\n" +
        "이런 기능이 필요한 컴포넌트는 클라이언트에서 JavaScript가 실행되어야 하므로, 서버-클라이언트 경계를 명시적으로 선언할 방법이 필요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "파일 최상단에 `\"use client\"` 지시어를 추가하면 해당 컴포넌트와 그 하위 import가 클라이언트 번들에 포함됩니다.\n\n" +
        "### \"use client\"가 필요한 경우\n" +
        "- `useState`, `useReducer` — 클라이언트 상태 관리\n" +
        "- `useEffect`, `useLayoutEffect` — 사이드 이펙트\n" +
        "- `onClick`, `onChange` 등 — 이벤트 핸들러\n" +
        "- `window`, `document` 등 — 브라우저 전용 API\n" +
        "- 커스텀 훅이 위 기능을 내부적으로 사용하는 경우\n\n" +
        "### 경계(Boundary) 개념\n" +
        "\"use client\"는 **서버-클라이언트 경계**를 선언합니다. 이 파일에서 import하는 모든 모듈도 클라이언트 번들에 포함됩니다. 따라서 경계를 가능한 한 **트리의 말단(leaf)**에 두어야 번들 크기를 최소화할 수 있습니다.\n\n" +
        "### 흔한 오해: \"use client\" !== CSR\n" +
        "\"use client\"를 붙여도 해당 컴포넌트는 **서버에서 프리렌더**됩니다. HTML이 먼저 생성되고, 클라이언트에서 hydration이 일어납니다. 순수한 CSR(클라이언트 사이드 렌더링)과는 다릅니다. 초기 HTML이 있으므로 SEO에도 유리합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: \"use client\" 경계 전략",
      content:
        "인터랙티브한 부분만 Client Component로 분리하고, 나머지는 Server Component로 유지하는 전략입니다. 전체 페이지에 \"use client\"를 붙이는 대신, 상호작용이 필요한 최소 단위만 분리합니다.",
      code: {
        language: "typescript",
        code:
          '// ❌ 안 좋은 패턴: 페이지 전체를 Client Component로\n' +
          '// app/products/page.tsx\n' +
          '"use client";\n' +
          '// 이렇게 하면 모든 하위 import가 번들에 포함됨\n' +
          '\n' +
          '// ✅ 좋은 패턴: 인터랙티브 부분만 분리\n' +
          '// components/AddToCartButton.tsx\n' +
          '"use client";\n' +
          '\n' +
          'import { useState } from "react";\n' +
          '\n' +
          'interface Props {\n' +
          '  productId: string;\n' +
          '  price: number;\n' +
          '}\n' +
          '\n' +
          'export default function AddToCartButton({ productId, price }: Props) {\n' +
          '  const [isAdding, setIsAdding] = useState(false);\n' +
          '\n' +
          '  const handleClick = async () => {\n' +
          '    setIsAdding(true);\n' +
          '    await fetch("/api/cart", {\n' +
          '      method: "POST",\n' +
          '      body: JSON.stringify({ productId }),\n' +
          '    });\n' +
          '    setIsAdding(false);\n' +
          '  };\n' +
          '\n' +
          '  return (\n' +
          '    <button onClick={handleClick} disabled={isAdding}>\n' +
          '      {isAdding ? "추가 중..." : `장바구니 담기 (${price.toLocaleString()}원)`}\n' +
          '    </button>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// app/products/[id]/page.tsx (Server Component)\n' +
          'import { db } from "@/lib/database";\n' +
          'import AddToCartButton from "@/components/AddToCartButton";\n' +
          '\n' +
          'export default async function ProductPage({\n' +
          '  params,\n' +
          '}: {\n' +
          '  params: Promise<{ id: string }>;\n' +
          '}) {\n' +
          '  const { id } = await params;\n' +
          '  const product = await db.product.findUnique({ where: { id } });\n' +
          '\n' +
          '  return (\n' +
          '    <main>\n' +
          '      <h1>{product?.name}</h1>\n' +
          '      <p>{product?.description}</p>\n' +
          '      {/* 인터랙티브 부분만 Client Component */}\n' +
          '      <AddToCartButton\n' +
          '        productId={id}\n' +
          '        price={product?.price ?? 0}\n' +
          '      />\n' +
          '    </main>\n' +
          '  );\n' +
          '}',
        description:
          "페이지는 Server Component로 유지하고, 인터랙티브한 버튼만 \"use client\"로 분리하여 번들 크기를 최소화합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 브라우저 API를 사용하는 Client Component",
      content:
        "브라우저 전용 API를 사용하는 컴포넌트를 Client Component로 구현합니다. window resize 이벤트를 감지하여 반응형 레이아웃 정보를 표시하고, localStorage를 사용한 테마 토글을 구현합니다.",
      code: {
        language: "typescript",
        code:
          '"use client";\n' +
          '\n' +
          'import { useState, useEffect } from "react";\n' +
          '\n' +
          'type Theme = "light" | "dark";\n' +
          '\n' +
          'export default function ThemeToggle() {\n' +
          '  const [theme, setTheme] = useState<Theme>("light");\n' +
          '  const [windowWidth, setWindowWidth] = useState(0);\n' +
          '\n' +
          '  // localStorage에서 테마 복원\n' +
          '  useEffect(() => {\n' +
          '    const saved = localStorage.getItem("theme") as Theme | null;\n' +
          '    if (saved) {\n' +
          '      setTheme(saved);\n' +
          '      document.documentElement.setAttribute("data-theme", saved);\n' +
          '    }\n' +
          '  }, []);\n' +
          '\n' +
          '  // window resize 감지\n' +
          '  useEffect(() => {\n' +
          '    const handleResize = () => setWindowWidth(window.innerWidth);\n' +
          '    handleResize(); // 초기값 설정\n' +
          '    window.addEventListener("resize", handleResize);\n' +
          '    return () => window.removeEventListener("resize", handleResize);\n' +
          '  }, []);\n' +
          '\n' +
          '  const toggleTheme = () => {\n' +
          '    const next: Theme = theme === "light" ? "dark" : "light";\n' +
          '    setTheme(next);\n' +
          '    localStorage.setItem("theme", next);\n' +
          '    document.documentElement.setAttribute("data-theme", next);\n' +
          '  };\n' +
          '\n' +
          '  const breakpoint =\n' +
          '    windowWidth < 640\n' +
          '      ? "mobile"\n' +
          '      : windowWidth < 1024\n' +
          '        ? "tablet"\n' +
          '        : "desktop";\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <button onClick={toggleTheme}>\n' +
          '        {theme === "light" ? "다크 모드" : "라이트 모드"}\n' +
          '      </button>\n' +
          '      <span>\n' +
          '        현재: {breakpoint} ({windowWidth}px)\n' +
          '      </span>\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "useState, useEffect, localStorage, window API를 사용하므로 반드시 \"use client\"가 필요합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| \"use client\" | 서버-클라이언트 경계를 선언하는 지시어 |\n" +
        "| 경계 전파 | 해당 파일의 모든 하위 import도 클라이언트 번들에 포함 |\n" +
        "| 프리렌더링 | \"use client\"여도 서버에서 HTML이 먼저 생성됨 |\n" +
        "| 말단 배치 | 경계를 트리의 leaf에 두어 번들 크기 최소화 |\n" +
        "| 필요 조건 | 훅, 이벤트 핸들러, 브라우저 API 사용 시 |\n\n" +
        "**핵심:** \"use client\"는 서버-클라이언트 경계를 선언하는 지시어입니다. 상호작용이 필요한 컴포넌트에만 붙이고, 가능한 한 트리의 말단에 배치하세요.\n\n" +
        "**다음 챕터 미리보기:** Server Component와 Client Component를 효과적으로 조합하는 합성 패턴(도넛 패턴 등)을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "\"use client\"는 서버-클라이언트 경계를 선언하는 지시어다. 상호작용이 필요한 컴포넌트에만 붙이고, 가능한 한 트리의 말단(leaf)에 배치하라.",
  checklist: [
    "\"use client\" 지시어가 필요한 상황을 정확히 판단할 수 있다",
    "\"use client\"가 CSR을 의미하지 않음을 이해하고 설명할 수 있다",
    "경계 전파의 개념을 이해하고 번들 크기 영향을 설명할 수 있다",
    "인터랙티브 부분만 Client Component로 분리하는 전략을 적용할 수 있다",
    "Server Component와 Client Component의 차이를 코드 레벨에서 구분할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "\"use client\" 지시어의 역할은?",
      choices: [
        "컴포넌트를 클라이언트에서만 렌더링하게 한다",
        "서버-클라이언트 경계를 선언한다",
        "서버 사이드 렌더링을 비활성화한다",
        "컴포넌트를 lazy loading한다",
      ],
      correctIndex: 1,
      explanation:
        "\"use client\"는 서버-클라이언트 경계를 선언하는 지시어입니다. 해당 파일과 하위 import가 클라이언트 번들에 포함되지만, 서버에서도 프리렌더됩니다.",
    },
    {
      id: "q2",
      question:
        "\"use client\" 컴포넌트에 대한 설명 중 올바른 것은?",
      choices: [
        "서버에서 전혀 실행되지 않는다",
        "HTML 프리렌더링 없이 클라이언트에서만 렌더링된다",
        "서버에서 프리렌더되고 클라이언트에서 hydration된다",
        "SEO에 불리하다",
      ],
      correctIndex: 2,
      explanation:
        "\"use client\" 컴포넌트도 서버에서 HTML이 프리렌더되고, 클라이언트에서 JavaScript가 로드되면 hydration이 일어납니다. CSR과는 다릅니다.",
    },
    {
      id: "q3",
      question:
        "\"use client\" 경계를 어디에 배치하는 것이 가장 좋은가?",
      choices: [
        "page.tsx 최상단",
        "layout.tsx에 한 번만",
        "가능한 한 트리의 말단(leaf) 컴포넌트",
        "모든 컴포넌트에 동일하게",
      ],
      correctIndex: 2,
      explanation:
        "\"use client\" 경계를 트리의 말단에 배치하면 최소한의 코드만 클라이언트 번들에 포함되어 번들 크기를 최적화할 수 있습니다.",
    },
    {
      id: "q4",
      question:
        "다음 중 \"use client\"가 반드시 필요한 경우는?",
      choices: [
        "데이터를 fetch로 가져올 때",
        "정적 텍스트만 렌더링할 때",
        "useState로 토글 상태를 관리할 때",
        "async 컴포넌트에서 DB를 조회할 때",
      ],
      correctIndex: 2,
      explanation:
        "useState는 클라이언트 상태 관리를 위한 React 훅이므로 \"use client\" 지시어가 필요합니다. 나머지는 Server Component에서 처리할 수 있습니다.",
    },
    {
      id: "q5",
      question:
        "파일 A에 \"use client\"를 붙이고 파일 B를 import하면?",
      choices: [
        "파일 B는 Server Component로 유지된다",
        "파일 B도 클라이언트 번들에 포함된다",
        "파일 B에도 \"use client\"를 붙여야 한다",
        "빌드 에러가 발생한다",
      ],
      correctIndex: 1,
      explanation:
        "\"use client\" 경계는 해당 파일에서 import하는 모든 모듈에 전파됩니다. 파일 B에 별도의 \"use client\"가 없어도 클라이언트 번들에 포함됩니다.",
    },
  ],
};

export default chapter;
