import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section } from "@/components/docs-page";

export const metadata: Metadata = { title: "Workflows" };

export default function WorkflowsPage() {
  return (
    <DocsPage
      title="Workflows"
      description="Workflows define triggers, manual inputs, and lifecycle stages, then run inside a published workspace."
    >
      <Section title="How workflows work">
        <p>
          A workflow watches an external system or accepts a manual trigger,
          creates an agent with scoped access from its workspace, injects event
          context, and tracks the work through issue, code, PR, review, and
          completion states.
        </p>
        <p>
          Author workflow YAML under <code>.elasticclaw/workflows/</code>, then
          publish it to a workspace with <code>elasticclaw workflow push</code>.
        </p>
      </Section>

      <Section title="Workflow file">
        <CodeBlock lang="yaml">{`schema_version: v1
name: triage
enabled: true

trigger:
  github_issues:
    event: issue_labeled
    repositories:
      - my-org/my-app
    states:
      - open
    labels:
      - agent-ready
    labelers:
      - "*"

provider: daytona
tags: ["triage"]
color: teal

secret_refs:
  GITHUB_TOKEN: github_app

enable_manual_trigger: true
inputs:
  - name: issue
    type: string
    required: true

stages:
  - id: working
    label: Working
    entry: true
    on_enter:
      remove_labels: [agent-ready]
      add_labels: [agent-working]
      inject: |
        Issue: {{.Issue.Identifier}} — {{.Issue.Title}}
        URL: {{.Issue.URL}}

        Read CONTEXT.md and start working.

  - id: pr_opened
    label: PR Opened
    triggers:
      - message_contains: "[DONE]"
    on_enter:
      add_labels: [needs-review]
      remove_labels: [agent-working]

  - id: merged
    label: Merged
    triggers:
      - pr_merged: {}
    terminal: true`}</CodeBlock>
      </Section>

      <Section title="Workflow fields">
        <div className="space-y-3 text-sm text-zinc-400">
          <p><code className="text-cyan-300">name</code> — Workflow identifier inside the workspace.</p>
          <p><code className="text-cyan-300">enabled</code> — Set false to pause the workflow.</p>
          <p><code className="text-cyan-300">trigger.github_issues</code> — GitHub Issues source. Supports issue events, repositories, states, labels, labelers, and assignee filters.</p>
          <p><code className="text-cyan-300">trigger.linear</code> — Linear source. Supports status-change events, states, team, labels, and assignee filters.</p>
          <p><code className="text-cyan-300">provider</code> — Sandbox provider override for agents created by this workflow.</p>
          <p><code className="text-cyan-300">tags</code> and <code className="text-cyan-300">color</code> — Dashboard metadata for created agents.</p>
          <p><code className="text-cyan-300">secret_refs</code> — Environment variable to workspace secret name map.</p>
          <p><code className="text-cyan-300">inputs</code> — Manual trigger inputs.</p>
          <p><code className="text-cyan-300">concurrency_group</code> — Limit parallel agents by group.</p>
          <p><code className="text-cyan-300">enable_manual_trigger</code> — Allow dashboard and CLI manual triggers.</p>
          <p><code className="text-cyan-300">stages</code> — Lifecycle stages used by the workflow.</p>
        </div>
      </Section>

      <Section title="CLI commands">
        <CodeBlock lang="bash">{`elasticclaw workspace create --name my-app
elasticclaw workspace push my-app
elasticclaw workflow push --workspace my-app .elasticclaw/workflows/triage.yaml

elasticclaw workflow list --workspace my-app
elasticclaw workflow show triage --workspace my-app
elasticclaw workflow trigger triage --workspace my-app --input issue=ENG-123`}</CodeBlock>
      </Section>
    </DocsPage>
  );
}
