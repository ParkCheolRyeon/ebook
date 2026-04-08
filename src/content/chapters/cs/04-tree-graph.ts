import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "04-tree-graph",
  subject: "cs",
  title: "트리와 그래프",
  description:
    "DOM 트리, Virtual DOM, 컴포넌트 트리, 의존성 그래프 등 프론트엔드의 핵심 구조인 트리와 그래프를 깊이 이해합니다.",
  order: 4,
  group: "자료구조",
  prerequisites: ["02-stack-queue"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "**트리(Tree)**는 가족 족보와 같습니다. 시조(루트)에서 시작하여 자식, 손자로 뻗어나갑니다. " +
        "각 사람(노드)은 하나의 부모만 가지고, 여러 자식을 가질 수 있습니다. " +
        "순환(사이클)이 없어서 조상을 따라 올라가면 반드시 시조에 도달합니다.\n\n" +
        "**그래프(Graph)**는 지하철 노선도입니다. 역(노드)들이 노선(간선)으로 연결되어 있고, " +
        "순환 경로도 있고, 한 역에서 여러 노선을 탈 수 있습니다. " +
        "트리보다 훨씬 자유로운 구조입니다.\n\n" +
        "프론트엔드 개발에서 트리는 **가장 중요한 자료구조**입니다:\n" +
        "- HTML → DOM 트리\n" +
        "- React → 컴포넌트 트리 → Virtual DOM 트리\n" +
        "- 파일 탐색기 → 디렉토리 트리\n" +
        "- npm → 의존성 그래프",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드에서 트리와 그래프가 필요한 핵심 상황:\n\n" +
        "1. **DOM 조작** — 특정 노드를 찾고, 부모/자식을 탐색하고, 서브트리를 변경\n" +
        "2. **Virtual DOM 비교** — React가 이전/현재 트리를 비교하여 최소 변경을 계산\n" +
        "3. **컴포넌트 트리 설계** — 상태를 어디에 두고, props를 어떻게 전달할지\n" +
        "4. **재귀적 UI** — 파일 탐색기, 댓글의 답글, 메뉴 등 중첩 구조 렌더링\n" +
        "5. **번들 최적화** — import 의존성 그래프를 분석하여 코드 스플리팅\n" +
        "6. **경로 탐색** — 라우팅 트리, 네비게이션 구조\n\n" +
        "트리 구조를 이해하지 못하면 React의 렌더링 최적화나 " +
        "복잡한 중첩 UI 구현에서 어려움을 겪습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 트리의 핵심 개념\n\n" +
        "- **루트(Root)**: 최상위 노드 (HTML에서 `<html>`, React에서 `<App />`)\n" +
        "- **부모/자식**: 직접 연결된 상위/하위 노드\n" +
        "- **리프(Leaf)**: 자식이 없는 노드\n" +
        "- **깊이(Depth)**: 루트에서의 거리\n" +
        "- **높이(Height)**: 리프까지의 최대 거리\n\n" +
        "### 트리 순회 방법\n\n" +
        "- **DFS(깊이 우선 탐색)**: 한 가지를 끝까지 파고든 후 되돌아옴 — 스택 사용\n" +
        "  - 전위(Pre-order): 부모 → 왼쪽 → 오른쪽\n" +
        "  - 중위(In-order): 왼쪽 → 부모 → 오른쪽\n" +
        "  - 후위(Post-order): 왼쪽 → 오른쪽 → 부모\n" +
        "- **BFS(너비 우선 탐색)**: 같은 레벨의 노드를 먼저 방문 — 큐 사용\n\n" +
        "### 그래프 vs 트리\n\n" +
        "| 특성 | 트리 | 그래프 |\n" +
        "|------|------|--------|\n" +
        "| 순환 | 없음 | 가능 |\n" +
        "| 루트 | 있음 (하나) | 없음 |\n" +
        "| 부모 수 | 최대 1개 | 제한 없음 |\n" +
        "| 방향 | 보통 위→아래 | 양방향/단방향 |\n\n" +
        "### 프론트엔드에서의 활용\n\n" +
        "- **DOM**: `querySelector`는 DFS, `TreeWalker API`로 순회\n" +
        "- **React Reconciliation**: 두 트리를 DFS로 비교하여 diff 계산\n" +
        "- **webpack/Rollup**: import 그래프를 분석하여 번들 생성",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 트리 순회 알고리즘",
      content:
        "DOM 트리와 유사한 구조를 TypeScript로 구현하고, " +
        "DFS와 BFS 순회를 비교합니다.",
      code: {
        language: "typescript",
        code:
          '// 트리 노드 정의\n' +
          'interface TreeNode<T> {\n' +
          '  value: T;\n' +
          '  children: TreeNode<T>[];\n' +
          '}\n' +
          '\n' +
          '// DFS: 깊이 우선 탐색 (스택 사용)\n' +
          'function dfs<T>(root: TreeNode<T>): T[] {\n' +
          '  const result: T[] = [];\n' +
          '  const stack: TreeNode<T>[] = [root];\n' +
          '\n' +
          '  while (stack.length > 0) {\n' +
          '    const node = stack.pop()!;  // 스택: LIFO\n' +
          '    result.push(node.value);\n' +
          '    // 오른쪽부터 push해야 왼쪽이 먼저 pop됨\n' +
          '    for (let i = node.children.length - 1; i >= 0; i--) {\n' +
          '      stack.push(node.children[i]);\n' +
          '    }\n' +
          '  }\n' +
          '  return result;\n' +
          '}\n' +
          '\n' +
          '// BFS: 너비 우선 탐색 (큐 사용)\n' +
          'function bfs<T>(root: TreeNode<T>): T[] {\n' +
          '  const result: T[] = [];\n' +
          '  const queue: TreeNode<T>[] = [root];\n' +
          '\n' +
          '  while (queue.length > 0) {\n' +
          '    const node = queue.shift()!;  // 큐: FIFO\n' +
          '    result.push(node.value);\n' +
          '    for (const child of node.children) {\n' +
          '      queue.push(child);\n' +
          '    }\n' +
          '  }\n' +
          '  return result;\n' +
          '}\n' +
          '\n' +
          '// 사용 예시: DOM과 유사한 트리\n' +
          'const tree: TreeNode<string> = {\n' +
          '  value: "html",\n' +
          '  children: [\n' +
          '    {\n' +
          '      value: "head",\n' +
          '      children: [{ value: "title", children: [] }],\n' +
          '    },\n' +
          '    {\n' +
          '      value: "body",\n' +
          '      children: [\n' +
          '        { value: "div", children: [] },\n' +
          '        { value: "p", children: [] },\n' +
          '      ],\n' +
          '    },\n' +
          '  ],\n' +
          '};\n' +
          '\n' +
          'dfs(tree);  // ["html","head","title","body","div","p"]\n' +
          'bfs(tree);  // ["html","head","body","title","div","p"]',
        description:
          "DFS는 스택(LIFO)을, BFS는 큐(FIFO)를 사용합니다. DOM의 querySelector는 DFS 방식으로 동작합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 재귀적 파일 트리 컴포넌트",
      content:
        "프론트엔드에서 자주 만나는 파일 탐색기 UI를 트리 구조로 구현합니다. " +
        "재귀 컴포넌트 패턴과 트리 순회의 실제 활용을 보여줍니다.",
      code: {
        language: "typescript",
        code:
          '// 파일 시스템 트리 타입 정의\n' +
          'interface FileNode {\n' +
          '  name: string;\n' +
          '  type: "file" | "folder";\n' +
          '  children?: FileNode[];\n' +
          '}\n' +
          '\n' +
          '// 트리에서 특정 파일 찾기 (DFS)\n' +
          'function findFile(root: FileNode, targetName: string): FileNode | null {\n' +
          '  if (root.name === targetName) return root;\n' +
          '  if (root.children) {\n' +
          '    for (const child of root.children) {\n' +
          '      const found = findFile(child, targetName);  // 재귀 DFS\n' +
          '      if (found) return found;\n' +
          '    }\n' +
          '  }\n' +
          '  return null;\n' +
          '}\n' +
          '\n' +
          '// 트리의 전체 경로 구하기\n' +
          'function getPath(root: FileNode, target: string, path: string[] = []): string[] | null {\n' +
          '  path.push(root.name);\n' +
          '  if (root.name === target) return [...path];\n' +
          '  if (root.children) {\n' +
          '    for (const child of root.children) {\n' +
          '      const result = getPath(child, target, path);\n' +
          '      if (result) return result;\n' +
          '    }\n' +
          '  }\n' +
          '  path.pop();  // 백트래킹\n' +
          '  return null;\n' +
          '}\n' +
          '\n' +
          '// 의존성 그래프 순환 감지\n' +
          'function hasCycle(graph: Map<string, string[]>): boolean {\n' +
          '  const visited = new Set<string>();\n' +
          '  const inStack = new Set<string>();\n' +
          '\n' +
          '  function dfsCheck(node: string): boolean {\n' +
          '    visited.add(node);\n' +
          '    inStack.add(node);\n' +
          '    for (const neighbor of graph.get(node) || []) {\n' +
          '      if (inStack.has(neighbor)) return true; // 순환 발견!\n' +
          '      if (!visited.has(neighbor) && dfsCheck(neighbor)) return true;\n' +
          '    }\n' +
          '    inStack.delete(node);\n' +
          '    return false;\n' +
          '  }\n' +
          '\n' +
          '  for (const node of graph.keys()) {\n' +
          '    if (!visited.has(node) && dfsCheck(node)) return true;\n' +
          '  }\n' +
          '  return false;\n' +
          '}',
        description:
          "파일 탐색기의 DFS 검색, 경로 추적(백트래킹), 그리고 의존성 그래프의 순환 감지를 구현합니다. 모두 프론트엔드 실무에서 직접 활용되는 패턴입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 순회 방법 | 자료구조 | 특징 | 프론트엔드 활용 |\n" +
        "|-----------|----------|------|----------------|\n" +
        "| DFS | 스택 | 깊이 우선, 메모리 효율적 | querySelector, React reconciliation |\n" +
        "| BFS | 큐 | 너비 우선, 최단 경로 | 레벨별 탐색, 라우트 매칭 |\n\n" +
        "**프론트엔드에서의 트리:**\n" +
        "- **DOM 트리**: HTML 구조를 트리로 표현 → `querySelector`(DFS), `TreeWalker`\n" +
        "- **Virtual DOM**: React가 두 트리를 비교하여 최소 업데이트 계산\n" +
        "- **컴포넌트 트리**: `<App>` → `<Layout>` → `<Page>` 계층 구조\n" +
        "- **라우팅 트리**: 중첩 라우트를 트리로 매칭\n\n" +
        "**그래프 활용:**\n" +
        "- **모듈 의존성 그래프**: webpack, Rollup이 번들링에 사용\n" +
        "- **순환 참조 감지**: ESLint `import/no-cycle` 규칙\n" +
        "- **상태 머신**: XState 등의 상태 전이 그래프",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "DOM, Virtual DOM, 컴포넌트 구조 모두 트리 — DFS(스택)와 BFS(큐)로 순회하며, 의존성 관리는 그래프로 모델링한다.",
  checklist: [
    "트리와 그래프의 차이(순환 유무, 루트 유무)를 설명할 수 있다",
    "DFS와 BFS의 동작 원리와 사용하는 자료구조를 설명할 수 있다",
    "DOM 트리와 React 컴포넌트 트리의 관계를 이해한다",
    "재귀적 트리 순회와 반복적 트리 순회를 모두 구현할 수 있다",
    "의존성 그래프에서 순환 참조를 감지하는 원리를 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "트리와 그래프의 가장 핵심적인 차이는?",
      choices: [
        "트리는 방향이 있고 그래프는 없다",
        "트리는 순환(사이클)이 없고 그래프는 가능하다",
        "트리는 노드 수 제한이 있다",
        "그래프는 자식 노드를 가질 수 없다",
      ],
      correctIndex: 1,
      explanation:
        "트리는 순환이 없는 연결 그래프(acyclic connected graph)입니다. 그래프는 노드 간에 순환 경로가 존재할 수 있습니다.",
    },
    {
      id: "q2",
      question: "document.querySelector()가 사용하는 탐색 방식은?",
      choices: [
        "BFS (너비 우선 탐색)",
        "DFS (깊이 우선 탐색)",
        "이진 탐색",
        "해시 테이블 조회",
      ],
      correctIndex: 1,
      explanation:
        "querySelector는 DOM 트리를 DFS(깊이 우선) 방식으로 순회하여 첫 번째로 매칭되는 요소를 반환합니다.",
    },
    {
      id: "q3",
      question: "BFS(너비 우선 탐색)에서 사용하는 자료구조는?",
      choices: ["스택", "큐", "해시 테이블", "힙"],
      correctIndex: 1,
      explanation:
        "BFS는 같은 레벨의 노드를 먼저 방문하므로 FIFO 구조인 큐를 사용합니다. DFS는 스택을 사용합니다.",
    },
    {
      id: "q4",
      question:
        "React의 Virtual DOM 비교(Reconciliation)에서 트리가 중요한 이유는?",
      choices: [
        "트리 구조가 메모리를 적게 사용해서",
        "이전 트리와 새 트리를 비교하여 최소 DOM 변경을 계산하기 때문",
        "트리가 정렬되어 있어서",
        "브라우저가 트리만 이해할 수 있어서",
      ],
      correctIndex: 1,
      explanation:
        "React는 이전 Virtual DOM 트리와 새 Virtual DOM 트리를 비교(diff)하여, 실제 DOM에 적용할 최소한의 변경사항만 계산합니다. 이것이 React가 효율적인 핵심 이유입니다.",
    },
    {
      id: "q5",
      question:
        "webpack이 모듈 의존성을 분석할 때 사용하는 자료구조는?",
      choices: [
        "배열",
        "스택",
        "그래프 (의존성 그래프)",
        "큐",
      ],
      correctIndex: 2,
      explanation:
        "webpack은 엔트리 포인트부터 시작하여 import/require를 따라가며 의존성 그래프를 구성합니다. 이 그래프를 분석하여 번들을 생성하고 코드 스플리팅을 수행합니다.",
    },
  ],
};

export default chapter;
