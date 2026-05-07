import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Example: Feature work (GitHub)" };

export default function FeatureGitHubExamplePage() {
  return (
    <DocsPage
      title="Human-tagged feature work in GitHub Issues"
      description="A factory where a single labeler triggers claw creation for feature requests, excluding themselves from assignment."
    >
      <Note>
        This pattern is useful when a PM or tech lead triages incoming
        requests and decides which ones are ready for an agent to pick up.
      </Note>

      <Section title="What it does">
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li>Watches the <code>acme/app</code> repository</li>
          <li>Triggers when an issue is labeled <code>claw-ready</code> <em>and</em> <code>feature</code></li>
          <li>Excludes the PM (<code>@pm-alice</code>) from assignment — they labeled it, they don&apos;t implement it</li>
          <li>Uses a <code>feature-template</code> with broader context and planning instructions</li>
          <li>Moves the issue to <code>in-review</code> when done</li>
          <li>Does <strong>not</strong> terminate on leave — the claw stays alive to handle review feedback</li>
        </ul>
      </Section>

      <Section title="hub.yaml">
        <CodeBlock lang="yaml">{`integrations:
  github_issues:
    - workspace: acme/app
      token: \${GITHUB_TOKEN}
      webhook_secret: \${GITHUB_WEBHOOK_SECRET}

factories:
  - name: feature-bot
    integration: github-issues
    workspace: acme/app
    trigger_status: "open"
    labels: [claw-ready, feature]
    assigned_to: "!@pm-alice"   # exclude the PM who labels
    done_status: "in-review"
    terminate_on_leave: false
    template: feature-template
    webhook_secret_ref: github_webhook_secret
    name_pattern: "feat-{issue_number}"
    tags: [feature]

secrets:
  github_webhook_secret: whsec_xxx`}</CodeBlock>
      </Section>

      <Section title="The labeling workflow">
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400">
          <li>User opens a feature request issue in <code>acme/app</code></li>
          <li>PM reviews it, adds labels <code>claw-ready</code> + <code>feature</code></li>
          <li>Factory webhook fires — labels match, issue is open → claw spawned</li>
          <li>Claw implements the feature, opens a PR, sends <code>[DONE]</code></li>
          <li>Issue moved to <code>in-review</code>, claw watches for CI/review comments</li>
          <li>PM removes <code>claw-ready</code> label → claw stays alive (terminate_on_leave: false)</li>
          <li>PR merges → claw terminates automatically</li>
        </ol>
      </Section>

      <Section title="Template: feature-template">
        <p className="text-sm text-zinc-400 mb-2">
          A template with planning instructions and broader context for
          feature work.
        </p>
        <CodeBlock lang="yaml">{`# elasticclaw-config.yaml
provider: daytona
instance_type: r1.medium
llm_key: fireworks-kimi

default_model: fireworks/accounts/fireworks/models/kimi-k2p6

bootstrap:
  steps:
    - name: Setup
      run: |
        git clone \${REPO_URL} /workspace
        cd /workspace && npm install

files:
  AGENTS.md: |
    You are a feature implementation agent. Read the issue, propose a plan
    in a comment, get alignment, then implement. Open a PR and send
    [DONE] &lt;pr-url&gt; when ready.`}</CodeBlock>
      </Section>

      <Section title="GitHub webhook setup">
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400">
          <li>Go to <strong>repo → Settings → Webhooks → Add webhook</strong></li>
          <li>Payload URL: <code>https://hub.example.com/api/integrations/github-issues/webhook</code></li>
          <li>Content type: <code>application/json</code></li>
          <li>Secret: your <code>github_webhook_secret</code> value</li>
          <li>Events: <strong>Issues</strong></li>
        </ol>
      </Section>
    </DocsPage>
  );
}
