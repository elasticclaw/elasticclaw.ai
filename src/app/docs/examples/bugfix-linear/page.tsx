import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Example: Bug fixes (Linear)" };

export default function BugfixLinearExamplePage() {
  return (
    <DocsPage
      title="Bug fixes from a single Linear board"
      description="A workflow that watches one Linear team, filters by label, and auto-spawns claws for bug triage."
    >
      <Note>
        This example shows a complete, working workflow configuration. Adapt the
        team key, labels, and workspace name to your setup.
      </Note>

      <Section title="What it does">
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li>Watches the <code>ENG</code> team on Linear</li>
          <li>Only acts on issues with the <code>bug</code> label</li>
          <li>Triggers when an issue enters <code>Triage</code> status</li>
          <li>Spawns a claw using a dedicated <code>bugfix-workspace</code></li>
          <li>Moves the issue to <code>In Review</code> when the claw sends <code>[DONE]</code></li>
          <li>Kills the claw immediately if the issue leaves <code>Triage</code></li>
        </ul>
      </Section>

      <Section title="Issue tracker">
        <CodeBlock lang="text">{`Settings -> Workspaces -> bugfix-workspace -> Issue Trackers
Add Linear:
  workspace: acme
  token: \${LINEAR_API_TOKEN}
  webhook secret: \${LINEAR_WEBHOOK_SECRET}`}</CodeBlock>
      </Section>

      <Section title="Workflow: eng-bugfix">
        <CodeBlock lang="yaml">{`# .elasticclaw/workflows/eng-bugfix.yaml
name: eng-bugfix
integration: linear
workspace: acme
team: ENG
trigger_status: "Triage"
done_status: "In Review"
terminate_on_leave: true
labels: [bug]
tags: [bugfix]
color: red`}</CodeBlock>
      </Section>

      <Section title="Workspace: bugfix-workspace">
        <p className="text-sm text-zinc-400 mb-2">
          A dedicated workspace with extra logging, test tooling, and a
          conservative model for debugging work.
        </p>
        <CodeBlock lang="yaml">{`# .elasticclaw/workspaces/bugfix-workspace/elasticclaw-config.yaml
name: bugfix-workspace
provider: daytona
llm_key: anthropic-prod
default_model: anthropic/claude-sonnet-4-6
repositories:
  - repo: acme/app
    permissions: write
tags: [bugfix]
color: red`}</CodeBlock>

        <CodeBlock lang="markdown">{`# .elasticclaw/workspaces/bugfix-workspace/AGENTS.md
You are a bug-fix agent. Read CONTEXT.md carefully, reproduce the bug,
write a minimal fix, and open a PR. Send [DONE] <pr-url> when ready.`}</CodeBlock>
      </Section>

      <Section title="Linear webhook setup">
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400">
          <li>Go to <strong>Linear → Settings → API → Webhooks</strong></li>
          <li>Payload URL: <code>https://hub.example.com/api/workspaces/bugfix-workspace/webhooks/linear</code></li>
          <li>Events: <strong>Issues</strong></li>
          <li>Use the signing secret from the workspace issue tracker settings</li>
        </ol>
      </Section>
    </DocsPage>
  );
}
