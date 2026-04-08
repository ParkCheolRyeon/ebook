import type { FinalExam } from "@/types/quiz";

const finalExam: FinalExam = {
  type: "final",
  id: "final-exam",
  title: "인프라 최종 시험",
  questions: [
    // === Git 심화 ===
    {
      id: "final-q1",
      question:
        "팀원 A가 feature 브랜치에서 작업 중 main을 rebase했는데, 이미 원격에 push한 상태였다. 이로 인해 발생할 수 있는 문제와 올바른 대처법은?",
      choices: [
        "아무 문제 없다. rebase 후 그냥 push하면 된다",
        "원격과 로컬의 히스토리가 달라져 force push가 필요하며, 다른 팀원이 같은 브랜치를 기반으로 작업 중이면 충돌이 발생한다. 공유 브랜치에서는 merge를 사용하는 것이 안전하다",
        "rebase는 항상 자동으로 원격과 동기화된다",
        "원격 브랜치를 삭제하고 다시 push하면 해결된다",
      ],
      correctIndex: 1,
      explanation:
        "rebase는 커밋 해시를 변경하므로 이미 push된 브랜치에서 사용하면 force push가 필요합니다. 다른 사람이 해당 브랜치를 기반으로 작업 중이라면 심각한 충돌이 발생합니다. 공유 브랜치에서는 merge가 안전합니다.",
    },
    {
      id: "final-q2",
      question:
        "대규모 팀에서 PR 리뷰 병목을 줄이면서도 코드 품질을 유지하기 위한 가장 효과적인 전략은?",
      choices: [
        "리뷰 없이 바로 머지한다",
        "PR 크기를 작게 유지하고, CODEOWNERS로 자동 리뷰어를 지정하며, CI에서 린트/테스트/타입 체크를 자동화하여 리뷰어가 로직에만 집중하게 한다",
        "한 명의 시니어가 모든 PR을 리뷰한다",
        "리뷰 대신 페어 프로그래밍만 한다",
      ],
      correctIndex: 1,
      explanation:
        "작은 PR은 리뷰가 빠르고 정확합니다. CODEOWNERS로 해당 영역 전문가를 자동 배정하고, CI에서 스타일/타입/테스트를 자동 검증하면 리뷰어는 비즈니스 로직과 아키텍처에 집중할 수 있습니다.",
    },
    // === 패키지 관리 ===
    {
      id: "final-q3",
      question:
        "package.json에서 의존성 버전이 \"^1.2.3\"으로 지정되어 있을 때, npm install 시 설치될 수 있는 버전 범위는?",
      choices: [
        "정확히 1.2.3만 설치된다",
        "1.2.3 이상 2.0.0 미만의 최신 버전이 설치된다 (semver minor/patch 업데이트 허용)",
        "1.2.3 이상 1.3.0 미만만 설치된다",
        "어떤 버전이든 최신 버전이 설치된다",
      ],
      correctIndex: 1,
      explanation:
        "캐럿(^)은 semver에서 가장 왼쪽의 0이 아닌 숫자를 고정합니다. ^1.2.3은 major 버전 1을 고정하므로 >=1.2.3 <2.0.0 범위의 최신 버전이 설치됩니다. lock 파일로 재현 가능한 설치를 보장해야 합니다.",
    },
    {
      id: "final-q4",
      question:
        "모노레포에서 패키지 A가 패키지 B에 의존하고, B가 변경되면 A도 다시 빌드해야 한다. Turborepo에서 이를 올바르게 설정하는 방법은?",
      choices: [
        "A의 빌드 스크립트에서 B를 먼저 빌드하는 명령을 수동으로 추가한다",
        "turbo.json에서 A의 build 태스크가 의존하는 패키지의 build를 dependsOn으로 선언하면, Turborepo가 자동으로 빌드 순서를 결정하고 캐시를 관리한다",
        "항상 모든 패키지를 빌드하도록 설정한다",
        "B를 별도 저장소로 분리한다",
      ],
      correctIndex: 1,
      explanation:
        "turbo.json의 pipeline에서 dependsOn: [\"^build\"]로 설정하면, 의존하는 패키지의 build가 먼저 실행됩니다. Turborepo는 이 그래프를 기반으로 최적의 실행 순서와 캐시를 자동 관리합니다.",
    },
    // === 빌드와 번들링 ===
    {
      id: "final-q5",
      question:
        "프로덕션 빌드에서 번들 분석 결과 lodash 전체(약 70KB)가 포함되어 있었다. 번들 크기를 줄이기 위한 가장 적절한 조치는?",
      choices: [
        "lodash를 devDependencies로 옮긴다",
        "import _ from 'lodash' 대신 import debounce from 'lodash/debounce'처럼 개별 함수만 임포트하거나, lodash-es를 사용하여 tree shaking을 활성화한다",
        "webpack의 externals로 lodash를 CDN에서 로드한다",
        "lodash 사용을 완전히 제거한다",
      ],
      correctIndex: 1,
      explanation:
        "lodash의 기본 패키지는 CommonJS라 tree shaking이 안 됩니다. 개별 경로 임포트(lodash/debounce)로 필요한 함수만 가져오거나, ES Module 버전인 lodash-es를 사용하면 번들러가 사용하지 않는 함수를 제거할 수 있습니다.",
    },
    {
      id: "final-q6",
      question:
        "Vite 프로젝트에서 개발 환경은 정상인데 프로덕션 빌드 후 특정 라이브러리에서 에러가 발생한다. 가장 가능성 높은 원인은?",
      choices: [
        "Vite가 프로덕션에서는 동작하지 않는다",
        "개발 환경(esbuild 변환)과 프로덕션(Rollup 번들링)에서 모듈 처리 방식이 달라, CJS/ESM 호환성 또는 tree shaking으로 인한 사이드 이펙트 제거가 원인일 수 있다",
        "Node.js 버전이 다르기 때문이다",
        "프로덕션에서는 TypeScript가 지원되지 않기 때문이다",
      ],
      correctIndex: 1,
      explanation:
        "Vite는 개발 시 esbuild로 빠르게 변환하고, 프로덕션에서는 Rollup으로 번들링합니다. 두 도구의 모듈 해석/tree shaking 동작이 달라서, 특히 CJS 전용 라이브러리나 sideEffects 설정이 잘못된 패키지에서 차이가 발생할 수 있습니다.",
    },
    {
      id: "final-q7",
      question:
        "SPA에서 코드 스플리팅을 적용할 때, React.lazy와 dynamic import를 사용하는 가장 효과적인 기준은?",
      choices: [
        "모든 컴포넌트를 lazy로 감싼다",
        "라우트 단위로 분할하고, 큰 라이브러리(차트, 에디터 등)를 사용하는 컴포넌트를 지연 로딩하여 초기 번들 크기를 줄인다",
        "CSS 파일만 코드 스플리팅한다",
        "번들이 1MB를 넘을 때만 적용한다",
      ],
      correctIndex: 1,
      explanation:
        "라우트 기반 코드 스플리팅은 사용자가 방문하지 않는 페이지의 코드를 초기 번들에서 제외합니다. 추가로 차트, 마크다운 에디터 등 무거운 라이브러리를 사용하는 컴포넌트를 lazy loading하면 초기 로드 성능이 크게 개선됩니다.",
    },
    // === 컨테이너 ===
    {
      id: "final-q8",
      question:
        "다음 Dockerfile에서 레이어 캐시를 최적화하기 위해 개선해야 할 점은?\n\nCOPY . .\nRUN npm install\nRUN npm run build",
      choices: [
        "문제없다. 이대로 사용하면 된다",
        "package.json과 lock 파일을 먼저 복사하여 npm install을 실행하고, 그 다음 나머지 소스를 복사해야 한다. 소스 변경 시에도 의존성 설치 레이어의 캐시를 재사용할 수 있다",
        "RUN 명령을 하나로 합쳐야 한다",
        "COPY 대신 ADD를 사용해야 한다",
      ],
      correctIndex: 1,
      explanation:
        "Docker는 각 명령을 레이어로 캐시합니다. COPY . .이 먼저 오면 소스 코드가 바뀔 때마다 npm install도 다시 실행됩니다. package*.json만 먼저 복사하고 install한 뒤 소스를 복사하면, 의존성이 변경되지 않은 경우 캐시를 재사용할 수 있습니다.",
    },
    {
      id: "final-q9",
      question:
        "Docker 컨테이너에서 Node.js 앱을 실행할 때 프로세스를 PID 1으로 직접 실행하면 발생할 수 있는 문제는?",
      choices: [
        "성능이 저하된다",
        "Node.js가 SIGTERM 등 시그널을 제대로 처리하지 못해 graceful shutdown이 되지 않을 수 있다. tini 같은 init 프로세스를 사용하거나 --init 플래그를 추가해야 한다",
        "파일 시스템에 접근할 수 없다",
        "네트워크가 동작하지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "PID 1 프로세스는 특별한 시그널 처리 책임이 있는데, Node.js는 이를 기본적으로 처리하지 않습니다. 컨테이너 종료 시 SIGTERM을 받지 못하면 강제 종료(SIGKILL)될 수 있어 요청이 중단됩니다. tini나 dumb-init을 사용하면 이 문제를 해결할 수 있습니다.",
    },
    // === CI/CD ===
    {
      id: "final-q10",
      question:
        "GitHub Actions에서 프론트엔드 CI 파이프라인을 구성할 때, 빌드 시간을 단축하기 위한 가장 효과적인 방법은?",
      choices: [
        "테스트를 제거한다",
        "node_modules와 빌드 캐시를 actions/cache로 캐싱하고, 변경된 패키지만 빌드하며, lint·타입체크·테스트를 병렬 job으로 실행한다",
        "self-hosted 러너만 사용한다",
        "모든 단계를 하나의 step에 합친다",
      ],
      correctIndex: 1,
      explanation:
        "의존성 캐싱(actions/cache 또는 actions/setup-node의 cache 옵션)으로 설치 시간을 줄이고, 독립적인 작업(lint, test, build)을 병렬 job으로 실행하면 전체 파이프라인 시간이 크게 단축됩니다.",
    },
    {
      id: "final-q11",
      question:
        "CI/CD 파이프라인에서 시크릿(API 키, 토큰 등)을 안전하게 관리하는 방법으로 적절하지 않은 것은?",
      choices: [
        "GitHub Secrets에 저장하고 워크플로우에서 환경 변수로 참조한다",
        "Environment별로 시크릿을 분리하고 배포 보호 규칙을 설정한다",
        ".env 파일에 시크릿을 넣고 레포지토리에 커밋한다",
        "OIDC를 사용하여 클라우드 프로바이더에 임시 자격 증명으로 접근한다",
      ],
      correctIndex: 2,
      explanation:
        "시크릿을 코드 저장소에 커밋하면 히스토리에 영구적으로 남아 보안 위험이 큽니다. GitHub Secrets, 환경별 시크릿 분리, OIDC 기반 임시 자격 증명 등을 사용하여 시크릿이 코드에 노출되지 않도록 해야 합니다.",
    },
    // === 배포와 클라우드 ===
    {
      id: "final-q12",
      question:
        "프론트엔드 애플리케이션을 배포할 때 Blue-Green 배포 전략의 핵심 장점은?",
      choices: [
        "서버 비용이 절반으로 줄어든다",
        "두 개의 동일한 환경(Blue/Green)을 유지하여, 새 버전을 Green에 배포하고 검증 후 트래픽을 전환하면 다운타임 없이 즉시 롤백이 가능하다",
        "자동으로 A/B 테스트가 수행된다",
        "빌드 시간이 단축된다",
      ],
      correctIndex: 1,
      explanation:
        "Blue-Green 배포는 현재 버전(Blue)과 새 버전(Green) 환경을 동시에 유지합니다. 새 버전 검증 후 로드 밸런서로 트래픽을 전환하고, 문제 발생 시 즉시 Blue로 롤백할 수 있어 다운타임을 최소화합니다.",
    },
    {
      id: "final-q13",
      question:
        "정적 사이트를 S3 + CloudFront로 배포한 후, 새 버전을 배포했는데 사용자에게 이전 버전이 계속 보인다. 가장 적절한 해결 방법은?",
      choices: [
        "S3 버킷을 삭제하고 다시 만든다",
        "CloudFront 캐시를 무효화(Invalidation)하거나, 빌드 시 파일명에 해시를 포함시켜 캐시 버스팅을 적용한다",
        "CloudFront를 제거하고 S3에서 직접 서빙한다",
        "사용자에게 브라우저 캐시를 지우라고 안내한다",
      ],
      correctIndex: 1,
      explanation:
        "CloudFront는 엣지에서 콘텐츠를 캐싱합니다. 새 배포 후에는 Invalidation으로 캐시를 갱신하거나, 파일명에 해시를 포함(app.[hash].js)시켜 새 파일이 자동으로 다른 URL을 갖게 하는 것이 가장 효과적입니다.",
    },
    {
      id: "final-q14",
      question:
        "글로벌 서비스에서 CDN을 도입할 때 고려해야 할 캐시 전략으로 적절하지 않은 것은?",
      choices: [
        "지역별 규정(GDPR 등)에 따라 데이터가 저장되는 엣지 로케이션을 제한한다",
        "사용자 인증 정보가 포함된 API 응답도 CDN에 캐싱하여 성능을 높인다",
        "정적 에셋과 동적 API 응답의 캐시 정책을 분리한다",
        "Cache-Control 헤더의 stale-while-revalidate를 활용하여 백그라운드에서 캐시를 갱신한다",
      ],
      correctIndex: 1,
      explanation:
        "인증 정보가 포함된 API 응답을 CDN에 캐싱하면 다른 사용자에게 개인 데이터가 노출될 수 있어 심각한 보안 문제가 됩니다. 개인화된 응답은 Cache-Control: private로 설정하거나 CDN 캐시에서 제외해야 합니다.",
    },
    // === 모니터링과 운영 ===
    {
      id: "final-q15",
      question:
        "프론트엔드 성능 모니터링에서 Core Web Vitals(LCP, FID/INP, CLS)를 추적하는 이유는?",
      choices: [
        "SEO 순위에만 영향을 미치기 때문이다",
        "실제 사용자 경험을 정량적으로 측정하여 로딩 속도, 인터랙션 반응성, 시각적 안정성을 개선할 수 있고 검색 엔진 순위에도 영향을 준다",
        "서버 비용을 줄이기 위해서이다",
        "브라우저 호환성을 테스트하기 위해서이다",
      ],
      correctIndex: 1,
      explanation:
        "Core Web Vitals는 사용자 경험의 세 가지 핵심 측면을 측정합니다. LCP(로딩), INP(인터랙션), CLS(시각적 안정성). 이 지표들은 실제 사용자 데이터(RUM)로 수집하며, Google 검색 순위 요소이기도 합니다.",
    },
    {
      id: "final-q16",
      question:
        "프로덕션에서 JavaScript 에러 모니터링 시, Sentry에 소스맵을 업로드하되 사용자 브라우저에는 소스맵을 노출하지 않으려면 어떻게 해야 하는가?",
      choices: [
        "소스맵을 아예 생성하지 않는다",
        "빌드 시 소스맵을 생성하여 Sentry에 업로드한 후, 배포 전에 소스맵 파일을 삭제하거나 서빙하지 않도록 설정한다",
        "소스맵을 .env 파일에 넣는다",
        "sourceMappingURL 주석만 제거하면 된다",
      ],
      correctIndex: 1,
      explanation:
        "소스맵을 Sentry에 업로드하면 에러 스택 트레이스를 원본 코드로 매핑할 수 있습니다. 배포 시 .map 파일을 서빙하지 않거나 삭제하면 사용자 브라우저에서 원본 코드를 볼 수 없어 보안을 유지할 수 있습니다.",
    },
    {
      id: "final-q17",
      question:
        "서비스의 SLO가 '99.9% 가용성'일 때, 한 달(30일) 동안 허용되는 최대 다운타임은 약 얼마인가?",
      choices: [
        "약 8시간 45분",
        "약 43분",
        "약 4분 23초",
        "약 7분 12초",
      ],
      correctIndex: 1,
      explanation:
        "99.9% 가용성은 0.1%의 다운타임을 허용합니다. 30일 × 24시간 × 60분 = 43,200분, 0.1%는 약 43.2분입니다. 이는 한 달 동안 약 43분의 다운타임만 허용한다는 의미입니다.",
    },
    // === 종합 시나리오 ===
    {
      id: "final-q18",
      question:
        "스타트업에서 프론트엔드 인프라를 처음 구축한다. Next.js 앱을 배포하고, CI/CD를 설정하며, 에러 모니터링을 도입해야 한다. 가장 빠르게 구축할 수 있는 스택은?",
      choices: [
        "AWS EC2 + Jenkins + ELK Stack",
        "Vercel(배포) + GitHub Actions(CI/CD) + Sentry(에러 모니터링) — 관리형 서비스를 활용하여 인프라 운영 부담을 최소화한다",
        "직접 서버 구축 + 수동 배포 + console.log 모니터링",
        "Heroku + CircleCI + New Relic",
      ],
      correctIndex: 1,
      explanation:
        "Vercel은 Next.js에 최적화된 배포 플랫폼이고, GitHub Actions는 무료 CI/CD를 제공하며, Sentry는 프론트엔드 에러 모니터링에 특화되어 있습니다. 세 도구 모두 빠른 설정과 무료 플랜을 제공하여 스타트업에 적합합니다.",
    },
    {
      id: "final-q19",
      question:
        "대규모 모노레포에서 프론트엔드 CI 파이프라인이 30분 이상 걸린다. 빌드 시간을 5분 이내로 줄이기 위한 종합적인 전략으로 가장 적절한 것은?",
      choices: [
        "더 강력한 CI 서버를 구매한다",
        "Turborepo의 원격 캐시로 변경되지 않은 패키지 빌드를 건너뛰고, 영향 받는 패키지만 빌드하며, lint/test/build를 병렬 job으로 실행하고, Docker 레이어 캐싱을 활용한다",
        "테스트를 모두 제거하고 린트만 실행한다",
        "모노레포를 멀티레포로 분리한다",
      ],
      correctIndex: 1,
      explanation:
        "Turborepo 원격 캐시는 이전 빌드 결과를 재사용하고, 변경 감지로 영향 받는 패키지만 빌드합니다. CI에서 독립적인 태스크를 병렬 실행하고, Docker 레이어 캐시로 의존성 설치를 캐싱하면 빌드 시간을 크게 단축할 수 있습니다.",
    },
    {
      id: "final-q20",
      question:
        "프로덕션 배포 후 특정 사용자 그룹에서만 흰 화면(White Screen)이 보고되었다. 원인을 체계적으로 진단하기 위한 접근 순서로 가장 적절한 것은?",
      choices: [
        "코드를 롤백한다",
        "Sentry에서 해당 시점의 에러 로그와 브라우저/OS 정보를 확인하고, 소스맵으로 원본 코드 위치를 파악한 뒤, 해당 환경에서 재현하여 polyfill 누락이나 API 호환성 문제를 수정한다",
        "모든 사용자에게 브라우저를 업데이트하라고 공지한다",
        "해당 사용자들의 접속을 차단한다",
      ],
      correctIndex: 1,
      explanation:
        "체계적 진단은 모니터링 데이터에서 시작합니다. Sentry의 에러 로그로 어떤 브라우저/OS에서 발생하는지 확인하고, 소스맵으로 원인 코드를 특정한 뒤, 해당 환경을 재현하여 수정합니다. 특정 그룹에서만 발생하면 브라우저 호환성(polyfill)이 원인일 가능성이 높습니다.",
    },
  ],
};

export default finalExam;
