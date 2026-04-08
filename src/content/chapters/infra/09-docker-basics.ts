import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "09-docker-basics",
  subject: "infra",
  title: "Docker 기초",
  description: "컨테이너의 개념, Docker의 기본 명령어, 이미지와 컨테이너의 관계, 볼륨과 네트워크를 학습합니다.",
  order: 9,
  group: "컨테이너",
  prerequisites: ["08-build-optimization"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Docker를 **배송 컨테이너**에 비유해 봅시다.\n\n" +
        "소프트웨어 배포의 역사는 화물 운송의 역사와 놀랍도록 비슷합니다. 컨테이너가 발명되기 전에는 화물마다 크기와 형태가 달라서 선적, 하역, 운송이 모두 비효율적이었습니다. 표준 컨테이너가 도입되자 어떤 화물이든 동일한 방식으로 실을 수 있게 되었습니다.\n\n" +
        "**Docker 이미지**는 컨테이너의 **설계도(청사진)**입니다. 어떤 물건을 어떤 순서로 넣을지 기록되어 있으며, 이 설계도 자체는 변경할 수 없습니다(불변).\n\n" +
        "**Docker 컨테이너**는 설계도대로 만들어진 **실제 컨테이너**입니다. 하나의 설계도로 동일한 컨테이너를 여러 개 만들 수 있고, 각 컨테이너는 독립적으로 운용됩니다.\n\n" +
        "**가상 머신(VM)**이 각 화물마다 별도의 트럭을 배정하는 것이라면, **컨테이너**는 하나의 트럭(호스트 OS)에 여러 컨테이너를 효율적으로 싣는 것입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 개발에서 Docker가 필요한 실질적인 문제들을 살펴봅시다.\n\n" +
        "1. **\"내 컴퓨터에서는 되는데\"** — Node.js 버전, OS 차이, 시스템 라이브러리 등 환경 차이로 동일한 코드가 다르게 동작합니다. 개발자 A의 MacOS와 CI 서버의 Linux에서 빌드 결과가 다릅니다.\n\n" +
        "2. **복잡한 로컬 환경 구성** — 새 팀원이 합류하면 Node.js, PostgreSQL, Redis, Nginx를 모두 설치하고 설정해야 합니다. README의 설치 가이드가 OS마다 다르고 항상 뭔가 빠져 있습니다.\n\n" +
        "3. **컨테이너 vs 가상머신** — VM은 완전한 OS를 포함하므로 무겁고 느립니다(GB 단위, 분 단위 부팅). 컨테이너는 호스트 OS의 커널을 공유하므로 가볍고 빠릅니다(MB 단위, 초 단위 시작).\n\n" +
        "Docker는 이 모든 문제를 \"환경을 코드로 정의하고, 어디서든 동일하게 실행\"하는 방식으로 해결합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Docker의 핵심 개념과 구조를 이해합시다.\n\n" +
        "### 이미지(Image)\n" +
        "이미지는 컨테이너를 만들기 위한 **읽기 전용 템플릿**입니다. 여러 **레이어**로 구성되며, 각 레이어는 파일 시스템의 변경 사항(diff)을 담고 있습니다. 레이어는 공유되므로 동일한 베이스 이미지를 사용하는 여러 이미지가 디스크를 절약합니다.\n\n" +
        "### 컨테이너(Container)\n" +
        "컨테이너는 이미지의 **실행 인스턴스**입니다. 이미지 위에 쓰기 가능한 레이어를 추가하여 실행됩니다. 컨테이너를 삭제하면 쓰기 레이어도 사라지므로 데이터를 유지하려면 **볼륨**을 사용합니다.\n\n" +
        "### Docker Hub\n" +
        "공식/커뮤니티 이미지가 저장된 레지스트리입니다. `node:20-alpine`, `nginx:latest` 같은 이미지를 바로 가져올 수 있습니다.\n\n" +
        "### 볼륨과 네트워크\n" +
        "볼륨은 컨테이너의 데이터를 호스트에 영속적으로 저장합니다. 네트워크는 컨테이너 간 통신을 가능하게 합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Docker 기본 명령어",
      content:
        "실무에서 매일 사용하는 Docker 명령어를 상황별로 정리합니다. 이미지 관리, 컨테이너 실행, 디버깅 순서로 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// Docker 기본 명령어 — 프론트엔드 개발자 관점\n' +
          '\n' +
          '// === 이미지 관련 ===\n' +
          '// docker pull node:20-alpine\n' +
          '//   → Docker Hub에서 Node.js 20 Alpine 이미지 다운로드\n' +
          '//   → alpine: 경량 Linux (5MB), 일반 node: ~350MB\n' +
          '\n' +
          '// docker images\n' +
          '//   → 로컬에 있는 이미지 목록 확인\n' +
          '//   REPOSITORY    TAG         SIZE\n' +
          '//   node          20-alpine   130MB\n' +
          '//   nginx         latest      70MB\n' +
          '\n' +
          '// === 컨테이너 실행 ===\n' +
          '// docker run -d --name my-app -p 3000:3000 node:20-alpine\n' +
          '//   -d: 백그라운드(detached) 실행\n' +
          '//   --name: 컨테이너 이름 지정\n' +
          '//   -p 3000:3000: 호스트:컨테이너 포트 매핑\n' +
          '\n' +
          '// docker run -it node:20-alpine sh\n' +
          '//   -it: 인터랙티브 + TTY → 컨테이너 내부 셸 접속\n' +
          '\n' +
          '// === 컨테이너 관리 ===\n' +
          '// docker ps          → 실행 중인 컨테이너 목록\n' +
          '// docker ps -a       → 중지된 컨테이너 포함 전체 목록\n' +
          '// docker stop my-app → 컨테이너 정지\n' +
          '// docker rm my-app   → 컨테이너 삭제\n' +
          '\n' +
          '// === 디버깅 ===\n' +
          '// docker logs my-app        → 컨테이너 로그 확인\n' +
          '// docker logs -f my-app     → 실시간 로그 스트림\n' +
          '// docker exec -it my-app sh → 실행 중인 컨테이너 셸 접속\n' +
          '\n' +
          '// === 볼륨 (데이터 영속성) ===\n' +
          '// docker run -v mydata:/app/data node:20-alpine\n' +
          '//   → named volume: Docker가 관리하는 볼륨\n' +
          '\n' +
          '// docker run -v $(pwd)/src:/app/src node:20-alpine\n' +
          '//   → bind mount: 호스트 디렉토리를 컨테이너에 마운트\n' +
          '//   → 개발 시 소스 코드 변경 실시간 반영에 유용',
        description: "Docker 명령어는 대부분 직관적인 동사(run, stop, rm, logs, exec)로 구성됩니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Nginx로 SPA 서빙하기",
      content:
        "프론트엔드 개발자가 가장 먼저 만나는 Docker 사용 사례는 빌드된 SPA를 Nginx로 서빙하는 것입니다. 이미지 레이어와 포트 매핑을 실제로 사용해 봅시다.",
      code: {
        language: "typescript",
        code:
          '// === 실습: React 빌드 결과물을 Nginx로 서빙 ===\n' +
          '\n' +
          '// 1단계: 프로젝트 빌드\n' +
          '// npm run build  → dist/ 폴더 생성\n' +
          '\n' +
          '// 2단계: Nginx 컨테이너로 서빙\n' +
          '// docker run -d \\\n' +
          '//   --name frontend \\\n' +
          '//   -p 8080:80 \\\n' +
          '//   -v $(pwd)/dist:/usr/share/nginx/html:ro \\\n' +
          '//   nginx:alpine\n' +
          '//\n' +
          '// 설명:\n' +
          '//   -p 8080:80  → 호스트 8080 → 컨테이너 80 (Nginx 기본 포트)\n' +
          '//   -v ...html:ro → 빌드 결과물을 읽기전용(ro)으로 마운트\n' +
          '//   → http://localhost:8080 에서 확인\n' +
          '\n' +
          '// 3단계: SPA 라우팅을 위한 Nginx 설정\n' +
          '// nginx.conf 파일:\n' +
          'const nginxConf =\n' +
          '  "server {\\n" +\n' +
          '  "  listen 80;\\n" +\n' +
          '  "  root /usr/share/nginx/html;\\n" +\n' +
          '  "  index index.html;\\n" +\n' +
          '  "\\n" +\n' +
          '  "  # SPA 라우팅: 모든 경로를 index.html로\\n" +\n' +
          '  "  location / {\\n" +\n' +
          '  "    try_files $uri $uri/ /index.html;\\n" +\n' +
          '  "  }\\n" +\n' +
          '  "\\n" +\n' +
          '  "  # 정적 파일 캐시\\n" +\n' +
          '  "  location /assets/ {\\n" +\n' +
          '  "    expires 1y;\\n" +\n' +
          '  "    add_header Cache-Control \\"public, immutable\\";\\n" +\n' +
          '  "  }\\n" +\n' +
          '  "}\\n";\n' +
          '\n' +
          '// 커스텀 Nginx 설정으로 실행\n' +
          '// docker run -d \\\n' +
          '//   -p 8080:80 \\\n' +
          '//   -v $(pwd)/dist:/usr/share/nginx/html:ro \\\n' +
          '//   -v $(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf:ro \\\n' +
          '//   nginx:alpine\n' +
          '\n' +
          '// === 이미지 레이어 확인 ===\n' +
          '// docker history nginx:alpine\n' +
          '//   → 각 레이어의 크기와 생성 명령어 확인\n' +
          '//   → 레이어는 공유되므로 같은 base image를 쓰면 디스크 절약',
        description: "bind mount로 빌드 결과물을 Nginx에 연결하고, SPA 라우팅을 위한 try_files 설정이 핵심입니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "Docker의 핵심 개념을 정리합니다.\n\n" +
        "| 개념 | 설명 | 비유 |\n" +
        "|------|------|------|\n" +
        "| 이미지 | 읽기 전용 템플릿, 레이어로 구성 | 설계도 |\n" +
        "| 컨테이너 | 이미지의 실행 인스턴스 | 실제 컨테이너 |\n" +
        "| 볼륨 | 데이터 영속 저장소 | 외부 창고 |\n" +
        "| 네트워크 | 컨테이너 간 통신 | 내부 도로 |\n" +
        "| 포트 매핑 | 호스트 ↔ 컨테이너 포트 연결 | 출입구 |\n\n" +
        "**자주 쓰는 명령어:** `run`(실행), `ps`(목록), `stop`(정지), `rm`(삭제), `logs`(로그), `exec`(셸 접속)\n\n" +
        "**컨테이너 vs VM:** 컨테이너는 호스트 커널을 공유하여 가볍고(MB 단위) 빠르며(초 단위 시작), VM은 전체 OS를 포함하여 무겁지만(GB 단위) 완전한 격리를 제공합니다.\n\n" +
        "**다음 챕터 미리보기:** Docker 이미지를 직접 만드는 Dockerfile 작성법을 배웁니다. 멀티스테이지 빌드로 최적화된 프론트엔드 이미지를 만들어 봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Docker 컨테이너는 애플리케이션과 실행 환경을 함께 패키징하여 '내 컴퓨터에서는 되는데'를 해결한다. 이미지는 불변의 템플릿이고, 컨테이너는 이미지의 실행 인스턴스다.",
  checklist: [
    "컨테이너와 가상머신의 차이를 설명할 수 있다",
    "이미지와 컨테이너의 관계를 이해한다",
    "docker run, ps, stop, rm, logs, exec 명령어를 사용할 수 있다",
    "볼륨(bind mount vs named volume)의 용도를 알고 있다",
    "포트 매핑(-p)의 원리를 이해한다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Docker 컨테이너와 가상머신(VM)의 가장 핵심적인 차이는?",
      choices: [
        "컨테이너는 Windows에서만 실행된다",
        "컨테이너는 호스트 OS 커널을 공유하고, VM은 자체 OS를 포함한다",
        "VM이 컨테이너보다 가볍고 빠르다",
        "컨테이너는 네트워크를 사용할 수 없다",
      ],
      correctIndex: 1,
      explanation: "컨테이너는 호스트 OS의 커널을 공유하므로 가볍고 빠르게 시작됩니다. VM은 하이퍼바이저 위에 완전한 게스트 OS를 실행하므로 무겁지만 더 강한 격리를 제공합니다.",
    },
    {
      id: "q2",
      question: "Docker 이미지의 특성으로 올바른 것은?",
      choices: [
        "실행 중 변경이 가능하다",
        "하나의 이미지로 하나의 컨테이너만 만들 수 있다",
        "읽기 전용이며 여러 레이어로 구성된다",
        "컨테이너가 삭제되면 이미지도 삭제된다",
      ],
      correctIndex: 2,
      explanation: "Docker 이미지는 읽기 전용(immutable)이며 여러 레이어로 구성됩니다. 하나의 이미지로 여러 컨테이너를 생성할 수 있고, 레이어는 이미지 간에 공유됩니다.",
    },
    {
      id: "q3",
      question: "docker run -d -p 8080:80 nginx에서 -p 8080:80의 의미는?",
      choices: [
        "컨테이너 포트 8080을 호스트 포트 80에 연결",
        "호스트 포트 8080을 컨테이너 포트 80에 연결",
        "8080번부터 80번까지의 포트 범위를 모두 연결",
        "컨테이너 내부에서 80포트 대신 8080포트를 사용",
      ],
      correctIndex: 1,
      explanation: "-p 옵션은 '호스트포트:컨테이너포트' 형식입니다. 호스트의 8080번 포트로 들어오는 요청이 컨테이너의 80번 포트로 전달됩니다.",
    },
    {
      id: "q4",
      question: "컨테이너가 삭제되어도 데이터를 유지하려면 무엇을 사용해야 하는가?",
      choices: [
        "Docker 네트워크",
        "Docker 볼륨",
        "Docker 이미지",
        "Docker Hub",
      ],
      correctIndex: 1,
      explanation: "볼륨(Volume)은 컨테이너의 라이프사이클과 독립적으로 데이터를 영속 저장합니다. 컨테이너를 삭제해도 볼륨의 데이터는 유지됩니다.",
    },
    {
      id: "q5",
      question: "실행 중인 컨테이너 내부에 셸로 접속하는 명령어는?",
      choices: [
        "docker logs my-app",
        "docker run -it my-app sh",
        "docker exec -it my-app sh",
        "docker attach my-app",
      ],
      correctIndex: 2,
      explanation: "docker exec -it 명령어로 실행 중인 컨테이너에 새로운 프로세스(셸)를 생성하여 접속합니다. docker run은 새 컨테이너를 생성하므로 다릅니다.",
    },
  ],
};

export default chapter;
