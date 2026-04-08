import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "03-code-review",
  subject: "infra",
  title: "코드 리뷰와 PR 관리",
  description:
    "좋은 PR을 작성하고 효과적으로 코드 리뷰하는 방법, 자동화 전략, 그리고 팀 협업 문화를 배웁니다.",
  order: 3,
  group: "Git 심화",
  prerequisites: ["02-git-advanced"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "코드 리뷰는 요리사들의 맛보기 과정과 같습니다.\n\n" +
        "**PR(Pull Request)**은 새로운 레시피를 제출하는 것입니다. " +
        "어떤 재료를 왜 사용했는지(변경 이유), 어떤 맛을 목표로 했는지(목적), " +
        "알레르기 유발 성분은 없는지(사이드 이펙트)를 명확히 적어야 다른 요리사가 평가할 수 있습니다.\n\n" +
        "**코드 리뷰**는 시식 과정입니다. 다른 요리사가 맛을 보고 '소금을 좀 더 넣으면 어떨까요?'(제안), " +
        "'이 재료는 왜 넣었나요?'(질문), '이 재료는 알레르기를 유발하니 반드시 바꿔야 합니다'(필수 수정)처럼 " +
        "단계별 피드백을 제공합니다.\n\n" +
        "**CODEOWNERS**는 각 코스의 담당 셰프를 지정하는 것입니다. " +
        "디저트(UI 컴포넌트) 변경은 반드시 디저트 전문 셰프의 승인이 필요합니다.\n\n" +
        "좋은 레스토랑이 시식 과정 없이 요리를 내지 않듯, " +
        "좋은 팀은 리뷰 없이 코드를 배포하지 않습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "코드 리뷰가 제대로 이루어지지 않으면 다양한 문제가 발생합니다.\n\n" +
        "1. **거대한 PR** — 파일 50개, 변경 2000줄짜리 PR은 아무도 제대로 리뷰하지 않습니다. " +
        "'LGTM'이라는 형식적 승인만 받게 되고, 버그가 그대로 머지됩니다.\n\n" +
        "2. **맥락 없는 PR** — 'UI 수정'이라는 제목과 코드만 덩그러니 있으면, " +
        "리뷰어는 왜 이 변경이 필요한지, 어떤 시나리오를 테스트해야 하는지 모릅니다.\n\n" +
        "3. **감정적 리뷰** — '이게 뭡니까?' 같은 공격적인 코멘트는 팀 분위기를 해칩니다. " +
        "반대로 문제를 지적하지 못하는 너무 관대한 리뷰도 코드 품질을 떨어뜨립니다.\n\n" +
        "4. **반복되는 지적** — 매번 포맷팅, 린트 규칙, 타입 에러를 리뷰에서 지적하는 것은 " +
        "사람이 할 일이 아닙니다. 자동화할 수 있는 검사를 수동으로 하는 것은 시간 낭비입니다.\n\n" +
        "5. **리뷰 병목** — 특정 시니어 개발자만 리뷰를 할 수 있어 PR이 며칠씩 대기합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 좋은 PR의 조건\n" +
        "- **작은 단위**: 200~400줄 이하. 하나의 논리적 변경만 포함합니다.\n" +
        "- **명확한 설명**: 무엇을, 왜 변경했는지, 테스트 방법은 무엇인지 기술합니다.\n" +
        "- **스크린샷/영상**: UI 변경이 있다면 before/after 스크린샷을 첨부합니다.\n" +
        "- **자동 검증 통과**: CI(린트, 테스트, 타입 체크)가 통과된 상태로 리뷰를 요청합니다.\n\n" +
        "### 리뷰어 마인드셋\n" +
        "- 코드가 아닌 문제 해결 방식을 리뷰합니다.\n" +
        "- '이렇게 하면 어떨까요?' 형태의 제안을 사용합니다.\n" +
        "- 코멘트를 분류합니다: `[nit]` 사소한 의견, `[question]` 궁금한 점, `[must]` 반드시 수정.\n\n" +
        "### LGTM의 책임\n" +
        "'Looks Good To Me'는 단순한 승인이 아닙니다. " +
        "'이 코드가 프로덕션에 나가도 된다'는 공동 책임의 표현입니다.\n\n" +
        "### Draft PR 활용\n" +
        "구현 초기에 Draft PR을 열어 설계 방향에 대한 피드백을 미리 받을 수 있습니다. " +
        "완성 후 리뷰받는 것보다 초기에 방향을 잡는 것이 효율적입니다.\n\n" +
        "### 자동화\n" +
        "포맷팅, 린트, 타입 체크, 테스트는 CI에서 자동으로 실행하여 " +
        "리뷰어가 로직과 설계에 집중할 수 있도록 합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: PR 템플릿과 CODEOWNERS",
      content:
        "PR 템플릿과 CODEOWNERS 파일을 설정하면 일관된 PR 작성과 자동 리뷰어 지정이 가능합니다. " +
        "GitHub Actions로 PR 관련 자동화를 구현할 수도 있습니다.",
      code: {
        language: "typescript",
        code:
          '// === .github/pull_request_template.md ===\n' +
          'const prTemplate = `\n' +
          '## 변경 사항\n' +
          '<!-- 무엇을 변경했나요? -->\n' +
          '\n' +
          '## 변경 이유\n' +
          '<!-- 왜 이 변경이 필요한가요? 관련 이슈: #000 -->\n' +
          '\n' +
          '## 테스트 방법\n' +
          '<!-- 어떻게 테스트할 수 있나요? -->\n' +
          '- [ ] 단위 테스트 추가/수정\n' +
          '- [ ] 수동 테스트 완료\n' +
          '\n' +
          '## 스크린샷 (UI 변경 시)\n' +
          '| Before | After |\n' +
          '|--------|-------|\n' +
          '|        |       |\n' +
          '\n' +
          '## 체크리스트\n' +
          '- [ ] 셀프 리뷰 완료\n' +
          '- [ ] 타입 에러 없음\n' +
          '- [ ] 불필요한 console.log 제거\n' +
          '`;\n' +
          '\n' +
          '// === CODEOWNERS 파일 (.github/CODEOWNERS) ===\n' +
          '// 파일/디렉토리별 리뷰어를 자동 지정\n' +
          'const codeowners = `\n' +
          '# 전체 코드 기본 리뷰어\n' +
          '*                       @frontend-team\n' +
          '\n' +
          '# 디렉토리별 담당자\n' +
          '/src/components/        @ui-team\n' +
          '/src/hooks/             @core-team\n' +
          '/src/api/               @api-team\n' +
          '/src/styles/            @design-system-team\n' +
          '\n' +
          '# 설정 파일 - 시니어 리뷰 필수\n' +
          'package.json            @tech-lead\n' +
          'tsconfig.json           @tech-lead\n' +
          '.github/                @devops-team\n' +
          '`;\n' +
          '\n' +
          '// === Branch Protection 설정 (GitHub Settings) ===\n' +
          '// - Require pull request reviews: 최소 1명\n' +
          '// - Require status checks: lint, test, type-check\n' +
          '// - Require CODEOWNERS review\n' +
          '// - Dismiss stale reviews on new pushes',
        description:
          "PR 템플릿으로 일관된 PR 작성을, CODEOWNERS로 자동 리뷰어 지정을 구현합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 코드 리뷰 코멘트 작성법",
      content:
        "좋은 코드 리뷰 코멘트와 나쁜 코멘트를 비교하고, GitHub의 Suggestion 기능을 활용하는 방법을 실습합니다. " +
        "또한 GitHub Actions를 통한 PR 자동 라벨링을 설정합니다.",
      code: {
        language: "typescript",
        code:
          '// === 나쁜 리뷰 vs 좋은 리뷰 ===\n' +
          '\n' +
          '// ❌ 나쁜 리뷰: "이거 왜 이렇게 했어요?"\n' +
          '// ✅ 좋은 리뷰:\n' +
          '// "[question] 여기서 useEffect 대신 useMemo를 사용한\n' +
          '//  이유가 있나요? 사이드 이펙트가 없어 보여서요."\n' +
          '\n' +
          '// ❌ 나쁜 리뷰: "이건 잘못됐습니다."\n' +
          '// ✅ 좋은 리뷰:\n' +
          '// "[must] 이 API 호출은 에러 핸들링이 없어서\n' +
          '//  네트워크 오류 시 앱이 크래시됩니다.\n' +
          '//  try-catch로 감싸고 사용자에게 에러를 표시하면 좋겠습니다."\n' +
          '\n' +
          '// ❌ 나쁜 리뷰: "변수명이 별로에요."\n' +
          '// ✅ 좋은 리뷰 (GitHub Suggestion 활용):\n' +
          '// "[nit] 변수명이 더 구체적이면 좋겠습니다."\n' +
          '// ```suggestion\n' +
          '// const userProfileData = await fetchProfile(userId);\n' +
          '// ```\n' +
          '\n' +
          '// === GitHub Actions: PR 자동 라벨링 ===\n' +
          '// .github/workflows/pr-labeler.yml\n' +
          'const prLabelerWorkflow = `\n' +
          'name: PR Labeler\n' +
          'on:\n' +
          '  pull_request:\n' +
          '    types: [opened, synchronize]\n' +
          '\n' +
          'jobs:\n' +
          '  label:\n' +
          '    runs-on: ubuntu-latest\n' +
          '    steps:\n' +
          '      - uses: actions/labeler@v5\n' +
          '        with:\n' +
          '          repo-token: \\${{ secrets.GITHUB_TOKEN }}\n' +
          '`;\n' +
          '\n' +
          '// === .github/labeler.yml ===\n' +
          'const labelerConfig = `\n' +
          'frontend:\n' +
          '  - src/components/**\n' +
          '  - src/pages/**\n' +
          'styles:\n' +
          '  - src/styles/**\n' +
          '  - "**/*.css"\n' +
          'tests:\n' +
          '  - "**/*.test.*"\n' +
          '  - "**/*.spec.*"\n' +
          'config:\n' +
          '  - "*.config.*"\n' +
          '  - package.json\n' +
          '`;\n',
        description:
          "리뷰 코멘트의 좋은 예시와 PR 자동 라벨링 GitHub Actions 설정입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 항목 | 좋은 PR | 나쁜 PR |\n" +
        "|------|---------|--------|\n" +
        "| 크기 | 200~400줄 | 2000줄 이상 |\n" +
        "| 설명 | 변경 이유 + 테스트 방법 | 제목만 존재 |\n" +
        "| CI 상태 | 모두 통과 | 실패 상태로 리뷰 요청 |\n" +
        "| 커밋 | 정리된 커밋 | WIP, fix typo 난무 |\n\n" +
        "| 리뷰 접두사 | 의미 | 예시 |\n" +
        "|------------|------|------|\n" +
        "| [nit] | 사소한 의견 | 변수명 제안 |\n" +
        "| [question] | 질문 | 설계 의도 확인 |\n" +
        "| [must] | 필수 수정 | 보안 이슈, 버그 |\n" +
        "| [suggestion] | 개선 제안 | 성능 최적화 |\n\n" +
        "**핵심:** 좋은 PR은 작고, 맥락이 명확하며, 자동화된 검증을 통과한 상태로 리뷰를 요청합니다. " +
        "코드 리뷰는 버그를 잡는 것뿐 아니라 팀의 지식을 공유하는 과정입니다.\n\n" +
        "**다음 챕터 미리보기:** npm, yarn, pnpm의 차이를 배우고 프로젝트에 맞는 " +
        "패키지 매니저를 선택하는 방법을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "좋은 PR은 작고, 맥락이 명확하며, 자동화된 검증을 통과한 상태로 리뷰를 요청한다. 코드 리뷰는 버그를 잡는 것뿐 아니라 팀의 지식을 공유하는 과정이다.",
  checklist: [
    "200~400줄 이하의 작은 단위로 PR을 작성할 수 있다",
    "PR 템플릿을 활용하여 변경 이유와 테스트 방법을 명확히 기술할 수 있다",
    "리뷰 코멘트를 nit, question, must로 구분하여 작성할 수 있다",
    "CODEOWNERS를 설정하여 자동 리뷰어 지정을 구현할 수 있다",
    "Branch Protection으로 머지 조건을 강제할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "좋은 PR의 권장 크기는?",
      choices: [
        "10줄 이하",
        "200~400줄",
        "1000줄 이상",
        "크기는 상관없다",
      ],
      correctIndex: 1,
      explanation:
        "200~400줄이 리뷰어가 집중력을 유지하며 꼼꼼히 리뷰할 수 있는 적정 크기입니다. " +
        "너무 작으면 맥락이 부족하고, 너무 크면 형식적 리뷰가 됩니다.",
    },
    {
      id: "q2",
      question: "CODEOWNERS 파일의 역할은?",
      choices: [
        "코드의 저작권을 명시한다",
        "파일/디렉토리별 리뷰어를 자동으로 지정한다",
        "파일의 접근 권한을 제어한다",
        "코드의 라이선스를 관리한다",
      ],
      correctIndex: 1,
      explanation:
        "CODEOWNERS 파일은 특정 파일이나 디렉토리가 변경될 때 " +
        "자동으로 리뷰어를 지정합니다. 해당 영역의 전문가가 반드시 리뷰하도록 보장합니다.",
    },
    {
      id: "q3",
      question: "Draft PR의 주요 용도는?",
      choices: [
        "완성된 코드를 리뷰 요청하기",
        "구현 초기에 설계 방향에 대한 피드백 받기",
        "자동으로 머지하기",
        "브랜치를 보호하기",
      ],
      correctIndex: 1,
      explanation:
        "Draft PR은 아직 완성되지 않은 작업을 공유하여 초기 피드백을 받을 때 사용합니다. " +
        "완성 후 방향이 잘못되었음을 발견하는 것보다 초기에 방향을 잡는 것이 효율적입니다.",
    },
    {
      id: "q4",
      question: "코드 리뷰에서 [must] 접두사의 의미는?",
      choices: [
        "사소한 스타일 의견",
        "궁금한 점 질문",
        "반드시 수정해야 하는 이슈",
        "다음에 개선할 사항",
      ],
      correctIndex: 2,
      explanation:
        "[must]는 보안 취약점, 버그, 성능 문제 등 반드시 수정해야 하는 이슈를 표시합니다. " +
        "[nit]은 사소한 의견, [question]은 질문으로 구분하여 리뷰의 중요도를 전달합니다.",
    },
    {
      id: "q5",
      question: "LGTM(Looks Good To Me) 승인이 의미하는 것은?",
      choices: [
        "코드를 읽었다는 확인",
        "이 코드가 프로덕션에 나가도 된다는 공동 책임",
        "스타일이 마음에 든다는 표현",
        "추가 리뷰가 필요 없다는 의미",
      ],
      correctIndex: 1,
      explanation:
        "LGTM은 단순한 형식적 승인이 아니라 '이 코드가 프로덕션에 배포되어도 문제없다'는 " +
        "공동 책임의 표현입니다. 따라서 코드를 꼼꼼히 검토한 후에만 승인해야 합니다.",
    },
  ],
};

export default chapter;
