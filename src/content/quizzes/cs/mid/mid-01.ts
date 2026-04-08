import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-01",
  title: "중간 점검 1: 자료구조 ~ 알고리즘 기초",
  coverGroups: ["자료구조", "알고리즘 기초"],
  questions: [
    {
      id: "mid01-q1",
      question:
        "React에서 대량의 리스트를 렌더링할 때, 중간에 항목을 자주 삽입/삭제해야 한다면 내부적으로 어떤 자료구조의 특성이 유리할까요?",
      choices: [
        "배열 - 인덱스로 O(1) 접근이 가능하므로",
        "연결 리스트 - 삽입/삭제가 O(1)이므로",
        "해시 테이블 - 키로 빠르게 검색 가능하므로",
        "이진 트리 - 정렬 상태를 유지하므로",
      ],
      correctIndex: 1,
      explanation:
        "배열은 중간 삽입/삭제 시 요소를 이동해야 하므로 O(n)입니다. 연결 리스트는 노드의 포인터만 변경하면 되므로 삽입/삭제가 O(1)입니다. React의 Virtual DOM도 이러한 리스트 비교 최적화를 수행합니다.",
    },
    {
      id: "mid01-q2",
      question:
        "브라우저의 '뒤로 가기' 버튼과 텍스트 에디터의 'Undo' 기능에 공통적으로 사용되는 자료구조는?",
      choices: ["큐(Queue)", "스택(Stack)", "힙(Heap)", "그래프(Graph)"],
      correctIndex: 1,
      explanation:
        "스택은 LIFO(Last In, First Out) 구조로, 가장 최근 작업을 먼저 되돌리는 Undo 기능과 브라우저 히스토리의 뒤로 가기에 적합합니다. JavaScript의 콜 스택도 같은 원리로 동작합니다.",
    },
    {
      id: "mid01-q3",
      question:
        "해시 테이블에서 서로 다른 키가 같은 해시 값을 가질 때 이를 해결하는 방법으로 올바르지 않은 것은?",
      choices: [
        "체이닝(Chaining) - 같은 버킷에 연결 리스트로 저장",
        "개방 주소법(Open Addressing) - 빈 슬롯을 탐색하여 저장",
        "해시 함수 변경 - 더 좋은 해시 함수로 교체",
        "충돌 무시 - 나중에 들어온 값을 버림",
      ],
      correctIndex: 3,
      explanation:
        "충돌을 무시하면 데이터가 손실됩니다. 체이닝은 같은 버킷에 연결 리스트로 여러 값을 저장하고, 개방 주소법은 다른 빈 슬롯을 찾아 저장합니다. 해시 함수 개선도 충돌을 줄이는 방법이지만, 충돌 자체를 무시하는 것은 올바른 해결책이 아닙니다.",
    },
    {
      id: "mid01-q4",
      question:
        "DOM 트리에서 특정 요소를 찾을 때, DFS(깊이 우선 탐색)와 BFS(너비 우선 탐색)에 대한 설명으로 올바른 것은?",
      choices: [
        "DFS는 큐를 사용하고, BFS는 스택을 사용한다",
        "DFS는 형제 노드를 먼저 방문하고, BFS는 자식 노드를 먼저 방문한다",
        "DFS는 스택(또는 재귀)을 사용하고, BFS는 큐를 사용한다",
        "DOM 트리에서는 DFS와 BFS의 결과가 항상 동일하다",
      ],
      correctIndex: 2,
      explanation:
        "DFS는 스택 또는 재귀를 사용하여 한 경로를 끝까지 탐색한 후 다른 경로를 탐색합니다. BFS는 큐를 사용하여 같은 깊이의 노드를 먼저 모두 방문합니다. document.querySelector는 DFS 방식으로 DOM을 탐색합니다.",
    },
    {
      id: "mid01-q5",
      question:
        "다음 중 시간 복잡도가 O(n log n)인 알고리즘은?",
      choices: [
        "배열에서 특정 값 찾기 (선형 탐색)",
        "정렬된 배열에서 이진 탐색",
        "병합 정렬 (Merge Sort)",
        "해시 테이블에서 값 조회",
      ],
      correctIndex: 2,
      explanation:
        "선형 탐색은 O(n), 이진 탐색은 O(log n), 해시 테이블 조회는 평균 O(1)입니다. 병합 정렬은 배열을 반으로 나누고(log n) 각 단계에서 병합(n)하므로 O(n log n)입니다.",
    },
    {
      id: "mid01-q6",
      question:
        "다음 정렬 알고리즘 중 안정 정렬(Stable Sort)이 아닌 것은?",
      choices: [
        "병합 정렬 (Merge Sort)",
        "버블 정렬 (Bubble Sort)",
        "퀵 정렬 (Quick Sort)",
        "삽입 정렬 (Insertion Sort)",
      ],
      correctIndex: 2,
      explanation:
        "안정 정렬은 동일한 값의 원래 순서를 보장합니다. 퀵 정렬은 피벗 기준으로 분할할 때 동일 값의 순서가 바뀔 수 있어 불안정 정렬입니다. JavaScript의 Array.sort()는 ES2019부터 안정 정렬이 보장됩니다.",
    },
    {
      id: "mid01-q7",
      question:
        "이진 탐색(Binary Search)을 사용하기 위한 필수 전제 조건은?",
      choices: [
        "데이터가 연결 리스트에 저장되어 있어야 한다",
        "데이터가 정렬되어 있어야 한다",
        "데이터의 크기가 2의 거듭제곱이어야 한다",
        "데이터에 중복 값이 없어야 한다",
      ],
      correctIndex: 1,
      explanation:
        "이진 탐색은 중간 값과 비교하여 탐색 범위를 절반으로 줄이는 방식입니다. 이를 위해 데이터가 반드시 정렬되어 있어야 합니다. 정렬되지 않은 데이터에서는 올바른 결과를 보장할 수 없습니다.",
    },
    {
      id: "mid01-q8",
      question:
        "동적 프로그래밍에서 메모이제이션(Memoization)과 타뷸레이션(Tabulation)의 차이로 올바른 것은?",
      choices: [
        "메모이제이션은 상향식, 타뷸레이션은 하향식 접근이다",
        "메모이제이션은 하향식(Top-Down)으로 재귀와 캐시를 사용하고, 타뷸레이션은 상향식(Bottom-Up)으로 반복문을 사용한다",
        "두 방식은 항상 동일한 시간 복잡도를 가진다",
        "메모이제이션은 공간 복잡도가 항상 더 적다",
      ],
      correctIndex: 1,
      explanation:
        "메모이제이션은 재귀 호출 시 결과를 캐시하여 중복 계산을 방지하는 하향식 접근입니다. 타뷸레이션은 작은 문제부터 테이블을 채워가며 큰 문제를 해결하는 상향식 접근입니다. React의 useMemo도 메모이제이션 개념을 활용합니다.",
    },
    {
      id: "mid01-q9",
      question:
        "프론트엔드에서 자주 사용되는 Map과 일반 객체({})의 차이로 올바른 것은?",
      choices: [
        "Map은 문자열 키만 허용하지만 객체는 모든 타입의 키를 허용한다",
        "Map은 삽입 순서를 보장하고 모든 타입의 키를 허용하지만, 객체의 키는 문자열과 Symbol만 가능하다",
        "객체가 Map보다 항상 성능이 좋다",
        "Map은 JSON.stringify로 직접 직렬화할 수 있다",
      ],
      correctIndex: 1,
      explanation:
        "Map은 삽입 순서를 보장하고 객체, 함수 등 모든 타입을 키로 사용할 수 있습니다. 일반 객체의 키는 문자열과 Symbol만 가능합니다. Map은 빈번한 삽입/삭제에 더 최적화되어 있지만, JSON 직렬화는 직접 지원하지 않습니다.",
    },
    {
      id: "mid01-q10",
      question:
        "다음 알고리즘들의 최악의 시간 복잡도를 올바르게 비교한 것은?",
      choices: [
        "이진 탐색 O(log n) < 선형 탐색 O(n) < 버블 정렬 O(n²) < 병합 정렬 O(n log n)",
        "이진 탐색 O(log n) < 선형 탐색 O(n) < 병합 정렬 O(n log n) < 버블 정렬 O(n²)",
        "선형 탐색 O(n) < 이진 탐색 O(log n) < 병합 정렬 O(n log n) < 버블 정렬 O(n²)",
        "이진 탐색 O(log n) < 병합 정렬 O(n log n) < 선형 탐색 O(n) < 버블 정렬 O(n²)",
      ],
      correctIndex: 1,
      explanation:
        "O(log n) < O(n) < O(n log n) < O(n²) 순서입니다. 이진 탐색은 O(log n), 선형 탐색은 O(n), 병합 정렬은 최악에도 O(n log n)을 보장하며, 버블 정렬은 최악 O(n²)입니다.",
    },
  ],
};

export default midQuiz;
