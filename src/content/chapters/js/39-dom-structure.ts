import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "39-dom-structure",
  subject: "js",
  title: "DOM 구조와 탐색",
  description: "DOM 트리 구조, 노드 타입, getElementById/querySelector/children 등 탐색 메서드, 노드 생성/삽입/삭제, DocumentFragment의 성능 활용을 깊이 이해합니다.",
  order: 39,
  group: "브라우저와 DOM",
  prerequisites: ["38-debounce-throttle"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "DOM(Document Object Model)은 'HTML을 자바스크립트가 이해할 수 있는 가족 족보'로 변환한 것입니다.\n\n" +
        "HTML 파일은 텍스트입니다. 브라우저는 이 텍스트를 읽어 **트리 구조의 객체**로 변환합니다. 이것이 DOM입니다.\n\n" +
        "**document**는 족보의 최상위 조상입니다. `<html>`은 그 아래의 자식, `<head>`와 `<body>`는 형제(sibling)입니다. 각 HTML 요소는 '노드(Node)'라는 객체가 됩니다.\n\n" +
        "**querySelector()**는 족보에서 특정 사람을 찾는 수색대입니다. `.profile-photo`라는 이름표를 가진 첫 번째 사람을 찾아줍니다.\n\n" +
        "**appendChild()**는 새 가족을 추가하는 것입니다. 새 노드를 만들어 원하는 부모 노드 아래에 붙입니다.\n\n" +
        "**DocumentFragment**는 임시 집합소입니다. 많은 자식을 추가할 때, 하나씩 추가하는 대신 임시 공간에 다 모아두고 한 번에 붙이면 렌더링 성능이 크게 향상됩니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "DOM을 잘못 다루면 심각한 성능 문제가 발생합니다.\n\n" +
        "**문제 1: 반복적인 DOM 접근 — 리플로우 폭발**\n" +
        "```js\n" +
        "// 1000개 아이템을 하나씩 추가\n" +
        "for (let i = 0; i < 1000; i++) {\n" +
        "  const li = document.createElement('li');\n" +
        "  li.textContent = `아이템 ${i}`;\n" +
        "  list.appendChild(li); // 매번 DOM 업데이트 → 1000번 리플로우!\n" +
        "}\n" +
        "```\n\n" +
        "**문제 2: 비효율적인 탐색**\n" +
        "```js\n" +
        "// 루프마다 DOM을 재탐색 (비효율)\n" +
        "for (let i = 0; i < 1000; i++) {\n" +
        "  document.getElementById('list').children[i].style.color = 'red';\n" +
        "}\n" +
        "```\n\n" +
        "**문제 3: innerHTML 보안 문제**\n" +
        "```js\n" +
        "// XSS 취약점!\n" +
        "div.innerHTML = userInput; // 사용자 입력에 <script>가 있다면?\n" +
        "```\n\n" +
        "DOM 조작은 비용이 크므로 최소화해야 하며, 탐색 결과는 캐시해야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### DOM 트리와 노드 타입\n\n" +
        "모든 DOM 노드는 `Node` 인터페이스를 상속합니다.\n\n" +
        "| nodeType 상수 | 값 | 예시 |\n" +
        "|--------------|----|---------|\n" +
        "| ELEMENT_NODE | 1 | `<div>`, `<p>` |\n" +
        "| TEXT_NODE | 3 | '안녕하세요' |\n" +
        "| COMMENT_NODE | 8 | `<!-- 주석 -->` |\n" +
        "| DOCUMENT_NODE | 9 | `document` |\n\n" +
        "### 탐색 메서드\n\n" +
        "```js\n" +
        "// 단일 요소 탐색\n" +
        "document.getElementById('id')           // 가장 빠름\n" +
        "document.querySelector('.class')        // CSS 선택자\n" +
        "\n" +
        "// 다수 요소 탐색\n" +
        "document.querySelectorAll('.item')      // NodeList (정적)\n" +
        "document.getElementsByClassName('item') // HTMLCollection (동적)\n" +
        "\n" +
        "// 트리 탐색\n" +
        "el.parentNode / el.parentElement\n" +
        "el.children                              // Element 자식들만\n" +
        "el.childNodes                            // 모든 노드(텍스트 포함)\n" +
        "el.firstElementChild / el.lastElementChild\n" +
        "el.nextElementSibling / el.previousElementSibling\n" +
        "el.closest('.container')                 // 조상 탐색\n" +
        "```\n\n" +
        "### 노드 생성과 삽입\n\n" +
        "```js\n" +
        "// 생성\n" +
        "const div = document.createElement('div');\n" +
        "const text = document.createTextNode('안녕');\n" +
        "\n" +
        "// 삽입\n" +
        "parent.appendChild(child)              // 마지막에 추가\n" +
        "parent.insertBefore(newNode, refNode)  // 특정 위치에 삽입\n" +
        "parent.prepend(child)                  // 첫 번째에 추가\n" +
        "refNode.after(newNode)                 // 다음 형제로 삽입\n" +
        "parent.replaceChild(newNode, oldNode)  // 교체\n" +
        "\n" +
        "// 삭제\n" +
        "parent.removeChild(child)\n" +
        "child.remove() // 더 간단\n" +
        "```\n\n" +
        "### DocumentFragment — 배치(batch) 삽입\n\n" +
        "```js\n" +
        "const fragment = document.createDocumentFragment();\n" +
        "for (let i = 0; i < 1000; i++) {\n" +
        "  const li = document.createElement('li');\n" +
        "  li.textContent = `아이템 ${i}`;\n" +
        "  fragment.appendChild(li); // 메모리에만 추가\n" +
        "}\n" +
        "list.appendChild(fragment); // 단 한 번의 DOM 업데이트!\n" +
        "```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 효율적인 DOM 조작 패턴",
      content:
        "DocumentFragment, 탐색 캐싱, insertAdjacentHTML을 활용한 효율적인 DOM 조작 패턴입니다.",
      code: {
        language: "javascript",
        code:
          "// === DocumentFragment로 배치 삽입 ===\n" +
          "function renderList(items) {\n" +
          "  const list = document.getElementById('item-list');\n" +
          "  const fragment = document.createDocumentFragment();\n" +
          "\n" +
          "  items.forEach(item => {\n" +
          "    const li = document.createElement('li');\n" +
          "    li.className = 'item';\n" +
          "\n" +
          "    const span = document.createElement('span');\n" +
          "    span.textContent = item.name; // textContent: XSS 안전\n" +
          "\n" +
          "    const btn = document.createElement('button');\n" +
          "    btn.dataset.id = item.id;\n" +
          "    btn.textContent = '삭제';\n" +
          "\n" +
          "    li.append(span, btn);\n" +
          "    fragment.appendChild(li);\n" +
          "  });\n" +
          "\n" +
          "  list.innerHTML = ''; // 기존 목록 초기화\n" +
          "  list.appendChild(fragment); // 단 1번의 리플로우!\n" +
          "}\n" +
          "\n" +
          "// === 탐색 결과 캐싱 ===\n" +
          "const cachedList = document.getElementById('item-list'); // 한 번만 탐색\n" +
          "for (let i = 0; i < 100; i++) {\n" +
          "  // cachedList 재사용 (DOM 재탐색 없음)\n" +
          "  cachedList.children[i]?.classList.toggle('active');\n" +
          "}\n" +
          "\n" +
          "// === closest()로 이벤트 위임 탐색 ===\n" +
          "document.addEventListener('click', (e) => {\n" +
          "  // 클릭된 요소가 .card 안에 있는지 확인\n" +
          "  const card = e.target.closest('.card');\n" +
          "  if (!card) return;\n" +
          "  card.classList.toggle('selected');\n" +
          "});\n" +
          "\n" +
          "// === insertAdjacentHTML — innerHTML보다 안전하고 빠름 ===\n" +
          "// 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'\n" +
          "list.insertAdjacentHTML('beforeend', '<li>새 아이템</li>');",
        description: "DocumentFragment는 실제 DOM 외부에 존재하므로 자식을 추가해도 리플로우가 발생하지 않습니다. 마지막에 한 번만 DOM에 연결합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 동적 테이블 렌더링",
      content:
        "대량의 데이터를 효율적으로 DOM에 렌더링하는 패턴을 실습합니다.",
      code: {
        language: "javascript",
        code:
          "// 데이터 → 테이블 렌더링 (효율적 버전)\n" +
          "function renderTable(data, tableId) {\n" +
          "  const table = document.getElementById(tableId);\n" +
          "  if (!table) throw new Error(`테이블 #${tableId}를 찾을 수 없습니다`);\n" +
          "\n" +
          "  // tbody 탐색 (캐싱)\n" +
          "  let tbody = table.querySelector('tbody');\n" +
          "  if (!tbody) {\n" +
          "    tbody = document.createElement('tbody');\n" +
          "    table.appendChild(tbody);\n" +
          "  }\n" +
          "\n" +
          "  // DocumentFragment로 배치 생성\n" +
          "  const fragment = document.createDocumentFragment();\n" +
          "\n" +
          "  for (const row of data) {\n" +
          "    const tr = document.createElement('tr');\n" +
          "    tr.dataset.id = row.id;\n" +
          "\n" +
          "    // 각 셀 생성\n" +
          "    const cells = [row.id, row.name, row.email, row.role];\n" +
          "    for (const cellData of cells) {\n" +
          "      const td = document.createElement('td');\n" +
          "      td.textContent = cellData; // XSS 안전\n" +
          "      tr.appendChild(td);\n" +
          "    }\n" +
          "\n" +
          "    fragment.appendChild(tr);\n" +
          "  }\n" +
          "\n" +
          "  tbody.innerHTML = '';\n" +
          "  tbody.appendChild(fragment); // 단 1번 DOM 업데이트\n" +
          "}\n" +
          "\n" +
          "// 노드 탐색 유틸리티\n" +
          "function getAncestorsUntil(el, selector) {\n" +
          "  const ancestors = [];\n" +
          "  let current = el.parentElement;\n" +
          "  while (current && !current.matches(selector)) {\n" +
          "    ancestors.push(current);\n" +
          "    current = current.parentElement;\n" +
          "  }\n" +
          "  return ancestors;\n" +
          "}",
        description: "textContent를 사용하면 HTML 태그가 이스케이프되어 XSS를 방지합니다. innerHTML은 서버에서 신뢰된 HTML만 삽입할 때 사용하고, 사용자 입력에는 절대 사용하지 마세요.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 탐색 메서드 | 반환 타입 | 동적 업데이트 | 성능 |\n" +
        "|------------|-----------|--------------|------|\n" +
        "| getElementById | Element | - | 최고 |\n" +
        "| querySelector | Element | - | 좋음 |\n" +
        "| querySelectorAll | NodeList (정적) | X | 좋음 |\n" +
        "| getElementsBy* | HTMLCollection (동적) | O | 빠름 |\n\n" +
        "**DOM 조작 성능 규칙:**\n" +
        "1. DOM 탐색 결과 변수에 캐시\n" +
        "2. 대량 삽입은 DocumentFragment 사용\n" +
        "3. 사용자 입력은 textContent, 신뢰된 HTML은 innerHTML\n" +
        "4. 읽기-쓰기를 분리해 레이아웃 스래싱 방지\n\n" +
        "**closest()**: 현재 요소부터 조상으로 올라가며 selector에 맞는 첫 요소 반환\n\n" +
        "**핵심:** DOM 조작은 비용이 큰 연산입니다. 최소한의 DOM 접근과 배치 처리로 성능을 최적화하세요.\n\n" +
        "**다음 챕터 미리보기:** 이벤트 버블링과 캡처링의 원리를 배우며 DOM 이벤트 시스템을 깊이 이해합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "DOM 트리의 개념과 주요 노드 타입(Element, Text, Comment)을 설명할 수 있다",
    "querySelector와 getElementById의 차이와 사용 시기를 설명할 수 있다",
    "children과 childNodes의 차이를 설명할 수 있다",
    "DocumentFragment를 사용해야 하는 이유와 방법을 설명할 수 있다",
    "textContent와 innerHTML의 차이와 보안 함의를 설명할 수 있다",
    "closest()로 이벤트 위임 탐색을 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "querySelector()와 getElementsByClassName()의 가장 큰 차이는?",
      choices: [
        "querySelector가 더 빠르다",
        "getElementsByClassName은 HTMLCollection(동적)을 반환해 DOM 변경이 즉시 반영되지만, querySelector는 정적 NodeList를 반환한다",
        "querySelector는 클래스 선택자를 지원하지 않는다",
        "getElementsByClassName은 IE에서만 동작한다",
      ],
      correctIndex: 1,
      explanation: "getElementsByClassName()은 살아있는 HTMLCollection을 반환해 DOM이 변경되면 컬렉션도 자동 업데이트됩니다. querySelectorAll()은 호출 시점의 정적 NodeList를 반환합니다. 이 차이를 모르면 루프 중 컬렉션 수정 시 예기치 않은 동작이 발생합니다.",
    },
    {
      id: "q2",
      question: "DocumentFragment를 사용하는 주된 이유는?",
      choices: [
        "XMLDocument를 파싱하기 위해",
        "여러 노드를 메모리에서 조합 후 단 한 번의 DOM 업데이트로 삽입해 리플로우를 최소화하기 위해",
        "이벤트 버블링을 차단하기 위해",
        "Shadow DOM을 구현하기 위해",
      ],
      correctIndex: 1,
      explanation: "DocumentFragment는 실제 DOM의 일부가 아닌 가상 컨테이너입니다. 자식 노드를 추가해도 리플로우가 발생하지 않습니다. DOM에 연결할 때 단 한 번만 리플로우가 발생해 대량 삽입 성능이 크게 향상됩니다.",
    },
    {
      id: "q3",
      question: "사용자 입력 데이터를 DOM에 표시할 때 innerHTML 대신 textContent를 사용해야 하는 이유는?",
      choices: [
        "textContent가 더 빠르기 때문",
        "innerHTML은 더 이상 지원되지 않기 때문",
        "textContent는 HTML 태그를 이스케이프해 XSS 공격을 방지하기 때문",
        "textContent는 모든 브라우저에서 지원되기 때문",
      ],
      correctIndex: 2,
      explanation: "innerHTML은 문자열을 HTML로 파싱해 실행하므로, 사용자가 입력한 <script> 태그 등이 실행될 수 있습니다(XSS). textContent는 입력을 순수 텍스트로 처리해 태그를 그대로 표시하므로 안전합니다.",
    },
    {
      id: "q4",
      question: "children과 childNodes의 차이는?",
      choices: [
        "children은 직접 자식만, childNodes는 모든 후손을 포함한다",
        "children은 Element 노드만, childNodes는 Text/Comment 노드를 포함한 모든 노드를 반환한다",
        "children은 동적, childNodes는 정적이다",
        "children은 HTML5에서 deprecated되었다",
      ],
      correctIndex: 1,
      explanation: "children은 HTMLCollection으로 Element 타입 노드만 포함합니다. childNodes는 NodeList로 Element, Text(공백 포함), Comment 등 모든 타입의 노드를 포함합니다. 일반적으로 children을 사용하는 것이 의도에 맞을 때가 많습니다.",
    },
    {
      id: "q5",
      question: "element.closest('.parent')의 동작은?",
      choices: [
        "가장 가까운 .parent 자식 요소를 찾는다",
        "element 자신부터 시작해 DOM 트리를 올라가며 .parent와 일치하는 첫 조상을 반환한다",
        "document 최상위에서 내려오며 .parent를 찾는다",
        ".parent 선택자와 일치하는 형제 요소를 찾는다",
      ],
      correctIndex: 1,
      explanation: "closest()는 현재 요소(자기 자신 포함)에서 시작해 부모, 조부모... 순으로 DOM 트리를 올라가며 CSS 선택자와 일치하는 첫 요소를 반환합니다. 일치하는 요소가 없으면 null을 반환합니다.",
    },
    {
      id: "q6",
      question: "DOM 조작 성능을 위한 '레이아웃 스래싱(Layout Thrashing)' 방지 방법은?",
      choices: [
        "addEventListener 대신 onclick 속성 사용",
        "DOM 읽기(offsetHeight 등)와 DOM 쓰기(style 변경 등)를 분리해 묶음으로 처리",
        "모든 DOM 접근에 setTimeout을 사용",
        "querySelector 대신 getElementById만 사용",
      ],
      correctIndex: 1,
      explanation: "레이아웃 스래싱은 DOM 읽기(getComputedStyle, offsetHeight 등)와 쓰기(style 변경)가 교차 반복될 때 발생합니다. 읽기를 먼저 묶고, 그 후 쓰기를 묶으면 브라우저가 레이아웃 계산을 최적화합니다.",
    },
  ],
};

export default chapter;
