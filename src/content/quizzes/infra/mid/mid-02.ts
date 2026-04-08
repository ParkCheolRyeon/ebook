import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-02",
  title: "중간 점검 2: 컨테이너 ~ 운영",
  coverGroups: ["컨테이너", "CI/CD", "배포와 클라우드", "모니터링과 운영"],
  questions: [
    {
      id: "mid02-q1",
      question:
        "Docker에서 이미지(Image)와 컨테이너(Container)의 관계에 대한 설명으로 올바른 것은?",
      choices: [
        "이미지와 컨테이너는 동일한 개념이다",
        "이미지는 읽기 전용 템플릿이고, 컨테이너는 이미지를 기반으로 실행된 격리된 프로세스 인스턴스이다",
        "컨테이너가 먼저 만들어지고 이미지는 컨테이너의 스냅샷이다",
        "하나의 이미지에서는 하나의 컨테이너만 실행할 수 있다",
      ],
      correctIndex: 1,
      explanation:
        "Docker 이미지는 애플리케이션과 의존성을 포함한 읽기 전용 템플릿이며, 컨테이너는 이 이미지를 기반으로 실행된 인스턴스입니다. 하나의 이미지에서 여러 컨테이너를 동시에 실행할 수 있습니다.",
    },
    {
      id: "mid02-q2",
      question:
        "Dockerfile에서 멀티 스테이지 빌드(multi-stage build)를 사용하는 가장 큰 이유는?",
      choices: [
        "빌드 속도를 높이기 위해서",
        "빌드 도구와 소스 코드를 최종 이미지에서 제외하여 이미지 크기를 줄이기 위해서",
        "여러 운영체제를 지원하기 위해서",
        "컨테이너를 여러 개 동시에 실행하기 위해서",
      ],
      correctIndex: 1,
      explanation:
        "멀티 스테이지 빌드는 빌드 단계에서 컴파일러, 빌드 도구 등을 사용하고, 최종 단계에서는 빌드 결과물만 복사하여 경량 이미지를 만듭니다. Node.js 앱의 경우 빌드 스테이지에서 npm install + build 후, 프로덕션 스테이지에는 결과물만 포함시킵니다.",
    },
    {
      id: "mid02-q3",
      question:
        "프론트엔드 앱, 백엔드 API, 데이터베이스를 로컬에서 함께 개발할 때, Docker Compose의 핵심 역할은?",
      choices: [
        "각 서비스를 별도의 물리 서버에 배포한다",
        "여러 컨테이너를 하나의 YAML 파일로 정의하고, 네트워크/볼륨/의존성을 포함하여 한 번에 실행·관리한다",
        "Docker 이미지를 빌드하는 도구이다",
        "컨테이너의 보안을 강화한다",
      ],
      correctIndex: 1,
      explanation:
        "Docker Compose는 docker-compose.yml 파일에 여러 서비스(컨테이너)를 정의하고, docker compose up 한 명령으로 전체 스택을 실행합니다. 서비스 간 네트워크, 볼륨 마운트, 의존 순서 등을 선언적으로 관리할 수 있습니다.",
    },
    {
      id: "mid02-q4",
      question:
        "CI(Continuous Integration)와 CD(Continuous Delivery/Deployment)의 차이에 대한 설명으로 올바른 것은?",
      choices: [
        "CI와 CD는 동일한 개념이다",
        "CI는 코드 변경 시 자동으로 빌드·테스트를 실행하는 것이고, CD는 검증된 코드를 자동으로 배포 가능한 상태(Delivery)로 만들거나 실제 배포(Deployment)까지 자동화하는 것이다",
        "CI는 배포, CD는 테스트를 의미한다",
        "CD 없이 CI만 사용하는 것은 불가능하다",
      ],
      correctIndex: 1,
      explanation:
        "CI는 개발자들의 코드 변경을 자주 통합하며 자동 빌드·테스트로 품질을 보장합니다. CD는 Continuous Delivery(수동 배포 승인)와 Continuous Deployment(완전 자동 배포)로 나뉘며, 검증된 코드를 프로덕션까지 전달하는 과정을 자동화합니다.",
    },
    {
      id: "mid02-q5",
      question:
        "GitHub Actions 워크플로우에서 다음 설정의 의미는?\n\non:\n  pull_request:\n    branches: [main]\njobs:\n  test:\n    runs-on: ubuntu-latest",
      choices: [
        "main 브랜치에 직접 push할 때 실행된다",
        "main 브랜치를 대상으로 한 PR이 생성/업데이트될 때 ubuntu 환경에서 test 작업을 실행한다",
        "매일 정해진 시간에 실행된다",
        "수동으로만 실행할 수 있다",
      ],
      correctIndex: 1,
      explanation:
        "on.pull_request.branches: [main]은 main 브랜치를 대상으로 PR이 열리거나 업데이트될 때 워크플로우를 트리거합니다. runs-on: ubuntu-latest는 GitHub이 제공하는 최신 Ubuntu 러너에서 작업을 실행한다는 의미입니다.",
    },
    {
      id: "mid02-q6",
      question:
        "프론트엔드 프로젝트를 배포할 플랫폼을 선택할 때, Vercel이 Next.js 프로젝트에 특히 적합한 이유는?",
      choices: [
        "무료 플랜이 있기 때문이다",
        "Next.js를 만든 회사(Vercel)가 운영하며 서버 컴포넌트, ISR, 엣지 미들웨어 등 Next.js 고유 기능을 네이티브로 지원한다",
        "다른 프레임워크는 지원하지 않기 때문이다",
        "서버가 한국에 있기 때문이다",
      ],
      correctIndex: 1,
      explanation:
        "Vercel은 Next.js를 개발한 회사로, SSR, ISR, 서버 컴포넌트, 엣지 미들웨어 등 Next.js의 모든 기능을 별도 설정 없이 최적으로 지원합니다. 다른 프레임워크도 지원하지만 Next.js와의 통합이 가장 깊습니다.",
    },
    {
      id: "mid02-q7",
      question:
        "AWS에서 정적 프론트엔드 앱을 호스팅할 때 S3 + CloudFront 조합을 사용하는 이유는?",
      choices: [
        "S3만으로는 파일을 저장할 수 없기 때문이다",
        "S3에 정적 파일을 저장하고 CloudFront(CDN)가 전 세계 엣지 로케이션에서 캐싱하여 빠른 전송과 HTTPS를 제공한다",
        "CloudFront가 서버 사이드 렌더링을 처리한다",
        "비용이 가장 저렴한 조합이기 때문이다",
      ],
      correctIndex: 1,
      explanation:
        "S3는 정적 파일 스토리지, CloudFront는 CDN으로 전 세계 엣지에서 캐싱하여 사용자와 가까운 위치에서 콘텐츠를 전달합니다. HTTPS, 커스텀 도메인, 캐시 정책 등도 CloudFront에서 관리합니다.",
    },
    {
      id: "mid02-q8",
      question:
        "프론트엔드 배포 시 Cache-Control 헤더 전략으로 가장 적절한 것은?",
      choices: [
        "모든 파일에 no-cache를 설정한다",
        "해시가 포함된 정적 에셋(JS/CSS)은 장기 캐시(immutable), HTML은 no-cache 또는 짧은 max-age를 설정한다",
        "모든 파일에 max-age=31536000을 설정한다",
        "캐시를 사용하지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "빌드 시 파일명에 해시가 포함된 에셋(app.a1b2c3.js)은 내용이 바뀌면 파일명도 바뀌므로 장기 캐시가 안전합니다. HTML은 항상 최신 에셋을 참조해야 하므로 캐시를 짧게 설정하거나 재검증하도록 합니다.",
    },
    {
      id: "mid02-q9",
      question:
        "Sentry 같은 에러 모니터링 도구를 프론트엔드에 도입할 때 가장 중요한 설정은?",
      choices: [
        "모든 console.log를 Sentry로 전송한다",
        "소스맵을 업로드하여 난독화된 프로덕션 에러를 원본 코드 위치로 매핑하고, 릴리스 버전을 태깅한다",
        "개발 환경에서만 활성화한다",
        "에러 발생 시 사용자에게 alert를 표시한다",
      ],
      correctIndex: 1,
      explanation:
        "프로덕션 코드는 minify/번들링되어 스택 트레이스가 읽기 어렵습니다. 소스맵을 Sentry에 업로드하면 원본 파일명과 줄 번호로 에러를 확인할 수 있고, 릴리스 태깅으로 어떤 배포에서 문제가 발생했는지 추적할 수 있습니다.",
    },
    {
      id: "mid02-q10",
      question:
        "DevOps 문화에서 SRE(Site Reliability Engineering)가 강조하는 SLI/SLO/SLA의 관계에 대한 설명으로 올바른 것은?",
      choices: [
        "SLI, SLO, SLA는 모두 같은 의미이다",
        "SLI는 서비스 품질을 측정하는 지표, SLO는 내부적으로 설정한 목표치, SLA는 고객과의 계약에 포함되는 보장 수준이다",
        "SLA가 SLO보다 항상 높은 수치를 가진다",
        "프론트엔드 개발과는 전혀 관련이 없다",
      ],
      correctIndex: 1,
      explanation:
        "SLI(Service Level Indicator)는 응답 시간, 에러율 등 실제 측정 지표입니다. SLO(Service Level Objective)는 내부 목표(예: 가용성 99.9%), SLA(Service Level Agreement)는 고객과의 계약으로, SLO를 미달하면 보상이 발생할 수 있습니다.",
    },
  ],
};

export default midQuiz;
