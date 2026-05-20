import type { Metadata } from "next";
import Link from "next/link";
import { DocsPage, CodeBlock, Section } from "@/components/docs-page";
import { YouTubeVideo } from "@/components/youtube-video";

export const metadata: Metadata = { title: "Overview" };

export default function DocsOverviewPage() {
  return (
    <DocsPage
      title="Overview"
      description="ElasticClaw is an open source factory system for coding agents: issue tracker triggers, workflow pipelines, scoped GitHub credentials, and self-hosted execution."
    >
      <Section title="What is ElasticClaw?">
        <p>
          ElasticClaw turns external events into repeatable coding pipelines. A
          factory can watch Linear, GitHub Issues, Shortcut, webhooks, GitHub
          releases, or any other signal you want to use as a trigger; start the
          right agent from the right template; grant scoped GitHub access; drive
          the pull request through review and CI; and tear down the workspace
          when the job reaches a terminal state.
        </p>
        <p>
          Sandboxes are a critical part of the factory: they give each job an
          isolated place to clone, test, build, and push code. ElasticClaw adds
          the factory layer around that execution environment: triggers,
          workflow gates, credentials, context, and lifecycle policy that let
          teams run dark factories and software factories from their existing
          work queues.
        </p>
        <p>The core components are:</p>
        <div className="grid gap-4 mt-3 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/45 p-4">
            <h3 className="font-semibold text-zinc-100">Hub</h3>
            <p className="mt-1 text-sm text-zinc-400">
              The self-hosted control point: web dashboard, API,{" "}
              <code>hub.yaml</code>, GitHub App credentials, secrets,
              integrations, and factory state.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/45 p-4">
            <h3 className="font-semibold text-zinc-100">Factories</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Workstream definitions that decide when to start work, which
              template to use, what access to grant, and which pipeline drives
              the job through PR review, CI, merge, and cleanup.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/45 p-4">
            <h3 className="font-semibold text-zinc-100">Templates</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Reusable bootstrap definitions for a class of work: repos,
              files, instructions, secrets, MCP tools, model defaults, and
              provider settings.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/45 p-4">
            <h3 className="font-semibold text-zinc-100">Sandboxes</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Isolated execution environments from providers like Daytona,
              Replicated CMX, or exe.dev where claws clone, test, build, and
              push code.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/45 p-4">
            <h3 className="font-semibold text-zinc-100">Models and tools</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Named LLM keys, model defaults, and MCP servers that give claws
              the reasoning model and external tools required for the job.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/45 p-4">
            <h3 className="font-semibold text-zinc-100">Work sources</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Issue trackers and event sources such as Linear, GitHub Issues,
              Shortcut, webhooks, releases, and manual triggers.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Quick Start">
        <p>Install the CLI:</p>
        <CodeBlock lang="bash">{`brew tap elasticclaw/elasticclaw
brew install elasticclaw`}</CodeBlock>
        <p>
          From there, set up the pieces your factory needs:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400 mt-2">
          <li>
            <Link href="/docs/installation" className="text-cyan-400 hover:underline">
              Deploy a hub
            </Link>{" "}
            so factories, credentials, and claw lifecycle state have a home.
          </li>
          <li>
            <Link href="/docs/providers" className="text-cyan-400 hover:underline">
              Configure a sandbox provider
            </Link>{" "}
            so claws have an isolated place to clone, test, build, and push code.
          </li>
          <li>
            <Link href="/docs/github-integration" className="text-cyan-400 hover:underline">
              Configure a GitHub App
            </Link>{" "}
            so claws can receive scoped repo credentials and open pull requests.
          </li>
          <li>
            <Link href="/docs/templates" className="text-cyan-400 hover:underline">
              Create a template
            </Link>{" "}
            that defines the workspace, repos, instructions, tools, secrets, and model defaults.
          </li>
          <li>
            Connect an issue tracker such as{" "}
            <Link href="/docs/linear-integration" className="text-cyan-400 hover:underline">
              Linear
            </Link>
            ,{" "}
            <Link href="/docs/github-issues" className="text-cyan-400 hover:underline">
              GitHub Issues
            </Link>
            , or{" "}
            <Link href="/docs/shortcut-integration" className="text-cyan-400 hover:underline">
              Shortcut
            </Link>{" "}
            if the factory should start from ticket events.
          </li>
          <li>
            <Link href="/docs/factories" className="text-cyan-400 hover:underline">
              Connect a factory
            </Link>{" "}
            to an issue tracker, webhook, release event, or manual trigger.
          </li>
        </ol>
        <YouTubeVideo
          title="ElasticClaw general walkthrough"
          videoId="2h_-3HsV9Bo"
          className="my-6"
        />
      </Section>

      <Section title="Help the Launch">
        <p>
          ElasticClaw is open source and early. If it looks useful, starring the{" "}
          <a
            href="https://github.com/elasticclaw/elasticclaw"
            className="text-cyan-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub repo
          </a>{" "}
          helps other developers find it.
        </p>
        <p>
          If you try ElasticClaw, post honest feedback or a short demo and tag{" "}
          <a
            href="https://x.com/elasticclaw"
            className="text-cyan-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            @elasticclaw
          </a>
          . For stickers, send the link to{" "}
          <a href="mailto:marc@elasticclaw.ai" className="text-cyan-400 hover:underline">
            marc@elasticclaw.ai
          </a>
          . Useful feedback matters more than reach.
        </p>
      </Section>

      <Section title="Next Steps">
        <ul className="list-disc list-inside space-y-2">
          <li>
            <Link href="/docs/installation" className="text-cyan-400 hover:underline">
              Installation
            </Link>{" "}
            — all install methods, upgrade, remote server setup
          </li>
          <li>
            <Link href="/docs/cli-reference" className="text-cyan-400 hover:underline">
              CLI Reference
            </Link>{" "}
            — complete command reference
          </li>
          <li>
            <Link href="/docs/hub" className="text-cyan-400 hover:underline">
              Hub Config
            </Link>{" "}
            — configure providers, templates, auth, secrets, MCP servers
          </li>
          <li>
            <Link href="/docs/templates" className="text-cyan-400 hover:underline">
              Templates
            </Link>{" "}
            — build your own agent template
          </li>
          <li>
            <Link href="/docs/factories" className="text-cyan-400 hover:underline">
              Factories
            </Link>{" "}
            — define triggers, pipelines, access, and lifecycle rules
          </li>
          <li>
            <Link href="/docs/concepts" className="text-cyan-400 hover:underline">
              Concepts
            </Link>{" "}
            — architecture, factory pipeline, claw lifecycle
          </li>
          <li>
            <Link href="/docs/mcp-servers" className="text-cyan-400 hover:underline">
              MCP Servers
            </Link>{" "}
            — external tool servers for agents
          </li>
          <li>
            <Link href="/docs/providers" className="text-cyan-400 hover:underline">
              Sandbox Providers
            </Link>{" "}
            — configure where claws run: Daytona, Replicated CMX, or exe.dev
          </li>
        </ul>
      </Section>
    </DocsPage>
  );
}
