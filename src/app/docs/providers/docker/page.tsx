import type { Metadata } from "next";
import { DocsPage, CodeBlock, Note, Section } from "@/components/docs-page";

export const metadata: Metadata = { title: "Local Docker Provider" };

export default function DockerProviderPage() {
  return (
    <DocsPage
      title="Local Docker Provider"
      description="Run ElasticClaw agent sandboxes as local Docker containers managed by the hub."
    >
      <Section title="Overview">
        <p>
          The Local Docker provider starts each agent as a container through the
          Docker CLI on the hub host. It is useful for local development,
          self-hosted lab environments, and low-friction testing when you do not
          need a cloud sandbox provider.
        </p>
        <div className="space-y-2 text-sm text-zinc-400 mt-4">
          <p><strong>Type:</strong> Stateful local container</p>
          <p><strong>Auth:</strong> Local Docker daemon access</p>
          <p><strong>Capabilities:</strong> <code className="text-cyan-300">exec</code></p>
          <p><strong>Best for:</strong> Development, CI-like test hubs, and private hosts with Docker already installed</p>
        </div>
      </Section>

      <Section title="Prerequisites">
        <ul className="list-disc list-inside space-y-2 text-sm text-zinc-400">
          <li>Docker Engine installed on the machine running ElasticClaw Server.</li>
          <li>The <code>docker</code> CLI available in the server process <code>PATH</code>.</li>
          <li>The server user can create, inspect, exec into, and remove containers.</li>
          <li>
            If ElasticClaw Server itself runs in a container, mount the host
            Docker socket at <code>/var/run/docker.sock</code>.
          </li>
        </ul>
      </Section>

      <Section title="Configure hub.yaml">
        <p>
          Add the provider under <code>providers</code>. The <code>image</code>{" "}
          field is optional; when omitted, ElasticClaw uses the pinned OpenClaw
          image for the current release.
        </p>
        <CodeBlock lang="yaml">{`providers:
  docker:
    image: ghcr.io/openclaw/openclaw:2026.6.9
    network: elasticclaw-dev`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          Leave <code>image</code> blank to use the provider default. Set{" "}
          <code>network</code> when agent containers need to reach the hub by a
          Docker service name instead of a public URL.
        </p>
      </Section>

      <Section title="Configure in the web UI">
        <p>
          You can also add the provider from{" "}
          <strong>Settings → Runtimes → Add Provider → Local Docker</strong>.
          The UI exposes the same optional agent image and Docker network
          fields.
        </p>
      </Section>

      <Section title="Use in workspaces">
        <p>Set Docker as the provider for a workspace:</p>
        <CodeBlock lang="yaml">{`# elasticclaw-config.yaml
provider: docker`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          Workflow-created agents from that workspace will start as local
          containers on the hub host.
        </p>
      </Section>

      <Section title="Networking">
        <p>
          Agent containers need to connect back to ElasticClaw Server. For a
          public or LAN-reachable server, set <code>public_url</code> in{" "}
          <code>hub.yaml</code>. For a fully local Docker Compose setup, attach
          the agent containers to the same Docker network as the hub and set the
          provider <code>network</code> field.
        </p>
        <CodeBlock lang="yaml">{`url: http://localhost:8080
public_url: http://elasticclaw:8080

providers:
  docker:
    network: elasticclaw-dev`}</CodeBlock>
      </Section>

      <Section title="Behavior">
        <div className="space-y-3 text-sm text-zinc-400">
          <p><strong>Create</strong> — Runs <code>docker run -d</code> with the claw name as the container name.</p>
          <p><strong>Exec</strong> — Runs commands with <code>docker exec</code>.</p>
          <p><strong>Copy files</strong> — Copies workspace files into the container with <code>docker cp</code>.</p>
          <p><strong>Destroy</strong> — Removes the container when the claw terminates.</p>
        </div>
      </Section>

      <Note>
        Mounting the Docker socket gives ElasticClaw Server control over the
        host Docker daemon. Use this provider on trusted hosts and reserve cloud
        sandbox providers for stronger isolation boundaries.
      </Note>
    </DocsPage>
  );
}
