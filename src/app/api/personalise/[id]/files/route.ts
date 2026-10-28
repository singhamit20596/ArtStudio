import { randomBytes } from "node:crypto";
import { needsPersonalising } from "@/lib/checkout";
import { getOrderWithToken } from "@/lib/orders/store";
import { fileUrl, MAX_FILE_BYTES, UPLOAD_TYPES } from "@/lib/personalise";
import { bucket } from "@/lib/storage";

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/heic": "heic", "image/heif": "heif" };

/** One photo for one piece of an order: POST multipart "file", with ?t=<token>&item=<index>. */
export async function POST(request: Request, ctx: RouteContext<"/api/personalise/[id]/files">) {
  const { id } = await ctx.params;
  const url = new URL(request.url);
  const order = await getOrderWithToken(id, url.searchParams.get("t"));
  if (!order) return Response.json({ ok: false, message: "This link doesn't match an order." }, { status: 404 });

  const index = Number(url.searchParams.get("item"));
  const item = Number.isInteger(index) ? order.items[index] : undefined;
  if (!item || !needsPersonalising(item)) return Response.json({ ok: false, message: "That piece doesn't need photos." }, { status: 400 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ ok: false, message: "No photo was sent." }, { status: 400 });
  if (!UPLOAD_TYPES.includes(file.type)) return Response.json({ ok: false, message: "Please upload a JPG, PNG, WebP or HEIC photo." }, { status: 415 });
  if (file.size > MAX_FILE_BYTES) return Response.json({ ok: false, message: "That photo is too large (5 MB at most)." }, { status: 413 });

  const key = `${order.id}/${index}/${randomBytes(8).toString("hex")}.${EXT[file.type]}`;
  await bucket("uploads").setFile(key, await file.arrayBuffer(), file.type);
  return Response.json({ ok: true, key, url: fileUrl(key, order.token!) });
}
