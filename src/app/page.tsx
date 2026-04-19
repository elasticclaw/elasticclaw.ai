"use client";
import Link from "next/link";
import { useState } from "react";

const GITHUB_URL = "https://github.com/elasticclaw/elasticclaw.ai";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="absolute top-2 right-2 px-3 py-1 text-xs rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

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
          Provision AI agents.{" "}
          <span style={{ color: "#22d3ee" }}>Ship faster.</span>
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
          Spin up ephemeral AI agent VMs in seconds. Each agent gets its own
          environment, git access, and terminal. Integrate with GitHub and
        </p>
        {/* Agent-first CTA */}
        <div className="bg-zinc-900 border border-cyan-500/30 rounded-xl px-6 py-5 max-w-2xl mx-auto mb-8 text-left">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">For AI agents — copy &amp; paste this prompt</p>
          <div className="relative group">
            <div className="font-mono text-sm bg-zinc-800 rounded-lg px-4 py-3 text-zinc-200 select-all leading-relaxed">
              Read{" "}
              <span className="text-cyan-400">https://elasticclaw.ai/agent.md</span>
              {" "}and set up an ElasticClaw hub. Ask me any questions you need before starting.
            </div>
            <CopyButton text={`Read https://elasticclaw.ai/agent.md and set up an ElasticClaw hub. Ask me any questions you need before starting.`} />
          </div>
        </div>

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

        {/* Terminal snippet */}
        <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden text-left shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="ml-2 text-xs text-zinc-500">terminal</span>
          </div>
          <div className="px-5 py-4 font-mono text-sm">
            <div className="text-zinc-500">$ <span className="text-zinc-200">elasticclaw create \</span></div>
            <div className="text-zinc-500 ml-4"><span className="text-zinc-200">--name my-agent \</span></div>
            <div className="text-zinc-500 ml-4"><span className="text-zinc-200">--template my-template</span></div>
            <div className="mt-3 text-zinc-400">
              <span style={{ color: "#22d3ee" }}>✓</span> Creating agent <span className="text-white">my-agent</span>...
            </div>
            <div className="text-zinc-400">
              <span style={{ color: "#22d3ee" }}>✓</span> Bootstrapping environment...
            </div>
            <div className="text-zinc-400">
              <span style={{ color: "#22d3ee" }}>✓</span> Agent ready at <span className="text-white">https://my-agent.elasticclaw.local</span>
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
            ElasticClaw is an open source platform for provisioning AI agents as
            ephemeral virtual machines. Rather than running agents in shared
            sandboxes, each agent lives in its own isolated environment with
            full git access, a real terminal, and persistent state — spun up
            and torn down on demand.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🖥️",
                title: "Ephemeral VMs",
                desc: "Each agent gets a real VM — isolated, reproducible, and disposable. No shared state, no surprises.",
              },
              {
                icon: "🔧",
                title: "Full Environment",
                desc: "Git access, file system, terminal, running processes. Agents can do what developers do.",
              },
              {
                icon: "🔗",
                title: "Native Integrations",
                desc: "GitHub built in. Agents read issues, open PRs, and leave comments without extra glue.",
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

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create",
                desc: "Run `elasticclaw create` with a name and template. The CLI provisions a fresh VM from your hub configuration.",
                cmd: "elasticclaw create --name my-agent",
              },
              {
                step: "02",
                title: "Bootstrap",
                desc: "The agent VM runs your bootstrap script — installing deps, cloning repos, configuring secrets, spinning up services.",
                cmd: "→ Runs elasticclaw-config.yaml",
              },
              {
                step: "03",
                title: "Chat",
                desc: "Connect via the web UI or SSH terminal. Stream conversations in real time and assign GitHub issues.",
                cmd: "elasticclaw chat my-agent",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-6 left-full w-8 border-t border-dashed border-zinc-700 -translate-x-4"></div>
                )}
                <div
                  className="text-4xl font-bold mb-4"
                  style={{ color: "#22d3ee", opacity: 0.4 }}
                >
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm mb-4">{item.desc}</p>
                <code className="block bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-300 font-mono">
                  {item.cmd}
                </code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="border-t border-zinc-800 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Features</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: "⚡", title: "Real-time streaming", desc: "Stream agent output token by token over WebSocket." },
              { icon: "🌐", title: "Web dashboard", desc: "Manage agents, view logs, and chat from the browser." },
              { icon: "🖥️", title: "SSH terminal", desc: "Drop into any agent's VM with a full interactive shell." },
              { icon: "🐙", title: "GitHub integration", desc: "Assign issues, review PRs, and auto-comment on progress." },
              { icon: "🔓", title: "OSS & self-hosted", desc: "Run on your own infra. No vendor lock-in, ever." },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-colors"
              >
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="font-semibold text-white text-sm mb-1">{f.title}</h3>
                <p className="text-zinc-500 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Install */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Get started in seconds</h2>
          <p className="text-zinc-400 mb-8">
            Install the CLI with Homebrew, then run your first agent.
          </p>
          {/* macOS */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-6 py-5 font-mono text-sm text-left mb-4 shadow-xl">
            <div className="text-zinc-500 text-xs mb-3">macOS (Homebrew)</div>
            <div className="text-zinc-400 mb-1">
              <span className="text-zinc-600">$</span>{" "}
              <span className="text-zinc-200">brew tap elasticclaw/elasticclaw</span>
            </div>
            <div className="text-zinc-400">
              <span className="text-zinc-600">$</span>{" "}
              <span className="text-zinc-200">brew install elasticclaw</span>
            </div>
          </div>

          {/* Linux / agent */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-6 py-5 font-mono text-sm text-left mb-6 shadow-xl">
            <div className="text-zinc-500 text-xs mb-3">Linux / agent-friendly</div>
            <div className="text-zinc-400 mb-1">
              <span className="text-zinc-600">$</span>{" "}
              <span className="text-zinc-200">curl -fsSL https://elasticclaw.ai/install | bash</span>
            </div>
            <div className="text-zinc-400 text-xs mt-3 border-t border-zinc-800 pt-3">
              <span className="text-zinc-500"># or with options:</span>
            </div>
            <div className="text-zinc-400 text-xs">
              <span className="text-zinc-600">$</span>{" "}
              <span className="text-zinc-200">ELASTICCLAW_PUBLIC_URL=https://my-server.example.com \
  curl -fsSL https://elasticclaw.ai/install | bash</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/docs/installation"
              className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors underline underline-offset-4"
            >
              All install options →
            </Link>
            <Link
              href="/docs"
              className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors underline underline-offset-4"
            >
              Full documentation →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} ElasticClaw. Open source under MIT.
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
