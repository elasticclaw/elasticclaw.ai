import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s — ElasticClaw Docs",
    default: "ElasticClaw Docs",
  },
};

const NAV_ITEMS = [
  { href: "/docs", label: "Overview" },
  { href: "/docs/installation", label: "Installation" },
  { href: "/docs/hub", label: "Hub Config" },
  { href: "/docs/templates", label: "Templates" },
  { href: "/docs/github-integration", label: "GitHub Integration" },
  { href: "/docs/linear-integration", label: "Linear Integration" },
  { href: "/docs/web-ui", label: "Web UI" },
  { href: "/docs/providers", label: "Providers" },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#09090b", color: "#fafafa" }}>
      {/* Top nav */}
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-cyan-400 font-bold text-lg">
            ⚡ elasticclaw
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400 text-sm">docs</span>
        </div>
        <a
          href="https://github.com/elasticclaw/elasticclaw.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors"
        >
          GitHub →
        </a>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-60 shrink-0 border-r border-zinc-800 px-4 py-6 hidden md:block">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2">
            Documentation
          </p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-6 md:px-12 py-10 max-w-3xl">
          {children}
        </main>
      </div>
    </div>
  );
}
