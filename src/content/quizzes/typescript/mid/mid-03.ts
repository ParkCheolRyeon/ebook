import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-03",
  title: "중간 점검 3: 타입 시스템 ~ React+TS",
  coverGroups: ["타입 시스템 심화", "클래스와 OOP", "React + TypeScript"],
  questions: [
    {
      id: "mid03-q1",
      question:
        "TypeScript가 구조적 타이핑(Structural Typing)을 사용한다는 것의 의미는?",
      choices: [
        "타입의 이름이 같아야 호환된다",
        "타입의 구조(속성과 메서드)가 호환되면 이름이 달라도 할당 가능하다",
        "클래스 상속 관계가 있어야 호환된다",
        "명시적 implements가 필요하다",
      ],
      correctIndex: 1,
      explanation:
        "TypeScript는 명목적(nominal) 타이핑이 아닌 구조적 타이핑을 사용합니다. 두 타입의 구조가 호환되면 (필요한 속성을 모두 가지면) 이름이 달라도 서로 할당할 수 있습니다.",
    },
    {
      id: "mid03-q2",
      question:
        "Branded Type의 목적과 구현 방식은?\n\ntype USD = number & { __brand: \"USD\" };\ntype EUR = number & { __brand: \"EUR\" };",
      choices: [
        "런타임에 통화를 구분하기 위해 사용한다",
        "구조적으로 동일한 타입을 명목적으로 구분하여 실수로 섞이는 것을 컴파일 타임에 방지한다",
        "숫자에 문자열 메서드를 추가한다",
        "JSON 직렬화를 위해 사용한다",
      ],
      correctIndex: 1,
      explanation:
        "Branded Type은 __brand 같은 유령 속성(phantom property)을 인터섹션으로 추가하여 구조적으로 같은 타입을 구분합니다. USD와 EUR는 둘 다 number이지만 서로 할당할 수 없게 됩니다.",
    },
    {
      id: "mid03-q3",
      question:
        "함수 매개변수가 반공변(contravariant)이라는 것은 무엇을 의미하는가?\n\ntype Animal = { name: string };\ntype Dog = Animal & { breed: string };",
      choices: [
        "Dog를 받는 함수를 Animal을 받는 함수에 할당할 수 있다",
        "Animal을 받는 함수를 Dog를 받는 함수에 할당할 수 있다 (상위 타입이 하위에 할당 가능)",
        "함수 매개변수는 항상 공변이다",
        "매개변수 타입은 호환성에 영향을 주지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "반공변에서는 상위 타입(Animal)을 받는 함수가 하위 타입(Dog)을 받는 함수에 할당 가능합니다. Animal을 처리할 수 있는 함수는 Dog도 처리할 수 있기 때문입니다. strictFunctionTypes 옵션으로 이를 엄격히 검사합니다.",
    },
    {
      id: "mid03-q4",
      question:
        "선언 병합(Declaration Merging)이 실제로 유용한 경우는?",
      choices: [
        "동일 파일 내에서 interface를 재선언할 때",
        "외부 라이브러리의 타입을 확장할 때 (예: Express의 Request에 사용자 정보 추가)",
        "type alias를 병합할 때",
        "함수 오버로딩을 대체할 때",
      ],
      correctIndex: 1,
      explanation:
        "선언 병합은 외부 라이브러리의 타입을 수정하지 않고 확장할 때 가장 유용합니다. 예를 들어 Express.Request에 user 속성을 추가하거나, Window에 커스텀 속성을 추가할 수 있습니다.",
    },
    {
      id: "mid03-q5",
      question:
        ".d.ts 파일의 역할은?",
      choices: [
        "JavaScript 코드를 TypeScript로 변환한다",
        "타입 선언만 포함하며, JavaScript 라이브러리에 타입 정보를 제공한다",
        "런타임에 타입 검사를 수행한다",
        "TypeScript 컴파일 속도를 높인다",
      ],
      correctIndex: 1,
      explanation:
        ".d.ts 파일은 구현 없이 타입 정보만 선언합니다. JavaScript로 작성된 라이브러리에 타입을 제공하여 TypeScript에서 사용할 수 있게 합니다. @types/ 패키지가 대표적인 예입니다.",
    },
    {
      id: "mid03-q6",
      question:
        "다음 abstract class의 특징으로 올바른 것은?\n\nabstract class Shape {\n  abstract area(): number;\n  describe() {\n    return `넓이: ${this.area()}`;\n  }\n}",
      choices: [
        "new Shape()로 인스턴스를 생성할 수 있다",
        "abstract 메서드는 구현을 가질 수 없고, 서브클래스에서 반드시 구현해야 한다",
        "describe 메서드도 서브클래스에서 재정의해야 한다",
        "abstract class는 속성을 가질 수 없다",
      ],
      correctIndex: 1,
      explanation:
        "abstract class는 직접 인스턴스화할 수 없으며, abstract 메서드는 구현 없이 시그니처만 정의합니다. 서브클래스에서 반드시 구현해야 합니다. 일반 메서드(describe)는 그대로 상속됩니다.",
    },
    {
      id: "mid03-q7",
      question:
        "TypeScript 5.0+ 데코레이터의 특징은?",
      choices: [
        "experimentalDecorators 플래그가 항상 필요하다",
        "TC39 Stage 3 표준을 따르며, 별도 플래그 없이 사용 가능하다",
        "클래스에만 사용할 수 있다",
        "런타임에 제거된다",
      ],
      correctIndex: 1,
      explanation:
        "TypeScript 5.0부터 TC39 Stage 3 표준 데코레이터를 지원합니다. 기존 experimentalDecorators와는 다른 구현이며, 별도 플래그 없이 사용할 수 있습니다.",
    },
    {
      id: "mid03-q8",
      question:
        "React 컴포넌트의 props 타입을 정의할 때 권장되는 방식은?\n\n// A\ninterface ButtonProps { label: string; onClick: () => void; }\n// B\ntype ButtonProps = { label: string; onClick: () => void; };",
      choices: [
        "A만 사용 가능하다",
        "둘 다 사용 가능하며, 팀 컨벤션에 따라 선택하면 된다",
        "B만 사용 가능하다",
        "props 타입은 제네릭으로만 정의해야 한다",
      ],
      correctIndex: 1,
      explanation:
        "React props 타입은 interface와 type 모두로 정의할 수 있습니다. interface는 확장성, type은 유니온/인터섹션 활용에 유리합니다. 프로젝트 내 일관성을 유지하는 것이 중요합니다.",
    },
    {
      id: "mid03-q9",
      question:
        "다음 코드에서 useState의 타입 매개변수가 필요한 이유는?\n\nconst [user, setUser] = useState<User | null>(null);",
      choices: [
        "null은 타입이 없기 때문이다",
        "초기값 null만으로는 미래에 들어올 User 타입을 추론할 수 없기 때문이다",
        "useState는 항상 타입 매개변수가 필요하다",
        "TypeScript가 null을 허용하지 않기 때문이다",
      ],
      correctIndex: 1,
      explanation:
        "초기값이 null이면 TypeScript는 상태 타입을 null로만 추론합니다. 나중에 User 객체를 설정하려면 제네릭으로 User | null을 명시해야 합니다. 초기값에서 타입을 유추할 수 있으면 생략 가능합니다.",
    },
    {
      id: "mid03-q10",
      question:
        "React 이벤트 타이핑에서 올바른 것은?\n\nconst handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n  console.log(e.target.value);\n};",
      choices: [
        "e의 타입을 any로 지정해도 동일하다",
        "React.ChangeEvent<HTMLInputElement>로 정확한 요소를 지정하면 e.target.value에 자동완성과 타입 안전성을 얻는다",
        "이벤트 타입은 항상 Event로만 지정해야 한다",
        "제네릭 매개변수는 불필요하다",
      ],
      correctIndex: 1,
      explanation:
        "React 이벤트 타입에 HTML 요소를 제네릭으로 전달하면 target의 속성(value, checked 등)에 대해 타입 안전성과 자동완성을 얻습니다. 요소별 고유 속성을 정확히 추론합니다.",
    },
  ],
};

export default midQuiz;
