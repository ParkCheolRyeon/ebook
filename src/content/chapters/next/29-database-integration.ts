import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "29-database-integration",
  subject: "next",
  title: "데이터베이스 연동",
  description:
    "Next.js의 풀스택 특성을 활용한 Prisma ORM 설정, Server Components에서의 직접 DB 쿼리, 커넥션 풀링(싱글톤 패턴), Serverless 환경의 DB 연결 전략을 학습합니다.",
  order: 29,
  group: "API와 백엔드",
  prerequisites: ["28-route-handlers"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "데이터베이스 연동은 **레스토랑의 주방과 식재료 창고**의 관계와 같습니다.\n\n" +
        "기존 React(SPA) 방식은 손님(브라우저)이 직접 창고(DB)에 갈 수 없어서, " +
        "반드시 중간 배달원(별도 API 서버)을 통해야 했습니다. " +
        "손님 → 배달원(API 서버) → 창고(DB) → 배달원 → 손님의 긴 여정이 필요했죠.\n\n" +
        "Next.js의 Server Components는 **주방(서버)에서 직접 창고에 갈 수 있는** 시스템입니다. " +
        "주방장(Server Component)이 직접 식재료를 가져와 요리하고, 완성된 음식만 손님에게 전달합니다. " +
        "중간 배달원이 필요 없어서 더 빠르고 간단합니다.\n\n" +
        "하지만 문제가 있습니다. **서버리스 환경**은 주방이 주문이 올 때마다 " +
        "새로 열리고 닫히는 **팝업 레스토랑**과 같습니다. 주문마다 창고(DB)와 새 연결을 맺으면 " +
        "금방 연결이 포화됩니다. **커넥션 풀링**은 미리 창고와의 통로를 여러 개 만들어 두고 " +
        "주방이 열릴 때마다 빈 통로를 재사용하는 것입니다. 이것이 싱글톤 패턴과 " +
        "Prisma Accelerate 같은 서비스가 필요한 이유입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "Next.js에서 데이터베이스를 연동할 때 **간과하기 쉬운 문제들**이 있습니다.\n\n" +
        "### 1. 커넥션 폭증 (개발 환경)\n" +
        "Next.js 개발 서버는 Hot Module Replacement(HMR)로 모듈을 자주 재로드합니다. " +
        "매번 새 PrismaClient 인스턴스가 생성되면 DB 커넥션이 빠르게 고갈됩니다. " +
        "'Too many connections' 에러의 주범입니다.\n\n" +
        "### 2. 서버리스 환경의 커넥션 한계\n" +
        "Vercel, AWS Lambda 등 서버리스 환경에서는 각 함수 인스턴스가 독립적으로 DB에 연결합니다. " +
        "트래픽이 늘면 수십~수백 개의 연결이 동시에 생성되어 DB가 과부하됩니다.\n\n" +
        "### 3. ORM 설정의 복잡성\n" +
        "Prisma 스키마 정의, 마이그레이션 관리, 시딩 데이터 생성 등 " +
        "초기 설정 단계가 많아서 올바른 순서를 알지 못하면 헤맬 수 있습니다.\n\n" +
        "### 4. 타입 안전성 확보\n" +
        "DB 쿼리 결과의 타입이 자동으로 추론되지 않으면, " +
        "런타임 에러가 발생하기 쉽습니다. TypeScript와 ORM의 타입 통합이 중요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "**Prisma ORM**을 중심으로 Next.js의 풀스택 DB 연동 패턴을 구축합니다.\n\n" +
        "### 1. Prisma ORM\n" +
        "스키마 기반 타입 안전 ORM입니다. `prisma/schema.prisma`에 모델을 정의하면 " +
        "TypeScript 타입이 자동 생성됩니다. `prisma.user.findMany()` 같은 쿼리가 " +
        "타입 안전하게 자동완성됩니다.\n\n" +
        "### 2. 싱글톤 패턴 (커넥션 풀링)\n" +
        "`globalThis`에 PrismaClient 인스턴스를 저장하여 HMR에서도 단일 인스턴스를 유지합니다. " +
        "개발 환경에서의 커넥션 폭증을 방지합니다.\n\n" +
        "### 3. 서버리스 최적화\n" +
        "- **Prisma Accelerate**: 커넥션 풀링 프록시 서비스\n" +
        "- **Neon Serverless**: WebSocket 기반 서버리스 전용 PostgreSQL\n" +
        "- **PlanetScale**: MySQL 호환 서버리스 DB\n\n" +
        "### 4. Server Components에서 직접 쿼리\n" +
        "별도 API 엔드포인트 없이 Server Components에서 바로 `prisma.post.findMany()`를 호출합니다. " +
        "코드가 간결하고, API 계층이 사라져서 성능도 좋습니다.\n\n" +
        "### 5. Drizzle ORM 대안\n" +
        "SQL에 가까운 문법을 선호한다면 Drizzle ORM도 좋은 대안입니다. " +
        "더 가벼우며 Edge Runtime과의 호환성이 좋습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Prisma 설정과 싱글톤 패턴",
      content:
        "Prisma 스키마 정의부터 싱글톤 패턴 적용, " +
        "Server Components에서의 DB 쿼리까지 전체 흐름을 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// === prisma/schema.prisma ===\n' +
          '// generator client {\n' +
          '//   provider = "prisma-client-js"\n' +
          '// }\n' +
          '// \n' +
          '// datasource db {\n' +
          '//   provider = "postgresql"\n' +
          '//   url      = env("DATABASE_URL")\n' +
          '// }\n' +
          '// \n' +
          '// model User {\n' +
          '//   id        String   @id @default(cuid())\n' +
          '//   name      String\n' +
          '//   email     String   @unique\n' +
          '//   posts     Post[]\n' +
          '//   createdAt DateTime @default(now())\n' +
          '// }\n' +
          '// \n' +
          '// model Post {\n' +
          '//   id        String   @id @default(cuid())\n' +
          '//   title     String\n' +
          '//   content   String?\n' +
          '//   published Boolean  @default(false)\n' +
          '//   author    User     @relation(fields: [authorId], references: [id])\n' +
          '//   authorId  String\n' +
          '//   createdAt DateTime @default(now())\n' +
          '// }\n\n' +
          '// === lib/prisma.ts (싱글톤 패턴) ===\n' +
          'import "server-only";\n' +
          'import { PrismaClient } from "@prisma/client";\n\n' +
          'const globalForPrisma = globalThis as unknown as {\n' +
          '  prisma: PrismaClient | undefined;\n' +
          '};\n\n' +
          'export const prisma =\n' +
          '  globalForPrisma.prisma ??\n' +
          '  new PrismaClient({\n' +
          '    log:\n' +
          '      process.env.NODE_ENV === "development"\n' +
          '        ? ["query", "error", "warn"]\n' +
          '        : ["error"],\n' +
          '  });\n\n' +
          '// 개발 환경에서만 globalThis에 저장 (HMR 대응)\n' +
          'if (process.env.NODE_ENV !== "production") {\n' +
          '  globalForPrisma.prisma = prisma;\n' +
          '}\n\n' +
          '// === 초기 설정 명령어 (터미널) ===\n' +
          '// npx prisma init           → prisma/ 디렉토리 생성\n' +
          '// npx prisma migrate dev    → 마이그레이션 실행\n' +
          '// npx prisma generate       → 타입 생성\n' +
          '// npx prisma studio         → GUI DB 관리자\n' +
          '// npx prisma db seed        → 시드 데이터 삽입',
        description:
          "Prisma 스키마로 모델을 정의하고, globalThis 싱글톤 패턴으로 개발 환경의 커넥션 폭증을 방지합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Server Components에서 CRUD 구현",
      content:
        "Server Components에서 직접 Prisma로 DB 쿼리를 실행하고, " +
        "Server Actions로 데이터를 생성/수정/삭제하는 풀스택 CRUD를 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// === app/posts/page.tsx (목록 조회 — Server Component) ===\n' +
          'import { prisma } from "@/lib/prisma";\n' +
          'import Link from "next/link";\n' +
          'import { CreatePostForm } from "./create-form";\n\n' +
          'export default async function PostsPage() {\n' +
          '  // Server Component에서 직접 DB 쿼리 — API 엔드포인트 불필요!\n' +
          '  const posts = await prisma.post.findMany({\n' +
          '    include: { author: { select: { name: true } } },\n' +
          '    orderBy: { createdAt: "desc" },\n' +
          '  });\n\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <h1>게시글 목록</h1>\n' +
          '      <CreatePostForm />\n' +
          '      <ul>\n' +
          '        {posts.map((post) => (\n' +
          '          <li key={post.id}>\n' +
          '            <Link href={`/posts/${post.id}`}>\n' +
          '              {post.title} — {post.author.name}\n' +
          '            </Link>\n' +
          '          </li>\n' +
          '        ))}\n' +
          '      </ul>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// === actions/post-actions.ts (Server Actions) ===\n' +
          '"use server";\n' +
          'import { prisma } from "@/lib/prisma";\n' +
          'import { auth } from "@/auth";\n' +
          'import { revalidatePath } from "next/cache";\n\n' +
          'export async function createPost(formData: FormData) {\n' +
          '  const session = await auth();\n' +
          '  if (!session?.user?.id) throw new Error("로그인 필요");\n\n' +
          '  const title = formData.get("title") as string;\n' +
          '  const content = formData.get("content") as string;\n\n' +
          '  await prisma.post.create({\n' +
          '    data: {\n' +
          '      title,\n' +
          '      content,\n' +
          '      authorId: session.user.id,\n' +
          '    },\n' +
          '  });\n\n' +
          '  revalidatePath("/posts"); // 캐시 무효화 → 목록 갱신\n' +
          '}\n\n' +
          'export async function deletePost(postId: string) {\n' +
          '  const session = await auth();\n' +
          '  if (!session?.user?.id) throw new Error("로그인 필요");\n\n' +
          '  // 작성자 본인만 삭제 가능\n' +
          '  const post = await prisma.post.findUnique({\n' +
          '    where: { id: postId },\n' +
          '  });\n\n' +
          '  if (post?.authorId !== session.user.id) {\n' +
          '    throw new Error("삭제 권한이 없습니다");\n' +
          '  }\n\n' +
          '  await prisma.post.delete({ where: { id: postId } });\n' +
          '  revalidatePath("/posts");\n' +
          '}',
        description:
          "Server Component에서 prisma로 직접 DB를 조회하고, Server Action에서 생성/삭제 + revalidatePath로 캐시를 갱신합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| Prisma ORM | 스키마 기반 타입 안전 ORM, 자동 타입 생성 |\n" +
        "| 싱글톤 패턴 | globalThis로 PrismaClient 단일 인스턴스 유지 |\n" +
        "| Server Component DB 쿼리 | API 없이 서버에서 직접 DB 접근 |\n" +
        "| 커넥션 풀링 | 서버리스 환경의 DB 연결 관리 |\n" +
        "| Prisma Accelerate | 커넥션 풀링 프록시 서비스 |\n" +
        "| Drizzle ORM | SQL에 가까운 경량 ORM 대안 |\n" +
        "| 마이그레이션 | prisma migrate dev로 스키마 변경 적용 |\n\n" +
        "**핵심:** Server Components에서 Prisma로 DB에 직접 접근할 수 있습니다. " +
        "서버리스 환경에서는 싱글톤 패턴과 커넥션 풀링이 필수입니다.\n\n" +
        "**다음 챕터 미리보기:** 외부 API 통합을 다룹니다. " +
        "서버에서 API 키를 보호하며 외부 서비스를 호출하고, BFF 패턴으로 클라이언트를 보호하는 방법을 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Server Components에서 Prisma 같은 ORM으로 DB에 직접 접근할 수 있다. Serverless 환경에서는 커넥션 풀링(싱글톤 패턴)이 필수이며, Prisma Accelerate나 Neon 같은 서버리스 DB가 궁합이 좋다.",
  checklist: [
    "Prisma 스키마를 정의하고 마이그레이션을 실행할 수 있다",
    "globalThis 싱글톤 패턴으로 PrismaClient를 설정할 수 있다",
    "Server Components에서 API 없이 직접 DB 쿼리를 실행할 수 있다",
    "서버리스 환경의 커넥션 풀링 문제와 해결 방법을 설명할 수 있다",
    "Server Actions에서 DB 변경 후 revalidatePath로 캐시를 갱신할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Next.js 개발 환경에서 PrismaClient 싱글톤 패턴이 필요한 이유는?",
      choices: [
        "Prisma가 싱글톤 없이 작동하지 않아서",
        "성능 최적화를 위해",
        "HMR로 모듈이 재로드될 때마다 새 커넥션이 생성되는 것을 방지하기 위해",
        "TypeScript 타입 생성을 위해",
      ],
      correctIndex: 2,
      explanation:
        "Next.js 개발 서버의 Hot Module Replacement(HMR)는 파일 변경 시 모듈을 재로드합니다. 매번 새 PrismaClient가 생성되면 DB 커넥션이 빠르게 고갈되므로, globalThis에 인스턴스를 저장하여 재사용합니다.",
    },
    {
      id: "q2",
      question: "Server Components에서 데이터베이스에 접근하는 방법으로 올바른 것은?",
      choices: [
        "반드시 API 엔드포인트를 통해 fetch로 접근해야 한다",
        "useEffect에서 DB 클라이언트를 호출한다",
        "Server Component 내에서 Prisma 등 ORM으로 직접 쿼리할 수 있다",
        "클라이언트 컴포넌트에서 DB에 직접 연결한다",
      ],
      correctIndex: 2,
      explanation:
        "Server Components는 서버에서 실행되므로 Prisma 같은 ORM으로 DB에 직접 접근할 수 있습니다. 별도의 API 엔드포인트가 필요 없어 코드가 간결해집니다.",
    },
    {
      id: "q3",
      question: "서버리스 환경(Vercel)에서 DB 커넥션 문제를 해결하는 방법은?",
      choices: [
        "PrismaClient 인스턴스를 더 많이 생성한다",
        "Prisma Accelerate나 Neon 같은 커넥션 풀링 서비스를 사용한다",
        "DB 연결 타임아웃을 무한으로 설정한다",
        "모든 쿼리를 클라이언트에서 실행한다",
      ],
      correctIndex: 1,
      explanation:
        "서버리스 함수는 독립적으로 실행되어 각각 DB 연결을 맺습니다. Prisma Accelerate, Neon, PlanetScale 같은 서비스가 커넥션 풀링을 제공하여 이 문제를 해결합니다.",
    },
    {
      id: "q4",
      question: "Prisma에서 스키마 변경 후 실행해야 하는 명령어는?",
      choices: [
        "npx prisma init",
        "npx prisma generate",
        "npx prisma migrate dev",
        "npx prisma studio",
      ],
      correctIndex: 2,
      explanation:
        "스키마 변경 후 npx prisma migrate dev를 실행하면 마이그레이션 파일이 생성되고 DB에 적용됩니다. npx prisma generate는 타입만 재생성합니다.",
    },
    {
      id: "q5",
      question: "Drizzle ORM이 Prisma의 대안으로 적합한 경우는?",
      choices: [
        "GraphQL을 사용하는 프로젝트",
        "SQL에 가까운 문법을 선호하고 Edge Runtime 호환이 필요한 경우",
        "MongoDB를 사용하는 프로젝트",
        "클라이언트 측에서 DB에 접근해야 하는 경우",
      ],
      correctIndex: 1,
      explanation:
        "Drizzle ORM은 SQL에 가까운 문법을 제공하며, 번들 크기가 작고 Edge Runtime과의 호환성이 좋습니다. SQL을 직접 작성하는 것을 선호하는 개발자에게 적합합니다.",
    },
  ],
};

export default chapter;
