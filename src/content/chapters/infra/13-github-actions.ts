import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "13-github-actions",
  subject: "infra",
  title: "GitHub Actions 실전",
  description:
    "GitHub Actions의 워크플로우 구조, 트리거, 캐싱, 매트릭스 빌드, 시크릿 관리를 학습하고 실무 CI/CD 파이프라인을 구축합니다.",
  order: 13,
  group: "CI/CD",
  prerequisites: ["12-cicd-concepts"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "GitHub Actions는 **자동화된 공장 라인**과 같습니다.\n\n" +
        "**워크플로우(Workflow)**는 공장의 생산 라인 전체입니다. `.github/workflows/` 폴더에 YAML 파일로 정의하며, 하나의 공장에 여러 생산 라인을 둘 수 있습니다.\n\n" +
        "**트리거(on)**는 생산 라인의 시작 버튼입니다. 누군가 코드를 push하거나 PR을 올리면 자동으로 버튼이 눌립니다. schedule로 매일 아침 자동 시작을 걸 수도 있고, workflow_dispatch로 수동 버튼을 만들 수도 있습니다.\n\n" +
        "**잡(Jobs)**은 생산 라인의 각 스테이션입니다. 린트 스테이션, 테스트 스테이션, 빌드 스테이션이 독립적으로 또는 순서대로 동작합니다.\n\n" +
        "**스텝(Steps)**은 각 스테이션에서 수행하는 작업 단위입니다. 코드 체크아웃, Node.js 설치, npm install 같은 구체적인 동작 하나하나가 스텝입니다.\n\n" +
        "**액션(Actions)**은 미리 만들어진 로봇 팔입니다. `actions/checkout`은 코드를 가져오는 로봇, `actions/setup-node`는 Node.js를 설치하는 로봇입니다. 남이 만든 로봇을 가져다 쓸 수도 있고, 직접 만들 수도 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "CI/CD 개념을 알았지만, 실제로 파이프라인을 구축하려면 여러 과제가 있습니다.\n\n" +
        "1. **수동 작업의 반복** — 매번 lint, test, build를 수동으로 실행하면 실수가 생기고 시간이 낭비됩니다. PR마다 \"테스트 돌렸어?\"라고 물어봐야 하는 상황이 발생합니다.\n\n" +
        "2. **환경 일관성** — 개발자마다 Node 버전이 다르고, OS가 다릅니다. \"내 컴퓨터에선 되는데?\"가 반복됩니다.\n\n" +
        "3. **시크릿 관리** — 배포 키, API 토큰 같은 민감 정보를 코드에 넣으면 보안 사고가 납니다. 하지만 CI에서는 이 값들이 필요합니다.\n\n" +
        "4. **빌드 시간** — `npm install`만 해도 수 분이 걸립니다. PR마다 처음부터 설치하면 개발 속도가 크게 떨어집니다.\n\n" +
        "5. **다양한 환경 테스트** — Node 18, 20, 22에서 모두 동작하는지, macOS와 Linux에서 모두 괜찮은지 확인하려면 수작업이 비현실적입니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "GitHub Actions는 이런 문제들을 YAML 기반 워크플로우로 해결합니다.\n\n" +
        "### 워크플로우 YAML 구조\n" +
        "모든 워크플로우는 `name`, `on`(트리거), `jobs`로 구성됩니다. jobs 안에 여러 job을 정의하고, 각 job은 `runs-on`(실행 환경)과 `steps`(단계)를 가집니다.\n\n" +
        "### 트리거 종류\n" +
        "- `push`: 특정 브랜치에 push될 때\n" +
        "- `pull_request`: PR이 열리거나 업데이트될 때\n" +
        "- `schedule`: cron 표현식으로 주기적 실행\n" +
        "- `workflow_dispatch`: 수동 실행 (입력값 받기 가능)\n\n" +
        "### 캐싱으로 속도 향상\n" +
        "`actions/cache`를 사용하면 `~/.npm`(npm 캐시 디렉토리)이나 `.next/cache`를 캐시할 수 있습니다. `actions/setup-node`의 `cache: \"npm\"` 옵션도 `~/.npm`을 캐시합니다 (`node_modules`가 아닌 npm 캐시). 캐시 히트 시에도 `npm ci`는 실행되지만, 패키지를 네트워크 대신 캐시에서 가져오므로 빠릅니다. 캐시 키에 `package-lock.json`의 해시를 사용하면, 의존성이 변경될 때만 캐시를 갱신합니다.\n\n" +
        "### 매트릭스 빌드\n" +
        "`strategy.matrix`를 사용하면 여러 Node 버전, OS 조합을 한 번에 테스트할 수 있습니다. 3개 Node 버전 x 2개 OS = 6개 작업이 병렬 실행됩니다.\n\n" +
        "### 시크릿 관리\n" +
        "리포지토리 Settings > Secrets에 민감 정보를 등록하고, `${{ secrets.MY_SECRET }}`으로 참조합니다. 로그에 자동 마스킹되어 안전합니다.\n\n" +
        "### 재사용 가능한 워크플로우\n" +
        "`workflow_call` 트리거로 워크플로우를 함수처럼 만들어 다른 워크플로우에서 호출할 수 있습니다. 모노레포에서 공통 CI 로직을 관리할 때 유용합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 워크플로우 YAML 구조",
      content:
        "실무에서 가장 많이 사용하는 lint → test → build → deploy 파이프라인의 전체 구조를 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// .github/workflows/ci.yml 의 구조를 의사코드로 표현\n' +
          '\n' +
          '워크플로우 "CI/CD Pipeline":\n' +
          '  트리거:\n' +
          '    - push → main 브랜치\n' +
          '    - pull_request → main 브랜치\n' +
          '\n' +
          '  잡 1: "lint-and-test"\n' +
          '    실행환경: ubuntu-latest\n' +
          '    스텝:\n' +
          '      1. actions/checkout@v4       // 코드 체크아웃\n' +
          '      2. actions/setup-node@v4     // Node.js 설치\n' +
          '         with: node-version: 20\n' +
          '      3. actions/cache@v4          // node_modules 캐시\n' +
          '         key: deps-${{ hashFiles("package-lock.json") }}\n' +
          '      4. run: npm ci               // 의존성 설치\n' +
          '      5. run: npm run lint         // 린트 검사\n' +
          '      6. run: npm run test         // 테스트 실행\n' +
          '\n' +
          '  잡 2: "build"\n' +
          '    의존: lint-and-test (성공 시에만)\n' +
          '    실행환경: ubuntu-latest\n' +
          '    스텝:\n' +
          '      1. 코드 체크아웃 + Node 설치 + 캐시\n' +
          '      2. run: npm run build\n' +
          '      3. 빌드 결과물을 artifact로 업로드\n' +
          '\n' +
          '  잡 3: "deploy"\n' +
          '    의존: build (성공 시에만)\n' +
          '    조건: github.ref == "refs/heads/main"\n' +
          '    실행환경: ubuntu-latest\n' +
          '    스텝:\n' +
          '      1. 빌드 artifact 다운로드\n' +
          '      2. 배포 실행 (시크릿 사용)\n' +
          '         env: DEPLOY_TOKEN = ${{ secrets.DEPLOY_TOKEN }}',
        description:
          "jobs 간 needs로 의존 관계를 설정하고, if 조건으로 특정 브랜치에서만 배포합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 매트릭스 빌드와 캐싱",
      content:
        "여러 Node 버전에서 테스트하고, 캐싱으로 빌드 시간을 단축하는 실전 워크플로우입니다.",
      code: {
        language: "typescript",
        code:
          '// .github/workflows/test.yml\n' +
          '// name: Test Matrix\n' +
          '// on:\n' +
          '//   pull_request:\n' +
          '//     branches: [main]\n' +
          '//\n' +
          '// jobs:\n' +
          '//   test:\n' +
          '//     runs-on: ${{ matrix.os }}\n' +
          '//     strategy:\n' +
          '//       matrix:\n' +
          '//         node-version: [18, 20, 22]\n' +
          '//         os: [ubuntu-latest, macos-latest]\n' +
          '//       fail-fast: false  # 하나 실패해도 나머지 계속\n' +
          '//     steps:\n' +
          '//       - uses: actions/checkout@v4\n' +
          '//       - uses: actions/setup-node@v4\n' +
          '//         with:\n' +
          '//           node-version: ${{ matrix.node-version }}\n' +
          '//           cache: "npm"  # setup-node 내장 캐시 기능\n' +
          '//       - run: npm ci\n' +
          '//       - run: npm test\n' +
          '\n' +
          '// === 커스텀 캐시로 더 세밀하게 제어 ===\n' +
          '// - uses: actions/cache@v4\n' +
          '//   id: npm-cache\n' +
          '//   with:\n' +
          '//     path: ~/.npm\n' +
          '//     key: ${{ runner.os }}-npm-${{ hashFiles("**/package-lock.json") }}\n' +
          '//     restore-keys: |\n' +
          '//       ${{ runner.os }}-npm-\n' +
          '//\n' +
          '// === 캐시 히트 여부에 따른 조건부 스텝 ===\n' +
          '// - if: steps.npm-cache.outputs.cache-hit != \'true\'\n' +
          '//   run: npm ci',
        description:
          "matrix로 6개 조합(3 Node x 2 OS)을 병렬 테스트하고, cache로 npm install 시간을 절약합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "GitHub Actions는 `.github/workflows/`에 YAML 파일로 CI/CD를 정의합니다.\n\n" +
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| Workflow | YAML 파일 하나 = 하나의 자동화 파이프라인 |\n" +
        "| Trigger | push, PR, schedule, workflow_dispatch |\n" +
        "| Job | 독립 실행 단위, needs로 의존 관계 설정 |\n" +
        "| Step | 각 job 내의 개별 작업 단위 |\n" +
        "| Action | 재사용 가능한 단위 (checkout, setup-node 등) |\n" +
        "| Cache | ~/.npm 등을 캐시하여 빌드 시간 단축 |\n" +
        "| Matrix | 여러 환경 조합을 병렬 테스트 |\n" +
        "| Secrets | 민감 정보를 안전하게 관리 |\n\n" +
        "**핵심:** PR 기반의 lint → test → build → deploy 파이프라인을 구축하면, 코드 품질 검증이 자동화되어 안심하고 머지할 수 있습니다. 캐싱은 빌드 시간을 50% 이상 단축시키는 핵심 최적화입니다.\n\n" +
        "**다음 챕터 미리보기:** CI/CD로 빌드된 결과물을 어디에 배포할지, 주요 배포 플랫폼들을 비교합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "GitHub Actions는 .github/workflows에 YAML로 CI/CD를 정의한다. push/PR 트리거로 린트→테스트→빌드→배포를 자동화하고, 캐싱으로 빌드 시간을 단축한다.",
  checklist: [
    "워크플로우 YAML의 on, jobs, steps 구조를 설명할 수 있다",
    "push, pull_request, schedule 트리거의 차이를 이해한다",
    "actions/cache를 활용하여 빌드 시간을 최적화할 수 있다",
    "매트릭스 빌드로 여러 환경을 병렬 테스트할 수 있다",
    "시크릿을 안전하게 관리하고 워크플로우에서 참조할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "GitHub Actions 워크플로우 파일은 어디에 위치해야 하는가?",
      choices: [
        ".github/actions/",
        ".github/workflows/",
        ".ci/workflows/",
        "workflows/",
      ],
      correctIndex: 1,
      explanation:
        "GitHub Actions 워크플로우 파일은 반드시 .github/workflows/ 디렉토리에 YAML 형식으로 위치해야 합니다.",
    },
    {
      id: "q2",
      question:
        "워크플로우를 수동으로 실행할 수 있게 하는 트리거는?",
      choices: [
        "push",
        "workflow_run",
        "workflow_dispatch",
        "repository_dispatch",
      ],
      correctIndex: 2,
      explanation:
        "workflow_dispatch는 GitHub UI에서 수동으로 워크플로우를 실행할 수 있게 하며, 입력 파라미터도 받을 수 있습니다.",
    },
    {
      id: "q3",
      question:
        "actions/cache에서 캐시 키에 package-lock.json의 해시를 사용하는 이유는?",
      choices: [
        "보안을 위해",
        "의존성 변경 시에만 캐시를 갱신하기 위해",
        "캐시 크기를 줄이기 위해",
        "병렬 실행을 위해",
      ],
      correctIndex: 1,
      explanation:
        "package-lock.json의 해시를 키로 사용하면, 의존성이 변경되었을 때만 새 캐시가 생성되고, 변경이 없으면 기존 캐시를 재사용합니다.",
    },
    {
      id: "q4",
      question:
        "매트릭스 빌드에서 node-version: [18, 20], os: [ubuntu-latest, macos-latest]로 설정하면 총 몇 개의 작업이 실행되는가?",
      choices: ["2개", "3개", "4개", "6개"],
      correctIndex: 2,
      explanation:
        "매트릭스는 모든 조합의 곱으로 작업을 생성합니다. 2개 Node 버전 x 2개 OS = 4개 작업이 병렬 실행됩니다.",
    },
    {
      id: "q5",
      question:
        "jobs 간 실행 순서를 지정하는 키워드는?",
      choices: ["depends_on", "needs", "requires", "after"],
      correctIndex: 1,
      explanation:
        "needs 키워드로 job 간 의존 관계를 설정합니다. needs: [lint, test]로 설정하면 lint와 test가 모두 성공한 후에 해당 job이 실행됩니다.",
    },
  ],
};

export default chapter;
