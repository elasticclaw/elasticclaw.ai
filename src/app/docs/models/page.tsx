import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Models & LLM Keys" };

const SUPPORTED_PROVIDERS = [
  {
    id: "anthropic",
    credential: "API key",
    config: "api_key: ${ANTHROPIC_API_KEY}",
    models: "anthropic/claude-sonnet-4-6, anthropic/claude-opus-4-5",
  },
  {
    id: "codex",
    credential: "Subscription login",
    config: "auth_profile: codex-default",
    models: "codex/gpt-5.5, codex/gpt-5.5-high",
  },
  {
    id: "grok",
    credential: "Subscription login",
    config: "auth_profile: grok-default",
    models: "grok/grok-build-0.1, grok/grok-4.3",
  },
  {
    id: "fireworks",
    credential: "API key",
    config: "api_key: ${FIREWORKS_API_KEY}",
    models: "fireworks/accounts/fireworks/models/kimi-k2p6, fireworks/accounts/fireworks/models/llama-v3p3-70b-instruct",
  },
];

export default function ModelsPage() {
  return (
    <DocsPage
      title="Models & LLM Keys"
      description="Configure multiple LLM providers and API keys. Set per-workspace or per-agent model overrides."
    >
      <Section title="Supported providers">
        <p>
          ElasticClaw supports API-key providers and subscription-backed coding
          providers in the server UI and bootstrap path. Use these provider IDs
          in <code>llm_keys[].provider</code> and as the prefix in{" "}
          <code>default_model</code>.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 pr-6 text-zinc-400 font-medium">Provider</th>
                <th className="text-left py-2 pr-6 text-zinc-400 font-medium">Credential</th>
                <th className="text-left py-2 pr-6 text-zinc-400 font-medium">Config field</th>
                <th className="text-left py-2 text-zinc-400 font-medium">Example models</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {SUPPORTED_PROVIDERS.map((provider) => (
                <tr key={provider.id} className="border-b border-zinc-900">
                  <td className="py-2 pr-6">
                    <code className="text-cyan-300">{provider.id}</code>
                  </td>
                  <td className="py-2 pr-6 text-zinc-400">{provider.credential}</td>
                  <td className="py-2 pr-6">
                    <code>{provider.config}</code>
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
          <code>hub.yaml</code>. Each key has a provider plus either an API key or an
          auth profile, and an optional default model. One key can be marked{" "}
          <code>default: true</code>. Configure more than one key when different
          workspaces should use different providers or accounts.
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

  - name: codex-chatgpt
    provider: codex
    auth_profile: codex-default
    default_model: codex/gpt-5.5

  - name: grok-build
    provider: grok
    auth_profile: grok-default
    default_model: grok/grok-build-0.1`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          The <code>default_model</code> field uses the <code>provider/model</code> format
          (e.g. <code>anthropic/claude-sonnet-4-6</code>).
        </p>
      </Section>

      <Section title="Fireworks model catalog">
        <p>
          Fireworks model choices in the hub are loaded from the Fireworks List
          Models API when a Fireworks key is configured. The examples on this
          page are representative only; the dropdown should show the currently
          available Fireworks models returned by your account.
        </p>
        <p className="text-sm text-zinc-400 mt-2">
          If a model is not listed yet, choose the custom model option and enter
          the full Fireworks model ID, such as{" "}
          <code>fireworks/accounts/fireworks/models/...</code>.
        </p>
      </Section>

      <Section title="Codex and Grok subscription logins">
        <p>
          Codex and Grok Build are not configured with API tokens. They use the
          same subscription-backed account login that their coding CLIs use. Your
          provider subscription controls access, model availability, and usage
          limits; ElasticClaw only stores the resulting device-login auth profile.
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400 mt-3">
          <li>Open <strong>Settings → Models</strong> in the ElasticClaw hub.</li>
          <li>Add a model key and select <strong>Codex</strong> or <strong>Grok Build</strong>.</li>
          <li>Enter a stable CLI auth profile name, such as <code>codex-default</code> or <code>grok-default</code>.</li>
          <li>Click <strong>Login</strong>, open the device-login URL, and enter the one-time code shown in the hub.</li>
          <li>After the profile is saved, choose the default model and save the model key.</li>
        </ol>
        <Note>
          Treat subscription auth profiles like secrets. They allow claws using
          that model key to run under the signed-in subscription account.
        </Note>
      </Section>

      <Section title="How device login works">
        <p>
          The hub starts a provider device-login flow and shows the URL plus a
          one-time code. After you approve the login in the provider&apos;s browser
          flow, the hub stores an opaque <code>model_auth_profiles</code> entry and
          links it from the named <code>llm_keys</code> entry with{" "}
          <code>auth_profile</code>.
        </p>
        <CodeBlock lang="yaml">{`llm_keys:
  - name: codex-chatgpt
    provider: codex
    auth_profile: codex-default
    default_model: codex/gpt-5.5

model_auth_profiles:
  - name: codex-default
    provider: codex
    mode: device
    auth_state: <managed by the hub login flow>`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          You normally should not hand-edit <code>auth_state</code>. During claw
          bootstrap, ElasticClaw restores the saved profile into the sandbox in
          the format expected by the selected provider CLI.
        </p>
      </Section>

      <Section title="Server default model">
        <p>
          Set a global default model at the server level. All agents use this unless overridden.
        </p>
        <CodeBlock lang="yaml">{`default_model: anthropic/claude-sonnet-4-6`}</CodeBlock>
      </Section>

      <Section title="Per-workspace model override">
        <p>
          Workspaces can override the default model and specify which LLM key to use:
        </p>
        <CodeBlock lang="yaml">{`# elasticclaw-config.yaml
default_model: fireworks/accounts/fireworks/models/kimi-k2p6
llm_key: fireworks-kimi`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          If <code>llm_key</code> is set and <code>default_model</code> is empty, ElasticClaw Server
          resolves the model from the named key&apos;s <code>default_model</code>. If no
          <code>llm_key</code> is set, ElasticClaw Server uses the key marked{" "}
          <code>default: true</code>, then the server-level <code>default_model</code>.
        </p>
      </Section>

    </DocsPage>
  );
}
