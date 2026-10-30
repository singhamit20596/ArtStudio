#!/usr/bin/env node
/**
 * Prints the price catalogue (/price-catalogue) to catalogue/Art-Studio-Catalogue.pdf with headless Google Chrome.
 *
 *   npm run catalogue:pdf                       the site must be running (npm run preview)
 *   npm run catalogue:pdf -- --url http://localhost:3000/price-catalogue --out catalogue/Art-Studio-Catalogue.pdf
 *
 * Prices come from the site itself, so after changing prices (npm run catalogue:import) just run this again.
 * Set CHROME_PATH if Chrome is not in the usual place. Needs no npm packages.
 */
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function option(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const value = process.argv[i + 1];
  if (!value || value.startsWith("--")) fail(`--${name} needs a value.`);
  return value;
}

function fail(message) {
  console.error(`catalogue:pdf: ${message}`);
  process.exit(1);
}

const url = option("url", "http://localhost:3000/price-catalogue");
const out = resolve(ROOT, option("out", "catalogue/Art-Studio-Catalogue.pdf"));

const CHROME_PATHS = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);
const chrome = CHROME_PATHS.find((p) => existsSync(p));
if (!chrome) fail("Google Chrome was not found. Install it, or set CHROME_PATH to its program file.");

// 1. The page must be up (this also compiles it once under `next dev`, so Chrome gets it quickly).
let html;
try {
  const res = await fetch(url);
  html = await res.text();
  if (!res.ok) fail(`${url} answered ${res.status}. Open it in a browser to see the error.`);
} catch {
  fail(`Can't reach ${url}. Start the site first (npm run preview), or pass --url.`);
}
if (!html.includes('class="catalogue"')) fail(`${url} is not the price catalogue page.`);

// 2. Every photo must load, or the PDF would show empty frames.
const sources = [...new Set([...html.matchAll(/<img[^>]*?\ssrc="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&")))];
const missing = [];
await Promise.all(
  sources.map(async (src) => {
    const res = await fetch(new URL(src, url), { method: "HEAD" }).catch(() => null);
    if (!res?.ok) missing.push(src);
  }),
);
if (missing.length) fail(`These photos don't load:\n  ${missing.join("\n  ")}`);

const skipped = html.match(/data-skipped="([^"]*)"/)?.[1].trim();
if (skipped) console.log(`Left out (no photo yet): ${skipped.split(/\s+/).join(", ")}`);

// 3. Print. A fresh profile keeps this apart from any Chrome window that is open. The virtual time budget
//    lets fonts and photos finish loading before Chrome prints; @page in the page sets A4 with no margins.
mkdirSync(dirname(out), { recursive: true });
const profile = mkdtempSync(join(tmpdir(), "catalogue-pdf-"));
const temp = `${out}.part`;
try {
  await promisify(execFile)(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--hide-scrollbars",
      "--force-color-profile=srgb",
      `--user-data-dir=${profile}`,
      "--no-pdf-header-footer",
      "--generate-pdf-document-outline",
      `--print-to-pdf=${temp}`,
      "--virtual-time-budget=15000",
      url,
    ],
    { timeout: 120_000 },
  );
} catch (error) {
  rmSync(temp, { force: true });
  fail(`Chrome could not print the page: ${error.message}`);
} finally {
  rmSync(profile, { recursive: true, force: true });
}
if (!existsSync(temp) || statSync(temp).size === 0) fail("Chrome wrote no PDF.");
renameSync(temp, out);

const pdf = readFileSync(out, "latin1");
const pages = (pdf.match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
const mb = (statSync(out).size / 1024 / 1024).toFixed(1);
console.log(`Saved ${relative(ROOT, out)}: ${pages} pages, ${mb} MB.`);
