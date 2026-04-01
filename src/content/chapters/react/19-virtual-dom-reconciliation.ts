import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "19-virtual-dom-reconciliation",
  subject: "react",
  title: "가상 DOM과 재조정",
  description: "가상 DOM이 왜 필요한가, Diffing 알고리즘의 O(n) 휴리스틱, key의 역할, 트리 비교 전략을 깊이 이해합니다.",
  order: 19,
  group: "렌더링 원리",
  prerequisites: ["18-stale-closure"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "가상 DOM은 건축 설계도와 비슷합니다.\n\n" +
        "**실제 DOM**은 완성된 건물입니다. 벽 하나를 옮기려면 공사가 필요하고, 비용과 시간이 많이 듭니다.\n\n" +
        "**가상 DOM**은 설계 도면입니다. 도면 위에서는 벽을 지우고 다시 그리는 게 간단합니다. 변경된 도면과 기존 도면을 비교해서 \"여기 벽 하나만 옮기면 된다\"는 최소한의 작업 목록을 만들고, 그것만 실제 건물에 반영합니다.\n\n" +
        "이 '두 도면 비교' 과정이 바로 **재조정(Reconciliation)**이고, 비교 알고리즘이 **Diffing**입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "브라우저의 실제 DOM 조작은 비용이 큽니다.\n\n" +
        "1. **DOM 조작은 느리다** — DOM 노드를 생성하거나 변경하면 스타일 재계산, 레이아웃(리플로우), 페인트가 연쇄적으로 발생합니다.\n" +
        "2. **트리 비교는 O(n³)** — 두 트리의 최소 편집 거리를 구하는 일반적 알고리즘은 노드 수 n에 대해 O(n³)의 시간 복잡도를 가집니다. 1000개 노드면 10억 번의 비교가 필요합니다.\n" +
        "3. **수동 DOM 관리는 에러 유발** — jQuery 시절처럼 개발자가 직접 어떤 DOM을 변경할지 결정하면 누락이나 불일치가 빈번합니다.\n\n" +
        "React는 이 문제를 어떻게 O(n)으로 해결했을까요?",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "React는 두 가지 휴리스틱(경험적 가정)으로 O(n³)을 O(n)으로 줄입니다.\n\n" +
        "### 휴리스틱 1: 타입이 다르면 서브트리를 통째로 교체\n" +
        "`<div>`가 `<span>`으로 바뀌면 내부 자식을 비교하지 않고 전체를 언마운트 후 새로 마운트합니다. 같은 타입이면 속성(props)만 비교합니다.\n\n" +
        "### 휴리스틱 2: key로 형제 노드를 식별\n" +
        "리스트에서 `key`는 각 요소의 '주민등록번호'입니다. key가 같으면 같은 요소로 판단하고 이동만 합니다. key가 없으면 인덱스를 사용하는데, 순서가 바뀔 때 비효율적 재렌더링이 발생합니다.\n\n" +
        "### 비교 전략\n" +
        "1. **루트부터 시작** — 두 트리의 루트 요소 타입을 비교합니다.\n" +
        "2. **같은 레벨만 비교** — 부모가 같은 형제끼리만 비교하며, 다른 레벨로 이동한 노드는 감지하지 않습니다.\n" +
        "3. **컴포넌트 타입 비교** — 같은 컴포넌트 함수/클래스면 인스턴스를 유지하고 props만 업데이트합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Diffing 알고리즘 의사코드",
      content:
        "React의 재조정 알고리즘이 두 가상 DOM 트리를 비교하는 핵심 로직을 의사코드로 살펴봅니다.",
      code: {
        language: "typescript",
        code:
          '// 재조정(Reconciliation) 의사코드\n' +
          '\n' +
          'function reconcile(parentDom: Element, oldVNode: VNode, newVNode: VNode) {\n' +
          '  // 1단계: 타입 비교\n' +
          '  if (oldVNode.type !== newVNode.type) {\n' +
          '    // 타입이 다르면 통째로 교체 — 서브트리 비교 생략\n' +
          '    const newDom = createDom(newVNode);\n' +
          '    parentDom.replaceChild(newDom, oldVNode.dom);\n' +
          '    unmountTree(oldVNode);  // 이전 트리 정리(useEffect cleanup 등)\n' +
          '    mountTree(newVNode);    // 새 트리 마운트\n' +
          '    return;\n' +
          '  }\n' +
          '\n' +
          '  // 2단계: 같은 타입이면 속성만 업데이트\n' +
          '  updateProps(oldVNode.dom, oldVNode.props, newVNode.props);\n' +
          '\n' +
          '  // 3단계: 자식 비교 — key 기반\n' +
          '  const oldChildren = oldVNode.children;\n' +
          '  const newChildren = newVNode.children;\n' +
          '  const oldKeyMap = new Map(); // key -> oldChild\n' +
          '\n' +
          '  for (const child of oldChildren) {\n' +
          '    if (child.key != null) oldKeyMap.set(child.key, child);\n' +
          '  }\n' +
          '\n' +
          '  for (let i = 0; i < newChildren.length; i++) {\n' +
          '    const newChild = newChildren[i];\n' +
          '    const oldChild = newChild.key != null\n' +
          '      ? oldKeyMap.get(newChild.key)  // key로 매칭\n' +
          '      : oldChildren[i];               // 인덱스로 매칭 (key 없을 때)\n' +
          '\n' +
          '    reconcile(oldVNode.dom, oldChild, newChild); // 재귀\n' +
          '  }\n' +
          '\n' +
          '  // 남은 oldChild는 삭제\n' +
          '  // newChildren에만 있는 건 새로 생성\n' +
          '}\n',
        description: "같은 레벨에서만 비교하고, 타입이 다르면 서브트리를 통째로 교체하여 O(n)을 달성합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: key의 중요성",
      content:
        "key를 올바르게 사용하는 경우와 잘못 사용하는 경우를 비교합니다.",
      code: {
        language: "typescript",
        code:
          '// ❌ 인덱스를 key로 사용 — 순서 변경 시 문제\n' +
          'function BadList({ items }: { items: string[] }) {\n' +
          '  return (\n' +
          '    <ul>\n' +
          '      {items.map((item, index) => (\n' +
          '        <li key={index}>\n' +
          '          <input defaultValue={item} />\n' +
          '        </li>\n' +
          '      ))}\n' +
          '    </ul>\n' +
          '  );\n' +
          '  // 배열 앞에 요소를 추가하면 모든 input의 값이 한 칸씩 밀림\n' +
          '}\n' +
          '\n' +
          '// ✅ 고유 ID를 key로 사용 — 안정적인 식별\n' +
          'interface Item {\n' +
          '  id: string;\n' +
          '  text: string;\n' +
          '}\n' +
          '\n' +
          'function GoodList({ items }: { items: Item[] }) {\n' +
          '  return (\n' +
          '    <ul>\n' +
          '      {items.map((item) => (\n' +
          '        <li key={item.id}>\n' +
          '          <input defaultValue={item.text} />\n' +
          '        </li>\n' +
          '      ))}\n' +
          '    </ul>\n' +
          '  );\n' +
          '  // 배열 앞에 요소를 추가해도 기존 input은 그대로 유지\n' +
          '}\n' +
          '\n' +
          '// ✅ key를 이용한 컴포넌트 초기화\n' +
          'function Profile({ userId }: { userId: string }) {\n' +
          '  // userId가 바뀌면 완전히 새 컴포넌트로 마운트됨\n' +
          '  return <UserForm key={userId} userId={userId} />;\n' +
          '}\n',
        description: "key는 React가 요소를 식별하는 유일한 힌트입니다. 인덱스 대신 고유 ID를 사용하세요.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| 가상 DOM | 실제 DOM의 경량 JS 객체 표현 |\n" +
        "| 재조정 | 이전/현재 가상 DOM을 비교해 최소 변경 계산 |\n" +
        "| O(n) 휴리스틱 | 타입 비교 + key 기반 매칭 |\n" +
        "| key | 형제 노드를 식별하는 고유 식별자 |\n" +
        "| 같은 레벨 비교 | 부모-자식 간 이동은 감지 안 됨 |\n\n" +
        "**핵심:** React는 \"완벽한 최소 변경\"이 아닌 \"충분히 좋은 빠른 변경\"을 선택했습니다. 두 가지 휴리스틱 덕분에 대부분의 UI 업데이트를 O(n)에 처리할 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** 재조정을 실제로 실행하는 Fiber 아키텍처가 어떻게 작업을 분할하고 우선순위를 매기는지 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "Virtual DOM은 실제 DOM의 경량 사본이다. React는 이전과 새 Virtual DOM을 비교(재조정)하여 변경된 부분만 실제 DOM에 반영함으로써 성능을 최적화한다.",
  checklist: [
    "가상 DOM이 필요한 이유를 설명할 수 있다",
    "O(n³)에서 O(n)으로 줄이는 두 가지 휴리스틱을 설명할 수 있다",
    "key의 역할과 인덱스를 key로 사용하면 안 되는 이유를 설명할 수 있다",
    "타입이 다를 때 React가 서브트리를 통째로 교체하는 이유를 이해한다",
    "같은 레벨에서만 비교하는 전략의 장단점을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "React의 Diffing 알고리즘이 O(n)을 달성하는 핵심 휴리스틱이 아닌 것은?",
      choices: [
        "타입이 다르면 서브트리를 통째로 교체한다",
        "key를 사용해 형제 노드를 식별한다",
        "같은 레벨의 노드만 비교한다",
        "모든 노드의 텍스트 내용을 해시로 비교한다",
      ],
      correctIndex: 3,
      explanation: "React는 타입 비교와 key 기반 매칭 두 가지 휴리스틱을 사용합니다. 텍스트 해시 비교는 React의 전략이 아닙니다.",
    },
    {
      id: "q2",
      question: "리스트에서 인덱스를 key로 사용하면 발생할 수 있는 문제는?",
      choices: [
        "컴파일 에러가 발생한다",
        "배열 중간에 삽입/삭제 시 불필요한 리렌더링과 상태 불일치가 발생한다",
        "key prop이 무시된다",
        "성능이 항상 더 좋아진다",
      ],
      correctIndex: 1,
      explanation: "인덱스를 key로 사용하면 배열 변경 시 인덱스가 재할당되어 React가 잘못된 요소를 매칭하고, 내부 상태가 뒤섞일 수 있습니다.",
    },
    {
      id: "q3",
      question: "<div>에서 <span>으로 엘리먼트 타입이 변경되면 React는 어떻게 동작하는가?",
      choices: [
        "속성만 업데이트한다",
        "자식 노드를 비교한 후 필요한 것만 변경한다",
        "이전 트리를 언마운트하고 새 트리를 처음부터 마운트한다",
        "에러를 발생시킨다",
      ],
      correctIndex: 2,
      explanation: "타입이 다르면 React는 서브트리 비교를 생략하고 이전 트리를 통째로 제거한 후 새로 생성합니다. 이것이 O(n) 휴리스틱의 핵심입니다.",
    },
    {
      id: "q4",
      question: "다음 중 key를 이용한 컴포넌트 초기화 패턴의 올바른 설명은?",
      choices: [
        "key가 변경되면 컴포넌트가 리렌더링된다",
        "key가 변경되면 컴포넌트가 언마운트 후 새로 마운트된다",
        "key는 리렌더링에 영향을 주지 않는다",
        "key는 클래스 컴포넌트에서만 동작한다",
      ],
      correctIndex: 1,
      explanation: "key가 변경되면 React는 해당 컴포넌트를 완전히 새로운 것으로 인식하여 이전 인스턴스를 언마운트하고 새 인스턴스를 마운트합니다.",
    },
    {
      id: "q5",
      question: "일반적인 트리 비교 알고리즘의 시간 복잡도는?",
      choices: ["O(n)", "O(n log n)", "O(n²)", "O(n³)"],
      correctIndex: 3,
      explanation: "두 트리의 최소 편집 거리를 구하는 일반 알고리즘은 O(n³)입니다. React는 휴리스틱으로 이를 O(n)으로 줄였습니다.",
    },
  ],
};

export default chapter;
