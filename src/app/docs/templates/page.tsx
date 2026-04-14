import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Templates" };

export default function TemplatesPage() {
  return (
    <DocsPage
      title="Templates"
      description="Agent templates define what runs inside the VM — dependencies, repos, services, and the agent's bootstrap behavior."
    >
      <Section title="Template Directory Structure">
        <p>
          A template is a directory registered in <code className="text-cyan-300">hub.yaml</code>.
          It contains at minimum an <code className="text-cyan-300">elasticclaw-config.yaml</code>.
        </p>
        <CodeBlock lang="text">{`templates/
  my-template/
    elasticclaw-config.yaml   # required — bootstrap spec
    bootstrap.sh              # optional — custom bootstrap script
    files/                    # optional — files copied into the VM
      .env.example
      config.toml`}</CodeBlock>
      </Section>

      <Section title="elasticclaw-config.yaml">
        <p>
          This file defines how the VM is bootstrapped when an agent is created.
        </p>
        <CodeBlock lang="yaml">{`version: "1"
name: my-template
description: "General purpose dev agent"

vm:
  instance_type: r1.small
  os: ubuntu-22.04
  disk_gb: 20

bootstrap:
  env:
    NODE_ENV: development
    REPO_URL: \${GITHUB_REPO_URL}
  steps:
    - name: Install system deps
      run: |
        apt-get update -q
        apt-get install -y git curl build-essential

    - name: Install Node.js
      run: |
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
        npm install -g pnpm

    - name: Clone repo
      run: |
        git clone \${REPO_URL} /workspace
        cd /workspace && pnpm install

    - name: Copy files
      copy:
        - src: files/.env.example
          dest: /workspace/.env

agent:
  model: gpt-4o
  system_prompt: |
    You are a software engineering agent. You have access to a full
    development environment. Work methodically, test your changes,
    and communicate clearly about what you're doing.
  tools:
    - shell
    - file_read
    - file_write
    - git
`}</CodeBlock>
      </Section>

      <Section title="Bootstrap Steps">
        <p>Each step under <code className="text-cyan-300">bootstrap.steps</code> runs in order. Available keys:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><code className="text-cyan-300">name</code> — display name for the step</li>
          <li><code className="text-cyan-300">run</code> — shell commands to execute</li>
          <li><code className="text-cyan-300">copy</code> — copy files from template into the VM</li>
          <li><code className="text-cyan-300">env</code> — environment variables for this step</li>
        </ul>
      </Section>

      <Note>
        Bootstrap runs as root inside the VM. The workspace is typically
        mounted at <code>/workspace</code>.
      </Note>
    </DocsPage>
  );
}
