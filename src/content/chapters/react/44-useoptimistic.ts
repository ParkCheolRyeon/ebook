import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "44-useoptimistic",
  subject: "react",
  title: "useOptimistic (React 19)",
  description:
    "React 19의 useOptimistic Hook으로 낙관적 UI 패턴을 구현하고, Actions와 연동, 서버 확인 전 즉시 반영, 롤백 전략, useActionState와의 조합을 학습합니다.",
  order: 44,
  group: "데이터 페칭",
  prerequisites: ["43-react-query-advanced"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "**useOptimistic**은 식당의 선주문 시스템입니다.\n\n" +
        "기존 방식: 메뉴를 주문하고, 주방에서 확인이 올 때까지 기다린 후, 주문 목록에 표시됩니다. ('서버 확인 후 업데이트')\n\n" +
        "useOptimistic 방식: 주문 버튼을 누르면 즉시 주문 목록에 '조리 중'으로 표시됩니다. 주방에서 확인되면 '조리 중' 태그가 사라지고, 거절되면 목록에서 제거됩니다.\n\n" +
        "React Query의 낙관적 업데이트가 '캐시 레벨'에서 작동한다면, useOptimistic은 '컴포넌트 레벨'에서 작동합니다. 더 가볍고, React 내장이며, 서버 액션과 자연스럽게 통합됩니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "기존 낙관적 업데이트 구현의 어려움:\n\n" +
        "1. **복잡한 캐시 관리** — React Query의 onMutate/onError/onSettled 패턴은 강력하지만 코드가 복잡합니다\n" +
        "2. **외부 라이브러리 의존** — 간단한 낙관적 UI에도 React Query나 별도의 상태 관리가 필요했습니다\n" +
        "3. **롤백 로직 분산** — 스냅샷 저장, 캐시 업데이트, 에러 시 복원 로직이 여러 콜백에 분산됩니다\n" +
        "4. **서버 액션과의 통합** — React 19의 Server Actions/form actions와 함께 사용할 때 별도의 연결 코드가 필요합니다",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### useOptimistic\n" +
        "React 19에서 도입된 내장 Hook으로, 비동기 작업 중 임시 상태를 표시합니다.\n\n" +
        "```\nconst [optimisticState, addOptimistic] = useOptimistic(state, updateFn);\n```\n\n" +
        "- **state**: 실제 상태 (서버에서 확인된 상태)\n" +
        "- **updateFn**: (currentState, optimisticValue) => newState\n" +
        "- **optimisticState**: 실제 상태 + 낙관적 업데이트가 반영된 상태\n" +
        "- **addOptimistic**: 낙관적 값을 추가하는 함수\n\n" +
        "### 자동 롤백\n" +
        "비동기 작업(Action)이 완료되면 optimisticState는 자동으로 실제 state로 되돌아갑니다. 성공하면 새 state가 반영되고, 실패하면 이전 state로 돌아갑니다.\n\n" +
        "### useActionState와 조합\n" +
        "useActionState로 폼 액션의 상태를 관리하고, useOptimistic으로 즉각적인 UI 피드백을 제공합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: useOptimistic 기본 패턴",
      content:
        "useOptimistic을 사용하여 메시지 전송의 낙관적 UI를 구현합니다.",
      code: {
        language: "typescript",
        code:
          'import { useOptimistic, useActionState } from "react";\n' +
          '\n' +
          'interface Message {\n' +
          '  id: number;\n' +
          '  text: string;\n' +
          '  sending?: boolean; // 낙관적 상태 표시용\n' +
          '}\n' +
          '\n' +
          '// 서버 액션 (또는 비동기 함수)\n' +
          'async function sendMessageAction(\n' +
          '  prevState: { messages: Message[] },\n' +
          '  formData: FormData\n' +
          '): Promise<{ messages: Message[] }> {\n' +
          '  const text = formData.get("message") as string;\n' +
          '\n' +
          '  // 서버에 메시지 전송\n' +
          '  const response = await fetch("/api/messages", {\n' +
          '    method: "POST",\n' +
          '    body: JSON.stringify({ text }),\n' +
          '  });\n' +
          '  const newMessage = await response.json();\n' +
          '\n' +
          '  return {\n' +
          '    messages: [...prevState.messages, newMessage],\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          'function ChatRoom({ initialMessages }: { initialMessages: Message[] }) {\n' +
          '  // useActionState: 폼 액션의 상태 관리\n' +
          '  const [state, formAction, isPending] = useActionState(\n' +
          '    sendMessageAction,\n' +
          '    { messages: initialMessages }\n' +
          '  );\n' +
          '\n' +
          '  // useOptimistic: 서버 확인 전 즉시 UI 반영\n' +
          '  const [optimisticMessages, addOptimisticMessage] = useOptimistic(\n' +
          '    state.messages,\n' +
          '    // updateFn: 현재 상태 + 낙관적 값 → 새 상태\n' +
          '    (currentMessages: Message[], newMessage: string) => [\n' +
          '      ...currentMessages,\n' +
          '      {\n' +
          '        id: Date.now(), // 임시 ID\n' +
          '        text: newMessage,\n' +
          '        sending: true, // 전송 중 표시\n' +
          '      },\n' +
          '    ]\n' +
          '  );\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      {/* 낙관적 상태로 렌더링 */}\n' +
          '      {optimisticMessages.map((msg) => (\n' +
          '        <div key={msg.id}>\n' +
          '          {msg.text}\n' +
          '          {msg.sending && <span> (전송 중...)</span>}\n' +
          '        </div>\n' +
          '      ))}\n' +
          '\n' +
          '      <form\n' +
          '        action={async (formData) => {\n' +
          '          // 1. 낙관적으로 즉시 UI에 추가\n' +
          '          addOptimisticMessage(formData.get("message") as string);\n' +
          '          // 2. 서버 액션 실행 (완료 시 자동 롤백/확정)\n' +
          '          await formAction(formData);\n' +
          '        }}\n' +
          '      >\n' +
          '        <input name="message" />\n' +
          '        <button type="submit" disabled={isPending}>\n' +
          '          전송\n' +
          '        </button>\n' +
          '      </form>\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "addOptimisticMessage로 즉시 UI에 표시하고, formAction이 완료되면 실제 상태로 자동 전환됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 좋아요 토글과 롤백",
      content:
        "좋아요 버튼의 낙관적 업데이트와 실패 시 롤백을 구현합니다.",
      code: {
        language: "typescript",
        code:
          'import { useOptimistic, useTransition } from "react";\n' +
          '\n' +
          'interface Post {\n' +
          '  id: number;\n' +
          '  title: string;\n' +
          '  liked: boolean;\n' +
          '  likeCount: number;\n' +
          '}\n' +
          '\n' +
          '// 서버 API 호출\n' +
          'async function toggleLikeOnServer(postId: number): Promise<Post> {\n' +
          '  const res = await fetch(`/api/posts/${postId}/like`, {\n' +
          '    method: "POST",\n' +
          '  });\n' +
          '  if (!res.ok) throw new Error("좋아요 처리 실패");\n' +
          '  return res.json();\n' +
          '}\n' +
          '\n' +
          'function LikeButton({ post, onUpdate }: {\n' +
          '  post: Post;\n' +
          '  onUpdate: (updatedPost: Post) => void;\n' +
          '}) {\n' +
          '  const [isPending, startTransition] = useTransition();\n' +
          '\n' +
          '  // 낙관적 상태: post의 liked와 likeCount를 즉시 토글\n' +
          '  const [optimisticPost, toggleOptimistic] = useOptimistic(\n' +
          '    post,\n' +
          '    (currentPost: Post) => ({\n' +
          '      ...currentPost,\n' +
          '      liked: !currentPost.liked,\n' +
          '      likeCount: currentPost.liked\n' +
          '        ? currentPost.likeCount - 1\n' +
          '        : currentPost.likeCount + 1,\n' +
          '    })\n' +
          '  );\n' +
          '\n' +
          '  function handleClick() {\n' +
          '    startTransition(async () => {\n' +
          '      // 즉시 UI 반영\n' +
          '      toggleOptimistic(null);\n' +
          '\n' +
          '      try {\n' +
          '        // 서버 확인\n' +
          '        const updatedPost = await toggleLikeOnServer(post.id);\n' +
          '        onUpdate(updatedPost);\n' +
          '      } catch (error) {\n' +
          '        // 실패 시: transition이 끝나면 자동으로\n' +
          '        // optimisticPost가 원래 post 값으로 되돌아감\n' +
          '        console.error("좋아요 처리 실패:", error);\n' +
          '      }\n' +
          '    });\n' +
          '  }\n' +
          '\n' +
          '  return (\n' +
          '    <button onClick={handleClick} disabled={isPending}>\n' +
          '      {optimisticPost.liked ? "❤️" : "🤍"}\n' +
          '      {optimisticPost.likeCount}\n' +
          '    </button>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// ✅ React Query + useOptimistic 조합\n' +
          '// React Query는 서버 상태 캐싱, useOptimistic은 컴포넌트 레벨 즉시 피드백\n' +
          'function PostCard({ postId }: { postId: number }) {\n' +
          '  const { data: post } = useQuery({\n' +
          '    queryKey: ["posts", postId],\n' +
          '    queryFn: () => fetchPost(postId),\n' +
          '  });\n' +
          '  const queryClient = useQueryClient();\n' +
          '\n' +
          '  if (!post) return null;\n' +
          '\n' +
          '  return (\n' +
          '    <LikeButton\n' +
          '      post={post}\n' +
          '      onUpdate={(updated) => {\n' +
          '        queryClient.setQueryData(["posts", postId], updated);\n' +
          '      }}\n' +
          '    />\n' +
          '  );\n' +
          '}',
        description:
          "useTransition과 useOptimistic을 조합하여 좋아요 토글을 즉시 반영하고, 실패 시 자동 롤백됩니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 비교 | React Query onMutate | useOptimistic (React 19) |\n" +
        "|------|---------------------|------------------------|\n" +
        "| 작동 레벨 | 캐시 레벨 | 컴포넌트 레벨 |\n" +
        "| 롤백 | 수동 (onError) | 자동 (Action 완료 시) |\n" +
        "| 외부 의존성 | React Query 필요 | 내장 Hook |\n" +
        "| 복잡도 | 높음 (3개 콜백) | 낮음 (1개 함수) |\n" +
        "| 적합한 경우 | 복잡한 캐시 전략 | 간단한 낙관적 UI |\n\n" +
        "**핵심:** useOptimistic은 React 19의 핵심 Hook으로, 비동기 작업 중 임시 상태를 간단하게 관리합니다. useTransition이나 form action과 조합하여 사용하며, 작업이 완료되면 자동으로 실제 상태로 전환됩니다.\n\n" +
        "**다음 챕터 미리보기:** SWR과 React Query를 비교하고, 프로젝트별 선택 기준을 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "useOptimistic의 동작 원리와 자동 롤백 메커니즘을 설명할 수 있다",
    "useOptimistic과 form action을 조합하여 낙관적 UI를 구현할 수 있다",
    "useTransition과 useOptimistic을 함께 사용할 수 있다",
    "React Query의 onMutate 패턴과 useOptimistic의 차이를 설명할 수 있다",
    "useActionState와 useOptimistic을 조합하여 폼 상태를 관리할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "useOptimistic의 두 번째 인자(updateFn)의 역할은?",
      choices: [
        "서버에 데이터를 전송하는 함수",
        "현재 상태와 낙관적 값을 받아 새로운 낙관적 상태를 반환하는 함수",
        "에러 발생 시 롤백을 처리하는 함수",
        "상태를 영구적으로 업데이트하는 함수",
      ],
      correctIndex: 1,
      explanation:
        "updateFn은 (currentState, optimisticValue) => newState 형태로, 현재 상태에 낙관적 값을 적용한 새 상태를 반환합니다.",
    },
    {
      id: "q2",
      question: "useOptimistic의 낙관적 상태가 자동으로 원래 상태로 돌아가는 시점은?",
      choices: [
        "컴포넌트가 리렌더링될 때",
        "setTimeout이 만료될 때",
        "감싸고 있는 비동기 Action(transition)이 완료될 때",
        "명시적으로 reset 함수를 호출할 때",
      ],
      correctIndex: 2,
      explanation:
        "useOptimistic의 낙관적 상태는 감싸고 있는 transition이나 form action이 완료되면 자동으로 실제 state 값으로 되돌아갑니다.",
    },
    {
      id: "q3",
      question: "useOptimistic을 사용할 때 반드시 함께 사용해야 하는 것은?",
      choices: [
        "useState",
        "useEffect",
        "비동기 transition(useTransition 또는 form action)",
        "useRef",
      ],
      correctIndex: 2,
      explanation:
        "useOptimistic의 자동 롤백은 transition이 완료되는 시점에 동작하므로, useTransition의 startTransition이나 form action 내에서 사용해야 합니다.",
    },
    {
      id: "q4",
      question:
        "React Query의 낙관적 업데이트와 useOptimistic의 가장 큰 차이점은?",
      choices: [
        "useOptimistic이 더 빠르다",
        "React Query는 캐시 레벨, useOptimistic은 컴포넌트 레벨에서 작동한다",
        "useOptimistic은 에러 처리가 불가능하다",
        "React Query는 낙관적 업데이트를 지원하지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "React Query는 전역 캐시를 직접 수정하여 낙관적 업데이트를 구현하고, useOptimistic은 개별 컴포넌트의 렌더링 상태에서 낙관적 값을 관리합니다.",
    },
    {
      id: "q5",
      question: "useOptimistic에서 서버 요청이 실패했을 때의 동작은?",
      choices: [
        "에러를 throw한다",
        "낙관적 상태가 그대로 유지된다",
        "transition이 끝나면 자동으로 원래 상태로 복원된다",
        "수동으로 rollback 함수를 호출해야 한다",
      ],
      correctIndex: 2,
      explanation:
        "서버 요청이 실패해도 transition이 완료되면 optimisticState는 원래의 state 값으로 자동 복원됩니다. 별도의 롤백 코드가 필요 없습니다.",
    },
    {
      id: "q6",
      question: "useActionState와 useOptimistic을 함께 사용하는 이유는?",
      choices: [
        "useActionState는 서버 컴포넌트에서만 사용 가능해서",
        "useActionState로 폼 액션 상태를 관리하고, useOptimistic으로 즉각적 UI 피드백 제공",
        "두 Hook을 함께 써야만 에러 처리가 가능해서",
        "성능 최적화를 위해",
      ],
      correctIndex: 1,
      explanation:
        "useActionState는 폼 액션의 결과와 pending 상태를 관리하고, useOptimistic은 서버 응답 전에 즉각적인 UI 피드백을 제공합니다.",
    },
  ],
};

export default chapter;
