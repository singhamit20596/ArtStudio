import { getOrderWithToken } from "@/lib/orders/store";
import { bucket } from "@/lib/storage";

/** A customer's photo, only for someone holding that order's secret link (the buyer and the studio). */
export async function GET(request: Request, ctx: RouteContext<"/api/files/[...key]">) {
  const { key: parts } = await ctx.params;
  const key = parts.map(decodeURIComponent).join("/");
  const order = await getOrderWithToken(parts[0] ?? "", new URL(request.url).searchParams.get("t"));
  if (!order || !key.startsWith(`${order.id}/`)) return new Response("Not found", { status: 404 });

  const file = await bucket("uploads").getFile(key);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(file.data, {
    headers: { "Content-Type": file.contentType, "Cache-Control": "private, max-age=3600", "X-Content-Type-Options": "nosniff" },
  });
}
