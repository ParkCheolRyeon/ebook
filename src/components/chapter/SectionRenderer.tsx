import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import type { ChapterSection } from "@/types/chapter";
import CodeBlock from "./CodeBlock";

function InlineCodeBlock({ className, children }: { className?: string; children?: React.ReactNode }) {
  const codeRef = useRef<HTMLElement>(null);
  const match = /language-(\w+)/.exec(className || "");

  useEffect(() => {
    if (match && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [children, match]);

  if (match) {
    const lang = match[1];
    return (
      <pre className={`language-${lang}`}>
        <code ref={codeRef} className={`language-${lang}`}>
          {String(children).replace(/\n$/, "")}
        </code>
      </pre>
    );
  }
  return <code className={className}>{children}</code>;
}

const sectionIcons: Record<string, string> = {
  analogy: "🎨",
  problem: "🎯",
  solution: "💡",
  pseudocode: "⚙️",
  practice: "🛠️",
  summary: "📋",
  checklist: "✅",
};

const sectionLabels: Record<string, string> = {
  analogy: "비유로 이해하기",
  problem: "문제 정의",
  solution: "해결 방법",
  pseudocode: "기술 구현",
  practice: "실습 예제",
  summary: "전체 요약",
  checklist: "학습 체크리스트",
};

interface SectionRendererProps {
  section: ChapterSection;
}

export default function SectionRenderer({ section }: SectionRendererProps) {
  const icon = sectionIcons[section.type] ?? "";
  const label = sectionLabels[section.type] ?? section.title;

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h2 className="text-lg font-bold text-zinc-900">{section.title || label}</h2>
      </div>

      {section.content && (
        <div className="prose prose-zinc max-w-none text-[15px] leading-7 prose-headings:text-base prose-headings:font-semibold prose-p:text-zinc-700 prose-strong:text-zinc-900 prose-code:rounded prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:text-zinc-600 prose-code:before:content-none prose-code:after:content-none prose-table:text-sm prose-th:bg-zinc-50 prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: ({ className, children, ...props }) => {
                const isBlock = /language-/.test(className || "");
                if (isBlock) {
                  return <InlineCodeBlock className={className}>{children}</InlineCodeBlock>;
                }
                return <code className={className} {...props}>{children}</code>;
              },
              pre: ({ children }) => <>{children}</>,
            }}
          >
            {section.content}
          </Markdown>
        </div>
      )}

      {section.code && (
        <CodeBlock
          code={section.code.code}
          language={section.code.language}
          description={section.code.description}
        />
      )}
    </section>
  );
}
