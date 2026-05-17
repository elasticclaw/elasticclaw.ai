import type { Metadata } from "next";
import { DocsPage, Section } from "@/components/docs-page";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <DocsPage
      title="Analytics"
      description="Track factory usage, success rates, pull request outcomes, and recent automation events."
    >
      <Section title="Overview">
        <p>
          The hub records persistent analytics for factories so you can see which
          automations are running, how often they succeed, and what happens after
          claws open pull requests.
        </p>
        <p>
          Open <strong>Settings → Analytics</strong> in the web UI to review
          factory performance.
        </p>
      </Section>

      <Section title="Metrics">
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
          <li><strong>Total triggers</strong> — how many times factories fired</li>
          <li><strong>Success rate</strong> — percentage of claw creations that succeeded</li>
          <li><strong>PRs opened</strong> — number of pull requests created by factory claws</li>
          <li><strong>PR merge rate</strong> — percentage of opened pull requests that merged</li>
          <li><strong>By trigger status</strong> — breakdown of which statuses triggered creation</li>
          <li><strong>Recent events</strong> — the latest factory events with timestamps</li>
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
