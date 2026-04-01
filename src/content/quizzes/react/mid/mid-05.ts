import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-05",
  title: "중간 점검 5: 라우팅 ~ 데이터 페칭",
  coverGroups: ["라우팅", "데이터 페칭"],
  questions: [
    {
      id: "mid05-q1",
      question: "SPA에서 클라이언트 사이드 라우팅이 필요한 이유는?",
      choices: [
        "SEO를 위해",
        "페이지 전환 시 전체 새로고침 없이 URL과 UI를 동기화하기 위해",
        "서버 부하를 줄이기 위해",
        "CSS를 동적으로 로딩하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "클라이언트 사이드 라우팅은 페이지 전환 시 브라우저 전체를 새로고침하지 않고, JavaScript로 URL과 UI를 동기화합니다. 빠르고 부드러운 사용자 경험을 제공합니다.",
    },
    {
      id: "mid05-q2",
      question: "React Router의 Outlet 컴포넌트의 역할은?",
      choices: [
        "에러 페이지를 렌더링한다",
        "중첩 라우트에서 자식 라우트의 컴포넌트를 렌더링할 위치를 지정한다",
        "리다이렉트를 처리한다",
        "URL 파라미터를 파싱한다",
      ],
      correctIndex: 1,
      explanation:
        "Outlet은 부모 라우트 컴포넌트 안에서 자식 라우트가 렌더링될 자리를 표시합니다. 레이아웃(네비게이션, 사이드바)을 유지하면서 중첩 콘텐츠를 교체합니다.",
    },
    {
      id: "mid05-q3",
      question: "useParams()의 반환값은?",
      choices: [
        "쿼리 스트링 파라미터 객체",
        "URL 경로의 동적 세그먼트(예: /users/:id의 id) 객체",
        "전체 URL 문자열",
        "브라우저 히스토리 객체",
      ],
      correctIndex: 1,
      explanation:
        "useParams()는 현재 URL의 동적 세그먼트를 객체로 반환합니다. /users/:id 경로에서 /users/123으로 접근하면 { id: '123' }을 반환합니다.",
    },
    {
      id: "mid05-q4",
      question: "React Router의 loader 함수의 역할은?",
      choices: [
        "컴포넌트를 지연 로딩한다",
        "라우트 진입 전에 데이터를 미리 가져온다",
        "CSS를 프리로딩한다",
        "인증 토큰을 갱신한다",
      ],
      correctIndex: 1,
      explanation:
        "loader는 라우트가 매칭되면 컴포넌트 렌더링 전에 실행되어 필요한 데이터를 미리 가져옵니다. 워터폴(fetch-on-render)을 방지하고 render-as-you-fetch 패턴을 구현합니다.",
    },
    {
      id: "mid05-q5",
      question: "Protected Route(인증 라우트)를 구현하는 방법은?",
      choices: [
        "모든 페이지에 인증 로직을 복사한다",
        "인증 상태를 확인하고, 미인증 시 로그인 페이지로 리다이렉트하는 래퍼 컴포넌트를 만든다",
        "서버에서만 인증을 처리한다",
        "CSS로 미인증 사용자에게 페이지를 숨긴다",
      ],
      correctIndex: 1,
      explanation:
        "인증 상태를 확인하는 래퍼 컴포넌트(ProtectedRoute)로 보호할 라우트를 감싸고, 미인증 시 Navigate로 리다이렉트합니다.",
    },
    {
      id: "mid05-q6",
      question: "React Query의 staleTime과 gcTime의 차이는?",
      choices: [
        "동일한 설정이다",
        "staleTime은 데이터가 신선한 기간, gcTime은 비활성 캐시가 메모리에 유지되는 기간",
        "staleTime은 서버, gcTime은 클라이언트 설정이다",
        "staleTime은 초 단위, gcTime은 분 단위이다",
      ],
      correctIndex: 1,
      explanation:
        "staleTime 동안은 데이터가 신선하여 재요청하지 않습니다. gcTime은 컴포넌트가 언마운트된 후 캐시가 가비지 컬렉션되기까지의 시간입니다.",
    },
    {
      id: "mid05-q7",
      question: "React Query에서 queryKey의 역할은?",
      choices: [
        "TypeScript 타입을 지정한다",
        "캐시를 고유하게 식별하고, 의존성이 변경되면 자동으로 재요청한다",
        "에러 메시지를 결정한다",
        "요청 순서를 결정한다",
      ],
      correctIndex: 1,
      explanation:
        "queryKey는 캐시 항목의 고유 식별자입니다. ['users', userId]처럼 의존 변수를 포함하면, userId가 변경될 때 자동으로 새 데이터를 요청합니다.",
    },
    {
      id: "mid05-q8",
      question: "useMutation과 useQuery의 차이는?",
      choices: [
        "둘 다 데이터를 읽는다",
        "useQuery는 데이터 조회(GET), useMutation은 데이터 변경(POST/PUT/DELETE)에 사용한다",
        "useMutation이 더 빠르다",
        "useQuery만 캐싱을 지원한다",
      ],
      correctIndex: 1,
      explanation:
        "useQuery는 데이터를 읽는 GET 요청에, useMutation은 데이터를 생성/수정/삭제하는 변경 작업에 사용합니다. mutation 성공 후 queryClient.invalidateQueries로 관련 쿼리를 무효화합니다.",
    },
    {
      id: "mid05-q9",
      question: "낙관적 업데이트(Optimistic Update)란?",
      choices: [
        "서버 응답 후 UI를 업데이트한다",
        "서버 응답을 기다리지 않고 미리 UI를 업데이트하고, 실패 시 롤백한다",
        "모든 요청을 캐시에서 처리한다",
        "네트워크 없이 동작한다",
      ],
      correctIndex: 1,
      explanation:
        "낙관적 업데이트는 서버 요청과 동시에 UI를 먼저 업데이트합니다. 대부분 성공한다고 가정하여 즉각적인 피드백을 제공하고, 실패 시 이전 상태로 롤백합니다.",
    },
    {
      id: "mid05-q10",
      question: "useOptimistic Hook의 역할은?",
      choices: [
        "에러를 자동으로 처리한다",
        "서버 응답 전에 임시 낙관적 상태를 관리한다",
        "캐시를 자동으로 무효화한다",
        "폼 데이터를 검증한다",
      ],
      correctIndex: 1,
      explanation:
        "React 19의 useOptimistic은 서버 액션이 진행 중인 동안 낙관적 상태를 보여줍니다. 액션이 완료되면 실제 서버 데이터로 대체됩니다.",
    },
    {
      id: "mid05-q11",
      question: "SWR 이름의 의미는?",
      choices: [
        "Server Worker Response",
        "Stale-While-Revalidate (오래된 캐시를 보여주면서 백그라운드에서 갱신)",
        "Synchronous Web Request",
        "State With Reducer",
      ],
      correctIndex: 1,
      explanation:
        "SWR은 HTTP 캐싱 전략인 stale-while-revalidate에서 이름을 따왔습니다. 캐시된 데이터를 먼저 보여주고(stale), 백그라운드에서 최신 데이터를 가져옵니다(revalidate).",
    },
    {
      id: "mid05-q12",
      question: "React Query에서 queryClient.invalidateQueries의 역할은?",
      choices: [
        "쿼리를 삭제한다",
        "캐시된 데이터를 stale로 표시하여 다음 접근 시 재요청하게 한다",
        "쿼리를 일시 정지한다",
        "에러 상태를 초기화한다",
      ],
      correctIndex: 1,
      explanation:
        "invalidateQueries는 해당 쿼리의 캐시를 stale로 표시합니다. 현재 활성 상태이면 즉시 재요청하고, 비활성이면 다음 마운트 시 재요청합니다.",
    },
    {
      id: "mid05-q13",
      question: "fetch-on-render vs render-as-you-fetch 패턴의 차이는?",
      choices: [
        "동일한 패턴이다",
        "fetch-on-render는 렌더링 후 요청, render-as-you-fetch는 렌더링과 동시에 요청",
        "render-as-you-fetch가 더 느리다",
        "fetch-on-render만 Suspense를 사용한다",
      ],
      correctIndex: 1,
      explanation:
        "fetch-on-render는 컴포넌트가 마운트된 후 데이터를 요청합니다(워터폴). render-as-you-fetch는 라우트 전환 시점에 데이터 요청을 시작하여 병렬로 처리합니다.",
    },
    {
      id: "mid05-q14",
      question: "React Router에서 useSearchParams의 용도는?",
      choices: [
        "URL 경로를 변경한다",
        "URL의 쿼리 스트링(?key=value)을 읽고 쓴다",
        "라우트 히스토리를 관리한다",
        "라우트 매칭을 수행한다",
      ],
      correctIndex: 1,
      explanation:
        "useSearchParams는 URL의 쿼리 스트링을 URLSearchParams 객체로 반환하고, 이를 수정할 수 있는 setter를 제공합니다. 필터, 정렬, 페이지네이션에 유용합니다.",
    },
    {
      id: "mid05-q15",
      question: "Infinite Query(무한 스크롤)에서 getNextPageParam의 역할은?",
      choices: [
        "스크롤 위치를 계산한다",
        "다음 페이지의 파라미터를 결정하고, undefined를 반환하면 더 이상 페이지가 없음을 표시한다",
        "이전 페이지를 삭제한다",
        "로딩 스피너를 표시한다",
      ],
      correctIndex: 1,
      explanation:
        "getNextPageParam은 마지막 페이지의 데이터를 기반으로 다음 페이지의 커서/오프셋을 반환합니다. undefined를 반환하면 hasNextPage가 false가 되어 더 이상 요청하지 않습니다.",
    },
    {
      id: "mid05-q16",
      question: "라우트 기반 코드 스플리팅과 데이터 페칭을 결합하면 어떤 이점이 있는가?",
      choices: [
        "코드가 더 복잡해진다",
        "페이지 컴포넌트와 데이터를 동시에 로딩하여 워터폴을 제거한다",
        "번들 크기가 증가한다",
        "캐시가 비활성화된다",
      ],
      correctIndex: 1,
      explanation:
        "라우트 전환 시 컴포넌트 코드(lazy)와 데이터(loader/prefetch)를 동시에 요청하면, 순차적 워터폴을 제거하고 전체 로딩 시간을 줄입니다.",
    },
  ],
};

export default midQuiz;
