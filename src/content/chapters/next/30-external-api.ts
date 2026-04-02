import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "30-external-api",
  subject: "next",
  title: "외부 API 통합",
  description:
    "Server Component에서의 외부 API 호출, API 키 보안, 에러 핸들링, Rate Limiting 대응, BFF(Backend for Frontend) 패턴, Route Handler 프록시 활용을 학습합니다.",
  order: 30,
  group: "API와 백엔드",
  prerequisites: ["29-database-integration"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "외부 API 통합은 **무역 회사의 수입 대행**과 같습니다.\n\n" +
        "해외에서 물건(데이터)을 직접 수입하려면 **통관 절차**(인증), **수입 허가증**(API 키), " +
        "**관세 처리**(응답 가공)가 필요합니다. 일반 소비자(클라이언트)가 이 모든 것을 직접 처리하면 " +
        "복잡하고 위험합니다 — 특히 수입 허가증(API 키)을 소비자에게 공개하면 악용될 수 있습니다.\n\n" +
        "**BFF(Backend for Frontend) 패턴**은 **수입 대행 회사**입니다. " +
        "소비자는 대행 회사(Route Handler)에 '이 물건 가져다주세요'라고 요청하면, " +
        "대행 회사가 허가증(API 키)을 사용하여 해외(외부 API)에서 물건을 가져오고, " +
        "통관(에러 처리, 데이터 가공)을 거쳐 소비자에게 전달합니다.\n\n" +
        "**Server Component**는 **자체 구매부서**와 같습니다. 회사 내부(서버)에서 " +
        "직접 해외에 발주하므로 허가증이 외부에 노출되지 않습니다. " +
        "완성된 제품(HTML)만 손님에게 전달합니다.\n\n" +
        "**캐싱과 재검증**은 **창고 재고 관리**입니다. 매번 해외에 발주하면 비용과 시간이 많이 들므로, " +
        "자주 찾는 물건은 창고에 보관하고 일정 주기로 새로 입고합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "외부 API를 연동할 때 발생하는 **보안, 안정성, 성능 문제**들입니다.\n\n" +
        "### 1. API 키 노출 위험\n" +
        "클라이언트에서 직접 외부 API를 호출하면 API 키가 브라우저의 Network 탭에 노출됩니다. " +
        "유료 API의 키가 유출되면 막대한 비용이 청구될 수 있습니다.\n\n" +
        "### 2. Rate Limiting\n" +
        "대부분의 외부 API는 분당/시간당 호출 횟수를 제한합니다. " +
        "캐싱 없이 매 요청마다 API를 호출하면 금방 한도에 도달합니다.\n\n" +
        "### 3. 외부 API 장애 전파\n" +
        "외부 API가 느려지거나 다운되면 내 앱 전체가 영향을 받습니다. " +
        "적절한 에러 핸들링과 fallback이 없으면 사용자에게 빈 화면이나 에러가 표시됩니다.\n\n" +
        "### 4. 응답 데이터 가공\n" +
        "외부 API의 응답 형식이 프론트엔드에 적합하지 않은 경우가 많습니다. " +
        "불필요한 필드를 제거하고, 여러 API 응답을 합치는 가공이 필요합니다.\n\n" +
        "### 5. CORS 제한\n" +
        "많은 외부 API는 브라우저에서의 직접 호출을 CORS로 차단합니다. " +
        "서버를 프록시로 사용해야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Next.js의 서버 환경을 활용하여 **안전하고 효율적인 외부 API 통합**을 구현합니다.\n\n" +
        "### 1. Server Component에서 직접 호출\n" +
        "서버에서 fetch하면 API 키가 클라이언트에 절대 노출되지 않습니다. " +
        "환경 변수의 API 키를 안전하게 사용할 수 있습니다.\n\n" +
        "### 2. Route Handler를 BFF 프록시로 활용\n" +
        "클라이언트 컴포넌트가 외부 API에 접근해야 하면, Route Handler를 중간 프록시로 사용합니다. " +
        "API 키는 서버에 보관하고, 클라이언트는 `/api/weather` 같은 내부 엔드포인트만 호출합니다.\n\n" +
        "### 3. 캐싱과 재검증\n" +
        "Next.js의 fetch 캐싱으로 동일한 API 호출을 캐싱하고, " +
        "`revalidate` 옵션으로 적절한 주기로 갱신합니다. Rate limit을 절약합니다.\n\n" +
        "### 4. 에러 핸들링 패턴\n" +
        "try-catch로 API 에러를 잡고, fallback UI나 캐시된 데이터를 표시합니다. " +
        "에러 경계(error.tsx)와 함께 사용하면 부분적 장애에도 앱이 작동합니다.\n\n" +
        "### 5. SDK 래핑 패턴\n" +
        "외부 서비스의 SDK를 server-only 모듈로 래핑하여 " +
        "타입 안전하고 재사용 가능한 서비스 계층을 만듭니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Server Component에서 안전한 API 호출",
      content:
        "Server Component에서 외부 API를 호출하여 API 키를 보호하고, " +
        "캐싱과 에러 핸들링을 적용하는 패턴을 구현합니다.",
      code: {
        language: "typescript",
        code:
          '// === lib/weather-service.ts (SDK 래핑 패턴) ===\n' +
          'import "server-only";\n\n' +
          'interface WeatherData {\n' +
          '  city: string;\n' +
          '  temperature: number;\n' +
          '  description: string;\n' +
          '  humidity: number;\n' +
          '}\n\n' +
          'export async function getWeather(city: string): Promise<WeatherData> {\n' +
          '  // API 키는 서버에서만 접근 — 클라이언트에 노출되지 않음\n' +
          '  const API_KEY = process.env.WEATHER_API_KEY;\n' +
          '  if (!API_KEY) throw new Error("WEATHER_API_KEY가 설정되지 않았습니다");\n\n' +
          '  const res = await fetch(\n' +
          '    `https://api.weather.com/v1/current?city=${city}&key=${API_KEY}`,\n' +
          '    {\n' +
          '      // 5분마다 재검증 — Rate Limit 절약\n' +
          '      next: { revalidate: 300 },\n' +
          '    }\n' +
          '  );\n\n' +
          '  if (!res.ok) {\n' +
          '    throw new Error(`Weather API 에러: ${res.status}`);\n' +
          '  }\n\n' +
          '  const data = await res.json();\n\n' +
          '  // 외부 API 응답을 앱에 맞게 가공\n' +
          '  return {\n' +
          '    city: data.location.name,\n' +
          '    temperature: data.current.temp_c,\n' +
          '    description: data.current.condition.text,\n' +
          '    humidity: data.current.humidity,\n' +
          '  };\n' +
          '}\n\n' +
          '// === app/weather/[city]/page.tsx (Server Component) ===\n' +
          'import { getWeather } from "@/lib/weather-service";\n' +
          'import { Suspense } from "react";\n\n' +
          'interface PageProps {\n' +
          '  params: Promise<{ city: string }>;\n' +
          '}\n\n' +
          'export default async function WeatherPage({ params }: PageProps) {\n' +
          '  const { city } = await params;\n\n' +
          '  return (\n' +
          '    <div>\n' +
          '      <h1>{city} 날씨</h1>\n' +
          '      <Suspense fallback={<div>날씨 정보 로딩중...</div>}>\n' +
          '        <WeatherInfo city={city} />\n' +
          '      </Suspense>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          'async function WeatherInfo({ city }: { city: string }) {\n' +
          '  try {\n' +
          '    const weather = await getWeather(city);\n' +
          '    return (\n' +
          '      <div>\n' +
          '        <p>온도: {weather.temperature}°C</p>\n' +
          '        <p>상태: {weather.description}</p>\n' +
          '        <p>습도: {weather.humidity}%</p>\n' +
          '      </div>\n' +
          '    );\n' +
          '  } catch (error) {\n' +
          '    return <p>날씨 정보를 가져올 수 없습니다.</p>;\n' +
          '  }\n' +
          '}',
        description:
          "server-only로 API 키를 보호하고, next: { revalidate }로 캐싱하며, try-catch로 에러 시 fallback을 표시합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: BFF 프록시 패턴과 에러 핸들링",
      content:
        "클라이언트 컴포넌트가 외부 API에 접근해야 할 때 " +
        "Route Handler를 BFF 프록시로 활용하는 패턴을 구현합니다. " +
        "Rate limiting 대응과 에러 핸들링도 함께 다룹니다.",
      code: {
        language: "typescript",
        code:
          '// === app/api/github/repos/route.ts (BFF 프록시) ===\n' +
          'import { NextRequest, NextResponse } from "next/server";\n\n' +
          '// Rate limit 상태 추적 (간단한 인메모리)\n' +
          'let requestCount = 0;\n' +
          'let resetTime = Date.now() + 60000;\n\n' +
          'export async function GET(request: NextRequest) {\n' +
          '  const username = request.nextUrl.searchParams.get("username");\n\n' +
          '  if (!username) {\n' +
          '    return NextResponse.json(\n' +
          '      { error: "username 파라미터가 필요합니다" },\n' +
          '      { status: 400 }\n' +
          '    );\n' +
          '  }\n\n' +
          '  try {\n' +
          '    // API 키는 서버에만 존재 — 클라이언트에 노출 안됨\n' +
          '    const res = await fetch(\n' +
          '      `https://api.github.com/users/${username}/repos`,\n' +
          '      {\n' +
          '        headers: {\n' +
          '          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,\n' +
          '          Accept: "application/vnd.github.v3+json",\n' +
          '        },\n' +
          '        next: { revalidate: 600 }, // 10분 캐시\n' +
          '      }\n' +
          '    );\n\n' +
          '    if (res.status === 429) {\n' +
          '      // Rate limit 초과\n' +
          '      const retryAfter = res.headers.get("Retry-After");\n' +
          '      return NextResponse.json(\n' +
          '        { error: "요청 한도 초과", retryAfter },\n' +
          '        { status: 429 }\n' +
          '      );\n' +
          '    }\n\n' +
          '    if (!res.ok) {\n' +
          '      return NextResponse.json(\n' +
          '        { error: `GitHub API 에러: ${res.status}` },\n' +
          '        { status: res.status }\n' +
          '      );\n' +
          '    }\n\n' +
          '    const repos = await res.json();\n\n' +
          '    // 필요한 필드만 추출하여 응답 크기 절약\n' +
          '    const simplified = repos.map((repo: any) => ({\n' +
          '      name: repo.name,\n' +
          '      description: repo.description,\n' +
          '      stars: repo.stargazers_count,\n' +
          '      language: repo.language,\n' +
          '      url: repo.html_url,\n' +
          '    }));\n\n' +
          '    return NextResponse.json(simplified);\n' +
          '  } catch (error) {\n' +
          '    return NextResponse.json(\n' +
          '      { error: "서버 에러가 발생했습니다" },\n' +
          '      { status: 500 }\n' +
          '    );\n' +
          '  }\n' +
          '}\n\n' +
          '// === components/RepoList.tsx (클라이언트 컴포넌트) ===\n' +
          '"use client";\n' +
          'import { useState } from "react";\n\n' +
          'export default function RepoList() {\n' +
          '  const [repos, setRepos] = useState<any[]>([]);\n' +
          '  const [error, setError] = useState("");\n\n' +
          '  async function searchRepos(username: string) {\n' +
          '    // 내부 API만 호출 — API 키 노출 없음!\n' +
          '    const res = await fetch(\n' +
          '      `/api/github/repos?username=${username}`\n' +
          '    );\n' +
          '    if (!res.ok) {\n' +
          '      const data = await res.json();\n' +
          '      setError(data.error);\n' +
          '      return;\n' +
          '    }\n' +
          '    setRepos(await res.json());\n' +
          '  }\n\n' +
          '  return (\n' +
          '    <div>\n' +
          '      {error && <p className="text-red-500">{error}</p>}\n' +
          '      <ul>\n' +
          '        {repos.map((repo) => (\n' +
          '          <li key={repo.name}>\n' +
          '            {repo.name} ⭐ {repo.stars}\n' +
          '          </li>\n' +
          '        ))}\n' +
          '      </ul>\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "Route Handler가 GitHub API의 프록시 역할을 합니다. API 키는 서버에만 있고, 클라이언트는 /api/github/repos만 호출합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 개념 | 설명 |\n" +
        "|------|------|\n" +
        "| Server Component fetch | 서버에서 API 키를 안전하게 사용 |\n" +
        "| BFF 패턴 | Route Handler를 프록시로 활용 |\n" +
        "| API 키 보안 | 환경 변수 + server-only로 보호 |\n" +
        "| 캐싱/재검증 | next: { revalidate }로 Rate Limit 절약 |\n" +
        "| 에러 핸들링 | try-catch + fallback UI |\n" +
        "| Rate Limiting | 429 상태코드 감지 + Retry-After 대응 |\n" +
        "| SDK 래핑 | server-only 모듈로 서비스 계층 추상화 |\n\n" +
        "**핵심:** 외부 API 호출은 Server Component나 Route Handler에서 하여 API 키를 보호합니다. " +
        "Route Handler를 BFF 프록시로 활용하면 클라이언트에 민감한 정보를 노출하지 않을 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** 테스팅을 다룹니다. " +
        "Next.js 앱의 유닛 테스트, 통합 테스트, E2E 테스트 전략을 학습합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "외부 API 호출은 Server Component나 Route Handler에서 하여 API 키를 보호한다. Route Handler를 BFF(Backend for Frontend) 프록시로 활용하면 클라이언트에 민감한 정보를 노출하지 않을 수 있다.",
  checklist: [
    "Server Component에서 외부 API를 호출하여 API 키를 보호할 수 있다",
    "Route Handler를 BFF 프록시로 구현하여 클라이언트의 외부 API 접근을 중계할 수 있다",
    "fetch의 next: { revalidate } 옵션으로 API 응답을 캐싱할 수 있다",
    "Rate Limiting(429) 에러를 감지하고 적절히 대응할 수 있다",
    "server-only로 SDK를 래핑하여 타입 안전한 서비스 계층을 만들 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "외부 API 키를 안전하게 보호하는 방법으로 올바른 것은?",
      choices: [
        "NEXT_PUBLIC_ 접두어로 환경 변수에 저장한다",
        "클라이언트 컴포넌트에서 직접 API를 호출한다",
        "Server Component나 Route Handler에서만 API를 호출한다",
        "API 키를 소스 코드에 하드코딩한다",
      ],
      correctIndex: 2,
      explanation:
        "Server Component와 Route Handler는 서버에서 실행되므로 환경 변수의 API 키가 클라이언트에 노출되지 않습니다. NEXT_PUBLIC_을 사용하면 클라이언트에 노출됩니다.",
    },
    {
      id: "q2",
      question: "BFF(Backend for Frontend) 패턴의 핵심 목적은?",
      choices: [
        "프론트엔드 성능 최적화",
        "서버에서 외부 API를 중계하여 클라이언트에 민감한 정보를 숨기기",
        "데이터베이스 쿼리 최적화",
        "SSR 렌더링 속도 향상",
      ],
      correctIndex: 1,
      explanation:
        "BFF 패턴은 서버(Route Handler)가 외부 API와의 통신을 중계합니다. API 키, 인증 토큰 등 민감한 정보가 클라이언트에 노출되지 않고, 응답 데이터를 가공할 수도 있습니다.",
    },
    {
      id: "q3",
      question: "외부 API의 Rate Limiting에 대응하는 Next.js 전략은?",
      choices: [
        "API 호출을 모두 클라이언트로 분산한다",
        "fetch의 next: { revalidate } 옵션으로 캐싱하여 호출 횟수를 줄인다",
        "Rate limit이 없는 API만 사용한다",
        "매 요청마다 새로운 API 키를 생성한다",
      ],
      correctIndex: 1,
      explanation:
        "fetch의 next: { revalidate } 옵션으로 응답을 캐싱하면 동일한 요청을 반복하지 않아 API 호출 횟수를 줄일 수 있습니다. Rate limit 절약에 효과적입니다.",
    },
    {
      id: "q4",
      question: "외부 API 응답을 가공하여 클라이언트에 전달하는 이유는?",
      choices: [
        "API 응답 속도를 높이기 위해",
        "불필요한 필드를 제거하여 응답 크기를 줄이고, 내부 데이터 구조를 숨기기 위해",
        "TypeScript 타입 생성을 위해",
        "캐싱을 비활성화하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "외부 API 응답에는 앱에 불필요한 필드가 많을 수 있습니다. 서버에서 필요한 필드만 추출하면 응답 크기가 줄고, 외부 API의 내부 구조가 클라이언트에 노출되지 않습니다.",
    },
    {
      id: "q5",
      question: "server-only 모듈로 SDK를 래핑하는 이유는?",
      choices: [
        "SDK 번들 크기를 줄이기 위해",
        "클라이언트에서도 SDK를 사용하기 위해",
        "SDK와 API 키가 클라이언트 번들에 포함되지 않도록 보장하기 위해",
        "SDK의 타입 정의를 생성하기 위해",
      ],
      correctIndex: 2,
      explanation:
        "server-only 모듈에서 SDK를 래핑하면, 해당 모듈을 클라이언트 컴포넌트에서 import할 때 빌드 에러가 발생합니다. API 키를 사용하는 서버 전용 코드가 실수로 클라이언트에 번들되는 것을 방지합니다.",
    },
  ],
};

export default chapter;
