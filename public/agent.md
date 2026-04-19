# ElasticClaw Setup Instructions for Agents

You are helping a user install ElasticClaw — an open source platform for provisioning AI agent VMs (claws).

ElasticClaw consists of:
- **Hub**: a Go server that manages claws (runs on a VPS, serves the web UI)
- **CLI**: the `elasticclaw` command (installed on the user's machine)
- **Claws**: ephemeral VMs that run OpenClaw AI agents

## Recommended install path

### Step 1: Install the CLI on the user's machine

**macOS (recommended):**
```bash
brew install elasticclaw/elasticclaw/elasticclaw
```

**Linux/macOS alternative:**
```bash
curl -fsSL https://elasticclaw.ai/install | bash
```

### Step 2: Get a VPS

The hub needs a **persistent cloud server** — not a local laptop. It runs 24/7.

Recommended: **Hetzner VPS** (CX22, ~€4/month) or DigitalOcean/AWS/GCP equivalent.
- OS: Ubuntu 24.04
- Min specs: 1 vCPU, 2GB RAM
- Needs: SSH root access, ports 80 + 443 open

Ask the user: *"Do you have a cloud server with SSH access? If not, I can help you provision a Hetzner VPS."*

### Step 3: Set up DNS

The user needs a domain (or subdomain) pointing to the server IP.

- Create an A record: `hub.yourdomain.com` → server IP
- DNS must resolve before running the install (Caddy needs it for TLS)

Ask: *"What domain will you use for the hub? Make sure the DNS A record points to your server IP."*

### Step 4: Run the install

Once the user has:
- CLI installed
- A VPS with SSH access
- DNS resolving to the server

Run:
```bash
elasticclaw install \
  --server ssh://root@your-server-ip \
  --domain hub.yourdomain.com \
  --anthropic-key sk-ant-...
```

This will:
1. SSH into the server
2. Download the hub binary (single binary with embedded web UI)
3. Write `/etc/elasticclaw/hub.yaml` with generated tokens
4. Install + start a systemd service
5. Install Caddy with automatic TLS via Let's Encrypt

At the end it prints credentials — save them.

### Step 5: Configure the CLI

```bash
elasticclaw login \
  --hub https://hub.yourdomain.com \
  --token <hub-token-from-install-output>
```

### Step 6: Create a claw

```bash
elasticclaw create --template elasticclaw --name my-claw
```

---

## Flags reference

| Flag | Description |
|---|---|
| `--server` | SSH URI, e.g. `ssh://root@1.2.3.4` or `ssh://root@1.2.3.4:2222` |
| `--domain` | FQDN for the hub (must resolve to server IP) |
| `--anthropic-key` | Anthropic API key for claws (can be added to hub.yaml later) |
| `--version` | Hub version to install (default: latest) |
| `--skip-caddy` | Skip Caddy install (if you have your own reverse proxy) |
| `--ui-password` | Web UI login password (auto-generated if not set) |
| `--token` | Hub API token (auto-generated if not set) |

## Manual install (advanced)

If you prefer to configure the server yourself:

```bash
# On the server
curl -fsSL https://github.com/elasticclaw/elasticclaw/releases/latest/download/elasticclaw-linux-amd64 \
  -o /usr/local/bin/elasticclaw && chmod +x /usr/local/bin/elasticclaw

mkdir -p /etc/elasticclaw
cat > /etc/elasticclaw/hub.yaml << EOF
token: your-token
claw_token: your-claw-token
ui_password: your-password
public_url: https://hub.yourdomain.com
EOF

sudo elasticclaw hub service install
sudo elasticclaw hub caddy install --domain hub.yourdomain.com
```

## Troubleshooting

- **TLS not working**: DNS must resolve before Caddy requests a cert. Wait for propagation.
- **Hub not starting**: Check `journalctl -u elasticclaw -f`
- **Can't connect**: Check `systemctl status elasticclaw`
- **Web UI blank**: Binary may not have web UI embedded — ensure you're running a tagged release, not a dev build
