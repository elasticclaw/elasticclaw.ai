import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Web UI" };

export default function WebUIPage() {
  return (
    <DocsPage
      title="Web UI"
      description="The hub includes an embedded real-time dashboard for managing agents, streaming conversations, and accessing terminals. No separate server needed."
    >
      <Section title="Overview">
        <p>
          The web UI is embedded in the hub binary — no separate installation needed.
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
          <li>Settings page — configure providers, LLM keys, integrations, factories, secrets, MCP servers, auth</li>
        </ul>
      </Section>

      <Section title="Configuration">
        <p>
          Enable the web server in your <code className="text-cyan-300">hub.yaml</code>:
        </p>
        <CodeBlock lang="yaml">{`web:
  enabled: true
  port: 8080
  host: 0.0.0.0          # bind address
  auth_token: \${ELASTICCLAW_WEB_TOKEN}
  tls:
    enabled: false         # set true + provide cert/key for HTTPS
    cert: ./tls/cert.pem
    key: ./tls/key.pem`}</CodeBlock>
        <p>Set the auth token:</p>
        <CodeBlock lang="bash">{`export ELASTICCLAW_WEB_TOKEN=$(openssl rand -hex 32)`}</CodeBlock>
      </Section>

      <Section title="Starting the Server">
        <CodeBlock lang="bash">{`# Start with hub config in current directory
elasticclaw hub

# Or point to a specific hub config
elasticclaw hub --config /path/to/hub.yaml`}</CodeBlock>
        <p>
          Open <code className="text-cyan-300">http://localhost:8080</code> and
          authenticate with your token.
        </p>
      </Section>

      <Section title="Settings page">
        <p>
          The Settings page provides a UI for configuring all hub.yaml fields:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li><strong>Providers</strong> — Daytona, Replicated CMX, exe.dev</li>
          <li><strong>LLM Keys</strong> — Named API keys with default model</li>
          <li><strong>GitHub Apps</strong> — App credentials with live permission checks</li>
          <li><strong>Integrations</strong> — Linear, Shortcut, GitHub Issues</li>
          <li><strong>Factories</strong> — Create, edit, enable/disable factories</li>
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
