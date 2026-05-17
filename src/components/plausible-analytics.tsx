"use client";

import Script from "next/script";
import { PLAUSIBLE_DOMAIN } from "@/lib/analytics";

export function PlausibleAnalytics() {
  // Only load in production
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <Script
      data-domain={PLAUSIBLE_DOMAIN}
      data-api="/p/event"
      src="/p/script.js"
      strategy="afterInteractive"
    />
  );
}
