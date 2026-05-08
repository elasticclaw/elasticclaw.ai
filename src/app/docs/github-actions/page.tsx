import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "GitHub Actions" };

export default function GitHubActionsPage() {
  return (
    <DocsPage
      title="GitHub Actions"
      description="Publish factories and templates from your GitHub repository using ElasticClaw's official GitHub Actions."
    >
      <Section title="Overview">
        <p>
          ElasticClaw provides two GitHub Actions that let you publish and validate
          factories and templates directly from your CI/CD pipeline. These actions
          connect to the ElasticClaw Factory hub to push your configurations
          automatically on every push or pull request.
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
          <li>
            <code>elasticclaw/actions/publish-factory@main</code> — publishes a factory
            configuration to the hub
          </li>
          <li>
            <code>elasticclaw/actions/publish-template@main</code> — publishes a
            template configuration to the hub
          </li>
        </ul>
      </Section>

      <Section title="Required secrets">
        <p>Both actions require these repository secrets:</p>
        <CodeBlock lang="yaml">{`# Settings → Secrets and variables → Actions
ELASTICCLAW_TOKEN          # Your ElasticClaw API token
ELASTICCLAW_FACTORY_TOKEN  # Factory-specific token (if using factory auth)`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          The <code>token</code> input accepts either a direct API token or a factory
          token. Use <code>secrets.ELASTICCLAW_TOKEN</code> for general publishing,
          or <code>secrets.ELASTICCLAW_FACTORY_TOKEN</code> for factory-scoped access.
        </p>
      </Section>

      <Section title="Action inputs">
        <p>Both actions share the same inputs:</p>
        <CodeBlock lang="yaml">{`hub-endpoint:  # Required. ElasticClaw hub URL (e.g. https://factory.elasticclaw.ai)
token:         # Required. API token or factory token
path:          # Required. Path to the factory/template directory
dry-run:       # Optional. Set to 'true' to validate without publishing`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          The <code>path</code> should point to a directory containing your factory
          or template files (e.g., <code>.elasticclaw/factories/my-factory/</code> or{" "}
          <code>.elasticclaw/templates/my-template/</code>).
        </p>
      </Section>

      <Section title="Publish on push">
        <p>
          Automatically publish factories and templates when changes are pushed to{" "}
          <code>main</code>:
        </p>
        <CodeBlock lang="yaml">{`name: Publish Factory

on:
  push:
    branches:
      - main
    paths:
      - '.elasticclaw/**'
  workflow_dispatch:

jobs:
  publish:
    name: Publish to ElasticClaw Factory
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Publish factory
        uses: elasticclaw/actions/publish-factory@main
        with:
          hub-endpoint: https://factory.elasticclaw.ai
          token: \${{ secrets.ELASTICCLAW_TOKEN }}
          path: .elasticclaw/factories/my-factory

      - name: Publish template
        uses: elasticclaw/actions/publish-template@main
        with:
          hub-endpoint: https://factory.elasticclaw.ai
          token: \${{ secrets.ELASTICCLAW_TOKEN }}
          path: .elasticclaw/templates/my-template`}</CodeBlock>
      </Section>

      <Section title="Validate on pull request">
        <p>
          Validate factory and template configurations on every PR that touches{" "}
          <code>.elasticclaw/**</code> files, without actually publishing:
        </p>
        <CodeBlock lang="yaml">{`name: Validate Factory

on:
  pull_request:
    paths:
      - '.elasticclaw/**'

jobs:
  validate:
    name: Validate ElasticClaw Config
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Validate factory
        uses: elasticclaw/actions/publish-factory@main
        with:
          hub-endpoint: https://factory.elasticclaw.ai
          token: \${{ secrets.ELASTICCLAW_TOKEN }}
          path: .elasticclaw/factories/my-factory
          dry-run: true

      - name: Validate template
        uses: elasticclaw/actions/publish-template@main
        with:
          hub-endpoint: https://factory.elasticclaw.ai
          token: \${{ secrets.ELASTICCLAW_TOKEN }}
          path: .elasticclaw/templates/my-template
          dry-run: true`}</CodeBlock>
      </Section>

      <Section title="Directory structure">
        <p>Your repository should contain factories and templates in separate directories:</p>
        <CodeBlock lang="text">{`.elasticclaw/
  factories/
    my-factory/
      factory.yaml
      pipeline.yaml
  templates/
    my-template/
      elasticclaw-config.yaml
      AGENTS.md`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          The <code>path</code> input should point to the directory containing{" "}
          <code>factory.yaml</code> (for factories) or{" "}
          <code>elasticclaw-config.yaml</code> (for templates), not the individual
          file.
        </p>
      </Section>

      <Section title="Manual trigger">
        <p>
          The publish workflow includes <code>workflow_dispatch</code> so you can
          trigger it manually from the GitHub Actions tab. Add the same trigger to
          the validate workflow if you want to run validation on demand:
        </p>
        <CodeBlock lang="yaml">{`on:
  workflow_dispatch:
    inputs:
      path:
        description: 'Path to factory/template'
        required: true
        default: '.elasticclaw/factories/my-factory'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: elasticclaw/actions/publish-factory@main
        with:
          hub-endpoint: https://factory.elasticclaw.ai
          token: \${{ secrets.ELASTICCLAW_TOKEN }}
          path: \${{ inputs.path }}`}</CodeBlock>
      </Section>

      <Note>
        The <code>permissions: contents: read</code> declaration is the minimum
        required. The actions only need to read your repository contents to
        locate and publish the factory/template files.
      </Note>
    </DocsPage>
  );
}
