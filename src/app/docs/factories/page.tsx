import type { Metadata } from "next";
import { DocsPage, CodeBlock, Section, Note } from "@/components/docs-page";

export const metadata: Metadata = { title: "Factories" };

export default function FactoriesPage() {
  return (
    <DocsPage
      title="Factories"
      description="Factories automatically spawn and terminate claws in response to external events — like a Linear issue entering a status."
    >
      <Note>
        Factories are currently in beta. The Linear factory is the first
        supported trigger. More triggers (GitHub, webhooks, cron) are planned.
      </Note>

      <Section title="How factories work">
        <p>
          A factory watches an external system for events. When a trigger
          condition is met, it spawns a new claw pre-loaded with context from
          that event. When the condition is no longer met (or the claw signals
          it&apos;s done), the factory terminates the claw.
        </p>
        <p className="mt-2">
          For Linear: a factory watches for issues entering a specific status
          (e.g. <code>In Progress</code>). It creates a claw with the issue
          title, description, and metadata injected into{" "}
          <code>CONTEXT.md</code>. When the claw sends{" "}
          <code>[DONE]</code> in a message, the factory moves the Linear issue
          to a completion status and terminates the claw.
        </p>
      </Section>

      <Section title="Setting up a Linear factory">
        <h3 className="text-sm font-semibold text-zinc-200 mb-2">
          1. Get your webhook URL
        </h3>
        <p>
          Your hub exposes a webhook endpoint for Linear. The URL is:
        </p>
        <CodeBlock lang="bash">{`https://<your-hub-domain>/api/integrations/linear/webhook`}</CodeBlock>
        <p className="mt-2">
          You can also find this in the <strong>Settings → Factories</strong>{" "}
          page of your hub web UI.
        </p>

        <h3 className="text-sm font-semibold text-zinc-200 mt-6 mb-2">
          2. Create a Linear webhook
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400">
          <li>
            Go to <strong>Linear → Settings → API → Webhooks</strong>
          </li>
          <li>
            Click <strong>New webhook</strong>
          </li>
          <li>
            Paste your webhook URL
          </li>
          <li>
            Under <strong>Data change events</strong>, check <strong>Issues</strong>
          </li>
          <li>
            Copy the <strong>Signing secret</strong> — you&apos;ll need it for{" "}
            <code>hub.yaml</code>
          </li>
          <li>
            Click <strong>Create webhook</strong>
          </li>
        </ol>

        <h3 className="text-sm font-semibold text-zinc-200 mt-6 mb-2">
          3. Get a Linear API key
        </h3>
        <p>
          The factory needs a Linear API token to move issues and read state
          names.
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400">
          <li>
            Go to <strong>Linear → Settings → API → Personal API Keys</strong>
          </li>
          <li>Click <strong>Create key</strong>, name it <em>elasticclaw</em></li>
          <li>Copy the key</li>
        </ol>

        <h3 className="text-sm font-semibold text-zinc-200 mt-6 mb-2">
          4. Configure hub.yaml
        </h3>
        <p>
          Add the integration and factory config to{" "}
          <code>/etc/elasticclaw/hub.yaml</code> (system install) or{" "}
          <code>~/.elasticclaw/hub.yaml</code> (local install):
        </p>
        <CodeBlock lang="yaml">{`integrations:
  linear:
    - workspace: your-workspace-name   # Linear workspace URL slug
      api_key: lin_api_...             # Linear API key
      webhook_secret: whsec_...        # Signing secret from step 2

factories:
  - name: feature-factory
    trigger:
      type: linear
      workspace: your-workspace-name
      trigger_status: "In Progress"    # Issue status that spawns a claw
      done_status: "Done"              # Issue status to set when claw finishes
    template: base                     # elasticclaw template to use`}</CodeBlock>

        <Note>
          Restart the hub after editing hub.yaml:{" "}
          <code>sudo systemctl restart elasticclaw</code>
        </Note>

        <h3 className="text-sm font-semibold text-zinc-200 mt-6 mb-2">
          5. Test it
        </h3>
        <p>
          Move a Linear issue into your trigger status. Within a few seconds, a
          new claw should appear in your dashboard with the issue details in its
          context.
        </p>
        <p className="mt-2">
          The claw&apos;s <code>CONTEXT.md</code> will contain:
        </p>
        <CodeBlock lang="markdown">{`# Linear Issue Context

**Title:** Fix login redirect bug
**ID:** ENG-123
**Status:** In Progress
**URL:** https://linear.app/your-workspace/issue/ENG-123

## Description
Users are being redirected to /404 after login when...`}</CodeBlock>
      </Section>

      <Section title="The [DONE] signal">
        <p>
          When a claw is finished with its task, it sends{" "}
          <code>[DONE]</code> as a message. The factory engine:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-sm text-zinc-400 mt-2">
          <li>Moves the Linear issue to <code>done_status</code></li>
          <li>Terminates the claw</li>
        </ol>
        <p className="mt-2">
          Your agent template should be instructed to send{" "}
          <code>[DONE]</code> when finished. Add this to your{" "}
          <code>AGENTS.md</code> or <code>SOUL.md</code>:
        </p>
        <CodeBlock lang="markdown">{`When you have completed the assigned task, send exactly:
[DONE]
This signals the factory to close the Linear issue and terminate this session.`}</CodeBlock>
      </Section>

      <Section title="One claw per issue">
        <p>
          The factory enforces a 1:1 mapping between Linear issues and claws.
          If an issue is already assigned to a claw and enters the trigger
          status again (e.g. re-opened), a new claw will not be spawned. The
          existing claw continues.
        </p>
      </Section>
    </DocsPage>
  );
}
