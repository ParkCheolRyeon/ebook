import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "01-osi-tcpip",
  subject: "network",
  title: "OSI 7계층과 TCP/IP 모델",
  description: "네트워크 통신의 기본 구조인 OSI 7계층과 TCP/IP 4계층 모델을 이해하고, 웹 요청이 각 계층을 어떻게 통과하는지 학습합니다.",
  order: 1,
  group: "네트워크 기초",
  prerequisites: [],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "네트워크 계층 모델은 **국제 택배 시스템**과 비슷합니다.\n\n" +
        "여러분이 한국에서 미국 친구에게 선물을 보낸다고 상상해보세요:\n\n" +
        "1. **응용 계층** — 선물을 고르고 편지를 씁니다 (사용자가 웹 브라우저에서 URL을 입력)\n" +
        "2. **표현 계층** — 선물을 포장하고 라벨을 붙입니다 (데이터 암호화, 압축)\n" +
        "3. **세션 계층** — 택배 접수 번호를 받습니다 (연결 세션 관리)\n" +
        "4. **전송 계층** — 택배 회사가 배송 방법을 정합니다 (TCP/UDP 선택)\n" +
        "5. **네트워크 계층** — 어떤 경로로 보낼지 결정합니다 (IP 라우팅)\n" +
        "6. **데이터링크 계층** — 각 중간 거점에서 다음 거점으로 전달합니다 (MAC 주소)\n" +
        "7. **물리 계층** — 실제 트럭, 비행기, 배로 운송합니다 (전기 신호, 광케이블)\n\n" +
        "프론트엔드 개발자는 주로 **7층(응용 계층)** 에서 일합니다. HTTP, WebSocket 등이 모두 이 층에 해당합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "브라우저에서 `https://api.example.com/users`를 요청하면 정확히 무슨 일이 일어날까요?\n\n" +
        "프론트엔드 개발자가 `fetch()` 한 줄을 작성하면, 그 뒤에서는 수많은 계층이 협력하여 데이터를 주고받습니다. " +
        "이 과정을 이해하지 못하면 다음과 같은 문제를 만났을 때 원인을 찾기 어렵습니다:\n\n" +
        "1. **CORS 에러** — 어느 계층에서 차단되는 걸까?\n" +
        "2. **네트워크 타임아웃** — TCP 연결 문제인지, DNS 문제인지 구분 불가\n" +
        "3. **SSL 인증서 오류** — 어느 계층에서 암호화가 이루어지는지 모름\n" +
        "4. **WebSocket 연결 실패** — HTTP와 뭐가 다른지 설명 불가\n\n" +
        "네트워크 계층 모델을 이해하면, 이런 문제들의 원인을 빠르게 파악할 수 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### OSI 7계층 모델\n\n" +
        "OSI(Open Systems Interconnection) 모델은 네트워크 통신을 7개 계층으로 나눈 **이론적 참조 모델**입니다:\n\n" +
        "| 계층 | 이름 | 역할 | 프로토콜/장비 |\n" +
        "|------|------|------|---------------|\n" +
        "| 7 | 응용(Application) | 사용자 인터페이스 | HTTP, FTP, DNS |\n" +
        "| 6 | 표현(Presentation) | 데이터 변환/암호화 | SSL/TLS, JPEG |\n" +
        "| 5 | 세션(Session) | 연결 관리 | NetBIOS, RPC |\n" +
        "| 4 | 전송(Transport) | 신뢰성 있는 전송 | TCP, UDP |\n" +
        "| 3 | 네트워크(Network) | 경로 설정 | IP, ICMP, 라우터 |\n" +
        "| 2 | 데이터링크(Data Link) | 인접 노드 전달 | Ethernet, MAC |\n" +
        "| 1 | 물리(Physical) | 전기 신호 전송 | 케이블, 허브 |\n\n" +
        "### TCP/IP 4계층 모델\n\n" +
        "실제 인터넷은 OSI가 아닌 **TCP/IP 모델**을 사용합니다. OSI의 7계층을 4계층으로 간소화한 것입니다:\n\n" +
        "| TCP/IP 계층 | OSI 대응 | 주요 프로토콜 |\n" +
        "|-------------|----------|---------------|\n" +
        "| 응용(Application) | 5, 6, 7 | HTTP, DNS, FTP |\n" +
        "| 전송(Transport) | 4 | TCP, UDP |\n" +
        "| 인터넷(Internet) | 3 | IP, ICMP |\n" +
        "| 네트워크 접근(Network Access) | 1, 2 | Ethernet, Wi-Fi, ARP |\n\n" +
        "### 캡슐화와 역캡슐화\n\n" +
        "데이터를 보낼 때는 각 계층에서 **헤더를 추가**(캡슐화)하고, 받을 때는 **헤더를 제거**(역캡슐화)합니다. " +
        "프론트엔드에서 보낸 JSON 데이터는 HTTP 헤더, TCP 헤더, IP 헤더, 이더넷 프레임 등으로 감싸져서 전송됩니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 웹 요청의 계층별 흐름",
      content:
        "브라우저에서 API를 호출할 때 각 계층에서 일어나는 일을 의사코드로 표현합니다.",
      code: {
        language: "typescript",
        code:
          '// 프론트엔드 개발자가 작성하는 코드 (응용 계층)\n' +
          'const response = await fetch("https://api.example.com/users");\n' +
          'const data = await response.json();\n' +
          '\n' +
          '// === 내부적으로 일어나는 계층별 처리 (의사코드) ===\n' +
          '\n' +
          '// 7계층 (응용) — HTTP 요청 생성\n' +
          '// GET /users HTTP/1.1\n' +
          '// Host: api.example.com\n' +
          '// Accept: application/json\n' +
          '\n' +
          '// 6계층 (표현) — TLS 암호화\n' +
          '// encryptedData = TLS.encrypt(httpRequest)\n' +
          '\n' +
          '// 5계층 (세션) — TCP 세션 관리\n' +
          '// session = SessionManager.getOrCreate("api.example.com:443")\n' +
          '\n' +
          '// 4계층 (전송) — TCP 세그먼트로 분할\n' +
          '// segments = TCP.segment(data, srcPort: 54321, dstPort: 443)\n' +
          '// TCP 3-way handshake: SYN → SYN-ACK → ACK\n' +
          '\n' +
          '// 3계층 (네트워크) — IP 패킷 생성\n' +
          '// packet = IP.createPacket(\n' +
          '//   src: "192.168.1.100",\n' +
          '//   dst: "93.184.216.34",  // DNS로 해석된 IP\n' +
          '//   data: tcpSegment\n' +
          '// )\n' +
          '\n' +
          '// 2계층 (데이터링크) — 이더넷 프레임\n' +
          '// frame = Ethernet.frame(srcMAC, dstMAC, ipPacket)\n' +
          '\n' +
          '// 1계층 (물리) — 전기/광 신호로 변환\n' +
          '// signal = Physical.encode(frame) → 케이블/Wi-Fi로 전송',
        description: "fetch() 한 줄 뒤에서 7개 계층이 순차적으로 데이터를 처리합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 개발자 도구로 네트워크 계층 확인하기",
      content:
        "브라우저 개발자 도구의 Network 탭을 활용하여 각 계층의 정보를 확인하는 방법을 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// 1. 브라우저 개발자 도구 Network 탭에서 확인할 수 있는 계층별 정보\n' +
          '\n' +
          '// 응용 계층 정보: Request/Response 헤더, 본문\n' +
          'async function inspectLayers() {\n' +
          '  const url = "https://jsonplaceholder.typicode.com/posts/1";\n' +
          '\n' +
          '  console.time("전체 요청 시간");\n' +
          '\n' +
          '  const response = await fetch(url);\n' +
          '\n' +
          '  // 응용 계층 — HTTP 상태 코드\n' +
          '  console.log("HTTP 상태:", response.status);\n' +
          '\n' +
          '  // 응용 계층 — 응답 헤더 확인\n' +
          '  console.log("Content-Type:", response.headers.get("content-type"));\n' +
          '  console.log("Cache-Control:", response.headers.get("cache-control"));\n' +
          '\n' +
          '  // 응용 계층 — 응답 본문\n' +
          '  const data = await response.json();\n' +
          '  console.log("응답 데이터:", data);\n' +
          '\n' +
          '  console.timeEnd("전체 요청 시간");\n' +
          '}\n' +
          '\n' +
          '// 2. Performance API로 DNS, TCP, TLS 각 단계 시간 측정\n' +
          'function analyzeNetworkTiming() {\n' +
          '  const entries = performance.getEntriesByType("resource") as PerformanceResourceTiming[];\n' +
          '  const entry = entries[entries.length - 1];\n' +
          '\n' +
          '  if (entry) {\n' +
          '    console.log("DNS 조회 (7계층, 응용):", entry.domainLookupEnd - entry.domainLookupStart, "ms");\n' +
          '    console.log("TCP 연결 (4계층):", entry.connectEnd - entry.connectStart, "ms");\n' +
          '    console.log("TLS 핸드셰이크 (6계층):", entry.secureConnectionStart\n' +
          '      ? entry.connectEnd - entry.secureConnectionStart : 0, "ms");\n' +
          '    console.log("요청→응답 (7계층):", entry.responseStart - entry.requestStart, "ms");\n' +
          '    console.log("콘텐츠 다운로드:", entry.responseEnd - entry.responseStart, "ms");\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          'inspectLayers().then(analyzeNetworkTiming);',
        description: "Performance API를 사용하면 DNS, TCP, TLS 등 각 계층의 처리 시간을 측정할 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### OSI 7계층 vs TCP/IP 4계층\n\n" +
        "- **OSI 모델**은 이론적 참조 모델로, 네트워크 통신을 7개 계층으로 세분화합니다\n" +
        "- **TCP/IP 모델**은 실제 인터넷이 사용하는 4계층 모델입니다\n" +
        "- 프론트엔드 개발자는 주로 **응용 계층**(HTTP, WebSocket)에서 작업합니다\n\n" +
        "### 핵심 개념\n\n" +
        "- **캡슐화**: 데이터가 상위 → 하위 계층으로 내려가며 각 계층의 헤더가 추가됩니다\n" +
        "- **역캡슐화**: 수신 측에서 하위 → 상위 계층으로 올라가며 헤더를 제거합니다\n" +
        "- **각 계층은 독립적**: 한 계층의 프로토콜을 변경해도 다른 계층에 영향을 주지 않습니다\n\n" +
        "### 프론트엔드에서 마주치는 계층별 이슈\n\n" +
        "- DNS 조회 실패 → 7계층(응용 계층) 문제\n" +
        "- TCP 연결 타임아웃 → 4계층 문제\n" +
        "- SSL 인증서 오류 → 6계층 문제\n" +
        "- CORS, 404, 500 에러 → 7계층 문제\n\n" +
        "**다음 챕터 미리보기:** IP 주소, 포트 번호, DNS가 어떻게 동작하는지 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "OSI 7계층은 이론적 참조 모델이고 TCP/IP 4계층이 실제 인터넷 표준이다. 프론트엔드 개발자는 주로 응용 계층(HTTP)에서 작업하지만, 하위 계층을 이해하면 네트워크 문제를 빠르게 진단할 수 있다.",
  checklist: [
    "OSI 7계층의 이름과 역할을 순서대로 설명할 수 있다",
    "TCP/IP 4계층과 OSI 7계층의 대응 관계를 설명할 수 있다",
    "캡슐화와 역캡슐화의 과정을 이해한다",
    "프론트엔드 개발에서 주로 다루는 계층이 어디인지 안다",
    "Performance API로 각 계층별 소요 시간을 측정할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "OSI 모델에서 HTTP 프로토콜이 동작하는 계층은?",
      choices: ["4계층 (전송)", "5계층 (세션)", "6계층 (표현)", "7계층 (응용)"],
      correctIndex: 3,
      explanation: "HTTP는 OSI 7계층(응용 계층)에서 동작하는 프로토콜입니다. 웹 브라우저와 서버 간의 데이터 교환 규칙을 정의합니다.",
    },
    {
      id: "q2",
      question: "TCP/IP 모델의 4계층을 아래에서 위로 올바르게 나열한 것은?",
      choices: [
        "물리 → 데이터링크 → 네트워크 → 전송",
        "네트워크 접근 → 인터넷 → 전송 → 응용",
        "응용 → 전송 → 인터넷 → 네트워크 접근",
        "인터넷 → 전송 → 세션 → 응용",
      ],
      correctIndex: 1,
      explanation: "TCP/IP 모델은 아래에서 위로 네트워크 접근(1) → 인터넷(2) → 전송(3) → 응용(4) 순서입니다.",
    },
    {
      id: "q3",
      question: "데이터가 상위 계층에서 하위 계층으로 이동하며 각 계층의 헤더가 추가되는 과정을 무엇이라 하는가?",
      choices: ["라우팅", "캡슐화(Encapsulation)", "역캡슐화(Decapsulation)", "멀티플렉싱"],
      correctIndex: 1,
      explanation: "캡슐화는 송신 시 각 계층이 자신의 헤더를 추가하는 과정입니다. 수신 시 헤더를 제거하는 것은 역캡슐화입니다.",
    },
    {
      id: "q4",
      question: "SSL/TLS 인증서 오류가 발생했다면 OSI 모델의 어느 계층과 관련이 있는가?",
      choices: ["4계층 (전송)", "5계층 (세션)", "6계층 (표현)", "7계층 (응용)"],
      correctIndex: 2,
      explanation: "SSL/TLS는 OSI 모델에서 6계층(표현 계층)에 해당합니다. 데이터의 암호화와 복호화를 담당합니다.",
    },
    {
      id: "q5",
      question: "Performance API의 PerformanceResourceTiming에서 DNS 조회 시간을 구하는 올바른 계산은?",
      choices: [
        "connectEnd - connectStart",
        "domainLookupEnd - domainLookupStart",
        "responseStart - requestStart",
        "responseEnd - responseStart",
      ],
      correctIndex: 1,
      explanation: "domainLookupEnd - domainLookupStart로 DNS 조회에 걸린 시간을 계산할 수 있습니다. connectEnd - connectStart는 TCP 연결 시간입니다.",
    },
  ],
};

export default chapter;
