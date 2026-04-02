import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-01",
  title: "중간 점검 1: 기초 ~ 서버와 클라이언트",
  coverGroups: ["기초", "서버와 클라이언트"],
  questions: [
    {
      id: "mid01-q1",
      question:
        "Next.js의 App Router에서 page.tsx 파일의 역할은?",
      choices: [
        "전역 레이아웃을 정의한다",
        "해당 경로에서 렌더링될 고유한 UI를 정의한다",
        "API 엔드포인트를 생성한다",
        "미들웨어 로직을 처리한다",
      ],
      correctIndex: 1,
      explanation:
        "page.tsx는 해당 라우트 세그먼트에 대한 고유 UI를 정의하며, 이 파일이 있어야 해당 경로가 공개적으로 접근 가능해집니다.",
    },
    {
      id: "mid01-q2",
      question:
        "layout.tsx와 template.tsx의 핵심적인 차이는?",
      choices: [
        "layout은 서버, template은 클라이언트에서 렌더링된다",
        "layout은 네비게이션 시 상태를 유지하고, template은 매번 새 인스턴스를 생성한다",
        "template이 layout보다 먼저 렌더링된다",
        "layout은 중첩이 불가능하지만 template은 가능하다",
      ],
      correctIndex: 1,
      explanation:
        "layout은 라우트 간 이동 시 리렌더링되지 않고 상태를 보존합니다. template은 네비게이션마다 새 인스턴스를 생성하므로 useEffect가 매번 실행되며, 진입 애니메이션 등에 적합합니다.",
    },
    {
      id: "mid01-q3",
      question:
        "Next.js에서 <Link> 컴포넌트가 <a> 태그보다 권장되는 이유는?",
      choices: [
        "SEO 점수를 높여준다",
        "클라이언트 사이드 네비게이션과 프리페칭을 지원하여 전체 페이지 리로드를 방지한다",
        "자동으로 스타일링이 적용된다",
        "서버 컴포넌트에서만 사용 가능하다",
      ],
      correctIndex: 1,
      explanation:
        "<Link>는 클라이언트 사이드 네비게이션을 수행하고, 뷰포트에 들어온 링크를 자동으로 프리페칭하여 빠른 페이지 전환을 제공합니다.",
    },
    {
      id: "mid01-q4",
      question:
        "loading.tsx 파일이 동작하는 원리는?",
      choices: [
        "JavaScript 번들 로딩 상태를 표시한다",
        "React Suspense 바운더리를 자동으로 생성하여 page.tsx 로딩 중 폴백 UI를 표시한다",
        "API 요청의 로딩 상태를 관리한다",
        "이미지 로딩 최적화를 처리한다",
      ],
      correctIndex: 1,
      explanation:
        "loading.tsx는 내부적으로 해당 라우트 세그먼트의 page.tsx를 React Suspense 바운더리로 감싸고, 로딩 중에 폴백 UI를 즉시 표시합니다.",
    },
    {
      id: "mid01-q5",
      question:
        "error.tsx 파일이 같은 세그먼트의 layout.tsx에서 발생한 에러를 잡지 못하는 이유는?",
      choices: [
        "error.tsx는 클라이언트 컴포넌트이기 때문이다",
        "에러 바운더리가 layout 안에 중첩되므로, layout의 에러는 상위 세그먼트의 error.tsx가 처리해야 한다",
        "layout.tsx는 에러가 발생하지 않는다",
        "error.tsx는 page.tsx 전용이다",
      ],
      correctIndex: 1,
      explanation:
        "error.tsx의 에러 바운더리는 같은 세그먼트의 layout 내부에 중첩됩니다. 따라서 layout의 에러를 잡으려면 부모 세그먼트의 error.tsx 또는 루트의 global-error.tsx를 사용해야 합니다.",
    },
    {
      id: "mid01-q6",
      question:
        "Server Component에서 직접 사용할 수 없는 것은?",
      choices: [
        "async/await를 사용한 데이터 페칭",
        "Node.js API (fs, path 등) 접근",
        "useState, useEffect 같은 React Hook",
        "다른 Server Component 임포트",
      ],
      correctIndex: 2,
      explanation:
        "Server Component는 서버에서만 실행되므로 브라우저 API나 상태/생명주기 Hook(useState, useEffect 등)을 사용할 수 없습니다. 인터랙티브 기능이 필요하면 Client Component를 사용합니다.",
    },
    {
      id: "mid01-q7",
      question:
        "Client Component에서 Server Component를 children으로 전달받아 렌더링할 수 있는 이유는?",
      choices: [
        "Client Component가 자동으로 서버에서 실행되기 때문이다",
        "Server Component가 서버에서 먼저 렌더링된 결과(RSC Payload)가 전달되기 때문이다",
        "Next.js가 컴포넌트를 자동 변환하기 때문이다",
        "실제로는 불가능하며 에러가 발생한다",
      ],
      correctIndex: 1,
      explanation:
        "Server Component는 서버에서 먼저 렌더링되어 직렬화된 결과(RSC Payload)로 변환됩니다. Client Component는 이 결과를 받아 렌더 트리에 배치만 하므로, children/props로 전달이 가능합니다.",
    },
    {
      id: "mid01-q8",
      question:
        "'use client' 지시어를 파일 상단에 선언하면 어떤 의미인가?",
      choices: [
        "해당 파일의 모든 코드가 브라우저에서만 실행된다",
        "해당 파일을 클라이언트-서버 경계의 진입점으로 설정하여, 이 파일과 임포트하는 모듈을 클라이언트 번들에 포함시킨다",
        "서버 사이드 렌더링을 건너뛴다",
        "해당 컴포넌트를 동적으로 임포트한다",
      ],
      correctIndex: 1,
      explanation:
        "'use client'는 서버-클라이언트 경계를 정의합니다. 이 파일과 그 하위 임포트는 클라이언트 번들에 포함됩니다. 단, SSR 시 서버에서도 렌더링될 수 있으므로 '브라우저에서만 실행'은 아닙니다.",
    },
    {
      id: "mid01-q9",
      question:
        "Server Action을 정의할 때 'use server' 지시어의 역할은?",
      choices: [
        "해당 함수를 서버 컴포넌트로 변환한다",
        "해당 함수를 서버에서만 실행되는 엔드포인트로 만들어, 클라이언트에서 호출 시 자동으로 HTTP 요청이 발생한다",
        "서버 사이드 렌더링을 활성화한다",
        "Node.js 런타임을 지정한다",
      ],
      correctIndex: 1,
      explanation:
        "'use server'로 표시된 함수는 서버에서만 실행되는 엔드포인트가 됩니다. 클라이언트에서 이 함수를 호출하면 Next.js가 자동으로 HTTP POST 요청을 생성하여 서버에서 실행합니다.",
    },
    {
      id: "mid01-q10",
      question:
        "Next.js 프로젝트에서 순수 React(CRA)와 비교했을 때 가장 큰 아키텍처적 차이는?",
      choices: [
        "JSX 문법이 다르다",
        "상태 관리 라이브러리를 사용할 수 없다",
        "서버에서 렌더링과 데이터 페칭이 기본이며, 파일 기반 라우팅으로 풀스택 앱을 구축한다",
        "TypeScript를 사용할 수 없다",
      ],
      correctIndex: 2,
      explanation:
        "Next.js는 서버 우선 렌더링, 파일 기반 라우팅, 빌트인 API 라우트 등을 제공하여 별도의 설정 없이 풀스택 웹 애플리케이션을 구축할 수 있습니다. CRA는 클라이언트 사이드 SPA에 초점을 맞춥니다.",
    },
  ],
};

export default midQuiz;
