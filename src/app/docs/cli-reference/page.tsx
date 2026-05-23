import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "CLI Reference" };

export default function CLIReferencePage() {
  return (
    <DocsPage
      title="CLI Reference"
      description="Complete reference for the elasticclaw CLI."
    >
      <Note>
        All commands support <code>--profile</code> to target a specific hub,
        <code>--json</code> for machine-readable output, and <code>--quiet</code> to suppress non-essential output.
      </Note>

      <Section id="global-flags" title="Global Flags">
        <div className="space-y-2 text-sm">
          <p><code className="text-cyan-300">--config</code> — CLI profile config path (default <code>~/.elasticclaw/config.yaml</code>)</p>
          <p><code className="text-cyan-300">--profile</code> — Hub profile to use</p>
          <p><code className="text-cyan-300">--json</code> — Output as JSON</p>
          <p><code className="text-cyan-300">--quiet, -q</code> — Suppress non-essential output</p>
          <p><code className="text-cyan-300">--yes, -y</code> — Answer yes to all prompts</p>
        </div>
      </Section>

      <Section id="upgrade" title="elasticclaw upgrade">
        <p>Upgrade the CLI to the latest GitHub release. Auto-detects platform and replaces the binary atomically.</p>
        <CodeBlock lang="bash">{`elasticclaw upgrade`}</CodeBlock>
        <p>Restarts the hub systemd service if it's running.</p>
      </Section>

      <Section id="install" title="elasticclaw install">
        <p>Install the hub on a remote server via SSH. Sets up the binary, systemd service, Caddy reverse proxy with TLS, and generates tokens.</p>
        <CodeBlock lang="bash">{`elasticclaw install \
  --server ssh://root@my-server.com \
  --domain hub.mycompany.com`}</CodeBlock>
        <p>Flags:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li><code>--server</code> — SSH URI (required)</li>
          <li><code>--domain</code> — Domain for TLS (required)</li>
          <li><code>--ssh-key</code> — SSH private key path</li>
          <li><code>--version</code> — Pin a release version (default: latest)</li>
          <li><code>--token</code> — Hub user token (default: random)</li>
          <li><code>--ui-password</code> — Web UI password (default: random)</li>
          <li><code>--skip-caddy</code> — Skip Caddy/TLS setup</li>
        </ul>
      </Section>

      <Section id="hub-management" title="elasticclaw hub">
        <p>Hub management commands.</p>

        <h3 className="text-sm font-semibold text-zinc-200 mt-4 mb-2">hub init</h3>
        <p className="text-sm text-zinc-400">Generate a hub.yaml config file.</p>
        <CodeBlock lang="bash">{`elasticclaw hub init
elasticclaw hub init --public-url https://hub.example.com
elasticclaw hub init --print  # stdout only, don't write`}</CodeBlock>

        <h3 className="text-sm font-semibold text-zinc-200 mt-4 mb-2">hub upgrade</h3>
        <p className="text-sm text-zinc-400">Upgrade the hub binary on a remote server via SSH.</p>
        <CodeBlock lang="bash">{`elasticclaw hub upgrade --server ssh://root@hub.example.com`}</CodeBlock>

        <h3 className="text-sm font-semibold text-zinc-200 mt-4 mb-2">hub service</h3>
        <p className="text-sm text-zinc-400">Manage the systemd service (Linux only).</p>
        <CodeBlock lang="bash">{`sudo elasticclaw hub service install    # write unit file, enable, start
sudo elasticclaw hub service uninstall  # stop, disable, remove
elasticclaw hub service status`}</CodeBlock>

        <h3 className="text-sm font-semibold text-zinc-200 mt-4 mb-2">hub caddy</h3>
        <p className="text-sm text-zinc-400">Manage Caddy reverse proxy (Linux only). Handles TLS via Let's Encrypt.</p>
        <CodeBlock lang="bash">{`sudo elasticclaw hub caddy install --domain hub.example.com
sudo elasticclaw hub caddy uninstall`}</CodeBlock>
      </Section>

      <Section id="profile" title="elasticclaw profile">
        <p>Manage hub connection profiles. Each profile stores a hub URL and token.</p>
        <CodeBlock lang="bash">{`elasticclaw profile ls
elasticclaw profile create work --url https://hub2.example.com --token mytoken
elasticclaw profile use work
elasticclaw profile rename work prod
elasticclaw profile rm work
elasticclaw profile show`}</CodeBlock>
      </Section>

      <Section id="create" title="elasticclaw create">
        <p>Create a new agent (claw).</p>
        <CodeBlock lang="bash">{`elasticclaw create --name my-agent --workspace my-workspace
elasticclaw create --name my-agent --workspace my-workspace --ttl 4h --tag urgent`}</CodeBlock>
      </Section>

      <Section id="chat" title="elasticclaw chat">
        <p>Start an interactive chat session with an agent.</p>
        <CodeBlock lang="bash">{`elasticclaw chat my-agent`}</CodeBlock>
      </Section>

      <Section id="list" title="elasticclaw list / ls">
        <p>List running agents.</p>
        <CodeBlock lang="bash">{`elasticclaw list
elasticclaw ls --json`}</CodeBlock>
      </Section>

      <Section id="inspect" title="elasticclaw inspect">
        <p>Show detailed info about an agent.</p>
        <CodeBlock lang="bash">{`elasticclaw inspect my-agent`}</CodeBlock>
      </Section>

      <Section id="kill" title="elasticclaw kill">
        <p>Terminate an agent and destroy its sandbox.</p>
        <CodeBlock lang="bash">{`elasticclaw kill my-agent`}</CodeBlock>
      </Section>

      <Section id="workspace" title="elasticclaw workspace">
        <p>Manage workspaces.</p>
        <CodeBlock lang="bash">{`elasticclaw workspace create my-workspace  # scaffold .elasticclaw/workspaces/my-workspace
elasticclaw workspace list                # list local and hub workspaces
elasticclaw workspace push my-workspace    # push workspace to hub
elasticclaw workspace rm my-workspace      # remove from hub
elasticclaw workspace show my-workspace    # show workspace config`}</CodeBlock>
      </Section>

      <Section id="workflow" title="elasticclaw workflow">
        <p>Inspect and manually trigger workflows that were pushed with a workspace.</p>
        <CodeBlock lang="bash">{`elasticclaw workflow list --workspace bugbot
elasticclaw workflow show triage --workspace bugbot
elasticclaw workflow trigger triage --workspace bugbot --input key=value`}</CodeBlock>
      </Section>

      <Section id="provider" title="elasticclaw provider">
        <p>List available sandbox providers.</p>
        <CodeBlock lang="bash">{`elasticclaw provider list`}</CodeBlock>
      </Section>

      <Section id="login" title="elasticclaw login">
        <p>Authenticate with a hub.</p>
        <CodeBlock lang="bash">{`elasticclaw login --hub https://hub.example.com --token mytoken`}</CodeBlock>
      </Section>

      <Section id="hub-server" title="elasticclaw hub">
        <p>Start the hub server (including embedded web UI).</p>
        <CodeBlock lang="bash">{`elasticclaw hub`}</CodeBlock>
      </Section>
    </DocsPage>
  );
}
