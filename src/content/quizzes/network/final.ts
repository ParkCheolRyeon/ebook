import type { FinalExam } from "@/types/quiz";

const finalExam: FinalExam = {
  type: "final",
  id: "final-exam",
  title: "네트워크 최종 시험",
  questions: [
    // === 네트워크 기초 ===
    {
      id: "final-q1",
      question:
        "프론트엔드 개발자가 네트워크 탭에서 확인할 수 있는 TCP/IP 4계층 모델에서, 브라우저의 HTTP 요청이 실제 네트워크를 통해 전달되는 과정을 올바르게 설명한 것은?",
      choices: [
        "HTTP 요청이 바로 물리 계층으로 전달된다",
        "응용 계층(HTTP)에서 생성된 데이터가 전송 계층(TCP)에서 세그먼트로 분할되고, 인터넷 계층(IP)에서 패킷에 주소가 부여되며, 네트워크 접근 계층에서 프레임으로 캡슐화되어 전송된다",
        "모든 데이터가 UDP로 전송된다",
        "IP 주소 없이 도메인 이름으로 직접 전송된다",
      ],
      correctIndex: 1,
      explanation:
        "TCP/IP 4계층 모델에서 데이터는 응용→전송→인터넷→네트워크 접근 계층 순서로 캡슐화됩니다. 각 계층은 자신의 헤더를 추가하여 데이터를 감싸고, 수신 측에서는 역순으로 헤더를 제거(역캡슐화)합니다.",
    },
    {
      id: "final-q2",
      question:
        "사용자가 브라우저에서 새로운 도메인을 처음 방문했는데 DNS 조회에 200ms가 걸렸다. 두 번째 방문 시 DNS 조회 시간을 줄이기 위해 프론트엔드에서 활용할 수 있는 기법은?",
      choices: [
        "DNS 서버를 직접 운영한다",
        "<link rel=\"dns-prefetch\" href=\"//api.example.com\">을 HTML에 추가하여 브라우저가 유휴 시간에 미리 DNS를 조회하게 한다",
        "hosts 파일에 IP를 직접 등록한다",
        "DNS 조회 시간은 프론트엔드에서 제어할 수 없다",
      ],
      correctIndex: 1,
      explanation:
        "dns-prefetch는 브라우저가 유휴 시간에 미리 DNS를 조회하여 실제 요청 시 지연을 줄입니다. 외부 API, CDN, 폰트 서버 등 알려진 도메인에 적용하면 효과적입니다. preconnect는 DNS + TCP + TLS까지 미리 연결합니다.",
    },
    {
      id: "final-q3",
      question:
        "온라인 게임의 실시간 대전 기능과 파일 다운로드 기능을 동시에 제공해야 한다. 각각에 적합한 전송 프로토콜은?",
      choices: [
        "둘 다 TCP를 사용한다",
        "실시간 대전은 UDP(낮은 지연, 일부 패킷 손실 허용)를, 파일 다운로드는 TCP(데이터 무결성과 순서 보장)를 사용한다",
        "둘 다 UDP를 사용한다",
        "실시간 대전은 TCP, 파일 다운로드는 UDP를 사용한다",
      ],
      correctIndex: 1,
      explanation:
        "실시간 게임은 지연이 치명적이고 약간의 패킷 손실은 다음 프레임으로 보정 가능하므로 UDP가 적합합니다. 파일 다운로드는 데이터가 빠짐없이 순서대로 도착해야 하므로 TCP의 신뢰성이 필수입니다.",
    },
    // === HTTP ===
    {
      id: "final-q4",
      question:
        "RESTful API에서 사용자 목록 조회, 단일 사용자 조회, 사용자 생성, 사용자 삭제에 대한 HTTP 메서드와 상태 코드 조합으로 올바른 것은?",
      choices: [
        "모든 요청에 POST를 사용하고 200을 반환한다",
        "GET /users→200, GET /users/1→200(또는 404), POST /users→201, DELETE /users/1→204",
        "GET /users→201, POST /users→200, DELETE /users→200",
        "FETCH /users→200, CREATE /users→201, REMOVE /users/1→200",
      ],
      correctIndex: 1,
      explanation:
        "올바른 조합: 목록 조회 GET→200, 단일 조회 GET→200(없으면 404), 생성 POST→201(Created), 삭제 DELETE→204(No Content). 상태 코드를 정확히 사용하면 클라이언트가 응답을 올바르게 처리할 수 있습니다.",
    },
    {
      id: "final-q5",
      question:
        "API 응답에서 301과 302 리다이렉트의 차이점과 프론트엔드에서의 영향은?",
      choices: [
        "둘 다 동일하게 동작한다",
        "301(Moved Permanently)은 브라우저가 새 URL을 캐시하여 다음부터 직접 새 URL로 요청하고, 302(Found)는 임시 이동이라 매번 원래 URL로 요청 후 리다이렉트된다. SEO에서도 301은 링크 가치를 이전한다",
        "301은 서버 에러이고 302는 클라이언트 에러이다",
        "프론트엔드에서는 리다이렉트를 제어할 수 없다",
      ],
      correctIndex: 1,
      explanation:
        "301은 영구 이동으로 브라우저가 캐시하고, 검색 엔진이 새 URL로 인덱스를 이전합니다. 302는 임시 이동으로 캐시하지 않습니다. 도메인 이전은 301, 로그인 후 리다이렉트는 302가 적합합니다.",
    },
    {
      id: "final-q6",
      question:
        "Content-Type 헤더가 잘못 설정되어 발생할 수 있는 실제 문제 상황은?",
      choices: [
        "Content-Type은 표시 형식만 변경할 뿐 기능에 영향이 없다",
        "서버가 application/json 대신 text/html로 응답하면 브라우저가 JSON을 HTML로 해석하여 XSS에 취약해질 수 있고, 클라이언트가 폼 데이터를 보내면서 application/json을 설정하면 서버 파싱이 실패한다",
        "Content-Type은 이미지 전송에만 필요하다",
        "Content-Type 없이도 브라우저가 자동으로 올바르게 처리한다",
      ],
      correctIndex: 1,
      explanation:
        "Content-Type은 데이터 해석 방법을 결정합니다. JSON 응답에 text/html을 설정하면 MIME 스니핑으로 스크립트가 실행될 수 있어 보안 위험이 됩니다. X-Content-Type-Options: nosniff 헤더로 MIME 스니핑을 방지하는 것도 중요합니다.",
    },
    {
      id: "final-q7",
      question:
        "HTTPS 적용 후에도 주의해야 할 보안 사항으로 올바른 것은?",
      choices: [
        "HTTPS를 적용하면 모든 보안 위협이 해결된다",
        "Mixed Content(HTTP 리소스 로드), HSTS 미설정으로 인한 다운그레이드 공격, 인증서 만료 모니터링, TLS 1.2 이상 강제 등을 추가로 관리해야 한다",
        "HTTPS는 서버 성능을 크게 저하시키므로 API에만 적용한다",
        "인증서는 한 번 설치하면 영구적이다",
      ],
      correctIndex: 1,
      explanation:
        "HTTPS 적용 후에도 HTTP 리소스를 로드하면 Mixed Content 경고가 발생하고, HSTS 없이는 HTTP로 다운그레이드될 수 있습니다. 인증서 자동 갱신(Let's Encrypt), TLS 최소 버전 설정, CSP upgrade-insecure-requests 등의 추가 조치가 필요합니다.",
    },
    // === HTTP 진화 ===
    {
      id: "final-q8",
      question:
        "레거시 시스템이 HTTP/1.1을 사용하는 상태에서 HTTP/2로 마이그레이션할 때, 기존의 성능 최적화 기법 중 더 이상 필요하지 않은 것은?",
      choices: [
        "이미지 최적화 (WebP 변환, 크기 조절)",
        "도메인 샤딩 — HTTP/2는 하나의 연결로 멀티플렉싱하므로 여러 도메인으로 분산할 필요가 없고, 오히려 추가 DNS 조회와 TCP 연결로 역효과를 줄 수 있다",
        "코드 스플리팅과 지연 로딩",
        "Gzip/Brotli 압축",
      ],
      correctIndex: 1,
      explanation:
        "도메인 샤딩은 HTTP/1.1의 도메인당 연결 수 제한(6개)을 우회하기 위한 기법이었습니다. HTTP/2는 하나의 연결에서 멀티플렉싱으로 수백 개의 리소스를 병렬 전송하므로 도메인 샤딩이 불필요하며, 추가 연결 비용만 발생합니다.",
    },
    {
      id: "final-q9",
      question:
        "REST API를 설계할 때 리소스의 관계를 URI에 표현하는 방법으로 가장 적절한 것은?",
      choices: [
        "/getUserPosts?userId=1 — 쿼리 파라미터로 관계를 표현한다",
        "/users/1/posts — 사용자 1의 게시물이라는 계층적 관계를 URI 경로로 표현하고, 필터링은 쿼리 파라미터(?status=published)로 처리한다",
        "/posts?user=1 — 항상 쿼리 파라미터만 사용한다",
        "/users-posts/1 — 하이픈으로 관계를 표현한다",
      ],
      correctIndex: 1,
      explanation:
        "REST에서 리소스 간 계층 관계는 URI 경로로 표현합니다. /users/1/posts는 '사용자 1에 속한 게시물'이라는 의미가 명확합니다. 필터링, 정렬, 페이징은 쿼리 파라미터(?page=2&sort=date)가 적합합니다.",
    },
    {
      id: "final-q10",
      question:
        "REST API의 버전 관리 방법 중 가장 널리 사용되는 방식과 그 장단점은?",
      choices: [
        "버전 관리는 필요하지 않다",
        "URI 경로(/api/v1/users)에 버전을 포함하는 방식이 가장 직관적이고 널리 사용되며, 헤더(Accept: application/vnd.api+json;version=1)나 쿼리 파라미터(?version=1) 방식도 있다",
        "API를 변경할 때마다 새 도메인을 사용한다",
        "클라이언트가 원하는 버전을 쿠키로 전달한다",
      ],
      correctIndex: 1,
      explanation:
        "URI 버전관리(/api/v1/)는 명확하고 캐시 친화적이지만 URL이 바뀌어 클라이언트 수정이 필요합니다. 헤더 버전관리는 URL이 깔끔하지만 테스트가 어렵습니다. 대부분의 공개 API(GitHub, Stripe 등)가 URI 버전관리를 채택합니다.",
    },
    // === 실시간 통신 ===
    {
      id: "final-q11",
      question:
        "알림 시스템에서 서버가 새 알림을 클라이언트에 실시간으로 전달해야 한다. WebSocket, SSE, 폴링 중 가장 적절한 방식과 그 이유는?",
      choices: [
        "10초 간격의 짧은 폴링으로 충분하다",
        "SSE가 적합하다. 알림은 서버→클라이언트 단방향이고, SSE는 자동 재연결과 이벤트 ID를 내장하여 구현이 간단하며, HTTP 인프라(인증, 프록시)와 자연스럽게 호환된다",
        "WebSocket이 유일한 선택지이다",
        "알림은 실시간이 아닌 이메일로 보내야 한다",
      ],
      correctIndex: 1,
      explanation:
        "알림은 서버→클라이언트 단방향이므로 SSE가 적합합니다. SSE는 HTTP 기반이라 기존 인증/프록시와 호환되고, 자동 재연결과 Last-Event-ID로 끊긴 동안의 알림을 복구합니다. WebSocket은 양방향이 필요한 채팅에 더 적합합니다.",
    },
    {
      id: "final-q12",
      question:
        "협업 문서 편집 도구를 개발할 때 WebSocket을 선택하는 이유와 구현 시 고려사항은?",
      choices: [
        "HTTP 폴링으로도 충분히 구현 가능하다",
        "여러 사용자의 편집 내용을 양방향으로 빠르게 동기화해야 하므로 WebSocket이 필수적이며, 충돌 해결(OT/CRDT), 재연결 시 상태 동기화, 커서 위치 공유 등을 고려해야 한다",
        "SSE로 서버에서 변경사항만 보내면 된다",
        "각 사용자가 저장 버튼을 누를 때만 동기화하면 된다",
      ],
      correctIndex: 1,
      explanation:
        "협업 편집은 모든 참여자가 동시에 데이터를 보내고 받아야 하므로 WebSocket의 양방향 전이중 통신이 필수입니다. 동시 편집 충돌을 해결하기 위한 OT(Operational Transform)나 CRDT 알고리즘, 네트워크 끊김 시 오프라인 큐와 재동기화도 구현해야 합니다.",
    },
    {
      id: "final-q13",
      question:
        "모바일 앱과 웹 대시보드에서 동일한 백엔드의 데이터를 사용하지만, 각 화면에서 필요한 데이터 구조가 다르다. GraphQL이 이 시나리오에서 REST보다 유리한 구체적인 이유는?",
      choices: [
        "GraphQL은 모바일에서만 사용 가능하다",
        "각 클라이언트가 자신에게 필요한 필드만 쿼리에 명시하여 요청하므로, 백엔드 엔드포인트를 클라이언트별로 분리할 필요 없이 하나의 스키마로 다양한 데이터 요구사항을 충족한다",
        "REST는 모바일 앱에서 사용할 수 없다",
        "GraphQL은 네트워크 사용량이 항상 적다",
      ],
      correctIndex: 1,
      explanation:
        "REST에서는 모바일용 /api/mobile/users, 웹용 /api/web/users처럼 별도 엔드포인트를 만들거나 불필요한 데이터를 포함해야 합니다. GraphQL은 클라이언트가 필요한 필드를 직접 선택하므로, 하나의 스키마로 다양한 클라이언트를 지원합니다.",
    },
    // === 브라우저 네트워킹 ===
    {
      id: "final-q14",
      question:
        "개발 환경에서 프론트엔드(localhost:3000)가 백엔드 API(localhost:8080)를 호출했더니 CORS 에러가 발생했다. 디버깅 순서로 가장 적절한 것은?",
      choices: [
        "브라우저 보안을 비활성화한다",
        "브라우저 개발자 도구 네트워크 탭에서 OPTIONS preflight 요청과 응답 헤더를 확인하고, 서버의 Access-Control-Allow-Origin, Allow-Methods, Allow-Headers 설정을 확인하며, 개발 환경에서는 프록시 설정으로 해결할 수도 있다",
        "fetch 대신 XMLHttpRequest를 사용한다",
        "프론트엔드에서 CORS 헤더를 추가한다",
      ],
      correctIndex: 1,
      explanation:
        "CORS 디버깅은 네트워크 탭에서 시작합니다. preflight OPTIONS 요청이 있는지, 응답에 올바른 CORS 헤더가 있는지 확인합니다. 개발 환경에서는 Vite/CRA의 프록시 설정으로 같은 출처에서 API를 호출하게 우회할 수 있습니다.",
    },
    {
      id: "final-q15",
      question:
        "SPA의 정적 에셋과 API 응답에 대한 캐싱 전략을 올바르게 설계한 것은?",
      choices: [
        "모든 리소스에 동일한 캐시 설정을 적용한다",
        "해시된 정적 에셋(JS/CSS/이미지)은 Cache-Control: max-age=31536000, immutable로 장기 캐시하고, HTML은 no-cache로 항상 재검증하며, API 응답은 데이터 특성에 따라 max-age=0이나 stale-while-revalidate를 사용한다",
        "캐시를 완전히 비활성화하여 항상 최신 데이터를 제공한다",
        "CDN에서만 캐시하고 브라우저 캐시는 사용하지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "캐시 전략은 리소스 유형별로 달라야 합니다. 해시된 에셋은 URL이 곧 버전이므로 영구 캐시, HTML은 새 배포를 즉시 반영하기 위해 재검증, API는 데이터 신선도에 따라 설정합니다. stale-while-revalidate는 캐시된 데이터를 먼저 보여주고 백그라운드에서 갱신합니다.",
    },
    {
      id: "final-q16",
      question:
        "인증 쿠키의 보안 속성을 설정할 때, Secure, HttpOnly, SameSite를 모두 적용해야 하는 이유는?",
      choices: [
        "하나만 설정해도 충분하다",
        "Secure는 HTTPS에서만 쿠키를 전송하여 도청을 방지하고, HttpOnly는 JavaScript 접근을 차단하여 XSS 토큰 탈취를 방지하며, SameSite는 크로스 사이트 요청의 쿠키 전송을 제한하여 CSRF를 방지한다. 세 가지 모두 다른 공격 벡터를 방어한다",
        "세 속성은 동일한 기능을 중복 제공한다",
        "SameSite만 설정하면 Secure와 HttpOnly는 자동 적용된다",
      ],
      correctIndex: 1,
      explanation:
        "각 속성은 서로 다른 위협을 방어합니다. Secure는 HTTPS 강제(네트워크 도청 방지), HttpOnly는 JS 접근 차단(XSS 방어), SameSite는 크로스 사이트 쿠키 전송 제한(CSRF 방어). 다층 방어(Defense in Depth) 원칙에 따라 모두 적용해야 합니다.",
    },
    {
      id: "final-q17",
      question:
        "웹 성능 최적화에서 리소스 힌트(resource hints)를 올바르게 사용하는 시나리오는?",
      choices: [
        "모든 외부 리소스에 preload를 적용한다",
        "핵심 웹 폰트에 <link rel=\"preload\" as=\"font\" crossorigin>, 외부 API 도메인에 <link rel=\"preconnect\">, 다음 페이지 번들에 <link rel=\"prefetch\">를 각각 적용하여 리소스 유형과 우선순위에 맞게 사용한다",
        "prefetch만 사용하면 모든 리소스 로딩이 최적화된다",
        "리소스 힌트는 성능에 영향을 주지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "preload는 현재 페이지 필수 리소스(LCP 이미지, 폰트)에, preconnect는 곧 요청할 도메인(API, CDN)에, prefetch는 다음 네비게이션 리소스에 사용합니다. 과도하게 사용하면 대역폭을 낭비하므로 핵심 리소스에만 적용합니다.",
    },
    // === 웹 보안 ===
    {
      id: "final-q18",
      question:
        "React 애플리케이션에서 XSS를 방지하기 위해 특별히 주의해야 하는 경우는?",
      choices: [
        "React는 모든 XSS를 자동으로 방지하므로 추가 조치가 필요 없다",
        "dangerouslySetInnerHTML 사용 시 반드시 DOMPurify 등으로 HTML을 새니타이즈해야 하고, href={userInput}에서 javascript: 프로토콜을 필터링해야 하며, 서버에서도 입력 검증을 수행해야 한다",
        "useState에 저장된 값은 XSS에 안전하다",
        "CSP만 설정하면 React에서 XSS는 불가능하다",
      ],
      correctIndex: 1,
      explanation:
        "React의 JSX는 기본적으로 이스케이프하여 XSS를 방지하지만, dangerouslySetInnerHTML은 이름 그대로 위험합니다. 사용자 입력 HTML을 삽입할 때는 DOMPurify로 새니타이즈하고, URL에 javascript: 스킴이 포함되지 않도록 검증해야 합니다.",
    },
    {
      id: "final-q19",
      question:
        "CSP(Content Security Policy)를 SPA에 적용할 때 흔히 겪는 문제와 해결 방법은?",
      choices: [
        "CSP는 SPA와 호환되지 않는다",
        "인라인 스크립트와 eval()을 사용하는 라이브러리가 차단될 수 있으므로, nonce 기반 CSP(script-src 'nonce-xxx')로 허용할 스크립트를 지정하고, style-src에 'unsafe-inline'을 최소화하며, report-uri로 위반 사항을 모니터링한다",
        "script-src 'unsafe-inline' 'unsafe-eval'을 설정하면 모든 문제가 해결된다",
        "CSP는 서버 렌더링 앱에만 적용 가능하다",
      ],
      correctIndex: 1,
      explanation:
        "SPA에서 CSP 적용 시 번들러가 생성하는 인라인 스크립트가 차단될 수 있습니다. nonce를 사용하면 특정 인라인 스크립트만 허용하고, report-uri로 차단된 리소스를 모니터링하여 점진적으로 정책을 강화할 수 있습니다. 'unsafe-inline'은 가능한 피해야 합니다.",
    },
    {
      id: "final-q20",
      question:
        "SPA에서 소셜 로그인(OAuth 2.0)을 구현할 때 PKCE(Proof Key for Code Exchange) 플로우를 사용해야 하는 이유는?",
      choices: [
        "PKCE는 서버 사이드 애플리케이션에서만 필요하다",
        "SPA는 클라이언트 시크릿을 안전하게 저장할 수 없는 퍼블릭 클라이언트이므로, PKCE가 code_verifier/code_challenge를 통해 인가 코드 탈취 공격을 방지하여 시크릿 없이도 안전한 토큰 교환을 보장한다",
        "PKCE는 성능 최적화를 위한 것이다",
        "PKCE 없이 Implicit Flow를 사용하는 것이 SPA에 더 적합하다",
      ],
      correctIndex: 1,
      explanation:
        "SPA는 소스코드가 브라우저에 노출되므로 client_secret을 안전하게 보관할 수 없습니다. PKCE는 동적으로 생성한 code_verifier의 해시(code_challenge)를 인가 요청에 포함하고, 토큰 교환 시 원본 code_verifier를 검증하여 인가 코드가 탈취되어도 토큰을 얻을 수 없게 합니다.",
    },
  ],
};

export default finalExam;
