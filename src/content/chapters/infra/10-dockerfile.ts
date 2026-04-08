import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "10-dockerfile",
  subject: "infra",
  title: "Dockerfile 작성법",
  description: "Dockerfile의 주요 명령어, 멀티스테이지 빌드, 레이어 캐시 최적화, Node.js/Next.js 베스트 프랙티스를 학습합니다.",
  order: 10,
  group: "컨테이너",
  prerequisites: ["09-docker-basics"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Dockerfile은 **요리 레시피**와 같습니다.\n\n" +
        "**FROM**은 기본 재료를 고르는 것입니다. 한식을 만들려면 쌀밥부터 준비하듯, Node.js 앱을 만들려면 `node:20-alpine` 이미지부터 시작합니다.\n\n" +
        "**WORKDIR**은 조리대를 정하는 것입니다. 모든 작업이 이 공간에서 진행됩니다.\n\n" +
        "**COPY**는 재료를 조리대 위에 올리는 것이고, **RUN**은 실제 조리 행위(썰기, 볶기)입니다.\n\n" +
        "**CMD**는 완성된 요리를 내놓는 방법입니다. \"이 요리는 그릇에 담아 서빙하세요\"처럼, \"이 앱은 `node server.js`로 실행하세요\"를 정의합니다.\n\n" +
        "**멀티스테이지 빌드**는 조리실과 서빙 공간을 분리하는 것입니다. 조리에 필요한 도구(칼, 불판)는 주방에만 두고, 서빙할 때는 완성된 요리와 그릇만 가져갑니다. 빌드 도구를 최종 이미지에 포함하지 않으므로 크기가 크게 줄어듭니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "Dockerfile을 처음 작성할 때 흔히 겪는 문제들입니다.\n\n" +
        "1. **거대한 이미지 크기** — 빌드 도구(TypeScript, webpack)와 devDependencies가 프로덕션 이미지에 포함됩니다. 빌드에만 필요한 도구가 수백 MB를 차지합니다.\n\n" +
        "2. **느린 빌드 속도** — `COPY . .` 후 `npm install`을 하면, 소스 코드 한 줄만 바꿔도 의존성 설치를 처음부터 다시 합니다. Docker의 레이어 캐시를 활용하지 못하는 것입니다.\n\n" +
        "3. **보안 취약점** — root 사용자로 실행하면 컨테이너가 침해당했을 때 호스트에 미치는 영향이 커집니다. 불필요한 파일(`.env`, `.git`)이 이미지에 포함되기도 합니다.\n\n" +
        "4. **환경 설정 하드코딩** — 포트, DB 주소 등이 Dockerfile에 하드코딩되면 환경별 배포가 어려워집니다.\n\n" +
        "이 문제들은 모두 Dockerfile 작성 패턴으로 해결할 수 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "Dockerfile의 핵심 명령어와 베스트 프랙티스를 정리합니다.\n\n" +
        "### 주요 명령어\n" +
        "- **FROM**: 베이스 이미지 선택. `alpine` 태그가 가장 가벼움\n" +
        "- **WORKDIR**: 작업 디렉토리 설정. 이후 모든 명령의 기준 경로\n" +
        "- **COPY**: 호스트 파일을 이미지로 복사\n" +
        "- **RUN**: 빌드 시점에 명령 실행 (패키지 설치, 빌드 등)\n" +
        "- **CMD**: 컨테이너 시작 시 실행할 기본 명령\n" +
        "- **EXPOSE**: 컨테이너가 사용하는 포트 문서화 (실제 열지는 않음)\n" +
        "- **ENV / ARG**: ENV는 런타임 환경변수, ARG는 빌드 시점 변수\n\n" +
        "### 멀티스테이지 빌드\n" +
        "빌드 스테이지에서 컴파일/번들링하고, 실행 스테이지에서는 결과물만 복사합니다. `node:20`(빌드) → `nginx:alpine`(실행)으로 이미지 크기를 1GB에서 40MB로 줄일 수 있습니다.\n\n" +
        "### 레이어 캐시 최적화\n" +
        "`package.json`과 `package-lock.json`을 먼저 COPY하고 `npm ci`를 실행합니다. 의존성이 변하지 않으면 이 레이어가 캐시되어 빌드가 빨라집니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: React 앱 멀티스테이지 Dockerfile",
      content:
        "React/Vite 프로젝트의 프로덕션 Dockerfile을 멀티스테이지 빌드로 작성합니다. 레이어 캐시 최적화와 보안 설정을 포함합니다.",
      code: {
        language: "typescript",
        code:
          '// Dockerfile — React/Vite 프로젝트 멀티스테이지 빌드\n' +
          'const dockerfile =\n' +
          '  "# ===== 1단계: 빌드 스테이지 =====\\n" +\n' +
          '  "FROM node:20-alpine AS builder\\n" +\n' +
          '  "WORKDIR /app\\n" +\n' +
          '  "\\n" +\n' +
          '  "# 의존성 파일만 먼저 복사 (레이어 캐시 최적화)\\n" +\n' +
          '  "COPY package.json package-lock.json ./\\n" +\n' +
          '  "RUN npm ci\\n" +\n' +
          '  "\\n" +\n' +
          '  "# 소스 코드 복사 후 빌드\\n" +\n' +
          '  "COPY . .\\n" +\n' +
          '  "RUN npm run build\\n" +\n' +
          '  "\\n" +\n' +
          '  "# ===== 2단계: 실행 스테이지 =====\\n" +\n' +
          '  "FROM nginx:alpine\\n" +\n' +
          '  "\\n" +\n' +
          '  "# 빌드 결과물만 복사 (node_modules, 소스 코드 제외)\\n" +\n' +
          '  "COPY --from=builder /app/dist /usr/share/nginx/html\\n" +\n' +
          '  "\\n" +\n' +
          '  "# SPA 라우팅을 위한 Nginx 설정\\n" +\n' +
          '  "COPY nginx.conf /etc/nginx/conf.d/default.conf\\n" +\n' +
          '  "\\n" +\n' +
          '  "EXPOSE 80\\n" +\n' +
          '  "CMD [\\"nginx\\", \\"-g\\", \\"daemon off;\\"]\\n";\n' +
          '\n' +
          '// .dockerignore — 이미지에 포함하지 않을 파일\n' +
          'const dockerignore =\n' +
          '  "node_modules\\n" +\n' +
          '  ".git\\n" +\n' +
          '  ".env\\n" +\n' +
          '  ".env.local\\n" +\n' +
          '  "dist\\n" +\n' +
          '  "*.md\\n" +\n' +
          '  ".vscode\\n" +\n' +
          '  ".DS_Store\\n";\n' +
          '\n' +
          '// 이미지 크기 비교\n' +
          '// 싱글 스테이지 (node:20):     ~1.1GB\n' +
          '// 멀티스테이지 (nginx:alpine): ~40MB\n' +
          '// → 약 96% 크기 절감!',
        description: "package.json을 먼저 COPY하면 의존성이 변하지 않을 때 npm ci 레이어가 캐시되어 빌드가 빨라집니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: Next.js Dockerfile과 보안 설정",
      content:
        "SSR이 필요한 Next.js 앱은 Nginx가 아닌 Node.js 런타임이 필요합니다. 프로덕션에 안전한 이미지를 만드는 패턴을 실습합니다.",
      code: {
        language: "typescript",
        code:
          '// Dockerfile — Next.js 프로덕션 (standalone 모드)\n' +
          'const nextDockerfile =\n' +
          '  "# 1단계: 의존성 설치 (빌드에 필요한 전체 의존성)\\n" +\n' +
          '  "FROM node:20-alpine AS deps\\n" +\n' +
          '  "WORKDIR /app\\n" +\n' +
          '  "COPY package.json package-lock.json ./\\n" +\n' +
          '  "RUN npm ci\\n" +\n' +
          '  "\\n" +\n' +
          '  "# 2단계: 빌드 (devDependencies 포함된 node_modules로 빌드)\\n" +\n' +
          '  "FROM node:20-alpine AS builder\\n" +\n' +
          '  "WORKDIR /app\\n" +\n' +
          '  "COPY --from=deps /app/node_modules ./node_modules\\n" +\n' +
          '  "COPY . .\\n" +\n' +
          '  "RUN npm run build\\n" +\n' +
          '  "\\n" +\n' +
          '  "# 3단계: 실행 (standalone 모드로 필요한 의존성만 포함)\\n" +\n' +
          '  "FROM node:20-alpine AS runner\\n" +\n' +
          '  "WORKDIR /app\\n" +\n' +
          '  "\\n" +\n' +
          '  "# 보안: non-root 사용자 생성\\n" +\n' +
          '  "RUN addgroup --system --gid 1001 nodejs\\n" +\n' +
          '  "RUN adduser --system --uid 1001 nextjs\\n" +\n' +
          '  "\\n" +\n' +
          '  "# Next.js standalone 출력물만 복사\\n" +\n' +
          '  "COPY --from=builder /app/.next/standalone ./\\n" +\n' +
          '  "COPY --from=builder /app/.next/static ./.next/static\\n" +\n' +
          '  "COPY --from=builder /app/public ./public\\n" +\n' +
          '  "\\n" +\n' +
          '  "# non-root 사용자로 전환\\n" +\n' +
          '  "USER nextjs\\n" +\n' +
          '  "\\n" +\n' +
          '  "ENV NODE_ENV=production\\n" +\n' +
          '  "ENV PORT=3000\\n" +\n' +
          '  "EXPOSE 3000\\n" +\n' +
          '  "CMD [\\"node\\", \\"server.js\\"]\\n";\n' +
          '\n' +
          '// next.config.js — standalone 모드 활성화\n' +
          '// module.exports = { output: "standalone" };\n' +
          '// → 필요한 node_modules만 .next/standalone에 복사\n' +
          '// → 전체 node_modules 대비 ~80% 크기 절감\n' +
          '\n' +
          '// ARG vs ENV 차이\n' +
          '// ARG: 빌드 시점에만 사용 (docker build --build-arg API_URL=...)\n' +
          '// ENV: 빌드 시점 + 런타임 모두 사용\n' +
          'const argExample =\n' +
          '  "ARG NEXT_PUBLIC_API_URL\\n" +\n' +
          '  "ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}\\n" +\n' +
          '  "RUN npm run build\\n";',
        description: "Next.js standalone 모드는 필요한 의존성만 추출하여 이미지 크기를 크게 줄이고, non-root 사용자로 보안을 강화합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "Dockerfile 작성의 핵심을 정리합니다.\n\n" +
        "| 명령어 | 역할 | 핵심 포인트 |\n" +
        "|--------|------|------------|\n" +
        "| FROM | 베이스 이미지 | alpine 태그로 경량화 |\n" +
        "| WORKDIR | 작업 디렉토리 | 절대 경로 권장 |\n" +
        "| COPY | 파일 복사 | package.json 먼저 |\n" +
        "| RUN | 빌드 명령 | npm ci 사용 (npm install X) |\n" +
        "| CMD | 실행 명령 | 배열 형태 권장 |\n" +
        "| EXPOSE | 포트 문서화 | 실제 매핑은 -p 옵션 |\n\n" +
        "**멀티스테이지 빌드 3원칙:**\n" +
        "1. 빌드 스테이지: 전체 의존성 설치 + 빌드\n" +
        "2. 실행 스테이지: 빌드 결과물만 복사\n" +
        "3. 보안: non-root 사용자 + 최소 이미지\n\n" +
        "**레이어 캐시:** 자주 변하지 않는 것(package.json)을 먼저, 자주 변하는 것(소스 코드)을 나중에 COPY합니다.\n\n" +
        "**다음 챕터 미리보기:** 여러 컨테이너를 하나의 YAML로 관리하는 Docker Compose를 배웁니다. 앱+DB+Redis를 한 번에 구성하는 방법을 다룹니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "멀티스테이지 빌드로 빌드 환경과 실행 환경을 분리하면 이미지 크기를 크게 줄일 수 있다. package.json을 먼저 COPY하면 의존성 설치 레이어를 캐시하여 빌드 속도를 높인다.",
  checklist: [
    "FROM, WORKDIR, COPY, RUN, CMD의 역할을 설명할 수 있다",
    "멀티스테이지 빌드의 원리와 장점을 이해한다",
    ".dockerignore의 필요성과 설정 방법을 알고 있다",
    "레이어 캐시 최적화를 위한 COPY 순서를 설명할 수 있다",
    "non-root 사용자 설정으로 보안을 강화할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "멀티스테이지 빌드의 가장 큰 장점은?",
      choices: [
        "빌드 속도가 빨라진다",
        "최종 이미지에 빌드 도구가 포함되지 않아 크기가 줄어든다",
        "Dockerfile을 여러 파일로 분리할 수 있다",
        "환경변수를 스테이지별로 다르게 설정할 수 있다",
      ],
      correctIndex: 1,
      explanation: "멀티스테이지 빌드에서 최종 스테이지는 이전 스테이지의 결과물만 COPY합니다. 빌드 도구, devDependencies, 소스 코드가 포함되지 않아 이미지 크기가 크게 줄어듭니다.",
    },
    {
      id: "q2",
      question: "레이어 캐시를 최적화하기 위해 package.json을 소스 코드보다 먼저 COPY하는 이유는?",
      choices: [
        "package.json이 더 작은 파일이라서",
        "Node.js가 package.json을 먼저 읽어야 해서",
        "의존성이 변하지 않으면 npm ci 레이어를 캐시로 재사용할 수 있어서",
        "Docker가 알파벳 순으로 파일을 처리해서",
      ],
      correctIndex: 2,
      explanation: "Docker는 레이어가 변경되면 그 이후의 모든 레이어를 다시 빌드합니다. package.json이 변하지 않으면 npm ci 레이어가 캐시되어 소스 코드만 변경되었을 때 빌드가 빨라집니다.",
    },
    {
      id: "q3",
      question: "Dockerfile에서 ARG와 ENV의 차이는?",
      choices: [
        "ARG는 문자열만, ENV는 숫자도 지원한다",
        "ARG는 빌드 시점에만, ENV는 빌드와 런타임 모두 사용 가능하다",
        "ARG는 여러 값을, ENV는 하나의 값만 저장한다",
        "차이가 없다 — 동일하게 동작한다",
      ],
      correctIndex: 1,
      explanation: "ARG는 docker build 시점에만 사용되는 변수이고, ENV는 빌드 시점과 컨테이너 런타임 모두에서 사용할 수 있는 환경변수입니다.",
    },
    {
      id: "q4",
      question: "프로덕션 Docker 이미지에서 non-root 사용자를 사용하는 이유는?",
      choices: [
        "이미지 크기를 줄이기 위해",
        "빌드 속도를 높이기 위해",
        "컨테이너가 침해당해도 호스트 시스템 영향을 최소화하기 위해",
        "Docker Hub 정책에서 필수로 요구해서",
      ],
      correctIndex: 2,
      explanation: "non-root 사용자로 실행하면 컨테이너가 침해당했을 때 공격자의 권한이 제한되어 호스트 시스템에 대한 피해를 줄일 수 있습니다. 이는 보안 베스트 프랙티스입니다.",
    },
    {
      id: "q5",
      question: ".dockerignore에 node_modules를 추가하는 이유는?",
      choices: [
        "컨테이너에서 Node.js를 사용하지 않으므로",
        "호스트의 node_modules가 이미지에 포함되면 OS 호환성 문제가 생기고 빌드 컨텍스트가 커지므로",
        "npm install이 자동으로 무시하므로",
        "Docker가 node_modules를 인식하지 못하므로",
      ],
      correctIndex: 1,
      explanation: "호스트의 node_modules는 호스트 OS에 맞게 컴파일된 네이티브 모듈을 포함할 수 있어 Linux 컨테이너에서 오류를 일으킵니다. 또한 수백 MB의 불필요한 파일이 빌드 컨텍스트에 포함되어 빌드가 느려집니다.",
    },
  ],
};

export default chapter;
