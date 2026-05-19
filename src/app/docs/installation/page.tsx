import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Installation" };

export default function InstallationPage() {
  return (
    <DocsPage
      title="Installation"
      description="Install the elasticclaw CLI on macOS, Linux, or via direct binary download. Upgrade, install on remote servers, and set up systemd."
    >
      <Section title="Video Walkthrough">
        <p>Watch a quick walkthrough of the installation process:</p>
        <div className="aspect-video w-full max-w-2xl">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/1joBaUrtwOA?si=2dB5MVXkQA6smBFQ"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      </Section>

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
curl -L https://github.com/elasticclaw/elasticclaw/releases/latest/download/elasticclaw-darwin-arm64 -o elasticclaw
chmod +x elasticclaw
sudo mv elasticclaw /usr/local/bin/

# Linux (amd64)
curl -L https://github.com/elasticclaw/elasticclaw/releases/latest/download/elasticclaw-linux-amd64 -o elasticclaw
chmod +x elasticclaw
sudo mv elasticclaw /usr/local/bin/`}</CodeBlock>
      </Section>

      <Section title="Verify Installation">
        <CodeBlock lang="bash">{`elasticclaw version
# elasticclaw 2026.5.16`}</CodeBlock>
      </Section>

      <Section title="Upgrade CLI">
        <p>
          Upgrade the CLI to the latest release. Auto-detects your platform,
          downloads the binary, and replaces it atomically.
        </p>
        <CodeBlock lang="bash">{`elasticclaw upgrade`}</CodeBlock>
        <p>
          If the hub systemd service is running, it will be restarted automatically.
        </p>
      </Section>

      <Section title="Install on a Remote Server">
        <p>
          Install the full hub (binary, systemd service, Caddy TLS) on a remote
          Linux server via SSH:
        </p>
        <CodeBlock lang="bash">{`elasticclaw install \
  --server ssh://root@my-server.com \
  --domain hub.mycompany.com`}</CodeBlock>
        <p>Flags:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li><code>--server</code> — SSH URI (required)</li>
          <li><code>--domain</code> — Domain for TLS via Let's Encrypt (required)</li>
          <li><code>--ssh-key</code> — SSH private key path</li>
          <li><code>--version</code> — Pin a release version (default: latest)</li>
          <li><code>--token</code> — Hub user token (default: random hex32)</li>
          <li><code>--ui-password</code> — Web UI password (default: random hex32)</li>
          <li><code>--skip-caddy</code> — Skip Caddy/TLS (useful when DNS not ready)</li>
        </ul>
        <Note>
          The install script verifies DNS resolves before proceeding (unless <code>--skip-caddy</code>).
          Save the printed credentials — they won't be shown again.
        </Note>
      </Section>

      <Section title="Upgrade Remote Hub">
        <p>
          Upgrade the hub binary on a remote server via SSH:
        </p>
        <CodeBlock lang="bash">{`elasticclaw hub upgrade --server ssh://root@hub.example.com`}</CodeBlock>
        <p>
          The server SSH target and key can be inferred from your active profile if
          <code>ssh_uri</code> or <code>url</code> is configured.
        </p>
      </Section>

      <Section title="Systemd Service">
        <p>Manage the hub as a systemd service (Linux only):</p>
        <CodeBlock lang="bash">{`sudo elasticclaw hub service install    # write unit, enable, start
sudo elasticclaw hub service uninstall  # stop, disable, remove
elasticclaw hub service status`}</CodeBlock>
        <p>
          The unit file is written to <code>/etc/systemd/system/elasticclaw.service</code>.
          Config lives at <code>/etc/elasticclaw/hub.yaml</code>, data at{" "}
          <code>/var/lib/elasticclaw/</code>.
        </p>
      </Section>

      <Section title="Caddy Reverse Proxy">
        <p>
          Caddy handles TLS automatically via Let's Encrypt. Install and configure:
        </p>
        <CodeBlock lang="bash">{`sudo elasticclaw hub caddy install --domain hub.example.com
sudo elasticclaw hub caddy uninstall`}</CodeBlock>
        <Note>
          The domain must have an A record pointing to the server's IP. Caddy is
          installed via the official apt repo if not present.
        </Note>
      </Section>
    </DocsPage>
  );
}
