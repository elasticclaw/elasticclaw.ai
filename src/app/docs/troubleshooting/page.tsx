import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Troubleshooting" };

export default function TroubleshootingPage() {
  return (
    <DocsPage
      title="Troubleshooting"
      description="Common issues and how to fix them."
    >
      <Section title="Template uses deprecated secrets: list">
        <p>
          If you see this warning in the Doctor dashboard or logs:
        </p>
        <CodeBlock lang="text">{`Template "my-template" uses deprecated secrets: list`}</CodeBlock>
        <p>
          Your template&apos;s <code>elasticclaw-config.yaml</code> uses the old{" "}
          <code className="text-cyan-300">secrets:</code> list format. Migrate to{" "}
          <code className="text-cyan-300">secret_refs:</code> for consistency with
          factory-level secret references.
        </p>
        <p className="mt-2"><strong>Old format (deprecated):</strong></p>
        <CodeBlock lang="yaml">{`secrets:
  - type: linear
    workspace: my-company
  - type: custom
    name: my_api_key
    as: MY_API_KEY`}</CodeBlock>
        <p className="mt-2"><strong>New format:</strong></p>
        <CodeBlock lang="yaml">{`secret_refs:
  LINEAR_API_KEY: linear_token
  MY_API_KEY: my_api_key`}</CodeBlock>
        <p className="mt-2">
          The <code>secret_refs</code> map is simpler: the key is the environment
          variable name, the value is the secret name from{" "}
          <code>hub.yaml secrets:</code>. No typed objects, no workspace resolution
          magic — just explicit name-to-name mapping.
        </p>
        <Note>
          Before migrating, make sure the referenced secret exists in{" "}
          <code>hub.yaml secrets:</code>. The old <code>type: linear</code> format
          resolved tokens from <code>integrations.linear[].token</code> — the new
          format reads from <code>secrets:</code> instead. If the secret is not
          there, Doctor will report a missing reference immediately after migration.
        </Note>
        <Note>
          The old <code>secrets:</code> list format still works for backward
          compatibility, but you should migrate. The Doctor will continue to warn
          until you update.
        </Note>
      </Section>

      <Section title="Factory secret_refs references missing secret">
        <p>
          If Doctor reports that a factory or template references a missing secret:
        </p>
        <CodeBlock lang="text">{`Factory "my-factory" secret_refs references missing secret
  secret_refs maps "LINEAR_API_KEY" to secret "linear_token" which is not in the secrets map.`}</CodeBlock>
        <p>
          Add the missing secret to <code>hub.yaml</code>:
        </p>
        <CodeBlock lang="yaml">{`secrets:
  linear_token: lin_api_xxxxxxxx`}</CodeBlock>
        <p>
          Or use environment variable substitution:
        </p>
        <CodeBlock lang="yaml">{`secrets:
  linear_token: \${LINEAR_API_TOKEN}`}</CodeBlock>
      </Section>

      <Section title="Webhooks not triggering factories">
        <p>
          If webhooks from Linear, GitHub Issues, or Shortcut are not triggering
          factories, check that the factory has a webhook secret configured:
        </p>
        <CodeBlock lang="yaml">{`# factory.yaml
name: my-factory
integration: linear
webhook_secret_ref: linear_webhook_secret   # references hub.yaml secrets
# NOT webhook_secret: "inline value" (deprecated)`}</CodeBlock>
        <p>
          The <code>webhook_secret_ref</code> should point to a secret name in{" "}
          <code>hub.yaml secrets:</code>. Inline <code>webhook_secret</code> is
          deprecated and will be flagged by Doctor.
        </p>
      </Section>
    </DocsPage>
  );
}
