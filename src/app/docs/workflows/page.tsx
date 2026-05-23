import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section } from "@/components/docs-page";

export const metadata: Metadata = { title: "Workflows" };

export default function WorkflowsPage() {
  return (
    <DocsPage
      title="Workflows"
      description="Workflows define triggers, runtime settings, inputs, and lifecycle behavior inside a workspace."
    >
      <Section title="How workflows work">
        <p>
          A workflow watches an external system or accepts a manual trigger,
          creates a claw with scoped access from its workspace, injects event
          context, and tracks the job through issue, code, PR, review, and
          completion states.
        </p>
      </Section>

      <Section title="Workflow file">
        <CodeBlock lang="yaml">{`schema_version: v1
name: triage
enabled: true

integration: github-issues
trigger_status: open
working_status: in-progress
finished_status: done
terminate_on_leave: true

provider: daytona
name_pattern: "{repo}-{issue_number}"
tags: ["bugbot"]
color: teal

trigger_repos:
  - elasticclaw/*

labels:
  - bug

secret_refs:
  GITHUB_TOKEN: github_app

enable_manual_trigger: true
inputs:
  - name: issue
    type: string
    required: true`}</CodeBlock>
      </Section>

      <Section title="Workflow fields">
        <div className="space-y-3 text-sm text-zinc-400">
          <p><code className="text-cyan-300">name</code> — Workflow identifier inside the workspace.</p>
          <p><code className="text-cyan-300">enabled</code> — Set false to pause the workflow.</p>
          <p><code className="text-cyan-300">integration</code> — Event source such as <code>linear</code>, <code>shortcut</code>, or <code>github-issues</code>.</p>
          <p><code className="text-cyan-300">workspace</code> — Integration workspace name when the external service needs one.</p>
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
          <p><code className="text-cyan-300">trigger_repos</code> and <code className="text-cyan-300">trigger</code> — GitHub event filters.</p>
        </div>
      </Section>

      <Section title="CLI commands">
        <CodeBlock lang="bash">{`elasticclaw workspace create bugbot
elasticclaw workspace push bugbot

elasticclaw workflow list --workspace bugbot
elasticclaw workflow show triage --workspace bugbot
elasticclaw workflow trigger triage --workspace bugbot --input issue=ENG-123`}</CodeBlock>
      </Section>
    </DocsPage>
  );
}
