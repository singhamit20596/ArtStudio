// Post-processes `next build` static export (out/) into a portable preview:
//  - every asset URL becomes relative, so the folder works from any sub-path
//    (a static host, a file share, or the Claude artifact preview)
//  - the Turbopack runtime is told where its chunks live
//  - writes `artifact-shell.html` (a tiny page that opens site.html, a copy of
//    index.html) for hosts that wrap the entry page in their own <html> skeleton
//
// Usage: node scripts/relativize-export.mjs out
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const dir = process.argv[2] ?? "out";
const PUBLIC_DIRS = ["_next", "products", "instagram", "brand", "hero"];
const ROOT_FILES = ["icon.png", "apple-icon.png", "favicon.ico"];

function relativize(text) {
  let out = text;
  for (const d of PUBLIC_DIRS) {
    // "/_next/…"  '/_next/…'  (/_next/…)  \"/_next/…  and srcset-style ", /x"
    out = out.replace(new RegExp(`(["'(\\s,])/${d}/`, "g"), `$1./${d}/`);
  }
  for (const f of ROOT_FILES) {
    out = out.replace(new RegExp(`(["'(])/${f.replace(".", "\\.")}`, "g"), `$1./${f}`);
  }
  return out;
}

// Turbopack strips this prefix from each <script src> to identify chunks, so it must match the rewritten src.
const CHUNK_BASE = `<script>self.TURBOPACK_CHUNK_BASE_PATH="./_next/";</script>`;

function walk(d) {
  return readdirSync(d).flatMap((name) => {
    const p = join(d, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

// Image paths hard-coded in client components (e.g. the logo) live in the JS chunks.
function relativizeJs(text) {
  // Some hosts reject files containing a literal U+FFFD (it looks like broken encoding);
  // in the bundles it only appears inside string literals, where the escape is equivalent.
  let out = text.replace(/\uFFFD/g, "\\uFFFD");
  for (const d of PUBLIC_DIRS.filter((d) => d !== "_next")) {
    out = out.replace(new RegExp(`(["'\`])/${d}/`, "g"), `$1./${d}/`);
  }
  return out;
}

let changed = 0;
for (const file of walk(dir)) {
  const ext = extname(file);
  if (![".html", ".txt", ".css", ".js"].includes(ext)) continue;
  const src = readFileSync(file, "utf8");
  let next = ext === ".js" ? relativizeJs(src) : relativize(src);
  if (ext === ".html" && !next.includes("TURBOPACK_CHUNK_BASE_PATH=")) next = next.replace(/<head>/, `<head>${CHUNK_BASE}`);
  if (next !== src) {
    writeFileSync(file, next);
    changed++;
  }
}

// ---------------------------------------------------------------------------
// Fonts: hosts with a strict Content-Security-Policy (like the Claude artifact
// preview) only allow web fonts from Google Fonts. The preview therefore drops the
// self-hosted Poppins faces and loads the same family from Google Fonts; the CSS
// stack already names "poppins" first (family names are case-insensitive), with
// next/font's metric-matched "poppins Fallback" behind it.
const GOOGLE_FONTS =
  '<link rel="preconnect" href="https://fonts.googleapis.com"/>' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/>' +
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&amp;display=swap"/>';
for (const file of walk(join(dir, "_next/static/chunks")).filter((f) => f.endsWith(".css"))) {
  const css = readFileSync(file, "utf8");
  const stripped = css.replace(/@font-face\{font-family:(?:poppins|poppinsDevanagari);[^}]*\}/g, "");
  if (stripped !== css) writeFileSync(file, stripped);
}
for (const file of walk(dir).filter((f) => f.endsWith(".html"))) {
  const html = readFileSync(file, "utf8");
  let next = html.replace(/<link rel="preload" href="\.\/_next\/static\/media\/[^"]+\.woff2" as="font"[^>]*\/>/g, "");
  if (!next.includes("fonts.googleapis.com/css2")) next = next.replace("</head>", `${GOOGLE_FONTS}</head>`);
  if (next !== html) writeFileSync(file, next);
}

// ---------------------------------------------------------------------------
// Claude artifact preview. That host wraps the entry page in its own document
// skeleton, reserves top-level names starting with "_", redirects other files to
// content-addressed URLs and serves extra .html files as plain text. So the store
// is published under ARTIFACT_PREFIX as site.html, and the entry page loads it into
// the host's document (head nodes into <head>, body nodes into <body>, scripts
// re-created so they run), giving React the same structure as a normal page load.
const ARTIFACT_PREFIX = "store/";
writeFileSync(join(dir, "site.html"), readFileSync(join(dir, "index.html"), "utf8"));
const entry = `<title>Art Studio Storefront</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style id="shell-style">
  :root { color-scheme: light; }
  body { margin: 0; background: #111111; }
  #shell { min-height: 100vh; display: grid; place-items: center; text-align: center; padding-block: 24px;
           padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px));
           font: 14px/1.6 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #f8f4ed; }
  #shell img { width: 96px; height: 96px; border-radius: 50%; }
  #shell p { letter-spacing: .28em; text-transform: uppercase; font-size: 11px; color: #c7a879; margin: 20px 0 0; }
</style>
<div id="shell">
  <div>
    <img src="${ARTIFACT_PREFIX}brand/logo.png" alt="Art Studio, Art with Soul">
    <p id="shell-status">Opening the storefront preview</p>
  </div>
</div>
<script id="shell-loader">
(async function () {
  var status = document.getElementById("shell-status");
  try {
    var res = await fetch("${ARTIFACT_PREFIX}site.html");
    if (!res.ok) throw new Error("status " + res.status);
    var doc = new DOMParser().parseFromString(await res.text(), "text/html");
    var head = document.head, body = document.body, root = document.documentElement;

    // Resolve every relative URL in the store against the published prefix.
    var base = document.createElement("base");
    base.href = new URL("${ARTIFACT_PREFIX}", location.href).href;
    head.insertBefore(base, head.firstChild);

    // React hydrates <head> too: the store's own <title> must be the only one, so this
    // page's title (used for the artifact name) goes; its meta tags move to <head>.
    document.querySelectorAll("title").forEach(function (n) { n.remove(); });
    document.querySelectorAll("body > meta").forEach(function (n) { head.appendChild(n); });
    document.getElementById("shell").remove();
    document.getElementById("shell-style").remove();

    Array.prototype.forEach.call(doc.documentElement.attributes, function (a) { root.setAttribute(a.name, a.value); });
    Array.prototype.forEach.call(doc.body.attributes, function (a) { body.setAttribute(a.name, a.value); });

    Array.prototype.slice.call(doc.head.childNodes).forEach(function (n) {
      if (n.nodeName === "META" && (n.getAttribute("charset") || n.getAttribute("name") === "viewport")) return;
      head.appendChild(document.importNode(n, true));
    });
    // React matches body/head children exactly: stray whitespace or comments break hydration.
    [head, body].forEach(function (el) {
      Array.prototype.slice.call(el.childNodes).forEach(function (n) {
        if ((n.nodeType === 3 && !n.textContent.trim()) || n.nodeType === 8) n.remove();
      });
    });
    var loader = document.getElementById("shell-loader");
    Array.prototype.slice.call(doc.body.childNodes).forEach(function (n) {
      body.insertBefore(document.importNode(n, true), loader);
    });

    // Imported scripts never run, so swap each for a fresh copy (in document order).
    document.querySelectorAll("script:not(#shell-loader)").forEach(function (old) {
      var s = document.createElement("script");
      Array.prototype.forEach.call(old.attributes, function (a) { s.setAttribute(a.name, a.value); });
      if (old.src) s.async = old.hasAttribute("async");
      s.textContent = old.textContent;
      old.parentNode.replaceChild(s, old);
    });
    loader.remove();
  } catch (e) {
    status.textContent = "The preview could not load (" + e.message + "). Reload the page to try again.";
  }
})();
</script>
`;
writeFileSync(join(dir, "artifact-entry.html"), entry);

console.log(`relativize-export: rewrote ${changed} files in ${dir}/; fonts via Google Fonts; wrote site.html and artifact-entry.html`);
