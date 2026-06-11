import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Workflow Volumes" };

export default function WorkflowVolumesPage() {
  return (
    <DocsPage
      title="Workflow Volumes"
      description="Attach hub-managed artifact-backed directories to workflow agents for non-Git data that should persist across runs."
    >
      <Section title="Overview">
        <p>
          Workflow volumes let a workflow mount data that belongs to the hub
          instead of the Git repository. Use volumes for caches, downloaded
          datasets, generated indexes, model artifacts, or other files that an
          agent needs during a run but should not commit to GitHub.
        </p>
        <p className="mt-2">
          Volumes are stored through ElasticClaw artifact storage. The hub keeps
          lease metadata in the database, while the artifact store holds the
          archived directory contents. Configure artifact storage with local or
          S3-compatible storage before relying on volumes for durable data.
        </p>
      </Section>

      <Section title="Workflow configuration">
        <p>
          Add <code>volumes</code> at the top level of a workflow. Each volume
          has a hub source, an absolute mount path outside the repository
          workspace, and a mode.
        </p>
        <CodeBlock lang="yaml">{`schema_version: v1
name: nightly-index

trigger:
  cron:
    schedule: "0 3 * * *"
    timezone: UTC

volumes:
  - name: dependency-cache
    source: hub://volumes/dependency-cache
    mount: /home/daytona/.elasticclaw/volumes/dependency-cache
    mode: rw
  - name: reference-data
    source: hub://volumes/reference-data:v1
    mount: /home/daytona/.elasticclaw/volumes/reference-data
    mode: ro

stages:
  - id: working
    entry: true
    on_enter:
      inject: |
        Use /home/daytona/.elasticclaw/volumes/reference-data for inputs.
        Store reusable generated files in /home/daytona/.elasticclaw/volumes/dependency-cache.

  - id: done
    terminal: true
    triggers:
      - message_contains: "[DONE]"`}</CodeBlock>
      </Section>

      <Section title="Fields">
        <div className="space-y-3 text-sm text-zinc-400">
          <p><code className="text-cyan-300">name</code> - Workflow-local volume name. Use letters, numbers, hyphens, or underscores.</p>
          <p><code className="text-cyan-300">source</code> - Hub volume ref in the form <code>hub://volumes/&lt;name&gt;</code> or <code>hub://volumes/&lt;name&gt;:&lt;tag&gt;</code>. Untagged refs use <code>latest</code>.</p>
          <p><code className="text-cyan-300">mount</code> - Absolute path where the volume is extracted inside the sandbox. It must be outside the repository workspace.</p>
          <p><code className="text-cyan-300">mode</code> - <code>ro</code> for read-only or <code>rw</code> for read/write. Defaults to <code>ro</code>.</p>
        </div>
      </Section>

      <Section title="Read-only and read/write leases">
        <p>
          The hub leases every configured volume before the workflow agent runs.
          Read-only volumes can be attached by many workflow runs at the same
          time. Read/write volumes take an exclusive lease so only one active
          run can modify that volume ref.
        </p>
        <p className="mt-2">
          When a read/write workflow finishes or is stopped by the hub,
          ElasticClaw asks the bridge to upload the mounted directory back to the
          hub. The hub stores a new artifact manifest and updates the volume ref.
        </p>
        <Note>
          RWX/shared-writer semantics are intentionally not supported. Use one
          read/write workflow run at a time for a given volume ref, or split data
          across separate volume names or tags.
        </Note>
      </Section>

      <Section title="Storage backend">
        <p>
          Volumes use the same <code>artifact_storage</code> configuration as
          other hub-owned artifacts. Local storage is the default. Use S3-compatible
          storage when the hub should store volume data outside the hub filesystem.
        </p>
        <CodeBlock lang="yaml">{`artifact_storage:
  backend: s3
  s3:
    bucket: elasticclaw-artifacts
    region: us-east-1
    prefix: production
    access_key_id: ${"${ELASTICCLAW_ARTIFACTS_ACCESS_KEY_ID}"}
    secret_access_key: ${"${ELASTICCLAW_ARTIFACTS_SECRET_ACCESS_KEY}"}`}</CodeBlock>
        <p>
          See <a href="/docs/artifact-storage" className="text-cyan-300">Artifact Storage</a> for local path and S3-compatible endpoint examples.
        </p>
      </Section>

      <Section title="Mount path guidance">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Mount volumes outside <code>/home/daytona/.openclaw/workspace</code>
            and outside <code>/workspace</code>. Repository paths are blocked so
            volume files do not look like normal Git working tree files.
          </li>
          <li>
            Use a stable path such as <code>/home/daytona/.elasticclaw/volumes/&lt;name&gt;</code>
            and mention it in the stage instructions or command configuration.
          </li>
          <li>
            Do not store secrets in volumes. Use workspace secrets for sensitive
            values that should be injected as environment variables.
          </li>
        </ul>
      </Section>

      <Section title="Operational notes">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Volume data is transferred as compressed tar archives between the
            hub and the bridge. Large volumes add startup and shutdown time.
          </li>
          <li>
            Back up both the hub database and artifact storage. The artifact
            store contains volume bytes; the database contains lease and workflow
            metadata.
          </li>
          <li>
            If a workflow crashes before a read/write sync completes, the last
            successfully stored manifest remains the current volume ref.
          </li>
        </ul>
      </Section>
    </DocsPage>
  );
}
