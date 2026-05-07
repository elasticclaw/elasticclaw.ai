import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Example: Dependabot auto-merge" };

export default function DependabotExamplePage() {
  return (
    <DocsPage
      title="Auto-resolve Dependabot alerts"
      description="A factory that bumps vulnerable packages, runs tests, and auto-merges the PR if CI passes."
    >
      <Note>
        This example uses a pipeline to stage the work: bump → test → open PR
        → watch CI → auto-merge → close issue. Requires a GitHub App with
        <code>contents:write</code> and <code>pull_requests:write</code> scopes.
      </Note>

      <Section title="What it does">
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li>Watches <code>acme/app</code> for Dependabot security advisories</li>
          <li>Triggers on issues with <code>dependencies</code> + <code>security</code> labels</li>
          <li>Claw bumps the package, runs the test suite</li>
          <li>Opens a PR with auto-merge enabled</li>
          <li>Watches CI — if tests pass, PR merges and issue closes</li>
          <li>If tests fail, CI failure messages are injected back to the claw for retry</li>
        </ul>
      </Section>

      <Section title="hub.yaml">
        <CodeBlock lang="yaml">{`integrations:
  github_issues:
    - workspace: acme/app
      token: \${GITHUB_TOKEN}
      webhook_secret: \${GITHUB_WEBHOOK_SECRET}

factories:
  - name: dependabot-fix
    integration: github-issues
    workspace: acme/app
    trigger_status: "open"
    labels: [dependencies, security]
    done_status: "closed"
    terminate_on_leave: true
    template: dependabot-template
    webhook_secret_ref: github_webhook_secret
    name_pattern: "dep-{issue_number}"
    tags: [dependabot, security]
    color: orange

secrets:
  github_webhook_secret: whsec_xxx`}</CodeBlock>
      </Section>

      <Section title="Pipeline: staged auto-merge">
        <p className="text-sm text-zinc-400 mb-2">
          The pipeline breaks the work into stages with gates. Each stage can
          run actions on enter and on done.
        </p>
        <CodeBlock lang="yaml">{`# .elasticclaw/factories/dependabot-fix/pipeline.yaml
stages:
  - name: bump
    on_enter:
      - action: run_tests
    on_done:
      - action: open_pr
        auto_merge: true   # enable auto-merge on the PR

  - name: verify
    on_enter:
      - action: watch_ci
    on_done:
      - action: close_issue`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          <code>auto_merge: true</code> tells the hub to enable GitHub
          auto-merge on the PR. If all required checks pass, the PR merges
          without human intervention. If checks fail, the claw receives the
          failure output as an injected message and can retry.
        </p>
      </Section>

      <Section title="Template: dependabot-template">
        <p className="text-sm text-zinc-400 mb-2">
          A lightweight template focused on dependency management and test
          validation.
        </p>
        <CodeBlock lang="yaml">{`# elasticclaw-config.yaml
provider: daytona
instance_type: r1.small
llm_key: anthropic-prod

default_model: anthropic/claude-sonnet-4-6

bootstrap:
  steps:
    - name: Setup
      run: |
        git clone \${REPO_URL} /workspace
        cd /workspace && npm ci
    - name: Preflight
      run: cd /workspace && npm audit --audit-level=moderate

files:
  AGENTS.md: |
    You are a security patch agent. Read the Dependabot advisory, bump
    the vulnerable package to the minimum safe version, run the test
    suite, and open a PR. Do not change unrelated code.
    Send [DONE] &lt;pr-url&gt; when the PR is ready.`}</CodeBlock>
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
          Disable this behavior per-template with{" "}
          <code>auto_watch_ci: false</code> in{" "}
          <code>elasticclaw-config.yaml</code>.
        </p>
      </Section>
    </DocsPage>
  );
}
