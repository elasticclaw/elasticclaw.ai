import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Example: Dependabot auto-merge" };

export default function DependabotExamplePage() {
  return (
    <DocsPage
      title="Auto-resolve Dependabot alerts"
      description="A workflow that bumps vulnerable packages, runs tests, and auto-merges the PR if CI passes."
    >
      <Note>
        This example uses a pipeline to stage the work: bump packages, open a
        PR, move the issue when <code>[DONE]</code> is received, and terminate
        when the PR merges. Requires a GitHub App with write access to the repo.
      </Note>

      <Section title="What it does">
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li>Watches <code>acme/app</code> for Dependabot security advisories</li>
          <li>Triggers on issues with <code>dependencies</code> + <code>security</code> labels</li>
          <li>Claw bumps the package, runs the test suite</li>
          <li>Opens a PR and sends <code>[DONE]</code> with the PR URL</li>
          <li>Watches CI and PR activity after <code>[DONE]</code></li>
          <li>If tests fail, CI failure messages are injected back to the claw for retry</li>
        </ul>
      </Section>

      <Section title="Issue tracker">
        <CodeBlock lang="text">{`Settings -> Workspaces -> dependabot-workspace -> Issue Trackers
Add GitHub Issues:
  workspace: acme/app
  token: \${GITHUB_TOKEN}
  webhook secret: \${GITHUB_WEBHOOK_SECRET}`}</CodeBlock>
      </Section>

      <Section title="Workflow: dependabot-fix">
        <CodeBlock lang="yaml">{`# .elasticclaw/workflows/dependabot-fix.yaml
schema_version: v1
name: dependabot-fix

trigger:
  type: github_issues
  event: issue_labeled
  repositories:
    - acme/app
  states:
    - open
  labels:
    - dependencies
    - security

name_pattern: "dep-{{.Issue.Number}}"
tags: [dependabot, security]
color: orange

jobs:
  - id: working
    label: "Working"
    entry: true
    on_enter:
      inject: |
        Read CONTEXT.md, update the vulnerable dependency, run the tests,
        open a PR, and send [DONE] https://github.com/org/repo/pull/N.

  - id: pr_opened
    label: "PR Opened"
    triggers:
      - message_contains: "[DONE]"
    on_enter:
      move_issue: "closed"
      inject: |
        PR recorded. Watch CI and review feedback.

  - id: merged
    label: "Merged"
    triggers:
      - pr_merged:
    terminal: true`}</CodeBlock>
      </Section>

      <Section title="Pipeline behavior">
        <p className="text-sm text-zinc-400 mt-2">
          The hub records PR URLs from the <code>[DONE]</code> message and can
          inject CI or review feedback while the claw remains alive.
        </p>
      </Section>

      <Section title="Workspace: dependabot-workspace">
        <p className="text-sm text-zinc-400 mb-2">
          A lightweight workspace focused on dependency management and test
          validation.
        </p>
        <CodeBlock lang="yaml">{`# .elasticclaw/workspaces/dependabot-workspace/elasticclaw-config.yaml
name: dependabot-workspace
provider: daytona
llm_key: anthropic-prod
default_model: anthropic/claude-sonnet-4-6
repositories:
  - repo: acme/app
    permissions: write
tags: [dependabot, security]
color: orange`}</CodeBlock>

        <CodeBlock lang="markdown">{`# .elasticclaw/workspaces/dependabot-workspace/AGENTS.md
You are a security patch agent. Read CONTEXT.md, bump the vulnerable
package to the minimum safe version, run the test suite, and open a PR.
Do not change unrelated code. Send [DONE] <pr-url> when the PR is ready.`}</CodeBlock>
      </Section>

      <Section title="Retry loop on failure">
        <p className="text-sm text-zinc-400">
          If CI fails after the claw sends <code>[DONE]</code>, the hub:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-sm text-zinc-400 mt-2">
          <li>Injects the failed check output as a user message</li>
          <li>The claw sees the failure and can push a fix commit</li>
          <li>CI re-runs, hub watches again</li>
          <li>Repeat until CI passes or the claw gives up</li>
        </ol>
        <p className="text-sm text-zinc-400 mt-2">
          The PR watcher behavior is tied to the workflow PR lifecycle, not an
          <code>elasticclaw-config.yaml</code> field.
        </p>
      </Section>
    </DocsPage>
  );
}
