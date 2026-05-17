export async function trackServerEvent(
  domain: string,
  eventName: string,
  url: string,
  props?: Record<string, string | number>
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
      },
      body: JSON.stringify({
        domain,
        name: eventName,
        url,
        props,
      }),
    });
  } catch (error) {
    console.error("Failed to track event:", error);
  }
}
