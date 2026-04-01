import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "16-prototype",
  subject: "js",
  title: "프로토타입",
  description: "프로토타입 객체의 구조, __proto__와 prototype 프로퍼티의 차이, Object.create를 활용한 상속 설계를 깊이 이해합니다.",
  order: 16,
  group: "this와 객체",
  prerequisites: ["15-constructor"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "프로토타입은 **사내 공용 물품 창고**와 같습니다.\n\n" +
        "모든 직원(인스턴스)은 개인 책상(자신의 프로퍼티)을 가지고 있습니다. " +
        "하지만 프린터나 회의실(공유 메서드)은 창고(프로토타입)에 하나만 있고 " +
        "필요할 때 꺼내 씁니다.\n\n" +
        "직원이 무언가를 찾을 때 먼저 자신의 책상을 확인하고, 없으면 창고로 갑니다. " +
        "창고에도 없으면 건물 관리실(상위 프로토타입)로 올라갑니다.\n\n" +
        "**`__proto__`**는 '이 직원의 창고가 어디야?'를 알려주는 표지판이고, " +
        "**`Constructor.prototype`**은 '이 부서(생성자)가 쓰는 창고'입니다. " +
        "**`Object.create(proto)`**는 지정된 창고를 쓰는 새 직원을 바로 뽑는 것입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "자바스크립트에는 클래스 기반 상속이 없었습니다(ES6 class 이전). " +
        "그런데도 메서드 공유와 상속을 어떻게 구현했을까요?\n\n" +
        "초보자가 자주 혼동하는 두 가지 개념:\n\n" +
        "1. **`__proto__` vs `prototype`** — 이름이 비슷하지만 완전히 다른 것\n" +
        "   - `__proto__`: 모든 객체가 갖는 내부 슬롯 `[[Prototype]]`의 접근자\n" +
        "   - `prototype`: 함수 객체만 갖는 프로퍼티, 생성할 인스턴스의 프로토타입\n\n" +
        "2. **직접 상속 설정** — 기존 생성자 없이 순수하게 프로토타입 관계를 맺는 방법\n\n" +
        "이 두 가지를 혼동하면 메서드를 잘못된 위치에 정의하거나 " +
        "의도하지 않은 프로토타입 오염이 발생합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 프로토타입 객체의 구조\n" +
        "모든 함수에는 `prototype` 프로퍼티가 있습니다. " +
        "`new Fn()`으로 생성한 인스턴스의 `[[Prototype]]`은 `Fn.prototype`을 가리킵니다. " +
        "`Fn.prototype.constructor`는 다시 `Fn`을 가리켜 순환 참조를 형성합니다.\n\n" +
        "### __proto__ 접근자\n" +
        "`obj.__proto__`는 `Object.prototype`의 접근자 프로퍼티로 `[[Prototype]]`을 읽고 씁니다. " +
        "표준 권고 방법은 `Object.getPrototypeOf(obj)` / `Object.setPrototypeOf(obj, proto)`입니다.\n\n" +
        "### 프로토타입에 메서드 정의\n" +
        "`Fn.prototype.method = function() {}`로 메서드를 추가하면 " +
        "이미 생성된 인스턴스를 포함한 모든 인스턴스에서 즉시 사용 가능합니다.\n\n" +
        "### Object.create\n" +
        "`Object.create(proto)`는 proto를 `[[Prototype]]`으로 갖는 새 객체를 생성합니다. " +
        "생성자 함수 없이 프로토타입 체인만 설정할 때 유용하며, " +
        "`Object.create(null)`은 프로토타입이 없는 순수 딕셔너리 객체를 만듭니다.\n\n" +
        "### 프로토타입 교체\n" +
        "`Fn.prototype = { ... }`로 교체하면 `constructor` 참조가 사라지므로 " +
        "반드시 `constructor: Fn`을 명시해야 합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 프로토타입 체인 구조",
      content:
        "생성자 함수, 프로토타입 객체, 인스턴스의 내부 연결을 의사코드로 시각화합니다.",
      code: {
        language: "typescript",
        code:
          "// === 프로토타입 관계 구조 ===\n" +
          "\n" +
          "function Animal(name) {\n" +
          "  this.name = name;\n" +
          "}\n" +
          "Animal.prototype.speak = function() {\n" +
          "  return `${this.name}이 소리를 냅니다.`;\n" +
          "};\n" +
          "\n" +
          "const cat = new Animal('고양이');\n" +
          "\n" +
          "// 메모리 상의 연결 구조 (의사코드):\n" +
          "// cat ──────────────────────────────────────────\n" +
          "//   [[Prototype]] ──▶ Animal.prototype\n" +
          "//   name: '고양이'       speak: function\n" +
          "//                        constructor ──▶ Animal\n" +
          "//                        [[Prototype]] ──▶ Object.prototype\n" +
          "//                                           hasOwnProperty: fn\n" +
          "//                                           toString: fn ...\n" +
          "//                                           [[Prototype]] ──▶ null\n" +
          "\n" +
          "// === 접근 방법 비교 ===\n" +
          "cat.__proto__ === Animal.prototype          // true (비권장)\n" +
          "Object.getPrototypeOf(cat) === Animal.prototype // true (권장)\n" +
          "\n" +
          "// === Object.create ===\n" +
          "const protoAnimal = {\n" +
          "  speak() { return `${this.name}이 소리를 냅니다.`; },\n" +
          "};\n" +
          "const dog = Object.create(protoAnimal);\n" +
          "dog.name = '강아지';\n" +
          "dog.speak(); // '강아지이 소리를 냅니다.'\n" +
          "\n" +
          "// === 순수 딕셔너리 ===\n" +
          "const dict = Object.create(null);\n" +
          "dict.key = 'value';\n" +
          "// dict.hasOwnProperty — TypeError! (프로토타입 없음)\n" +
          "Object.prototype.hasOwnProperty.call(dict, 'key'); // 안전한 대안",
        description: "Object.create(null)은 프로토타입 오염 없는 순수 딕셔너리가 필요할 때 사용합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 프로토타입으로 상속 구현",
      content:
        "ES6 class 없이 순수 프로토타입으로 Animal → Dog 상속 구조를 구현합니다.",
      code: {
        language: "javascript",
        code:
          "// 부모 생성자\n" +
          "function Animal(name) {\n" +
          "  this.name = name;\n" +
          "}\n" +
          "Animal.prototype.speak = function() {\n" +
          "  return `${this.name}이 소리를 냅니다.`;\n" +
          "};\n" +
          "\n" +
          "// 자식 생성자\n" +
          "function Dog(name, breed) {\n" +
          "  Animal.call(this, name);  // 부모 생성자 호출로 인스턴스 프로퍼티 상속\n" +
          "  this.breed = breed;\n" +
          "}\n" +
          "\n" +
          "// 프로토타입 체인 연결\n" +
          "Dog.prototype = Object.create(Animal.prototype);\n" +
          "Dog.prototype.constructor = Dog; // constructor 복구\n" +
          "\n" +
          "// 오버라이드\n" +
          "Dog.prototype.speak = function() {\n" +
          "  return `${this.name}이 멍멍!`;\n" +
          "};\n" +
          "\n" +
          "const fido = new Dog('피도', '리트리버');\n" +
          "console.log(fido.speak());             // '피도이 멍멍!'\n" +
          "console.log(fido instanceof Dog);      // true\n" +
          "console.log(fido instanceof Animal);   // true\n" +
          "console.log(fido.constructor === Dog); // true\n" +
          "\n" +
          "// 프로토타입 메서드 동적 추가\n" +
          "Animal.prototype.toString = function() {\n" +
          "  return `[Animal: ${this.name}]`;\n" +
          "};\n" +
          "console.log(fido.toString()); // '[Animal: 피도]' — 즉시 사용 가능",
        description: "Object.create로 프로토타입을 연결하고 constructor를 복구하는 패턴이 ES6 이전의 표준 상속 구현법입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 주체 | 용도 |\n" +
        "|------|------|------|\n" +
        "| `obj.__proto__` | 모든 객체 | [[Prototype]] 접근자 (비권장) |\n" +
        "| `Object.getPrototypeOf(obj)` | 모든 객체 | [[Prototype]] 읽기 (권장) |\n" +
        "| `Fn.prototype` | 함수 객체 | 인스턴스의 프로토타입 객체 |\n" +
        "| `Object.create(proto)` | - | proto를 [[Prototype]]으로 갖는 객체 생성 |\n\n" +
        "**핵심:** `__proto__`(인스턴스가 가리키는 곳)와 `prototype`(생성자가 갖는 것)을 " +
        "명확히 구분하세요. 메서드는 `Fn.prototype`에, 데이터는 인스턴스에 정의하는 것이 " +
        "메모리 효율적인 설계입니다.\n\n" +
        "**다음 챕터 미리보기:** 프로퍼티 검색이 프로토타입 체인을 따라 어떻게 전파되는지, " +
        "셰도잉과 hasOwnProperty, 상속 패턴을 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "모든 객체는 숨겨진 [[Prototype]] 링크로 다른 객체와 연결된다. 프로퍼티를 찾을 때 자기 자신에 없으면 이 링크를 따라 올라가며 탐색한다.",
  checklist: [
    "__proto__와 Constructor.prototype의 차이를 설명할 수 있다",
    "new로 생성된 인스턴스의 [[Prototype]] 연결을 그림으로 표현할 수 있다",
    "Object.create로 프로토타입을 수동 설정할 수 있다",
    "프로토타입에 메서드를 추가할 때 constructor 참조 문제를 인식한다",
    "프로토타입을 교체할 때 constructor를 복구하는 이유를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "모든 객체가 갖는 내부 슬롯 [[Prototype]]을 표준 방식으로 읽는 메서드는?",
      choices: [
        "obj.__proto__",
        "Object.getPrototypeOf(obj)",
        "obj.prototype",
        "Object.prototype(obj)",
      ],
      correctIndex: 1,
      explanation:
        "__proto__는 비공식 접근자로 레거시 지원을 위해 존재하며 사용을 권장하지 않습니다. " +
        "표준 방법은 Object.getPrototypeOf(obj)입니다.",
    },
    {
      id: "q2",
      question: "function Foo() {}에서 Foo.prototype.constructor는?",
      choices: ["Object", "Function", "Foo", "undefined"],
      correctIndex: 2,
      explanation:
        "함수가 생성될 때 prototype 객체도 함께 생성되며, " +
        "그 prototype.constructor는 함수 자신(Foo)을 가리킵니다.",
    },
    {
      id: "q3",
      question: "Object.create(null)로 생성한 객체의 특징은?",
      choices: [
        "Object.prototype의 메서드를 모두 갖는다",
        "프로토타입이 없는 순수 객체라 hasOwnProperty 등을 직접 쓸 수 없다",
        "undefined를 반환한다",
        "일반 객체와 완전히 동일하다",
      ],
      correctIndex: 1,
      explanation:
        "Object.create(null)은 [[Prototype]]이 null인 객체를 생성합니다. " +
        "Object.prototype의 메서드(hasOwnProperty, toString 등)를 상속받지 않아 " +
        "순수 딕셔너리로 사용하기 적합합니다.",
    },
    {
      id: "q4",
      question: "Dog.prototype = Object.create(Animal.prototype) 이후에 Dog.prototype.constructor를 복구해야 하는 이유는?",
      choices: [
        "성능 최적화를 위해",
        "교체 전 prototype 객체는 삭제되고 새 객체는 constructor가 Animal을 가리키기 때문",
        "instanceof가 동작하지 않기 때문",
        "Object.create가 constructor를 자동 설정하기 때문",
      ],
      correctIndex: 1,
      explanation:
        "Object.create(Animal.prototype)이 만든 새 객체의 constructor는 Animal을 가리킵니다. " +
        "Dog.prototype.constructor = Dog를 명시하지 않으면 " +
        "인스턴스의 constructor가 Animal이 되어 혼란을 유발합니다.",
    },
    {
      id: "q5",
      question: "프로토타입에 메서드를 추가하면 이미 생성된 인스턴스에도 영향을 미치는가?",
      choices: [
        "아니오, 추가 후 생성한 인스턴스에만 영향",
        "예, 프로토타입 체인을 통해 즉시 접근 가능",
        "예, 하지만 인스턴스를 재생성해야 함",
        "아니오, 프로토타입은 불변이다",
      ],
      correctIndex: 1,
      explanation:
        "인스턴스는 프로토타입 객체를 복사하지 않고 참조합니다. " +
        "따라서 프로토타입에 메서드를 추가하면 기존 인스턴스를 포함한 모든 인스턴스가 즉시 사용할 수 있습니다.",
    },
    {
      id: "q6",
      question: "인스턴스의 __proto__와 생성자의 prototype의 관계는?",
      choices: [
        "둘은 완전히 다른 독립적 객체이다",
        "instance.__proto__ === Constructor.prototype — 동일한 객체를 가리킨다",
        "Constructor.prototype이 instance.__proto__를 복사한 것이다",
        "__proto__는 prototype의 별칭이다",
      ],
      correctIndex: 1,
      explanation:
        "new Constructor()로 생성된 인스턴스의 [[Prototype]](= __proto__)은 " +
        "Constructor.prototype과 동일한 객체를 참조합니다. 복사가 아닌 참조입니다.",
    },
    {
      id: "q7",
      question: "다음 중 Object.create의 올바른 사용 사례는?",
      choices: [
        "생성자 없이 특정 객체를 프로토타입으로 갖는 새 객체 생성",
        "객체의 모든 프로퍼티를 깊은 복사",
        "두 객체를 병합",
        "객체를 배열로 변환",
      ],
      correctIndex: 0,
      explanation:
        "Object.create(proto)는 지정한 proto 객체를 [[Prototype]]으로 갖는 새 객체를 생성합니다. " +
        "생성자 함수 없이 상속 관계를 설정하거나, 순수 프로토타입 기반 상속을 구현할 때 사용합니다.",
    },
  ],
};

export default chapter;
