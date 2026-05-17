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
            { name: "exe.dev", href: "/docs/exe-dev", status: "Supported", desc: "Persistent VMs with SSH access. No cloud account needed — just SSH key authentication.", type: "stateful" },
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

      <Section title="Instance Types (CMX)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 pr-6 text-zinc-400 font-medium">Type</th>
                <th className="text-left py-2 pr-6 text-zinc-400 font-medium">CPU</th>
                <th className="text-left py-2 pr-6 text-zinc-400 font-medium">RAM</th>
                <th className="text-left py-2 text-zinc-400 font-medium">Use case</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {[
                { type: "r1.nano", cpu: "1", ram: "2GB", use: "Lightweight agents" },
                { type: "r1.small", cpu: "2", ram: "4GB", use: "General purpose" },
                { type: "r1.medium", cpu: "4", ram: "8GB", use: "Build-heavy workloads" },
                { type: "r1.large", cpu: "8", ram: "16GB", use: "Data-intensive agents" },
              ].map((row) => (
                <tr key={row.type} className="border-b border-zinc-900">
                  <td className="py-2 pr-6">
                    <code className="text-cyan-300">{row.type}</code>
                  </td>
                  <td className="py-2 pr-6">{row.cpu}</td>
                  <td className="py-2 pr-6">{row.ram}</td>
                  <td className="py-2 text-zinc-400">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Provider capabilities">
        <div className="space-y-2 text-sm text-zinc-400">
          <p><code className="text-cyan-300">exec</code> — Execute commands in the sandbox (all providers)</p>
          <p><code className="text-cyan-300">snapshot</code> — Start from a prebuilt sandbox image (Daytona)</p>
          <p><code className="text-cyan-300">ssh</code> — Direct SSH access (exe.dev)</p>
        </div>
      </Section>

      <Section title="Listing providers">
        <CodeBlock lang="bash">{`elasticclaw provider list`}</CodeBlock>
      </Section>

      <Note>
        TTL-based auto-destroy helps control costs for ephemeral providers
        (Daytona, CMX). exe.dev VMs are persistent and not subject to
        TTL — delete them explicitly when no longer needed.
      </Note>
    </DocsPage>
  );
}
