import { site } from "@/config/site";

/**
 * The public address for links in emails, personalise links and photo links. On Netlify,
 * `request.url` is the deploy's own frozen address (abc123--site.netlify.app), which keeps
 * serving that old version after later deploys, so it comes last: first our site URL
 * (NEXT_PUBLIC_SITE_URL, set in netlify.toml), then Netlify's URL variable, then the host the
 * visitor used, then the request itself (on your computer).
 */
export function publicOrigin(request: Request) {
  const configured = site.url || process.env.URL;
  if (configured) return configured.replace(/\/+$/, "");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const requestUrl = new URL(request.url);
  if (host) return `${request.headers.get("x-forwarded-proto") ?? requestUrl.protocol.replace(":", "")}://${host}`;
  return requestUrl.origin;
}
