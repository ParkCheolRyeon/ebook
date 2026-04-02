import type { FinalExam } from "@/types/quiz";

const finalExam: FinalExam = {
  type: "final",
  id: "final-exam",
  title: "Next.js 최종 시험",
  questions: [
    // === 기초 ===
    {
      id: "final-q1",
      question:
        "다음 중 Next.js App Router에서 not-found.tsx가 자동으로 트리거되지 않는 상황은?",
      choices: [
        "존재하지 않는 URL에 접근했을 때",
        "동적 라우트에서 notFound() 함수를 호출했을 때",
        "Server Action 내부에서 데이터가 없을 때 notFound()를 호출한 경우",
        "layout.tsx에서 조건부로 에러를 throw한 경우",
      ],
      correctIndex: 3,
      explanation:
        "not-found.tsx는 notFound() 함수 호출이나 매칭되지 않는 URL에 의해 트리거됩니다. layout에서 throw한 에러는 error.tsx(상위 세그먼트)에서 처리되며, not-found와는 다른 메커니즘입니다.",
    },
    {
      id: "final-q2",
      question:
        "Next.js에서 같은 레벨에 layout.tsx와 template.tsx가 모두 존재하면 렌더링 순서는?",
      choices: [
        "template이 layout을 대체한다",
        "layout이 template을 감싸고, template이 page를 감싼다",
        "template이 layout을 감싼다",
        "빌드 에러가 발생한다",
      ],
      correctIndex: 1,
      explanation:
        "layout은 가장 바깥을 감싸고, 그 안에 template, 그리고 template 안에 page가 렌더링됩니다. layout은 상태를 유지하고, template은 매 네비게이션마다 새 인스턴스를 생성합니다.",
    },
    // === 서버와 클라이언트 ===
    {
      id: "final-q3",
      question:
        "Server Component에서 날짜를 포맷팅하여 렌더링했는데, 클라이언트에서 hydration mismatch 경고가 발생했다. 가장 적절한 해결 방법은?",
      choices: [
        "해당 컴포넌트를 Client Component로 변환한다",
        "suppressHydrationWarning을 추가하거나, 서버/클라이언트의 타임존을 일치시킨다",
        "날짜 렌더링을 제거한다",
        "useEffect에서 날짜를 설정한다",
      ],
      correctIndex: 1,
      explanation:
        "서버와 클라이언트의 타임존 차이로 날짜 포맷이 달라질 수 있습니다. suppressHydrationWarning으로 경고를 억제하거나, UTC 등 동일한 타임존을 사용하여 일치시키는 것이 적절합니다.",
    },
    {
      id: "final-q4",
      question:
        "다음 코드에서 문제점은?\n\n// app/dashboard/page.tsx (Server Component)\nimport { useState } from 'react';\n\nexport default function Dashboard() {\n  const [tab, setTab] = useState('overview');\n  return <div>{tab}</div>;\n}",
      choices: [
        "Dashboard라는 이름이 잘못되었다",
        "Server Component에서 useState를 사용할 수 없다. 'use client' 지시어를 추가하거나, 상태가 필요한 부분만 Client Component로 분리해야 한다",
        "useState의 초기값이 잘못되었다",
        "return문이 잘못되었다",
      ],
      correctIndex: 1,
      explanation:
        "App Router에서 파일은 기본적으로 Server Component이므로 useState를 사용할 수 없습니다. 탭 전환 UI만 별도 Client Component로 분리하면, 나머지 데이터 페칭 등은 서버에서 처리할 수 있습니다.",
    },
    // === 데이터 페칭과 캐싱 ===
    {
      id: "final-q5",
      question:
        "전자상거래 사이트에서 상품 목록은 1시간마다 갱신되고, 장바구니는 실시간이어야 한다. 가장 적절한 데이터 전략 조합은?",
      choices: [
        "모든 페이지를 SSR로 렌더링한다",
        "상품 목록은 ISR(revalidate: 3600), 장바구니는 클라이언트 사이드 페칭 또는 Server Action으로 실시간 처리한다",
        "모든 데이터를 정적으로 생성한다",
        "모든 데이터를 클라이언트에서 페칭한다",
      ],
      correctIndex: 1,
      explanation:
        "ISR로 상품 목록을 주기적으로 갱신하면 캐시된 빠른 응답을 제공하면서도 데이터를 신선하게 유지합니다. 장바구니는 사용자별 실시간 데이터이므로 클라이언트 페칭이나 Server Action이 적합합니다.",
    },
    {
      id: "final-q6",
      question:
        "fetch 요청에 { next: { tags: ['products'] } }를 설정하고, Server Action에서 revalidateTag('products')를 호출하면 어떤 일이 발생하는가?",
      choices: [
        "해당 태그를 가진 fetch 캐시 엔트리만 무효화되고, 다음 요청 시 새 데이터를 가져온다",
        "모든 캐시가 초기화된다",
        "해당 페이지만 재빌드된다",
        "클라이언트의 브라우저 캐시가 초기화된다",
      ],
      correctIndex: 0,
      explanation:
        "revalidateTag는 해당 태그가 지정된 모든 fetch 캐시 엔트리를 무효화합니다. 다음 요청 시 캐시 미스가 발생하여 새 데이터를 가져옵니다. 다른 태그의 캐시에는 영향을 주지 않습니다.",
    },
    // === 라우팅 심화 ===
    {
      id: "final-q7",
      question:
        "소셜 미디어 앱에서 피드의 사진을 클릭하면 모달로 보여주고, URL을 직접 입력하면 전체 페이지로 보여주고 싶다. 어떤 라우팅 패턴을 조합해야 하는가?",
      choices: [
        "Dynamic Routes만 사용한다",
        "Parallel Routes(@modal 슬롯)와 Intercepting Routes를 조합하여 소프트 네비게이션은 모달로, 하드 네비게이션은 전체 페이지로 처리한다",
        "useRouter의 push와 replace를 사용한다",
        "Route Groups로 두 개의 레이아웃을 만든다",
      ],
      correctIndex: 1,
      explanation:
        "Parallel Routes로 모달 슬롯을 만들고, Intercepting Routes로 소프트 네비게이션 시 해당 슬롯에서 모달을 표시합니다. URL을 직접 방문하면 인터셉트 없이 원래 페이지가 전체로 렌더링됩니다.",
    },
    {
      id: "final-q8",
      question:
        "미들웨어에서 무거운 데이터베이스 쿼리를 수행하면 안 되는 이유는?",
      choices: [
        "미들웨어에서 데이터베이스 접근이 불가능하다",
        "미들웨어는 모든 요청에 실행되며 Edge 런타임에서 동작하므로, 무거운 작업은 응답 지연을 유발하고 Edge 런타임 제약에 걸릴 수 있다",
        "미들웨어는 캐싱을 지원하지 않는다",
        "보안 문제가 발생한다",
      ],
      correctIndex: 1,
      explanation:
        "미들웨어는 모든 매칭 요청마다 실행되며, Edge 런타임은 실행 시간과 사용 가능한 API에 제약이 있습니다. 토큰 검증 등 가벼운 작업만 수행하고, 무거운 로직은 서버 측 코드에 위임해야 합니다.",
    },
    // === 스타일링과 최적화 ===
    {
      id: "final-q9",
      question:
        "LCP(Largest Contentful Paint)를 최적화하기 위해 next/image에서 반드시 설정해야 하는 속성은?",
      choices: [
        "loading='lazy'",
        "히어로 이미지에 priority 속성을 설정하여 프리로드한다",
        "quality를 100으로 설정한다",
        "placeholder를 'empty'로 설정한다",
      ],
      correctIndex: 1,
      explanation:
        "priority 속성은 해당 이미지를 프리로드하고 지연 로딩을 비활성화합니다. 페이지의 LCP 요소가 되는 히어로 이미지에는 반드시 priority를 설정하여 로딩 우선순위를 높여야 합니다.",
    },
    {
      id: "final-q10",
      question:
        "Next.js에서 styled-components 같은 CSS-in-JS 라이브러리를 Server Component와 함께 사용할 때 발생하는 문제는?",
      choices: [
        "CSS가 적용되지 않는다",
        "CSS-in-JS는 런타임 JavaScript가 필요하여 Server Component에서 직접 사용할 수 없고, 별도의 SSR 설정(StyleRegistry)이 필요하다",
        "빌드가 실패한다",
        "성능 차이가 없다",
      ],
      correctIndex: 1,
      explanation:
        "CSS-in-JS 라이브러리는 런타임에 스타일을 생성하므로 Server Component에서 직접 사용할 수 없습니다. App Router에서는 StyleRegistry를 설정하여 서버에서 스타일을 수집하거나, CSS Modules/Tailwind 같은 제로 런타임 솔루션을 사용하는 것이 권장됩니다.",
    },
    // === 인증과 보안 ===
    {
      id: "final-q11",
      question:
        "CSRF(Cross-Site Request Forgery) 공격에 대해 Server Action이 기본적으로 제공하는 보호 메커니즘은?",
      choices: [
        "자동 JWT 검증",
        "Server Action은 기본적으로 CSRF 토큰 없이도 Same-Origin 정책과 POST 메서드로 기본 보호를 제공하며, Next.js가 Origin 헤더를 검증한다",
        "모든 요청을 HTTPS로 강제한다",
        "사용자 인증을 자동으로 확인한다",
      ],
      correctIndex: 1,
      explanation:
        "Next.js의 Server Action은 POST 요청만 허용하고, Origin 헤더를 검증하여 다른 출처의 요청을 차단합니다. 추가적인 보안이 필요하면 CSRF 토큰을 직접 구현할 수 있습니다.",
    },
    {
      id: "final-q12",
      question:
        "인증 로직을 미들웨어에만 두었을 때의 한계와 이를 보완하는 방법은?",
      choices: [
        "미들웨어만으로 충분하다",
        "미들웨어는 라우트 접근만 제어하며 세밀한 권한 관리가 어렵다. Server Component에서 세션을 확인하고, Server Action에서 인가 로직을 추가하여 다층 보안을 구축해야 한다",
        "레이아웃에서만 인증하면 된다",
        "클라이언트에서 토큰을 검증한다",
      ],
      correctIndex: 1,
      explanation:
        "미들웨어는 빠른 접근 제어에 좋지만, 비즈니스 로직 수준의 권한(예: 게시글 소유자만 수정)은 처리하기 어렵습니다. 미들웨어(라우트 보호) + Server Component(UI 분기) + Server Action(인가 검증)의 다층 접근이 필요합니다.",
    },
    // === API와 백엔드 ===
    {
      id: "final-q13",
      question:
        "외부 API 연동 시 Server Component에서 직접 fetch하는 것과 Route Handler를 통해 fetch하는 것의 트레이드오프는?",
      choices: [
        "항상 Route Handler를 사용해야 한다",
        "Server Component에서 직접 fetch하면 중간 계층 없이 빠르지만, 클라이언트에서도 같은 데이터가 필요하면 Route Handler로 API를 노출하는 것이 재사용성이 높다",
        "Server Component에서는 fetch가 불가능하다",
        "Route Handler가 항상 더 빠르다",
      ],
      correctIndex: 1,
      explanation:
        "Server Component에서 직접 fetch하면 불필요한 네트워크 홉을 줄일 수 있습니다. 하지만 모바일 앱이나 클라이언트 JavaScript에서도 같은 데이터를 사용해야 한다면, Route Handler로 API를 만들어 여러 클라이언트에서 재사용하는 것이 적합합니다.",
    },
    {
      id: "final-q14",
      question:
        "Route Handler에서 POST 요청의 body를 처리할 때 보안상 반드시 해야 하는 것은?",
      choices: [
        "body를 그대로 데이터베이스에 저장한다",
        "입력값 검증(validation)과 스키마 검사(예: Zod)를 수행하고, 인증된 사용자인지 확인한다",
        "Content-Type 헤더만 확인한다",
        "try-catch로 감싸기만 하면 된다",
      ],
      correctIndex: 1,
      explanation:
        "Route Handler는 공개 엔드포인트이므로 어떤 데이터든 전송될 수 있습니다. Zod 등으로 스키마를 검증하고, 세션/토큰으로 인증을 확인하며, SQL 인젝션 등을 방지해야 합니다.",
    },
    // === 테스팅과 배포 ===
    {
      id: "final-q15",
      question:
        "Next.js 프로젝트에서 Server Component를 단위 테스트할 때의 특수한 고려사항은?",
      choices: [
        "일반 React 컴포넌트와 동일하게 테스트한다",
        "Server Component는 async 함수일 수 있으므로, 테스트 프레임워크에서 async 컴포넌트 렌더링을 지원해야 하고, 서버 전용 모듈을 적절히 모킹해야 한다",
        "Server Component는 테스트할 수 없다",
        "E2E 테스트만 가능하다",
      ],
      correctIndex: 1,
      explanation:
        "Server Component는 async 함수이고 서버 전용 API(headers, cookies, DB 클라이언트 등)를 사용합니다. 이를 모킹하고 async 렌더링을 처리할 수 있는 테스트 환경을 구성해야 합니다.",
    },
    {
      id: "final-q16",
      question:
        "next build 시 출력되는 라우트별 아이콘(○, ●, λ)의 의미는?",
      choices: [
        "파일 크기를 나타낸다",
        "○는 정적(Static), ●는 SSG(Prerendered), λ는 서버 사이드(Dynamic) 렌더링을 의미하며, 각 라우트의 렌더링 전략을 보여준다",
        "에러 수준을 나타낸다",
        "캐싱 상태를 나타낸다",
      ],
      correctIndex: 1,
      explanation:
        "빌드 출력에서 ○는 자동으로 정적 HTML이 된 페이지, ●는 generateStaticParams 등으로 프리렌더링된 페이지, λ는 요청 시마다 서버에서 렌더링되는 동적 페이지를 나타냅니다.",
    },
    // === Pages Router ===
    {
      id: "final-q17",
      question:
        "Pages Router의 _app.tsx와 App Router의 root layout.tsx의 차이는?",
      choices: [
        "기능이 완전히 동일하다",
        "_app.tsx는 클라이언트 컴포넌트이고 모든 페이지를 감싸며, root layout은 Server Component가 기본이고 <html>, <body> 태그를 포함해야 한다",
        "root layout은 선택사항이다",
        "_app.tsx가 더 유연하다",
      ],
      correctIndex: 1,
      explanation:
        "_app.tsx는 클라이언트에서 실행되며 공통 레이아웃과 전역 상태를 관리합니다. root layout.tsx는 Server Component가 기본이며, <html>과 <body> 태그를 직접 포함해야 하고, 중첩 레이아웃이 가능합니다.",
    },
    {
      id: "final-q18",
      question:
        "Pages Router의 getStaticPaths에서 fallback: 'blocking'과 App Router의 dynamicParams의 관계는?",
      choices: [
        "관련이 없다",
        "fallback: 'blocking'의 동작이 App Router에서는 dynamicParams: true(기본값)로 대체되어, generateStaticParams에 없는 경로도 요청 시 서버에서 생성된다",
        "App Router에서는 이 기능이 삭제되었다",
        "fallback: false만 지원된다",
      ],
      correctIndex: 1,
      explanation:
        "Pages Router의 fallback: 'blocking'은 미리 생성되지 않은 경로를 요청 시 서버에서 생성하는 기능입니다. App Router에서는 dynamicParams가 기본 true로 같은 동작을 제공합니다.",
    },
    // === 아키텍처 ===
    {
      id: "final-q19",
      question:
        "대규모 Next.js 앱에서 공통 UI 컴포넌트, 유틸리티, 타입을 체계적으로 관리하기 위한 아키텍처 패턴은?",
      choices: [
        "모든 것을 app/ 폴더에 넣는다",
        "도메인별로 분리하되, 공유 컴포넌트는 packages/ui, 공유 유틸은 packages/lib으로 모노레포 패키지화하고, Feature-Sliced Design 등의 구조를 적용한다",
        "node_modules에 직접 추가한다",
        "글로벌 변수로 공유한다",
      ],
      correctIndex: 1,
      explanation:
        "모노레포에서 공유 코드를 별도 패키지로 분리하면 여러 앱에서 재사용하고, 독립적으로 버전 관리할 수 있습니다. Feature-Sliced Design은 기능 단위로 코드를 구성하여 확장성을 확보합니다.",
    },
    {
      id: "final-q20",
      question:
        "Next.js 프로젝트에서 Server Component, Client Component, Server Action, Route Handler를 모두 사용한다고 할 때, 데이터 흐름을 설계하는 가장 올바른 원칙은?",
      choices: [
        "모든 데이터를 전역 상태로 관리한다",
        "데이터 페칭은 가능한 Server Component에서 수행하고, 사용자 인터랙션에 의한 mutation은 Server Action으로, 외부 클라이언트를 위한 API는 Route Handler로, 상태 관리는 필요한 Client Component 범위를 최소화하여 구성한다",
        "모든 것을 Route Handler로 통일한다",
        "클라이언트에서 모든 데이터를 페칭한다",
      ],
      correctIndex: 1,
      explanation:
        "서버 우선 데이터 페칭으로 워터폴을 줄이고 보안을 강화하며, Server Action으로 mutation을 간결하게 처리하고, Route Handler로 외부 API를 제공합니다. Client Component는 인터랙티브 UI에만 사용하여 JavaScript 번들을 최소화합니다.",
    },
  ],
};

export default finalExam;
