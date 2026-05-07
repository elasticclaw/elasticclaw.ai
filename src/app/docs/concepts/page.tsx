import type { Metadata } from "next";
import { DocsPage, Section, Note, MermaidDiagram } from "@/components/docs-page";

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

        <MermaidDiagram>{`
graph TD
    A[Issue enters trigger status] -->|webhook| B{Factory filters}
    B -->|labels match assignee match status match| C[Template selected]
    B -->|no match| D[Ignore event]
    C --> E[Sandbox provisioned]
    E --> F[Agent receives CONTEXT.md]
    F --> G[Agent implements fix]
    G --> H[Agent opens PR]
    H --> I["Agent sends DONE"]
    I --> J[Issue moved to done_status]
    J --> K[Claw watches CI and reviews]
    K -->|PR merged| L[Sandbox terminated]
    K -->|PR closed| L
        `}</MermaidDiagram>

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

      <Section title="Claw Lifecycle">
        <p className="text-zinc-400">
          A claw moves through distinct states from creation to termination.
          Understanding these states helps debug why a claw is stuck or
          failed.
        </p>

        <MermaidDiagram>{`
stateDiagram-v2
    [*] --> Pending: concurrency limit reached
    [*] --> Provisioning: slot available
    Pending --> Provisioning: slot freed
    Pending --> Deleted: issue closed / claw killed
    Provisioning --> Starting: sandbox running
    Provisioning --> Error: provider failure
    Starting --> Connected: bridge registered
    Starting --> Error: bootstrap failed
    Connected --> Running: agent active
    Running --> Idle: [DONE] received
    Idle --> Deleted: PR merged
    Idle --> Error: claw killed
    Error --> [*]
    Deleted --> [*]
        `}</MermaidDiagram>

        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <span className="text-yellow-400 font-medium">Pending</span>
            <p className="text-zinc-500 text-xs mt-1">Waiting for a free slot (concurrency limit)</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <span className="text-cyan-400 font-medium">Provisioning</span>
            <p className="text-zinc-500 text-xs mt-1">Sandbox being created by the provider</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <span className="text-blue-400 font-medium">Starting</span>
            <p className="text-zinc-500 text-xs mt-1">Bootstrap running, bridge connecting</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <span className="text-green-400 font-medium">Connected</span>
            <p className="text-zinc-500 text-xs mt-1">Bridge registered, agent ready</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <span className="text-white font-medium">Running</span>
            <p className="text-zinc-500 text-xs mt-1">Agent actively working</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <span className="text-purple-400 font-medium">Idle</span>
            <p className="text-zinc-500 text-xs mt-1">[DONE] sent, watching CI/reviews</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <span className="text-red-400 font-medium">Error</span>
            <p className="text-zinc-500 text-xs mt-1">Provisioning or bootstrap failed</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <span className="text-zinc-500 font-medium">Deleted</span>
            <p className="text-zinc-500 text-xs mt-1">Cleaned up, sandbox destroyed</p>
          </div>
        </div>
      </Section>

      <Section title="How a Factory Decides">
        <p className="text-zinc-400">
          When a webhook arrives, the factory evaluates multiple filters in
          sequence. All must pass for a claw to spawn.
        </p>

        <MermaidDiagram>{`
flowchart TD
    A[Webhook arrives] --> B{Integration match?}
    B -->|no| Z[Ignore]
    B -->|yes| C{Factory enabled?}
    C -->|no| Z
    C -->|yes| D{Status matches trigger_status?}
    D -->|no| Z
    D -->|yes| E{Labels present? AND}
    E -->|no| Z
    E -->|yes| F{Assignee filter passes?}
    F -->|no| Z
    F -->|yes| G{1:1 check — existing claw?}
    G -->|yes| Z
    G -->|no| H{Concurrency limit?}
    H -->|at capacity| I[Queue as Pending]
    H -->|slot free| J[Spawn claw]
        `}</MermaidDiagram>

        <p className="text-sm text-zinc-400 mt-3">
          Each filter is a gate. The first failure stops evaluation — no claw
          is created, and the event is logged as{" "}
          <code className="text-cyan-300">not_actionable</code>.
        </p>
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
