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
