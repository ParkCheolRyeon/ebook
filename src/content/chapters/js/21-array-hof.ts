import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "21-array-hof",
  subject: "js",
  title: "배열과 고차 함수",
  description: "배열 생성, 핵심 배열 메서드, forEach/map/filter/reduce 등 고차 함수와 메서드 체이닝, 배열 디스트럭처링을 마스터합니다.",
  order: 21,
  group: "빌트인과 표준 객체",
  prerequisites: ["20-wrapper-objects"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "배열 고차 함수는 **공장의 컨베이어 벨트 시스템**과 같습니다.\n\n" +
        "원자재(배열)가 컨베이어 벨트에 올라가면:\n\n" +
        "- **forEach**: 각 물건을 꺼내 확인만 합니다. 결과물을 만들지 않습니다.\n" +
        "- **map**: 각 물건을 변환해서 새 컨베이어 벨트에 올립니다. (금속 → 부품)\n" +
        "- **filter**: 검사 기준을 통과한 물건만 다음 벨트로 보냅니다. (불량품 제거)\n" +
        "- **reduce**: 모든 물건을 하나로 합칩니다. (부품들 → 완성품)\n" +
        "- **find**: 첫 번째로 조건에 맞는 물건을 꺼냅니다.\n" +
        "- **some**: 하나라도 조건에 맞으면 '있음'을 알립니다.\n" +
        "- **every**: 모든 물건이 조건에 맞아야 '전부 OK'를 알립니다.\n\n" +
        "메서드 체이닝은 컨베이어 벨트를 연결해서 자동화 라인을 만드는 것입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "배열을 다루는 코드에서 흔히 보이는 패턴이 있습니다:\n\n" +
        "```javascript\n" +
        "// for 루프를 남발하는 명령형 스타일\n" +
        "const result = [];\n" +
        "for (let i = 0; i < users.length; i++) {\n" +
        "  if (users[i].age >= 20) {\n" +
        "    result.push(users[i].name.toUpperCase());\n" +
        "  }\n" +
        "}\n" +
        "```\n\n" +
        "이 코드는 무엇을 하는지 한 눈에 파악하기 어렵습니다. 인덱스 관리, 조건 분기, 결과 수집 로직이 뒤섞여 있습니다.\n\n" +
        "또한 비슷한 반복 패턴이 코드베이스 전반에 흩어지면 유지보수가 어려워집니다.\n\n" +
        "고차 함수는 **무엇을 하는지(what)**에 집중하고 **어떻게 하는지(how)**를 추상화합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 핵심 고차 함수\n\n" +
        "**`Array.prototype.forEach(callback)`**\n" +
        "각 요소에 대해 콜백을 실행합니다. 반환값 없음(undefined).\n\n" +
        "**`Array.prototype.map(callback)`**\n" +
        "각 요소를 변환한 새 배열을 반환합니다. 원본 배열과 길이 동일.\n\n" +
        "**`Array.prototype.filter(callback)`**\n" +
        "callback이 true를 반환하는 요소만 모은 새 배열을 반환합니다.\n\n" +
        "**`Array.prototype.reduce(callback, initialValue)`**\n" +
        "누산기(accumulator)와 현재 값으로 단일 결과를 만듭니다.\n\n" +
        "**`Array.prototype.find(callback)`**\n" +
        "조건에 맞는 첫 번째 요소(또는 undefined)를 반환합니다.\n\n" +
        "**`Array.prototype.some(callback)` / `every(callback)`**\n" +
        "일부/전체 요소가 조건을 만족하는지 boolean 반환.\n\n" +
        "### 배열 생성 방법\n" +
        "- 리터럴: `[1, 2, 3]`\n" +
        "- `Array.of(1, 2, 3)` — 인수를 그대로 배열로\n" +
        "- `Array.from('abc')` — 유사 배열, 이터러블을 배열로\n" +
        "- `Array(3).fill(0)` — 길이 3, 0으로 채워진 배열\n\n" +
        "### 배열 디스트럭처링\n" +
        "```javascript\n" +
        "const [first, second, ...rest] = [1, 2, 3, 4, 5];\n" +
        "const [a, , c] = [1, 2, 3]; // 특정 인덱스 건너뛰기\n" +
        "const [x = 0, y = 0] = [1]; // 기본값\n" +
        "```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: reduce의 내부 동작",
      content:
        "가장 강력하고 복잡한 reduce의 동작을 단계별로 추적합니다.",
      code: {
        language: "javascript",
        code:
          "// reduce 내부 동작 시뮬레이션\n" +
          "function myReduce(array, callback, initialValue) {\n" +
          "  let accumulator = initialValue;\n" +
          "  let startIndex = 0;\n\n" +
          "  // 초기값이 없으면 첫 요소를 accumulator로 사용\n" +
          "  if (arguments.length < 3) {\n" +
          "    accumulator = array[0];\n" +
          "    startIndex = 1;\n" +
          "  }\n\n" +
          "  for (let i = startIndex; i < array.length; i++) {\n" +
          "    accumulator = callback(accumulator, array[i], i, array);\n" +
          "  }\n" +
          "  return accumulator;\n" +
          "}\n\n" +
          "// 실행 추적: [1,2,3,4].reduce((acc, cur) => acc + cur, 0)\n" +
          "// 초기: acc=0\n" +
          "// i=0: acc = 0 + 1 = 1\n" +
          "// i=1: acc = 1 + 2 = 3\n" +
          "// i=2: acc = 3 + 3 = 6\n" +
          "// i=3: acc = 6 + 4 = 10\n" +
          "// 반환: 10\n\n" +
          "// reduce로 map 구현하기\n" +
          "const doubled = [1,2,3].reduce((acc, cur) => [...acc, cur * 2], []);\n" +
          "// [2, 4, 6]\n\n" +
          "// reduce로 filter 구현하기\n" +
          "const evens = [1,2,3,4].reduce((acc, cur) => {\n" +
          "  return cur % 2 === 0 ? [...acc, cur] : acc;\n" +
          "}, []);\n" +
          "// [2, 4]",
        description:
          "reduce는 map과 filter를 포함한 거의 모든 배열 연산을 구현할 수 있는 가장 범용적인 고차 함수입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 메서드 체이닝으로 데이터 처리",
      content:
        "실제 데이터를 처리하는 파이프라인을 메서드 체이닝으로 구성합니다.",
      code: {
        language: "javascript",
        code:
          "const users = [\n" +
          "  { id: 1, name: 'Alice', age: 28, score: 85 },\n" +
          "  { id: 2, name: 'Bob',   age: 17, score: 92 },\n" +
          "  { id: 3, name: 'Carol', age: 34, score: 78 },\n" +
          "  { id: 4, name: 'Dave',  age: 22, score: 95 },\n" +
          "  { id: 5, name: 'Eve',   age: 15, score: 88 },\n" +
          "];\n\n" +
          "// 성인(18세 이상)의 이름을 점수 내림차순으로 반환\n" +
          "const result = users\n" +
          "  .filter(u => u.age >= 18)           // [Alice, Carol, Dave]\n" +
          "  .sort((a, b) => b.score - a.score)  // [Dave(95), Alice(85), Carol(78)]\n" +
          "  .map(u => u.name);                  // ['Dave', 'Alice', 'Carol']\n\n" +
          "console.log(result); // ['Dave', 'Alice', 'Carol']\n\n" +
          "// reduce로 통계 계산\n" +
          "const stats = users.reduce((acc, u) => ({\n" +
          "  total: acc.total + u.score,\n" +
          "  count: acc.count + 1,\n" +
          "  max: Math.max(acc.max, u.score),\n" +
          "}), { total: 0, count: 0, max: -Infinity });\n\n" +
          "console.log(stats.total / stats.count); // 평균: 87.6\n\n" +
          "// 배열 디스트럭처링 활용\n" +
          "const [first, , third] = result;\n" +
          "console.log(first, third); // 'Dave' 'Carol'\n\n" +
          "const [top, ...others] = result;\n" +
          "console.log(top);    // 'Dave'\n" +
          "console.log(others); // ['Alice', 'Carol']",
        description:
          "filter → sort → map 체이닝은 데이터를 선언적으로 처리하는 전형적인 함수형 패턴입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 메서드 | 반환값 | 원본 변경 | 주요 용도 |\n" +
        "|--------|--------|-----------|----------|\n" +
        "| forEach | undefined | X | 부수 효과(출력, 저장) |\n" +
        "| map | 새 배열 | X | 변환 |\n" +
        "| filter | 새 배열 | X | 필터링 |\n" +
        "| reduce | 단일 값 | X | 집계, 변환 |\n" +
        "| find | 요소 또는 undefined | X | 단일 검색 |\n" +
        "| some | boolean | X | 일부 만족 검사 |\n" +
        "| every | boolean | X | 전체 만족 검사 |\n\n" +
        "**핵심:** 고차 함수를 체이닝하면 복잡한 데이터 변환을 읽기 쉬운 선언적 코드로 표현할 수 있습니다. 성능이 중요한 경우 중간 배열을 만들지 않는 `reduce` 하나로 처리하거나 `flatMap`을 활용하세요.\n\n" +
        "**다음 챕터 미리보기:** Map과 Set, WeakMap과 WeakSet을 통한 더 특화된 자료구조를 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "map은 변환, filter는 선별, reduce는 누적 — 이 세 가지 고차함수만으로 대부분의 배열 처리를 선언적이고 가독성 좋게 해결할 수 있다.",
  checklist: [
    "map, filter, reduce, forEach의 반환값과 원본 배열 변경 여부를 안다",
    "reduce의 accumulator 초기값이 없을 때의 동작을 설명할 수 있다",
    "find와 filter의 차이를 설명할 수 있다",
    "some과 every의 차이를 설명할 수 있다",
    "Array.from()과 Array.of()의 차이를 설명할 수 있다",
    "배열 디스트럭처링으로 나머지 요소를 수집하는 방법을 안다",
    "메서드 체이닝으로 데이터 파이프라인을 구성할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "[1,2,3].map(x => x * 2)의 결과는?",
      choices: ["undefined", "[2,4,6]", "[1,2,3]이 수정됨", "6"],
      correctIndex: 1,
      explanation:
        "map은 각 요소를 콜백으로 변환한 새 배열을 반환합니다. 원본 배열은 변경되지 않습니다.",
    },
    {
      id: "q2",
      question: "[].reduce((acc, cur) => acc + cur)를 호출하면?",
      choices: ["0 반환", "undefined 반환", "TypeError 발생", "NaN 반환"],
      correctIndex: 2,
      explanation:
        "빈 배열에서 초기값 없이 reduce를 호출하면 TypeError가 발생합니다. 초기값을 제공하면 (예: 0) 안전하게 동작합니다.",
    },
    {
      id: "q3",
      question: "find와 filter의 핵심 차이는?",
      choices: [
        "find는 새 배열, filter는 단일 값을 반환한다",
        "find는 첫 번째로 조건에 맞는 요소, filter는 모든 조건에 맞는 요소들의 배열을 반환한다",
        "find는 원본을 변경하고, filter는 변경하지 않는다",
        "find는 인덱스를 반환하고, filter는 요소를 반환한다",
      ],
      correctIndex: 1,
      explanation:
        "find는 조건에 맞는 첫 번째 요소를 반환(없으면 undefined)하고, filter는 조건에 맞는 모든 요소를 담은 새 배열을 반환합니다.",
    },
    {
      id: "q4",
      question: "Array.from('abc')의 결과는?",
      choices: ["['abc']", "['a','b','c']", "['a b c']", "SyntaxError"],
      correctIndex: 1,
      explanation:
        "Array.from은 이터러블이나 유사 배열 객체를 배열로 변환합니다. 문자열은 이터러블이므로 각 문자가 하나의 요소가 됩니다.",
    },
    {
      id: "q5",
      question: "[1,2,3,4,5].some(x => x > 4)의 결과는?",
      choices: ["false", "true", "[5]", "5"],
      correctIndex: 1,
      explanation:
        "some은 하나라도 조건을 만족하면 즉시 true를 반환합니다. 5 > 4가 참이므로 true를 반환합니다.",
    },
    {
      id: "q6",
      question: "const [a, , c] = [1, 2, 3]; 에서 a와 c의 값은?",
      choices: [
        "a=1, c=2",
        "a=1, c=3",
        "a=undefined, c=3",
        "SyntaxError",
      ],
      correctIndex: 1,
      explanation:
        "배열 디스트럭처링에서 쉼표를 연속으로 사용하면 해당 인덱스를 건너뜁니다. a는 인덱스 0의 1, c는 인덱스 2의 3이 됩니다.",
    },
    {
      id: "q7",
      question: "forEach와 map의 가장 중요한 차이는?",
      choices: [
        "forEach는 빠르고, map은 느리다",
        "forEach는 원본을 변경하고, map은 변경하지 않는다",
        "forEach는 undefined를 반환하고, map은 새 배열을 반환한다",
        "forEach는 비동기, map은 동기이다",
      ],
      correctIndex: 2,
      explanation:
        "forEach는 반환값이 없어 부수 효과(콘솔 출력, 외부 변수 변경 등)를 위해 사용합니다. map은 변환된 새 배열을 반환해 선언적 데이터 변환에 사용합니다.",
    },
  ],
};

export default chapter;
