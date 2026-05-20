import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";
import { YouTubeVideo } from "@/components/youtube-video";

export const metadata: Metadata = { title: "Templates" };

export default function TemplatesPage() {
  return (
    <DocsPage
      title="Templates"
      description="Agent templates define what runs inside the sandbox — dependencies, repos, services, and the agent's bootstrap behavior."
    >
      <Section title="Template Directory Structure">
        <p>
          A template is a directory pushed to the hub&apos;s external
          <code className="text-cyan-300">templates/</code> storage.
          It contains at minimum an <code className="text-cyan-300">elasticclaw-config.yaml</code>.
        </p>
        <CodeBlock lang="text">{`templates/
  my-template/
    elasticclaw-config.yaml   # required
    AGENTS.md                 # optional workspace instruction file
    SOUL.md                   # optional persona file
    TOOLS.md                  # optional tool guidance
    MEMORY.md                 # optional long-term memory
    memory/
      2026-05-20.md           # optional memory entries`}</CodeBlock>
      </Section>

      <Section title="Configure a template">
        <YouTubeVideo
          title="Configure an ElasticClaw template"
          videoId="qAvg6q2cuYA"
        />
      </Section>

      <Section title="elasticclaw-config.yaml">
        <p>
          This file defines provider, model, repo, secret, MCP, and runtime
          settings for claws created from the template.
        </p>
        <CodeBlock lang="yaml">{`schema_version: v1

# Sandbox
provider: daytona                    # override hub default provider
snapshot: daytona-large              # Daytona snapshot override
instance_type: r1.small              # Replicated instance type override
image: ubuntu-22.04
ttl: 24h

# Model and LLM key
llm_key: anthropic-prod             # named key from hub.yaml
default_model: anthropic/claude-sonnet-4-6

# Template features
nix: false                          # install Determinate Systems Nix
docker: false                       # install Docker Engine
tags: ["backend", "typescript"]    # static tags for all claws
color: teal                         # UI accent color

# Secrets to inject
secret_refs:
  LINEAR_API_KEY: linear_token
  MY_API_KEY: my_api_key

# MCP servers to start
mcps:
  - name: github
    config:
      repository: "my-org/my-repo"

# Repo access
github:
  repos:
    - repo: my-org/my-repo
      permissions: write

# Issue tracker token selection
linear:
  workspace: my-company`}</CodeBlock>
      </Section>

      <Section title="Template fields">
        <div className="space-y-3 text-sm text-zinc-400">
          <p><code className="text-cyan-300">schema_version</code> — Optional schema marker; defaults to <code>v1</code></p>
          <p><code className="text-cyan-300">provider</code> — Override the hub default provider for this template</p>
          <p><code className="text-cyan-300">instance_type</code> — Sandbox size (provider-specific, e.g. <code>r1.small</code>)</p>
          <p><code className="text-cyan-300">snapshot</code> — Daytona snapshot override; overrides <code>providers.daytona.default_snapshot</code></p>
          <p><code className="text-cyan-300">image</code> — OS image</p>
          <p><code className="text-cyan-300">ttl</code> — Auto-destroy after this duration</p>
          <p><code className="text-cyan-300">llm_key</code> — Named LLM key from hub.yaml to use</p>
          <p><code className="text-cyan-300">default_model</code> — Override hub default model (provider/model format)</p>
          <p><code className="text-cyan-300">nix</code> — Install Determinate Systems Nix (~2-3 min extra bootstrap)</p>
          <p><code className="text-cyan-300">docker</code> — Install Docker Engine via official apt repo</p>
          <p><code className="text-cyan-300">tags</code> — Static labels applied to every claw from this template</p>
          <p><code className="text-cyan-300">color</code> — UI accent color. One of: slate, red, orange, amber, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, pink, rose</p>
          <p><code className="text-cyan-300">secret_refs</code> — Secret references to inject as env vars (map of env var → hub secret name). See Secrets docs.</p>
          <p><code className="text-cyan-300">secrets</code> — <strong>Deprecated</strong> — legacy list format for secret references. Migrate to <code>secret_refs</code>.</p>
          <p><code className="text-cyan-300">mcps</code> — MCP servers to start in the claw. See MCP Servers docs.</p>
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
          <li><code>BOOTSTRAP.md</code> — Optional bootstrap instructions</li>
          <li><code>HEARTBEAT.md</code> — Periodic check instructions</li>
        </ul>
        <p className="text-sm text-zinc-400 mt-2">
          Factory-created claws also get generated <code>CONTEXT.md</code> with
          issue, story, PR, or external event context.
        </p>
      </Section>

      <Section title="Pushing templates">
        <CodeBlock lang="bash">{`elasticclaw template push my-template    # push to hub
elasticclaw template rm my-template      # remove from hub
elasticclaw template show my-template    # show config`}</CodeBlock>
      </Section>

      <Note>
        Template files are workspace instruction files. Arbitrary
        <code>bootstrap.steps</code>, nested <code>files:</code>, and
        <code>agent:</code> blocks are not part of the current template schema.
      </Note>
    </DocsPage>
  );
}
