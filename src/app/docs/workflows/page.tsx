import type { Metadata } from "next";
import Link from "next/link";
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

      <Section id="deterministic-steps" title="Deterministic steps and capabilities">
        <p>
          Not every stage step needs the agent to decide. ElasticClaw Server can
          advance the workflow graph, run commands, inspect structured output,
          and call issue/PR APIs without interpreting chat. Prefer these
          hub-owned steps whenever the condition is known and testable.
        </p>
        <p className="text-sm">
          Full stage field reference lives on the{" "}
          <Link href="/docs/stages" className="text-cyan-400 hover:underline">
            Stages
          </Link>{" "}
          page. This section is a capability map of what is deterministic today.
        </p>

        <h3 className="text-base font-semibold text-white pt-2">
          Hub-owned stage triggers
        </h3>
        <p>
          These conditions transition into a stage without asking the model to
          restate what happened:
        </p>
        <div className="space-y-2 text-sm">
          <p>
            <code className="text-cyan-300">pr_merged</code> — Tracked pull
            request merges.
          </p>
          <p>
            <code className="text-cyan-300">pr_closed</code> — Tracked pull
            request closes without merge.
          </p>
          <p>
            <code className="text-cyan-300">pr_conditions</code> — Compound PR
            state. Supports <code>ci: passing</code> (checks success or skipped),{" "}
            <code>reviews: clean</code> (no changes-requested), and optional{" "}
            <code>quiet_for</code> (e.g. <code>30m</code>, <code>1h</code>) with
            no new comments in that window.
          </p>
          <p>
            <code className="text-cyan-300">gate_result</code> — Earlier stage{" "}
            <code>gate</code> verdict is <code>pass</code> or <code>fail</code>.
          </p>
          <p>
            <code className="text-cyan-300">output_matches</code> — Named pipeline
            output at a JSON path matches any value in <code>any_of</code>.
          </p>
          <p>
            <code className="text-cyan-300">judge_verdict</code> — Most recent
            judge stage reported <code>pass</code> or <code>fail</code>. The
            transition is deterministic; the verdict itself came from a model
            review.
          </p>
        </div>
        <CodeBlock lang="yaml">{`stages:
  - id: ready_to_merge
    label: Ready to merge
    triggers:
      - pr_conditions:
          ci: passing
          reviews: clean
          quiet_for: 30m
    on_enter:
      inject: |
        CI is green and reviews are clean. Merge when ready.

  - id: merged
    label: Merged
    terminal: true
    triggers:
      - pr_merged: {}
    on_enter:
      add_labels: [done]
      remove_labels: [needs-review]

  - id: closed_no_merge
    label: Closed without merge
    terminal: true
    triggers:
      - pr_closed: {}`}</CodeBlock>

        <h3 className="text-base font-semibold text-white pt-2">
          Deterministic gates over command output
        </h3>
        <p>
          After <code>on_enter</code>, a stage may evaluate a{" "}
          <code>gate</code> against JSON produced by a <code>run</code> (or
          other action that persists <code>output</code>). Gates do not ask a
          model to reinterpret logs.
        </p>
        <div className="space-y-2 text-sm">
          <p>
            <code className="text-cyan-300">run</code> — Shell command in the
            sandbox; optional <code>output</code> stores parsed JSON for later
            stages and templates (<code>{"{{ .Outputs.name.field }}"}</code>).
          </p>
          <p>
            <code className="text-cyan-300">gate</code> — Pass/fail over a named
            output path with <code>pass</code> / <code>fail</code> value lists,{" "}
            <code>required</code>, and <code>treat_skipped_as_pass</code>.
          </p>
          <p>
            <code className="text-cyan-300">gate_result</code> — Branch on that
            verdict from another stage.
          </p>
        </div>
        <CodeBlock lang="yaml">{`stages:
  - id: validation
    label: Validation
    on_enter:
      run:
        command: python3 scripts/validate.py
        output: validation
        timeout: 15m
    gate:
      output: validation
      pass:
        path: status
        values: [clean]
      fail:
        path: status
        values: [issues, error]
      required: true

  - id: create_pr
    triggers:
      - gate_result:
          stage: validation
          verdict: pass
    on_enter:
      inject: |
        Validation status: {{ .Outputs.validation.status }}. Open the PR.

  - id: fix_validation
    triggers:
      - gate_result:
          stage: validation
          verdict: fail
    on_enter:
      inject: |
        Validation failed: {{ .Outputs.validation.reason }}
        Fix, re-run checks, then continue.`}</CodeBlock>

        <h3
          id="plan-approval"
          className="text-base font-semibold text-white pt-2 scroll-mt-20"
        >
          Plan approval: freeform default vs deterministic{" "}
          <code className="text-cyan-300">plan_gate</code>
        </h3>
        <p>
          Before implementation, ElasticClaw can require a visible plan. There
          are two modes — pick one path per workflow so plans are never
          double-approved:
        </p>
        <div className="space-y-2 text-sm">
          <p>
            <strong className="text-white">Default (freeform)</strong> — If the
            workflow has no <code>plan_gate: true</code> stage, issue and
            workflow agents get a hub prompt to write a plan in chat. The hub
            accepts a substantial assistant message, then injects proceed.
            Existing installs keep this behavior without YAML changes.
          </p>
          <p>
            <strong className="text-white">
              Deterministic (<code className="text-cyan-300">plan_gate</code>)
            </strong>{" "}
            — Opt in by setting <code>plan_gate: true</code> on a stage that
            also has a <code>gate:</code> block. Freeform plan approval is{" "}
            <em>skipped entirely</em> for that pipeline. Plan acceptance is a
            normal gate over structured JSON (for example a{" "}
            <code>plan.json</code> schema check), then{" "}
            <code>gate_result</code> advances to implementation.
          </p>
        </div>
        <Note>
          Ordinary validation gates (tests, scanners, CodeBuild) without{" "}
          <code>plan_gate: true</code> do <strong>not</strong> disable freeform
          plan approval. Only an explicit plan gate opts out.
        </Note>
        <p className="text-sm">
          Recommended pattern: agent writes a plan artifact, emits a signal
          token, hub runs a schema validator, gate pass injects proceed.
        </p>
        <CodeBlock lang="yaml">{`stages:
  - id: plan
    label: Plan
    entry: true
    on_enter:
      move_issue: In Progress
      inject: |
        Issue: {{.Issue.Identifier}} — {{.Issue.Title}}
        URL: {{.Issue.URL}}

        Before implementing, write .elasticclaw/plan.json with:
          understanding  (string)
          area           (string)
          steps          (array of strings)
          verification   (string)

        Then say exactly: [PLAN_READY]
        Do not edit product code until the next stage injects proceed.

  - id: plan_validate
    label: Validate plan
    plan_gate: true          # opts out of freeform hub plan approval
    triggers:
      - message_contains: "[PLAN_READY]"
    on_enter:
      run:
        # Schema-only check — no NLP. Print JSON: {"status":"ok"|"incomplete",...}
        command: |
          python3 - <<'PY'
          import json, pathlib, sys
          p = pathlib.Path(".elasticclaw/plan.json")
          required = ("understanding", "area", "steps", "verification")
          try:
              data = json.loads(p.read_text())
          except Exception as e:
              print(json.dumps({"status": "incomplete", "reason": f"unreadable: {e}"}))
              sys.exit(0)
          missing = [k for k in required if not data.get(k)]
          if missing:
              print(json.dumps({"status": "incomplete", "reason": f"missing {missing}"}))
          elif not isinstance(data.get("steps"), list) or not data["steps"]:
              print(json.dumps({"status": "incomplete", "reason": "steps must be a non-empty list"}))
          else:
              print(json.dumps({"status": "ok"}))
          PY
        output: plan
        timeout: 2m
    gate:
      output: plan
      pass:
        path: status
        values: [ok]
      fail:
        path: status
        values: [incomplete]
      required: true

  - id: implement
    label: Implement
    triggers:
      - gate_result:
          stage: plan_validate
          verdict: pass
    on_enter:
      inject: |
        Plan accepted (status {{ .Outputs.plan.status }}).
        Implement now. When the PR is ready, say [DONE] with the PR URL.

  - id: fix_plan
    label: Fix plan
    triggers:
      - gate_result:
          stage: plan_validate
          verdict: fail
    on_enter:
      inject: |
        Plan incomplete: {{ .Outputs.plan.reason }}
        Update .elasticclaw/plan.json, then say [PLAN_READY] again.`}</CodeBlock>
        <div className="space-y-2 text-sm">
          <p>
            On <code>plan_gate</code> pass, the hub marks the plan accepted so
            freeform approval cannot re-fire if something races. Proceed is the
            implement stage&apos;s <code>inject</code> — not a keyword match on
            chat prose.
          </p>
          <p>
            Full stage field notes (including{" "}
            <code>plan_gate</code>) are on the{" "}
            <Link href="/docs/stages" className="text-cyan-400 hover:underline">
              Stages
            </Link>{" "}
            page.
          </p>
        </div>

        <h3 className="text-base font-semibold text-white pt-2">
          Hub-owned on-enter actions
        </h3>
        <p>
          These run on the server when a stage is entered (no chat marker
          required):
        </p>
        <div className="space-y-2 text-sm">
          <p>
            <code className="text-cyan-300">run</code> — Deterministic command
            execution (<code>command</code>, <code>timeout</code>,{" "}
            <code>continue_on_error</code>, <code>output</code>).
          </p>
          <p>
            <code className="text-cyan-300">dependency_updates</code> — Ecosystem
            dependency bumps with structured JSON output. See{" "}
            <Link
              href="/docs/dependency-updates"
              className="text-cyan-400 hover:underline"
            >
              Dependency updates
            </Link>
            .
          </p>
          <p>
            <code className="text-cyan-300">add_labels</code> /{" "}
            <code className="text-cyan-300">remove_labels</code> — GitHub issue
            labels.
          </p>
          <p>
            <code className="text-cyan-300">move_issue</code> — Linear, Jira,
            Shortcut, or GitHub issue status (string or{" "}
            <code>{"{ status, issue_id }"}</code>).
          </p>
          <p>
            <code className="text-cyan-300">close_issue</code> — Close the
            associated GitHub issue.
          </p>
          <p>
            <code className="text-cyan-300">merge_pr</code> — Request merge of
            the tracked PR through the server GitHub path.
          </p>
          <p>
            <code className="text-cyan-300">notify</code> — Send a message via a
            hub-configured notifier (for example Slack).
          </p>
        </div>

        <h3 className="text-base font-semibold text-white pt-2">
          Skip rules
        </h3>
        <p>
          <code>skip_if</code> and <code>skip_unless</code> jump to another
          stage before <code>on_enter</code> when issue labels match (or do not
          match). Evaluation is deterministic over tracker labels only—not
          pipeline outputs.
        </p>
        <CodeBlock lang="yaml">{`stages:
  - id: working
    entry: true
    skip_if:
      issue_labels:
        labels: [skip-agent]
      go_to: skipped
    on_enter:
      inject: Read CONTEXT.md and start working.

  - id: skipped
    terminal: true`}</CodeBlock>

        <h3 className="text-base font-semibold text-white pt-2">
          Not deterministic (agent or model)
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <code className="text-cyan-300">message_contains</code> — Matches
            agent chat text such as <code>[DONE]</code>. Convenient, but prose
            is not trusted evidence of a PR, CI result, or side effect.
          </p>
          <p>
            <code className="text-cyan-300">inject</code> — Sends instructions to
            the agent; useful, but not a proof that work completed.
          </p>
          <p>
            <code className="text-cyan-300">judge</code> — Model-backed review
            with bounded inputs. Use for subjective quality; use{" "}
            <code>gate</code> for tool JSON and <code>pr_conditions</code> for
            CI/review state.
          </p>
        </div>
        <Note>
          Prefer hub-owned triggers and gates when the next step must be
          reliable: green CI, clean reviews, merge/close, command exit JSON, or
          label policy. Keep chat markers for agent UX, not as the only proof
          that an external system changed.
        </Note>
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
    exclude_labels:
      - do-not-automate
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
          <p><code className="text-cyan-300">trigger.github_issues</code> — GitHub Issues source. Supports issue events, repositories, states, required labels, excluded labels, labelers, and assignee filters.</p>
          <p><code className="text-cyan-300">trigger.linear</code> — Linear source. Supports status-change events, states, team, projects, required labels, excluded labels, and assignee filters.</p>
          <p><code className="text-cyan-300">trigger.jira</code> — Jira source. Supports status-change events, project keys, states, required labels, excluded labels, and assignee filters.</p>
          <p><code className="text-cyan-300">trigger.shortcut</code> — Shortcut source. Supports status-change events, workspace, states, required labels, excluded labels, and assignee filters.</p>
          <p><code className="text-cyan-300">provider</code> — Sandbox provider override for agents created by this workflow.</p>
          <p><code className="text-cyan-300">tags</code> and <code className="text-cyan-300">color</code> — Dashboard metadata for created agents.</p>
          <p><code className="text-cyan-300">secret_refs</code> — Environment variable to workspace secret name map.</p>
          <p><code className="text-cyan-300">inputs</code> — Manual trigger inputs.</p>
          <p><code className="text-cyan-300">concurrency_group</code> — Limit parallel agents by group.</p>
          <p><code className="text-cyan-300">working_status</code> — Move the source issue to this status when the agent starts.</p>
          <p><code className="text-cyan-300">enable_manual_trigger</code> — Allow dashboard and CLI manual triggers.</p>
          <p><code className="text-cyan-300">analytics_enabled</code> — Enable run analytics for this workflow (defaults to true for new workflows).</p>
          <p><code className="text-cyan-300">stages</code> — Lifecycle stages used by the workflow.</p>
        </div>
      </Section>

      <Section title="Issue trigger label filters">
        <p>
          Issue-tracker triggers can require labels and reject labels at the
          same time. All configured <code>labels</code> must be present, and no
          configured <code>exclude_labels</code> may be present. Matching is
          case-insensitive and ignores leading or trailing whitespace.
        </p>
        <CodeBlock lang="yaml">{`trigger:
  github_issues:
    event: issue_labeled
    repositories:
      - my-org/my-app
    labels:
      - agent-ready
    exclude_labels:
      - do-not-automate
      - blocked`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          Use <code>exclude_labels</code> for labels such as{" "}
          <code>blocked</code>, <code>security-hold</code>, or{" "}
          <code>needs-human-review</code> that should prevent automatic agent
          creation even when the normal trigger labels are present.
        </p>
      </Section>

      <Section title="Linear and Jira project filters">
        <p>
          Linear and Jira triggers can restrict creation to specific projects.
          Use project IDs or names for Linear; use project keys for Jira.
        </p>
        <CodeBlock lang="yaml">{`trigger:
  linear:
    event: status_changed
    team: ADV
    projects:
      - Adversary Labs
      - 123e4567-e89b-12d3-a456-426614174000
    states:
      - Todo

  jira:
    event: status_changed
    projects:
      - ENG
      - OPS
    states:
      - "To Do"`}</CodeBlock>
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
        continue_on_error: false
    gate:
      output: validation
      pass:
        path: status
        values:
          - clean
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
          output followed by <code>{"{\"status\":\"clean\"}"}</code>.{" "}
          <code>treat_skipped_as_pass</code> is for missing or skipped outputs
          that should continue through <code>gate_result: pass</code>.
        </Note>
      </Section>

      <Section title="Failure feedback">
        <p>
          If a workflow-created agent stops because provisioning, bootstrap,
          workspace setup, a workflow command, a required gate, or an issue
          action fails, ElasticClaw marks the run failed and posts a sanitized
          issue-tracker comment when the workflow has issue context. The comment
          summarizes what failed and suggests the next diagnostic step without
          dumping raw logs or secrets.
        </p>
        <p className="text-sm text-zinc-400 mt-2">
          Failure comments are best-effort. If the tracker token cannot comment,
          the dashboard and run status still show the failure.
        </p>
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
        <Note>
          <code>judge_verdict</code> matches the most recent judge verdict for
          the workflow. Keep judge branches unambiguous; use deterministic gates
          when a transition must be scoped to a specific tool stage.
        </Note>
      </Section>

      <Section title="Skip rules">
        <p>
          Stages can skip based on issue labels before the stage is entered.
          Use <code>skip_if</code> to jump to another stage when the issue has any
          of the listed labels, or <code>skip_unless</code> to jump when the issue
          has none of them. The target stage is set with <code>go_to</code>.
        </p>
        <CodeBlock lang="yaml">{`stages:
  - id: working
    label: Working
    entry: true
    skip_if:
      issue_labels:
        labels:
          - skip-agent
      go_to: skipped
    on_enter:
      inject: Read CONTEXT.md and start working.

  - id: skipped
    label: Skipped
    terminal: true`}</CodeBlock>
      </Section>

      <Section title="Run history and logs">
        <p>
          Every workflow trigger (cron, manual, or issue tracker) creates a run
          record. Use the CLI to list recent runs and inspect agent logs for a
          specific run.
        </p>
        <CodeBlock lang="bash">{`elasticclaw workflow runs triage --workspace my-app --limit 20
elasticclaw workflow logs triage 5f35f8f6-7a2a-4f32-bb50-6e0cbd53c6ef --workspace my-app`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          Run records include status, trigger type, timestamps, and the linked
          agent ID. The dashboard also shows run history and agent activity logs.
        </p>
      </Section>

      <Section title="CLI commands">
        <CodeBlock lang="bash">{`elasticclaw workspace create --name my-app
elasticclaw workspace push my-app
elasticclaw workflow push --workspace my-app .elasticclaw/workflows/triage.yaml

elasticclaw workflow list --workspace my-app
elasticclaw workflow show triage --workspace my-app
elasticclaw workflow trigger triage --workspace my-app --input issue=ENG-123
elasticclaw workflow runs triage --workspace my-app --limit 20
elasticclaw workflow logs triage <run-id> --workspace my-app`}</CodeBlock>
      </Section>
    </DocsPage>
  );
}
