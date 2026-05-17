import type { Metadata } from "next";
import "./globals.css";
import { PlausibleAnalytics } from "@/components/plausible-analytics";

export const metadata: Metadata = {
  title: "ElasticClaw — Self-hosted issue-to-PR agents",
  description:
    "Open source control plane for self-hosted coding agents. Turn Linear, GitHub Issues, or Shortcut tickets into isolated sandboxes that open pull requests.",
  metadataBase: new URL("https://elasticclaw.ai"),
  openGraph: {
    title: "ElasticClaw — Self-hosted issue-to-PR agents",
    description:
      "Turn issue tracker events into isolated AI agent sandboxes that implement work, open PRs, and shut down cleanly.",
    url: "https://elasticclaw.ai",
    siteName: "ElasticClaw",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ElasticClaw — Self-hosted issue-to-PR agents",
    description:
      "Open source control plane for coding agents with real sandboxes, GitHub access, and issue tracker automation.",
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
