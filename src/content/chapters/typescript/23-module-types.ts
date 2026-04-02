import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "23-module-types",
  subject: "typescript",
  title: "모듈과 타입 선언 파일",
  description:
    ".d.ts 파일의 역할, declare 키워드, import type, @types 패키지, 그리고 직접 타입 선언 파일을 작성하는 방법을 학습합니다.",
  order: 23,
  group: "타입 시스템 심화",
  prerequisites: ["22-declaration-merging"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        ".d.ts 파일은 **건물의 안내 데스크**와 같습니다.\n\n" +
        "도서관(JavaScript 라이브러리)에 처음 방문했을 때, 안내 데스크(d.ts 파일)가 있으면 어디에 어떤 책이 있는지, 대출 규칙은 무엇인지 안내받을 수 있습니다. 안내 데스크 자체는 책이 아닙니다 — 정보만 제공합니다. 마찬가지로 .d.ts 파일은 JavaScript 코드를 포함하지 않고, 타입 정보만 담고 있습니다.\n\n" +
        "@types 패키지는 **도서관 자원봉사자 모임(DefinitelyTyped)**이 운영하는 공식 안내 데스크입니다. jQuery, Lodash처럼 원래 안내 데스크가 없는 도서관(라이브러리)에도 자원봉사자들이 안내 데스크를 만들어줍니다.\n\n" +
        "declare 키워드는 **'이 자리에 이런 것이 있을 것이라 선언합니다'**라는 약속입니다. 실제 구현을 제공하지 않고, 형태만 알려줍니다. 외부에서 로드되는 스크립트나 전역 변수처럼, TypeScript가 직접 볼 수 없는 것들의 존재를 알려주는 역할입니다.\n\n" +
        "import type은 **열람만 하고 대출하지 않는 것**과 같습니다. 타입 정보만 가져오고, 런타임 JavaScript에는 아무 흔적도 남기지 않습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "JavaScript 생태계에서 타입 정보를 관리하는 것은 여전히 도전적인 과제입니다.\n\n" +
        "**1. 타입 없는 라이브러리**\n" +
        "npm에는 여전히 타입 정의가 없는 라이브러리가 많습니다. 설치하면 `Could not find a declaration file for module` 에러가 발생하고, 모든 값이 `any`로 추론됩니다.\n\n" +
        "**2. 전역 변수/함수의 타입**\n" +
        "CDN으로 로드하는 외부 스크립트(Google Maps, 결제 SDK 등)가 전역 변수를 추가합니다. TypeScript는 이 변수의 존재를 모르므로 에러가 발생합니다.\n\n" +
        "**3. 번들 크기 문제**\n" +
        "import로 타입만 가져올 때도 일반 import를 사용하면, 번들러가 해당 모듈을 런타임 코드에 포함시킬 수 있습니다. 타입 정보만 필요한 경우 불필요한 코드가 번들에 포함됩니다.\n\n" +
        "**4. 모듈 해석(Module Resolution) 혼란**\n" +
        "TypeScript가 모듈의 타입을 어떤 경로에서 찾는지 이해하지 못하면, `Cannot find module` 에러가 빈번하게 발생합니다. node, node16, bundler 등 다양한 moduleResolution 옵션이 있어 혼란스럽습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "TypeScript의 모듈 시스템과 타입 선언 체계를 이해하면, 어떤 라이브러리든 타입 안전하게 사용할 수 있습니다.\n\n" +
        "### .d.ts 파일\n" +
        "`.d.ts`(declaration) 파일은 타입 정보만 담는 파일입니다. JavaScript 코드를 생성하지 않으며, 기존 JavaScript 코드의 타입을 설명하는 역할을 합니다. `tsc --declaration` 옵션으로 `.ts` 파일에서 자동 생성할 수도 있습니다.\n\n" +
        "### declare 키워드\n" +
        "구현 없이 타입만 선언합니다. `declare function`, `declare const`, `declare class`, `declare module` 등 다양한 형태가 있습니다. .d.ts 파일 안에서는 모든 선언이 자동으로 ambient(구현 없는 선언)로 취급됩니다.\n\n" +
        "### import type / export type\n" +
        "타입 전용 import/export는 컴파일 시 완전히 제거됩니다. 번들에 불필요한 코드가 포함되는 것을 방지하며, 순환 참조 문제도 해결합니다. TypeScript 5.0부터는 `verbatimModuleSyntax` 옵션으로 강제할 수 있습니다.\n\n" +
        "### @types 패키지와 DefinitelyTyped\n" +
        "`npm install -D @types/lodash`처럼 설치합니다. TypeScript는 `node_modules/@types` 폴더를 자동으로 스캔하여 타입 정보를 로드합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 타입 선언 파일 작성",
      content:
        "직접 타입 선언 파일을 작성하는 방법과 다양한 declare 패턴을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          "// ===== 1. 기본 .d.ts 파일 구조 =====\n" +
          "// analytics.d.ts — 외부 분석 SDK 타입 선언\n" +
          "declare module 'analytics-sdk' {\n" +
          "  interface AnalyticsConfig {\n" +
          "    apiKey: string;\n" +
          "    debug?: boolean;\n" +
          "    environment?: 'production' | 'staging' | 'development';\n" +
          "  }\n" +
          "\n" +
          "  interface EventData {\n" +
          "    name: string;\n" +
          "    properties?: Record<string, string | number | boolean>;\n" +
          "    timestamp?: number;\n" +
          "  }\n" +
          "\n" +
          "  export function init(config: AnalyticsConfig): void;\n" +
          "  export function track(event: EventData): void;\n" +
          "  export function identify(userId: string): void;\n" +
          "}\n" +
          "\n" +
          "// ===== 2. import type — 타입 전용 가져오기 =====\n" +
          "// import type { User } from './models';\n" +
          "// import { type User, createUser } from './models';\n" +
          "// 위 두 방법 모두 User는 런타임에 제거됨\n" +
          "\n" +
          "// ===== 3. declare를 활용한 전역 변수 선언 =====\n" +
          "// globals.d.ts\n" +
          "declare const __DEV__: boolean;\n" +
          "declare const __VERSION__: string;\n" +
          "\n" +
          "declare function gtag(\n" +
          "  command: 'config' | 'event' | 'set',\n" +
          "  targetId: string,\n" +
          "  params?: Record<string, any>\n" +
          "): void;\n" +
          "\n" +
          "// ===== 4. 이미지, CSS 등 비-JS 모듈 선언 =====\n" +
          "// assets.d.ts\n" +
          "declare module '*.png' {\n" +
          "  const src: string;\n" +
          "  export default src;\n" +
          "}\n" +
          "\n" +
          "declare module '*.svg' {\n" +
          "  import type { FC, SVGProps } from 'react';\n" +
          "  const SVGComponent: FC<SVGProps<SVGSVGElement>>;\n" +
          "  export default SVGComponent;\n" +
          "}\n" +
          "\n" +
          "declare module '*.module.css' {\n" +
          "  const classes: Record<string, string>;\n" +
          "  export default classes;\n" +
          "}\n" +
          "\n" +
          "// ===== 5. ambient 선언과 triple-slash 지시자 =====\n" +
          "// /// <reference types=\"vite/client\" />\n" +
          "// triple-slash 지시자는 파일의 최상단에 위치해야 합니다.\n" +
          "// 전역 타입 참조를 추가하는 레거시 방식이지만,\n" +
          "// Vite 등 일부 도구에서 여전히 사용됩니다.",
        description:
          ".d.ts 파일로 외부 모듈, 전역 변수, 비-JS 에셋의 타입을 선언할 수 있습니다. import type으로 타입만 가져오면 번들 크기에 영향을 주지 않습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 실무 타입 선언 패턴",
      content:
        "실무에서 자주 작성하는 타입 선언 패턴들을 연습합니다. 라이브러리 타입 작성, 환경 설정, 모듈 해석 등을 다룹니다.",
      code: {
        language: "typescript",
        code:
          "// 1. 타입 없는 라이브러리 — 최소한의 선언\n" +
          "// 일단 any로 선언하여 에러 해결, 점진적으로 보강\n" +
          "declare module 'untyped-lib';\n" +
          "// → import whatever from 'untyped-lib' → any\n" +
          "\n" +
          "// 2. 점진적으로 구체적인 타입 추가\n" +
          "declare module 'untyped-lib' {\n" +
          "  export function parse(input: string): Record<string, unknown>;\n" +
          "  export function stringify(data: unknown): string;\n" +
          "  export const version: string;\n" +
          "}\n" +
          "\n" +
          "// 3. import type 실전 사용\n" +
          "// models.ts\n" +
          "export interface User {\n" +
          "  id: string;\n" +
          "  name: string;\n" +
          "  email: string;\n" +
          "}\n" +
          "\n" +
          "export interface Post {\n" +
          "  id: string;\n" +
          "  title: string;\n" +
          "  authorId: string;\n" +
          "}\n" +
          "\n" +
          "export function createUser(data: Omit<User, 'id'>): User {\n" +
          "  return { ...data, id: crypto.randomUUID() };\n" +
          "}\n" +
          "\n" +
          "// consumer.ts — 타입만 필요한 경우\n" +
          "import type { User, Post } from './models';\n" +
          "// → 컴파일 후 이 import 라인은 완전히 제거됨\n" +
          "\n" +
          "// 값도 필요한 경우 — inline type import\n" +
          "import { type User as UserType, createUser } from './models';\n" +
          "// → createUser만 런타임에 남음\n" +
          "\n" +
          "// 4. tsconfig.json 모듈 관련 설정\n" +
          "// {\n" +
          "//   \"compilerOptions\": {\n" +
          "//     \"moduleResolution\": \"bundler\",\n" +
          "//     \"verbatimModuleSyntax\": true,\n" +
          "//     \"types\": [\"vite/client\"],\n" +
          "//     \"typeRoots\": [\"./src/types\", \"./node_modules/@types\"]\n" +
          "//   }\n" +
          "// }\n" +
          "\n" +
          "// 5. 프로젝트 타입 선언 파일 구조\n" +
          "// src/\n" +
          "//   types/\n" +
          "//     globals.d.ts     — 전역 변수, 환경 변수\n" +
          "//     assets.d.ts      — 이미지, CSS 모듈 등\n" +
          "//     vendor.d.ts      — 타입 없는 라이브러리\n" +
          "//     augments.d.ts    — Module Augmentation",
        description:
          "타입 없는 라이브러리는 declare module로 최소 선언 후 점진적으로 보강합니다. import type으로 불필요한 런타임 코드를 방지합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 역할 | 핵심 포인트 |\n" +
        "|------|------|------------|\n" +
        "| .d.ts 파일 | 타입 정보만 담는 선언 파일 | JS 코드 없음 |\n" +
        "| declare | 구현 없이 타입만 선언 | 외부 변수/모듈 설명 |\n" +
        "| import type | 타입만 가져오기 | 번들에서 제거됨 |\n" +
        "| @types | 커뮤니티 관리 선언 패키지 | DefinitelyTyped |\n" +
        "| moduleResolution | 모듈 탐색 방식 | bundler 권장 |\n\n" +
        "**핵심:** .d.ts 파일은 JavaScript 코드 없이 타입 정보만 담는 선언 파일입니다. @types 패키지는 커뮤니티가 관리하는 선언 파일이며, 라이브러리에 타입이 없으면 직접 작성하거나 declare module로 선언할 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** TypeScript 클래스와 접근 제어자를 학습합니다. public/private/protected, implements, 그리고 클래스가 타입이면서 값인 이중 정체성을 다룹니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    ".d.ts 파일은 JavaScript 코드 없이 타입 정보만 담는 선언 파일이다. @types 패키지는 커뮤니티가 관리하는 선언 파일이며, 라이브러리에 타입이 없으면 직접 작성하거나 declare module로 선언할 수 있다.",
  checklist: [
    ".d.ts 파일의 역할과 작성 방법을 이해한다",
    "declare 키워드로 전역 변수/함수/모듈을 선언할 수 있다",
    "import type과 일반 import의 차이를 설명할 수 있다",
    "@types 패키지의 역할과 설치 방법을 알고 있다",
    "타입 없는 라이브러리를 위한 선언 파일을 직접 작성할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: ".d.ts 파일의 역할은?",
      choices: [
        "JavaScript 코드를 포함하는 소스 파일",
        "타입 정보만 담는 선언 파일",
        "테스트 코드 파일",
        "설정 파일",
      ],
      correctIndex: 1,
      explanation:
        ".d.ts(declaration) 파일은 타입 정보만 담는 파일입니다. JavaScript 코드를 생성하지 않으며, 기존 JavaScript 코드의 타입을 설명하는 역할만 합니다.",
    },
    {
      id: "q2",
      question: "import type의 특징으로 올바른 것은?",
      choices: [
        "런타임에도 모듈을 로드한다",
        "컴파일 시 완전히 제거되어 번들에 포함되지 않는다",
        "값과 타입 모두 가져올 수 있다",
        "default export만 가져올 수 있다",
      ],
      correctIndex: 1,
      explanation:
        "import type은 타입 정보만 가져오며, 컴파일 시 완전히 제거됩니다. 런타임 JavaScript에 아무 흔적도 남기지 않으므로, 번들 크기에 영향을 주지 않습니다.",
    },
    {
      id: "q3",
      question: "타입 정의가 없는 npm 패키지를 사용할 때 가장 먼저 시도할 방법은?",
      choices: [
        "// @ts-ignore를 모든 곳에 추가",
        "@types 패키지가 있는지 확인하고 설치",
        "라이브러리를 직접 포크하여 수정",
        "해당 라이브러리 사용을 포기",
      ],
      correctIndex: 1,
      explanation:
        "먼저 @types 패키지(예: @types/lodash)가 있는지 확인합니다. DefinitelyTyped 커뮤니티가 많은 라이브러리의 타입을 관리하고 있으며, npm install -D @types/패키지명으로 설치할 수 있습니다.",
    },
    {
      id: "q4",
      question: "declare 키워드의 역할은?",
      choices: [
        "변수를 초기화한다",
        "런타임에 새로운 값을 생성한다",
        "구현 없이 타입 형태만 선언한다",
        "모듈을 내보낸다",
      ],
      correctIndex: 2,
      explanation:
        "declare 키워드는 실제 구현을 제공하지 않고 타입 형태만 선언합니다. '이런 형태의 것이 존재한다'고 TypeScript에 알려주는 역할이며, 외부 스크립트가 제공하는 전역 변수 등을 선언할 때 사용합니다.",
    },
    {
      id: "q5",
      question: "이미지 파일(*.png)을 import할 때 TypeScript 에러를 해결하는 방법은?",
      choices: [
        "tsconfig.json에서 allowJs: true 설정",
        "declare module '*.png'으로 모듈 타입 선언",
        "이미지를 Base64 문자열로 변환",
        "require() 대신 import 사용",
      ],
      correctIndex: 1,
      explanation:
        "declare module '*.png' { const src: string; export default src; } 형태로 .d.ts 파일에 선언하면, TypeScript가 .png 파일의 import를 인식합니다. Vite, Webpack 등 번들러가 실제 처리를 담당합니다.",
    },
  ],
};

export default chapter;
