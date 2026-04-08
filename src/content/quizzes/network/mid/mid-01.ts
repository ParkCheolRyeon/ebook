import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-01",
  title: "중간 점검 1: 네트워크 기초 ~ HTTP",
  coverGroups: ["네트워크 기초", "HTTP"],
  questions: [
    {
      id: "mid01-q1",
      question:
        "브라우저에서 웹 페이지를 요청할 때 데이터가 거치는 계층을 OSI 7계층 기준으로 올바르게 나열한 것은?",
      choices: [
        "물리 → 네트워크 → 전송 → 응용",
        "응용(HTTP) → 전송(TCP) → 네트워크(IP) → 데이터 링크 → 물리 순서로 캡슐화되어 전송된다",
        "응용 → 물리 → 전송 → 네트워크",
        "전송 → 응용 → 네트워크 → 물리",
      ],
      correctIndex: 1,
      explanation:
        "OSI 모델에서 데이터를 보낼 때는 응용 계층에서 시작하여 아래로 내려가며 각 계층의 헤더가 추가(캡슐화)됩니다. HTTP(응용) → TCP(전송) → IP(네트워크) → 이더넷(데이터 링크) → 물리 순서입니다.",
    },
    {
      id: "mid01-q2",
      question:
        "사용자가 브라우저 주소창에 www.example.com을 입력했을 때, DNS 확인 과정의 올바른 순서는?",
      choices: [
        "루트 DNS → TLD DNS → 권한 DNS → 브라우저 캐시",
        "브라우저 캐시 → OS 캐시 → 로컬 DNS 리졸버 → 루트 DNS → TLD(.com) DNS → 권한(authoritative) DNS 순서로 조회한다",
        "브라우저가 직접 IP 주소를 생성한다",
        "ISP가 모든 도메인의 IP를 저장하고 있어 한 번에 조회된다",
      ],
      correctIndex: 1,
      explanation:
        "DNS 확인은 가까운 캐시부터 확인합니다. 브라우저 캐시 → OS 캐시 → 로컬 DNS 리졸버(ISP) → 루트 DNS → TLD DNS(.com) → 권한 DNS 서버 순서로 재귀적/반복적 질의를 수행하여 최종 IP 주소를 얻습니다.",
    },
    {
      id: "mid01-q3",
      question:
        "TCP 3-way handshake의 각 단계에서 교환되는 패킷과 그 목적을 올바르게 설명한 것은?",
      choices: [
        "클라이언트가 데이터를 보내면 서버가 응답하고 연결이 성립된다",
        "SYN → SYN-ACK → ACK 순서로, 클라이언트가 연결 요청(SYN)을 보내고 서버가 수락 및 자신의 연결 요청(SYN-ACK)을 보내면 클라이언트가 확인(ACK)하여 양방향 연결이 수립된다",
        "ACK → SYN → SYN-ACK 순서로 진행된다",
        "클라이언트와 서버가 동시에 SYN을 보내면 연결된다",
      ],
      correctIndex: 1,
      explanation:
        "TCP 3-way handshake는 SYN → SYN-ACK → ACK 순서입니다. 이 과정을 통해 양쪽이 시퀀스 번호를 교환하고 상대방의 수신 능력을 확인하여 신뢰할 수 있는 양방향 연결을 수립합니다.",
    },
    {
      id: "mid01-q4",
      question:
        "실시간 비디오 스트리밍 서비스를 구축할 때 UDP를 TCP보다 선호하는 이유로 가장 적절한 것은?",
      choices: [
        "UDP가 TCP보다 보안이 더 강력하기 때문이다",
        "UDP는 연결 설정과 재전송 오버헤드가 없어 지연이 적고, 영상에서 일부 패킷 손실은 허용 가능하므로 실시간성이 중요한 스트리밍에 적합하다",
        "UDP는 데이터 순서를 보장하기 때문이다",
        "TCP는 영상 데이터를 전송할 수 없기 때문이다",
      ],
      correctIndex: 1,
      explanation:
        "UDP는 비연결형 프로토콜로 3-way handshake나 패킷 재전송이 없어 지연이 적습니다. 실시간 영상에서는 프레임 하나를 놓치는 것보다 지연이 더 큰 문제이므로, 약간의 패킷 손실을 허용하고 빠른 전송을 우선하는 UDP가 적합합니다.",
    },
    {
      id: "mid01-q5",
      question:
        "HTTP 요청/응답 메시지의 구조를 올바르게 설명한 것은?",
      choices: [
        "요청은 URL만으로 구성되고 응답은 본문만 포함한다",
        "요청은 시작 줄(메서드, URL, 버전) + 헤더 + 빈 줄 + 본문으로 구성되며, 응답은 상태 줄(버전, 상태 코드, 사유) + 헤더 + 빈 줄 + 본문으로 구성된다",
        "HTTP 메시지는 바이너리 형식으로만 전송된다",
        "요청과 응답의 구조는 동일하며 구분할 수 없다",
      ],
      correctIndex: 1,
      explanation:
        "HTTP/1.1 메시지는 텍스트 기반입니다. 요청의 시작 줄은 'GET /path HTTP/1.1' 형태이고, 응답의 상태 줄은 'HTTP/1.1 200 OK' 형태입니다. 둘 다 헤더와 빈 줄 이후 선택적 본문이 따릅니다.",
    },
    {
      id: "mid01-q6",
      question:
        "다음 HTTP 메서드 중 멱등(idempotent)하지 않은 것은?",
      choices: [
        "GET — 같은 요청을 여러 번 보내도 결과가 동일하다",
        "PUT — 같은 데이터로 여러 번 요청해도 리소스 상태가 동일하다",
        "DELETE — 이미 삭제된 리소스에 다시 요청해도 상태가 변하지 않는다",
        "POST — 같은 요청을 여러 번 보내면 리소스가 중복 생성될 수 있다",
      ],
      correctIndex: 3,
      explanation:
        "멱등성은 동일한 요청을 여러 번 수행해도 결과가 같음을 의미합니다. GET, PUT, DELETE는 멱등하지만, POST는 요청할 때마다 새 리소스를 생성할 수 있어 멱등하지 않습니다. 결제 API에서 POST 중복 요청 방지가 중요한 이유입니다.",
    },
    {
      id: "mid01-q7",
      question:
        "API 서버에서 클라이언트의 요청을 처리했지만 응답할 데이터가 없을 때 반환해야 하는 가장 적절한 HTTP 상태 코드는?",
      choices: [
        "200 OK — 성공했으므로 200을 반환한다",
        "204 No Content — 요청은 성공했지만 응답 본문이 없음을 나타낸다",
        "404 Not Found — 데이터가 없으므로 404를 반환한다",
        "500 Internal Server Error — 서버 에러로 처리한다",
      ],
      correctIndex: 1,
      explanation:
        "204 No Content는 요청이 성공했지만 반환할 본문이 없을 때 사용합니다. DELETE 성공이나 PUT으로 업데이트 후 본문을 반환하지 않을 때 적합합니다. 404는 리소스 자체가 존재하지 않을 때 사용합니다.",
    },
    {
      id: "mid01-q8",
      question:
        "프론트엔드에서 API 응답을 캐싱하려 한다. Cache-Control 헤더의 'no-cache'와 'no-store'의 차이점은?",
      choices: [
        "두 값은 동일하며 캐시를 완전히 비활성화한다",
        "no-cache는 캐시에 저장하되 사용 전 서버에 재검증을 요청하고, no-store는 캐시에 아예 저장하지 않는다",
        "no-cache는 캐시를 영구 저장하고, no-store는 1시간만 캐시한다",
        "no-cache는 서버 측 캐시만, no-store는 클라이언트 측 캐시만 제어한다",
      ],
      correctIndex: 1,
      explanation:
        "no-cache는 '캐시하지 마'가 아니라 '사용 전에 반드시 서버에 확인하라'는 의미입니다. 캐시에 저장은 하되 매번 재검증합니다. no-store는 민감한 데이터에 사용하며 캐시에 저장 자체를 금지합니다.",
    },
    {
      id: "mid01-q9",
      question:
        "HTTPS가 HTTP보다 안전한 이유와 TLS 핸드셰이크의 핵심 목적을 올바르게 설명한 것은?",
      choices: [
        "HTTPS는 URL을 암호화하여 서버 주소를 숨긴다",
        "TLS 핸드셰이크를 통해 서버 인증서를 검증하고 대칭 키를 안전하게 교환하여, 이후 통신을 암호화하고 중간자 공격을 방지한다",
        "HTTPS는 HTTP보다 전송 속도가 빠르다",
        "TLS는 데이터 압축만 수행한다",
      ],
      correctIndex: 1,
      explanation:
        "TLS 핸드셰이크는 서버의 인증서로 신원을 검증하고, 비대칭 암호화로 대칭 키를 안전하게 교환합니다. 이후 실제 데이터는 대칭 키로 빠르게 암호화하여 기밀성, 무결성, 인증을 보장합니다.",
    },
    {
      id: "mid01-q10",
      question:
        "브라우저가 HTTPS 접속 시 서버 인증서를 신뢰하는 과정에서 '인증서 체인'이 필요한 이유는?",
      choices: [
        "인증서가 하나면 암호화가 약하기 때문이다",
        "서버 인증서 → 중간 CA 인증서 → 루트 CA 인증서로 이어지는 체인을 통해, 브라우저에 내장된 신뢰할 수 있는 루트 CA까지 서명을 검증하여 서버의 신원을 보장한다",
        "인증서 체인이 길수록 보안이 강화된다",
        "루트 CA가 직접 모든 서버에 인증서를 발급하기 때문이다",
      ],
      correctIndex: 1,
      explanation:
        "인증서 체인은 신뢰의 연결 고리입니다. 서버 인증서는 중간 CA가 서명하고, 중간 CA 인증서는 루트 CA가 서명합니다. 브라우저는 내장된 루트 CA 목록으로 체인 전체를 검증하여 서버가 정당한지 확인합니다.",
    },
  ],
};

export default midQuiz;
