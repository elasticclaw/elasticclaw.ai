"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DocsSearch from "@/components/docs-search";

type NavItem = {
  href: string;
  label: string;
  children?: NavItem[];
};

const NAV_ITEMS: NavItem[] = [
  { href: "/docs", label: "Overview" },
  {
    href: "/docs/installation",
    label: "Getting Started",
    children: [
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/cli-reference", label: "CLI Reference" },
    ],
  },
  {
    href: "/docs/concepts",
    label: "Concepts",
    children: [
      { href: "/docs/concepts", label: "Architecture" },
    ],
  },
  {
    href: "/docs/hub",
    label: "Configuration",
    children: [
      { href: "/docs/hub", label: "Hub Config" },
      { href: "/docs/providers", label: "Providers" },
      { href: "/docs/models", label: "Models & LLM Keys" },
      { href: "/docs/secrets", label: "Secrets" },
      { href: "/docs/mcp-servers", label: "MCP Servers" },
      { href: "/docs/authentication", label: "Authentication" },
    ],
  },
  {
    href: "/docs/factories",
    label: "Factories",
    children: [
      { href: "/docs/factories", label: "Overview" },
      { href: "/docs/linear-integration", label: "Linear" },
      { href: "/docs/github-issues", label: "GitHub Issues" },
      { href: "/docs/shortcut-integration", label: "Shortcut" },
    ],
  },
  {
    href: "/docs/examples",
    label: "Examples",
    children: [
      { href: "/docs/examples/bugfix-linear", label: "Bug fixes (Linear)" },
      { href: "/docs/examples/feature-github", label: "Feature work (GitHub)" },
      { href: "/docs/examples/dependabot", label: "Dependabot auto-merge" },
    ],
  },
  {
    href: "/docs/github-integration",
    label: "Integrations",
    children: [
      { href: "/docs/github-integration", label: "GitHub App" },
    ],
  },
  { href: "/docs/web-ui", label: "Web UI" },
];

function isActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href !== "/docs" && pathname.startsWith(href)) return true;
  return false;
}

function isSectionActive(pathname: string, item: NavItem): boolean {
  if (isActive(pathname, item.href)) return true;
  if (item.children) {
    return item.children.some((child) => isActive(pathname, child.href));
  }
  return false;
}

function NavLink({
  item,
  depth = 0,
}: {
  item: NavItem;
  depth?: number;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, item.href);
  const sectionOpen = item.children ? isSectionActive(pathname, item) : false;

  return (
    <div>
      <Link
        href={item.href}
        className={`block rounded-lg text-sm transition-colors ${
          active
            ? "text-cyan-400 font-medium"
            : "text-zinc-400 hover:text-white"
        } ${depth > 0 ? "px-3 py-1.5 ml-3 text-xs" : "px-3 py-2"}`}
      >
        {item.label}
      </Link>
      {item.children && sectionOpen && (
        <div className="mt-1 space-y-0.5 border-l border-zinc-800 ml-3">
          {item.children.map((child) => (
            <NavLink key={child.href} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

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
        <div className="flex items-center gap-4">
          <DocsSearch />
          <a
            href="https://github.com/elasticclaw/elasticclaw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors"
          >
            GitHub →
          </a>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-60 shrink-0 border-r border-zinc-800 px-4 py-6 hidden md:block">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2">
            Documentation
          </p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} item={item} />
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
