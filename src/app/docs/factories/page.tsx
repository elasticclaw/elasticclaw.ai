import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section } from "@/components/docs-page";
import { YouTubeVideo } from "@/components/youtube-video";

export const metadata: Metadata = { title: "Factories" };

export default function FactoriesPage() {
  return (
    <DocsPage
      title="Factories"
      description="Define issue-triggered software factories with triggers, templates, scoped credentials, lifecycle rules, and pipelines."
    >
      <Section title="How factories work">
        <p>
          A factory is the unit of automation in ElasticClaw. It watches an
          external system for events and turns matching work into a governed
          coding pipeline. When a trigger condition is met (e.g. an issue enters
          a status or gets a label), it spawns a new claw pre-loaded with context
          from that event and scoped access for the job. When the claw sends{" "}
          <code>[DONE] &lt;pr-url&gt;</code>, the factory moves the issue to the
          configured finished status, records the PR, and keeps the claw alive
          to watch PR activity. Terminal pipeline stages or PR merge/close events
          can terminate the claw.
        </p>
        <p className="mt-2">
          Use factories for repeatable workstreams: dark factories, software
          factories, dependency updates, docs queues, bug lanes, and feature
          request queues. The sandbox is just where the work runs; the factory
          owns when work starts, what credentials are granted, and how the job
          finishes.
        </p>
        <p className="mt-2">
          If <code>terminate_on_leave: true</code> is set, dragging the issue back
          out of the trigger status will kill the claw and its sandbox for Linear,
          Shortcut, and GitHub Issues factories.
        </p>
      </Section>

      <Section title="Configure a factory">
        <YouTubeVideo
          title="Configure an ElasticClaw factory"
          videoId="kP5lQsxTaSU"
        />
      </Section>

      <Section title="Creating a factory">
        <CodeBlock lang="bash">{`elasticclaw factory create --name my-factory --integration linear`}</CodeBlock>
        <p className="text-sm text-zinc-400 mt-2">
          This creates <code>.elasticclaw/factories/my-factory/factory.yaml</code> and{" "}
          <code>pipeline.yaml</code>. Edit both files, then push:
        </p>
        <CodeBlock lang="bash">{`elasticclaw factory push my-factory`}</CodeBlock>
      </Section>

      <Section title="Factory fields">
        <div className="space-y-3 text-sm text-zinc-400">
          <p><code className="text-cyan-300">name</code> — Factory identifier (slug)</p>
          <p><code className="text-cyan-300">schema_version</code> — Optional schema marker; defaults to <code>v1</code></p>
          <p><code className="text-cyan-300">integration</code> — <code>linear</code>, <code>shortcut</code>, <code>github-issues</code>, <code>github</code>, or <code>external</code></p>
          <p><code className="text-cyan-300">workspace</code> — Matches integrations.&lt;type&gt;[].workspace</p>
          <p><code className="text-cyan-300">team</code> — Linear team key filter (e.g. "ELA")</p>
          <p><code className="text-cyan-300">trigger_status</code> — Entering this status/label → create claw</p>
          <p><code className="text-cyan-300">working_status</code> — Optional status set after a non-pending claw starts</p>
          <p><code className="text-cyan-300">finished_status</code> — Status set when <code>[DONE]</code> is accepted; falls back to <code>done_status</code></p>
          <p><code className="text-cyan-300">done_status</code> — Status set when a tracked PR is merged, and backward-compatible fallback for <code>finished_status</code></p>
          <p><code className="text-cyan-300">terminate_on_leave</code> — Kill claw when issue leaves trigger status</p>
          <p><code className="text-cyan-300">template</code> — Template name (must be pushed to hub first)</p>
          <p><code className="text-cyan-300">provider</code> — Override default provider for this factory</p>
          <p><code className="text-cyan-300">name_pattern</code> — Dynamic claw name: <code>{"{issue_id}"}</code>, <code>{"{issue_number}"}</code>, <code>{"{repo}"}</code></p>
          <p><code className="text-cyan-300">webhook_secret</code> — Inline HMAC secret (use webhook_secret_ref instead)</p>
          <p><code className="text-cyan-300">webhook_secret_ref</code> — Reference to hub.yaml secrets map</p>
          <p><code className="text-cyan-300">secret_refs</code> — Env var to hub secret map injected into claws from this factory</p>
          <p><code className="text-cyan-300">tags</code> — Tags applied to created claws</p>
          <p><code className="text-cyan-300">color</code> — UI accent color for created claws</p>
          <p><code className="text-cyan-300">labels</code> — For Linear and GitHub Issues: all must be present (AND)</p>
          <p><code className="text-cyan-300">assigned_to</code> — For Linear and GitHub Issues: <code>@user</code>, <code>!@user</code>, <code>any</code>, <code>none</code></p>
          <p><code className="text-cyan-300">allowed_labelers</code> — GitHub Issues labeler allowlist</p>
          <p><code className="text-cyan-300">inputs</code> — Manual trigger inputs; types are <code>string</code>, <code>number</code>, <code>bool</code>, and <code>enum</code></p>
          <p><code className="text-cyan-300">concurrency_group</code> — Group name for concurrency limits; empty means <code>global</code></p>
          <p><code className="text-cyan-300">enable_manual_trigger</code> — Allow dashboard and CLI manual triggers</p>
          <p><code className="text-cyan-300">repos</code> — For <code>github</code> factories: repo patterns such as <code>owner/repo</code> or <code>owner/*</code></p>
          <p><code className="text-cyan-300">trigger</code> — For <code>github</code> factories: <code>on</code>, <code>action</code>, and optional filters</p>
          <p><code className="text-cyan-300">external_trigger</code> — For <code>external</code> factories: source and optional filters</p>
          <p><code className="text-cyan-300">enabled</code> — Set false to pause the factory (default: true)</p>
        </div>
      </Section>

      <Section title="The [DONE] signal">
        <p>
          When an agent finishes its task, it sends <code>[DONE]</code> followed by the
          PR URL as a chat message:
        </p>
        <CodeBlock lang="text">{`[DONE] https://github.com/org/repo/pull/42`}</CodeBlock>
        <p className="mt-2">The hub then:</p>
        <ol className="list-decimal list-inside space-y-1 text-sm text-zinc-400 mt-2">
          <li>Validates the PR is open</li>
          <li>Moves the issue/story to <code>finished_status</code>, or <code>done_status</code> if no finished status is set</li>
          <li>Keeps the claw alive to watch for CI failures and bugbot comments</li>
          <li>Terminates the claw when the PR is merged or closed</li>
        </ol>
        <p className="mt-3 text-sm text-zinc-400">
          Add this to your agent&apos;s <code>AGENTS.md</code>:
        </p>
        <CodeBlock lang="markdown">{`When your task is complete, open a PR and send:
[DONE] https://github.com/org/repo/pull/N

This moves the issue and keeps you alive to watch CI and review comments.
You'll terminate automatically when the PR merges.`}</CodeBlock>
      </Section>

      <Section title="Activity log">
        <p>
          Every webhook event is logged for 4 hours. Click <strong>Activity</strong> next to
          any factory in Settings to see:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400 mt-2">
          <li><code>claw_created</code> — issue entered trigger status, claw spawned</li>
          <li><code>claw_terminated</code> — issue left trigger status, claw killed</li>
          <li><code>error</code> — provisioning failed</li>
          <li><code>not_actionable</code> — webhook received but status didn&apos;t match</li>
        </ul>
      </Section>

      <Section title="1:1 enforcement">
        <p>
          Each issue/story can only have one active claw at a time. If the same issue
          is moved into the trigger status again while a claw already exists, a new
          one will not be created.
        </p>
      </Section>

      <Section title="CLI commands">
        <CodeBlock lang="bash">{`elasticclaw factory create --name my-factory --integration linear
elasticclaw factory push my-factory
elasticclaw factory list
elasticclaw factory show my-factory
elasticclaw factory trigger my-factory --input issue=ENG-123
elasticclaw factory rm my-factory`}</CodeBlock>
      </Section>
    </DocsPage>
  );
}
