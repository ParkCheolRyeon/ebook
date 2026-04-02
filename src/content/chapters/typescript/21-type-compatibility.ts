import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "21-type-compatibility",
  subject: "typescript",
  title: "타입 호환성과 공변·반변",
  description:
    "타입 호환성(Assignability)의 심화 개념인 공변(Covariance)과 반변(Contravariance)을 이해하고, strictFunctionTypes의 역할을 학습합니다.",
  order: 21,
  group: "타입 시스템 심화",
  prerequisites: ["20-structural-typing"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "공변과 반변은 **택배 상자의 크기**로 이해할 수 있습니다.\n\n" +
        "**공변(Covariance)은 '출력'입니다.** 택배를 보내는 쪽을 생각해봅시다. '과일 상자'를 약속했는데 '사과 상자'를 보내도 될까요? 됩니다! 사과는 과일의 하위 타입이니까요. 반환값은 더 구체적인 것을 돌려줘도 안전합니다. 이것이 공변입니다.\n\n" +
        "**반변(Contravariance)은 '입력'입니다.** 택배를 받는 쪽을 생각해봅시다. '사과 전용 박스'가 필요한데 '과일 전용 박스'를 가져와도 될까요? 됩니다! 과일 박스는 사과도 담을 수 있으니까요. 매개변수는 더 넓은 타입을 받아도 안전합니다. 이것이 반변입니다.\n\n" +
        "반대로 생각하면 위험합니다. 반환값으로 '과일'을 약속했는데 '음식'을 돌려주면? 음식에는 과일이 아닌 것도 있어서 위험합니다. 매개변수로 '과일'을 받는 함수 자리에 '사과만' 받는 함수를 넣으면? 바나나가 들어왔을 때 처리를 못 합니다. 이 방향성을 이해하는 것이 핵심입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "타입 호환성 에러는 TypeScript에서 가장 혼란스러운 에러 중 하나입니다.\n\n" +
        "**1. 함수 할당 시 발생하는 에러**\n" +
        "이벤트 핸들러를 다룰 때, `(e: MouseEvent) => void`를 `(e: Event) => void` 자리에 넣으려 하면 에러가 발생하기도 하고, 반대로 될 때도 있습니다. 어느 방향이 안전한지 직관적이지 않습니다.\n\n" +
        "**2. 제네릭 컨테이너의 호환성**\n" +
        "`Array<Dog>`을 `Array<Animal>` 자리에 넣을 수 있을까요? 읽기만 한다면 안전하지만, 쓰기를 한다면 위험합니다. `Array<Animal>`에 `Cat`을 추가할 수 있는데, 실제로는 `Dog[]`이기 때문입니다.\n\n" +
        "**3. 콜백 함수의 매개변수**\n" +
        "라이브러리가 `(item: Animal) => void` 콜백을 기대하는데, `(item: Dog) => void`를 전달해도 될까요? TypeScript는 기본적으로 허용하지만, `strictFunctionTypes`를 켜면 에러가 됩니다.\n\n" +
        "**4. 메서드 vs 함수 프로퍼티**\n" +
        "인터페이스에서 `method(arg: T): void`와 `method: (arg: T) => void`의 타입 검사가 다릅니다. 이 미묘한 차이를 모르면 타입 안전성에 구멍이 생깁니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "타입의 위치(입력/출력)에 따라 호환성 방향이 달라진다는 원칙을 이해합니다.\n\n" +
        "### 공변 (Covariance) — 출력 위치\n" +
        "함수의 반환값, 읽기 전용 프로퍼티 등 '출력' 위치에서는 공변입니다. 더 구체적인 타입(서브타입)을 더 일반적인 타입(슈퍼타입) 자리에 할당할 수 있습니다. `() => Dog`은 `() => Animal`에 할당 가능합니다.\n\n" +
        "### 반변 (Contravariance) — 입력 위치\n" +
        "함수의 매개변수 등 '입력' 위치에서는 반변입니다. 더 일반적인 타입(슈퍼타입)을 더 구체적인 타입(서브타입) 자리에 할당할 수 있습니다. `(a: Animal) => void`는 `(a: Dog) => void`에 할당 가능합니다.\n\n" +
        "### 이변 (Bivariance) — TS 기본 동작\n" +
        "TypeScript는 역사적 이유로, 메서드 선언(`method(arg: T)`)에 대해 이변을 허용합니다. 입력 위치에서도 양방향 할당이 가능한데, 이는 실용성을 위한 타협입니다.\n\n" +
        "### strictFunctionTypes\n" +
        "이 옵션을 켜면 함수 타입 프로퍼티(`method: (arg: T) => void`)에 대해 매개변수의 반변 검사가 활성화됩니다. `strict: true`에 포함되어 있으므로, 대부분의 프로젝트에서 이미 활성화되어 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 공변과 반변의 동작",
      content:
        "공변, 반변, 이변의 실제 동작을 코드로 확인합니다. 각 경우에 어떤 할당이 안전하고 어떤 것이 위험한지 이해합시다.",
      code: {
        language: "typescript",
        code:
          "// ===== 타입 계층 정의 =====\n" +
          "class Animal {\n" +
          "  name: string = '';\n" +
          "}\n" +
          "\n" +
          "class Dog extends Animal {\n" +
          "  breed: string = '';\n" +
          "}\n" +
          "\n" +
          "class Bulldog extends Dog {\n" +
          "  isFriendly: boolean = true;\n" +
          "}\n" +
          "\n" +
          "// ===== 1. 공변 (Covariance) — 반환값 =====\n" +
          "type Producer<T> = () => T;\n" +
          "\n" +
          "let produceDog: Producer<Dog> = () => new Dog();\n" +
          "let produceAnimal: Producer<Animal> = produceDog;\n" +
          "// ✅ Dog → Animal 방향 (공변)\n" +
          "// Dog을 만드는 함수는 Animal을 만드는 함수 자리에 OK\n" +
          "\n" +
          "// let produceDog2: Producer<Dog> = produceAnimal;\n" +
          "// ❌ Animal → Dog 방향은 불가\n" +
          "// Animal을 만드는 함수가 Cat을 반환할 수도 있으므로 위험\n" +
          "\n" +
          "// ===== 2. 반변 (Contravariance) — 매개변수 =====\n" +
          "type Consumer<T> = (arg: T) => void;\n" +
          "\n" +
          "let consumeAnimal: Consumer<Animal> = (a: Animal) => {\n" +
          "  console.log(a.name);\n" +
          "};\n" +
          "let consumeDog: Consumer<Dog> = consumeAnimal;\n" +
          "// ✅ Animal → Dog 방향 (반변)\n" +
          "// Animal을 처리하는 함수는 Dog도 처리 가능\n" +
          "\n" +
          "// let consumeAnimal2: Consumer<Animal> = consumeDog;\n" +
          "// ❌ Dog → Animal 방향은 불가 (strictFunctionTypes 켠 경우)\n" +
          "// Dog만 처리하는 함수에 Cat이 들어오면 위험\n" +
          "\n" +
          "// ===== 3. 메서드 vs 함수 프로퍼티 =====\n" +
          "interface WithMethod {\n" +
          "  handle(arg: Dog): void; // 메서드 선언 → 이변 (양방향 허용)\n" +
          "}\n" +
          "\n" +
          "interface WithProperty {\n" +
          "  handle: (arg: Dog) => void; // 함수 프로퍼티 → 반변 (엄격)\n" +
          "}\n" +
          "\n" +
          "// ===== 4. 실무 예시: 이벤트 핸들러 =====\n" +
          "type EventHandler<E> = (event: E) => void;\n" +
          "\n" +
          "// Event는 MouseEvent의 슈퍼타입\n" +
          "let handleEvent: EventHandler<Event> = (e: Event) => {\n" +
          "  console.log(e.type);\n" +
          "};\n" +
          "\n" +
          "let handleMouse: EventHandler<MouseEvent> = handleEvent;\n" +
          "// ✅ 반변: Event 핸들러는 MouseEvent 핸들러 자리에 OK\n" +
          "// Event를 처리할 수 있으면 MouseEvent도 처리 가능",
        description:
          "반환값은 공변(더 구체적 → 더 일반적), 매개변수는 반변(더 일반적 → 더 구체적)으로 할당됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 실무에서 만나는 호환성 패턴",
      content:
        "실무에서 자주 마주치는 타입 호환성 시나리오와 해결 방법을 연습합니다.",
      code: {
        language: "typescript",
        code:
          "// 1. React 이벤트 핸들러 호환성\n" +
          "type BaseHandler = (e: Event) => void;\n" +
          "type ClickHandler = (e: MouseEvent) => void;\n" +
          "\n" +
          "// Event를 받는 핸들러 → MouseEvent 자리에 사용 가능 (반변)\n" +
          "const logEvent: BaseHandler = (e) => console.log(e.type);\n" +
          "const onClick: ClickHandler = logEvent; // ✅\n" +
          "\n" +
          "// 2. 콜백 함수의 매개변수 수\n" +
          "// TypeScript는 더 적은 매개변수를 받는 함수도 허용\n" +
          "const numbers = [1, 2, 3];\n" +
          "numbers.forEach((item) => console.log(item)); // ✅ (index, array 무시)\n" +
          "\n" +
          "type Callback = (a: number, b: string, c: boolean) => void;\n" +
          "const simple: Callback = (a) => console.log(a); // ✅ 나머지 무시\n" +
          "\n" +
          "// 3. 읽기 전용 배열의 공변성\n" +
          "class Animal { name = ''; }\n" +
          "class Dog extends Animal { breed = ''; }\n" +
          "\n" +
          "const dogs: readonly Dog[] = [new Dog()];\n" +
          "const animals: readonly Animal[] = dogs; // ✅ 공변 (읽기만 하므로 안전)\n" +
          "\n" +
          "// 4. strictFunctionTypes 실전 영향\n" +
          "interface Repository<T> {\n" +
          "  // 함수 프로퍼티: 엄격한 반변 검사\n" +
          "  save: (entity: T) => Promise<void>;\n" +
          "  // 메서드: 이변 허용 (덜 엄격)\n" +
          "  delete(entity: T): Promise<void>;\n" +
          "}\n" +
          "\n" +
          "// 5. 호환성 에러 해결 패턴\n" +
          "interface ApiResponse<T> {\n" +
          "  data: T;\n" +
          "  status: number;\n" +
          "}\n" +
          "\n" +
          "// 타입 단언 대신 제네릭 활용\n" +
          "function processResponse<T>(response: ApiResponse<T>): T {\n" +
          "  if (response.status !== 200) {\n" +
          "    throw new Error(`API error: ${response.status}`);\n" +
          "  }\n" +
          "  return response.data;\n" +
          "}\n" +
          "\n" +
          "// 구체적인 타입에도 일반적인 타입에도 사용 가능\n" +
          "const userResp: ApiResponse<{ name: string }> = {\n" +
          "  data: { name: '홍길동' },\n" +
          "  status: 200,\n" +
          "};\n" +
          "const user = processResponse(userResp); // { name: string }",
        description:
          "이벤트 핸들러, 콜백 매개변수, 읽기 전용 배열 등 실무 패턴에서 공변·반변을 이해하면 호환성 에러를 빠르게 해결할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 방향 | 위치 | 예시 |\n" +
        "|------|------|------|------|\n" +
        "| 공변 | 구체적 → 일반적 | 반환값, readonly | Dog → Animal |\n" +
        "| 반변 | 일반적 → 구체적 | 매개변수 | Animal → Dog |\n" +
        "| 이변 | 양방향 | 메서드 선언 | strictFunctionTypes 예외 |\n" +
        "| 불변 | 할당 불가 | 읽기+쓰기 동시 | Array<T> |\n\n" +
        "**핵심:** 반환값은 공변(더 구체적→더 일반적 할당 가능), 매개변수는 반변(더 일반적→더 구체적 할당 가능)입니다. strictFunctionTypes를 켜면 함수 매개변수의 안전한 반변 검사가 활성화됩니다.\n\n" +
        "**다음 챕터 미리보기:** 선언 병합(Declaration Merging)을 학습합니다. interface의 자동 병합, Module Augmentation, declare global 패턴으로 외부 라이브러리의 타입을 확장하는 방법을 다룹니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "반환값은 공변(더 구체적→더 일반적 할당 가능), 매개변수는 반변(더 일반적→더 구체적 할당 가능)이다. strictFunctionTypes를 켜면 함수 매개변수의 안전한 반변 검사가 활성화된다.",
  checklist: [
    "공변(Covariance)이 출력 위치(반환값)에 적용됨을 이해한다",
    "반변(Contravariance)이 입력 위치(매개변수)에 적용됨을 이해한다",
    "메서드 선언과 함수 프로퍼티의 타입 검사 차이를 설명할 수 있다",
    "strictFunctionTypes 옵션의 역할을 알고 있다",
    "실무에서 타입 호환성 에러를 만났을 때 원인을 진단할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "함수의 반환 타입에서 타입 호환성 방향은?",
      choices: [
        "반변 — 더 일반적인 타입만 할당 가능",
        "공변 — 더 구체적인 타입도 할당 가능",
        "불변 — 정확히 같은 타입만 할당 가능",
        "이변 — 양방향 모두 할당 가능",
      ],
      correctIndex: 1,
      explanation:
        "반환 타입은 공변(Covariant)입니다. () => Dog은 () => Animal 자리에 할당할 수 있습니다. Dog은 Animal의 서브타입이므로, Dog을 반환하는 것은 Animal을 반환하는 계약을 충족합니다.",
    },
    {
      id: "q2",
      question:
        "strictFunctionTypes 옵션의 효과는?",
      choices: [
        "모든 함수에 반환 타입을 명시하도록 강제",
        "함수 프로퍼티의 매개변수에 반변 검사 활성화",
        "화살표 함수만 허용",
        "함수 오버로딩을 금지",
      ],
      correctIndex: 1,
      explanation:
        "strictFunctionTypes는 함수 타입 프로퍼티(method: (arg: T) => void)의 매개변수에 대해 엄격한 반변 검사를 활성화합니다. 메서드 선언(method(arg: T))에는 여전히 이변이 적용됩니다.",
    },
    {
      id: "q3",
      question:
        "(a: Animal) => void 타입의 함수를 (a: Dog) => void 타입 변수에 할당하면? (strictFunctionTypes 켠 경우)",
      choices: [
        "에러 — Animal은 Dog의 슈퍼타입이므로 불가",
        "OK — 반변에 의해 허용",
        "에러 — 공변에 의해 불가",
        "경고만 표시",
      ],
      correctIndex: 1,
      explanation:
        "매개변수는 반변입니다. Animal을 처리할 수 있는 함수는 Dog도 처리할 수 있으므로(Dog은 Animal의 서브타입), (a: Animal) => void는 (a: Dog) => void 자리에 안전하게 할당 가능합니다.",
    },
    {
      id: "q4",
      question:
        "TypeScript에서 메서드 선언이 이변(Bivariance)을 허용하는 이유는?",
      choices: [
        "타입 안전성을 극대화하기 위해",
        "DOM API 등 기존 코드와의 호환성을 위한 실용적 타협",
        "성능 최적화를 위해",
        "다른 언어와의 호환을 위해",
      ],
      correctIndex: 1,
      explanation:
        "DOM API의 이벤트 핸들러 등 기존 JavaScript 패턴과의 호환성을 위해, 메서드 선언에서는 이변을 허용합니다. 엄격한 반변만 적용하면 기존 코드가 대량으로 에러를 일으키기 때문입니다.",
    },
    {
      id: "q5",
      question:
        "readonly Dog[]를 readonly Animal[] 변수에 할당할 수 있는 이유는?",
      choices: [
        "배열은 항상 호환된다",
        "readonly이므로 쓰기가 불가능하여 공변이 안전하다",
        "Dog과 Animal이 같은 구조이기 때문",
        "TypeScript의 버그",
      ],
      correctIndex: 1,
      explanation:
        "readonly 배열은 읽기만 가능하므로, 공변이 안전합니다. Cat을 추가하는 등의 쓰기 작업이 불가능하기 때문에, Dog[]를 Animal[]로 취급해도 타입 안전성이 깨지지 않습니다.",
    },
  ],
};

export default chapter;
