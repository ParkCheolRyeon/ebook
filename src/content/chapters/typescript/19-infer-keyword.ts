import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "19-infer-keyword",
  subject: "typescript",
  title: "infer 키워드",
  description:
    "Conditional Type 내에서 infer 키워드를 사용하여 타입을 추출하는 고급 패턴을 학습합니다.",
  order: 19,
  group: "고급 타입",
  prerequisites: ["18-template-literal-types"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "infer는 **세관 검사관**과 같습니다.\n\n" +
        "공항 세관에서 검사관은 짐(타입)을 열어보고 내용물을 확인합니다. 여행가방이 `Promise<string>`이라면, 검사관은 가방을 열어 안에 `string`이 있다는 것을 '추출'해냅니다. 함수라는 가방이 들어오면 매개변수와 반환값을 꺼내 기록합니다.\n\n" +
        "중요한 것은 검사관이 **가방이 특정 형태일 때만** 내용물을 추출한다는 점입니다. `T extends Promise<infer U> ? U : never` — 이 패턴은 'T가 Promise 형태인 경우에만 안의 타입 U를 꺼내라'는 뜻입니다. 가방이 Promise가 아니면? 검사관은 never를 반환합니다.\n\n" +
        "세관 검사관이 다양한 종류의 짐을 처리하듯, infer는 함수의 반환 타입, 배열의 요소 타입, Promise의 내부 타입, 심지어 문자열 패턴에서도 타입을 캡처할 수 있습니다. Conditional Type이라는 검사 절차 안에서만 작동하는 강력한 추출 도구입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "복잡한 타입에서 내부에 감싸진 타입을 꺼내야 하는 상황은 실무에서 빈번합니다.\n\n" +
        "**1. 함수의 반환 타입 추출**\n" +
        "서드파티 라이브러리의 함수가 반환하는 타입을 사용하고 싶은데, 해당 타입이 export되지 않았습니다. 함수는 있지만 반환 타입만 따로 참조할 방법이 없습니다.\n\n" +
        "**2. Promise 내부 타입 접근**\n" +
        "API 호출 함수가 `Promise<ApiResponse>`를 반환할 때, `ApiResponse` 타입에 직접 접근할 수 없는 경우가 있습니다. async/await의 결과 타입을 명시적으로 표현해야 할 때 곤란해집니다.\n\n" +
        "**3. 배열 요소 타입 추출**\n" +
        "`User[]` 배열에서 개별 `User` 타입을 추출하고 싶을 때, `User`가 별도로 export되지 않았다면 배열 타입에서 요소 타입을 꺼내야 합니다.\n\n" +
        "**4. 문자열 패턴에서 타입 파싱**\n" +
        "라우트 경로 `'/users/:id/posts/:postId'`에서 파라미터 이름(`id`, `postId`)을 타입 레벨에서 추출하고 싶습니다. 수동으로 타입을 정의하면 경로와 타입이 불일치할 위험이 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "infer 키워드는 Conditional Type 안에서 타입 변수를 선언하고, 패턴 매칭을 통해 타입을 캡처합니다.\n\n" +
        "### 기본 문법\n" +
        "`T extends SomePattern<infer U> ? U : Default` 형태로 사용합니다. T가 패턴에 맞으면 U에 추출된 타입이 바인딩되고, 맞지 않으면 Default가 반환됩니다.\n\n" +
        "### ReturnType 구현\n" +
        "`T extends (...args: any[]) => infer R ? R : never` — 함수 타입에서 반환 타입 R을 추출합니다. TypeScript 내장 `ReturnType<T>`가 바로 이렇게 구현되어 있습니다.\n\n" +
        "### Parameters 구현\n" +
        "`T extends (...args: infer P) => any ? P : never` — 함수의 매개변수 타입을 튜플로 추출합니다. 여러 개의 infer를 동시에 사용하면 반환 타입과 매개변수 타입을 한 번에 추출할 수도 있습니다.\n\n" +
        "### 재귀적 infer\n" +
        "중첩된 Promise(`Promise<Promise<string>>`)를 한 번에 풀려면 재귀적으로 infer를 적용합니다. `T extends Promise<infer U> ? DeepAwaited<U> : T` 패턴으로 몇 겹이든 풀어낼 수 있습니다.\n\n" +
        "### Template Literal + infer\n" +
        "문자열 타입에서도 패턴 매칭이 가능합니다. `T extends \\`${infer Prefix}:${infer Param}\\`` 형태로 문자열을 분해할 수 있어, 라우트 파라미터 추출 같은 고급 패턴을 구현할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: infer를 활용한 타입 추출",
      content:
        "infer의 다양한 활용 패턴을 살펴봅시다. 함수, 배열, Promise, 문자열 등 여러 구조에서 타입을 추출하는 방법과 재귀적 패턴까지 다룹니다.",
      code: {
        language: "typescript",
        code:
          "// ===== 1. 함수 반환 타입 추출 (ReturnType 구현) =====\n" +
          "type MyReturnType<T extends (...args: any[]) => any> =\n" +
          "  T extends (...args: any[]) => infer R ? R : never;\n" +
          "\n" +
          "function fetchUser() {\n" +
          "  return { id: 1, name: '홍길동', email: 'hong@test.com' };\n" +
          "}\n" +
          "\n" +
          "type User = MyReturnType<typeof fetchUser>;\n" +
          "// { id: number; name: string; email: string }\n" +
          "\n" +
          "// ===== 2. 함수 매개변수 추출 (Parameters 구현) =====\n" +
          "type MyParameters<T extends (...args: any[]) => any> =\n" +
          "  T extends (...args: infer P) => any ? P : never;\n" +
          "\n" +
          "type FetchParams = MyParameters<typeof fetch>;\n" +
          "// [input: RequestInfo | URL, init?: RequestInit | undefined]\n" +
          "\n" +
          "// ===== 3. 배열 요소 타입 추출 =====\n" +
          "type ElementOf<T> = T extends (infer E)[] ? E : never;\n" +
          "\n" +
          "type Item = ElementOf<string[]>; // string\n" +
          "type Mixed = ElementOf<(string | number)[]>; // string | number\n" +
          "\n" +
          "// ===== 4. Promise 내부 타입 추출 (재귀적) =====\n" +
          "type DeepAwaited<T> =\n" +
          "  T extends Promise<infer U> ? DeepAwaited<U> : T;\n" +
          "\n" +
          "type A = DeepAwaited<Promise<string>>; // string\n" +
          "type B = DeepAwaited<Promise<Promise<number>>>; // number\n" +
          "type C = DeepAwaited<Promise<Promise<Promise<boolean>>>>; // boolean\n" +
          "\n" +
          "// ===== 5. 문자열 파싱: 라우트 파라미터 추출 =====\n" +
          "type ExtractParams<T extends string> =\n" +
          "  T extends `${string}:${infer Param}/${infer Rest}`\n" +
          "    ? Param | ExtractParams<Rest>\n" +
          "    : T extends `${string}:${infer Param}`\n" +
          "      ? Param\n" +
          "      : never;\n" +
          "\n" +
          "type RouteParams = ExtractParams<'/users/:id/posts/:postId'>;\n" +
          "// 'id' | 'postId'\n" +
          "\n" +
          "// 파라미터 객체 타입 자동 생성\n" +
          "type ParamObject<T extends string> = {\n" +
          "  [K in ExtractParams<T>]: string;\n" +
          "};\n" +
          "\n" +
          "type UserPostParams = ParamObject<'/users/:id/posts/:postId'>;\n" +
          "// { id: string; postId: string }",
        description:
          "infer 키워드로 함수 반환 타입, 매개변수, 배열 요소, Promise 내부 타입, 문자열 패턴 등 다양한 구조에서 타입을 추출할 수 있습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 실무에서 활용하는 infer 패턴",
      content:
        "실무에서 자주 사용하는 infer 패턴들을 직접 작성해봅시다. 이벤트 핸들러에서 이벤트 타입 추출, 생성자에서 인스턴스 타입 추출, 그리고 복합 패턴을 연습합니다.",
      code: {
        language: "typescript",
        code:
          "// 1. 이벤트 핸들러에서 이벤트 타입 추출\n" +
          "type EventType<T> =\n" +
          "  T extends (event: infer E) => any ? E : never;\n" +
          "\n" +
          "type ClickHandler = (event: MouseEvent) => void;\n" +
          "type ClickEvent = EventType<ClickHandler>; // MouseEvent\n" +
          "\n" +
          "// 2. 생성자에서 인스턴스 타입 추출\n" +
          "type InstanceOf<T> =\n" +
          "  T extends new (...args: any[]) => infer I ? I : never;\n" +
          "\n" +
          "class UserService {\n" +
          "  getUser(id: number) { return { id, name: '테스트' }; }\n" +
          "}\n" +
          "\n" +
          "type Service = InstanceOf<typeof UserService>; // UserService\n" +
          "\n" +
          "// 3. 첫 번째 매개변수만 추출\n" +
          "type FirstParam<T extends (...args: any[]) => any> =\n" +
          "  T extends (first: infer F, ...rest: any[]) => any ? F : never;\n" +
          "\n" +
          "function createUser(name: string, age: number) { return { name, age }; }\n" +
          "type NameType = FirstParam<typeof createUser>; // string\n" +
          "\n" +
          "// 4. 중첩 Promise unwrap 실전\n" +
          "async function fetchData() {\n" +
          "  const response = await fetch('/api/users');\n" +
          "  return response.json() as Promise<{ users: string[] }>;\n" +
          "}\n" +
          "\n" +
          "type FetchResult = Awaited<ReturnType<typeof fetchData>>;\n" +
          "// { users: string[] }\n" +
          "\n" +
          "// 5. 조합: API 함수 맵에서 응답 타입 추출\n" +
          "const api = {\n" +
          "  getUser: () => Promise.resolve({ id: 1, name: '홍길동' }),\n" +
          "  getPosts: () => Promise.resolve([{ id: 1, title: '글' }]),\n" +
          "};\n" +
          "\n" +
          "type ApiResponse<K extends keyof typeof api> =\n" +
          "  Awaited<ReturnType<(typeof api)[K]>>;\n" +
          "\n" +
          "type UserResponse = ApiResponse<'getUser'>;\n" +
          "// { id: number; name: string }\n" +
          "type PostsResponse = ApiResponse<'getPosts'>;\n" +
          "// { id: number; title: string }[]",
        description:
          "infer를 Awaited, ReturnType 등과 조합하면 실무에서 API 응답 타입, 이벤트 타입 등을 자동으로 추출할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 용도 | 예시 |\n" +
        "|------|------|------|\n" +
        "| `(...args: any[]) => infer R` | 반환 타입 추출 | ReturnType |\n" +
        "| `(...args: infer P) => any` | 매개변수 추출 | Parameters |\n" +
        "| `Promise<infer U>` | Promise 내부 추출 | Awaited |\n" +
        "| `(infer E)[]` | 배열 요소 추출 | ElementOf |\n" +
        "| Template Literal + infer | 문자열 파싱 | 라우트 파라미터 |\n" +
        "| 재귀적 infer | 중첩 구조 풀기 | DeepAwaited |\n\n" +
        "**핵심:** infer는 Conditional Type 안에서 타입을 '캡처'하는 키워드입니다. `T extends (...args: infer P) => infer R` 패턴으로 함수의 매개변수와 반환 타입을 추출할 수 있으며, Template Literal과 결합하면 문자열에서도 타입을 파싱할 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** TypeScript의 구조적 타이핑(Structural Typing) 개념을 학습합니다. 타입의 이름이 아닌 구조로 호환성을 판단하는 원리와, Branded Types로 명목적 타이핑을 흉내내는 기법을 다룹니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "infer는 Conditional Type 안에서 타입을 '캡처'하는 키워드다. T extends (...args: infer P) => infer R 패턴으로 함수의 매개변수와 반환 타입을 추출할 수 있으며, Template Literal과 결합하면 문자열에서도 타입을 파싱할 수 있다.",
  checklist: [
    "infer 키워드가 Conditional Type 안에서만 사용됨을 이해한다",
    "ReturnType<T>를 infer로 직접 구현할 수 있다",
    "Promise 내부 타입을 재귀적 infer로 추출할 수 있다",
    "Template Literal + infer로 문자열 패턴을 파싱할 수 있다",
    "실무에서 Awaited, ReturnType, Parameters를 조합하여 타입을 추출할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "infer 키워드는 어디에서만 사용할 수 있는가?",
      choices: [
        "제네릭 함수의 타입 매개변수",
        "Conditional Type의 extends 절",
        "interface 선언",
        "type alias의 우변 어디서든",
      ],
      correctIndex: 1,
      explanation:
        "infer 키워드는 Conditional Type의 extends 절에서만 사용할 수 있습니다. T extends ... infer U ... ? A : B 형태로, 패턴 매칭을 통해 타입 변수를 선언하고 캡처합니다.",
    },
    {
      id: "q2",
      question:
        "type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never; 에서 MyReturnType<() => string>의 결과는?",
      choices: ["never", "() => string", "string", "any"],
      correctIndex: 2,
      explanation:
        "() => string은 (...args: any[]) => infer R 패턴에 매칭되며, R에 string이 캡처됩니다. 따라서 결과는 string입니다.",
    },
    {
      id: "q3",
      question:
        "type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T; 에서 DeepAwaited<Promise<Promise<number>>>의 결과는?",
      choices: [
        "Promise<number>",
        "Promise<Promise<number>>",
        "number",
        "never",
      ],
      correctIndex: 2,
      explanation:
        "첫 번째 재귀에서 Promise<Promise<number>>에서 U = Promise<number>가 추출됩니다. 두 번째 재귀에서 Promise<number>에서 U = number가 추출됩니다. number는 Promise가 아니므로 T(= number)가 반환됩니다.",
    },
    {
      id: "q4",
      question:
        "type ElementOf<T> = T extends (infer E)[] ? E : never; 에서 ElementOf<string>의 결과는?",
      choices: ["string", "string[]", "never", "unknown"],
      correctIndex: 2,
      explanation:
        "string은 배열 타입이 아니므로 (infer E)[] 패턴에 매칭되지 않습니다. 따라서 false 분기인 never가 반환됩니다.",
    },
    {
      id: "q5",
      question: "Template Literal Type과 infer를 결합하여 할 수 있는 것은?",
      choices: [
        "런타임에서 문자열을 파싱하기",
        "타입 레벨에서 문자열 패턴을 분해하여 부분 타입 추출하기",
        "문자열의 길이를 타입으로 계산하기",
        "정규표현식을 타입으로 표현하기",
      ],
      correctIndex: 1,
      explanation:
        "Template Literal Type과 infer를 결합하면 타입 레벨에서 문자열 패턴을 분해할 수 있습니다. 예를 들어 '/users/:id'에서 'id'를 추출하는 것이 가능합니다. 이는 컴파일 타임에만 동작하며 런타임과는 무관합니다.",
    },
  ],
};

export default chapter;
