import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ElasticClaw — Provision AI agents. Ship faster.",
  description:
    "Open source platform for provisioning AI agents as ephemeral VMs. Each agent has its own environment, git access, and terminal.",
  openGraph: {
    title: "ElasticClaw",
    description: "Provision AI agents. Ship faster.",
    url: "https://elasticclaw.ai",
    siteName: "ElasticClaw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
