import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Jira Integration" };

export default function JiraIntegrationPage() {
  return (
    <DocsPage
      title="Jira Integration"
      description="Connect ElasticClaw to Jira Cloud to start workflow agents when issues move into a configured status."
    >
      <Section title="How it works">
        <p>
          A Jira workflow watches issue update events for a project, status, label,
          and assignee filter. When a matching issue moves into the trigger
          status, ElasticClaw creates an agent, writes Jira issue context into
          <code>CONTEXT.md</code>, and injects the issue into the workflow stage.
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400 mt-2">
          <li>Read the issue key, title, description, labels, project, status, and assignee</li>
          <li>Require labels and suppress automation with <code>exclude_labels</code></li>
          <li>Move the issue to a working status when the agent starts</li>
          <li>Move the issue through later workflow stages with <code>move_issue</code></li>
          <li>Use polling as a fallback for missed webhook deliveries</li>
        </ul>
      </Section>

      <Section title="1. Create a Jira API token">
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400">
          <li>Go to <strong>Atlassian account settings - Security - API tokens</strong></li>
          <li>Create a token named <em>ElasticClaw</em></li>
          <li>Copy the token and store it with your ElasticClaw Server secrets</li>
        </ol>
        <CodeBlock lang="bash">{`export JIRA_BASE_URL=https://your-site.atlassian.net
export JIRA_USERNAME=you@example.com
export JIRA_API_TOKEN=ATATT3x...`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          Jira Cloud basic auth uses your Atlassian account email address as the
          username and the API token as the password.
        </p>
      </Section>

      <Section title="2. Configure the workspace issue tracker">
        <CodeBlock lang="text">{`Settings -> Workspaces -> my-app -> Issue Trackers
Add Jira:
  workspace: default
  base URL: https://your-site.atlassian.net
  username: you@example.com
  token: \${JIRA_API_TOKEN}
  webhook secret: \${JIRA_WEBHOOK_SECRET}`}</CodeBlock>
        <Note>
          The Jira account must be able to browse the project, read issues,
          create comments, edit labels, transition issues, and delete issues if
          your tests or cleanup scripts create temporary issues.
        </Note>
      </Section>

      <Section title="3. Configure a Jira webhook">
        <p>
          Add a Jira webhook that sends issue update events to ElasticClaw Server.
          The workspace-scoped URL is preferred when the webhook belongs to one
          ElasticClaw workspace.
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400 mt-2">
          <li>URL: <code>https://server.example.com/api/workspaces/my-app/webhooks/jira</code></li>
          <li>Events: <strong>Issue updated</strong></li>
          <li>Secret header: <code>X-ElasticClaw-Webhook-Secret: {"${JIRA_WEBHOOK_SECRET}"}</code></li>
        </ul>
        <p className="text-sm text-zinc-400 mt-2">
          If one Jira webhook should fan out across all configured ElasticClaw
          workspaces, use <code>https://server.example.com/api/integrations/jira/webhook</code>.
          ElasticClaw will resolve matching Jira workflows globally.
        </p>
        <Note>
          Jira Cloud webhook management is limited for personal API tokens. If
          your Jira plan or app setup cannot add the custom secret header, leave
          the workspace tracker webhook secret empty and restrict the endpoint at
          the network layer.
        </Note>
      </Section>

      <Section title="4. Create a workflow">
        <p>
          Jira workflows use <code>trigger.jira</code>. Project filters use the
          Jira project key, such as <code>KAN</code> in <code>KAN-123</code>.
        </p>
        <CodeBlock lang="yaml">{`# .elasticclaw/workflows/jira-bugfix.yaml
schema_version: v1
name: jira-bugfix

trigger:
  jira:
    event: status_changed
    workspace: default
    projects:
      - KAN
    states:
      - "Ready for Agent"
    labels:
      - elasticclaw
    exclude_labels:
      - blocked

concurrency_group: jira-bugfix
working_status: "Agent Working"

stages:
  - id: working
    label: Working
    entry: true
    on_enter:
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
        <p className="text-sm text-zinc-400 mt-2">
          <code>working_status</code> moves the Jira issue as soon as the agent
          starts. Later stages can move the same issue with <code>move_issue</code>.
        </p>
      </Section>

      <Section title="Label filters">
        <p className="text-sm text-zinc-400">
          Jira triggers require every configured <code>labels</code> value and
          reject issues that have any configured <code>exclude_labels</code>{" "}
          value. The same filters apply to webhook delivery and the polling
          fallback path.
        </p>
        <CodeBlock lang="yaml">{`trigger:
  jira:
    projects: [KAN]
    states: ["Ready for Agent"]
    labels: [elasticclaw]
    exclude_labels: [blocked, do-not-automate]`}</CodeBlock>
      </Section>

      <Section title="5. Push the workflow">
        <CodeBlock lang="bash">{`elasticclaw workspace push my-app
elasticclaw workflow push --workspace my-app .elasticclaw/workflows/jira-bugfix.yaml`}</CodeBlock>
      </Section>

      <Section title="Template variables">
        <p className="text-sm text-zinc-400">
          In <code>stages[].on_enter.inject</code>, automatic Jira workflows
          expose this issue object:
        </p>
        <div className="space-y-2 text-sm text-zinc-400 mt-2">
          <p><code className="text-cyan-300">{"{{.Issue.Identifier}}"}</code> — Jira issue key, such as <code>KAN-123</code>.</p>
          <p><code className="text-cyan-300">{"{{.Issue.Title}}"}</code> — Jira issue summary.</p>
          <p><code className="text-cyan-300">{"{{.Issue.URL}}"}</code> — Browser URL for the issue.</p>
          <p><code className="text-cyan-300">{"{{.Issue.Description}}"}</code> — Jira issue description.</p>
        </div>
      </Section>

      <Section title="Polling fallback">
        <p className="text-sm text-zinc-400">
          ElasticClaw also polls Jira for recently updated matching issues. The
          polling path uses the same project, status, label, and assignee filters
          as webhooks, and claw creation is deduplicated so a webhook and poll
          for the same issue do not create two agents.
        </p>
      </Section>

      <Note>
        Jira status names and transition names are workspace-specific. Use exact
        names from your Jira workflow for <code>states</code>,{" "}
        <code>working_status</code>, and <code>move_issue</code>.
      </Note>
    </DocsPage>
  );
}
