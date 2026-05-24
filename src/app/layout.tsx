import type { Metadata } from "next";
import "./globals.css";
import { PlausibleAnalytics } from "@/components/plausible-analytics";

export const metadata: Metadata = {
  title: "ElasticClaw — Workspaces and workflows for issue-to-PR work",
  description:
    "Open source workflow system for coding work. Turn issue tracker events, webhooks, releases, and other triggers into scoped, self-hosted workflows that run agents, open PRs, and clean up.",
  metadataBase: new URL("https://elasticclaw.ai"),
  openGraph: {
    title: "ElasticClaw — Workspaces and workflows for issue-to-PR work",
    description:
      "Turn issue tracker events into self-hosted agent workflows with scoped credentials, pull requests, and cleanup.",
    url: "https://elasticclaw.ai",
    siteName: "ElasticClaw",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ElasticClaw — Workspaces and workflows for issue-to-PR work",
    description:
      "Open source workflow system for coding agents: issue tracker triggers, workflow stages, scoped GitHub access, and self-hosted execution.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PlausibleAnalytics />
        {children}
      </body>
    </html>
  );
}
