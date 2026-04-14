import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Web UI" };

export default function WebUIPage() {
  return (
    <DocsPage
      title="Web UI"
      description="elasticclaw-web is an optional real-time dashboard for managing agents, streaming conversations, and accessing terminals."
    >
      <Section title="Overview">
        <p>
          The web UI provides a browser-based interface for everything you can
          do with the CLI — plus real-time streaming of agent output, an
          in-browser SSH terminal, and a conversation history view.
        </p>
        <p>Features:</p>
        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
          <li>List and manage all running agents</li>
          <li>Stream agent conversations in real time (WebSocket)</li>
          <li>In-browser SSH terminal via xterm.js</li>
          <li>View agent logs and status</li>
          <li>Create and destroy agents via the UI</li>
        </ul>
      </Section>

      <Section title="Installation">
        <CodeBlock lang="bash">{`brew install elasticclaw/elasticclaw/elasticclaw-web

# or via npm
npm install -g @elasticclaw/web`}</CodeBlock>
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
elasticclaw-web start

# Or point to a specific hub config
elasticclaw-web start --hub /path/to/hub.yaml

# With the main CLI (if web is enabled in hub.yaml)
elasticclaw serve`}</CodeBlock>
        <p>
          Open <code className="text-cyan-300">http://localhost:8080</code> and
          authenticate with your token.
        </p>
      </Section>

      <Note>
        Do not expose the web UI publicly without TLS and a strong auth token.
        The terminal access is equivalent to SSH into your agent VMs.
      </Note>
    </DocsPage>
  );
}
