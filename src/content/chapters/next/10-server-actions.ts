import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "10-server-actions",
  subject: "next",
  title: "Server Actions",
  description:
    "\"use server\" 지시어와 Server Actions의 동작 원리, form action 연동, 점진적 향상, useActionState/useFormStatus 훅, 캐시 무효화 패턴을 학습합니다.",
  order: 10,
  group: "서버와 클라이언트",
  prerequisites: ["09-server-client-composition"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Server Actions는 **은행 창구의 업무 처리 시스템**과 같습니다.\n\n" +
        "기존 방식(API 라우트)은 은행에 가서 번호표를 뽑고, 대기하고, 창구에서 서류를 작성하고, 다시 대기하는 과정이었습니다. 고객(클라이언트)이 별도의 통신 채널(fetch + API 엔드포인트)을 통해 은행(서버)과 소통해야 했죠.\n\n" +
        "Server Actions는 **창구 직원이 고객 옆에 앉아있는 것**과 같습니다. '이 서류를 처리해주세요'라고 하면 직원이 바로 뒤편 금고(DB)로 가서 처리하고 결과를 알려줍니다. 별도의 번호표(API 엔드포인트)가 필요 없습니다.\n\n" +
        "더 놀라운 점은 **점진적 향상(Progressive Enhancement)**입니다. 만약 전자 시스템(JavaScript)이 고장나도, 종이 서류(HTML form)만으로도 업무가 처리됩니다. JavaScript가 없어도 form 제출이 동작합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React 애플리케이션에서 서버 데이터를 변경(mutation)하려면 여러 보일러플레이트가 필요했습니다.\n\n" +
        "1. **API 엔드포인트 작성** — 간단한 form 제출에도 `/api/posts` 같은 API 라우트를 만들어야 합니다. 요청 파싱, 유효성 검증, 에러 처리를 모두 직접 구현해야 합니다.\n\n" +
        "2. **클라이언트 상태 관리** — 로딩 상태(`isLoading`), 에러 상태(`error`), 성공 처리를 `useState`와 `try/catch`로 관리합니다. 비슷한 패턴이 모든 form에서 반복됩니다.\n\n" +
        "3. **낙관적 업데이트와 캐시 동기화** — 서버 mutation 후 클라이언트 캐시를 수동으로 무효화하거나 업데이트해야 합니다. React Query 같은 외부 라이브러리에 의존하는 경우가 많습니다.\n\n" +
        "4. **JavaScript 의존성** — 기존 SPA 방식에서는 JavaScript가 로드되지 않으면 form이 전혀 동작하지 않습니다. 접근성과 안정성 면에서 문제가 됩니다.\n\n" +
        "5. **CSRF 보안** — 별도의 CSRF 토큰 관리가 필요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Server Actions는 `\"use server\"` 지시어로 표시된 서버 함수를 form action이나 이벤트 핸들러에서 직접 호출할 수 있게 합니다.\n\n" +
        "### 1. \"use server\" 지시어\n" +
        "함수 본문 최상단 또는 파일 최상단에 `\"use server\"`를 선언합니다. 이 함수는 서버에서만 실행되며, 클라이언트에서는 자동 생성된 HTTP 엔드포인트를 통해 호출됩니다.\n\n" +
        "### 2. form action 연동\n" +
        "`<form action={serverFunction}>`으로 Server Action을 직접 연결합니다. `FormData`가 자동으로 전달되며, JavaScript 없이도 HTML form 제출로 동작합니다(점진적 향상).\n\n" +
        "### 3. useActionState와 useFormStatus\n" +
        "- `useActionState`: 액션의 결과 상태(성공/에러)와 pending 상태를 관리합니다\n" +
        "- `useFormStatus`: form 제출 중인지 여부를 자식 컴포넌트에서 확인합니다\n\n" +
        "### 4. 캐시 무효화\n" +
        "- `revalidatePath('/posts')`: 특정 경로의 캐시를 무효화합니다\n" +
        "- `revalidateTag('posts')`: 특정 태그의 데이터 캐시를 무효화합니다\n\n" +
        "### 5. 보안\n" +
        "Next.js가 CSRF 보호를 내장하고 있어 별도의 토큰 관리가 불필요합니다. Server Action은 POST 요청으로만 호출됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Server Action과 form 연동",
      content:
        "게시글 작성 form을 Server Action으로 구현합니다. 별도의 API 라우트 없이 form에서 직접 서버 함수를 호출하고, 유효성 검증과 캐시 무효화까지 처리합니다.",
      code: {
        language: "typescript",
        code:
          '// app/actions/post.ts\n' +
          '"use server";\n' +
          '\n' +
          'import { db } from "@/lib/database";\n' +
          'import { revalidatePath } from "next/cache";\n' +
          'import { redirect } from "next/navigation";\n' +
          'import { z } from "zod";\n' +
          '\n' +
          'const PostSchema = z.object({\n' +
          '  title: z.string().min(1, "제목을 입력하세요").max(100),\n' +
          '  content: z.string().min(10, "내용을 10자 이상 입력하세요"),\n' +
          '});\n' +
          '\n' +
          'export type ActionState = {\n' +
          '  errors?: { title?: string[]; content?: string[] };\n' +
          '  message?: string;\n' +
          '};\n' +
          '\n' +
          'export async function createPost(\n' +
          '  prevState: ActionState,\n' +
          '  formData: FormData\n' +
          '): Promise<ActionState> {\n' +
          '  // 1. 유효성 검증\n' +
          '  const result = PostSchema.safeParse({\n' +
          '    title: formData.get("title"),\n' +
          '    content: formData.get("content"),\n' +
          '  });\n' +
          '\n' +
          '  if (!result.success) {\n' +
          '    return { errors: result.error.flatten().fieldErrors };\n' +
          '  }\n' +
          '\n' +
          '  // 2. DB에 저장\n' +
          '  await db.post.create({\n' +
          '    data: {\n' +
          '      title: result.data.title,\n' +
          '      content: result.data.content,\n' +
          '    },\n' +
          '  });\n' +
          '\n' +
          '  // 3. 캐시 무효화\n' +
          '  revalidatePath("/posts");\n' +
          '\n' +
          '  // 4. 리다이렉트\n' +
          '  redirect("/posts");\n' +
          '}\n' +
          '\n' +
          '// app/posts/new/page.tsx (Server Component)\n' +
          'import { CreatePostForm } from "./form";\n' +
          '\n' +
          'export default function NewPostPage() {\n' +
          '  return (\n' +
          '    <main>\n' +
          '      <h1>새 게시글 작성</h1>\n' +
          '      <CreatePostForm />\n' +
          '    </main>\n' +
          '  );\n' +
          '}',
        description:
          "\"use server\" 파일에서 서버 함수를 정의하고, Zod로 유효성을 검증하며, revalidatePath로 캐시를 무효화합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: useActionState와 useFormStatus 활용",
      content:
        "Server Action을 호출하는 form의 로딩 상태와 에러 상태를 useActionState와 useFormStatus 훅으로 관리합니다. useActionState는 액션의 반환값을 상태로 관리하고, useFormStatus는 form 제출 진행 여부를 자식 컴포넌트에서 확인합니다.",
      code: {
        language: "typescript",
        code:
          '// app/posts/new/form.tsx\n' +
          '"use client";\n' +
          '\n' +
          'import { useActionState } from "react";\n' +
          'import { useFormStatus } from "react-dom";\n' +
          'import { createPost, type ActionState } from "@/app/actions/post";\n' +
          '\n' +
          '// useFormStatus는 form 내부의 자식 컴포넌트에서 사용\n' +
          'function SubmitButton() {\n' +
          '  const { pending } = useFormStatus();\n' +
          '\n' +
          '  return (\n' +
          '    <button type="submit" disabled={pending}>\n' +
          '      {pending ? "저장 중..." : "게시글 작성"}\n' +
          '    </button>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          'export function CreatePostForm() {\n' +
          '  const initialState: ActionState = {};\n' +
          '  // useActionState: [현재상태, 디스패치함수, isPending]\n' +
          '  const [state, formAction, isPending] = useActionState(\n' +
          '    createPost,\n' +
          '    initialState\n' +
          '  );\n' +
          '\n' +
          '  return (\n' +
          '    <form action={formAction}>\n' +
          '      <div>\n' +
          '        <label htmlFor="title">제목</label>\n' +
          '        <input\n' +
          '          id="title"\n' +
          '          name="title"\n' +
          '          type="text"\n' +
          '          required\n' +
          '          aria-describedby="title-error"\n' +
          '        />\n' +
          '        {state.errors?.title && (\n' +
          '          <p id="title-error" role="alert">\n' +
          '            {state.errors.title[0]}\n' +
          '          </p>\n' +
          '        )}\n' +
          '      </div>\n' +
          '\n' +
          '      <div>\n' +
          '        <label htmlFor="content">내용</label>\n' +
          '        <textarea\n' +
          '          id="content"\n' +
          '          name="content"\n' +
          '          required\n' +
          '          rows={5}\n' +
          '          aria-describedby="content-error"\n' +
          '        />\n' +
          '        {state.errors?.content && (\n' +
          '          <p id="content-error" role="alert">\n' +
          '            {state.errors.content[0]}\n' +
          '          </p>\n' +
          '        )}\n' +
          '      </div>\n' +
          '\n' +
          '      {state.message && <p role="alert">{state.message}</p>}\n' +
          '\n' +
          '      <SubmitButton />\n' +
          '    </form>\n' +
          '  );\n' +
          '}',
        description:
          "useActionState로 서버 액션의 결과를 상태로 관리하고, useFormStatus로 제출 진행 상태를 표시합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| \"use server\" | 서버에서만 실행되는 함수를 선언하는 지시어 |\n" +
        "| form action | Server Action을 form에 직접 연결 |\n" +
        "| 점진적 향상 | JavaScript 없이도 HTML form 제출로 동작 |\n" +
        "| useActionState | 액션 결과 상태와 pending 관리 |\n" +
        "| useFormStatus | form 제출 진행 여부 확인 (자식에서 사용) |\n" +
        "| revalidatePath/Tag | 서버 mutation 후 캐시 무효화 |\n\n" +
        "**핵심:** Server Actions는 API 엔드포인트 없이 서버 함수를 form이나 이벤트에서 직접 호출합니다. 유효성 검증, 캐시 무효화, CSRF 보호까지 통합된 서버 mutation 솔루션입니다.\n\n" +
        "**다음 챕터 미리보기:** Server Component에서 데이터를 효율적으로 가져오는 패턴과 워터폴 방지 전략을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Server Actions는 서버에서 실행되는 함수를 form action이나 이벤트 핸들러에서 직접 호출할 수 있게 한다. API 엔드포인트를 만들지 않고도 서버 mutation을 처리한다.",
  checklist: [
    "\"use server\" 지시어의 역할과 사용 위치를 이해한다",
    "form action으로 Server Action을 연결할 수 있다",
    "useActionState와 useFormStatus의 차이와 사용법을 안다",
    "revalidatePath/revalidateTag로 캐시를 무효화할 수 있다",
    "점진적 향상(Progressive Enhancement)의 의미를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Server Action의 주요 역할은?",
      choices: [
        "클라이언트에서 데이터를 캐싱한다",
        "API 엔드포인트 없이 서버 mutation을 처리한다",
        "정적 사이트를 생성한다",
        "CSS를 서버에서 처리한다",
      ],
      correctIndex: 1,
      explanation:
        "Server Actions는 별도의 API 엔드포인트를 만들지 않고 서버에서 실행되는 함수를 form action이나 이벤트 핸들러에서 직접 호출하여 데이터 mutation을 처리합니다.",
    },
    {
      id: "q2",
      question:
        "Server Action에서 점진적 향상(Progressive Enhancement)이란?",
      choices: [
        "성능이 점차 개선되는 것",
        "JavaScript가 로드되지 않아도 form이 동작하는 것",
        "서버가 점진적으로 응답하는 것",
        "컴포넌트가 점진적으로 렌더링되는 것",
      ],
      correctIndex: 1,
      explanation:
        "점진적 향상은 JavaScript가 로드되지 않아도 HTML form의 기본 제출 메커니즘으로 Server Action이 동작하는 것을 의미합니다.",
    },
    {
      id: "q3",
      question: "useFormStatus는 어디에서 사용해야 하나?",
      choices: [
        "form 태그가 있는 컴포넌트에서",
        "form 내부의 자식 컴포넌트에서",
        "Server Component에서",
        "어디에서든 사용 가능",
      ],
      correctIndex: 1,
      explanation:
        "useFormStatus는 form 태그의 자식 컴포넌트에서만 동작합니다. form 태그가 있는 같은 컴포넌트가 아닌, 그 내부에 렌더링되는 자식 컴포넌트에서 사용해야 합니다.",
    },
    {
      id: "q4",
      question:
        "Server Action 실행 후 캐시를 무효화하는 방법은?",
      choices: [
        "cache.clear()를 호출한다",
        "revalidatePath 또는 revalidateTag를 호출한다",
        "브라우저 캐시를 수동으로 지운다",
        "페이지를 새로고침한다",
      ],
      correctIndex: 1,
      explanation:
        "revalidatePath('/path')로 특정 경로의 캐시를, revalidateTag('tag')로 특정 태그와 연결된 데이터 캐시를 무효화할 수 있습니다.",
    },
    {
      id: "q5",
      question:
        "\"use server\"를 선언할 수 있는 위치는?",
      choices: [
        "클라이언트 컴포넌트 내부",
        "파일 최상단 또는 async 함수 본문 최상단",
        "import 문 다음에만",
        "export 문에만",
      ],
      correctIndex: 1,
      explanation:
        "\"use server\"는 파일 최상단에 선언하여 파일 내 모든 export를 Server Action으로 만들거나, 개별 async 함수 본문의 최상단에 선언할 수 있습니다.",
    },
  ],
};

export default chapter;
