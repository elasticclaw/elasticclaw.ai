import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Replicated CMX Provider" };

export default function ReplicatedProviderPage() {
  return (
    <DocsPage
      title="Replicated CMX Provider"
      description="Configure Replicated Compatibility Matrix sandboxes for ElasticClaw."
    >
      <Section title="Overview">
        <p>
          Replicated CMX provisions cloud-hosted sandbox VMs through Replicated's
          Compatibility Matrix infrastructure.
        </p>
        <div className="space-y-2 text-sm text-zinc-400 mt-4">
          <p><strong>Type:</strong> Ephemeral sandbox</p>
          <p><strong>Auth:</strong> Replicated API token</p>
          <p><strong>Capabilities:</strong> <code className="text-cyan-300">exec</code></p>
          <p><strong>Best for:</strong> Production factory workloads with TTL-based cleanup</p>
        </div>
      </Section>

      <Section title="Prerequisites">
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
            .
          </li>
          <li>Create an application and open <strong>Compatibility Matrix</strong>.</li>
          <li>Generate a CMX API token from your account settings.</li>
        </ol>
      </Section>

      <Section title="Configure hub.yaml">
        <CodeBlock lang="bash">{`export REPLICATED_API_TOKEN=your-token-here`}</CodeBlock>
        <CodeBlock lang="yaml">{`providers:
  replicated:
    token: \${REPLICATED_API_TOKEN}
    default_instance_type: r1.small
    default_ttl: 24h`}</CodeBlock>
      </Section>

      <Section title="Instance types">
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

      <Section title="Use in templates">
        <CodeBlock lang="yaml">{`# elasticclaw-config.yaml
provider: replicated
instance_type: r1.small
ttl: 4h`}</CodeBlock>
      </Section>

      <Note>
        Use TTLs to control cost. Factory-created claws are also terminated by
        their pipeline when work reaches a terminal state.
      </Note>
    </DocsPage>
  );
}
