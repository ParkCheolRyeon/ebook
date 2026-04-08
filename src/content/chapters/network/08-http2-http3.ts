import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "08-http2-http3",
  subject: "network",
  title: "HTTP/2와 HTTP/3",
  description:
    "HTTP/1.1의 한계를 이해하고, HTTP/2의 멀티플렉싱과 서버 푸시, HTTP/3의 QUIC 프로토콜이 프론트엔드 성능에 미치는 영향을 학습합니다.",
  order: 8,
  group: "HTTP 진화",
  prerequisites: ["04-http-basics"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "HTTP의 진화를 **택배 배송 시스템**에 비유해봅시다.\n\n" +
        "**HTTP/1.1 = 1차선 도로의 택배 트럭**\n" +
        "한 대의 트럭이 한 번에 하나의 택배만 배달할 수 있습니다. " +
        "다음 택배를 보내려면 앞 트럭이 돌아올 때까지 기다려야 합니다. " +
        "급한 택배가 있어도 앞 택배가 끝나야 합니다(Head-of-Line Blocking).\n\n" +
        "**HTTP/2 = 멀티레인 고속도로**\n" +
        "하나의 도로(TCP 연결)에 여러 차선(스트림)이 생겼습니다. " +
        "여러 택배를 동시에 보낼 수 있고, 작은 택배는 큰 택배를 추월할 수도 있습니다. " +
        "택배 송장(헤더)도 압축해서 종이를 아끼고, 받는 사람이 요청하기 전에 미리 보내줄 수도 있습니다(서버 푸시).\n\n" +
        "**HTTP/3 = 드론 배송**\n" +
        "도로(TCP) 자체를 버리고 하늘길(UDP + QUIC)을 사용합니다. " +
        "한 드론이 고장 나도 다른 드론은 영향받지 않습니다. " +
        "Wi-Fi에서 LTE로 전환해도 배송이 끊기지 않습니다(연결 마이그레이션).",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 개발자가 성능 최적화를 할 때 다음과 같은 문제에 직면합니다:\n\n" +
        "### HTTP/1.1의 한계\n" +
        "- **Head-of-Line Blocking**: 하나의 요청이 느리면 뒤따르는 모든 요청이 대기합니다.\n" +
        "- **연결 수 제한**: 브라우저는 도메인당 6~8개의 동시 연결만 허용합니다.\n" +
        "- **중복 헤더**: 매 요청마다 쿠키와 User-Agent 같은 동일한 헤더를 반복 전송합니다.\n" +
        "- **텍스트 기반 프로토콜**: 사람이 읽을 수 있지만 파싱이 느립니다.\n\n" +
        "이 한계 때문에 개발자들은 여러 해킹 기법을 사용했습니다:\n" +
        "- **도메인 샤딩**: 여러 서브도메인으로 리소스를 분산하여 동시 연결 수를 늘림\n" +
        "- **스프라이트 시트**: 여러 이미지를 하나로 합쳐 요청 수를 줄임\n" +
        "- **CSS/JS 번들링**: 파일을 하나로 합침\n" +
        "- **인라이닝**: 작은 CSS/JS를 HTML에 직접 삽입\n\n" +
        "이런 최적화는 복잡도를 높이고 캐싱 효율을 떨어뜨립니다. " +
        "근본적인 프로토콜 개선이 필요했습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### HTTP/2 핵심 기능\n\n" +
        "**1. 바이너리 프레이밍 계층**\n" +
        "HTTP 메시지를 바이너리 프레임으로 분할합니다. 텍스트보다 파싱이 빠르고 오류 가능성이 줄어듭니다.\n\n" +
        "**2. 멀티플렉싱**\n" +
        "하나의 TCP 연결에서 여러 요청/응답을 동시에 주고받습니다. " +
        "각 요청은 독립적인 스트림으로 처리되어 서로 차단하지 않습니다.\n\n" +
        "**3. 헤더 압축 (HPACK)**\n" +
        "정적/동적 테이블을 사용하여 중복 헤더를 제거합니다. " +
        "첫 요청 이후 변경되지 않은 헤더는 인덱스만 전송합니다.\n\n" +
        "**4. 서버 푸시 (사실상 폐기됨)**\n" +
        "클라이언트가 요청하기 전에 서버가 필요한 리소스를 미리 보내는 기능이었으나, " +
        "Chrome은 2022년에 서버 푸시 지원을 제거했습니다. " +
        "실무에서는 `103 Early Hints` 응답이나 `<link rel=\"preload\">`로 대체하는 것이 권장됩니다.\n\n" +
        "**5. 스트림 우선순위**\n" +
        "CSS나 JS처럼 중요한 리소스에 높은 우선순위를 부여할 수 있습니다.\n\n" +
        "### HTTP/3 핵심 기능\n\n" +
        "**1. QUIC 프로토콜 (UDP 기반)**\n" +
        "TCP 대신 UDP 위에 구축된 QUIC를 사용합니다. " +
        "TCP의 Head-of-Line Blocking을 완전히 해결합니다.\n\n" +
        "**2. 0-RTT 연결 수립**\n" +
        "이전에 연결한 서버에 다시 접속할 때 핸드셰이크 없이 즉시 데이터를 전송합니다.\n\n" +
        "**3. 연결 마이그레이션**\n" +
        "IP가 변경되어도(Wi-Fi에서 LTE 전환) 연결이 유지됩니다. " +
        "Connection ID로 연결을 식별하기 때문입니다.\n\n" +
        "**4. 독립적인 스트림**\n" +
        "하나의 스트림에서 패킷 손실이 발생해도 다른 스트림에 영향을 주지 않습니다.\n\n" +
        "### 프론트엔드에 미치는 영향\n" +
        "- **도메인 샤딩 불필요**: 멀티플렉싱으로 하나의 연결이 충분합니다.\n" +
        "- **스프라이트 시트 감소**: 개별 이미지 요청의 오버헤드가 줄었습니다.\n" +
        "- **세밀한 코드 분할**: 번들을 작게 나눠도 성능 저하가 없습니다.\n" +
        "- **리소스 힌트 활용**: `<link rel=\"preload\">`가 서버 푸시를 대체할 수 있습니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: HTTP/2 성능 분석 유틸리티",
      content:
        "프론트엔드에서 HTTP 프로토콜 버전을 감지하고 성능을 측정하는 유틸리티를 구현합니다.",
      code: {
        language: "typescript",
        code:
          "// HTTP 프로토콜 버전 감지 및 성능 측정 유틸리티\n" +
          "\n" +
          "interface ProtocolInfo {\n" +
          "  protocol: string;\n" +
          "  isHttp2: boolean;\n" +
          "  isHttp3: boolean;\n" +
          "}\n" +
          "\n" +
          "interface ResourceTiming {\n" +
          "  name: string;\n" +
          "  protocol: string;\n" +
          "  dnsTime: number;\n" +
          "  connectTime: number;\n" +
          "  ttfb: number;\n" +
          "  downloadTime: number;\n" +
          "  totalTime: number;\n" +
          "}\n" +
          "\n" +
          "// Navigation Timing API로 현재 페이지의 프로토콜 확인\n" +
          "function detectProtocol(): ProtocolInfo {\n" +
          "  const entries = performance.getEntriesByType(\n" +
          "    \"navigation\"\n" +
          "  ) as PerformanceNavigationTiming[];\n" +
          "\n" +
          "  if (entries.length === 0) {\n" +
          "    return { protocol: \"unknown\", isHttp2: false, isHttp3: false };\n" +
          "  }\n" +
          "\n" +
          "  const nav = entries[0];\n" +
          "  // nextHopProtocol: \"h2\", \"h3\", \"http/1.1\" 등\n" +
          "  const protocol = nav.nextHopProtocol;\n" +
          "\n" +
          "  return {\n" +
          "    protocol,\n" +
          "    isHttp2: protocol === \"h2\",\n" +
          "    isHttp3: protocol === \"h3\",\n" +
          "  };\n" +
          "}\n" +
          "\n" +
          "// 모든 리소스의 프로토콜별 성능 분석\n" +
          "function analyzeResourcePerformance(): ResourceTiming[] {\n" +
          "  const resources = performance.getEntriesByType(\n" +
          "    \"resource\"\n" +
          "  ) as PerformanceResourceTiming[];\n" +
          "\n" +
          "  return resources.map((entry) => ({\n" +
          "    name: entry.name,\n" +
          "    protocol: entry.nextHopProtocol,\n" +
          "    dnsTime: entry.domainLookupEnd - entry.domainLookupStart,\n" +
          "    connectTime: entry.connectEnd - entry.connectStart,\n" +
          "    ttfb: entry.responseStart - entry.requestStart,\n" +
          "    downloadTime: entry.responseEnd - entry.responseStart,\n" +
          "    totalTime: entry.responseEnd - entry.startTime,\n" +
          "  }));\n" +
          "}\n" +
          "\n" +
          "// 프로토콜별 평균 성능 비교\n" +
          "function compareProtocolPerformance(): void {\n" +
          "  const timings = analyzeResourcePerformance();\n" +
          "\n" +
          "  const grouped = timings.reduce<\n" +
          "    Record<string, ResourceTiming[]>\n" +
          "  >((acc, t) => {\n" +
          "    const key = t.protocol || \"unknown\";\n" +
          "    if (!acc[key]) acc[key] = [];\n" +
          "    acc[key].push(t);\n" +
          "    return acc;\n" +
          "  }, {});\n" +
          "\n" +
          "  Object.entries(grouped).forEach(([protocol, items]) => {\n" +
          "    const avgTtfb = items.reduce(\n" +
          "      (sum, i) => sum + i.ttfb, 0\n" +
          "    ) / items.length;\n" +
          "    const avgTotal = items.reduce(\n" +
          "      (sum, i) => sum + i.totalTime, 0\n" +
          "    ) / items.length;\n" +
          "\n" +
          "    console.log(\n" +
          "      \"프로토콜: \" + protocol +\n" +
          "      \" | 리소스 수: \" + items.length +\n" +
          "      \" | 평균 TTFB: \" + avgTtfb.toFixed(2) + \"ms\" +\n" +
          "      \" | 평균 총 시간: \" + avgTotal.toFixed(2) + \"ms\"\n" +
          "    );\n" +
          "  });\n" +
          "}",
        description:
          "Performance API를 사용하여 HTTP 프로토콜 버전을 감지하고 리소스별 성능을 측정하는 유틸리티입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: HTTP/2 멀티플렉싱 효과 테스트",
      content:
        "여러 리소스를 동시에 로드하여 HTTP/2 멀티플렉싱의 효과를 직접 확인해봅니다.",
      code: {
        language: "typescript",
        code:
          "// HTTP/2 멀티플렉싱 효과를 체감하는 실습\n" +
          "\n" +
          "interface LoadResult {\n" +
          "  url: string;\n" +
          "  status: number;\n" +
          "  duration: number;\n" +
          "}\n" +
          "\n" +
          "// 순차 로딩 (HTTP/1.1 스타일)\n" +
          "async function loadSequentially(\n" +
          "  urls: string[]\n" +
          "): Promise<LoadResult[]> {\n" +
          "  const results: LoadResult[] = [];\n" +
          "\n" +
          "  for (const url of urls) {\n" +
          "    const start = performance.now();\n" +
          "    const response = await fetch(url);\n" +
          "    await response.text();\n" +
          "    const duration = performance.now() - start;\n" +
          "\n" +
          "    results.push({\n" +
          "      url,\n" +
          "      status: response.status,\n" +
          "      duration,\n" +
          "    });\n" +
          "  }\n" +
          "\n" +
          "  return results;\n" +
          "}\n" +
          "\n" +
          "// 병렬 로딩 (HTTP/2 멀티플렉싱 활용)\n" +
          "async function loadConcurrently(\n" +
          "  urls: string[]\n" +
          "): Promise<LoadResult[]> {\n" +
          "  const start = performance.now();\n" +
          "\n" +
          "  const promises = urls.map(async (url) => {\n" +
          "    const reqStart = performance.now();\n" +
          "    const response = await fetch(url);\n" +
          "    await response.text();\n" +
          "    const duration = performance.now() - reqStart;\n" +
          "\n" +
          "    return { url, status: response.status, duration };\n" +
          "  });\n" +
          "\n" +
          "  const results = await Promise.all(promises);\n" +
          "  const totalTime = performance.now() - start;\n" +
          "\n" +
          "  console.log(\"병렬 로딩 총 시간: \" + totalTime.toFixed(2) + \"ms\");\n" +
          "  return results;\n" +
          "}\n" +
          "\n" +
          "// 비교 테스트 실행\n" +
          "async function runComparison(): Promise<void> {\n" +
          "  const urls = [\n" +
          "    \"/api/users\",\n" +
          "    \"/api/posts\",\n" +
          "    \"/api/comments\",\n" +
          "    \"/api/tags\",\n" +
          "    \"/api/categories\",\n" +
          "  ];\n" +
          "\n" +
          "  console.log(\"=== 순차 로딩 ===\");\n" +
          "  const seqStart = performance.now();\n" +
          "  const seqResults = await loadSequentially(urls);\n" +
          "  const seqTotal = performance.now() - seqStart;\n" +
          "\n" +
          "  seqResults.forEach((r) => {\n" +
          "    console.log(r.url + \": \" + r.duration.toFixed(2) + \"ms\");\n" +
          "  });\n" +
          "  console.log(\"순차 총 시간: \" + seqTotal.toFixed(2) + \"ms\");\n" +
          "\n" +
          "  console.log(\"\\n=== 병렬 로딩 (HTTP/2 멀티플렉싱) ===\");\n" +
          "  const parResults = await loadConcurrently(urls);\n" +
          "\n" +
          "  parResults.forEach((r) => {\n" +
          "    console.log(r.url + \": \" + r.duration.toFixed(2) + \"ms\");\n" +
          "  });\n" +
          "\n" +
          "  console.log(\n" +
          "    \"\\n순차 대비 병렬 로딩 속도 개선: \" +\n" +
          "    ((1 - parResults.reduce(\n" +
          "      (sum, r) => sum + r.duration, 0\n" +
          "    ) / seqTotal) * 100).toFixed(1) + \"%\"\n" +
          "  );\n" +
          "}\n" +
          "\n" +
          "runComparison();",
        description:
          "순차 로딩과 병렬 로딩을 비교하여 HTTP/2 멀티플렉싱의 성능 이점을 체감하는 실습입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### HTTP/1.1\n" +
        "- 텍스트 기반, 한 연결당 한 요청씩 처리, Head-of-Line Blocking 문제\n" +
        "- 도메인당 6~8개 연결 제한으로 도메인 샤딩 같은 우회 기법 필요\n\n" +
        "### HTTP/2\n" +
        "- 바이너리 프레이밍으로 효율적 파싱\n" +
        "- 멀티플렉싱으로 하나의 연결에서 여러 요청 동시 처리\n" +
        "- HPACK 헤더 압축으로 중복 제거\n" +
        "- 서버 푸시는 사실상 폐기됨 (Chrome 2022년 지원 제거, 103 Early Hints와 preload로 대체)\n\n" +
        "### HTTP/3\n" +
        "- QUIC(UDP 기반) 프로토콜 사용\n" +
        "- TCP Head-of-Line Blocking 완전 해결\n" +
        "- 0-RTT 연결로 빠른 재접속\n" +
        "- 연결 마이그레이션으로 네트워크 전환 시에도 끊김 없음\n\n" +
        "### 프론트엔드 최적화 변화\n" +
        "- 도메인 샤딩, 스프라이트 시트 등 기존 해킹 기법이 불필요해짐\n" +
        "- 세밀한 코드 스플리팅과 개별 리소스 요청이 더 효율적\n" +
        "- `<link rel=\"preload\">`와 `<link rel=\"preconnect\">`로 리소스 힌트 활용",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "HTTP/2는 멀티플렉싱으로, HTTP/3는 QUIC로 웹 성능을 혁신적으로 개선하며, 프론트엔드 최적화 전략도 이에 맞게 변화해야 합니다.",
  checklist: [
    "HTTP/1.1의 Head-of-Line Blocking이 무엇인지 설명할 수 있다",
    "HTTP/2의 멀티플렉싱과 바이너리 프레이밍의 동작 원리를 이해한다",
    "HTTP/3가 QUIC(UDP 기반)을 사용하는 이유를 설명할 수 있다",
    "HTTP/2 환경에서 도메인 샤딩이 불필요한 이유를 안다",
    "Performance API로 프로토콜 버전과 리소스 성능을 측정할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "HTTP/1.1에서 하나의 요청이 느릴 때 뒤따르는 요청도 대기하는 현상을 무엇이라 하나요?",
      choices: [
        "멀티플렉싱",
        "Head-of-Line Blocking",
        "서버 푸시",
        "연결 마이그레이션",
      ],
      correctIndex: 1,
      explanation:
        "Head-of-Line Blocking은 앞선 요청이 완료될 때까지 뒤따르는 요청이 대기하는 현상입니다. HTTP/2의 멀티플렉싱이 이 문제를 해결합니다.",
    },
    {
      id: "q2",
      question:
        "HTTP/2에서 하나의 TCP 연결로 여러 요청을 동시에 처리하는 기능은?",
      choices: [
        "파이프라이닝",
        "도메인 샤딩",
        "멀티플렉싱",
        "커넥션 풀링",
      ],
      correctIndex: 2,
      explanation:
        "멀티플렉싱은 하나의 TCP 연결에서 여러 스트림을 동시에 주고받는 기능으로, HTTP/2의 핵심 기능입니다.",
    },
    {
      id: "q3",
      question: "HTTP/3가 TCP 대신 사용하는 전송 프로토콜은?",
      choices: [
        "SCTP",
        "QUIC (UDP 기반)",
        "WebSocket",
        "TLS 1.3",
      ],
      correctIndex: 1,
      explanation:
        "HTTP/3는 UDP 위에 구축된 QUIC 프로토콜을 사용하여 TCP의 Head-of-Line Blocking을 근본적으로 해결합니다.",
    },
    {
      id: "q4",
      question:
        "HTTP/2 환경에서 더 이상 필요하지 않은 기존 최적화 기법은?",
      choices: [
        "이미지 최적화",
        "코드 스플리팅",
        "도메인 샤딩",
        "캐싱 전략",
      ],
      correctIndex: 2,
      explanation:
        "도메인 샤딩은 HTTP/1.1의 도메인당 연결 수 제한을 우회하기 위한 기법이었으나, HTTP/2의 멀티플렉싱으로 하나의 연결이면 충분하므로 불필요합니다.",
    },
    {
      id: "q5",
      question:
        "HTTP/2에서 중복 헤더를 제거하기 위해 사용하는 압축 방식은?",
      choices: [
        "gzip",
        "HPACK",
        "Brotli",
        "deflate",
      ],
      correctIndex: 1,
      explanation:
        "HPACK은 HTTP/2 전용 헤더 압축 방식으로, 정적/동적 테이블을 사용하여 반복되는 헤더를 효율적으로 압축합니다.",
    },
  ],
};

export default chapter;
