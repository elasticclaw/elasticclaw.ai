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
          <p><code className="text-cyan-300">repositories</code> — GitHub repositories the workspace can access, with <code>read</code> or <code>write</code> permissions.</p>
          <p><code className="text-cyan-300">env</code> — Inline environment values or <code>{"{ secret: name }"}</code> references resolved from workspace or server secrets.</p>
          <p><code className="text-cyan-300">provider</code> — Optional sandbox provider override for agents created from this workspace.</p>
          <p><code className="text-cyan-300">llm_key</code> and <code className="text-cyan-300">default_model</code> — Optional model key and model override.</p>
          <p><code className="text-cyan-300">nix</code> and <code className="text-cyan-300">docker</code> — Optional runtime setup flags.</p>
          <p><code className="text-cyan-300">tags</code> and <code className="text-cyan-300">color</code> — Optional dashboard metadata for agents created from this workspace.</p>
        </div>
      </Section>

      <Section title="Push a workspace">
        <p>
          Pushing a workspace publishes <code>elasticclaw-config.yaml</code> and
          workspace files. Push workflow YAML separately into the workspace.
        </p>
        <CodeBlock lang="bash">{`elasticclaw workspace create --name my-app
elasticclaw workspace push my-app
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

      <Note>
        Workflows belong to exactly one workspace on ElasticClaw Server. Put shared runtime
        policy in the workspace and event-specific behavior in each workflow file.
      </Note>
    </DocsPage>
  );
}
