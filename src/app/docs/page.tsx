import type { Metadata } from "next";
import Link from "next/link";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Overview" };

export default function DocsOverviewPage() {
  return (
    <DocsPage
      title="Overview"
      description="ElasticClaw provisions AI agents as ephemeral VMs — isolated environments with full git access, a terminal, and real-time streaming."
    >
      <Note>
        ElasticClaw is early-stage open source software. Expect rough edges and
        breaking changes until v1.0.
      </Note>

      <Section title="What is ElasticClaw?">
        <p>
          ElasticClaw lets you spin up AI agent VMs on demand. Each agent is a
          real virtual machine running your bootstrap template. Agents connect
          to your AI provider, can read and write files, run commands, and
          integrate with GitHub.
        </p>
        <p>
          The core components are:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2 text-zinc-400">
          <li><strong className="text-zinc-200">elasticclaw CLI</strong> — create, manage, and chat with agents</li>
          <li><strong className="text-zinc-200">hub.yaml</strong> — your central config: providers, templates, secrets</li>
          <li><strong className="text-zinc-200">elasticclaw-config.yaml</strong> — per-template bootstrap definition</li>
          <li><strong className="text-zinc-200">elasticclaw-web</strong> — optional web dashboard with real-time streaming</li>
        </ul>
      </Section>

      <Section title="Quick Start">
        <p>Install the CLI:</p>
        <CodeBlock lang="bash">{`brew tap elasticclaw/elasticclaw
brew install elasticclaw`}</CodeBlock>
        <p>Create your first agent:</p>
        <CodeBlock lang="bash">{`elasticclaw create --name my-agent --template my-template
elasticclaw chat my-agent`}</CodeBlock>
      </Section>

      <Section title="Next Steps">
        <ul className="list-disc list-inside space-y-2">
          <li>
            <Link href="/docs/installation" className="text-cyan-400 hover:underline">
              Installation
            </Link>{" "}
            — all install methods
          </li>
          <li>
            <Link href="/docs/hub" className="text-cyan-400 hover:underline">
              Hub Config
            </Link>{" "}
            — configure providers and templates
          </li>
          <li>
            <Link href="/docs/templates" className="text-cyan-400 hover:underline">
              Templates
            </Link>{" "}
            — build your own agent template
          </li>
          <li>
            <Link href="/docs/github-integration" className="text-cyan-400 hover:underline">
              GitHub Integration
            </Link>{" "}
            — connect your repos
          </li>
        </ul>
      </Section>
    </DocsPage>
  );
}
