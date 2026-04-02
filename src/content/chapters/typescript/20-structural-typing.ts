import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "20-structural-typing",
  subject: "typescript",
  title: "구조적 타이핑",
  description:
    "TypeScript의 구조적 타이핑(Structural Typing) 원리를 이해하고, Branded Types로 명목적 타이핑을 흉내내는 기법을 학습합니다.",
  order: 20,
  group: "타입 시스템 심화",
  prerequisites: ["19-infer-keyword"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "구조적 타이핑은 **오리 테스트(Duck Test)**와 같습니다.\n\n" +
        "'걸어다니는 모양이 오리 같고, 꽥꽥거리는 소리가 오리 같으면 — 그것은 오리다.' 이것이 덕 타이핑의 원칙이고, TypeScript의 구조적 타이핑도 같은 철학을 따릅니다. 타입의 '이름'이 아니라 '구조(프로퍼티와 메서드)'가 같으면 호환됩니다.\n\n" +
        "반면 Java나 C#은 **주민등록증 검사**와 같습니다. 아무리 외모가 같아도 주민등록번호(타입 이름)가 다르면 다른 사람입니다. 이것이 명목적 타이핑(Nominal Typing)입니다.\n\n" +
        "실무에서 문제가 되는 경우를 생각해봅시다. '사용자 ID'와 '주문 ID'는 둘 다 숫자(number)입니다. 구조적 타이핑에서는 둘이 같은 타입이므로, 실수로 주문 ID를 사용자 ID 자리에 넣어도 에러가 나지 않습니다. 이런 경우에는 Branded Types라는 기법으로 '주민등록증'을 붙여서 구분할 수 있습니다. 타입에 고유한 브랜드 태그를 추가하여, 구조는 같지만 의미가 다른 타입을 구별하는 것입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "TypeScript의 구조적 타이핑은 강력하지만, 이해하지 못하면 예상치 못한 동작을 만납니다.\n\n" +
        "**1. 의도치 않은 타입 호환**\n" +
        "서로 다른 도메인 개념이 같은 구조를 가지면 실수로 잘못된 값을 전달해도 컴파일러가 잡지 못합니다. `UserId`와 `ProductId`가 모두 `number`일 때, 주문 함수에 사용자 ID를 넣어도 에러가 발생하지 않습니다.\n\n" +
        "**2. 초과 프로퍼티 검사의 불일치**\n" +
        "객체 리터럴을 직접 전달할 때는 초과 프로퍼티 검사가 작동하지만, 변수에 담아 전달하면 검사가 비활성화됩니다. 이 불일치가 혼란을 줍니다.\n\n" +
        "**3. 클래스의 구조적 호환**\n" +
        "이름이 다른 두 클래스라도 구조가 같으면 서로 호환됩니다. Java/C# 경험자는 이것이 매우 의아할 수 있습니다. `Cat` 클래스 변수에 `Dog` 인스턴스를 넣을 수 있다니!\n\n" +
        "**4. API 타입 안전성**\n" +
        "여러 API 엔드포인트의 요청/응답이 비슷한 구조를 가질 때, 실수로 다른 API의 요청 객체를 전달해도 컴파일러가 허용합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "구조적 타이핑의 원리를 이해하고, 필요한 경우 Branded Types로 안전성을 보강합니다.\n\n" +
        "### 구조적 타이핑의 원리\n" +
        "타입 A가 타입 B의 모든 프로퍼티를 가지고 있으면, A는 B에 할당 가능합니다. A에 추가 프로퍼티가 있어도 상관없습니다. 이것을 '초과 프로퍼티 허용'이라 하며, 구조적 타이핑의 핵심입니다.\n\n" +
        "### 초과 프로퍼티 검사 (Excess Property Check)\n" +
        "객체 리터럴을 **직접** 타입이 지정된 변수에 할당하거나 함수에 전달할 때, TypeScript는 특별히 초과 프로퍼티 검사를 수행합니다. 이것은 구조적 타이핑의 예외로, 오타를 잡기 위한 실용적 장치입니다.\n\n" +
        "### Branded Types (브랜딩 기법)\n" +
        "구조는 같지만 의미가 다른 타입을 구분하려면, 유니크한 심볼 프로퍼티를 추가하여 '브랜드'를 부여합니다. `type UserId = number & { readonly __brand: unique symbol }` 형태로, 런타임 비용 없이 타입 레벨에서만 구분합니다.\n\n" +
        "### 실전 패턴\n" +
        "생성 함수(factory function)를 통해서만 Branded Type 값을 만들도록 강제하면, 실수로 일반 number를 UserId 자리에 넣는 것을 방지할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 구조적 타이핑과 Branded Types",
      content:
        "구조적 타이핑의 동작 원리와 초과 프로퍼티 검사, 그리고 Branded Types 패턴을 코드로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          "// ===== 1. 구조적 타이핑: 구조가 같으면 호환 =====\n" +
          "interface Point2D {\n" +
          "  x: number;\n" +
          "  y: number;\n" +
          "}\n" +
          "\n" +
          "interface Point3D {\n" +
          "  x: number;\n" +
          "  y: number;\n" +
          "  z: number;\n" +
          "}\n" +
          "\n" +
          "function printPoint(p: Point2D) {\n" +
          "  console.log(`(${p.x}, ${p.y})`);\n" +
          "}\n" +
          "\n" +
          "const point3d: Point3D = { x: 1, y: 2, z: 3 };\n" +
          "printPoint(point3d); // ✅ OK — Point3D는 Point2D의 모든 프로퍼티 보유\n" +
          "\n" +
          "// ===== 2. 초과 프로퍼티 검사 =====\n" +
          "// 객체 리터럴 직접 전달: 초과 프로퍼티 에러\n" +
          "// printPoint({ x: 1, y: 2, z: 3 }); // ❌ 'z'는 Point2D에 없음\n" +
          "\n" +
          "// 변수에 담아 전달: 초과 프로퍼티 검사 비활성화\n" +
          "const obj = { x: 1, y: 2, z: 3 };\n" +
          "printPoint(obj); // ✅ OK\n" +
          "\n" +
          "// ===== 3. 클래스도 구조로 비교 =====\n" +
          "class Cat {\n" +
          "  name: string;\n" +
          "  constructor(name: string) { this.name = name; }\n" +
          "}\n" +
          "\n" +
          "class Dog {\n" +
          "  name: string;\n" +
          "  constructor(name: string) { this.name = name; }\n" +
          "}\n" +
          "\n" +
          "const pet: Cat = new Dog('멍멍이'); // ✅ 구조가 같으므로 OK\n" +
          "\n" +
          "// ===== 4. 문제: 의미가 다른 같은 구조 =====\n" +
          "type UserId = number;\n" +
          "type OrderId = number;\n" +
          "\n" +
          "function getUser(id: UserId) { /* ... */ }\n" +
          "const orderId: OrderId = 42;\n" +
          "getUser(orderId); // ✅ 컴파일 에러 없음 — 위험!\n" +
          "\n" +
          "// ===== 5. Branded Types로 해결 =====\n" +
          "declare const __brand: unique symbol;\n" +
          "type Brand<T, B extends string> = T & { readonly [__brand]: B };\n" +
          "\n" +
          "type SafeUserId = Brand<number, 'UserId'>;\n" +
          "type SafeOrderId = Brand<number, 'OrderId'>;\n" +
          "\n" +
          "function createUserId(id: number): SafeUserId {\n" +
          "  return id as SafeUserId;\n" +
          "}\n" +
          "\n" +
          "function createOrderId(id: number): SafeOrderId {\n" +
          "  return id as SafeOrderId;\n" +
          "}\n" +
          "\n" +
          "function getUserSafe(id: SafeUserId) { /* ... */ }\n" +
          "\n" +
          "const safeUserId = createUserId(1);\n" +
          "const safeOrderId = createOrderId(42);\n" +
          "\n" +
          "getUserSafe(safeUserId);  // ✅ OK\n" +
          "// getUserSafe(safeOrderId); // ❌ SafeOrderId는 SafeUserId에 할당 불가",
        description:
          "구조적 타이핑은 구조가 같으면 호환을 허용합니다. Branded Types 패턴으로 의미적 구분이 필요한 타입을 안전하게 분리할 수 있습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 실무에서의 구조적 타이핑",
      content:
        "실무에서 구조적 타이핑이 문제가 되는 상황과 Branded Types를 적용하는 패턴을 연습합니다.",
      code: {
        language: "typescript",
        code:
          "// 1. 실무 Branded Types 패턴: 여러 ID 타입 구분\n" +
          "type Brand<T, B extends string> = T & { readonly __brand: B };\n" +
          "\n" +
          "type UserId = Brand<string, 'UserId'>;\n" +
          "type PostId = Brand<string, 'PostId'>;\n" +
          "type CommentId = Brand<string, 'CommentId'>;\n" +
          "\n" +
          "// 생성 함수 (유효성 검증 포함 가능)\n" +
          "function toUserId(id: string): UserId {\n" +
          "  if (!id.startsWith('user_')) throw new Error('Invalid user ID');\n" +
          "  return id as UserId;\n" +
          "}\n" +
          "\n" +
          "function toPostId(id: string): PostId {\n" +
          "  if (!id.startsWith('post_')) throw new Error('Invalid post ID');\n" +
          "  return id as PostId;\n" +
          "}\n" +
          "\n" +
          "// API 함수에서 안전하게 사용\n" +
          "async function fetchPost(userId: UserId, postId: PostId) {\n" +
          "  return fetch(`/api/users/${userId}/posts/${postId}`);\n" +
          "}\n" +
          "\n" +
          "const uid = toUserId('user_123');\n" +
          "const pid = toPostId('post_456');\n" +
          "fetchPost(uid, pid);  // ✅ OK\n" +
          "// fetchPost(pid, uid); // ❌ 타입 에러! 순서가 뒤바뀌면 잡아줌\n" +
          "\n" +
          "// 2. 초과 프로퍼티 검사 활용\n" +
          "interface ApiRequest {\n" +
          "  endpoint: string;\n" +
          "  method: 'GET' | 'POST';\n" +
          "}\n" +
          "\n" +
          "function sendRequest(req: ApiRequest) { /* ... */ }\n" +
          "\n" +
          "// 오타를 잡아주는 초과 프로퍼티 검사\n" +
          "// sendRequest({ endpoint: '/api', method: 'GET', mehtod: 'POST' });\n" +
          "// ❌ 'mehtod'는 ApiRequest에 없습니다\n" +
          "\n" +
          "// 3. 구조적 타이핑과 React 컴포넌트\n" +
          "interface ButtonProps {\n" +
          "  label: string;\n" +
          "  onClick: () => void;\n" +
          "}\n" +
          "\n" +
          "interface IconButtonProps {\n" +
          "  label: string;\n" +
          "  onClick: () => void;\n" +
          "  icon: string;\n" +
          "}\n" +
          "\n" +
          "// IconButtonProps는 ButtonProps의 모든 프로퍼티를 포함\n" +
          "function renderButton(props: ButtonProps) { /* ... */ }\n" +
          "\n" +
          "const iconBtn: IconButtonProps = {\n" +
          "  label: '저장',\n" +
          "  onClick: () => {},\n" +
          "  icon: 'save',\n" +
          "};\n" +
          "renderButton(iconBtn); // ✅ 구조적 타이핑으로 호환",
        description:
          "Branded Types로 ID를 구분하면 함수 매개변수 순서 실수까지 컴파일 타임에 잡을 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 | 예시 |\n" +
        "|------|------|------|\n" +
        "| 구조적 타이핑 | 구조가 같으면 호환 | Point3D → Point2D |\n" +
        "| 명목적 타이핑 | 이름이 같아야 호환 | Java, C# |\n" +
        "| 초과 프로퍼티 검사 | 리터럴 직접 전달 시만 | 오타 방지용 |\n" +
        "| Branded Types | 구조 + 브랜드 태그 | UserId vs OrderId |\n" +
        "| 덕 타이핑 | 행동이 같으면 같은 타입 | JS 런타임 동작 |\n\n" +
        "**핵심:** TypeScript는 구조적 타이핑 — 타입의 이름이 아니라 구조(프로퍼티)가 같으면 호환됩니다. 이름으로 구분이 필요하면 Branded Types 패턴으로 명목적 타이핑을 흉내낼 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** 타입 호환성의 심화 개념인 공변(Covariance)과 반변(Contravariance)을 학습합니다. 함수의 매개변수와 반환값에서 타입 호환성이 어떻게 달라지는지 이해합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "TypeScript는 구조적 타이핑 — 타입의 이름이 아니라 구조(프로퍼티)가 같으면 호환된다. 이름으로 구분이 필요하면 Branded Types 패턴으로 명목적 타이핑을 흉내낼 수 있다.",
  checklist: [
    "구조적 타이핑과 명목적 타이핑의 차이를 설명할 수 있다",
    "초과 프로퍼티 검사가 언제 작동하는지 이해한다",
    "Branded Types 패턴을 직접 구현할 수 있다",
    "클래스도 구조적으로 비교됨을 알고 있다",
    "실무에서 Branded Types가 필요한 상황을 판단할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "TypeScript의 타입 호환성 판단 기준은?",
      choices: [
        "타입의 이름이 같아야 호환된다",
        "타입의 구조(프로퍼티)가 같으면 호환된다",
        "같은 파일에 선언된 타입만 호환된다",
        "extends로 명시적 상속 관계가 있어야 호환된다",
      ],
      correctIndex: 1,
      explanation:
        "TypeScript는 구조적 타이핑을 사용합니다. 타입의 이름이 달라도 필요한 프로퍼티를 모두 가지고 있으면 호환됩니다.",
    },
    {
      id: "q2",
      question:
        "초과 프로퍼티 검사(Excess Property Check)가 작동하는 경우는?",
      choices: [
        "항상 작동한다",
        "변수에 담아 전달할 때만",
        "객체 리터럴을 직접 전달할 때만",
        "strict 모드에서만",
      ],
      correctIndex: 2,
      explanation:
        "초과 프로퍼티 검사는 객체 리터럴을 직접 타입이 지정된 곳에 전달할 때만 작동합니다. 변수에 먼저 담으면 구조적 타이핑 규칙에 따라 초과 프로퍼티가 허용됩니다.",
    },
    {
      id: "q3",
      question:
        "Branded Types의 주요 목적은?",
      choices: [
        "런타임 성능 최적화",
        "구조가 같지만 의미가 다른 타입을 구분",
        "타입의 크기를 줄이기",
        "JavaScript와의 호환성 유지",
      ],
      correctIndex: 1,
      explanation:
        "Branded Types는 구조적으로 동일하지만 의미적으로 다른 타입(예: UserId vs OrderId)을 타입 레벨에서 구분하기 위한 패턴입니다. 런타임 비용 없이 타입 안전성을 높입니다.",
    },
    {
      id: "q4",
      question:
        "같은 구조를 가진 두 클래스 Cat과 Dog가 있을 때, const pet: Cat = new Dog('멍멍이')는?",
      choices: [
        "컴파일 에러 — 다른 클래스이므로",
        "런타임 에러",
        "컴파일 성공 — 구조가 같으므로",
        "경고만 표시",
      ],
      correctIndex: 2,
      explanation:
        "TypeScript에서 클래스도 구조적으로 비교됩니다. Cat과 Dog의 프로퍼티 구조가 같으면 서로 호환되어 할당이 가능합니다.",
    },
    {
      id: "q5",
      question:
        "다음 중 구조적 타이핑이 아닌 명목적 타이핑을 사용하는 언어는?",
      choices: [
        "TypeScript",
        "Python (duck typing)",
        "Java",
        "Go",
      ],
      correctIndex: 2,
      explanation:
        "Java는 명목적 타이핑(Nominal Typing)을 사용합니다. 클래스나 인터페이스의 이름과 명시적 상속/구현 관계로 타입 호환성을 판단합니다.",
    },
  ],
};

export default chapter;
