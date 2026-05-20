import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "GitHub Actions" };

export default function GitHubActionsPage() {
  return (
    <DocsPage
      title="GitHub Actions"
      description="Publish ElasticClaw templates and factories from GitHub Actions using the elasticclaw CLI."
    >
      <Note>
        The ElasticClaw source currently ships CLI commands for publishing
        templates and factories. It does not ship separate first-party GitHub
        Actions in this repository; use the CLI in your workflow.
      </Note>

      <Section title="Directory structure">
        <p>Your repository should keep local definitions under <code>.elasticclaw/</code>:</p>
        <CodeBlock lang="text">{`.elasticclaw/
  factories/
    my-factory/
      factory.yaml
      pipeline.yaml
  templates/
    my-template/
      elasticclaw-config.yaml
      AGENTS.md`}</CodeBlock>
      </Section>

      <Section title="Required secrets">
        <p>Store the hub URL and user token as repository secrets:</p>
        <CodeBlock lang="text">{`ELASTICCLAW_HUB_URL   # e.g. https://hub.example.com
ELASTICCLAW_TOKEN     # hub user token`}</CodeBlock>
      </Section>

      <Section title="Publish workflow">
        <CodeBlock lang="yaml">{`name: Publish ElasticClaw config

on:
  push:
    branches: [main]
    paths:
      - ".elasticclaw/**"
  workflow_dispatch:

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install elasticclaw
        env:
          ELASTICCLAW_VERSION: "2026.5.20"
        run: |
          set -euo pipefail
          base="https://github.com/elasticclaw/elasticclaw/releases/download/$ELASTICCLAW_VERSION"
          curl -fsSLO "$base/elasticclaw-linux-amd64"
          curl -fsSLO "$base/checksums.txt"
          grep " elasticclaw-linux-amd64$" checksums.txt | sha256sum -c -
          chmod +x elasticclaw-linux-amd64
          sudo mv elasticclaw-linux-amd64 /usr/local/bin/elasticclaw

      - name: Login
        run: elasticclaw login --hub "$ELASTICCLAW_HUB_URL" --token "$ELASTICCLAW_TOKEN"
        env:
          ELASTICCLAW_HUB_URL: \${{ secrets.ELASTICCLAW_HUB_URL }}
          ELASTICCLAW_TOKEN: \${{ secrets.ELASTICCLAW_TOKEN }}

      - name: Push templates
        run: |
          for dir in .elasticclaw/templates/*; do
            [ -d "$dir" ] || continue
            elasticclaw template push "$dir"
          done

      - name: Push factories
        run: elasticclaw factory push`}</CodeBlock>
      </Section>

      <Section title="Commands used">
        <div className="space-y-2 text-sm text-zinc-400">
          <p><code className="text-cyan-300">elasticclaw template push &lt;name-or-path&gt;</code> — Publishes one template directory.</p>
          <p><code className="text-cyan-300">elasticclaw factory push [name]</code> — Publishes all factories, or one named factory.</p>
        </div>
      </Section>

      <Note>
        Pin <code>ELASTICCLAW_VERSION</code> to a release you have reviewed.
        The workflow verifies the downloaded binary against the release&apos;s
        <code>checksums.txt</code> before installing it on the runner.
      </Note>
    </DocsPage>
  );
}
