import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "43-react-query-advanced",
  subject: "react",
  title: "React Query 심화",
  description:
    "낙관적 업데이트(onMutate), 무한 스크롤(useInfiniteQuery), prefetchQuery, 의존적 쿼리(enabled), 쿼리 무효화 전략을 학습합니다.",
  order: 43,
  group: "데이터 페칭",
  prerequisites: ["42-react-query"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "**낙관적 업데이트**는 온라인 쇼핑의 '장바구니 담기' 버튼입니다. 버튼을 누르면 서버 확인 전에 바로 장바구니에 표시됩니다. 서버에서 실패하면 '죄송합니다' 메시지와 함께 원래대로 돌립니다.\n\n" +
        "**무한 스크롤**은 뉴스 피드처럼 끝없이 이어지는 두루마리입니다. 아래로 스크롤하면 다음 섹션이 자동으로 펼쳐집니다.\n\n" +
        "**prefetch**는 미리 준비해두는 도시락입니다. 사용자가 다음 페이지로 이동할 것 같으면 미리 데이터를 가져와두어, 이동 시 즉시 표시합니다.\n\n" +
        "**의존적 쿼리**는 연쇄 작업입니다. 먼저 사용자 정보를 가져온 후, 그 사용자의 주문 내역을 가져옵니다. 첫 번째 작업이 완료되어야 두 번째를 시작합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "기본적인 useQuery/useMutation으로는 고급 UX 요구사항을 충족하기 어렵습니다.\n\n" +
        "1. **느린 UI 반응** — 서버 응답을 기다려야 UI가 업데이트되어 사용자 경험이 떨어집니다\n" +
        "2. **대량 데이터 표시** — 수천 개의 아이템을 한 번에 가져오면 성능 문제가 발생합니다\n" +
        "3. **내비게이션 지연** — 다음 페이지로 이동할 때 데이터 로딩으로 빈 화면이 표시됩니다\n" +
        "4. **순차 의존 쿼리** — A 데이터를 가져온 후에야 B 데이터를 요청할 수 있는 경우의 처리가 복잡합니다\n" +
        "5. **세밀한 캐시 제어** — 특정 조건에서만 특정 캐시를 무효화해야 합니다",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 낙관적 업데이트 (Optimistic Update)\n" +
        "onMutate에서 캐시를 즉시 업데이트하고, 실패 시 이전 캐시로 롤백합니다.\n\n" +
        "### 무한 스크롤 (useInfiniteQuery)\n" +
        "페이지 단위로 데이터를 가져오고, getNextPageParam으로 다음 페이지를 결정합니다.\n\n" +
        "### prefetchQuery\n" +
        "사용자 행동을 예측하여 미리 데이터를 캐시에 저장합니다. hover, 페이지 진입 전 등에 활용합니다.\n\n" +
        "### 의존적 쿼리 (enabled)\n" +
        "enabled 옵션으로 쿼리 실행 조건을 제어합니다. 이전 쿼리의 결과가 있을 때만 다음 쿼리를 실행합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 낙관적 업데이트",
      content:
        "서버 확인 전에 UI를 즉시 업데이트하고, 실패 시 롤백하는 패턴입니다.",
      code: {
        language: "typescript",
        code:
          'import { useMutation, useQueryClient } from "@tanstack/react-query";\n' +
          '\n' +
          'interface Todo {\n' +
          '  id: number;\n' +
          '  title: string;\n' +
          '  completed: boolean;\n' +
          '}\n' +
          '\n' +
          'function useTodoToggle() {\n' +
          '  const queryClient = useQueryClient();\n' +
          '\n' +
          '  return useMutation({\n' +
          '    mutationFn: async (todo: Todo) => {\n' +
          '      const res = await fetch(`/api/todos/${todo.id}`, {\n' +
          '        method: "PATCH",\n' +
          '        body: JSON.stringify({ completed: !todo.completed }),\n' +
          '      });\n' +
          '      return res.json() as Promise<Todo>;\n' +
          '    },\n' +
          '\n' +
          '    // 1. mutation 실행 전: 캐시를 낙관적으로 업데이트\n' +
          '    onMutate: async (newTodo) => {\n' +
          '      // 진행 중인 refetch 취소 (낙관적 업데이트를 덮어쓰지 않도록)\n' +
          '      await queryClient.cancelQueries({ queryKey: ["todos"] });\n' +
          '\n' +
          '      // 현재 캐시를 스냅샷으로 저장 (롤백용)\n' +
          '      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);\n' +
          '\n' +
          '      // 캐시를 즉시 업데이트 (서버 응답 전)\n' +
          '      queryClient.setQueryData<Todo[]>(["todos"], (old) =>\n' +
          '        old?.map((t) =>\n' +
          '          t.id === newTodo.id ? { ...t, completed: !t.completed } : t\n' +
          '        )\n' +
          '      );\n' +
          '\n' +
          '      // context에 스냅샷 반환 (onError에서 사용)\n' +
          '      return { previousTodos };\n' +
          '    },\n' +
          '\n' +
          '    // 2. 실패 시: 스냅샷으로 롤백\n' +
          '    onError: (err, newTodo, context) => {\n' +
          '      if (context?.previousTodos) {\n' +
          '        queryClient.setQueryData(["todos"], context.previousTodos);\n' +
          '      }\n' +
          '    },\n' +
          '\n' +
          '    // 3. 성공/실패 모두: 서버와 동기화\n' +
          '    onSettled: () => {\n' +
          '      queryClient.invalidateQueries({ queryKey: ["todos"] });\n' +
          '    },\n' +
          '  });\n' +
          '}',
        description:
          "onMutate에서 캐시를 즉시 업데이트하고 스냅샷을 저장합니다. 실패 시 onError에서 스냅샷으로 롤백합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 무한 스크롤과 prefetch",
      content:
        "useInfiniteQuery로 무한 스크롤을 구현하고, prefetchQuery로 다음 페이지를 미리 로드합니다.",
      code: {
        language: "typescript",
        code:
          'import {\n' +
          '  useInfiniteQuery,\n' +
          '  useQuery,\n' +
          '  useQueryClient,\n' +
          '} from "@tanstack/react-query";\n' +
          'import { useEffect } from "react";\n' +
          '\n' +
          'interface PostsResponse {\n' +
          '  posts: { id: number; title: string }[];\n' +
          '  nextCursor: number | null;\n' +
          '}\n' +
          '\n' +
          '// ✅ 무한 스크롤\n' +
          'function InfinitePostList() {\n' +
          '  const {\n' +
          '    data,\n' +
          '    fetchNextPage,\n' +
          '    hasNextPage,\n' +
          '    isFetchingNextPage,\n' +
          '  } = useInfiniteQuery({\n' +
          '    queryKey: ["posts", "infinite"],\n' +
          '    queryFn: async ({ pageParam }) => {\n' +
          '      const res = await fetch(`/api/posts?cursor=${pageParam}`);\n' +
          '      return res.json() as Promise<PostsResponse>;\n' +
          '    },\n' +
          '    initialPageParam: 0,\n' +
          '    getNextPageParam: (lastPage) => lastPage.nextCursor,\n' +
          '  });\n' +
          '\n' +
          '  // 모든 페이지의 데이터를 평탄화\n' +
          '  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      {allPosts.map((post) => (\n' +
          '        <div key={post.id}>{post.title}</div>\n' +
          '      ))}\n' +
          '      <button\n' +
          '        onClick={() => fetchNextPage()}\n' +
          '        disabled={!hasNextPage || isFetchingNextPage}\n' +
          '      >\n' +
          '        {isFetchingNextPage ? "로딩 중..." : hasNextPage ? "더 보기" : "끝"}\n' +
          '      </button>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ✅ prefetch: 다음 페이지 미리 로드\n' +
          'function PostListWithPrefetch({ page }: { page: number }) {\n' +
          '  const queryClient = useQueryClient();\n' +
          '\n' +
          '  const { data } = useQuery({\n' +
          '    queryKey: ["posts", "list", page],\n' +
          '    queryFn: () => fetchPostsByPage(page),\n' +
          '  });\n' +
          '\n' +
          '  // 현재 페이지 데이터가 로드되면 다음 페이지를 미리 가져옴\n' +
          '  useEffect(() => {\n' +
          '    queryClient.prefetchQuery({\n' +
          '      queryKey: ["posts", "list", page + 1],\n' +
          '      queryFn: () => fetchPostsByPage(page + 1),\n' +
          '    });\n' +
          '  }, [page, queryClient]);\n' +
          '\n' +
          '  return <div>{/* ... */}</div>;\n' +
          '}\n' +
          '\n' +
          '// ✅ 의존적 쿼리: enabled로 실행 조건 제어\n' +
          'function UserOrders({ userId }: { userId: string }) {\n' +
          '  const userQuery = useQuery({\n' +
          '    queryKey: ["users", userId],\n' +
          '    queryFn: () => fetchUser(userId),\n' +
          '  });\n' +
          '\n' +
          '  const ordersQuery = useQuery({\n' +
          '    queryKey: ["orders", { userId }],\n' +
          '    queryFn: () => fetchOrders(userId),\n' +
          '    // user 데이터가 있을 때만 주문 조회 실행\n' +
          '    enabled: !!userQuery.data,\n' +
          '  });\n' +
          '\n' +
          '  return <div>{/* ... */}</div>;\n' +
          '}',
        description:
          "useInfiniteQuery로 커서 기반 무한 스크롤, prefetchQuery로 미리 로드, enabled로 의존적 쿼리를 구현합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 기능 | 용도 | 핵심 API |\n" +
        "|------|------|----------|\n" +
        "| 낙관적 업데이트 | 즉각적인 UI 반응 | onMutate + setQueryData |\n" +
        "| 무한 스크롤 | 대량 데이터 점진적 로딩 | useInfiniteQuery |\n" +
        "| prefetch | 내비게이션 지연 제거 | queryClient.prefetchQuery |\n" +
        "| 의존적 쿼리 | 순차 데이터 의존성 | enabled 옵션 |\n" +
        "| 세밀한 무효화 | 특정 캐시만 갱신 | queryKey 계층 + invalidateQueries |\n\n" +
        "**핵심:** 낙관적 업데이트는 'UI 먼저, 서버 확인 나중' 전략으로 체감 속도를 크게 향상시킵니다. 무한 스크롤과 prefetch로 대량 데이터를 효율적으로 처리하세요.\n\n" +
        "**다음 챕터 미리보기:** React 19의 useOptimistic Hook으로 더 간단한 낙관적 UI 패턴을 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "onMutate/onError/onSettled을 활용한 낙관적 업데이트 패턴을 구현할 수 있다",
    "useInfiniteQuery로 무한 스크롤을 구현할 수 있다",
    "prefetchQuery로 데이터를 미리 캐시에 저장할 수 있다",
    "enabled 옵션으로 의존적 쿼리를 제어할 수 있다",
    "queryKey 계층을 활용한 세밀한 캐시 무효화 전략을 설계할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "낙관적 업데이트에서 onMutate의 역할은?",
      choices: [
        "서버에 요청을 보내는 함수",
        "서버 응답 전에 캐시를 즉시 업데이트하고 롤백용 스냅샷을 저장",
        "에러 발생 시 호출되는 콜백",
        "mutation 완료 후 정리 작업",
      ],
      correctIndex: 1,
      explanation:
        "onMutate는 mutationFn 실행 전에 호출됩니다. 캐시를 낙관적으로 업데이트하고, 실패 시 복원할 스냅샷을 context로 반환합니다.",
    },
    {
      id: "q2",
      question: "onMutate에서 cancelQueries를 호출하는 이유는?",
      choices: [
        "mutation을 취소하기 위해",
        "모든 쿼리를 중단하기 위해",
        "진행 중인 refetch가 낙관적 업데이트를 덮어쓰는 것을 방지하기 위해",
        "네트워크 요청을 최소화하기 위해",
      ],
      correctIndex: 2,
      explanation:
        "낙관적으로 업데이트한 캐시가 진행 중인 refetch의 응답으로 덮어써지면 UI가 깜빡입니다. cancelQueries로 이를 방지합니다.",
    },
    {
      id: "q3",
      question: "useInfiniteQuery의 getNextPageParam이 null을 반환하면?",
      choices: [
        "에러가 발생한다",
        "첫 페이지를 다시 가져온다",
        "hasNextPage가 false가 되어 더 이상 데이터를 가져오지 않는다",
        "모든 캐시가 초기화된다",
      ],
      correctIndex: 2,
      explanation:
        "getNextPageParam이 undefined 또는 null을 반환하면 hasNextPage가 false가 되어 추가 페이지 요청이 불가능합니다.",
    },
    {
      id: "q4",
      question: "prefetchQuery와 useQuery의 차이점은?",
      choices: [
        "prefetchQuery는 캐시를 사용하지 않는다",
        "prefetchQuery는 데이터를 캐시에 저장하지만 컴포넌트를 구독하지 않는다",
        "prefetchQuery는 서버 컴포넌트에서만 사용 가능하다",
        "prefetchQuery는 에러를 자동으로 재시도하지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "prefetchQuery는 데이터를 미리 캐시에 저장하지만, useQuery처럼 컴포넌트를 리렌더링하거나 데이터를 반환하지 않습니다.",
    },
    {
      id: "q5",
      question: "enabled: false로 설정한 쿼리의 동작은?",
      choices: [
        "쿼리가 삭제된다",
        "쿼리가 자동으로 실행되지 않고 refetch()로만 실행 가능하다",
        "캐시가 비활성화된다",
        "에러가 발생한다",
      ],
      correctIndex: 1,
      explanation:
        "enabled: false인 쿼리는 자동 실행되지 않습니다. 조건이 충족되어 enabled가 true로 변경되거나, 수동으로 refetch()를 호출해야 실행됩니다.",
    },
    {
      id: "q6",
      question: "낙관적 업데이트 실패 시 올바른 롤백 순서는?",
      choices: [
        "onError에서 캐시 초기화 → refetch",
        "onError에서 스냅샷 복원 → onSettled에서 invalidateQueries",
        "onSettled에서 스냅샷 복원",
        "자동으로 롤백됨",
      ],
      correctIndex: 1,
      explanation:
        "onError에서 context의 스냅샷으로 캐시를 복원하고, onSettled에서 invalidateQueries를 호출하여 서버와 동기화합니다.",
    },
  ],
};

export default chapter;
