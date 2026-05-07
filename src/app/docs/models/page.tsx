import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Models & LLM Keys" };

export default function ModelsPage() {
  return (
    <DocsPage
      title="Models & LLM Keys"
      description="Configure multiple LLM providers and API keys. Set per-template or per-claw model overrides."
    >
      <Section title="Named LLM keys">
        <p>
          Instead of a single API key, ElasticClaw uses <em>named</em> LLM keys in
          <code>hub.yaml</code>. Each key has a provider, API key, and optional default model.
          One key can be marked <code>default: true</code>.
        </p>
        <CodeBlock lang="yaml">{`llm_keys:
  - name: anthropic-prod
    provider: anthropic
    api_key: \${ANTHROPIC_API_KEY}
    default: true
    default_model: anthropic/claude-sonnet-4-6

  - name: fireworks-kimi
    provider: fireworks
    api_key: \${FIREWORKS_API_KEY}
    default_model: fireworks/accounts/fireworks/models/kimi-k2p6`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          The <code>default_model</code> field uses the <code>provider/model</code> format
          (e.g. <code>anthropic/claude-opus-4-5</code>).
        </p>
      </Section>

      <Section title="Legacy format">
        <p>
          The old flat-map format is still accepted for backwards compatibility:
        </p>
        <CodeBlock lang="yaml">{`llm_keys:
  anthropic: sk-ant-...
  fireworks: fw-...`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          This auto-converts to named keys with <code>default: true</code> on the first entry.
        </p>
      </Section>

      <Section title="Hub default model">
        <p>
          Set a global default model at the hub level. All claws use this unless overridden.
        </p>
        <CodeBlock lang="yaml">{`default_model: anthropic/claude-sonnet-4-6`}</CodeBlock>
      </Section>

      <Section title="Per-template model override">
        <p>
          Templates can override the default model and specify which LLM key to use:
        </p>
        <CodeBlock lang="yaml">{`# elasticclaw-config.yaml
default_model: fireworks/accounts/fireworks/models/kimi-k2p6
llm_key: fireworks-kimi`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          If <code>llm_key</code> is set and <code>default_model</code> is empty, the hub
          resolves the model from the key's <code>default_model</code> field.
        </p>
      </Section>

      <Section title="Provider env vars">
        <p className="text-sm text-zinc-400">
          Each provider's API key is injected as an environment variable into the claw:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li><code>anthropic</code> → <code>ANTHROPIC_API_KEY</code></li>
          <li><code>fireworks</code> → <code>FIREWORKS_API_KEY</code></li>
        </ul>
      </Section>
    </DocsPage>
  );
}
