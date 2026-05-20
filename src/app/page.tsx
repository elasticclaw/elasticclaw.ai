"use client";
import Link from "next/link";
import { YouTubeVideo } from "@/components/youtube-video";

const GITHUB_URL = "https://github.com/elasticclaw/elasticclaw";
const X_URL = "https://x.com/elasticclaw";
const FEEDBACK_EMAIL = "marc@elasticclaw.ai";

const PROOF_POINTS = [
  "Factories and pipelines",
  "Scoped GitHub App credentials",
  "Issue tracker triggers",
  "Single Go binary hub",
  "Apache 2.0",
];

const CAPABILITIES = [
  {
    eyebrow: "01",
    title: "Factories start from real work queues",
    desc: "Linear, GitHub Issues, Shortcut, webhooks, releases, and other events become sources of work. Factories watch those signals, apply filters, and create the right claw with the right context.",
  },
  {
    eyebrow: "02",
    title: "Pipelines drive the workflow",
    desc: "Define what happens after creation: branch, implement, test, open a PR, wait for CI, respond to review, move the issue, merge, and shut down.",
  },
  {
    eyebrow: "03",
    title: "Credentials stay scoped and owned",
    desc: "The self-hosted hub mints per-claw GitHub App tokens and injects only the repos, secrets, model keys, MCP tools, and issue data that each pipeline needs.",
  },
];

const FEATURE_CARDS = [
  {
    title: "Factory",
    desc: "Define the class of work: trigger rules, template, concurrency, issue movement, lifecycle policy, and the pipeline that drives the claw.",
  },
  {
    title: "Pipeline",
    desc: "Encode the stages after a claw starts: created, done, CI, review, merge, failure handling, and cleanup.",
  },
  {
    title: "Scoped GitHub App",
    desc: "Give each claw temporary, repo-scoped credentials so it can clone, push branches, open pull requests, watch checks, and merge when allowed.",
  },
  {
    title: "Issue tracker",
    desc: "Run from the queue your team already uses. Tickets become structured context and workflow state instead of pasted prompts.",
  },
  {
    title: "Template",
    desc: "Define the runtime for a class of work: repos, bootstrap files, model defaults, secrets, MCP servers, and agent instructions.",
  },
  {
    title: "Execution provider",
    desc: "Use Daytona, Replicated CMX, or exe.dev for isolated workspaces. Sandboxes are a critical factory component: where claws clone, test, build, and push code.",
  },
];

const WORKFLOW_STEPS = [
  {
    step: "Declare",
    desc: "Create a factory for a workstream: bug fixes, dependency updates, docs tasks, dark-factory jobs, or feature requests.",
  },
  {
    step: "Trigger",
    desc: "Let Linear, GitHub Issues, Shortcut, or the UI start the right pipeline from an issue event.",
  },
  {
    step: "Run",
    desc: "ElasticClaw provisions the workspace, injects context and scoped credentials, and runs the agent through the pipeline.",
  },
  {
    step: "Review",
    desc: "The claw opens a PR, handles feedback and CI, moves the issue forward, and shuts down at the terminal state.",
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 18% 0%, rgba(34, 211, 238, 0.12), transparent 34rem), radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.1), transparent 28rem), radial-gradient(circle at 70% 60%, rgba(245, 158, 11, 0.04), transparent 24rem), #09090b",
        color: "#fafafa",
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-400/40 bg-cyan-400/10 text-sm font-bold text-cyan-300">
            EC
          </span>
          <span className="font-bold tracking-tight text-white">elasticclaw</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-zinc-400">
          <Link href="/docs" className="hover:text-cyan-300 transition-colors">
            Docs
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-300 transition-colors"
          >
            Star this repo on GitHub
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-12 text-center lg:pb-28 lg:pt-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-zinc-950/70 px-4 py-1.5 text-sm text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />
            Open source software factories for coding agents
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.055em] text-white md:text-6xl lg:text-7xl">
            Run coding agents like a factory, not a remote shell.
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-zinc-300 md:text-xl">
            ElasticClaw turns issue tracker events into governed pipelines:
            trigger the right agent, provision the workspace, mint scoped GitHub
            credentials, open the PR, watch review and CI, then clean up.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/docs/installation"
              className="rounded-lg border border-cyan-200 bg-cyan-300 px-6 py-3 text-center font-bold text-zinc-950 shadow-[0_0_40px_rgba(34,211,238,0.25)] transition-colors hover:bg-cyan-200"
            >
              Install ElasticClaw
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-zinc-700 bg-zinc-950/60 px-6 py-3 text-center font-bold text-zinc-100 transition-colors hover:border-cyan-400/60"
            >
              Star on GitHub
            </a>
          </div>
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2 text-sm text-zinc-400">
            {PROOF_POINTS.map((point) => (
              <div key={point} className="rounded-full border border-zinc-800 bg-zinc-950/55 px-4 py-2">
                {point}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto mt-10 w-full max-w-3xl text-left">
          <div className="absolute -inset-4 rounded-2xl bg-cyan-400/10 blur-3xl" />
          <YouTubeVideo
            title="ElasticClaw general walkthrough"
            videoId="2h_-3HsV9Bo"
            className="relative border-zinc-700"
          />
        </div>
      </section>

      <section className="border-y border-zinc-800/80 bg-zinc-950/45 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
              Why it exists
            </p>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              The product is the factory, not the sandbox.
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-400">
              Remote agents give you a place to run code. ElasticClaw gives you
              the operations system around them: triggers, pipelines, identity,
              templates, issue context, PR workflows, and teardown.
            </p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {CAPABILITIES.map((item) => (
              <div key={item.title} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
                <p className="mb-5 font-mono text-sm text-cyan-300">{item.eyebrow}</p>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 leading-7 text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
              Compose workstreams
            </p>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              Build dark factories and software factories from the systems you already use.
            </h2>
            <p className="mt-5 leading-8 text-zinc-400">
              A factory can represent a bug lane, a dependency update loop, a
              customer escalation path, a docs queue, or a private background
              workflow. The factory owns when work starts, what access is
              granted, and how the job finishes.
            </p>
            <p className="mt-4 leading-8 text-zinc-400">
              Sandboxes, models, and MCP servers are pluggable components. The
              durable value is the repeatable issue-to-PR pipeline.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURE_CARDS.map((item) => (
              <div key={item.title} className="rounded-lg border border-zinc-800 bg-zinc-950/55 p-5 transition-colors hover:border-cyan-400/40">
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800/80 bg-zinc-950/45 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
              Workflow
            </p>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              From issue event to governed PR.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {WORKFLOW_STEPS.map((item, index) => (
              <div key={item.step} className="relative rounded-lg border border-zinc-800 bg-zinc-900/60 p-6">
                <p className="font-mono text-4xl font-black text-emerald-300/35">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-5 text-lg font-bold text-white">{item.step}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
          Install the CLI, deploy a hub, connect your first software factory.
        </h2>
        <div className="mt-8 overflow-x-auto rounded-lg border border-zinc-700 bg-zinc-950/80 px-6 py-5 text-left font-mono text-sm shadow-xl">
          <p className="text-zinc-500"># macOS / Linux</p>
          <p className="mt-3 text-zinc-400">
            $ <span className="text-zinc-100">brew tap elasticclaw/elasticclaw && brew install elasticclaw</span>
          </p>
          <p className="text-zinc-400">
            $ <span className="text-zinc-100">elasticclaw install --server ssh://root@vps --domain factory.acme.dev</span>
          </p>
          <p className="mt-4 border-t border-zinc-800 pt-4 text-zinc-500"># Script install</p>
          <p className="mt-3 text-zinc-400">
            $ <span className="text-zinc-100">curl -fsSL https://elasticclaw.ai/install | bash</span>
          </p>
        </div>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/docs/installation"
            className="rounded-lg bg-white px-5 py-3 font-bold text-zinc-950 transition-colors hover:bg-cyan-100"
          >
            Read the install guide
          </Link>
          <Link
            href="/docs/factories"
            className="rounded-lg border border-zinc-700 px-5 py-3 font-bold text-zinc-100 transition-colors hover:border-cyan-400/60"
          >
            Set up factories
          </Link>
        </div>
      </section>

      <section className="border-y border-zinc-800/80 bg-zinc-950/45 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
            Help the launch
          </p>
          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            Stars and honest feedback help early OSS projects get found.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-zinc-400">
            If ElasticClaw looks useful, star the repo so more developers can
            find it. If you try it, post what worked, what was confusing, or
            what you built with it. Swag and small gifts are available for
            people sharing useful public feedback while supplies last.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white px-5 py-3 text-center font-bold text-zinc-950 transition-colors hover:bg-cyan-100"
            >
              Star on GitHub
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

      <footer className="border-t border-zinc-800 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-zinc-500 sm:flex-row">
          <span>© {new Date().getFullYear()} ElasticClaw. Apache 2.0 open source.</span>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-cyan-300 transition-colors">
              Docs
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition-colors"
            >
              Star on GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
