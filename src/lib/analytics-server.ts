import { PLAUSIBLE_DOMAIN } from "./analytics";

export async function trackServerEvent(
  eventName: string,
  url: string,
  props?: Record<string, string | number>,
  visitorIp?: string
) {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  try {
    await fetch("https://plausible.machination.dev/api/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "elasticclaw.ai/1.0",
        ...(visitorIp ? { "X-Forwarded-For": visitorIp } : {}),
      },
      body: JSON.stringify({
        domain: PLAUSIBLE_DOMAIN,
        name: eventName,
        url,
        props,
      }),
    });
  } catch (error) {
    console.error("Failed to track event:", error);
  }
}
