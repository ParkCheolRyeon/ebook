import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "17-intercepting-routes",
  subject: "next",
  title: "Intercepting Routes",
  description:
    "(.), (..), (..)(..), (...) 가로채기 규칙, 모달 패턴 구현, Parallel Routes와 조합, 인스타그램 스타일 이미지 모달 실무 예제를 학습합니다.",
  order: 17,
  group: "라우팅 심화",
  prerequisites: ["16-route-groups-parallel"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Intercepting Routes는 **우편함 가로채기**와 비슷합니다.\n\n" +
        "일반적으로 편지(URL 요청)는 목적지(해당 라우트 페이지)로 직접 배달됩니다. 하지만 Intercepting Routes를 설정하면, 특정 조건에서 편지를 중간에 가로채서 현재 위치(현재 레이아웃)에서 먼저 열어볼 수 있습니다.\n\n" +
        "**인스타그램 예시**를 생각해보세요. 피드에서 사진을 클릭하면 모달로 열리면서 URL이 `/photo/123`으로 바뀝니다. 하지만 피드는 뒤에 그대로 있습니다. 이것이 '가로채기'입니다. 반면 `/photo/123`을 브라우저에 직접 입력하면 전체 페이지로 사진이 열립니다.\n\n" +
        "**가로채기 레벨**은 우체국 관할 구역과 같습니다:\n" +
        "- **(.)** — 같은 동네(같은 레벨)에서 가로채기\n" +
        "- **(..)** — 옆 동네(한 단계 위)에서 가로채기\n" +
        "- **(..)(..)**  — 두 동네 건너(두 단계 위)에서 가로채기\n" +
        "- **(...)** — 시청(루트)에서 가로채기\n\n" +
        "중요한 점은, 직접 주소를 찾아가면(URL 직접 입력, 새로고침) 가로채기가 작동하지 않고 원래 목적지(전체 페이지)로 간다는 것입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "모달이나 오버레이 패턴을 구현할 때 URL과 UI의 관계가 까다롭습니다.\n\n" +
        "1. **모달과 URL 불일치** — 전통적 모달은 상태로 열고 닫지만, URL이 변경되지 않아 공유할 수 없고 브라우저 뒤로가기가 모달을 닫지 못합니다.\n\n" +
        "2. **컨텍스트 유지** — 피드에서 사진을 클릭하면 사진 상세를 모달로 보면서도, 뒤의 피드 스크롤 위치와 상태를 유지하고 싶습니다.\n\n" +
        "3. **직접 접근 시 전체 페이지** — 모달로 열리는 콘텐츠(`/photo/123`)를 직접 URL로 접근하면 전체 페이지로 보여줘야 합니다. 모달과 전체 페이지 두 가지 표현이 필요합니다.\n\n" +
        "4. **뒤로가기 동작** — 모달이 열린 상태에서 뒤로가기를 누르면 모달만 닫히고 이전 페이지로 돌아가야 합니다. 이 동작을 직접 구현하는 것은 복잡합니다.\n\n" +
        "5. **서버 사이드 렌더링** — 클라이언트 전용 모달은 SSR에서 깜빡임이 생기거나, SEO에 불리할 수 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Intercepting Routes와 Parallel Routes를 조합하면 URL 기반의 모달 패턴을 구현할 수 있습니다.\n\n" +
        "### 1. Intercepting Routes 규칙\n" +
        "폴더 이름 앞에 `(.)`, `(..)`, `(..)(..)`, `(...)`를 붙여 다른 라우트를 가로챕니다. 소프트 네비게이션(Link 클릭 등)에서만 작동하고, 하드 네비게이션(URL 직접 입력, 새로고침)에서는 원래 라우트가 렌더링됩니다.\n\n" +
        "### 2. 가로채기 레벨\n" +
        "- **(.)** — 같은 레벨의 세그먼트를 가로챔\n" +
        "- **(..)** — 한 단계 위 세그먼트를 가로챔\n" +
        "- **(..)(..)**  — 두 단계 위 세그먼트를 가로챔\n" +
        "- **(...)** — 루트(app)에서부터 가로챔\n\n" +
        "### 3. Parallel Routes와 조합\n" +
        "@modal 슬롯 안에 Intercepting Route를 배치하면, 가로챈 콘텐츠를 모달로 표시할 수 있습니다. 원래 페이지(children)는 그대로 유지됩니다.\n\n" +
        "### 4. URL 기반 모달의 이점\n" +
        "- URL이 변경되어 공유와 북마크 가능\n" +
        "- 뒤로가기가 자연스럽게 모달을 닫음\n" +
        "- 직접 URL 접근 시 전체 페이지로 표시\n" +
        "- 서버에서 렌더링 가능",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Intercepting Routes 구조",
      content:
        "Intercepting Routes의 폴더 구조와 가로채기 레벨별 동작을 살펴봅니다. 소프트 네비게이션과 하드 네비게이션에서의 차이를 이해합니다.",
      code: {
        language: "typescript",
        code:
          '// === Intercepting Routes 폴더 구조 ===\n\n' +
          '// (.) 같은 레벨 가로채기\n' +
          '// app/feed/\n' +
          '//   page.tsx           ← /feed\n' +
          '//   (.)photo/[id]/\n' +
          '//     page.tsx         ← /feed에서 /photo/[id]로 이동 시 가로채기\n' +
          '// app/photo/[id]/\n' +
          '//   page.tsx           ← /photo/[id] 직접 접근 시 (전체 페이지)\n\n' +
          '// (..) 한 단계 위 가로채기\n' +
          '// app/shop/\n' +
          '//   items/\n' +
          '//     page.tsx         ← /shop/items\n' +
          '//     (..)cart/\n' +
          '//       page.tsx       ← /shop/items에서 /shop/cart로 이동 시 가로채기\n' +
          '//   cart/\n' +
          '//     page.tsx         ← /shop/cart 직접 접근 시\n\n' +
          '// (...) 루트에서 가로채기\n' +
          '// app/\n' +
          '//   gallery/\n' +
          '//     page.tsx\n' +
          '//     (...)photo/[id]/\n' +
          '//       page.tsx       ← /gallery에서 /photo/[id]로 이동 시 가로채기\n' +
          '//   photo/[id]/\n' +
          '//     page.tsx         ← /photo/[id] 직접 접근 시\n\n' +
          '// === 소프트 vs 하드 네비게이션 ===\n\n' +
          '// 소프트 네비게이션 (Link 클릭)\n' +
          '// → Intercepting Route가 렌더링됨 (모달)\n' +
          'import Link from "next/link";\n\n' +
          'export default function Feed() {\n' +
          '  return (\n' +
          '    <div>\n' +
          '      {photos.map((photo) => (\n' +
          '        <Link key={photo.id} href={`/photo/${photo.id}`}>\n' +
          '          <img src={photo.thumbnail} alt={photo.alt} />\n' +
          '        </Link>\n' +
          '      ))}\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// 하드 네비게이션 (URL 직접 입력, 새로고침)\n' +
          '// → 원래 /photo/[id]/page.tsx가 전체 페이지로 렌더링됨',
        description:
          "Intercepting Routes는 소프트 네비게이션에서만 작동하며, 직접 URL 접근이나 새로고침 시에는 원래 라우트가 렌더링됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 인스타그램 스타일 이미지 모달",
      content:
        "Parallel Routes(@modal)와 Intercepting Routes를 조합하여 인스타그램 스타일의 이미지 모달을 구현합니다. 피드에서 사진 클릭 시 모달로 열리고, URL 직접 접근 시 전체 페이지로 보여집니다.",
      code: {
        language: "typescript",
        code:
          '// === 폴더 구조 ===\n' +
          '// app/\n' +
          '//   layout.tsx\n' +
          '//   @modal/\n' +
          '//     (.)photo/[id]/\n' +
          '//       page.tsx      ← 모달 버전\n' +
          '//     default.tsx     ← 모달이 없을 때 (null 반환)\n' +
          '//   feed/\n' +
          '//     page.tsx        ← 피드 페이지\n' +
          '//   photo/[id]/\n' +
          '//     page.tsx        ← 전체 페이지 버전\n\n' +
          '// app/layout.tsx\n' +
          'export default function RootLayout({\n' +
          '  children,\n' +
          '  modal,\n' +
          '}: {\n' +
          '  children: React.ReactNode;\n' +
          '  modal: React.ReactNode;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <html lang="ko">\n' +
          '      <body>\n' +
          '        {children}\n' +
          '        {modal}\n' +
          '      </body>\n' +
          '    </html>\n' +
          '  );\n' +
          '}\n\n' +
          '// app/@modal/default.tsx\n' +
          'export default function Default() {\n' +
          '  return null; // 모달이 없을 때는 아무것도 표시하지 않음\n' +
          '}\n\n' +
          '// app/@modal/(.)photo/[id]/page.tsx (모달 버전)\n' +
          '"use client";\n' +
          'import { useRouter } from "next/navigation";\n\n' +
          'export default function PhotoModal({\n' +
          '  params,\n' +
          '}: {\n' +
          '  params: Promise<{ id: string }>;\n' +
          '}) {\n' +
          '  const router = useRouter();\n\n' +
          '  return (\n' +
          '    <div\n' +
          '      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"\n' +
          '      onClick={() => router.back()}\n' +
          '    >\n' +
          '      <div\n' +
          '        className="relative max-w-3xl rounded-lg bg-white p-4"\n' +
          '        onClick={(e) => e.stopPropagation()}\n' +
          '      >\n' +
          '        <button\n' +
          '          className="absolute right-2 top-2 text-gray-500"\n' +
          '          onClick={() => router.back()}\n' +
          '        >\n' +
          '          닫기\n' +
          '        </button>\n' +
          '        <PhotoContent id={params} />\n' +
          '      </div>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n\n' +
          '// app/photo/[id]/page.tsx (전체 페이지 버전)\n' +
          'export default async function PhotoPage({\n' +
          '  params,\n' +
          '}: {\n' +
          '  params: Promise<{ id: string }>;\n' +
          '}) {\n' +
          '  const { id } = await params;\n' +
          '  const photo = await getPhoto(id);\n\n' +
          '  return (\n' +
          '    <div className="mx-auto max-w-4xl p-8">\n' +
          '      <img src={photo.url} alt={photo.alt} className="w-full rounded" />\n' +
          '      <h1 className="mt-4 text-2xl font-bold">{photo.title}</h1>\n' +
          '      <p className="mt-2 text-gray-600">{photo.description}</p>\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "@modal 슬롯에 Intercepting Route를 배치하여 Link 클릭 시 모달로, URL 직접 접근 시 전체 페이지로 사진을 표시합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 규칙 | 의미 | 예시 |\n" +
        "|------|------|------|\n" +
        "| (.) | 같은 레벨 가로채기 | 피드에서 같은 레벨의 사진 |\n" +
        "| (..) | 한 단계 위 가로채기 | 하위 폴더에서 상위 라우트 |\n" +
        "| (..)(..) | 두 단계 위 가로채기 | 깊은 중첩에서 상위 |\n" +
        "| (...) | 루트에서 가로채기 | 어디서든 루트 레벨 라우트 |\n" +
        "| @modal + (.) | 모달 패턴 | Parallel Route와 조합 |\n\n" +
        "**핵심:** Intercepting Routes는 네비게이션 시 다른 라우트의 콘텐츠를 현재 레이아웃 안에서 가로채 보여준다. Parallel Routes와 조합하면 모달 패턴을 URL 기반으로 구현할 수 있다.\n\n" +
        "**다음 챕터 미리보기:** 미들웨어를 활용하여 모든 라우트 요청 전에 인증 체크, 리다이렉트, 헤더 수정 등을 수행하는 방법을 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Intercepting Routes는 네비게이션 시 다른 라우트의 콘텐츠를 현재 레이아웃 안에서 가로채 보여준다. Parallel Routes와 조합하면 모달 패턴을 URL 기반으로 구현할 수 있다.",
  checklist: [
    "(.), (..), (..)(..), (...)의 가로채기 레벨 차이를 설명할 수 있다",
    "소프트 네비게이션과 하드 네비게이션에서의 동작 차이를 이해한다",
    "Parallel Routes와 Intercepting Routes를 조합한 모달 패턴을 구현할 수 있다",
    "default.tsx가 모달 패턴에서 필요한 이유를 설명할 수 있다",
    "URL 기반 모달의 장점(공유, 북마크, 뒤로가기)을 설명할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Intercepting Routes가 작동하는 네비게이션 유형은?",
      choices: [
        "하드 네비게이션(URL 직접 입력)에서만",
        "소프트 네비게이션(Link 클릭 등)에서만",
        "모든 네비게이션에서",
        "서버 사이드 렌더링에서만",
      ],
      correctIndex: 1,
      explanation:
        "Intercepting Routes는 소프트 네비게이션(Link 컴포넌트, router.push 등)에서만 작동합니다. URL 직접 입력이나 새로고침(하드 네비게이션)에서는 원래 라우트가 렌더링됩니다.",
    },
    {
      id: "q2",
      question: "(.) 규칙의 의미는?",
      choices: [
        "루트에서 가로채기",
        "한 단계 위에서 가로채기",
        "같은 레벨에서 가로채기",
        "두 단계 위에서 가로채기",
      ],
      correctIndex: 2,
      explanation:
        "(.)은 같은 레벨의 세그먼트를 가로챕니다. 파일 시스템의 현재 디렉토리(.)와 유사한 개념입니다.",
    },
    {
      id: "q3",
      question: "모달 패턴에서 @modal/default.tsx가 null을 반환하는 이유는?",
      choices: [
        "에러를 방지하기 위해",
        "모달이 열리지 않은 상태에서 아무것도 표시하지 않기 위해",
        "서버 컴포넌트이기 때문에",
        "SSR을 비활성화하기 위해",
      ],
      correctIndex: 1,
      explanation:
        "@modal 슬롯은 layout에서 항상 렌더링됩니다. 모달이 열리지 않은 상태(가로채기가 없는 URL)에서는 default.tsx가 null을 반환하여 아무것도 표시하지 않습니다.",
    },
    {
      id: "q4",
      question: "인스타그램 스타일 모달에서 /photo/123을 직접 입력하면?",
      choices: [
        "모달이 열린다",
        "404가 표시된다",
        "원래 photo/[id]/page.tsx가 전체 페이지로 렌더링된다",
        "피드 페이지로 리다이렉트된다",
      ],
      correctIndex: 2,
      explanation:
        "URL을 직접 입력하면 하드 네비게이션이므로 Intercepting Route가 작동하지 않습니다. 원래 경로인 photo/[id]/page.tsx가 전체 페이지로 렌더링됩니다.",
    },
    {
      id: "q5",
      question: "(...) 규칙은 어디에서부터 가로채는가?",
      choices: [
        "같은 레벨",
        "한 단계 위",
        "두 단계 위",
        "루트(app 디렉토리)",
      ],
      correctIndex: 3,
      explanation:
        "(...)은 루트(app 디렉토리)에서부터 가로챕니다. 파일 시스템의 절대 경로와 유사하게, 어느 깊이에서든 루트 레벨의 세그먼트를 가로챌 수 있습니다.",
    },
  ],
};

export default chapter;
