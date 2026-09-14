import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Workspaces" };

export default function WorkspacesPage() {
  return (
    <DocsPage
      title="Workspaces"
      description="Workspaces define the runtime environment, files, repository access, and environment variables used by workflows."
    >
      <Section title="Create a workspace">
        <p>
          A workspace is the runtime environment for workflow-created agents. It
          starts with an <code className="text-cyan-300">elasticclaw-config.yaml</code>
          file plus instruction files such as <code>AGENTS.md</code> and{" "}
          <code>TOOLS.md</code>. Create one locally, edit the generated files,
          then push it to ElasticClaw Server.
        </p>
        <CodeBlock lang="bash">{`elasticclaw workspace create --name my-app
cd .elasticclaw/workspaces/my-app`}</CodeBlock>
      </Section>

      <Section title="elasticclaw-config.yaml">
        <CodeBlock lang="yaml">{`schema_version: v1
name: my-app

repositories:
  - repo: my-org/my-app
    permissions: write

env:
  NODE_ENV: development
  GITHUB_TOKEN:
    secret: github_app

provider: replicated`}</CodeBlock>
      </Section>

      <Section title="Workspace fields">
        <div className="space-y-3 text-sm text-zinc-400">
          <p><code className="text-cyan-300">schema_version</code> — Optional schema marker; defaults to <code>v1</code>.</p>
          <p><code className="text-cyan-300">name</code> — Workspace identifier.</p>
          <p><code className="text-cyan-300">repositories</code> — GitHub repositories the workspace can access, with <code>read</code> or <code>write</code> permissions. Supports glob patterns such as <code>owner/*</code> or <code>*-infra-*</code> when a GitHub App is configured.</p>
          <p><code className="text-cyan-300">env</code> — Inline environment values or <code>{"{ secret: name }"}</code> references resolved from workspace or server secrets.</p>
          <p><code className="text-cyan-300">provider</code> — Optional sandbox provider override for agents created from this workspace.</p>
          <p><code className="text-cyan-300">llm_key</code> and <code className="text-cyan-300">default_model</code> — Optional model key and model override.</p>
          <p><code className="text-cyan-300">nix</code> and <code className="text-cyan-300">docker</code> — Optional runtime setup flags.</p>
          <p><code className="text-cyan-300">tags</code> and <code className="text-cyan-300">color</code> — Optional dashboard metadata for agents created from this workspace.</p>
        </div>
      </Section>

      <Section id="workspace-v2-schema" title="Workspace v2 schema">
        <p>
          <code className="text-cyan-300">schema_version: 2</code> is a strict,
          typed replacement for the v1 workspace format. It separates authority
          (repositories, credentials, source-control and CI connections) from
          workflow behavior, and it references secrets by name instead of
          embedding values.
        </p>
        <CodeBlock lang="yaml">{`schema_version: 2
name: engineering

repositories:
  primary:
    provider: github
    repository: elasticclaw/elasticclaw
    permissions: write
    source_control: github-production

execution:
  provider: daytona
  nix: true
  docker: true
  tools:
    - git
    - gh

credentials:
  github_app:
    secret: GITHUB_APP_PRIVATE_KEY
  depot_token:
    secret: DEPOT_TOKEN
  linear_api_key:
    secret: LINEAR_API_KEY

source_control:
  connections:
    github-production:
      provider: github
      credentials: github_app

ci:
  connections:
    github-actions:
      provider: github_actions
      source_control: github-production
      credentials: github_app
      capability_restrictions:
        trigger_run: false
        cancel_run: false
    depot:
      provider: depot
      credentials: depot_token
  pipelines:
    github-pr:
      connection: github-actions
      repository: primary
      workflow: ci.yml
    depot-container:
      connection: depot
      repository: primary
      project: elasticclaw
      pipeline: container-build

issue_trackers:
  connections:
    product-linear:
      provider: linear
      credentials: linear_api_key

review_systems:
  connections:
    github-reviews:
      provider: github
      source_control: github-production

knowledge:
  sources:
    engineering-principles:
      type: workspace_files
      scope: organization
      required: true
      paths: [ENGINEERING.md, PRODUCT.md]
    repository-instructions:
      type: repository_files
      scope: repository
      required: true
      paths: [AGENTS.md]`}</CodeBlock>

        <h3 className="text-base font-semibold text-white pt-2">
          Referencing secrets
        </h3>
        <p>
          v2 workspaces never embed secret values. Create the secret on the
          server, then reference it by name in the workspace YAML.
        </p>
        <CodeBlock lang="bash">{`elasticclaw secret create GITHUB_APP_PRIVATE_KEY --workspace engineering \
  --value "$GITHUB_APP_PRIVATE_KEY"

# Reference the secret inside elasticclaw-config.yaml
credentials:
  github_app:
    secret: GITHUB_APP_PRIVATE_KEY`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          The <code>credentials.*.secret</code> value is only the secret{" "}
          <em>name</em>. The server resolves the actual value when the workspace
          is assembled. Multi-line PEM blocks, token strings, or any other secret
          material in the YAML are rejected by validation.
        </p>

        <h3 className="text-base font-semibold text-white pt-2">
          Workspace v2 fields
        </h3>
        <div className="space-y-3 text-sm text-zinc-400">
          <p>
            <code className="text-cyan-300">schema_version</code> — Use{" "}
            <code>2</code> or <code>v2</code>. Unknown top-level keys are
            rejected.
          </p>
          <p>
            <code className="text-cyan-300">repositories</code> — Named map of
            repositories. Each entry sets <code>provider</code>,{" "}
            <code>repository</code> (owner/repo), <code>permissions</code>{" "}
            (<code>read</code> or <code>write</code>), optional{" "}
            <code>source_control</code> connection, and optional{" "}
            <code>checkout</code> (<code>ref</code>, <code>depth</code>).
          </p>
          <p>
            <code className="text-cyan-300">execution</code> — Sandbox provider
            and capability restrictions. <code>provider</code> names the
            provider; <code>nix</code>/<code>docker</code> enable runtime setup;{" "}
            <code>tools</code> lists required tooling. Use{" "}
            <code>capability_restrictions</code> to narrow provider
            capabilities, for example disabling <code>execute_command</code>{" "}
            or <code>dependency_update</code>.
          </p>
          <p>
            <code className="text-cyan-300">credentials</code> — Named map of
            secret references. Each value uses <code>secret: NAME</code> where{" "}
            <code>NAME</code> is a secret stored on the server. Never paste the
            secret value into the YAML.
          </p>
          <p>
            <code className="text-cyan-300">source_control</code> — Named
            source-control connections (for example <code>github</code>) linked
            to credentials.
          </p>
          <p>
            <code className="text-cyan-300">ci</code> — CI connections (GitHub
            Actions, Depot, Jenkins) and named pipelines that reference those
            connections and workspace repositories.
          </p>
          <p>
            <code className="text-cyan-300">issue_trackers</code> and{" "}
            <code className="text-cyan-300">review_systems</code> — Named
            connections for issue trackers (for example <code>linear</code>)
            and review systems (for example <code>github</code>,{" "}
            <code>greptile</code>).
          </p>
          <p>
            <code className="text-cyan-300">knowledge</code> — Sources used for
            context bundles: <code>workspace_files</code>,{" "}
            <code>repository_files</code>, or <code>retrieval</code>. Paths must
            be relative and must not contain <code>..</code>.
          </p>
        </div>
        <Note>
          Repository names, connection names, and credential names must match{" "}
          <code>^[A-Za-z0-9][A-Za-z0-9_.-]*$</code>. Set{" "}
          <code>permissions: write</code> on repositories that will receive
          branches or pull requests from effects such as{" "}
          <code>dependency.update</code>.
        </Note>
      </Section>

      <Section title="Push a workspace">
        <p>
          Pushing a workspace publishes <code>elasticclaw-config.yaml</code>{" "}
          and workspace files. Push workflow YAML separately into the
          workspace.
        </p>
        <CodeBlock lang="bash">{`elasticclaw workspace create --name my-app
elasticclaw workspace push my-app
elasticclaw workspace push my-app --path ./custom/my-app
elasticclaw workflow push --workspace my-app .elasticclaw/workflows
elasticclaw workspace list
elasticclaw workspace show my-app
elasticclaw workspace rm my-app`}</CodeBlock>
      </Section>

      <Section title="Workspace scripts">
        <p>
          Workspace scripts are copied into each agent workspace under{" "}
          <code>scripts/</code>. Use them for deterministic workflow steps such
          as tests, scanners, deploy-preview checks, or build gates.
        </p>
        <CodeBlock lang="text">{`.elasticclaw/workspaces/my-app/
|-- elasticclaw-config.yaml
|-- AGENTS.md
|-- TOOLS.md
\`-- scripts/
    |-- validate.py
    \`-- checks/
        \`-- security.py`}</CodeBlock>
        <CodeBlock lang="python">{`# scripts/validate.py
import json

print("running validation...")
print(json.dumps({
    "status": "clean",
    "reason": "No issues found",
}))`}</CodeBlock>
        <CodeBlock lang="yaml">{`stages:
  - id: validation
    triggers:
      - message_contains: "[DONE]"
    on_enter:
      run:
        command: python3 scripts/validate.py
        output: validation
    gate:
      output: validation
      pass:
        path: status
        values: [clean]`}</CodeBlock>
        <Note>
          <code>elasticclaw workspace push</code> includes files under{" "}
          <code>scripts/</code> recursively. Hidden script files and hidden
          script directories are skipped.
        </Note>
      </Section>

      <Section title="Workspace flake devShell">
        <p>
          When a workspace includes <code>flake.nix</code>, deterministic workflow
          run commands and dependency updates execute inside the workspace
          devShell. This ensures declared tools are available without the agent
          having to install them manually.
        </p>
        <CodeBlock lang="text">{`.elasticclaw/workspaces/my-app/
|-- flake.nix
|-- flake.lock
|-- elasticclaw-config.yaml
|-- AGENTS.md
\`-- scripts/
    \`-- validate.py`}</CodeBlock>
        <Note>
          Push <code>flake.nix</code> and <code>flake.lock</code> with the
          workspace. The server stages both files after syncing the workspace so
          the flake is available for run actions.
        </Note>
      </Section>

      <Note>
        Workflows belong to exactly one workspace on ElasticClaw Server. Put shared runtime
        policy in the workspace and event-specific behavior in each workflow file.
      </Note>
    </DocsPage>
  );
}
