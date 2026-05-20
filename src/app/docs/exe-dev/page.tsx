import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "exe.dev Setup" };

export default function ExedevPage() {
  return (
    <DocsPage
      title="exe.dev Setup"
      description="Provision persistent VMs with SSH access using exe.dev. No cloud account needed — just SSH key authentication."
    >
      <Section title="What is exe.dev?">
        <p>
          exe.dev provides persistent VMs accessible via SSH. Unlike ephemeral
          providers (Daytona, Replicated CMX), exe.dev VMs survive until you explicitly
          delete them — making them ideal for long-running agents or
          stateful workloads.
        </p>
        <div className="space-y-2 text-sm text-zinc-400 mt-4">
          <p><strong>Type:</strong> Stateful (persistent VM)</p>
          <p><strong>Auth:</strong> SSH key (no API token required)</p>
          <p><strong>Capabilities:</strong> <code className="text-cyan-300">exec</code>, <code className="text-cyan-300">ssh</code></p>
          <p><strong>Best for:</strong> Long-running agents, persistent workspaces, SSH-native workflows</p>
        </div>
      </Section>

      <Section title="Prerequisites">
        <ol className="list-decimal list-inside space-y-3 text-sm">
          <li>
            An exe.dev account. Sign up at{" "}
            <a
              href="https://exe.dev"
              className="text-cyan-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              exe.dev
            </a>
            .
          </li>
          <li>
            The <code className="text-cyan-300">ssh</code> CLI installed and in your <code>$PATH</code>.
            exe.dev uses standard SSH for all control-plane operations.
          </li>
          <li>
            An SSH key pair. exe.dev authenticates via SSH keys — no separate
            API tokens needed.
          </li>
        </ol>
      </Section>

      <Section title="SSH Key Setup">
        <p>If you don't have an SSH key pair:</p>
        <CodeBlock lang="bash">{`ssh-keygen -t ed25519 -C "your-email@example.com" -f ~/.ssh/exedev`}</CodeBlock>
        <p>Register the public key with exe.dev:</p>
        <CodeBlock lang="bash">{`ssh exe.dev key add ~/.ssh/exedev.pub`}</CodeBlock>
        <p>Or copy the key to your clipboard and paste it into the exe.dev web UI:</p>
        <CodeBlock lang="bash">{`cat ~/.ssh/exedev.pub | pbcopy  # macOS
# cat ~/.ssh/exedev.pub | xclip -selection clipboard  # Linux`}</CodeBlock>
        <Note>
          The SSH key is used for both control-plane commands{" "}
          <code>ssh exe.dev ...</code> and per-VM access. Keep the private key
          secure — it's your only authentication credential.
        </Note>
      </Section>

      <Section title="Verify CLI Access">
        <p>Test that your SSH key is recognized:</p>
        <CodeBlock lang="bash">{`ssh exe.dev ls --json`}</CodeBlock>
        <p>You should see a JSON list of VMs (empty if you haven't created any):</p>
        <CodeBlock lang="json">{`{"vms":[]}`}</CodeBlock>
        <p>If you get a permission error, verify the key is registered:</p>
        <CodeBlock lang="bash">{`ssh exe.dev key list`}</CodeBlock>
      </Section>

      <Section title="Configure ElasticClaw">
        <p>
          Add the exe.dev provider to your{" "}
          <code className="text-cyan-300">hub.yaml</code>:
        </p>
        <CodeBlock lang="yaml">{`providers:
  exedev:
    ssh_key_path: ~/.ssh/exedev    # optional; uses SSH agent if omitted`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          If <code>ssh_key_path</code> is omitted, ElasticClaw uses your default
          SSH agent. This works if you've added the key via{" "}
          <code>ssh-add</code>.
        </p>
      </Section>

      <Section title="Use in Templates">
        <p>Set exe.dev as the default provider for a template:</p>
        <CodeBlock lang="yaml">{`# elasticclaw-config.yaml
provider: exedev
resources:
  cpu: "2"
  memory: 4GB
  disk: 20GB
nix: false                       # exe.dev VMs are bare; enable if you need Nix
docker: false                    # enable if you need Docker`}</CodeBlock>
        <p>Or set per-factory:</p>
        <CodeBlock lang="yaml">{`# factories/long-running-agent/factory.yaml
name: long-running-agent
integration: linear
provider: exedev
template: my-template
trigger_status: "Ready for Agent"`}</CodeBlock>
      </Section>

      <Section title="Provider Behavior">
        <div className="space-y-3 text-sm text-zinc-400">
          <p>
            <strong>Create</strong> — Provisions a new VM via{" "}
            <code>ssh exe.dev new --json</code>. The VM name is auto-generated
            (e.g., <code>claw-abc123</code>) and the SSH destination is{" "}
            <code>vm-name.exe.xyz</code>.
          </p>
          <p>
            <strong>Stop / Start</strong> — No-ops for exe.dev. VMs are always
            running (there is no hibernate API exposed via the SSH CLI).
          </p>
          <p>
            <strong>Destroy</strong> — Deletes the VM via{" "}
            <code>ssh exe.dev delete vm-name</code>. This is irreversible.
          </p>
          <p>
            <strong>Exec</strong> — Runs commands via{" "}
            <code>ssh vm-name.exe.xyz command</code>.
          </p>
          <p>
            <strong>WriteFile</strong> — Pipes content through{" "}
            <code>ssh ... cat {'>'} path</code> to avoid shell escaping issues.
          </p>
        </div>
      </Section>

      <Section title="Troubleshooting">
        <div className="space-y-3 text-sm text-zinc-400">
          <p>
            <strong>Permission denied (publickey)</strong> — Your SSH key isn't
            registered with exe.dev. Run{" "}
            <code>ssh exe.dev key add ~/.ssh/your-key.pub</code>.
          </p>
          <p>
            <strong>Command not found: exe.dev</strong> — The SSH destination{" "}
            <code>exe.dev</code> requires your SSH config to resolve it. Ensure
            your SSH client can connect to <code>ssh exe.dev</code> (this uses
            exe.dev's SSH gateway).
          </p>
          <p>
            <strong>VM not found after creation</strong> — The VM name may have
            been auto-generated differently. Check{" "}
            <code>ssh exe.dev ls --json</code> to list all VMs.
          </p>
        </div>
      </Section>

      <Note>
        exe.dev VMs are billed by uptime. Delete unused VMs promptly to avoid
        unexpected charges. ElasticClaw's TTL-based auto-destroy does not apply
        to exe.dev — VMs persist until explicitly deleted.
      </Note>
    </DocsPage>
  );
}
