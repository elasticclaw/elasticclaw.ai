import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "GitHub Integration" };

export default function GitHubIntegrationPage() {
  return (
    <DocsPage
      title="GitHub Integration"
      description="Connect ElasticClaw to GitHub to let agents read issues, open pull requests, and leave review comments."
    >
      <Section title="How it works">
        <p>
          ElasticClaw uses a GitHub App (not a personal access token) for
          integration. The app is installed on your org or repos, and
          ElasticClaw authenticates as the app to act on your behalf.
        </p>
        <p>Agents can:</p>
        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
          <li>List and read issues and pull requests</li>
          <li>Create branches and open PRs</li>
          <li>Post comments and status checks</li>
          <li>Clone private repos using the app&apos;s installation token</li>
        </ul>
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
          select the repos or org you want ElasticClaw to access. Note the
          Installation ID from the URL after install.
        </p>
        <CodeBlock lang="text">{`https://github.com/settings/installations/12345678
                                              ^^^^^^^^
                                         installation_id`}</CodeBlock>
      </Section>

      <Section title="3. Configure hub.yaml">
        <CodeBlock lang="yaml">{`github_apps:
  - app_id: \${GITHUB_APP_ID}          # e.g. 123456
    private_key_pem: |
      -----BEGIN RSA PRIVATE KEY-----
      ...
    url: https://github.com/apps/my-app`}</CodeBlock>
        <p>Set environment variables:</p>
        <CodeBlock lang="bash">{`export GITHUB_APP_ID=123456`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          The hub tries each configured app to find one whose installation covers
          the requested repos. One app can cover multiple orgs if installed on all of them.
        </p>
      </Section>

      <Section title="Template repo access">
        <p>
          Templates can specify which repos the claw needs access to:
        </p>
        <CodeBlock lang="yaml">{`# elasticclaw-config.yaml
github:
  repos:
    - repo: "my-org/my-repo"
      permissions: "write"
    - repo: "my-org/other-repo"
      permissions: "read"`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          The hub resolves the right GitHub App installation and mints a token
          with the requested permissions.
        </p>
      </Section>

      <Note>
        Keep your private key (.pem) out of version control. Add it to{" "}
        <code>.gitignore</code> and store it in a secrets manager.
      </Note>
    </DocsPage>
  );
}
