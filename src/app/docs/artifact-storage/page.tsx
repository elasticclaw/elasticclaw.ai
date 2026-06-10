import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Artifact Storage" };

export default function ArtifactStoragePage() {
  return (
    <DocsPage
      title="Artifact Storage"
      description="Configure where ElasticClaw Server stores hub-owned artifacts such as checkpoint payloads, future volumes, and other large non-Git data."
    >
      <Section title="Overview">
        <p>
          Artifact storage is the hub-owned storage layer for data that should
          not live in GitHub. ElasticClaw uses content-addressed blobs,
          manifests, and refs so higher-level features can store structured
          artifacts without depending on a specific storage backend.
        </p>
        <p className="mt-2">
          The first supported backends are local filesystem storage and
          S3-compatible object storage. Checkpoints and volumes can build on the
          same artifact store, while the database keeps metadata, permissions,
          leases, and retention policy.
        </p>
      </Section>

      <Section title="Default local storage">
        <p>
          If <code>artifact_storage</code> is omitted, ElasticClaw Server uses a
          local filesystem store under the hub data directory.
        </p>
        <CodeBlock lang="text">{`~/.elasticclaw/
  hub.yaml
  hub.db
  artifacts/
    blobs/
    manifests/
    refs/`}</CodeBlock>
        <Note>
          System installs that use <code>/etc/elasticclaw/hub.yaml</code> store
          hub data under <code>/var/lib/elasticclaw</code>, so the default
          artifact path is <code>/var/lib/elasticclaw/artifacts</code>.
        </Note>
      </Section>

      <Section title="Custom local path">
        <p>
          Use a local backend with an explicit path when you want artifacts on a
          larger disk, mounted filesystem, or backup-managed directory.
        </p>
        <CodeBlock lang="yaml">{`artifact_storage:
  backend: local
  local:
    path: /var/lib/elasticclaw/artifacts`}</CodeBlock>
        <p>
          The hub process must be able to create directories and read/write files
          at this path. Local storage is simplest for single-node deployments.
        </p>
      </Section>

      <Section title="S3-compatible storage">
        <p>
          Use the <code>s3</code> backend to store artifact blobs, manifests, and
          refs in AWS S3 or an S3-compatible service such as MinIO, Cloudflare R2,
          or another object store.
        </p>
        <CodeBlock lang="yaml">{`artifact_storage:
  backend: s3
  s3:
    bucket: elasticclaw-artifacts
    region: us-east-1
    prefix: production
    access_key_id: \${ELASTICCLAW_ARTIFACTS_ACCESS_KEY_ID}
    secret_access_key: \${ELASTICCLAW_ARTIFACTS_SECRET_ACCESS_KEY}`}</CodeBlock>
        <p>
          The <code>prefix</code> is optional. Use it to isolate environments
          inside one bucket, for example <code>dev</code>, <code>staging</code>,
          or <code>production</code>.
        </p>
      </Section>

      <Section title="S3-compatible endpoint">
        <p>
          For non-AWS object stores, set <code>endpoint</code> and usually{" "}
          <code>path_style: true</code>.
        </p>
        <CodeBlock lang="yaml">{`artifact_storage:
  backend: s3
  s3:
    bucket: elasticclaw
    region: us-east-1
    endpoint: https://minio.example.com
    prefix: hub
    path_style: true
    access_key_id: \${MINIO_ACCESS_KEY_ID}
    secret_access_key: \${MINIO_SECRET_ACCESS_KEY}`}</CodeBlock>
        <Note>
          Keep artifact credentials scoped to the configured bucket and prefix
          when your object store supports it.
        </Note>
      </Section>

      <Section title="Configuration fields">
        <div className="space-y-4">
          {[
            {
              field: "artifact_storage.backend",
              desc: "Storage backend. Use local or s3. Defaults to local.",
            },
            {
              field: "artifact_storage.local.path",
              desc: "Filesystem path for local artifact storage. Defaults to <hub data dir>/artifacts.",
            },
            {
              field: "artifact_storage.s3.bucket",
              desc: "S3 bucket name for artifact objects.",
            },
            {
              field: "artifact_storage.s3.region",
              desc: "S3 region. Defaults to us-east-1 when omitted.",
            },
            {
              field: "artifact_storage.s3.endpoint",
              desc: "Optional S3-compatible endpoint URL for non-AWS object stores.",
            },
            {
              field: "artifact_storage.s3.prefix",
              desc: "Optional object key prefix used to isolate environments or hubs.",
            },
            {
              field: "artifact_storage.s3.access_key_id",
              desc: "Access key ID. Can reference an environment variable with ${...}.",
            },
            {
              field: "artifact_storage.s3.secret_access_key",
              desc: "Secret access key. Can reference an environment variable with ${...}.",
            },
            {
              field: "artifact_storage.s3.session_token",
              desc: "Optional session token for temporary credentials.",
            },
            {
              field: "artifact_storage.s3.path_style",
              desc: "Use path-style bucket URLs. Commonly required by S3-compatible stores.",
            },
          ].map((row) => (
            <div key={row.field} className="flex gap-4">
              <code className="text-cyan-300 shrink-0 text-sm">{row.field}</code>
              <span className="text-zinc-400 text-sm">{row.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Operational notes">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Artifact storage is not a Git remote. Agents only see this data when
            higher-level features, such as checkpoints or volumes, explicitly use
            it.
          </li>
          <li>
            The hub database remains the control plane for metadata. The artifact
            store holds the large content blobs, manifests, and refs.
          </li>
          <li>
            Back up both the hub database and artifact storage. Refs and blobs
            are useful only when the hub metadata still points at them.
          </li>
        </ul>
      </Section>
    </DocsPage>
  );
}
