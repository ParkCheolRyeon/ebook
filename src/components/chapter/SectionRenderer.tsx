import type { ChapterSection } from "@/types/chapter";
import CodeBlock from "./CodeBlock";
const sectionIcons: Record<string, string> = { analogy: "🎨", problem: "🎯", solution: "💡", pseudocode: "⚙️", practice: "🛠️", summary: "📋", checklist: "✅" };
const sectionLabels: Record<string, string> = { analogy: "비유로 이해하기", problem: "문제 정의", solution: "해결 방법", pseudocode: "기술 구현", practice: "실습 예제", summary: "전체 요약", checklist: "학습 체크리스트" };
interface SectionRendererProps { section: ChapterSection; }
export default function SectionRenderer({ section }: SectionRendererProps) {
  const icon = sectionIcons[section.type] ?? "";
  const label = sectionLabels[section.type] ?? section.title;
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h2 className="text-lg font-bold text-zinc-900">{section.title || label}</h2>
      </div>
      {section.content && (<div className="prose-like text-[15px] leading-7 text-zinc-700 whitespace-pre-line">{section.content}</div>)}
      {section.code && (<CodeBlock code={section.code.code} language={section.code.language} description={section.code.description} />)}
    </section>
  );
}
