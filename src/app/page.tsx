"use client";
import Link from "next/link";
import { YouTubeVideo } from "@/components/youtube-video";

const GITHUB_URL = "https://github.com/elasticclaw/elasticclaw";
const X_URL = "https://x.com/elasticclaw";
const FEEDBACK_EMAIL = "marc@elasticclaw.ai";

const CORE_PRIMITIVES = [
  {
    title: "Concurrent agents",
    desc: "Run many isolated claws from the same hub with workflow-level concurrency groups, queueing, and lifecycle state.",
  },
  {
    title: "Execution graphs",
    desc: "Model work as pipeline stages with triggers, transitions, on-enter actions, terminal states, and issue/PR events.",
  },
  {
    title: "Delegation and reentrancy",
    desc: "Workflows can start work from external events, manual inputs, or pipeline transitions, then re-enter the workflow when CI, review, or issue state changes.",
  },
  {
    title: "Plugin-based extensions",
    desc: "Attach MCP servers, environment variables, model providers, issue trackers, sandbox providers, and workspace files to each class of work.",
  },
  {
    title: "Local-first operation",
    desc: "Run the hub yourself. Keep configuration, workspaces, workflows, credentials, and workflow state under your control.",
  },
  {
    title: "Retries and recovery",
    desc: "Feed CI failures and review feedback back into running agents, retry provider bootstrap paths, and terminate cleanly at terminal states.",
  },
  {
    title: "Logs and task state",
    desc: "Inspect claw status, provisioning events, activity logs, failure summaries, and pipeline state from the CLI and web UI.",
  },
];

const WORKFLOWS = [
  {
    title: "Linear ticket to PR",
    desc: "Move an issue into a trigger state, provision a workspace, inject issue context, open a PR, and advance the tracker when the job is done.",
  },
  {
    title: "CI repair swarm",
    desc: "Route failed checks back into one or more running agents so the system can attempt targeted repairs instead of dropping state.",
  },
  {
    title: "PR review pipeline",
    desc: "Keep a claw alive after the first PR so it can react to review comments, changed checks, and merge or close events.",
  },
  {
    title: "Dependency upgrade workflow",
    desc: "Create repeatable upgrade lanes that pull context from releases or issue queues, test changes, and drive PR lifecycle.",
  },
  {
    title: "Research -> plan -> code -> test",
    desc: "Compose longer workflows from staged instructions, workspaces, tools, environment, and provider-backed execution environments.",
  },
];

const TERMINAL_LINES = [
  "$ brew tap elasticclaw/elasticclaw && brew install elasticclaw",
  "$ elasticclaw hub init",
  "$ elasticclaw workspace create --name ci-repair",
  "$ elasticclaw workspace push ci-repair",
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-400/40 bg-cyan-400/10 text-sm font-bold text-cyan-300">
            EC
          </span>
          <span className="font-bold tracking-tight text-white">ElasticClaw</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-zinc-400">
          <Link href="/docs" className="transition-colors hover:text-cyan-300">
            Docs
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-cyan-300"
          >
            GitHub
          </a>
        </div>
      </nav>

      <main>
        <section className="border-b border-zinc-800/80 bg-[linear-gradient(180deg,rgba(24,24,27,0.72),rgba(9,9,11,0))]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-14 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:pb-18 lg:pt-16">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-zinc-950 px-4 py-1.5 text-sm text-cyan-100">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                WorkflowOS for agentic development
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-tight text-white md:text-6xl lg:text-[4.5rem]">
                ElasticClaw is a runtime for building software workflows.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300 md:text-xl">
                A programmable, local-first orchestration layer for concurrent
                coding agents, execution graphs, delegation, plugins, retries,
                and autonomous development workflows.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-cyan-200 bg-cyan-300 px-6 py-3 text-center font-bold text-zinc-950 transition-colors hover:bg-cyan-200"
                >
                  View on GitHub
                </a>
                <Link
                  href="/docs"
                  className="rounded-lg border border-zinc-700 bg-zinc-950/70 px-6 py-3 text-center font-bold text-zinc-100 transition-colors hover:border-cyan-400/60"
                >
                  Read the docs
                </Link>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="font-mono text-xs text-zinc-500">
                    runtime primitives
                  </span>
                </div>
                <div className="space-y-4 p-5 font-mono text-sm leading-6">
                  <p className="text-zinc-500">elasticclaw-config.yaml + workflows/ci-repair.yaml</p>
                  <pre className="overflow-x-auto text-zinc-300">
                    <code>{`schema_version: v1
name: ci-repair
repositories: ["elasticclaw/*"]
env:
  NODE_ENV: test
  CI: "true"
provider: exedev

---
name: github-issues
trigger:
  github_issues:
    event: issue_labeled
    repositories: ["elasticclaw/*"]
    states: [open]
    labels: [ci-failing]
concurrency_group: ci-repair
secret_refs:
  GITHUB_TOKEN: scoped_github_app
enable_manual_trigger: true`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-800/80 bg-zinc-950 py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div className="space-y-8">
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
                  Runtime, not UI
                </p>
                <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                  Not an assistant. A runtime.
                </h2>
              </div>
              <YouTubeVideo
                title="ElasticClaw general walkthrough"
                videoId="2h_-3HsV9Bo"
                className="border-zinc-800"
              />
            </div>
            <div className="space-y-5 text-lg leading-8 text-zinc-400">
              <p>
                ElasticClaw is not another place to type prompts. It is
                infrastructure for systems where agents are scheduled, given
                scoped credentials, routed through execution graphs, and kept
                alive across the real lifecycle of engineering work.
              </p>
              <p>
                Use it to build your own lights-out development systems:
                workflows that coordinate workers, delegate work, retry
                failures, react to external events, and preserve state between
                issue, code, CI, review, and merge.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
              Core primitives
            </p>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              Compose autonomous workflows from workers, graphs, plugins,
              retries, and state.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_PRIMITIVES.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-zinc-800 bg-zinc-900/45 p-5 transition-colors hover:border-cyan-400/40"
              >
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-zinc-800/80 bg-zinc-900/30 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.86fr_1.14fr]">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
                Build your own workflow
              </p>
              <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                Build the workflow. Don't rent the assistant.
              </h2>
              <p className="mt-5 leading-8 text-zinc-400">
                ElasticClaw gives you the runtime primitives to build your own
                software workflow. Define the workstream, choose the provider,
                wire in tools and credentials, then let the runtime carry work
                across the systems your team already uses.
              </p>
            </div>
            <div className="grid gap-4">
              {WORKFLOWS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-zinc-800 bg-zinc-950/65 p-5"
                >
                  <h3 className="font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
                Quickstart
              </p>
              <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                Install the runtime. Start with one workflow.
              </h2>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/docs/installation"
                  className="rounded-lg bg-white px-5 py-3 text-center font-bold text-zinc-950 transition-colors hover:bg-cyan-100"
                >
                  Install ElasticClaw
                </Link>
                <Link
                  href="/docs/workflows"
                  className="rounded-lg border border-zinc-700 px-5 py-3 text-center font-bold text-zinc-100 transition-colors hover:border-cyan-400/60"
                >
                  Read workflow docs
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 px-6 py-5 font-mono text-sm shadow-xl">
              {TERMINAL_LINES.map((line) => (
                <p key={line} className="whitespace-nowrap py-1 text-zinc-100">
                  <span className="text-cyan-300">{line.slice(0, 1)}</span>
                  <span className="text-zinc-300">{line.slice(1)}</span>
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-800/80 bg-zinc-950 py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
                GitHub-first OSS
              </p>
              <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                Open infrastructure for teams that want to inspect, extend, and
                operate their own agent runtime.
              </h2>
              <p className="mt-5 leading-8 text-zinc-400">
                ElasticClaw is Apache 2.0 and built in the open. Read the code,
                adapt the workflows, connect your own tools, and run the control
                plane where you need it.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-white px-5 py-3 text-center font-bold text-zinc-950 transition-colors hover:bg-cyan-100"
              >
                View on GitHub
              </a>
              <a
                href={X_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-700 px-5 py-3 text-center font-bold text-zinc-100 transition-colors hover:border-cyan-400/60"
              >
                Follow @elasticclaw
              </a>
              <a
                href={`mailto:${FEEDBACK_EMAIL}`}
                className="rounded-lg border border-zinc-700 px-5 py-3 text-center font-bold text-zinc-100 transition-colors hover:border-cyan-400/60"
              >
                Send feedback
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-zinc-500 sm:flex-row">
          <span>
            © {new Date().getFullYear()} ElasticClaw. Apache 2.0 open source.
          </span>
          <div className="flex gap-6">
            <Link href="/docs" className="transition-colors hover:text-cyan-300">
              Docs
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-cyan-300"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
