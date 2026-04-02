import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "32-strict-mode",
  subject: "typescript",
  title: "strict 모드와 점진적 도입",
  description:
    "strict: true가 활성화하는 7가지 플래그를 이해하고, 기존 JavaScript 프로젝트에 TypeScript를 점진적으로 도입하는 전략을 익힙니다.",
  order: 32,
  group: "프로젝트 설정",
  prerequisites: ["31-tsconfig"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "strict 모드는 **운전면허 시험의 난이도 조절**과 같습니다.\n\n" +
        "가장 쉬운 모드(strict: false)에서는 신호 위반을 해도 감점이 없습니다. 시험은 통과하기 쉽지만, 실제 도로에서 사고(런타임 에러)가 날 확률이 높죠.\n\n" +
        "strict: true는 7가지 검사 항목을 한번에 활성화합니다. 신호 위반(strictNullChecks), 차선 변경 시 깜빡이 미사용(noImplicitAny), 안전벨트 미착용(strictFunctionTypes) 등을 모두 감점합니다.\n\n" +
        "기존에 면허 없이 운전하던 사람(JS 프로젝트)에게 갑자기 모든 규칙을 적용하면 혼란이 생깁니다. 먼저 도로 위에 올라서게 하고(allowJs), 기본 규칙부터 가르친 뒤(checkJs), 마지막에 전체 시험을 보는(strict) 점진적 도입이 현실적입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "strict 모드를 둘러싼 실무 문제들은 크게 세 가지입니다.\n\n" +
        "**1. strict: true가 뭘 하는지 정확히 모른다**\n" +
        "strict는 단일 옵션이 아니라 7개 플래그의 묶음입니다. 어떤 팀원은 '에러가 너무 많아서' strict를 끄자고 하는데, 실제로는 strictNullChecks 하나만 끄면 되는 경우가 대부분입니다. 정확한 이해 없이 전체를 끄면 타입 안전성이 급격히 떨어집니다.\n\n" +
        "**2. 기존 JS 프로젝트 마이그레이션의 벽**\n" +
        "수천 줄의 JavaScript 프로젝트에 strict: true를 한 번에 적용하면 수백 개의 에러가 쏟아집니다. 이 때문에 '우리 프로젝트엔 TypeScript 도입이 불가능하다'고 포기하는 팀이 많습니다.\n\n" +
        "**3. @ts-ignore 남용**\n" +
        "에러를 빠르게 해결하기 위해 `@ts-ignore`를 남발하면, TypeScript를 사용하는 의미 자체가 사라집니다. 언제 `@ts-ignore`를 쓰고, 언제 `@ts-expect-error`를 써야 하는지 기준이 없습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### strict가 활성화하는 7가지 플래그\n\n" +
        "**1. strictNullChecks** — null과 undefined를 별도 타입으로 취급. 가장 중요한 플래그입니다.\n" +
        "**2. noImplicitAny** — 타입을 추론할 수 없을 때 암묵적 any를 금지.\n" +
        "**3. strictFunctionTypes** — 함수 매개변수 타입을 반공변(contravariant)으로 검사.\n" +
        "**4. strictBindCallApply** — bind, call, apply의 매개변수를 정확히 검사.\n" +
        "**5. strictPropertyInitialization** — 클래스 프로퍼티의 초기화를 강제.\n" +
        "**6. noImplicitThis** — this의 타입이 any가 되는 것을 금지.\n" +
        "**7. alwaysStrict** — 모든 파일에 'use strict'를 추가.\n\n" +
        "### 점진적 도입 전략\n" +
        "**Phase 1:** `allowJs: true`로 .js 파일을 TypeScript 프로젝트에 포함.\n" +
        "**Phase 2:** `checkJs: true`로 .js 파일도 타입 검사 시작.\n" +
        "**Phase 3:** 파일을 하나씩 .ts로 변환하면서 타입 추가.\n" +
        "**Phase 4:** 모든 파일 변환 후 `strict: true` 활성화.\n\n" +
        "### @ts-ignore vs @ts-expect-error\n" +
        "`@ts-ignore`는 에러가 없어도 무시, `@ts-expect-error`는 에러가 없으면 역으로 경고. 항상 `@ts-expect-error`를 우선 사용하세요.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: strictNullChecks의 위력",
      content:
        "strictNullChecks는 strict 플래그 중 가장 임팩트가 큽니다. 이 플래그 하나로 JavaScript 세계에서 가장 흔한 런타임 에러인 'Cannot read properties of null/undefined'를 컴파일 타임에 잡을 수 있습니다. on/off 시 코드가 어떻게 달라지는지 비교해봅시다.",
      code: {
        language: "typescript",
        code:
          "// ===== strictNullChecks: false (위험!) =====\n" +
          "// null과 undefined가 모든 타입에 할당 가능\n" +
          "function getUserName(id: number): string {\n" +
          "  const user = users.find(u => u.id === id);\n" +
          "  return user.name; // 에러 없음! user가 undefined일 수 있는데...\n" +
          "  // 런타임: Cannot read properties of undefined\n" +
          "}\n" +
          "\n" +
          "// ===== strictNullChecks: true (안전!) =====\n" +
          "function getUserNameSafe(id: number): string {\n" +
          "  const user = users.find(u => u.id === id);\n" +
          "  // user의 타입: User | undefined\n" +
          "  // return user.name; // ❌ 컴파일 에러: user가 undefined일 수 있음\n" +
          "\n" +
          "  // 방법 1: 옵셔널 체이닝 + nullish 병합\n" +
          '  return user?.name ?? "Unknown";\n' +
          "\n" +
          "  // 방법 2: 가드 조건\n" +
          "  // if (!user) throw new Error(`User ${id} not found`);\n" +
          "  // return user.name; // OK: 여기서 user는 User\n" +
          "}\n" +
          "\n" +
          "// ===== noImplicitAny =====\n" +
          "// noImplicitAny: false\n" +
          "function process(data) {    // data: any (암묵적)\n" +
          "  return data.whatever;      // 아무거나 접근 가능 — 위험!\n" +
          "}\n" +
          "\n" +
          "// noImplicitAny: true\n" +
          "// function process(data) {} // ❌ 에러: 매개변수에 암묵적 any\n" +
          "function processSafe(data: unknown) {\n" +
          '  if (typeof data === "string") {\n' +
          "    return data.toUpperCase(); // OK: 타입 좁히기 후 안전\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// ===== strictFunctionTypes =====\n" +
          "type Handler = (event: MouseEvent) => void;\n" +
          "\n" +
          "// strictFunctionTypes: true\n" +
          "const handler: Handler = (e: Event) => {};\n" +
          "// ❌ Event는 MouseEvent의 상위 타입이므로 에러\n" +
          "// MouseEvent에만 있는 clientX 등에 접근하면 위험",
        description:
          "strictNullChecks는 null/undefined 에러를, noImplicitAny는 암묵적 any를, strictFunctionTypes는 함수 매개변수의 타입 안전성을 보장합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 점진적 마이그레이션과 에러 억제",
      content:
        "기존 JavaScript 프로젝트를 TypeScript로 점진적으로 전환하는 실전 과정을 단계별로 살펴봅니다. @ts-ignore와 @ts-expect-error의 올바른 사용법도 함께 익힙니다.",
      code: {
        language: "typescript",
        code:
          "// ===== Phase 1: allowJs로 공존 시작 =====\n" +
          "// tsconfig.json: { allowJs: true, outDir: \"dist\" }\n" +
          "// 기존 .js 파일은 그대로 두고, 새 파일만 .ts로 작성\n" +
          "\n" +
          "// utils.js (기존 JS 파일, 수정 없이 공존)\n" +
          "// export function formatDate(date) { return date.toISOString(); }\n" +
          "\n" +
          "// newFeature.ts (새 파일은 TypeScript로 작성)\n" +
          "import { formatDate } from './utils'; // JS 파일 import 가능\n" +
          "\n" +
          "// ===== Phase 2: checkJs로 JS 파일도 검사 =====\n" +
          "// tsconfig.json: { allowJs: true, checkJs: true }\n" +
          "// .js 파일에서도 타입 에러를 보고함\n" +
          "// 특정 파일만 제외하려면 파일 최상단에:\n" +
          "// @ts-nocheck\n" +
          "\n" +
          "// ===== Phase 3: 파일별 .ts 전환 =====\n" +
          "// utils.js → utils.ts\n" +
          "export function formatDate(date: Date): string {\n" +
          "  return date.toISOString();\n" +
          "}\n" +
          "\n" +
          "// ===== @ts-ignore vs @ts-expect-error =====\n" +
          "\n" +
          "// @ts-ignore: 다음 줄의 에러를 무조건 무시\n" +
          "// 에러가 수정되어도 계속 남아있음 (죽은 코드)\n" +
          "// @ts-ignore\n" +
          "const value1: number = 'hello'; // 에러 무시됨\n" +
          "\n" +
          "// @ts-expect-error: 에러가 있어야 함\n" +
          "// 에러가 수정되면 이 주석 자체가 에러가 됨 → 정리 유도!\n" +
          "// @ts-expect-error — 레거시 API 타입 불일치 (JIRA-1234)\n" +
          "const value2: number = legacyApi.getValue();\n" +
          "\n" +
          "// ===== 실전: strict 개별 활성화 순서 =====\n" +
          "// 추천 순서 (영향도 순):\n" +
          "// 1. noImplicitAny: true       → any 제거\n" +
          "// 2. strictNullChecks: true     → null 안전성\n" +
          "// 3. strictFunctionTypes: true  → 함수 타입 안전\n" +
          "// 4. strictBindCallApply: true  → bind/call 안전\n" +
          "// 5. strictPropertyInitialization: true\n" +
          "// 6. noImplicitThis: true\n" +
          "// 7. alwaysStrict: true\n" +
          "// → 모두 활성화 후 strict: true로 통합!",
        description:
          "allowJs → checkJs → strict 순서로 점진 도입하고, @ts-expect-error로 에러를 관리합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 플래그 | 역할 | 중요도 |\n" +
        "|--------|------|--------|\n" +
        "| strictNullChecks | null/undefined 분리 | ★★★★★ |\n" +
        "| noImplicitAny | 암묵적 any 금지 | ★★★★★ |\n" +
        "| strictFunctionTypes | 함수 매개변수 반공변 검사 | ★★★★ |\n" +
        "| strictBindCallApply | bind/call/apply 타입 검사 | ★★★ |\n" +
        "| strictPropertyInitialization | 클래스 초기화 강제 | ★★★ |\n" +
        "| noImplicitThis | this 타입 강제 | ★★ |\n" +
        "| alwaysStrict | 'use strict' 추가 | ★★ |\n\n" +
        "**핵심:** strict: true는 7가지 검사를 한번에 활성화합니다. 특히 strictNullChecks는 null/undefined 런타임 에러를 사전에 잡아주므로 반드시 켜야 합니다. 기존 프로젝트에는 allowJs → checkJs → strict 순서로 점진 도입하고, 에러 억제가 필요하면 @ts-expect-error를 사용하세요.\n\n" +
        "**다음 챕터 미리보기:** TypeScript에서 에러를 타입 안전하게 다루는 패턴을 배웁니다. try/catch의 unknown 문제, Result<T, E> 패턴, 커스텀 에러 클래스 등을 실전에 적용합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "strict: true는 7가지 검사를 한번에 활성화한다. 특히 strictNullChecks는 null/undefined 관련 런타임 에러를 사전에 잡아주므로 반드시 켜야 한다. 기존 프로젝트에는 allowJs부터 시작해 점진적으로 도입하라.",
  checklist: [
    "strict: true가 활성화하는 7가지 플래그를 나열할 수 있다",
    "strictNullChecks가 가장 중요한 이유를 설명할 수 있다",
    "allowJs → checkJs → strict 순서의 점진적 도입 전략을 이해한다",
    "@ts-ignore와 @ts-expect-error의 차이를 설명할 수 있다",
    "noImplicitAny가 코드 안전성에 미치는 영향을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "strict: true가 활성화하는 플래그가 아닌 것은?",
      choices: [
        "strictNullChecks",
        "noImplicitAny",
        "noUnusedLocals",
        "strictFunctionTypes",
      ],
      correctIndex: 2,
      explanation:
        "noUnusedLocals는 strict에 포함되지 않는 별도의 옵션입니다. strict는 strictNullChecks, noImplicitAny, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitThis, alwaysStrict 7가지를 활성화합니다.",
    },
    {
      id: "q2",
      question:
        "strictNullChecks: true일 때, Array.find()의 반환 타입은?",
      choices: [
        "T",
        "T | null",
        "T | undefined",
        "T | null | undefined",
      ],
      correctIndex: 2,
      explanation:
        "Array.find()는 조건을 만족하는 요소를 찾지 못하면 undefined를 반환합니다. strictNullChecks가 켜져 있으면 반환 타입이 T | undefined로 정확히 표현되어, undefined 처리를 강제합니다.",
    },
    {
      id: "q3",
      question: "@ts-expect-error와 @ts-ignore의 차이는?",
      choices: [
        "동일한 기능이다",
        "@ts-expect-error는 에러가 없으면 경고를 발생시킨다",
        "@ts-ignore가 더 안전하다",
        "@ts-expect-error는 특정 에러 코드만 무시한다",
      ],
      correctIndex: 1,
      explanation:
        "@ts-expect-error는 다음 줄에 에러가 있어야 합니다. 에러가 수정되어 사라지면 @ts-expect-error 주석 자체가 에러가 되어 정리를 유도합니다. @ts-ignore는 에러 유무와 관계없이 무조건 무시합니다.",
    },
    {
      id: "q4",
      question: "기존 JS 프로젝트에 TypeScript를 도입하는 올바른 순서는?",
      choices: [
        "strict → checkJs → allowJs",
        "allowJs → strict → checkJs",
        "allowJs → checkJs → strict",
        "checkJs → allowJs → strict",
      ],
      correctIndex: 2,
      explanation:
        "먼저 allowJs로 JS와 TS 파일의 공존을 허용하고, checkJs로 JS 파일도 타입 검사를 시작한 후, 파일을 .ts로 전환하며 최종적으로 strict: true를 활성화하는 것이 현실적입니다.",
    },
    {
      id: "q5",
      question:
        "strictFunctionTypes가 검사하는 것은?",
      choices: [
        "함수의 반환값 타입",
        "함수 매개변수의 반공변성(contravariance)",
        "함수 이름의 유무",
        "화살표 함수와 일반 함수의 차이",
      ],
      correctIndex: 1,
      explanation:
        "strictFunctionTypes는 함수 매개변수 타입을 반공변(contravariant)으로 검사합니다. 즉, 더 넓은 타입의 매개변수를 받는 함수를 더 좁은 타입을 기대하는 곳에 할당할 수 없습니다. 이는 타입 안전성을 보장합니다.",
    },
  ],
};

export default chapter;
