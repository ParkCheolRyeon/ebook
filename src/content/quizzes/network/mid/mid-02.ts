import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-02",
  title: "중간 점검 2: HTTP 진화 ~ 실시간 통신",
  coverGroups: ["HTTP 진화", "실시간 통신"],
  questions: [
    {
      id: "mid02-q1",
      question:
        "HTTP/1.1에서는 하나의 TCP 연결로 여러 리소스를 동시에 받을 수 없어 성능 문제가 있었다. HTTP/2가 이를 해결한 핵심 기술은?",
      choices: [
        "도메인 샤딩으로 여러 도메인에서 병렬 다운로드한다",
        "하나의 TCP 연결에서 여러 스트림을 동시에 주고받는 멀티플렉싱으로, Head-of-Line 블로킹을 해결하고 하나의 연결로 모든 리소스를 병렬 전송한다",
        "요청을 배치로 모아서 한 번에 보낸다",
        "서버가 클라이언트의 모든 요청을 예측하여 미리 응답한다",
      ],
      correctIndex: 1,
      explanation:
        "HTTP/2 멀티플렉싱은 하나의 TCP 연결에서 여러 스트림을 동시에 전송합니다. 각 스트림은 독립적이므로 하나가 느려도 다른 스트림에 영향을 주지 않아 HTTP/1.1의 HOL 블로킹 문제를 해결합니다.",
    },
    {
      id: "mid02-q2",
      question:
        "HTTP/3가 TCP 대신 QUIC(UDP 기반) 프로토콜을 사용하는 가장 큰 이유는?",
      choices: [
        "UDP가 TCP보다 보안이 더 강하기 때문이다",
        "TCP 계층의 HOL 블로킹을 제거하고, 0-RTT 연결 재개로 초기 연결 시간을 크게 줄이며, 네트워크 변경(Wi-Fi→셀룰러) 시에도 연결이 유지된다",
        "UDP는 패킷 크기 제한이 없기 때문이다",
        "HTTP/3는 암호화가 필요 없기 때문이다",
      ],
      correctIndex: 1,
      explanation:
        "HTTP/2는 TCP 위에서 동작하므로 패킷 손실 시 TCP 계층에서 HOL 블로킹이 발생합니다. QUIC은 UDP 위에 자체 신뢰성과 암호화를 구현하여 스트림별 독립 전송, 빠른 연결 설정(0-RTT), 연결 마이그레이션을 지원합니다.",
    },
    {
      id: "mid02-q3",
      question:
        "REST API를 설계할 때 리소스 URI 네이밍 규칙으로 가장 적절한 것은?",
      choices: [
        "/getUsers, /createUser, /deleteUser — 동사로 액션을 표현한다",
        "/users, /users/{id} — 복수 명사로 리소스를 표현하고 HTTP 메서드(GET, POST, DELETE)로 행위를 구분한다",
        "/user/1/get, /user/1/update — 경로에 동사와 ID를 혼합한다",
        "/api?action=getUser&id=1 — 쿼리 파라미터로 모든 것을 처리한다",
      ],
      correctIndex: 1,
      explanation:
        "REST에서 URI는 리소스를 나타내므로 명사(복수형)를 사용합니다. 행위는 HTTP 메서드로 구분합니다. GET /users(목록), POST /users(생성), GET /users/1(조회), PUT /users/1(수정), DELETE /users/1(삭제).",
    },
    {
      id: "mid02-q4",
      question:
        "REST API에서 리소스의 부분 수정을 위해 가장 적절한 HTTP 메서드와 URI 설계는?",
      choices: [
        "POST /users/1/update — 업데이트 전용 엔드포인트를 만든다",
        "PATCH /users/1 — 변경할 필드만 본문에 담아 부분 수정하며, PUT과 달리 전체 리소스를 보내지 않아도 된다",
        "GET /users/1?name=new — 쿼리 파라미터로 수정한다",
        "DELETE /users/1 후 POST /users로 다시 생성한다",
      ],
      correctIndex: 1,
      explanation:
        "PATCH는 리소스의 부분 수정에 사용합니다. PUT은 리소스 전체를 대체하므로 모든 필드를 보내야 하지만, PATCH는 변경할 필드만 보내면 됩니다. 이름만 바꾸고 싶을 때 PATCH /users/1 { \"name\": \"new\" }가 적절합니다.",
    },
    {
      id: "mid02-q5",
      question:
        "실시간 채팅 애플리케이션을 구축할 때, WebSocket과 SSE(Server-Sent Events) 중 WebSocket을 선택해야 하는 이유는?",
      choices: [
        "WebSocket이 구현이 더 간단하기 때문이다",
        "채팅은 클라이언트와 서버 양방향 통신이 필요하므로, 단방향(서버→클라이언트)인 SSE 대신 양방향 전이중 통신을 지원하는 WebSocket이 적합하다",
        "SSE는 텍스트 데이터를 전송할 수 없기 때문이다",
        "WebSocket은 HTTP 프로토콜을 사용하지 않기 때문이다",
      ],
      correctIndex: 1,
      explanation:
        "WebSocket은 초기 HTTP 핸드셰이크 후 TCP 연결을 업그레이드하여 양방향 전이중 통신을 지원합니다. 채팅처럼 클라이언트도 메시지를 보내야 하는 경우 WebSocket이 적합합니다. SSE는 주가, 알림 등 서버→클라이언트 단방향에 적합합니다.",
    },
    {
      id: "mid02-q6",
      question:
        "WebSocket 연결이 네트워크 불안정으로 끊어졌을 때, 프론트엔드에서 구현해야 하는 재연결 전략으로 가장 적절한 것은?",
      choices: [
        "페이지를 새로고침한다",
        "지수 백오프(exponential backoff)로 재연결을 시도하고, 최대 재시도 횟수를 설정하며, 재연결 시 마지막으로 받은 메시지 ID를 서버에 전달하여 놓친 메시지를 복구한다",
        "일정 간격(1초)으로 무한히 재연결을 시도한다",
        "사용자에게 수동으로 재연결 버튼을 누르게 한다",
      ],
      correctIndex: 1,
      explanation:
        "지수 백오프(1초 → 2초 → 4초...)는 서버 부하를 줄이면서 재연결합니다. 최대 재시도 제한으로 무한 루프를 방지하고, 마지막 메시지 ID를 전달하면 연결이 끊긴 동안의 메시지를 서버에서 재전송받을 수 있습니다.",
    },
    {
      id: "mid02-q7",
      question:
        "EventSource API를 사용하여 SSE를 구현할 때의 장점과 제약 사항을 올바르게 설명한 것은?",
      choices: [
        "EventSource는 바이너리 데이터 전송이 가능하다",
        "EventSource는 자동 재연결과 이벤트 ID 추적을 내장하고 있어 구현이 간단하지만, 텍스트 데이터만 전송 가능하고 HTTP/1.1에서 브라우저당 도메인별 연결 수 제한(6개)이 있다",
        "EventSource는 양방향 통신을 지원한다",
        "EventSource는 모든 브라우저에서 지원되지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "EventSource는 SSE의 브라우저 API로, 연결 끊김 시 자동 재연결과 Last-Event-ID 헤더를 통한 메시지 복구를 내장합니다. 단, 텍스트(UTF-8)만 전송 가능하고, HTTP/1.1에서 도메인당 연결 수 제한이 있어 많은 SSE 스트림에는 HTTP/2가 권장됩니다.",
    },
    {
      id: "mid02-q8",
      question:
        "페이지에서 사용자 프로필과 해당 사용자의 게시물, 팔로워 수를 한 번에 보여줘야 한다. REST API 대비 GraphQL이 유리한 이유는?",
      choices: [
        "GraphQL이 REST보다 서버 성능이 좋기 때문이다",
        "REST는 /users/1, /users/1/posts, /users/1/followers 등 여러 엔드포인트를 호출해야 하지만, GraphQL은 하나의 쿼리로 필요한 필드만 정확히 요청하여 오버페칭과 언더페칭을 방지한다",
        "GraphQL은 캐싱이 더 쉽기 때문이다",
        "REST는 JSON 응답을 지원하지 않기 때문이다",
      ],
      correctIndex: 1,
      explanation:
        "오버페칭은 불필요한 데이터를 받는 것, 언더페칭은 필요한 데이터를 위해 여러 번 요청하는 것입니다. GraphQL은 클라이언트가 필요한 필드를 쿼리에 명시하므로, 하나의 요청으로 정확한 데이터를 받을 수 있습니다.",
    },
    {
      id: "mid02-q9",
      question:
        "GraphQL과 REST 중 선택할 때 고려해야 할 사항으로 올바르지 않은 것은?",
      choices: [
        "REST는 HTTP 캐싱(CDN, 브라우저)을 자연스럽게 활용할 수 있다",
        "GraphQL은 항상 REST보다 성능이 우수하므로 모든 프로젝트에서 GraphQL을 사용해야 한다",
        "GraphQL은 프론트엔드가 다양한 화면에서 다른 데이터 조합이 필요할 때 유연하다",
        "REST는 단순한 CRUD API에 적합하고 학습 곡선이 낮다",
      ],
      correctIndex: 1,
      explanation:
        "GraphQL이 항상 우수하지는 않습니다. REST는 HTTP 캐싱을 자연스럽게 활용하고, 단순한 CRUD에 적합하며 도구 생태계가 넓습니다. GraphQL은 복잡한 데이터 요구사항, 다양한 클라이언트(웹/앱)가 있을 때 유리합니다.",
    },
    {
      id: "mid02-q10",
      question:
        "주식 시세를 실시간으로 대시보드에 표시해야 한다. 가장 적절한 실시간 통신 방식은?",
      choices: [
        "setInterval로 1초마다 REST API를 폴링한다",
        "SSE(Server-Sent Events)를 사용하여 서버가 시세 변동 시 클라이언트에 이벤트를 푸시한다. 클라이언트가 데이터를 보낼 필요가 없고, 자동 재연결이 내장되어 있어 적합하다",
        "WebSocket으로 양방향 연결을 유지한다",
        "Long Polling으로 서버 응답을 기다린다",
      ],
      correctIndex: 1,
      explanation:
        "주식 시세는 서버→클라이언트 단방향 데이터 흐름이므로 SSE가 적합합니다. SSE는 자동 재연결, 이벤트 ID 추적을 내장하고 있어 구현이 간단합니다. 폴링은 불필요한 요청이 많고, WebSocket은 양방향이 필요 없는 경우 과도합니다.",
    },
  ],
};

export default midQuiz;
