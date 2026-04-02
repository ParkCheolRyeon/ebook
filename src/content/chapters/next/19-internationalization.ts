import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "19-internationalization",
  subject: "next",
  title: "다국어 처리 (i18n)",
  description:
    "Next.js에서 i18n 구현 전략, 서브경로/도메인 방식, 미들웨어 locale 감지, [locale] 동적 세그먼트, 번역 파일 관리, next-intl 라이브러리를 학습합니다.",
  order: 19,
  group: "라우팅 심화",
  prerequisites: ["18-middleware"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "다국어 처리는 **국제공항의 안내 시스템**과 같습니다.\n\n" +
        "공항에 도착하면 입국심사대(미들웨어)에서 여권(브라우저 언어 설정)을 확인합니다. " +
        "한국 여권이면 한국어 안내판이 있는 통로로, 영어권 여권이면 영어 안내판 통로로 안내합니다. " +
        "이것이 바로 미들웨어에서 locale을 감지하고 적절한 경로로 리다이렉트하는 과정입니다.\n\n" +
        "공항 내부의 모든 안내판은 **같은 내용**이지만 **다른 언어**로 표시됩니다. " +
        "출발 게이트(페이지 구조)는 동일하지만, 안내 문구(번역 텍스트)만 다릅니다. " +
        "이것이 `[locale]` 동적 세그먼트의 역할입니다. URL 구조는 같지만 `/ko/about`과 `/en/about`처럼 " +
        "locale에 따라 다른 언어의 콘텐츠를 보여줍니다.\n\n" +
        "번역 파일(JSON)은 공항의 **번역 데이터베이스**입니다. " +
        "안내 방송 담당자(컴포넌트)가 이 데이터베이스에서 해당 언어의 문구를 꺼내 방송하는 것처럼, " +
        "컴포넌트는 번역 파일에서 현재 locale에 맞는 텍스트를 가져와 렌더링합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "글로벌 서비스를 만들 때 다국어 지원은 필수이지만, **직접 구현하면 복잡한 문제가 많습니다.**\n\n" +
        "### 1. URL 설계의 어려움\n" +
        "한국어 페이지는 `/ko/about`, 영어 페이지는 `/en/about`으로 분리해야 합니다. " +
        "모든 라우트를 수동으로 복제하면 유지보수가 불가능해집니다.\n\n" +
        "### 2. 사용자 언어 자동 감지\n" +
        "사용자가 처음 방문했을 때 브라우저의 `Accept-Language` 헤더를 읽어 적절한 locale로 리다이렉트해야 합니다. " +
        "이 로직을 모든 페이지에 넣으면 코드가 중복됩니다.\n\n" +
        "### 3. 번역 텍스트 관리\n" +
        "하드코딩된 텍스트를 모두 번역 키로 바꾸고, 언어별 JSON 파일을 관리해야 합니다. " +
        "번역이 누락되면 빈 문자열이나 키 이름이 그대로 노출됩니다.\n\n" +
        "### 4. SEO와 정적 생성\n" +
        "각 locale별로 별도의 HTML을 생성해야 검색엔진이 올바른 언어로 인덱싱합니다. " +
        "`hreflang` 태그도 올바르게 설정해야 합니다.\n\n" +
        "### 5. 서버 컴포넌트와의 통합\n" +
        "App Router의 서버 컴포넌트에서 현재 locale을 어떻게 전달하고 번역을 적용할지 패턴이 명확하지 않습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js App Router에서는 **미들웨어 + 동적 세그먼트 + 번역 파일** 조합으로 i18n을 깔끔하게 구현합니다.\n\n" +
        "### 1. 서브경로 방식 vs 도메인 방식\n" +
        "- **서브경로 방식**: `example.com/ko`, `example.com/en` — 하나의 도메인에서 locale을 경로로 구분합니다. 설정이 간단하고 가장 널리 사용됩니다.\n" +
        "- **도메인 방식**: `ko.example.com`, `en.example.com` — 도메인별로 locale을 구분합니다. DNS 설정이 필요하지만 브랜딩에 유리합니다.\n\n" +
        "### 2. 미들웨어에서 locale 감지\n" +
        "`middleware.ts`에서 `Accept-Language` 헤더를 읽어 사용자의 선호 언어를 감지하고, " +
        "URL에 locale이 없으면 자동으로 리다이렉트합니다.\n\n" +
        "### 3. [locale] 동적 세그먼트\n" +
        "`app/[locale]/` 하위에 모든 페이지를 배치합니다. " +
        "params에서 locale을 받아 해당 언어의 번역을 로드합니다.\n\n" +
        "### 4. 번역 파일 관리\n" +
        "JSON 파일(`messages/ko.json`, `messages/en.json`)에 번역 텍스트를 관리하고, " +
        "유틸리티 함수나 `next-intl` 같은 라이브러리로 번역을 적용합니다.\n\n" +
        "### 5. generateStaticParams로 locale별 정적 생성\n" +
        "`generateStaticParams`에서 모든 locale을 반환하면 빌드 시 각 언어별 HTML이 생성됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 미들웨어 locale 감지와 동적 세그먼트",
      content:
        "미들웨어에서 사용자의 선호 언어를 감지하고, `[locale]` 동적 세그먼트를 활용하여 " +
        "번역 파일을 로드하는 전체 흐름을 구현합니다. " +
        "서브경로 방식을 기준으로, 미들웨어가 locale이 없는 URL을 감지하면 " +
        "적절한 locale을 붙여 리다이렉트합니다.",
      code: {
        language: "typescript",
        code:
          '// === middleware.ts ===\n' +
          'import { NextRequest, NextResponse } from "next/server";\n\n' +
          'const locales = ["ko", "en", "ja"];\n' +
          'const defaultLocale = "ko";\n\n' +
          'function getLocale(request: NextRequest): string {\n' +
          '  // Accept-Language 헤더에서 선호 언어 감지\n' +
          '  const acceptLanguage = request.headers.get("accept-language") ?? "";\n' +
          '  const preferred = acceptLanguage\n' +
          '    .split(",")\n' +
          '    .map((lang) => lang.split(";")[0].trim().slice(0, 2))\n' +
          '    .find((lang) => locales.includes(lang));\n\n' +
          '  return preferred ?? defaultLocale;\n' +
          '}\n\n' +
          'export function middleware(request: NextRequest) {\n' +
          '  const { pathname } = request.nextUrl;\n\n' +
          '  // pathname에 이미 locale이 포함되어 있는지 확인\n' +
          '  const hasLocale = locales.some(\n' +
          '    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`\n' +
          '  );\n\n' +
          '  if (hasLocale) return NextResponse.next();\n\n' +
          '  // locale이 없으면 감지된 locale로 리다이렉트\n' +
          '  const locale = getLocale(request);\n' +
          '  return NextResponse.redirect(\n' +
          '    new URL(`/${locale}${pathname}`, request.url)\n' +
          '  );\n' +
          '}\n\n' +
          'export const config = {\n' +
          '  // 정적 파일과 API는 제외\n' +
          '  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],\n' +
          '};\n\n' +
          '// === messages/ko.json ===\n' +
          '// {\n' +
          '//   "home": { "title": "환영합니다", "description": "우리 서비스를 소개합니다" },\n' +
          '//   "about": { "title": "소개", "description": "팀을 소개합니다" }\n' +
          '// }\n\n' +
          '// === messages/en.json ===\n' +
          '// {\n' +
          '//   "home": { "title": "Welcome", "description": "Introducing our service" },\n' +
          '//   "about": { "title": "About", "description": "Meet our team" }\n' +
          '// }\n\n' +
          '// === lib/i18n.ts — 번역 로드 유틸리티 ===\n' +
          'type Messages = Record<string, Record<string, string>>;\n\n' +
          'const dictionaries: Record<string, () => Promise<Messages>> = {\n' +
          '  ko: () => import("@/messages/ko.json").then((m) => m.default),\n' +
          '  en: () => import("@/messages/en.json").then((m) => m.default),\n' +
          '  ja: () => import("@/messages/ja.json").then((m) => m.default),\n' +
          '};\n\n' +
          'export async function getDictionary(locale: string): Promise<Messages> {\n' +
          '  return dictionaries[locale]();\n' +
          '}',
        description:
          "미들웨어가 Accept-Language 헤더로 locale을 감지하고, locale이 없는 URL을 자동 리다이렉트합니다. 번역 파일은 JSON으로 관리하고 동적 import로 필요한 언어만 로드합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: [locale] 기반 다국어 페이지 구현",
      content:
        "`[locale]` 동적 세그먼트를 활용하여 다국어 레이아웃과 페이지를 구현합니다. " +
        "`generateStaticParams`로 모든 locale에 대해 정적 페이지를 생성하고, " +
        "언어 전환 UI도 함께 만들어봅니다.",
      code: {
        language: "typescript",
        code:
          '// === app/[locale]/layout.tsx ===\n' +
          'import { getDictionary } from "@/lib/i18n";\n\n' +
          'const locales = ["ko", "en", "ja"];\n\n' +
          'export function generateStaticParams() {\n' +
          '  return locales.map((locale) => ({ locale }));\n' +
          '}\n\n' +
          'interface LocaleLayoutProps {\n' +
          '  children: React.ReactNode;\n' +
          '  params: Promise<{ locale: string }>;\n' +
          '}\n\n' +
          'export default async function LocaleLayout({\n' +
          '  children,\n' +
          '  params,\n' +
          '}: LocaleLayoutProps) {\n' +
          '  const { locale } = await params;\n\n' +
          '  return (\n' +
          '    <html lang={locale}>\n' +
          '      <body>\n' +
          '        <header>\n' +
          '          <nav>\n' +
          '            {/* 언어 전환 링크 */}\n' +
          '            {locales.map((l) => (\n' +
          '              <a\n' +
          '                key={l}\n' +
          '                href={`/${l}`}\n' +
          '                style={{ fontWeight: l === locale ? "bold" : "normal" }}\n' +
          '              >\n' +
          '                {l.toUpperCase()}\n' +
          '              </a>\n' +
          '            ))}\n' +
          '          </nav>\n' +
          '        </header>\n' +
          '        {children}\n' +
          '      </body>\n' +
          '    </html>\n' +
          '  );\n' +
          '}\n\n' +
          '// === app/[locale]/page.tsx ===\n' +
          'import { getDictionary } from "@/lib/i18n";\n\n' +
          'interface HomePageProps {\n' +
          '  params: Promise<{ locale: string }>;\n' +
          '}\n\n' +
          'export default async function HomePage({ params }: HomePageProps) {\n' +
          '  const { locale } = await params;\n' +
          '  const dict = await getDictionary(locale);\n\n' +
          '  return (\n' +
          '    <main>\n' +
          '      <h1>{dict.home.title}</h1>\n' +
          '      <p>{dict.home.description}</p>\n' +
          '    </main>\n' +
          '  );\n' +
          '}\n\n' +
          '// === app/[locale]/about/page.tsx ===\n' +
          'import { getDictionary } from "@/lib/i18n";\n\n' +
          'interface AboutPageProps {\n' +
          '  params: Promise<{ locale: string }>;\n' +
          '}\n\n' +
          'export default async function AboutPage({ params }: AboutPageProps) {\n' +
          '  const { locale } = await params;\n' +
          '  const dict = await getDictionary(locale);\n\n' +
          '  return (\n' +
          '    <main>\n' +
          '      <h1>{dict.about.title}</h1>\n' +
          '      <p>{dict.about.description}</p>\n' +
          '    </main>\n' +
          '  );\n' +
          '}',
        description:
          "[locale] 동적 세그먼트로 모든 페이지가 locale을 params로 받고, getDictionary로 해당 언어의 번역을 로드합니다. generateStaticParams로 빌드 시 모든 locale의 HTML이 생성됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| 서브경로 방식 | `/ko/about`, `/en/about` — 가장 일반적인 i18n URL 전략 |\n" +
        "| 도메인 방식 | `ko.example.com` — DNS 설정 필요, 브랜딩에 유리 |\n" +
        "| 미들웨어 locale 감지 | Accept-Language 헤더로 선호 언어 자동 감지 및 리다이렉트 |\n" +
        "| [locale] 세그먼트 | 동적 라우트로 모든 페이지에 locale 적용 |\n" +
        "| 번역 파일 (JSON) | `messages/ko.json` 형태로 언어별 텍스트 관리 |\n" +
        "| next-intl | 타입 안전 번역, 복수형, 날짜 포맷 등 고급 기능 제공 |\n" +
        "| generateStaticParams | locale별 정적 HTML 생성으로 SEO 최적화 |\n\n" +
        "**핵심:** Next.js의 i18n은 미들웨어에서 locale을 감지하고 `[locale]` 동적 세그먼트로 라우팅합니다. " +
        "번역 관리는 JSON 파일이나 next-intl 같은 라이브러리로 처리합니다.\n\n" +
        "**다음 챕터 미리보기:** 다국어 페이지의 기본 구조를 만들었으니, " +
        "이제 CSS Modules, Tailwind CSS 등 다양한 스타일링 전략과 Server Components에서의 스타일링 제약을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Next.js의 i18n은 미들웨어에서 locale을 감지하고 [locale] 동적 세그먼트로 라우팅한다. 번역 관리는 JSON 파일이나 next-intl 같은 라이브러리로 처리한다.",
  checklist: [
    "서브경로 방식과 도메인 방식의 차이를 설명할 수 있다",
    "미들웨어에서 Accept-Language 헤더로 locale을 감지하는 로직을 구현할 수 있다",
    "[locale] 동적 세그먼트를 활용한 다국어 라우팅 구조를 설계할 수 있다",
    "JSON 번역 파일을 관리하고 컴포넌트에서 번역 텍스트를 로드할 수 있다",
    "generateStaticParams로 locale별 정적 페이지를 생성할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Next.js App Router에서 가장 일반적인 i18n URL 전략은?",
      choices: [
        "서브경로 방식 (/ko/about, /en/about)",
        "쿼리 파라미터 방식 (?lang=ko)",
        "쿠키 기반 방식",
        "해시 방식 (#ko)",
      ],
      correctIndex: 0,
      explanation:
        "서브경로 방식은 URL에 locale이 명시되어 SEO에 유리하고, 설정이 간단하여 가장 널리 사용됩니다. 검색엔진이 각 언어 페이지를 별도로 인덱싱할 수 있습니다.",
    },
    {
      id: "q2",
      question:
        "미들웨어에서 사용자의 선호 언어를 감지할 때 주로 사용하는 HTTP 헤더는?",
      choices: [
        "Content-Type",
        "Accept-Language",
        "X-Locale",
        "User-Agent",
      ],
      correctIndex: 1,
      explanation:
        "Accept-Language 헤더는 브라우저가 자동으로 전송하며, 사용자의 언어 선호도를 우선순위와 함께 포함합니다.",
    },
    {
      id: "q3",
      question:
        "app/[locale]/about/page.tsx에서 현재 locale 값을 얻는 방법은?",
      choices: [
        "useRouter() 훅으로 가져온다",
        "props의 params에서 locale을 받는다",
        "document.cookie에서 읽는다",
        "환경변수 NEXT_PUBLIC_LOCALE을 사용한다",
      ],
      correctIndex: 1,
      explanation:
        "[locale] 동적 세그먼트이므로 페이지 컴포넌트의 params prop에서 locale 값을 받을 수 있습니다. 서버 컴포넌트에서는 await params로 접근합니다.",
    },
    {
      id: "q4",
      question: "generateStaticParams에서 locale 배열을 반환하는 이유는?",
      choices: [
        "런타임에 locale을 동적으로 결정하기 위해",
        "빌드 시 각 locale별 정적 HTML을 미리 생성하기 위해",
        "미들웨어에서 사용할 locale 목록을 등록하기 위해",
        "번역 파일을 자동으로 로드하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "generateStaticParams는 빌드 시점에 호출되어 반환된 각 locale에 대해 정적 HTML을 생성합니다. 이를 통해 모든 언어 페이지가 CDN에서 빠르게 제공됩니다.",
    },
    {
      id: "q5",
      question: "next-intl 같은 i18n 라이브러리가 순수 JSON 방식 대비 제공하는 장점이 아닌 것은?",
      choices: [
        "복수형(pluralization) 처리",
        "날짜/숫자 포맷 로컬라이제이션",
        "번역 키 타입 안전성",
        "자동 번역(AI 기반 번역 생성)",
      ],
      correctIndex: 3,
      explanation:
        "next-intl은 복수형, 날짜 포맷, 타입 안전성 등 고급 i18n 기능을 제공하지만, AI 기반 자동 번역 기능은 포함되어 있지 않습니다. 번역 텍스트는 개발자가 직접 작성해야 합니다.",
    },
  ],
};

export default chapter;
