import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "41-event-delegation",
  subject: "js",
  title: "이벤트 위임",
  description: "이벤트 버블링을 활용한 이벤트 위임 패턴, event.target vs event.currentTarget, 동적으로 추가된 요소 처리, matches()와 closest() 활용을 깊이 이해합니다.",
  order: 41,
  group: "브라우저와 DOM",
  prerequisites: ["40-event-bubbling-capturing"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "이벤트 위임은 '대표가 공문을 받아 배분하는 것'과 같습니다.\n\n" +
        "100명의 직원이 각각 개인 우편함을 가지는 것(개별 리스너 등록) 대신, 대표실 하나의 우편함(부모 요소 리스너)으로 모든 공문을 받고 '이 공문은 3팀 김철수에게'라고 판단해 전달합니다.\n\n" +
        "**비유의 장점:**\n" +
        "- 우편함이 1개라 비용이 적습니다 (리스너 1개)\n" +
        "- 새 직원이 입사해도(동적 요소 추가) 대표실 우편함은 그대로 작동합니다\n" +
        "- 직원이 퇴사해도(동적 요소 제거) 우편함을 제거할 필요가 없습니다\n\n" +
        "**event.target**은 '이 공문의 실제 수신자'입니다. 클릭된 정확한 요소.\n\n" +
        "**event.currentTarget**은 '우편함이 있는 대표실'입니다. 리스너가 등록된 요소.\n\n" +
        "**matches('.selector')**는 '이 수신자가 3팀인지 확인'입니다. 특정 조건에 맞는 요소인지 판단합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "많은 자식 요소에 개별로 이벤트 리스너를 등록하는 방식의 문제:\n\n" +
        "```js\n" +
        "// ❌ 비효율적인 방식 — 각 버튼에 리스너 등록\n" +
        "const buttons = document.querySelectorAll('.item button');\n" +
        "buttons.forEach(btn => {\n" +
        "  btn.addEventListener('click', handleDelete); // 100개 = 100개 리스너\n" +
        "});\n" +
        "\n" +
        "// 더 큰 문제: 동적으로 추가된 요소는 리스너 없음!\n" +
        "function addNewItem(text) {\n" +
        "  const li = document.createElement('li');\n" +
        "  li.className = 'item';\n" +
        "  li.innerHTML = `<span>${text}</span><button>삭제</button>`;\n" +
        "  list.appendChild(li);\n" +
        "  // 새 버튼에 리스너를 다시 등록해야 함!\n" +
        "  li.querySelector('button').addEventListener('click', handleDelete);\n" +
        "}\n" +
        "```\n\n" +
        "이 방식은:\n" +
        "1. 리스너가 많아 메모리 사용 증가\n" +
        "2. 동적 요소마다 리스너를 수동으로 추가해야 함\n" +
        "3. 요소 제거 시 리스너도 제거해야 하는 번거로움",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 이벤트 위임(Event Delegation) 패턴\n\n" +
        "부모 요소 하나에 리스너를 등록하고, event.target으로 실제 이벤트 발생 요소를 판단합니다.\n\n" +
        "```js\n" +
        "// ✅ 이벤트 위임 — 부모 하나에 리스너 1개\n" +
        "list.addEventListener('click', (e) => {\n" +
        "  // e.target: 실제 클릭된 요소\n" +
        "  // e.currentTarget: list (리스너가 등록된 요소)\n" +
        "\n" +
        "  if (e.target.matches('.delete-btn')) {\n" +
        "    const item = e.target.closest('.item');\n" +
        "    item.remove();\n" +
        "  }\n" +
        "});\n" +
        "\n" +
        "// 동적으로 추가해도 자동으로 처리됨!\n" +
        "function addNewItem(text) {\n" +
        "  const li = createItemElement(text);\n" +
        "  list.appendChild(li); // 별도 리스너 등록 불필요\n" +
        "}\n" +
        "```\n\n" +
        "### matches() vs closest()\n\n" +
        "```js\n" +
        "// matches: 현재 요소가 선택자와 일치하는지\n" +
        "e.target.matches('.delete-btn') // 정확히 .delete-btn인가?\n" +
        "\n" +
        "// closest: 자신 또는 조상 중 선택자와 일치하는 첫 요소\n" +
        "e.target.closest('.item') // 가장 가까운 .item 조상\n" +
        "```\n\n" +
        "### 다중 액션 위임\n\n" +
        "```js\n" +
        "list.addEventListener('click', (e) => {\n" +
        "  const deleteBtn = e.target.closest('[data-action=\"delete\"]');\n" +
        "  const editBtn = e.target.closest('[data-action=\"edit\"]');\n" +
        "  const itemEl = e.target.closest('.item');\n" +
        "\n" +
        "  if (deleteBtn && itemEl) deleteItem(itemEl.dataset.id);\n" +
        "  if (editBtn && itemEl) editItem(itemEl.dataset.id);\n" +
        "});\n" +
        "```\n\n" +
        "### 이벤트 위임의 한계\n\n" +
        "- 버블링되지 않는 이벤트(focus, blur 등)는 위임 불가 → focusin, focusout 사용\n" +
        "- 너무 상위 요소(document)에 위임하면 모든 클릭을 처리 → 적절한 부모 선택\n" +
        "- stopPropagation()을 사용하는 자식 이벤트는 위임에서 놓칠 수 있음",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 범용 이벤트 위임 유틸리티",
      content:
        "재사용 가능한 이벤트 위임 유틸리티를 구현합니다.",
      code: {
        language: "javascript",
        code:
          "// 범용 이벤트 위임 유틸리티\n" +
          "function delegate(parent, eventType, selector, handler) {\n" +
          "  parent.addEventListener(eventType, (e) => {\n" +
          "    // 클릭된 요소부터 조상으로 올라가며 selector 탐색\n" +
          "    const matched = e.target.closest(selector);\n" +
          "\n" +
          "    // 일치하는 요소가 parent 내부에 있을 때만 처리\n" +
          "    if (matched && parent.contains(matched)) {\n" +
          "      handler.call(matched, e);\n" +
          "    }\n" +
          "  });\n" +
          "}\n" +
          "\n" +
          "// 사용 예시\n" +
          "const list = document.getElementById('todo-list');\n" +
          "\n" +
          "delegate(list, 'click', '[data-action=\"delete\"]', function(e) {\n" +
          "  // this = 클릭된 [data-action=\"delete\"] 요소\n" +
          "  const item = this.closest('.todo-item');\n" +
          "  item.remove();\n" +
          "});\n" +
          "\n" +
          "delegate(list, 'click', '[data-action=\"complete\"]', function(e) {\n" +
          "  const item = this.closest('.todo-item');\n" +
          "  item.classList.toggle('completed');\n" +
          "});\n" +
          "\n" +
          "delegate(list, 'click', '[data-action=\"edit\"]', function(e) {\n" +
          "  const item = this.closest('.todo-item');\n" +
          "  const itemId = item.dataset.id;\n" +
          "  openEditModal(itemId);\n" +
          "});\n" +
          "\n" +
          "// 동적으로 추가되어도 자동 처리!\n" +
          "function addTodo(text) {\n" +
          "  const li = document.createElement('li');\n" +
          "  li.className = 'todo-item';\n" +
          "  li.dataset.id = generateId();\n" +
          "  li.innerHTML = `\n" +
          "    <span>${escapeHtml(text)}</span>\n" +
          "    <button data-action=\"complete\">완료</button>\n" +
          "    <button data-action=\"edit\">수정</button>\n" +
          "    <button data-action=\"delete\">삭제</button>\n" +
          "  `;\n" +
          "  list.appendChild(li);\n" +
          "}",
        description: "closest()를 사용하면 버튼 내부의 아이콘을 클릭해도 data-action 속성을 가진 버튼을 올바르게 탐색합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 정렬 가능한 테이블",
      content:
        "이벤트 위임으로 컬럼 헤더 클릭 시 테이블을 정렬하는 기능을 구현합니다.",
      code: {
        language: "javascript",
        code:
          "// 정렬 가능한 테이블 — 이벤트 위임\n" +
          "class SortableTable {\n" +
          "  #data;\n" +
          "  #table;\n" +
          "  #thead;\n" +
          "  #tbody;\n" +
          "  #sortState = { column: null, asc: true };\n" +
          "\n" +
          "  constructor(tableId, data) {\n" +
          "    this.#table = document.getElementById(tableId);\n" +
          "    this.#thead = this.#table.querySelector('thead');\n" +
          "    this.#tbody = this.#table.querySelector('tbody');\n" +
          "    this.#data = [...data];\n" +
          "    this.#setup();\n" +
          "    this.#render();\n" +
          "  }\n" +
          "\n" +
          "  #setup() {\n" +
          "    // 단 하나의 위임 리스너로 모든 헤더 클릭 처리\n" +
          "    this.#thead.addEventListener('click', (e) => {\n" +
          "      const th = e.target.closest('th[data-sort]');\n" +
          "      if (!th) return;\n" +
          "\n" +
          "      const column = th.dataset.sort;\n" +
          "      if (this.#sortState.column === column) {\n" +
          "        this.#sortState.asc = !this.#sortState.asc;\n" +
          "      } else {\n" +
          "        this.#sortState = { column, asc: true };\n" +
          "      }\n" +
          "      this.#sort();\n" +
          "      this.#updateHeaders();\n" +
          "      this.#render();\n" +
          "    });\n" +
          "  }\n" +
          "\n" +
          "  #sort() {\n" +
          "    const { column, asc } = this.#sortState;\n" +
          "    this.#data.sort((a, b) => {\n" +
          "      const dir = asc ? 1 : -1;\n" +
          "      return a[column] < b[column] ? -dir : dir;\n" +
          "    });\n" +
          "  }\n" +
          "\n" +
          "  #render() {\n" +
          "    const fragment = document.createDocumentFragment();\n" +
          "    for (const row of this.#data) {\n" +
          "      const tr = document.createElement('tr');\n" +
          "      tr.innerHTML = `<td>${row.id}</td><td>${row.name}</td><td>${row.age}</td>`;\n" +
          "      fragment.appendChild(tr);\n" +
          "    }\n" +
          "    this.#tbody.innerHTML = '';\n" +
          "    this.#tbody.appendChild(fragment);\n" +
          "  }\n" +
          "\n" +
          "  #updateHeaders() {\n" +
          "    this.#thead.querySelectorAll('th[data-sort]').forEach(th => {\n" +
          "      const isActive = th.dataset.sort === this.#sortState.column;\n" +
          "      th.setAttribute('aria-sort', isActive\n" +
          "        ? (this.#sortState.asc ? 'ascending' : 'descending')\n" +
          "        : 'none'\n" +
          "      );\n" +
          "    });\n" +
          "  }\n" +
          "}",
        description: "이벤트 위임으로 thead에 리스너 1개만 등록하면 모든 th의 클릭을 처리할 수 있습니다. 컬럼 수가 늘어도 리스너는 여전히 1개입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**이벤트 위임 원리:** 이벤트 버블링을 이용해 부모 요소에서 모든 자식 이벤트를 처리합니다.\n\n" +
        "| | 개별 리스너 | 이벤트 위임 |\n" +
        "|--|------------|------------|\n" +
        "| 리스너 수 | 자식 수만큼 | 1개 |\n" +
        "| 동적 요소 | 매번 리스너 추가 | 자동 처리 |\n" +
        "| 메모리 | 높음 | 낮음 |\n" +
        "| 구현 복잡도 | 낮음 | 약간 높음 |\n\n" +
        "**핵심 메서드:**\n" +
        "- `e.target.matches(selector)` — 정확히 그 요소인지 확인\n" +
        "- `e.target.closest(selector)` — 조상 포함 탐색 (버튼 안 아이콘 클릭 대응)\n\n" +
        "**주의사항:**\n" +
        "- 버블링되지 않는 이벤트는 위임 불가\n" +
        "- 너무 상위에 위임하면 불필요한 이벤트도 처리\n" +
        "- 자식에서 stopPropagation() 사용 시 위임에서 놓침\n\n" +
        "**다음 챕터 미리보기:** 브라우저가 HTML을 화면에 그리는 렌더링 과정 전체를 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "이벤트 위임은 개별 자식 대신 부모에 하나의 핸들러를 등록하는 패턴이다. 버블링을 이용하므로 동적으로 추가되는 요소도 자동으로 처리된다.",
  checklist: [
    "이벤트 위임이 버블링을 어떻게 활용하는지 설명할 수 있다",
    "event.target과 event.currentTarget의 차이를 명확히 설명할 수 있다",
    "matches()와 closest()를 이벤트 위임에서 사용하는 방법을 알고 있다",
    "동적으로 추가된 요소를 이벤트 위임으로 처리할 수 있다",
    "이벤트 위임의 장점(메모리, 동적 요소 처리)을 설명할 수 있다",
    "이벤트 위임이 작동하지 않는 상황(stopPropagation, 버블링 없는 이벤트)을 알고 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "이벤트 위임이 가능한 이유는?",
      choices: [
        "부모 요소가 자식 요소를 감싸기 때문",
        "이벤트 버블링으로 자식에서 발생한 이벤트가 부모까지 전파되기 때문",
        "자바스크립트가 이벤트를 자동으로 위임하기 때문",
        "addEventListener가 자식 요소를 자동으로 감시하기 때문",
      ],
      correctIndex: 1,
      explanation: "이벤트 버블링 덕분에 자식 요소에서 발생한 이벤트가 부모 요소까지 전파됩니다. 부모에 등록된 리스너는 event.target으로 실제 이벤트가 발생한 자식 요소를 파악할 수 있습니다.",
    },
    {
      id: "q2",
      question: "이벤트 위임에서 event.target.matches() 대신 closest()를 사용하는 이유는?",
      choices: [
        "matches()가 더 느리기 때문",
        "버튼 내부에 아이콘 등 자식 요소가 있을 때 그 요소가 클릭되면 matches()는 버튼을 못 찾지만 closest()는 찾을 수 있기 때문",
        "closest()가 더 많은 브라우저에서 지원되기 때문",
        "둘은 완전히 동일하게 동작한다",
      ],
      correctIndex: 1,
      explanation: "버튼 안에 <i class='icon'>이 있을 때 아이콘을 클릭하면 e.target은 아이콘입니다. e.target.matches('.btn')은 false이지만 e.target.closest('.btn')은 부모 버튼을 찾습니다.",
    },
    {
      id: "q3",
      question: "이벤트 위임으로 처리할 수 없는 이벤트는?",
      choices: ["click", "keydown", "focus", "input"],
      correctIndex: 2,
      explanation: "focus는 버블링되지 않으므로 부모 요소에서 잡을 수 없습니다. 이벤트 위임이 필요하다면 버블링되는 focusin을 사용하세요. click, keydown, input은 모두 버블링됩니다.",
    },
    {
      id: "q4",
      question: "이벤트 위임에서 동적으로 추가된 요소가 자동으로 처리되는 이유는?",
      choices: [
        "브라우저가 새 요소를 감지해 리스너를 자동으로 등록하기 때문",
        "리스너가 부모에 등록되어 있어서 이후에 추가된 자식에서 버블링된 이벤트도 잡을 수 있기 때문",
        "MutationObserver가 자동으로 감시하기 때문",
        "querySelector가 동적으로 업데이트되기 때문",
      ],
      correctIndex: 1,
      explanation: "이벤트 위임은 부모 요소에 리스너를 등록합니다. 새로운 자식이 DOM에 추가되어도 그 자식에서 발생한 이벤트는 버블링되어 부모 리스너에서 처리됩니다. 별도 리스너 등록이 필요 없습니다.",
    },
    {
      id: "q5",
      question: "이벤트 위임을 깰 수 있는 상황은?",
      choices: [
        "부모 요소에 여러 리스너를 등록한 경우",
        "자식 요소에서 stopPropagation()을 호출한 경우",
        "이벤트가 비동기적으로 발생한 경우",
        "자식 요소가 동적으로 추가된 경우",
      ],
      correctIndex: 1,
      explanation: "자식 요소에서 e.stopPropagation()을 호출하면 이벤트가 부모로 전파되지 않아 위임 리스너가 이벤트를 받지 못합니다. 이벤트 위임을 사용할 때는 자식의 stopPropagation 사용 여부를 확인해야 합니다.",
    },
  ],
};

export default chapter;
