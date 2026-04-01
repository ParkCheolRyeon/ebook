import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "17-prototype-chain",
  subject: "js",
  title: "프로토타입 체인과 상속",
  description: "프로토타입 체인의 동작 원리, 프로퍼티 셰도잉, hasOwnProperty, instanceof, 그리고 실용적인 상속 패턴을 깊이 이해합니다.",
  order: 17,
  group: "this와 객체",
  prerequisites: ["16-prototype"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "프로토타입 체인은 **회사 조직도를 따라 권한을 위임받는 구조**와 같습니다.\n\n" +
        "신입 사원(인스턴스)이 특정 업무를 처리해야 할 때, " +
        "먼저 자신의 역량(자체 프로퍼티)으로 해결 가능한지 확인합니다. " +
        "안 되면 팀장(직접 프로토타입)에게, 팀장도 모르면 부서장(상위 프로토타입)에게 올라갑니다. " +
        "최상위 CEO(Object.prototype)까지 올라가도 없으면 '해당 업무 없음'(undefined)입니다.\n\n" +
        "**프로퍼티 셰도잉**은 팀장이 할 줄 아는 일을 신입이 자신만의 방식으로 처리하는 것입니다. " +
        "신입이 담당하면 팀장의 방식은 가려집니다.\n\n" +
        "**hasOwnProperty**는 '이 업무가 신입 자신의 직접 역량인지, 아니면 위임받은 것인지'를 구분하는 확인서입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프로토타입 체인이 항상 편리한 것만은 아닙니다. 다음과 같은 문제들이 발생합니다.\n\n" +
        "1. **의도치 않은 프로퍼티 상속** — `for...in`이 상속된 프로퍼티까지 순회\n" +
        "2. **셰도잉 오해** — 자식에서 프로퍼티를 추가해도 부모의 프로퍼티는 그대로\n" +
        "3. **instanceof의 함정** — 같은 구조더라도 다른 realm에서 생성된 객체는 false\n" +
        "4. **상속 깊이에 따른 성능** — 체인이 깊을수록 프로퍼티 탐색 비용 증가\n\n" +
        "이런 동작을 이해하지 못하면 디버깅이 매우 어려워집니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 프로토타입 체인 동작\n" +
        "프로퍼티 접근 시 엔진은 현재 객체 → `[[Prototype]]` → 그 상위 → ... → `Object.prototype` → `null` 순서로 탐색합니다. " +
        "`null`에 도달하면 `undefined`를 반환합니다.\n\n" +
        "### 프로퍼티 셰도잉\n" +
        "인스턴스에 프로토타입과 동일한 이름의 프로퍼티를 추가하면 프로토타입 것이 가려집니다. " +
        "삭제하면(`delete instance.prop`) 프로토타입의 프로퍼티가 다시 드러납니다. " +
        "`delete`는 프로토타입 체인을 거슬러 올라가지 않습니다.\n\n" +
        "### hasOwnProperty\n" +
        "`obj.hasOwnProperty(key)`는 해당 프로퍼티가 객체 자신의 것인지(프로토타입 제외) 반환합니다. " +
        "안전한 대안: `Object.hasOwn(obj, key)` (ES2022+).\n\n" +
        "### instanceof\n" +
        "`obj instanceof Constructor`는 `Constructor.prototype`이 `obj`의 프로토타입 체인 어딘가에 있는지 검사합니다.\n\n" +
        "### 실용 상속 패턴\n" +
        "- **프로토타입 기반** — `Object.create` + 명시적 메서드 정의 (ES5 이하)\n" +
        "- **혼합(Mixin) 패턴** — 여러 소스에서 메서드를 `Object.assign`으로 복사\n" +
        "- **ES6 class** — 다음 챕터에서 다루는 문법적 설탕(syntactic sugar)",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 프로퍼티 탐색 알고리즘",
      content:
        "프로퍼티 읽기·쓰기·삭제 시 엔진의 체인 탐색 과정을 의사코드로 표현합니다.",
      code: {
        language: "typescript",
        code:
          "// 프로퍼티 '읽기' 알고리즘\n" +
          "function getProperty(obj, key) {\n" +
          "  let current = obj;\n" +
          "  while (current !== null) {\n" +
          "    if (Object.prototype.hasOwnProperty.call(current, key)) {\n" +
          "      return current[key]; // 찾음!\n" +
          "    }\n" +
          "    current = Object.getPrototypeOf(current); // 위로 올라감\n" +
          "  }\n" +
          "  return undefined; // 체인 끝까지 없음\n" +
          "}\n" +
          "\n" +
          "// === 셰도잉 예시 ===\n" +
          "function Animal(name) { this.name = name; }\n" +
          "Animal.prototype.type = '동물';\n" +
          "\n" +
          "const cat = new Animal('냥이');\n" +
          "cat.type;              // '동물' (프로토타입에서)\n" +
          "cat.type = '고양이';   // 셰도잉: cat 자신에 추가\n" +
          "cat.type;              // '고양이' (자신의 것)\n" +
          "Animal.prototype.type; // '동물' (프로토타입은 변하지 않음)\n" +
          "delete cat.type;       // 셰도잉 제거\n" +
          "cat.type;              // '동물' (다시 프로토타입에서)\n" +
          "\n" +
          "// === hasOwnProperty vs in ===\n" +
          "cat.hasOwnProperty('name');   // true (자신의 것)\n" +
          "cat.hasOwnProperty('type');   // false (프로토타입)\n" +
          "'type' in cat;                 // true (체인 탐색)\n" +
          "Object.hasOwn(cat, 'name');   // true (ES2022+ 권장)\n" +
          "\n" +
          "// === instanceof ===\n" +
          "cat instanceof Animal;  // true\n" +
          "cat instanceof Object;  // true (최상위)\n" +
          "\n" +
          "// instanceof 내부 동작 (의사코드)\n" +
          "function instanceOf(obj, Constructor) {\n" +
          "  let proto = Object.getPrototypeOf(obj);\n" +
          "  while (proto !== null) {\n" +
          "    if (proto === Constructor.prototype) return true;\n" +
          "    proto = Object.getPrototypeOf(proto);\n" +
          "  }\n" +
          "  return false;\n" +
          "}",
        description: "프로퍼티 탐색과 instanceof는 동일한 프로토타입 체인 순회 알고리즘을 사용합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Mixin 패턴으로 다중 상속 구현",
      content:
        "단일 체인의 한계를 보완하기 위해 Mixin으로 여러 소스의 기능을 하나의 클래스에 합칩니다.",
      code: {
        language: "javascript",
        code:
          "// Mixin: 공유할 기능 모음 (순수 객체)\n" +
          "const Serializable = {\n" +
          "  serialize() {\n" +
          "    return JSON.stringify(this);\n" +
          "  },\n" +
          "  deserialize(json) {\n" +
          "    return Object.assign(this, JSON.parse(json));\n" +
          "  },\n" +
          "};\n" +
          "\n" +
          "const Validatable = {\n" +
          "  validate() {\n" +
          "    return Object.keys(this).every(key => this[key] !== null);\n" +
          "  },\n" +
          "};\n" +
          "\n" +
          "// 생성자 함수에 Mixin 적용\n" +
          "function User(name, email) {\n" +
          "  this.name = name;\n" +
          "  this.email = email;\n" +
          "}\n" +
          "\n" +
          "// Object.assign으로 프로토타입에 메서드 복사\n" +
          "Object.assign(User.prototype, Serializable, Validatable);\n" +
          "\n" +
          "const user = new User('Alice', 'alice@example.com');\n" +
          "console.log(user.validate());  // true\n" +
          "console.log(user.serialize()); // '{\"name\":\"Alice\",\"email\":\"alice@example.com\"}'\n" +
          "\n" +
          "// hasOwnProperty로 안전한 for...in\n" +
          "for (const key in user) {\n" +
          "  if (Object.hasOwn(user, key)) {       // 자신의 프로퍼티만\n" +
          "    console.log(`${key}: ${user[key]}`);\n" +
          "  }\n" +
          "}\n" +
          "// name: Alice\n" +
          "// email: alice@example.com",
        description: "Mixin 패턴은 단일 프로토타입 체인의 제약을 극복하여 여러 기능을 조합할 때 사용하는 실용적 패턴입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| 프로토타입 체인 | 자신 → proto → ... → Object.prototype → null |\n" +
        "| 프로퍼티 셰도잉 | 인스턴스에 같은 이름 추가 시 프로토타입 것이 가려짐 |\n" +
        "| hasOwnProperty | 자신의 프로퍼티 여부 (체인 미포함) |\n" +
        "| Object.hasOwn | ES2022+ hasOwnProperty 안전 대체 |\n" +
        "| instanceof | 프로토타입 체인에 Constructor.prototype 존재 여부 |\n" +
        "| Mixin | Object.assign으로 여러 소스 기능을 프로토타입에 병합 |\n\n" +
        "**핵심:** 프로토타입 체인은 프로퍼티 탐색을 위·아래로 전파하는 단방향 연결 리스트입니다. " +
        "`for...in`보다 `Object.keys`를, `hasOwnProperty`보다 `Object.hasOwn`을 사용하면 " +
        "더 안전한 코드를 작성할 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** ES6 class 문법이 프로토타입 기반 상속을 어떻게 감싸는지, " +
        "extends·super·private 필드까지 전체 class 생태계를 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  checklist: [
    "프로퍼티 탐색이 프로토타입 체인을 어떻게 따라가는지 설명할 수 있다",
    "프로퍼티 셰도잉과 delete로 인한 동작 변화를 설명할 수 있다",
    "hasOwnProperty/Object.hasOwn으로 자신의 프로퍼티만 안전하게 확인할 수 있다",
    "instanceof의 내부 동작을 프로토타입 체인 관점에서 설명할 수 있다",
    "Mixin 패턴으로 여러 기능을 하나의 생성자에 합치는 코드를 작성할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "프로토타입 체인 탐색이 끝나는 조건은?",
      choices: [
        "Object.prototype에 도달했을 때",
        "[[Prototype]]이 null인 객체에 도달했을 때",
        "프로퍼티를 찾았을 때만",
        "탐색 깊이가 10을 넘었을 때",
      ],
      correctIndex: 1,
      explanation:
        "프로토타입 체인은 [[Prototype]]이 null인 객체(일반적으로 Object.prototype의 [[Prototype]])에 도달하면 종료됩니다. " +
        "이때 프로퍼티를 찾지 못하면 undefined를 반환합니다.",
    },
    {
      id: "q2",
      question: "인스턴스에 프로토타입과 같은 이름의 프로퍼티를 추가하면?",
      choices: [
        "프로토타입의 프로퍼티가 덮어써진다",
        "TypeError가 발생한다",
        "인스턴스에 새 프로퍼티가 추가되고 프로토타입 것이 가려진다(셰도잉)",
        "두 프로퍼티가 함께 존재한다",
      ],
      correctIndex: 2,
      explanation:
        "프로퍼티 셰도잉이 발생합니다. 인스턴스 자신에 프로퍼티가 생기고, " +
        "이 이름으로 접근하면 인스턴스의 것이 반환됩니다. 프로토타입의 프로퍼티는 삭제되지 않고 가려진 상태입니다.",
    },
    {
      id: "q3",
      question: "obj.hasOwnProperty('key')가 false를 반환하는 경우는?",
      choices: [
        "key가 obj 자신의 프로퍼티일 때",
        "key가 프로토타입 체인에서 상속된 프로퍼티일 때",
        "obj가 null일 때",
        "key가 함수일 때",
      ],
      correctIndex: 1,
      explanation:
        "hasOwnProperty는 체인을 거슬러 올라가지 않고 해당 객체 자신에게 프로퍼티가 있는지만 확인합니다. " +
        "상속된 프로퍼티에 대해서는 false를 반환합니다.",
    },
    {
      id: "q4",
      question: "delete instance.prop이 프로토타입의 같은 이름 프로퍼티에 영향을 미치는가?",
      choices: [
        "예, 체인을 따라 삭제한다",
        "아니오, delete는 자신의 프로퍼티만 삭제한다",
        "예, 셰도잉된 경우에만 삭제한다",
        "TypeError가 발생한다",
      ],
      correctIndex: 1,
      explanation:
        "delete 연산자는 프로토타입 체인을 거슬러 올라가지 않습니다. " +
        "인스턴스 자신의 프로퍼티만 삭제하며, 삭제 후에는 프로토타입의 같은 이름 프로퍼티가 다시 드러납니다.",
    },
    {
      id: "q5",
      question: "cat instanceof Animal이 true인 조건은?",
      choices: [
        "cat이 Animal 함수로 직접 생성되었을 때만",
        "Animal.prototype이 cat의 프로토타입 체인 어딘가에 존재할 때",
        "cat.constructor === Animal일 때",
        "cat과 Animal의 이름이 같을 때",
      ],
      correctIndex: 1,
      explanation:
        "instanceof는 프로토타입 체인을 순회하며 Constructor.prototype 객체가 존재하는지 확인합니다. " +
        "직접 생성하지 않아도 상속 관계에 있으면 true가 됩니다.",
    },
    {
      id: "q6",
      question: "for...in 대신 Object.keys()를 권장하는 주된 이유는?",
      choices: [
        "Object.keys()가 더 빠르다",
        "for...in이 프로토타입 체인의 열거 가능 프로퍼티까지 순회하기 때문",
        "for...in은 배열에서 동작하지 않기 때문",
        "Object.keys()는 메서드도 포함하기 때문",
      ],
      correctIndex: 1,
      explanation:
        "for...in은 프로토타입 체인의 열거 가능 프로퍼티까지 순회합니다. " +
        "Object.keys()는 자신의 열거 가능 프로퍼티만 배열로 반환하여 의도치 않은 순회를 방지합니다.",
    },
    {
      id: "q7",
      question: "Object.assign(Target.prototype, MixinA, MixinB)의 결과는?",
      choices: [
        "Target이 MixinA와 MixinB를 직접 상속한다",
        "MixinA, MixinB의 프로퍼티가 Target.prototype에 복사된다",
        "Target.prototype의 [[Prototype]]이 변경된다",
        "MixinA와 MixinB가 병합된 새 객체가 반환된다",
      ],
      correctIndex: 1,
      explanation:
        "Object.assign은 소스 객체들의 열거 가능 자체 프로퍼티를 대상 객체에 얕게 복사합니다. " +
        "프로토타입 체인이 변경되는 것이 아니라 메서드가 직접 복사되는 방식입니다.",
    },
  ],
};

export default chapter;
