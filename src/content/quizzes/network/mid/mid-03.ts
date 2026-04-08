import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-03",
  title: "중간 점검 3: 브라우저 네트워킹 ~ 웹 보안",
  coverGroups: ["브라우저 네트워킹", "웹 보안"],
  questions: [
    {
      id: "mid03-q1",
      question:
        "프론트엔드에서 다른 도메인의 API를 호출했더니 브라우저 콘솔에 CORS 에러가 발생했다. preflight 요청이 발생하는 조건은?",
      choices: [
        "모든 크로스 오리진 요청에 preflight가 발생한다",
        "Content-Type이 application/json이거나 커스텀 헤더(Authorization 등)를 포함하는 등 '단순 요청' 조건을 벗어나면, 브라우저가 OPTIONS 메서드로 preflight 요청을 보내 서버의 허용 여부를 확인한다",
        "GET 요청에만 preflight가 발생한다",
        "서버가 명시적으로 preflight를 요청해야 한다",
      ],
      correctIndex: 1,
      explanation:
        "단순 요청(GET/HEAD/POST + 특정 Content-Type + 커스텀 헤더 없음)이 아닌 경우 브라우저가 자동으로 OPTIONS preflight를 보냅니다. 서버가 Access-Control-Allow-Origin 등으로 허용하면 실제 요청이 전송됩니다.",
    },
    {
      id: "mid03-q2",
      question:
        "Same-Origin Policy(동일 출처 정책)에서 '출처(Origin)'가 같다고 판단하는 기준은?",
      choices: [
        "도메인만 같으면 같은 출처이다",
        "프로토콜(스킴) + 호스트(도메인) + 포트 세 가지가 모두 일치해야 같은 출처이다. https://example.com과 http://example.com은 다른 출처이다",
        "IP 주소가 같으면 같은 출처이다",
        "같은 서버에서 호스팅되면 같은 출처이다",
      ],
      correctIndex: 1,
      explanation:
        "Origin은 프로토콜 + 호스트 + 포트로 구성됩니다. https://example.com:443과 https://example.com은 같은 출처(HTTPS 기본 포트 443)이지만, http://example.com이나 https://api.example.com은 다른 출처입니다.",
    },
    {
      id: "mid03-q3",
      question:
        "쿠키의 SameSite 속성을 Lax로 설정했을 때의 동작으로 올바른 것은?",
      choices: [
        "모든 크로스 사이트 요청에 쿠키가 전송된다",
        "크로스 사이트 요청 중 최상위 레벨 네비게이션(링크 클릭 등)의 GET 요청에만 쿠키가 전송되고, POST 폼이나 iframe, AJAX 요청에는 전송되지 않는다",
        "같은 사이트 요청에도 쿠키가 전송되지 않는다",
        "Lax는 Strict와 동일하게 동작한다",
      ],
      correctIndex: 1,
      explanation:
        "SameSite=Lax는 CSRF를 방지하면서 사용성을 유지하는 균형잡힌 설정입니다. 외부 사이트에서 링크를 클릭해 이동할 때는 쿠키가 전송되지만(사용성), POST 폼이나 비동기 요청에는 전송되지 않아(보안) CSRF를 방지합니다.",
    },
    {
      id: "mid03-q4",
      question:
        "JWT를 프론트엔드에서 저장할 때 localStorage와 httpOnly 쿠키의 보안 차이를 올바르게 설명한 것은?",
      choices: [
        "localStorage가 쿠키보다 보안이 더 강력하다",
        "localStorage는 JavaScript로 접근 가능하여 XSS에 취약하고, httpOnly 쿠키는 JavaScript로 접근할 수 없어 XSS에서 토큰 탈취를 방지하지만 CSRF 대응이 별도로 필요하다",
        "httpOnly 쿠키는 어떤 공격에도 안전하다",
        "둘 다 동일한 보안 수준을 제공한다",
      ],
      correctIndex: 1,
      explanation:
        "localStorage에 저장된 JWT는 XSS 공격으로 document.cookie나 localStorage.getItem으로 탈취될 수 있습니다. httpOnly 쿠키는 JavaScript에서 접근이 불가하여 XSS 토큰 탈취를 방지하지만, SameSite와 CSRF 토큰으로 CSRF도 방어해야 합니다.",
    },
    {
      id: "mid03-q5",
      question:
        "Cache-Control: max-age=31536000, immutable이 적합한 리소스와 그 이유는?",
      choices: [
        "API 응답 — 자주 변경되지 않으므로 오래 캐시한다",
        "파일명에 해시가 포함된 정적 에셋(app.a1b2c3.js) — 내용이 바뀌면 파일명도 바뀌므로, 같은 URL은 영원히 같은 내용이라 1년 캐시와 재검증 불필요(immutable)를 설정한다",
        "HTML 문서 — 한 번 캐시하면 업데이트가 필요 없다",
        "사용자 프로필 이미지 — 자주 변경되지 않기 때문이다",
      ],
      correctIndex: 1,
      explanation:
        "해시 기반 파일명(app.a1b2c3.js)은 내용 변경 시 해시가 달라져 새 URL이 됩니다. 같은 URL은 항상 같은 내용이므로 max-age=31536000(1년)과 immutable(재검증도 불필요)을 설정하여 최대한 캐싱합니다.",
    },
    {
      id: "mid03-q6",
      question:
        "ETag를 활용한 캐시 재검증(conditional request)이 동작하는 과정을 올바르게 설명한 것은?",
      choices: [
        "서버가 매번 전체 리소스를 다시 보낸다",
        "서버가 응답에 ETag를 포함하고, 브라우저가 재요청 시 If-None-Match 헤더에 ETag 값을 보내면, 서버가 변경 여부를 확인하여 변경 없으면 304 Not Modified를 반환한다",
        "브라우저가 자체적으로 리소스 변경을 감지한다",
        "ETag는 캐시 만료 시간을 나타낸다",
      ],
      correctIndex: 1,
      explanation:
        "ETag는 리소스의 버전 식별자입니다. 브라우저가 캐시된 리소스의 ETag를 If-None-Match 헤더로 보내면, 서버는 현재 ETag와 비교하여 같으면 304(본문 없이), 다르면 200과 새 리소스를 반환합니다. 대역폭을 절약할 수 있습니다.",
    },
    {
      id: "mid03-q7",
      question:
        "웹 페이지 성능 최적화를 위해 <link rel=\"preload\">와 <link rel=\"prefetch\">를 올바르게 사용하는 방법은?",
      choices: [
        "둘 다 동일하게 리소스를 미리 다운로드한다",
        "preload는 현재 페이지에 즉시 필요한 핵심 리소스(폰트, CSS)를 높은 우선순위로 미리 로드하고, prefetch는 다음 페이지에서 필요할 수 있는 리소스를 유휴 시간에 낮은 우선순위로 미리 가져온다",
        "preload는 이미지에만, prefetch는 스크립트에만 사용한다",
        "prefetch가 preload보다 우선순위가 높다",
      ],
      correctIndex: 1,
      explanation:
        "preload는 '현재 페이지에서 곧 필요하니 먼저 받아라'이고, prefetch는 '나중에 필요할 수 있으니 여유 있을 때 받아라'입니다. 예: 폰트는 preload, 다음 페이지 JS 번들은 prefetch가 적합합니다.",
    },
    {
      id: "mid03-q8",
      question:
        "XSS(Cross-Site Scripting) 공격을 방지하기 위한 프론트엔드 방어 방법으로 가장 효과적인 것은?",
      choices: [
        "사용자 입력을 서버에서만 검증하면 충분하다",
        "사용자 입력을 HTML에 삽입할 때 반드시 이스케이프 처리하고, innerHTML 대신 textContent를 사용하며, CSP 헤더로 인라인 스크립트 실행을 제한한다",
        "HTTPS를 사용하면 XSS가 방지된다",
        "쿠키에 Secure 플래그를 설정하면 XSS가 방지된다",
      ],
      correctIndex: 1,
      explanation:
        "XSS 방어는 다층적으로 합니다. 출력 시 이스케이프(<를 &lt;로), DOM API에서 textContent 사용, React 등 프레임워크의 자동 이스케이프 활용, CSP 헤더로 인라인 스크립트 차단, httpOnly 쿠키로 토큰 보호 등을 조합합니다.",
    },
    {
      id: "mid03-q9",
      question:
        "CSRF(Cross-Site Request Forgery) 공격의 원리와 방어 방법을 올바르게 설명한 것은?",
      choices: [
        "CSRF는 악성 스크립트를 페이지에 삽입하는 공격이다",
        "사용자가 로그인한 상태에서 악성 사이트가 쿠키를 자동 전송하는 것을 이용해 위조 요청을 보내는 공격이며, CSRF 토큰, SameSite 쿠키, Origin/Referer 헤더 검증으로 방어한다",
        "CSRF는 서버의 SQL을 조작하는 공격이다",
        "HTTPS를 사용하면 CSRF가 자동으로 방지된다",
      ],
      correctIndex: 1,
      explanation:
        "CSRF는 피해자의 브라우저가 자동으로 쿠키를 전송하는 점을 악용합니다. 악성 사이트에서 <form> 제출이나 <img src>로 요청을 유도하면 인증 쿠키가 함께 전송됩니다. CSRF 토큰은 서버가 발급한 일회용 값으로 요청의 정당성을 검증합니다.",
    },
    {
      id: "mid03-q10",
      question:
        "CSP(Content Security Policy) 헤더의 역할과 올바른 설정 예시는?",
      choices: [
        "CSP는 CORS를 대체하는 보안 정책이다",
        "CSP는 브라우저가 실행할 수 있는 리소스의 출처를 제한하여 XSS를 방어한다. 예: script-src 'self' https://cdn.example.com은 자신의 도메인과 지정된 CDN에서만 스크립트를 로드하도록 허용한다",
        "CSP는 서버 간 통신을 제어한다",
        "CSP를 설정하면 모든 외부 리소스가 차단된다",
      ],
      correctIndex: 1,
      explanation:
        "CSP는 허용된 출처에서만 스크립트, 스타일, 이미지 등을 로드하도록 브라우저에 지시합니다. script-src 'self'는 인라인 스크립트와 외부 스크립트를 차단하여 XSS 공격을 효과적으로 방어합니다. nonce나 hash로 특정 인라인 스크립트만 허용할 수도 있습니다.",
    },
  ],
};

export default midQuiz;
