import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "18-devops-culture",
  subject: "infra",
  title: "DevOps 문화와 SRE 기초",
  description:
    "DevOps의 협업 문화, SRE의 핵심 개념(SLI/SLO/SLA, Error Budget), 인시던트 관리, Infrastructure as Code, GitOps를 학습합니다.",
  order: 18,
  group: "모니터링과 운영",
  prerequisites: ["17-monitoring"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "DevOps와 SRE를 **항공 산업**에 비유해봅시다.\n\n" +
        "**DevOps**는 조종사(개발)와 관제탑(운영)의 협업 문화입니다. 예전에는 조종사가 비행기를 만들고, 관제탑이 따로 운영했습니다. 문제가 생기면 \"그건 네 영역이야\"라며 서로 떠넘겼습니다. DevOps는 \"우리가 함께 안전한 비행을 책임진다\"는 마인드셋입니다.\n\n" +
        "**SLI(Service Level Indicator)**는 비행기의 계기판 수치입니다. 속도, 고도, 연료량 같은 객관적 측정값으로, \"지금 서비스 상태가 어떤가?\"를 숫자로 보여줍니다.\n\n" +
        "**SLO(Service Level Objective)**는 안전 비행 기준입니다. \"고도 1만 피트 이상 유지\", \"착륙 시 활주로 이탈 0.1% 미만\" 같은 내부 목표입니다.\n\n" +
        "**SLA(Service Level Agreement)**는 항공사와 승객 간의 계약입니다. \"출발 2시간 이상 지연 시 보상\"과 같습니다. SLA를 어기면 비용이 발생하므로, SLO를 SLA보다 엄격하게 설정합니다.\n\n" +
        "**Error Budget**은 허용된 지연/결항 횟수입니다. \"월 2회 지연까지는 허용\"이라면, 예산이 남아있을 때 신기능(새 노선)을 추가하고, 예산을 소진하면 안정성(정비)에 집중합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "개발과 운영 사이의 간극이 만드는 문제들입니다.\n\n" +
        "1. **개발-운영 사일로** — 개발팀은 빠르게 기능을 배포하고 싶고, 운영팀은 안정성을 지키고 싶습니다. 서로 상반된 목표가 충돌하면 \"변경 금지 기간\"이 길어지고, 배포가 밀리고, 한 번에 큰 변경을 배포하다 장애가 납니다.\n\n" +
        "2. **\"안정성 100%\" 환상** — 모든 시스템은 결국 장애가 발생합니다. 100% 가용성을 추구하면 혁신 속도가 0에 수렴합니다. 그렇다면 \"얼마나 안정적이어야 하는가?\"라는 질문에 답할 기준이 필요합니다.\n\n" +
        "3. **장애 대응의 혼란** — 새벽 3시에 장애가 발생했을 때, 누가 대응하고, 어떤 절차를 따르고, 어떻게 의사소통하는지 정해져 있지 않으면 혼란만 커집니다.\n\n" +
        "4. **수동 인프라 관리** — 서버 설정을 수동으로 하면 \"이 서버 누가 설정했지? 뭘 바꾼 거지?\"라는 상황이 생깁니다. 재현 불가능한 인프라는 유지보수의 악몽입니다.\n\n" +
        "5. **프론트엔드의 무관심** — \"나는 프론트엔드 개발자인데 서버 운영은 내 일이 아니야\"라는 태도는 점점 통하지 않습니다. 풀스택의 시대에서 서비스의 전체 생명주기를 이해해야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "DevOps 문화와 SRE 원칙으로 개발과 운영의 조화를 이루는 방법입니다.\n\n" +
        "### DevOps — 문화의 변화\n" +
        "DevOps는 도구가 아니라 문화입니다. 핵심 원칙:\n" +
        "- **You build it, you run it** — 만든 사람이 운영도 책임진다\n" +
        "- **자동화 우선** — 반복 작업은 자동화한다 (CI/CD, IaC)\n" +
        "- **측정과 피드백** — 모니터링 데이터를 기반으로 의사결정한다\n" +
        "- **지속적 개선** — 장애를 비난이 아닌 학습의 기회로 삼는다\n\n" +
        "### SRE — 안정성의 과학\n" +
        "Google이 만든 SRE(Site Reliability Engineering)는 소프트웨어 엔지니어링으로 운영 문제를 해결합니다:\n" +
        "- **SLI:** 서비스 상태를 측정하는 지표 (응답 시간, 에러율, 가용성)\n" +
        "- **SLO:** 내부 목표 (예: 월간 가용성 99.9%)\n" +
        "- **SLA:** 고객 계약 (SLO보다 느슨하게 설정)\n" +
        "- **Error Budget:** SLO에서 허용하는 실패 범위. 99.9% SLO = 월 43분의 다운타임 허용\n\n" +
        "### 인시던트 관리와 포스트모템\n" +
        "장애 발생 시:\n" +
        "1. **감지:** 모니터링 알림으로 자동 감지\n" +
        "2. **대응:** 온콜 엔지니어가 즉시 대응, Slack/PagerDuty 연동\n" +
        "3. **복구:** 롤백 또는 핫픽스로 서비스 복구\n" +
        "4. **포스트모템:** Blameless(비난 없는) 회고. 원인 분석, 재발 방지 액션 아이템 도출\n\n" +
        "### Infrastructure as Code (IaC)\n" +
        "인프라를 코드로 정의하면:\n" +
        "- **버전 관리:** Git으로 변경 이력 추적\n" +
        "- **재현 가능:** 같은 코드로 동일한 환경을 언제든 재생성\n" +
        "- **코드 리뷰:** 인프라 변경도 PR로 리뷰\n" +
        "- 대표 도구: Terraform, Pulumi, AWS CDK\n\n" +
        "### GitOps\n" +
        "Git 리포지토리를 인프라의 Single Source of Truth로 삼는 방법론입니다. Git에 push하면 자동으로 인프라가 업데이트됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: SLO와 Error Budget 계산",
      content:
        "SLO와 Error Budget의 실제 계산 방법을 의사코드로 표현합니다.",
      code: {
        language: "typescript",
        code:
          '// SLO와 Error Budget 계산\n' +
          '\n' +
          '// === SLI 정의 ===\n' +
          'interface SLI {\n' +
          '  name: string;\n' +
          '  formula: string;\n' +
          '  current: number;\n' +
          '}\n' +
          '\n' +
          'const availabilitySLI: SLI = {\n' +
          '  name: "가용성",\n' +
          '  formula: "성공한 요청 수 / 전체 요청 수 * 100",\n' +
          '  current: 99.95,  // 이번 달 측정값\n' +
          '};\n' +
          '\n' +
          'const latencySLI: SLI = {\n' +
          '  name: "응답 속도",\n' +
          '  formula: "200ms 이내 응답 비율",\n' +
          '  current: 98.5,\n' +
          '};\n' +
          '\n' +
          '// === SLO 설정 ===\n' +
          'const SLO = {\n' +
          '  availability: 99.9,   // 월간 99.9% 가용성 목표\n' +
          '  latency_p95: 200,     // P95 응답 시간 200ms 이내\n' +
          '};\n' +
          '\n' +
          '// === Error Budget 계산 ===\n' +
          'function calculateErrorBudget(slo: number, period: "month") {\n' +
          '  const totalMinutes = 30 * 24 * 60;  // 43,200분/월\n' +
          '  const allowedDowntime = totalMinutes * (1 - slo / 100);\n' +
          '  \n' +
          '  return {\n' +
          '    slo: `${slo}%`,\n' +
          '    totalMinutes,\n' +
          '    allowedDowntimeMinutes: allowedDowntime,\n' +
          '    // 99.9% → 43.2분/월 다운타임 허용\n' +
          '    // 99.99% → 4.32분/월 다운타임 허용\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          '// === Error Budget 정책 ===\n' +
          'function applyErrorBudgetPolicy(remaining: number) {\n' +
          '  if (remaining > 50) {\n' +
          '    return "신기능 배포 가능, 실험적 변경 허용";\n' +
          '  } else if (remaining > 0) {\n' +
          '    return "보수적 배포, 안정성 작업 우선";\n' +
          '  } else {\n' +
          '    return "기능 배포 중단, 안정성 복구에 전력";\n' +
          '  }\n' +
          '}',
        description:
          "SLO 99.9%는 월 43분의 다운타임을 허용하며, Error Budget이 소진되면 안정성 작업에 집중합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 포스트모템과 IaC",
      content:
        "Blameless 포스트모템 작성과 Terraform을 활용한 Infrastructure as Code 예제입니다.",
      code: {
        language: "typescript",
        code:
          '// === Blameless 포스트모템 템플릿 ===\n' +
          '// ## 인시던트 요약\n' +
          '// - 일시: 2025-03-15 14:30 ~ 15:10 (40분)\n' +
          '// - 영향: 결제 페이지 500 에러, 사용자 약 2,000명 영향\n' +
          '// - 심각도: SEV2\n' +
          '//\n' +
          '// ## 타임라인\n' +
          '// - 14:30 Sentry 알림 발생 (에러율 급증)\n' +
          '// - 14:35 온콜 엔지니어 확인, Slack #incident 채널 생성\n' +
          '// - 14:45 원인 파악: 환경변수 누락으로 API 키 undefined\n' +
          '// - 15:00 핫픽스 배포\n' +
          '// - 15:10 정상 확인, 인시던트 종료\n' +
          '//\n' +
          '// ## 근본 원인\n' +
          '// 배포 스크립트에서 새 환경변수를 프로덕션에 추가하지 않음\n' +
          '//\n' +
          '// ## 액션 아이템\n' +
          '// 1. 환경변수 검증 스크립트 추가 (담당: 김개발, ~3/22)\n' +
          '// 2. 배포 체크리스트에 환경변수 확인 항목 추가\n' +
          '// 3. 스테이징에서 smoke test 자동화\n' +
          '\n' +
          '// === Terraform으로 S3 + CloudFront 정의 ===\n' +
          '// resource "aws_s3_bucket" "frontend" {\n' +
          '//   bucket = "my-app-frontend"\n' +
          '// }\n' +
          '//\n' +
          '// resource "aws_cloudfront_distribution" "cdn" {\n' +
          '//   origin {\n' +
          '//     domain_name = aws_s3_bucket.frontend.bucket_domain_name\n' +
          '//     origin_id   = "S3Origin"\n' +
          '//   }\n' +
          '//   default_cache_behavior {\n' +
          '//     allowed_methods  = ["GET", "HEAD"]\n' +
          '//     target_origin_id = "S3Origin"\n' +
          '//   }\n' +
          '// }\n' +
          '//\n' +
          '// # terraform plan  → 변경 사항 미리 확인\n' +
          '// # terraform apply → 인프라 생성/수정\n' +
          '// # 모든 변경은 Git PR로 리뷰 후 적용',
        description:
          "포스트모템은 비난 없이 사실 기반으로 작성하고, IaC는 인프라 변경을 코드 리뷰할 수 있게 합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "DevOps 문화와 SRE 기초의 핵심 정리입니다.\n\n" +
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| DevOps | 개발+운영 협업 문화, \"만든 사람이 운영도 책임\" |\n" +
        "| SRE | 소프트웨어 엔지니어링으로 운영 문제 해결 |\n" +
        "| SLI | 서비스 상태 측정 지표 (가용성, 응답 시간) |\n" +
        "| SLO | 내부 안정성 목표 (예: 99.9% 가용성) |\n" +
        "| SLA | 고객과의 계약 (SLO보다 느슨하게) |\n" +
        "| Error Budget | SLO에서 허용하는 실패 범위 |\n" +
        "| 포스트모템 | Blameless 회고, 재발 방지 액션 도출 |\n" +
        "| IaC | 인프라를 코드로 정의 (Terraform, Pulumi) |\n" +
        "| GitOps | Git을 인프라의 Single Source of Truth로 활용 |\n\n" +
        "**프론트엔드 개발자가 DevOps를 알아야 하는 이유:**\n" +
        "- CI/CD 파이프라인을 직접 구성하고 유지보수해야 합니다\n" +
        "- 프리뷰 배포, 환경 변수 관리, 캐시 전략은 프론트엔드의 영역입니다\n" +
        "- 프로덕션 에러 대응에 프론트엔드 개발자가 직접 참여해야 합니다\n" +
        "- \"서비스 전체를 책임지는 엔지니어\"가 시장에서 더 높은 가치를 가집니다\n\n" +
        "이것으로 Infrastructure 섹션을 마칩니다. Git과 코드 리뷰에서 시작하여, 빌드 도구, 컨테이너, CI/CD, 배포 플랫폼, 클라우드 서비스, CDN, 모니터링, 그리고 DevOps 문화까지 — 프론트엔드 개발자가 알아야 할 인프라의 전체 지도를 그렸습니다. 이 지식들은 단순히 '알면 좋은 것'이 아니라, 현대 프론트엔드 개발자의 필수 역량입니다. 코드를 잘 짜는 것을 넘어, 그 코드가 사용자에게 안정적으로 전달되는 전체 과정을 이해하는 엔지니어가 되시길 바랍니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "DevOps는 도구가 아니라 문화다. '너는 개발, 나는 운영'이 아닌 '우리가 함께 서비스를 책임진다'는 마인드셋이 핵심이며, SLO와 Error Budget으로 안정성과 속도의 균형을 잡는다.",
  checklist: [
    "DevOps의 핵심 원칙과 'You build it, you run it'을 설명할 수 있다",
    "SLI, SLO, SLA의 차이와 관계를 설명할 수 있다",
    "Error Budget의 개념과 활용 방법을 이해한다",
    "Blameless 포스트모템의 목적과 작성 방법을 알고 있다",
    "Infrastructure as Code와 GitOps의 장점을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "SLO 99.9%일 때, 한 달(30일) 동안 허용되는 다운타임은 약 얼마인가?",
      choices: [
        "약 4분",
        "약 43분",
        "약 4시간",
        "약 8시간",
      ],
      correctIndex: 1,
      explanation:
        "30일 = 43,200분. 99.9% SLO는 0.1%의 다운타임을 허용하므로, 43,200 x 0.001 = 약 43.2분입니다.",
    },
    {
      id: "q2",
      question:
        "Error Budget이 소진되었을 때 취해야 할 행동은?",
      choices: [
        "더 많은 기능을 빠르게 배포한다",
        "SLO 목표를 낮춘다",
        "기능 배포를 중단하고 안정성 복구에 집중한다",
        "모니터링을 비활성화한다",
      ],
      correctIndex: 2,
      explanation:
        "Error Budget이 소진되면 이미 SLO를 위반한 상태입니다. 추가 기능 배포는 더 많은 장애를 유발할 수 있으므로, 안정성 작업(버그 수정, 성능 개선, 테스트 추가)에 집중해야 합니다.",
    },
    {
      id: "q3",
      question:
        "Blameless 포스트모템의 핵심 원칙은?",
      choices: [
        "장애 책임자를 명확히 하여 재발을 방지한다",
        "개인을 비난하지 않고, 시스템과 프로세스의 개선에 집중한다",
        "장애 내용을 외부에 공개하지 않는다",
        "포스트모템은 경영진만 참여한다",
      ],
      correctIndex: 1,
      explanation:
        "Blameless 포스트모템은 '누가 잘못했나'가 아닌 '시스템에서 무엇이 실패했고, 어떻게 개선할 수 있나'에 집중합니다. 비난 문화는 사람들이 실수를 숨기게 만듭니다.",
    },
    {
      id: "q4",
      question:
        "Infrastructure as Code(IaC)의 장점이 아닌 것은?",
      choices: [
        "인프라 변경 이력을 Git으로 추적할 수 있다",
        "동일한 환경을 재현할 수 있다",
        "서버에 직접 SSH 접속하여 빠르게 수정할 수 있다",
        "인프라 변경을 PR로 코드 리뷰할 수 있다",
      ],
      correctIndex: 2,
      explanation:
        "IaC의 핵심은 수동 서버 접속을 없애는 것입니다. 코드로 정의하고, Git으로 관리하며, CI/CD로 적용합니다. 직접 SSH 접속은 IaC의 반대 패턴입니다.",
    },
    {
      id: "q5",
      question:
        "SLI, SLO, SLA의 관계로 올바른 것은?",
      choices: [
        "SLA > SLO > SLI (순서대로 엄격)",
        "SLI는 측정값, SLO는 내부 목표, SLA는 고객 계약이다",
        "SLA, SLO, SLI는 모두 같은 의미이다",
        "SLI는 계약, SLO는 측정값, SLA는 목표이다",
      ],
      correctIndex: 1,
      explanation:
        "SLI는 실제 측정 지표(예: 가용성 99.95%), SLO는 내부적으로 설정한 목표(예: 99.9% 이상 유지), SLA는 이를 기반으로 고객과 맺는 계약(예: 99.5% 미만 시 보상)입니다.",
    },
  ],
};

export default chapter;
