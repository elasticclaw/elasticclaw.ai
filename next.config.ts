import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // First-party Plausible proxy (avoids ad blockers)
      {
        source: "/p/script.js",
        destination: "https://plausible.machination.dev/js/script.js",
      },
      {
        source: "/p/event",
        destination: "https://plausible.machination.dev/api/event",
      },
    ];
  },
};

export default nextConfig;
