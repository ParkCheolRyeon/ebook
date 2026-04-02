import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "22-declaration-merging",
  subject: "typescript",
  title: "선언 병합",
  description:
    "interface 선언 병합, Module Augmentation, declare global 패턴으로 외부 라이브러리의 타입을 안전하게 확장하는 방법을 학습합니다.",
  order: 22,
  group: "타입 시스템 심화",
  prerequisites: ["21-type-compatibility"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "선언 병합은 **백과사전의 증보판**과 같습니다.\n\n" +
        "백과사전 초판에 '자동차' 항목이 있습니다. 몇 년 후 증보판이 나오면서 같은 '자동차' 항목에 전기차, 자율주행 관련 내용이 추가됩니다. 항목 이름은 같지만 내용은 합쳐져서 더 풍부해집니다. 이것이 interface 선언 병합입니다.\n\n" +
        "Module Augmentation은 **외국 백과사전에 한국 관련 내용을 추가하는 것**과 같습니다. 원본 백과사전(외부 라이브러리)을 직접 수정하지 않고, 별도의 부록(선언 파일)을 통해 내용을 보강합니다. Express의 Request 객체에 `user` 프로퍼티를 추가하거나, Window 객체에 커스텀 프로퍼티를 추가하는 것이 대표적입니다.\n\n" +
        "declare global은 **전 세계 모든 백과사전에 적용되는 공통 부록**입니다. 글로벌 스코프에 새로운 타입이나 프로퍼티를 추가하면, 프로젝트 전체에서 사용할 수 있습니다. 다만 글로벌 오염을 최소화하기 위해 신중하게 사용해야 합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "외부 라이브러리의 타입을 확장해야 하는 상황은 실무에서 매우 흔합니다.\n\n" +
        "**1. Express Request 확장**\n" +
        "인증 미들웨어를 거친 후 `req.user`에 사용자 정보를 담고 싶은데, Express의 Request 타입에는 `user` 프로퍼티가 없습니다. 타입 단언(`as any`)을 사용하면 타입 안전성을 잃습니다.\n\n" +
        "**2. Window 객체 확장**\n" +
        "외부 스크립트(Google Analytics, 채팅 위젯 등)가 Window 객체에 전역 변수를 추가합니다. `window.gtag`나 `window.chatWidget`을 타입 안전하게 접근하고 싶습니다.\n\n" +
        "**3. 라이브러리 타입 부족**\n" +
        "사용 중인 라이브러리의 타입 정의가 불완전하거나 최신 기능을 반영하지 못합니다. 포크하거나 PR을 올리기에는 시간이 부족하고, 당장 프로젝트에서 사용해야 합니다.\n\n" +
        "**4. 환경 변수 타입**\n" +
        "`process.env`의 환경 변수에 타입을 부여하고 싶습니다. `process.env.DATABASE_URL`이 `string | undefined`가 아닌 확실한 `string`임을 보장하고 싶습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "TypeScript의 선언 병합 메커니즘을 활용하여 기존 타입을 안전하게 확장합니다.\n\n" +
        "### interface 선언 병합\n" +
        "같은 이름의 interface를 여러 번 선언하면 자동으로 병합됩니다. 각 선언의 멤버가 합쳐져 하나의 interface가 됩니다. type alias는 같은 이름으로 재선언할 수 없으므로, 이것은 interface만의 고유한 특성입니다.\n\n" +
        "### Module Augmentation\n" +
        "`declare module 'module-name'` 블록 안에서 기존 모듈의 interface를 확장합니다. 원본 파일을 수정하지 않고도 타입을 보강할 수 있습니다. 이 파일은 반드시 모듈이어야 합니다(최소 하나의 import/export 필요).\n\n" +
        "### Global Augmentation\n" +
        "`declare global` 블록으로 전역 스코프의 타입을 확장합니다. Window, NodeJS.ProcessEnv 등 글로벌 타입에 프로퍼티를 추가할 때 사용합니다.\n\n" +
        "### namespace 병합\n" +
        "namespace는 함수, 클래스, enum과 병합될 수 있습니다. 함수에 프로퍼티를 추가하거나, enum에 정적 메서드를 추가하는 패턴이 가능합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 선언 병합 패턴",
      content:
        "interface 병합, Module Augmentation, Global Augmentation의 실제 구현 패턴을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          "// ===== 1. interface 선언 병합 =====\n" +
          "interface User {\n" +
          "  name: string;\n" +
          "  email: string;\n" +
          "}\n" +
          "\n" +
          "// 같은 이름으로 다시 선언 → 자동 병합\n" +
          "interface User {\n" +
          "  age: number;\n" +
          "  role: 'admin' | 'user';\n" +
          "}\n" +
          "\n" +
          "// 결과: User는 name, email, age, role 모두 보유\n" +
          "const user: User = {\n" +
          "  name: '홍길동',\n" +
          "  email: 'hong@test.com',\n" +
          "  age: 30,\n" +
          "  role: 'admin',\n" +
          "};\n" +
          "\n" +
          "// ===== 2. Module Augmentation: Express Request 확장 =====\n" +
          "// express.d.ts 파일\n" +
          "import 'express'; // 이 import가 있어야 모듈로 인식\n" +
          "\n" +
          "declare module 'express' {\n" +
          "  interface Request {\n" +
          "    user?: {\n" +
          "      id: string;\n" +
          "      name: string;\n" +
          "      role: 'admin' | 'user';\n" +
          "    };\n" +
          "    requestId: string;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// 이제 req.user, req.requestId를 타입 안전하게 사용 가능\n" +
          "\n" +
          "// ===== 3. Global Augmentation: Window 확장 =====\n" +
          "export {}; // 파일을 모듈로 만들기 위한 빈 export\n" +
          "\n" +
          "declare global {\n" +
          "  interface Window {\n" +
          "    gtag: (...args: any[]) => void;\n" +
          "    __APP_VERSION__: string;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// window.gtag('event', 'page_view'); // ✅ 타입 안전\n" +
          "// window.__APP_VERSION__; // ✅ string\n" +
          "\n" +
          "// ===== 4. 환경 변수 타입 확장 =====\n" +
          "declare global {\n" +
          "  namespace NodeJS {\n" +
          "    interface ProcessEnv {\n" +
          "      DATABASE_URL: string;\n" +
          "      API_KEY: string;\n" +
          "      NODE_ENV: 'development' | 'production' | 'test';\n" +
          "    }\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// process.env.DATABASE_URL; // ✅ string (undefined 아님)\n" +
          "\n" +
          "// ===== 5. namespace와 함수 병합 =====\n" +
          "function greet(name: string): string {\n" +
          "  return `Hello, ${name}!`;\n" +
          "}\n" +
          "\n" +
          "namespace greet {\n" +
          "  export const defaultName = 'World';\n" +
          "  export function formal(name: string): string {\n" +
          "    return `Dear ${name}, greetings.`;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "greet('홍길동');          // 'Hello, 홍길동!'\n" +
          "greet.defaultName;       // 'World'\n" +
          "greet.formal('홍길동');   // 'Dear 홍길동, greetings.'",
        description:
          "interface 병합은 자동, Module Augmentation은 declare module, Global Augmentation은 declare global로 외부 타입을 확장합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 실무에서의 선언 병합",
      content:
        "실무 프로젝트에서 자주 사용하는 선언 병합 패턴들을 연습합니다. 라이브러리 타입 보강, 전역 유틸리티 추가 등을 다룹니다.",
      code: {
        language: "typescript",
        code:
          "// 1. React 라이브러리 타입 보강 — 커스텀 CSS 프로퍼티\n" +
          "import 'react';\n" +
          "\n" +
          "declare module 'react' {\n" +
          "  interface CSSProperties {\n" +
          "    '--primary-color'?: string;\n" +
          "    '--sidebar-width'?: string;\n" +
          "    '--header-height'?: string;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// JSX에서 CSS 변수를 타입 안전하게 사용\n" +
          "// <div style={{ '--primary-color': '#3b82f6' }} />\n" +
          "\n" +
          "// 2. 라이브러리 타입이 부족할 때 직접 보강\n" +
          "declare module 'some-library' {\n" +
          "  interface Config {\n" +
          "    newFeatureFlag: boolean; // 최신 버전에 추가된 옵션\n" +
          "  }\n" +
          "\n" +
          "  export function newFeature(): void; // 새로 추가된 함수\n" +
          "}\n" +
          "\n" +
          "// 3. enum + namespace 병합: 유틸리티 메서드 추가\n" +
          "enum Direction {\n" +
          "  Up = 'UP',\n" +
          "  Down = 'DOWN',\n" +
          "  Left = 'LEFT',\n" +
          "  Right = 'RIGHT',\n" +
          "}\n" +
          "\n" +
          "namespace Direction {\n" +
          "  export function isHorizontal(dir: Direction): boolean {\n" +
          "    return dir === Direction.Left || dir === Direction.Right;\n" +
          "  }\n" +
          "\n" +
          "  export function opposite(dir: Direction): Direction {\n" +
          "    const map: Record<Direction, Direction> = {\n" +
          "      [Direction.Up]: Direction.Down,\n" +
          "      [Direction.Down]: Direction.Up,\n" +
          "      [Direction.Left]: Direction.Right,\n" +
          "      [Direction.Right]: Direction.Left,\n" +
          "    };\n" +
          "    return map[dir];\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "Direction.isHorizontal(Direction.Left); // true\n" +
          "Direction.opposite(Direction.Up);       // Direction.Down\n" +
          "\n" +
          "// 4. 글로벌 유틸리티 타입 추가\n" +
          "export {};\n" +
          "\n" +
          "declare global {\n" +
          "  // 프로젝트 전역에서 사용할 유틸리티 타입\n" +
          "  type Nullable<T> = T | null;\n" +
          "  type AsyncReturnType<T extends (...args: any[]) => Promise<any>> =\n" +
          "    T extends (...args: any[]) => Promise<infer R> ? R : never;\n" +
          "}\n" +
          "\n" +
          "// 어디서든 import 없이 사용 가능\n" +
          "// const user: Nullable<User> = null;",
        description:
          "선언 병합은 React CSS 프로퍼티 확장, 라이브러리 타입 보강, enum 유틸리티, 글로벌 타입 등 다양한 실무 장면에서 활용됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 용도 | 문법 |\n" +
        "|------|------|------|\n" +
        "| interface 병합 | 같은 이름 interface 합치기 | 같은 이름으로 재선언 |\n" +
        "| Module Augmentation | 외부 모듈 타입 확장 | declare module 'name' |\n" +
        "| Global Augmentation | 전역 스코프 확장 | declare global |\n" +
        "| namespace 병합 | 함수/클래스/enum에 프로퍼티 추가 | namespace + 함수/클래스 |\n\n" +
        "**핵심:** 같은 이름의 interface는 자동으로 병합됩니다. Module Augmentation과 declare global을 사용하면 외부 라이브러리의 타입을 안전하게 확장할 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** 모듈과 타입 선언 파일(.d.ts)을 학습합니다. declare 키워드, import type, @types 패키지, 그리고 직접 타입 선언 파일을 작성하는 방법을 다룹니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "같은 이름의 interface는 자동으로 병합된다. Module Augmentation과 declare global을 사용하면 외부 라이브러리의 타입을 안전하게 확장할 수 있다.",
  checklist: [
    "interface 선언 병합의 동작 원리를 설명할 수 있다",
    "Module Augmentation으로 외부 모듈의 타입을 확장할 수 있다",
    "declare global로 전역 타입을 추가할 수 있다",
    "namespace와 함수/클래스/enum의 병합 패턴을 이해한다",
    "Express Request 확장, Window 확장 등 실무 패턴을 적용할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "같은 이름의 interface를 두 번 선언하면 어떻게 되는가?",
      choices: [
        "컴파일 에러가 발생한다",
        "두 번째 선언이 첫 번째를 덮어쓴다",
        "두 선언의 멤버가 자동으로 병합된다",
        "두 번째 선언은 무시된다",
      ],
      correctIndex: 2,
      explanation:
        "TypeScript에서 같은 이름의 interface는 자동으로 병합(merge)됩니다. 각 선언의 멤버가 합쳐져 하나의 interface가 됩니다. 이것은 type alias에서는 불가능한 interface만의 특성입니다.",
    },
    {
      id: "q2",
      question:
        "Module Augmentation을 사용하기 위한 필수 조건은?",
      choices: [
        "strict 모드가 켜져 있어야 한다",
        "해당 파일이 모듈이어야 한다 (import/export 존재)",
        "tsconfig.json에서 별도 설정이 필요하다",
        "원본 모듈의 소스 코드가 있어야 한다",
      ],
      correctIndex: 1,
      explanation:
        "Module Augmentation이 작동하려면 해당 파일이 모듈이어야 합니다. 최소 하나의 import 또는 export가 있어야 하며, 그렇지 않으면 글로벌 스크립트로 인식되어 병합이 작동하지 않습니다.",
    },
    {
      id: "q3",
      question: "Express의 Request 객체에 user 프로퍼티를 추가하는 올바른 방법은?",
      choices: [
        "Express 소스 코드를 직접 수정",
        "declare module 'express'로 Request interface 확장",
        "타입 단언 as any 사용",
        "// @ts-ignore 주석 사용",
      ],
      correctIndex: 1,
      explanation:
        "declare module 'express' 블록 안에서 Request interface를 선언하면, 기존 타입과 자동으로 병합됩니다. 원본을 수정하지 않고 타입 안전하게 확장할 수 있습니다.",
    },
    {
      id: "q4",
      question: "declare global의 주요 용도는?",
      choices: [
        "모듈 내부의 변수를 선언",
        "전역 스코프의 타입(Window, process.env 등)을 확장",
        "다른 파일에서 import 가능한 타입 선언",
        "런타임 변수를 선언",
      ],
      correctIndex: 1,
      explanation:
        "declare global은 모듈 파일 내에서 전역 스코프의 타입을 확장할 때 사용합니다. Window 객체에 프로퍼티를 추가하거나, NodeJS.ProcessEnv에 환경 변수 타입을 추가하는 것이 대표적입니다.",
    },
    {
      id: "q5",
      question: "다음 중 선언 병합이 불가능한 조합은?",
      choices: [
        "interface + interface",
        "namespace + 함수",
        "type alias + type alias",
        "namespace + enum",
      ],
      correctIndex: 2,
      explanation:
        "type alias는 같은 이름으로 재선언할 수 없습니다. 'Duplicate identifier' 에러가 발생합니다. 선언 병합은 interface, namespace, enum 등에서만 가능합니다.",
    },
  ],
};

export default chapter;
