import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "26-decorators",
  subject: "typescript",
  title: "데코레이터",
  description:
    "TC39 Stage 3 데코레이터의 문법과 활용법을 이해하고, 클래스·메서드·필드·접근자 데코레이터를 실무에 적용하는 방법을 학습합니다.",
  order: 26,
  group: "클래스와 OOP",
  prerequisites: ["25-abstract-classes"],
  estimatedMinutes: 35,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "데코레이터는 **스마트폰 케이스**와 같습니다.\n\n" +
        "스마트폰(클래스) 자체를 분해하지 않고, 케이스(데코레이터)를 씌우면 새로운 기능이 추가됩니다. 방수 케이스를 끼우면 방수 기능이 생기고, 카드 수납 케이스를 끼우면 카드 보관 기능이 생깁니다. 케이스는 여러 개를 겹칠 수도 있고(데코레이터 합성), 순서에 따라 결과가 달라질 수 있습니다.\n\n" +
        "핵심은 원본을 수정하지 않는다는 것입니다. 케이스를 벗기면 원래의 스마트폰이 그대로 있듯이, 데코레이터를 제거해도 원래의 클래스는 변하지 않습니다. 이것이 바로 **횡단 관심사(Cross-cutting Concerns)**를 분리하는 핵심 아이디어입니다.\n\n" +
        "NestJS에서 `@Controller()`, `@Injectable()`, `@Get()` 같은 데코레이터를 본 적이 있을 것입니다. Angular의 `@Component()`, `@Input()`도 마찬가지입니다. 이러한 프레임워크들이 데코레이터를 핵심 패턴으로 사용하는 이유는, 비즈니스 로직과 인프라 로직을 깔끔하게 분리할 수 있기 때문입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "클래스 기반의 코드에서 반복적으로 등장하는 패턴들이 있습니다.\n\n" +
        "**1. 로깅 코드의 산재**\n" +
        "메서드 실행 시간 측정, 호출 로깅 등을 매 메서드마다 작성해야 합니다. 10개의 서비스 클래스에 각각 5개의 메서드가 있다면, 50곳에 비슷한 로깅 코드가 반복됩니다.\n\n" +
        "**2. 유효성 검증 로직 중복**\n" +
        "API 핸들러마다 입력값 검증 코드를 작성합니다. 검증 규칙이 변경되면 모든 핸들러를 수정해야 합니다.\n\n" +
        "**3. 권한 검사 코드 분산**\n" +
        "각 메서드의 시작 부분에 `if (!user.isAdmin) throw new Error(...)` 같은 코드를 반복합니다. 비즈니스 로직과 인프라 로직이 섞여 가독성이 떨어집니다.\n\n" +
        "**4. experimentalDecorators의 혼란**\n" +
        "TypeScript에는 오래된 `experimentalDecorators` 옵션의 레거시 데코레이터와 TC39 Stage 3 표준 데코레이터, 두 가지가 공존합니다. 어떤 것을 사용해야 하는지 혼란스럽습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "TC39 Stage 3 데코레이터는 TypeScript 5.0부터 지원되며, 횡단 관심사를 선언적으로 분리하는 표준 문법입니다.\n\n" +
        "### 데코레이터의 종류\n" +
        "- **클래스 데코레이터**: 클래스 자체를 수정하거나 메타데이터를 추가합니다.\n" +
        "- **메서드 데코레이터**: 메서드의 동작을 감싸거나 변경합니다.\n" +
        "- **필드 데코레이터**: 필드의 초기화 로직을 수정합니다.\n" +
        "- **접근자 데코레이터**: getter/setter의 동작을 수정합니다.\n\n" +
        "### 데코레이터 합성\n" +
        "여러 데코레이터를 하나의 대상에 적용하면, **아래에서 위로** 실행됩니다. 수학의 함수 합성 `f(g(x))`와 같습니다. 평가(evaluation)는 위에서 아래로, 실행(execution)은 아래에서 위로 진행됩니다.\n\n" +
        "### experimentalDecorators vs TC39 Stage 3\n" +
        "| 구분 | experimentalDecorators | TC39 Stage 3 |\n" +
        "|------|----------------------|---------------|\n" +
        "| 상태 | 레거시, 비표준 | 표준화 진행 중 |\n" +
        "| TS 버전 | 모든 버전 | 5.0+ |\n" +
        "| 매개변수 데코레이터 | 지원 | 미지원 |\n" +
        "| 프레임워크 | NestJS, Angular (현재) | 신규 프로젝트 권장 |\n\n" +
        "새 프로젝트에서는 TC39 Stage 3 데코레이터를, NestJS/Angular 프로젝트에서는 프레임워크 요구사항에 따라 experimentalDecorators를 사용합니다.",
    },
    {
      type: "pseudocode",
      title: "기술 구현: TC39 Stage 3 데코레이터",
      content:
        "TC39 Stage 3 데코레이터의 각 종류별 구현을 살펴봅시다. 데코레이터 함수의 시그니처와 context 객체를 이해하면, 다양한 실무 패턴을 만들 수 있습니다.",
      code: {
        language: "typescript",
        code:
          "// ===== 메서드 데코레이터: 로깅 =====\n" +
          "function log(\n" +
          "  target: Function,\n" +
          "  context: ClassMethodDecoratorContext\n" +
          ") {\n" +
          "  const methodName = String(context.name);\n" +
          "  return function (this: unknown, ...args: unknown[]) {\n" +
          "    console.log(`[CALL] ${methodName}(${args.join(', ')})`);\n" +
          "    const start = performance.now();\n" +
          "    const result = target.apply(this, args);\n" +
          "    const duration = performance.now() - start;\n" +
          "    console.log(`[DONE] ${methodName} (${duration.toFixed(2)}ms)`);\n" +
          "    return result;\n" +
          "  };\n" +
          "}\n" +
          "\n" +
          "// ===== 클래스 데코레이터: sealed =====\n" +
          "function sealed(\n" +
          "  target: Function,\n" +
          "  context: ClassDecoratorContext\n" +
          ") {\n" +
          "  Object.seal(target);\n" +
          "  Object.seal(target.prototype);\n" +
          "}\n" +
          "\n" +
          "// ===== 필드 데코레이터: 기본값 바인딩 =====\n" +
          "function bound(\n" +
          "  _target: undefined,\n" +
          "  context: ClassFieldDecoratorContext\n" +
          ") {\n" +
          "  return function (this: unknown, initialValue: unknown) {\n" +
          "    if (typeof initialValue === 'function') {\n" +
          "      return initialValue.bind(this);\n" +
          "    }\n" +
          "    return initialValue;\n" +
          "  };\n" +
          "}\n" +
          "\n" +
          "// ===== 데코레이터 합성 및 사용 =====\n" +
          "@sealed\n" +
          "class UserService {\n" +
          "  @log\n" +
          "  findById(id: string) {\n" +
          "    return { id, name: 'Alice' };\n" +
          "  }\n" +
          "\n" +
          "  @log\n" +
          "  updateName(id: string, name: string) {\n" +
          "    console.log(`Updating ${id} to ${name}`);\n" +
          "    return true;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "// ===== 데코레이터 팩토리 (인자를 받는 데코레이터) =====\n" +
          "function deprecated(reason: string) {\n" +
          "  return function (\n" +
          "    target: Function,\n" +
          "    context: ClassMethodDecoratorContext\n" +
          "  ) {\n" +
          "    const name = String(context.name);\n" +
          "    return function (this: unknown, ...args: unknown[]) {\n" +
          "      console.warn(`[DEPRECATED] ${name}: ${reason}`);\n" +
          "      return target.apply(this, args);\n" +
          "    };\n" +
          "  };\n" +
          "}\n" +
          "\n" +
          "class Api {\n" +
          "  @deprecated('Use fetchV2 instead')\n" +
          "  fetchV1() { return 'v1'; }\n" +
          "}",
        description:
          "TC39 Stage 3 데코레이터는 context 객체를 통해 데코레이팅 대상의 메타데이터에 접근합니다. 데코레이터 팩토리 패턴으로 인자를 전달할 수 있습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 실무 데코레이터 구현",
      content:
        "유효성 검증, 메모이제이션, 에러 처리 등 실무에서 자주 사용하는 데코레이터 패턴을 구현해봅시다. NestJS 스타일의 선언적 프로그래밍이 어떻게 동작하는지 이해할 수 있습니다.",
      code: {
        language: "typescript",
        code:
          "// ===== 메모이제이션 데코레이터 =====\n" +
          "function memoize(\n" +
          "  target: Function,\n" +
          "  context: ClassMethodDecoratorContext\n" +
          ") {\n" +
          "  const cache = new Map<string, unknown>();\n" +
          "\n" +
          "  return function (this: unknown, ...args: unknown[]) {\n" +
          "    const key = JSON.stringify(args);\n" +
          "    if (cache.has(key)) {\n" +
          "      return cache.get(key);\n" +
          "    }\n" +
          "    const result = target.apply(this, args);\n" +
          "    cache.set(key, result);\n" +
          "    return result;\n" +
          "  };\n" +
          "}\n" +
          "\n" +
          "// ===== 에러 경계 데코레이터 =====\n" +
          "function catchError(fallback: unknown) {\n" +
          "  return function (\n" +
          "    target: Function,\n" +
          "    context: ClassMethodDecoratorContext\n" +
          "  ) {\n" +
          "    return function (this: unknown, ...args: unknown[]) {\n" +
          "      try {\n" +
          "        return target.apply(this, args);\n" +
          "      } catch (error) {\n" +
          "        console.error(`Error in ${String(context.name)}:`, error);\n" +
          "        return fallback;\n" +
          "      }\n" +
          "    };\n" +
          "  };\n" +
          "}\n" +
          "\n" +
          "// ===== 접근자 데코레이터 =====\n" +
          "function clamp(min: number, max: number) {\n" +
          "  return function (\n" +
          "    target: ClassAccessorDecoratorTarget<unknown, number>,\n" +
          "    context: ClassAccessorDecoratorContext<unknown, number>\n" +
          "  ): ClassAccessorDecoratorResult<unknown, number> {\n" +
          "    return {\n" +
          "      set(value: number) {\n" +
          "        target.set.call(this, Math.min(max, Math.max(min, value)));\n" +
          "      },\n" +
          "      get() {\n" +
          "        return target.get.call(this);\n" +
          "      },\n" +
          "    };\n" +
          "  };\n" +
          "}\n" +
          "\n" +
          "class Calculator {\n" +
          "  @memoize\n" +
          "  fibonacci(n: number): number {\n" +
          "    if (n <= 1) return n;\n" +
          "    return this.fibonacci(n - 1) + this.fibonacci(n - 2);\n" +
          "  }\n" +
          "\n" +
          "  @catchError(0)\n" +
          "  divide(a: number, b: number): number {\n" +
          "    if (b === 0) throw new Error('Division by zero');\n" +
          "    return a / b;\n" +
          "  }\n" +
          "}\n" +
          "\n" +
          "class Slider {\n" +
          "  @clamp(0, 100)\n" +
          "  accessor value = 50;\n" +
          "}",
        description:
          "메모이제이션, 에러 경계, 값 범위 제한 등 실무에서 유용한 데코레이터 패턴입니다. 각 데코레이터는 원본 로직을 수정하지 않고 동작을 확장합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 데코레이터 종류 | 대상 | 주요 활용 |\n" +
        "|---------------|------|----------|\n" +
        "| 클래스 | class | sealed, 메타데이터 |\n" +
        "| 메서드 | method | 로깅, 캐싱, 권한 검사 |\n" +
        "| 필드 | field | 바인딩, 초기화 |\n" +
        "| 접근자 | accessor | 값 검증, 변환 |\n\n" +
        "**핵심:** 데코레이터는 클래스와 그 멤버에 메타데이터를 추가하거나 동작을 수정하는 함수입니다. NestJS, Angular 등의 프레임워크에서 핵심적으로 사용되며, TC39 Stage 3 표준이 TS 5.0+에서 지원됩니다. 합성 시 아래에서 위로 실행되며, 팩토리 패턴으로 인자를 전달할 수 있습니다.\n\n" +
        "**다음 챕터 미리보기:** React 컴포넌트 타이핑을 학습합니다. FC<Props> vs 일반 함수 선언, children 타입, 제네릭 컴포넌트 등 React + TypeScript의 핵심 패턴을 살펴봅니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "데코레이터는 클래스와 그 멤버에 메타데이터를 추가하거나 동작을 수정하는 함수다. NestJS, Angular 등의 프레임워크에서 핵심적으로 사용되며, TC39 Stage 3 표준이 TS 5.0+에서 지원된다.",
  checklist: [
    "TC39 Stage 3 데코레이터의 4가지 종류를 나열할 수 있다",
    "데코레이터 합성 시 실행 순서(아래→위)를 설명할 수 있다",
    "데코레이터 팩토리 패턴으로 인자를 전달하는 방법을 이해한다",
    "experimentalDecorators와 Stage 3 데코레이터의 차이를 설명할 수 있다",
    "로깅, 메모이제이션 등 실무 데코레이터를 구현할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "TC39 Stage 3 데코레이터가 지원되기 시작한 TypeScript 버전은?",
      choices: [
        "TypeScript 4.0",
        "TypeScript 4.5",
        "TypeScript 5.0",
        "TypeScript 5.5",
      ],
      correctIndex: 2,
      explanation:
        "TC39 Stage 3 데코레이터는 TypeScript 5.0부터 공식 지원됩니다. 그 이전에는 experimentalDecorators 옵션을 사용한 비표준 데코레이터만 사용할 수 있었습니다.",
    },
    {
      id: "q2",
      question:
        "다음과 같이 데코레이터가 적용되었을 때 실행 순서는?\n\n@A\n@B\n@C\nmethod() {}",
      choices: [
        "A → B → C",
        "C → B → A",
        "A → C → B",
        "B → A → C",
      ],
      correctIndex: 1,
      explanation:
        "데코레이터 합성은 아래에서 위로 실행됩니다. 수학의 함수 합성 f(g(h(x)))와 같이 C가 먼저, B가 다음, A가 마지막으로 실행됩니다.",
    },
    {
      id: "q3",
      question: "데코레이터 팩토리란 무엇인가?",
      choices: [
        "데코레이터를 자동 생성하는 빌드 도구",
        "인자를 받아 데코레이터 함수를 반환하는 함수",
        "여러 데코레이터를 합성하는 유틸리티",
        "클래스를 동적으로 생성하는 패턴",
      ],
      correctIndex: 1,
      explanation:
        "데코레이터 팩토리는 설정값 등의 인자를 받아서 실제 데코레이터 함수를 반환하는 함수입니다. @deprecated('Use v2')처럼 사용합니다.",
    },
    {
      id: "q4",
      question: "experimentalDecorators를 계속 사용해야 하는 경우는?",
      choices: [
        "TypeScript 5.0 이상을 사용할 때",
        "순수 TypeScript 프로젝트에서",
        "NestJS, Angular 등 레거시 데코레이터 기반 프레임워크에서",
        "데코레이터를 처음 배울 때",
      ],
      correctIndex: 2,
      explanation:
        "NestJS와 Angular는 현재 experimentalDecorators 기반으로 설계되어 있어, 매개변수 데코레이터 등 레거시 기능에 의존합니다. 프레임워크가 Stage 3으로 마이그레이션할 때까지 experimentalDecorators를 사용해야 합니다.",
    },
    {
      id: "q5",
      question: "TC39 Stage 3 데코레이터에서 메서드 데코레이터의 두 번째 매개변수는?",
      choices: [
        "PropertyDescriptor",
        "ClassMethodDecoratorContext",
        "string (메서드 이름)",
        "prototype 객체",
      ],
      correctIndex: 1,
      explanation:
        "TC39 Stage 3 데코레이터에서 메서드 데코레이터의 두 번째 매개변수는 ClassMethodDecoratorContext 타입의 context 객체입니다. name, kind, static 등의 메타데이터를 포함합니다.",
    },
  ],
};

export default chapter;
