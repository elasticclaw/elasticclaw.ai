"use client";
import Link from "next/link";

const GITHUB_URL = "https://github.com/elasticclaw/elasticclaw";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#09090b", color: "#fafafa" }}>
      {/* Nav */}
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold text-xl">⚡ elasticclaw</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-zinc-400">
          <Link href="/docs" className="hover:text-cyan-400 transition-colors">Docs</Link>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">GitHub</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-1.5 text-sm text-zinc-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span>
          Open source · Self-hosted
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          AI agents that{" "}
          <span style={{ color: "#22d3ee" }}>ship code.</span>
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
          ElasticClaw provisions isolated AI agents from your issue tracker.
          A ticket enters <span className="text-zinc-200">Ready for Agent</span> — a VM
          spins up, implements the fix, opens a PR, and shuts down when it merges.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/docs"
            className="px-8 py-3 rounded-lg font-semibold text-black transition-colors"
            style={{ background: "#22d3ee" }}
          >
            Get Started
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-lg font-semibold border border-zinc-700 text-zinc-300 hover:border-zinc-500 transition-colors"
          >
            GitHub →
          </a>
        </div>

        {/* Terminal snippet — factory workflow */}
        <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden text-left shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="ml-2 text-xs text-zinc-500">terminal</span>
          </div>
          <div className="px-5 py-4 font-mono text-sm">
            <div className="text-zinc-500">$ <span className="text-zinc-200">brew install elasticclaw</span></div>
            <div className="text-zinc-500">$ <span className="text-zinc-200">elasticclaw install --server ssh://root@my-server.com --domain hub.example.com</span></div>
            <div className="mt-3 text-zinc-400">
              <span style={{ color: "#22d3ee" }}>✓</span> Hub installed with systemd + Caddy
            </div>
            <div className="text-zinc-400">
              <span style={{ color: "#22d3ee" }}>✓</span> Web UI at <span className="text-white">https://hub.example.com</span>
            </div>
            <div className="mt-3 text-zinc-500">$ <span className="text-zinc-200">elasticclaw factory create --name bugfix --integration linear</span></div>
            <div className="mt-3 text-zinc-400">
              <span style={{ color: "#22d3ee" }}>→</span> Linear webhook configured
            </div>
            <div className="text-zinc-400">
              <span style={{ color: "#22d3ee" }}>→</span> Issue <span className="text-white">ENG-42</span> moved to <span className="text-white">Ready for Agent</span>
            </div>
            <div className="text-zinc-400">
              <span style={{ color: "#22d3ee" }}>✓</span> Claw <span className="text-white">bugfix-eng-42</span> provisioned
            </div>
            <div className="text-zinc-400">
              <span style={{ color: "#22d3ee" }}>✓</span> PR opened: <span className="text-white">https://github.com/acme/app/pull/1337</span>
            </div>
            <div className="text-zinc-400">
              <span style={{ color: "#22d3ee" }}>✓</span> Issue moved to <span className="text-white">In Review</span>, claw terminated
            </div>
            <div className="mt-2 text-zinc-500">$<span className="animate-pulse">▋</span></div>
          </div>
        </div>
      </section>

      {/* What it is */}
      <section className="border-t border-zinc-800 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">What is ElasticClaw?</h2>
          <p className="text-zinc-400 text-lg max-w-3xl mb-10">
            ElasticClaw is a self-hosted platform that turns your issue tracker
            into an autonomous engineering team. Connect Linear, GitHub Issues,
            or Shortcut — when a ticket hits the right status, an isolated AI
            agent VM spins up, implements the fix, opens a PR, and cleans up
            when the work is done.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🏭",
                title: "Factories",
                desc: "Auto-spawn agents from issue status changes. Linear → Ready for Agent → claw provisioned → PR opened → issue moved → claw terminated.",
              },
              {
                icon: "🖥️",
                title: "Ephemeral VMs",
                desc: "Each agent gets a real, isolated VM — not a shared sandbox. Full terminal, git access, and persistent state for the lifetime of the task.",
              },
              {
                icon: "🔧",
                title: "Full Environment",
                desc: "Agents clone repos, install dependencies, run tests, and push branches. They do what developers do, in a real environment.",
              },
              {
                icon: "🐙",
                title: "GitHub-native",
                desc: "Open PRs, link them to issues, watch CI, respond to review comments, and merge. Works with your existing GitHub workflow.",
              },
              {
                icon: "⚙️",
                title: "Templates & Secrets",
                desc: "Define reusable templates with bootstrap scripts, secrets, MCP servers, and model configs. One template, infinite agents.",
              },
              {
                icon: "🔓",
                title: "Self-hosted",
                desc: "Run on your own infra with your own API keys. No third-party access to your code, issues, or secrets.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Factory workflow deep-dive */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4 text-center">How factories work</h2>
          <p className="text-zinc-400 text-center max-w-2xl mx-auto mb-12">
            Set it up once. Every ticket that matches your trigger gets its own
            agent, start to finish.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Connect",
                desc: "Link Linear, GitHub Issues, or Shortcut. Configure which status triggers an agent.",
              },
              {
                step: "02",
                title: "Trigger",
                desc: "A ticket moves to Ready for Agent. ElasticClaw receives the webhook and checks your filters.",
              },
              {
                step: "03",
                title: "Implement",
                desc: "A VM spins up with the issue context. The agent explores the codebase, writes the fix, and opens a PR.",
              },
              {
                step: "04",
                title: "Wrap",
                desc: "The agent signals [DONE]. The issue moves to In Review, and the VM terminates when the PR merges.",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-6 left-full w-8 border-t border-dashed border-zinc-700 -translate-x-4"></div>
                )}
                <div
                  className="text-4xl font-bold mb-4"
                  style={{ color: "#22d3ee", opacity: 0.4 }}
                >
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting started */}
      <section className="border-t border-zinc-800 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Get started in minutes</h2>
          <p className="text-zinc-400 mb-8">
            Install the CLI, deploy a hub, and connect your first factory.
          </p>

          <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-6 py-5 font-mono text-sm text-left mb-6 shadow-xl">
            <div className="text-zinc-500 text-xs mb-3">macOS / Linux</div>
            <div className="text-zinc-400 mb-1">
              <span className="text-zinc-600">$</span>{" "}
              <span className="text-zinc-200">brew tap elasticclaw/elasticclaw && brew install elasticclaw</span>
            </div>
            <div className="text-zinc-400">
              <span className="text-zinc-600">$</span>{" "}
              <span className="text-zinc-200">elasticclaw install --server ssh://root@my-server.com --domain hub.example.com</span>
            </div>
            <div className="mt-3 text-zinc-500 text-xs border-t border-zinc-800 pt-3">
              # Or install the hub binary directly on any Linux server
            </div>
            <div className="text-zinc-400 text-xs">
              <span className="text-zinc-600">$</span>{" "}
              <span className="text-zinc-200">curl -fsSL https://elasticclaw.ai/install | bash</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/docs/installation"
              className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors underline underline-offset-4"
            >
              Full install guide →
            </Link>
            <Link
              href="/docs/factories"
              className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors underline underline-offset-4"
            >
              Factory setup →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} ElasticClaw. Apache 2.0 open source.
          </span>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/docs" className="hover:text-cyan-400 transition-colors">
              Docs
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
