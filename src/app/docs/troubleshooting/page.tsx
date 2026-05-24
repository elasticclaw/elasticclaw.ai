import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Troubleshooting" };

export default function TroubleshootingPage() {
  return (
    <DocsPage
      title="Troubleshooting"
      description="Common issues and how to fix them."
    >
      <Section title="Secret reference is missing">
        <p>
          If Doctor reports that a workflow or workspace references a missing secret:
        </p>
        <CodeBlock lang="text">{`Workflow "my-workflow" secret_refs references missing secret
  secret_refs maps "SLACK_TOKEN" to secret "slack_bot_token" which is not configured in the workspace.`}</CodeBlock>
        <p>
          Add the missing secret to the workspace:
        </p>
        <CodeBlock lang="bash">{`elasticclaw secret create slack_bot_token --workspace my-workspace --value "$SLACK_BOT_TOKEN"`}</CodeBlock>
      </Section>

      <Section title="Webhooks not triggering workflows">
        <p>
          If webhooks from Linear, GitHub Issues, or Shortcut are not triggering
          workflows, check that the issue tracker is configured in the workspace
          and that the webhook URL includes the workspace name:
        </p>
        <CodeBlock lang="text">{`https://server.example.com/api/workspaces/my-workspace/webhooks/linear
https://server.example.com/api/workspaces/my-workspace/webhooks/github-issues`}</CodeBlock>
        <p>
          Configure tokens and webhook signing secrets in{" "}
          <strong>Settings → Workspaces → Issue Trackers</strong>.
        </p>
      </Section>
    </DocsPage>
  );
}
