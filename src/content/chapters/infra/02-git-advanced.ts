import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "02-git-advanced",
  subject: "infra",
  title: "Git 심화 명령어",
  description:
    "interactive rebase, cherry-pick, bisect, reflog 등 Git 고급 명령어를 익혀 효율적으로 히스토리를 관리합니다.",
  order: 2,
  group: "Git 심화",
  prerequisites: ["01-git-workflow"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Git 심화 명령어는 시간 여행자의 도구 상자입니다.\n\n" +
        "**interactive rebase**는 타임라인 편집기입니다. 과거의 사건(커밋)들을 합치거나, " +
        "순서를 바꾸거나, 메시지를 수정할 수 있습니다. 마치 영화 편집자가 장면을 재배열하는 것과 같습니다.\n\n" +
        "**cherry-pick**은 시간의 복사기입니다. 다른 타임라인(브랜치)에서 특정 사건 하나만 골라서 " +
        "현재 타임라인에 복제할 수 있습니다. 전체를 합치지 않고 필요한 것만 가져옵니다.\n\n" +
        "**bisect**는 탐정의 이진 탐색입니다. '범인(버그를 만든 커밋)'이 언제 등장했는지 " +
        "커밋 히스토리의 절반씩을 확인하며 빠르게 찾아냅니다.\n\n" +
        "**reflog**는 시간의 안전망입니다. 실수로 브랜치를 삭제하거나 reset을 잘못해도, " +
        "reflog에는 모든 HEAD 이동 기록이 남아 있어 되돌릴 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 개발자가 Git 기본 명령어만으로는 해결하기 어려운 상황들이 있습니다.\n\n" +
        "1. **지저분한 커밋 히스토리** — feature 브랜치에 'WIP', 'fix', 'oops' 같은 커밋이 " +
        "10개나 쌓여 있습니다. PR 리뷰어가 변경 흐름을 이해하기 어렵습니다.\n\n" +
        "2. **특정 커밋만 가져오기** — 다른 브랜치에 있는 버그 수정 커밋 하나만 현재 브랜치에 " +
        "적용하고 싶은데, 전체 머지는 하고 싶지 않습니다.\n\n" +
        "3. **버그 원인 찾기** — '2주 전까지는 잘 됐는데' 하는 버그가 발생했습니다. " +
        "200개의 커밋 중 어디서 문제가 시작되었는지 하나씩 확인하기엔 시간이 너무 오래 걸립니다.\n\n" +
        "4. **실수 복구** — `git reset --hard`를 잘못 실행해서 작업 중이던 코드가 사라졌습니다. " +
        "커밋하지 않은 변경은 정말 날아간 걸까요?\n\n" +
        "5. **작업 중 임시 전환** — 긴급 이슈가 들어와서 현재 작업을 잠시 치워놓고 다른 브랜치로 " +
        "전환해야 합니다. 커밋하기에는 너무 중간 상태입니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### Interactive Rebase (커밋 정리)\n" +
        "`git rebase -i HEAD~5`로 최근 5개 커밋을 편집할 수 있습니다. " +
        "pick(유지), squash(이전 커밋에 합치기), reword(메시지 수정), drop(삭제), " +
        "edit(커밋 수정) 등의 명령으로 히스토리를 깔끔하게 정리합니다.\n\n" +
        "### Cherry-pick (커밋 선별 적용)\n" +
        "`git cherry-pick <commit-hash>`로 다른 브랜치의 특정 커밋을 현재 브랜치에 적용합니다. " +
        "핫픽스를 여러 브랜치에 적용할 때 유용합니다.\n\n" +
        "### Bisect (버그 이진 탐색)\n" +
        "`git bisect start` → `git bisect bad` → `git bisect good <hash>`로 " +
        "O(log n)으로 버그를 도입한 커밋을 찾습니다. 자동화 스크립트와 결합하면 더욱 강력합니다.\n\n" +
        "### Reflog (실수 복구)\n" +
        "`git reflog`는 HEAD가 이동한 모든 기록을 보여줍니다. " +
        "`git reset --hard HEAD@{3}`처럼 특정 시점으로 되돌릴 수 있습니다.\n\n" +
        "### Stash (임시 저장)\n" +
        "`git stash`로 현재 변경사항을 임시 저장하고, " +
        "`git stash pop`으로 다시 꺼내옵니다. `git stash list`로 목록을 확인합니다.\n\n" +
        "### Reset vs Revert\n" +
        "- **reset**: 커밋을 히스토리에서 제거합니다. 로컬 브랜치에서만 사용해야 합니다.\n" +
        "- **revert**: 기존 커밋을 취소하는 새 커밋을 만듭니다. 공유된 브랜치에서 안전합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Git Hooks 설정",
      content:
        "Git hooks를 활용하면 커밋이나 푸시 전에 자동으로 린트, 테스트, 포맷팅을 실행할 수 있습니다. " +
        "husky와 lint-staged를 조합하면 변경된 파일에만 검사를 적용하여 속도를 유지합니다.",
      code: {
        language: "typescript",
        code:
          '// === Git Hooks의 동작 원리 (의사코드) ===\n' +
          '// .git/hooks/ 디렉토리에 실행 가능한 스크립트가 있으면\n' +
          '// Git이 특정 시점에 자동으로 실행합니다.\n' +
          '\n' +
          '// pre-commit: 커밋 직전에 실행\n' +
          '//   → lint-staged로 변경된 파일만 검사\n' +
          '// commit-msg: 커밋 메시지 작성 후 실행\n' +
          '//   → commitlint로 메시지 형식 검증\n' +
          '// pre-push: 푸시 직전에 실행\n' +
          '//   → 테스트 실행\n' +
          '\n' +
          '// === package.json에 lint-staged 설정 ===\n' +
          'const packageJsonConfig = {\n' +
          '  "lint-staged": {\n' +
          '    "*.{ts,tsx}": [\n' +
          '      "eslint --fix",\n' +
          '      "prettier --write",\n' +
          '      "vitest related --run"\n' +
          '    ],\n' +
          '    "*.{css,scss}": [\n' +
          '      "prettier --write"\n' +
          '    ]\n' +
          '  }\n' +
          '};\n' +
          '\n' +
          '// === husky 설치 및 설정 ===\n' +
          '// npm install -D husky lint-staged\n' +
          '// npx husky init\n' +
          '\n' +
          '// .husky/pre-commit 내용:\n' +
          '// npx lint-staged\n' +
          '\n' +
          '// .husky/pre-push 내용:\n' +
          '// npm run test -- --run\n' +
          '\n' +
          '// === .gitattributes 설정 ===\n' +
          '// *.ts    text eol=lf\n' +
          '// *.tsx   text eol=lf\n' +
          '// *.json  text eol=lf\n' +
          '// *.png   binary\n' +
          '// *.jpg   binary',
        description:
          "husky + lint-staged로 커밋 시 자동 린트/포맷팅을 적용하고, .gitattributes로 파일 처리 방식을 지정합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 심화 명령어 활용",
      content:
        "실무에서 자주 사용하는 Git 심화 명령어들을 시나리오별로 실습합니다. " +
        "interactive rebase로 커밋을 정리하고, bisect로 버그를 찾고, reflog로 실수를 복구해봅시다.",
      code: {
        language: "typescript",
        code:
          '// === 시나리오 1: Interactive Rebase로 커밋 정리 ===\n' +
          '// 현재 커밋 히스토리:\n' +
          '// abc1234 feat: 로그인 폼 구현\n' +
          '// def5678 fix typo\n' +
          '// ghi9012 WIP\n' +
          '// jkl3456 feat: 로그인 API 연동\n' +
          '// mno7890 fix: 에러 핸들링 추가\n' +
          '\n' +
          '// git rebase -i HEAD~5 실행 후 에디터에서:\n' +
          '// pick abc1234 feat: 로그인 폼 구현\n' +
          '// squash def5678 fix typo        ← 위 커밋에 합침\n' +
          '// squash ghi9012 WIP             ← 위 커밋에 합침\n' +
          '// pick jkl3456 feat: 로그인 API 연동\n' +
          '// pick mno7890 fix: 에러 핸들링 추가\n' +
          '// → 5개 커밋이 3개로 정리됨\n' +
          '\n' +
          '// === 시나리오 2: Bisect로 버그 찾기 ===\n' +
          '// git bisect start\n' +
          '// git bisect bad                   # 현재 커밋은 버그 있음\n' +
          '// git bisect good v1.0.0           # 이 태그에선 정상이었음\n' +
          '// → Git이 중간 커밋을 체크아웃\n' +
          '// 테스트 후 git bisect good 또는 git bisect bad 반복\n' +
          '// → 최종적으로 범인 커밋을 찾음\n' +
          '\n' +
          '// 자동화 버전:\n' +
          '// git bisect start HEAD v1.0.0\n' +
          '// git bisect run npm test\n' +
          '// → 테스트가 실패하는 첫 커밋을 자동으로 찾음\n' +
          '\n' +
          '// === 시나리오 3: Reflog로 실수 복구 ===\n' +
          '// git reset --hard HEAD~3  ← 실수로 3개 커밋 날림!\n' +
          '// git reflog\n' +
          '// → abc1234 HEAD@{0}: reset: moving to HEAD~3\n' +
          '// → def5678 HEAD@{1}: commit: feat: 중요한 기능\n' +
          '// git reset --hard HEAD@{1}  ← 복구!\n' +
          '\n' +
          '// === 시나리오 4: Stash 활용 ===\n' +
          '// git stash push -m "로그인 폼 작업 중"\n' +
          '// git checkout hotfix/urgent-bug\n' +
          '// (긴급 수정 작업)\n' +
          '// git checkout feat/login\n' +
          '// git stash pop                    # 저장해둔 작업 복원',
        description:
          "interactive rebase, bisect, reflog, stash를 실무 시나리오에서 활용하는 방법입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 명령어 | 용도 | 핵심 옵션 |\n" +
        "|--------|------|----------|\n" +
        "| rebase -i | 커밋 정리 | pick, squash, reword, drop |\n" +
        "| cherry-pick | 커밋 선별 적용 | --no-commit (적용만, 커밋 안 함) |\n" +
        "| bisect | 버그 이진 탐색 | start, good, bad, run |\n" +
        "| reflog | HEAD 이동 기록 | expire, show |\n" +
        "| stash | 임시 저장 | push, pop, list, drop |\n" +
        "| reset | 커밋 제거 | --soft, --mixed, --hard |\n" +
        "| revert | 커밋 취소 | -n (커밋 안 하고 되돌림) |\n\n" +
        "**핵심:** `git rebase -i`로 커밋을 정리하고, `git bisect`로 버그를 추적하며, " +
        "`git reflog`로 실수를 복구합니다. 공유 브랜치에서는 reset 대신 revert를 사용하세요.\n\n" +
        "**다음 챕터 미리보기:** 코드 리뷰와 PR 관리를 배워서 정리된 커밋을 효과적으로 " +
        "리뷰받고, 팀의 코드 품질을 높이는 방법을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "git rebase -i로 커밋을 정리하고, git bisect로 버그를 이진 탐색하며, git reflog로 실수를 복구한다. 이 세 가지만 알아도 Git 고급 사용자다.",
  checklist: [
    "interactive rebase로 커밋을 squash, reword, drop할 수 있다",
    "cherry-pick으로 다른 브랜치의 특정 커밋을 가져올 수 있다",
    "git bisect로 버그를 도입한 커밋을 찾을 수 있다",
    "git reflog로 실수로 삭제한 커밋을 복구할 수 있다",
    "reset과 revert의 차이를 이해하고 상황에 맞게 사용할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "git rebase -i에서 여러 커밋을 하나로 합치려면 어떤 명령을 사용하는가?",
      choices: ["pick", "squash", "drop", "edit"],
      correctIndex: 1,
      explanation:
        "squash는 해당 커밋을 바로 위(이전) 커밋에 합칩니다. " +
        "커밋 메시지도 합쳐져서 편집할 수 있습니다. fixup은 squash와 비슷하지만 메시지를 버립니다.",
    },
    {
      id: "q2",
      question:
        "공유 브랜치(main)에서 특정 커밋을 취소해야 할 때 사용해야 하는 명령은?",
      choices: [
        "git reset --hard",
        "git revert",
        "git checkout",
        "git clean",
      ],
      correctIndex: 1,
      explanation:
        "git revert는 기존 커밋을 취소하는 새 커밋을 생성합니다. " +
        "히스토리를 변경하지 않으므로 공유 브랜치에서도 안전합니다. " +
        "reset은 히스토리를 변경하므로 공유 브랜치에서는 사용하면 안 됩니다.",
    },
    {
      id: "q3",
      question:
        "git bisect가 1024개의 커밋에서 버그 커밋을 찾는 데 필요한 최대 단계는?",
      choices: ["1024단계", "512단계", "약 10단계", "약 32단계"],
      correctIndex: 2,
      explanation:
        "git bisect는 이진 탐색 알고리즘을 사용하므로 O(log₂ n)입니다. " +
        "log₂(1024) = 10이므로 최대 약 10번의 확인으로 범인 커밋을 찾을 수 있습니다.",
    },
    {
      id: "q4",
      question:
        "git reset --hard를 실수로 실행한 후 커밋을 복구하려면?",
      choices: [
        "git checkout으로 복구",
        "git reflog로 이전 HEAD를 찾아 reset",
        "복구 불가, 다시 작성해야 함",
        "git stash pop으로 복구",
      ],
      correctIndex: 1,
      explanation:
        "git reflog에는 HEAD가 이동한 모든 기록이 남아 있습니다. " +
        "reflog에서 원하는 시점을 찾아 git reset --hard HEAD@{n}으로 복구할 수 있습니다. " +
        "단, 커밋하지 않은 변경사항은 복구할 수 없습니다.",
    },
    {
      id: "q5",
      question: "git stash의 용도로 가장 적절한 것은?",
      choices: [
        "커밋을 다른 브랜치로 옮기기",
        "작업 중인 변경사항을 임시로 저장하고 브랜치를 전환하기",
        "원격 저장소의 변경사항을 가져오기",
        "커밋 히스토리를 정리하기",
      ],
      correctIndex: 1,
      explanation:
        "git stash는 현재 작업 중인 변경사항(staged + unstaged)을 임시 스택에 저장합니다. " +
        "브랜치를 전환한 후 git stash pop으로 다시 꺼내올 수 있습니다.",
    },
  ],
};

export default chapter;
