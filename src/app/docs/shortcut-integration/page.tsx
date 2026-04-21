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
        Shortcut factories work identically to Linear factories — stories replace issues,
        workflow states replace statuses. The <code>[DONE]</code> signal moves the story
        and terminates the claw when the PR merges.
      </Note>

      <Section title="How it works">
        <p>
          When a Shortcut story moves into a configured workflow state, the factory engine
          creates a claw pre-loaded with the story title, description, and URL in{" "}
          <code>BOOTSTRAP.md</code>. The agent reads it, implements the task, opens a PR,
          and sends <code>[DONE] https://github.com/org/repo/pull/N</code>. The hub moves
          the story and keeps the claw alive to watch for CI failures and review comments.
          When the PR merges, the claw terminates automatically.
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
    "url": "https://your-hub.example.com/api/integrations/shortcut/webhook",
    "description": "ElasticClaw factory",
    "story_update": true
  }'`}</CodeBlock>
        <p className="mt-2 text-sm text-zinc-400">
          You can also find the webhook URL in <strong>Settings → Factories</strong> in the hub web UI.
        </p>
      </Section>

      <Section title="3. Configure hub.yaml">
        <CodeBlock lang="yaml">{`integrations:
  shortcut:
    - workspace: my-company   # human label
      token: YOUR_TOKEN

factories:
  - name: shortcut-factory
    integration: shortcut
    workspace: my-company
    trigger_status: "In Development"   # story enters this state → spawn claw
    done_status: "In Review"           # story moves here on [DONE]
    terminate_on_leave: true           # kill claw if story leaves trigger state
    template: base                     # template name (push to hub first)`}</CodeBlock>
        <Note>
          Restart the hub after editing hub.yaml:{" "}
          <code>sudo systemctl restart elasticclaw</code>
        </Note>
      </Section>

      <Section title="4. Add to your template">
        <p>Tell your agent to signal done when finished:</p>
        <CodeBlock lang="markdown">{`When your task is complete, open a PR and send:
[DONE] https://github.com/org/repo/pull/N

This moves the Shortcut story and keeps you alive to watch for CI and review comments.
You'll be terminated automatically when the PR merges.`}</CodeBlock>
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
