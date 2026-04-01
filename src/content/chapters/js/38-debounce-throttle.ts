import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "38-debounce-throttle",
  subject: "js",
  title: "디바운스와 스로틀",
  description: "이벤트 폭주를 제어하는 디바운스와 스로틀의 개념, 직접 구현, requestAnimationFrame 활용, 검색/스크롤/리사이즈 실전 사례를 깊이 이해합니다.",
  order: 38,
  group: "메모리와 최적화",
  prerequisites: ["37-memory-leak"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "디바운스와 스로틀은 모두 '이벤트 홍수를 제어하는 수문'입니다.\n\n" +
        "**디바운스(Debounce)**는 '마지막 사람이 엘리베이터를 탄 후 X초 후에 문을 닫는' 방식입니다. 사람이 계속 타면 계속 기다립니다. X초 동안 아무도 타지 않아야 비로소 출발합니다. 검색창에서 타이핑이 끝난 후에만 API를 호출하는 것과 같습니다.\n\n" +
        "**스로틀(Throttle)**은 '1분에 한 번만 문을 열 수 있는 자동문' 방식입니다. 아무리 많이 누르도 X 시간에 한 번만 응답합니다. 스크롤 이벤트에서 스크롤 위치를 업데이트하되 너무 자주는 하지 않는 것과 같습니다.\n\n" +
        "핵심 차이:\n" +
        "- **디바운스**: 마지막 호출 후 N ms가 지나야 실행 (입력이 멈출 때까지 대기)\n" +
        "- **스로틀**: N ms마다 최대 한 번만 실행 (일정 간격으로 실행 보장)",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "사용자 입력 이벤트는 매우 빈번하게 발생합니다.\n\n" +
        "```js\n" +
        "// 문제: 스크롤 이벤트는 초당 수십~수백 번 발생!\n" +
        "window.addEventListener('scroll', () => {\n" +
        "  updateScrollPosition(); // DOM 업데이트\n" +
        "  checkVisibility();      // 가시성 계산\n" +
        "  sendAnalytics();        // 분석 서버 요청\n" +
        "});\n" +
        "\n" +
        "// 문제: 키 입력마다 API 호출!\n" +
        "input.addEventListener('input', (e) => {\n" +
        "  fetch(`/search?q=${e.target.value}`); // '자바스크' 입력 시 5번 호출!\n" +
        "});\n" +
        "\n" +
        "// 문제: resize 이벤트도 마찬가지\n" +
        "window.addEventListener('resize', () => {\n" +
        "  recalculateLayout(); // 매우 비싼 연산\n" +
        "});\n" +
        "```\n\n" +
        "이런 이벤트를 제어하지 않으면:\n" +
        "1. 불필요한 API 호출로 서버 부하 증가\n" +
        "2. 과도한 DOM 업데이트로 UI 버벅임\n" +
        "3. 사용자 경험 저하",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 디바운스 구현\n\n" +
        "```js\n" +
        "function debounce(fn, delay) {\n" +
        "  let timer;\n" +
        "  return function(...args) {\n" +
        "    clearTimeout(timer);         // 이전 타이머 취소\n" +
        "    timer = setTimeout(() => {    // 새 타이머 설정\n" +
        "      fn.apply(this, args);\n" +
        "    }, delay);\n" +
        "  };\n" +
        "}\n" +
        "```\n\n" +
        "### 스로틀 구현 (타임스탬프 방식)\n\n" +
        "```js\n" +
        "function throttle(fn, interval) {\n" +
        "  let lastTime = 0;\n" +
        "  return function(...args) {\n" +
        "    const now = Date.now();\n" +
        "    if (now - lastTime >= interval) {\n" +
        "      lastTime = now;\n" +
        "      fn.apply(this, args);\n" +
        "    }\n" +
        "  };\n" +
        "}\n" +
        "```\n\n" +
        "### 스로틀 구현 (타이머 방식)\n\n" +
        "```js\n" +
        "function throttle(fn, interval) {\n" +
        "  let timer;\n" +
        "  return function(...args) {\n" +
        "    if (!timer) {\n" +
        "      timer = setTimeout(() => {\n" +
        "        fn.apply(this, args);\n" +
        "        timer = null;\n" +
        "      }, interval);\n" +
        "    }\n" +
        "  };\n" +
        "}\n" +
        "```\n\n" +
        "### requestAnimationFrame (rAF)\n\n" +
        "애니메이션/시각적 업데이트에는 스로틀 대신 rAF를 사용합니다. 브라우저의 렌더링 주기(보통 60fps = 16ms마다)와 동기화됩니다.\n\n" +
        "```js\n" +
        "function rafThrottle(fn) {\n" +
        "  let rafId = null;\n" +
        "  return function(...args) {\n" +
        "    if (rafId) return; // 이미 대기 중\n" +
        "    rafId = requestAnimationFrame(() => {\n" +
        "      fn.apply(this, args);\n" +
        "      rafId = null;\n" +
        "    });\n" +
        "  };\n" +
        "}\n" +
        "```\n\n" +
        "### 언제 무엇을 사용할까?\n\n" +
        "| 상황 | 기법 |\n" +
        "|------|------|\n" +
        "| 검색 자동완성 | 디바운스 (입력 완료 후 실행) |\n" +
        "| 폼 유효성 검사 | 디바운스 (입력 멈출 때) |\n" +
        "| 스크롤 이벤트 | 스로틀 (일정 간격으로) |\n" +
        "| 무한 스크롤 | 스로틀 |\n" +
        "| 창 리사이즈 | 디바운스 (리사이즈 완료 후) |\n" +
        "| 애니메이션 | requestAnimationFrame |",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 옵션이 있는 완전한 디바운스",
      content:
        "immediate 옵션(첫 호출 즉시 실행)과 cancel 메서드를 포함한 프로덕션 수준의 디바운스를 구현합니다.",
      code: {
        language: "javascript",
        code:
          "function debounce(fn, delay, { immediate = false } = {}) {\n" +
          "  let timer = null;\n" +
          "\n" +
          "  function debounced(...args) {\n" +
          "    const context = this;\n" +
          "    const callNow = immediate && !timer;\n" +
          "\n" +
          "    clearTimeout(timer);\n" +
          "\n" +
          "    timer = setTimeout(() => {\n" +
          "      timer = null;\n" +
          "      if (!immediate) fn.apply(context, args);\n" +
          "    }, delay);\n" +
          "\n" +
          "    // immediate: 첫 호출 즉시 실행, 이후는 delay 후 재실행 가능\n" +
          "    if (callNow) fn.apply(context, args);\n" +
          "  }\n" +
          "\n" +
          "  // 대기 중인 타이머 취소\n" +
          "  debounced.cancel = function() {\n" +
          "    clearTimeout(timer);\n" +
          "    timer = null;\n" +
          "  };\n" +
          "\n" +
          "  return debounced;\n" +
          "}\n" +
          "\n" +
          "// === 실전 사용 예시 ===\n" +
          "\n" +
          "// 검색: 500ms 입력 멈춤 후 API 호출\n" +
          "const searchDebounced = debounce(async (query) => {\n" +
          "  const results = await fetch(`/search?q=${query}`);\n" +
          "  renderResults(await results.json());\n" +
          "}, 500);\n" +
          "\n" +
          "searchInput.addEventListener('input', (e) => {\n" +
          "  searchDebounced(e.target.value);\n" +
          "});\n" +
          "\n" +
          "// 버튼: 즉시 실행 + 1초 쿨다운\n" +
          "const submitOnce = debounce(handleSubmit, 1000, { immediate: true });\n" +
          "submitBtn.addEventListener('click', submitOnce);\n" +
          "\n" +
          "// 컴포넌트 해제 시 취소\n" +
          "function cleanup() {\n" +
          "  searchDebounced.cancel();\n" +
          "  submitOnce.cancel();\n" +
          "}",
        description: "immediate 옵션은 첫 호출을 즉시 실행하고 이후 delay가 지나야 다시 실행합니다. 버튼 중복 클릭 방지에 유용합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 실전 이벤트 최적화",
      content:
        "스크롤, 검색, 리사이즈에 각각 적합한 기법을 적용합니다.",
      code: {
        language: "javascript",
        code:
          "// === 1. 무한 스크롤 — 스로틀 ===\n" +
          "const handleScroll = throttle(() => {\n" +
          "  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;\n" +
          "  const isNearBottom = scrollTop + clientHeight >= scrollHeight - 200;\n" +
          "\n" +
          "  if (isNearBottom && !isLoading) {\n" +
          "    loadMoreItems();\n" +
          "  }\n" +
          "}, 200); // 200ms마다 최대 한 번 확인\n" +
          "\n" +
          "window.addEventListener('scroll', handleScroll, { passive: true });\n" +
          "\n" +
          "// === 2. 실시간 검색 — 디바운스 ===\n" +
          "const debouncedSearch = debounce(async (query) => {\n" +
          "  if (query.length < 2) return; // 너무 짧으면 건너뜀\n" +
          "  showLoading();\n" +
          "  try {\n" +
          "    const data = await fetch(`/api/search?q=${encodeURIComponent(query)}`);\n" +
          "    renderResults(await data.json());\n" +
          "  } finally {\n" +
          "    hideLoading();\n" +
          "  }\n" +
          "}, 300);\n" +
          "\n" +
          "searchInput.addEventListener('input', e => debouncedSearch(e.target.value));\n" +
          "\n" +
          "// === 3. 창 리사이즈 — 디바운스 ===\n" +
          "const handleResize = debounce(() => {\n" +
          "  const width = window.innerWidth;\n" +
          "  updateLayout(width);\n" +
          "  recalculateGrid(width);\n" +
          "}, 250); // 리사이즈 완료 250ms 후 실행\n" +
          "\n" +
          "window.addEventListener('resize', handleResize);\n" +
          "\n" +
          "// === 4. 애니메이션 — requestAnimationFrame ===\n" +
          "const updateParallax = rafThrottle((scrollY) => {\n" +
          "  hero.style.transform = `translateY(${scrollY * 0.5}px)`;\n" +
          "});\n" +
          "\n" +
          "window.addEventListener('scroll', () => {\n" +
          "  updateParallax(window.scrollY);\n" +
          "}, { passive: true });",
        description: "{ passive: true } 옵션은 스크롤 리스너가 preventDefault()를 호출하지 않음을 브라우저에 알려 스크롤 성능을 향상시킵니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 기법 | 동작 | 최적 사용 사례 |\n" +
        "|------|------|---------------|\n" +
        "| 디바운스 | 마지막 호출 N ms 후 실행 | 검색, 폼 유효성, 리사이즈 |\n" +
        "| 스로틀 | N ms마다 최대 1회 실행 | 스크롤, 마우스 이동, 무한 스크롤 |\n" +
        "| rAF 스로틀 | 렌더링 프레임마다 1회 | 애니메이션, 시각적 업데이트 |\n\n" +
        "**디바운스 구현 핵심:** clearTimeout + setTimeout. 호출할 때마다 타이머를 리셋합니다.\n\n" +
        "**스로틀 구현 핵심:** 마지막 실행 시간 기록. interval이 지났을 때만 실행.\n\n" +
        "**성능 팁:**\n" +
        "- scroll/touchmove 리스너에 `{ passive: true }` 추가\n" +
        "- 시각적 변경은 rAF 사용\n" +
        "- Lodash의 `_.debounce`, `_.throttle`도 프로덕션에서 널리 사용됨\n\n" +
        "**다음 챕터 미리보기:** DOM 구조와 탐색 메서드를 배우며 실제 DOM 조작 방법을 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "디바운스는 '연속 입력이 멈춘 후' 한 번, 스로틀은 '일정 간격마다' 한 번 실행한다. 검색어 자동완성에는 디바운스, 스크롤 핸들러에는 스로틀을 쓴다.",
  checklist: [
    "디바운스와 스로틀의 차이를 명확히 설명할 수 있다",
    "debounce() 함수를 클로저를 이용해 직접 구현할 수 있다",
    "throttle() 함수를 타임스탬프 방식으로 직접 구현할 수 있다",
    "requestAnimationFrame을 스로틀에 사용하는 이유를 설명할 수 있다",
    "검색/스크롤/리사이즈 이벤트에 각각 어떤 기법이 적합한지 설명할 수 있다",
    "passive 이벤트 리스너가 성능에 미치는 영향을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "검색창에서 키 입력 후 300ms 동안 추가 입력이 없을 때만 API를 호출하려면?",
      choices: ["스로틀", "디바운스", "requestAnimationFrame", "setInterval"],
      correctIndex: 1,
      explanation: "디바운스는 마지막 호출 후 일정 시간이 지나야 실행됩니다. 입력이 멈출 때까지 기다렸다가 실행하므로 검색 API 호출 최소화에 적합합니다.",
    },
    {
      id: "q2",
      question: "스크롤 이벤트를 200ms마다 최대 한 번만 처리하려면?",
      choices: ["디바운스", "스로틀", "requestAnimationFrame", "setTimeout"],
      correctIndex: 1,
      explanation: "스로틀은 일정 시간 간격마다 최대 한 번만 실행합니다. 스크롤처럼 지속적으로 발생하는 이벤트를 일정 빈도로 처리할 때 적합합니다.",
    },
    {
      id: "q3",
      question: "디바운스의 핵심 구현 원리는?",
      choices: [
        "lastTime 변수로 마지막 실행 시간 기록",
        "호출마다 clearTimeout으로 이전 타이머를 취소하고 새 타이머 설정",
        "requestAnimationFrame으로 다음 프레임에 실행",
        "Promise.resolve()로 마이크로태스크에 실행 예약",
      ],
      correctIndex: 1,
      explanation: "디바운스는 호출될 때마다 clearTimeout으로 이전 타이머를 취소하고 새 타이머를 설정합니다. delay 시간 안에 다시 호출되면 타이머가 리셋되어, 마지막 호출 후 delay가 지나야 실행됩니다.",
    },
    {
      id: "q4",
      question: "애니메이션 업데이트에 스로틀 대신 requestAnimationFrame을 사용하는 이유는?",
      choices: [
        "requestAnimationFrame이 더 빠르기 때문",
        "브라우저의 렌더링 주기에 맞춰 실행해 불필요한 중간 프레임을 건너뛰기 때문",
        "requestAnimationFrame은 메인 스레드를 차단하지 않기 때문",
        "requestAnimationFrame은 서버에서도 실행되기 때문",
      ],
      correctIndex: 1,
      explanation: "requestAnimationFrame은 브라우저가 다음 화면을 그리기 직전에 콜백을 실행합니다. 16ms(60fps) 이내에 여러 번 업데이트 요청이 와도 마지막 것만 반영되므로, 렌더링 효율이 최적입니다.",
    },
    {
      id: "q5",
      question: "스크롤 이벤트 리스너에 { passive: true }를 추가하는 효과는?",
      choices: [
        "리스너를 자동으로 제거한다",
        "이벤트가 더 느리게 발생한다",
        "브라우저에 preventDefault()를 호출하지 않겠다고 알려 스크롤 성능을 향상시킨다",
        "이벤트를 캡처 단계에서 처리한다",
      ],
      correctIndex: 2,
      explanation: "passive: true는 브라우저에 '이 리스너는 preventDefault()를 호출하지 않겠다'고 알립니다. 덕분에 브라우저는 스크롤을 즉시 처리할 수 있어 스크롤이 매끄러워집니다. 터치스크린 기기에서 특히 중요합니다.",
    },
  ],
};

export default chapter;
