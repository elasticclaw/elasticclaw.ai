import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Shortcut Integration" };

export default function ShortcutIntegrationPage() {
  return (
    <DocsPage
      title="Shortcut Integration"
      description="Connect ElasticClaw to Shortcut to auto-spawn agents when stories enter a workflow state."
    >
      <Note>
        Shortcut workflows work identically to Linear workflows — stories replace issues,
        workflow states replace statuses. The <code>[DONE]</code> signal moves the story
        and terminates the agent when the PR merges.
      </Note>

      <Section title="How it works">
        <p>
          When a Shortcut story moves into a configured workflow state, the workflow engine
          creates an agent pre-loaded with the story title, description, and URL in{" "}
          <code>CONTEXT.md</code>. The agent reads it, implements the task, opens a PR,
          and sends <code>[DONE] https://github.com/org/repo/pull/N</code>. ElasticClaw Server moves
          the story and keeps the agent alive to watch for CI failures and review comments.
          When the PR merges, the agent terminates automatically.
        </p>
      </Section>

      <Section title="1. Get a Shortcut API token">
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400">
          <li>Go to <strong>Shortcut → Settings → API Tokens</strong></li>
          <li>Click <strong>Generate Token</strong>, name it <em>elasticclaw</em></li>
          <li>Copy the token</li>
        </ol>
      </Section>

      <Section title="2. Register the webhook">
        <p>
          Shortcut supports programmatic webhook registration. Register the ElasticClaw
          webhook using your API token:
        </p>
        <CodeBlock lang="bash">{`curl -X POST https://api.app.shortcut.com/api/v3/webhooks \\
  -H "Shortcut-Token: YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://server.example.com/api/workspaces/shortcut-workspace/webhooks/shortcut",
    "description": "ElasticClaw workflow",
    "story_update": true
  }'`}</CodeBlock>
        <p className="mt-2 text-sm text-zinc-400">
          You can also find the webhook URL in the workspace issue tracker settings in the server web UI.
        </p>
      </Section>

      <Section title="3. Add the issue tracker">
        <CodeBlock lang="text">{`Settings -> Workspaces -> shortcut-workspace -> Issue Trackers
Add Shortcut:
  workspace: my-company
  token: \${SHORTCUT_TOKEN}`}</CodeBlock>
      </Section>

      <Section title="4. Configure workflow.yaml">
        <CodeBlock lang="yaml">{`# .elasticclaw/workflows/shortcut-workflow.yaml
name: shortcut-workflow
integration: shortcut
workspace: my-company
trigger_status: "In Development"   # story enters this state -> spawn agent
done_status: "In Review"           # story moves here on [DONE]
terminate_on_leave: true           # kill agent if story leaves trigger state`}</CodeBlock>
        <Note>
          Publish the workspace with <code>elasticclaw workspace push shortcut-workspace</code>,
          then publish this file with{" "}
          <code>elasticclaw workflow push --workspace shortcut-workspace .elasticclaw/workflows/shortcut-workflow.yaml</code>.
        </Note>
      </Section>

      <Section title="5. Add to your workspace">
        <p>Tell your agent to signal done when finished:</p>
        <CodeBlock lang="markdown">{`When your task is complete, open a PR and send:
[DONE] https://github.com/org/repo/pull/N

This moves the Shortcut story and keeps you alive to watch for CI and review comments.
You'll be terminated automatically when the PR merges.`}</CodeBlock>
      </Section>

      <Section title="Template variables">
        <p className="text-sm text-zinc-400">
          Shortcut story context is written to <code>CONTEXT.md</code> when the
          agent starts. Automatic Shortcut workflow stages do not currently expose
          a Go template object such as <code>{"{{.Issue.Title}}"}</code> in
          <code>stages[].on_enter.inject</code>.
        </p>
        <p className="text-sm text-zinc-400 mt-2">
          Use <code>CONTEXT.md</code> for the story ID, title, URL, and
          description. Manual workflow triggers can still render{" "}
          <code>{"{{.Inputs.name}}"}</code> values from configured inputs.
        </p>
      </Section>

      <Section title="Differences from Linear">
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li>No HMAC signing — Shortcut doesn't provide webhook signatures</li>
          <li>Story IDs are stored as <code>sc-&lt;id&gt;</code> internally</li>
          <li>Workflow state names are resolved via the Shortcut API on each event</li>
          <li>No <code>team</code> filter (Shortcut uses project-level scoping instead)</li>
        </ul>
      </Section>
    </DocsPage>
  );
}
