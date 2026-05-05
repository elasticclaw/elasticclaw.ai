import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Hub Config" };

export default function HubPage() {
  return (
    <DocsPage
      title="Hub Config"
      description="hub.yaml is your central ElasticClaw configuration file — it defines providers, templates, LLM keys, integrations, factories, secrets, MCP servers, and auth."
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

# VM providers
providers:
  daytona:
    api_url: https://app.daytona.io
    api_key: \${DAYTONA_API_KEY}
    default_snapshot: daytona-large
  vercel:
    access_token: \${VERCEL_TOKEN}
    team_id: team_xxx
    project_id: prj_xxx
  replicated:
    token: \${REPLICATED_TOKEN}
    default_instance_type: r1.large
    default_ttl: 48h

# LLM API keys (named)
llm_keys:
  - name: anthropic-prod
    provider: anthropic
    api_key: \${ANTHROPIC_API_KEY}
    default: true
    default_model: anthropic/claude-sonnet-4-6
  - name: fireworks-kimi
    provider: fireworks
    api_key: \${FIREWORKS_API_KEY}
    default_model: fireworks/accounts/fireworks/models/kimi-k2p6

# Default model (provider/model format)
default_model: anthropic/claude-sonnet-4-6

# GitHub App (for repo access and token minting)
github_apps:
  - app_id: 123456
    private_key_pem: |
      -----BEGIN RSA PRIVATE KEY-----
      ...

# Integrations
integrations:
  linear:
    - workspace: my-company
      api_key: \${LINEAR_API_TOKEN}
      webhook_secret: \${LINEAR_WEBHOOK_SECRET}
  shortcut:
    - workspace: my-company
      token: \${SHORTCUT_TOKEN}
  github_issues:
    - workspace: my-org
      token: \${GITHUB_TOKEN}
      webhook_secret: \${GITHUB_WEBHOOK_SECRET}

# Factories
factories:
  - name: feature-factory
    integration: linear
    workspace: my-company
    trigger_status: "Ready for Agent"
    done_status: "In Review"
    terminate_on_leave: true
    template: base
    webhook_secret_ref: linear_webhook_secret

# Secrets
secrets:
  linear_webhook_secret: whsec_xxx
  github_token: ghp_xxx

# MCP Servers
mcp_servers:
  - name: github
    source: npx
    package: "@modelcontextprotocol/server-github"
    enabled: true
    secrets:
      GITHUB_TOKEN: github_token

# Authentication
auth:
  github_oauth:
    client_id: Ov23lixxxxxxxxxxxx
    client_secret: \${GITHUB_OAUTH_SECRET}
    allowed_users: []
    allowed_orgs: []
    allowed_teams: []
  disable_password_auth: false

# Branding (optional white-label)
branding:
  app_name: My Platform
  logo_url: https://example.com/logo.png

# SSH keys added to every VM
ssh_public_keys:
  - ssh-ed25519 AAAAC3NzaC...`}</CodeBlock>
      </Section>

      <Section title="Fields Reference">
        <div className="space-y-4">
          {[
            { field: "url", desc: "Hub URL for CLI connections." },
            { field: "public_url", desc: "URL claws use to connect back from remote VMs. Falls back to url if not set." },
            { field: "token", desc: "CLI authentication token." },
            { field: "claw_token", desc: "Token for claw registration. Auto-generated if unset." },
            { field: "ui_password", desc: "Web UI login password. Defaults to 'admin' if not set." },
            { field: "providers", desc: "VM provider configs. See Providers docs." },
            { field: "llm_keys", desc: "Named LLM API keys. One can be marked default:true." },
            { field: "default_model", desc: "Global default model (provider/model format)." },
            { field: "github_apps", desc: "GitHub App credentials for repo access and token minting." },
            { field: "integrations", desc: "External service configs: linear, shortcut, github_issues." },
            { field: "factories", desc: "Automation rules that spin up claws from integration events." },
            { field: "secrets", desc: "Named secret values referenced by factories and MCP servers." },
            { field: "mcp_servers", desc: "MCP server configs available to claws." },
            { field: "auth", desc: "GitHub OAuth and tag-based access control for the web UI." },
            { field: "branding", desc: "White-label: app_name, logo_url." },
            { field: "ssh_public_keys", desc: "Extra SSH keys injected into every provisioned VM." },
            { field: "bridge_image", desc: "OCI artifact reference for claw-bridge. Defaults to ghcr.io/elasticclaw/claw-bridge:latest." },
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
