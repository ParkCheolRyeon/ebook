import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-04",
  title: "중간 점검 4: 상태 관리",
  coverGroups: ["상태 관리"],
  questions: [
    {
      id: "mid04-q1",
      question: "전역 상태 관리 라이브러리가 필요한 시점은?",
      choices: [
        "프로젝트 시작 시 항상 필요하다",
        "여러 컴포넌트 트리에서 같은 상태를 공유하고 props drilling이 심해질 때",
        "상태가 1개라도 있으면 필요하다",
        "타입 안전성을 위해 항상 필요하다",
      ],
      correctIndex: 1,
      explanation:
        "전역 상태 관리는 여러 먼 컴포넌트가 같은 상태를 공유할 때 필요합니다. 단순한 상태는 useState와 props로 충분하고, prop drilling이 3-4단계 이상이면 고려합니다.",
    },
    {
      id: "mid04-q2",
      question: "Context API의 성능 한계는?",
      choices: [
        "상태를 저장할 수 없다",
        "Context 값이 변경되면 모든 소비자가 리렌더링된다",
        "비동기 작업을 지원하지 않는다",
        "TypeScript를 사용할 수 없다",
      ],
      correctIndex: 1,
      explanation:
        "Context 값이 변경되면 해당 Context를 사용하는 모든 컴포넌트가 리렌더링됩니다. 필요한 값만 구독하는 선택적 리렌더링이 불가능합니다.",
    },
    {
      id: "mid04-q3",
      question: "Redux Toolkit의 createSlice가 해결하는 문제는?",
      choices: [
        "비동기 API 호출",
        "보일러플레이트(액션 타입, 액션 생성자, 리듀서를 한 곳에 작성)",
        "서버 사이드 렌더링",
        "라우팅",
      ],
      correctIndex: 1,
      explanation:
        "createSlice는 액션 타입, 액션 생성자, 리듀서를 한 곳에서 정의합니다. 기존 Redux의 많은 보일러플레이트를 제거하고, Immer를 내장하여 불변 업데이트를 간편하게 합니다.",
    },
    {
      id: "mid04-q4",
      question: "Zustand의 가장 큰 장점은?",
      choices: [
        "Redux와 동일한 API",
        "간결한 API와 보일러플레이트 최소화, Provider 불필요",
        "서버 컴포넌트 전용",
        "자동 타입 추론이 완벽하다",
      ],
      correctIndex: 1,
      explanation:
        "Zustand는 최소한의 API로 전역 상태를 관리합니다. Provider가 불필요하고, create 함수 하나로 스토어를 만들어 바로 사용할 수 있습니다.",
    },
    {
      id: "mid04-q5",
      question: "Redux Toolkit의 createAsyncThunk의 역할은?",
      choices: [
        "동기 액션을 생성한다",
        "비동기 작업을 위한 thunk를 생성하고 pending/fulfilled/rejected 액션을 자동 디스패치한다",
        "미들웨어를 등록한다",
        "스토어를 초기화한다",
      ],
      correctIndex: 1,
      explanation:
        "createAsyncThunk는 비동기 작업(API 호출 등)을 위한 thunk를 생성하고, 자동으로 pending/fulfilled/rejected 액션을 디스패치합니다. extraReducers에서 각 상태를 처리합니다.",
    },
    {
      id: "mid04-q6",
      question: "서버 상태(Server State)와 클라이언트 상태(Client State)의 차이는?",
      choices: [
        "차이가 없다",
        "서버 상태는 외부 소유로 캐싱/동기화가 필요하고, 클라이언트 상태는 앱이 완전히 제어한다",
        "서버 상태는 전역, 클라이언트 상태는 로컬이다",
        "서버 상태는 숫자, 클라이언트 상태는 문자열이다",
      ],
      correctIndex: 1,
      explanation:
        "서버 상태는 DB에 소유권이 있어 캐싱, 동기화, 무효화가 필요합니다. 클라이언트 상태(UI 토글, 폼 입력 등)는 앱이 완전히 제어하므로 특성이 다릅니다.",
    },
    {
      id: "mid04-q7",
      question: "Context 성능 문제를 해결하는 방법이 아닌 것은?",
      choices: [
        "Context를 분리하여 관련 상태끼리 묶는다",
        "useMemo로 Context value를 메모이제이션한다",
        "모든 상태를 하나의 거대한 Context에 넣는다",
        "상태와 dispatch를 별도의 Context로 분리한다",
      ],
      correctIndex: 2,
      explanation:
        "모든 상태를 하나의 Context에 넣으면, 어떤 값이 변경되어도 모든 소비자가 리렌더링됩니다. Context를 분리하고, value를 메모이제이션하는 것이 올바른 최적화입니다.",
    },
    {
      id: "mid04-q8",
      question: "Zustand에서 선택적 구독(selector)이 중요한 이유는?",
      choices: [
        "코드가 더 짧아진다",
        "필요한 상태만 구독하여 불필요한 리렌더링을 방지한다",
        "TypeScript 타입이 더 정확해진다",
        "서버에서도 사용할 수 있다",
      ],
      correctIndex: 1,
      explanation:
        "useStore(state => state.count)처럼 필요한 값만 선택하면, 다른 상태가 변경되어도 이 컴포넌트는 리렌더링되지 않습니다. 전체 store를 구독하면 모든 변경에 리렌더링됩니다.",
    },
    {
      id: "mid04-q9",
      question: "Redux에서 Immer가 해결하는 문제는?",
      choices: [
        "비동기 처리",
        "불변 업데이트를 직관적인 뮤터블 문법으로 작성할 수 있게 한다",
        "미들웨어 관리",
        "타입 추론",
      ],
      correctIndex: 1,
      explanation:
        "Immer를 사용하면 state.items.push(newItem) 같은 뮤터블 코드를 작성해도, 내부적으로 불변 업데이트로 변환됩니다. 깊은 중첩 객체 업데이트가 간편해집니다.",
    },
    {
      id: "mid04-q10",
      question: "상태 관리 라이브러리 선택 시 가장 중요한 기준은?",
      choices: [
        "GitHub 스타 수",
        "프로젝트의 복잡도와 팀의 익숙함",
        "번들 크기만",
        "최신 버전 여부만",
      ],
      correctIndex: 1,
      explanation:
        "상태 관리 라이브러리는 프로젝트 규모, 상태 복잡도, 팀의 경험을 고려하여 선택해야 합니다. 작은 프로젝트에 Redux는 과도하고, 큰 프로젝트에 Context만으로는 부족합니다.",
    },
    {
      id: "mid04-q11",
      question: "Redux DevTools의 시간 여행 디버깅(Time Travel)이란?",
      choices: [
        "코드를 이전 버전으로 되돌린다",
        "이전 액션 시점으로 상태를 되돌려 재현하고 디버깅할 수 있다",
        "브라우저 히스토리를 관리한다",
        "비동기 작업을 되감는다",
      ],
      correctIndex: 1,
      explanation:
        "Redux DevTools에서 디스패치된 액션 목록을 탐색하며 특정 시점의 상태로 되돌릴 수 있습니다. 버그가 발생한 정확한 액션을 찾는 데 유용합니다.",
    },
    {
      id: "mid04-q12",
      question: "다음 중 Zustand 스토어 생성 방법으로 올바른 것은?",
      choices: [
        "new Store()",
        "create((set) => ({ count: 0, increment: () => set(s => ({ count: s.count + 1 })) }))",
        "createStore({ count: 0 })",
        "useStore.create()",
      ],
      correctIndex: 1,
      explanation:
        "Zustand는 create 함수에 set 함수를 인자로 받는 콜백을 전달하여 스토어를 생성합니다. set으로 상태를 업데이트하고, 반환 객체가 초기 상태와 액션이 됩니다.",
    },
    {
      id: "mid04-q13",
      question: "Redux Toolkit의 RTK Query가 해결하는 문제는?",
      choices: [
        "라우팅",
        "API 데이터 캐싱, 동기화, 요청 생명주기 관리",
        "폼 검증",
        "CSS-in-JS",
      ],
      correctIndex: 1,
      explanation:
        "RTK Query는 API 요청, 캐싱, 자동 갱신, 낙관적 업데이트 등을 선언적으로 관리합니다. React Query와 유사한 서버 상태 관리를 Redux 생태계에서 제공합니다.",
    },
    {
      id: "mid04-q14",
      question: "props drilling이란?",
      choices: [
        "props의 타입을 검사하는 것",
        "중간 컴포넌트가 사용하지 않는 props를 자식에게 전달만 하는 것",
        "props를 동적으로 생성하는 것",
        "props를 서버에 전송하는 것",
      ],
      correctIndex: 1,
      explanation:
        "props drilling은 여러 계층의 컴포넌트를 거쳐 데이터를 전달하는 것입니다. 중간 컴포넌트가 해당 데이터를 사용하지 않아도 전달해야 하므로 유지보수가 어려워집니다.",
    },
    {
      id: "mid04-q15",
      question: "Zustand의 middleware (persist, devtools)의 역할은?",
      choices: [
        "서버와 통신한다",
        "스토어에 영속성(localStorage)이나 DevTools 연결 같은 기능을 추가한다",
        "라우팅을 관리한다",
        "CSS를 최적화한다",
      ],
      correctIndex: 1,
      explanation:
        "persist 미들웨어는 상태를 localStorage 등에 자동 저장/복원하고, devtools 미들웨어는 Redux DevTools와 연결하여 상태 변화를 추적할 수 있게 합니다.",
    },
    {
      id: "mid04-q16",
      question: "상태 정규화(Normalization)의 목적은?",
      choices: [
        "코드를 짧게 만든다",
        "중첩된 데이터를 ID 기반의 평탄한 구조로 변환하여 업데이트 효율을 높인다",
        "모든 상태를 문자열로 변환한다",
        "상태를 암호화한다",
      ],
      correctIndex: 1,
      explanation:
        "정규화는 중첩 객체를 { byId: {}, allIds: [] } 형태로 평탄화합니다. 특정 항목을 ID로 즉시 접근할 수 있고, 중복 데이터 없이 업데이트가 효율적입니다.",
    },
    {
      id: "mid04-q17",
      question: "다음 중 클라이언트 상태에 해당하는 것은?",
      choices: [
        "사용자 프로필 데이터",
        "모달의 열림/닫힘 상태",
        "상품 목록",
        "댓글 데이터",
      ],
      correctIndex: 1,
      explanation:
        "모달 열림/닫힘은 UI에서만 의미 있는 클라이언트 상태입니다. 사용자 프로필, 상품 목록, 댓글은 서버에서 가져오는 서버 상태로, 캐싱과 동기화가 필요합니다.",
    },
  ],
};

export default midQuiz;
