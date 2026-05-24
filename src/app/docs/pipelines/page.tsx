import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Pipelines" };

export default function PipelinesPage() {
  return (
    <DocsPage
      title="Pipelines"
      description="Workflow pipelines define the lifecycle of a workflow-created claw: entry instructions, done signals, issue transitions, PR events, and terminal stages."
    >
      <Section title="What is a pipeline?">
        <p>
          A pipeline is a state machine that drives a workflow-created claw through its lifecycle.
          Each stage has entry conditions, actions, and transitions. The hub is the state machine —
          it injects instructions into the claw as messages at each stage transition.
        </p>
        <p>
          In the current workflow schema, pipeline stages are authored as{" "}
          <code className="text-cyan-300">jobs</code> inside the workflow YAML.
          Older workflow configs may still expose generated pipeline YAML through
          the API, but new configs should use <code>jobs</code>.
        </p>
      </Section>

      <Section title="Pipeline structure">
        <CodeBlock lang="yaml">{`jobs:
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

      <Section title="Job fields">
        <div className="space-y-3 text-sm text-zinc-400">
          <p><code className="text-cyan-300">id</code> — Unique stage identifier (kebab-case)</p>
          <p><code className="text-cyan-300">label</code> — Human-readable label shown in UI</p>
          <p><code className="text-cyan-300">entry: true</code> — Marks the initial stage when a claw is created</p>
          <p><code className="text-cyan-300">terminal: true</code> — Marks a terminal stage (claw will be terminated)</p>
          <p><code className="text-cyan-300">triggers</code> — Conditions that transition into this stage</p>
          <p><code className="text-cyan-300">on_enter</code> — Actions to run when entering this stage</p>
        </div>
      </Section>

      <Section title="Triggers">
        <p>Each trigger defines a condition. Exactly one field should be set per trigger:</p>
        <div className="space-y-3 text-sm text-zinc-400 mt-2">
          <p><code className="text-cyan-300">message_contains: "[DONE]"</code> — Matches when a claw message contains this substring (case-insensitive)</p>
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
          <p><code className="text-cyan-300">inject</code> — Sends a user message to the claw</p>
          <p><code className="text-cyan-300">move_issue</code> — Moves the associated Linear, Shortcut, or GitHub issue. It accepts a status string or <code>{"{ status, issue_id }"}</code>.</p>
          <p><code className="text-cyan-300">close_issue: true</code> — Closes the associated GitHub issue</p>
          <p><code className="text-cyan-300">add_labels</code> — Adds labels to the associated GitHub issue</p>
          <p><code className="text-cyan-300">remove_labels</code> — Removes labels from the associated GitHub issue</p>
          <p><code className="text-cyan-300">merge_pr: true</code> — Attempts to merge the tracked PR through the hub&apos;s GitHub PR merge path</p>
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

      <Section title="Default pipeline">
        <p>
          A typical issue workflow has four jobs:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-sm text-zinc-400">
          <li><strong>working</strong> — Claw starts here. Injected with "read CONTEXT.md and start working."</li>
          <li><strong>pr_opened</strong> — Triggered by <code>[DONE]</code> message. Moves issue to done status.</li>
          <li><strong>merged</strong> — Triggered by PR merge. Terminal — claw terminates.</li>
          <li><strong>closed_no_merge</strong> — Triggered by PR close without merge. Injected with guidance.</li>
        </ol>
      </Section>

      <Note>
        Pipeline jobs are pushed as part of workflow YAML. Edit the workflow file,
        then run <code>elasticclaw workflow push --workspace &lt;workspace&gt; &lt;file-or-dir&gt;</code>.
      </Note>
    </DocsPage>
  );
}
