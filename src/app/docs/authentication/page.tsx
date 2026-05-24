import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Authentication" };

export default function AuthenticationPage() {
  return (
    <DocsPage
      title="Authentication"
      description="Control access to the ElasticClaw Server web UI with GitHub OAuth and tag-based ACLs."
    >
      <Section title="Overview">
        <p>
          By default, the server web UI uses a single password (<code>ui_password</code> in
          <code>hub.yaml</code>). For team deployments, you can enable GitHub OAuth and
          tag-based access control to restrict who can view and interact with agents.
        </p>
      </Section>

      <Section title="GitHub OAuth">
        <p>
          When enabled, users sign in with their GitHub account. ElasticClaw Server validates their
          identity against allowlists (users, orgs, or teams).
        </p>

        <h3 className="text-sm font-semibold text-zinc-200 mt-4 mb-2">1. Create a GitHub OAuth App</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400">
          <li>Go to <strong>GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App</strong></li>
          <li>Authorization callback URL: <code>https://server.example.com/auth/github/callback</code></li>
          <li>Copy the Client ID and generate a Client Secret</li>
        </ol>

        <h3 className="text-sm font-semibold text-zinc-200 mt-4 mb-2">2. Configure hub.yaml</h3>
        <CodeBlock lang="yaml">{`auth:
  github_oauth:
    client_id: Ov23lixxxxxxxxxxxx
    client_secret: \${GITHUB_OAUTH_SECRET}
    allowed_users: []        # specific GitHub logins (empty = any)
    allowed_orgs: []          # org names (empty = any)
    allowed_teams: []         # "org/team" format (empty = any)
  disable_password_auth: false`}</CodeBlock>

        <h3 className="text-sm font-semibold text-zinc-200 mt-4 mb-2">Allowlist behavior</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li><code>allowed_users</code> — only these specific GitHub logins</li>
          <li><code>allowed_orgs</code> — any member of these orgs</li>
          <li><code>allowed_teams</code> — any member of these specific teams (format: <code>org/team</code>)</li>
        </ul>
        <Note>
          If <strong>all three allowlists are empty</strong>, any authenticated
          GitHub user can access ElasticClaw Server. This is the default and a common
          misconfiguration — populate at least one list before deploying to
          production.
        </Note>
      </Section>

      <Section title="Tag-based access control">
        <p>
          Beyond authentication, you can restrict what authenticated users can <em>do</em>
          based on agent tags. This is useful for multi-team setups where different teams
          manage different agents.
        </p>
        <CodeBlock lang="yaml">{`auth:
  access:
    admins: []                          # GitHub logins — bypass all tag checks
    view_requires_tags: ["frontend"]    # must have at least one matching tag to view
    interact_requires_tags: ["frontend"]`}</CodeBlock>
        <Note>
          Tag-based access control is enforced by the ElasticClaw Server API and WebSocket paths.
          <code>view_requires_tags</code> filters agent visibility, and
          <code>interact_requires_tags</code> gates chat, terminal, and mutating
          actions. Admins bypass all tag checks.
        </Note>
      </Section>

      <Section title="Disabling password auth">
        <p>
          Once GitHub OAuth is configured and working, you can disable the fallback
          password login:
        </p>
        <CodeBlock lang="yaml">{`auth:
  disable_password_auth: true`}</CodeBlock>
        <Note>
          Keep password auth enabled until you've verified OAuth works. If OAuth breaks,
          you'll be locked out without password fallback.
        </Note>
      </Section>

      <Section title="API endpoints">
        <div className="space-y-2 text-sm text-zinc-400">
          <p><code className="text-cyan-300">GET /api/settings</code> — Returns auth config (redacted secrets)</p>
          <p><code className="text-cyan-300">PATCH /api/settings</code> — Update auth config</p>
        </div>
      </Section>
    </DocsPage>
  );
}
