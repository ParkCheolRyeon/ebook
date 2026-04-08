import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "42-browser-rendering",
  subject: "js",
  title: "브라우저 렌더링 과정",
  description: "HTML/CSS 파싱부터 DOM/CSSOM 생성, 렌더 트리, 레이아웃, 페인트, 컴포지트까지 전체 파이프라인과 리플로우/리페인트 최적화, requestAnimationFrame을 깊이 이해합니다.",
  order: 42,
  group: "브라우저와 DOM",
  prerequisites: ["41-event-delegation"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "브라우저 렌더링은 '건축 설계도로 집을 짓는 과정'과 같습니다.\n\n" +
        "**파싱(Parsing)**: 건축 설계도(HTML/CSS 파일)를 읽고 이해합니다.\n\n" +
        "**DOM 생성**: 설계도의 구조(방 배치)를 자바스크립트가 다룰 수 있는 객체 트리로 변환합니다.\n\n" +
        "**CSSOM 생성**: 인테리어 설계도(CSS)를 역시 객체 트리로 변환합니다.\n\n" +
        "**렌더 트리**: DOM + CSSOM을 합쳐 '실제로 보일 것'만 추립니다. display:none인 방은 제외합니다.\n\n" +
        "**레이아웃(Layout/Reflow)**: '각 방의 정확한 크기와 위치 좌표'를 계산합니다. 가장 비용이 큰 작업.\n\n" +
        "**페인트(Paint)**: 각 레이어에 색상, 텍스트, 이미지를 그립니다.\n\n" +
        "**컴포지트(Composite)**: 여러 레이어를 합쳐 최종 화면을 만듭니다. GPU가 담당.\n\n" +
        "**리플로우**는 집을 다 짓고 나서 방의 크기를 바꾸는 것입니다. 모든 방의 위치를 다시 계산해야 합니다.\n\n" +
        "**리페인트**는 방의 벽지만 바꾸는 것입니다. 위치 계산 없이 다시 그리기만 합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "렌더링 파이프라인을 이해하지 못하면 성능 문제를 만듭니다.\n\n" +
        "**리플로우(Reflow) 유발 — 가장 비싼 작업**\n" +
        "```js\n" +
        "// ❌ 레이아웃 스래싱 (읽기-쓰기-읽기-쓰기 반복)\n" +
        "for (const el of elements) {\n" +
        "  const height = el.offsetHeight; // 읽기 → 레이아웃 계산 강제\n" +
        "  el.style.height = height + 10 + 'px'; // 쓰기 → 레이아웃 무효화\n" +
        "  // 다음 반복의 읽기가 다시 레이아웃을 강제함!\n" +
        "}\n" +
        "```\n\n" +
        "**리플로우를 유발하는 CSS 프로퍼티:** width, height, top, left, margin, padding, border, font-size, display...\n\n" +
        "**리페인트만 유발하는 프로퍼티:** color, background-color, box-shadow, outline...\n\n" +
        "**컴포지트만 사용하는 프로퍼티(가장 빠름):** transform, opacity\n\n" +
        "```js\n" +
        "// ❌ left/top 변경 → 리플로우!\n" +
        "el.style.left = x + 'px';\n" +
        "\n" +
        "// ✅ transform 사용 → 컴포지트만! GPU 가속\n" +
        "el.style.transform = `translateX(${x}px)`;\n" +
        "```",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 렌더링 파이프라인\n\n" +
        "```\n" +
        "HTML → DOM\n" +
        "CSS  → CSSOM\n" +
        "DOM + CSSOM → 렌더 트리\n" +
        "렌더 트리 → 레이아웃 (크기/위치 계산)\n" +
        "레이아웃 → 페인트 (픽셀 그리기)\n" +
        "페인트 → 컴포지트 (레이어 합성)\n" +
        "```\n\n" +
        "### 렌더링 블로킹\n\n" +
        "- **`<script>`** — HTML 파싱을 차단합니다(파서 블로킹). JS가 DOM을 변경할 수 있어서입니다.\n" +
        "- **`<link rel=\"stylesheet\">`** — 렌더 블로킹(render-blocking)이지 파서 블로킹이 아닙니다. HTML 파싱은 계속 진행되지만, CSSOM이 완성될 때까지 렌더 트리 구성과 화면 렌더링이 차단됩니다.\n" +
        "- **`defer`** — HTML 파싱 완료 후 JS 실행\n" +
        "- **`async`** — 다운로드 완료 시 즉시 실행 (파싱 일시 차단)\n\n" +
        "### 레이아웃 스래싱 방지\n\n" +
        "```js\n" +
        "// ✅ 읽기를 먼저 모으고, 쓰기를 나중에 한 번에\n" +
        "const heights = elements.map(el => el.offsetHeight); // 읽기만\n" +
        "elements.forEach((el, i) => {\n" +
        "  el.style.height = heights[i] + 10 + 'px'; // 쓰기만\n" +
        "});\n" +
        "```\n\n" +
        "### will-change 힌트\n\n" +
        "```css\n" +
        "/* 곧 애니메이션될 요소를 별도 레이어로 분리 */\n" +
        ".animated { will-change: transform; }\n" +
        "```\n\n" +
        "### requestAnimationFrame\n\n" +
        "브라우저가 다음 프레임을 그리기 직전에 콜백을 실행합니다.\n\n" +
        "```js\n" +
        "function animate(timestamp) {\n" +
        "  // timestamp: DOMHighResTimeStamp\n" +
        "  el.style.transform = `translateX(${position}px)`;\n" +
        "  position += 2;\n" +
        "  if (position < 300) {\n" +
        "    requestAnimationFrame(animate); // 다음 프레임에 계속\n" +
        "  }\n" +
        "}\n" +
        "requestAnimationFrame(animate);\n" +
        "```\n\n" +
        "### CSS containment\n\n" +
        "```css\n" +
        "/* 이 요소 내부의 변경이 외부 레이아웃에 영향 없음을 명시 */\n" +
        ".widget { contain: layout style paint; }\n" +
        "```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 렌더링 파이프라인 최적화",
      content:
        "레이아웃 스래싱을 방지하고 GPU 가속을 활용하는 최적화 패턴입니다.",
      code: {
        language: "javascript",
        code:
          "// === 레이아웃 스래싱 방지 ===\n" +
          "\n" +
          "// ❌ 나쁜 예: 읽기-쓰기 교차\n" +
          "function badResize(elements) {\n" +
          "  elements.forEach(el => {\n" +
          "    // 매 반복마다 레이아웃 계산 강제\n" +
          "    const w = el.getBoundingClientRect().width; // 읽기\n" +
          "    el.style.width = w * 2 + 'px';             // 쓰기 → 무효화\n" +
          "  });\n" +
          "  // n개 요소 = n번 강제 리플로우!\n" +
          "}\n" +
          "\n" +
          "// ✅ 좋은 예: 읽기 → 쓰기 분리\n" +
          "function goodResize(elements) {\n" +
          "  // 1. 읽기 단계 (레이아웃 1번)\n" +
          "  const widths = elements.map(el => el.getBoundingClientRect().width);\n" +
          "\n" +
          "  // 2. 쓰기 단계 (쓰기만, 레이아웃 재계산은 나중에)\n" +
          "  elements.forEach((el, i) => {\n" +
          "    el.style.width = widths[i] * 2 + 'px';\n" +
          "  });\n" +
          "  // 결과적으로 레이아웃은 1번만!\n" +
          "}\n" +
          "\n" +
          "// === GPU 가속 애니메이션 ===\n" +
          "function smoothAnimation(target, distance, duration) {\n" +
          "  const startTime = performance.now();\n" +
          "  const startX = 0;\n" +
          "\n" +
          "  function step(currentTime) {\n" +
          "    const elapsed = currentTime - startTime;\n" +
          "    const progress = Math.min(elapsed / duration, 1);\n" +
          "\n" +
          "    // easeInOut 이징\n" +
          "    const eased = progress < 0.5\n" +
          "      ? 2 * progress * progress\n" +
          "      : -1 + (4 - 2 * progress) * progress;\n" +
          "\n" +
          "    // ✅ transform: 컴포지트만 → GPU 처리\n" +
          "    target.style.transform = `translateX(${startX + distance * eased}px)`;\n" +
          "\n" +
          "    if (progress < 1) {\n" +
          "      requestAnimationFrame(step);\n" +
          "    }\n" +
          "  }\n" +
          "\n" +
          "  requestAnimationFrame(step);\n" +
          "}",
        description: "transform과 opacity는 컴포지트 레이어에서만 처리되어 CPU를 거치지 않고 GPU가 처리합니다. 이것이 CSS 애니메이션에서 transform을 선호하는 이유입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 가상 스크롤(Virtual Scroll)",
      content:
        "렌더링 최적화의 극단적 예시인 가상 스크롤의 기본 원리를 구현합니다.",
      code: {
        language: "javascript",
        code:
          "// 가상 스크롤 기본 원리 — 수만 개 아이템을 DOM 없이 표시\n" +
          "class VirtualScroll {\n" +
          "  #container;    // 스크롤 컨테이너\n" +
          "  #viewport;     // 보이는 영역\n" +
          "  #data;         // 전체 데이터\n" +
          "  #itemHeight = 50; // 각 아이템 높이 (고정)\n" +
          "  #visibleCount;  // 보이는 아이템 수\n" +
          "\n" +
          "  constructor(container, data) {\n" +
          "    this.#container = container;\n" +
          "    this.#data = data;\n" +
          "    this.#visibleCount = Math.ceil(container.clientHeight / this.#itemHeight) + 2;\n" +
          "\n" +
          "    // 전체 높이를 가진 투명 공간 생성\n" +
          "    const totalHeight = data.length * this.#itemHeight;\n" +
          "    this.#container.style.position = 'relative';\n" +
          "    this.#container.style.height = `${totalHeight}px`;\n" +
          "\n" +
          "    // 실제 렌더링 뷰포트\n" +
          "    this.#viewport = document.createElement('div');\n" +
          "    this.#container.appendChild(this.#viewport);\n" +
          "\n" +
          "    // rAF로 스크롤 최적화\n" +
          "    const parent = container.parentElement;\n" +
          "    const renderOnScroll = rafThrottle(() => this.#render(parent.scrollTop));\n" +
          "    parent.addEventListener('scroll', renderOnScroll, { passive: true });\n" +
          "\n" +
          "    this.#render(0);\n" +
          "  }\n" +
          "\n" +
          "  #render(scrollTop) {\n" +
          "    const startIdx = Math.floor(scrollTop / this.#itemHeight);\n" +
          "    const endIdx = Math.min(startIdx + this.#visibleCount, this.#data.length);\n" +
          "\n" +
          "    // 보이는 아이템만 DOM에 렌더링\n" +
          "    const fragment = document.createDocumentFragment();\n" +
          "    for (let i = startIdx; i < endIdx; i++) {\n" +
          "      const div = document.createElement('div');\n" +
          "      div.style.cssText = `position:absolute; top:${i * this.#itemHeight}px; height:${this.#itemHeight}px; width:100%`;\n" +
          "      div.textContent = this.#data[i];\n" +
          "      fragment.appendChild(div);\n" +
          "    }\n" +
          "\n" +
          "    this.#viewport.innerHTML = '';\n" +
          "    this.#viewport.appendChild(fragment);\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// 10만 개 데이터도 DOM은 항상 ~20개만 유지\n" +
          "const data = Array.from({ length: 100000 }, (_, i) => `아이템 ${i}`);\n" +
          "new VirtualScroll(document.getElementById('scroll-container'), data);",
        description: "가상 스크롤은 화면에 보이는 아이템만 DOM에 유지해 렌더링 성능을 극적으로 향상시킵니다. React Virtualized, TanStack Virtual 등의 라이브러리도 이 원리를 사용합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**렌더링 파이프라인:** HTML 파싱 → DOM → CSSOM → 렌더 트리 → 레이아웃 → 페인트 → 컴포지트\n\n" +
        "| CSS 변경 | 트리거 단계 | 비용 |\n" +
        "|----------|------------|------|\n" +
        "| width, height, margin | 레이아웃 → 페인트 → 컴포지트 | 매우 높음 |\n" +
        "| color, background | 페인트 → 컴포지트 | 보통 |\n" +
        "| transform, opacity | 컴포지트 | 낮음 (GPU) |\n\n" +
        "**성능 최적화 원칙:**\n" +
        "1. DOM 읽기/쓰기 분리 (레이아웃 스래싱 방지)\n" +
        "2. 애니메이션에 transform, opacity 사용\n" +
        "3. 시각적 업데이트는 requestAnimationFrame\n" +
        "4. will-change로 레이어 분리 힌트\n" +
        "5. 대량 렌더링은 DocumentFragment + 가상화\n\n" +
        "**다음 챕터 미리보기:** Proxy와 Reflect로 객체 동작을 가로채고 커스터마이징하는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "브라우저는 HTML→DOM, CSS→CSSOM, Layout→Paint→Composite 순서로 화면을 그린다. 리플로우를 최소화하고 합성(transform, opacity)만 변경하면 성능이 좋아진다.",
  checklist: [
    "브라우저 렌더링 파이프라인의 6단계를 순서대로 설명할 수 있다",
    "리플로우와 리페인트의 차이와 각각 발생시키는 CSS 프로퍼티를 알고 있다",
    "레이아웃 스래싱이 무엇인지, 어떻게 방지하는지 설명할 수 있다",
    "transform/opacity가 다른 CSS 속성보다 성능이 좋은 이유를 설명할 수 있다",
    "requestAnimationFrame의 역할과 사용 방법을 설명할 수 있다",
    "렌더 블로킹 리소스(script, css)와 defer/async 속성의 차이를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "렌더 트리(Render Tree)를 구성할 때 DOM에서 제외되는 요소는?",
      choices: [
        "투명도가 0인 요소",
        "display: none인 요소",
        "visibility: hidden인 요소",
        "opacity: 0인 요소",
      ],
      correctIndex: 1,
      explanation: "display: none인 요소는 렌더 트리에서 완전히 제외됩니다. visibility: hidden과 opacity: 0은 여전히 렌더 트리에 포함되어 공간을 차지하지만 화면에 보이지 않습니다.",
    },
    {
      id: "q2",
      question: "리플로우(Reflow)가 발생하는 상황은?",
      choices: [
        "background-color를 변경할 때",
        "color를 변경할 때",
        "element.offsetHeight를 읽을 때",
        "opacity를 변경할 때",
      ],
      correctIndex: 2,
      explanation: "offsetHeight, offsetWidth, getBoundingClientRect() 등 레이아웃 관련 프로퍼티를 읽으면 브라우저가 최신 레이아웃 정보를 계산하기 위해 강제로 리플로우를 실행합니다. 이것이 레이아웃 스래싱의 원인입니다.",
    },
    {
      id: "q3",
      question: "애니메이션에서 left/top 대신 transform을 사용하는 이유는?",
      choices: [
        "transform이 더 간단하기 때문",
        "transform은 컴포지트 단계만 실행해 GPU에서 처리되므로 메인 스레드 부담이 없기 때문",
        "left/top은 더 이상 지원되지 않기 때문",
        "transform이 더 정확한 픽셀 위치를 제공하기 때문",
      ],
      correctIndex: 1,
      explanation: "left/top 변경은 레이아웃 → 페인트 → 컴포지트 전체를 실행합니다. transform은 컴포지트 단계만 실행하며 GPU에서 처리되어 메인 스레드를 차단하지 않습니다. 60fps 애니메이션을 유지하기 위해 transform 사용을 권장합니다.",
    },
    {
      id: "q4",
      question: "requestAnimationFrame의 콜백이 실행되는 시점은?",
      choices: [
        "setInterval처럼 고정된 16ms 간격",
        "브라우저가 다음 프레임을 화면에 그리기 직전",
        "현재 실행 중인 코드가 끝난 직후",
        "메인 스레드가 유휴 상태일 때",
      ],
      correctIndex: 1,
      explanation: "requestAnimationFrame 콜백은 브라우저가 다음 화면을 그리기 직전에 실행됩니다. 일반적으로 60fps에서 약 16ms마다지만, 백그라운드 탭에서는 1fps로 줄어들어 불필요한 연산을 방지합니다.",
    },
    {
      id: "q5",
      question: "script 태그에 defer 속성을 추가하면?",
      choices: [
        "스크립트가 실행되지 않는다",
        "HTML 파싱과 병렬로 스크립트를 다운로드하고, HTML 파싱이 완료된 후 실행한다",
        "스크립트 다운로드가 완료되면 즉시 HTML 파싱을 중단하고 실행한다",
        "스크립트를 캐시에만 저장하고 실행하지 않는다",
      ],
      correctIndex: 1,
      explanation: "defer 속성은 HTML 파싱을 차단하지 않고 스크립트를 병렬 다운로드하며, HTML 파싱 완료 후 순서대로 실행합니다. async는 다운로드 완료 즉시 파싱을 멈추고 실행하므로 실행 순서가 보장되지 않습니다.",
    },
    {
      id: "q6",
      question: "레이아웃 스래싱을 방지하는 올바른 패턴은?",
      choices: [
        "모든 DOM 조작을 setTimeout으로 지연한다",
        "DOM 읽기(offsetHeight 등)와 쓰기(style 변경)를 분리해 읽기를 먼저 모두 수행한 뒤 쓰기를 한 번에 실행한다",
        "requestAnimationFrame을 항상 사용한다",
        "innerHTML만 사용한다",
      ],
      correctIndex: 1,
      explanation: "레이아웃 스래싱은 읽기와 쓰기가 교차 반복될 때 발생합니다. 읽기를 먼저 모두 수행해 레이아웃 정보를 수집한 뒤, 쓰기를 한 번에 적용하면 브라우저가 레이아웃 계산을 최소화합니다.",
    },
  ],
};

export default chapter;
