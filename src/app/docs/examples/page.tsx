import type { Metadata } from "next";
import { DocsPage, Section } from "@/components/docs-page";

export const metadata: Metadata = { title: "Examples" };

export default function ExamplesPage() {
  return (
    <DocsPage
      title="Examples"
      description="Real-world workflow configurations you can adapt to your setup."
    >
      <Section title="Available examples">
        <ul className="list-disc list-inside space-y-2 text-sm text-zinc-400">
          <li>
            <a href="/docs/examples/bugfix-linear" className="text-cyan-400 hover:underline">
              Bug fixes from a single Linear board
            </a>
            <span className="text-zinc-500"> — ENG team, bug label, Triage trigger</span>
          </li>
          <li>
            <a href="/docs/examples/feature-github" className="text-cyan-400 hover:underline">
              Human-tagged feature work in GitHub Issues
            </a>
            <span className="text-zinc-500"> — PM labels, claw picks it up</span>
          </li>
          <li>
            <a href="/docs/examples/dependabot" className="text-cyan-400 hover:underline">
              Auto-resolve Dependabot alerts
            </a>
            <span className="text-zinc-500"> — bump, test, auto-merge pipeline</span>
          </li>
        </ul>
      </Section>
    </DocsPage>
  );
}
