import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "42-react-query",
  subject: "react",
  title: "React Query (TanStack Query)",
  description:
    "useQuery, useMutation, queryKey, 캐싱 전략, staleTime vs gcTime, 재검증(refetch), QueryClient 설정을 학습합니다.",
  order: 42,
  group: "데이터 페칭",
  prerequisites: ["41-data-fetching-patterns"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "React Query는 똑똑한 비서입니다.\n\n" +
        "**useQuery**는 비서에게 정보를 요청하는 것입니다. '거래처 목록 좀 가져다줘'라고 하면, 비서는 먼저 자기 메모장(캐시)을 확인합니다. 메모가 있고 아직 유효하면 바로 전달하고, 백그라운드에서 최신 정보를 확인합니다.\n\n" +
        "**queryKey**는 비서의 메모장 색인입니다. ['거래처', '서울']이라고 라벨을 붙여두면 같은 요청이 왔을 때 바로 찾을 수 있습니다.\n\n" +
        "**staleTime**은 메모의 유효기간입니다. '이 정보는 5분간 신선해' — 5분 이내에 다시 물으면 확인 없이 바로 답합니다.\n\n" +
        "**useMutation**은 비서에게 업무를 지시하는 것입니다. '이 서류 발송해줘'라고 하면 처리하고, 결과에 따라 관련 메모(캐시)를 갱신합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "커스텀 useFetch Hook으로도 해결하기 어려운 서버 상태의 복잡성:\n\n" +
        "1. **캐싱 전략 부재** — 같은 데이터를 여러 컴포넌트에서 요청하면 매번 네트워크 호출이 발생합니다\n" +
        "2. **백그라운드 업데이트** — 사용자에게 캐시된 데이터를 즉시 보여주면서 백그라운드에서 최신 데이터를 가져오는 것이 어렵습니다\n" +
        "3. **데이터 동기화** — 다른 탭에서 변경된 데이터를 현재 탭에 반영하기 어렵습니다\n" +
        "4. **mutation 후 캐시 갱신** — 데이터를 수정한 후 관련 쿼리의 캐시를 갱신하는 로직이 복잡합니다\n" +
        "5. **에러 재시도** — 네트워크 오류 시 자동 재시도 로직을 직접 구현해야 합니다",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "React Query(TanStack Query)는 서버 상태의 모든 복잡성을 선언적으로 관리합니다.\n\n" +
        "### useQuery\n" +
        "데이터를 가져오고 캐싱합니다. queryKey로 캐시를 식별하고, queryFn으로 데이터를 페칭합니다.\n\n" +
        "### useMutation\n" +
        "데이터를 생성/수정/삭제합니다. onSuccess에서 queryClient.invalidateQueries로 관련 캐시를 갱신합니다.\n\n" +
        "### 캐싱 전략\n" +
        "- **staleTime**: 데이터가 '신선한' 것으로 간주되는 시간. 이 시간 내에는 refetch하지 않습니다\n" +
        "- **gcTime** (구 cacheTime): 비활성 캐시가 메모리에서 제거되기까지의 시간\n\n" +
        "### 자동 재검증\n" +
        "윈도우 포커스, 네트워크 재연결, 간격 기반으로 자동 refetch하여 데이터를 최신으로 유지합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: useQuery와 useMutation",
      content:
        "React Query의 핵심 API를 사용하여 데이터 페칭과 수정을 구현합니다.",
      code: {
        language: "typescript",
        code:
          'import {\n' +
          '  QueryClient,\n' +
          '  QueryClientProvider,\n' +
          '  useQuery,\n' +
          '  useMutation,\n' +
          '  useQueryClient,\n' +
          '} from "@tanstack/react-query";\n' +
          '\n' +
          'interface Post {\n' +
          '  id: number;\n' +
          '  title: string;\n' +
          '  body: string;\n' +
          '}\n' +
          '\n' +
          '// QueryClient 설정\n' +
          'const queryClient = new QueryClient({\n' +
          '  defaultOptions: {\n' +
          '    queries: {\n' +
          '      staleTime: 1000 * 60 * 5, // 5분간 신선\n' +
          '      gcTime: 1000 * 60 * 30,   // 30분간 캐시 유지\n' +
          '      retry: 3,                  // 실패 시 3회 재시도\n' +
          '      refetchOnWindowFocus: true, // 윈도우 포커스 시 refetch\n' +
          '    },\n' +
          '  },\n' +
          '});\n' +
          '\n' +
          '// useQuery: 데이터 읽기\n' +
          'function PostList() {\n' +
          '  const {\n' +
          '    data: posts,\n' +
          '    isLoading,\n' +
          '    isError,\n' +
          '    error,\n' +
          '    refetch,\n' +
          '  } = useQuery({\n' +
          '    queryKey: ["posts"],           // 캐시 키\n' +
          '    queryFn: async () => {         // 페칭 함수\n' +
          '      const res = await fetch("/api/posts");\n' +
          '      if (!res.ok) throw new Error("Failed to fetch posts");\n' +
          '      return res.json() as Promise<Post[]>;\n' +
          '    },\n' +
          '  });\n' +
          '\n' +
          '  if (isLoading) return <div>로딩 중...</div>;\n' +
          '  if (isError) return <div>에러: {error.message}</div>;\n' +
          '\n' +
          '  return (\n' +
          '    <ul>\n' +
          '      {posts?.map((post) => <li key={post.id}>{post.title}</li>)}\n' +
          '    </ul>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// useMutation: 데이터 쓰기\n' +
          'function CreatePost() {\n' +
          '  const queryClient = useQueryClient();\n' +
          '\n' +
          '  const mutation = useMutation({\n' +
          '    mutationFn: async (newPost: { title: string; body: string }) => {\n' +
          '      const res = await fetch("/api/posts", {\n' +
          '        method: "POST",\n' +
          '        body: JSON.stringify(newPost),\n' +
          '      });\n' +
          '      return res.json() as Promise<Post>;\n' +
          '    },\n' +
          '    onSuccess: () => {\n' +
          '      // 성공 시 posts 쿼리 캐시 무효화 → 자동 refetch\n' +
          '      queryClient.invalidateQueries({ queryKey: ["posts"] });\n' +
          '    },\n' +
          '  });\n' +
          '\n' +
          '  return (\n' +
          '    <button\n' +
          '      onClick={() => mutation.mutate({ title: "새 글", body: "내용" })}\n' +
          '      disabled={mutation.isPending}\n' +
          '    >\n' +
          '      {mutation.isPending ? "저장 중..." : "글 작성"}\n' +
          '    </button>\n' +
          '  );\n' +
          '}',
        description:
          "useQuery로 선언적 데이터 페칭, useMutation으로 데이터 변경, invalidateQueries로 캐시 갱신을 구현합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: queryKey 설계와 캐싱 전략",
      content:
        "queryKey를 체계적으로 설계하고, staleTime과 gcTime을 활용하여 캐싱 전략을 구성합니다.",
      code: {
        language: "typescript",
        code:
          'import { useQuery } from "@tanstack/react-query";\n' +
          '\n' +
          '// ✅ queryKey 설계: 계층적 구조 활용\n' +
          '// 모든 게시글: ["posts"]\n' +
          '// 필터링된 게시글: ["posts", { status: "published" }]\n' +
          '// 특정 게시글: ["posts", postId]\n' +
          '// 게시글의 댓글: ["posts", postId, "comments"]\n' +
          '\n' +
          '// queryKey가 변경되면 자동으로 새 데이터를 페칭\n' +
          'function PostList({ status }: { status: string }) {\n' +
          '  const { data } = useQuery({\n' +
          '    // status가 변경되면 자동 refetch\n' +
          '    queryKey: ["posts", { status }],\n' +
          '    queryFn: () => fetchPosts(status),\n' +
          '  });\n' +
          '  return <div>{/* ... */}</div>;\n' +
          '}\n' +
          '\n' +
          '// ✅ staleTime vs gcTime 이해\n' +
          'function UserProfile({ userId }: { userId: string }) {\n' +
          '  const { data, isStale } = useQuery({\n' +
          '    queryKey: ["users", userId],\n' +
          '    queryFn: () => fetchUser(userId),\n' +
          '    staleTime: 1000 * 60 * 10, // 10분간 신선 (refetch 안 함)\n' +
          '    gcTime: 1000 * 60 * 60,    // 1시간 캐시 유지\n' +
          '    // 시나리오:\n' +
          '    // 0분: 첫 페칭 → 캐시 저장\n' +
          '    // 5분: 같은 키로 요청 → staleTime 이내이므로 캐시 반환 (refetch 안 함)\n' +
          '    // 15분: 같은 키로 요청 → stale 데이터 반환 + 백그라운드 refetch\n' +
          '    // 75분 (비활성 상태): gcTime 초과 → 캐시에서 제거\n' +
          '  });\n' +
          '\n' +
          '  return <div>{data?.name} {isStale ? "(업데이트 중)" : ""}</div>;\n' +
          '}\n' +
          '\n' +
          '// ✅ 쿼리 함수 분리 패턴\n' +
          'const postKeys = {\n' +
          '  all: ["posts"] as const,\n' +
          '  lists: () => [...postKeys.all, "list"] as const,\n' +
          '  list: (filters: Record<string, string>) =>\n' +
          '    [...postKeys.lists(), filters] as const,\n' +
          '  details: () => [...postKeys.all, "detail"] as const,\n' +
          '  detail: (id: number) => [...postKeys.details(), id] as const,\n' +
          '};\n' +
          '\n' +
          '// 사용: queryKey: postKeys.detail(42)\n' +
          '// 무효화: queryClient.invalidateQueries({ queryKey: postKeys.all })',
        description:
          "계층적 queryKey로 세밀한 캐시 관리가 가능하고, staleTime/gcTime으로 캐싱 동작을 제어합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| useQuery | 선언적 데이터 페칭 + 캐싱 |\n" +
        "| useMutation | 데이터 생성/수정/삭제 |\n" +
        "| queryKey | 캐시 식별 키 (변경 시 자동 refetch) |\n" +
        "| staleTime | 데이터가 신선한 기간 (기본 0) |\n" +
        "| gcTime | 비활성 캐시 유지 기간 (기본 5분) |\n" +
        "| invalidateQueries | 캐시 무효화 → 자동 refetch |\n" +
        "| QueryClient | 캐시 매니저 + 기본 설정 |\n\n" +
        "**핵심:** React Query는 서버 상태를 선언적으로 관리합니다. '이 데이터가 필요하다'고 선언하면, 캐싱, 재검증, 에러 재시도, 로딩 상태를 자동으로 처리합니다.\n\n" +
        "**다음 챕터 미리보기:** 낙관적 업데이트, 무한 스크롤, prefetch 등 React Query 심화 기능을 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "useQuery로 데이터를 페칭하고 로딩/에러 상태를 처리할 수 있다",
    "useMutation으로 데이터를 변경하고 캐시를 갱신할 수 있다",
    "queryKey를 계층적으로 설계할 수 있다",
    "staleTime과 gcTime의 차이를 설명할 수 있다",
    "QueryClient의 기본 설정을 구성할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "useQuery의 queryKey가 변경되면 어떤 일이 일어나는가?",
      choices: [
        "에러가 발생한다",
        "캐시된 데이터가 삭제된다",
        "새로운 키로 자동 refetch가 실행된다",
        "컴포넌트가 언마운트된다",
      ],
      correctIndex: 2,
      explanation:
        "queryKey가 변경되면 React Query는 새 키에 대한 캐시를 확인하고, 없으면 queryFn을 실행하여 새 데이터를 가져옵니다.",
    },
    {
      id: "q2",
      question: "staleTime: 0 (기본값)일 때 데이터의 동작은?",
      choices: [
        "데이터가 즉시 삭제된다",
        "데이터가 항상 stale로 간주되어 기회가 있을 때마다 refetch한다",
        "데이터를 영원히 캐시한다",
        "에러가 발생한다",
      ],
      correctIndex: 1,
      explanation:
        "staleTime이 0이면 데이터는 가져오자마자 stale 상태가 됩니다. 컴포넌트 마운트, 윈도우 포커스 등의 트리거에서 refetch가 실행됩니다.",
    },
    {
      id: "q3",
      question: "useMutation의 onSuccess에서 invalidateQueries를 호출하는 이유는?",
      choices: [
        "mutation 에러를 처리하기 위해",
        "관련 쿼리의 캐시를 무효화하여 최신 데이터로 갱신하기 위해",
        "TypeScript 타입 에러를 방지하기 위해",
        "mutation 결과를 캐시에 직접 저장하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "mutation 성공 후 invalidateQueries를 호출하면 관련 쿼리의 캐시가 무효화되고, 활성 쿼리는 자동으로 refetch하여 최신 데이터를 표시합니다.",
    },
    {
      id: "q4",
      question: "gcTime(구 cacheTime)의 역할은?",
      choices: [
        "쿼리 함수의 실행 시간 제한",
        "비활성 쿼리의 캐시가 메모리에서 제거되기까지의 시간",
        "stale 데이터의 유효 기간",
        "재시도 간격",
      ],
      correctIndex: 1,
      explanation:
        "gcTime은 쿼리를 구독하는 컴포넌트가 없을 때(비활성) 캐시가 메모리에 얼마나 유지되는지를 결정합니다. 기본값은 5분입니다.",
    },
    {
      id: "q5",
      question: "queryKey를 계층적으로 설계하는 가장 큰 이점은?",
      choices: [
        "네트워크 요청 속도 향상",
        "상위 키로 invalidate하면 하위 키의 쿼리도 함께 무효화",
        "TypeScript 자동완성 지원",
        "서버에서 캐시를 관리",
      ],
      correctIndex: 1,
      explanation:
        "queryKey: ['posts']로 invalidate하면 ['posts', 1], ['posts', { status: 'published' }] 등 하위 키를 가진 모든 쿼리가 무효화됩니다.",
    },
    {
      id: "q6",
      question: "React Query가 자동으로 refetch하는 기본 트리거가 아닌 것은?",
      choices: [
        "윈도우 포커스",
        "네트워크 재연결",
        "컴포넌트 마운트",
        "일정 시간 간격 (기본 비활성)",
      ],
      correctIndex: 3,
      explanation:
        "refetchInterval은 기본적으로 비활성화되어 있습니다. 명시적으로 설정해야 일정 간격으로 refetch합니다. 나머지 세 가지는 기본 활성화입니다.",
    },
  ],
};

export default chapter;
