"use client";

import type { ReactNode } from "react";
import MermaidChart from "./mermaid";
import Prism from "prismjs";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-diff";
import "prismjs/components/prism-go";
import "prismjs/components/prism-python";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-toml";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-scss";
import { useMemo } from "react";

export function DocsPage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
      {description && (
        <p className="text-zinc-400 text-lg mb-8 border-b border-zinc-800 pb-6">
          {description}
        </p>
      )}
      <div className="space-y-6 text-zinc-300">{children}</div>
    </article>
  );
}

export function CodeBlock({
  children,
  lang,
}: {
  children: string;
  lang?: string;
}) {
  // Map common lang aliases to Prism grammar names
  const prismLang =
    lang === "yaml" || lang === "yml"
      ? "yaml"
      : lang === "bash" || lang === "sh" || lang === "shell" || lang === "zsh"
      ? "bash"
      : lang === "js" || lang === "javascript"
      ? "javascript"
      : lang === "ts"
      ? "typescript"
      : lang === "tsx"
      ? "tsx"
      : lang === "jsx"
      ? "jsx"
      : lang === "json"
      ? "json"
      : lang === "md" || lang === "markdown"
      ? "markdown"
      : lang === "text" || lang === "txt" || lang === "log"
      ? undefined
      : lang === "diff"
      ? "diff"
      : lang === "go" || lang === "golang"
      ? "go"
      : lang === "py" || lang === "python"
      ? "python"
      : lang === "rs" || lang === "rust"
      ? "rust"
      : lang === "sql"
      ? "sql"
      : lang === "toml"
      ? "toml"
      : lang === "css"
      ? "css"
      : lang === "scss"
      ? "scss"
      : lang;

  const highlighted = useMemo(() => {
    if (!prismLang) return children;
    const grammar = Prism.languages[prismLang];
    if (!grammar) {
      // Escape HTML entities so raw code is displayed literally, not rendered as markup.
      return children
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
    return Prism.highlight(children, grammar, prismLang);
  }, [children, prismLang]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden my-4">
      {lang && (
        <div className="px-4 py-2 border-b border-zinc-800 text-xs text-zinc-500 font-mono">
          {lang}
        </div>
      )}
      <pre className="px-5 py-4 text-sm font-mono overflow-x-auto whitespace-pre text-zinc-200">
        <code
          className={prismLang ? `language-${prismLang}` : undefined}
          dangerouslySetInnerHTML={
            prismLang ? { __html: highlighted } : undefined
          }
        >
          {!prismLang ? children : null}
        </code>
      </pre>
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <div className="text-zinc-400 space-y-3">{children}</div>
    </section>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="border-l-2 border-cyan-500 bg-cyan-950/20 rounded-r-lg px-4 py-3 my-4 text-sm text-cyan-200">
      {children}
    </div>
  );
}

export function MermaidDiagram({ children }: { children: string }) {
  return <MermaidChart chart={children} />;
}
