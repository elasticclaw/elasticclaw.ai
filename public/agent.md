# ElasticClaw Setup Instructions for Agents

You are setting up ElasticClaw — an open source platform for provisioning AI agent VMs.

## Before you start: gather requirements

**Do not proceed with installation until you have answers to these questions.**
Ask the user (or check your context) for each item. If you already know the answer, confirm it. If not, ask.

1. **Where will the hub run?**
   The hub is a long-running server process. Options:
   - On this machine (if it has a public IP or you can set up a tunnel)
   - On a cloud VM (you provision it)
   - Already running somewhere (just need to connect)

2. **What VM provider will claws use?**
   Currently supported: **Replicated CMX**. If using Replicated:
   - What is your Replicated API token?
   - What instance type? (default: r1.large)

3. **How will the hub be reachable from claw VMs?** (Step 2 covers options)
   Do you have any of: Tailscale, ngrok, Cloudflare Tunnel — or is this on a public IP?

4. **What LLM do you want agents to use?**
   Default: `anthropic/claude-sonnet-4-6`. Do you have an Anthropic API key?

5. **GitHub access for claws?** (optional)
   If claws need to clone/push repos, you'll need a GitHub App. Do you have one set up?

**Once you have these answers, write a short plan** (3-5 bullet points) and confirm with the user before running any commands.

Example plan:
> - Install elasticclaw on this machine
> - Use ngrok to expose port 8080 publicly
> - Configure Replicated CMX with token `rep_abc...` for VM provisioning
> - Set Anthropic API key for claude-sonnet-4-6
> - Create a test claw to verify everything works

---

## Step 1: Install ElasticClaw

Run this on the remote server:

```bash
curl -fsSL https://elasticclaw.ai/install | bash
```

If you want to set a public URL (so claws can reach the hub from VMs):

```bash
ELASTICCLAW_PUBLIC_URL=https://your-server-hostname-or-ip:8080 \
  curl -fsSL https://elasticclaw.ai/install | bash
```

The script will:
- Download and install the `elasticclaw` binary
- Generate `~/.elasticclaw/hub.yaml` with random tokens
- Print the token values you will need in Step 3

## Step 2: Expose the hub (pick one)

Claws run on remote VMs and need to reach the hub. Choose whichever tunneling
tool you have access to and set `ELASTICCLAW_PUBLIC_URL` to the resulting URL
before running Step 1, or update `public_url` in `~/.elasticclaw/hub.yaml`.

### Option A: Tailscale Funnel (public HTTPS)
```bash
# Requires Tailscale installed and logged in
tailscale funnel --bg 8080
# Gives you: https://hostname.tail-xyz.ts.net
```

### Option B: Tailscale Serve (private network only)
Use this if your VMs are on the same Tailnet as the hub:
```bash
tailscale serve --bg 8080
# Gives you: https://hostname.tail-xyz.ts.net (Tailnet-only)
```
Claws must also be on the Tailnet. Good for private setups.

### Option C: ngrok
```bash
# Requires ngrok installed and authenticated
ngrok http 8080
# Gives you: https://abc123.ngrok.io
```
For a stable URL across restarts, use a reserved domain in ngrok's dashboard.

### Option D: Cloudflare Tunnel
```bash
# Requires cloudflared installed and a Cloudflare account
cloudflared tunnel --url http://localhost:8080
# Gives you: https://random-name.trycloudflare.com
# For a permanent URL: set up a named tunnel via the Cloudflare dashboard
```

### Option E: No tunnel tool available (fallback)
If none of the above are available, use `serveo.net` or `localhost.run` —
both work with plain SSH and require no account or installation:
```bash
# serveo.net
ssh -R 80:localhost:8080 serveo.net
# Gives you: https://abc.serveo.net

# OR localhost.run
ssh -R 80:localhost:8080 localhost.run
# Gives you: https://abc.lhr.life
```
These are public shared services — fine for testing, not for production.

### After getting your URL

Update your hub config:
```bash
# Edit ~/.elasticclaw/hub.yaml and set:
# public_url: https://your-url-here
```

Or re-run hub init with the URL:
```bash
elasticclaw hub init --force --public-url https://your-url-here
```

## Step 3: Start the hub

```bash
elasticclaw hub &
```

The hub listens on `:8080` by default. Verify it's running:

```bash
curl http://localhost:8080/healthz
```

Expected: `{"ok":true,"status":"live"}`

## Step 4: Configure providers and API keys

Edit `~/.elasticclaw/hub.yaml` to add your provider and LLM config.
The file was created in Step 1 — append these sections:

```yaml
# Default LLM for agents
default_model: anthropic/claude-sonnet-4-6

# LLM API keys
llm_keys:
  anthropic: sk-ant-...   # your Anthropic API key

# VM provider (Replicated CMX)
providers:
  replicated:
    token: rep_...          # your Replicated API token
    default_instance_type: r1.large
    default_ttl: 48h
```

Save the file. The hub picks up config on next start.

## Step 5: Connect your client

On the machine where you'll run `elasticclaw` commands, save the connection info:

```bash
elasticclaw login <hub-url> --token <token-from-step-1>
```

Where `<hub-url>` is either `http://localhost:8080` (if running locally) or the public URL you set.

## Step 6: Create your first claw

```bash
elasticclaw create --name my-claw --template <template-name>
```

Templates live in `.elasticclaw/templates/<name>/` in your project, or `~/.elasticclaw/templates/<name>/` globally.

## Step 7: Chat with your claw

```bash
elasticclaw chat my-claw
```

## Notes

- `~/.elasticclaw/hub.yaml` contains your tokens. Keep it secret.
- The hub must be reachable from the VM provider (configure `public_url` in hub.yaml if needed).
- For provider setup (Replicated CMX etc): https://elasticclaw.ai/docs/providers
- Full documentation: https://elasticclaw.ai/docs
