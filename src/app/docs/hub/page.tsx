import type { Metadata } from "next";
import Link from "next/link";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Server Config" };

export default function HubPage() {
  return (
    <DocsPage
      title="Server Config"
      description="hub.yaml is your central ElasticClaw Server configuration file for providers, LLM keys, authentication, and server-level settings."
    >
      <Section title="Overview">
        <p>
          The server config lives at <code className="text-cyan-300">hub.yaml</code>{" "}
          in your project root (or at{" "}
          <code className="text-cyan-300">~/.elasticclaw/hub.yaml</code> for
          global config). It tells ElasticClaw where to provision sandboxes, which
          credentials to use, and which shared services are available to
          workspaces.
        </p>
        <p className="mt-2">
          Workspaces and workflows are not stored inline in <code>hub.yaml</code>.
          After you push them, ElasticClaw Server keeps them as files next to the config:{" "}
          <code className="text-cyan-300">workspaces/&lt;name&gt;/</code> for
          workspaces, with workflow YAML files nested under each workspace&apos;s{" "}
          <code className="text-cyan-300">workflows/</code> directory.
        </p>
      </Section>

      <Section title="Example hub.yaml">
        <CodeBlock lang="yaml">{`# Server connection
url: http://localhost:8080
public_url: https://server.example.com # URL agents use to connect back
token: your-server-token               # CLI login token
claw_token: your-agent-token           # token for agent registration
ui_password: \${UI_PASSWORD}           # web UI password (defaults to 'admin' if unset)

# Sandbox providers
providers:
  daytona:
    api_url: https://app.daytona.io
    api_key: \${DAYTONA_API_KEY}
    default_snapshot: daytona-large
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

# Hub-owned artifact storage
artifact_storage:
  backend: local
  local:
    path: /var/lib/elasticclaw/artifacts

# SSH keys added to every sandbox
ssh_public_keys:
  - ssh-ed25519 AAAAC3NzaC...`}</CodeBlock>
      </Section>

      <Section title="Artifact storage">
        <p>
          <code>artifact_storage</code> controls where the server stores
          hub-owned artifacts such as checkpoint payloads, future volumes, and
          other large non-Git data. The default is local storage under the hub
          data directory.
        </p>
        <p className="mt-2">
          Use{" "}
          <Link href="/docs/artifact-storage" className="text-cyan-300">
            Artifact Storage
          </Link>{" "}
          for local path and S3-compatible object store examples.
        </p>
      </Section>

      <Section title="External workspaces and workflows">
        <p>
          ElasticClaw Server creates <code>workspaces/</code> alongside{" "}
          <code>hub.yaml</code>. Use <code>elasticclaw workspace push</code> to
          publish workspace files, then <code>elasticclaw workflow push</code> to
          publish workflow YAML into a workspace.
        </p>
        <CodeBlock lang="text">{`~/.elasticclaw/
  hub.yaml
  workspaces/
    elasticclaw/
      elasticclaw-config.yaml
      AGENTS.md
      TOOLS.md
      workflows/
        feature-workflow.yaml`}</CodeBlock>
        <Note>
          This is the server storage layout after publishing. Author workspace
          files under <code>.elasticclaw/workspaces/</code> and workflow YAML
          under <code>.elasticclaw/workflows/</code> before pushing them.
        </Note>
      </Section>

      <Section title="Fields Reference">
        <div className="space-y-4">
          {[
            { field: "url", desc: "Server URL for CLI connections." },
            { field: "public_url", desc: "URL agents use to connect back from remote sandboxes. Falls back to url if not set." },
            { field: "token", desc: "CLI authentication token." },
            { field: "claw_token", desc: "Token for agent registration. Auto-generated if unset." },
            { field: "ui_password", desc: "Web UI login password. Defaults to 'admin' if not set." },
            { field: "providers", desc: "Sandbox provider configs. See Providers docs." },
            { field: "llm_keys", desc: "Named LLM API keys. One can be marked default:true." },
            { field: "default_model", desc: "Global default model (provider/model format)." },
            { field: "secrets", desc: "Named server-level secret values for server-managed services. Workspace runtime secrets are managed with elasticclaw secret." },
            { field: "auth", desc: "GitHub OAuth and tag-based access control for the web UI." },
            { field: "branding", desc: "White-label: app_name, logo_url." },
            { field: "artifact_storage", desc: "Local or S3-compatible storage for hub-owned artifacts." },
            { field: "ssh_public_keys", desc: "Extra SSH keys injected into every provisioned sandbox." },
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
