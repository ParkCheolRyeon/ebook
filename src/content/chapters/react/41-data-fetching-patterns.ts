import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "41-data-fetching-patterns",
  subject: "react",
  title: "데이터 페칭 패턴",
  description:
    "useEffect 페칭의 문제점, race condition, AbortController, 로딩/에러/데이터 상태 관리, 커스텀 useFetch Hook을 학습합니다.",
  order: 41,
  group: "데이터 페칭",
  prerequisites: ["40-routing-patterns"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "데이터 페칭은 식당에서 음식을 주문하는 것과 같습니다.\n\n" +
        "**useEffect 페칭**은 직접 카운터에서 주문하는 것입니다. 주문하고, 기다리고, 받고, 에러 처리까지 모두 직접 해야 합니다.\n\n" +
        "**Race Condition**은 주문을 바꾸는 상황입니다. 김치찌개를 주문했다가 된장찌개로 변경했는데, 김치찌개가 먼저 도착하면 혼란이 생깁니다.\n\n" +
        "**AbortController**는 주문 취소 벨입니다. 이전 주문을 확실하게 취소하여 잘못된 음식이 나오는 것을 방지합니다.\n\n" +
        "**커스텀 useFetch**는 배달 앱입니다. 주문, 대기, 수령, 취소 등 복잡한 과정을 앱이 대신 관리해줍니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "useEffect로 직접 데이터를 가져올 때 발생하는 문제들:\n\n" +
        "1. **Race Condition** — 빠르게 검색어를 바꾸면 이전 요청의 응답이 나중에 도착하여 잘못된 결과가 표시됩니다\n" +
        "2. **메모리 누수** — 컴포넌트가 언마운트된 후 비동기 응답이 도착하면 setState를 호출하여 경고가 발생합니다\n" +
        "3. **보일러플레이트** — 매번 loading, error, data 상태를 선언하고 관리해야 합니다\n" +
        "4. **캐싱 없음** — 같은 데이터를 다시 요청할 때 캐시를 활용하지 못합니다\n" +
        "5. **중복 요청** — 같은 데이터를 동시에 요청하는 여러 컴포넌트가 각각 API를 호출합니다",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### AbortController로 Race Condition 해결\n" +
        "useEffect의 cleanup 함수에서 AbortController.abort()를 호출하여 이전 요청을 취소합니다.\n\n" +
        "### 상태 머신 패턴\n" +
        "idle → loading → success | error 상태 전이를 명확히 하여 불가능한 상태 조합을 방지합니다.\n\n" +
        "### 커스텀 useFetch Hook\n" +
        "반복되는 페칭 로직을 Hook으로 추출하여 재사용합니다. 로딩, 에러, 데이터 상태와 AbortController를 캡슐화합니다.\n\n" +
        "### 근본 해결: 전용 라이브러리\n" +
        "위의 문제들을 완벽히 해결하려면 React Query나 SWR 같은 전용 라이브러리를 사용하는 것이 최선입니다. 커스텀 Hook은 학습 목적과 간단한 경우에 적합합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Race Condition과 AbortController",
      content:
        "useEffect 페칭의 문제점과 AbortController를 사용한 해결 방법입니다.",
      code: {
        language: "typescript",
        code:
          'import { useState, useEffect } from "react";\n' +
          '\n' +
          '// ❌ Race Condition이 발생하는 코드\n' +
          'function SearchBad({ query }: { query: string }) {\n' +
          '  const [results, setResults] = useState<string[]>([]);\n' +
          '\n' +
          '  useEffect(() => {\n' +
          '    // query가 빠르게 변경되면 이전 응답이 나중에 도착할 수 있음\n' +
          '    fetch(`/api/search?q=${query}`)\n' +
          '      .then((res) => res.json())\n' +
          '      .then((data) => setResults(data));\n' +
          '    // "A" 요청(200ms) → "AB" 요청(50ms)\n' +
          '    // "AB" 응답이 먼저 도착 → "A" 응답이 나중에 도착 → 잘못된 결과!\n' +
          '  }, [query]);\n' +
          '\n' +
          '  return <ul>{results.map((r) => <li key={r}>{r}</li>)}</ul>;\n' +
          '}\n' +
          '\n' +
          '// ✅ AbortController로 Race Condition 해결\n' +
          'function SearchGood({ query }: { query: string }) {\n' +
          '  const [results, setResults] = useState<string[]>([]);\n' +
          '  const [isLoading, setIsLoading] = useState(false);\n' +
          '  const [error, setError] = useState<string | null>(null);\n' +
          '\n' +
          '  useEffect(() => {\n' +
          '    const controller = new AbortController();\n' +
          '    setIsLoading(true);\n' +
          '    setError(null);\n' +
          '\n' +
          '    fetch(`/api/search?q=${query}`, { signal: controller.signal })\n' +
          '      .then((res) => {\n' +
          '        if (!res.ok) throw new Error(`HTTP ${res.status}`);\n' +
          '        return res.json();\n' +
          '      })\n' +
          '      .then((data) => {\n' +
          '        setResults(data);\n' +
          '        setIsLoading(false);\n' +
          '      })\n' +
          '      .catch((err) => {\n' +
          '        if (err.name === "AbortError") return; // 취소된 요청은 무시\n' +
          '        setError(err.message);\n' +
          '        setIsLoading(false);\n' +
          '      });\n' +
          '\n' +
          '    // cleanup: 이전 요청 취소\n' +
          '    return () => controller.abort();\n' +
          '  }, [query]);\n' +
          '\n' +
          '  if (isLoading) return <div>검색 중...</div>;\n' +
          '  if (error) return <div>에러: {error}</div>;\n' +
          '  return <ul>{results.map((r) => <li key={r}>{r}</li>)}</ul>;\n' +
          '}',
        description:
          "AbortController의 signal을 fetch에 전달하고, cleanup에서 abort()를 호출하면 이전 요청이 취소됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 커스텀 useFetch Hook",
      content:
        "반복되는 페칭 로직을 재사용 가능한 Hook으로 추출합니다.",
      code: {
        language: "typescript",
        code:
          'import { useState, useEffect, useCallback } from "react";\n' +
          '\n' +
          '// 상태 타입: 불가능한 조합 방지\n' +
          'type FetchState<T> =\n' +
          '  | { status: "idle"; data: null; error: null }\n' +
          '  | { status: "loading"; data: null; error: null }\n' +
          '  | { status: "success"; data: T; error: null }\n' +
          '  | { status: "error"; data: null; error: string };\n' +
          '\n' +
          'function useFetch<T>(url: string) {\n' +
          '  const [state, setState] = useState<FetchState<T>>({\n' +
          '    status: "idle",\n' +
          '    data: null,\n' +
          '    error: null,\n' +
          '  });\n' +
          '\n' +
          '  const refetch = useCallback(() => {\n' +
          '    const controller = new AbortController();\n' +
          '\n' +
          '    setState({ status: "loading", data: null, error: null });\n' +
          '\n' +
          '    fetch(url, { signal: controller.signal })\n' +
          '      .then((res) => {\n' +
          '        if (!res.ok) throw new Error(`HTTP ${res.status}`);\n' +
          '        return res.json() as Promise<T>;\n' +
          '      })\n' +
          '      .then((data) => {\n' +
          '        setState({ status: "success", data, error: null });\n' +
          '      })\n' +
          '      .catch((err) => {\n' +
          '        if (err.name === "AbortError") return;\n' +
          '        setState({ status: "error", data: null, error: err.message });\n' +
          '      });\n' +
          '\n' +
          '    return () => controller.abort();\n' +
          '  }, [url]);\n' +
          '\n' +
          '  useEffect(() => {\n' +
          '    const cleanup = refetch();\n' +
          '    return cleanup;\n' +
          '  }, [refetch]);\n' +
          '\n' +
          '  return { ...state, refetch };\n' +
          '}\n' +
          '\n' +
          '// 사용 예시\n' +
          'interface User {\n' +
          '  id: number;\n' +
          '  name: string;\n' +
          '}\n' +
          '\n' +
          'function UserList() {\n' +
          '  const { status, data, error, refetch } = useFetch<User[]>("/api/users");\n' +
          '\n' +
          '  switch (status) {\n' +
          '    case "idle":\n' +
          '    case "loading":\n' +
          '      return <div>로딩 중...</div>;\n' +
          '    case "error":\n' +
          '      return (\n' +
          '        <div>\n' +
          '          <p>에러: {error}</p>\n' +
          '          <button onClick={refetch}>재시도</button>\n' +
          '        </div>\n' +
          '      );\n' +
          '    case "success":\n' +
          '      return (\n' +
          '        <ul>\n' +
          '          {data.map((user) => <li key={user.id}>{user.name}</li>)}\n' +
          '        </ul>\n' +
          '      );\n' +
          '  }\n' +
          '}',
        description:
          "discriminated union으로 상태를 정의하면 TypeScript가 각 case에서 올바른 타입을 추론합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 문제 | 원인 | 해결 |\n" +
        "|------|------|------|\n" +
        "| Race Condition | 이전 요청의 응답이 늦게 도착 | AbortController로 이전 요청 취소 |\n" +
        "| 메모리 누수 | 언마운트 후 setState 호출 | cleanup에서 abort() |\n" +
        "| 보일러플레이트 | 매번 loading/error/data 관리 | 커스텀 useFetch Hook |\n" +
        "| 불가능한 상태 | loading이면서 error인 상태 | discriminated union 타입 |\n\n" +
        "**핵심:** useEffect 페칭은 학습 목적으로 중요하지만, 실무에서는 React Query나 SWR 같은 전용 라이브러리를 사용하세요. 이 라이브러리들은 캐싱, 중복 요청 제거, 자동 재검증 등을 추가로 제공합니다.\n\n" +
        "**다음 챕터 미리보기:** React Query(TanStack Query)로 선언적이고 효율적인 서버 상태 관리를 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "데이터 페칭은 useEffect + state가 기본이지만, 경쟁 조건과 로딩/에러 상태 관리가 복잡하다. 전용 라이브러리(React Query, SWR)가 이 복잡성을 해결한다.",
  checklist: [
    "useEffect 페칭에서 race condition이 발생하는 원리를 설명할 수 있다",
    "AbortController를 사용하여 요청을 취소할 수 있다",
    "discriminated union으로 안전한 상태 타입을 정의할 수 있다",
    "커스텀 useFetch Hook을 작성할 수 있다",
    "useEffect 페칭의 한계와 전용 라이브러리의 필요성을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Race condition이 발생하는 원인은?",
      choices: [
        "네트워크 속도가 느려서",
        "이전 요청의 응답이 최신 요청의 응답보다 늦게 도착하여 데이터를 덮어써서",
        "서버가 요청을 거부해서",
        "브라우저 캐시가 만료되어서",
      ],
      correctIndex: 1,
      explanation:
        "검색어가 A → AB로 변경될 때, A 요청이 AB 요청보다 늦게 응답하면 최종 결과가 A의 결과로 덮어써집니다.",
    },
    {
      id: "q2",
      question: "AbortController.abort()를 호출하면 fetch에 어떤 에러가 발생하는가?",
      choices: [
        "TypeError",
        "AbortError",
        "NetworkError",
        "TimeoutError",
      ],
      correctIndex: 1,
      explanation:
        "abort() 호출 시 fetch는 AbortError를 throw합니다. catch에서 err.name === 'AbortError'를 확인하여 의도적 취소를 무시할 수 있습니다.",
    },
    {
      id: "q3",
      question: "useEffect의 cleanup 함수가 호출되는 시점은?",
      choices: [
        "컴포넌트가 처음 마운트될 때만",
        "의존성이 변경되기 전과 컴포넌트 언마운트 시",
        "에러가 발생했을 때만",
        "useEffect 내부 코드 실행 직후",
      ],
      correctIndex: 1,
      explanation:
        "cleanup 함수는 다음 effect 실행 전(의존성 변경 시)과 컴포넌트 언마운트 시 호출됩니다.",
    },
    {
      id: "q4",
      question: "discriminated union으로 상태를 정의하는 이유는?",
      choices: [
        "코드 양을 줄이기 위해",
        "isLoading이면서 error가 있는 것 같은 불가능한 상태 조합을 방지하기 위해",
        "서버와의 통신을 최적화하기 위해",
        "React의 성능을 향상시키기 위해",
      ],
      correctIndex: 1,
      explanation:
        "discriminated union은 status 필드로 상태를 구분하여, TypeScript가 각 상태에서 올바른 필드만 접근할 수 있도록 보장합니다.",
    },
    {
      id: "q5",
      question: "커스텀 useFetch Hook 대신 React Query를 사용해야 하는 이유가 아닌 것은?",
      choices: [
        "자동 캐싱과 중복 요청 제거",
        "백그라운드 재검증",
        "무조건 더 빠른 네트워크 속도",
        "쿼리 무효화와 낙관적 업데이트",
      ],
      correctIndex: 2,
      explanation:
        "React Query는 네트워크 속도 자체를 향상시키지 않습니다. 캐싱, 재검증, 중복 요청 제거 등으로 사용자 경험을 개선합니다.",
    },
  ],
};

export default chapter;
