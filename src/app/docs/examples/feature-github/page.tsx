import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Example: Feature work (GitHub)" };

export default function FeatureGitHubExamplePage() {
  return (
    <DocsPage
      title="Human-tagged feature work in GitHub Issues"
      description="A workflow where a single labeler triggers claw creation for feature requests, excluding themselves from assignment."
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
          <li>Uses a <code>feature-workspace</code> with broader context and planning instructions</li>
          <li>Moves the issue to <code>in-review</code> when done</li>
          <li>Does <strong>not</strong> terminate on leave — the claw stays alive to handle review feedback</li>
        </ul>
      </Section>

      <Section title="Issue tracker">
        <CodeBlock lang="text">{`Settings -> Workspaces -> feature-workspace -> Issue Trackers
Add GitHub Issues:
  token: \${GITHUB_TOKEN}
  webhook secret: \${GITHUB_WEBHOOK_SECRET}`}</CodeBlock>
      </Section>

      <Section title="Workflow: feature-bot">
        <CodeBlock lang="yaml">{`# .elasticclaw/workflows/feature-bot.yaml
schema_version: v1
name: feature-bot
trigger:
  type: github_issues
  event: issue_labeled
  repositories:
    - acme/app
  states:
    - open
  labels:
    - claw-ready
    - feature
name_pattern: "feat-{issue_number}"
tags: [feature]

jobs:
  - id: working
    label: Working
    entry: true
    on_enter:
      inject: |
        Read CONTEXT.md, plan the feature, implement it, and open a PR.

  - id: pr_opened
    label: PR Opened
    triggers:
      - message_contains: "[DONE]"
    on_enter:
      add_labels: [in-review]

  - id: merged
    label: Merged
    triggers:
      - pr_merged: {}
    terminal: true`}</CodeBlock>
      </Section>

      <Section title="The labeling workflow">
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400">
          <li>User opens a feature request issue in <code>acme/app</code></li>
          <li>PM reviews it, adds labels <code>claw-ready</code> + <code>feature</code></li>
          <li>Workflow webhook fires — labels match, issue is open → claw spawned</li>
          <li>Claw implements the feature, opens a PR, sends <code>[DONE]</code></li>
          <li>Issue moved to <code>in-review</code>, claw watches for CI/review comments</li>
          <li>PM removes <code>claw-ready</code> label → claw stays alive (terminate_on_leave: false)</li>
          <li>PR merges → claw terminates automatically</li>
        </ol>
      </Section>

      <Section title="Workspace: feature-workspace">
        <p className="text-sm text-zinc-400 mb-2">
          A workspace with planning instructions and broader context for
          feature work.
        </p>
        <CodeBlock lang="yaml">{`# .elasticclaw/workspaces/feature-workspace/elasticclaw-config.yaml
name: feature-workspace
provider: daytona
llm_key: fireworks-kimi
default_model: fireworks/accounts/fireworks/models/kimi-k2p6
repositories:
  - repo: acme/app
    permissions: write
tags: [feature]`}</CodeBlock>

        <CodeBlock lang="markdown">{`# .elasticclaw/workspaces/feature-workspace/AGENTS.md
You are a feature implementation agent. Read CONTEXT.md, propose a plan,
then implement. Open a PR and send [DONE] <pr-url> when ready.`}</CodeBlock>
      </Section>

      <Section title="GitHub webhook setup">
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400">
          <li>Go to <strong>repo → Settings → Webhooks → Add webhook</strong></li>
          <li>Payload URL: <code>https://hub.example.com/api/workspaces/feature-workspace/webhooks/github-issues</code></li>
          <li>Content type: <code>application/json</code></li>
          <li>Secret: the webhook secret from workspace issue tracker settings</li>
          <li>Events: <strong>Issues</strong></li>
        </ol>
      </Section>
    </DocsPage>
  );
}
