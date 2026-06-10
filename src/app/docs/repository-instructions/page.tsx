import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Repository Instructions" };

export default function RepositoryInstructionsPage() {
  return (
    <DocsPage
      title="Repository Instructions"
      description="ElasticClaw detects repository-owned agent instruction files after cloning workspace repositories and makes them visible to the agent."
    >
      <Section title="How it works">
        <p>
          Workspaces can define general agent guidance in their own{" "}
          <code>AGENTS.md</code>. Repositories can also own instructions in
          their root directory. During bootstrap, ElasticClaw scans cloned
          workspace repositories for supported instruction files and writes a
          generated index named <code>REPO_INSTRUCTIONS.md</code>.
        </p>
        <p>
          The generated index references repository-owned files instead of
          copying their contents. This keeps repository policy in the repository
          and avoids overwriting files maintained by the project.
        </p>
      </Section>

      <Section title="Supported files">
        <p>
          ElasticClaw currently detects these files at the root of each cloned
          repository:
        </p>
        <div className="space-y-3 text-sm text-zinc-400">
          <p>
            <code className="text-cyan-300">AGENTS.md</code> - General agent
            instructions.
          </p>
          <p>
            <code className="text-cyan-300">CLAUDE.md</code> - Claude-oriented
            project instructions.
          </p>
          <p>
            <code className="text-cyan-300">GEMINI.md</code> - Gemini-oriented
            project instructions.
          </p>
        </div>
        <CodeBlock lang="text">{`workspace/
|-- AGENTS.md
|-- REPO_INSTRUCTIONS.md
\\-- my-app/
    |-- AGENTS.md
    |-- CLAUDE.md
    \\-- package.json`}</CodeBlock>
      </Section>

      <Section title="Generated index">
        <p>
          When one or more supported files are found, ElasticClaw creates{" "}
          <code>REPO_INSTRUCTIONS.md</code> in the workspace root. The file
          lists each repository and the instruction files that apply inside it.
        </p>
        <CodeBlock lang="markdown">{`# Repository Instructions

ElasticClaw detected repository-owned agent instruction files. Read the relevant files before making changes in that repository.

## my-app

- \`my-app/AGENTS.md\`
- \`my-app/CLAUDE.md\``}</CodeBlock>
        <Note>
          If no supported instruction files are found, ElasticClaw removes any
          stale generated <code>REPO_INSTRUCTIONS.md</code> from the workspace.
        </Note>
      </Section>

      <Section title="Workspace AGENTS.md reference">
        <p>
          ElasticClaw also ensures the workspace-level <code>AGENTS.md</code>{" "}
          points agents to the generated index. If the workspace already has an{" "}
          <code>AGENTS.md</code>, ElasticClaw appends the repository instruction
          section once. It does not overwrite existing workspace instructions.
        </p>
        <CodeBlock lang="markdown">{`## Repository Instructions

If \`REPO_INSTRUCTIONS.md\` exists, read it before working inside any cloned repository. It lists repository-owned instruction files such as \`AGENTS.md\`, \`CLAUDE.md\`, and \`GEMINI.md\`.`}</CodeBlock>
      </Section>

      <Section title="Repository setup">
        <p>
          Put repository-specific rules in the repository root when they should
          travel with that codebase. Use workspace instructions for shared
          runtime policy, tool usage, and organization-wide preferences.
        </p>
        <CodeBlock lang="markdown">{`# my-app/AGENTS.md

Before changing code in this repository:

- Run npm test before opening a PR.
- Keep database migrations backward compatible.
- Do not edit generated files under src/generated/.
- Prefer existing service helpers over new HTTP clients.`}</CodeBlock>
        <CodeBlock lang="yaml">{`# .elasticclaw/workspaces/product/elasticclaw-config.yaml
schema_version: v1
name: product

repositories:
  - repo: acme/my-app
    permissions: write
  - repo: acme/shared-lib
    permissions: read

provider: daytona`}</CodeBlock>
      </Section>

      <Section title="Bootstrap timing">
        <p>
          For managed providers, ElasticClaw waits until bootstrap has cloned
          repositories, configured credentials, discovered repository
          instructions, and marked the environment ready before waking the
          agent. This avoids the agent starting work before instruction files
          are available.
        </p>
        <div className="space-y-3 text-sm text-zinc-400">
          <p>
            <code className="text-cyan-300">daytona</code>,{" "}
            <code className="text-cyan-300">replicated</code>, and{" "}
            <code className="text-cyan-300">exedev</code> wait for bootstrap
            readiness before initial wake-up.
          </p>
          <p>
            Other providers preserve existing wake behavior and can start as
            soon as the agent connection is ready.
          </p>
        </div>
      </Section>

      <Section title="Failure behavior">
        <p>
          Repository instruction discovery is best-effort. If discovery fails
          after repositories are cloned, ElasticClaw logs a warning and lets the
          agent continue. The repository files are still present; only the
          generated index may be missing.
        </p>
        <Note>
          Keep root instruction files small and direct. Use them to point to
          longer project docs when needed, but put the critical agent rules in
          the root file.
        </Note>
      </Section>
    </DocsPage>
  );
}
