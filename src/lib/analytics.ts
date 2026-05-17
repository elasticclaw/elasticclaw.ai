export function trackEvent(
  eventName: string,
  props?: Record<string, string | number>
) {
  if (
    process.env.NODE_ENV === "production" &&
    typeof window !== "undefined" &&
    "plausible" in window
  ) {
    const plausible = window.plausible as (
      eventName: string,
      options?: { props?: Record<string, string | number> }
    ) => void;

    plausible(eventName, { props });
  }
}
