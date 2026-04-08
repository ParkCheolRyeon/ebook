import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-01",
  title: "중간 점검 1: Git ~ 빌드",
  coverGroups: ["Git 심화", "패키지 관리", "빌드와 번들링"],
  questions: [
    {
      id: "mid01-q1",
      question:
        "팀에서 릴리스 주기가 2주이고, develop/release/hotfix 브랜치를 체계적으로 관리해야 하는 상황이다. 가장 적합한 브랜치 전략은?",
      choices: [
        "GitHub Flow — main에서 바로 feature 브랜치를 만들고 PR 후 머지한다",
        "Git Flow — develop, release, hotfix 등 역할별 브랜치를 두어 릴리스를 체계적으로 관리한다",
        "Trunk Based Development — 모든 개발자가 main에 직접 커밋한다",
        "각 개발자가 자신만의 브랜치를 영구적으로 유지한다",
      ],
      correctIndex: 1,
      explanation:
        "Git Flow는 develop, release, hotfix 등 명확한 역할의 브랜치를 두어 정기 릴리스 주기가 있는 팀에 적합합니다. GitHub Flow는 지속적 배포 환경에, Trunk Based Development는 짧은 피처 사이클에 더 어울립니다.",
    },
    {
      id: "mid01-q2",
      question:
        "feature 브랜치를 main에 통합할 때 rebase와 merge의 차이점에 대한 설명으로 올바른 것은?",
      choices: [
        "rebase는 머지 커밋을 생성하고, merge는 히스토리를 선형으로 만든다",
        "rebase는 히스토리를 선형으로 재정렬하며, merge는 머지 커밋을 생성하여 브랜치 이력을 보존한다",
        "rebase와 merge는 결과가 완전히 동일하며 차이가 없다",
        "rebase는 공유 브랜치에서 사용하는 것이 권장된다",
      ],
      correctIndex: 1,
      explanation:
        "rebase는 커밋을 대상 브랜치 위로 재배치하여 선형 히스토리를 만들고, merge는 머지 커밋을 생성하여 브랜치 합류 지점을 명시적으로 남깁니다. rebase는 이미 push된 공유 브랜치에서는 히스토리를 재작성하므로 주의가 필요합니다.",
    },
    {
      id: "mid01-q3",
      question:
        "프로덕션에서 갑자기 버그가 발생했는데, 최근 50개의 커밋 중 어느 시점에서 문제가 생겼는지 모른다. 가장 효율적으로 원인 커밋을 찾는 방법은?",
      choices: [
        "모든 커밋을 하나씩 checkout하여 테스트한다",
        "git bisect를 사용하여 이진 탐색으로 문제 커밋을 찾는다",
        "git log로 커밋 메시지를 읽고 추측한다",
        "git blame으로 모든 파일을 확인한다",
      ],
      correctIndex: 1,
      explanation:
        "git bisect는 이진 탐색 알고리즘을 사용하여 good/bad 커밋 사이에서 문제를 도입한 커밋을 빠르게 찾습니다. 50개 커밋도 약 6번의 테스트로 원인을 특정할 수 있습니다.",
    },
    {
      id: "mid01-q4",
      question:
        "코드 리뷰에서 가장 중요하게 확인해야 할 사항은?",
      choices: [
        "코드 스타일이 개인 취향에 맞는지 확인한다",
        "로직의 정확성, 엣지 케이스 처리, 보안 취약점, 성능 문제를 체계적으로 검토한다",
        "코드 줄 수가 최소인지 확인한다",
        "모든 변수명이 한 글자인지 확인한다",
      ],
      correctIndex: 1,
      explanation:
        "효과적인 코드 리뷰는 로직 오류, 엣지 케이스, 보안, 성능 등 코드 품질의 핵심 측면을 검토합니다. 코드 스타일은 린터/포매터에 맡기고, 리뷰어는 비즈니스 로직과 아키텍처에 집중해야 합니다.",
    },
    {
      id: "mid01-q5",
      question:
        "모노레포에서 여러 패키지가 동일한 의존성을 사용할 때, npm 대비 pnpm이 디스크 공간을 절약하는 핵심 원리는?",
      choices: [
        "의존성을 압축하여 저장한다",
        "content-addressable 저장소에 패키지를 한 번만 저장하고 심볼릭 링크로 참조한다",
        "사용하지 않는 의존성을 자동 삭제한다",
        "node_modules를 생성하지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "pnpm은 글로벌 content-addressable 저장소에 패키지를 한 번만 다운로드하고, 각 프로젝트의 node_modules에는 하드 링크/심볼릭 링크로 연결합니다. 이로 인해 디스크 공간과 설치 속도 모두 크게 개선됩니다.",
    },
    {
      id: "mid01-q6",
      question:
        "Turborepo가 모노레포에서 빌드 속도를 크게 높이는 핵심 메커니즘은?",
      choices: [
        "모든 패키지를 하나의 번들로 합친다",
        "태스크 의존 그래프를 분석하여 병렬 실행하고, 원격 캐시로 이전 빌드 결과를 재사용한다",
        "TypeScript 컴파일을 건너뛴다",
        "개발 서버만 최적화한다",
      ],
      correctIndex: 1,
      explanation:
        "Turborepo는 패키지 간 태스크 의존 관계를 파악하여 독립적인 태스크를 병렬 실행하고, 입력이 변경되지 않은 태스크는 로컬/원격 캐시를 통해 건너뜁니다. 이로 인해 CI/CD에서도 빌드 시간이 크게 단축됩니다.",
    },
    {
      id: "mid01-q7",
      question:
        "Webpack, Rollup, esbuild 등 모듈 번들러의 근본적인 역할은?",
      choices: [
        "HTML 파일을 자동 생성한다",
        "여러 모듈/파일의 의존성 그래프를 분석하고 하나 이상의 최적화된 번들로 합쳐 브라우저가 효율적으로 로드하게 한다",
        "테스트 코드를 실행한다",
        "서버를 시작한다",
      ],
      correctIndex: 1,
      explanation:
        "모듈 번들러는 import/require로 연결된 모듈의 의존성 그래프를 분석하고, 코드 분할·압축·최적화를 수행하여 브라우저가 효율적으로 로드할 수 있는 번들을 생성합니다.",
    },
    {
      id: "mid01-q8",
      question:
        "Tree Shaking이 제대로 동작하기 위한 전제 조건으로 가장 중요한 것은?",
      choices: [
        "CommonJS(require/module.exports) 모듈 시스템을 사용해야 한다",
        "ES Module(import/export)을 사용해야 정적 분석으로 사용하지 않는 코드를 제거할 수 있다",
        "모든 함수에 JSDoc 주석을 달아야 한다",
        "번들러 설정에서 명시적으로 제거할 함수 목록을 지정해야 한다",
      ],
      correctIndex: 1,
      explanation:
        "Tree Shaking은 ES Module의 정적 import/export 구조를 분석하여 실제 사용되지 않는 코드를 제거합니다. CommonJS는 동적이라 정적 분석이 어렵기 때문에 tree shaking이 효과적으로 동작하지 않습니다.",
    },
    {
      id: "mid01-q9",
      question:
        "Vite가 개발 환경에서 Webpack보다 빠른 서버 시작을 제공하는 핵심 원리는?",
      choices: [
        "개발 환경에서도 전체 번들을 미리 생성한다",
        "네이티브 ES Module을 브라우저에 직접 제공하여 번들링 없이 요청 시 변환(transform)만 수행한다",
        "TypeScript를 무시한다",
        "캐시를 사용하지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "Vite는 개발 시 번들링을 하지 않고 브라우저의 네이티브 ESM을 활용합니다. 각 모듈을 요청 시점에 변환만 하므로 프로젝트 크기에 관계없이 서버 시작이 빠릅니다. 프로덕션 빌드에서는 Rollup으로 번들링합니다.",
    },
    {
      id: "mid01-q10",
      question:
        "프로덕션 빌드에서 번들 크기를 줄이기 위한 최적화 기법으로 적절하지 않은 것은?",
      choices: [
        "코드 스플리팅으로 초기 로드에 필요한 코드만 먼저 전송한다",
        "Terser/esbuild를 사용하여 코드를 압축(minify)한다",
        "모든 의존성을 devDependencies에 넣어 빌드에서 제외한다",
        "dynamic import를 활용하여 특정 기능을 지연 로딩한다",
      ],
      correctIndex: 2,
      explanation:
        "devDependencies에 넣는다고 빌드에서 제외되지 않습니다. 번들러는 실제 import된 코드를 기준으로 번들을 생성합니다. 코드 스플리팅, 압축, 지연 로딩이 올바른 최적화 기법입니다.",
    },
  ],
};

export default midQuiz;
