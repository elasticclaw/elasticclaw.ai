"use client";

import { useEffect, useState } from "react";

let initialized = false;

async function initMermaid() {
  if (initialized) return;
  const mermaid = await import("mermaid");
  (mermaid.default.initialize as any)({
    startOnLoad: false,
    theme: "dark",
    themeVariables: {
      primaryColor: "#18181b",
      primaryTextColor: "#e4e4e7",
      primaryBorderColor: "#3f3f46",
      lineColor: "#71717a",
      secondaryColor: "#27272a",
      tertiaryColor: "#09090b",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: "13px",
    },
    flowchart: {
      curve: "basis",
      padding: 16,
    },
    stateDiagram: {
      padding: 16,
    },
  });
  initialized = true;
}

interface MermaidProps {
  chart: string;
}

export default function MermaidChart({ chart }: MermaidProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        await initMermaid();
        const mermaid = await import("mermaid");

        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg: renderedSvg } = await mermaid.default.render(id, chart.trim());

        if (!cancelled) {
          setSvg(renderedSvg);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render diagram");
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="bg-zinc-900 border border-red-800 rounded-xl p-4 my-4">
        <p className="text-red-400 text-sm">Diagram error: {error}</p>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 my-4 flex items-center justify-center">
        <div className="animate-pulse text-zinc-500 text-sm">Loading diagram...</div>
      </div>
    );
  }

  return (
    <div
      className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden my-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
