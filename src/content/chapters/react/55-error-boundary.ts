import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "55-error-boundary",
  subject: "react",
  title: "에러 바운더리",
  description:
    "Error Boundary 클래스 컴포넌트, getDerivedStateFromError, componentDidCatch, react-error-boundary 라이브러리, 에러 복구 전략을 학습합니다.",
  order: 55,
  group: "설계 패턴과 아키텍처",
  prerequisites: ["54-container-presentational"],
  estimatedMinutes: 25,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "Error Boundary는 **전기 차단기(브레이커)**와 같습니다.\n\n" +
        "집에서 한 방의 전기 기구에 문제가 생기면, 차단기가 그 회로만 끊어서 나머지 방은 정상적으로 사용할 수 있게 합니다.\n\n" +
        "Error Boundary도 마찬가지입니다. 하위 컴포넌트에서 에러가 발생하면, 그 영역만 폴백 UI로 교체하고 나머지 앱은 정상 동작합니다.\n\n" +
        "차단기가 없으면(Error Boundary가 없으면) 한 방의 합선이 **전체 집의 전기를 다 끊어버립니다** — 즉, 앱 전체가 흰 화면(White Screen)이 됩니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "React에서 렌더링 중 에러가 발생하면 어떤 일이 일어날까요?\n\n" +
        "1. **전체 앱 크래시** — Error Boundary 없이 렌더링 에러가 발생하면 전체 컴포넌트 트리가 언마운트됩니다. 사용자는 빈 화면을 봅니다.\n\n" +
        "2. **try-catch 한계** — 일반 try-catch는 렌더링 중 발생하는 에러를 잡지 못합니다. JSX 반환 과정에서의 에러는 React 내부에서 발생합니다.\n\n" +
        "3. **함수 컴포넌트 미지원** — Error Boundary는 클래스 컴포넌트의 `getDerivedStateFromError`와 `componentDidCatch` 생명주기 메서드로만 구현할 수 있습니다.\n\n" +
        "4. **에러 복구** — 에러가 발생한 후 사용자가 다시 시도할 수 있는 방법이 필요합니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### Error Boundary 클래스 컴포넌트\n" +
        "`getDerivedStateFromError`로 에러 상태를 업데이트하고, `componentDidCatch`로 에러를 로깅합니다.\n\n" +
        "### Error Boundary가 잡는 에러\n" +
        "- 렌더링 중 발생한 에러\n" +
        "- 생명주기 메서드에서 발생한 에러\n" +
        "- 자식 컴포넌트 트리의 에러\n\n" +
        "### Error Boundary가 잡지 못하는 에러\n" +
        "- 이벤트 핸들러 (try-catch 사용)\n" +
        "- 비동기 코드 (Promise, setTimeout)\n" +
        "- 서버 사이드 렌더링\n" +
        "- Error Boundary 자체에서 발생한 에러\n\n" +
        "### react-error-boundary 라이브러리\n" +
        "클래스 컴포넌트를 직접 작성하지 않아도 되는 선언적 API를 제공합니다. `ErrorBoundary` 컴포넌트와 `useErrorBoundary` Hook을 제공합니다.\n\n" +
        "### 에러 복구 전략\n" +
        "- **resetKeys**: 특정 값이 변경되면 에러 상태를 자동 리셋\n" +
        "- **onReset**: 리셋 시 추가 작업(캐시 초기화 등) 수행\n" +
        "- **다시 시도 버튼**: 사용자가 수동으로 에러를 리셋",
    },
    {
      type: "pseudocode",
      title: "기술 구현: Error Boundary 내부 동작",
      content:
        "Error Boundary의 구현 원리를 살펴봅시다.",
      code: {
        language: "typescript",
        code:
          '// === 기본 Error Boundary 클래스 ===\n' +
          'interface ErrorBoundaryState {\n' +
          '  hasError: boolean;\n' +
          '  error: Error | null;\n' +
          '}\n' +
          '\n' +
          'class ErrorBoundary extends React.Component<\n' +
          '  { children: React.ReactNode; fallback: React.ReactNode },\n' +
          '  ErrorBoundaryState\n' +
          '> {\n' +
          '  state: ErrorBoundaryState = { hasError: false, error: null };\n' +
          '\n' +
          '  // 렌더링 중 에러 발생 시 호출\n' +
          '  // 에러 상태를 업데이트하여 폴백 UI를 렌더링\n' +
          '  static getDerivedStateFromError(error: Error): ErrorBoundaryState {\n' +
          '    return { hasError: true, error };\n' +
          '  }\n' +
          '\n' +
          '  // 에러 정보를 로깅 (사이드 이펙트)\n' +
          '  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {\n' +
          '    console.error("Error caught by boundary:", error);\n' +
          '    console.error("Component stack:", errorInfo.componentStack);\n' +
          '    // 에러 리포팅 서비스로 전송\n' +
          '    reportError({ error, componentStack: errorInfo.componentStack });\n' +
          '  }\n' +
          '\n' +
          '  render() {\n' +
          '    if (this.state.hasError) {\n' +
          '      return this.props.fallback;\n' +
          '    }\n' +
          '    return this.props.children;\n' +
          '  }\n' +
          '}',
        description:
          "getDerivedStateFromError는 에러 UI를 보여주고, componentDidCatch는 에러를 로깅합니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: react-error-boundary 활용",
      content:
        "react-error-boundary 라이브러리를 사용한 선언적 에러 처리입니다.",
      code: {
        language: "typescript",
        code:
          'import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";\n' +
          '\n' +
          '// === 폴백 컴포넌트 ===\n' +
          'function ErrorFallback({ error, resetErrorBoundary }: {\n' +
          '  error: Error;\n' +
          '  resetErrorBoundary: () => void;\n' +
          '}) {\n' +
          '  return (\n' +
          '    <div role="alert">\n' +
          '      <h2>문제가 발생했습니다</h2>\n' +
          '      <p>{error.message}</p>\n' +
          '      <button onClick={resetErrorBoundary}>다시 시도</button>\n' +
          '    </div>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === 계층적 Error Boundary 배치 ===\n' +
          'function App() {\n' +
          '  return (\n' +
          '    <ErrorBoundary fallbackRender={ErrorFallback}>\n' +
          '      <Header />\n' +
          '      <ErrorBoundary\n' +
          '        fallbackRender={ErrorFallback}\n' +
          '        onReset={() => queryClient.clear()}\n' +
          '        resetKeys={[userId]}\n' +
          '      >\n' +
          '        <MainContent />\n' +
          '      </ErrorBoundary>\n' +
          '      <Footer />\n' +
          '    </ErrorBoundary>\n' +
          '  );\n' +
          '}\n' +
          '\n' +
          '// === 이벤트 핸들러에서 에러를 Boundary로 전달 ===\n' +
          'function SaveButton() {\n' +
          '  const { showBoundary } = useErrorBoundary();\n' +
          '\n' +
          '  const handleSave = async () => {\n' +
          '    try {\n' +
          '      await saveData();\n' +
          '    } catch (error) {\n' +
          '      // 비동기 에러를 Error Boundary로 전달\n' +
          '      showBoundary(error);\n' +
          '    }\n' +
          '  };\n' +
          '\n' +
          '  return <button onClick={handleSave}>저장</button>;\n' +
          '}',
        description:
          "계층적으로 Error Boundary를 배치하고, resetKeys로 자동 복구를 구현합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 메서드 | 역할 | 타이밍 |\n" +
        "|--------|------|--------|\n" +
        "| getDerivedStateFromError | 에러 UI 전환 | 렌더링 단계 |\n" +
        "| componentDidCatch | 에러 로깅 | 커밋 단계 |\n\n" +
        "**핵심:** Error Boundary를 계층적으로 배치하세요. 앱 전체, 페이지, 위젯 단위로 Error Boundary를 두면, 에러 영향 범위를 최소화할 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** 폴더 구조와 아키텍처를 배우며, 대규모 프로젝트를 체계적으로 구성하는 방법을 알아봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway: "Error Boundary는 하위 컴포넌트 트리의 렌더링 에러를 잡아 fallback UI를 보여준다. 현재 클래스 컴포넌트로만 구현 가능하며, 이벤트 핸들러 에러는 잡지 못한다.",
  checklist: [
    "Error Boundary가 잡는 에러와 잡지 못하는 에러를 구분할 수 있다",
    "getDerivedStateFromError와 componentDidCatch의 차이를 안다",
    "react-error-boundary 라이브러리를 활용할 수 있다",
    "계층적 Error Boundary 배치 전략을 설계할 수 있다",
    "에러 복구(resetKeys, 다시 시도)를 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "Error Boundary가 잡지 못하는 에러는?",
      choices: [
        "렌더링 중 발생한 에러",
        "자식 컴포넌트의 생명주기 메서드 에러",
        "이벤트 핸들러에서 발생한 에러",
        "JSX 반환 중 발생한 에러",
      ],
      correctIndex: 2,
      explanation:
        "Error Boundary는 렌더링 과정의 에러만 잡습니다. 이벤트 핸들러, 비동기 코드(setTimeout, Promise), SSR에서의 에러는 잡지 못합니다.",
    },
    {
      id: "q2",
      question: "getDerivedStateFromError와 componentDidCatch의 차이는?",
      choices: [
        "동일한 기능을 수행한다",
        "전자는 UI 전환, 후자는 에러 로깅에 사용된다",
        "전자는 비동기, 후자는 동기이다",
        "전자는 함수 컴포넌트, 후자는 클래스 컴포넌트 전용이다",
      ],
      correctIndex: 1,
      explanation:
        "getDerivedStateFromError는 렌더링 단계에서 호출되어 폴백 UI를 보여주고, componentDidCatch는 커밋 단계에서 호출되어 에러 로깅(사이드 이펙트)에 사용됩니다.",
    },
    {
      id: "q3",
      question: "Error Boundary 없이 렌더링 에러가 발생하면?",
      choices: [
        "에러가 조용히 무시된다",
        "콘솔에만 에러가 표시된다",
        "전체 컴포넌트 트리가 언마운트되어 빈 화면이 된다",
        "가장 가까운 try-catch가 잡는다",
      ],
      correctIndex: 2,
      explanation:
        "React 16부터 Error Boundary에 잡히지 않은 렌더링 에러는 전체 컴포넌트 트리를 언마운트합니다. 사용자는 완전히 빈 화면을 보게 됩니다.",
    },
    {
      id: "q4",
      question: "react-error-boundary의 useErrorBoundary Hook의 용도는?",
      choices: [
        "새로운 Error Boundary를 생성한다",
        "이벤트 핸들러의 에러를 Error Boundary로 전달한다",
        "에러 상태를 전역으로 관리한다",
        "컴포넌트를 자동으로 리렌더링한다",
      ],
      correctIndex: 1,
      explanation:
        "useErrorBoundary의 showBoundary 함수로 이벤트 핸들러나 비동기 코드의 에러를 가장 가까운 Error Boundary로 전달할 수 있습니다.",
    },
    {
      id: "q5",
      question: "resetKeys의 역할은?",
      choices: [
        "에러 로그를 초기화한다",
        "컴포넌트를 강제로 리마운트한다",
        "지정된 값이 변경되면 에러 상태를 자동으로 리셋한다",
        "API 캐시를 삭제한다",
      ],
      correctIndex: 2,
      explanation:
        "resetKeys에 지정된 값(예: userId)이 변경되면 Error Boundary의 에러 상태가 자동으로 리셋되어 자식 컴포넌트를 다시 렌더링합니다.",
    },
    {
      id: "q6",
      question: "Error Boundary를 계층적으로 배치하는 이유는?",
      choices: [
        "성능이 향상된다",
        "에러 영향 범위를 최소화하여 나머지 앱은 정상 동작한다",
        "TypeScript 타입 추론이 좋아진다",
        "서버 사이드 렌더링이 가능해진다",
      ],
      correctIndex: 1,
      explanation:
        "위젯 단위로 Error Boundary를 두면 한 위젯에서 에러가 발생해도 다른 위젯은 정상 동작합니다. 앱 전체 Boundary만 있으면 전체가 폴백으로 교체됩니다.",
    },
  ],
};

export default chapter;
