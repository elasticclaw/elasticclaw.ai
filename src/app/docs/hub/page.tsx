import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Hub Config" };

export default function HubPage() {
  return (
    <DocsPage
      title="Hub Config"
      description="hub.yaml is your central ElasticClaw configuration file — it defines providers, templates, and global settings."
    >
      <Section title="Overview">
        <p>
          The hub config lives at <code className="text-cyan-300">hub.yaml</code>{" "}
          in your project root (or at{" "}
          <code className="text-cyan-300">~/.elasticclaw/hub.yaml</code> for
          global config). It tells ElasticClaw where to provision VMs, which
          templates to use, and how to connect integrations.
        </p>
      </Section>

      <Section title="Example hub.yaml">
        <CodeBlock lang="yaml">{`version: "1"

provider:
  type: replicated-cmx
  endpoint: https://api.replicated.com
  token: \${REPLICATED_API_TOKEN}

defaults:
  instance_type: r1.small
  region: us-east-1
  ttl: 24h

templates:
  - name: my-template
    source: ./templates/my-template
    description: "General purpose dev agent"

integrations:
  github:
    app_id: \${GITHUB_APP_ID}
    private_key_path: ./github-app.pem
    installation_id: \${GITHUB_INSTALLATION_ID}
  linear:
    token: \${LINEAR_API_TOKEN}
    team_id: \${LINEAR_TEAM_ID}

web:
  enabled: true
  port: 8080
  auth_token: \${ELASTICCLAW_WEB_TOKEN}
`}</CodeBlock>
      </Section>

      <Section title="Fields Reference">
        <div className="space-y-4">
          {[
            { field: "version", desc: 'Config schema version. Currently "1".' },
            { field: "provider", desc: "VM provider config. See Providers docs." },
            { field: "defaults", desc: "Default VM instance type, region, and TTL for all agents." },
            { field: "templates", desc: "List of agent templates. Each entry points to a directory with an elasticclaw-config.yaml." },
            { field: "integrations.github", desc: "GitHub App credentials for issue/PR integration." },
            { field: "integrations.linear", desc: "Linear API token and team ID for ticket sync." },
            { field: "web", desc: "Web dashboard config — enable, port, and auth token." },
          ].map((row) => (
            <div key={row.field} className="flex gap-4">
              <code className="text-cyan-300 shrink-0 text-sm">{row.field}</code>
              <span className="text-zinc-400 text-sm">{row.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      <Note>
        All <code>{"${...}"}</code> values are resolved from environment
        variables. Use a <code>.env</code> file or your secrets manager of
        choice.
      </Note>
    </DocsPage>
  );
}
