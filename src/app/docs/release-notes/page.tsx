import type { Metadata } from "next";
import { DocsPage, Section } from "@/components/docs-page";
import Link from "next/link";

export const metadata: Metadata = { title: "Release Notes" };

interface Release {
  version: string;
  date: string;
  title: string;
  summary: string;
}

// This array is updated by the release automation workflow.
// Newest first.
const RELEASES: Release[] = [
  {
    version: "2026.5.23",
    date: "2026-05-23",
    title: "Self‑Terminate Signal Added",
    summary: "New self‑termination signal, model updates, and a slew of fixes to keep ElasticClaw sharp.",
  },
  {
    version: "2026.5.21",
    date: "2026-05-21",
    title: "The One With the AI Troubleshooter",
    summary: "AI diagnostics, smarter triggers, and tougher GitHub resilience in this release.",
  },
  {
    version: "2026.5.20",
    date: "2026-05-20",
    title: "The Claw Awakens: ElasticClaw 2026.5.20",
    summary: "A fresh batch of async bootstraps, smarter queues, and bug‑squashing for a smoother claw experience.",
  },
  {
    version: "2026.5.16",
    date: "2026-05-16",
    title: "Mission: Possible – The SSH Key Heist",
    summary: "A sleek batch of auto‑key magic, smarter factories, and rock‑solid messaging.",
  },
  {
    version: "2026.5.15",
    date: "2026-05-15",
    title: "The One With the New Factory",
    summary: "New factories, smarter context view, and a slew of under‑the‑hood fixes.",
  },
  {
    version: "2026.5.14",
    date: "2026-05-15",
    title: "Claw Wars: The Sandbox Strikes Back",
    summary: "A sandbox‑powered upgrade that adds new providers, analytics, and a Design factory while tightening reliability and fixing a slew of integration quirks.",
  },
  {
    version: "2026.5.13",
    date: "2026-05-13",
    title: "The One With the Codex and the Claws",
    summary: "Codex joins the LLM lineup, Greptile reviews surface in‑app, and manual factory triggers get a UI makeover—all while tightening security and squashing a host of bugs.",
  },
  // Example entry — removed by automation on first real release
  // {
  //   version: "2026.5.12",
  //   date: "2026-05-12",
  //   title: "The One With Secret Refs",
  //   summary: "Template secret_refs, doctor improvements, and a whole lot of polish.",
  // },
];

export default function ReleaseNotesPage() {
  return (
    <DocsPage
      title="Release Notes"
      description="What's new in ElasticClaw — human-friendly summaries of every release."
    >
      {RELEASES.length === 0 ? (
        <p className="text-zinc-500 text-sm">
          No releases yet. Check back soon!
        </p>
      ) : (
        <div className="space-y-4">
          {RELEASES.map((release) => (
            <Link
              key={release.version}
              href={`/docs/release-notes/${release.version}`}
              className="block rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 hover:border-cyan-500/30 hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded">
                  {release.version}
                </span>
                <span className="text-xs text-zinc-500">{release.date}</span>
              </div>
              <h3 className="text-sm font-medium text-white mb-1">
                {release.title}
              </h3>
              <p className="text-sm text-zinc-400">{release.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </DocsPage>
  );
}
