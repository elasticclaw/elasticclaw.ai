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

## Step 2: Start the hub

```bash
elasticclaw hub &
```

The hub listens on `:8080` by default. Verify it's running:

```bash
curl http://localhost:8080/healthz
```

Expected: `{"ok":true,"status":"live"}`

## Step 3: Connect your client

On the machine where you'll run `elasticclaw` commands, save the connection info:

```bash
elasticclaw login <hub-url> --token <token-from-step-1>
```

Where `<hub-url>` is either `http://localhost:8080` (if running locally) or the public URL you set.

## Step 4: Create your first claw

```bash
elasticclaw create --name my-claw --template <template-name>
```

Templates live in `.elasticclaw/templates/<name>/` in your project, or `~/.elasticclaw/templates/<name>/` globally.

## Step 5: Chat with your claw

```bash
elasticclaw chat my-claw
```

## Notes

- `~/.elasticclaw/hub.yaml` contains your tokens. Keep it secret.
- The hub must be reachable from the VM provider (configure `public_url` in hub.yaml if needed).
- For provider setup (Replicated CMX etc): https://elasticclaw.ai/docs/providers
- Full documentation: https://elasticclaw.ai/docs
