import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "07-server-components",
  subject: "next",
  title: "Server Components 심화",
  description:
    "App Router의 기본 컴포넌트인 Server Component의 동작 원리, 장점, 제약사항, 그리고 React Server Components(RSC)와 Next.js 구현의 차이를 학습합니다.",
  order: 7,
  group: "서버와 클라이언트",
  prerequisites: ["06-loading-error-ui"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Server Component는 **레스토랑의 주방에서 완성되어 나오는 요리**와 같습니다.\n\n" +
        "일반적인 React 컴포넌트(Client Component)는 **밀키트**입니다. 재료와 레시피(JavaScript 번들)를 고객(브라우저)에게 보내서, 고객이 직접 조리(렌더링)합니다. 밀키트가 많아질수록 배송 상자(번들)가 커지죠.\n\n" +
        "반면 Server Component는 **셰프가 주방에서 완성한 요리**입니다. 고객은 완성된 요리(HTML)만 받습니다. 레시피(JavaScript)를 보내지 않으니 배송 상자(번들)에 포함되지 않습니다.\n\n" +
        "더 중요한 점은, 셰프(서버)는 주방의 모든 재료에 직접 접근할 수 있습니다. 냉장고(데이터베이스), 창고(파일시스템), 식재료 공급업체(외부 API)에 직접 접근하여 요리할 수 있죠. 고객에게 재료를 보내고 '직접 냉장고에서 꺼내세요'라고 할 필요가 없습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "기존 React(CSR) 방식에서는 모든 컴포넌트가 클라이언트 번들에 포함되었습니다.\n\n" +
        "1. **번들 크기 증가** — 데이터를 보여주기만 하는 정적 컴포넌트도 JavaScript 번들에 포함됩니다. `moment.js`로 날짜를 포맷하거나 `marked`로 마크다운을 렌더링하는 컴포넌트가 모두 클라이언트에 전송됩니다.\n\n" +
        "2. **워터폴 문제** — 컴포넌트가 마운트된 후 `useEffect`에서 API를 호출합니다. 부모가 로딩 → 자식이 로딩 → 손자가 로딩하는 순차적 워터폴이 발생합니다.\n\n" +
        "3. **API 레이어 불필요한 중복** — 서버의 데이터를 브라우저에서 접근하려면 반드시 API 엔드포인트를 만들어야 합니다. DB에서 바로 읽을 수 있는 데이터도 REST/GraphQL API를 거쳐야 합니다.\n\n" +
        "4. **보안 우려** — API 키, 데이터베이스 쿼리 로직이 클라이언트 번들에 노출될 위험이 있습니다. 환경변수 관리에 각별한 주의가 필요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js App Router에서는 **모든 컴포넌트가 기본적으로 Server Component**입니다.\n\n" +
        "### 1. RSC Payload — 핵심 전송 단위\n" +
        "RSC Payload는 렌더링된 React Server Components 트리의 **압축된 바이너리 표현**이다. Server Component가 서버에서 렌더링되면, 그 결과가 HTML이 아닌 이 특수한 형식으로 인코딩되어 클라이언트로 전송됩니다.\n\n" +
        "**RSC Payload에 포함되는 정보:**\n" +
        "1. **Server Component의 렌더링 결과** — React 엘리먼트 트리 형태로 직렬화된 결과\n" +
        "2. **Client Component의 placeholder와 JS 파일 참조** — Client Component가 들어갈 자리를 표시하고, 해당 컴포넌트의 JavaScript 번들 파일 경로를 포함\n" +
        "3. **Server에서 Client로 전달되는 props** — Server Component가 Client Component에 넘기는 데이터(직렬화 가능한 값만)\n\n" +
        "### 2. 서버 렌더링 파이프라인\n" +
        "서버에서의 렌더링은 다음 단계로 진행됩니다:\n\n" +
        "1. **라우트 세그먼트 분할** — React가 라우트 세그먼트(layout, page) 단위로 렌더링 작업을 분할합니다. 이를 통해 병렬 렌더링과 스트리밍이 가능해집니다.\n" +
        "2. **Server Component → RSC Payload** — Server Component를 실행하여 RSC Payload로 렌더링합니다. 이 단계에서 DB 조회, 파일 읽기 등 서버 사이드 작업이 수행됩니다.\n" +
        "3. **HTML 프리렌더링** — Client Component 코드와 RSC Payload를 조합하여 HTML을 프리렌더링합니다. 이 HTML은 초기 페이지 로드 시 즉시 표시됩니다.\n\n" +
        "### 3. 클라이언트 수화(Hydration) 과정\n" +
        "클라이언트에서는 3단계로 인터랙티브한 페이지가 완성됩니다:\n\n" +
        "1. **HTML 즉시 표시** — 서버에서 받은 HTML로 즉시 미리보기를 표시합니다 (non-interactive 상태)\n" +
        "2. **RSC Payload로 Reconciliation** — RSC Payload를 사용하여 Server Component 트리와 Client Component 트리를 reconciliation하고, DOM을 업데이트합니다\n" +
        "3. **Hydration** — Client Component의 JavaScript를 실행하여 이벤트 핸들러를 연결하고 인터랙티브하게 만듭니다\n\n" +
        "### 4. 서버에서만 실행\n" +
        "Server Component의 JavaScript 코드는 브라우저 번들에 포함되지 않습니다. 무거운 라이브러리를 사용해도 번들 크기에 영향을 주지 않습니다.\n\n" +
        "### 5. 데이터 소스 직접 접근\n" +
        "서버에서 실행되므로 데이터베이스, 파일시스템, 내부 API에 직접 접근할 수 있습니다. API 엔드포인트를 별도로 만들 필요가 없습니다.\n\n" +
        "### 6. async 컴포넌트\n" +
        "Server Component는 `async` 함수가 될 수 있습니다. `await`로 데이터를 가져온 후 렌더링할 수 있어서 `useEffect` + `useState` 패턴이 필요 없습니다.\n\n" +
        "### 7. 제약사항\n" +
        "- `useState`, `useEffect` 등 React 훅을 사용할 수 없습니다\n" +
        "- `onClick` 등 이벤트 핸들러를 등록할 수 없습니다\n" +
        "- 브라우저 API(`window`, `document`)에 접근할 수 없습니다\n\n" +
        "### React RSC vs Next.js\n" +
        "React Server Components는 React 팀이 설계한 **스펙**이고, Next.js App Router는 이를 **구현**한 프레임워크입니다. RSC 스펙 자체는 번들러와 서버 인프라가 필요하며, Next.js가 이를 통합하여 제공합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: RSC Payload의 개념적 구조",
      content:
        "RSC Payload는 실제로는 바이너리 형식이지만, 개념적으로 어떤 정보를 담고 있는지 이해하기 위해 JSON과 유사한 형태로 시각화해봅니다. Server Component는 렌더링 결과가 직접 포함되고, Client Component는 placeholder와 JS 파일 참조로 대체되는 것이 핵심입니다.",
      code: {
        language: "typescript",
        code:
          '// RSC Payload의 개념적 구조 (실제 형식은 바이너리)\n' +
          '// 서버에서 이 컴포넌트를 렌더링하면:\n' +
          '// <Page>\n' +
          '//   <Header />           ← Server Component\n' +
          '//   <SearchBar />         ← Client Component\n' +
          '//   <ProductList />       ← Server Component (DB 조회)\n' +
          '// </Page>\n' +
          '\n' +
          '// RSC Payload는 대략 이런 정보를 담고 있다:\n' +
          '{\n' +
          '  // Server Component 렌더링 결과 (HTML이 아닌 React 엘리먼트 트리)\n' +
          '  tree: {\n' +
          '    type: "div",\n' +
          '    props: {\n' +
          '      children: [\n' +
          '        // Header: 서버에서 이미 렌더링 완료\n' +
          '        { type: "header", props: { children: "My Store" } },\n' +
          '\n' +
          '        // SearchBar: Client Component → placeholder + JS 참조\n' +
          '        {\n' +
          '          $$type: "client-reference",\n' +
          '          module: "./SearchBar.js",  // 클라이언트 번들 파일\n' +
          '          props: { placeholder: "검색어를 입력하세요" }\n' +
          '        },\n' +
          '\n' +
          '        // ProductList: 서버에서 DB 조회 후 렌더링 완료\n' +
          '        {\n' +
          '          type: "ul",\n' +
          '          props: {\n' +
          '            children: [\n' +
          '              { type: "li", props: { children: "상품 A - 10,000원" } },\n' +
          '              { type: "li", props: { children: "상품 B - 20,000원" } },\n' +
          '            ]\n' +
          '          }\n' +
          '        }\n' +
          '      ]\n' +
          '    }\n' +
          '  }\n' +
          '}',
        description:
          "RSC Payload는 Server Component의 렌더링 결과, Client Component의 placeholder와 JS 번들 참조, 그리고 Server→Client로 전달되는 props를 포함하는 압축된 바이너리 형식입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 파일시스템에서 데이터 읽기",
      content:
        "Server Component의 강력한 장점 중 하나는 파일시스템에 직접 접근할 수 있다는 것입니다. 이 예제에서는 로컬 MDX 파일을 읽어 블로그 포스트 목록을 렌더링합니다. 이런 접근은 클라이언트 컴포넌트에서는 절대 불가능합니다.",
      code: {
        language: "typescript",
        code:
          '// app/blog/page.tsx\n' +
          'import fs from "fs/promises";\n' +
          'import path from "path";\n' +
          'import matter from "gray-matter"; // 번들에 포함되지 않음\n' +
          'import Link from "next/link";\n' +
          '\n' +
          'interface PostMeta {\n' +
          '  title: string;\n' +
          '  date: string;\n' +
          '  summary: string;\n' +
          '  slug: string;\n' +
          '}\n' +
          '\n' +
          'async function getPosts(): Promise<PostMeta[]> {\n' +
          '  const postsDir = path.join(process.cwd(), "content/posts");\n' +
          '  const files = await fs.readdir(postsDir);\n' +
          '\n' +
          '  const posts = await Promise.all(\n' +
          '    files\n' +
          '      .filter((file) => file.endsWith(".mdx"))\n' +
          '      .map(async (file) => {\n' +
          '        const filePath = path.join(postsDir, file);\n' +
          '        const content = await fs.readFile(filePath, "utf-8");\n' +
          '        const { data } = matter(content);\n' +
          '        return {\n' +
          '          title: data.title,\n' +
          '          date: data.date,\n' +
          '          summary: data.summary,\n' +
          '          slug: file.replace(".mdx", ""),\n' +
          '        };\n' +
          '      })\n' +
          '  );\n' +
          '\n' +
          '  return posts.sort(\n' +
          '    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'export default async function BlogPage() {\n' +
          '  const posts = await getPosts();\n' +
          '\n' +
          '  return (\n' +
          '    <section>\n' +
          '      <h1>블로그</h1>\n' +
          '      <ul>\n' +
          '        {posts.map((post) => (\n' +
          '          <li key={post.slug}>\n' +
          '            <Link href={`/blog/${post.slug}`}>\n' +
          '              <h2>{post.title}</h2>\n' +
          '              <p>{post.summary}</p>\n' +
          '              <time>{post.date}</time>\n' +
          '            </Link>\n' +
          '          </li>\n' +
          '        ))}\n' +
          '      </ul>\n' +
          '    </section>\n' +
          '  );\n' +
          '}',
        description:
          "fs, path, gray-matter 등 Node.js 모듈을 직접 사용하여 파일시스템의 MDX 파일을 읽고 렌더링합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 특성 | Server Component | Client Component |\n" +
        "|------|-----------------|------------------|\n" +
        "| 실행 환경 | 서버에서만 | 서버(프리렌더) + 클라이언트 |\n" +
        "| 번들 포함 | 포함되지 않음 | 포함됨 |\n" +
        "| async/await | 가능 | 불가 |\n" +
        "| DB/파일 접근 | 직접 접근 가능 | API 필요 |\n" +
        "| useState/useEffect | 사용 불가 | 사용 가능 |\n" +
        "| 이벤트 핸들러 | 등록 불가 | 등록 가능 |\n\n" +
        "**핵심:** App Router에서 모든 컴포넌트는 기본이 Server Component입니다. 서버에서만 실행되어 번들에 포함되지 않고, DB나 파일시스템에 직접 접근할 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** 상호작용이 필요한 컴포넌트를 위한 Client Components와 \"use client\" 지시어를 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "App Router의 컴포넌트는 기본이 Server Component — 서버에서 RSC Payload(압축된 바이너리 트리)로 렌더링되어 번들에 포함되지 않고, DB나 파일시스템에 직접 접근할 수 있다.",
  checklist: [
    "Server Component가 기본인 이유와 장점을 설명할 수 있다",
    "Server Component에서 async/await로 데이터를 가져오는 방법을 이해한다",
    "Server Component에서 사용할 수 없는 기능(훅, 이벤트, 브라우저 API)을 안다",
    "React RSC 스펙과 Next.js 구현의 차이를 설명할 수 있다",
    "Server Component가 번들 크기에 미치는 영향을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Next.js App Router에서 컴포넌트의 기본 타입은?",
      choices: [
        "Client Component",
        "Server Component",
        "Shared Component",
        "Universal Component",
      ],
      correctIndex: 1,
      explanation:
        "App Router에서는 별도의 지시어 없이 작성한 모든 컴포넌트가 기본적으로 Server Component입니다.",
    },
    {
      id: "q2",
      question:
        "Server Component에서 사용할 수 있는 것은?",
      choices: [
        "useState",
        "onClick 이벤트 핸들러",
        "async/await로 DB 직접 조회",
        "window.localStorage",
      ],
      correctIndex: 2,
      explanation:
        "Server Component는 서버에서 실행되므로 async/await로 데이터베이스에 직접 접근할 수 있습니다. 반면 훅, 이벤트 핸들러, 브라우저 API는 사용할 수 없습니다.",
    },
    {
      id: "q3",
      question:
        "Server Component에서 무거운 라이브러리(예: marked)를 import하면 번들 크기에 어떤 영향이 있나?",
      choices: [
        "번들 크기가 라이브러리 크기만큼 증가한다",
        "번들 크기에 전혀 영향을 주지 않는다",
        "트리 셰이킹으로 일부만 포함된다",
        "lazy loading으로 나중에 로드된다",
      ],
      correctIndex: 1,
      explanation:
        "Server Component의 코드는 서버에서만 실행되고 클라이언트 번들에 포함되지 않으므로, 어떤 라이브러리를 import해도 번들 크기에 영향이 없습니다.",
    },
    {
      id: "q4",
      question:
        "RSC Payload에 포함되는 정보가 아닌 것은?",
      choices: [
        "Server Component의 렌더링 결과",
        "Client Component의 placeholder와 JS 파일 참조",
        "Server에서 Client로 전달되는 props",
        "Client Component의 useState 초기값",
      ],
      correctIndex: 3,
      explanation:
        "RSC Payload는 Server Component 렌더링 결과, Client Component placeholder/JS 참조, Server→Client props를 포함합니다. useState 초기값은 Client Component 내부 로직이므로 RSC Payload에 포함되지 않습니다.",
    },
    {
      id: "q5",
      question:
        "Server Component가 해결하는 문제가 아닌 것은?",
      choices: [
        "클라이언트 번들 크기 증가",
        "데이터 페칭 워터폴",
        "CSS 스타일링 충돌",
        "API 레이어 불필요한 중복",
      ],
      correctIndex: 2,
      explanation:
        "Server Component는 번들 크기, 데이터 페칭 워터폴, 불필요한 API 레이어 문제를 해결합니다. CSS 스타일링 충돌은 Server Component와 관련이 없는 별도의 문제입니다.",
    },
  ],
};

export default chapter;
