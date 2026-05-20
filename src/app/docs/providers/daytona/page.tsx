import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";
import { YouTubeVideo } from "@/components/youtube-video";

export const metadata: Metadata = { title: "Daytona Provider" };

export default function DaytonaProviderPage() {
  return (
    <DocsPage
      title="Daytona Provider"
      description="Configure Daytona cloud development environments as ElasticClaw sandboxes."
    >
      <Section title="Overview">
        <p>
          Daytona provides cloud development environments with snapshot support.
          Use it when you want fast startup from prebuilt environments and a
          managed sandbox backend.
        </p>
        <div className="space-y-2 text-sm text-zinc-400 mt-4">
          <p><strong>Type:</strong> Ephemeral sandbox</p>
          <p><strong>Auth:</strong> Daytona API key</p>
          <p><strong>Capabilities:</strong> <code className="text-cyan-300">exec</code>, <code className="text-cyan-300">snapshot</code></p>
          <p><strong>Best for:</strong> Fast factory-created claws and repeatable development environments</p>
        </div>
      </Section>

      <Section title="Configure Daytona">
        <YouTubeVideo
          title="Configure Daytona as an ElasticClaw sandbox provider"
          videoId="RAgallzy4so"
        />
      </Section>

      <Section title="Configure hub.yaml">
        <CodeBlock lang="yaml">{`providers:
  daytona:
    api_url: https://app.daytona.io
    api_key: \${DAYTONA_API_KEY}
    default_snapshot: daytona-large`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          Store <code>DAYTONA_API_KEY</code> in the hub environment or your
          deployment secret manager.
        </p>
      </Section>

      <Section title="Use in templates">
        <p>Set Daytona as the provider for a template:</p>
        <CodeBlock lang="yaml">{`# elasticclaw-config.yaml
provider: daytona
snapshot: daytona-medium
ttl: 4h`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          <code>snapshot</code> overrides <code>providers.daytona.default_snapshot</code>
          for claws created from that template.
        </p>
      </Section>

      <Section title="Behavior">
        <div className="space-y-3 text-sm text-zinc-400">
          <p><strong>Create</strong> — Starts a Daytona sandbox from the configured snapshot.</p>
          <p><strong>Exec</strong> — Runs bootstrap and agent commands through the Daytona execution API.</p>
          <p><strong>Destroy</strong> — Deletes the sandbox when the claw terminates.</p>
        </div>
      </Section>

      <Note>
        Build your snapshots with the base dependencies your agents need. That
        keeps factory-created claws fast and reduces per-task bootstrap work.
      </Note>
    </DocsPage>
  );
}
