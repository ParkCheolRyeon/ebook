import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "18-csp-security-headers",
  subject: "network",
  title: "CSP와 보안 헤더",
  description: "Content-Security-Policy를 중심으로 주요 보안 헤더의 역할을 이해하고, Next.js 등 프론트엔드 프레임워크에서 설정하는 방법을 학습합니다.",
  order: 18,
  group: "웹 보안",
  prerequisites: ["17-xss-csrf"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "보안 헤더는 건물의 보안 규정과 비슷합니다.\n\n" +
        "**CSP(Content-Security-Policy)**는 건물 출입 허가 목록입니다. " +
        "'정문(script-src)으로는 A회사와 B회사 직원만 출입 가능, " +
        "후문(style-src)으로는 C회사만 가능'처럼 출처별로 허용 범위를 세밀하게 지정합니다. " +
        "목록에 없는 출처의 스크립트는 실행이 차단됩니다.\n\n" +
        "**X-Frame-Options**은 '이 건물을 다른 건물 안에 넣지 마시오'라는 규정입니다. " +
        "악의적인 사이트가 iframe으로 우리 사이트를 감싸서 클릭재킹 공격을 하는 것을 방지합니다.\n\n" +
        "**Strict-Transport-Security(HSTS)**는 '반드시 보안 통로(HTTPS)만 이용하시오'라는 규정입니다. " +
        "한 번 설정되면 브라우저가 자동으로 HTTP를 HTTPS로 변환합니다.\n\n" +
        "**Referrer-Policy**는 '어디서 왔는지 정보를 얼마나 공개할지'에 대한 규정입니다. " +
        "다른 건물로 이동할 때 출발지 정보를 숨기거나 최소화할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "XSS와 CSRF 같은 공격을 코드 수준에서만 방어하는 것은 한계가 있습니다.\n\n" +
        "**코드 레벨 방어의 한계:**\n\n" +
        "1. **실수 한 번이면 끝**: 개발자가 한 군데라도 이스케이프를 빠뜨리면 XSS 취약점 발생\n" +
        "2. **서드파티 스크립트**: npm 패키지나 광고 스크립트에 악성 코드가 포함될 수 있음\n" +
        "3. **클릭재킹**: iframe으로 사이트를 감싸서 사용자 클릭을 가로채는 공격\n" +
        "4. **다운그레이드 공격**: HTTPS를 HTTP로 강제 전환하여 통신을 도청\n" +
        "5. **MIME 스니핑**: 브라우저가 Content-Type을 무시하고 파일 내용으로 타입을 추측\n\n" +
        "보안 헤더는 브라우저 수준에서 이런 공격을 차단하는 **추가 방어선**입니다. " +
        "코드의 실수를 보완하고, 공격 표면 자체를 줄여줍니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### Content-Security-Policy (CSP)\n" +
        "리소스 로딩과 실행을 출처 기반으로 제어하는 가장 강력한 보안 헤더입니다.\n\n" +
        "**주요 디렉티브:**\n" +
        "- `default-src 'self'`: 기본적으로 같은 출처만 허용\n" +
        "- `script-src 'self' https://cdn.example.com`: JS 로딩 허용 출처\n" +
        "- `style-src 'self' 'unsafe-inline'`: CSS 허용 (인라인 스타일 포함 시)\n" +
        "- `img-src 'self' data: https:`: 이미지 허용 출처\n" +
        "- `connect-src 'self' https://api.example.com`: fetch/XHR 허용 대상\n" +
        "- `font-src 'self' https://fonts.gstatic.com`: 폰트 허용 출처\n" +
        "- `frame-ancestors 'none'`: iframe 삽입 차단 (X-Frame-Options 대체)\n\n" +
        "**nonce와 hash:**\n" +
        "- `script-src 'nonce-abc123'`: 해당 nonce를 가진 스크립트만 실행\n" +
        "- `script-src 'sha256-...'`: 해당 해시와 일치하는 스크립트만 실행\n" +
        "- `'unsafe-inline'`보다 안전한 인라인 스크립트 허용 방법\n\n" +
        "### 기타 보안 헤더\n\n" +
        "**X-Frame-Options:**\n" +
        "- `DENY`: iframe 삽입 완전 차단\n" +
        "- `SAMEORIGIN`: 같은 출처에서만 iframe 허용\n\n" +
        "**X-Content-Type-Options:**\n" +
        "- `nosniff`: MIME 타입 스니핑 방지 (서버가 지정한 타입만 사용)\n\n" +
        "**Referrer-Policy:**\n" +
        "- `strict-origin-when-cross-origin`: 같은 출처는 전체 경로, 다른 출처는 출처만\n" +
        "- `no-referrer`: Referer 헤더를 아예 보내지 않음\n\n" +
        "**Permissions-Policy:**\n" +
        "- `camera=(), microphone=(), geolocation=()`: 기능 사용 제한\n\n" +
        "**Strict-Transport-Security (HSTS):**\n" +
        "- `max-age=31536000; includeSubDomains`: 1년간 HTTPS 강제\n" +
        "- 브라우저가 HTTP 요청을 자동으로 HTTPS로 업그레이드",
    },
    {
      type: "pseudocode",
      title: "기술 구현: CSP 정책 빌더",
      content:
        "CSP 정책을 프로그래밍 방식으로 구성하고, 위반 보고를 처리하는 로직을 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          "// CSP 정책 빌더\n" +
          "interface CSPDirectives {\n" +
          "  'default-src': string[];\n" +
          "  'script-src': string[];\n" +
          "  'style-src': string[];\n" +
          "  'img-src': string[];\n" +
          "  'connect-src': string[];\n" +
          "  'font-src': string[];\n" +
          "  'frame-ancestors': string[];\n" +
          "  'report-uri'?: string[];  // 레거시, 하위 호환용\n" +
          "  'report-to'?: string[];   // 현대 표준 (Reporting API)\n" +
          "}\n" +
          "\n" +
          "class CSPBuilder {\n" +
          "  private directives: Partial<CSPDirectives> = {};\n" +
          "\n" +
          "  defaultSrc(...sources: string[]): CSPBuilder {\n" +
          "    this.directives['default-src'] = sources;\n" +
          "    return this;\n" +
          "  }\n" +
          "\n" +
          "  scriptSrc(...sources: string[]): CSPBuilder {\n" +
          "    this.directives['script-src'] = sources;\n" +
          "    return this;\n" +
          "  }\n" +
          "\n" +
          "  styleSrc(...sources: string[]): CSPBuilder {\n" +
          "    this.directives['style-src'] = sources;\n" +
          "    return this;\n" +
          "  }\n" +
          "\n" +
          "  connectSrc(...sources: string[]): CSPBuilder {\n" +
          "    this.directives['connect-src'] = sources;\n" +
          "    return this;\n" +
          "  }\n" +
          "\n" +
          "  frameAncestors(...sources: string[]): CSPBuilder {\n" +
          "    this.directives['frame-ancestors'] = sources;\n" +
          "    return this;\n" +
          "  }\n" +
          "\n" +
          "  build(): string {\n" +
          "    return Object.entries(this.directives)\n" +
          "      .map(([key, values]) => key + ' ' + (values as string[]).join(' '))\n" +
          "      .join('; ');\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// 사용 예시\n" +
          "const csp = new CSPBuilder()\n" +
          "  .defaultSrc(\"'self'\")\n" +
          "  .scriptSrc(\"'self'\", \"'nonce-abc123'\", 'https://cdn.example.com')\n" +
          "  .styleSrc(\"'self'\", \"'unsafe-inline'\")\n" +
          "  .connectSrc(\"'self'\", 'https://api.example.com')\n" +
          "  .frameAncestors(\"'none'\")\n" +
          "  .build();\n" +
          "\n" +
          "// 결과:\n" +
          "// default-src 'self'; script-src 'self' 'nonce-abc123'\n" +
          "// https://cdn.example.com; style-src 'self' 'unsafe-inline';\n" +
          "// connect-src 'self' https://api.example.com;\n" +
          "// frame-ancestors 'none'\n" +
          "\n" +
          "// CSP 위반 보고 엔드포인트 (서버 측)\n" +
          "interface CSPViolationReport {\n" +
          "  documentUri: string;       // 위반 발생 페이지\n" +
          "  violatedDirective: string; // 위반된 디렉티브\n" +
          "  blockedUri: string;        // 차단된 리소스 URI\n" +
          "  sourceFile: string;        // 위반 코드 파일\n" +
          "  lineNumber: number;        // 위반 코드 줄\n" +
          "}\n" +
          "\n" +
          "function handleCSPReport(report: CSPViolationReport): void {\n" +
          "  console.warn(\n" +
          "    'CSP 위반: ' + report.violatedDirective +\n" +
          "    ' / 차단: ' + report.blockedUri +\n" +
          "    ' / 페이지: ' + report.documentUri\n" +
          "  );\n" +
          "}",
        description: "CSP 빌더로 정책을 프로그래밍 방식으로 구성하고, report-to(현대 표준) 또는 report-uri(레거시, 하위 호환용)로 위반 사항을 모니터링할 수 있다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 보안 헤더 설정",
      content:
        "Next.js와 HTML meta 태그에서 보안 헤더를 설정하는 실습입니다.",
      code: {
        language: "typescript",
        code:
          "// 1. Next.js에서 보안 헤더 설정 (next.config.js)\n" +
          "const securityHeaders = [\n" +
          "  {\n" +
          "    key: 'Content-Security-Policy',\n" +
          "    value: [\n" +
          "      \"default-src 'self'\",\n" +
          "      \"script-src 'self' 'unsafe-eval' 'unsafe-inline'\", // 개발용, 프로덕션에서는 nonce 사용\n" +
          "      \"style-src 'self' 'unsafe-inline'\",\n" +
          "      \"img-src 'self' data: https:\",\n" +
          "      \"font-src 'self' https://fonts.gstatic.com\",\n" +
          "      \"connect-src 'self' https://api.example.com\",\n" +
          "      \"frame-ancestors 'none'\",\n" +
          "    ].join('; '),\n" +
          "  },\n" +
          "  {\n" +
          "    key: 'X-Frame-Options',\n" +
          "    value: 'DENY',\n" +
          "  },\n" +
          "  {\n" +
          "    key: 'X-Content-Type-Options',\n" +
          "    value: 'nosniff',\n" +
          "  },\n" +
          "  {\n" +
          "    key: 'Referrer-Policy',\n" +
          "    value: 'strict-origin-when-cross-origin',\n" +
          "  },\n" +
          "  {\n" +
          "    key: 'Permissions-Policy',\n" +
          "    value: 'camera=(), microphone=(), geolocation=()',\n" +
          "  },\n" +
          "  {\n" +
          "    key: 'Strict-Transport-Security',\n" +
          "    value: 'max-age=31536000; includeSubDomains',\n" +
          "  },\n" +
          "];\n" +
          "\n" +
          "// next.config.js headers() 설정\n" +
          "// async headers() {\n" +
          "//   return [{\n" +
          "//     source: '/(.*)',\n" +
          "//     headers: securityHeaders,\n" +
          "//   }];\n" +
          "// }\n" +
          "\n" +
          "// 2. nonce 기반 CSP (Next.js middleware)\n" +
          "function generateNonce(): string {\n" +
          "  const array = new Uint8Array(16);\n" +
          "  crypto.getRandomValues(array);\n" +
          "  return btoa(String.fromCharCode(...array));\n" +
          "}\n" +
          "\n" +
          "// middleware.ts에서 요청마다 새 nonce 생성\n" +
          "function createCSPWithNonce(): { nonce: string; csp: string } {\n" +
          "  const nonce = generateNonce();\n" +
          "  const csp = [\n" +
          "    \"default-src 'self'\",\n" +
          "    \"script-src 'self' 'nonce-\" + nonce + \"'\",\n" +
          "    \"style-src 'self' 'nonce-\" + nonce + \"'\",\n" +
          "    \"img-src 'self' data: https:\",\n" +
          "    \"connect-src 'self' https://api.example.com\",\n" +
          "  ].join('; ');\n" +
          "\n" +
          "  return { nonce, csp };\n" +
          "}\n" +
          "\n" +
          "// 3. HTML meta 태그로 CSP 설정 (서버 설정 불가 시)\n" +
          "// <meta http-equiv=\"Content-Security-Policy\"\n" +
          "//       content=\"default-src 'self'; script-src 'self'\" />\n" +
          "// 주의: meta 태그로는 frame-ancestors, report-uri 사용 불가\n" +
          "\n" +
          "// 4. CSP 위반 보고 설정\n" +
          "// Content-Security-Policy-Report-Only 헤더로\n" +
          "// 차단 없이 위반 사항만 보고 가능 (도입 초기에 유용)\n" +
          "// 참고: report-uri는 레거시이며 report-to(Reporting API)가 현대 표준입니다.\n" +
          "// 하위 호환을 위해 둘 다 지정하는 것이 권장됩니다.\n" +
          "const reportOnlyCSP =\n" +
          "  \"default-src 'self'; \" +\n" +
          "  \"report-uri /api/csp-report; \" +\n" +
          "  \"report-to csp-endpoint\";\n" +
          "\n" +
          "console.log('Report-Only CSP:', reportOnlyCSP);",
        description: "Next.js의 headers() 설정, nonce 기반 CSP, Report-Only 모드를 활용하여 단계적으로 보안 헤더를 도입한다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 보안 헤더 | 방어 대상 | 권장 설정 |\n" +
        "|-----------|-----------|----------|\n" +
        "| Content-Security-Policy | XSS, 데이터 주입 | default-src 'self' + 필요한 출처만 |\n" +
        "| X-Frame-Options | 클릭재킹 | DENY 또는 SAMEORIGIN |\n" +
        "| X-Content-Type-Options | MIME 스니핑 | nosniff |\n" +
        "| Referrer-Policy | 정보 노출 | strict-origin-when-cross-origin |\n" +
        "| Permissions-Policy | 기능 남용 | 불필요한 기능 비활성화 |\n" +
        "| HSTS | 다운그레이드 공격 | max-age=31536000; includeSubDomains |\n\n" +
        "**CSP 도입 전략:**\n" +
        "1. `Content-Security-Policy-Report-Only`로 시작하여 위반 사항 파악\n" +
        "2. 위반 사항 수정 후 실제 `Content-Security-Policy`로 전환\n" +
        "3. `'unsafe-inline'` 대신 nonce 또는 hash 기반으로 점진적 강화\n\n" +
        "**다음 챕터 미리보기:** 인증과 OAuth를 배우면서, 보안 헤더와 인증 흐름이 어떻게 협력하는지 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "CSP는 리소스 출처를 제한하여 XSS를 브라우저 수준에서 차단하는 가장 강력한 방어 수단이며, Report-Only 모드로 안전하게 도입할 수 있다.",
  checklist: [
    "CSP의 default-src, script-src, connect-src 디렉티브의 역할을 설명할 수 있다",
    "nonce 기반 CSP와 unsafe-inline의 차이를 이해한다",
    "X-Frame-Options, X-Content-Type-Options의 역할을 알고 있다",
    "HSTS가 다운그레이드 공격을 방지하는 원리를 설명할 수 있다",
    "Content-Security-Policy-Report-Only를 활용한 단계적 도입 전략을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "CSP에서 'unsafe-inline' 대신 사용할 수 있는 더 안전한 방법은?",
      choices: [
        "unsafe-eval",
        "nonce 또는 hash 기반 허용",
        "default-src *",
        "X-Frame-Options",
      ],
      correctIndex: 1,
      explanation: "nonce는 요청마다 생성되는 랜덤 값으로, 해당 nonce를 가진 스크립트만 실행을 허용합니다. hash는 스크립트 내용의 해시와 일치할 때만 실행을 허용합니다. 둘 다 unsafe-inline보다 안전합니다.",
    },
    {
      id: "q2",
      question: "X-Content-Type-Options: nosniff의 역할은?",
      choices: [
        "쿠키 전송을 차단한다",
        "브라우저가 Content-Type을 무시하고 파일 내용으로 타입을 추측하는 것을 방지한다",
        "JavaScript 실행을 차단한다",
        "HTTPS를 강제한다",
      ],
      correctIndex: 1,
      explanation: "MIME 스니핑은 브라우저가 서버의 Content-Type 헤더를 무시하고 파일 내용으로 타입을 추측하는 것입니다. nosniff를 설정하면 서버가 지정한 Content-Type만 사용하므로, 악성 파일이 스크립트로 실행되는 것을 방지합니다.",
    },
    {
      id: "q3",
      question: "Content-Security-Policy-Report-Only 헤더의 용도는?",
      choices: [
        "CSP 위반 시 즉시 리소스를 차단한다",
        "CSP 위반 사항을 보고만 하고 실제 차단은 하지 않는다",
        "보안 헤더를 모두 비활성화한다",
        "HTTPS 연결을 보고만 한다",
      ],
      correctIndex: 1,
      explanation: "Report-Only 모드는 CSP 위반 사항을 보고하지만 실제로 리소스를 차단하지는 않습니다. CSP를 처음 도입할 때 기존 기능을 깨뜨리지 않으면서 어떤 위반이 있는지 파악하는 데 유용합니다.",
    },
    {
      id: "q4",
      question: "HSTS(Strict-Transport-Security)의 includeSubDomains 옵션의 의미는?",
      choices: [
        "서브도메인을 차단한다",
        "서브도메인에도 HTTPS 강제를 적용한다",
        "서브도메인의 쿠키를 공유한다",
        "서브도메인의 CSP를 상속한다",
      ],
      correctIndex: 1,
      explanation: "includeSubDomains 옵션은 HSTS 정책을 현재 도메인뿐만 아니라 모든 서브도메인에도 적용합니다. 예를 들어 example.com에 설정하면 api.example.com, cdn.example.com 등도 HTTPS가 강제됩니다.",
    },
    {
      id: "q5",
      question: "HTML meta 태그로 CSP를 설정할 때의 제약은?",
      choices: [
        "script-src를 설정할 수 없다",
        "frame-ancestors와 report-uri를 사용할 수 없다",
        "default-src를 설정할 수 없다",
        "style-src를 설정할 수 없다",
      ],
      correctIndex: 1,
      explanation: "HTML meta 태그의 http-equiv로 설정하는 CSP에서는 frame-ancestors, report-uri, sandbox 디렉티브를 사용할 수 없습니다. 이런 디렉티브가 필요하면 반드시 HTTP 응답 헤더로 설정해야 합니다.",
    },
  ],
};

export default chapter;
