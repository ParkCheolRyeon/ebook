import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "22-font-optimization",
  subject: "next",
  title: "폰트 최적화 (next/font)",
  description:
    "next/font/google로 Google Fonts 빌드 타임 다운로드, FOUT/FOIT 해결, 셀프 호스팅, next/font/local 커스텀 폰트, CSS 변수로 Tailwind 연동을 학습합니다.",
  order: 22,
  group: "스타일링과 최적화",
  prerequisites: ["21-image-optimization"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "next/font는 **폰트 배달 서비스의 혁신**에 비유할 수 있습니다.\n\n" +
        "기존 방식(Google Fonts CDN)은 **매번 외부 식당에서 음식을 배달**시키는 것과 같습니다. " +
        "페이지를 열 때마다 Google 서버에 '이 폰트 좀 보내주세요' 하고 요청합니다. " +
        "네트워크가 느리면 음식(폰트)이 늦게 도착하고, 그동안 기본 폰트(시스템 폰트)로 " +
        "임시로 보여주다가 갑자기 바뀌는 현상(FOUT)이 발생합니다. " +
        "또는 음식이 올 때까지 아예 글자를 안 보여주는 경우(FOIT)도 있습니다.\n\n" +
        "next/font는 **식재료를 미리 집에 갖다놓는 것**입니다. " +
        "빌드할 때 Google Fonts에서 폰트 파일을 다운로드하여 프로젝트에 포함(셀프 호스팅)시킵니다. " +
        "배포 후에는 외부 요청 없이 자체 서버에서 폰트를 제공하므로, " +
        "Google 서버가 느려도 영향받지 않습니다.\n\n" +
        "**CSS 변수 연동**은 **레시피 카드에 재료 이름표를 붙이는 것**입니다. " +
        "`--font-sans`라는 이름표(변수)를 Tailwind의 `fontFamily`에 등록하면, " +
        "어디서든 이 이름표만으로 폰트를 사용할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "웹 폰트는 사용자 경험에 직접적인 영향을 미치지만, **기존 방식에는 여러 문제가 있습니다.**\n\n" +
        "### 1. FOUT (Flash of Unstyled Text)\n" +
        "폰트가 로드되기 전에 시스템 폰트로 텍스트가 먼저 표시되었다가, " +
        "폰트가 도착하면 갑자기 글꼴이 바뀝니다. 텍스트가 깜빡이고 레이아웃이 밀리는 " +
        "불쾌한 경험을 줍니다.\n\n" +
        "### 2. FOIT (Flash of Invisible Text)\n" +
        "폰트가 로드될 때까지 텍스트를 아예 보여주지 않습니다. " +
        "네트워크가 느린 환경에서는 수 초간 빈 화면이 표시됩니다.\n\n" +
        "### 3. 외부 네트워크 의존성\n" +
        "Google Fonts CDN에서 폰트를 로드하면 `fonts.googleapis.com`과 `fonts.gstatic.com`에 " +
        "두 번의 외부 요청이 발생합니다. 프라이버시 문제(유럽 GDPR)와 성능 저하의 원인이 됩니다.\n\n" +
        "### 4. CLS (Cumulative Layout Shift)\n" +
        "시스템 폰트와 웹 폰트의 글자 크기가 달라서, 폰트 교체 시 텍스트 영역이 늘어나거나 줄어들며 " +
        "레이아웃이 밀립니다. Core Web Vitals의 CLS 점수에 악영향을 줍니다.\n\n" +
        "### 5. 수동 최적화의 번거로움\n" +
        "font-display, preload, subset 등을 직접 설정해야 하며, " +
        "Tailwind와 연동하려면 CSS 변수를 수동으로 관리해야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "next/font는 이 모든 문제를 **빌드 타임 최적화**로 한 번에 해결합니다.\n\n" +
        "### 1. 빌드 타임 다운로드 + 셀프 호스팅\n" +
        "`next/font/google`을 사용하면 빌드 시점에 Google Fonts에서 폰트를 다운로드합니다. " +
        "배포 후에는 자체 도메인에서 폰트를 제공하므로 외부 네트워크 요청이 완전히 사라집니다.\n\n" +
        "### 2. FOUT/FOIT 자동 해결\n" +
        "next/font는 `size-adjust` CSS 속성으로 시스템 폰트와 웹 폰트의 크기 차이를 자동으로 보정합니다. " +
        "폰트 교체 시 레이아웃 이동이 거의 없습니다.\n\n" +
        "### 3. CSS 변수로 Tailwind 연동\n" +
        "폰트를 CSS 변수(`--font-sans`)로 내보내고 Tailwind의 `fontFamily`에 등록하면, " +
        "`font-sans` 클래스만으로 최적화된 폰트를 사용할 수 있습니다.\n\n" +
        "### 4. next/font/local\n" +
        "Google Fonts에 없는 커스텀 폰트도 `next/font/local`로 동일한 최적화를 적용할 수 있습니다. " +
        "로컬 폰트 파일 경로만 지정하면 됩니다.\n\n" +
        "### 5. subset 옵션\n" +
        "`subsets: ['latin']`이나 `subsets: ['latin', 'latin-ext']`로 " +
        "필요한 문자 세트만 포함하여 폰트 파일 크기를 최소화합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: next/font 설정과 Tailwind 연동",
      content:
        "next/font/google로 Google Fonts를 로드하고, CSS 변수를 통해 " +
        "Tailwind CSS와 연동하는 전체 흐름을 구현합니다. " +
        "또한 next/font/local로 커스텀 폰트를 설정하는 방법도 함께 보여줍니다.",
      code: {
        language: "typescript",
        code:
          '// === app/layout.tsx — Google Fonts + CSS 변수 ===\n' +
          'import { Inter, Noto_Sans_KR } from "next/font/google";\n\n' +
          '// 영문 폰트\n' +
          'const inter = Inter({\n' +
          '  subsets: ["latin"],\n' +
          '  display: "swap",        // 폰트 로드 전 시스템 폰트 표시\n' +
          '  variable: "--font-inter", // CSS 변수로 내보내기\n' +
          '});\n\n' +
          '// 한글 폰트\n' +
          'const notoSansKR = Noto_Sans_KR({\n' +
          '  subsets: ["latin"],      // 한글은 자동 포함\n' +
          '  weight: ["400", "700"],  // 필요한 굵기만 선택\n' +
          '  display: "swap",\n' +
          '  variable: "--font-noto-sans-kr",\n' +
          '});\n\n' +
          'export default function RootLayout({\n' +
          '  children,\n' +
          '}: {\n' +
          '  children: React.ReactNode;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <html\n' +
          '      lang="ko"\n' +
          '      className={`${inter.variable} ${notoSansKR.variable}`}\n' +
          '    >\n' +
          '      <body>{children}</body>\n' +
          '    </html>\n' +
          '  );\n' +
          '}\n\n' +
          '// === tailwind.config.ts — CSS 변수 연동 ===\n' +
          'import type { Config } from "tailwindcss";\n\n' +
          'const config: Config = {\n' +
          '  theme: {\n' +
          '    extend: {\n' +
          '      fontFamily: {\n' +
          '        sans: ["var(--font-noto-sans-kr)", "var(--font-inter)", "sans-serif"],\n' +
          '        mono: ["var(--font-mono)", "monospace"],\n' +
          '      },\n' +
          '    },\n' +
          '  },\n' +
          '};\n\n' +
          'export default config;\n\n' +
          '// === next/font/local — 커스텀 폰트 ===\n' +
          'import localFont from "next/font/local";\n\n' +
          'const pretendard = localFont({\n' +
          '  src: [\n' +
          '    { path: "./fonts/Pretendard-Regular.woff2", weight: "400" },\n' +
          '    { path: "./fonts/Pretendard-Bold.woff2", weight: "700" },\n' +
          '  ],\n' +
          '  variable: "--font-pretendard",\n' +
          '  display: "swap",\n' +
          '});',
        description:
          "next/font/google로 Inter와 Noto Sans KR을 빌드 타임에 다운로드하고, CSS 변수로 Tailwind와 연동합니다. next/font/local로 커스텀 폰트도 동일한 방식으로 최적화합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 다중 폰트 적용 페이지",
      content:
        "영문 폰트와 한글 폰트를 함께 사용하는 실전 패턴을 실습합니다. " +
        "CSS 변수를 활용하여 Tailwind 클래스로 폰트를 전환하고, " +
        "코드 블록에는 모노스페이스 폰트를 적용하는 예제입니다.",
      code: {
        language: "typescript",
        code:
          '// === app/layout.tsx ===\n' +
          'import { Inter, Noto_Sans_KR, JetBrains_Mono } from "next/font/google";\n\n' +
          'const inter = Inter({\n' +
          '  subsets: ["latin"],\n' +
          '  variable: "--font-inter",\n' +
          '});\n\n' +
          'const notoSansKR = Noto_Sans_KR({\n' +
          '  subsets: ["latin"],\n' +
          '  weight: ["400", "500", "700"],\n' +
          '  variable: "--font-noto-sans-kr",\n' +
          '});\n\n' +
          'const jetbrainsMono = JetBrains_Mono({\n' +
          '  subsets: ["latin"],\n' +
          '  variable: "--font-mono",\n' +
          '});\n\n' +
          'export default function RootLayout({\n' +
          '  children,\n' +
          '}: {\n' +
          '  children: React.ReactNode;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <html\n' +
          '      lang="ko"\n' +
          '      className={`${inter.variable} ${notoSansKR.variable} ${jetbrainsMono.variable}`}\n' +
          '    >\n' +
          '      <body className="font-sans">{children}</body>\n' +
          '    </html>\n' +
          '  );\n' +
          '}\n\n' +
          '// === app/page.tsx — 폰트 활용 페이지 ===\n' +
          'export default function HomePage() {\n' +
          '  return (\n' +
          '    <main className="max-w-3xl mx-auto px-4 py-12">\n' +
          '      {/* 본문: Noto Sans KR (font-sans로 기본 적용) */}\n' +
          '      <h1 className="text-4xl font-bold mb-4">\n' +
          '        next/font로 폰트 최적화하기\n' +
          '      </h1>\n' +
          '      <p className="text-lg text-gray-600 mb-8">\n' +
          '        빌드 타임에 폰트를 다운로드하여 FOUT/FOIT 없이 깔끔하게 렌더링됩니다.\n' +
          '        외부 네트워크 요청이 없으므로 성능과 프라이버시 모두 개선됩니다.\n' +
          '      </p>\n\n' +
          '      {/* 코드 블록: JetBrains Mono */}\n' +
          '      <pre className="font-mono bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">\n' +
          '        <code>{`import { Inter } from "next/font/google";\n' +
          'const inter = Inter({ subsets: ["latin"] });`}</code>\n' +
          '      </pre>\n\n' +
          '      {/* 폰트 비교 섹션 */}\n' +
          '      <div className="mt-8 space-y-4">\n' +
          '        <p className="font-sans text-xl">Noto Sans KR: 한글 본문 텍스트</p>\n' +
          '        <p className="font-mono text-xl">JetBrains Mono: 코드 텍스트</p>\n' +
          '      </div>\n' +
          '    </main>\n' +
          '  );\n' +
          '}',
        description:
          "세 가지 폰트(본문 한글, 본문 영문, 코드용 모노스페이스)를 CSS 변수로 등록하고, Tailwind의 font-sans/font-mono 클래스로 전환합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 기능 | 설명 |\n" +
        "|------|------|\n" +
        "| next/font/google | Google Fonts를 빌드 타임에 다운로드, 셀프 호스팅 |\n" +
        "| next/font/local | 커스텀 로컬 폰트에 동일한 최적화 적용 |\n" +
        "| FOUT/FOIT 방지 | size-adjust로 폰트 교체 시 레이아웃 이동 최소화 |\n" +
        "| 셀프 호스팅 | 외부 네트워크 요청 제거, GDPR 호환 |\n" +
        "| CSS variable | --font-sans 형태로 Tailwind와 깔끔하게 연동 |\n" +
        "| subsets | 필요한 문자 세트만 포함하여 파일 크기 최소화 |\n" +
        "| display: swap | 폰트 로드 전 시스템 폰트로 임시 표시 |\n\n" +
        "**핵심:** next/font는 폰트를 빌드 타임에 다운로드하여 셀프 호스팅하므로 외부 요청이 사라집니다. " +
        "FOUT/FOIT 문제를 자동 해결하고, CSS 변수로 Tailwind와 깔끔하게 연동됩니다.\n\n" +
        "**다음 챕터 미리보기:** 폰트 최적화를 마쳤으니, " +
        "이제 metadata export와 generateMetadata를 활용한 SEO 최적화(Open Graph, sitemap, JSON-LD)를 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "next/font는 폰트를 빌드 타임에 다운로드하여 셀프 호스팅하므로 외부 요청이 사라진다. FOUT/FOIT 문제를 자동 해결하고, CSS 변수로 Tailwind와 깔끔하게 연동된다.",
  checklist: [
    "next/font/google로 Google Fonts를 빌드 타임에 로드하는 방법을 구현할 수 있다",
    "FOUT와 FOIT의 차이를 설명하고 next/font가 이를 해결하는 원리를 이해한다",
    "CSS 변수(variable)로 폰트를 Tailwind CSS와 연동할 수 있다",
    "next/font/local로 커스텀 폰트를 최적화할 수 있다",
    "subsets와 weight 옵션으로 폰트 파일 크기를 최소화할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "next/font/google이 기존 Google Fonts CDN 방식과 다른 핵심 차이는?",
      choices: [
        "폰트를 더 빠른 CDN에서 제공한다",
        "빌드 타임에 폰트를 다운로드하여 셀프 호스팅한다",
        "폰트를 JavaScript 번들에 인라인한다",
        "폰트를 Base64로 인코딩하여 CSS에 포함한다",
      ],
      correctIndex: 1,
      explanation:
        "next/font/google은 빌드 시점에 Google Fonts에서 폰트를 다운로드하여 프로젝트에 포함합니다. 배포 후에는 외부 요청 없이 자체 서버에서 폰트를 제공합니다.",
    },
    {
      id: "q2",
      question: "FOUT(Flash of Unstyled Text)란 무엇인가?",
      choices: [
        "폰트가 로드될 때까지 텍스트가 보이지 않는 현상",
        "폰트 로드 전 시스템 폰트로 표시되다가 갑자기 바뀌는 현상",
        "폰트 파일이 깨져서 깨진 글자가 표시되는 현상",
        "폰트 크기가 달라 레이아웃이 깨지는 현상",
      ],
      correctIndex: 1,
      explanation:
        "FOUT는 웹 폰트가 로드되기 전에 시스템 폰트(fallback)로 텍스트가 표시되었다가, 웹 폰트가 도착하면 갑자기 글꼴이 바뀌는 현상입니다.",
    },
    {
      id: "q3",
      question: "next/font에서 CSS 변수(variable)를 설정하는 이유는?",
      choices: [
        "폰트 파일 크기를 줄이기 위해",
        "Tailwind CSS의 fontFamily와 연동하기 위해",
        "폰트 로딩 우선순위를 설정하기 위해",
        "FOIT를 방지하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "CSS 변수(--font-sans 등)를 설정하면 Tailwind CSS의 fontFamily에 등록하여 font-sans 같은 유틸리티 클래스로 쉽게 사용할 수 있습니다.",
    },
    {
      id: "q4",
      question: "next/font의 subsets 옵션의 역할은?",
      choices: [
        "폰트의 굵기(weight)를 제한한다",
        "필요한 문자 세트만 포함하여 파일 크기를 줄인다",
        "폰트의 스타일(italic 등)을 설정한다",
        "폰트 렌더링 방식(display)을 지정한다",
      ],
      correctIndex: 1,
      explanation:
        "subsets 옵션으로 필요한 문자 세트(latin, cyrillic 등)만 포함하면 불필요한 문자를 제거하여 폰트 파일 크기를 최소화할 수 있습니다.",
    },
    {
      id: "q5",
      question: "next/font/local을 사용하는 경우로 적절한 것은?",
      choices: [
        "Google Fonts에 있는 인기 폰트를 사용할 때",
        "Google Fonts에 없는 커스텀 폰트(예: Pretendard)를 사용할 때",
        "시스템 폰트만 사용할 때",
        "폰트를 CDN에서 직접 로드할 때",
      ],
      correctIndex: 1,
      explanation:
        "next/font/local은 Google Fonts에 없는 커스텀 폰트 파일(woff2 등)을 로컬에서 로드하면서 동일한 최적화(셀프 호스팅, size-adjust 등)를 적용합니다.",
    },
  ],
};

export default chapter;
