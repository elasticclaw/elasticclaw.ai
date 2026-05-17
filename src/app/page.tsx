"use client";
import Link from "next/link";

const GITHUB_URL = "https://github.com/elasticclaw/elasticclaw";

const PROOF_POINTS = [
  "Single Go binary hub",
  "Embedded web UI",
  "Linear, GitHub Issues, Shortcut",
  "Apache 2.0",
];

const CAPABILITIES = [
  {
    eyebrow: "01",
    title: "Issue tracker in, pull request out",
    desc: "Factories watch Linear, GitHub Issues, or Shortcut. When a ticket matches your trigger, ElasticClaw creates a dedicated claw with the issue context and lifecycle rules.",
  },
  {
    eyebrow: "02",
    title: "Real sandboxes, not shared sessions",
    desc: "Each claw runs in an isolated provider-backed environment with terminal access, git credentials, template files, secrets, MCP servers, and persistent state for the task.",
  },
  {
    eyebrow: "03",
    title: "Your infrastructure, your credentials",
    desc: "The hub is self-hosted. Keep code, issue data, API keys, model keys, and GitHub App credentials under your control instead of routing everything through a hosted agent service.",
  },
];

const FEATURE_CARDS = [
  {
    title: "Sandbox provider",
    desc: "Pick where claws run: Daytona, Replicated CMX, or exe.dev. ElasticClaw handles provisioning, bootstrap, lifecycle, and cleanup.",
  },
  {
    title: "Template",
    desc: "Define the environment: repos, bootstrap files, model defaults, secrets, MCP servers, and the instructions every claw starts with.",
  },
  {
    title: "Factory",
    desc: "Define when work starts: status changes, labels, assignments, manual inputs, concurrency limits, and the pipeline that drives the claw.",
  },
  {
    title: "Issue tracker",
    desc: "Connect the source of work: Linear, GitHub Issues, or Shortcut. Tickets become structured context instead of pasted prompts.",
  },
  {
    title: "Model key",
    desc: "Choose named LLM keys and model defaults per hub or template, including Anthropic, OpenAI, Codex, Fireworks, Groq, and DeepSeek.",
  },
  {
    title: "GitHub workflow",
    desc: "Give claws scoped repo access so they can clone, test, push branches, open pull requests, and move work into review.",
  },
];

const WORKFLOW_STEPS = [
  {
    step: "Connect",
    desc: "Deploy the hub, add a provider, configure model keys, and install your GitHub App.",
  },
  {
    step: "Template",
    desc: "Define the environment, repos, secrets, MCP tools, and agent instructions for a class of work.",
  },
  {
    step: "Trigger",
    desc: "Move an issue into Ready for Agent, add a label, or manually trigger a factory from the UI.",
  },
  {
    step: "Review",
    desc: "The claw opens a PR, follows your pipeline, and shuts down after the work reaches a terminal state.",
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 20% 0%, rgba(34, 211, 238, 0.16), transparent 32rem), radial-gradient(circle at 90% 12%, rgba(20, 184, 166, 0.12), transparent 28rem), #09090b",
        color: "#fafafa",
      }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-400/40 bg-cyan-400/10 text-cyan-300">
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
            GitHub
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-12 text-center lg:pb-28 lg:pt-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-zinc-950/70 px-4 py-1.5 text-sm text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />
            Open source control plane for coding agents
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.055em] text-white md:text-6xl lg:text-7xl">
            Turn issues into pull requests with self-hosted agents.
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-zinc-300 md:text-xl">
            ElasticClaw watches your issue tracker, provisions an isolated AI
            coding sandbox, gives it scoped access to your repos and tools, and
            drives the work through review and cleanup.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/docs/installation"
              className="rounded-xl border border-cyan-200 bg-cyan-300 px-6 py-3 text-center font-bold text-zinc-950 shadow-[0_0_40px_rgba(34,211,238,0.25)] transition-colors hover:bg-cyan-200"
            >
              Install ElasticClaw
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-zinc-700 bg-zinc-950/60 px-6 py-3 text-center font-bold text-zinc-100 transition-colors hover:border-cyan-400/60"
            >
              View on GitHub
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

        <div className="relative mx-auto mt-12 max-w-4xl text-left">
          <div className="absolute -inset-5 rounded-[2rem] bg-cyan-400/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950/90 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <span className="font-mono text-xs text-zinc-500">factory run</span>
            </div>
            <div className="space-y-2 px-5 py-5 font-mono text-sm md:px-6 md:py-6">
              <p className="text-zinc-500">
                $ <span className="text-zinc-100">elasticclaw install --server ssh://root@vps --domain factory.acme.dev</span>
              </p>
              <p className="text-cyan-300">OK hub installed with systemd, Caddy, and embedded UI</p>
              <p className="pt-3 text-zinc-500">
                $ <span className="text-zinc-100">elasticclaw factory push bugfix</span>
              </p>
              <p className="text-zinc-400">watching Linear team ENG for status Ready for Agent</p>
              <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 md:p-5">
                <p className="text-zinc-500">event</p>
                <p className="mt-1 text-zinc-100">ENG-42 moved to Ready for Agent</p>
                <p className="mt-4 text-zinc-500">pipeline</p>
                <p className="mt-1 text-cyan-300">created claw bugfix-eng-42</p>
                <p className="text-cyan-300">opened github.com/acme/app/pull/1337</p>
                <p className="text-cyan-300">moved issue to In Review</p>
              </div>
              <p className="pt-2 text-zinc-500">$<span className="animate-pulse">_</span></p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800/80 bg-zinc-950/45 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
              Why it exists
            </p>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              Agents need infrastructure, not just a chat box.
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-400">
              ElasticClaw is the missing operations layer for coding agents:
              provisioning, identity, templates, issue context, secrets, PR
              workflows, and teardown.
            </p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {CAPABILITIES.map((item) => (
              <div key={item.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
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
              Configure the pieces
            </p>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              Bring your provider, template, factory, and tracker.
            </h2>
            <p className="mt-5 leading-8 text-zinc-400">
              ElasticClaw is deliberately composable. Choose the sandbox backend,
              define the agent environment, connect the issue tracker, then wire
              those pieces together with factories.
            </p>
            <p className="mt-4 leading-8 text-zinc-400">
              The result is not one hosted workflow. It is your own issue-to-PR
              pipeline, assembled from the systems your team already uses.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURE_CARDS.map((item) => (
              <div key={item.title} className="rounded-2xl border border-zinc-800 bg-zinc-950/55 p-5">
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
              From ticket to review loop.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {WORKFLOW_STEPS.map((item, index) => (
              <div key={item.step} className="relative rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
                <p className="font-mono text-4xl font-black text-cyan-300/40">
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
          Install the CLI, deploy a hub, connect your first factory.
        </h2>
        <div className="mt-8 rounded-2xl border border-zinc-700 bg-zinc-950/80 px-6 py-5 text-left font-mono text-sm shadow-xl">
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
            className="rounded-xl bg-white px-5 py-3 font-bold text-zinc-950 transition-colors hover:bg-cyan-100"
          >
            Read the install guide
          </Link>
          <Link
            href="/docs/factories"
            className="rounded-xl border border-zinc-700 px-5 py-3 font-bold text-zinc-100 transition-colors hover:border-cyan-400/60"
          >
            Set up factories
          </Link>
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
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
