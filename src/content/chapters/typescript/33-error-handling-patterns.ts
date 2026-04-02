import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "33-error-handling-patterns",
  subject: "typescript",
  title: "타입 안전 에러 핸들링",
  description:
    "try/catch의 unknown 타입 문제를 이해하고, Result 패턴과 커스텀 에러 클래스로 타입 안전한 에러 처리 전략을 익힙니다.",
  order: 33,
  group: "실전 패턴",
  prerequisites: ["32-strict-mode"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "에러 핸들링은 **택배 배송 시스템**과 같습니다.\n\n" +
        "try/catch 방식은 택배를 일단 보내고, 문제가 생기면 반품 센터(catch)로 돌려보내는 겁니다. 하지만 반품 센터에 도착한 상자에는 '반품'이라고만 적혀 있고, 안에 뭐가 들었는지(에러 타입)는 열어봐야 압니다. TypeScript에서 catch의 error가 `unknown`인 이유가 바로 이것입니다.\n\n" +
        "Result 패턴은 택배에 **배송 추적 시스템**을 붙이는 것입니다. 모든 택배는 '배송 완료(Success)' 또는 '배송 실패(Failure)' 중 하나의 상태를 갖고, 실패 시 정확한 사유(에러 타입)가 기록됩니다. 받는 사람은 택배를 열기 전에 상태를 확인하고, 실패 사유에 따라 다른 대응을 할 수 있습니다.\n\n" +
        "핵심 차이: try/catch는 에러가 **예외(throw)**로 날아오지만, Result 패턴은 에러가 **반환값**으로 돌아옵니다. 반환값은 타입 시스템이 추적할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "JavaScript/TypeScript의 에러 처리에는 타입 안전성 측면에서 근본적인 문제가 있습니다.\n\n" +
        "**1. catch의 error는 unknown 타입**\n" +
        "TypeScript 4.4부터 catch의 매개변수는 `unknown`입니다. `throw`에는 아무 값이나 던질 수 있기 때문입니다. `throw 'error'`, `throw 42`, `throw null` 모두 유효한 JavaScript입니다. 따라서 `error.message`에 바로 접근할 수 없습니다.\n\n" +
        "**2. 함수 시그니처에 에러가 드러나지 않음**\n" +
        "`function fetchUser(id: number): Promise<User>`만 보고는 이 함수가 어떤 에러를 던질 수 있는지 알 수 없습니다. Java의 throws 선언과 달리, TypeScript에는 에러를 시그니처에 명시하는 문법이 없습니다.\n\n" +
        "**3. 에러 처리 누락의 위험**\n" +
        "throw된 에러를 catch하지 않으면 조용히 상위로 전파됩니다. 컴파일러가 '이 에러를 처리하지 않았다'고 경고하지 않으므로, 에러 핸들링 누락을 발견하기 어렵습니다.\n\n" +
        "**4. instanceof의 한계**\n" +
        "라이브러리 경계를 넘으면 `instanceof`가 실패할 수 있습니다. 번들러가 코드를 복제하면 같은 Error 클래스라도 다른 인스턴스로 인식됩니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. instanceof로 에러 타입 좁히기\n" +
        "catch 블록에서 `instanceof`를 사용해 에러 타입을 좁힐 수 있습니다. 커스텀 에러 클래스를 만들면 에러의 종류를 세밀하게 구분할 수 있습니다.\n\n" +
        "### 2. Result<T, E> 판별 유니온 패턴\n" +
        "함수가 에러를 throw하는 대신, 성공/실패를 **반환값**으로 돌려주는 패턴입니다. `{ success: true, data: T } | { success: false, error: E }` 형태의 판별 유니온을 사용하면, 호출자가 반드시 에러 경우를 처리하게 강제할 수 있습니다.\n\n" +
        "### 3. neverthrow 라이브러리\n" +
        "Result 패턴을 체계적으로 지원하는 라이브러리입니다. `ok()`, `err()` 헬퍼와 `map`, `andThen` 등 체이닝 메서드를 제공합니다.\n\n" +
        "### 4. Error cause (ES2022)\n" +
        "`new Error('message', { cause: originalError })`로 에러를 감싸면서 원인을 보존할 수 있습니다. 에러를 재포장할 때 원본 정보를 잃지 않습니다.\n\n" +
        "### 5. 런타임 유효성 검증\n" +
        "Zod, Valibot 등으로 외부 데이터를 검증하면, 파싱 실패를 타입 안전하게 처리할 수 있습니다. `.safeParse()`는 Result 패턴과 동일한 구조를 반환합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Result 패턴과 커스텀 에러",
      content:
        "catch의 unknown 문제를 해결하는 두 가지 핵심 패턴을 구현합니다. 커스텀 에러 클래스로 에러를 세분화하고, Result 타입으로 에러를 반환값으로 다루어 컴파일 타임에 모든 에러 경로를 강제하는 방법을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          "// ===== 커스텀 에러 클래스 =====\n" +
          "class AppError extends Error {\n" +
          "  constructor(\n" +
          "    message: string,\n" +
          "    public readonly code: string,\n" +
          "    public readonly statusCode: number,\n" +
          "    options?: ErrorOptions // ES2022 cause 지원\n" +
          "  ) {\n" +
          "    super(message, options);\n" +
          "    this.name = 'AppError';\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "class NotFoundError extends AppError {\n" +
          "  constructor(resource: string, id: string | number) {\n" +
          "    super(`${resource} #${id} not found`, 'NOT_FOUND', 404);\n" +
          "    this.name = 'NotFoundError';\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "class ValidationError extends AppError {\n" +
          "  constructor(public readonly fields: Record<string, string>) {\n" +
          "    super('Validation failed', 'VALIDATION_ERROR', 400);\n" +
          "    this.name = 'ValidationError';\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// ===== catch에서 타입 좁히기 =====\n" +
          "try {\n" +
          "  await fetchUser(id);\n" +
          "} catch (error: unknown) {\n" +
          "  if (error instanceof NotFoundError) {\n" +
          "    // error: NotFoundError — 타입 좁혀짐\n" +
          "    console.log(error.statusCode); // 404\n" +
          "  } else if (error instanceof ValidationError) {\n" +
          "    // error: ValidationError\n" +
          "    console.log(error.fields);\n" +
          "  } else if (error instanceof Error) {\n" +
          "    // 일반 에러 — cause 활용\n" +
          "    console.log(error.cause);\n" +
          "  } else {\n" +
          "    // string, number 등 비정상 throw\n" +
          "    console.log('Unknown error:', error);\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// ===== Result<T, E> 판별 유니온 =====\n" +
          "type Result<T, E> =\n" +
          "  | { success: true; data: T }\n" +
          "  | { success: false; error: E };\n" +
          "\n" +
          "function ok<T>(data: T): Result<T, never> {\n" +
          "  return { success: true, data };\n" +
          "}\n" +
          "\n" +
          "function err<E>(error: E): Result<never, E> {\n" +
          "  return { success: false, error };\n" +
          "}",
        description:
          "커스텀 에러 클래스로 에러를 세분화하고, Result<T, E> 판별 유니온으로 에러를 반환값으로 안전하게 다룹니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Result 패턴으로 API 호출 래핑",
      content:
        "실무에서 API 호출을 Result 패턴으로 래핑하는 전체 흐름을 구현합니다. throw 대신 반환값으로 에러를 다루면, 호출하는 쪽에서 성공/실패 처리를 반드시 해야 하므로 에러 핸들링 누락을 원천 방지할 수 있습니다.",
      code: {
        language: "typescript",
        code:
          "// ===== 에러 타입 정의 =====\n" +
          "type ApiError =\n" +
          "  | { type: 'NETWORK'; message: string }\n" +
          "  | { type: 'NOT_FOUND'; resource: string }\n" +
          "  | { type: 'VALIDATION'; fields: Record<string, string> }\n" +
          "  | { type: 'UNAUTHORIZED' };\n" +
          "\n" +
          "type Result<T, E> =\n" +
          "  | { success: true; data: T }\n" +
          "  | { success: false; error: E };\n" +
          "\n" +
          "// ===== Result 기반 API 함수 =====\n" +
          "async function fetchUser(\n" +
          "  id: number\n" +
          "): Promise<Result<User, ApiError>> {\n" +
          "  try {\n" +
          "    const res = await fetch(`/api/users/${id}`);\n" +
          "\n" +
          "    if (res.status === 404) {\n" +
          "      return {\n" +
          "        success: false,\n" +
          "        error: { type: 'NOT_FOUND', resource: 'User' },\n" +
          "      };\n" +
          "    }\n" +
          "    if (res.status === 401) {\n" +
          "      return {\n" +
          "        success: false,\n" +
          "        error: { type: 'UNAUTHORIZED' },\n" +
          "      };\n" +
          "    }\n" +
          "\n" +
          "    const data: User = await res.json();\n" +
          "    return { success: true, data };\n" +
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
          "// ===== 호출부: 모든 에러 경로를 처리해야 함 =====\n" +
          "async function handleFetch() {\n" +
          "  const result = await fetchUser(1);\n" +
          "\n" +
          "  if (!result.success) {\n" +
          "    // result.error의 타입: ApiError\n" +
          "    switch (result.error.type) {\n" +
          "      case 'NOT_FOUND':\n" +
          "        showToast(`${result.error.resource}를 찾을 수 없습니다`);\n" +
          "        break;\n" +
          "      case 'UNAUTHORIZED':\n" +
          "        redirectToLogin();\n" +
          "        break;\n" +
          "      case 'NETWORK':\n" +
          "        showToast(`네트워크 에러: ${result.error.message}`);\n" +
          "        break;\n" +
          "      case 'VALIDATION':\n" +
          "        showFieldErrors(result.error.fields);\n" +
          "        break;\n" +
          "    }\n" +
          "    return;\n" +
          "  }\n" +
          "\n" +
          "  // result.data의 타입: User (안전하게 접근)\n" +
          "  console.log(result.data.name);\n" +
          "}",
        description:
          "Result 패턴으로 API 호출을 래핑하면 모든 에러 경로를 switch/case로 빠짐없이 처리할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 장점 | 단점 |\n" +
        "|------|------|------|\n" +
        "| try/catch + instanceof | 기존 패턴과 호환 | 에러 처리 누락 감지 불가 |\n" +
        "| Result<T, E> | 컴파일 타임 강제 | 모든 함수에 래핑 필요 |\n" +
        "| neverthrow | 체이닝 지원 | 외부 의존성 추가 |\n" +
        "| Zod safeParse | 런타임 검증 + 타입 | 검증 로직 작성 필요 |\n\n" +
        "**핵심:** catch의 error는 unknown 타입입니다. instanceof로 좁히거나, Result<T, E> 판별 유니온 패턴으로 에러를 반환값으로 다루면 모든 에러 경로를 컴파일 타임에 강제할 수 있습니다. Error cause로 에러를 재포장할 때 원본 정보를 보존하세요.\n\n" +
        "**다음 챕터 미리보기:** API 응답에 타입을 안전하게 붙이는 패턴을 배웁니다. Zod 스키마로 런타임 검증과 타입 추론을 한번에 해결하고, 제네릭 API 래퍼를 만듭니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "catch의 error는 unknown 타입이다. instanceof로 좁히거나, Result<T, E> 판별 유니온 패턴으로 에러를 반환값으로 다루면 모든 에러 경로를 컴파일 타임에 강제할 수 있다.",
  checklist: [
    "catch의 error가 unknown인 이유를 설명할 수 있다",
    "커스텀 에러 클래스를 만들고 instanceof로 분기할 수 있다",
    "Result<T, E> 판별 유니온 패턴을 구현할 수 있다",
    "Error cause를 활용해 에러를 안전하게 재포장할 수 있다",
    "try/catch와 Result 패턴의 장단점을 비교 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "TypeScript 4.4+에서 catch의 error 매개변수 기본 타입은?",
      choices: ["any", "Error", "unknown", "never"],
      correctIndex: 2,
      explanation:
        "TypeScript 4.4부터 catch의 매개변수는 기본적으로 unknown 타입입니다. throw에는 어떤 값이든 던질 수 있으므로, 안전하게 unknown으로 처리한 후 타입 좁히기를 해야 합니다.",
    },
    {
      id: "q2",
      question: "Result<T, E> 패턴의 가장 큰 장점은?",
      choices: [
        "에러가 자동으로 복구된다",
        "성능이 try/catch보다 좋다",
        "에러 처리를 컴파일 타임에 강제한다",
        "에러 메시지가 자동 생성된다",
      ],
      correctIndex: 2,
      explanation:
        "Result 패턴은 에러를 반환값의 일부로 표현하므로, 호출자가 success 여부를 확인하지 않으면 data에 접근할 수 없습니다. 이로써 에러 처리 누락을 컴파일 타임에 방지합니다.",
    },
    {
      id: "q3",
      question: "Error cause(ES2022)의 사용법으로 올바른 것은?",
      choices: [
        "new Error('msg').cause = original",
        "new Error('msg', { cause: original })",
        "Error.cause('msg', original)",
        "throw new Error('msg').withCause(original)",
      ],
      correctIndex: 1,
      explanation:
        "ES2022의 Error cause는 Error 생성자의 두 번째 인자로 { cause: originalError } 옵션을 전달하여 사용합니다. 이로써 에러를 재포장하면서 원인 에러를 보존할 수 있습니다.",
    },
    {
      id: "q4",
      question:
        "다음 중 throw로 던질 수 없는 것은?",
      choices: [
        "문자열",
        "숫자",
        "null",
        "위 모두 던질 수 있다",
      ],
      correctIndex: 3,
      explanation:
        "JavaScript에서 throw는 어떤 값이든 던질 수 있습니다. throw 'error', throw 42, throw null 모두 유효합니다. 이것이 catch의 error가 unknown 타입인 근본적인 이유입니다.",
    },
    {
      id: "q5",
      question: "Zod의 safeParse가 반환하는 구조와 가장 유사한 패턴은?",
      choices: [
        "try/catch",
        "Promise",
        "Result<T, E>",
        "Optional chaining",
      ],
      correctIndex: 2,
      explanation:
        "Zod의 safeParse()는 { success: true, data } | { success: false, error } 구조를 반환합니다. 이는 Result<T, E> 판별 유니온 패턴과 동일한 구조로, 성공/실패를 타입 안전하게 처리할 수 있습니다.",
    },
  ],
};

export default chapter;
