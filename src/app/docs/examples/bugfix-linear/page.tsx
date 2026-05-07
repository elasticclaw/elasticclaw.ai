import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Example: Bug fixes (Linear)" };

export default function BugfixLinearExamplePage() {
  return (
    <DocsPage
      title="Bug fixes from a single Linear board"
      description="A factory that watches one Linear team, filters by label, and auto-spawns claws for bug triage."
    >
      <Note>
        This example shows a complete, working factory configuration. Adapt the
        team key, labels, and template name to your setup.
      </Note>

      <Section title="What it does">
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li>Watches the <code>ENG</code> team on Linear</li>
          <li>Only acts on issues with the <code>bug</code> label</li>
          <li>Triggers when an issue enters <code>Triage</code> status</li>
          <li>Spawns a claw using a dedicated <code>bugfix-template</code></li>
          <li>Moves the issue to <code>In Review</code> when the claw sends <code>[DONE]</code></li>
          <li>Kills the claw immediately if the issue leaves <code>Triage</code></li>
        </ul>
      </Section>

      <Section title="hub.yaml">
        <CodeBlock lang="yaml">{`integrations:
  linear:
    - workspace: acme
      token: \${LINEAR_API_TOKEN}
      # Shared default for all Linear webhooks.
      # Per-factory overrides use webhook_secret_ref.
      webhook_secret: \${LINEAR_WEBHOOK_SECRET}

factories:
  - name: eng-bugfix
    integration: linear
    workspace: acme
    team: ENG
    trigger_status: "Triage"
    done_status: "In Review"
    terminate_on_leave: true
    template: bugfix-template
    labels: [bug]
    webhook_secret_ref: linear_webhook_secret
    tags: [bugfix]
    color: red

secrets:
  linear_webhook_secret: whsec_xxx`}</CodeBlock>
      </Section>

      <Section title="Template: bugfix-template">
        <p className="text-sm text-zinc-400 mb-2">
          A dedicated template with extra logging, test tooling, and a
          conservative model for debugging work.
        </p>
        <CodeBlock lang="yaml">{`# elasticclaw-config.yaml
provider: daytona
instance_type: r1.small
llm_key: anthropic-prod

default_model: anthropic/claude-sonnet-4-6

bootstrap:
  steps:
    - name: Install deps
      run: |
        apt-get update -q
        apt-get install -y git curl build-essential
    - name: Clone repo
      run: git clone \${REPO_URL} /workspace
    - name: Run tests
      run: cd /workspace && npm test

files:
  AGENTS.md: |
    You are a bug-fix agent. Read the issue carefully, reproduce the bug,
    write a minimal fix, and open a PR. Send [DONE] &lt;pr-url&gt; when ready.`}</CodeBlock>
      </Section>

      <Section title="Linear webhook setup">
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400">
          <li>Go to <strong>Linear → Settings → API → Webhooks</strong></li>
          <li>Payload URL: <code>https://hub.example.com/api/integrations/linear/webhook</code></li>
          <li>Events: <strong>Issues</strong></li>
          <li>Copy the signing secret into <code>secrets.linear_webhook_secret</code></li>
        </ol>
      </Section>
    </DocsPage>
  );
}
