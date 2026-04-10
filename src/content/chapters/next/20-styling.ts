import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "20-styling",
  subject: "next",
  title: "스타일링 전략",
  description:
    "CSS Modules, Tailwind CSS, Global CSS, CSS-in-JS의 Server Components 호환성 문제, Sass 지원, 추천 스타일링 조합을 학습합니다.",
  order: 20,
  group: "스타일링과 최적화",
  prerequisites: ["19-internationalization"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "스타일링 전략은 **옷을 입는 방법**에 비유할 수 있습니다.\n\n" +
        "**CSS Modules**는 **개인 옷장**입니다. 각 컴포넌트가 자기만의 옷장을 가지고 있어서 " +
        "다른 사람의 옷(스타일)과 절대 섞이지 않습니다. `.button` 클래스가 여러 컴포넌트에 있어도 " +
        "각자의 옷장에서 꺼내므로 충돌이 없습니다.\n\n" +
        "**Tailwind CSS**는 **유니폼 시스템**입니다. `text-lg`, `bg-blue-500` 같은 미리 정해진 규격의 옷 조각을 " +
        "조합해서 입습니다. 디자인 시스템이 일관되고, 새로운 옷을 만들 필요 없이 기존 조각을 조합하면 됩니다.\n\n" +
        "**CSS-in-JS**(styled-components)는 **맞춤 양복점**입니다. JavaScript로 실시간에 양복을 재단(스타일 생성)합니다. " +
        "매우 유연하지만, 서버 컴포넌트에서는 양복점이 문을 닫은 상태(런타임 없음)이므로 사용할 수 없습니다. " +
        "클라이언트 컴포넌트에서만 양복점을 이용할 수 있습니다.\n\n" +
        "**Global CSS**는 **교복**입니다. 모든 학생(컴포넌트)이 같은 기본 스타일을 공유합니다. " +
        "리셋 CSS나 기본 타이포그래피 같은 공통 스타일에 적합합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "Next.js App Router에서 스타일링을 선택할 때 **Server Components라는 새로운 제약**이 생깁니다.\n\n" +
        "### 1. CSS-in-JS의 호환성 문제\n" +
        "styled-components, Emotion 같은 CSS-in-JS 라이브러리는 JavaScript 런타임에서 스타일을 생성합니다. " +
        "서버 컴포넌트는 JavaScript가 클라이언트로 전송되지 않으므로 런타임 CSS-in-JS가 동작하지 않습니다. " +
        "'use client'를 붙여야만 사용할 수 있고, 이는 서버 컴포넌트의 장점을 포기하는 것입니다.\n\n" +
        "### 2. 스타일 충돌\n" +
        "여러 개발자가 작업하는 프로젝트에서 전역 CSS만 사용하면 클래스명이 충돌합니다. " +
        "`.container`, `.title` 같은 일반적인 이름이 서로 덮어쓰기됩니다.\n\n" +
        "### 3. 번들 크기\n" +
        "사용하지 않는 CSS가 번들에 포함되면 로딩 속도가 느려집니다. " +
        "특히 대규모 프로젝트에서 CSS 파일이 수백 KB로 커질 수 있습니다.\n\n" +
        "### 4. 일관성 부족\n" +
        "디자인 시스템 없이 스타일링하면 같은 색상, 간격, 폰트 크기를 여러 곳에서 다르게 정의하게 됩니다. " +
        "유지보수 비용이 급격히 증가합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js는 여러 스타일링 방식을 기본 지원하며, **Server Components 호환성**을 기준으로 선택하면 됩니다.\n\n" +
        "### 1. CSS Modules (권장)\n" +
        "`.module.css` 파일에 스타일을 작성하면 클래스명이 자동으로 고유하게 변환됩니다. " +
        "서버 컴포넌트와 100% 호환되며, 빌드 시점에 처리되므로 런타임 비용이 없습니다.\n\n" +
        "### 2. Tailwind CSS (권장)\n" +
        "Next.js가 공식 지원하는 유틸리티 CSS 프레임워크입니다. `create-next-app`에서 바로 선택할 수 있습니다. " +
        "서버 컴포넌트와 완벽 호환되고, 사용하지 않는 클래스는 빌드 시 제거(purge)됩니다.\n\n" +
        "### 3. Global CSS\n" +
        "`app/globals.css`에서 리셋 CSS, 기본 타이포그래피, CSS 변수 등 공통 스타일을 정의합니다. " +
        "App Router에서는 기술적으로 모든 layout이나 Server Component에서 Global CSS를 import할 수 있습니다. 그러나 **공식 권장사항은 root layout(`app/layout.tsx`)에서만 Global CSS를 import하는 것**입니다. 자식 layout에서 Global CSS를 import하면 동일한 CSS가 중복 포함되거나 CSS specificity 문제가 발생할 수 있습니다. (Pages Router에서는 `_app.tsx`에서만 가능했던 제한이 해제되었습니다.)\n\n" +
        "### 4. Sass 지원\n" +
        "`sass` 패키지를 설치하면 `.module.scss` 파일을 바로 사용할 수 있습니다. " +
        "변수, 중첩, mixin 등 Sass 기능을 CSS Modules과 함께 쓸 수 있습니다.\n\n" +
        "### 5. CSS-in-JS (제한적)\n" +
        "반드시 필요하다면 'use client' 컴포넌트에서만 사용합니다. " +
        "가능하면 CSS Modules + Tailwind 조합으로 대체하는 것을 권장합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: CSS Modules과 Tailwind CSS 설정",
      content:
        "CSS Modules로 컴포넌트별 스코프 스타일을 정의하고, Tailwind CSS로 유틸리티 클래스를 조합하는 " +
        "실전 패턴을 구현합니다. 서버 컴포넌트에서 안전하게 사용할 수 있는 스타일링 방법을 보여줍니다.",
      code: {
        language: "typescript",
        code:
          '// === app/globals.css ===\n' +
          '// @tailwind base;\n' +
          '// @tailwind components;\n' +
          '// @tailwind utilities;\n' +
          '//\n' +
          '// :root {\n' +
          '//   --color-primary: #3b82f6;\n' +
          '//   --color-secondary: #64748b;\n' +
          '// }\n\n' +
          '// === components/Card.module.css ===\n' +
          '// .card {\n' +
          '//   border-radius: 12px;\n' +
          '//   padding: 1.5rem;\n' +
          '//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n' +
          '//   transition: transform 0.2s ease;\n' +
          '// }\n' +
          '// .card:hover {\n' +
          '//   transform: translateY(-2px);\n' +
          '// }\n' +
          '// .title {\n' +
          '//   font-size: 1.25rem;\n' +
          '//   font-weight: 600;\n' +
          '//   color: var(--color-primary);\n' +
          '// }\n\n' +
          '// === components/Card.tsx — CSS Modules 방식 ===\n' +
          'import styles from "./Card.module.css";\n\n' +
          'interface CardProps {\n' +
          '  title: string;\n' +
          '  description: string;\n' +
          '}\n\n' +
          '// 서버 컴포넌트에서 안전하게 사용 가능\n' +
          'export function Card({ title, description }: CardProps) {\n' +
          '  return (\n' +
          '    <div className={styles.card}>\n' +
          '      <h3 className={styles.title}>{title}</h3>\n' +
          '      <p>{description}</p>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// === components/Button.tsx — Tailwind CSS 방식 ===\n' +
          'interface ButtonProps {\n' +
          '  variant: "primary" | "secondary";\n' +
          '  children: React.ReactNode;\n' +
          '}\n\n' +
          'export function Button({ variant, children }: ButtonProps) {\n' +
          '  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";\n' +
          '  const variantClasses = {\n' +
          '    primary: "bg-blue-500 text-white hover:bg-blue-600",\n' +
          '    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",\n' +
          '  };\n\n' +
          '  return (\n' +
          '    <button className={`${baseClasses} ${variantClasses[variant]}`}>\n' +
          '      {children}\n' +
          '    </button>\n' +
          '  );\n' +
          '}',
        description:
          "CSS Modules은 자동 스코핑으로 클래스 충돌을 방지하고, Tailwind CSS는 유틸리티 클래스 조합으로 빠르게 스타일링합니다. 둘 다 서버 컴포넌트에서 안전하게 사용 가능합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: CSS Modules + Tailwind 조합 페이지",
      content:
        "실제 프로젝트에서 CSS Modules과 Tailwind CSS를 함께 사용하는 패턴을 실습합니다. " +
        "복잡한 레이아웃은 CSS Modules로, 간단한 유틸리티 스타일은 Tailwind로 처리하는 조합을 보여줍니다. " +
        "서버 컴포넌트와 클라이언트 컴포넌트에서 각각 스타일링하는 차이도 확인합니다.",
      code: {
        language: "typescript",
        code:
          '// === components/ProductGrid.module.css ===\n' +
          '// .grid {\n' +
          '//   display: grid;\n' +
          '//   grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\n' +
          '//   gap: 1.5rem;\n' +
          '//   padding: 2rem 0;\n' +
          '// }\n\n' +
          '// === components/ProductGrid.tsx — 서버 컴포넌트 ===\n' +
          'import styles from "./ProductGrid.module.css";\n\n' +
          'interface Product {\n' +
          '  id: number;\n' +
          '  name: string;\n' +
          '  price: number;\n' +
          '  image: string;\n' +
          '}\n\n' +
          'export async function ProductGrid() {\n' +
          '  const products: Product[] = await fetch(\n' +
          '    "https://api.example.com/products"\n' +
          '  ).then((res) => res.json());\n\n' +
          '  return (\n' +
          '    <div className={styles.grid}>\n' +
          '      {products.map((product) => (\n' +
          '        <div\n' +
          '          key={product.id}\n' +
          '          className="rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow"\n' +
          '        >\n' +
          '          {/* Tailwind로 간단한 스타일 */}\n' +
          '          <h3 className="text-lg font-semibold text-gray-900">\n' +
          '            {product.name}\n' +
          '          </h3>\n' +
          '          <p className="mt-2 text-blue-600 font-bold">\n' +
          '            {product.price.toLocaleString()}원\n' +
          '          </p>\n' +
          '        </div>\n' +
          '      ))}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// === components/ThemeToggle.tsx — 클라이언트 컴포넌트 ===\n' +
          '"use client";\n\n' +
          'import { useState } from "react";\n\n' +
          'export function ThemeToggle() {\n' +
          '  const [isDark, setIsDark] = useState(false);\n\n' +
          '  return (\n' +
          '    <button\n' +
          '      onClick={() => setIsDark(!isDark)}\n' +
          '      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${\n' +
          '        isDark\n' +
          '          ? "bg-gray-800 text-white"\n' +
          '          : "bg-yellow-100 text-yellow-800"\n' +
          '      }`}\n' +
          '    >\n' +
          '      {isDark ? "다크 모드" : "라이트 모드"}\n' +
          '    </button>\n' +
          '  );\n' +
          '}',
        description:
          "복잡한 그리드 레이아웃은 CSS Modules로, 간단한 스타일은 Tailwind로 처리합니다. 서버 컴포넌트(ProductGrid)와 클라이언트 컴포넌트(ThemeToggle) 모두 Tailwind를 사용할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 방식 | Server Components | 스코핑 | 런타임 비용 | 추천도 |\n" +
        "|------|:-:|:-:|:-:|:-:|\n" +
        "| CSS Modules | O | 자동 | 없음 | 높음 |\n" +
        "| Tailwind CSS | O | 유틸리티 | 없음 | 높음 |\n" +
        "| Global CSS | O | 없음 | 없음 | 공통만 |\n" +
        "| Sass | O | 자동 (.module.scss) | 없음 | 보통 |\n" +
        "| CSS-in-JS | X (Client만) | 자동 | 있음 | 낮음 |\n\n" +
        "**핵심:** Server Components에서는 CSS Modules이나 Tailwind가 가장 호환성이 좋습니다. " +
        "CSS-in-JS(styled-components 등)는 런타임이 필요하므로 Client Components에서만 사용 가능합니다.\n\n" +
        "**다음 챕터 미리보기:** 스타일링 전략을 익혔으니, " +
        "이제 next/image 컴포넌트를 활용한 이미지 자동 최적화(WebP 변환, lazy loading, 반응형 이미지)를 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Server Components에서는 CSS Modules이나 Tailwind가 가장 호환성이 좋다. CSS-in-JS(styled-components 등)는 런타임이 필요하므로 Client Components에서만 사용 가능하다.",
  checklist: [
    "CSS Modules의 자동 스코핑 원리를 설명할 수 있다",
    "Tailwind CSS가 서버 컴포넌트와 호환되는 이유를 이해한다",
    "CSS-in-JS가 서버 컴포넌트에서 동작하지 않는 이유를 설명할 수 있다",
    "CSS Modules과 Tailwind를 조합하는 실전 패턴을 구현할 수 있다",
    "프로젝트 특성에 따라 적절한 스타일링 전략을 선택할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Next.js Server Components에서 사용할 수 없는 스타일링 방식은?",
      choices: [
        "CSS Modules",
        "Tailwind CSS",
        "styled-components (CSS-in-JS)",
        "Global CSS",
      ],
      correctIndex: 2,
      explanation:
        "styled-components 같은 CSS-in-JS 라이브러리는 JavaScript 런타임에서 스타일을 생성하므로 서버 컴포넌트에서 사용할 수 없습니다. 'use client' 지시어가 필요합니다.",
    },
    {
      id: "q2",
      question: "CSS Modules의 파일 확장자로 올바른 것은?",
      choices: [
        ".css",
        ".module.css",
        ".scoped.css",
        ".local.css",
      ],
      correctIndex: 1,
      explanation:
        "CSS Modules는 .module.css 확장자를 사용합니다. Next.js가 이 규칙을 인식하여 클래스명을 자동으로 고유하게 변환합니다.",
    },
    {
      id: "q3",
      question: "Tailwind CSS의 빌드 시 사용하지 않는 클래스 처리 방식은?",
      choices: [
        "런타임에 동적으로 제거한다",
        "빌드 시 사용되지 않는 클래스를 purge한다",
        "모든 클래스를 포함하고 압축만 한다",
        "브라우저 캐시에서 자동 제거한다",
      ],
      correctIndex: 1,
      explanation:
        "Tailwind CSS는 빌드 시 실제 사용된 클래스만 남기고 나머지를 제거(purge)합니다. 이를 통해 최종 CSS 파일 크기가 매우 작아집니다.",
    },
    {
      id: "q4",
      question: "Next.js에서 Global CSS를 import할 수 있는 위치는?",
      choices: [
        "모든 컴포넌트에서 import 가능",
        "app/layout.tsx (root layout)에서만 import",
        "page.tsx에서만 import 가능",
        "모든 layout 또는 Server Component에서 import 가능",
      ],
      correctIndex: 3,
      explanation:
        "App Router에서는 Global CSS를 root layout뿐만 아니라 모든 layout이나 Server Component에서 import할 수 있습니다. 이는 Pages Router에서 _app.tsx에서만 가능했던 것과 다른 점입니다.",
    },
    {
      id: "q5",
      question: "Next.js에서 Sass를 사용하려면 어떤 추가 설정이 필요한가?",
      choices: [
        "next.config.js에서 Sass 플러그인을 설정해야 한다",
        "sass 패키지만 설치하면 .scss 파일을 바로 사용할 수 있다",
        "별도의 Webpack 설정 파일이 필요하다",
        "postcss.config.js에 Sass 플러그인을 추가해야 한다",
      ],
      correctIndex: 1,
      explanation:
        "Next.js는 Sass를 기본 지원합니다. sass 패키지만 설치하면 추가 설정 없이 .scss, .module.scss 파일을 바로 사용할 수 있습니다.",
    },
  ],
};

export default chapter;
