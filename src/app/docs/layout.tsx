"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import DocsSearch from "@/components/docs-search";

type NavItem = {
  href: string;
  label: string;
  children?: NavItem[];
};

const NAV_ITEMS: NavItem[] = [
  { href: "/docs", label: "Overview" },
  {
    href: "/docs/concepts",
    label: "Concepts",
    children: [
      { href: "/docs/concepts", label: "Architecture" },
      { href: "/docs/web-ui", label: "Web UI" },
    ],
  },
  {
    href: "/docs/installation",
    label: "Getting Started",
    children: [
      { href: "/docs/installation", label: "Installation" },
    ],
  },
  {
    href: "/docs/hub",
    label: "Configuration",
    children: [
      { href: "/docs/hub", label: "Server Config" },
      { href: "/docs/branding", label: "Custom Branding" },
      { href: "/docs/artifact-storage", label: "Artifact Storage" },
      { href: "/docs/authentication", label: "Authentication" },
    ],
  },
  {
    href: "/docs/providers",
    label: "Sandbox Providers",
    children: [
      { href: "/docs/providers", label: "Provider Overview" },
      { href: "/docs/providers/daytona", label: "Daytona" },
      { href: "/docs/providers/replicated", label: "Replicated CMX" },
      { href: "/docs/providers/docker", label: "Local Docker" },
      { href: "/docs/providers/aws-lambda-microvms", label: "AWS Lambda MicroVMs" },
      { href: "/docs/exe-dev", label: "exedev" },
    ],
  },
  { href: "/docs/models", label: "Models & LLM Keys" },
  {
    href: "/docs/workspaces",
    label: "Workspaces",
    children: [
      { href: "/docs/workspaces", label: "Workspace Config" },
      { href: "/docs/repository-instructions", label: "Repository Instructions" },
      { href: "/docs/secrets", label: "Secrets" },
    ],
  },
  {
    href: "/docs/workflows",
    label: "Workflows",
    children: [
      { href: "/docs/workflows", label: "Overview" },
      { href: "/docs/stages", label: "Stages" },
      { href: "/docs/cron-triggers", label: "Cron Triggers" },
      { href: "/docs/dependency-updates", label: "Dependency Updates" },
      { href: "/docs/workflow-volumes", label: "Workflow Volumes" },
      { href: "/docs/examples", label: "Examples" },
      { href: "/docs/examples/bugfix-linear", label: "Bug fixes (Linear)" },
      { href: "/docs/examples/feature-github", label: "Feature work (GitHub)" },
      { href: "/docs/examples/dependabot", label: "Dependabot auto-merge" },
    ],
  },
  {
    href: "/docs/linear-integration",
    label: "Issue Trackers",
    children: [
      { href: "/docs/linear-integration", label: "Linear" },
      { href: "/docs/jira-integration", label: "Jira" },
      { href: "/docs/github-issues", label: "GitHub Issues" },
      { href: "/docs/shortcut-integration", label: "Shortcut" },
    ],
  },
  {
    href: "/docs/github-integration",
    label: "GitHub App",
    children: [
      { href: "/docs/github-integration", label: "GitHub App" },
    ],
  },
  { href: "/docs/mcp-servers", label: "MCP Servers" },
  {
    href: "/docs/cli-reference",
    label: "CLI Reference",
    children: [
      { href: "/docs/cli-reference#global-flags", label: "Global Flags" },
      { href: "/docs/cli-reference#upgrade", label: "upgrade" },
      { href: "/docs/cli-reference#install", label: "install" },
      { href: "/docs/cli-reference#hub-management", label: "server management" },
      { href: "/docs/cli-reference#profile", label: "profile" },
      { href: "/docs/cli-reference#create", label: "create" },
      { href: "/docs/cli-reference#chat", label: "chat" },
      { href: "/docs/cli-reference#list", label: "list / ls" },
      { href: "/docs/cli-reference#inspect", label: "inspect" },
      { href: "/docs/cli-reference#kill", label: "kill" },
      { href: "/docs/cli-reference#workspace", label: "workspace" },
      { href: "/docs/cli-reference#workflow", label: "workflow" },
      { href: "/docs/cli-reference#secret", label: "secret" },
      { href: "/docs/cli-reference#github-app", label: "github-app" },
      { href: "/docs/cli-reference#provider", label: "provider" },
      { href: "/docs/cli-reference#login", label: "login" },
      { href: "/docs/cli-reference#hub-server", label: "server" },
    ],
  },
  { href: "/docs/github-actions", label: "GitHub Actions" },
  { href: "/docs/analytics", label: "Analytics" },
  { href: "/docs/troubleshooting", label: "Troubleshooting" },
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
  currentPath,
  depth = 0,
}: {
  item: NavItem;
  currentPath: string;
  depth?: number;
}) {
  const active = isActive(currentPath, item.href);
  const sectionOpen = item.children ? isSectionActive(currentPath, item) : false;

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
            <NavLink
              key={child.href}
              item={child}
              currentPath={currentPath}
              depth={depth + 1}
            />
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
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    function updateHash() {
      setHash(window.location.hash);
    }

    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  const currentPath = `${pathname}${hash}`;

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
          <Link
            href="/docs/release-notes"
            className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors"
          >
            Release Notes
          </Link>
          <a
            href="https://github.com/elasticclaw/elasticclaw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors"
          >
            Star on GitHub →
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
              <NavLink key={item.href} item={item} currentPath={currentPath} />
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
