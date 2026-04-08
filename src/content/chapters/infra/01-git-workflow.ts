import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "01-git-workflow",
  subject: "infra",
  title: "Git 브랜치 전략과 워크플로우",
  description:
    "Git Flow, GitHub Flow, Trunk-Based Development를 비교하고 팀에 맞는 브랜치 전략을 선택하는 방법을 배웁니다.",
  order: 1,
  group: "Git 심화",
  prerequisites: [],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Git 브랜치 전략은 도시의 도로 체계와 같습니다.\n\n" +
        "**Git Flow**는 고속도로 시스템입니다. 주요 간선도로(main)와 보조 간선도로(develop)가 있고, " +
        "각 목적지로 향하는 진출입로(feature/release/hotfix)가 체계적으로 설계되어 있습니다. " +
        "교통량이 많고 사고가 나면 안 되는 대도시에 적합하지만, 진출입이 복잡합니다.\n\n" +
        "**GitHub Flow**는 왕복 2차선 도로입니다. main이라는 하나의 큰 길에서 feature 브랜치로 빠졌다가 " +
        "바로 합류합니다. 단순하고 빠르지만, 동시에 많은 차가 합류하면 혼잡해질 수 있습니다.\n\n" +
        "**Trunk-Based Development**는 편도 1차선 고속도로입니다. 모두가 하나의 차선(main)에서 " +
        "아주 짧은 우회로만 거쳐 바로 합류합니다. 속도가 빠르지만 운전 실력(테스트 자동화)이 뛰어나야 합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 팀에서 흔히 겪는 Git 관련 문제들을 살펴봅시다.\n\n" +
        "1. **머지 지옥** — 여러 개발자가 오래된 feature 브랜치에서 작업하다가 합칠 때 대량의 충돌이 발생합니다. " +
        "이는 브랜치 수명이 너무 길거나 통합 주기가 느리기 때문입니다.\n\n" +
        "2. **릴리스 혼란** — '이 기능은 다음 릴리스에 넣고, 저 기능은 이번에 빼야 하는데' 같은 상황에서 " +
        "어떤 커밋이 어디에 포함되는지 추적하기 어렵습니다.\n\n" +
        "3. **핫픽스 적용 어려움** — 프로덕션에서 버그가 발견되었는데, 현재 develop에는 아직 배포하면 안 되는 " +
        "미완성 기능이 포함되어 있습니다. 어디서 브랜치를 따야 할까요?\n\n" +
        "4. **커밋 히스토리 오염** — 'WIP', 'fix typo', 'asdf' 같은 의미 없는 커밋이 난무하여 " +
        "변경 이력을 추적할 수 없습니다.\n\n" +
        "이러한 문제들은 팀이 명확한 브랜치 전략과 커밋 컨벤션을 정하지 않았기 때문에 발생합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### Git Flow\n" +
        "Vincent Driessen이 제안한 전략으로, 5가지 브랜치 유형을 사용합니다.\n\n" +
        "- **main**: 프로덕션에 배포된 코드만 존재. 태그로 버전을 관리합니다.\n" +
        "- **develop**: 다음 릴리스를 위한 통합 브랜치. feature가 여기로 합류합니다.\n" +
        "- **feature/xxx**: 새 기능 개발. develop에서 분기하고 develop으로 머지합니다.\n" +
        "- **release/x.x**: 릴리스 준비. develop에서 분기하여 QA 후 main과 develop 양쪽에 머지합니다.\n" +
        "- **hotfix/xxx**: 긴급 수정. main에서 분기하여 main과 develop 양쪽에 머지합니다.\n\n" +
        "### GitHub Flow\n" +
        "main 브랜치 하나와 feature 브랜치만 사용하는 단순한 전략입니다. " +
        "feature 브랜치에서 PR을 열고, 리뷰와 CI를 통과하면 main에 머지 후 즉시 배포합니다.\n\n" +
        "### Trunk-Based Development\n" +
        "모든 개발자가 main(trunk)에 직접 또는 매우 짧은 수명의 브랜치를 통해 커밋합니다. " +
        "Feature Flag로 미완성 기능을 숨기고, CI/CD가 필수입니다.\n\n" +
        "### 머지 전략\n" +
        "- **Merge commit**: 히스토리를 보존하지만 복잡해집니다.\n" +
        "- **Rebase**: 선형 히스토리를 만들지만, 공유 브랜치에서는 위험합니다.\n" +
        "- **Squash merge**: feature의 모든 커밋을 하나로 합쳐 깔끔한 히스토리를 유지합니다.\n\n" +
        "### Conventional Commits\n" +
        "`feat:`, `fix:`, `chore:`, `docs:`, `refactor:` 등의 접두사로 커밋 메시지를 구조화합니다. " +
        "이를 통해 자동 버전 관리(semantic-release)와 CHANGELOG 생성이 가능합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 브랜치 전략 설정",
      content:
        "실무에서 자주 사용하는 Git 브랜치 전략 설정과 커밋 컨벤션을 살펴봅시다. " +
        "commitlint와 husky를 통해 커밋 메시지 규칙을 자동으로 검증할 수 있습니다.",
      code: {
        language: "typescript",
        code:
          '// === Conventional Commits 형식 ===\n' +
          '// <type>(<scope>): <description>\n' +
          '// feat(auth): 소셜 로그인 기능 추가\n' +
          '// fix(cart): 수량 변경 시 총액 미갱신 수정\n' +
          '// chore(deps): React 18.3으로 업그레이드\n' +
          '\n' +
          '// === commitlint 설정 (commitlint.config.js) ===\n' +
          'const commitlintConfig = {\n' +
          '  extends: ["@commitlint/config-conventional"],\n' +
          '  rules: {\n' +
          '    "type-enum": [\n' +
          '      2, "always",\n' +
          '      ["feat", "fix", "docs", "style", "refactor",\n' +
          '       "perf", "test", "chore", "ci", "build"]\n' +
          '    ],\n' +
          '    "subject-max-length": [2, "always", 72],\n' +
          '    "body-max-line-length": [2, "always", 100],\n' +
          '  },\n' +
          '};\n' +
          '\n' +
          '// === husky + commitlint 설정 ===\n' +
          '// 터미널에서 실행:\n' +
          '// npm install -D @commitlint/cli @commitlint/config-conventional husky\n' +
          '// npx husky init\n' +
          '// echo "npx --no -- commitlint --edit \\$1" > .husky/commit-msg\n' +
          '\n' +
          '// === Git Flow 브랜치 명령어 ===\n' +
          '// git flow init                    # Git Flow 초기화\n' +
          '// git flow feature start login     # feature/login 생성\n' +
          '// git flow feature finish login    # develop에 머지\n' +
          '// git flow release start 1.0.0     # release/1.0.0 생성\n' +
          '// git flow release finish 1.0.0    # main+develop에 머지, 태그 생성',
        description:
          "Conventional Commits와 commitlint로 팀의 커밋 메시지를 일관되게 관리합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: GitHub Flow 워크플로우",
      content:
        "GitHub Flow를 따르는 실제 개발 워크플로우를 단계별로 실습합니다. " +
        "feature 브랜치를 생성하고, 커밋하고, PR을 만들어 머지하는 전체 과정입니다.",
      code: {
        language: "typescript",
        code:
          '// === GitHub Flow 실습 ===\n' +
          '\n' +
          '// 1. 최신 main에서 feature 브랜치 생성\n' +
          '// git checkout main\n' +
          '// git pull origin main\n' +
          '// git checkout -b feat/user-profile\n' +
          '\n' +
          '// 2. 작업 후 Conventional Commit으로 커밋\n' +
          '// git add src/components/UserProfile.tsx\n' +
          '// git commit -m "feat(user): 프로필 컴포넌트 구현"\n' +
          '// git add src/components/UserProfile.test.tsx\n' +
          '// git commit -m "test(user): 프로필 컴포넌트 단위 테스트 추가"\n' +
          '\n' +
          '// 3. 리모트에 푸시하고 PR 생성\n' +
          '// git push -u origin feat/user-profile\n' +
          '// gh pr create --title "feat(user): 프로필 페이지 구현" \\\n' +
          '//   --body "## 변경사항\\n- 프로필 컴포넌트 구현\\n- 단위 테스트 추가"\n' +
          '\n' +
          '// 4. 리뷰 반영 후 Squash Merge\n' +
          '// GitHub에서 "Squash and merge" 클릭\n' +
          '// 또는 CLI로:\n' +
          '// git checkout main\n' +
          '// git merge --squash feat/user-profile\n' +
          '// git commit -m "feat(user): 프로필 페이지 구현 (#42)"\n' +
          '\n' +
          '// 5. 머지된 브랜치 정리\n' +
          '// git branch -d feat/user-profile\n' +
          '// git push origin --delete feat/user-profile\n' +
          '\n' +
          '// === 브랜치 전략 선택 가이드 ===\n' +
          'type TeamSize = "small" | "medium" | "large";\n' +
          'type DeployCycle = "continuous" | "weekly" | "monthly";\n' +
          '\n' +
          'function recommendStrategy(\n' +
          '  teamSize: TeamSize,\n' +
          '  deployCycle: DeployCycle\n' +
          '): string {\n' +
          '  if (deployCycle === "continuous") {\n' +
          '    return teamSize === "large"\n' +
          '      ? "Trunk-Based Development"\n' +
          '      : "GitHub Flow";\n' +
          '  }\n' +
          '  if (deployCycle === "monthly") {\n' +
          '    return "Git Flow";\n' +
          '  }\n' +
          '  return "GitHub Flow";\n' +
          '}',
        description:
          "GitHub Flow의 전체 라이프사이클과 팀 상황에 따른 전략 선택 가이드입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 전략 | 브랜치 수 | 복잡도 | 적합한 상황 |\n" +
        "|------|-----------|--------|-------------|\n" +
        "| Git Flow | 5종 | 높음 | 릴리스 주기 길고 QA 필요 |\n" +
        "| GitHub Flow | 2종 | 낮음 | 지속적 배포, 중소 팀 |\n" +
        "| Trunk-Based | 1~2종 | 매우 낮음 | 빠른 이터레이션, CI/CD 성숙 |\n\n" +
        "| 머지 전략 | 히스토리 | 장점 |\n" +
        "|-----------|----------|------|\n" +
        "| Merge commit | 비선형 | 브랜치 맥락 보존 |\n" +
        "| Rebase | 선형 | 깔끔한 히스토리 |\n" +
        "| Squash merge | 선형 | 기능 단위로 하나의 커밋 |\n\n" +
        "**핵심:** 팀 규모와 배포 주기에 맞는 브랜치 전략을 선택하고, " +
        "Conventional Commits로 커밋 메시지를 구조화하세요. " +
        "대부분의 프론트엔드 팀에는 GitHub Flow + Squash Merge가 좋은 출발점입니다.\n\n" +
        "**다음 챕터 미리보기:** Git 심화 명령어를 배워서 interactive rebase로 커밋을 정리하고, " +
        "bisect로 버그를 추적하고, reflog로 실수를 복구하는 방법을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Git Flow는 릴리스 주기가 긴 프로젝트에, GitHub Flow는 지속적 배포에, Trunk-Based는 빠른 이터레이션에 적합하다. 팀 규모와 배포 주기에 맞는 전략을 선택하라.",
  checklist: [
    "Git Flow, GitHub Flow, Trunk-Based Development의 차이를 설명할 수 있다",
    "main, develop, feature, release, hotfix 브랜치의 역할을 이해한다",
    "Merge, Rebase, Squash Merge의 차이와 적절한 사용 시점을 안다",
    "Conventional Commits 형식으로 커밋 메시지를 작성할 수 있다",
    "팀 상황에 맞는 브랜치 전략을 선택하고 근거를 제시할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "Git Flow에서 프로덕션 긴급 버그를 수정할 때 사용하는 브랜치는?",
      choices: [
        "feature 브랜치",
        "hotfix 브랜치",
        "release 브랜치",
        "develop 브랜치",
      ],
      correctIndex: 1,
      explanation:
        "hotfix 브랜치는 main에서 분기하여 긴급 수정 후 main과 develop 양쪽에 머지합니다. " +
        "develop의 미완성 기능에 영향을 주지 않고 프로덕션 버그를 수정할 수 있습니다.",
    },
    {
      id: "q2",
      question: "GitHub Flow의 핵심 원칙으로 가장 적절한 것은?",
      choices: [
        "develop 브랜치를 통한 통합",
        "main은 항상 배포 가능한 상태 유지",
        "릴리스 브랜치로 QA 진행",
        "최소 3단계의 리뷰 과정",
      ],
      correctIndex: 1,
      explanation:
        "GitHub Flow에서 main 브랜치는 항상 배포 가능한 상태여야 합니다. " +
        "feature 브랜치에서 PR, 리뷰, CI를 통과한 코드만 main에 머지되므로 이 원칙이 유지됩니다.",
    },
    {
      id: "q3",
      question: "Squash Merge의 장점은?",
      choices: [
        "브랜치 히스토리를 완전히 보존한다",
        "머지 충돌이 발생하지 않는다",
        "feature의 여러 커밋을 하나로 합쳐 깔끔한 히스토리를 만든다",
        "자동으로 리베이스가 수행된다",
      ],
      correctIndex: 2,
      explanation:
        "Squash Merge는 feature 브랜치의 모든 커밋을 하나의 커밋으로 합쳐서 main에 추가합니다. " +
        "'WIP', 'fix typo' 같은 중간 커밋이 사라지고 기능 단위의 깔끔한 히스토리가 유지됩니다.",
    },
    {
      id: "q4",
      question: "Conventional Commits에서 'feat(auth): 소셜 로그인 추가'의 scope은?",
      choices: ["feat", "auth", "소셜 로그인 추가", "feat(auth)"],
      correctIndex: 1,
      explanation:
        "Conventional Commits 형식은 <type>(<scope>): <description>입니다. " +
        "type은 'feat', scope은 'auth', description은 '소셜 로그인 추가'입니다. " +
        "scope은 변경 범위를 나타내며 선택 사항입니다.",
    },
    {
      id: "q5",
      question:
        "Trunk-Based Development가 요구하는 필수 조건은?",
      choices: [
        "최소 10명 이상의 개발팀",
        "잘 갖춰진 CI/CD와 자동화 테스트",
        "별도의 QA 팀",
        "Git Flow 경험",
      ],
      correctIndex: 1,
      explanation:
        "Trunk-Based Development에서는 모든 코드가 빠르게 main에 통합되므로, " +
        "자동화된 테스트와 CI/CD가 반드시 필요합니다. 이 안전장치 없이는 main이 쉽게 깨질 수 있습니다.",
    },
  ],
};

export default chapter;
