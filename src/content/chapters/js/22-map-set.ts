import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "22-map-set",
  subject: "js",
  title: "Map, Set, WeakMap, WeakSet",
  description: "Map과 Set의 특성과 일반 객체·배열과의 차이, WeakMap/WeakSet과 가비지 컬렉션의 관계, 실전 활용 패턴을 이해합니다.",
  order: 22,
  group: "빌트인과 표준 객체",
  prerequisites: ["21-array-hof"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "**Map vs 일반 객체**: 일반 객체는 키로 문자열/심볼만 쓸 수 있는 명함첩입니다. Map은 어떤 타입이든 키로 쓸 수 있는 배지 시스템입니다. 심지어 객체나 함수를 키로 사용할 수 있습니다.\n\n" +
        "**Set vs 배열**: 배열은 중복을 허용하는 줄서기입니다. Set은 중복 없는 회원 명단입니다. 같은 사람이 두 번 등록하려 해도 한 번만 기록됩니다.\n\n" +
        "**WeakMap/WeakSet**: '약한 참조'는 도서관 반납 시스템과 같습니다. 책(객체)을 빌렸다는 기록(WeakMap 항목)이 있어도, 책 자체가 폐기되면(가비지 컬렉션) 기록도 자동으로 사라집니다. WeakMap은 책이 실제로 존재하는 동안만 유효한 메타데이터를 저장합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "일반 객체와 배열만으로 해결하기 어려운 상황이 있습니다:\n\n" +
        "1. **키가 문자열이 아닌 경우**: DOM 노드나 함수를 키로 사용하고 싶을 때\n" +
        "2. **삽입 순서 보장 필요**: 객체의 키 순서는 스펙 상 완전히 보장되지 않습니다.\n" +
        "3. **유니크 값 컬렉션**: 배열에서 중복을 제거하려면 별도 로직이 필요합니다.\n" +
        "4. **메모리 누수**: 객체를 키로 캐시를 구현하면, 키 객체가 더 이상 필요 없어도 캐시가 참조를 유지해 GC되지 않습니다.\n\n" +
        "Map, Set, WeakMap, WeakSet은 이런 상황을 위해 설계된 특화 자료구조입니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### Map\n" +
        "- 임의 타입의 키-값 쌍을 저장합니다.\n" +
        "- 삽입 순서를 유지합니다.\n" +
        "- `size` 프로퍼티로 크기를 즉시 알 수 있습니다.\n" +
        "- `get()`, `set()`, `has()`, `delete()`, `clear()`, `forEach()`, `entries()` 메서드 제공.\n\n" +
        "### Set\n" +
        "- 중복 없는 고유 값의 컬렉션입니다.\n" +
        "- 삽입 순서를 유지합니다.\n" +
        "- `add()`, `has()`, `delete()`, `clear()`, `forEach()` 메서드 제공.\n" +
        "- ES2025부터 집합 연산 메서드가 표준으로 추가됨: `intersection()`, `union()`, `difference()`, `symmetricDifference()`, `isSubsetOf()`, `isSupersetOf()`, `isDisjointFrom()`.\n\n" +
        "### Map vs 객체 선택 기준\n" +
        "| 상황 | 권장 |\n" +
        "|------|------|\n" +
        "| 키가 문자열/심볼 | 객체 |\n" +
        "| 키가 임의 타입 | Map |\n" +
        "| 삽입 순서 중요 | Map |\n" +
        "| JSON 직렬화 필요 | 객체 |\n" +
        "| 자주 추가/삭제 | Map |\n\n" +
        "### WeakMap / WeakSet\n" +
        "- 키는 반드시 **객체**여야 합니다.\n" +
        "- 키 객체에 대한 참조가 약한 참조(Weak Reference)이므로, 키 객체가 더 이상 다른 곳에서 참조되지 않으면 GC가 수거할 수 있습니다.\n" +
        "- 이터러블이 아닙니다. (`forEach`, `size` 없음)\n" +
        "- **주요 사용 사례**: DOM 노드 메타데이터 캐싱, 프라이빗 데이터 저장, 메모이제이션",
    },
    {
      type: "pseudocode",
      title: "기술 구현: WeakMap과 메모리 관리",
      content:
        "WeakMap을 이용한 프라이빗 데이터 패턴과 메모리 동작을 살펴봅니다.",
      code: {
        language: "javascript",
        code:
          "// === WeakMap으로 프라이빗 데이터 구현 ===\n" +
          "const _private = new WeakMap();\n\n" +
          "class Person {\n" +
          "  constructor(name, age) {\n" +
          "    _private.set(this, { name, age }); // 인스턴스를 키로 사용\n" +
          "  }\n" +
          "  getName() {\n" +
          "    return _private.get(this).name; // 외부 접근 불가\n" +
          "  }\n" +
          "}\n\n" +
          "let person = new Person('Alice', 30);\n" +
          "console.log(person.getName()); // 'Alice'\n\n" +
          "// person이 GC되면 WeakMap의 항목도 자동으로 제거됨\n" +
          "person = null; // GC 대상이 됨\n\n" +
          "// === Map으로 메모이제이션 (강한 참조) ===\n" +
          "const cache = new Map();\n" +
          "function memoize(fn) {\n" +
          "  return function(arg) {\n" +
          "    if (cache.has(arg)) return cache.get(arg);\n" +
          "    const result = fn(arg);\n" +
          "    cache.set(arg, result);\n" +
          "    return result;\n" +
          "  };\n" +
          "}\n\n" +
          "// === Set으로 고유값 관리 ===\n" +
          "const visited = new Set();\n" +
          "function visit(url) {\n" +
          "  if (visited.has(url)) return '이미 방문함';\n" +
          "  visited.add(url);\n" +
          "  return '새로운 방문';\n" +
          "}",
        description:
          "WeakMap은 키 객체의 생명주기와 함께 데이터가 자동으로 정리되므로 메모리 누수를 방지합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Map과 Set 실전 활용",
      content:
        "중복 제거, 그룹핑, 캐싱 등 실무에서 자주 쓰이는 패턴을 구현합니다.",
      code: {
        language: "javascript",
        code:
          "// 1. Set으로 배열 중복 제거\n" +
          "const nums = [1, 2, 2, 3, 3, 3, 4];\n" +
          "const unique = [...new Set(nums)];\n" +
          "console.log(unique); // [1, 2, 3, 4]\n\n" +
          "// 2. Map으로 빈도 카운팅\n" +
          "const words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple'];\n" +
          "const freq = words.reduce((map, word) => {\n" +
          "  map.set(word, (map.get(word) ?? 0) + 1);\n" +
          "  return map;\n" +
          "}, new Map());\n\n" +
          "console.log(freq.get('apple'));  // 3\n" +
          "console.log(freq.get('banana')); // 2\n\n" +
          "// Map을 정렬된 배열로 변환\n" +
          "const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);\n" +
          "console.log(sorted); // [['apple',3], ['banana',2], ['cherry',1]]\n\n" +
          "// 3. Set 집합 연산 (ES2025 표준 메서드)\n" +
          "const setA = new Set([1, 2, 3, 4]);\n" +
          "const setB = new Set([3, 4, 5, 6]);\n\n" +
          "const union        = setA.union(setB);              // Set {1,2,3,4,5,6}\n" +
          "const intersection = setA.intersection(setB);       // Set {3,4}\n" +
          "const difference   = setA.difference(setB);         // Set {1,2}\n" +
          "const symDiff      = setA.symmetricDifference(setB); // Set {1,2,5,6}\n\n" +
          "console.log([...union]);        // [1,2,3,4,5,6]\n" +
          "console.log([...intersection]); // [3,4]\n" +
          "console.log([...difference]);   // [1,2]\n" +
          "console.log([...symDiff]);      // [1,2,5,6]\n\n" +
          "// 레거시 방식 (스프레드 + filter)\n" +
          "// const intersection = new Set([...setA].filter(x => setB.has(x)));",
        description:
          "ES2025부터 Set에 집합 연산 메서드가 표준으로 추가되었습니다. 레거시 환경에서는 스프레드와 filter를 조합해 구현할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| | Map | Set | WeakMap | WeakSet |\n" +
        "|-|-----|-----|---------|--------|\n" +
        "| 키 타입 | 임의 | - | 객체만 | 객체만 |\n" +
        "| 중복 | 키 유니크 | 값 유니크 | 키 유니크 | 값 유니크 |\n" +
        "| 이터러블 | O | O | X | X |\n" +
        "| 약한 참조 | X | X | O | O |\n" +
        "| size | O | O | X | X |\n\n" +
        "**선택 가이드:**\n" +
        "- 임의 타입 키-값 → Map\n" +
        "- 중복 없는 컬렉션 → Set\n" +
        "- 객체에 메타데이터 부착 + 메모리 누수 방지 → WeakMap\n" +
        "- 객체 방문 여부 추적 + 메모리 누수 방지 → WeakSet\n\n" +
        "**다음 챕터 미리보기:** 정규 표현식으로 문자열 패턴 매칭과 치환을 마스터합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "Map은 키에 어떤 타입이든 쓸 수 있는 사전이고, Set은 중복 없는 값의 모음이다. 객체 키가 필요하거나 중복 제거가 필요하면 Object/Array 대신 이들을 선택하라.",
  checklist: [
    "Map과 일반 객체의 차이와 각각의 사용 시나리오를 설명할 수 있다",
    "Set으로 배열의 중복을 제거하는 방법을 안다",
    "WeakMap/WeakSet이 가비지 컬렉션에 영향을 주지 않는 이유를 설명할 수 있다",
    "Map과 Set의 주요 메서드(get/set/has/delete/add)를 사용할 수 있다",
    "Set의 집합 연산 메서드(intersection, union, difference 등)를 사용할 수 있다",
    "WeakMap을 이용한 프라이빗 데이터 패턴을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Map과 일반 객체의 핵심 차이로 올바르지 않은 것은?",
      choices: [
        "Map은 임의 타입을 키로 사용할 수 있다",
        "Map은 삽입 순서를 보장한다",
        "Map은 JSON.stringify()로 직렬화할 수 없다",
        "Map은 Symbol만 키로 사용할 수 있다",
      ],
      correctIndex: 3,
      explanation:
        "Map은 숫자, 문자열, 객체, 함수 등 어떤 타입이든 키로 사용할 수 있습니다. Symbol만 사용 가능한 것은 아닙니다. Map이 Symbol 외 타입도 키로 쓸 수 있다는 점이 일반 객체(문자열/심볼만 키)와의 핵심 차이입니다.",
    },
    {
      id: "q2",
      question: "new Set([1, 2, 2, 3, 3, 3]).size의 결과는?",
      choices: ["6", "3", "1", "undefined"],
      correctIndex: 1,
      explanation:
        "Set은 중복을 허용하지 않습니다. 1, 2, 3 총 3개의 고유한 값만 저장되므로 size는 3입니다.",
    },
    {
      id: "q3",
      question: "WeakMap의 특징으로 올바른 것은?",
      choices: [
        "문자열도 키로 사용할 수 있다",
        "forEach로 순회할 수 있다",
        "키 객체가 GC되면 항목도 자동으로 제거된다",
        "size 프로퍼티로 크기를 알 수 있다",
      ],
      correctIndex: 2,
      explanation:
        "WeakMap은 키에 대한 약한 참조를 유지합니다. 키 객체가 다른 곳에서 참조되지 않으면 GC가 수거하고 WeakMap의 해당 항목도 사라집니다. WeakMap은 이터러블이 아니므로 forEach나 size를 사용할 수 없습니다.",
    },
    {
      id: "q4",
      question: "두 Set의 교집합을 구하는 올바른 코드는?",
      choices: [
        "new Set([...a, ...b])",
        "a.filter(x => b.has(x))",
        "new Set([...a].filter(x => !b.has(x)))",
        "a.intersection(b)",
      ],
      correctIndex: 3,
      explanation:
        "ES2025부터 Set.prototype.intersection()이 표준 메서드로 추가되었습니다. a.intersection(b)는 a와 b 모두에 포함된 요소로 구성된 새 Set을 반환합니다. 레거시 환경에서는 new Set([...a].filter(x => b.has(x)))를 사용할 수 있습니다.",
    },
    {
      id: "q5",
      question: "Map에서 존재하지 않는 키를 get()으로 조회하면?",
      choices: ["null", "undefined", "0", "Error 발생"],
      correctIndex: 1,
      explanation:
        "Map.get()은 키가 존재하지 않을 때 undefined를 반환합니다. 존재 여부를 먼저 확인하려면 has()를 사용하거나 ?? 연산자로 기본값을 제공하세요.",
    },
    {
      id: "q6",
      question: "WeakSet에 원시값(예: 숫자 42)을 추가하면?",
      choices: [
        "정상 추가됨",
        "무시됨",
        "TypeError 발생",
        "자동으로 객체로 변환되어 추가됨",
      ],
      correctIndex: 2,
      explanation:
        "WeakSet과 WeakMap의 키는 반드시 객체여야 합니다. 원시값을 추가하려고 하면 TypeError가 발생합니다.",
    },
  ],
};

export default chapter;
