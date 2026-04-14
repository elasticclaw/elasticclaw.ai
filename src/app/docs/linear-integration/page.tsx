import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Linear Integration" };

export default function LinearIntegrationPage() {
  return (
    <DocsPage
      title="Linear Integration"
      description="Connect ElasticClaw to Linear to sync agent tasks with your team's issues and projects."
    >
      <Section title="How it works">
        <p>
          ElasticClaw uses the Linear API to read and update issues. When an
          agent is created with a Linear ticket linked, it can:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
          <li>Read the issue title, description, and comments</li>
          <li>Post progress updates as issue comments</li>
          <li>Move issues through workflow states (e.g., In Progress → Done)</li>
          <li>Link PRs back to Linear issues</li>
        </ul>
      </Section>

      <Section title="1. Create a Linear API Token">
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>
            Go to <strong>Linear → Settings → API → Personal API Keys</strong>
          </li>
          <li>Click <strong>Create key</strong>, give it a name like &quot;ElasticClaw&quot;</li>
          <li>Copy the token — you won&apos;t see it again</li>
        </ol>
        <CodeBlock lang="bash">{`export LINEAR_API_TOKEN=lin_api_xxxxxxxxxxxxx`}</CodeBlock>
      </Section>

      <Section title="2. Find Your Team ID">
        <p>
          Query the Linear GraphQL API to get your team&apos;s ID:
        </p>
        <CodeBlock lang="bash">{`curl -s -H "Authorization: \${LINEAR_API_TOKEN}" \\
     -H "Content-Type: application/json" \\
     -d '{"query": "{ teams { nodes { id name } } }"}' \\
     https://api.linear.app/graphql | jq '.data.teams.nodes'`}</CodeBlock>
        <p>
          Copy the <code className="text-cyan-300">id</code> for your team.
        </p>
      </Section>

      <Section title="3. Configure hub.yaml">
        <CodeBlock lang="yaml">{`integrations:
  linear:
    token: \${LINEAR_API_TOKEN}
    team_id: \${LINEAR_TEAM_ID}   # e.g. d513e4f1-4d0c-463e-b9a1-200d2f628309`}</CodeBlock>
      </Section>

      <Section title="Linking an Agent to a Ticket">
        <p>
          When creating an agent, pass a Linear issue ID:
        </p>
        <CodeBlock lang="bash">{`elasticclaw create \\
  --name fix-login-bug \\
  --template my-template \\
  --linear-issue ENG-1234`}</CodeBlock>
        <p>
          The agent will read the issue on startup and post updates as it
          works.
        </p>
      </Section>

      <Note>
        Linear API tokens have full read/write access to your workspace. Use a
        dedicated service account for production deployments.
      </Note>
    </DocsPage>
  );
}
