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
          ElasticClaw watches Linear issue update webhooks for workflows whose
          <code>integration</code> is <code>linear</code>. When an issue enters a
          workflow&apos;s <code>trigger_status</code>, the hub creates a claw, injects
          issue context, and passes the Linear token as <code>LINEAR_API_KEY</code>.
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
          <li>Read the issue title, description, comments, state, team, labels, and assignee</li>
          <li>Move issues through workflow states configured by the workflow or pipeline</li>
          <li>Post comments when a workflow claw is stopped because the issue left the trigger status</li>
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

      <Section title="2. Configure hub.yaml">
        <CodeBlock lang="yaml">{`integrations:
  linear:
    - workspace: my-company
      token: \${LINEAR_API_TOKEN}
      webhook_secret: \${LINEAR_WEBHOOK_SECRET}`}</CodeBlock>
        <Note>
          The integration-level <code>webhook_secret</code> is a shared default
          used to validate all incoming webhooks for this integration. Each workflow
          can override it with <code>webhook_secret_ref</code> (preferred) to use a
          per-workflow secret from the hub <code>secrets</code> map. If both are set,
          the workflow-level <code>webhook_secret_ref</code> takes precedence.
        </Note>
      </Section>

      <Section title="3. Configure Linear webhook">
        <p>
          Point a Linear webhook at the hub. ElasticClaw handles only Linear
          <code>Issue</code> update events.
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
          <li>Payload URL: <code>https://hub.example.com/api/integrations/linear/webhook</code></li>
          <li>Secret: match either <code>integrations.linear[].webhook_secret</code> or the workflow&apos;s <code>webhook_secret_ref</code></li>
        </ul>
      </Section>

      <Section title="Workflow configuration">
        <p>
          Linear workflows use the human <code>workspace</code> label from
          <code>integrations.linear[]</code>. The optional <code>team</code> field
          is the Linear team key from issue identifiers, such as <code>ENG</code>
          in <code>ENG-123</code>; it is not a Linear team ID.
        </p>
        <CodeBlock lang="yaml">{`# workflows/bugfix/workflow.yaml
name: bugfix
integration: linear
workspace: my-company
team: ENG
trigger_status: "Ready for Agent"
working_status: "In Progress"
finished_status: "In Review"
done_status: "Done"
terminate_on_leave: true
workspace: elasticclaw
webhook_secret_ref: linear_webhook_secret`}</CodeBlock>
      </Section>

      <Section title="Workspace integration">
        <p>
          Workspaces can specify which Linear workspace to use:
        </p>
        <CodeBlock lang="yaml">{`# elasticclaw-config.yaml
linear:
  workspace: my-company`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          The workspace matches against <code>integrations.linear[].workspace</code>
          to resolve the API token injected into the claw. Workspace-level
          <code>linear.team</code> is only descriptive context; workflow filtering
          uses <code>team</code> in <code>workflow.yaml</code>.
        </p>
      </Section>

      <Note>
        Linear API tokens have full read/write access to your workspace. Use a
        dedicated service account for production deployments.
      </Note>
    </DocsPage>
  );
}
