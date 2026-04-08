import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "09-rest-api",
  subject: "network",
  title: "REST API 설계",
  description:
    "REST 아키텍처의 핵심 원칙을 이해하고, URI 설계, 버전 관리, 페이지네이션, 에러 처리 등 실무에서 필요한 API 설계 패턴과 프론트엔드 API 클라이언트 구성법을 학습합니다.",
  order: 9,
  group: "HTTP 진화",
  prerequisites: ["05-http-methods-status"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "REST API를 **도서관 시스템**에 비유해봅시다.\n\n" +
        "**리소스 = 도서관의 책**\n" +
        "각 책(리소스)은 고유한 청구기호(URI)를 가집니다. " +
        "`/books/978-89-123` 처럼 고유하게 식별됩니다.\n\n" +
        "**HTTP 메서드 = 도서관 업무**\n" +
        "- GET: 책을 열람합니다 (조회)\n" +
        "- POST: 새 책을 기증합니다 (생성)\n" +
        "- PUT: 책 전체를 새 판으로 교체합니다 (전체 수정)\n" +
        "- PATCH: 책의 오탈자만 정정합니다 (부분 수정)\n" +
        "- DELETE: 폐기 처리합니다 (삭제)\n\n" +
        "**Stateless = 매번 새로운 사서**\n" +
        "매번 다른 사서가 응대하므로 '아까 빌린 그 책'이라고 하면 안 됩니다. " +
        "항상 정확한 청구기호와 대출카드(인증 토큰)를 제시해야 합니다.\n\n" +
        "**HATEOAS = 책 속의 참고 문헌**\n" +
        "책을 읽으면 관련 책의 링크(참고 문헌)가 포함되어 있어, " +
        "다음에 어떤 책을 찾아야 할지 알 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 개발자가 백엔드와 협업할 때 다음과 같은 문제를 겪습니다:\n\n" +
        "### API 설계의 일관성 부재\n" +
        "- `/getUsers`, `/fetch-all-posts`, `/delete_comment` 처럼 네이밍이 제각각\n" +
        "- 같은 동작인데 어떤 API는 POST, 어떤 API는 GET을 사용\n" +
        "- 에러 응답 형식이 API마다 다름\n\n" +
        "### 데이터 관리 문제\n" +
        "- 한 번에 모든 데이터를 반환하여 성능 저하\n" +
        "- 필요 없는 필드까지 전부 전달 (Over-fetching)\n" +
        "- 관련 데이터를 얻으려면 여러 번 요청 (Under-fetching)\n\n" +
        "### API 버전 관리\n" +
        "- 기존 클라이언트를 깨뜨리지 않으면서 API를 변경하는 방법\n" +
        "- 프론트엔드에서 여러 버전의 API를 동시에 다루는 복잡성\n\n" +
        "### 프론트엔드 API 클라이언트\n" +
        "- 모든 컴포넌트에서 fetch를 직접 호출하면 중복과 에러 처리가 분산됨\n" +
        "- 인증 토큰 갱신, 요청 재시도 등 공통 로직을 어디에 둘지",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### REST 핵심 원칙\n\n" +
        "**1. 리소스 기반 URI 설계**\n" +
        "- 명사를 사용: `/users`, `/posts`, `/comments`\n" +
        "- 복수형 사용: `/users` (O), `/user` (X)\n" +
        "- 계층 관계 표현: `/users/123/posts` (사용자 123의 게시물들)\n" +
        "- 행위를 URI에 넣지 않음: `/users` + DELETE (O), `/deleteUser` (X)\n\n" +
        "**2. Stateless (무상태)**\n" +
        "모든 요청에 필요한 정보를 포함합니다. 서버는 이전 요청을 기억하지 않습니다.\n\n" +
        "**3. Uniform Interface (일관된 인터페이스)**\n" +
        "- 리소스 식별: URI로 리소스를 고유하게 식별\n" +
        "- 표현을 통한 조작: JSON, XML 등의 형식으로 리소스를 표현\n" +
        "- 자기 서술적 메시지: Content-Type 헤더로 형식을 알림\n\n" +
        "**4. HATEOAS**\n" +
        "응답에 관련 리소스의 링크를 포함하여 클라이언트가 API를 탐색할 수 있게 합니다.\n\n" +
        "### 페이지네이션\n" +
        "- **Offset 방식**: `?page=2&limit=20` (간단하지만 대량 데이터에서 느림)\n" +
        "- **Cursor 방식**: `?cursor=abc123&limit=20` (성능 우수, 실시간 데이터에 적합)\n\n" +
        "### 버전 관리\n" +
        "- **URI 방식**: `/v1/users`, `/v2/users`\n" +
        "- **헤더 방식**: `Accept: application/vnd.api+json;version=2`\n" +
        "- **쿼리 파라미터**: `/users?version=2`\n\n" +
        "### 에러 응답 표준화\n" +
        "일관된 형식으로 에러를 반환합니다:\n" +
        "```\n" +
        "{ \"error\": { \"code\": \"NOT_FOUND\", \"message\": \"...\", \"details\": [...] } }\n" +
        "```\n\n" +
        "### OpenAPI/Swagger\n" +
        "API 명세를 문서화하고 클라이언트 코드를 자동 생성할 수 있는 표준입니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: API 클라이언트 설계",
      content:
        "axios 인스턴스와 인터셉터를 활용한 프론트엔드 API 클라이언트 패턴을 구현합니다.",
      code: {
        language: "typescript",
        code:
          "// 프론트엔드 REST API 클라이언트 설계\n" +
          "\n" +
          "import axios, {\n" +
          "  AxiosInstance,\n" +
          "  AxiosError,\n" +
          "  InternalAxiosRequestConfig,\n" +
          "} from \"axios\";\n" +
          "\n" +
          "// API 에러 응답 타입\n" +
          "interface ApiError {\n" +
          "  code: string;\n" +
          "  message: string;\n" +
          "  details?: Array<{ field: string; reason: string }>;\n" +
          "}\n" +
          "\n" +
          "interface ApiErrorResponse {\n" +
          "  error: ApiError;\n" +
          "}\n" +
          "\n" +
          "// 페이지네이션 응답 타입\n" +
          "interface PaginatedResponse<T> {\n" +
          "  data: T[];\n" +
          "  pagination: {\n" +
          "    total: number;\n" +
          "    page: number;\n" +
          "    limit: number;\n" +
          "    hasNext: boolean;\n" +
          "  };\n" +
          "  links: {\n" +
          "    self: string;\n" +
          "    next?: string;\n" +
          "    prev?: string;\n" +
          "  };\n" +
          "}\n" +
          "\n" +
          "// API 클라이언트 생성\n" +
          "function createApiClient(baseURL: string): AxiosInstance {\n" +
          "  const client = axios.create({\n" +
          "    baseURL,\n" +
          "    timeout: 10000,\n" +
          "    headers: {\n" +
          "      \"Content-Type\": \"application/json\",\n" +
          "      Accept: \"application/json\",\n" +
          "    },\n" +
          "  });\n" +
          "\n" +
          "  // 요청 인터셉터: 인증 토큰 자동 추가\n" +
          "  client.interceptors.request.use(\n" +
          "    (config: InternalAxiosRequestConfig) => {\n" +
          "      const token = localStorage.getItem(\"accessToken\");\n" +
          "      if (token && config.headers) {\n" +
          "        config.headers.Authorization = \"Bearer \" + token;\n" +
          "      }\n" +
          "      return config;\n" +
          "    }\n" +
          "  );\n" +
          "\n" +
          "  // 응답 인터셉터: 토큰 만료 시 갱신\n" +
          "  client.interceptors.response.use(\n" +
          "    (response) => response,\n" +
          "    async (error: AxiosError<ApiErrorResponse>) => {\n" +
          "      const originalRequest = error.config;\n" +
          "\n" +
          "      if (\n" +
          "        error.response?.status === 401 &&\n" +
          "        originalRequest\n" +
          "      ) {\n" +
          "        try {\n" +
          "          const refreshToken =\n" +
          "            localStorage.getItem(\"refreshToken\");\n" +
          "          const { data } = await axios.post(\n" +
          "            baseURL + \"/auth/refresh\",\n" +
          "            { refreshToken }\n" +
          "          );\n" +
          "\n" +
          "          localStorage.setItem(\n" +
          "            \"accessToken\",\n" +
          "            data.accessToken\n" +
          "          );\n" +
          "          return client(originalRequest);\n" +
          "        } catch {\n" +
          "          localStorage.removeItem(\"accessToken\");\n" +
          "          localStorage.removeItem(\"refreshToken\");\n" +
          "          window.location.href = \"/login\";\n" +
          "        }\n" +
          "      }\n" +
          "\n" +
          "      return Promise.reject(error);\n" +
          "    }\n" +
          "  );\n" +
          "\n" +
          "  return client;\n" +
          "}\n" +
          "\n" +
          "// 사용 예시\n" +
          "const api = createApiClient(\"https://api.example.com/v1\");\n" +
          "\n" +
          "// 타입 안전한 API 호출\n" +
          "interface User {\n" +
          "  id: number;\n" +
          "  name: string;\n" +
          "  email: string;\n" +
          "}\n" +
          "\n" +
          "async function getUsers(\n" +
          "  page: number,\n" +
          "  limit: number\n" +
          "): Promise<PaginatedResponse<User>> {\n" +
          "  const { data } = await api.get<PaginatedResponse<User>>(\n" +
          "    \"/users\",\n" +
          "    { params: { page, limit } }\n" +
          "  );\n" +
          "  return data;\n" +
          "}",
        description:
          "axios 인스턴스와 인터셉터를 활용하여 인증, 토큰 갱신, 에러 처리를 중앙화한 API 클라이언트입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: RESTful CRUD 서비스 레이어",
      content:
        "제네릭을 활용하여 재사용 가능한 CRUD 서비스 레이어를 구현합니다.",
      code: {
        language: "typescript",
        code:
          "// 제네릭 REST API 서비스 레이어\n" +
          "\n" +
          "import axios, { AxiosInstance } from \"axios\";\n" +
          "\n" +
          "interface PaginationParams {\n" +
          "  page?: number;\n" +
          "  limit?: number;\n" +
          "  sort?: string;\n" +
          "  order?: \"asc\" | \"desc\";\n" +
          "}\n" +
          "\n" +
          "interface PaginatedResult<T> {\n" +
          "  data: T[];\n" +
          "  total: number;\n" +
          "  page: number;\n" +
          "  limit: number;\n" +
          "}\n" +
          "\n" +
          "// 재사용 가능한 CRUD 서비스 클래스\n" +
          "class RestService<T extends { id: number | string }> {\n" +
          "  private client: AxiosInstance;\n" +
          "  private resourcePath: string;\n" +
          "\n" +
          "  constructor(client: AxiosInstance, resourcePath: string) {\n" +
          "    this.client = client;\n" +
          "    this.resourcePath = resourcePath;\n" +
          "  }\n" +
          "\n" +
          "  // GET /resources?page=1&limit=20\n" +
          "  async getAll(\n" +
          "    params?: PaginationParams\n" +
          "  ): Promise<PaginatedResult<T>> {\n" +
          "    const { data } = await this.client.get<\n" +
          "      PaginatedResult<T>\n" +
          "    >(this.resourcePath, { params });\n" +
          "    return data;\n" +
          "  }\n" +
          "\n" +
          "  // GET /resources/:id\n" +
          "  async getById(id: number | string): Promise<T> {\n" +
          "    const { data } = await this.client.get<T>(\n" +
          "      this.resourcePath + \"/\" + id\n" +
          "    );\n" +
          "    return data;\n" +
          "  }\n" +
          "\n" +
          "  // POST /resources\n" +
          "  async create(payload: Omit<T, \"id\">): Promise<T> {\n" +
          "    const { data } = await this.client.post<T>(\n" +
          "      this.resourcePath,\n" +
          "      payload\n" +
          "    );\n" +
          "    return data;\n" +
          "  }\n" +
          "\n" +
          "  // PUT /resources/:id (전체 교체)\n" +
          "  async replace(\n" +
          "    id: number | string,\n" +
          "    payload: Omit<T, \"id\">\n" +
          "  ): Promise<T> {\n" +
          "    const { data } = await this.client.put<T>(\n" +
          "      this.resourcePath + \"/\" + id,\n" +
          "      payload\n" +
          "    );\n" +
          "    return data;\n" +
          "  }\n" +
          "\n" +
          "  // PATCH /resources/:id (부분 수정)\n" +
          "  async update(\n" +
          "    id: number | string,\n" +
          "    payload: Partial<T>\n" +
          "  ): Promise<T> {\n" +
          "    const { data } = await this.client.patch<T>(\n" +
          "      this.resourcePath + \"/\" + id,\n" +
          "      payload\n" +
          "    );\n" +
          "    return data;\n" +
          "  }\n" +
          "\n" +
          "  // DELETE /resources/:id\n" +
          "  async delete(id: number | string): Promise<void> {\n" +
          "    await this.client.delete(\n" +
          "      this.resourcePath + \"/\" + id\n" +
          "    );\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// 사용 예시\n" +
          "interface Post {\n" +
          "  id: number;\n" +
          "  title: string;\n" +
          "  content: string;\n" +
          "  authorId: number;\n" +
          "}\n" +
          "\n" +
          "const api = axios.create({\n" +
          "  baseURL: \"https://api.example.com/v1\",\n" +
          "});\n" +
          "\n" +
          "const postService = new RestService<Post>(api, \"/posts\");\n" +
          "\n" +
          "async function demo(): Promise<void> {\n" +
          "  // 목록 조회 (페이지네이션)\n" +
          "  const posts = await postService.getAll({\n" +
          "    page: 1,\n" +
          "    limit: 10,\n" +
          "    sort: \"createdAt\",\n" +
          "    order: \"desc\",\n" +
          "  });\n" +
          "  console.log(\"총 게시물: \" + posts.total);\n" +
          "\n" +
          "  // 단건 조회\n" +
          "  const post = await postService.getById(1);\n" +
          "  console.log(\"제목: \" + post.title);\n" +
          "\n" +
          "  // 생성\n" +
          "  const newPost = await postService.create({\n" +
          "    title: \"새 글\",\n" +
          "    content: \"내용입니다\",\n" +
          "    authorId: 1,\n" +
          "  });\n" +
          "  console.log(\"생성된 ID: \" + newPost.id);\n" +
          "\n" +
          "  // 수정\n" +
          "  await postService.update(newPost.id, {\n" +
          "    title: \"수정된 제목\",\n" +
          "  });\n" +
          "\n" +
          "  // 삭제\n" +
          "  await postService.delete(newPost.id);\n" +
          "  console.log(\"삭제 완료\");\n" +
          "}\n" +
          "\n" +
          "demo();",
        description:
          "제네릭을 활용한 재사용 가능한 CRUD 서비스 클래스로, 어떤 리소스든 동일한 패턴으로 API를 호출할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### REST 핵심 원칙\n" +
        "- 리소스를 URI로 식별하고, HTTP 메서드로 행위를 표현\n" +
        "- 무상태(Stateless): 매 요청에 필요한 모든 정보를 포함\n" +
        "- 일관된 인터페이스: 모든 리소스가 동일한 패턴을 따름\n\n" +
        "### URI 설계\n" +
        "- 명사 + 복수형 사용 (`/users`, `/posts`)\n" +
        "- 계층 관계 표현 (`/users/123/posts`)\n" +
        "- 동사를 URI에 포함하지 않음\n\n" +
        "### 실무 패턴\n" +
        "- 페이지네이션: Offset 방식과 Cursor 방식\n" +
        "- 버전 관리: URI 방식 (`/v1/`), 헤더 방식\n" +
        "- 에러 응답: 일관된 JSON 형식으로 코드, 메시지, 상세 정보 반환\n\n" +
        "### 프론트엔드 API 클라이언트\n" +
        "- axios 인스턴스로 baseURL, 헤더, 타임아웃 설정 중앙화\n" +
        "- 요청 인터셉터로 인증 토큰 자동 추가\n" +
        "- 응답 인터셉터로 토큰 갱신, 에러 핸들링 자동화\n" +
        "- 제네릭 서비스 클래스로 CRUD 패턴 재사용",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "REST API는 리소스 중심의 URI, HTTP 메서드, 일관된 응답 형식을 통해 프론트엔드와 백엔드 간의 명확한 계약을 정의합니다.",
  checklist: [
    "REST의 핵심 원칙(무상태, 리소스 기반, 일관된 인터페이스)을 설명할 수 있다",
    "RESTful URI를 올바르게 설계할 수 있다 (명사, 복수형, 계층 구조)",
    "페이지네이션의 Offset 방식과 Cursor 방식의 차이를 이해한다",
    "axios 인터셉터를 사용한 인증 토큰 관리 패턴을 구현할 수 있다",
    "OpenAPI/Swagger로 API 명세를 문서화하는 목적을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "RESTful URI 설계로 올바른 것은?",
      choices: [
        "/getUsers",
        "/users/delete/123",
        "/users/123",
        "/api/fetchAllPosts",
      ],
      correctIndex: 2,
      explanation:
        "REST에서는 명사로 리소스를 식별하고 HTTP 메서드로 행위를 표현합니다. /users/123은 ID 123인 사용자 리소스를 나타냅니다.",
    },
    {
      id: "q2",
      question:
        "REST의 Stateless 원칙이 의미하는 것은?",
      choices: [
        "서버가 데이터를 저장하지 않는다",
        "매 요청에 필요한 모든 정보를 포함해야 한다",
        "클라이언트가 상태를 갖지 않는다",
        "세션을 사용할 수 없다",
      ],
      correctIndex: 1,
      explanation:
        "Stateless란 서버가 이전 요청의 상태를 기억하지 않으므로, 매 요청에 인증 정보 등 필요한 모든 정보를 포함해야 한다는 원칙입니다.",
    },
    {
      id: "q3",
      question:
        "대량 데이터의 실시간 피드에 더 적합한 페이지네이션 방식은?",
      choices: [
        "Offset 기반 (page, limit)",
        "Cursor 기반 (cursor, limit)",
        "전체 데이터 반환",
        "무작위 샘플링",
      ],
      correctIndex: 1,
      explanation:
        "Cursor 기반 페이지네이션은 마지막 항목의 식별자를 기준으로 다음 데이터를 조회하므로, 데이터가 추가/삭제되어도 누락이나 중복이 발생하지 않습니다.",
    },
    {
      id: "q4",
      question:
        "axios 인터셉터의 주요 활용 사례가 아닌 것은?",
      choices: [
        "인증 토큰 자동 추가",
        "DOM 요소 직접 조작",
        "만료된 토큰 자동 갱신",
        "에러 응답 공통 처리",
      ],
      correctIndex: 1,
      explanation:
        "axios 인터셉터는 HTTP 요청/응답을 가로채서 처리하는 미들웨어로, DOM 조작과는 관련이 없습니다.",
    },
    {
      id: "q5",
      question:
        "HATEOAS의 핵심 개념은?",
      choices: [
        "모든 응답을 HTML로 반환한다",
        "응답에 관련 리소스의 링크를 포함하여 API를 탐색 가능하게 한다",
        "서버가 클라이언트의 상태를 관리한다",
        "요청을 하이퍼텍스트 형식으로 보낸다",
      ],
      correctIndex: 1,
      explanation:
        "HATEOAS(Hypermedia As The Engine Of Application State)는 응답에 관련 리소스 링크를 포함하여 클라이언트가 API를 동적으로 탐색할 수 있게 하는 REST 원칙입니다.",
    },
  ],
};

export default chapter;
