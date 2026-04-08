import type { Chapter } from "@/types/chapter";

const chapter: Chapter = {
  id: "16-structural-patterns",
  subject: "cs",
  title: "구조 패턴",
  description: "객체와 클래스의 구성을 유연하게 만드는 어댑터, 데코레이터, 퍼사드, 프록시, 컴포지트 패턴과 프론트엔드 실전 활용을 학습합니다.",
  order: 16,
  group: "디자인 패턴",
  prerequisites: ["15-creational-patterns"],
  estimatedMinutes: 30,
  sections: [
    {
      type: "analogy",
      title: "비유로 이해하기",
      content:
        "구조 패턴은 '기존 부품을 조합해 새로운 구조를 만드는 방법'입니다.\n\n" +
        "**어댑터(Adapter)** — 해외여행 시 전원 어댑터를 사용합니다. 한국 플러그를 유럽 콘센트에 꽂을 수 있게 " +
        "변환해 주는 것처럼, 서로 다른 인터페이스를 연결합니다. API 응답 정규화가 대표적 예시입니다.\n\n" +
        "**데코레이터(Decorator)** — 스마트폰에 케이스를 씌우면 폰의 기본 기능은 그대로이면서 보호 기능이 추가됩니다. " +
        "React의 HOC(Higher-Order Component)가 바로 데코레이터 패턴입니다.\n\n" +
        "**퍼사드(Facade)** — 호텔 프런트 데스크는 복잡한 내부 시스템(객실, 식당, 세탁)을 하나의 창구로 단순화합니다. " +
        "복잡한 API 레이어를 간단한 인터페이스로 감쌉니다.\n\n" +
        "**프록시(Proxy)** — 비서가 사장 대신 전화를 받아 중요한 건만 연결하는 것처럼, " +
        "원본 객체에 대한 접근을 제어합니다. Vue의 반응성 시스템이 Proxy를 사용합니다.\n\n" +
        "**컴포지트(Composite)** — 파일 시스템에서 폴더 안에 파일과 다른 폴더가 있는 것처럼, " +
        "개별 객체와 복합 객체를 동일하게 다룹니다. React 컴포넌트 트리가 대표적 사례입니다.",
    },
    {
      type: "problem",
      title: "문제 정의",
      content:
        "프론트엔드에서 구조적 문제가 발생하는 상황들:\n\n" +
        "**1. API 응답 형식 불일치:** 백엔드마다 다른 응답 형식을 프론트엔드에서 일일이 변환해야 합니다.\n\n" +
        "```typescript\n" +
        "// 서버 A의 사용자 응답\n" +
        "{ user_name: 'Kim', user_email: 'kim@test.com' }\n" +
        "// 서버 B의 사용자 응답\n" +
        "{ fullName: 'Kim', emailAddress: 'kim@test.com' }\n" +
        "// 프론트엔드가 기대하는 형식\n" +
        "{ name: 'Kim', email: 'kim@test.com' }\n" +
        "```\n\n" +
        "**2. 횡단 관심사의 중복:** 인증 체크, 로깅, 에러 처리 로직이 여러 컴포넌트에 반복됩니다.\n\n" +
        "**3. 복잡한 서브시스템 노출:** 여러 API 호출과 데이터 가공 로직이 컴포넌트에 직접 노출되어 결합도가 높아집니다.\n\n" +
        "**4. 트리 구조 처리의 어려움:** 메뉴, 댓글, 조직도 같은 재귀적 구조를 일관되게 처리하기 어렵습니다.",
    },
    {
      type: "solution",
      title: "해결 방법",
      content:
        "### 1. 어댑터 패턴 — API 응답 정규화\n\n" +
        "```typescript\n" +
        "// 통일된 사용자 인터페이스\n" +
        "interface User {\n" +
        "  name: string;\n" +
        "  email: string;\n" +
        "}\n" +
        "\n" +
        "// 서버 A 어댑터\n" +
        "function adaptServerA(data: { user_name: string; user_email: string }): User {\n" +
        "  return { name: data.user_name, email: data.user_email };\n" +
        "}\n" +
        "\n" +
        "// 서버 B 어댑터\n" +
        "function adaptServerB(data: { fullName: string; emailAddress: string }): User {\n" +
        "  return { name: data.fullName, email: data.emailAddress };\n" +
        "}\n" +
        "```\n\n" +
        "### 2. 데코레이터 패턴 — HOC (Higher-Order Component)\n\n" +
        "```typescript\n" +
        "// 인증 데코레이터 (HOC)\n" +
        "function withAuth<P>(Component: React.ComponentType<P>) {\n" +
        "  return function AuthWrapper(props: P) {\n" +
        "    const { user } = useAuth();\n" +
        "    if (!user) return <LoginPage />;\n" +
        "    return <Component {...props} />;\n" +
        "  };\n" +
        "}\n" +
        "\n" +
        "const ProtectedDashboard = withAuth(Dashboard);\n" +
        "```\n\n" +
        "### 3. 퍼사드 패턴 — API 레이어 단순화\n\n" +
        "```typescript\n" +
        "// 복잡한 내부 로직을 단순한 인터페이스로\n" +
        "class UserService {\n" +
        "  async getProfile(id: string) {\n" +
        "    const [user, posts, followers] = await Promise.all([\n" +
        "      api.get(`/users/${id}`),\n" +
        "      api.get(`/users/${id}/posts`),\n" +
        "      api.get(`/users/${id}/followers`),\n" +
        "    ]);\n" +
        "    return { ...user, posts, followerCount: followers.length };\n" +
        "  }\n" +
        "}\n" +
        "```\n\n" +
        "### 4. 프록시 패턴 — 접근 제어와 반응성\n\n" +
        "```typescript\n" +
        "// Vue 스타일 반응성 프록시\n" +
        "function reactive<T extends object>(target: T): T {\n" +
        "  return new Proxy(target, {\n" +
        "    get(obj, prop) {\n" +
        "      track(obj, prop); // 의존성 추적\n" +
        "      return Reflect.get(obj, prop);\n" +
        "    },\n" +
        "    set(obj, prop, value) {\n" +
        "      Reflect.set(obj, prop, value);\n" +
        "      trigger(obj, prop); // 변경 알림\n" +
        "      return true;\n" +
        "    },\n" +
        "  });\n" +
        "}\n" +
        "```\n\n" +
        "### 5. 컴포지트 패턴 — 트리 구조\n\n" +
        "```typescript\n" +
        "interface MenuItem {\n" +
        "  label: string;\n" +
        "  children?: MenuItem[];\n" +
        "}\n" +
        "\n" +
        "function Menu({ items }: { items: MenuItem[] }) {\n" +
        "  return items.map(item => (\n" +
        "    <li key={item.label}>\n" +
        "      {item.label}\n" +
        "      {item.children && <ul><Menu items={item.children} /></ul>}\n" +
        "    </li>\n" +
        "  ));\n" +
        "}\n" +
        "```",
    },
    {
      type: "pseudocode",
      title: "기술 구현: 범용 API 어댑터 레이어",
      content:
        "여러 외부 API의 응답을 통일된 내부 형식으로 변환하는 어댑터 레이어를 구현합니다. " +
        "실제 프로젝트에서 백엔드 API 변경에 프론트엔드가 영향받지 않도록 보호하는 핵심 패턴입니다.",
      code: {
        language: "typescript",
        code:
          "// 내부에서 사용할 통일된 타입\n" +
          "interface Product {\n" +
          "  id: string;\n" +
          "  name: string;\n" +
          "  price: number;\n" +
          "  imageUrl: string;\n" +
          "}\n" +
          "\n" +
          "// 어댑터 인터페이스\n" +
          "interface ApiAdapter<TRaw> {\n" +
          "  adapt(raw: TRaw): Product;\n" +
          "  adaptMany(rawList: TRaw[]): Product[];\n" +
          "}\n" +
          "\n" +
          "// 레거시 API 어댑터\n" +
          "interface LegacyProduct {\n" +
          "  product_id: number;\n" +
          "  product_name: string;\n" +
          "  cost: string; // \"29900\"\n" +
          "  img: string;\n" +
          "}\n" +
          "\n" +
          "const legacyAdapter: ApiAdapter<LegacyProduct> = {\n" +
          "  adapt(raw) {\n" +
          "    return {\n" +
          "      id: String(raw.product_id),\n" +
          "      name: raw.product_name,\n" +
          "      price: Number(raw.cost),\n" +
          "      imageUrl: raw.img.startsWith('http')\n" +
          "        ? raw.img\n" +
          "        : `https://legacy.api.com${raw.img}`,\n" +
          "    };\n" +
          "  },\n" +
          "  adaptMany(rawList) {\n" +
          "    return rawList.map(this.adapt);\n" +
          "  },\n" +
          "};\n" +
          "\n" +
          "// 신규 API 어댑터\n" +
          "interface NewApiProduct {\n" +
          "  uuid: string;\n" +
          "  title: string;\n" +
          "  priceInCents: number;\n" +
          "  images: { thumbnail: string; full: string };\n" +
          "}\n" +
          "\n" +
          "const newApiAdapter: ApiAdapter<NewApiProduct> = {\n" +
          "  adapt(raw) {\n" +
          "    return {\n" +
          "      id: raw.uuid,\n" +
          "      name: raw.title,\n" +
          "      price: raw.priceInCents / 100,\n" +
          "      imageUrl: raw.images.thumbnail,\n" +
          "    };\n" +
          "  },\n" +
          "  adaptMany(rawList) {\n" +
          "    return rawList.map(this.adapt);\n" +
          "  },\n" +
          "};\n" +
          "\n" +
          "// 사용 — 컴포넌트는 항상 Product 타입만 사용\n" +
          "async function fetchProducts(source: 'legacy' | 'new'): Promise<Product[]> {\n" +
          "  if (source === 'legacy') {\n" +
          "    const raw = await fetch('/legacy/products').then(r => r.json());\n" +
          "    return legacyAdapter.adaptMany(raw);\n" +
          "  }\n" +
          "  const raw = await fetch('/api/v2/products').then(r => r.json());\n" +
          "  return newApiAdapter.adaptMany(raw);\n" +
          "}",
        description:
          "어댑터 패턴을 통해 외부 API의 형식이 바뀌어도 어댑터만 수정하면 됩니다. " +
          "컴포넌트는 항상 통일된 Product 타입만 사용하므로 변경 영향을 받지 않습니다.",
      },
    },
    {
      type: "practice",
      title: "실습 예제: 데코레이터와 프록시 패턴 활용",
      content:
        "함수 데코레이터로 캐싱 기능을 추가하고, Proxy 객체로 유효성 검사를 자동화하는 실습입니다.",
      code: {
        language: "typescript",
        code:
          "// 1. 함수 데코레이터 — API 호출에 캐싱 추가\n" +
          "function withCache<T extends (...args: any[]) => Promise<any>>(\n" +
          "  fn: T,\n" +
          "  ttl: number = 60000\n" +
          "): T {\n" +
          "  const cache = new Map<string, { data: any; timestamp: number }>();\n" +
          "\n" +
          "  return (async (...args: any[]) => {\n" +
          "    const key = JSON.stringify(args);\n" +
          "    const cached = cache.get(key);\n" +
          "\n" +
          "    if (cached && Date.now() - cached.timestamp < ttl) {\n" +
          "      console.log('캐시 히트:', key);\n" +
          "      return cached.data;\n" +
          "    }\n" +
          "\n" +
          "    const result = await fn(...args);\n" +
          "    cache.set(key, { data: result, timestamp: Date.now() });\n" +
          "    return result;\n" +
          "  }) as T;\n" +
          "}\n" +
          "\n" +
          "// 원본 함수\n" +
          "async function fetchUser(id: string) {\n" +
          "  const res = await fetch(`/api/users/${id}`);\n" +
          "  return res.json();\n" +
          "}\n" +
          "\n" +
          "// 캐싱 데코레이터 적용\n" +
          "const cachedFetchUser = withCache(fetchUser, 30000);\n" +
          "\n" +
          "// 2. Proxy를 활용한 폼 상태 유효성 검사\n" +
          "interface FormState {\n" +
          "  name: string;\n" +
          "  email: string;\n" +
          "  age: number;\n" +
          "}\n" +
          "\n" +
          "const validators: Record<string, (value: any) => boolean> = {\n" +
          "  name: (v) => typeof v === 'string' && v.length >= 2,\n" +
          "  email: (v) => typeof v === 'string' && v.includes('@'),\n" +
          "  age: (v) => typeof v === 'number' && v >= 0 && v <= 150,\n" +
          "};\n" +
          "\n" +
          "function createValidatedForm(initial: FormState): FormState {\n" +
          "  return new Proxy(initial, {\n" +
          "    set(target, prop: string, value) {\n" +
          "      const validator = validators[prop];\n" +
          "      if (validator && !validator(value)) {\n" +
          "        console.error(`유효하지 않은 값: ${prop} = ${value}`);\n" +
          "        return false;\n" +
          "      }\n" +
          "      return Reflect.set(target, prop, value);\n" +
          "    },\n" +
          "  });\n" +
          "}\n" +
          "\n" +
          "const form = createValidatedForm({ name: '', email: '', age: 0 });\n" +
          "form.name = '김철수';  // 성공\n" +
          "form.email = 'invalid'; // 실패 — @ 없음\n" +
          "form.age = -5;          // 실패 — 음수",
        description:
          "withCache 데코레이터는 원본 함수를 수정하지 않고 캐싱을 추가합니다. " +
          "Proxy는 객체 속성 접근/수정을 가로채 유효성 검사 같은 횡단 관심사를 투명하게 처리합니다.",
      },
    },
    {
      type: "summary",
      title: "전체 요약",
      content:
        "| 패턴 | 목적 | 프론트엔드 활용 |\n" +
        "|------|------|----------------|\n" +
        "| 어댑터 | 인터페이스 변환 | API 응답 정규화, 라이브러리 래핑 |\n" +
        "| 데코레이터 | 기능 동적 추가 | HOC, 함수 래퍼(캐시, 로깅) |\n" +
        "| 퍼사드 | 복잡성 숨기기 | API 서비스 레이어, SDK 래퍼 |\n" +
        "| 프록시 | 접근 제어 | Vue 반응성, 유효성 검사, 지연 로딩 |\n" +
        "| 컴포지트 | 트리 구조 처리 | React 컴포넌트 트리, 재귀 메뉴 |\n\n" +
        "**핵심 원칙:** 구조 패턴은 기존 코드를 수정하지 않고 새로운 구조를 만들어 확장성을 확보합니다. " +
        "어댑터로 호환성을, 데코레이터로 기능 확장을, 퍼사드로 단순화를, 프록시로 제어를, 컴포지트로 일관성을 달성합니다.",
    },
    {
      type: "checklist",
      title: "학습 체크리스트",
      content: "",
    },
  ],
  keyTakeaway:
    "구조 패턴은 기존 객체를 수정하지 않고 새로운 구조와 기능을 조합하여 유연하고 확장 가능한 설계를 만드는 기법이다.",
  checklist: [
    "어댑터 패턴으로 서로 다른 API 응답을 통일된 내부 타입으로 변환할 수 있다",
    "데코레이터 패턴(HOC)으로 컴포넌트에 인증, 로깅 등의 횡단 관심사를 추가할 수 있다",
    "퍼사드 패턴으로 복잡한 API 호출을 단순한 서비스 레이어로 감쌀 수 있다",
    "Proxy 객체를 활용해 속성 접근/수정을 가로채는 프록시 패턴을 구현할 수 있다",
    "컴포지트 패턴으로 재귀적 트리 구조(메뉴, 댓글)를 렌더링할 수 있다",
  ],
  quiz: [
    {
      id: "q1",
      question: "API 응답의 필드명이 프론트엔드 모델과 다를 때 가장 적합한 패턴은?",
      choices: [
        "싱글턴 패턴",
        "어댑터 패턴",
        "옵저버 패턴",
        "빌더 패턴",
      ],
      correctIndex: 1,
      explanation:
        "어댑터 패턴은 서로 다른 인터페이스를 연결합니다. 백엔드의 user_name을 프론트엔드의 name으로 변환하는 " +
        "어댑터 함수를 두면, API가 변경되어도 어댑터만 수정하면 됩니다.",
    },
    {
      id: "q2",
      question: "React의 HOC(Higher-Order Component)는 어떤 구조 패턴에 해당하는가?",
      choices: [
        "어댑터 패턴",
        "프록시 패턴",
        "데코레이터 패턴",
        "컴포지트 패턴",
      ],
      correctIndex: 2,
      explanation:
        "HOC는 컴포넌트를 감싸 새로운 기능(인증, 로깅, 데이터 페칭)을 추가합니다. " +
        "원래 컴포넌트를 수정하지 않고 기능을 겹겹이 추가하는 것이 데코레이터 패턴의 핵심입니다.",
    },
    {
      id: "q3",
      question: "Vue 3의 반응성 시스템에서 사용하는 핵심 JavaScript API는?",
      choices: [
        "Object.defineProperty",
        "Proxy",
        "Symbol",
        "WeakRef",
      ],
      correctIndex: 1,
      explanation:
        "Vue 3는 Proxy 객체를 사용해 반응성을 구현합니다. Proxy의 get 트랩에서 의존성을 추적하고, " +
        "set 트랩에서 변경을 감지해 관련 컴포넌트를 다시 렌더링합니다. (Vue 2는 Object.defineProperty를 사용했습니다.)",
    },
    {
      id: "q4",
      question: "퍼사드 패턴의 주요 목적은?",
      choices: [
        "객체를 불변으로 만드는 것",
        "복잡한 서브시스템에 대한 단순한 인터페이스를 제공하는 것",
        "객체 생성을 캡슐화하는 것",
        "알고리즘을 교체 가능하게 하는 것",
      ],
      correctIndex: 1,
      explanation:
        "퍼사드는 여러 복잡한 API 호출이나 서브시스템을 하나의 간단한 인터페이스로 감쌉니다. " +
        "예를 들어 UserService.getProfile()이 내부적으로 3개의 API를 호출하더라도, " +
        "컴포넌트는 단 하나의 메서드만 호출하면 됩니다.",
    },
    {
      id: "q5",
      question: "React의 컴포넌트 트리(부모-자식 관계)는 어떤 구조 패턴과 가장 유사한가?",
      choices: [
        "어댑터 패턴",
        "프록시 패턴",
        "컴포지트 패턴",
        "퍼사드 패턴",
      ],
      correctIndex: 2,
      explanation:
        "컴포지트 패턴은 개별 객체와 복합 객체를 동일한 인터페이스로 다룹니다. " +
        "React에서 단일 컴포넌트와 여러 자식을 가진 컴포넌트 모두 동일한 방식(JSX)으로 렌더링하는 것이 " +
        "컴포지트 패턴의 전형적인 사례입니다.",
    },
  ],
};

export default chapter;
