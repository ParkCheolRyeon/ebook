import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "10-websocket",
  subject: "network",
  title: "WebSocket",
  description:
    "WebSocket 프로토콜의 동작 원리를 이해하고, 브라우저 WebSocket API 사용법, 재연결 전략, 실시간 통신 패턴과 Socket.IO 활용법을 학습합니다.",
  order: 10,
  group: "실시간 통신",
  prerequisites: ["04-http-basics"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "HTTP와 WebSocket의 차이를 **전화 통화**에 비유해봅시다.\n\n" +
        "**HTTP = 편지 왕래**\n" +
        "질문이 있을 때마다 편지를 보내고(요청), 답장을 기다립니다(응답). " +
        "매번 봉투에 주소를 쓰고 우체국을 거쳐야 합니다. " +
        "상대방이 먼저 연락할 수 없고, 항상 내가 먼저 편지를 보내야 답이 옵니다.\n\n" +
        "**WebSocket = 전화 통화**\n" +
        "처음에 전화를 겁니다(핸드셰이크). 연결이 되면 양쪽 모두 자유롭게 말할 수 있습니다. " +
        "상대방이 먼저 말을 걸 수도 있고, 동시에 대화할 수도 있습니다(전이중 통신). " +
        "통화가 끝날 때까지 회선이 유지됩니다.\n\n" +
        "**ws:// vs wss://**\n" +
        "- `ws://` = 일반 전화 (도청 가능)\n" +
        "- `wss://` = 암호화된 보안 전화 (TLS로 보호)\n\n" +
        "**Socket.IO = 스마트폰 통화 앱**\n" +
        "기본 전화(WebSocket) 위에 자동 재연결, 방(Room) 기능, " +
        "오프라인 메시지 대기열 같은 편의 기능을 추가한 앱입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드에서 실시간 기능을 구현할 때 다음 문제에 직면합니다:\n\n" +
        "### HTTP의 한계\n" +
        "- **단방향 통신**: 클라이언트만 요청을 보낼 수 있고, 서버가 먼저 데이터를 보낼 수 없습니다.\n" +
        "- **폴링의 비효율**: 새 데이터를 확인하기 위해 주기적으로 요청을 보내면 불필요한 트래픽이 발생합니다.\n" +
        "- **롱 폴링의 복잡성**: 서버가 응답을 지연시키는 방식은 타임아웃 관리와 연결 유지가 어렵습니다.\n\n" +
        "### 실시간 기능 요구사항\n" +
        "- **채팅**: 메시지를 즉시 수신해야 합니다.\n" +
        "- **실시간 협업**: 여러 사용자가 동시에 문서를 편집할 때 변경 사항을 즉시 반영해야 합니다.\n" +
        "- **라이브 데이터**: 주식 가격, 스포츠 점수 등이 실시간으로 업데이트되어야 합니다.\n" +
        "- **알림**: 서버에서 발생한 이벤트를 즉시 클라이언트에 알려야 합니다.\n\n" +
        "### 연결 안정성\n" +
        "- 네트워크 불안정 시 연결이 끊어지면 어떻게 복구할지\n" +
        "- 재연결 시 놓친 메시지를 어떻게 처리할지\n" +
        "- 수천 개의 동시 연결을 서버가 어떻게 관리할지",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### WebSocket 프로토콜\n\n" +
        "**1. 핸드셰이크 (HTTP Upgrade)**\n" +
        "WebSocket 연결은 HTTP 요청으로 시작합니다:\n" +
        "```\n" +
        "GET /chat HTTP/1.1\n" +
        "Upgrade: websocket\n" +
        "Connection: Upgrade\n" +
        "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\n" +
        "Sec-WebSocket-Version: 13\n" +
        "```\n" +
        "서버가 101 Switching Protocols로 응답하면 WebSocket 연결이 수립됩니다.\n\n" +
        "**2. 전이중 통신 (Full-Duplex)**\n" +
        "연결이 수립되면 클라이언트와 서버가 동시에 데이터를 주고받을 수 있습니다. " +
        "HTTP와 달리 요청-응답 패턴에 구속되지 않습니다.\n\n" +
        "**3. 프레임 기반 통신**\n" +
        "데이터는 작은 프레임 단위로 전송됩니다. 텍스트(UTF-8)와 바이너리 프레임을 지원합니다.\n\n" +
        "**4. Ping/Pong**\n" +
        "연결 상태를 확인하기 위한 하트비트 메커니즘입니다.\n\n" +
        "### 브라우저 WebSocket API\n" +
        "- `new WebSocket(url)`: 연결 생성\n" +
        "- `onopen`: 연결 성공 시\n" +
        "- `onmessage`: 메시지 수신 시\n" +
        "- `onclose`: 연결 종료 시\n" +
        "- `onerror`: 에러 발생 시\n" +
        "- `send(data)`: 메시지 전송\n" +
        "- `close()`: 연결 종료\n\n" +
        "### 재연결 전략\n" +
        "- **지수 백오프**: 재연결 간격을 점점 늘림 (1초, 2초, 4초, 8초...)\n" +
        "- **최대 재시도 횟수**: 무한 재시도 방지\n" +
        "- **Jitter**: 여러 클라이언트가 동시에 재연결하는 것을 방지하기 위해 랜덤 지연 추가\n\n" +
        "### Socket.IO\n" +
        "WebSocket 위에 구축된 라이브러리로 다음 기능을 추가합니다:\n" +
        "- 자동 재연결, 이벤트 기반 통신\n" +
        "- Room과 Namespace로 그룹 관리\n" +
        "- WebSocket을 지원하지 않는 환경에서 폴링으로 자동 폴백",
    },
    {
      type: "pseudocode",
      title: "기술 구현: WebSocket 매니저 클래스",
      content:
        "자동 재연결, 이벤트 관리, 하트비트를 포함한 WebSocket 매니저를 구현합니다.",
      code: {
        language: "typescript",
        code:
          "// WebSocket 매니저 클래스\n" +
          "\n" +
          "type MessageHandler = (data: unknown) => void;\n" +
          "\n" +
          "interface WebSocketManagerOptions {\n" +
          "  url: string;\n" +
          "  maxRetries?: number;\n" +
          "  baseDelay?: number;\n" +
          "  maxDelay?: number;\n" +
          "  heartbeatInterval?: number;\n" +
          "}\n" +
          "\n" +
          "class WebSocketManager {\n" +
          "  private ws: WebSocket | null = null;\n" +
          "  private options: Required<WebSocketManagerOptions>;\n" +
          "  private retryCount = 0;\n" +
          "  private listeners = new Map<string, Set<MessageHandler>>();\n" +
          "  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;\n" +
          "  private isManualClose = false;\n" +
          "\n" +
          "  constructor(options: WebSocketManagerOptions) {\n" +
          "    this.options = {\n" +
          "      maxRetries: 10,\n" +
          "      baseDelay: 1000,\n" +
          "      maxDelay: 30000,\n" +
          "      heartbeatInterval: 30000,\n" +
          "      ...options,\n" +
          "    };\n" +
          "  }\n" +
          "\n" +
          "  connect(): void {\n" +
          "    this.isManualClose = false;\n" +
          "    this.ws = new WebSocket(this.options.url);\n" +
          "\n" +
          "    this.ws.onopen = () => {\n" +
          "      console.log(\"WebSocket 연결 성공\");\n" +
          "      this.retryCount = 0;\n" +
          "      this.startHeartbeat();\n" +
          "      this.emit(\"connected\", null);\n" +
          "    };\n" +
          "\n" +
          "    this.ws.onmessage = (event: MessageEvent) => {\n" +
          "      try {\n" +
          "        const message = JSON.parse(event.data);\n" +
          "        const { type, payload } = message;\n" +
          "\n" +
          "        // pong 응답 처리\n" +
          "        if (type === \"pong\") return;\n" +
          "\n" +
          "        this.emit(type, payload);\n" +
          "      } catch {\n" +
          "        console.error(\"메시지 파싱 실패: \" + event.data);\n" +
          "      }\n" +
          "    };\n" +
          "\n" +
          "    this.ws.onclose = (event: CloseEvent) => {\n" +
          "      this.stopHeartbeat();\n" +
          "      console.log(\n" +
          "        \"WebSocket 연결 종료: \" + event.code +\n" +
          "        \" \" + event.reason\n" +
          "      );\n" +
          "\n" +
          "      if (!this.isManualClose) {\n" +
          "        this.reconnect();\n" +
          "      }\n" +
          "    };\n" +
          "\n" +
          "    this.ws.onerror = () => {\n" +
          "      console.error(\"WebSocket 에러 발생\");\n" +
          "    };\n" +
          "  }\n" +
          "\n" +
          "  // 지수 백오프 + Jitter 재연결\n" +
          "  private reconnect(): void {\n" +
          "    if (this.retryCount >= this.options.maxRetries) {\n" +
          "      console.error(\"최대 재연결 횟수 초과\");\n" +
          "      this.emit(\"maxRetriesReached\", null);\n" +
          "      return;\n" +
          "    }\n" +
          "\n" +
          "    const delay = Math.min(\n" +
          "      this.options.baseDelay * Math.pow(2, this.retryCount),\n" +
          "      this.options.maxDelay\n" +
          "    );\n" +
          "    // Jitter: 0.5 ~ 1.5 배 랜덤\n" +
          "    const jitter = delay * (0.5 + Math.random());\n" +
          "\n" +
          "    console.log(\n" +
          "      \"재연결 시도 \" + (this.retryCount + 1) +\n" +
          "      \"/\" + this.options.maxRetries +\n" +
          "      \" (\" + Math.round(jitter) + \"ms 후)\"\n" +
          "    );\n" +
          "\n" +
          "    this.retryCount++;\n" +
          "    setTimeout(() => this.connect(), jitter);\n" +
          "  }\n" +
          "\n" +
          "  // 하트비트\n" +
          "  private startHeartbeat(): void {\n" +
          "    this.heartbeatTimer = setInterval(() => {\n" +
          "      this.send(\"ping\", {});\n" +
          "    }, this.options.heartbeatInterval);\n" +
          "  }\n" +
          "\n" +
          "  private stopHeartbeat(): void {\n" +
          "    if (this.heartbeatTimer) {\n" +
          "      clearInterval(this.heartbeatTimer);\n" +
          "      this.heartbeatTimer = null;\n" +
          "    }\n" +
          "  }\n" +
          "\n" +
          "  // 메시지 전송\n" +
          "  send(type: string, payload: unknown): void {\n" +
          "    if (this.ws?.readyState === WebSocket.OPEN) {\n" +
          "      this.ws.send(JSON.stringify({ type, payload }));\n" +
          "    }\n" +
          "  }\n" +
          "\n" +
          "  // 이벤트 리스너 등록\n" +
          "  on(event: string, handler: MessageHandler): () => void {\n" +
          "    if (!this.listeners.has(event)) {\n" +
          "      this.listeners.set(event, new Set());\n" +
          "    }\n" +
          "    this.listeners.get(event)!.add(handler);\n" +
          "\n" +
          "    // 구독 해제 함수 반환\n" +
          "    return () => {\n" +
          "      this.listeners.get(event)?.delete(handler);\n" +
          "    };\n" +
          "  }\n" +
          "\n" +
          "  private emit(event: string, data: unknown): void {\n" +
          "    this.listeners.get(event)?.forEach((handler) => {\n" +
          "      handler(data);\n" +
          "    });\n" +
          "  }\n" +
          "\n" +
          "  disconnect(): void {\n" +
          "    this.isManualClose = true;\n" +
          "    this.stopHeartbeat();\n" +
          "    this.ws?.close(1000, \"정상 종료\");\n" +
          "  }\n" +
          "}",
        description:
          "지수 백오프 재연결, 하트비트, 이벤트 기반 메시지 처리를 갖춘 WebSocket 매니저 클래스입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 실시간 채팅 컴포넌트",
      content:
        "WebSocket 매니저를 활용한 간단한 실시간 채팅 기능을 구현합니다.",
      code: {
        language: "typescript",
        code:
          "// 실시간 채팅 서비스 (React 환경)\n" +
          "\n" +
          "interface ChatMessage {\n" +
          "  id: string;\n" +
          "  userId: string;\n" +
          "  username: string;\n" +
          "  content: string;\n" +
          "  timestamp: number;\n" +
          "}\n" +
          "\n" +
          "interface TypingEvent {\n" +
          "  userId: string;\n" +
          "  username: string;\n" +
          "}\n" +
          "\n" +
          "class ChatService {\n" +
          "  private ws: WebSocket | null = null;\n" +
          "  private messageCallbacks: Array<\n" +
          "    (msg: ChatMessage) => void\n" +
          "  > = [];\n" +
          "  private typingCallbacks: Array<\n" +
          "    (event: TypingEvent) => void\n" +
          "  > = [];\n" +
          "  private roomId: string;\n" +
          "\n" +
          "  constructor(roomId: string) {\n" +
          "    this.roomId = roomId;\n" +
          "  }\n" +
          "\n" +
          "  connect(token: string): void {\n" +
          "    const url =\n" +
          "      \"wss://chat.example.com/ws\" +\n" +
          "      \"?room=\" + this.roomId +\n" +
          "      \"&token=\" + token;\n" +
          "\n" +
          "    this.ws = new WebSocket(url);\n" +
          "\n" +
          "    this.ws.onopen = () => {\n" +
          "      console.log(\n" +
          "        \"채팅방 \" + this.roomId + \" 연결 완료\"\n" +
          "      );\n" +
          "    };\n" +
          "\n" +
          "    this.ws.onmessage = (event: MessageEvent) => {\n" +
          "      const data = JSON.parse(event.data);\n" +
          "\n" +
          "      switch (data.type) {\n" +
          "        case \"message\":\n" +
          "          this.messageCallbacks.forEach((cb) =>\n" +
          "            cb(data.payload as ChatMessage)\n" +
          "          );\n" +
          "          break;\n" +
          "        case \"typing\":\n" +
          "          this.typingCallbacks.forEach((cb) =>\n" +
          "            cb(data.payload as TypingEvent)\n" +
          "          );\n" +
          "          break;\n" +
          "      }\n" +
          "    };\n" +
          "\n" +
          "    this.ws.onclose = (event: CloseEvent) => {\n" +
          "      if (event.code !== 1000) {\n" +
          "        console.log(\"비정상 종료. 재연결 시도...\");\n" +
          "        setTimeout(() => this.connect(token), 3000);\n" +
          "      }\n" +
          "    };\n" +
          "  }\n" +
          "\n" +
          "  sendMessage(content: string): void {\n" +
          "    if (this.ws?.readyState !== WebSocket.OPEN) {\n" +
          "      console.error(\"WebSocket이 연결되지 않았습니다\");\n" +
          "      return;\n" +
          "    }\n" +
          "\n" +
          "    this.ws.send(JSON.stringify({\n" +
          "      type: \"message\",\n" +
          "      payload: { content, timestamp: Date.now() },\n" +
          "    }));\n" +
          "  }\n" +
          "\n" +
          "  sendTyping(): void {\n" +
          "    if (this.ws?.readyState === WebSocket.OPEN) {\n" +
          "      this.ws.send(JSON.stringify({ type: \"typing\" }));\n" +
          "    }\n" +
          "  }\n" +
          "\n" +
          "  onMessage(\n" +
          "    callback: (msg: ChatMessage) => void\n" +
          "  ): () => void {\n" +
          "    this.messageCallbacks.push(callback);\n" +
          "    return () => {\n" +
          "      this.messageCallbacks =\n" +
          "        this.messageCallbacks.filter(\n" +
          "          (cb) => cb !== callback\n" +
          "        );\n" +
          "    };\n" +
          "  }\n" +
          "\n" +
          "  onTyping(\n" +
          "    callback: (event: TypingEvent) => void\n" +
          "  ): () => void {\n" +
          "    this.typingCallbacks.push(callback);\n" +
          "    return () => {\n" +
          "      this.typingCallbacks =\n" +
          "        this.typingCallbacks.filter(\n" +
          "          (cb) => cb !== callback\n" +
          "        );\n" +
          "    };\n" +
          "  }\n" +
          "\n" +
          "  disconnect(): void {\n" +
          "    this.ws?.close(1000, \"사용자 퇴장\");\n" +
          "    this.messageCallbacks = [];\n" +
          "    this.typingCallbacks = [];\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// React Hook 사용 예시\n" +
          "// function useChat(roomId: string) {\n" +
          "//   const [messages, setMessages] = useState<ChatMessage[]>([]);\n" +
          "//   const chatRef = useRef<ChatService>();\n" +
          "//\n" +
          "//   useEffect(() => {\n" +
          "//     const chat = new ChatService(roomId);\n" +
          "//     chat.connect(getToken());\n" +
          "//     const unsub = chat.onMessage((msg) =>\n" +
          "//       setMessages((prev) => [...prev, msg])\n" +
          "//     );\n" +
          "//     chatRef.current = chat;\n" +
          "//     return () => { unsub(); chat.disconnect(); };\n" +
          "//   }, [roomId]);\n" +
          "//\n" +
          "//   return { messages, send: chatRef.current?.sendMessage };\n" +
          "// }",
        description:
          "WebSocket을 활용한 실시간 채팅 서비스로, 메시지 전송, 타이핑 표시, 재연결 기능을 포함합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### WebSocket 프로토콜\n" +
        "- HTTP Upgrade 핸드셰이크로 시작하여 지속적인 양방향 연결 수립\n" +
        "- 전이중(Full-Duplex) 통신으로 서버와 클라이언트가 동시에 데이터 전송 가능\n" +
        "- `ws://`(비암호화)와 `wss://`(TLS 암호화) 프로토콜 지원\n\n" +
        "### 브라우저 WebSocket API\n" +
        "- `WebSocket` 생성자로 연결, `onopen/onmessage/onclose/onerror` 이벤트 처리\n" +
        "- `send()`로 메시지 전송, `close()`로 연결 종료\n" +
        "- `readyState`로 현재 연결 상태 확인\n\n" +
        "### 재연결 전략\n" +
        "- 지수 백오프: 재연결 간격을 지수적으로 증가 (1, 2, 4, 8초...)\n" +
        "- Jitter: 랜덤 지연으로 동시 재연결(Thundering Herd) 방지\n" +
        "- 최대 재시도 횟수로 무한 루프 방지\n\n" +
        "### 활용 사례\n" +
        "- 실시간 채팅, 협업 도구, 라이브 데이터 피드, 온라인 게임\n\n" +
        "### Socket.IO\n" +
        "- WebSocket 위에 자동 재연결, Room/Namespace, 폴링 폴백 등 편의 기능 제공\n" +
        "- 순수 WebSocket보다 무겁지만 프로덕션 환경에서의 안정성이 우수",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "WebSocket은 HTTP Upgrade 핸드셰이크 후 지속적인 양방향 통신을 가능하게 하며, 재연결 전략과 이벤트 관리가 안정적인 실시간 서비스의 핵심입니다.",
  checklist: [
    "WebSocket의 핸드셰이크 과정(HTTP Upgrade)을 설명할 수 있다",
    "전이중 통신과 HTTP 요청-응답 모델의 차이를 이해한다",
    "브라우저 WebSocket API의 주요 이벤트와 메서드를 사용할 수 있다",
    "지수 백오프와 Jitter를 적용한 재연결 전략을 구현할 수 있다",
    "WebSocket과 Socket.IO의 차이점 및 각각의 적합한 사용 사례를 안다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "WebSocket 연결은 어떻게 시작되나요?",
      choices: [
        "새로운 TCP 연결을 직접 수립한다",
        "HTTP Upgrade 핸드셰이크를 통해 프로토콜을 전환한다",
        "UDP 소켓을 생성한다",
        "서버가 먼저 클라이언트에 연결한다",
      ],
      correctIndex: 1,
      explanation:
        "WebSocket은 HTTP 요청에 Upgrade: websocket 헤더를 포함하여 시작합니다. 서버가 101 Switching Protocols로 응답하면 WebSocket 프로토콜로 전환됩니다.",
    },
    {
      id: "q2",
      question:
        "WebSocket의 전이중(Full-Duplex) 통신이란?",
      choices: [
        "요청을 보내면 두 개의 응답을 받는 것",
        "클라이언트와 서버가 동시에 데이터를 주고받을 수 있는 것",
        "하나의 연결로 두 개의 서버에 접속하는 것",
        "데이터를 두 번 전송하여 신뢰성을 높이는 것",
      ],
      correctIndex: 1,
      explanation:
        "전이중 통신은 양쪽이 동시에 데이터를 보낼 수 있는 방식입니다. HTTP는 클라이언트가 요청하면 서버가 응답하는 반이중(Half-Duplex) 구조입니다.",
    },
    {
      id: "q3",
      question:
        "지수 백오프(Exponential Backoff) 재연결에서 Jitter를 추가하는 이유는?",
      choices: [
        "연결 속도를 높이기 위해",
        "서버 부하를 줄이기 위해 재연결 시점을 분산시키려고",
        "보안을 강화하기 위해",
        "데이터 압축률을 높이기 위해",
      ],
      correctIndex: 1,
      explanation:
        "Jitter는 재연결 시간에 랜덤 변동을 추가하여, 서버 장애 후 수많은 클라이언트가 동시에 재연결하는 Thundering Herd 문제를 방지합니다.",
    },
    {
      id: "q4",
      question:
        "WebSocket의 readyState가 OPEN일 때의 값은?",
      choices: [
        "0 (CONNECTING)",
        "1 (OPEN)",
        "2 (CLOSING)",
        "3 (CLOSED)",
      ],
      correctIndex: 1,
      explanation:
        "WebSocket.readyState는 0(CONNECTING), 1(OPEN), 2(CLOSING), 3(CLOSED) 중 하나의 값을 가집니다. OPEN(1)일 때만 send()로 데이터를 전송할 수 있습니다.",
    },
    {
      id: "q5",
      question:
        "Socket.IO가 순수 WebSocket 대비 제공하는 주요 이점이 아닌 것은?",
      choices: [
        "자동 재연결",
        "Room과 Namespace 기능",
        "HTTP/2 멀티플렉싱 지원",
        "WebSocket 미지원 환경에서 폴링 폴백",
      ],
      correctIndex: 2,
      explanation:
        "Socket.IO는 자동 재연결, Room/Namespace, 폴링 폴백 등을 제공하지만, HTTP/2 멀티플렉싱은 HTTP 프로토콜의 기능이며 Socket.IO와는 관련이 없습니다.",
    },
  ],
};

export default chapter;
