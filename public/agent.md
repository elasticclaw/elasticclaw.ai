# ElasticClaw Setup Instructions for Agents

You are setting up ElasticClaw — an open source platform for provisioning AI agent VMs.

## Before you start: gather requirements

**Do not proceed with installation until you have answers to these questions.**
Ask the user for each item. If you already know the answer from context, confirm it.

---

**1. Where will the hub run?**

The hub must run on a **persistent cloud server** — not a local laptop. It needs to be reachable 24/7 since claws connect back to it.

Recommended options: Hetzner VPS, DigitalOcean Droplet, AWS EC2, GCP VM, Fly.io, exe.dev, Daytona.

Ask the user: *"Where do you want to run the hub? Do you have a cloud server already, or should I provision one?"*

If they don't have one, help them provision a small VPS (1 vCPU, 1GB RAM is enough) before continuing.

---

**2. Replicated API token**

Claws run as Replicated CMX VMs. Ask:

*"What is your Replicated API token?"*

Do not echo the token back in plaintext in the chat. Acknowledge receipt and move on.

---

**3. Ingress / public URL**

The hub needs a stable public HTTPS URL so claws can phone home. You will set this up — do not ask the user to choose. Pick the first option that is available on the hub server:

- **Static ngrok domain** — if ngrok is installed and they have a reserved domain, use: `ngrok http --domain=their-domain.ngrok-free.app 8080`
- **Tailscale Funnel** — if Tailscale is installed: `tailscale funnel --bg 8080`
- **Cloudflare Tunnel** — if cloudflared is installed: `cloudflared tunnel --url http://localhost:8080`
- **localhost.run fallback** — always available, no install needed: `ssh -R 80:localhost:8080 localhost.run`

**Important:** A static/stable URL is required. `localhost.run` and free ngrok generate new random URLs on each run — only use them if you restart the tunnel process under a supervisor (e.g. systemd) so it reconnects on the same session. For production use, a static domain is strongly recommended.

Once you have the URL, you are done — no need to ask the user about this.

---

**4. LLM API key**

Ask: *"What is your Anthropic API key? (starts with sk-ant-)"*

Do not echo it back. Acknowledge and continue.

---

**5. GitHub App for claw git access** (optional)

If claws need to push/pull from GitHub repos, ask:

*"Do you want claws to have GitHub access? If yes, I'll need your GitHub App credentials. Please share these securely (not in plaintext chat if possible — use a secrets manager, env var, or encrypted message). I need: App ID, and the private key PEM."*

If the user says no or doesn't have a GitHub App, skip this step.

---

## Write your plan

Once you have the answers above, write a **short 4-6 bullet plan** and confirm with the user before running any commands.

Example:
> - Provision hub on Hetzner CX11 (or use existing server at X)
> - Use ngrok static domain `my-hub.ngrok-free.app` for ingress
> - Configure Replicated CMX for VM provisioning
> - Set Anthropic API key for claude-sonnet-4-6
> - Configure GitHub App (App ID: 12345) for claw repo access
> - Test by creating a claw

---

## Step 1: Install the hub

SSH into the cloud server, then run:

```bash
ELASTICCLAW_PUBLIC_URL=https://your-public-url \
  curl -fsSL https://elasticclaw.ai/install | bash
```

The script installs `elasticclaw` and generates `~/.elasticclaw/hub.yaml` with random tokens.
Note the token values printed at the end — you'll need them.

## Step 2: Set up ingress

Pick the first available option (see requirements section above) and start the tunnel process.
Update `~/.elasticclaw/hub.yaml` with the public URL if not already set:

```bash
elasticclaw hub init --force --public-url https://your-public-url
```

Set up the tunnel to restart automatically on reboot (e.g. via systemd or a process supervisor).

## Step 3: Configure providers and API keys

Edit `~/.elasticclaw/hub.yaml` and add:

```yaml
default_model: anthropic/claude-sonnet-4-6

llm_keys:
  anthropic: <anthropic-api-key>

providers:
  replicated:
    token: <replicated-api-token>
    default_instance_type: r1.large
    default_ttl: 48h
```

If GitHub access was requested:

```yaml
github_apps:
  - app_id: <github-app-id>
    private_key_pem: |
      -----BEGIN RSA PRIVATE KEY-----
      ...
      -----END RSA PRIVATE KEY-----
```

## Step 4: Start the hub

```bash
elasticclaw hub &
```

Verify it's running:

```bash
curl https://your-public-url/healthz
```

Expected: `{"ok":true,"status":"live"}`

Set up the hub to restart on reboot (systemd recommended).

## Step 5: Connect your client

On the machine where you'll run `elasticclaw` commands:

```bash
elasticclaw login https://your-public-url --token <token-from-step-1>
```

## Step 6: Create your first claw

```bash
elasticclaw create --name my-claw --template <template-name>
```

## Step 7: Verify

```bash
elasticclaw list
elasticclaw chat my-claw
```

---

## Notes

- `~/.elasticclaw/hub.yaml` contains secrets. Do not share it.
- Full documentation: https://elasticclaw.ai/docs
- Provider setup details: https://elasticclaw.ai/docs/providers
