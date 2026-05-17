"use client";

import Script from "next/script";

const PLAUSIBLE_DOMAIN = "elasticclaw.ai";

export function PlausibleAnalytics() {
  // Only load in production
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <Script
      defer
      data-domain={PLAUSIBLE_DOMAIN}
      data-api="/p/event"
      src="/p/script.js"
      strategy="afterInteractive"
    />
  );
}
