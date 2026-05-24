import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section } from "@/components/docs-page";

export const metadata: Metadata = { title: "Workflows" };

export default function WorkflowsPage() {
  return (
    <DocsPage
      title="Workflows"
      description="Workflows define triggers, manual inputs, and lifecycle jobs, then run inside a published workspace."
    >
      <Section title="How workflows work">
        <p>
          A workflow watches an external system or accepts a manual trigger,
          creates a claw with scoped access from its workspace, injects event
          context, and tracks the job through issue, code, PR, review, and
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
  type: github_issues
  event: issue_labeled
  repositories:
    - my-org/my-app
  states:
    - open
  labels:
    - claw-ready
  labelers:
    - "*"

provider: daytona
name_pattern: "{repo}-{issue_number}"
tags: ["triage"]
color: teal

secret_refs:
  GITHUB_TOKEN: github_app

enable_manual_trigger: true
inputs:
  - name: issue
    type: string
    required: true

jobs:
  - id: working
    label: Working
    entry: true
    on_enter:
      remove_labels: [claw-ready]
      add_labels: [claw-working]
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
      remove_labels: [claw-working]

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
          <p><code className="text-cyan-300">trigger</code> — New trigger schema. GitHub Issues supports <code>type: github_issues</code>, issue events, repositories, states, labels, and labelers.</p>
          <p><code className="text-cyan-300">integration</code> — Legacy/direct event source such as <code>linear</code>, <code>shortcut</code>, or <code>github-issues</code>.</p>
          <p><code className="text-cyan-300">workspace</code> — Issue tracker workspace name when direct integration fields are used.</p>
          <p><code className="text-cyan-300">team</code> — Linear team key filter.</p>
          <p><code className="text-cyan-300">trigger_status</code> — Status or label that starts work.</p>
          <p><code className="text-cyan-300">working_status</code> — Optional status set after a claw starts.</p>
          <p><code className="text-cyan-300">finished_status</code> — Status set when the job completes.</p>
          <p><code className="text-cyan-300">terminate_on_leave</code> — Kill the claw if the source item leaves the trigger status.</p>
          <p><code className="text-cyan-300">provider</code> — Sandbox provider override for claws created by this workflow.</p>
          <p><code className="text-cyan-300">name_pattern</code> — Dynamic claw names using values like <code>{"{repo}"}</code> and <code>{"{issue_number}"}</code>.</p>
          <p><code className="text-cyan-300">tags</code> and <code className="text-cyan-300">color</code> — Dashboard metadata for created claws.</p>
          <p><code className="text-cyan-300">labels</code>, <code className="text-cyan-300">assigned_to</code>, and <code className="text-cyan-300">allowed_labelers</code> — Event filters.</p>
          <p><code className="text-cyan-300">secret_refs</code> — Environment variable to workspace secret name map.</p>
          <p><code className="text-cyan-300">inputs</code> — Manual trigger inputs.</p>
          <p><code className="text-cyan-300">concurrency_group</code> — Limit parallel claws by group.</p>
          <p><code className="text-cyan-300">enable_manual_trigger</code> — Allow dashboard and CLI manual triggers.</p>
          <p><code className="text-cyan-300">jobs</code> — Lifecycle stages. Jobs become the workflow pipeline used by the hub.</p>
          <p><code className="text-cyan-300">trigger_repos</code> — Legacy GitHub repository filters.</p>
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
