import type { Metadata } from "next";
import { DocsPage, Section, Note, MermaidDiagram } from "@/components/docs-page";

export const metadata: Metadata = { title: "Concepts" };

export default function ConceptsPage() {
  return (
    <DocsPage
      title="Concepts"
      description="How ElasticClaw works — workflows, triggers, stages, scoped credentials, workspaces, and the lifecycle of an agent."
    >
      <Section title="Architecture">
        <p className="text-zinc-400">
          ElasticClaw is a self-hosted workflow system for coding work. It
          connects issue tracker events to repeatable workflows that run agents,
          grant scoped credentials, open pull requests, and clean up. The core
          loop is:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400 mt-3">
          <li>
            An issue enters a trigger status (e.g.,{" "}
            <strong>Ready for Agent</strong>)
          </li>
          <li>
            The workflow selects stages and provisions a workspace from a{" "}
            <strong>workspace</strong>
          </li>
          <li>
            The agent receives the issue context and implements the fix
          </li>
          <li>
            The agent opens a PR and signals{" "}
            <code className="text-cyan-300">[DONE]</code>
          </li>
          <li>
            ElasticClaw Server moves the issue to <strong>In Review</strong> and
            terminates the sandbox when the PR merges
          </li>
        </ol>
      </Section>

      <Section title="Workflow Stages">
        <p className="text-zinc-400">
          A workflow connects a source of work to a governed
          agent workflow. Think of it as a rule plus lifecycle: <em>when this
          happens, run this workflow with this access until this terminal state</em>.
        </p>

        <MermaidDiagram>{`
graph TD
    A[Issue enters trigger status] -->|webhook| B{Workflow filters}
    B -->|labels match assignee match status match| C[Workspace selected]
    B -->|no match| D[Ignore event]
    C --> E[Sandbox provisioned]
    E --> F[Agent receives CONTEXT.md]
    F --> G[Agent implements fix]
    G --> H[Agent opens PR]
    H --> I["Agent sends DONE"]
    I --> J[Issue moved to done_status]
    J --> K[Agent watches CI and reviews]
    K -->|PR merged| L[Sandbox terminated]
    K -->|PR closed| L
        `}</MermaidDiagram>

        <div className="mt-4 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-2">
              1. Trigger
            </h3>
            <p className="text-sm text-zinc-400">
              A trigger event arrives from Linear, GitHub Issues, Shortcut, a
              webhook, a GitHub release, or another connected system. The
              workflow checks filters and decides whether to act.
            </p>
          </div>

          <div className="flex justify-center">
            <span className="text-zinc-600 text-lg">↓</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-2">
              2. Workspace
            </h3>
            <p className="text-sm text-zinc-400">
              The workflow references a workspace that defines the sandbox
              environment: provider, bootstrap scripts, secrets, MCP servers,
              and the agent&apos;s initial instructions.
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
              ElasticClaw Server provisions an isolated sandbox, injects the issue context
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
              <code className="text-cyan-300">[DONE]</code>, ElasticClaw Server validates
              the PR, moves the issue to the configured{" "}
              <code className="text-cyan-300">done_status</code>, and marks the
              agent idle. The sandbox terminates when the PR merges or closes.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Agent Lifecycle">
        <p className="text-zinc-400">
          An agent moves through distinct states from creation to termination.
          Understanding these states helps debug why an agent is stuck or
          failed.
        </p>

        <MermaidDiagram>{`
stateDiagram-v2
    [*] --> Pending: concurrency limit reached
    [*] --> Provisioning: slot available
    Pending --> Provisioning: slot freed
    Pending --> Deleted: issue closed / agent killed
    Provisioning --> Starting: sandbox running
    Provisioning --> Error: provider failure
    Starting --> Connected: bridge registered
    Starting --> Error: bootstrap failed
    Connected --> Running: agent active
    Running --> Idle: [DONE] received
    Idle --> Deleted: PR merged
    Idle --> Error: agent killed
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

      <Section title="How a Workflow Decides">
        <p className="text-zinc-400">
          When a webhook arrives, the workflow evaluates multiple filters in
          sequence. All must pass for an agent to spawn.
        </p>

        <MermaidDiagram>{`
flowchart TD
    A[Webhook arrives] --> B{Integration match?}
    B -->|no| Z[Ignore]
    B -->|yes| C{Workflow enabled?}
    C -->|no| Z
    C -->|yes| D{Status matches trigger_status?}
    D -->|no| Z
    D -->|yes| E{Labels present? AND}
    E -->|no| Z
    E -->|yes| F{Assignee filter passes?}
    F -->|no| Z
    F -->|yes| G{1:1 check — existing agent?}
    G -->|yes| Z
    G -->|no| H{Concurrency limit?}
    H -->|at capacity| I[Queue as Pending]
    H -->|slot free| J[Spawn agent]
        `}</MermaidDiagram>

        <p className="text-sm text-zinc-400 mt-3">
          Each filter is a gate. The first failure stops evaluation — no agent
          is created, and the event is logged as{" "}
          <code className="text-cyan-300">not_actionable</code>.
        </p>
      </Section>

      <Section title="Key Terms">
        <div className="space-y-3 text-sm">
          <div>
            <h4 className="font-semibold text-white">ElasticClaw Server</h4>
            <p className="text-zinc-400">
              The central server that receives webhooks, evaluates workflows,
              manages credentials and execution providers, serves the web UI,
              and routes agent traffic. Configured via{" "}
              <code className="text-cyan-300">hub.yaml</code>.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Agent</h4>
            <p className="text-zinc-400">
              A single running agent instance. Each agent is backed by one
              sandbox and has a unique ID, status, and lifecycle.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Workflow</h4>
            <p className="text-zinc-400">
              A configured workstream that listens for issue events, applies
              trigger filters, selects a workspace, grants scoped access, and
              runs the agent through workflow stages.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Workspace</h4>
            <p className="text-zinc-400">
              A reusable definition of a sandbox environment: bootstrap scripts,
              files, secrets, model config, and provider settings.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Stages</h4>
            <p className="text-zinc-400">
              A state machine attached to a workflow that defines actions at each
              stage: creation, implementation, done, review, CI, merge, failure,
              and cleanup.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Sandbox</h4>
            <p className="text-zinc-400">
              The isolated compute environment that hosts an agent. It can be a
              VM, cloud development environment, MicroVM, container, or
              serverless runtime depending on the provider.
            </p>
          </div>
        </div>
      </Section>

      <Note>
        Every agent is single-tenant: one issue, one workspace, one agent, one
        scoped credential set. This isolation is what makes workflows safe to
        run autonomously.
      </Note>
    </DocsPage>
  );
}
