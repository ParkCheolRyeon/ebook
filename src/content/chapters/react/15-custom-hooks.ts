import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "15-custom-hooks",
  subject: "react",
  title: "커스텀 Hook: 로직 추출과 재사용",
  description: "커스텀 Hook으로 컴포넌트 로직을 추출하고, useToggle, useDebounce, useLocalStorage, useFetch 등 실전 패턴을 배웁니다.",
  order: 15,
  group: "Hooks 심화",
  prerequisites: ["14-use-hook"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "커스텀 Hook은 **요리 도구 세트**와 같습니다.\n\n" +
        "매번 요리할 때마다 칼을 갈고, 도마를 닦고, 볼을 준비하는 것은 번거롭습니다. 자주 하는 준비 과정을 '기본 세팅 키트'로 묶어두면, 어떤 요리에서든 꺼내 쓸 수 있습니다.\n\n" +
        "커스텀 Hook도 마찬가지입니다. useState, useEffect 등 기본 Hook들을 조합한 **재사용 가능한 로직 패키지**입니다.\n\n" +
        "중요한 점: 같은 도구 세트를 두 요리사가 각각 사용하면, 각자의 재료(상태)는 독립적입니다. 커스텀 Hook을 여러 컴포넌트에서 사용해도 상태가 공유되지 않습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "컴포넌트를 개발하다 보면 동일한 로직 패턴이 반복됩니다:\n\n" +
        "1. **토글 로직** — 여러 컴포넌트에서 on/off 상태 관리\n" +
        "2. **디바운스 로직** — 검색, 자동완성 등에서 입력 지연 처리\n" +
        "3. **로컬 스토리지 동기화** — 상태를 로컬 스토리지와 동기화\n" +
        "4. **데이터 페칭** — 로딩/에러/데이터 상태 관리\n\n" +
        "이런 로직을 컴포넌트마다 복사-붙여넣기하면:\n" +
        "- 코드 중복으로 **유지보수 어려움**\n" +
        "- 버그 수정 시 **모든 복사본을 찾아서 수정**\n" +
        "- 컴포넌트가 비즈니스 로직과 UI 로직으로 **비대해짐**\n\n" +
        "일반 함수로 추출하면? Hook(useState, useEffect)을 사용할 수 없어 한계가 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 커스텀 Hook 규칙\n" +
        "1. **use 접두사** — 함수 이름이 반드시 `use`로 시작 (예: `useToggle`, `useFetch`)\n" +
        "2. **Hook 규칙 준수** — 내부에서 다른 Hook을 호출할 수 있음\n" +
        "3. **상태 독립** — 같은 Hook을 여러 곳에서 호출해도 각각 독립된 상태\n\n" +
        "### 설계 원칙\n" +
        "- **단일 책임** — 한 Hook은 하나의 관심사만\n" +
        "- **합성 가능** — 작은 Hook을 조합하여 큰 Hook을 만듦\n" +
        "- **반환값 설계** — 값이 하나면 직접 반환, 여러 개면 객체 또는 튜플\n" +
        "- **TypeScript 제네릭** — 다양한 타입에 재사용 가능하게\n\n" +
        "### Hook 합성\n" +
        "커스텀 Hook 안에서 다른 커스텀 Hook을 호출할 수 있습니다. 이를 통해 복잡한 로직을 계층적으로 구성합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 실전 커스텀 Hook 패턴",
      content:
        "자주 사용되는 커스텀 Hook들의 구현을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          'import { useState, useEffect, useCallback, useRef } from "react";\n' +
          '\n' +
          '// 1. useToggle — 토글 상태 관리\n' +
          'function useToggle(initialValue = false): [boolean, () => void] {\n' +
          '  const [value, setValue] = useState(initialValue);\n' +
          '  const toggle = useCallback(() => setValue(v => !v), []);\n' +
          '  return [value, toggle];\n' +
          '}\n' +
          '\n' +
          '// 2. useDebounce — 값 디바운싱\n' +
          'function useDebounce<T>(value: T, delay: number): T {\n' +
          '  const [debouncedValue, setDebouncedValue] = useState(value);\n' +
          '\n' +
          '  useEffect(() => {\n' +
          '    const timer = setTimeout(() => setDebouncedValue(value), delay);\n' +
          '    return () => clearTimeout(timer);\n' +
          '  }, [value, delay]);\n' +
          '\n' +
          '  return debouncedValue;\n' +
          '}\n' +
          '\n' +
          '// 3. useLocalStorage — 로컬 스토리지 동기화\n' +
          'function useLocalStorage<T>(\n' +
          '  key: string,\n' +
          '  initialValue: T\n' +
          '): [T, (value: T | ((prev: T) => T)) => void] {\n' +
          '  const [storedValue, setStoredValue] = useState<T>(() => {\n' +
          '    try {\n' +
          '      const item = window.localStorage.getItem(key);\n' +
          '      return item ? JSON.parse(item) : initialValue;\n' +
          '    } catch {\n' +
          '      return initialValue;\n' +
          '    }\n' +
          '  });\n' +
          '\n' +
          '  const setValue = useCallback(\n' +
          '    (value: T | ((prev: T) => T)) => {\n' +
          '      setStoredValue(prev => {\n' +
          '        const newValue = value instanceof Function ? value(prev) : value;\n' +
          '        window.localStorage.setItem(key, JSON.stringify(newValue));\n' +
          '        return newValue;\n' +
          '      });\n' +
          '    },\n' +
          '    [key]\n' +
          '  );\n' +
          '\n' +
          '  return [storedValue, setValue];\n' +
          '}',
        description: "커스텀 Hook은 기본 Hook들을 조합하여 재사용 가능한 로직 단위를 만듭니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: useFetch와 Hook 합성",
      content:
        "데이터 페칭 Hook과 Hook 합성 패턴을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          'import { useState, useEffect, useRef } from "react";\n' +
          '\n' +
          '// useFetch — 데이터 페칭 Hook\n' +
          'interface FetchResult<T> {\n' +
          '  data: T | null;\n' +
          '  error: string | null;\n' +
          '  isLoading: boolean;\n' +
          '}\n' +
          '\n' +
          'function useFetch<T>(url: string): FetchResult<T> {\n' +
          '  const [data, setData] = useState<T | null>(null);\n' +
          '  const [error, setError] = useState<string | null>(null);\n' +
          '  const [isLoading, setIsLoading] = useState(true);\n' +
          '\n' +
          '  useEffect(() => {\n' +
          '    let cancelled = false;\n' +
          '    setIsLoading(true);\n' +
          '    setError(null);\n' +
          '\n' +
          '    fetch(url)\n' +
          '      .then(res => res.json())\n' +
          '      .then((json: T) => {\n' +
          '        if (!cancelled) {\n' +
          '          setData(json);\n' +
          '          setIsLoading(false);\n' +
          '        }\n' +
          '      })\n' +
          '      .catch(err => {\n' +
          '        if (!cancelled) {\n' +
          '          setError(String(err));\n' +
          '          setIsLoading(false);\n' +
          '        }\n' +
          '      });\n' +
          '\n' +
          '    return () => { cancelled = true; };\n' +
          '  }, [url]);\n' +
          '\n' +
          '  return { data, error, isLoading };\n' +
          '}\n' +
          '\n' +
          '// Hook 합성 — useDebounce + useFetch\n' +
          'function useSearchUsers(query: string) {\n' +
          '  const debouncedQuery = useDebounce(query, 300);\n' +
          '  const url = debouncedQuery\n' +
          '    ? `/api/users?q=${encodeURIComponent(debouncedQuery)}`\n' +
          '    : "";\n' +
          '  const result = useFetch<{ id: number; name: string }[]>(\n' +
          '    url || "/api/users"\n' +
          '  );\n' +
          '  return { ...result, debouncedQuery };\n' +
          '}\n' +
          '\n' +
          '// 사용 예시\n' +
          'function UserSearch() {\n' +
          '  const [query, setQuery] = useState("");\n' +
          '  const { data, isLoading } = useSearchUsers(query);\n' +
          '\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <input\n' +
          '        value={query}\n' +
          '        onChange={e => setQuery(e.target.value)}\n' +
          '        placeholder="사용자 검색..."\n' +
          '      />\n' +
          '      {isLoading ? <p>검색 중...</p> : (\n' +
          '        <ul>{data?.map(u => <li key={u.id}>{u.name}</li>)}</ul>\n' +
          '      )}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// useDebounce 참조 (이전 의사코드 섹션)\n' +
          'function useDebounce<T>(value: T, delay: number): T {\n' +
          '  const [debouncedValue, setDebouncedValue] = useState(value);\n' +
          '  useEffect(() => {\n' +
          '    const timer = setTimeout(() => setDebouncedValue(value), delay);\n' +
          '    return () => clearTimeout(timer);\n' +
          '  }, [value, delay]);\n' +
          '  return debouncedValue;\n' +
          '}',
        description: "작은 커스텀 Hook들을 합성하여 복잡한 기능(디바운스된 검색)을 구현합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "**커스텀 Hook 설계 원칙:**\n\n" +
        "| 원칙 | 설명 |\n" +
        "|------|------|\n" +
        "| use 접두사 | 반드시 `use`로 시작 |\n" +
        "| 단일 책임 | 한 Hook은 하나의 관심사 |\n" +
        "| 상태 독립 | 호출하는 곳마다 독립된 상태 |\n" +
        "| 합성 가능 | 작은 Hook을 조합하여 큰 Hook |\n" +
        "| 타입 안전 | TypeScript 제네릭 활용 |\n\n" +
        "**자주 사용하는 패턴:**\n" +
        "- `useToggle` — on/off 상태\n" +
        "- `useDebounce` — 입력 디바운싱\n" +
        "- `useLocalStorage` — 로컬 스토리지 동기화\n" +
        "- `useFetch` — 데이터 페칭\n" +
        "- `usePrevious` — 이전 값 추적\n\n" +
        "**다음 챕터 미리보기:** useLayoutEffect로 paint 전에 DOM을 측정하고 깜빡임을 방지하는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "커스텀 Hook은 상태 로직을 함수로 추출하여 재사용하는 패턴이다. use로 시작하는 이름을 짓고, 내부에서 다른 Hook을 자유롭게 조합할 수 있다.",
  checklist: [
    "커스텀 Hook의 use 접두사 규칙을 설명할 수 있다",
    "커스텀 Hook을 사용하는 각 컴포넌트의 상태가 독립적임을 이해한다",
    "useDebounce, useLocalStorage 등 실전 Hook을 구현할 수 있다",
    "Hook 합성으로 복잡한 로직을 구성할 수 있다",
    "커스텀 Hook의 반환값을 적절하게 설계할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "커스텀 Hook의 이름 규칙은?",
      choices: [
        "아무 이름이나 가능",
        "반드시 use로 시작해야 한다",
        "반드시 Hook으로 끝나야 한다",
        "반드시 대문자로 시작해야 한다",
      ],
      correctIndex: 1,
      explanation: "커스텀 Hook은 반드시 use로 시작해야 합니다. 이 규칙으로 React가 Hook 규칙 위반을 감지하고, 린터가 올바른 경고를 보여줍니다.",
    },
    {
      id: "q2",
      question: "같은 커스텀 Hook을 두 컴포넌트에서 사용하면 상태는?",
      choices: [
        "상태가 공유된다",
        "각각 독립된 상태를 가진다",
        "첫 번째 컴포넌트의 상태만 유지된다",
        "에러가 발생한다",
      ],
      correctIndex: 1,
      explanation: "커스텀 Hook은 로직을 재사용하는 것이지 상태를 공유하는 것이 아닙니다. 각 호출마다 독립된 state와 effect를 가집니다.",
    },
    {
      id: "q3",
      question: "커스텀 Hook 내부에서 할 수 있는 것은?",
      choices: [
        "DOM을 직접 조작하기",
        "다른 Hook(useState, useEffect, 커스텀 Hook)을 호출하기",
        "클래스 컴포넌트의 메서드를 호출하기",
        "전역 변수를 선언하기",
      ],
      correctIndex: 1,
      explanation: "커스텀 Hook은 일반 함수이지만 내부에서 다른 Hook을 호출할 수 있습니다. 이것이 일반 유틸 함수와의 핵심 차이입니다.",
    },
    {
      id: "q4",
      question: "useDebounce의 주요 활용 사례는?",
      choices: [
        "버튼 클릭 방지",
        "검색 입력 시 API 호출 지연",
        "애니메이션 제어",
        "메모리 관리",
      ],
      correctIndex: 1,
      explanation: "useDebounce는 값이 변경된 후 일정 시간이 지날 때까지 기다렸다가 최종 값을 반환합니다. 검색 입력 시 타이핑이 끝난 후 API를 호출하는 데 자주 사용됩니다.",
    },
    {
      id: "q5",
      question: "Hook 합성(composition)이란?",
      choices: [
        "여러 컴포넌트에서 같은 Hook을 사용하는 것",
        "커스텀 Hook 안에서 다른 커스텀 Hook을 호출하여 조합하는 것",
        "Hook의 반환값을 합치는 것",
        "Hook을 순서대로 나열하는 것",
      ],
      correctIndex: 1,
      explanation: "Hook 합성은 작은 커스텀 Hook들을 다른 커스텀 Hook 안에서 호출하여 더 복잡한 로직을 구성하는 패턴입니다.",
    },
    {
      id: "q6",
      question: "커스텀 Hook의 반환값 설계 시 권장 사항은?",
      choices: [
        "항상 배열로 반환",
        "항상 객체로 반환",
        "값이 하나면 직접, 여러 개면 객체 또는 튜플",
        "항상 문자열로 반환",
      ],
      correctIndex: 2,
      explanation: "값이 하나면 직접 반환하고, 여러 개이면 순서가 중요한 경우 튜플(useState처럼), 그렇지 않으면 객체로 반환합니다.",
    },
  ],
};

export default chapter;
