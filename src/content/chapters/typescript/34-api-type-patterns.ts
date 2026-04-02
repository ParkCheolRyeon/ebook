import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "34-api-type-patterns",
  subject: "typescript",
  title: "API 응답 타이핑 패턴",
  description:
    "외부 API 응답에 타입을 안전하게 붙이는 패턴을 익히고, Zod 스키마를 활용한 런타임 검증과 타입 추론 통합 전략을 학습합니다.",
  order: 34,
  group: "실전 패턴",
  prerequisites: ["33-error-handling-patterns"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "API 응답 타이핑은 **해외 택배 세관 검사**와 같습니다.\n\n" +
        "국내에서 보내는 택배(내부 함수 호출)는 발송인을 신뢰할 수 있어서, 내용물이 선언된 대로라고 믿어도 됩니다. 이것이 TypeScript의 내부 타입 시스템입니다.\n\n" +
        "하지만 해외에서 오는 택배(외부 API 응답)는 다릅니다. 송장에 '전자제품'이라고 적혀 있어도 실제로는 다른 물건이 들어있을 수 있습니다. `as User`로 타입을 단언하는 것은 세관 검사 없이 송장만 믿는 것과 같습니다.\n\n" +
        "Zod 스키마는 **X-ray 검사기**입니다. 택배를 열어서 내용물이 송장과 일치하는지 실제로 확인합니다. 일치하면 통과(타입 추론)시키고, 불일치하면 반려(에러)합니다. `z.infer<typeof schema>`로 검사 기준에서 자동으로 타입을 추출하니, 타입을 이중으로 정의할 필요가 없습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드에서 API 응답을 다룰 때 타입 안전성의 빈틈이 생깁니다.\n\n" +
        "**1. as 타입 단언의 위험**\n" +
        "`const user = await res.json() as User`는 런타임 검증 없이 타입을 강제합니다. 서버가 스키마를 변경해도 컴파일 에러가 발생하지 않고, 런타임에 예상치 못한 곳에서 터집니다.\n\n" +
        "**2. 타입과 검증의 이중 관리**\n" +
        "TypeScript 타입과 런타임 유효성 검증을 별도로 작성하면, 둘의 불일치가 생기기 쉽습니다. User 타입에 필드를 추가했는데 검증 로직은 업데이트하지 않는 실수가 빈번합니다.\n\n" +
        "**3. API 응답 구조의 일관성 부재**\n" +
        "성공 응답, 에러 응답, 페이지네이션 응답 등 API 응답 구조가 엔드포인트마다 다르면, 매번 새로운 타입과 파싱 로직을 작성해야 합니다.\n\n" +
        "**4. 서버-클라이언트 타입 동기화**\n" +
        "백엔드에서 정의한 응답 구조를 프론트엔드에서 수동으로 다시 타이핑하면, 양쪽이 어긋나는 것은 시간 문제입니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. Zod 스키마 = 검증 + 타입 추론\n" +
        "Zod 스키마를 정의하면 `z.infer<typeof schema>`로 TypeScript 타입을 자동 추출할 수 있습니다. 검증과 타입 정의가 하나의 소스(Single Source of Truth)에서 나오므로 불일치가 원천 차단됩니다.\n\n" +
        "### 2. 제네릭 API 응답 타입\n" +
        "`ApiResponse<T>` 같은 제네릭 래퍼를 만들면 모든 엔드포인트의 응답 구조를 통일할 수 있습니다. 성공/실패, 페이지네이션 등 공통 구조를 한번 정의하고 재사용합니다.\n\n" +
        "### 3. 타입 안전 fetch 래퍼\n" +
        "Zod 스키마를 받아서 자동으로 검증하는 fetch 래퍼를 만들면, 모든 API 호출에서 런타임 검증을 강제할 수 있습니다.\n\n" +
        "### 4. OpenAPI → TypeScript 자동 생성\n" +
        "openapi-typescript 같은 도구로 OpenAPI 스펙에서 타입을 자동 생성하면 서버와 클라이언트의 타입이 항상 동기화됩니다.\n\n" +
        "### 5. tRPC: End-to-End 타입 안전\n" +
        "서버와 클라이언트가 모두 TypeScript라면, tRPC로 API 계층의 타입을 자동 공유할 수 있습니다. API 스펙 문서나 코드 생성 없이 서버 함수의 타입이 클라이언트에 그대로 전달됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Zod 스키마 기반 API 타이핑",
      content:
        "Zod 스키마로 API 응답을 검증하고 타입을 추론하는 전체 과정을 구현합니다. 스키마 하나로 런타임 검증과 컴파일 타임 타입을 모두 해결하는 것이 핵심입니다. as 단언 대신 safeParse로 안전하게 데이터를 받는 패턴을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          "import { z } from 'zod';\n" +
          "\n" +
          "// ===== Zod 스키마 정의 (Single Source of Truth) =====\n" +
          "const UserSchema = z.object({\n" +
          "  id: z.number(),\n" +
          "  name: z.string().min(1),\n" +
          "  email: z.string().email(),\n" +
          "  role: z.enum(['admin', 'editor', 'viewer']),\n" +
          "  createdAt: z.string().datetime(),\n" +
          "});\n" +
          "\n" +
          "// 스키마에서 타입 자동 추론 — 별도 interface 불필요!\n" +
          "type User = z.infer<typeof UserSchema>;\n" +
          "// { id: number; name: string; email: string;\n" +
          "//   role: 'admin' | 'editor' | 'viewer'; createdAt: string }\n" +
          "\n" +
          "// ===== 위험: as 타입 단언 =====\n" +
          "async function fetchUserUnsafe(id: number): Promise<User> {\n" +
          "  const res = await fetch(`/api/users/${id}`);\n" +
          "  return await res.json() as User; // ❌ 런타임 검증 없음!\n" +
          "  // 서버가 { name: null }을 보내면? 타입은 string인데 실제론 null\n" +
          "}\n" +
          "\n" +
          "// ===== 안전: Zod safeParse =====\n" +
          "async function fetchUserSafe(id: number) {\n" +
          "  const res = await fetch(`/api/users/${id}`);\n" +
          "  const json = await res.json();\n" +
          "\n" +
          "  const result = UserSchema.safeParse(json);\n" +
          "  if (!result.success) {\n" +
          "    // result.error: ZodError — 어떤 필드가 왜 실패했는지 상세 정보\n" +
          "    console.error('API 응답 검증 실패:', result.error.issues);\n" +
          "    return null;\n" +
          "  }\n" +
          "\n" +
          "  return result.data; // 타입: User (검증 완료!)\n" +
          "}\n" +
          "\n" +
          "// ===== 제네릭 API 응답 구조 =====\n" +
          "const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>\n" +
          "  z.object({\n" +
          "    success: z.literal(true),\n" +
          "    data: dataSchema,\n" +
          "    timestamp: z.string().datetime(),\n" +
          "  });\n" +
          "\n" +
          "const UserResponseSchema = ApiResponseSchema(UserSchema);\n" +
          "type UserResponse = z.infer<typeof UserResponseSchema>;",
        description:
          "Zod 스키마 하나로 런타임 검증과 TypeScript 타입 추론을 동시에 해결합니다. as 단언 대신 safeParse를 사용하세요.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 타입 안전 fetch 래퍼와 tRPC",
      content:
        "재사용 가능한 타입 안전 fetch 래퍼를 구현하고, tRPC의 end-to-end 타입 안전 개념을 살펴봅니다. fetch 래퍼는 Zod 스키마를 받아 자동으로 응답을 검증하므로, 모든 API 호출에서 일관된 타입 안전성을 보장합니다.",
      code: {
        language: "typescript",
        code:
          "import { z } from 'zod';\n" +
          "\n" +
          "// ===== 타입 안전 fetch 래퍼 =====\n" +
          "type Result<T, E> =\n" +
          "  | { success: true; data: T }\n" +
          "  | { success: false; error: E };\n" +
          "\n" +
          "type FetchError =\n" +
          "  | { type: 'NETWORK'; message: string }\n" +
          "  | { type: 'HTTP'; status: number; statusText: string }\n" +
          "  | { type: 'PARSE'; issues: z.ZodIssue[] };\n" +
          "\n" +
          "async function typedFetch<T extends z.ZodType>(\n" +
          "  url: string,\n" +
          "  schema: T,\n" +
          "  init?: RequestInit\n" +
          "): Promise<Result<z.infer<T>, FetchError>> {\n" +
          "  try {\n" +
          "    const res = await fetch(url, init);\n" +
          "\n" +
          "    if (!res.ok) {\n" +
          "      return {\n" +
          "        success: false,\n" +
          "        error: {\n" +
          "          type: 'HTTP',\n" +
          "          status: res.status,\n" +
          "          statusText: res.statusText,\n" +
          "        },\n" +
          "      };\n" +
          "    }\n" +
          "\n" +
          "    const json = await res.json();\n" +
          "    const parsed = schema.safeParse(json);\n" +
          "\n" +
          "    if (!parsed.success) {\n" +
          "      return {\n" +
          "        success: false,\n" +
          "        error: { type: 'PARSE', issues: parsed.error.issues },\n" +
          "      };\n" +
          "    }\n" +
          "\n" +
          "    return { success: true, data: parsed.data };\n" +
          "  } catch (e) {\n" +
          "    return {\n" +
          "      success: false,\n" +
          "      error: {\n" +
          "        type: 'NETWORK',\n" +
          "        message: e instanceof Error ? e.message : 'Unknown',\n" +
          "      },\n" +
          "    };\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// ===== 사용 예 =====\n" +
          "const UserSchema = z.object({\n" +
          "  id: z.number(),\n" +
          "  name: z.string(),\n" +
          "  email: z.string().email(),\n" +
          "});\n" +
          "\n" +
          "const result = await typedFetch('/api/users/1', UserSchema);\n" +
          "if (result.success) {\n" +
          "  console.log(result.data.name); // 타입: string (검증 완료)\n" +
          "}\n" +
          "\n" +
          "// ===== tRPC 개념 (서버-클라이언트 타입 공유) =====\n" +
          "// 서버에서 프로시저 정의\n" +
          "// const appRouter = router({\n" +
          "//   getUser: publicProcedure\n" +
          "//     .input(z.object({ id: z.number() }))\n" +
          "//     .query(async ({ input }) => {\n" +
          "//       return db.user.findUnique({ where: { id: input.id } });\n" +
          "//     }),\n" +
          "// });\n" +
          "//\n" +
          "// 클라이언트에서 타입 자동 추론\n" +
          "// const user = await trpc.getUser.query({ id: 1 });\n" +
          "// user.name; // ✅ 타입 완벽 추론 — API 스펙 문서 불필요",
        description:
          "Zod 기반 fetch 래퍼로 모든 API 호출의 타입 안전성을 보장하고, tRPC로 서버-클라이언트 타입을 자동 공유합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 접근법 | 검증 | 타입 | 자동화 |\n" +
        "|--------|------|------|--------|\n" +
        "| as 단언 | ❌ | ✅ (거짓말) | - |\n" +
        "| Zod safeParse | ✅ | ✅ (z.infer) | 수동 |\n" +
        "| OpenAPI codegen | ❌ | ✅ | 자동 생성 |\n" +
        "| tRPC | ✅ | ✅ | 완전 자동 |\n\n" +
        "**핵심:** 외부 API 응답은 컴파일 타임에 보장되지 않으므로 런타임 검증이 필수입니다. Zod의 `z.infer`로 스키마에서 타입을 추론하면 검증과 타이핑을 한번에 해결합니다. 서버와 클라이언트가 모두 TypeScript라면 tRPC로 end-to-end 타입 안전을 달성할 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** 타입을 먼저 설계하고 구현을 따르게 하는 '타입 주도 개발' 접근을 배웁니다. 불가능한 상태를 타입으로 원천 차단하는 기법과 브랜디드 타입을 실전에 적용합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "외부 API 응답은 컴파일 타임에 보장되지 않으므로 Zod 같은 런타임 검증이 필수다. z.infer로 스키마에서 타입을 추론하면 검증과 타이핑을 한번에 해결한다.",
  checklist: [
    "as 타입 단언이 위험한 이유를 설명할 수 있다",
    "Zod 스키마에서 z.infer로 타입을 추론하는 방법을 안다",
    "safeParse로 API 응답을 안전하게 검증할 수 있다",
    "제네릭 API 응답 타입을 설계할 수 있다",
    "tRPC의 end-to-end 타입 안전 개념을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "res.json() as User가 위험한 이유는?",
      choices: [
        "성능이 느려진다",
        "런타임 검증 없이 타입만 강제한다",
        "TypeScript가 에러를 발생시킨다",
        "브라우저 호환성 문제가 있다",
      ],
      correctIndex: 1,
      explanation:
        "as 타입 단언은 컴파일러에게 '이 값은 User야'라고 알려주지만, 실제 런타임 값은 검증하지 않습니다. 서버가 다른 구조를 보내면 타입과 실제 값이 불일치하여 예상치 못한 곳에서 에러가 발생합니다.",
    },
    {
      id: "q2",
      question: "z.infer<typeof UserSchema>가 하는 일은?",
      choices: [
        "런타임에 타입을 검사한다",
        "Zod 스키마에서 TypeScript 타입을 추론한다",
        "스키마를 JSON으로 변환한다",
        "API를 자동 호출한다",
      ],
      correctIndex: 1,
      explanation:
        "z.infer는 Zod 스키마의 구조를 분석하여 해당하는 TypeScript 타입을 컴파일 타임에 추론합니다. 이로써 스키마 하나로 검증과 타입 정의를 동시에 해결합니다.",
    },
    {
      id: "q3",
      question: "safeParse와 parse의 차이는?",
      choices: [
        "safeParse가 더 느리다",
        "parse는 성공/실패 객체를 반환하고 safeParse는 예외를 던진다",
        "safeParse는 성공/실패 객체를 반환하고 parse는 예외를 던진다",
        "차이가 없다",
      ],
      correctIndex: 2,
      explanation:
        "safeParse는 { success, data/error } 객체를 반환하여 에러를 값으로 다룹니다. parse는 검증 실패 시 ZodError를 throw합니다. Result 패턴과의 일관성을 위해 safeParse가 권장됩니다.",
    },
    {
      id: "q4",
      question: "tRPC의 핵심 가치는?",
      choices: [
        "REST API보다 빠른 성능",
        "서버-클라이언트 간 end-to-end 타입 안전",
        "자동 API 문서 생성",
        "GraphQL 대체",
      ],
      correctIndex: 1,
      explanation:
        "tRPC는 서버에서 정의한 프로시저의 타입이 클라이언트에 자동으로 전달됩니다. API 스펙 문서나 코드 생성 없이 서버 함수의 입출력 타입을 클라이언트에서 그대로 추론할 수 있습니다.",
    },
    {
      id: "q5",
      question:
        "OpenAPI → TypeScript 코드 생성의 한계는?",
      choices: [
        "TypeScript 타입만 생성하고 런타임 검증은 없다",
        "JavaScript에서 사용할 수 없다",
        "REST API에만 적용 가능하다",
        "타입이 정확하지 않다",
      ],
      correctIndex: 0,
      explanation:
        "OpenAPI 코드 생성은 TypeScript 타입 정의를 자동 생성하지만, 런타임 검증 코드는 포함하지 않습니다. 실제 API 응답이 스펙과 다를 경우를 대비하려면 Zod 등의 런타임 검증을 추가로 적용해야 합니다.",
    },
  ],
};

export default chapter;
