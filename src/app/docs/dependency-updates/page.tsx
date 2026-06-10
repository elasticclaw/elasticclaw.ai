import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Dependency Updates" };

export default function DependencyUpdatesPage() {
  return (
    <DocsPage
      title="Dependency Updates"
      description="Use the built-in dependency update action to update Go and npm dependencies from a workflow stage and persist structured output for later stages."
    >
      <Section title="What it does">
        <p>
          The <code>dependency_updates</code> on-enter action discovers supported
          dependency manifests in the agent workspace, runs ecosystem-native
          package manager commands, and stores structured JSON output as a
          pipeline output.
        </p>
        <p>
          The action updates files in the working tree only. It does not run
          tests, commit changes, or open a PR. Use later workflow stages to
          validate, fix, commit, and create the PR.
        </p>
      </Section>

      <Section title="Basic stage">
        <CodeBlock lang="yaml">{`stages:
  - id: update_dependencies
    label: Update Dependencies
    entry: true
    on_enter:
      dependency_updates:
        ecosystems: [go, npm]
        paths: ["."]
        output: dependency_updates
        timeout: 30m
      inject: |
        Dependency updates were applied.

        Review {{ .Outputs.dependency_updates.files_changed }}.
        Run the test suite, fix any failures, and open one grouped PR.
        Say [DONE] when the PR is open or no changes are needed.`}</CodeBlock>
        <Note>
          The default output name is <code>dependency_updates</code>, so later
          stage templates can reference values with{" "}
          <code>{"{{ .Outputs.dependency_updates.<field> }}"}</code>.
        </Note>
      </Section>

      <Section title="Supported ecosystems">
        <div className="space-y-3 text-sm text-zinc-400">
          <p>
            <code className="text-cyan-300">go</code> - Detects{" "}
            <code>go.mod</code> and <code>go.sum</code>. Runs{" "}
            <code>go list -m -u -json all</code>, applies selected updates with{" "}
            <code>go get module@version</code>, and runs <code>go mod tidy</code>
            when updates are applied.
          </p>
          <p>
            <code className="text-cyan-300">npm</code> - Detects{" "}
            <code>package.json</code> with <code>package-lock.json</code> or{" "}
            <code>npm-shrinkwrap.json</code>. Runs{" "}
            <code>npm outdated --json</code> and{" "}
            <code>npm update --package-lock-only package</code> for selected
            updates.
          </p>
        </div>
      </Section>

      <Section title="Configuration">
        <CodeBlock lang="yaml">{`on_enter:
  dependency_updates:
    ecosystems:
      - go
      - npm
    paths:
      - "."
    grouping: all
    include_major: false
    separate_major: true
    separate_security: true
    separate_runtime: true
    allow:
      - "*"
    ignore:
      - "example-package"
    output: dependency_updates
    timeout: 30m
    continue_on_error: false`}</CodeBlock>
        <div className="space-y-3 text-sm text-zinc-400">
          <p>
            <code className="text-cyan-300">ecosystems</code> - List of package
            ecosystems to update. Defaults to <code>auto</code>, which currently
            enables Go and npm.
          </p>
          <p>
            <code className="text-cyan-300">paths</code> - Workspace-relative
            paths to scan. Defaults to <code>.</code>.
          </p>
          <p>
            <code className="text-cyan-300">grouping</code> - Metadata for later
            PR stages. The first implementation emits grouped update metadata
            with <code>all</code> as the default.
          </p>
          <p>
            <code className="text-cyan-300">include_major</code> - Defaults to
            false. Major updates are reported as skipped instead of being
            applied.
          </p>
          <p>
            <code className="text-cyan-300">separate_major</code>,{" "}
            <code className="text-cyan-300">separate_security</code>, and{" "}
            <code className="text-cyan-300">separate_runtime</code> - Metadata
            controls for later PR grouping stages. All three default to true;
            the dependency update action records grouping metadata, and later
            stages decide how to split or combine PRs.
          </p>
          <p>
            <code className="text-cyan-300">allow</code> and{" "}
            <code className="text-cyan-300">ignore</code> - Glob-style package
            filters. Defaults to allowing all packages.
          </p>
          <p>
            <code className="text-cyan-300">output</code> - Pipeline output
            name. Defaults to <code>dependency_updates</code>.
          </p>
          <p>
            <code className="text-cyan-300">timeout</code> - Go-style duration.
            Defaults to <code>30m</code>.
          </p>
        </div>
      </Section>

      <Section title="Structured output">
        <p>
          The action writes JSON to stdout and ElasticClaw persists it as a
          pipeline output.
        </p>
        <CodeBlock lang="json">{`{
  "ecosystems": ["go", "npm"],
  "manifests": [
    {
      "ecosystem": "go",
      "path": "go.mod",
      "lockfiles": ["go.sum"]
    },
    {
      "ecosystem": "npm",
      "path": "web/package.json",
      "lockfiles": ["web/package-lock.json"]
    }
  ],
  "updates": [
    {
      "ecosystem": "go",
      "name": "github.com/example/module",
      "from": "v1.2.3",
      "to": "v1.3.0",
      "type": "minor",
      "applied": true,
      "group": "default"
    },
    {
      "ecosystem": "npm",
      "name": "example-package",
      "from": "2.4.0",
      "to": "3.0.0",
      "type": "major",
      "applied": false,
      "group": "major",
      "skipped_reason": "major updates disabled"
    }
  ],
  "commands": [
    {
      "command": "npm outdated --json",
      "cwd": "web",
      "exit_code": 1
    }
  ],
  "files_changed": [
    "go.mod",
    "go.sum",
    "web/package-lock.json"
  ]
}`}</CodeBlock>
      </Section>

      <Section title="Cron workflow example">
        <CodeBlock lang="yaml">{`schema_version: v1
name: dependency-maintenance
enabled: true

trigger:
  cron:
    schedule: "0 9 * * 1"
    timezone: "America/Chicago"
    overlap_policy: skip

provider: daytona
tags: ["dependencies"]

stages:
  - id: update_dependencies
    label: Update Dependencies
    entry: true
    on_enter:
      dependency_updates:
        ecosystems: [go, npm]
        include_major: false
        output: dependency_updates
      inject: |
        Dependency update metadata:
        {{ .Outputs.dependency_updates.files_changed }}

        Run tests. If tests pass and files changed, open one grouped PR.
        If tests fail, fix the failures or explain why the update should be skipped.
        Say [DONE] when finished.

  - id: complete
    label: Complete
    triggers:
      - message_contains: "[DONE]"
    terminal: true`}</CodeBlock>
      </Section>

      <Section title="Failure behavior">
        <p>
          The stage fails when required package manager tooling is missing or a
          native command exits with an unexpected non-zero status. The partial
          JSON output still includes commands that ran and any manifests found
          before failure when possible.
        </p>
        <Note>
          Set <code>continue_on_error: true</code> when you want the agent to
          inspect partial output and try to recover in the same stage.
        </Note>
      </Section>
    </DocsPage>
  );
}
