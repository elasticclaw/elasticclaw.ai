"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";

interface SearchDoc {
  title: string;
  href: string;
  excerpt: string;
  tags: string[];
}

const DOCS_INDEX: SearchDoc[] = [
  { title: "Overview", href: "/docs", excerpt: "What ElasticClaw is, core components, quick start.", tags: ["intro", "getting started"] },
  { title: "Installation", href: "/docs/installation", excerpt: "brew install, upgrade, remote server setup, CLI installation.", tags: ["install", "setup", "brew"] },
  { title: "CLI Reference", href: "/docs/cli-reference", excerpt: "All elasticclaw commands: create, chat, kill, factory, template, hub.", tags: ["cli", "commands", "reference"] },
  { title: "Architecture", href: "/docs/concepts", excerpt: "How ElasticClaw works — factory pipeline, templates, sandboxes, lifecycle.", tags: ["concepts", "architecture", "how it works"] },
  { title: "Hub Config", href: "/docs/hub", excerpt: "hub.yaml reference — providers, LLM keys, integrations, auth, secrets.", tags: ["config", "yaml", "hub"] },
  { title: "Providers", href: "/docs/providers", excerpt: "Sandbox providers: Daytona, Replicated CMX.", tags: ["providers", "daytona", "cmx", "sandbox"] },
  { title: "Models & LLM Keys", href: "/docs/models", excerpt: "Supported LLM providers: anthropic, fireworks.", tags: ["models", "llm", "anthropic", "fireworks", "api keys"] },
  { title: "Secrets", href: "/docs/secrets", excerpt: "Managing secrets in hub.yaml and templates.", tags: ["secrets", "env", "config"] },
  { title: "MCP Servers", href: "/docs/mcp-servers", excerpt: "External tool servers registered as agent tools.", tags: ["mcp", "tools", "servers"] },
  { title: "Authentication", href: "/docs/authentication", excerpt: "GitHub OAuth, UI password, access control.", tags: ["auth", "oauth", "security"] },
  { title: "Factories", href: "/docs/factories", excerpt: "Auto-spawn agents from Linear, GitHub Issues, Shortcut events.", tags: ["factories", "automation", "linear", "github"] },
  { title: "Linear Integration", href: "/docs/linear-integration", excerpt: "Setting up Linear webhooks and factories.", tags: ["linear", "integration", "webhook"] },
  { title: "GitHub Issues", href: "/docs/github-issues", excerpt: "Setting up GitHub Issues webhooks and factories.", tags: ["github", "issues", "integration"] },
  { title: "Shortcut Integration", href: "/docs/shortcut-integration", excerpt: "Setting up Shortcut webhooks and factories.", tags: ["shortcut", "integration", "webhook"] },
  { title: "GitHub App", href: "/docs/github-integration", excerpt: "GitHub App installation for PRs, CI, bugbot.", tags: ["github", "app", "pr", "ci"] },
  { title: "Web UI", href: "/docs/web-ui", excerpt: "Dashboard, claw cards, activity log, settings.", tags: ["ui", "dashboard", "web"] },
  { title: "Bug fixes (Linear)", href: "/docs/examples/bugfix-linear", excerpt: "Factory example: ENG team bug board, Triage trigger.", tags: ["example", "linear", "bug", "factory"] },
  { title: "Feature work (GitHub)", href: "/docs/examples/feature-github", excerpt: "Factory example: PM-tagged feature requests in GitHub Issues.", tags: ["example", "github", "feature", "factory"] },
  { title: "Dependabot auto-merge", href: "/docs/examples/dependabot", excerpt: "Factory example: auto-resolve Dependabot security alerts.", tags: ["example", "dependabot", "security", "factory"] },
];

function score(query: string, doc: SearchDoc): number {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  let score = 0;

  // Title match is highest
  if (doc.title.toLowerCase().includes(q)) score += 10;
  for (const w of words) {
    if (doc.title.toLowerCase().includes(w)) score += 5;
  }

  // Tag match
  for (const w of words) {
    if (doc.tags.some((t) => t.includes(w))) score += 3;
  }

  // Excerpt match
  if (doc.excerpt.toLowerCase().includes(q)) score += 2;
  for (const w of words) {
    if (doc.excerpt.toLowerCase().includes(w)) score += 1;
  }

  // Href match (for direct nav)
  if (doc.href.includes(q.replace(/\s/g, "-"))) score += 2;

  return score;
}

export default function DocsSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const scored = DOCS_INDEX.map((doc) => ({ doc, score: score(query, doc) }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
    return scored.map((s) => s.doc);
  }, [query]);

  useEffect(() => {
    setSelected(0);
  }, [results.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[selected]) {
      window.location.href = results[selected].href;
      setOpen(false);
    }
  }

  useEffect(() => {
    const el = listRef.current?.children[selected] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span>Search docs…</span>
        <kbd className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-xs rounded bg-zinc-800 text-zinc-500 border border-zinc-700">⌘K</kbd>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg mx-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 shrink-0">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search documentation…"
                className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
              />
              <kbd className="px-1.5 py-0.5 text-xs rounded bg-zinc-800 text-zinc-500 border border-zinc-700">ESC</kbd>
            </div>

            <div ref={listRef} className="max-h-80 overflow-y-auto">
              {results.length === 0 && query.trim() && (
                <div className="px-4 py-8 text-center text-sm text-zinc-500">
                  No results for “{query}”
                </div>
              )}
              {results.length === 0 && !query.trim() && (
                <div className="px-4 py-6 text-sm text-zinc-500 space-y-1">
                  <p className="px-2 text-xs uppercase tracking-wider text-zinc-600 font-medium">Popular</p>
                  {DOCS_INDEX.slice(0, 6).map((doc) => (
                    <Link
                      key={doc.href}
                      href={doc.href}
                      onClick={() => setOpen(false)}
                      className="block px-2 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 text-sm"
                    >
                      {doc.title}
                    </Link>
                  ))}
                </div>
              )}
              {results.map((doc, i) => (
                <Link
                  key={doc.href}
                  href={doc.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 border-b border-zinc-800/50 last:border-0 transition-colors ${
                    i === selected ? "bg-zinc-800/80" : "hover:bg-zinc-800/50"
                  }`}
                >
                  <div className="text-sm font-medium text-zinc-200">{doc.title}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{doc.excerpt}</div>
                </Link>
              ))}
            </div>

            <div className="px-4 py-2 border-t border-zinc-800 text-xs text-zinc-600 flex items-center gap-4">
              <span>↑↓ to navigate</span>
              <span>↵ to select</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
