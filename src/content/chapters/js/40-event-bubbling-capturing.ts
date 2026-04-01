import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "40-event-bubbling-capturing",
  subject: "js",
  title: "이벤트 버블링과 캡처링",
  description: "이벤트 흐름의 3단계(캡처-타겟-버블), addEventListener의 capture 옵션, stopPropagation, preventDefault의 차이를 깊이 이해합니다.",
  order: 40,
  group: "브라우저와 DOM",
  prerequisites: ["39-dom-structure"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "이벤트 전파는 '건물에서 소화기 사용 규정'과 같습니다.\n\n" +
        "건물(document) → 층(body) → 복도(div) → 방(button) 순으로 계층이 있습니다.\n\n" +
        "버튼을 클릭하면(이벤트 발생) 다음 순서로 전파됩니다:\n\n" +
        "**1단계 — 캡처링(Capturing):** 건물 보안팀이 위에서 아래로 내려오며 '화재 발생 위치를 확인합니다'. document → html → body → div → button\n\n" +
        "**2단계 — 타겟(Target):** 실제 이벤트가 발생한 방(button)에 도달합니다.\n\n" +
        "**3단계 — 버블링(Bubbling):** 화재 신고가 아래에서 위로 퍼집니다. button → div → body → html → document. 물방울이 아래에서 위로 올라오는 것처럼.\n\n" +
        "**stopPropagation()**은 '이 층에서 내가 처리했으니 위로 올리지 마세요'입니다.\n\n" +
        "**preventDefault()**는 '기본 대응 매뉴얼을 따르지 않겠습니다'입니다. (링크 이동, 폼 제출 등 기본 동작 차단)",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "이벤트 전파를 이해하지 못하면 예상치 못한 동작이 발생합니다.\n\n" +
        "```html\n" +
        "<div id=\"outer\">\n" +
        "  <div id=\"inner\">\n" +
        "    <button id=\"btn\">클릭</button>\n" +
        "  </div>\n" +
        "</div>\n" +
        "```\n\n" +
        "```js\n" +
        "outer.addEventListener('click', () => console.log('outer 클릭'));\n" +
        "inner.addEventListener('click', () => console.log('inner 클릭'));\n" +
        "btn.addEventListener('click', () => console.log('btn 클릭'));\n" +
        "\n" +
        "// btn 클릭 시 출력:\n" +
        "// btn 클릭\n" +
        "// inner 클릭  ← 왜 inner도 실행되지?\n" +
        "// outer 클릭  ← 왜 outer도 실행되지?\n" +
        "```\n\n" +
        "**실제 문제 사례:**\n" +
        "- 모달의 배경 클릭 시 닫히는 기능을 구현할 때, 모달 내부 클릭도 닫힘\n" +
        "- 드롭다운 메뉴를 열었는데 배경 클릭 이벤트가 즉시 닫아버림\n" +
        "- 폼의 submit 버튼 클릭 시 불필요한 페이지 이동",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 이벤트 흐름 3단계\n\n" +
        "```\n" +
        "document → html → body → div → button (캡처링)\n" +
        "                             ↑ (타겟)\n" +
        "document ← html ← body ← div ← button (버블링)\n" +
        "```\n\n" +
        "### addEventListener 옵션\n\n" +
        "```js\n" +
        "// 기본: 버블링 단계에서 처리 (capture: false)\n" +
        "el.addEventListener('click', handler);\n" +
        "\n" +
        "// 캡처 단계에서 처리\n" +
        "el.addEventListener('click', handler, { capture: true });\n" +
        "// 또는\n" +
        "el.addEventListener('click', handler, true);\n" +
        "```\n\n" +
        "같은 이벤트에 캡처 리스너와 버블 리스너가 모두 있으면 캡처 리스너가 먼저 실행됩니다.\n\n" +
        "### stopPropagation() vs preventDefault()\n\n" +
        "```js\n" +
        "btn.addEventListener('click', (e) => {\n" +
        "  e.stopPropagation();\n" +
        "  // 이벤트 전파 중단 — 부모 요소의 핸들러가 실행 안 됨\n" +
        "  // 하지만 기본 동작(링크 이동 등)은 일어남\n" +
        "});\n" +
        "\n" +
        "link.addEventListener('click', (e) => {\n" +
        "  e.preventDefault();\n" +
        "  // 브라우저 기본 동작 차단 (링크 이동 안 됨)\n" +
        "  // 하지만 이벤트 전파는 계속됨\n" +
        "});\n" +
        "\n" +
        "// 둘 다:\n" +
        "e.stopPropagation();\n" +
        "e.preventDefault();\n" +
        "```\n\n" +
        "### stopImmediatePropagation()\n\n" +
        "같은 요소의 나머지 리스너도 실행 차단:\n" +
        "```js\n" +
        "el.addEventListener('click', (e) => {\n" +
        "  e.stopImmediatePropagation();\n" +
        "  // 같은 el의 다른 click 리스너도 실행 안 됨\n" +
        "});\n" +
        "el.addEventListener('click', () => {\n" +
        "  console.log('실행 안 됨!');\n" +
        "});\n" +
        "```\n\n" +
        "### 버블링이 발생하지 않는 이벤트\n\n" +
        "`focus`, `blur`, `mouseenter`, `mouseleave`, `load`, `unload`, `scroll`(일부)은 버블링되지 않습니다. 대신 버블링되는 `focusin`, `focusout`, `mouseover`, `mouseout`을 사용할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 이벤트 전파 흐름 시각화",
      content:
        "이벤트 전파 순서와 stopPropagation의 효과를 코드로 확인합니다.",
      code: {
        language: "javascript",
        code:
          "// HTML: <div id='outer'><div id='inner'><button id='btn'>클릭</button></div></div>\n" +
          "\n" +
          "const outer = document.getElementById('outer');\n" +
          "const inner = document.getElementById('inner');\n" +
          "const btn = document.getElementById('btn');\n" +
          "\n" +
          "// 캡처링 단계 리스너 (위→아래)\n" +
          "outer.addEventListener('click', e => console.log('outer [캡처]'), true);\n" +
          "inner.addEventListener('click', e => console.log('inner [캡처]'), true);\n" +
          "btn.addEventListener('click', e => console.log('btn [캡처]'), true);\n" +
          "\n" +
          "// 버블링 단계 리스너 (아래→위)\n" +
          "outer.addEventListener('click', e => console.log('outer [버블]'));\n" +
          "inner.addEventListener('click', e => console.log('inner [버블]'));\n" +
          "btn.addEventListener('click', e => console.log('btn [버블]'));\n" +
          "\n" +
          "// btn 클릭 시 출력 순서:\n" +
          "// outer [캡처] ← 캡처링이 먼저\n" +
          "// inner [캡처]\n" +
          "// btn [캡처]   ← 타겟에 도달\n" +
          "// btn [버블]   ← 타겟에서 버블링 시작\n" +
          "// inner [버블]\n" +
          "// outer [버블]\n" +
          "\n" +
          "// === 모달 닫기 패턴 ===\n" +
          "const modal = document.getElementById('modal');\n" +
          "const modalContent = document.querySelector('.modal-content');\n" +
          "\n" +
          "// 배경(modal) 클릭 시 닫기\n" +
          "modal.addEventListener('click', () => closeModal());\n" +
          "\n" +
          "// 내용 클릭은 닫히지 않게\n" +
          "modalContent.addEventListener('click', (e) => {\n" +
          "  e.stopPropagation(); // 버블링 차단 → modal의 핸들러 실행 안 됨\n" +
          "});",
        description: "캡처링 리스너는 이벤트가 타겟으로 내려오는 길에 실행되고, 버블링 리스너는 타겟에서 위로 올라가는 길에 실행됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 드롭다운 메뉴 구현",
      content:
        "이벤트 전파를 활용해 드롭다운 메뉴를 구현합니다. 외부 클릭 시 닫히는 기능이 핵심입니다.",
      code: {
        language: "javascript",
        code:
          "// 드롭다운 구현 — 이벤트 전파 활용\n" +
          "class Dropdown {\n" +
          "  #trigger;\n" +
          "  #menu;\n" +
          "  #isOpen = false;\n" +
          "\n" +
          "  constructor(container) {\n" +
          "    this.#trigger = container.querySelector('.dropdown-trigger');\n" +
          "    this.#menu = container.querySelector('.dropdown-menu');\n" +
          "    this.#setup();\n" +
          "  }\n" +
          "\n" +
          "  #setup() {\n" +
          "    // 트리거 클릭 시 토글\n" +
          "    this.#trigger.addEventListener('click', (e) => {\n" +
          "      e.stopPropagation(); // document 클릭 핸들러가 즉시 닫지 않도록!\n" +
          "      this.toggle();\n" +
          "    });\n" +
          "\n" +
          "    // 메뉴 내부 클릭 전파 차단\n" +
          "    this.#menu.addEventListener('click', (e) => {\n" +
          "      e.stopPropagation();\n" +
          "    });\n" +
          "\n" +
          "    // 외부 클릭 시 닫기\n" +
          "    document.addEventListener('click', () => this.close());\n" +
          "\n" +
          "    // Escape 키로 닫기\n" +
          "    document.addEventListener('keydown', (e) => {\n" +
          "      if (e.key === 'Escape') this.close();\n" +
          "    });\n" +
          "  }\n" +
          "\n" +
          "  toggle() {\n" +
          "    this.#isOpen ? this.close() : this.open();\n" +
          "  }\n" +
          "\n" +
          "  open() {\n" +
          "    this.#isOpen = true;\n" +
          "    this.#menu.classList.add('is-open');\n" +
          "    this.#trigger.setAttribute('aria-expanded', 'true');\n" +
          "  }\n" +
          "\n" +
          "  close() {\n" +
          "    this.#isOpen = false;\n" +
          "    this.#menu.classList.remove('is-open');\n" +
          "    this.#trigger.setAttribute('aria-expanded', 'false');\n" +
          "  }\n" +
          "}",
        description: "트리거 클릭에 stopPropagation()을 적용해야 document 클릭 핸들러가 바로 메뉴를 닫지 않습니다. 외부 클릭만 document 핸들러가 처리합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**이벤트 흐름:**\n" +
        "캡처링(위→아래) → 타겟 → 버블링(아래→위)\n\n" +
        "| 메서드 | 역할 |\n" +
        "|--------|------|\n" +
        "| stopPropagation() | 이벤트 전파 중단 (부모 핸들러 실행 차단) |\n" +
        "| stopImmediatePropagation() | 전파 + 같은 요소의 나머지 핸들러도 차단 |\n" +
        "| preventDefault() | 브라우저 기본 동작 차단 (이벤트 전파는 계속) |\n\n" +
        "**addEventListener 옵션:**\n" +
        "- `capture: true` — 캡처링 단계에서 처리\n" +
        "- `once: true` — 한 번만 실행 후 자동 제거\n" +
        "- `passive: true` — preventDefault() 미호출 약속\n\n" +
        "**버블링 안 되는 이벤트:** focus, blur, mouseenter, mouseleave, load\n\n" +
        "**핵심:** 대부분의 이벤트는 버블링됩니다. 이를 이해하면 이벤트 위임 패턴(다음 챕터)을 효과적으로 활용할 수 있습니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "이벤트 전파의 3단계(캡처-타겟-버블)를 순서대로 설명할 수 있다",
    "addEventListener의 capture 옵션이 무엇을 의미하는지 설명할 수 있다",
    "stopPropagation()과 preventDefault()의 차이를 명확히 설명할 수 있다",
    "stopImmediatePropagation()이 stopPropagation()과 다른 점을 설명할 수 있다",
    "버블링을 이용해 모달 외부 클릭 닫기를 구현할 수 있다",
    "버블링이 발생하지 않는 이벤트 유형을 알고 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "이벤트가 타겟에 도달하기 전에 먼저 실행되는 단계는?",
      choices: ["버블링", "캡처링", "타겟 단계", "전파 단계"],
      correctIndex: 1,
      explanation: "이벤트 흐름은 캡처링(document→타겟) → 타겟 단계 → 버블링(타겟→document) 순입니다. 캡처링 리스너는 이벤트가 타겟에 도달하기 전에 실행됩니다.",
    },
    {
      id: "q2",
      question: "addEventListener의 세 번째 인자로 true를 전달하면?",
      choices: [
        "이벤트를 한 번만 처리한다",
        "캡처링 단계에서 핸들러가 실행된다",
        "이벤트 전파가 차단된다",
        "passive 모드가 활성화된다",
      ],
      correctIndex: 1,
      explanation: "세 번째 인자로 true를 전달하거나 { capture: true }를 사용하면 핸들러가 캡처링 단계에서 실행됩니다. 기본값 false는 버블링 단계에서 실행합니다.",
    },
    {
      id: "q3",
      question: "stopPropagation()과 preventDefault()를 함께 사용해야 하는 상황은?",
      choices: [
        "항상 함께 사용해야 한다",
        "링크 클릭 시 페이지 이동을 막고 부모 요소의 클릭 핸들러도 실행하지 않으려 할 때",
        "폼 제출을 막을 때",
        "이벤트 리스너를 제거할 때",
      ],
      correctIndex: 1,
      explanation: "preventDefault()만으로는 이벤트 전파가 계속되어 부모의 클릭 핸들러가 실행됩니다. stopPropagation()만으로는 링크 이동이 일어납니다. 둘 다 필요할 때 함께 사용합니다.",
    },
    {
      id: "q4",
      question: "버블링되지 않는 이벤트는?",
      choices: ["click", "focus", "keydown", "input"],
      correctIndex: 1,
      explanation: "focus와 blur는 버블링되지 않습니다. 이벤트 위임이 필요하다면 버블링되는 focusin과 focusout을 사용하세요. click, keydown, input은 모두 버블링됩니다.",
    },
    {
      id: "q5",
      question: "{ once: true } 옵션의 효과는?",
      choices: [
        "이벤트를 한 번만 캡처한다",
        "핸들러가 한 번 실행된 후 자동으로 removeEventListener된다",
        "이벤트 전파를 한 번만 허용한다",
        "첫 번째 클릭만 처리하고 이후는 무시한다",
      ],
      correctIndex: 1,
      explanation: "{ once: true } 옵션을 사용하면 핸들러가 처음 실행된 후 자동으로 제거됩니다. 수동으로 removeEventListener를 호출하는 것과 동일하며 코드가 간결해집니다.",
    },
    {
      id: "q6",
      question: "event.currentTarget과 event.target의 차이는?",
      choices: [
        "차이 없다",
        "currentTarget은 핸들러가 등록된 요소, target은 실제 이벤트가 발생한 요소",
        "target은 핸들러가 등록된 요소, currentTarget은 이벤트 발생 요소",
        "currentTarget은 캡처링, target은 버블링 단계의 요소",
      ],
      correctIndex: 1,
      explanation: "event.target은 실제 이벤트가 발생한 가장 안쪽 요소입니다. event.currentTarget은 현재 핸들러가 등록된 요소로, 이벤트가 버블링되는 동안 변경됩니다. 이벤트 위임에서 이 차이가 중요합니다.",
    },
  ],
};

export default chapter;
