import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPage, Section, CodeBlock } from "@/components/docs-page";
import Link from "next/link";

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

export async function generateMetadata({ params }: { params: Promise<{ version: string }> }): Promise<Metadata> {
  const { version } = await params;
  const release = RELEASE_DETAILS[version];
  return {
    title: release ? `${release.version} — ${release.title}` : "Release Not Found",
  };
}

export default async function ReleasePage({ params }: { params: Promise<{ version: string }> }) {
  const { version } = await params;
  const release = RELEASE_DETAILS[version];

  if (!release) {
    notFound();
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
        ← All releases
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

      {release.rawChangelog.length > 0 && (
        <Section title="Raw Changelog">
          <details className="group">
            <summary className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-300 transition-colors select-none">
              Show raw git changelog
            </summary>
            <CodeBlock lang="text">{release.rawChangelog}</CodeBlock>
          </details>
        </Section>
      )}
    </DocsPage>
  );
}
