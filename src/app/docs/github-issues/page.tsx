import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "GitHub Issues" };

export default function GitHubIssuesPage() {
  return (
    <DocsPage
      title="GitHub Issues"
      description="Auto-spawn agents from GitHub issue events — labels, assignments, and state changes."
    >
      <Section title="How it works">
        <p>
          A GitHub Issues factory watches webhook events from your repositories.
          When an issue matches your trigger conditions, ElasticClaw creates a claw
          pre-loaded with the issue context. The claw implements the fix/feature,
          opens a PR, and signals done with <code className="text-cyan-300">[DONE]</code>.
        </p>
        <p>Trigger conditions:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li>Issue state changes to <code>open</code> (or a configured label is applied)</li>
          <li>All configured <code>labels</code> are present on the issue (AND)</li>
          <li><code>assigned_to</code> filter matches (if configured)</li>
        </ul>
      </Section>

      <Section title="1. Configure the integration">
        <CodeBlock lang="yaml">{`integrations:
  github_issues:
    - workspace: my-org          # human label
      token: ghp_xxxxxxxxxxxxx   # GitHub personal access token
      webhook_secret: whsec_xxx  # HMAC secret for webhook validation`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          The token needs <code>repo</code> scope for private repos or <code>public_repo</code>
          for public repos. The webhook secret is used to validate incoming webhooks via
          HMAC-SHA256.
        </p>
      </Section>

      <Section title="2. Create a factory">
        <CodeBlock lang="bash">{`elasticclaw factory create --name bugfix-bot --integration github-issues`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          Edit the generated <code>factory.yaml</code> for your organization,
          labels, and template:
        </p>
        <CodeBlock lang="yaml">{`# .elasticclaw/factories/bugfix-bot/factory.yaml
name: bugfix-bot
integration: github-issues
workspace: my-org               # human label used to match github_issues integration
trigger_status: "claw-ready"    # issue state or label name
done_status: "in-review"        # see note below
template: elasticclaw
# labels: [bug, claw-ready]     # all must be present (AND)
# assigned_to: "@octocat"        # @user, !@user, any, none
webhook_secret_ref: bugfix_bot_webhook_secret
name_pattern: "{issue_id}"       # or: "{repo}-{issue_number}"`}</CodeBlock>
        <Note>
          <code>finished_status</code> is applied when the claw sends{" "}
          <code>[DONE]</code>; if it is empty, the hub falls back to
          <code>done_status</code>. Use a label or project-board column such as
          <code>in-review</code> if you want the issue to stay open while the PR
          is reviewed.
        </Note>
      </Section>

      <Section title="3. Set up the webhook">
        <p>In your GitHub repository settings:</p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400">
          <li>Go to <strong>Settings → Webhooks → Add webhook</strong></li>
          <li>Payload URL: <code>https://hub.example.com/api/integrations/github-issues/webhook</code></li>
          <li>Content type: <code>application/json</code></li>
          <li>Secret: your webhook secret</li>
          <li>Events: <strong>Issues</strong></li>
        </ol>
      </Section>

      <Section title="4. Push the factory">
        <CodeBlock lang="bash">{`elasticclaw factory push bugfix-bot`}</CodeBlock>
      </Section>

      <Section title="Filters">
        <h3 className="text-sm font-semibold text-zinc-200 mt-4 mb-2">Labels</h3>
        <p className="text-sm text-zinc-400">
          All configured labels must be present on the issue. The trigger also fires when
          a label is <em>added</em> to an already-open issue (if the label completes the set).
        </p>

        <h3 className="text-sm font-semibold text-zinc-200 mt-4 mb-2">AssignedTo</h3>
        <p className="text-sm text-zinc-400">
          Filter by assignee:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li><code>@username</code> — only this user</li>
          <li><code>!@username</code> — exclude this user</li>
          <li><code>any</code> — must have an assignee</li>
          <li><code>none</code> — must be unassigned</li>
        </ul>
      </Section>

      <Section title="Name pattern placeholders">
        <p className="text-sm text-zinc-400">
          The <code>name_pattern</code> field supports placeholders for dynamic claw names:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li><code>{"{issue_id}"}</code> — <code>gh-owner/repo/42</code></li>
          <li><code>{"{issue_number}"}</code> — <code>42</code></li>
          <li><code>{"{repo}"}</code> — <code>owner/repo</code></li>
        </ul>
      </Section>

      <Section title="Context file">
        <p className="text-sm text-zinc-400">
          When a claw is created, the hub writes a <code>CONTEXT.md</code> file containing
          the issue title, description, labels, author, and instructions. The claw reads this
          on startup to understand its task.
        </p>
      </Section>

      <Note>
        GitHub Issues factories support the same pipeline stages as Linear/Shortcut factories.
        The default pipeline can move the issue on <code>[DONE]</code>
        and terminates when the PR merges or closes.
      </Note>
    </DocsPage>
  );
}
