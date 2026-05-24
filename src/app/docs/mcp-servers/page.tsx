import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "MCP Servers" };

export default function MCPServersPage() {
  return (
    <DocsPage
      title="MCP Servers"
      description="Configure Model Context Protocol (MCP) servers that your agents can use as tools."
    >
      <Section title="What are MCP servers?">
        <p>
          MCP (Model Context Protocol) servers are external tool servers that expose
          capabilities to your agents via a standardized protocol. ElasticClaw can
          start MCP servers as subprocesses inside each agent sandbox and register their
          tools with the agent's gateway.
        </p>
        <p>Supported sources:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li><code className="text-cyan-300">npx</code> — NPM packages (e.g. <code>@modelcontextprotocol/server-github</code>)</li>
          <li><code className="text-cyan-300">uvx</code> — Python packages via uv</li>
          <li><code className="text-cyan-300">smithery</code> — Smithery registry packages</li>
          <li><code className="text-cyan-300">docker</code> — Docker images</li>
          <li><code className="text-cyan-300">sse</code> — Server-Sent Events endpoints (remote)</li>
        </ul>
      </Section>

      <Section title="Configure an MCP server">
        <p>
          Configure MCP server definitions in the server settings UI under{" "}
          <strong>Settings → MCP Servers</strong>. Workspaces opt into the
          servers they need from <code>elasticclaw-config.yaml</code>.
        </p>
        <CodeBlock lang="yaml">{`mcp_servers:
  - name: github
    source: npx
    package: "@modelcontextprotocol/server-github"
    enabled: true
    config:
      repository: "elasticclaw/elasticclaw"
    secrets:
      GITHUB_TOKEN: github_mcp_token

  - name: postgres
    source: docker
    image: mcp/postgres
    enabled: true
    config:
      database_url: "postgresql://localhost/mydb"

  - name: remote-tools
    source: sse
    url: https://tools.example.com/sse
    enabled: true`}</CodeBlock>
      </Section>

      <Section title="Secrets resolution">
        <p>
          The <code className="text-cyan-300">secrets</code> map under each MCP server
          maps environment variable names to secret names configured for that
          MCP server in settings.
        </p>
        <CodeBlock lang="yaml">{`mcp_servers:
  - name: github
    secrets:
      GITHUB_TOKEN: github_mcp_token`}</CodeBlock>
      </Section>

      <Section title="Enabling in workspaces">
        <p>
          Add <code className="text-cyan-300">mcps</code> to your workspace's
          <code>elasticclaw-config.yaml</code> to enable specific MCP servers for agents
          created from that workspace:
        </p>
        <CodeBlock lang="yaml">{`# elasticclaw-config.yaml
mcps:
  - name: github
    config:
      repository: "my-org/my-repo"   # workspace-level override`}</CodeBlock>
        <p>
          Each agent will start the configured MCP servers as subprocesses and register
          their tools with the OpenClaw gateway.
        </p>
      </Section>

      <Section title="API endpoints">
        <div className="space-y-2 text-sm text-zinc-400">
          <p><code className="text-cyan-300">GET /api/mcp</code> — List MCP servers (redacted, no secret values)</p>
          <p><code className="text-cyan-300">PUT /api/mcp</code> — Upsert an MCP server</p>
          <p><code className="text-cyan-300">DELETE /api/mcp?name=&lt;name&gt;</code> — Remove an MCP server</p>
        </div>
      </Section>
    </DocsPage>
  );
}
