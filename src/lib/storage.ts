import { promises as fs } from "node:fs";
import path from "node:path";
import { getStore } from "@netlify/blobs";

/*
 * Durable storage for orders, personalisation details and customer photos.
 *
 * - On Netlify: Netlify Blobs (configured automatically on the deployed site).
 * - Anywhere else (npm run dev / preview / next start on your computer): files under .data/,
 *   which is git-ignored.
 *
 * Server-only. Phase 4 may move orders to a database; keep all access behind this module.
 */

export interface Bucket {
  getJSON<T>(key: string): Promise<T | null>;
  setJSON(key: string, value: unknown): Promise<void>;
  getFile(key: string): Promise<{ data: ArrayBuffer; contentType: string } | null>;
  setFile(key: string, data: ArrayBuffer, contentType: string): Promise<void>;
  list(prefix: string): Promise<string[]>;
}

const LOCAL_ROOT = path.join(process.cwd(), ".data", "store");
const safe = (key: string) => key.replace(/[^A-Za-z0-9._/-]/g, "_").replace(/\.\.+/g, ".");

function localBucket(name: string): Bucket {
  const dir = path.join(LOCAL_ROOT, name);
  const file = (key: string) => path.join(dir, safe(key));
  return {
    async getJSON<T>(key: string) {
      try {
        return JSON.parse(await fs.readFile(file(`${key}.json`), "utf8")) as T;
      } catch {
        return null;
      }
    },
    async setJSON(key, value) {
      await fs.mkdir(path.dirname(file(`${key}.json`)), { recursive: true });
      await fs.writeFile(file(`${key}.json`), JSON.stringify(value, null, 2), "utf8");
    },
    async getFile(key) {
      try {
        const [buf, meta] = await Promise.all([fs.readFile(file(key)), fs.readFile(file(`${key}.meta`), "utf8")]);
        return { data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer, contentType: meta };
      } catch {
        return null;
      }
    },
    async setFile(key, data, contentType) {
      await fs.mkdir(path.dirname(file(key)), { recursive: true });
      await fs.writeFile(file(key), Buffer.from(data));
      await fs.writeFile(file(`${key}.meta`), contentType, "utf8");
    },
    async list(prefix) {
      const walk = async (d: string): Promise<string[]> => {
        const entries = await fs.readdir(d, { withFileTypes: true }).catch(() => []);
        const out = await Promise.all(entries.map((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])));
        return out.flat();
      };
      return (await walk(dir))
        .map((f) => path.relative(dir, f).replace(/\.json$/, ""))
        .filter((k) => !k.endsWith(".meta") && k.startsWith(prefix));
    },
  };
}

function netlifyBucket(name: string): Bucket | null {
  let store: ReturnType<typeof getStore>;
  try {
    store = getStore({ name, consistency: "strong" });
  } catch {
    return null; // not running on Netlify
  }
  return {
    getJSON: <T,>(key: string) => store.get(key, { type: "json" }) as Promise<T | null>,
    async setJSON(key, value) {
      await store.setJSON(key, value);
    },
    async getFile(key) {
      const res = await store.getWithMetadata(key, { type: "arrayBuffer" });
      return res ? { data: res.data, contentType: String(res.metadata.contentType ?? "application/octet-stream") } : null;
    },
    async setFile(key, data, contentType) {
      await store.set(key, data, { metadata: { contentType } });
    },
    async list(prefix) {
      const { blobs } = await store.list({ prefix });
      return blobs.map((b) => b.key);
    },
  };
}

/** A named bucket ("orders", "uploads"): Netlify Blobs when deployed, .data/store/<name>/ locally. */
export function bucket(name: string): Bucket {
  return netlifyBucket(name) ?? localBucket(name);
}
