# elasticclaw.ai

The marketing and documentation site for [ElasticClaw](https://github.com/elasticclaw/elasticclaw) — an open source platform for provisioning AI agents as ephemeral VMs.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com/)
- TypeScript
- pnpm
- Deployed on [Vercel](https://vercel.com/)

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
  app/
    page.tsx              # Landing page
    layout.tsx            # Root layout
    globals.css           # Global styles
    docs/
      layout.tsx          # Docs sidebar layout
      page.tsx            # Overview
      installation/       # Install docs
      hub/                # hub.yaml config docs
      templates/          # Template docs
      github-integration/ # GitHub App setup
      linear-integration/ # Linear token setup
      web-ui/             # elasticclaw-web docs
      providers/          # Replicated CMX docs
  components/
    docs-page.tsx         # Shared docs components
```

## Deployment

Deploys automatically to Vercel on push to `main`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/elasticclaw/elasticclaw.ai)

## License

MIT
