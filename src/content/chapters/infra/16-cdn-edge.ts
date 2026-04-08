import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "16-cdn-edge",
  subject: "infra",
  title: "CDN과 엣지 컴퓨팅",
  description:
    "CDN의 동작 원리, 캐시 전략, 엣지 컴퓨팅 개념, Edge Functions과 Serverless의 차이를 학습합니다.",
  order: 16,
  group: "배포와 클라우드",
  prerequisites: ["15-aws-basics"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "CDN과 엣지 컴퓨팅을 **편의점 프랜차이즈**로 이해해봅시다.\n\n" +
        "**오리진 서버**는 본사 물류 창고입니다. 모든 상품의 원본이 여기에 있습니다. 하지만 서울 고객이 부산 창고에서 직접 가져오면 시간이 오래 걸립니다.\n\n" +
        "**CDN의 PoP(Point of Presence)**는 동네 편의점입니다. 본사 창고에서 인기 상품을 미리 가져다 진열(캐시)해두면, 고객은 가장 가까운 편의점에서 바로 구매할 수 있습니다. 전 세계에 수백 개의 편의점이 있습니다.\n\n" +
        "**Cache-Control 헤더**는 상품의 유통기한 라벨입니다. `max-age=3600`은 \"1시간 동안 신선합니다\"라는 뜻입니다. 유통기한이 지나면 본사 창고에서 새 상품을 가져옵니다.\n\n" +
        "**ETag**는 상품의 로트 번호입니다. 편의점에서 \"이 로트 번호 상품 아직 최신인가요?\"라고 본사에 물어보면, 본사가 \"네, 그대로입니다\" 또는 \"아뇨, 새 것 보내드립니다\"라고 답합니다.\n\n" +
        "**엣지 컴퓨팅**은 편의점에 조리 시설을 두는 것입니다. 단순히 진열된 상품을 파는 것(CDN)을 넘어, 편의점에서 직접 도시락을 만들어(동적 로직 실행) 판매합니다. 본사 창고까지 갈 필요가 없으니 훨씬 빠릅니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "정적 자산과 동적 콘텐츠의 전송에서 발생하는 성능 문제들입니다.\n\n" +
        "1. **물리적 거리** — 서울에 있는 오리진 서버에서 미국 사용자에게 응답하면 왕복 200ms 이상이 걸립니다. 아무리 서버가 빨라도 빛의 속도를 이길 수 없습니다.\n\n" +
        "2. **캐시 전략의 복잡성** — 어떤 파일은 1년간 캐시해도 되고(해시가 포함된 JS 번들), 어떤 파일은 항상 최신이어야 합니다(index.html). 잘못된 캐시 전략은 사용자가 구버전을 보거나 서버에 불필요한 부하를 줍니다.\n\n" +
        "3. **캐시 무효화** — 긴급 핫픽스를 배포했는데, CDN에 이전 버전이 캐시되어 있으면 사용자가 버그를 계속 경험합니다. \"캐시 무효화\"가 필요하지만, 전 세계 PoP에 전파되는 데 시간이 걸립니다.\n\n" +
        "4. **동적 콘텐츠의 지연** — CDN은 정적 파일에 최적화되어 있습니다. 사용자 맞춤 콘텐츠(로그인 상태, 지역 기반 가격)는 매번 오리진 서버까지 가야 합니다. 이 지연을 줄일 방법이 필요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "CDN 캐시 전략과 엣지 컴퓨팅으로 성능 문제를 해결합니다.\n\n" +
        "### 캐시 헤더 전략\n" +
        "**Cache-Control**이 핵심입니다:\n" +
        "- `public, max-age=31536000, immutable` — 해시가 포함된 정적 자산(app.a1b2c3.js). 파일명이 바뀌므로 1년 캐시 가능\n" +
        "- `no-cache` — 항상 서버에 확인 후 사용(index.html). 이름은 no-cache지만 캐시를 저장은 합니다\n" +
        "- `no-store` — 절대 캐시하지 않음(민감 데이터)\n" +
        "- `stale-while-revalidate` — 만료된 캐시를 먼저 보여주고, 백그라운드에서 갱신\n\n" +
        "**ETag**와 **Last-Modified**는 조건부 요청에 사용됩니다. 서버가 304 Not Modified를 응답하면 본문 전송 없이 캐시를 재사용합니다.\n\n" +
        "### CDN 무효화(Invalidation)\n" +
        "긴급 배포 시 CDN 캐시를 수동으로 삭제합니다. CloudFront는 `create-invalidation`으로, Cloudflare는 API나 대시보드에서 퍼지합니다. 하지만 무효화는 느리고 비용이 듭니다. 근본 해결책은 **파일명에 해시를 포함하여 캐시 버스팅**을 하는 것입니다.\n\n" +
        "### 엣지 컴퓨팅\n" +
        "Edge Functions는 CDN의 PoP에서 JavaScript를 실행합니다:\n" +
        "- **Cloudflare Workers** — V8 isolate 기반, 콜드 스타트 거의 없음\n" +
        "- **Vercel Edge Functions** — Next.js Middleware에서 사용\n" +
        "- 사용 사례: A/B 테스트, 지역별 리다이렉트, 인증 토큰 검증, 개인화\n\n" +
        "### Edge vs Serverless\n" +
        "- **Serverless(Lambda):** 특정 리전에서 실행, 콜드 스타트 있음, 무거운 작업 가능\n" +
        "- **Edge Functions:** 전 세계 PoP에서 실행, 콜드 스타트 최소, 가벼운 작업에 최적",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 캐시 전략 설계",
      content:
        "실무에서 사용하는 프론트엔드 앱의 캐시 전략을 의사코드로 설계합니다.",
      code: {
        language: "typescript",
        code:
          '// 프론트엔드 앱의 캐시 전략 설계\n' +
          '\n' +
          '// === 파일 유형별 캐시 정책 ===\n' +
          '\n' +
          '// 1. HTML (진입점) — 항상 최신 확인\n' +
          '// Cache-Control: no-cache\n' +
          '// 이유: HTML이 최신이어야 새 JS 번들을 참조함\n' +
          '\n' +
          '// 2. JS/CSS 번들 (해시 포함) — 영구 캐시\n' +
          '// Cache-Control: public, max-age=31536000, immutable\n' +
          '// 예: app.a1b2c3.js → 내용이 바뀌면 해시가 바뀜\n' +
          '// 이유: 파일명 자체가 버전이므로 안전하게 1년 캐시\n' +
          '\n' +
          '// 3. 이미지/폰트 — 장기 캐시\n' +
          '// Cache-Control: public, max-age=2592000 (30일)\n' +
          '// 이유: 자주 변경되지 않지만, 해시가 없을 수 있음\n' +
          '\n' +
          '// 4. API 응답 — 짧은 캐시 또는 no-store\n' +
          '// Cache-Control: private, max-age=60\n' +
          '// 또는: Cache-Control: no-store (민감 데이터)\n' +
          '\n' +
          '// === CDN 요청 흐름 ===\n' +
          'function handleRequest(request) {\n' +
          '  const cachedResponse = CDN_PoP.lookup(request.url);\n' +
          '  \n' +
          '  if (cachedResponse && !cachedResponse.isExpired()) {\n' +
          '    return cachedResponse;  // Cache HIT → 즉시 응답\n' +
          '  }\n' +
          '  \n' +
          '  if (cachedResponse && cachedResponse.hasETag()) {\n' +
          '    // 조건부 요청: "이거 아직 유효한가요?"\n' +
          '    const validation = origin.validate(cachedResponse.etag);\n' +
          '    if (validation === "304 Not Modified") {\n' +
          '      cachedResponse.refreshTTL();\n' +
          '      return cachedResponse;  // 본문 전송 없이 재사용\n' +
          '    }\n' +
          '  }\n' +
          '  \n' +
          '  // Cache MISS → 오리진에서 가져옴\n' +
          '  const freshResponse = origin.fetch(request.url);\n' +
          '  CDN_PoP.store(request.url, freshResponse);\n' +
          '  return freshResponse;\n' +
          '}',
        description:
          "HTML은 no-cache, 해시가 포함된 정적 자산은 immutable, API는 상황에 맞게 설정합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Edge Function 활용",
      content:
        "Cloudflare Workers와 Vercel Edge Functions를 사용한 실전 엣지 컴퓨팅 예제입니다.",
      code: {
        language: "typescript",
        code:
          '// === Cloudflare Workers: 지역별 리다이렉트 ===\n' +
          'export default {\n' +
          '  async fetch(request: Request): Promise<Response> {\n' +
          '    const country = request.headers.get("CF-IPCountry");\n' +
          '    \n' +
          '    // 사용자 위치 기반 리다이렉트\n' +
          '    if (country === "KR") {\n' +
          '      return Response.redirect("https://kr.example.com", 302);\n' +
          '    }\n' +
          '    if (country === "JP") {\n' +
          '      return Response.redirect("https://jp.example.com", 302);\n' +
          '    }\n' +
          '    \n' +
          '    return fetch(request); // 오리진으로 전달\n' +
          '  },\n' +
          '};\n' +
          '\n' +
          '// === Vercel Edge Middleware: A/B 테스트 ===\n' +
          '// middleware.ts\n' +
          'import { NextResponse } from "next/server";\n' +
          'import type { NextRequest } from "next/server";\n' +
          '\n' +
          'export function middleware(request: NextRequest) {\n' +
          '  // 쿠키로 기존 그룹 확인\n' +
          '  const bucket = request.cookies.get("ab-test")?.value;\n' +
          '  \n' +
          '  if (!bucket) {\n' +
          '    // 50:50 랜덤 배정\n' +
          '    const group = Math.random() < 0.5 ? "control" : "variant";\n' +
          '    const response = NextResponse.rewrite(\n' +
          '      new URL(`/${group}${request.nextUrl.pathname}`, request.url)\n' +
          '    );\n' +
          '    response.cookies.set("ab-test", group, { maxAge: 86400 });\n' +
          '    return response;\n' +
          '  }\n' +
          '  \n' +
          '  return NextResponse.rewrite(\n' +
          '    new URL(`/${bucket}${request.nextUrl.pathname}`, request.url)\n' +
          '  );\n' +
          '}',
        description:
          "Edge Functions로 지역별 리다이렉트와 A/B 테스트를 오리진 서버 없이 처리합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "CDN과 엣지 컴퓨팅의 핵심 개념 정리입니다.\n\n" +
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| CDN | 정적 자산을 전 세계 PoP에 캐시하여 가까운 서버에서 제공 |\n" +
        "| Cache-Control | 캐시 정책을 지정하는 HTTP 헤더 |\n" +
        "| ETag | 리소스 버전을 식별하여 조건부 요청에 사용 |\n" +
        "| 캐시 버스팅 | 파일명에 해시를 포함하여 변경 시 새 URL 생성 |\n" +
        "| CDN Invalidation | 긴급 시 캐시를 수동으로 삭제 |\n" +
        "| Edge Functions | CDN PoP에서 동적 로직 실행 |\n" +
        "| Edge vs Serverless | Edge는 빠르고 가볍고, Serverless는 강력하고 유연함 |\n\n" +
        "**실무 캐시 전략 공식:**\n" +
        "- `index.html` → `no-cache` (항상 검증)\n" +
        "- `app.[hash].js` → `immutable, max-age=1년` (영구 캐시)\n" +
        "- API 응답 → `private, max-age=짧게` 또는 `no-store`\n\n" +
        "**핵심:** \"캐시 무효화와 이름 짓기는 컴퓨터 과학에서 가장 어려운 두 가지 문제\"라는 농담이 있을 만큼, 캐시 전략은 신중하게 설계해야 합니다. 파일명 해시가 가장 안전한 캐시 버스팅 방법입니다.\n\n" +
        "**다음 챕터 미리보기:** 배포 후 서비스가 잘 동작하는지 어떻게 확인할까? 모니터링과 에러 트래킹을 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "CDN은 정적 자산을 전 세계 PoP에 캐시하여 사용자에게 가장 가까운 서버에서 제공한다. 엣지 컴퓨팅은 한 단계 더 나아가 동적 로직까지 사용자 근처에서 실행한다.",
  checklist: [
    "CDN의 동작 원리(오리진 → PoP → 사용자)를 설명할 수 있다",
    "Cache-Control 헤더의 주요 디렉티브를 이해하고 적용할 수 있다",
    "파일 유형별 적절한 캐시 전략을 설계할 수 있다",
    "Edge Functions와 Serverless의 차이를 설명할 수 있다",
    "캐시 버스팅의 필요성과 해시 기반 파일명의 원리를 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "Cache-Control: no-cache의 의미로 올바른 것은?",
      choices: [
        "캐시를 절대 저장하지 않는다",
        "캐시를 저장하되, 사용 전에 서버에 유효성을 확인한다",
        "캐시를 영구적으로 저장한다",
        "CDN에서만 캐시한다",
      ],
      correctIndex: 1,
      explanation:
        "no-cache는 이름과 달리 캐시를 저장합니다. 다만 사용 전에 항상 서버에 유효성 검증(revalidation)을 요청합니다. 캐시를 아예 저장하지 않으려면 no-store를 사용합니다.",
    },
    {
      id: "q2",
      question:
        "해시가 포함된 정적 파일(app.a1b2c3.js)에 가장 적절한 Cache-Control 값은?",
      choices: [
        "no-cache",
        "no-store",
        "public, max-age=31536000, immutable",
        "private, max-age=3600",
      ],
      correctIndex: 2,
      explanation:
        "파일명에 콘텐츠 해시가 포함되어 있으므로, 내용이 바뀌면 URL 자체가 바뀝니다. 따라서 안전하게 1년(31536000초) 동안 캐시할 수 있습니다.",
    },
    {
      id: "q3",
      question:
        "Edge Functions과 Serverless Functions(Lambda)의 가장 큰 차이점은?",
      choices: [
        "사용하는 프로그래밍 언어",
        "실행 위치 — Edge는 전 세계 PoP, Serverless는 특정 리전",
        "비용 구조",
        "사용 가능한 라이브러리 수",
      ],
      correctIndex: 1,
      explanation:
        "Edge Functions은 전 세계 CDN PoP에서 실행되어 사용자와 가깝고, Serverless는 특정 리전의 데이터센터에서 실행됩니다. 이 차이가 응답 속도에 직접적인 영향을 미칩니다.",
    },
    {
      id: "q4",
      question:
        "서버가 304 Not Modified를 응답하는 상황은?",
      choices: [
        "요청한 리소스가 존재하지 않을 때",
        "클라이언트의 ETag와 서버의 ETag가 일치할 때",
        "캐시가 만료되었을 때",
        "서버에 오류가 발생했을 때",
      ],
      correctIndex: 1,
      explanation:
        "클라이언트가 If-None-Match 헤더에 ETag를 보내고, 서버의 리소스가 변경되지 않았으면(ETag 일치) 304를 응답합니다. 본문 없이 캐시를 재사용하므로 대역폭을 절약합니다.",
    },
    {
      id: "q5",
      question:
        "CDN 캐시 무효화(Invalidation) 대신 권장되는 방법은?",
      choices: [
        "TTL을 0으로 설정",
        "모든 파일에 no-store 적용",
        "파일명에 콘텐츠 해시를 포함하여 캐시 버스팅",
        "CDN을 비활성화",
      ],
      correctIndex: 2,
      explanation:
        "파일명에 해시를 포함하면(app.a1b2c3.js), 내용이 바뀔 때 URL도 자동으로 바뀝니다. CDN은 새 URL에 대해 오리진에서 새로 가져오므로, 별도의 무효화가 필요 없습니다.",
    },
  ],
};

export default chapter;
