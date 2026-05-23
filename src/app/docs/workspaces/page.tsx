import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Workspaces" };

export default function WorkspacesPage() {
  return (
    <DocsPage
      title="Workspaces"
      description="Workspaces group repositories, secrets, webhook secrets, and one or more workflows."
    >
      <Section title="Workspace layout">
        <p>
          A workspace is the deployment unit for automation. It contains a
          <code className="text-cyan-300">elasticclaw-config.yaml</code> file and any
          number of workflow definitions under <code className="text-cyan-300">workflows/</code>.
        </p>
        <CodeBlock lang="text">{`.elasticclaw/
  workspaces/
    bugbot/
      elasticclaw-config.yaml
      AGENTS.md
      TOOLS.md
      workflows/
        triage.yaml
        resolution.yaml`}</CodeBlock>
      </Section>

      <Section title="elasticclaw-config.yaml">
        <CodeBlock lang="yaml">{`schema_version: v1
name: bugbot

repositories:
  - elasticclaw/*

secrets:
  - github_app
  - linear_token

webhook_secrets:
  - github_issues_webhook
  - linear_webhook

provider: replicated`}</CodeBlock>
      </Section>

      <Section title="Workspace fields">
        <div className="space-y-3 text-sm text-zinc-400">
          <p><code className="text-cyan-300">schema_version</code> — Optional schema marker; defaults to <code>v1</code>.</p>
          <p><code className="text-cyan-300">name</code> — Workspace identifier.</p>
          <p><code className="text-cyan-300">repositories</code> — Repository selectors workflows in this workspace can use.</p>
          <p><code className="text-cyan-300">secrets</code> — Named hub secrets workflows in this workspace can reference.</p>
          <p><code className="text-cyan-300">webhook_secrets</code> — Named HMAC secrets accepted by webhook-triggered workflows.</p>
        </div>
      </Section>

      <Section title="Push a workspace">
        <p>
          Pushing a workspace publishes <code>elasticclaw-config.yaml</code>, workspace files, and all
          workflow files below <code>workflows/</code>.
        </p>
        <CodeBlock lang="bash">{`elasticclaw workspace create bugbot
elasticclaw workspace push bugbot
elasticclaw workspace list
elasticclaw workspace show bugbot
elasticclaw workspace rm bugbot`}</CodeBlock>
      </Section>

      <Note>
        Workflows belong to exactly one workspace. Put shared access policy in
        the workspace and event-specific behavior in each workflow file.
      </Note>
    </DocsPage>
  );
}
