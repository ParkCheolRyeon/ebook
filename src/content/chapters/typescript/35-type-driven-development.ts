import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "35-type-driven-development",
  subject: "typescript",
  title: "타입 주도 개발",
  description:
    "타입을 먼저 설계하고 구현을 따르게 하는 접근을 익히고, 불가능한 상태를 타입으로 원천 차단하는 기법과 브랜디드 타입을 실전에 적용합니다.",
  order: 35,
  group: "아키텍처",
  prerequisites: ["34-api-type-patterns"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "타입 주도 개발은 **건축 설계도를 먼저 그리는 것**과 같습니다.\n\n" +
        "일반적인 개발은 벽돌부터 쌓기 시작합니다. '일단 만들고 나중에 고치자.' 하지만 3층까지 올린 뒤에 엘리베이터가 필요하다는 걸 깨달으면? 구조를 뜯어고쳐야 합니다.\n\n" +
        "타입 주도 개발은 설계도를 먼저 완성합니다. '이 건물에는 어떤 방(상태)이 있고, 각 방은 어떤 문(전환)으로 연결되며, 지하실에서 옥상으로 직접 가는 문(불가능한 전환)은 없다' — 이런 규칙을 설계도(타입)에 명시합니다.\n\n" +
        "**'Make Illegal States Unrepresentable'** — 불가능한 상태를 설계도에서 아예 그릴 수 없게 만드는 것입니다. 지하실→옥상 문이 설계도에 없으면, 시공자(개발자)가 실수로 그런 문을 만들 수 없습니다. 이것이 타입 시스템의 진정한 힘입니다.\n\n" +
        "브랜디드 타입은 설계도에 **규격 인증 마크**를 붙이는 것입니다. 같은 숫자라도 '길이(Meters)'와 '무게(Kilograms)'는 다른 규격이니, 길이가 필요한 곳에 무게를 넣으면 설계 단계에서 거부됩니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "구현 중심 개발에서 타입은 '코드를 작성한 후 붙이는 것'입니다. 이 접근은 여러 문제를 만듭니다.\n\n" +
        "**1. 불가능한 상태의 존재**\n" +
        "`{ isLoading: true, data: User, error: Error }` — 로딩 중인데 데이터와 에러가 동시에 있는 상태. 이런 상태가 타입으로 표현 가능하면, 코드 어딘가에서 실제로 만들어질 수 있습니다.\n\n" +
        "**2. 원시 타입의 의미 소실**\n" +
        "`function transfer(from: string, to: string, amount: number)` — from과 to가 둘 다 string이라서 실수로 순서를 바꿔도 컴파일 에러가 나지 않습니다. userId와 orderId가 둘 다 string이면 완전히 다른 도메인 값을 잘못 전달할 수 있습니다.\n\n" +
        "**3. 상태 전환의 무질서**\n" +
        "주문 상태가 'pending' → 'paid' → 'shipped' 순서여야 하는데, 'pending'에서 바로 'shipped'로 가는 것을 타입이 막지 못합니다.\n\n" +
        "**4. 도메인 규칙의 암묵적 전달**\n" +
        "'이메일은 반드시 검증된 것이어야 한다', '금액은 양수여야 한다' 같은 규칙이 코드 주석이나 문서에만 존재하고, 타입 시스템이 강제하지 않습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. 판별 유니온으로 불가능한 상태 제거\n" +
        "boolean 플래그 조합 대신 판별 유니온을 사용합니다. `{ status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: E }`로 정의하면, 'loading인데 data가 있는' 불가능한 상태가 타입 수준에서 존재할 수 없습니다.\n\n" +
        "### 2. 브랜디드 타입(Branded Types)\n" +
        "원시 타입에 '브랜드'를 붙여 도메인 의미를 부여합니다. `type UserId = string & { readonly __brand: 'UserId' }`로 정의하면, 일반 string을 UserId가 필요한 곳에 전달할 수 없습니다.\n\n" +
        "### 3. 타입 레벨 상태 머신\n" +
        "각 상태를 별도 타입으로 정의하고, 상태 전환 함수의 입출력 타입으로 유효한 전환만 허용합니다.\n\n" +
        "### 4. Phantom Types\n" +
        "런타임에는 존재하지 않지만 컴파일 타임에만 존재하는 타입 매개변수를 활용합니다. '검증됨/미검증', '암호화됨/평문' 같은 상태를 타입으로 추적할 수 있습니다.\n\n" +
        "### 5. 타입 먼저, 구현 나중\n" +
        "기능을 구현하기 전에 도메인 모델의 타입부터 설계합니다. 타입이 컴파일되면 설계가 논리적으로 일관적이라는 증거입니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 불가능한 상태 제거와 브랜디드 타입",
      content:
        "실무에서 가장 자주 쓰이는 두 가지 기법을 구현합니다. 판별 유니온으로 불가능한 상태를 타입 수준에서 제거하고, 브랜디드 타입으로 도메인 값의 혼동을 원천 차단하는 방법을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          "// ===== ❌ 불가능한 상태가 존재하는 설계 =====\n" +
          "type BadRequestState = {\n" +
          "  isLoading: boolean;\n" +
          "  data: User | null;\n" +
          "  error: Error | null;\n" +
          "};\n" +
          "// { isLoading: true, data: User, error: Error } ← 가능하지만 말이 안됨!\n" +
          "\n" +
          "// ===== ✅ 불가능한 상태를 제거한 설계 =====\n" +
          "type RequestState<T> =\n" +
          "  | { status: 'idle' }\n" +
          "  | { status: 'loading' }\n" +
          "  | { status: 'success'; data: T }\n" +
          "  | { status: 'error'; error: Error };\n" +
          "\n" +
          "// loading일 때 data에 접근 불가 — 타입이 막아줌!\n" +
          "function renderUser(state: RequestState<User>) {\n" +
          "  switch (state.status) {\n" +
          "    case 'idle':    return '대기 중';\n" +
          "    case 'loading': return '로딩 중...';\n" +
          "    case 'success': return state.data.name; // OK: data 존재 보장\n" +
          "    case 'error':   return state.error.message; // OK: error 존재 보장\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// ===== 브랜디드 타입 =====\n" +
          "type Brand<T, B extends string> = T & { readonly __brand: B };\n" +
          "\n" +
          "type UserId = Brand<string, 'UserId'>;\n" +
          "type OrderId = Brand<string, 'OrderId'>;\n" +
          "type Email = Brand<string, 'Email'>;\n" +
          "\n" +
          "// 생성 함수 (검증 포함)\n" +
          "function createUserId(id: string): UserId {\n" +
          "  if (!id.startsWith('usr_')) throw new Error('Invalid UserId');\n" +
          "  return id as UserId;\n" +
          "}\n" +
          "\n" +
          "function createEmail(value: string): Email {\n" +
          "  if (!value.includes('@')) throw new Error('Invalid email');\n" +
          "  return value as Email;\n" +
          "}\n" +
          "\n" +
          "// 사용: 같은 string이라도 혼동 불가\n" +
          "function getOrder(userId: UserId, orderId: OrderId) { /* ... */ }\n" +
          "\n" +
          "const uid = createUserId('usr_123');\n" +
          "const oid = 'ord_456' as OrderId;\n" +
          "\n" +
          "getOrder(uid, oid);  // ✅ OK\n" +
          "// getOrder(oid, uid);  // ❌ 컴파일 에러: OrderId는 UserId에 할당 불가",
        description:
          "판별 유니온으로 불가능한 상태를 제거하고, 브랜디드 타입으로 도메인 값의 혼동을 원천 차단합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 결제 플로우를 타입으로 모델링",
      content:
        "실무 결제 시스템의 상태 전환을 타입으로 모델링합니다. 유효하지 않은 상태 전환(예: 대기 중에서 바로 환불)을 타입 시스템이 차단하는 타입 레벨 상태 머신과, Phantom Types로 검증 상태를 추적하는 패턴을 구현합니다.",
      code: {
        language: "typescript",
        code:
          "// ===== 결제 상태를 타입으로 모델링 =====\n" +
          "type PendingPayment = {\n" +
          "  status: 'pending';\n" +
          "  orderId: string;\n" +
          "  amount: number;\n" +
          "  createdAt: Date;\n" +
          "};\n" +
          "\n" +
          "type ProcessingPayment = {\n" +
          "  status: 'processing';\n" +
          "  orderId: string;\n" +
          "  amount: number;\n" +
          "  transactionId: string; // 결제 진행 후에만 존재\n" +
          "};\n" +
          "\n" +
          "type CompletedPayment = {\n" +
          "  status: 'completed';\n" +
          "  orderId: string;\n" +
          "  amount: number;\n" +
          "  transactionId: string;\n" +
          "  completedAt: Date;      // 완료 후에만 존재\n" +
          "};\n" +
          "\n" +
          "type FailedPayment = {\n" +
          "  status: 'failed';\n" +
          "  orderId: string;\n" +
          "  amount: number;\n" +
          "  reason: string;         // 실패 사유\n" +
          "};\n" +
          "\n" +
          "type Payment = PendingPayment | ProcessingPayment\n" +
          "  | CompletedPayment | FailedPayment;\n" +
          "\n" +
          "// ===== 상태 전환 함수: 유효한 전환만 허용 =====\n" +
          "function startProcessing(\n" +
          "  payment: PendingPayment,  // 오직 pending만 받음\n" +
          "  transactionId: string\n" +
          "): ProcessingPayment {\n" +
          "  return { ...payment, status: 'processing', transactionId };\n" +
          "}\n" +
          "\n" +
          "function completePayment(\n" +
          "  payment: ProcessingPayment  // 오직 processing만 받음\n" +
          "): CompletedPayment {\n" +
          "  return { ...payment, status: 'completed', completedAt: new Date() };\n" +
          "}\n" +
          "\n" +
          "function failPayment(\n" +
          "  payment: PendingPayment | ProcessingPayment,\n" +
          "  reason: string\n" +
          "): FailedPayment {\n" +
          "  return {\n" +
          "    orderId: payment.orderId,\n" +
          "    amount: payment.amount,\n" +
          "    status: 'failed',\n" +
          "    reason,\n" +
          "  };\n" +
          "}\n" +
          "\n" +
          "// 사용 예: 잘못된 전환은 컴파일 에러!\n" +
          "// completePayment(pendingPayment); // ❌ PendingPayment는 불가\n" +
          "// startProcessing(completedPayment, 'tx'); // ❌ CompletedPayment는 불가\n" +
          "\n" +
          "// ===== Phantom Types: 검증 상태 추적 =====\n" +
          "type Unvalidated = { readonly _tag: 'unvalidated' };\n" +
          "type Validated = { readonly _tag: 'validated' };\n" +
          "\n" +
          "type FormData<Status> = {\n" +
          "  email: string;\n" +
          "  name: string;\n" +
          "  _phantom?: Status; // 런타임에 존재하지 않음\n" +
          "};\n" +
          "\n" +
          "function validateForm(\n" +
          "  form: FormData<Unvalidated>\n" +
          "): FormData<Validated> | null {\n" +
          "  if (!form.email.includes('@')) return null;\n" +
          "  return form as FormData<Validated>;\n" +
          "}\n" +
          "\n" +
          "function submitForm(form: FormData<Validated>): void {\n" +
          "  // 검증된 폼만 제출 가능\n" +
          "}\n" +
          "\n" +
          "// const raw: FormData<Unvalidated> = { email: 'a@b.c', name: 'Kim' };\n" +
          "// submitForm(raw); // ❌ Unvalidated는 Validated에 할당 불가\n" +
          "// const valid = validateForm(raw);\n" +
          "// if (valid) submitForm(valid); // ✅ OK",
        description:
          "결제 플로우의 상태 전환을 타입으로 모델링하고, Phantom Types로 검증 상태를 컴파일 타임에 추적합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 기법 | 해결하는 문제 | 핵심 원리 |\n" +
        "|------|-------------|----------|\n" +
        "| 판별 유니온 | 불가능한 상태 | 상태별 타입 분리 |\n" +
        "| 브랜디드 타입 | 원시 타입 혼동 | 타입에 브랜드 부착 |\n" +
        "| 타입 레벨 상태 머신 | 잘못된 상태 전환 | 함수 입출력으로 전환 제약 |\n" +
        "| Phantom Types | 런타임 없는 상태 추적 | 유령 타입 매개변수 |\n\n" +
        "**핵심:** 타입 주도 개발은 구현 전에 타입을 먼저 설계하여, 잘못된 상태를 타입 시스템이 원천 차단하게 만드는 접근입니다. 'Make Illegal States Unrepresentable' — 불가능한 상태를 표현할 수 없게 타입을 설계하세요.\n\n" +
        "이것으로 TypeScript 전체 학습 과정을 마칩니다. 기초 타입부터 시작해 제네릭, 고급 타입 조작, React 통합, 프로젝트 설정, 그리고 타입 주도 설계까지 — TypeScript의 타입 시스템을 깊이 있게 다루었습니다. 이제 여러분은 타입을 '귀찮은 보일러플레이트'가 아닌 '설계 도구'로 활용할 수 있습니다. 실무 프로젝트에서 strict: true를 켜고, 불가능한 상태를 타입으로 막고, 외부 데이터는 런타임 검증을 붙여보세요. 타입 시스템이 여러분의 가장 든든한 동료가 될 것입니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "타입 주도 개발은 구현 전에 타입을 먼저 설계하여, 잘못된 상태를 타입 시스템이 원천 차단하게 만드는 접근이다. 'Make Illegal States Unrepresentable' — 불가능한 상태를 표현할 수 없게 타입을 설계하라.",
  checklist: [
    "판별 유니온으로 불가능한 상태를 제거하는 방법을 안다",
    "브랜디드 타입으로 도메인 값 혼동을 방지할 수 있다",
    "타입 레벨 상태 머신으로 유효한 전환만 허용할 수 있다",
    "Phantom Types의 개념과 활용 사례를 설명할 수 있다",
    "'Make Illegal States Unrepresentable' 원칙을 실무에 적용할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "{ isLoading: boolean; data: T | null; error: Error | null } 타입의 문제는?",
      choices: [
        "타입이 너무 복잡하다",
        "null을 사용하면 안된다",
        "불가능한 상태(로딩 중인데 데이터 있음)를 허용한다",
        "제네릭을 사용하면 안된다",
      ],
      correctIndex: 2,
      explanation:
        "boolean 플래그와 null 조합은 isLoading: true이면서 data와 error가 동시에 존재하는 불가능한 상태를 허용합니다. 판별 유니온으로 각 상태를 별도 타입으로 분리하면 이 문제를 해결합니다.",
    },
    {
      id: "q2",
      question: "브랜디드 타입의 핵심 목적은?",
      choices: [
        "런타임 성능 최적화",
        "같은 원시 타입의 도메인 값 혼동 방지",
        "코드 가독성 향상",
        "번들 크기 축소",
      ],
      correctIndex: 1,
      explanation:
        "브랜디드 타입은 같은 원시 타입(예: string)이라도 UserId, OrderId, Email 등 서로 다른 도메인 의미를 가진 값을 혼동하지 않도록 컴파일 타임에 구분합니다.",
    },
    {
      id: "q3",
      question:
        "Phantom Types의 특징은?",
      choices: [
        "런타임에 추가 메모리를 사용한다",
        "런타임에는 존재하지 않고 컴파일 타임에만 존재한다",
        "JavaScript로 변환 시 보존된다",
        "enum과 동일한 역할을 한다",
      ],
      correctIndex: 1,
      explanation:
        "Phantom Types는 타입 매개변수로만 존재하며 런타임 값에는 영향을 주지 않습니다. 컴파일 타임에 '검증됨/미검증' 같은 상태를 추적하되, 런타임 오버헤드는 전혀 없습니다.",
    },
    {
      id: "q4",
      question:
        "타입 레벨 상태 머신에서 잘못된 전환을 막는 방법은?",
      choices: [
        "런타임 if문으로 검사",
        "상태 전환 함수의 매개변수 타입을 특정 상태로 제한",
        "전역 상태 변수 사용",
        "try/catch로 잘못된 전환을 잡기",
      ],
      correctIndex: 1,
      explanation:
        "상태 전환 함수가 특정 상태 타입만 매개변수로 받도록 정의하면, 잘못된 상태에서 전환을 시도할 때 컴파일 에러가 발생합니다. 예: completePayment(processing: ProcessingPayment)은 PendingPayment를 받을 수 없습니다.",
    },
    {
      id: "q5",
      question: "'Make Illegal States Unrepresentable' 원칙의 의미는?",
      choices: [
        "모든 에러를 try/catch로 처리하라",
        "런타임 유효성 검증을 항상 추가하라",
        "불가능한 상태를 타입으로 표현할 수 없게 설계하라",
        "모든 변수에 타입을 명시하라",
      ],
      correctIndex: 2,
      explanation:
        "이 원칙은 잘못된 상태가 타입 수준에서 존재할 수 없도록 설계하라는 뜻입니다. 판별 유니온, 브랜디드 타입, 타입 레벨 상태 머신 등의 기법으로 구현하며, 런타임 검사 없이도 컴파일러가 잘못된 상태를 차단합니다.",
    },
  ],
};

export default chapter;
