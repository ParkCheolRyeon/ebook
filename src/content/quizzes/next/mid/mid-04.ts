import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-04",
  title: "중간 점검 4: API ~ 아키텍처",
  coverGroups: ["API와 백엔드", "테스팅과 배포", "Pages Router", "아키텍처"],
  questions: [
    {
      id: "mid04-q1",
      question:
        "Route Handler(route.ts)와 Server Action의 용도 차이는?",
      choices: [
        "둘 다 동일한 목적으로 사용된다",
        "Route Handler는 외부 시스템 연동 등 범용 API 엔드포인트에, Server Action은 폼 제출이나 데이터 변경(mutation) 중심의 서버 함수에 적합하다",
        "Route Handler는 GET만, Server Action은 POST만 지원한다",
        "Server Action이 Route Handler를 완전히 대체한다",
      ],
      correctIndex: 1,
      explanation:
        "Route Handler는 GET/POST/PUT/DELETE 등 RESTful API 엔드포인트를 만들 때, Server Action은 폼 제출이나 데이터 변경 작업을 React 컴포넌트와 긴밀하게 통합할 때 사용합니다.",
    },
    {
      id: "mid04-q2",
      question:
        "Route Handler에서 동적 세그먼트의 매개변수에 접근하는 방법은?",
      choices: [
        "useParams Hook을 사용한다",
        "핸들러 함수의 두 번째 인자에서 params를 구조 분해하여 접근한다",
        "URL을 직접 파싱한다",
        "환경 변수로 전달된다",
      ],
      correctIndex: 1,
      explanation:
        "Route Handler는 export async function GET(request, { params }) 형태로, 두 번째 인자의 params 객체에서 동적 세그먼트 값에 접근합니다.",
    },
    {
      id: "mid04-q3",
      question:
        "Next.js에서 데이터베이스에 직접 접근할 때 권장되는 위치는?",
      choices: [
        "Client Component에서 직접 접근한다",
        "Server Component, Server Action, 또는 Route Handler에서 접근하여 DB 자격 증명이 클라이언트에 노출되지 않도록 한다",
        "미들웨어에서 접근한다",
        "next.config.js에서 설정한다",
      ],
      correctIndex: 1,
      explanation:
        "데이터베이스 접근은 서버 측 코드(Server Component, Server Action, Route Handler)에서만 수행해야 합니다. 클라이언트에 DB 연결 문자열이나 자격 증명이 노출되는 것을 방지합니다.",
    },
    {
      id: "mid04-q4",
      question:
        "Next.js 앱의 E2E 테스트에서 Playwright가 Cypress보다 유리한 점은?",
      choices: [
        "설정이 더 간단하다",
        "멀티 브라우저(Chromium, Firefox, WebKit) 지원, 병렬 실행, 서버 컴포넌트 테스트에 더 적합하다",
        "React 컴포넌트를 직접 테스트할 수 있다",
        "번들 크기가 더 작다",
      ],
      correctIndex: 1,
      explanation:
        "Playwright는 Chromium, Firefox, WebKit을 모두 지원하고, 기본 병렬 실행과 자동 대기를 제공합니다. 서버 사이드 렌더링된 콘텐츠 테스트에도 강점이 있습니다.",
    },
    {
      id: "mid04-q5",
      question:
        "Vercel에 Next.js를 배포할 때 자동으로 적용되는 최적화는?",
      choices: [
        "모든 페이지가 정적으로 변환된다",
        "Edge 네트워크 배포, 자동 이미지 최적화, ISR 지원, 서버리스 함수 자동 생성 등이 적용된다",
        "데이터베이스가 자동으로 생성된다",
        "테스트가 자동으로 실행된다",
      ],
      correctIndex: 1,
      explanation:
        "Vercel은 Next.js의 공식 플랫폼으로, Edge CDN 배포, 이미지 최적화, ISR, 서버리스/Edge 함수 자동 설정, 프리뷰 배포 등을 자동으로 지원합니다.",
    },
    {
      id: "mid04-q6",
      question:
        "Pages Router의 getServerSideProps와 App Router의 Server Component 데이터 페칭의 차이는?",
      choices: [
        "기능이 동일하다",
        "getServerSideProps는 페이지 단위로 데이터를 페칭하지만, Server Component는 컴포넌트 단위로 필요한 곳에서 직접 async/await로 데이터를 가져온다",
        "Server Component가 더 느리다",
        "getServerSideProps는 캐싱을 지원하지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "Pages Router는 페이지 최상위에서만 데이터 페칭이 가능하고 props로 전달해야 했습니다. App Router의 Server Component는 어떤 컴포넌트에서든 직접 데이터를 가져올 수 있어 코로케이션이 가능합니다.",
    },
    {
      id: "mid04-q7",
      question:
        "Pages Router에서 App Router로 마이그레이션할 때 가장 주의해야 할 점은?",
      choices: [
        "한 번에 전체를 마이그레이션해야 한다",
        "pages/와 app/ 디렉토리를 공존시키며 점진적으로 마이그레이션하되, 같은 경로가 양쪽에 존재하지 않도록 해야 한다",
        "TypeScript를 먼저 제거해야 한다",
        "모든 라이브러리를 업데이트해야 한다",
      ],
      correctIndex: 1,
      explanation:
        "Next.js는 pages/와 app/ 디렉토리의 공존을 지원하여 점진적 마이그레이션이 가능합니다. 단, 같은 URL 경로가 양쪽에 존재하면 빌드 에러가 발생하므로 한 경로씩 이동해야 합니다.",
    },
    {
      id: "mid04-q8",
      question:
        "대규모 Next.js 앱에서 모노레포(Turborepo)를 도입하는 이유는?",
      choices: [
        "단일 저장소에서 모든 코드를 관리하기 위해",
        "여러 앱과 패키지 간 코드 공유, 빌드 캐싱, 병렬 태스크 실행으로 개발 효율성과 빌드 속도를 향상시킨다",
        "Git 히스토리를 단순화하기 위해",
        "배포를 단일 서버로 통합하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "Turborepo는 모노레포에서 빌드 결과를 캐싱하고, 변경된 패키지만 재빌드하며, 태스크를 병렬 실행합니다. 공유 컴포넌트 라이브러리나 설정을 여러 앱에서 재사용할 수 있습니다.",
    },
    {
      id: "mid04-q9",
      question:
        "Next.js에서 셀프 호스팅(next start) 시 Vercel 대비 직접 관리해야 하는 것은?",
      choices: [
        "라우팅 설정",
        "이미지 최적화 설정, CDN 구성, ISR용 캐시 스토리지, 서버 인프라 및 스케일링",
        "React 버전 관리",
        "TypeScript 컴파일",
      ],
      correctIndex: 1,
      explanation:
        "셀프 호스팅 시 이미지 최적화를 위한 sharp 패키지 설치, CDN 구성, ISR 캐시 저장소 설정(기본은 파일 시스템), 서버 스케일링 등을 직접 관리해야 합니다.",
    },
    {
      id: "mid04-q10",
      question:
        "Next.js 앱에서 Feature Flag와 A/B 테스트를 구현할 때 미들웨어가 적합한 이유는?",
      choices: [
        "미들웨어에서 UI를 렌더링할 수 있다",
        "요청이 도달하기 전에 사용자를 분류하고 URL을 리라이트하여, 정적 생성된 다른 변형 페이지로 라우팅할 수 있다",
        "미들웨어가 데이터베이스에 직접 접근한다",
        "클라이언트 사이드에서만 분기를 처리하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "미들웨어는 Edge에서 요청을 가로채어 쿠키 기반으로 사용자를 그룹에 배정하고, URL 리라이트로 해당 그룹의 정적 페이지 변형을 서빙할 수 있습니다. 렌더링 성능에 영향을 주지 않으면서 A/B 테스트가 가능합니다.",
    },
  ],
};

export default midQuiz;
