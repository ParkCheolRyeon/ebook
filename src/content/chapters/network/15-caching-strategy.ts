import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "15-caching-strategy",
  subject: "network",
  title: "캐싱 전략",
  description: "브라우저 캐시부터 Service Worker, SWR 패턴까지 프론트엔드 개발자가 알아야 할 캐싱 전략을 체계적으로 학습합니다.",
  order: 15,
  group: "브라우저 네트워킹",
  prerequisites: ["06-http-headers"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "캐싱은 자주 보는 책을 정리하는 것과 비슷합니다.\n\n" +
        "**브라우저 캐시(HTTP Cache)**는 책상 위에 자주 읽는 책을 올려놓는 것입니다. " +
        "도서관(서버)에 갈 필요 없이 바로 꺼내 읽을 수 있습니다. " +
        "하지만 개정판이 나왔는지 가끔 확인(재검증)해야 합니다.\n\n" +
        "**Cache-Control**은 책에 붙인 포스트잇입니다. " +
        "'1주일간 그냥 읽어(max-age)', '매번 개정판 나왔는지 확인해(no-cache)', " +
        "'절대 보관하지 마(no-store)' 같은 지시가 적혀 있습니다.\n\n" +
        "**ETag**는 책의 판번호(초판, 2쇄 등)입니다. " +
        "'제가 가진 건 2쇄인데, 새 판이 나왔나요?'라고 물어보면 " +
        "서버가 '그대로예요(304)' 또는 '새 판 나왔어요(200 + 새 내용)'라고 답합니다.\n\n" +
        "**Service Worker 캐시**는 개인 서재입니다. 도서관이 문을 닫아도(오프라인) " +
        "서재에 있는 책은 읽을 수 있고, 나만의 규칙으로 관리할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "네트워크 요청은 웹 성능의 가장 큰 병목입니다.\n\n" +
        "1. **반복 요청 낭비**: 같은 리소스를 매번 서버에서 다운로드하면 대역폭과 시간이 낭비됩니다\n" +
        "2. **느린 초기 로딩**: JS 번들, CSS, 이미지 등을 매번 새로 받으면 사용자 경험이 저하됩니다\n" +
        "3. **오래된 데이터**: 캐시를 너무 공격적으로 사용하면 사용자가 오래된 콘텐츠를 보게 됩니다\n" +
        "4. **캐시 무효화의 어려움**: 업데이트를 배포해도 사용자 브라우저에 이전 버전이 남아있을 수 있습니다\n\n" +
        "올바른 캐싱 전략은 '가능한 오래 캐시하되, 변경 시 즉시 새 버전을 제공'하는 균형을 찾는 것입니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### Cache-Control 주요 디렉티브\n" +
        "- `max-age=N`: N초 동안 캐시 사용 (서버 확인 불필요)\n" +
        "- `no-cache`: 캐시 저장하되, 사용 전 반드시 서버에 재검증\n" +
        "- `no-store`: 캐시에 아예 저장하지 않음 (민감한 데이터)\n" +
        "- `must-revalidate`: 만료 후 반드시 재검증 (오프라인 사용 불가)\n" +
        "- `stale-while-revalidate=N`: 만료 후에도 N초간 캐시를 먼저 보여주고 백그라운드에서 갱신\n" +
        "- `public`: CDN 등 공유 캐시에 저장 가능\n" +
        "- `private`: 브라우저 캐시에만 저장 (개인 데이터)\n\n" +
        "### 재검증 메커니즘\n" +
        "**ETag / If-None-Match:**\n" +
        "- 서버가 응답에 `ETag: \"abc123\"` 포함\n" +
        "- 브라우저가 `If-None-Match: \"abc123\"`으로 재검증 요청\n" +
        "- 변경 없으면 `304 Not Modified` (본문 없이 응답)\n\n" +
        "**Last-Modified / If-Modified-Since:**\n" +
        "- 서버가 `Last-Modified: Thu, 01 Jan 2025 00:00:00 GMT` 포함\n" +
        "- 브라우저가 `If-Modified-Since`로 변경 여부 확인\n\n" +
        "### 캐시 버스팅 (Cache Busting)\n" +
        "빌드 도구가 파일명에 해시를 추가하여 내용 변경 시 새 URL을 생성합니다:\n" +
        "- `main.abc123.js` → 내용 변경 → `main.def456.js`\n" +
        "- 파일명이 달라지므로 새 리소스로 인식\n" +
        "- HTML은 no-cache, JS/CSS는 max-age=31536000(1년) 설정 가능\n\n" +
        "### Service Worker 캐시\n" +
        "프로그래밍 가능한 캐시 레이어입니다:\n" +
        "- Cache First: 캐시 먼저, 없으면 네트워크 (정적 에셋)\n" +
        "- Network First: 네트워크 먼저, 실패 시 캐시 (API 데이터)\n" +
        "- Stale While Revalidate: 캐시 즉시 반환 + 백그라운드 갱신\n\n" +
        "### SWR / React Query 캐시\n" +
        "라이브러리 수준에서 API 응답을 캐시하고 자동으로 갱신합니다:\n" +
        "- staleTime: 데이터를 신선하다고 간주하는 시간\n" +
        "- gcTime: 비활성 데이터를 메모리에 유지하는 시간\n" +
        "- 자동 재검증: 포커스, 재연결, 인터벌 기반",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 캐시 전략 결정 흐름",
      content:
        "브라우저가 리소스를 요청할 때 캐시를 어떻게 처리하는지, 그리고 적절한 캐시 전략을 선택하는 로직을 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          "// 브라우저의 캐시 처리 흐름 (의사코드)\n" +
          "\n" +
          "interface CacheEntry {\n" +
          "  response: Response;\n" +
          "  etag?: string;\n" +
          "  lastModified?: string;\n" +
          "  maxAge: number;      // 초 단위\n" +
          "  storedAt: number;    // 저장 시각 (timestamp)\n" +
          "  staleWhileRevalidate: number;\n" +
          "}\n" +
          "\n" +
          "function handleRequest(url: string): Response {\n" +
          "  const cached = cacheStorage.get(url);\n" +
          "  if (!cached) {\n" +
          "    // 캐시 미스 → 네트워크 요청\n" +
          "    return fetchAndStore(url);\n" +
          "  }\n" +
          "\n" +
          "  const age = (Date.now() - cached.storedAt) / 1000;\n" +
          "  const isFresh = age < cached.maxAge;\n" +
          "\n" +
          "  if (isFresh) {\n" +
          "    // 신선함 → 캐시 직접 반환 (네트워크 요청 없음)\n" +
          "    return cached.response;\n" +
          "  }\n" +
          "\n" +
          "  const isStaleOk = age < cached.maxAge + cached.staleWhileRevalidate;\n" +
          "  if (isStaleOk) {\n" +
          "    // Stale-While-Revalidate → 캐시 반환 + 백그라운드 갱신\n" +
          "    backgroundRevalidate(url, cached);\n" +
          "    return cached.response;\n" +
          "  }\n" +
          "\n" +
          "  // 만료됨 → 재검증 요청\n" +
          "  return revalidate(url, cached);\n" +
          "}\n" +
          "\n" +
          "function revalidate(url: string, cached: CacheEntry): Response {\n" +
          "  const headers: Record<string, string> = {};\n" +
          "  if (cached.etag) {\n" +
          "    headers['If-None-Match'] = cached.etag;\n" +
          "  }\n" +
          "  if (cached.lastModified) {\n" +
          "    headers['If-Modified-Since'] = cached.lastModified;\n" +
          "  }\n" +
          "\n" +
          "  const response = fetch(url, { headers });\n" +
          "  if (response.status === 304) {\n" +
          "    // 변경 없음 → 캐시 갱신(타이머 리셋) 후 캐시 반환\n" +
          "    cached.storedAt = Date.now();\n" +
          "    return cached.response;\n" +
          "  }\n" +
          "\n" +
          "  // 변경됨 → 새 응답 저장\n" +
          "  cacheStorage.set(url, response);\n" +
          "  return response;\n" +
          "}",
        description: "캐시가 신선하면 바로 반환, stale-while-revalidate 범위면 캐시 반환 후 백그라운드 갱신, 만료되면 재검증 요청을 보낸다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 캐싱 전략 적용",
      content:
        "프론트엔드 프로젝트에서 실제로 적용할 수 있는 캐시 설정과 React Query 캐시 전략을 실습합니다.",
      code: {
        language: "typescript",
        code:
          "// 1. 리소스 유형별 캐시 전략 설정 (서버/CDN 응답 헤더)\n" +
          "\n" +
          "// HTML — 항상 재검증 (최신 JS/CSS 참조 보장)\n" +
          "// Cache-Control: no-cache\n" +
          "\n" +
          "// 해시 파일명 JS/CSS — 장기 캐시 (내용 바뀌면 URL이 바뀜)\n" +
          "// Cache-Control: public, max-age=31536000, immutable\n" +
          "\n" +
          "// API 응답 — 짧은 캐시 + stale-while-revalidate\n" +
          "// Cache-Control: private, max-age=0, stale-while-revalidate=60\n" +
          "\n" +
          "// 2. React Query 캐시 설정\n" +
          "import { useQuery, QueryClient } from '@tanstack/react-query';\n" +
          "\n" +
          "const queryClient = new QueryClient({\n" +
          "  defaultOptions: {\n" +
          "    queries: {\n" +
          "      staleTime: 5 * 60 * 1000,  // 5분간 신선하다고 간주\n" +
          "      gcTime: 10 * 60 * 1000,    // 10분간 비활성 데이터 유지\n" +
          "      refetchOnWindowFocus: true, // 탭 복귀 시 재검증\n" +
          "      retry: 3,                   // 실패 시 3회 재시도\n" +
          "    },\n" +
          "  },\n" +
          "});\n" +
          "\n" +
          "// 자주 변하는 데이터 — 짧은 staleTime\n" +
          "function useNotifications() {\n" +
          "  return useQuery({\n" +
          "    queryKey: ['notifications'],\n" +
          "    queryFn: () => fetch('/api/notifications').then(r => r.json()),\n" +
          "    staleTime: 30 * 1000,          // 30초\n" +
          "    refetchInterval: 60 * 1000,    // 1분마다 자동 갱신\n" +
          "  });\n" +
          "}\n" +
          "\n" +
          "// 거의 안 변하는 데이터 — 긴 staleTime\n" +
          "function useCategories() {\n" +
          "  return useQuery({\n" +
          "    queryKey: ['categories'],\n" +
          "    queryFn: () => fetch('/api/categories').then(r => r.json()),\n" +
          "    staleTime: 24 * 60 * 60 * 1000, // 24시간\n" +
          "  });\n" +
          "}\n" +
          "\n" +
          "// 3. Service Worker Cache-First 전략\n" +
          "// self.addEventListener('fetch', (event) => {\n" +
          "//   if (event.request.url.includes('/static/')) {\n" +
          "//     event.respondWith(\n" +
          "//       caches.match(event.request).then((cached) => {\n" +
          "//         return cached || fetch(event.request).then((response) => {\n" +
          "//           const cache = await caches.open('static-v1');\n" +
          "//           cache.put(event.request, response.clone());\n" +
          "//           return response;\n" +
          "//         });\n" +
          "//       })\n" +
          "//     );\n" +
          "//   }\n" +
          "// });",
        description: "HTML은 no-cache, 해시 파일은 장기 캐시, API는 staleTime 기반으로 관리하는 것이 일반적인 캐싱 전략이다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 캐시 전략 | 대상 | Cache-Control |\n" +
        "|-----------|------|---------------|\n" +
        "| 캐시 안 함 | 민감한 데이터 | no-store |\n" +
        "| 항상 재검증 | HTML | no-cache |\n" +
        "| 장기 캐시 | 해시 파일명 에셋 | max-age=31536000, immutable |\n" +
        "| 짧은 캐시 | API 응답 | max-age=60, stale-while-revalidate=300 |\n\n" +
        "**핵심 원칙:**\n" +
        "- HTML은 항상 재검증하여 최신 에셋 참조를 보장\n" +
        "- JS/CSS/이미지는 파일명 해시 + 장기 캐시 조합이 최선\n" +
        "- API 데이터는 데이터 특성에 맞는 staleTime 설정\n" +
        "- ETag/304를 활용하면 변경 없을 때 본문 전송을 생략할 수 있음\n" +
        "- stale-while-revalidate로 UX(빠른 응답)와 신선도를 동시에 확보\n\n" +
        "**다음 챕터 미리보기:** 네트워크 최적화를 배우면서, 캐싱 외에도 번들링, 압축, CDN 등 다양한 최적화 기법을 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "HTML은 no-cache로 항상 재검증하고, 해시 파일명 에셋은 장기 캐시하며, API 데이터는 staleTime으로 적절히 관리하는 것이 프론트엔드 캐싱의 핵심이다.",
  checklist: [
    "Cache-Control의 max-age, no-cache, no-store 차이를 설명할 수 있다",
    "ETag/If-None-Match 재검증 흐름을 이해한다",
    "해시 파일명을 이용한 캐시 버스팅 원리를 설명할 수 있다",
    "Service Worker의 Cache First와 Network First 전략을 구분할 수 있다",
    "React Query의 staleTime과 gcTime 개념을 이해하고 적절히 설정할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Cache-Control: no-cache의 의미는?",
      choices: [
        "캐시에 아예 저장하지 않는다",
        "캐시에 저장하되, 사용 전 반드시 서버에 재검증한다",
        "캐시를 1시간 동안 사용한다",
        "CDN에서만 캐시한다",
      ],
      correctIndex: 1,
      explanation: "no-cache는 '캐시하지 마'가 아니라 '캐시해도 되지만 사용 전에 반드시 서버에 확인해'라는 의미입니다. 캐시에 아예 저장하지 않으려면 no-store를 사용합니다.",
    },
    {
      id: "q2",
      question: "서버가 304 Not Modified를 응답하는 경우는?",
      choices: [
        "요청한 리소스를 찾을 수 없을 때",
        "클라이언트의 ETag와 서버의 ETag가 일치할 때",
        "Cache-Control이 no-store일 때",
        "서버에 오류가 발생했을 때",
      ],
      correctIndex: 1,
      explanation: "클라이언트가 If-None-Match 헤더로 보낸 ETag가 서버의 현재 ETag와 일치하면, 리소스가 변경되지 않았으므로 304를 응답합니다. 본문을 보내지 않아 대역폭을 절약합니다.",
    },
    {
      id: "q3",
      question: "파일명에 해시를 포함하는 캐시 버스팅의 장점은?",
      choices: [
        "서버의 저장 공간을 절약한다",
        "내용이 바뀌면 URL이 바뀌어 자동으로 새 파일을 다운로드한다",
        "HTTPS 없이도 보안이 유지된다",
        "브라우저 캐시 크기가 줄어든다",
      ],
      correctIndex: 1,
      explanation: "파일 내용이 바뀌면 해시값이 바뀌어 새로운 URL이 됩니다. 브라우저는 새 URL로 인식하므로 캐시를 무시하고 새 파일을 다운로드합니다. 기존 파일은 max-age=1년으로 장기 캐시할 수 있습니다.",
    },
    {
      id: "q4",
      question: "stale-while-revalidate의 동작 방식은?",
      choices: [
        "캐시가 만료되면 즉시 삭제한다",
        "만료된 캐시를 먼저 반환하고, 백그라운드에서 새 데이터를 가져온다",
        "캐시를 사용하지 않고 항상 네트워크에서 가져온다",
        "캐시의 만료 시간을 두 배로 연장한다",
      ],
      correctIndex: 1,
      explanation: "stale-while-revalidate는 만료된(stale) 캐시를 즉시 반환하여 빠른 응답을 제공하고, 동시에 백그라운드에서 서버의 최신 데이터를 가져와 캐시를 갱신합니다.",
    },
    {
      id: "q5",
      question: "React Query에서 staleTime: 0의 의미는?",
      choices: [
        "데이터를 캐시하지 않는다",
        "데이터를 가져온 즉시 stale 상태로 간주한다",
        "데이터를 영구적으로 신선하다고 간주한다",
        "데이터를 즉시 삭제한다",
      ],
      correctIndex: 1,
      explanation: "staleTime: 0은 데이터를 가져온 즉시 stale(오래된) 상태로 간주합니다. 컴포넌트가 마운트되거나 창에 포커스할 때마다 재검증 요청이 발생합니다. 캐시 자체는 gcTime 동안 유지됩니다.",
    },
  ],
};

export default chapter;
