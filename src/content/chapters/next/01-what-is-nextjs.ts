import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "01-what-is-nextjs",
  subject: "next",
  title: "Next.js란 무엇인가",
  description:
    "React와 Next.js의 관계, 프레임워크 vs 라이브러리, SSR/SSG 개념, App Router 소개, Vercel 생태계를 학습합니다.",
  order: 1,
  group: "기초",
  prerequisites: [],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "React는 **엔진**이고, Next.js는 **완성된 자동차**입니다.\n\n" +
        "엔진(React)만 있으면 자동차를 만들 수 있지만, 차체, 변속기, 핸들, 에어컨을 직접 조립해야 합니다. " +
        "라우팅은 React Router를 설치하고, 서버 렌더링은 Express를 구성하고, 빌드 최적화는 Webpack을 설정해야 합니다.\n\n" +
        "Next.js는 이 모든 것이 **이미 조립된 자동차**입니다. 엔진(React)은 동일하지만, 라우팅(핸들), 서버 렌더링(변속기), " +
        "이미지 최적화(에어컨), API Routes(트렁크)가 기본 장착되어 있습니다. 운전자(개발자)는 어디로 갈지(비즈니스 로직)에만 집중하면 됩니다.\n\n" +
        "또한 Next.js는 **주방장이 있는 레스토랑**과도 같습니다. React만으로는 모든 음식을 손님(브라우저) 테이블에서 조리(클라이언트 렌더링)해야 합니다. " +
        "Next.js는 주방(서버)에서 미리 음식을 준비(SSR/SSG)해서 완성된 요리를 손님에게 가져다주는 것입니다. " +
        "손님은 빈 접시를 받고 기다릴 필요 없이, 바로 먹을 수 있는 음식을 받습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React는 훌륭한 UI 라이브러리이지만, **프로덕션 앱을 만들기 위해 직접 해결해야 할 문제가 많습니다.**\n\n" +
        "### 1. 라우팅이 없다\n" +
        "React 자체에는 페이지 간 이동 기능이 없습니다. React Router를 설치하고, 라우트를 정의하고, 코드 스플리팅을 수동으로 설정해야 합니다.\n\n" +
        "### 2. 서버 렌더링이 없다\n" +
        "기본 React 앱(CRA)은 빈 HTML을 보내고 JavaScript가 모두 로드된 후에야 화면이 보입니다. 이는 **초기 로딩 속도**와 **SEO**에 치명적입니다. " +
        "검색엔진 크롤러는 빈 HTML을 보고 '내용 없음'으로 판단할 수 있습니다.\n\n" +
        "### 3. 데이터 페칭 패턴이 정해져 있지 않다\n" +
        "서버에서 데이터를 가져오는 표준 방법이 없어서, 각 프로젝트마다 다른 방식(SWR, React Query, fetch + useEffect)으로 구현합니다.\n\n" +
        "### 4. 빌드/배포 설정이 복잡하다\n" +
        "Webpack, Babel, 환경변수, 이미지 최적화, 폰트 로딩 등을 직접 설정해야 합니다. 새 프로젝트를 시작할 때마다 보일러플레이트가 반복됩니다.\n\n" +
        "### 5. 풀스택 기능 부재\n" +
        "API 엔드포인트를 만들려면 별도의 서버(Express, Fastify 등)를 구축해야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js는 React 위에서 이 모든 문제를 **하나의 통합된 규약**으로 해결합니다.\n\n" +
        "### 1. 파일 기반 라우팅\n" +
        "`app/` 디렉토리에 폴더와 `page.tsx` 파일을 만들면 자동으로 라우트가 됩니다. 별도의 라우팅 라이브러리 설치나 설정이 필요 없습니다.\n\n" +
        "### 2. 서버 렌더링 내장 (SSR, SSG, ISR)\n" +
        "- **SSR (Server-Side Rendering)**: 매 요청마다 서버에서 HTML을 생성합니다\n" +
        "- **SSG (Static Site Generation)**: 빌드 시점에 HTML을 미리 생성합니다\n" +
        "- **ISR (Incremental Static Regeneration)**: 정적 페이지를 일정 주기로 재생성합니다\n\n" +
        "### 3. React Server Components (RSC)\n" +
        "App Router에서는 컴포넌트가 기본적으로 **서버 컴포넌트**입니다. 서버에서 직접 데이터를 가져오고, 렌더링 결과만 클라이언트로 보냅니다. " +
        "JavaScript 번들 크기가 줄어들고, 데이터베이스에 직접 접근할 수도 있습니다.\n\n" +
        "### 4. API Routes / Route Handlers\n" +
        "`app/api/` 디렉토리에 `route.ts` 파일을 만들면 API 엔드포인트가 됩니다. 별도 서버 없이 풀스택 앱을 만들 수 있습니다.\n\n" +
        "### 5. 기본 내장 최적화\n" +
        "이미지(`next/image`), 폰트(`next/font`), 스크립트(`next/script`) 최적화가 기본 제공됩니다. Vercel에 배포하면 글로벌 CDN, 서버리스 함수, Edge Runtime까지 자동 설정됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: React 앱 vs Next.js 앱 비교",
      content:
        "같은 블로그 앱의 진입점을 순수 React(CRA)와 Next.js로 비교합니다. " +
        "React에서는 라우팅과 데이터 페칭을 수동으로 구성해야 하지만, Next.js에서는 파일 구조와 서버 컴포넌트로 자연스럽게 해결됩니다.",
      code: {
        language: "typescript",
        code:
          '// === 순수 React (CRA) 방식 ===\n' +
          '// 라우팅: react-router-dom 설치 필요\n' +
          '// 데이터: useEffect + fetch 조합\n' +
          '// SEO: 빈 HTML → 클라이언트에서 렌더링\n\n' +
          'import { BrowserRouter, Routes, Route } from "react-router-dom";\n\n' +
          'function App() {\n' +
          '  return (\n' +
          '    <BrowserRouter>\n' +
          '      <Routes>\n' +
          '        <Route path="/" element={<Home />} />\n' +
          '        <Route path="/blog/:id" element={<BlogPost />} />\n' +
          '      </Routes>\n' +
          '    </BrowserRouter>\n' +
          '  );\n' +
          '}\n\n' +
          'function BlogPost() {\n' +
          '  const [post, setPost] = useState(null);\n' +
          '  const { id } = useParams();\n\n' +
          '  useEffect(() => {\n' +
          '    fetch(`/api/posts/${id}`)\n' +
          '      .then(res => res.json())\n' +
          '      .then(setPost);\n' +
          '  }, [id]);\n\n' +
          '  if (!post) return <div>로딩중...</div>;\n' +
          '  return <article>{post.title}</article>;\n' +
          '}\n\n' +
          '// === Next.js App Router 방식 ===\n' +
          '// 파일: app/blog/[id]/page.tsx\n' +
          '// 라우팅: 파일 시스템이 곧 라우트\n' +
          '// 데이터: 서버에서 직접 fetch (useEffect 불필요)\n' +
          '// SEO: 서버에서 HTML 완성 후 전송\n\n' +
          'interface BlogPostProps {\n' +
          '  params: Promise<{ id: string }>;\n' +
          '}\n\n' +
          'export default async function BlogPost({ params }: BlogPostProps) {\n' +
          '  const { id } = await params;\n' +
          '  // 서버에서 직접 데이터 페칭 — useState, useEffect 불필요\n' +
          '  const post = await fetch(`https://api.example.com/posts/${id}`)\n' +
          '    .then(res => res.json());\n\n' +
          '  return <article>{post.title}</article>;\n' +
          '}',
        description:
          "React에서는 라우팅 라이브러리, 상태관리, useEffect가 필요하지만, Next.js에서는 파일 구조와 async 서버 컴포넌트로 동일한 결과를 더 간결하게 달성합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 첫 Next.js 페이지 만들기",
      content:
        "Next.js App Router에서 간단한 홈페이지와 소개 페이지를 만들어봅니다. " +
        "폴더 구조가 어떻게 URL과 매핑되는지 확인하고, 서버 컴포넌트에서 데이터를 가져오는 기본 패턴을 체험합니다.",
      code: {
        language: "typescript",
        code:
          '// 프로젝트 구조:\n' +
          '// app/\n' +
          '//   layout.tsx    ← 모든 페이지 공통 레이아웃\n' +
          '//   page.tsx      ← "/" 경로\n' +
          '//   about/\n' +
          '//     page.tsx    ← "/about" 경로\n\n' +
          '// === app/layout.tsx ===\n' +
          'export default function RootLayout({\n' +
          '  children,\n' +
          '}: {\n' +
          '  children: React.ReactNode;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <html lang="ko">\n' +
          '      <body>\n' +
          '        <nav>\n' +
          '          <a href="/">홈</a>\n' +
          '          <a href="/about">소개</a>\n' +
          '        </nav>\n' +
          '        <main>{children}</main>\n' +
          '      </body>\n' +
          '    </html>\n' +
          '  );\n' +
          '}\n\n' +
          '// === app/page.tsx ===\n' +
          'export default function HomePage() {\n' +
          '  // 서버 컴포넌트 — 브라우저에 JavaScript가 전송되지 않음\n' +
          '  const currentYear = new Date().getFullYear();\n\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <h1>Next.js 블로그에 오신 것을 환영합니다</h1>\n' +
          '      <p>{currentYear}년, 풀스택 React의 시대입니다.</p>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// === app/about/page.tsx ===\n' +
          '// 서버에서 데이터를 가져오는 예제\n' +
          'async function getTeamMembers() {\n' +
          '  const res = await fetch("https://api.example.com/team");\n' +
          '  return res.json();\n' +
          '}\n\n' +
          'export default async function AboutPage() {\n' +
          '  const members = await getTeamMembers();\n\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <h1>팀 소개</h1>\n' +
          '      <ul>\n' +
          '        {members.map((m: { id: number; name: string }) => (\n' +
          '          <li key={m.id}>{m.name}</li>\n' +
          '        ))}\n' +
          '      </ul>\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "app/ 디렉토리의 폴더 구조가 URL 경로가 되며, 서버 컴포넌트에서 async/await로 직접 데이터를 가져올 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| React vs Next.js | React는 UI 라이브러리, Next.js는 React 기반 풀스택 프레임워크 |\n" +
        "| SSR | 매 요청마다 서버에서 HTML 생성 — 항상 최신 데이터 |\n" +
        "| SSG | 빌드 시 HTML 미리 생성 — 가장 빠른 응답 |\n" +
        "| ISR | 정적 페이지를 주기적으로 재생성 — SSG + 실시간성 |\n" +
        "| App Router | Next.js 13+ 권장 라우팅 방식, React Server Components 기반 |\n" +
        "| 서버 컴포넌트 | 서버에서 렌더링, JS 번들에 포함되지 않음 |\n" +
        "| Vercel | Next.js 개발사, 최적화된 배포 플랫폼 제공 |\n\n" +
        "**핵심:** Next.js는 React에 라우팅, 서버 렌더링, 데이터 페칭, 최적화를 통합 제공하여, " +
        "React만으로는 직접 구성해야 했던 인프라를 하나의 프레임워크로 해결합니다.\n\n" +
        "**다음 챕터 미리보기:** `create-next-app`으로 실제 프로젝트를 생성하고, " +
        "app/ 디렉토리의 폴더 구조와 각 설정 파일의 역할을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Next.js는 React의 '프레임워크' — 라우팅, 서버 렌더링, 데이터 페칭, 최적화를 통합 제공하여 React만으로는 직접 구성해야 했던 것들을 하나의 규약으로 해결한다.",
  checklist: [
    "React(라이브러리)와 Next.js(프레임워크)의 차이를 설명할 수 있다",
    "SSR, SSG, ISR의 차이점과 각각의 사용 시점을 이해한다",
    "App Router가 Pages Router 대비 어떤 장점이 있는지 설명할 수 있다",
    "서버 컴포넌트의 기본 개념과 장점을 설명할 수 있다",
    "Next.js가 기본 제공하는 기능(라우팅, 이미지 최적화, API Routes 등)을 나열할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "React와 Next.js의 관계를 가장 정확하게 설명한 것은?",
      choices: [
        "Next.js는 React를 대체하는 별도의 프레임워크이다",
        "Next.js는 React 위에 구축된 풀스택 프레임워크이다",
        "React는 Next.js의 플러그인이다",
        "Next.js는 React의 상태관리 라이브러리이다",
      ],
      correctIndex: 1,
      explanation:
        "Next.js는 React를 UI 렌더링 엔진으로 사용하면서, 라우팅, 서버 렌더링, 데이터 페칭, 최적화 등을 추가로 제공하는 풀스택 프레임워크입니다.",
    },
    {
      id: "q2",
      question:
        "SSG(Static Site Generation)의 특징으로 올바른 것은?",
      choices: [
        "매 요청마다 서버에서 HTML을 새로 생성한다",
        "빌드 시점에 HTML을 미리 생성하여 CDN에서 제공한다",
        "클라이언트에서 JavaScript로 HTML을 생성한다",
        "데이터베이스에서 실시간으로 HTML을 스트리밍한다",
      ],
      correctIndex: 1,
      explanation:
        "SSG는 빌드 시점에 HTML을 미리 생성합니다. 이미 완성된 HTML을 CDN에서 바로 제공하므로 응답 속도가 가장 빠릅니다.",
    },
    {
      id: "q3",
      question:
        "Next.js App Router에서 컴포넌트의 기본 동작 방식은?",
      choices: [
        "클라이언트 컴포넌트로 동작한다",
        "서버 컴포넌트로 동작한다",
        "하이브리드 컴포넌트로 동작한다",
        "정적 컴포넌트로 동작한다",
      ],
      correctIndex: 1,
      explanation:
        "App Router에서 모든 컴포넌트는 기본적으로 서버 컴포넌트입니다. 클라이언트 컴포넌트를 사용하려면 파일 상단에 'use client' 지시어를 명시해야 합니다.",
    },
    {
      id: "q4",
      question:
        "Next.js가 기본 제공하지 않는 기능은?",
      choices: [
        "파일 기반 라우팅",
        "이미지 최적화",
        "전역 상태관리 라이브러리",
        "API Routes (Route Handlers)",
      ],
      correctIndex: 2,
      explanation:
        "Next.js는 라우팅, 이미지 최적화, API Routes를 기본 제공하지만, 전역 상태관리(Redux, Zustand 등)는 별도 라이브러리를 사용해야 합니다.",
    },
    {
      id: "q5",
      question:
        "Next.js에서 서버 컴포넌트의 장점이 아닌 것은?",
      choices: [
        "JavaScript 번들 크기가 줄어든다",
        "서버에서 직접 데이터베이스에 접근할 수 있다",
        "onClick 같은 이벤트 핸들러를 직접 사용할 수 있다",
        "민감한 로직(API 키 등)이 클라이언트에 노출되지 않는다",
      ],
      correctIndex: 2,
      explanation:
        "서버 컴포넌트는 서버에서만 실행되므로 onClick, onChange 같은 브라우저 이벤트 핸들러를 사용할 수 없습니다. 이벤트 핸들러가 필요하면 'use client' 지시어를 사용한 클라이언트 컴포넌트에서 처리해야 합니다.",
    },
  ],
};

export default chapter;
