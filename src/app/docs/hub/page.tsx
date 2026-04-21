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
        <CodeBlock lang="yaml">{`# Hub connection
url: http://localhost:8080
public_url: https://hub.example.com   # URL claws use to connect back
token: your-hub-token                  # CLI login token
claw_token: your-claw-token           # token for claw registration
ui_password: coral-tiger-42           # web UI login password

# VM providers
providers:
  replicated:
    token: your-replicated-token
    default_instance_type: r1.large
    default_ttl: 48h
  daytona:
    api_url: https://app.daytona.io
    api_key: your-daytona-key
    default_snapshot: daytona-large

# LLM API keys (multiple providers supported)
llm_keys:
  - name: anthropic-prod
    provider: anthropic
    api_key: sk-ant-...
    default: true
  - name: fireworks-kimi
    provider: fireworks
    api_key: fw-...

# Default model (provider/model format)
default_model: anthropic/claude-sonnet-4-6

# GitHub App (for repo access and token minting)
github_apps:
  - app_id: 123456
    private_key_pem: |
      -----BEGIN RSA PRIVATE KEY-----
      ...

# Integrations (for factories)
integrations:
  linear:
    - workspace: my-company
      api_key: lin_api_...
  shortcut:
    - workspace: my-company
      token: sc-token-...

# Factories (auto-spawn claws from issue status changes)
factories:
  - name: feature-factory
    integration: linear
    workspace: my-company
    trigger_status: "Ready for Agent"
    done_status: "In Review"
    terminate_on_leave: true
    template: base
    webhook_secret: whsec_...

# Branding (optional white-label)
branding:
  app_name: My Platform
  logo_url: https://example.com/logo.png
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
