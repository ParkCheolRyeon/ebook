import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-03",
  title: "중간 점검 3: 스타일링 ~ 인증과 보안",
  coverGroups: ["스타일링과 최적화", "인증과 보안"],
  questions: [
    {
      id: "mid03-q1",
      question:
        "Next.js에서 CSS Modules를 사용하는 장점은?",
      choices: [
        "전역 스타일을 쉽게 적용할 수 있다",
        "클래스명이 자동으로 고유하게 생성되어 스타일 충돌을 방지하고, 컴포넌트 단위로 CSS를 관리할 수 있다",
        "런타임에 스타일을 동적으로 변경할 수 있다",
        "서버에서 스타일이 적용되지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "CSS Modules는 빌드 시 클래스명에 고유한 해시를 추가하여 이름 충돌을 방지합니다. 컴포넌트별로 스타일을 분리하면서도 일반 CSS 문법을 그대로 사용할 수 있습니다.",
    },
    {
      id: "mid03-q2",
      question:
        "next/image의 Image 컴포넌트가 일반 <img> 태그보다 나은 점은?",
      choices: [
        "SVG 파일만 지원한다",
        "자동 크기 조절, 포맷 변환(WebP/AVIF), 지연 로딩, 레이아웃 시프트 방지를 기본 제공한다",
        "이미지를 클라이언트에서 생성한다",
        "이미지 캐싱을 비활성화한다",
      ],
      correctIndex: 1,
      explanation:
        "next/image는 디바이스에 맞는 크기로 자동 리사이징, 최신 포맷(WebP/AVIF) 변환, 뷰포트 진입 시 지연 로딩, width/height 필수로 CLS 방지 등을 기본 제공합니다.",
    },
    {
      id: "mid03-q3",
      question:
        "next/font를 사용하여 Google Fonts를 로드할 때의 이점은?",
      choices: [
        "폰트 파일이 더 커진다",
        "빌드 타임에 폰트를 다운로드하여 셀프 호스팅하므로, 외부 네트워크 요청 없이 로딩되고 레이아웃 시프트가 방지된다",
        "모든 폰트를 한 번에 로드한다",
        "런타임에 동적으로 폰트를 변경할 수 있다",
      ],
      correctIndex: 1,
      explanation:
        "next/font는 빌드 시 폰트를 다운로드하고 정적 에셋으로 서빙합니다. 외부 요청이 없어 프라이버시와 성능이 향상되며, CSS size-adjust를 통해 폰트 로딩 중 레이아웃 시프트를 방지합니다.",
    },
    {
      id: "mid03-q4",
      question:
        "Next.js의 Metadata API에서 generateMetadata 함수를 사용하는 경우는?",
      choices: [
        "정적인 메타데이터를 설정할 때",
        "동적 데이터(예: 상품명, 사용자 프로필)에 기반하여 페이지별 메타데이터를 서버에서 생성할 때",
        "클라이언트에서 메타 태그를 변경할 때",
        "메타데이터를 비활성화할 때",
      ],
      correctIndex: 1,
      explanation:
        "generateMetadata는 async 함수로, 외부 데이터를 fetch하여 동적 메타데이터를 생성합니다. 정적 메타데이터는 metadata 객체를, 동적 메타데이터는 generateMetadata 함수를 export합니다.",
    },
    {
      id: "mid03-q5",
      question:
        "Next.js에서 Core Web Vitals를 개선하기 위해 가장 효과적인 조합은?",
      choices: [
        "모든 컴포넌트를 Client Component로 만든다",
        "next/image로 LCP 최적화, next/font로 CLS 방지, Server Component로 JavaScript 번들 축소",
        "모든 페이지를 동적 렌더링한다",
        "CDN을 비활성화한다",
      ],
      correctIndex: 1,
      explanation:
        "next/image의 자동 최적화로 LCP를 개선하고, next/font의 size-adjust로 CLS를 줄이며, Server Component로 클라이언트 JavaScript 번들을 최소화하면 FID/INP도 개선됩니다.",
    },
    {
      id: "mid03-q6",
      question:
        "Auth.js(NextAuth.js)에서 세션 전략으로 JWT와 database의 차이는?",
      choices: [
        "JWT는 더 안전하다",
        "JWT는 토큰을 쿠키에 저장하여 DB 조회 없이 세션을 확인하고, database 전략은 세션 정보를 DB에 저장하여 서버 측에서 관리한다",
        "database 전략은 클라이언트에서만 동작한다",
        "둘 다 동일한 방식으로 동작한다",
      ],
      correctIndex: 1,
      explanation:
        "JWT 전략은 세션 정보를 토큰에 인코딩하여 쿠키에 저장하므로 DB 조회가 불필요하여 빠릅니다. database 전략은 세션을 DB에 저장하므로 서버에서 즉시 무효화가 가능하지만 매 요청마다 DB 조회가 필요합니다.",
    },
    {
      id: "mid03-q7",
      question:
        "미들웨어에서 인증 확인 후 리다이렉트하는 것과 레이아웃에서 확인하는 것의 차이는?",
      choices: [
        "차이가 없다",
        "미들웨어는 요청이 라우트에 도달하기 전에 실행되어 불필요한 렌더링을 방지하고, 레이아웃은 이미 렌더링 과정에 진입한 후 확인한다",
        "레이아웃에서 확인하는 것이 더 빠르다",
        "미들웨어는 인증 확인이 불가능하다",
      ],
      correctIndex: 1,
      explanation:
        "미들웨어는 Edge에서 요청 처리 전에 실행되므로, 인증되지 않은 사용자가 보호된 페이지의 레이아웃이나 데이터에 접근하는 것을 원천 차단합니다. 레이아웃에서의 확인은 이미 서버 리소스를 사용한 후입니다.",
    },
    {
      id: "mid03-q8",
      question:
        "Server Action에서 사용자 권한을 확인하지 않으면 발생할 수 있는 보안 문제는?",
      choices: [
        "성능이 저하된다",
        "Server Action은 공개 HTTP 엔드포인트이므로, 인증/인가 없이는 누구나 직접 호출하여 무단 데이터 조작이 가능하다",
        "TypeScript 타입 에러가 발생한다",
        "서버가 자동으로 차단한다",
      ],
      correctIndex: 1,
      explanation:
        "Server Action은 내부적으로 POST 엔드포인트로 노출됩니다. 클라이언트에서만 UI를 숨기는 것으로는 부족하며, Server Action 내에서 반드시 세션 확인과 권한 검증을 수행해야 합니다.",
    },
    {
      id: "mid03-q9",
      question:
        "Next.js에서 환경 변수를 클라이언트에 노출하려면 어떻게 해야 하는가?",
      choices: [
        "모든 환경 변수는 자동으로 클라이언트에 노출된다",
        "NEXT_PUBLIC_ 접두사를 붙여야 클라이언트 번들에 인라인되며, 접두사가 없으면 서버에서만 접근 가능하다",
        "환경 변수는 클라이언트에서 사용할 수 없다",
        "next.config.js에서 publicRuntimeConfig을 설정한다",
      ],
      correctIndex: 1,
      explanation:
        "NEXT_PUBLIC_ 접두사가 있는 환경 변수만 빌드 시 클라이언트 JavaScript에 인라인됩니다. 접두사 없는 변수는 서버에서만 접근 가능하여, API 키 등 민감 정보를 보호합니다.",
    },
    {
      id: "mid03-q10",
      question:
        "Tailwind CSS를 Next.js에서 사용할 때 Server Component와의 호환성이 좋은 이유는?",
      choices: [
        "Tailwind는 JavaScript 런타임이 필요하다",
        "Tailwind는 빌드 타임에 CSS를 생성하므로 런타임 JavaScript가 없어, Server Component의 제로 번들 특성과 잘 맞는다",
        "Tailwind는 서버에서만 동작한다",
        "Server Component에서 CSS-in-JS가 더 적합하다",
      ],
      correctIndex: 1,
      explanation:
        "Tailwind CSS는 빌드 타임에 정적 CSS를 생성하므로 클라이언트 런타임 오버헤드가 없습니다. styled-components 같은 CSS-in-JS는 런타임 JavaScript가 필요하여 Server Component와 호환성 문제가 있습니다.",
    },
  ],
};

export default midQuiz;
