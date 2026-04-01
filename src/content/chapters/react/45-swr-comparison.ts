import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "45-swr-comparison",
  subject: "react",
  title: "SWR과 비교",
  description:
    "SWR vs React Query 비교, stale-while-revalidate 전략, API 차이, 선택 기준, 간단한 프로젝트에서의 SWR 활용법을 학습합니다.",
  order: 45,
  group: "데이터 페칭",
  prerequisites: ["44-useoptimistic"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "**SWR**과 **React Query**는 둘 다 비서이지만 성격이 다릅니다.\n\n" +
        "**SWR**은 미니멀리스트 비서입니다. '요청하면 캐시 먼저 보여주고, 백그라운드에서 최신 확인' — 이 원칙을 심플하게 지킵니다. 추가 기능은 필요할 때만 더합니다.\n\n" +
        "**React Query**는 풀스택 비서입니다. 캐싱, 재검증은 물론 낙관적 업데이트, 무한 스크롤, 의존적 쿼리, DevTools까지 모든 것이 내장되어 있습니다.\n\n" +
        "**stale-while-revalidate**는 신문 구독과 같습니다. 아침에 어제 신문(캐시)을 먼저 읽고, 배달부가 오늘 신문(최신 데이터)을 가져오면 교체합니다. 빈 손으로 기다리는 시간이 없습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "데이터 페칭 라이브러리를 선택할 때의 고민:\n\n" +
        "1. **기능 과잉** — 간단한 프로젝트에 React Query의 모든 기능이 필요하지 않을 수 있습니다\n" +
        "2. **번들 크기** — 프로젝트 규모에 비해 라이브러리가 클 수 있습니다\n" +
        "3. **학습 곡선** — React Query의 queryKey, staleTime, gcTime, 태그 기반 무효화 등 설정이 복잡할 수 있습니다\n" +
        "4. **Next.js 통합** — Next.js 프로젝트에서 어떤 라이브러리가 더 자연스럽게 통합되는지 고려해야 합니다\n" +
        "5. **팀 경험** — 팀원들이 이미 사용해본 라이브러리가 다를 수 있습니다",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### SWR의 핵심 철학\n" +
        "HTTP 캐시 무효화 전략인 stale-while-revalidate를 React Hook으로 구현합니다. 캐시된 데이터를 즉시 반환하고, 백그라운드에서 재검증합니다.\n\n" +
        "### SWR이 적합한 경우\n" +
        "- 간단한 데이터 페칭이 주 목적인 프로젝트\n" +
        "- 번들 크기가 중요한 프로젝트\n" +
        "- Next.js 프로젝트 (같은 Vercel 팀 제작)\n" +
        "- 빠른 프로토타이핑\n\n" +
        "### React Query가 적합한 경우\n" +
        "- 복잡한 캐시 무효화가 필요한 프로젝트\n" +
        "- 낙관적 업데이트, 무한 스크롤이 핵심인 프로젝트\n" +
        "- DevTools로 디버깅이 중요한 프로젝트\n" +
        "- mutation이 많은 CRUD 앱\n\n" +
        "### 선택 기준\n" +
        "읽기 위주 → SWR, 쓰기/복잡한 캐시 관리 → React Query",
    },
    {
      type: "pseudocode",
      title: "기술 구현: SWR 기본 사용법",
      content:
        "SWR의 핵심 API인 useSWR과 mutate를 사용한 데이터 페칭과 갱신입니다.",
      code: {
        language: "typescript",
        code:
          'import useSWR, { mutate } from "swr";\n' +
          'import useSWRMutation from "swr/mutation";\n' +
          '\n' +
          'interface Post {\n' +
          '  id: number;\n' +
          '  title: string;\n' +
          '}\n' +
          '\n' +
          '// fetcher 함수 정의\n' +
          'const fetcher = (url: string) => fetch(url).then((res) => res.json());\n' +
          '\n' +
          '// ✅ SWR 기본 사용법\n' +
          'function PostList() {\n' +
          '  // useSWR(key, fetcher, options)\n' +
          '  // key가 변경되면 자동 refetch (React Query의 queryKey와 동일)\n' +
          '  const { data, error, isLoading, isValidating } = useSWR<Post[]>(\n' +
          '    "/api/posts",\n' +
          '    fetcher,\n' +
          '    {\n' +
          '      revalidateOnFocus: true,      // 윈도우 포커스 시 재검증\n' +
          '      revalidateOnReconnect: true,   // 네트워크 재연결 시\n' +
          '      dedupingInterval: 2000,        // 2초 내 중복 요청 제거\n' +
          '    }\n' +
          '  );\n' +
          '\n' +
          '  if (isLoading) return <div>로딩 중...</div>;\n' +
          '  if (error) return <div>에러 발생</div>;\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      {isValidating && <span>업데이트 중...</span>}\n' +
          '      <ul>\n' +
          '        {data?.map((post) => <li key={post.id}>{post.title}</li>)}\n' +
          '      </ul>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ✅ 조건부 페칭 (React Query의 enabled와 유사)\n' +
          'function UserProfile({ userId }: { userId: string | null }) {\n' +
          '  // key가 null이면 요청하지 않음\n' +
          '  const { data } = useSWR(\n' +
          '    userId ? `/api/users/${userId}` : null,\n' +
          '    fetcher\n' +
          '  );\n' +
          '  return <div>{data?.name}</div>;\n' +
          '}\n' +
          '\n' +
          '// ✅ useSWRMutation: 데이터 변경\n' +
          'function CreatePost() {\n' +
          '  const { trigger, isMutating } = useSWRMutation(\n' +
          '    "/api/posts",\n' +
          '    async (url: string, { arg }: { arg: { title: string } }) => {\n' +
          '      const res = await fetch(url, {\n' +
          '        method: "POST",\n' +
          '        body: JSON.stringify(arg),\n' +
          '      });\n' +
          '      return res.json();\n' +
          '    }\n' +
          '  );\n' +
          '\n' +
          '  async function handleCreate() {\n' +
          '    await trigger({ title: "새 글" });\n' +
          '    // 관련 캐시 재검증\n' +
          '    mutate("/api/posts");\n' +
          '  }\n' +
          '\n' +
          '  return (\n' +
          '    <button onClick={handleCreate} disabled={isMutating}>\n' +
          '      {isMutating ? "생성 중..." : "글 작성"}\n' +
          '    </button>\n' +
          '  );\n' +
          '}',
        description:
          "SWR은 key 기반 캐싱, 조건부 페칭(null key), useSWRMutation으로 데이터 변경을 지원합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: SWR vs React Query 동일 기능 비교",
      content:
        "동일한 기능을 SWR과 React Query로 구현하여 API 차이를 비교합니다.",
      code: {
        language: "typescript",
        code:
          '// === 동일 기능 비교: 게시글 목록 + 생성 ===\n' +
          '\n' +
          '// ✅ SWR 방식\n' +
          'import useSWR, { mutate as globalMutate } from "swr";\n' +
          '\n' +
          'function PostListSWR() {\n' +
          '  const { data, error, isLoading } = useSWR("/api/posts", fetcher);\n' +
          '\n' +
          '  async function handleCreate(title: string) {\n' +
          '    // 낙관적 업데이트\n' +
          '    await globalMutate(\n' +
          '      "/api/posts",\n' +
          '      async (current: Post[] | undefined) => {\n' +
          '        const newPost = await createPost(title);\n' +
          '        return [...(current ?? []), newPost];\n' +
          '      },\n' +
          '      {\n' +
          '        optimisticData: (current: Post[] | undefined) => [\n' +
          '          ...(current ?? []),\n' +
          '          { id: Date.now(), title },\n' +
          '        ],\n' +
          '        rollbackOnError: true,\n' +
          '      }\n' +
          '    );\n' +
          '  }\n' +
          '\n' +
          '  return <div>{/* ... */}</div>;\n' +
          '}\n' +
          '\n' +
          '// ✅ React Query 방식\n' +
          'import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";\n' +
          '\n' +
          'function PostListRQ() {\n' +
          '  const queryClient = useQueryClient();\n' +
          '  const { data, error, isLoading } = useQuery({\n' +
          '    queryKey: ["posts"],\n' +
          '    queryFn: () => fetchPosts(),\n' +
          '  });\n' +
          '\n' +
          '  const mutation = useMutation({\n' +
          '    mutationFn: createPost,\n' +
          '    onMutate: async (title: string) => {\n' +
          '      await queryClient.cancelQueries({ queryKey: ["posts"] });\n' +
          '      const prev = queryClient.getQueryData<Post[]>(["posts"]);\n' +
          '      queryClient.setQueryData<Post[]>(["posts"], (old) => [\n' +
          '        ...(old ?? []),\n' +
          '        { id: Date.now(), title },\n' +
          '      ]);\n' +
          '      return { prev };\n' +
          '    },\n' +
          '    onError: (err, vars, ctx) => {\n' +
          '      queryClient.setQueryData(["posts"], ctx?.prev);\n' +
          '    },\n' +
          '    onSettled: () => {\n' +
          '      queryClient.invalidateQueries({ queryKey: ["posts"] });\n' +
          '    },\n' +
          '  });\n' +
          '\n' +
          '  return <div>{/* ... */}</div>;\n' +
          '}\n' +
          '\n' +
          '// 비교 요약:\n' +
          '// SWR: mutate 하나로 낙관적 업데이트 + 롤백 + 재검증\n' +
          '// React Query: onMutate/onError/onSettled 세 콜백으로 세밀한 제어',
        description:
          "SWR의 mutate는 간단한 API로 낙관적 업데이트를 지원하고, React Query는 세 개의 콜백으로 더 세밀한 제어를 제공합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 기준 | SWR | React Query |\n" +
        "|------|-----|------------|\n" +
        "| 번들 크기 | ~4.2KB | ~13KB |\n" +
        "| API 스타일 | key + fetcher | queryKey + queryFn |\n" +
        "| DevTools | 없음 (서드파티) | 공식 DevTools 내장 |\n" +
        "| 무한 스크롤 | useSWRInfinite | useInfiniteQuery |\n" +
        "| 캐시 무효화 | key 기반 mutate | 태그 기반 invalidateQueries |\n" +
        "| 낙관적 업데이트 | mutate의 optimisticData | onMutate 콜백 |\n" +
        "| 조건부 페칭 | null key | enabled 옵션 |\n" +
        "| Next.js 통합 | 자연스러움 (Vercel) | 별도 설정 필요 |\n\n" +
        "**핵심:** SWR은 심플함이 강점이고, React Query는 완전함이 강점입니다. 읽기 위주의 간단한 앱에는 SWR, 복잡한 mutation과 캐시 전략이 필요한 앱에는 React Query를 선택하세요.\n\n" +
        "**시리즈 마무리:** 이제 데이터 페칭의 기초부터 심화까지, useEffect 페칭의 한계에서 React Query, SWR, useOptimistic까지 전체 스펙트럼을 학습했습니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "SWR은 stale-while-revalidate 전략의 심플한 구현이고, React Query는 더 풍부한 캐시 제어와 mutation을 제공한다. 프로젝트 규모에 맞게 선택하라.",
  checklist: [
    "stale-while-revalidate 전략의 동작 원리를 설명할 수 있다",
    "useSWR의 기본 사용법과 주요 옵션을 활용할 수 있다",
    "SWR과 React Query의 API 차이점을 비교 설명할 수 있다",
    "프로젝트 요구사항에 따라 SWR과 React Query 중 적절한 도구를 선택할 수 있다",
    "SWR의 mutate로 캐시 갱신과 낙관적 업데이트를 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "stale-while-revalidate 전략의 핵심 동작은?",
      choices: [
        "항상 서버에서 최신 데이터를 가져옴",
        "캐시된 데이터를 즉시 반환하고, 백그라운드에서 최신 데이터를 가져옴",
        "캐시가 만료되면 빈 화면을 보여줌",
        "서버 데이터를 로컬에 영구 저장",
      ],
      correctIndex: 1,
      explanation:
        "stale-while-revalidate는 오래된(stale) 캐시 데이터를 즉시 보여주면서(while), 백그라운드에서 최신 데이터를 가져와(revalidate) 교체합니다.",
    },
    {
      id: "q2",
      question: "SWR에서 조건부 페칭을 구현하는 방법은?",
      choices: [
        "enabled: false 옵션 사용",
        "key를 null로 전달",
        "skipFetch: true 옵션 사용",
        "fetcher에서 null 반환",
      ],
      correctIndex: 1,
      explanation:
        "SWR에서 key가 null이면 요청을 수행하지 않습니다. useSWR(userId ? `/api/users/${userId}` : null, fetcher) 형태로 사용합니다.",
    },
    {
      id: "q3",
      question: "React Query 대비 SWR의 가장 큰 장점은?",
      choices: [
        "더 강력한 DevTools",
        "더 작은 번들 크기와 간단한 API",
        "더 많은 캐시 무효화 옵션",
        "더 나은 TypeScript 지원",
      ],
      correctIndex: 1,
      explanation:
        "SWR은 약 4.2KB로 React Query(약 13KB)보다 작고, key + fetcher의 간단한 API를 제공합니다.",
    },
    {
      id: "q4",
      question: "SWR보다 React Query가 더 적합한 경우는?",
      choices: [
        "간단한 읽기 위주 앱",
        "Next.js 기본 프로젝트",
        "복잡한 mutation과 태그 기반 캐시 무효화가 필요한 앱",
        "번들 크기가 중요한 프로젝트",
      ],
      correctIndex: 2,
      explanation:
        "React Query는 태그 기반 캐시 무효화, 세밀한 낙관적 업데이트, 공식 DevTools 등 복잡한 데이터 관리에 더 적합합니다.",
    },
    {
      id: "q5",
      question: "SWR의 dedupingInterval 옵션의 역할은?",
      choices: [
        "캐시 만료 시간 설정",
        "지정된 시간 내 동일 key의 중복 요청을 방지",
        "재시도 간격 설정",
        "폴링 간격 설정",
      ],
      correctIndex: 1,
      explanation:
        "dedupingInterval(기본 2초) 내에 같은 key로 요청하면 중복 네트워크 호출 없이 캐시된 결과를 공유합니다.",
    },
    {
      id: "q6",
      question: "SWR의 mutate에서 rollbackOnError 옵션의 역할은?",
      choices: [
        "에러 발생 시 페이지를 새로고침",
        "에러 발생 시 낙관적 업데이트를 취소하고 이전 데이터로 복원",
        "에러 발생 시 자동으로 재시도",
        "에러 발생 시 에러 바운더리를 트리거",
      ],
      correctIndex: 1,
      explanation:
        "rollbackOnError: true로 설정하면 mutate 함수가 에러를 throw할 때 optimisticData로 변경된 캐시가 이전 상태로 자동 복원됩니다.",
    },
  ],
};

export default chapter;
