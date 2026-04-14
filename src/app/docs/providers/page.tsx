import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Providers" };

export default function ProvidersPage() {
  return (
    <DocsPage
      title="Providers"
      description="ElasticClaw supports pluggable VM providers. The primary supported provider is Replicated CMX."
    >
      <Section title="Supported Providers">
        <div className="space-y-3">
          {[
            { name: "Replicated CMX", status: "Supported", desc: "Cloud-hosted VM infrastructure via Replicated's Compatibility Matrix (CMX). Recommended for production." },
            { name: "Local (Docker)", status: "Experimental", desc: "Run agent containers locally using Docker. Good for development and testing." },
            { name: "Custom", status: "Planned", desc: "Bring your own VM provider via the provider interface. AWS, GCP, Hetzner, etc." },
          ].map((p) => (
            <div key={p.name} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-semibold text-white">{p.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "Supported" ? "bg-cyan-900 text-cyan-300" : p.status === "Experimental" ? "bg-yellow-900 text-yellow-300" : "bg-zinc-800 text-zinc-400"}`}>
                  {p.status}
                </span>
              </div>
              <p className="text-zinc-400 text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Replicated CMX Setup">
        <ol className="list-decimal list-inside space-y-3 text-sm">
          <li>
            Sign up at{" "}
            <a
              href="https://vendor.replicated.com"
              className="text-cyan-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              vendor.replicated.com
            </a>
          </li>
          <li>
            Create an application and navigate to{" "}
            <strong>Compatibility Matrix</strong>
          </li>
          <li>Generate a CMX API token from your account settings</li>
          <li>Note your cluster/app slug</li>
        </ol>
        <CodeBlock lang="bash">{`export REPLICATED_API_TOKEN=your-token-here`}</CodeBlock>
        <p>Configure in <code className="text-cyan-300">hub.yaml</code>:</p>
        <CodeBlock lang="yaml">{`provider:
  type: replicated-cmx
  endpoint: https://api.replicated.com
  token: \${REPLICATED_API_TOKEN}
  app_slug: my-elasticclaw-app   # your Replicated app slug

defaults:
  instance_type: r1.small        # CMX instance type
  region: us-east-1
  ttl: 24h                       # auto-destroy after 24 hours`}</CodeBlock>
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

      <Note>
        TTL-based auto-destroy helps control costs. Set a reasonable TTL in
        your defaults and override per-agent with{" "}
        <code>elasticclaw create --ttl 4h</code>.
      </Note>
    </DocsPage>
  );
}
