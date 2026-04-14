import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Installation" };

export default function InstallationPage() {
  return (
    <DocsPage
      title="Installation"
      description="Install the elasticclaw CLI on macOS, Linux, or via direct binary download."
    >
      <Section title="Homebrew (macOS & Linux)">
        <p>The recommended install method:</p>
        <CodeBlock lang="bash">{`brew tap elasticclaw/elasticclaw
brew install elasticclaw`}</CodeBlock>
        <p>Upgrade to the latest version:</p>
        <CodeBlock lang="bash">{`brew upgrade elasticclaw`}</CodeBlock>
      </Section>

      <Section title="Binary Download">
        <p>
          Download a pre-built binary from the{" "}
          <a
            href="https://github.com/elasticclaw/elasticclaw/releases"
            className="text-cyan-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Releases page
          </a>
          .
        </p>
        <CodeBlock lang="bash">{`# macOS (arm64)
curl -L https://github.com/elasticclaw/elasticclaw/releases/latest/download/elasticclaw_darwin_arm64.tar.gz | tar xz
sudo mv elasticclaw /usr/local/bin/

# Linux (amd64)
curl -L https://github.com/elasticclaw/elasticclaw/releases/latest/download/elasticclaw_linux_amd64.tar.gz | tar xz
sudo mv elasticclaw /usr/local/bin/`}</CodeBlock>
      </Section>

      <Section title="Verify Installation">
        <CodeBlock lang="bash">{`elasticclaw --version
# elasticclaw v0.1.0`}</CodeBlock>
      </Section>

      <Section title="Initial Setup">
        <p>After installing, initialize your hub config:</p>
        <CodeBlock lang="bash">{`elasticclaw init`}</CodeBlock>
        <p>
          This creates a <code className="text-cyan-300">hub.yaml</code> in
          your current directory. See{" "}
          <a href="/docs/hub" className="text-cyan-400 hover:underline">
            Hub Config
          </a>{" "}
          for details.
        </p>
        <Note>
          You&apos;ll need a provider account (e.g., Replicated CMX) to actually
          provision VMs. See{" "}
          <a href="/docs/providers" className="text-cyan-400 hover:underline">
            Providers
          </a>{" "}
          for setup.
        </Note>
      </Section>

      <Section title="Agent &amp; Script Install (Linux)">
        <p>For non-interactive environments — agents, CI, remote servers:</p>
        <CodeBlock lang="bash">{`curl -fsSL https://elasticclaw.ai/install | bash`}</CodeBlock>
        <p>With options via environment variables:</p>
        <CodeBlock lang="bash">{`ELASTICCLAW_PUBLIC_URL=https://my-server.example.com \
  curl -fsSL https://elasticclaw.ai/install | bash`}</CodeBlock>
        <Note>
          The install script downloads the right binary, writes ~/.elasticclaw/hub.yaml,
          and prints connection details. No interactive prompts — fully scriptable.
        </Note>
        <p>Supported environment variables:</p>
        <CodeBlock lang="bash">{`ELASTICCLAW_PUBLIC_URL   # Public URL for this hub
ELASTICCLAW_TOKEN        # User API token (auto-generated if unset)
ELASTICCLAW_CLAW_TOKEN   # Claw auth token (auto-generated if unset)
ELASTICCLAW_VERSION      # Pin a release version (default: latest)`}</CodeBlock>
      </Section>

      <Section title="Initialize Hub Config Only">
        <p>Generate a hub.yaml without running the full install script:</p>
        <CodeBlock lang="bash">{`elasticclaw hub init`}</CodeBlock>
        <p>With a public URL:</p>
        <CodeBlock lang="bash">{`elasticclaw hub init --public-url https://my-server.example.com`}</CodeBlock>
        <p>Print to stdout without writing (useful for piping or inspection):</p>
        <CodeBlock lang="bash">{`elasticclaw hub init --print`}</CodeBlock>
      </Section>
    </DocsPage>
  );
}
