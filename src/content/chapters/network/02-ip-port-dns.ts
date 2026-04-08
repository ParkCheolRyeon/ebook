import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "02-ip-port-dns",
  subject: "network",
  title: "IP 주소, 포트, DNS",
  description: "인터넷 통신의 핵심 주소 체계인 IP, 포트 번호, DNS의 동작 원리를 학습합니다.",
  order: 2,
  group: "네트워크 기초",
  prerequisites: ["01-osi-tcpip"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "인터넷 주소 체계는 **아파트 우편 시스템**과 같습니다.\n\n" +
        "**IP 주소**는 아파트 건물의 **도로명 주소**입니다. `192.168.1.1`처럼 숫자로 된 주소를 통해 특정 컴퓨터(건물)를 찾아갑니다.\n\n" +
        "**포트 번호**는 아파트의 **호수**입니다. 같은 건물(IP)이라도 101호(웹 서버, 포트 80), 102호(메일 서버, 포트 25), 103호(개발 서버, 포트 3000)처럼 서로 다른 서비스가 동작합니다.\n\n" +
        "**DNS**는 **전화번호부**입니다. 우리가 `google.com`이라는 이름을 알면, DNS가 그에 대응하는 IP 주소(숫자 주소)를 찾아줍니다. 사람은 이름을 기억하고, 컴퓨터는 숫자를 사용합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 개발자가 IP, 포트, DNS를 알아야 하는 이유는 무엇일까요?\n\n" +
        "다음과 같은 상황을 겪어본 적이 있을 것입니다:\n\n" +
        "1. **localhost:3000과 localhost:8080** — 왜 같은 컴퓨터인데 다른 주소를 쓰는 걸까?\n" +
        "2. **EADDRINUSE 에러** — 포트가 이미 사용 중이라니, 어떻게 해결하지?\n" +
        "3. **DNS_PROBE_FINISHED_NXDOMAIN** — 도메인은 맞는데 왜 접속이 안 되지?\n" +
        "4. **127.0.0.1과 0.0.0.0의 차이** — 개발 서버를 외부에서 접근하려면?\n" +
        "5. **IPv6 주소** — `::1`이 뭔지, 왜 점점 보이기 시작하는지?\n\n" +
        "이 모든 것이 IP, 포트, DNS에 대한 이해 부족에서 옵니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### IP 주소\n\n" +
        "**IPv4**: 32비트, `192.168.1.1` 형태. 약 43억 개의 주소를 표현할 수 있지만 거의 고갈되었습니다.\n\n" +
        "**IPv6**: 128비트, `2001:0db8:85a3::8a2e:0370:7334` 형태. 사실상 무한한 주소를 제공합니다.\n\n" +
        "프론트엔드 개발에서 자주 만나는 특수 IP 주소:\n" +
        "- `127.0.0.1` (localhost): 자기 자신을 가리키는 루프백 주소\n" +
        "- `0.0.0.0`: 모든 네트워크 인터페이스 (개발 서버를 외부에 공개할 때)\n" +
        "- `192.168.x.x`, `10.x.x.x`: 사설 IP 주소 (로컬 네트워크)\n\n" +
        "### 포트 번호\n\n" +
        "포트는 0~65535 범위의 숫자이며, 하나의 IP에서 여러 서비스를 구분합니다:\n" +
        "- **80**: HTTP 기본 포트\n" +
        "- **443**: HTTPS 기본 포트\n" +
        "- **3000**: React 개발 서버 기본 포트\n" +
        "- **8080**: 프록시/대체 HTTP 서버\n" +
        "- **5173**: Vite 개발 서버 기본 포트\n\n" +
        "### DNS (Domain Name System)\n\n" +
        "DNS 조회 과정:\n" +
        "1. **브라우저 캐시** 확인 → 2. **OS 캐시** 확인 (/etc/hosts) → 3. **로컬 DNS 서버** 질의 → 4. **루트 DNS** → **TLD DNS** (.com) → **권한 DNS** → IP 반환\n\n" +
        "주요 DNS 레코드 타입:\n" +
        "- **A 레코드**: 도메인 → IPv4 주소\n" +
        "- **AAAA 레코드**: 도메인 → IPv6 주소\n" +
        "- **CNAME**: 도메인 → 다른 도메인 (별칭)\n" +
        "- **TXT**: 도메인 소유권 인증, SPF 등에 사용",
    },
    {
      type: "pseudocode",
      title: "기술 구현: DNS 조회 과정 시뮬레이션",
      content:
        "DNS가 도메인 이름을 IP 주소로 변환하는 과정을 의사코드로 표현합니다.",
      code: {
        language: "typescript",
        code:
          '// DNS 조회 과정을 의사코드로 표현\n' +
          '\n' +
          'interface DNSRecord {\n' +
          '  domain: string;\n' +
          '  type: "A" | "AAAA" | "CNAME" | "TXT";\n' +
          '  value: string;\n' +
          '  ttl: number; // Time To Live (캐시 유지 시간, 초)\n' +
          '}\n' +
          '\n' +
          '// DNS 캐시 계층 시뮬레이션\n' +
          'class DNSResolver {\n' +
          '  private browserCache: Map<string, DNSRecord> = new Map();\n' +
          '  private osCache: Map<string, DNSRecord> = new Map();\n' +
          '\n' +
          '  async resolve(domain: string): Promise<string> {\n' +
          '    // 1단계: 브라우저 캐시 확인\n' +
          '    const browserResult = this.browserCache.get(domain);\n' +
          '    if (browserResult) {\n' +
          '      console.log("브라우저 캐시 히트:", browserResult.value);\n' +
          '      return browserResult.value;\n' +
          '    }\n' +
          '\n' +
          '    // 2단계: OS 캐시 확인 (/etc/hosts 포함)\n' +
          '    const osResult = this.osCache.get(domain);\n' +
          '    if (osResult) {\n' +
          '      console.log("OS 캐시 히트:", osResult.value);\n' +
          '      return osResult.value;\n' +
          '    }\n' +
          '\n' +
          '    // 3단계: 재귀적 DNS 질의\n' +
          '    // 로컬 DNS → 루트 DNS → TLD DNS → 권한 DNS\n' +
          '    console.log("외부 DNS 서버에 질의:", domain);\n' +
          '    const ip = await this.queryExternalDNS(domain);\n' +
          '\n' +
          '    // 4단계: 캐시에 저장\n' +
          '    this.browserCache.set(domain, {\n' +
          '      domain, type: "A", value: ip, ttl: 300\n' +
          '    });\n' +
          '\n' +
          '    return ip;\n' +
          '  }\n' +
          '\n' +
          '  private async queryExternalDNS(domain: string): Promise<string> {\n' +
          '    // 실제로는 루트 → TLD → 권한 DNS 순서로 질의\n' +
          '    return "93.184.216.34"; // 예시 IP\n' +
          '  }\n' +
          '}',
        description: "DNS는 브라우저 캐시 → OS 캐시 → 외부 DNS 서버 순으로 도메인을 조회합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 개발 환경에서 IP와 포트 다루기",
      content:
        "프론트엔드 개발 시 자주 마주치는 IP, 포트, DNS 관련 코드를 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// 1. URL 객체로 호스트, 포트, 프로토콜 파싱하기\n' +
          'function parseURL(urlString: string) {\n' +
          '  const url = new URL(urlString);\n' +
          '  return {\n' +
          '    protocol: url.protocol, // "https:"\n' +
          '    hostname: url.hostname, // "api.example.com"\n' +
          '    port: url.port || (url.protocol === "https:" ? "443" : "80"),\n' +
          '    pathname: url.pathname, // "/users"\n' +
          '    search: url.search,     // "?page=1"\n' +
          '    origin: url.origin,     // "https://api.example.com"\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          'console.log(parseURL("https://api.example.com:8443/users?page=1"));\n' +
          '// { protocol: "https:", hostname: "api.example.com", port: "8443", ... }\n' +
          '\n' +
          '// 2. 환경별 API 베이스 URL 설정\n' +
          'function getApiBaseUrl(): string {\n' +
          '  const env = import.meta.env.MODE;\n' +
          '  switch (env) {\n' +
          '    case "development":\n' +
          '      return "http://localhost:8080/api"; // 로컬 백엔드\n' +
          '    case "staging":\n' +
          '      return "https://staging-api.example.com/api";\n' +
          '    case "production":\n' +
          '      return "https://api.example.com/api";\n' +
          '    default:\n' +
          '      return "http://localhost:8080/api";\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// 3. DNS prefetch로 외부 도메인 미리 조회\n' +
          '// HTML의 <head>에 추가하면 DNS 조회를 미리 수행합니다\n' +
          'function addDnsPrefetch(domain: string): void {\n' +
          '  const link = document.createElement("link");\n' +
          '  link.rel = "dns-prefetch";\n' +
          '  link.href = `//${domain}`;\n' +
          '  document.head.appendChild(link);\n' +
          '}\n' +
          '\n' +
          '// 외부 API, CDN 등의 DNS를 미리 조회\n' +
          'addDnsPrefetch("api.example.com");\n' +
          'addDnsPrefetch("cdn.example.com");\n' +
          'addDnsPrefetch("fonts.googleapis.com");',
        description: "URL 객체, 환경별 API 설정, DNS prefetch 등 프론트엔드에서 자주 사용하는 네트워크 주소 관련 패턴입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### IP 주소\n" +
        "- IPv4(32비트)는 고갈 중이며, IPv6(128비트)로 전환이 진행 중입니다\n" +
        "- `127.0.0.1`은 자기 자신, `0.0.0.0`은 모든 인터페이스를 의미합니다\n\n" +
        "### 포트 번호\n" +
        "- 하나의 IP에서 여러 서비스를 구분하는 논리적 번호(0~65535)\n" +
        "- 웹 개발에서 80(HTTP), 443(HTTPS), 3000/5173(개발 서버)을 가장 많이 사용합니다\n\n" +
        "### DNS\n" +
        "- 도메인 이름을 IP 주소로 변환하는 시스템입니다\n" +
        "- 브라우저 캐시 → OS 캐시 → DNS 서버 순으로 조회합니다\n" +
        "- A 레코드(IPv4), CNAME(별칭), AAAA(IPv6) 등의 레코드 타입이 있습니다\n" +
        "- `/etc/hosts` 파일로 로컬에서 DNS를 오버라이드할 수 있습니다\n\n" +
        "**다음 챕터 미리보기:** TCP와 UDP의 차이점, 그리고 웹 통신에서 TCP가 신뢰성을 보장하는 방법을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "IP 주소는 컴퓨터의 위치, 포트는 서비스의 문 번호, DNS는 이름을 주소로 바꿔주는 전화번호부다. 프론트엔드 개발자는 localhost, 포트 충돌, DNS prefetch 등을 통해 이 개념들을 매일 사용한다.",
  checklist: [
    "IPv4와 IPv6의 차이점을 설명할 수 있다",
    "127.0.0.1과 0.0.0.0의 차이를 이해한다",
    "DNS 조회 과정(브라우저 캐시 → OS → DNS 서버)을 설명할 수 있다",
    "A 레코드, CNAME, AAAA 레코드의 용도를 안다",
    "포트 번호의 역할과 웹 개발에서 자주 사용하는 포트를 알고 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "localhost가 가리키는 IP 주소는?",
      choices: ["0.0.0.0", "127.0.0.1", "192.168.0.1", "255.255.255.255"],
      correctIndex: 1,
      explanation: "localhost는 127.0.0.1(루프백 주소)로, 자기 자신의 컴퓨터를 가리킵니다. 0.0.0.0은 모든 네트워크 인터페이스를 의미합니다.",
    },
    {
      id: "q2",
      question: "HTTPS의 기본 포트 번호는?",
      choices: ["80", "443", "3000", "8080"],
      correctIndex: 1,
      explanation: "HTTPS는 443번 포트를 기본으로 사용합니다. HTTP는 80번 포트를 사용합니다.",
    },
    {
      id: "q3",
      question: "DNS에서 도메인을 다른 도메인의 별칭으로 설정하는 레코드 타입은?",
      choices: ["A 레코드", "AAAA 레코드", "CNAME 레코드", "TXT 레코드"],
      correctIndex: 2,
      explanation: "CNAME(Canonical Name) 레코드는 한 도메인을 다른 도메인의 별칭으로 설정합니다. 예: www.example.com → example.com",
    },
    {
      id: "q4",
      question: "개발 서버를 같은 네트워크의 다른 기기(모바일 등)에서 접근하려면 어떤 호스트로 실행해야 하는가?",
      choices: ["127.0.0.1", "localhost", "0.0.0.0", "255.255.255.0"],
      correctIndex: 2,
      explanation: "0.0.0.0으로 서버를 실행하면 모든 네트워크 인터페이스에서 접근 가능합니다. 127.0.0.1이나 localhost는 자기 자신만 접근할 수 있습니다.",
    },
    {
      id: "q5",
      question: "DNS 조회 시 가장 먼저 확인하는 캐시는?",
      choices: ["OS 캐시", "브라우저 캐시", "로컬 DNS 서버 캐시", "루트 DNS 서버"],
      correctIndex: 1,
      explanation: "DNS 조회는 브라우저 캐시 → OS 캐시(/etc/hosts 포함) → 로컬 DNS 서버 → 루트 DNS 순으로 진행됩니다.",
    },
  ],
};

export default chapter;
