import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Secrets" };

export default function SecretsPage() {
  return (
    <DocsPage
      title="Secrets"
      description="Manage sensitive values in hub.yaml without exposing them in version control."
    >
      <Section title="Overview">
        <p>
          ElasticClaw uses a <code className="text-cyan-300">secrets</code> map in
          <code>hub.yaml</code> to store sensitive values — API tokens, webhook secrets,
          and custom credentials. Secrets are referenced by name and injected into claws
          and MCP servers at runtime.
        </p>
        <Note>
          Never commit <code>hub.yaml</code> with real secret values to version control.
          Use environment variable substitution (e.g. <code>{"${TOKEN}"}</code>) or a
          secrets manager.
        </Note>
      </Section>

      <Section title="Defining secrets">
        <CodeBlock lang="yaml">{`secrets:
  linear_token: \${LINEAR_API_TOKEN}
  github_webhook_secret: whsec_xxxxxxxx
  my_custom_key: sk-xxxxxxxx`}</CodeBlock>
        <p>
          Each key is a secret name. The value can be a literal string or an environment
          variable reference using <code>{"${VAR}"}</code> syntax.
        </p>
      </Section>

      <Section title="Referencing secrets in workflows">
        <p>
          Use <code className="text-cyan-300">webhook_secret_ref</code> in workflow.yaml
          to reference a secret by name instead of inlining it:
        </p>
        <CodeBlock lang="yaml">{`# workflow.yaml
name: my-workflow
integration: linear
webhook_secret_ref: linear_webhook_secret   # references hub.yaml secrets.linear_webhook_secret
workspace: base`}</CodeBlock>
      </Section>

      <Section title="Referencing secrets in workspaces">
        <p>
          Workspaces can request secrets via <code className="text-cyan-300">secret_refs</code>
          in <code>elasticclaw-config.yaml</code>. This maps environment variable names
          to hub secret names — simple and explicit.
        </p>
        <CodeBlock lang="yaml">{`# elasticclaw-config.yaml
secret_refs:
  LINEAR_API_KEY: linear_token        # injects secrets.linear_token as LINEAR_API_KEY
  MY_CUSTOM_KEY: my_custom_key        # injects secrets.my_custom_key as MY_CUSTOM_KEY`}</CodeBlock>
        <p>
          The legacy <code className="text-cyan-300">secrets</code> list format is still
          supported but deprecated. It uses typed objects that resolve secrets indirectly:
        </p>
        <CodeBlock lang="yaml">{`# DEPRECATED — still works, but migrate to secret_refs
secrets:
  - type: linear
    workspace: my-company    # resolves integrations.linear[].token
  - type: github-issues
    workspace: my-org        # resolves integrations.github_issues[].token
  - type: custom
    name: my_custom_key
    as: MY_API_KEY            # optional: override env var name`}</CodeBlock>
        <p>Supported types and their default env var names (legacy format):</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li><code>linear</code> → <code>LINEAR_API_KEY</code></li>
          <li><code>shortcut</code> → <code>SHORTCUT_API_KEY</code></li>
          <li><code>github-issues</code> → <code>GITHUB_ISSUES_API_KEY</code></li>
          <li><code>github</code> → <code>GITHUB_TOKEN</code></li>
          <li><code>custom</code> → uppercase of the secret name (override with <code>as</code>)</li>
        </ul>
        <Note>
          The Doctor dashboard will warn you if any workspaces still use the deprecated
          <code>secrets:</code> list format. Migrate to <code>secret_refs:</code> for
          consistency with workflow-level secret references.
        </Note>
      </Section>

      <Section title="Referencing secrets in MCP servers">
        <p>
          MCP servers reference secrets in their <code>secrets</code> map. The key is the
          env var name, the value is the secret name in <code>hub.yaml secrets:</code>.
        </p>
        <CodeBlock lang="yaml">{`mcp_servers:
  - name: github
    source: npx
    package: "@modelcontextprotocol/server-github"
    secrets:
      GITHUB_TOKEN: github_token   # injects secrets.github_token as GITHUB_TOKEN`}</CodeBlock>
      </Section>

      <Section title="API endpoints">
        <div className="space-y-2 text-sm text-zinc-400">
          <p><code className="text-cyan-300">GET /api/secrets</code> — List secret names only (never values)</p>
          <p><code className="text-cyan-300">PUT /api/secrets</code> — Upsert a secret <code>{'{"name":"...","value":"..."}'}</code></p>
          <p><code className="text-cyan-300">DELETE /api/secrets?name=&lt;name&gt;</code> — Delete a secret</p>
        </div>
      </Section>
    </DocsPage>
  );
}
