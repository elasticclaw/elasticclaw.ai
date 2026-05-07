import type { Metadata } from "next";
import { DocsPage, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Concepts" };

export default function ConceptsPage() {
  return (
    <DocsPage
      title="Concepts"
      description="How ElasticClaw works — the factory pipeline, templates, sandboxes, and the lifecycle of an agent."
    >
      <Section title="Architecture">
        <p className="text-zinc-400">
          ElasticClaw is a self-hosted hub that connects your issue tracker to
          isolated AI agents. The core loop is:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400 mt-3">
          <li>
            An issue enters a trigger status (e.g.,{" "}
            <strong>Ready for Agent</strong>)
          </li>
          <li>
            The hub provisions a sandbox from a{" "}
            <strong>template</strong>
          </li>
          <li>
            The agent receives the issue context and implements the fix
          </li>
          <li>
            The agent opens a PR and signals{" "}
            <code className="text-cyan-300">[DONE]</code>
          </li>
          <li>
            The hub moves the issue to <strong>In Review</strong> and
            terminates the sandbox when the PR merges
          </li>
        </ol>
      </Section>

      <Section title="The Factory Pipeline">
        <p className="text-zinc-400">
          A factory is a pipeline that connects triggers to templates. Think of
          it as a rule: <em>when this happens, create that</em>.
        </p>

        <div className="mt-4 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-2">
              1. Trigger
            </h3>
            <p className="text-sm text-zinc-400">
              A webhook from Linear, GitHub Issues, or Shortcut fires when an
              issue changes status. The factory checks filters (labels,
              assignee, status) and decides whether to act.
            </p>
          </div>

          <div className="flex justify-center">
            <span className="text-zinc-600 text-lg">↓</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-2">
              2. Template
            </h3>
            <p className="text-sm text-zinc-400">
              The factory references a template that defines the sandbox
              environment: provider (Replicated, Daytona, etc.), bootstrap
              scripts, secrets, MCP servers, and the agent&apos;s initial
              instructions.
            </p>
          </div>

          <div className="flex justify-center">
            <span className="text-zinc-600 text-lg">↓</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-2">
              3. Sandbox
            </h3>
            <p className="text-sm text-zinc-400">
              The hub provisions an isolated sandbox, injects the issue context
              as <code className="text-cyan-300">CONTEXT.md</code>, and starts
              the agent. The agent has full terminal, git, and API access within
              its environment.
            </p>
          </div>

          <div className="flex justify-center">
            <span className="text-zinc-600 text-lg">↓</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-2">
              4. Signal & Wrap
            </h3>
            <p className="text-sm text-zinc-400">
              When the agent sends{" "}
              <code className="text-cyan-300">[DONE]</code>, the hub validates
              the PR, moves the issue to the configured{" "}
              <code className="text-cyan-300">done_status</code>, and marks the
              claw idle. The sandbox terminates when the PR merges or closes.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Key Terms">
        <div className="space-y-3 text-sm">
          <div>
            <h4 className="font-semibold text-white">Hub</h4>
            <p className="text-zinc-400">
              The central server that manages sandboxes, receives webhooks,
              serves the web UI, and routes agent traffic. Configured via{" "}
              <code className="text-cyan-300">hub.yaml</code>.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Claw</h4>
            <p className="text-zinc-400">
              A single running agent instance. Each claw is backed by one
              sandbox and has a unique ID, status, and lifecycle.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Factory</h4>
            <p className="text-zinc-400">
              An automation rule that listens for issue status changes and
              spawns claws. Factories connect integrations to templates.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Template</h4>
            <p className="text-zinc-400">
              A reusable definition of a sandbox environment: bootstrap scripts,
              files, secrets, model config, and provider settings.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Pipeline</h4>
            <p className="text-zinc-400">
              A state machine attached to a factory that defines actions at each
              stage: on trigger, on enter, on done, on merge. Enables
              multi-stage workflows like review → test → deploy.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Sandbox</h4>
            <p className="text-zinc-400">
              The isolated compute environment that hosts a claw. Can be a VM
              (Replicated, Daytona), container, or serverless function depending
              on the provider.
            </p>
          </div>
        </div>
      </Section>

      <Note>
        Every claw is single-tenant: one issue, one sandbox, one agent. There is
        no shared state between claws. This isolation is what makes factories
        safe to run autonomously.
      </Note>
    </DocsPage>
  );
}
