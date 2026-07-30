import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Web UI" };

export default function WebUIPage() {
  return (
    <DocsPage
      title="Web UI"
      description="ElasticClaw Server includes an embedded real-time dashboard for managing agents, streaming conversations, and accessing terminals. No separate web service needed."
    >
      <Section title="Overview">
        <p>
          The web UI is embedded in ElasticClaw Server. No separate installation is needed.
          It provides a browser-based interface for everything you can do with the CLI,
          plus real-time streaming of agent output, an in-browser SSH terminal, and
          conversation history.
        </p>
        <p>Features:</p>
        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
          <li>List and manage all running agents</li>
          <li>Stream agent conversations in real time (WebSocket)</li>
          <li>In-browser SSH terminal via xterm.js</li>
          <li>View agent logs and status</li>
          <li>Create and destroy agents via the UI</li>
          <li>Workflow run history and agent activity logs</li>
          <li>Analytics command center — triggers, outcomes, cost, and usage</li>
          <li>Settings page — configure providers, LLM keys, integrations, workflows, secrets, MCP servers, auth</li>
        </ul>
      </Section>

      <Section title="Configuration">
        <p>
          The web UI is served by ElasticClaw Server on the same address as the API. For a
          local or manually managed server, configure the UI password in
          <code className="text-cyan-300">hub.yaml</code> and pass the listen
          address with the server command:
        </p>
        <CodeBlock lang="yaml">{`token: mytoken
claw_token: myclawtoken
ui_password: mypassword`}</CodeBlock>
        <CodeBlock lang="bash">{`elasticclaw hub --addr :8080`}</CodeBlock>
        <p>
          <code className="text-cyan-300">elasticclaw install</code> writes this
          config for you and generates a random UI password unless you pass{" "}
          <code className="text-cyan-300">--ui-password</code>. TLS is normally
          handled by Caddy in front of ElasticClaw Server, not by nested web UI settings.
        </p>
      </Section>

      <Section title="Starting the Server">
        <CodeBlock lang="bash">{`# Start with the default server config search path
elasticclaw hub

# Or point to a specific server config
ELASTICCLAW_HUB_CONFIG=/path/to/hub.yaml elasticclaw hub`}</CodeBlock>
        <p>
          Open <code className="text-cyan-300">http://localhost:8080</code> and
          authenticate with your UI password.
        </p>
      </Section>

      <Section title="Settings page">
        <p>
          The Settings page provides a UI for server settings and workspace-managed
          resources:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li><strong>Providers</strong> — Daytona, Replicated CMX, AWS Lambda MicroVMs, exe.dev</li>
          <li><strong>LLM Keys</strong> — Named API keys and subscription logins with default models</li>
          <li><strong>GitHub Apps</strong> — App credentials with live permission checks</li>
          <li><strong>Issue Trackers</strong> — Linear, Jira, Shortcut, GitHub Issues</li>
          <li><strong>Workflows</strong> — Create, edit, enable/disable workflows</li>
          <li><strong>Secrets</strong> — Manage secret values (names only in UI, values hidden)</li>
          <li><strong>MCP Servers</strong> — Configure npx/uvx/docker/sse tool servers</li>
          <li><strong>Authentication</strong> — GitHub OAuth, tag-based ACLs</li>
        </ul>
      </Section>

      <Note>
        Do not expose the web UI publicly without TLS and a strong auth token.
        The terminal access is equivalent to SSH into your agent sandboxes.
      </Note>
    </DocsPage>
  );
}
