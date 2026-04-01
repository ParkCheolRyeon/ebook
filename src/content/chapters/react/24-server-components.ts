import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "24-server-components",
  subject: "react",
  title: "Server Components",
  description: "RSC 개념, 서버/클라이언트 경계, 'use client' 지시어, 직렬화 제약, 서버 컴포넌트에서 할 수 있는/없는 것을 이해합니다.",
  order: 24,
  group: "렌더링 원리",
  prerequisites: ["23-suspense"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Server Components는 레스토랑의 주방과 홀의 역할 분담과 비슷합니다.\n\n" +
        "**서버 컴포넌트**는 주방입니다. 재료(데이터베이스) 접근, 무거운 조리(데이터 처리)를 담당합니다. 손님(브라우저)은 주방에 들어갈 수 없고, 완성된 요리(HTML/직렬화된 결과)만 받습니다.\n\n" +
        "**클라이언트 컴포넌트**는 홀입니다. 손님과 직접 상호작용(클릭, 입력)하고, 즉각적인 반응(UI 업데이트)을 제공합니다.\n\n" +
        "**'use client' 지시어**는 주방과 홀 사이의 문입니다. 이 문을 통해 전달할 수 있는 것(직렬화 가능한 데이터)과 전달할 수 없는 것(함수, 클래스 인스턴스)이 정해져 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "전통적인 클라이언트 렌더링에는 여러 한계가 있습니다.\n\n" +
        "1. **번들 크기 증가** — 데이터 변환, 마크다운 파싱 등 서버에서 하면 될 작업의 라이브러리가 클라이언트 번들에 포함됩니다.\n" +
        "2. **데이터 접근의 비효율** — 클라이언트에서 API를 호출하면 네트워크 왕복(round-trip)이 필요합니다. 서버에서 직접 DB에 접근하면 훨씬 빠릅니다.\n" +
        "3. **워터폴** — 부모 컴포넌트의 데이터 요청이 완료된 후에야 자식 컴포넌트가 자신의 데이터를 요청합니다.\n" +
        "4. **보안 위험** — API 키나 토큰이 클라이언트에 노출될 수 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### React Server Components (RSC)\n" +
        "서버에서만 실행되는 컴포넌트입니다. 기본적으로 모든 컴포넌트는 서버 컴포넌트입니다.\n\n" +
        "### 서버 컴포넌트에서 할 수 있는 것\n" +
        "- `async/await`로 직접 데이터 페칭\n" +
        "- 데이터베이스, 파일 시스템 접근\n" +
        "- 무거운 라이브러리 사용 (번들에 포함되지 않음)\n" +
        "- 환경 변수, 비밀 키 안전 사용\n\n" +
        "### 서버 컴포넌트에서 할 수 없는 것\n" +
        "- useState, useEffect 등 Hook 사용\n" +
        "- onClick 등 이벤트 핸들러\n" +
        "- 브라우저 API (window, document)\n" +
        "- Context 소비 (useContext)\n\n" +
        "### 'use client' 지시어\n" +
        "파일 맨 위에 `'use client'`를 선언하면 해당 파일과 그 import는 클라이언트 번들에 포함됩니다. 이것이 서버/클라이언트 경계를 정의합니다.\n\n" +
        "### 직렬화 제약\n" +
        "서버 컴포넌트에서 클라이언트 컴포넌트로 전달하는 props는 JSON으로 직렬화 가능해야 합니다. 함수, Date, Map, Set 등은 직접 전달할 수 없습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: RSC 렌더링 흐름",
      content:
        "서버 컴포넌트가 어떻게 렌더링되고 클라이언트에 전달되는지 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// RSC 렌더링 흐름 의사코드\n' +
          '\n' +
          '// 1. 서버에서 서버 컴포넌트 실행\n' +
          'async function renderOnServer(component: ServerComponent) {\n' +
          '  // 서버 컴포넌트는 async 가능\n' +
          '  const result = await component.render();\n' +
          '\n' +
          '  // 결과를 RSC Payload(직렬화된 형태)로 변환\n' +
          '  const payload = serialize(result);\n' +
          '  // payload 예시:\n' +
          '  // [\n' +
          '  //   "div", null,\n' +
          '  //   ["h1", null, "서버에서 렌더링된 제목"],\n' +
          '  //   ["$client:Counter", { initialCount: 0 }]  // 클라이언트 참조\n' +
          '  // ]\n' +
          '\n' +
          '  return payload;\n' +
          '}\n' +
          '\n' +
          '// 2. 직렬화 시 경계 처리\n' +
          'function serialize(element: ReactElement): SerializedNode {\n' +
          '  if (isServerComponent(element)) {\n' +
          '    // 서버 컴포넌트 → 실행 결과를 직렬화\n' +
          '    const rendered = element.type(element.props);\n' +
          '    return serialize(rendered);\n' +
          '  }\n' +
          '\n' +
          '  if (isClientComponent(element)) {\n' +
          '    // 클라이언트 컴포넌트 → 참조만 직렬화\n' +
          '    // props는 JSON 직렬화 가능해야 함!\n' +
          '    assertSerializable(element.props);\n' +
          '    return {\n' +
          '      type: "$client:" + element.type.moduleId,\n' +
          '      props: JSON.parse(JSON.stringify(element.props)),\n' +
          '    };\n' +
          '  }\n' +
          '\n' +
          '  // HTML 요소 → 그대로 직렬화\n' +
          '  return {\n' +
          '    type: element.type,\n' +
          '    props: element.props,\n' +
          '    children: element.children.map(serialize),\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          '// 3. 클라이언트에서 hydration\n' +
          'function hydrateOnClient(payload: SerializedNode) {\n' +
          '  // "$client:" 참조를 실제 클라이언트 컴포넌트로 대체\n' +
          '  // 이벤트 핸들러 연결, useState 초기화 등\n' +
          '}\n',
        description: "서버 컴포넌트는 실행 결과를 직렬화하고, 클라이언트 컴포넌트는 참조만 전달됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 서버/클라이언트 컴포넌트 분리",
      content:
        "서버 컴포넌트와 클라이언트 컴포넌트를 올바르게 분리하는 패턴입니다.",
      code: {
        language: "typescript",
        code:
          '// ✅ 서버 컴포넌트 (기본) — DB 직접 접근\n' +
          '// app/posts/page.tsx\n' +
          'import { db } from "@/lib/database";\n' +
          'import { LikeButton } from "./like-button";\n' +
          '\n' +
          'async function PostPage({ params }: { params: { id: string } }) {\n' +
          '  // 서버에서 직접 DB 접근 — API 라우트 불필요\n' +
          '  const post = await db.post.findUnique({\n' +
          '    where: { id: params.id },\n' +
          '  });\n' +
          '\n' +
          '  if (!post) return <p>게시글을 찾을 수 없습니다</p>;\n' +
          '\n' +
          '  return (\n' +
          '    <article>\n' +
          '      <h1>{post.title}</h1>\n' +
          '      <p>{post.content}</p>\n' +
          '      {/* 클라이언트 컴포넌트에 직렬화 가능한 props만 전달 */}\n' +
          '      <LikeButton postId={post.id} initialLikes={post.likes} />\n' +
          '    </article>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'export default PostPage;\n' +
          '\n' +
          '// ✅ 클라이언트 컴포넌트 — 상호작용 담당\n' +
          '// app/posts/like-button.tsx\n' +
          '"use client";\n' +
          '\n' +
          'import { useState } from "react";\n' +
          '\n' +
          'export function LikeButton({ postId, initialLikes }: {\n' +
          '  postId: string;\n' +
          '  initialLikes: number;\n' +
          '}) {\n' +
          '  const [likes, setLikes] = useState(initialLikes);\n' +
          '\n' +
          '  async function handleClick() {\n' +
          '    setLikes((prev) => prev + 1);\n' +
          '    await fetch(`/api/posts/${postId}/like`, { method: "POST" });\n' +
          '  }\n' +
          '\n' +
          '  return <button onClick={handleClick}>좋아요 {likes}</button>;\n' +
          '}\n' +
          '\n' +
          '// ❌ 잘못된 패턴: 서버 컴포넌트에서 함수를 props로 전달\n' +
          '// function BadExample() {\n' +
          '//   const handleClick = () => console.log("click");\n' +
          '//   return <LikeButton onClick={handleClick} />;\n' +
          '//   // Error: 함수는 직렬화 불가\n' +
          '// }\n' +
          '\n' +
          '// ✅ 서버 컴포넌트의 children으로 클라이언트 컴포넌트 감싸기\n' +
          '// 서버 컴포넌트\n' +
          'function Layout({ children }: { children: React.ReactNode }) {\n' +
          '  const theme = getThemeFromDB(); // 서버에서 데이터 접근\n' +
          '  return (\n' +
          '    <div data-theme={theme}>\n' +
          '      {children} {/* 클라이언트 컴포넌트가 들어올 수 있음 */}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n',
        description: "'use client' 경계를 최대한 아래로 내려 서버 컴포넌트의 이점을 최대화하세요.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 항목 | 서버 컴포넌트 | 클라이언트 컴포넌트 |\n" +
        "|------|-------------|-------------------|\n" +
        "| 실행 환경 | 서버만 | 서버 + 클라이언트 |\n" +
        "| async/await | O | X |\n" +
        "| useState/useEffect | X | O |\n" +
        "| 이벤트 핸들러 | X | O |\n" +
        "| DB/파일 접근 | O | X |\n" +
        "| 번들 포함 | X | O |\n\n" +
        "**핵심:** 서버 컴포넌트는 데이터 접근과 무거운 처리를, 클라이언트 컴포넌트는 상호작용을 담당합니다. 'use client' 경계를 가능한 한 잎사귀(leaf) 컴포넌트에 두어 번들 크기를 최소화하세요.\n\n" +
        "**다음 챕터 미리보기:** 컴포넌트가 언제 리렌더링되는지, 불필요한 리렌더링을 어떻게 판별하는지 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "서버 컴포넌트와 클라이언트 컴포넌트의 차이를 설명할 수 있다",
    "'use client' 지시어의 역할과 경계 개념을 이해한다",
    "직렬화 제약이 존재하는 이유를 설명할 수 있다",
    "서버 컴포넌트가 번들 크기에 미치는 영향을 이해한다",
    "서버/클라이언트 경계를 적절히 설계하는 원칙을 알고 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "React Server Components에서 기본적으로 모든 컴포넌트는?",
      choices: [
        "클라이언트 컴포넌트이다",
        "서버 컴포넌트이다",
        "공유 컴포넌트이다",
        "명시적으로 지정해야 한다",
      ],
      correctIndex: 1,
      explanation: "RSC 아키텍처에서 별도 지시어가 없으면 모든 컴포넌트는 서버 컴포넌트로 취급됩니다.",
    },
    {
      id: "q2",
      question: "서버 컴포넌트에서 사용할 수 없는 것은?",
      choices: [
        "async/await",
        "데이터베이스 쿼리",
        "useState",
        "환경 변수 접근",
      ],
      correctIndex: 2,
      explanation: "useState는 클라이언트 상태를 관리하는 Hook으로, 서버에서 실행되는 서버 컴포넌트에서는 사용할 수 없습니다.",
    },
    {
      id: "q3",
      question: "서버 컴포넌트에서 클라이언트 컴포넌트로 전달할 수 없는 prop은?",
      choices: [
        "문자열",
        "숫자",
        "함수",
        "배열",
      ],
      correctIndex: 2,
      explanation: "서버에서 클라이언트로 전달되는 props는 JSON 직렬화 가능해야 합니다. 함수는 직렬화할 수 없으므로 전달할 수 없습니다.",
    },
    {
      id: "q4",
      question: "'use client' 지시어를 배치하는 최적의 위치는?",
      choices: [
        "루트 레이아웃 컴포넌트",
        "모든 컴포넌트 파일",
        "상호작용이 필요한 가장 하위 컴포넌트",
        "데이터 페칭 컴포넌트",
      ],
      correctIndex: 2,
      explanation: "'use client' 경계를 가능한 한 잎사귀 컴포넌트에 두어야 서버 컴포넌트의 이점(번들 크기 절감, 직접 데이터 접근)을 최대화할 수 있습니다.",
    },
    {
      id: "q5",
      question: "서버 컴포넌트가 클라이언트 번들에 포함되지 않는 이유는?",
      choices: [
        "Tree-shaking이 자동으로 제거해서",
        "서버에서 실행 결과만 직렬화되어 전달되기 때문",
        "빌드 도구가 별도로 분리해서",
        "코드 스플리팅이 적용되어서",
      ],
      correctIndex: 1,
      explanation: "서버 컴포넌트는 서버에서 실행되고 그 결과(RSC Payload)만 클라이언트에 전달됩니다. 컴포넌트 코드 자체는 클라이언트로 전송되지 않습니다.",
    },
    {
      id: "q6",
      question: "서버 컴포넌트에서 children으로 클라이언트 컴포넌트를 전달하는 패턴의 장점은?",
      choices: [
        "성능이 항상 향상된다",
        "서버 컴포넌트가 클라이언트 컴포넌트를 import하지 않아도 된다",
        "서버 컴포넌트의 데이터 접근 이점을 유지하면서 클라이언트 컴포넌트를 포함할 수 있다",
        "TypeScript 타입이 더 정확해진다",
      ],
      correctIndex: 2,
      explanation: "children 패턴을 사용하면 서버 컴포넌트가 레이아웃/데이터를 담당하면서도 클라이언트 컴포넌트를 자식으로 포함할 수 있습니다.",
    },
  ],
};

export default chapter;
