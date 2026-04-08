import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "33-module-system",
  subject: "js",
  title: "모듈 시스템",
  description: "스크립트와 모듈의 차이, CommonJS require/exports와 ESM import/export의 동작 원리, 동적 import, 순환 참조 문제를 깊이 이해합니다.",
  order: 33,
  group: "모듈과 환경",
  prerequisites: ["32-symbol"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "모듈 시스템은 '레고 블록과 설계도'의 관계와 같습니다.\n\n" +
        "모듈 이전의 자바스크립트는 하나의 거대한 설계도 위에 모든 것을 그려야 했습니다. 변수, 함수 모두가 같은 공간을 공유해서 충돌이 잦았습니다.\n\n" +
        "**모듈**은 각 레고 블록처럼 독립적인 파일입니다. 각 블록은 자신만의 내부 공간을 가지고, 다른 블록과 연결하려면 명시적으로 '이 부분을 연결 핀으로 쓰세요(`export`)'라고 표시해야 합니다.\n\n" +
        "**CommonJS**는 Node.js의 모듈 방식입니다. 레고 블록을 조립하는 것처럼 실행 중에 (`require()`) 그때그때 필요한 블록을 가져옵니다. 마치 책을 읽다가 다른 책을 참고하러 도서관에 가는 것과 같습니다.\n\n" +
        "**ESM(ES Modules)**은 설계 단계에서 미리 어떤 블록이 필요한지 명시합니다(`import`). 집을 짓기 전에 필요한 자재 목록을 전부 정해두는 것처럼, 실행 전에 의존성을 파악할 수 있어 최적화가 가능합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "자바스크립트는 오랫동안 공식 모듈 시스템이 없었습니다.\n\n" +
        "```html\n" +
        "<!-- 초기 방식: script 태그로 전부 로드 -->\n" +
        "<script src=\"jquery.js\"></script>\n" +
        "<script src=\"plugin.js\"></script>   <!-- jQuery에 의존 -->\n" +
        "<script src=\"app.js\"></script>       <!-- 순서 중요! -->\n" +
        "```\n\n" +
        "이 방식의 문제점:\n" +
        "1. **전역 스코프 오염** — 모든 변수가 window 객체에 추가됨\n" +
        "2. **로드 순서 의존성** — 순서가 바뀌면 에러 발생\n" +
        "3. **의존성 파악 불가** — 코드를 봐야 무엇을 필요로 하는지 알 수 있음\n" +
        "4. **이름 충돌** — 다른 파일의 같은 이름 함수가 덮어씌워짐\n\n" +
        "Node.js는 CommonJS로 이 문제를 해결했고, ES2015(ES6)는 언어 차원의 공식 모듈 시스템(ESM)을 도입했습니다. 그런데 두 시스템이 공존하며 혼란을 야기하고 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### CommonJS (CJS)\n\n" +
        "Node.js의 기본 모듈 시스템. `require()`는 **동기**적으로 모듈을 로드합니다.\n\n" +
        "```js\n" +
        "// math.js — 내보내기\n" +
        "module.exports = { add: (a, b) => a + b };\n" +
        "// 또는\n" +
        "exports.add = (a, b) => a + b;\n" +
        "\n" +
        "// app.js — 가져오기 (런타임에 실행)\n" +
        "const { add } = require('./math');\n" +
        "const math = require('./math'); // 캐시됨 — 같은 객체 반환\n" +
        "```\n\n" +
        "### ESM (ECMAScript Modules)\n\n" +
        "ES2015 공식 모듈 시스템. `import`는 **정적**으로 분석됩니다.\n\n" +
        "```js\n" +
        "// math.mjs — named export\n" +
        "export const add = (a, b) => a + b;\n" +
        "export default function multiply(a, b) { return a * b; }\n" +
        "\n" +
        "// app.mjs — named import\n" +
        "import { add } from './math.mjs';\n" +
        "import multiply from './math.mjs'; // default import\n" +
        "import * as math from './math.mjs'; // namespace import\n" +
        "```\n\n" +
        "### CJS vs ESM 핵심 차이\n\n" +
        "| 특성 | CommonJS | ESM |\n" +
        "|------|----------|-----|\n" +
        "| 문법 | require/exports | import/export |\n" +
        "| 로드 타이밍 | 런타임 (동기) | 파싱 타임 (비동기) |\n" +
        "| 정적 분석 | 불가 | 가능 (트리 쉐이킹) |\n" +
        "| 기본 this | module.exports | undefined |\n" +
        "| 순환 참조 | 불완전 객체 반환 | 라이브 바인딩 |\n\n" +
        "### 동적 import()\n\n" +
        "ESM에서도 런타임에 모듈을 로드해야 할 때 사용합니다. Promise를 반환합니다.\n\n" +
        "```js\n" +
        "// 조건부 로드 (코드 스플리팅)\n" +
        "if (userIsAdmin) {\n" +
        "  const { AdminPanel } = await import('./admin.js');\n" +
        "  AdminPanel.init();\n" +
        "}\n" +
        "```\n\n" +
        "### 순환 참조\n\n" +
        "A가 B를 참조하고 B가 A를 참조하는 상황. CJS는 불완전 객체를 반환하지만, ESM은 라이브 바인딩을 사용해 나중에 채워집니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: ESM의 정적 분석과 라이브 바인딩",
      content:
        "ESM이 어떻게 파싱 단계에서 의존성을 파악하고, 라이브 바인딩으로 모듈 간 값 변경을 전파하는지 살펴봅니다.",
      code: {
        language: "javascript",
        code:
          "// === ESM 라이브 바인딩 ===\n" +
          "// counter.mjs\n" +
          "export let count = 0;\n" +
          "export function increment() { count++; }\n" +
          "\n" +
          "// app.mjs\n" +
          "import { count, increment } from './counter.mjs';\n" +
          "\n" +
          "console.log(count); // 0\n" +
          "increment();\n" +
          "console.log(count); // 1 ← 라이브 바인딩! (CJS는 0)\n" +
          "// CJS에서 구조분해: const { count } = require('./counter') → 값 복사 → 항상 0\n" +
          "// 단, CJS에서 모듈 객체 참조: const counter = require('./counter')\n" +
          "//   → counter.count는 exports 객체의 프로퍼티를 참조하므로 변경이 반영됨\n" +
          "\n" +
          "// === 동적 import — 코드 스플리팅 ===\n" +
          "// routes.js\n" +
          "const routes = {\n" +
          "  '/': () => import('./pages/Home.js'),\n" +
          "  '/about': () => import('./pages/About.js'),\n" +
          "  '/admin': () => import('./pages/Admin.js'),\n" +
          "};\n" +
          "\n" +
          "async function navigate(path) {\n" +
          "  const loader = routes[path];\n" +
          "  if (!loader) return;\n" +
          "  const module = await loader(); // 해당 페이지만 로드!\n" +
          "  module.default.render();\n" +
          "}\n" +
          "\n" +
          "// === 모듈 스코프 — 전역 오염 없음 ===\n" +
          "// module-a.mjs\n" +
          "const secret = 'only in this module'; // 이 모듈 스코프에만 존재\n" +
          "export const publicValue = 42;\n" +
          "\n" +
          "// 브라우저에서 type=\"module\" 사용\n" +
          "// <script type=\"module\" src=\"app.mjs\"></script>\n" +
          "// - 자동으로 strict mode\n" +
          "// - 독립 스코프 (window 오염 없음)\n" +
          "// - defer 동작 (HTML 파싱 완료 후 실행)",
        description: "ESM의 import는 값 복사가 아닌 라이브 바인딩으로 연결됩니다. 내보낸 모듈에서 값이 변경되면 가져온 쪽에도 반영됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 모듈 패턴 비교",
      content:
        "같은 기능을 CommonJS와 ESM으로 구현하고 차이를 확인합니다.",
      code: {
        language: "javascript",
        code:
          "// ============ CommonJS 방식 ============\n" +
          "// logger.cjs\n" +
          "let logCount = 0;\n" +
          "\n" +
          "function log(message) {\n" +
          "  logCount++;\n" +
          "  console.log(`[${logCount}] ${message}`);\n" +
          "}\n" +
          "\n" +
          "module.exports = { log, getCount: () => logCount };\n" +
          "\n" +
          "// app.cjs\n" +
          "const logger = require('./logger.cjs');\n" +
          "logger.log('Hello');  // [1] Hello\n" +
          "logger.log('World');  // [2] World\n" +
          "console.log(logger.getCount()); // 2\n" +
          "\n" +
          "// require()는 캐시됨 — 같은 인스턴스\n" +
          "const logger2 = require('./logger.cjs');\n" +
          "console.log(logger === logger2); // true\n" +
          "\n" +
          "// ============ ESM 방식 ============\n" +
          "// logger.mjs\n" +
          "let logCount = 0;\n" +
          "\n" +
          "export function log(message) {\n" +
          "  logCount++;\n" +
          "  console.log(`[${logCount}] ${message}`);\n" +
          "}\n" +
          "\n" +
          "export { logCount }; // 라이브 바인딩으로 export\n" +
          "\n" +
          "// app.mjs\n" +
          "import { log, logCount } from './logger.mjs';\n" +
          "\n" +
          "console.log(logCount); // 0\n" +
          "log('Hello');          // [1] Hello\n" +
          "log('World');          // [2] World\n" +
          "console.log(logCount); // 2 ← 라이브 바인딩으로 업데이트됨!\n" +
          "\n" +
          "// ============ 동적 import — 조건부 기능 ============\n" +
          "// feature-flags.mjs\n" +
          "const DARK_MODE = true;\n" +
          "\n" +
          "if (DARK_MODE) {\n" +
          "  // 다크모드 CSS를 런타임에만 로드\n" +
          "  const { applyDarkTheme } = await import('./dark-theme.mjs');\n" +
          "  applyDarkTheme();\n" +
          "}",
        description: "require()는 exports 객체의 참조를 반환합니다. 구조분해(`const { count } = require(...)`)하면 원시값은 복사되지만, 모듈 객체를 통해(`counter.count`) 접근하면 변경이 반영됩니다. ESM의 import는 라이브 바인딩으로 항상 최신 값을 참조합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| | CommonJS | ESM |\n" +
        "|--|----------|-----|\n" +
        "| 문법 | `require()` / `module.exports` | `import` / `export` |\n" +
        "| 실행 시점 | 런타임 동기 | 파싱 시 정적 분석 |\n" +
        "| 파일 확장자 | `.js`, `.cjs` | `.mjs`, `.js`(package.json type:module) |\n" +
        "| 트리 쉐이킹 | 불가 | 가능 |\n" +
        "| Top-level await | 불가 | 가능 |\n" +
        "| 브라우저 지원 | 불가(번들러 필요) | 네이티브 지원 |\n\n" +
        "**모듈의 핵심 특성:**\n" +
        "- 독립 스코프 (전역 오염 없음)\n" +
        "- strict mode 자동 적용\n" +
        "- 동일 모듈은 한 번만 실행 (캐시)\n\n" +
        "**동적 import()**: 조건부 로드, 코드 스플리팅에 사용. Promise 반환.\n\n" +
        "**핵심:** 현대 프로젝트에서는 ESM을 기본으로 사용하고, Node.js 환경에서는 package.json에 `\"type\": \"module\"`을 설정하세요.\n\n" +
        "**다음 챕터 미리보기:** strict mode의 동작을 자세히 배우며, 모듈이 자동으로 strict mode를 활성화하는 이유를 이해합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "ES Modules(import/export)는 파일 단위로 스코프를 격리하고 의존성을 명시적으로 선언한다. 모듈은 한 번만 평가되며, 순환 참조도 처리할 수 있다.",
  checklist: [
    "스크립트와 모듈의 차이(스코프, strict mode)를 설명할 수 있다",
    "CommonJS의 require/exports 문법을 사용할 수 있다",
    "ESM의 named export, default export, namespace import를 구분할 수 있다",
    "CJS와 ESM의 핵심 차이(정적 vs 동적, 라이브 바인딩)를 설명할 수 있다",
    "동적 import()를 사용하는 상황과 방법을 안다",
    "순환 참조 시 CJS와 ESM의 동작 차이를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "ESM(ES Modules)의 import가 CommonJS의 require()와 근본적으로 다른 이유는?",
      choices: [
        "ESM은 비동기, CJS는 동기로 로드한다",
        "ESM은 파싱 단계에서 정적 분석이 가능하고 라이브 바인딩을 사용한다",
        "ESM은 브라우저만, CJS는 Node.js만 지원한다",
        "ESM의 import는 값을 복사한다",
      ],
      correctIndex: 1,
      explanation: "ESM의 import는 파싱 단계에서 의존성 그래프를 구성해 정적 분석(트리 쉐이킹)이 가능합니다. 또한 값 복사가 아닌 라이브 바인딩으로 연결되어 원본 모듈의 값 변경이 자동으로 반영됩니다.",
    },
    {
      id: "q2",
      question: "동적 import()의 특징은?",
      choices: [
        "동기적으로 실행된다",
        "Promise를 반환하며 런타임에 모듈을 로드한다",
        "CommonJS에서만 사용 가능하다",
        "default export만 가져올 수 있다",
      ],
      correctIndex: 1,
      explanation: "동적 import()는 Promise를 반환하는 함수 형태로, 런타임에 필요한 모듈만 로드합니다. 조건부 로드, 코드 스플리팅에 활용됩니다. ESM과 함께 async/await로 사용할 수 있습니다.",
    },
    {
      id: "q3",
      question: "ESM 모듈 스코프의 특징이 아닌 것은?",
      choices: [
        "strict mode가 자동으로 적용된다",
        "최상위 변수가 전역 객체(window)에 추가된다",
        "동일 모듈은 한 번만 실행(캐시)된다",
        "top-level await를 사용할 수 있다",
      ],
      correctIndex: 1,
      explanation: "ESM 모듈의 최상위 변수는 모듈 스코프에만 존재하며 전역 객체(window)에 추가되지 않습니다. 이것이 모듈의 핵심 장점 중 하나인 전역 스코프 오염 방지입니다.",
    },
    {
      id: "q4",
      question: "CommonJS에서 require()의 결과가 캐시되는 이유와 영향은?",
      choices: [
        "성능을 위해 캐시하며, 같은 모듈을 여러 번 require해도 같은 객체를 반환한다",
        "보안을 위해 캐시하며, 모듈이 변경되어도 재로드되지 않는다",
        "메모리를 위해 캐시하며, 모듈은 한 번 로드 후 삭제된다",
        "캐시하지 않으며, 매번 새 객체를 반환한다",
      ],
      correctIndex: 0,
      explanation: "require()는 처음 호출 시 모듈을 실행하고 결과를 캐시합니다. 이후 같은 경로로 require()를 호출하면 캐시된 exports 객체를 반환합니다. 따라서 모듈은 앱 생명주기 동안 한 번만 실행됩니다.",
    },
    {
      id: "q5",
      question: "named export와 default export의 차이는?",
      choices: [
        "named export는 하나만, default export는 여러 개 가능하다",
        "default export는 하나만 가능하며 임의 이름으로 import할 수 있고, named export는 여러 개 가능하며 정확한 이름이 필요하다",
        "default export는 함수만 가능하다",
        "named export는 ES5에서도 사용 가능하다",
      ],
      correctIndex: 1,
      explanation: "default export는 모듈당 하나이며 import 시 어떤 이름으로든 가져올 수 있습니다. named export는 여러 개 가능하며 중괄호로 정확한 이름을 사용하거나 as로 별칭을 지정합니다.",
    },
    {
      id: "q6",
      question: "트리 쉐이킹(Tree Shaking)이 ESM에서는 가능하고 CJS에서는 어려운 이유는?",
      choices: [
        "ESM 파일이 더 작기 때문",
        "ESM은 정적 분석이 가능해 빌드 시 사용하지 않는 export를 제거할 수 있기 때문",
        "CJS는 파일 시스템에 접근할 수 없기 때문",
        "ESM은 항상 tree-shaking 플래그가 활성화되기 때문",
      ],
      correctIndex: 1,
      explanation: "ESM의 import/export는 파싱 단계에서 정적으로 분석됩니다. 빌드 도구가 어떤 export가 실제로 사용되는지 파악해 미사용 코드를 제거할 수 있습니다. CJS는 require()가 런타임에 결정되므로 정적 분석이 불가능합니다.",
    },
  ],
};

export default chapter;
