import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "12-graphql",
  subject: "network",
  title: "GraphQL",
  description:
    "GraphQL의 핵심 개념과 REST와의 차이를 이해하고, Query/Mutation/Subscription, 스키마 설계, Apollo Client 활용법, 코드 생성 도구를 학습합니다.",
  order: 12,
  group: "실시간 통신",
  prerequisites: ["09-rest-api"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "REST와 GraphQL의 차이를 **레스토랑 주문**에 비유해봅시다.\n\n" +
        "**REST = 세트 메뉴 식당**\n" +
        "메뉴판에 정해진 세트(엔드포인트)만 있습니다. " +
        "'A세트'를 주문하면 밥, 국, 반찬 3개가 한꺼번에 나옵니다. " +
        "국이 필요 없어도 함께 오고(Over-fetching), " +
        "디저트가 먹고 싶으면 '디저트 세트'를 따로 주문해야 합니다(Under-fetching). " +
        "여러 세트를 주문하면 여러 번 웨이터를 불러야 합니다(다중 요청).\n\n" +
        "**GraphQL = 뷔페 + 주문서**\n" +
        "주문서(Query)에 원하는 음식만 정확히 적습니다: " +
        "'스테이크(미디엄), 감자튀김, 콜라'. " +
        "필요한 것만 정확히 받을 수 있고, 한 장의 주문서로 모든 것을 요청합니다. " +
        "주방(서버)은 주문서에 적힌 것만 정확히 준비합니다.\n\n" +
        "**Schema = 메뉴판**\n" +
        "어떤 음식을 주문할 수 있는지, 각 음식에 어떤 옵션이 있는지 " +
        "전체 목록을 보여줍니다. 주문서 작성 전에 메뉴판을 보고 계획할 수 있습니다.\n\n" +
        "**Subscription = 주기적 배달 서비스**\n" +
        "'새 메뉴가 나오면 알려주세요'라고 구독하면, " +
        "새 메뉴가 추가될 때마다 자동으로 알림을 받습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "REST API를 사용하는 프론트엔드에서 다음 문제에 직면합니다:\n\n" +
        "### Over-fetching (과다 조회)\n" +
        "사용자 이름만 필요한데 `/users/123`을 호출하면 이메일, 주소, 가입일, 프로필 사진 등 " +
        "모든 필드가 응답에 포함됩니다. 모바일 환경에서 불필요한 데이터 전송은 성능 저하의 원인입니다.\n\n" +
        "### Under-fetching (과소 조회)\n" +
        "게시물 목록 페이지에서 작성자 이름도 보여주려면:\n" +
        "1. `/posts` → 게시물 목록 조회\n" +
        "2. 각 게시물의 authorId로 `/users/:id` → 작성자 정보 조회 (N+1 문제)\n" +
        "여러 엔드포인트를 호출해야 하나의 화면을 구성할 수 있습니다.\n\n" +
        "### API 변경의 어려움\n" +
        "- 새 필드를 추가하면 모든 클라이언트가 불필요한 데이터를 받게 됩니다.\n" +
        "- 필드를 제거하면 기존 클라이언트가 깨질 수 있습니다.\n" +
        "- 다양한 클라이언트(웹, 모바일, 태블릿)가 각각 다른 데이터를 필요로 합니다.\n\n" +
        "### 타입 안전성 부족\n" +
        "REST API의 응답 형식은 문서에만 의존하므로, " +
        "프론트엔드에서 타입을 수동으로 정의해야 하고 " +
        "API 변경 시 프론트엔드의 타입도 수동으로 업데이트해야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### GraphQL 핵심 개념\n\n" +
        "**1. Query (조회)**\n" +
        "필요한 필드만 명시적으로 요청합니다:\n" +
        "```graphql\n" +
        "query {\n" +
        "  user(id: \"123\") {\n" +
        "    name\n" +
        "    posts {\n" +
        "      title\n" +
        "      createdAt\n" +
        "    }\n" +
        "  }\n" +
        "}\n" +
        "```\n" +
        "한 번의 요청으로 사용자와 게시물을 모두 가져올 수 있습니다.\n\n" +
        "**2. Mutation (변경)**\n" +
        "데이터를 생성, 수정, 삭제합니다:\n" +
        "```graphql\n" +
        "mutation {\n" +
        "  createPost(input: { title: \"새 글\", content: \"내용\" }) {\n" +
        "    id\n" +
        "    title\n" +
        "  }\n" +
        "}\n" +
        "```\n\n" +
        "**3. Subscription (구독)**\n" +
        "실시간 데이터 업데이트를 수신합니다 (WebSocket 기반):\n" +
        "```graphql\n" +
        "subscription {\n" +
        "  newMessage(roomId: \"abc\") {\n" +
        "    content\n" +
        "    sender { name }\n" +
        "  }\n" +
        "}\n" +
        "```\n\n" +
        "**4. Schema와 Type System**\n" +
        "서버가 제공하는 모든 데이터의 형태를 스키마로 정의합니다:\n" +
        "```graphql\n" +
        "type User {\n" +
        "  id: ID!\n" +
        "  name: String!\n" +
        "  email: String\n" +
        "  posts: [Post!]!\n" +
        "}\n" +
        "```\n" +
        "이 스키마를 기반으로 프론트엔드 타입을 자동 생성할 수 있습니다.\n\n" +
        "### GraphQL vs REST 선택 기준\n\n" +
        "**GraphQL이 적합한 경우:**\n" +
        "- 다양한 클라이언트(웹, 모바일)가 서로 다른 데이터를 필요로 할 때\n" +
        "- 복잡한 데이터 관계를 한 번의 요청으로 조회해야 할 때\n" +
        "- 프론트엔드 주도 개발이 필요할 때\n\n" +
        "**REST가 적합한 경우:**\n" +
        "- 간단한 CRUD 작업\n" +
        "- 파일 업로드/다운로드\n" +
        "- HTTP 캐싱을 적극 활용해야 할 때\n" +
        "- 팀에 GraphQL 경험이 부족할 때",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Apollo Client 설정과 활용",
      content:
        "프론트엔드에서 Apollo Client를 설정하고, 타입 안전한 GraphQL 호출 패턴을 구현합니다.",
      code: {
        language: "typescript",
        code:
          "// Apollo Client 설정과 타입 안전한 GraphQL 호출\n" +
          "\n" +
          "import {\n" +
          "  ApolloClient,\n" +
          "  InMemoryCache,\n" +
          "  createHttpLink,\n" +
          "  split,\n" +
          "} from \"@apollo/client\";\n" +
          "import { setContext } from \"@apollo/client/link/context\";\n" +
          "import { GraphQLWsLink } from \"@apollo/client/link/subscriptions\";\n" +
          "import { getMainDefinition } from \"@apollo/client/utilities\";\n" +
          "import { createClient } from \"graphql-ws\";\n" +
          "\n" +
          "// HTTP 링크 생성\n" +
          "const httpLink = createHttpLink({\n" +
          "  uri: \"https://api.example.com/graphql\",\n" +
          "});\n" +
          "\n" +
          "// 인증 헤더 추가\n" +
          "const authLink = setContext((_, { headers }) => {\n" +
          "  const token = localStorage.getItem(\"accessToken\");\n" +
          "  return {\n" +
          "    headers: {\n" +
          "      ...headers,\n" +
          "      authorization: token\n" +
          "        ? \"Bearer \" + token\n" +
          "        : \"\",\n" +
          "    },\n" +
          "  };\n" +
          "});\n" +
          "\n" +
          "// WebSocket 링크 (Subscription용)\n" +
          "const wsLink = new GraphQLWsLink(\n" +
          "  createClient({\n" +
          "    url: \"wss://api.example.com/graphql\",\n" +
          "    connectionParams: () => ({\n" +
          "      authorization:\n" +
          "        \"Bearer \" +\n" +
          "        localStorage.getItem(\"accessToken\"),\n" +
          "    }),\n" +
          "  })\n" +
          ");\n" +
          "\n" +
          "// Query/Mutation은 HTTP, Subscription은 WebSocket\n" +
          "const splitLink = split(\n" +
          "  ({ query }) => {\n" +
          "    const definition = getMainDefinition(query);\n" +
          "    return (\n" +
          "      definition.kind === \"OperationDefinition\" &&\n" +
          "      definition.operation === \"subscription\"\n" +
          "    );\n" +
          "  },\n" +
          "  wsLink,\n" +
          "  authLink.concat(httpLink)\n" +
          ");\n" +
          "\n" +
          "// Apollo Client 인스턴스\n" +
          "const client = new ApolloClient({\n" +
          "  link: splitLink,\n" +
          "  cache: new InMemoryCache({\n" +
          "    typePolicies: {\n" +
          "      Query: {\n" +
          "        fields: {\n" +
          "          // 페이지네이션 캐시 정책\n" +
          "          posts: {\n" +
          "            keyArgs: [\"filter\"],\n" +
          "            merge(existing = [], incoming) {\n" +
          "              return [...existing, ...incoming];\n" +
          "            },\n" +
          "          },\n" +
          "        },\n" +
          "      },\n" +
          "    },\n" +
          "  }),\n" +
          "  defaultOptions: {\n" +
          "    watchQuery: {\n" +
          "      fetchPolicy: \"cache-and-network\",\n" +
          "    },\n" +
          "  },\n" +
          "});\n" +
          "\n" +
          "export default client;",
        description:
          "Apollo Client를 HTTP + WebSocket 링크로 구성하고, 인증 헤더, 캐시 정책, Subscription을 설정하는 패턴입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: GraphQL 쿼리와 코드 생성",
      content:
        "graphql-codegen을 활용하여 타입을 자동 생성하고, 타입 안전한 훅을 사용하는 패턴을 구현합니다.",
      code: {
        language: "typescript",
        code:
          "// GraphQL 쿼리 정의와 타입 안전한 사용\n" +
          "\n" +
          "// 1. GraphQL 쿼리 문서 (.graphql 또는 gql 태그)\n" +
          "import { gql } from \"@apollo/client\";\n" +
          "\n" +
          "// Query: 사용자 목록 조회\n" +
          "const GET_USERS = gql`\n" +
          "  query GetUsers($page: Int!, $limit: Int!) {\n" +
          "    users(page: $page, limit: $limit) {\n" +
          "      edges {\n" +
          "        node {\n" +
          "          id\n" +
          "          name\n" +
          "          email\n" +
          "          posts {\n" +
          "            id\n" +
          "            title\n" +
          "          }\n" +
          "        }\n" +
          "      }\n" +
          "      pageInfo {\n" +
          "        hasNextPage\n" +
          "        endCursor\n" +
          "      }\n" +
          "    }\n" +
          "  }\n" +
          "`;\n" +
          "\n" +
          "// Mutation: 게시물 생성\n" +
          "const CREATE_POST = gql`\n" +
          "  mutation CreatePost($input: CreatePostInput!) {\n" +
          "    createPost(input: $input) {\n" +
          "      id\n" +
          "      title\n" +
          "      content\n" +
          "      createdAt\n" +
          "    }\n" +
          "  }\n" +
          "`;\n" +
          "\n" +
          "// Subscription: 새 메시지 수신\n" +
          "const NEW_MESSAGE = gql`\n" +
          "  subscription OnNewMessage($roomId: ID!) {\n" +
          "    newMessage(roomId: $roomId) {\n" +
          "      id\n" +
          "      content\n" +
          "      sender {\n" +
          "        id\n" +
          "        name\n" +
          "      }\n" +
          "      createdAt\n" +
          "    }\n" +
          "  }\n" +
          "`;\n" +
          "\n" +
          "// 2. graphql-codegen으로 자동 생성된 타입 (예시)\n" +
          "// codegen.ts 설정 후 실행하면 자동 생성됨\n" +
          "interface User {\n" +
          "  id: string;\n" +
          "  name: string;\n" +
          "  email: string;\n" +
          "  posts: Array<{ id: string; title: string }>;\n" +
          "}\n" +
          "\n" +
          "interface GetUsersQuery {\n" +
          "  users: {\n" +
          "    edges: Array<{ node: User }>;\n" +
          "    pageInfo: {\n" +
          "      hasNextPage: boolean;\n" +
          "      endCursor: string;\n" +
          "    };\n" +
          "  };\n" +
          "}\n" +
          "\n" +
          "interface GetUsersVariables {\n" +
          "  page: number;\n" +
          "  limit: number;\n" +
          "}\n" +
          "\n" +
          "// 3. React 컴포넌트에서 사용 (타입 안전)\n" +
          "import { useQuery, useMutation } from \"@apollo/client\";\n" +
          "\n" +
          "function UserList(): JSX.Element | null {\n" +
          "  const { data, loading, error, fetchMore } =\n" +
          "    useQuery<GetUsersQuery, GetUsersVariables>(\n" +
          "      GET_USERS,\n" +
          "      { variables: { page: 1, limit: 10 } }\n" +
          "    );\n" +
          "\n" +
          "  if (loading) return null;\n" +
          "  if (error) {\n" +
          "    console.error(\"쿼리 오류: \" + error.message);\n" +
          "    return null;\n" +
          "  }\n" +
          "\n" +
          "  const users = data?.users.edges.map((e) => e.node);\n" +
          "\n" +
          "  // 다음 페이지 로드\n" +
          "  const loadMore = () => {\n" +
          "    if (data?.users.pageInfo.hasNextPage) {\n" +
          "      fetchMore({\n" +
          "        variables: { page: 2, limit: 10 },\n" +
          "      });\n" +
          "    }\n" +
          "  };\n" +
          "\n" +
          "  console.log(\n" +
          "    \"사용자 수: \" + (users?.length ?? 0)\n" +
          "  );\n" +
          "  console.log(\n" +
          "    \"다음 페이지: \" +\n" +
          "    data?.users.pageInfo.hasNextPage\n" +
          "  );\n" +
          "\n" +
          "  return null;\n" +
          "}\n" +
          "\n" +
          "// 4. graphql-codegen 설정 (codegen.ts)\n" +
          "// import type { CodegenConfig } from\n" +
          "//   \"@graphql-codegen/cli\";\n" +
          "//\n" +
          "// const config: CodegenConfig = {\n" +
          "//   schema: \"https://api.example.com/graphql\",\n" +
          "//   documents: [\"src/**/*.graphql\", \"src/**/*.tsx\"],\n" +
          "//   generates: {\n" +
          "//     \"./src/generated/graphql.ts\": {\n" +
          "//       plugins: [\n" +
          "//         \"typescript\",\n" +
          "//         \"typescript-operations\",\n" +
          "//         \"typescript-react-apollo\",\n" +
          "//       ],\n" +
          "//     },\n" +
          "//   },\n" +
          "// };",
        description:
          "GraphQL의 Query, Mutation, Subscription 정의와 graphql-codegen을 통한 타입 자동 생성 및 Apollo Client 훅 사용 패턴입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### GraphQL 핵심 개념\n" +
        "- **Query**: 필요한 필드만 명시하여 데이터를 조회\n" +
        "- **Mutation**: 데이터 생성, 수정, 삭제\n" +
        "- **Subscription**: WebSocket 기반 실시간 데이터 수신\n" +
        "- **Schema/Type System**: 전체 API의 구조를 타입으로 정의\n\n" +
        "### REST 대비 장점\n" +
        "- Over-fetching 해결: 필요한 필드만 요청\n" +
        "- Under-fetching 해결: 한 번의 요청으로 관련 데이터를 모두 조회\n" +
        "- 스키마 기반으로 프론트엔드 타입을 자동 생성 가능\n\n" +
        "### Apollo Client\n" +
        "- HTTP + WebSocket 링크로 Query/Mutation과 Subscription 분리\n" +
        "- InMemoryCache로 정규화된 캐시 관리\n" +
        "- useQuery, useMutation, useSubscription 훅으로 React 통합\n\n" +
        "### graphql-codegen\n" +
        "- GraphQL 스키마에서 TypeScript 타입을 자동 생성\n" +
        "- 쿼리별 타입, 변수 타입, React 훅까지 자동 생성 가능\n" +
        "- API 스키마 변경 시 타입이 자동 업데이트되어 안전성 확보\n\n" +
        "### 선택 기준\n" +
        "- 복잡한 데이터 관계 + 다양한 클라이언트 → GraphQL\n" +
        "- 단순 CRUD + 파일 처리 + HTTP 캐싱 활용 → REST",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "GraphQL은 클라이언트가 필요한 데이터를 정확히 요청할 수 있게 하여 Over-fetching과 Under-fetching을 해결하며, 스키마 기반 타입 안전성을 제공합니다.",
  checklist: [
    "GraphQL의 Query, Mutation, Subscription의 역할과 차이를 설명할 수 있다",
    "Over-fetching과 Under-fetching 문제를 GraphQL이 어떻게 해결하는지 이해한다",
    "Apollo Client의 기본 설정과 캐시 정책을 구성할 수 있다",
    "graphql-codegen을 사용하여 TypeScript 타입을 자동 생성하는 방법을 안다",
    "GraphQL과 REST의 장단점을 비교하여 적절한 기술을 선택할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "REST API에서 필요 이상의 데이터를 응답받는 문제를 무엇이라 하나요?",
      choices: [
        "Under-fetching",
        "Over-fetching",
        "N+1 문제",
        "캐시 무효화",
      ],
      correctIndex: 1,
      explanation:
        "Over-fetching은 클라이언트가 필요하지 않은 필드까지 모두 응답받는 문제입니다. GraphQL은 필요한 필드만 명시적으로 요청하여 이를 해결합니다.",
    },
    {
      id: "q2",
      question:
        "GraphQL에서 데이터를 생성하거나 수정하는 작업은?",
      choices: [
        "Query",
        "Mutation",
        "Subscription",
        "Fragment",
      ],
      correctIndex: 1,
      explanation:
        "Mutation은 서버의 데이터를 변경(생성, 수정, 삭제)하는 작업입니다. Query는 조회, Subscription은 실시간 구독입니다.",
    },
    {
      id: "q3",
      question:
        "GraphQL Subscription의 기반 프로토콜은?",
      choices: [
        "HTTP 폴링",
        "Server-Sent Events",
        "WebSocket",
        "HTTP/2 서버 푸시",
      ],
      correctIndex: 2,
      explanation:
        "GraphQL Subscription은 WebSocket을 기반으로 동작합니다. 클라이언트가 특정 이벤트를 구독하면 서버가 해당 이벤트 발생 시 WebSocket으로 데이터를 푸시합니다.",
    },
    {
      id: "q4",
      question:
        "graphql-codegen의 주요 역할은?",
      choices: [
        "GraphQL 서버를 자동 생성한다",
        "GraphQL 스키마에서 TypeScript 타입을 자동 생성한다",
        "GraphQL 쿼리를 REST API로 변환한다",
        "GraphQL 응답을 캐싱한다",
      ],
      correctIndex: 1,
      explanation:
        "graphql-codegen은 GraphQL 스키마와 쿼리 문서를 분석하여 TypeScript 타입, 변수 타입, React 훅 등을 자동 생성합니다.",
    },
    {
      id: "q5",
      question:
        "GraphQL보다 REST가 더 적합한 경우는?",
      choices: [
        "여러 리소스를 한 번에 조회해야 할 때",
        "다양한 클라이언트가 서로 다른 데이터를 필요로 할 때",
        "파일 업로드와 HTTP 캐싱을 적극 활용해야 할 때",
        "프론트엔드 주도로 필요한 데이터를 결정해야 할 때",
      ],
      correctIndex: 2,
      explanation:
        "REST는 HTTP 표준 캐싱 메커니즘(ETag, Cache-Control)을 자연스럽게 활용할 수 있고, 파일 업로드/다운로드에 더 적합합니다. GraphQL은 단일 엔드포인트를 사용하므로 HTTP 캐싱이 어렵습니다.",
    },
  ],
};

export default chapter;
