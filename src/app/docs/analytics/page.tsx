import type { Metadata } from "next";
import { DocsPage, Section } from "@/components/docs-page";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <DocsPage
      title="Analytics"
      description="Track workflow usage, success rates, pull request outcomes, and recent automation events."
    >
      <Section title="Overview">
        <p>
          ElasticClaw Server records persistent analytics for workflows so you can see which
          automations are running, how often they succeed, and what happens after
          agents open pull requests.
        </p>
        <p>
          Open <strong>Settings → Analytics</strong> in the web UI to review
          workflow performance.
        </p>
      </Section>

      <Section title="Metrics">
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li><strong>Total triggers</strong> — how many times workflows fired</li>
          <li><strong>Success rate</strong> — percentage of agent creations that succeeded</li>
          <li><strong>PRs opened</strong> — number of pull requests created by workflow agents</li>
          <li><strong>PR merge rate</strong> — percentage of opened pull requests that merged</li>
          <li><strong>Run statuses</strong> — breakdown of clean, human_in_the_loop, warning, failed, and running runs</li>
          <li><strong>Cost and usage</strong> — estimated AI spend and token usage per model, run, and time range</li>
          <li><strong>Run history</strong> — per-workflow run records with status, trigger type, timestamps, and linked agent</li>
          <li><strong>Recent events</strong> — the latest workflow events with timestamps</li>
        </ul>
      </Section>

      <Section title="Run status taxonomy">
        <p>
          Runs are classified into one of five statuses based on their outcome
          and whether a human intervened.
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li><strong>clean</strong> — the run completed successfully and the PR merged, or no PR was required</li>
          <li><strong>human_in_the_loop</strong> — the run completed but a human comment or action influenced the outcome</li>
          <li><strong>warning</strong> — the run completed but a post-completion event (e.g. PR closed unmerged) was recorded</li>
          <li><strong>failed</strong> — the run stopped because of an error, timeout, or required gate failure</li>
          <li><strong>running</strong> — the run is still active</li>
        </ul>
      </Section>

      <Section title="Retention">
        <p>
          Analytics data is retained for up to 1 year. Use the time range selector
          to view the last 7, 30, or 90 days.
        </p>
      </Section>
    </DocsPage>
  );
}
