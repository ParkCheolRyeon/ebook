import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "11-file-system",
  subject: "cs",
  title: "파일 시스템",
  description:
    "파일 시스템의 기본 개념부터 Node.js의 fs 모듈, 브라우저의 File API까지 프론트엔드 관점에서 학습합니다.",
  order: 11,
  group: "운영체제",
  prerequisites: ["09-process-thread"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "파일 시스템은 대형 도서관의 분류 체계와 같습니다.\n\n" +
        "**파일**은 한 권의 책입니다. 내용(데이터)이 있고, 표지(메타데이터: 이름, 크기, 수정일)가 있습니다.\n\n" +
        "**디렉토리(폴더)**는 서가의 분류 선반입니다. '소설 > 한국 > 현대'처럼 계층적으로 정리합니다.\n\n" +
        "**파일 디스크립터(File Descriptor)**는 대출증입니다. 책을 빌리면(파일을 열면) 대출증 번호(정수)를 받고, " +
        "이 번호로 책을 읽거나 반납(닫기)합니다. 대출증을 반납하지 않으면 다른 사람이 빌릴 수 없습니다(리소스 누수).\n\n" +
        "**스트림(Stream)**은 파이프라인입니다. 물(데이터)을 한꺼번에 버킷으로 옮기는 대신, 파이프를 연결해 조금씩 흘려보냅니다. " +
        "큰 파일도 메모리를 적게 사용하면서 처리할 수 있습니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드 개발자가 파일 시스템을 알아야 하는 이유는 무엇일까요?\n\n" +
        "1. **파일 업로드/다운로드** — 사용자가 드래그 앤 드롭으로 파일을 올리거나, 서버에서 파일을 다운로드하는 기능은 거의 모든 웹앱에서 필요합니다.\n\n" +
        "2. **대용량 파일 처리** — 수백 MB 파일을 한 번에 메모리에 올리면 브라우저가 멈춥니다. 스트림이나 청크 단위 처리가 필요합니다.\n\n" +
        "3. **빌드 도구와 번들러** — Webpack, Vite 등의 빌드 도구는 Node.js의 fs 모듈로 수천 개의 파일을 읽고, 변환하고, 번들을 생성합니다.\n\n" +
        "4. **이미지/미디어 미리보기** — 파일을 서버에 올리기 전에 브라우저에서 미리보기를 보여주려면 File API와 Blob을 이해해야 합니다.\n\n" +
        "5. **바이너리 데이터 처리** — PDF 뷰어, 엑셀 파싱, 이미지 편집 등 바이너리 데이터를 다루는 웹앱이 늘고 있습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 파일 시스템 기본 개념\n\n" +
        "운영체제는 하드디스크의 물리적 저장 공간을 **파일**과 **디렉토리**라는 논리적 단위로 추상화합니다.\n\n" +
        "- **inode**: 파일의 메타데이터(크기, 권한, 위치)를 저장하는 데이터 구조\n" +
        "- **파일 디스크립터**: 프로세스가 열린 파일을 참조하는 정수 (0: stdin, 1: stdout, 2: stderr)\n" +
        "- **경로(Path)**: 파일의 위치를 나타내는 문자열 (절대경로 vs 상대경로)\n\n" +
        "### 브라우저의 File API\n\n" +
        "브라우저는 보안상 로컬 파일 시스템에 직접 접근할 수 없습니다. 대신 사용자가 명시적으로 선택한 파일만 접근 가능합니다:\n\n" +
        "- **File**: 사용자가 선택한 파일 객체 (이름, 크기, 타입, 수정일)\n" +
        "- **Blob**: Binary Large Object. 바이너리 데이터의 불변 덩어리\n" +
        "- **ArrayBuffer**: 고정 길이 바이너리 데이터 버퍼\n" +
        "- **FileReader**: 파일을 비동기적으로 읽는 API\n" +
        "- **URL.createObjectURL**: Blob으로부터 임시 URL 생성 (이미지 미리보기)\n\n" +
        "### Node.js의 fs 모듈\n\n" +
        "Node.js는 운영체제의 파일 시스템에 직접 접근할 수 있습니다:\n\n" +
        "- **fs.readFile / fs.writeFile**: 파일 전체를 한 번에 읽기/쓰기\n" +
        "- **fs.createReadStream**: 파일을 스트림으로 읽기 (대용량 처리)\n" +
        "- **fs/promises**: Promise 기반 비동기 API (권장)\n\n" +
        "### 스트림(Stream)\n\n" +
        "스트림은 데이터를 청크 단위로 처리하는 패턴입니다:\n" +
        "- **Readable**: 데이터를 읽을 수 있는 스트림 (파일 읽기, HTTP 응답)\n" +
        "- **Writable**: 데이터를 쓸 수 있는 스트림 (파일 쓰기, HTTP 요청)\n" +
        "- **Transform**: 데이터를 변환하는 스트림 (압축, 암호화)\n" +
        "- **pipe()**: 스트림을 연결하는 메서드",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Node.js 파일 처리 패턴",
      content:
        "Node.js에서 파일을 안전하고 효율적으로 처리하는 방법을 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          'import { readFile, writeFile, stat } from "fs/promises";\n' +
          'import { createReadStream, createWriteStream } from "fs";\n' +
          'import { pipeline } from "stream/promises";\n' +
          'import { createGzip } from "zlib";\n' +
          '\n' +
          '// === 기본 파일 읽기/쓰기 (Promise 기반) ===\n' +
          'async function readConfig(path: string): Promise<object> {\n' +
          '  const content = await readFile(path, "utf-8");\n' +
          '  return JSON.parse(content);\n' +
          '}\n' +
          '\n' +
          'async function writeConfig(path: string, data: object): Promise<void> {\n' +
          '  const content = JSON.stringify(data, null, 2);\n' +
          '  await writeFile(path, content, "utf-8");\n' +
          '}\n' +
          '\n' +
          '// === 대용량 파일: 스트림 사용 ===\n' +
          '// 메모리에 전체 파일을 올리지 않고 청크 단위로 처리\n' +
          'async function copyAndCompress(\n' +
          '  src: string,\n' +
          '  dest: string\n' +
          '): Promise<void> {\n' +
          '  // pipeline: 스트림을 연결하고 에러/정리를 자동 처리\n' +
          '  await pipeline(\n' +
          '    createReadStream(src),   // 파일 읽기 스트림\n' +
          '    createGzip(),            // gzip 압축 변환 스트림\n' +
          '    createWriteStream(dest)  // 파일 쓰기 스트림\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === 파일 정보 조회 ===\n' +
          'async function getFileInfo(path: string) {\n' +
          '  const info = await stat(path);\n' +
          '  return {\n' +
          '    size: info.size,              // 바이트 단위\n' +
          '    isDirectory: info.isDirectory(),\n' +
          '    modified: info.mtime,         // 수정 시간\n' +
          '    created: info.birthtime,      // 생성 시간\n' +
          '  };\n' +
          '}',
        description:
          "Node.js의 fs/promises 모듈은 Promise 기반의 비동기 파일 API를 제공합니다. 대용량 파일은 스트림으로 처리하여 메모리 효율을 높입니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 브라우저 파일 처리",
      content:
        "브라우저에서 파일 업로드, 미리보기, 다운로드를 구현하는 실습입니다.",
      code: {
        language: "typescript",
        code:
          '// === 1. 드래그 앤 드롭 파일 업로드 ===\n' +
          'const dropZone = document.getElementById("drop-zone")!;\n' +
          '\n' +
          'dropZone.addEventListener("dragover", (e: DragEvent) => {\n' +
          '  e.preventDefault(); // 기본 동작 방지 (필수!)\n' +
          '  dropZone.classList.add("dragging");\n' +
          '});\n' +
          '\n' +
          'dropZone.addEventListener("drop", (e: DragEvent) => {\n' +
          '  e.preventDefault();\n' +
          '  const files = e.dataTransfer?.files;\n' +
          '  if (files) handleFiles(Array.from(files));\n' +
          '});\n' +
          '\n' +
          '// === 2. 파일 읽기 및 이미지 미리보기 ===\n' +
          'function handleFiles(files: File[]): void {\n' +
          '  for (const file of files) {\n' +
          '    console.log(`이름: ${file.name}, 크기: ${file.size}바이트`);\n' +
          '    console.log(`타입: ${file.type}, 수정일: ${file.lastModified}`);\n' +
          '\n' +
          '    if (file.type.startsWith("image/")) {\n' +
          '      // 방법 1: URL.createObjectURL (빠르고 간단)\n' +
          '      const url = URL.createObjectURL(file);\n' +
          '      const img = document.createElement("img");\n' +
          '      img.src = url;\n' +
          '      img.onload = () => URL.revokeObjectURL(url); // 메모리 해제!\n' +
          '      document.body.appendChild(img);\n' +
          '    }\n' +
          '\n' +
          '    if (file.type === "text/plain") {\n' +
          '      // 방법 2: FileReader로 텍스트 읽기\n' +
          '      const reader = new FileReader();\n' +
          '      reader.onload = () => console.log(reader.result);\n' +
          '      reader.readAsText(file, "utf-8");\n' +
          '    }\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          '// === 3. Blob으로 파일 다운로드 생성 ===\n' +
          'function downloadJSON(data: object, filename: string): void {\n' +
          '  const json = JSON.stringify(data, null, 2);\n' +
          '  const blob = new Blob([json], { type: "application/json" });\n' +
          '  const url = URL.createObjectURL(blob);\n' +
          '  const a = document.createElement("a");\n' +
          '  a.href = url;\n' +
          '  a.download = filename;\n' +
          '  a.click();\n' +
          '  URL.revokeObjectURL(url); // 메모리 해제\n' +
          '}\n' +
          '\n' +
          '// === 4. ArrayBuffer로 바이너리 데이터 처리 ===\n' +
          'async function readBinaryFile(file: File): Promise<Uint8Array> {\n' +
          '  const buffer = await file.arrayBuffer();\n' +
          '  return new Uint8Array(buffer);\n' +
          '}',
        description:
          "브라우저의 File API를 사용한 드래그 앤 드롭, 이미지 미리보기, JSON 다운로드, 바이너리 처리 예제입니다. URL.revokeObjectURL로 메모리를 해제하는 것을 잊지 마세요.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "### 파일 시스템 핵심\n" +
        "- 파일 = 데이터 + 메타데이터, 디렉토리 = 계층적 분류\n" +
        "- 파일 디스크립터 = 열린 파일에 대한 참조 (정수)\n" +
        "- 스트림 = 데이터를 청크 단위로 처리하는 패턴\n\n" +
        "### 브라우저 (File API)\n" +
        "- File, Blob, ArrayBuffer, FileReader\n" +
        "- URL.createObjectURL로 미리보기, revokeObjectURL로 해제\n" +
        "- 보안상 사용자가 명시적으로 선택한 파일만 접근 가능\n\n" +
        "### Node.js (fs 모듈)\n" +
        "- fs/promises: Promise 기반 비동기 API (권장)\n" +
        "- createReadStream/createWriteStream: 대용량 파일 스트림 처리\n" +
        "- pipeline: 스트림 연결 및 에러/정리 자동 처리\n\n" +
        "**핵심:** 브라우저에서는 File API로 사용자 파일을 처리하고, Node.js에서는 fs 모듈로 서버 파일 시스템에 접근합니다. 대용량 파일은 반드시 스트림으로 처리하세요.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "브라우저는 File API로 사용자가 선택한 파일만 접근하고, Node.js는 fs 모듈로 파일 시스템을 직접 다룬다. 대용량 파일은 스트림으로 처리한다.",
  checklist: [
    "파일 디스크립터와 스트림의 개념을 설명할 수 있다",
    "브라우저의 File, Blob, ArrayBuffer의 차이를 구분할 수 있다",
    "Node.js의 fs/promises를 사용하여 파일을 비동기로 읽고 쓸 수 있다",
    "드래그 앤 드롭 파일 업로드를 구현할 수 있다",
    "URL.createObjectURL과 revokeObjectURL로 이미지 미리보기를 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "브라우저에서 자바스크립트가 사용자의 로컬 파일에 접근하려면?",
      choices: [
        "fs 모듈을 import하여 직접 접근한다",
        "사용자가 input이나 드래그 앤 드롭으로 명시적으로 파일을 선택해야 한다",
        "서버에 요청하여 파일을 가져온다",
        "navigator.fileSystem API로 자유롭게 접근한다",
      ],
      correctIndex: 1,
      explanation:
        "브라우저는 보안상 로컬 파일 시스템에 자유롭게 접근할 수 없습니다. 사용자가 <input type='file'>이나 드래그 앤 드롭으로 명시적으로 파일을 선택해야만 해당 파일에 접근할 수 있습니다.",
    },
    {
      id: "q2",
      question: "Node.js에서 100GB 로그 파일을 처리할 때 가장 적절한 방법은?",
      choices: [
        "fs.readFileSync로 동기적으로 읽는다",
        "fs.readFile로 한 번에 메모리에 로드한다",
        "createReadStream으로 스트림 처리한다",
        "파일 내용을 문자열 변수에 저장한다",
      ],
      correctIndex: 2,
      explanation:
        "100GB 파일을 readFile로 한 번에 읽으면 메모리 부족으로 프로세스가 종료됩니다. createReadStream은 데이터를 청크(기본 64KB) 단위로 읽어 처리하므로 메모리를 효율적으로 사용합니다.",
    },
    {
      id: "q3",
      question: "URL.createObjectURL을 사용한 후 revokeObjectURL을 호출해야 하는 이유는?",
      choices: [
        "CORS 에러를 방지하기 위해",
        "URL 형식이 잘못되었을 때를 대비하여",
        "Blob 참조를 해제하여 메모리 누수를 방지하기 위해",
        "서버에 알림을 보내기 위해",
      ],
      correctIndex: 2,
      explanation:
        "createObjectURL은 Blob에 대한 참조를 내부적으로 유지하여 GC가 Blob을 회수하지 못합니다. revokeObjectURL을 호출하면 이 참조가 해제되어 GC가 메모리를 회수할 수 있습니다.",
    },
    {
      id: "q4",
      question: "File과 Blob의 관계는?",
      choices: [
        "File이 Blob을 포함한다",
        "Blob이 File을 포함한다",
        "File은 Blob을 상속하며, 이름과 수정일 정보가 추가된다",
        "File과 Blob은 관계가 없다",
      ],
      correctIndex: 2,
      explanation:
        "File은 Blob의 하위 클래스(extends)입니다. Blob의 모든 기능을 가지면서, name(파일명)과 lastModified(수정일) 속성이 추가됩니다.",
    },
    {
      id: "q5",
      question: "Node.js의 스트림에서 pipe() 메서드의 역할은?",
      choices: [
        "파일을 삭제하는 명령어",
        "읽기 스트림의 데이터를 쓰기 스트림으로 자동 연결한다",
        "두 파일을 병합하는 명령어",
        "스트림의 에러를 무시하는 명령어",
      ],
      correctIndex: 1,
      explanation:
        "pipe()는 Readable 스트림의 출력을 Writable 스트림의 입력으로 연결합니다. 데이터가 자동으로 흘러가며, 백프레셔(backpressure)도 자동 관리됩니다. 다만 에러 처리는 pipeline()을 사용하는 것이 더 안전합니다.",
    },
  ],
};

export default chapter;
