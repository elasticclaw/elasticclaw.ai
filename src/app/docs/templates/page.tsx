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

# VM resources
provider: daytona                    # override hub default provider
instance_type: r1.small
image: ubuntu-22.04
ttl: 24h

# Model and LLM key
llm_key: anthropic-prod             # named key from hub.yaml
default_model: anthropic/claude-sonnet-4-6

# Bootstrap
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

# Agent behavior
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

# Template features
nix: false                          # install Determinate Systems Nix
docker: false                       # install Docker Engine
tags: ["backend", "typescript"]    # static tags for all claws
color: teal                         # UI accent color

# Secrets to inject
secrets:
  - type: linear
    workspace: my-company
  - type: custom
    name: my_api_key
    as: MY_API_KEY

# MCP servers to start
mcps:
  - name: github
    config:
      repository: "my-org/my-repo"

# Auto-watch settings
auto_watch_ci: true                 # detect CI failures and inject fix messages
auto_watch_bugbot: true             # detect Cursor bugbot comments and inject`}</CodeBlock>
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

      <Section title="Template fields">
        <div className="space-y-3 text-sm text-zinc-400">
          <p><code className="text-cyan-300">provider</code> — Override the hub default provider for this template</p>
          <p><code className="text-cyan-300">instance_type</code> — VM size (provider-specific, e.g. <code>r1.small</code>)</p>
          <p><code className="text-cyan-300">image</code> — OS image</p>
          <p><code className="text-cyan-300">ttl</code> — Auto-destroy after this duration</p>
          <p><code className="text-cyan-300">llm_key</code> — Named LLM key from hub.yaml to use</p>
          <p><code className="text-cyan-300">default_model</code> — Override hub default model (provider/model format)</p>
          <p><code className="text-cyan-300">nix</code> — Install Determinate Systems Nix (~2-3 min extra bootstrap)</p>
          <p><code className="text-cyan-300">docker</code> — Install Docker Engine via official apt repo</p>
          <p><code className="text-cyan-300">tags</code> — Static labels applied to every claw from this template</p>
          <p><code className="text-cyan-300">color</code> — UI accent color. One of: slate, red, orange, amber, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, pink, rose</p>
          <p><code className="text-cyan-300">secrets</code> — Secret references to inject as env vars. See Secrets docs.</p>
          <p><code className="text-cyan-300">mcps</code> — MCP servers to start in the claw. See MCP Servers docs.</p>
          <p><code className="text-cyan-300">auto_watch_ci</code> — Auto-detect CI failures and inject fix messages (default: true)</p>
          <p><code className="text-cyan-300">auto_watch_bugbot</code> — Auto-detect Cursor bugbot comments and inject (default: true)</p>
          <p><code className="text-cyan-300">github.repos</code> — GitHub repos the claw needs access to</p>
          <p><code className="text-cyan-300">linear.workspace</code> — Linear workspace for the claw</p>
        </div>
      </Section>

      <Section title="Template markdown files">
        <p>
          ElasticClaw generates several markdown files that are injected into the claw's
          context. You can customize these by including them in your template directory:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li><code>SOUL.md</code> — Agent personality and behavior guidelines</li>
          <li><code>AGENTS.md</code> — Instructions for the agent (how to signal done, etc.)</li>
          <li><code>TOOLS.md</code> — Tool usage guidelines and conventions</li>
          <li><code>IDENTITY.md</code> — Identity/persona configuration</li>
          <li><code>USER.md</code> — Information about the human user</li>
          <li><code>MEMORY.md</code> — Long-term memory for the agent</li>
          <li><code>BOOTSTRAP.md</code> — Bootstrap instructions (auto-generated from factory context)</li>
          <li><code>HEARTBEAT.md</code> — Periodic check instructions</li>
        </ul>
        <p className="text-sm text-zinc-400 mt-2">
          If not present in the template, the hub generates defaults. Factory-created claws
          get a <code>BOOTSTRAP.md</code> with issue context injected automatically.
        </p>
      </Section>

      <Section title="Pushing templates">
        <CodeBlock lang="bash">{`elasticclaw template push my-template    # push to hub
elasticclaw template rm my-template      # remove from hub
elasticclaw template show my-template    # show config`}</CodeBlock>
      </Section>

      <Note>
        Bootstrap runs as root inside the VM. The workspace is typically
        mounted at <code>/workspace</code>.
      </Note>
    </DocsPage>
  );
}
