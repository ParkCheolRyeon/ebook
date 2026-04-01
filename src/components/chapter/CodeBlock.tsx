import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";

interface CodeBlockProps {
  code: string;
  language: "typescript" | "javascript";
  description?: string;
}

export default function CodeBlock({ code, language, description }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <div className="my-4">
      {description && (
        <p className="mb-2 text-sm text-zinc-500">{description}</p>
      )}
      <pre className={`language-${language}`}>
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
