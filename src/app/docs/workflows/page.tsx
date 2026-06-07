import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

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

      <Section title="Run commands and gates">
        <p>
          Workflow stages can run deterministic commands in the agent workspace,
          persist structured output, and use gates to choose the next stage.
          This is useful for tests, security scanners, deploy previews,
          CodeBuild jobs, or any tool that can print JSON.
        </p>
        <CodeBlock lang="yaml">{`stages:
  - id: validation
    label: Validation
    triggers:
      - message_contains: "[DONE]"
    on_enter:
      run:
        command: python3 scripts/validate.py
        output: validation
        timeout: 30m
    gate:
      output: validation
      pass:
        path: status
        values:
          - clean
          - skipped
      fail:
        path: status
        values:
          - issues
          - error
      required: true
      treat_skipped_as_pass: true

  - id: create_pr
    label: Create PR
    triggers:
      - gate_result:
          stage: validation
          verdict: pass
    on_enter:
      inject: |
        Validation status: {{ .Outputs.validation.status }}.
        Create the PR now.

  - id: fix_validation
    label: Fix Validation
    triggers:
      - gate_result:
          stage: validation
          verdict: fail
    on_enter:
      inject: |
        Validation failed: {{ .Outputs.validation.reason }}
        Fix the issue, commit locally, then say [DONE].`}</CodeBlock>
        <Note>
          Commands should print a JSON object to stdout. ElasticClaw also
          accepts noisy stdout when the final line is JSON, such as shell trace
          output followed by <code>{"{\"status\":\"clean\"}"}</code>.
        </Note>
      </Section>

      <Section title="Review stages">
        <p>
          A judge stage runs a model-backed review over bounded inputs such as
          the issue, current diff, captured test output, or selected files.
          Use judge stages for subjective review, and gates for deterministic
          tool results.
        </p>
        <CodeBlock lang="yaml">{`stages:
  - id: review
    label: Review
    triggers:
      - message_contains: "[READY_FOR_REVIEW]"
    on_enter:
      judge:
        model: anthropic/claude-sonnet-4-6
        inputs:
          - issue
          - git_diff
          - test_output
        output: review_result
        instructions: |
          Decide whether the implementation satisfies the issue.
        require:
          verdict: pass

  - id: fix_review
    triggers:
      - judge_verdict: fail
    on_enter:
      inject: |
        Review failed. Apply the requested fixes and say [READY_FOR_REVIEW].`}</CodeBlock>
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
