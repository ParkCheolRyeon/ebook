import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "03-tcp-udp",
  subject: "network",
  title: "TCP와 UDP",
  description: "전송 계층의 두 핵심 프로토콜인 TCP와 UDP의 동작 원리, 차이점, 그리고 프론트엔드에서의 활용을 학습합니다.",
  order: 3,
  group: "네트워크 기초",
  prerequisites: ["01-osi-tcpip"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "TCP와 UDP는 **택배**와 **우편엽서**의 차이와 같습니다.\n\n" +
        "**TCP (택배)**:\n" +
        "- 보내기 전에 수신자에게 전화합니다: \"택배 보내도 됩니까?\" → \"네\" → \"보내겠습니다\" (3-way handshake)\n" +
        "- 배송 추적이 가능하고, 분실되면 재발송합니다 (신뢰성)\n" +
        "- 여러 상자를 순서대로 번호를 매겨 보냅니다 (순서 보장)\n" +
        "- 수신자가 처리할 수 있는 속도에 맞춰 보냅니다 (흐름 제어)\n\n" +
        "**UDP (우편엽서)**:\n" +
        "- 그냥 보냅니다. 확인 전화 없음 (연결 설정 없음)\n" +
        "- 도착 여부를 확인하지 않습니다 (비신뢰성)\n" +
        "- 순서가 뒤바뀌어도 상관없습니다\n" +
        "- 대신 매우 빠릅니다\n\n" +
        "웹 페이지 로딩(HTTP)은 모든 데이터가 정확해야 하니 **TCP**, 화상 통화(WebRTC)는 약간의 손실보다 속도가 중요하니 **UDP**를 사용합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 개발자가 TCP와 UDP를 이해해야 하는 이유:\n\n" +
        "1. **HTTP가 TCP 위에서 동작** — 웹의 모든 요청/응답은 TCP 연결 위에서 이루어집니다\n" +
        "2. **연결 지연(latency)** — TCP 3-way handshake + TLS handshake로 첫 요청이 느린 이유\n" +
        "3. **Keep-Alive** — 왜 매번 새 연결을 만들지 않는지\n" +
        "4. **HTTP/3가 UDP를 선택한 이유** — 최신 웹 프로토콜의 변화 방향\n" +
        "5. **WebRTC** — 실시간 영상/음성 통신이 UDP를 사용하는 이유\n\n" +
        "네트워크 성능 최적화, 실시간 기능 구현, 디버깅 등에서 TCP와 UDP의 이해는 필수입니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### TCP (Transmission Control Protocol)\n\n" +
        "**3-way Handshake (연결 설정)**:\n" +
        "1. 클라이언트 → 서버: **SYN** (연결 요청)\n" +
        "2. 서버 → 클라이언트: **SYN-ACK** (요청 수락)\n" +
        "3. 클라이언트 → 서버: **ACK** (확인)\n\n" +
        "**신뢰성 보장 메커니즘**:\n" +
        "- **시퀀스 번호**: 각 세그먼트에 번호를 매겨 순서를 보장합니다\n" +
        "- **ACK(확인 응답)**: 수신측이 데이터를 받으면 확인 메시지를 보냅니다\n" +
        "- **재전송**: ACK가 오지 않으면 데이터를 다시 보냅니다\n" +
        "- **흐름 제어(Flow Control)**: 수신측 처리 속도에 맞춰 전송 속도를 조절합니다\n" +
        "- **혼잡 제어(Congestion Control)**: 네트워크 상태에 따라 전송량을 조절합니다\n\n" +
        "### UDP (User Datagram Protocol)\n\n" +
        "- 연결 설정 없이 바로 데이터를 전송합니다\n" +
        "- 헤더가 8바이트로 TCP(최소 20바이트, 옵션 포함 시 최대 60바이트)보다 작아 오버헤드가 적습니다\n" +
        "- 순서 보장, 재전송, 흐름 제어가 없습니다\n" +
        "- 실시간 스트리밍, 게임, VoIP, WebRTC에 적합합니다\n\n" +
        "### TCP vs UDP 비교\n\n" +
        "| 특성 | TCP | UDP |\n" +
        "|------|-----|-----|\n" +
        "| 연결 | 연결 지향 | 비연결 |\n" +
        "| 신뢰성 | 보장 | 미보장 |\n" +
        "| 순서 | 보장 | 미보장 |\n" +
        "| 속도 | 상대적 느림 | 빠름 |\n" +
        "| 사용 예 | HTTP, WebSocket | WebRTC, DNS, HTTP/3(QUIC) |\n\n" +
        "### Keep-Alive\n\n" +
        "HTTP/1.1부터 `Connection: keep-alive`가 기본입니다. 한 번 맺은 TCP 연결을 재사용하여 3-way handshake의 오버헤드를 줄입니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: TCP 3-way Handshake 시뮬레이션",
      content:
        "TCP 연결 설정 과정을 TypeScript로 시뮬레이션합니다.",
      code: {
        language: "typescript",
        code:
          '// TCP 3-way Handshake 시뮬레이션\n' +
          '\n' +
          'interface TCPSegment {\n' +
          '  srcPort: number;\n' +
          '  dstPort: number;\n' +
          '  sequenceNumber: number;\n' +
          '  ackNumber: number;\n' +
          '  flags: { SYN: boolean; ACK: boolean; FIN: boolean };\n' +
          '  data?: string;\n' +
          '}\n' +
          '\n' +
          'class TCPConnection {\n' +
          '  private state: "CLOSED" | "SYN_SENT" | "SYN_RECEIVED" | "ESTABLISHED" = "CLOSED";\n' +
          '  private sequenceNumber = 0;\n' +
          '\n' +
          '  // 클라이언트 측: 연결 시작\n' +
          '  connect(serverPort: number): TCPSegment {\n' +
          '    this.sequenceNumber = Math.floor(Math.random() * 10000);\n' +
          '    this.state = "SYN_SENT";\n' +
          '    console.log("[1단계] 클라이언트 → SYN 전송");\n' +
          '\n' +
          '    return {\n' +
          '      srcPort: 54321,\n' +
          '      dstPort: serverPort,\n' +
          '      sequenceNumber: this.sequenceNumber,\n' +
          '      ackNumber: 0,\n' +
          '      flags: { SYN: true, ACK: false, FIN: false },\n' +
          '    };\n' +
          '  }\n' +
          '\n' +
          '  // 서버 측: SYN 수신 후 SYN-ACK 응답\n' +
          '  handleSyn(segment: TCPSegment): TCPSegment {\n' +
          '    this.state = "SYN_RECEIVED";\n' +
          '    this.sequenceNumber = Math.floor(Math.random() * 10000);\n' +
          '    console.log("[2단계] 서버 → SYN-ACK 전송");\n' +
          '\n' +
          '    return {\n' +
          '      srcPort: segment.dstPort,\n' +
          '      dstPort: segment.srcPort,\n' +
          '      sequenceNumber: this.sequenceNumber,\n' +
          '      ackNumber: segment.sequenceNumber + 1,\n' +
          '      flags: { SYN: true, ACK: true, FIN: false },\n' +
          '    };\n' +
          '  }\n' +
          '\n' +
          '  // 클라이언트 측: SYN-ACK 수신 후 ACK 응답\n' +
          '  handleSynAck(segment: TCPSegment): TCPSegment {\n' +
          '    this.state = "ESTABLISHED";\n' +
          '    console.log("[3단계] 클라이언트 → ACK 전송");\n' +
          '    console.log("연결 설정 완료! 상태:", this.state);\n' +
          '\n' +
          '    return {\n' +
          '      srcPort: segment.dstPort,\n' +
          '      dstPort: segment.srcPort,\n' +
          '      sequenceNumber: this.sequenceNumber + 1,\n' +
          '      ackNumber: segment.sequenceNumber + 1,\n' +
          '      flags: { SYN: false, ACK: true, FIN: false },\n' +
          '    };\n' +
          '  }\n' +
          '}',
        description: "TCP 3-way handshake는 SYN → SYN-ACK → ACK 순서로 진행되어 양측이 준비되었음을 확인합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 네트워크 연결 시간 측정과 Keep-Alive 효과",
      content:
        "TCP 연결의 성능 영향을 직접 측정하고, Keep-Alive가 어떻게 성능을 개선하는지 확인합니다.",
      code: {
        language: "typescript",
        code:
          '// 1. TCP 연결 시간 측정 (Performance API 활용)\n' +
          'async function measureConnectionTime(url: string): Promise<void> {\n' +
          '  const startMark = `fetch-start-${Date.now()}`;\n' +
          '  performance.mark(startMark);\n' +
          '\n' +
          '  await fetch(url);\n' +
          '\n' +
          '  const entries = performance.getEntriesByType("resource") as PerformanceResourceTiming[];\n' +
          '  const entry = entries[entries.length - 1];\n' +
          '\n' +
          '  if (entry) {\n' +
          '    const dnsTime = entry.domainLookupEnd - entry.domainLookupStart;\n' +
          '    const tcpTime = entry.connectEnd - entry.connectStart;\n' +
          '    const tlsTime = entry.secureConnectionStart > 0\n' +
          '      ? entry.connectEnd - entry.secureConnectionStart : 0;\n' +
          '    const ttfb = entry.responseStart - entry.requestStart;\n' +
          '\n' +
          '    console.log(`DNS 조회: ${dnsTime.toFixed(2)}ms`);\n' +
          '    console.log(`TCP 연결: ${tcpTime.toFixed(2)}ms`);\n' +
          '    console.log(`TLS 핸드셰이크: ${tlsTime.toFixed(2)}ms`);\n' +
          '    console.log(`TTFB: ${ttfb.toFixed(2)}ms`);\n' +
          '    console.log(`총 연결 오버헤드: ${(dnsTime + tcpTime).toFixed(2)}ms`);\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// 2. Keep-Alive 효과 비교: 연속 요청의 연결 재사용\n' +
          'async function compareKeepAlive(): Promise<void> {\n' +
          '  const url = "https://jsonplaceholder.typicode.com/posts";\n' +
          '\n' +
          '  console.log("=== 첫 번째 요청 (새 TCP 연결) ===");\n' +
          '  await measureConnectionTime(url + "/1");\n' +
          '\n' +
          '  console.log("\\n=== 두 번째 요청 (Keep-Alive로 연결 재사용) ===");\n' +
          '  await measureConnectionTime(url + "/2");\n' +
          '  // 두 번째 요청은 TCP 연결 시간이 0에 가까움\n' +
          '\n' +
          '  console.log("\\n=== 세 번째 요청 (Keep-Alive로 연결 재사용) ===");\n' +
          '  await measureConnectionTime(url + "/3");\n' +
          '}\n' +
          '\n' +
          '// 3. Preconnect로 TCP 연결 미리 수행\n' +
          'function preconnect(origin: string): void {\n' +
          '  const link = document.createElement("link");\n' +
          '  link.rel = "preconnect";\n' +
          '  link.href = origin;\n' +
          '  link.crossOrigin = "anonymous";\n' +
          '  document.head.appendChild(link);\n' +
          '}\n' +
          '\n' +
          '// 외부 API 서버에 미리 TCP+TLS 연결\n' +
          'preconnect("https://api.example.com");\n' +
          'preconnect("https://fonts.gstatic.com");',
        description: "Performance API로 TCP 연결 시간을 측정하고, Keep-Alive와 preconnect로 연결 오버헤드를 줄일 수 있습니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### TCP\n" +
        "- 3-way handshake로 연결을 설정하는 **신뢰성 있는** 프로토콜입니다\n" +
        "- 순서 보장, 재전송, 흐름 제어, 혼잡 제어를 제공합니다\n" +
        "- HTTP/1.1, HTTP/2, WebSocket 등 대부분의 웹 프로토콜이 TCP 위에서 동작합니다\n\n" +
        "### UDP\n" +
        "- 연결 설정 없이 데이터를 전송하는 **경량** 프로토콜입니다\n" +
        "- 실시간 스트리밍, WebRTC, 게임 등 속도가 중요한 곳에서 사용됩니다\n" +
        "- HTTP/3(QUIC)는 UDP 위에 자체 신뢰성을 구현합니다\n\n" +
        "### 프론트엔드 성능 최적화\n" +
        "- **Keep-Alive**로 TCP 연결을 재사용하여 handshake 오버헤드를 줄입니다\n" +
        "- **preconnect**로 중요한 외부 서버에 미리 TCP+TLS 연결을 맺습니다\n" +
        "- **Performance API**로 DNS, TCP, TLS 각 단계의 소요 시간을 측정합니다\n\n" +
        "**다음 챕터 미리보기:** TCP 위에서 동작하는 HTTP 프로토콜의 기본 구조를 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "TCP는 3-way handshake로 신뢰성 있는 연결을 보장하고, UDP는 연결 없이 빠르게 전송한다. HTTP는 TCP 위에서, WebRTC는 UDP 위에서 동작하며, HTTP/3는 UDP 기반의 QUIC을 사용한다.",
  checklist: [
    "TCP 3-way handshake의 SYN → SYN-ACK → ACK 과정을 설명할 수 있다",
    "TCP의 신뢰성 보장 메커니즘(순서, 재전송, 흐름 제어)을 이해한다",
    "UDP가 TCP보다 빠른 이유와 사용 사례를 설명할 수 있다",
    "Keep-Alive의 역할과 성능 이점을 이해한다",
    "preconnect 힌트를 사용하여 연결 지연을 줄이는 방법을 안다",
  ],
  quiz: [
    {
      id: "q1",
      question: "TCP 3-way handshake의 올바른 순서는?",
      choices: [
        "ACK → SYN → SYN-ACK",
        "SYN → SYN-ACK → ACK",
        "SYN → ACK → SYN-ACK",
        "SYN-ACK → SYN → ACK",
      ],
      correctIndex: 1,
      explanation: "TCP 연결은 클라이언트가 SYN을 보내고, 서버가 SYN-ACK로 응답하고, 클라이언트가 ACK로 확인하는 3단계로 이루어집니다.",
    },
    {
      id: "q2",
      question: "다음 중 UDP를 사용하는 프로토콜은?",
      choices: ["HTTP/1.1", "WebSocket", "WebRTC", "FTP"],
      correctIndex: 2,
      explanation: "WebRTC는 실시간 영상/음성 통신을 위해 UDP를 사용합니다. 약간의 데이터 손실보다 낮은 지연 시간이 더 중요하기 때문입니다.",
    },
    {
      id: "q3",
      question: "HTTP/1.1에서 Connection: keep-alive의 역할은?",
      choices: [
        "데이터를 암호화한다",
        "TCP 연결을 재사용하여 handshake 오버헤드를 줄인다",
        "UDP로 전환하여 속도를 높인다",
        "서버의 응답 시간을 단축한다",
      ],
      correctIndex: 1,
      explanation: "Keep-Alive는 한 번 맺은 TCP 연결을 닫지 않고 재사용합니다. 이를 통해 매 요청마다 3-way handshake를 수행하는 오버헤드를 줄입니다.",
    },
    {
      id: "q4",
      question: "TCP가 UDP보다 느린 주된 이유는?",
      choices: [
        "TCP 헤더 크기가 더 크기 때문",
        "TCP는 연결 설정, 순서 보장, 재전송 등의 오버헤드가 있기 때문",
        "TCP는 암호화를 필수로 사용하기 때문",
        "TCP는 한 번에 하나의 패킷만 보낼 수 있기 때문",
      ],
      correctIndex: 1,
      explanation: "TCP는 3-way handshake, 시퀀스 번호 관리, ACK 대기, 재전송 등 신뢰성을 위한 추가 처리가 있어 UDP보다 느립니다.",
    },
    {
      id: "q5",
      question: "HTTP/3(QUIC)가 TCP 대신 UDP를 선택한 이유는?",
      choices: [
        "UDP가 더 안전하기 때문",
        "TCP의 헤드 오브 라인 블로킹을 해결하고 연결 설정을 빠르게 하기 위해",
        "UDP가 데이터를 압축하기 때문",
        "TCP가 더 이상 지원되지 않기 때문",
      ],
      correctIndex: 1,
      explanation: "QUIC은 UDP 위에 자체 신뢰성과 멀티플렉싱을 구현하여, TCP의 헤드 오브 라인 블로킹 문제를 해결하고 0-RTT 연결 설정을 지원합니다.",
    },
  ],
};

export default chapter;
