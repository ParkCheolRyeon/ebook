import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-02",
  title: "중간 점검 2: 데이터 페칭 ~ 라우팅 심화",
  coverGroups: ["데이터 페칭과 캐싱", "라우팅 심화"],
  questions: [
    {
      id: "mid02-q1",
      question:
        "Next.js App Router에서 서버 컴포넌트의 fetch가 기본적으로 캐싱되던 동작이 Next.js 15에서 어떻게 변경되었는가?",
      choices: [
        "여전히 기본적으로 캐싱된다",
        "기본 동작이 no-store(캐싱 안 함)로 변경되었다",
        "클라이언트에서만 캐싱된다",
        "빌드 타임에만 캐싱된다",
      ],
      correctIndex: 1,
      explanation:
        "Next.js 15부터 fetch의 기본 캐싱 동작이 변경되어, 명시적으로 캐싱을 설정하지 않으면 매 요청마다 새로운 데이터를 가져옵니다. 캐싱이 필요하면 force-cache 옵션을 명시해야 합니다.",
    },
    {
      id: "mid02-q2",
      question:
        "revalidatePath와 revalidateTag의 차이점은?",
      choices: [
        "revalidatePath는 특정 경로의 캐시를, revalidateTag는 태그가 지정된 모든 캐시 엔트리를 무효화한다",
        "revalidatePath는 클라이언트, revalidateTag는 서버에서 실행된다",
        "둘 다 동일한 기능이며 이름만 다르다",
        "revalidateTag는 빌드 타임에만 동작한다",
      ],
      correctIndex: 0,
      explanation:
        "revalidatePath는 특정 URL 경로의 캐시를 무효화하고, revalidateTag는 fetch 시 지정한 태그에 연결된 모든 캐시 엔트리를 무효화합니다. 태그 기반이 더 세밀한 제어를 제공합니다.",
    },
    {
      id: "mid02-q3",
      question:
        "ISR(Incremental Static Regeneration)이 해결하는 문제는?",
      choices: [
        "클라이언트 사이드 렌더링의 SEO 문제",
        "정적 생성의 장점(빠른 응답)을 유지하면서 데이터를 주기적으로 갱신할 수 있게 한다",
        "서버 컴포넌트의 메모리 문제",
        "WebSocket 연결 관리",
      ],
      correctIndex: 1,
      explanation:
        "ISR은 빌드 시 정적으로 생성된 페이지를 설정된 시간 간격(revalidate)에 따라 백그라운드에서 재생성합니다. 정적 사이트의 성능과 동적 콘텐츠 갱신을 모두 달성합니다.",
    },
    {
      id: "mid02-q4",
      question:
        "React Suspense와 스트리밍을 활용하면 얻는 실질적 이점은?",
      choices: [
        "전체 번들 크기가 줄어든다",
        "느린 데이터 소스가 있어도 준비된 부분부터 점진적으로 HTML을 전송하여 TTFB와 FCP를 개선한다",
        "클라이언트에서 JavaScript가 필요 없어진다",
        "서버 비용이 절감된다",
      ],
      correctIndex: 1,
      explanation:
        "스트리밍은 서버에서 준비된 HTML을 점진적으로 클라이언트에 전송합니다. 느린 API 응답이 있어도 나머지 UI를 먼저 보여주므로 사용자 체감 성능이 크게 향상됩니다.",
    },
    {
      id: "mid02-q5",
      question:
        "동적 라우트에서 generateStaticParams의 역할은?",
      choices: [
        "클라이언트 사이드 라우팅을 설정한다",
        "빌드 타임에 동적 세그먼트의 가능한 값을 미리 정의하여 정적으로 페이지를 생성한다",
        "런타임에 동적으로 URL을 생성한다",
        "라우트 매개변수의 타입을 검증한다",
      ],
      correctIndex: 1,
      explanation:
        "generateStaticParams는 빌드 타임에 동적 라우트의 가능한 매개변수 조합을 반환하여, 해당 경로들을 미리 정적 생성(SSG)합니다. 빌드 시 없는 경로는 요청 시 동적으로 생성될 수 있습니다.",
    },
    {
      id: "mid02-q6",
      question:
        "Route Groups ((groupName))의 주요 용도는?",
      choices: [
        "URL 경로에 그룹 이름이 포함된다",
        "URL 구조에 영향을 주지 않고 라우트를 논리적으로 구성하거나, 세그먼트별로 다른 레이아웃을 적용한다",
        "API 라우트를 그룹화한다",
        "접근 권한을 그룹 단위로 관리한다",
      ],
      correctIndex: 1,
      explanation:
        "괄호로 감싼 폴더명은 URL 경로에 포함되지 않습니다. 라우트를 논리적으로 구성하거나, 같은 수준에서 서로 다른 레이아웃을 적용할 때 유용합니다.",
    },
    {
      id: "mid02-q7",
      question:
        "Parallel Routes(@folder)를 사용하는 실제 시나리오는?",
      choices: [
        "URL을 여러 세그먼트로 분리한다",
        "대시보드에서 여러 독립적인 섹션을 동시에 렌더링하며, 각각 독립적인 로딩/에러 상태를 가진다",
        "여러 페이지를 동시에 프리페칭한다",
        "같은 컴포넌트를 병렬로 렌더링한다",
      ],
      correctIndex: 1,
      explanation:
        "Parallel Routes는 같은 레이아웃 안에서 여러 페이지를 동시에 렌더링합니다. 각 슬롯이 독립적인 로딩/에러 상태를 가질 수 있어, 대시보드나 모달 등 복잡한 UI에 적합합니다.",
    },
    {
      id: "mid02-q8",
      question:
        "Intercepting Routes((..)folder)의 대표적인 사용 사례는?",
      choices: [
        "라우트를 보호하여 인증되지 않은 접근을 차단한다",
        "현재 레이아웃 내에서 다른 라우트의 콘텐츠를 모달로 표시하면서, 직접 URL 접근 시에는 전체 페이지로 렌더링한다",
        "라우트 간 데이터를 가로챈다",
        "API 요청을 프록시한다",
      ],
      correctIndex: 1,
      explanation:
        "Intercepting Routes는 소프트 네비게이션 시 다른 라우트를 현재 레이아웃의 모달로 표시합니다. 직접 URL 접근(하드 네비게이션)시에는 원래 전체 페이지로 렌더링됩니다.",
    },
    {
      id: "mid02-q9",
      question:
        "Next.js 미들웨어가 실행되는 시점과 적합한 작업은?",
      choices: [
        "빌드 타임에 실행되며 정적 최적화를 수행한다",
        "요청이 완료된 후에 실행되며 응답을 수정한다",
        "요청이 처리되기 전에 Edge에서 실행되며, 리다이렉트/리라이트/헤더 수정 등을 수행한다",
        "클라이언트에서 실행되며 라우트 가드 역할을 한다",
      ],
      correctIndex: 2,
      explanation:
        "미들웨어는 요청이 캐시나 라우트 핸들러에 도달하기 전에 Edge 런타임에서 실행됩니다. 인증 확인 후 리다이렉트, URL 리라이트, 요청/응답 헤더 수정 등에 적합합니다.",
    },
    {
      id: "mid02-q10",
      question:
        "Next.js에서 여러 데이터 요청이 있을 때 워터폴을 방지하는 방법은?",
      choices: [
        "useEffect에서 순차적으로 호출한다",
        "Promise.all로 병렬 페칭하거나, 각 데이터 요청을 별도 컴포넌트에서 Suspense와 함께 사용한다",
        "모든 데이터를 하나의 API로 합친다",
        "getServerSideProps를 사용한다",
      ],
      correctIndex: 1,
      explanation:
        "Promise.all로 여러 fetch를 병렬 실행하거나, 각 데이터 요청을 별도의 Server Component로 분리하고 Suspense로 감싸면 독립적으로 스트리밍되어 워터폴을 방지할 수 있습니다.",
    },
  ],
};

export default midQuiz;
