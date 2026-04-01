import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "35-redux-toolkit-advanced",
  subject: "react",
  title: "Redux Toolkit 심화",
  description:
    "createAsyncThunk로 비동기 처리, RTK Query로 서버 상태 관리, 미들웨어 구성, createEntityAdapter로 엔티티 정규화를 학습합니다.",
  order: 35,
  group: "상태 관리",
  prerequisites: ["34-redux-toolkit-basics"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "**createAsyncThunk**는 은행의 해외 송금 서비스입니다. '송금 요청 → 처리 중 → 완료/실패' 세 단계를 자동으로 관리하고, 각 단계에서 고객에게 상태를 알려줍니다.\n\n" +
        "**RTK Query**는 은행의 모바일 뱅킹 앱입니다. 잔액 조회를 하면 캐시된 결과를 즉시 보여주고, 백그라운드에서 최신 데이터를 가져옵니다. 이체 후에는 자동으로 잔액을 갱신합니다.\n\n" +
        "**미들웨어**는 은행 보안 시스템입니다. 모든 거래(Action)가 창구(Reducer)에 도달하기 전에 검증, 로깅, 변환을 수행합니다.\n\n" +
        "**createEntityAdapter**는 도서관 관리 시스템입니다. 모든 책(엔티티)에 고유 번호(ID)를 부여하고, ID 기반의 빠른 조회와 정렬을 지원합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "기본 Redux Toolkit만으로는 실무의 복잡한 요구사항을 처리하기 어렵습니다.\n\n" +
        "1. **비동기 처리** — API 호출 시 로딩, 성공, 실패 상태를 매번 수동으로 관리해야 합니다\n" +
        "2. **서버 상태 캐싱** — API 응답을 캐싱하고 자동으로 재검증하는 로직을 직접 구현해야 합니다\n" +
        "3. **엔티티 정규화** — 배열 형태의 데이터에서 특정 아이템을 찾고 업데이트하는 코드가 반복됩니다\n" +
        "4. **크로스 커팅 관심사** — 로깅, 분석, 에러 추적 등을 각 Reducer에 중복 구현해야 합니다",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### createAsyncThunk\n" +
        "비동기 작업의 pending/fulfilled/rejected 세 가지 Action을 자동 생성합니다. extraReducers에서 각 상태에 대응하는 Reducer를 작성할 수 있습니다.\n\n" +
        "### RTK Query\n" +
        "Redux Toolkit에 내장된 데이터 페칭/캐싱 솔루션입니다. createApi로 엔드포인트를 정의하면 자동으로 Hook, 캐시 관리, 태그 기반 무효화를 제공합니다.\n\n" +
        "### 미들웨어\n" +
        "Action이 Reducer에 도달하기 전에 가로채서 추가 로직을 수행합니다. configureStore의 middleware 옵션으로 커스텀 미들웨어를 추가할 수 있습니다.\n\n" +
        "### createEntityAdapter\n" +
        "정규화된 상태 구조(ids 배열 + entities 맵)와 CRUD 메서드를 자동 생성합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: createAsyncThunk와 RTK Query",
      content:
        "비동기 데이터 처리를 위한 두 가지 접근 방식을 비교합니다.",
      code: {
        language: "typescript",
        code:
          'import {\n' +
          '  createSlice,\n' +
          '  createAsyncThunk,\n' +
          '  createEntityAdapter,\n' +
          '  type PayloadAction,\n' +
          '} from "@reduxjs/toolkit";\n' +
          'import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";\n' +
          '\n' +
          '// === 방법 1: createAsyncThunk ===\n' +
          'interface Post {\n' +
          '  id: number;\n' +
          '  title: string;\n' +
          '  body: string;\n' +
          '}\n' +
          '\n' +
          '// 비동기 Thunk 생성\n' +
          'const fetchPosts = createAsyncThunk("posts/fetchAll", async () => {\n' +
          '  const response = await fetch("/api/posts");\n' +
          '  return (await response.json()) as Post[];\n' +
          '});\n' +
          '\n' +
          '// EntityAdapter로 정규화된 상태 관리\n' +
          'const postsAdapter = createEntityAdapter<Post>();\n' +
          '\n' +
          'const postsSlice = createSlice({\n' +
          '  name: "posts",\n' +
          '  initialState: postsAdapter.getInitialState({\n' +
          '    status: "idle" as "idle" | "loading" | "succeeded" | "failed",\n' +
          '    error: null as string | null,\n' +
          '  }),\n' +
          '  reducers: {\n' +
          '    postUpdated: postsAdapter.updateOne,\n' +
          '  },\n' +
          '  extraReducers: (builder) => {\n' +
          '    builder\n' +
          '      .addCase(fetchPosts.pending, (state) => {\n' +
          '        state.status = "loading";\n' +
          '      })\n' +
          '      .addCase(fetchPosts.fulfilled, (state, action) => {\n' +
          '        state.status = "succeeded";\n' +
          '        postsAdapter.setAll(state, action.payload);\n' +
          '      })\n' +
          '      .addCase(fetchPosts.rejected, (state, action) => {\n' +
          '        state.status = "failed";\n' +
          '        state.error = action.error.message ?? "Unknown error";\n' +
          '      });\n' +
          '  },\n' +
          '});\n' +
          '\n' +
          '// === 방법 2: RTK Query (권장) ===\n' +
          'const postsApi = createApi({\n' +
          '  reducerPath: "postsApi",\n' +
          '  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),\n' +
          '  tagTypes: ["Post"],\n' +
          '  endpoints: (builder) => ({\n' +
          '    getPosts: builder.query<Post[], void>({\n' +
          '      query: () => "/posts",\n' +
          '      providesTags: ["Post"],\n' +
          '    }),\n' +
          '    addPost: builder.mutation<Post, Omit<Post, "id">>({\n' +
          '      query: (newPost) => ({\n' +
          '        url: "/posts",\n' +
          '        method: "POST",\n' +
          '        body: newPost,\n' +
          '      }),\n' +
          '      invalidatesTags: ["Post"], // 추가 후 목록 자동 갱신\n' +
          '    }),\n' +
          '  }),\n' +
          '});\n' +
          '\n' +
          '// 자동 생성된 Hook\n' +
          'const { useGetPostsQuery, useAddPostMutation } = postsApi;',
        description:
          "createAsyncThunk는 수동으로 상태를 관리하고, RTK Query는 캐싱과 재검증을 자동으로 처리합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: RTK Query로 CRUD 구현",
      content:
        "RTK Query를 사용하여 게시글 목록 조회와 추가를 구현합니다.",
      code: {
        language: "typescript",
        code:
          'import { configureStore } from "@reduxjs/toolkit";\n' +
          'import { Provider } from "react-redux";\n' +
          'import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";\n' +
          'import { useState } from "react";\n' +
          '\n' +
          'interface Post {\n' +
          '  id: number;\n' +
          '  title: string;\n' +
          '}\n' +
          '\n' +
          '// API 정의\n' +
          'const api = createApi({\n' +
          '  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),\n' +
          '  tagTypes: ["Post"],\n' +
          '  endpoints: (builder) => ({\n' +
          '    getPosts: builder.query<Post[], void>({\n' +
          '      query: () => "/posts",\n' +
          '      providesTags: (result) =>\n' +
          '        result\n' +
          '          ? [\n' +
          '              ...result.map(({ id }) => ({ type: "Post" as const, id })),\n' +
          '              { type: "Post", id: "LIST" },\n' +
          '            ]\n' +
          '          : [{ type: "Post", id: "LIST" }],\n' +
          '    }),\n' +
          '    addPost: builder.mutation<Post, { title: string }>({\n' +
          '      query: (body) => ({ url: "/posts", method: "POST", body }),\n' +
          '      invalidatesTags: [{ type: "Post", id: "LIST" }],\n' +
          '    }),\n' +
          '    deletePost: builder.mutation<void, number>({\n' +
          '      query: (id) => ({ url: `/posts/${id}`, method: "DELETE" }),\n' +
          '      invalidatesTags: (result, error, id) => [{ type: "Post", id }],\n' +
          '    }),\n' +
          '  }),\n' +
          '});\n' +
          '\n' +
          'const { useGetPostsQuery, useAddPostMutation, useDeletePostMutation } = api;\n' +
          '\n' +
          '// Store 설정\n' +
          'const store = configureStore({\n' +
          '  reducer: { [api.reducerPath]: api.reducer },\n' +
          '  middleware: (getDefault) => getDefault().concat(api.middleware),\n' +
          '});\n' +
          '\n' +
          '// 컴포넌트\n' +
          'function PostList() {\n' +
          '  const { data: posts, isLoading, error } = useGetPostsQuery();\n' +
          '  const [addPost] = useAddPostMutation();\n' +
          '  const [deletePost] = useDeletePostMutation();\n' +
          '  const [title, setTitle] = useState("");\n' +
          '\n' +
          '  if (isLoading) return <div>로딩 중...</div>;\n' +
          '  if (error) return <div>에러 발생</div>;\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <input value={title} onChange={(e) => setTitle(e.target.value)} />\n' +
          '      <button onClick={() => { addPost({ title }); setTitle(""); }}>\n' +
          '        추가\n' +
          '      </button>\n' +
          '      <ul>\n' +
          '        {posts?.map((post) => (\n' +
          '          <li key={post.id}>\n' +
          '            {post.title}\n' +
          '            <button onClick={() => deletePost(post.id)}>삭제</button>\n' +
          '          </li>\n' +
          '        ))}\n' +
          '      </ul>\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "RTK Query의 태그 기반 캐시 무효화로 mutation 후 자동으로 목록을 갱신합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 도구 | 용도 | 특징 |\n" +
        "|------|------|------|\n" +
        "| createAsyncThunk | 비동기 Action | pending/fulfilled/rejected 자동 생성 |\n" +
        "| RTK Query | 서버 상태 관리 | 캐싱, 태그 기반 무효화, 자동 Hook 생성 |\n" +
        "| 미들웨어 | 크로스 커팅 로직 | Action 가로채기, 로깅, 분석 |\n" +
        "| createEntityAdapter | 엔티티 정규화 | ids/entities 구조, CRUD 메서드 제공 |\n\n" +
        "**핵심:** 서버 상태 관리에는 RTK Query를 우선 고려하세요. createAsyncThunk는 서버 상태가 아닌 복잡한 비동기 로직에 적합합니다.\n\n" +
        "**다음 챕터 미리보기:** 더 가벼운 대안인 Zustand를 학습하여 보일러플레이트를 최소화하는 방법을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "createAsyncThunk로 비동기 작업을 처리하고 extraReducers로 상태를 관리할 수 있다",
    "RTK Query의 createApi로 엔드포인트를 정의하고 자동 생성된 Hook을 사용할 수 있다",
    "태그 기반 캐시 무효화(providesTags/invalidatesTags)를 이해한다",
    "createEntityAdapter로 정규화된 상태 구조를 생성할 수 있다",
    "커스텀 미들웨어의 작성 방법과 configureStore에 등록하는 방법을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "createAsyncThunk가 자동으로 생성하는 Action의 종류는?",
      choices: [
        "start, success, failure",
        "pending, fulfilled, rejected",
        "loading, loaded, error",
        "request, response, timeout",
      ],
      correctIndex: 1,
      explanation:
        "createAsyncThunk는 pending(시작), fulfilled(성공), rejected(실패) 세 가지 Action을 자동으로 생성합니다.",
    },
    {
      id: "q2",
      question: "RTK Query에서 mutation 후 캐시를 자동 갱신하려면 어떤 기능을 사용하는가?",
      choices: [
        "refetchOnMount",
        "providesTags와 invalidatesTags",
        "createAsyncThunk",
        "useEffect와 refetch",
      ],
      correctIndex: 1,
      explanation:
        "query에 providesTags로 태그를 지정하고, mutation에 invalidatesTags로 해당 태그를 무효화하면 관련 query가 자동으로 다시 실행됩니다.",
    },
    {
      id: "q3",
      question: "createEntityAdapter가 제공하는 상태 구조는?",
      choices: [
        "items 배열과 count",
        "ids 배열과 entities 맵",
        "data 객체와 metadata",
        "list 배열과 index 맵",
      ],
      correctIndex: 1,
      explanation:
        "createEntityAdapter는 { ids: string[], entities: Record<string, Entity> } 구조를 사용하여 O(1) 조회와 순서 보장을 동시에 제공합니다.",
    },
    {
      id: "q4",
      question: "RTK Query의 Store 설정에서 반드시 추가해야 하는 것은?",
      choices: [
        "thunk 미들웨어만",
        "api.reducer와 api.middleware 모두",
        "devTools 설정만",
        "createEntityAdapter만",
      ],
      correctIndex: 1,
      explanation:
        "RTK Query를 사용하려면 configureStore에 api.reducer를 reducer에, api.middleware를 middleware에 추가해야 합니다.",
    },
    {
      id: "q5",
      question: "다음 중 createAsyncThunk보다 RTK Query가 더 적합한 경우는?",
      choices: [
        "복잡한 다단계 비동기 워크플로우",
        "API 데이터 캐싱과 자동 재검증이 필요한 CRUD",
        "WebSocket 연결 관리",
        "로컬 파일 시스템 접근",
      ],
      correctIndex: 1,
      explanation:
        "RTK Query는 서버 데이터의 캐싱, 재검증, 자동 Hook 생성에 최적화되어 있어 CRUD API 통신에 가장 적합합니다.",
    },
  ],
};

export default chapter;
