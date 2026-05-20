import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section } from "@/components/docs-page";

export const metadata: Metadata = { title: "Models & LLM Keys" };

const SUPPORTED_PROVIDERS = [
  {
    id: "anthropic",
    env: "ANTHROPIC_API_KEY",
    models: "anthropic/claude-sonnet-4-6, anthropic/claude-opus-4-5",
  },
  {
    id: "codex",
    env: "CODEX_API_KEY",
    models: "codex/o4-mini",
  },
  {
    id: "fireworks",
    env: "FIREWORKS_API_KEY",
    models: "fireworks/accounts/fireworks/models/kimi-k2p6, fireworks/accounts/fireworks/models/llama-v3p3-70b-instruct",
  },
];

export default function ModelsPage() {
  return (
    <DocsPage
      title="Models & LLM Keys"
      description="Configure multiple LLM providers and API keys. Set per-template or per-claw model overrides."
    >
      <Section title="Supported providers">
        <p>
          ElasticClaw currently supports these LLM providers in the hub UI and
          bootstrap path. Use these provider IDs in <code>llm_keys[].provider</code>
          {" "}and as the prefix in <code>default_model</code>.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 pr-6 text-zinc-400 font-medium">Provider</th>
                <th className="text-left py-2 pr-6 text-zinc-400 font-medium">API key env var</th>
                <th className="text-left py-2 text-zinc-400 font-medium">Example models</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {SUPPORTED_PROVIDERS.map((provider) => (
                <tr key={provider.id} className="border-b border-zinc-900">
                  <td className="py-2 pr-6">
                    <code className="text-cyan-300">{provider.id}</code>
                  </td>
                  <td className="py-2 pr-6">
                    <code>{provider.env}</code>
                  </td>
                  <td className="py-2 text-zinc-400">{provider.models}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Named LLM keys">
        <p>
          Instead of a single API key, ElasticClaw uses <em>named</em> LLM keys in
          <code>hub.yaml</code>. Each key has a provider, API key, and optional default model.
          One key can be marked <code>default: true</code>. Configure more than one
          key when different templates should use different providers or accounts.
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
    default_model: fireworks/accounts/fireworks/models/kimi-k2p6

  - name: codex-main
    provider: codex
    api_key: \${CODEX_API_KEY}
    default_model: codex/o4-mini`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          The <code>default_model</code> field uses the <code>provider/model</code> format
          (e.g. <code>anthropic/claude-sonnet-4-6</code>).
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
          resolves the model from the named key&apos;s <code>default_model</code>. If no
          <code>llm_key</code> is set, the hub uses the key marked{" "}
          <code>default: true</code>, then the hub-level <code>default_model</code>.
        </p>
      </Section>

    </DocsPage>
  );
}
