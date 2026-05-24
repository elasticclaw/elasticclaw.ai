import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Secrets" };

export default function SecretsPage() {
  return (
    <DocsPage
      title="Secrets"
      description="Manage workspace-scoped secrets without committing sensitive values to version control."
    >
      <Section title="Overview">
        <p>
          ElasticClaw stores secrets on ElasticClaw Server per workspace. Create them with
          the CLI, then reference them by name from <code>elasticclaw-config.yaml</code>
          or workflow YAML when an agent needs an environment variable.
        </p>
        <Note>
          Never commit real secret values to version control. Commit only the
          secret names referenced by your workspace and workflow YAML.
        </Note>
      </Section>

      <Section title="Create secrets">
        <CodeBlock lang="bash">{`elasticclaw secret create openai_api_key --workspace my-app --value "$OPENAI_API_KEY"
printf '%s' "$SLACK_BOT_TOKEN" | elasticclaw secret create slack_bot_token --workspace my-app
elasticclaw secret list --workspace my-app
elasticclaw secret rm slack_bot_token --workspace my-app`}</CodeBlock>
        <p>
          Secret values are sent to ElasticClaw Server. <code>secret list</code> returns names
          only, never values.
        </p>
      </Section>

      <Section title="Use secrets in workspaces">
        <p>
          Use <code className="text-cyan-300">env</code> in{" "}
          <code>elasticclaw-config.yaml</code> to inject a workspace secret into
          every agent created from that workspace:
        </p>
        <CodeBlock lang="yaml">{`# elasticclaw-config.yaml
env:
  NODE_ENV: production
  OPENAI_API_KEY:
    secret: openai_api_key
  MY_CUSTOM_KEY:
    secret: my_custom_key`}</CodeBlock>
      </Section>

      <Section title="Use secrets in workflows">
        <p>
          Use <code className="text-cyan-300">secret_refs</code> in workflow YAML
          for secrets needed only by that workflow:
        </p>
        <CodeBlock lang="yaml">{`# workflow.yaml
name: deploy-preview

secret_refs:
  SLACK_TOKEN: slack_bot_token
  DEPLOY_TOKEN: deploy_token`}</CodeBlock>
        <Note>
          Configure Linear, Shortcut, and GitHub Issues tokens and webhook
          signing secrets in workspace issue tracker settings, not in workflow
          YAML.
        </Note>
      </Section>

      <Section title="Referencing secrets in MCP servers">
        <p>
          MCP servers reference secrets configured with the MCP server in
          settings. The key is the environment variable name and the value is
          the secret name.
        </p>
        <CodeBlock lang="yaml">{`mcp_servers:
  - name: github
    source: npx
    package: "@modelcontextprotocol/server-github"
    secrets:
      GITHUB_TOKEN: github_token`}</CodeBlock>
      </Section>

      <Section title="API endpoints">
        <div className="space-y-2 text-sm text-zinc-400">
          <p><code className="text-cyan-300">GET /api/workspaces/&lt;workspace&gt;/secrets</code> — List secret names only</p>
          <p><code className="text-cyan-300">PUT /api/workspaces/&lt;workspace&gt;/secrets</code> — Create or update a secret</p>
          <p><code className="text-cyan-300">DELETE /api/workspaces/&lt;workspace&gt;/secrets?name=&lt;name&gt;</code> — Delete a secret</p>
        </div>
      </Section>
    </DocsPage>
  );
}
