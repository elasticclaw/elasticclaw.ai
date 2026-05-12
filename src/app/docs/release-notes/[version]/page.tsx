import type { Metadata } from "next";
import { DocsPage, Section, CodeBlock } from "@/components/docs-page";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ReleaseDetail {
  version: string;
  date: string;
  title: string;
  whatsNew: string[];
  improvements: string[];
  fixes: string[];
  rawChangelog: string;
}

// This map is updated by the release automation workflow.
const RELEASE_DETAILS: Record<string, ReleaseDetail> = {};

export function generateStaticParams() {
  return Object.keys(RELEASE_DETAILS).map((version) => ({ version }));
}

export function generateMetadata({ params }: { params: { version: string } }): Metadata {
  const release = RELEASE_DETAILS[params.version];
  return {
    title: release ? `${release.version} — ${release.title}` : "Release Not Found",
  };
}

export default function ReleasePage({ params }: { params: { version: string } }) {
  const release = RELEASE_DETAILS[params.version];

  if (!release) {
    return (
      <DocsPage title="Release Not Found">
        <p className="text-zinc-400">
          No release notes found for <code className="text-cyan-300">{params.version}</code>.
        </p>
        <Link
          href="/docs/release-notes"
          className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 mt-4"
        >
          <ArrowLeft className="size-3" />
          Back to all releases
        </Link>
      </DocsPage>
    );
  }

  return (
    <DocsPage
      title={`${release.version} — ${release.title}`}
      description={`Released ${release.date}`}
    >
      <Link
        href="/docs/release-notes"
        className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 mb-6"
      >
        <ArrowLeft className="size-3" />
        All releases
      </Link>

      {release.whatsNew.length > 0 && (
        <Section title="What's New">
          <ul className="list-disc list-inside space-y-2 text-sm text-zinc-300">
            {release.whatsNew.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      {release.improvements.length > 0 && (
        <Section title="Improvements">
          <ul className="list-disc list-inside space-y-2 text-sm text-zinc-300">
            {release.improvements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      {release.fixes.length > 0 && (
        <Section title="Fixes">
          <ul className="list-disc list-inside space-y-2 text-sm text-zinc-300">
            {release.fixes.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Raw Changelog">
        <details className="group">
          <summary className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-300 transition-colors select-none">
            Show raw git changelog
          </summary>
          <CodeBlock lang="text">{release.rawChangelog}</CodeBlock>
        </details>
      </Section>
    </DocsPage>
  );
}
