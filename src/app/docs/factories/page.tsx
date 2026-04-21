import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Factories" };

export default function FactoriesPage() {
  return (
    <DocsPage
      title="Factories"
      description="Automatically spawn and terminate claws based on Linear or Shortcut issue status changes."
    >
      <Note>
        Factories are in beta. Linear and Shortcut are supported. GitHub Issues
        and cron triggers are planned.
      </Note>

      <Section title="How factories work">
        <p>
          A factory watches an external system for events. When a trigger condition
          is met (e.g. an issue enters a status), it spawns a new claw pre-loaded
          with context from that event. When the claw sends{" "}
          <code>[DONE] &lt;pr-url&gt;</code>, the factory moves the issue to the
          done status and keeps the claw alive to watch for CI failures and review
          comments. The claw terminates automatically when the PR is merged or closed.
        </p>
        <p className="mt-2">
          If <code>terminate_on_leave: true</code> is set, dragging the issue back
          out of the trigger status will immediately kill the claw and its VM.
        </p>
      </Section>

      <Section title="Linear factory setup">
        <h3 className="text-sm font-semibold text-zinc-200 mb-2">1. Get the webhook URL</h3>
        <p>
          Find it in <strong>Settings → Factories</strong> in the hub web UI, or construct it:
        </p>
        <CodeBlock lang="bash">{`https://your-hub.example.com/api/integrations/linear/webhook`}</CodeBlock>

        <h3 className="text-sm font-semibold text-zinc-200 mt-6 mb-2">2. Create a Linear webhook</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400">
          <li>Go to <strong>Linear → Settings → API → Webhooks</strong></li>
          <li>Click <strong>New webhook</strong>, paste the URL above</li>
          <li>Check <strong>Issues</strong> under Data change events</li>
          <li>Copy the <strong>Signing secret</strong></li>
        </ol>

        <h3 className="text-sm font-semibold text-zinc-200 mt-6 mb-2">3. Get a Linear API key</h3>
        <p>Go to <strong>Linear → Settings → API → Personal API Keys</strong> and create a key.</p>

        <h3 className="text-sm font-semibold text-zinc-200 mt-6 mb-2">4. Configure hub.yaml</h3>
        <CodeBlock lang="yaml">{`integrations:
  linear:
    - workspace: my-company
      api_key: lin_api_...
      # webhook_secret is per-factory (set in Settings → Factories)

factories:
  - name: feature-factory
    integration: linear
    workspace: my-company
    team: ELA                        # optional — filter by team key
    trigger_status: "Ready for Agent"
    done_status: "In Review"
    terminate_on_leave: true
    template: base
    webhook_secret: whsec_...        # signing secret from step 2
    tags:                            # optional — applied to created claws
      - linear
    color: teal`}</CodeBlock>
      </Section>

      <Section title="Shortcut factory setup">
        <p>
          See the <a href="/docs/shortcut-integration" className="text-cyan-400 hover:underline">Shortcut Integration</a> guide
          for full setup instructions.
        </p>
        <CodeBlock lang="yaml">{`integrations:
  shortcut:
    - workspace: my-company
      token: YOUR_SHORTCUT_TOKEN

factories:
  - name: sc-factory
    integration: shortcut
    workspace: my-company
    trigger_status: "In Development"
    done_status: "In Review"
    terminate_on_leave: true
    template: base`}</CodeBlock>
      </Section>

      <Section title="The [DONE] signal">
        <p>
          When an agent finishes its task, it sends <code>[DONE]</code> followed by the
          PR URL as a chat message:
        </p>
        <CodeBlock lang="text">{`[DONE] https://github.com/org/repo/pull/42`}</CodeBlock>
        <p className="mt-2">The hub then:</p>
        <ol className="list-decimal list-inside space-y-1 text-sm text-zinc-400 mt-2">
          <li>Validates the PR is open</li>
          <li>Moves the issue/story to <code>done_status</code></li>
          <li>Keeps the claw alive to watch for CI failures and bugbot comments</li>
          <li>Terminates the claw when the PR is merged or closed</li>
        </ol>
        <p className="mt-3 text-sm text-zinc-400">
          Add this to your agent&apos;s <code>AGENTS.md</code>:
        </p>
        <CodeBlock lang="markdown">{`When your task is complete, open a PR and send:
[DONE] https://github.com/org/repo/pull/N

This moves the issue and keeps you alive to watch CI and review comments.
You'll terminate automatically when the PR merges.`}</CodeBlock>
      </Section>

      <Section title="Auto-watching CI and bugbot">
        <p>
          While a claw is in the watching state (after <code>[DONE]</code>), the hub
          polls the PR every 2 minutes for:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400 mt-2">
          <li><strong>CI failures</strong> — failed check runs inject a message telling the agent to fix them</li>
          <li><strong>Bugbot comments</strong> — new Cursor bugbot comments are injected as user messages</li>
          <li><strong>PR merged/closed</strong> — terminates the claw and destroys the VM</li>
        </ul>
        <p className="mt-3 text-sm text-zinc-400">
          You can disable per-template with:
        </p>
        <CodeBlock lang="yaml">{`# in elasticclaw-config.yaml
auto_watch_ci: false
auto_watch_bugbot: false`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          Or toggle per-claw from the dashboard card back.
        </p>
      </Section>

      <Section title="Activity log">
        <p>
          Every webhook event is logged for 4 hours. Click <strong>Activity</strong> next to
          any factory in Settings to see:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400 mt-2">
          <li><code>claw_created</code> — issue entered trigger status, claw spawned</li>
          <li><code>claw_terminated</code> — issue left trigger status, claw killed</li>
          <li><code>error</code> — provisioning failed</li>
          <li><code>not_actionable</code> — webhook received but status didn&apos;t match</li>
        </ul>
      </Section>

      <Section title="1:1 enforcement">
        <p>
          Each issue/story can only have one active claw at a time. If the same issue
          is moved into the trigger status again while a claw already exists, a new
          one will not be created.
        </p>
      </Section>
    </DocsPage>
  );
}
