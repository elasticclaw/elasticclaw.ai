# ElasticClaw Setup Instructions for Agents

You are setting up ElasticClaw on a remote server. Follow these steps exactly.

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

## Step 4: Connect your client

> **Note:** Steps are now renumbered — original Steps 3-5 become 4-6.

On the machine where you'll run `elasticclaw` commands, save the connection info:

```bash
elasticclaw login <hub-url> --token <token-from-step-1>
```

Where `<hub-url>` is either `http://localhost:8080` (if running locally) or the public URL you set.

## Step 5: Create your first claw

```bash
elasticclaw create --name my-claw --template <template-name>
```

Templates live in `.elasticclaw/templates/<name>/` in your project, or `~/.elasticclaw/templates/<name>/` globally.

## Step 6: Chat with your claw

```bash
elasticclaw chat my-claw
```

## Notes

- `~/.elasticclaw/hub.yaml` contains your tokens. Keep it secret.
- The hub must be reachable from the VM provider (configure `public_url` in hub.yaml if needed).
- For provider setup (Replicated CMX etc): https://elasticclaw.ai/docs/providers
- Full documentation: https://elasticclaw.ai/docs
