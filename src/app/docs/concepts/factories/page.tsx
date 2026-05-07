import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Factories" };

export default function FactoriesPage() {
  return (
    <DocsPage
      title="Factories"
      description="Automatically spawn and terminate claws based on Linear, Shortcut, or GitHub Issues events."
    >
      <Note>
        Factories are in beta. Linear, Shortcut, and GitHub Issues are supported.
      </Note>

      <Section title="How factories work">
        <p>
          A factory watches an external system for events. When a trigger condition
          is met (e.g. an issue enters a status or gets a label), it spawns a new claw
          pre-loaded with context from that event. When the claw sends{" "}
          <code>[DONE] &lt;pr-url&gt;</code>, the factory moves the issue to the
          done status and keeps the claw alive to watch for CI failures and review
          comments. The claw terminates automatically when the PR is merged or closed.
        </p>
        <p className="mt-2">
          If <code>terminate_on_leave: true</code> is set, dragging the issue back
          out of the trigger status will immediately kill the claw and its sandbox.
        </p>
      </Section>

      <Section title="Creating a factory">
        <CodeBlock lang="bash">{`elasticclaw factory create --name my-factory --integration linear`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          This creates <code>.elasticclaw/factories/my-factory/factory.yaml</code> and{" "}
          <code>pipeline.yaml</code>. Edit both files, then push:
        </p>
        <CodeBlock lang="bash">{`elasticclaw factory push my-factory`}</CodeBlock>
      </Section>

      <Section title="Factory fields">
        <div className="space-y-3 text-sm text-zinc-400">
          <p><code className="text-cyan-300">name</code> — Factory identifier (slug)</p>
          <p><code className="text-cyan-300">integration</code> — <code>linear</code>, <code>shortcut</code>, or <code>github-issues</code></p>
          <p><code className="text-cyan-300">workspace</code> — Matches integrations.&lt;type&gt;[].workspace</p>
          <p><code className="text-cyan-300">team</code> — Linear team key filter (e.g. "ELA")</p>
          <p><code className="text-cyan-300">trigger_status</code> — Entering this status/label → create claw</p>
          <p><code className="text-cyan-300">done_status</code> — Status set when claw sends [DONE]</p>
          <p><code className="text-cyan-300">terminate_on_leave</code> — Kill claw when issue leaves trigger status</p>
          <p><code className="text-cyan-300">template</code> — Template name (must be pushed to hub first)</p>
          <p><code className="text-cyan-300">provider</code> — Override default provider for this factory</p>
          <p><code className="text-cyan-300">name_pattern</code> — Dynamic claw name: <code>{"{issue_id}"}</code>, <code>{"{issue_number}"}</code>, <code>{"{repo}"}</code></p>
          <p><code className="text-cyan-300">webhook_secret</code> — Inline HMAC secret (use webhook_secret_ref instead)</p>
          <p><code className="text-cyan-300">webhook_secret_ref</code> — Reference to hub.yaml secrets map</p>
          <p><code className="text-cyan-300">tags</code> — Tags applied to created claws</p>
          <p><code className="text-cyan-300">color</code> — UI accent color for created claws</p>
          <p><code className="text-cyan-300">labels</code> — For GitHub Issues: all must be present (AND)</p>
          <p><code className="text-cyan-300">assigned_to</code> — For GitHub Issues: <code>@user</code>, <code>!@user</code>, <code>any</code>, <code>none</code></p>
          <p><code className="text-cyan-300">enabled</code> — Set false to pause the factory (default: true)</p>
        </div>
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
          <li><strong>PR merged/closed</strong> — terminates the claw and destroys the sandbox</li>
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

      <Section title="Examples">
        <p className="text-zinc-400 mb-4">
          Real-world factory configurations you can adapt.
        </p>

        <h3 className="text-sm font-semibold text-zinc-200 mt-6 mb-2">
          Bug fixes from a single Linear board
        </h3>
        <p className="text-sm text-zinc-400 mb-2">
          Only issues on the <code>ENG</code> team with the <code>bug</code> label
          that enter <code>Triage</code> get a claw. Uses a dedicated bug-fix
          template with extra logging and test tooling.
        </p>
        <CodeBlock lang="yaml">{`# hub.yaml
integrations:
  linear:
    - workspace: acme
      token: \${LINEAR_API_TOKEN}
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
    color: red`}</CodeBlock>

        <h3 className="text-sm font-semibold text-zinc-200 mt-6 mb-2">
          Human-tagged feature work in GitHub Issues
        </h3>
        <p className="text-sm text-zinc-400 mb-2">
          A single labeler (e.g. a PM) applies <code>claw-ready</code> to a
          feature request. The factory picks it up, assigns the claw to the
          original requester, and only acts on issues in the <code>acme/app</code>
          repo.
        </p>
        <CodeBlock lang="yaml">{`# hub.yaml
integrations:
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
    tags: [feature]`}</CodeBlock>

        <h3 className="text-sm font-semibold text-zinc-200 mt-6 mb-2">
          Auto-resolve Dependabot alerts
        </h3>
        <p className="text-sm text-zinc-400 mb-2">
          Dependabot opens security advisories as GitHub issues with the
          <code>dependencies</code> and <code>security</code> labels. The claw
          bumps the package, runs tests, and auto-merges if CI passes. Uses a
          pipeline to stage the work through test → merge.
        </p>
        <CodeBlock lang="yaml">{`# hub.yaml
integrations:
  github_issues:
    - workspace: acme/app
      token: \${GITHUB_TOKEN}
      webhook_secret: \${GITHUB_WEBHOOK_SECRET}

factories:
  - name: dependabot-fix
    integration: github-issues
    workspace: acme/app
    trigger_status: "open"
    labels: [dependencies, security]
    done_status: "closed"
    terminate_on_leave: true
    template: dependabot-template
    webhook_secret_ref: github_webhook_secret
    name_pattern: "dep-{issue_number}"
    tags: [dependabot, security]
    color: orange

# .elasticclaw/factories/dependabot-fix/pipeline.yaml
stages:
  - name: bump
    on_enter:
      - action: run_tests
    on_done:
      - action: open_pr
        auto_merge: true   # merge if all checks pass
  - name: verify
    on_enter:
      - action: watch_ci
    on_done:
      - action: close_issue`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          The <code>auto_merge: true</code> action tells the hub to enable
          auto-merge on the PR. If tests pass, the PR merges and the claw
          terminates. If tests fail, CI failure messages are injected back to
          the claw for a retry loop.
        </p>
      </Section>

      <Section title="CLI commands">
        <CodeBlock lang="bash">{`elasticclaw factory create --name my-factory --integration linear
elasticclaw factory push my-factory
elasticclaw factory list
elasticclaw factory show my-factory
elasticclaw factory rm my-factory`}</CodeBlock>
      </Section>
    </DocsPage>
  );
}
