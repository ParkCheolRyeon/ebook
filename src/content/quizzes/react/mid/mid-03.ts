import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-03",
  title: "중간 점검 3: 성능 최적화",
  coverGroups: ["성능 최적화"],
  questions: [
    {
      id: "mid03-q1",
      question: "React.memo가 컴포넌트 리렌더링을 방지하는 조건은?",
      choices: [
        "state가 변경되지 않을 때",
        "props가 이전과 얕은 비교(shallow equal)로 동일할 때",
        "key가 변경되지 않을 때",
        "부모가 리렌더링되지 않을 때",
      ],
      correctIndex: 1,
      explanation:
        "React.memo는 props를 얕은 비교(shallow comparison)하여 이전과 동일하면 리렌더링을 건너뜁니다. 자체 state나 context 변경에는 여전히 리렌더링됩니다.",
    },
    {
      id: "mid03-q2",
      question: "useMemo의 적절한 사용 시점은?",
      choices: [
        "모든 변수에 적용해야 한다",
        "비용이 큰 계산이나 참조 동일성이 중요한 경우",
        "단순 산술 연산에도 적용해야 한다",
        "상태 초기값 설정에만 사용해야 한다",
      ],
      correctIndex: 1,
      explanation:
        "useMemo는 비용이 큰 계산(대량 데이터 정렬/필터)이나 자식 컴포넌트에 전달하는 객체/배열의 참조 동일성 유지에 적합합니다. 모든 곳에 적용하면 오히려 오버헤드가 됩니다.",
    },
    {
      id: "mid03-q3",
      question: "React Compiler가 자동화하는 것은?",
      choices: [
        "타입 체크",
        "useMemo, useCallback, React.memo 등 메모이제이션",
        "에러 처리",
        "라우팅",
      ],
      correctIndex: 1,
      explanation:
        "React Compiler는 빌드 시 코드를 분석하여 필요한 곳에 자동으로 메모이제이션을 삽입합니다. 개발자가 수동으로 최적화 Hook을 작성할 필요가 줄어듭니다.",
    },
    {
      id: "mid03-q4",
      question: "코드 스플리팅의 가장 효과적인 분할 단위는?",
      choices: [
        "컴포넌트 단위",
        "라우트(페이지) 단위",
        "함수 단위",
        "파일 단위",
      ],
      correctIndex: 1,
      explanation:
        "라우트 단위 코드 스플리팅이 가장 효과적입니다. 사용자가 특정 페이지에 접근할 때 해당 페이지의 코드만 로딩하여 초기 번들 크기를 줄입니다.",
    },
    {
      id: "mid03-q5",
      question: "리스트 가상화(Virtualization)의 원리는?",
      choices: [
        "모든 항목을 미리 렌더링하고 캐시한다",
        "현재 뷰포트에 보이는 항목만 DOM에 렌더링한다",
        "리스트를 서버에서 렌더링한다",
        "각 항목을 별도의 iframe에 렌더링한다",
      ],
      correctIndex: 1,
      explanation:
        "리스트 가상화는 수천 개의 항목 중 화면에 보이는 부분만 실제 DOM에 렌더링합니다. 보이지 않는 항목은 DOM에서 제거하여 메모리와 렌더링 비용을 줄입니다.",
    },
    {
      id: "mid03-q6",
      question: "React DevTools의 Profiler가 측정하는 것은?",
      choices: [
        "네트워크 요청 시간",
        "각 컴포넌트의 렌더링 시간과 리렌더링 원인",
        "메모리 사용량",
        "CSS 렌더링 시간",
      ],
      correctIndex: 1,
      explanation:
        "Profiler는 각 컴포넌트가 렌더링에 얼마나 시간이 걸렸는지, 왜 리렌더링되었는지(props 변경, state 변경, 부모 리렌더링 등)를 시각적으로 보여줍니다.",
    },
    {
      id: "mid03-q7",
      question: "React.memo에 커스텀 비교 함수를 전달하는 이유는?",
      choices: [
        "성능을 더 느리게 만들기 위해",
        "얕은 비교로 충분하지 않을 때 깊은 비교나 특정 props만 비교하기 위해",
        "TypeScript 타입 에러를 방지하기 위해",
        "서버 사이드 렌더링을 위해",
      ],
      correctIndex: 1,
      explanation:
        "기본 얕은 비교로는 중첩 객체의 변경을 감지할 수 없을 때, 커스텀 비교 함수로 특정 props만 비교하거나 깊은 비교를 수행할 수 있습니다.",
    },
    {
      id: "mid03-q8",
      question: "children을 직접 전달받는 패턴이 성능에 좋은 이유는?",
      choices: [
        "children이 자동으로 메모이제이션된다",
        "부모가 리렌더링되어도 children의 React 엘리먼트가 변경되지 않으면 자식을 건너뛸 수 있다",
        "children이 서버에서 미리 렌더링된다",
        "DOM 업데이트가 생략된다",
      ],
      correctIndex: 1,
      explanation:
        "children을 props로 받으면, 부모 컴포넌트가 리렌더링되어도 children을 생성한 상위 컴포넌트가 리렌더링되지 않으면 같은 React 엘리먼트 참조를 유지합니다.",
    },
    {
      id: "mid03-q9",
      question: "불필요한 리렌더링의 가장 흔한 원인은?",
      choices: [
        "TypeScript 타입 에러",
        "렌더링마다 새로운 객체/함수 참조를 props로 전달하는 것",
        "CSS 애니메이션",
        "브라우저 캐시",
      ],
      correctIndex: 1,
      explanation:
        "렌더링마다 새 객체({})나 함수(()=>{})를 생성하면, 자식 컴포넌트의 props가 매번 '변경'된 것으로 인식됩니다. useMemo/useCallback으로 참조를 안정화할 수 있습니다.",
    },
    {
      id: "mid03-q10",
      question: "React.lazy와 Suspense를 함께 사용하는 이유는?",
      choices: [
        "에러 처리를 위해",
        "lazy 컴포넌트가 로딩되는 동안 fallback UI를 보여주기 위해",
        "TypeScript 지원을 위해",
        "서버 사이드 렌더링을 위해",
      ],
      correctIndex: 1,
      explanation:
        "React.lazy로 동적 import하면 컴포넌트가 로딩되는 동안 Suspense의 fallback UI(로딩 스피너 등)를 보여줍니다. 두 API는 함께 사용하도록 설계되었습니다.",
    },
    {
      id: "mid03-q11",
      question: "상태를 최대한 하위 컴포넌트에 두어야 하는 이유는?",
      choices: [
        "TypeScript 타입 추론이 좋아진다",
        "상태 변경 시 리렌더링 범위를 최소화한다",
        "서버 사이드 렌더링이 빨라진다",
        "코드가 더 짧아진다",
      ],
      correctIndex: 1,
      explanation:
        "상태를 사용하는 컴포넌트에 가까이 두면, 상태 변경 시 해당 컴포넌트와 그 하위만 리렌더링됩니다. 상위에 두면 더 넓은 범위가 리렌더링됩니다.",
    },
    {
      id: "mid03-q12",
      question: "tanstack-virtual 같은 가상화 라이브러리의 핵심 기술은?",
      choices: [
        "Web Worker",
        "뷰포트 크기 계산과 스크롤 위치에 따른 동적 렌더링",
        "Canvas API",
        "WebGL",
      ],
      correctIndex: 1,
      explanation:
        "가상화 라이브러리는 컨테이너의 크기와 스크롤 위치를 계산하여, 현재 보이는 범위의 항목만 DOM에 렌더링하고 나머지는 제거합니다.",
    },
    {
      id: "mid03-q13",
      question: "Profiler에서 'Highlight updates when components render' 옵션의 용도는?",
      choices: [
        "에러를 시각적으로 표시",
        "리렌더링되는 컴포넌트를 화면에서 시각적으로 하이라이트하여 불필요한 리렌더링을 식별",
        "CSS 변경사항을 표시",
        "네트워크 요청을 모니터링",
      ],
      correctIndex: 1,
      explanation:
        "이 옵션을 활성화하면 리렌더링되는 컴포넌트 주변에 색상 테두리가 나타납니다. 예상치 못한 리렌더링을 시각적으로 빠르게 발견할 수 있습니다.",
    },
    {
      id: "mid03-q14",
      question: "다음 중 렌더링 최적화 전에 먼저 해야 할 것은?",
      choices: [
        "모든 컴포넌트에 React.memo 적용",
        "Profiler로 실제 병목 지점을 측정",
        "모든 상태를 전역으로 올리기",
        "모든 함수에 useCallback 적용",
      ],
      correctIndex: 1,
      explanation:
        "최적화 전에 반드시 측정이 먼저입니다. Profiler로 실제 병목 지점을 확인하지 않으면, 효과 없는 곳에 복잡성만 추가하게 됩니다. '추측하지 말고 측정하라'가 원칙입니다.",
    },
    {
      id: "mid03-q15",
      question: "React에서 상태 업데이트 시 컴포넌트 자체와 모든 자식이 리렌더링되는 기본 동작을 방지하려면?",
      choices: [
        "useRef를 사용한다",
        "React.memo로 자식 컴포넌트를 감싸고 props 참조를 안정화한다",
        "전역 상태를 사용한다",
        "useEffect 안에서 상태를 업데이트한다",
      ],
      correctIndex: 1,
      explanation:
        "React.memo로 자식을 감싸면 props가 변경되지 않았을 때 리렌더링을 건너뜁니다. 이때 useMemo/useCallback으로 props의 참조 안정성을 보장해야 효과가 있습니다.",
    },
  ],
};

export default midQuiz;
