import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "21-image-optimization",
  subject: "next",
  title: "이미지 최적화 (next/image)",
  description:
    "next/image의 자동 최적화, WebP/AVIF 변환, lazy loading, 반응형 이미지, fill 모드, priority 속성, 외부 이미지 설정을 학습합니다.",
  order: 21,
  group: "스타일링과 최적화",
  prerequisites: ["20-styling"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "next/image는 **스마트 액자**와 같습니다.\n\n" +
        "일반 `<img>` 태그는 **단순 액자**입니다. 어떤 크기의 사진을 넣든 그대로 보여줍니다. " +
        "10MB짜리 고해상도 사진을 모바일 화면에 넣어도 원본 그대로 전송됩니다. 느리고 비효율적입니다.\n\n" +
        "next/image는 **스마트 액자**입니다. 사진을 넣으면 자동으로 최적의 크기로 잘라주고(반응형), " +
        "최신 포맷(WebP/AVIF)으로 변환하고, 액자가 화면에 보일 때만 사진을 로드(lazy loading)합니다. " +
        "마치 TV가 켜진 방에만 조명이 자동으로 켜지는 스마트홈처럼, 보이는 이미지만 로드합니다.\n\n" +
        "**priority 속성**은 **VIP 패스**입니다. 페이지의 첫 화면에 보이는 Hero 이미지처럼 " +
        "가장 먼저 보여야 하는 이미지에 VIP 패스를 발급하면, lazy loading을 건너뛰고 즉시 로드됩니다. " +
        "이는 LCP(Largest Contentful Paint) 점수를 크게 개선합니다.\n\n" +
        "**placeholder='blur'**는 **모자이크 미리보기**입니다. " +
        "사진이 아직 로드되지 않았을 때 흐릿한 미리보기를 먼저 보여주어, " +
        "사용자가 빈 화면 대신 이미지가 곧 나타날 것임을 인지할 수 있게 합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "이미지는 웹 페이지에서 **가장 무거운 리소스**입니다. 최적화하지 않으면 성능에 심각한 영향을 줍니다.\n\n" +
        "### 1. 과도한 파일 크기\n" +
        "원본 이미지를 그대로 제공하면 한 장에 수 MB입니다. 모바일 사용자가 3G 환경에서 접속하면 " +
        "이미지 하나 로드에 수 초가 걸립니다. WebP나 AVIF 포맷은 JPEG 대비 30-50% 작지만, " +
        "수동 변환은 번거롭습니다.\n\n" +
        "### 2. Layout Shift (CLS)\n" +
        "이미지의 width/height를 지정하지 않으면 이미지 로드 후 레이아웃이 밀리는 현상(CLS)이 발생합니다. " +
        "사용자가 글을 읽고 있는데 갑자기 화면이 밀려 다른 버튼을 누르게 됩니다.\n\n" +
        "### 3. 불필요한 로딩\n" +
        "페이지에 20개의 이미지가 있을 때, 사용자가 보지 않는 아래쪽 이미지까지 모두 로드하면 " +
        "대역폭과 로딩 시간이 낭비됩니다.\n\n" +
        "### 4. 반응형 이미지 부재\n" +
        "데스크톱용 2000px 이미지를 모바일(400px)에서도 동일하게 전송하면 " +
        "5배의 데이터를 불필요하게 다운로드합니다.\n\n" +
        "### 5. LCP 저하\n" +
        "Hero 이미지가 lazy loading되면 사용자가 처음 보는 화면의 핵심 이미지가 늦게 나타나 " +
        "Core Web Vitals의 LCP 지표가 나빠집니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "next/image 컴포넌트는 이 모든 문제를 **자동으로** 해결합니다.\n\n" +
        "### 1. 자동 포맷 변환\n" +
        "브라우저가 지원하는 최적의 포맷(WebP/AVIF)으로 자동 변환합니다. " +
        "개발자가 여러 포맷의 이미지를 준비할 필요가 없습니다.\n\n" +
        "### 2. CLS 방지\n" +
        "width/height를 지정하면 이미지 로드 전에 공간을 미리 확보합니다. " +
        "fill 모드에서는 부모 컨테이너의 크기에 맞춰 자동으로 공간을 잡습니다.\n\n" +
        "### 3. 자동 Lazy Loading\n" +
        "뷰포트에 가까워질 때만 이미지를 로드합니다. " +
        "기본 동작이므로 별도 설정 없이 자동 적용됩니다.\n\n" +
        "### 4. 반응형 이미지 (sizes)\n" +
        "sizes 속성으로 뷰포트별 이미지 크기를 지정하면, " +
        "브라우저가 화면 크기에 맞는 최적 해상도의 이미지를 선택합니다.\n\n" +
        "### 5. priority 속성\n" +
        "LCP에 해당하는 이미지에 `priority`를 붙이면 lazy loading을 건너뛰고 " +
        "preload 태그로 즉시 로드합니다.\n\n" +
        "### 6. 외부 이미지 설정\n" +
        "next.config.js의 `remotePatterns`로 허용할 외부 이미지 도메인을 지정합니다. " +
        "보안과 최적화를 동시에 관리할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: next/image 핵심 패턴",
      content:
        "next/image의 다양한 사용 패턴을 구현합니다. " +
        "로컬 이미지, 외부 이미지, fill 모드, priority 설정, " +
        "그리고 next.config.js에서 외부 이미지 도메인을 허용하는 방법을 보여줍니다.",
      code: {
        language: "typescript",
        code:
          '// === next.config.ts — 외부 이미지 도메인 허용 ===\n' +
          'import type { NextConfig } from "next";\n\n' +
          'const nextConfig: NextConfig = {\n' +
          '  images: {\n' +
          '    remotePatterns: [\n' +
          '      {\n' +
          '        protocol: "https",\n' +
          '        hostname: "images.unsplash.com",\n' +
          '      },\n' +
          '      {\n' +
          '        protocol: "https",\n' +
          '        hostname: "cdn.example.com",\n' +
          '        pathname: "/photos/**",\n' +
          '      },\n' +
          '    ],\n' +
          '  },\n' +
          '};\n\n' +
          'export default nextConfig;\n\n' +
          '// === components/HeroImage.tsx — priority + 로컬 이미지 ===\n' +
          'import Image from "next/image";\n' +
          'import heroImg from "@/public/hero.jpg";\n\n' +
          'export function HeroImage() {\n' +
          '  return (\n' +
          '    <Image\n' +
          '      src={heroImg}\n' +
          '      alt="메인 히어로 이미지"\n' +
          '      // 로컬 이미지: width/height 자동 추론\n' +
          '      priority           // LCP 이미지이므로 즉시 로드\n' +
          '      placeholder="blur" // 로컬 이미지는 blur 자동 생성\n' +
          '      sizes="100vw"      // 전체 너비 사용\n' +
          '    />\n' +
          '  );\n' +
          '}\n\n' +
          '// === components/ProductImage.tsx — fill 모드 ===\n' +
          'import Image from "next/image";\n\n' +
          'interface ProductImageProps {\n' +
          '  src: string;\n' +
          '  alt: string;\n' +
          '}\n\n' +
          'export function ProductImage({ src, alt }: ProductImageProps) {\n' +
          '  return (\n' +
          '    // 부모에 position: relative 필수\n' +
          '    <div style={{ position: "relative", width: "100%", aspectRatio: "4/3" }}>\n' +
          '      <Image\n' +
          '        src={src}\n' +
          '        alt={alt}\n' +
          '        fill                // 부모 크기에 맞춤\n' +
          '        style={{ objectFit: "cover" }}\n' +
          '        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"\n' +
          '      />\n' +
          '    </div>\n' +
          '  );\n' +
          '}',
        description:
          "remotePatterns로 외부 이미지 도메인을 허용하고, priority로 LCP 이미지를 즉시 로드하며, fill 모드와 sizes로 반응형 이미지를 구현합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 이미지 갤러리 페이지",
      content:
        "next/image를 활용한 이미지 갤러리 페이지를 구현합니다. " +
        "첫 번째 이미지는 priority로 즉시 로드하고, 나머지는 자동 lazy loading에 맡깁니다. " +
        "fill 모드와 sizes 속성을 활용하여 반응형 갤러리를 만듭니다.",
      code: {
        language: "typescript",
        code:
          '// === app/gallery/page.tsx ===\n' +
          'import Image from "next/image";\n\n' +
          'interface Photo {\n' +
          '  id: number;\n' +
          '  url: string;\n' +
          '  title: string;\n' +
          '  width: number;\n' +
          '  height: number;\n' +
          '}\n\n' +
          'async function getPhotos(): Promise<Photo[]> {\n' +
          '  const res = await fetch("https://api.example.com/photos");\n' +
          '  return res.json();\n' +
          '}\n\n' +
          'export default async function GalleryPage() {\n' +
          '  const photos = await getPhotos();\n\n' +
          '  return (\n' +
          '    <main className="max-w-7xl mx-auto px-4 py-8">\n' +
          '      <h1 className="text-3xl font-bold mb-8">갤러리</h1>\n\n' +
          '      {/* Hero: 첫 번째 이미지는 priority로 즉시 로드 */}\n' +
          '      {photos[0] && (\n' +
          '        <div className="relative w-full aspect-video mb-8 rounded-xl overflow-hidden">\n' +
          '          <Image\n' +
          '            src={photos[0].url}\n' +
          '            alt={photos[0].title}\n' +
          '            fill\n' +
          '            priority\n' +
          '            style={{ objectFit: "cover" }}\n' +
          '            sizes="100vw"\n' +
          '          />\n' +
          '        </div>\n' +
          '      )}\n\n' +
          '      {/* 그리드: 나머지 이미지는 자동 lazy loading */}\n' +
          '      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">\n' +
          '        {photos.slice(1).map((photo) => (\n' +
          '          <div\n' +
          '            key={photo.id}\n' +
          '            className="relative aspect-square rounded-lg overflow-hidden"\n' +
          '          >\n' +
          '            <Image\n' +
          '              src={photo.url}\n' +
          '              alt={photo.title}\n' +
          '              fill\n' +
          '              style={{ objectFit: "cover" }}\n' +
          '              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"\n' +
          '            />\n' +
          '            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-3">\n' +
          '              <p className="text-white text-sm">{photo.title}</p>\n' +
          '            </div>\n' +
          '          </div>\n' +
          '        ))}\n' +
          '      </div>\n' +
          '    </main>\n' +
          '  );\n' +
          '}',
        description:
          "첫 번째 이미지에 priority를 부여하여 LCP를 최적화하고, 나머지는 lazy loading으로 필요할 때만 로드합니다. fill + sizes 조합으로 뷰포트별 최적 해상도를 제공합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 기능 | 설명 |\n" +
        "|------|------|\n" +
        "| WebP/AVIF 변환 | 브라우저에 맞는 최적 포맷으로 자동 변환 |\n" +
        "| Lazy Loading | 뷰포트에 가까워질 때만 이미지 로드 (기본 동작) |\n" +
        "| 반응형 이미지 | sizes 속성으로 뷰포트별 최적 해상도 선택 |\n" +
        "| width/height | CLS 방지를 위해 이미지 공간 미리 확보 |\n" +
        "| fill 모드 | 부모 컨테이너에 맞춰 이미지 채우기 |\n" +
        "| priority | LCP 이미지를 preload로 즉시 로드 |\n" +
        "| placeholder='blur' | 로딩 중 흐릿한 미리보기 표시 |\n" +
        "| remotePatterns | 허용할 외부 이미지 도메인 설정 |\n\n" +
        "**핵심:** next/image는 이미지를 자동으로 WebP 변환, 지연 로딩, 반응형 처리합니다. " +
        "LCP에 해당하는 Hero 이미지에는 priority를 붙이고, 나머지는 자동 lazy loading에 맡깁니다.\n\n" +
        "**다음 챕터 미리보기:** 이미지 최적화를 마쳤으니, " +
        "이제 next/font를 활용한 폰트 최적화(셀프 호스팅, FOUT/FOIT 해결, Tailwind 연동)를 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "next/image는 이미지를 자동으로 WebP 변환, 지연 로딩, 반응형 처리한다. LCP에 해당하는 Hero 이미지에는 priority를 붙이고, 나머지는 자동 lazy loading에 맡긴다.",
  checklist: [
    "next/image가 제공하는 자동 최적화 기능(WebP, lazy loading, 반응형)을 설명할 수 있다",
    "width/height 지정 방식과 fill 모드의 차이를 이해한다",
    "priority 속성을 언제 사용해야 하는지(LCP 이미지) 판단할 수 있다",
    "sizes 속성으로 뷰포트별 이미지 크기를 지정할 수 있다",
    "remotePatterns로 외부 이미지 도메인을 설정할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "next/image의 기본 이미지 로딩 방식은?",
      choices: [
        "모든 이미지를 페이지 로드 시 즉시 로드",
        "뷰포트에 가까워질 때 로드 (lazy loading)",
        "스크롤 이벤트 발생 시 로드",
        "사용자 클릭 시 로드",
      ],
      correctIndex: 1,
      explanation:
        "next/image는 기본적으로 lazy loading이 적용되어, 이미지가 뷰포트에 가까워질 때 자동으로 로드됩니다. 별도 설정 없이 기본 동작입니다.",
    },
    {
      id: "q2",
      question: "LCP(Largest Contentful Paint)에 해당하는 Hero 이미지에 추가해야 할 속성은?",
      choices: [
        "loading='eager'",
        "priority",
        "fetchPriority='high'",
        "preload={true}",
      ],
      correctIndex: 1,
      explanation:
        "priority 속성을 추가하면 lazy loading을 건너뛰고 preload 태그로 즉시 로드합니다. 이는 LCP 점수를 크게 개선합니다.",
    },
    {
      id: "q3",
      question: "next/image의 fill 모드를 사용할 때 부모 요소에 필요한 CSS 속성은?",
      choices: [
        "display: flex",
        "position: relative",
        "overflow: hidden",
        "width: 100%",
      ],
      correctIndex: 1,
      explanation:
        "fill 모드는 이미지를 부모 컨테이너에 맞춰 채웁니다. 이를 위해 부모 요소에 position: relative (또는 absolute, fixed)가 필요합니다.",
    },
    {
      id: "q4",
      question: "외부 이미지를 next/image에서 사용하려면 어디에 도메인을 설정해야 하는가?",
      choices: [
        "next/image의 domains prop",
        "next.config.js의 images.remotePatterns",
        "환경변수 NEXT_PUBLIC_IMAGE_DOMAINS",
        "app/layout.tsx의 metadata",
      ],
      correctIndex: 1,
      explanation:
        "외부 이미지는 보안을 위해 next.config.js의 images.remotePatterns에 허용할 도메인을 명시해야 합니다. protocol, hostname, pathname으로 세밀하게 제어할 수 있습니다.",
    },
    {
      id: "q5",
      question: "sizes 속성의 역할로 올바른 것은?",
      choices: [
        "이미지의 최대 해상도를 제한한다",
        "뷰포트 크기별로 이미지가 차지할 너비를 브라우저에 알려준다",
        "이미지의 품질(quality)을 설정한다",
        "이미지의 aspect ratio를 결정한다",
      ],
      correctIndex: 1,
      explanation:
        "sizes 속성은 뷰포트 크기별로 이미지가 차지할 너비를 브라우저에 알려줍니다. 브라우저는 이 정보를 사용해 srcset에서 최적 해상도의 이미지를 선택합니다.",
    },
  ],
};

export default chapter;
