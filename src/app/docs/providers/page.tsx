import type { Metadata } from "next";
import Link from "next/link";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Providers" };

export default function ProvidersPage() {
  return (
    <DocsPage
      title="Providers"
      description="ElasticClaw supports pluggable sandbox providers. Choose the right provider for your workload."
    >
      <Section title="Supported Providers">
        <div className="space-y-3">
          {[
            { name: "Daytona", href: "/docs/providers/daytona", status: "Supported", desc: "Cloud dev environments with snapshot support. Good for fast sandbox startup.", type: "ephemeral" },
            { name: "Replicated CMX", href: "/docs/providers/replicated", status: "Supported", desc: "Cloud-hosted sandbox infrastructure via Replicated's Compatibility Matrix.", type: "ephemeral" },
            { name: "exedev", href: "/docs/exe-dev", status: "Supported", desc: "Persistent VMs with SSH access through exe.dev. No cloud account needed — just SSH key authentication.", type: "stateful" },
            { name: "Docker", href: "/docs/providers", status: "Supported", desc: "Local Docker-backed agents for development and CI-style validation. Useful with the Docker dev stack and optional Ollama.", type: "local" },
          ].map((p) => (
            <div key={p.name} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-1">
                <Link href={p.href} className="font-semibold text-white hover:text-cyan-300">
                  {p.name}
                </Link>
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "Supported" ? "bg-cyan-900 text-cyan-300" : p.status === "Experimental" ? "bg-yellow-900 text-yellow-300" : "bg-zinc-800 text-zinc-400"}`}>
                  {p.status}
                </span>
                <span className="text-xs text-zinc-500">{p.type}</span>
              </div>
              <p className="text-zinc-400 text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Provider capabilities">
        <div className="space-y-2 text-sm text-zinc-400">
          <p><code className="text-cyan-300">exec</code> — Execute commands in the sandbox (all providers)</p>
          <p><code className="text-cyan-300">snapshot</code> — Start from a prebuilt sandbox image (Daytona)</p>
          <p><code className="text-cyan-300">ssh</code> — Direct SSH access (exedev)</p>
          <p><code className="text-cyan-300">image</code> and <code className="text-cyan-300">network</code> — Docker provider container image and network settings</p>
        </div>
      </Section>

      <Section title="Docker provider">
        <p>
          Docker is available for local development, integration tests, and
          self-contained validation environments. Configure it as a sandbox
          provider in <code>hub.yaml</code>, then select it from a workspace or
          workflow with <code>provider: docker</code>.
        </p>
        <CodeBlock lang="yaml">{`providers:
  docker:
    image: elasticclaw/claw-agent:dev
    network: elasticclaw-dev`}</CodeBlock>
        <Note>
          Docker runs agents on the hub host. Use Daytona, Replicated CMX, or
          exedev when you need isolated hosted sandboxes for production agents.
        </Note>
      </Section>

      <Section title="Listing providers">
        <CodeBlock lang="bash">{`elasticclaw provider list`}</CodeBlock>
      </Section>

      <Note>
        TTL-based auto-destroy helps control costs for ephemeral providers
        (Daytona, CMX). exedev VMs are persistent and not subject to
        TTL — delete them explicitly when no longer needed. The old local
        provider has been removed; use Docker for local sandboxes.
      </Note>
    </DocsPage>
  );
}
