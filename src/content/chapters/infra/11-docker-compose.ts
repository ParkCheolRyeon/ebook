import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "11-docker-compose",
  subject: "infra",
  title: "Docker Compose와 멀티 컨테이너",
  description: "docker-compose.yml로 여러 컨테이너를 정의하고, 개발 환경 전체 스택을 한 번에 구성하는 방법을 학습합니다.",
  order: 11,
  group: "컨테이너",
  prerequisites: ["10-dockerfile"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Docker Compose는 **오케스트라 악보**와 같습니다.\n\n" +
        "개별 Docker 컨테이너가 각각의 **악기 연주자**라면, Docker Compose는 모든 악기의 파트가 기록된 **총보(full score)**입니다. 지휘자(docker compose up)가 손을 올리면, 모든 연주자가 자기 파트를 알아서 연주하기 시작합니다.\n\n" +
        "**서비스(services)**는 각 악기 파트입니다. 바이올린(앱 서버), 첼로(데이터베이스), 피아노(Redis)가 각자 독립적으로 연주하지만, 함께 하나의 교향곡(애플리케이션)을 만들어냅니다.\n\n" +
        "**네트워크**는 무대 위의 공간 배치입니다. 같은 무대에 있는 연주자들은 서로의 소리를 듣고(통신하고), 관객(외부)에게는 지정된 출구(포트)로만 소리가 전달됩니다.\n\n" +
        "**볼륨**은 악보 보관함입니다. 연주가 끝나도(컨테이너 삭제) 악보(데이터)는 보관함에 남아 다음 연주에 사용할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "실제 프로젝트에서는 단일 컨테이너로 충분하지 않습니다.\n\n" +
        "1. **복잡한 수동 실행** — 앱 서버, PostgreSQL, Redis를 각각 `docker run`으로 실행하면 네트워크 연결, 볼륨 마운트, 환경변수 등을 매번 긴 명령어로 입력해야 합니다. 실수가 잦고 재현이 어렵습니다.\n\n" +
        "2. **서비스 간 의존성** — 앱 서버가 시작되기 전에 DB가 준비되어 있어야 합니다. 단순히 순서를 지정하는 것으로는 부족하고, DB가 실제로 연결을 받을 준비가 되었는지 확인해야 합니다.\n\n" +
        "3. **환경별 설정 분리** — 개발 환경에서는 디버그 모드, 소스 마운트, 핫 리로드가 필요하고, 프로덕션에서는 최적화된 빌드, 로깅, 리소스 제한이 필요합니다.\n\n" +
        "4. **새 팀원 온보딩** — \"README에 적힌 순서대로 설치하세요\"보다 `docker compose up` 한 줄이 훨씬 빠르고 정확합니다.\n\n" +
        "이 모든 것을 하나의 YAML 파일로 선언적으로 관리할 수 있다면 어떨까요?",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Docker Compose는 **선언적 멀티 컨테이너 관리** 도구입니다.\n\n" +
        "### docker-compose.yml 구조\n" +
        "YAML 파일에 서비스(컨테이너), 네트워크, 볼륨을 선언하고 `docker compose up`으로 전체를 실행합니다. 각 서비스의 이름이 내부 DNS 호스트명이 되어 서비스 간 통신이 간편합니다.\n\n" +
        "### depends_on과 헬스체크\n" +
        "`depends_on`으로 서비스 시작 순서를 지정하고, `healthcheck`로 서비스가 실제로 준비되었는지 확인합니다. `condition: service_healthy`를 사용하면 DB가 완전히 준비된 후에 앱이 시작됩니다.\n\n" +
        "### 환경변수와 .env\n" +
        "`.env` 파일에 공통 변수를 정의하고, `environment` 또는 `env_file`로 컨테이너에 전달합니다.\n\n" +
        "### 개발 vs 프로덕션\n" +
        "기본 `docker-compose.yml`에 `docker-compose.override.yml`(개발)이나 `docker-compose.prod.yml`(프로덕션)을 오버레이하여 환경별 설정을 분리합니다.\n\n" +
        "### profiles\n" +
        "디버깅 도구, 모니터링 등 선택적 서비스를 프로파일로 그룹핑하여 필요할 때만 실행합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 전체 스택 docker-compose.yml",
      content:
        "프론트엔드 앱 + API 서버 + PostgreSQL + Redis로 구성된 전체 개발 스택을 docker-compose.yml로 정의합니다.",
      code: {
        language: "typescript",
        code:
          '// docker-compose.yml — 풀스택 개발 환경\n' +
          'const composeFile =\n' +
          '  "# version 필드는 Compose V2+에서 더 이상 필요하지 않습니다 (무시됨)\\n" +\n' +
          '  "\\n" +\n' +
          '  "services:\\n" +\n' +
          '  "  # 프론트엔드 앱\\n" +\n' +
          '  "  frontend:\\n" +\n' +
          '  "    build:\\n" +\n' +
          '  "      context: ./frontend\\n" +\n' +
          '  "      dockerfile: Dockerfile\\n" +\n' +
          '  "    ports:\\n" +\n' +
          '  "      - \\"3000:3000\\"\\n" +\n' +
          '  "    environment:\\n" +\n' +
          '  "      - VITE_API_URL=http://localhost:8080\\n" +\n' +
          '  "    depends_on:\\n" +\n' +
          '  "      - api\\n" +\n' +
          '  "\\n" +\n' +
          '  "  # API 서버\\n" +\n' +
          '  "  api:\\n" +\n' +
          '  "    build: ./api\\n" +\n' +
          '  "    ports:\\n" +\n' +
          '  "      - \\"8080:8080\\"\\n" +\n' +
          '  "    environment:\\n" +\n' +
          '  "      - DATABASE_URL=postgres://user:pass@db:5432/myapp\\n" +\n' +
          '  "      - REDIS_URL=redis://cache:6379\\n" +\n' +
          '  "    depends_on:\\n" +\n' +
          '  "      db:\\n" +\n' +
          '  "        condition: service_healthy\\n" +\n' +
          '  "      cache:\\n" +\n' +
          '  "        condition: service_started\\n" +\n' +
          '  "\\n" +\n' +
          '  "  # PostgreSQL 데이터베이스\\n" +\n' +
          '  "  db:\\n" +\n' +
          '  "    image: postgres:16-alpine\\n" +\n' +
          '  "    environment:\\n" +\n' +
          '  "      - POSTGRES_USER=user\\n" +\n' +
          '  "      - POSTGRES_PASSWORD=pass\\n" +\n' +
          '  "      - POSTGRES_DB=myapp\\n" +\n' +
          '  "    volumes:\\n" +\n' +
          '  "      - pgdata:/var/lib/postgresql/data\\n" +\n' +
          '  "    healthcheck:\\n" +\n' +
          '  "      test: [\\"CMD-SHELL\\", \\"pg_isready -U user\\"]\\n" +\n' +
          '  "      interval: 5s\\n" +\n' +
          '  "      timeout: 5s\\n" +\n' +
          '  "      retries: 5\\n" +\n' +
          '  "\\n" +\n' +
          '  "  # Redis 캐시\\n" +\n' +
          '  "  cache:\\n" +\n' +
          '  "    image: redis:7-alpine\\n" +\n' +
          '  "    ports:\\n" +\n' +
          '  "      - \\"6379:6379\\"\\n" +\n' +
          '  "\\n" +\n' +
          '  "volumes:\\n" +\n' +
          '  "  pgdata:  # named volume — 컨테이너 삭제 후에도 DB 데이터 유지\\n";',
        description: "서비스 이름(db, cache)이 내부 DNS 호스트명이 되어 DATABASE_URL에서 'db:5432'로 바로 접근할 수 있습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 개발 환경 오버라이드와 Watch 모드",
      content:
        "개발 환경에서는 소스 코드를 마운트하여 핫 리로드를 활성화하고, 디버깅 도구를 추가합니다. docker-compose.override.yml과 watch 모드를 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// docker-compose.override.yml — 개발 전용 설정\n' +
          '// (docker compose up 시 자동으로 병합됨)\n' +
          'const devOverride =\n' +
          '  "services:\\n" +\n' +
          '  "  frontend:\\n" +\n' +
          '  "    # 소스 코드 마운트 — 호스트 변경이 컨테이너에 반영\\n" +\n' +
          '  "    volumes:\\n" +\n' +
          '  "      - ./frontend/src:/app/src\\n" +\n' +
          '  "    # Vite 개발 서버로 실행\\n" +\n' +
          '  "    command: npm run dev\\n" +\n' +
          '  "\\n" +\n' +
          '  "  api:\\n" +\n' +
          '  "    volumes:\\n" +\n' +
          '  "      - ./api/src:/app/src\\n" +\n' +
          '  "    command: npm run dev\\n" +\n' +
          '  "    # 디버그 포트 노출\\n" +\n' +
          '  "    ports:\\n" +\n' +
          '  "      - \\"9229:9229\\"\\n" +\n' +
          '  "\\n" +\n' +
          '  "  # DB 관리 도구 (개발 환경에서만)\\n" +\n' +
          '  "  adminer:\\n" +\n' +
          '  "    image: adminer\\n" +\n' +
          '  "    ports:\\n" +\n' +
          '  "      - \\"8888:8080\\"\\n" +\n' +
          '  "    profiles: [\\"debug\\"]  # --profile debug 때만 실행\\n";\n' +
          '\n' +
          '// === Docker Compose Watch 모드 (v2.22+) ===\n' +
          '// 파일 변경 감지 → 자동 sync/rebuild\n' +
          'const watchConfig =\n' +
          '  "services:\\n" +\n' +
          '  "  frontend:\\n" +\n' +
          '  "    develop:\\n" +\n' +
          '  "      watch:\\n" +\n' +
          '  "        # src 변경 → 컨테이너에 자동 sync\\n" +\n' +
          '  "        - action: sync\\n" +\n' +
          '  "          path: ./frontend/src\\n" +\n' +
          '  "          target: /app/src\\n" +\n' +
          '  "        # package.json 변경 → 컨테이너 재빌드\\n" +\n' +
          '  "        - action: rebuild\\n" +\n' +
          '  "          path: ./frontend/package.json\\n";\n' +
          '\n' +
          '// .env 파일 — 공통 환경변수\n' +
          'const envFile =\n' +
          '  "COMPOSE_PROJECT_NAME=myapp\\n" +\n' +
          '  "POSTGRES_USER=user\\n" +\n' +
          '  "POSTGRES_PASSWORD=pass\\n" +\n' +
          '  "POSTGRES_DB=myapp\\n";\n' +
          '\n' +
          '// === 주요 명령어 ===\n' +
          '// docker compose up -d         → 전체 스택 백그라운드 실행\n' +
          '// docker compose up --build    → 이미지 재빌드 후 실행\n' +
          '// docker compose down          → 전체 스택 중지+삭제\n' +
          '// docker compose down -v       → 볼륨까지 삭제 (DB 초기화)\n' +
          '// docker compose logs -f api   → 특정 서비스 로그 스트림\n' +
          '// docker compose --profile debug up  → debug 프로파일 포함 실행\n' +
          '// docker compose watch         → watch 모드 실행',
        description: "override 파일은 자동 병합되며, profiles로 선택적 서비스를, watch로 개발 시 자동 동기화를 구현합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "Docker Compose의 핵심을 정리합니다.\n\n" +
        "| 개념 | 역할 | 핵심 |\n" +
        "|------|------|------|\n" +
        "| services | 컨테이너 정의 | 이미지/빌드, 포트, 환경변수 |\n" +
        "| volumes | 데이터 영속성 | named volume으로 DB 데이터 보존 |\n" +
        "| networks | 서비스 간 통신 | 서비스 이름이 DNS 호스트명 |\n" +
        "| depends_on | 시작 순서 | healthcheck로 준비 상태 확인 |\n" +
        "| profiles | 선택적 서비스 | 디버깅 도구 등 |\n" +
        "| watch | 파일 변경 감지 | sync/rebuild 자동화 |\n\n" +
        "**환경 분리 전략:**\n" +
        "- `docker-compose.yml`: 공통 설정 (서비스 정의, 이미지)\n" +
        "- `docker-compose.override.yml`: 개발 설정 (자동 적용)\n" +
        "- `docker-compose.prod.yml`: 프로덕션 설정 (`-f`로 지정)\n\n" +
        "**핵심:** `docker compose up` 한 줄로 앱+DB+Redis 전체 스택을 띄울 수 있습니다. 새 팀원은 Docker만 설치하면 됩니다.\n\n" +
        "**다음 챕터 미리보기:** 코드를 합치고 빌드하고 배포하는 전 과정을 자동화하는 CI/CD의 개념과 파이프라인 구조를 배웁니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "Docker Compose는 여러 컨테이너를 하나의 YAML 파일로 정의하고 한 번에 실행한다. 로컬에서 앱+DB+Redis 같은 전체 스택을 docker compose up 한 줄로 띄울 수 있다.",
  checklist: [
    "docker-compose.yml의 services, volumes, networks 구조를 이해한다",
    "depends_on과 healthcheck를 활용한 서비스 순서 제어를 할 수 있다",
    "개발/프로덕션 Compose 파일을 분리하는 방법을 알고 있다",
    "profiles로 선택적 서비스를 관리할 수 있다",
    "docker compose up, down, logs 등 주요 명령어를 사용할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Docker Compose에서 서비스 이름이 자동으로 제공하는 기능은?",
      choices: [
        "SSL 인증서 생성",
        "내부 DNS 호스트명으로 사용되어 서비스 간 통신이 가능",
        "자동 로드 밸런싱",
        "서비스 모니터링",
      ],
      correctIndex: 1,
      explanation: "Docker Compose는 각 서비스 이름을 내부 DNS 호스트명으로 등록합니다. 예를 들어 'db'라는 서비스에 'db:5432'로 바로 접근할 수 있습니다.",
    },
    {
      id: "q2",
      question: "depends_on에 condition: service_healthy를 설정하려면 추가로 필요한 것은?",
      choices: [
        "restart 정책",
        "해당 서비스의 healthcheck 설정",
        "네트워크 설정",
        "볼륨 설정",
      ],
      correctIndex: 1,
      explanation: "condition: service_healthy는 대상 서비스의 healthcheck가 성공할 때까지 대기합니다. 대상 서비스에 healthcheck(test, interval, timeout 등)가 정의되어 있어야 합니다.",
    },
    {
      id: "q3",
      question: "docker compose down -v 명령의 -v 플래그가 하는 일은?",
      choices: [
        "verbose 로그 출력",
        "가상 네트워크 삭제",
        "named volume까지 삭제하여 데이터 초기화",
        "볼륨 목록 표시",
      ],
      correctIndex: 2,
      explanation: "-v 플래그는 docker-compose.yml에 정의된 named volume을 함께 삭제합니다. DB 데이터를 완전히 초기화하고 싶을 때 사용합니다.",
    },
    {
      id: "q4",
      question: "docker-compose.override.yml 파일의 특징은?",
      choices: [
        "프로덕션 환경에서만 적용된다",
        "-f 플래그로 명시적으로 지정해야 적용된다",
        "docker compose up 시 자동으로 docker-compose.yml과 병합된다",
        "docker-compose.yml을 완전히 대체한다",
      ],
      correctIndex: 2,
      explanation: "docker-compose.override.yml은 docker compose up 시 자동으로 docker-compose.yml과 병합됩니다. 주로 개발 환경 전용 설정(소스 마운트, 디버그 포트 등)을 넣습니다.",
    },
    {
      id: "q5",
      question: "Docker Compose의 profiles 기능의 용도는?",
      choices: [
        "서비스별 리소스 제한을 설정하기 위해",
        "특정 서비스를 선택적으로 실행하기 위해",
        "네트워크 프로필을 관리하기 위해",
        "사용자 인증 프로필을 설정하기 위해",
      ],
      correctIndex: 1,
      explanation: "profiles를 사용하면 디버깅 도구, 모니터링 등 항상 필요하지 않은 서비스를 그룹핑하여 --profile 플래그로 필요할 때만 실행할 수 있습니다.",
    },
  ],
};

export default chapter;
