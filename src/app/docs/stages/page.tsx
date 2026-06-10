import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Workflow Stages" };

export default function StagesPage() {
  return (
    <DocsPage
      title="Workflow Stages"
      description="Workflow stages define the lifecycle of a workflow-created agent: entry instructions, done signals, issue transitions, PR events, and terminal stages."
    >
      <Section title="What are stages?">
        <p>
          Stages are the state machine that drives a workflow-created agent through its lifecycle.
          Each stage has entry conditions, actions, and transitions. ElasticClaw Server injects
          instructions into the agent as messages at each stage transition.
        </p>
      </Section>

      <Section title="Stage structure">
        <CodeBlock lang="yaml">{`stages:
  - id: working
    label: "Working"
    entry: true
    on_enter:
      inject: |
        Read your CONTEXT.md and start working on the issue.
        Narrate your progress as you go. Keep me updated.

  - id: pr_opened
    label: "PR Opened"
    triggers:
      - message_contains: "[DONE]"
    on_enter:
      move_issue: "In Review"
      inject: |
        PR created. Watch for CI results and review comments.

  - id: merged
    label: "Merged"
    triggers:
      - pr_merged:
    terminal: true

  - id: closed_no_merge
    label: "Closed Without Merge"
    triggers:
      - pr_closed:
    on_enter:
      inject: |
        PR was closed without merging. Decide: reopen, new PR, or ask the user.`}</CodeBlock>
      </Section>

      <Section title="Tool gates">
        <p>
          Stages can run a command and evaluate its structured output before
          deciding what happens next. The command runs in the agent workspace,
          and the named output is available to later templates as
          <code>{"{{ .Outputs.<name>.<field> }}"}</code>.
        </p>
        <CodeBlock lang="yaml">{`stages:
  - id: validate
    label: Validate
    triggers:
      - message_contains: "[DONE]"
    on_enter:
      run:
        command: python3 scripts/check.py
        output: check
        timeout: 10m
    gate:
      output: check
      pass:
        path: status
        values: [passed, skipped]
      fail:
        path: status
        values: [failed, error]
      required: true

  - id: create_pr
    triggers:
      - gate_result:
          stage: validate
          verdict: pass
    on_enter:
      inject: |
        Validation passed with status {{ .Outputs.check.status }}.

  - id: fix
    triggers:
      - gate_result:
          stage: validate
          verdict: fail
    on_enter:
      inject: |
        Validation failed: {{ .Outputs.check.reason }}`}</CodeBlock>
        <Note>
          Gates are deterministic. They inspect command output; they do not ask
          a model to reinterpret logs.
        </Note>
      </Section>

      <Section title="Stage fields">
        <div className="space-y-3 text-sm text-zinc-400">
          <p><code className="text-cyan-300">id</code> — Unique stage identifier (kebab-case)</p>
          <p><code className="text-cyan-300">label</code> — Human-readable label shown in UI</p>
          <p><code className="text-cyan-300">entry: true</code> — Marks the initial stage when an agent is created</p>
          <p><code className="text-cyan-300">terminal: true</code> — Marks a terminal stage (the agent will be terminated)</p>
          <p><code className="text-cyan-300">triggers</code> — Conditions that transition into this stage</p>
          <p><code className="text-cyan-300">on_enter</code> — Actions to run when entering this stage</p>
          <p><code className="text-cyan-300">gate</code> — Optional deterministic pass/fail evaluation over a named run output</p>
        </div>
      </Section>

      <Section title="Triggers">
        <p>Each trigger defines a condition. Exactly one field should be set per trigger:</p>
        <div className="space-y-3 text-sm text-zinc-400 mt-2">
          <p><code className="text-cyan-300">message_contains: "[DONE]"</code> — Matches when an agent message contains this substring (case-insensitive)</p>
          <p><code className="text-cyan-300">gate_result</code> — Matches a previous gate verdict, such as <code>pass</code> or <code>fail</code></p>
          <p><code className="text-cyan-300">judge_verdict</code> — Matches a model review verdict from a judge stage</p>
          <p><code className="text-cyan-300">output_matches</code> — Matches a persisted output path against one or more expected values</p>
          <p><code className="text-cyan-300">pr_merged:</code> — Triggers when the tracked PR is merged (key presence alone activates it)</p>
          <p><code className="text-cyan-300">pr_closed:</code> — Triggers when the tracked PR is closed without merging</p>
          <p><code className="text-cyan-300">pr_conditions:</code> — Compound conditions that must all pass:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><code>ci: "passing"</code> — All check runs are success or skipped</li>
            <li><code>reviews: "clean"</code> — No CHANGES_REQUESTED reviews</li>
            <li><code>quiet_for: "1h"</code> — No new comments in the last hour</li>
          </ul>
        </div>
      </Section>

      <Section title="On-enter actions">
        <div className="space-y-3 text-sm text-zinc-400">
          <p><code className="text-cyan-300">inject</code> — Sends a user message to the agent</p>
          <p><code className="text-cyan-300">run</code> — Runs a command in the agent workspace and can persist stdout as structured output</p>
          <p><code className="text-cyan-300">dependency_updates</code> — Updates Go and npm dependencies with native tooling and persists structured output</p>
          <p><code className="text-cyan-300">judge</code> — Runs a model-backed review over bounded inputs and persists a verdict</p>
          <p><code className="text-cyan-300">move_issue</code> — Moves the associated Linear, Shortcut, or GitHub issue. It accepts a status string or <code>{"{ status, issue_id }"}</code>.</p>
          <p><code className="text-cyan-300">close_issue: true</code> — Closes the associated GitHub issue</p>
          <p><code className="text-cyan-300">add_labels</code> — Adds labels to the associated GitHub issue</p>
          <p><code className="text-cyan-300">remove_labels</code> — Removes labels from the associated GitHub issue</p>
          <p><code className="text-cyan-300">merge_pr: true</code> — Attempts to merge the tracked PR through ElasticClaw Server&apos;s GitHub PR merge path</p>
        </div>
      </Section>

      <Section title="Template variables">
        <p>
          <code>inject</code> messages and mapped <code>move_issue.issue_id</code>{" "}
          values can use Go template variables. Automatic issue-triggered
          workflows expose <code>{"{{.Issue.Identifier}}"}</code>,{" "}
          <code>{"{{.Issue.Title}}"}</code>, <code>{"{{.Issue.URL}}"}</code>, and
          <code>{"{{.Issue.Description}}"}</code>. Manual triggers expose
          <code>{"{{.Inputs.name}}"}</code> values from the workflow inputs.
        </p>
      </Section>

      <Section title="Default stages">
        <p>
          A typical issue workflow has four stages:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-sm text-zinc-400">
          <li><strong>working</strong> — The agent starts here. Injected with "read CONTEXT.md and start working."</li>
          <li><strong>pr_opened</strong> — Triggered by <code>[DONE]</code> message. Moves issue to done status.</li>
          <li><strong>merged</strong> — Triggered by PR merge. Terminal — the agent terminates.</li>
          <li><strong>closed_no_merge</strong> — Triggered by PR close without merge. Injected with guidance.</li>
        </ol>
      </Section>

      <Note>
        Stages are pushed as part of workflow YAML. Edit the workflow file,
        then run <code>elasticclaw workflow push --workspace &lt;workspace&gt; &lt;file-or-dir&gt;</code>.
      </Note>
    </DocsPage>
  );
}
