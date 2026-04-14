import type { ReactNode } from "react";

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
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden my-4">
      {lang && (
        <div className="px-4 py-2 border-b border-zinc-800 text-xs text-zinc-500 font-mono">
          {lang}
        </div>
      )}
      <pre className="px-5 py-4 text-sm text-zinc-200 font-mono overflow-x-auto whitespace-pre">
        <code>{children}</code>
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
