import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "12-cicd-concepts",
  subject: "infra",
  title: "CI/CD 개념과 파이프라인",
  description: "CI/CD의 핵심 개념, 파이프라인 구성, 환경 분리, 블루-그린/카나리 배포 전략, 롤백 방법을 학습합니다.",
  order: 12,
  group: "CI/CD",
  prerequisites: ["11-docker-compose"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "CI/CD는 **자동차 공장의 조립 라인**과 같습니다.\n\n" +
        "**CI(Continuous Integration)**는 조립 라인의 **품질 검사 구간**입니다. 부품(코드)이 들어올 때마다 자동으로 규격 검사(빌드)와 성능 테스트(테스트)를 수행합니다. 불량 부품이 발견되면 즉시 라인을 멈추고 알림을 보냅니다. 여러 공급업체(개발자)의 부품이 합쳐질 때 호환성을 매번 자동 검증합니다.\n\n" +
        "**CD(Continuous Delivery/Deployment)**는 검사를 통과한 자동차를 **딜러십에 배송**하는 것입니다. Delivery는 배송 준비까지 자동화(사람이 최종 배송 승인), Deployment는 배송까지 완전 자동화입니다.\n\n" +
        "**블루-그린 배포**는 두 개의 주차장(Blue/Green)을 운영하는 것입니다. 새 자동차를 Green 주차장에 먼저 배치하고, 문제가 없으면 고객 안내판을 Green으로 전환합니다. 문제가 생기면 안내판만 Blue로 돌리면 됩니다.\n\n" +
        "**카나리 배포**는 신차를 먼저 10%의 고객에게만 시승시키고, 만족도를 확인한 후 전체 고객에게 출시하는 것입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "CI/CD가 없는 팀은 어떤 문제를 겪을까요?\n\n" +
        "1. **통합 지옥(Integration Hell)** — 각자 몇 주간 개발한 코드를 합치는 날이 가장 고통스럽습니다. 충돌이 수십 개 발생하고, 합친 후에 동작하지 않는 기능이 속출합니다.\n\n" +
        "2. **수동 배포의 공포** — \"금요일 오후에는 배포하지 않는다\"는 불문율이 있습니다. 배포가 무섭기 때문입니다. 수동 과정은 실수가 많고, 롤백도 복잡합니다.\n\n" +
        "3. **느린 피드백 루프** — 코드 리뷰에서 \"테스트 통과했나요?\"를 확인하려면 로컬에서 직접 돌려봐야 합니다. 빌드가 깨진 코드가 메인 브랜치에 합쳐져 다른 개발자의 작업을 막습니다.\n\n" +
        "4. **환경 간 불일치** — 개발에서 잘 되던 것이 스테이징에서 안 되고, 스테이징에서 잘 되던 것이 프로덕션에서 안 됩니다. 환경별 설정이 제각각이고 추적이 안 됩니다.\n\n" +
        "CI/CD는 이 모든 것을 **자동화**하여 작은 변경을 자주, 안전하게 배포하는 것을 목표로 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "CI/CD의 핵심 개념을 단계별로 정리합니다.\n\n" +
        "### CI: Continuous Integration\n" +
        "코드를 **자주**(최소 하루 한 번) 메인 브랜치에 통합합니다. 통합할 때마다 자동으로 빌드, 린트, 테스트를 실행합니다. 실패하면 즉시 알림이 가고, 메인 브랜치는 항상 동작하는 상태를 유지합니다.\n\n" +
        "### CD: Continuous Delivery vs Deployment\n" +
        "**Delivery**: CI를 통과한 코드가 자동으로 스테이징까지 배포됩니다. 프로덕션 배포는 수동 승인(버튼 클릭)이 필요합니다.\n" +
        "**Deployment**: 프로덕션 배포까지 완전 자동화됩니다. 테스트를 통과하면 사람 개입 없이 바로 배포됩니다.\n\n" +
        "### 파이프라인 구조\n" +
        "**소스** → **빌드** → **테스트** → **배포**의 자동화된 흐름입니다. 각 단계를 **스테이지**라 하고, 스테이지 안의 개별 작업을 **잡(job)**이라 합니다. 잡이 생성하는 결과물(빌드 산출물)을 **아티팩트**라 합니다.\n\n" +
        "### 환경 분리\n" +
        "dev(개발) → staging(스테이징) → prod(프로덕션) 순서로 동일한 아티팩트를 승격시킵니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 파이프라인 구조",
      content:
        "프론트엔드 프로젝트의 전형적인 CI/CD 파이프라인 구조를 의사코드로 표현합니다. 실제 도구(GitHub Actions 등)와 무관한 보편적 개념입니다.",
      code: {
        language: "typescript",
        code:
          '// CI/CD 파이프라인 — 프론트엔드 프로젝트\n' +
          '\n' +
          '// === 파이프라인 스테이지 정의 ===\n' +
          'type Stage = "source" | "build" | "test" | "deploy";\n' +
          '\n' +
          'interface Pipeline {\n' +
          '  trigger: string;      // 파이프라인 시작 조건\n' +
          '  stages: StageConfig[];\n' +
          '}\n' +
          '\n' +
          'interface StageConfig {\n' +
          '  name: Stage;\n' +
          '  jobs: Job[];\n' +
          '}\n' +
          '\n' +
          'interface Job {\n' +
          '  name: string;\n' +
          '  steps: string[];\n' +
          '  artifacts?: string[];  // 다음 스테이지로 전달할 파일\n' +
          '}\n' +
          '\n' +
          '// === 프론트엔드 파이프라인 예시 ===\n' +
          'const frontendPipeline: Pipeline = {\n' +
          '  trigger: "push to main or PR to main",\n' +
          '  stages: [\n' +
          '    {\n' +
          '      name: "build",\n' +
          '      jobs: [\n' +
          '        {\n' +
          '          name: "install-and-build",\n' +
          '          steps: [\n' +
          '            "checkout code",\n' +
          '            "setup node 20",\n' +
          '            "npm ci",               // 의존성 설치 (lock 파일 기준)\n' +
          '            "npm run build",         // 프로덕션 빌드\n' +
          '          ],\n' +
          '          artifacts: ["dist/"],      // 빌드 결과물 저장\n' +
          '        },\n' +
          '      ],\n' +
          '    },\n' +
          '    {\n' +
          '      name: "test",\n' +
          '      jobs: [\n' +
          '        {\n' +
          '          name: "lint",\n' +
          '          steps: ["npm run lint"],\n' +
          '        },\n' +
          '        {\n' +
          '          name: "unit-test",\n' +
          '          steps: ["npm run test -- --coverage"],\n' +
          '        },\n' +
          '        {\n' +
          '          name: "e2e-test",\n' +
          '          steps: [\n' +
          '            "start preview server",\n' +
          '            "npx playwright test",\n' +
          '          ],\n' +
          '        },\n' +
          '      ],\n' +
          '    },\n' +
          '    {\n' +
          '      name: "deploy",\n' +
          '      jobs: [\n' +
          '        {\n' +
          '          name: "deploy-staging",\n' +
          '          steps: [\n' +
          '            "download build artifacts",\n' +
          '            "deploy to staging environment",\n' +
          '            "run smoke tests",\n' +
          '          ],\n' +
          '        },\n' +
          '        {\n' +
          '          name: "deploy-production",\n' +
          '          steps: [\n' +
          '            "manual approval required",  // CD: Delivery\n' +
          '            "deploy to production",\n' +
          '            "verify health check",\n' +
          '          ],\n' +
          '        },\n' +
          '      ],\n' +
          '    },\n' +
          '  ],\n' +
          '};',
        description: "파이프라인은 소스→빌드→테스트→배포의 순차적 스테이지로 구성되고, 각 스테이지의 잡은 병렬 실행이 가능합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 배포 전략과 롤백",
      content:
        "블루-그린, 카나리 등 주요 배포 전략과 롤백 방법을 코드로 살펴봅니다. 안전한 배포를 위한 패턴들입니다.",
      code: {
        language: "typescript",
        code:
          '// === 배포 전략 비교 ===\n' +
          '\n' +
          'type DeployStrategy = "rolling" | "blue-green" | "canary";\n' +
          '\n' +
          'interface DeployConfig {\n' +
          '  strategy: DeployStrategy;\n' +
          '  rollbackPlan: string;\n' +
          '}\n' +
          '\n' +
          '// 1. 블루-그린 배포\n' +
          '// 두 개의 동일한 환경을 운영\n' +
          'const blueGreen: DeployConfig = {\n' +
          '  strategy: "blue-green",\n' +
          '  rollbackPlan: "로드밸런서를 이전 환경(Blue)으로 전환",\n' +
          '};\n' +
          '// 과정:\n' +
          '// 1. Blue(현재 버전) 운영 중\n' +
          '// 2. Green에 새 버전 배포\n' +
          '// 3. Green 검증 완료\n' +
          '// 4. 로드밸런서 → Green으로 전환\n' +
          '// 5. 문제 시 → Blue로 즉시 롤백 (수 초)\n' +
          '\n' +
          '// 2. 카나리 배포\n' +
          '// 트래픽을 점진적으로 이동\n' +
          'const canary: DeployConfig = {\n' +
          '  strategy: "canary",\n' +
          '  rollbackPlan: "카나리 트래픽을 0%로 설정",\n' +
          '};\n' +
          '// 과정:\n' +
          '// 1. 새 버전에 10% 트래픽 → 에러율 모니터링\n' +
          '// 2. 정상이면 50% → 모니터링\n' +
          '// 3. 정상이면 100%\n' +
          '// 4. 에러율 높으면 → 0%로 롤백\n' +
          '\n' +
          '// 3. 롤링 배포\n' +
          '// 인스턴스를 하나씩 교체\n' +
          'const rolling: DeployConfig = {\n' +
          '  strategy: "rolling",\n' +
          '  rollbackPlan: "이전 버전으로 다시 롤링 업데이트",\n' +
          '};\n' +
          '\n' +
          '// === 환경 분리 전략 ===\n' +
          'interface Environment {\n' +
          '  name: string;\n' +
          '  purpose: string;\n' +
          '  deployTrigger: string;\n' +
          '}\n' +
          '\n' +
          'const environments: Environment[] = [\n' +
          '  {\n' +
          '    name: "dev",\n' +
          '    purpose: "개발자 테스트, 기능 검증",\n' +
          '    deployTrigger: "feature 브랜치 push",\n' +
          '  },\n' +
          '  {\n' +
          '    name: "staging",\n' +
          '    purpose: "QA 테스트, 프로덕션 미러",\n' +
          '    deployTrigger: "main 브랜치 merge",\n' +
          '  },\n' +
          '  {\n' +
          '    name: "production",\n' +
          '    purpose: "실제 사용자 서비스",\n' +
          '    deployTrigger: "수동 승인 또는 태그 생성",\n' +
          '  },\n' +
          '];\n' +
          '\n' +
          '// 핵심: 동일한 아티팩트가 dev → staging → production으로 승격\n' +
          '// 환경별 설정만 다름 (환경변수로 주입)',
        description: "블루-그린은 즉시 롤백이 가능하고, 카나리는 위험을 최소화하며 점진적으로 배포합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "CI/CD의 핵심을 한 장으로 정리합니다.\n\n" +
        "| 개념 | 정의 | 핵심 가치 |\n" +
        "|------|------|----------|\n" +
        "| CI | 코드 통합 시 자동 빌드/테스트 | 빠른 피드백, 통합 충돌 최소화 |\n" +
        "| CD (Delivery) | 스테이징까지 자동, 프로덕션 수동 승인 | 항상 배포 가능한 상태 |\n" +
        "| CD (Deployment) | 프로덕션까지 완전 자동 | 빠른 가치 전달 |\n\n" +
        "**배포 전략 비교:**\n" +
        "| 전략 | 장점 | 단점 |\n" +
        "|------|------|------|\n" +
        "| 블루-그린 | 즉시 롤백 | 2배의 인프라 비용 |\n" +
        "| 카나리 | 위험 최소화, 점진적 | 설정 복잡 |\n" +
        "| 롤링 | 리소스 효율적 | 신/구 버전 공존 기간 |\n\n" +
        "**파이프라인 원칙:**\n" +
        "1. 빌드는 한 번, 배포는 여러 번 (동일 아티팩트 승격)\n" +
        "2. 환경별 차이는 환경변수로만 관리\n" +
        "3. 실패하면 빠르게 실패 (fast fail)\n" +
        "4. 메인 브랜치는 항상 배포 가능한 상태\n\n" +
        "**다음 챕터 미리보기:** CI/CD 개념을 실제로 구현하는 GitHub Actions의 문법과 실전 워크플로우를 작성해 봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "CI는 '코드를 합칠 때마다 자동으로 빌드·테스트', CD는 '검증된 코드를 자동으로 배포'하는 것이다. 파이프라인은 소스→빌드→테스트→배포의 자동화된 흐름이며, 블루-그린과 카나리로 안전하게 배포한다.",
  checklist: [
    "CI와 CD(Delivery vs Deployment)의 차이를 설명할 수 있다",
    "파이프라인의 스테이지, 잡, 아티팩트 개념을 이해한다",
    "블루-그린, 카나리, 롤링 배포 전략의 장단점을 비교할 수 있다",
    "dev/staging/prod 환경 분리의 원칙을 알고 있다",
    "롤백 전략의 중요성과 방법을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Continuous Delivery와 Continuous Deployment의 차이는?",
      choices: [
        "Delivery는 테스트를 건너뛰고, Deployment는 테스트를 포함한다",
        "Delivery는 프로덕션 배포에 수동 승인이 필요하고, Deployment는 완전 자동이다",
        "Delivery는 코드만, Deployment는 인프라도 포함한다",
        "차이가 없다 — 같은 개념이다",
      ],
      correctIndex: 1,
      explanation: "Continuous Delivery는 스테이징까지 자동이고 프로덕션 배포에 수동 승인(버튼 클릭)이 필요합니다. Continuous Deployment는 테스트를 통과하면 프로덕션까지 자동 배포됩니다.",
    },
    {
      id: "q2",
      question: "블루-그린 배포의 가장 큰 장점은?",
      choices: [
        "인프라 비용이 절반으로 줄어든다",
        "배포 중 다운타임이 발생하지 않고 즉시 롤백이 가능하다",
        "카나리보다 설정이 간단하다",
        "트래픽을 점진적으로 이동시킬 수 있다",
      ],
      correctIndex: 1,
      explanation: "블루-그린 배포는 두 환경을 동시에 운영하므로 로드밸런서 전환만으로 즉시 롤백할 수 있습니다. 다운타임 없이 배포하고, 문제 시 수 초 만에 이전 버전으로 복구합니다.",
    },
    {
      id: "q3",
      question: "CI 파이프라인에서 '아티팩트(artifact)'란?",
      choices: [
        "테스트 결과 보고서만을 의미한다",
        "Git 저장소의 코드를 의미한다",
        "빌드 과정에서 생성된 결과물(빌드 산출물)을 의미한다",
        "환경변수 설정 파일을 의미한다",
      ],
      correctIndex: 2,
      explanation: "아티팩트는 빌드 잡에서 생성된 결과물입니다. 프론트엔드에서는 보통 dist/ 폴더(빌드된 HTML/CSS/JS)가 아티팩트이며, 이후 배포 스테이지에서 사용됩니다.",
    },
    {
      id: "q4",
      question: "환경 분리에서 '동일한 아티팩트를 승격시킨다'는 원칙의 의미는?",
      choices: [
        "각 환경에서 별도로 빌드한다",
        "한 번 빌드한 결과물을 dev→staging→prod로 이동시킨다",
        "환경마다 다른 코드를 배포한다",
        "스테이징을 건너뛰고 바로 프로덕션에 배포한다",
      ],
      correctIndex: 1,
      explanation: "빌드는 한 번만 하고, 그 결과물(아티팩트)을 dev→staging→prod로 승격시킵니다. 환경별 차이는 환경변수로만 관리합니다. 이를 통해 '스테이징에서 테스트한 것과 프로덕션에 배포한 것이 동일'함을 보장합니다.",
    },
    {
      id: "q5",
      question: "카나리 배포에서 에러율이 높아지면 어떻게 롤백하는가?",
      choices: [
        "전체 서버를 종료하고 이전 버전으로 재배포한다",
        "카나리에 할당된 트래픽 비율을 0%로 설정한다",
        "블루-그린 전환을 수행한다",
        "수동으로 코드를 되돌리고 다시 빌드한다",
      ],
      correctIndex: 1,
      explanation: "카나리 배포는 트래픽 비율을 조절하는 방식이므로, 문제가 발생하면 카나리(새 버전)의 트래픽 비율을 0%로 설정하여 즉시 롤백합니다. 기존 버전이 계속 운영 중이므로 안전합니다.",
    },
  ],
};

export default chapter;
