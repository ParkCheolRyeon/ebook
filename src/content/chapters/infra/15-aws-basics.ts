import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "15-aws-basics",
  subject: "infra",
  title: "AWS 핵심 서비스",
  description:
    "프론트엔드 개발자가 알아야 할 AWS 핵심 서비스 — S3, CloudFront, Route 53, Lambda, API Gateway, IAM을 학습합니다.",
  order: 15,
  group: "배포와 클라우드",
  prerequisites: ["14-deployment-platforms"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "AWS는 **거대한 레고 창고**입니다. 필요한 블록만 꺼내 조립하면 됩니다.\n\n" +
        "**S3(Simple Storage Service)**는 무한히 큰 파일 캐비닛입니다. HTML, CSS, JS, 이미지를 넣어두면 웹사이트로 서빙할 수 있습니다. 서랍(버킷)별로 정리하고, 각 서랍에 자물쇠(정책)를 걸 수 있습니다.\n\n" +
        "**CloudFront**는 전 세계에 분산된 편의점 체인입니다. S3 본사 창고에서 물건(파일)을 가져와 각 지역 편의점(PoP)에 진열해둡니다. 사용자는 가장 가까운 편의점에서 물건을 받습니다.\n\n" +
        "**Route 53**은 전화번호부(DNS)입니다. 'example.com'이라는 이름을 CloudFront의 실제 주소로 연결해줍니다.\n\n" +
        "**Lambda**는 자판기입니다. 동전(요청)을 넣으면 음료(응답)가 나옵니다. 사용하지 않을 때는 전기도 안 쓰고, 사용한 만큼만 비용을 냅니다. 서버를 관리할 필요가 없습니다.\n\n" +
        "**IAM**은 건물 출입 카드 시스템입니다. 누가(User), 어디에(Resource), 무엇을(Action) 할 수 있는지 세밀하게 제어합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 개발자가 AWS를 접할 때 마주하는 어려움입니다.\n\n" +
        "1. **서비스 과잉** — AWS에는 200개 이상의 서비스가 있습니다. 프론트엔드 개발자에게 진짜 필요한 서비스가 무엇인지 파악하기 어렵습니다.\n\n" +
        "2. **IAM 복잡성** — 권한 설정을 잘못하면 보안 사고가 나고, 너무 제한하면 아무것도 동작하지 않습니다. Policy, Role, User의 관계가 혼란스럽습니다.\n\n" +
        "3. **비용 공포** — \"AWS 청구서 폭탄\"은 개발자 커뮤니티의 단골 공포 이야기입니다. 프리 티어 한도를 넘기면 예상치 못한 비용이 발생할 수 있습니다.\n\n" +
        "4. **SPA 배포의 함정** — S3에 SPA를 올리면 새로고침 시 404가 뜹니다. CloudFront의 에러 페이지 설정을 몰라서 삽질하는 일이 빈번합니다.\n\n" +
        "5. **서버리스 디버깅** — Lambda 함수에서 문제가 발생하면 로컬에서 재현하기 어렵고, CloudWatch 로그를 찾아 헤매게 됩니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "프론트엔드 개발자가 알아야 할 핵심 서비스와 실무 패턴을 정리합니다.\n\n" +
        "### S3 — 정적 호스팅의 기본\n" +
        "S3 버킷을 '정적 웹사이트 호스팅'으로 설정하면 HTML/CSS/JS를 서빙할 수 있습니다. 하지만 S3 직접 접근 대신 CloudFront를 앞에 두는 것이 표준입니다. HTTPS 지원, 캐싱, 커스텀 도메인을 모두 해결합니다.\n\n" +
        "### CloudFront — CDN + HTTPS\n" +
        "S3를 오리진으로 설정하고, ACM(Certificate Manager)으로 무료 SSL 인증서를 발급받아 HTTPS를 적용합니다. SPA의 새로고침 404 문제는 커스텀 에러 응답에서 403/404를 모두 `/index.html`로 리다이렉트하여 해결합니다.\n\n" +
        "### Route 53 — DNS 관리\n" +
        "도메인을 구매하거나 외부 도메인을 가져와 CloudFront 배포와 연결합니다. A 레코드 Alias를 사용하면 CloudFront 도메인을 직접 가리킬 수 있습니다.\n\n" +
        "### Lambda — 서버리스 API\n" +
        "API Gateway + Lambda 조합으로 서버 없이 API를 만들 수 있습니다. Node.js 런타임을 지원하므로 프론트엔드 개발자에게 진입 장벽이 낮습니다. 콜드 스타트를 줄이려면 번들 크기를 최소화하고, Provisioned Concurrency를 고려하세요.\n\n" +
        "### IAM — 최소 권한 원칙\n" +
        "루트 계정은 절대 일상적으로 사용하지 마세요. IAM User를 만들고, 필요한 권한만 Policy로 부여합니다. 실수로 Access Key를 GitHub에 올리면 몇 분 안에 해킹됩니다.\n\n" +
        "### 비용 관리\n" +
        "Billing 대시보드에서 예산 알림을 설정하세요. 월 5달러 초과 시 이메일 알림만 설정해도 청구서 폭탄을 예방할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: S3 + CloudFront SPA 배포 아키텍처",
      content:
        "프론트엔드 앱을 S3 + CloudFront로 배포하는 전체 아키텍처를 의사코드로 표현합니다.",
      code: {
        language: "typescript",
        code:
          '// S3 + CloudFront SPA 배포 아키텍처\n' +
          '\n' +
          '// 1단계: S3 버킷 생성\n' +
          'S3.createBucket("my-app-prod") {\n' +
          '  blockPublicAccess: true      // 직접 접근 차단\n' +
          '  versioning: enabled           // 롤백 가능\n' +
          '}\n' +
          '\n' +
          '// 2단계: CloudFront 배포 생성\n' +
          'CloudFront.createDistribution() {\n' +
          '  origin: S3Bucket("my-app-prod")\n' +
          '  originAccessControl: OAC     // S3에 CloudFront만 접근 허용\n' +
          '  defaultRootObject: "index.html"\n' +
          '  \n' +
          '  // SPA 라우팅: 404/403 → index.html\n' +
          '  customErrorResponses: [\n' +
          '    { errorCode: 403, responsePagePath: "/index.html", responseCode: 200 },\n' +
          '    { errorCode: 404, responsePagePath: "/index.html", responseCode: 200 }\n' +
          '  ]\n' +
          '  \n' +
          '  certificate: ACM("*.example.com")  // HTTPS\n' +
          '  aliases: ["app.example.com"]\n' +
          '}\n' +
          '\n' +
          '// 3단계: Route 53 DNS 설정\n' +
          'Route53.createRecord() {\n' +
          '  name: "app.example.com"\n' +
          '  type: "A"\n' +
          '  alias: CloudFrontDistribution\n' +
          '}\n' +
          '\n' +
          '// 4단계: CI/CD에서 배포\n' +
          '// npm run build\n' +
          '// aws s3 sync dist/ s3://my-app-prod --delete\n' +
          '// aws cloudfront create-invalidation --paths "/*"',
        description:
          "S3에 정적 파일을 올리고, CloudFront가 캐시+HTTPS를 제공하며, Route 53이 도메인을 연결합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Lambda + API Gateway",
      content:
        "프론트엔드에서 호출할 수 있는 간단한 서버리스 API를 Lambda로 만들어봅니다.",
      code: {
        language: "typescript",
        code:
          '// Lambda 함수 예시 (Node.js 런타임)\n' +
          'export const handler = async (event: APIGatewayEvent) => {\n' +
          '  // API Gateway에서 전달받은 요청\n' +
          '  const { httpMethod, path, body } = event;\n' +
          '\n' +
          '  // CORS 헤더 (프론트엔드에서 호출 시 필수)\n' +
          '  const headers = {\n' +
          '    "Access-Control-Allow-Origin": "https://app.example.com",\n' +
          '    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",\n' +
          '    "Content-Type": "application/json",\n' +
          '  };\n' +
          '\n' +
          '  if (httpMethod === "GET" && path === "/api/users") {\n' +
          '    // DynamoDB에서 데이터 조회\n' +
          '    const users = await dynamoDB.scan({ TableName: "users" });\n' +
          '    return {\n' +
          '      statusCode: 200,\n' +
          '      headers,\n' +
          '      body: JSON.stringify(users.Items),\n' +
          '    };\n' +
          '  }\n' +
          '\n' +
          '  return {\n' +
          '    statusCode: 404,\n' +
          '    headers,\n' +
          '    body: JSON.stringify({ message: "Not Found" }),\n' +
          '  };\n' +
          '};\n' +
          '\n' +
          '// 프론트엔드에서 호출\n' +
          '// const API_URL = "https://api.example.com";\n' +
          '// const response = await fetch(`${API_URL}/api/users`);\n' +
          '// const users = await response.json();',
        description:
          "Lambda 함수는 API Gateway 이벤트를 받아 처리하고, CORS 헤더를 포함한 응답을 반환합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "프론트엔드 개발자를 위한 AWS 핵심 서비스 요약입니다.\n\n" +
        "| 서비스 | 역할 | 프론트엔드 활용 |\n" +
        "|--------|------|----------------|\n" +
        "| S3 | 객체 스토리지 | 정적 파일 호스팅, 이미지 저장 |\n" +
        "| CloudFront | CDN | HTTPS, 캐싱, SPA 라우팅 처리 |\n" +
        "| Route 53 | DNS | 커스텀 도메인 연결 |\n" +
        "| Lambda | 서버리스 함수 | API 엔드포인트, 이미지 리사이징 |\n" +
        "| API Gateway | API 관리 | REST/HTTP API 라우팅 |\n" +
        "| DynamoDB | NoSQL DB | 서버리스 데이터 저장 |\n" +
        "| IAM | 권한 관리 | 최소 권한 원칙 적용 |\n" +
        "| ACM | SSL 인증서 | 무료 HTTPS 인증서 |\n\n" +
        "**프론트엔드 기본 3종 세트:** S3(정적 파일) + CloudFront(CDN/HTTPS) + Route 53(DNS)\n\n" +
        "**핵심 주의사항:**\n" +
        "- IAM 루트 계정은 잠금 — MFA 설정 필수\n" +
        "- Access Key는 절대 코드에 포함하지 않기\n" +
        "- 빌링 알림 설정으로 비용 폭탄 예방\n" +
        "- S3 버킷은 public access 차단, CloudFront OAC 사용\n\n" +
        "**다음 챕터 미리보기:** CloudFront의 동작 원리인 CDN의 개념과 엣지 컴퓨팅까지 깊이 파고듭니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "프론트엔드 관점에서 S3(정적 파일) + CloudFront(CDN) + Route 53(DNS)이 기본 3종 세트다. Lambda로 서버리스 API를 만들고, IAM으로 최소 권한 원칙을 지킨다.",
  checklist: [
    "S3 + CloudFront로 SPA를 배포하는 아키텍처를 설명할 수 있다",
    "CloudFront의 커스텀 에러 응답으로 SPA 라우팅을 처리할 수 있다",
    "IAM의 최소 권한 원칙을 이해하고 적용할 수 있다",
    "Lambda + API Gateway로 간단한 서버리스 API를 만들 수 있다",
    "AWS 비용 관리의 기본 전략을 알고 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "S3에 SPA를 배포하고 CloudFront를 연결했을 때, /about 경로에서 새로고침하면 404가 발생하는 이유는?",
      choices: [
        "S3에 about 폴더가 없어서",
        "CloudFront 캐시가 만료되어서",
        "S3는 실제 파일 경로만 서빙하므로 /about 파일이 존재하지 않아서",
        "Route 53 설정이 잘못되어서",
      ],
      correctIndex: 2,
      explanation:
        "SPA의 /about은 클라이언트 라우팅입니다. S3에는 /about이라는 실제 파일이 없으므로 404가 발생합니다. CloudFront의 커스텀 에러 응답으로 /index.html을 반환하도록 설정해야 합니다.",
    },
    {
      id: "q2",
      question:
        "AWS에서 프론트엔드 앱에 HTTPS를 무료로 적용하는 방법은?",
      choices: [
        "S3의 내장 SSL 사용",
        "Route 53에서 SSL 구매",
        "ACM에서 인증서 발급 후 CloudFront에 연결",
        "Let's Encrypt 인증서 직접 설치",
      ],
      correctIndex: 2,
      explanation:
        "AWS Certificate Manager(ACM)에서 무료로 SSL 인증서를 발급받아 CloudFront 배포에 연결하면 HTTPS가 적용됩니다.",
    },
    {
      id: "q3",
      question:
        "IAM에서 최소 권한 원칙(Principle of Least Privilege)이란?",
      choices: [
        "모든 사용자에게 관리자 권한을 부여하는 것",
        "필요한 작업에 필요한 권한만 최소한으로 부여하는 것",
        "IAM User를 최소한으로 만드는 것",
        "AWS 서비스를 최소한으로 사용하는 것",
      ],
      correctIndex: 1,
      explanation:
        "최소 권한 원칙은 각 사용자나 서비스에 작업 수행에 꼭 필요한 권한만 부여하는 보안 원칙입니다. 과도한 권한은 보안 사고의 원인이 됩니다.",
    },
    {
      id: "q4",
      question:
        "Lambda 함수의 콜드 스타트를 줄이는 방법이 아닌 것은?",
      choices: [
        "번들 크기 최소화",
        "Provisioned Concurrency 설정",
        "S3 버킷 리전 변경",
        "가벼운 런타임 사용",
      ],
      correctIndex: 2,
      explanation:
        "S3 버킷 리전은 Lambda 콜드 스타트와 직접적인 관계가 없습니다. 번들 크기 최소화, Provisioned Concurrency, 가벼운 런타임 선택이 콜드 스타트를 줄이는 방법입니다.",
    },
    {
      id: "q5",
      question:
        "CloudFront에서 S3 버킷에 대한 직접 접근을 차단하면서 CloudFront만 허용하는 방법은?",
      choices: [
        "S3 CORS 설정",
        "Origin Access Control(OAC)",
        "IAM User 생성",
        "S3 버킷 정책 삭제",
      ],
      correctIndex: 1,
      explanation:
        "Origin Access Control(OAC)을 설정하면 S3 버킷의 public access를 차단하면서도 CloudFront를 통한 접근만 허용할 수 있습니다.",
    },
  ],
};

export default chapter;
