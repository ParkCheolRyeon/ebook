import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "07-https-tls",
  subject: "network",
  title: "HTTPS와 TLS",
  description: "HTTPS의 암호화 원리, TLS 핸드셰이크 과정, 인증서 체계, 그리고 프론트엔드에서 HTTPS가 필수인 이유를 학습합니다.",
  order: 7,
  group: "HTTP",
  prerequisites: ["04-http-basics"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "HTTPS는 **비밀 편지를 주고받는 시스템**과 같습니다.\n\n" +
        "**HTTP(평문 통신)**는 엽서를 보내는 것과 같습니다. 중간에 누구든 내용을 읽을 수 있습니다. 비밀번호, 신용카드 번호가 그대로 노출됩니다.\n\n" +
        "**HTTPS(암호화 통신)**는 다음과 같은 과정을 거칩니다:\n\n" +
        "1. **인증서 확인** — 상대방이 진짜 그 사람인지 확인합니다 (CA가 발급한 신분증)\n" +
        "2. **비대칭 암호화** — 서로 비밀 열쇠를 교환하기 위해, 먼저 공개된 자물쇠(공개키)로 비밀 메시지를 보냅니다\n" +
        "3. **대칭 암호화** — 교환된 비밀 열쇠(세션키)로 이후 모든 대화를 빠르게 암호화합니다\n\n" +
        "비유하면: 처음에는 **공개 자물쇠**로 비밀 열쇠를 안전하게 전달하고(느림), 이후에는 그 **비밀 열쇠**로 대화합니다(빠름). " +
        "이것이 비대칭 + 대칭 암호화의 조합입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 개발자에게 HTTPS가 중요한 이유:\n\n" +
        "1. **Service Worker**: HTTPS 환경에서만 등록 가능 (PWA의 필수 요소)\n" +
        "2. **Geolocation API**: HTTPS에서만 위치 정보 접근 가능\n" +
        "3. **카메라/마이크**: MediaDevices API는 HTTPS 필수\n" +
        "4. **클립보드 API**: Clipboard API도 Secure Context 필요\n" +
        "5. **HTTP/2**: 대부분의 브라우저가 HTTPS에서만 HTTP/2 지원\n" +
        "6. **SEO**: Google은 HTTPS 사이트를 검색 순위에서 우대\n" +
        "7. **Mixed Content**: HTTPS 페이지에서 HTTP 리소스 로드 시 차단\n\n" +
        "현대 웹 개발에서 HTTPS는 선택이 아닌 **필수**입니다. 로컬 개발(localhost) 이외에는 항상 HTTPS를 사용해야 합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 대칭 암호화 vs 비대칭 암호화\n\n" +
        "**대칭 암호화 (Symmetric)**:\n" +
        "- 암호화와 복호화에 **같은 키**를 사용합니다\n" +
        "- 빠르지만, 키를 안전하게 전달하는 것이 문제 (AES)\n\n" +
        "**비대칭 암호화 (Asymmetric)**:\n" +
        "- **공개키**(암호화)와 **개인키**(복호화)가 한 쌍입니다\n" +
        "- 공개키로 암호화한 데이터는 개인키로만 복호화 가능 (RSA, ECDSA)\n" +
        "- 느리지만, 키 교환 문제를 해결합니다\n\n" +
        "### TLS 핸드셰이크 (TLS 1.3 기준)\n\n" +
        "1. **Client Hello**: 클라이언트가 지원하는 암호 스위트, TLS 버전과 함께 **key_share 확장**(DH 공개값)을 전송\n" +
        "2. **Server Hello**: 서버가 선택한 암호 스위트와 **key_share**(서버 DH 공개값)를 응답하여 키 교환 완료. 이어서 인증서와 Finished 메시지 전송\n" +
        "3. **인증서 검증**: 클라이언트가 CA를 통해 서버 인증서의 유효성 확인\n" +
        "4. **암호화 시작**: 양측이 DH로 생성한 세션키로 대칭 암호화 통신 시작\n\n" +
        "TLS 1.2에서는 키 교환이 별도 메시지로 진행되어 2-RTT가 필요했지만, TLS 1.3은 Client Hello에 key_share를 포함시켜 **1-RTT**(왕복 1회)로 단축했습니다.\n\n" +
        "### 인증서 체계\n\n" +
        "- **CA (Certificate Authority)**: 인증서를 발급하는 신뢰 기관 (DigiCert, Let's Encrypt)\n" +
        "- **Let's Encrypt**: 무료 SSL 인증서 발급, 90일마다 자동 갱신\n" +
        "- **인증서 체인**: 서버 인증서 → 중간 CA → 루트 CA\n\n" +
        "### HSTS (HTTP Strict Transport Security)\n\n" +
        "`Strict-Transport-Security: max-age=31536000; includeSubDomains`\n\n" +
        "한번이라도 HTTPS로 접속하면, 이후에는 브라우저가 자동으로 HTTPS로 연결합니다. " +
        "HTTP로 접속을 시도해도 브라우저가 HTTPS로 리다이렉트합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: TLS 핸드셰이크 시뮬레이션",
      content:
        "TLS 핸드셰이크의 키 교환 과정을 의사코드로 이해합니다.",
      code: {
        language: "typescript",
        code:
          '// TLS 핸드셰이크를 의사코드로 시뮬레이션\n' +
          '\n' +
          'interface Certificate {\n' +
          '  subject: string;      // 도메인명\n' +
          '  issuer: string;       // CA 이름\n' +
          '  publicKey: string;    // 공개키\n' +
          '  validFrom: Date;\n' +
          '  validTo: Date;\n' +
          '  signature: string;    // CA의 서명\n' +
          '}\n' +
          '\n' +
          'interface TLSHandshakeResult {\n' +
          '  sessionKey: string;   // 대칭 암호화에 사용할 세션키\n' +
          '  cipherSuite: string;  // 선택된 암호 스위트\n' +
          '}\n' +
          '\n' +
          'class TLSClient {\n' +
          '  private trustedCAs: string[] = ["DigiCert", "Lets Encrypt", "GlobalSign"];\n' +
          '\n' +
          '  async performHandshake(serverHost: string): Promise<TLSHandshakeResult> {\n' +
          '    // 1단계: Client Hello (TLS 1.3에서는 key_share 확장으로 DH 공개값을 함께 전송)\n' +
          '    const clientHello = {\n' +
          '      tlsVersion: "TLS 1.3",\n' +
          '      supportedCiphers: ["TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256"],\n' +
          '      clientRandom: this.generateRandom(),\n' +
          '      keyShare: this.generateRandom(), // DH 공개값 (실제로는 ECDHE 키 교환)\n' +
          '    };\n' +
          '    console.log("[1] Client Hello 전송 (key_share 포함):", clientHello.tlsVersion);\n' +
          '\n' +
          '    // 2단계: Server Hello + 인증서 수신 (TLS 1.3: key_share로 키 교환이 여기서 완료)\n' +
          '    const serverHello = {\n' +
          '      selectedCipher: "TLS_AES_256_GCM_SHA384",\n' +
          '      serverRandom: this.generateRandom(),\n' +
          '      keyShare: this.generateRandom(), // 서버 DH 공개값 → 1-RTT 키 교환 완료\n' +
          '      certificate: {} as Certificate, // 서버로부터 수신\n' +
          '    };\n' +
          '    console.log("[2] Server Hello 수신 (key_share 포함, 키 교환 완료):", serverHello.selectedCipher);\n' +
          '\n' +
          '    // 3단계: 인증서 검증\n' +
          '    const isValid = this.verifyCertificate(serverHello.certificate, serverHost);\n' +
          '    if (!isValid) {\n' +
          '      throw new Error("인증서 검증 실패! 중간자 공격 가능성");\n' +
          '    }\n' +
          '    console.log("[3] 인증서 검증 완료");\n' +
          '\n' +
          '    // 4단계: 세션키 생성 (DH key_share로 이미 교환 완료, 여기서 키 유도)\n' +
          '    // 참고: 이 의사코드는 단순화된 것으로, 실제 ECDHE 키 교환 과정은 생략되어 있습니다\n' +
          '    const sessionKey = this.deriveSessionKey(\n' +
          '      clientHello.keyShare,\n' +
          '      serverHello.keyShare\n' +
          '    );\n' +
          '    console.log("[4] 세션키 생성 완료 → 암호화 통신 시작");\n' +
          '\n' +
          '    return { sessionKey, cipherSuite: serverHello.selectedCipher };\n' +
          '  }\n' +
          '\n' +
          '  private verifyCertificate(cert: Certificate, host: string): boolean {\n' +
          '    // 1) 도메인명 확인\n' +
          '    // 2) 유효 기간 확인\n' +
          '    // 3) CA 서명 확인 (신뢰할 수 있는 CA인지)\n' +
          '    return this.trustedCAs.includes(cert.issuer)\n' +
          '      && cert.subject === host\n' +
          '      && new Date() < cert.validTo;\n' +
          '  }\n' +
          '\n' +
          '  private generateRandom(): string { return crypto.randomUUID(); }\n' +
          '  private deriveSessionKey(a: string, b: string): string { return `session-${a}-${b}`; }\n' +
          '}',
        description: "TLS 1.3 핸드셰이크는 Client Hello에 key_share를 포함시켜 1-RTT로 완료합니다. 이 의사코드는 흐름을 단순화한 것으로, 실제 ECDHE 키 교환 세부사항은 생략되어 있습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: HTTPS 관련 프론트엔드 코드 패턴",
      content:
        "Secure Context 확인, Mixed Content 방지, HSTS 대응 등 실무에서 필요한 HTTPS 관련 코드를 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// 1. Secure Context 확인\n' +
          'function checkSecureContext(): boolean {\n' +
          '  if (!window.isSecureContext) {\n' +
          '    console.warn("이 페이지는 Secure Context가 아닙니다.");\n' +
          '    console.warn("Service Worker, Geolocation 등을 사용할 수 없습니다.");\n' +
          '    return false;\n' +
          '  }\n' +
          '  return true;\n' +
          '}\n' +
          '\n' +
          '// 2. Mixed Content 방지: HTTP URL을 HTTPS로 변환\n' +
          'function ensureHttps(url: string): string {\n' +
          '  if (url.startsWith("http://") && window.location.protocol === "https:") {\n' +
          '    console.warn("Mixed Content 방지: HTTP → HTTPS 변환:", url);\n' +
          '    return url.replace("http://", "https://");\n' +
          '  }\n' +
          '  return url;\n' +
          '}\n' +
          '\n' +
          '// 3. Secure Context가 필요한 API 안전하게 사용\n' +
          'async function getGeolocation(): Promise<GeolocationPosition | null> {\n' +
          '  if (!window.isSecureContext) {\n' +
          '    console.error("Geolocation은 HTTPS에서만 사용 가능합니다.");\n' +
          '    return null;\n' +
          '  }\n' +
          '\n' +
          '  return new Promise((resolve, reject) => {\n' +
          '    navigator.geolocation.getCurrentPosition(resolve, reject, {\n' +
          '      enableHighAccuracy: true,\n' +
          '      timeout: 5000,\n' +
          '    });\n' +
          '  });\n' +
          '}\n' +
          '\n' +
          '// 4. Service Worker 등록 (HTTPS 필수)\n' +
          'async function registerServiceWorker(): Promise<void> {\n' +
          '  if (!("serviceWorker" in navigator)) {\n' +
          '    console.warn("Service Worker를 지원하지 않는 브라우저입니다.");\n' +
          '    return;\n' +
          '  }\n' +
          '\n' +
          '  if (!window.isSecureContext) {\n' +
          '    console.error("Service Worker는 HTTPS에서만 등록 가능합니다.");\n' +
          '    return;\n' +
          '  }\n' +
          '\n' +
          '  try {\n' +
          '    const registration = await navigator.serviceWorker.register("/sw.js");\n' +
          '    console.log("Service Worker 등록 성공:", registration.scope);\n' +
          '  } catch (error) {\n' +
          '    console.error("Service Worker 등록 실패:", error);\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// 5. Web Crypto API로 데이터 해싱 (HTTPS 필수)\n' +
          'async function hashData(data: string): Promise<string> {\n' +
          '  const encoder = new TextEncoder();\n' +
          '  const dataBuffer = encoder.encode(data);\n' +
          '  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);\n' +
          '  const hashArray = Array.from(new Uint8Array(hashBuffer));\n' +
          '  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");\n' +
          '}',
        description: "Service Worker, Geolocation, Clipboard, Web Crypto 등 많은 웹 API가 Secure Context(HTTPS)를 요구합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### HTTPS = HTTP + TLS\n" +
        "- HTTP의 평문 통신에 TLS 암호화를 추가한 프로토콜입니다\n" +
        "- 비대칭 암호화로 키를 교환하고, 대칭 암호화로 데이터를 전송합니다\n\n" +
        "### TLS 핸드셰이크\n" +
        "- Client Hello → Server Hello + 인증서 → 인증서 검증 → 키 교환 → 암호화 시작\n" +
        "- TLS 1.3은 1-RTT로 핸드셰이크를 완료합니다\n\n" +
        "### 인증서\n" +
        "- CA(인증 기관)가 서버의 신원을 보증합니다\n" +
        "- Let's Encrypt로 무료 인증서를 발급받을 수 있습니다\n\n" +
        "### 프론트엔드에서 HTTPS가 필수인 이유\n" +
        "- Service Worker, Geolocation, 카메라/마이크, Clipboard API 등이 HTTPS 필수\n" +
        "- HTTP/2는 대부분 HTTPS에서만 지원\n" +
        "- Mixed Content(HTTPS 페이지의 HTTP 리소스)는 브라우저가 차단합니다\n\n" +
        "**다음 챕터 미리보기:** HTTP/2와 HTTP/3의 성능 개선 방식을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "HTTPS는 TLS 암호화를 통해 데이터를 보호하며, 비대칭 암호화로 키를 교환하고 대칭 암호화로 통신한다. Service Worker, Geolocation 등 현대 웹 API는 HTTPS가 필수이므로 프론트엔드 개발에서 HTTPS는 선택이 아닌 필수다.",
  checklist: [
    "대칭 암호화와 비대칭 암호화의 차이를 설명할 수 있다",
    "TLS 핸드셰이크의 과정을 이해한다",
    "인증서와 CA의 역할을 설명할 수 있다",
    "HTTPS가 필요한 웹 API(Service Worker, Geolocation 등)를 알고 있다",
    "Mixed Content 문제와 HSTS의 역할을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "HTTPS에서 실제 데이터 전송에 사용되는 암호화 방식은?",
      choices: [
        "비대칭 암호화 (RSA)",
        "대칭 암호화 (AES)",
        "해시 함수 (SHA-256)",
        "암호화를 사용하지 않는다",
      ],
      correctIndex: 1,
      explanation: "비대칭 암호화는 키 교환에만 사용하고, 실제 데이터 전송은 빠른 대칭 암호화(AES)를 사용합니다. 세션키라는 공유 비밀키로 암호화합니다.",
    },
    {
      id: "q2",
      question: "다음 중 HTTPS(Secure Context)에서만 사용 가능한 웹 API가 아닌 것은?",
      choices: ["Service Worker", "Geolocation", "fetch API", "Web Crypto"],
      correctIndex: 2,
      explanation: "fetch API는 HTTP에서도 사용 가능합니다. Service Worker, Geolocation, Web Crypto 등은 Secure Context(HTTPS 또는 localhost)에서만 사용 가능합니다.",
    },
    {
      id: "q3",
      question: "HSTS(HTTP Strict Transport Security)의 역할은?",
      choices: [
        "서버의 인증서를 검증한다",
        "한번 HTTPS로 접속하면 이후 브라우저가 자동으로 HTTPS로 접속하게 한다",
        "HTTP와 HTTPS를 동시에 지원하게 한다",
        "TLS 핸드셰이크를 건너뛰게 한다",
      ],
      correctIndex: 1,
      explanation: "HSTS 헤더를 받은 브라우저는 지정된 기간 동안 해당 도메인에 HTTP로 접속을 시도하더라도 자동으로 HTTPS로 변환합니다.",
    },
    {
      id: "q4",
      question: "Mixed Content란 무엇인가?",
      choices: [
        "HTTP와 HTTPS를 번갈아 사용하는 것",
        "HTTPS 페이지에서 HTTP 리소스를 로드하는 것",
        "다양한 Content-Type을 혼합 사용하는 것",
        "텍스트와 바이너리 데이터를 함께 전송하는 것",
      ],
      correctIndex: 1,
      explanation: "HTTPS 페이지에서 HTTP 리소스(이미지, 스크립트 등)를 로드하면 Mixed Content입니다. 브라우저는 보안을 위해 이를 차단하거나 경고합니다.",
    },
    {
      id: "q5",
      question: "TLS 1.3이 이전 버전(TLS 1.2)보다 개선된 점은?",
      choices: [
        "더 많은 암호 스위트를 지원한다",
        "핸드셰이크를 1-RTT로 단축하고 안전하지 않은 암호를 제거했다",
        "비대칭 암호화만 사용한다",
        "인증서가 필요 없다",
      ],
      correctIndex: 1,
      explanation: "TLS 1.3은 핸드셰이크를 1-RTT(왕복 1회)로 단축하고, 안전하지 않은 레거시 암호 스위트를 제거하여 보안과 성능을 모두 개선했습니다.",
    },
  ],
};

export default chapter;
