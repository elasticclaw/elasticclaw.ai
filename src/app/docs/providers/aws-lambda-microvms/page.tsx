import type { Metadata } from "next";
import Link from "next/link";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "AWS Lambda MicroVMs Provider" };

export default function AWSLambdaMicroVMsProviderPage() {
  return (
    <DocsPage
      title="AWS Lambda MicroVMs Provider"
      description="Plan and configure AWS Lambda MicroVMs as an alpha ElasticClaw sandbox provider."
    >
      <Section title="Status">
        <div className="space-y-2 text-sm text-zinc-400">
          <p><strong>Status:</strong> Alpha</p>
          <p><strong>Type:</strong> Stateful Firecracker MicroVM sandbox</p>
          <p><strong>Auth:</strong> AWS credentials available to the ElasticClaw hub process</p>
          <p><strong>Capabilities:</strong> <code className="text-cyan-300">exec</code>, <code className="text-cyan-300">stateful</code>, <code className="text-cyan-300">https-bridge</code></p>
          <p><strong>Best for:</strong> Strong per-agent VM isolation without managing a VM fleet</p>
        </div>
      </Section>

      <Section title="The image identifier is not a Docker image">
        <p>
          The provider launches MicroVMs with <code>aws lambda-microvms run-microvm</code>.
          That command expects an AWS Lambda MicroVM Image ARN, for example:
        </p>
        <CodeBlock lang="text">{`arn:aws:lambda:us-east-1:123456789012:microvm-image:elasticclaw-base`}</CodeBlock>
        <p>
          A public Docker Hub, GHCR, or ECR image cannot be used directly as the
          <code> image_identifier</code>. AWS first builds a Lambda MicroVM Image
          from a Dockerfile and code artifact, initializes it, and snapshots the
          running disk and memory. ElasticClaw then launches agents from that
          AWS image ARN.
        </p>
        <Note>
          Publishing a public container image is still useful as source material,
          but each AWS account needs a Lambda MicroVM Image resource before it can
          run MicroVMs.
        </Note>
      </Section>

      <Section title="Recommended ElasticClaw base image">
        <p>
          The easiest operator experience is for ElasticClaw to publish a base
          MicroVM source package that users can import into their AWS account.
          That package should include:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>A Dockerfile based on <code>public.ecr.aws/lambda/microvms:al2023-minimal</code>.</li>
          <li>The ElasticClaw bridge entrypoint listening on the configured bridge port.</li>
          <li>Required runtime tools such as Git, Node.js/npm, shell utilities, and OpenClaw.</li>
          <li>A run hook handler that reads the ElasticClaw payload and starts the bridge with the supplied environment.</li>
        </ul>
        <p>
          Advanced users can still build their own image and set
          <code> image_identifier</code> to their custom MicroVM Image ARN.
        </p>
      </Section>

      <Section title="AWS setup flow">
        <p>
          Until ElasticClaw ships a setup command, treat this as the manual
          account bootstrap flow:
        </p>
        <ol className="list-decimal list-inside space-y-3 text-sm">
          <li>Create an S3 bucket for Lambda MicroVM build artifacts.</li>
          <li>Package the ElasticClaw MicroVM source bundle as a zip and upload it to S3.</li>
          <li>Create an IAM build role that Lambda MicroVMs can use while building the image.</li>
          <li>Create an IAM execution role for launched MicroVMs.</li>
          <li>Run <code>create-microvm-image</code> with the S3 artifact and AWS base image ARN.</li>
          <li>Wait for the image to become ready, then copy its MicroVM Image ARN.</li>
          <li>Configure ElasticClaw with that ARN as <code>image_identifier</code>.</li>
        </ol>
        <CodeBlock lang="bash">{`aws lambda-microvms create-microvm-image \\
  --code-artifact uri=s3://my-elasticclaw-microvms/elasticclaw-microvm-base.zip \\
  --name elasticclaw-base \\
  --base-image-arn arn:aws:lambda:us-east-1:aws:microvm-image:al2023-1 \\
  --build-role-arn arn:aws:iam::123456789012:role/ElasticClawMicroVMBuildRole`}</CodeBlock>
        <CodeBlock lang="bash">{`aws lambda-microvms run-microvm \\
  --image-identifier arn:aws:lambda:us-east-1:123456789012:microvm-image:elasticclaw-base \\
  --execution-role-arn arn:aws:iam::123456789012:role/ElasticClawMicroVMExecutionRole`}</CodeBlock>
      </Section>

      <Section title="Configure hub.yaml">
        <CodeBlock lang="yaml">{`providers:
  lambda-microvms:
    aws_region: us-east-1
    image_identifier: arn:aws:lambda:us-east-1:123456789012:microvm-image:elasticclaw-base
    execution_role_arn: arn:aws:iam::123456789012:role/ElasticClawMicroVMExecutionRole
    bridge_port: 8080
    maximum_duration_seconds: 28800
    idle_max_duration_seconds: 900
    suspended_duration_seconds: 300
    auto_resume: true`}</CodeBlock>
        <p className="text-sm text-zinc-400">
          The hub process must have AWS credentials that can run, inspect,
          suspend, resume, terminate, and mint proxy auth tokens for Lambda
          MicroVMs.
        </p>
      </Section>

      <Section title="Use in workspaces">
        <CodeBlock lang="yaml">{`# elasticclaw-config.yaml
provider: lambda-microvms`}</CodeBlock>
        <p className="text-sm text-zinc-400">
          The workspace still controls repositories, secrets, model selection,
          and workflow behavior. The provider controls where the agent runs.
        </p>
      </Section>

      <Section title="Future setup command">
        <p>
          A productized setup command should make the default path one command
          instead of a manual AWS build sequence:
        </p>
        <CodeBlock lang="bash">{`elasticclaw provider aws-lambda-microvms bootstrap \\
  --region us-east-1 \\
  --artifact-bucket my-elasticclaw-microvms \\
  --image-name elasticclaw-base`}</CodeBlock>
        <p>
          That command can upload the ElasticClaw base bundle, create or validate
          IAM roles, call <code>create-microvm-image</code>, wait for readiness,
          and write the resulting <code>image_identifier</code> into hub config.
        </p>
      </Section>

      <Section title="References">
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            <a
              href="https://aws.amazon.com/blogs/aws/run-isolated-sandboxes-with-full-lifecycle-control-aws-lambda-introduces-microvms/"
              className="text-cyan-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS launch post for Lambda MicroVMs
            </a>
          </li>
          <li>
            <Link href="/docs/providers" className="text-cyan-400 hover:underline">
              Provider overview
            </Link>
          </li>
        </ul>
      </Section>
    </DocsPage>
  );
}
