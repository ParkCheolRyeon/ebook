import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "14-deployment-platforms",
  subject: "infra",
  title: "배포 플랫폼 비교",
  description:
    "Vercel, Netlify, Cloudflare Pages, AWS Amplify 등 주요 프론트엔드 배포 플랫폼의 특징과 선택 기준을 비교합니다.",
  order: 14,
  group: "배포와 클라우드",
  prerequisites: ["13-github-actions"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "배포 플랫폼을 고르는 것은 **식당 입지를 선택하는 것**과 같습니다.\n\n" +
        "**Vercel**은 Next.js 전문 셰프가 운영하는 레스토랑입니다. Next.js로 요리하면 최고의 맛(성능)을 보장하고, 프리뷰 배포는 시식 메뉴처럼 본 서비스 전에 미리 맛볼 수 있습니다. Edge Functions는 각 지역 지점에서 즉석 요리를 해주는 것과 같습니다.\n\n" +
        "**Netlify**는 만능 푸드코트입니다. 정적 사이트부터 서버리스 함수까지 다양한 메뉴를 제공하고, Forms나 Identity 같은 사이드 메뉴도 풍부합니다.\n\n" +
        "**Cloudflare Pages**는 전 세계 체인 패스트푸드점입니다. 어디서든 가장 가까운 매장(Edge)에서 빠르게 서빙합니다. Workers는 각 매장에서 주문 즉시 조리하는 시스템입니다.\n\n" +
        "**AWS Amplify**는 대형 백화점 푸드홀입니다. AWS라는 거대한 백화점 안에 있어서, 다른 매장(S3, Lambda, DynamoDB)과 연계가 자유롭습니다.\n\n" +
        "**Railway/Render**는 컨테이너 배달 서비스입니다. 도시락(컨테이너)을 만들어 보내면, 플랫폼이 알아서 배달합니다. 프론트엔드뿐 아니라 백엔드 서버도 함께 배포할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 앱을 배포하려 할 때 마주하는 선택의 어려움입니다.\n\n" +
        "1. **플랫폼 과잉** — Vercel, Netlify, Cloudflare, AWS, GCP, Railway, Render... 선택지가 너무 많습니다. 각각의 장단점을 파악하는 데만 시간이 걸립니다.\n\n" +
        "2. **프레임워크 종속** — Next.js는 Vercel에서, Gatsby는 Netlify에서 최적화된다는 말이 있지만, 실제로 어디까지 차이가 나는지 불명확합니다.\n\n" +
        "3. **비용 예측 어려움** — 무료 티어로 시작하기는 쉽지만, 트래픽이 늘면 비용이 어떻게 변하는지 예측하기 어렵습니다. 특히 서버리스 함수 실행 비용은 사용량 기반이라 예측이 더 어렵습니다.\n\n" +
        "4. **확장 가능성** — 사이드 프로젝트로 시작했지만, 성장하면 플랫폼 이전이 필요한 상황이 올 수 있습니다. Lock-in 없이 시작하려면 어떤 기준으로 골라야 할까요?",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "각 플랫폼의 핵심 특징과 최적 사용 시나리오를 정리합니다.\n\n" +
        "### Vercel\n" +
        "Next.js를 만든 회사답게 Next.js 최적화가 압도적입니다. ISR, Server Components, Edge Runtime을 네이티브로 지원합니다. PR마다 프리뷰 URL이 자동 생성되어 코드 리뷰에 편리합니다. Nuxt, SvelteKit, Astro, Remix 등 다른 프레임워크도 공식 지원하지만 Next.js에 가장 최적화되어 있으며, 팀 규모가 커지면 비용이 빠르게 올라갑니다.\n\n" +
        "### Netlify\n" +
        "정적 사이트 배포의 원조입니다. Netlify Functions(서버리스), Forms(폼 처리), Identity(인증)를 자체 제공하여 백엔드 없이 풀스택 기능을 구현할 수 있습니다. Astro, Hugo, Gatsby 등 다양한 정적 사이트 생성기와 궁합이 좋습니다.\n\n" +
        "### Cloudflare Pages\n" +
        "Edge 성능이 최강입니다. Cloudflare의 글로벌 네트워크(300+ PoP)를 활용하여 전 세계 어디서든 빠른 응답을 제공합니다. Workers와 결합하면 Edge에서 동적 로직을 실행할 수 있습니다. 대역폭 무제한이라 트래픽 비용 걱정이 적습니다.\n\n" +
        "### AWS Amplify\n" +
        "AWS 생태계와 통합이 필요한 경우 최선의 선택입니다. Cognito(인증), AppSync(GraphQL), S3(스토리지) 등 AWS 서비스와 자연스럽게 연결됩니다. 단, 설정이 복잡하고 학습 곡선이 있습니다.\n\n" +
        "### Railway / Render\n" +
        "컨테이너 기반으로 프론트엔드와 백엔드를 함께 배포할 수 있습니다. Dockerfile만 있으면 어떤 언어든 배포 가능합니다. 데이터베이스도 한 플랫폼에서 관리할 수 있어 풀스택 프로젝트에 편리합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 플랫폼 선택 의사결정 트리",
      content:
        "프로젝트 특성에 따른 배포 플랫폼 선택 로직을 의사코드로 표현합니다.",
      code: {
        language: "typescript",
        code:
          '// 배포 플랫폼 선택 의사결정 트리\n' +
          '\n' +
          'function choosePlatform(project: ProjectInfo): Platform {\n' +
          '  // 1단계: 프레임워크 기반 1차 필터\n' +
          '  if (project.framework === "Next.js") {\n' +
          '    // Next.js App Router, Server Components 사용 시\n' +
          '    return "Vercel";  // 네이티브 지원, 최고 성능\n' +
          '  }\n' +
          '\n' +
          '  // 2단계: 사이트 유형 기반\n' +
          '  if (project.type === "static-site") {\n' +
          '    if (project.needsGlobalPerformance) {\n' +
          '      return "Cloudflare Pages";  // 대역폭 무제한 + Edge\n' +
          '    }\n' +
          '    if (project.needsBuiltInFeatures) {\n' +
          '      return "Netlify";  // Forms, Identity 내장\n' +
          '    }\n' +
          '  }\n' +
          '\n' +
          '  // 3단계: 인프라 요구사항 기반\n' +
          '  if (project.needsAWSIntegration) {\n' +
          '    return "AWS Amplify";  // Cognito, DynamoDB 등 연동\n' +
          '  }\n' +
          '\n' +
          '  if (project.hasCustomBackend || project.needsDatabase) {\n' +
          '    return "Railway or Render";  // 컨테이너 + DB\n' +
          '  }\n' +
          '\n' +
          '  // 4단계: 비용 기반 (사이드 프로젝트)\n' +
          '  if (project.budget === "free") {\n' +
          '    // 모두 무료 티어 제공, 하지만:\n' +
          '    // Cloudflare: 대역폭 무제한\n' +
          '    // Vercel: 빌드 시간 6000분/월\n' +
          '    // Netlify: 대역폭 100GB/월\n' +
          '    return "상황에 맞게 선택";\n' +
          '  }\n' +
          '}',
        description:
          "프레임워크 → 사이트 유형 → 인프라 요구사항 → 비용 순서로 플랫폼을 좁혀갑니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 각 플랫폼 배포 설정",
      content:
        "같은 프로젝트를 각 플랫폼에 배포할 때의 핵심 설정 차이를 비교합니다.",
      code: {
        language: "typescript",
        code:
          '// === Vercel: vercel.json ===\n' +
          '// {\n' +
          '//   "framework": "nextjs",\n' +
          '//   "buildCommand": "npm run build",\n' +
          '//   "outputDirectory": ".next",\n' +
          '//   "regions": ["icn1"],  // 서울 리전 지정\n' +
          '//   "crons": [{ "path": "/api/cron", "schedule": "0 * * * *" }]\n' +
          '// }\n' +
          '\n' +
          '// === Netlify: netlify.toml ===\n' +
          '// [build]\n' +
          '//   command = "npm run build"\n' +
          '//   publish = "dist"\n' +
          '// [[redirects]]\n' +
          '//   from = "/*"\n' +
          '//   to = "/index.html"\n' +
          '//   status = 200  # SPA 라우팅 처리\n' +
          '\n' +
          '// === Cloudflare Pages: wrangler.toml ===\n' +
          '// name = "my-app"\n' +
          '// compatibility_date = "2024-01-01"\n' +
          '// pages_build_output_dir = "./dist"\n' +
          '\n' +
          '// === AWS Amplify: amplify.yml ===\n' +
          '// version: 1\n' +
          '// frontend:\n' +
          '//   phases:\n' +
          '//     preBuild:\n' +
          '//       commands: [npm ci]\n' +
          '//     build:\n' +
          '//       commands: [npm run build]\n' +
          '//   artifacts:\n' +
          '//     baseDirectory: dist\n' +
          '//     files: ["**/*"]',
        description:
          "각 플랫폼마다 설정 파일 형식과 위치가 다르지만, 핵심은 빌드 명령과 출력 디렉토리 지정입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "프론트엔드 배포 플랫폼 비교 요약입니다.\n\n" +
        "| 플랫폼 | 최적 사용처 | 강점 | 주의점 |\n" +
        "|--------|-----------|------|--------|\n" +
        "| Vercel | Next.js 앱 | SSR/ISR 최적화, 프리뷰 배포 | 팀 비용 증가 |\n" +
        "| Netlify | 정적 사이트 | Forms/Identity 내장 | 서버리스 성능 |\n" +
        "| Cloudflare | Edge 중심 앱 | 대역폭 무제한, 글로벌 성능 | 생태계 작음 |\n" +
        "| AWS Amplify | AWS 통합 필요 | AWS 서비스 연동 | 복잡한 설정 |\n" +
        "| Railway/Render | 풀스택 앱 | 컨테이너+DB 통합 | Edge 지원 약함 |\n\n" +
        "**핵심 선택 기준:**\n" +
        "- **프레임워크:** Next.js → Vercel, 정적 사이트 → Netlify/Cloudflare\n" +
        "- **비용:** 대역폭 걱정 → Cloudflare, 무료 시작 → 모두 가능\n" +
        "- **확장성:** AWS 생태계 → Amplify, 커스텀 서버 → Railway/Render\n\n" +
        "하나의 정답은 없습니다. 프로젝트 요구사항, 팀 규모, 예산에 맞는 플랫폼을 선택하되, 특정 플랫폼에 과도하게 종속되지 않도록 표준 기술 기반으로 구축하세요.\n\n" +
        "**다음 챕터 미리보기:** 가장 범용적인 클라우드 플랫폼인 AWS의 핵심 서비스를 프론트엔드 관점에서 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Vercel은 Next.js에 최적화, Netlify는 정적 사이트에 강하고, Cloudflare Pages는 Edge 성능이 뛰어나다. 프레임워크, 비용, 확장 요구사항에 따라 선택하라.",
  checklist: [
    "Vercel, Netlify, Cloudflare Pages의 핵심 차이를 설명할 수 있다",
    "프로젝트 특성에 맞는 배포 플랫폼을 선택할 수 있다",
    "각 플랫폼의 무료 티어 한도와 비용 구조를 이해한다",
    "SPA 배포 시 필요한 라우팅 설정을 구성할 수 있다",
    "프리뷰 배포의 장점과 활용 방법을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "Next.js App Router의 Server Components를 네이티브로 지원하는 배포 플랫폼은?",
      choices: ["Netlify", "Vercel", "Cloudflare Pages", "Railway"],
      correctIndex: 1,
      explanation:
        "Vercel은 Next.js를 만든 회사로, App Router와 Server Components를 포함한 모든 Next.js 기능을 네이티브로 최적화하여 지원합니다.",
    },
    {
      id: "q2",
      question:
        "대역폭 비용 걱정 없이 정적 사이트를 배포하기에 가장 적합한 플랫폼은?",
      choices: ["Vercel", "AWS Amplify", "Cloudflare Pages", "Render"],
      correctIndex: 2,
      explanation:
        "Cloudflare Pages는 대역폭이 무제한 무료입니다. 트래픽이 급증해도 대역폭으로 인한 추가 비용이 발생하지 않습니다.",
    },
    {
      id: "q3",
      question:
        "백엔드 서버와 데이터베이스를 프론트엔드와 함께 한 플랫폼에서 배포하려면?",
      choices: [
        "Vercel",
        "Netlify",
        "Cloudflare Pages",
        "Railway 또는 Render",
      ],
      correctIndex: 3,
      explanation:
        "Railway와 Render는 컨테이너 기반으로 프론트엔드, 백엔드, 데이터베이스를 모두 한 플랫폼에서 관리할 수 있습니다.",
    },
    {
      id: "q4",
      question:
        "Netlify가 자체 제공하는 기능이 아닌 것은?",
      choices: ["Forms", "Identity", "Edge Functions", "Cognito"],
      correctIndex: 3,
      explanation:
        "Cognito는 AWS의 인증 서비스입니다. Netlify는 Forms(폼 처리), Identity(인증), Edge Functions를 자체 제공합니다.",
    },
    {
      id: "q5",
      question:
        "SPA를 Netlify에 배포할 때 netlify.toml에 리다이렉트 설정이 필요한 이유는?",
      choices: [
        "SEO 최적화를 위해",
        "클라이언트 라우팅 시 404를 방지하기 위해",
        "빌드 속도를 높이기 위해",
        "캐시를 무효화하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "SPA는 클라이언트에서 라우팅을 처리하므로, /about 같은 경로로 직접 접근하면 서버에서 404가 됩니다. 모든 경로를 index.html로 리다이렉트해야 합니다.",
    },
  ],
};

export default chapter;
