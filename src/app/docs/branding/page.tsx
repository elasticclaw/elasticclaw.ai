import type { Metadata } from "next";
import Link from "next/link";
import { DocsPage, CodeBlock, Note, Section } from "@/components/docs-page";

export const metadata: Metadata = { title: "Custom Branding" };

export default function BrandingPage() {
  return (
    <DocsPage
      title="Custom Branding"
      description="Customize the ElasticClaw Server web UI name and logo from hub.yaml."
    >
      <Section title="Overview">
        <p>
          ElasticClaw Server supports lightweight white-label branding through
          the <code>branding</code> block in <code>hub.yaml</code>. Branding is
          loaded by the web UI from the server and affects the product name shown
          in the page title and sidebar, plus the logo used in the agent
          conversation view.
        </p>
        <p>
          The branding endpoint is public so the login screen and embedded web
          UI can render the correct name before a user authenticates. It only
          returns the configured display fields.
        </p>
      </Section>

      <Section title="Configure hub.yaml">
        <p>
          Add a <code>branding</code> block to the same <code>hub.yaml</code>{" "}
          file that configures your server providers, auth, and model keys:
        </p>
        <CodeBlock lang="yaml">{`url: https://claw.example.com
public_url: https://claw.example.com
token: \${ELASTICCLAW_TOKEN}
claw_token: \${ELASTICCLAW_CLAW_TOKEN}

branding:
  app_name: Acme Agent Hub
  logo_url: https://assets.example.com/acme-agent-logo.png`}</CodeBlock>
        <div className="space-y-3 text-sm text-zinc-400">
          <p>
            <code className="text-cyan-300">app_name</code> replaces the
            default <code>ElasticClaw</code> label in the browser title and web
            UI navigation.
          </p>
          <p>
            <code className="text-cyan-300">logo_url</code> should point to an
            externally hosted image that the browser can load. It replaces the
            default ElasticClaw mascot in the conversation empty state.
          </p>
        </div>
      </Section>

      <Section title="Apply changes">
        <p>
          After changing <code>hub.yaml</code>, restart ElasticClaw Server so it
          reloads the file. For a server installed with the ElasticClaw
          installer, restart the service on the host:
        </p>
        <CodeBlock lang="bash">{`sudo systemctl restart elasticclaw`}</CodeBlock>
        <p>
          Then reload the web UI. The browser may keep the previous branding for
          the current page lifetime, so a normal page refresh is enough after the
          server restarts.
        </p>
      </Section>

      <Section title="Image guidance">
        <ul className="list-disc list-inside space-y-2 text-sm text-zinc-400">
          <li>Use an HTTPS URL that is reachable by users' browsers.</li>
          <li>Use PNG, SVG, or WebP for predictable browser rendering.</li>
          <li>Prefer a square or near-square image with transparent background.</li>
          <li>Keep the file small enough to load quickly on the login page.</li>
        </ul>
        <Note>
          The server stores the logo URL, not the image bytes. Host the image in
          your own static asset bucket, CDN, or application asset host.
        </Note>
      </Section>

      <Section title="Related configuration">
        <p>
          See{" "}
          <Link href="/docs/hub" className="text-cyan-400 hover:underline">
            Server Config
          </Link>{" "}
          for the full <code>hub.yaml</code> field reference and{" "}
          <Link
            href="/docs/authentication"
            className="text-cyan-400 hover:underline"
          >
            Authentication
          </Link>{" "}
          for login and access control settings.
        </p>
      </Section>
    </DocsPage>
  );
}
