import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";
import { YouTubeVideo } from "@/components/youtube-video";

export const metadata: Metadata = { title: "Linear Integration" };

export default function LinearIntegrationPage() {
  return (
    <DocsPage
      title="Linear Integration"
      description="Connect ElasticClaw to Linear to sync agent tasks with your team's issues and projects."
    >
      <Section title="How it works">
        <p>
          ElasticClaw watches Linear issue update webhooks for workflows with a
          <code>trigger.linear</code> source. When an issue enters a matching
          state, ElasticClaw Server creates an agent, injects issue context, and passes the
          Linear token as <code>LINEAR_API_KEY</code>.
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
          <li>Read the issue title, description, comments, state, team, labels, and assignee</li>
          <li>Require labels and suppress automation with <code>exclude_labels</code></li>
          <li>Move issues through workflow stages configured by the workflow</li>
          <li>Post comments when a workflow agent is stopped because the issue left the trigger status</li>
          <li>Expose a small <code>claw-bridge linear</code> CLI inside the sandbox for issue get, update, search, and teams</li>
        </ul>
      </Section>

      <Section title="Configure Linear">
        <YouTubeVideo
          title="Configure ElasticClaw with Linear"
          videoId="NtMX-iOpbko"
        />
      </Section>

      <Section title="1. Create a Linear API Token">
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>
            Go to <strong>Linear → Settings → API → Personal API Keys</strong>
          </li>
          <li>Click <strong>Create key</strong>, give it a name like &quot;ElasticClaw&quot;</li>
          <li>Copy the token — you won&apos;t see it again</li>
        </ol>
        <CodeBlock lang="bash">{`export LINEAR_API_TOKEN=lin_api_xxxxxxxxxxxxx`}</CodeBlock>
      </Section>

      <Section title="2. Configure the workspace issue tracker">
        <CodeBlock lang="text">{`Settings -> Workspaces -> my-app -> Issue Trackers
Add Linear:
  workspace: my-company
  token: \${LINEAR_API_TOKEN}
  webhook secret: \${LINEAR_WEBHOOK_SECRET}`}</CodeBlock>
        <Note>
          Issue tracker credentials and webhook secrets are stored with the
          workspace.
        </Note>
      </Section>

      <Section title="3. Configure Linear webhook">
        <p>
          Point a Linear webhook at ElasticClaw Server. ElasticClaw handles only Linear
          <code>Issue</code> update events.
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
          <li>Payload URL: <code>https://server.example.com/api/workspaces/my-app/webhooks/linear</code></li>
          <li>Secret: the Linear webhook secret configured for the workspace issue tracker</li>
        </ul>
      </Section>

      <Section title="Workflow configuration">
        <p>
          Linear workflows use <code>trigger.linear</code>. If the ElasticClaw
          workspace has one Linear connection, the workflow uses it automatically.
          The optional <code>team</code> field is the Linear team key from issue
          identifiers, such as <code>ENG</code> in <code>ENG-123</code>; it is
          not a Linear team ID. The optional <code>projects</code> list restricts
          the workflow to issues in specific Linear projects by name or ID.
        </p>
        <CodeBlock lang="yaml">{`# .elasticclaw/workflows/bugfix.yaml
schema_version: v1
name: bugfix
trigger:
  linear:
    event: status_changed
    team: ENG
    projects:
      - "Adversary Labs"
    states:
      - "Ready for Agent"
    labels:
      - bug
    exclude_labels:
      - blocked

stages:
  - id: working
    label: Working
    entry: true
    on_enter:
      move_issue: "In Progress"
      inject: |
        Issue: {{.Issue.Identifier}} - {{.Issue.Title}}
        URL: {{.Issue.URL}}

        Read CONTEXT.md and start working.

  - id: pr_opened
    label: PR Opened
    triggers:
      - message_contains: "[DONE]"
    on_enter:
      move_issue: "In Review"

  - id: merged
    label: Merged
    triggers:
      - pr_merged: {}
    on_enter:
      move_issue: Done
    terminal: true`}</CodeBlock>
      </Section>

      <Section title="Workspace integration">
        <p>
          Push the workspace and workflow separately:
        </p>
        <CodeBlock lang="bash">{`elasticclaw workspace push my-app
elasticclaw workflow push --workspace my-app .elasticclaw/workflows/bugfix.yaml`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          The workflow uses the Linear connection configured for the ElasticClaw
          workspace. Workflow filtering uses <code>trigger.linear.team</code>.
        </p>
      </Section>

      <Section title="Label filters">
        <p className="text-sm text-zinc-400">
          Linear triggers require every configured <code>labels</code> value and
          reject issues that have any configured <code>exclude_labels</code>{" "}
          value. Use this to keep automation away from issues that are blocked,
          on hold, or explicitly reserved for humans.
        </p>
        <CodeBlock lang="yaml">{`trigger:
  linear:
    team: ENG
    states: ["Ready for Agent"]
    labels: [bug]
    exclude_labels: [blocked, needs-human-review]`}</CodeBlock>
      </Section>

      <Section title="Template variables">
        <p className="text-sm text-zinc-400">
          In <code>stages[].on_enter.inject</code>, automatic Linear workflows
          expose this complete issue object:
        </p>
        <div className="space-y-2 text-sm text-zinc-400 mt-2">
          <p><code className="text-cyan-300">{"{{.Issue.Identifier}}"}</code> — Linear issue key, such as <code>ENG-123</code>.</p>
          <p><code className="text-cyan-300">{"{{.Issue.Title}}"}</code> — Linear issue title.</p>
          <p><code className="text-cyan-300">{"{{.Issue.URL}}"}</code> — Browser URL for the issue.</p>
          <p><code className="text-cyan-300">{"{{.Issue.Description}}"}</code> — Linear issue description.</p>
        </div>
      </Section>

      <Note>
        Linear API tokens have full read/write access to your workspace. Use a
        dedicated service account for production deployments.
      </Note>
    </DocsPage>
  );
}
