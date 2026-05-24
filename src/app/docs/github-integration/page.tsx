import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";
import { YouTubeVideo } from "@/components/youtube-video";

export const metadata: Metadata = { title: "GitHub Integration" };

export default function GitHubIntegrationPage() {
  return (
    <DocsPage
      title="GitHub Integration"
      description="Connect ElasticClaw to GitHub so agents can read code, write code, and manage pull requests with scoped installation tokens."
    >
      <Section title="How it works">
        <p>
          ElasticClaw uses a GitHub App (not a personal access token) for
          integration. The app is installed on your org or repos, and
          ElasticClaw authenticates as the app to act on your behalf.
        </p>
        <p>Agents can:</p>
        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
          <li>Clone and read repositories installed on the app</li>
          <li>Create branches and push commits</li>
          <li>Open, update, and manage pull requests</li>
          <li>Read checks and publish status updates when workflows need them</li>
          <li>Clone private repos using the app&apos;s installation token</li>
        </ul>
      </Section>

      <Section title="Configure GitHub App access">
        <YouTubeVideo
          title="Configure ElasticClaw GitHub App repo access"
          videoId="AqrYPz2--qE"
        />
      </Section>

      <Section title="Why a GitHub App instead of a PAT?">
        <p>
          A personal access token belongs to a human user. If you give it to an
          agent system, every agent effectively inherits that user's reachable
          repositories and permissions. That is too broad for automated coding
          work.
        </p>
        <p>
          GitHub Apps give ElasticClaw a narrower security model:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm mt-2 text-zinc-400">
          <li><strong>Repo-scoped installs</strong> — install the app only on repos agents should access</li>
          <li><strong>Permission-scoped access</strong> — request only contents, pull requests, checks, and any issue-tracker permissions needed by the workflow</li>
          <li><strong>Short-lived tokens</strong> — ElasticClaw Server mints installation tokens when an agent needs repo access instead of storing a long-lived user token</li>
          <li><strong>Bot identity</strong> — commits, comments, and PRs are attributed to the app instead of a maintainer's personal account</li>
          <li><strong>Revocation boundary</strong> — uninstalling or restricting the app cuts off access without rotating a human's credentials</li>
        </ul>
        <p className="mt-3">
          In practice, this lets each workspace declare the repos it needs and
          lets ElasticClaw Server mint a token for that installation at agent creation time.
        </p>
      </Section>

      <Section title="1. Create a GitHub App">
        <ol className="list-decimal list-inside space-y-3 text-sm">
          <li>
            Go to <strong>GitHub → Settings → Developer Settings → GitHub Apps → New GitHub App</strong>
          </li>
          <li>Set the app name, homepage URL, and callback URL (or use a placeholder)</li>
          <li>
            Enable these permissions:
            <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-zinc-400">
              <li>Repository: Contents (read & write)</li>
              <li>Repository: Issues (read & write)</li>
              <li>Repository: Pull requests (read & write)</li>
              <li>Repository: Checks (read & write)</li>
            </ul>
          </li>
          <li>Generate and download a private key (.pem file)</li>
          <li>Note the App ID from the app settings page</li>
        </ol>
      </Section>

      <Section title="2. Install the App">
        <p>
          On the app settings page, click <strong>Install App</strong> and
          select the repos or org you want ElasticClaw to access. ElasticClaw
          discovers the matching installation for each requested repo at runtime;
          you do not configure an installation ID.
        </p>
      </Section>

      <Section title="3. Add the app to a workspace">
        <p>
          Store GitHub App credentials on the workspace that needs repository
          access. You can use the server settings UI or the CLI:
        </p>
        <CodeBlock lang="bash">{`elasticclaw github-app create app-bot \\
  --workspace my-app \\
  --app-id 123456 \\
  --url https://github.com/apps/my-app \\
  --installation my-org \\
  --private-key-file ./my-app.private-key.pem

elasticclaw github-app list --workspace my-app`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          ElasticClaw Server tries the GitHub Apps configured on the workspace to find an
          installation that covers the requested repos. One app can cover
          multiple orgs if installed on all of them.
        </p>
      </Section>

      <Section title="Workspace repo access">
        <p>
          Workspaces can specify which repos the agent needs access to:
        </p>
        <CodeBlock lang="yaml">{`# elasticclaw-config.yaml
repositories:
  - repo: "my-org/my-repo"
    permissions: "write"
  - repo: "my-org/other-repo"
    permissions: "read"`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          ElasticClaw Server resolves the right GitHub App installation and mints a token
          with the requested repo permissions. <code>permissions</code> is either
          <code>read</code> or <code>write</code>; omitted values default to read.
        </p>
      </Section>

      <Note>
        Keep your private key (.pem) out of version control. Add it to{" "}
        <code>.gitignore</code> and store it in a secrets manager.
      </Note>
    </DocsPage>
  );
}
