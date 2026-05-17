interface Window {
  plausible?: (
    eventName: string,
    options?: { props?: Record<string, string | number> }
  ) => void;
}
