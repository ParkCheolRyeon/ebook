import type { MidQuiz } from "@/types/quiz";

const midQuiz: MidQuiz = {
  type: "mid",
  id: "mid-04",
  title: "중간 점검 4: 설정 ~ 아키텍처",
  coverGroups: ["프로젝트 설정", "실전 패턴", "아키텍처"],
  questions: [
    {
      id: "mid04-q1",
      question:
        "tsconfig.json에서 strict: true를 설정하면 활성화되는 옵션이 아닌 것은?",
      choices: [
        "strictNullChecks",
        "noImplicitAny",
        "esModuleInterop",
        "strictFunctionTypes",
      ],
      correctIndex: 2,
      explanation:
        "strict: true는 strictNullChecks, noImplicitAny, strictFunctionTypes, strictBindCallApply 등 타입 검사 관련 플래그를 모두 활성화합니다. esModuleInterop은 모듈 호환성 옵션으로 strict에 포함되지 않습니다.",
    },
    {
      id: "mid04-q2",
      question:
        "strictNullChecks가 활성화되었을 때 다음 코드의 문제는?\n\nfunction getLength(str: string) {\n  return str.length;\n}\ngetLength(undefined);",
      choices: [
        "문제 없이 동작한다",
        "undefined는 string에 할당할 수 없으므로 컴파일 에러가 발생한다",
        "런타임에만 에러가 발생한다",
        "length가 NaN을 반환한다",
      ],
      correctIndex: 1,
      explanation:
        "strictNullChecks가 활성화되면 null과 undefined는 각 타입에 명시적으로 포함시키지 않는 한 다른 타입에 할당할 수 없습니다. string | undefined로 매개변수 타입을 변경하고 null 체크를 추가해야 합니다.",
    },
    {
      id: "mid04-q3",
      question:
        "기존 JavaScript 프로젝트에 TypeScript를 점진적으로 도입하는 올바른 전략은?",
      choices: [
        "모든 .js 파일을 한 번에 .ts로 변경한다",
        "allowJs를 활성화하고, 핵심 모듈부터 .ts로 변환하며 strict를 점진적으로 적용한다",
        "타입 선언 없이 any를 모두 사용한다",
        "새 프로젝트로 완전히 재작성한다",
      ],
      correctIndex: 1,
      explanation:
        "allowJs로 JS와 TS 파일을 혼용하면서 점진적으로 마이그레이션합니다. checkJs로 JS 파일도 검사하고, 핵심 모듈부터 .ts로 변환한 뒤 strict 옵션을 단계적으로 활성화하는 것이 실용적입니다.",
    },
    {
      id: "mid04-q4",
      question:
        "다음 Result 패턴의 장점은?\n\ntype Result<T, E = Error> =\n  | { success: true; data: T }\n  | { success: false; error: E };",
      choices: [
        "try-catch보다 성능이 좋다",
        "에러 처리를 타입 시스템으로 강제하여 에러를 무시할 수 없게 만든다",
        "런타임 에러를 완전히 제거한다",
        "비동기 코드에서만 사용 가능하다",
      ],
      correctIndex: 1,
      explanation:
        "Result 패턴은 함수의 반환 타입에 에러 가능성을 명시합니다. 호출자가 success를 확인하지 않으면 data에 접근할 수 없으므로 에러 처리를 잊을 수 없습니다. 판별된 유니온을 활용한 타입 안전 에러 처리입니다.",
    },
    {
      id: "mid04-q5",
      question:
        "Zod 같은 런타임 검증 라이브러리를 TypeScript와 함께 사용하는 이유는?",
      choices: [
        "TypeScript 타입 검사를 대체하기 위해",
        "컴파일 타임 타입은 런타임에 사라지므로, 외부 데이터(API 응답 등)의 런타임 검증이 필요하기 때문이다",
        "TypeScript의 타입 추론이 부정확하기 때문이다",
        "Zod 없이는 interface를 정의할 수 없기 때문이다",
      ],
      correctIndex: 1,
      explanation:
        "TypeScript 타입은 컴파일 타임에만 존재하고 런타임에 제거됩니다. API 응답, 사용자 입력 등 외부 데이터는 타입이 보장되지 않으므로, Zod로 런타임 검증 후 타입을 자동 추론(z.infer)하는 것이 안전합니다.",
    },
    {
      id: "mid04-q6",
      question:
        "다음 API 응답 타이핑에서 가장 안전한 접근 방식은?",
      choices: [
        "응답을 any로 캐스팅하여 사용한다",
        "as로 타입 단언하여 사용한다",
        "Zod 스키마로 런타임 검증 후 추론된 타입을 사용한다",
        "응답 타입을 타이핑하지 않는다",
      ],
      correctIndex: 2,
      explanation:
        "any 캐스팅이나 as 단언은 실제 데이터와 타입이 다를 때 런타임 에러를 발생시킵니다. Zod 같은 스키마 검증으로 런타임에 데이터 형태를 확인하고, 검증 통과 후 타입을 안전하게 사용하는 것이 가장 견고합니다.",
    },
    {
      id: "mid04-q7",
      question:
        "타입 주도 개발(Type-Driven Development)의 핵심 원칙은?",
      choices: [
        "타입을 마지막에 추가한다",
        "타입을 먼저 설계하여 올바른 사용만 가능하게 하고, 잘못된 상태를 타입으로 표현 불가능하게 만든다",
        "모든 변수에 any를 사용한다",
        "런타임 검증만으로 충분하다",
      ],
      correctIndex: 1,
      explanation:
        "타입 주도 개발은 구현 전에 타입을 설계하여 비즈니스 규칙을 타입 시스템에 인코딩합니다. 잘못된 상태가 타입으로 표현 불가능하면 컴파일 타임에 버그를 방지할 수 있습니다.",
    },
    {
      id: "mid04-q8",
      question:
        "\"Make Illegal States Unrepresentable\" 원칙이 적용된 예시는?\n\n// Before\ntype Form = { status: string; data: any; error: any };\n\n// After\ntype Form =\n  | { status: \"idle\" }\n  | { status: \"loading\" }\n  | { status: \"success\"; data: Data }\n  | { status: \"error\"; error: Error };",
      choices: [
        "Before가 더 유연하므로 우수하다",
        "After는 성공 시 error가 존재하거나, 에러 시 data가 존재하는 불가능한 상태를 타입 레벨에서 제거한다",
        "After는 코드량이 많아 비효율적이다",
        "두 접근법은 기능적으로 동일하다",
      ],
      correctIndex: 1,
      explanation:
        "Before에서는 { status: \"success\", data: null, error: someError } 같은 모순된 상태가 가능합니다. After는 판별된 유니온으로 각 상태에 필요한 데이터만 가지므로 불가능한 조합이 타입 레벨에서 차단됩니다.",
    },
    {
      id: "mid04-q9",
      question:
        "tsconfig.json에서 paths 옵션의 용도는?\n\n{\n  \"compilerOptions\": {\n    \"paths\": {\n      \"@/*\": [\"./src/*\"]\n    }\n  }\n}",
      choices: [
        "파일을 자동으로 생성한다",
        "모듈 임포트 경로에 별칭(alias)을 설정하여 긴 상대 경로를 간결하게 만든다",
        "파일 확장자를 변경한다",
        "빌드 출력 경로를 설정한다",
      ],
      correctIndex: 1,
      explanation:
        "paths는 모듈 경로 별칭을 설정합니다. @/components/Button은 ./src/components/Button으로 해석됩니다. ../../ 같은 복잡한 상대 경로를 피할 수 있으며, 번들러에도 동일한 별칭 설정이 필요합니다.",
    },
    {
      id: "mid04-q10",
      question:
        "다음 중 TypeScript 프로젝트에서 barrel export(index.ts)를 사용할 때 주의할 점은?",
      choices: [
        "barrel export는 항상 사용해야 한다",
        "순환 참조가 발생할 수 있고, Tree Shaking이 완벽하지 않으면 번들 크기가 증가할 수 있다",
        "TypeScript에서 barrel export는 지원되지 않는다",
        "barrel export는 성능에 전혀 영향을 미치지 않는다",
      ],
      correctIndex: 1,
      explanation:
        "barrel export는 외부 API를 깔끔하게 정리하지만, 순환 참조 위험이 있고, 번들러의 Tree Shaking이 불완전하면 사용하지 않는 모듈도 포함될 수 있습니다. 모듈 경계를 명확히 하고 필요한 곳에만 적용해야 합니다.",
    },
  ],
};

export default midQuiz;
