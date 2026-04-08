import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "11-sse",
  subject: "network",
  title: "Server-Sent Events",
  description:
    "Server-Sent Events(SSE)의 동작 원리와 EventSource API를 이해하고, WebSocket과의 차이점, 실시간 알림과 AI 스트리밍 응답 등 실무 활용 패턴을 학습합니다.",
  order: 11,
  group: "실시간 통신",
  prerequisites: ["04-http-basics"],
  estimatedMinutes: 20,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "SSE와 WebSocket의 차이를 **방송 시스템**에 비유해봅시다.\n\n" +
        "**WebSocket = 무전기 (양방향)**\n" +
        "두 사람이 동시에 말하고 들을 수 있습니다. " +
        "채팅이나 게임처럼 양쪽 모두 자유롭게 메시지를 보내야 할 때 적합합니다.\n\n" +
        "**SSE = 라디오 방송 (단방향)**\n" +
        "방송국(서버)이 계속 방송을 송출하고, 청취자(클라이언트)는 듣기만 합니다. " +
        "청취자가 방송국에 말할 수는 없지만, 뉴스 속보나 날씨 업데이트처럼 " +
        "서버가 일방적으로 정보를 보내는 경우에는 이것만으로 충분합니다.\n\n" +
        "**라디오의 장점:**\n" +
        "- 주파수를 맞추기만 하면 됩니다(HTTP 기반으로 간단)\n" +
        "- 전파가 끊겨도 자동으로 다시 잡힙니다(자동 재연결)\n" +
        "- 무전기보다 구조가 단순하고 전력 소모가 적습니다(가볍고 효율적)\n\n" +
        "**AI 스트리밍 응답 = 라디오 실시간 중계**\n" +
        "ChatGPT처럼 AI가 답변을 한 글자씩 생성할 때, " +
        "완성될 때까지 기다리지 않고 생성되는 대로 실시간으로 받아 화면에 표시합니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드에서 서버의 업데이트를 실시간으로 받아야 할 때 다음 문제에 직면합니다:\n\n" +
        "### 양방향이 불필요한 경우\n" +
        "- 알림 시스템: 서버가 클라이언트에 알림을 보내기만 하면 됩니다.\n" +
        "- 라이브 피드: 뉴스, 주가, 점수 등이 서버에서 일방적으로 업데이트됩니다.\n" +
        "- AI 스트리밍: LLM의 응답을 토큰 단위로 실시간 수신합니다.\n" +
        "- 빌드 로그: CI/CD 빌드 진행 상황을 실시간으로 모니터링합니다.\n\n" +
        "이런 경우 WebSocket은 과도한 선택입니다:\n" +
        "- 양방향 연결 유지에 서버 리소스가 더 많이 소모됩니다.\n" +
        "- 프록시와 로드 밸런서 설정이 복잡합니다.\n" +
        "- HTTP 인프라(캐싱, 인증, 압축)를 활용할 수 없습니다.\n\n" +
        "### 폴링의 비효율\n" +
        "- 짧은 간격: 서버 부하 증가, 대부분의 응답이 빈 결과\n" +
        "- 긴 간격: 실시간성이 떨어짐\n" +
        "- 적절한 간격을 결정하기 어려움\n\n" +
        "HTTP 기반이면서 서버에서 클라이언트로의 실시간 단방향 통신이 필요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### Server-Sent Events (SSE)\n\n" +
        "SSE는 HTTP 위에서 동작하는 단방향 실시간 통신 기술입니다.\n\n" +
        "**1. 동작 원리**\n" +
        "- 클라이언트가 일반 HTTP GET 요청을 보냅니다.\n" +
        "- 서버가 `Content-Type: text/event-stream`으로 응답합니다.\n" +
        "- 연결을 닫지 않고 계속 데이터를 스트리밍합니다.\n" +
        "- 각 이벤트는 줄바꿈으로 구분됩니다.\n\n" +
        "**2. 이벤트 스트림 형식**\n" +
        "```\n" +
        "event: message\n" +
        "data: {\"text\": \"안녕하세요\"}\n" +
        "id: 1\n" +
        "retry: 3000\n" +
        "\n" +
        "event: notification\n" +
        "data: {\"type\": \"alert\", \"message\": \"새 메시지\"}\n" +
        "id: 2\n" +
        "```\n\n" +
        "**3. EventSource API**\n" +
        "- `new EventSource(url)`: SSE 연결 생성\n" +
        "- `onmessage`: 기본 메시지 이벤트\n" +
        "- `addEventListener(type, handler)`: 커스텀 이벤트 수신\n" +
        "- `close()`: 연결 종료\n\n" +
        "**4. 자동 재연결**\n" +
        "- 연결이 끊어지면 브라우저가 자동으로 재연결합니다.\n" +
        "- `retry` 필드로 재연결 간격을 서버가 지정할 수 있습니다.\n" +
        "- `Last-Event-ID` 헤더로 마지막 수신 이벤트부터 이어받습니다.\n\n" +
        "### SSE vs WebSocket 비교\n\n" +
        "| 특성 | SSE | WebSocket |\n" +
        "|------|-----|------------|\n" +
        "| 방향 | 서버 → 클라이언트 | 양방향 |\n" +
        "| 프로토콜 | HTTP | ws:// / wss:// |\n" +
        "| 자동 재연결 | 내장 | 직접 구현 |\n" +
        "| 데이터 형식 | 텍스트만 | 텍스트 + 바이너리 |\n" +
        "| HTTP/2 호환 | 자연스러움 | 별도 연결 |\n" +
        "| 브라우저 지원 | IE 제외 전부 | 전부 |\n\n" +
        "### SSE를 선택해야 할 때\n" +
        "- 서버에서 클라이언트로의 단방향 푸시만 필요한 경우\n" +
        "- HTTP 인프라(인증, 캐싱, CDN)를 그대로 활용하고 싶은 경우\n" +
        "- AI 스트리밍 응답처럼 텍스트 데이터를 점진적으로 수신하는 경우",
    },
    {
      type: "pseudocode",
      title: "기술 구현: SSE 클라이언트 매니저",
      content:
        "EventSource API를 래핑하여 타입 안전한 SSE 클라이언트를 구현합니다.",
      code: {
        language: "typescript",
        code:
          "// 타입 안전한 SSE 클라이언트 매니저\n" +
          "\n" +
          "interface SSEOptions {\n" +
          "  url: string;\n" +
          "  withCredentials?: boolean;\n" +
          "  onError?: (error: Event) => void;\n" +
          "  maxRetries?: number;\n" +
          "}\n" +
          "\n" +
          "type EventHandler<T = unknown> = (data: T) => void;\n" +
          "\n" +
          "class SSEClient {\n" +
          "  private source: EventSource | null = null;\n" +
          "  private handlers = new Map<\n" +
          "    string,\n" +
          "    Set<EventHandler>\n" +
          "  >();\n" +
          "  private options: SSEOptions;\n" +
          "  private retryCount = 0;\n" +
          "\n" +
          "  constructor(options: SSEOptions) {\n" +
          "    this.options = options;\n" +
          "  }\n" +
          "\n" +
          "  connect(): void {\n" +
          "    this.source = new EventSource(\n" +
          "      this.options.url,\n" +
          "      {\n" +
          "        withCredentials:\n" +
          "          this.options.withCredentials ?? false,\n" +
          "      }\n" +
          "    );\n" +
          "\n" +
          "    this.source.onopen = () => {\n" +
          "      console.log(\"SSE 연결 성공: \" + this.options.url);\n" +
          "      this.retryCount = 0;\n" +
          "    };\n" +
          "\n" +
          "    this.source.onerror = (event: Event) => {\n" +
          "      if (this.source?.readyState === EventSource.CLOSED) {\n" +
          "        console.log(\"SSE 연결 종료\");\n" +
          "      } else {\n" +
          "        console.log(\"SSE 연결 오류. 재연결 대기 중...\");\n" +
          "        this.retryCount++;\n" +
          "      }\n" +
          "\n" +
          "      if (\n" +
          "        this.options.maxRetries &&\n" +
          "        this.retryCount > this.options.maxRetries\n" +
          "      ) {\n" +
          "        this.disconnect();\n" +
          "        console.error(\"SSE 최대 재연결 횟수 초과\");\n" +
          "      }\n" +
          "\n" +
          "      this.options.onError?.(event);\n" +
          "    };\n" +
          "\n" +
          "    // 기본 message 이벤트\n" +
          "    this.source.onmessage = (event: MessageEvent) => {\n" +
          "      this.dispatch(\"message\", event.data);\n" +
          "    };\n" +
          "\n" +
          "    // 등록된 커스텀 이벤트 리스너 연결\n" +
          "    this.handlers.forEach((_, eventType) => {\n" +
          "      if (eventType !== \"message\") {\n" +
          "        this.attachEventListener(eventType);\n" +
          "      }\n" +
          "    });\n" +
          "  }\n" +
          "\n" +
          "  private attachEventListener(eventType: string): void {\n" +
          "    this.source?.addEventListener(\n" +
          "      eventType,\n" +
          "      (event: MessageEvent) => {\n" +
          "        this.dispatch(eventType, event.data);\n" +
          "      }\n" +
          "    );\n" +
          "  }\n" +
          "\n" +
          "  // 이벤트 핸들러 등록\n" +
          "  on<T = unknown>(\n" +
          "    eventType: string,\n" +
          "    handler: EventHandler<T>\n" +
          "  ): () => void {\n" +
          "    if (!this.handlers.has(eventType)) {\n" +
          "      this.handlers.set(eventType, new Set());\n" +
          "\n" +
          "      // 이미 연결된 상태라면 리스너 추가\n" +
          "      if (\n" +
          "        this.source &&\n" +
          "        eventType !== \"message\"\n" +
          "      ) {\n" +
          "        this.attachEventListener(eventType);\n" +
          "      }\n" +
          "    }\n" +
          "\n" +
          "    this.handlers.get(eventType)!.add(\n" +
          "      handler as EventHandler\n" +
          "    );\n" +
          "\n" +
          "    return () => {\n" +
          "      this.handlers\n" +
          "        .get(eventType)\n" +
          "        ?.delete(handler as EventHandler);\n" +
          "    };\n" +
          "  }\n" +
          "\n" +
          "  private dispatch(\n" +
          "    eventType: string,\n" +
          "    rawData: string\n" +
          "  ): void {\n" +
          "    let parsed: unknown;\n" +
          "    try {\n" +
          "      parsed = JSON.parse(rawData);\n" +
          "    } catch {\n" +
          "      parsed = rawData;\n" +
          "    }\n" +
          "\n" +
          "    this.handlers.get(eventType)?.forEach((handler) => {\n" +
          "      handler(parsed);\n" +
          "    });\n" +
          "  }\n" +
          "\n" +
          "  disconnect(): void {\n" +
          "    this.source?.close();\n" +
          "    this.source = null;\n" +
          "  }\n" +
          "\n" +
          "  get readyState(): number {\n" +
          "    return this.source?.readyState ?? EventSource.CLOSED;\n" +
          "  }\n" +
          "}",
        description:
          "EventSource API를 래핑하여 타입 안전한 이벤트 핸들링과 재연결 관리를 제공하는 SSE 클라이언트입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: AI 스트리밍 응답 처리",
      content:
        "ChatGPT와 같은 AI 서비스의 스트리밍 응답을 SSE로 처리하는 패턴을 구현합니다.",
      code: {
        language: "typescript",
        code:
          "// AI 스트리밍 응답 처리 (fetch + ReadableStream)\n" +
          "// EventSource는 GET만 지원하므로 POST가 필요한 경우\n" +
          "// fetch API의 ReadableStream을 활용합니다.\n" +
          "\n" +
          "interface StreamChunk {\n" +
          "  id: string;\n" +
          "  content: string;\n" +
          "  done: boolean;\n" +
          "}\n" +
          "\n" +
          "interface StreamOptions {\n" +
          "  onToken: (token: string) => void;\n" +
          "  onComplete: (fullText: string) => void;\n" +
          "  onError: (error: Error) => void;\n" +
          "}\n" +
          "\n" +
          "async function streamAIResponse(\n" +
          "  prompt: string,\n" +
          "  options: StreamOptions\n" +
          "): Promise<void> {\n" +
          "  const response = await fetch(\"/api/chat\", {\n" +
          "    method: \"POST\",\n" +
          "    headers: {\n" +
          "      \"Content-Type\": \"application/json\",\n" +
          "      Accept: \"text/event-stream\",\n" +
          "    },\n" +
          "    body: JSON.stringify({ prompt }),\n" +
          "  });\n" +
          "\n" +
          "  if (!response.ok) {\n" +
          "    throw new Error(\n" +
          "      \"API 요청 실패: \" + response.status\n" +
          "    );\n" +
          "  }\n" +
          "\n" +
          "  const reader = response.body?.getReader();\n" +
          "  if (!reader) {\n" +
          "    throw new Error(\"ReadableStream을 사용할 수 없습니다\");\n" +
          "  }\n" +
          "\n" +
          "  const decoder = new TextDecoder();\n" +
          "  let buffer = \"\";\n" +
          "  let fullText = \"\";\n" +
          "\n" +
          "  try {\n" +
          "    while (true) {\n" +
          "      const { done, value } = await reader.read();\n" +
          "\n" +
          "      if (done) break;\n" +
          "\n" +
          "      // 바이트를 텍스트로 디코딩\n" +
          "      buffer += decoder.decode(value, { stream: true });\n" +
          "\n" +
          "      // 줄 단위로 파싱 (SSE 형식)\n" +
          "      const lines = buffer.split(\"\\n\");\n" +
          "      // 마지막 줄은 불완전할 수 있으므로 버퍼에 유지\n" +
          "      buffer = lines.pop() || \"\";\n" +
          "\n" +
          "      for (const line of lines) {\n" +
          "        if (line.startsWith(\"data: \")) {\n" +
          "          const data = line.slice(6); // \"data: \" 제거\n" +
          "\n" +
          "          if (data === \"[DONE]\") {\n" +
          "            options.onComplete(fullText);\n" +
          "            return;\n" +
          "          }\n" +
          "\n" +
          "          try {\n" +
          "            const chunk: StreamChunk =\n" +
          "              JSON.parse(data);\n" +
          "            fullText += chunk.content;\n" +
          "            options.onToken(chunk.content);\n" +
          "          } catch {\n" +
          "            // JSON이 아닌 텍스트 데이터\n" +
          "            fullText += data;\n" +
          "            options.onToken(data);\n" +
          "          }\n" +
          "        }\n" +
          "      }\n" +
          "    }\n" +
          "\n" +
          "    options.onComplete(fullText);\n" +
          "  } catch (error) {\n" +
          "    options.onError(\n" +
          "      error instanceof Error\n" +
          "        ? error\n" +
          "        : new Error(\"스트리밍 중 오류 발생\")\n" +
          "    );\n" +
          "  } finally {\n" +
          "    reader.releaseLock();\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// 사용 예시\n" +
          "async function handleChat(\n" +
          "  userMessage: string\n" +
          "): Promise<void> {\n" +
          "  let displayText = \"\";\n" +
          "\n" +
          "  await streamAIResponse(userMessage, {\n" +
          "    onToken: (token) => {\n" +
          "      displayText += token;\n" +
          "      // UI 업데이트 (React라면 setState)\n" +
          "      console.log(\"현재 텍스트: \" + displayText);\n" +
          "    },\n" +
          "    onComplete: (fullText) => {\n" +
          "      console.log(\"완성된 응답: \" + fullText);\n" +
          "    },\n" +
          "    onError: (error) => {\n" +
          "      console.error(\n" +
          "        \"스트리밍 오류: \" + error.message\n" +
          "      );\n" +
          "    },\n" +
          "  });\n" +
          "}",
        description:
          "fetch API의 ReadableStream을 사용하여 AI 서비스의 SSE 스트리밍 응답을 토큰 단위로 처리하는 패턴입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### SSE 핵심 개념\n" +
        "- HTTP 기반 단방향 실시간 통신 (서버 → 클라이언트)\n" +
        "- `Content-Type: text/event-stream` 형식으로 이벤트 스트리밍\n" +
        "- 자동 재연결과 `Last-Event-ID`로 이어받기 내장\n\n" +
        "### EventSource API\n" +
        "- `new EventSource(url)`로 간단하게 연결\n" +
        "- `onmessage`로 기본 이벤트, `addEventListener`로 커스텀 이벤트 수신\n" +
        "- GET 요청만 지원하므로 POST가 필요하면 fetch + ReadableStream 사용\n\n" +
        "### SSE vs WebSocket\n" +
        "- SSE: 단방향, HTTP 기반, 자동 재연결, 텍스트만 지원, 인프라 친화적\n" +
        "- WebSocket: 양방향, 독립 프로토콜, 재연결 직접 구현, 바이너리 지원\n\n" +
        "### 주요 활용 사례\n" +
        "- 실시간 알림, 라이브 피드, AI 스트리밍 응답\n" +
        "- CI/CD 빌드 로그, 서버 모니터링 대시보드\n\n" +
        "### 선택 기준\n" +
        "- 양방향 통신이 필요하면 → WebSocket\n" +
        "- 서버에서 클라이언트로의 푸시만 필요하면 → SSE\n" +
        "- HTTP 인프라를 그대로 활용하고 싶다면 → SSE",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "SSE는 HTTP 기반의 단방향 실시간 통신으로, 알림이나 AI 스트리밍처럼 서버 푸시만 필요한 경우 WebSocket보다 간단하고 효율적인 선택입니다.",
  checklist: [
    "SSE의 text/event-stream 형식과 이벤트 구조를 설명할 수 있다",
    "EventSource API의 주요 이벤트와 메서드를 사용할 수 있다",
    "SSE와 WebSocket의 차이점과 각각의 적합한 사용 사례를 구분할 수 있다",
    "fetch + ReadableStream을 사용한 SSE 스트리밍 처리를 구현할 수 있다",
    "SSE의 자동 재연결과 Last-Event-ID 메커니즘을 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question:
        "SSE에서 서버 응답의 Content-Type은?",
      choices: [
        "application/json",
        "text/event-stream",
        "application/octet-stream",
        "text/html",
      ],
      correctIndex: 1,
      explanation:
        "SSE 응답은 Content-Type: text/event-stream으로 전송됩니다. 이 형식을 통해 브라우저가 이벤트 스트림임을 인식합니다.",
    },
    {
      id: "q2",
      question:
        "SSE가 WebSocket 대비 가지는 장점이 아닌 것은?",
      choices: [
        "자동 재연결 내장",
        "HTTP 인프라(인증, 캐싱) 활용 가능",
        "양방향 통신 지원",
        "별도 프로토콜 없이 HTTP만으로 동작",
      ],
      correctIndex: 2,
      explanation:
        "SSE는 서버에서 클라이언트로의 단방향 통신만 지원합니다. 양방향 통신은 WebSocket의 장점입니다.",
    },
    {
      id: "q3",
      question:
        "SSE 연결이 끊어졌을 때 재연결 시 서버에 전달되는 헤더는?",
      choices: [
        "Retry-After",
        "Last-Event-ID",
        "If-None-Match",
        "Connection-Resume",
      ],
      correctIndex: 1,
      explanation:
        "브라우저는 재연결 시 Last-Event-ID 헤더를 포함하여 마지막으로 수신한 이벤트의 ID를 서버에 알리고, 누락된 이벤트부터 다시 받을 수 있습니다.",
    },
    {
      id: "q4",
      question:
        "EventSource API가 지원하지 않는 HTTP 메서드는?",
      choices: [
        "GET만 지원한다",
        "GET과 POST를 지원한다",
        "모든 HTTP 메서드를 지원한다",
        "HEAD만 지원한다",
      ],
      correctIndex: 0,
      explanation:
        "EventSource API는 GET 요청만 지원합니다. POST 요청이 필요한 경우(예: AI 프롬프트 전송) fetch API의 ReadableStream을 사용해야 합니다.",
    },
    {
      id: "q5",
      question:
        "AI 스트리밍 응답을 SSE로 처리할 때 fetch API를 사용하는 이유는?",
      choices: [
        "fetch가 더 빠르기 때문에",
        "EventSource는 GET만 지원하므로 POST 요청을 위해",
        "EventSource는 JSON을 파싱할 수 없으므로",
        "fetch가 자동 재연결을 지원하므로",
      ],
      correctIndex: 1,
      explanation:
        "AI 서비스에 프롬프트를 전송하려면 POST 요청이 필요하지만 EventSource는 GET만 지원합니다. 따라서 fetch API로 POST 요청을 보내고 ReadableStream으로 응답을 스트리밍 처리합니다.",
    },
  ],
};

export default chapter;
